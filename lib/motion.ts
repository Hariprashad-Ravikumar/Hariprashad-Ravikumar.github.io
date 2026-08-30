import type { Transition, Variants } from "framer-motion";

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const easeOut: Transition["ease"] = [0.2, 0.7, 0.3, 1];

/** Page transition: a glass panel materializing — fade + slight scale +
 * blur settle, matching the Lightbox/Nav-mobile-menu materialize language.
 * Exit is a shallower mirror of entry (spatial consistency). No-op under
 * reduced motion. */
export const pageTransitionVariants: Variants = {
  initial: { opacity: 0, scale: 0.985, filter: "blur(6px)" },
  animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
  exit: { opacity: 0, scale: 0.99, filter: "blur(4px)" },
};
export const pageTransitionTransition: Transition = {
  duration: 0.32,
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
