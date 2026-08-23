# hands/

Actions AIRA can perform on your computer.

## Structure

```
hands/
├── local-actions/    ← Opening apps, files, URLs
├── app-control/      ← Application-specific interactions
├── file-system/      ← File and folder operations
└── automation/       ← Scripted workflows and macros
```

## What goes here

- Tool implementations that execute actual side-effects on the OS.
- Wrappers around native OS commands (opening Explorer, creating files, etc.).
- Safe, logged actions that respect the `core/safety/` rules.

## What does NOT go here

- Decision making logic (use `core/brain/`).
- Safey checks (these happen before calling `hands/`).
- UI code (use `apps/desktop/`).
