# Portfolio Rebuild — Final Implementation Plan

**Repo:** `Hariprashad-Ravikumar/Hariprashad-Ravikumar.github.io`
**Live URL:** `https://hariprashad-ravikumar.github.io` (must not change)
**For:** Claude Sonnet, working in the local repo via CLI
**Version:** Final · August 29, 2026

> This document is self-contained and supersedes all earlier drafts (`REBUILD-PLAN.md`, `ASSETS.md`, `ASSETS-ADDENDUM.md`). Work through **§14 Build Sequence** phase by phase.
>
> **Do not invent facts, numbers, credentials, or citations.** Every figure here is cross-checked against LinkedIn, Handshake, and GitHub. If something is needed that isn't in this document, leave a `TODO(hari):` comment rather than guessing.

---

## 1. Locked decisions

| Area | Decision |
|---|---|
| Framework | Next.js (App Router) + React + TypeScript + Tailwind CSS |
| Hosting | GitHub Pages via `output: 'export'` static build |
| Scope | Full rebuild, new information architecture |
| Pages | Home · Research · Projects (+3 case studies) · Publications · Talks · CV · Contact |
| Positioning | **Industry-first** — computational physicist / ML & simulation engineer |
| Aesthetic | Technical / precise — crisp cards, hairline borders, mono numerals |
| Type | Inter + JetBrains Mono |
| Color | Navy `#00004C` anchor + teal/indigo aurora on near-white |
| Background | Neural-network / particle lattice canvas, cursor-reactive |
| Hover | Spotlight glow following the cursor |
| Motion | Rich — parallax, animated hero, page transitions |
| Perf budget | Lighthouse 90+ mobile; GPU-composited properties only |
| Theme | Light mode only for v1 (tokens structured so dark can be added later) |
| Bio | 2 condensed paragraphs on Home; full narrative on Research |
| Projects | Cards for all 8; full case studies for Simulation App, TMD Pipeline, AI-DataScience-Lab |
| CV | Structured HTML + sticky sub-nav + PDF download |
| Git | Rebuild directly on `main` (guardrails in §2.1) |

### 1.1 Two tensions, resolved

**Particle lattice vs. "CSS-only" budget.** A node/edge lattice needs a canvas render loop, so it is not pure CSS. It stays inside the Lighthouse 90+ budget via the five mandatory guardrails in §6.

**Rebuilding on `main` while recruiters hold the link.** Accepted with two zero-cost guardrails — see §2.1. The live site stays up through the entire build.

---

## 2. Next.js on GitHub Pages — exact configuration

The repo is a **user site** (`<username>.github.io`), so `basePath` stays empty.

**`next.config.mjs`**
```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },  // the next/image optimizer needs a server
  trailingSlash: true,            // /projects/ -> /projects/index.html
};
export default nextConfig;
```

### 2.1 Safety guardrails — do this first

```bash
git tag pre-redesign && git push origin pre-redesign   # instant rollback point
```

**Do not create `.github/workflows/deploy.yml` until Phase 6.** Until that first Actions run, GitHub Pages keeps serving the existing HTML, so the live site never breaks mid-build. Roll back at any time with `git reset --hard pre-redesign`.

### 2.2 The `.nojekyll` gotcha — do not skip

GitHub Pages runs Jekyll by default, and **Jekyll ignores every directory starting with `_`**. Next.js emits its entire bundle into `_next/`. Without this file the site deploys with zero CSS and zero JS.

```json
// package.json
"scripts": {
  "dev": "next dev",
  "build": "next build && touch out/.nojekyll",
  "optimize:images": "node scripts/optimize-images.mjs"
}
```

### 2.3 Image pipeline (replaces `next/image` optimization)

`scripts/optimize-images.mjs` walks `assets/raw/`, emits WebP at widths `[640, 960, 1440, 1920]` into `public/images/`, and writes a manifest. A `<Picture>` component renders `srcset`/`sizes` with explicit `width`/`height` to prevent layout shift.

- **Video files pass through untouched** — never re-encode `.mp4`/`.webm`.
- Generate a poster JPG from frame 1 if one is missing.
- Targets after processing: hero ≤120KB, photos ≤250KB, figures ≤180KB.

### 2.4 Deploy workflow — add in Phase 6

**`.github/workflows/deploy.yml`**
```yaml
name: Deploy
on:
  push: { branches: [main] }
  workflow_dispatch:
permissions: { contents: read, pages: write, id-token: write }
concurrency: { group: pages, cancel-in-progress: true }
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with: { path: ./out }
  deploy:
    needs: build
    environment: github-pages
    runs-on: ubuntu-latest
    steps:
      - uses: actions/deploy-pages@v4
```

Then set **Settings → Pages → Source: GitHub Actions**.

### 2.5 Preserve the CV PDF pipeline

The repo already auto-builds `cv/CV_HARI.pdf` from LaTeX via GitHub Actions. **Do not delete or modify that workflow.** Ensure `cv/` is copied into the export so the PDF stays reachable at `/cv/CV_HARI.pdf`.

### 2.6 Redirect old URLs

`/GitHub_Portfolio` is linked externally. Create `public/GitHub_Portfolio/index.html`:

```html
<!doctype html><meta charset="utf-8"><title>Redirecting…</title>
<link rel="canonical" href="https://hariprashad-ravikumar.github.io/projects/">
<meta http-equiv="refresh" content="0; url=/projects/">
<script>location.replace('/projects/')</script>
<p>Redirecting to <a href="/projects/">/projects/</a>…</p>
```

---

## 3. Repo structure

