/**
 * Single source of truth for every number on the site (§3). Nothing else
 * should hardcode "40+", "98%", etc. — import from here instead. This is
 * what prevents accuracy figures from drifting out of sync across pages.
 */
export const METRICS = {
  engineers: {
    value: "40+",
    label: "senior R&D engineers and subject-matter experts in daily production use across WD's US and Japan sputtering/media teams",
  },
  speedup: { value: "10×", label: "faster simulation sweeps" },
  computeHours: { value: "75,000+", label: "CPU/GPU hours on NERSC Perlmutter" },
  observables: {
    value: "30,000+",
    label: "multiterabit observables processed in HPC (C++, Lua, SLURM)",
  },
  accuracy: { value: "98%", label: "symbolic-regression accuracy" },
  graduation: "December 2026",
} as const;
