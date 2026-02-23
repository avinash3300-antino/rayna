"use client";

import { useEffect, type RefObject } from "react";

export function useAutoScroll(
  ref: RefObject<HTMLDivElement | null>,
  deps: unknown[]
) {
  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
