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

async function fetchSitemapUrls(fetchImpl) {
  const res = await fetchImpl(`${SITE_URL}/sitemap.xml`, { signal: AbortSignal.timeout(30000) });
  if (!res.ok) throw new Error(`Failed to fetch sitemap.xml: ${res.status}`);
  const xml = await res.text();
  const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
  if (urls.length === 0) throw new Error("sitemap.xml returned no <loc> entries");
  return urls;
}

export async function submitIndexNow({ fetchImpl = fetch, keyProvider = findKey } = {}) {
  const { key, keyLocation } = await keyProvider();
  const urlList = await fetchSitemapUrls(fetchImpl);

  const res = await fetchImpl("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: HOST, key, keyLocation, urlList }),
    signal: AbortSignal.timeout(30000),
  });

  if (res.ok) {
    return { count: urlList.length, status: res.status };
  } else {
    throw new Error(`IndexNow returned HTTP ${res.status}: ${await res.text().catch(() => "")}. Check the public ownership key, sitemap URLs, and API availability before rerunning the indexing job.`);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  submitIndexNow().then(({ count, status }) => {
    console.log(`✓ IndexNow: submitted ${count} URLs (${status})`);
  }).catch((err) => {
    console.error(`IndexNow failed: ${err.message}. The site deployment is unaffected. Verify sitemap/key access and rerun the indexing job.`);
    process.exitCode = 1;
  });
}
