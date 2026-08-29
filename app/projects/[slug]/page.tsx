import { notFound } from "next/navigation";
import Container from "@/components/layout/Container";

// Full case-study content (§10.5) and MDX loading land in Phase 3/4.
// Only NIMBLE, TMD Pipeline, and AI-DataScience-Lab get case-study pages (§1, §10.4).
const CASE_STUDY_SLUGS = ["nimble", "tmd-pipeline", "ai-datascience-lab"] as const;

export function generateStaticParams() {
  return CASE_STUDY_SLUGS.map((slug) => ({ slug }));
}

export default async function ProjectCaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!CASE_STUDY_SLUGS.includes(slug as (typeof CASE_STUDY_SLUGS)[number])) {
    notFound();
  }

  return (
    <Container>
      <div className="py-24">
        <h1 className="text-h1 text-[var(--ink-900)]">{slug}</h1>
        <p className="text-body prose-measure mt-4 text-[var(--ink-500)]">
          Case study content lands in Phase 4 (§10.5).
        </p>
      </div>
    </Container>
  );
}
