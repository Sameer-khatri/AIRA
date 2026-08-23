from typing import Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.chat_service import (
    handle_chat,
    list_conversations,
    get_conversation_with_messages,
)

router = APIRouter(prefix="/api")


# ── Request / Response schemas ────────────────────────────────────────────────

class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[int] = None


# ── Endpoints ─────────────────────────────────────────────────────────────────

@router.post("/chat")
def post_chat(body: ChatRequest):
    """Send a message and receive an assistant reply."""
    if not body.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty.")
    return handle_chat(body.conversation_id, body.message.strip())


@router.get("/conversations")
def get_conversations():
    """Return all conversations ordered by most recently updated."""
    return list_conversations()


@router.get("/conversations/{conversation_id}")
def get_conversation(conversation_id: int):
    """Return a single conversation with its full message history."""
    result = get_conversation_with_messages(conversation_id)
    if result is None:
        raise HTTPException(status_code=404, detail="Conversation not found.")
    return result
