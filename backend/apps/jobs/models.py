from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL


class JobDescription(models.Model):
    STATUS_CHOICES = (
        ("draft", "Draft"),
        ("published", "Published"),
    )

    recruiter = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="job_descriptions"
    )

    title = models.CharField(max_length=255)
    department = models.CharField(max_length=200, blank=True)
    location = models.CharField(max_length=200)

    experience_min = models.PositiveIntegerField()
    experience_max = models.PositiveIntegerField()

    skills = models.JSONField(default=list)

    description = models.TextField()
    responsibilities = models.TextField()
    qualifications = models.TextField()

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="draft"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} - {self.recruiter}"
