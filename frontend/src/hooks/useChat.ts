"use client";

import { useState, useCallback, useEffect } from "react";
import { api } from "@/lib/api";
import { getSessionId, setSessionId, clearSessionId } from "@/lib/session";
import { HISTORY_LIMIT } from "@/lib/constants";
import type { Message } from "@/lib/types";

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // On mount: restore chat history if we have a saved session
  useEffect(() => {
    const sessionId = getSessionId();
    if (sessionId) {
      api
        .getHistory(sessionId, HISTORY_LIMIT)
        .then((data) => {
          if (data.messages.length > 0) {
            setMessages(data.messages);
          }
        })
        .catch(() => {
          // Session expired server-side, clear stale ID
          clearSessionId();
        });
    }
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    setError(null);

    // Optimistically add user message
    const userMsg: Message = { role: "user", content };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const sessionId = getSessionId() || undefined;
      const response = await api.sendMessage(content, sessionId);

      // Persist session ID
      setSessionId(response.session_id);

      // Add assistant response
      const assistantMsg: Message = {
        role: "assistant",
        content: response.message,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      if (message.includes("Too many")) {
        setError("You're sending messages too quickly. Please wait a moment.");
      } else {
        setError(message);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearChat = useCallback(async () => {
    const sessionId = getSessionId();
    if (sessionId) {
      try {
        await api.clearSession(sessionId);
      } catch {
        // Ignore — session may already be expired
      }
    }
    clearSessionId();
    setMessages([]);
    setError(null);
  }, []);

  return { messages, isLoading, error, sendMessage, clearChat };
}
