// Prüft die erzählten Reisen – die aus der Bibel und die des Paulus.
//
//   npm run check:journeys
//
// Diese Prüfung gab es lange nicht, und das war die eigentliche Lücke: Beim
// Ausbau von `journeys.ts` auf 178 Stationen wurde jede Runde von Hand
// nachgemessen – Ortskennungen, Koordinaten, Bibelstellen, Nulletappen. Eine
// Prüfung, die nur im Kopf dessen läuft, der gerade daran arbeitet, endet mit
// ihm.
//
// Vier Dinge scheitern hier still, ohne Fehlermeldung in der Oberfläche:
//
//   1. Eine `placeId`, die es nicht gibt: der Knopf „auf der Karte zeigen"
//      führt ins Leere.
//   2. Eine Koordinate, die nicht zu ihrer `placeId` passt: der Marker sitzt
//      neben dem Ort, den er verlinkt. In `mission.ts` waren drei Stationen so
//      – auf zwei Nachkommastellen gerundet, bei Kos ein halber Kilometer.
//   3. Zwei Stationen auf demselben Punkt: eine Etappe von 0 km, mit Pfeil und
//      „1 Tagesmarsch" daneben.
//   4. Deutsch im englischen Feld.
//
// Gelesen wird der echte Code (`scripts/lib/ts-loader.mjs`), nicht der
// Quelltext als Zeichenkette.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { JOURNEYS } = await import(path.join(ROOT, 'src/data/journeys.ts'));
const MISSION = await import(path.join(ROOT, 'src/data/mission.ts'));
const { ERA_BY_ID } = await import(path.join(ROOT, 'src/data/eras.ts'));
const roh = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/data/places.json'), 'utf8'));
const PLACES = Array.isArray(roh) ? roh : roh.places;
const ORT = Object.fromEntries(PLACES.map((p) => [p.id, p]));

/** Untergrenzen, unter denen sich die Prüfung selbst für kaputt erklärt. */
const MIN_REISEN = 15;
const MIN_STATIONEN = 200;

/**
 * Wie weit eine Stationskoordinate von ihrer `placeId` abweichen darf.
 *
 * Nicht null: die Dateien schreiben Koordinaten auf drei Nachkommastellen, das
 * sind hier bis zu 0,08 km. 0,2 km lässt das durch und fängt trotzdem jede
 * vertauschte Kennung – die liegt um Kilometer daneben, nicht um Meter.
 */
const MAX_ABSTAND_KM = 0.2;
/** Darunter ist es keine Etappe mehr, sondern derselbe Punkt zweimal. */
const MIN_ETAPPE_KM = 0.05;

/** Wörter, die es im Englischen nicht gibt – wie in `check-i18n.mjs`. */
const DEUTSCH =
  /(?<![-\w])(und|oder|nicht|wird|werden|sind|waren|eine|einen|einer|dem|den|des|der|die|das|mit|von|für|auf|aus|zum|zur|bei|nach|über|unter|zwischen|durch|ohne|gegen|noch|schon|kein|keine|mehr|hier|dort|diese|dieser|dieses|jeder|jede|alle)(?![-\w])/;

