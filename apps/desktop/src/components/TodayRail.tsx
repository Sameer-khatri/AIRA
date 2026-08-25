import { CheckCircle2, Cpu, FolderKanban, ListTodo, Radio } from "lucide-react";
import { HealthResponse, ModelStatus, Project, ProjectCheckpoint, ProjectTask } from "../lib/api";
import type { AiraPresenceState } from "../features/home/presence";

interface TodayRailProps {
  project: Project | null;
  latestCheckpoint: ProjectCheckpoint | null;
  activeTask: ProjectTask | null;
  health: HealthResponse | null;
  modelStatus: ModelStatus | null;
  connectionStatus: "loading" | "connected" | "disconnected";
  presenceState: AiraPresenceState;
}

function compactDate(value: string | null | undefined): string {
  if (!value) return "No checkpoint saved";
  return new Date(value).toLocaleDateString([], { month: "short", day: "numeric" });
}

export default function TodayRail({
  project,
  latestCheckpoint,
  activeTask,
  health,
  modelStatus,
  connectionStatus,
  presenceState,
}: TodayRailProps) {
  const modelOnline = modelStatus?.ollama === "online" && modelStatus.default_model_available;
  const backendOnline = connectionStatus === "connected" && health?.status === "ok";

  return (
    <section className={`today-rail today-rail-${presenceState}`} aria-label="Today with AIRA">
      <div className="rail-heading">
        <div>
          <span className="eyebrow">Today with AIRA</span>
          <h2>Continue from here.</h2>
        </div>
        <span className="rail-date">LOCAL MEMORY</span>
      </div>

      <div className="rail-items">
        <article className="rail-item rail-item-resume">
          <div className="rail-icon rail-icon-memory"><FolderKanban size={16} /></div>
          <div className="rail-copy">
            <span className="rail-label">Resume</span>
            <strong>{latestCheckpoint?.title || "No checkpoint saved"}</strong>
            <span>{latestCheckpoint ? `${project?.name || "Active project"} · ${compactDate(latestCheckpoint.created_at)}` : "Save a checkpoint when you stop."}</span>
          </div>
        </article>

        <article className="rail-item rail-item-next">
          <div className="rail-icon rail-icon-next"><ListTodo size={16} /></div>
          <div className="rail-copy">
            <span className="rail-label">Next</span>
            <strong>{activeTask?.title || "No active task"}</strong>
            <span>{activeTask ? `${activeTask.priority} priority · ${activeTask.status}` : "Add a task in Projects."}</span>
          </div>
        </article>

        <article className="rail-item rail-item-core">
          <div className={`rail-icon ${backendOnline && modelOnline ? "rail-icon-live" : "rail-icon-muted"}`}><Cpu size={16} /></div>
          <div className="rail-copy">
            <span className="rail-label">Core</span>
            <strong>{backendOnline ? "Backend ready" : "Backend offline"}</strong>
            <span>{modelOnline ? modelStatus?.default_model : "Local model offline"}</span>
          </div>
          <div className="rail-core-state"><Radio size={13} /> {backendOnline && modelOnline ? "READY" : "WAITING"}</div>
        </article>
      </div>

      <div className="rail-footnote"><CheckCircle2 size={13} /> Screen and camera access remain off until explicitly requested.</div>
    </section>
  );
}
