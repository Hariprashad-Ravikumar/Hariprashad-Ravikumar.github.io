#!/usr/bin/env node
/**
 * Replaces next/image optimization for the static export (§2.3): walks
 * assets/raw/, emits WebP at [640, 960, 1440, 1920]px into public/images/
 * (mirroring the source subpath), and writes a manifest. Video files pass
 * through untouched — never re-encoded here (see §5.1 for the ffmpeg
 * commands used to prepare them by hand). Generates a poster JPG from frame
 * 1 for any video missing one.
 */
import { execFile } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import sharp from "sharp";

const execFileAsync = promisify(execFile);

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(ROOT, "..");
const OUT_DIR = path.join(REPO_ROOT, "public", "images");
const WIDTHS = [640, 960, 1440, 1920];
const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const VIDEO_EXTS = new Set([".mp4", ".webm"]);

// assets/raw/* -> public/images/*, and assets/bundle/{projects,og}/* (the
// pre-generated covers + OG card, §5) -> public/images/bundle/*. Skips
// favicon-source.png (Phase 5 favicon generation) and generate.mjs (a script).
const SOURCE_ROOTS = [
  { dir: path.join(REPO_ROOT, "assets", "raw"), outPrefix: "" },
  { dir: path.join(REPO_ROOT, "assets", "bundle", "projects"), outPrefix: "bundle/projects" },
  { dir: path.join(REPO_ROOT, "assets", "bundle", "og"), outPrefix: "bundle/og" },
];

// Byte budgets from §13 — logged as warnings, not build failures, since the
// exact bucket (hero/photo/figure) depends on where the file is used.
const SIZE_WARN_BYTES = 250 * 1024;

// assets/raw/video/ needs hand-picked trim windows and poster frames (screen
// recordings, not raw photos) rather than this script's resize pipeline —
// those are produced manually per §5.1 and copied straight into public/video/.
const SKIP_DIR_NAMES = new Set(["video"]);

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.isDirectory() && SKIP_DIR_NAMES.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(full)));
    } else {
      files.push(full);
    }
  }
  return files;
}

async function hasFfmpeg() {
  try {
    await execFileAsync("ffmpeg", ["-version"]);
    return true;
  } catch {
    return false;
  }
}

async function processImage(srcPath, sourceDir, outPrefix, manifest) {
  const rel = path.relative(sourceDir, srcPath);
  const relNoExt = path.join(outPrefix, rel.slice(0, -path.extname(rel).length));
  const outBase = path.join(OUT_DIR, relNoExt);
  await fs.mkdir(path.dirname(outBase), { recursive: true });

  const image = sharp(srcPath);
  const meta = await image.metadata();
  const variants = [];

  for (const width of WIDTHS) {
    if (meta.width && width > meta.width * 1.5) continue; // don't upscale absurdly
    const outPath = `${outBase}-${width}.webp`;
    await sharp(srcPath).resize({ width }).webp({ quality: 82 }).toFile(outPath);
    const { size } = await fs.stat(outPath);
    if (size > SIZE_WARN_BYTES) {
      console.warn(
        `⚠ ${path.relative(REPO_ROOT, outPath)} is ${(size / 1024).toFixed(0)}KB — over the ${SIZE_WARN_BYTES / 1024}KB photo/figure budget (§13). Check source quality/dimensions.`,
      );
    }
    variants.push({ width, path: `/images/${relNoExt}-${width}.webp`, bytes: size });
  }

  manifest[`/images/${relNoExt}`] = {
    source: path.relative(REPO_ROOT, srcPath),
    originalWidth: meta.width,
    originalHeight: meta.height,
    variants,
  };
}

async function processVideo(srcPath, sourceDir, manifest, ffmpegAvailable) {
  const rel = path.relative(sourceDir, srcPath);
  const relNoExt = rel.slice(0, -path.extname(rel).length);
  const outDir = path.join(REPO_ROOT, "public", "video", path.dirname(rel));
  await fs.mkdir(outDir, { recursive: true });

  const destPath = path.join(REPO_ROOT, "public", "video", rel);
  await fs.copyFile(srcPath, destPath); // pass through untouched, never re-encoded

  const posterPath = path.join(REPO_ROOT, "public", "video", `${relNoExt}-poster.jpg`);
  const posterExists = await fs
    .access(posterPath)
    .then(() => true)
    .catch(() => false);

  if (!posterExists) {
    if (!ffmpegAvailable) {
      console.warn(
        `⚠ No poster for ${rel} and ffmpeg isn't installed — skipping. Generate one manually (see §5.1) and place it at public/video/${relNoExt}-poster.jpg`,
      );
    } else {
      await execFileAsync("ffmpeg", [
        "-y",
        "-i",
        srcPath,
        "-vframes",
        "1",
        "-q:v",
        "2",
        posterPath,
      ]);
      console.log(`Generated poster: ${path.relative(REPO_ROOT, posterPath)}`);
    }
  }

  manifest[`/video/${relNoExt}`] = {
    source: path.relative(REPO_ROOT, srcPath),
    video: `/video/${rel}`,
    poster: `/video/${relNoExt}-poster.jpg`,
  };
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  const ffmpegAvailable = await hasFfmpeg();
  const manifest = {};

  for (const { dir, outPrefix } of SOURCE_ROOTS) {
    const exists = await fs
      .access(dir)
      .then(() => true)
      .catch(() => false);
    if (!exists) {
      console.log(`No ${path.relative(REPO_ROOT, dir)} directory found — skipping.`);
      continue;
    }

    const files = await walk(dir);
    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      if (IMAGE_EXTS.has(ext)) {
        await processImage(file, dir, outPrefix, manifest);
      } else if (VIDEO_EXTS.has(ext)) {
        await processVideo(file, dir, manifest, ffmpegAvailable);
      }
    }
  }

  const manifestPath = path.join(REPO_ROOT, "public", "images", "manifest.json");
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`\nWrote ${Object.keys(manifest).length} entries to ${path.relative(REPO_ROOT, manifestPath)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
