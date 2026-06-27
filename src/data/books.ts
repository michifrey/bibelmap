// Metadata for the 66 books of the Protestant canon.
// - osis:  OSIS book code used in the place data
// - de/en: display names
// - chapters: chapter count (for presentation mode)
// - era:   era id (see eras.ts) used to place the book on the timeline
// - bg:    BibleGateway passage code (book name for the ?search= param)

export interface BookMeta {
  num: number;
  osis: string;
  de: string;
  en: string;
  chapters: number;
  era: string;
  testament: 'AT' | 'NT';
}

export const BOOKS: BookMeta[] = [
  { num: 1, osis: 'Gen', de: '1. Mose (Genesis)', en: 'Genesis', chapters: 50, era: 'patriarchs', testament: 'AT' },
  { num: 2, osis: 'Exod', de: '2. Mose (Exodus)', en: 'Exodus', chapters: 40, era: 'exodus', testament: 'AT' },
  { num: 3, osis: 'Lev', de: '3. Mose (Levitikus)', en: 'Leviticus', chapters: 27, era: 'exodus', testament: 'AT' },
  { num: 4, osis: 'Num', de: '4. Mose (Numeri)', en: 'Numbers', chapters: 36, era: 'exodus', testament: 'AT' },
  { num: 5, osis: 'Deut', de: '5. Mose (Deuteronomium)', en: 'Deuteronomy', chapters: 34, era: 'exodus', testament: 'AT' },
  { num: 6, osis: 'Josh', de: 'Josua', en: 'Joshua', chapters: 24, era: 'conquest', testament: 'AT' },
  { num: 7, osis: 'Judg', de: 'Richter', en: 'Judges', chapters: 21, era: 'conquest', testament: 'AT' },
  { num: 8, osis: 'Ruth', de: 'Rut', en: 'Ruth', chapters: 4, era: 'conquest', testament: 'AT' },
  { num: 9, osis: '1Sam', de: '1. Samuel', en: '1 Samuel', chapters: 31, era: 'united', testament: 'AT' },
  { num: 10, osis: '2Sam', de: '2. Samuel', en: '2 Samuel', chapters: 24, era: 'united', testament: 'AT' },
  { num: 11, osis: '1Kgs', de: '1. Könige', en: '1 Kings', chapters: 22, era: 'united', testament: 'AT' },
  { num: 12, osis: '2Kgs', de: '2. Könige', en: '2 Kings', chapters: 25, era: 'divided', testament: 'AT' },
  { num: 13, osis: '1Chr', de: '1. Chronik', en: '1 Chronicles', chapters: 29, era: 'united', testament: 'AT' },
  { num: 14, osis: '2Chr', de: '2. Chronik', en: '2 Chronicles', chapters: 36, era: 'divided', testament: 'AT' },
  { num: 15, osis: 'Ezra', de: 'Esra', en: 'Ezra', chapters: 10, era: 'return', testament: 'AT' },
  { num: 16, osis: 'Neh', de: 'Nehemia', en: 'Nehemiah', chapters: 13, era: 'return', testament: 'AT' },
  { num: 17, osis: 'Esth', de: 'Ester', en: 'Esther', chapters: 10, era: 'return', testament: 'AT' },
  { num: 18, osis: 'Job', de: 'Hiob', en: 'Job', chapters: 42, era: 'patriarchs', testament: 'AT' },
  { num: 19, osis: 'Ps', de: 'Psalmen', en: 'Psalms', chapters: 150, era: 'united', testament: 'AT' },
  { num: 20, osis: 'Prov', de: 'Sprüche', en: 'Proverbs', chapters: 31, era: 'united', testament: 'AT' },
  { num: 21, osis: 'Eccl', de: 'Prediger', en: 'Ecclesiastes', chapters: 12, era: 'united', testament: 'AT' },
  { num: 22, osis: 'Song', de: 'Hoheslied', en: 'Song of Songs', chapters: 8, era: 'united', testament: 'AT' },
  { num: 23, osis: 'Isa', de: 'Jesaja', en: 'Isaiah', chapters: 66, era: 'divided', testament: 'AT' },
  { num: 24, osis: 'Jer', de: 'Jeremia', en: 'Jeremiah', chapters: 52, era: 'divided', testament: 'AT' },
  { num: 25, osis: 'Lam', de: 'Klagelieder', en: 'Lamentations', chapters: 5, era: 'exile', testament: 'AT' },
  { num: 26, osis: 'Ezek', de: 'Hesekiel', en: 'Ezekiel', chapters: 48, era: 'exile', testament: 'AT' },
  { num: 27, osis: 'Dan', de: 'Daniel', en: 'Daniel', chapters: 12, era: 'exile', testament: 'AT' },
  { num: 28, osis: 'Hos', de: 'Hosea', en: 'Hosea', chapters: 14, era: 'divided', testament: 'AT' },
  { num: 29, osis: 'Joel', de: 'Joel', en: 'Joel', chapters: 3, era: 'divided', testament: 'AT' },
  { num: 30, osis: 'Amos', de: 'Amos', en: 'Amos', chapters: 9, era: 'divided', testament: 'AT' },
  { num: 31, osis: 'Obad', de: 'Obadja', en: 'Obadiah', chapters: 1, era: 'exile', testament: 'AT' },
  { num: 32, osis: 'Jonah', de: 'Jona', en: 'Jonah', chapters: 4, era: 'divided', testament: 'AT' },
  { num: 33, osis: 'Mic', de: 'Micha', en: 'Micah', chapters: 7, era: 'divided', testament: 'AT' },
  { num: 34, osis: 'Nah', de: 'Nahum', en: 'Nahum', chapters: 3, era: 'divided', testament: 'AT' },
  { num: 35, osis: 'Hab', de: 'Habakuk', en: 'Habakkuk', chapters: 3, era: 'divided', testament: 'AT' },
  { num: 36, osis: 'Zeph', de: 'Zefanja', en: 'Zephaniah', chapters: 3, era: 'divided', testament: 'AT' },
  { num: 37, osis: 'Hag', de: 'Haggai', en: 'Haggai', chapters: 2, era: 'return', testament: 'AT' },
  { num: 38, osis: 'Zech', de: 'Sacharja', en: 'Zechariah', chapters: 14, era: 'return', testament: 'AT' },
  { num: 39, osis: 'Mal', de: 'Maleachi', en: 'Malachi', chapters: 4, era: 'return', testament: 'AT' },
  { num: 40, osis: 'Matt', de: 'Matthäus', en: 'Matthew', chapters: 28, era: 'gospels', testament: 'NT' },
  { num: 41, osis: 'Mark', de: 'Markus', en: 'Mark', chapters: 16, era: 'gospels', testament: 'NT' },
  { num: 42, osis: 'Luke', de: 'Lukas', en: 'Luke', chapters: 24, era: 'gospels', testament: 'NT' },
  { num: 43, osis: 'John', de: 'Johannes', en: 'John', chapters: 21, era: 'gospels', testament: 'NT' },
  { num: 44, osis: 'Acts', de: 'Apostelgeschichte', en: 'Acts', chapters: 28, era: 'church', testament: 'NT' },
  { num: 45, osis: 'Rom', de: 'Römer', en: 'Romans', chapters: 16, era: 'church', testament: 'NT' },
  { num: 46, osis: '1Cor', de: '1. Korinther', en: '1 Corinthians', chapters: 16, era: 'church', testament: 'NT' },
  { num: 47, osis: '2Cor', de: '2. Korinther', en: '2 Corinthians', chapters: 13, era: 'church', testament: 'NT' },
  { num: 48, osis: 'Gal', de: 'Galater', en: 'Galatians', chapters: 6, era: 'church', testament: 'NT' },
  { num: 49, osis: 'Eph', de: 'Epheser', en: 'Ephesians', chapters: 6, era: 'church', testament: 'NT' },
  { num: 50, osis: 'Phil', de: 'Philipper', en: 'Philippians', chapters: 4, era: 'church', testament: 'NT' },
  { num: 51, osis: 'Col', de: 'Kolosser', en: 'Colossians', chapters: 4, era: 'church', testament: 'NT' },
  { num: 52, osis: '1Thess', de: '1. Thessalonicher', en: '1 Thessalonians', chapters: 5, era: 'church', testament: 'NT' },
  { num: 53, osis: '2Thess', de: '2. Thessalonicher', en: '2 Thessalonians', chapters: 3, era: 'church', testament: 'NT' },
  { num: 54, osis: '1Tim', de: '1. Timotheus', en: '1 Timothy', chapters: 6, era: 'church', testament: 'NT' },
  { num: 55, osis: '2Tim', de: '2. Timotheus', en: '2 Timothy', chapters: 4, era: 'church', testament: 'NT' },
  { num: 56, osis: 'Titus', de: 'Titus', en: 'Titus', chapters: 3, era: 'church', testament: 'NT' },
  { num: 57, osis: 'Phlm', de: 'Philemon', en: 'Philemon', chapters: 1, era: 'church', testament: 'NT' },
  { num: 58, osis: 'Heb', de: 'Hebräer', en: 'Hebrews', chapters: 13, era: 'church', testament: 'NT' },
  { num: 59, osis: 'Jas', de: 'Jakobus', en: 'James', chapters: 5, era: 'church', testament: 'NT' },
  { num: 60, osis: '1Pet', de: '1. Petrus', en: '1 Peter', chapters: 5, era: 'church', testament: 'NT' },
  { num: 61, osis: '2Pet', de: '2. Petrus', en: '2 Peter', chapters: 3, era: 'church', testament: 'NT' },
  { num: 62, osis: '1John', de: '1. Johannes', en: '1 John', chapters: 5, era: 'church', testament: 'NT' },
  { num: 63, osis: '2John', de: '2. Johannes', en: '2 John', chapters: 1, era: 'church', testament: 'NT' },
  { num: 64, osis: '3John', de: '3. Johannes', en: '3 John', chapters: 1, era: 'church', testament: 'NT' },
  { num: 65, osis: 'Jude', de: 'Judas', en: 'Jude', chapters: 1, era: 'church', testament: 'NT' },
  { num: 66, osis: 'Rev', de: 'Offenbarung', en: 'Revelation', chapters: 22, era: 'church', testament: 'NT' },
];

