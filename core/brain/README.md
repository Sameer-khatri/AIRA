# core/brain/

The central orchestrator — AIRA's decision-making engine.

## What this folder is for

The Brain is the module that decides what AIRA should do with each user request. It does not do everything itself — it routes to the right subsystem.

## What will go here later

- **Intent Router** — Classifies user input (question, command, project query, learning update, screen request, etc.).
- **Conversation Manager** — Maintains short-term conversation context.
- **Response Generator** — Produces the final user-facing response.
- **Tool Planner** — Decides which tools to call and in what order.
- **Personality Layer** — Applies AIRA's tone and communication style.
- **Model Router** — Selects which local model to use (text, vision, embedding).
- **Prompt Builder** — Constructs prompts with system instructions, memory context, and user input.

## What does NOT go here

- Memory storage logic (use `core/memory/`).
- Tool implementations (use `core/tools/` or `hands/`).
- Safety/permission logic (use `core/safety/`).
- Voice processing (use `voice/`).

## Current status

Structure only. The Brain will be built during Milestone 1 (Local Chat MVP).
