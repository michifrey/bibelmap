// Prüft die Stammesgrenzen gegen Orte, deren Stamm die Bibel selbst nennt.
//
//   node scripts/check-tribes.mjs
//
// `tribeAt()` beantwortet auf jeder Ortskarte die Frage „in wessen Gebiet liegt
// dieser Ort?". Das ist eine Behauptung, keine Verzierung: Wer die Ringe in
// `src/data/tribes.ts` anfasst – und das passiert, sie sind von Hand gezeichnet –,
// verschiebt damit auch diese Antwort, ohne es zu sehen.
//
// Die Liste unten sind Orte, deren Zugehörigkeit im Text steht (Jos 15–19,
// Jos 21, Ri 1) oder unstrittig ist, dazu vier, die ausdrücklich zu KEINEM
// Stamm gehören: Tyrus und Sidon blieben phönizisch, Damaskus aramäisch, Sela
// edomitisch. Ein Ring, der die vier verschluckt, ist zu großzügig gezeichnet.
//
// Die Ringe werden aus der Quelldatei gelesen statt importiert, damit das
// Skript ohne Übersetzungsschritt läuft – wie check-contrast.mjs.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'src/data/tribes.ts');

/* --- Ringe aus der Quelle lesen ------------------------------------------ */

function readRings() {
  const text = fs.readFileSync(SRC, 'utf8');
  const rings = [];
  // Jeder Eintrag beginnt mit `id: '…'`; sein `polygon:` gehört ihm bis zum
  // nächsten `id:`. Levi hat keins und fällt damit von selbst heraus.
  const parts = text.split(/\n {4}id: '/).slice(1);
  for (const part of parts) {
    const id = part.slice(0, part.indexOf("'"));
    const de = (part.match(/\n {4}de: '([^']*)'/) ?? [])[1] ?? id;
    const poly = part.match(/\n {4}polygon: \[([\s\S]*?)\n {4}\],/);
    if (!poly) continue;
    const ring = [...poly[1].matchAll(/\[\s*(-?[\d.]+),\s*(-?[\d.]+)\s*\]/g)].map((m) => [
      Number(m[1]),
      Number(m[2]),
    ]);
    if (ring.length >= 3) rings.push({ id, de, ring });
  }
  return rings;
}

/** Dasselbe Strahlenverfahren wie `tribeAt()` in src/data/tribes.ts. */
function tribeAt(rings, lat, lon) {
  for (const t of rings) {
    let inside = false;
    const r = t.ring;
    for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
      const [yi, xi] = r[i];
      const [yj, xj] = r[j];
      if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside;
    }
    if (inside) return t;
  }
  return null;
}

/* --- Die Fälle ----------------------------------------------------------- */

const CASES = [
  ['Jerusalem', 31.7784, 35.2354, 'Benjamin', 'Jos 18,28'],
  ['Bet-El', 31.9308, 35.2222, 'Benjamin', 'Jos 18,22'],
  ['Jericho', 31.8707, 35.4437, 'Benjamin', 'Jos 18,21'],
  ['Hebron', 31.5326, 35.0998, 'Juda', 'Jos 15,54'],
  ['Bethlehem', 31.7054, 35.2024, 'Juda', 'Ri 17,7'],
  ['Beerscheba', 31.2518, 34.7913, 'Simeon', 'Jos 19,2'],
  ['Gaza', 31.52, 34.45, 'Simeon', 'Jos 19,1-9'],
  ['Sichem', 32.2137, 35.2811, 'Manasse (West)', 'Jos 17,7'],
  ['Megiddo', 32.5847, 35.1839, 'Manasse (West)', 'Jos 17,11'],
  ['Silo', 32.0556, 35.2894, 'Ephraim', 'Jos 16'],
  ['Jafo', 32.054, 34.752, 'Dan', 'Jos 19,46'],
  ['Nazaret', 32.7019, 35.2975, 'Sebulon', 'Jos 19,10-16'],
  ['Kapernaum', 32.8808, 35.575, 'Naftali', 'Mt 4,13'],
  ['Hazor', 33.02, 35.57, 'Naftali', 'Jos 19,36'],
  ['Laisch (Dan)', 33.2487, 35.6521, 'Naftali', 'Ri 18,29'],
  ['Bet-Schean', 32.4997, 35.4989, 'Issachar', 'Jos 17,11'],
  ['Akko', 32.92, 35.08, 'Asser', 'Ri 1,31'],
  ['Heschbon', 31.8, 35.81, 'Ruben', 'Jos 13,17'],
  ['Mahanajim', 32.28, 35.68, 'Gad', 'Jos 13,26'],
  ['Aschtarot', 32.8, 36.01, 'Manasse (Ost)', 'Jos 13,31'],
  // Blieb ausdrücklich außerhalb Israels:
  ['Tyrus', 33.271, 35.203, null, 'Jos 19,29 – Grenze, nicht Gebiet'],
  ['Sidon', 33.56, 35.37, null, 'Ri 1,31'],
  ['Damaskus', 33.51, 36.3, null, 'aramäisch'],
  ['Sela', 30.3285, 35.4444, null, 'edomitisch'],
];

/* --- Lauf ---------------------------------------------------------------- */

const rings = readRings();
if (rings.length < 13) {
  console.error(`Nur ${rings.length} Ringe gelesen – erwartet 13. Ist das Format von tribes.ts anders?`);
  process.exit(2);
}

const wrong = [];
for (const [name, lat, lon, want, why] of CASES) {
  const got = tribeAt(rings, lat, lon)?.de ?? null;
  if (got !== want) {
    wrong.push(`${name}: ${got ?? 'kein Gebiet'} statt ${want ?? 'kein Gebiet'} (${why})`);
  }
}

console.log(`${rings.length} Gebiete, ${CASES.length} Orte geprüft.`);
if (wrong.length) {
  console.error('\nGrenzen stimmen nicht mit dem Text überein:');
  for (const w of wrong) console.error('  · ' + w);
  process.exit(1);
}
console.log('Jeder Ort liegt in dem Gebiet, das die Bibel ihm gibt.');
