import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import AiraPresenceLayer from "./AiraPresenceLayer";
import type {
  AiraAssetRecord,
  AiraBackgroundId,
  AiraGuideSettings,
  AiraLoadState,
  AiraPresenceState,
  AiraStageGeometry,
  AiraViewportPreset,
} from "./airaCharacterTypes";

const successfulPaths = new Set<string>();
const loadPromises = new Map<string, Promise<void>>();
const loggedFailures = new Set<string>();

function preloadPath(src: string) {
  if (successfulPaths.has(src)) return Promise.resolve();
  const existing = loadPromises.get(src);
  if (existing) return existing;
  const promise = new Promise<void>((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => {
      successfulPaths.add(src);
      resolve();
    };
    image.onerror = () => reject(new Error(`Unable to load ${src}`));
    image.src = src;
  }).catch((error: unknown) => {
    loadPromises.delete(src);
    throw error;
  });
  loadPromises.set(src, promise);
  return promise;
}

interface Layer {
  asset: AiraAssetRecord;
  kind: "active" | "incoming" | "outgoing";
}

interface Props {
  asset: AiraAssetRecord;
  previousAsset: AiraAssetRecord | null;
  adjacentAssets: AiraAssetRecord[];
  background: AiraBackgroundId;
  viewport: AiraViewportPreset;
  presence: AiraPresenceState;
  scale: number;
  offsetX: number;
  offsetY: number;
  guides: AiraGuideSettings;
  crossfadeEnabled: boolean;
  transitionDuration: number;
  reducedMotion: boolean;
  ghostEnabled: boolean;
  onGeometry: (geometry: AiraStageGeometry | null) => void;
  onLoadState: (state: AiraLoadState, failingPath?: string) => void;
  onPreloadCount: (count: number) => void;
}

const viewportRatio: Record<Exclude<AiraViewportPreset, "responsive">, number> = {
  "1920x1080": 1920 / 1080,
  "1366x768": 1366 / 768,
  "1024x768": 1024 / 768,
};

