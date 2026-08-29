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
  /**
   * Wer es als ökumenisch anerkennt.
   *
   * Das ist keine Nebenangabe, sondern der Kern: „Die ökumenischen Konzilien"
   * gibt es als eine Liste nicht. Rom zählt einundzwanzig, die Orthodoxie
   * bleibt bei den ersten sieben, und die orientalischen Kirchen erkennen nur
   * die ersten drei an – nach Chalcedon 451 gingen sie ihren eigenen Weg. Wer
   * einfach eine Liste hinschreibt, hat unbemerkt eine Seite gewählt und
   * verkauft sie als die gemeinsame.
   *
   * `npm run check:church` hält fest, dass jedes Konzil das trägt, und dass
   * Nicäa II das letzte ist, das Ost und West gemeinsam zählen.
   */
  recognisedBy: Tradition[];
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

/**
 * Die Konzilien. Bis 787 eine gemeinsame Liste, danach drei.
 *
 * Die ersten drei erkennen alle an. Nach Chalcedon 451 gehen die
 * orientalischen Kirchen ihren Weg; nach Nicäa II 787 zählt der Westen weiter
 * und der Osten nicht mehr mit. Die späteren stehen deshalb hier mit dem
 * Vermerk, wer sie führt – und nicht als Fortsetzung einer Liste, die es so
 * nicht mehr gibt.
 */
