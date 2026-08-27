// The twelve tribes of Israel and the land they were given (Josua 13–21).
//
// The territories are drawn as polygons that SHARE their border vertices, so
// neighbouring tribes tile the land instead of overlapping rectangles. They are
// still a deliberate simplification: the boundaries follow the coast, the
// Jordan and the Dead Sea where those are the border, and run straight between
// the towns Josua names where they are not. This is an atlas plate, not a
// survey — Josua's border lists are themselves a chain of place names, and
// several of those places are not securely located today.
//
// Coordinates are [lat, lon]. Colours are picked so no two touching territories
// share a hue; Ephraim and both halves of Manasse are variations of one purple,
// because they are one house (Josef).

import type { BiText } from './nationsTribes';

export type Mother = 'lea' | 'rahel' | 'bilha' | 'silpa';

export interface TribeCity {
  de: string;
  en: string;
  lat: number;
  lon: number;
  /** Marks the capital-ish / most-named town of the territory. */
  major?: boolean;
}

/**
 * Ein Mensch, den dieses Gebiet hervorgebracht hat. `node` steht nur dort, wo
 * der Zeitbaum die Person auch führt – die meisten Richter stehen in keiner
 * Geschlechterliste und bekommen darum keinen Sprung, sondern nur ihre Stelle.
 */
export interface TribePerson {
  de: string;
  en: string;
  role: BiText;
  ref: string;
  node?: string;
}

/**
 * Ein Eintrag der Chronik zu einem Stamm. `null` heißt hier nicht „noch nicht
 * eingetragen", sondern **die Chronik führt ihn nicht** – und das ist selbst
 * eine Aussage, die in der Oberfläche stehen bleiben soll, statt still zu
 * fehlen. Sebulon und Dan haben kein Register, Gad und Asser keinen Fürsten.
 */
export interface Chronicles {
  /** Das Geschlechterregister des Stammes in 1. Chronik – oder `null`. */
  register: string | null;
  /** Die Verse, die sagen, wo sie wohnten. Nicht jeder Stamm bekommt welche. */
  dwelling?: string;
  /** Der Fürst über den Stamm unter David, 1. Chronik 27,16-22 – oder `null`. */
  prince: { de: string; en: string; ref: string } | null;
  /** Ein Satz dazu, wo die Chronik etwas anderes sagt als Josua – oder schweigt. */
  note: BiText;
}

export interface Tribe {
  /** Node id in `nationsTribes.ts`, so the map can open the family tree. */
  id: string;
  de: string;
  en: string;
  color: string;
  mother: Mother;
  /** Birth order in Gen 29–30 / 35. Ephraim and Manasse inherit Josef's 11. */
  born: number;
  /** Sort key for the list, so Josef's two houses keep Jakob's own order. */
  rank: number;
  /** Set where the tribe descends from Jakob through a son rather than direct. */
  via?: BiText;
  /** Shorter name for the plate, where the panel can afford the long one. */
  mapLabel?: BiText;
  /**
   * Where the name sits on the plate. The area centroid lands inside every one
   * of these rings, but in the crowded middle two centroids can be 8 km apart —
   * so the cramped ones get an anchor by hand.
   */
  labelAt?: [number, number];
  /** Which side of the Jordan the allotment lies on. */
  side: 'west' | 'east';
  /** What the name means where Genesis explains it at the birth. */
  meaning: BiText;
  /** Josua's allotment passage. */
  lot: string;
  /**
   * Was die Chronik über dieses Gebiet führt – der zweite Zeuge neben Josua.
   *
   * Josua erzählt die Verteilung: wer welches Los zog, wo die Grenze lief. Die
   * Chronik erzählt sie nicht, sie **führt** sie – als Register, Jahrhunderte
   * später aufgeschrieben, aus der Sicht der Rückkehrer aus Babel. Zwei
   * verschiedene Arten von Text über dasselbe Land, und sie decken sich nicht
   * überall. Genau das ist der Grund, beide zu zeigen.
   *
   * Alle Stellen sind gegen den Text in `public/data/text/1Chr.json` und
   * `2Chr.json` gelesen, nicht aus dem Gedächtnis gesetzt; `check:tribes`
   * prüft sie bei jedem Lauf nach.
   */
  chronicles: Chronicles;
  /** Jakob's blessing (1. Mose 49) and Mose's blessing (5. Mose 33). */
  blessing: string;
  mosesBlessing?: string;
  /** One or two sentences on the land itself. */
  land: BiText;
  cities: TribeCity[];
  /** Wer von hier kam. Die Reihenfolge ist die der Bibel, nicht die des Rangs. */
  people?: TribePerson[];
  polygon?: [number, number][];
}

export const MOTHERS: { id: Mother; de: string; en: string; note: BiText }[] = [
  {
    id: 'lea',
    de: 'Lea',
    en: 'Leah',
    note: {
      de: 'Die ungeliebte erste Frau – und doch die Mutter der Hälfte der Stämme, des Priesterstamms Levi und der Königslinie Juda.',
      en: 'The unloved first wife – yet mother of half the tribes, of the priestly tribe Levi and of the royal line Judah.',
    },
  },
  {
    id: 'rahel',
    de: 'Rahel',
    en: 'Rachel',
    note: {
      de: 'Die geliebte Frau, lange kinderlos. Ihr Sohn Josef wird in seinen beiden Söhnen zu zwei Stämmen.',
      en: 'The beloved wife, childless for years. Her son Joseph becomes two tribes through his two sons.',
    },
  },
  {
    id: 'bilha',
    de: 'Bilha',
    en: 'Bilhah',
    note: { de: 'Rahels Magd.', en: "Rachel's maidservant." },
  },
  {
    id: 'silpa',
    de: 'Silpa',
    en: 'Zilpah',
    note: { de: 'Leas Magd.', en: "Leah's maidservant." },
  },
];

export const MOTHER_BY_ID = Object.fromEntries(MOTHERS.map((m) => [m.id, m])) as Record<
  Mother,
  (typeof MOTHERS)[number]
>;

