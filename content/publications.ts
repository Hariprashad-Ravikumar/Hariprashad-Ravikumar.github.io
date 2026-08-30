export type Publication = {
  authors: string;
  title: string;
  venue: string;
  links: { label: string; href: string }[];
};

/** §10.6. Fixes the biggest content error on the live site: the PRD paper
 * was listed as "Submitted" — it is published. */
export const PEER_REVIEWED: Publication[] = [
  {
    authors: "Ji, C.-R. & Ravikumar, H. (2026).",
    title:
      "Interpolating conformal algebra in (1+1) dimensions between the instant form and the light-front form of relativistic dynamics.",
    venue: "Physical Review D 113, 096018. American Physical Society.",
    links: [
      { label: "DOI", href: "https://journals.aps.org/prd/abstract/10.1103/prlq-4j1l" },
      { label: "arXiv", href: "https://arxiv.org/abs/2601.19251" },
    ],
  },
];

export const PRD_DOI_URL = "https://journals.aps.org/prd/abstract/10.1103/prlq-4j1l";

export const IN_PREPARATION: string[] = [
  "Ravikumar, H. & Ji, C.-R. Interpolating conformal algebra (3+1) between the instant form and the front form of relativistic dynamics.",
  "Ravikumar, H. et al. Analytical modeling of grain magnetization dynamics in Heat-Assisted Magnetic Recording. Manuscript in preparation for IEEE Transactions on Magnetics.",
];

export const CONFERENCE: { citation: string; href?: string }[] = [
  {
    citation:
      "Ji, C.-R., Dahiya, H., & Ravikumar, H. (2021). Interpolating conformal algebra between the instant form and the front form of relativistic dynamics. Light Cone 2021: Physics of Hadrons on the Light Front, Jeju Island, South Korea.",
  },
];

export const THESES: { citation: string }[] = [
  {
    citation:
      "Ravikumar, H. (2021). The Poincaré Algebra Interpolation between Instant Form Dynamics (IFD) and Light-Front Dynamics (LFD). MSc thesis, NIT Jalandhar. Supervised by Prof. Harleen Dahiya, in collaboration with Prof. Chueng-Ryong Ji.",
  },
];

export const GOOGLE_SCHOLAR_URL: string | null =
  "https://scholar.google.com/citations?user=o6cDFRwAAAAJ&hl=en";
