import "./config"; // load .env first
import express from "express";
import cors from "cors";
import { config } from "./config";
import chatRouter from "./chat/chat.router";
import { chatRateLimiter } from "./common/rate-limiter";

const app = express();

// ── Middleware ─────────────────────────────────────────────
app.use(cors({
  origin: config.server.corsOrigin,
  methods: ["GET", "POST", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

// ── Routes ─────────────────────────────────────────────────
// Rate limit only the chat endpoint (not health checks)
app.use("/api/chat", chatRateLimiter, chatRouter);

// Root health check
app.get("/", (_req, res) => {
  res.json({
    name: "Rayna Tours Chatbot API",
    version: "1.0.0",
    milestone: 1,
    status: "running",
    endpoints: {
      chat:    "POST /api/chat",
      history: "GET  /api/chat/history/:sessionId",
      clear:   "DELETE /api/chat/session/:sessionId",
      health:  "GET  /api/chat/health",
    },
  });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("[App] Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// ── Start server ───────────────────────────────────────────
app.listen(config.server.port, () => {
  console.log(`
  ╔════════════════════════════════════════╗
  ║   🌍 Rayna Tours Chatbot — Running     ║
  ║                                        ║
  ║   Port      : ${config.server.port}                    ║
  ║   Env        : ${config.server.nodeEnv}              ║
  ║   LLM        : ${config.llm.provider}                  ║
  ║   Milestone  : 1 (Tour Discovery)      ║
  ║                                        ║
  ║   POST http://localhost:${config.server.port}/api/chat  ║
  ╚════════════════════════════════════════╝
  `);
});

export default app;