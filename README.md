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

# API Documentation

**URL:**

```
POST /auth/register/
```

### **Sample Request Body**

```json
{
    "username": "john123",
    "email": "john@example.com",
    "password": "secret123",
    "role": "candidate",
    "resume": "resume.pdf"
}
```

### ✅ **Expected Success Response**

```json
{
    "message": "User registered successfully",
    "status": 201
}
```

---

### ❌ **If username already exists**

```json
{
    "message": {
        "username": ["This username already exists"]
    },
    "status": 400
}
```

---

### ❌ **If email already exists**

```json
{
    "message": {
        "email": ["Email already exists"]
    },
    "status": 400
}
```

---

### ❌ **If role = candidate and resume missing**

```json
{
    "message": {
        "resume": ["Resume is required for candidate role"]
    },
    "status": 400
}
```

---

# ✅ **2️⃣ Login (POST)**

**URL:**

```
POST /auth/login/
```

### **Sample Request**

```json
{
    "username": "john123",
    "password": "secret123"
}
```

### ✅ **Expected Success Response**

```json
{
    "message": "Login successful",
    "status": 200,
    "access": "your_access_token_here",
    "refresh": "your_refresh_token_here",
    "user": {
        "id": 1,
        "username": "john123",
        "email": "john@example.com",
        "role": "candidate",
        "resume": "resume.pdf",
        "created_at": "2025-02-06T12:30:00Z",
        "updated_at": "2025-02-06T12:30:00Z"
    }
}
```

---

### ❌ **Invalid password or username**

```json
{
    "message": ["Invalid username or password"],
    "status": 400
}
```

---

# ✅ **3️⃣ Refresh Token (POST)**

**URL:**

```
POST /auth/refresh/
```

### **Sample Request**

```json
{
    "refresh": "your_refresh_token_here"
}
```

### **Response (from SimpleJWT default)**

```json
{
    "access": "new_access_token_here"
}
```

---

# ✅ **4️⃣ Get Logged-in User (GET)**

**URL:**

```
GET /auth/me/
```

### **Headers**

```
Authorization: Bearer <access_token>
```

### **Success Response**

```json
{
    "message": "User details fetched",
    "status": 200,
    "data": {
        "id": 1,
        "username": "john123",
        "email": "john@example.com",
        "role": "candidate",
        "resume": "resume.pdf",
        "created_at": "2025-02-06T12:30:00Z",
        "updated_at": "2025-02-06T12:30:00Z"
    }
}
```

---

# ✅ **5️⃣ Logout (POST)**

**URL:**

```
POST /auth/logout/
```

### **Headers**

```
Authorization: Bearer <access_token>
```

### **Sample Request**

```json
{
    "refresh": "your_refresh_token_here"
}
```

### **Success Response**

```json
{
    "message": "Logged out successfully",
    "status": 200
}
```

---

### ❌ **Invalid refresh token**

```json
{
    "message": "Invalid refresh token",
    "status": 400
}
```

---

# 🎉 Ready to Test with Postman

You now have:
✔ All request bodies
✔ All response bodies
✔ All success and error examples
✔ Exact behavior based on your code

If you want, I can also create:

📌 A **Postman Collection JSON file** ready to import
📌 Swagger/OpenAPI docs
📌 cURL commands

Just tell me!