export const TRIBES: Tribe[] = [
  // ---- West of the Jordan, north → south ----------------------------------
  {
    id: 'asher',
    people: [
      {
        de: 'Hanna',
        en: 'Anna',
        role: { de: 'Prophetin im Tempel', en: 'Prophetess in the temple' },
        ref: 'Lk 2,36',
      },
    ],
    rank: 8,
    labelAt: [33.23, 35.09],
    de: 'Asser',
    en: 'Asher',
    color: '#3aa8b8',
    mother: 'silpa',
    born: 8,
    side: 'west',
    meaning: { de: '„Glücklich bin ich"', en: '"Happy am I"' },
    lot: 'Jos 19,24-31',
    chronicles: {
      register: '1Chr 7,30-40',
      prince: null,
      note: {
        de: 'Ein Register hat Asser – aber unter Davids Fürsten fehlt er, zusammen mit Gad. Die Chronik zählt dort nur zwölf Namen und nennt Levi und Aaron getrennt.',
        en: 'Asher has a register – but he is missing from David’s princes, together with Gad. The list there counts only twelve names and gives Levi and Aaron separately.',
      },
    },
    blessing: '1Mo 49,20',
    mosesBlessing: '5Mo 33,24-25',
    land: {
      de: 'Der Küstenstreifen von der Karmel-Nase bis hinauf nach Tyrus: Olivenhänge über der Bucht von Akko. Asser vertrieb die Kanaaniter der Hafenstädte nie ganz (Ri 1,31) und blieb ein Nachbar der Phönizier – daher „sein Brot ist fett" (1Mo 49,20).',
      en: 'The coastal strip from the Carmel headland up to Tyre: olive slopes above the bay of Akko. Asher never fully drove out the Canaanites of the harbour towns (Judg 1:31) and stayed a neighbour of the Phoenicians – hence "his food shall be rich" (Gen 49:20).',
    },
    cities: [
      { de: 'Akko', en: 'Acco', lat: 32.92, lon: 35.08, major: true },
      { de: 'Achsib', en: 'Achzib', lat: 33.05, lon: 35.1 },
      { de: 'Kabul', en: 'Cabul', lat: 32.87, lon: 35.22 },
    ],
    polygon: [
      [32.82, 34.98],
      [32.9, 35.14],
      [32.95, 35.2],
      [33.05, 35.27],
      [33.17, 35.32],
      [33.22, 35.31],
      [33.2, 35.12],
      [33.09, 35.11],
      [32.92, 35.06],
    ],
  },
  {
    id: 'naphtali',
    people: [
      {
        de: 'Barak',
        en: 'Barak',
        role: { de: 'Feldherr an Deboras Seite', en: 'Commander at Deborah\'s side' },
        ref: 'Ri 4,6',
      },
      {
        de: 'Hiram',
        en: 'Huram',
        role: { de: 'Erzgießer für den Tempel', en: 'Bronzeworker for the temple' },
        ref: '1Kön 7,14',
      },
    ],
    rank: 6,
    labelAt: [33.03, 35.54],
    de: 'Naftali',
    en: 'Naphtali',
    color: '#c4577f',
    mother: 'bilha',
    born: 6,
    side: 'west',
    meaning: { de: '„Ich habe gerungen"', en: '"I have wrestled"' },
    lot: 'Jos 19,32-39',
    chronicles: {
      register: '1Chr 7,13',
      prince: { de: 'Jeremoth', en: 'Jeremoth', ref: '1Chr 27,19' },
      note: {
        de: 'Ein einziger Vers – vier Namen, kein Gebiet. Die Chronik gibt Naftali weniger Raum als jedem anderen Stamm im Norden.',
        en: 'A single verse – four names, no territory. The Chronicler gives Naphtali less room than any other northern tribe.',
      },
    },
    blessing: '1Mo 49,21',
    mosesBlessing: '5Mo 33,23',
    land: {
      de: 'Das obere Galiläa zwischen dem Hulesee und dem See Genezareth, hinauf bis an den Fuß des Hermon. Fruchtbares Bergland mit dem alten Königssitz Hazor – und tausend Jahre später die Gegend, in der Jesus lehrt (Mt 4,13-16).',
      en: 'Upper Galilee between Lake Huleh and the Sea of Galilee, up to the foot of Mount Hermon. Fertile highland with the old royal seat of Hazor – and a thousand years later the region where Jesus teaches (Matt 4:13-16).',
    },
    cities: [
      { de: 'Hazor', en: 'Hazor', lat: 33.02, lon: 35.57, major: true },
      { de: 'Kedesch', en: 'Kedesh', lat: 33.11, lon: 35.53 },
      { de: 'Kinneret', en: 'Chinnereth', lat: 32.87, lon: 35.55 },
    ],
    polygon: [
      [32.78, 35.48],
      [32.82, 35.42],
      [32.9, 35.33],
      [32.95, 35.2],
      [33.05, 35.27],
      [33.17, 35.32],
      [33.22, 35.31],
      [33.35, 35.64],
      [33.18, 35.72],
      [32.9, 35.6],
      [32.82, 35.54],
    ],
  },
  {
    id: 'zebulun',
    people: [
      {
        de: 'Elon',
        en: 'Elon',
        role: { de: 'Richter', en: 'Judge' },
        ref: 'Ri 12,11',
      },
      {
        de: 'Jona',
        en: 'Jonah',
        role: { de: 'Prophet aus Gat-Hefer', en: 'Prophet from Gath-hepher' },
        ref: '2Kön 14,25',
      },
    ],
    rank: 10,
    labelAt: [32.78, 35.19],
    de: 'Sebulon',
    en: 'Zebulun',
    color: '#4d7fd4',
    mother: 'lea',
    born: 10,
    side: 'west',
    meaning: { de: '„Wohnung"', en: '"Dwelling"' },
    lot: 'Jos 19,10-16',
    chronicles: {
      register: null,
      prince: { de: 'Jismaja', en: 'Ishmaiah', ref: '1Chr 27,19' },
      note: {
        de: 'Die Chronik führt Sebulon in keinem Register. Er steht in der Namensliste (1Chr 2,1), gibt Levitenstädte ab (1Chr 6,62), zieht mit David (1Chr 12,33) und hat einen Fürsten – ein Gebiet bekommt er nicht.',
        en: 'The Chronicler keeps no register for Zebulun. He appears in the name list (1 Chr 2:1), gives up Levitical towns (6:62), marches with David (12:33) and has a prince – but no territory.',
      },
    },
    blessing: '1Mo 49,13',
    mosesBlessing: '5Mo 33,18-19',
    land: {
      de: 'Das untere Galiläa zwischen der Bucht von Akko und dem Tabor. Jakobs Segen sieht Sebulon „am Gestade des Meeres" wohnen – das Los reicht ans Meer nur an der Karmel-Nase, aber die Straße von der Küste ins Landesinnere läuft mitten hindurch. Hier liegt Nazaret.',
      en: 'Lower Galilee between the bay of Akko and Mount Tabor. Jacob\'s blessing sees Zebulun dwelling "at the haven of the sea" – the lot touches the sea only at the Carmel headland, but the road from the coast inland runs straight through it. Nazareth lies here.',
    },
    cities: [
      { de: 'Nazaret', en: 'Nazareth', lat: 32.7, lon: 35.3, major: true },
      { de: 'Gat-Hefer', en: 'Gath-hepher', lat: 32.74, lon: 35.33 },
      { de: 'Bethlehem in Sebulon', en: 'Bethlehem of Zebulun', lat: 32.73, lon: 35.19 },
    ],
    polygon: [
      [32.82, 34.98],
      [32.9, 35.14],
      [32.95, 35.2],
      [32.9, 35.33],
      [32.82, 35.42],
      [32.7, 35.4],
      [32.62, 35.28],
      [32.66, 35.16],
    ],
  },
  {
    id: 'issachar',
    people: [
      {
        de: 'Tola',
        en: 'Tola',
        role: { de: 'Richter', en: 'Judge' },
        ref: 'Ri 10,1',
      },
      {
        de: 'Die Söhne Issachars',
        en: 'The sons of Issachar',
        role: { de: '„die Einsicht hatten für die Zeiten“', en: '“who had understanding of the times”' },
        ref: '1Chr 12,33',
      },
      {
        de: 'Baesa',
        en: 'Baasha',
        role: { de: 'König des Nordreichs', en: 'King of the northern kingdom' },
        ref: '1Kön 15,27',
      },
    ],
    rank: 9,
    labelAt: [32.5, 35.45],
    de: 'Issachar',
    en: 'Issachar',
    color: '#2f9f86',
    mother: 'lea',
    born: 9,
    side: 'west',
    meaning: { de: '„Lohn"', en: '"Reward"' },
    lot: 'Jos 19,17-23',
    chronicles: {
      register: '1Chr 7,1-5',
      prince: { de: 'Omri', en: 'Omri', ref: '1Chr 27,18' },
      note: {
        de: 'Ein Wehrverzeichnis statt einer Landbeschreibung: die Chronik zählt Isaschars streitbare Männer, nicht seine Grenzen.',
        en: 'A muster roll rather than a description of land: the Chronicler counts Issachar’s fighting men, not his borders.',
      },
    },
    blessing: '1Mo 49,14-15',
    mosesBlessing: '5Mo 33,18-19',
    land: {
      de: 'Die Jesreel-Ebene – der Kornboden des Landes und zugleich sein Schlachtfeld: Debora und Barak, Gideon, Saul auf dem Gilboa, Josia bei Megiddo. „Er sah die Ruhe, dass sie gut ist, und das Land, dass es lieblich ist" (1Mo 49,15).',
      en: 'The Jezreel valley – the granary of the land and at the same time its battlefield: Deborah and Barak, Gideon, Saul on Gilboa, Josiah at Megiddo. "He saw that rest was good and the land pleasant" (Gen 49:15).',
    },
    cities: [
      { de: 'Jesreel', en: 'Jezreel', lat: 32.56, lon: 35.33, major: true },
      { de: 'Bet-Schean', en: 'Beth-shean', lat: 32.5, lon: 35.5 },
      { de: 'Berg Tabor', en: 'Mount Tabor', lat: 32.69, lon: 35.39 },
    ],
    polygon: [
      [32.66, 35.16],
      [32.62, 35.28],
      [32.7, 35.4],
      [32.82, 35.42],
      [32.78, 35.48],
      [32.72, 35.55],
      [32.55, 35.57],
      [32.44, 35.53],
      [32.4, 35.35],
      [32.5, 35.3],
      [32.6, 35.24],
    ],
  },
  {
    id: 'manasseh',
    people: [
      {
        de: 'Gideon',
        en: 'Gideon',
        role: { de: 'Richter', en: 'Judge' },
        ref: 'Ri 6,15',
      },
      {
        de: 'Zelofhads Töchter',
        en: 'The daughters of Zelophehad',
        role: { de: 'Erbrecht für Töchter erstritten', en: 'Won the right of daughters to inherit' },
        ref: '4Mo 27,1',
      },
      {
        de: 'Abimelech',
        en: 'Abimelech',
        role: { de: '„König“ von Sichem', en: '“King” of Shechem' },
        ref: 'Ri 9,1',
      },
    ],
    via: { de: 'Josef', en: 'Joseph' },
    mapLabel: { de: 'Manasse', en: 'Manasseh' },
    rank: 11.2,
    labelAt: [32.34, 35.1],
    de: 'Manasse (West)',
    en: 'Manasseh (west)',
    color: '#9a4ba0',
    mother: 'rahel',
    born: 11,
    side: 'west',
    meaning: { de: '„Gott ließ mich vergessen"', en: '"God has made me forget"' },
    lot: 'Jos 17,7-13',
    chronicles: {
      register: '1Chr 7,14-19',
      dwelling: '1Chr 7,29',
      prince: { de: 'Joel', en: 'Joel', ref: '1Chr 27,20' },
      note: {
        de: 'Die Wohnorte stehen nicht bei Manasse, sondern im Abschnitt Ephraims: Bet-Schean, Taanach, Megiddo und Dor „an der Seite der Kinder Manasse“ (1Chr 7,29). Josua zählt dieselben Städte – und sagt dazu, dass Manasse sie nicht einnehmen konnte.',
        en: 'The dwellings stand not under Manasseh but inside Ephraim’s section: Beth-shean, Taanach, Megiddo and Dor "beside the children of Manasseh" (1 Chr 7:29). Joshua names the same towns – and adds that Manasseh could not take them.',
      },
    },
    blessing: '1Mo 49,22-26',
    mosesBlessing: '5Mo 33,13-17',
    land: {
      de: 'Josefs älterer Sohn bekommt die breite Mitte: die Scharon-Ebene an der Küste, das Bergland um Sichem und den Zugang zur Jesreel-Ebene. Die eisenbewehrten Städte der Ebene – Megiddo, Taanach, Dor, Bet-Schean – behielten lange ihre alten Herren (Jos 17,12).',
      en: "Joseph's elder son receives the broad middle: the Sharon plain on the coast, the hill country around Shechem and the approach to the Jezreel valley. The iron-charioted cities of the plain – Megiddo, Taanach, Dor, Beth-shean – kept their old masters for a long time (Josh 17:12).",
    },
    cities: [
      { de: 'Sichem', en: 'Shechem', lat: 32.21, lon: 35.28, major: true },
      { de: 'Megiddo', en: 'Megiddo', lat: 32.58, lon: 35.18 },
      { de: 'Dor', en: 'Dor', lat: 32.62, lon: 34.92 },
      { de: 'Taanach', en: 'Taanach', lat: 32.52, lon: 35.22 },
    ],
    polygon: [
      [32.82, 34.98],
      [32.66, 35.16],
      [32.6, 35.24],
      [32.5, 35.3],
      [32.4, 35.35],
      [32.44, 35.53],
      [32.32, 35.55],
      [32.2, 35.55],
      [32.16, 35.4],
      [32.14, 35.18],
      [32.18, 34.98],
      [32.24, 34.86],
      [32.5, 34.89],
      [32.69, 34.94],
    ],
  },
  {
    id: 'ephraim',
    people: [
      {
        de: 'Josua',
        en: 'Joshua',
        role: { de: 'Nachfolger des Mose', en: 'Successor of Moses' },
        ref: '4Mo 13,8',
        node: 'josua',
      },
      {
        de: 'Debora',
        en: 'Deborah',
        role: { de: 'Richtete im Gebirge Ephraim', en: 'Judged in the hill country of Ephraim' },
        ref: 'Ri 4,5',
      },
      {
        de: 'Jerobeam I.',
        en: 'Jeroboam I',
        role: { de: 'Erster König des Nordreichs', en: 'First king of the northern kingdom' },
        ref: '1Kön 11,26',
      },
    ],
    via: { de: 'Josef', en: 'Joseph' },
    rank: 11.1,
    labelAt: [32.05, 35.3],
    de: 'Ephraim',
    en: 'Ephraim',
    color: '#7a5aa8',
    mother: 'rahel',
    born: 11,
    side: 'west',
    meaning: { de: '„Fruchtbar im Land meines Elends"', en: '"Fruitful in the land of my affliction"' },
    lot: 'Jos 16',
    chronicles: {
      register: '1Chr 7,20-29',
      dwelling: '1Chr 7,28-29',
      prince: { de: 'Hosea', en: 'Hoshea', ref: '1Chr 27,20' },
      note: {
        de: 'Der einzige Nordstamm, dem die Chronik eine Wohnliste gibt: Bet-El, Naaran, Geser, Sichem und Aja mit ihren Ortschaften.',
        en: 'The only northern tribe the Chronicler gives a list of dwellings: Bethel, Naaran, Gezer, Shechem and Ayyah with their villages.',
      },
    },
    blessing: '1Mo 49,22-26',
    mosesBlessing: '5Mo 33,13-17',
    land: {
      de: 'Das Bergland zwischen Bet-El und Sichem – klein, aber die Mitte des Landes. In Silo steht 300 Jahre lang die Stiftshütte, Josua stammt von hier, und später heißt das ganze Nordreich schlicht „Ephraim".',
      en: 'The hill country between Bethel and Shechem – small, but the middle of the land. The tabernacle stands at Shiloh for three centuries, Joshua comes from here, and later the whole northern kingdom is simply called "Ephraim".',
    },
    cities: [
      { de: 'Silo', en: 'Shiloh', lat: 32.06, lon: 35.29, major: true },
      { de: 'Timnat-Serach', en: 'Timnath-serah', lat: 32.1, lon: 35.17 },
      { de: 'Bet-Horon', en: 'Beth-horon', lat: 31.89, lon: 35.11 },
    ],
    polygon: [
      [32.18, 34.98],
      [32.14, 35.18],
      [32.16, 35.4],
      [32.2, 35.55],
      [31.99, 35.55],
      [31.95, 35.42],
      [31.93, 35.2],
      [31.9, 35.04],
      [32.0, 35.0],
    ],
  },
  {
    id: 'dan',
    people: [
      {
        de: 'Simson',
        en: 'Samson',
        role: { de: 'Richter', en: 'Judge' },
        ref: 'Ri 13,2',
      },
      {
        de: 'Oholiab',
        en: 'Oholiab',
        role: { de: 'Kunsthandwerker der Stiftshütte', en: 'Craftsman of the tabernacle' },
        ref: '2Mo 31,6',
      },
    ],
    rank: 5,
    labelAt: [31.95, 34.82],
    de: 'Dan',
    en: 'Dan',
    color: '#5a5ca8',
    mother: 'bilha',
    born: 5,
    side: 'west',
    meaning: { de: '„Er hat Recht geschafft"', en: '"He has judged"' },
    lot: 'Jos 19,40-48',
    chronicles: {
      register: null,
      prince: { de: 'Asareel', en: 'Azarel', ref: '1Chr 27,22' },
      note: {
        de: 'Wie Sebulon ohne Register. Dan steht in der Namensliste (1Chr 2,2), gibt Levitenstädte ab (1Chr 6,46) und hat einen Fürsten – seine Wanderung nach Norden, die Josua und Richter erzählen, erwähnt die Chronik nicht.',
        en: 'Like Zebulun, without a register. Dan appears in the name list (1 Chr 2:2), gives up Levitical towns (6:46) and has a prince – the migration north that Joshua and Judges tell is absent from Chronicles.',
      },
    },
    blessing: '1Mo 49,16-18',
    mosesBlessing: '5Mo 33,22',
    land: {
      de: 'Das kleinste Los: die Küstenebene um Jafo und die Schefela gegen die Philister – Simsons Gegend. Der Druck von Westen war zu groß, und ein Teil des Stammes zog an das andere Ende des Landes und nahm Laisch ein, das seither Dan heißt (Ri 18).',
      en: 'The smallest lot: the coastal plain around Joppa and the Shephelah facing the Philistines – Samson\'s country. The pressure from the west was too great, and part of the tribe moved to the other end of the land and took Laish, called Dan ever since (Judg 18).',
    },
    cities: [
      { de: 'Jafo', en: 'Joppa', lat: 32.05, lon: 34.75, major: true },
      { de: 'Zora', en: 'Zorah', lat: 31.77, lon: 34.99 },
      { de: 'Ekron', en: 'Ekron', lat: 31.78, lon: 34.85 },
      { de: 'Ajalon', en: 'Aijalon', lat: 31.85, lon: 35.02 },
    ],
    polygon: [
      [32.24, 34.86],
      [32.18, 34.98],
      [32.0, 35.0],
      [31.9, 35.04],
      [31.8, 35.02],
      [31.74, 34.92],
      [31.72, 34.78],
      [31.74, 34.66],
      [32.07, 34.73],
    ],
  },
  {
    id: 'benjamin',
    people: [
      {
        de: 'Ehud',
        en: 'Ehud',
        role: { de: 'Richter', en: 'Judge' },
        ref: 'Ri 3,15',
      },
      {
        de: 'Saul',
        en: 'Saul',
        role: { de: 'Erster König Israels', en: 'First king of Israel' },
        ref: '1Sam 9,1',
        node: 'saul',
      },
      {
        de: 'Jonatan',
        en: 'Jonathan',
        role: { de: 'Davids Freund', en: 'David\'s friend' },
        ref: '1Sam 14,1',
        node: 'jonatan',
      },
      {
        de: 'Mordechai und Ester',
        en: 'Mordecai and Esther',
        role: { de: 'Am Hof in Susa', en: 'At the court in Susa' },
        ref: 'Est 2,5',
      },
      {
        de: 'Paulus',
        en: 'Paul',
        role: { de: 'Apostel – „aus dem Stamm Benjamin“', en: 'Apostle – “of the tribe of Benjamin”' },
        ref: 'Röm 11,1',
        node: 'paulus',
      },
    ],
    rank: 12,
    labelAt: [31.88, 35.36],
    de: 'Benjamin',
    en: 'Benjamin',
    color: '#d4644a',
    mother: 'rahel',
    born: 12,
    side: 'west',
    meaning: { de: '„Sohn der rechten Hand"', en: '"Son of the right hand"' },
    lot: 'Jos 18,11-28',
    chronicles: {
      register: '1Chr 7,6-12',
      dwelling: '1Chr 8,1-40',
      prince: { de: 'Jaesiel', en: 'Jaasiel', ref: '1Chr 27,21' },
      note: {
        de: 'Zweimal geführt: kurz in 1Chr 7,6-12 und noch einmal ausführlich in Kapitel 8, mit Sauls Haus und den Orten Geba, Ono, Lod und Ajalon. Nach der Reichsteilung bleibt Benjamin bei Juda (2Chr 11,12).',
        en: 'Registered twice: briefly in 1 Chr 7:6-12 and again at length in chapter 8, with Saul’s house and the towns Geba, Ono, Lod and Aijalon. After the kingdom splits, Benjamin stays with Judah (2 Chr 11:12).',
      },
    },
    blessing: '1Mo 49,27',
    mosesBlessing: '5Mo 33,12',
    land: {
      de: 'Ein schmaler Riegel quer durchs Land, von Jericho bis an die Schefela – und ausgerechnet auf ihm liegen Jerusalem, Bet-El, Gibeon und Mizpa. Wer den Norden mit dem Süden verbinden will, muss durch Benjamin. Saul kam von hier, Paulus nannte sich noch im Neuen Testament einen Benjaminiten (Röm 11,1).',
      en: 'A narrow bar across the land, from Jericho to the Shephelah – and Jerusalem, Bethel, Gibeon and Mizpah all sit on it. Anyone joining north to south has to pass through Benjamin. Saul came from here, and Paul still called himself a Benjaminite (Rom 11:1).',
    },
    cities: [
      { de: 'Jerusalem', en: 'Jerusalem', lat: 31.78, lon: 35.23, major: true },
      { de: 'Jericho', en: 'Jericho', lat: 31.87, lon: 35.44 },
      { de: 'Bet-El', en: 'Bethel', lat: 31.93, lon: 35.22 },
      { de: 'Gibeon', en: 'Gibeon', lat: 31.85, lon: 35.18 },
    ],
    polygon: [
      [31.9, 35.04],
      [31.93, 35.2],
      [31.95, 35.42],
      [31.99, 35.55],
      [31.83, 35.53],
      [31.8, 35.45],
      [31.76, 35.3],
      [31.77, 35.15],
      [31.8, 35.02],
    ],
  },
  {
    id: 'judah',
    people: [
      {
        de: 'Kaleb',
        en: 'Caleb',
        role: { de: 'Kundschafter, der blieb', en: 'The spy who held out' },
        ref: '4Mo 13,6',
      },
      {
        de: 'Otniel',
        en: 'Othniel',
        role: { de: 'Der erste Richter', en: 'The first judge' },
        ref: 'Ri 3,9',
      },
      {
        de: 'Boas',
        en: 'Boaz',
        role: { de: 'Löser in Bethlehem', en: 'Kinsman-redeemer in Bethlehem' },
        ref: 'Rut 2,1',
        node: 'boas',
      },
      {
        de: 'David',
        en: 'David',
        role: { de: 'König', en: 'King' },
        ref: '1Sam 16,1',
        node: 'david',
      },
      {
        de: 'Salomo',
        en: 'Solomon',
        role: { de: 'König', en: 'King' },
        ref: '1Kön 1,39',
        node: 'salomo',
      },
      {
        de: 'Jesus',
        en: 'Jesus',
        role: { de: '„Aus Juda ist unser Herr gekommen“', en: '“Our Lord descended from Judah”' },
        ref: 'Hebr 7,14',
        node: 'jesus',
      },
    ],
    rank: 4,
    labelAt: [31.48, 35.02],
    de: 'Juda',
    en: 'Judah',
    color: '#6f9e3c',
    mother: 'lea',
    born: 4,
    side: 'west',
    meaning: { de: '„Ich will den HERRN preisen"', en: '"I will praise the LORD"' },
    lot: 'Jos 15',
    chronicles: {
      register: '1Chr 2,3-4,23',
      dwelling: '1Chr 4,1-23',
      prince: { de: 'Elihu', en: 'Elihu', ref: '1Chr 27,18' },
      note: {
        de: 'Das größte Register der Chronik – anderthalb Kapitel, ehe irgendein anderer Stamm drankommt, und darin Davids Linie. Rehabeam befestigt später die Städte in Juda und Benjamin (2Chr 11,5-12).',
        en: 'The Chronicler’s largest register – a chapter and a half before any other tribe, and David’s line inside it. Rehoboam later fortifies the towns of Judah and Benjamin (2 Chr 11:5-12).',
      },
    },
    blessing: '1Mo 49,8-12',
    mosesBlessing: '5Mo 33,7',
    land: {
      de: 'Das größte Los im Westen: Bergland um Hebron, die Schefela, die Wüste am Toten Meer und der Negev. Aus Juda kommt David, aus Bethlehem der Messias – „das Zepter wird nicht von Juda weichen" (1Mo 49,10). Nach der Reichsteilung bleibt der Name Juda für das ganze Südreich.',
      en: 'The largest lot in the west: the hill country around Hebron, the Shephelah, the wilderness by the Dead Sea and the Negev. David comes from Judah, the Messiah from Bethlehem – "the sceptre shall not depart from Judah" (Gen 49:10). After the split, the name Judah stands for the whole southern kingdom.',
    },
    cities: [
      { de: 'Hebron', en: 'Hebron', lat: 31.53, lon: 35.1, major: true },
      { de: 'Bethlehem', en: 'Bethlehem', lat: 31.7, lon: 35.2 },
      { de: 'Lachisch', en: 'Lachish', lat: 31.56, lon: 34.85 },
      { de: 'En-Gedi', en: 'En-gedi', lat: 31.46, lon: 35.39 },
    ],
    polygon: [
      [31.8, 35.02],
      [31.77, 35.15],
      [31.76, 35.3],
      [31.8, 35.45],
      [31.83, 35.53],
      [31.6, 35.45],
      [31.42, 35.4],
      [31.28, 35.36],
      [31.2, 35.12],
      [31.3, 34.92],
      [31.44, 34.76],
      [31.56, 34.6],
      [31.7, 34.6],
      [31.74, 34.66],
      [31.72, 34.78],
      [31.74, 34.92],
    ],
  },
  {
    id: 'simeon',
    people: [
      {
        de: 'Simri',
        en: 'Zimri',
        role: { de: 'Erschlagen bei Baal-Peor', en: 'Struck down at Baal-peor' },
        ref: '4Mo 25,14',
      },
    ],
    rank: 2,
    labelAt: [31.16, 34.6],
    de: 'Simeon',
    en: 'Simeon',
    color: '#d9952f',
    mother: 'lea',
    born: 2,
    side: 'west',
    meaning: { de: '„Der HERR hat gehört"', en: '"The LORD has heard"' },
    lot: 'Jos 19,1-9',
    chronicles: {
      register: '1Chr 4,24-43',
      dwelling: '1Chr 4,28-33',
      prince: { de: 'Sephatja', en: 'Shephatiah', ref: '1Chr 27,16' },
      note: {
        de: 'Beer-Scheba, Ziklag, Horma – und der Satz, sie hätten „ihr eigenes Geschlechtsregister" (1Chr 4,33). Dass dieses Gebiet in Judas Los liegt, sagt Josua 19,1, nicht die Chronik. Sie erzählt stattdessen zwei Auszüge unter Hiskia: nach Gedor und ins Gebirge Seir (1Chr 4,39-43).',
        en: 'Beersheba, Ziklag, Hormah – and the remark that they had "their own genealogy" (1 Chr 4:33). That this land lies inside Judah’s lot is said by Joshua 19:1, not by the Chronicler. He tells instead of two departures under Hezekiah: to Gedor and to Mount Seir (1 Chr 4:39-43).',
      },
    },
    blessing: '1Mo 49,5-7',
    land: {
      de: 'Kein eigenes Gebiet, sondern „mitten im Erbteil Judas" (Jos 19,1): der Negev um Beerscheba mit seinen Brunnen. Jakobs Wort über Simeon und Levi ist kein Segen, sondern ein Urteil – „ich will sie zerteilen in Jakob" –, und genau so kommt es: Simeon geht in Juda auf, Levi wird über das ganze Land verteilt.',
      en: 'No territory of its own but land "within the inheritance of Judah" (Josh 19:1): the Negev around Beersheba with its wells. Jacob\'s word over Simeon and Levi is not a blessing but a verdict – "I will divide them in Jacob" – and that is exactly what happens: Simeon is absorbed into Judah, Levi scattered across the land.',
    },
    cities: [
      { de: 'Beerscheba', en: 'Beersheba', lat: 31.25, lon: 34.79, major: true },
      { de: 'Ziklag', en: 'Ziklag', lat: 31.33, lon: 34.63 },
      { de: 'Horma', en: 'Hormah', lat: 31.23, lon: 34.95 },
    ],
    polygon: [
      [31.44, 34.76],
      [31.3, 34.92],
      [31.2, 35.12],
      [31.06, 34.92],
      [31.0, 34.66],
      [31.06, 34.42],
      [31.28, 34.26],
      [31.52, 34.45],
      [31.56, 34.6],
    ],
  },

  // ---- East of the Jordan, south → north ----------------------------------
  {
    id: 'reuben',
    people: [
      {
        de: 'Datan und Abiram',
        en: 'Dathan and Abiram',
        role: { de: 'Aufstand gegen Mose', en: 'Rebellion against Moses' },
        ref: '4Mo 16,1',
      },
    ],
    rank: 1,
    labelAt: [31.64, 35.86],
    de: 'Ruben',
    en: 'Reuben',
    color: '#c07a3a',
    mother: 'lea',
    born: 1,
    side: 'east',
    meaning: { de: '„Seht, ein Sohn"', en: '"See, a son"' },
    lot: 'Jos 13,15-23',
    chronicles: {
      register: '1Chr 5,1-10',
      dwelling: '1Chr 5,8-10',
      prince: { de: 'Elieser', en: 'Eliezer', ref: '1Chr 27,16' },
      note: {
        de: 'Aroer, Nebo und Baal-Meon, ostwärts bis an die Wüste am Euphrat. Die Chronik erklärt hier auch, warum Ruben trotz Erstgeburt nicht das Erstgeburtsrecht hat (1Chr 5,1-2).',
        en: 'Aroer, Nebo and Baal-meon, eastward to the desert at the Euphrates. Here the Chronicler also explains why Reuben, though firstborn, does not hold the birthright (1 Chr 5:1-2).',
      },
    },
    blessing: '1Mo 49,3-4',
    mosesBlessing: '5Mo 33,6',
    land: {
      de: 'Die Hochebene von Medeba östlich des Toten Meeres, bis hinunter an den Arnon – gutes Weideland, das Ruben und Gad sich schon vor dem Jordanübergang erbaten (4Mo 32). Der Erstgeborene verliert sein Erstgeburtsrecht („unbeständig wie Wasser", 1Mo 49,4), und der Stamm bleibt am Rand der Geschichte.',
      en: 'The Medeba plateau east of the Dead Sea down to the Arnon – good pasture, which Reuben and Gad asked for before ever crossing the Jordan (Num 32). The firstborn forfeits his birthright ("unstable as water", Gen 49:4), and the tribe stays at the edge of the story.',
    },
    cities: [
      { de: 'Heschbon', en: 'Heshbon', lat: 31.8, lon: 35.81, major: true },
      { de: 'Medeba', en: 'Medeba', lat: 31.72, lon: 35.8 },
      { de: 'Bezer', en: 'Bezer', lat: 31.75, lon: 35.88 },
    ],
    polygon: [
      [31.86, 35.57],
      [31.86, 35.8],
      [31.88, 36.05],
      [31.55, 36.02],
      [31.46, 35.78],
      [31.46, 35.62],
      [31.6, 35.6],
      [31.74, 35.58],
    ],
  },
  {
    id: 'gad',
    people: [
      {
        de: 'Jeftah',
        en: 'Jephthah',
        role: { de: 'Richter', en: 'Judge' },
        ref: 'Ri 11,1',
      },
      {
        de: 'Elia',
        en: 'Elijah',
        role: { de: 'Prophet aus Tischbe in Gilead', en: 'Prophet from Tishbe in Gilead' },
        ref: '1Kön 17,1',
      },
      {
        de: 'Barsillai',
        en: 'Barzillai',
        role: { de: 'Versorgte David auf der Flucht', en: 'Sustained David in his flight' },
        ref: '2Sam 17,27',
      },
    ],
    rank: 7,
    labelAt: [32.26, 35.92],
    de: 'Gad',
    en: 'Gad',
    color: '#a85c2e',
    mother: 'silpa',
    born: 7,
    side: 'east',
    meaning: { de: '„Ein Glücksfall"', en: '"Good fortune"' },
    lot: 'Jos 13,24-28',
    chronicles: {
      register: '1Chr 5,11-17',
      dwelling: '1Chr 5,11-16',
      prince: null,
      note: {
        de: 'Im Land Basan bis gen Salcha, in Gilead und „in allen Fluren Sarons“. Einen Fürsten unter David bekommt Gad nicht – wie Asser fehlt er in 1Chr 27,16-22.',
        en: 'In Bashan as far as Salecah, in Gilead and "in all the pasturelands of Sharon". Gad gets no prince under David – like Asher he is missing from 1 Chr 27:16-22.',
      },
    },
    blessing: '1Mo 49,19',
    mosesBlessing: '5Mo 33,20-21',
    land: {
      de: 'Gilead: bewaldetes Bergland östlich des Jordans, dazu der Talgrund bis hinauf an den See Genezareth. Grenzland – „Kriegsvolk drängt ihn, er aber drängt ihnen nach auf der Ferse" (1Mo 49,19). Hier salbt man Jehu, hier fällt Ramot in Gilead im Streit mit Aram.',
      en: 'Gilead: wooded highland east of the Jordan, plus the valley floor up to the Sea of Galilee. Border country – "raiders shall raid him, but he shall raid at their heels" (Gen 49:19). Jehu is anointed here; Ramoth-Gilead is fought over with Aram.',
    },
    cities: [
      { de: 'Ramot in Gilead', en: 'Ramoth-gilead', lat: 32.56, lon: 36.0, major: true },
      { de: 'Mahanajim', en: 'Mahanaim', lat: 32.28, lon: 35.68 },
      { de: 'Sukkot', en: 'Succoth', lat: 32.19, lon: 35.58 },
      { de: 'Jaser', en: 'Jazer', lat: 32.02, lon: 35.75 },
    ],
    polygon: [
      [31.86, 35.57],
      [31.86, 35.8],
      [31.88, 36.05],
      [32.1, 36.15],
      [32.35, 36.12],
      [32.58, 36.05],
      [32.66, 35.75],
      [32.7, 35.64],
      [32.55, 35.62],
      [32.35, 35.6],
      [32.15, 35.61],
      [31.99, 35.59],
    ],
  },
  {
    id: 'm-east',
    people: [
      {
        de: 'Jaïr',
        en: 'Jair',
        role: { de: 'Richter', en: 'Judge' },
        ref: 'Ri 10,3',
      },
    ],
    via: { de: 'Josef', en: 'Joseph' },
    mapLabel: { de: 'Manasse (Ost)', en: 'Manasseh (east)' },
    rank: 11.3,
    labelAt: [32.95, 36.1],
    de: 'Manasse (Ost)',
    en: 'Manasseh (east)',
    color: '#8a4b90',
    mother: 'rahel',
    born: 11,
    side: 'east',
    meaning: { de: '„Gott ließ mich vergessen"', en: '"God has made me forget"' },
    lot: 'Jos 13,29-31',
    chronicles: {
      register: '1Chr 5,23-26',
      dwelling: '1Chr 5,23',
      prince: { de: 'Iddo', en: 'Iddo', ref: '1Chr 27,21' },
      note: {
        de: 'Von Basan bis an den Hermon. Dieser Abschnitt endet, wo die Ostgebiete enden: mit der Wegführung durch Assyrien (1Chr 5,26) – die Chronik nennt das Ende gleich beim Anfang.',
        en: 'From Bashan to Hermon. This section ends where the eastern lands end: with the Assyrian deportation (1 Chr 5:26) – the Chronicler names the end alongside the beginning.',
      },
    },
    blessing: '1Mo 49,22-26',
    mosesBlessing: '5Mo 33,13-17',
    land: {
      de: 'Der halbe Stamm blieb östlich des Jordans: Baschan und der Golan, das Königreich Ogs mit seinen sechzig befestigten Städten (5Mo 3,4). Weizen und Rinderweide – die „Kühe von Baschan" sind sprichwörtlich (Am 4,1). Als erstes Gebiet Israels fällt es 732 v. Chr. an Assyrien.',
      en: 'Half the tribe stayed east of the Jordan: Bashan and the Golan, the kingdom of Og with its sixty fortified cities (Deut 3:4). Wheat and cattle pasture – the "cows of Bashan" became proverbial (Amos 4:1). It is the first part of Israel to fall to Assyria, in 732 BC.',
    },
    cities: [
      { de: 'Aschtarot', en: 'Ashtaroth', lat: 32.8, lon: 36.01, major: true },
      { de: 'Golan', en: 'Golan', lat: 32.94, lon: 35.95 },
      { de: 'Edrei', en: 'Edrei', lat: 32.61, lon: 36.1 },
    ],
    polygon: [
      [32.7, 35.64],
      [32.66, 35.75],
      [32.58, 36.05],
      [32.72, 36.5],
      [33.05, 36.45],
      [33.25, 36.05],
      [33.32, 35.8],
      [33.12, 35.7],
      [32.92, 35.68],
      [32.76, 35.66],
    ],
  },

  // ---- The tribe with no land ---------------------------------------------
  {
    id: 'levi',
    people: [
      {
        de: 'Mose',
        en: 'Moses',
        role: { de: 'Prophet und Führer', en: 'Prophet and leader' },
        ref: '2Mo 6,20',
        node: 'mose',
      },
      {
        de: 'Aaron',
        en: 'Aaron',
        role: { de: 'Erster Hoherpriester', en: 'First high priest' },
        ref: '2Mo 6,20',
        node: 'aaron',
      },
      {
        de: 'Mirjam',
        en: 'Miriam',
        role: { de: 'Prophetin', en: 'Prophetess' },
        ref: '2Mo 15,20',
        node: 'mirjam',
      },
      {
        de: 'Pinhas',
        en: 'Phinehas',
        role: { de: 'Priester', en: 'Priest' },
        ref: '4Mo 25,7',
        node: 'pinhas',
      },
      {
        de: 'Samuel',
        en: 'Samuel',
        role: { de: 'Richter und Prophet', en: 'Judge and prophet' },
        ref: '1Chr 6,18-23',
      },
      {
        de: 'Hesekiel',
        en: 'Ezekiel',
        role: { de: 'Priester und Prophet im Exil', en: 'Priest and prophet in exile' },
        ref: 'Hes 1,3',
      },
      {
        de: 'Johannes der Täufer',
        en: 'John the Baptist',
        role: { de: 'Sohn eines Priesters', en: 'Son of a priest' },
        ref: 'Lk 1,5',
      },
    ],
    rank: 3,
    de: 'Levi',
    en: 'Levi',
    color: '#e0a449',
    mother: 'lea',
    born: 3,
    side: 'west',
    meaning: { de: '„Nun wird er sich mir zuwenden"', en: '"Now he will be joined to me"' },
    lot: 'Jos 21',
    chronicles: {
      register: '1Chr 5,27-6,66',
      dwelling: '1Chr 6,39-66',
      prince: { de: 'Hasabja', en: 'Hashabiah', ref: '1Chr 27,17' },
      note: {
        de: 'Kein Los, aber die längste Ortsliste der Chronik: die Levitenstädte, aus jedem Stamm herausgelöst. Neben Levi steht ein zweiter Fürst für die Aaroniten – Zadok (1Chr 27,17).',
        en: 'No allotment, but the Chronicler’s longest list of places: the Levitical towns, taken out of every tribe. Beside Levi stands a second prince for the Aaronites – Zadok (1 Chr 27:17).',
      },
    },
    blessing: '1Mo 49,5-7',
    mosesBlessing: '5Mo 33,8-11',
    land: {
      de: 'Levi bekommt kein Los. „Der HERR ist ihr Erbteil" (5Mo 18,2) – stattdessen 48 Städte mitten in den anderen Stämmen, darunter die sechs Zufluchtsstädte, in die fliehen konnte, wer ohne Absicht getötet hatte. Aus dem Fluch über Simeon und Levi wird bei Levi ein Amt: verteilt zu sein heißt hier, überall zu lehren.',
      en: 'Levi receives no lot. "The LORD is their inheritance" (Deut 18:2) – instead 48 towns scattered among the other tribes, six of them cities of refuge for anyone who had killed without intent. For Levi the curse of being scattered turns into an office: to be everywhere is to teach everywhere.',
    },
    cities: [],
  },
];

