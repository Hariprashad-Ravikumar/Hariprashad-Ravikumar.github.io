import type { ReactNode } from "react";

export default function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[var(--r-md)] border border-[var(--line)] bg-[var(--surface-0)] p-6 shadow-[var(--shadow-sm)] ${className}`}
    >
      {children}
    </div>
  );
}
