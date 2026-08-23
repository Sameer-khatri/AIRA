# AIRA System Overview

This document explains AIRA's architecture in simple language. It is written for anyone joining the project or reviewing the design.

---

## 1. What AIRA Is

AIRA (Adaptive Intelligent Responsive Assistant) is a **private, local-first desktop AI companion** for Windows. She is not a cloud chatbot or a browser extension. She is a persistent personal assistant that:

- Lives on your desktop as an animated avatar.
- Talks and listens using local voice models.
- Remembers your projects, learning progress, and preferences.
- Tracks courses, notes, and placement preparation.
- Shows a futuristic dashboard with real analytics.
- Explains your screen content on demand.
- Performs safe local actions like opening files or saving checkpoints.

Everything runs on your laptop. No paid APIs. No cloud dependency for core features.

**Target machine:** ASUS TUF A15 — AMD Ryzen 7 7445HS, 16 GB RAM, NVIDIA RTX 3050 (4 GB VRAM).

---

## 2. Main System Parts

AIRA is built from these major parts:

| Part | What it does |
|---|---|
| **Desktop App** (Tauri + React) | The window you see — dashboard, chat, settings, avatar |
| **Local Backend** (Python FastAPI) | The engine — AI routing, data, memory, voice, tools |
| **Brain** | The decision-maker — understands intent, picks memory, calls models |
| **Memory** | The long-term storage — projects, checkpoints, learning, preferences |
| **Hands** | The action layer — opens apps, creates files, performs safe commands |
| **Senses** | The perception layer — screen capture, camera, microphone, browser data |
| **Voice** | The speech layer — speech-to-text, text-to-speech, wake word |
| **Avatar** | The visual presence — animated companion on your desktop |
| **Database** | The data store — SQLite for structured data, vector DB for semantic search |
| **Integrations** | The connectors — Ollama, local models, future calendar/notes |

---

## 3. How the Parts Connect

```
┌──────────────────────────────────────────────────┐
│                    USER                          │
│        (voice, keyboard, mouse, screen)          │
└──────────┬──────────────────────────┬────────────┘
           │                          │
           ▼                          ▼
┌──────────────────┐      ┌──────────────────────┐
│  DESKTOP APP     │      │  FLOATING AVATAR      │
│  (Tauri + React) │      │  (Transparent Window) │
│                  │      │                        │
│  - Dashboard     │      │  - States (idle,       │
│  - Chat UI       │      │    listening, speaking)│
│  - Settings      │      │  - Quick actions       │
│  - Projects      │      │  - Speech bubbles      │
│  - Learning      │      │                        │
└────────┬─────────┘      └──────────┬─────────────┘
         │                           │
         └─────────┬─────────────────┘
                   │ HTTP / WebSocket (localhost)
                   ▼
┌──────────────────────────────────────────────────┐
│              LOCAL BACKEND (FastAPI)              │
│                                                  │
│  ┌─────────────────────────────────────────────┐ │
│  │              BRAIN (Orchestrator)            │ │
│  │  - Intent Router                            │ │
│  │  - Conversation Manager                     │ │
│  │  - Response Generator                       │ │
│  │  - Tool Planner                             │ │
│  │  - Privacy Guard                            │ │
│  └──────┬──────┬──────┬──────┬──────┬──────────┘ │
│         │      │      │      │      │            │
│    ┌────▼──┐ ┌─▼───┐ ┌▼────┐ ┌▼───┐ ┌▼─────┐    │
│    │MEMORY │ │VOICE│ │SENSE│ │HAND│ │MODEL │    │
│    │       │ │     │ │     │ │    │ │ROUTE │    │
│    │SQLite │ │STT  │ │Scrn │ │Open│ │Ollama│    │
│    │Vector │ │TTS  │ │Cam  │ │File│ │Local │    │
│    │Search │ │Wake │ │OCR  │ │URL │ │LLM   │    │
│    └───────┘ └─────┘ └─────┘ └────┘ └──────┘    │
│                                                  │
└──────────────────────────────────────────────────┘
```

**Data flow summary:**
1. User speaks or types → Desktop App / Avatar sends request to Backend.
2. Backend's Brain routes the intent (is it a question? a command? a project query?).
3. Brain checks Memory for relevant context (project checkpoint, learning progress, preferences).
4. Brain calls the local LLM through Ollama if AI reasoning is needed.
5. Brain may call Hands (to open a file), Senses (to capture screen), or Voice (to speak).
6. Result goes back to the frontend for display and to the avatar for state animation.
7. Important events are logged to the database.

---

## 4. What Runs Locally

**Everything core runs on your laptop.** There is no required server or cloud subscription.

| Component | Runs locally? |
|---|---|
| Desktop app (Tauri) | ✅ Yes |
| Dashboard (React) | ✅ Yes |
| Backend (FastAPI) | ✅ Yes — localhost only |
| Database (SQLite) | ✅ Yes — file on disk |
| LLM inference (Ollama) | ✅ Yes — GPU/CPU |
| Speech-to-text (Whisper) | ✅ Yes |
| Text-to-speech (Piper) | ✅ Yes |
| Wake word (openWakeWord) | ✅ Yes |
| Screen capture | ✅ Yes — OS APIs |
| Avatar rendering | ✅ Yes — lightweight 2D |
| Vector search | ✅ Yes — local embeddings |

**Optional cloud fallback** may be added later for difficult reasoning tasks, but it is disabled by default and never required.

---

## 5. What Is Not Built Yet

As of now, AIRA is in the **planning/structure phase**. None of the following are implemented:

| Not built yet | Status |
|---|---|
| Tauri desktop app | Structure only |
| React dashboard | Structure only |
| FastAPI backend | Structure only |
| Local LLM integration | Not started |
| Voice pipeline | Not started |
| Avatar system | Not started |
| Screen sense | Not started |
| Camera sense | Not started |
| Browser extension | Not started |
| Database schema | Not started |
| Wake word | Not started |

The project currently contains:
- ✅ Four locked PRD documents in `IMP/`
- ✅ Complete folder structure with README files
- ✅ Architecture documentation
- ✅ Decision records

---

## 6. First Development Milestone After Structure

### Milestone 0 — Project Foundation

**Goal:** Create a working skeleton where the desktop app opens, the backend starts, and they can talk to each other.

**Deliverables:**
1. Initialize Tauri + React app in `apps/desktop/`.
2. Initialize FastAPI app in `apps/backend/`.
3. Create SQLite database connection.
4. Create a `/api/health` endpoint that returns success.
5. Make the desktop app call the backend health endpoint on startup.
6. Verify everything works on the target laptop.

**Success criteria:**
- Running `desktop dev` opens a window.
- Running `backend dev` starts the API server.
- The desktop app shows "Backend connected" from the health check.
- No paid services are required.

**After Milestone 0**, the next step is Milestone 1 — Local Chat MVP, where the user can type a message and receive a response from a local LLM through Ollama.

---

## Architecture Decision References

See [docs/decisions/README.md](../decisions/README.md) for the full list of locked architecture decisions.
