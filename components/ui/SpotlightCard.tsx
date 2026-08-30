"use client";

import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { motion } from "framer-motion";
import { useSpotlight } from "@/lib/useSpotlight";
import { springDefault } from "@/lib/springs";

type SpotlightCardProps<T extends ElementType> = {
  children: ReactNode;
  as?: T;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "children" | "as" | "className">;

export default function SpotlightCard<T extends ElementType = "div">({
  children,
  as,
  className = "",
  ...rest
}: SpotlightCardProps<T>) {
  const ref = useSpotlight<HTMLElement>();
  const MotionTag = motion.create((as ?? "div") as ElementType);

  return (
    <MotionTag
      ref={ref}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.99 }}
      transition={springDefault}
      className={`material-surface spotlight rounded-[var(--r-md)] shadow-[var(--glass-surface-shadow)] hover:shadow-[var(--shadow-lg)] focus-within:ring-2 focus-within:ring-[var(--brand-500)] ${className}`}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}
