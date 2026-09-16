// Die Kamera auf Augenhöhe: Rechnung für den Blick, den jemand hat, der den
// Weg wirklich geht.
//
// MapLibre kennt keine frei gesetzte Kamera (die `FreeCameraOptions` von
// Mapbox sind nach dem Lizenzwechsel nie in MapLibre gelandet). Was es gibt,
// ist ein Blickpunkt mit eigener Höhe: `jumpTo({ center, elevation, zoom,
// pitch, bearing })`, seit `centerClampedToGround = false` auch frei über dem
// Gelände. Daraus lässt sich eine Kamera auf Augenhöhe rechnen – rückwärts.
//
// Die Geometrie, die MapLibre aufbaut:
//
//   Auge ────────── d ──────────► Blickpunkt
//        \  pitch (vom Lot)
//         ▼
//
//   * `pitch` ist der Winkel gegen das Lot: 0° schaut senkrecht hinunter,
//     85° fast waagerecht.
//   * `zoom` bestimmt den Abstand d zwischen Auge und Blickpunkt.
//   * Der Blickpunkt liegt auf `center`, in der Höhe `elevation`.
//
// Gesucht ist das Umgekehrte: Das Auge soll an einer bestimmten Stelle stehen,
// 1,70 m über dem Boden, und in eine bestimmte Richtung sehen. Also wird der
// Blickpunkt vor das Auge gelegt – `lookAhead` Meter weit, um `drop` Meter
// tiefer –, und der Zoom aus dem Abstand zurückgerechnet.
//
// Warum das eine eigene Datei ist: Es ist die einzige Stelle des Gehens, die
// sich nachrechnen lässt, ohne einen Browser zu starten. `npm run check:walk`
// stellt die Kamera aus dem Ergebnis wieder her und vergleicht, wo sie steht –
// ein verdrehtes Vorzeichen oder eine Konstante daneben fällt dort auf und
// nicht erst als schiefer Horizont.

import { type LatLon, bearing, distanceKm, legDistances, pointAt } from './route';

/** Umfang der Erde am Äquator in Metern – dieselbe Zahl, mit der Web Mercator rechnet. */
export const EARTH_CIRCUMFERENCE_M = 40075016.686;

/** Kachelgröße, auf die sich MapLibres Zoomstufen beziehen. */
const TILE_SIZE = 512;

/**
 * Augenhöhe über dem Boden. Nicht die Körpergröße: die Augen sitzen ein Stück
 * tiefer, und für die Antike gibt es ohnehin nur Schätzungen aus Gräberfeldern
 * (etwa 1,60 bis 1,70 m für Männer). Die Zahl entscheidet hier über nichts
 * Sichtbares – auf 1,2 km Sichtweite sind zehn Zentimeter Augenhöhe nichts.
 */
export const EYE_HEIGHT_M = 1.7;

/**
 * Wie weit vor dem Auge der Blickpunkt liegt. Er ist kein Ziel, sondern ein
 * Rechenpunkt: Er legt zusammen mit `WALK_PITCH` fest, wie tief der Blick
 * geht, und über den Abstand die Zoomstufe. 1,2 km landen auf Zoom 15 bis 16 –
 * nah genug, dass das Gelände aufgelöst ist, weit genug, dass der Horizont
 * nicht zittert.
 */
export const LOOK_AHEAD_M = 1200;

/**
 * Die Neigung beim Gehen. MapLibre lässt über 85° nicht zu (und nennt schon
 * alles über 60° experimentell), waagerecht wären 90° – der Blick geht also
 * fünf Grad abwärts, wie bei jemandem, der auf den Weg vor sich sieht. Der
 * Horizont steht dadurch nicht in der Bildmitte, sondern im oberen Drittel.
 */
export const WALK_PITCH = 85;

const toRad = (deg: number) => (deg * Math.PI) / 180;
const toDeg = (rad: number) => (rad * 180) / Math.PI;

/** Mittlerer Erdradius in Metern. */
const R = 6371008.8;

/**
 * Von einem Punkt aus `meters` weit in Richtung `bearingDeg` – auf der Kugel
 * gerechnet, nicht auf dem Papier. Auf 1,2 km wäre der Unterschied unsichtbar;
 * dieselbe Funktion setzt aber auch die Gegenprobe zusammen, und dort soll
 * nicht die Näherung geprüft werden, sondern die Kamera.
 */
