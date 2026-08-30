import Container from "@/components/layout/Container";
import PubEntry from "@/components/content/PubEntry";
import Reveal from "@/components/ui/Reveal";
import { CONFERENCE, IN_PREPARATION, PEER_REVIEWED, THESES } from "@/content/publications";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Publications | Hariprashad Ravikumar",
  description:
    "Peer-reviewed work including Physical Review D 113, 096018 (2026), plus manuscripts in preparation and conference proceedings.",
  path: "/publications/",
});

export default function PublicationsPage() {
  return (
    <Container>
      <div className="py-10 md:py-14">
        <h1 className="text-h1 text-[var(--ink-900)]">Publications</h1>

        <Reveal as="section" className="mt-7">
          <h2 className="text-h2 text-[var(--ink-900)]">Peer-Reviewed Publications</h2>
          <ul>
            {PEER_REVIEWED.map((pub) => (
              <PubEntry key={pub.title} pub={pub} showCredibility />
            ))}
          </ul>
        </Reveal>

        <Reveal as="section" className="mt-7" delay={0.05}>
          <h2 className="text-h2 text-[var(--ink-900)]">In Preparation</h2>
          <ul className="flex flex-col gap-2">
            {IN_PREPARATION.map((citation) => (
              <li key={citation} className="text-body prose-measure border-t border-[var(--glass-border)] pt-2 text-[var(--ink-700)]">
                {citation}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal as="section" className="mt-7" delay={0.05}>
          <h2 className="text-h2 text-[var(--ink-900)]">Conference</h2>
          <ul className="flex flex-col gap-2">
            {CONFERENCE.map((entry) => (
              <li key={entry.citation} className="text-body prose-measure border-t border-[var(--glass-border)] pt-2 text-[var(--ink-700)]">
                {entry.citation}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal as="section" className="mt-7" delay={0.05}>
          <h2 className="text-h2 text-[var(--ink-900)]">Theses</h2>
          <ul className="flex flex-col gap-2">
            {THESES.map((entry) => (
              <li key={entry.citation} className="text-body prose-measure border-t border-[var(--glass-border)] pt-2 text-[var(--ink-700)]">
                {entry.citation}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Container>
  );
}
