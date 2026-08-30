"use client";

import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { motion } from "framer-motion";
import { springDefault, springPress } from "@/lib/springs";

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-[var(--r-sm)] px-5 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-500)] focus-visible:ring-offset-2";

const VARIANTS = {
  primary: "glass-sheen bg-[var(--brand-900)] text-white hover:opacity-90",
  secondary: "material-glass glass-sheen text-[var(--ink-900)]",
};

type Variant = keyof typeof VARIANTS;

// Framer Motion's event handler types (onAnimationStart, onDrag, etc.)
// conflict with the plain DOM HTML attribute types of the same name —
// drop them from the base props since we never use them here.
type MotionSafeButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onAnimationStart" | "onAnimationEnd" | "onDrag" | "onDragStart" | "onDragEnd"
>;
type MotionSafeAnchorProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "onAnimationStart" | "onAnimationEnd" | "onDrag" | "onDragStart" | "onDragEnd"
>;

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: MotionSafeButtonProps & {
  variant?: Variant;
  children: ReactNode;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.03, transition: springDefault }}
      whileTap={{ scale: 0.97, transition: springPress }}
      className={`${BASE} ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export function LinkButton({
  variant = "primary",
  className = "",
  children,
  ...props
}: MotionSafeAnchorProps & {
  variant?: Variant;
  children: ReactNode;
}) {
  return (
    <motion.a
      whileHover={{ scale: 1.03, transition: springDefault }}
      whileTap={{ scale: 0.97, transition: springPress }}
      className={`${BASE} ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.a>
  );
}
