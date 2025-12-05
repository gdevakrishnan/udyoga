from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate
from .models import User
from rest_framework.exceptions import ValidationError
from django.db import IntegrityError

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ["username", "email", "password", "role", "company_name", "company_description"]

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists")
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists")
        return value

    def validate(self, data):
        role = data.get("role")
        resume = self.context.get("resume")

        if role == "candidate":
            if not resume:
                raise serializers.ValidationError({"resume": "Resume is required for candidate role"})
        
        if role == "recruiter":
            if not data.get("company_name"):
                raise serializers.ValidationError({"company_name": "Company name is required for recruiter role"})
            if not data.get("company_description"):
                raise serializers.ValidationError({"company_description": "Company description is required for recruiter role"})
            
            if resume:
                raise serializers.ValidationError({"resume": "Recruiters cannot upload resumes"})

        return data

    def create(self, validated_data):
        validated_data["password"] = make_password(validated_data["password"])
        return User.objects.create(**validated_data)

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(
            username=data.get("username"),
            password=data.get("password")
        )

        if not user:
            raise serializers.ValidationError("Invalid username or password")

        data["user"] = user
        return data


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id", "username", "email", "role", "resume",
            "company_name", "company_description",
            "created_at", "updated_at"
        ]
