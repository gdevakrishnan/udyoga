from rest_framework import serializers


class ScrapeSerializer(serializers.Serializer):
    url = serializers.URLField(required=True)


class ResumeJDSerializer(serializers.Serializer):
    type = serializers.ChoiceField(choices=["custom", "default"])
    resume_url = serializers.URLField(required=False, allow_blank=True)
    resume_text = serializers.CharField(required=False, allow_blank=True)
    jd_text = serializers.CharField()

    def validate(self, attrs):
        if attrs["type"] == "custom" and not attrs.get("resume_text"):
            raise serializers.ValidationError("resume_text required for custom type")

        if attrs["type"] == "default" and not attrs.get("resume_url"):
            raise serializers.ValidationError("resume_url required for default type")

        return attrs


class EmbeddingResponseSerializer(serializers.Serializer):
    resume_text = serializers.CharField()
    resume_embedding = serializers.ListField(child=serializers.FloatField())
    jd_text = serializers.CharField()
    jd_embedding = serializers.ListField(child=serializers.FloatField())


class AnalyzeRequestSerializer(serializers.Serializer):
    jd_emb = serializers.ListField(child=serializers.FloatField())
    resume_emb = serializers.ListField(child=serializers.FloatField())
    jd_text = serializers.CharField()
    resume_text = serializers.CharField()


class QueryRequestSerializer(serializers.Serializer):
    jd_emb = serializers.ListField(child=serializers.FloatField())
    resume_emb = serializers.ListField(child=serializers.FloatField())
    jd_text = serializers.CharField()
    resume_text = serializers.CharField()
    query = serializers.CharField()
    chat_history = serializers.ListField(
        child=serializers.DictField(), required=False
    )
