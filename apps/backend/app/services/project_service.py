from __future__ import annotations

from datetime import datetime
from typing import Any, Optional

from sqlmodel import Session, select

from app.database import engine
from app.models.project import (
    Project,
    ProjectCheckpoint,
    ProjectDecision,
    ProjectTask,
)

DEFAULT_PROJECT = {
    "name": "AIRA",
    "description": "Local-first desktop AI companion project",
    "status": "active",
    "current_milestone": "Milestone 2A",
    "current_focus": "Project Memory Foundation",
    "priority": "high",
}


def _iso(value: Optional[datetime]) -> Optional[str]:
    return value.isoformat() if value else None


def serialize_project(project: Project) -> dict[str, Any]:
    return {
        "id": project.id,
        "name": project.name,
        "description": project.description,
        "status": project.status,
        "current_milestone": project.current_milestone,
        "current_focus": project.current_focus,
        "active_task": project.active_task,
        "next_step": project.next_step,
        "priority": project.priority,
        "deadline": _iso(project.deadline),
        "created_at": _iso(project.created_at),
        "updated_at": _iso(project.updated_at),
    }


def serialize_checkpoint(checkpoint: ProjectCheckpoint) -> dict[str, Any]:
    return {
        "id": checkpoint.id,
        "project_id": checkpoint.project_id,
        "title": checkpoint.title,
        "summary": checkpoint.summary,
        "completed_work": checkpoint.completed_work,
        "current_problem": checkpoint.current_problem,
        "decisions_made": checkpoint.decisions_made,
        "next_action": checkpoint.next_action,
        "user_focus_state": checkpoint.user_focus_state,
        "confidence": checkpoint.confidence,
        "created_at": _iso(checkpoint.created_at),
    }


def serialize_task(task: ProjectTask) -> dict[str, Any]:
    return {
        "id": task.id,
        "project_id": task.project_id,
        "title": task.title,
        "description": task.description,
        "status": task.status,
        "priority": task.priority,
        "due_date": _iso(task.due_date),
        "created_at": _iso(task.created_at),
        "updated_at": _iso(task.updated_at),
    }


def serialize_decision(decision: ProjectDecision) -> dict[str, Any]:
    return {
        "id": decision.id,
        "project_id": decision.project_id,
        "decision": decision.decision,
        "reason": decision.reason,
        "impact": decision.impact,
        "created_at": _iso(decision.created_at),
    }


def _get_project(session: Session, project_id: int) -> Optional[Project]:
    return session.get(Project, project_id)


def list_projects() -> list[dict[str, Any]]:
    with Session(engine) as session:
        projects = session.exec(
            select(Project).order_by(Project.updated_at.desc(), Project.id.desc())
        ).all()
        return [serialize_project(project) for project in projects]


def create_project(data: dict[str, Any]) -> dict[str, Any]:
    now = datetime.utcnow()
    project = Project(**data, created_at=now, updated_at=now)
    with Session(engine) as session:
        session.add(project)
        session.commit()
        session.refresh(project)
        return serialize_project(project)


def get_project(project_id: int, include_children: bool = True) -> Optional[dict[str, Any]]:
    with Session(engine) as session:
        project = _get_project(session, project_id)
        if project is None:
            return None

        result = serialize_project(project)
        if include_children:
            checkpoints = session.exec(
                select(ProjectCheckpoint)
                .where(ProjectCheckpoint.project_id == project_id)
                .order_by(ProjectCheckpoint.created_at.desc(), ProjectCheckpoint.id.desc())
            ).all()
            tasks = session.exec(
                select(ProjectTask)
                .where(ProjectTask.project_id == project_id)
                .order_by(ProjectTask.updated_at.desc(), ProjectTask.id.desc())
            ).all()
            decisions = session.exec(
                select(ProjectDecision)
                .where(ProjectDecision.project_id == project_id)
                .order_by(ProjectDecision.created_at.desc(), ProjectDecision.id.desc())
            ).all()
            result.update(
                {
                    "checkpoints": [serialize_checkpoint(item) for item in checkpoints],
                    "tasks": [serialize_task(item) for item in tasks],
                    "decisions": [serialize_decision(item) for item in decisions],
                }
            )
        return result


def update_project(project_id: int, data: dict[str, Any]) -> Optional[dict[str, Any]]:
    with Session(engine) as session:
        project = _get_project(session, project_id)
        if project is None:
            return None
        for key, value in data.items():
            setattr(project, key, value)
        project.updated_at = datetime.utcnow()
        session.add(project)
        session.commit()
        session.refresh(project)
        return serialize_project(project)


