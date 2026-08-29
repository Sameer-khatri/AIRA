import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DEFAULT_AIRA_OUTFIT, persistAiraOutfit, readStoredAiraOutfit } from "../../aira-character/airaAppearance";
import { loadAiraCharacterRegistry } from "../../aira-character/airaCharacterRegistry";
import type { AiraCharacterRegistryData, AiraOutfitId } from "../../aira-character/airaCharacterTypes";
import { sendMessage, type ChatResponse, type HealthResponse, type ModelStatus } from "../../../lib/api";
import AiraPersonalHomeScene from "./AiraPersonalHomeScene";
import type { AiraHomeTurn, PersonalHomePhase, PersonalHomeRuntimeStatus, PersonalHomeSceneActions } from "./airaPersonalHomeTypes";

interface Props { health: HealthResponse | null; modelStatus: ModelStatus | null; connectionStatus: "loading" | "connected" | "disconnected"; }
const MIN_THINKING_MS = 700;
const MIN_RESPONSE_MS = 900;
const MAX_RESPONSE_MS = 6000;
const CHARACTERS_PER_SECOND = 42;
const wait = (duration: number) => new Promise<void>((resolve) => window.setTimeout(resolve, duration));
const newTurnId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export default function AiraPersonalHome({ health, modelStatus, connectionStatus }: Props) {
  const [registry, setRegistry] = useState<AiraCharacterRegistryData | null>(null);
  const [manifestError, setManifestError] = useState<string | null>(null);
  const [phase, setPhase] = useState<PersonalHomePhase>("return_greeting");
  const [outfit, setOutfitState] = useState<AiraOutfitId>(() => readStoredAiraOutfit());
  const [draft, setDraftState] = useState("");
  const [turns, setTurns] = useState<AiraHomeTurn[]>([]);
  const [activeTurnId, setActiveTurnId] = useState<string | null>(null);
  const [revealedCount, setRevealedCount] = useState(0);
  const [systemReduced, setSystemReduced] = useState(() => matchMedia("(prefers-reduced-motion: reduce)").matches);
  const flowIdRef = useRef(0);
  const processingRef = useRef(false);
  const draftRef = useRef("");
  const conversationIdRef = useRef<number | null>(null);
  const revealTimerRef = useRef<number | null>(null);
  const calmTimerRef = useRef<number | null>(null);
  const activeTurn = turns.find((turn) => turn.id === activeTurnId) ?? null;
  const processing = activeTurn?.status === "thinking" || activeTurn?.status === "responding";

  const updateTurn = useCallback((id: string, update: Partial<AiraHomeTurn>) => setTurns((current) => current.map((turn) => turn.id === id ? { ...turn, ...update } : turn)), []);
  const setDraft = useCallback((value: string) => { draftRef.current = value; setDraftState(value); }, []);
  const setOutfit = useCallback((value: AiraOutfitId) => { setOutfitState(value); persistAiraOutfit(value); }, []);

  useEffect(() => { loadAiraCharacterRegistry().then(setRegistry).catch((error: unknown) => setManifestError(error instanceof Error ? error.message : String(error))); }, []);
  useEffect(() => { const media = matchMedia("(prefers-reduced-motion: reduce)"); const update = () => setSystemReduced(media.matches); media.addEventListener("change", update); return () => media.removeEventListener("change", update); }, []);
  useEffect(() => { calmTimerRef.current = window.setTimeout(() => setPhase((current) => current === "return_greeting" ? "calm" : current), 2800); return () => { if (calmTimerRef.current !== null) window.clearTimeout(calmTimerRef.current); }; }, []);
  useEffect(() => {
    if (processingRef.current) return;
    if (connectionStatus === "disconnected") setPhase("offline");
    else if (connectionStatus === "connected") setPhase((current) => current === "offline" ? "calm" : current);
  }, [connectionStatus]);
  useEffect(() => () => { flowIdRef.current += 1; if (revealTimerRef.current !== null) window.clearInterval(revealTimerRef.current); }, []);

  const revealResponse = useCallback((flowId: number, turnId: string, response: ChatResponse) => {
    if (flowId !== flowIdRef.current) return;
    setPhase("responding");
    updateTurn(turnId, { assistantText: response.reply, status: "responding", conversationId: response.conversation_id, mode: response.mode, responseStatus: response.status, model: response.model, intent: response.intent, privacyState: response.privacy_state, projectContextUsed: response.project_context_used });
    const duration = systemReduced ? 0 : Math.min(MAX_RESPONSE_MS, Math.max(MIN_RESPONSE_MS, Math.ceil(response.reply.length / CHARACTERS_PER_SECOND * 1000)));
    if (duration === 0) {
      setRevealedCount(response.reply.length); updateTurn(turnId, { status: "complete" }); setPhase("complete"); processingRef.current = false; return;
    }
    const startedAt = performance.now();
    revealTimerRef.current = window.setInterval(() => {
      if (flowId !== flowIdRef.current) { if (revealTimerRef.current !== null) window.clearInterval(revealTimerRef.current); return; }
      const progress = Math.min(1, (performance.now() - startedAt) / duration);
      setRevealedCount(Math.ceil(response.reply.length * progress));
      if (progress < 1) return;
      if (revealTimerRef.current !== null) window.clearInterval(revealTimerRef.current);
      revealTimerRef.current = null; updateTurn(turnId, { status: "complete" }); setPhase("complete"); processingRef.current = false;
    }, 32);
  }, [systemReduced, updateTurn]);

  const runRequest = useCallback(async (turnId: string, message: string) => {
    if (processingRef.current) return;
    processingRef.current = true;
    flowIdRef.current += 1;
    const flowId = flowIdRef.current;
    if (revealTimerRef.current !== null) window.clearInterval(revealTimerRef.current);
    setActiveTurnId(turnId); setRevealedCount(0); setPhase("thinking");
    updateTurn(turnId, { status: "thinking", assistantText: "", errorMessage: undefined });
    try {
      const [response] = await Promise.all([sendMessage({ message, conversation_id: conversationIdRef.current }), wait(MIN_THINKING_MS)]);
      if (flowId !== flowIdRef.current) return;
      conversationIdRef.current = response.conversation_id;
      revealResponse(flowId, turnId, response);
    } catch {
      if (flowId !== flowIdRef.current) return;
      processingRef.current = false;
      const backendUnavailable = connectionStatus === "disconnected" || !health;
      const errorMessage = backendUnavailable
        ? "I couldn’t reach the local AIRA backend. Your message is preserved and ready to retry."
        : modelStatus && !modelStatus.default_model_available
          ? "The backend is ready, but the selected local model could not complete this request. Your message is preserved."
          : "The local request did not complete. Your message is preserved and ready to retry.";
      updateTurn(turnId, { status: "error", errorMessage });
      setPhase(backendUnavailable ? "offline" : "error");
    }
  }, [connectionStatus, health, modelStatus, revealResponse, updateTurn]);

  const submit = useCallback(() => {
    const message = draftRef.current.trim();
    if (!message || processingRef.current || connectionStatus === "disconnected") return;
    const turn: AiraHomeTurn = { id: newTurnId(), userText: message, assistantText: "", status: "submitted", createdAt: new Date().toISOString() };
    setTurns((current) => [...current, turn]); setActiveTurnId(turn.id); setDraft(""); void runRequest(turn.id, message);
  }, [connectionStatus, runRequest, setDraft]);

  const retry = useCallback(() => { if (!activeTurn || processingRef.current || connectionStatus === "disconnected") return; void runRequest(activeTurn.id, activeTurn.userText); }, [activeTurn, connectionStatus, runRequest]);
  const statusOverride = useMemo<PersonalHomeRuntimeStatus>(() => {
    if (phase === "thinking" || phase === "responding") return { label: "Local · Working", tone: "working" };
    if (phase === "offline") return { label: "Local · Offline", tone: "offline" };
    if (phase === "error") return { label: "Local · Needs attention", tone: "error" };
    if (connectionStatus === "loading") return { label: "Local · Checking", tone: "working" };
    if (activeTurn?.mode === "fallback") return { label: "Local · Fallback", tone: "ready" };
    if (modelStatus && !modelStatus.default_model_available) return { label: "Local · Fallback ready", tone: "ready" };
    return { label: "Local · Ready", tone: "ready" };
  }, [activeTurn?.mode, connectionStatus, modelStatus, phase]);

  const actions = useMemo<PersonalHomeSceneActions>(() => ({
    onPrimaryAction: () => setPhase("calm"), onSecondaryAction: () => setPhase("calm"), onQuietAction: () => setPhase("calm"), onOpenResearch: () => undefined,
    onOutfitChange: setOutfit, onComposerChange: (value) => { setDraft(value); if (!processingRef.current && phase !== "offline") setPhase("listening"); },
    onComposerFocus: () => { if (!processingRef.current && phase !== "offline" && phase !== "complete") setPhase("listening"); },
    onComposerBlur: () => { if (!processingRef.current && !draftRef.current.trim() && phase === "listening") setPhase("calm"); },
    onComposerSubmit: submit, onReturnToCalm: () => setPhase("calm"), onRetry: retry, onSettingsOpenChange: () => undefined,
  }), [phase, retry, setDraft, setOutfit, submit]);

  if (manifestError) return <section className="aira-personal-lab-state"><strong>Canonical character manifest failed validation.</strong><code>{manifestError}</code></section>;
  if (!registry) return <section className="aira-personal-lab-state">Validating AIRA’s canonical wardrobe…</section>;
  const revealedAssistantText = activeTurn?.assistantText.slice(0, revealedCount) ?? "";
  return <section className="aira-personal-home-lab aira-personal-home-production" data-controls-open="false" data-viewport="responsive"><div className="aira-personal-preview"><AiraPersonalHomeScene registry={registry} phase={phase} research="none" outfit={outfit ?? DEFAULT_AIRA_OUTFIT} composerValue={draft} turns={turns} activeTurnId={activeTurnId} revealedAssistantText={revealedAssistantText} processing={processing} reducedMotion={systemReduced} showResearch={false} blurOnSubmit={false} statusOverride={statusOverride} actions={actions} /></div></section>;
}
