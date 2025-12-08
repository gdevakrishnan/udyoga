import os
import numpy as np
import json
import re
from groq import Groq

# -----------------------------
# 1. Extract JSON safely
# -----------------------------
def extract_json(text):
    """
    Safely extracts JSON from an LLM response, even if extra text exists.
    """
    match = re.search(r"\{(.|\n)*\}", text)
    if not match:
        raise ValueError("No JSON object found in LLM output")

    json_str = match.group(0).strip()

    try:
        return json.loads(json_str)
    except Exception as e:
        print("JSON Cleaning Error →", e)
        raise e

# -----------------------------
# 2. Compute cosine similarity
# -----------------------------
def compute_match_score(jd_emb, resume_emb):
    jd_emb = np.array(jd_emb)
    resume_emb = np.array(resume_emb)

    cosine = np.dot(jd_emb, resume_emb) / (
        np.linalg.norm(jd_emb) * np.linalg.norm(resume_emb)
    )
    # Scale (-1,1) → (0,10)
    return round(float((cosine + 1) / 2 * 10), 2)

# -----------------------------
# 3. Generic AI model function
# -----------------------------
def ai_model(prompt: str, data: dict = None, model: str = "llama-3.1-8b-instant"):
    """
    Calls the Groq LLM with a prompt and optional data.
    
    :param prompt: The prompt string to send to the LLM.
    :param data: Optional dictionary of extra context or variables.
    :param api_key: Groq API key (if not set as environment variable).
    :param model: Model to use in Groq.
    :return: The LLM response as a string.
    """
    client = Groq(api_key=os.getenv("GROQ_API_KEY"))

    # If data is provided, interpolate into the prompt
    if data:
        # Replace {key} in prompt with value from data
        for key, value in data.items():
            placeholder = "{" + key + "}"
            prompt = prompt.replace(placeholder, str(value))

    completion = client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": prompt}]
    )

    return completion.choices[0].message.content

# -----------------------------
# 4. Example: Resume-JD analysis using Groq
# -----------------------------

def analyze_with_groq(jd_text, resume_text):
    prompt = """
You are a top-tier career coach and recruiter, highly experienced in resume analysis, skills mapping, and job matching. 
Carefully analyze the candidate's resume against the job description provided.

Your task is to return a **JSON object only**, with no extra text, explanations, or markdown.

The JSON MUST strictly follow this format:

{
  "matchingSkills": [],        // List of bullet points: resume skills/experiences that match JD requirements, plus suggestions to highlight/add other required JD skills
  "areasForImprovement": [],   // List of bullet points: suggestions to improve the resume overall to attract more job offers
  "recommendations": []        // List of bullet points: suggestions on how to tailor this resume specifically for this job
}

Guidelines:
1. Each field must be an **array of strings**, where each string is a single actionable point.
2. Be precise and comprehensive. Mention concrete skills, tools, technologies, or achievements.
3. For matchingSkills, identify exact matches from resume to JD, then suggest ways to incorporate any missing JD-required skills.
4. For areasForImprovement, give broad, actionable resume enhancement tips to boost general job offer success.
5. For recommendations, focus on job-specific tailoring actions using the candidate's existing experience.
6. Avoid vague statements. Include concrete examples where possible.
7. Do not return any paragraphs. Each idea should be a separate item in the array.

--- JOB DESCRIPTION ---
{jd}

--- RESUME ---
{resume}
"""
    data = {"jd": jd_text, "resume": resume_text}
    response = ai_model(prompt, data=data)
    return extract_json(response)


# -----------------------------
# 5. Wrapper: analyze
# -----------------------------
def analyze(jd_emb, resume_emb, jd_text, resume_text):
    score = compute_match_score(jd_emb, resume_emb)
    llm_data = analyze_with_groq(jd_text, resume_text)

    return {
        "status": 200,
        "message": "Analyzed successfully!!",
        "match_score": score,
        "matchingSkills": llm_data.get("matchingSkills", ""),
        "areasForImprovement": llm_data.get("areasForImprovement", ""),
        "recommendations": llm_data.get("recommendations", "")
    }

