import type { Transition } from "framer-motion";

/** Default UI spring — critically damped, no overshoot. Use for anything
 *  that isn't a flick/drag release: hover lifts, press scales, nav blur,
 *  materialize-in, tab/section switches. */
export const springDefault: Transition = {
  type: "spring",
  damping: 30,
  stiffness: 170,
  mass: 1,
};

/** Momentum spring — slight bounce, only for gesture-originated motion
 *  (drag-released dismiss, swipe-driven carousels if ever added). */
export const springMomentum: Transition = {
  type: "spring",
  damping: 22,
  stiffness: 170,
  mass: 1,
};

/** Press feedback — fast, critically damped scale-down. Must feel instant
 *  on pointerdown, never wait for release. */
export const springPress: Transition = {
  type: "spring",
  damping: 30,
  stiffness: 500,
  mass: 0.6,
};

/** Rubber-band resistance (soft boundary, not a hard stop). */
export function rubberband(overshoot: number, dimension: number, constant = 0.55): number {
  return (overshoot * dimension * constant) / (dimension + constant * Math.abs(overshoot));
}
