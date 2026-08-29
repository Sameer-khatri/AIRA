import { ArrowRight, BrainCircuit, CalendarDays, CheckCircle2, Clock3, FolderKanban, MessageCircle, RotateCcw, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import AvatarStage from "../../components/AvatarStage";
import LivingBackground from "../../components/LivingBackground";
import WaterRippleStage from "../../components/WaterRippleStage";
import { fetchDefaultProject, fetchLatestCheckpoint, fetchTasks, type HealthResponse, type ModelStatus, type Project, type ProjectCheckpoint, type ProjectTask } from "../../lib/api";
import type { AiraConnectionState, AiraPresenceState } from "./presence";
import "./living-home.css";
import "./living-home-phase2-corrections.css";

type HomeFocus = "default" | "today" | "memory";
interface HomePageProps { health: HealthResponse|null; modelStatus: ModelStatus|null; connectionStatus:"loading"|"connected"|"disconnected"; onNavigate:(tab:string)=>void; }
const isOpenTask=(task:ProjectTask)=>!["done","completed","closed"].includes(task.status.toLowerCase());
const dateLabel=(value:string|null|undefined)=>value?new Date(value).toLocaleString([],{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"}):"No checkpoint saved";

export default function HomePage({health,modelStatus,connectionStatus,onNavigate}:HomePageProps){
 const[project,setProject]=useState<Project|null>(null),[checkpoint,setCheckpoint]=useState<ProjectCheckpoint|null>(null),[task,setTask]=useState<ProjectTask|null>(null),[presence,setPresence]=useState<AiraPresenceState>("booting"),[focus,setFocus]=useState<HomeFocus>("default"),[contextLoading,setContextLoading]=useState(true),[contextError,setContextError]=useState(false);const bootTimer=useRef<number|undefined>(),engagedTimer=useRef<number|undefined>();
 const connection:AiraConnectionState=connectionStatus==="connected"?"online":connectionStatus==="disconnected"?"offline":"checking";
 const clearTimer=useCallback(()=>{window.clearTimeout(engagedTimer.current);engagedTimer.current=undefined;},[]);
 useEffect(()=>{bootTimer.current=window.setTimeout(()=>setPresence("idle"),650);return()=>{window.clearTimeout(bootTimer.current);clearTimer();};},[clearTimer]);
 const load=useCallback(async()=>{setContextLoading(true);setContextError(false);try{const active=await fetchDefaultProject();const[latest,tasks]=await Promise.all([fetchLatestCheckpoint(active.id),fetchTasks(active.id)]);setProject(active);setCheckpoint(latest.checkpoint);setTask(tasks.find(isOpenTask)??null);}catch{setProject(null);setCheckpoint(null);setTask(null);setContextError(true);}finally{setContextLoading(false);}},[]);
 useEffect(()=>{void load();},[load]);
 const engage=()=>{clearTimer();setFocus("default");setPresence("engaged");engagedTimer.current=window.setTimeout(()=>setPresence("idle"),2200);};
 const selectFocus=(next:HomeFocus)=>{clearTimer();setFocus(next);setPresence(next==="today"?"presenting":"idle");};
 const closeFocus=()=>selectFocus("default");
 const ready=connection==="online"&&health?.status==="ok"; const modelReady=Boolean(modelStatus?.default_model_available);
 return <section className={`living-home living-home-phase2 living-home-focus-${focus}`} data-connection={connection} aria-label="AIRA Living Home">
  <LivingBackground state={presence} connectionState={connection} focus={focus}/><span className="living-home-label">AIRA / LIVING HOME</span>
  <div className="aira-scene"><WaterRippleStage presenceState={presence} connectionState={connection}/><AvatarStage presenceState={presence} connectionState={connection} onEngage={engage}/></div>
  <main className="home-orbit-content">
   <section className="home-data-anchor home-resume-anchor" aria-labelledby="resume-title"><span className="home-anchor-kicker"><RotateCcw size={13}/>Resume point</span><h2 id="resume-title">{contextLoading?"Gathering your last checkpoint…":checkpoint?.title??"No checkpoint saved"}</h2><p>{project?.name??(contextError?"Project context unavailable":"No active project")}</p><span className="home-anchor-meta"><Clock3 size={12}/>{dateLabel(checkpoint?.created_at)}</span><button type="button" onClick={()=>onNavigate(checkpoint?"chat":"projects")}>{checkpoint?"Continue with AIRA":"Open Projects"}<ArrowRight size={14}/></button></section>
   <section className="home-data-anchor home-mission-anchor" aria-labelledby="mission-title"><span className="home-anchor-kicker"><CalendarDays size={13}/>Today’s mission</span><h2 id="mission-title">{contextLoading?"Finding the next action…":task?.title??"No active task"}</h2><p>{task?`${task.priority} priority · ${task.status}`:"Choose a real task from Projects when you’re ready."}</p><button type="button" onClick={()=>onNavigate(task?"chat":"projects")}>{task?"Work with AIRA":"Go to Projects"}<ArrowRight size={14}/></button></section>
   {focus==="today"&&<section className="home-focus-space home-today-space" aria-label="Today focus"><header><span>Today focus</span><button type="button" onClick={closeFocus} aria-label="Close Today focus"><X size={17}/></button></header><div className="mission-path" aria-label="Mission path"><div className="mission-step is-known"><i/><span>Checkpoint</span><strong>{checkpoint?.title??"Not saved"}</strong></div><div className={`mission-step ${task?"is-active":""}`}><i/><span>Current task</span><strong>{task?.title??"No active task"}</strong></div><div className="mission-step"><i/><span>Completion</span><strong>{task?"Ready when shipped":"Waiting for a task"}</strong></div></div></section>}
   {focus==="memory"&&<section className="home-focus-space home-memory-space" aria-label="Memory focus"><header><div><span>Structured project memory</span><h2>{project?.name??"No active project"}</h2></div><button type="button" onClick={closeFocus} aria-label="Close Memory focus"><X size={17}/></button></header><div className="memory-constellation"><article><i/><span>Latest checkpoint</span><strong>{checkpoint?.title??"No checkpoint saved"}</strong></article><article><i/><span>Next task</span><strong>{task?.title??"No active task"}</strong></article><article><i/><span>Runtime</span><strong>{ready?"Backend ready":"Backend offline"} · {modelReady?modelStatus?.default_model:"Model unavailable"}</strong></article></div><button className="memory-project-link" type="button" onClick={()=>onNavigate("projects")}>Open project memory<ArrowRight size={14}/></button></section>}
  </main>
  <div className="home-readiness" data-ready={ready&&modelReady||undefined}><CheckCircle2 size={14}/><span>{connection==="checking"?"Checking local systems":!ready?"Backend connection unavailable":modelReady?"AIRA is ready":"Backend ready · local model unavailable"}</span></div>
  <div className="scene-controls scene-controls-left" aria-label="Home focus controls"><button className={focus==="today"?"is-active":""} type="button" onClick={()=>selectFocus(focus==="today"?"default":"today")}><CalendarDays size={17}/>Today</button><button className={focus==="memory"?"is-active":""} type="button" onClick={()=>selectFocus(focus==="memory"?"default":"memory")}><BrainCircuit size={17}/>Memory</button><button type="button" onClick={()=>onNavigate("projects")}><FolderKanban size={17}/>Projects</button></div>
  <div className="scene-controls scene-controls-right"><button className="scene-action-talk" type="button" onClick={()=>onNavigate("chat")}><MessageCircle size={18}/>Talk to AIRA<ArrowRight size={16}/></button></div>
 </section>;
}
