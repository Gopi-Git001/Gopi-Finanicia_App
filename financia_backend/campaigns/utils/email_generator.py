# # # campaigns/utils/email_generator.py

# # import random
# # from datetime import datetime
# # from django.template import Template, Context
# # from django.urls import reverse

# # from campaigns.models import PromotionalOffer, EmailTemplate
# # from users.models import CustomUser

# # class EmailGenerator:
# #     def __init__(self, user: CustomUser, email_type: str = "PROMO"):
# #         self.user = user
# #         self.email_type = email_type
# #         self.template = self._get_template()
        
# #     def _get_template(self):
# #         template = EmailTemplate.objects.filter(template_type=self.email_type).first()
# #         if not template:
# #             raise ValueError(f"No EmailTemplate found for type {self.email_type}")
# #         return template

# #     def _select_offer(self) -> PromotionalOffer | None:
   
# #             if self.email_type != "PROMO":
# #                 return None

# #             qs = PromotionalOffer.objects.filter(is_active=True)

# #             # Convert preferences model instance to dict manually
# #             prefs_obj = self.user.preferences
# #             if prefs_obj:
# #                 # Example: collect all boolean preference fields that are True
# #                 # You can list fields explicitly or use _meta to get all field names
# #                 prefs_dict = {}
# #                 for field in prefs_obj._meta.get_fields():
# #                     # Only get boolean fields and exclude relations
# #                     if field.get_internal_type() == "BooleanField":
# #                         prefs_dict[field.name] = getattr(prefs_obj, field.name)

# #                 # Now get list of keys where value is True
# #                 prefs = [k for k, v in prefs_dict.items() if v]
# #             else:
# #                 prefs = []

# #             if prefs:
# #                 qs = qs.filter(category__in=prefs)

# #             eligible = [o for o in qs if self._matches_targeting(o)]
# #             return random.choice(eligible) if eligible else None


# #     def _matches_targeting(self, offer: PromotionalOffer) -> bool:
# #         """Check if user matches offer targeting criteria"""
# #         crit = offer.target_criteria or {}
        
# #         # Credit score check
# #         if "min_credit_score" in crit:
# #             if getattr(self.user, "credit_score", 0) < crit["min_credit_score"]:
# #                 return False
                
# #         # Add more targeting criteria checks here as needed
# #         return True

# #     def _build_context(self, offer: PromotionalOffer | None) -> dict:
# #         """Build context for email template"""
# #         return {
# #             "user": self.user,
# #             "offer": offer,
# #             "unsubscribe_link": reverse("unsubscribe", kwargs={"user_id": self.user.id}),
# #             "tracking_pixel": reverse("track_email_open", kwargs={"user_id": self.user.id}),
# #             "current_date": datetime.now().strftime("%B %d, %Y"),
# #         }

# #     def generate_email(self) -> dict:
# #         """Generate complete email content"""
# #         offer = self._select_offer()
# #         context = self._build_context(offer)

# #         # Render the template
# #         tpl = Template(self.template.html_content)
# #         html_message = tpl.render(Context(context))

# #         # Format subject
# #         subject = self.template.subject.format(
# #             user=(self.user.first_name or self.user.username),
# #             offer=(offer.title if offer else "")
# #         )

# #         return {
# #             "subject": subject,
# #             "html_message": html_message,
# #             "offer_id": (offer.id if offer else None),
# #         }

# # ---------------------------------------------------

# # # campaigns/utils/email_generator.py
# # import os
# # import random
# # import logging
# # from datetime import datetime
# # from django.urls import reverse
# # from django.conf import settings
# # from django.template import Template, Context
# # import google.generativeai as genai
# # from campaigns.models import PromotionalOffer, EmailTemplate
# # from users.models import CustomUser

# # logger = logging.getLogger(__name__)

# # # Use the working model name
# # #GEMINI_MODEL = "models/gemini-2.0-flash-thinking-exp-01-21"

# # GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
# # GEMINI_MODEL   = os.getenv('GEMINI_MODEL', 'models/gemini-2.0-flash')

# # class EmailGenerator:
# #     def __init__(self, user: CustomUser, email_type: str = "PROMO"):
# #         self.user = user
# #         self.email_type = email_type
# #         self.template = self._get_template()
        
