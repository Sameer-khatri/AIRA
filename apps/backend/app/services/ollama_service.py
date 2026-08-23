"""
Ollama service — wraps the ollama Python client.

Responsibilities:
- Check if the Ollama daemon is reachable.
- List available models.
- Send a chat request and return the reply text.
- Expose a clean status dict for the /api/models/status endpoint.
"""

import ollama
from app.config import OLLAMA_BASE_URL, DEFAULT_MODEL


def _client() -> ollama.Client:
    """Return a configured Ollama client pointed at the local daemon."""
    return ollama.Client(host=OLLAMA_BASE_URL)


def get_status() -> dict:
    """
    Return Ollama daemon status and available model list.
    Never raises — always returns a safe dict.
    """
    try:
        client = _client()
        models_response = client.list()
        # models_response.models is a list of Model objects
        model_names = [m.model for m in models_response.models]
        default_available = DEFAULT_MODEL in model_names

        return {
            "ollama": "online",
            "default_model": DEFAULT_MODEL,
            "default_model_available": default_available,
            "available_models": model_names,
            "base_url": OLLAMA_BASE_URL,
        }
    except Exception as exc:
        return {
            "ollama": "offline",
            "default_model": DEFAULT_MODEL,
            "default_model_available": False,
            "available_models": [],
            "base_url": OLLAMA_BASE_URL,
            "error": str(exc),
        }


def chat(messages: list[dict]) -> str:
    """
    Send a list of {role, content} messages to Ollama and return the reply.

    Raises:
        RuntimeError — if Ollama is unreachable or the request fails.
    """
    client = _client()
    response = client.chat(model=DEFAULT_MODEL, messages=messages)
    return response.message.content
