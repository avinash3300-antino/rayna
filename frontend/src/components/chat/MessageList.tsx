"use client";

import MessageBubble from "./MessageBubble";
import type { Message } from "@/lib/types";
import { useScrollToBottom } from "@/hooks/useScrollToBottom";
import TourCarousel from "./TourCarousel";


interface MessageListProps {
  messages: Message[];
  animatingIndex: number | null;
  shouldScrollToBottom?: boolean;
  onScrollTriggered?: () => void;
}

export default function MessageList({ 
  messages, 
  animatingIndex, 
  shouldScrollToBottom, 
  onScrollTriggered 
}: MessageListProps) {
  // Use the reliable scroll hook that triggers on messages, animation, or manual trigger
  const containerRef = useScrollToBottom([
    messages.length,
    animatingIndex,
    shouldScrollToBottom,
    messages[messages.length - 1]?.content // Content changes during typing
  ]);

  return (
        <div 
      ref={containerRef}
      className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6"
      style={{ 
        maxHeight: '100%',
        scrollBehavior: 'smooth'
      }}
    >
      <div className="flex flex-col gap-3 sm:gap-4 md:gap-5">
                {messages.map((msg, i) => (
          <div key={i} className="flex flex-col gap-2">
            <MessageBubble
              message={msg}
              animate={i === animatingIndex}
            />
                        {msg.role === "assistant" && msg.tourCarousel ? (
              <div className="ml-8 sm:ml-10 md:ml-11">{/* align with assistant avatar */}
                <TourCarousel carousel={msg.tourCarousel} />
              </div>
            ) : null}
          </div>
        ))}

        {/* Empty div to ensure proper scrolling space */}
        <div style={{ height: '1px', minHeight: '1px' }} />
      </div>
    </div>
  );
}
