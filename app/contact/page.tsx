import Container from "@/components/layout/Container";
import { LinkButton } from "@/components/ui/Button";
import { CONTACT } from "@/content/cv";
import { METRICS } from "@/content/metrics";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Contact | Hariprashad Ravikumar",
  description:
    "Graduating December 2026 and interviewing for Research Scientist and ML Engineer roles in the SF Bay Area.",
  path: "/contact/",
});

const LINKS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/hariprashad-ravikumar/" },
  { label: "GitHub", href: "https://github.com/Hariprashad-Ravikumar" },
  { label: "ORCID", href: "https://orcid.org/0000-0002-3276-852X" },
  { label: "arXiv", href: "https://arxiv.org/abs/2601.19251" },
  { label: "Handshake", href: "https://app.joinhandshake.com/profiles/hariprashad-ravikumar" },
];

export default function ContactPage() {
  return (
    <Container>
      <div className="py-24">
        <h1 className="text-h1 text-[var(--ink-900)]">Get in touch</h1>
        <p className="text-h3 prose-measure mt-3 font-normal text-[var(--ink-500)]">
          I&apos;m graduating in {METRICS.graduation} and interviewing now.
        </p>
        <p className="text-body prose-measure mt-4 text-[var(--ink-700)]">
          I&apos;m looking for Research Scientist, Applied/ML Scientist, HPC & Scientific Computing
          Engineer, or Software Engineer roles in the SF Bay Area. Authorized to work in the U.S.
          under STEM OPT; open to H-1B sponsorship.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium">
          <a href={`mailto:${CONTACT.email}`} className="text-[var(--brand-500)] hover:underline">
            {CONTACT.email}
          </a>
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--brand-500)] hover:underline"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="mt-8">
          <LinkButton href={`mailto:${CONTACT.email}`} variant="primary">
            Email me
          </LinkButton>
        </div>

        <div className="text-small mt-12 text-[var(--ink-500)]">
          {CONTACT.lines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </div>
    </Container>
  );
}
