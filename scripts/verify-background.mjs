import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { chromium } from 'playwright';

const origin = process.env.TEST_ORIGIN || 'http://127.0.0.1:4173';
const browser = await chromium.launch();
const context = await browser.newContext({ reducedMotion: 'reduce' });
await context.route('https://www.googletagmanager.com/**', r => r.abort());
await context.route('https://www.google-analytics.com/**', r => r.abort());
await context.addInitScript(() => {
  const nativeMatchMedia = window.matchMedia.bind(window);
  window.__densityQueries = [];
  window.__motionQueries = [];
  window.matchMedia = query => {
    const result = nativeMatchMedia(query);
    if (query.startsWith('(resolution:')) window.__densityQueries.push(result);
    if (query === '(prefers-reduced-motion: reduce)') window.__motionQueries.push(result);
    return result;
  };
});
const page = await context.newPage();
const canvas = page.locator('[data-fluid-background]');
const pixels = async () => createHash('sha256').update(await canvas.evaluate(el => el.toDataURL())).digest('hex');
try {
  await page.goto(origin);
  await canvas.waitFor();
  const first = await pixels();
  await page.mouse.move(50, 50);
  await page.evaluate(() => window.scrollTo(0, 900));
  assert.equal(await pixels(), first, 'Pointer and scroll must not move the background');
  for (const [name, width, height, dpr] of [
    ['mobile', 390, 844, 1], ['desktop', 1440, 1000, 1],
    ['retina', 1440, 1000, 2], ['ultrawide', 3440, 1440, 1],
    ['4k', 3840, 2160, 1], ['4k-retina', 3840, 2160, 2],
  ]) {
    await page.setViewportSize({ width, height });
    // Simulate a monitor-density transition and its resolution media-query event.
    await page.evaluate(density => {
      Object.defineProperty(window, 'devicePixelRatio', { configurable: true, value: density });
      window.__densityQueries.at(-1).dispatchEvent(new Event('change'));
    }, dpr);
    await page.evaluate(() => window.scrollTo(0, 0));
    const stats = await canvas.evaluate(el => {
      const ctx = el.getContext('2d');
      const { data } = ctx.getImageData(0, 0, el.width, el.height);
      const linear = v => (v /= 255) <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
      let minL = 1, maxL = 0;
      for (let i = 0; i < data.length; i += 4 * 97) {
        if (data[i + 3] !== 255) throw new Error('Blank/transparent background after resize');
        const l = .2126 * linear(data[i]) + .7152 * linear(data[i + 1]) + .0722 * linear(data[i + 2]);
        minL = Math.min(minL, l); maxL = Math.max(maxL, l);
      }
      const colors = ['--ink-900','--ink-700','--ink-500','--brand-500','--accent-700'];
      const contrasts = Object.fromEntries(colors.map(key => {
        const hex = getComputedStyle(document.documentElement).getPropertyValue(key).trim().slice(1);
        const rgb = [0,2,4].map(i => linear(parseInt(hex.slice(i, i+2),16)));
        return [key, (minL + .05) / (.2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2]+.05)];
      }));
      return { width: el.width, height: el.height, minL, maxL, contrasts };
    });
    assert(stats.width * stats.height <= 8_310_000, 'Bounded canvas memory');
    assert(stats.maxL - stats.minL > .01, 'Gradient remains visible after resize');
    for (const [color, ratio] of Object.entries(stats.contrasts)) assert(ratio >= 4.5, `${name}: ${color} contrast ${ratio}`);
    await page.screenshot({ path: `/tmp/background-${name}.png` });
    console.log('PASS', name, stats);
  }
  // A controlled clock makes the animation/visibility checks independent of test speed.
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.clock.install();
  await page.clock.pauseAt(new Date(Date.now() + 1000));
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.evaluate(() => window.__motionQueries.forEach(q => q.dispatchEvent(new Event('change'))));
  await page.clock.runFor(100);
  const start = await pixels();
  await page.clock.fastForward(30000);
  await page.clock.runFor(100);
  assert.notEqual(await pixels(), start, 'Ambient drift advances');
  await page.screenshot({ path: '/tmp/background-drift-30s.png' });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.evaluate(() => window.__motionQueries.forEach(q => q.dispatchEvent(new Event('change'))));
  const frozen = await pixels();
  await page.clock.fastForward(10000);
  await page.clock.runFor(100);
  assert.equal(await pixels(), frozen, 'Reduced motion freezes immediately');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.evaluate(() => window.__motionQueries.forEach(q => q.dispatchEvent(new Event('change'))));
  await page.clock.runFor(100);
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, value: true });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  const hidden = await pixels();
  await page.clock.fastForward(90000);
  assert.equal(await pixels(), hidden, 'Hidden tab does not animate');
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, value: false });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  assert.equal(await pixels(), hidden, 'Resume does not jump forward');
  await page.clock.runFor(100);
  await page.clock.fastForward(10000);
  await page.clock.runFor(100);
  assert.notEqual(await pixels(), hidden, 'Resume restarts animation');
  assert.equal(await canvas.getAttribute('aria-hidden'), 'true');
  assert(await canvas.evaluate(el => el.closest('[data-ai-exclude]') !== null));

  // Real browser DPR=2 captures supplement the simulated cross-monitor changes above.
  const retina = await browser.newContext({ deviceScaleFactor: 2, reducedMotion: 'reduce', viewport: { width: 1440, height: 1000 } });
  await retina.route('https://www.googletagmanager.com/**', r => r.abort());
  const retinaPage = await retina.newPage();
  await retinaPage.goto(origin);
  await retinaPage.locator('[data-fluid-background]').waitFor();
  await retinaPage.screenshot({ path: '/tmp/background-native-retina.png' });
  await retina.close();

  // No Canvas 2D support must leave a permanent pearl surface, not a blank/black frame.
  const fallbackContext = await browser.newContext({ reducedMotion: "reduce" });
  await fallbackContext.route("https://www.googletagmanager.com/**", r => r.abort());
  const fallbackPage = await fallbackContext.newPage();
  await fallbackPage.addInitScript(() => { HTMLCanvasElement.prototype.getContext = () => null; });
  await fallbackPage.goto(origin);
  await fallbackPage.locator('[data-fluid-background]').waitFor();
  assert(await fallbackPage.locator('[data-fluid-background]').evaluate(el => {
    const base = el.parentElement.parentElement;
    return getComputedStyle(base).backgroundColor === 'rgb(251, 252, 254)' && getComputedStyle(base).opacity === '1';
  }));
  await fallbackContext.close();
  console.log('PASS motion changes, hidden/resume, scroll/pointer independence, and canvas fallback');
} finally {
  await browser.close();
}
