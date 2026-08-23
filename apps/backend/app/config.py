import os
from dotenv import load_dotenv

load_dotenv()

APP_NAME = "AIRA"
APP_VERSION = "0.1.0"
APP_MODE = "local"
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./aira.sqlite")
