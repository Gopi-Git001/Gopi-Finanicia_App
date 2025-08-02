# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status

# class AIChatView(APIView):
#     def post(self, request):
#         user_message = request.data.get("message", "")
#         # For now, mimic your generateAIResponse logic here.
#         response_text = self.generate_ai_response(user_message)
#         return Response({"response": response_text})

#     def generate_ai_response(self, user_input):
#         input = user_input.lower()
#         if "insurance" in input or "policy" in input:
#             return "I can help you with insurance! Based on your profile, I see you have auto and home insurance..."
#         if "credit" in input or "score" in input:
#             return "Your current credit score is 730 - that's excellent! ..."
#         if "loan" in input or "borrow" in input:
#             return "Based on your credit profile, you're pre-qualified for personal loans up to $50,000 at 5.99% APR..."
#         if "claim" in input or "file" in input:
#             return "I can help you file a claim! I'll need some basic information..."
#         if "compare" in input or "rates" in input:
#             return "I'd be happy to help you compare rates! ..."
#         return "I understand you're looking for help with your finances. Could you be more specific?"


# import requests
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status
# from django.conf import settings

# # Either set GEMINI_API_KEY here or load from settings.py (recommended)
# GEMINI_API_KEY = getattr(settings, "GEMINI_API_KEY", "AIzaSyD0iiKMZaw5SCL-4mev6HsGDnTxQfBT1OU")
# GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent"


# class AIChatView(APIView):   # <-- Make sure the class name matches your urls.py import!
#     def post(self, request):
#         user_message = request.data.get("message", "")

#         payload = {
#             "contents": [
#                 {"role": "user", "parts": [{"text": user_message}]}
#             ]
#         }
#         headers = {
#             "Content-Type": "application/json"
#         }
#         params = {
#             "key": GEMINI_API_KEY
#         }

#         try:
#             resp = requests.post(GEMINI_API_URL, json=payload, headers=headers, params=params)
#             resp.raise_for_status()
#             data = resp.json()
#             ai_text = (
#                 data.get("candidates", [{}])[0]
#                     .get("content", {})
#                     .get("parts", [{}])[0]
#                     .get("text", "Sorry, I couldn’t get a response from Gemini.")
#             )
#             return Response({"response": ai_text})
#         except Exception as e:
#             print("Gemini error:", e)
#             return Response(
#                 {"response": "Sorry, I couldn’t get a response from Gemini."},
#                 status=status.HTTP_500_INTERNAL_SERVER_ERROR
#             )


#------------------------------------------------------------------------------------------------------
# import requests
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status
# from django.views.decorators.csrf import csrf_exempt
# from django.utils.decorators import method_decorator

# GEMINI_API_KEY = "AIzaSyD0iiKMZaw5SCL-4mev6HsGDnTxQfBT1OU"
# GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent"

# @method_decorator(csrf_exempt, name='dispatch')
# class HealthCheckView(APIView):
#     permission_classes = []

#     def get(self, request):
#         return Response({"status": "ok"}, status=status.HTTP_200_OK)


# @method_decorator(csrf_exempt, name='dispatch')
# class AIChatView(APIView):
#     permission_classes = []
    
#     def post(self, request):
#         user_message = request.data.get("message", "")
#         #print("USER:", user_message)

#         payload = {
#             "contents": [
#                 {"role": "user", "parts": [{"text": user_message}]}
#             ]
#         }
#         headers = {"Content-Type": "application/json"}
#         params = {"key": GEMINI_API_KEY}

#         try:
#             resp = requests.post(GEMINI_API_URL, json=payload, headers=headers, params=params)
#             #print("Gemini API status:", resp.status_code)
#             #print("Gemini API raw response:", resp.text)
#             resp.raise_for_status()
#             data = resp.json()
#             ai_text = (
#                 data.get("candidates", [{}])[0]
#                     .get("content", {})
#                     .get("parts", [{}])[0]
#                     .get("text", "Sorry, I couldn’t get a response from Gemini.")
#             )
#             #print("AI RESPONSE:", ai_text)
#             return Response({"response": ai_text})
#         except Exception as e:
#             print("Gemini error:", e)
#             return Response(
#                 {"response": "Sorry, I couldn’t get a response from Gemini."},
#                 status=status.HTTP_500_INTERNAL_SERVER_ERROR
#             )




