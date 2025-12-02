from django.shortcuts import render
from django.http import JsonResponse
from django.db import connection

# Server status
def server_status(request):
    try:
        connection.ensure_connection()
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"

    data = {
        "message": "Server is running",
        "database": db_status,
        "status": 200
    }
    return JsonResponse(data)
