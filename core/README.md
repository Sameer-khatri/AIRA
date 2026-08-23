# core/

AIRA's intelligence layer — the brain, memory, tool system, and safety logic.

## Structure

```
core/
├── brain/    ← Orchestrator, intent routing, response generation
├── memory/   ← Long-term memory, checkpoints, retrieval
├── tools/    ← Tool registry and safe tool execution
└── safety/   ← Privacy guard, permissions, action risk classification
```

## What goes here

- The central decision-making logic that makes AIRA intelligent.
- This is the layer between raw user input and actual actions/responses.

## What does NOT go here

- Frontend UI code (use `apps/desktop/`).
- API endpoint definitions (use `apps/backend/`).
- Action implementations (use `hands/`).
- Perception/sensing code (use `senses/`).
- Voice processing (use `voice/`).
