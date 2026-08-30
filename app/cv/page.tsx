import { buildMetadata } from "@/lib/seo";

// This page moved to /resume/. Kept as a static redirect (meta-refresh +
// fallback link) so existing bookmarks/backlinks to /cv/ don't 404 — a
// `redirects()`/`rewrites()` rule isn't available under `output: "export"`
// (GitHub Pages), so a plain HTML redirect is the static-export-compatible
// equivalent.
export const metadata = {
  ...buildMetadata({
    title: "Résumé | Hariprashad Ravikumar",
    description: "This page has moved to /resume/.",
    path: "/cv/",
  }),
  robots: { index: false, follow: true },
};

export default function CVRedirectPage() {
  return (
    <>
      <meta httpEquiv="refresh" content="0; url=/resume/" />
      <div className="p-10 text-center">
        <p>
          This page has moved to <a href="/resume/">/resume/</a>.
        </p>
      </div>
    </>
  );
}
