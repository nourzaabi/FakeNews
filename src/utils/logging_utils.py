# src/utils/logging_utils.py
import json
import os
from datetime import datetime, timezone
from typing import Any, Dict

DEFAULT_LOG_PATH = os.path.join("artifacts", "logs", "predictions.log.jsonl")


def ensure_parent_dir(path: str) -> None:
    os.makedirs(os.path.dirname(path), exist_ok=True)


def log_prediction(event: Dict[str, Any], log_path: str = DEFAULT_LOG_PATH) -> None:
    """
    Append one JSON event per line (JSONL).
    """
    ensure_parent_dir(log_path)

    # add timestamp if missing
    event.setdefault("timestamp", datetime.now(timezone.utc).isoformat())

    with open(log_path, "a", encoding="utf-8") as f:
        f.write(json.dumps(event, ensure_ascii=False) + "\n")
