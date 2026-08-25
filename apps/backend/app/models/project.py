from datetime import datetime
from typing import List, Optional

from sqlmodel import Field, Relationship, SQLModel


class Project(SQLModel, table=True):
    __tablename__ = "projects"

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    description: Optional[str] = None
    status: str = Field(default="active", index=True)
    current_milestone: Optional[str] = None
    current_focus: Optional[str] = None
    active_task: Optional[str] = None
    next_step: Optional[str] = None
    priority: str = Field(default="medium", index=True)
    deadline: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow, index=True)

    checkpoints: List["ProjectCheckpoint"] = Relationship(
        back_populates="project",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"},
    )
    tasks: List["ProjectTask"] = Relationship(
        back_populates="project",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"},
    )
    decisions: List["ProjectDecision"] = Relationship(
        back_populates="project",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"},
    )


class ProjectCheckpoint(SQLModel, table=True):
    __tablename__ = "project_checkpoints"

    id: Optional[int] = Field(default=None, primary_key=True)
    project_id: int = Field(foreign_key="projects.id", index=True)
    title: str
    summary: str
    completed_work: Optional[str] = None
    current_problem: Optional[str] = None
    decisions_made: Optional[str] = None
    next_action: Optional[str] = None
    user_focus_state: Optional[str] = None
    confidence: Optional[int] = Field(default=None, ge=1, le=10)
    created_at: datetime = Field(default_factory=datetime.utcnow, index=True)

    project: Optional[Project] = Relationship(back_populates="checkpoints")


class ProjectTask(SQLModel, table=True):
    __tablename__ = "project_tasks"

    id: Optional[int] = Field(default=None, primary_key=True)
    project_id: int = Field(foreign_key="projects.id", index=True)
    title: str
    description: Optional[str] = None
    status: str = Field(default="todo", index=True)
    priority: str = Field(default="medium", index=True)
    due_date: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    project: Optional[Project] = Relationship(back_populates="tasks")


class ProjectDecision(SQLModel, table=True):
    __tablename__ = "project_decisions"

    id: Optional[int] = Field(default=None, primary_key=True)
    project_id: int = Field(foreign_key="projects.id", index=True)
    decision: str
    reason: Optional[str] = None
    impact: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow, index=True)

    project: Optional[Project] = Relationship(back_populates="decisions")
