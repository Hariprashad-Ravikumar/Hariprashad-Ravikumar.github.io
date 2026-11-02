import AIShare from "@/components/ui/AIShare";
import Container from "@/components/layout/Container";
import PubEntry from "@/components/content/PubEntry";
import Reveal from "@/components/ui/Reveal";
import { CONFERENCE, IN_PREPARATION, PEER_REVIEWED, PREPRINTS, THESES } from "@/content/publications";
import { buildMetadata, SITE_URL } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Publications | Hariprashad Ravikumar",
  description:
    "Peer-reviewed work including Physical Review D 113, 096018 (2026), plus preprints, manuscripts in preparation, and conference proceedings.",
  path: "/publications/",
  image: "/og/publications.png",
});

export default function PublicationsPage() {
  const articles = PEER_REVIEWED.flatMap((publication) => {
    const info = publication.bibliographic;
    if (!info) return [];
    return [{
      "@context": "https://schema.org",
      "@type": "ScholarlyArticle",
      "@id": `https://doi.org/${info.doi}`,
      url: `https://doi.org/${info.doi}`,
      headline: publication.title,
      author: info.authorNames.map(name => name === "Hariprashad Ravikumar"
        ? { "@type": "Person", "@id": `${SITE_URL}/#person`, name }
        : { "@type": "Person", name }),
      datePublished: info.year,
      identifier: info.doi,
      pagination: info.articleNumber,
      isPartOf: {
        "@type": "PublicationVolume", volumeNumber: info.volume,
        isPartOf: { "@type": "Periodical", name: info.journal },
      },
      sameAs: publication.links.map(link => link.href),
    }];
  });
  return (
    <Container>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articles).replace(/</g, "\\u003c") }} />
      <div className="py-10 md:py-14">
        <h1 className="text-h1 text-[var(--ink-900)]">Publications</h1>
        <AIShare />

        <Reveal as="section" className="mt-7">
          <h2 className="text-h2 text-[var(--ink-900)]">Peer-Reviewed Publications</h2>
          <ul>
            {PEER_REVIEWED.map((pub) => (
              <PubEntry key={pub.title} pub={pub} showCredibility />
            ))}
          </ul>
        </Reveal>

        <Reveal as="section" className="mt-7" delay={0.05}>
          <h2 className="text-h2 text-[var(--ink-900)]">Preprints</h2>
          <ul>
            {PREPRINTS.map((pub) => (
              <PubEntry key={pub.title} pub={pub} />
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
