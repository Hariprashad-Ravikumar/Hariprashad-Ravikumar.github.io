import Container from "@/components/layout/Container";
import ProjectCard from "@/components/content/ProjectCard";
import Reveal from "@/components/ui/Reveal";
import { PROJECTS } from "@/content/projects";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Projects | Simulation, ML & Scientific Software",
  description:
    "Enterprise HAMR simulator, GPU-accelerated lattice QCD ML pipeline, full-stack forecasting apps, and more.",
  path: "/projects/",
  image: "/og/projects.png",
});

export default function ProjectsPage() {
  return (
    <Container>
      <div className="py-10 md:py-14">
        <h1 className="text-h1 text-[var(--ink-900)]">Projects</h1>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((project, i) => (
            <Reveal key={project.slug} delay={(i % 3) * 0.06}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      </div>
    </Container>
  );
}
