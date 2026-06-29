// Early church history overlay: Paul's missionary journeys (routes), church
// fathers (West / East / Oriental) and the ecumenical councils. Coordinates are
// approximate locations of the ancient cities. Notes are short and factual.

import { GENEALOGY, formatYear, type Tradition } from './genealogy';

// Re-exported so existing imports (`import { Tradition } from './church'`) keep working.
export type { Tradition };

export interface Stop {
  name: string;
  lat: number;
  lon: number;
}

export interface Journey {
  id: string;
  color: string;
  date: string;
  de: { title: string; text: string };
  en: { title: string; text: string };
  ref: string;
  stops: Stop[];
}

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

export const JOURNEYS: Journey[] = [
  {
    id: 'j1', color: '#c2812a', date: '~46–48 n. Chr.', ref: 'Apg 13–14',
    de: { title: '1. Missionsreise', text: 'Von Antiochia über Zypern nach Kleinasien: Paulus und Barnabas gründen Gemeinden in Pisidien und Lykaonien.' },
    en: { title: 'First journey', text: 'From Antioch via Cyprus into Asia Minor: Paul and Barnabas plant churches in Pisidia and Lycaonia.' },
    stops: [
      { name: 'Antiochia', lat: 36.2, lon: 36.16 }, { name: 'Seleucia', lat: 36.12, lon: 35.93 },
      { name: 'Salamis', lat: 35.18, lon: 33.9 }, { name: 'Paphos', lat: 34.77, lon: 32.42 },
      { name: 'Perge', lat: 36.96, lon: 30.85 }, { name: 'Antiochia (Pisidien)', lat: 38.3, lon: 31.19 },
      { name: 'Ikonion', lat: 37.87, lon: 32.49 }, { name: 'Lystra', lat: 37.58, lon: 32.45 },
      { name: 'Derbe', lat: 37.35, lon: 33.28 }, { name: 'Attalia', lat: 36.88, lon: 30.7 },
      { name: 'Antiochia', lat: 36.2, lon: 36.16 },
    ],
  },
  {
    id: 'j2', color: '#2f8f7f', date: '~49–52 n. Chr.', ref: 'Apg 15,36–18,22',
    de: { title: '2. Missionsreise', text: 'Über Kleinasien nach Europa: Philippi, Thessalonich, Athen und das anderthalb Jahre währende Wirken in Korinth.' },
    en: { title: 'Second journey', text: 'Across Asia Minor into Europe: Philippi, Thessalonica, Athens and eighteen months in Corinth.' },
    stops: [
      { name: 'Antiochia', lat: 36.2, lon: 36.16 }, { name: 'Tarsus', lat: 36.92, lon: 34.89 },
      { name: 'Derbe', lat: 37.35, lon: 33.28 }, { name: 'Lystra', lat: 37.58, lon: 32.45 },
      { name: 'Troas', lat: 39.75, lon: 26.16 }, { name: 'Neapolis', lat: 40.94, lon: 24.41 },
      { name: 'Philippi', lat: 41.01, lon: 24.29 }, { name: 'Thessalonich', lat: 40.64, lon: 22.94 },
      { name: 'Beröa', lat: 40.52, lon: 22.2 }, { name: 'Athen', lat: 37.98, lon: 23.73 },
      { name: 'Korinth', lat: 37.91, lon: 22.88 }, { name: 'Ephesus', lat: 37.94, lon: 27.34 },
      { name: 'Caesarea', lat: 32.5, lon: 34.89 }, { name: 'Antiochia', lat: 36.2, lon: 36.16 },
    ],
  },
  {
    id: 'j3', color: '#3a6ea8', date: '~53–57 n. Chr.', ref: 'Apg 18,23–21,17',
    de: { title: '3. Missionsreise', text: 'Drei Jahre in Ephesus, erneut durch Mazedonien und Griechenland; am Ende die Reise hinauf nach Jerusalem.' },
    en: { title: 'Third journey', text: 'Three years in Ephesus, again through Macedonia and Greece, ending with the journey up to Jerusalem.' },
    stops: [
      { name: 'Antiochia', lat: 36.2, lon: 36.16 }, { name: 'Ikonion', lat: 37.87, lon: 32.49 },
      { name: 'Ephesus', lat: 37.94, lon: 27.34 }, { name: 'Philippi', lat: 41.01, lon: 24.29 },
      { name: 'Korinth', lat: 37.91, lon: 22.88 }, { name: 'Troas', lat: 39.75, lon: 26.16 },
      { name: 'Milet', lat: 37.53, lon: 27.28 }, { name: 'Tyrus', lat: 33.27, lon: 35.2 },
      { name: 'Caesarea', lat: 32.5, lon: 34.89 }, { name: 'Jerusalem', lat: 31.78, lon: 35.23 },
    ],
  },
  {
    id: 'j4', color: '#9a4ba0', date: '~59–60 n. Chr.', ref: 'Apg 27–28',
    de: { title: 'Reise nach Rom', text: 'Als Gefangener segelt Paulus über Kreta, erleidet Schiffbruch bei Malta und erreicht schließlich Rom.' },
    en: { title: 'Voyage to Rome', text: 'As a prisoner Paul sails past Crete, is shipwrecked on Malta and finally reaches Rome.' },
    stops: [
      { name: 'Caesarea', lat: 32.5, lon: 34.89 }, { name: 'Sidon', lat: 33.56, lon: 35.37 },
      { name: 'Myra', lat: 36.26, lon: 29.98 }, { name: 'Kreta (Guthafen)', lat: 34.91, lon: 24.8 },
      { name: 'Malta', lat: 35.9, lon: 14.51 }, { name: 'Syrakus', lat: 37.07, lon: 15.29 },
      { name: 'Rhegium', lat: 38.11, lon: 15.65 }, { name: 'Puteoli', lat: 40.82, lon: 14.12 },
      { name: 'Rom', lat: 41.89, lon: 12.49 },
    ],
  },
];

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
