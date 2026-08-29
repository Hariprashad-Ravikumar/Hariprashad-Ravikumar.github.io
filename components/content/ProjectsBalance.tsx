const LEFT = { title: "Physics Modeling", detail: "HAMR grain dynamics" };
const RIGHT = { title: "NIMBLE Simulator", detail: "Dash physics app" };

/**
 * Static balance-scale figure: a perfectly level beam signals the two
 * projects carried equal weight during the internship, not that one was
 * the "main" project and the other a side effort.
 */
export default function ProjectsBalance() {
  return (
    <figure className="mt-0 mb-8">
      <svg
        viewBox="0 0 640 300"
        role="img"
        aria-label={`Balance scale showing two equally weighted projects: ${LEFT.title} and ${RIGHT.title}`}
        className="mx-auto w-full max-w-xl"
      >
        {/* ground shadow */}
        <ellipse cx={320} cy={289} rx={90} ry={7} fill="var(--line)" opacity={0.8} />

        {/* stand */}
        <rect x={260} y={270} width={120} height={16} rx={8} fill="var(--ink-900)" />
        <rect x={316} y={100} width={8} height={170} fill="var(--ink-900)" />
        <polygon points="320,84 300,100 340,100" fill="var(--ink-900)" />

        {/* beam, resting level on the fulcrum */}
        <rect x={70} y={88} width={500} height={8} rx={4} fill="var(--brand-500)" />
        <circle cx={320} cy={92} r={5} fill="var(--ink-900)" />

        {/* left pan */}
        <line x1={80} y1={96} x2={40} y2={170} stroke="var(--ink-400)" strokeWidth={2} />
        <line x1={80} y1={96} x2={120} y2={170} stroke="var(--ink-400)" strokeWidth={2} />
        <rect x={5} y={170} width={150} height={64} rx={14} fill="var(--surface-0)" stroke="var(--line)" strokeWidth={1.5} />
        <text x={80} y={197} textAnchor="middle" style={{ font: "600 15px var(--font-sans, sans-serif)" }} className="fill-[var(--ink-900)]">
          {LEFT.title}
        </text>
        <text x={80} y={216} textAnchor="middle" style={{ font: "400 11px var(--font-sans, sans-serif)" }} className="fill-[var(--ink-500)]">
          {LEFT.detail}
        </text>

        {/* right pan */}
        <line x1={560} y1={96} x2={600} y2={170} stroke="var(--ink-400)" strokeWidth={2} />
        <line x1={560} y1={96} x2={520} y2={170} stroke="var(--ink-400)" strokeWidth={2} />
        <rect x={485} y={170} width={150} height={64} rx={14} fill="var(--surface-0)" stroke="var(--line)" strokeWidth={1.5} />
        <text x={560} y={197} textAnchor="middle" style={{ font: "600 15px var(--font-sans, sans-serif)" }} className="fill-[var(--ink-900)]">
          {RIGHT.title}
        </text>
        <text x={560} y={216} textAnchor="middle" style={{ font: "400 11px var(--font-sans, sans-serif)" }} className="fill-[var(--ink-500)]">
          {RIGHT.detail}
        </text>
      </svg>
      <figcaption className="mt-3 text-center text-sm text-[var(--ink-500)]">
        Two HAMR projects.
      </figcaption>
    </figure>
  );
}
