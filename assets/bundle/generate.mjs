/**
 * generate.mjs — produces every image asset Hari doesn't have a photo for.
 * Run:  node generate.mjs
 * Out:  ./out/
 *
 * Re-run this any time. To swap a generated cover for a real screenshot later,
 * just delete that entry from PROJECTS and drop the screenshot in assets/raw/projects/.
 */
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const OUT = path.resolve('./out');

/* ─────────────── design tokens (mirror app/globals.css) ─────────────── */
const T = {
  brand: '#00004C', ink: '#0A0E27', accent: '#00C2B2',
  a1: '#7DD3D8', a2: '#A5B4FC', a3: '#C4B5FD',
};

/* Deterministic lattice so output is reproducible across runs */
function lattice(w, h, count, seed = 7) {
  let s = seed;
  const rnd = () => (s = (s * 1103515245 + 12345) % 2147483648) / 2147483648;
  const nodes = Array.from({ length: count }, () => ({
    x: rnd() * w, y: rnd() * h, r: 1.5 + rnd() * 2.5,
    c: [T.a1, T.a2, T.a3, T.accent][Math.floor(rnd() * 4)],
  }));
  const LINK = Math.min(w, h) * 0.22;
  let edges = '';
  for (let i = 0; i < nodes.length; i++)
    for (let j = i + 1; j < nodes.length; j++) {
      const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
      if (d < LINK) edges += `<line x1="${nodes[i].x.toFixed(1)}" y1="${nodes[i].y.toFixed(1)}" x2="${nodes[j].x.toFixed(1)}" y2="${nodes[j].y.toFixed(1)}" stroke="${T.a2}" stroke-opacity="${(0.20 * (1 - d / LINK)).toFixed(3)}" stroke-width="1"/>`;
    }
  const dots = nodes.map(n => `<circle cx="${n.x.toFixed(1)}" cy="${n.y.toFixed(1)}" r="${n.r.toFixed(1)}" fill="${n.c}" fill-opacity="0.45"/>`).join('');
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" style="position:absolute;inset:0">${edges}${dots}</svg>`;
}

const SHELL = (w, h, body, extraCss = '') => `<!doctype html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=block" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${w}px;height:${h}px;overflow:hidden}
body{font-family:'Inter',system-ui,sans-serif;
  background:radial-gradient(1200px 700px at 78% 12%, #16215e 0%, transparent 60%),
             linear-gradient(145deg, ${T.brand} 0%, ${T.ink} 100%);
  color:#fff;position:relative}
.glowA{position:absolute;width:${w*0.5}px;height:${w*0.5}px;border-radius:50%;
  background:radial-gradient(circle, ${T.accent}2E 0%, transparent 68%);
  top:${-w*0.14}px;right:${-w*0.10}px;filter:blur(${w*0.02}px)}
.glowB{position:absolute;width:${w*0.42}px;height:${w*0.42}px;border-radius:50%;
  background:radial-gradient(circle, ${T.a3}26 0%, transparent 68%);
  bottom:${-w*0.16}px;left:${-w*0.08}px;filter:blur(${w*0.02}px)}
.mono{font-family:'JetBrains Mono',ui-monospace,monospace}
.wrap{position:relative;z-index:2;width:100%;height:100%;display:flex;flex-direction:column;justify-content:center}
${extraCss}
</style></head><body>
<div class="glowA"></div><div class="glowB"></div>
${lattice(w, h, Math.round((w * h) / 26000))}
${body}
</body></html>`;

/* ───────────────────────────── OG card ───────────────────────────── */
const OG = SHELL(1200, 630, `
<div class="wrap" style="padding:76px 80px">
  <div class="mono" style="font-size:15px;font-weight:700;letter-spacing:.18em;color:${T.accent};margin-bottom:26px">
    HARIPRASHAD&#8209;RAVIKUMAR.GITHUB.IO
  </div>
  <h1 style="font-size:66px;font-weight:800;letter-spacing:-.03em;line-height:1.02;margin-bottom:20px">
    Hariprashad Ravikumar
  </h1>
  <p style="font-size:29px;font-weight:400;line-height:1.34;color:#C2CBEA;max-width:830px;margin-bottom:38px">
    Computational physicist building GPU&#8209;accelerated<br>ML and simulation tools.
  </p>
  <div style="display:flex;gap:14px;align-items:center;flex-wrap:wrap">
    ${[['40+', 'engineers'], ['98%', 'accuracy'], ['75,000+', 'GPU hrs'], ['30,000+', 'observables']]
    .map(([v, l]) => `<div style="display:flex;align-items:baseline;gap:8px;padding:11px 18px;border:1px solid #ffffff26;border-radius:11px;background:#ffffff0A">
        <span class="mono" style="font-size:25px;font-weight:700;color:#fff">${v}</span>
        <span style="font-size:15px;color:#98A5CC">${l}</span></div>`).join('')}
  </div>
</div>
<div style="position:absolute;left:0;right:0;bottom:0;height:7px;z-index:3;
  background:linear-gradient(90deg, ${T.accent} 0%, ${T.a2} 52%, ${T.a3} 100%)"></div>`);