# #     def _get_template(self):
# #         template = EmailTemplate.objects.filter(template_type=self.email_type).first()
# #         if not template:
# #             raise ValueError(f"No EmailTemplate found for type {self.email_type}")
# #         return template

# #     def _select_offer(self) -> PromotionalOffer | None:
# #         if self.email_type != "PROMO":
# #             return None

# #         qs = PromotionalOffer.objects.filter(is_active=True)
        
# #         # Safely get preferences
# #         prefs = []
# #         if hasattr(self.user, 'preferences'):
# #             for field in ['finance', 'technology', 'shopping', 'travel']:
# #                 if hasattr(self.user.preferences, field):
# #                     if getattr(self.user.preferences, field):
# #                         prefs.append(field)
        
# #         if prefs:
# #             qs = qs.filter(category__in=prefs)
        
# #         eligible = [o for o in qs if self._matches_targeting(o)]
# #         return random.choice(eligible) if eligible else None

# #     def _matches_targeting(self, offer: PromotionalOffer) -> bool:
# #         crit = offer.target_criteria or {}
# #         if "min_credit_score" in crit:
# #             if getattr(self.user, "credit_score", 0) < crit["min_credit_score"]:
# #                 return False
# #         return True

# #     def _generate_ai_content(self, offer: PromotionalOffer | None) -> str:
# #         try:
# #             api_key = settings.GEMINI_API_KEY or os.getenv('GEMINI_API_KEY')
            
# #             if not api_key:
# #                 logger.error("GEMINI_API_KEY is not configured")
# #                 return "Discover our latest exclusive offers tailored just for you!"
            
# #             genai.configure(api_key=api_key)
            
# #             # Use the working model name
# #             model = genai.GenerativeModel(GEMINI_MODEL)
            
# #             prompt = f"Create a friendly, engaging promotional email (2 paragraphs) for {self.user.first_name or 'valued customer'}"
            
# #             prefs = []
# #             if hasattr(self.user, 'preferences'):
# #                 for field in ['finance', 'technology', 'shopping', 'travel']:
# #                     if hasattr(self.user.preferences, field) and getattr(self.user.preferences, field):
# #                         prefs.append(field)
            
# #             if prefs:
# #                 prompt += f" focusing on: {', '.join(prefs)}. "
            
# #             if offer:
# #                 prompt += f"Feature this offer: {offer.title} - {offer.description}. "
                
# #             prompt += "Include a personalized greeting and a call-to-action."
            
# #             response = model.generate_content(prompt)
# #             return response.text
# #         except Exception as e:
# #             logger.error(f"AI content generation failed: {str(e)}")
# #             return "Discover our latest exclusive offers tailored just for you!"

# #     def _build_context(self, offer: PromotionalOffer | None, ai_body: str) -> dict:
# #         return {
# #             "user": self.user,
# #             "offer": offer,
# #             "ai_body": ai_body,
# #             "unsubscribe_link": f"{settings.SITE_URL}{reverse('unsubscribe', kwargs={'user_id': self.user.id})}",
# #             "tracking_pixel": f"{settings.SITE_URL}{reverse('track_email_open', kwargs={'user_id': self.user.id})}",
# #             "current_date": datetime.now().strftime("%B %d, %Y"),
# #         }

# #     def generate_email(self) -> dict:
# #         offer = self._select_offer()
# #         ai_body = self._generate_ai_content(offer) if self.email_type == "PROMO" else ""
# #         context = self._build_context(offer, ai_body)

# #         tpl = Template(self.template.html_content)
# #         html_message = tpl.render(Context(context))

# #         subject = self.template.subject.format(
# #             user=(self.user.first_name or self.user.username),
# #             offer=(offer.title if offer else "")
# #         )

# #         return {
# #             "subject": subject,
# #             "html_message": html_message,
# #             "offer_id": (offer.id if offer else None),
# #         }

# #------------------------------------

# # campaigns/utils/email_generator.py
# import os
# import random
# import logging
# from datetime import datetime
# from django.urls import reverse
# from django.conf import settings
# from django.template.loader import render_to_string  # Changed to render_to_string
# import google.generativeai as genai
# from campaigns.models import PromotionalOffer
# from users.models import CustomUser

