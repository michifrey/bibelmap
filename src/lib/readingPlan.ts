import type { Movement } from '../data/bookPortraits';

/**
 * Leseplan: ein Buch auf Tage verteilt.
 *
 * **Warum gerechnet und nicht geschrieben.** Ein Leseplan ist eine Liste von
 * Kapitelspannen – und damit genau die Sorte Daten, die man besser ausrechnet
 * als abtippt. Wer „1. Mose in 30 Tagen" von Hand einträgt, macht irgendwo
 * einen Fehler: Kapitel 24 zweimal, Kapitel 31 gar nicht. Man sieht es nicht,
 * und wer danach liest, merkt es Wochen später.
 *
 * Deshalb zwei Funktionen, beide rein, beide prüfbar:
 *
 *   `planByDays`       teilt n Kapitel auf t Tage, so gleichmäßig es geht
 *   `planFromMovements` nimmt die Züge des Buchporträts als Tage
 *
 * Der zweite ist der eigentliche Punkt dieser Datei. Ein gleichmäßiger Plan
 * schneidet mitten durch: Tag 4 endet in 1. Mose 12,5, mitten im Aufbruch
 * Abrahams. Die Züge der Rolle schneiden dort, wo das Buch selbst schneidet –
 * Schöpfung, Griff, Flut, Babel, Abraham, Jakob, Josef –, und ein Leseplan,
 * der danach geht, liest sieben ganze Geschichten statt fünfzig Stücke.
 *
 * **Was beide garantieren müssen.** Jedes Kapitel kommt genau einmal vor, in
 * der Reihenfolge des Buches, und kein Tag ist leer. `covers()` rechnet das
 * nach; `npm run check:plans` verlangt es für jedes Buch und jede Tageszahl.
 */

/** Ein Tag des Plans: von Kapitel bis Kapitel. */
export interface Day {
  /** 1-basiert – „Tag 3". */
  day: number;
  from: number;
  to: number;
  /** Wie viele Kapitel an diesem Tag zu lesen sind. */
  chapters: number;
  /** Der Titel des Zuges, wenn der Plan den Zügen folgt. */
  title?: { de: string; en: string };
}

/**
 * n Kapitel auf t Tage verteilen.
 *
 * Die Reste werden **vorn** verteilt, nicht hinten: Bei 50 Kapiteln auf 7 Tage
 * sind es 7,14 je Tag, also einmal 8 und sechsmal 7 – und der volle Tag steht
 * am Anfang, solange man noch Schwung hat. Hinten anzuhängen hieße, die
 * letzten Tage schwerer zu machen als die ersten; genau dort hören die meisten
 * auf.
 *
 * Mehr Tage als Kapitel gibt es nicht: Ein leerer Tag ist kein Plan, sondern
 * eine Lücke. Die Tageszahl wird dann auf die Kapitelzahl geklemmt.
 */
export function planByDays(chapters: number, days: number): Day[] {
  const t = Math.max(1, Math.min(Math.floor(days), chapters));
  const grund = Math.floor(chapters / t);
  const rest = chapters % t;

  const out: Day[] = [];
  let k = 1;
  for (let i = 0; i < t; i++) {
    const wie = grund + (i < rest ? 1 : 0);
    out.push({ day: i + 1, from: k, to: k + wie - 1, chapters: wie });
    k += wie;
  }
  return out;
}

/** Die Züge des Buches als Tage – ein Zug, ein Tag. */
export function planFromMovements(movements: Movement[]): Day[] {
  return movements.map((m, i) => ({
    day: i + 1,
    from: m.from,
    to: m.to,
    chapters: m.to - m.from + 1,
    title: m.title,
  }));
}

/**
 * Deckt der Plan das Buch genau ab? Gibt zurück, was nicht stimmt – leer heißt
 * in Ordnung. Dieselbe Frage wie `gaps()` bei der Schriftrolle, und aus
 * demselben Grund: Eine Lücke sieht man einer Liste von Spannen nicht an.
 */
export function covers(plan: Day[], chapters: number): string[] {
  const fehler: string[] = [];
  if (!plan.length) return ['der Plan hat keinen einzigen Tag'];

  const zaehler = new Map<number, number>();
  let zuletzt = 0;
  for (const d of plan) {
    if (d.from > d.to) fehler.push(`Tag ${d.day}: von ${d.from} bis ${d.to} läuft rückwärts`);
    if (d.from <= zuletzt) fehler.push(`Tag ${d.day}: fängt bei ${d.from} an, Tag davor endete bei ${zuletzt}`);
    if (d.chapters !== d.to - d.from + 1) {
      fehler.push(`Tag ${d.day}: chapters sagt ${d.chapters}, die Spanne ${d.from}–${d.to} hat ${d.to - d.from + 1}`);
    }
    zuletzt = d.to;
    for (let k = d.from; k <= d.to; k++) zaehler.set(k, (zaehler.get(k) ?? 0) + 1);
  }

  const fehlen: number[] = [];
  const doppelt: number[] = [];
  for (let k = 1; k <= chapters; k++) {
    const n = zaehler.get(k) ?? 0;
    if (n === 0) fehlen.push(k);
    else if (n > 1) doppelt.push(k);
  }
  for (const k of zaehler.keys()) if (k < 1 || k > chapters) fehler.push(`Kapitel ${k} gibt es in diesem Buch nicht`);
  if (fehlen.length) fehler.push(`Kapitel ohne Tag: ${fehlen.join(', ')}`);
  if (doppelt.length) fehler.push(`Kapitel an mehreren Tagen: ${doppelt.join(', ')}`);
  return fehler;
}

/**
 * Die Tageszahlen, die zur Auswahl stehen – ohne die, die für dieses Buch
 * keinen Sinn ergeben.
 *
 * „In 30 Tagen" ist bei Obadja mit einem Kapitel kein Plan, sondern ein
 * Scherz: 29 leere Tage. Angeboten wird deshalb nur, was höchstens so viele
 * Tage hat wie das Buch Kapitel – und ein Buch mit einem Kapitel bekommt gar
 * keine Auswahl, sondern einen Tag.
 */
export function daySteps(chapters: number, angebot = [7, 14, 30, 90]): number[] {
  return angebot.filter((d) => d <= chapters);
}

/** „3" oder „3–9" – wie eine Spanne dasteht. */
export function spanLabel(d: Day): string {
  return d.from === d.to ? String(d.from) : `${d.from}–${d.to}`;
}
