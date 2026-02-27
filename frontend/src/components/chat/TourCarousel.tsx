"use client";

import { useRef } from "react";
import type { TourCarousel as TourCarouselType } from "@/lib/types";
import TourCard from "./TourCard";

interface Props {
  carousel: TourCarouselType;
}

export default function TourCarousel({ carousel }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollBy = (delta: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  if (!carousel?.cards || carousel.cards.length === 0) return null;

  return (
    <div className="mt-2 sm:mt-3">
      <div className="flex items-baseline justify-between mb-2 px-1">
        <div className="min-w-0 flex-1 mr-2">
          <div className="text-xs sm:text-sm font-bold text-black truncate">{carousel.title}</div>
          {carousel.subtitle ? (
            <div className="text-xs text-gray-500 truncate">{carousel.subtitle}</div>
          ) : null}
        </div>
        <div className="flex gap-1 sm:gap-1.5 flex-shrink-0">
          <button
            type="button"
            onClick={() => scrollBy(-280)}
            className="h-7 w-7 sm:h-8 sm:w-8 rounded-md border border-black/10 bg-white text-black text-sm hover:bg-gray-50 flex items-center justify-center"
            aria-label="Scroll left"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => scrollBy(280)}
            className="h-7 w-7 sm:h-8 sm:w-8 rounded-md border border-black/10 bg-white text-black text-sm hover:bg-gray-50 flex items-center justify-center"
            aria-label="Scroll right"
          >
            ›
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-2 sm:gap-3 overflow-x-auto snap-x snap-mandatory px-1 py-1 scrollbar-thin scrollbar-thumb-gray-300 -mx-1"
      >
        {carousel.cards.map((card) => (
          <TourCard key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}
