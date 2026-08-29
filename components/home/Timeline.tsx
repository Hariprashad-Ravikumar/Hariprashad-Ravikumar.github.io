const ENTRIES = [
  {
    dates: "2026",
    items: ["Western Digital — Modeling & Simulation Intern, San Jose CA"],
  },
  {
    dates: "2021–",
    items: [
      "New Mexico State University — PhD Physics (Dr. Michael Engelhardt)",
      "Los Alamos National Laboratory — nucleon EDM, CUDA/HPC (collaboration)",
      "North Carolina State University — conformal algebra (Prof. Chueng-Ryong Ji)",
    ],
  },
  {
    dates: "2019–2021",
    items: ["NIT Jalandhar — MSc Physics"],
  },
];

export default function Timeline() {
  return (
    <section className="py-16">
      <h2 className="text-h2 text-[var(--ink-900)]">Experience timeline</h2>
      <div className="mt-6 flex flex-col gap-6">
        {ENTRIES.map((entry) => (
          <div key={entry.dates} className="grid grid-cols-[100px_1fr] gap-4 border-t border-[var(--line)] pt-4">
            <p className="text-eyebrow text-[var(--ink-500)]">{entry.dates}</p>
            <div className="flex flex-col gap-1">
              {entry.items.map((item) => (
                <p key={item} className="text-body text-[var(--ink-700)]">
                  {item}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
