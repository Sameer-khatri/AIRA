# Architecture Decisions

This folder records the key architecture and technology decisions made for AIRA. Each decision is documented with its reasoning so future developers understand **why** things are built a certain way.

---

## Decision Record Format

Each decision follows this structure:
- **Decision:** What was decided.
- **Reasoning:** Why this choice was made.
- **Status:** Locked / Under review / Superseded.

---

## ADR-001: Local-First by Default

**Decision:** All core AIRA features must work locally without internet or cloud services.

**Reasoning:** AIRA is a private personal assistant. The user's project data, learning progress, voice recordings, and screen captures must never leave the device without explicit consent. A local-first approach also eliminates recurring API costs, which is critical for the ₹0 budget target. Cloud features may be added as optional fallbacks later, but they are disabled by default and never required for core functionality.

**Status:** Locked.

---

## ADR-002: Tauri for Desktop Shell

**Decision:** Use Tauri 2 instead of Electron for the desktop application.

**Reasoning:** AIRA must run alongside the user's normal workload (browser, IDE, video player, etc.) on a 16 GB RAM laptop. Electron bundles an entire Chromium instance, consuming 300–500+ MB of RAM. Tauri uses the OS's native webview, resulting in significantly lower memory usage and smaller application size. Tauri also provides native Rust commands for OS-level operations (system tray, transparent windows, global hotkeys, process management) that AIRA needs for the avatar and desktop integration.

**Status:** Locked.

---

## ADR-003: React + TypeScript for Frontend UI

**Decision:** Use React with TypeScript and Vite for the dashboard and all frontend UI.

**Reasoning:** React has the strongest ecosystem for building complex dashboard UIs with charts, state management, animations, and component libraries. TypeScript adds type safety, which is important for a project with many data models (projects, courses, checkpoints, memories). Vite provides fast development builds. The combination integrates cleanly with Tauri.

**Status:** Locked.

---

## ADR-004: Python FastAPI for Local Backend

**Decision:** Use Python with FastAPI as the local backend service.

**Reasoning:** Python has the best ecosystem for AI, machine learning, speech processing, OCR, embeddings, and local model integration. FastAPI is lightweight, supports WebSockets (needed for streaming chat and voice status), and is clean enough for a local service. The backend runs only on localhost — it is not a deployed web server. Python allows AIRA to use libraries like Whisper, Piper, Tesseract, sentence-transformers, and Ollama client libraries directly.

**Status:** Locked.

---

## ADR-005: SQLite for Local Database

**Decision:** Use SQLite as the primary database for all structured data.

**Reasoning:** SQLite is free, local, serverless, reliable, and perfect for a single-user personal assistant. It requires no installation or configuration. Backup is as simple as copying a file. SQLite can handle all of AIRA's data needs (projects, checkpoints, courses, learning events, memories, settings, action logs) without any performance concerns at this scale. If semantic search is needed, sqlite-vec or Chroma can supplement SQLite for vector operations.

**Status:** Locked.

---

## ADR-006: Ollama / Local Models Later

**Decision:** Use Ollama as the primary local LLM runtime. Do not install models during the structure phase.

**Reasoning:** Ollama makes local model setup easy (single command to pull models), supports multiple quantized models, and provides a clean API for inference. Recommended models for the RTX 3050 4 GB VRAM are Qwen 2.5 3B, Llama 3.2 3B, or Phi 3.5 Mini. Only one heavy model should be loaded at a time. Model installation is deferred to Milestone 1 to keep the structure phase clean and avoid unnecessary downloads.

**Status:** Locked.

---

## ADR-007: No Continuous Screen Vision

**Decision:** AIRA must not watch the screen continuously. Screen access is always on-demand and permission-gated.

**Reasoning:** Continuous screen analysis would consume significant GPU resources on the target laptop, create privacy concerns, and provide limited value compared to on-demand analysis. The user explicitly invokes screen capture through voice, keyboard shortcut, or avatar menu. A visible indicator always shows when capture is active. Screenshots are temporary by default and deleted after analysis unless the user explicitly saves them.

**Status:** Locked.

---

## ADR-008: No Continuous Camera

**Decision:** The webcam is off by default and only activates on explicit user request.

**Reasoning:** Similar to screen vision — continuous camera analysis is resource-intensive, privacy-invasive, and not needed for AIRA's core value proposition. Camera mode is a V2 feature. When implemented, it will capture single frames on demand with a visible indicator, not run continuously.

**Status:** Locked.

---

## ADR-009: No Paid API Dependency for Core V1

**Decision:** AIRA V1 must not require any paid API, subscription, or cloud service for core functionality.

**Reasoning:** The budget target is ₹0 recurring cost. All core features — voice, chat, memory, dashboard, tracking, and screen understanding — must work with local open-source models and tools. Optional cloud fallback (for difficult reasoning tasks) may be added later as an opt-in feature, but the product must be fully functional without it. This is a fundamental product principle, not just a technical constraint.

**Status:** Locked.

---

## ADR-010: Avatar Comes After Core Assistant Foundation

**Decision:** Build the assistant's brain, memory, and tracking capabilities before investing in avatar visuals and animations.

**Reasoning:** If the build starts with a fancy avatar but weak memory, AIRA will feel like decoration. If the build starts with project memory, checkpoints, and a working dashboard, the avatar later feels alive because it represents a useful brain. The avatar is important for the final product feel, but the build order prioritizes backend → chat → memory → projects → learning → dashboard → voice → avatar → screen sense.

**Status:** Locked.

---

## Future Decisions

Additional decisions will be recorded here as development progresses, including:

- Vector database selection (sqlite-vec vs Chroma).
- Specific local model selection after benchmarking.
- Avatar implementation technology (Sprite vs Rive vs Live2D).
- Browser extension architecture.
- Wake word configuration.
- Data backup and migration strategy.
