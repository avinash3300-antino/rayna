"use client";

import { useEffect, useRef } from 'react';

export function useScrollToBottom(dependencies: unknown[]) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (element) {
      // Multiple scroll methods to ensure it works across all browsers
      const scrollToBottom = () => {
        // Method 1: Immediate scroll
        element.scrollTop = element.scrollHeight;
        
        // Method 2: Smooth scroll after short delay
        setTimeout(() => {
          element.scrollTo({
            top: element.scrollHeight,
            behavior: 'smooth'
          });
        }, 10);
        
        // Method 3: Force scroll for stubborn cases
        setTimeout(() => {
          element.scrollTop = element.scrollHeight;
        }, 100);
        
        // Method 4: ScrollIntoView fallback
        setTimeout(() => {
          const children = element.children;
          if (children.length > 0) {
            const lastChild = children[children.length - 1] as HTMLElement;
            lastChild?.scrollIntoView({ behavior: 'smooth', block: 'end' });
          }
        }, 150);
      };

      // Execute scroll immediately
      scrollToBottom();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return ref;
}