```
app/
  layout.tsx                 fonts, <LatticeBackground>, Nav, Footer, JSON-LD
  page.tsx                   Home
  research/page.tsx
  projects/page.tsx
  projects/[slug]/page.tsx   case studies (generateStaticParams)
  publications/page.tsx
  talks/page.tsx
  cv/page.tsx
  contact/page.tsx
  not-found.tsx
  sitemap.ts   robots.ts
components/
  layout/   Nav, Footer, PageTransition, Container
  bg/       LatticeBackground.tsx
  ui/       Button, Card, SpotlightCard, Chip, Tag, Picture, Lightbox, MetricTile
  media/    ProjectCover.tsx        3 modes: generated | split | video
            FigureCluster.tsx       built in v1, unused until Phase 7 (§16)
  home/     Hero, MetricStrip, WDSpotlight, FeaturedProjects,
            Timeline, TechStack, PublicationHighlight, ContactBand
  content/  ProjectCard, PubEntry, TalkList, CVSection, CVSideNav
content/
  projects/*.mdx      8 files
  publications.ts  talks.ts  cv.ts  metrics.ts
lib/
  seo.ts  motion.ts  useSpotlight.ts
public/
  images/  video/  cv/CV_HARI.pdf  GitHub_Portfolio/index.html  og/
scripts/
  optimize-images.mjs
assets/raw/           source media, not deployed
```

**`content/metrics.ts` is the single source of truth.** Every number on the site imports from it — this is what prevents a repeat of the 93%/98% drift.

```ts
export const METRICS = {
  engineers:    { value: '30+',     label: 'engineers using Simulation App' },
  speedup:      { value: '10×',     label: 'faster simulation sweeps' },
  computeHours: { value: '75,000+', label: 'CPU/GPU hours on NERSC Perlmutter' },
  observables:  { value: '30,000+', label: 'observables processed' },
  accuracy:     { value: '93%+',    label: 'symbolic-regression accuracy' },
  graduation:   'December 2026',
} as const;
```

---

## 4. Design tokens

```css
/* app/globals.css */
:root{
  --ink-900:#0A0E27; --ink-700:#1E2547; --ink-500:#4A5578; --ink-400:#6B7396;
  --brand-900:#00004C; --brand-700:#111A6B; --brand-500:#2E4FD6; --brand-300:#8FA4FF;
  --accent-500:#00C2B2; --accent-400:#2DE0CF;
  --aurora-1:#7DD3D8; --aurora-2:#A5B4FC; --aurora-3:#C4B5FD;
  --surface-50:#FBFCFE; --surface-0:#FFFFFF; --line:#E3E7F2;
  --shadow-sm:0 1px 2px rgba(10,14,39,.06),0 2px 8px rgba(10,14,39,.04);
  --shadow-md:0 4px 12px rgba(10,14,39,.08),0 12px 32px rgba(10,14,39,.06);
  --shadow-lg:0 12px 24px rgba(10,14,39,.12),0 24px 64px rgba(10,14,39,.10);
  --r-sm:8px; --r-md:14px; --r-lg:20px;
}
```

| Token | Size / weight | Use |
|---|---|---|
| `display` | `clamp(40px,6vw,68px)` / 700 / `-0.03em` | Hero H1 |
| `h1` | `clamp(32px,4.2vw,48px)` / 700 / `-0.02em` | Page titles |
| `h2` | `clamp(24px,3.2vw,34px)` / 700 | Section heads |
| `h3` | `20px` / 600 | Card titles |
| `body` | `16px` / 400 / `1.65` | Prose |
| `small` | `13.5px` / 400 | Captions |
| `mono-metric` | `clamp(28px,3.6vw,40px)` / 700 mono | Metric numerals |
| `eyebrow` | `11.5px` / 700 mono / `.14em` / uppercase | Section labels |

**Rules:** body text **left-aligned, never justified**. Prose measure max `68ch`. Container `1120px`, gutters `24px` / `16px` mobile. Spacing scale `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96`.

---

## 5. Assets — final status

**Everything needed for launch exists.** Nothing is blocked.

| Path | Status |
|---|---|
| `assets/raw/wd/phd-expo.jpg` — 4:5 | ✅ have |
| `assets/raw/wd/simulator-demo.jpg` — 1:1 | ✅ have |
| `assets/raw/wd/hackathon-award.jpg` — 1:1 | ✅ have |
| `assets/raw/wd/san-jose-campus.jpg` — 21:8 | ✅ have |
| `assets/raw/hero/headshot.jpg` — 4:5 | ✅ have |
| `assets/raw/og/card.png` — 1200×630 | ✅ generated |
| `assets/raw/favicon-source.png` — 512×512 | ✅ generated |
| `assets/raw/projects/tmd-pipeline-cover.png` | ✅ generated |
| `assets/raw/projects/neural-network-cover.png` | ✅ generated |
| `assets/raw/projects/z2-lattice-cover.png` | ✅ generated |
| `assets/raw/projects/latex-cv-cicd-cover.png` | ✅ generated |
| `assets/raw/video/ai-datascience-lab.{mp4,webm}` + poster | 🎬 Hari supplies |
| `assets/raw/video/haribot.{mp4,webm}` + poster | 🎬 Hari supplies |
| Simulation App cover | 🖼 **split** — `wd/simulator-demo.jpg` + label panel |
| WD Aquarius cover | 🖼 **split** — `wd/hackathon-award.jpg` + label panel |
| Research figures | ⏳ **deferred to Phase 7** (§16) |

Delete the generated `nimble-cover.png` and `wd-aquarius-cover.png` — the split covers replace them.

### 5.1 Video encoding (reference)

```bash
ffmpeg -i raw.mov -t 12 -an \
  -vf "scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,fps=30" \
  -c:v libx264 -crf 26 -preset slow -movflags +faststart out.mp4
ffmpeg -i out.mp4 -c:v libvpx-vp9 -crf 34 -b:v 0 -an out.webm
ffmpeg -i out.mp4 -vframes 1 -q:v 2 out-poster.jpg
```
Each MP4 must stay **under 2.5MB**.

---

## 6. `LatticeBackground` — spec

Fixed full-viewport canvas behind all content: nodes drift, nearby nodes link with proximity-faded lines, the cursor repels nodes within a radius. Reads as both a neural network and a lattice.

**Implementation:** `'use client'`, mounted in `app/layout.tsx`, `position:fixed; inset:0; z-index:-1; pointer-events:none`.

