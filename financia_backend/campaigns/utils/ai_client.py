import os
import requests

# Load your GEMINI_API_KEY from environment (e.g. .env → settings, or export before you run)
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_URL     = (
    "https://generativelanguage.googleapis.com/v1/"
    "models/gemini-2.0-flash:generateContent"
)

def generate_ai_content(user_first_name: str, offer_title: str, offer_desc: str) -> str:
    """Call Gemini to build a short promotional email."""
    prompt = f"""
Create a personalized email for {user_first_name} about:
Offer: {offer_title}
Details: {offer_desc}

Guidelines:
- Friendly but professional tone
- Mention user's recent activity if available
- Create urgency with expiration date
- Personal finance tip related to offer
- Max 200 words
"""
    resp = requests.post(
        GEMINI_URL,
        params={"key": GEMINI_API_KEY},
        json={
            "contents": [
                {"role": "user", "parts":[{"text": prompt}]}
            ]
        },
        headers={"Content-Type": "application/json"}
    )
    resp.raise_for_status()
    data = resp.json()
    # extract the generated text
    return data["candidates"][0]["content"]["parts"][0]["text"].strip()
