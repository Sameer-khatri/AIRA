# packages/

Shared libraries, types, and configurations used across multiple AIRA apps.

## Structure

```
packages/
├── shared-types/   ← TypeScript type definitions shared between desktop and backend
├── ui-kit/         ← Reusable UI components and design tokens
└── config/         ← Shared configuration and constants
```

## What goes here

- Code that is used by more than one app (desktop, backend, extension).
- Shared type definitions, design tokens, and constants.

## What does NOT go here

- App-specific code (use `apps/`).
- Core AI logic (use `core/`).
- Documentation (use `docs/`).
