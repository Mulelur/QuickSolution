import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")


gemini_enabled = False
model = None
if API_KEY:
    try:
        genai.configure(api_key=API_KEY)
        model = genai.GenerativeModel("gemini-2.0-flash")
        gemini_enabled = True
    except Exception:
        gemini_enabled = False


def ask_gemini(prompt: str) -> str:
    """Return Gemini output text. Raises exception if fails."""
    if not gemini_enabled:
        raise RuntimeError("Gemini not available")
    
    response = model.generate_content(prompt)
    return response.text
