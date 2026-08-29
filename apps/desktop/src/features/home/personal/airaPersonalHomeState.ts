import type { AiraHomeSemanticState } from "../../aira-character/airaSemanticMapping";
import type { PersonalHomePhase, PersonalHomeResearchState, PersonalHomeRuntimeStatus } from "./airaPersonalHomeTypes";
export function getPersonalHomeSemanticState(phase: PersonalHomePhase, research: PersonalHomeResearchState): AiraHomeSemanticState { if (phase === "return_greeting") return research === "running" ? "thinking" : "return-greeting"; return phase; }
export function getPersonalHomeStatus(phase: PersonalHomePhase, research: PersonalHomeResearchState): PersonalHomeRuntimeStatus {
  if (phase === "offline") return { label: "Local · Offline", tone: "offline" };
  if (phase === "error") return { label: "Local · Needs attention", tone: "error" };
  if (phase === "thinking" || phase === "responding" || research === "running") return { label: "Local · Working", tone: "working" };
  return { label: "Local · Ready", tone: "ready" };
}
