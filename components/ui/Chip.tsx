import type { ReactNode } from "react";

export default function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] px-3 py-1 text-xs font-medium text-[var(--ink-700)] backdrop-blur-[var(--glass-blur-sm)]">
      {children}
    </span>
  );
}
