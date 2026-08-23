# core/safety/

Privacy guard, permission logic, and action risk classification.

## What this folder is for

This module ensures AIRA respects the user's privacy and never performs risky actions without authorization. It is the gatekeeper for all sensitive operations.

## What will go here later

- **Privacy Guard** — Ensures screen, camera, and mic access only happen with permission.
- **Permission Manager** — Tracks which capabilities are enabled/disabled.
- **Risk Classifier** — Assigns risk levels (A0–A3) to requested actions.
- **Confirmation Engine** — Triggers user confirmation for A2+ actions.
- **Audit Logger** — Logs all permission checks and action results.

## Action risk levels (from PRD)

| Level | Examples | Policy |
|---|---|---|
| A0 — Read-only | Read approved file, inspect dashboard | Execute after request, log |
| A1 — Local reversible | Open app, create draft, add note | Execute, show result, offer undo |
| A2 — External/material | Send message, overwrite file | Confirm before action |
| A3 — Prohibited | Payments, delete broad data, credentials | Blocked in V1 |

## What does NOT go here

- Tool implementations (use `core/tools/` or `hands/`).
- Brain logic (use `core/brain/`).
- UI for permission dialogs (use `apps/desktop/`).

## Current status

Structure only. Safety logic will be integrated from Milestone 1 onward.
