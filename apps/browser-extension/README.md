# apps/browser-extension/

The AIRA browser extension — a **Chrome Manifest V3** extension for learning tracking.

## What this folder is for

This extension tracks course and video activity on user-approved websites. It is the bridge between the user's browser learning sessions and AIRA's local tracking system.

## What will go here later

- `src/` — Extension source code (content scripts, background service worker, popup UI).
- `manifest.json` — Chrome extension manifest.
- Extension icons and assets.
- Communication logic to send events to the local backend.

## What this extension will do

- Detect supported course/video platforms (YouTube, Udemy, etc.) on approved domains only.
- Track video play, pause, seek, and completion events.
- Measure active vs idle watching time.
- Send learning events to the local AIRA backend.
- Never track unapproved sites.

## What does NOT go here

- Desktop app code (use `apps/desktop/`).
- Backend code (use `apps/backend/`).
- Learning analytics logic (that lives in the backend).

## Current status

Not started. This is a V1.5 feature. The core assistant must work first.
