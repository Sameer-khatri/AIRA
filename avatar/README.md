# avatar/

The visual presence of AIRA.

## Structure

```
avatar/
├── assets/           ← Sprite sheets, images, art files
├── states/           ← State definitions and transitions
└── animations/       ← Animation data and controllers
```

## What goes here

- The assets and logic that define how the avatar looks and animates.
- The state machine for the avatar (idle -> listening -> thinking -> speaking).

## What does NOT go here

- The actual UI window code for the desktop (that lives in `apps/desktop/`).
- The logic deciding *when* to change state (that lives in `core/brain/` and `core/avatar-manager/` in the backend).
