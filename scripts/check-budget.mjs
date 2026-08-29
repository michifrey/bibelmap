// Wacht über das, was der Browser vor dem ersten Bild holen muss.
//
//   npm run build                 (hängt als `postbuild` daran)
//   npm run check:budget          (von Hand, braucht ein fertiges `dist/`)
//
// Nicht in `npm run check`: das läuft in der CI **vor** dem Build, und ohne
// `dist/` gibt es nichts zu messen. Als `postbuild` sitzt die Prüfung an der
// einzigen Stelle, an der die Zahlen existieren – und hält die
// Veröffentlichung auf, wenn sie nicht stimmen.
//
// Warum das nötig ist: Diese Zahlen sind mühsam gesunken – 720 kB JavaScript
// auf 325, das Stylesheet von 22 auf 15 kB gzip, die Ortsdaten von 215 auf
// 109. Jede einzelne Verbesserung war ein Import, der an der falschen Stelle
// stand. Ein neuer Import an einer falschen Stelle macht sie rückgängig, und
// zwar lautlos: nichts wird kaputt, die Seite wird nur wieder langsam.
//
// Geprüft wird, was `dist/index.html` referenziert – die Kette, die der
// Browser abarbeitet, bevor er etwas zeigt. Nicht die Summe aller Bündel: die
// Ansichten kommen auf Abruf, und das soll so bleiben.

import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');

/*
 * Die Grenzen. Sie liegen bewusst dicht über dem Gemessenen: Ein Puffer, in
 * den man dreimal hineinwachsen kann, ist keine Grenze, sondern eine
 * Einladung. Wer sie hebt, soll das im Diff begründen müssen.
 */
const GRENZEN = {
  'JavaScript (roh)': { ist: (b) => b.js, max: 360 * 1024 },
  'CSS (gzip)': { ist: (b) => b.cssGz, max: 18 * 1024 },
  'Ortsdaten (gzip)': { ist: (b) => b.placesGz, max: 130 * 1024 },
};

if (!fs.existsSync(path.join(DIST, 'index.html'))) {
  console.error('✗ Kein dist/ – `npm run build` zuerst.');
  process.exit(1);
}

const html = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');
const referenziert = [...new Set([...html.matchAll(/(?:href|src)="\/?([^"]+\.(?:js|css))"/g)].map((m) => m[1]))];

if (referenziert.length < 2) {
  console.error(`✗ Nur ${referenziert.length} Dateien in index.html gefunden – die Prüfung liest die falsche Datei.`);
  process.exit(1);
}

const gz = (p) => zlib.gzipSync(fs.readFileSync(p), { level: 9 }).length;
let js = 0;
let cssGz = 0;
for (const rel of referenziert) {
  const datei = path.join(DIST, rel.replace(/^\//, ''));
  if (!fs.existsSync(datei)) continue;
  if (datei.endsWith('.js')) js += fs.statSync(datei).size;
  else cssGz += gz(datei);
}
const placesDatei = path.join(DIST, 'data/places.json');
const placesGz = fs.existsSync(placesDatei) ? gz(placesDatei) : 0;

const ist = { js, cssGz, placesGz };
const kB = (n) => (n / 1024).toFixed(1) + ' kB';

let ueber = 0;
for (const [name, g] of Object.entries(GRENZEN)) {
  const wert = g.ist(ist);
  const ok = wert <= g.max;
  if (!ok) ueber++;
  console.log(`  ${ok ? '·' : '✗'} ${name.padEnd(20)} ${kB(wert).padStart(10)}  von höchstens ${kB(g.max)}`);
}

if (ueber) {
  console.error(`\n✗ ${ueber} Grenze${ueber === 1 ? '' : 'n'} überschritten.`);
  console.error('  Meist ist es ein Import, der in eine Datei gewandert ist, die jeder lädt.');
  console.error('  `BIBELMAP_SOURCEMAP=1 npm run build` und die Sourcemaps sagen, welcher.');
  process.exit(1);
}
console.log(
  `\nErster Aufruf: ${kB(js)} JavaScript und ${kB(cssGz)} CSS (gzip) aus ${referenziert.length} Dateien, dazu ${kB(placesGz)} Ortsdaten.`,
);
