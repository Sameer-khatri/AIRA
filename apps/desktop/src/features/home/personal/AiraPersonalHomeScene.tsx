import { ArrowRight, ArrowUp, CheckCircle2, ChevronRight, CircleAlert, Mic, Paperclip, Play, RotateCcw, Settings } from "lucide-react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import AiraCharacterRuntime, { type AiraRuntimeMetrics } from "../../aira-character/AiraCharacterRuntime";
import { AIRA_OUTFIT_OPTIONS } from "../../aira-character/airaAppearance";
import type { AiraCharacterRegistryData, AiraOutfitId } from "../../aira-character/airaCharacterTypes";
import { getPersonalHomeCopy } from "./airaPersonalHomeCopy";
import { getPersonalHomeSemanticState, getPersonalHomeStatus } from "./airaPersonalHomeState";
import type { AiraHomeTurn, PersonalHomePhase, PersonalHomeResearchState, PersonalHomeRuntimeStatus, PersonalHomeSceneActions } from "./airaPersonalHomeTypes";
import "./aira-personal-home.css";

interface Props {
  registry: AiraCharacterRegistryData; phase: PersonalHomePhase; research?: PersonalHomeResearchState;
  outfit: AiraOutfitId; composerValue: string; turns: AiraHomeTurn[]; activeTurnId: string | null;
  revealedAssistantText: string; processing: boolean; reducedMotion: boolean; forceMissingTarget?: boolean;
  notice?: string | null; showResearch?: boolean; blurOnSubmit?: boolean; statusOverride?: PersonalHomeRuntimeStatus;
  actions: PersonalHomeSceneActions; onRuntimeMetrics?: (metrics: AiraRuntimeMetrics) => void; onAssetFailure?: (path: string) => void;
}

