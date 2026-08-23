# AIRA — Product Requirements Document

**Product name:** AIRA (Adaptive Intelligent Responsive Assistant)  
**Document type:** Product Requirements Document (PRD)  
**Version:** 1.0 — Locked Baseline  
**Status:** Approved for planning and implementation  
**Primary platform:** Windows 11 desktop  
**Target hardware:** ASUS TUF A15, AMD Ryzen 7 7445HS, 16 GB RAM, NVIDIA RTX 3050 Laptop GPU with 4 GB VRAM  
**Deployment model:** Local-first, single-user, offline-capable  
**Budget objective:** Approximately ₹0 recurring software/API cost  
**Document date:** 23 August 2026

---

## 1. Executive Summary

AIRA is a private, local-first desktop companion designed for one primary user. It is not intended to be a general-purpose chatbot or a fully autonomous artificial intelligence. It is a persistent personal assistant that lives on the Windows desktop as an animated female avatar, communicates by voice, remembers ongoing projects, tracks study and placement preparation, answers questions about selected screen or camera content, maintains dashboards, and performs explicitly authorized digital actions.

The product must create continuity between work sessions. AIRA should be able to answer questions such as:

- “Where did I stop yesterday?”
- “What should I work on next?”
- “How much of this course have I completed?”
- “How many notes have I prepared?”
- “What is this on my screen?”
- “Explain this error.”
- “Open my placement project and continue from the last checkpoint.”
- “Give me my weekly learning report.”

AIRA will run primarily on the user’s existing laptop without a paid backend. Heavy AI components will be loaded one at a time to stay within the 4 GB GPU VRAM limit. Continuous AI analysis of the screen, advanced emotion recognition, long autonomous research/coding, and simultaneous use of multiple heavy AI models are explicitly excluded.

The product’s value is not based only on the intelligence of a language model. Its main value comes from structured local memory, reliable activity tracking, project checkpoints, course analytics, an understandable dashboard, voice interaction, and safe integration with desktop applications.

---

## 2. Locked Product Decisions

The following decisions define the baseline and must not be changed without creating a new PRD version.

| Decision | Locked requirement |
|---|---|
| Product identity | AIRA, presented as a female desktop companion |
| Primary device | User’s Windows 11 ASUS TUF A15 laptop |
| Primary interface | Voice plus animated desktop avatar |
| Secondary interface | Dashboard, command box, system tray and keyboard shortcut |
| Processing | Local-first and offline-capable |
| Recurring cost | Target ₹0; no mandatory paid API or cloud subscription |
| Screen access | On-demand screenshot/selected-region analysis only |
| Camera access | On-demand viewing only, with visible indicator |
| Memory | Structured local memory with user review/edit/delete controls |
| Project continuity | Automatic and manual checkpoints with “resume” support |
| Study tracking | Browser extension plus manual/local file tracking |
| Heavy models | Only one heavy model loaded at a time |
| External actions | Permission-gated, logged and reversible where possible |
| Data ownership | User owns all locally stored data |
| Internet dependency | Not required for core features; optional for web content or updates |

### 2.1 Explicitly excluded capabilities

The following are not requirements for AIRA v1.x:

- Continuous AI interpretation of the entire desktop screen.
- Continuous webcam interpretation.
- Facial emotion classification or psychological diagnosis.
- Long autonomous coding sessions.
- Long autonomous web research.
- Frontier-level complex reasoning.
- Multiple heavy language/vision models running at the same time.
- Fully autonomous email, messaging, purchasing or account actions.
- Direct control of industrial machines, PLCs, vehicles or safety-critical equipment.
- A 3D photorealistic avatar.
- Human-like consciousness, feelings or claims of sentience.
- A mandatory hosted backend, user subscription or paid API.

---

## 3. Product Vision

### 3.1 Vision statement

Create a private digital companion that remains present across the user’s daily computer work, remembers meaningful progress, communicates naturally, sees only when invited, measures learning honestly, and helps the user take the next useful action.

### 3.2 Product promise

> AIRA remembers what you were doing, helps you understand what is in front of you, tracks real progress, and brings you back to the right next step.

### 3.3 Design principles

1. **Continuity over conversation length:** Important state must be stored as structured checkpoints, not buried inside chat history.
2. **Local before cloud:** Core functions must work without a paid service.
3. **Useful before impressive:** Reliable tracking and resumption are more valuable than unnecessary animation or artificial personality complexity.
4. **Visible sensing:** Microphone, screen and camera access must always be apparent.
5. **Permission before impact:** AIRA may prepare actions but must confirm before performing risky or external actions.
6. **Honest analytics:** Opening a course tab is not equal to studying, and watching a video is not equal to understanding it.
7. **One heavy workload at a time:** The application must respect the RTX 3050 4 GB VRAM limit.
8. **User-correctable memory:** AIRA’s memory is never treated as unquestionable truth.
9. **Calm presence:** The avatar should be helpful without constantly interrupting or obstructing the desktop.
10. **Graceful degradation:** If AI is slow or unavailable, tracking, dashboards, reminders and project checkpoints must continue working.

---

## 4. Problem Definition

### 4.1 User problems

The user regularly works across courses, placement preparation, notes, videos, code, documents and personal projects. Information about progress is scattered across browser tabs, files, applications, handwritten plans and memory. This causes several problems:

- Time is lost remembering where work stopped.
- Progress appears unclear even after many hours of activity.
- Course watching, note preparation and practice are not measured together.
- The next task is often not obvious.
- Generic chatbots do not observe local project state or retain structured continuity.
- Existing assistants depend heavily on cloud services and subscriptions.
- Desktop tools feel separate rather than behaving like one consistent companion.

### 4.2 Product opportunity

A local assistant can combine low-cost AI with deterministic tracking. The language model does not need to perform every operation. AIRA can use normal software for measurement and storage, then use AI for explanation, summarization, question answering and natural-language control.

---

## 5. Target User and Primary Scenarios

### 5.1 Primary user

A single owner using a Windows laptop for:

- Placement preparation.
- Online courses and technical videos.
- Note preparation.
- Coding and project work.
- Document reading and writing.
- Personal productivity and reminders.

AIRA v1 is not a multi-user or commercial SaaS product.

### 5.2 Primary jobs to be done

