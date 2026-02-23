import type { ChatResponse, HistoryResponse, HealthResponse } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new ApiError(res.status, data.error || "Request failed", data.details);
  }

  return data as T;
}

export const api = {
  sendMessage(message: string, sessionId?: string) {
    return request<ChatResponse>("/api/chat", {
      method: "POST",
      body: JSON.stringify({ message, session_id: sessionId }),
    });
  },

  getHistory(sessionId: string, limit = 50) {
    return request<HistoryResponse>(
      `/api/chat/history/${sessionId}?limit=${limit}`
    );
  },

  clearSession(sessionId: string) {
    return request<{ success: boolean }>(
      `/api/chat/session/${sessionId}`,
      { method: "DELETE" }
    );
  },

  healthCheck() {
    return request<HealthResponse>("/api/chat/health");
  },
};
