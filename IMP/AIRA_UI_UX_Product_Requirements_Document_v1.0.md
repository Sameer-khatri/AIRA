# AIRA — UI/UX Product Requirements Document

**Document type:** UI/UX vision and interaction specification  
**Version:** 1.0 — Locked baseline  
**Status:** Approved design direction for implementation  
**Product:** AIRA — Local-First Personal Desktop Companion  
**Companion document:** `AIRA_Product_Requirements_Document_v1.0.md`  
**Primary platform:** Windows desktop  
**Target device:** ASUS TUF A15, Ryzen 7 7445HS, 16 GB RAM, RTX 3050 Laptop GPU with 4 GB VRAM  
**Design direction:** Futuristic soft-JARVIS command center + living desktop companion  

---

## 1. Purpose

This document locks the visual and interaction vision for AIRA. It defines what AIRA looks like, how she behaves on the desktop, how the full-screen dashboard is organized, how voice and visual feedback work together, and how the experience remains useful without becoming distracting.

This is not a technical architecture specification. It is the product-level source of truth for designers and developers implementing AIRA's user experience. Technical choices may evolve, but the experience principles, information hierarchy, states, core flows and acceptance criteria in this document should remain stable unless this PRD is formally revised.

---

## 2. Locked Experience Vision

### 2.1 One-sentence vision

**AIRA is a calm, intelligent female companion who lives at the edge of the desktop, comes alive when called, understands the user's current context with permission, and opens a cinematic command center for deeper work, memory and progress.**

### 2.2 Product feeling

AIRA should feel:

- Present, but never intrusive.
- Futuristic, but still human and approachable.
- Expressive, but not childish or overanimated.
- Intelligent, but honest about uncertainty.
- Personal, but respectful of privacy.
- Motivating, but never guilt-inducing.
- Powerful, but always under the user's control.

### 2.3 Core experience model

AIRA has two primary surfaces:

1. **Desktop Companion:** A lightweight animated avatar that lives on the desktop, usually near a screen edge. It communicates state, accepts quick interactions, speaks, listens when invoked, and opens contextual tools.
2. **AIRA Command Center:** A full-screen or maximized dashboard for planning, project continuity, learning analytics, memories, conversations, screen tools and settings.

The desktop avatar is the relationship layer. The Command Center is the productivity layer. They must feel like two forms of the same character, not two separate applications.

### 2.4 Locked product boundaries

- AIRA does not continuously watch the screen.
- AIRA sees the screen only after a clear user request or an enabled, visible action.
- AIRA does not pretend to recognize emotions with clinical accuracy.
- AIRA may infer tone from conversation and recent activity, but presents such conclusions gently and uncertainly.
- AIRA does not roam constantly or interfere with pointer control.
- AIRA does not start long autonomous work without a clear plan and confirmation.
- AIRA does not use a photorealistic human face in version 1.
- AIRA does not require a permanently open dashboard.

---

## 3. Experience Principles

### 3.1 Calm presence

AIRA should spend most of her time in a quiet idle state. Movement should be occasional, slow and purposeful. She should never compete with the user's active task for attention.

### 3.2 Invocation before attention

The user should normally initiate meaningful interaction through a wake phrase, keyboard shortcut, avatar click or tray action. Proactive interruptions should be rare, relevant and configurable.

### 3.3 Information before decoration

The interface may look cinematic, but every glow, animation and card must communicate meaning. Decorative effects must not reduce legibility or performance.

### 3.4 Trust through visibility

Whenever AIRA is listening, viewing a screenshot, using the camera, accessing a file or preparing an action, the interface must visibly show it. Hidden sensing is prohibited.

### 3.5 Continuity over chat history

The primary value is not an endless transcript. AIRA should surface the last checkpoint, unfinished work, decisions, next step and measurable progress.

### 3.6 Progressive depth

Quick actions remain available beside the avatar. Detailed work moves into a panel or the Command Center. The user should not need to open the full dashboard for simple tasks.

### 3.7 Local-first confidence

The interface should make offline and local operation feel intentional, not inferior. Cloud features, if added, must be clearly distinguished and optional.

### 3.8 Graceful performance

On the target laptop, smooth interaction matters more than advanced visual effects. AIRA should reduce animation or model activity automatically when the system is under load.

---

## 4. Brand and Personality Direction

### 4.1 Product name

**AIRA** is the locked working name. The interface may present it as `AIRA` in headings and `Aira` in conversational copy.

### 4.2 Brand keywords

Calm, luminous, focused, loyal, composed, warm, futuristic, precise, private, encouraging.

### 4.3 Personality archetype

AIRA combines:

- A capable mission-control operator.
- A supportive study and career companion.
- A familiar presence who remembers the user's ongoing work.

She is not a servant, romantic partner, therapist, anime stereotype or military commander. She is a respectful digital partner.

### 4.4 Default communication style

- Brief for simple commands.
- Structured for planning and explanations.
- Warm but not overly sweet.
- Confident when evidence is available.
- Explicitly uncertain when evidence is incomplete.
- Never sarcastic during failure, stress or poor progress.
- May use light playfulness during casual or successful moments.

### 4.5 Example tone

| Situation | Preferred response style |
| --- | --- |
| Wake | “I'm here. What do you need?” |
| Resume project | “You stopped after fixing authentication. The next step was testing token refresh.” |
| Screen question | “I can look at the active window. Shall I take a snapshot?” |
| Study progress | “You completed 42 minutes today. Two lessons remain in this module.” |
| Low progress | “This week was lighter than planned. Want me to reduce tomorrow's target?” |
| Uncertainty | “I may be missing context. I found two possible checkpoints.” |
| Error | “That didn't complete. Your files were not changed.” |
| Success | “Done. I also saved the new checkpoint.” |

---

## 5. Visual Identity

### 5.1 Overall aesthetic

The interface uses a **soft futuristic command-center** style: dark layered surfaces, controlled translucency, thin luminous borders, subtle depth and restrained holographic accents. It should feel premium and focused rather than like a gaming overlay.

### 5.2 Core color system

| Token | Suggested value | Purpose |
| --- | --- | --- |
| `bg-void` | `#070A12` | Main application background |
| `bg-deep` | `#0C1120` | Secondary background |
| `surface-1` | `#11182A` | Primary cards and panels |
| `surface-2` | `#172038` | Elevated and hovered surfaces |
| `glass` | `rgba(17, 24, 42, 0.72)` | Overlay panels |
| `line-subtle` | `#26324D` | Dividers and inactive borders |
| `text-primary` | `#F2F6FF` | Main text |
| `text-secondary` | `#9FAEC8` | Supporting text |
| `cyan-core` | `#55E6FF` | Primary interaction and listening |
| `cyan-soft` | `#8AF0FF` | Highlights and data glow |
| `violet-core` | `#9B7CFF` | Memory, intelligence and identity |
| `violet-deep` | `#6D4BDB` | Secondary accent |
| `success` | `#58E6A9` | Completed and safe |
| `warning` | `#FFCC66` | Attention and confirmation |
| `danger` | `#FF6F91` | Destructive or failed state |
| `focus` | `#FFFFFF` | High-contrast focus ring |

Colors are functional. Cyan represents live interaction and action. Violet represents memory, thought and AIRA's identity. Green represents verified completion. Amber represents attention. Pink-red is reserved for errors and destructive actions.

