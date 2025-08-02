PII_FIELDS = ["email", "phone", "tax_id"]
ANONYMIZATION_RULES = {
    "email": lambda x: x[0] + "***@" + x.split("@")[-1],
    "phone": lambda x: x[-4:].rjust(len(x), "*")
}

def anonymize_user_data(user_data: Dict) -> Dict:
    return {
        k: ANONYMIZATION_RULES.get(k, lambda x: x)(v) 
        if k in PII_FIELDS else v 
        for k, v in user_data.items()
    }