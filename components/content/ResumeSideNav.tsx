"use client";

import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "industry", label: "Industry Experience" },
  { id: "education", label: "Education" },
  { id: "skills", label: "Technical Skills" },
  { id: "research", label: "Research Experience" },
  { id: "publications", label: "Publications" },
  { id: "awards", label: "Awards" },
  { id: "certifications", label: "Certifications" },
  { id: "schools", label: "Schools & Workshops" },
  { id: "teaching", label: "Teaching" },
];

export default function ResumeSideNav() {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const elements = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <nav aria-label="Résumé sections" className="sticky top-24 hidden w-52 shrink-0 flex-col gap-1 lg:flex">
      {SECTIONS.map((section) => {
        const active = section.id === activeId;
        return (
          <a
            key={section.id}
            href={`#${section.id}`}
            aria-current={active ? "location" : undefined}
            className={`rounded-[var(--r-sm)] px-3 py-1.5 text-sm transition-colors ${
              active
                ? "bg-[var(--glass-trim-bg)] text-[var(--ink-900)] font-medium"
                : "text-[var(--ink-500)] hover:bg-[var(--surface-50)] hover:text-[var(--ink-900)]"
            }`}
          >
            {section.label}
          </a>
        );
      })}
    </nav>
  );
}
