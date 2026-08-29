import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { AiraAssetRecord, AiraCharacterRegistryData, AiraOutfitId } from "./airaCharacterTypes";
import { OUTFIT_ORDER } from "./airaCharacterRegistry";
import { resolveAiraNeutralAsset, resolveAiraSemanticAsset, type AiraHomeSemanticState } from "./airaSemanticMapping";
import "./aira-character-runtime.css";

const successfulPaths = new Set<string>();
const failedPaths = new Set<string>();
const loadPromises = new Map<string, Promise<void>>();

function preloadPath(src: string) {
  if (successfulPaths.has(src)) return Promise.resolve();
  if (failedPaths.has(src)) return Promise.reject(new Error(`Unable to load ${src}`));
  const existing = loadPromises.get(src);
  if (existing) return existing;
  const promise = new Promise<void>((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => {
      successfulPaths.add(src);
      failedPaths.delete(src);
      resolve();
    };
    image.onerror = () => {
      failedPaths.add(src);
      reject(new Error(`Unable to load ${src}`));
    };
    image.src = src;
  }).finally(() => loadPromises.delete(src));
  loadPromises.set(src, promise);
  return promise;
}

type RuntimeLoadState = "loading" | "ready" | "fallback" | "error";

export interface AiraRuntimeMetrics {
  requestedAssetId: string;
  visibleAssetId: string | null;
  visibleAssetPath: string | null;
  layerCount: number;
  preloadedCount: number;
  loadState: RuntimeLoadState;
  fallbackUsed: boolean;
  frameWidth: number;
  frameHeight: number;
  displayedBaselineY: number;
}

interface RuntimeLayer {
  asset: AiraAssetRecord;
  kind: "active" | "incoming" | "outgoing";
}

interface AiraCharacterRuntimeProps {
  registry: AiraCharacterRegistryData;
  outfit: AiraOutfitId;
  semanticState: AiraHomeSemanticState;
  reducedMotion: boolean;
  transitionDuration?: number;
  forceMissingTarget?: boolean;
  likelyNextStates?: AiraHomeSemanticState[];
  preloadOutfits?: boolean;
  className?: string;
  onMetrics?: (metrics: AiraRuntimeMetrics) => void;
  onFailure?: (path: string) => void;
}

function uniqueAssets(assets: Array<AiraAssetRecord | null>) {
  const seen = new Set<string>();
  return assets.filter((asset): asset is AiraAssetRecord => {
    if (!asset || seen.has(asset.src)) return false;
    seen.add(asset.src);
    return true;
  });
}

