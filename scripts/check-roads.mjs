// Prüft die Wegsuche über das Straßennetz – und, wenn es sie gibt, die Datei,
// die dabei herauskommt.
//
//   node --experimental-strip-types --import ./scripts/lib/ts-loader.mjs scripts/check-roads.mjs
//   npm run check:roads
//   npm run check:roads -- --gegenprobe
//
// **Das Kernproblem.** Ein Weg-Sucher, der nichts findet, sieht aus wie ein
// Datensatz mit Lücken – und ein Weg-Sucher, der Unsinn findet, sieht aus wie
// eine Straße, die eben so verlief. Beides fällt an echten Daten nicht auf:
// Wer weiß schon auswendig, wie die Straße von Jericho nach Betanien lief?
//
// Deshalb misst diese Prüfung an einem **erfundenen Netz**
// (`data/roads/pruefnetz.geojson`), dessen Verlauf bekannt ist, weil er
// gesetzt wurde: eine Strecke mit einem Bogen nach Süden, ein Abzweig und eine
// Insel ohne Anschluss. Was der Sucher daraus machen muss, steht fest.
//
// Geprüft wird an jeder gefundenen Etappe:
//
//   * Sie beginnt an ihrer Station und endet an der nächsten (10 m Spielraum).
//   * Sie ist **länger als die Luftlinie** – sonst folgte sie dem Netz nicht,
//     und der Bogen der Prüfstrecke wäre umsonst.
//   * Sie ist nicht länger als das Vierfache – ein Weg, der durch die Lücken
//     der Daten irrt, ist kein Fund.
//   * Ihre Kodierung kommt unverändert zurück.
//
// Dazu die Insel: Eine Station, die nur an sie anschließt, darf **keinen** Weg
// bekommen. Und der Weg selbst (`buildWeg` in `src/lib/walk.ts`) muss seine
// Stationen an den richtigen Stellen wiederfinden.
//
// `public/data/roads.json` entsteht nur bei dem, der den Straßendatensatz zur
// Hand hat (siehe `data/roads/README.md`). Liegt sie da, wird sie mitgeprüft;
// liegt sie nicht da, ist das kein Fehler, sondern der Normalfall.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { routen } from './lib/routen.mjs';
import { decodePolyline, encodePolyline } from '../src/lib/polyline.ts';
import { distanceKm } from '../src/lib/route.ts';
import { buildWeg, kmAtT, legKm, stopIndexAt, tForStation, cumulativeKm } from '../src/lib/walk.ts';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const gegenprobe = process.argv.includes('--gegenprobe');
const fehler = [];

/** Dieselben Grenzen, die `build-roads.mjs` setzt. */
const MAX_DETOUR = 4;
/** Anfang und Ende dürfen so weit neben der Station liegen. */
const ENDE_M = 10;

/* --- Lauf über das erfundene Netz ---------------------------------------- */

const ausgabe = path.join(os.tmpdir(), `bibelmap-roads-${process.pid}.json`);
const lauf = spawnSync(
  process.execPath,
  [
    '--experimental-strip-types',
    '--import',
    './scripts/lib/ts-loader.mjs',
    'scripts/build-roads.mjs',
    '--quelle',
    'data/roads/pruefnetz.geojson',
    '--out',
    ausgabe,
    '--name',
    'Prüfnetz (erfunden)',
    '--url',
    'data/roads/README.md',
    '--lizenz',
    'GPL-3.0',
    '--still',
  ],
  { cwd: ROOT, encoding: 'utf8' },
);
if (lauf.status !== 0) {
  console.error('✗ `build-roads.mjs` lief nicht durch:\n' + (lauf.stderr || lauf.stdout));
  process.exit(1);
}

const daten = JSON.parse(fs.readFileSync(ausgabe, 'utf8'));
fs.rmSync(ausgabe, { force: true });

const ROUTEN = new Map(routen().map((r) => [r.id, r]));

/**
 * Eine Wegdatei durchmessen. `stoerung` verschiebt die erste gefundene Etappe
 * – das ist die Gegenprobe: Wenn die Prüfung das nicht merkt, misst sie nichts.
 */
