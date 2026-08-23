# AIRA Desktop Console

React + TypeScript + Vite frontend console interface for the AIRA desktop companion.

## Features (Milestone 0)
- Futuristic dark theme layout matching the AIRA design specifications.
- Persistent sidebar navigation spanning Home, Chat, Projects, Learning, Roadmap, Memory, and Settings.
- Mission Control Dashboard containing Status Cards.
- Automated system polling checker checking the local backend server health (`http://127.0.0.1:8000/api/health`) every 5 seconds.
- Interactive backend connection status badge (`SYSTEM ACTIVE` / `SYSTEM OFFLINE` / `ESTABLISHING...`).

## Prerequisites
- Node.js (LTS version recommended)
- npm or pnpm

## Setup & Installation

1. Navigate to the desktop directory:
   ```bash
   cd apps/desktop
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running in Development Mode

Run the development server:
```bash
npm run dev
```

The web console will be available at:
[http://localhost:5173](http://localhost:5173) or [http://127.0.0.1:5173](http://127.0.0.1:5173)

Ensure the backend server is running on port `8000` to see the Status indicators transition from **OFFLINE** to **CONNECTED**.