- **Nodes:** `Math.min(90, Math.floor(w * h / 16000))`. Hard cap 90 desktop, **45 below 768px**.
- **Colors:** nodes `--aurora-2` @55% alpha; links `--aurora-1` @≤22%; ~15% accent nodes in `--accent-500`. Must never compete with text contrast.
- **Cursor:** passive `window` listener, repel radius 120px, ease back ~600ms. **Disabled on `pointer: coarse`.**
- **Parallax:** `translateY(scrollY * 0.15)` via `transform` only.
- **DPR** capped at 2; debounced resize observer.

**Five mandatory guardrails:**
1. Cancel `requestAnimationFrame` when off-screen (`IntersectionObserver`) or tab hidden (`visibilitychange`).
2. Mount after first paint — `next/dynamic` `{ ssr: false }` inside `requestIdleCallback`.
3. `prefers-reduced-motion: reduce` → render **one static frame**, no loop.
4. Only `transform` / `opacity`. Never a layout-triggering property.
5. Target ≤2ms scripting per frame; if exceeded twice consecutively, reduce node count 30% and continue.

---

## 7. Spotlight hover — spec

`components/ui/SpotlightCard.tsx`, wrapping buttons, project cards, metric tiles, photos.

```tsx
const onMove = (e) => {              // no React state, no re-render
  const r = el.getBoundingClientRect();
  el.style.setProperty('--mx', `${e.clientX - r.left}px`);
  el.style.setProperty('--my', `${e.clientY - r.top}px`);
};
```
```css
.spotlight{ position:relative; isolation:isolate }
.spotlight::before{
  content:''; position:absolute; inset:0; border-radius:inherit; z-index:-1;
  background:radial-gradient(320px circle at var(--mx) var(--my),
             color-mix(in srgb, var(--accent-500) 12%, transparent), transparent 60%);
  opacity:0; transition:opacity .25s;
}
.spotlight:hover::before{ opacity:1 }
.spotlight:hover{ transform:translateY(-3px); box-shadow:var(--shadow-lg) }
```

One `rAF`-throttled `pointermove` listener per card. Skip on `pointer: coarse`. `:focus-visible` gets a solid 3px `--brand-500` ring — the glow is decorative and must never be the only affordance.

---

## 8. Motion system

Framer Motion, **imported selectively** (`motion`, `AnimatePresence` only).

| Element | Motion |
|---|---|
| Page transitions | Fade + 8px rise, 260ms, `[0.2,0.7,0.3,1]` |
| Section reveals | `whileInView`, `once:true`, `margin:'-80px'`, 12px rise + fade, 60ms stagger |
| Metric count-up | 0 → value over 1.2s on first view. **Preserve the literal string** (`30+`, `10×`, `75,000+`) — animate only the numeric part |
| Cards / buttons | Spotlight + 3px lift (§7) |
| Hero portrait | Parallax `translateY(scrollY * -0.06)` |
| Lattice canvas | Parallax `translateY(scrollY * 0.15)` |
| Nav | Transparent → blurred `--surface-0` @85% after 40px scroll |

**`prefers-reduced-motion: reduce` disables all of it** — content renders at final state. Wire once in `lib/motion.ts`; never hand-roll per component.

---

## 9. `ProjectCover` — one component, three modes

```tsx
type CoverMode =
  | { mode: 'generated'; src: string }
  | { mode: 'split'; photo: string; n: string; title: string; sub: string; tags: string[] }
  | { mode: 'video'; mp4: string; webm: string; poster: string };
```

**`generated`** — `<Picture>` with the pre-rendered PNG, 16:9.

**`split`** — for square photos in a 16:9 slot. A straight crop discards 44% of the frame and cuts heads off. Instead: photo untouched on the left (`grid-template-columns: 1fr 1.15fr`), navy label panel on the right, filling 16:9 together. **The panel is live text, not baked into an image** — selectable, sharp at every DPI, editable without regenerating.

| Project | Photo | Panel |
|---|---|---|
| Simulation App | `wd/simulator-demo.jpg` | `01 / PROJECT` · **Simulation App** · HAMR DCSNR Simulator · Western Digital · Python / Dash / Plotly |
| WD Aquarius | `wd/hackathon-award.jpg` | `05 / PROJECT` · **WD Aquarius** · "Wildest Idea" — Intern Summit 2026 · Three.js / WebGL / TypeScript |

> Both photos also appear in the WD spotlight mosaic. Use a **tighter crop** on the cards than in the mosaic so they don't read as duplicates.

**`video`**
```html
<video muted loop playsinline preload="none" poster="…">
  <source src="….webm" type="video/webm">
  <source src="….mp4"  type="video/mp4">
</video>
```
- `muted` + `playsinline` — without both, iOS refuses to autoplay.
- **Play only in view:** `IntersectionObserver` at 40% → `play()`; below → `pause()`.
- `prefers-reduced-motion: reduce` → **never call `play()`**, poster only.
- `navigator.connection.saveData` → poster only.
- No controls, no audio, no fullscreen. These are ambient, not media players.

---

## 10. Page specs and final copy

> Paste-ready. Do not paraphrase or embellish.

### 10.1 Global

**Nav:** `Hariprashad Ravikumar` (mono, left) · Research · Projects · Publications · Talks · CV · **Contact** (filled button). Sticky, blurs on scroll. Mobile: hamburger → full-screen overlay.

**Footer (every page):**
```
© 2026 Hariprashad Ravikumar
Email · LinkedIn · GitHub · Google Scholar · ORCID · arXiv · Handshake
Built with Next.js. Source on GitHub.
```

| Link | URL |
|---|---|
| Email | `hari1729@nmsu.edu` |
| LinkedIn | `https://www.linkedin.com/in/hariprashad-ravikumar/` |
| GitHub | `https://github.com/Hariprashad-Ravikumar` |
| ORCID | `https://orcid.org/0000-0002-3276-852X` |
| arXiv | `https://arxiv.org/abs/2601.19251` |
| Handshake | `https://app.joinhandshake.com/profiles/hariprashad-ravikumar` |
| Google Scholar | `TODO(hari):` profile not yet created |

