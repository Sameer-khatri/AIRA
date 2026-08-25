import { useEffect, useRef } from "react";
import type { AiraConnectionState, AiraPresenceState } from "../features/home/presence";

interface LivingBackgroundProps {
  state: AiraPresenceState;
  connectionState: AiraConnectionState;
}

interface Particle {
  x: number;
  y: number;
  radius: number;
  speed: number;
  drift: number;
  phase: number;
}

interface Strand {
  side: "left" | "right";
  phase: number;
  speed: number;
  startY: number;
  endY: number;
  reach: number;
  bend: number;
}

const STRAND_COUNT = 10;
const DESKTOP_PARTICLES = 22;
const COMPACT_PARTICLES = 16;
const TWO_PI = Math.PI * 2;

const strandColors = ["18, 164, 147", "44, 194, 169", "12, 115, 108", "67, 202, 177", "20, 139, 139"];

function makeParticles(): Particle[] {
  return Array.from({ length: DESKTOP_PARTICLES }, (_, index) => ({
    x: index % 2 === 0
      ? 0.035 + ((index * 0.61803398875) % 0.22)
      : 0.745 + ((index * 0.61803398875) % 0.22),
    y: 0.12 + ((index * 0.38196601125) % 0.76),
    radius: 0.7 + (index % 4) * 0.35,
    speed: 0.035 + (index % 5) * 0.008,
    drift: 0.015 + (index % 3) * 0.006,
    phase: index * 1.71,
  }));
}

function makeStrands(): Strand[] {
  return Array.from({ length: STRAND_COUNT }, (_, index) => ({
    side: index < STRAND_COUNT / 2 ? "left" : "right",
    phase: index * 0.83,
    speed: 0.055 + (index % 4) * 0.012,
    startY: 0.88 - (index % 5) * 0.11,
    endY: 0.13 + (index % 5) * 0.115,
    reach: 0.19 + (index % 3) * 0.045,
    bend: 0.16 + (index % 4) * 0.045,
  }));
}

