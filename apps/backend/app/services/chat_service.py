from datetime import datetime
from typing import Optional
from sqlmodel import Session, select
from app.database import engine
from app.models.conversation import Conversation, Message
from app.config import DEFAULT_MODEL
from app.core.brain.schemas import ConversationMessage
from app.core.brain.intent_router import detect_intent
from app.services.project_service import get_active_project_context




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


def _load_history(session: Session, conversation_id: int) -> list[ConversationMessage]:
    """Load existing messages as ConversationMessage objects."""
    msgs = session.exec(
        select(Message)
        .where(Message.conversation_id == conversation_id)
        .order_by(Message.created_at)
    ).all()
    return [ConversationMessage(role=m.role, content=m.content) for m in msgs]


def handle_chat(conversation_id: Optional[int], user_message: str) -> dict:
    """
    Milestone 1C chat flow:
    1. Get or create conversation.
    2. Load full history for context.
    3. Call Brain orchestrator.
    4. Save user and assistant messages.
    5. Return result.
    """
    from app.core.brain.orchestrator import process_chat_message

    with Session(engine) as session:
        conv = get_or_create_conversation(session, conversation_id, user_message)

        # Build history before adding current message
        history = _load_history(session, conv.id)

        detected_intent = detect_intent(user_message)
        project_context = None
        if detected_intent == "project_question":
            try:
                project_context = get_active_project_context(session)
            except Exception as exc:
                print(f"[chat] Project context error: {exc}")

        # Save user turn before generation so project questions are still stored
        save_message(session, conv.id, "user", user_message)

        # Generate reply using brain
        brain_response = process_chat_message(
            user_message=user_message,
            conversation_history=history,
            detected_intent=detected_intent,
            project_context=project_context
        )

        # Save assistant turn
        save_message(session, conv.id, "assistant", brain_response.reply)

        # Touch updated_at
        conv.updated_at = datetime.utcnow()
        session.add(conv)
        session.commit()

        return {
            "conversation_id": conv.id,
            "reply": brain_response.reply,
            "mode": brain_response.mode,
            "model": brain_response.model,
            "status": brain_response.status,
            "intent": brain_response.intent,
            "privacy_state": brain_response.privacy_state,
            "project_context_used": brain_response.project_context_used
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