export default function AiraCharacterStage({
  asset,
  previousAsset,
  adjacentAssets,
  background,
  viewport,
  presence,
  scale,
  offsetX,
  offsetY,
  guides,
  crossfadeEnabled,
  transitionDuration,
  reducedMotion,
  ghostEnabled,
  onGeometry,
  onLoadState,
  onPreloadCount,
}: Props) {
  const frameRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<AiraAssetRecord | null>(null);
  const timerRef = useRef<number | null>(null);
  const frameRequestRef = useRef<number | null>(null);
  const requestRef = useRef(0);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const [layers, setLayers] = useState<Layer[]>([]);
  const [transitioning, setTransitioning] = useState(false);
  const [failingPath, setFailingPath] = useState<string | null>(null);
  const [retryVersion, setRetryVersion] = useState(0);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const measure = () => {
      const rect = frame.getBoundingClientRect();
      setStageSize((current) => current.width === rect.width && current.height === rect.height ? current : { width: rect.width, height: rect.height });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    measure();
    return () => observer.disconnect();
  }, [viewport]);

  const geometry = useMemo<AiraStageGeometry | null>(() => {
    if (!stageSize.width || !stageSize.height) return null;
    const baseScale = Math.min((stageSize.width * 0.8) / asset.width, (stageSize.height * 0.78) / asset.height);
    const renderedImageWidth = asset.width * baseScale * scale;
    const renderedImageHeight = asset.height * baseScale * scale;
    const feetBaselineStageY = stageSize.height - Math.max(18, stageSize.height * 0.035) + offsetY;
    const imageLeft = (stageSize.width - renderedImageWidth) / 2 + offsetX;
    const imageTop = feetBaselineStageY - renderedImageHeight * (asset.feetBaselineY / asset.height);
    const alpha = asset.alphaBounds;
    const left = imageLeft + renderedImageWidth * (alpha.left / asset.width);
    const top = imageTop + renderedImageHeight * (alpha.top / asset.height);
    const right = imageLeft + renderedImageWidth * (alpha.rightExclusive / asset.width);
    const bottom = imageTop + renderedImageHeight * (alpha.bottomExclusive / asset.height);
    return {
      stageWidth: stageSize.width,
      stageHeight: stageSize.height,
      imageLeft,
      imageTop,
      renderedImageWidth,
      renderedImageHeight,
      sourceWidth: asset.width,
      sourceHeight: asset.height,
      feetBaselineSourceY: asset.feetBaselineY,
      feetBaselineStageY,
      feetCenterX: imageLeft + renderedImageWidth / 2,
      characterBounds: { left, top, right, bottom, width: right - left, height: bottom - top },
    };
  }, [asset, offsetX, offsetY, scale, stageSize]);

  useEffect(() => onGeometry(geometry), [geometry, onGeometry]);

  useEffect(() => {
    requestRef.current += 1;
    const request = requestRef.current;
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    if (frameRequestRef.current !== null) cancelAnimationFrame(frameRequestRef.current);
    setFailingPath(null);
    onLoadState("loading");

    preloadPath(asset.src).then(() => {
      if (request !== requestRef.current) return;
      onPreloadCount(successfulPaths.size);
      onLoadState("ready");
      const current = activeRef.current;
      const instant = reducedMotion || !crossfadeEnabled || transitionDuration === 0 || !current;
      activeRef.current = asset;
      if (instant || current.src === asset.src) {
        setTransitioning(false);
        setLayers([{ asset, kind: "active" }]);
      } else {
        setTransitioning(false);
        setLayers([{ asset: current, kind: "outgoing" }, { asset, kind: "incoming" }]);
        frameRequestRef.current = requestAnimationFrame(() => setTransitioning(true));
        timerRef.current = window.setTimeout(() => {
          if (request !== requestRef.current) return;
          setLayers([{ asset, kind: "active" }]);
          setTransitioning(false);
        }, transitionDuration + 34);
      }
      adjacentAssets.forEach((nearby) => {
        preloadPath(nearby.src).then(() => onPreloadCount(successfulPaths.size)).catch(() => undefined);
      });
    }).catch((error: unknown) => {
      if (request !== requestRef.current) return;
      const message = error instanceof Error ? error.message : String(error);
      if (!loggedFailures.has(asset.src)) {
        loggedFailures.add(asset.src);
        console.error(`[AIRA Character Lab] ${message}`);
      }
      setFailingPath(asset.src);
      onLoadState("error", asset.src);
      setLayers([]);
    });

    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
      if (frameRequestRef.current !== null) cancelAnimationFrame(frameRequestRef.current);
    };
  }, [asset, adjacentAssets, crossfadeEnabled, onLoadState, onPreloadCount, reducedMotion, retryVersion, transitionDuration]);

  const imageStyle = geometry ? {
    left: `${geometry.imageLeft}px`,
    top: `${geometry.imageTop}px`,
    width: `${geometry.renderedImageWidth}px`,
    height: `${geometry.renderedImageHeight}px`,
    "--aira-transition-ms": `${reducedMotion ? 0 : transitionDuration}ms`,
  } as CSSProperties : undefined;
  const aspectRatio = viewport === "responsive" ? undefined : String(viewportRatio[viewport]);

  return (
    <div className="aira-stage-viewport-wrap" data-viewport={viewport}>
      <div
        ref={frameRef}
        className={`aira-character-stage background-${background} ${guides.canvasBoundary ? "show-boundary" : ""}`}
        style={{ aspectRatio }}
        data-transitioning={transitioning}
        data-layer-count={layers.length + (ghostEnabled && previousAsset ? 1 : 0)}
        data-loaded-count={successfulPaths.size}
      >
        <AiraPresenceLayer state={presence} geometry={geometry} reducedMotion={reducedMotion} />
        {ghostEnabled && previousAsset && geometry && (
          <img className="aira-character-image aira-ghost-image" src={previousAsset.src} alt="" draggable={false} style={imageStyle} />
        )}
        {layers.map((layer) => (
          <img
            key={`${layer.kind}-${layer.asset.src}`}
            className={`aira-character-image layer-${layer.kind}`}
            src={layer.asset.src}
            alt=""
            draggable={false}
            style={imageStyle}
          />
        ))}
        {geometry && guides.centerline && <span className="aira-guide-centerline" aria-hidden="true" />}
        {geometry && guides.feetBaseline && <span className="aira-guide-baseline" style={{ top: geometry.feetBaselineStageY }} aria-hidden="true"><b>y {geometry.feetBaselineStageY.toFixed(1)}</b></span>}
        {geometry && guides.alphaBounds && <span className="aira-guide-alpha" style={{ left: geometry.characterBounds.left, top: geometry.characterBounds.top, width: geometry.characterBounds.width, height: geometry.characterBounds.height }} aria-hidden="true" />}
        {failingPath && (
          <div className="aira-stage-error" role="alert">
            <strong>Asset failed to load</strong>
            <code>{failingPath}</code>
            <button type="button" onClick={() => setRetryVersion((value) => value + 1)}>Retry</button>
          </div>
        )}
        <span className="aira-stage-accessible-state">Selected asset: {asset.label}. {layers.length > 1 ? "Transitioning." : "Settled."}</span>
        {viewport !== "responsive" && <span className="aira-fit-indicator">Fit · {viewport.replace("x", "×")}</span>}
      </div>
    </div>
  );
}