# ai_assistant/views.py

# ai_assistant/views.py
#-------------------------------------------------------------------------------------------------------------------------------------
# import os
# import json
# import time
# import requests

# from django.views.decorators.csrf import csrf_exempt
# from django.utils.decorators import method_decorator
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status

# # ─── CONFIGURATION ────────────────────────────────────────────────────────────

# BASE_DIR        = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# DATA_DIR        = os.path.join(BASE_DIR, "data")
# CHUNKS_PATH     = os.path.join(DATA_DIR, "policy_chunks.json")

# # Load your pre‑chunked policy excerpts once
# with open(CHUNKS_PATH, "r", encoding="utf-8") as f:
#     CHUNKS = json.load(f)

# TOP_K           = 3
# GEMINI_API_KEY  = os.getenv("GEMINI_API_KEY", "<your-key>")
# GEMINI_URL      = (
#     "https://generativelanguage.googleapis.com/v1/"
#     "models/gemini-2.0-flash:generateContent"
# )

# # ─── VIEWS ─────────────────────────────────────────────────────────────────────

# @method_decorator(csrf_exempt, name='dispatch')
# class HealthCheckView(APIView):
#     permission_classes = []

#     def get(self, request):
#         return Response({"status": "ok"}, status=status.HTTP_200_OK)


# @method_decorator(csrf_exempt, name='dispatch')
# class AIChatView(APIView):
#     permission_classes = []

#     def post(self, request):
#         # 1) Validate input
#         user_message = (request.data or {}).get("message", "").strip()
#         if not user_message:
#             return Response(
#                 {"response": "Please send a non-empty `message`."},
#                 status=status.HTTP_400_BAD_REQUEST
#             )

#         # 2) Simple retrieval by term‑overlap
#         terms = set(user_message.lower().split())
#         scored = [
#             (sum(w in terms for w in chunk["chunk_text"].lower().split()), chunk["chunk_text"])
#             for chunk in CHUNKS
#         ]
#         top_snippets = [txt for score, txt in sorted(scored, reverse=True)[:TOP_K] if score > 0]
#         if not top_snippets and CHUNKS:
#             top_snippets = [CHUNKS[0]["chunk_text"]]
#         context = "\n\n---\n\n".join(top_snippets)

#         # 3) Assemble single user‑role prompt
#         instructions = (
#             "You are a financial assistant. Use ONLY the following policy excerpts "
#             "to answer the user’s question. If you don’t find the answer there, say you’re not sure.\n\n"
#             f"{context}"
#         )
#         prompt = f"{instructions}\n\nUser question: {user_message}"
#         payload = {
#             "contents": [
#                 {"role": "user", "parts": [{"text": prompt}]}
#             ]
#         }

#         headers = {"Content-Type": "application/json"}
#         params  = {"key": GEMINI_API_KEY}

#         # 4) Call generateContent with retry on 503
#         for attempt in range(1, 4):
#             try:
#                 resp = requests.post(GEMINI_URL, json=payload, params=params, headers=headers)
#                 resp.raise_for_status()
#                 data = resp.json()
#                 ai_text = (
#                     data.get("candidates", [{}])[0]
#                         .get("content", {})
#                         .get("parts", [{}])[0]
#                         .get("text", "Sorry, I couldn’t get a response.")
#                 )
#                 return Response({"response": ai_text})

#             except requests.HTTPError as e:
#                 code = e.response.status_code
#                 # Retry on 503
#                 if code == 503 and attempt < 3:
#                     wait = 2 ** attempt
#                     print(f"Attempt {attempt} got 503, retrying in {wait}s...")
#                     time.sleep(wait)
#                     continue
#                 # Final 503 or other HTTP errors
#                 print(f"AIChatView HTTPError ({code}):", e.response.text)
#                 if code == 503:
#                     return Response(
#                         {"response": "The service is busy right now—please try again shortly."}
#                     )
#                 return Response(
#                     {"response": "Sorry, I couldn’t get a response from Gemini."}
#                 )
#             except Exception as e:
#                 print("AIChatView Error:", e)
#                 return Response(
#                     {"response": "Sorry, something went wrong processing your request."}
#                 )

