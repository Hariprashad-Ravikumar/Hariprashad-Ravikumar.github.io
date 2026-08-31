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

  const images: Record<string, string[]> = {
    "/": [`${SITE_URL}/images/hero/headshot-1920.webp`, `${SITE_URL}/og/card.png`],
    "/projects/wd-internship-2026/": [
      `${SITE_URL}/images/wd/WD-IDCard-1920.webp`,
      `${SITE_URL}/images/wd/san-jose-campus-1920.webp`,
      `${SITE_URL}/images/wd/20260728_121346_485-640.webp`,
    ],
  };

  return [...staticRoutes, ...caseStudyRoutes].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    ...(images[path] ? { images: images[path] } : {}),
  }));
}
