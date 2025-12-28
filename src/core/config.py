import os

class Settings:
    # Pick a model you can run:
    # - "Qwen/Qwen2.5-1.5B-Instruct": Fast, lightweight, good for testing.
    # - "mistralai/Mistral-7B-Instruct-v0.3": High quality, requires GPU/more RAM (Slow download).
    MODEL_NAME: str = os.getenv("MODEL_NAME", "Qwen/Qwen2.5-1.5B-Instruct")

    # If you have GPU, keep "auto". If CPU-only, it will be slow for 7B+.
    DEVICE_MAP: str = os.getenv("DEVICE_MAP", "auto")

    # Quantization: "4bit" (recommended on GPU) or "none"
    QUANT: str = os.getenv("QUANT", "4bit")

    # Generation
    MAX_NEW_TOKENS: int = int(os.getenv("MAX_NEW_TOKENS", "512"))
    TEMPERATURE: float = float(os.getenv("TEMPERATURE", "0.25"))
    TOP_P: float = float(os.getenv("TOP_P", "0.9"))

    # RAG
    USE_RAG: bool = os.getenv("USE_RAG", "false").lower() == "true"
    KB_PATH: str = os.getenv("KB_PATH", "data/kb_docs.jsonl")
    TOP_K: int = int(os.getenv("TOP_K", "4"))

settings = Settings()
