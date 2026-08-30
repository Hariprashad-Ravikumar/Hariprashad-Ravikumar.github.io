#!/usr/bin/env node
/**
 * Crops the manually-captured browser screenshots in assets/raw/og/ into
 * 1200x630 og:image PNGs at public/og/. Source screenshots are full browser
 * windows (wider aspect ratio needed, but taller than 1200x630) — since
 * every page's important content (heading, nav, buttons) sits at the top,
 * this crops a same-width band off the top (never center-crops) and resizes
 * that down, rather than squashing/distorting the whole screenshot.
 *
 * Re-run any time assets/raw/og/*.png is replaced with a new capture.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(ROOT, "..");
const SRC_DIR = path.join(REPO_ROOT, "assets", "raw", "og");
const OUT_DIR = path.join(REPO_ROOT, "public", "og");

const TARGET_WIDTH = 1200;
const TARGET_HEIGHT = 630;

// crop-band height overrides, in source pixels, keyed by output filename —
// only needed when the default top band (matching the 1200:630 aspect
// ratio) clips into a row of content instead of landing in whitespace.
// Verified visually after each run (see scripts/generate-og-screenshots.mjs
// for the same visual-verification requirement on the automated pipeline).
const CROP_HEIGHT_OVERRIDES = {
  // Default 1171px band lands mid-button-row (navy "View Projects" button
  // spans y=1145-1220 in the 2230-wide source) — extend past it into the
  // whitespace gap before the stats row instead of clipping it.
  "home.png": 1235,
};

const FILES = [
  "home.png",
  "projects.png",
  "publications.png",
  "talks.png",
  "research.png",
  "contact.png",
  "resume.png",
  "wd-internship-2026.png",
];

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  await fs.mkdir(path.join(OUT_DIR, "projects"), { recursive: true });

  for (const file of FILES) {
    const srcPath = path.join(SRC_DIR, file);
    const outPath = file === "wd-internship-2026.png"
      ? path.join(OUT_DIR, "projects", file)
      : path.join(OUT_DIR, file);

    const image = sharp(srcPath);
    const { width, height } = await image.metadata();
    const defaultCropHeight = Math.round(width * (TARGET_HEIGHT / TARGET_WIDTH));
    const cropHeight = Math.min(CROP_HEIGHT_OVERRIDES[file] ?? defaultCropHeight, height);

    // No `quality` option on .png() — for PNG it silently quantizes to a
    // 256-colour palette, which visibly bands/blurs gradients and photos
    // (already hit and fixed once in generate-og-screenshots.mjs).
    // fit: "fill" — the extract() above already chose the exact crop we
    // want; sharp's default resize fit ("cover") would otherwise re-crop
    // that band again (centered) whenever cropHeight doesn't exactly match
    // the 1200:630 aspect, undoing a deliberate override like home.png's.
    await sharp(srcPath)
      .extract({ left: 0, top: 0, width, height: cropHeight })
      .resize(TARGET_WIDTH, TARGET_HEIGHT, { fit: "fill" })
      .png({ compressionLevel: 9 })
      .toFile(outPath);

    console.log(`${file}: cropped top ${cropHeight}px of ${height}px -> ${path.relative(REPO_ROOT, outPath)}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
