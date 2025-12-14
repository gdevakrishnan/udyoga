from rest_framework import serializers
from .models import JobDescription


class JobDescriptionSerializer(serializers.ModelSerializer):
    recruiter = serializers.ReadOnlyField(source="recruiter.id")

    class Meta:
        model = JobDescription
        fields = "__all__"

    def validate(self, data):
        if data["experience_min"] > data["experience_max"]:
            raise serializers.ValidationError(
                "experience_min cannot be greater than experience_max"
            )
        return data

class JDGenerateSerializer(serializers.Serializer):
    title = serializers.CharField()
    department = serializers.CharField(required=False, allow_blank=True)
    location = serializers.CharField()
    experience_min = serializers.IntegerField()
    experience_max = serializers.IntegerField()
    skills = serializers.ListField(
        child=serializers.CharField()
    )
