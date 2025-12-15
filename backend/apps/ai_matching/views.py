import os
import io
import requests
import fitz  # PyMuPDF
from PIL import Image
import pytesseract
from urllib.parse import urljoin

from bs4 import BeautifulSoup
from huggingface_hub import InferenceClient

from webdriver_manager.chrome import ChromeDriverManager
from webdriver_manager.firefox import GeckoDriverManager
from webdriver_manager.microsoft import EdgeChromiumDriverManager

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from bs4 import BeautifulSoup
import requests
from urllib.parse import urljoin, urlparse

from .permissions import IsCandidate
from .serializers import ScrapeSerializer

from .permissions import IsCandidate
from .serializers import (
    ScrapeSerializer,
    ResumeJDSerializer,
    EmbeddingResponseSerializer,
    AnalyzeRequestSerializer,
    QueryRequestSerializer
)
from .utils.analysisUtils import analyze, query_resume_jd


# ------------------------------------
# Hugging Face Embedding Client
# ------------------------------------
hf_token = os.getenv("HUGGINGFACE_INFERENCE_KEY")
client = InferenceClient(
    model="sentence-transformers/all-MiniLM-L6-v2",
    token=hf_token
)

MAX_TEXT_CHARS = 8000

# ======================================================
#               SCRAPER VIEW
# ======================================================
class ScrapeAPIView(APIView):
    permission_classes = [IsAuthenticated, IsCandidate]

    def post(self, request):
        serializer = ScrapeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        url = serializer.validated_data["url"]
        max_depth = serializer.validated_data.get("max_depth", 2)  # recursive depth limit

        visited = set()

        def scrape_page(url, depth=0):
            if url in visited or depth > max_depth:
                return ""

            try:
                response = requests.get(url, timeout=10)
                response.raise_for_status()
                visited.add(url)
            except requests.RequestException:
                return ""

            soup = BeautifulSoup(response.text, "html.parser")
            page_text = "\n".join(
                line.strip() for line in soup.get_text(separator="\n").splitlines() if line.strip()
            )

            # Follow internal links for deep scraping
            domain = urlparse(url).netloc
            for link_tag in soup.find_all("a", href=True):
                link = urljoin(url, link_tag["href"])
                if urlparse(link).netloc == domain:
                    page_text += "\n" + scrape_page(link, depth + 1)

            return page_text

        clean_text = scrape_page(url)

        return Response(
            {
                "status": "success",
                "data": {
                    "url": url,
                    "text": clean_text
                }
            },
            status=status.HTTP_200_OK
        )
    
# ======================================================
#                 EMBEDDINGS VIEW
# ======================================================
class GetEmbeddingsView(APIView):
    permission_classes = [IsAuthenticated, IsCandidate]

    def post(self, request):
        serializer = ResumeJDSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        try:
            if data["type"] == "custom":
                resume_text = data["resume_text"].strip()

            else:
                pdf_response = requests.get(
                    data["resume_url"],
                    timeout=10,
                    stream=True
                )
                pdf_response.raise_for_status()

                doc = fitz.open(
                    stream=pdf_response.content,
                    filetype="pdf"
                )

                resume_text = ""
                for page in doc:
                    text = page.get_text()
                    if text.strip():
                        resume_text += text
                    else:
                        pix = page.get_pixmap()
                        img = Image.frombytes(
                            "RGB",
                            [pix.width, pix.height],
                            pix.samples
                        )
                        resume_text += pytesseract.image_to_string(img)

                doc.close()

            resume_text = resume_text[:MAX_TEXT_CHARS]
            jd_text = data["jd_text"][:MAX_TEXT_CHARS]

            resume_embedding = client.feature_extraction([resume_text])[0]
            jd_embedding = client.feature_extraction([jd_text])[0]

            response = EmbeddingResponseSerializer({
                "resume_text": resume_text,
                "resume_embedding": resume_embedding,
                "jd_text": jd_text,
                "jd_embedding": jd_embedding
            })

            return Response(
                {
                    "status": "success",
                    "message": "Resume and JD analyzed successfully",
                    "data": response.data
                },
                status=status.HTTP_200_OK
            )

        except Exception as e:
            return Response(
                {"status": "error", "message": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# ======================================================
#                    ANALYSIS
# ======================================================
class AnalyzeResumeJDView(APIView):
    permission_classes = [IsAuthenticated, IsCandidate]

    def post(self, request):
        serializer = AnalyzeRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        result = analyze(**serializer.validated_data)
        return Response(result, status=status.HTTP_200_OK)


class QueryResumeJDView(APIView):
    permission_classes = [IsAuthenticated, IsCandidate]

    def post(self, request):
        serializer = QueryRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        result = query_resume_jd(**serializer.validated_data)
        return Response(result, status=status.HTTP_200_OK)
