import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import FluidMeshBackground from "@/components/bg/FluidMeshBackground";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/layout/PageTransition";
import { buildMetadata, SITE_URL } from "@/lib/seo";
import { EDUCATION } from "@/content/resume";
import { GOOGLE_SCHOLAR_URL } from "@/content/publications";

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

// §11: JSON-LD Person schema.
const PERSON_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Hariprashad Ravikumar",
  alternateName: ["Hari", "Hari Ravikumar", "Hariprashad R.", "Ravikumar"],
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
    "Transverse Momentum Dependent Distributions (TMD)",
    "GPU-accelerated HPC",
    "Machine Learning",
    "Symbolic Regression",
    "Heat-Assisted Magnetic Recording",
    "Western Digital Internship",
  ],
  sameAs: [
    "https://www.linkedin.com/in/hariprashad-ravikumar/",
    "https://github.com/Hariprashad-Ravikumar",
    "https://orcid.org/0000-0002-3276-852X",
    "https://arxiv.org/abs/2601.19251",
    "https://inspirehep.net/authors/2905335",
    "https://www.researchgate.net/profile/Hariprashad-Ravikumar",
    "https://app.joinhandshake.com/profiles/hariprashad-ravikumar",
    ...(GOOGLE_SCHOLAR_URL ? [GOOGLE_SCHOLAR_URL] : []),
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
      <body className="flex min-h-full flex-col antialiased" suppressHydrationWarning>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_JSON_LD) }}
        />
        <FluidMeshBackground />
        <Nav />
        <PageTransition>
          <main className="flex-1">{children}</main>
        </PageTransition>
        <Footer />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-NNHPM3N7SY" />
        <script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-NNHPM3N7SY');
            `,
          }}
        />
      </body>
    </html>
  );
}
