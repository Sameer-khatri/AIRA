# AIRA Data Flow

This document explains how data moves through AIRA for common user scenarios. Each flow is written step-by-step so a beginner can follow it.

---

## Flow 1: User Chats with AIRA

**Scenario:** The user types "What should I work on today?" in the chat box.

```
Step 1: User types message in the Desktop App (React chat UI).
Step 2: Desktop App sends the message to the Local Backend via HTTP POST to /api/chat.
Step 3: Backend's Brain (Orchestrator) receives the message.
Step 4: Brain's Intent Router classifies this as a "planning question."
Step 5: Brain checks Memory for:
        - Active projects and their last checkpoints.
        - Today's planned tasks.
        - Learning roadmap items due today.
Step 6: Brain builds a prompt with:
        - AIRA's personality/system instructions.
        - Retrieved memory context.
        - The user's question.
Step 7: Brain sends the prompt to Ollama (local LLM).
Step 8: Ollama generates a response using the local model (e.g., Qwen 2.5 3B).
Step 9: Response streams back to the Backend.
Step 10: Backend sends the streamed response to the Desktop App via WebSocket.
Step 11: Desktop App displays the response in the chat UI.
Step 12: Backend saves the conversation to the SQLite database.
Step 13: Avatar state changes: Idle → Thinking → Speaking → Idle.
```

**Key point:** The LLM only runs when needed. Memory retrieval happens before the LLM call so the model has context.

---

## Flow 2: User Asks "Where Did I Leave Off?"

**Scenario:** The user returns after a break and says "Where did I leave off on my placement project?"

```
Step 1: User speaks or types the question.
Step 2: If voice: Microphone captures audio → Whisper transcribes to text.
Step 3: Backend's Brain receives: "Where did I leave off on my placement project?"
Step 4: Intent Router classifies this as a "project continuation" query.
Step 5: Brain searches the Projects table for a project matching "placement."
Step 6: Brain loads the latest checkpoint for that project from the database.
Step 7: Checkpoint data includes:
        - Last completed work.
        - Current item in progress.
        - Blockers.
        - Next recommended action.
        - Linked resources (files, URLs, notes).
Step 8: Brain formats a response using the checkpoint data.
        (The LLM may be used to make the response conversational,
         but the facts come from the database, not from the LLM's imagination.)
Step 9: Response is sent back to the user via chat UI and/or voice (Piper TTS).
Step 10: Avatar shows the "speaking" state.
Step 11: User can then say "Resume" to open the linked resources.
```

**Key point:** The answer comes from **structured database records**, not from the LLM guessing. The LLM just makes the answer sound natural.

---

## Flow 3: User Updates Learning Progress

**Scenario:** The user says "I completed 3 DSA videos today and made notes for 2 of them."

```
Step 1: User speaks or types the update.
Step 2: If voice: Whisper transcribes to text.
Step 3: Brain's Intent Router classifies this as a "learning update."
Step 4: Brain extracts structured data:
        - Course/topic: DSA
        - Videos completed: 3
        - Notes created: 2
Step 5: Brain calls the Learning Service to update the database:
        - Mark 3 videos as watched in the Courses table.
        - Link 2 notes to those lessons.
        - Record a learning event with timestamp.
Step 6: Analytics Service recalculates:
        - Course completion percentage.
        - Notes coverage.
        - Schedule variance (ahead/behind plan).
Step 7: Dashboard updates to show new progress.
Step 8: Brain responds: "Got it. You've completed 3 videos and linked 2 notes.
        Your DSA course is now 45% complete. Two topics remain this week."
Step 9: Response is spoken via Piper TTS if voice mode is active.
```

**Key point:** Progress tracking uses **deterministic database operations**, not AI guessing. The LLM helps interpret the user's natural language, but the actual data update is precise.

---

## Flow 4: User Calls AIRA by Voice

**Scenario:** The user presses the push-to-talk shortcut and says "Hey AIRA, open my project folder."