#         # Fallback if somehow loop exits
#         return Response(
#             {"response": "Sorry, I couldn’t get a response at this time."}
#         )



# ai_assistant/views.py

# ai_assistant/views.py

# import os
# import json
# import requests

# from django.views.decorators.csrf import csrf_exempt
# from django.utils.decorators import method_decorator
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status

# # ─── CONFIGURATION ───────────────────────────────────────────────────────────

# BASE_DIR        = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# DATA_DIR        = os.path.join(BASE_DIR, "data")

# # Load policies and chunks
# with open(os.path.join(DATA_DIR, "policies.json"), "r", encoding="utf-8") as f:
#     POLICIES = json.load(f)
# with open(os.path.join(DATA_DIR, "policy_chunks.json"), "r", encoding="utf-8") as f:
#     CHUNKS   = json.load(f)

# GEMINI_API_KEY  = os.getenv("GEMINI_API_KEY", "<your-key>")
# GEMINI_URL      = (
#     "https://generativelanguage.googleapis.com/v1/"
#     "models/gemini-2.0-flash:generateContent"
# )

# TOP_K           = 1   # we only need the single best snippet

# # ─── VIEWS ─────────────────────────────────────────────────────────────────────

# @method_decorator(csrf_exempt, name='dispatch')
# class HealthCheckView(APIView):
#     permission_classes = []
#     def get(self, request):
#         return Response({"status": "ok"}, status=status.HTTP_200_OK)


# @method_decorator(csrf_exempt, name='dispatch')
# class AIChatView(APIView):
#     permission_classes = []

#     def post(self, request):
#         user_message = (request.data or {}).get("message", "").strip()
#         if not user_message:
#             return Response(
#                 {"response": "Please send me a message so I can help!"},
#                 status=status.HTTP_400_BAD_REQUEST
#             )

#         # 1) Find best‑matching snippet by keyword overlap:
#         query_terms = set(user_message.lower().split())
#         best = (0, None)
#         for chunk in CHUNKS:
#             words = chunk["chunk_text"].lower().split()
#             score = sum(w in query_terms for w in words)
#             if score > best[0]:
#                 best = (score, chunk["chunk_text"])

#         if best[0] == 0:
#             # No policy terms matched
#             return Response({
#                 "response": "I’m not sure I understand—could you clarify which policy you mean?"
#             })

#         snippet = best[1]

#         # 2) Build a gentle paraphrasing prompt
#         prompt = (
#             "Please answer the following customer question by paraphrasing this company policy excerpt in a friendly, \
# conversational tone. If it does not answer the question exactly, politely say so.\n\n"
#             f"Policy excerpt:\n\"{snippet}\"\n\n"
#             f"Customer question:\n\"{user_message}\""
#         )

#         payload = {
#             "contents": [
#                 {"role": "user", "parts": [{"text": prompt}]}
#             ]
#         }

#         headers = {"Content-Type": "application/json"}
#         params  = {"key": GEMINI_API_KEY}

#         # 3) Call Gemini to paraphrase
#         try:
#             resp = requests.post(GEMINI_URL, json=payload, params=params, headers=headers)
#             resp.raise_for_status()
#             data = resp.json()
#             answer = (
#                 data.get("candidates", [{}])[0]
#                     .get("content", {})
#                     .get("parts", [{}])[0]
#                     .get("text", "")
#             ).strip()
#             if not answer:
#                 raise ValueError("Empty response")
#             return Response({"response": answer})
#         except Exception:
#             # On any failure, fall back to sending the raw snippet
#             return Response({
#                 "response": snippet
#             })


# ai_assistant/views.py

import os
import json
import requests

from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

