import type { Lang } from '../i18n';
import { BOOKS, BOOK_BY_OSIS } from '../data/books';

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

/**
 * Kurzformen, die sich nicht mechanisch aus den vollen Namen ergeben. Dieselbe
 * Liste pflegt `scripts/lib/bibleref.mjs` für die Medien-Zuordnung; sie hier
 * zu wiederholen ist der Preis dafür, dass der Browser kein Node-Skript lädt.
 */
const ALIASES: Record<string, string[]> = {
  Gen: ['1mo', '1mose', 'gen'],
  Exod: ['2mo', '2mose', 'ex', 'exod'],
  Lev: ['3mo', '3mose', 'lev'],
  Num: ['4mo', '4mose', 'num'],
  Deut: ['5mo', '5mose', 'dtn', 'dt', 'deut'],
  Josh: ['jos', 'josh'],
  Judg: ['ri', 'judg'],
  Ruth: ['rut', 'ruth'],
  '1Sam': ['1sam'],
  '2Sam': ['2sam'],
  '1Kgs': ['1kon', '1koen', '1kge', '1kings', '1kgs'],
  '2Kgs': ['2kon', '2koen', '2kge', '2kings', '2kgs'],
  '1Chr': ['1chr', '1chron'],
  '2Chr': ['2chr', '2chron'],
  Ezra: ['esr', 'ezra'],
  Neh: ['neh'],
  Esth: ['est', 'esth'],
  Job: ['hiob', 'ijob', 'job'],
  Ps: ['ps', 'psalm', 'psalmen'],
  Prov: ['spr', 'prov'],
  Eccl: ['pred', 'koh', 'eccl'],
  Song: ['hld', 'hohelied', 'song'],
  Isa: ['jes', 'isa'],
  Jer: ['jer'],
  Lam: ['klgl', 'lam'],
  Ezek: ['hes', 'ez', 'ezek'],
  Dan: ['dan'],
  Hos: ['hos'],
  Joel: ['joel'],
  Amos: ['am', 'amos'],
  Obad: ['obd', 'obad'],
  Jonah: ['jona', 'jonah'],
  Mic: ['mi', 'mic'],
  Nah: ['nah'],
  Hab: ['hab'],
  Zeph: ['zef', 'zeph'],
  Hag: ['hag'],
  Zech: ['sach', 'zech'],
  Mal: ['mal'],
  Matt: ['mt', 'matth', 'matt'],
  Mark: ['mk', 'mark', 'mr'],
  Luke: ['lk', 'luk', 'luke'],
  John: ['joh', 'jh', 'john'],
  Acts: ['apg', 'apostelgesch', 'acts'],
  Rom: ['rom', 'roem', 'ro'],
  '1Cor': ['1kor', '1cor'],
  '2Cor': ['2kor', '2cor'],
  Gal: ['gal'],
  Eph: ['eph'],
  Phil: ['phil', 'php'],
  Col: ['kol', 'col'],
  '1Thess': ['1thess', '1th'],
  '2Thess': ['2thess', '2th'],
  '1Tim': ['1tim'],
  '2Tim': ['2tim'],
  Titus: ['tit', 'titus'],
  Phlm: ['phlm', 'philem'],
  Heb: ['hebr', 'heb'],
  Jas: ['jak', 'jas'],
  '1Pet': ['1petr', '1pet'],
  '2Pet': ['2petr', '2pet'],
  '1John': ['1joh', '1john'],
  '2John': ['2joh', '2john'],
  '3John': ['3joh', '3john'],
  Jude: ['jud', 'jude'],
  Rev: ['offb', 'apk', 'rev'],
};

function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[.\s]/g, '');
}

/** Buchname (voll, in Klammern, Kurzform) → OSIS. Einmal gebaut, dann fest. */
const LEXICON: Map<string, string> = (() => {
  const map = new Map<string, string>();
  for (const b of BOOKS) {
    // „1. Mose (Genesis)" liefert beide Namen.
    for (const raw of [...b.de.split(/[()]/), b.en, b.osis]) {
      const key = norm(raw);
      if (key) map.set(key, b.osis);
    }
  }
  for (const [osis, list] of Object.entries(ALIASES)) {
    for (const a of list) map.set(norm(a), osis);
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
