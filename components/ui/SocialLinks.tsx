import { GOOGLE_SCHOLAR_URL } from "@/content/publications";
import { GitHubIcon, GoogleScholarIcon, HandshakeIcon, LinkedInIcon } from "@/components/ui/brand-icons";

type Social = { label: string; href: string | null; Icon: (props: { className?: string }) => React.JSX.Element };

const SOCIALS: Social[] = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/hariprashad-ravikumar/", Icon: LinkedInIcon },
  { label: "GitHub", href: "https://github.com/Hariprashad-Ravikumar", Icon: GitHubIcon },
  {
    label: "Handshake",
    href: "https://app.joinhandshake.com/profiles/hariprashad-ravikumar",
    Icon: HandshakeIcon,
  },
  { label: "Google Scholar", href: GOOGLE_SCHOLAR_URL, Icon: GoogleScholarIcon },
];

const AVAILABLE_SOCIALS: Array<Social & { href: string }> = SOCIALS.filter(
  (social): social is Social & { href: string } => Boolean(social.href),
);

export default function SocialLinks() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {AVAILABLE_SOCIALS.map(({ label, href, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${label} (opens in a new tab)`}
          className="material-glass glass-sheen inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-[var(--ink-700)] transition-transform duration-200 ease-out hover:scale-[1.03] focus-visible:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-500)] focus-visible:ring-offset-2"
        >
          <Icon className="h-4 w-auto" />
          {label}
        </a>
      ))}
    </div>
  );
}
