import type { ReactNode } from "react";
import Reveal from "@/components/ui/Reveal";

export default function ResumeSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <Reveal
      as="section"
      id={id}
      className="scroll-mt-24 border-t border-[var(--glass-border)] py-6 first:border-t-0 first:pt-0"
    >
      <h2 className="text-h2 text-[var(--ink-900)]">{title}</h2>
      <div className="mt-3 flex flex-col gap-4">{children}</div>
    </Reveal>
  );
}
