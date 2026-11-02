# Hariprashad Ravikumar — personal website

Source for [hariprashad-ravikumar.github.io](https://hariprashad-ravikumar.github.io/), a Next.js site statically exported to GitHub Pages.

![Site demo](assets/demo.gif)

## Stack

Next.js 16 (App Router, `output: "export"`) · React 19 · Tailwind CSS 4 · MDX for long-form case studies · Framer Motion · deployed via GitHub Actions to GitHub Pages on every push to `main`.

## Repo structure

```
app/                    routes (App Router)
  layout.tsx               root layout: fonts, background, nav/footer, Person JSON-LD
  page.tsx                 home
  research/                research thrusts
  projects/                projects grid
  projects/[slug]/         case-study pages (wd-internship-2026, tmd-pipeline, ai-datascience-lab)
                            — prose for each lives in content/projects/*.mdx
  publications/  talks/  resume/  contact/
  cv/                       static redirect stub: old /cv/ URLs -> /resume/
  sitemap.ts  robots.ts     generated from route + project data, not hand-maintained

components/
  layout/                 Nav, Footer, PageTransition, Container, Section
  bg/                     FluidMeshBackground (animated background)
  ui/                     Button, Card, Chip, Tag, Picture, Lightbox, MetricTile,
                          SpotlightCard, brand-icons (inline SVG logos), MathText, Mermaid
  media/                  ProjectCover (3 modes: generated | split | video), FigureCluster
  home/                   Hero, MetricStrip, WDSpotlight, FeaturedProjects, Timeline,
                          TechStack, PublicationHighlight, ContactBand
  content/                ProjectCard, PubEntry, TalkList, ResumeSection, ResumeSideNav,
                          WDArchitectureDiagram, ProjectsBalance

content/                 typed data + MDX prose — the single source of truth for site copy
  metrics.ts                every stat shown on the site (40+ engineers, 98% accuracy, ...)
                             — nothing else should hardcode these numbers
  projects.ts  publications.ts  talks.ts  resume.ts
  projects/*.mdx            long-form case-study bodies

lib/                     seo.ts (per-page metadata + OG/Twitter card builder), motion.ts,
                         springs.ts, useSpotlight.ts

public/                  everything served as-is at the site root
  images/                  optimized WebP output of scripts/optimize-images.mjs (generated —
                           don't hand-edit; re-run the script instead)
  images/bundle/           optimized output of assets/bundle/generate.mjs
  og/card.png              link-preview card (regenerate via assets/bundle/generate.mjs)
  cv/CV_HARI.pdf            copied here at build time from cv/CV_HARI.pdf — gitignored, not committed
  talks/  publication_pdfs/ the actual served PDFs (source of truth — not the repo root)
  <hex>.txt                 IndexNow ownership-verification key

assets/
  raw/                     original source photos/video — input to scripts/optimize-images.mjs
  bundle/                  generate.mjs: Playwright-rendered OG card + project cover images
                           (design tokens mirror app/globals.css; re-run after changing either)
  demo.gif                 README demo above

scripts/
  optimize-images.mjs       assets/raw/* + assets/bundle/{projects,og}/* -> public/images/*
                            (responsive WebP at 640/960/1440/1920px + a manifest.json)
  submit-indexnow.mjs        pings IndexNow (Bing/Yandex) with every sitemap URL; run by the
                            indexnow job in .github/workflows/deploy.yml after each deploy

.github/workflows/deploy.yml   build -> deploy to GitHub Pages -> submit-indexnow.mjs

cv/CV_HARI.pdf            canonical résumé PDF (owned by a separate LaTeX CI/CD repo;
                          copied into public/cv/ at build time, see package.json)

PLAN.md                  the original build plan for this site — design decisions,
                         copy, and the full page-by-page spec, kept for history
```

## Local development

```bash
npm install
npm run dev              # http://localhost:3000
npm run build             # static export to out/
npm run optimize:images   # re-run the image pipeline after touching assets/raw or assets/bundle
```

## Deployment

Push to `main` → GitHub Actions (`.github/workflows/deploy.yml`) builds, publishes to GitHub Pages, then pings IndexNow so Bing/Yandex pick up the change without waiting for their next crawl. Google indexing goes through Search Console separately (not part of this repo's automation).

## AI sharing and discovery checks

Every content page offers an **Explore my work with** row with official ChatGPT, Claude, and Gemini marks and a **Copy page** action. It follows the homepage action buttons or the page introduction (and remains below the title on pages without an introduction). **How it works** expands brief guidance. Logo sources are recorded in `public/images/brands/README.md`. Copying serializes the rendered `data-ai-content` boundary to Markdown; `data-ai-exclude` removes controls, and `data-ai-text` supplies stable text for animated values and diagrams. Provider links contain only a neutral prompt and the canonical page URL. No API credentials or backend are needed.

After building, serve `out/` locally and run the verification scripts:

```bash
python3 -m http.server 4173 --bind 127.0.0.1 --directory out
# In a second terminal, using the Node version in .nvmrc:
node --test scripts/submit-indexnow.test.mjs
node scripts/verify-ai-sharing.mjs
```

The browser checks cover all 12 content pages, redirects/404 exclusions, structured data, context extraction, keyboard/mobile behavior, clipboard failures, and analytics. `TEST_ORIGIN` overrides the local server URL. IndexNow failures now fail only the indexing job; the deployed site remains available. Verify the ownership key and sitemap before rerunning that job.

Provider URL formats are external behavior, not a versioned API contract. ChatGPT prompt prefill was verified on November 2, 2026. Claude retained the prompt through its sign-in redirect; authenticated composer behavior still needs a signed-in check. Copy page remains available if a provider cannot prefill or retrieve a page.

Editorial follow-ups and the initial indexing baseline are in [docs/ai-discovery-editorial-review.md](docs/ai-discovery-editorial-review.md). Repository-wide lint currently reports five pre-existing errors in Nav, MetricTile, Reveal, SpotlightCard, and TerminalStatusLine; these were reproduced against unchanged `main` during this implementation.

Gemini opens https://gemini.google.com/app with a Copy page / paste workflow; prompt prefill is not assumed. Its link and on-page feedback explain this fallback.
