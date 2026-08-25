import type { AiraConnectionState, AiraPresenceState } from "../features/home/presence";

export default function WaterRippleStage({ presenceState, connectionState }: { presenceState: AiraPresenceState; connectionState: AiraConnectionState }) {
  return <div className={`water-ripple-stage water-ripple-${presenceState} ${connectionState === "offline" ? "water-ripple-muted" : ""}`} aria-hidden="true"><span className="water-contact-shimmer" /><span className="water-inner-ring" /><span className="water-pulse water-pulse-primary" /><span className="water-pulse water-pulse-secondary" /></div>;
}