---

### 10.2 Home

Order: Hero → Metric strip → WD Spotlight → Featured Projects → Timeline → Tech Stack → Publication Highlight → Contact band.

#### Hero — split, text left / portrait right

> **H1:** Hariprashad Ravikumar
>
> **Sub:** Computational physicist building GPU-accelerated ML and simulation tools.
>
> **Chip:** ● Graduating December 2026 · Open to Research Scientist / ML Engineer roles · SF Bay Area
>
> I turn large-scale physics simulations into software that engineers actually use. At Western Digital I derived closed-form models for heat-assisted magnetic recording from first principles and shipped Simulation App, the simulator that team now runs across sites in the US and Japan.
>
> My PhD at New Mexico State University applies GPU-accelerated HPC and machine learning to lattice QCD — 30,000+ observables, CUDA C++ pipelines, and symbolic regression that recovers analytical structure from noisy Monte Carlo data.
>
> **Buttons:** `View Projects` (primary) · `Download CV` · `Email me`
> **Right:** `hero/headshot.jpg`, 4:5, `--r-lg`, subtle parallax, thin `--line` border.

#### Metric strip — mono numerals, count-up

| Value | Label |
|---|---|
| `30+` | engineers using Simulation App |
| `10×` | faster simulation sweeps |
| `75,000+` | CPU/GPU hours on NERSC Perlmutter |
| `30,000+` | observables at 93%+ accuracy |

#### WD Spotlight

> **Eyebrow:** WESTERN DIGITAL · SAN JOSE, CA · SUMMER 2026 — chip `Modeling & Simulation Intern`
>
> **H2:** I built Simulation App — a HAMR simulator now used by 30+ engineers across WD's US and Japan sites.
>
> Over summer 2026 I derived closed-form analytical models for grain magnetization dynamics in Heat-Assisted Magnetic Recording from first principles, predicting adjacent-track erasure (ATI & xTI) without costly hardware experiments.
>
> I shipped the physics as Simulation App, a production Dash/Plotly simulation platform packaged as a modular Python library — deployed on Kubernetes with Jenkins CI/CD and adopted by sputtering and media engineering teams.
>
> **Tiles:** `30+` engineers · `2` R&D projects shipped · `1` hackathon award
> **Tags:** Python · Dash · Plotly · Kubernetes · Jenkins · Monte Carlo · HAMR Physics
> **Buttons:** `Read the case study →` · `Full CV`

**Photo mosaic** — asymmetric grid, hover captions, keyboard-accessible lightbox:

| Slot | File | Kicker | Caption | Alt |
|---|---|---|---|---|
| Feature 4:5 | `wd/phd-expo.jpg` | WD PhD Expo 2026 | Presenting the Simulation App HAMR DCSNR Simulator | Hariprashad Ravikumar presenting the Simulation App HAMR DCSNR Simulator at the Western Digital PhD Expo 2026 |
| Square | `wd/simulator-demo.jpg` | Simulation App Simulator | Demoing DCSNR prediction from material parameters | Demonstrating the Simulation App HAMR DCSNR simulator to engineers |
| Square | `wd/hackathon-award.jpg` | Wildest Idea Award | WD Intern Summit 2026 Hackathon | Wildest Idea award received at the Western Digital Intern Summit 2026 Hackathon |
| Wide 21:8 | `wd/san-jose-campus.jpg` | San Jose Campus | Western Digital, summer 2026 | Western Digital San Jose campus during the summer 2026 internship |

#### Featured Projects
Three cards: Simulation App (split) · Lattice QCD TMD Pipeline (generated) · AI-DataScience-Lab (video).

#### Experience Timeline
```
2026   Western Digital — Modeling & Simulation Intern, San Jose CA
2021–  New Mexico State University — PhD Physics (Dr. Michael Engelhardt)
       Los Alamos National Laboratory — nucleon EDM, CUDA/HPC (collaboration)
       North Carolina State University — conformal algebra (Prof. Chueng-Ryong Ji)
2019–2021  NIT Jalandhar — MSc Physics
```

#### Tech Stack band
> **Languages** Python · C++ · CUDA · Lua · Bash · JavaScript/TypeScript · LaTeX
> **ML & Scientific** PyTorch · TensorFlow · Scikit-learn · SciPy · NumPy · pandas · PySR · Physics-Informed ML
> **HPC & Parallel** MPI · OpenMP · SLURM · Multi-GPU · cuFFT · NERSC Perlmutter
> **Web & Visualization** Dash · Plotly · Flask · React · Matplotlib · Three.js
> **DevOps** Docker · Kubernetes · Jenkins · GitHub Actions · CI/CD · Git · Azure · AWS

*CUDA must appear here and in the CV — its absence today is a real keyword-search failure.*

#### Publication Highlight
> **Peer-reviewed · Physical Review D**
> Interpolating conformal algebra in (1+1) dimensions between the instant form and the light-front form of relativistic dynamics
> Ji, C.-R. & Ravikumar, H. — *Physical Review D* **113**, 096018 (2026), American Physical Society
> `arXiv:2601.19251` · Buttons: `arXiv` `DOI` `All publications →`

#### Contact band
> **H2:** Currently interviewing for full-time roles.
> Graduating December 2026. Looking for Research Scientist, Applied/ML Scientist, HPC & Scientific Computing Engineer, or Software Engineer roles in the SF Bay Area. Authorized to work in the U.S. under STEM OPT; open to H-1B sponsorship.
> `Email me` · `LinkedIn` · `Download CV`

---

### 10.3 Research

> **H1:** Research
> **Intro:** I work at the intersection of quantum field theory and large-scale computation — using GPU-accelerated HPC and machine learning to extract physics from simulations that produce terabytes of noisy data.

Then the **full five-paragraph narrative** currently on the live homepage, moved here verbatim, with **one correction: "over 98% predictive accuracy" → "93%+ predictive accuracy."**

Three thrust cards. **v1 ships without figures** — build each card to accept an optional `<FigureCluster>` that renders nothing when no figures are present (see §16).

