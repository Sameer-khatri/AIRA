import { AlertTriangle, ChevronLeft, ChevronRight, RotateCcw, X } from "lucide-react";
import { CATEGORY_LABELS, CATEGORY_ORDER, OUTFIT_ORDER } from "./airaCharacterRegistry";
import type {
  AiraAssetCategory,
  AiraAssetRecord,
  AiraBackgroundId,
  AiraCharacterRegistryData,
  AiraGuideSettings,
  AiraLoadState,
  AiraMotionPreference,
  AiraOutfitId,
  AiraPresenceState,
  AiraStageGeometry,
  AiraViewportPreset,
} from "./airaCharacterTypes";

interface Props {
  open: boolean;
  registry: AiraCharacterRegistryData;
  outfit: AiraOutfitId;
  category: AiraAssetCategory;
  assets: AiraAssetRecord[];
  assetIndex: number;
  asset: AiraAssetRecord;
  background: AiraBackgroundId;
  presence: AiraPresenceState;
  viewport: AiraViewportPreset;
  scale: number;
  offsetX: number;
  offsetY: number;
  guides: AiraGuideSettings;
  crossfadeEnabled: boolean;
  transitionDuration: number;
  motionPreference: AiraMotionPreference;
  reducedMotion: boolean;
  ghostEnabled: boolean;
  loadState: AiraLoadState;
  failingPath: string | null;
  preloadedCount: number;
  geometry: AiraStageGeometry | null;
  onClose: () => void;
  onOutfit: (value: AiraOutfitId) => void;
  onCategory: (value: AiraAssetCategory) => void;
  onAssetIndex: (value: number) => void;
  onBackground: (value: AiraBackgroundId) => void;
  onPresence: (value: AiraPresenceState) => void;
  onViewport: (value: AiraViewportPreset) => void;
  onScale: (value: number) => void;
  onOffsetX: (value: number) => void;
  onOffsetY: (value: number) => void;
  onGuide: (key: keyof AiraGuideSettings, value: boolean) => void;
  onCrossfade: (value: boolean) => void;
  onTransitionDuration: (value: number) => void;
  onMotionPreference: (value: AiraMotionPreference) => void;
  onGhost: (value: boolean) => void;
  onResetFraming: () => void;
  onReset: () => void;
  onTestBroken: () => void;
}

const backgroundOptions: Array<[AiraBackgroundId, string]> = [
  ["transparent-checker", "Transparency checkerboard"],
  ["near-black", "Near-black"],
  ["deep-teal", "Deep teal"],
  ["warm-light", "Warm light"],
  ["neutral-gray", "Neutral gray"],
];
const presenceOptions: Array<[AiraPresenceState, string]> = [
  ["none", "None"], ["grounded", "Grounded"], ["idle", "Idle"], ["listening", "Listening"],
  ["thinking", "Thinking"], ["complete", "Complete"], ["offline", "Offline"], ["error", "Error"],
];
const viewportOptions: Array<[AiraViewportPreset, string]> = [
  ["responsive", "Responsive / current"], ["1920x1080", "1920 × 1080"], ["1366x768", "1366 × 768"], ["1024x768", "1024 × 768"],
];

