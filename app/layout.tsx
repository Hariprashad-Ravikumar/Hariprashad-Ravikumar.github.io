import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import LatticeBackground from "@/components/bg/LatticeBackground";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/layout/PageTransition";
import { buildMetadata, SITE_URL } from "@/lib/seo";
import { EDUCATION } from "@/content/cv";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(SITE_URL),
  ...buildMetadata({
    title: "Hariprashad Ravikumar | Computational Physicist, GPU & ML Engineer",
    description:
      "PhD candidate building GPU-accelerated ML and simulation tools. Ex-Western Digital R&D. CUDA, HPC, physics-informed ML. Graduating Dec 2026.",
    path: "/",
  }),
};

// §11: JSON-LD Person schema. Google Scholar isn't in sameAs — no profile
// exists yet (content/publications.ts GOOGLE_SCHOLAR_URL is still null).
const PERSON_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Hariprashad Ravikumar",
  jobTitle: "PhD Candidate in Computational Physics",
  affiliation: {
    "@type": "CollegeOrUniversity",
    name: "New Mexico State University",
  },
  alumniOf: [...new Set(EDUCATION.map((e) => e.org))].map((name) => ({
    "@type": "CollegeOrUniversity",
    name,
  })),
  knowsAbout: [
    "Lattice QCD",
    "GPU-accelerated HPC",
    "Machine Learning",
    "Symbolic Regression",
    "Heat-Assisted Magnetic Recording",
  ],
  sameAs: [
    "https://www.linkedin.com/in/hariprashad-ravikumar/",
    "https://github.com/Hariprashad-Ravikumar",
    "https://orcid.org/0000-0002-3276-852X",
    "https://arxiv.org/abs/2601.19251",
  ],
  url: SITE_URL,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body className="flex min-h-full flex-col antialiased">
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_JSON_LD) }}
        />
        <LatticeBackground />
        <Nav />
        <PageTransition>
          <main className="flex-1">{children}</main>
        </PageTransition>
        <Footer />
        {/*
          TODO(hari): §11 calls for Plausible or GoatCounter analytics
          (deferred script, no cookie banner needed). Neither a domain/site-id
          nor an account is in PLAN.md, so nothing is wired here rather than
          guessing one. Once you have an account, add e.g.:
          <script defer data-domain="hariprashad-ravikumar.github.io" src="https://plausible.io/js/script.js" />
        */}
      </body>
    </html>
  );
}
