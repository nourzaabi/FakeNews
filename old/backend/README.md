# Unmask Flask Backend

This is the Flask backend API for the Unmask fake news detection application.

## Setup Instructions

### 1. Create a Virtual Environment

\`\`\`bash
cd backend
python -m venv venv
\`\`\`

### 2. Activate Virtual Environment

**Windows:**
\`\`\`bash
venv\Scripts\activate
\`\`\`

**Mac/Linux:**
\`\`\`bash
source venv/bin/activate
\`\`\`

### 3. Install Dependencies

\`\`\`bash
pip install -r requirements.txt
\`\`\`

### 4. Add Your ML Models

Replace the placeholder functions in `app.py`:

- `predict_article(text)` - Add your BERT model prediction logic
- `generate_counter_argument(text)` - Add your Llama model for counter-arguments

### 5. Run the Server

\`\`\`bash
python app.py
\`\`\`

The server will start on `http://localhost:5000`

## API Endpoints

### POST /predict
Analyze text input for fake news detection.

**Request Body:**
\`\`\`json
{
  "article": "Your news article text here..."
}
\`\`\`

**Response:**
\`\`\`json
{
  "prediction": "Fake News" or "Real News",
  "confidence": 85,
  "counterArgument": "Counter-argument text (only for fake news)"
}
\`\`\`

### POST /predict-file
Analyze uploaded file (PDF, Word, or Text).

**Request:** multipart/form-data with file field

**Response:** Same as /predict

### POST /predict-url
Analyze article from URL.

**Request Body:**
\`\`\`json
{
  "url": "https://example.com/article"
}
\`\`\`

**Response:** Same as /predict

### GET /health
Health check endpoint.

**Response:**
\`\`\`json
{
  "status": "healthy",
  "message": "Unmask API is running"
}
\`\`\`

## Integration with Your ML Models

1. Load your trained BERT model in the `predict_article()` function
2. Load your Llama model in the `generate_counter_argument()` function
3. Update the prediction logic to use your actual models
4. Adjust confidence calculation based on your model's output

## CORS Configuration

CORS is enabled for all origins. In production, update the CORS settings to only allow your frontend domain:

\`\`\`python
CORS(app, resources={r"/*": {"origins": "https://your-frontend-domain.com"}})
\`\`\`

## File Upload Limits

- Maximum file size: 16MB
- Allowed file types: PDF, DOC, DOCX, TXT

Adjust these in `app.py` if needed.