export const BOOK_BY_OSIS: Record<string, BookMeta> = Object.fromEntries(BOOKS.map((b) => [b.osis, b]));
export const BOOK_BY_NUM: Record<number, BookMeta> = Object.fromEntries(BOOKS.map((b) => [b.num, b]));

// A BibleGateway link for a chapter. version: e.g. "LUTH1545" (de) or "ESV" (en).
export function bibleGatewayUrl(osis: string, chapter: number, version: string): string {
  const b = BOOK_BY_OSIS[osis];
  const name = b ? b.en : osis;
  const search = encodeURIComponent(`${name} ${chapter}`);
  return `https://www.biblegateway.com/passage/?search=${search}&version=${version}`;
}

// BibleProject "guide" pages carry the book-overview video plus resources.
// Slugs follow `book-of-<name>`, except a few books that BibleProject groups
// into a single guide (Kings, Samuel, Chronicles). Maintain exceptions here.
const BP_GUIDE_OVERRIDE: Record<string, string> = {
  '1Kgs': 'books-of-kings',
  '2Kgs': 'books-of-kings',
  '1Sam': 'books-of-samuel',
  '2Sam': 'books-of-samuel',
  '1Chr': 'books-of-chronicles',
  '2Chr': 'books-of-chronicles',
};

function bookSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Curated BibleProject book-overview YouTube video IDs (1–2 parts per book).
// Where a book has entries we embed the player; otherwise we link to the guide.
export const BP_VIDEO: Record<string, string[]> = {
  Gen: ['GQI72THyO5I'],
  Exod: ['jH_aojNJM3E', 'b0GhR-2kPKI'],
  Ps: ['j9phNEaPrv8'],
  Matt: ['3Dv4-n6OYGI', 'GGCF3OPWN14'],
  John: ['G-2e9mMf7E8', 'RUfh_wOsauk'],
  Acts: ['CGbNw855ksw', 'Z-17KxpjL0Q'],
  Rev: ['5nvVVcYD-0w', 'QpnIrbq2bKo'],
};

export function bibleProjectVideoIds(osis: string): string[] {
  return BP_VIDEO[osis] ?? [];
}

// Link to a book's BibleProject overview (guide page with the video).
export function bibleProjectUrl(osis: string): string {
  const b = BOOK_BY_OSIS[osis];
  if (!b) return 'https://bibleproject.com/';
  const slug = BP_GUIDE_OVERRIDE[osis] ?? `book-of-${bookSlug(b.en)}`;
  return `https://bibleproject.com/guides/${slug}/`;
}
