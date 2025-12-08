import os
import torch
import numpy as np
import re
from transformers import RobertaTokenizer, RobertaForSequenceClassification

# ---------------------------------------------------------
# LOAD LOCAL MODEL
# ---------------------------------------------------------

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.dirname(CURRENT_DIR)
ROOT_DIR = os.path.dirname(BACKEND_DIR)
MODEL_PATH = os.path.join(ROOT_DIR, "best_roberta_model")

print("Loading local RoBERTa model from:", MODEL_PATH)

tokenizer = RobertaTokenizer.from_pretrained(MODEL_PATH, local_files_only=True)
model = RobertaForSequenceClassification.from_pretrained(MODEL_PATH, local_files_only=True)
model.eval()


# ---------------------------------------------------------
# FIXED LABEL INTERPRETATION  (IMPORTANT 🔥)
# Your model returns:
# 0 = REAL
# 1 = FAKE
# ---------------------------------------------------------
def predict_text(text: str):
    """Predict whether the news is real or fake using RoBERTa."""

    if not text or text.strip() == "":
        return {
            "prediction": "Unknown",
            "confidence": 0,
            "counterArgument": "No text provided."
        }

    inputs = tokenizer(
        text,
        truncation=True,
        padding=True,
        max_length=256,
        return_tensors="pt"
    )

    with torch.no_grad():
        outputs = model(**inputs)

    logits = outputs.logits
    probs = torch.softmax(logits, dim=1).numpy()[0]

    pred_label = int(np.argmax(probs))   # 0 or 1
    confidence = round(float(probs[pred_label] * 100), 2)

    # 🔥 CORRECT LABEL INTERPRETATION
    if pred_label == 0:
        # MODEL SAYS : REAL NEWS
        return {
            "prediction": "Real News",
            "confidence": confidence,
            "counterArgument": "Aucune anomalie majeure détectée."
        }

    else:
        # MODEL SAYS : FAKE NEWS
        return {
            "prediction": "Fake News",
            "confidence": confidence,
            "counterArgument": (
                "Indice élevé de désinformation. "
                "Vérifiez cette information avec des sources fiables (Reuters, AP News, etc.)."
            )
        }


# ---------------------------------------------------------
# ADVANCED TEXT ANALYSIS (no external libs)
# ---------------------------------------------------------

SENSATIONAL_WORDS = [
    "shocking", "unbelievable", "breaking", "alert", "secret",
    "exposed", "revealed", "scandal", "crisis", "urgent"
]

POLITICAL_WORDS = [
    "trump", "clinton", "president", "senate", "government",
    "campaign", "election", "republican", "democrat", "white house"
]


def analyze_text_features(text: str):
    """Extra scoring to enrich the output (sensationalism, bias, sentiment, complexity)."""

    t = text.lower()

    # Sensationalism
    sensational_score = min(100, sum(w in t for w in SENSATIONAL_WORDS) * 12)

    # Political context detection
    political_score = min(100, sum(w in t for w in POLITICAL_WORDS) * 10)

    # Simple sentiment approximation
    positive_words = ["good", "success", "progress"]
    negative_words = ["bad", "crisis", "danger"]

    pos_hits = sum(w in t for w in positive_words)
    neg_hits = sum(w in t for w in negative_words)

    sentiment_score = max(0, min(100, (pos_hits - neg_hits + 2) * 25))

    # Complexity score
    words = re.findall(r"\w+", text)
    avg_len = sum(len(w) for w in words) / max(len(words), 1)
    complexity_score = min(100, avg_len * 12)

    return {
        "sensationalism": sensational_score,
        "political_bias": political_score,
        "sentiment": sentiment_score,
        "complexity": int(complexity_score),
    }