```
Step 1: User presses the global push-to-talk keyboard shortcut.
Step 2: Tauri's native layer activates the microphone.
Step 3: Avatar state changes to "Listening" (cyan ring appears).
Step 4: Audio is captured while the user speaks.
Step 5: User releases the key (or silence is detected).
Step 6: Audio is sent to Whisper (local speech-to-text).
Step 7: Whisper transcribes: "Hey AIRA, open my project folder."
Step 8: Transcript is shown in the speech strip near the avatar.
Step 9: Brain receives the transcript.
Step 10: Intent Router classifies this as a "local command" → "open resource."
Step 11: Brain identifies the active project and its linked folder.
Step 12: Brain checks permissions:
         - Is opening folders allowed? → Yes (A1 risk: local, reversible).
Step 13: Hands module executes: Opens the folder in Windows Explorer.
Step 14: Action is logged in the ActionLog table.
Step 15: Brain responds: "Opened your project folder."
Step 16: Piper TTS speaks the response.
Step 17: Avatar state: Listening → Thinking → Speaking → Idle.
```

**Key point:** Simple commands bypass the LLM entirely. The Brain uses deterministic routing to execute safe actions directly.

---

## Flow 5: User Asks AIRA to Look at Screen

**Scenario:** The user sees an error message and says "AIRA, what is this error?"

```
Step 1: User invokes screen-peek (voice command, shortcut, or avatar menu).
Step 2: Brain recognizes this as a "screen understanding" request.
Step 3: Privacy check:
        - Has user authorized screen capture? → Check.
        - Show a visible permission indicator (cyan border around window).
Step 4: User confirms capture (or auto-approved if previously configured).
Step 5: Senses module captures a screenshot of the active window.
Step 6: A brief capture animation plays on screen.
Step 7: OCR (Tesseract) extracts visible text from the screenshot.
Step 8: Brain builds a prompt with:
        - The extracted text from the screen.
        - The active application name.
        - The user's question ("what is this error?").
        - Relevant project context if available.
Step 9: Prompt is sent to the local LLM (or local VLM if available later).
Step 10: LLM explains the error based on the extracted text.
Step 11: Response is shown in the chat UI and spoken via Piper TTS.
Step 12: The screenshot is automatically deleted (unless user saves it).
Step 13: Avatar state: Listening → Working → Speaking → Idle.
```

**Key point:** AIRA **never watches the screen continuously**. Screen access is always on-demand, always visible, and always permission-gated. Screenshots are temporary by default.

---

## Flow 6: AIRA Performs a Safe Local Action

**Scenario:** The user says "Save my progress and remind me tomorrow at 9 AM."

```
Step 1: User speaks or types the command.
Step 2: Brain's Intent Router identifies two intents:
        a) "Save checkpoint" (project command)
        b) "Set reminder" (notification command)
Step 3: For saving checkpoint:
        a) Brain gathers current project state:
           - What files were active.
           - What tasks were marked done today.
           - User's description of current work.
        b) Brain drafts a checkpoint summary.
        c) Brain shows the draft to the user for confirmation.
        d) User confirms (or edits).
        e) Checkpoint is saved to the database.
Step 4: For setting reminder:
        a) Brain creates a Reminder record:
           - Time: tomorrow 9:00 AM.
           - Message: "Resume project work."
           - Linked project.
        b) Reminder is saved to the database.
        c) Reminder survives app restart.
Step 5: Both actions are logged in the ActionLog table.
Step 6: Brain responds: "Checkpoint saved. I'll remind you tomorrow at 9 AM."
Step 7: Response is spoken and avatar shows "success" state briefly.
```

**Key point:** Actions are classified by risk level:
- **A0 (read-only):** Execute after request, log it.
- **A1 (local, reversible):** Execute, show result, offer undo.
- **A2 (external/impactful):** Confirm before executing.
- **A3 (dangerous):** Blocked in V1.

The Brain always checks the risk level before performing any action.

---

## Summary of Data Flow Principles

1. **The user always initiates.** AIRA does not act without being asked (except rare, configured proactive suggestions).
2. **Memory is retrieved before AI.** The Brain checks the database for facts before asking the LLM.
3. **The LLM is a reasoning tool, not the source of truth.** Facts come from the database.
4. **Actions are permission-gated.** Every action has a risk level and appropriate safeguards.
5. **Everything is logged.** The user can review what AIRA did and undo where possible.
6. **Screen and camera are never continuous.** Always on-demand, always visible, always temporary.
7. **Voice is a channel, not a requirement.** Everything that works by voice also works by text.