export default function AiraCharacterRuntime({
  registry,
  outfit,
  semanticState,
  reducedMotion,
  transitionDuration = 220,
  forceMissingTarget = false,
  likelyNextStates = [],
  preloadOutfits = false,
  className = "",
  onMetrics,
  onFailure,
}: AiraCharacterRuntimeProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<AiraAssetRecord | null>(null);
  const requestRef = useRef(0);
  const timerRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [layers, setLayers] = useState<RuntimeLayer[]>([]);
  const [transitioning, setTransitioning] = useState(false);
  const [loadState, setLoadState] = useState<RuntimeLoadState>("loading");
  const [fallbackUsed, setFallbackUsed] = useState(false);
  const [frameSize, setFrameSize] = useState({ width: 0, height: 0 });

  const requestedCanonical = useMemo(
    () => resolveAiraSemanticAsset(registry, outfit, semanticState),
    [outfit, registry, semanticState],
  );
  const requestedAsset = useMemo(() => {
    if (!requestedCanonical || !forceMissingTarget) return requestedCanonical;
    return {
      ...requestedCanonical,
      id: `${requestedCanonical.id}.missing-test`,
      src: "/avatar/v2/aira-character/__personal-home-missing-test__.png",
    };
  }, [forceMissingTarget, requestedCanonical]);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const measure = () => {
      const rect = frame.getBoundingClientRect();
      setFrameSize((current) => current.width === rect.width && current.height === rect.height
        ? current
        : { width: rect.width, height: rect.height });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    measure();
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!requestedAsset) return;
    requestRef.current += 1;
    const request = requestRef.current;
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    if (animationFrameRef.current !== null) cancelAnimationFrame(animationFrameRef.current);
    setLoadState("loading");
    setFallbackUsed(false);

    const candidates = uniqueAssets([
      requestedAsset,
      resolveAiraNeutralAsset(registry, outfit),
      resolveAiraSemanticAsset(registry, "gray-teal", semanticState),
      resolveAiraNeutralAsset(registry, "gray-teal"),
    ]);

    const resolveCandidate = async () => {
      for (const candidate of candidates) {
        try {
          await preloadPath(candidate.src);
          if (request !== requestRef.current) return;
          const usedFallback = candidate.src !== requestedAsset.src;
          setFallbackUsed(usedFallback);
          setLoadState(usedFallback ? "fallback" : "ready");
          const current = activeRef.current;
          const instant = reducedMotion || !current || current.src === candidate.src || transitionDuration === 0;
          activeRef.current = candidate;
          if (instant) {
            setTransitioning(false);
            setLayers([{ asset: candidate, kind: "active" }]);
          } else {
            setTransitioning(false);
            setLayers([{ asset: current, kind: "outgoing" }, { asset: candidate, kind: "incoming" }]);
            animationFrameRef.current = requestAnimationFrame(() => setTransitioning(true));
            timerRef.current = window.setTimeout(() => {
              if (request !== requestRef.current) return;
              setLayers([{ asset: candidate, kind: "active" }]);
              setTransitioning(false);
            }, transitionDuration + 34);
          }
          return;
        } catch {
          onFailure?.(candidate.src);
        }
      }
      if (request === requestRef.current) setLoadState("error");
    };

    void resolveCandidate();
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
      if (animationFrameRef.current !== null) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [forceMissingTarget, outfit, onFailure, reducedMotion, registry, requestedAsset, semanticState, transitionDuration]);

  useEffect(() => {
    const preload = new Map<string, AiraAssetRecord>();
    for (const state of likelyNextStates) {
      const asset = resolveAiraSemanticAsset(registry, outfit, state);
      if (asset) preload.set(asset.src, asset);
    }
    if (preloadOutfits) {
      for (const outfitId of OUTFIT_ORDER) {
        const asset = resolveAiraSemanticAsset(registry, outfitId, semanticState);
        if (asset) preload.set(asset.src, asset);
      }
    }
    preload.forEach((asset) => void preloadPath(asset.src).catch(() => undefined));
  }, [likelyNextStates, outfit, preloadOutfits, registry, semanticState]);

  const displayedBaselineY = useMemo(() => {
    if (!frameSize.width || !frameSize.height) return 0;
    const renderedHeight = Math.min(frameSize.height, frameSize.width * (1600 / 1024));
    return (frameSize.height - renderedHeight) / 2 + renderedHeight * (1570 / 1600);
  }, [frameSize]);

  useEffect(() => {
    onMetrics?.({
      requestedAssetId: requestedCanonical?.id ?? "missing",
      visibleAssetId: activeRef.current?.id ?? null,
      visibleAssetPath: activeRef.current?.src ?? null,
      layerCount: layers.length,
      preloadedCount: successfulPaths.size,
      loadState,
      fallbackUsed,
      frameWidth: frameSize.width,
      frameHeight: frameSize.height,
      displayedBaselineY,
    });
  }, [displayedBaselineY, fallbackUsed, frameSize, layers, loadState, onMetrics, requestedCanonical]);

  const style = {
    "--aira-runtime-transition": `${reducedMotion ? 0 : transitionDuration}ms`,
    "--aira-runtime-baseline-y": `${displayedBaselineY}px`,
  } as CSSProperties;

  return (
    <div
      ref={frameRef}
      className={`aira-runtime ${className}`.trim()}
      data-layer-count={layers.length}
      data-load-state={loadState}
      data-transitioning={transitioning}
      style={style}
    >
      <span className="aira-runtime-contact-shadow" aria-hidden="true" />
      {layers.map((layer) => (
        <img
          key={`${layer.kind}-${layer.asset.src}`}
          className={`aira-runtime-image layer-${layer.kind}`}
          src={layer.asset.src}
          alt="AIRA"
          draggable={false}
        />
      ))}
      {loadState === "error" && !activeRef.current && (
        <div className="aira-runtime-diagnostic" role="status">AIRA asset unavailable</div>
      )}
    </div>
  );
}
