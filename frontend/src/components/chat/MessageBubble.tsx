"use client";

import type { Message } from "@/lib/types";
import { useTypewriter } from "@/hooks/useTypewriter";

function formatInline(text: string, keyPrefix: string) {
  // Handle **bold**, *italic*, URLs (with and without parentheses)
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|\(?https?:\/\/[^\s)]+\)?)/g;
  const result: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Push text before this match
    if (match.index > lastIndex) {
      result.push(
        <span key={`${keyPrefix}-t${lastIndex}`}>
          {text.slice(lastIndex, match.index)}
        </span>
      );
    }

    if (match[2]) {
      // **bold**
      result.push(
                <strong key={`${keyPrefix}-b${match.index}`} className="font-semibold text-[var(--text-primary)]">
          {match[2]}
        </strong>
      );
    } else if (match[3]) {
      // *italic*
      result.push(
        <em key={`${keyPrefix}-i${match.index}`}>{match[3]}</em>
      );
    } else {
      // URL - clean up parentheses if present
      let url = match[0];
      let displayUrl = url;
      
      // Remove wrapping parentheses if present
      if (url.startsWith('(') && url.endsWith(')')) {
        url = url.slice(1, -1);
        displayUrl = url;
      }
      
      // Ensure URL starts with http/https
      if (!url.startsWith('http')) {
        url = 'https://' + url;
      }
      
      result.push(
        <a
          key={`${keyPrefix}-u${match.index}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-amber-400 underline underline-offset-2 hover:text-amber-300 transition-colors break-all"
        >
          {displayUrl}
        </a>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  // Push remaining text
  if (lastIndex < text.length) {
    result.push(
      <span key={`${keyPrefix}-t${lastIndex}`}>
        {text.slice(lastIndex)}
      </span>
    );
  }

  return result.length > 0 ? result : text;
}

function renderContent(text: string) {
  // Split by lines to handle line-by-line rendering
  const lines = text.split("\n");
  return lines.map((line, i) => (
    <span key={i}>
      {i > 0 && "\n"}
      {formatInline(line, `l${i}`)}
    </span>
  ));
}

interface MessageBubbleProps {
  message: Message;
  animate?: boolean;
}

export default function MessageBubble({ message, animate = false }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const { displayed, isDone } = useTypewriter(
    message.content,
    animate && !isUser
  );

  const content = animate && !isUser ? displayed : message.content;

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} message-enter`}>
            {/* Assistant avatar */}
      {!isUser && (
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-xs font-bold mr-2 sm:mr-3 mt-1 shrink-0 shadow-lg shadow-amber-500/20">
          R
        </div>
      )}

      {/* Message bubble */}
      <div
        className={`max-w-[85%] sm:max-w-[80%] px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl ${
          isUser
            ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-br-sm shadow-lg shadow-amber-500/20"
            : "glass text-[var(--text-primary)] rounded-bl-sm"
        }`}
      >
        <p
                    className={`whitespace-pre-wrap text-xs sm:text-sm leading-relaxed wrap-break-word ${
            !isUser ? "text-[var(--text-primary)]" : ""
          } ${animate && !isUser && !isDone ? "cursor-blink" : ""}`}
        >
          {renderContent(content)}
        </p>
      </div>
    </div>
  );
}
