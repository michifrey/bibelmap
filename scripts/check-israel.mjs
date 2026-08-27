// Prüft die Israel-Karte auf das, was sie über sich selbst behauptet.
//
//   npm run check:israel
//
// Der Modus zeigt Gebiete, Kriege und Zahlen zu einem Gegenstand, über den mehr
// Falsches umläuft als über die meisten. Die Behauptung, mit der er antritt,
// steht im Kopf von `src/data/israel.ts`: jedes Ereignis nennt eine Quelle,
// jede Zahl nennt die Stelle, die sie erhebt, und den Stand, auf den sie sich
// bezieht. Eine Behauptung, die niemand nachprüft, hält nicht lange.
//
// Geprüft wird:
//   1. Jedes Ereignis hat mindestens eine Quelle, und jede Kennung gibt es.
//   2. Jede Zahl hat Quelle UND Stand – keine nackten Zahlen.
//   3. Die Ereignisse stehen in zeitlicher Reihenfolge (der Regler zählt darauf).
//   4. Jeder Verweis auf einen Gebietsstand trifft einen, den es gibt.
//   5. Jede Fläche hat mindestens drei Punkte und liegt im Kartenausschnitt.
//   6. Jeder Abschnitt trägt Ereignisse, und jedes Ereignis liegt in seinem.
//   7. Beide Sprachen sind gefüllt – kein deutscher Text im englischen Feld.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { EVENTS, SOURCE_BY_ID, ERAS, ERA_BY_ID } = await import(path.join(ROOT, 'src/data/israel.ts'));
const { SNAPSHOT_BY_ID, SNAPSHOTS } = await import(path.join(ROOT, 'src/data/israelGeo.ts'));

const fehler = [];
const warn = (m) => fehler.push(m);

/* --- 1./2. Belege ------------------------------------------------------- */
let zahlen = 0;
for (const e of EVENTS) {
  if (!e.sources?.length) warn(`${e.id}: keine Quelle`);
  for (const s of e.sources ?? []) {
    if (!SOURCE_BY_ID[s]) warn(`${e.id}: Quelle „${s}" gibt es nicht`);
  }
  for (const f of e.figures ?? []) {
    zahlen++;
    if (!f.source) warn(`${e.id}: Zahl „${f.label.de}" ohne Quelle`);
    else if (!SOURCE_BY_ID[f.source]) warn(`${e.id}: Zahl „${f.label.de}" nennt Quelle „${f.source}", die es nicht gibt`);
    if (!f.asOf || !f.asOf.trim()) warn(`${e.id}: Zahl „${f.label.de}" ohne Stand`);
    // Eine Zahl, die nur die eigene Quelle nennt, aber nicht in der Quellenliste
    // des Ereignisses steht, ist von der Karte aus nicht anklickbar.
    if (f.source && !e.sources?.includes(f.source)) {
      warn(`${e.id}: Quelle „${f.source}" der Zahl fehlt in der Quellenliste des Ereignisses`);
    }
  }
}

/* --- 3. Reihenfolge ----------------------------------------------------- */
for (let i = 1; i < EVENTS.length; i++) {
  if (EVENTS[i].year < EVENTS[i - 1].year) {
    warn(`${EVENTS[i].id} (${EVENTS[i].year}) steht vor ${EVENTS[i - 1].id} (${EVENTS[i - 1].year})`);
  }
}

/* --- 4. Gebietsstände --------------------------------------------------- */
for (const e of EVENTS) {
  if (e.snapshot && !SNAPSHOT_BY_ID[e.snapshot]) warn(`${e.id}: Gebietsstand „${e.snapshot}" gibt es nicht`);
}
const benutzt = new Set(EVENTS.map((e) => e.snapshot).filter(Boolean));
for (const s of SNAPSHOTS) {
  if (!benutzt.has(s.id)) warn(`Gebietsstand „${s.id}" wird von keinem Ereignis gezeigt`);
}

/* --- 5. Flächen --------------------------------------------------------- */
const RAHMEN = { lat: [27.0, 36.5], lon: [31.0, 37.5] };
for (const s of SNAPSHOTS) {
  for (const a of s.areas) {
    if (!a.polygon || a.polygon.length < 3) {
      warn(`${s.id}/${a.id}: Fläche mit ${a.polygon?.length ?? 0} Punkten`);
      continue;
    }
    for (const [lat, lon] of a.polygon) {
      if (lat < RAHMEN.lat[0] || lat > RAHMEN.lat[1] || lon < RAHMEN.lon[0] || lon > RAHMEN.lon[1]) {
        warn(`${s.id}/${a.id}: Punkt ${lat},${lon} liegt außerhalb des Kartenausschnitts`);
        break;
      }
    }
  }
}

/* --- 6. Abschnitte ------------------------------------------------------ */
for (const e of EVENTS) {
  const era = ERA_BY_ID[e.era];
  if (!era) {
    warn(`${e.id}: Abschnitt „${e.era}" gibt es nicht`);
    continue;
  }
  if (e.year < era.from || e.year > era.to) {
    warn(`${e.id} (${e.year}) liegt außerhalb von „${era.de}" (${era.from}…${era.to})`);
  }
}
for (const era of ERAS) {
  if (!EVENTS.some((e) => e.era === era.id)) warn(`Abschnitt „${era.de}" hat kein Ereignis`);
}

/* --- 7. Zweisprachigkeit ------------------------------------------------ */
const felder = (e) => [
  ['de/en', e.de, e.en],
  ['when', e.when?.de, e.when?.en],
  ['text', e.text?.de, e.text?.en],
];
for (const e of EVENTS) {
  for (const [was, de, en] of felder(e)) {
    if (!de?.trim() || !en?.trim()) {
      warn(`${e.id}: ${was} nicht in beiden Sprachen`);
      continue;
    }
    // Umlaute und ß im englischen Feld: das ist deutscher Text an der falschen
    // Stelle. Der verlässlichste Hinweis, den eine Prüfung ohne Wörterbuch hat.
    if (/[äöüßÄÖÜ]/.test(en) && !/^[^a-z]*$/.test(en)) {
      warn(`${e.id}: ${was} – deutscher Text im englischen Feld („${en.slice(0, 40)}…")`);
    }
    // Gleiche Prosa gibt es nicht. Gleiche Datumsangaben und Eigennamen schon:
    // „1099" und „Basel" heißen in beiden Sprachen so.
    if (was === 'text' && de === en) {
      warn(`${e.id}: ${was} ist in beiden Sprachen gleich – nicht übersetzt`);
    }
  }
}

/* --- Bericht ------------------------------------------------------------ */
const mitZahlen = EVENTS.filter((e) => e.figures?.length).length;
console.log(
  `${EVENTS.length} Ereignisse, ${SNAPSHOTS.length} Gebietsstände, ` +
    `${Object.keys(SOURCE_BY_ID).length} Quellen, ${zahlen} Zahlen in ${mitZahlen} Ereignissen.`,
);
if (fehler.length) {
  console.error('\nOffen:');
  for (const f of fehler) console.error('  · ' + f);
  process.exit(1);
}
console.log('Jedes Ereignis belegt, jede Zahl mit Quelle und Stand.');
