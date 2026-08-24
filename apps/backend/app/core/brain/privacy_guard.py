from typing import Optional

def evaluate_privacy(intent: str, camera_context: Optional[dict] = None, screen_context: Optional[dict] = None) -> dict:
    """Evaluate privacy state based on intent and context."""

    if intent == "camera_request" and camera_context is None:
        return {
            "privacy_state": "camera_not_active",
            "privacy_instruction": (
                "Camera is not active yet. Do not claim visual access. "
                "Tell the user warmly: camera support is a planned feature and will require "
                "explicit visible permission before it activates. "
                "When implemented, if another person is detected, private responses will automatically pause. "
                "For now, offer to help with anything that does not require visual access."
            )
        }

    if camera_context and camera_context.get("other_person_detected") is True:
        return {
            "privacy_state": "other_person_possible",
            "privacy_instruction": (
                "Another person may be present near the user. "
                "Avoid revealing private project details, personal information, or sensitive context "
                "until the owner explicitly confirms they are alone. "
                "Keep responses general and safe."
            )
        }

    if intent == "screen_help" and screen_context is None:
        return {
            "privacy_state": "feature_not_available",
            "privacy_instruction": (
                "Screen sense is not active yet. Do not claim screen visibility. "
                "Tell the user warmly: screen reading is a planned feature and will require "
                "explicit permission before activating. "
                "For now, ask the user to describe what they see and offer to help from there."
            )
        }

    if intent == "privacy_question":
        return {
            "privacy_state": "privacy_sensitive",
            "privacy_instruction": (
                "Respond with privacy-first behavior. "
                "Explain that AIRA runs fully locally — no data leaves the user's machine. "
                "Camera and screen features, when added, will require explicit opt-in permission. "
                "Reassure the user that privacy is a core design principle."
            )
        }

    return {
        "privacy_state": "normal",
        "privacy_instruction": ""
    }
