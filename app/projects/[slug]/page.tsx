import { notFound } from "next/navigation";
import Container from "@/components/layout/Container";
import { PROJECTS } from "@/content/projects";

const CASE_STUDIES = {
  nimble: () => import("@/content/projects/nimble.mdx"),
  "tmd-pipeline": () => import("@/content/projects/tmd-pipeline.mdx"),
  "ai-datascience-lab": () => import("@/content/projects/ai-datascience-lab.mdx"),
} as const;

type CaseStudySlug = keyof typeof CASE_STUDIES;

export function generateStaticParams() {
  return Object.keys(CASE_STUDIES).map((slug) => ({ slug }));
}

export default async function ProjectCaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!(slug in CASE_STUDIES)) {
    notFound();
  }

  const project = PROJECTS.find((p) => p.slug === slug);
  const { default: CaseStudy } = await CASE_STUDIES[slug as CaseStudySlug]();

  return (
    <Container>
      <article className="py-24">
        <h1 className="text-h1 text-[var(--ink-900)]">{project?.title ?? slug}</h1>
        <div className="mt-8">
          <CaseStudy />
        </div>
      </article>
    </Container>
  );
}
