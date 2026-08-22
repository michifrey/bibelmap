// Early church history overlay: church fathers (West / East / Oriental) and the
// ecumenical councils. Coordinates are approximate locations of the ancient
// cities. Notes are short and factual.
//
// Paul's missionary journeys used to live here as a third tab. They are now in
// `mission.ts` / the Mission & spread view, which tells the same routes with a
// passage per stop and a link into the place data — one place, not two.

import { GENEALOGY, formatYear, type Tradition } from './genealogy';

// Re-exported so existing imports (`import { Tradition } from './church'`) keep working.
export type { Tradition };

export interface Father {
  id: string;
  /** Linked genealogy person id — the SAME record powers the time tree. */
  personId: string;
  de: string; // display name
  en: string;
  city: string;
  lat: number;
  lon: number;
  years: string;
  tradition: Tradition;
  deNote: string;
  enNote: string;
}

export interface Council {
  id: string;
  name: string;
  city: string;
  lat: number;
  lon: number;
  year: string;
  de: { note: string };
  en: { note: string };
}

export const TRADITION_COLOR: Record<Tradition, string> = {
  west: '#b8742e', // Latin / Western
  east: '#2f8f7f', // Greek / Eastern
  orient: '#7a4ea8', // Oriental Orthodox / Syriac
};

export const TRADITION_LABEL: Record<Tradition, { de: string; en: string }> = {
  west: { de: 'Westlich (lateinisch)', en: 'Western (Latin)' },
  east: { de: 'Östlich (griechisch)', en: 'Eastern (Greek)' },
  orient: { de: 'Orientalisch / syrisch', en: 'Oriental / Syriac' },
};
// Church fathers are derived from the genealogy: every Person that carries a
// `tradition` + coordinates appears here AND as a node in the time tree, from a
// single source of truth (no more duplicated, drifting data). Sorted by birth.
export const FATHERS: Father[] = GENEALOGY
  .filter((p) => p.tradition && p.lat != null && p.lon != null)
  .sort((a, b) => (a.born ?? 0) - (b.born ?? 0))
  .map((p) => ({
    id: p.id,
    personId: p.id,
    de: p.de,
    en: p.en,
    city: p.city ?? '',
    lat: p.lat as number,
    lon: p.lon as number,
    years: p.years ?? (p.born != null ? formatYear(p.born, 'de') : ''),
    tradition: p.tradition as Tradition,
    deNote: p.deText,
    enNote: p.enText,
  }));

export const COUNCILS: Council[] = [
  { id: 'jerusalem', name: 'Apostelkonzil', city: 'Jerusalem', lat: 31.78, lon: 35.23, year: '~49',
    de: { note: 'Heidenchristen müssen nicht das ganze mosaische Gesetz halten (Apg 15).' }, en: { note: 'Gentile believers need not keep the whole Mosaic law (Acts 15).' } },
  { id: 'nicaea1', name: 'Nicäa I', city: 'Nicäa (İznik)', lat: 40.43, lon: 29.72, year: '325',
    de: { note: 'Gegen den Arianismus; das Nicänische Glaubensbekenntnis, „wesensgleich".' }, en: { note: 'Against Arianism; the Nicene Creed, “of one being” with the Father.' } },
  { id: 'constantinople1', name: 'Konstantinopel I', city: 'Konstantinopel', lat: 41.01, lon: 28.98, year: '381',
    de: { note: 'Bestätigt Nicäa, ergänzt die Lehre vom Heiligen Geist.' }, en: { note: 'Confirms Nicaea, completes the doctrine of the Holy Spirit.' } },
  { id: 'ephesus', name: 'Ephesus', city: 'Ephesus', lat: 37.94, lon: 27.34, year: '431',
    de: { note: 'Maria als „Gottesgebärerin" (Theotokos); gegen Nestorius.' }, en: { note: 'Mary as “God-bearer” (Theotokos); against Nestorius.' } },
  { id: 'chalcedon', name: 'Chalcedon', city: 'Chalcedon (Kadıköy)', lat: 40.99, lon: 29.03, year: '451',
    de: { note: 'Christus: zwei Naturen in einer Person. Trennung der orientalischen Kirchen.' }, en: { note: 'Christ: two natures in one person. The Oriental churches separate here.' } },
  { id: 'constantinople2', name: 'Konstantinopel II', city: 'Konstantinopel', lat: 41.01, lon: 28.98, year: '553',
    de: { note: 'Auslegung von Chalcedon; Verurteilung der „Drei Kapitel".' }, en: { note: 'Interprets Chalcedon; condemns the “Three Chapters”.' } },
  { id: 'constantinople3', name: 'Konstantinopel III', city: 'Konstantinopel', lat: 41.01, lon: 28.98, year: '680–681',
    de: { note: 'Christus hat zwei Willen (gegen den Monotheletismus).' }, en: { note: 'Christ has two wills (against Monotheletism).' } },
  { id: 'nicaea2', name: 'Nicäa II', city: 'Nicäa (İznik)', lat: 40.43, lon: 29.72, year: '787',
    de: { note: 'Verehrung von Ikonen erlaubt; Ende des ersten Bilderstreits.' }, en: { note: 'Veneration of icons affirmed; end of the first iconoclasm.' } },
];
