// Prüft, ob jedes Bedienelement einen Namen hat und jede Grafik entweder
// benannt oder als Beiwerk gekennzeichnet ist – über alle Ansichten hinweg.
//
//   npm run dev                        # in einem Fenster
//   node scripts/a11y-audit.mjs        # in einem zweiten
//   node scripts/a11y-audit.mjs http://localhost:4173
//
// Kein Ersatz für einen Durchgang mit einem echten Screenreader, aber es
// fängt, was beim Bauen am leichtesten liegen bleibt: Icon-Knöpfe ohne Namen,
// Regler ohne Beschriftung, Zeichenflächen, die als leere Grafik vorgelesen
// werden. Braucht Playwright (`npm i -D playwright`), das das Projekt sonst
// nicht benutzt – deshalb kein npm-Skript, sondern ein Aufruf von Hand.

import { chromium } from 'playwright';
const audit = () => {
  const out = [];
  for (const el of document.querySelectorAll('button, a, [role=button], input, iframe, img, svg')) {
    if (el.classList.contains('leaflet-marker-icon')) continue;
    const tag = el.tagName.toLowerCase();
    if (tag === 'svg') { if (!el.hasAttribute('aria-hidden')) out.push('svg ohne aria-hidden'); continue; }
    if (tag === 'img' && el.getAttribute('alt') === '') continue;
    const name = (el.getAttribute('aria-label') || el.getAttribute('title') || el.getAttribute('alt') || el.textContent || '').trim();
    if (!name) out.push(tag + '.' + (el.className.toString().slice(0, 36) || '(ohne Klasse)'));
  }
  return out;
};
const base = process.argv[2] ?? 'http://localhost:5173';
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 950 }, locale: 'de-DE' });
const p = await ctx.newPage();
const errs = [];
let offen = 0;
p.on('pageerror', (e) => errs.push(e.message));
for (const hash of ['', '#karte', '#reise=exodus,2', '#mission=modern', '#quiz', '#lesen=Acts,13', '#stammbaum', '#graph', '#kirche', '#vergleich', '#hoeren', '#heilsgeschichte', '#unterstuetzen']) {
  await p.goto(base + '/' + hash, { waitUntil: 'networkidle' });
  await p.waitForTimeout(2200);
  const r = await p.evaluate(audit);
  if (r.length) offen += r.length;
  console.log((hash || '(Startseite)').padEnd(20), r.length ? r.length + ' offen: ' + [...new Set(r)].slice(0, 4).join(' · ') : 'alles benannt');
}
console.log('Konsolenfehler:', [...new Set(errs)].slice(0, 4));
await b.close();
process.exit(offen ? 1 : 0);
