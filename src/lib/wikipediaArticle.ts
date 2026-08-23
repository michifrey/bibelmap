import type { Lang } from '../i18n';

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
  piprop: 'thumbnail',
  pithumbsize: '480',
  exintro: '1',
  explaintext: '1',
  exsentences: '3',
};

function firstPage(data: unknown, lang: Lang): WikiArticle | null {
  const pages = (data as { query?: { pages?: unknown[] } })?.query?.pages;
  if (!Array.isArray(pages) || pages.length === 0) return null;
  const p = pages[0] as {
    missing?: boolean;
    title?: string;
    fullurl?: string;
    extract?: string;
    thumbnail?: { source?: string };
  };
  if (p.missing || !p.title) return null;
  return {
    title: p.title,
    url: p.fullurl ?? `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(p.title)}`,
    extract: (p.extract ?? '').trim(),
    thumb: p.thumbnail?.source ?? null,
  };
}

async function load(term: string, lang: Lang): Promise<WikiArticle | null> {
  try {
    const exact = await fetch(api(lang, { ...PROPS, titles: term, redirects: '1' }));
    if (exact.ok) {
      const hit = firstPage(await exact.json(), lang);
      if (hit) return hit;
    }
    const found = await fetch(
      api(lang, { ...PROPS, generator: 'search', gsrsearch: term, gsrlimit: '1' }),
    );
    if (found.ok) return firstPage(await found.json(), lang);
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
