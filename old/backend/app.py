from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename
import PyPDF2
import docx
import requests
from bs4 import BeautifulSoup
import re

# Import your ML model functions here
# from model import predict_news, generate_counter_argument

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx', 'txt'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Create uploads folder if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def extract_text_from_pdf(file_path):
    """Extract text from PDF file"""
    text = ""
    try:
        with open(file_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            for page in pdf_reader.pages:
                text += page.extract_text()
    except Exception as e:
        print(f"Error extracting PDF: {e}")
    return text

def extract_text_from_docx(file_path):
    """Extract text from Word document"""
    text = ""
    try:
        doc = docx.Document(file_path)
        for paragraph in doc.paragraphs:
            text += paragraph.text + "\n"
    except Exception as e:
        print(f"Error extracting DOCX: {e}")
    return text

def extract_text_from_txt(file_path):
    """Extract text from text file"""
    text = ""
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            text = file.read()
    except Exception as e:
        print(f"Error extracting TXT: {e}")
    return text

def extract_text_from_url(url):
    """Extract article text from URL"""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Remove script and style elements
        for script in soup(["script", "style", "nav", "footer", "header"]):
            script.decompose()
        
        # Get text from article tags or paragraphs
        article = soup.find('article')
        if article:
            text = article.get_text()
        else:
            paragraphs = soup.find_all('p')
            text = ' '.join([p.get_text() for p in paragraphs])
        
        # Clean up text
        text = re.sub(r'\s+', ' ', text).strip()
        return text
    except Exception as e:
        print(f"Error extracting from URL: {e}")
        return None

def predict_article(text):
    """
    Replace this with your actual ML model prediction
    This is a placeholder function
    """
    # TODO: Load your trained BERT model and make prediction
    # Example:
    # prediction = model.predict(text)
    # confidence = model.predict_proba(text).max() * 100
    
    # Placeholder response
    import random
    is_fake = random.choice([True, False])
    confidence = random.randint(70, 95)
    
    return {
        'prediction': 'Fake News' if is_fake else 'Real News',
        'confidence': confidence
    }

def generate_counter_argument(text):
    """
    Replace this with your actual Llama model for counter-arguments
    This is a placeholder function
    """
    # TODO: Use your Llama model to generate counter-argument
    # Example:
    # counter_arg = llama_model.generate(text)
    
    # Placeholder response
    return "This article contains misleading information. Please verify the facts with multiple reliable sources before sharing."

@app.route('/predict', methods=['POST'])
def predict_text():
    """Handle text input prediction"""
    try:
        data = request.get_json()
        article = data.get('article', '')
        
        if not article or not article.strip():
            return jsonify({'error': 'No article text provided'}), 400
        
        # Make prediction
        result = predict_article(article)
        
        # Generate counter-argument if fake news
        if result['prediction'] == 'Fake News':
            result['counterArgument'] = generate_counter_argument(article)
        
        return jsonify(result)
    
    except Exception as e:
        print(f"Error in predict_text: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/predict-file', methods=['POST'])
def predict_file():
    """Handle file upload prediction"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': 'Invalid file type'}), 400
        
        # Save file
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        
        # Extract text based on file type
        file_ext = filename.rsplit('.', 1)[1].lower()
        
        if file_ext == 'pdf':
            text = extract_text_from_pdf(file_path)
        elif file_ext in ['doc', 'docx']:
            text = extract_text_from_docx(file_path)
        elif file_ext == 'txt':
            text = extract_text_from_txt(file_path)
        else:
            return jsonify({'error': 'Unsupported file type'}), 400
        
        # Clean up - delete file after processing
        os.remove(file_path)
        
        if not text or not text.strip():
            return jsonify({'error': 'Could not extract text from file'}), 400
        
        # Make prediction
        result = predict_article(text)
        
        # Generate counter-argument if fake news
        if result['prediction'] == 'Fake News':
            result['counterArgument'] = generate_counter_argument(text)
        
        return jsonify(result)
    
    except Exception as e:
        print(f"Error in predict_file: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/predict-url', methods=['POST'])
def predict_url():
    """Handle URL input prediction"""
    try:
        data = request.get_json()
        url = data.get('url', '')
        
        if not url or not url.strip():
            return jsonify({'error': 'No URL provided'}), 400
        
        # Extract text from URL
        text = extract_text_from_url(url)
        
        if not text or not text.strip():
            return jsonify({'error': 'Could not extract text from URL'}), 400
        
        # Make prediction
        result = predict_article(text)
        
        # Generate counter-argument if fake news
        if result['prediction'] == 'Fake News':
            result['counterArgument'] = generate_counter_argument(text)
        
        return jsonify(result)
    
    except Exception as e:
        print(f"Error in predict_url: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'message': 'Unmask API is running'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
