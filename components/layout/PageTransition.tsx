"use client";

import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import {
  pageTransitionTransition,
  pageTransitionVariants,
} from "@/lib/motion";

export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    // reducedMotion="user" makes every framer-motion animation in the tree
    // (this transition, and any whileInView reveal added later) respect
    // prefers-reduced-motion automatically — wired once here per §8.
    <MotionConfig reducedMotion="user">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pathname}
          variants={pageTransitionVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={pageTransitionTransition}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </MotionConfig>
  );
}
