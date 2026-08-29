import type { AiraAssetCategory, AiraAssetRecord, AiraCharacterRegistryData, AiraOutfitId } from "./airaCharacterTypes";

export const OUTFIT_ORDER: AiraOutfitId[] = ["gray-teal", "blue-structured", "midnight-party"];
export const CATEGORY_ORDER: AiraAssetCategory[] = ["turnaround", "pose", "expression"];
export const CATEGORY_LABELS: Record<AiraAssetCategory, string> = { turnaround: "Turnaround", pose: "Pose", expression: "Expression" };
const STATE_ORDER: Record<AiraAssetCategory, string[]> = {
  turnaround: ["front", "three-quarter", "side", "back"],
  pose: ["neutral-idle", "gentle-wave", "open-palm-chatting", "thinking-listening", "presenting-right", "presenting-left", "concerned-error", "happy-completion"],
  expression: ["soft-neutral", "shy-embarrassed", "attentive-listening", "focused-thinking", "small-warm-smile", "happy", "concerned", "apologetic-error", "surprised", "tired-low-energy", "eyes-closed-content", "speaking"],
};
const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value);
const isOutfit = (value: unknown): value is AiraOutfitId => typeof value === "string" && OUTFIT_ORDER.includes(value as AiraOutfitId);
const isCategory = (value: unknown): value is AiraAssetCategory => typeof value === "string" && CATEGORY_ORDER.includes(value as AiraAssetCategory);
const numberField = (record: Record<string, unknown>, key: string) => { const value = record[key]; if (typeof value !== "number" || !Number.isFinite(value)) throw new Error(`Invalid numeric field: ${key}`); return value; };
const stringField = (record: Record<string, unknown>, key: string) => { const value = record[key]; if (typeof value !== "string" || !value) throw new Error(`Invalid string field: ${key}`); return value; };

function parseAsset(value: unknown, expectedOutfit: AiraOutfitId, expectedCategory: AiraAssetCategory): AiraAssetRecord {
  if (!isRecord(value)) throw new Error(`Invalid asset record for ${expectedOutfit}/${expectedCategory}`);
  if (!isOutfit(value.outfit) || value.outfit !== expectedOutfit) throw new Error(`Invalid outfit in ${String(value.id)}`);
  if (!isCategory(value.category) || value.category !== expectedCategory) throw new Error(`Invalid category in ${String(value.id)}`);
  if (!isRecord(value.alphaBounds)) throw new Error(`Invalid alpha bounds in ${String(value.id)}`);
  const src = stringField(value, "publicPath");
  if (!src.startsWith("/avatar/v2/aira-character/") || src.includes("\\") || /^[a-zA-Z]:/.test(src)) throw new Error(`Unsafe public path in ${String(value.id)}`);
  const record: AiraAssetRecord = {
    id: stringField(value, "id"), label: stringField(value, "label"), outfit: value.outfit, category: value.category, src,
    width: numberField(value, "width"), height: numberField(value, "height"), feetBaselineY: numberField(value, "feetBaselineY"),
    alphaBounds: { left: numberField(value.alphaBounds, "left"), top: numberField(value.alphaBounds, "top"), rightExclusive: numberField(value.alphaBounds, "rightExclusive"), bottomExclusive: numberField(value.alphaBounds, "bottomExclusive") },
    lastOpaqueRow: numberField(value, "lastOpaqueRow"), sha256: stringField(value, "sha256"), sourceFilename: stringField(value, "sourceFilename"),
  };
  if (record.width !== 1024 || record.height !== 1600 || record.feetBaselineY !== 1570 || record.alphaBounds.bottomExclusive !== 1570 || record.lastOpaqueRow !== 1569) throw new Error(`Unexpected canonical geometry in ${record.id}`);
  return record;
}

export function validateAiraManifest(value: unknown): AiraCharacterRegistryData {
  if (!isRecord(value) || value.schemaVersion !== 1 || value.character !== "AIRA") throw new Error("Invalid AIRA manifest header");
  if (!isRecord(value.canvas) || value.canvas.width !== 1024 || value.canvas.height !== 1600 || value.feetBaselineY !== 1570) throw new Error("Invalid AIRA manifest canvas geometry");
  if (!isRecord(value.outfits)) throw new Error("Missing AIRA outfit registry");
  const outfits = {} as AiraCharacterRegistryData["outfits"];
  let total = 0;
  for (const outfitId of OUTFIT_ORDER) {
    const outfitValue = value.outfits[outfitId];
    if (!isRecord(outfitValue) || !isRecord(outfitValue.categories)) throw new Error(`Missing outfit: ${outfitId}`);
    const categories = {} as Record<AiraAssetCategory, AiraAssetRecord[]>;
    for (const categoryId of CATEGORY_ORDER) {
      const categoryValue = outfitValue.categories[categoryId];
      if (!isRecord(categoryValue)) throw new Error(`Missing category: ${outfitId}/${categoryId}`);
      const expectedStates = STATE_ORDER[categoryId];
      if (Object.keys(categoryValue).length !== expectedStates.length || expectedStates.some((state) => !(state in categoryValue))) throw new Error(`Unexpected state set: ${outfitId}/${categoryId}`);
      categories[categoryId] = expectedStates.map((state) => parseAsset(categoryValue[state], outfitId, categoryId));
      total += categories[categoryId].length;
    }
    outfits[outfitId] = { label: stringField(outfitValue, "label"), categories };
  }
  if (total !== 72) throw new Error(`Manifest contains ${total} assets instead of 72`);
  return { schemaVersion: 1, character: "AIRA", canvas: { width: 1024, height: 1600 }, feetBaselineY: 1570, outfits };
}

let registryPromise: Promise<AiraCharacterRegistryData> | null = null;
export function loadAiraCharacterRegistry() {
  if (!registryPromise) registryPromise = fetch("/avatar/v2/aira-character/manifest.json", { cache: "no-cache" }).then((response) => { if (!response.ok) throw new Error(`Manifest request failed: ${response.status}`); return response.json() as Promise<unknown>; }).then(validateAiraManifest);
  return registryPromise;
}
export function listAiraAssets(registry: AiraCharacterRegistryData, outfit: AiraOutfitId, category: AiraAssetCategory) { return registry.outfits[outfit].categories[category]; }
