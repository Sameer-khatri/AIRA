from datetime import datetime
from typing import Optional
from sqlmodel import Session, select
from app.database import engine
from app.models.conversation import Conversation, Message
from app.config import CHAT_MODE, DEFAULT_MODEL
import app.services.ollama_service as ollama_service

FALLBACK_REPLY = (
    "I can't reach the Ollama service right now. "
    "Please make sure Ollama is running and that you have pulled the model: "
    f"`ollama pull {DEFAULT_MODEL}`"
)


def get_or_create_conversation(
    session: Session, conversation_id: Optional[int], first_message: str
) -> Conversation:
    """Return an existing conversation or create a new one."""
    if conversation_id is not None:
        conv = session.get(Conversation, conversation_id)
        if conv:
            return conv

    title = first_message[:60] + ("…" if len(first_message) > 60 else "")
    conv = Conversation(title=title, created_at=datetime.utcnow(), updated_at=datetime.utcnow())
    session.add(conv)
    session.commit()
    session.refresh(conv)
    return conv


def save_message(session: Session, conversation_id: int, role: str, content: str) -> Message:
    """Persist a single message to the database."""
    msg = Message(
        conversation_id=conversation_id,
        role=role,
        content=content,
        created_at=datetime.utcnow(),
    )
    session.add(msg)
    session.commit()
    session.refresh(msg)
    return msg


def _load_history(session: Session, conversation_id: int) -> list[dict]:
    """Load existing messages as Ollama-compatible {role, content} dicts."""
    msgs = session.exec(
        select(Message)
        .where(Message.conversation_id == conversation_id)
        .order_by(Message.created_at)
    ).all()
    return [{"role": m.role, "content": m.content} for m in msgs]


def _generate_reply(history: list[dict]) -> tuple[str, str]:
    """
    Generate an assistant reply.
    Returns (reply_text, mode) where mode is "ollama" or "fallback".
    """
    if CHAT_MODE == "mock":
        return (
            "AIRA local chat foundation is active. Ollama integration is enabled — set CHAT_MODE=ollama to use it.",
            "mock",
        )

    try:
        # Prepend a brief system prompt
        messages = [
            {
                "role": "system",
                "content": (
                    "You are AIRA, a local-first desktop AI companion. "
                    "Be helpful, concise, and honest. "
                    "You run entirely on the user's own machine."
                ),
            }
        ] + history
        reply = ollama_service.chat(messages)
        return reply, "ollama"
    except Exception as exc:
        print(f"[chat_service] Ollama error: {exc}")
        return FALLBACK_REPLY, "fallback"


def handle_chat(conversation_id: Optional[int], user_message: str) -> dict:
    """
    Milestone 1B chat flow:
    1. Get or create conversation.
    2. Save user message.
    3. Load full history for context.
    4. Call Ollama (or fallback).
    5. Save assistant reply.
    6. Return result.
    """
    with Session(engine) as session:
        conv = get_or_create_conversation(session, conversation_id, user_message)

        # Save user turn first
        save_message(session, conv.id, "user", user_message)

        # Build history including the new user message
        history = _load_history(session, conv.id)

        # Generate reply
        reply, mode = _generate_reply(history)

        # Save assistant turn
        save_message(session, conv.id, "assistant", reply)

        # Touch updated_at
        conv.updated_at = datetime.utcnow()
        session.add(conv)
        session.commit()

        return {
            "conversation_id": conv.id,
            "reply": reply,
            "mode": mode,
            "model": DEFAULT_MODEL if mode == "ollama" else None,
            "status": "ok",
        }


def list_conversations() -> list:
    with Session(engine) as session:
        convs = session.exec(
            select(Conversation).order_by(Conversation.updated_at.desc())
        ).all()
        return [
            {
                "id": c.id,
                "title": c.title,
                "created_at": c.created_at.isoformat(),
                "updated_at": c.updated_at.isoformat(),
            }
            for c in convs
        ]


def get_conversation_with_messages(conversation_id: int) -> Optional[dict]:
    with Session(engine) as session:
        conv = session.get(Conversation, conversation_id)
        if not conv:
            return None
        msgs = session.exec(
            select(Message)
            .where(Message.conversation_id == conversation_id)
            .order_by(Message.created_at)
        ).all()
        return {
            "id": conv.id,
            "title": conv.title,
            "created_at": conv.created_at.isoformat(),
            "updated_at": conv.updated_at.isoformat(),
            "messages": [
                {
                    "id": m.id,
                    "role": m.role,
                    "content": m.content,
                    "created_at": m.created_at.isoformat(),
                }
                for m in msgs
            ],
        }
