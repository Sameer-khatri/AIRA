# integrations/

External service connectors and models.

## Structure

```
integrations/
├── ollama/           ← Ollama LLM runtime integration
├── local-models/     ← Other local model adapters (e.g. llama.cpp)
├── calendar/         ← Calendar integration (future)
├── notes/            ← Notes app integration (future)
└── future/           ← Placeholder for future integrations
```

## What goes here

- Adapters wrapping external APIs or local model runtimes.
- Translates AIRA's internal interfaces to specific third-party interfaces.

## What does NOT go here

- Core brain logic.
- Direct UI integrations.
