from typing import Dict, Any, List
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM

try:
    from .config import settings
except ImportError:
    from config import settings



def build_prompt(claim: str, label: str = "Fake News", retrieved: List[Dict[str, Any]] | None = None):
    sources_block = ""
    if retrieved:
        bullets = []
        for d in retrieved:
            src = d.get("source", "source")
            text = d.get("text", "")
            bullets.append(f"- ({src}) {text}")
        sources_block = "Trusted context (use only if relevant):\n" + "\n".join(bullets) + "\n\n"

    if label and "fake" in label.lower():
        task_instruction = """
                Task:
                Write a concise counter-argument to the claim below.
                Rules:
                - Be polite and non-insulting.
                - Provide 2–4 logical points explaining why this might be misleading or false.
                - If trusted context is provided, ground your reasoning in it.
                - If the claim is vague or missing evidence, say what would be needed to verify it.
                - End with a short actionable suggestion (e.g., “check official sources”, “look for peer-reviewed evidence”).
        """
        response_prefix = "Counter-argument:"
    else:
        task_instruction = """
                Task:
                Write a concise explanation of why the claim below appears credible and accurate.
                Rules:
                - Be objective and informative.
                - Provide 2–4 logical points supporting the likelihood of this being true (based on common knowledge or context).
                - If trusted context is provided, ground your reasoning in it.
                - Emphasize the consistency with known facts if applicable.
        """
        response_prefix = "Explanation:"

    prompt = f"""You are a calm, evidence-driven debater and fact-checking assistant.

            {sources_block}
            {task_instruction}

                Claim:
                {claim}

                {response_prefix}
                """
    return prompt, response_prefix

class CounterArgGenerator:
    def __init__(self):
        self.tokenizer = AutoTokenizer.from_pretrained(settings.MODEL_NAME, use_fast=True)

        kwargs = {"device_map": settings.DEVICE_MAP}
        if settings.QUANT == "4bit":
            kwargs.update({
                "load_in_4bit": True,
                "torch_dtype": torch.float16 if torch.cuda.is_available() else torch.float32,
            })
        else:
            kwargs.update({
                "torch_dtype": torch.float16 if torch.cuda.is_available() else torch.float32,
            })

        self.model = AutoModelForCausalLM.from_pretrained(settings.MODEL_NAME, **kwargs)
        self.model.eval()
        

    @torch.inference_mode()
    def generate(self, claim: str, label: str = "Fake News", retrieved: List[Dict[str, Any]] | None = None) -> Dict[str, Any]:
        prompt, split_key = build_prompt(claim, label, retrieved=retrieved)

        inputs = self.tokenizer(prompt, return_tensors="pt")
        # If device_map="auto", model is sharded; inputs can stay on CPU.
        # Transformers handles moving tensors to the right device internally in most cases.
        # But for single-GPU it’s okay to push inputs to CUDA if available:
        if torch.cuda.is_available() and settings.DEVICE_MAP in ("auto", "cuda"):
            inputs = {k: v.to("cuda") for k, v in inputs.items()}

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

        # Return only the part after the split key if present
        if split_key in decoded:
            decoded = decoded.split(split_key, 1)[-1].strip()

        return {
            "counter_argument": decoded,
            "used_rag": bool(retrieved),
            "sources": retrieved or [],
        }

