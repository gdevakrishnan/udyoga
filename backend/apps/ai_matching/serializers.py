from rest_framework import serializers

class ScrapeSerializer(serializers.Serializer):
    url = serializers.URLField(
        required=True,
        help_text="The URL of the webpage to scrape"
    )
