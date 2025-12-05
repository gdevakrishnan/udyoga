# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .permissions import IsCandidate
import requests
from bs4 import BeautifulSoup
from .serializers import ScrapeSerializer

class ScrapeAPIView(APIView):
    permission_classes = [IsCandidate]

    def post(self, request, *args, **kwargs):
        serializer = ScrapeSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        url = serializer.validated_data["url"]

        try:
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, "html.parser")

            data = {
                "title": soup.title.string if soup.title else None,
                "headings": {
                    "h1": [h.get_text(strip=True) for h in soup.find_all("h1")],
                    "h2": [h.get_text(strip=True) for h in soup.find_all("h2")],
                },
                "links": [a.get("href") for a in soup.find_all("a", href=True)],
            }
            return Response({"url": url, "data": data}, status=status.HTTP_200_OK)
        except requests.exceptions.RequestException as e:
            return Response({"error": "Request failed", "details": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
