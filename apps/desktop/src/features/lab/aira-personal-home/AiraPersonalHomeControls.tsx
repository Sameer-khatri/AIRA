import { RotateCcw, X } from "lucide-react";
import type { AiraRuntimeMetrics } from "../../aira-character/AiraCharacterRuntime";
import { AIRA_OUTFIT_OPTIONS } from "../../aira-character/airaAppearance";
import type { AiraOutfitId } from "../../aira-character/airaCharacterTypes";
import type { PersonalHomeMotion, PersonalHomePhase, PersonalHomeResearchState, PersonalHomeSpeedProfile, PersonalHomeViewport } from "../../home/personal/airaPersonalHomeTypes";

interface AiraPersonalHomeControlsProps {
  open: boolean;
  phase: PersonalHomePhase;
  research: PersonalHomeResearchState;
  outfit: AiraOutfitId;
  motion: PersonalHomeMotion;
  speedProfile: PersonalHomeSpeedProfile;
  viewport: PersonalHomeViewport;
  forceMissingTarget: boolean;
  metrics: AiraRuntimeMetrics | null;
  lastFailure: string | null;
  onClose: () => void;
  onPhase: (phase: PersonalHomePhase) => void;
  onResearch: (research: PersonalHomeResearchState) => void;
  onOutfit: (outfit: AiraOutfitId) => void;
  onMotion: (motion: PersonalHomeMotion) => void;
  onSpeedProfile: (profile: PersonalHomeSpeedProfile) => void;
  onViewport: (viewport: PersonalHomeViewport) => void;
  onReturnReady: () => void;
  onReturnRunning: () => void;
  onPlaySequence: () => void;
  onSeedHistory: () => void;
  onRapidSwitch: () => void;
  onMissingTest: () => void;
  onReset: () => void;
  onClearAppearance: () => void;
}

const PHASES: PersonalHomePhase[] = ["return_greeting", "calm", "listening", "thinking", "responding", "complete", "offline", "error"];
const RESEARCH_STATES: PersonalHomeResearchState[] = ["none", "running", "ready", "error"];

export default function AiraPersonalHomeControls({
  open,
  phase,
  research,
  outfit,
  motion,
  speedProfile,
  viewport,
  forceMissingTarget,
  metrics,
  lastFailure,
  onClose,
  onPhase,
  onResearch,
  onOutfit,
  onMotion,
  onSpeedProfile,
  onViewport,
  onReturnReady,
  onReturnRunning,
  onPlaySequence,
  onSeedHistory,
  onRapidSwitch,
  onMissingTest,
  onReset,
  onClearAppearance,
}: AiraPersonalHomeControlsProps) {
  return (
    <aside className="aira-personal-controls" aria-hidden={!open} hidden={!open}>
      <header><div><span>Development only</span><h2>Personal Home</h2></div><button type="button" onClick={onClose} aria-label="Close lab controls"><X size={18} /></button></header>

      <section>
        <h3>State</h3>
        <label>Phase<select value={phase} onChange={(event) => onPhase(event.target.value as PersonalHomePhase)}>{PHASES.map((value) => <option key={value} value={value}>{value.replace("_", " ")}</option>)}</select></label>
        <label>Research<select value={research} onChange={(event) => onResearch(event.target.value as PersonalHomeResearchState)}>{RESEARCH_STATES.map((value) => <option key={value}>{value}</option>)}</select></label>
        <div className="control-button-grid">
          <button type="button" onClick={onReturnReady}>Return · ready</button>
          <button type="button" onClick={onReturnRunning}>Return · running</button>
          <button type="button" onClick={onPlaySequence}>Play mock flow</button>
          <button type="button" onClick={onSeedHistory}>Seed five turns</button>
          <button type="button" onClick={onRapidSwitch}>Rapid transitions</button>
        </div>
      </section>

      <section>
        <h3>Appearance</h3>
        <label>Outfit<select value={outfit} onChange={(event) => onOutfit(event.target.value as AiraOutfitId)}>{AIRA_OUTFIT_OPTIONS.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}</select></label>
        <label>Motion<select value={motion} onChange={(event) => onMotion(event.target.value as PersonalHomeMotion)}><option value="system">System</option><option value="full">Full</option><option value="reduce">Reduced</option></select></label>
        <label>Flow speed<select value={speedProfile} onChange={(event) => onSpeedProfile(event.target.value as PersonalHomeSpeedProfile)}><option value="normal">Normal</option><option value="fast">Fast test</option></select></label>
        <label>Viewport<select value={viewport} onChange={(event) => onViewport(event.target.value as PersonalHomeViewport)}><option value="responsive">Responsive</option><option value="1920x1080">1920 × 1080</option><option value="1366x768">1366 × 768</option><option value="1024x768">1024 × 768</option></select></label>
      </section>

      <section>
        <h3>Asset safety</h3>
        <button type="button" className={forceMissingTarget ? "active" : ""} onClick={onMissingTest}>{forceMissingTarget ? "Restore canonical target" : "Test missing target"}</button>
        <button type="button" onClick={onClearAppearance}>Clear saved appearance</button>
        {lastFailure && <code className="control-failure">Last failed: {lastFailure}</code>}
      </section>

      <section className="aira-personal-metrics">
        <h3>Runtime metrics</h3>
        <dl>
          <div><dt>Requested</dt><dd>{metrics?.requestedAssetId ?? "—"}</dd></div>
          <div><dt>Visible</dt><dd>{metrics?.visibleAssetId ?? "—"}</dd></div>
          <div><dt>Layers</dt><dd>{metrics?.layerCount ?? 0}</dd></div>
          <div><dt>Load</dt><dd>{metrics?.loadState ?? "—"}</dd></div>
          <div><dt>Fallback</dt><dd>{metrics?.fallbackUsed ? "yes" : "no"}</dd></div>
          <div><dt>Preloaded</dt><dd>{metrics?.preloadedCount ?? 0}</dd></div>
          <div><dt>Frame</dt><dd>{metrics ? `${metrics.frameWidth.toFixed(0)} × ${metrics.frameHeight.toFixed(0)}` : "—"}</dd></div>
          <div><dt>Baseline</dt><dd>{metrics ? `${metrics.displayedBaselineY.toFixed(1)}px` : "—"}</dd></div>
        </dl>
      </section>

      <button type="button" className="aira-personal-reset" onClick={onReset}><RotateCcw size={16} />Reset lab</button>
    </aside>
  );
}