1. **Lattice QCD & Transverse Momentum Dependent Distributions** — PhD, Dr. Michael Engelhardt, NMSU. How do quarks and gluons move inside the proton? End-to-end ML pipeline over 30,000+ observables from Monte Carlo simulation, 93%+ accuracy via symbolic regression (PySR); GPU-accelerated CUDA C++ reduced processing time 10×; jackknife/bootstrap uncertainty quantification.
2. **Nucleon Electric Dipole Moments** — collaboration with Los Alamos National Laboratory. Parallelized C++/CUDA kernels on NERSC Perlmutter; 75,000+ CPU/GPU hours via custom SLURM workflows.
3. **Conformal Algebra Interpolation** — collaboration with Prof. Chueng-Ryong Ji, NC State. Mathematica symbolic-computation workflows analyzing algebraic structures and relativistic symmetry constraints. Published in *Physical Review D* 113, 096018 (2026); (3+1)-dimensional extension in preparation.

Link to `/talks` at the foot of the page.

---

### 10.4 Projects

Grid of 8 `SpotlightCard`s. **Delete "More projects coming soon — stay tuned!"** — it must not appear anywhere.

| # | Project | Cover | One-liner | Tags | Links |
|---|---|---|---|---|---|
| 1 | **Simulation App — HAMR DCSNR Simulator** | split | Production simulation platform for heat-assisted magnetic recording, used by 30+ engineers across WD's US and Japan sites. | Python, Dash, Plotly, Kubernetes, Jenkins | Case study |
| 2 | **Lattice QCD TMD Pipeline** | generated | GPU-accelerated ML pipeline extracting analytical structure from 30,000+ lattice QCD observables. | CUDA C++, PySR, SLURM, Python | Case study |
| 3 | **AI-DataScience-Lab** | video | Full-stack forecasting app: CSV upload, pandas cleaning, scikit-learn regression, GPT-3.5 summaries. | Flask, Azure, React, scikit-learn | Case study · Live demo · Code |
| 4 | **HariBot** | video | Custom AI chatbot answering questions about my research and background — running on this site. | OpenAI API, Flask, Render | Code · Try it |
| 5 | **WD Aquarius** | split | "Wildest Idea" award, WD Intern Summit 2026 Hackathon — a browser-based 3D exploration game built with no game engine. | Three.js, WebGL, TypeScript, Vite | — |
| 6 | **Neural Network from Scratch** | generated | Two-layer network in pure NumPy: ReLU + softmax, ~80% accuracy in 60 iterations. | NumPy, Python | Code |
| 7 | **Z₂ Lattice Gauge Monte Carlo** | generated | Markov-chain Monte Carlo simulation of Z₂ lattice gauge theory, probing confinement via Wilson loops. | Python, Monte Carlo | Code |
| 8 | **Automated LaTeX CV CI/CD** | generated | GitHub Actions pipeline compiling my LaTeX CV to PDF and deploying on every push. | GitHub Actions, LaTeX, Bash | Code |

**Fixes:** use the Unicode character `Z₂`, **not MathJax** — the subscript currently fails to render on the live site, leaving a visible gap. Replace **MathJax with KaTeX** wherever real math is needed. **Remove the "GitHub Activity" achievement badges** (Pull Shark, YOLO, Quickdraw) — replace with a contribution graph or pinned-repo stats.

---

### 10.5 Case study — `/projects/nimble`

Template for all three: **Context → Problem → Approach → Architecture → Results → Stack → What's next.**

> **Context.** Modeling & Simulation Intern, Western Digital, San Jose — May–August 2026. Heat-Assisted Magnetic Recording is how the next generation of hard drives reaches higher areal density. Writing one track can partially erase its neighbours — adjacent track interference (ATI and cross-track interference, xTI) — and characterising it normally means slow, expensive spin-stand experiments.
>
> **Problem.** Engineers needed to predict recording performance directly from media material parameters, before committing to hardware tests.
>
> **Approach.** I derived a closed-form analytical model of grain magnetization dynamics from first principles, building on Néel–Arrhenius thermal switching and the Stoner–Wohlfarth model to obtain expressions for switching time, noise power, and probability of switching across multiple write cycles. I validated the model against Monte Carlo stochastic simulation and experimental spin-stand data on realistic L1₀ FePt grain ensembles.
>
> **Architecture.** Simulation App is a Dash application backed by a modular Python physics library.

```
┌───────────────────────────────┐
│  Upstream WD Simulation App app       │
│  hands off a JSON payload     │
└──────────────┬────────────────┘
               │  opens new tab · IndexedDB API
               ▼
┌───────────────────────────────────────────────┐
│  FRONTEND — Dash                              │
│  • reads payload from IndexedDB               │
│  • fits physics + statistical functions       │
│    to the incoming data                       │
│  • AUTO-POPULATES every input field           │
│  • user can review / override parameters      │
└──────────────┬────────────────────────────────┘
               │  parameter set
               ▼
┌───────────────────────────────────────────────┐
│  BACKEND — physics engine (Python library)    │
│  • analytical HAMR switching model            │
│  • all sweeps computed IN PARALLEL            │
└──────────────┬────────────────────────────────┘
               │  results
               ▼
┌───────────────────────────────────────────────┐
│  RESULTS — interactive Plotly views           │
│  DCSNR + key recording metrics                │
└──────────────┬────────────────────────────────┘
               │
               ▼
┌───────────────────────────────────────────────┐
│  EXPORT — multi-format reports                │
│  shared internally to plan test experiments   │
└───────────────────────────────────────────────┘

Deployment: Kubernetes · CI/CD: Jenkins
```

> **Results.** Adopted by sputtering engineers and the media team, in use across Western Digital sites in the United States and Japan — over 30 engineers. Removes a hardware-experiment step from the development loop and lets teams evaluate recording performance directly from material parameters. A peer-reviewed publication on the analytical model is in preparation.
>
> **Stack.** Python · Dash · Plotly · IndexedDB · Kubernetes · Jenkins · NumPy/SciPy · Monte Carlo validation

