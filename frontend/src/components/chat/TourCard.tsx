"use client";

import Image from "next/image";
import type { TourCard as TourCardType } from "@/lib/types";

interface Props {
  card: TourCardType;
}

export default function TourCard({ card }: Props) {
  return (
    <a
      href={card.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex-shrink-0 w-64 sm:w-72 snap-center rounded-2xl overflow-hidden border border-black/5 bg-white shadow-sm hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-amber-400"
    >
              <div className="relative h-36 sm:h-40 w-full bg-gray-100 overflow-hidden">
        {card.image ? (
          <img
            src={card.image}
            alt={card.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-sm text-gray-400">
            No image
          </div>
        )}
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
        <h3 className="text-xs sm:text-sm font-semibold text-black line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem]">
          {card.title}
        </h3>
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500 truncate max-w-[65%]">{card.location}</div>
          {typeof card.rating === "number" ? (
            <div className="text-xs font-medium text-amber-600">★ {card.rating.toFixed(1)}</div>
          ) : null}
        </div>

        <div className="flex items-baseline gap-2">
          <div className="text-sm sm:text-base font-bold text-black">
            {card.currency} {card.currentPrice}
          </div>
          {card.originalPrice ? (
            <div className="text-xs text-gray-400 line-through">
              {card.currency} {card.originalPrice}
            </div>
          ) : null}
        </div>

        {card.highlights && card.highlights.length > 0 ? (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {card.highlights.slice(0, 3).map((h) => (
              <span
                key={h}
                className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100"
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
