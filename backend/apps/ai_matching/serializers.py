from rest_framework import serializers

class ScrapeSerializer(serializers.Serializer):
    url = serializers.URLField(
        required=True,
        help_text="The URL of the webpage to scrape"
    )

class ResumeJDSerializer(serializers.Serializer):
    type = serializers.ChoiceField(
        choices=["custom", "default"],
        required=True
    )
    resume_url = serializers.URLField(required=False, allow_null=True)
    resume_text = serializers.CharField(required=False, allow_blank=True)
    jd_text = serializers.CharField(required=True)

    def validate(self, attrs):
        resume_type = attrs.get("type")

        if resume_type == "custom":
            if not attrs.get("resume_text") or not attrs["resume_text"].strip():
                raise serializers.ValidationError("resume_text is required for type=custom")

        if resume_type == "default":
            if not attrs.get("resume_url"):
                raise serializers.ValidationError("resume_url is required for type=default")

        return attrs


class EmbeddingResponseSerializer(serializers.Serializer):
    resume_text = serializers.CharField()
    resume_embedding = serializers.ListField(child=serializers.FloatField())
    jd_text = serializers.CharField()
    jd_embedding = serializers.ListField(child=serializers.FloatField())

class AnalyzeRequestSerializer(serializers.Serializer):
    jd_emb = serializers.ListField(
        child=serializers.FloatField(), allow_empty=False
    )
    resume_emb = serializers.ListField(
        child=serializers.FloatField(), allow_empty=False
    )
    jd_text = serializers.CharField()
    resume_text = serializers.CharField()