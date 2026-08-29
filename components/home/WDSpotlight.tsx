"use client";

import { useState } from "react";
import Chip from "@/components/ui/Chip";
import Tag from "@/components/ui/Tag";
import { LinkButton } from "@/components/ui/Button";
import Picture from "@/components/ui/Picture";
import Lightbox from "@/components/ui/Lightbox";
import Section from "@/components/layout/Section";

const MOSAIC = [
  {
    src: "/images/wd/phd-expo",
    kicker: "WD PhD Expo 2026",
    caption: "Presenting the NIMBLE HAMR DCSNR Simulator",
    alt: "Hariprashad Ravikumar presenting the NIMBLE HAMR DCSNR Simulator at the Western Digital PhD Expo 2026",
    aspect: "aspect-[4/5]",
    span: "sm:row-span-2",
  },
  {
    src: "/images/wd/simulator-demo",
    kicker: "NIMBLE Simulator",
    caption: "Demoing DCSNR prediction from material parameters",
    alt: "Demonstrating the NIMBLE HAMR DCSNR simulator to engineers",
    aspect: "aspect-square",
    span: "",
  },
  {
    src: "/images/wd/hackathon-award",
    kicker: "Wildest Idea Award",
    caption: "WD Intern Summit 2026 Hackathon",
    alt: '"Wildest Idea" award received at the Western Digital Intern Summit 2026 Hackathon',
    aspect: "aspect-square",
    span: "",
  },
  {
    src: "/images/wd/san-jose-campus",
    kicker: "San Jose Campus",
    caption: "Western Digital, summer 2026",
    alt: "Western Digital San Jose campus during the summer 2026 internship",
    aspect: "aspect-[21/8]",
    span: "sm:col-span-2",
  },
];

export default function WDSpotlight() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <Section>
      <p className="text-eyebrow text-[var(--accent-700)]">
        Western Digital · San Jose, CA · Summer 2026
      </p>
      <div className="mt-2">
        <Chip>Modeling & Simulation Intern</Chip>
      </div>

      <h2 className="text-h2 prose-measure mt-4 text-[var(--ink-900)]">
        I built NIMBLE, a HAMR simulator now used by 30+ engineers across WD&apos;s US and Japan
        sites.
      </h2>

      <p className="text-body prose-measure mt-4 text-[var(--ink-700)]">
        Over summer 2026 I derived closed-form analytical models for grain magnetization dynamics in
        Heat-Assisted Magnetic Recording from first principles, predicting adjacent-track erasure (ATI
        & xTI) without costly hardware experiments.
      </p>
      <p className="text-body prose-measure mt-4 text-[var(--ink-700)]">
        I shipped the physics as NIMBLE, a production Dash/Plotly simulation platform packaged as a
        modular Python library, deployed on Kubernetes with Jenkins CI/CD and adopted by sputtering
        and media engineering teams.
      </p>

      <div className="mt-6 flex flex-wrap gap-8">
        <div>
          <p className="text-mono-metric text-[var(--brand-900)]">30+</p>
          <p className="text-small text-[var(--ink-500)]">engineers</p>
        </div>
        <div>
          <p className="text-mono-metric text-[var(--brand-900)]">2</p>
          <p className="text-small text-[var(--ink-500)]">R&D projects shipped</p>
        </div>
        <div>
          <p className="text-mono-metric text-[var(--brand-900)]">1</p>
          <p className="text-small text-[var(--ink-500)]">hackathon award</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-1.5">
        {["Python", "Dash", "Plotly", "Kubernetes", "Jenkins", "Monte Carlo", "HAMR Physics"].map(
          (tag) => (
            <Tag key={tag}>{tag}</Tag>
          ),
        )}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <LinkButton href="/projects/wd-internship-2026/" variant="primary">
          Read the case study →
        </LinkButton>
        <LinkButton href="/cv/" variant="secondary">
          Full CV
        </LinkButton>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {MOSAIC.map((item, i) => (
          <button
            key={item.src}
            type="button"
            onClick={() => setOpenIndex(i)}
            className={`group relative overflow-hidden rounded-[var(--r-sm)] border border-[var(--glass-border)] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-500)] ${item.aspect} ${item.span}`}
          >
            <Picture
              src={item.src}
              alt={item.alt}
              width={800}
              height={800}
              sizes="(min-width: 640px) 33vw, 50vw"
              className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/0 to-black/0 p-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <p className="text-eyebrow text-white/80">{item.kicker}</p>
              <p className="text-small text-white">{item.caption}</p>
            </div>
          </button>
        ))}
      </div>

      <Lightbox
        open={openIndex !== null}
        onClose={() => setOpenIndex(null)}
        caption={openIndex !== null ? `${MOSAIC[openIndex].kicker}: ${MOSAIC[openIndex].caption}` : null}
      >
        {openIndex !== null && (
          <Picture
            src={MOSAIC[openIndex].src}
            alt={MOSAIC[openIndex].alt}
            width={1600}
            height={1200}
            className="max-h-[80vh] w-auto rounded-[var(--r-sm)]"
          />
        )}
      </Lightbox>
    </Section>
  );
}
