import os
from pydantic import BaseModel, Field
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain_groq import ChatGroq


# ======================================================
# 1. Pydantic Output Schema
# ======================================================
class JDOutput(BaseModel):
    description: str = Field(...)
    responsibilities: list[str] = Field(...)
    qualifications: list[str] = Field(...)


parser = JsonOutputParser(pydantic_object=JDOutput)


# ======================================================
# 2. JD Generation Prompt
# ======================================================
jd_prompt_template = ChatPromptTemplate.from_template("""
You are a senior HR leader and hiring strategist.

Generate a modern, inclusive, bias-free job description.

Return ONLY valid JSON.
No markdown. No explanations.

JSON FORMAT (STRICT):
{{
  "description": "",
  "responsibilities": [],
  "qualifications": []
}}

ALL FIELDS MUST EXIST.
RESPONSIBILITIES & QUALIFICATIONS MUST HAVE 5–8 ITEMS.

------------------------------------------------
COMPANY
------------------------------------------------
Name: {company_name}
Description: {company_description}

------------------------------------------------
ROLE
------------------------------------------------
Title: {title}
Department: {department}
Location: {location}
Experience: {experience_min}–{experience_max} years
Skills: {skills}

{format_instructions}
""")


# ======================================================
# 3. Groq LLM
# ======================================================
llm = ChatGroq(
    model="llama-3.1-8b-instant",
    groq_api_key=os.getenv("GROQ_API_KEY")
)


# ======================================================
# 4. Chain
# ======================================================
jd_chain = jd_prompt_template | llm | parser


# ======================================================
# 5. Public Function
# ======================================================
def generate_jd_with_groq(
    *,
    company_name: str,
    company_description: str,
    title: str,
    department: str,
    location: str,
    experience_min: int,
    experience_max: int,
    skills: list[str]
):
    return jd_chain.invoke({
        "company_name": company_name,
        "company_description": company_description,
        "title": title,
        "department": department or "N/A",
        "location": location,
        "experience_min": experience_min,
        "experience_max": experience_max,
        "skills": ", ".join(skills),
        "format_instructions": parser.get_format_instructions()
    })