1. When returning to a project, help the user resume without reconstructing yesterday’s context.
2. When studying, measure active work and show whether the roadmap is on schedule.
3. When confused by visible content, explain a selected screen region or camera image.
4. When the user speaks, respond naturally and perform safe local commands.
5. When progress becomes inconsistent, provide evidence-based guidance through a dashboard and reports.
6. When the user stops, preserve a reliable checkpoint for the next session.

---

## 6. Goals, Non-Goals and Success Metrics

### 6.1 Product goals

| ID | Goal |
|---|---|
| G-01 | Provide reliable voice interaction without requiring a paid API. |
| G-02 | Preserve structured project continuity across restarts and days. |
| G-03 | Track course, video, notes and practice activity accurately enough to guide decisions. |
| G-04 | Provide an animated desktop presence without obstructing normal work. |
| G-05 | Explain selected screen or camera content on demand. |
| G-06 | Maintain a useful personal dashboard and generate daily/weekly summaries. |
| G-07 | Keep sensitive information local and user-controlled. |
| G-08 | Operate within 16 GB RAM and 4 GB VRAM without destabilizing the laptop. |

### 6.2 Non-goals

- Replace a professional teacher, counsellor, doctor or security specialist.
- Demonstrate human-level general intelligence.
- Operate independently for hours without supervision.
- Monitor every user action without explicit configuration.
- Guarantee comprehension based only on watch time.
- Control industrial or physical equipment.
- Replace Git, an IDE, a learning management system or a browser.

### 6.3 Success metrics

All product analytics must remain local by default.

| Metric | Initial success target |
|---|---:|
| Successful project resume attempts | ≥90% of checkpoints correctly reopen intended project resources |
| User correction rate for checkpoint summaries | <20% after first four weeks of tuning |
| Course activity capture coverage | ≥90% of supported video sessions |
| False course watch time | <10% during supported-site testing |
| Dashboard load time | ≤2 seconds for one year of local records |
| Wake-word response in quiet room | ≥90% in controlled test set |
| False wake events | Target ≤1 per 8 active hours |
| Simple local command completion | ≥95% for the defined command set |
| Simple spoken-answer start | Target ≤5 seconds after speech ends |
| Screenshot-question response | Target ≤15 seconds for common cases |
| Crash-free sessions | ≥99% of application sessions |
| Core functionality without internet | 100% for voice, memory, dashboard and local tracking |

These targets are engineering objectives and must be validated on the target laptop.

---

## 7. Product Scope by Release

### 7.1 MVP — Foundation

The MVP proves that AIRA can exist as a stable desktop product.

- Windows desktop application and system tray.
- Lightweight animated 2D avatar.
- Push-to-talk keyboard shortcut.
- Text command box.
- Local speech-to-text.
- Local text-to-speech.
- Local small language model integration.
- SQLite database.
- Manual projects, tasks and checkpoints.
- “Where did I stop?” and “Resume project” flows.
- Basic dashboard.
- Privacy controls and activity log.

### 7.2 Version 1.0 — Personal project companion

- Wake-word activation.
- Automated project checkpoint suggestions.
- File/application activity collection.
- Project resource reopening.
- Personal preferences and editable memory.
- Daily briefing and end-of-session summary.
- On-demand full-screen or region screenshot explanation.
- Local document/notes search.
- Confirmation system for impactful actions.

### 7.3 Version 1.5 — Learning and placement companion

- Browser extension.
- Supported course/video tracking.
- Roadmap editor.
- Notes linkage and coverage measurement.
- Question/practice tracking.
- Daily, weekly and course dashboards.
- Evidence-based progress analysis.
- Revision scheduling.
- Placement preparation workspace.

### 7.4 Version 2.0 — On-demand visual companion

- On-demand webcam mode.
- “What am I showing you?” questions.
- Selected-object and screenshot history.
- Improved UI explanation using screenshot plus extracted text and application metadata.
- Optional gesture shortcuts.
- Improved avatar expressions and speech animation.

---

## 8. Product Modes

| Mode | Purpose | Microphone | Screen | Camera | Heavy AI |
|---|---|---|---|---|---|
| Sleep | Fully private state | Off | Off | Off | Unloaded |
| Wake-word | Wait for activation phrase | Wake detector only | Off | Off | Unloaded |
| Conversation | Voice conversation | Active | Only on request | Off | Text model |
| Focus | Track a selected project/course | Active on request | Metadata only | Off | On request |
| See screen | Explain selected visual content | Active | One screenshot/region | Off | Vision model |
| See camera | Answer about camera view | Active | Off | On with indicator | Vision model |
| Dashboard | Review progress | Off by default | AIRA window only | Off | On request for analysis |

### 8.1 Emergency privacy control

The user must be able to immediately disable microphone, screen and camera access through:

- A global keyboard shortcut.
- A clearly visible avatar/menu action.
- A system tray command.

Default shortcut proposal: `Ctrl + Shift + Escape`. If Windows reserves or conflicts with this combination, setup must require selection of another shortcut.

---

## 9. Functional Requirements

Priority definitions:

- **P0:** Required for the named release.
- **P1:** Important and should be implemented if release stability permits.
- **P2:** Enhancement that may move to a later release.

### 9.1 Desktop shell and avatar

| ID | Priority | Requirement |
|---|---|---|
| FR-AV-001 | P0 | AIRA shall run as a Windows desktop application with a system tray icon. |
| FR-AV-002 | P0 | The avatar shall appear in a transparent, borderless window that can remain above normal windows. |
| FR-AV-003 | P0 | The user shall be able to drag the avatar to a preferred screen position. |
| FR-AV-004 | P0 | The selected position shall persist across restarts and display-layout changes where possible. |
| FR-AV-005 | P0 | The avatar shall provide states for idle, listening, thinking, speaking, working, success, warning and sleeping. |
| FR-AV-006 | P0 | The avatar shall not capture mouse clicks outside its visible interactive area. |
| FR-AV-007 | P0 | The user shall be able to hide, mute, minimize or fully exit AIRA. |
| FR-AV-008 | P1 | The avatar may optionally follow the cursor at a user-selected distance and speed. |
| FR-AV-009 | P1 | The avatar shall automatically avoid blocking the active text cursor, selected region or full-screen content where possible. |
| FR-AV-010 | P1 | Speech bubbles shall be optional and shall disappear after a configurable period. |
| FR-AV-011 | P2 | The avatar may use approximate lip-sync based on generated audio amplitude or phoneme timing. |

