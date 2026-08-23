# apps/backend/

The AIRA local backend — built with **Python** and **FastAPI**.

## What this folder is for

This is the engine that powers AIRA. It runs as a local HTTP/WebSocket service on `localhost` and handles:

- Chat orchestration and AI model routing.
- Memory storage and retrieval.
- Project and checkpoint management.
- Learning/course/roadmap tracking.
- Voice pipeline (speech-to-text, text-to-speech).
- Screen capture and OCR processing.
- Avatar state management.
- Settings and privacy controls.
- Tool execution and action logging.

## What will go here later

- `app/` — Python application code:
  - `main.py` — FastAPI entry point.
  - `config.py` — Configuration management.
  - `database.py` — SQLite connection and ORM setup.
  - `api/` — API route handlers.
  - `services/` — Business logic services.
  - `models/` — Database models (SQLModel/SQLAlchemy).
- `tests/` — Unit and integration tests.
- `pyproject.toml` — Python dependencies and project metadata.

## What does NOT go here

- Frontend/UI code (use `apps/desktop/`).
- Shared TypeScript types (use `packages/shared-types/`).
- Avatar assets (use `avatar/`).
- Documentation (use `docs/`).

## Tech stack

| Tool | Purpose |
|---|---|
| Python 3.11+ | Runtime |
| FastAPI | Web framework (HTTP + WebSocket) |
| SQLite | Local database |
| SQLModel | ORM (Pydantic + SQLAlchemy) |
| Ollama client | Local LLM integration |
| Whisper / faster-whisper | Speech-to-text |
| Piper TTS | Text-to-speech |
| Tesseract / EasyOCR | OCR for screen text |
| Uvicorn | ASGI server |

## API binding

The backend binds only to `localhost` by default:
```
http://127.0.0.1:<port>
```

No public network access. No cloud deployment.

## Current status

Structure only. No code or dependencies installed yet.
