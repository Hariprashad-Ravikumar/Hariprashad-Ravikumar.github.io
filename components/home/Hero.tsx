"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Picture from "@/components/ui/Picture";
import Chip from "@/components/ui/Chip";
import { LinkButton } from "@/components/ui/Button";
import { METRICS } from "@/content/metrics";
import Section from "@/components/layout/Section";

export default function Hero() {
  const [parallax, setParallax] = useState(0);

  useEffect(() => {
    const onScroll = () => setParallax(window.scrollY * -0.06);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <Section className="grid grid-cols-1 items-center gap-10 md:grid-cols-[3fr_2fr]">
      <div>
        <h1
          className="whitespace-nowrap text-[var(--ink-900)]"
          style={{
            fontSize: "clamp(22px, 6.4vw, 64px)",
            fontWeight: 700,
            letterSpacing: "0.01em",
            lineHeight: 1.05,
          }}
        >
          Hariprashad Ravikumar
        </h1>
        <p className="text-h3 mt-3 font-normal text-[var(--ink-500)]">
          Computational physicist building GPU-accelerated ML and simulation tools.
        </p>

        <div className="mt-5">
          <Chip>
            ● Graduating {METRICS.graduation} · Open to Research Scientist / ML Engineer roles · SF Bay
            Area
          </Chip>
        </div>

        <p className="text-body prose-measure mt-6 text-[var(--ink-700)]">
          I turn large-scale physics simulations into software that engineers actually use. At Western
          Digital I derived closed-form models for heat-assisted magnetic recording from first
          principles and shipped NIMBLE, the simulator that the team now runs across sites in the US and
          Japan.
        </p>
        <p className="text-body prose-measure mt-4 text-[var(--ink-700)]">
          My PhD at New Mexico State University applies GPU-accelerated HPC and machine learning to
          lattice QCD with {METRICS.observables.value} observables, CUDA C++ pipelines, and symbolic
          regression that recovers analytical structure from noisy Monte Carlo data.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <LinkButton href="/projects/" variant="primary">
            View Projects
          </LinkButton>
          <LinkButton href="/cv/CV_HARI.pdf" variant="secondary" target="_blank" rel="noopener noreferrer">
            Download CV
          </LinkButton>
          <LinkButton href="mailto:hari1729@nmsu.edu" variant="ghost">
            Email me
          </LinkButton>
        </div>
      </div>

      <div className="flex justify-center md:justify-end">
        <div
          className="w-full max-w-[260px] overflow-hidden rounded-[var(--r-lg)] border border-[var(--glass-border)]"
          style={{ transform: `translateY(${parallax}px)` }}
        >
          <Picture
            src="/images/hero/headshot"
            alt="Portrait of Hariprashad Ravikumar"
            width={640}
            height={800}
            priority
            sizes="(min-width: 768px) 260px, 60vw"
            className="aspect-[4/5] w-full object-cover"
          />
        </div>
      </div>
    </Section>
  );
}
