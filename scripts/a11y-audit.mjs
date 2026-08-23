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

/**
 * Namen, die eine fremde Bibliothek mitbringt und die in einer deutschen
 * Oberfläche stehen bleiben, wenn niemand sie übersetzt: Leaflet sagt „Zoom
 * in", MapLibre „Map". Ein Name ist da – nur in der falschen Sprache, und
 * genau das übersieht eine Prüfung, die bloß zählt, ob ein Name existiert.
 */
const FREMDE_NAMEN = /^(Zoom in|Zoom out|Close popup|Map|Map marker|Layers|Marker|Reset bearing|Find my location|Enable terrain|Disable terrain)$/i;

/**
 * Zweiter Blick, auf Telefonbreite: liegt ein Bedienelement außerhalb des
 * Bildes? Das ist keine Frage des Aussehens – ein „Beenden", das 116 Pixel
 * rechts danebensteht, lässt sich nicht drücken. Gefunden wurde genau das in
 * drei Vollbild-Modi, jahrelang unbemerkt.
 *
 * Was in einem seitlich scrollbaren Streifen liegt, zählt nicht: durch eine
 * Reihe von Ortsmarken wischt man, das ist Absicht.
 */
const kanten = (breite) => {
  const out = [];
  for (const el of document.querySelectorAll('button, a[href], input, select')) {
    const box = el.getBoundingClientRect();
    if (box.width === 0 || box.height === 0) continue;
    const st = getComputedStyle(el);
    if (st.visibility === 'hidden' || st.display === 'none') continue;
    const rechts = Math.round(box.right - breite);
    const links = Math.round(-box.left);
    if (rechts <= 1 && links <= 1) continue;
    let scrollbar = false;
    for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
      const ov = getComputedStyle(a).overflowX;
      if ((ov === 'auto' || ov === 'scroll') && a.scrollWidth > a.clientWidth + 1) {
        scrollbar = true;
        break;
      }
    }
    if (scrollbar) continue;
    const name = (el.getAttribute('aria-label') || el.textContent || el.tagName).trim().slice(0, 20);
    out.push(`außerhalb: „${name}" ${rechts > 1 ? rechts + ' px rechts' : links + ' px links'}`);
  }
  return [...new Set(out)];
};

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
  // Zweiter Durchgang: benannt, aber englisch. Die Leinwand der Geländekarte
  // trägt ihren Namen ebenfalls als aria-label, deshalb hier auch canvas.
  for (const el of document.querySelectorAll('[aria-label], [title], canvas')) {
    const name = (el.getAttribute('aria-label') || el.getAttribute('title') || '').trim();
    if (name && window.__FREMD.test(name)) out.push('englisch: „' + name + '"');
  }
  return out;
};
const base = process.argv[2] ?? 'http://localhost:5173';
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 950 }, locale: 'de-DE' });
const p = await ctx.newPage();
await p.addInitScript((quelle) => {
  window.__FREMD = new RegExp(quelle, 'i');
}, FREMDE_NAMEN.source);
const errs = [];
let offen = 0;
p.on('pageerror', (e) => errs.push(e.message));
const ANSICHTEN = ['', '#karte', '#reise=exodus,2', '#mission=modern', '#quiz', '#lesen=Acts,13', '#stammbaum', '#graph', '#kirche', '#vergleich', '#hoeren', '#gelaende', '#heilsgeschichte', '#unterstuetzen'];
for (const hash of ANSICHTEN) {
  await p.goto(base + '/' + hash, { waitUntil: 'networkidle' });
  await p.waitForTimeout(2200);
  const r = await p.evaluate(audit);
  if (r.length) offen += r.length;
  console.log((hash || '(Startseite)').padEnd(20), r.length ? r.length + ' offen: ' + [...new Set(r)].slice(0, 4).join(' · ') : 'alles benannt');
}

// Zweiter Durchgang auf Telefonbreite: was ragt aus dem Bild?
console.log('\nAuf 390 Pixeln – liegt alles im Bild?');
await p.setViewportSize({ width: 390, height: 844 });
for (const hash of ANSICHTEN) {
  await p.goto(base + '/' + hash, { waitUntil: 'networkidle' });
  await p.waitForTimeout(2200);
  const r = await p.evaluate(kanten, 390);
  if (r.length) offen += r.length;
  console.log((hash || '(Startseite)').padEnd(20), r.length ? r.length + ' offen: ' + r.slice(0, 3).join(' · ') : 'alles im Bild');
}
console.log('Konsolenfehler:', [...new Set(errs)].slice(0, 4));
await b.close();
process.exit(offen ? 1 : 0);
