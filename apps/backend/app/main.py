from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import init_db
from app.api.health import router as health_router
from app.api.chat import router as chat_router
from app.config import APP_NAME, APP_VERSION

app = FastAPI(title=APP_NAME, version=APP_VERSION)

# Allow CORS for local frontend configurations
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health_router)
app.include_router(chat_router)

@app.on_event("startup")
def on_startup():
    # Automatically initialize SQLite tables
    init_db()
