import { config } from "../config";

export interface LLMMessage {
  role: "user" | "assistant";
  content: unknown;
}

export interface LLMResponse {
  text: string;
  rawContent: unknown[];
  stopReason: string;
}

// ─────────────────────────────────────────────────────────
// LLMProvider — Abstract interface
// Swap providers by changing LLM_PROVIDER in .env
// ─────────────────────────────────────────────────────────
export abstract class LLMProvider {
  abstract chat(
    messages: LLMMessage[],
    systemPrompt: string,
    tools: unknown[]
  ): Promise<LLMResponse>;

  abstract isToolUse(response: LLMResponse): boolean;
  abstract extractToolCalls(response: LLMResponse): Array<{ id: string; name: string; input: Record<string, unknown> }>;
  abstract buildToolResultMessage(toolResults: Array<{ id: string; content: string }>): LLMMessage;
}

// ─────────────────────────────────────────────────────────
// Claude Provider (Anthropic)
// ─────────────────────────────────────────────────────────
export class ClaudeProvider extends LLMProvider {
  private client: import("@anthropic-ai/sdk").default;

  constructor() {
    super();
    const Anthropic = require("@anthropic-ai/sdk").default;
    this.client = new Anthropic({ apiKey: config.llm.anthropicApiKey });
  }

  async chat(messages: LLMMessage[], systemPrompt: string, tools: unknown[]): Promise<LLMResponse> {
    const response = await this.client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2048,
      system: systemPrompt,
      tools: tools as never,
      messages: messages as never,
    });

    // ───────────── Type Guards ─────────────
    interface TextBlock { type: "text"; text: string }
    interface ToolUseBlock { type: "tool_use"; id: string; name: string; input: Record<string, unknown> }

    // Extract only text blocks safely
    const text = (response.content as unknown[])
      .filter((b): b is TextBlock => (b as any).type === "text")
      .map((b) => b.text)
      .join("");

    return {
      text,
      rawContent: response.content,
      stopReason: response.stop_reason ?? "end_turn",
    };
  }

  isToolUse(response: LLMResponse): boolean {
    return response.stopReason === "tool_use";
  }

  extractToolCalls(response: LLMResponse) {
    interface ToolUseBlock { type: "tool_use"; id: string; name: string; input: Record<string, unknown> }
    return (response.rawContent as unknown[])
      .filter((b): b is ToolUseBlock => (b as any).type === "tool_use")
      .map((b) => ({ id: b.id, name: b.name, input: b.input }));
  }

  buildToolResultMessage(toolResults: Array<{ id: string; content: string }>): LLMMessage {
    return {
      role: "user",
      content: toolResults.map((r) => ({
        type: "tool_result",
        tool_use_id: r.id,
        content: r.content,
      })),
    };
  }
}

// ─────────────────────────────────────────────────────────
// Factory — Returns the right provider based on .env
// ─────────────────────────────────────────────────────────
export function createLLMProvider(): LLMProvider {
  switch (config.llm.provider) {
    case "claude":
      return new ClaudeProvider();
    // case "openai":
    //   return new OpenAIProvider();
    default:
      console.warn(`[LLMProvider] Unknown provider "${config.llm.provider}", defaulting to Claude`);
      return new ClaudeProvider();
  }
}