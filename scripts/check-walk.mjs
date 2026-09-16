// Prüft die Kamera auf Augenhöhe – die Rechnung hinter dem Gehen.
//
//   node --experimental-strip-types --import ./scripts/lib/ts-loader.mjs scripts/check-walk.mjs
//   npm run check:walk
//   npm run check:walk -- --gegenprobe
//
// **Warum das eine Prüfung braucht.** `eyeCamera()` gibt MapLibre keine
// Kameraposition – die kennt MapLibre nicht –, sondern einen Blickpunkt mit
// Höhe, eine Neigung und eine Zoomstufe. Wo die Kamera dann steht, rechnet
// MapLibre daraus zurück. Ein vertauschtes Vorzeichen, eine Kachelgröße von
// 256 statt 512, ein Winkel gegen die Waagerechte statt gegen das Lot: nichts
// davon stürzt ab. Es steht die Kamera nur hundert Meter zu hoch, und das
// sieht aus wie ein Blick vom Hügel – plausibel genug, um es nicht zu merken.
//
// Geprüft wird deshalb nicht der Code, sondern die Umkehrung: `cameraStandpoint`
// stellt aus dem Ergebnis wieder her, wo die Kamera steht, mit derselben
// Geometrie, die MapLibre verwendet. Herauskommen muss der Fußpunkt, mit dem
// die Rechnung begonnen hat – auf Augenhöhe, nicht darüber.
//
// Die Prüfung liest den echten Quelltext (über `scripts/lib/ts-loader.mjs`),
// nicht eine Nachbildung: eine geänderte Konstante in `src/lib/walk.ts` muss
// hier ankommen.

import {
  EYE_HEIGHT_M,
  LOOK_AHEAD_M,
  WALK_PITCH,
  cameraStandpoint,
  cameraToCenterPixels,
  cumulativeKm,
  eyeCamera,
  kmAtT,
  tAtKm,
} from '../src/lib/walk.ts';
import { bearing, distanceKm } from '../src/lib/route.ts';

const gegenprobe = process.argv.includes('--gegenprobe');

/** Höhe, Breite und Blickrichtung quer durch das Land der Bibel. */
const FAELLE = [];
for (const [name, at, ground] of [
  ['Kafarnaum am See', [32.881, 35.575], -210], // unter dem Meeresspiegel
  ['Jerusalem', [31.778, 35.235], 754],
  ['Jericho', [31.87, 35.444], -258],
  ['Berg Hermon', [33.416, 35.857], 2814],
  ['Alexandria', [31.2, 29.92], 5],
]) {
  for (const kurs of [0, 47, 133, 180, 275, 359]) {
    // Kleines Telefon, Laptop, großer Bildschirm – der Abstand zum Blickpunkt
    // hängt an der Fensterhöhe, und damit die Zoomstufe.
    for (const hoehe of [560, 900, 1800]) {
      FAELLE.push({ name, at, ground, kurs, px: cameraToCenterPixels(36.87, hoehe) });
    }
  }
}

const fehler = [];
let zoomMin = Infinity;
let zoomMax = -Infinity;

/** Ein Fall: Kamera rechnen, Kamera zurückrechnen, vergleichen. */
function pruefe(fall, stoerung = 0) {
  const eye = { at: fall.at, ground: fall.ground, bearing: fall.kurs, cameraToCenterPx: fall.px };
  const cam = eyeCamera(eye);
  const zurueck = cameraStandpoint({ ...cam, zoom: cam.zoom + stoerung }, fall.px);
  zoomMin = Math.min(zoomMin, cam.zoom);
  zoomMax = Math.max(zoomMax, cam.zoom);

  const wo = `${fall.name}, Kurs ${fall.kurs}°, ${fall.px.toFixed(0)} px`;
  // Ein halber Meter auf 1,2 km Blickweite: das ist die Rundung der
  // Kugelrechnung, nicht mehr.
  const abstandM = distanceKm(zurueck.at, fall.at) * 1000;
  if (abstandM > 0.5) {
    fehler.push(`${wo}: Kamera steht ${abstandM.toFixed(1)} m neben dem Weg.`);
  }
  const hoehe = zurueck.altitude - fall.ground;
  if (Math.abs(hoehe - EYE_HEIGHT_M) > 0.01) {
    fehler.push(`${wo}: Auge auf ${hoehe.toFixed(2)} m über dem Boden statt auf ${EYE_HEIGHT_M} m.`);
  }
  // Der Blickpunkt muss vor dem Auge liegen, nicht hinter ihm: ein gedrehtes
  // Vorzeichen im Kurs fällt in der Höhe nicht auf, hier schon.
  const kursZumBlick = bearing(fall.at, cam.center);
  const abweichung = Math.abs(((kursZumBlick - fall.kurs + 540) % 360) - 180);
  if (abweichung > 0.5) {
    fehler.push(`${wo}: Blickpunkt liegt auf ${kursZumBlick.toFixed(1)}° statt auf ${fall.kurs}°.`);
  }
  const weite = distanceKm(fall.at, cam.center) * 1000;
  if (Math.abs(weite - LOOK_AHEAD_M) > 1) {
    fehler.push(`${wo}: Blickpunkt ${weite.toFixed(0)} m voraus statt ${LOOK_AHEAD_M} m.`);
  }
}

