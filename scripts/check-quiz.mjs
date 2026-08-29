// Prüft die erzeugten Quizfragen gegen ihre eigenen Regeln.
//
//   npm run check:quiz
//
// Die Wissensfragen entstehen zur Laufzeit aus den Daten – niemand hat sie
// geschrieben, niemand liest sie gegen. Bei „Welcher dieser Orte lag auf dem
// Weg?" ist das heikel: die richtige Antwort muss nah an der Luftlinie der
// Etappe liegen, die drei falschen weit genug weg. Ein Ort zwanzig Kilometer
// daneben wäre keine falsche Antwort, sondern eine strittige.
//
// Beim ersten Lauf fand diese Prüfung genau so einen Fehler: die richtige
// Antwort lag je nach gemeintem Ort 8 km oder 134 km neben der Linie, weil es
// „Karmel" zweimal gibt – am Meer und in Juda. Seitdem kommen nur Namen in
// Frage, die genau einen Ort bezeichnen.
//
// Gelesen wird der echte Code, nicht eine Nachbildung: `scripts/lib/ts-loader.mjs`
// erlaubt Node, `src/lib/quiz.ts` samt allem, was daran hängt, zu importieren.
// Eine Prüfung, die die Regeln zum zweiten Mal aufschreibt, prüft am Ende sich
// selbst.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const { buildRound } = await import(path.join(ROOT, 'src/lib/quiz.ts'));
const { JOURNEYS } = await import(path.join(ROOT, 'src/data/journeys.ts'));
const { expandPlaces } = await import(path.join(ROOT, 'src/lib/places.ts'));
const roh = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/data/places.json'), 'utf8'));
const PLACES = expandPlaces(roh);

const RUNDEN = 400;
/** Wie nah die richtige Antwort an der Linie liegen muss (wie in `along.ts`). */
const MAX_QUER = 8;
/** Wie weit eine falsche Antwort mindestens weg sein muss. */
const MIN_QUER_FALSCH = 60;
const MIN_ABSTAND_FALSCH = 100;

function distanceKm(a, b) {
  const R = 6371;
  const r = (x) => (x * Math.PI) / 180;
  const dLat = r(b[0] - a[0]);
  const dLon = r(b[1] - a[1]);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.sin(dLon / 2) ** 2 * Math.cos(r(a[0])) * Math.cos(r(b[0]));
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Querabstand eines Punktes zur Strecke a–b, in Kilometern. */
function quer(a, b, p) {
  const kx = 111.32 * Math.cos((((a[0] + b[0]) / 2) * Math.PI) / 180);
  const ky = 111.32;
  const ax = a[1] * kx;
  const ay = a[0] * ky;
  const dx = b[1] * kx - ax;
  const dy = b[0] * ky - ay;
  const l2 = dx * dx + dy * dy;
  if (l2 === 0) return distanceKm(a, p);
  const t = Math.max(0, Math.min(1, ((p[1] * kx - ax) * dx + (p[0] * ky - ay) * dy) / l2));
  return Math.hypot(p[1] * kx - (ax + dx * t), p[0] * ky - (ay + dy * t));
}

/*
 * Ein Stationsname taugt nicht als Schlüssel: „Sukkot" liegt im Auszug in
 * Ägypten und bei Jakobs Heimkehr im Jordantal. Gesucht wird das Etappenpaar –
 * zwei aufeinanderfolgende Stationen derselben Reise.
 */
const ETAPPEN = new Map();
for (const j of JOURNEYS) {
  for (let k = 1; k < j.stops.length; k++) {
    const key = `${j.stops[k - 1].de}→${j.stops[k].de}`;
    if (!ETAPPEN.has(key)) ETAPPEN.set(key, []);
    ETAPPEN.get(key).push([
      [j.stops[k - 1].lat, j.stops[k - 1].lon],
      [j.stops[k].lat, j.stops[k].lon],
    ]);
  }
}

/** Wie die App: eine angehängte Zahl gehört zur Kennung, nicht zum Namen. */
const zeige = (p) => (p.nameDe ? p.nameDe : p.name).replace(/ \d+$/, '');
const proName = new Map();
for (const p of PLACES) {
  const n = zeige(p);
  if (!proName.has(n)) proName.set(n, []);
  proName.get(n).push(p);
}

const funde = [];
let wegfragen = 0;
let ungeprueft = 0;

for (let i = 0; i < RUNDEN; i++) {
  for (const q of buildRound(PLACES, 'hard', true, 'de', 8)) {
    if (q.kind !== 'choice' || !/lag auf dem Weg/.test(q.prompt)) continue;
    wegfragen++;
    const m = /^Von (.+) nach (.+)$/.exec(q.subject);
    const paare = m ? ETAPPEN.get(`${m[1]}→${m[2]}`) : null;
    if (!paare?.length) {
      ungeprueft++;
      continue;
    }
    if (new Set(q.options).size !== 4) funde.push(`doppelte Antwort: ${q.subject}`);
    q.options.forEach((name, k) => {
      const kandidaten = proName.get(name) ?? [];
      if (kandidaten.length === 0) return funde.push(`Ort unbekannt: ${name}`);
      if (kandidaten.length > 1) return funde.push(`mehrdeutiger Name: ${name}`);
      const p = [kandidaten[0].lat, kandidaten[0].lon];
      // Trägt eine Reise die Etappe mehrfach, genügt ein passendes Paar.
      const werte = paare.map(([a, b]) => ({
        quer: quer(a, b, p),
        nah: Math.min(distanceKm(a, p), distanceKm(b, p)),
      }));
      if (k === q.answer) {
        if (!werte.some((w) => w.quer <= MAX_QUER + 0.05)) {
          const min = Math.min(...werte.map((w) => w.quer));
          funde.push(`richtige Antwort ${name} liegt ${min.toFixed(1)} km daneben (${q.subject})`);
        }
      } else if (!werte.some((w) => w.quer >= MIN_QUER_FALSCH && w.nah > MIN_ABSTAND_FALSCH)) {
        funde.push(`falsche Antwort ${name} liegt zu nah (${q.subject})`);
      }
    });
  }
}

// Eine Prüfung, die nichts zu prüfen fand, hat nichts geprüft.
if (wegfragen < RUNDEN / 4) {
  console.error(`✗ Nur ${wegfragen} Wegfragen in ${RUNDEN} Runden – die Frageart kommt kaum vor.`);
  process.exit(1);
}
if (ungeprueft > wegfragen / 10) {
  console.error(`✗ ${ungeprueft} von ${wegfragen} Wegfragen ließen sich keiner Etappe zuordnen.`);
  process.exit(1);
}

const eindeutig = [...new Set(funde)];
if (eindeutig.length) {
  console.error(`✗ ${eindeutig.length} Verstöße in ${wegfragen} Wegfragen:`);
  for (const f of eindeutig.slice(0, 10)) console.error('   ' + f);
  process.exit(1);
}

console.log(
  `${wegfragen} Wegfragen aus ${RUNDEN} Runden geprüft: richtige Antwort je ≤ ${MAX_QUER} km neben der Linie, falsche je ≥ ${MIN_QUER_FALSCH} km und > ${MIN_ABSTAND_FALSCH} km von beiden Stationen.`,
);
