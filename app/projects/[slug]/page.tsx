import { notFound } from "next/navigation";
import Container from "@/components/layout/Container";
import { PROJECTS } from "@/content/projects";
import { buildMetadata } from "@/lib/seo";

const CASE_STUDIES = {
  nimble: () => import("@/content/projects/nimble.mdx"),
  "tmd-pipeline": () => import("@/content/projects/tmd-pipeline.mdx"),
  "ai-datascience-lab": () => import("@/content/projects/ai-datascience-lab.mdx"),
} as const;

type CaseStudySlug = keyof typeof CASE_STUDIES;

// §11 gives exact copy only for /projects/nimble; the other two case studies
// compose title/description from their already-approved projects.ts entry
// rather than invent new copy.
const SEO_OVERRIDES: Partial<Record<CaseStudySlug, { title: string; description: string }>> = {
  nimble: {
    title: "NIMBLE — HAMR DCSNR Simulator (Western Digital)",
    description:
      "Production Dash/Plotly simulation platform for heat-assisted magnetic recording, used by 30+ engineers across WD US and Japan sites.",
  },
};

export function generateStaticParams() {
  return Object.keys(CASE_STUDIES).map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  return params.then(({ slug }) => {
    const project = PROJECTS.find((p) => p.slug === slug);
    const override = SEO_OVERRIDES[slug as CaseStudySlug];
    return buildMetadata({
      title: override?.title ?? `${project?.title ?? slug} — Case Study`,
      description: override?.description ?? project?.oneLiner ?? "",
      path: `/projects/${slug}/`,
    });
  });
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