### 9.2 Voice interaction

| ID | Priority | Requirement |
|---|---|---|
| FR-VO-001 | P0 | The user shall be able to start listening with a global push-to-talk shortcut. |
| FR-VO-002 | P0 | Speech recognition shall run locally for core use. |
| FR-VO-003 | P0 | AIRA shall speak responses using a locally installed female voice. |
| FR-VO-004 | P0 | The interface shall display the transcript so the user can correct recognition errors. |
| FR-VO-005 | P0 | The user shall be able to interrupt or stop speech output. |
| FR-VO-006 | P0 | The user shall be able to use text input when voice is inappropriate. |
| FR-VO-007 | P1 | A local wake-word engine shall support a configured activation phrase such as “Hey AIRA.” |
| FR-VO-008 | P1 | AIRA shall support English and attempt Hindi/Hinglish recognition where supported by the chosen speech model. |
| FR-VO-009 | P1 | AIRA shall ask for clarification when transcript confidence or intent is insufficient. |
| FR-VO-010 | P1 | Voice, volume, rate and wake-word sensitivity shall be configurable. |

### 9.3 Basic conversation and command handling

| ID | Priority | Requirement |
|---|---|---|
| FR-CV-001 | P0 | AIRA shall answer basic questions using a local language model. |
| FR-CV-002 | P0 | AIRA shall use relevant project/memory context when available. |
| FR-CV-003 | P0 | AIRA shall distinguish a question, local command, project command, learning command and visual question. |
| FR-CV-004 | P0 | AIRA shall state uncertainty instead of inventing local facts. |
| FR-CV-005 | P0 | AIRA shall not claim an external action succeeded until the operating system or tool returns success. |
| FR-CV-006 | P1 | The user shall be able to select concise, normal or detailed response length. |
| FR-CV-007 | P1 | AIRA shall support configurable personality traits such as warmth, directness, humour and formality. |
| FR-CV-008 | P1 | Personality settings shall not override safety, truthfulness or user privacy. |

### 9.4 On-demand screen understanding

| ID | Priority | Requirement |
|---|---|---|
| FR-SC-001 | P0 | AIRA shall capture the active screen only after an explicit voice, keyboard or UI request. |
| FR-SC-002 | P0 | The user shall be able to select a rectangular screen region. |
| FR-SC-003 | P0 | A visible border/indicator shall identify the region being captured. |
| FR-SC-004 | P0 | AIRA shall combine the screenshot, extracted visible text, active application name and user’s question. |
| FR-SC-005 | P0 | AIRA shall answer questions such as “What is this?”, “Explain this error” and “What should I click?” |
| FR-SC-006 | P0 | Screenshots shall remain local unless the user explicitly exports or shares them. |
| FR-SC-007 | P0 | Screenshot history shall be off by default. |
| FR-SC-008 | P1 | When enabled, screenshot history shall have configurable retention and manual deletion. |
| FR-SC-009 | P1 | AIRA shall offer to use the active project’s files/manuals when explaining visible content. |
| FR-SC-010 | P1 | AIRA shall allow the user to copy the answer, create a note or attach the result to a project. |

### 9.5 On-demand camera understanding

| ID | Priority | Requirement |
|---|---|---|
| FR-CA-001 | P0 | The webcam shall remain off until the user starts camera mode. |
| FR-CA-002 | P0 | A persistent visual indicator shall remain visible while the camera is active. |
| FR-CA-003 | P0 | The user shall be able to capture a single frame and ask a question about it. |
| FR-CA-004 | P0 | The camera frame shall be processed locally by default. |
| FR-CA-005 | P0 | AIRA shall not perform identity recognition, emotion diagnosis or background face cataloguing. |
| FR-CA-006 | P1 | The user shall be able to attach an explained camera image to a project or note. |
| FR-CA-007 | P1 | A short preview shall allow the user to confirm the frame before analysis. |

### 9.6 Personal memory

| ID | Priority | Requirement |
|---|---|---|
| FR-ME-001 | P0 | AIRA shall maintain separate working, project, preference and event memories. |
| FR-ME-002 | P0 | Every durable memory shall include its source, creation time and confidence/status. |
| FR-ME-003 | P0 | The user shall be able to view, search, edit and delete durable memories. |
| FR-ME-004 | P0 | AIRA shall not silently convert every conversation sentence into durable memory. |
| FR-ME-005 | P0 | Explicit commands such as “Remember this” shall create a reviewable durable memory. |
| FR-ME-006 | P0 | Sensitive memories shall be markable as private, excluded from retrieval or encrypted. |
| FR-ME-007 | P1 | AIRA shall identify conflicting memories and ask the user which is current. |
| FR-ME-008 | P1 | The user shall be able to export memories in a readable format. |
| FR-ME-009 | P1 | The user shall be able to configure retention by memory category. |

### 9.7 Projects and continuity

| ID | Priority | Requirement |
|---|---|---|
| FR-PR-001 | P0 | The user shall be able to create a named project with goals, deadline, status and linked resources. |
| FR-PR-002 | P0 | A project may link files, folders, applications, URLs, notes, tasks and courses. |
| FR-PR-003 | P0 | AIRA shall store project checkpoints. |
| FR-PR-004 | P0 | A checkpoint shall include completed work, current state, open items, blockers, next action and relevant resources. |
| FR-PR-005 | P0 | The user shall be able to create a checkpoint manually by voice or button. |
| FR-PR-006 | P0 | AIRA shall answer “Where did I stop?” from the latest valid project checkpoint. |
| FR-PR-007 | P0 | “Resume project” shall display the last checkpoint and reopen approved linked resources. |
| FR-PR-008 | P0 | AIRA shall never claim a task is completed based only on time spent. |
| FR-PR-009 | P1 | AIRA shall suggest a checkpoint after extended activity, explicit project switching or application shutdown. |
| FR-PR-010 | P1 | AIRA shall compare current files/tasks against the last checkpoint and propose changes for confirmation. |
| FR-PR-011 | P1 | The user shall be able to correct a checkpoint before saving it. |
| FR-PR-012 | P1 | AIRA shall provide daily and weekly project summaries. |
| FR-PR-013 | P1 | Each project shall have a roadmap with ordered milestones and dependencies. |
| FR-PR-014 | P2 | AIRA may estimate completion dates from recent progress, clearly labelled as estimates. |