### 5.3 Light and contrast

- Main experience defaults to dark mode.
- Core text must meet WCAG AA contrast against its background.
- Glows must never be the only state indicator.
- Text may not be rendered as low-opacity decoration when it communicates required information.
- A high-contrast mode must remove glass transparency and strengthen borders.

### 5.4 Typography

Recommended open-source pair:

- **Interface and body:** Inter or Manrope.
- **Display and numerical emphasis:** Space Grotesk.
- **Code and technical metadata:** JetBrains Mono.

Typography rules:

- Body copy: 14–16 px.
- Compact labels: minimum 12 px.
- Dashboard section title: 20–24 px.
- Primary greeting: 32–44 px depending on viewport.
- Large metric: 28–40 px.
- Line height: approximately 1.4–1.6 for reading content.
- Avoid all-uppercase paragraphs. Uppercase may be used for short system labels only.

### 5.5 Shape language

- Card radius: 14–18 px.
- Small controls: 8–12 px radius.
- Pills: fully rounded.
- Borders: mostly 1 px with controlled accent illumination.
- Avoid sharp aggressive geometry.
- Use arcs, rings and orbital elements around AIRA to suggest presence and thought.

### 5.6 Iconography

- Use a single open-source outline icon family.
- Default stroke width should be consistent.
- Icons require text labels for uncommon actions.
- Sensing icons—microphone, screen and camera—must remain visually distinct.
- Filled variants may indicate active state.

### 5.7 Background treatment

The dashboard background may contain a slow, subtle radial gradient or soft grid. It must not animate continuously by default. No starfield, constant particle rain or intense parallax in the main workflow.

---

## 6. Avatar Art Direction

### 6.1 Locked avatar concept

AIRA is a **stylized 2D female holographic companion**, approximately semi-anime but mature and original. She should be recognizable at small size through silhouette, hair shape, eye glow and cyan-violet accents.

### 6.2 Character qualities

- Apparent adult, composed and capable.
- Friendly facial structure without exaggerated childlike proportions.
- Futuristic clothing with simple geometric light elements.
- Expressive eyes and brows; small mouth movements for speech.
- Hair and accessory motion should be subtle.
- No hypersexualized clothing, poses or proportions.
- No photorealistic uncanny-valley rendering.
- No resemblance to an existing copyrighted character or real person.

### 6.3 Recommended appearance

- Shoulder-length or tied futuristic hair silhouette.
- Dark navy outfit with cyan seams and violet core accent.
- Small luminous earpiece or temple glyph representing listening.
- Optional floating orbital ring or core behind/around the avatar during active states.
- Lower body may fade into a holographic gradient in compact desktop mode.

### 6.4 Avatar implementation levels

| Level | Form | Use |
| --- | --- | --- |
| L0 | Static bust with state glow | Earliest prototype |
| L1 | 2D sprite or rig with idle, blink, listen, think and speak | MVP |
| L2 | Layered 2D rig with facial expressions, gestures and better lip-sync | Version 1 |
| L3 | Higher-quality Live2D-style motion with skins | Future enhancement |

The experience must work at L1. It must not depend on expensive real-time 3D rendering.

### 6.5 Avatar size modes

| Mode | Approximate size | Purpose |
| --- | --- | --- |
| Orb | 44–56 px | Minimal presence or gaming/focus mode |
| Mini | 96–128 px tall | Default desktop presence |
| Companion | 160–220 px tall | Conversation and active assistance |
| Portrait | 260–360 px tall | Command Center greeting or conversation |

The user may set a default. AIRA may temporarily expand from Mini to Companion when invoked, then return after the interaction.

### 6.6 Avatar skins

Version 1 should ship with one polished canonical skin. Optional later skins may change clothing, hairstyle accents or hologram treatment while preserving identity and state readability. Skins must not change core controls or behavior.

---

## 7. Desktop Companion Surface

### 7.1 Purpose

The desktop companion provides presence, quick access, voice feedback and visible system state without requiring the user to keep a full application window open.

### 7.2 Window behavior

- Transparent, frameless desktop window.
- Always-on-top is configurable and enabled by default.
- Only the avatar and visible controls capture pointer input.
- Empty transparent pixels must pass clicks through to underlying applications.
- The avatar can be dragged to any screen edge.
- Position persists per monitor and display arrangement.
- The avatar must recover to a visible location after resolution or monitor changes.
- A tray menu can show, hide, sleep or exit AIRA.

### 7.3 Default placement

The initial location is near the lower-right desktop edge, above the taskbar and away from the system tray. During onboarding, the user may drag AIRA elsewhere.

### 7.4 Movement philosophy

AIRA may appear alive, but she must not wander constantly. Default behavior:

- Gentle breathing or hologram pulse while idle.
- Blink approximately every 4–8 seconds with natural variance.
- Small posture change no more than every 30–90 seconds.
- No walking while the user is typing, presenting, gaming or watching full-screen video.
- Optional edge walking only during idle desktop periods.
- Never crosses the center of the active working area without explicit animation preview or user request.
- Never follows the cursor by default.

### 7.5 Desktop behavior modes

| Mode | Behavior |
| --- | --- |
| Quiet | Minimal avatar motion; no proactive speech; status glow only |
| Normal | Calm motion; limited reminders and contextual prompts |
| Focus | Avatar collapses to orb; notifications held except urgent user-defined items |
| Conversation | Avatar expands; listening and speaking controls remain visible |
| Sleep | No wake-word listening; scheduled tracking may continue if enabled |
| Hidden | No desktop surface; tray and shortcut remain available |
| Privacy pause | Microphone, camera and screen access disabled; red/neutral privacy badge visible |

### 7.6 Summoning AIRA

AIRA may be invoked through:

- Wake phrase, if enabled.
- Global keyboard shortcut.
- Single click on avatar.
- Tray menu.
- Optional mouse gesture or screen-edge hotspot, disabled by default.

On invocation:

1. Avatar expands if necessary.
2. Cyan listening ring appears.
3. A short nonverbal acknowledgement plays if sound is enabled.
4. Live transcription appears in a compact speech strip.
5. The user can cancel with `Esc`, a stop button or “cancel.”

### 7.7 Quick action halo

Clicking AIRA without speaking opens a compact radial or curved menu with no more than six items:

- Talk
- Resume
- See screen
- Quick note
- Focus
- Open Command Center

Secondary functions go into a `More` menu rather than expanding the halo.

### 7.8 Speech strip

A compact card appears beside the avatar during listening, thinking and speaking.

It contains:

- Current state label.
- Live transcription or response text.
- Microphone mute.
- Stop/cancel.
- Expand to conversation panel.
- Optional text input.

Long responses should not fill the desktop. After approximately three lines, the user can expand the conversation panel or open the Command Center.

### 7.9 Context panel

For a project checkpoint, reminder or screen explanation, AIRA may open a narrow contextual panel anchored to the avatar. Recommended width: 320–420 px.

The panel may include:

- Title and source.
- Short explanation.
- One primary action.
- Up to two secondary actions.
- Evidence or timestamp.
- Dismiss and “don't suggest this again” controls where relevant.

### 7.10 Screen-peek interaction

When the user says “What is this?” or selects `See screen`:

