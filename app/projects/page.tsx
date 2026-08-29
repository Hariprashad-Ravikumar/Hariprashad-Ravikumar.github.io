import Container from "@/components/layout/Container";
import ProjectCard from "@/components/content/ProjectCard";
import { PROJECTS } from "@/content/projects";

export default function ProjectsPage() {
  return (
    <Container>
      <div className="py-16">
        <h1 className="text-h1 text-[var(--ink-900)]">Projects</h1>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </Container>
  );
}
