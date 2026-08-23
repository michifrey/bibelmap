// Misst den Kontrast jedes sichtbaren Textes – über alle Ansichten hinweg.
//
//   npm run dev                          # in einem Fenster
//   node scripts/a11y-contrast.mjs       # in einem zweiten
//   node scripts/a11y-contrast.mjs http://localhost:4173
//
// Schwesterskript zu a11y-audit.mjs und aus demselben Anlass: dieselbe Sorte
// Fehler ist mir viermal begegnet, und jedes Mal war es eine Farbe, die aus
// einem anderen Zusammenhang übrig geblieben war – für die dunkle Bühne
// gedacht und auf Papier gelandet, als Fläche entworfen und als Schrift
// gesetzt. Im Bild sieht das nach „dezent" aus, in der Zahl nach 1,8:1.
//
// Gemessen wird nach WCAG 2: 4,5:1 für gewöhnlichen Text, 3:1 für großen
// (ab 24 px, oder ab 18,66 px fett). Der Vordergrund wird mit seiner
// Deckkraft über den aufgeschichteten Hintergrund gerechnet, damit
// `text-white/60` nicht als Weiß durchgeht.
//
// Drei Dinge, die dabei zählen und die mir bei den ersten Anläufen misslungen
// sind:
//
//   · Farben werden nicht gelesen, sondern gemalt. Tailwind v4 gibt jede
//     Farbe mit Deckkraft als `oklab(0.28 0.04 0.01 / 0.95)` aus. Ein
//     Zahlen-Regex hält 0.28 für einen Rotwert von 0 bis 255 und macht aus
//     jeder Tafel Fast-Schwarz – mein erster Lauf meldete 112 Stellen, und
//     keine einzige davon gab es. Jetzt malt ein 1×1-Zeichenfeld die Farbe
//     und liest das Pixel zurück; damit ist jede CSS-Schreibweise recht.
//   · Was hinter einem Vollbild-Modus liegt, wird nicht gemessen. Sonst
//     meldet das Skript die Seitenleiste, die niemand sieht.
//   · Absichtlich abgeblendete Zustände (opacity < 1) werden gezeigt, aber
//     als solche gekennzeichnet – sie sind eine Entscheidung, kein Versehen.
//
// Braucht Playwright, das das Projekt sonst nicht benutzt – deshalb kein
// npm-Skript, sondern ein Aufruf von Hand. Wo kein Browser mitgeliefert
// werden darf, sagt `CHROME_PATH=/pfad/zu/chrome`, wo einer liegt.

let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch {
  ({ chromium } = await import('playwright-core'));
}

const VIEWS = [
  '', '#karte', '#reise=exodus,2', '#mission=modern', '#quiz', '#lesen=Acts,13',
  '#stammbaum', '#graph', '#kirche', '#vergleich', '#hoeren', '#gelaende',
  '#heilsgeschichte', '#unterstuetzen', '#nachweise',
];