1. AIRA displays a permission chip: `Ready to capture active window`.
2. The active window is outlined in cyan.
3. User confirms, or a previously enabled direct-request policy allows immediate capture.
4. A brief shutter-like border animation shows that one snapshot was taken.
5. A thumbnail and `Captured just now` label appear.
6. AIRA processes the snapshot and answers.
7. The user can delete the snapshot immediately.

The interface must never suggest continuous observation. The capture indicator must be visible even if the avatar is hidden.

### 7.11 Drag and collision behavior

- While dragging, show safe docking zones near edges.
- On release, AIRA gently snaps to the nearest valid edge if edge docking is enabled.
- AIRA should avoid the taskbar, system tray, active text caret area where feasible, media controls and its own speech panel.
- If avoidance cannot be determined reliably, remain stationary rather than jumping unexpectedly.

### 7.12 Multi-monitor behavior

- AIRA lives on one selected primary companion monitor.
- The user can move her to another monitor by dragging or settings.
- Screen capture must clearly identify which display or window will be captured.
- Do not duplicate the avatar on multiple monitors in version 1.

---

## 8. Avatar State System

### 8.1 Required states

| State | Visual behavior | Color/audio | Exit condition |
| --- | --- | --- | --- |
| Sleeping | Eyes closed or core dim; almost no motion | Neutral violet, no sound | User wakes or schedule ends |
| Idle | Calm pose, breathing, occasional blink | Low cyan-violet glow | Invocation or event |
| Noticing | Looks toward notification/panel | Brief cyan accent | 1–2 seconds |
| Listening | Attentive posture, active waveform/ring | Cyan; subtle start cue | Silence, submit or cancel |
| Hearing issue | Slight puzzled expression | Amber | Retry, type or cancel |
| Thinking | Slow orbital motion or temple glow | Violet | Response or error |
| Speaking | Lip and head motion matched approximately to audio | Cyan-violet waveform | Speech finishes or stops |
| Working | Small progress glyph; low motion | Violet with progress | Task completes/fails/cancels |
| Success | Brief smile/nod and green spark | Green soft cue | Returns to idle |
| Warning | Concerned but calm; amber badge | Amber | User responds/dismisses |
| Error | Short glitch pulse, then stable | Pink-red; no alarming sound | Retry/dismiss |
| Privacy pause | Neutral pose with shield/slash badge | Desaturated violet | User restores permissions |
| Focus | Collapsed orb with timer ring | Muted cyan | Focus ends/user invokes |

### 8.2 State priority

Higher-priority states override lower-priority states:

1. Privacy pause
2. Error requiring action
3. Listening
4. Speaking
5. Working
6. Warning
7. Focus
8. Idle or sleeping

### 8.3 Emotion expression policy

AIRA may express her own interaction state—curiosity, attention, success, concern, calmness—but must not claim to detect the user's emotion as fact.

Acceptable: “You sound a little tired. Want a shorter plan?”  
Unacceptable: “I know you are depressed.”

User-facing inferred-emotion language must use uncertainty markers such as “seems,” “might” or “sounds like.”

### 8.4 Expression intensity

Default expression intensity is `Balanced`. Settings:

- Minimal: state glow and eye movement only.
- Balanced: facial expression plus small gestures.
- Expressive: stronger reactions and optional edge walking.

### 8.5 Transition timings

- Hover feedback: 100–150 ms.
- Button state: 120–180 ms.
- Avatar state transition: 180–350 ms.
- Expand Mini → Companion: 250–400 ms.
- Context panel open: 180–260 ms.
- Dashboard route transition: 180–300 ms.
- Success reaction: 700–1200 ms maximum.
- Error reaction: 300–700 ms, then stable recovery UI.

No required action should be delayed solely to complete an animation.

---

## 9. AIRA Command Center

### 9.1 Purpose

The Command Center is the full workspace for seeing today’s priorities, resuming projects, understanding study progress, reviewing memory, managing conversations and controlling AIRA.

### 9.2 Opening behavior

The Command Center opens when the user:

- Says “Open dashboard” or “Show Command Center.”
- Selects it from the avatar quick menu.
- Uses a keyboard shortcut.
- Opens AIRA from the Start menu or tray.

The last visited route may be restored, except after more than four hours of inactivity, when the app returns to Home with a clear resume card.

### 9.3 Window model

- Default: maximized app window, not exclusive full-screen.
- Optional immersive full-screen with `F11`.
- Minimum supported width: 1024 px.
- Optimized for 1920×1080 and 1440p.
- At widths below 1200 px, secondary panels stack or collapse.
- The avatar remains visible as a portrait or small holographic presence inside the app shell.

### 9.4 Global layout

The main layout has four persistent regions:

1. **Left rail:** Primary navigation.
2. **Top command bar:** Search, command entry, sensing status and global controls.
3. **Main canvas:** Route-specific content.
4. **AIRA presence panel:** Collapsible right-side conversation and contextual guidance.

### 9.5 Left navigation rail

Primary routes, in locked order:

1. Home
2. Today
3. Projects
4. Learning
5. Roadmap
6. Memory
7. Insights
8. Conversation

Bottom utilities:

- Activity & permissions
- Settings
- Help

The rail may collapse to icons but must expose labels through tooltips and keyboard focus.

### 9.6 Top command bar

Components:

- Current route/title.
- Universal command field: `Ask AIRA or run a command…`.
- Microphone button and current listening state.
- Screen-view button with explicit capture state.
- Notification center.
- Local/offline status.
- User profile/menu.

The command field supports natural language, file/project search and slash commands. Results are grouped by `Ask`, `Open`, `Resume`, `Create` and `Command`.

### 9.7 AIRA presence panel

The right panel can be:

- Closed: avatar icon only.
- Compact: portrait, current suggestion and talk button.
- Open: conversation thread, contextual cards, voice controls and source details.

The panel should be 360–440 px wide on desktop and overlay the main canvas only when insufficient width exists.

---

## 10. Home — Mission Control

### 10.1 Goal

Within five seconds, Home should answer:

- What should I focus on now?
- Where did I stop last time?
- How am I progressing?
- Is anything important waiting?

### 10.2 Home layout

#### Hero row

- Time-aware greeting: `Good evening, Karmbir.`
- One-sentence state summary: `You have one active project and 90 minutes planned for placement prep.`
- AIRA portrait in a subtle holographic frame.
- Primary action: `Resume last work`.
- Secondary action: `Plan my session`.

#### Resume Point card

The most prominent functional card. Displays:

- Project/course name.
- Last meaningful checkpoint.
- Timestamp.
- Last file, lesson or task.
- Next step.
- Blocker, if known.
- `Resume` primary action.
- `Review checkpoint` secondary action.

If evidence is weak, label it `Suggested resume point` rather than presenting certainty.

#### Today's Mission card

- Top three outcomes only.
- Estimated effort.
- Completion status.
- Start Focus button.
- Ability to reorder or defer.

#### Progress pulse

- Study time today.
- Project focus time.
- Lessons/notes/practice completed.
- Current streak, with neutral language.
- Compact weekly trend.

#### Continue Learning

- Active course/module.
- Last watched timestamp.
- Video progress.
- Notes status.
- Next lesson action.

#### Pending items

