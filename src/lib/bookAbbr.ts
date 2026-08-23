import { BOOKS } from '../data/books';
import { typedAliases } from './bookAliases';

// Maps the German/English book abbreviations used in genealogy person refs
// (e.g. "Gen 5:1-5", "1Sam 16", "Apg 2") to the OSIS book codes used across
// the app. Returns null for anything unrecognised (e.g. apocrypha).
//
// Die Kurzformen stehen nicht mehr hier, sondern in `src/data/bookAliases.json`
// – derselben Liste, aus der die Suche und der Medien-Build lesen.

/** Kleingeschrieben, ohne Punkte, Leerzeichen und Umlautzeichen. */
function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[.\s]/g, '');
}

/** Kurzform (normalisiert) → OSIS. Einmal gebaut, dann fest. */
const ABBR: Map<string, string> = (() => {
  const map = new Map<string, string>();
  for (const b of BOOKS) {
    // „1. Mose (Genesis)" trägt beide Namen; dazu das OSIS-Kürzel selbst.
    for (const raw of [...b.de.split(/[()]/), b.en, b.osis]) {
      const key = norm(raw);
      if (key) map.set(key, b.osis);
    }
    for (const a of typedAliases(b.osis)) map.set(norm(a), b.osis);
  }
  return map;
})();

/** OSIS book code for a human ref like "1Sam 16:1" or "Gen 5:1-5"; null if unknown. */
export function osisFromRef(ref: string): string | null {
  const m = ref.trim().match(/^([1-3]?\s*[\p{L}]+)/u);
  if (!m) return null;
  return ABBR.get(norm(m[1])) ?? null;
}
