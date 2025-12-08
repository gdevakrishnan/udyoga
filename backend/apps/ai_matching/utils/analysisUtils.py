import os
import numpy as np
from pydantic import BaseModel, Field
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain_groq import ChatGroq


# ==========================================================
# 1. Compute cosine similarity
# ==========================================================
def compute_match_score(jd_emb, resume_emb):
    jd_emb = np.array(jd_emb)
    resume_emb = np.array(resume_emb)

    cosine = np.dot(jd_emb, resume_emb) / (
        np.linalg.norm(jd_emb) * np.linalg.norm(resume_emb)
    )
    return round(float((cosine + 1) / 2 * 10), 2)


# ==========================================================
# 2. Pydantic JSON schema
# ==========================================================
class AnalysisOutput(BaseModel):
    matchingSkills: list[str] = Field(default_factory=list)
    areasForImprovement: list[str] = Field(default_factory=list)
    recommendations: list[str] = Field(default_factory=list)


parser = JsonOutputParser(pydantic_object=AnalysisOutput)


# ==========================================================
# 3. DEEP ANALYSIS PROMPT  (Huge upgrade)
# ==========================================================
prompt_template = ChatPromptTemplate.from_template("""
You are an elite career consultant and technical hiring strategist.  
Your role is to deeply analyze how well the candidate’s resume aligns with the job description.

Return ONLY a JSON object.  
No explanations or markdown. No extra text.

The JSON MUST strictly follow this structure:

{{
  "matchingSkills": [],
  "areasForImprovement": [],
  "recommendations": []
}}

ALL THREE FIELDS MUST EXIST.  
NONE OF THEM CAN BE EMPTY.

===============================================================
### HOW TO ANALYZE (EXTREMELY IMPORTANT)
===============================================================

---------------------------
### MATCHING SKILLS (DEEP ANALYSIS)
---------------------------
Return 6–12 **high-quality** bullet points.

Each bullet point MUST be a **full, meaningful sentence** (not a list).

Each sentence must describe one of:

1. **Skills in the resume that strongly match JD requirements**  
   Example: "Your hands-on experience with Python and REST API development directly aligns with the JD's need for backend API ownership."

2. **Skills required by the JD that are missing or weak in the resume**  
   Example: "The JD emphasizes AWS infrastructure management, but your resume does not mention any cloud platforms—adding AWS or equivalent experience would significantly increase alignment."

3. **Important skills the candidate should highlight more clearly**  
   Example: "Your SQL experience is mentioned briefly, but highlighting query optimization or performance tuning would strengthen your backend profile."

- DO NOT output raw skill lists  
- DO NOT output generic statements  
- Each item must be specific, actionable, and context-aware.

---------------------------
### AREAS FOR IMPROVEMENT (RESUME QUALITY)
---------------------------
Provide 4–8 detailed, actionable improvements focusing on:

- Missing metrics and achievements  
- Structure and clarity upgrades  
- Stronger storytelling  
- Better alignment of responsibilities  
- Improving seniority signalling  
- Bringing technical depth to the forefront  

Examples:
- "Add quantifiable results such as performance improvements, cost savings, or user impact to enhance credibility."
- "Group your technical skills by category to make them easier for ATS and recruiters to understand."

---------------------------
### RECOMMENDATIONS (JOB-SPECIFIC TAILORING)
---------------------------
Provide 4–8 job-alignment strategies.

Examples:
- "Move cloud-related projects higher in the resume to match the JD’s emphasis on AWS and distributed systems."
- "Rewrite your professional summary to emphasize backend API ownership, as this is central to the JD."

===============================================================
### INPUTS
===============================================================

--- JOB DESCRIPTION ---
{jd}

--- RESUME ---
{resume}

{format_instructions}
""")


# ==========================================================
# 4. Groq LLM
# ==========================================================
llm = ChatGroq(
    model="llama-3.1-8b-instant",
    groq_api_key=os.getenv("GROQ_API_KEY")
)


# ==========================================================
# 5. LLM Chain: Prompt → LLM → JSON parser
# ==========================================================
chain = prompt_template | llm | parser


# ==========================================================
# 6. Analyze JD & Resume
# ==========================================================
def analyze_with_groq(jd_text: str, resume_text: str):
    return chain.invoke({
        "jd": jd_text,
        "resume": resume_text,
        "format_instructions": parser.get_format_instructions()
    })


# ==========================================================
# 7. Final output wrapper
# ==========================================================
def analyze(jd_emb, resume_emb, jd_text, resume_text):
    score = compute_match_score(jd_emb, resume_emb)
    llm_data = analyze_with_groq(jd_text, resume_text)

    return {
        "status": 200,
        "message": "Analyzed successfully!",
        "match_score": score,
        "matchingSkills": llm_data.get("matchingSkills", []),
        "areasForImprovement": llm_data.get("areasForImprovement", []),
        "recommendations": llm_data.get("recommendations", [])
    }
