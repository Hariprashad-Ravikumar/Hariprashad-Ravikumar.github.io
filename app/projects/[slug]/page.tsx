import { notFound } from "next/navigation";
import Container from "@/components/layout/Container";
import Picture from "@/components/ui/Picture";
import { PROJECTS } from "@/content/projects";
import { buildMetadata, SITE_URL } from "@/lib/seo";

const CASE_STUDIES = {
  "wd-internship-2026": () => import("@/content/projects/wd-internship-2026.mdx"),
  "tmd-pipeline": () => import("@/content/projects/tmd-pipeline.mdx"),
  "ai-datascience-lab": () => import("@/content/projects/ai-datascience-lab.mdx"),
} as const;

type CaseStudySlug = keyof typeof CASE_STUDIES;

// §11 gives exact copy only for /projects/wd-internship-2026; the other two
// case studies compose title/description from their already-approved
// projects.ts entry rather than invent new copy.
const SEO_OVERRIDES: Partial<Record<CaseStudySlug, { title: string; description: string }>> = {
  "wd-internship-2026": {
    title: "WD Internship: NIMBLE HAMR Simulator (Western Digital)",
    description:
      "My Western Digital internship building NIMBLE, a Dash/Plotly HAMR DCSNR simulator adopted by 40+ WD engineers across the US and Japan.",
  },
};

// Per-page structured data (site-wide Person schema lives in app/layout.tsx;
// this is additional, page-specific signal for what THIS page is about —
// only wired up where it's needed today).
const ARTICLE_JSON_LD: Partial<Record<CaseStudySlug, Record<string, unknown>>> = {
  "wd-internship-2026": {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    headline: "WD Internship: NIMBLE HAMR Simulator (Western Digital)",
    description:
      "My Western Digital internship building NIMBLE, a Dash/Plotly HAMR DCSNR simulator adopted by 40+ WD engineers across the US and Japan.",
    about: {
      "@type": "Organization",
      name: "Western Digital",
      alternateName: "WD",
    },
    author: {
      "@type": "Person",
      name: "Hariprashad Ravikumar",
      url: SITE_URL,
    },
    url: `${SITE_URL}/projects/wd-internship-2026/`,
  },
};

// §11: wd-internship-2026's h1 is a three-line title (two bold role lines, a
// smaller plain-weight org line with an inline WD logo) rather than the
// single-line title used by every other case study.
const H1_OVERRIDES: Partial<Record<CaseStudySlug, { line1: string; line2: string; org: string }>> = {
  "wd-internship-2026": {
    line1: "Intern – Media Test Engineering",
    line2: "(HAMR Modeling & Simulation)",
    org: "Western Digital, San Jose, CA, USA",
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
      title: override?.title ?? `${project?.title ?? slug} | Case Study`,
      description: override?.description ?? project?.oneLiner ?? "",
      path: `/projects/${slug}/`,
      image: `/og/projects/${slug}.png`,
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
  const h1Override = H1_OVERRIDES[slug as CaseStudySlug];
  const articleJsonLd = ARTICLE_JSON_LD[slug as CaseStudySlug];

  return (
    <Container>
      {articleJsonLd && (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />
      )}
      <article className="py-14 md:py-20">
        {h1Override ? (
          <h1 className="text-h1 text-[var(--ink-900)]">
            <span className="block font-bold">{h1Override.line1}</span>
            <span className="block font-bold">{h1Override.line2}</span>
            <span className="mt-2 flex items-center gap-2 text-lg font-normal text-[var(--ink-500)] sm:text-xl">
              @
              <Picture
                src="/images/wd/WD_Logo"
                alt="Western Digital logo"
                width={2722}
                height={857}
                sizes="80px"
                className="h-5 w-auto rounded sm:h-6"
              />
              {h1Override.org}
            </span>
          </h1>
        ) : (
          <h1 className="text-h1 text-[var(--ink-900)]">{project?.title ?? slug}</h1>
        )}
        <div className="mt-8">
          <CaseStudy />
        </div>
      </article>
    </Container>
  );
}
