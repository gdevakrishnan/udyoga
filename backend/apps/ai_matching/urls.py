from django.urls import path
from .views import ScrapeAPIView, GetEmbeddingsView, AnalyzeResumeJDView, QueryResumeJDView

urlpatterns = [
    path("scrape/", ScrapeAPIView.as_view(), name="scrape"),
    path("get-embeddings/", GetEmbeddingsView.as_view(), name="get-embeddings"),
    path("analyze/", AnalyzeResumeJDView.as_view(), name="analyze-resume-jd"),
    path("query/", QueryResumeJDView.as_view(), name="ai_query"),
]