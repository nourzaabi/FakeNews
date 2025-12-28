import json
from pathlib import Path
from typing import Dict, Any
import mlflow


def set_experiment(name: str = "llm_inference"):
    mlflow.set_experiment(name)


def log_params(cfg: Dict[str, Any]):
    for k, v in cfg.items():
        if isinstance(v, (str, int, float, bool)) or v is None:
            mlflow.log_param(k, v)


def log_metrics(metrics: Dict[str, float]):
    for k, v in metrics.items():
        try:
            mlflow.log_metric(k, float(v))
        except Exception:
            pass


def log_json(obj: Dict[str, Any], path: str):
    p = Path(path)
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(json.dumps(obj, indent=2, ensure_ascii=False), encoding="utf-8")
    mlflow.log_artifact(str(p))


def log_file(path: str):
    p = Path(path)
    if p.exists():
        mlflow.log_artifact(str(p))
