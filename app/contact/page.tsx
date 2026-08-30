import Container from "@/components/layout/Container";
import Reveal from "@/components/ui/Reveal";
import { LinkButton } from "@/components/ui/Button";
import { CONTACT } from "@/content/resume";
import { METRICS } from "@/content/metrics";
import { buildMetadata } from "@/lib/seo";
import { ArxivIcon, GitHubIcon, HandshakeIcon, LinkedInIcon, MailIcon, OrcidIcon } from "@/components/ui/brand-icons";

const LINKS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/hariprashad-ravikumar/", Icon: LinkedInIcon },
  { label: "GitHub", href: "https://github.com/Hariprashad-Ravikumar", Icon: GitHubIcon },
  { label: "ORCID", href: "https://orcid.org/0000-0002-3276-852X", Icon: OrcidIcon },
  { label: "arXiv", href: "https://arxiv.org/abs/2601.19251", Icon: ArxivIcon },
  {
    label: "Handshake",
    href: "https://app.joinhandshake.com/profiles/hariprashad-ravikumar",
    Icon: HandshakeIcon,
  },
];

export default function ContactPage() {
  return (
    <Container>
      <Reveal as="div" className="py-14 md:py-20">
        <h1 className="text-h1 text-[var(--ink-900)]">Get in touch</h1>
        <p className="text-h3 prose-measure mt-2 font-normal text-[var(--ink-500)]">
          I&apos;m graduating in {METRICS.graduation} and interviewing now.
        </p>
        <p className="text-body prose-measure mt-3 text-[var(--ink-700)]">
          I&apos;m looking for Research Scientist, Applied/ML Scientist, HPC & Scientific Computing
          Engineer, or Software Engineer roles in the SF Bay Area. Authorized to work in the U.S.
          under STEM OPT; open to H-1B sponsorship.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium">
          <a href={`mailto:${CONTACT.email}`} className="text-[var(--brand-500)] hover:underline">
            {CONTACT.email}
          </a>
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[var(--brand-500)] hover:underline"
            >
              <link.Icon className="h-4 w-auto" />
              {link.label}
            </a>
          ))}
        </div>

        <div className="mt-6">
          <LinkButton href={`mailto:${CONTACT.email}`} variant="primary">
            <MailIcon className="h-4 w-auto" />
            Email me
          </LinkButton>
        </div>

        <div className="text-small mt-8 text-[var(--ink-500)]">
          {CONTACT.lines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </Reveal>
    </Container>
  );
}
