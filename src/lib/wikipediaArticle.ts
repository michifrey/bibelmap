import type { Lang } from '../i18n';
import { commonsFileCredit } from './imageCredit';

/**
 * Wikipedia lookup for a person or a historical document: intro paragraph +
 * lead image, fetched at runtime from the MediaWiki API (CORS-enabled via
 * `origin=*`). Nothing is bundled — the app ships only the search term.
 *
 * The term is resolved in two steps: an exact title lookup (follows redirects)
 * and, if that finds nothing, a search. So a slightly-off term still lands on
 * the right article instead of on an empty card.
 */
export interface WikiArticle {
  title: string;
  url: string;
  /** First paragraph, plain text. */
  extract: string;
  /** Lead image (Wikimedia Commons), already thumbnailed. */
  thumb: string | null;
  /** Urheber des Bildes – fast alle Commons-Bilder verlangen die Nennung. */
  credit: string | null;
  /** Lizenzkürzel des Bildes, normalisiert (`CC-BY-SA-4.0`). */
  license: string | null;
  /** Dateiseite des Bildes; Rückfallziel des Nachweises ist der Artikel. */
  fileUrl: string | null;
}

const mem = new Map<string, WikiArticle | null>();
const inflight = new Map<string, Promise<WikiArticle | null>>();

function api(lang: Lang, params: Record<string, string>): string {
  const host = lang === 'de' ? 'de.wikipedia.org' : 'en.wikipedia.org';
  const q = new URLSearchParams({ format: 'json', formatversion: '2', origin: '*', ...params });
  return `https://${host}/w/api.php?${q}`;
}

const PROPS = {
  action: 'query',
  prop: 'pageimages|extracts|info',
  inprop: 'url',
  piprop: 'thumbnail|name',
  pithumbsize: '480',
  exintro: '1',
  explaintext: '1',
  exsentences: '3',
};

type Page = WikiArticle & { file: string | null };

function firstPage(data: unknown, lang: Lang): Page | null {
  const pages = (data as { query?: { pages?: unknown[] } })?.query?.pages;
  if (!Array.isArray(pages) || pages.length === 0) return null;
  const p = pages[0] as {
    missing?: boolean;
    title?: string;
    fullurl?: string;
    extract?: string;
    thumbnail?: { source?: string };
    pageimage?: string;
  };
  if (p.missing || !p.title) return null;
  const url = p.fullurl ?? `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(p.title)}`;
  return {
    title: p.title,
    url,
    extract: (p.extract ?? '').trim(),
    thumb: p.thumbnail?.source ?? null,
    credit: null,
    license: null,
    fileUrl: null,
    file: p.pageimage ?? null,
  };
}

/**
 * Urheber und Lizenz stehen nicht am Artikel, sondern an der Datei – und fast
 * jedes Commons-Bild verlangt beides. Also ein Schritt mehr, ehe ein Bild
 * angezeigt wird; ohne Nachweis bleibt es beim Verweis auf den Artikel.
 */
async function withCredit(art: Page): Promise<WikiArticle> {
  const { file, ...rest } = art;
  if (!rest.thumb || !file) return rest;
  const meta = await commonsFileCredit(file);
  return meta
    ? { ...rest, credit: meta.credit, license: meta.license, fileUrl: meta.fileUrl }
    : { ...rest, credit: 'Wikimedia Commons', fileUrl: rest.url };
}

async function load(term: string, lang: Lang): Promise<WikiArticle | null> {
  try {
    const exact = await fetch(api(lang, { ...PROPS, titles: term, redirects: '1' }));
    if (exact.ok) {
      const hit = firstPage(await exact.json(), lang);
      if (hit) return withCredit(hit);
    }
    const found = await fetch(
      api(lang, { ...PROPS, generator: 'search', gsrsearch: term, gsrlimit: '1' }),
    );
    if (found.ok) {
      const hit = firstPage(await found.json(), lang);
      if (hit) return withCredit(hit);
    }
  } catch {
    /* offline or blocked – the card simply stays text-only */
  }
  return null;
}

/** Resolve a search term to its Wikipedia article, cached per session. */
export function fetchArticle(term: string, lang: Lang): Promise<WikiArticle | null> {
  const key = `${lang}:${term}`;
  if (mem.has(key)) return Promise.resolve(mem.get(key)!);
  const running = inflight.get(key);
  if (running) return running;

  const sk = `wpart:${key}`;
  try {
    const cached = sessionStorage.getItem(sk);
    if (cached) {
      const v = JSON.parse(cached) as WikiArticle | null;
      mem.set(key, v);
      return Promise.resolve(v);
    }
  } catch {
    /* sessionStorage unavailable – ignore */
  }

  const task = load(term, lang).then((v) => {
    mem.set(key, v);
    inflight.delete(key);
    try {
      sessionStorage.setItem(sk, JSON.stringify(v));
    } catch {
      /* ignore */
    }
    return v;
  });
  inflight.set(key, task);
  return task;
}

/** Wikipedia link that lands on the article for an exact term and searches otherwise. */
export function wikiLink(term: string, lang: Lang): string {
  const host = lang === 'de' ? 'de.wikipedia.org' : 'en.wikipedia.org';
  return `https://${host}/w/index.php?search=${encodeURIComponent(term)}`;
}
