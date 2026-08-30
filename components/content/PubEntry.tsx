import type { Publication } from "@/content/publications";
import { ArxivIcon } from "@/components/ui/brand-icons";
import JournalCredibility from "@/components/ui/JournalCredibility";

export default function PubEntry({ pub, showCredibility = false }: { pub: Publication; showCredibility?: boolean }) {
  return (
    <li className="border-t border-[var(--glass-border)] py-4">
      <p className="text-body text-[var(--ink-900)]">
        {pub.authors} <span className="font-semibold">{pub.title}</span> {pub.venue}
      </p>
      {showCredibility && (
        <div className="mt-3">
          <JournalCredibility />
        </div>
      )}
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm font-medium text-[var(--brand-500)]">
        {pub.links.map((link) =>
          link.href ? (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:underline"
            >
              {link.label === "arXiv" && <ArxivIcon className="h-3.5 w-auto" />}
              {link.label}
            </a>
          ) : (
            <span key={link.label} className="text-[var(--ink-400)] opacity-60" title="TODO(hari): link not yet available">
              {link.label}
            </span>
          ),
        )}
      </div>
    </li>
  );
}
