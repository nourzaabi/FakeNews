import os
import cv2
import numpy as np

# Set TF logs to error only
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"

import tensorflow as tf

# ---------------------------------------------------------
# CRITICAL: HIDE GPU FROM TENSORFLOW (Preserve it for PyTorch)
# ---------------------------------------------------------
try:
    # List all physical GPUs
    gpus = tf.config.list_physical_devices('GPU')
    if gpus:
        # Restrict TensorFlow to use ONLY the CPU
        tf.config.set_visible_devices([], 'GPU')
        print("✅ TensorFlow forced to run on CPU (GPU hidden).")
except Exception as e:
    print(f"⚠️ Failed to hide GPU from TensorFlow: {e}")

# Explicitly disable JIT compilation to avoid XLA errors
tf.config.optimizer.set_jit(False)
from tensorflow.keras.models import load_model
from tensorflow.keras.applications.efficientnet import preprocess_input
import tempfile

# Path configuration
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
MODEL_PATH = os.path.join(BASE_DIR, "models", "Final_DeepFake_Detector_85acc.h5")

_model = None

def get_model():
    global _model
    if _model is None:
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(f"Model file not found at {MODEL_PATH}")
        print(f"Loading DeepFake model from {MODEL_PATH}...")
        _model = load_model(MODEL_PATH)
        print("DeepFake model loaded successfully.")
    return _model

def preprocess_frame(frame, target_size=(224, 224)):
    """
    Prepares a frame for the EfficientNet model.
    1. Converts BGR to RGB.
    2. Resizes to target size.
    3. Converts to float32.
    4. Applies EfficientNet preprocessing.
    """
    # BGR is kept as model was trained on BGR (standard cv2.imread)
    # rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB) # Reverted to BGR
    
    # FACE DETECTION
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    
    # Lower constraints to detect faces in varied conditions
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
    
    processed_frame = frame
    face_detected = False
    
    if len(faces) > 0:
        # Find largest face
        max_area = 0
        largest_face = None
        for (x, y, w, h) in faces:
            if w * h > max_area:
                max_area = w * h
                largest_face = (x, y, w, h)
        
        # Crop face with padding
        x, y, w, h = largest_face
        padding = int(0.2 * w) 
        h_img, w_img, _ = frame.shape
        
        x1 = max(0, x - padding)
        y1 = max(0, y - padding)
        x2 = min(w_img, x + w + padding)
        y2 = min(h_img, y + h + padding)
        
        processed_frame = frame[y1:y2, x1:x2]
        face_detected = True
        print(f"DEBUG: Face detected and cropped. Region: {x1}:{x2}, {y1}:{y2}")
    else:
        print("DEBUG: No face detected. Using full image.")
    
    # Resize
    resized_frame = cv2.resize(processed_frame, target_size)
    
    # Preprocess
    img_array = np.array(resized_frame, dtype=np.float32)
    img_preprocessed = preprocess_input(img_array)
    img_batch = np.expand_dims(img_preprocessed, axis=0)
    
    return img_batch

def predict_image(file_bytes):
    """
    Predicts if an image is Real or Fake.
    """
    # Decode image
    nparr = np.frombuffer(file_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    if img is None:
        return {"error": "Could not decode image"}
    
    model = get_model()
    input_tensor = preprocess_frame(img)
    
    # Predict
    prediction = model.predict(input_tensor)
    score = float(prediction[0][0]) # Sigmoid output
    
    print(f"DEBUG: Prediction Raw Score: {score}")
    
    return format_result(score)

def predict_video(file_path):
    """
    Predicts if a video is Real or Fake by averaging predictions on frames.
    """
    cap = cv2.VideoCapture(file_path)
    if not cap.isOpened():
        return {"error": "Could not open video file"}
        
    frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    if frame_count == 0:
        return {"error": "Video has no frames"}
        
    # Sample frames (e.g. 10 frames distributed evenly)
    num_frames_to_sample = 15
    skip = max(1, frame_count // num_frames_to_sample)
    
    processed_frames = 0
    scores = []
    
    model = get_model()
    
    current_frame = 0
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
            
        if current_frame % skip == 0:
            input_tensor = preprocess_frame(frame)
            pred = model.predict(input_tensor, verbose=0)
            scores.append(float(pred[0][0]))
            
            if len(scores) >= num_frames_to_sample:
                break
                
        current_frame += 1
        
    cap.release()
    
    if not scores:
         return {"error": "No frames analyzed"}
         
    # Average score
    avg_score = np.mean(scores)
    return format_result(avg_score)

def format_result(score):
    # 0 = REAL, 1 = FAKE
    # If score > 0.5 => Fake
    
    label = "Fake" if score > 0.5 else "Real"
    
    # Calculate confidence (distance from 0.5)
    # If score is 0.9 => 90% Fake? Or 90% confidence? 
    # Usually confidence = score if Fake, 1-score if Real.
    if label == "Fake":
        confidence = score * 100
    else:
        confidence = (1 - score) * 100
        
    return {
        "prediction": label,
        "confidence": round(confidence, 2),
        "raw_score": score
    }
