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
