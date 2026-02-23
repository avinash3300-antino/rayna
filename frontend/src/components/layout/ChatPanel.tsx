"use client";

import { useState, useEffect } from "react";
import { useChat } from "@/hooks/useChat";
import MessageList from "@/components/chat/MessageList";
import ChatInput from "@/components/chat/ChatInput";
import TypingIndicator from "@/components/chat/TypingIndicator";
import NewChatButton from "@/components/chat/NewChatButton";
import QuickPrompts from "@/components/ui/QuickPrompts";

export default function ChatPanel() {
  const { messages, isLoading, error, sendMessage, clearChat } = useChat();
  const [animatingIndex, setAnimatingIndex] = useState<number | null>(null);

  // When a new assistant message arrives, trigger typewriter on it
  useEffect(() => {
    if (messages.length === 0) return;
    const lastMsg = messages[messages.length - 1];
    if (lastMsg.role === "assistant" && !isLoading) {
      setAnimatingIndex(messages.length - 1);
    }
  }, [messages.length, isLoading, messages]);

  return (
    <div className="flex flex-col h-full w-full bg-(--bg-primary)">
      {/* Header */}
      <div className="flex items-center justify-between px-4 md:px-6 py-3.5 border-b border-white/5 bg-(--bg-secondary)">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-linear-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <span className="text-white text-sm font-bold">R</span>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-100">
              Rayna AI
            </h2>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
              <p className="text-xs text-gray-500">Online</p>
            </div>
          </div>
        </div>
        <NewChatButton onClear={clearChat} disabled={isLoading} />
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {messages.length === 0 ? (
          <QuickPrompts onSelect={sendMessage} />
        ) : (
          <MessageList messages={messages} animatingIndex={animatingIndex} />
        )}
        {isLoading && <TypingIndicator />}
      </div>

      {/* Error bar */}
      {error && (
        <div className="px-4 md:px-6 py-2.5 bg-red-500/10 border-t border-red-500/20">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Input */}
      <ChatInput onSend={sendMessage} disabled={isLoading} />
    </div>
  );
}
