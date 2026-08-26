from types import SimpleNamespace

import pytest

from app.core.brain.intent_router import detect_intent
from app.core.brain.orchestrator import process_chat_message
from app.core.brain.schemas import ProjectContext


@pytest.mark.parametrize(
    "message",
    [
        "Where did I leave off?",
        "Where did we leave off?",
        "What should I work on next?",
        "What should we work on next?",
        "What should I work on next for the AIRA project?",
        "What is the next step?",
        "Let’s move to the next step.",
        "Continue from where we stopped.",
        "Resume the project.",
        "Give me AIRA project status.",
        "What are my pending tasks?",
        "What was the last checkpoint?",
        "What are we currently working on?",
        "What was I working on?",
        "What should I do next?",
        "What is the current state of AIRA?",
        "What is the status of the AIRA project?",
        "What tasks are pending?",
        "Resume my project",
        "Continue from last time",
    ],
)
def test_required_project_questions_route_to_project_question(message):
    assert detect_intent(message) == "project_question"


def test_unrelated_next_question_stays_general_chat():
    assert detect_intent("What should I eat next?") == "general_chat"


def test_intent_normalization_handles_punctuation_apostrophes_and_whitespace():
    assert detect_intent("  LET’S   MOVE—to the next step!!! ") == "project_question"


def test_brain_response_reports_project_context_used(monkeypatch):
    def fake_chat(messages, model=None):
        assert "PROJECT MEMORY CONTEXT" in messages[0]["content"]
        return "You left off at the saved checkpoint."

    monkeypatch.setattr("app.services.ollama_service.chat", fake_chat)
    response = process_chat_message(
        user_message="Where did I leave off?",
        conversation_history=[],
        detected_intent="project_question",
        project_context=ProjectContext(
            project_id=1,
            project_name="AIRA",
            has_checkpoint=False,
        ),
    )

    assert response.intent == "project_question"
    assert response.project_context_used is True
    assert response.status == "ok"


def test_chat_service_does_not_load_context_for_general_chat(monkeypatch):
    from app.services import chat_service

    class FakeResult:
        def all(self):
            return []

    class FakeSession:
        def __enter__(self):
            return self

        def __exit__(self, exc_type, exc, traceback):
            return False

        def get(self, model, record_id):
            return None

        def exec(self, statement):
            return FakeResult()

        def add(self, entity):
            if getattr(entity, "id", None) is None:
                entity.id = 1

        def commit(self):
            return None

        def refresh(self, entity):
            if getattr(entity, "id", None) is None:
                entity.id = 1

    monkeypatch.setattr(chat_service, "Session", lambda engine: FakeSession())
    monkeypatch.setattr(chat_service, "detect_intent", lambda message: "general_chat")
    monkeypatch.setattr(
        chat_service,
        "get_active_project_context",
        lambda session: (_ for _ in ()).throw(AssertionError("context loader must not run")),
    )

    def fake_process(**kwargs):
        assert kwargs["detected_intent"] == "general_chat"
        assert kwargs["project_context"] is None
        return SimpleNamespace(
            reply="Hello.",
            mode="mock",
            model="test-model",
            status="ok",
            intent="general_chat",
            privacy_state="normal",
            project_context_used=False,
        )

    monkeypatch.setattr("app.core.brain.orchestrator.process_chat_message", fake_process)

    response = chat_service.handle_chat(None, "Hello AIRA")

    assert response["intent"] == "general_chat"
    assert response["project_context_used"] is False


def test_brain_response_reports_project_context_unused_for_general_chat(monkeypatch):
    def fake_chat(messages, model=None):
        assert "PROJECT MEMORY CONTEXT" not in messages[0]["content"]
        return "Hello."

    monkeypatch.setattr("app.services.ollama_service.chat", fake_chat)
    response = process_chat_message(
        user_message="Hello AIRA",
        conversation_history=[],
        detected_intent="general_chat",
    )

    assert response.intent == "general_chat"
    assert response.project_context_used is False
