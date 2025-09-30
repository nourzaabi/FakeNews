from flask import Flask, render_template, request, jsonify, send_from_directory
import os

app = Flask(__name__, static_folder='build/static', template_folder='build')

@app.route('/')
def index():
    """Serve the React app."""
    return render_template('index.html')

@app.route('/api/health')
def health():
    """Health check endpoint."""
    return jsonify({"status": "healthy", "message": "Fake News Detection API is running"})

@app.route('/api/predict', methods=['POST'])
def predict():
    """Predict if text is fake news."""
    try:
        data = request.get_json()
        if not data or 'text' not in data:
            return jsonify({"error": "Text is required"}), 400
        
        text = data['text']
        if not text.strip():
            return jsonify({"error": "Text cannot be empty"}), 400
        
        # Mock prediction (replace with actual model)
        prediction = "Fake News" if len(text) > 100 else "Real News"
        confidence = 0.85 if prediction == "Fake News" else 0.75
        
        result = {
            "prediction": prediction,
            "confidence": confidence,
            "text_length": len(text)
        }
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({"error": "Internal server error"}), 500

@app.route('/api/predict-file', methods=['POST'])
def predict_file():
    """Predict if uploaded file contains fake news."""
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file provided"}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400
        
        # Mock prediction (replace with actual model)
        prediction = "Fake News"
        confidence = 0.80
        
        result = {
            "prediction": prediction,
            "confidence": confidence,
            "filename": file.filename
        }
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({"error": "Internal server error"}), 500

@app.route('/api/predict-url', methods=['POST'])
def predict_url():
    """Predict if URL content is fake news."""
    try:
        data = request.get_json()
        if not data or 'url' not in data:
            return jsonify({"error": "URL is required"}), 400
        
        url = data['url']
        if not url.strip():
            return jsonify({"error": "URL cannot be empty"}), 400
        
        # Mock prediction (replace with actual model)
        prediction = "Real News"
        confidence = 0.70
        
        result = {
            "prediction": prediction,
            "confidence": confidence,
            "url": url
        }
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
