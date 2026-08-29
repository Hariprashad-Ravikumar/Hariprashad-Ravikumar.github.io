// Full canvas node/edge lattice with cursor repel + five perf guardrails
// lands in Phase 2 (§6). Static placeholder for now so layout.tsx has
// something to mount.
export default function LatticeBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 bg-[var(--surface-50)]"
    />
  );
}
