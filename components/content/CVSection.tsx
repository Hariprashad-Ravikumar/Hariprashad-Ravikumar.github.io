import type { ReactNode } from "react";

export default function CVSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-[var(--line)] py-8 first:border-t-0 first:pt-0">
      <h2 className="text-h2 text-[var(--ink-900)]">{title}</h2>
      <div className="mt-4 flex flex-col gap-4">{children}</div>
    </section>
  );
}
