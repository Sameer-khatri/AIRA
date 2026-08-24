from app.core.brain.personality import (
    AIRA_IDENTITY_RULES,
    AIRA_PERSONALITY_PROMPT,
    AIRA_RESPONSE_STYLE_RULES,
    AIRA_CAPABILITY_RULES,
)

def build_chat_messages(
    user_message: str,
    conversation_history: list,
    intent: str,
    privacy_instruction: str
) -> list[dict]:
    """Build the full prompt messages array for Ollama."""
    
    system_content = f"""{AIRA_IDENTITY_RULES}

## Personality
{AIRA_PERSONALITY_PROMPT}

## Response Style Rules
{AIRA_RESPONSE_STYLE_RULES}

## Capabilities
{AIRA_CAPABILITY_RULES}

## Context for This Message
Detected User Intent: {intent}
Privacy Note: {privacy_instruction if privacy_instruction else "None — respond normally."}
"""

    # Keep at most 10 recent messages to avoid bloating context
    recent_history = conversation_history[-10:] if len(conversation_history) > 10 else conversation_history
    
    # Map to dicts
    history_dicts = [{"role": msg.role, "content": msg.content} for msg in recent_history]
    
    messages = [{"role": "system", "content": system_content}]
    messages.extend(history_dicts)
    messages.append({"role": "user", "content": user_message})
    
    return messages
