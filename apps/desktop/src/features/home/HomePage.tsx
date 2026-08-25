import { AnimatePresence, motion } from "motion/react";
import "./living-home.css";
import { ArrowRight, BrainCircuit, CalendarDays, FolderKanban, MessageCircle, Phone, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import AvatarStage from "../../components/AvatarStage";
import LivingBackground from "../../components/LivingBackground";
import TodayRail from "../../components/TodayRail";
import WaterRippleStage from "../../components/WaterRippleStage";
import {
  fetchDefaultProject,
  fetchLatestCheckpoint,
  fetchTasks,
  type HealthResponse,
  type ModelStatus,
  type Project,
  type ProjectCheckpoint,
  type ProjectTask,
} from "../../lib/api";
import type { AiraConnectionState, AiraPresenceState } from "./presence";

interface HomePageProps {
  health: HealthResponse | null;
  modelStatus: ModelStatus | null;
  connectionStatus: "loading" | "connected" | "disconnected";
  onNavigate: (tab: string) => void;
}

const isOpenTask = (task: ProjectTask) => !["done", "completed", "closed"].includes(task.status.toLowerCase());

export default function HomePage({ health, modelStatus, connectionStatus, onNavigate }: HomePageProps) {
  const [project, setProject] = useState<Project | null>(null);
  const [latestCheckpoint, setLatestCheckpoint] = useState<ProjectCheckpoint | null>(null);
  const [activeTask, setActiveTask] = useState<ProjectTask | null>(null);
  const [presenceState, setPresenceState] = useState<AiraPresenceState>("booting");
  const [todayOpen, setTodayOpen] = useState(false);
  const [memoryOpen, setMemoryOpen] = useState(false);
  const bootTimer = useRef<number | undefined>();
  const waveTimer = useRef<number | undefined>();
  const engagedTimer = useRef<number | undefined>();

  const connectionState: AiraConnectionState = connectionStatus === "connected"
    ? "online"
    : connectionStatus === "disconnected" ? "offline" : "checking";

  const clearActionTimers = useCallback(() => {
    window.clearTimeout(waveTimer.current);
    window.clearTimeout(engagedTimer.current);
    waveTimer.current = undefined;
    engagedTimer.current = undefined;
  }, []);

  useEffect(() => {
    bootTimer.current = window.setTimeout(() => setPresenceState("idle"), 650);
    return () => {
      window.clearTimeout(bootTimer.current);
      clearActionTimers();
    };
  }, [clearActionTimers]);

  useEffect(() => {
    const loadContext = async () => {
      try {
        const activeProject = await fetchDefaultProject();
        const [checkpoint, tasks] = await Promise.all([fetchLatestCheckpoint(activeProject.id), fetchTasks(activeProject.id)]);
        setProject(activeProject);
        setLatestCheckpoint(checkpoint.checkpoint);
        setActiveTask(tasks.find(isOpenTask) ?? tasks[0] ?? null);
      } catch {
        setProject(null);
        setLatestCheckpoint(null);
        setActiveTask(null);
      }
    };
    void loadContext();
  }, []);

  const closePanels = () => {
    setTodayOpen(false);
    setMemoryOpen(false);
  };

  const engage = () => {
    clearActionTimers();
    closePanels();
    setPresenceState("engaged");
    engagedTimer.current = window.setTimeout(() => setPresenceState("idle"), 2200);
  };

  const callAira = () => {
    clearActionTimers();
    closePanels();
    setPresenceState("waving");
    waveTimer.current = window.setTimeout(() => {
      setPresenceState("idle");
      waveTimer.current = undefined;
    }, 1650);
  };

  const openToday = () => {
    clearActionTimers();
    setMemoryOpen(false);
    setTodayOpen(true);
    setPresenceState("presenting");
  };

  const openMemory = () => {
    clearActionTimers();
    setTodayOpen(false);
    setMemoryOpen(true);
    setPresenceState("idle");
  };

  const closeToday = () => { setTodayOpen(false); setPresenceState("idle"); };
  const closeMemory = () => { setMemoryOpen(false); setPresenceState("idle"); };

  return (
    <section className={`living-home ${memoryOpen ? "living-home-memory-open" : ""}`} aria-label="AIRA Living Home">
      <LivingBackground state={presenceState} connectionState={connectionState} />
      <span className="living-home-label">AIRA / LIVING HOME</span>
      <div className="aira-scene">
        <WaterRippleStage presenceState={presenceState} connectionState={connectionState} />
        <AvatarStage presenceState={presenceState} connectionState={connectionState} onEngage={engage} />
      </div>
      <div className="scene-controls scene-controls-left" aria-label="Home controls">
        <button className={todayOpen ? "is-active" : ""} type="button" onClick={openToday}><CalendarDays size={17} />Today</button>
        <button type="button" onClick={() => onNavigate("projects")}><FolderKanban size={17} />Projects</button>
        <button className={memoryOpen ? "is-active" : ""} type="button" onClick={openMemory}><BrainCircuit size={17} />Memory</button>
      </div>
      <div className="scene-controls scene-controls-right" aria-label="AIRA actions">
        <button className="scene-action-talk" type="button" onClick={() => onNavigate("chat")}><MessageCircle size={18} />Talk to AIRA <ArrowRight size={16} /></button>
        <button className="scene-action-call" type="button" onClick={callAira}><Phone size={18} />Call AIRA</button>
      </div>
      <AnimatePresence>
        {todayOpen && <motion.aside className="living-panel today-panel" initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={{ duration: 0.38, ease: [0.22, 0.8, 0.24, 1] }}><header className="living-panel-header"><div><span>Today with AIRA</span><h2>Continue from here.</h2></div><button type="button" onClick={closeToday} aria-label="Close Today panel"><X size={17} /></button></header><TodayRail project={project} latestCheckpoint={latestCheckpoint} activeTask={activeTask} health={health} modelStatus={modelStatus} connectionStatus={connectionStatus} presenceState={presenceState} /></motion.aside>}
        {memoryOpen && <motion.aside className="living-panel memory-panel" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 18 }} transition={{ duration: 0.38, ease: [0.22, 0.8, 0.24, 1] }}><header className="living-panel-header"><div><span>Project memory</span><h2>{project?.name ?? "AIRA workspace"}</h2></div><button type="button" onClick={closeMemory} aria-label="Close Memory panel"><X size={17} /></button></header><dl className="memory-summary"><div><dt>Latest checkpoint</dt><dd>{latestCheckpoint?.title ?? "No checkpoint saved"}</dd></div><div><dt>Next task</dt><dd>{activeTask?.title ?? "No active task"}</dd></div><div><dt>Runtime</dt><dd>{connectionState === "online" && health?.status === "ok" ? "Backend ready" : "Backend offline"} · {modelStatus?.default_model_available ? modelStatus.default_model : "Local model offline"}</dd></div></dl></motion.aside>}
      </AnimatePresence>
    </section>
  );
}
