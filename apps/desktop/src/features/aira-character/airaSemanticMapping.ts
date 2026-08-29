import type { AiraAssetCategory, AiraAssetRecord, AiraCharacterRegistryData, AiraOutfitId } from "./airaCharacterTypes";

export type AiraHomeSemanticState =
  | "return-greeting"
  | "calm"
  | "listening"
  | "thinking"
  | "responding"
  | "complete"
  | "offline"
  | "error";

interface SemanticAssetTarget {
  category: AiraAssetCategory;
  key: string;
}

export const AIRA_HOME_SEMANTIC_ASSETS: Record<AiraHomeSemanticState, SemanticAssetTarget> = {
  "return-greeting": { category: "pose", key: "gentle-wave" },
  calm: { category: "expression", key: "soft-neutral" },
  listening: { category: "expression", key: "attentive-listening" },
  thinking: { category: "pose", key: "thinking-listening" },
  responding: { category: "expression", key: "speaking" },
  complete: { category: "pose", key: "happy-completion" },
  offline: { category: "expression", key: "tired-low-energy" },
  error: { category: "expression", key: "apologetic-error" },
};

export function findAiraAsset(
  registry: AiraCharacterRegistryData,
  outfit: AiraOutfitId,
  target: SemanticAssetTarget,
): AiraAssetRecord | null {
  const expectedId = `${outfit}.${target.category}.${target.key}`;
  return registry.outfits[outfit].categories[target.category].find((asset) => asset.id === expectedId) ?? null;
}

export function resolveAiraSemanticAsset(
  registry: AiraCharacterRegistryData,
  outfit: AiraOutfitId,
  semanticState: AiraHomeSemanticState,
) {
  return findAiraAsset(registry, outfit, AIRA_HOME_SEMANTIC_ASSETS[semanticState]);
}

export function resolveAiraNeutralAsset(registry: AiraCharacterRegistryData, outfit: AiraOutfitId) {
  return findAiraAsset(registry, outfit, { category: "expression", key: "soft-neutral" });
}
