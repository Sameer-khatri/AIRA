import { FlaskConical } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { AiraRuntimeMetrics } from "../../aira-character/AiraCharacterRuntime";
import { clearStoredAiraOutfit, DEFAULT_AIRA_OUTFIT, persistAiraOutfit, readStoredAiraOutfit } from "../../aira-character/airaAppearance";
import { loadAiraCharacterRegistry } from "../../aira-character/airaCharacterRegistry";
import type { AiraCharacterRegistryData, AiraOutfitId } from "../../aira-character/airaCharacterTypes";
import AiraPersonalHomeControls from "./AiraPersonalHomeControls";
import AiraPersonalHomeScene from "../../home/personal/AiraPersonalHomeScene";
import { buildMockHomeReply } from "./airaPersonalHomeState";
import type { AiraHomeTurn, PersonalHomeMotion, PersonalHomePhase, PersonalHomeResearchState, PersonalHomeSceneActions, PersonalHomeSpeedProfile, PersonalHomeViewport } from "../../home/personal/airaPersonalHomeTypes";
import "../../home/personal/aira-personal-home.css";

const SAMPLE_USER_TEXT = "Can you explain what we are building?";
const FLOW_TIMING: Record<PersonalHomeSpeedProfile, { thinking: number; respondingMin: number; respondingMax: number; charactersPerSecond: number }> = {
  normal: { thinking: 2000, respondingMin: 2200, respondingMax: 6000, charactersPerSecond: 40 },
  fast: { thinking: 350, respondingMin: 550, respondingMax: 900, charactersPerSecond: 400 },
};

function makeTurn(userText: string, status: AiraHomeTurn["status"] = "submitted"): AiraHomeTurn {
  return { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, userText, assistantText: buildMockHomeReply(userText), status, createdAt: new Date().toISOString() };
}