function distanceKm(a, b) {
  const R = 6371;
  const r = (x) => (x * Math.PI) / 180;
  const dLat = r(b[0] - a[0]);
  const dLon = r(b[1] - a[1]);
  const h = Math.sin(dLat / 2) ** 2 + Math.sin(dLon / 2) ** 2 * Math.cos(r(a[0])) * Math.cos(r(b[0]));
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Das englische Feld einer Station – die zwei Dateien nennen es verschieden. */
const englisch = (s) => s.text?.en ?? s.note?.en ?? null;

export function pruefe(reisen, quelle) {
  const funde = [];
  const gesehen = new Set();

  for (const j of reisen) {
    if (gesehen.has(j.id)) funde.push(`${quelle} ${j.id}: Kennung kommt doppelt vor`);
    gesehen.add(j.id);
    if (j.era && !ERA_BY_ID[j.era]) funde.push(`${quelle} ${j.id}: Epoche „${j.era}" gibt es nicht`);
    if (!j.de || !j.en) funde.push(`${quelle} ${j.id}: Titel fehlt in einer Sprache`);

    for (const s of j.stops) {
      const wo = `${quelle} ${j.id}/${s.de}`;
      if (!s.de || !s.en) funde.push(`${wo}: Stationsname fehlt in einer Sprache`);
      if (!s.ref?.de || !s.ref?.en) funde.push(`${wo}: keine Bibelstelle`);

      if (s.placeId) {
        const p = ORT[s.placeId];
        if (!p) {
          funde.push(`${wo}: placeId „${s.placeId}" gibt es in places.json nicht`);
        } else {
          const d = distanceKm([s.lat, s.lon], [p.lat, p.lon]);
          if (d > MAX_ABSTAND_KM) {
            funde.push(`${wo}: liegt ${d.toFixed(2)} km neben „${p.name}" (${s.placeId})`);
          }
        }
      }

      const en = englisch(s);
      if (en && DEUTSCH.test(en)) funde.push(`${wo}: Deutsch im englischen Text`);
    }

    for (let k = 1; k < j.stops.length; k++) {
      const a = j.stops[k - 1];
      const b = j.stops[k];
      if (distanceKm([a.lat, a.lon], [b.lat, b.lon]) < MIN_ETAPPE_KM) {
        funde.push(`${quelle} ${j.id}: „${a.de}" und „${b.de}" liegen auf demselben Punkt`);
      }
    }
  }
  return funde;
}

const stationen =
  JOURNEYS.reduce((n, j) => n + j.stops.length, 0) +
  MISSION.JOURNEYS.reduce((n, j) => n + j.stops.length, 0);

if (JOURNEYS.length < MIN_REISEN || stationen < MIN_STATIONEN || PLACES.length < 1000) {
  console.error(`✗ Zu wenig gefunden (${JOURNEYS.length} Reisen, ${stationen} Stationen, ${PLACES.length} Orte).`);
  console.error('  Das ist kein bestandener Lauf, sondern eine Prüfung ohne Quelle.');
  process.exit(1);
}

const funde = [...pruefe(JOURNEYS, 'Reisen'), ...pruefe(MISSION.JOURNEYS, 'Mission')];

// Die Ausbreitungs-Ereignisse tragen keine placeId, aber eine Koordinate und
// eine Phase.
for (const e of MISSION.SPREAD_EVENTS) {
  if (!Number.isFinite(e.lat) || !Number.isFinite(e.lon) || Math.abs(e.lat) > 90 || Math.abs(e.lon) > 180) {
    funde.push(`Ausbreitung ${e.id}: Koordinate liegt nicht auf der Erde`);
  }
  if (e.lat === 0 && e.lon === 0) funde.push(`Ausbreitung ${e.id}: Koordinate bei null`);
  if (!MISSION.PHASE_BY_ID[e.phase]) funde.push(`Ausbreitung ${e.id}: Phase „${e.phase}" gibt es nicht`);
  if (e.en?.text && DEUTSCH.test(e.en.text)) funde.push(`Ausbreitung ${e.id}: Deutsch im englischen Text`);
}

// Gegenprobe: eine Prüfung, die auf den echten Daten nichts findet, muss
// zeigen, dass sie überhaupt etwas finden kann.
const kaputt = JOURNEYS.map((j, i) =>
  i === 0
    ? { ...j, stops: [{ ...j.stops[0], placeId: 'gibtesnicht' }, ...j.stops.slice(1)] }
    : i === 1
      ? { ...j, stops: [j.stops[0], { ...j.stops[1], lat: j.stops[0].lat, lon: j.stops[0].lon }, ...j.stops.slice(2)] }
      : j,
);
if (pruefe(kaputt, 'Gegenprobe').length < 2) {
  console.error('✗ Die Gegenprobe findet die absichtlich eingebauten Fehler nicht.');
  process.exit(1);
}

const mitOrt = [...JOURNEYS, ...MISSION.JOURNEYS].flatMap((j) => j.stops).filter((s) => s.placeId).length;
console.log(`Reisen:      ${JOURNEYS.length} mit ${JOURNEYS.reduce((n, j) => n + j.stops.length, 0)} Stationen`);
console.log(
  `Mission:     ${MISSION.JOURNEYS.length} mit ${MISSION.JOURNEYS.reduce((n, j) => n + j.stops.length, 0)} Stationen und ${MISSION.SPREAD_EVENTS.length} Ereignissen`,
);
console.log(`Ortsbezug:   ${mitOrt} Stationen mit placeId, alle gegen places.json geprüft`);

if (funde.length) {
  console.error(`\n✗ ${funde.length} Befunde:`);
  for (const f of funde.slice(0, 12)) console.error('   ' + f);
  process.exit(1);
}
console.log(
  `\n${stationen} Stationen: jede placeId trifft einen Ort, keine liegt weiter als ${MAX_ABSTAND_KM} km daneben, jede hat eine Bibelstelle, keine Etappe misst null.`,
);
