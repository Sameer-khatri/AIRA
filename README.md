# AIRA — Adaptive Intelligent Responsive Assistant

> A private, local-first desktop AI companion that remembers your projects, tracks your learning, speaks naturally, and helps you pick up exactly where you left off — all running on your own machine with zero recurring cost.

---

## What is AIRA?

AIRA is a personal desktop companion for Windows. She lives as an animated avatar on your screen, understands voice commands, remembers your ongoing projects and study progress, provides a futuristic dashboard, and performs safe local actions — all without requiring paid cloud APIs.

AIRA is not a generic chatbot. Her value comes from **structured memory**, **project continuity**, **learning analytics**, **voice interaction**, and **on-demand screen understanding** — not just AI conversation.

---

## Project Status

```
Phase:    ⚙️  Milestone 0 Foundation
Stage:    Milestone 0 — Runnable Foundation Complete
Code:     FastAPI backend + React frontend running
Models:   Not yet installed
```

---

## Folder Map

```
AIRA/
│
├── README.md                  ← You are here
├── .gitignore                 ← Git ignore rules
│
├── IMP/                       ← Original PRD documents (do not modify)
│
├── docs/                      ← Documentation hub
│   ├── architecture/          ← System design and data flow
│   ├── prd/                   ← PRD reference and summaries
│   ├── setup/                 ← Environment and setup guides
│   └── decisions/             ← Architecture decision records
│
├── apps/                      ← Runnable applications
│   ├── desktop/               ← Tauri + React desktop app
│   ├── backend/               ← Python FastAPI local backend
│   └── browser-extension/     ← Chrome extension for learning tracking
│
├── packages/                  ← Shared libraries and configs
│   ├── shared-types/          ← TypeScript types shared across apps
│   ├── ui-kit/                ← Reusable UI components and design tokens
│   └── config/                ← Shared configuration and constants
│
├── core/                      ← AIRA's intelligence layer
│   ├── brain/                 ← Orchestrator, intent routing, response generation
│   ├── memory/                ← Long-term memory, checkpoints, retrieval
│   ├── tools/                 ← Tool registry and safe tool execution
│   └── safety/                ← Privacy guard, permission logic, action risk
│
├── hands/                     ← Actions AIRA can perform
│   ├── local-actions/         ← Opening apps, files, URLs
│   ├── app-control/           ← Application-specific interactions
│   ├── file-system/           ← File and folder operations
│   └── automation/            ← Scripted workflows and macros
│
├── senses/                    ← Inputs AIRA can perceive
│   ├── screen/                ← On-demand screenshot and OCR
│   ├── camera/                ← On-demand webcam capture
│   ├── microphone/            ← Audio input management
│   └── browser/               ← Browser context from extension
│
├── voice/                     ← Voice interaction pipeline
│   ├── speech-to-text/        ← Local transcription (Whisper)
│   ├── text-to-speech/        ← Local voice output (Piper)
│   └── wake-word/             ← Wake phrase detection (openWakeWord)
│
├── avatar/                    ← Desktop companion visuals
│   ├── assets/                ← Sprite sheets, images, art files
│   ├── states/                ← State definitions and transitions
│   └── animations/            ← Animation data and controllers
│
├── integrations/              ← External service connectors
│   ├── ollama/                ← Ollama LLM runtime integration
│   ├── local-models/          ← Other local model adapters
│   ├── calendar/              ← Calendar integration (future)
│   ├── notes/                 ← Notes app integration (future)
│   └── future/                ← Placeholder for future integrations
│
├── data/                      ← Local data storage
│   ├── database/              ← SQLite schema and migrations
│   ├── vector-store/          ← Vector embeddings for semantic search
│   └── exports/               ← User data exports
│
├── scripts/                   ← Development and build scripts
│
└── tests/                     ← Cross-module and integration tests
```

---

## Tech Stack (Planned)

| Layer | Technology |
|---|---|
| Desktop Shell | Tauri 2 |
| Frontend | React + TypeScript + Vite |
| Backend | Python + FastAPI |
| Database | SQLite |
| Vector Memory | sqlite-vec / Chroma |
| Local LLM | Ollama (Qwen 2.5 3B / Llama 3.2 3B) |
| Speech-to-Text | whisper.cpp / faster-whisper |
| Text-to-Speech | Piper TTS |
| Wake Word | openWakeWord |
| Avatar | Sprite / Rive (MVP), Live2D (later) |
| Browser Extension | Chrome Manifest V3 |

---

## Required Software

To develop and run AIRA locally, you need:
- **Node.js** (v18+ recommended)
- **Python** (v3.10+ recommended)

## Running the Application

### 1. Backend Setup & Run (FastAPI)

Navigate to the backend folder, create a virtual environment, install the application, and start the development server:

```bash
cd apps/backend
python -m venv .venv

# On Windows (Command Prompt):
.venv\Scripts\activate.bat
# On Windows (PowerShell):
.venv\Scripts\activate.ps1
# On macOS/Linux:
source .venv/bin/activate

pip install -e .
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

The database `aira.sqlite` will be created automatically in `apps/backend/` on startup.

### 2. Frontend Setup & Run (React + TS + Vite)

Open a new terminal window, navigate to the desktop frontend directory, install npm packages, and run the Vite dev server:

```bash
cd apps/desktop
npm install
npm run dev
```

The React interface will open at [http://localhost:5173](http://localhost:5173).

## Testing the Health Endpoint

Verify that the local backend service is functioning and accessing SQLite database by running:
```bash
curl http://127.0.0.1:8000/api/health
```

Expected output:
```json
{
  "status": "ok",
  "app": "AIRA",
  "mode": "local",
  "version": "0.1.0",
  "database": "connected"
}
```

## Next Step

**Milestone 1 — Local Chat MVP**
- Implement intent routing in `core/brain/`.
- Set up Ollama connection in `integrations/ollama/`.
- Stream local LLM chat responses.
- Manage conversation session records in SQLite.

---

## PRD Documents

All product requirements are locked in the `IMP/` folder:

- [Product Requirements](IMP/AIRA_Product_Requirements_Document_v1.0.md)
- [UI/UX Requirements](IMP/AIRA_UI_UX_Product_Requirements_Document_v1.0.md)
- [Tech Stack Requirements](IMP/AIRA_Tech_Stack_Product_Requirements_Document_v1.0.md)
- [MVP Implementation Roadmap](IMP/AIRA_MVP_Implementation_Roadmap_v1.0.md)

---

## License

Private project. Not open source at this time.
