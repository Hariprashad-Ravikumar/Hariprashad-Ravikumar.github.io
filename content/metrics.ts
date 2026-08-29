/**
 * Single source of truth for every number on the site (§3). Nothing else
 * should hardcode "30+", "93%+", etc. — import from here instead. This is
 * what prevents a repeat of the 93%/98% drift on the old site.
 */
export const METRICS = {
  engineers: { value: "30+", label: "engineers using NIMBLE" },
  speedup: { value: "10×", label: "faster simulation sweeps" },
  computeHours: { value: "75,000+", label: "CPU/GPU hours on NERSC Perlmutter" },
  observables: { value: "30,000+", label: "observables processed" },
  accuracy: { value: "93%+", label: "symbolic-regression accuracy" },
  graduation: "December 2026",
} as const;
