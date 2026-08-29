export default function Tag({ children }: { children: string }) {
  return (
    <span className="rounded-[var(--r-sm)] border border-[var(--glass-border)] bg-[var(--glass-bg)] px-2.5 py-1 font-mono text-xs text-[var(--ink-500)] backdrop-blur-[var(--glass-blur-sm)]">
      {children}
    </span>
  );
}
