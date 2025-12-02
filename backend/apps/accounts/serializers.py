from rest_framework import serializers
from .models import Account
from django.contrib.auth.hashers import make_password


class AccountSerializer(serializers.ModelSerializer):

    password = serializers.CharField(write_only=True)

    class Meta:
        model = Account
        fields = ['id', 'username', 'email', 'password', 'role', 'resume']

    def validate(self, data):
        role = data.get("role")
        resume = data.get("resume", "")

        # Candidate MUST provide a resume link
        if role == "candidate" and not resume:
            raise serializers.ValidationError({
                "resume": "Candidates must provide a resume link."
            })

        return data

    def create(self, validated_data):
        validated_data["password"] = make_password(validated_data["password"])
        return super().create(validated_data)
