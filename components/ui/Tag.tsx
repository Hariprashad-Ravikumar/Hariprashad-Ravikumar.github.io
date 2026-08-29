export default function Tag({ children }: { children: string }) {
  return (
    <span className="rounded-[var(--r-sm)] bg-[var(--surface-50)] px-2.5 py-1 font-mono text-xs text-[var(--ink-500)]">
      {children}
    </span>
  );
}
