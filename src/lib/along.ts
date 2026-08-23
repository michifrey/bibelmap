import type { Place } from '../types';
import { distanceKm, type LatLon } from './route';

/**
 * Was lag am Weg?
 *
 * Die Frage stellt jeder, der eine Reise nacherzählt: Zwischen Jerusalem und
 * Jericho liegen 29 Kilometer – aber was liegt dazwischen? Die App kennt 1.335
 * Orte mit Koordinaten; sie kann die Frage beantworten, ohne dass jemand etwas
 * dazuerfindet.
 *
 * Gerechnet wird gegen die **Luftlinie** zwischen zwei Stationen, nicht gegen
 * den tatsächlichen Weg. Wer von Jerusalem nach Jericho ging, nahm die Straße
 * durchs Wadi Qelt und nicht die Gerade; ein Ort, der hier auftaucht, lag also
 * „in der Gegend", nicht „an der Straße". Genau so steht es auch in der
 * Oberfläche.
 *
 * Zwei Maße je Ort:
 *   quer  – Abstand von der Linie (wie weit abseits)
 *   laengs – Abstand von der ersten Station entlang der Linie (wie weit schon)
 *
 * Die Rechnung ist eben, nicht sphärisch: auf Etappen dieser Länge – zehn bis
 * einige hundert Kilometer – bleibt der Unterschied unter dem, was die
 * Koordinaten selbst hergeben.
 */
/**
 * Was zählt als Ort am Weg.
 *
 * Nur, was einen Punkt auf dem Boden bezeichnet. „Galiläa" und „Basan" sind
 * Landschaften; ihre eine Koordinate ist ein Mittelpunkt, und ob eine
 * Landschaft „am Weg lag", sagt sie nicht. Dasselbe gilt für Volksgruppen,
 * Gebirgszüge und Gewässer. Wer hier auftaucht, ist ein Ort, an dem jemand
 * stehen konnte.
 */
const PUNKTHAFT = new Set([
  'settlement',
  'mountain',
  'hill',
  'spring',
  'well',
  'campsite',
  'ford',
  'fortification',
  'mountain pass',
  'structure',
]);

/**
 * Wie nah an einer Station ein Ort liegen darf, ohne mit ihr verwechselt zu
 * werden. „Zion" trägt in den Daten dieselben Koordinaten wie Jerusalem – als
 * Ort auf dem Weg nach Hebron wäre es eine Albernheit.
 *
 * Die Grenze ist gemessen, nicht geraten: Zion liegt 0,00 km von Jerusalem, der
 * Ölberg 1,10 km. Bei 1,0 km fällt das eine heraus und das andere bleibt – und
 * der Ölberg ist auf dem Weg nach Jericho genau das, was man nennen will.
 */
const MIN_ABSTAND_KM = 1;


export interface AlongHit {
  place: Place;
  /** Abstand zur Luftlinie in Kilometern. */
  quer: number;
  /** Zurückgelegter Anteil der Etappe, in Kilometern ab der ersten Station. */
  laengs: number;
}

/**
 * Orte in der Nähe der Luftlinie von `a` nach `b`.
 *
 * `maxQuer` ist der erlaubte Abstand von der Linie. Die Vorgabe von 8 km ist
 * grob zwei Stunden zu Fuß abseits – noch „unterwegs", nicht mehr „irgendwo in
 * der Gegend". Mit 15 km standen auf dem Weg von Jerusalem nach Jericho Orte,
 * die vierzehn Kilometer daneben lagen; das ist keine Antwort auf die Frage.
 *
 * Die beiden Endpunkte selbst kommen nicht vor – sie sind die Stationen.
 */
