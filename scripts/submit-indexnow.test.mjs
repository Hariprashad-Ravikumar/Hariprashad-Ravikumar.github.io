import test from "node:test";
import assert from "node:assert/strict";
import { submitIndexNow } from "./submit-indexnow.mjs";

const keyProvider = async () => ({ key: "test-key", keyLocation: "https://example.com/key.txt" });
const sitemap = '<urlset><url><loc>https://hariprashad-ravikumar.github.io/</loc><image:loc>https://example.com/image.png</image:loc></url></urlset>';

test("submits only page URLs and accepts 200 or 202", async () => {
  for (const status of [200, 202]) {
    const result = await submitIndexNow({ keyProvider, fetchImpl: async (url, options) => {
      if (url.endsWith("sitemap.xml")) return new Response(sitemap);
      assert.equal(options.method, "POST");
      assert.deepEqual(JSON.parse(options.body).urlList, ["https://hariprashad-ravikumar.github.io/"]);
      return new Response("", { status });
    } });
    assert.deepEqual(result, { count: 1, status });
  }
});

test("API rejection is actionable and propagates", async () => {
  await assert.rejects(submitIndexNow({ keyProvider, fetchImpl: async url => url.endsWith("sitemap.xml")
    ? new Response(sitemap) : new Response("invalid key", { status: 403 }) }), /HTTP 403.*ownership key/);
});

test("network, sitemap, and ownership failures propagate", async () => {
  await assert.rejects(submitIndexNow({ keyProvider, fetchImpl: async () => { throw new Error("network unavailable"); } }), /network unavailable/);
  await assert.rejects(submitIndexNow({ keyProvider, fetchImpl: async () => new Response("", { status: 404 }) }), /sitemap.xml: 404/);
  await assert.rejects(submitIndexNow({ keyProvider, fetchImpl: async () => new Response("<urlset/>") }), /no <loc>/);
  await assert.rejects(submitIndexNow({ keyProvider: async () => { throw new Error("key missing"); } }), /key missing/);
});
