from fastapi import APIRouter
from app.services.ollama_service import get_status

router = APIRouter(prefix="/api")


@router.get("/models/status")
def models_status():
    """
    Return Ollama daemon status and available models.
    Always responds with 200 — offline state is part of the payload.
    """
    return get_status()
