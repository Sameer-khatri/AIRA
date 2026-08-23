# apps/desktop/

The AIRA desktop application — built with **Tauri 2** (Rust) and **React + TypeScript** (Vite).

## What this folder is for

This is where the main desktop application lives. It provides:

- The dashboard window (command center UI).
- The floating avatar window (transparent, always-on-top companion).
- The system tray icon and menu.
- Global keyboard shortcuts.
- Native OS integrations (microphone, screen capture, camera permissions).
- Communication with the local backend via HTTP/WebSocket.

## What will go here later

- `src/` — React + TypeScript source code (components, routes, features, hooks, stores).
- `src-tauri/` — Tauri/Rust native code (commands, window management, tray, hotkeys).
- `public/` — Static assets (icons, fonts, images).
- `package.json` — Node.js dependencies and scripts.
- Vite and Tauri configuration files.

## What does NOT go here

- Backend/API code (use `apps/backend/`).
- AI brain logic (use `core/brain/`).
- Voice processing code (use `voice/`).
- Avatar art assets (use `avatar/assets/`).
- Shared types (use `packages/shared-types/`).

## Tech stack

| Tool | Purpose |
|---|---|
| Tauri 2 | Native desktop shell, system tray, hotkeys, transparent windows |
| React | Dashboard UI framework |
| TypeScript | Type-safe frontend code |
| Vite | Fast build tool |
| Zustand | State management |
| TanStack Query | Server state / API data fetching |
| Framer Motion | Animations |
| Recharts | Dashboard charts |
| Radix UI | Accessible UI primitives |

## Current status

Structure only. No code or dependencies installed yet.
