import os
import io
import requests
import fitz  # PyMuPDF
from PIL import Image
import pytesseract

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from pdf2image import convert_from_bytes
from bs4 import BeautifulSoup
from huggingface_hub import InferenceClient

from selenium import webdriver
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.firefox.options import Options as FirefoxOptions
from selenium.webdriver.edge.options import Options as EdgeOptions

# ✅ MISSING IMPORTS (Fix for your error)
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.firefox.service import Service as FirefoxService
from selenium.webdriver.edge.service import Service as EdgeService

from webdriver_manager.chrome import ChromeDriverManager
from webdriver_manager.firefox import GeckoDriverManager
from webdriver_manager.microsoft import EdgeChromiumDriverManager

from urllib.parse import urljoin

from .serializers import ScrapeSerializer, ResumeJDSerializer, EmbeddingResponseSerializer
from .permissions import IsCandidate


# ------------------------------------
# Hugging Face Embedding Client
# ------------------------------------
hf_token = os.getenv("HUGGINGFACE_INFERENCE_KEY")
client = InferenceClient(model="sentence-transformers/all-MiniLM-L6-v2", token=hf_token)


# ======================================================
#           SELENIUM BROWSER SELECTOR
# ======================================================
def get_selenium_driver(browser: str = "chrome"):
    browser = browser.lower()

    # Chrome / Brave
    if browser in ["chrome", "brave"]:
        options = ChromeOptions()
        options.add_argument("--headless=new")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-gpu")
        options.add_argument("--disable-dev-shm-usage")
        options.add_argument("--window-size=1920,1080")

        return webdriver.Chrome(
            service=ChromeService(ChromeDriverManager().install()),
            options=options
        )

    # Firefox
    elif browser == "firefox":
        options = FirefoxOptions()
        options.add_argument("-headless")

        return webdriver.Firefox(
            service=FirefoxService(GeckoDriverManager().install()),
            options=options
        )

    # Edge
    elif browser == "edge":
        options = EdgeOptions()
        options.add_argument("--headless=new")

        return webdriver.Edge(
            service=EdgeService(EdgeChromiumDriverManager().install()),
            options=options
        )

    raise ValueError(f"Unsupported browser '{browser}'. Use chrome, brave, firefox, or edge.")


# ======================================================
#               SCRAPER VIEW
# ======================================================
class ScrapeAPIView(APIView):
    permission_classes = [IsCandidate]

    def post(self, request, *args, **kwargs):
        serializer = ScrapeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        url = serializer.validated_data["url"]
        browser = request.data.get("browser", "chrome")

        try:
            # Launch correct browser
            driver = get_selenium_driver(browser)
            driver.get(url)
            driver.implicitly_wait(5)

            html = driver.page_source
            driver.quit()

            soup = BeautifulSoup(html, "html.parser")

            # Extract title
            title = soup.title.string.strip() if soup.title else None

            # META DATA
            meta = {
                "description": None,
                "keywords": None,
                "og": {},
                "twitter": {}
            }

            desc_tag = soup.find("meta", attrs={"name": "description"})
            if desc_tag:
                meta["description"] = desc_tag.get("content")

            keywords_tag = soup.find("meta", attrs={"name": "keywords"})
            if keywords_tag:
                meta["keywords"] = keywords_tag.get("content")

            # OG tags
            for tag in soup.find_all("meta", property=True):
                prop = tag.get("property")
                if prop.startswith("og:"):
                    meta["og"][prop] = tag.get("content")

            # Twitter tags
            for tag in soup.find_all("meta", attrs={"name": True}):
                name = tag.get("name")
                if name.startswith("twitter:"):
                    meta["twitter"][name] = tag.get("content")

            # HEADINGS
            headings = {
                f"h{i}": [h.get_text(strip=True) for h in soup.find_all(f"h{i}")]
                for i in range(1, 7)
            }

            # PARAGRAPHS
            paragraphs = [
                p.get_text(strip=True) for p in soup.find_all("p")
                if p.get_text(strip=True)
            ]

            # LINKS
            links = []
            for a in soup.find_all("a", href=True):
                href = a["href"]
                abs_link = urljoin(url, href)
                links.append({
                    "text": a.get_text(strip=True),
                    "href": href,
                    "absolute": abs_link
                })

            # IMAGES
            images = []
            for img in soup.find_all("img"):
                images.append({
                    "src": urljoin(url, img.get("src")),
                    "alt": img.get("alt")
                })

            # FULL TEXT
            raw_text = soup.get_text(separator="\n")
            clean_text = "\n".join(
                line.strip()
                for line in raw_text.splitlines()
                if line.strip()
            )

            # COMBINED TEXT
            full_text = (
                f"TITLE:\n{title}\n\n" if title else "" +
                f"DESCRIPTION:\n{meta.get('description')}\n\n" if meta.get("description") else "" +
                "HEADINGS:\n" + "\n".join(
                    [f"{tag.upper()}: {', '.join(values)}" for tag, values in headings.items() if values]
                ) + "\n\n" +
                "PARAGRAPHS:\n" + "\n".join(paragraphs) + "\n\n" +
                "LINKS:\n" + "\n".join([l["absolute"] for l in links]) + "\n\n" +
                "IMAGES:\n" + "\n".join([img["src"] for img in images]) + "\n\n" +
                "FULL PAGE TEXT:\n" + clean_text
            )

            return Response({
                "status": "success",
                "data": {
                    "url": url,
                    "browser": browser,
                    "title": title,
                    "meta": meta,
                    "headings": headings,
                    "paragraphs": paragraphs,
                    "links": links,
                    "images": images,
                    "text": clean_text,
                    "full_text": full_text
                }
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {"status": "error", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# ======================================================
#                 EMBEDDINGS VIEW
# ======================================================
class GetEmbeddingsView(APIView):
    permission_classes = [IsCandidate]

    def post(self, request):
        serializer = ResumeJDSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        resume_url = serializer.validated_data['resume_url']
        jd_text = serializer.validated_data['jd_text']

        try:
            pdf_response = requests.get(resume_url, timeout=10)
            pdf_response.raise_for_status()
            pdf_bytes = io.BytesIO(pdf_response.content)

            doc = fitz.open(stream=pdf_bytes, filetype="pdf")
            resume_text = ""

            for page in doc:
                text = page.get_text()

                if text.strip():
                    resume_text += text
                else:
                    # OCR fallback
                    pix = page.get_pixmap()
                    img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
                    resume_text += pytesseract.image_to_string(img)

            doc.close()

            # Generate embeddings
            resume_embedding = client.feature_extraction([resume_text])[0]
            jd_embedding = client.feature_extraction([jd_text])[0]

            response_data = {
                "resume_text": resume_text,
                "resume_embedding": resume_embedding,
                "jd_text": jd_text,
                "jd_embedding": jd_embedding
            }

            response_serializer = EmbeddingResponseSerializer(response_data)

            return Response({
                "status": "success",
                "message": "Embeddings generated successfully",
                "data": response_serializer.data
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {"status": "error", "message": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
