"use client";

import Link from "next/link";
import Picture from "@/components/ui/Picture";
import Section from "@/components/layout/Section";
import SpotlightCard from "@/components/ui/SpotlightCard";

const ENTRIES = [
  {
    href: "/projects/wd-internship-2026/",
    logo: (
      <Picture
        src="/images/wd/WD_Logo"
        alt="Western Digital logo"
        width={2722}
        height={857}
        sizes="96px"
        className="h-full w-full object-contain"
      />
    ),
    title: "Media Test Engineering Intern (HAMR Modeling & Simulation)",
    org: "Western Digital",
    dates: "May 2026 – Aug 2026",
  },
  {
    href: "/research/",
    logo: (
      <img
        src="/images/nmsu/NMSU_Logo.svg"
        alt="New Mexico State University logo"
        className="h-full w-full object-contain"
      />
    ),
    title: "Graduate Research Assistant — Machine Learning & HPC",
    org: "PhD Candidate · New Mexico State University",
    dates: "Aug 2021 – Present",
  },
];

export default function Timeline() {
  return (
    <Section>
      <h2 className="text-h2 text-[var(--ink-900)]">Experience timeline</h2>
      <div className="mt-6 flex flex-col gap-4">
        {ENTRIES.map((entry) => (
          <SpotlightCard
            key={entry.title}
            as={Link}
            href={entry.href}
            className="group flex flex-col items-start gap-3 p-4 sm:flex-row sm:items-center sm:gap-4"
          >
            <span className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-[var(--r-sm)] border border-[var(--glass-surface-border)] bg-[var(--surface-0)] p-2.5">
              {entry.logo}
            </span>
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="text-body font-semibold text-[var(--ink-900)] group-hover:underline">
                {entry.title}
              </span>
              <span className="text-small text-[var(--ink-500)]">{entry.org}</span>
            </span>
            <span className="text-small shrink-0 text-[var(--ink-500)]">{entry.dates}</span>
          </SpotlightCard>
        ))}
      </div>
    </Section>
  );
}