function pruefeDatei(d, woher, stoerung = 0) {
  const meldung = (t) => fehler.push(`${woher}: ${t}`);
  let etappen = 0;
  let punkte = 0;
  let gestoert = stoerung !== 0;

  for (const [id, weg] of Object.entries(d.wege)) {
    const route = ROUTEN.get(id);
    if (!route) {
      meldung(`Reise „${id}" gibt es in den Daten der App nicht.`);
      continue;
    }
    if (weg.legs.length !== route.stops.length - 1) {
      meldung(`„${id}" hat ${weg.legs.length} Etappen, die Route aber ${route.stops.length} Stationen.`);
      continue;
    }
    for (let i = 0; i < weg.legs.length; i++) {
      const roh = weg.legs[i];
      if (roh === null) continue;
      etappen++;
      let pfad = decodePolyline(roh);
      punkte += pfad.length;

      // Kodierung: was hineingeht, muss herauskommen.
      if (encodePolyline(pfad) !== roh) {
        meldung(`„${id}" Etappe ${i}: Die Polylinie kommt anders zurück, als sie hineinging.`);
      }

      if (gestoert) {
        // Ein Kilometer nach Norden – die Etappe endet damit nicht mehr an
        // ihrer Station.
        pfad = pfad.map(([la, lo]) => [la + 0.009, lo]);
        gestoert = false;
      }

      if (pfad.length < 2) {
        meldung(`„${id}" Etappe ${i}: weniger als zwei Punkte.`);
        continue;
      }
      const a = [route.stops[i].lat, route.stops[i].lon];
      const b = [route.stops[i + 1].lat, route.stops[i + 1].lon];
      const vorn = distanceKm(pfad[0], a) * 1000;
      const hinten = distanceKm(pfad[pfad.length - 1], b) * 1000;
      if (vorn > ENDE_M) meldung(`„${id}" Etappe ${i}: beginnt ${vorn.toFixed(0)} m neben der Station.`);
      if (hinten > ENDE_M) meldung(`„${id}" Etappe ${i}: endet ${hinten.toFixed(0)} m neben der nächsten Station.`);

      let km = 0;
      for (let k = 1; k < pfad.length; k++) km += distanceKm(pfad[k - 1], pfad[k]);
      const luft = distanceKm(a, b);
      // Zehn Meter Spielraum: Das Ausdünnen darf den Weg minimal kürzen.
      if (km + 0.01 < luft) {
        meldung(`„${id}" Etappe ${i}: ${km.toFixed(1)} km kürzer als die Luftlinie (${luft.toFixed(1)} km) – unmöglich.`);
      }
      if (km > luft * MAX_DETOUR) {
        meldung(`„${id}" Etappe ${i}: ${km.toFixed(1)} km gegen ${luft.toFixed(1)} km Luftlinie – mehr als das ${MAX_DETOUR}-Fache.`);
      }
      for (const [la, lo] of pfad) {
        if (!Number.isFinite(la) || !Number.isFinite(lo) || la < -90 || la > 90 || lo < -180 || lo > 180) {
          meldung(`„${id}" Etappe ${i}: Punkt außerhalb der Erde (${la}, ${lo}).`);
          break;
        }
      }
    }
  }
  return { etappen, punkte };
}

const { etappen, punkte } = pruefeDatei(daten, 'Prüfnetz');

if (etappen === 0) {
  fehler.push('Prüfnetz: keine einzige Etappe hat einen Weg bekommen – die Wegsuche findet nichts.');
}

/* --- Was das erfundene Netz eigens prüft --------------------------------- */

// Die Prüfstrecke A hat einen Bogen nach Süden. Mindestens eine Etappe muss
// ihm folgen und dadurch messbar länger sein als die Luftlinie – sonst
// „folgt" der Sucher dem Netz nur auf dem Papier.
let mitBogen = 0;
for (const [id, weg] of Object.entries(daten.wege)) {
  const route = ROUTEN.get(id);
  if (!route) continue;
  weg.legs.forEach((roh, i) => {
    if (!roh) return;
    const pfad = decodePolyline(roh);
    let km = 0;
    for (let k = 1; k < pfad.length; k++) km += distanceKm(pfad[k - 1], pfad[k]);
    const luft = distanceKm([route.stops[i].lat, route.stops[i].lon], [route.stops[i + 1].lat, route.stops[i + 1].lon]);
    if (luft > 1 && km > luft * 1.02) mitBogen++;
  });
}
if (mitBogen === 0) {
  fehler.push('Keine Etappe ist länger als ihre Luftlinie – der Sucher zieht Geraden statt dem Netz zu folgen.');
}

