import type { Movement, Pattern } from '../data/bookPortraits';

/**
 * Die Schriftrolle eines Buches – die Rechnerei dahinter.
 *
 * Ein Buchporträt zeichnet seine Züge auf **eine** Achse: die Kapitel, von 1
 * bis zum letzten. Alles hängt daran – die Felder der Rolle, die Bögen der
 * Muster darüber, die Marken der Zeitschiene darunter und die Balken der
 * Figuren daneben. Dass es nur eine Achse gibt, ist der eigentliche Einfall:
 * Man sieht auf einen Blick, dass Josef vierzehn Kapitel bekommt und die
 * Schöpfung zwei, und dass das Muster „dreimal dieselbe Bewegung" genau dort
 * aufhört, wo Abraham anfängt.
 *
 * Diese Datei rechnet nur; sie zeichnet nichts und kennt kein React. Das ist
 * der Grund, warum `npm run check:portraits` sie benutzen kann: Die Prüfung
 * misst dieselben Zahlen, die die Oberfläche zeichnet, und nicht eine
 * Nachbildung davon.
 *
 * **Lückenlos, nicht überlappend.** Die Züge eines Buches müssen zusammen
 * genau die Kapitel 1 bis n abdecken. Wäre ein Kapitel in keinem Zug, fehlte
 * es auf der Rolle, ohne dass man es sähe – die Felder lägen einfach etwas
 * weiter auseinander. `gaps()` sagt, ob das der Fall ist.
 */

/** Ein Feld der Rolle: wo es anfängt, wie breit es ist. */
export interface Field {
  id: string;
  /** Linker Rand und Breite in Einheiten der Zeichenfläche. */
  x: number;
  w: number;
  /** Mitte – dort steht die Beschriftung. */
  mid: number;
  from: number;
  to: number;
}

/**
 * Wo ein Kapitel auf der Achse liegt. `chapter` zählt ab 1; der linke Rand von
 * Kapitel 1 ist 0, der rechte Rand des letzten Kapitels ist `width`.
 */
export function chapterX(chapter: number, chapters: number, width: number): number {
  return ((chapter - 1) / chapters) * width;
}

/** Die Felder der Rolle, in der Reihenfolge der Züge. */
export function layout(movements: Movement[], chapters: number, width: number): Field[] {
  return movements.map((m) => {
    const x = chapterX(m.from, chapters, width);
    const w = chapterX(m.to + 1, chapters, width) - x;
    return { id: m.id, x, w, mid: x + w / 2, from: m.from, to: m.to };
  });
}

/**
 * Kapitel, die in keinem Zug stehen, und solche, die in zweien stehen.
 * Leer heißt: die Rolle deckt das Buch genau ab.
 */
export function gaps(movements: Movement[], chapters: number): { missing: number[]; doubled: number[] } {
  const count = new Map<number, number>();
  for (const m of movements) {
    for (let k = m.from; k <= m.to; k++) count.set(k, (count.get(k) ?? 0) + 1);
  }
  const missing: number[] = [];
  const doubled: number[] = [];
  for (let k = 1; k <= chapters; k++) {
    const n = count.get(k) ?? 0;
    if (n === 0) missing.push(k);
    else if (n > 1) doubled.push(k);
  }
  // Kapitel jenseits des Buches zählen als doppelt vergeben – sie gibt es nicht.
  for (const k of count.keys()) if (k > chapters || k < 1) doubled.push(k);
  return { missing, doubled: [...new Set(doubled)].sort((a, b) => a - b) };
}

/**
 * Der Bogen eines Musters über der Rolle: von der Mitte des ersten bis zur
 * Mitte des letzten Zuges, den es berührt.
 *
 * Die Höhe steigt mit der Spannweite, aber gedämpft (Wurzel): Ein Bogen über
 * zwei Nachbarfelder wäre sonst ein Strich, einer über das halbe Buch eine
 * Kuppel, die oben aus dem Bild läuft.
 */
export function arcPath(x1: number, x2: number, baseY: number, maxRise: number): string {
  const span = Math.abs(x2 - x1);
  const rise = Math.min(maxRise, maxRise * Math.sqrt(span / 100));
  const mid = (x1 + x2) / 2;
  return `M${x1.toFixed(1)} ${baseY.toFixed(1)} Q${mid.toFixed(1)} ${(baseY - rise * 2).toFixed(1)} ${x2.toFixed(1)} ${baseY.toFixed(1)}`;
}

/** Die Felder, die ein Muster berührt – in der Reihenfolge der Rolle. */
export function fieldsOf(pattern: Pattern, fields: Field[]): Field[] {
  return fields.filter((f) => pattern.movements.includes(f.id));
}

/**
 * Die Kapitelzahlen, die unter der Rolle stehen. Alle 50 wären ein grauer
 * Streifen; gezeigt wird deshalb jedes fünfte oder zehnte – je nachdem, wie
 * lang das Buch ist – und immer das letzte.
 */
export function ticks(chapters: number): number[] {
  const step = chapters > 60 ? 20 : chapters > 25 ? 10 : chapters > 10 ? 5 : 1;
  const out: number[] = [];
  for (let k = 1; k <= chapters; k += step) out.push(k);
  if (out[out.length - 1] !== chapters) out.push(chapters);
  return out;
}
