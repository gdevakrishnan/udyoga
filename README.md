# Udyoga – AI-Powered Career Assistant 🚀  

## Overview
Udyoga helps college students assess job opportunities and improve their applications using AI and Retrieval-Augmented Generation (RAG). Users can upload or paste resumes and job descriptions to receive a match score, gap analysis, and personalized improvement tips. The product focuses on actionable recommendations and scalable AI-driven workflows for interns and freshers.

Who it's built for:
- Students and early-career job seekers
- University career services
- Hackathon evaluators and open-source contributors

Core value proposition:
- Fast, personalized, and explainable job-fit insights that guide skill development and application improvements.

## Features
- Resume & JD Analysis
  - Upload or paste resumes and job descriptions (PDF, DOC, scanned images).
  - Extracts structured sections: Skills, Experience, Education, Projects, Achievements.
- Match Score & Gap Analysis
  - Semantic match score (e.g., 8/10) using embeddings similarity.
  - Highlights missing critical, optional, and nice-to-have skills.
  - Actionable tips for improvement.
- Job Recommendations
  - Suggests relevant roles (internships, fresher roles) filtered by skills and location.
- Conversational Career Guidance
  - Natural language Q&A: skill recommendations, resume improvements, learning plans.
- Visual Dashboard
  - Skill cloud, match score breakdown, missing skill list, job recommendations.
- Resume Parsing
  - PyMuPDF and OCR-powered parsing for scanned and native PDFs/DOCs.

## Tech Stack
| Technology / Tool | Purpose in Udyoga | Why Chosen / Benefits |
| --- | --- | --- |
| React.js | Frontend UI | Fast, component-based, ideal for interactive dashboards and chat interfaces |
| Django | Backend API | Auth, file management, API endpoints, and AI orchestration |
| Supabase (PostgreSQL) | Database | Stores users, jobs, resume/JD data; scalable relational storage |
| Docker | Containerization | Simplifies deployment and environment consistency |
| LangChain | RAG & Conversational AI | Orchestrates retrieval and prompt workflows for contextual responses |
| All-MiniLM-L6-v2 Embeddings | Semantic similarity & matching | Compact, high-quality vector representations for resumes and JDs |
| ChromaDB (Vector DB) | Stores embeddings & retrieval | Fast semantic search for RAG pipelines |
| Llama-3.1-8b (LLM) | Generate advice & tips | Produces human-like guidance and structured suggestions |
| PyMuPDF / OCR | Resume parsing | Extracts structured fields from PDFs/DOCs and scanned images |
| Tailwind / Chakra UI | Frontend styling | Responsive, modern UI components and utilities |

## System Architecture
Frontend ↔ Backend (HTTP/REST JSON) ↔ AI Pipeline (Embeddings, Vector DB, LLM)

ASCII overview:
```
+-------------+      HTTP/REST       +--------+      +-------------+      +--------+
|   React.js  | <----------------->  | Django | <--> | ChromaDB /  | <--> | Llama  |
| (UI & UX)   |                      | (API)  |      | Embeddings  |      | (LLM)  |
+-------------+                      +--------+      +-------------+      +--------+
       |                                      ^
       v                                      |
   Upload Resume / JD                         |
       |                                      |
       v                                      |
  Resume/JD Parsing ---> Feature Storage -----
```

RAG: LangChain orchestrates retrieval of relevant context from vector store (ChromaDB) using All-MiniLM-L6-v2 embeddings, then constructs prompts for Llama-3.1-8b to generate personalized career guidance.

## Folder Structure
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
Brief: backend holds Django apps for accounts, jobs and AI matching; frontend contains the React UI and styling.

## AI & RAG Pipeline
- Resume/JD parsing: PyMuPDF / OCR extracts sections and plain text.
- Embedding generation: all-MiniLM-L6-v2 creates vectors for text chunks.
- Vector storage & retrieval: ChromaDB stores embeddings and performs semantic search to return top-k relevant chunks.
- LangChain orchestration: constructs retrieval and prompt workflows, combines context and user query.
- LLM response generation: Llama-3.1-8b generates match explanations, gap analysis, learning plans, and conversational responses.

## Installation & Setup
Backend (Django + Supabase/Postgres)
1. Create virtual env:
```bash
python -m venv venv
source venv/bin/activate   # Linux / Mac
venv\Scripts\activate      # Windows
```
2. Install deps:
```bash
pip install -r backend/requirements.txt
```
3. Configure environment:
- Add Supabase/Postgres credentials and any API keys to backend/.env and Django settings.
4. Run server:
```bash
python manage.py runserver
```

Frontend (React)
1. Enter frontend:
```bash
cd frontend
```
2. Install and start:
```bash
npm install
npm start
```

Docker (optional)
```bash
docker-compose up --build
```

## Running the Application
- Local development: start backend and frontend servers and open the frontend in the browser (http://localhost:3000 by default).
- Docker deployment: use docker-compose to build and run containers for both services.

API (Backend) — (Reference)
- The Django backend exposes REST endpoints to:
  - Upload / parse resume or JD
  - Request match score and gap analysis
  - Retrieve job recommendations
  - Send conversational queries to career assistant

Authentication: standard token/session-based auth managed by Django.

## Usage Flow
1. Upload or paste your resume (PDF/DOC/scanned).
2. Upload or paste a job description.
3. View computed match score, skill gaps, and tailored tips on the dashboard.
4. Ask natural-language career questions through the chat interface to get personalized plans and recommendations.

## Key Highlights
- AI-Powered Resume Matching using embeddings and semantic similarity
- RAG implementation combining LangChain, ChromaDB, embeddings, and Llama for contextual answers
- Personalized and actionable gap analysis and improvement tips
- Scalable architecture suitable for internships & fresher role recommendations

## Future Enhancements
- Resume versioning and history
- Interview preparation modules (mock interviews, question bank)
- Company-specific insights and role benchmarking
- ATS optimization and export-friendly resume formats

## Deployment
- Frontend: Netlify (recommended for static React sites)
- Backend: Render (recommended for Django apps)
```bash
docker-compose up --build
```

## License
MIT License
