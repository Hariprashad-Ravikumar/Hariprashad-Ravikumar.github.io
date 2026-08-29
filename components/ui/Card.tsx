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
      className={`rounded-[var(--r-md)] border border-[var(--glass-border)] bg-[var(--glass-bg)] p-6 shadow-[var(--shadow-sm)] backdrop-blur-[var(--glass-blur-sm)] ${className}`}
    >
      {children}
    </div>
  );
}
