"use client";

import { useState, useRef, useCallback } from "react";
import { MAX_MESSAGE_LENGTH } from "@/lib/constants";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [input, disabled, onSend]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value.slice(0, MAX_MESSAGE_LENGTH);
    setInput(value);

    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 120) + "px";
    }
  };

  return (
    <div className="p-5 md:px-6 border-t border-white/5">
      <div className="flex items-end gap-3 max-w-3xl mx-auto">
        <div className="flex-1 glass rounded-xl focus-within:border-amber-500/40 focus-within:shadow-[0_0_15px_rgba(245,158,11,0.1)] transition-all">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask about tours, activities, cruises..."
            disabled={disabled}
            rows={1}
            className="w-full resize-none bg-transparent p-4 text-sm text-black placeholder-gray-500 focus:outline-none disabled:opacity-40 border-[1px] border-gray-600 rounded-3xl"
          />
        </div>
        <button
          onClick={handleSend}
          disabled={disabled || !input.trim()}
          className="rounded-xl bg-linear-to-r from-amber-500 to-orange-500 p-3.5 text-white hover:from-amber-400 hover:to-orange-400 disabled:opacity-30 transition-all shrink-0 shadow-lg shadow-amber-500/20 disabled:shadow-none"
          aria-label="Send message"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
            />
          </svg>
        </button>
      </div>
      {input.length > 900 && (
        <p className="text-xs text-black mt-1.5 text-right max-w-3xl mx-auto">
          {input.length}/{MAX_MESSAGE_LENGTH}
        </p>
      )}
    </div>
  );
}