// Die Insel (Prüfstrecke C) liegt bei 32,61 N / 34,91 O und hängt an nichts.
// Kein Weg darf über sie führen.
const INSEL = [32.61, 34.91];
for (const [id, weg] of Object.entries(daten.wege)) {
  for (const roh of weg.legs) {
    if (!roh) continue;
    if (decodePolyline(roh).some((p) => distanceKm(p, INSEL) < 3)) {
      fehler.push(`„${id}": ein Weg führt über die Insel ohne Anschluss – die Wegsuche verbindet Unverbundenes.`);
      break;
    }
  }
}

/* --- Der Weg, wie ihn das Gehen zusammensetzt ---------------------------- */

{
  const stops = [
    [31.8717, 35.4446],
    [31.83, 35.34],
    [31.7717, 35.2559],
  ];
  const legs = [
    [
      [31.8717, 35.4446],
      [31.86, 35.42],
      [31.845, 35.395],
      [31.83, 35.34],
    ],
    null,
  ];
  const weg = buildWeg(stops, legs);
  if (weg.stopAt.length !== 3) fehler.push(`buildWeg: ${weg.stopAt.length} Stationen statt 3.`);
  if (weg.onRoad[0] !== true || weg.onRoad[1] !== false) {
    fehler.push(`buildWeg: die Etappen stehen als ${JSON.stringify(weg.onRoad)} statt [true, false].`);
  }
  for (let i = 0; i < stops.length; i++) {
    const wo = weg.points[weg.stopAt[i]];
    if (distanceKm(wo, stops[i]) * 1000 > 1) {
      fehler.push(`buildWeg: Station ${i} liegt nicht auf ihrem eigenen Punkt.`);
    }
  }
  for (let i = 1; i < weg.cum.length; i++) {
    if (weg.cum[i] < weg.cum[i - 1]) fehler.push('buildWeg: die Kilometer laufen rückwärts.');
  }
  // Auf den Kilometer einer Station gestellt, muss das Gehen genau dort stehen.
  for (let i = 0; i < stops.length; i++) {
    const km = kmAtT(weg.cum, weg.stopAt[i]);
    const t = weg.cum.findIndex((c) => c >= km - 1e-9);
    if (stopIndexAt(weg, t) !== i) {
      fehler.push(`stopIndexAt: bei km ${km.toFixed(1)} steht das Gehen auf Station ${stopIndexAt(weg, t)} statt ${i}.`);
    }
  }
  /*
   * Das Stationsmaß der flachen Karte. Dort zählt die abgespielte Route in
   * Stationen: 0,5 heißt „auf halber Strecke". Umgerechnet wird über die
   * Strecke, nicht über die Zahl der Stützpunkte – sonst liefe der Reisende
   * in den Kurven langsamer als auf der Geraden, und zwar sichtbar.
   */
  for (let i = 0; i < stops.length; i++) {
    if (Math.abs(tForStation(weg, i) - weg.stopAt[i]) > 1e-6) {
      fehler.push(`tForStation: Station ${i} liegt auf ${tForStation(weg, i)} statt auf ${weg.stopAt[i]}.`);
    }
  }
  const halb = kmAtT(weg.cum, tForStation(weg, 0.5));
  const erwartetHalb = (kmAtT(weg.cum, weg.stopAt[0]) + kmAtT(weg.cum, weg.stopAt[1])) / 2;
  if (Math.abs(halb - erwartetHalb) > 0.01) {
    fehler.push(`tForStation: die halbe erste Etappe liegt bei ${halb.toFixed(2)} km statt bei ${erwartetHalb.toFixed(2)} km.`);
  }
  let vorher = -1;
  for (let s10 = 0; s10 <= 20; s10++) {
    const t = tForStation(weg, s10 / 10);
    if (t < vorher) fehler.push('tForStation: das Wegmaß läuft rückwärts.');
    vorher = t;
  }

  // Die Etappe über die Straße ist länger als die Luftlinie, die ohne genau sie.
  const luft0 = distanceKm(stops[0], stops[1]);
  if (!(legKm(weg, 0) > luft0)) {
    fehler.push(`legKm: die Etappe über die Straße misst ${legKm(weg, 0).toFixed(2)} km, die Luftlinie ${luft0.toFixed(2)} km.`);
  }
  if (Math.abs(legKm(weg, 1) - distanceKm(stops[1], stops[2])) > 1e-9) {
    fehler.push('legKm: eine Etappe ohne Straße weicht von der Luftlinie ab.');
  }

  // Ohne Straßen ist der Weg die Stationskette – und nichts anderes.
  const ohne = buildWeg(stops);
  if (JSON.stringify(ohne.stopAt) !== '[0,1,2]') {
    fehler.push(`buildWeg ohne Straßen: ${JSON.stringify(ohne.stopAt)} statt [0,1,2].`);
  }
  if (JSON.stringify(ohne.cum) !== JSON.stringify(cumulativeKm([distanceKm(stops[0], stops[1]), distanceKm(stops[1], stops[2])]))) {
    fehler.push('buildWeg ohne Straßen: die Kilometer weichen von der Stationskette ab.');
  }
}

