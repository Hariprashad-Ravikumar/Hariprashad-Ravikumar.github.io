import type { Publication } from "@/content/publications";

export default function PubEntry({ pub }: { pub: Publication }) {
  return (
    <li className="border-t border-[var(--glass-border)] py-4">
      <p className="text-body text-[var(--ink-900)]">
        {pub.authors} <span className="font-semibold">{pub.title}</span> {pub.venue}
      </p>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm font-medium text-[var(--brand-500)]">
        {pub.links.map((link) =>
          link.href ? (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
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
