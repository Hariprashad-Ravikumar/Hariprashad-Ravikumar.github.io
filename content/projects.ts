import type { CoverMode } from "@/components/media/ProjectCover";

export type ProjectLink = { label: string; href: string };

export type Project = {
  slug: string;
  title: string;
  oneLiner: string;
  tags: string[];
  links: ProjectLink[];
  cover: CoverMode;
  /** Only these three get a full /projects/[slug] case-study page (§1, §10.4). */
  hasCaseStudy: boolean;
};

/**
 * §10.4 grid data — the single source for the Projects grid. The plan lists
 * this as 8 separate .mdx files with front matter; kept as one typed array
 * instead since only 3 entries need long-form prose (that prose lives in
 * content/projects/*.mdx, §10.5) — same content, less plumbing.
 */
export const PROJECTS: Project[] = [
  {
    slug: "nimble",
    title: "NIMBLE — HAMR DCSNR Simulator",
    oneLiner:
      "Production simulation platform for heat-assisted magnetic recording, used by 30+ engineers across WD's US and Japan sites.",
    tags: ["Python", "Dash", "Plotly", "Kubernetes", "Jenkins"],
    links: [{ label: "Case study", href: "/projects/nimble/" }],
    cover: {
      mode: "split",
      photo: "/images/wd/simulator-demo",
      photoAlt: "Demonstrating the NIMBLE HAMR DCSNR simulator to engineers",
      n: "01 / PROJECT",
      title: "NIMBLE",
      sub: "HAMR DCSNR Simulator · Western Digital",
      tags: ["Python", "Dash", "Plotly"],
    },
    hasCaseStudy: true,
  },
  {
    slug: "tmd-pipeline",
    title: "Lattice QCD TMD Pipeline",
    oneLiner:
      "GPU-accelerated ML pipeline extracting analytical structure from 30,000+ lattice QCD observables.",
    tags: ["CUDA C++", "PySR", "SLURM", "Python"],
    links: [{ label: "Case study", href: "/projects/tmd-pipeline/" }],
    cover: {
      mode: "generated",
      src: "/images/bundle/projects/tmd-pipeline-cover",
      alt: "Lattice QCD TMD pipeline cover graphic",
    },
    hasCaseStudy: true,
  },
  {
    slug: "ai-datascience-lab",
    title: "AI-DataScience-Lab",
    oneLiner:
      "Full-stack forecasting app: CSV upload, pandas cleaning, scikit-learn regression, GPT-3.5 summaries.",
    tags: ["Flask", "Azure", "React", "scikit-learn"],
    links: [
      { label: "Case study", href: "/projects/ai-datascience-lab/" },
      { label: "Live demo", href: "https://hariprashad-ravikumar.github.io/AI-DataScience-Lab/" },
      { label: "Code", href: "https://github.com/Hariprashad-Ravikumar/AI-DataScience-Lab" },
    ],
    cover: {
      mode: "video",
      mp4: "/video/ai-datascience-lab.mp4",
      webm: "/video/ai-datascience-lab.webm",
      poster: "/video/ai-datascience-lab-poster.jpg",
      alt: "Screen recording of the AI-DataScience-Lab forecasting app: CSV upload, regression model selection, and results",
    },
    hasCaseStudy: true,
  },
  {
    slug: "haribot",
    title: "HariBot",
    oneLiner:
      "Custom AI chatbot answering questions about my research and background — running on this site.",
    tags: ["OpenAI API", "Flask", "Render"],
    links: [
      { label: "Code", href: "https://github.com/Hariprashad-Ravikumar/Hari-ChatBot" },
      { label: "Try it", href: "https://hari-chatbot.onrender.com" },
    ],
    cover: {
      mode: "video",
      mp4: "/video/haribot.mp4",
      webm: "/video/haribot.webm",
      poster: "/video/haribot-poster.jpg",
      alt: "Screen recording of the HariBot chat widget answering a question about Hariprashad Ravikumar",
    },
    hasCaseStudy: false,
  },
  {
    slug: "wd-aquarius",
    title: "WD Aquarius",
    oneLiner:
      '"Wildest Idea" award, WD Intern Summit 2026 Hackathon — a browser-based 3D exploration game built with no game engine.',
    tags: ["Three.js", "WebGL", "TypeScript", "Vite"],
    links: [],
    cover: {
      mode: "split",
      photo: "/images/wd/hackathon-award",
      photoAlt: '"Wildest Idea" award received at the Western Digital Intern Summit 2026 Hackathon',
      n: "05 / PROJECT",
      title: "WD Aquarius",
      sub: '"Wildest Idea" — Intern Summit 2026',
      tags: ["Three.js", "WebGL", "TypeScript"],
    },
    hasCaseStudy: false,
  },
  {
    slug: "neural-network-from-scratch",
    title: "Neural Network from Scratch",
    oneLiner: "Two-layer network in pure NumPy: ReLU + softmax, ~80% accuracy in 60 iterations.",
    tags: ["NumPy", "Python"],
    links: [
      {
        label: "Code",
        href: "https://github.com/Hariprashad-Ravikumar/Neural-Network-from-Scratch-with-NumPy",
      },
    ],
    cover: {
      mode: "generated",
      src: "/images/bundle/projects/neural-network-cover",
      alt: "Neural network from scratch cover graphic",
    },
    hasCaseStudy: false,
  },
  {
    slug: "z2-lattice-monte-carlo",
    title: "Z₂ Lattice Gauge Monte Carlo",
    oneLiner:
      "Markov-chain Monte Carlo simulation of Z₂ lattice gauge theory, probing confinement via Wilson loops.",
    tags: ["Python", "Monte Carlo"],
    links: [
      {
        label: "Code",
        href: "https://github.com/Hariprashad-Ravikumar/Z2_LatticeGauge_Monte_Carlo_Simulation",
      },
    ],
    cover: {
      mode: "generated",
      src: "/images/bundle/projects/z2-lattice-cover",
      alt: "Z2 lattice gauge Monte Carlo cover graphic",
    },
    hasCaseStudy: false,
  },
  {
    slug: "latex-cv-cicd",
    title: "Automated LaTeX CV CI/CD",
    oneLiner: "GitHub Actions pipeline compiling my LaTeX CV to PDF and deploying on every push.",
    tags: ["GitHub Actions", "LaTeX", "Bash"],
    links: [
      { label: "Code", href: "https://github.com/Hariprashad-Ravikumar/CV-GitHub-Actions-LaTeX-ci-cd" },
    ],
    cover: {
      mode: "generated",
      src: "/images/bundle/projects/latex-cv-cicd-cover",
      alt: "Automated LaTeX CV CI/CD pipeline cover graphic",
    },
    hasCaseStudy: false,
  },
];