# ─── CONFIGURATION ───────────────────────────────────────────────────────────

BASE_DIR       = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR       = os.path.join(BASE_DIR, "data")

# Load policies and chunks
with open(os.path.join(DATA_DIR, "policies.json"), "r", encoding="utf-8") as f:
    POLICIES = json.load(f)
with open(os.path.join(DATA_DIR, "policy_chunks.json"), "r", encoding="utf-8") as f:
    CHUNKS   = json.load(f)

# Precompute lists
POLICY_TITLES = [p["title"] for p in POLICIES]
LOAN_POLICIES = [p for p in POLICIES if p["dept"].lower() == "loans"]
LOAN_TITLES   = [p["title"] for p in LOAN_POLICIES]

TOP_K           = 1   # we only paraphrase the single best match
GEMINI_API_KEY  = os.getenv("GEMINI_API_KEY", "<your-key>")
GEMINI_URL      = (
    "https://generativelanguage.googleapis.com/v1/"
    "models/gemini-2.0-flash:generateContent"
)

GREETINGS       = {"hello", "hi", "hey", "good morning", "good afternoon", "good evening"}


# ─── VIEWS ─────────────────────────────────────────────────────────────────────

@method_decorator(csrf_exempt, name='dispatch')
class HealthCheckView(APIView):
    permission_classes = []
    def get(self, request):
        return Response({"status": "ok"}, status=status.HTTP_200_OK)


@method_decorator(csrf_exempt, name='dispatch')
class AIChatView(APIView):
    permission_classes = []

    def post(self, request):
        text = (request.data or {}).get("message", "").strip()
        if not text:
            return Response(
                {"response": "Please send a message so I can assist you."},
                status=status.HTTP_400_BAD_REQUEST
            )

        lower = text.lower()

        # 1) Natural greeting
        if any(lower == g or lower.startswith(g + " ") for g in GREETINGS):
            return Response({
                "response": f"{text.capitalize()}! How can I help you today?"
            })

        # 2) List all policies
        if "policy" in lower and any(verb in lower for verb in ("list", "show", "what", "give")):
            return Response({
                "response": "Here are our current policies:\n• " +
                            "\n• ".join(POLICY_TITLES)
            })

        # 3) List all loans
        if "loan" in lower and any(verb in lower for verb in ("all", "list", "what")):
            if LOAN_TITLES:
                return Response({
                    "response": "We offer the following loan products:\n• " +
                                "\n• ".join(LOAN_TITLES)
                })
            # fallback if none
            return Response({"response": "We currently offer personal loans only."})

        # 4) Direct policy lookup by keyword overlap
        terms  = set(lower.split())
        best   = (0, None)
        for chunk in CHUNKS:
            words = chunk["chunk_text"].lower().split()
            score = sum(w in terms for w in words)
            if score > best[0]:
                best = (score, chunk["chunk_text"])

        if best[0] == 0:
            # No relevant policy found
            return Response({
                "response": "I’m not sure I understand—could you clarify which policy you’re interested in?"
            })

        snippet = best[1]

        # 5) Paraphrase via Gemini
        prompt = (
            "Paraphrase the following company policy excerpt into a friendly, "
            "conversational answer to the customer’s question. If it doesn’t fully answer, say so politely.\n\n"
            f"Policy excerpt:\n\"{snippet}\"\n\n"
            f"Customer question:\n\"{text}\""
        )
        payload = {
            "contents": [
                {"role": "user", "parts": [{"text": prompt}]}
            ]
        }
        headers = {"Content-Type": "application/json"}
        params  = {"key": GEMINI_API_KEY}

        try:
            resp = requests.post(GEMINI_URL, json=payload, params=params, headers=headers)
            resp.raise_for_status()
            data = resp.json()
            reply = (
                data.get("candidates", [{}])[0]
                    .get("content", {})
                    .get("parts", [{}])[0]
                    .get("text", "")
            ).strip()
            if reply:
                return Response({"response": reply})
        except Exception:
            pass

        # 6) Fallback to raw snippet
        return Response({"response": snippet})