- Reminders.
- Unconfirmed checkpoints.
- Actions waiting for approval.
- Missed tasks presented without shame language.

### 10.3 Empty state

For a new user, Home shows:

- `Let's give AIRA something to remember.`
- Add first project.
- Add a course or roadmap.
- Try voice.
- Optional guided demo using safe sample data.

---

## 11. Today Workspace

### 11.1 Goal

Turn the user's goals into a realistic day plan and track actual progress without becoming a rigid task manager.

### 11.2 Sections

- Daily intent.
- Timeline or flexible time blocks.
- Top outcomes.
- Active focus session.
- Quick capture inbox.
- Completed activity.
- End-of-day review.

### 11.3 Planning interaction

The user may ask: “Plan two hours for DSA and one hour for my project.” AIRA proposes a plan with time estimates. Nothing is scheduled externally unless the user explicitly confirms and a calendar integration exists.

### 11.4 Focus session view

When focus begins:

- The dashboard simplifies.
- Current task and timer become dominant.
- AIRA collapses to a small focus orb.
- Nonessential notifications are held.
- Pause, finish, switch and add-note controls remain available.
- The user can mark actual progress at the end.

### 11.5 End-of-day review

Maximum five prompts:

- What did you finish?
- Where did you stop?
- What is the next step?
- Is anything blocking you?
- Should unfinished work move to tomorrow?

AIRA pre-fills answers from observed approved activity, clearly marking inferred information.

---

## 12. Projects Workspace

### 12.1 Project list

Each project card includes:

- Name and short purpose.
- Health/status: active, paused, blocked or completed.
- Last active time.
- Current milestone.
- Last checkpoint.
- Next action.
- Progress signal based on tasks or milestones, not invented percentage.

Filters: active, paused, blocked, completed, recently opened and tag.

### 12.2 Project detail layout

#### Header

- Project name and status.
- `Resume project` button.
- Project folder/repository link.
- Last updated.
- More actions.

#### Current checkpoint

- What was completed.
- Exact stopping point.
- Next action.
- Blocker.
- Relevant files and links.
- Confidence/evidence.
- Edit or confirm controls.

#### Timeline

Chronological milestones, sessions, decisions and checkpoints. Routine telemetry is collapsed by default.

#### Project memory

- Decisions.
- Requirements.
- Important facts.
- Commands or setup notes.
- User-pinned items.

#### Work sessions

- Date and duration.
- User-stated goal.
- Apps/files used, if approved.
- Outcome.
- Notes.

### 12.3 Resume experience

When `Resume project` is selected:

1. AIRA summarizes the last checkpoint in two or three sentences.
2. AIRA offers to open the project folder, relevant file and approved tools.
3. AIRA displays the next action.
4. The user confirms any multi-app action.
5. A focus session may begin.

### 12.4 Project creation

Required fields:

- Name.
- Purpose.
- Folder or repository, optional.
- Desired outcome.

Optional:

- Deadline.
- Milestones.
- Tools.
- Tags.
- Tracking rules.

---

## 13. Learning Workspace

### 13.1 Goal

Show credible evidence of course progress across video, notes and practice rather than reporting watch time as mastery.

### 13.2 Learning overview

- Active courses.
- Today and week study time.
- Lessons completed.
- Notes created/reviewed.
- Practice attempts and success rate.
- Modules at risk of being forgotten.
- Continue-learning card.

### 13.3 Course card

- Course name and provider.
- Overall structural completion.
- Video completion.
- Notes coverage.
- Practice coverage.
- Last activity.
- Next lesson.

### 13.4 Course detail

Tabs:

- Overview
- Curriculum
- Activity
- Notes
- Practice
- Insights

Overview visualizations:

- Module completion bars.
- Weekly time trend.
- Watch vs notes vs practice comparison.
- Estimated remaining effort.
- Current momentum.

### 13.5 Video tracking language

Use precise labels:

- `Watched time` for unique active playback time.
- `Video completion` for timeline coverage.
- `Lesson marked complete` only when user or integration confirms completion.
- `Reviewed` only when a review event occurs.
- `Understood` only when the user self-rates or practice evidence supports it; never infer from playback alone.

### 13.6 Notes analytics

- Notes created per course/module.
- Last edited time.
- Coverage: lessons with at least one linked note.
- Review status.
- Optional word count as secondary information only.

Do not use raw word count as a primary learning-success measure.

### 13.7 Practice analytics

- Attempts.
- Correct/incorrect.
- Difficulty.
- Topic.
- Time spent.
- Retry history.
- Confidence self-rating.

### 13.8 Correction flow

All tracked study records must be editable. When the user corrects duration, completion or mapping, affected charts recalculate immediately and show `Updated from your correction`.

---

## 14. Placement Roadmap Workspace

### 14.1 Goal

Translate a long placement-preparation roadmap into the next useful action and honest readiness indicators.

### 14.2 Roadmap hierarchy

Roadmap → Track → Topic → Resource → Practice → Evidence.

Example tracks:

- DSA
- Core CS subjects
- Development/project work
- Aptitude
- Resume and profile
- Interview preparation

### 14.3 Roadmap overview

- Readiness summary with explanation.
- Current phase.
- Weekly commitment vs actual.
- Track progress.
- Upcoming topics.
- Weak evidence areas.
- Recommended next three actions.

### 14.4 Readiness score policy

If a readiness score exists, it must:

- Show the factors used.
- Avoid false precision; use bands or rounded values.
- Separate completion, practice and confidence.
- Allow the user to inspect and correct inputs.
- Never imply hiring probability.

Preferred display:

- Foundation coverage
- Practice consistency
- Project evidence
- Interview readiness

Each category uses `Starting`, `Building`, `Consistent` or `Ready to test`, supported by evidence.

### 14.5 Topic detail

- Learning objective.
- Linked lessons and notes.
- Practice history.
- Last reviewed.
- Confidence.
- Next review recommendation.
- Mark complete/reopen.

---

## 15. Memory Workspace

### 15.1 Goal

Make AIRA's memory visible, correctable and safe. The user should always be able to answer: “What does AIRA know about me, and why?”

### 15.2 Memory categories

- Preferences
- Projects
- Learning
- Decisions
- People and organizations
- Routines
- Temporary context

Sensitive categories are disabled unless explicitly enabled.

### 15.3 Memory card anatomy

- Memory statement.
- Category.
- Source and date.
- Confidence.
- Last used.
- Related project/course.
- Pin, edit, forget and view-source actions.

### 15.4 Memory creation

When AIRA proposes a durable memory, show:

- `Remember this?`
- Exact text to be stored.
- Category.
- Scope: global, project or temporary.
- Expiration for temporary memories.
- Save/edit/not now controls.

Simple explicit instructions such as “Remember that I prefer…” may save directly, followed by a visible confirmation and undo.

### 15.5 Memory deletion

- `Forget` removes the memory after confirmation when impact is significant.
- Provide a short undo window for ordinary deletions.
- Show related derived items that may remain, such as a project checkpoint.
- A clear `Forget all memories in this category` action lives in settings and requires confirmation.

### 15.6 Memory search

Search supports natural language and filters by category, date, source, confidence and related workspace.

---

## 16. Insights Workspace

### 16.1 Goal

Help the user understand patterns and make decisions, not merely display activity statistics.

### 16.2 Default views

