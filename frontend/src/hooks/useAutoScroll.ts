"use client";

import { useEffect, useRef, type RefObject } from "react";

export function useAutoScroll(
  ref: RefObject<HTMLDivElement | null>,
  deps: unknown[]
) {
  const shouldScrollRef = useRef(true);

  useEffect(() => {
    if (shouldScrollRef.current && ref.current) {
      // Use setTimeout to ensure DOM is fully updated
      setTimeout(() => {
        ref.current?.scrollIntoView({ 
          behavior: "smooth", 
          block: "end",
          inline: "nearest" 
        });
      }, 50);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return shouldScrollRef;
}

// Enhanced auto-scroll hook with user scroll detection
export function useSmartAutoScroll(
  containerRef: RefObject<HTMLDivElement | null>,
  deps: unknown[]
) {
  const shouldAutoScrollRef = useRef(true);
  const isUserScrollingRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 10;
      
      // If user scrolled up, disable auto-scroll
      if (!isAtBottom) {
        shouldAutoScrollRef.current = false;
        isUserScrollingRef.current = true;
      } else {
        // User is at bottom, re-enable auto-scroll
        shouldAutoScrollRef.current = true;
        isUserScrollingRef.current = false;
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [containerRef]);

  useEffect(() => {
    if (shouldAutoScrollRef.current && containerRef.current) {
      setTimeout(() => {
        const container = containerRef.current;
        if (container) {
          container.scrollTo({
            top: container.scrollHeight,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { 
    shouldAutoScroll: shouldAutoScrollRef.current,
    isUserScrolling: isUserScrollingRef.current
  };
}
