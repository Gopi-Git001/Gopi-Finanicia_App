from django.urls import path
from . import views

urlpatterns = [
    path('track/open/<int:user_id>/', views.track_email_open, name='track_email_open'),
    path('unsubscribe/<int:user_id>/', views.handle_unsubscribe, name='unsubscribe'),
]