- This week
- Last four weeks
- Custom range

### 16.3 Insight categories

- Focus and time allocation.
- Project momentum.
- Learning consistency.
- Video/notes/practice balance.
- Planned vs completed.
- Common blockers.
- Most productive time windows, if data is sufficient.

### 16.4 Insight card anatomy

- Plain-language finding.
- Supporting metric.
- Date range.
- Confidence/data quality.
- Recommended action.
- `Why am I seeing this?`

### 16.5 Chart rules

- Every chart has a title, period and unit.
- Tooltips provide exact values.
- Color is never the only differentiator.
- Empty or incomplete data is explicitly marked.
- Avoid pie charts with many categories.
- Do not show trends from fewer than three meaningful data points.
- AIRA must distinguish tracked time, estimated time and user-entered time.

### 16.6 Weekly review

AIRA presents:

1. What moved forward.
2. What stalled.
3. Evidence behind the conclusion.
4. One or two suggested changes.
5. A user-confirmed plan for next week.

---

## 17. Conversation Workspace

### 17.1 Goal

Provide a readable history of meaningful interactions while keeping structured project and learning information outside the raw chat transcript.

### 17.2 Layout

- Conversation list or dates on the left.
- Main message thread.
- Context/source panel on the right when required.
- Voice controls and text composer at bottom.

### 17.3 Message types

- User text.
- User voice transcript.
- AIRA response.
- Command proposal.
- Permission request.
- Tool/action progress.
- Screenshot or camera snapshot.
- Memory suggestion.
- Project checkpoint.
- Error/recovery.

### 17.4 Source transparency

Answers based on memories, files, screenshots or activity data should provide a compact `Based on` disclosure. The user can expand it to see sources and timestamps.

### 17.5 Action proposal card

Before a consequential action, show:

- What AIRA intends to do.
- Target application/file/account.
- Expected result.
- Risk level.
- Confirm, modify or cancel.

### 17.6 Conversation retention

The user controls retention duration. Deleting a conversation must explain whether separately approved memories or checkpoints remain.

---

## 18. Screen and Camera Tools

### 18.1 Screen tool entry points

- Desktop quick action.
- Command Center top bar.
- Conversation attachment menu.
- Keyboard shortcut.

### 18.2 Capture choices

- Active window.
- Selected region.
- Entire selected display.
- Image from clipboard.

Active window is the default. Full display capture requires a stronger preview because it may include private content.

### 18.3 Capture preview

Before or immediately after capture, depending on preference:

- Show a preview.
- Show the selected source.
- Allow crop/redaction.
- Allow retake.
- Allow delete.
- State whether the image will be retained.

### 18.4 Question suggestions

After capture:

- What is this?
- Explain this error.
- Summarize this screen.
- What should I click next?
- Extract text.
- Add this to my project.

### 18.5 Camera tool

Camera access is off by default. When invoked:

- Open a visible preview.
- Display a persistent camera-active indicator.
- Let user capture a single frame.
- Close the camera automatically after the question unless explicitly kept open for a short session.
- Provide immediate delete.

### 18.6 Retention states

Every visual capture shows one of:

- `Temporary — deleted after this interaction`
- `Saved to conversation`
- `Saved to project`

Temporary should be the default.

---

## 19. Notifications and Proactivity

### 19.1 Notification hierarchy

| Level | Example | Presentation |
| --- | --- | --- |
| Silent | Tracking completed | Activity log only |
| Ambient | Focus session ending soon | Avatar badge/pulse |
| Standard | Planned session is due | Toast + avatar noticing state |
| Confirmation | Action needs approval | Persistent card until handled |
| Critical | Privacy or data failure | Clear persistent banner; no playful animation |

### 19.2 Proactive suggestion budget

Default maximum: three proactive suggestions per day, excluding user-created reminders and critical status messages. Repeated dismissal reduces similar suggestions.

### 19.3 Interruption rules

Do not proactively speak when:

- Focus mode is active.
- A full-screen app or presentation is active.
- The microphone is in use by another communication app.
- Quiet hours are active.
- The user recently dismissed the same suggestion.

### 19.4 Notification copy

Use neutral, actionable language. Avoid urgency unless real, and avoid guilt.

Preferred: `Your planned DSA session hasn't started. Move it or begin now?`  
Avoid: `You are falling behind again!`

---

## 20. Voice UX

### 20.1 Voice identity

Default voice: adult female, calm, clear, medium pace, warm-neutral tone. It should not imitate a celebrity or fictional character.

### 20.2 Voice settings

- Voice choice.
- Speed.
- Pitch within safe natural bounds.
- Verbosity: concise, balanced or detailed.
- Spoken confirmations.
- Nonverbal sounds.
- Wake phrase.

### 20.3 Listening feedback

Listening must always display:

- Cyan microphone/ring.
- `Listening` label.
- Live transcription where feasible.
- Stop control.

### 20.4 Turn-taking

- A short pause ends a simple request.
- The user can continue speaking when a continuation indicator is present.
- Saying `stop`, pressing `Esc` or clicking stop immediately interrupts speech and work where safe.
- AIRA may ask one short clarification when necessary.
- For complex requests, AIRA presents its understanding before execution.

### 20.5 Voice response length

- Simple command: one sentence.
- Status summary: three to five sentences.
- Detailed explanation: short spoken overview plus visual details in the panel/dashboard.

### 20.6 Failure recovery

If speech recognition confidence is low:

- Show the uncertain words.
- Offer two likely interpretations.
- Allow typed correction.
- Do not execute consequential actions.

---

## 21. Motion and Sound System

### 21.1 Motion principles

- Motion communicates cause, state and spatial relationship.
- Repeated ambient motion should have low amplitude.
- No flashing effects.
- No rapid camera movement or screen shake.
- The user can disable nonessential motion.

### 21.2 Sound principles

- Short, soft state cues only.
- Distinct listening start/stop sounds.
- Success sound should be less than one second.
- Errors use a gentle low cue, never a siren.
- Sound effects can be disabled separately from voice.
- Do not play ambient background music by default.

### 21.3 Reduced-motion mode

When enabled:

- Avatar walking is disabled.
- State changes use crossfades.
- Orbital movement becomes a static progress ring.
- Parallax and decorative background animation are disabled.
- Essential progress remains visible through text and icons.

### 21.4 Performance adaptation

When GPU/CPU load or battery pressure is high:

- Reduce avatar frame rate.
- Pause decorative motion.
- Collapse complex blur effects.
- Avoid animated charts.
- Preserve input, state feedback and task progress.

---

## 22. Component System

### 22.1 Core components

- App shell
- Navigation rail
- Command bar
- AIRA portrait/presence
- Metric card
- Resume card
- Task card
- Project card
- Course card
- Roadmap node
- Memory card
- Insight card
- Permission chip
- Status badge
- Activity event
- Confirmation dialog
- Voice waveform
- Empty state
- Toast
- Drawer/panel
- Chart container

### 22.2 Card anatomy

Every card should have:

- Optional icon/status.
- Clear title.
- One primary information block.
- Supporting metadata.
- No more than one visible primary action.
- Secondary actions in a menu or lower-emphasis row.

### 22.3 Button hierarchy

