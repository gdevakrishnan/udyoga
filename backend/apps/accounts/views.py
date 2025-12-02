from django.shortcuts import render
from django.http import JsonResponse
from django.db import connection

from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from rest_framework.response import Response

from .models import Account
from .serializers import AccountSerializer

# Server status
def server_status(request):
    try:
        connection.ensure_connection()
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"

    data = {
        "message": "Server is running",
        "database": db_status,
        "status": 200
    }
    return JsonResponse(data)


##############################################

# Authentication

class RegisterView(generics.CreateAPIView):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer
    permission_classes = [AllowAny]


class LoginView(generics.GenericAPIView):
    serializer_class = AccountSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        # Check credentials manually
        try:
            user = Account.objects.get(username=username)
        except Account.DoesNotExist:
            return Response({"detail": "Invalid username or password"}, status=400)

        if not user.check_password(password):
            return Response({"detail": "Invalid username or password"}, status=400)

        # Issue JWT tokens
        refresh = RefreshToken.for_user(user)

        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": AccountSerializer(user).data
        })

class LogoutView(generics.GenericAPIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"detail": "Logged out successfully"}, status=status.HTTP_205_RESET_CONTENT)

        except KeyError:
            return Response({"detail": "refresh token required"}, status=400)

        except TokenError:
            return Response({"detail": "invalid or expired token"}, status=400)