### 9.8 Project checkpoint rules

A checkpoint may be proposed after any of the following:

- User says “Stop,” “Finish session,” or “Save my progress.”
- User switches to another registered project.
- A registered project remains inactive for 15 minutes.
- AIRA or Windows is shutting down normally.
- A focus session reaches a configurable interval, default 45 minutes.
- The user completes a roadmap item or major task.

Required checkpoint structure:

```yaml
project_id: string
session_id: string
started_at: timestamp
ended_at: timestamp
summary: string
completed_items: list
current_item: string
open_items: list
blockers: list
next_recommended_action: string
linked_resources: list
evidence: list
user_confirmed: boolean
```

### 9.9 Learning, courses and placement roadmap

| ID | Priority | Requirement |
|---|---|---|
| FR-LR-001 | P0 | The user shall be able to create a course with modules, lessons, videos and target date. |
| FR-LR-002 | P0 | The user shall be able to import a simple course outline from CSV/JSON or create it manually. |
| FR-LR-003 | P0 | A Chrome extension shall collect activity only on user-approved sites. |
| FR-LR-004 | P0 | The tracker shall record play, pause, seek, completion and active-tab state where technically available. |
| FR-LR-005 | P0 | The system shall distinguish wall-clock watch time and content-duration progress. |
| FR-LR-006 | P0 | Time shall not count while the computer is idle beyond the configured threshold. |
| FR-LR-007 | P0 | The user shall be able to manually correct progress when a platform prevents accurate detection. |
| FR-LR-008 | P0 | Lessons shall support linked notes and practice questions. |
| FR-LR-009 | P0 | AIRA shall show watched, notes prepared, practice completed and revision status separately. |
| FR-LR-010 | P0 | The placement roadmap shall support topics, dependencies, planned dates and status. |
| FR-LR-011 | P1 | AIRA shall calculate whether current progress is ahead, on schedule or behind. |
| FR-LR-012 | P1 | AIRA shall generate a weekly learning analysis using measured evidence. |
| FR-LR-013 | P1 | AIRA shall recommend the next roadmap item based on prerequisites, deadlines and unfinished work. |
| FR-LR-014 | P1 | The user shall be able to record quizzes, questions attempted, correct answers and confidence. |
| FR-LR-015 | P1 | Revision items shall support a due date and repeated review history. |
| FR-LR-016 | P1 | Unsupported websites shall fall back to active-time estimation and display lower confidence. |

### 9.10 Learning metric definitions

| Metric | Definition |
|---|---|
| Active study time | Time in an approved course/project context while the user is not idle |
| Wall-clock watch time | Real elapsed time while video is playing, tab is active and user is not idle |
| Content minutes covered | Unique video timeline duration viewed, adjusted for seeking/replay |
| Video started | At least 60 seconds or 5% of the video viewed, whichever is smaller |
| Video completed | Platform marks complete or at least 90% of unique content timeline viewed |
| Notes started | A linked note exists with meaningful user-entered content |
| Notes completed | User marks complete or configured minimum coverage criteria are met |
| Practice accuracy | Correct answers divided by attempted scorable questions |
| Course completion | Weighted combination configured by user; default based on lesson completion, not time alone |
| Schedule variance | Planned completion percentage minus actual verified completion percentage |
| Confidence | User-entered self-rating, not inferred emotion |

Default course completion weighting proposal:

- Lesson/video completion: 50%
- Notes completion: 25%
- Practice completion: 20%
- Revision completion: 5%

The user must be able to change these weights per course.

### 9.11 Dashboard and reports

| ID | Priority | Requirement |
|---|---|---|
| FR-DB-001 | P0 | The dashboard shall provide Today, Week, Projects, Learning and Memory views. |
| FR-DB-002 | P0 | Today shall show current focus, next action, reminders and active time. |
| FR-DB-003 | P0 | Projects shall show status, latest checkpoint, blockers, milestones and estimated schedule. |
| FR-DB-004 | P0 | Learning shall show course completion, videos, notes, practice, revision and schedule variance. |
| FR-DB-005 | P0 | Every AI-generated conclusion shall link to the records used as evidence. |
| FR-DB-006 | P0 | The user shall be able to correct or exclude incorrect activity records. |
| FR-DB-007 | P1 | The dashboard shall provide daily and weekly trends. |
| FR-DB-008 | P1 | The user shall be able to export a report as Markdown, CSV or PDF. |
| FR-DB-009 | P1 | AIRA shall provide a spoken summary of the visible dashboard. |
| FR-DB-010 | P1 | Reports shall separate measured facts, user-entered facts and AI estimates. |

### 9.12 Local knowledge and file search

| ID | Priority | Requirement |
|---|---|---|
| FR-KN-001 | P0 | The user shall explicitly select folders/files that AIRA may index. |
| FR-KN-002 | P0 | AIRA shall extract searchable text from supported local files. |
| FR-KN-003 | P0 | AIRA shall provide keyword search even if the language model is unavailable. |
| FR-KN-004 | P0 | Answers based on local files shall identify the source file. |
| FR-KN-005 | P0 | Removing a folder from the index shall remove its derived search data. |
| FR-KN-006 | P1 | Local embeddings shall support semantic retrieval from notes and project documents. |
| FR-KN-007 | P1 | The indexer shall update only changed files where possible. |
| FR-KN-008 | P1 | The user shall be able to pause indexing on battery power. |

### 9.13 Desktop commands and actions

| ID | Priority | Requirement |
|---|---|---|
| FR-AC-001 | P0 | AIRA shall support a defined allowlist of local commands. |
| FR-AC-002 | P0 | Initial commands shall include opening an application, file, folder, URL, project and dashboard. |
| FR-AC-003 | P0 | AIRA shall support creating drafts, notes, tasks and checkpoints. |
| FR-AC-004 | P0 | Every action shall produce a success or failure result and local log entry. |
| FR-AC-005 | P0 | AIRA shall request confirmation immediately before impactful actions. |
| FR-AC-006 | P0 | AIRA shall not store or guess passwords. |
| FR-AC-007 | P1 | Reversible local actions may support undo. |
| FR-AC-008 | P1 | The user shall be able to configure per-application permissions. |
| FR-AC-009 | P1 | AIRA shall display a preview before sending or publishing content. |

