"use client";

export default function TourCardSkeleton() {
  return (
    <div className="flex-shrink-0 w-64 sm:w-72 snap-center rounded-2xl overflow-hidden border border-[var(--border-color)] bg-[var(--bg-primary)] animate-pulse">
      {/* Image placeholder */}
      <div className="h-36 sm:h-40 w-full bg-[var(--bg-card)]">
        <div className="h-full w-full flex items-center justify-center">
          <div className="w-12 h-12 bg-[var(--border-color)] rounded-lg"></div>
        </div>
      </div>
      
      {/* Content placeholder */}
      <div className="p-3 sm:p-3.5 space-y-2">
        {/* Title */}
        <div className="space-y-2">
          <div className="h-4 bg-[var(--bg-card)] rounded w-3/4"></div>
          <div className="h-4 bg-[var(--bg-card)] rounded w-1/2"></div>
        </div>
        
        {/* Location and rating */}
        <div className="flex items-center justify-between">
          <div className="h-3 bg-[var(--bg-card)] rounded w-1/3"></div>
          <div className="h-3 bg-[var(--bg-card)] rounded w-1/4"></div>
        </div>
        
        {/* Price */}
        <div className="flex items-baseline gap-2">
          <div className="h-5 bg-[var(--bg-card)] rounded w-1/4"></div>
          <div className="h-3 bg-[var(--bg-card)] rounded w-1/6"></div>
        </div>
        
        {/* Tags */}
        <div className="flex gap-1.5 flex-wrap">
          <div className="h-5 bg-[var(--bg-card)] rounded-full w-16"></div>
          <div className="h-5 bg-[var(--bg-card)] rounded-full w-12"></div>
          <div className="h-5 bg-[var(--bg-card)] rounded-full w-14"></div>
        </div>
        
        {/* Button */}
        <div className="h-8 bg-[var(--bg-card)] rounded-lg w-full"></div>
      </div>
    </div>
  );
}

// Skeleton for the entire carousel
export function TourCarouselSkeleton() {
  return (
    <div className="mt-2 sm:mt-3">
      {/* Header */}
      <div className="flex items-baseline justify-between mb-2 px-1">
        <div className="space-y-1">
          <div className="h-4 bg-[var(--bg-card)] rounded w-32 animate-pulse"></div>
          <div className="h-3 bg-[var(--bg-card)] rounded w-24 animate-pulse"></div>
        </div>
        <div className="flex gap-1 sm:gap-1.5">
          <div className="h-7 w-7 sm:h-8 sm:w-8 bg-[var(--bg-card)] rounded-md animate-pulse"></div>
          <div className="h-7 w-7 sm:h-8 sm:w-8 bg-[var(--bg-card)] rounded-md animate-pulse"></div>
        </div>
      </div>
      
      {/* Cards */}
      <div className="flex gap-2 sm:gap-3 overflow-x-auto snap-x snap-mandatory px-1 py-1 scrollbar-thin -mx-1">
        <TourCardSkeleton />
        <TourCardSkeleton />
        <TourCardSkeleton />
      </div>
    </div>
  );
}