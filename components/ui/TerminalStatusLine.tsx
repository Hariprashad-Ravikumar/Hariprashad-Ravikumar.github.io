"use client";

import { useEffect, useState } from "react";

const TYPE_DURATION_MS = 2200;

export default function TerminalStatusLine({ text }: { text: string }) {
  const [revealedCount, setRevealedCount] = useState(0);

  useEffect(() => {
    setRevealedCount(0);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setRevealedCount(text.length);
      return;
    }

    const stepMs = TYPE_DURATION_MS / text.length;
    const interval = setInterval(() => {
      setRevealedCount((count) => {
        if (count >= text.length) {
          clearInterval(interval);
          return count;
        }
        return count + 1;
      });
    }, stepMs);

    return () => clearInterval(interval);
  }, [text]);

  return (
    <span className="inline-flex max-w-full items-center gap-2 rounded-[var(--r-sm)] border border-[var(--glass-border)] bg-[var(--ink-900)] px-3 py-1.5 font-mono text-xs text-[var(--accent-400)]">
      <span aria-hidden="true" className="text-[var(--accent-500)]">
        ●
      </span>
      <span className="terminal-status__text">
        {text.slice(0, revealedCount)}
        <span aria-hidden="true" className="terminal-status__cursor" />
      </span>
    </span>
  );
}
