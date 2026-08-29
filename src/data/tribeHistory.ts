// Was aus den zwölf Stämmen wurde.
//
// Die Loskarte in `tribes.ts` zeigt einen einzigen Augenblick: das Land, wie es
// unter Josua verteilt wurde. Das ist der Anfang der Geschichte, nicht ihr
// Ende – und die Frage, die jede Stammeskarte auslöst, ist die nächste: Was
// wurde aus ihnen? Diese Datei beantwortet sie in sechs Bildern, die dieselben
// Gebiete nur anders einfärben.
//
// Die Jahreszahlen sind die gängigen Ansätze der biblischen Chronologie; die
// drei assyrischen und babylonischen sind auch außerbiblisch datiert
// (732, 722, 586 v. Chr.), die beiden ersten sind Näherungen.

import type { BiText } from './nationsTribes';

/** Wie ein Gebiet in einer Phase dasteht. */
export type Fate = 'lot' | 'north' | 'south' | 'gone' | 'left' | 'returned';

export const FATE_COLOR: Record<Fate, string> = {
  lot: '', // die Stämme behalten ihre eigene Farbe
  north: '#3f8fb8',
  south: '#6f9e3c',
  gone: '#3d4b49',
  left: '#3f8fb8',
  returned: '#e0a449',
};

export const FATE_LABEL: Record<Fate, BiText> = {
  lot: { de: 'Eigenes Los', en: 'Its own lot' },
  north: { de: 'Nordreich Israel', en: 'Northern kingdom of Israel' },
  south: { de: 'Südreich Juda', en: 'Southern kingdom of Judah' },
  gone: { de: 'Verschleppt', en: 'Deported' },
  left: { de: 'Was noch übrig war', en: 'What was left' },
  returned: { de: 'Zurückgekehrt', en: 'Returned' },
};

/** Eine Stadt, die einer Phase ihr Gesicht gibt. */
export interface HistPlace {
  de: string;
  en: string;
  lat: number;
  lon: number;
}

/**
 * Ein Weg, der aus dem Bild hinausführt – die Verschleppungen. Das Ziel liegt
 * bewusst noch im Kartenausschnitt und nicht auf Ninive oder Babylon: der Pfeil
 * soll die Richtung zeigen, ohne dass man erst herauszoomen muss. Wo es
 * wirklich hinging, steht daneben.
 */
export interface Exile {
  from: [number, number];
  to: [number, number];
  de: string;
  en: string;
}

export interface Phase {
  id: string;
  /** Negativ = v. Chr. Nur zur Beschriftung; die Reihenfolge macht das Array. */
  year: number;
  /** „um 1200" für die geschätzten, schlicht die Zahl für die datierten. */
  about?: boolean;
  de: string;
  en: string;
  ref: string;
  /**
   * Was die Chronik zu dieser Phase führt – und wo sie schweigt.
   *
   * Die Züge oben stützen sich auf Josua, Richter und die Königsbücher. Die
   * Chronik erzählt denselben Zeitraum ein zweites Mal, aus Juda gesehen und
   * Jahrhunderte später aufgeschrieben, und sie setzt andere Schwerpunkte:
   * Städtelisten, wo die Könige Feldzüge erzählen; die Richterzeit lässt sie
   * ganz aus. Beides gehört nebeneinander, damit sichtbar wird, dass die Karte
   * auf zwei Zeugen steht und nicht auf einem.
   *
   * `ref: null` heißt: Zu dieser Phase führt die Chronik nichts – auch das
   * eine Auskunft.
   */
  chronicles: { ref: string | null; text: BiText };
  text: BiText;
  /** Gebiet → Los. Was hier fehlt, behält seine Stammesfarbe (Phase 1). */
  fates: Record<string, Fate>;
  /** Orte, die genau in dieser Phase etwas erzählen. */
  places?: HistPlace[];
  placesLabel?: BiText;
  exiles?: Exile[];
}

const ALL_WEST = ['asher', 'naphtali', 'zebulun', 'issachar', 'manasseh', 'ephraim', 'dan', 'benjamin', 'judah', 'simeon'];
const ALL_EAST = ['reuben', 'gad', 'm-east'];
const ALL = [...ALL_WEST, ...ALL_EAST];

function fates(map: Record<string, Fate>, fallback: Fate): Record<string, Fate> {
  const out: Record<string, Fate> = {};
  for (const id of ALL) out[id] = map[id] ?? fallback;
  return out;
}

