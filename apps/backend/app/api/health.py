from fastapi import APIRouter
from sqlmodel import Session, text
from app.database import engine
from app.config import APP_NAME, APP_VERSION, APP_MODE

router = APIRouter(prefix="/api")

@router.get("/health")
def get_health():
    db_status = "disconnected"
    try:
        with Session(engine) as session:
            # Execute a simple query to verify SQLite connection
            session.exec(text("SELECT 1"))
            db_status = "connected"
    except Exception as e:
        # For debugging backend logs if needed
        print(f"Database health check failed: {e}")
        db_status = "disconnected"

    return {
        "status": "ok",
        "app": APP_NAME,
        "mode": APP_MODE,
        "version": APP_VERSION,
        "database": db_status
    }
