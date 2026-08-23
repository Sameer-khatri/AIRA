from datetime import datetime
from typing import Optional
from sqlmodel import Session, select
from app.database import engine
from app.models.conversation import Conversation, Message

MOCK_REPLY = (
    "AIRA local chat foundation is active. "
    "I can hear you — Ollama integration comes next."
)


def get_or_create_conversation(
    session: Session, conversation_id: Optional[int], first_message: str
) -> Conversation:
    """Return an existing conversation or create a new one."""
    if conversation_id is not None:
        conv = session.get(Conversation, conversation_id)
        if conv:
            return conv

    # Auto-title from the first user message (truncate to 60 chars)
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


def handle_chat(conversation_id: Optional[int], user_message: str) -> dict:
    """
    Core chat logic for Milestone 1A (mock mode):
    1. Get or create conversation.
    2. Save user message.
    3. Generate placeholder reply.
    4. Save assistant reply.
    5. Return reply + metadata.
    """
    with Session(engine) as session:
        conv = get_or_create_conversation(session, conversation_id, user_message)

        # Save user message
        save_message(session, conv.id, "user", user_message)

        # Placeholder assistant reply (no Ollama yet)
        reply = MOCK_REPLY

        # Save assistant reply
        save_message(session, conv.id, "assistant", reply)

        # Touch updated_at
        conv.updated_at = datetime.utcnow()
        session.add(conv)
        session.commit()

        return {
            "conversation_id": conv.id,
            "reply": reply,
            "mode": "mock",
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