export default function LivingBackground({ state, connectionState }: LivingBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stateRef = useRef<AiraPresenceState>(state);
  const connectionRef = useRef<AiraConnectionState>(connectionState);
  const pointerRef = useRef({ x: 0.5, y: 0.5, active: false });
  const visibilityRef = useRef(true);
  const reducedMotionRef = useRef(false);
  const qualityRef = useRef<"normal" | "reduced">("normal");
  const frameRef = useRef<number | null>(null);
  const lastFrameRef = useRef(0);
  const slowFrameCountRef = useRef(0);
  const pulseAgeRef = useRef(1.7);
  const lastStateRef = useRef<AiraPresenceState>(state);
  const backgroundGradientRef = useRef<CanvasGradient | null>(null);
  const particlesRef = useRef<Particle[]>(makeParticles());
  const strandsRef = useRef<Strand[]>(makeStrands());

  useEffect(() => {
    stateRef.current = state;
    if (state === "waving" && lastStateRef.current !== "waving") pulseAgeRef.current = 0;
    lastStateRef.current = state;
  }, [state]);

  useEffect(() => {
    connectionRef.current = connectionState;
  }, [connectionState]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d", { alpha: false });
    if (!context) return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotionRef.current = mediaQuery.matches;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      backgroundGradientRef.current = context.createLinearGradient(0, 0, rect.width, rect.height);
      backgroundGradientRef.current.addColorStop(0, "#101a18");
      backgroundGradientRef.current.addColorStop(0.48, "#0c1313");
      backgroundGradientRef.current.addColorStop(1, "#101514");
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    resize();

    const onPointerMove = (event: PointerEvent) => {
      pointerRef.current.x = event.clientX / Math.max(window.innerWidth, 1);
      pointerRef.current.y = event.clientY / Math.max(window.innerHeight, 1);
      pointerRef.current.active = true;
    };
    const onPointerLeave = () => { pointerRef.current.active = false; };
    const onVisibilityChange = () => {
      visibilityRef.current = document.visibilityState !== "hidden";
      if (visibilityRef.current && frameRef.current === null) {
        lastFrameRef.current = performance.now();
        frameRef.current = requestAnimationFrame(draw);
      }
    };
    const onMotionPreferenceChange = (event: MediaQueryListEvent) => {
      reducedMotionRef.current = event.matches;
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    mediaQuery.addEventListener("change", onMotionPreferenceChange);

    const draw = (now: number) => {
      frameRef.current = null;
      if (!visibilityRef.current) return;

      const delta = Math.min((now - lastFrameRef.current) / 1000, 0.08);
      lastFrameRef.current = now;
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const currentState = stateRef.current;
      const pointer = pointerRef.current;
      const reducedMotion = reducedMotionRef.current;
      const time = now / 1000;

      if (delta > 0.04 && !reducedMotion) slowFrameCountRef.current += 1;
      else slowFrameCountRef.current = Math.max(0, slowFrameCountRef.current - 1);
      if (slowFrameCountRef.current > 45) qualityRef.current = "reduced";
      if (slowFrameCountRef.current === 0) qualityRef.current = "normal";

      const compact = width < 720;
      const particleLimit = qualityRef.current === "reduced"
        ? Math.min(12, compact ? COMPACT_PARTICLES : DESKTOP_PARTICLES)
        : compact ? COMPACT_PARTICLES : DESKTOP_PARTICLES;
      const pointerX = pointer.active && !reducedMotion ? (pointer.x - 0.5) * 16 : 0;
      const pointerY = pointer.active && !reducedMotion ? (pointer.y - 0.5) * 8 : 0;
      const isEngaged = currentState === "engaged";
      const isWaving = currentState === "waving";
      const isOffline = connectionRef.current === "offline";
      const movement = reducedMotion ? 0.08 : isOffline ? 0.35 : isEngaged ? 0.48 : 1;
      const saturation = isOffline ? 0.52 : isWaving ? 1.18 : 1;

      context.fillStyle = backgroundGradientRef.current || "#0c1313";
      context.fillRect(0, 0, width, height);

      const leftGlow = context.createRadialGradient(width * 0.01, height * 0.59, 0, width * 0.01, height * 0.59, width * 0.46);
      leftGlow.addColorStop(0, isOffline ? "rgba(35, 84, 80, 0.15)" : `rgba(14, 126, 112, ${isWaving ? 0.19 : 0.15})`);
      leftGlow.addColorStop(0.48, "rgba(6, 72, 65, 0.07)");
      leftGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
      context.fillStyle = leftGlow;
      context.fillRect(0, 0, width, height);
      const rightGlow = context.createRadialGradient(width * 0.99, height * 0.55, 0, width * 0.99, height * 0.55, width * 0.4);
      rightGlow.addColorStop(0, isOffline ? "rgba(35, 84, 80, 0.13)" : `rgba(13, 115, 108, ${isWaving ? 0.18 : 0.135})`);
      rightGlow.addColorStop(0.5, "rgba(5, 65, 60, 0.06)");
      rightGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
      context.fillStyle = rightGlow;
      context.fillRect(0, 0, width, height);

      if (isEngaged) {
        context.fillStyle = "rgba(3, 8, 8, 0.24)";
        context.fillRect(width * 0.28, 0, width * 0.44, height);
      }

      const strands = strandsRef.current;
      for (let index = 0; index < strands.length; index += 1) {
        const strand = strands[index];
        const drift = Math.sin(strand.phase + time * strand.speed * movement) * height * 0.018;
        const isLeft = strand.side === "left";
        const startX = isLeft ? -width * 0.12 : width * 1.12;
        const endX = isLeft ? width * strand.reach : width * (1 - strand.reach);
        const firstControlX = isLeft ? width * 0.025 : width * 0.975;
        const secondControlX = isLeft ? width * (strand.reach * 0.52) : width * (1 - strand.reach * 0.52);
        const startY = height * strand.startY + drift + pointerY * 0.18;
        const endY = height * strand.endY - drift * 0.55;
        const firstControlY = height * Math.max(0.04, strand.startY - strand.bend) - drift;
        const secondControlY = height * Math.min(0.96, strand.endY + strand.bend) + drift;
        const color = isOffline ? "102, 139, 133" : strandColors[index % strandColors.length];
        const drawRibbon = (lineWidth: number, alpha: number, blur = 0) => {
          context.save();
          context.lineWidth = lineWidth;
          context.strokeStyle = `rgba(${color}, ${alpha * saturation})`;
          context.shadowBlur = blur;
          context.shadowColor = `rgba(${color}, ${alpha * 0.75})`;
          context.beginPath();
          context.moveTo(startX, startY);
          context.bezierCurveTo(firstControlX, firstControlY, secondControlX, secondControlY, endX, endY);
          context.stroke();
          context.restore();
        };
        drawRibbon(14 + (index % 3) * 3, 0.022, 9);
        drawRibbon(3 + (index % 2) * 1.2, 0.055, 2);
        drawRibbon(0.8 + (index % 3) * 0.18, 0.115, 0);
      }

      const particles = particlesRef.current;
      context.fillStyle = isOffline ? "rgba(203, 168, 98, 0.24)" : isWaving ? "rgba(112, 220, 190, 0.38)" : "rgba(113, 205, 178, 0.25)";
      for (let index = 0; index < particleLimit; index += 1) {
        const particle = particles[index];
        const x = ((particle.x + Math.sin(time * particle.speed + particle.phase) * particle.drift) % 1) * width;
        const y = (particle.y + Math.cos(time * particle.speed * 0.7 + particle.phase) * particle.drift) * height;
        context.globalAlpha = 0.4 + (Math.sin(time * 0.8 + particle.phase) + 1) * 0.12;
        context.beginPath();
        context.arc(x + pointerX * 0.2, y + pointerY * 0.2, particle.radius, 0, TWO_PI);
        context.fill();
      }
      context.globalAlpha = 1;


      if (!reducedMotion) frameRef.current = requestAnimationFrame(draw);
    };

    lastFrameRef.current = performance.now();
    frameRef.current = requestAnimationFrame(draw);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      mediaQuery.removeEventListener("change", onMotionPreferenceChange);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    };
  }, []);

  return (
    <div className="living-background" data-state={state} data-connection={connectionState} aria-hidden="true">
      <div className="living-background-fallback" />
      <canvas ref={canvasRef} className="living-background-canvas" />
      <div className="living-background-vignette" />
    </div>
  );
}