### 9.14 Action risk levels

| Level | Examples | Default policy |
|---|---|---|
| A0 — Read-only | Read local approved file, inspect dashboard, capture requested screenshot | Execute after direct request; log |
| A1 — Local reversible | Open app, create draft, add note, create checkpoint | Execute; show result; provide undo where applicable |
| A2 — External or material change | Send message, submit form, overwrite file, install software | Confirm immediately before action |
| A3 — Prohibited/default blocked | Payments, deleting broad data, credentials, security bypass, machine/PLC control | Block in v1 unless separately designed and approved in a future PRD |

### 9.15 Notifications and reminders

| ID | Priority | Requirement |
|---|---|---|
| FR-NT-001 | P0 | Reminders shall be stored locally and survive restart. |
| FR-NT-002 | P0 | Notifications shall show the reason and related project/course. |
| FR-NT-003 | P0 | The user shall be able to snooze, complete or dismiss a reminder. |
| FR-NT-004 | P1 | Quiet hours shall suppress noncritical speech and animation. |
| FR-NT-005 | P1 | AIRA shall avoid repeating dismissed advice unless circumstances materially change. |
| FR-NT-006 | P1 | Proactive suggestions shall be limited by a configurable daily budget. |

### 9.16 Settings and user control

| ID | Priority | Requirement |
|---|---|---|
| FR-ST-001 | P0 | Setup shall explain every requested permission in plain language. |
| FR-ST-002 | P0 | Microphone, screen, camera, browser, files and automation permissions shall be separately controllable. |
| FR-ST-003 | P0 | The user shall be able to select local model, voice and performance mode. |
| FR-ST-004 | P0 | The user shall be able to delete all AIRA data from within the application. |
| FR-ST-005 | P0 | The user shall be able to back up and restore the local database. |
| FR-ST-006 | P1 | Setup shall test microphone, speaker, GPU acceleration and model availability. |
| FR-ST-007 | P1 | The application shall include a diagnostics page without exposing private content by default. |

---

## 10. Primary User Flows

### 10.1 First-run setup

1. User installs AIRA.
2. AIRA explains local processing and permissions.
3. User selects avatar, voice and name.
4. User tests microphone and speaker.
5. AIRA detects supported GPU acceleration.
6. User selects push-to-talk; wake word remains optional.
7. User creates the first project or learning roadmap.
8. User selects folders/sites AIRA may access.
9. AIRA runs a local performance test and chooses Instant or Smart mode defaults.
10. AIRA shows the privacy kill control and activity log.

### 10.2 Resume a project

1. User says, “AIRA, continue my placement project.”
2. AIRA finds the named project and latest valid checkpoint.
3. AIRA responds with completed work, current item, blocker and next action.
4. AIRA displays the resources it proposes to open.
5. User approves or edits the list.
6. AIRA opens the project folder, note, website and task panel.
7. A new focus session begins.

### 10.3 End a project session

1. User says, “AIRA, stop here.”
2. AIRA gathers deterministic evidence: edited files, completed tasks, active resources and user notes.
3. AIRA drafts a checkpoint summary.
4. User confirms or corrects the summary.
5. AIRA saves the checkpoint.
6. AIRA optionally schedules the next session or reminder.

### 10.4 Ask about the screen

1. User invokes “See screen” by voice or shortcut.
2. Screen dims and user selects a region, or accepts the active window.
3. AIRA displays a capture indicator.
4. Screenshot and local metadata are passed to the vision model.
5. AIRA answers the question.
6. User may copy, save to notes, attach to project or discard the result.
7. Screenshot is deleted unless retention was explicitly enabled.

### 10.5 Track a course session

1. User opens an approved course site.
2. Browser extension identifies course/lesson when supported.
3. Video activity and active/idle state are recorded locally.
4. User creates or links notes.
5. When the session ends, AIRA shows watch time, content covered, notes status and next lesson.
6. User corrects any unsupported or inaccurate measurement.
7. Dashboard updates immediately.

### 10.6 Weekly learning review

1. User asks, “How was my placement preparation this week?”
2. AIRA queries local activity, milestones, notes, practice and revisions.
3. AIRA separates facts from estimates.
4. AIRA identifies the largest gap and schedule variance.
5. AIRA proposes a realistic next-week plan.
6. User accepts, modifies or rejects the plan.

---

## 11. Information Architecture

### 11.1 Main navigation

- Home / Today
- Projects
- Learning
- Roadmaps
- Notes
- Memory
- Activity log
- Settings

### 11.2 Avatar quick menu

- Talk
- Type command
- See screen
- See camera
- Start focus
- Save checkpoint
- Open dashboard
- Sleep
- Privacy off switch

---

## 12. Data Model

SQLite is the authoritative local system of record.

### 12.1 Core entities

| Entity | Purpose | Key fields |
|---|---|---|
| UserProfile | Personal settings | name, language, timezone, preferences |
| Project | Ongoing body of work | id, name, goal, status, deadline |
| Roadmap | Ordered plan | id, project/course, milestones, dependencies |
| Task | Actionable unit | title, status, priority, due date, evidence |
| FocusSession | Time-bounded work session | start, end, project, active time |
| Checkpoint | Resume state | summary, current item, blockers, next action |
| Resource | Linked item | file, folder, URL, application, note |
| Course | Learning container | provider, title, target, weighting |
| Lesson | Course unit | module, order, duration, completion |
| VideoActivity | Playback evidence | position, intervals watched, active time |
| Note | User-created knowledge | path/content link, topic, completion |
| PracticeRecord | Learning evidence | attempted, correct, topic, confidence |
| RevisionRecord | Review history | due date, completed date, rating |
| MemoryItem | Durable personal context | category, content, source, confidence |
| Reminder | Scheduled prompt | time, recurrence, status, reference |
| ActionLog | Audit record | request, action, risk, result, timestamp |
| Permission | Capability authorization | capability, scope, state, expiry |
| ModelRun | Local diagnostic metadata | model, task type, latency, error; no hidden reasoning |

