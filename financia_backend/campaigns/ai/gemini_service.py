import os, requests, yaml, time
from typing import Dict, Tuple
from .prompt_engine import FinancialPromptEngine
from compliance.content_validator import validate_financial_claims

GEMINI_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent"

class GeminiEmailService:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.prompt_engine = FinancialPromptEngine()
        self.fallback_templates = self._load_fallbacks()

    def generate_email(self, user_data: Dict, product_data: Dict) -> Tuple[str, str]:
        prompt, variant = self.prompt_engine.create_prompt(user_data, product_data)
        
        try:
            response = self._call_gemini_api(prompt)
            cleaned_response = validate_financial_claims(response)
            return cleaned_response, variant
        except Exception as e:
            return self._handle_fallback(user_data, product_data), "fallback"

    def _call_gemini_api(self, prompt: str) -> str:
        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {
                "temperature": 0.3,
                "maxOutputTokens": 350
            },
            "safetySettings": [{
                "category": "HARM_CATEGORY_FINANCIAL_ADVICE",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
            }]
        }
        start = time.perf_counter()
        response = requests.post(
            f"{GEMINI_URL}?key={self.api_key}",
            json=payload,
            timeout=2.0
        )
        latency = time.perf_counter() - start
        if latency > 1.5:
            log_metric("gemini_high_latency", latency)
        
        response.raise_for_status()
        return response.json()["candidates"][0]["content"]["parts"][0]["text"]

    def _handle_fallback(self, user_data: Dict, product_data: Dict) -> str:
        product_type = product_data["category"]
        return self.fallback_templates.get(product_type, 
            "We have exciting financial offers for you!")

    def _load_fallbacks(self) -> Dict:
        with open("config/gemini_prompts.yaml") as f:
            return {k: v["fallback"] for k,v in yaml.safe_load(f).items()}