export const COUNCILS: Council[] = [
  { id: 'jerusalem', name: 'Apostelkonzil', city: 'Jerusalem', lat: 31.78, lon: 35.23, year: '~49',
    recognisedBy: ['west', 'east', 'orient'],
    de: { note: 'Heidenchristen müssen nicht das ganze mosaische Gesetz halten (Apg 15).' }, en: { note: 'Gentile believers need not keep the whole Mosaic law (Acts 15).' } },
  { id: 'nicaea1', name: 'Nicäa I', city: 'Nicäa (İznik)', lat: 40.43, lon: 29.72, year: '325',
    recognisedBy: ['west', 'east', 'orient'],
    de: { note: 'Gegen den Arianismus; das Nicänische Glaubensbekenntnis, „wesensgleich".' }, en: { note: 'Against Arianism; the Nicene Creed, "of one being" with the Father.' } },
  { id: 'constantinople1', name: 'Konstantinopel I', city: 'Konstantinopel', lat: 41.01, lon: 28.98, year: '381',
    recognisedBy: ['west', 'east', 'orient'],
    de: { note: 'Bestätigt Nicäa, ergänzt die Lehre vom Heiligen Geist.' }, en: { note: 'Confirms Nicaea, completes the doctrine of the Holy Spirit.' } },
  { id: 'ephesus', name: 'Ephesus', city: 'Ephesus', lat: 37.94, lon: 27.34, year: '431',
    recognisedBy: ['west', 'east', 'orient'],
    de: { note: 'Maria als „Gottesgebärerin" (Theotokos); gegen Nestorius. Die Kirche des Ostens trennt sich hier ab.' }, en: { note: 'Mary as "God-bearer" (Theotokos); against Nestorius. The Church of the East separates here.' } },
  { id: 'chalcedon', name: 'Chalcedon', city: 'Chalcedon (Kadıköy)', lat: 40.99, lon: 29.03, year: '451',
    recognisedBy: ['west', 'east'],
    de: { note: 'Christus: zwei Naturen in einer Person. Die orientalischen Kirchen zählen es nicht mit – für sie enden die gemeinsamen Konzilien hier.' }, en: { note: 'Christ: two natures in one person. The Oriental churches do not count it – for them the shared councils end here.' } },
  { id: 'constantinople2', name: 'Konstantinopel II', city: 'Konstantinopel', lat: 41.01, lon: 28.98, year: '553',
    recognisedBy: ['west', 'east'],
    de: { note: 'Auslegung von Chalcedon; Verurteilung der „Drei Kapitel".' }, en: { note: 'Interprets Chalcedon; condemns the "Three Chapters".' } },
  { id: 'constantinople3', name: 'Konstantinopel III', city: 'Konstantinopel', lat: 41.01, lon: 28.98, year: '680–681',
    recognisedBy: ['west', 'east'],
    de: { note: 'Christus hat zwei Willen (gegen den Monotheletismus).' }, en: { note: 'Christ has two wills (against Monotheletism).' } },
  { id: 'nicaea2', name: 'Nicäa II', city: 'Nicäa (İznik)', lat: 40.43, lon: 29.72, year: '787',
    recognisedBy: ['west', 'east'],
    de: { note: 'Verehrung von Ikonen erlaubt; Ende des ersten Bilderstreits. Das letzte Konzil, das Ost und West gemeinsam anerkennen.' }, en: { note: 'Veneration of icons affirmed; end of the first iconoclasm. The last council East and West both recognise.' } },

  // Ab hier zählt nur noch der Westen mit. Nicht alle einundzwanzig römischen
  // Konzilien stehen hier, sondern die, die etwas veränderten, das über die
  // eigene Kirche hinausreicht.
  { id: 'lateran4', name: 'Laterankonzil IV', city: 'Rom', lat: 41.89, lon: 12.51, year: '1215',
    recognisedBy: ['west'],
    de: { note: 'Beichtpflicht einmal im Jahr, die Lehre von der Wandlung – und Kleidervorschriften für Juden und Muslime, die Jahrhunderte nachwirkten.' }, en: { note: 'Annual confession required, the doctrine of transubstantiation – and dress rules for Jews and Muslims that echoed for centuries.' } },
  { id: 'konstanz', name: 'Konstanz', city: 'Konstanz', lat: 47.66, lon: 9.18, year: '1414–1418',
    recognisedBy: ['west'],
    de: { note: 'Beendet das Schisma dreier gleichzeitiger Päpste – und lässt Jan Hus trotz Geleitbrief verbrennen.' }, en: { note: 'Ends the schism of three simultaneous popes – and has Jan Hus burnt despite a safe-conduct.' } },
  { id: 'ferrara', name: 'Ferrara–Florenz', city: 'Florenz', lat: 43.77, lon: 11.26, year: '1438–1445',
    recognisedBy: ['west'],
    de: { note: 'Der Versuch, die Trennung von 1054 rückgängig zu machen. Die Union wird unterschrieben und im Osten von den Gemeinden nicht angenommen.' }, en: { note: 'The attempt to undo the split of 1054. The union is signed and rejected by the congregations in the East.' } },
  { id: 'trient', name: 'Trient', city: 'Trient (Trento)', lat: 46.07, lon: 11.12, year: '1545–1563',
    recognisedBy: ['west'],
    de: { note: 'Die Antwort auf die Reformation: Missstände abgestellt, jeder reformatorische Lehrsatz verworfen. Prägt den Katholizismus bis 1962.' }, en: { note: 'The answer to the Reformation: abuses removed, every Reformation doctrine rejected. Shapes Catholicism until 1962.' } },
  { id: 'vatikan1', name: 'Vatikanum I', city: 'Rom', lat: 41.9, lon: 12.45, year: '1869–1870',
    recognisedBy: ['west'],
    de: { note: 'Die Unfehlbarkeit des Papstes in endgültigen Lehrentscheidungen. Bricht ab, als italienische Truppen Rom nehmen.' }, en: { note: 'Papal infallibility in definitive doctrinal decisions. Breaks off when Italian troops take Rome.' } },
  { id: 'vatikan2', name: 'Vatikanum II', city: 'Rom', lat: 41.9, lon: 12.45, year: '1962–1965',
    recognisedBy: ['west'],
    de: { note: 'Messe in der Landessprache, Religionsfreiheit als Recht, ein neues Verhältnis zum Judentum. Die größte Änderung seit Trient.' }, en: { note: 'Mass in the vernacular, religious freedom as a right, a new relationship with Judaism. The largest change since Trent.' } },
];