# logger = logging.getLogger(__name__)

# # Use the working model name
# GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
# GEMINI_MODEL = os.getenv('GEMINI_MODEL', 'models/gemini-2.0-flash')

# class EmailGenerator:
#     def __init__(self, user: CustomUser, email_type: str = "PROMO"):
#         self.user = user
#         self.email_type = email_type
        
#     def _select_offer(self) -> PromotionalOffer | None:
#         if self.email_type != "PROMO":
#             return None

#         qs = PromotionalOffer.objects.filter(is_active=True)
        
#         # Safely get preferences
#         prefs = []
#         if hasattr(self.user, 'preferences'):
#             for field in ['finance', 'technology', 'shopping', 'travel']:
#                 if hasattr(self.user.preferences, field):
#                     if getattr(self.user.preferences, field):
#                         prefs.append(field)
        
#         if prefs:
#             qs = qs.filter(category__in=prefs)
        
#         eligible = [o for o in qs if self._matches_targeting(o)]
#         return random.choice(eligible) if eligible else None

#     def _matches_targeting(self, offer: PromotionalOffer) -> bool:
#         crit = offer.target_criteria or {}
#         if "min_credit_score" in crit:
#             if getattr(self.user, "credit_score", 0) < crit["min_credit_score"]:
#                 return False
#         return True

#     def _generate_ai_content(self, offer: PromotionalOffer | None) -> str:
#         try:
#             if not GEMINI_API_KEY:
#                 logger.error("GEMINI_API_KEY is not configured")
#                 return "Discover our latest exclusive offers tailored just for you!"
            
#             genai.configure(api_key=GEMINI_API_KEY)
#             model = genai.GenerativeModel(GEMINI_MODEL)
            
#             prompt = f"Create a friendly, engaging promotional email (2 paragraphs) for {self.user.first_name or 'valued customer'}"
            
#             prefs = []
#             if hasattr(self.user, 'preferences'):
#                 for field in ['finance', 'technology', 'shopping', 'travel']:
#                     if hasattr(self.user.preferences, field) and getattr(self.user.preferences, field):
#                         prefs.append(field)
            
#             if prefs:
#                 prompt += f" focusing on: {', '.join(prefs)}. "
            
#             if offer:
#                 prompt += f"Feature this offer: {offer.title} - {offer.description}. "
                
#             prompt += "Include a personalized greeting and a call-to-action."
            
#             response = model.generate_content(prompt)
#             return response.text
#         except Exception as e:
#             logger.error(f"AI content generation failed: {str(e)}")
#             return "Discover our latest exclusive offers tailored just for you!"

#     def generate_email(self) -> dict:
#         """Generate complete email content using HTML template"""
#         offer = self._select_offer()
#         ai_body = self._generate_ai_content(offer) if self.email_type == "PROMO" else ""
        
#         # Build context for template
#         context = {
#             "user": self.user,
#             "offer": offer,
#             "ai_body": ai_body,
#             "unsubscribe_link": f"{settings.SITE_URL}{reverse('unsubscribe', kwargs={'user_id': self.user.id})}",
#             "tracking_pixel": f"{settings.SITE_URL}{reverse('track_email_open', kwargs={'user_id': self.user.id})}",
#             "current_date": datetime.now().strftime("%B %d, %Y"),
#         }

#         # Render HTML template
#         template_name = f"emails/{self.email_type.lower()}.html"
#         html_message = render_to_string(template_name, context)
        
#         # Format subject
#         subject = f"Special offers for {self.user.first_name}!" if self.user.first_name \
#             else "Exclusive promotions just for you!"
            
#         if offer:
#             subject = f"{offer.title} - Exclusive Offer for {self.user.first_name}"

#         return {
#             "subject": subject,
#             "html_message": html_message,
#             "offer_id": (offer.id if offer else None),
#         }
















import os
import random
import logging
from datetime import datetime
from django.urls import reverse
from django.conf import settings
from django.template.loader import render_to_string
import google.generativeai as genai
from campaigns.models import PromotionalOffer
from users.models import CustomUser

