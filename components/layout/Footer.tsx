import Container from "./Container";
import { GOOGLE_SCHOLAR_URL } from "@/content/publications";
import {
  ArxivIcon,
  GitHubIcon,
  GoogleScholarIcon,
  HandshakeIcon,
  LinkedInIcon,
  MailIcon,
  OrcidIcon,
} from "@/components/ui/brand-icons";

const LINKS = [
  { label: "Email", href: "mailto:hari1729@nmsu.edu", Icon: MailIcon },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/hariprashad-ravikumar/", Icon: LinkedInIcon },
  { label: "GitHub", href: "https://github.com/Hariprashad-Ravikumar", Icon: GitHubIcon },
  { label: "Google Scholar", href: GOOGLE_SCHOLAR_URL, Icon: GoogleScholarIcon },
  { label: "ORCID", href: "https://orcid.org/0000-0002-3276-852X", Icon: OrcidIcon },
  { label: "arXiv", href: "https://arxiv.org/abs/2601.19251", Icon: ArxivIcon },
  {
    label: "Handshake",
    href: "https://app.joinhandshake.com/profiles/hariprashad-ravikumar",
    Icon: HandshakeIcon,
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-[var(--glass-border)] py-8">
      <Container>
        <div className="flex flex-col gap-4 text-sm text-[var(--ink-500)]">
          <p>© 2026 Hariprashad Ravikumar</p>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-4 gap-y-2">
            {LINKS.map((link) =>
              link.href ? (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="inline-flex items-center gap-1.5 hover:text-[var(--brand-900)] hover:underline"
                >
                  {link.Icon && <link.Icon className="h-3.5 w-auto" />}
                  {link.label}
                </a>
              ) : (
                // Not opacity-reduced — that drops contrast below WCAG AA.
                // Italic conveys "unavailable" without losing legibility.
                <span key={link.label} aria-disabled="true" className="italic">
                  {link.label}
                </span>
              ),
            )}
          </nav>
          <p>
            Built with Next.js.{" "}
            <a
              href="https://github.com/Hariprashad-Ravikumar/Hariprashad-Ravikumar.github.io"
              className="hover:text-[var(--brand-900)] hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Source on GitHub.
            </a>
          </p>
        </div>
      </Container>
    </footer>
  );
}
