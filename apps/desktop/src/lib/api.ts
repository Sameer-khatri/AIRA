export interface HealthResponse {
  status: string;
  app: string;
  mode: string;
  version: string;
  database: string;
}

export async function fetchHealth(): Promise<HealthResponse> {
  const response = await fetch("http://127.0.0.1:8000/api/health");
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
  const response = await fetch("http://127.0.0.1:8000/api/chat", {
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
  const response = await fetch("http://127.0.0.1:8000/api/conversations");
  if (!response.ok) throw new Error("Failed to fetch conversations");
  return response.json();
}
