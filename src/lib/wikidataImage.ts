import type { PlaceImage } from '../types';
import { normalizeLicense, plainText } from './imageCredit';

// Runtime fallback for place photos: many places without an OpenBible image do
// carry a Wikidata Q-id. We resolve the Wikidata P18 image client-side (the
// EntityData endpoint is CORS-enabled) and serve it via the Wikimedia Commons
// Special:FilePath thumbnailer. Cached in memory + sessionStorage.

const mem = new Map<string, PlaceImage | null>();

/** Resolve a Wikidata Q-id to a Commons image (P18), cached. Exposed for reuse. */
export async function resolveWikidataImage(qid: string): Promise<PlaceImage | null> {
  if (mem.has(qid)) return mem.get(qid)!;
  const sk = `wdimg:${qid}`;
  try {
    const cached = sessionStorage.getItem(sk);
    if (cached) {
      const v = JSON.parse(cached) as PlaceImage | null;
      mem.set(qid, v);
      return v;
    }
  } catch {
    /* sessionStorage unavailable – ignore */
  }

  let result: PlaceImage | null = null;
  try {
    const r = await fetch(`https://www.wikidata.org/wiki/Special:EntityData/${qid}.json`);
    if (r.ok) {
      const data = await r.json();
      const p18 = data?.entities?.[qid]?.claims?.P18?.[0]?.mainsnak?.datavalue?.value;
      if (typeof p18 === 'string' && p18) {
        const enc = encodeURIComponent(p18.replace(/ /g, '_'));
        result = {
          url: `https://commons.wikimedia.org/wiki/Special:FilePath/${enc}?width=512`,
          credit: 'Wikimedia Commons',
          creditUrl: `https://commons.wikimedia.org/wiki/File:${enc}`,
          license: null,
        };
        // Urheber und Lizenz stehen nicht bei Wikidata, sondern bei der Datei.
        // Fast alle diese Bilder verlangen beides – also einen Schritt mehr.
        const meta = await fileCredit(p18);
        if (meta) result = { ...result, ...meta };
      }
    }
  } catch {
    /* network/parse failure – fall back to no image */
  }

  mem.set(qid, result);
  try {
    sessionStorage.setItem(sk, JSON.stringify(result));
  } catch {
    /* ignore */
  }
  return result;
}

/**
 * Urheber und Lizenz einer Commons-Datei. Schlägt der Aufruf fehl, bleibt es
 * beim allgemeinen Nachweis auf die Dateiseite – ein Bild ohne Nachweis
 * zeigt die App nicht.
 */
async function fileCredit(file: string): Promise<Pick<PlaceImage, 'credit' | 'license'> | null> {
  const api = new URL('https://commons.wikimedia.org/w/api.php');
  api.search = new URLSearchParams({
    action: 'query',
    format: 'json',
    origin: '*', // CORS: ohne das antwortet die API nicht im Browser
    prop: 'imageinfo',
    iiprop: 'extmetadata',
    titles: `File:${file}`,
  }).toString();

  try {
    const r = await fetch(api);
    if (!r.ok) return null;
    const data = await r.json();
    const pages = data?.query?.pages;
    const page = pages && Object.values(pages)[0];
    const ex = (page as { imageinfo?: { extmetadata?: Record<string, { value?: string }> }[] })
      ?.imageinfo?.[0]?.extmetadata;
    if (!ex) return null;
    const artist = ex.Artist?.value ? plainText(ex.Artist.value) : '';
    const license = normalizeLicense(ex.License?.value ?? ex.LicenseShortName?.value);
    return {
      credit: artist || 'Wikimedia Commons',
      license,
    };
  } catch {
    return null;
  }
}
