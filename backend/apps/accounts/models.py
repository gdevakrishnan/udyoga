from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    USER_ROLES = (
        ('candidate', 'Candidate'),
        ('recruiter', 'Recruiter'),
    )

    username = models.CharField(max_length=200, unique=True)
    email = models.EmailField(max_length=200, unique=True)
    resume = models.URLField(max_length=800, blank=True, default='')
    role = models.CharField(max_length=20, choices=USER_ROLES, default='candidate')
    company_name = models.CharField(max_length=200, blank=True, default='')
    company_description = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    REQUIRED_FIELDS = ["email"]

    def __str__(self):
        return self.username