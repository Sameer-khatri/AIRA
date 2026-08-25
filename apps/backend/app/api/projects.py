from datetime import datetime
from typing import Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.services.project_service import (
    create_checkpoint,
    create_decision,
    create_project,
    create_task,
    get_latest_checkpoint,
    get_or_create_default_project,
    get_project,
    list_checkpoints,
    list_decisions,
    list_projects,
    list_tasks,
    serialize_project,
    update_project,
    update_task,
)

router = APIRouter(prefix="/api")


class ProjectCreate(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    description: Optional[str] = None
    status: str = "active"
    current_milestone: Optional[str] = None
    current_focus: Optional[str] = None
    active_task: Optional[str] = None
    next_step: Optional[str] = None
    priority: str = "medium"
    deadline: Optional[datetime] = None


class ProjectUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=1, max_length=200)
    description: Optional[str] = None
    status: Optional[str] = None
    current_milestone: Optional[str] = None
    current_focus: Optional[str] = None
    active_task: Optional[str] = None
    next_step: Optional[str] = None
    priority: Optional[str] = None
    deadline: Optional[datetime] = None


class CheckpointCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    summary: str = Field(min_length=1)
    completed_work: Optional[str] = None
    current_problem: Optional[str] = None
    decisions_made: Optional[str] = None
    next_action: Optional[str] = None
    user_focus_state: Optional[str] = None
    confidence: Optional[int] = Field(default=None, ge=1, le=10)


class TaskCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = None
    status: str = "todo"
    priority: str = "medium"
    due_date: Optional[datetime] = None


class TaskUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=200)
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    due_date: Optional[datetime] = None


class DecisionCreate(BaseModel):
    decision: str = Field(min_length=1)
    reason: Optional[str] = None
    impact: Optional[str] = None


@router.get("/projects")
def get_projects():
    """List projects with the most recently updated project first."""
    return list_projects()


@router.post("/projects")
def post_project(body: ProjectCreate):
    """Create a structured project-memory record."""
    return create_project(body.model_dump())


@router.get("/projects/active/default")
def get_default_active_project():
    """Return the newest active project, creating AIRA when none exists."""
    return get_or_create_default_project()


@router.get("/projects/{project_id}")
def get_project_details(project_id: int):
    result = get_project(project_id)
    if result is None:
        raise HTTPException(status_code=404, detail="Project not found.")
    return result


@router.patch("/projects/{project_id}")
def patch_project(project_id: int, body: ProjectUpdate):
    updates = body.model_dump(exclude_unset=True)
    result = update_project(project_id, updates)
    if result is None:
        raise HTTPException(status_code=404, detail="Project not found.")
    return result


@router.post("/projects/{project_id}/checkpoints")
def post_checkpoint(project_id: int, body: CheckpointCreate):
    result = create_checkpoint(project_id, body.model_dump())
    if result is None:
        raise HTTPException(status_code=404, detail="Project not found.")
    return result


@router.get("/projects/{project_id}/checkpoints")
def get_checkpoints(project_id: int):
    result = list_checkpoints(project_id)
    if result is None:
        raise HTTPException(status_code=404, detail="Project not found.")
    return result


@router.get("/projects/{project_id}/checkpoints/latest")
def get_latest_project_checkpoint(project_id: int):
    project = get_project(project_id, include_children=False)
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found.")
    checkpoint = get_latest_checkpoint(project_id)
    return {
        "project_id": project_id,
        "checkpoint": checkpoint,
        "message": None if checkpoint else "No checkpoints found for this project.",
    }


@router.post("/projects/{project_id}/tasks")
def post_task(project_id: int, body: TaskCreate):
    result = create_task(project_id, body.model_dump())
    if result is None:
        raise HTTPException(status_code=404, detail="Project not found.")
    return result


@router.get("/projects/{project_id}/tasks")
def get_tasks(project_id: int):
    result = list_tasks(project_id)
    if result is None:
        raise HTTPException(status_code=404, detail="Project not found.")
    return result


@router.patch("/projects/{project_id}/tasks/{task_id}")
def patch_task(project_id: int, task_id: int, body: TaskUpdate):
    result = update_task(project_id, task_id, body.model_dump(exclude_unset=True))
    if result is None:
        raise HTTPException(status_code=404, detail="Project or task not found.")
    return result


@router.post("/projects/{project_id}/decisions")
def post_decision(project_id: int, body: DecisionCreate):
    result = create_decision(project_id, body.model_dump())
    if result is None:
        raise HTTPException(status_code=404, detail="Project not found.")
    return result


@router.get("/projects/{project_id}/decisions")
def get_decisions(project_id: int):
    result = list_decisions(project_id)
    if result is None:
        raise HTTPException(status_code=404, detail="Project not found.")
    return result