const measure = () => {
  /*
   * Die einzige verlässliche Art, eine CSS-Farbe in sRGB-Bytes zu bekommen:
   * sie malen und das Pixel zurücklesen. `copy` statt der üblichen
   * Überblendung, damit die Deckkraft erhalten bleibt statt sich mit dem
   * Untergrund zu verrechnen.
   */
  const cv = document.createElement('canvas');
  cv.width = 1;
  cv.height = 1;
  const cx = cv.getContext('2d', { willReadFrequently: true });
  cx.globalCompositeOperation = 'copy';
  const cache = new Map();
  const num = (css) => {
    if (cache.has(css)) return cache.get(css);
    // Ungültiges lässt `fillStyle` unverändert – ein Kennwert davor macht das
    // sichtbar, statt still die Farbe von vorhin weiterzubenutzen.
    cx.fillStyle = '#123456';
    cx.fillStyle = css;
    if (cx.fillStyle === '#123456' && css !== '#123456') {
      cache.set(css, []);
      return [];
    }
    cx.fillRect(0, 0, 1, 1);
    const d = cx.getImageData(0, 0, 1, 1).data;
    const out = [d[0], d[1], d[2], d[3] / 255];
    cache.set(css, out);
    return out;
  };
  const lum = ([r, g, b]) => {
    const f = (v) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const over = (fg, bg, alpha) => {
    const a = alpha ?? (fg[3] ?? 1);
    return [0, 1, 2].map((i) => fg[i] * a + bg[i] * (1 - a));
  };
  // Der wirkliche Hintergrund: alle deckenden und halbdeckenden Flächen der
  // Elternkette, von hinten nach vorne übereinandergelegt.
  const flatten = (el) => {
    const stack = [];
    let n = el;
    while (n) {
      const c = num(getComputedStyle(n).backgroundColor);
      if (c.length >= 3 && c[3] > 0) stack.push(c);
      n = n.parentElement;
    }
    let acc = [255, 255, 255];
    for (let i = stack.length - 1; i >= 0; i--) acc = over(stack[i], acc);
    return acc;
  };
  const inheritedOpacity = (el) => {
    let o = 1;
    let n = el;
    while (n) {
      const v = parseFloat(getComputedStyle(n).opacity);
      if (!Number.isNaN(v)) o *= v;
      n = n.parentElement;
    }
    return o;
  };

  const out = [];
  for (const el of document.querySelectorAll('body *')) {
    if (el.children.length) continue;                     // nur Blätter
    const text = (el.textContent ?? '').trim();
    if (!text) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 3 || r.height < 3) continue;
    if (r.bottom < 0 || r.top > innerHeight || r.right < 0 || r.left > innerWidth) continue;
    const st = getComputedStyle(el);
    if (st.visibility === 'hidden' || st.display === 'none') continue;

    // Wirklich zu sehen? Was hinter einem Vollbild-Modus liegt, zählt nicht.
    const cx = Math.min(innerWidth - 1, Math.max(0, r.left + r.width / 2));
    const cy = Math.min(innerHeight - 1, Math.max(0, r.top + r.height / 2));
    const top = document.elementFromPoint(cx, cy);
    if (!top || !(top === el || el.contains(top) || top.contains(el))) continue;

    const bg = flatten(el);
    const op = inheritedOpacity(el);
    const fgc = num(st.color);
    if (fgc.length < 3) continue;
    const fg = over(fgc, bg, (fgc[3] ?? 1) * op);
    const l1 = lum(fg);
    const l2 = lum(bg);
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

    const px = parseFloat(st.fontSize);
    const bold = parseInt(st.fontWeight, 10) >= 700;
    const gross = px >= 24 || (px >= 18.66 && bold);
    const min = gross ? 3 : 4.5;
    if (ratio + 0.005 >= min) continue;

    out.push({
      t: text.slice(0, 30),
      px: Math.round(px),
      w: st.fontWeight,
      r: Math.round(ratio * 100) / 100,
      min,
      dim: op < 0.999 ? Math.round(op * 100) : null,
      cls: (el.className?.toString?.() ?? '').slice(0, 48),
    });
  }
  // Gleiche Klasse + gleiche Größe ist derselbe Befund, nicht zwanzig.
  const seen = new Map();
  for (const x of out) {
    const key = x.cls + '|' + x.px + '|' + x.r;
    if (!seen.has(key)) seen.set(key, { ...x, n: 1 });
    else seen.get(key).n++;
  }
  return [...seen.values()].sort((a, b) => a.r - b.r);
};

const base = process.argv[2] ?? 'http://localhost:5173';
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
const ctx = await b.newContext({ viewport: { width: 1440, height: 950 }, locale: 'de-DE' });
const p = await ctx.newPage();
let total = 0;
let dimmed = 0;

for (const hash of VIEWS) {
  await p.goto(base + '/' + hash, { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(2600);
  const rows = await p.evaluate(measure);
  const hart = rows.filter((x) => !x.dim);
  const weich = rows.filter((x) => x.dim);
  total += hart.length;
  dimmed += weich.length;
  const label = (hash || '(Startseite)').padEnd(20);
  if (!rows.length) {
    console.log(label + 'alles lesbar');
    continue;
  }
  console.log(label + hart.length + ' zu schwach' + (weich.length ? ` (+${weich.length} abgeblendet)` : ''));
  for (const x of rows.slice(0, 6)) {
    console.log(
      '    ' + String(x.r).padStart(5) + ':1 statt ' + x.min + ':1  ' +
      String(x.px).padStart(3) + 'px/' + x.w +
      (x.dim ? '  @' + x.dim + '%' : '') +
      (x.n > 1 ? '  ×' + x.n : '') +
      '  „' + x.t + '"  ' + x.cls,
    );
  }
}

console.log();
console.log(total ? `${total} Stellen unter der Schwelle.` : 'Keine Stelle unter der Schwelle.');
if (dimmed) console.log(`${dimmed} weitere sind absichtlich abgeblendet – die sind eine Entscheidung, kein Versehen.`);
await b.close();
process.exit(total ? 1 : 0);
