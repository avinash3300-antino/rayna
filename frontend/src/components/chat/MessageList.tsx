"use client";

import { useRef } from "react";
import { useAutoScroll } from "@/hooks/useAutoScroll";
import MessageBubble from "./MessageBubble";
import type { Message } from "@/lib/types";

interface MessageListProps {
  messages: Message[];
  animatingIndex: number | null;
}

export default function MessageList({ messages, animatingIndex }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  useAutoScroll(bottomRef, [messages.length, animatingIndex]);

  return (
    <div className="flex flex-col gap-5 p-4 md:p-6">
      {messages.map((msg, i) => (
        <MessageBubble
          key={i}
          message={msg}
          animate={i === animatingIndex}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
