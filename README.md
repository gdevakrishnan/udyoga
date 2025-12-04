# **Udyoga – AI-Powered Career Assistant**

---

## **1. Introduction**

**Udyoga** is an AI-driven career assistant designed for college students to evaluate job opportunities, assess their fit, and improve their applications. The platform allows students to:

* Paste/upload a **resume**
* Paste/upload a **job description (JD)**
* Get a **match score** and **gap analysis**
* Receive **personalized improvement tips**
* Explore **job recommendations** based on their profile

Udyoga leverages AI technologies to provide actionable career insights and guidance, making the job application process smarter and more effective.

---

## **2. Tech Stack**

| **Technology / Tool**             | **Purpose in Udyoga**                    | **Why Chosen / Benefits**                                                                                    |
| --------------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| **React.js**                      | Frontend UI                              | Fast, component-based, ideal for interactive dashboards and forms for resume/JD upload and analysis results. |
| **Django REST Framework**         | Backend API                              | Handles requests, user data, and AI processing logic; robust and scalable.                                   |
| **MongoDB**                       | Database                                 | Stores jobs, user profiles, resume data, and embeddings; flexible document-based schema.                     |
| **LlamaIndex**                    | Resume & Job embedding + vector storage  | Enables semantic similarity search for accurate resume-job matching.                                         |
| **LangChain**                     | Job recommendation & conversational AI   | Powers AI-driven reasoning, personalized guidance, and natural language queries.                             |
| **OpenAI / HuggingFace LLMs**     | Generate actionable advice & resume tips | Produces human-like, contextual improvement suggestions and learning path guidance.                          |
| **PyMuPDF / Unstructured / OCR**  | Resume parsing                           | Extracts text and structured info from PDFs, DOCs, or scanned resumes efficiently.                           |
| **Celery + Redis**                | Asynchronous task management             | Handles background processing like embedding generation and resume parsing efficiently.                      |
| **Tailwind / Chakra UI**          | Frontend styling                         | Provides responsive, modern, and customizable UI components quickly.                                         |
| **BM25 / TF-IDF**                 | ATS keyword matching                     | Ensures resumes align with job-specific keywords for realistic job matching and gap analysis.                |
| **Qdrant / Vector DB (optional)** | Fast embedding search                    | Stores embeddings for semantic similarity search, making recommendations fast and scalable.                  |

---

## **3. Folder Structure**

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

## **4. Features**

### **4.1 Resume & Job Description Analysis**

* Upload or paste resume and job description
* Generates a **match score** (e.g., 8/10)
* Highlights **missing skills** and **recommended improvements**

### **4.2 Gap Analysis**

* Detects critical missing skills, optional skills, and nice-to-have skills
* Provides **personalized action tips** to improve applications

### **4.3 Job Recommendations**

* Suggests relevant jobs from the database based on skill match and student profile
* Prioritizes internships, fresher roles, and preferred locations

### **4.4 Conversational Career Guidance**

* Ask natural language questions such as:

  * “What skills should I learn for this role?”
  * “How can I improve my resume for a backend position?”
  * “Generate a learning plan for AWS in 30 days”

### **4.5 Visual Dashboard**

* Skill cloud
* Match score breakdown
* Missing skill list
* Job recommendations

### **4.6 Resume Parsing**

* Extracts structured sections: Skills, Experience, Education, Projects, Achievements
* Supports PDFs, DOCs, and scanned resumes

---

## **5. Running the Project**

### **Backend (Django)**

1. Create a virtual environment:

   ```bash
   python -m venv venv
   source venv/bin/activate   # Linux / Mac
   venv\Scripts\activate      # Windows
   ```
2. Install dependencies:

   ```bash
   pip install -r backend/requirements.txt
   ```
3. Configure MongoDB connection in `settings.py`.
4. Run Django server:

   ```bash
   python manage.py runserver
   ```

### **Frontend (React)**

1. Navigate to frontend folder:

   ```bash
   cd frontend
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Start development server:

   ```bash
   npm start
   ```

### **Deployment**

* Frontend → **Netlify**
* Backend → **Render / AWS / Railway**
* Database → **MongoDB Atlas**