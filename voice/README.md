# voice/

The voice interaction pipeline for AIRA.

## Structure

```
voice/
├── speech-to-text/   ← Local transcription (Whisper)
├── text-to-speech/   ← Local voice output (Piper)
└── wake-word/        ← Wake phrase detection (openWakeWord)
```

## What goes here

- Wrappers for local speech AI models.
- Audio buffer management between models and the OS audio devices.

## What does NOT go here

- Raw audio capture/playback (that goes in `senses/microphone/` and `hands/audio/` if applicable, though playback might be integrated here).
- Chat model logic (use `core/brain/` and `integrations/ollama/`).
