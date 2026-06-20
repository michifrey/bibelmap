import type { Place } from '../types';
import { BOOK_BY_OSIS } from '../data/books';

let cache: Promise<Place[]> | null = null;

export function loadPlaces(): Promise<Place[]> {
  if (!cache) {
    cache = fetch(`${import.meta.env.BASE_URL}data/places.json`).then((r) => {
      if (!r.ok) throw new Error(`Failed to load places.json: ${r.status}`);
      return r.json() as Promise<Place[]>;
    });
  }
  return cache;
}

/** Era ids in which a place is mentioned (derived from the books of its verses). */
export function erasForPlace(place: Place): string[] {
  const set = new Set<string>();
  for (const v of place.verses) {
    const book = BOOK_BY_OSIS[v.book];
    if (book) set.add(book.era);
  }
  return [...set];
}

/** Distinct OSIS book codes a place is mentioned in, in canonical order. */
export function booksForPlace(place: Place): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const v of place.verses) {
    if (!seen.has(v.book)) {
      seen.add(v.book);
      out.push(v.book);
    }
  }
  return out;
}

/** Places mentioned in a given era. */
export function placesInEra(places: Place[], eraId: string | null): Place[] {
  if (!eraId) return places;
  return places.filter((p) => erasForPlace(p).includes(eraId));
}

/** Places mentioned in a specific book + chapter, with the matching verse refs. */
export function placesInChapter(
  places: Place[],
  osis: string,
  chapter: number,
): { place: Place; refs: Place['verses'] }[] {
  const out: { place: Place; refs: Place['verses'] }[] = [];
  for (const p of places) {
    const refs = p.verses.filter((v) => v.book === osis && v.chapter === chapter);
    if (refs.length) out.push({ place: p, refs });
  }
  // Most-mentioned first so the strongest landmarks lead.
  out.sort((a, b) => b.refs.length - a.refs.length);
  return out;
}

function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/** Substring search over place names + translation variants. Ranked. */
export function searchPlaces(places: Place[], query: string, limit = 40): Place[] {
  const q = norm(query.trim());
  if (!q) return [];
  const scored: { p: Place; score: number }[] = [];
  for (const p of places) {
    const name = norm(p.name);
    let score = -1;
    if (name === q) score = 1000;
    else if (name.startsWith(q)) score = 800;
    else if (name.includes(q)) score = 500;
    else if (p.variants.some((v) => norm(v).includes(q))) score = 300;
    if (score >= 0) {
      // tie-break by how often the place is mentioned
      scored.push({ p, score: score + Math.min(p.mentionCount, 200) / 10 });
    }
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.p);
}

/** Books (OSIS) that actually have mapped places, in canonical order. */
export function booksWithPlaces(places: Place[]): string[] {
  const set = new Set<string>();
  for (const p of places) for (const v of p.verses) set.add(v.book);
  return [...set].sort((a, b) => (BOOK_BY_OSIS[a]?.num ?? 99) - (BOOK_BY_OSIS[b]?.num ?? 99));
}
