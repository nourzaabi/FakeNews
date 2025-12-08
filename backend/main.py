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

    return {
        "text": body.article,
        "prediction": pred["prediction"],
        "confidence": pred["confidence"],
        "counterArgument": pred["counterArgument"],
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

    return {
        "text": text,
        "prediction": pred["prediction"],
        "confidence": pred["confidence"],
        "counterArgument": pred["counterArgument"],
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

    return {
        "text": text,
        "prediction": pred["prediction"],
        "confidence": pred["confidence"],
        "counterArgument": pred["counterArgument"],
        "analysis": features,
    }
