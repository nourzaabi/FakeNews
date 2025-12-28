# src/pipelines/run_inference.py
import argparse
import json
import time
from pathlib import Path
from typing import Dict, Any, Iterator

import mlflow

from src.core.generator import CounterArgGenerator
from src.core.config import settings
from src.utils.mlflow_utils import set_experiment, log_params, log_metrics, log_json, log_file
from src.utils.logging_utils import log_prediction  # ✅ S4 logging JSONL


def read_jsonl(path: str) -> Iterator[Dict[str, Any]]:
    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line:
                yield json.loads(line)


def main(input_path: str, out_path: str):
    # ✅ Ensure folders exist
    Path("artifacts/reports").mkdir(parents=True, exist_ok=True)
    Path("artifacts/logs").mkdir(parents=True, exist_ok=True)

    # ✅ Snapshot config (params)
    cfg = {
        "MODEL_NAME": getattr(settings, "MODEL_NAME", None),
        "DEVICE_MAP": getattr(settings, "DEVICE_MAP", None),
        "QUANT": getattr(settings, "QUANT", None),
        "MAX_NEW_TOKENS": getattr(settings, "MAX_NEW_TOKENS", None),
        "TEMPERATURE": getattr(settings, "TEMPERATURE", None),
        "TOP_P": getattr(settings, "TOP_P", None),
        "USE_RAG": getattr(settings, "USE_RAG", None),
        "TOP_K": getattr(settings, "TOP_K", None),
    }

    gen = CounterArgGenerator()

    latencies = []
    output_lens = []
    success = 0
    non_empty = 0
    preds = []

    # ✅ For monitoring baseline log file
    log_path = "artifacts/logs/predictions.log.jsonl"

    for row in read_jsonl(input_path):
        claim = row.get("claim", "") or ""
        label = row.get("label", "fake") or "fake"
        sample_id = row.get("id", None)

        t0 = time.perf_counter()
        ok = True
        error_msg = None

        try:
            res = gen.generate(claim=claim, label=label, retrieved=None)
        except Exception as e:
            ok = False
            error_msg = str(e)
            res = {
                "counter_argument": "",
                "error": error_msg,
                "used_rag": False,
                "sources": [],
            }

        dt_ms = (time.perf_counter() - t0) * 1000.0
        latencies.append(dt_ms)

        if ok:
            success += 1

        ca = (res.get("counter_argument") or "").strip()
        if ca:
            non_empty += 1
            output_lens.append(len(ca))

        # ✅ Save per-sample prediction record
        preds.append({
            "id": sample_id,
            "claim": claim,
            "label": label,
            "latency_ms": dt_ms,
            "result": res,
        })

        # ✅ S4: structured monitoring log (JSONL)
        log_prediction(
            {
                "latency_ms": dt_ms,
                "model_name": cfg.get("MODEL_NAME"),
                "input_len": len(claim),
                "output_len": len(ca),
                "used_rag": bool(res.get("used_rag", False)),
                "success": ok,
                **({"error": error_msg} if error_msg else {}),
            },
            log_path=log_path
        )

    # ✅ Save predictions.jsonl
    outp = Path(out_path)
    outp.parent.mkdir(parents=True, exist_ok=True)
    with open(outp, "w", encoding="utf-8") as f:
        for p in preds:
            f.write(json.dumps(p, ensure_ascii=False) + "\n")

    n = max(len(preds), 1)
    metrics = {
        "avg_latency_ms": sum(latencies) / max(len(latencies), 1),
        "avg_output_len": (sum(output_lens) / max(len(output_lens), 1)) if output_lens else 0.0,
        "success_rate": success / n,
        "non_empty_rate": non_empty / n,
        "num_samples": float(len(preds)),
    }

    # ✅ MLflow experiment
    set_experiment("llm_inference")

    with mlflow.start_run(run_name="inference_run"):
        # params + metrics
        log_params(cfg)
        log_metrics(metrics)

        # artifacts
        log_json(cfg, "artifacts/reports/config_snapshot.json")
        log_json(metrics, "artifacts/reports/metrics.json")
        log_file(str(outp))          # predictions.jsonl
        log_file(log_path)           # ✅ monitoring log JSONL


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", default="data/samples/claims.jsonl")
    parser.add_argument("--out", default="artifacts/reports/predictions.jsonl")
    args = parser.parse_args()
    main(args.input, args.out)
