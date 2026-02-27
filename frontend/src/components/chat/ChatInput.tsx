"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { MAX_MESSAGE_LENGTH } from "@/lib/constants";
import { useSpeechToText } from "@/hooks/useSpeechToText";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Speech-to-text functionality
  const {
    transcript,
    isListening,
    isSupported: isSpeechSupported,
    startListening,
    stopListening,
    clearTranscript,
    error: speechError
  } = useSpeechToText({
    continuous: false,
    interimResults: true,
    language: 'en-US'
  });

    const handleSend = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setInput("");
    clearTranscript();
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [input, disabled, onSend, clearTranscript]);

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

  // Update input when speech transcript changes
  useEffect(() => {
    if (transcript) {
      setInput(transcript);
      const el = textareaRef.current;
      if (el) {
        el.style.height = "auto";
        el.style.height = Math.min(el.scrollHeight, 120) + "px";
      }
    }
  }, [transcript]);

  const handleMicClick = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      clearTranscript();
      setInput(""); // Clear current input
      startListening();
    }
  }, [isListening, startListening, stopListening, clearTranscript]);

  return (
        <div className="p-3 sm:p-4 md:p-5 md:px-6 border-t border-[var(--border-color)]">
      <div className="flex items-end gap-2 sm:gap-3 max-w-3xl mx-auto">
                <div className="flex-1 glass rounded-xl focus-within:border-amber-500/40 focus-within:shadow-[0_0_15px_rgba(245,158,11,0.1)] transition-all relative">
          <div className="flex items-center">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder={isListening ? "Listening... speak now" : "Ask about Dubai tours, Singapore activities, travel plans..."}
              disabled={disabled || isListening}
              rows={1}
              className="w-full resize-none bg-transparent p-3 sm:p-4 pr-10 sm:pr-12 text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none disabled:opacity-40 border-[1px] border-[var(--border-color)] focus:border-amber-500/40 rounded-3xl transition-colors"
            />
            {/* Microphone button */}
            {isSpeechSupported && (
              <button
                type="button"
                onClick={handleMicClick}
                disabled={disabled}
                className={`absolute right-2 sm:right-3 p-1.5 sm:p-2 rounded-full transition-all ${
                                    isListening
                    ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/30'
                    : 'bg-[var(--bg-card)] hover:bg-[var(--border-color)] text-[var(--text-secondary)] border border-[var(--border-color)]'
                } disabled:opacity-40`}
                aria-label={isListening ? "Stop listening" : "Start voice input"}
                title={isListening ? "Stop listening" : "Click to speak"}
              >
                                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
        <button
          onClick={handleSend}
          disabled={disabled || !input.trim()}
          className="rounded-xl bg-linear-to-r from-amber-500 to-orange-500 p-2.5 sm:p-3 md:p-3.5 text-white hover:from-amber-400 hover:to-orange-400 disabled:opacity-30 transition-all shrink-0 shadow-lg shadow-amber-500/20 disabled:shadow-none"
          aria-label="Send message"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4 sm:w-5 sm:h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
            />
          </svg>
        </button>
      </div>
            {/* Status messages */}
      <div className="max-w-3xl mx-auto mt-2">
        {speechError && (
          <p className="text-xs text-red-500 text-center">
            Speech error: {speechError}
          </p>
        )}
        {isListening && (
          <p className="text-xs text-blue-500 text-center animate-pulse">
            🎤 Listening... Click the microphone again to stop
          </p>
        )}
                {input.length > 900 && (
          <p className="text-xs text-[var(--text-secondary)] text-right">
            {input.length}/{MAX_MESSAGE_LENGTH}
          </p>
        )}
      </div>
    </div>
  );
}
