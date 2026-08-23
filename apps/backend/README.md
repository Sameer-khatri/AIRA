# AIRA Local Backend

FastAPI local backend service for the AIRA desktop companion.

## Features (Milestone 0)
- REST API bound to `127.0.0.1:8000` with local CORS enabled.
- Database initialization creating SQLite database on start.
- `Settings` table setup.
- `/api/health` endpoint reporting app version, mode, status, and SQLite connectivity.

## Prerequisites
- Python 3.10+
- SQLite3

## Setup & Installation

1. Navigate to the backend directory:
   ```bash
   cd apps/backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv .venv
   ```

3. Activate the virtual environment:
   - **Windows (Command Prompt):**
     ```cmd
     .venv\Scripts\activate.bat
     ```
   - **Windows (PowerShell):**
     ```powershell
     .venv\Scripts\activate.ps1
     ```
   - **macOS/Linux:**
     ```bash
     source .venv/bin/activate
     ```

4. Install the package in editable mode:
   ```bash
   pip install -e .
   ```

## Running the Backend

Start the server using `uvicorn`:
```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

The service will run locally at:
[http://127.0.0.1:8000](http://127.0.0.1:8000)

## Testing the Health Check Endpoint

You can test the health endpoint using a web browser or curl:
```bash
curl http://127.0.0.1:8000/api/health
```

Expected JSON response:
```json
{
  "status": "ok",
  "app": "AIRA",
  "mode": "local",
  "version": "0.1.0",
  "database": "connected"
}
```
Upon startup, a file named `aira.sqlite` will be created in this directory.
