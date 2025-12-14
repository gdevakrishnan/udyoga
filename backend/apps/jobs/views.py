from rest_framework.generics import (
    ListCreateAPIView,
    RetrieveUpdateDestroyAPIView
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

from .models import JobDescription
from .serializers import JobDescriptionSerializer, JDGenerateSerializer
from .permissions import IsRecruiter
from .utils.jd_generator import generate_jd_with_groq

class JobDescriptionListCreateView(ListCreateAPIView):
    serializer_class = JobDescriptionSerializer
    permission_classes = [IsAuthenticated, IsRecruiter]

    def get_queryset(self):
        return JobDescription.objects.filter(
            recruiter=self.request.user
        )

    def perform_create(self, serializer):
        serializer.save(recruiter=self.request.user)


class JobDescriptionDetailView(RetrieveUpdateDestroyAPIView):
    serializer_class = JobDescriptionSerializer
    permission_classes = [IsAuthenticated, IsRecruiter]

    def get_queryset(self):
        return JobDescription.objects.filter(
            recruiter=self.request.user
        )

class GenerateJDAPIView(APIView):
    permission_classes = [IsAuthenticated, IsRecruiter]

    def post(self, request):
        serializer = JDGenerateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        user = request.user

        if not user.company_name or not user.company_description:
            return Response(
                {
                    "status": "error",
                    "message": "Recruiter company profile is incomplete"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            jd = generate_jd_with_groq(
                company_name=user.company_name,
                company_description=user.company_description,
                title=data["title"],
                department=data.get("department", ""),
                location=data["location"],
                experience_min=data["experience_min"],
                experience_max=data["experience_max"],
                skills=data["skills"]
            )

            return Response(
                {
                    "status": 200,
                    "message": "JD generated successfully",
                    "data": jd
                },
                status=status.HTTP_200_OK
            )

        except Exception as e:
            return Response(
                {"status": "error", "message": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
