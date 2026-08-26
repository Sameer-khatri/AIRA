from __future__ import annotations

from datetime import datetime
from typing import Any, Optional

from sqlalchemy import case, func
from sqlmodel import Session, select

from app.database import engine
from app.models.project import (
    Project,
    ProjectCheckpoint,
    ProjectDecision,
    ProjectTask,
)
from app.core.brain.schemas import (
    CheckpointContext,
    DecisionContext,
    ProjectContext,
    TaskContext,
)

DEFAULT_PROJECT = {
    "name": "AIRA",
    "description": "Local-first desktop AI companion project",
    "status": "active",
    "current_milestone": "Milestone 2A",
    "current_focus": "Project Memory Foundation",
    "priority": "high",
}

OPEN_TASK_STATUSES_EXCLUDED = {"done", "completed", "closed", "cancelled", "canceled", "archived"}
PRIORITY_RANK = {
    "urgent": 0,
    "critical": 0,
    "high": 1,
    "medium": 2,
    "normal": 2,
    "low": 3,
}
PROJECT_CONTEXT_TASK_LIMIT = 5
PROJECT_CONTEXT_DECISION_LIMIT = 3


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


def _get_or_create_default_project_record(session: Session) -> Project:
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
    return project


def _is_open_task(task: ProjectTask) -> bool:
    return task.status.strip().lower() not in OPEN_TASK_STATUSES_EXCLUDED


def _task_priority_rank(task: ProjectTask) -> int:
    return PRIORITY_RANK.get(task.priority.strip().lower(), 4)


def _task_order_key(task: ProjectTask) -> tuple[int, datetime, int]:
    return (_task_priority_rank(task), task.created_at, task.id or 0)


def select_recommended_next_action(
    latest_checkpoint: Optional[ProjectCheckpoint],
    project: Project,
    pending_tasks: list[ProjectTask],
) -> Optional[str]:
    checkpoint_next_action = latest_checkpoint.next_action.strip() if latest_checkpoint and latest_checkpoint.next_action else ""
    if checkpoint_next_action:
        return checkpoint_next_action

    project_next_step = project.next_step.strip() if project.next_step else ""
    if project_next_step:
        return project_next_step

    if pending_tasks:
        return sorted(pending_tasks, key=_task_order_key)[0].title

    return None


def _checkpoint_context(checkpoint: ProjectCheckpoint) -> CheckpointContext:
    return CheckpointContext(
        id=checkpoint.id or 0,
        title=checkpoint.title,
        summary=checkpoint.summary,
        completed_work=checkpoint.completed_work,
        current_problem=checkpoint.current_problem,
        decisions_made=checkpoint.decisions_made,
        next_action=checkpoint.next_action,
        user_focus_state=checkpoint.user_focus_state,
        confidence=checkpoint.confidence,
        created_at=checkpoint.created_at,
    )


def _task_context(task: ProjectTask) -> TaskContext:
    return TaskContext(
        id=task.id or 0,
        title=task.title,
        description=task.description,
        status=task.status,
        priority=task.priority,
        due_date=task.due_date,
        created_at=task.created_at,
    )


def _decision_context(decision: ProjectDecision) -> DecisionContext:
    return DecisionContext(
        id=decision.id or 0,
        decision=decision.decision,
        reason=decision.reason,
        impact=decision.impact,
        created_at=decision.created_at,
    )


def get_active_project_context(session: Session) -> ProjectContext:
    project = _get_or_create_default_project_record(session)
    project_id = project.id or 0

    latest_checkpoint = session.exec(
        select(ProjectCheckpoint)
        .where(ProjectCheckpoint.project_id == project_id)
        .order_by(ProjectCheckpoint.created_at.desc(), ProjectCheckpoint.id.desc())
    ).first()
    normalized_status = func.lower(func.trim(ProjectTask.status))
    normalized_priority = func.lower(func.trim(ProjectTask.priority))
    priority_order = case(
        (normalized_priority.in_(["urgent", "critical"]), 0),
        (normalized_priority == "high", 1),
        (normalized_priority.in_(["medium", "normal"]), 2),
        (normalized_priority == "low", 3),
        else_=4,
    )
    pending_tasks = session.exec(
        select(ProjectTask)
        .where(
            ProjectTask.project_id == project_id,
            normalized_status.notin_(OPEN_TASK_STATUSES_EXCLUDED),
        )
        .order_by(priority_order, ProjectTask.created_at.asc(), ProjectTask.id.asc())
        .limit(PROJECT_CONTEXT_TASK_LIMIT)
    ).all()
    recent_decisions = session.exec(
        select(ProjectDecision)
        .where(ProjectDecision.project_id == project_id)
        .order_by(ProjectDecision.created_at.desc(), ProjectDecision.id.desc())
        .limit(PROJECT_CONTEXT_DECISION_LIMIT)
    ).all()

    return ProjectContext(
        project_id=project_id,
        project_name=project.name,
        description=project.description,
        status=project.status,
        current_milestone=project.current_milestone,
        current_focus=project.current_focus,
        project_next_step=project.next_step,
        latest_checkpoint=_checkpoint_context(latest_checkpoint) if latest_checkpoint else None,
        pending_tasks=[_task_context(task) for task in pending_tasks],
        recent_decisions=[_decision_context(decision) for decision in recent_decisions],
        recommended_next_action=select_recommended_next_action(latest_checkpoint, project, pending_tasks),
        has_checkpoint=latest_checkpoint is not None,
    )


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
        project = _get_or_create_default_project_record(session)
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
