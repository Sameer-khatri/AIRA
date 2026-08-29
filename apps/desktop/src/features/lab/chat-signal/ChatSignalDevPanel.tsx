import { Gauge, Play, RotateCcw, X } from "lucide-react";
import type { ChatSignalPhase, ChatSignalStats, MotionProfile } from "../../chat/signal/chatSignalTypes";

type Props = {
  open: boolean;
  phase: ChatSignalPhase;
  mode: MotionProfile;
  stats: ChatSignalStats;
  onClose: () => void;
  onPhase: (phase: ChatSignalPhase) => void;
  onMode: (mode: MotionProfile) => void;
  onPlay: () => void;
  onReset: () => void;
};

const phaseLabels: Record<ChatSignalPhase, string> = { idle: "Idle", user_message: "User message", thinking: "Thinking", memory_confirmed: "Memory confirmed", responding: "Responding", complete: "Complete", offline: "Offline", error: "Error" };

export default function ChatSignalDevPanel({ open, phase, mode, stats, onClose, onPhase, onMode, onPlay, onReset }: Props) {
  return (
    <aside className={`signal-dev-panel ${open ? "signal-dev-panel-open" : ""}`} aria-hidden={!open} aria-label="Chat Signal development controls">
      <div className="signal-dev-heading">
        <div><span>DEVELOPMENT ONLY</span><h2>Signal controls</h2></div>
        <button type="button" onClick={onClose} aria-label="Close development controls"><X size={17} /></button>
      </div>
      <div className="signal-dev-actions">
        <button type="button" className="signal-dev-primary" onClick={onPlay}><Play size={15} /> Play sequence</button>
        <button type="button" onClick={onReset}><RotateCcw size={15} /> Reset</button>
      </div>
      <div className="signal-dev-states" role="group" aria-label="Conversation state">
        {(Object.keys(phaseLabels) as ChatSignalPhase[]).map((item) => (
          <button type="button" key={item} aria-pressed={phase === item} onClick={() => onPhase(item)}>
            <span className="signal-dev-state-dot" />{phaseLabels[item]}
          </button>
        ))}
      </div>
      <label className="signal-dev-mode">
        Motion profile
          <select value={mode} onChange={(event) => onMode(event.target.value as MotionProfile)}>
          <option value="normal">Normal</option>
          <option value="reduced-motion">Reduced motion</option>
          <option value="low-power">Low power</option>
        </select>
      </label>
      <div className="signal-dev-performance" aria-label="Canvas performance">
        <Gauge size={15} aria-hidden="true" />
        <span><b>FPS</b>{stats.fps}</span>
        <span><b>Particles</b>{stats.particles}</span>
        <span><b>DPR</b>{stats.dpr.toFixed(2)}</span>
        <span><b>Canvas</b>{stats.canvasWidth}×{stats.canvasHeight}</span>
      </div>
      <p>Press D to toggle this drawer.</p>
    </aside>
  );
}