### 12.2 Memory categories

- **Working memory:** Current conversation and active task; short-lived.
- **Project memory:** Decisions, checkpoints, blockers, resources and milestones.
- **Learning memory:** Courses, progress, notes, practice and revision.
- **Preference memory:** Voice, language, work habits and UI settings.
- **Event memory:** User-approved significant events and completed outcomes.

### 12.3 Data integrity rules

- Every activity record must include timestamp and source.
- AI summaries must reference source record IDs.
- User corrections override generated interpretations without deleting original audit evidence.
- Deleting a project must require confirmation and offer export first.
- Derived metrics must be recalculable from raw local records.
- Database migrations must be versioned and reversible through backup.

---

## 13. Technical Architecture

### 13.1 Proposed components

| Layer | Proposed technology | Responsibility |
|---|---|---|
| Desktop shell | Tauri 2 + React/TypeScript | Avatar window, dashboard, tray, shortcuts |
| Local service | Python + FastAPI or equivalent local IPC service | Orchestration, tracking, model routing |
| Database | SQLite with FTS | Structured records and keyword search |
| Semantic retrieval | Small local embedding model | Similarity search over approved content |
| Local model runtime | Ollama initially; llama.cpp optional | Text and vision inference |
| Speech-to-text | whisper.cpp | Local transcription |
| Text-to-speech | Piper | Local female voice |
| Wake word | openWakeWord | Local activation phrase |
| Browser integration | Chrome Manifest V3 extension | Course and page activity |
| Screen capture | Windows capture APIs | Explicit screenshot/region capture |
| File observation | Windows file events plus application adapters | Approved project activity |
| Reporting | React dashboard and local export service | Charts, summaries and reports |

### 13.2 Logical data flow

```text
User voice/text
    → intent router
    → permission check
    → relevant local memory retrieval
    → deterministic command OR one selected AI model
    → action/answer
    → verified result
    → local activity log/checkpoint update
    → avatar/voice response
```

### 13.3 Model-routing rules

1. Deterministic commands must bypass the language model when possible.
2. Instant text model handles normal questions, summaries and command interpretation.
3. Vision model loads only for screenshots/camera frames.
4. Embedding model runs during indexing or retrieval, preferably in small batches.
5. Before loading a heavy model, the model manager unloads the previous heavy model if required.
6. Context sent to the model must be retrieved and bounded; the entire database must never be inserted into a prompt.
7. Large tasks must be broken into user-visible steps rather than attempting long autonomous execution.

### 13.4 Initial model candidates

Candidates must be benchmarked on the target laptop before final selection:

- Fast general conversation: a current quantized 2B–4B instruction model.
- Screen/camera understanding: a current quantized 2B–4B vision-language model.
- Embeddings: a small multilingual embedding model.
- Speech recognition: Whisper base or small variant based on latency/accuracy testing.
- Speech generation: selected Piper female voice.

No model name is permanently locked because local models evolve. The interface contract and hardware budget are locked.

---

## 14. Hardware and Performance Budget

### 14.1 Target machine constraints

- 16 GB system RAM.
- 4 GB NVIDIA GPU VRAM.
- Laptop thermal and battery constraints.
- Normal Windows applications may already consume significant memory.

### 14.2 Resource requirements

| State | CPU target | RAM target | VRAM target | Behaviour |
|---|---:|---:|---:|---|
| Sleep | Near zero | <300 MB app total target | 0 | No sensing |
| Wake-word idle | Average <5% | <600 MB target | 0 | Wake detector only |
| Dashboard/tracking | Average <10% | <1.5 GB excluding OS/browser | 0 | No heavy model |
| Text conversation | Burst allowed | Total system use must remain below safe limit | ≤3.8 GB | One text model |
| Vision request | Burst allowed | Total system use must remain below safe limit | ≤3.8 GB | Text model unloaded if required |
| Indexing | Configurable/throttled | Bounded batches | Prefer CPU or shared sequential use | Pause on gaming/battery option |

### 14.3 Performance policies

- Default context window shall be conservative, initially 4K–8K tokens, and increased only after measurement.
- The model manager shall prevent simultaneous heavy model loads.
- AIRA shall expose Eco, Balanced and Performance modes.
- Eco mode shall disable background indexing and use the smallest models.
- Performance mode may require AC power.
- Thermal throttling or low battery shall pause nonessential AI/indexing work.
- When memory pressure is high, AIRA shall preserve tracking/database integrity before AI availability.

---

## 15. Non-Functional Requirements

### 15.1 Privacy

- Core data and inference must remain local by default.
- No telemetry may leave the device without explicit opt-in.
- Screen and camera frames must not be retained by default.
- The user must be able to identify why each permission is needed.
- A visible indicator must show active microphone, screen or camera use.

### 15.2 Security

- Local services shall bind only to localhost by default.
- Inter-process requests shall use authentication tokens or OS-protected IPC.
- Secrets shall use Windows credential storage when needed; plaintext storage is prohibited.
- Browser extension permissions shall use the smallest possible approved site scope.
- Model-generated tool arguments must be validated against schemas and allowlists.
- Filesystem access must be restricted to approved folders unless explicitly selected for a single action.
- Actions must be audited locally.

### 15.3 Reliability

- Tracking must continue if the AI model fails.
- Database writes must be transactional.
- A daily automatic local backup option must be provided.
- Incomplete checkpoints must be recoverable after abnormal shutdown where possible.
- Corrupted or unsupported files must be skipped without stopping the entire index.

### 15.4 Usability

- Common actions should require no more than one voice command or two clicks.
- The avatar must never permanently trap keyboard or mouse input.
- The user must be able to see and correct what AIRA heard.
- Explanations must distinguish facts, estimates and suggestions.
- A new user should create a project and checkpoint within ten minutes of installation.

### 15.5 Accessibility

- All avatar actions must also be available via keyboard and dashboard.
- Captions/transcripts must accompany speech.
- Text size, contrast, animation and sound must be configurable.
- A reduce-motion mode must disable unnecessary avatar movement.

### 15.6 Maintainability

- Each integration must implement a stable adapter interface.
- Models and voices must be replaceable without database migration.
- Requirements and acceptance tests must use the IDs in this document.
- Logs must exclude private content unless diagnostic detail is explicitly enabled.

