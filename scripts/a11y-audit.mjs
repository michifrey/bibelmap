// Prüft dreierlei über alle Ansichten hinweg: ob jedes Bedienelement einen
// Namen hat (und einen deutschen), ob auf Telefonbreite alles im Bild liegt,
// und ob man mit der Tastatur allein zur Navigation kommt.
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
const ANSICHTEN = ['', '#karte', '#reise=exodus,2', '#mission=modern', '#quiz', '#lesen=Acts,13', '#stammbaum', '#graph', '#kirche', '#vergleich', '#hoeren', '#weg=a15257a,a112427', '#gelaende', '#heilsgeschichte', '#unterstuetzen'];
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

// Dritter Durchgang: mit der Tastatur allein.
//
// Der Kontrast wird geprüft, die Namen werden geprüft, die Erreichbarkeit auch
// – aber ob jemand ohne Maus überhaupt zur Navigation kommt, hat lange niemand
// gemessen. Auf der Karte lag die Kopfzeile im Quelltext hinter Zeitleiste,
// Markern und Ortsliste: das 205. von 208 ansteuerbaren Elementen, 208
// Tabulatorschritte, bis sie den Fokus hatte. Sichtbar ist das nie, spürbar
// sofort.
//
// Geprüft wird darum zweierlei, beides schlicht:
//   1. Wie viele Tabulatorschritte liegen zwischen Seitenanfang und Kopfzeile?
//   2. Setzt jede Sprungmarke den Fokus wirklich – und nicht ins Leere?
const MAX_WEG = 6;

/** Zurück an den Seitenanfang, ohne neu zu laden. */
const anfang = () =>
  p.evaluate(() => {
    const nav = document.getElementById('sprungmarken');
    if (nav) nav.focus({ preventScroll: true });
    else document.body.focus();
  });

const fokus = () =>
  p.evaluate(() => {
    const el = document.activeElement;
    if (!el || el === document.body) return { leer: true };
    return {
      leer: false,
      marke: !!el.closest('#sprungmarken'),
      imKopf: !!el.closest('header'),
      name: (el.getAttribute('aria-label') || el.getAttribute('placeholder') || el.textContent || el.tagName).trim().slice(0, 24),
    };
  });

console.log('\nMit der Tastatur allein – wie weit ist es zur Navigation?');
await p.setViewportSize({ width: 1440, height: 950 });
for (const hash of ANSICHTEN) {
  await p.goto(base + '/' + hash, { waitUntil: 'networkidle' });
  await p.waitForTimeout(2200);
  const funde = [];

  // 1. Weg zur Kopfzeile – gezählt wird jeder Tastendruck, den ein Mensch
  //    tatsächlich tut. Wer auf eine Sprungmarke gerät, nimmt sie: dafür sind
  //    sie da. Ohne sie sind es auf der Karte über 200.
  await anfang();
  let weg = 0;
  for (let i = 0; i < 80 && !weg; i++) {
    await p.keyboard.press('Tab');
    let f = await fokus();
    weg++;
    if (!f.leer && f.marke) {
      await p.keyboard.press('Enter');
      await p.waitForTimeout(200);
      f = await fokus();
      weg++;
    }
    if (!f.leer && f.imKopf) break;
    if (weg >= 80) weg = 0;
  }
  if (!weg) funde.push('Kopfzeile in 80 Tastendrücken nicht erreicht');
  else if (weg > MAX_WEG) funde.push(`${weg} Tastendrücke bis zur Kopfzeile`);

  // 2. Sprungmarken: greift jede?
  let marken = 0;
  for (let n = 1; n <= 4; n++) {
    await anfang();
    for (let i = 0; i < n; i++) await p.keyboard.press('Tab');
    const m = await fokus();
    if (m.leer || !m.marke) break;
    marken++;
    await p.keyboard.press('Enter');
    await p.waitForTimeout(250);
    const ziel = await fokus();
    if (ziel.leer) funde.push(`„${m.name}" verliert den Fokus`);
    else if (ziel.marke) funde.push(`„${m.name}" springt nirgendwohin`);
  }

  if (funde.length) offen += funde.length;
  console.log(
    (hash || '(Startseite)').padEnd(20),
    funde.length ? funde.join(' · ') : `${weg} Tastendrücke zur Kopfzeile, ${marken} Sprungmarken greifen`,
  );
}

console.log('Konsolenfehler:', [...new Set(errs)].slice(0, 4));
await b.close();
process.exit(offen ? 1 : 0);
