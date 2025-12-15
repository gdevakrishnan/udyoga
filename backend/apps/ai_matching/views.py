import os
import io
import requests
import fitz  # PyMuPDF
from PIL import Image
import pytesseract
from urllib.parse import urljoin

from bs4 import BeautifulSoup
from huggingface_hub import InferenceClient

from selenium import webdriver
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.firefox.options import Options as FirefoxOptions
from selenium.webdriver.edge.options import Options as EdgeOptions

from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.firefox.service import Service as FirefoxService
from selenium.webdriver.edge.service import Service as EdgeService

from webdriver_manager.chrome import ChromeDriverManager
from webdriver_manager.firefox import GeckoDriverManager
from webdriver_manager.microsoft import EdgeChromiumDriverManager

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

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
#           SELENIUM BROWSER SELECTOR
# ======================================================
def get_selenium_driver(browser="chrome"):
    browser = browser.lower()

    if browser in ["chrome", "brave"]:
        options = ChromeOptions()
        options.add_argument("--headless=new")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        options.add_argument("--window-size=1920,1080")

        return webdriver.Chrome(
            service=ChromeService(ChromeDriverManager().install()),
            options=options
        )

    if browser == "firefox":
        options = FirefoxOptions()
        options.add_argument("-headless")
        return webdriver.Firefox(
            service=FirefoxService(GeckoDriverManager().install()),
            options=options
        )

    if browser == "edge":
        options = EdgeOptions()
        options.add_argument("--headless=new")
        return webdriver.Edge(
            service=EdgeService(EdgeChromiumDriverManager().install()),
            options=options
        )

    raise ValueError("Unsupported browser")


# ======================================================
#               SCRAPER VIEW
# ======================================================
class ScrapeAPIView(APIView):
    permission_classes = [IsAuthenticated, IsCandidate]

    def post(self, request):
        serializer = ScrapeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        url = serializer.validated_data["url"]
        browser = serializer.validated_data.get("browser", "chrome")

        driver = None
        try:
            driver = get_selenium_driver(browser)
            driver.get(url)
            html = driver.page_source
        finally:
            if driver:
                driver.quit()

        soup = BeautifulSoup(html, "html.parser")

        clean_text = "\n".join(
            line.strip()
            for line in soup.get_text(separator="\n").splitlines()
            if line.strip()
        )

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
