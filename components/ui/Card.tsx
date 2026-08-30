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
      className={`material-surface rounded-[var(--r-md)] p-6 shadow-[var(--glass-surface-shadow)] ${className}`}
    >
      {children}
    </div>
  );
}
