import { useEffect, useState } from 'react';
import type { Place, PlaceImage } from '../types';

// Runtime fallback for place photos: many places without an OpenBible image do
// carry a Wikidata Q-id. We resolve the Wikidata P18 image client-side (the
// EntityData endpoint is CORS-enabled) and serve it via the Wikimedia Commons
// Special:FilePath thumbnailer. Cached in memory + sessionStorage.

const mem = new Map<string, PlaceImage | null>();

async function fetchWikidataImage(qid: string): Promise<PlaceImage | null> {
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

/** Returns the place's own image, or lazily resolves a Wikidata fallback. */
export function usePlaceImage(place: Place): PlaceImage | null {
  const [img, setImg] = useState<PlaceImage | null>(place.img);
  useEffect(() => {
    if (place.img) {
      setImg(place.img);
      return;
    }
    setImg(null);
    if (!place.wikidata) return;
    let alive = true;
    fetchWikidataImage(place.wikidata).then((r) => {
      if (alive) setImg(r);
    });
    return () => {
      alive = false;
    };
  }, [place.id, place.img, place.wikidata]);
  return img;
}
