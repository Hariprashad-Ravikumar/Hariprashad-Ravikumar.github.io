import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo";

// This project was renamed to /projects/wd-internship-2026/. Static export
// has no server-side redirects, so this page stands in for a 301: canonical
// points at the new URL for search engines, and an inline script sends
// visitors there immediately (runs on parse, no client-component hook needed).
const NEW_PATH = "/projects/wd-internship-2026/";

export const metadata: Metadata = {
  title: "Redirecting… | Hariprashad Ravikumar",
  description: "This case study moved to /projects/wd-internship-2026/.",
  robots: { index: false, follow: true },
  alternates: { canonical: `${SITE_URL}${NEW_PATH}` },
};

export default function WDSimulationAppRedirect() {
  return (
    <div style={{ padding: "6rem 1.5rem", textAlign: "center" }}>
      <script
        dangerouslySetInnerHTML={{
          __html: `window.location.replace(${JSON.stringify(NEW_PATH)});`,
        }}
      />
      <p>
        This project moved. Redirecting to <a href={NEW_PATH}>{NEW_PATH}</a>…
      </p>
    </div>
  );
}