- Primary: cyan fill or high-contrast treatment.
- Secondary: dark surface with visible border.
- Tertiary: text/icon.
- Destructive: danger color, used only after intent is clear.
- Disabled: visibly unavailable with explanatory tooltip where needed.

### 22.4 Status language

Use consistent pairs:

- Active / Paused / Completed / Blocked
- Listening / Thinking / Speaking / Working
- Local / Offline / Cloud optional
- Temporary / Saved
- Confirmed / Suggested / Needs review

### 22.5 Loading states

- Under 400 ms: no loader required.
- 400 ms–2 s: subtle inline progress.
- Over 2 s: state label and cancel option.
- Over 10 s: progress explanation and background option if supported.
- Never show an indefinite spinner without describing what is happening.

### 22.6 Empty states

An empty state includes:

- What this area is for.
- Why it is empty.
- One useful first action.
- Optional safe example.

---

## 23. Navigation and Command Model

### 23.1 Navigation consistency

The same destination must use the same name across avatar menus, dashboard navigation, voice commands and settings.

### 23.2 Back behavior

- `Alt+Left` returns to the previous route.
- `Esc` closes the topmost temporary layer.
- Closing the Command Center returns AIRA to desktop companion mode rather than exiting the service.

### 23.3 Keyboard shortcuts

Proposed defaults:

| Action | Shortcut |
| --- | --- |
| Invoke AIRA | `Ctrl+Space` or user-selected conflict-free shortcut |
| Open Command Center | `Ctrl+Shift+Space` |
| Stop/cancel | `Esc` |
| Screen capture chooser | `Ctrl+Shift+S` if conflict-free |
| Quick note | User-configurable |
| Privacy pause | User-configurable global shortcut |

All shortcuts are editable because global conflicts are common.

### 23.4 Universal command field

Examples:

- `Resume AIRA project`
- `Open my last Python file`
- `What did I study this week?`
- `Add checkpoint: API is connected, next test login`
- `Show weak DSA topics`
- `/focus 45m`
- `/privacy`

The interface previews destructive or broad actions before execution.

---

## 24. Onboarding UX

### 24.1 Onboarding goals

The user should reach a successful voice or text interaction within five minutes, without granting unnecessary permissions.

### 24.2 Onboarding sequence

1. Welcome and product promise.
2. Choose AIRA name pronunciation and voice.
3. Preview avatar size and desktop location.
4. Choose interaction mode: text only, push-to-talk or wake phrase.
5. Explain local-first processing.
6. Request microphone permission only if selected.
7. Offer screen/camera permissions as optional and on-demand.
8. Add first project or course.
9. Run first successful action.
10. Show privacy pause and exit controls.

### 24.3 Permission language

Each permission screen explains:

- What AIRA can access.
- When it will be used.
- Whether information is stored.
- How to disable it.
- What still works without it.

### 24.4 First avatar moment

After basic setup, AIRA appears on the desktop, looks toward the user and says one brief line. No long cinematic intro. The user immediately learns to invoke, drag and hide her.

### 24.5 Progressive setup

Course tracking, project folders, camera, integrations and advanced automation are configured when first needed, not in the initial onboarding.

---

## 25. Settings Information Architecture

### 25.1 Categories

- General
- Avatar
- Voice and listening
- Notifications
- Projects and tracking
- Learning tracking
- Memory
- Screen and camera
- Privacy and permissions
- Performance
- Data and backup
- Accessibility
- About

### 25.2 Avatar settings

- Visible/hidden.
- Size.
- Docked monitor and position.
- Always on top.
- Movement mode.
- Expression intensity.
- Skin.
- Auto-collapse time.
- Show during full-screen apps.

### 25.3 Performance presets

| Preset | Behavior |
| --- | --- |
| Efficient | 15–24 FPS avatar, minimal blur/motion, lower resource priority |
| Balanced | 30 FPS avatar, standard effects; recommended for target laptop |
| Enhanced | Higher frame rate/effects when resources allow |

Balanced is the default. Enhanced must display an estimated resource impact warning.

### 25.4 Privacy dashboard

Show current states for:

- Microphone.
- Wake-word listener.
- Screen capture.
- Camera.
- File/folder access.
- Activity tracking.
- Memory retention.
- Optional external services.

Each row contains state, last accessed time, purpose and change control.

---

## 26. Privacy and Trust UX

### 26.1 Persistent sensing indicators

- Microphone active: cyan microphone badge.
- Screen capture in progress: cyan rectangular frame plus screen icon.
- Camera active: green/cyan camera badge and preview.
- Privacy pause: shield-slash badge.

Indicators must not be hidden behind the Command Center or avatar panel.

### 26.2 Activity log

Every sensitive access records:

- Time.
- Capability used.
- Trigger source: user voice, click, shortcut or scheduled event.
- Target, such as active window or approved folder.
- Result.
- Retention status.

### 26.3 Permission revocation

The user can revoke any permission from one central screen. The UI immediately explains which features stop working.

### 26.4 Confirmation levels

| Risk | UX requirement |
| --- | --- |
| Read-only, explicitly requested | Visible action indicator; may proceed |
| Reversible local change | Preview or concise confirmation; undo when possible |
| Destructive or external action | Explicit confirmation with exact target |
| Broad/ambiguous action | Clarify scope before presenting confirmation |

### 26.5 Private content behavior

- Password fields must never be captured in text logs.
- Full-screen capture warns when multiple apps or notifications may be included.
- Temporary captures are deleted after processing according to the displayed policy.
- Sensitive response content should not appear in desktop toasts by default.

---

## 27. Accessibility

### 27.1 Required capabilities

- Complete keyboard navigation.
- Visible focus rings.
- Screen-reader labels for controls and live states.
- Text alternative for avatar-only emotion/state.
- Captions/transcripts for all voice interaction.
- Adjustable text size.
- Reduced motion.
- High contrast.
- Color-independent state indicators.
- Mute and text-only mode.

### 27.2 Focus management

- Opening a dialog moves focus to its title or first action.
- Closing returns focus to the triggering control.
- Avatar overlays must not steal focus while the user is typing elsewhere.
- Voice invocation must not move keyboard focus unless the user opens a text field.

### 27.3 Language support

The initial interface may be English-first. Voice input can later support mixed Hindi-English. UI strings must be externalized to allow localization. Avoid idioms in critical instructions and errors.

---

## 28. Responsive and Display Behavior

### 28.1 Breakpoints

| Width | Layout |
| --- | --- |
| 1600 px+ | Expanded rail, three-column canvas where appropriate, open AIRA panel optional |
| 1200–1599 px | Standard rail, two-column cards, collapsible AIRA panel |
| 1024–1199 px | Icon rail, mostly one-column detail, AIRA panel overlays |
| Below 1024 px | Supported only as compact window; prioritize conversation and current task |

### 28.2 Scaling

- Support Windows scaling at 100%, 125%, 150% and 175%.
- Avatar physical size should remain visually consistent across display scaling.
- Test monitor changes and mixed-DPI setups.

### 28.3 Full-screen applications

By default, AIRA hides or collapses to a nonintrusive indicator above full-screen apps. The user may allow visibility per application.

---

## 29. Error, Offline and Degraded Experiences

### 29.1 Offline mode

The top bar shows `Local mode`. Core dashboard, memory, projects, learning records and local voice continue. Features requiring internet are marked unavailable with a reason.

