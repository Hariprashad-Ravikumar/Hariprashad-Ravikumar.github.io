"use client";

import { useEffect, useRef } from "react";

/**
 * Tracks pointer position over an element and writes it to --mx/--my CSS
 * custom properties, rAF-throttled, with no React state/re-render. Skipped
 * entirely on coarse pointers (touch) where hover has no meaning.
 */
export function useSpotlight<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let raf = 0;
    let pending: { x: number; y: number } | null = null;

    const flush = () => {
      raf = 0;
      if (!pending || !el) return;
      el.style.setProperty("--mx", `${pending.x}px`);
      el.style.setProperty("--my", `${pending.y}px`);
    };

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      pending = { x: e.clientX - r.left, y: e.clientY - r.top };
      if (!raf) raf = requestAnimationFrame(flush);
    };

    el.addEventListener("pointermove", onMove);
    return () => {
      el.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return ref;
}
