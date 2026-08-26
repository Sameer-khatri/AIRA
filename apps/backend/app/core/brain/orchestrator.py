from typing import Optional
from app.core.brain.schemas import BrainResponse, ConversationMessage, ProjectContext
from app.core.brain.privacy_guard import evaluate_privacy
from app.core.brain.prompt_builder import build_chat_messages
from app.services import ollama_service
from app.config import DEFAULT_MODEL

def process_chat_message(
    user_message: str,
    conversation_history: list[ConversationMessage],
    detected_intent: str,
    project_context: Optional[ProjectContext] = None,
    camera_context: Optional[dict] = None,
    screen_context: Optional[dict] = None
) -> BrainResponse:
    """Core brain pipeline: evaluate privacy, build prompt, call model."""
    
    intent = detected_intent
    privacy_info = evaluate_privacy(intent, camera_context, screen_context)
    privacy_state = privacy_info["privacy_state"]
    privacy_instruction = privacy_info["privacy_instruction"]
    
    messages = build_chat_messages(
        user_message=user_message,
        conversation_history=conversation_history,
        intent=intent,
        privacy_instruction=privacy_instruction,
        project_context=project_context
    )
    
    try:
        reply = ollama_service.chat(messages, model=DEFAULT_MODEL)
        mode = "ollama"
        status = "ok"
    except Exception as exc:
        print(f"[brain] Ollama error: {exc}")
        reply = "I cannot reach the local model right now. Please make sure Ollama is running."
        mode = "fallback"
        status = "model_unavailable"
        
    return BrainResponse(
        reply=reply,
        intent=intent,
        privacy_state=privacy_state,
        mode=mode,
        model=DEFAULT_MODEL,
        status=status,
        project_context_used=intent == "project_question" and project_context is not None
    )
