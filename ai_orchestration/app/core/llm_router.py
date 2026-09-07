import json
import logging
import re
from typing import Optional, Dict, Any
from groq import Groq
from google import genai
from google.genai import types
from app.core.config import settings

logger = logging.getLogger(__name__)

def extract_json_from_text(text: str) -> Dict[str, Any]:
    """Robustly extract and parse JSON object from raw LLM text output."""
    clean = text.strip()
    # Strip markdown code blocks if present
    if clean.startswith("```json"):
        clean = clean[7:]
    elif clean.startswith("```"):
        clean = clean[3:]
    if clean.endswith("```"):
        clean = clean[:-3]
    clean = clean.strip()

    try:
        return json.loads(clean)
    except json.JSONDecodeError:
        # Match outermost {...}
        match = re.search(r"(\{.*\})", clean, re.DOTALL)
        if match:
            return json.loads(match.group(1))
        raise

class LLMRouter:
    def __init__(self):
        self.groq_client = Groq(api_key=settings.GROQ_API_KEY) if settings.GROQ_API_KEY else None
        self.gemini_client = genai.Client(api_key=settings.GEMINI_API_KEY) if settings.GEMINI_API_KEY else None

    async def generate_text(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
        max_tokens: int = 900,
        temperature: float = 0.7
    ) -> str:
        if self.groq_client:
            for model_name in ["openai/gpt-oss-120b", "qwen/qwen3.8-27b", "openai/gpt-oss-20b"]:
                try:
                    messages = []
                    if system_prompt:
                        messages.append({"role": "system", "content": system_prompt})
                    messages.append({"role": "user", "content": prompt})
                    
                    res = self.groq_client.chat.completions.create(
                        model=model_name,
                        messages=messages,
                        max_tokens=max_tokens,
                        temperature=temperature
                    )
                    return res.choices[0].message.content.strip()
                except Exception as e:
                    logger.warning(f"Groq text model {model_name} failed: {e}, attempting next...")

        if self.gemini_client:
            try:
                config = types.GenerateContentConfig(
                    system_instruction=system_prompt if system_prompt else None,
                    max_output_tokens=max_tokens,
                    temperature=temperature
                )
                res = self.gemini_client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=prompt,
                    config=config
                )
                if res and res.text:
                    return res.text.strip()
            except Exception as e:
                logger.warning(f"Gemini fallback failed: {e}")

        raise RuntimeError("No working LLM provider is available for text generation.")

    async def generate_json(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
        max_tokens: int = 950
    ) -> Dict[str, Any]:
        # Groq Models to iterate through
        if self.groq_client:
            for model_name in ["openai/gpt-oss-120b", "qwen/qwen3.8-27b", "openai/gpt-oss-20b"]:
                # Attempt A: with response_format json_object
                try:
                    messages = []
                    sys_msg = (system_prompt or "") + "\nRespond with valid JSON only."
                    messages.append({"role": "system", "content": sys_msg})
                    messages.append({"role": "user", "content": prompt + "\nProvide the output in JSON format."})

                    res = self.groq_client.chat.completions.create(
                        model=model_name,
                        messages=messages,
                        response_format={"type": "json_object"},
                        max_tokens=max_tokens,
                        temperature=0.2
                    )
                    return extract_json_from_text(res.choices[0].message.content)
                except Exception as e1:
                    logger.warning(f"Groq {model_name} json_object mode failed: {e1}, trying plain text extraction...")
                    
                    # Attempt B: standard completion + regex extractor
                    try:
                        res = self.groq_client.chat.completions.create(
                            model=model_name,
                            messages=messages,
                            max_tokens=max_tokens,
                            temperature=0.2
                        )
                        return extract_json_from_text(res.choices[0].message.content)
                    except Exception as e2:
                        logger.warning(f"Groq {model_name} plain extraction failed: {e2}, trying next model...")

        # Secondary: Gemini
        if self.gemini_client:
            try:
                config = types.GenerateContentConfig(
                    system_instruction=system_prompt if system_prompt else None,
                    response_mime_type="application/json",
                    max_output_tokens=max_tokens,
                    temperature=0.2
                )
                res = self.gemini_client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=prompt,
                    config=config
                )
                return extract_json_from_text(res.text)
            except Exception as e:
                logger.error(f"Gemini JSON failed: {e}")

        raise RuntimeError("No LLM available for JSON generation.")

llm_router = LLMRouter()