**Render the diagram as inline SVG** — theme-aware, sharp at any zoom, screen-reader accessible. Not an image file, so nothing needs to be exported.

> ⚠️ **Confidentiality gate.** Before this page goes live, Hari must confirm with his Western Digital manager what may be published. Describe the report-export *capability*, never show real data. Check the two presenting photos for legible slide content (DCSNR values, media parameters, HAMR curves) and crop if anything is readable.

`/projects/tmd-pipeline` and `/projects/ai-datascience-lab` follow the same template. TMD covers Monte Carlo → CUDA preprocessing → PySR symbolic regression → discovered analytical form, with 30,000+ observables, 93%+ accuracy, 10× speedup, 75,000+ NERSC hours, jackknife/bootstrap UQ.

---

### 10.6 Publications

**Fix the biggest content error on the live site:** the PRD paper is listed as *"Submitted"* under *"Publications Under Peer-Review."* It is **published**.

> **Peer-Reviewed Publications**
> 1. Ji, C.-R. & **Ravikumar, H.** (2026). *Interpolating conformal algebra in (1+1) dimensions between the instant form and the light-front form of relativistic dynamics.* **Physical Review D 113**, 096018. American Physical Society. — `arXiv:2601.19251 [hep-th]` · `DOI` `arXiv` `BibTeX`
>
> **In Preparation**
> - **Ravikumar, H.** & Ji, C.-R. *Interpolating conformal algebra (3+1) between the instant form and the front form of relativistic dynamics.*
> - **Ravikumar, H.** et al. *Analytical modeling of grain magnetization dynamics in Heat-Assisted Magnetic Recording.* Manuscript in preparation for *IEEE Transactions on Magnetics.*
>
> **Conference**
> - Ji, C.-R., Dahiya, H., & Ravikumar, H. (2021). *Interpolating conformal algebra between the instant form and the front form of relativistic dynamics.* Light Cone 2021 — Physics of Hadrons on the Light Front, Jeju Island, South Korea.
>
> **Theses**
> - **Ravikumar, H.** (2021). *The Poincaré Algebra Interpolation between Instant Form Dynamics (IFD) and Light-Front Dynamics (LFD).* MSc thesis, NIT Jalandhar. Supervised by Prof. Harleen Dahiya, in collaboration with Prof. Chueng-Ryong Ji.

Journal badge on the PRD entry; leave a slot for a Google Scholar citation count.

---

### 10.7 Talks

All 21 existing entries preserved verbatim, grouped by year, with a topic filter (Conformal Algebra · Lattice QCD · Quantum Computing · Seminars). **Add the missing 2026 entry at the top:**

> **(Aug 2026)** "HAMR THMap Modeling & Simulation — the Simulation App DCSNR Simulator," PhD Expo 2026, Western Digital, San Jose, CA, USA

Use **KaTeX** for math in titles (`\(d=1+1\)`, `\((\phi^4)_{1+1}\)`).

---

### 10.8 CV

Sticky left sub-nav with jump links; sticky `Download PDF` → `/cv/CV_HARI.pdf`.

1. **Industry Experience** — *currently absent from the site entirely*
   > **Modeling & Simulation Intern** — Western Digital, San Jose, CA · May–August 2026
   > - Derived closed-form analytical models for HAMR grain magnetization dynamics from first principles (Néel–Arrhenius, Stoner–Wohlfarth), obtaining switching time, noise power, and probability-of-switching expressions across multi-write cycles to predict adjacent track erasure (ATI & xTI).
   > - Validated against Monte Carlo stochastic simulation and experimental spin-stand data on realistic L1₀ FePt grain ensembles.
   > - Built and deployed **Simulation App**, a production Dash/Plotly simulation platform packaged as a modular Python library — adopted by sputtering and media engineering teams across WD sites in the US and Japan (30+ engineers).
   > - Architected CI/CD with Jenkins; deployed on Kubernetes.
2. **Education** — PhD 2021–Present · MS 2021–2024 · MSc 2019–2021 · BSc 2015–2018
3. **Technical Skills** — the §10.2 Tech Stack groupings. **CUDA is currently missing and must be included.**
4. **Research Experience** — Research Assistant, NMSU, **2021–Present** *(live site says "2022–2025" — stale)*; LANL and NCSU collaborations
5. **Publications** — summary linking to `/publications`
6. **Awards** — add **"Wildest Idea" Award, WD Intern Summit 2026 Hackathon** above the 2023 / 2021 / 2018 entries
7. **Certifications** — Google Advanced Data Analytics (Apr 2025), Kaggle Intro to ML (May 2025). **Resolve the NVIDIA CUDA entry** — still reads "In Progress, Expected August 2025."
8. **Schools & Workshops** — unchanged
9. **Teaching** — Teaching Assistant, NMSU, 2021–2023

> ⚠️ Confirm the LaTeX source for `CV_HARI.pdf` contains the Western Digital section. If the web CV and the PDF disagree, the PDF is what recruiters download.

---

### 10.9 Contact

> **H1:** Get in touch
> **Sub:** I'm graduating in December 2026 and interviewing now.
> I'm looking for Research Scientist, Applied/ML Scientist, HPC & Scientific Computing Engineer, or Software Engineer roles in the SF Bay Area. Authorized to work in the U.S. under STEM OPT; open to H-1B sponsorship.
>
> Email `hari1729@nmsu.edu` · LinkedIn · GitHub · Google Scholar · ORCID · arXiv · Handshake
> Office 363, Gardiner Hall · Department of Physics · New Mexico State University · 1255 N. Horseshoe, Las Cruces, NM 88003

No contact form — a static export has no backend.

### 10.10 404
> **404** — This page drifted off the lattice.
> Links to Home · Projects · Publications · CV. Lattice background stays visible.

---

## 11. SEO and metadata

All five current pages share one title and one description. Every page needs its own.

