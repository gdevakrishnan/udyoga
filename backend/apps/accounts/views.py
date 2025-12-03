from rest_framework.exceptions import ValidationError
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView

from .serializers import RegisterSerializer, LoginSerializer, UserSerializer


@api_view(["POST"])
def register(request):
    try:
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "User registered successfully", "status": 201},
                status=status.HTTP_201_CREATED
            )

        return Response(
            {"message": serializer.errors, "status": 400},
            status=status.HTTP_400_BAD_REQUEST
        )
    except ValidationError as e:
        return Response(
            {"message": e.detail, "status": 400},
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        return Response(
            {"message": str(e), "status": 500},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    

@api_view(["POST"])
def login(request):
    try:
        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.validated_data.get("user")
            refresh = RefreshToken.for_user(user)
            user_data = UserSerializer(user).data

            return Response(
                {
                    "message": "Login successful",
                    "status": 200,
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                    "user": user_data
                },
                status=status.HTTP_200_OK
            )

        return Response(
            {"message": serializer.errors, "status": 400},
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        return Response(
            {"message": str(e), "status": 500},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


class refresh_token(TokenRefreshView):
    pass


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me(request):
    try:
        serializer = UserSerializer(request.user)
        return Response(
            {"message": "User details fetched", "status": 200, "data": serializer.data},
            status=status.HTTP_200_OK
        )
    except Exception as e:
        return Response(
            {"message": str(e), "status": 500},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout(request):
    try:
        refresh_token = request.data.get("refresh")
        token = RefreshToken(refresh_token)
        token.blacklist()

        return Response(
            {"message": "Logged out successfully", "status": 200},
            status=status.HTTP_200_OK
        )
    except Exception as e:
        return Response(
            {"message": "Invalid refresh token", "status": 400},
            status=status.HTTP_400_BAD_REQUEST
        )