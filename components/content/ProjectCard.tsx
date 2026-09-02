"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import SpotlightCard from "@/components/ui/SpotlightCard";
import Tag from "@/components/ui/Tag";
import ProjectCover from "@/components/media/ProjectCover";
import type { Project } from "@/content/projects";
import { GitHubIcon, GoogleCloudIcon, LinkedInIcon, type IconKey } from "@/components/ui/brand-icons";
import { springPress } from "@/lib/springs";

const MotionLink = motion.create(Link);

const LINK_ICONS: Partial<Record<IconKey, typeof GitHubIcon>> = {
  github: GitHubIcon,
  googlecloud: GoogleCloudIcon,
  linkedin: LinkedInIcon,
};

export default function ProjectCard({ project }: { project: Project }) {
  const caseStudyHref = project.hasCaseStudy ? `/projects/${project.slug}/` : null;

  return (
    <SpotlightCard
      className={`relative flex h-full flex-col overflow-hidden ${caseStudyHref ? "cursor-pointer" : ""}`}
    >
      {caseStudyHref && (
        <Link
          href={caseStudyHref}
          className="absolute inset-0 z-0"
          aria-label={project.title}
          tabIndex={-1}
        />
      )}
      <ProjectCover {...project.cover} />
      <div className="flex flex-1 flex-col gap-2.5 p-5">
        <h3 className="text-h3 text-[var(--ink-900)]">{project.title}</h3>
        <p className="text-body flex-1 text-[var(--ink-500)]">{project.oneLiner}</p>
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
        {project.links.length > 0 && (
          <div className="relative z-10 flex flex-wrap gap-x-4 gap-y-1 pt-1 text-sm font-medium text-[var(--brand-500)]">
            {project.links.map((link) =>
              link.href.startsWith("/") ? (
                <MotionLink
                  key={link.label}
                  href={link.href}
                  className="hover:underline"
                  whileTap={{ scale: 0.96 }}
                  transition={springPress}
                >
                  {link.label} →
                </MotionLink>
              ) : (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:underline"
                  whileTap={{ scale: 0.96 }}
                  transition={springPress}
                >
                  {(() => {
                    const Icon = link.icon ? LINK_ICONS[link.icon] : undefined;
                    return Icon ? <Icon className="h-3.5 w-auto" /> : null;
                  })()}
                  {link.label} ↗
                </motion.a>
              ),
            )}
          </div>
        )}
      </div>
    </SpotlightCard>
  );
}
