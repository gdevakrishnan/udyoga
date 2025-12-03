from django.urls import path
from .views import server_status, register, login, refresh_token, me, logout

urlpatterns = [
    path("server-status/", server_status, name="server-status"),
    path("auth/register/", register, name="register"),
    path("auth/login/", login, name="login"),
    path("auth/refresh/", refresh_token.as_view(), name="token_refresh"),
    path("auth/me/", me, name="user_detail"),
    path("auth/logout/", logout, name="logout"),
]
