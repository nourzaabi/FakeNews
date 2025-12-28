import os
from typing import Dict, Any, List

# ===============================
# FORCE MOCK (MLOps mode)
# ===============================
FORCE_MOCK = os.getenv("FORCE_MOCK", "false").lower() in ("1", "true", "yes")

# ===============================
# Safe imports (torch / transformers)
# ===============================
try:
    import torch
    TORCH_AVAILABLE = True
except Exception:
    torch = None
    TORCH_AVAILABLE = False

try:
    from transformers import AutoTokenizer, AutoModelForCausalLM
    TRANSFORMERS_AVAILABLE = True
except Exception:
    AutoTokenizer = None
    AutoModelForCausalLM = None
    TRANSFORMERS_AVAILABLE = False

try:
    from .config import settings
except ImportError:
    from config import settings


# ===============================
# Prompt builder (UNCHANGED)
# ===============================
def build_prompt(
    claim: str,
    label: str = "Fake News",
    retrieved: List[Dict[str, Any]] | None = None
):
    sources_block = ""
    if retrieved:
        bullets = []
        for d in retrieved:
            src = d.get("source", "source")
            text = d.get("text", "")
            bullets.append(f"- ({src}) {text}")
        sources_block = (
            "Trusted context (use only if relevant):\n"
            + "\n".join(bullets)
            + "\n\n"
        )

    if label and "fake" in label.lower():
        task_instruction = """
Task:
Write a concise counter-argument to the claim below.
Rules:
- Be polite and non-insulting.
- Provide 2–4 logical points explaining why this might be misleading or false.
- If trusted context is provided, ground your reasoning in it.
- If the claim is vague or missing evidence, say what would be needed to verify it.
- End with a short actionable suggestion.
"""
        response_prefix = "Counter-argument:"
    else:
        task_instruction = """
Task:
Write a concise explanation of why the claim below appears credible and accurate.
Rules:
- Be objective and informative.
- Provide 2–4 logical points supporting why this might be true.
"""
        response_prefix = "Explanation:"

    prompt = f"""You are a calm, evidence-driven fact-checking assistant.

{sources_block}{task_instruction}

Claim:
{claim}

{response_prefix}
"""
    return prompt, response_prefix


# ===============================
# Generator
# ===============================
class CounterArgGenerator:
    def __init__(self):
        # ✅ Mock if forced OR deps missing
        self.mock_mode = FORCE_MOCK or not (TORCH_AVAILABLE and TRANSFORMERS_AVAILABLE)

        if self.mock_mode:
            self.tokenizer = None
            self.model = None
            return

        # Real model loading
        self.tokenizer = AutoTokenizer.from_pretrained(settings.MODEL_NAME, use_fast=True)

        kwargs = {"device_map": settings.DEVICE_MAP}
        dtype = torch.float16 if torch.cuda.is_available() else torch.float32

        # ❌ 4bit requires bitsandbytes (not reliable on Windows)
        # If QUANT=4bit but bitsandbytes not installed -> fallback to normal
        if settings.QUANT == "4bit":
            try:
                import bitsandbytes  # noqa: F401
                kwargs.update({"load_in_4bit": True, "torch_dtype": dtype})
            except Exception:
                # fallback without quantization
                kwargs.update({"torch_dtype": dtype})
        else:
            kwargs.update({"torch_dtype": dtype})

        self.model = AutoModelForCausalLM.from_pretrained(settings.MODEL_NAME, **kwargs)
        self.model.eval()

    def generate(
        self,
        claim: str,
        label: str = "Fake News",
        retrieved: List[Dict[str, Any]] | None = None
    ) -> Dict[str, Any]:

        # ✅ MOCK RESPONSE (for MLOps / CI / MLflow / API tests)
        if self.mock_mode:
            return {
                "counter_argument": (
                    "[MOCK] This claim needs verification. "
                    "Use trusted sources and check evidence before believing it."
                ),
                "used_rag": bool(retrieved),
                "sources": retrieved or [],
            }

        prompt, split_key = build_prompt(claim, label, retrieved)
        inputs = self.tokenizer(prompt, return_tensors="pt")

        if torch.cuda.is_available() and settings.DEVICE_MAP in ("auto", "cuda"):
            inputs = {k: v.to("cuda") for k, v in inputs.items()}

        with torch.inference_mode():
            out = self.model.generate(
                **inputs,
                max_new_tokens=settings.MAX_NEW_TOKENS,
                temperature=settings.TEMPERATURE,
                top_p=settings.TOP_P,
                do_sample=True,
                eos_token_id=self.tokenizer.eos_token_id,
                pad_token_id=self.tokenizer.eos_token_id,
            )

        decoded = self.tokenizer.decode(out[0], skip_special_tokens=True)

        if split_key in decoded:
            decoded = decoded.split(split_key, 1)[-1].strip()

        for marker in [
            "\nNote:", "\nQuestion:", "\nAnswer:",
            "\nUser:", "\nAssistant:", "\n\nHuman:", "\n\nAI:"
        ]:
            if marker in decoded:
                decoded = decoded.split(marker)[0].strip()

        return {
            "counter_argument": decoded,
            "used_rag": bool(retrieved),
            "sources": retrieved or [],
        }
