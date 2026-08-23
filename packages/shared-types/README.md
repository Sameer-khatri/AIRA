# packages/shared-types/

Shared TypeScript type definitions used across AIRA's frontend apps.

## What goes here

- TypeScript interfaces and types for data models (projects, courses, checkpoints, memories, settings).
- API request/response type definitions.
- Enum definitions shared between desktop app and browser extension.

## What will go here later

- `src/` — TypeScript source files with exported types.
- `package.json` — Package metadata.
- Type definitions matching the backend's database models.

## What does NOT go here

- UI components (use `packages/ui-kit/`).
- Runtime logic or business code.
- Backend Python types (those live in `apps/backend/`).

## Current status

Structure only. Types will be defined alongside Milestone 0 when the backend API shape is established.
