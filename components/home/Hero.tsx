"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Picture from "@/components/ui/Picture";
import Chip from "@/components/ui/Chip";
import { LinkButton } from "@/components/ui/Button";
import { METRICS } from "@/content/metrics";

export default function Hero() {
  const [parallax, setParallax] = useState(0);

  useEffect(() => {
    const onScroll = () => setParallax(window.scrollY * -0.06);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="grid grid-cols-1 items-center gap-10 py-16 md:grid-cols-2 md:py-24">
      <div>
        <h1 className="text-display text-[var(--ink-900)]">Hariprashad Ravikumar</h1>
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
          principles and shipped NIMBLE, the simulator that team now runs across sites in the US and
          Japan.
        </p>
        <p className="text-body prose-measure mt-4 text-[var(--ink-700)]">
          My PhD at New Mexico State University applies GPU-accelerated HPC and machine learning to
          lattice QCD — {METRICS.observables.value} observables, CUDA C++ pipelines, and symbolic
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
          className="w-full max-w-sm overflow-hidden rounded-[var(--r-lg)] border border-[var(--line)]"
          style={{ transform: `translateY(${parallax}px)` }}
        >
          <Picture
            src="/images/hero/headshot"
            alt="Portrait of Hariprashad Ravikumar"
            width={640}
            height={800}
            priority
            className="aspect-[4/5] w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
