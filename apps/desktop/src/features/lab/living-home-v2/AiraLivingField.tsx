import { useEffect, useRef } from "react";
import type {
  LivingFieldStats,
  LivingHomeGeometry,
  LivingHomeMode,
  LivingMotionProfile,
  Point,
  Rect,
} from "./livingHomeV2Types";

type Props = {
  mode: LivingHomeMode;
  motion: LivingMotionProfile;
  geometry: LivingHomeGeometry;
  onStats: (stats: LivingFieldStats) => void;
};

type Dust = { x: number; y: number; r: number; a: number; phase: number };
type Route = { start: Point; control: Point; end: Point };

const MINT = "98,229,205";
const COOL = "84,200,211";
const seeded = (index: number, salt: number) =>
  ((Math.sin(index * 89.71 + salt * 31.17) * 43758.5453) % 1 + 1) % 1;
const inside = (x: number, y: number, rect: Rect) =>
  x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height;

function writeQuad(route: Route, t: number, target: Point) {
  const u = 1 - t;
  target.x = u * u * route.start.x + 2 * u * t * route.control.x + t * t * route.end.x;
  target.y = u * u * route.start.y + 2 * u * t * route.control.y + t * t * route.end.y;
}

function makeGlowSprite() {
  const sprite = document.createElement("canvas");
  sprite.width = 40;
  sprite.height = 40;
  const context = sprite.getContext("2d");
  if (context) {
    const gradient = context.createRadialGradient(20, 20, 0, 20, 20, 18);
    gradient.addColorStop(0, "rgba(221,255,248,.98)");
    gradient.addColorStop(0.12, "rgba(98,229,205,.92)");
    gradient.addColorStop(0.38, "rgba(84,200,211,.34)");
    gradient.addColorStop(1, "rgba(84,200,211,0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, 40, 40);
  }
  return sprite;
}

function makeAuroraLayer(width: number, height: number, lowPower: boolean) {
  const layer = document.createElement("canvas");
  layer.width = Math.max(1, Math.ceil(width));
  layer.height = Math.max(1, Math.ceil(height));
  const context = layer.getContext("2d", { alpha: true });
  if (!context) return layer;
  context.globalCompositeOperation = "screen";

  const ribbon = (left: boolean, index: number) => {
    const color = left ? MINT : COOL;
    const alpha = (lowPower ? 0.018 : 0.026) * (4 - index);
    context.strokeStyle = `rgba(${color},${alpha})`;
    context.lineWidth = 20 + index * 18;
    context.beginPath();
    if (left) {
      context.moveTo(-width * 0.08, height * 0.83);
      context.bezierCurveTo(width * 0.02, height * 0.67, width * 0.1, height * 0.76, width * 0.19, height * 0.6);
    } else {
      context.moveTo(width * 1.08, height * 0.05);
      context.bezierCurveTo(width * 0.93, height * 0.1, width * 0.94, height * 0.27, width * 0.82, height * 0.34);
    }
    context.stroke();
  };

  for (let index = 0; index < (lowPower ? 2 : 4); index += 1) ribbon(true, index);
  for (let index = 0; index < (lowPower ? 2 : 4); index += 1) ribbon(false, index);
  return layer;
}

export default function AiraLivingField({ mode, motion, geometry, onStats }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const statsRef = useRef(onStats);
  statsRef.current = onStats;

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !context) return;

    const lowPower = motion === "low-power";
    const reduced = motion === "reduced-motion" || matchMedia("(prefers-reduced-motion: reduce)").matches;
    const compact = geometry.width <= 1100;
    const dpr = Math.min(devicePixelRatio || 1, lowPower ? 1 : 1.25);
    const { width, height } = geometry;
    const pointCount = lowPower ? (compact ? 30 : 38) : compact ? 60 : 76;
    const trailSamples = lowPower ? (compact ? 20 : 28) : compact ? 40 : 52;
    const packetCount = reduced || mode === "offline" ? 0 : mode === "default" ? (lowPower ? 2 : 3) : mode === "today" ? 2 : 3;

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    canvas.dataset.geometry = JSON.stringify(geometry);

    const dust: Dust[] = Array.from({ length: pointCount }, (_, index) => {
      const edge = index % 4;
      const a = seeded(index, 2);
      const b = seeded(index, 7);
      return {
        x: edge === 0 ? a * width * 0.24 : edge === 1 ? width * (0.76 + a * 0.24) : a * width,
        y: edge === 2 ? b * height * 0.2 : edge === 3 ? height * (0.8 + b * 0.2) : b * height,
        r: 0.45 + seeded(index, 11) * 0.85,
        a: 0.05 + seeded(index, 13) * 0.12,
        phase: index * 1.37,
      };
    });

    const anchor = geometry.avatarAnchor;
    const semantic = geometry.semanticAnchors;
    const routes: Route[] = [];
    if (mode === "default" || mode === "offline") {
      if (semantic.resume) routes.push({ start: semantic.resume, control: { x: anchor.x - width * 0.28, y: anchor.y - height * 0.34 }, end: anchor });
      if (semantic.mission) routes.push({ start: anchor, control: { x: anchor.x + width * 0.3, y: anchor.y - height * 0.26 }, end: semantic.mission });
    } else if (mode === "today") {
      if (semantic.checkpoint && semantic.currentTask) routes.push({ start: semantic.checkpoint, control: { x: semantic.checkpoint.x + 12, y: (semantic.checkpoint.y + semantic.currentTask.y) / 2 }, end: semantic.currentTask });
      if (semantic.currentTask && semantic.completion) routes.push({ start: semantic.currentTask, control: { x: semantic.currentTask.x - 8, y: (semantic.currentTask.y + semantic.completion.y) / 2 }, end: semantic.completion });
      if (semantic.completion) routes.push({ start: semantic.completion, control: { x: (semantic.completion.x + anchor.x) / 2, y: semantic.completion.y + height * 0.05 }, end: anchor });
    } else {
      if (semantic.project && semantic.checkpoint) routes.push({ start: semantic.project, control: { x: (semantic.project.x + semantic.checkpoint.x) / 2, y: semantic.project.y - height * 0.08 }, end: semantic.checkpoint });
      if (semantic.project && semantic.nextAction) routes.push({ start: semantic.project, control: { x: (semantic.project.x + semantic.nextAction.x) / 2, y: semantic.project.y }, end: semantic.nextAction });
      if (semantic.project && semantic.runtime) routes.push({ start: semantic.project, control: { x: (semantic.project.x + semantic.runtime.x) / 2, y: semantic.project.y + height * 0.08 }, end: semantic.runtime });
    }

    const auroraLayer = makeAuroraLayer(width, height, lowPower);
    const glowSprite = makeGlowSprite();
    const trailBuffer = new Float32Array(packetCount * trailSamples * 2);
    const packetHeads: Point[] = Array.from({ length: packetCount }, () => ({ x: 0, y: 0 }));
    let animationFrame = 0;
    let lastFrame = 0;
    let visible = true;
    let frames = 0;
    let statsStarted = performance.now();
    const targetFps = lowPower ? 18 : 30;

    const strokeRoute = (route: Route, alpha: number, dashed = false) => {
      context.save();
      context.strokeStyle = `rgba(${mode === "offline" ? "132,151,145" : MINT},${alpha})`;
      context.lineWidth = 0.85;
      if (dashed) context.setLineDash([6, 9]);
      context.beginPath();
      context.moveTo(route.start.x, route.start.y);
      context.quadraticCurveTo(route.control.x, route.control.y, route.end.x, route.end.y);
      context.stroke();
      context.restore();
    };

    const drawDefaultArcs = () => {
      for (let index = 0; index < 3; index += 1) {
        context.save();
        context.strokeStyle = `rgba(${MINT},${mode === "offline" ? 0.055 : 0.12 - index * 0.018})`;
        context.lineWidth = 0.7;
        context.beginPath();
        context.ellipse(anchor.x, anchor.y, width * (0.14 + index * 0.047), height * (0.22 + index * 0.045), -0.22 + index * 0.08, 0.76 + index * 0.5, Math.PI * 1.72 - index * 0.22);
        context.stroke();
        context.restore();
      }
    };

    const drawPacket = (route: Route, packetIndex: number, now: number) => {
      const headT = (now / 5400 + packetIndex * 0.31) % 1;
      const bufferStart = packetIndex * trailSamples * 2;
      const head = packetHeads[packetIndex];
      context.save();
      context.strokeStyle = `rgba(${packetIndex % 2 ? COOL : MINT},.23)`;
      context.lineWidth = 1.15;
      context.beginPath();
      for (let sample = 0; sample < trailSamples; sample += 1) {
        const t = Math.max(0, headT - (trailSamples - 1 - sample) * (0.15 / Math.max(1, trailSamples - 1)));
        writeQuad(route, t, head);
        const offset = bufferStart + sample * 2;
        trailBuffer[offset] = head.x;
        trailBuffer[offset + 1] = head.y;
        if (sample === 0) context.moveTo(head.x, head.y);
        else context.lineTo(head.x, head.y);
      }
      context.stroke();
      context.restore();
      writeQuad(route, headT, head);
      context.drawImage(glowSprite, head.x - 20, head.y - 20, 40, 40);
    };

    const draw = (now: number) => {
      animationFrame = requestAnimationFrame(draw);
      if (!visible || document.hidden) return;
      if (!reduced && now - lastFrame < (1000 / targetFps) * 0.88) return;
      if (reduced && lastFrame > 0) return;
      lastFrame = now;

      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, width, height);
      const auroraDrift = reduced ? 0 : Math.sin(now / 18000) * height * 0.018;
      context.save();
      context.globalAlpha = mode === "offline" ? 0.42 : 1;
      context.drawImage(auroraLayer, 0, auroraDrift);
      context.restore();

      for (const point of dust) {
        if (geometry.exclusionRects.some((rect) => inside(point.x, point.y, rect))) continue;
        context.fillStyle = `rgba(${COOL},${point.a * (mode === "offline" ? 0.38 : 1)})`;
        context.beginPath();
        context.arc(point.x + (reduced ? 0 : Math.sin(now / 5000 + point.phase) * 2), point.y, point.r, 0, Math.PI * 2);
        context.fill();
      }

      if (mode === "default" || mode === "offline") drawDefaultArcs();
      routes.forEach((route) => strokeRoute(route, mode === "offline" ? 0.07 : 0.24, mode === "offline"));
      if (!reduced && mode !== "offline" && routes.length > 0) {
        for (let index = 0; index < packetCount; index += 1) {
          const routeIndex = mode === "today" && index === packetCount - 1 ? routes.length - 1 : index % routes.length;
          drawPacket(routes[routeIndex], index, now);
        }
      }

      frames += 1;
      if (now - statsStarted >= 1000) {
        statsRef.current({ fps: Math.round((frames * 1000) / (now - statsStarted)), dpr, ambientPoints: pointCount, trailSamples, packets: packetCount, canvasWidth: canvas.width, canvasHeight: canvas.height });
        frames = 0;
        statsStarted = now;
      }
    };

    statsRef.current({ fps: 0, dpr, ambientPoints: pointCount, trailSamples, packets: packetCount, canvasWidth: canvas.width, canvasHeight: canvas.height });
    const observer = new IntersectionObserver((entries) => {
      visible = entries[0]?.isIntersecting ?? true;
      if (visible) lastFrame = 0;
    });
    observer.observe(canvas);
    animationFrame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animationFrame);
      observer.disconnect();
    };
  }, [geometry, mode, motion]);

  return <canvas ref={canvasRef} className="living-v2-field" aria-hidden="true" />;
}
