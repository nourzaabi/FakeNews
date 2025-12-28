from fastapi import FastAPI
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

from src.core.config import settings
from src.core.generator import CounterArgGenerator


app = FastAPI(title="Counter-Argumentation Service", version="1.0")

gen = CounterArgGenerator()
# rag = SimpleRAG(settings.KB_PATH) if settings.USE_RAG else None

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
    # If you only want counter-args when Fake, keep this guard.
    # Otherwise remove it.
    if req.label is not None and req.label.lower() != "fake":
        return GenerateResponse(
            counter_argument="No counter-argument generated because the content was not labeled as FAKE.",
            used_rag=False,
            sources=[],
            passthrough={"label": req.label, "confidence": req.confidence},
        )

    retrieved = []
    if rag is not None:
        retrieved = rag.retrieve(req.text, top_k=settings.TOP_K)

    result = gen.generate(req.text, retrieved=retrieved)

    return GenerateResponse(
        counter_argument=result["counter_argument"],
        used_rag=result["used_rag"],
        sources=result["sources"],
        passthrough={"label": req.label, "confidence": req.confidence},
    )

@app.get("/health")
def health():
    return {"ok": True, "model": settings.MODEL_NAME, "use_rag": settings.USE_RAG}
