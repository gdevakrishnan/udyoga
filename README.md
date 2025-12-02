# Udyoga
Udyoga is an AI-powered job portal that connects candidates with the most suitable job opportunities and helps HR teams efficiently manage applications. The platform leverages resume parsing and AI-based job-candidate matching to provide personalized recommendations for both candidates and recruiters.

## Folder strucutre
```
udyoga/
├── backend/
│   ├── venv/
│   ├── .env
│   ├── udyoga/
│   │   ├── __init__.py
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── apps/
│   │   ├── accounts/
│   │   ├── jobs/
│   │   └── ai_matching/
│   ├── manage.py
│   └── requirements.txt
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── tailwind.config.js
├── scripts/
├── .gitignore
└── README.md
```


---

Below is **a simple, beginner-friendly Django REST Framework (DRF) tutorial** with clear steps and sample code. It returns **JSON responses**, and you can copy & run everything as-is.

---

# ✅ **Django REST Framework (DRF) – Simple Tutorial**

We’ll build a tiny API for managing **Books**, using:

* Django
* Django REST Framework (DRF)
* JSON responses (automatically handled by DRF)

---

# 1️⃣ **Install Django & DRF**

```bash
pip install django djangorestframework
```

---

# 2️⃣ **Create a Django Project**

```bash
django-admin startproject myproject
cd myproject
```

---

# 3️⃣ **Create an App**

```bash
python manage.py startapp books
```

---

# 4️⃣ **Add app & DRF to settings**

`myproject/settings.py`

```python
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Third-party
    'rest_framework',

    # Your app
    'books',
]
```

---

# 5️⃣ **Create a Model**

`books/models.py`

```python
from django.db import models

class Book(models.Model):
    title = models.CharField(max_length=100)
    author = models.CharField(max_length=100)
    published_year = models.IntegerField()

    def __str__(self):
        return self.title
```

Apply migration:

```bash
python manage.py makemigrations
python manage.py migrate
```

---

# 6️⃣ **Create a Serializer**

Serializers convert model → JSON.

`books/serializers.py`

```python
from rest_framework import serializers
from .models import Book

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = '__all__'
```

---

# 7️⃣ **Create API Views**

We will use DRF’s simple APIView.

`books/views.py`

```python
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Book
from .serializers import BookSerializer

class BookList(APIView):
    def get(self, request):
        books = Book.objects.all()
        serializer = BookSerializer(books, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = BookSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BookDetail(APIView):
    def get_object(self, pk):
        try:
            return Book.objects.get(pk=pk)
        except Book.DoesNotExist:
            return None

    def get(self, request, pk):
        book = self.get_object(pk)
        if not book:
            return Response({"error": "Book not found"}, status=404)
        serializer = BookSerializer(book)
        return Response(serializer.data)

    def put(self, request, pk):
        book = self.get_object(pk)
        if not book:
            return Response({"error": "Book not found"}, status=404)
        serializer = BookSerializer(book, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        book = self.get_object(pk)
        if not book:
            return Response({"error": "Book not found"}, status=404)
        book.delete()
        return Response(status=204)
```

---

# 8️⃣ **Add URLs**

`books/urls.py`

```python
from django.urls import path
from .views import BookList, BookDetail

urlpatterns = [
    path('books/', BookList.as_view()),
    path('books/<int:pk>/', BookDetail.as_view()),
]
```

Include in main urls:

`myproject/urls.py`

```python
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('books.urls')),
]
```

---

# 9️⃣ **Run the Server**

```bash
python manage.py runserver
```

---

# 🔥 **Test Your API (JSON Responses)**

## ➤ GET all books

**GET** `http://127.0.0.1:8000/api/books/`

Response:

```json
[]
```

---

## ➤ POST a book

**POST** `http://127.0.0.1:8000/api/books/`

### Body (JSON):

```json
{
  "title": "Django for Beginners",
  "author": "John Doe",
  "published_year": 2024
}
```

### Response:

```json
{
  "id": 1,
  "title": "Django for Beginners",
  "author": "John Doe",
  "published_year": 2024
}
```

---

## ➤ GET single book

**GET** `http://127.0.0.1:8000/api/books/1/`

```json
{
  "id": 1,
  "title": "Django for Beginners",
  "author": "John Doe",
  "published_year": 2024
}
```

---

## ➤ PUT update book

**PUT** `http://127.0.0.1:8000/api/books/1/`

```json
{
  "title": "Updated Title",
  "author": "John Doe",
  "published_year": 2025
}
```

---

## ➤ DELETE

**DELETE** `http://127.0.0.1:8000/api/books/1/`

Response:

```json
{}
```

---

# 🎉 Completed!

You now have a fully working **REST API in Django** with:

✔ Models
✔ Serializers
✔ API Views
✔ JSON responses
✔ CRUD operations

---

If you want, I can also provide:

📌 Version using **ViewSets + Routers**
📌 Version using **generics (ListCreateAPIView, etc.)**
📌 Add authentication (JWT)
📌 Add swagger documentation

Just tell me!