| Route | Title | Description |
|---|---|---|
| `/` | Hariprashad Ravikumar — Computational Physicist, GPU & ML Engineer | PhD candidate building GPU-accelerated ML and simulation tools. Ex-Western Digital R&D. CUDA, HPC, physics-informed ML. Graduating Dec 2026. |
| `/research` | Research — Lattice QCD, HPC & Physics-Informed ML | Lattice QCD calculations of TMDs, nucleon EDMs with Los Alamos, and conformal algebra — GPU-accelerated HPC and symbolic regression. |
| `/projects` | Projects — Simulation, ML & Scientific Software | Simulation App HAMR simulator, GPU-accelerated lattice QCD ML pipeline, full-stack forecasting apps, and more. |
| `/projects/nimble` | Simulation App — HAMR DCSNR Simulator (Western Digital) | Production Dash/Plotly simulation platform for heat-assisted magnetic recording, used by 30+ engineers across WD US and Japan sites. |
| `/publications` | Publications — Hariprashad Ravikumar | Peer-reviewed work including Physical Review D 113, 096018 (2026), plus manuscripts in preparation and conference proceedings. |
| `/talks` | Talks — Hariprashad Ravikumar | 22 research talks on conformal algebra, lattice QCD, quantum computing, and HAMR modeling. |
| `/cv` | CV — Hariprashad Ravikumar | Full curriculum vitae: Western Digital R&D, PhD in Physics at NMSU, publications, awards, and technical skills. |
| `/contact` | Contact — Hariprashad Ravikumar | Graduating December 2026 and interviewing for Research Scientist and ML Engineer roles in the SF Bay Area. |

**Also required:**
- **Fix `og:image`** — currently the relative path `images/profile_picture.webp`, which breaks LinkedIn previews. Must be absolute: `https://hariprashad-ravikumar.github.io/og/card.png`.
- `app/sitemap.ts` generating **all** routes with `lastModified` — the current sitemap omits the projects page.
- `app/robots.ts` allowing all, referencing the sitemap.
- **JSON-LD `Person`** in root layout: name, `jobTitle`, `affiliation`, `alumniOf`, `knowsAbout`, `sameAs` → LinkedIn, GitHub, ORCID, arXiv, Scholar.
- **Analytics:** Plausible or GoatCounter, deferred script, no cookie banner needed.
- Fix the headshot `alt` — currently "PhD Research Photo"; it's a portrait.

---

## 12. Content corrections checklist

Every item is a verified error or inconsistency on the live site.

- [ ] **93%+**, not "over 98%" — accuracy figure
- [ ] PRD paper → **published**, `113, 096018 (2026)` — not "Submitted"
- [ ] Research Assistant → **2021–Present**, not "2022–2025"
- [ ] Footer → **© 2026**, not 2025
- [ ] Add **Industry Experience / Western Digital** to CV *(absent today)*
- [ ] Add **CUDA** + full skills taxonomy to CV
- [ ] Add **Simulation App, TMD Pipeline, WD Aquarius** to Projects
- [ ] Add **Wildest Idea award** to CV Awards
- [ ] Add **PhD Expo 2026** talk
- [ ] Delete **"More projects coming soon — stay tuned!"**
- [ ] Resolve the stale **NVIDIA CUDA cert** ("Expected August 2025")
- [ ] Banner subtitle → **Computational Physics** framing, not "Theoretical Particle Physics"
- [ ] Fix **`og:image`** to an absolute URL
- [ ] Fix **Z₂** rendering bug and its malformed list bullet
- [ ] Add `/projects` to the sitemap
- [ ] Replace **MathJax → KaTeX**
- [ ] Remove GitHub achievement badges

**Off-site, Hari does these in the browser — not Sonnet's scope:**
- [ ] **LinkedIn About:** "published in IEEE Transactions on Magnetics" → **"manuscript in preparation for IEEE Transactions on Magnetics."** *(Confirmed: in preparation.)*
- [ ] Create **Google Scholar** profile, then add the link.

---

## 13. Performance budget

| Metric | Target |
|---|---|
| Lighthouse Performance | **≥ 90** mobile |
| Accessibility / Best Practices / SEO | **≥ 95** each |
| LCP | < 2.0s |
| CLS | **< 0.05** — every image and video needs `width`/`height` |
| Total JS (gzipped, homepage) | **< 120KB** |
| Largest image | < 250KB |
| Each video | < 2.5MB, `preload="none"` |

**How to hold it:** `next/font` for both families (self-hosted, `display:swap`) — no render-blocking font request. Framer Motion imported selectively. Lattice canvas dynamically imported `ssr:false` in `requestIdleCallback`. Everything below the fold lazy. Hero portrait `priority`; all else `loading="lazy"`. Animate only `transform`/`opacity`. Run `npx @next/bundle-analyzer` before Phase 6.

---

## 14. Build sequence

Each phase ends in a committed, working state.

**Phase 0 — Safety (10 min)**
`git tag pre-redesign && git push origin pre-redesign`. Confirm the CV PDF workflow in `.github/workflows/` is untouched. **Do not add the deploy workflow yet.**

**Phase 1 — Scaffold**
Next.js + TypeScript + Tailwind. `next.config.mjs` (§2). Build script with `touch out/.nojekyll`. Design tokens (§4), `next/font`, base layout, Nav, Footer, Container, `PageTransition`. All 8 routes as stubs. Verify `npm run build && npx serve out` renders with styles intact.

**Phase 2 — Design system**
`Button`, `Card`, `SpotlightCard` (§7), `Chip`, `Tag`, `Picture`, `Lightbox`, `MetricTile`. `ProjectCover` with all three modes (§9). `FigureCluster` accepting 0–4 figures, rendering nothing when empty (§16). `LatticeBackground` (§6) with all five guardrails. `lib/motion.ts` with the reduced-motion switch. Build a temporary `/styleguide` route to review every component; delete before Phase 6.

**Phase 3 — Content layer**
`content/metrics.ts`, `publications.ts`, `talks.ts`, `cv.ts`, 8 project MDX files — populated strictly from §10. `scripts/optimize-images.mjs`, processing `assets/raw/` → `public/images/`, passing video through untouched.

