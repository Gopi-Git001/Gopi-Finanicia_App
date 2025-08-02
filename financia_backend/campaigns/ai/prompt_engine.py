import random, yaml
from typing import Dict

class FinancialPromptEngine:
    def __init__(self):
        self.templates = self._load_templates()
        
    def create_prompt(self, user_data: Dict, product_data: Dict) -> Tuple[str, str]:
        product_type = product_data["category"]
        variants = self.templates.get(product_type, [])
        variant = random.choice(list(variants.keys())) if variants else "default"
        
        template = variants.get(variant, variants["default"])
        
        return template.format(
            user_segment=user_data["tier"],
            interest=user_data["primary_interest"],
            discount=product_data["discount"],
            coupon_code=product_data["coupon_code"],
            features=", ".join(product_data["key_benefits"][:3])
        ), variant

    def _load_templates(self) -> Dict:
        with open("config/gemini_prompts.yaml") as f:
            return yaml.safe_load(f)