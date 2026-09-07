import json
import logging
from typing import Optional, Dict, Any
from groq import Groq
from google import genai
from google.genai import types
from app.core.config import settings

logger = logging.getLogger(__name__)

class LLMRouter:
    def __init__(self):
        self.groq_client = Groq(api_key=settings.GROQ_API_KEY) if settings.GROQ_API_KEY else None
        self.gemini_client = genai.Client(api_key=settings.GEMINI_API_KEY) if settings.GEMINI_API_KEY else None

    async def generate_text(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
        max_tokens: int = 1000,
        temperature: float = 0.7
    ) -> str:
        # 1. Primary: Gemini 2.5 Flash
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
                logger.warning(f"Gemini generation failed: {e}, falling back to Groq...")

        # 2. Fallback: Groq (gpt-oss-120b or qwen3.8-27b)
        if self.groq_client:
            try:
                messages = []
                if system_prompt:
                    messages.append({"role": "system", "content": system_prompt})
                messages.append({"role": "user", "content": prompt})
                
                res = self.groq_client.chat.completions.create(
                    model="qwen/qwen3.8-27b",
                    messages=messages,
                    max_tokens=max_tokens,
                    temperature=temperature
                )
                return res.choices[0].message.content.strip()
            except Exception as e:
                logger.error(f"Groq fallback also failed: {e}")
                raise e

        raise RuntimeError("No working LLM provider is available.")

    async def generate_json(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
        max_tokens: int = 2500
    ) -> Dict[str, Any]:
        # 1. Primary for JSON: Gemini 2.5 Flash native JSON mode
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
                return json.loads(res.text)
            except Exception as e:
                logger.warning(f"Gemini JSON generation failed: {e}, attempting Groq...")

        # 2. Fallback: Groq with response_format={"type": "json_object"}
        if self.groq_client:
            try:
                messages = []
                sys_msg = (system_prompt or "") + "\nYou MUST respond with strictly valid JSON only."
                messages.append({"role": "system", "content": sys_msg})
                messages.append({"role": "user", "content": prompt})

                res = self.groq_client.chat.completions.create(
                    model="qwen/qwen3.8-27b",
                    messages=messages,
                    response_format={"type": "json_object"},
                    max_tokens=max_tokens,
                    temperature=0.2
                )
                return json.loads(res.choices[0].message.content)
            except Exception as e:
                logger.error(f"Groq JSON fallback failed: {e}")
                raise e

        raise RuntimeError("No LLM available for JSON generation.")

llm_router = LLMRouter()
