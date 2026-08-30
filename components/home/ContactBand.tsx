import { LinkButton } from "@/components/ui/Button";
import { METRICS } from "@/content/metrics";
import { LinkedInIcon, MailIcon } from "@/components/ui/brand-icons";
import Reveal from "@/components/ui/Reveal";

export default function ContactBand() {
  return (
    <Reveal
      as="section"
      className="material-surface rounded-[var(--r-lg)] p-6 py-10 text-center shadow-[var(--glass-surface-shadow)] sm:p-10"
    >
      <h2 className="text-h2 text-[var(--ink-900)]">Currently interviewing for full-time roles.</h2>
      <p className="text-body prose-measure mx-auto mt-4 text-[var(--ink-500)]">
        Graduating {METRICS.graduation}. Looking for Research Scientist, Applied/ML Scientist, HPC &
        Scientific Computing Engineer, or Software Engineer roles in the SF Bay Area. Authorized to
        work in the U.S. under STEM OPT; open to H-1B sponsorship.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <LinkButton href="mailto:hari1729@nmsu.edu" variant="primary">
          <MailIcon className="h-4 w-auto" />
          Email me
        </LinkButton>
        <LinkButton
          href="https://www.linkedin.com/in/hariprashad-ravikumar/"
          variant="secondary"
          target="_blank"
          rel="noopener noreferrer"
        >
          <LinkedInIcon className="h-4 w-auto" />
          LinkedIn
        </LinkButton>
        <LinkButton href="/cv/CV_HARI.pdf" variant="secondary" target="_blank" rel="noopener noreferrer">
          Download CV
        </LinkButton>
      </div>
    </Reveal>
  );
}
