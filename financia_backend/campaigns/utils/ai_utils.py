import logging
from django.conf import settings
import google.generativeai as genai
from google.api_core.exceptions import ResourceExhausted, GoogleAPICallError

logger = logging.getLogger(__name__)
genai.configure(api_key=settings.GEMINI_API_KEY)

FALLBACK_BODY = (
    "Hello! We’ve got some great new offers you might like—"
    "come check them out on our site."
)

def generate_email_body(user, offer=None):
    """
    Generate a personalized promotional email body via Gemini.
    Falls back to default text on error or quota exhaustion.
    """
    prompt_parts = [
        f"User name: {user.first_name or user.username}",
        f"Opened {user.email_open_count} emails so far.",
    ]
    if offer:
        prompt_parts += [
            f"Offer title: {offer.title}",
            f"Offer description: {offer.description}",
        ]

    prompt = (
        "Create a friendly, concise (2-3 paragraphs) promotional "
        "email body using the details below:\n\n"
        + "\n".join(prompt_parts)
    )

    try:
        model = genai.GenerativeModel(settings.GEMINI_MODEL)
        response = model.generate_content(prompt)
        return response.text.strip()

    except ResourceExhausted:
        logger.warning("Gemini quota exhausted—using fallback copy.")
        return FALLBACK_BODY

    except GoogleAPICallError as e:
        logger.error(f"Gemini API error ({type(e).__name__}): {e}")
        return FALLBACK_BODY