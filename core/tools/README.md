# core/tools/

Tool registry and safe tool execution framework.

## What this folder is for

AIRA can perform actions (open files, create notes, save checkpoints, etc.) through a tool system. This module defines the tool registry, execution framework, and validation logic.

## What will go here later

- **Tool Registry** — Central list of all available tools and their schemas.
- **Tool Executor** — Safely executes tools with validation and error handling.
- **Tool Validator** — Validates tool arguments against schemas and allowlists.
- **Result Reporter** — Formats tool results for the user and action log.

## What does NOT go here

- Actual tool implementations (those go in `hands/` for local actions).
- Safety/permission checks (use `core/safety/`).
- Brain orchestration (use `core/brain/`).

## Current status

Structure only. The tool system will be built alongside the Brain in Milestone 1–2.
