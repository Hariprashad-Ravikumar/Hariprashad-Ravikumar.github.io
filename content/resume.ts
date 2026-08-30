/**
 * §10.8 CV content, plus items marked "unchanged" carried over verbatim from
 * the legacy cv.html. Graduate-Level Coursework isn't one of the plan's 9
 * numbered sections but wasn't flagged for removal either — kept per §17.7
 * ("ask before deleting anything under cv/"), just not sub-nav-priority.
 */

export const CONTACT = {
  email: "hari1729@nmsu.edu",
  lines: [
    "Office 363, Gardiner Hall",
    "Department of Physics",
    "New Mexico State University",
    "1255 N. Horseshoe, Las Cruces, NM 88003, USA",
  ],
};

export const INDUSTRY_EXPERIENCE = [
  {
    role: "Modeling & Simulation Intern",
    org: "Western Digital, San Jose, CA",
    dates: "May–August 2026",
    bullets: [
      "Derived closed-form analytical models for HAMR grain magnetization dynamics from first principles (Néel–Arrhenius, Stoner–Wohlfarth), obtaining switching time, noise power, and probability-of-switching expressions across multi-write cycles to predict adjacent track erasure (ATI & xTI).",
      "Validated against Monte Carlo stochastic simulation and experimental spin-stand data on highly complex magnetic grain ensembles.",
      "Built and deployed a full-stack enterprise Dash/Plotly simulation platform packaged as a modular Python library, adopted by sputtering and media engineering teams across WD sites in the US and Japan (40+ engineers).",
      "Architected CI/CD with Jenkins; deployed on Kubernetes.",
    ],
  },
];

export const EDUCATION = [
  { dates: "2021 – Present", degree: "PhD Physics", org: "New Mexico State University, USA" },
  { dates: "2021 – 2024", degree: "MS Physics", org: "New Mexico State University, USA" },
  {
    dates: "2019 – 2021",
    degree: "MSc Physics",
    org: "National Institute of Technology Jalandhar, Punjab, India",
  },
  { dates: "2015 – 2018", degree: "BSc Physics", org: "Dr.N.G.P. Arts and Science College, Coimbatore, India" },
];

/** §10.2 Tech Stack groupings — the only place these lists are defined. */
export const TECHNICAL_SKILLS = [
  { group: "Languages", items: ["Python", "C++", "CUDA", "Lua", "Bash", "JavaScript/TypeScript", "LaTeX"] },
  {
    group: "ML & Scientific",
    items: ["PyTorch", "TensorFlow", "Scikit-learn", "SciPy", "NumPy", "pandas", "PySR", "Physics-Informed ML"],
  },
  { group: "HPC & Parallel", items: ["MPI", "OpenMP", "SLURM", "Multi-GPU", "cuFFT", "NERSC Perlmutter"] },
  { group: "Web & Visualization", items: ["Dash", "Plotly", "Flask", "React", "Matplotlib", "Three.js"] },
  { group: "DevOps", items: ["Docker", "Kubernetes", "Jenkins", "GitHub Actions", "CI/CD", "Git", "Azure", "AWS"] },
];

export const RESEARCH_EXPERIENCE = [
  {
    role: "Research Assistant, New Mexico State University (2021–Present)",
    desc: "Lattice QCD under Dr. Michael Engelhardt, including symbolic regression (PySR), high-performance computing (HPC), and theoretical modeling as part of PhD dissertation work.",
  },
  {
    role: "Collaboration, Los Alamos National Laboratory",
    desc: "Nucleon electric dipole moments: parallelized C++/CUDA kernels on NERSC Perlmutter with custom SLURM workflows.",
  },
  {
    role: "Collaboration, North Carolina State University (Prof. Chueng-Ryong Ji)",
    desc: "Conformal algebra interpolation: Mathematica symbolic-computation workflows analyzing algebraic structures and relativistic symmetry constraints.",
  },
];

export const AWARDS = [
  {
    title: '"Wildest Idea" Award, WD Intern Summit 2026 Hackathon',
    org: "Western Digital",
  },
  {
    title: "2023 George and Barbara Goedecke Physics Excellence Fund Scholarship",
    org: "Awarded by NMSU Physics Department",
  },
  { title: "2021 Graduate Success Scholarship", org: "Awarded by NMSU Graduate School" },
  { title: "2018 IASC-INSA-NASI Summer Research Fellowship", org: "Awarded by Indian Academy of Sciences" },
];

