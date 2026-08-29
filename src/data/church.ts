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
    de: { note: 'Die erste Streitfrage der Kirche und zugleich ihre härteste: Müssen Heiden erst Juden werden? Die Entscheidung lautet nein – bei vier Auflagen, die das gemeinsame Essen möglich machen. Lukas in Apostelgeschichte 15 und Paulus in Galater 2 erzählen den Vorgang nicht deckungsgleich.' }, en: { note: 'The church’s first controversy and its hardest: must gentiles become Jews first? The answer is no – with four stipulations that make eating together possible. Luke in Acts 15 and Paul in Galatians 2 do not tell the episode identically.' } },
  { id: 'nicaea1', name: 'Nicäa I', city: 'Nicäa (İznik)', lat: 40.43, lon: 29.72, year: '325',
    recognisedBy: ['west', 'east', 'orient'],
    de: { note: 'Der Streit ging nicht um eine Feinheit: Ist der Sohn geschaffen oder nicht? Arius sagte, es habe eine Zeit gegeben, da er nicht war. Das Konzil antwortete mit einem Wort, das nirgends in der Bibel steht – „wesensgleich" –, und genau das war der Haupteinwand dagegen.' }, en: { note: 'The dispute was no fine point: is the Son created or not? Arius said there was a time when he was not. The council answered with a word that stands nowhere in the Bible – "of one being" – and that was precisely the main objection to it.' } },
  { id: 'constantinople1', name: 'Konstantinopel I', city: 'Konstantinopel', lat: 41.01, lon: 28.98, year: '381',
    recognisedBy: ['west', 'east', 'orient'],
    de: { note: 'Ergänzt, was Nicäa offengelassen hatte: auch der Heilige Geist wird angebetet und verherrlicht. Was heute als „Nicänisches Glaubensbekenntnis" gebetet und gesungen wird, ist in Wahrheit die Fassung von 381 – nicht die von 325.' }, en: { note: 'Completes what Nicaea had left open: the Holy Spirit too is worshipped and glorified. What is recited and sung today as the "Nicene Creed" is in fact the version of 381, not the one from 325.' } },
  { id: 'ephesus', name: 'Ephesus', city: 'Ephesus', lat: 37.94, lon: 27.34, year: '431',
    recognisedBy: ['west', 'east', 'orient'],
    de: { note: '„Gottesgebärerin" ist als Aussage über Christus gemeint, nicht über Maria: Der geboren wurde, ist derselbe, der Gott ist. Kyrill eröffnete, bevor die Bischöfe aus Antiochia eintrafen, und Nestorius kam nicht zu Wort – ein Vorgehen, das bis heute umstritten ist. Die Kirche des Ostens trennt sich hier ab.' }, en: { note: '"God-bearer" is meant as a statement about Christ, not about Mary: the one who was born is the same one who is God. Cyril opened before the bishops from Antioch had arrived, and Nestorius never got to speak – a procedure disputed to this day. The Church of the East separates here.' } },
  { id: 'chalcedon', name: 'Chalcedon', city: 'Chalcedon (Kadıköy)', lat: 40.99, lon: 29.03, year: '451',
    recognisedBy: ['west', 'east'],
    de: { note: 'Die berühmteste Formel der Christenheit sagt vor allem, was man nicht sagen darf: zwei Naturen in einer Person, „unvermischt, unverwandelt, ungetrennt, ungesondert". Die orientalischen Kirchen zählen es nicht mit – seit den 1970er Jahren halten gemeinsame Erklärungen fest, dass der Streit weitgehend an einem Wort hing.' }, en: { note: 'Christendom’s most famous formula says above all what may not be said: two natures in one person, "without confusion, without change, without division, without separation". The Oriental churches do not count it – since the 1970s joint declarations have recorded that the quarrel hung largely on one word.' } },
  { id: 'constantinople2', name: 'Konstantinopel II', city: 'Konstantinopel', lat: 41.01, lon: 28.98, year: '553',
    recognisedBy: ['west', 'east'],
    de: { note: 'Kaiser Justinian ließ drei längst verstorbene Theologen verurteilen, um die Gegner Chalcedons zurückzugewinnen. Papst Vigilius, in Konstantinopel faktisch festgehalten, stimmte am Ende zu. Zurückgewonnen wurde niemand; der Riss wurde tiefer.' }, en: { note: 'Emperor Justinian had three long-dead theologians condemned in order to win back the opponents of Chalcedon. Pope Vigilius, effectively detained in Constantinople, agreed in the end. Nobody was won back; the rift only deepened.' } },
  { id: 'constantinople3', name: 'Konstantinopel III', city: 'Konstantinopel', lat: 41.01, lon: 28.98, year: '680–681',
    recognisedBy: ['west', 'east'],
    de: { note: 'Wenn Christus zwei Naturen hat, hat er auch zwei Willen – einen menschlichen, der frei zustimmt. Nebenbei verurteilte das Konzil einen längst verstorbenen Papst, Honorius, wegen Nachgiebigkeit; zwölfhundert Jahre später war das ein Hauptargument gegen die Unfehlbarkeit.' }, en: { note: 'If Christ has two natures he also has two wills – a human one that freely consents. In passing, the council condemned a long-dead pope, Honorius, for compliance; twelve hundred years later that was a main argument against infallibility.' } },
  { id: 'nicaea2', name: 'Nicäa II', city: 'Nicäa (İznik)', lat: 40.43, lon: 29.72, year: '787',
    recognisedBy: ['west', 'east'],
    de: { note: 'Nach sechzig Jahren, in denen Bilder zerschlagen wurden, die Unterscheidung: Verehrung gilt dem Dargestellten, Anbetung allein Gott. Die fränkischen Bischöfe lehnten das Konzil zunächst ab – ihre lateinische Übersetzung hatte aus der Verehrung eine Anbetung gemacht. Das letzte Konzil, das Ost und West gemeinsam anerkennen.' }, en: { note: 'After sixty years of images being smashed, the distinction: veneration is directed to what is depicted, worship to God alone. The Frankish bishops at first rejected the council – their Latin translation had turned veneration into worship. The last council East and West recognise together.' } },

  // Ab hier zählt nur noch der Westen mit. Nicht alle einundzwanzig römischen
  // Konzilien stehen hier, sondern die, die etwas veränderten, das über die
  // eigene Kirche hinausreicht.
  { id: 'lateran4', name: 'Laterankonzil IV', city: 'Rom', lat: 41.89, lon: 12.51, year: '1215',
    recognisedBy: ['west'],
    de: { note: 'Über tausend Kirchenobere, das größte Treffen bis dahin. Beichte und Kommunion einmal im Jahr werden Pflicht, für die Wandlung wird ein Wort festgelegt – und Juden und Muslimen wird erkennbare Kleidung vorgeschrieben, eine Bestimmung, die Jahrhunderte nachwirkte.' }, en: { note: 'Over a thousand church leaders, the largest gathering to that date. Annual confession and communion become obligatory, a term is fixed for the change in the elements – and Jews and Muslims are required to wear distinguishing dress, a ruling that echoed for centuries.' } },
  { id: 'konstanz', name: 'Konstanz', city: 'Konstanz', lat: 47.66, lon: 9.18, year: '1414–1418',
    recognisedBy: ['west'],
    de: { note: 'Drei Päpste gleichzeitig, und das Konzil erklärt sich kurzerhand über sie alle – ein Anspruch, den Rom später verwarf. Jan Hus kommt mit kaiserlichem Geleitbrief und wird trotzdem verbrannt; Wyclif, dreißig Jahre tot, wird verurteilt und ausgegraben.' }, en: { note: 'Three popes at once, and the council simply declares itself above all of them – a claim Rome later rejected. Jan Hus comes with an imperial safe-conduct and is burned anyway; Wyclif, thirty years dead, is condemned and dug up.' } },
  { id: 'ferrara', name: 'Ferrara–Florenz', city: 'Florenz', lat: 43.77, lon: 11.26, year: '1438–1445',
    recognisedBy: ['west'],
    de: { note: 'Der Versuch, die Trennung von 1054 rückgängig zu machen – unter Druck: Konstantinopel brauchte Hilfe gegen die Osmanen. Die Union wird unterschrieben und zu Hause von den Gemeinden nicht angenommen. Vierzehn Jahre später fällt die Stadt.' }, en: { note: 'The attempt to undo the split of 1054 – under pressure: Constantinople needed help against the Ottomans. The union is signed, and at home the congregations do not accept it. Fourteen years later the city falls.' } },
  { id: 'trient', name: 'Trient', city: 'Trient (Trento)', lat: 46.07, lon: 11.12, year: '1545–1563',
    recognisedBy: ['west'],
    de: { note: 'Achtzehn Jahre in drei Anläufen. Der Verkauf von Ablässen, an dem sich alles entzündet hatte, wird abgestellt; zugleich wird jeder reformatorische Lehrsatz einzeln verworfen. Die Protestanten waren geladen, aber nicht als Gleiche. Prägt den Katholizismus bis 1962.' }, en: { note: 'Eighteen years in three sittings. The sale of indulgences, over which the whole thing had ignited, is stopped; at the same time every Reformation doctrine is condemned one by one. Protestants were invited, but not as equals. It shapes Catholicism until 1962.' } },
  { id: 'vatikan1', name: 'Vatikanum I', city: 'Rom', lat: 41.9, lon: 12.45, year: '1869–1870',
    recognisedBy: ['west'],
    de: { note: 'Die Unfehlbarkeit des Papstes – eng gefasst: nur für endgültige Entscheidungen über Glaube und Sitte. Rund sechzig Bischöfe reisten vor der Abstimmung ab, statt dagegen zu stimmen. Zwei Monate später nehmen italienische Truppen Rom, und das Konzil bricht ab.' }, en: { note: 'Papal infallibility – narrowly framed: only for definitive decisions on faith and morals. Some sixty bishops left before the vote rather than vote against. Two months later Italian troops take Rome and the council breaks off.' } },
  { id: 'vatikan2', name: 'Vatikanum II', city: 'Rom', lat: 41.9, lon: 12.45, year: '1962–1965',
    recognisedBy: ['west'],
    de: { note: 'Rund zweitausendfünfhundert Bischöfe, und das erste Konzil, das keinen Lehrsatz festlegt und niemanden verurteilt. Messe in der Landessprache, Religionsfreiheit als Recht jedes Menschen – und in „Nostra Aetate" die Absage an den Vorwurf, die Juden trügen Schuld am Tod Jesu.' }, en: { note: 'Some two and a half thousand bishops, and the first council to define no doctrine and condemn no one. Mass in the vernacular, religious freedom as every person’s right – and in "Nostra Aetate" the repudiation of the charge that the Jews bear guilt for the death of Jesus.' } },
];