export const TRIBE_BY_ID = Object.fromEntries(TRIBES.map((t) => [t.id, t])) as Record<string, Tribe>;

/**
 * Der Name, unter dem ein Stamm in der Adresse steht. Die Schlüssel im Hash
 * sind in diesem Projekt deutsch (`#ort`, `#reise`, `#kirche`, `#stammbaum`),
 * also ist es der Stamm auch: `#stammbaum=gebiete,juda` statt `judah`, und
 * `manasse-ost` statt `m-east`.
 */
export function tribeSlug(t: Tribe): string {
  return t.de
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

const BY_SLUG: Record<string, Tribe> = (() => {
  const map: Record<string, Tribe> = {};
  for (const t of TRIBES) {
    // Die eigene Kennung und der englische Name gelten mit, damit ein von Hand
    // getippter Link nicht daran scheitert, in welcher Sprache er gedacht war.
    for (const key of [tribeSlug(t), t.id, t.en.toLowerCase()]) map[key] = map[key] ?? t;
  }
  return map;
})();

/** Stamm aus einer Adresse. `null`, wenn es ihn nicht gibt – nicht geraten. */
export function tribeBySlug(slug: string | undefined): Tribe | null {
  if (!slug) return null;
  return BY_SLUG[slug.toLowerCase()] ?? null;
}

/** The six cities of refuge (Jos 20,7-8) – Levi's mark on the map. */
export const REFUGE_CITIES: (TribeCity & { in: string })[] = [
  { de: 'Kedesch', en: 'Kedesh', lat: 33.11, lon: 35.53, in: 'naphtali' },
  { de: 'Sichem', en: 'Shechem', lat: 32.21, lon: 35.28, in: 'manasseh' },
  { de: 'Hebron', en: 'Hebron', lat: 31.53, lon: 35.1, in: 'judah' },
  { de: 'Bezer', en: 'Bezer', lat: 31.75, lon: 35.88, in: 'reuben' },
  { de: 'Ramot in Gilead', en: 'Ramoth-gilead', lat: 32.56, lon: 36.0, in: 'gad' },
  { de: 'Golan', en: 'Golan', lat: 32.94, lon: 35.95, in: 'm-east' },
];

/**
 * Dan gave up and moved: from Zora in the south-west to Laisch at the northern
 * spring of the Jordan, which the tribe renamed after itself (Ri 18). Drawn as
 * an arc, because it is the one migration the allotment map cannot show.
 */
export const DAN_MIGRATION: { from: [number, number]; to: [number, number]; ref: string } = {
  from: [31.77, 34.99],
  to: [33.25, 35.65],
  ref: 'Ri 18,27-29',
};

// ---- geometry helpers -------------------------------------------------------

/** Signed area in square degrees (shoelace) – used to size the atlas label. */
export function polygonArea(ring: [number, number][]): number {
  let a = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    a += ring[j][1] * ring[i][0] - ring[i][1] * ring[j][0];
  }
  return Math.abs(a / 2);
}

