"use client";

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

export default function CVSideNav() {
  return (
    <nav aria-label="CV sections" className="sticky top-24 hidden w-52 shrink-0 flex-col gap-1 lg:flex">
      {SECTIONS.map((section) => (
        <a
          key={section.id}
          href={`#${section.id}`}
          className="rounded-[var(--r-sm)] px-3 py-1.5 text-sm text-[var(--ink-500)] hover:bg-[var(--surface-50)] hover:text-[var(--ink-900)]"
        >
          {section.label}
        </a>
      ))}
    </nav>
  );
}
