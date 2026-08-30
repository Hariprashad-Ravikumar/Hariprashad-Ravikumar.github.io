#!/usr/bin/env node
/**
 * One-off favicon generator: composites the hero headshot inside the same
 * rotating conic-gradient ring used for the Nav "Home" avatar (.avatar-ring
 * in app/globals.css), then exports it at every size Next.js's file-based
 * icon convention expects. Not part of the build pipeline — re-run by hand
 * whenever the headshot or brand gradient colors change.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(ROOT, "..");

const HEADSHOT_SRC = path.join(REPO_ROOT, "assets", "raw", "hero", "headshot.jpg");
const MASTER_SIZE = 1024;
const RING_FRACTION = 0.095; // ring thickness as a fraction of the radius

// Same 4-stop sweep as .avatar-ring (app/globals.css), from 0deg clockwise.
const GRADIENT_STOPS = [
  { pos: 0 / 4, color: [0x2e, 0x4f, 0xd6] }, // --brand-500
  { pos: 1 / 4, color: [0x1e, 0xb3, 0xa5] }, // --accent-500
  { pos: 2 / 4, color: [0x7d, 0xd3, 0xc9] }, // --aurora-2
  { pos: 3 / 4, color: [0x8f, 0xa4, 0xff] }, // --brand-300
  { pos: 4 / 4, color: [0x2e, 0x4f, 0xd6] }, // back to --brand-500
];

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function colorAt(t) {
  // t in [0, 1) around the circle, matching CSS conic-gradient(from 0deg, ...)
  for (let i = 0; i < GRADIENT_STOPS.length - 1; i++) {
    const a = GRADIENT_STOPS[i];
    const b = GRADIENT_STOPS[i + 1];
    if (t >= a.pos && t <= b.pos) {
      const local = (t - a.pos) / (b.pos - a.pos || 1);
      return [
        Math.round(lerp(a.color[0], b.color[0], local)),
        Math.round(lerp(a.color[1], b.color[1], local)),
        Math.round(lerp(a.color[2], b.color[2], local)),
      ];
    }
  }
  return GRADIENT_STOPS[GRADIENT_STOPS.length - 1].color;
}

function buildConicGradientBuffer(size) {
  const buf = Buffer.alloc(size * size * 4);
  const cx = size / 2;
  const cy = size / 2;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = x - cx;
      const dy = y - cy;
      // atan2(dx, -dy) starts the sweep at 12 o'clock and goes clockwise,
      // matching CSS conic-gradient(from 0deg, ...).
      let angle = Math.atan2(dx, -dy);
      if (angle < 0) angle += 2 * Math.PI;
      const t = angle / (2 * Math.PI);
      const [r, g, b] = colorAt(t);
      const i = (y * size + x) * 4;
      buf[i] = r;
      buf[i + 1] = g;
      buf[i + 2] = b;
      buf[i + 3] = 255;
    }
  }
  return buf;
}

function annulusMaskSvg(size, outerR, innerR) {
  const c = size / 2;
  return Buffer.from(`
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <mask id="m">
          <circle cx="${c}" cy="${c}" r="${outerR}" fill="white"/>
          <circle cx="${c}" cy="${c}" r="${innerR}" fill="black"/>
        </mask>
      </defs>
      <rect width="${size}" height="${size}" fill="white" mask="url(#m)"/>
    </svg>
  `);
}

function circleMaskSvg(size, r) {
  const c = size / 2;
  return Buffer.from(
    `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg"><circle cx="${c}" cy="${c}" r="${r}" fill="white"/></svg>`,
  );
}

// Minimal "PNG-compressed ICO" writer: a 6-byte header, one 16-byte
// directory entry per image, followed by the raw PNG bytes themselves.
// Supported by every modern browser/OS since Windows Vista — no extra
// dependency needed for a one-off script.
function buildIco(pngBuffers) {
  const count = pngBuffers.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(count, 4);

  const dirEntries = [];
  const imageData = [];
  let offset = 6 + count * 16;

  for (const { size, buffer } of pngBuffers) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0); // width (0 = 256)
    entry.writeUInt8(size >= 256 ? 0 : size, 1); // height (0 = 256)
    entry.writeUInt8(0, 2); // color palette
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(buffer.length, 8); // image data size
    entry.writeUInt32LE(offset, 12); // image data offset
    dirEntries.push(entry);
    imageData.push(buffer);
    offset += buffer.length;
  }

  return Buffer.concat([header, ...dirEntries, ...imageData]);
}

async function main() {
  const outerR = MASTER_SIZE / 2;
  const innerR = outerR * (1 - RING_FRACTION);

  const ringRaw = buildConicGradientBuffer(MASTER_SIZE);
  const ring = await sharp(ringRaw, {
    raw: { width: MASTER_SIZE, height: MASTER_SIZE, channels: 4 },
  })
    .composite([
      { input: annulusMaskSvg(MASTER_SIZE, outerR, innerR), blend: "dest-in" },
    ])
    .png()
    .toBuffer();

  const photoSize = Math.round(innerR * 2);
  const photo = await sharp(HEADSHOT_SRC)
    .resize(photoSize, photoSize, { fit: "cover", position: "attention" })
    .composite([{ input: circleMaskSvg(photoSize, photoSize / 2), blend: "dest-in" }])
    .png()
    .toBuffer();

  const photoOffset = Math.round(outerR - photoSize / 2);
  const master = await sharp({
    create: {
      width: MASTER_SIZE,
      height: MASTER_SIZE,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      { input: photo, left: photoOffset, top: photoOffset },
      { input: ring, left: 0, top: 0 },
    ])
    .png()
    .toBuffer();

  await sharp(master).resize(32, 32).png().toFile(path.join(REPO_ROOT, "app", "icon.png"));
  await sharp(master).resize(180, 180).png().toFile(path.join(REPO_ROOT, "app", "apple-icon.png"));
  await fs.writeFile(path.join(REPO_ROOT, "assets", "bundle", "favicon-source.png"), master);

  const ico16 = await sharp(master).resize(16, 16).png().toBuffer();
  const ico32 = await sharp(master).resize(32, 32).png().toBuffer();
  const ico = buildIco([
    { size: 16, buffer: ico16 },
    { size: 32, buffer: ico32 },
  ]);
  await fs.writeFile(path.join(REPO_ROOT, "app", "favicon.ico"), ico);

  console.log("Wrote app/icon.png, app/apple-icon.png, app/favicon.ico, assets/bundle/favicon-source.png");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
