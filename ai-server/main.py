from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
import os, io, pyttsx3, pyautogui, psutil, shutil
import requests, fitz  # PyMuPDF
import google.generativeai as genai
import speech_recognition as sr
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

app = FastAPI()

class Query(BaseModel):
    question: str

class TranslateRequest(BaseModel):
    text: str
    to_lang: str

class EmailRequest(BaseModel):
    to: str
    subject: str
    body: str

# General Q&A
@app.post("/generate")
async def generate(query: Query):
    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(query.question)
    return {"answer": response.text.strip()}


# PDF Summarization
@app.post("/summarize-pdf")
async def summarize_pdf(file: UploadFile = File(...)):
    pdf_bytes = await file.read()
    doc = fitz.open("pdf", pdf_bytes)
    text = ""
    for page in doc:
        text += page.get_text()
    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(f"Summarize this PDF: {text[:8000]}")
    return {"summary": response.text.strip()}

# Voice Command Input
@app.get("/voice-command")
def voice_command():
    r = sr.Recognizer()
    with sr.Microphone() as source:
        audio = r.listen(source)
        command = r.recognize_google(audio)
    return {"text": command}

# Translation
@app.post("/translate")
def translate(req: TranslateRequest):
    url = "https://api.mymemory.translated.net/get"
    params = {"q": req.text, "langpair": f"en|{req.to_lang}"}
    res = requests.get(url, params=params).json()
    return {"translated": res["responseData"]["translatedText"]}

# Weather
@app.get("/weather")
def weather(city: str):
    key = os.getenv("OPENWEATHER_KEY")
    url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={key}&units=metric"
    res = requests.get(url).json()
    temp = res["main"]["temp"]
    description = res["weather"][0]["description"]
    return {"temp": temp, "description": description}

# Email Sending (mock version)
@app.post("/send-email")
def send_email(data: EmailRequest):
    # integrate with SMTP or use service like SendGrid here
    print(f"Sending email to {data.to} with subject: {data.subject}")
    return {"status": "Email Sent (mock)"}

# System Monitor
@app.get("/system-info")
def system_info():
    return {
        "cpu": psutil.cpu_percent(),
        "memory": psutil.virtual_memory().percent,
        "disk": psutil.disk_usage("/").percent,
    }

# Screenshot
@app.get("/screenshot")
def screenshot():
    image = pyautogui.screenshot()
    path = "screenshot.png"
    image.save(path)
    return {"file": path}

# App/Web Launch
@app.get("/open")
def open_app(app_name: str):
    if "google" in app_name.lower():
        os.system("start https://www.google.com")
    elif "youtube" in app_name.lower():
        os.system("start https://www.youtube.com")
    else:
        return {"error": "Unsupported app"}
    return {"status": "Opened"}

# Folder management
@app.post("/folder")
def manage_folder(name: str, action: str = "create"):
    base_path = "managed_folders"
    os.makedirs(base_path, exist_ok=True)
    folder_path = os.path.join(base_path, name)
    if action == "create":
        os.makedirs(folder_path, exist_ok=True)
        return {"status": "Folder created"}
    elif action == "delete":
        shutil.rmtree(folder_path, ignore_errors=True)
        return {"status": "Folder deleted"}
    return {"error": "Invalid action"}
