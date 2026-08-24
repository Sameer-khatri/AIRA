def detect_intent(message: str) -> str:
    """Rule-based intent detection for Milestone 1C."""
    msg_lower = message.lower().strip()
    
    project_keywords = [
        "where did i leave off", "where we left", "continue project", 
        "last time", "resume my work", "what was i doing"
    ]
    if any(k in msg_lower for k in project_keywords):
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