export function moveBy(from: LatLon, bearingDeg: number, meters: number): LatLon {
  const [lat, lon] = from;
  const d = meters / R;
  const b = toRad(bearingDeg);
  const φ1 = toRad(lat);
  const λ1 = toRad(lon);
  const φ2 = Math.asin(Math.sin(φ1) * Math.cos(d) + Math.cos(φ1) * Math.sin(d) * Math.cos(b));
  const λ2 =
    λ1 +
    Math.atan2(Math.sin(b) * Math.sin(d) * Math.cos(φ1), Math.cos(d) - Math.sin(φ1) * Math.sin(φ2));
  return [toDeg(φ2), ((toDeg(λ2) + 540) % 360) - 180];
}

/** Wie viele Meter ein Bildschirmpunkt auf dieser Breite und Zoomstufe deckt. */
export function metersPerPixel(lat: number, zoom: number): number {
  return (EARTH_CIRCUMFERENCE_M * Math.cos(toRad(lat))) / (TILE_SIZE * 2 ** zoom);
}

/** Die Zoomstufe, auf der ein Bildschirmpunkt genau `mpp` Meter deckt. */
export function zoomForMetersPerPixel(lat: number, mpp: number): number {
  return Math.log2((EARTH_CIRCUMFERENCE_M * Math.cos(toRad(lat))) / (TILE_SIZE * mpp));
}

/**
 * MapLibres Abstand zwischen Kamera und Blickpunkt, in Bildschirmpunkten.
 *
 * Intern steht er als `transform.cameraToCenterDistance` bereit – aber
 * `map.transform` gehört nicht zur öffentlichen Schnittstelle, und was nicht
 * in den Typen steht, kann mit der nächsten Fassung verschwinden. Die
 * Rechnung dahinter ist eine Zeile und steht in der Spezifikation: der
 * Abstand, aus dem ein Öffnungswinkel `height` Punkte hoch ausfüllt.
 *
 * `fovDeg` kommt aus `map.getVerticalFieldOfView()`, `heightPx` aus der Höhe
 * der Leinwand in CSS-Punkten. Beim Standardwinkel von 36,87° sind das
 * anderthalb Fensterhöhen.
 */
export function cameraToCenterPixels(fovDeg: number, heightPx: number): number {
  return (0.5 / Math.tan(toRad(fovDeg) / 2)) * heightPx;
}

/** Wo die Kamera steht und wohin sie sieht – die Eingabe der Rechnung. */
export interface EyePoint {
  /** Der Fußpunkt: die Stelle auf dem Weg, ohne Augenhöhe. */
  at: LatLon;
  /** Geländehöhe dort, in Metern über dem Meer. */
  ground: number;
  /** Blickrichtung in Grad (0 = Norden). */
  bearing: number;
  /**
   * MapLibres Abstand zwischen Kamera und Blickpunkt, in Bildschirmpunkten –
   * aus `cameraToCenterPixels()`. Er hängt am Öffnungswinkel und an der Höhe
   * des Fensters; ohne ihn wäre die Zoomstufe geraten.
   */
  cameraToCenterPx: number;
}

/** Was MapLibre braucht, um genau dort zu stehen. */
export interface EyeCamera {
  center: LatLon;
  /** Höhe des Blickpunkts über dem Meer – nicht die der Kamera. */
  elevation: number;
  zoom: number;
  pitch: number;
  bearing: number;
}

export interface EyeOptions {
  eyeHeight?: number;
  lookAhead?: number;
  pitch?: number;
}

/**
 * Die Kamera für einen Blick auf Augenhöhe.
 *
 * Der Blickpunkt liegt `lookAhead` Meter voraus und um `drop` Meter tiefer;
 * `drop` folgt aus der Neigung. Der Abstand zwischen beiden ergibt die
 * Zoomstufe: Was MapLibre aus `zoom` als Abstand rechnet, muss genau dieser
 * Abstand sein, sonst steht die Kamera nicht auf Augenhöhe, sondern irgendwo
 * darüber.
 */
export function eyeCamera(eye: EyePoint, opts: EyeOptions = {}): EyeCamera {
  const pitch = opts.pitch ?? WALK_PITCH;
  const lookAhead = opts.lookAhead ?? LOOK_AHEAD_M;
  const eyeHeight = opts.eyeHeight ?? EYE_HEIGHT_M;
  const p = toRad(pitch);
  // Wie tief der Blickpunkt unter dem Auge liegt, und wie weit er entfernt ist.
  const drop = lookAhead / Math.tan(p);
  const distance = lookAhead / Math.sin(p);
  const center = moveBy(eye.at, eye.bearing, lookAhead);
  return {
    center,
    elevation: eye.ground + eyeHeight - drop,
    zoom: zoomForMetersPerPixel(center[0], distance / eye.cameraToCenterPx),
    pitch,
    bearing: eye.bearing,
  };
}

