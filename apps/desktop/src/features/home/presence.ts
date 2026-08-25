/**
 * AIRA presence state — controls avatar pose and visual composition.
 * Connectivity does NOT belong here; use AiraConnectionState instead.
 */
export type AiraPresenceState =
  | "booting"
  | "idle"
  | "engaged"
  | "waving"
  | "presenting";

/**
 * Backend/model connectivity — an independent modifier that affects
 * visual intensity and status text but never blocks avatar interaction.
 */
export type AiraConnectionState =
  | "checking"
  | "online"
  | "offline";
