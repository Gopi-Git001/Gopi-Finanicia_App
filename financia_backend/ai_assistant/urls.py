# ai_assistant/urls.py
from django.urls import path
from .views import HealthCheckView, AIChatView

urlpatterns = [
    # project‑level: path('api/ai/', include(...))
    # → GET  /api/ai/health/
    path('health/', HealthCheckView.as_view()),

    # → POST /api/ai/chat/
    path('chat/',   AIChatView.as_view()),
]
