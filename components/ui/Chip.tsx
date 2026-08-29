import type { ReactNode } from "react";

export default function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--line)] bg-[var(--surface-0)] px-3 py-1 text-xs font-medium text-[var(--ink-700)]">
      {children}
    </span>
  );
}
