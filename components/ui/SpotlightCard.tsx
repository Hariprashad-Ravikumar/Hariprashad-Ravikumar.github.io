"use client";

import type { ElementType, ReactNode } from "react";
import { useSpotlight } from "@/lib/useSpotlight";

export default function SpotlightCard({
  children,
  as: Tag = "div",
  className = "",
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
}) {
  const ref = useSpotlight<HTMLElement>();

  return (
    <Tag
      ref={ref}
      className={`spotlight rounded-[var(--r-md)] border border-[var(--glass-border)] bg-[var(--glass-bg)] shadow-[var(--shadow-sm)] backdrop-blur-[var(--glass-blur-sm)] transition-[transform,box-shadow] duration-200 hover:-translate-y-[3px] hover:shadow-[var(--shadow-lg)] focus-within:ring-2 focus-within:ring-[var(--brand-500)] ${className}`}
    >
      {children}
    </Tag>
  );
}
