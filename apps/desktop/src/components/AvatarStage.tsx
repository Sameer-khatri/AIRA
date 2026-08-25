import { useEffect, useState } from "react";
import type { AiraConnectionState, AiraPresenceState } from "../features/home/presence";

interface AvatarStageProps {
  presenceState: AiraPresenceState;
  connectionState: AiraConnectionState;
  onEngage: () => void;
}

const assets = {
  idle: "/avatar/v1/aira-idle-v1.png",
  presenting: "/avatar/v1/aira-presenting-v1.png",
  waving: "/avatar/v1/aira-waving-v1.png",
} as const;

type AvatarAsset = keyof typeof assets;
const assetFor = (state: AiraPresenceState): AvatarAsset => state === "waving" ? "waving" : state === "presenting" ? "presenting" : "idle";

export default function AvatarStage({ presenceState, connectionState, onEngage }: AvatarStageProps) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let live = true;
    Promise.all(Object.values(assets).map((src) => new Promise<void>((resolve) => { const image = new Image(); image.onload = image.onerror = () => resolve(); image.src = src; }))).then(() => { if (live) setReady(true); });
    return () => { live = false; };
  }, []);
  const active = assetFor(presenceState);
  const activeSrc = assets[active];
  const camera = presenceState === "engaged" || presenceState === "waving" ? "upper" : presenceState === "presenting" ? "presenting" : "full";
  return (
    <div className={`avatar-stage avatar-stage-${camera} ${connectionState === "offline" ? "is-offline" : ""}`} data-presence={presenceState} aria-label="AIRA">
      <div className="avatar-camera"><div className="avatar-transform-layer">
        {ready && <img key={activeSrc} className="avatar-image is-visible" src={activeSrc} alt="" draggable={false} />}
      </div></div>
      <button className="avatar-engage-target" type="button" onClick={onEngage} aria-label="Engage AIRA" />
    </div>
  );
}
