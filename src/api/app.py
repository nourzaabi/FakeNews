# src/api/app.py
from fastapi import FastAPI
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
import time

from src.utils.logging_utils import log_prediction
from src.core.config import settings
from src.core.generator import CounterArgGenerator

app = FastAPI(title="Counter-Argumentation Service", version="1.0")

gen = CounterArgGenerator()

# ✅ RAG placeholder (disabled by default)
# If later you implement RAG, replace this with your real rag object.
rag = None


class GenerateRequest(BaseModel):
    text: str = Field(..., description="The claim / fake-news text")
    label: Optional[str] = Field(None, description="Optional: Fake/Real from your classifier")
    confidence: Optional[float] = Field(None, description="Optional: classifier confidence")


class GenerateResponse(BaseModel):
    counter_argument: str
    used_rag: bool
    sources: List[Dict[str, Any]]
    passthrough: Dict[str, Any]


@app.post("/generate-counter", response_model=GenerateResponse)
def generate_counter(req: GenerateRequest):
    # ✅ Guard (only generate counter-args if Fake)
    if req.label is not None and req.label.lower() != "fake":
        # log this request too (monitoring)
        log_prediction({
            "latency_ms": 0.0,
            "model_name": getattr(settings, "MODEL_NAME", "unknown"),
            "input_len": len(req.text or ""),
            "output_len": 0,
            "used_rag": False,
            "success": True,
            "note": "skipped_generation_not_fake",
        })

        return GenerateResponse(
            counter_argument="No counter-argument generated because the content was not labeled as FAKE.",
            used_rag=False,
            sources=[],
            passthrough={"label": req.label, "confidence": req.confidence},
        )

    # ✅ RAG retrieval (currently disabled)
    retrieved = []
    if rag is not None and getattr(settings, "USE_RAG", False):
        retrieved = rag.retrieve(req.text, top_k=getattr(settings, "TOP_K", 4))

    # ✅ Measure latency + structured log
    t0 = time.perf_counter()
    ok = True
    err = None

    try:
        # IMPORTANT: your generator signature is generate(claim=..., label=..., retrieved=...)
        result = gen.generate(claim=req.text, label=req.label or "fake", retrieved=retrieved)
    except Exception as e:
        ok = False
        err = str(e)
        result = {"counter_argument": "", "used_rag": False, "sources": []}

    latency_ms = (time.perf_counter() - t0) * 1000.0
    ca = (result.get("counter_argument") or "").strip()

    log_prediction({
        "latency_ms": latency_ms,
        "model_name": getattr(settings, "MODEL_NAME", "unknown"),
        "input_len": len(req.text or ""),
        "output_len": len(ca),
        "used_rag": bool(result.get("used_rag", False)),
        "success": ok,
        **({"error": err} if err else {}),
    })

    return GenerateResponse(
        counter_argument=ca if ok else "Error during generation.",
        used_rag=bool(result.get("used_rag", False)),
        sources=result.get("sources", []),
        passthrough={"label": req.label, "confidence": req.confidence},
    )


@app.get("/health")
def health():
    return {"ok": True, "model": settings.MODEL_NAME, "use_rag": settings.USE_RAG}