/**
 * Wo die Kamera aus einer solchen Einstellung tatsächlich steht: Fußpunkt und
 * Höhe über dem Meer. Die Umkehrung von `eyeCamera` – sie steht hier und nicht
 * im Prüfskript, damit beide Richtungen dieselbe Quelle haben.
 */
export function cameraStandpoint(cam: EyeCamera, cameraToCenterPx: number): {
  at: LatLon;
  altitude: number;
} {
  const distance = cameraToCenterPx * metersPerPixel(cam.center[0], cam.zoom);
  const p = toRad(cam.pitch);
  return {
    at: moveBy(cam.center, (cam.bearing + 180) % 360, distance * Math.sin(p)),
    altitude: cam.elevation + distance * Math.cos(p),
  };
}

/**
 * Unterhalb dieser Strecke ist eine Etappe keine Richtung, sondern ein
 * Rundungsfehler: In der Jesus-Sektion stehen mehrere Stationen nacheinander
 * in Jerusalem, mit demselben Kartenpunkt.
 */
const MIN_LEG_M = 10;

/**
 * Die Richtung, in die man an der Stelle `t` geht.
 *
 * Nicht einfach der Kurs zur nächsten Station: Steht die nächste Station auf
 * demselben Punkt, gäbe es keinen Kurs, und der Blick spränge auf Norden.
 * Gesucht wird deshalb der nächste Punkt, der weit genug entfernt ist – und am
 * Ende der Route die Richtung, in der man angekommen ist.
 */
export function headingAt(points: LatLon[], t: number, fallback = 0): number {
  const max = points.length - 1;
  if (max < 1) return fallback;
  const clamped = Math.max(0, Math.min(max, t));
  const here = pointAt(points, clamped);
  for (let i = Math.floor(clamped) + 1; i <= max; i++) {
    if (distanceKm(here, points[i]) * 1000 > MIN_LEG_M) return bearing(here, points[i]);
  }
  for (let i = Math.floor(clamped); i >= 1; i--) {
    if (distanceKm(points[i - 1], points[i]) * 1000 > MIN_LEG_M) return bearing(points[i - 1], points[i]);
  }
  return fallback;
}

/* --- Wegstrecke ---------------------------------------------------------- */

/**
 * Die aufsummierten Etappen: `cum[i]` ist die Strecke bis Station i.
 * `legs` kommt aus `legDistances()` – dieselben Kilometer, die der Reisemodus
 * neben der Route schreibt.
 */
export function cumulativeKm(legs: number[]): number[] {
  const out = [0];
  for (const km of legs) out.push(out[out.length - 1] + km);
  return out;
}

/** Die Gesamtstrecke einer Route in Kilometern. */
export function totalKm(cum: number[]): number {
  return cum[cum.length - 1] ?? 0;
}

/* --- Der Weg selbst ------------------------------------------------------ */

/**
 * Ein Weg, wie ihn das Gehen braucht: eine Punktkette, dazu die Stellen, an
 * denen eine Station liegt.
 *
 * Bis hierher waren beide dasselbe – die Stationen *waren* der Weg, und
 * zwischen zweien lag eine gerade Linie. Mit den römischen Straßen liegen
 * zwischen zwei Stationen plötzlich hundert Stützpunkte, und die Station ist
 * nur noch jeder hundertste davon. `stopAt` hält fest, welcher.
 *
 * Ohne Straßendaten ist `stopAt` genau `[0, 1, 2, …]`, und alles rechnet wie
 * vorher. Das ist Absicht: Der Weg ohne Straßen ist kein Sonderfall, sondern
 * derselbe Weg mit einem Stützpunkt je Station.
 */
export interface Weg {
  /** Alle Stützpunkte, in der Reihenfolge des Gehens. */
  points: LatLon[];
  /** Wo in `points` die Stationen liegen – so lang wie die Stationsliste. */
  stopAt: number[];
  /** Je Etappe: folgt sie einer belegten Straße oder der Luftlinie? */
  onRoad: boolean[];
  /** Aufsummierte Kilometer über `points`. */
  cum: number[];
}

/** Zwei Punkte gelten als derselbe, wenn sie keine zehn Meter trennen. */
const SAME_M = 10;

/**
 * Stationen und – wo vorhanden – die Straße dazwischen zu einem Weg fügen.
 *
 * `legs[i]` ist der Verlauf von Station i zu Station i+1, einschließlich
 * beider Enden; `null` heißt: für diese Etappe gibt es keinen Straßenverlauf,
 * dort bleibt die Luftlinie.
 */