export const PHASES: Phase[] = [
  {
    id: 'lots',
    year: -1200,
    about: true,
    de: 'Die Landnahme',
    en: 'The land divided',
    ref: 'Jos 13–21',
    chronicles: {
      ref: '1Chr 2–8 · 1Chr 6,39-66',
      text: {
        de: 'Die Chronik erzählt keine Landnahme. Sie führt das Ergebnis: Stamm für Stamm ein Geschlechterregister, und dazu die längste Ortsliste des Buches – die Levitenstädte, aus jedem Los herausgelöst. Sebulon und Dan bekommen dabei überhaupt kein Register.',
        en: 'Chronicles tells no conquest. It records the outcome: a genealogy tribe by tribe, and with it the book’s longest list of places – the Levitical towns, taken out of every lot. Zebulun and Dan get no register at all.',
      },
    },
    text: {
      de: 'Josua verlost das Land. Zwölf Stämme, zwölf Anteile – nur bekommt Levi keinen und Josef zwei, damit die Zwölf aufgeht. So sah es aus, als es anfing.',
      en: 'Joshua casts lots for the land. Twelve tribes, twelve shares – except Levi gets none and Joseph two, so that the twelve still add up. This is how it looked when it began.',
    },
    fates: fates({}, 'lot'),
  },
  {
    id: 'remained',
    year: -1150,
    about: true,
    de: 'Was nicht erobert wurde',
    en: 'What was never taken',
    ref: 'Ri 1,19-36',
    chronicles: {
      ref: null,
      text: {
        de: 'Hier schweigt die Chronik. Sie überspringt die Richterzeit vollständig – von den Geschlechterlisten springt sie zu Sauls Tod und zu David. Die Liste des Scheiterns steht nur bei den Richtern.',
        en: 'Here Chronicles is silent. It skips the era of the judges entirely – from the genealogies it jumps to Saul’s death and to David. The list of failure stands only in Judges.',
      },
    },
    text: {
      de: 'Das Buch der Richter beginnt mit einer Liste des Scheiterns: Stamm für Stamm, was jeder *nicht* vertrieben hat. Die Namen ergeben ein Muster – die Ebenen und die Küste blieben, wo sie waren, und Israel saß im Bergland. „Denn sie hatten eiserne Wagen" (Ri 1,19).',
      en: 'The book of Judges opens with a list of failures: tribe by tribe, what each one did *not* drive out. The names form a pattern – the valleys and the coast stayed as they were, and Israel sat in the hills. "Because they had chariots of iron" (Judg 1:19).',
    },
    fates: fates({}, 'lot'),
    placesLabel: { de: 'Blieb in fremder Hand', en: 'Stayed in other hands' },
    places: [
      { de: 'Jerusalem', en: 'Jerusalem', lat: 31.78, lon: 35.23 },
      { de: 'Geser', en: 'Gezer', lat: 31.87, lon: 34.92 },
      { de: 'Megiddo', en: 'Megiddo', lat: 32.58, lon: 35.18 },
      { de: 'Taanach', en: 'Taanach', lat: 32.52, lon: 35.22 },
      { de: 'Jibleam', en: 'Ibleam', lat: 32.48, lon: 35.3 },
      { de: 'Bet-Schean', en: 'Beth-shean', lat: 32.5, lon: 35.5 },
      { de: 'Dor', en: 'Dor', lat: 32.62, lon: 34.92 },
      { de: 'Akko', en: 'Acco', lat: 32.92, lon: 35.08 },
      { de: 'Achsib', en: 'Achzib', lat: 33.05, lon: 35.1 },
      { de: 'Sidon', en: 'Sidon', lat: 33.56, lon: 35.37 },
    ],
  },
  {
    id: 'split',
    year: -930,
    de: 'Die Reichsteilung',
    en: 'The kingdom splits',
    ref: '1Kön 12',
    chronicles: {
      ref: '2Chr 11,5-12 · 2Chr 13,19',
      text: {
        de: 'Die Könige erzählen den Bruch, die Chronik das Gebiet danach: Rehabeam baut fünfzehn Städte zu Festungen aus – „welche waren die festen Städte in Juda und Benjamin". Und Abia holt sich Bet-El, Jesana und Efron vom Nordreich zurück, die Grenze verschiebt sich also gleich wieder.',
        en: 'Kings tells the break, Chronicles the land afterwards: Rehoboam fortifies fifteen towns – "these were the fortified cities in Judah and Benjamin". And Abijah takes Bethel, Jeshanah and Ephron back from the north, so the border shifts again at once.',
      },
    },
    text: {
      de: 'Nach Salomos Tod bricht das Reich an der Frage der Fronarbeit auseinander: zehn Stämme folgen Jerobeam, zwei bleiben bei Rehabeam. Von hier an gibt es zwei Länder mit zwei Königen – und die Grenze läuft quer durch Benjamin, wenige Kilometer nördlich von Jerusalem. Levi hat kein Gebiet, das sich einfärben ließe, zieht aber mit: die Priester und Leviten verlassen ihre Städte im Norden und gehen nach Juda (2Chr 11,13-16).',
      en: "After Solomon's death the kingdom breaks apart over forced labour: ten tribes follow Jeroboam, two stay with Rehoboam. From here on there are two countries with two kings – and the border runs straight through Benjamin, a few miles north of Jerusalem. Levi has no territory to colour in but moves all the same: the priests and Levites leave their towns in the north and go to Judah (2 Chr 11:13-16).",
    },
    fates: fates({ judah: 'south', benjamin: 'south', simeon: 'south' }, 'north'),
    placesLabel: { de: 'Die neuen Hauptstädte', en: 'The new capitals' },
    places: [
      { de: 'Samaria', en: 'Samaria', lat: 32.28, lon: 35.2 },
      { de: 'Sichem', en: 'Shechem', lat: 32.21, lon: 35.28 },
      { de: 'Jerusalem', en: 'Jerusalem', lat: 31.78, lon: 35.23 },
      { de: 'Bet-El', en: 'Bethel', lat: 31.93, lon: 35.22 },
      { de: 'Dan', en: 'Dan', lat: 33.25, lon: 35.65 },
    ],
  },
  {
    id: 'assyria-north',
    year: -732,
    de: 'Assur nimmt Galiläa und Gilead',
    en: 'Assyria takes Galilee and Gilead',
    ref: '2Kön 15,29',
    chronicles: {
      ref: '1Chr 5,26 · 2Chr 28,6-8',
      text: {
        de: 'Die Wegführung der Ostjordanstämme steht in der Chronik nicht am Ende, sondern mitten im Register: Ruben, Gad und Halb-Manasse werden schon dort weggeführt, wo ihre Namen aufgezählt werden (1Chr 5,26). Der Abschnitt nennt das Ende gleich beim Anfang.',
        en: 'The deportation of the eastern tribes stands in Chronicles not at the end but inside the register: Reuben, Gad and half-Manasseh are carried off in the very passage that lists their names (1 Chr 5:26). The section names the end alongside the beginning.',
      },
    },
    text: {
      de: 'Tiglat-Pileser III. nimmt „das ganze Land Naftali" und das Ostjordanland und führt die Bewohner fort. Galiläa, die Küstenebene und ganz Gilead werden assyrische Provinzen – vom Nordreich bleibt der Kern um Samaria, ein Rumpfstaat auf Abruf. Über das verlorene Galiläa schreibt Jesaja denselben Satz zweimal: erst „Galiläa der Heiden", dann „das Volk, das im Finstern wandelt, sieht ein großes Licht" (Jes 8,23–9,1).',
      en: 'Tiglath-Pileser III takes "all the land of Naphtali" and the land east of the Jordan and carries its people away. Galilee, the coastal plain and the whole of Gilead become Assyrian provinces – of the northern kingdom only the core around Samaria is left, a rump state on borrowed time. Over that lost Galilee Isaiah writes the same passage twice: first "Galilee of the nations", then "the people who walked in darkness have seen a great light" (Isa 9:1-2).',
    },
    fates: fates(
      {
        judah: 'south',
        benjamin: 'south',
        simeon: 'south',
        ephraim: 'left',
        manasseh: 'left',
      },
      'gone',
    ),
    exiles: [
      { from: [32.95, 35.95], to: [33.36, 36.48], de: 'nach Assyrien', en: 'to Assyria' },
    ],
  },
  {
    id: 'samaria',
    year: -722,
    de: 'Samaria fällt',
    en: 'Samaria falls',
    ref: '2Kön 17',
    chronicles: {
      ref: '2Chr 30,10-11',
      text: {
        de: 'Eine Nachricht, die nur die Chronik hat: Nach dem Fall Samarias schickt Hiskia Läufer nach Norden, „im Lande Ephraim und Manasse und bis gen Sebulon". Die meisten verlachen sie – „doch etliche von Asser und Manasse und Sebulon demütigten sich und kamen gen Jerusalem". Die Stämme sind als Gebiet verloren, als Menschen nicht.',
        en: 'A report only Chronicles has: after Samaria falls, Hezekiah sends runners north, "through the country of Ephraim and Manasseh, even unto Zebulun". Most laugh at them – "nevertheless some of Asher and Manasseh and of Zebulun humbled themselves and came to Jerusalem". The tribes are lost as territory, not as people.',
      },
    },
    text: {
      de: 'Nach drei Jahren Belagerung fällt die Hauptstadt. Israel wird nach Assyrien verschleppt, Fremde werden angesiedelt – aus dieser Mischung gehen die Samaritaner hervor, die im Neuen Testament noch immer die Nachbarn sind, mit denen man nichts zu tun hat. Die zehn Stämme des Nordens kehren nicht wieder.',
      en: 'After a three-year siege the capital falls. Israel is deported to Assyria and foreigners are settled in its place – out of that mixture come the Samaritans, still the neighbours one has nothing to do with in the New Testament. The ten northern tribes never return.',
    },
    fates: fates({ judah: 'south', benjamin: 'south', simeon: 'south' }, 'gone'),
    exiles: [
      { from: [32.32, 35.42], to: [33.2, 36.48], de: 'nach Assyrien', en: 'to Assyria' },
    ],
  },
  {
    id: 'judah',
    year: -586,
    de: 'Juda fällt – und kehrt zurück',
    en: 'Judah falls – and comes back',
    ref: '2Kön 25 · Esra 1',
    chronicles: {
      ref: '2Chr 36,20-21 · 1Chr 9,2-3',
      text: {
        de: 'Die Chronik endet, wo Esra anfängt – und ihr Register endet nicht mit den Stämmen, sondern mit einer Stadt: wer nach der Rückkehr in Jerusalem wohnte, „etliche der Kinder Juda, etliche der Kinder Benjamin, etliche der Kinder Ephraim und Manasse" (1Chr 9,3). Aus zwölf Gebieten sind vier Namen in einer Stadt geworden.',
        en: 'Chronicles ends where Ezra begins – and its register ends not with tribes but with a city: who settled in Jerusalem after the return, "of the children of Judah, of the children of Benjamin, and of the children of Ephraim and Manasseh" (1 Chr 9:3). Twelve territories have become four names in one town.',
      },
    },
    text: {
      de: 'Nebukadnezar nimmt Jerusalem, brennt den Tempel nieder und führt Juda nach Babylon. Doch dieser eine Strang reißt nicht ab: fünfzig Jahre später ziehen „die Häupter der Familien Judas und Benjamins und die Priester und Leviten" zurück (Esra 1,5). Von zwölf Stämmen kommt einer wieder – und gibt dem Volk den Namen, den es seither trägt.',
      en: 'Nebuchadnezzar takes Jerusalem, burns the temple and carries Judah off to Babylon. But this one strand does not break: fifty years later "the heads of the families of Judah and Benjamin, and the priests and Levites" go back up (Ezra 1:5). Of twelve tribes one returns – and gives the people the name it has carried ever since.',
    },
    fates: fates({ judah: 'returned', benjamin: 'returned' }, 'gone'),
    exiles: [
      { from: [31.72, 35.5], to: [32.3, 36.48], de: 'nach Babylon', en: 'to Babylon' },
    ],
    placesLabel: { de: 'Wohin sie zurückkamen', en: 'Where they came back to' },
    places: [{ de: 'Jerusalem', en: 'Jerusalem', lat: 31.78, lon: 35.23 }],
  },
];

export const PHASE_BY_ID = Object.fromEntries(PHASES.map((p) => [p.id, p])) as Record<string, Phase>;

/** „930 v. Chr." / „um 1200 v. Chr." */
export function phaseYear(p: Phase, lang: 'de' | 'en'): string {
  const n = Math.abs(p.year);
  if (lang === 'de') return `${p.about ? 'um ' : ''}${n} v. Chr.`;
  return `${p.about ? 'c. ' : ''}${n} BC`;
}

/** Kurzform für die Leiste – dort ist kein Platz für „v. Chr.". */
export function phaseYearShort(p: Phase): string {
  return `${p.about ? '~' : ''}${Math.abs(p.year)}`;
}
