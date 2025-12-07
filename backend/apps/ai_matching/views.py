import os
import io
import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import fitz  # PyMuPDF
from PIL import Image
import pytesseract
from pdf2image import convert_from_bytes
from bs4 import BeautifulSoup
from huggingface_hub import InferenceClient
from .serializers import (
    ScrapeSerializer,
    ResumeJDSerializer,
    EmbeddingResponseSerializer
)
from .permissions import IsCandidate

# Initialize Hugging Face client
hf_token = os.getenv("HUGGINGFACE_INFERENCE_KEY")
client = InferenceClient(model="sentence-transformers/all-MiniLM-L6-v2", token=hf_token)


class ScrapeAPIView(APIView):
    permission_classes = [IsCandidate]

    def post(self, request, *args, **kwargs):
        serializer = ScrapeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

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
            return Response(
                {"error": "Request failed", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class GetEmbeddingsView(APIView):
    """
    Accepts resume URL + JD text, extracts resume text (PDF + OCR if needed),
    generates embeddings using Hugging Face model, and returns results.
    """

    def post(self, request):
        serializer = ResumeJDSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        resume_url = serializer.validated_data['resume_url']
        jd_text = serializer.validated_data['jd_text']

        try:
            # ---------------------------
            # 1. Download Resume PDF (in memory)
            # ---------------------------
            pdf_response = requests.get(resume_url, timeout=10)
            pdf_response.raise_for_status()
            pdf_bytes = io.BytesIO(pdf_response.content)

            # ---------------------------
            # 2. Extract Text From PDF
            # ---------------------------
            doc = fitz.open(stream=pdf_bytes, filetype="pdf")
            resume_text = ""

            for page in doc:
                page_text = page.get_text()
                if page_text.strip():
                    resume_text += page_text
                else:
                    # fallback to OCR if page has no text
                    pix = page.get_pixmap()
                    img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
                    resume_text += pytesseract.image_to_string(img)
            doc.close()

            # ---------------------------
            # 3. Generate Embeddings (Hugging Face)
            # ---------------------------
            resume_embedding = client.feature_extraction([resume_text])[0]
            jd_embedding = client.feature_extraction([jd_text])[0]

            # ---------------------------
            # 4. Prepare Response
            # ---------------------------
            response_data = {
                "resume_text": resume_text,
                "resume_embedding": resume_embedding,
                "jd_text": jd_text,
                "jd_embedding": jd_embedding
            }

            response_serializer = EmbeddingResponseSerializer(response_data)

            return Response(
                {
                    "status": "success",
                    "message": "Embeddings generated successfully",
                    "data": response_serializer.data
                },
                status=status.HTTP_200_OK
            )

        except requests.exceptions.RequestException:
            return Response(
                {"status": "error", "message": "Failed to fetch resume PDF"},
                status=status.HTTP_400_BAD_REQUEST
            )

        except Exception as e:
            return Response(
                {"status": "error", "message": f"Error processing resume: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
