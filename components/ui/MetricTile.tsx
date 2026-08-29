"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Animates only the leading numeric portion of a metric string on first
 * view, preserving the literal suffix (`30+`, `10×`, `75,000+`) exactly (§8).
 */
function useCountUp(value: string, active: boolean) {
  const match = value.match(/^([\d,]+)(.*)$/);
  const [display, setDisplay] = useState(active ? value : match ? `0${match[2]}` : value);

  useEffect(() => {
    if (!active || !match || prefersReducedMotion()) {
      setDisplay(value);
      return;
    }
    const target = Number(match[1].replace(/,/g, ""));
    const suffix = match[2];
    const duration = 1200;
    const start = performance.now();

    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const current = Math.round(target * t);
      setDisplay(`${current.toLocaleString()}${suffix}`);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, value]);

  return display;
}

export default function MetricTile({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const display = useCountUp(value, inView);

  return (
    <div ref={ref} className="flex flex-col gap-1">
      <span className="text-mono-metric text-[var(--brand-900)]">{display}</span>
      <span className="text-small text-[var(--ink-500)]">{label}</span>
    </div>
  );
}
