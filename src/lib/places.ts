import type { Place } from '../types';
import type { Lang } from '../i18n';
import { BOOK_BY_OSIS } from '../data/books';
import { ERA_BY_ID } from '../data/eras';

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

/**
 * Orte bis einschließlich dieser Epoche – „alles, was bis hierhin vorkam".
 * Die Reihenfolge der Epochen steht in eras.ts (`order`).
 */
export function placesUpToEra(places: Place[], eraId: string | null): Place[] {
  if (!eraId) return places;
  const limit = ERA_BY_ID[eraId]?.order;
  if (limit === undefined) return places;
  return places.filter((p) =>
    erasForPlace(p).some((id) => {
      const order = ERA_BY_ID[id]?.order;
      return order !== undefined && order <= limit;
    }),
  );
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

/** OpenBible disambiguates repeated names with a trailing number: "Babylon 1". */
function stripIndex(name: string): string {
  return name.replace(/ \d+$/, '');
}

/**
 * The name to show. German falls back to the English one where the Luther
 * derivation was not confident enough (see scripts/build-names-de.mjs).
 */
export function placeName(place: Place, lang: Lang): string {
  if (lang === 'de' && place.nameDe) return place.nameDe;
  return stripIndex(place.name);
}

/** Every spelling of a place in the given language, for matching it in text. */
export function placeNames(place: Place, lang: Lang): string[] {
  const out = lang === 'de' && place.nameDe ? [place.nameDe, ...(place.variantsDe ?? [])] : [];
  return [...out, stripIndex(place.name), ...place.variants];
}

/** Substring search over place names + translation variants. Ranked. */
export function searchPlaces(places: Place[], query: string, limit = 40): Place[] {
  const q = norm(query.trim());
  if (!q) return [];
  const scored: { p: Place; score: number }[] = [];
  for (const p of places) {
    // Search both languages regardless of the UI language \u2014 someone typing
    // "Goshen" should find Gosen and vice versa.
    const names = [p.name, p.nameDe].filter(Boolean).map((n) => norm(n as string));
    let score = -1;
    if (names.some((n) => n === q)) score = 1000;
    else if (names.some((n) => n.startsWith(q))) score = 800;
    else if (names.some((n) => n.includes(q))) score = 500;
    else if ([...p.variants, ...(p.variantsDe ?? [])].some((v) => norm(v).includes(q))) score = 300;
    if (score >= 0) {
      // tie-break by how often the place is mentioned
      scored.push({ p, score: score + Math.min(p.mentionCount, 200) / 10 });
    }
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.p);
}

/** Resolve a list of place names to Place objects (best match per name). */
export function findPlacesByNames(places: Place[], names: string[]): Place[] {
  const out: Place[] = [];
  const seen = new Set<string>();
  for (const raw of names) {
    const q = norm(raw);
    let best: Place | null = null;
    for (const p of places) {
      const base = norm(p.name.replace(/ \d+$/, ''));
      if (base === q && (!best || p.mentionCount > best.mentionCount)) best = p;
    }
    if (best && !seen.has(best.id)) {
      seen.add(best.id);
      out.push(best);
    }
  }
  return out;
}

/** Books (OSIS) that actually have mapped places, in canonical order. */
export function booksWithPlaces(places: Place[]): string[] {
  const set = new Set<string>();
  for (const p of places) for (const v of p.verses) set.add(v.book);
  return [...set].sort((a, b) => (BOOK_BY_OSIS[a]?.num ?? 99) - (BOOK_BY_OSIS[b]?.num ?? 99));
}
