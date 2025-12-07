from rest_framework import serializers

class ScrapeSerializer(serializers.Serializer):
    url = serializers.URLField(
        required=True,
        help_text="The URL of the webpage to scrape"
    )

class ResumeJDSerializer(serializers.Serializer):
    resume_url = serializers.URLField(required=True, help_text="URL of the resume PDF")
    jd_text = serializers.CharField(required=True, help_text="Job description text")


class EmbeddingResponseSerializer(serializers.Serializer):
    resume_text = serializers.CharField()
    resume_embedding = serializers.ListField(child=serializers.FloatField())
    jd_text = serializers.CharField()
    jd_embedding = serializers.ListField(child=serializers.FloatField())