/* ─────────────────────────── project covers ─────────────────────────── */
const PROJECTS = [
  { slug: 'nimble-cover', n: '01', title: 'NIMBLE', sub: 'HAMR DCSNR Simulator · Western Digital', tags: ['Python', 'Dash', 'Plotly', 'Kubernetes'], hue: T.accent, glyph: 'pipeline' },
  { slug: 'tmd-pipeline-cover', n: '02', title: 'Lattice QCD TMD Pipeline', sub: 'GPU-accelerated symbolic regression at scale', tags: ['CUDA C++', 'PySR', 'SLURM'], hue: T.a2, glyph: 'lattice' },
  { slug: 'ai-datascience-lab-cover', n: '03', title: 'AI-DataScience-Lab', sub: 'Full-stack forecasting with GPT-3.5 summaries', tags: ['Flask', 'Azure', 'React'], hue: T.a3, glyph: 'chart' },
  { slug: 'haribot-cover', n: '04', title: 'HariBot', sub: 'AI chatbot answering questions about my research', tags: ['OpenAI API', 'Flask', 'Render'], hue: T.a1, glyph: 'chat' },
  { slug: 'wd-aquarius-cover', n: '05', title: 'WD Aquarius', sub: '“Wildest Idea” — WD Intern Summit 2026 Hackathon', tags: ['Three.js', 'WebGL', 'TypeScript'], hue: '#67E8F9', glyph: 'wave' },
  { slug: 'neural-network-cover', n: '06', title: 'Neural Network from Scratch', sub: 'Two-layer network in pure NumPy', tags: ['NumPy', 'Python'], hue: '#8FA4FF', glyph: 'net' },
  { slug: 'z2-lattice-cover', n: '07', title: 'Z₂ Lattice Gauge Monte Carlo', sub: 'Confinement via Wilson loop measurements', tags: ['Python', 'Monte Carlo'], hue: '#5EEAD4', glyph: 'grid' },
  { slug: 'latex-cv-cicd-cover', n: '08', title: 'Automated LaTeX CV CI/CD', sub: 'LaTeX → PDF → Pages on every push', tags: ['GitHub Actions', 'LaTeX', 'Bash'], hue: '#93A5D6', glyph: 'flow' },
];

const GLYPH = {
  pipeline: c => `<g stroke="${c}" stroke-width="3" fill="none">${[0, 1, 2, 3].map(i => `<rect x="${8 + i * 64}" y="86" width="48" height="46" rx="9" stroke-opacity="${(0.4 + i * 0.2).toFixed(2)}"/>`).join('')}${[0, 1, 2].map(i => `<path d="M${56 + i * 64} 109 h16" stroke-opacity=".6"/>`).join('')}</g>`,
  lattice: c => `<g stroke="${c}" fill="${c}">${[0, 1, 2, 3].map(i => [0, 1, 2, 3].map(j => `<circle cx="${34 + i * 66}" cy="${52 + j * 48}" r="5" fill-opacity=".85"/>`).join('')).join('')}${[0, 1, 2, 3].map(j => `<path d="M34 ${52 + j * 48} H232" stroke-opacity=".28" stroke-width="2"/>`).join('')}${[0, 1, 2, 3].map(i => `<path d="M${34 + i * 66} 52 V196" stroke-opacity=".28" stroke-width="2"/>`).join('')}</g>`,
  chart: c => `<g fill="${c}">${[70, 128, 96, 168, 140, 200].map((h, i) => `<rect x="${20 + i * 42}" y="${210 - h}" width="26" height="${h}" rx="5" fill-opacity="${0.35 + i * 0.11}"/>`).join('')}</g>`,
  chat: c => `<g fill="none" stroke="${c}" stroke-width="3"><rect x="16" y="46" width="168" height="98" rx="16" stroke-opacity=".85"/><path d="M52 144 v30 l34-30" stroke-opacity=".85"/><rect x="84" y="118" width="150" height="86" rx="16" stroke-opacity=".4"/></g>`,
  wave: c => `<g fill="none" stroke="${c}" stroke-width="3">${[0, 1, 2, 3].map(i => `<path d="M10 ${74 + i * 34} q40 -26 80 0 t80 0 t80 0" stroke-opacity="${0.85 - i * 0.17}"/>`).join('')}</g>`,
  grid: c => `<g stroke="${c}" stroke-width="2.5" fill="none">${[0, 1, 2, 3, 4].map(i => `<path d="M20 ${44 + i * 40} H236" stroke-opacity=".45"/>`).join('')}${[0, 1, 2, 3, 4].map(i => `<path d="M${20 + i * 54} 44 V204" stroke-opacity=".45"/>`).join('')}<rect x="74" y="84" width="108" height="80" stroke="${c}" stroke-width="4" stroke-opacity="1"/></g>`,
  flow: c => `<g stroke="${c}" fill="none" stroke-width="3">${[0, 1, 2].map(i => `<rect x="${20 + i * 78}" y="98" width="58" height="52" rx="10" stroke-opacity="${0.45 + i * 0.27}"/>`).join('')}<path d="M78 124 h20 M156 124 h20" stroke-opacity=".7"/><circle cx="220" cy="124" r="16" stroke-opacity=".9"/></g>`,
};

