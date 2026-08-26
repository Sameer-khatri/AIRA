const API_BASE_URL = "http://127.0.0.1:8000/api";

export interface HealthResponse {
  status: string;
  app: string;
  mode: string;
  version: string;
  database: string;
}

export async function fetchHealth(): Promise<HealthResponse> {
  const response = await fetch(`${API_BASE_URL}/health`);
  if (!response.ok) {
    throw new Error("Failed to check health endpoint");
  }
  return response.json();
}

// ── Chat types ────────────────────────────────────────────────────────────────

export interface ChatRequest {
  message: string;
  conversation_id?: number | null;
}

export interface ChatResponse {
  conversation_id: number;
  reply: string;
  mode: string;
  status: string;
  model?: string;
  intent?: string;
  privacy_state?: string;
  project_context_used?: boolean;
}

export interface ConversationSummary {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: number;
  role: "user" | "assistant" | "system";
  content: string;
  created_at: string;
}

export interface ConversationDetail extends ConversationSummary {
  messages: ChatMessage[];
}

// ── Chat API functions ────────────────────────────────────────────────────────

export async function sendMessage(payload: ChatRequest): Promise<ChatResponse> {
  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error("Chat request failed");
  }
  return response.json();
}

export async function fetchConversations(): Promise<ConversationSummary[]> {
  const response = await fetch(`${API_BASE_URL}/conversations`);
  if (!response.ok) throw new Error("Failed to fetch conversations");
  return response.json();
}

// ── Project memory types ──────────────────────────────────────────────────────

export interface Project {
  id: number;
  name: string;
  description: string | null;
  status: string;
  current_milestone: string | null;
  current_focus: string | null;
  active_task: string | null;
  next_step: string | null;
  priority: string;
  deadline: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface ProjectCheckpoint {
  id: number;
  project_id: number;
  title: string;
  summary: string;
  completed_work: string | null;
  current_problem: string | null;
  decisions_made: string | null;
  next_action: string | null;
  user_focus_state: string | null;
  confidence: number | null;
  created_at: string | null;
}

export interface ProjectTask {
  id: number;
  project_id: number;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  due_date: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface ProjectDecision {
  id: number;
  project_id: number;
  decision: string;
  reason: string | null;
  impact: string | null;
  created_at: string | null;
}

export interface ProjectDetail extends Project {
  checkpoints: ProjectCheckpoint[];
  tasks: ProjectTask[];
  decisions: ProjectDecision[];
}

export interface LatestCheckpointResponse {
  project_id: number;
  checkpoint: ProjectCheckpoint | null;
  message: string | null;
}

export interface ProjectCreatePayload {
  name: string;
  description?: string | null;
  status?: string;
  current_milestone?: string | null;
  current_focus?: string | null;
  active_task?: string | null;
  next_step?: string | null;
  priority?: string;
  deadline?: string | null;
}

export interface ProjectUpdatePayload {
  name?: string;
  description?: string | null;
  status?: string;
  current_milestone?: string | null;
  current_focus?: string | null;
  active_task?: string | null;
  next_step?: string | null;
  priority?: string;
  deadline?: string | null;
}

export interface CheckpointCreatePayload {
  title: string;
  summary: string;
  completed_work?: string | null;
  current_problem?: string | null;
  decisions_made?: string | null;
  next_action?: string | null;
  user_focus_state?: string | null;
  confidence?: number | null;
}

export interface TaskCreatePayload {
  title: string;
  description?: string | null;
  status?: string;
  priority?: string;
  due_date?: string | null;
}

export interface TaskUpdatePayload {
  title?: string;
  description?: string | null;
  status?: string;
  priority?: string;
  due_date?: string | null;
}

export interface DecisionCreatePayload {
  decision: string;
  reason?: string | null;
  impact?: string | null;
}

// ── Project memory API functions ──────────────────────────────────────────────

export async function fetchProjects(): Promise<Project[]> {
  const response = await fetch(`${API_BASE_URL}/projects`);
  if (!response.ok) throw new Error("Failed to fetch projects");
  return response.json();
}

export async function fetchDefaultProject(): Promise<Project> {
  const response = await fetch(`${API_BASE_URL}/projects/active/default`);
  if (!response.ok) throw new Error("Failed to load the default active project");
  return response.json();
}

export async function createProject(payload: ProjectCreatePayload): Promise<Project> {
  const response = await fetch(`${API_BASE_URL}/projects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Failed to create project");
  return response.json();
}

export async function fetchProject(projectId: number): Promise<ProjectDetail> {
  const response = await fetch(`${API_BASE_URL}/projects/${projectId}`);
  if (!response.ok) throw new Error("Failed to fetch project");
  return response.json();
}

export async function updateProject(
  projectId: number,
  payload: ProjectUpdatePayload,
): Promise<Project> {
  const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Failed to update project");
  return response.json();
}

export async function createCheckpoint(
  projectId: number,
  payload: CheckpointCreatePayload,
): Promise<ProjectCheckpoint> {
  const response = await fetch(`${API_BASE_URL}/projects/${projectId}/checkpoints`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Failed to save checkpoint");
  return response.json();
}

export async function fetchCheckpoints(projectId: number): Promise<ProjectCheckpoint[]> {
  const response = await fetch(`${API_BASE_URL}/projects/${projectId}/checkpoints`);
  if (!response.ok) throw new Error("Failed to fetch checkpoints");
  return response.json();
}

export async function fetchLatestCheckpoint(
  projectId: number,
): Promise<LatestCheckpointResponse> {
  const response = await fetch(`${API_BASE_URL}/projects/${projectId}/checkpoints/latest`);
  if (!response.ok) throw new Error("Failed to fetch latest checkpoint");
  return response.json();
}

export async function createTask(
  projectId: number,
  payload: TaskCreatePayload,
): Promise<ProjectTask> {
  const response = await fetch(`${API_BASE_URL}/projects/${projectId}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Failed to create task");
  return response.json();
}

export async function fetchTasks(projectId: number): Promise<ProjectTask[]> {
  const response = await fetch(`${API_BASE_URL}/projects/${projectId}/tasks`);
  if (!response.ok) throw new Error("Failed to fetch tasks");
  return response.json();
}

export async function updateTask(
  projectId: number,
  taskId: number,
  payload: TaskUpdatePayload,
): Promise<ProjectTask> {
  const response = await fetch(`${API_BASE_URL}/projects/${projectId}/tasks/${taskId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Failed to update task");
  return response.json();
}

export async function createDecision(
  projectId: number,
  payload: DecisionCreatePayload,
): Promise<ProjectDecision> {
  const response = await fetch(`${API_BASE_URL}/projects/${projectId}/decisions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Failed to save decision");
  return response.json();
}

export async function fetchDecisions(projectId: number): Promise<ProjectDecision[]> {
  const response = await fetch(`${API_BASE_URL}/projects/${projectId}/decisions`);
  if (!response.ok) throw new Error("Failed to fetch decisions");
  return response.json();
}

// ── Model status ──────────────────────────────────────────────────────────────

export interface ModelStatus {
  ollama: "online" | "offline";
  default_model: string;
  default_model_available: boolean;
  available_models: string[];
  base_url: string;
  error?: string;
}

export async function fetchModelStatus(): Promise<ModelStatus> {
  const response = await fetch(`${API_BASE_URL}/models/status`);
  if (!response.ok) throw new Error("Failed to fetch model status");
  return response.json();
}