### 29.2 Model unavailable

AIRA remains present and offers deterministic features:

- Open dashboard/projects.
- Show stored checkpoints.
- Start timers.
- Record notes.
- Show analytics.
- Retry or choose a lighter model.

### 29.3 Screen analysis failure

Show:

- Capture thumbnail.
- Clear reason if known.
- Retry.
- Crop image.
- Extract text only.
- Delete capture.

### 29.4 Tracking gaps

Charts should visually mark missing periods. Do not interpolate or invent activity. Offer manual correction.

### 29.5 Recovery language

Every error should answer:

- What failed?
- Was anything changed?
- What can the user do next?

---

## 30. Key User Flows

### 30.1 Wake and ask a basic question

1. User invokes AIRA.
2. AIRA changes to Listening.
3. Speech strip shows transcription.
4. User asks question.
5. AIRA changes to Thinking.
6. AIRA answers verbally and in text.
7. AIRA returns to idle after configurable timeout.

Success: response is understandable, interruption is possible and no dashboard is required.

### 30.2 Ask “What is this?”

1. User invokes AIRA and asks.
2. AIRA identifies that visual context is required.
3. Active window receives visible capture outline.
4. User confirms capture if policy requires.
5. One snapshot is taken.
6. AIRA analyzes it and provides a concise answer.
7. User can ask follow-up, save to project or delete.
8. Temporary snapshot is removed after interaction.

Success: user always knows when and what AIRA saw.

### 30.3 Resume project from desktop

1. User says `Resume my AIRA project`.
2. Context card shows last checkpoint and next step.
3. User selects Resume.
4. AIRA previews apps/files to open if more than one.
5. User confirms.
6. AIRA opens resources and optionally starts Focus mode.
7. Avatar collapses to focus orb.

Success: the user reaches the previous working context within one minute.

### 30.4 Open weekly learning review

1. User asks for weekly progress.
2. Command Center opens to Insights with Learning filter.
3. AIRA summarizes time, lessons, notes and practice separately.
4. The user inspects evidence or corrects a record.
5. Charts recalculate.
6. AIRA proposes next week's plan.
7. User accepts or edits it.

Success: recommendations are traceable to visible data.

### 30.5 End a work session

1. User says `I'm done for today` or ends focus.
2. AIRA shows a pre-filled checkpoint.
3. User corrects completion, stop point, next action and blocker.
4. User saves.
5. AIRA confirms where the checkpoint was stored.
6. Home's Resume Point updates.

Success: the next session can begin without reconstructing context.

### 30.6 Privacy pause

1. User selects privacy shortcut or says `Privacy mode`.
2. AIRA immediately stops microphone, camera and screen access.
3. Avatar changes to privacy state.
4. Persistent badge states what is paused.
5. User manually restores selected capabilities.

Success: sensing stops immediately and status is unambiguous.

---

## 31. UX Requirements

### 31.1 Desktop companion

| ID | Priority | Requirement |
| --- | --- | --- |
| UX-AV-001 | P0 | The avatar shall be draggable and persist its valid position. |
| UX-AV-002 | P0 | Transparent areas shall not block underlying desktop clicks. |
| UX-AV-003 | P0 | The avatar shall clearly represent idle, listening, thinking, speaking, working, success, warning, error, focus and privacy states. |
| UX-AV-004 | P0 | The user shall be able to hide, sleep or exit AIRA from the avatar or tray. |
| UX-AV-005 | P0 | Invocation shall produce visible feedback within 300 ms, independent of model response time. |
| UX-AV-006 | P0 | AIRA shall never start screen or camera capture without a visible indicator. |
| UX-AV-007 | P1 | The avatar shall provide Orb, Mini and Companion sizes. |
| UX-AV-008 | P1 | AIRA shall avoid active full-screen content according to user settings. |
| UX-AV-009 | P1 | The user shall be able to reduce or disable ambient motion. |
| UX-AV-010 | P2 | Optional edge walking may occur only under idle-safe conditions. |

### 31.2 Command Center

| ID | Priority | Requirement |
| --- | --- | --- |
| UX-CC-001 | P0 | The Command Center shall provide Home, Today, Projects, Learning, Roadmap, Memory, Insights and Conversation routes. |
| UX-CC-002 | P0 | Home shall display a credible resume point and next action when available. |
| UX-CC-003 | P0 | All primary routes shall be keyboard accessible. |
| UX-CC-004 | P0 | A global command field shall support questions, navigation and commands. |
| UX-CC-005 | P0 | Listening, screen and camera states shall remain visible throughout the app. |
| UX-CC-006 | P0 | Empty, loading, error and offline states shall exist for every core route. |
| UX-CC-007 | P1 | The AIRA presence panel shall be collapsible. |
| UX-CC-008 | P1 | The last relevant route may be restored without obscuring today's resume point. |
| UX-CC-009 | P1 | Charts shall expose exact values and data-quality information. |
| UX-CC-010 | P1 | Layout shall support 1024 px width through 1440p and common Windows scaling modes. |

### 31.3 Trust and permissions

| ID | Priority | Requirement |
| --- | --- | --- |
| UX-TR-001 | P0 | The user shall be able to inspect what AIRA remembers. |
| UX-TR-002 | P0 | Memories shall be editable and forgettable. |
| UX-TR-003 | P0 | Sensitive actions shall show exact target and effect before confirmation. |
| UX-TR-004 | P0 | Screen and camera captures shall show retention state. |
| UX-TR-005 | P0 | A privacy pause control shall be accessible from desktop and dashboard. |
| UX-TR-006 | P0 | Errors shall state whether any data or files changed. |
| UX-TR-007 | P1 | Users shall be able to view an activity history of sensitive access. |

### 31.4 Learning and project continuity

| ID | Priority | Requirement |
| --- | --- | --- |
| UX-PC-001 | P0 | Every active project shall support a structured checkpoint. |
| UX-PC-002 | P0 | Resume UI shall show completed work, stopping point, next action and blocker. |
| UX-LN-001 | P0 | Learning analytics shall separate video, notes and practice evidence. |
| UX-LN-002 | P0 | Tracking data shall be correctable by the user. |
| UX-LN-003 | P0 | Watch time shall not be presented as proof of understanding. |
| UX-LN-004 | P1 | Roadmap readiness shall explain its contributing factors. |

---

## 32. Performance UX Budget

### 32.1 Target behavior on the specified laptop

- Desktop avatar memory target: under 250 MB in typical idle use.
- Desktop avatar CPU target: under 2% average while idle.
- Idle GPU use: minimal; animation may reduce to 15–24 FPS.
- Dashboard first meaningful view: under 2 seconds after warm launch.
- Route transition response: visible within 150 ms.
- Avatar invocation feedback: under 300 ms.
- Dashboard scrolling: perceived smoothness near 60 FPS when no model is generating.
- Voice start indicator: immediate, even if transcription model takes longer to initialize.

These are experience targets, not guarantees. Performance tests must occur on the actual target device.

### 32.2 Resource-aware UI behavior

The user should never need to understand VRAM allocation. If resources are constrained, AIRA displays plain language such as `Using efficient visual mode while another intensive app is running.`

---

## 33. Analytics and UX Success Metrics

All analytics should be local by default.

### 33.1 Core usability metrics

