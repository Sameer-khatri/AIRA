import type { AiraOutfitId } from "./airaCharacterTypes";

export const AIRA_APPEARANCE_STORAGE_KEY = "aira.appearance.outfit.v1";
export const DEFAULT_AIRA_OUTFIT: AiraOutfitId = "gray-teal";

export const AIRA_OUTFIT_OPTIONS: ReadonlyArray<{ id: AiraOutfitId; label: string }> = [
  { id: "gray-teal", label: "Gray" },
  { id: "blue-structured", label: "Blue" },
  { id: "midnight-party", label: "Midnight" },
];

export function isAiraOutfitId(value: unknown): value is AiraOutfitId {
  return AIRA_OUTFIT_OPTIONS.some((option) => option.id === value);
}

export function readStoredAiraOutfit(): AiraOutfitId {
  try {
    const stored = window.localStorage.getItem(AIRA_APPEARANCE_STORAGE_KEY);
    return isAiraOutfitId(stored) ? stored : DEFAULT_AIRA_OUTFIT;
  } catch {
    return DEFAULT_AIRA_OUTFIT;
  }
}

export function persistAiraOutfit(outfit: AiraOutfitId) {
  try {
    window.localStorage.setItem(AIRA_APPEARANCE_STORAGE_KEY, outfit);
  } catch {
    // Appearance persistence is optional in restricted browser contexts.
  }
}

export function clearStoredAiraOutfit() {
  try {
    window.localStorage.removeItem(AIRA_APPEARANCE_STORAGE_KEY);
  } catch {
    // Appearance persistence is optional in restricted browser contexts.
  }
}
