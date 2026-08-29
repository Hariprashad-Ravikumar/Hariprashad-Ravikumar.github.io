"use client";

import { useMemo, useState } from "react";
import MathText from "@/components/ui/MathText";
import { TALKS, type Topic } from "@/content/talks";

const TOPICS: Topic[] = ["HAMR / Industry", "Lattice QCD", "Conformal Algebra", "Quantum Computing", "Seminars"];

function yearOf(date: string): string {
  const match = date.match(/\d{4}/);
  return match ? match[0] : date;
}

export default function TalkList() {
  const [active, setActive] = useState<Topic | null>(null);

  const filtered = useMemo(
    () => (active ? TALKS.filter((t) => t.topics.includes(active)) : TALKS),
    [active],
  );

  const byYear = useMemo(() => {
    const groups = new Map<string, typeof TALKS>();
    for (const talk of filtered) {
      const year = yearOf(talk.date);
      if (!groups.has(year)) groups.set(year, []);
      groups.get(year)!.push(talk);
    }
    return groups;
  }, [filtered]);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActive(null)}
          className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
            active === null
              ? "border-[var(--brand-900)] bg-[var(--brand-900)] text-white"
              : "border-[var(--glass-border)] text-[var(--ink-700)] hover:bg-[var(--surface-50)]"
          }`}
        >
          All
        </button>
        {TOPICS.map((topic) => (
          <button
            key={topic}
            type="button"
            onClick={() => setActive(topic)}
            className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
              active === topic
                ? "border-[var(--brand-900)] bg-[var(--brand-900)] text-white"
                : "border-[var(--glass-border)] bg-[var(--glass-bg)] text-[var(--ink-700)] backdrop-blur-[var(--glass-blur-sm)] hover:bg-[var(--glass-bg-heavy)]"
            }`}
          >
            {topic}
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-8">
        {Array.from(byYear.entries()).map(([year, talks]) => (
          <div key={year}>
            <h2 className="text-h3 text-[var(--ink-500)]">{year}</h2>
            <ul className="mt-3 flex flex-col gap-2">
              {talks.map((talk) => (
                <li key={`${talk.date}-${talk.title}`} className="border-t border-[var(--glass-border)] pt-3">
                  <p className="text-body text-[var(--ink-900)]">
                    <strong>({talk.date})</strong>{" "}
                    {talk.href ? (
                      <a
                        href={encodeURI(talk.href)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--brand-500)] hover:underline"
                      >
                        &ldquo;
                        <MathText text={talk.title} />
                        &rdquo;
                      </a>
                    ) : (
                      <>
                        &ldquo;
                        <MathText text={talk.title} />
                        &rdquo;
                      </>
                    )}
                    , {talk.venue}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