export const CERTIFICATIONS = [
  {
    title: "Google Advanced Data Analytics Professional Certificate",
    issued: "April 2025",
    org: "Google",
    credential: { label: "U0HU8UKT89L4", href: "https://www.coursera.org/account/accomplishments/professional-cert/certificate/U0HU8UKT89L4" },
  },
  {
    title: "Intro to Machine Learning",
    issued: "May 2025",
    org: "Kaggle",
    credential: {
      label: "View Certificate",
      href: "https://www.kaggle.com/learn/certification/hariprashadravikumar/intro-to-machine-learning",
    },
  },
  {
    // TODO(hari): live site says "In Progress, Expected August 2025" for this
    // NVIDIA cert, which is now in the past relative to today. Confirm actual
    // completion status/date before publishing — not guessing it here.
    title: "Getting Started with Accelerated Computing in CUDA C/C++",
    issued: "TODO(hari): resolve status — was \"In Progress, Expected August 2025\"",
    org: "NVIDIA",
    credential: null,
  },
];

/** Unchanged from the legacy site (§10.8 item 8). */
export const SCHOOLS = [
  {
    title: "2024 CFNS Summer School on the Physics of the Electron-Ion Collider",
    org: "Center for Frontiers in Nuclear Science, Stony Brook University, New York, USA",
    dates: "June 03 – June 14, 2024",
  },
  {
    title: "2023 Hampton University Graduate Studies (HUGS) Summer Program",
    org: "Thomas Jefferson National Accelerator Facility, Newport News, USA",
    dates: "May 30 – June 16, 2023",
    note: "HUGS Scholarship recipient",
  },
  {
    title: "2022 TMD Winter School",
    org: "Organized by the DOE Topical Collaboration for the Coordinated Theoretical Approach to TMD Hadron Structure in QCD, Santa Fe, USA",
    dates: "January 20 – 26, 2022",
  },
  {
    title: "2021 National Nuclear Physics Summer School (NNPSS)",
    org: "Organized jointly by Universidad Nacional Autónoma de México (Mexico) and Indiana University (USA)",
    dates: "June 21 – 25, 2021",
  },
  {
    title: "2018 Astrophysics Summer School: An Observational View of the Universe",
    org: "Indian Institute of Astrophysics, Bengaluru, India",
    dates: "June 04 – August 03, 2018",
    note: "Indian Academy of Sciences IASC-INSA-NASI Summer Research Fellowship recipient. Research under the guidance of Prof. B. Ravindra (Indian Institute of Astrophysics, Bengaluru)",
  },
  {
    title: "2018 Radio Astronomy Summer School",
    org: "National Centre for Radio Astrophysics - Tata Institute of Fundamental Research, Pune, India",
    dates: "July 02 – 06, 2018",
  },
];

export const WORKSHOPS = [
  {
    title: "XXIV DAE-BRNS Symposium in High Energy Physics",
    org: "National Institute of Science Education and Research, India",
    dates: "December 14 – 18, 2020",
  },
  {
    title: "International Workshop on Applications of Group Theory in Physics",
    org: "Department of Physics, Assam University, Silchar, India",
    dates: "November 02 – 11, 2020",
  },
  {
    title: "Short-Term Course on Advances in High Energy Physics",
    org: "National Institute of Technology Jalandhar, India",
    dates: "September 18 – 22, 2020",
  },
  {
    title: "National Workshop on Theoretical Physics",
    org: "Ramakrishna Mission Vivekananda Educational and Research Institute, Kolkata, India",
    dates: "December 18 – 21, 2017",
  },
  {
    title:
      "Global Initiative of Academic Network's Course on Introduction To Light Front Hadron Physics",
    org: "Mumbai University, India",
    dates: "September 11 – 16, 2017",
    note: "Instructors: Prof. Stanley J Brodsky (Stanford University / SLAC) and Prof. Chueng-Ryong Ji (North Carolina State University)",
  },
  {
    title:
      "Global Initiative of Academic Network's Course on The Field Theory Of Classical And Quantum Phase Transition",
    org: "National Institute of Technology Goa, India",
    dates: "July 03 – July 13, 2017",
    note: "Instructor: Prof. Flávio S Nogueira (Institute for Theoretical Solid State Physics, Germany)",
  },
];

/** Unchanged from the legacy site — not one of §10.8's 9 numbered sections, kept per §17.7. */
export const COURSEWORK = [
  { area: "Computational Physics", items: "Quantum Computing, Advanced Computational Physics" },
  {
    area: "Theoretical Physics",
    items:
      "Classical Mechanics, Statistical Mechanics, Quantum Mechanics I & II, Quantum Field Theory I & II, General Relativity I, Electromagnetic Theory I & II",
  },
  { area: "Experimental Physics", items: "Advanced Experimental Nuclear Physics" },
];

export const TEACHING = [
  {
    role: "Teaching Assistant, NMSU (2021–2023)",
    desc: "Led undergraduate physics labs, discussion sections, and tutoring for physics courses (Electromagnetism and Mechanics).",
  },
];
