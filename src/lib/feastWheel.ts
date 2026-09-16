/**
 * Die Geometrie des Festkreises – reine Rechnung, ohne React.
 *
 * Sie liegt hier und nicht in der Komponente, weil sie die einzige Stelle ist,
 * an der sich ein Fehler nicht zeigt, sondern nur schief aussieht: Ein
 * vertauschtes Vorzeichen im Bogen dreht das Jahr rückwärts, und niemand
 * bemerkt es, solange er die Monate nicht mitliest. `npm run check:feasts`
 * rechnet die Funktionen von hier nach.
 *
 * Alle Winkel in Grad, **im Uhrzeigersinn ab oben**: 0° ist zwölf Uhr, 90° ist
 * drei Uhr. Der Mittelpunkt ist der Ursprung – das SVG bringt sein viewBox
 * entsprechend mit.
 */

export interface Point {
  x: number;
  y: number;
}

/** Punkt auf dem Kreis mit Radius `r` unter dem Winkel `deg`. */
export function polar(deg: number, r: number): Point {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: r * Math.cos(rad), y: r * Math.sin(rad) };
}

/** Zahl mit drei Nachkommastellen – kürzt die Pfade merklich. */
function n(v: number): string {
  return Math.abs(v) < 1e-9 ? '0' : v.toFixed(3).replace(/\.?0+$/, '');
}

/**
 * Ein Ring**stück**: der Kuchen ohne Spitze, von `rIn` bis `rOut` und von `a0`
 * bis `a1`. Für `rIn = 0` fällt der innere Bogen weg und es wird ein echtes
 * Kuchenstück.
 */
export function arcPath(a0: number, a1: number, rIn: number, rOut: number): string {
  const groß = Math.abs(a1 - a0) > 180 ? 1 : 0;
  const p1 = polar(a0, rOut);
  const p2 = polar(a1, rOut);
  if (rIn <= 0) {
    return `M0 0L${n(p1.x)} ${n(p1.y)}A${n(rOut)} ${n(rOut)} 0 ${groß} 1 ${n(p2.x)} ${n(p2.y)}Z`;
  }
  const p3 = polar(a1, rIn);
  const p4 = polar(a0, rIn);
  return (
    `M${n(p1.x)} ${n(p1.y)}` +
    `A${n(rOut)} ${n(rOut)} 0 ${groß} 1 ${n(p2.x)} ${n(p2.y)}` +
    `L${n(p3.x)} ${n(p3.y)}` +
    `A${n(rIn)} ${n(rIn)} 0 ${groß} 0 ${n(p4.x)} ${n(p4.y)}Z`
  );
}

/**
 * Der Weg von einer Drehung zur nächsten – immer der kürzere.
 *
 * Die Drehung wird als fortlaufende Zahl geführt, nicht als Winkel zwischen 0
 * und 360: Sonst spränge das Rad beim Übergang von Adar nach Nisan einmal ganz
 * herum, statt die drei Wochen zu drehen, die dazwischenliegen. `ziel` ist der
 * gewünschte Winkel modulo 360; zurück kommt der Wert in der Nähe von `von`,
 * der denselben Winkel meint.
 */
export function shortestTurn(von: number, ziel: number): number {
  let diff = (((ziel - von) % 360) + 360) % 360;
  // Bei genau einer halben Umdrehung sind beide Wege gleich lang; dann dreht
  // das Rad vorwärts, damit „weiter" nie rückwärts aussieht.
  if (diff > 180) diff -= 360;
  return von + diff;
}

/** Weich an, weich aus – das Rad läuft nicht an und bremst nicht abrupt. */
export function easeInOut(t: number): number {
  const x = Math.min(1, Math.max(0, t));
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

/**
 * Winkel eines Tages im Jahr. Tag 0 (der 1. Nisan) liegt bei 0° – oben.
 */
export function dayAngle(tag: number, jahresTage: number): number {
  return (tag / jahresTage) * 360;
}

/**
 * Winkel, den ein Fest im Rad einnimmt.
 *
 * Ein Fest von einem Tag misst bei 354 Tagen genau 1,02° – ein Strich, den
 * niemand trifft und auf dem kein Name Platz hat. Deshalb eine Untergrenze:
 * Was schmaler wäre, wird auf `mindestens` aufgeweitet, und zwar **um seine
 * Mitte**, damit das Fest dort stehen bleibt, wo es im Jahr liegt. Die Breite
 * stimmt dann nicht mehr; der Ort schon, und der ist hier die Aussage.
 */
export function feastSpan(
  start: number,
  tage: number,
  jahresTage: number,
  mindestens: number,
): { from: number; to: number; mid: number } {
  const a0 = dayAngle(start, jahresTage);
  const a1 = dayAngle(start + Math.max(1, tage), jahresTage);
  const mid = (a0 + a1) / 2;
  const halb = Math.max(a1 - a0, mindestens) / 2;
  return { from: mid - halb, to: mid + halb, mid };
}
