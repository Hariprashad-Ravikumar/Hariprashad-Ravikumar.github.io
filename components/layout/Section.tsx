import type { ReactNode } from "react";

/**
 * Shared vertical rhythm for plain content sections. Self-styled sections
 * (a bordered divider band, a card-like panel) own their own padding and
 * should not use this — wrapping them here would add rhythm on top of
 * padding they already carry.
 */
export default function Section({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <section className={`py-10 md:py-14 ${className}`.trim()}>{children}</section>;
}