/* --- Die echte Datei, falls es sie gibt ---------------------------------- */

const echt = path.join(ROOT, 'public/data/roads.json');
let echtesWort = 'keine Wegdatei vorhanden (Normalfall – siehe data/roads/README.md)';
if (fs.existsSync(echt)) {
  const d = JSON.parse(fs.readFileSync(echt, 'utf8'));
  const { etappen: e2 } = pruefeDatei(d, 'roads.json');
  if (!d.quelle?.name || !d.quelle?.license) {
    fehler.push('roads.json: die Quelle nennt keinen Namen oder keine Lizenz – dann fehlt sie auch auf der Nachweisseite.');
  }
  // Das erfundene Netz ist ein Prüfstand. Landet es je in `public/data/`,
  // zeigt die Seite Straßen, die es nie gab – und niemand sieht es ihr an.
  if (/erfunden|prüfnetz|pruefnetz/i.test(`${d.quelle?.name} ${d.quelle?.url}`)) {
    fehler.push('roads.json stammt aus dem erfundenen Prüfnetz – das gehört nicht in die Seite.');
  }
  if (/NC/i.test(d.quelle?.license ?? '')) {
    fehler.push(`roads.json: Lizenz „${d.quelle.license}" – ein nicht-kommerzieller Datensatz gehört nicht in ein GPL-Projekt.`);
  }
  // Wer Material einsetzt, nennt es auf der Nachweisseite – das ist die Regel
  // dieses Projekts und bei CC-BY auch die Bedingung. Die Zeile unter der
  // Karte allein reicht der Seite nicht.
  const nachweise = fs.readFileSync(path.join(ROOT, 'src/data/attribution.ts'), 'utf8');
  if (d.quelle?.name && !nachweise.includes(d.quelle.name)) {
    fehler.push(`roads.json nennt „${d.quelle.name}" – auf der Nachweisseite (attribution.ts) steht die Quelle nicht.`);
  }
  echtesWort = `roads.json: ${Object.keys(d.wege).length} Reisen, ${e2} Etappen mit Weg, Quelle „${d.quelle?.name}" (${d.quelle?.license})`;
}

/* --- Ausgabe ------------------------------------------------------------- */

if (gegenprobe) {
  const vorher = fehler.length;
  pruefeDatei(daten, 'Gegenprobe', 1);
  const getroffen = fehler.length > vorher;
  console.log(`Gegenprobe: eine um einen Kilometer verschobene Etappe wird ${getroffen ? 'gefunden' : 'NICHT gefunden'}.`);
  if (vorher) console.log(`  ⚠ dazu ${vorher} echte Beanstandung(en) – die gehören in den normalen Lauf.`);
  console.log(getroffen && !vorher ? '✓ Die Prüfung schlägt an, und nur dort.' : '✗ Die Prüfung belegt nicht, was sie soll.');
  process.exit(getroffen && !vorher ? 0 : 1);
}

if (fehler.length) {
  console.error(`✗ ${fehler.length} Beanstandung${fehler.length === 1 ? '' : 'en'}:\n`);
  for (const x of fehler) console.error('  · ' + x);
  process.exit(1);
}

console.log(
  `✓ Wegsuche am erfundenen Prüfnetz: ${etappen} Etappen aus ${punkte} Punkten, ` +
    `jede an ihren Stationen, keine kürzer als die Luftlinie, keine über die Insel; ` +
    `${echtesWort}.`,
);