export default function AiraPersonalHomeScene({
  registry, phase, research = "none", outfit, composerValue, turns, activeTurnId, revealedAssistantText,
  processing, reducedMotion, forceMissingTarget = false, notice = null, showResearch = true,
  blurOnSubmit = true, statusOverride, actions, onRuntimeMetrics, onAssetFailure,
}: Props) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const [newResponseWaiting, setNewResponseWaiting] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);
  const composerRef = useRef<HTMLTextAreaElement>(null);
  const conversationRef = useRef<HTMLDivElement>(null);
  const nearBottomRef = useRef(true);
  const previousScrollTopRef = useRef(0);
  const manualScrollUntilRef = useRef(0);
  const previousTurnCountRef = useRef(0);
  const activeTurn = turns.find((turn) => turn.id === activeTurnId) ?? null;
  const hasConversation = turns.length > 0;
  const copy = getPersonalHomeCopy(phase, showResearch ? research : "none");
  const semanticState = getPersonalHomeSemanticState(phase, research);
  const status = statusOverride ?? getPersonalHomeStatus(phase, research);
  const likelyNextStates = useMemo(() => phase === "return_greeting" ? ["calm", "listening"] as const : phase === "listening" ? ["thinking"] as const : phase === "thinking" ? ["responding"] as const : phase === "responding" ? ["complete"] as const : ["listening"] as const, [phase]);

  useEffect(() => actions.onSettingsOpenChange(settingsOpen), [actions, settingsOpen]);
  useEffect(() => {
    if (!settingsOpen) return;
    const pointer = (event: PointerEvent) => { if (!settingsRef.current?.contains(event.target as Node)) setSettingsOpen(false); };
    const key = (event: KeyboardEvent) => { if (event.key === "Escape") setSettingsOpen(false); };
    document.addEventListener("pointerdown", pointer); window.addEventListener("keydown", key);
    return () => { document.removeEventListener("pointerdown", pointer); window.removeEventListener("keydown", key); };
  }, [settingsOpen]);

  const scrollToBottom = (behavior: ScrollBehavior = "auto") => {
    const viewport = conversationRef.current;
    if (!viewport) return;
    if (reducedMotion || behavior === "auto") viewport.scrollTop = viewport.scrollHeight;
    else viewport.scrollTo({ top: viewport.scrollHeight, behavior });
    previousScrollTopRef.current = viewport.scrollTop;
    nearBottomRef.current = true; setNewResponseWaiting(false);
  };

  useLayoutEffect(() => {
    if (turns.length === previousTurnCountRef.current) return;
    previousTurnCountRef.current = turns.length;
    scrollToBottom(turns.length > 1 ? "smooth" : "auto");
  }, [turns.length]);

  useLayoutEffect(() => {
    if (!activeTurn || activeTurn.status !== "responding") return;
    if (performance.now() < manualScrollUntilRef.current) { setNewResponseWaiting(true); return; }
    if (nearBottomRef.current) scrollToBottom("auto");
    else setNewResponseWaiting(true);
  }, [activeTurn?.status, revealedAssistantText]);

  useEffect(() => {
    if (activeTurn?.status !== "complete") return;
    if (nearBottomRef.current) scrollToBottom("smooth");
    else setNewResponseWaiting(true);
  }, [activeTurn?.status]);

  const submitDisabled = phase === "offline" || processing || !composerValue.trim();
  const submit = () => { if (submitDisabled) return; actions.onComposerSubmit(); if (blurOnSubmit) composerRef.current?.blur(); };
  const assistantTextFor = (turn: AiraHomeTurn) => turn.id === activeTurnId && turn.status === "responding" ? revealedAssistantText : turn.assistantText;

  return <section className="aira-personal-scene" data-phase={phase} data-reduced-motion={reducedMotion}>
    <div className="aira-personal-glow" aria-hidden="true" />
    <header className="aira-personal-header">
      <div className="aira-personal-wordmark" aria-label="AIRA">A I R A</div>
      <div className="aira-personal-header-actions">
        <span className={`aira-personal-status tone-${status.tone}`}><i aria-hidden="true" />{status.label}</span>
        <div className="aira-personal-settings" ref={settingsRef}>
          <button type="button" className="aira-personal-icon-button" aria-label="Appearance settings" aria-haspopup="menu" aria-expanded={settingsOpen} onClick={() => setSettingsOpen((open) => !open)}><Settings size={21} /></button>
          {settingsOpen && <div className="aira-appearance-menu" role="menu" aria-label="AIRA appearance"><span className="aira-appearance-eyebrow">Appearance</span><strong>Choose AIRA’s outfit</strong><div className="aira-appearance-options">{AIRA_OUTFIT_OPTIONS.map((option) => <button key={option.id} type="button" role="menuitemradio" aria-checked={outfit === option.id} className={outfit === option.id ? "selected" : ""} onClick={() => { actions.onOutfitChange(option.id); setSettingsOpen(false); }}><span className={`outfit-swatch outfit-${option.id}`} aria-hidden="true" /><span>{option.label}</span>{outfit === option.id && <CheckCircle2 size={16} />}</button>)}</div></div>}
        </div>
      </div>
    </header>

    <div className="aira-personal-character-zone" aria-hidden="true"><AiraCharacterRuntime registry={registry} outfit={outfit} semanticState={semanticState} reducedMotion={reducedMotion} forceMissingTarget={forceMissingTarget} likelyNextStates={[...likelyNextStates]} preloadOutfits={settingsOpen} onMetrics={onRuntimeMetrics} onFailure={onAssetFailure} /></div>

    <main className="aira-personal-dialogue" data-conversation={hasConversation || undefined}>
      {!hasConversation && copy.headline.length > 0 && <div className="aira-personal-copy" aria-live="polite"><h1>{copy.headline.map((line, index) => <span key={`${line}-${index}`}>{line}</span>)}</h1>{copy.supporting && <p>{copy.supporting}</p>}</div>}

      {hasConversation && <div className="aira-conversation-frame">
        <div
          ref={conversationRef}
          className="aira-conversation-viewport"
          data-at-top={atTop}
          tabIndex={0}
          role="log"
          aria-label="Conversation with AIRA"
          onWheel={() => { nearBottomRef.current = false; manualScrollUntilRef.current = performance.now() + 1400; }}
          onTouchStart={() => { nearBottomRef.current = false; manualScrollUntilRef.current = performance.now() + 1400; }}
          onKeyDown={(event) => { if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End"].includes(event.key)) { nearBottomRef.current = false; manualScrollUntilRef.current = performance.now() + 1400; } }}
          onScroll={(event) => {
            const viewport = event.currentTarget;
            const distance = viewport.scrollHeight - viewport.clientHeight - viewport.scrollTop;
            const movedUp = viewport.scrollTop < previousScrollTopRef.current - 2;
            previousScrollTopRef.current = viewport.scrollTop;
            if (movedUp) { nearBottomRef.current = false; manualScrollUntilRef.current = performance.now() + 1400; }
            else if (performance.now() >= manualScrollUntilRef.current) nearBottomRef.current = distance <= 100;
            setAtTop(viewport.scrollTop <= 4);
            if (nearBottomRef.current) setNewResponseWaiting(false);
          }}
        >
          {turns.map((turn, index) => {
            const isActive = turn.id === activeTurnId;
            const assistantText = assistantTextFor(turn);
            const isPending = isActive && (turn.status === "submitted" || turn.status === "thinking");
            const isError = turn.status === "error";
            return <article key={turn.id} className="aira-conversation-turn" data-active={isActive || undefined} data-status={turn.status} data-conversation-id={turn.conversationId} data-intent={turn.intent} data-project-context-used={turn.projectContextUsed} data-response-mode={turn.mode} data-response-status={turn.responseStatus}>
              <div className="aira-personal-user-message"><span>YOU</span><p>{turn.userText}</p></div>
              {isPending && <div className="aira-personal-turn-status" aria-live="polite"><i aria-hidden="true" />I’m connecting the details.</div>}
              {isError && <section className="aira-personal-response aira-personal-response-error" role={isActive ? "alert" : undefined}><span>AIRA</span><div className="aira-personal-response-content"><p>{turn.errorMessage ?? "I couldn’t complete that request."}</p></div><div className="aira-personal-completion-row"><span><CircleAlert size={16} />Your message was preserved.</span>{isActive && <button type="button" onClick={actions.onRetry}><RotateCcw size={14} /> Retry</button>}</div></section>}
              {!isError && assistantText && <section className="aira-personal-response" aria-live={isActive && turn.status === "responding" ? "polite" : undefined} aria-busy={isActive && turn.status === "responding" || undefined}><span>AIRA</span><div className="aira-personal-response-content">{assistantText.split("\n\n").filter(Boolean).map((paragraph, paragraphIndex) => <p key={`${paragraphIndex}-${paragraph.slice(0, 16)}`}>{paragraph}</p>)}</div>{turn.status === "complete" && <div className="aira-personal-completion-row"><span><CheckCircle2 size={16} />Done.</span><span>{turn.mode === "fallback" ? "Local fallback" : turn.model ?? "Local"}</span></div>}</section>}
              {index < turns.length - 1 && <span className="aira-conversation-divider" aria-hidden="true" />}
            </article>;
          })}
        </div>
        {newResponseWaiting && <button type="button" className="aira-new-response" onClick={() => scrollToBottom("smooth")}>New response <ArrowUp size={14} /></button>}
      </div>}

      {hasConversation && phase === "listening" && <div className="aira-listening-status" aria-live="polite"><i aria-hidden="true" />I’m listening.</div>}
      {!hasConversation && showResearch && copy.strip && <button type="button" className="aira-personal-research-strip" onClick={actions.onOpenResearch}>{research === "error" ? <CircleAlert size={18} /> : <CheckCircle2 size={18} />}<span>{copy.strip}</span>{phase === "calm" && <><b>Open</b><ArrowRight size={17} /></>}</button>}
      {!hasConversation && showResearch && (copy.primary || copy.secondary) && <div className="aira-personal-primary-actions">{copy.primary && <button type="button" className="primary" onClick={actions.onPrimaryAction}>{research === "running" && <ArrowRight size={20} />}<span>{copy.primary}</span></button>}{copy.secondary && <button type="button" className="secondary" onClick={actions.onSecondaryAction}>{research === "running" && <Play size={18} />}<span>{copy.secondary}</span></button>}</div>}
      {!hasConversation && showResearch && copy.quiet && <button type="button" className="aira-personal-quiet-action" onClick={actions.onQuietAction}><span>{copy.quiet}</span><ChevronRight size={17} /></button>}

      <form className="aira-personal-composer" onSubmit={(event) => { event.preventDefault(); submit(); }}>
        <button type="button" disabled title="Attachments are not available" aria-label="Attach file (unavailable)"><Paperclip size={22} /></button>
        <textarea ref={composerRef} rows={1} value={composerValue} disabled={phase === "offline"} aria-label="Message AIRA" placeholder={copy.composerPlaceholder} onFocus={actions.onComposerFocus} onBlur={actions.onComposerBlur} onChange={(event) => actions.onComposerChange(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); submit(); } }} />
        <button type="button" disabled title="Voice input is not available" aria-label="Voice input (unavailable)"><Mic size={22} /></button><span className="composer-divider" aria-hidden="true" /><button type="submit" className="composer-send" disabled={submitDisabled} aria-label="Send message"><ArrowUp size={23} /></button>
      </form>
    </main>
    {notice && <div className="aira-personal-notice" role="status">{notice}</div>}
  </section>;
}
