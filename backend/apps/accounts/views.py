from django.shortcuts import render
from django.http import JsonResponse

# Create your views here.
def server_status (request):
    data = {
        "message": "Server was running",
        "status": 201
    }
    return JsonResponse(data)
