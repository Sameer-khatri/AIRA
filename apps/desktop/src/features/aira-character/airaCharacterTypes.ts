export type AiraOutfitId = "gray-teal" | "blue-structured" | "midnight-party";
export type AiraAssetCategory = "turnaround" | "pose" | "expression";
export type AiraPresenceState = "none" | "grounded" | "idle" | "listening" | "thinking" | "complete" | "offline" | "error";
export type AiraBackgroundId = "transparent-checker" | "near-black" | "deep-teal" | "warm-light" | "neutral-gray";
export type AiraViewportPreset = "1920x1080" | "1366x768" | "1024x768" | "responsive";
export type AiraMotionPreference = "system" | "reduce" | "full";
export type AiraLoadState = "idle" | "loading" | "ready" | "error";

export interface AiraAlphaBounds { left: number; top: number; rightExclusive: number; bottomExclusive: number; }
export interface AiraAssetRecord {
  id: string; label: string; outfit: AiraOutfitId; category: AiraAssetCategory; src: string;
  width: number; height: number; feetBaselineY: number; alphaBounds: AiraAlphaBounds;
  lastOpaqueRow: number; sha256: string; sourceFilename: string;
}
export interface AiraCharacterRegistryData {
  schemaVersion: 1; character: "AIRA"; canvas: { width: 1024; height: 1600 }; feetBaselineY: 1570;
  outfits: Record<AiraOutfitId, { label: string; categories: Record<AiraAssetCategory, AiraAssetRecord[]> }>;
}
export interface AiraStageGeometry {
  stageWidth: number; stageHeight: number; imageLeft: number; imageTop: number;
  renderedImageWidth: number; renderedImageHeight: number; sourceWidth: number; sourceHeight: number;
  feetBaselineSourceY: number; feetBaselineStageY: number; feetCenterX: number;
  characterBounds: { left: number; top: number; right: number; bottom: number; width: number; height: number };
}
export interface AiraGuideSettings { canvasBoundary: boolean; alphaBounds: boolean; feetBaseline: boolean; centerline: boolean; metadata: boolean; }
