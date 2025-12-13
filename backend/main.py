from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from extraction import (
    extract_from_pdf,
    extract_from_docx,
    extract_from_txt,
    extract_from_url,
    extract_from_image
)

from model_fakenews import predict_text

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# -------------------------
# Request Models
# -------------------------
class TextRequest(BaseModel):
    article: str

class UrlRequest(BaseModel):
    url: str


# -------------------------
# Endpoints
# -------------------------

@app.post("/predict")
async def predict_article(body: TextRequest):
    title = body.article[:50]
    text = body.article

    pred = predict_text(text)

    return {
        "title": title,
        "text": text,
        "prediction": pred["prediction"],
        "confidence": pred["confidence"],
        "label": None,
        "counterArgument": pred["counterArgument"]
    }


@app.post("/predict-file")
async def predict_file(file: UploadFile = File(...)):
    filename = file.filename.lower()

    if filename.endswith(".pdf"):
        title, text = await extract_from_pdf(file)

    elif filename.endswith(".docx"):
        title, text = await extract_from_docx(file)

    elif filename.endswith(".txt"):
        title, text = await extract_from_txt(file)

    elif filename.endswith((".png", ".jpg", ".jpeg")):
        title, text = await extract_from_image(file)

    else:
        return {"error": "Unsupported file type"}

    pred = predict_text(text)

    return {
        "title": title,
        "text": text,
        "prediction": pred["prediction"],
        "confidence": pred["confidence"],
        "label": None,
        "counterArgument": pred["counterArgument"]
    }


@app.post("/predict-url")
async def predict_url(body: UrlRequest):
    title, text = extract_from_url(body.url)

    pred = predict_text(text)

    return {
        "title": title,
        "text": text,
        "prediction": pred["prediction"],
        "confidence": pred["confidence"],
        "label": None,
        "counterArgument": pred["counterArgument"]
    }
