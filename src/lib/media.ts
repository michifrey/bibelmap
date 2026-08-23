import type { Place } from '../types';

export interface MediaSource {
  id: string;
  title: string;
  author: string | null;
  homepage: string | null;
  lang: 'de' | 'en';
  kind: 'podcast' | 'video' | 'generated';
}

export interface MediaRef {
  osis: string;
  chapter: number | null;
  verseStart: number | null;
  verseEnd: number | null;
  label: string;
}

export interface MediaEpisode {
  src: string;
  title: string;
  url: string;
  date: string | null;
  refs: MediaRef[];
  eras: string[];
}

export interface MediaIndex {
  sources: MediaSource[];
  episodes: MediaEpisode[];
  /** place id -> indices into `episodes` */
  byPlace: Record<string, number[]>;
}

const EMPTY: MediaIndex = { sources: [], episodes: [], byPlace: {} };

let cache: Promise<MediaIndex> | null = null;

/**
 * Loaded on demand, not with the app: the index only matters once someone opens
 * a place, and it grows with every podcast season.
 */
export function loadMedia(): Promise<MediaIndex> {
  if (!cache) {
    cache = fetch(`${import.meta.env.BASE_URL}data/media.json`)
      .then((r) => (r.ok ? (r.json() as Promise<MediaIndex>) : EMPTY))
      // A missing index is a normal state — nobody has run `npm run media` yet.
      .catch(() => EMPTY);
  }
  return cache;
}

export interface MediaGroup {
  source: MediaSource;
  episodes: MediaEpisode[];
}

/**
 * Everything tied to a place, grouped by source and ordered the way it is worth
 * reading: a podcast episode on the exact passage beats a whole-book overview.
 */
export function mediaForPlace(index: MediaIndex, place: Place): MediaGroup[] {
  const idx = index.byPlace[place.id];
  if (!idx?.length) return [];

  const bySource = new Map<string, MediaEpisode[]>();
  for (const i of idx) {
    const ep = index.episodes[i];
    if (!ep) continue;
    const list = bySource.get(ep.src);
    if (list) list.push(ep);
    else bySource.set(ep.src, [ep]);
  }

  const groups: MediaGroup[] = [];
  for (const source of index.sources) {
    const episodes = bySource.get(source.id);
    if (!episodes?.length) continue;
    episodes.sort((a, b) => {
      // A precise verse range says more about this place than a whole book.
      const precision = (e: MediaEpisode) =>
        e.refs.some((r) => r.verseStart != null) ? 0 : e.refs.some((r) => r.chapter != null) ? 1 : 2;
      return precision(a) - precision(b) || (b.date ?? '').localeCompare(a.date ?? '');
    });
    groups.push({ source, episodes });
  }
  // Sources with passage-level hits first; the generated book overviews last.
  groups.sort((a, b) => (a.source.kind === 'generated' ? 1 : 0) - (b.source.kind === 'generated' ? 1 : 0));
  return groups;
}

/**
 * Umgekehrter Weg: zu jeder Folge die Orte, die sie berührt. Der Index kennt
 * nur die Richtung Ort → Folgen; für den Stöbermodus wird sie einmal gedreht.
 */
export function placesByEpisode(index: MediaIndex): Map<number, string[]> {
  const out = new Map<number, string[]>();
  for (const [placeId, list] of Object.entries(index.byPlace)) {
    for (const i of list) {
      const known = out.get(i);
      if (known) known.push(placeId);
      else out.set(i, [placeId]);
    }
  }
  return out;
}

/** Bücher, die in den Folgen vorkommen – in kanonischer Reihenfolge der Daten. */
export function booksInMedia(index: MediaIndex): string[] {
  const seen = new Set<string>();
  for (const ep of index.episodes) for (const r of ep.refs) if (r.osis) seen.add(r.osis);
  return [...seen];
}

/** Wie genau eine Folge auf eine Stelle zeigt: Vers > Kapitel > ganzes Buch. */
export function precision(ep: MediaEpisode): number {
  if (ep.refs.some((r) => r.verseStart != null)) return 0;
  if (ep.refs.some((r) => r.chapter != null)) return 1;
  return 2;
}

/**
 * Der kurze Name einer Quelle. Auf der Karte steht der volle Titel einmal, in
 * einer Liste steht er 40-mal – und „Timothy Keller Sermons Podcast by Gospel
 * in Life“ ist dort breiter und lauter als die Folge, um die es geht. Der Teil
 * vor dem Gedankenstrich, sonst der Autor, wenn er kürzer ist.
 */
export function sourceLabel(s: MediaSource): string {
  const head = s.title.split(/[–—-]/)[0].trim();
  if (head.length <= 22) return head;
  return s.author && s.author.length < head.length ? s.author : head;
}

/**
 * Eine Stelle so, wie sie hier gelesen wird. Die Quellen liefern englische
 * Etiketten mit („Ephesians 2:4-10“) – in einer deutschen Oberfläche steht
 * daneben aber „Epheser 2,4–10“. Nur wenn das Buch unbekannt ist, bleibt das
 * mitgelieferte Etikett stehen.
 */
export function refLabel(r: MediaRef, book: { de: string; en: string } | undefined, lang: 'de' | 'en'): string {
  if (!book) return r.label || r.osis;
  // Die Klammer hinter „1. Mose (Genesis)“ trägt in einer Zeile mit Kapitel
  // und Vers nichts bei.
  const name = lang === 'de' ? book.de.replace(/\s*\(.*\)$/, '') : book.en;
  if (r.chapter == null) return name;
  const sep = lang === 'de' ? ',' : ':';
  const verse =
    r.verseStart == null
      ? ''
      : `${sep}${r.verseStart}${r.verseEnd != null && r.verseEnd !== r.verseStart ? `–${r.verseEnd}` : ''}`;
  return `${name} ${r.chapter}${verse}`;
}

/** Ein Sendedatum, wie man es hier schreibt – nicht als ISO-Kette. */
export function mediaDate(iso: string | null, lang: 'de' | 'en'): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat(lang === 'de' ? 'de-DE' : 'en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(d);
}

/**
 * Folgen zu einer Stelle: alles, was dieses Kapitel nennt, dazu die
 * Buch-Übersichten. Sortiert wie überall – die genaue Stelle vor dem ganzen
 * Buch, dann neu vor alt.
 */
export function episodesForRef(index: MediaIndex, osis: string, chapter: number): MediaEpisode[] {
  const out = index.episodes.filter((ep) =>
    ep.refs.some((r) => r.osis === osis && (r.chapter === null || r.chapter === chapter)),
  );
  out.sort((a, b) => precision(a) - precision(b) || (b.date ?? '').localeCompare(a.date ?? ''));
  return out;
}
