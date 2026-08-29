import { Menu, SlidersHorizontal } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import AiraCharacterControls from "./AiraCharacterControls";
import AiraCharacterStage from "./AiraCharacterStage";
import { CATEGORY_LABELS, listAiraAssets, loadAiraCharacterRegistry, OUTFIT_ORDER } from "./airaCharacterRegistry";
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
import "./aira-character-lab.css";

const DEFAULT_GUIDES: AiraGuideSettings = { canvasBoundary: false, alphaBounds: false, feetBaseline: false, centerline: false, metadata: false };

export default function AiraCharacterLab() {
  const [registry, setRegistry] = useState<AiraCharacterRegistryData | null>(null);
  const [manifestError, setManifestError] = useState<string | null>(null);
  const [outfit, setOutfitState] = useState<AiraOutfitId>("gray-teal");
  const [category, setCategoryState] = useState<AiraAssetCategory>("pose");
  const [assetIndex, setAssetIndexState] = useState(0);
  const [previousAsset, setPreviousAsset] = useState<AiraAssetRecord | null>(null);
  const [background, setBackground] = useState<AiraBackgroundId>("near-black");
  const [presence, setPresence] = useState<AiraPresenceState>("grounded");
  const [viewport, setViewport] = useState<AiraViewportPreset>("responsive");
  const [scale, setScale] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [guides, setGuides] = useState<AiraGuideSettings>(DEFAULT_GUIDES);
  const [crossfadeEnabled, setCrossfadeEnabled] = useState(true);
  const [transitionDuration, setTransitionDuration] = useState(220);
  const [motionPreference, setMotionPreference] = useState<AiraMotionPreference>("system");
  const [systemReduced, setSystemReduced] = useState(() => matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [ghostEnabled, setGhostEnabled] = useState(false);
  const [controlsOpen, setControlsOpen] = useState(() => !matchMedia("(max-width: 1100px)").matches);
  const [geometry, setGeometry] = useState<AiraStageGeometry | null>(null);
  const [loadState, setLoadState] = useState<AiraLoadState>("idle");
  const [failingPath, setFailingPath] = useState<string | null>(null);
  const [preloadedCount, setPreloadedCount] = useState(0);
  const [brokenTest, setBrokenTest] = useState(false);

  useEffect(() => {
    loadAiraCharacterRegistry().then(setRegistry).catch((error: unknown) => setManifestError(error instanceof Error ? error.message : String(error)));
  }, []);

  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setSystemReduced(media.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const media = matchMedia("(max-width: 1100px)");
    const update = () => setControlsOpen(!media.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const reducedMotion = motionPreference === "reduce" || (motionPreference === "system" && systemReduced);
  const assets = useMemo(() => registry ? listAiraAssets(registry, outfit, category) : [], [category, outfit, registry]);
  const canonicalAsset = assets[Math.min(assetIndex, Math.max(0, assets.length - 1))] ?? null;
  const asset = useMemo(() => canonicalAsset && brokenTest ? { ...canonicalAsset, id: `${canonicalAsset.id}.broken-test`, label: `${canonicalAsset.label} — broken-path test`, src: "/avatar/v2/aira-character/__missing-test-asset__.png" } : canonicalAsset, [brokenTest, canonicalAsset]);
  const adjacentAssets = useMemo(() => {
    if (!assets.length) return [];
    return [assets[(assetIndex - 1 + assets.length) % assets.length], assets[(assetIndex + 1) % assets.length]];
  }, [assetIndex, assets]);

  const chooseIndex = useCallback((index: number) => {
    if (!assets.length) return;
    setPreviousAsset(canonicalAsset);
    setBrokenTest(false);
    setAssetIndexState((index + assets.length) % assets.length);
  }, [assets.length, canonicalAsset]);

  const chooseOutfit = useCallback((value: AiraOutfitId) => {
    setPreviousAsset(canonicalAsset);
    setBrokenTest(false);
    setOutfitState(value);
    setAssetIndexState(0);
  }, [canonicalAsset]);

  const chooseCategory = useCallback((value: AiraAssetCategory) => {
    setPreviousAsset(canonicalAsset);
    setBrokenTest(false);
    setCategoryState(value);
    setAssetIndexState(0);
  }, [canonicalAsset]);

  const resetFraming = useCallback(() => { setScale(1); setOffsetX(0); setOffsetY(0); }, []);
  const reset = useCallback(() => {
    setPreviousAsset(null);
    setBrokenTest(false);
    setOutfitState("gray-teal");
    setCategoryState("pose");
    setAssetIndexState(0);
    setBackground("near-black");
    setPresence("grounded");
    setViewport("responsive");
    setScale(1);
    setOffsetX(0);
    setOffsetY(0);
    setGuides(DEFAULT_GUIDES);
    setCrossfadeEnabled(true);
    setTransitionDuration(220);
    setMotionPreference("system");
    setGhostEnabled(false);
    setFailingPath(null);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target;
      if (event.key === "Escape") { setControlsOpen(false); return; }
      if (target instanceof HTMLInputElement || target instanceof HTMLSelectElement || target instanceof HTMLTextAreaElement || target instanceof HTMLButtonElement || (target instanceof HTMLElement && target.isContentEditable)) return;
      if (event.key === "ArrowLeft") { event.preventDefault(); chooseIndex(assetIndex - 1); return; }
      if (event.key === "ArrowRight") { event.preventDefault(); chooseIndex(assetIndex + 1); return; }
      if (event.key === "1" || event.key === "2" || event.key === "3") { chooseOutfit(OUTFIT_ORDER[Number(event.key) - 1]); return; }
      if (event.key.toLowerCase() === "p") { chooseCategory("pose"); return; }
      if (event.key.toLowerCase() === "e") { chooseCategory("expression"); return; }
      if (event.key.toLowerCase() === "t") { chooseCategory("turnaround"); return; }
      if (event.key.toLowerCase() === "g") { setGuides((current) => ({ ...current, canvasBoundary: !current.canvasBoundary, alphaBounds: !current.alphaBounds, feetBaseline: !current.feetBaseline, centerline: !current.centerline })); return; }
      if (event.key.toLowerCase() === "r") reset();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [assetIndex, chooseCategory, chooseIndex, chooseOutfit, reset]);

  const handleLoadState = useCallback((state: AiraLoadState, path?: string) => {
    setLoadState(state);
    setFailingPath(path ?? null);
  }, []);
  const handleGuide = useCallback((key: keyof AiraGuideSettings, value: boolean) => setGuides((current) => ({ ...current, [key]: value })), []);

  if (manifestError) return <section className="aira-character-lab aira-manifest-failure"><h1>AIRA Character Lab</h1><strong>Manifest validation failed</strong><code>{manifestError}</code></section>;
  if (!registry || !asset || !canonicalAsset) return <section className="aira-character-lab aira-character-loading"><span>Validating canonical character registry…</span></section>;

  return (
    <section className="aira-character-lab" data-controls-open={controlsOpen} data-reduced-motion={reducedMotion}>
      <header className="aira-character-lab-bar">
        <div><span>AIRA</span><h1>Character Lab</h1></div>
        <dl>
          <div><dt>Outfit</dt><dd>{registry.outfits[outfit].label}</dd></div>
          <div><dt>Category</dt><dd>{CATEGORY_LABELS[category]}</dd></div>
          <div><dt>State</dt><dd>{canonicalAsset.label}</dd></div>
          <div><dt>Viewport</dt><dd>{viewport === "responsive" ? "Responsive" : viewport.replace("x", " × ")}</dd></div>
        </dl>
        <button type="button" className="aira-controls-toggle" onClick={() => setControlsOpen((value) => !value)} aria-expanded={controlsOpen} aria-label="Toggle Character Lab controls">{controlsOpen ? <SlidersHorizontal size={17} /> : <Menu size={18} />}<span>Controls</span></button>
      </header>
      <div className="aira-character-workspace">
        <main className="aira-character-stage-column">
          <AiraCharacterStage
            asset={asset}
            previousAsset={previousAsset}
            adjacentAssets={adjacentAssets}
            background={background}
            viewport={viewport}
            presence={presence}
            scale={scale}
            offsetX={offsetX}
            offsetY={offsetY}
            guides={guides}
            crossfadeEnabled={crossfadeEnabled}
            transitionDuration={transitionDuration}
            reducedMotion={reducedMotion}
            ghostEnabled={ghostEnabled}
            onGeometry={setGeometry}
            onLoadState={handleLoadState}
            onPreloadCount={setPreloadedCount}
          />
        </main>
        <AiraCharacterControls
          open={controlsOpen}
          registry={registry}
          outfit={outfit}
          category={category}
          assets={assets}
          assetIndex={assetIndex}
          asset={asset}
          background={background}
          presence={presence}
          viewport={viewport}
          scale={scale}
          offsetX={offsetX}
          offsetY={offsetY}
          guides={guides}
          crossfadeEnabled={crossfadeEnabled}
          transitionDuration={transitionDuration}
          motionPreference={motionPreference}
          reducedMotion={reducedMotion}
          ghostEnabled={ghostEnabled}
          loadState={loadState}
          failingPath={failingPath}
          preloadedCount={preloadedCount}
          geometry={geometry}
          onClose={() => setControlsOpen(false)}
          onOutfit={chooseOutfit}
          onCategory={chooseCategory}
          onAssetIndex={chooseIndex}
          onBackground={setBackground}
          onPresence={setPresence}
          onViewport={setViewport}
          onScale={setScale}
          onOffsetX={setOffsetX}
          onOffsetY={setOffsetY}
          onGuide={handleGuide}
          onCrossfade={setCrossfadeEnabled}
          onTransitionDuration={setTransitionDuration}
          onMotionPreference={setMotionPreference}
          onGhost={setGhostEnabled}
          onResetFraming={resetFraming}
          onReset={reset}
          onTestBroken={() => setBrokenTest(true)}
        />
      </div>
    </section>
  );
}
