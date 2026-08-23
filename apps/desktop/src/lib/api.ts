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
