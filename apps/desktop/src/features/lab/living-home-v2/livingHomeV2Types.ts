export type LivingHomeMode = "default" | "today" | "memory" | "offline";
export type LivingMotionProfile = "normal" | "low-power" | "reduced-motion";

export interface Point { x: number; y: number; }
export interface Rect { x: number; y: number; width: number; height: number; kind: string; }

export interface LivingHomeGeometry {
  width: number;
  height: number;
  avatarAnchor: Point;
  semanticAnchors: {
    resume?: Point;
    mission?: Point;
    checkpoint?: Point;
    currentTask?: Point;
    completion?: Point;
    project?: Point;
    nextAction?: Point;
    runtime?: Point;
  };
  exclusionRects: Rect[];
}

export interface LivingFieldStats {
  fps: number;
  dpr: number;
  ambientPoints: number;
  trailSamples: number;
  packets: number;
  canvasWidth: number;
  canvasHeight: number;
}
