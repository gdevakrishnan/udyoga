from django.urls import path
from .views import ScrapeAPIView, GetEmbeddingsView

urlpatterns = [
    path("scrape/", ScrapeAPIView.as_view(), name="scrape"),
    path("get-embeddings/", GetEmbeddingsView.as_view(), name="get-embeddings"),
]