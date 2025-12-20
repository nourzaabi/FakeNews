from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from extraction import (
    extract_from_pdf,
    extract_from_docx,
    extract_from_txt,
    extract_from_url,
    extract_from_image
)

from model_fakenews.model_fakenews import predict_text, analyze_text_features
from CounterArg_Service.generator import CounterArgGenerator

# Initialize the Generator (global load)
print("Loading CounterArg Generator...")
counter_gen = CounterArgGenerator()
print("CounterArg Generator loaded.")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class TextRequest(BaseModel):
    article: str

class UrlRequest(BaseModel):
    url: str


# ---------------------------------------------------
# TEXT PREDICTION (CORRECT)
# ---------------------------------------------------
@app.post("/predict")
async def predict_article(body: TextRequest):
    pred = predict_text(body.article)
    features = analyze_text_features(body.article)

    # Generate AI explanation/counter-argument
    try:
        explanation = counter_gen.generate(body.article, label=pred["prediction"])
        real_counter_arg = explanation["counter_argument"]
    except Exception as e:
        print(f"Generation failed: {e}")
        real_counter_arg = pred["counterArgument"]

    return {
        "text": body.article,
        "prediction": pred["prediction"],
        "confidence": pred["confidence"],
        "counterArgument": real_counter_arg,
        "analysis": features,
    }


# ---------------------------------------------------
# FILE PREDICTION (BUG FIXED)
# ---------------------------------------------------
@app.post("/predict-file")
async def predict_file(file: UploadFile = File(...)):
    filename = file.filename.lower()

    # Sélection du bon extracteur
    if filename.endswith(".pdf"):
        title, text = await extract_from_pdf(file)

    elif filename.endswith(".docx"):
        title, text = await extract_from_docx(file)

    elif filename.endswith(".txt"):
        title, text = await extract_from_txt(file)

    elif filename.endswith((".png", ".jpg", ".jpeg")):
        title, text = await extract_from_image(file)

    else:
        return {"error": "Unsupported file type."}

    # Prédiction
    pred = predict_text(text)
    features = analyze_text_features(text)

    # Generate AI explanation/counter-argument
    try:
        explanation = counter_gen.generate(text, label=pred["prediction"])
        real_counter_arg = explanation["counter_argument"]
    except Exception as e:
        print(f"Generation failed: {e}")
        real_counter_arg = pred["counterArgument"]

    return {
        "text": text,
        "prediction": pred["prediction"],
        "confidence": pred["confidence"],
        "counterArgument": real_counter_arg,
        "analysis": features,
    }


# ---------------------------------------------------
# URL PREDICTION (SAFE)
# ---------------------------------------------------
@app.post("/predict-url")
async def predict_url(body: UrlRequest):
    title, text = extract_from_url(body.url)

    pred = predict_text(text)
    features = analyze_text_features(text)

    # Generate AI explanation/counter-argument
    try:
        explanation = counter_gen.generate(text, label=pred["prediction"])
        real_counter_arg = explanation["counter_argument"]
    except Exception as e:
        print(f"Generation failed: {e}")
        real_counter_arg = pred["counterArgument"]

    return {
        "text": text,
        "prediction": pred["prediction"],
        "confidence": pred["confidence"],
        "counterArgument": real_counter_arg,
        "analysis": features,
    }


# ---------------------------------------------------
# DEEPFAKE PREDICTION
# ---------------------------------------------------
from model_deepfake.deepfake_detector import predict_image, predict_video
import shutil
import tempfile
import os

@app.post("/predict-deepfake")
async def predict_deepfake(file: UploadFile = File(...)):
    filename = file.filename.lower()
    
    # Image
    if filename.endswith((".png", ".jpg", ".jpeg", ".webp")):
        contents = await file.read()
        result = predict_image(contents)
        return result
        
    # Video
    elif filename.endswith((".mp4", ".mov", ".avi", ".mkv")):
        # Save to temp file
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(filename)[1]) as tmp:
            shutil.copyfileobj(file.file, tmp)
            tmp_path = tmp.name
            
        try:
            result = predict_video(tmp_path)
            return result
        finally:
            # Cleanup
            if os.path.exists(tmp_path):
                os.remove(tmp_path)
    
    else:
        return {"error": "Unsupported file type. Please upload an image or video."}
