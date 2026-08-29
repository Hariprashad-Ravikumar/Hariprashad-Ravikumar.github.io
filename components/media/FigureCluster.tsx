"use client";

import { useState } from "react";
import Picture from "@/components/ui/Picture";
import Lightbox from "@/components/ui/Lightbox";

export type Figure = {
  src: string;
  alt: string;
  step: string;
  title: string;
  desc: string;
};

/**
 * 2x2 grid of research figures with click-to-lightbox. Renders nothing when
 * no figures are supplied (Phase 7, §16.1) so pages that reference it need
 * no changes once figures arrive — just pass the array.
 */
export default function FigureCluster({ figures }: { figures: Figure[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (figures.length === 0) return null;

  return (
    <div className="mt-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {figures.map((fig, i) => (
          <button
            key={fig.src}
            type="button"
            onClick={() => setOpenIndex(i)}
            className="group text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-500)]"
          >
            <div className="overflow-hidden rounded-[var(--r-sm)] border border-[var(--line)]">
              <Picture
                src={fig.src}
                alt={fig.alt}
                width={1600}
                height={1000}
                className="w-full transition-transform duration-200 group-hover:scale-[1.02]"
              />
            </div>
            <p className="text-eyebrow mt-2 text-[var(--accent-500)]">{fig.step}</p>
            <p className="text-h3 mt-0.5 text-[var(--ink-900)]">{fig.title}</p>
            <p className="text-small mt-1 text-[var(--ink-500)]">{fig.desc}</p>
          </button>
        ))}
      </div>

      <Lightbox
        open={openIndex !== null}
        onClose={() => setOpenIndex(null)}
        caption={openIndex !== null ? figures[openIndex].desc : null}
      >
        {openIndex !== null && (
          <Picture
            src={figures[openIndex].src}
            alt={figures[openIndex].alt}
            width={1600}
            height={1000}
            className="max-h-[80vh] w-auto rounded-[var(--r-sm)]"
          />
        )}
      </Lightbox>
    </div>
  );
}
