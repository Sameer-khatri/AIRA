# senses/

Inputs AIRA can perceive from your computer.

## Structure

```
senses/
├── screen/           ← On-demand screenshot and OCR
├── camera/           ← On-demand webcam capture
├── microphone/       ← Audio input management (raw capture)
└── browser/          ← Browser context from extension
```

## What goes here

- Code that gathers data from the outside world or the OS.
- Wrappers for Windows capture APIs, OpenCV, and audio devices.
- OCR execution (Tesseract wrappers).

## What does NOT go here

- Voice AI models like Whisper (use `voice/speech-to-text/`).
- Logic deciding *when* to sense (that's `core/brain/` and `core/safety/`).