logger = logging.getLogger(__name__)

# Configuration
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
GEMINI_MODEL   = os.getenv('GEMINI_MODEL', 'models/gemini-2.0-flash')

class EmailGenerator:
    """Generates unique email content for each user"""
    def __init__(self, user: CustomUser, email_type: str = "PROMO"):
        self.user       = user
        self.email_type = email_type.upper()
        # microsecond string so each invocation is unique
        self.unique_id  = datetime.now().strftime("%f")  

    def _select_offer(self) -> PromotionalOffer | None:
        if self.email_type != "PROMO":
            return None

        qs   = PromotionalOffer.objects.filter(is_active=True)
        prefs = getattr(self.user, "preferences", None)
        if prefs:
            # only include categories user opted into
            cats = [c for c in ("finance","technology","shopping","travel") 
                    if getattr(prefs, c, False)]
            if cats:
                qs = qs.filter(category__in=cats)

        eligible = [o for o in qs if self._matches_targeting(o)]
        return random.choice(eligible) if eligible else None

    def _matches_targeting(self, offer: PromotionalOffer) -> bool:
        crit = offer.target_criteria or {}
        min_score = crit.get("min_credit_score")
        if min_score and getattr(self.user, "credit_score", 0) < min_score:
            return False
        return True

    def _generate_unique_body(self, offer: PromotionalOffer | None) -> str:
        """Generate ~20-word email body for PROMO emails"""
        # Fallback default (20 words if AI fails)
        default = "Hello, discover our latest exclusive offers tailored just for you with unbeatable savings—don’t miss out on this limited-time deal!"
        # (That default is exactly 20 words.)

        if self.email_type != "PROMO":
            return default

        if not GEMINI_API_KEY:
            logger.error("GEMINI_API_KEY not set; using default body.")
            return default

        try:
            genai.configure(api_key=GEMINI_API_KEY)
            model = genai.GenerativeModel(GEMINI_MODEL)

            # Build prompt with 20-word constraint
            prompt = (
                f"Write a promotional email body for {self.user.first_name or 'a valued customer'} "
                f"featuring 1-2 sentences about their preferences (finance={getattr(self.user.preferences,'finance',False)}, "
                f"technology={getattr(self.user.preferences,'technology',False)}, "
                f"shopping={getattr(self.user.preferences,'shopping',False)}, "
                f"travel={getattr(self.user.preferences,'travel',False)}). "
                "Use exactly 20 words total, including greeting."
            )
            if offer:
                prompt += f" Also mention this offer: {offer.title}."

            resp = model.generate_content(prompt)
            body = resp.text or default

            # Enforce 20 words if model deviated
            words = body.split()
            if len(words) > 20:
                body = " ".join(words[:20])
            return body

        except Exception as e:
            logger.exception(f"AI generation failed for {self.user.email}: {e}")
            return default


    def generate_email(self) -> dict:
        """Generate subject + HTML for this user/email-type."""
        offer = self._select_offer()
        ai_body = self._generate_unique_body(offer)

        # optional 20-word info snippet
        info_snippet = (
            "Quick Tip: Review your monthly subscriptions weekly to uncover hidden savings and keep more money in your pocket."
        )

        # combine AI body + snippet in one HTML block
        full_body = f"{ai_body}\n\n{info_snippet}"

        ctx = {
            "user":            self.user,
            "offer":           offer,
            "ai_body":         full_body,
            "site_url":        settings.SITE_URL.rstrip("/"),
            "unsubscribe_link": settings.SITE_URL.rstrip("/") + reverse("unsubscribe", args=[self.user.id]),
            "tracking_pixel":   settings.SITE_URL.rstrip("/") + reverse("track_email_open", args=[self.user.id]),
            "current_date":     datetime.now(),
        }

        html_message = render_to_string(
            f"emails/{self.email_type.lower()}.html",
            ctx
        )

        subject = (
            f"{self.user.first_name}, exclusive offer: {offer.title}"
            if offer else
            f"Special offers for you, {self.user.first_name or 'Valued Customer'}!"
        )

        return {
            "subject":     subject,
            "html_message": html_message,
            "offer_id":     offer.id if offer else None,
        }
