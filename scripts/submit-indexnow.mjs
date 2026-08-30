#!/usr/bin/env node
/**
 * Pings IndexNow (Bing + Yandex) with every URL in the live sitemap so they
 * pick up changes without waiting for their next scheduled crawl. Google
 * doesn't participate in IndexNow — Search Console submission covers that
 * separately. Run after deploy, once the key file and new content are live.
 */
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SITE_URL = "https://hariprashad-ravikumar.github.io";
const HOST = "hariprashad-ravikumar.github.io";

async function findKey() {
  const files = await readdir(path.join(ROOT, "public"));
  const keyFile = files.find((f) => /^[0-9a-f]{32}\.txt$/.test(f));
  if (!keyFile) throw new Error("No IndexNow key file found in public/ (expected a 32-char hex .txt file)");
  const key = (await readFile(path.join(ROOT, "public", keyFile), "utf8")).trim();
  return { key, keyLocation: `${SITE_URL}/${keyFile}` };
}

async function fetchSitemapUrls() {
  const res = await fetch(`${SITE_URL}/sitemap.xml`);
  if (!res.ok) throw new Error(`Failed to fetch sitemap.xml: ${res.status}`);
  const xml = await res.text();
  const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
  if (urls.length === 0) throw new Error("sitemap.xml returned no <loc> entries");
  return urls;
}

async function main() {
  const { key, keyLocation } = await findKey();
  const urlList = await fetchSitemapUrls();

  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: HOST, key, keyLocation, urlList }),
  });

  if (res.ok) {
    console.log(`✓ IndexNow: submitted ${urlList.length} URLs (${res.status})`);
  } else {
    console.warn(`⚠ IndexNow submission returned ${res.status} — not failing the deploy`);
    console.warn(await res.text().catch(() => ""));
  }
}

main().catch((err) => {
  console.warn("⚠ IndexNow submission skipped:", err.message);
});
