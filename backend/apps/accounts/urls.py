from django.urls import path
from . import views

urlpatterns = [
    path('server-status/', views.server_status, name='server_status')
]