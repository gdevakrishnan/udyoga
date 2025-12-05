from django.db import connection
from rest_framework.exceptions import ValidationError
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView

from .serializers import RegisterSerializer, LoginSerializer, UserSerializer

from io import BytesIO

from .utils.supabase import upload_file, validate_resume_file
import uuid
import os



# Server status
@api_view(["GET"])
def server_status(request):
    try:
        connection.ensure_connection()
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"

    data = {
        "message": "Server is running",
        "database": db_status
    }

    return Response(
                {"data": data, "status": 200},
                status=status.HTTP_200_OK
            )


###########################################
# Authentication
@api_view(["POST"])
def register(request):
    try:
        resume = request.FILES.get('resume')
        role = request.data.get('role')
        
        # Validate resume file if provided
        if resume:
            is_valid, error_message = validate_resume_file(resume)
            if not is_valid:
                return Response(
                    {"message": error_message, "status": 400},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        # Check if candidate role requires resume
        if role == "candidate" and not resume:
            return Response(
                {"message": "Resume is required for candidate role", "status": 400},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validate serializer
        serializer = RegisterSerializer(data=request.data, context={"resume": resume})

        if serializer.is_valid():
            user = serializer.save()

            # Upload resume if provided
            if resume:
                # Generate unique filename to avoid conflicts
                file_extension = os.path.splitext(resume.name)[1]
                unique_filename = f"{user.username}_{uuid.uuid4().hex}{file_extension}"
                file_path = f"{user.username}/{unique_filename}"
                
                resume_url = upload_file(resume, file_path)
                
                if resume_url:
                    user.resume = resume_url
                    user.save()
                else:
                    # Delete user if resume upload fails
                    user.delete()
                    return Response(
                        {"message": "Failed to upload resume. Please try again.", "status": 500},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR
                    )

            return Response(
                {
                    "message": "User registered successfully",
                    "status": 201,
                    "user": {
                        "id": user.id,
                        "username": user.username,
                        "email": user.email,
                        "role": user.role
                    }
                },
                status=status.HTTP_201_CREATED
            )

        else:
            return Response(
                {"message": serializer.errors, "status": 400},
                status=status.HTTP_400_BAD_REQUEST
            )

    except Exception as e:
        print(f"Registration error: {str(e)}")
        return Response(
            {"message": "An error occurred during registration", "status": 500},
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