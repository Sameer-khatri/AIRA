import { BrainCircuit, MessageSquare, Mic2, Orbit, Projector, Sparkles } from "lucide-react";

const activeCapabilities = [
  { label: "Local Chat", icon: MessageSquare },
  { label: "Brain Layer", icon: BrainCircuit },
  { label: "Project Memory", icon: Projector },
];

const plannedCapabilities = [
  { label: "Chat + Memory", icon: Sparkles },
  { label: "Voice", icon: Mic2 },
  { label: "Desktop Presence", icon: Orbit },
];

export default function CapabilityStrip() {
  return (
    <section className="capability-strip" aria-label="AIRA capabilities">
      <div className="capability-group capability-group-active">
        <span className="capability-group-label">Active</span>
        <div className="capability-list">
          {activeCapabilities.map(({ label, icon: Icon }) => (
            <span className="capability-pill" key={label}><Icon size={13} /> {label}</span>
          ))}
        </div>
      </div>
      <div className="capability-group capability-group-planned">
        <span className="capability-group-label">Next</span>
        <div className="capability-list">
          {plannedCapabilities.map(({ label, icon: Icon }) => (
            <span className="capability-pill" key={label}><Icon size={13} /> {label}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
