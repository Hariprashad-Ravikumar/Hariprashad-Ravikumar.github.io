import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { PROJECTS } from "@/content/projects";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticRoutes = [
    "/",
    "/research/",
    "/projects/",
    "/publications/",
    "/talks/",
    "/resume/",
    "/contact/",
  ];

  const caseStudyRoutes = PROJECTS.filter((p) => p.hasCaseStudy).map(
    (p) => `/projects/${p.slug}/`,
  );

  return [...staticRoutes, ...caseStudyRoutes].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
  }));
}
