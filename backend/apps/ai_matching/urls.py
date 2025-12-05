from django.urls import path
from .views import ScrapeAPIView

urlpatterns = [
    path("scrape/", ScrapeAPIView.as_view(), name="scrape"),
]
