import os
from dotenv import load_dotenv

load_dotenv()

APP_NAME = "AIRA"
APP_VERSION = "0.1.0"
APP_MODE = "local"
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./aira.sqlite")

# Ollama
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://127.0.0.1:11434")
DEFAULT_MODEL = os.getenv("DEFAULT_MODEL", "qwen2.5:3b")
CHAT_MODE = os.getenv("CHAT_MODE", "ollama")  # "ollama" | "mock"
