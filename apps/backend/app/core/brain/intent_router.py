import re


def _normalize_message(message: str) -> str:
    """Normalize case, apostrophes, punctuation, and repeated whitespace."""
    normalized = message.casefold().replace("’", "'")
    normalized = re.sub(r"'", "", normalized)
    normalized = re.sub(r"[^\w\s]", " ", normalized)
    return " ".join(normalized.split())


def _matches_project_phrase(message: str, phrase: str) -> bool:
    """Match a project phrase exactly or as the beginning of a qualified question."""
    return message == phrase or message.startswith(f"{phrase} ")


def detect_intent(message: str) -> str:
    """Detect intents with deterministic, rule-based matching."""
    msg_lower = _normalize_message(message)

    project_phrases = [
        "where did i leave off",
        "where did we leave off",
        "continue project",
        "resume my work",
        "resume the project",
        "resume my project",
        "what was i doing",
        "what was i working on",
        "what should i do next",
        "what should i work on next",
        "what should we work on next",
        "what is the next step",
        "lets move to the next step",
        "continue from last time",
        "continue from where we stopped",
        "current state of aira",
        "what is the current state of aira",
        "status of the aira project",
        "what is the status of the aira project",
        "give me aira project status",
        "what tasks are pending",
        "tasks are pending",
        "pending tasks",
        "what are my pending tasks",
        "what was the last checkpoint",
        "what are we currently working on",
    ]
    if any(_matches_project_phrase(msg_lower, phrase) for phrase in project_phrases):
        return "project_question"
        
    checkpoint_keywords = [
        "save checkpoint", "remember this progress", "save my progress", "note this as progress"
    ]
    if any(k in msg_lower for k in checkpoint_keywords):
        return "save_checkpoint"
        
    learning_keywords = [
        "completed video", "completed videos", "watched video", "watched videos",
        "finished lecture", "i studied", "completed notes"
    ]
    if any(k in msg_lower for k in learning_keywords):
        return "learning_update"
        
    roadmap_keywords = [
        "what should i study", "roadmap", "placement", "next topic",
        "today study", "interview preparation"
    ]
    if any(k in msg_lower for k in roadmap_keywords):
        return "roadmap_question"
        
    screen_keywords = [
        "look at my screen", "see my screen", "what is this on screen",
        "read my screen", "screen"
    ]
    if any(k in msg_lower for k in screen_keywords):
        return "screen_help"
        
    camera_keywords = [
        "see me", "camera", "look at me", "am i visible", "detect person"
    ]
    if any(k in msg_lower for k in camera_keywords):
        return "camera_request"
        
    privacy_keywords = [
        "privacy", "who can see", "is this private", "other person", "someone else"
    ]
    if any(k in msg_lower for k in privacy_keywords):
        return "privacy_question"
        
    settings_keywords = [
        "change model", "settings", "local mode", "switch model"
    ]
    if any(k in msg_lower for k in settings_keywords):
        return "settings_request"
        
    relationship_keywords = [
        "are you with me", "do you care", "stay with me", "you are mine",
        "be my partner", "are you loyal", "support me"
    ]
    if any(k in msg_lower for k in relationship_keywords):
        return "relationship_companion_chat"
        
    return "general_chat"
