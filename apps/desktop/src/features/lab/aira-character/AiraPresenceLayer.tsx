import type { CSSProperties } from "react";
import type { AiraPresenceState, AiraStageGeometry } from "./airaCharacterTypes";

interface Props {
  state: AiraPresenceState;
  geometry: AiraStageGeometry | null;
  reducedMotion: boolean;
}

export default function AiraPresenceLayer({ state, geometry, reducedMotion }: Props) {
  if (state === "none" || !geometry) return null;
  const width = Math.max(96, Math.min(geometry.renderedImageWidth * 0.42, 250));
  const style = {
    "--presence-left": `${geometry.feetCenterX}px`,
    "--presence-top": `${geometry.feetBaselineStageY + 2}px`,
    "--presence-width": `${width}px`,
  } as CSSProperties;
  return (
    <div
      className={`aira-presence aira-presence-${state} ${reducedMotion ? "is-reduced" : ""}`}
      style={style}
      aria-hidden="true"
      data-presence={state}
    >
      <span className="aira-contact-shadow" />
      {(state === "idle" || state === "listening") && <span className="aira-presence-glow" />}
      {state === "thinking" && <span className="aira-presence-ring" />}
      {state === "complete" && <span className="aira-presence-ring is-complete" />}
      {state === "error" && <span className="aira-presence-ring is-error" />}
    </div>
  );
}