**Phase 4 — Pages**
Home first (Hero → MetricStrip → WDSpotlight → FeaturedProjects → Timeline → TechStack → PublicationHighlight → ContactBand). Then Projects + 3 case studies (inline-SVG architecture diagram), Publications, Research, Talks, CV, Contact, 404.

**Phase 5 — SEO, a11y, performance**
Per-page metadata (§11), OG card, `sitemap.ts`, `robots.ts`, JSON-LD, `/GitHub_Portfolio` redirect, analytics. Copy `cv/CV_HARI.pdf` into the export. Keyboard-navigation pass, axe audit, Lighthouse until §13 targets are met.

**Phase 6 — Cutover**
Delete legacy HTML/CSS (keep `cv/` and any externally linked images). Add `deploy.yml` (§2.4). Settings → Pages → Source: **GitHub Actions**. Push, watch the run, verify live. Roll back with `git reset --hard pre-redesign` if needed.

**Phase 7 — Post-launch** → see §16.

---

## 15. Acceptance criteria

- [ ] Loads at `https://hariprashad-ravikumar.github.io` with CSS and JS intact (`.nojekyll` present in `out/`)
- [ ] All 8 routes render; `/GitHub_Portfolio` redirects to `/projects`
- [ ] `/cv/CV_HARI.pdf` still downloads; the LaTeX build workflow still runs
- [ ] No horizontal scroll at 320 / 375 / 768 / 1024 / 1440 / 1920px
- [ ] Lighthouse mobile: Performance ≥ 90, A11y ≥ 95, Best Practices ≥ 95, SEO ≥ 95
- [ ] Unique title + description per page; `og:image` absolute and verified in the LinkedIn Post Inspector
- [ ] Lattice: 60fps, pauses off-screen, single static frame under `prefers-reduced-motion`
- [ ] Videos: never autoplay under reduced-motion or save-data; posters always render; nothing fetched before the card nears the viewport
- [ ] Split covers: square photos uncropped, panel text selectable
- [ ] Every interactive element keyboard-reachable with a visible focus ring; lightbox closes on `Esc` and traps focus
- [ ] All 17 items in §12's on-site checklist done
- [ ] `metrics.ts` is the only place any number is defined
- [ ] No justified text; no Times New Roman anywhere
- [ ] Zero console errors

---

## 16. Phase 7 — deferred work

Not part of the v1 build. Build the seams now, fill them later.

### 16.1 Research figure clusters — 4 per thrust ⏳

`FigureCluster` ships in Phase 2 and renders nothing when passed no figures, so the Research page needs **no changes** when these arrive — just add the files and captions.

**Naming** → `assets/raw/research/<thrust>/` where `<thrust>` ∈ `lattice-tmd` · `nucleon-edm` · `conformal-algebra`:
```
fig-01-data.png   fig-02-method.png   fig-03-result.png   fig-04-validation.png
```

**The selection rule — this is the point.** Hari has many figures to choose from. **Do not pick the four best-looking ones. Pick four that form an arc:**

| Slot | Role | Shows |
|---|---|---|
| `01` | **Data** | What you started with — ideally messy. Raw Monte Carlo scatter with error bars. |
| `02` | **Method** | The machinery working. GPU-vs-CPU timing, pipeline schematic, fit converging. |
| `03` | **Result** | The headline finding. The recovered analytical form overlaid on the data. |
| `04` | **Validation** | Why it's trustworthy. Jackknife/bootstrap bands, comparison to known limits. |

*Messy input → clever method → clean result → proof it holds.* That arc is legible to a hiring manager who has never touched lattice QCD, and it's how a paper is structured anyway. The filenames enforce the sequence.

**Captions carry more weight than the figures.** Uncaptioned, a correlator plot is decoration. Three fields each:
```ts
{ step: '03 · Result',
  title: 'Symbolic regression recovers an analytical form',
  desc: 'PySR fits a closed-form expression — readable physics, not a black box.' }
```
Write `desc` for a smart non-physicist. "χ²/dof = 1.02 across the ensemble" is for the committee; "the fit holds within error bars across every resampled ensemble" is for the person deciding whether to interview him.

**Export:** PNG, 150–300 DPI, 16:10, ≥1600px wide, white or transparent background. Strip the figure's own baked-in title — the caption handles it. Bump label sizes first:
```python
plt.rcParams.update({'font.size': 13, 'axes.labelsize': 14,
                     'savefig.bbox': 'tight', 'savefig.dpi': 200,
                     'savefig.transparent': True})
```

**Layout:** 2×2 grid per thrust, click → lightbox with full caption, mobile scroll-snap. **If a thrust has only two good figures, ship two** — a 2×1 row looks deliberate; a 2×2 with filler does not.

### 16.2 Other deferred items
- **Google Scholar** profile → footer, Publications citation count
- **Simulation App screenshots** if WD clearance comes through → replaces the split cover
- Real screenshots for AI-DataScience-Lab / HariBot if the videos underperform
- **Dark mode** (tokens are already structured for it)
- **Interactive symbolic-regression demo** — the highest-differentiation idea from the original audit
- Blog / technical writing section
- Re-share the URL on LinkedIn after launch to refresh the now-working preview card

---

## 17. Notes for Sonnet

1. **Do not invent content.** Every fact, number, date, and citation is in §10. Anything missing gets a `TODO(hari):` comment, never a guess.
2. **`content/metrics.ts` is authoritative.** Never hardcode `30+` or `93%` in a component.
3. **The performance budget is a requirement, not an aspiration.** If the lattice can't hold 60fps within it, cut node count — don't relax the budget.
4. **Reduced motion is not optional.** Every animation and every video checks `lib/motion.ts`.
5. **Don't touch the CV LaTeX workflow.**
6. **Western Digital material is clearance-gated.** Build the components; keep assets swappable.
7. **Ask before deleting** anything under `cv/` or `images/` — some paths are linked externally.
8. **Build `FigureCluster` in v1 even though it's unused.** Phase 7 should be additive, not a refactor.
