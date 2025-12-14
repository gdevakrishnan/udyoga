from django.urls import path
from .views import (
    JobDescriptionListCreateView,
    JobDescriptionDetailView,
    GenerateJDAPIView,
)

urlpatterns = [
    path("", JobDescriptionListCreateView.as_view(), name="jd-list-create"),
    path("<int:pk>/", JobDescriptionDetailView.as_view(), name="jd-detail"),

    path("generate-ai/", GenerateJDAPIView.as_view(), name="jd-generate-ai"),
]
