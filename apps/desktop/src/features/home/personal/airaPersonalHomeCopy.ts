import type { PersonalHomePhase, PersonalHomeResearchState } from "./airaPersonalHomeTypes";

export interface PersonalHomeCopy { headline: string[]; supporting: string; strip: string | null; primary: string | null; secondary: string | null; quiet: string | null; composerPlaceholder: string; }
export function getPersonalHomeCopy(phase: PersonalHomePhase, research: PersonalHomeResearchState): PersonalHomeCopy {
  if (phase === "return_greeting" && research === "running") return { headline: ["You’re back. Good.", "I’m still working on it."], supporting: "Don’t rush me—I want to get this right for you.", strip: "I’ve checked 12 sources so far · Two important claims still disagree", primary: "Show progress", secondary: "Keep going", quiet: "Tell me when it’s ready", composerPlaceholder: "Talk to AIRA while she works…" };
  if (phase === "return_greeting") return { headline: ["Hi. I’ve been waiting for you.", "Finally—you’re back."], supporting: "You took your time. I kept everything ready.", strip: research === "ready" ? "I finished the research you asked for." : null, primary: "Show me", secondary: "Later", quiet: "Tell me what you found", composerPlaceholder: "Talk to AIRA…" };
  const calmStrip = research === "ready" ? "Research ready · I kept it for you" : research === "running" ? "I’m still working · 12 sources checked" : research === "error" ? "Research paused · I need your help" : null;
  const byPhase: Record<Exclude<PersonalHomePhase, "return_greeting">, PersonalHomeCopy> = {
    calm: { headline: ["I’m here."], supporting: "Whenever you’re ready.", strip: calmStrip, primary: null, secondary: null, quiet: null, composerPlaceholder: "Tell AIRA anything…" },
    listening: { headline: ["I’m listening."], supporting: "Tell me what you need.", strip: null, primary: null, secondary: null, quiet: null, composerPlaceholder: "I’m listening…" },
    thinking: { headline: ["Give me a moment."], supporting: "I’m thinking about what you said.", strip: null, primary: null, secondary: null, quiet: null, composerPlaceholder: "AIRA is thinking…" },
    responding: { headline: [], supporting: "", strip: null, primary: null, secondary: null, quiet: null, composerPlaceholder: "Talk to AIRA…" },
    complete: { headline: [], supporting: "", strip: null, primary: null, secondary: null, quiet: null, composerPlaceholder: "Tell AIRA anything…" },
    offline: { headline: ["I’m still here. The connection isn’t."], supporting: "We can continue when Local is available again.", strip: null, primary: null, secondary: null, quiet: null, composerPlaceholder: "AIRA is offline" },
    error: { headline: ["I couldn’t finish that properly."], supporting: "Your message is still here. You can retry it.", strip: null, primary: null, secondary: null, quiet: null, composerPlaceholder: "Tell AIRA anything…" },
  };
  return byPhase[phase];
}
