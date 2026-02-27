"use client";

import { useState, useEffect } from "react";
import { useChat } from "@/hooks/useChat";
import MessageList from "@/components/chat/MessageList";
import ChatInput from "@/components/chat/ChatInput";
import TypingIndicator from "@/components/chat/TypingIndicator";
import NewChatButton from "@/components/chat/NewChatButton";
import QuickPrompts from "@/components/ui/QuickPrompts";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function ChatPanel() {
  const { 
    messages, 
    isLoading, 
    error, 
    sendMessage, 
    clearChat, 
    shouldScrollToBottom, 
    consumeScrollTrigger 
  } = useChat();
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
    <div className="flex flex-col h-full w-full  ">

   
                  {/* Header */}
      <div className="flex items-center justify-between px-3 sm:px-4 md:px-6 py-3 sm:py-3.5 border-b border-[var(--border-color)]">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-20 sm:w-24 md:w-28 rounded-xl flex items-center justify-center flex-shrink-0">
            <img src="/raynatourslogo.webp" alt="Rayna Tours Logo" className="w-full h-auto" />
          </div>
          <div className="min-w-0">
            <h2 className="text-xs sm:text-sm font-semibold text-[var(--text-primary)] truncate">
              Rayna AI
            </h2>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50 flex-shrink-0" />
              <p className="text-xs text-[var(--text-secondary)]">Online</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <NewChatButton onClear={clearChat} disabled={isLoading} />
        </div>
      </div>

                  {/* Messages area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {messages.length === 0 ? (
          <div className="flex-1 overflow-y-auto">
            <QuickPrompts onSelect={sendMessage} />
          </div>
        ) : (
          <div className="flex-1 flex flex-col min-h-0">
            <MessageList 
              messages={messages} 
              animatingIndex={animatingIndex} 
              shouldScrollToBottom={shouldScrollToBottom}
              onScrollTriggered={consumeScrollTrigger}
            />
                        {isLoading && (
              <div className="px-3 sm:px-4 md:px-6 py-2">
                <TypingIndicator />
              </div>
            )}
          </div>
        )}
      </div>

            {/* Error bar */}
      {error && (
        <div className="px-3 sm:px-4 md:px-6 py-2.5 bg-red-500/10 border-t border-red-500/20">
          <p className="text-xs sm:text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Input */}
      <ChatInput onSend={sendMessage} disabled={isLoading} />

      
    </div>
  );
}
