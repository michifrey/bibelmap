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
  name: string;
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
