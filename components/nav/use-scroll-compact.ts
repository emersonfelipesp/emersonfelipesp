"use client";

import { useEffect, useState } from "react";

export function useScrollCompact(enabled = true): boolean {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    let raf = 0;
    function onScroll() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        setCompact((prev) => (prev ? y > 4 : y > 8));
      });
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

  return compact;
}
