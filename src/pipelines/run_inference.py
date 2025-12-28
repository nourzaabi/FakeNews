import argparse
import json
import time
from pathlib import Path

import mlflow

from src.core.generator import CounterArgGenerator
from src.core.config import settings
from src.utils.mlflow_utils import set_experiment, log_params, log_metrics, log_json, log_file


def read_jsonl(path: str):
    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            if line.strip():
                yield json.loads(line)


def main(input_path: str, out_path: str):
    Path("artifacts/reports").mkdir(parents=True, exist_ok=True)

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
    outputs = []
    success = 0
    non_empty = 0
    preds = []

    for row in read_jsonl(input_path):
        claim = row.get("claim", "")
        label = row.get("label", "fake")

        t0 = time.time()
        try:
            res = gen.generate(claim=claim, label=label, retrieved=None)
            ok = True
        except Exception as e:
            res = {"counter_argument": "", "error": str(e), "used_rag": False, "sources": []}
            ok = False

        dt_ms = (time.time() - t0) * 1000.0
        latencies.append(dt_ms)

        if ok:
            success += 1

        ca = (res.get("counter_argument") or "").strip()
        if ca:
            non_empty += 1
            outputs.append(ca)

        preds.append({
            "id": row.get("id"),
            "claim": claim,
            "label": label,
            "latency_ms": dt_ms,
            "result": res,
        })

    # Save predictions
    outp = Path(out_path)
    outp.parent.mkdir(parents=True, exist_ok=True)
    with open(outp, "w", encoding="utf-8") as f:
        for p in preds:
            f.write(json.dumps(p, ensure_ascii=False) + "\n")

    n = max(len(preds), 1)
    metrics = {
        "avg_latency_ms": sum(latencies) / max(len(latencies), 1),
        "avg_output_len": sum(len(o) for o in outputs) / max(len(outputs), 1),
        "success_rate": success / n,
        "non_empty_rate": non_empty / n,
        "num_samples": float(len(preds)),
    }

    set_experiment("llm_inference")

    with mlflow.start_run(run_name="inference_run"):
        log_params(cfg)
        log_metrics(metrics)
        log_json(cfg, "artifacts/reports/config_snapshot.json")
        log_json(metrics, "artifacts/reports/metrics.json")
        log_file(str(outp))


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", default="data/samples/claims.jsonl")
    parser.add_argument("--out", default="artifacts/reports/predictions.jsonl")
    args = parser.parse_args()
    main(args.input, args.out)