for (const fall of FAELLE) pruefe(fall);

// Die Zoomstufe muss im Bereich bleiben, in dem es Kacheln und Höhen gibt.
// Zu weit draußen wäre das Gelände eine Ebene, zu nah eine Lupe auf vier
// Höhenpunkte.
if (zoomMin < 12 || zoomMax > 19) {
  fehler.push(`Zoomstufen zwischen ${zoomMin.toFixed(1)} und ${zoomMax.toFixed(1)} – außerhalb von 12 bis 19.`);
}
if (WALK_PITCH > 85) {
  fehler.push(`Neigung ${WALK_PITCH}° – mehr als 85° nimmt MapLibre nicht an.`);
}

// MapLibres Standardwinkel sind 36,87° – daraus werden anderthalb
// Fensterhöhen. Geht diese Zahl verloren, steht die Kamera falsch, ohne dass
// die Umkehrprobe oben es merken könnte: Sie rechnet mit demselben Wert.
const anderthalb = cameraToCenterPixels(36.87, 1000) / 1000;
if (Math.abs(anderthalb - 1.5) > 0.002) {
  fehler.push(`Öffnungswinkel 36,87° ergibt ${anderthalb.toFixed(3)} Fensterhöhen statt 1,5.`);
}

/* --- Kilometer und Etappen ---------------------------------------------- */

// Eine Route mit einer Etappe ohne Länge: in der Jesus-Sektion stehen
// mehrere Stationen nacheinander in Jerusalem, und eine Strecke von null
// Kilometern darf das Gehen nicht anhalten.
const legs = [12, 0, 30, 7.5];
const cum = cumulativeKm(legs);
if (cum.length !== legs.length + 1 || Math.abs(cum[cum.length - 1] - 49.5) > 1e-9) {
  fehler.push(`cumulativeKm ergibt ${JSON.stringify(cum)} – erwartet war eine Summe von 49,5 km.`);
}
for (const km of [0, 3, 12, 12.0001, 20, 49.5, 80, -5]) {
  const zurueck = kmAtT(cum, tAtKm(cum, km));
  const erwartet = Math.max(0, Math.min(49.5, km));
  if (Math.abs(zurueck - erwartet) > 1e-6) {
    fehler.push(`${km} km → t → ${zurueck} km: der Rückweg trifft ${erwartet} km nicht.`);
  }
}
// Die Station ohne Strecke wird übersprungen, nicht verschluckt.
if (tAtKm(cum, 12) !== 1 && tAtKm(cum, 12) !== 2) {
  fehler.push(`Bei 12 km steht das Etappenmaß auf ${tAtKm(cum, 12)} – erwartet war Station 2 oder 3.`);
}

/* --- Ausgabe ------------------------------------------------------------- */

if (gegenprobe) {
  // Eine Zoomstufe daneben heißt: die Kamera steht woanders. Wenn die Prüfung
  // das nicht merkt, misst sie nichts.
  const vorher = fehler.length;
  pruefe(FAELLE[0], 0.1);
  const getroffen = fehler.length > vorher;
  console.log(`Gegenprobe: eine um 0,1 verstellte Zoomstufe wird ${getroffen ? 'gefunden' : 'NICHT gefunden'}.`);
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
  `✓ ${FAELLE.length} Kamerastände geprüft (${zoomMin.toFixed(1)}–${zoomMax.toFixed(1)} Zoom): ` +
    `Auge auf ${EYE_HEIGHT_M} m über dem Boden, Blick ${LOOK_AHEAD_M} m voraus, ` +
    `Kilometer und Etappen laufen in beide Richtungen.`,
);
