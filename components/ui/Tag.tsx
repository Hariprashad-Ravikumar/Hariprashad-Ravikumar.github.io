export default function Tag({ children }: { children: string }) {
  return (
    <span className="material-trim rounded-[var(--r-sm)] px-2.5 py-1 font-mono text-xs text-[var(--ink-500)]">
      {children}
    </span>
  );
}
