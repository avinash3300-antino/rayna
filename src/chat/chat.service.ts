import { RaynaApiService } from "./rayna-api.service";
import { SessionService } from "./session.service";
import { createLLMProvider, LLMProvider } from "./llm.provider";
import { ALL_TOOLS, ToolName } from "./tools";
import { SYSTEM_PROMPT } from "./prompts/system.prompt";

// ─────────────────────────────────────────────────────────
// ChatService — The core orchestrator
//
// Flow per message:
// 1. Load session history (last N messages)
// 2. Add user message
// 3. Call LLM → if tool_use: execute tools → loop back
// 4. Save assistant reply to session
// 5. Return final text to controller
// ─────────────────────────────────────────────────────────
export class ChatService {
  private llm: LLMProvider;
  private raynaApi: RaynaApiService;
  private sessionService: SessionService;

  constructor() {
    this.llm = createLLMProvider();
    this.raynaApi = new RaynaApiService();
    this.sessionService = new SessionService();
  }

  // ── Main chat method ──────────────────────────────────────
  async chat(
    sessionId: string,
    userMessage: string,
    userId?: string
  ): Promise<{ reply: string; sessionId: string }> {

    // 1. Save user message to session
    this.sessionService.addMessage(
      sessionId,
      { role: "user", content: userMessage },
      userId
    );

    // 2. Get context for LLM (last N messages)
    const messages = this.sessionService.getContext(sessionId);

    // 3. Agentic loop — keeps running until LLM returns final text
    const finalText = await this.runAgentLoop(messages, sessionId);

    return { reply: finalText, sessionId };
  }

  // ── Agentic loop ──────────────────────────────────────────
  // Handles multi-step tool calling automatically
  // e.g. "Dubai tours under 200 AED" might trigger:
  //   → get_available_cities → get_all_products → response
  private async runAgentLoop(
    messages: Array<{ role: "user" | "assistant"; content: unknown }>,
    sessionId: string
  ): Promise<string> {
    const MAX_ITERATIONS = 5; // safety cap — prevents infinite loops
    let iterations = 0;

    while (iterations < MAX_ITERATIONS) {
      iterations++;
      console.log(`[ChatService] Agent loop iteration ${iterations}`);

      const response = await this.llm.chat(messages, SYSTEM_PROMPT, ALL_TOOLS);

      // Add LLM response to local message array for next iteration
      messages.push({ role: "assistant", content: response.rawContent });

      // ── LLM is done — return the final text ────────────────
      if (!this.llm.isToolUse(response)) {
        // Save final assistant reply to session
        this.sessionService.addMessage(sessionId, {
          role: "assistant",
          content: response.text,
        });
        return response.text;
      }

      // ── LLM wants to call tools ────────────────────────────
      const toolCalls = this.llm.extractToolCalls(response);
      console.log(`[ChatService] Tool calls requested:`, toolCalls.map((t) => t.name));

      // Execute all tool calls in parallel (faster than sequential)
      const toolResults = await Promise.all(
        toolCalls.map(async (call) => {
          const result = await this.raynaApi.execute(
            call.name as ToolName,
            call.input
          );
          console.log(`[ChatService] Tool "${call.name}" completed`);
          return { id: call.id, content: result };
        })
      );

      // Feed tool results back to LLM — loop continues
      const toolResultMessage = this.llm.buildToolResultMessage(toolResults);
      messages.push(toolResultMessage);
    }

    // Safety fallback — should rarely happen
    console.warn("[ChatService] Max iterations reached");
    return "I'm having trouble processing that right now. Please try again or visit raynatours.com for assistance.";
  }

  // ── Get chat history for UI ───────────────────────────────
  getHistory(sessionId: string, limit = 10) {
    return this.sessionService.getHistory(sessionId, limit);
  }

  // ── Clear session (user clicks "New Chat") ────────────────
  clearSession(sessionId: string) {
    this.sessionService.delete(sessionId);
  }
}