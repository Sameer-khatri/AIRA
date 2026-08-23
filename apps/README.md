# apps/

This folder contains the runnable applications that make up AIRA.

## Structure

```
apps/
├── desktop/            ← Tauri + React desktop application
├── backend/            ← Python FastAPI local backend service
└── browser-extension/  ← Chrome extension for learning tracking
```

## What goes here

- Complete, runnable application code.
- Each subfolder is a self-contained app with its own dependencies, build config, and entry point.

## What does NOT go here

- Shared libraries or types (use `packages/`).
- Core AI/brain logic (use `core/`).
- Action handlers (use `hands/`).
- Perception modules (use `senses/`).
- Voice pipeline (use `voice/`).
- Documentation (use `docs/`).

## Build order

1. `backend/` — Start here. The backend is the engine that powers everything.
2. `desktop/` — The Tauri + React app connects to the backend.
3. `browser-extension/` — Added after core assistant works (V1.5).