export function placesAlong(
  places: Place[],
  a: LatLon,
  b: LatLon,
  maxQuer = 8,
  limit = 8,
  /** Namen der beiden Stationen – sie sollen nicht als Ort am Weg erscheinen. */
  stationen: string[] = [],
): AlongHit[] {
  const gesamt = distanceKm(a, b);
  if (gesamt < 1) return [];

  // Ebene Näherung: ein Grad Breite überall gleich lang, ein Grad Länge um den
  // Kosinus der mittleren Breite gestaucht.
  const kmProGrad = 111.32;
  const mittelLat = ((a[0] + b[0]) / 2) * (Math.PI / 180);
  const kx = kmProGrad * Math.cos(mittelLat);
  const ky = kmProGrad;

  const ax = a[1] * kx;
  const ay = a[0] * ky;
  const bx = b[1] * kx;
  const by = b[0] * ky;
  const dx = bx - ax;
  const dy = by - ay;
  const laenge2 = dx * dx + dy * dy;
  if (laenge2 === 0) return [];

  // Die Bibel kennt mehrere Jerichos und mehrere Ramas. Ohne diesen Filter
  // stünde „Jericho" als Ort auf dem Weg nach Jericho – ein zweiter Datensatz
  // gleichen Namens, 1,6 km neben der Linie.
  const tabu = new Set(stationen);

  const out: AlongHit[] = [];
  for (const p of places) {
    if (!p.types.some((ty) => PUNKTHAFT.has(ty))) continue;
    if (tabu.has(p.nameDe ?? p.name) || tabu.has(p.name)) continue;
    const px = p.lon * kx;
    const py = p.lat * ky;
    // Anteil t auf der Strecke; außerhalb von [0,1] liegt der Ort nicht mehr
    // zwischen den Stationen, sondern davor oder dahinter.
    const t = ((px - ax) * dx + (py - ay) * dy) / laenge2;
    if (t <= 0 || t >= 1) continue;
    const fx = ax + dx * t;
    const fy = ay + dy * t;
    const quer = Math.hypot(px - fx, py - fy);
    if (quer > maxQuer) continue;
    // In Kilometern, nicht in Anteilen: auf einer Etappe von 217 km wären
    // zwei Prozent vier Kilometer, auf einer von 23 km ein halber.
    const hier: LatLon = [p.lat, p.lon];
    if (distanceKm(a, hier) < MIN_ABSTAND_KM || distanceKm(b, hier) < MIN_ABSTAND_KM) continue;
    out.push({ place: p, quer, laengs: t * gesamt });
  }

  // Gleiche Namen nur einmal: die Bibel kennt mehrere Ramas, und drei davon
  // liegen in den Daten auf demselben Punkt. Zweimal „Rama" untereinander sähe
  // aus wie ein Fehler; es bleibt das mit den meisten Erwähnungen.
  const proName = new Map<string, AlongHit>();
  for (const h of out) {
    const name = h.place.nameDe ?? h.place.name;
    const da = proName.get(name);
    if (!da || h.place.mentionCount > da.place.mentionCount) proName.set(name, h);
  }
  /*
   * Nahe beieinanderliegende Treffer werden bewusst **nicht** zusammengefasst.
   * Auf Davids Weg stehen „Jerusalem", „Zion" und „Stadt Davids" nebeneinander,
   * und das sieht nach einer Dublette aus. Gemessen sind es 0,00 km und 0,36 km
   * Abstand – aber Ölberg und Bethphage liegen 0,49 km auseinander, Bethphage
   * und Bethanien 0,82 km. Jede Schwelle, die das eine zusammenfasst, wirft das
   * andere zusammen: drei Orte, die die Evangelien getrennt nennen. Lieber ein
   * Name zu viel als eine Zusammenlegung, die die Daten nicht hergeben.
   */
  const einmal = [...proName.values()];

  // Der Korridor entscheidet, was „am Weg" heißt – innerhalb davon entscheidet
  // die Bekanntheit, wen man nennt. Andersherum (erst die nächsten) standen auf
  // dem Weg von Nazareth nach Kapernaum lauter Namen, die niemand kennt,
  // während Kana und der Tabor herausfielen.
  const gewaehlt =
    einmal.length <= limit
      ? einmal
      : [...einmal].sort((x, y) => y.place.mentionCount - x.place.mentionCount).slice(0, limit);
  // Ausgegeben wird in der Reihenfolge der Etappe: so liest sich die Liste wie
  // der Weg selbst.
  return gewaehlt.sort((x, y) => x.laengs - y.laengs);
}
