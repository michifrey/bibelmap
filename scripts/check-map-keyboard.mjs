// Prüft, dass unbewegliche Kartenmarker auch aus der Tabreihenfolge sind.
//
//   node scripts/check-map-keyboard.mjs
//   npm run check:map-keyboard
//   npm run check:map-keyboard -- --gegenprobe
//
// **Der Fehler, der diese Prüfung ausgelöst hat.** Bei Leaflet sind
// `interactive` und `keyboard` zwei **unabhängige** Optionen. Wer nur
// `interactive: false` setzt, bekommt trotzdem `tabindex="0"` und
// `role="button"` am Element: Der Marker ist per Maus tot, liegt aber weiter
// in der Tabreihenfolge – als Schaltfläche ohne Namen. Ein Tastaturnutzer
// landet darauf und hört „Schaltfläche".
//
// Genau das war der Punkt, der in `RouteMap` die Reise entlangläuft. Acht
// andere unbewegliche Marker der App setzen beides; einer hatte es vergessen.
// Die Redewendung stand also schon im Projekt – sie war nur an einer Stelle
// nicht durchgehalten.
//
// Geprüft wird der Quelltext, nicht der Browser: Die Regel ist eine Frage der
// Aufrufoptionen, und so läuft die Prüfung in `npm run check` mit, ohne
// Playwright und ohne gebautes `dist/`.
//
// Nur `L.marker` – Polylinien und Kreise haben keine `keyboard`-Option;
// sie hier zu verlangen wäre ein Fehlalarm.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const gegenprobe = process.argv.includes('--gegenprobe');

/** Alle .ts/.tsx unter src/, flach eingesammelt. */
function dateien(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...dateien(p));
    else if (/\.tsx?$/.test(e.name)) out.push(p);
  }
  return out;
}

/** Der vollständige Aufruf ab `L.marker(` bis zur schliessenden Klammer. */
function aufrufe(quelle) {
  const out = [];
  for (const m of quelle.matchAll(/L\.marker\(/g)) {
    let tiefe = 0;
    let j = m.index + m[0].length - 1;
    while (j < quelle.length) {
      if (quelle[j] === '(') tiefe++;
      else if (quelle[j] === ')') { tiefe--; if (tiefe === 0) break; }
      j++;
    }
    out.push({ block: quelle.slice(m.index, j + 1), zeile: quelle.slice(0, m.index).split('\n').length });
  }
  return out;
}

const fehler = [];
let geprueft = 0;
let unbeweglich = 0;

const quellen = dateien(path.join(ROOT, 'src')).map((f) => ({ f, s: fs.readFileSync(f, 'utf8') }));
if (gegenprobe) {
  // Ein erfundener Aufruf, der genau den echten Fehler nachstellt.
  quellen.push({
    f: path.join(ROOT, 'src/GEGENPROBE.tsx'),
    s: "const m = L.marker([0, 0], {\n  icon: schmuck,\n  interactive: false,\n  zIndexOffset: 1,\n});\n",
  });
}

for (const { f, s } of quellen) {
  for (const { block, zeile } of aufrufe(s)) {
    geprueft++;
    if (!/interactive:\s*false/.test(block)) continue;
    unbeweglich++;
    if (!/keyboard:\s*false/.test(block)) {
      fehler.push(
        `${path.relative(ROOT, f)}:${zeile}: L.marker mit interactive: false, aber ohne keyboard: false – ` +
          `Leaflet setzt dann trotzdem tabindex="0" und role="button".`,
      );
    }
  }
}

if (gegenprobe) {
  const getroffen = fehler.filter((x) => x.includes('GEGENPROBE.tsx'));
  const echte = fehler.filter((x) => !x.includes('GEGENPROBE.tsx'));
  console.log(`Gegenprobe: eingebauter Fehler ${getroffen.length === 1 ? 'gefunden' : 'NICHT gefunden'}.`);
  if (echte.length) console.log(`  ⚠ dazu ${echte.length} echte Beanstandung(en) – die gehören in den normalen Lauf.`);
  console.log(getroffen.length === 1 && !echte.length ? '✓ Die Prüfung schlägt an, und nur dort.' : '✗ Die Prüfung belegt nicht, was sie soll.');
  process.exit(getroffen.length === 1 && !echte.length ? 0 : 1);
}

if (fehler.length) {
  console.error(`✗ ${fehler.length} Beanstandung${fehler.length === 1 ? '' : 'en'}:\n`);
  for (const x of fehler) console.error('  · ' + x);
  console.error('\n  Unbewegliche Marker gehören nicht in die Tabreihenfolge: `keyboard: false` daneben.');
  process.exit(1);
}

console.log(
  `✓ ${geprueft} Kartenmarker im Quelltext, ${unbeweglich} davon unbeweglich – ` +
    `alle auch aus der Tabreihenfolge genommen.`,
);