- Time from invocation to visible feedback.
- Time from `Resume` request to opened working context.
- Percentage of sessions ending with a saved checkpoint.
- Percentage of suggested checkpoints corrected by user.
- Screen-capture cancellation and deletion rate.
- Proactive suggestion dismissal rate.
- Frequency of avatar hide or disable actions.
- Dashboard weekly return rate.
- Rate of correction for course tracking data.
- Command success/failure and recovery rate.

### 33.2 Experience quality targets

- At least 90% of basic invocations show correct state feedback.
- At least 80% of project resume attempts surface the expected checkpoint after sufficient data exists.
- 100% of screen/camera access events have visible indicators and log entries.
- 100% of destructive actions require explicit confirmation.
- No core action requires mouse input exclusively.
- User can hide AIRA within two interactions from any desktop state.

---

## 34. Usability Test Plan

### 34.1 Test participants

Initial testing may use the owner plus three to five students or early-career developers with Windows laptops. Test both technical and nontechnical familiarity.

### 34.2 Critical test tasks

1. Find and move AIRA without explanation.
2. Ask a voice question and interrupt the answer.
3. Ask AIRA to explain the active screen.
4. Verify what image was captured and delete it.
5. Create a project and save a checkpoint.
6. Return later and resume from the checkpoint.
7. Add a course and correct a lesson record.
8. Understand the difference between video, notes and practice progress.
9. Find and delete a stored memory.
10. Activate privacy pause.
11. Hide AIRA and restore her from the tray.
12. Complete the same tasks using keyboard only.

### 34.3 Observed failure signals

- User mistakes animation for screen monitoring.
- User cannot tell whether the microphone is active.
- Avatar obstructs work or pointer control.
- User treats readiness score as hiring probability.
- User cannot locate the last checkpoint.
- User believes watch time means understanding.
- User cannot explain where a memory came from.
- User fears that closing the dashboard exits AIRA.

Any repeated failure in these areas is a release blocker for the affected feature.

---

## 35. Accessibility and Privacy Acceptance Criteria

Before version 1 release:

1. Every dashboard control is reachable and operable by keyboard.
2. State changes are announced to assistive technology without excessive repetition.
3. Listening, speaking and capture states have text and icon indicators, not color alone.
4. Reduced-motion mode removes walking, parallax and nonessential orbital motion.
5. High-contrast mode retains complete functionality.
6. Avatar overlay does not steal text focus from other applications.
7. Screen capture never occurs without visible feedback.
8. Camera use always displays preview and active indicator.
9. Every temporary capture exposes retention status.
10. The user can stop voice output immediately.
11. The user can pause all sensing through one control.
12. Sensitive actions identify the exact target before execution.

---

## 36. Release Scope

### 36.1 UI prototype milestone

- Visual tokens and core components.
- Static avatar concept and five key states.
- Click-through Desktop Companion flows.
- Click-through Command Center Home, Projects and Learning views.
- Privacy indicators.
- Responsive 1080p layout.

### 36.2 MVP UI

- L1 avatar with Idle, Listening, Thinking, Speaking, Success, Error and Privacy states.
- Draggable transparent desktop surface.
- Quick action menu.
- Speech strip.
- Command Center shell.
- Home, Projects, basic Learning, Conversation and Settings.
- Project checkpoint/resume flow.
- Single-snapshot screen flow.
- Keyboard navigation and reduced motion.

### 36.3 Version 1 UI

- Today and Focus experiences.
- Full Learning and Roadmap workspaces.
- Memory inspector.
- Insights and weekly review.
- Expanded expression system.
- Context panel and improved source transparency.
- Multi-monitor and scaling polish.

### 36.4 Later enhancements

- Additional avatar skins.
- Higher-quality 2D rig.
- More expressive gestures.
- Optional theme variants.
- Additional dashboard widgets.
- User-authored avatar behaviors under strict resource and distraction limits.

---

## 37. Design Deliverables Required Before Development Freeze

- Brand moodboard.
- Canonical avatar front view, profile and silhouette.
- Avatar state sheet.
- Desktop overlay wireframes.
- Dashboard sitemap.
- 1080p high-fidelity Home screen.
- Project detail and resume flow.
- Learning overview and course detail.
- Screen-capture permission and result flow.
- Memory inspector.
- Settings/privacy screens.
- Component library with tokens.
- Motion specification or short prototypes.
- Keyboard and accessibility annotations.
- Empty, loading, offline and error states.

---

## 38. Locked Decisions and Open Design Questions

### 38.1 Locked

- Female AIRA identity.
- Stylized mature 2D holographic avatar.
- Dark navy/black command-center theme.
- Cyan for interaction, violet for identity/memory.
- Desktop companion plus full Command Center.
- Avatar stays calm and edge-oriented by default.
- Walking is optional and limited to idle-safe conditions.
- Dashboard opens only when requested or explicitly selected.
- Screen and camera understanding are on-demand.
- Home prioritizes Resume Point and Today's Mission.
- Learning analytics separate video, notes and practice.
- Memory and sensing remain visible and controllable.
- Balanced performance preset is the default for the target laptop.

### 38.2 Open for later visual exploration

- Exact hairstyle and clothing silhouette.
- Bust-only fade versus full mini-body in default desktop mode.
- Curved quick menu versus compact vertical pill.
- Canonical voice selection.
- Exact logo mark and AIRA glyph.
- Whether the Command Center portrait uses the same rig or a higher-resolution asset.

These questions may change visual execution without altering the locked experience architecture.

---

## 39. Definition of Done for the UI/UX Vision

The AIRA UI/UX vision is successfully implemented when:

1. AIRA can remain visible on the desktop for hours without obstructing normal work.
2. The user can invoke, stop, move, hide and privacy-pause her without opening settings.
3. Listening, thinking, speaking, working and sensing are immediately distinguishable.
4. Asking “What is this?” creates one transparent, permission-aware screen interaction.
5. The Command Center feels like a deeper form of the same companion.
6. Home clearly shows the last meaningful stopping point and the next useful action.
7. Projects preserve reliable checkpoints.
8. Learning views show video, notes and practice as separate evidence.
9. Roadmap insights explain readiness rather than presenting a magical score.
10. The user can inspect, correct and delete memories and tracking data.
11. The experience remains smooth on the specified ASUS TUF A15 in Balanced mode.
12. Reduced-motion, keyboard and text-only experiences preserve all core functions.
13. AIRA feels emotionally expressive without claiming human-level emotion detection.
14. Visual polish never hides system state, evidence, privacy or control.

When these conditions are met, AIRA should feel less like an app waiting to be opened and more like a trusted desktop companion who is quietly available, visibly accountable and genuinely useful.

---

## 40. Approval Record

**Approved concept:** Futuristic soft-JARVIS command center combined with a living desktop companion  
**Avatar direction:** Mature stylized 2D female holographic companion  
**Primary desktop behavior:** Quiet edge presence; comes alive when called; optional limited walking and expressions  
**Primary dashboard direction:** Dark cinematic Command Center with project continuity, daily mission and learning/placement analytics  
**Privacy direction:** Explicit, visible and on-demand sensing only  
**Performance direction:** Lightweight desktop layer, one intensive AI workload at a time, graceful visual reduction under load  
**Baseline status:** Locked for wireframing and visual design  

