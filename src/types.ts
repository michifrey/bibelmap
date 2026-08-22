export interface VerseRef {
  osis: string;
  ref: string; // human-readable, e.g. "2 Kgs 5:12"
  book: string; // OSIS book code, e.g. "2Kgs"
  bookNum: number; // 1..66
  chapter: number;
  verse: number;
  sort: string; // "BBCCCVVV"
}

export interface PlaceImage {
  url: string;
  credit: string | null;
  creditUrl: string | null;
  license: string | null;
}

export interface Place {
  id: string;
  /** English name from the OpenBible dataset, e.g. "Babylon 1". */
  name: string;
  /**
   * German name, recovered from the Lutherbibel 1912 by
   * `scripts/build-names-de.mjs`. Missing where the derivation was not
   * confident enough — see data/names-de-review.json.
   */
  nameDe?: string;
  /** German inflections and compounds ("Ägyptenland"), for text highlighting. */
  variantsDe?: string[];
  slug: string;
  article: string | null;
  types: string[];
  lat: number;
  lon: number;
  img: PlaceImage | null;
  wikidata: string | null;
  biblia: string | null;
  variants: string[];
  mentionCount: number;
  verses: VerseRef[];
}
