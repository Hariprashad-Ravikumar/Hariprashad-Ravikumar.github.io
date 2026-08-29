import type { Transition, Variants } from "framer-motion";

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const easeOut: Transition["ease"] = [0.2, 0.7, 0.3, 1];

/** Page transition: fade + 8px rise, 260ms. No-op under reduced motion. */
export const pageTransitionVariants: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};
export const pageTransitionTransition: Transition = {
  duration: 0.26,
  ease: easeOut,
};

/** Section reveal on first scroll into view: 12px rise + fade, 60ms stagger between children. */
export const sectionRevealVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};
export const sectionRevealTransition: Transition = {
  duration: 0.4,
  ease: easeOut,
};
export const sectionStaggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
};

export const sectionRevealViewport = { once: true, margin: "-80px" } as const;

/** Reduced-motion-safe variants: identical start/end state, no animation. */
export const staticVariants: Variants = {
  hidden: { opacity: 1, y: 0 },
  visible: { opacity: 1, y: 0 },
};
