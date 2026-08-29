import type { AiraOutfitId } from "../../aira-character/airaCharacterTypes";

export type PersonalHomePhase = "return_greeting" | "calm" | "listening" | "thinking" | "responding" | "complete" | "offline" | "error";
export type PersonalHomeResearchState = "none" | "running" | "ready" | "error";
export type PersonalHomeMotion = "system" | "full" | "reduce";
export type PersonalHomeViewport = "responsive" | "1920x1080" | "1366x768" | "1024x768";
export type PersonalHomeSpeedProfile = "normal" | "fast";

export interface AiraHomeTurn {
  id: string; userText: string; assistantText: string;
  status: "draft" | "submitted" | "thinking" | "responding" | "complete" | "error";
  createdAt: string; conversationId?: number; mode?: string; responseStatus?: string;
  model?: string; intent?: string; privacyState?: string; projectContextUsed?: boolean; errorMessage?: string;
}
export interface PersonalHomeSceneActions {
  onPrimaryAction: () => void; onSecondaryAction: () => void; onQuietAction: () => void; onOpenResearch: () => void;
  onOutfitChange: (outfit: AiraOutfitId) => void; onComposerChange: (value: string) => void;
  onComposerFocus: () => void; onComposerBlur: () => void; onComposerSubmit: () => void;
  onReturnToCalm: () => void; onRetry: () => void; onSettingsOpenChange: (open: boolean) => void;
}
export interface PersonalHomeRuntimeStatus { label: string; tone: "ready" | "working" | "offline" | "error"; }
