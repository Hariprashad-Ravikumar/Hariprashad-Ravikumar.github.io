import Picture from "@/components/ui/Picture";
import { PRD_DOI_URL } from "@/content/publications";

export default function JournalCredibility({ className = "" }: { className?: string }) {
  return (
    <a
      href={PRD_DOI_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="View this paper on Physical Review D (opens in a new tab)"
      className={`group inline-flex max-w-full items-center gap-3 overflow-hidden rounded-[var(--r-md)] border border-[var(--glass-border)] bg-[var(--glass-bg)] p-1.5 backdrop-blur-[var(--glass-blur-sm)] transition-colors hover:bg-[var(--glass-bg-heavy)] ${className}`}
    >
      <span className="h-9 w-[168px] shrink-0 overflow-hidden rounded-[calc(var(--r-md)-6px)]">
        <Picture
          src="/images/publications/prd-journal-banner"
          alt="Physical Review D, American Physical Society"
          width={1864}
          height={192}
          sizes="168px"
          className="h-full w-full object-cover object-left"
        />
      </span>
      <span className="h-6 w-px shrink-0 bg-[var(--glass-border)]" />
      <Picture
        src="/images/publications/aps-logo"
        alt="American Physical Society logo"
        width={798}
        height={264}
        widths={[640, 960]}
        sizes="72px"
        className="h-6 w-auto shrink-0 pr-2"
      />
    </a>
  );
}
