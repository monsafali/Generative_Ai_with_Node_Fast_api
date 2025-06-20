from fastapi import FastAPI
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv
import os

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))


app = FastAPI()

class Query(BaseModel):
    question: str

@app.post("/generate")
async def generate(query: Query):
    model = genai.GenerativeModel("gemini-1.5-flash")  # free model
    response = model.generate_content(query.question)
    return {"answer": response.text.strip()}