---

## 16. Permission and Privacy Experience

### 16.1 Permission groups

| Permission | Default | Scope |
|---|---|---|
| Microphone | Ask during setup | Push-to-talk or wake-word mode |
| Screen capture | Ask each session/request initially | Active window or selected region |
| Camera | Off | Single session/frame |
| Files | Off | User-selected files/folders |
| Browser sites | Off | Per-domain allowlist |
| Application launching | Allowlisted | Named applications only |
| External sending | Off | Confirm every action |

### 16.2 Activity log requirements

The activity log must show:

- What the user requested.
- Which capability AIRA used.
- What data source was accessed.
- Whether confirmation was required.
- The verified result.
- Time and related project.
- An undo action where available.

The activity log must not expose hidden model reasoning.

---

## 17. Conversation and Personality Specification

### 17.1 Default personality

- Warm but not overly enthusiastic.
- Direct and practical.
- Supportive without pretending to feel emotions.
- Comfortable acknowledging uncertainty.
- Brief during routine actions and detailed when teaching.
- Able to use English and appropriate Hindi/Hinglish based on the user’s speech.

### 17.2 Behavioural rules

- Do not repeatedly greet during an active session.
- Do not interrupt focused work for low-priority suggestions.
- Do not shame the user for missed targets.
- Use evidence when discussing progress.
- Ask one concise clarification when required.
- Never present estimated emotion as fact.
- Never claim consciousness, love, suffering or dependency.
- Avoid manipulative language designed to increase engagement.

### 17.3 Example responses

**Resume:**  
“You stopped in the linked-list module after completing insertion. Deletion is unfinished. Your next planned action is to complete deletion and solve three practice questions. Shall I open the code and notes?”

**Course analytics:**  
“You completed four videos this week and watched 3 hours 20 minutes. Notes are linked for two of the four topics. Your roadmap is one topic behind schedule.”

**Visual uncertainty:**  
“This appears to be a permission error, but the message is partly hidden. Select the complete error box and I can explain it more reliably.”

**Action confirmation:**  
“The message is ready. Sending it will represent you to another person. Shall I send this exact version?”

---

## 18. Error Handling and Degraded Modes

| Failure | Required response |
|---|---|
| Speech not understood | Show transcript uncertainty and request repeat or text input |
| Local model unavailable | Continue deterministic commands; show model recovery option |
| GPU out of memory | Unload model, reduce context/model size and retry once |
| Vision answer uncertain | State limitation; request clearer region/frame |
| Course site unsupported | Record lower-confidence active time and allow manual correction |
| Browser extension disconnected | Display visible tracking-paused state |
| Database write failure | Stop dependent changes, preserve recovery copy and notify user |
| Action tool failure | Report failure accurately; do not update task as completed |
| Resource missing on resume | Show missing resource and continue with remaining checkpoint data |
| Permission denied | Explain which feature is unavailable without repeatedly prompting |

---

## 19. Acceptance Criteria

### 19.1 MVP release acceptance

The MVP is accepted only when all conditions below pass on the target laptop:

1. AIRA starts with Windows optionally and can be completely exited.
2. Avatar supports all P0 states and does not block normal desktop clicks.
3. Push-to-talk produces a visible transcript and local spoken response.
4. User can create a project, task and manual checkpoint.
5. “Where did I stop?” returns the latest checkpoint accurately.
6. “Resume” opens only user-approved resources.
7. Dashboard shows current projects, tasks and checkpoint history.
8. All stored project information survives restart.
9. User can view and delete project and memory data.
10. Core product functions without an internet connection.

### 19.2 Version 1.0 acceptance

1. Wake word meets the defined controlled-test target or remains labelled beta.
2. Focus sessions record project-active time and inactivity.
3. AIRA proposes, previews and saves checkpoint summaries.
4. Screen-region capture is explicit, visibly indicated and local.
5. Common screenshot questions complete within the target performance budget.
6. Local approved-file search identifies its sources.
7. Permission and action logs are complete for screen, file and local action use.
8. GPU out-of-memory recovery succeeds without application data loss.

### 19.3 Version 1.5 acceptance

1. Browser extension records supported video play/pause/seek activity.
2. Idle or background-tab periods are not counted as active watch time.
3. User can correct a lesson record and dashboard metrics recalculate.
4. Dashboard separately shows videos, notes, practice and revision.
5. Weekly analysis cites underlying local records.
6. Placement roadmap can identify the next eligible topic based on dependencies.
7. Schedule variance calculations pass unit tests for known sample courses.

### 19.4 Version 2.0 acceptance

1. Webcam remains off until explicit activation.
2. Active camera use is continuously indicated.
3. User can preview, capture and discard a frame.
4. AIRA can answer common object/document questions on clear frames.
5. Camera frames are deleted automatically when retention is disabled.

---

## 20. Test Strategy

### 20.1 Unit testing

- Course metric calculations.
- Idle-time exclusion.
- Checkpoint serialization.
- Permission evaluation.
- Action risk classification.
- Database migrations.
- Model-routing decisions.
- Resource-budget enforcement.

### 20.2 Integration testing

- Desktop UI ↔ local service.
- Local service ↔ model runtime.
- Browser extension ↔ local service.
- File tracking ↔ project sessions.
- Speech recognition ↔ command router.
- Screenshot capture ↔ vision model.
- Checkpoint ↔ resume resource launcher.

### 20.3 Hardware testing

Run on the target laptop under:

- Battery and AC power.
- Eco, Balanced and Performance modes.
- Browser with 10+ tabs open.
- IDE and office application open.
- Text model request.
- Vision request immediately after text request.
- Low available RAM.
- GPU driver update/restart.
- Sleep/wake and Windows restart.

### 20.4 Privacy testing

- Confirm no screen capture without explicit activation.
- Confirm no camera access outside camera mode.
- Confirm microphone off in Sleep mode.
- Confirm unapproved folders cannot be indexed.
- Confirm screenshot deletion policy.
- Confirm activity log contains capability use.
- Confirm “delete all data” removes database, indexes and retained captures.

### 20.5 User acceptance scenarios

