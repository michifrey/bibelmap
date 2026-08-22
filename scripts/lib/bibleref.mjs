// Find Bible references inside free text — podcast episode titles, video
// descriptions — in German and English notation.
//
//   "Genesis 18 – Teil 1"                          -> Gen 18
//   "Markus 6,30-44 | Die Speisung der 5000"       -> Mark 6:30-44
//   "Romans 8:28-30"                               -> Rom 8:28-30
//   "1. Könige 18 und 19"                          -> 1Kgs 18, 1Kgs 19
//
// The book lexicon is derived from src/data/books.ts so the two never drift
// apart; only irregular short forms are listed by hand below.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BOOKS_TS = path.resolve(__dirname, '..', '..', 'src', 'data', 'books.ts');

/** Short forms that are not mechanically derivable from the full names. */
const EXTRA_ALIASES = {
  Gen: ['1Mo', '1 Mo'],
  Exod: ['2Mo', '2 Mo', 'Ex'],
  Lev: ['3Mo', '3 Mo', 'Lev'],
  Num: ['4Mo', '4 Mo', 'Num'],
  Deut: ['5Mo', '5 Mo', 'Dtn', 'Dt'],
  Josh: ['Jos'],
  Judg: ['Ri'],
  '1Sam': ['1Sam', '1 Sam'],
  '2Sam': ['2Sam', '2 Sam'],
  '1Kgs': ['1Kön', '1 Kön', '1Kge'],
  '2Kgs': ['2Kön', '2 Kön', '2Kge'],
  '1Chr': ['1Chr', '1 Chr'],
  '2Chr': ['2Chr', '2 Chr'],
  Neh: ['Neh'],
  Ps: ['Psalm', 'Ps'],
  Prov: ['Spr'],
  Eccl: ['Pred', 'Koh', 'Kohelet'],
  Song: ['Hld', 'Hoheslied'],
  Isa: ['Jes'],
  Jer: ['Jer'],
  Lam: ['Klgl'],
  Ezek: ['Hes', 'Ez'],
  Dan: ['Dan'],
  Hos: ['Hos'],
  Obad: ['Obd'],
  Jonah: ['Jona'],
  Mic: ['Mi'],
  Nah: ['Nah'],
  Hab: ['Hab'],
  Zeph: ['Zef'],
  Hag: ['Hag'],
  Zech: ['Sach'],
  Mal: ['Mal'],
  Matt: ['Mt', 'Matth'],
  Mark: ['Mk', 'Mark'],
  Luke: ['Lk', 'Luk'],
  John: ['Joh', 'Jh'],
  Acts: ['Apg', 'Apostelgesch'],
  Rom: ['Röm', 'Rö'],
  '1Cor': ['1Kor', '1 Kor'],
  '2Cor': ['2Kor', '2 Kor'],
  Gal: ['Gal'],
  Eph: ['Eph'],
  Phil: ['Phil', 'Php'],
  Col: ['Kol'],
  '1Thess': ['1Thess', '1 Thess'],
  '2Thess': ['2Thess', '2 Thess'],
  '1Tim': ['1Tim', '1 Tim'],
  '2Tim': ['2Tim', '2 Tim'],
  Titus: ['Tit'],
  Phlm: ['Phlm', 'Philem'],
  Heb: ['Hebr', 'Heb'],
  Jas: ['Jak'],
  '1Pet': ['1Petr', '1 Petr', '1Pet'],
  '2Pet': ['2Petr', '2 Petr', '2Pet'],
  '1John': ['1Joh', '1 Joh'],
  '2John': ['2Joh', '2 Joh'],
  '3John': ['3Joh', '3 Joh'],
  Jude: ['Jud'],
  Rev: ['Offb', 'Apk'],
};

