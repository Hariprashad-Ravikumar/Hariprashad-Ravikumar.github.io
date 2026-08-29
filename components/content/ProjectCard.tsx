import Link from "next/link";
import SpotlightCard from "@/components/ui/SpotlightCard";
import Tag from "@/components/ui/Tag";
import ProjectCover from "@/components/media/ProjectCover";
import type { Project } from "@/content/projects";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <SpotlightCard className="flex h-full flex-col overflow-hidden">
      <ProjectCover {...project.cover} />
      <div className="flex flex-1 flex-col gap-3 p-6">
        <h3 className="text-h3 text-[var(--ink-900)]">{project.title}</h3>
        <p className="text-body flex-1 text-[var(--ink-500)]">{project.oneLiner}</p>
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
        {project.links.length > 0 && (
          <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1 text-sm font-medium text-[var(--brand-500)]">
            {project.links.map((link) =>
              link.href.startsWith("/") ? (
                <Link key={link.label} href={link.href} className="hover:underline">
                  {link.label} →
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {link.label} ↗
                </a>
              ),
            )}
          </div>
        )}
      </div>
    </SpotlightCard>
  );
}
