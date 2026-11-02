import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import { extractAIContext } from '../lib/ai-context.ts';

const origin = process.env.TEST_ORIGIN || 'http://127.0.0.1:4173';
const canonical = 'https://hariprashad-ravikumar.github.io';
const xml = await readFile('out/sitemap.xml', 'utf8');
assert(!xml.includes('<lastmod>'));
const paths = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => new URL(m[1]).pathname);
assert.equal(paths.length, 12);
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ reducedMotion: 'reduce' });
await context.route('https://www.googletagmanager.com/**', route => route.abort());
await context.route('https://www.google-analytics.com/**', route => route.abort());
await context.addInitScript(() => {
  window.__copied = '';
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async text => { window.__copied = text; } } });
});
const page = await context.newPage();
const copied = {};
try {
  for (const path of paths) {
    const html = await readFile(`out${path}index.html`, 'utf8');
    assert(html.includes('Explore my work with'), path);
    assert(html.includes(`href="${canonical}${path}"`), path);
    assert(!/name="robots" content="noindex/.test(html), path);
    const schemas = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)].flatMap(m => JSON.parse(m[1]));
    assert(schemas.some(s => s['@type'] === 'Person' && s['@id'] === `${canonical}/#person`));
    assert(!schemas.find(s => s['@type'] === 'Person').sameAs.some(s => s.includes('arxiv.org')));
    if (path.startsWith('/projects/') && path !== '/projects/') assert(schemas.some(s => s['@type'] === 'CreativeWork' && s.author['@id'] === `${canonical}/#person`));
    if (path === '/publications/') assert.equal(schemas.filter(s => s['@type'] === 'ScholarlyArticle').length, 1);
    await page.goto(origin + path);
    assert.equal(await page.locator('[data-ai-share]').count(), 1);
    const toolbar = page.locator('[data-ai-share]');
    for (const width of [1440, 390, 320]) {
      await page.setViewportSize({ width, height: 1000 });
      await toolbar.scrollIntoViewIfNeeded();
      assert(await toolbar.evaluate(el => el.getBoundingClientRect().right <= window.innerWidth), path);
      for (const control of await toolbar.locator('a, button, summary').all()) {
        assert(await control.isVisible(), path);
        assert(await control.evaluate(el => el.getBoundingClientRect().height >= 44), path);
      }
      for (const img of await toolbar.locator('img').all()) {
        assert(await img.evaluate(el => el.complete && el.naturalWidth > 0), path);
      }
      if (width !== 320) await page.screenshot({ path: `/tmp/ai-share-${path.replaceAll('/', '_') || 'home'}-${width}.png` });
    }
    await page.setViewportSize({ width: 1440, height: 1000 });
    const help = toolbar.locator('summary');
    await help.focus();
    await page.keyboard.press('Enter');
    assert(await toolbar.locator('details').evaluate(el => el.open));
    await page.keyboard.press('Enter');
    assert(!(await toolbar.locator('details').evaluate(el => el.open)));
    await page.getByRole('button', { name: 'Copy page', exact: true }).click();
    await page.getByRole('status').filter({ hasText: 'Copied.' }).waitFor();
    const text = await page.evaluate(() => window.__copied);
    copied[path] = text;
    assert(text.includes(`Source: ${canonical}${path}`));
    assert(!text.includes('Explore my work with') && !text.includes('Built with Next.js') && !text.includes('<svg'));
    assert.equal((text.match(/^# /gm) || []).length, 1);
    assert(text.length > 250);
    for (const [label, host] of [['ChatGPT', 'chatgpt.com'], ['Claude', 'claude.ai']]) {
      const link = page.getByRole('link', { name: `${label} (opens in a new tab)`, exact: true });
      const url = new URL(await link.getAttribute('href'));
      assert.equal(url.hostname, host);
      assert(url.searchParams.get('q').includes(canonical + path));
      assert(url.searchParams.get('q').endsWith('ask me to paste the page text.'));
      assert(url.href.length < 1200);
    }
    const gemini = page.getByRole('link', { name: 'Gemini (opens in a new tab; paste copied page text)', exact: true });
    assert.equal(await gemini.getAttribute('href'), 'https://gemini.google.com/app');
    assert.equal(await gemini.getAttribute('target'), '_blank');
    console.log('PASS', path, text.length, 'context characters');
  }
  assert(copied['/projects/cost-aware-llm-router/'].includes('| --- |'));
  assert(copied['/projects/cost-aware-llm-router/'].includes('93.9%'));
  assert(copied['/projects/transformer-pretraining-from-scratch/'].includes('1.057'));
  assert(copied['/projects/wd-internship-2026/'].includes('```mermaid'));
  assert(copied['/publications/'].includes('https://journals.aps.org/prd/abstract/10.1103/prlq-4j1l'));
  assert(copied['/resume/'].includes('Industry Experience'));
  assert(copied['/'].includes('75,000+'));
  assert(copied['/projects/'].replace(/\s+/g, ' ').includes('FastAPI scikit-learn PostgreSQL Redis Docker'));
  for (const file of ['out/404.html', 'out/cv/index.html', 'out/projects/WD-simulation-app/index.html']) {
    assert(!(await readFile(file, 'utf8')).includes('Explore my work with'), file);
  }
  // Exercise math and diagram serialization independently of the page's animation timing.
  await page.goto(origin + '/research/');
  const sample = await page.evaluate(({ extract }) => {
    const root = document.createElement('main');
    root.innerHTML = '<h1>Excluded duplicate</h1><nav>Excluded nav</nav><p>Equation <span class="katex"><span class="katex-mathml"><math><semantics><annotation encoding="application/x-tex">x^2</annotation></semantics></math></span><span class="katex-html" aria-hidden="true">duplicate</span></span></p><svg aria-label="Input to model"><text>Ignored SVG</text></svg><svg aria-hidden="true"><text>Decoration</text></svg><a href="/resume/">CV</a><div data-ai-exclude>Excluded control</div>';
    return (new Function(`return (${extract})`))()(root, 'Fixture', 'https://hariprashad-ravikumar.github.io/research/');
  }, { extract: extractAIContext.toString() });
  assert(sample.includes('$x^2$'));
  assert(sample.includes('Diagram: Input to model'));
  assert(!sample.includes('Ignored SVG') && !sample.includes('Decoration') && !sample.includes('Excluded'));
  assert(sample.includes('[CV](https://hariprashad-ravikumar.github.io/resume/)'));

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(origin + '/projects/cost-aware-llm-router/');
  await page.evaluate(() => {
    window.__events = [];
    window.gtag = (...args) => window.__events.push(args);
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async () => { throw new Error('denied'); } } });
  });
  await page.getByRole('button', { name: 'Copy page', exact: true }).click();
  const fallback = page.getByRole('textbox', { name: 'Page context' });
  await fallback.waitFor();
  assert((await fallback.inputValue()).includes('93.9%'));
  assert.equal(await page.evaluate(() => window.__events.length), 0);
  await fallback.focus();
  assert(await fallback.evaluate(el => el.selectionEnd === el.value.length));
  const share = page.locator('[data-ai-share]');
  assert(await share.evaluate(el => el.getBoundingClientRect().right <= window.innerWidth));
  await page.screenshot({ path: '/tmp/ai-sharing-mobile.png', fullPage: false });
  await page.evaluate(() => {
    navigator.clipboard.writeText = async text => { window.__copied = text; };
  });
  await page.getByRole('button', { name: 'Copy page', exact: true }).click();
  await page.getByRole('status').filter({ hasText: 'Copied.' }).waitFor();
  assert.equal(await fallback.count(), 0);
  const event = await page.evaluate(() => window.__events.at(-1));
  assert.deepEqual(event, ['event', 'ai_share', { action: 'copy', provider: 'clipboard', page_path: '/projects/cost-aware-llm-router/' }]);
  const geminiLink = page.getByRole('link', { name: 'Gemini (opens in a new tab; paste copied page text)', exact: true });
  await geminiLink.evaluate(el => el.addEventListener('click', event => event.preventDefault()));
  await geminiLink.click();
  assert.deepEqual(await page.evaluate(() => window.__events.at(-1)), ['event', 'ai_share', { action: 'open', provider: 'gemini', page_path: '/projects/cost-aware-llm-router/' }]);
  await page.getByRole('status').filter({ hasText: 'Gemini opened in a new tab.' }).waitFor();
  // Prevent navigation while testing the analytics click handler.
  await page.getByRole('link', { name: 'Claude (opens in a new tab)', exact: true }).evaluate(el => el.addEventListener('click', event => event.preventDefault()));
  await page.getByRole('link', { name: 'Claude (opens in a new tab)', exact: true }).click();
  assert.deepEqual(await page.evaluate(() => window.__events.at(-1)), ['event', 'ai_share', { action: 'open', provider: 'claude', page_path: '/projects/cost-aware-llm-router/' }]);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.screenshot({ path: '/tmp/ai-sharing-desktop.png', fullPage: false });
  console.log('PASS exclusions, keyboard, math, diagrams, mobile, clipboard denial/recovery, and analytics');
} finally {
  await browser.close();
}