/** Read the book table out of src/data/books.ts without importing TypeScript. */
export function loadBooks() {
  const src = fs.readFileSync(BOOKS_TS, 'utf8');
  const re =
    /num: (\d+), osis: '([A-Za-z0-9]+)', de: '([^']+)', en: '([^']+)', chapters: (\d+), era: '([a-z]+)'/g;
  const books = [];
  for (const m of src.matchAll(re)) {
    books.push({
      num: Number(m[1]),
      osis: m[2],
      de: m[3],
      en: m[4],
      chapters: Number(m[5]),
      era: m[6],
    });
  }
  if (books.length !== 66) {
    throw new Error(`books.ts: erwartet 66 Bücher, gefunden ${books.length}`);
  }
  return books;
}

const normalise = (s) =>
  s
    .toLowerCase()
    .replace(/\./g, '')
    .replace(/\s+/g, ' ')
    .trim();

/** alias (normalised) -> OSIS code. Longest alias wins when matching. */
export function buildLexicon(books) {
  const lex = new Map();
  const add = (alias, osis) => {
    const k = normalise(alias);
    // A longer, more specific alias must not be shadowed by a shorter one.
    if (k.length >= 2 && !lex.has(k)) lex.set(k, osis);
  };
  for (const b of books) {
    // "1. Mose (Genesis)" carries two usable names.
    const m = b.de.match(/^(.*?)\s*\(([^)]+)\)$/);
    if (m) {
      add(m[1], b.osis);
      add(m[2], b.osis);
    } else {
      add(b.de, b.osis);
    }
    add(b.en, b.osis);
    add(b.osis, b.osis);
    for (const a of EXTRA_ALIASES[b.osis] ?? []) add(a, b.osis);
  }
  return lex;
}

/**
 * Extract references from a piece of text.
 * Returns [{ osis, chapter, verseStart, verseEnd }] — verses may be null when
 * the reference names a whole chapter.
 */
export function findRefs(text, lex, books) {
  if (!text) return [];
  const byOsis = new Map(books.map((b) => [b.osis, b]));

  // Sort aliases longest-first so "1. Johannes" wins over "Johannes".
  const aliases = [...lex.keys()].sort((a, b) => b.length - a.length);
  const escaped = aliases.map((a) => a.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/ /g, '\\.?\\s*'));

  // Book, chapter, then optionally German "," or English ":" plus verses.
  const re = new RegExp(
    `(?<!\\p{L})(${escaped.join('|')})\\.?\\s*(\\d{1,3})` +
      `(?:\\s*[,:]\\s*(\\d{1,3})(?:\\s*[-–]\\s*(\\d{1,3}))?)?`,
    'giu',
  );

  const out = [];
  const seen = new Set();
  for (const m of text.matchAll(re)) {
    const osis = lex.get(normalise(m[1]));
    if (!osis) continue;
    const book = byOsis.get(osis);
    const chapter = Number(m[2]);
    // A chapter number beyond the book is a false positive ("Psalm 151").
    if (!book || chapter < 1 || chapter > book.chapters) continue;
    const verseStart = m[3] ? Number(m[3]) : null;
    const verseEnd = m[4] ? Number(m[4]) : verseStart;
    const key = `${osis}.${chapter}.${verseStart ?? '*'}.${verseEnd ?? '*'}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ osis, chapter, verseStart, verseEnd });
  }
  return out;
}

/** "Markus 6,30-44" for display, in the given language. */
export function formatRef(ref, books, lang = 'de') {
  const book = books.find((b) => b.osis === ref.osis);
  if (!book) return ref.osis;
  const name = lang === 'de' ? book.de.replace(/\s*\(.*\)$/, '') : book.en;
  if (ref.verseStart == null) return `${name} ${ref.chapter}`;
  const sep = lang === 'de' ? ',' : ':';
  const verses =
    ref.verseEnd && ref.verseEnd !== ref.verseStart
      ? `${ref.verseStart}-${ref.verseEnd}`
      : `${ref.verseStart}`;
  return `${name} ${ref.chapter}${sep}${verses}`;
}