export default function AiraCharacterControls(props: Props) {
  const geometry = props.geometry;
  return (
    <aside className={`aira-character-controls ${props.open ? "is-open" : ""}`} aria-label="AIRA Character Lab controls" aria-hidden={!props.open}>
      <header className="aira-controls-header">
        <div><span>Development instrument</span><h2>Character controls</h2></div>
        <button type="button" onClick={props.onClose} aria-label="Close Character Lab controls"><X size={17} /></button>
      </header>

      <div className="aira-controls-scroll">
        <fieldset>
          <legend>Asset</legend>
          <label>Outfit<select value={props.outfit} onChange={(event) => props.onOutfit(event.target.value as AiraOutfitId)}>{OUTFIT_ORDER.map((id) => <option key={id} value={id}>{props.registry.outfits[id].label}</option>)}</select></label>
          <label>Category<select value={props.category} onChange={(event) => props.onCategory(event.target.value as AiraAssetCategory)}>{CATEGORY_ORDER.map((id) => <option key={id} value={id}>{CATEGORY_LABELS[id]}</option>)}</select></label>
          <label>State<select value={props.assetIndex} onChange={(event) => props.onAssetIndex(Number(event.target.value))}>{props.assets.map((item, index) => <option key={item.id} value={index}>{item.label}</option>)}</select></label>
          <div className="aira-stepper"><button type="button" onClick={() => props.onAssetIndex((props.assetIndex - 1 + props.assets.length) % props.assets.length)} aria-label="Previous asset"><ChevronLeft size={16} /> Previous</button><span>{props.assetIndex + 1} / {props.assets.length}</span><button type="button" onClick={() => props.onAssetIndex((props.assetIndex + 1) % props.assets.length)} aria-label="Next asset">Next <ChevronRight size={16} /></button></div>
        </fieldset>

        <fieldset>
          <legend>Environment</legend>
          <label>Background<select value={props.background} onChange={(event) => props.onBackground(event.target.value as AiraBackgroundId)}>{backgroundOptions.map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select></label>
          <label>Presence<select value={props.presence} onChange={(event) => props.onPresence(event.target.value as AiraPresenceState)}>{presenceOptions.map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select></label>
          <label>Viewport<select value={props.viewport} onChange={(event) => props.onViewport(event.target.value as AiraViewportPreset)}>{viewportOptions.map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select></label>
        </fieldset>

        <fieldset>
          <legend>Framing</legend>
          <label className="range-label"><span>Character scale <b>{props.scale.toFixed(2)}×</b></span><input type="range" min="0.7" max="1.25" step="0.01" value={props.scale} onChange={(event) => props.onScale(Number(event.target.value))} /></label>
          <label className="range-label"><span>Horizontal offset <b>{props.offsetX}px</b></span><input type="range" min="-160" max="160" step="1" value={props.offsetX} onChange={(event) => props.onOffsetX(Number(event.target.value))} /></label>
          <label className="range-label"><span>Vertical diagnostic offset <b>{props.offsetY}px</b></span><input type="range" min="-80" max="80" step="1" value={props.offsetY} onChange={(event) => props.onOffsetY(Number(event.target.value))} /></label>
          <button className="aira-secondary-button" type="button" onClick={props.onResetFraming}><RotateCcw size={14} />Reset framing</button>
        </fieldset>

        <fieldset>
          <legend>Guides</legend>
          {(["canvasBoundary", "alphaBounds", "feetBaseline", "centerline", "metadata"] as Array<keyof AiraGuideSettings>).map((key) => <label className="check-label" key={key}><input type="checkbox" checked={props.guides[key]} onChange={(event) => props.onGuide(key, event.target.checked)} /><span>{key === "canvasBoundary" ? "Canvas boundary" : key === "alphaBounds" ? "Alpha bounding box" : key === "feetBaseline" ? "Feet baseline" : key === "centerline" ? "Stage centerline" : "Asset metadata"}</span></label>)}
        </fieldset>

        <fieldset>
          <legend>Transition</legend>
          <label className="check-label"><input type="checkbox" checked={props.crossfadeEnabled} onChange={(event) => props.onCrossfade(event.target.checked)} /><span>Crossfade enabled</span></label>
          <label className="range-label"><span>Duration <b>{props.reducedMotion ? 0 : props.transitionDuration} ms</b></span><input type="range" min="0" max="500" step="10" value={props.transitionDuration} disabled={props.reducedMotion || !props.crossfadeEnabled} onChange={(event) => props.onTransitionDuration(Number(event.target.value))} /></label>
          <label>Motion<select value={props.motionPreference} onChange={(event) => props.onMotionPreference(event.target.value as AiraMotionPreference)}><option value="system">Follow system</option><option value="reduce">Reduced motion</option><option value="full">Full motion</option></select></label>
          <label className="check-label"><input type="checkbox" checked={props.ghostEnabled} onChange={(event) => props.onGhost(event.target.checked)} /><span>Previous-state ghost diagnostic</span></label>
        </fieldset>

        {props.guides.metadata && <section className="aira-asset-metadata" aria-label="Selected asset metadata">
          <h3>Metadata</h3>
          <dl>
            <div><dt>Outfit</dt><dd>{props.registry.outfits[props.outfit].label}</dd></div>
            <div><dt>Category</dt><dd>{CATEGORY_LABELS[props.category]}</dd></div>
            <div><dt>State ID</dt><dd>{props.asset.id}</dd></div>
            <div><dt>Label</dt><dd>{props.asset.label}</dd></div>
            <div><dt>Public path</dt><dd>{props.asset.src}</dd></div>
            <div><dt>Source</dt><dd>{props.asset.width} × {props.asset.height}</dd></div>
            <div><dt>Displayed</dt><dd>{geometry ? `${geometry.renderedImageWidth.toFixed(1)} × ${geometry.renderedImageHeight.toFixed(1)}` : "Measuring"}</dd></div>
            <div><dt>Alpha bounds</dt><dd>{props.asset.alphaBounds.left}, {props.asset.alphaBounds.top} → {props.asset.alphaBounds.rightExclusive}, {props.asset.alphaBounds.bottomExclusive} exclusive</dd></div>
            <div><dt>Feet baseline</dt><dd>source {props.asset.feetBaselineY} · displayed {geometry?.feetBaselineStageY.toFixed(1) ?? "—"}</dd></div>
            <div><dt>SHA-256</dt><dd>{props.asset.sha256.slice(0, 12)}…</dd></div>
            <div><dt>Load</dt><dd>{props.loadState}</dd></div>
            <div><dt>Preloaded</dt><dd>{props.preloadedCount}</dd></div>
            <div><dt>Transition</dt><dd>{props.reducedMotion ? 0 : props.transitionDuration} ms</dd></div>
            <div><dt>Reduced motion</dt><dd>{props.reducedMotion ? "Active" : "Inactive"}</dd></div>
          </dl>
          {props.failingPath && <p className="metadata-error"><AlertTriangle size={14} />{props.failingPath}</p>}
          <button className="aira-secondary-button" type="button" onClick={props.onTestBroken}>Test broken-asset fallback</button>
        </section>}
      </div>
      <button className="aira-reset-button" type="button" onClick={props.onReset}><RotateCcw size={15} />Reset canonical defaults</button>
    </aside>
  );
}
