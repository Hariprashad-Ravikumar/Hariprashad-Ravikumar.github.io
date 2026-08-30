"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  prefersReducedMotion,
  sectionRevealTransition,
  sectionRevealVariants,
  sectionRevealViewport,
} from "@/lib/motion";

/**
 * Animates only the leading numeric portion of a metric string on mount,
 * preserving the literal suffix (`40+`, `10×`, `75,000+`) exactly (§8).
 * Runs immediately on load rather than waiting for scroll-into-view, so the
 * numbers are already correct by the time a reader scrolls to them.
 */
function useCountUp(value: string) {
  const match = value.match(/^([\d,]+)(.*)$/);
  const [display, setDisplay] = useState(match ? `0${match[2]}` : value);

  useEffect(() => {
    if (!match || prefersReducedMotion()) {
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
  }, [value]);

  return display;
}

export default function MetricTile({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  const display = useCountUp(value);

  return (
    <motion.div
      className="flex flex-col gap-1"
      initial="hidden"
      whileInView="visible"
      viewport={sectionRevealViewport}
      variants={sectionRevealVariants}
      transition={sectionRevealTransition}
    >
      <span className="text-mono-metric text-[var(--brand-900)]">{display}</span>
      <span className="text-small text-[var(--ink-500)]">{label}</span>
    </motion.div>
  );
}
