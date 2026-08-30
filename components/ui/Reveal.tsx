"use client";

import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { motion } from "framer-motion";
import {
  sectionRevealTransition,
  sectionRevealVariants,
  sectionRevealViewport,
} from "@/lib/motion";

type RevealProps<T extends ElementType> = {
  children: ReactNode;
  as?: T;
  className?: string;
  delay?: number;
} & Omit<ComponentPropsWithoutRef<T>, "children" | "as" | "className">;

/**
 * Fades + rises content into place once, the first time it scrolls into
 * view (never re-triggers on scroll-back). The one primitive every page
 * reaches for instead of popping content in instantly.
 */
export default function Reveal<T extends ElementType = "div">({
  children,
  as,
  className = "",
  delay = 0,
  ...rest
}: RevealProps<T>) {
  const MotionTag = motion.create((as ?? "div") as ElementType);
  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={sectionRevealViewport}
      variants={sectionRevealVariants}
      transition={{ ...sectionRevealTransition, delay }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}