def get_or_create_default_project() -> dict[str, Any]:
    with Session(engine) as session:
        project = session.exec(
            select(Project)
            .where(Project.status == "active")
            .order_by(Project.updated_at.desc(), Project.id.asc())
        ).first()
        if project is None:
            now = datetime.utcnow()
            project = Project(**DEFAULT_PROJECT, created_at=now, updated_at=now)
            session.add(project)
            session.commit()
            session.refresh(project)
        return serialize_project(project)


def create_checkpoint(project_id: int, data: dict[str, Any]) -> Optional[dict[str, Any]]:
    with Session(engine) as session:
        project = _get_project(session, project_id)
        if project is None:
            return None

        checkpoint = ProjectCheckpoint(project_id=project_id, **data)
        session.add(checkpoint)
        project.updated_at = datetime.utcnow()
        if checkpoint.next_action:
            project.next_step = checkpoint.next_action
        if checkpoint.current_problem:
            project.current_focus = checkpoint.current_problem
        session.add(project)
        session.commit()
        session.refresh(checkpoint)
        return serialize_checkpoint(checkpoint)


def list_checkpoints(project_id: int) -> Optional[list[dict[str, Any]]]:
    with Session(engine) as session:
        if _get_project(session, project_id) is None:
            return None
        checkpoints = session.exec(
            select(ProjectCheckpoint)
            .where(ProjectCheckpoint.project_id == project_id)
            .order_by(ProjectCheckpoint.created_at.desc(), ProjectCheckpoint.id.desc())
        ).all()
        return [serialize_checkpoint(item) for item in checkpoints]


def get_latest_checkpoint(project_id: int) -> Optional[dict[str, Any]]:
    with Session(engine) as session:
        if _get_project(session, project_id) is None:
            return None
        checkpoint = session.exec(
            select(ProjectCheckpoint)
            .where(ProjectCheckpoint.project_id == project_id)
            .order_by(ProjectCheckpoint.created_at.desc(), ProjectCheckpoint.id.desc())
        ).first()
        return serialize_checkpoint(checkpoint) if checkpoint else None


def create_task(project_id: int, data: dict[str, Any]) -> Optional[dict[str, Any]]:
    with Session(engine) as session:
        if _get_project(session, project_id) is None:
            return None
        now = datetime.utcnow()
        task = ProjectTask(project_id=project_id, **data, created_at=now, updated_at=now)
        session.add(task)
        session.commit()
        session.refresh(task)
        return serialize_task(task)


def list_tasks(project_id: int) -> Optional[list[dict[str, Any]]]:
    with Session(engine) as session:
        if _get_project(session, project_id) is None:
            return None
        tasks = session.exec(
            select(ProjectTask)
            .where(ProjectTask.project_id == project_id)
            .order_by(ProjectTask.updated_at.desc(), ProjectTask.id.desc())
        ).all()
        return [serialize_task(item) for item in tasks]


def update_task(project_id: int, task_id: int, data: dict[str, Any]) -> Optional[dict[str, Any]]:
    with Session(engine) as session:
        if _get_project(session, project_id) is None:
            return None
        task = session.exec(
            select(ProjectTask)
            .where(ProjectTask.id == task_id, ProjectTask.project_id == project_id)
        ).first()
        if task is None:
            return None
        for key, value in data.items():
            setattr(task, key, value)
        task.updated_at = datetime.utcnow()
        session.add(task)
        session.commit()
        session.refresh(task)
        return serialize_task(task)


def create_decision(project_id: int, data: dict[str, Any]) -> Optional[dict[str, Any]]:
    with Session(engine) as session:
        if _get_project(session, project_id) is None:
            return None
        decision = ProjectDecision(project_id=project_id, **data)
        session.add(decision)
        session.commit()
        session.refresh(decision)
        return serialize_decision(decision)


def list_decisions(project_id: int) -> Optional[list[dict[str, Any]]]:
    with Session(engine) as session:
        if _get_project(session, project_id) is None:
            return None
        decisions = session.exec(
            select(ProjectDecision)
            .where(ProjectDecision.project_id == project_id)
            .order_by(ProjectDecision.created_at.desc(), ProjectDecision.id.desc())
        ).all()
        return [serialize_decision(item) for item in decisions]
