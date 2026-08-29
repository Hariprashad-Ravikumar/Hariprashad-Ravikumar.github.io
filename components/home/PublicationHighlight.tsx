import Link from "next/link";
import { LinkButton } from "@/components/ui/Button";
import { PEER_REVIEWED } from "@/content/publications";
import Section from "@/components/layout/Section";

export default function PublicationHighlight() {
  const pub = PEER_REVIEWED[0];

  return (
    <Section>
      <p className="text-eyebrow text-[var(--accent-700)]">Peer-reviewed · Physical Review D</p>
      <h2 className="text-h2 prose-measure mt-2 text-[var(--ink-900)]">{pub.title}</h2>
      <p className="text-body prose-measure mt-3 text-[var(--ink-500)]">
        {pub.authors} | {pub.venue}
      </p>

      <div className="mt-5 flex flex-wrap gap-3">
        {pub.links.map((link) =>
          link.href ? (
            <LinkButton key={link.label} href={link.href} variant="secondary" target="_blank" rel="noopener noreferrer">
              {link.label}
            </LinkButton>
          ) : null,
        )}
        <Link
          href="/publications/"
          className="inline-flex items-center px-2 text-sm font-semibold text-[var(--brand-500)] hover:underline"
        >
          All publications →
        </Link>
      </div>
    </Section>
  );
}
