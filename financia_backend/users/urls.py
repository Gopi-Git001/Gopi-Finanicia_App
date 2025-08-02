# users/urls.py

from django.urls import path
from .views import RegisterView, LoginView, RefreshView, ProfileView

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/",    LoginView.as_view(),    name="login"),
    path("refresh/",  RefreshView.as_view(),  name="token_refresh"),
    path("profile/",  ProfileView.as_view(),  name="profile"),
]
