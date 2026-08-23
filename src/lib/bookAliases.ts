import table from '../data/bookAliases.json';

/**
 * Kurzformen der Bibelbücher, die sich nicht mechanisch aus den vollen Namen
 * ergeben – die einzige Stelle im Projekt, an der sie stehen. Sowohl die
 * Oberfläche (`parseRef`, `bookAbbr`) als auch der Medien-Build
 * (`scripts/lib/bibleref.mjs`) lesen diese Datei.
 *
 * Zwei Listen, weil die Lage entscheidet:
 *
 * - `text`  – im Fließtext eindeutig. „Ri 4" in einem Folgentitel meint Richter.
 * - `typed` – nur dort, wo jemand einen Buchnamen *eingibt* und sonst nichts
 *             danebensteht. „Am 3" ist im Suchfeld Amos, in einem Satz aber
 *             fast immer „am 3.". Dasselbe gilt für „Hi", „Off", „1Th".
 */
export interface AliasEntry {
  text?: string[];
  typed?: string[];
}

export const ALIASES = table as Record<string, AliasEntry>;

/** Alle Kurzformen eines Buches, für Eingaben – dort gelten beide Listen. */
export function typedAliases(osis: string): string[] {
  const e = ALIASES[osis];
  return e ? [...(e.text ?? []), ...(e.typed ?? [])] : [];
}
