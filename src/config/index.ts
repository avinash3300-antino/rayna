import dotenv from "dotenv";
dotenv.config();

function required(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required env var: ${key}`);
  return val;
}

function optional(key: string, fallback: string): string {
  return process.env[key] ?? fallback;
}

export const config = {
  server: {
    port: parseInt(optional("PORT", "3001")),
    nodeEnv: optional("NODE_ENV", "development"),
    corsOrigin: optional("CORS_ORIGIN", "http://localhost:3000"),
  },

  llm: {
    // Easily switch LLM provider here
    provider: optional("LLM_PROVIDER", "grok") as "claude" | "openai" | "gemini" | "grok",
    anthropicApiKey: optional("ANTHROPIC_API_KEY", ""),
    openaiApiKey: optional("OPENAI_API_KEY", ""),
    geminiApiKey: optional("GEMINI_API_KEY", ""),
    grokApiKey: optional("GROK_API_KEY", ""),
  },

  rayna: {
    baseUrl: optional("RAYNA_API_BASE_URL", "https://earnest-panda-e8edbd.netlify.app/api"),
  },

  session: {
    // Number of messages sent to Claude as context (keeps cost low)
    maxMessages: parseInt(optional("SESSION_MAX_MESSAGES", "10")),
    // Session TTL in minutes
    ttlMinutes: parseInt(optional("SESSION_TTL_MINUTES", "30")),
  },

  rateLimit: {
    windowMs: parseInt(optional("RATE_LIMIT_WINDOW_MS", "60000")),
    maxRequests: parseInt(optional("RATE_LIMIT_MAX_REQUESTS", "20")),
  },
} as const;