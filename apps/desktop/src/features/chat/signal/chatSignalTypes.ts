declare global { interface Array<T> { at(index: number): T | undefined; } }

export type ChatSignalPhase = "idle" | "user_message" | "thinking" | "memory_confirmed" | "responding" | "complete" | "offline" | "error";
export type MotionProfile = "normal" | "low-power" | "reduced-motion";
export interface ChatTurn { id:string; conversationId?:number; userMessage:string; assistantReply?:string; intent?:string; privacyState?:string; model?:string; projectContextUsed?:boolean; status:"pending"|"complete"|"error"; createdAt:string; }
export interface Point { x:number; y:number; }
export interface ExclusionRect { x:number; y:number; width:number; height:number; }
export interface ChatSignalLayout { width:number; height:number; airaHand:Point; userMessageAnchor:Point; thinkingCore:Point; memoryAnchor:Point; responseAnchor:Point; exclusionRects:ExclusionRect[]; }
export interface ChatSignalStats { fps:number; particles:number; dpr:number; canvasWidth:number; canvasHeight:number; }
