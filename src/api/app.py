# src/api/app.py
from fastapi import FastAPI
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
import time
import json
from pathlib import Path

import mlflow

from src.utils.mlflow_utils import (
    set_experiment,
    log_params,
    log_metrics,
    log_json,
)
from src.utils.logging_utils import log_prediction
from src.core.config import settings
from src.core.generator import CounterArgGenerator

app = FastAPI(title="Counter-Argumentation Service", version="1.0")

gen = CounterArgGenerator()

# ✅ RAG placeholder (disabled by default)
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


def _cfg_snapshot() -> Dict[str, Any]:
    """Small config snapshot for MLflow params/artifacts."""
    return {
        "MODEL_NAME": getattr(settings, "MODEL_NAME", None),
        "DEVICE_MAP": getattr(settings, "DEVICE_MAP", None),
        "QUANT": getattr(settings, "QUANT", None),
        "MAX_NEW_TOKENS": getattr(settings, "MAX_NEW_TOKENS", None),
        "TEMPERATURE": getattr(settings, "TEMPERATURE", None),
        "TOP_P": getattr(settings, "TOP_P", None),
        "USE_RAG": getattr(settings, "USE_RAG", None),
        "TOP_K": getattr(settings, "TOP_K", None),
    }


@app.post("/generate-counter", response_model=GenerateResponse)
def generate_counter(req: GenerateRequest):
    # Ensure reports dir exists (for optional local json artifacts)
    Path("artifacts/reports").mkdir(parents=True, exist_ok=True)

    # ✅ Always use the correct experiment
    set_experiment("llm_inference")

    # ✅ Prepare cfg params
    cfg = _cfg_snapshot()

    # ✅ Guard (only generate counter-args if Fake)
    if req.label is not None and req.label.lower() != "fake":
        # local structured log
        log_prediction({
            "latency_ms": 0.0,
            "model_name": getattr(settings, "MODEL_NAME", "unknown"),
            "input_len": len(req.text or ""),
            "output_len": 0,
            "used_rag": False,
            "success": True,
            "note": "skipped_generation_not_fake",
        })

        # MLflow run for observability too
        with mlflow.start_run(run_name="api_request_skipped"):
            log_params(cfg)
            log_metrics({
                "latency_ms": 0.0,
                "success": 1.0,
                "non_empty": 0.0,
                "output_len": 0.0,
                "used_rag": 0.0,
            })
            log_json(
                {
                    "input": req.model_dump(),
                    "output": {
                        "counter_argument": "",
                        "used_rag": False,
                        "sources": [],
                        "note": "skipped_generation_not_fake",
                    },
                },
                "artifacts/reports/api_payload.json",
            )

        return GenerateResponse(
            counter_argument="No counter-argument generated because the content was not labeled as FAKE.",
            used_rag=False,
            sources=[],
            passthrough={"label": req.label, "confidence": req.confidence},
        )

    # ✅ RAG retrieval (currently disabled)
    retrieved: List[Dict[str, Any]] = []
    if rag is not None and getattr(settings, "USE_RAG", False):
        retrieved = rag.retrieve(req.text, top_k=getattr(settings, "TOP_K", 4))

    # ✅ Measure latency + safe inference
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
    used_rag = bool(result.get("used_rag", False))

    # ✅ Local structured logging (jsonl file via your logging_utils)
    log_prediction({
        "latency_ms": latency_ms,
        "model_name": getattr(settings, "MODEL_NAME", "unknown"),
        "input_len": len(req.text or ""),
        "output_len": len(ca),
        "used_rag": used_rag,
        "success": ok,
        **({"error": err} if err else {}),
    })

    # ✅ MLflow run per API request
    with mlflow.start_run(run_name="api_request"):
        # params
        log_params(cfg)

        # metrics
        log_metrics({
            "latency_ms": float(latency_ms),
            "success": 1.0 if ok else 0.0,
            "non_empty": 1.0 if (ca != "") else 0.0,
            "output_len": float(len(ca)),
            "used_rag": 1.0 if used_rag else 0.0,
        })

        # artifacts: input/output payload
        log_json(
            {
                "input": req.model_dump(),
                "retrieved": retrieved,
                "output": result,
                "error": err,
            },
            "artifacts/reports/api_payload.json",
        )

    return GenerateResponse(
        counter_argument=ca if ok else "Error during generation.",
        used_rag=used_rag,
        sources=result.get("sources", []),
        passthrough={"label": req.label, "confidence": req.confidence},
    )


@app.get("/health")
def health():
    return {"ok": True, "model": settings.MODEL_NAME, "use_rag": settings.USE_RAG}
