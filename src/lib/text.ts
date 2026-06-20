import type { Lang } from '../i18n';

export interface Verse {
  v: number;
  t: string;
}

export interface ChapterText {
  de: Verse[];
  en: Verse[];
}

export interface BookText {
  chapters: Record<string, ChapterText>;
}

const cache = new Map<string, Promise<BookText>>();

/** Lazily load the full text of a book (Luther 1912 + WEB), cached per book. */
export function loadBookText(osis: string): Promise<BookText> {
  let p = cache.get(osis);
  if (!p) {
    p = fetch(`${import.meta.env.BASE_URL}data/text/${osis}.json`).then((r) => {
      if (!r.ok) throw new Error(`Failed to load text for ${osis}: ${r.status}`);
      return r.json() as Promise<BookText>;
    });
    cache.set(osis, p);
  }
  return p;
}

export function chapterVerses(book: BookText | null, chapter: number, lang: Lang): Verse[] {
  if (!book) return [];
  return book.chapters[String(chapter)]?.[lang] ?? [];
}