GLYPH.net = c => `<g stroke="${c}" fill="${c}">
  ${[0, 1, 2].map(l => { const ys = l === 1 ? [40, 88, 136, 184] : [64, 112, 160]; return ys.map(y => `<circle cx="${44 + l * 84}" cy="${y}" r="7" fill-opacity=".9"/>`).join(''); }).join('')}
  ${[0, 1].map(l => { const a = l === 0 ? [64, 112, 160] : [40, 88, 136, 184]; const b = l === 0 ? [40, 88, 136, 184] : [64, 112, 160]; return a.map(y1 => b.map(y2 => `<line x1="${44 + l * 84}" y1="${y1}" x2="${44 + (l + 1) * 84}" y2="${y2}" stroke-opacity=".22" stroke-width="1.6"/>`).join('')).join(''); }).join('')}
</g>`;

const cover = p => SHELL(1920, 1080, `
<div class="wrap" style="padding:120px 130px">
  <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:60px">
    <div style="flex:1;min-width:0">
      <div class="mono" style="font-size:22px;font-weight:700;letter-spacing:.2em;color:${p.hue};margin-bottom:34px">
        ${p.n} &nbsp;/&nbsp; PROJECT
      </div>
      <h1 style="font-size:${p.title.length > 22 ? 84 : 104}px;font-weight:800;letter-spacing:-.035em;line-height:1.02;margin-bottom:30px">
        ${p.title}
      </h1>
      <p style="font-size:38px;color:#B7C1E4;line-height:1.32;max-width:1080px;margin-bottom:52px">${p.sub}</p>
      <div style="display:flex;gap:16px;flex-wrap:wrap">
        ${p.tags.map(t => `<span class="mono" style="font-size:24px;padding:14px 26px;border:1px solid ${p.hue}59;border-radius:12px;background:${p.hue}14;color:${p.hue}">${t}</span>`).join('')}
      </div>
    </div>
    <div style="width:260px;height:250px;flex:none;opacity:.92">
      <svg width="260" height="250" viewBox="0 0 260 250" xmlns="http://www.w3.org/2000/svg">${GLYPH[p.glyph](p.hue)}</svg>
    </div>
  </div>
</div>
<div style="position:absolute;left:0;right:0;bottom:0;height:10px;z-index:3;
  background:linear-gradient(90deg, ${p.hue} 0%, ${p.hue}00 78%)"></div>`);

/* ───────────────────────────── favicon ───────────────────────────── */
const FAVICON = `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@800&display=block" rel="stylesheet">
<style>*{margin:0;box-sizing:border-box}html,body{width:512px;height:512px;overflow:hidden}
body{display:flex;align-items:center;justify-content:center;
background:linear-gradient(140deg,${T.brand} 0%,#141c52 100%);
font-family:'Inter',sans-serif;position:relative}
</style></head><body>
<div style="font-size:236px;font-weight:800;color:#fff;letter-spacing:-.06em;line-height:1">HR</div>
<div style="position:absolute;right:74px;bottom:96px;width:40px;height:40px;border-radius:50%;background:${T.accent}"></div>
</body></html>`;

/* ───────────────────────────── render ───────────────────────────── */
const shots = [
  { name: 'og/card.png', html: OG, w: 1200, h: 630 },
  { name: 'favicon-source.png', html: FAVICON, w: 512, h: 512 },
  ...PROJECTS.map(p => ({ name: `projects/${p.slug}.png`, html: cover(p), w: 1920, h: 1080 })),
];

const browser = await chromium.launch();
for (const s of shots) {
  const page = await browser.newPage({ viewport: { width: s.w, height: s.h }, deviceScaleFactor: 1 });
  await page.setContent(s.html, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(320);
  const file = path.join(OUT, s.name);
  await mkdir(path.dirname(file), { recursive: true });
  await page.screenshot({ path: file });
  await page.close();
  console.log('✓', s.name, `${s.w}×${s.h}`);
}
await browser.close();
console.log('\nDone →', OUT);