export function buildWeg(stops: LatLon[], legs?: (LatLon[] | null | undefined)[]): Weg {
  const points: LatLon[] = [];
  const stopAt: number[] = [];
  const onRoad: boolean[] = [];
  if (stops.length === 0) return { points, stopAt, onRoad, cum: [0] };

  points.push(stops[0]);
  stopAt.push(0);
  for (let i = 1; i < stops.length; i++) {
    const leg = legs?.[i - 1];
    if (leg && leg.length > 1) {
      // Der erste Punkt der Etappe ist die vorige Station – die steht schon da.
      for (let k = 1; k < leg.length; k++) points.push(leg[k]);
      // Der Weg muss an der Station enden, auch wenn der Verlauf kurz davor
      // aufhört: Sonst läge die Station neben ihrem eigenen Weg.
      if (distanceKm(points[points.length - 1], stops[i]) * 1000 > SAME_M) points.push(stops[i]);
      onRoad.push(true);
    } else {
      points.push(stops[i]);
      onRoad.push(false);
    }
    stopAt.push(points.length - 1);
  }
  return { points, stopAt, onRoad, cum: cumulativeKm(legDistances(points)) };
}

/**
 * Kilometer einer Etappe: von Station `i` zur nächsten.
 *
 * Über die Straße sind das mehr als über die Luftlinie – und genau das ist die
 * Aussage. Ohne Straßendaten kommt dieselbe Zahl heraus wie bisher aus
 * `legDistances()`, weil der Weg dann die Stationskette ist.
 */
export function legKm(weg: Weg, i: number): number {
  const a = weg.stopAt[i];
  const b = weg.stopAt[i + 1];
  if (a === undefined || b === undefined) return 0;
  return kmAtT(weg.cum, b) - kmAtT(weg.cum, a);
}

/**
 * Stationsmaß → Wegmaß.
 *
 * Die abgespielte Route auf der flachen Karte zählt in Stationen: 2,5 heißt
 * „auf halber Strecke zwischen der dritten und der vierten". Der Weg zählt in
 * Stützpunkten, und zwischen zwei Stationen können hundert liegen. Umgerechnet
 * wird über die **Strecke**, nicht über die Zahl der Punkte – sonst liefe der
 * Reisende dort schnell, wo die Straße gerade ist, und langsam in den Kurven.
 */
export function tForStation(weg: Weg, s: number): number {
  const max = weg.stopAt.length - 1;
  if (max < 0) return 0;
  const clamped = Math.max(0, Math.min(max, s));
  const i = Math.floor(clamped);
  const f = clamped - i;
  const vonKm = kmAtT(weg.cum, weg.stopAt[i]);
  if (f <= 0 || i >= max) return tAtKm(weg.cum, vonKm);
  const bisKm = kmAtT(weg.cum, weg.stopAt[i + 1]);
  return tAtKm(weg.cum, vonKm + (bisKm - vonKm) * f);
}

/** Die zuletzt erreichte Station an der Stelle `t` des Weges. */
export function stopIndexAt(weg: Weg, t: number): number {
  let i = 0;
  // Ein Hauch Spielraum: `t` entsteht aus Kilometern, und die letzte Stelle
  // hinter dem Komma soll nicht darüber entscheiden, ob man schon da ist.
  while (i + 1 < weg.stopAt.length && weg.stopAt[i + 1] <= t + 1e-6) i++;
  return i;
}

/**
 * Kilometer → Etappenmaß. `pointAt()` zählt in Etappen (1,5 = Mitte der
 * zweiten), das Gehen zählt in Kilometern – gleich lange Sekunden sollen
 * gleich lange Wege sein und nicht gleich viele Stationen.
 */
export function tAtKm(cum: number[], km: number): number {
  const max = cum.length - 1;
  if (max <= 0) return 0;
  const ziel = Math.max(0, Math.min(totalKm(cum), km));
  for (let i = 0; i < max; i++) {
    const laenge = cum[i + 1] - cum[i];
    if (ziel <= cum[i + 1]) {
      // Eine Etappe ohne Länge (zweimal derselbe Ort) hat keine Mitte.
      return laenge <= 0 ? i + 1 : i + (ziel - cum[i]) / laenge;
    }
  }
  return max;
}

/** Etappenmaß → Kilometer, die Gegenrichtung zu `tAtKm`. */
export function kmAtT(cum: number[], t: number): number {
  const max = cum.length - 1;
  if (max <= 0) return 0;
  const clamped = Math.max(0, Math.min(max, t));
  const i = Math.floor(clamped);
  if (i >= max) return totalKm(cum);
  return cum[i] + (cum[i + 1] - cum[i]) * (clamped - i);
}
