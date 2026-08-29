import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-[var(--r-sm)] px-5 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-500)] focus-visible:ring-offset-2";

const VARIANTS = {
  primary: "bg-[var(--brand-900)] text-white hover:opacity-90",
  secondary:
    "border border-[var(--line)] bg-[var(--surface-0)] text-[var(--ink-900)] hover:bg-[var(--surface-50)]",
  ghost: "text-[var(--brand-500)] hover:underline",
};

type Variant = keyof typeof VARIANTS;

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  children: ReactNode;
}) {
  return (
    <button className={`${BASE} ${VARIANTS[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function LinkButton({
  variant = "primary",
  className = "",
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: Variant;
  children: ReactNode;
}) {
  return (
    <a className={`${BASE} ${VARIANTS[variant]} ${className}`} {...props}>
      {children}
    </a>
  );
}
