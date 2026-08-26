from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field

class ConversationMessage(BaseModel):
    role: str
    content: str

class CheckpointContext(BaseModel):
    id: int
    title: str
    summary: str
    completed_work: Optional[str] = None
    current_problem: Optional[str] = None
    decisions_made: Optional[str] = None
    next_action: Optional[str] = None
    user_focus_state: Optional[str] = None
    confidence: Optional[int] = None
    created_at: Optional[datetime] = None

class TaskContext(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    status: str
    priority: str
    due_date: Optional[datetime] = None
    created_at: Optional[datetime] = None

class DecisionContext(BaseModel):
    id: int
    decision: str
    reason: Optional[str] = None
    impact: Optional[str] = None
    created_at: Optional[datetime] = None

class ProjectContext(BaseModel):
    project_id: int
    project_name: str
    description: Optional[str] = None
    status: Optional[str] = None
    current_milestone: Optional[str] = None
    current_focus: Optional[str] = None
    project_next_step: Optional[str] = None
    latest_checkpoint: Optional[CheckpointContext] = None
    pending_tasks: list[TaskContext] = Field(default_factory=list)
    recent_decisions: list[DecisionContext] = Field(default_factory=list)
    recommended_next_action: Optional[str] = None
    has_checkpoint: bool

class BrainRequest(BaseModel):
    user_message: str
    conversation_history: list[ConversationMessage]
    detected_intent: Optional[str] = None
    project_context: Optional[ProjectContext] = None
    camera_context: Optional[dict] = None
    screen_context: Optional[dict] = None

class BrainResponse(BaseModel):
    reply: str
    intent: str
    privacy_state: str
    mode: str
    model: str
    status: str
    project_context_used: bool = False
