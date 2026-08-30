"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import Picture from "@/components/ui/Picture";
import TerminalStatusLine from "@/components/ui/TerminalStatusLine";
import SocialLinks from "@/components/ui/SocialLinks";
import { LinkButton } from "@/components/ui/Button";
import { MailIcon } from "@/components/ui/brand-icons";
import { METRICS } from "@/content/metrics";
import Section from "@/components/layout/Section";
import { springDefault } from "@/lib/springs";
import { sectionRevealTransition, sectionRevealVariants, sectionStaggerContainer } from "@/lib/motion";

const STATUS_TEXT = `Graduating ${METRICS.graduation} · Open to Research Scientist / ML Engineer roles · SF Bay Area`;

// Fade + scale-in for the portrait — arrives just after the text cascade,
// hinting the reader's eye from words to photo. Kept separate from
// sectionRevealVariants since the portrait's own `style.y` already carries
// the scroll-parallax motion value and shouldn't also be driven by a `y`
// variant.
const heroImageVariants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1 },
};

export default function Hero() {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const rawParallax = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const parallax = useSpring(rawParallax, springDefault);

  return (
    <Section className="grid grid-cols-1 items-center gap-10 !pb-6 md:grid-cols-[3fr_2fr] md:!pb-8">
      <motion.div initial="hidden" animate="visible" variants={sectionStaggerContainer}>
        <motion.h1
          variants={sectionRevealVariants}
          transition={sectionRevealTransition}
          className="whitespace-nowrap text-[var(--ink-900)]"
          style={{
            fontSize: "clamp(22px, 6.4vw, 64px)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
          }}
        >
          Hariprashad Ravikumar
        </motion.h1>
        <motion.p
          variants={sectionRevealVariants}
          transition={sectionRevealTransition}
          className="text-h3 mt-3 font-normal text-[var(--ink-500)]"
        >
          Computational physicist building GPU-accelerated ML and simulation tools.
        </motion.p>

        <motion.div variants={sectionRevealVariants} transition={sectionRevealTransition} className="mt-5">
          <TerminalStatusLine text={STATUS_TEXT} />
        </motion.div>

        <motion.p
          variants={sectionRevealVariants}
          transition={sectionRevealTransition}
          className="text-body prose-measure mt-6 text-[var(--ink-700)]"
        >
          I turn large-scale physics simulations into software that engineers actually use. At{" "}
          <strong className="font-semibold text-[var(--ink-900)]">Western Digital</strong> I derived
          closed-form models for heat-assisted magnetic recording from first
          principles and shipped HAMR DCSNR NIMBLE app, the simulator that the team now runs across sites in the US and
          Japan.
        </motion.p>
        <motion.p
          variants={sectionRevealVariants}
          transition={sectionRevealTransition}
          className="text-body prose-measure mt-4 text-[var(--ink-700)]"
        >
          My PhD at New Mexico State University applies GPU-accelerated HPC and machine learning to
          lattice QCD with {METRICS.observables.value} observables, CUDA C++ pipelines, and symbolic
          regression that recovers analytical structure from noisy Monte Carlo data using HPC (High
          Performance Computing).
        </motion.p>
      </motion.div>

      <div ref={heroRef} className="flex justify-center md:justify-end">
        <motion.div
          className="w-full max-w-[340px] overflow-hidden rounded-full border border-[var(--glass-surface-border)]"
          style={{ y: parallax }}
          initial="hidden"
          animate="visible"
          variants={heroImageVariants}
          transition={{ ...sectionRevealTransition, delay: 0.3 }}
        >
          <Picture
            src="/images/hero/headshot"
            alt="Portrait of Hariprashad Ravikumar"
            width={640}
            height={640}
            priority
            sizes="(min-width: 768px) 340px, 70vw"
            className="aspect-square w-full object-cover"
          />
        </motion.div>
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={sectionRevealVariants}
        transition={{ ...sectionRevealTransition, delay: 0.3 }}
        className="flex flex-wrap items-center gap-3 md:col-span-2 md:-mt-6"
      >
        <LinkButton href="/projects/" variant="primary">
          View Projects
        </LinkButton>
        <LinkButton href="/cv/CV_HARI.pdf" variant="secondary" target="_blank" rel="noopener noreferrer">
          Download Résumé
        </LinkButton>
        <LinkButton href="mailto:hari1729@nmsu.edu" variant="ghost">
          <MailIcon className="h-4 w-auto" />
          Email me
        </LinkButton>
        <SocialLinks />
      </motion.div>
    </Section>
  );
}
