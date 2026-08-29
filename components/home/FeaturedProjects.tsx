import Link from "next/link";
import ProjectCard from "@/components/content/ProjectCard";
import { PROJECTS } from "@/content/projects";

const FEATURED_SLUGS = ["nimble", "tmd-pipeline", "ai-datascience-lab"];

export default function FeaturedProjects() {
  const featured = FEATURED_SLUGS.map((slug) => PROJECTS.find((p) => p.slug === slug)!).filter(
    Boolean,
  );

  return (
    <section className="py-16">
      <div className="flex items-baseline justify-between">
        <h2 className="text-h2 text-[var(--ink-900)]">Featured projects</h2>
        <Link href="/projects/" className="text-sm font-medium text-[var(--brand-500)] hover:underline">
          All projects →
        </Link>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        {featured.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}
