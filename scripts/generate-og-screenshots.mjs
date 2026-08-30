#!/usr/bin/env node
/**
 * Screenshots the real, live-themed pages (via `next dev`) into per-page
 * og:image PNGs, so link previews show each page's actual desktop content
 * instead of one shared hand-built card. Run before `next build` — see
 * package.json's "build" script.
 *
 * The static pages and the wd-internship-2026 case study now use manually
 * captured screenshots instead (see scripts/crop-og-screenshot.mjs and
 * assets/raw/og/) — MANUAL_SLUGS/ROUTES below excludes them so this script
 * never regenerates over and silently discards that manual work.
 */
import { spawn } from "node:child_process";
import { mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import net from "node:net";
import { chromium } from "playwright";
import sharp from "sharp";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(ROOT, "..");
const OUT_DIR = path.join(REPO_ROOT, "public", "og");
const PORT = 4173;
const BASE_URL = `http://127.0.0.1:${PORT}`;

// content/projects.ts is TypeScript, so it can't be imported directly by this
// plain Node script — the case-study slugs are read straight from the
// case-study MDX directory instead (kept in sync with CASE_STUDIES in
// app/projects/[slug]/page.tsx).
const caseStudySlugs = (await readdir(path.join(REPO_ROOT, "content", "projects")))
  .filter((f) => f.endsWith(".mdx"))
  .map((f) => f.replace(/\.mdx$/, ""));

const MANUAL_SLUGS = new Set(["wd-internship-2026"]);

const ROUTES = caseStudySlugs
  .filter((slug) => !MANUAL_SLUGS.has(slug))
  .map((slug) => ({ path: `/projects/${slug}/`, out: `projects/${slug}.png` }));

function waitForServer(url, timeoutMs = 300_000) {
  const { hostname, port } = new URL(url);
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const attempt = () => {
      const socket = net.connect({ host: hostname, port: port || 80 }, () => {
        socket.destroy();
        resolve();
      });
      socket.on('error', () => {
        if (Date.now() - start > timeoutMs) {
          reject(new Error(`Timed out waiting for ${url}`));
        } else {
          setTimeout(attempt, 500);
        }
      });
    };
    attempt();
  });
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  await mkdir(path.join(OUT_DIR, "projects"), { recursive: true });

  const server = spawn("npx", ["next", "dev", "--webpack", "-p", String(PORT)], {
    cwd: REPO_ROOT,
    stdio: "inherit",
  });

  try {
    await waitForServer(BASE_URL);

    const browser = await chromium.launch();
    try {
      const page = await browser.newPage({
        viewport: { width: 1200, height: 900 },
        deviceScaleFactor: 2,
        reducedMotion: "reduce",
      });

      for (const route of ROUTES) {
        await page.goto(`${BASE_URL}${route.path}`, { waitUntil: "networkidle" });

        // scrollIntoView would align the anchor flush with the viewport top,
        // but the nav is `sticky top-0` and would then overlap/hide it — so
        // scroll to (anchor top - sticky header height) instead.
        await page.evaluate(() => {
          const anchor = document.querySelector("[data-og-anchor]");
          if (!anchor) {
            window.scrollTo(0, 0);
            return;
          }
          const header = document.querySelector("header");
          const headerHeight = header instanceof HTMLElement ? header.offsetHeight : 0;
          const top = anchor.getBoundingClientRect().top + window.scrollY;
          window.scrollTo(0, Math.max(0, top - headerHeight - 16));
        });

        const buffer = await page.screenshot({
          clip: { x: 0, y: 0, width: 1200, height: 630 },
        });

        // No `quality` option here: for PNG, sharp's `quality` implies
        // palette quantization to 256 colours, which visibly bands/blurs
        // the gradients and photos in these screenshots. Keep it lossless.
        const outPath = path.join(OUT_DIR, route.out);
        await sharp(buffer).resize(1200, 630).png({ compressionLevel: 9 }).toFile(outPath);
        console.log(`Wrote ${path.relative(REPO_ROOT, outPath)}`);
      }
    } finally {
      await browser.close();
    }
  } finally {
    server.kill();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
