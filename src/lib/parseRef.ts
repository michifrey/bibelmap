import type { Lang } from '../i18n';
import { BOOKS, BOOK_BY_OSIS } from '../data/books';
import { ALIASES } from './bookAliases';

/**
 * Eine erkannte Bibelstelle. Der Vers wird gelesen, aber nicht gebraucht –
 * die Karte arbeitet kapitelweise.
 */
export interface ParsedRef {
  osis: string;
  chapter: number;
  verse?: number;
  /** Wie die Stelle lesbar heißt: „Apostelgeschichte 13". */
  label: string;
}

function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[.\s]/g, '');
}

/**
 * Buchname (voll, in Klammern, Kurzform) → OSIS. Einmal gebaut, dann fest.
 * Die Kurzformen kommen aus `src/data/bookAliases.json`; im Suchfeld gelten
 * beide Listen, denn dort steht der Buchname allein da – „Am 3" kann nur Amos
 * meinen, während dieselbe Zeichenfolge in einem Fließtext meist „am 3." ist.
 */
const LEXICON: Map<string, string> = (() => {
  const map = new Map<string, string>();
  for (const b of BOOKS) {
    // „1. Mose (Genesis)" liefert beide Namen.
    for (const raw of [...b.de.split(/[()]/), b.en, b.osis]) {
      const key = norm(raw);
      if (key) map.set(key, b.osis);
    }
  }
  for (const [osis, entry] of Object.entries(ALIASES)) {
    for (const a of [...(entry.text ?? []), ...(entry.typed ?? [])]) map.set(norm(a), osis);
  }
  return map;
})();

/**
 * Erkennt eine Bibelstelle in dem, was jemand ins Suchfeld tippt:
 * „Apg 13", „Apg 13,4", „Acts 13:4", „1. Mose 12", „Mk 6".
 * Ohne Kapitel gibt es keinen Treffer – „Jona" ist ein Ort und ein Buch, und
 * die Ortssuche kann das besser entscheiden.
 */
export function parseRef(query: string, lang: Lang): ParsedRef | null {
  const q = query.trim();
  if (!q) return null;
  const m = q.match(/^(.+?)\s*(\d{1,3})(?:\s*[,:]\s*(\d{1,3}))?\s*$/);
  if (!m) return null;
  const osis = LEXICON.get(norm(m[1]));
  if (!osis) return null;
  const book = BOOK_BY_OSIS[osis];
  if (!book) return null;
  const chapter = Math.min(book.chapters, Math.max(1, Number(m[2])));
  const verse = m[3] ? Number(m[3]) : undefined;
  return {
    osis,
    chapter,
    verse,
    label: `${lang === 'de' ? book.de.replace(/\s*\(.*\)$/, '') : book.en} ${chapter}`,
  };
}
