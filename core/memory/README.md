# core/memory/

Long-term memory management — how AIRA remembers and retrieves context.

## What this folder is for

This module manages AIRA's persistent knowledge about the user, their projects, learning progress, and preferences. Memory is what makes AIRA different from a stateless chatbot.

## What will go here later

- **Memory Store** — Read/write/delete operations for durable memories.
- **Checkpoint Manager** — Save and retrieve project checkpoints.
- **Memory Retriever** — Find relevant memories for a given query/context.
- **Memory Categorizer** — Classify memories (project, learning, preference, event).
- **Vector Search** — Semantic similarity search over notes and memories.
- **Conflict Detector** — Identify and resolve contradictory memories.

## Memory categories (from PRD)

| Category | Example |
|---|---|
| Working memory | Current conversation, active task |
| Project memory | Decisions, checkpoints, blockers, resources |
| Learning memory | Courses, progress, notes, practice |
| Preference memory | Voice, language, work habits, UI settings |
| Event memory | Significant events and completed outcomes |

## What does NOT go here

- Database schema definitions (use `data/database/`).
- Brain orchestration logic (use `core/brain/`).
- Raw data storage (use `data/`).

## Current status

Structure only. Memory will be built during Milestone 2 (Project Memory and Checkpoints).
