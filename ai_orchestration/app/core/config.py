import os
from pathlib import Path
from dotenv import load_dotenv

# Search for .env in current dir, parent dir, or project root
current_dir = Path(__file__).resolve().parent
candidates = [
    current_dir / ".env",
    current_dir.parent / ".env",
    current_dir.parent.parent / ".env",
    current_dir.parent.parent.parent / ".env"
]
for p in candidates:
    if p.exists():
        load_dotenv(p)
        break

class Settings:
    PROJECT_NAME: str = "FiverrGrowth AI Orchestration"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/ai"
    
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    CEREBRAS_API_KEY: str = os.getenv("CEREBRAS_API_KEY", "")
    OPENROUTER_API_KEY: str = os.getenv("OPENROUTER_API_KEY", "")
    GITHUB_TOKEN: str = os.getenv("GITHUB_TOKEN", "")

settings = Settings()
