from typing import Optional
from pydantic import BaseModel

class ConversationMessage(BaseModel):
    role: str
    content: str

class BrainRequest(BaseModel):
    user_message: str
    conversation_history: list[ConversationMessage]
    camera_context: Optional[dict] = None
    screen_context: Optional[dict] = None

class BrainResponse(BaseModel):
    reply: str
    intent: str
    privacy_state: str
    mode: str
    model: str
    status: str
