"use client";

import Image from "next/image";
import type { TourCard as TourCardType } from "@/lib/types";

interface Props {
  card: TourCardType;
}

export default function TourCard({ card }: Props) {
  const handleClick = (e: React.MouseEvent) => {
    // Track click analytics if needed
    console.log('Tour card clicked:', card.title);
  };

  return (
    <a
      href={card.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="group flex-shrink-0 w-64 sm:w-72 snap-center rounded-2xl overflow-hidden border border-[var(--border-color)] bg-[var(--bg-primary)] shadow-sm hover:shadow-lg hover:border-amber-400/30 transition-all focus:outline-none focus:ring-2 focus:ring-amber-400 transform hover:scale-[1.02]"
    >
              <div className="relative h-36 sm:h-40 w-full bg-gray-100 overflow-hidden">
        {card.image ? (
          <img
            src={card.image}
            alt={card.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const placeholder = target.nextElementSibling as HTMLElement;
              if (placeholder) placeholder.style.display = 'flex';
            }}
          />
        ) : null}
        <div 
          className="h-full w-full flex flex-col items-center justify-center text-xs text-[var(--text-secondary)] bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-800 dark:to-slate-700"
          style={{ display: card.image ? 'none' : 'flex' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mb-2 text-amber-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
          </svg>
          <span className="font-medium">{card.category || 'Tour'}</span>
          <span className="text-center px-2">{card.location}</span>
        </div>
        {card.discountPercentage ? (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-md">
            -{card.discountPercentage}%
          </div>
        ) : null}
        {card.isNew ? (
          <div className="absolute top-2 right-2 bg-emerald-500 text-white text-xs font-semibold px-2 py-1 rounded-md">
            New
          </div>
        ) : null}
      </div>

      <div className="p-3 sm:p-3.5 space-y-1.5 sm:space-y-2">
        <h3 className="text-xs sm:text-sm font-semibold text-[var(--text-primary)] line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem]">
          {card.title}
        </h3>
        <div className="flex items-center justify-between">
          <div className="text-xs text-[var(--text-secondary)] truncate max-w-[65%]">{card.location}</div>
          {typeof card.rating === "number" ? (
            <div className="text-xs font-medium text-amber-600">★ {card.rating.toFixed(1)}</div>
          ) : null}
        </div>

        <div className="flex items-baseline gap-2">
          <div className="text-sm sm:text-base font-bold text-[var(--text-primary)]">
            {card.currency} {card.currentPrice}
          </div>
          {card.originalPrice ? (
            <div className="text-xs text-[var(--text-secondary)] line-through opacity-60">
              {card.currency} {card.originalPrice}
            </div>
          ) : null}
        </div>

        {card.highlights && card.highlights.length > 0 ? (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {card.highlights.slice(0, 3).map((h) => (
              <span
                key={h}
                className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-800"
              >
                {h}
              </span>
            ))}
          </div>
        ) : null}

        <div className="mt-3">
          <span className="inline-flex items-center justify-center w-full text-xs font-semibold text-white bg-linear-to-r from-amber-500 to-orange-500 rounded-lg py-2 group-hover:from-amber-600 group-hover:to-orange-600">
            View details
          </span>
        </div>
      </div>
    </a>
  );
}
