const STAGES = [
  {
    label: "Upstream WD NIMBLE app",
    detail: "hands off a JSON payload · opens new tab · IndexedDB API",
  },
  {
    label: "Frontend — Dash",
    detail:
      "reads payload from IndexedDB · fits physics + statistical functions to the incoming data · auto-populates every input field · user can review / override parameters",
  },
  {
    label: "Backend — physics engine (Python library)",
    detail: "analytical HAMR switching model · all sweeps computed in parallel",
  },
  {
    label: "Results — interactive Plotly views",
    detail: "DCSNR + key recording metrics",
  },
  {
    label: "Export — multi-format reports",
    detail: "shared internally to plan test experiments",
  },
];

const GAP = 28;
const WIDTH = 640;
const BOX_HEIGHT = 78;

/** Detail lines are long — show the first two `·`-separated segments only, each on its own tspan. */
function detailLines(detail: string): string[] {
  const segments = detail.split(" · ");
  return segments.slice(0, 2);
}

/**
 * Inline SVG so the diagram stays theme-aware, crisp at any zoom, and
 * screen-reader accessible (§10.5) — nothing to export or regenerate.
 */
export default function NimbleArchitectureDiagram() {
  const height = STAGES.length * (BOX_HEIGHT + GAP) - GAP + 40;

  return (
    <figure className="my-6">
      <svg
        viewBox={`0 0 ${WIDTH} ${height}`}
        role="img"
        aria-label={`NIMBLE data flow: ${STAGES.map((s) => s.label).join(" → ")}. Deployment on Kubernetes, CI/CD via Jenkins.`}
        className="w-full max-w-xl"
      >
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--ink-400)" />
          </marker>
        </defs>

        {STAGES.map((stage, i) => {
          const y = i * (BOX_HEIGHT + GAP);
          return (
            <g key={stage.label}>
              <rect
                x={0}
                y={y}
                width={WIDTH}
                height={BOX_HEIGHT}
                rx={10}
                fill="var(--surface-0)"
                stroke="var(--line)"
              />
              <text x={16} y={y + 26} className="fill-[var(--ink-900)]" style={{ font: "600 14px var(--font-sans, sans-serif)" }}>
                {stage.label}
              </text>
              <text x={16} y={y + 44} className="fill-[var(--ink-500)]" style={{ font: "400 11.5px var(--font-sans, sans-serif)" }}>
                {detailLines(stage.detail).map((line, li) => (
                  <tspan key={line} x={16} dy={li === 0 ? 0 : 15}>
                    {line}
                  </tspan>
                ))}
              </text>
              {i < STAGES.length - 1 && (
                <line
                  x1={WIDTH / 2}
                  y1={y + BOX_HEIGHT}
                  x2={WIDTH / 2}
                  y2={y + BOX_HEIGHT + GAP}
                  stroke="var(--ink-400)"
                  strokeWidth={1.5}
                  markerEnd="url(#arrow)"
                />
              )}
            </g>
          );
        })}

        <text
          x={WIDTH / 2}
          y={height - 8}
          textAnchor="middle"
          className="fill-[var(--ink-500)]"
          style={{ font: "600 11px var(--font-mono, monospace)" }}
        >
          Deployment: Kubernetes · CI/CD: Jenkins
        </text>
      </svg>
      <figcaption className="text-small mt-2 text-[var(--ink-500)]">
        Data flow from the upstream WD NIMBLE app through the Dash frontend, physics engine backend,
        and results export.
      </figcaption>
    </figure>
  );
}