- Create a placement roadmap.
- Study two videos, create one note and stop.
- Resume the next day.
- Ask where the previous session stopped.
- Select a visible error and ask for explanation.
- Review weekly progress.
- Correct an incorrect activity entry.
- Attempt an external action and verify confirmation.
- Disable all sensing through the emergency control.

---

## 21. Delivery Plan

The timeline depends on developer experience. Milestones are capability-based rather than fixed calendar promises.

### Phase 0 — Technical proof

- Benchmark local text, vision, speech-to-text and text-to-speech components.
- Measure VRAM, RAM, latency and thermal behaviour.
- Prove transparent avatar window.
- Prove local SQLite writes and project checkpoint retrieval.
- Select initial model sizes.

**Exit:** One spoken question can receive a local spoken answer, and one project checkpoint can be saved and restored.

### Phase 1 — Desktop MVP

- Desktop shell, tray, avatar and shortcuts.
- Push-to-talk and text command box.
- Project/task/checkpoint CRUD.
- Resume flow.
- Basic dashboard.
- Settings, logs, backups and privacy controls.

**Exit:** MVP acceptance criteria pass.

### Phase 2 — Local intelligence and screen questions

- Memory retrieval.
- Approved local file indexing.
- On-demand screen region capture.
- Vision model routing.
- Resource/performance modes.
- Better checkpoint drafting.

**Exit:** Version 1.0 acceptance criteria pass.

### Phase 3 — Learning analytics

- Chrome extension.
- Course/lesson model.
- Video activity tracking.
- Notes, practice and revision records.
- Placement roadmap.
- Weekly analysis and exports.

**Exit:** Version 1.5 acceptance criteria pass.

### Phase 4 — Camera and polish

- On-demand camera flow.
- Avatar animation refinement.
- Voice and bilingual tuning.
- Improved onboarding and diagnostics.
- Packaging, updater and recovery testing.

**Exit:** Version 2.0 acceptance criteria pass.

---

## 22. Key Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| 4 GB VRAM exhaustion | Slowdown or model failure | One heavy model at a time, small quantized models, short context, OOM recovery |
| 16 GB RAM pressure | System slowdown | Bounded indexing, memory monitoring, pause background work, optional future RAM upgrade |
| Local model mistakes | Incorrect answers/actions | Deterministic commands, evidence links, confirmations and uncertainty handling |
| Wake-word false activation | Privacy/annoyance | Push-to-talk default, sensitivity control, visible listening indicator |
| Course platform changes | Broken tracking | Adapter architecture, manual correction and confidence levels |
| Inaccurate study measurement | Misleading dashboard | Active/idle rules, unique timeline tracking and separate comprehension evidence |
| Excessive avatar distraction | User disables product | Calm defaults, quiet hours, reduce motion, daily suggestion budget |
| Sensitive data exposure | Loss of trust | Local default, narrow permissions, retention controls, encryption and audit logs |
| Project summaries drift from reality | Poor resume experience | Evidence-backed checkpoints and user confirmation |
| Laptop heat/battery drain | Reduced usability | Eco mode, model unload, AC-only heavy work and thermal-aware pausing |
| Scope expansion | Product never stabilizes | Release gates and locked exclusions in this PRD |

---

## 23. Future Possibilities Requiring a New PRD

These ideas are intentionally deferred and must not enter v1 implementation without separate approval:

- Mobile companion application.
- Secure synchronization across devices.
- Optional cloud reasoning for difficult tasks.
- Email/calendar/messaging integrations.
- Multi-user profiles.
- Smart-home integrations.
- 3D avatar.
- Industrial maintenance knowledge modules.
- Read-only PLC/SCADA dashboards.
- Marketplace or third-party skills.

Any industrial integration must be separated from the personal assistant’s normal action system and designed with appropriate safety engineering.

---

## 24. Reference Implementation Sources

These sources inform the proposed local stack but do not override the requirements in this PRD:

- Tauri window customization: https://v2.tauri.app/learn/window-customization/
- Ollama vision: https://docs.ollama.com/capabilities/vision
- Ollama tool calling: https://docs.ollama.com/capabilities/tool-calling
- Ollama GPU support: https://docs.ollama.com/gpu
- llama.cpp: https://github.com/ggml-org/llama.cpp
- whisper.cpp: https://github.com/ggml-org/whisper.cpp
- Piper TTS: https://github.com/OHF-voice/piper1-gpl
- openWakeWord: https://github.com/dscripka/openWakeWord
- SQLite: https://sqlite.org/about.html
- Chrome content scripts: https://developer.chrome.com/docs/extensions/develop/concepts/content-scripts
- Chrome Tabs API: https://developer.chrome.com/docs/extensions/reference/api/tabs
- YouTube IFrame Player API: https://developers.google.com/youtube/iframe_api_reference

---

## 25. Definition of Done for the Product Vision

AIRA’s core vision is considered achieved when the following complete scenario works reliably on the target laptop without a mandatory paid service:

1. The avatar is present but unobtrusive on the desktop.
2. The user calls AIRA by voice or shortcut.
3. AIRA understands and speaks locally.
4. The user begins a placement/course/project session.
5. AIRA tracks approved activity without continuously analysing the screen.
6. The user asks about selected screen or camera content and receives a useful answer.
7. The user stops, reviews and saves a checkpoint.
8. On a later day, AIRA accurately explains where work stopped.
9. AIRA reopens the correct resources after approval.
10. The dashboard shows credible progress across videos, notes, practice and roadmap items.
11. The user can inspect, correct, export and delete all relevant data.
12. Sensitive or external actions remain permission-gated and logged.

When these conditions are met, AIRA is no longer a random chatbot. It is a persistent, private and useful personal desktop companion.

---

## 26. PRD Approval Record

**Baseline approved concept:** Local-first AIRA desktop companion  
**Scope removals confirmed:** Continuous screen vision, advanced emotion understanding, long autonomous coding/research, frontier-level complex reasoning and concurrent heavy AI models  
**Primary build focus:** Avatar, local voice, project continuity, course/placement analytics, dashboard, on-demand screen/camera understanding and safe desktop actions  
**Change process:** Any material scope change requires a new version number and an entry below.

| Version | Date | Change | Status |
|---|---|---|---|
| 1.0 | 23 August 2026 | Initial locked PRD | Approved baseline |