/**
 * Centroid of the ring. For the long thin allotments (Benjamin, Asser) the
 * area centroid still lands inside, which the bounding-box centre would not.
 */
export function polygonCentroid(ring: [number, number][]): [number, number] {
  let cx = 0;
  let cy = 0;
  let a = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const f = ring[j][1] * ring[i][0] - ring[i][1] * ring[j][0];
    a += f;
    cy += (ring[j][1] + ring[i][1]) * f;
    cx += (ring[j][0] + ring[i][0]) * f;
  }
  a *= 3;
  if (!a) return ring[0];
  return [cx / a, cy / a];
}

/**
 * Who borders whom. The territories were drawn to SHARE their border vertices,
 * so two tribes that meet along a line have at least two points in common —
 * while two that only touch at a corner (Asser and Manasse at the Karmel) or
 * face each other across the Jordan have exactly one, and are not neighbours.
 */
export const NEIGHBOURS: Record<string, string[]> = (() => {
  const key = (p: [number, number]) => `${p[0].toFixed(3)},${p[1].toFixed(3)}`;
  const rings = TRIBES.filter((t) => t.polygon).map((t) => ({
    id: t.id,
    pts: new Set(t.polygon!.map(key)),
  }));
  const out: Record<string, string[]> = Object.fromEntries(TRIBES.map((t) => [t.id, []]));
  for (let i = 0; i < rings.length; i++) {
    for (let j = i + 1; j < rings.length; j++) {
      let shared = 0;
      for (const pt of rings[i].pts) if (rings[j].pts.has(pt)) shared++;
      if (shared >= 2) {
        out[rings[i].id].push(rings[j].id);
        out[rings[j].id].push(rings[i].id);
      }
    }
  }
  return out;
})();

/**
 * In wessen Gebiet liegt dieser Punkt? Strahlenverfahren gegen die dreizehn
 * Ringe. Die Ringe überlappen sich nicht, also gibt es höchstens eine Antwort;
 * wer außerhalb liegt – Philisterküste, Negev, Phönizien – bekommt keine, statt
 * dem nächstgelegenen Stamm zugeschlagen zu werden.
 */
export function tribeAt(lat: number, lon: number): Tribe | null {
  for (const t of TRIBES) {
    const ring = t.polygon;
    if (!ring) continue;
    let inside = false;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const [yi, xi] = ring[i];
      const [yj, xj] = ring[j];
      if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside;
    }
    if (inside) return t;
  }
  return null;
}
