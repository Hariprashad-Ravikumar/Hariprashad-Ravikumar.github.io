import Chip from "@/components/ui/Chip";
import Tag from "@/components/ui/Tag";
import { LinkButton } from "@/components/ui/Button";
import Section from "@/components/layout/Section";

export default function WDSpotlight() {
  return (
    <Section>
      <p className="text-eyebrow text-[var(--accent-700)]">
        Western Digital · San Jose, CA · Summer 2026
      </p>
      <div className="mt-2">
        <Chip>Modeling & Simulation Intern</Chip>
      </div>

      <h2 className="text-h2 prose-measure mt-4 text-[var(--ink-900)]">
        I built a full-stack enterprise HAMR simulator now used daily by 40+ senior R&amp;D engineers and
        subject-matter experts across WD&apos;s US and Japan sites.
      </h2>

      <p className="text-body prose-measure mt-4 text-[var(--ink-700)]">
        Over summer 2026 I derived closed-form analytical models for grain magnetization dynamics in
        Heat-Assisted Magnetic Recording from first principles, predicting adjacent-track erasure (ATI
        & xTI) without costly hardware experiments.
      </p>
      <p className="text-body prose-measure mt-4 text-[var(--ink-700)]">
        I shipped a production Dash/Plotly simulation platform packaged as a
        modular Python library, deployed on Kubernetes with Jenkins CI/CD and adopted by sputtering
        and media engineering teams.
      </p>

      <div className="mt-6 flex flex-wrap gap-8">
        <div>
          <p className="text-mono-metric text-[var(--brand-900)]">40+</p>
          <p className="text-small text-[var(--ink-500)]">R&amp;D experts</p>
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
        <LinkButton href="/resume/" variant="secondary">
          Full Résumé
        </LinkButton>
      </div>
    </Section>
  );
}
