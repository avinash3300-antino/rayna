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
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(false);

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
        tourCarousel: response.tourCarousel,
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setShouldScrollToBottom(true);
        } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Something went wrong";
      
      let chatErrorMessage: string;
      
      if (errorMessage.includes("Too many")) {
        chatErrorMessage = "I'm receiving messages too quickly. Please wait a moment before sending another message. 🕐";
      } else if (errorMessage.includes("timeout") || errorMessage.includes("ECONNABORTED")) {
        chatErrorMessage = "I'm taking longer than usual to respond. This might be due to high demand. Please try asking again. ⏱️";
      } else if (errorMessage.includes("Network") || errorMessage.includes("fetch")) {
        chatErrorMessage = "I'm having trouble connecting right now. Please check your internet connection and try again. 🌐";
      } else if (errorMessage.includes("500") || errorMessage.includes("Internal Server Error")) {
        chatErrorMessage = "I'm experiencing some technical difficulties. Please try again in a moment, or visit raynatours.com for assistance. 🔧";
      } else {
        chatErrorMessage = "I encountered an issue processing your request. Please try rephrasing your question or visit raynatours.com for assistance. 💫";
      }
      
      // Add error as assistant message instead of showing error banner
      const errorMsg: Message = {
        role: "assistant",
        content: chatErrorMessage,
      };
            setMessages((prev) => [...prev, errorMsg]);
      setShouldScrollToBottom(true);
      
      // Clear any existing error state
      setError(null);
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

  // Reset scroll trigger after it's been consumed
  const consumeScrollTrigger = useCallback(() => {
    setShouldScrollToBottom(false);
  }, []);

  return { 
    messages, 
    isLoading, 
    error, 
    sendMessage, 
    clearChat, 
    shouldScrollToBottom,
    consumeScrollTrigger 
  };
}
