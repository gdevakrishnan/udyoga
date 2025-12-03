from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    USER_ROLES = (
        ('candidate', 'Candidate'),
        ('recruiter', 'Recruiter'),
    )

    username = models.CharField(max_length=200, unique=True)
    email = models.EmailField(max_length=200, unique=True)
    resume = models.CharField(max_length=200, blank=True, default='')
    role = models.CharField(max_length=20, choices=USER_ROLES, default='candidate')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    REQUIRED_FIELDS = ["", "email"]

    def __str__(self):
        return self.username
