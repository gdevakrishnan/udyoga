from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate
from .models import User
from rest_framework.exceptions import ValidationError
from django.db import IntegrityError


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["username", "email", "password", "role", "resume"]

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
        resume = data.get("resume")

        if role == "candidate" and not resume:
            raise serializers.ValidationError({"resume": "Resume is required for candidate role"})

        return data

    def create(self, validated_data):
        try:
            validated_data["password"] = make_password(validated_data["password"])
            return User.objects.create(**validated_data)
        except IntegrityError:
            # Database-level duplicate error
            raise serializers.ValidationError({
                "username": "This username already exists"
            })


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
            "created_at", "updated_at"
        ]
