# **Udyoga – AI-Powered Career Assistant**

---

## **1. Introduction**

**Udyoga** is an AI-driven career assistant tailored for college students to evaluate job opportunities, assess their fit, and optimize their applications. The platform allows students to:

* Paste or upload a **resume**
* Paste or upload a **job description (JD)**
* Receive a **match score** and **gap analysis**
* Get **personalized improvement tips**
* Explore **job recommendations** based on their profile

By leveraging AI and RAG (Retrieval-Augmented Generation), Udyoga delivers actionable career insights and guidance, making the job application process smarter, more efficient, and personalized.

---

## **2. Tech Stack**

| **Technology / Tool**           | **Purpose in Udyoga**                    | **Why Chosen / Benefits**                                                                   |
| ------------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------- |
| **React.js**                    | Frontend UI                              | Fast, component-based, ideal for interactive dashboards, forms, and chat interfaces.        |
| **Django**                      | Backend API                              | Handles user authentication, file management, API endpoints, and orchestrates AI tasks.     |
| **Supabase (PostgreSQL)**       | Database                                 | Stores user profiles, jobs, resume/JD data; provides scalable relational storage.           |
| **Docker**                      | Containerization                         | Simplifies deployment, ensures environment consistency across development and production.   |
| **LangChain**                   | RAG & Conversational AI                  | Powers AI-driven reasoning, personalized guidance, and contextual natural language queries. |
| **All-MiniLM-L6-v2 Embeddings** | Semantic similarity search & matching    | Generates vector representations for resumes and JDs to enable accurate matching.           |
| **ChromaDB (Vector Database)**  | Stores embeddings & fast retrieval       | Allows fast, scalable semantic search for RAG pipelines.                                    |
| **Llama-3.1-8b (LLM)**          | Generate actionable advice & resume tips | Produces human-like suggestions, learning paths, and career guidance.                       |
| **PyMuPDF / OCR**               | Resume parsing                           | Extracts structured information from PDFs, DOCs, and scanned resumes.                       |
| **Tailwind / Chakra UI**        | Frontend styling                         | Provides responsive, modern, and easily customizable UI components.                         |

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
├── docker/
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend
│   └── docker-compose.yml
├── scripts/
├── .gitignore
└── README.md
```

---

## **4. Features**

### **4.1 Resume & Job Description Analysis**

* Upload or paste resume and JD.
* Generates a **match score** (e.g., 8/10) using embeddings similarity.
* Highlights **missing skills** and provides **personalized improvement suggestions**.

### **4.2 Gap Analysis**

* Detects critical missing skills, optional skills, and nice-to-have skills.
* Provides **actionable tips** to strengthen applications.

### **4.3 Job Recommendations**

* Suggests relevant jobs from the database based on skills and profile.
* Focuses on internships, fresher roles, and preferred locations.

### **4.4 Conversational Career Guidance**

* Ask natural language questions like:

  * “What skills should I learn for this role?”
  * “How can I improve my resume for a backend developer position?”
  * “Generate a 30-day learning plan for AWS”

### **4.5 Visual Dashboard**

* Skill cloud
* Match score breakdown
* Missing skill list
* Job recommendations

### **4.6 Resume Parsing**

* Extracts structured sections: Skills, Experience, Education, Projects, Achievements
* Supports PDFs, DOCs, and scanned resumes using PyMuPDF/OCR

---

## **5. Architecture & Workflow**

```
                             +---------------------+
                             |     React.js        |
                             |  (Frontend UI)      |
                             |--------------------|
                             | - Resume Upload     |
                             | - JD Upload         |
                             | - Dashboard         |
                             | - Chat Interface    |
                             +---------+-----------+
                                       |
                                       | HTTP/REST API (JSON)
                                       v
                             +---------------------+
                             |      Django         |
                             |   (Backend API)     |
                             |--------------------|
                             | - Auth & Users      |
                             | - File Management   |
                             | - Orchestrates AI   |
                             | - Job Recommendations|
                             +---------+-----------+
                                       |
              +------------------------+------------------------+
              |                        |                        |
              v                        v                        v
    +------------------+      +-------------------+     +--------------------+
    | Resume / JD       |      | Embedding Service |     | LangChain Agent    |
    | Parsing Module    |      |------------------|     |--------------------|
    |------------------|      | - all-MiniLM-L6-v2|     | - Receives queries |
    | - PyMuPDF / OCR   |      | - Generate vectors|     |   from Django      |
    | - Extract Skills, |      | - Store in ChromaDB|   | - Fetch context    |
    |   Experience,     |      | - Semantic Search |     |   from embeddings  |
    |   Education,      |      +---------+--------+     | - Construct prompts|
    |   Projects        |                |               | - Call LLM (Llama)|
    +---------+--------+                v               +---------+----------+
              |                  +-------------------+             |
              |                  | ChromaDB (Vector) |             v
              |                  |------------------|     +-------------------+
              |                  | - Store embeddings|     | Llama-3.1-8b      |
              |                  | - Semantic search |     |-------------------|
              |                  | - Retrieve top N  |     | - Generates human-|
              |                  |   matches         |     |   like responses |
              |                  +------------------+     | - Provides guidance|
              v                                               +-------------------+
      +------------------+
      | Feature Storage   |
      | & Intermediate    |
      | Data              |
      | - Parsed resume   |
      | - Parsed JD       |
      +------------------+
              |
              v
      +-------------------+
      | Recommendation /  |
      | Analytics         |
      |-------------------|
      | - Match score     |
      | - Gap analysis    |
      | - Missing skills  |
      | - Job recommendations|
      +-------------------+
```

---

## **6. Running the Project**

### **Backend (Django + Supabase)**

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

3. Configure Supabase/PostgreSQL credentials in `.env` and `settings.py`.

4. Run Django server:

   ```bash
   python manage.py runserver
   ```

### **Frontend (React.js)**

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

### **Docker Deployment**

* Use Docker to containerize backend and frontend:

```bash
docker-compose up --build
```

* Deploy containers on platforms like **Render** (backend) and **Netlify** (frontend).

---

## **7. Key Points**

* **AI-Powered Resume Matching:** Uses semantic embeddings to provide match scores and gap analysis.
* **RAG Implementation:** Combines LangChain, embeddings, ChromaDB, and Llama-3.1-8b for contextual recommendations.
* **Conversational Guidance:** Students can interact with the system using natural language queries.
* **Flexible Parsing:** Supports PDFs, DOCs, and scanned resumes.
* **Visual Dashboard:** Shows skills, gaps, and job suggestions in a clear, actionable way.
* **Deployment Ready:** Frontend deployed on **Netlify**, backend deployed on **Render**, with Docker for containerization.