export default function AiraPersonalHomeLab() {
  const [registry, setRegistry] = useState<AiraCharacterRegistryData | null>(null);
  const [manifestError, setManifestError] = useState<string | null>(null);
  const [phase, setPhase] = useState<PersonalHomePhase>("return_greeting");
  const [research, setResearch] = useState<PersonalHomeResearchState>("ready");
  const [outfit, setOutfitState] = useState<AiraOutfitId>(() => readStoredAiraOutfit());
  const [composerValue, setComposerValueState] = useState("");
  const [turns, setTurns] = useState<AiraHomeTurn[]>([]);
  const [activeTurn, setActiveTurnState] = useState<AiraHomeTurn | null>(null);
  const [revealedCharacterCount, setRevealedCharacterCount] = useState(0);
  const [motion, setMotion] = useState<PersonalHomeMotion>("system");
  const [speedProfile, setSpeedProfile] = useState<PersonalHomeSpeedProfile>("normal");
  const [viewport, setViewport] = useState<PersonalHomeViewport>("responsive");
  const [systemReduced, setSystemReduced] = useState(() => matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [controlsOpen, setControlsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [forceMissingTarget, setForceMissingTarget] = useState(false);
  const [metrics, setMetrics] = useState<AiraRuntimeMetrics | null>(null);
  const [lastFailure, setLastFailure] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const flowIdRef = useRef(0);
  const flowCleanupRef = useRef<Array<() => void>>([]);
  const blurTimerRef = useRef<number | null>(null);
  const noticeTimerRef = useRef<number | null>(null);
  const draftRef = useRef(composerValue);
  const activeTurnRef = useRef(activeTurn);

  const setComposerValue = useCallback((value: string) => { draftRef.current = value; setComposerValueState(value); }, []);
  const setActiveTurn = useCallback((value: AiraHomeTurn | null | ((current: AiraHomeTurn | null) => AiraHomeTurn | null)) => {
    const next = typeof value === "function" ? value(activeTurnRef.current) : value;
    activeTurnRef.current = next;
    setActiveTurnState(next);
    setTurns((current) => {
      if (!next) return [];
      const index = current.findIndex((turn) => turn.id === next.id);
      return index < 0 ? [...current, next] : current.map((turn) => turn.id === next.id ? next : turn);
    });
  }, []);

  useEffect(() => { loadAiraCharacterRegistry().then(setRegistry).catch((error: unknown) => setManifestError(error instanceof Error ? error.message : String(error))); }, []);
  useEffect(() => { const media = matchMedia("(prefers-reduced-motion: reduce)"); const update = () => setSystemReduced(media.matches); media.addEventListener("change", update); return () => media.removeEventListener("change", update); }, []);

  const clearBlurTimer = useCallback(() => { if (blurTimerRef.current !== null) window.clearTimeout(blurTimerRef.current); blurTimerRef.current = null; }, []);
  const cancelFlow = useCallback(() => { flowIdRef.current += 1; flowCleanupRef.current.forEach((cleanup) => cleanup()); flowCleanupRef.current = []; }, []);
  useEffect(() => () => { cancelFlow(); clearBlurTimer(); if (noticeTimerRef.current !== null) window.clearTimeout(noticeTimerRef.current); }, [cancelFlow, clearBlurTimer]);

  const showNotice = useCallback((message: string) => { if (noticeTimerRef.current !== null) window.clearTimeout(noticeTimerRef.current); setNotice(message); noticeTimerRef.current = window.setTimeout(() => setNotice(null), 2400); }, []);
  const setOutfit = useCallback((value: AiraOutfitId) => { setOutfitState(value); persistAiraOutfit(value); }, []);
  const reducedMotion = motion === "reduce" || (motion === "system" && systemReduced);
  const processing = activeTurn?.status === "thinking" || activeTurn?.status === "responding";

  const startResponseFlow = useCallback((submittedText: string) => {
    cancelFlow();
    clearBlurTimer();
    const requestId = flowIdRef.current;
    const timing = FLOW_TIMING[speedProfile];
    const turn = makeTurn(submittedText, "thinking");
    setActiveTurn(turn);
    setRevealedCharacterCount(0);
    setPhase("thinking");
    const thinkingTimer = window.setTimeout(() => {
      if (requestId !== flowIdRef.current) return;
      setPhase("responding");
      setActiveTurn((current) => current?.id === turn.id ? { ...current, status: "responding" } : current);
      const responseDuration = Math.min(timing.respondingMax, Math.max(timing.respondingMin, Math.ceil(turn.assistantText.length / timing.charactersPerSecond * 1000)));
      const startedAt = performance.now();
      if (reducedMotion) setRevealedCharacterCount(turn.assistantText.length);
      const revealInterval = window.setInterval(() => {
        if (requestId !== flowIdRef.current) return;
        const progress = Math.min(1, (performance.now() - startedAt) / responseDuration);
        if (!reducedMotion) setRevealedCharacterCount(Math.ceil(turn.assistantText.length * progress));
        if (progress < 1) return;
        window.clearInterval(revealInterval);
        if (requestId !== flowIdRef.current) return;
        setRevealedCharacterCount(turn.assistantText.length);
        setActiveTurn((current) => current?.id === turn.id ? { ...current, status: "complete" } : current);
        setPhase("complete");
      }, 40);
      flowCleanupRef.current.push(() => window.clearInterval(revealInterval));
    }, timing.thinking);
    flowCleanupRef.current.push(() => window.clearTimeout(thinkingTimer));
  }, [cancelFlow, clearBlurTimer, reducedMotion, setActiveTurn, speedProfile]);

  const submitComposer = useCallback(() => {
    const submittedText = draftRef.current.trim();
    const current = activeTurnRef.current;
    const isProcessing = current?.status === "thinking" || current?.status === "responding";
    if (!submittedText || phase === "offline" || isProcessing) return;
    startResponseFlow(submittedText);
    setComposerValue("");
  }, [phase, setComposerValue, startResponseFlow]);

  const handleComposerFocus = useCallback(() => { clearBlurTimer(); const current = activeTurnRef.current; if (current?.status === "thinking" || current?.status === "responding") return; cancelFlow(); setPhase("listening"); }, [cancelFlow, clearBlurTimer]);
  const handleComposerChange = useCallback((value: string) => { setComposerValue(value); const current = activeTurnRef.current; if (current?.status === "thinking" || current?.status === "responding") return; clearBlurTimer(); setPhase("listening"); }, [clearBlurTimer, setComposerValue]);
  const handleComposerBlur = useCallback(() => {
    clearBlurTimer();
    const current = activeTurnRef.current;
    if (draftRef.current.trim() || current?.status === "thinking" || current?.status === "responding") return;
    blurTimerRef.current = window.setTimeout(() => { const latest = activeTurnRef.current; if (!draftRef.current.trim() && latest?.status !== "thinking" && latest?.status !== "responding") setPhase("calm"); }, 320);
  }, [clearBlurTimer]);

  const ensureSampleTurn = useCallback((status: AiraHomeTurn["status"]) => { const current = activeTurnRef.current ?? makeTurn(SAMPLE_USER_TEXT, status); const next = { ...current, status }; setActiveTurn(next); return next; }, [setActiveTurn]);
  const selectManualPhase = useCallback((value: PersonalHomePhase) => {
    cancelFlow(); clearBlurTimer();
    if (value === "thinking") { ensureSampleTurn("thinking"); setRevealedCharacterCount(0); }
    else if (value === "responding") { const turn = ensureSampleTurn("responding"); setRevealedCharacterCount(turn.assistantText.length); }
    else if (value === "complete") { const turn = ensureSampleTurn("complete"); setRevealedCharacterCount(turn.assistantText.length); }
    else if (value === "error" && activeTurnRef.current) setActiveTurn((current) => current ? { ...current, status: "error" } : current);
    setPhase(value);
  }, [cancelFlow, clearBlurTimer, ensureSampleTurn, setActiveTurn]);

  const rapidSwitch = useCallback(() => {
    cancelFlow();
    const requestId = flowIdRef.current;
    const turn = ensureSampleTurn("thinking");
    setRevealedCharacterCount(0);
    const rapidStates: PersonalHomePhase[] = ["listening", "thinking", "responding", "complete"];
    rapidStates.forEach((nextPhase, index) => {
      const timer = window.setTimeout(() => { if (requestId !== flowIdRef.current) return; setPhase(nextPhase); if (nextPhase === "responding" || nextPhase === "complete") setRevealedCharacterCount(turn.assistantText.length); if (nextPhase !== "listening") setActiveTurn((current) => current ? { ...current, status: nextPhase as AiraHomeTurn["status"] } : current); }, index * 90);
      flowCleanupRef.current.push(() => window.clearTimeout(timer));
    });
  }, [cancelFlow, ensureSampleTurn, setActiveTurn]);

  const seedHistory = useCallback(() => {
    cancelFlow(); clearBlurTimer();
    const samples = [
      "What are we building?",
      "What should I focus on first?",
      "Keep the interface calm and local-first.",
      "How does the character react while thinking?",
      "Summarize the approved direction.",
    ].map((text, index) => ({ ...makeTurn(text, "complete"), id: `history-${Date.now()}-${index}` }));
    const latest = samples[samples.length - 1];
    setTurns(samples); activeTurnRef.current = latest; setActiveTurnState(latest);
    setRevealedCharacterCount(latest.assistantText.length); setPhase("complete");
  }, [cancelFlow, clearBlurTimer]);

  const reset = useCallback(() => { cancelFlow(); clearBlurTimer(); setPhase("calm"); setOutfit(DEFAULT_AIRA_OUTFIT); setComposerValue(""); setActiveTurn(null); setRevealedCharacterCount(0); setMotion("system"); setSpeedProfile("normal"); setViewport("responsive"); setForceMissingTarget(false); setLastFailure(null); setNotice(null); }, [cancelFlow, clearBlurTimer, setActiveTurn, setComposerValue, setOutfit]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => { const target = event.target; if (event.key === "Escape") { setControlsOpen(false); return; } if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement || target instanceof HTMLButtonElement || (target instanceof HTMLElement && target.isContentEditable)) return; if (event.key.toLowerCase() === "d") setControlsOpen((current) => !current); };
    window.addEventListener("keydown", onKeyDown); return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const actions = useMemo<PersonalHomeSceneActions>(() => ({
    onPrimaryAction: () => { cancelFlow(); setPhase("calm"); showNotice(research === "running" ? "Opening the current research progress." : "Opening the completed research."); },
    onSecondaryAction: () => { cancelFlow(); setPhase("calm"); showNotice(research === "running" ? "AIRA will keep working." : "Saved for later."); },
    onQuietAction: () => { cancelFlow(); setPhase("calm"); showNotice(research === "running" ? "AIRA will let you know when it is ready." : "AIRA is preparing the summary."); },
    onOpenResearch: () => showNotice("Research details would open here in the production experience."),
    onOutfitChange: setOutfit,
    onComposerChange: handleComposerChange,
    onComposerFocus: handleComposerFocus,
    onComposerBlur: handleComposerBlur,
    onComposerSubmit: submitComposer,
    onReturnToCalm: () => selectManualPhase("calm"),
    onRetry: () => startResponseFlow(activeTurnRef.current?.userText ?? SAMPLE_USER_TEXT),
    onSettingsOpenChange: setSettingsOpen,
  }), [cancelFlow, handleComposerBlur, handleComposerChange, handleComposerFocus, research, selectManualPhase, setOutfit, showNotice, startResponseFlow, submitComposer]);

  if (manifestError) return <section className="aira-personal-lab-state"><strong>Canonical character manifest failed validation.</strong><code>{manifestError}</code></section>;
  if (!registry) return <section className="aira-personal-lab-state">Validating AIRA’s canonical wardrobe…</section>;
  const revealedAssistantText = activeTurn?.assistantText.slice(0, revealedCharacterCount) ?? "";

  return (
    <section className="aira-personal-home-lab" data-controls-open={controlsOpen} data-viewport={viewport}>
      <div className="aira-personal-preview">
        <AiraPersonalHomeScene registry={registry} phase={phase} research={research} outfit={outfit} composerValue={composerValue} turns={turns} activeTurnId={activeTurn?.id ?? null} revealedAssistantText={revealedAssistantText} processing={processing} reducedMotion={reducedMotion} forceMissingTarget={forceMissingTarget} notice={notice} actions={actions} onRuntimeMetrics={setMetrics} onAssetFailure={setLastFailure} />
        {!controlsOpen && <button type="button" className="aira-personal-lab-toggle" onClick={() => setControlsOpen(true)} title="Open developer controls (D)"><FlaskConical size={15} />LAB</button>}
      </div>
      <AiraPersonalHomeControls open={controlsOpen} phase={phase} research={research} outfit={outfit} motion={motion} speedProfile={speedProfile} viewport={viewport} forceMissingTarget={forceMissingTarget} metrics={metrics} lastFailure={lastFailure} onClose={() => setControlsOpen(false)} onPhase={selectManualPhase} onResearch={setResearch} onOutfit={setOutfit} onMotion={setMotion} onSpeedProfile={setSpeedProfile} onViewport={setViewport} onReturnReady={() => { cancelFlow(); setResearch("ready"); setPhase("return_greeting"); }} onReturnRunning={() => { cancelFlow(); setResearch("running"); setPhase("return_greeting"); }} onPlaySequence={() => startResponseFlow(draftRef.current.trim() || SAMPLE_USER_TEXT)} onSeedHistory={seedHistory} onRapidSwitch={rapidSwitch} onMissingTest={() => setForceMissingTarget((value) => !value)} onReset={reset} onClearAppearance={() => { clearStoredAiraOutfit(); setOutfitState(DEFAULT_AIRA_OUTFIT); showNotice("Saved appearance cleared."); }} />
      <span className="aira-personal-dev-state" aria-hidden="true">settings:{settingsOpen ? "open" : "closed"}</span>
    </section>
  );
}
