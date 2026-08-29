import Link from "next/link";
import Container from "@/components/layout/Container";
import Card from "@/components/ui/Card";
import Tag from "@/components/ui/Tag";
import FigureCluster from "@/components/media/FigureCluster";
import { METRICS } from "@/content/metrics";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Research — Lattice QCD, HPC & Physics-Informed ML",
  description:
    "Lattice QCD calculations of TMDs, nucleon EDMs with Los Alamos, and conformal algebra — GPU-accelerated HPC and symbolic regression.",
  path: "/research/",
});

const THRUSTS = [
  {
    title: "Lattice QCD & Transverse Momentum Dependent Distributions",
    meta: "PhD, Dr. Michael Engelhardt, NMSU",
    body: `How do quarks and gluons move inside the proton? End-to-end ML pipeline over ${METRICS.observables.value} observables from Monte Carlo simulation, ${METRICS.accuracy.value} accuracy via symbolic regression (PySR); GPU-accelerated CUDA C++ reduced processing time ${METRICS.speedup.value}; jackknife/bootstrap uncertainty quantification.`,
    tags: ["CUDA C++", "PySR", "Monte Carlo", "Jackknife/Bootstrap"],
    figuresKey: "lattice-tmd",
  },
  {
    title: "Nucleon Electric Dipole Moments",
    meta: "Collaboration with Los Alamos National Laboratory",
    body: `Parallelized C++/CUDA kernels on NERSC Perlmutter; ${METRICS.computeHours.value} via custom SLURM workflows.`,
    tags: ["CUDA", "SLURM", "NERSC Perlmutter"],
    figuresKey: "nucleon-edm",
  },
  {
    title: "Conformal Algebra Interpolation",
    meta: "Collaboration with Prof. Chueng-Ryong Ji, NC State",
    body: "Mathematica symbolic-computation workflows analyzing algebraic structures and relativistic symmetry constraints. Published in Physical Review D 113, 096018 (2026); (3+1)-dimensional extension in preparation.",
    tags: ["Mathematica", "Symbolic Computation"],
    figuresKey: "conformal-algebra",
  },
];

// Phase 7 (§16.1) fills these in — FigureCluster renders nothing until then.
const RESEARCH_FIGURES: Record<string, []> = {
  "lattice-tmd": [],
  "nucleon-edm": [],
  "conformal-algebra": [],
};

export default function ResearchPage() {
  return (
    <Container>
      <div className="py-16">
        <h1 className="text-h1 text-[var(--ink-900)]">Research</h1>
        <p className="text-body prose-measure mt-4 text-[var(--ink-700)]">
          I work at the intersection of quantum field theory and large-scale computation — using
          GPU-accelerated HPC and machine learning to extract physics from simulations that produce
          terabytes of noisy data.
        </p>

        {/* §10.3: the full five-paragraph narrative from the live homepage, moved here verbatim,
            with one correction — "over 98% predictive accuracy" → METRICS.accuracy.value (93%+). */}
        <div className="prose-measure mt-8 flex flex-col gap-4">
          <p className="text-body text-[var(--ink-700)]">
            I&apos;m a theoretical particle physics PhD candidate at New Mexico State University, USA,
            specializing in the application of GPU-accelerated high-performance computing (HPC) and
            machine learning to fundamental physics problems. My work focuses on studying the
            intrinsic motion of quarks and gluons and exploring Beyond Standard Model (BSM) physics
            through large-scale simulation quantum field theory and symmetries.
          </p>
          <p className="text-body text-[var(--ink-700)]">
            My PhD research under{" "}
            <a
              href="https://phys.nmsu.edu/facultydirectory/engelhardt_michael.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--brand-500)] hover:underline"
            >
              Dr. Michael Engelhardt
            </a>{" "}
            focuses on lattice quantum chromodynamics (QCD) calculations of Transverse Momentum
            Dependent Parton Distribution Functions (TMDs). To achieve this, I built an end-to-end
            machine learning pipeline to process over {METRICS.observables.value} multidimensional
            observables from Monte Carlo simulations, achieving {METRICS.accuracy.value} predictive
            accuracy using symbolic regression (PySR). To handle the multi-terabyte datasets, I
            developed GPU-accelerated CUDA C++ pipelines that reduced data processing time by{" "}
            {METRICS.speedup.value} on HPC clusters, alongside production-grade packages to manage
            resampling and ensure numerical stability.
          </p>
          <p className="text-body text-[var(--ink-700)]">
            Recently, as a Modeling and Simulation Intern at <strong>Western Digital</strong>, I
            applied my computational physics and software engineering expertise to next-generation
            Heat-Assisted Magnetic Recording (HAMR) technology. I developed a closed-form analytical
            model from first principles to evaluate write behavior and predict adjacent track erasure
            (ATI & xTI), with a peer-reviewed publication currently in progress. Simultaneously, I
            built and deployed &ldquo;NIMBLE&rdquo;—a full-stack interactive simulation web
            application using Python, Dash, and Kubernetes. Packaged as a modular Python library, this
            simulator is now actively used by cross-functional engineering teams to evaluate recording
            performance and accelerate hardware development cycles.
          </p>
          <p className="text-body text-[var(--ink-700)]">
            In addition to my core research and industry work, I maintain active independent
            collaborations. With <strong>Los Alamos National Laboratory</strong>, I develop and
            optimize parallelized C++ CUDA kernels on HPC clusters (NERSC Perlmutter) to accelerate
            multi-terabyte calculations for nucleon Electric Dipole Moments (EDMs). Concurrently, I
            collaborate with <strong>North Carolina State University</strong>, utilizing Mathematica
            symbolic computation workflows on HPC clusters to analyze complex algebraic structures and
            relativistic symmetry constraints.
          </p>
          <p className="text-body text-[var(--ink-700)]">
            As I anticipate defending my dissertation in December 2026, my background provides a
            unique blend of deep physics intuition and hands-on expertise in C++/CUDA, parallel
            computing, and machine learning. I am driven to apply these skills to solve complex,
            data-intensive challenges and contribute to cutting-edge scientific and technical
            advancements in the industry.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {THRUSTS.map((thrust) => (
            <Card key={thrust.title} className="flex flex-col gap-3">
              <h2 className="text-h3 text-[var(--ink-900)]">{thrust.title}</h2>
              <p className="text-small text-[var(--ink-500)]">{thrust.meta}</p>
              <p className="text-body text-[var(--ink-700)]">{thrust.body}</p>
              <div className="flex flex-wrap gap-1.5">
                {thrust.tags.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>
              <FigureCluster figures={RESEARCH_FIGURES[thrust.figuresKey]} />
            </Card>
          ))}
        </div>

        <p className="mt-10">
          <Link href="/talks/" className="text-sm font-medium text-[var(--brand-500)] hover:underline">
            See all talks →
          </Link>
        </p>
      </div>
    </Container>
  );
}
