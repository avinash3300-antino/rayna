export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface ChatResponse {
  message: string;
  session_id: string;
}

export interface HistoryResponse {
  session_id: string;
  messages: Message[];
}

export interface ErrorResponse {
  error: string;
  details?: string;
}

export interface HealthResponse {
  status: string;
  service: string;
  milestone: number;
  timestamp: string;
}
