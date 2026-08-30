export default function TerminalStatusLine({ text }: { text: string }) {
  return (
    <span className="inline-flex max-w-full items-center gap-2 rounded-[var(--r-sm)] border border-[var(--glass-border)] bg-[var(--ink-900)] px-3 py-1.5 font-mono text-xs text-[var(--accent-400)]">
      <span aria-hidden="true" className="text-[var(--accent-500)]">
        ●
      </span>
      <span
        className="terminal-status__text"
        style={{
          width: `${text.length}ch`,
          animationTimingFunction: `steps(${text.length}, end)`,
        }}
      >
        {text}
      </span>
      <span aria-hidden="true" className="terminal-status__cursor" />
    </span>
  );
}
