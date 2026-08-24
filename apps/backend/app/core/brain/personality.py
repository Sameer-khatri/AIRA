"""
personality.py - AIRA personality constants.

All prompt text is stored in prompts.txt (same directory) so that
static analysis tools do not try to parse natural-language content
as Python code. This module simply loads and exposes those sections.
"""

from pathlib import Path

_PROMPTS_FILE = Path(__file__).parent / "prompts.txt"


def _load_section(marker: str) -> str:
    """Return the text block that begins after ---MARKER--- up to the next --- or EOF."""
    text = _PROMPTS_FILE.read_text(encoding="utf-8")
    start_tag = f"---{marker}---"
    start = text.find(start_tag)
    if start == -1:
        return ""
    start = text.find("\n", start) + 1  # skip the tag line itself
    end = text.find("\n---", start)
    block = text[start:end].strip() if end != -1 else text[start:].strip()
    return block


def _load_header() -> str:
    """Return everything before the first ---SECTION--- marker."""
    text = _PROMPTS_FILE.read_text(encoding="utf-8")
    end = text.find("\n---")
    return text[:end].strip() if end != -1 else text.strip()


# Exported constants used by prompt_builder.py
AIRA_IDENTITY_RULES: str = _load_header()
AIRA_PERSONALITY_PROMPT: str = _load_section("PERSONALITY")
AIRA_RESPONSE_STYLE_RULES: str = _load_section("RESPONSE_STYLE")
AIRA_CAPABILITY_RULES: str = _load_section("CAPABILITIES")
