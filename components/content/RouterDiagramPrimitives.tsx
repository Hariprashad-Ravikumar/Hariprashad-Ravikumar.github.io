/**
 * Shared visual language for the router case study's two live-looping
 * architecture diagrams (v1: RouterV1ArchitectureDiagram, v2:
 * RouterArchitectureDiagram) — same node/edge/tier treatment, light glass
 * card instead of the source app's dark panel, so both diagrams read as a
 * matched pair rather than two independently-styled widgets.
 */

export const NODE_BG = "var(--surface-0)";
export const NODE_BORDER = "var(--line)";
export const LABEL_COLOR = "var(--ink-900)";
export const SUB_COLOR = "var(--ink-500)";
export const EDGE_LINE = "var(--line)";
export const TIER_IDLE_BG = "var(--surface-0)";
export const TIER_IDLE_BORDER = "var(--line)";

export function pickWeighted<T extends { key: string; weight: number }>(items: T[]): T["key"] {
  const roll = Math.random();
  let cumulative = 0;
  for (const item of items) {
    cumulative += item.weight;
    if (roll <= cumulative) return item.key;
  }
  return items[items.length - 1].key;
}

export function Icon({ path, size, color, viewBox = "0 0 24 24" }: { path: string; size: number; color: string; viewBox?: string }) {
  return (
    <svg viewBox={viewBox} width={size} height={size} aria-hidden="true" style={{ fill: color }}>
      <path d={path} />
    </svg>
  );
}

export function PipelineNode({
  label,
  sub,
  color,
  delayMs,
  reduced,
  children,
}: {
  label: string;
  sub?: string;
  color: string;
  delayMs: number;
  reduced: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex flex-col items-center gap-0.5 rounded-xl border px-3 py-2 text-center"
      style={{
        borderColor: NODE_BORDER,
        background: NODE_BG,
        boxShadow: "var(--shadow-sm)",
        animation: reduced ? undefined : `router-node-cascade 700ms ease-out ${delayMs}ms both`,
        opacity: reduced ? 0.95 : undefined,
        ...(reduced ? { boxShadow: `var(--shadow-sm), 0 0 6px ${color}` } : {}),
        ["--stage-color" as string]: color,
      }}
    >
      <div className="flex h-6 items-center justify-center gap-1.5">{children}</div>
      <span className="text-[0.8rem] font-bold" style={{ color: LABEL_COLOR }}>
        {label}
      </span>
      {sub && (
        <span className="font-mono text-[0.66rem]" style={{ color: SUB_COLOR }}>
          {sub}
        </span>
      )}
    </div>
  );
}

export function Connector({ color, delayMs, reduced }: { color: string; delayMs: number; reduced: boolean }) {
  return (
    <div className="relative mx-auto h-3 w-0.5" style={{ background: EDGE_LINE }}>
      <span
        className="absolute top-0 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full"
        style={{
          background: color,
          boxShadow: `0 0 4px ${color}`,
          animation: reduced ? undefined : `router-token-travel 550ms linear ${delayMs}ms both`,
        }}
      />
    </div>
  );
}

export function Fanout({
  tiers,
  won,
}: {
  tiers: { key: string; color: string; fanoutPath: string }[];
  won: string | null;
}) {
  return (
    <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="mx-auto h-6 w-2/3">
      {tiers.map((tier) => (
        <path
          key={tier.key}
          d={tier.fanoutPath}
          fill="none"
          stroke={won === tier.key ? tier.color : EDGE_LINE}
          strokeWidth={won === tier.key ? 2.8 : 1.5}
          style={{ transition: "stroke 0.4s ease, stroke-width 0.4s ease" }}
        />
      ))}
    </svg>
  );
}

export function TierBox({
  label,
  sub,
  color,
  iconPath,
  iconViewBox,
  isWon,
}: {
  label: string;
  sub: string;
  color: string;
  iconPath: string;
  iconViewBox?: string;
  isWon: boolean;
}) {
  return (
    <div
      className="flex w-[88px] flex-col items-center gap-0.5 rounded-xl border px-1.5 py-2 text-center sm:w-[104px] sm:px-2"
      style={{
        borderColor: isWon ? color : TIER_IDLE_BORDER,
        background: TIER_IDLE_BG,
        opacity: isWon ? 1 : 0.55,
        boxShadow: isWon ? `var(--shadow-sm), 0 0 20px ${color}` : "var(--shadow-sm)",
        transition: "opacity 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease",
      }}
    >
      <div className="flex h-5 items-center justify-center">
        <Icon path={iconPath} viewBox={iconViewBox} size={17} color={color} />
      </div>
      <span className="text-[0.72rem] font-bold tracking-wide uppercase" style={{ color: LABEL_COLOR }}>
        {label}
      </span>
      <span className="font-mono text-[0.6rem]" style={{ color: SUB_COLOR }}>
        {sub}
      </span>
    </div>
  );
}
