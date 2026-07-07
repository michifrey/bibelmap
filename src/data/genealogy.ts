// Genealogy / Table of Nations from 1 Chronicles 1 (with its Genesis parallels
// Gen 5, 10, 11, 25, 36). This is the biblical descent of peoples and nations —
// "Völkertafel". The identifications of the eponymous ancestors with historical
// peoples and regions follow common, traditional scholarship (Josephus and
// standard reference works); they are widely held but not certain, hence marked
// as "traditionally". Names use the Luther/German spelling (de) and a common
// English spelling (en).

export type Line =
  | 'primeval'
  | 'shem'
  | 'ham'
  | 'japheth'
  | 'abraham'
  | 'ishmael'
  | 'keturah'
  | 'esau'
  | 'seir'
  | 'israel';

export interface BiText {
  de: string;
  en: string;
}

export interface GenNode {
  id: string;
  de: string; // name (German / Luther spelling)
  en: string; // name (English spelling)
  ref?: string; // scripture reference, e.g. "1Chr 1:5 · Gen 10:2"
  line?: Line; // colour grouping
  people?: BiText; // the people / nation this figure is the ancestor of
  region?: BiText; // rough geographic area (traditional identification)
  note?: BiText; // extra remark
  place?: string; // search term to locate a matching place on the map
  /**
   * A linear run of single-child generations shown compactly as a breadcrumb
   * before this node's `children` branch out. Keeps deep genealogical chains
   * (Adam→Noah, Shem→Abraham) readable instead of nesting 10 levels deep.
   */
  spine?: { de: string; en: string; ref?: string }[];
  children?: GenNode[];
}

// Metadata for the coloured legend of the descent lines.
export const LINES: { id: Line; de: string; en: string; color: string }[] = [
  { id: 'primeval', de: 'Von Adam bis Noah', en: 'Adam to Noah', color: '#8a7a5c' },
  { id: 'japheth', de: 'Jafet – nördliche Völker', en: 'Japheth – northern peoples', color: '#3a6ea8' },
  { id: 'ham', de: 'Ham – südliche & kanaanäische Völker', en: 'Ham – southern & Canaanite peoples', color: '#b8742e' },
  { id: 'shem', de: 'Sem – semitische Völker', en: 'Shem – Semitic peoples', color: '#2f8f7f' },
  { id: 'abraham', de: 'Abraham', en: 'Abraham', color: '#c2812a' },
  { id: 'ishmael', de: 'Ismael – arabische Stämme', en: 'Ishmael – Arabian tribes', color: '#a89321' },
  { id: 'keturah', de: 'Ketura – Midian & Wüstenstämme', en: 'Keturah – Midian & desert tribes', color: '#9a8a3a' },
  { id: 'esau', de: 'Esau – Edom', en: 'Esau – Edom', color: '#a0436b' },
  { id: 'seir', de: 'Seïr – Horiter', en: 'Seir – Horites', color: '#7a5c8a' },
  { id: 'israel', de: 'Israel (Jakob) – 12 Stämme', en: 'Israel (Jacob) – 12 tribes', color: '#9a4ba0' },
];

export const LINE_COLOR: Record<Line, string> = Object.fromEntries(
  LINES.map((l) => [l.id, l.color]),
) as Record<Line, string>;

// ---- Japheth (1 Chr 1:5–7 · Gen 10:2–5) ------------------------------------
const JAPHETH: GenNode = {
  id: 'japheth',
  de: 'Jafet',
  en: 'Japheth',
  ref: '1Chr 1:5 · Gen 10:2',
  line: 'japheth',
  note: { de: 'Stammvater der nördlichen und westlichen Küstenvölker.', en: 'Ancestor of the northern and coastland peoples.' },
  children: [
    {
      id: 'gomer', de: 'Gomer', en: 'Gomer', ref: '1Chr 1:6', line: 'japheth',
      people: { de: 'Kimmerier', en: 'Cimmerians' }, region: { de: 'nördl. Schwarzmeerraum', en: 'north of the Black Sea' },
      children: [
        { id: 'ashkenaz', de: 'Aschkenas', en: 'Ashkenaz', ref: '1Chr 1:6', line: 'japheth', people: { de: 'Skythen', en: 'Scythians' }, place: 'Ashkenaz' },
        { id: 'riphath', de: 'Rifat', en: 'Riphath', ref: '1Chr 1:6', line: 'japheth' },
        { id: 'togarmah', de: 'Togarma', en: 'Togarmah', ref: '1Chr 1:6', line: 'japheth', region: { de: 'Armenien', en: 'Armenia' }, place: 'Togarmah' },
      ],
    },
    { id: 'magog', de: 'Magog', en: 'Magog', ref: '1Chr 1:5', line: 'japheth', people: { de: 'Skythen', en: 'Scythians' }, place: 'Magog' },
    { id: 'madai', de: 'Madai', en: 'Madai', ref: '1Chr 1:5', line: 'japheth', people: { de: 'Meder', en: 'Medes' }, region: { de: 'Iran (Medien)', en: 'Media (Iran)' } },
    {
      id: 'javan', de: 'Jawan', en: 'Javan', ref: '1Chr 1:5 · Gen 10:4', line: 'japheth',
      people: { de: 'Griechen / Ionier', en: 'Greeks / Ionians' }, place: 'Greece',
      children: [
        { id: 'elishah', de: 'Elischa', en: 'Elishah', ref: '1Chr 1:7', line: 'japheth', region: { de: 'Zypern (Alaschija)', en: 'Cyprus (Alashiya)' } },
        { id: 'tarshish', de: 'Tarschisch', en: 'Tarshish', ref: '1Chr 1:7', line: 'japheth', region: { de: 'Westl. Mittelmeer (Tartessos)', en: 'Western Mediterranean (Tartessus)' }, place: 'Tarshish' },
        { id: 'kittim', de: 'Kittäer', en: 'Kittim', ref: '1Chr 1:7', line: 'japheth', region: { de: 'Zypern (Kition)', en: 'Cyprus (Kition)' }, place: 'Kittim' },
        { id: 'rodanim', de: 'Rodaniter', en: 'Rodanim', ref: '1Chr 1:7', line: 'japheth', region: { de: 'Rhodos', en: 'Rhodes' } },
      ],
    },
    { id: 'tubal', de: 'Tubal', en: 'Tubal', ref: '1Chr 1:5', line: 'japheth', region: { de: 'Anatolien (Tabal)', en: 'Anatolia (Tabal)' }, place: 'Tubal' },
    { id: 'meshech', de: 'Meschech', en: 'Meshech', ref: '1Chr 1:5', line: 'japheth', region: { de: 'Anatolien', en: 'Anatolia' }, place: 'Meshech' },
    { id: 'tiras', de: 'Tiras', en: 'Tiras', ref: '1Chr 1:5', line: 'japheth', region: { de: 'Ägäis / Thrakien', en: 'Aegean / Thrace' } },
  ],
};

// ---- Ham (1 Chr 1:8–16 · Gen 10:6–20) --------------------------------------
const HAM: GenNode = {
  id: 'ham',
  de: 'Ham',
  en: 'Ham',
  ref: '1Chr 1:8 · Gen 10:6',
  line: 'ham',
  note: { de: 'Stammvater der Völker Afrikas, Arabiens und Kanaans.', en: 'Ancestor of the peoples of Africa, Arabia and Canaan.' },
  children: [
    {
      id: 'cush', de: 'Kusch', en: 'Cush', ref: '1Chr 1:8', line: 'ham',
      region: { de: 'Nubien / Äthiopien', en: 'Nubia / Ethiopia' }, place: 'Cush',
      children: [
        { id: 'seba', de: 'Seba', en: 'Seba', ref: '1Chr 1:9', line: 'ham', place: 'Seba' },
        { id: 'havilah-c', de: 'Hawila', en: 'Havilah', ref: '1Chr 1:9', line: 'ham', region: { de: 'Arabien', en: 'Arabia' }, place: 'Havilah' },
        { id: 'sabta', de: 'Sabta', en: 'Sabta', ref: '1Chr 1:9', line: 'ham' },
        {
          id: 'raamah', de: 'Ragma', en: 'Raamah', ref: '1Chr 1:9', line: 'ham',
          children: [
            { id: 'sheba-r', de: 'Saba', en: 'Sheba', ref: '1Chr 1:9', line: 'ham', region: { de: 'Südarabien', en: 'South Arabia' }, place: 'Sheba' },
            { id: 'dedan-r', de: 'Dedan', en: 'Dedan', ref: '1Chr 1:9', line: 'ham', region: { de: 'Nordarabien', en: 'North Arabia' }, place: 'Dedan' },
          ],
        },
        { id: 'sabteca', de: 'Sabtecha', en: 'Sabteca', ref: '1Chr 1:9', line: 'ham' },
        {
          id: 'nimrod', de: 'Nimrod', en: 'Nimrod', ref: '1Chr 1:10', line: 'ham',
          note: { de: 'Der erste Gewaltige auf Erden; Reich in Babel, Erech, Akkad – später Ninive.', en: 'The first mighty one on earth; kingdom of Babel, Erech, Akkad – later Nineveh.' },
          place: 'Babylon',
        },
      ],
    },
    {
      id: 'mizraim', de: 'Mizrajim', en: 'Mizraim', ref: '1Chr 1:8', line: 'ham',
      people: { de: 'Ägypter', en: 'Egyptians' }, region: { de: 'Ägypten', en: 'Egypt' }, place: 'Egypt',
      children: [
        { id: 'ludim', de: 'Ludim', en: 'Ludim', ref: '1Chr 1:11', line: 'ham' },
        { id: 'anamim', de: 'Anamim', en: 'Anamim', ref: '1Chr 1:11', line: 'ham' },
        { id: 'lehabim', de: 'Lehabim', en: 'Lehabim', ref: '1Chr 1:11', line: 'ham', people: { de: 'Libyer', en: 'Libyans' } },
        { id: 'naphtuhim', de: 'Naftuhim', en: 'Naphtuhim', ref: '1Chr 1:11', line: 'ham' },
        { id: 'pathrusim', de: 'Patrusim', en: 'Pathrusim', ref: '1Chr 1:12', line: 'ham', region: { de: 'Oberägypten (Patros)', en: 'Upper Egypt (Pathros)' } },
        { id: 'casluhim', de: 'Kasluhim', en: 'Casluhim', ref: '1Chr 1:12', line: 'ham', note: { de: 'Von ihnen stammen die Philister.', en: 'From whom the Philistines came.' } },
        { id: 'caphtorim', de: 'Kaftoriter', en: 'Caphtorim', ref: '1Chr 1:12', line: 'ham', region: { de: 'Kreta (Kaftor)', en: 'Crete (Caphtor)' }, place: 'Caphtor' },
      ],
    },
    { id: 'put', de: 'Put', en: 'Put', ref: '1Chr 1:8', line: 'ham', region: { de: 'Libyen', en: 'Libya' }, place: 'Put' },
    {
      id: 'canaan', de: 'Kanaan', en: 'Canaan', ref: '1Chr 1:8', line: 'ham',
      people: { de: 'Kanaaniter', en: 'Canaanites' }, region: { de: 'Kanaan / Levante', en: 'Canaan / Levant' }, place: 'Canaan',
      children: [
        { id: 'sidon', de: 'Sidon', en: 'Sidon', ref: '1Chr 1:13', line: 'ham', note: { de: 'Erstgeborener; Phönizien.', en: 'Firstborn; Phoenicia.' }, place: 'Sidon' },
        { id: 'heth', de: 'Het', en: 'Heth', ref: '1Chr 1:13', line: 'ham', people: { de: 'Hetiter', en: 'Hittites' } },
        { id: 'jebusite', de: 'Jebusiter', en: 'Jebusites', ref: '1Chr 1:14', line: 'ham', note: { de: 'Bewohner von Jerusalem.', en: 'Inhabitants of Jerusalem.' }, place: 'Jebus' },
        { id: 'amorite', de: 'Amoriter', en: 'Amorites', ref: '1Chr 1:14', line: 'ham' },
        { id: 'girgashite', de: 'Girgaschiter', en: 'Girgashites', ref: '1Chr 1:14', line: 'ham' },
        { id: 'hivite', de: 'Hiwiter', en: 'Hivites', ref: '1Chr 1:15', line: 'ham' },
        { id: 'arkite', de: 'Arkiter', en: 'Arkites', ref: '1Chr 1:15', line: 'ham', region: { de: 'Arka (Libanon)', en: 'Arqa (Lebanon)' } },
        { id: 'sinite', de: 'Siniter', en: 'Sinites', ref: '1Chr 1:15', line: 'ham' },
        { id: 'arvadite', de: 'Arwaditer', en: 'Arvadites', ref: '1Chr 1:16', line: 'ham', region: { de: 'Arwad (Phönizien)', en: 'Arwad (Phoenicia)' }, place: 'Arvad' },
        { id: 'zemarite', de: 'Zemariter', en: 'Zemarites', ref: '1Chr 1:16', line: 'ham', place: 'Zemaraim' },
        { id: 'hamathite', de: 'Hamatiter', en: 'Hamathites', ref: '1Chr 1:16', line: 'ham', region: { de: 'Hamat (Syrien)', en: 'Hamath (Syria)' }, place: 'Hamath' },
      ],
    },
  ],
};

// ---- Joktan's Arabian sons (1 Chr 1:20–23 · Gen 10:26–29) ------------------
const JOKTAN: GenNode = {
  id: 'joktan',
  de: 'Joktan',
  en: 'Joktan',
  ref: '1Chr 1:19–20',
  line: 'shem',
  note: { de: 'Stammvater südarabischer Stämme.', en: 'Ancestor of South-Arabian tribes.' },
  children: [
    { id: 'almodad', de: 'Almodad', en: 'Almodad', ref: '1Chr 1:20', line: 'shem' },
    { id: 'sheleph', de: 'Schelef', en: 'Sheleph', ref: '1Chr 1:20', line: 'shem' },
    { id: 'hazarmaveth', de: 'Hazarmawet', en: 'Hazarmaveth', ref: '1Chr 1:20', line: 'shem', region: { de: 'Hadramaut (Jemen)', en: 'Hadramaut (Yemen)' } },
    { id: 'jerah', de: 'Jerach', en: 'Jerah', ref: '1Chr 1:20', line: 'shem' },
    { id: 'hadoram', de: 'Hadoram', en: 'Hadoram', ref: '1Chr 1:21', line: 'shem' },
    { id: 'uzal', de: 'Usal', en: 'Uzal', ref: '1Chr 1:21', line: 'shem', region: { de: 'Sana (Jemen)', en: "Sana'a (Yemen)" } },
    { id: 'diklah', de: 'Dikla', en: 'Diklah', ref: '1Chr 1:21', line: 'shem' },
    { id: 'ebal-j', de: 'Ebal', en: 'Ebal', ref: '1Chr 1:22', line: 'shem' },
    { id: 'abimael', de: 'Abimaël', en: 'Abimael', ref: '1Chr 1:22', line: 'shem' },
    { id: 'sheba-j', de: 'Saba', en: 'Sheba', ref: '1Chr 1:22', line: 'shem', region: { de: 'Südarabien', en: 'South Arabia' }, place: 'Sheba' },
    { id: 'ophir', de: 'Ofir', en: 'Ophir', ref: '1Chr 1:23', line: 'shem', region: { de: 'Arabien / Goldland', en: 'Arabia / land of gold' }, place: 'Ophir' },
    { id: 'havilah-j', de: 'Hawila', en: 'Havilah', ref: '1Chr 1:23', line: 'shem', place: 'Havilah' },
    { id: 'jobab', de: 'Jobab', en: 'Jobab', ref: '1Chr 1:23', line: 'shem' },
  ],
};

// ---- Shem (1 Chr 1:17–27 · Gen 10:21–31, 11:10–26) -------------------------
const SHEM: GenNode = {
  id: 'shem',
  de: 'Sem',
  en: 'Shem',
  ref: '1Chr 1:17 · Gen 10:22',
  line: 'shem',
  note: { de: 'Stammvater der semitischen Völker – und der Linie Abrahams.', en: 'Ancestor of the Semitic peoples – and of Abraham’s line.' },
  children: [
    { id: 'elam', de: 'Elam', en: 'Elam', ref: '1Chr 1:17', line: 'shem', people: { de: 'Elamiter', en: 'Elamites' }, region: { de: 'SW-Iran', en: 'SW Iran' }, place: 'Elam' },
    { id: 'asshur', de: 'Assur', en: 'Asshur', ref: '1Chr 1:17', line: 'shem', people: { de: 'Assyrer', en: 'Assyrians' }, region: { de: 'Assyrien', en: 'Assyria' }, place: 'Assyria' },
    {
      id: 'arphaxad', de: 'Arpachschad', en: 'Arphaxad', ref: '1Chr 1:17–18', line: 'shem',
      note: { de: 'Über Schelach und Eber verzweigt sich die Linie.', en: 'Through Shelah and Eber the line branches.' },
      spine: [
        { de: 'Schelach', en: 'Shelah', ref: '1Chr 1:18' },
        { de: 'Eber', en: 'Eber', ref: '1Chr 1:18–19' },
      ],
      children: [
        {
          id: 'peleg', de: 'Peleg', en: 'Peleg', ref: '1Chr 1:19', line: 'abraham',
          note: { de: '»Denn in seinen Tagen wurde die Erde geteilt.« → Linie bis Abraham.', en: '“For in his days the earth was divided.” → line to Abraham.' },
          children: [], // continues in the Abraham spine below
        },
        JOKTAN,
      ],
    },
    { id: 'lud', de: 'Lud', en: 'Lud', ref: '1Chr 1:17', line: 'shem', people: { de: 'Lyder', en: 'Lydians' }, region: { de: 'Anatolien', en: 'Anatolia' }, place: 'Lud' },
    {
      id: 'aram', de: 'Aram', en: 'Aram', ref: '1Chr 1:17', line: 'shem',
      people: { de: 'Aramäer', en: 'Arameans' }, region: { de: 'Syrien', en: 'Syria' },
      children: [
        { id: 'uz', de: 'Uz', en: 'Uz', ref: '1Chr 1:17', line: 'shem', place: 'Uz' },
        { id: 'hul', de: 'Hul', en: 'Hul', ref: '1Chr 1:17', line: 'shem' },
        { id: 'gether', de: 'Geter', en: 'Gether', ref: '1Chr 1:17', line: 'shem' },
        { id: 'meshech-s', de: 'Masch', en: 'Meshech', ref: '1Chr 1:17', line: 'shem' },
      ],
    },
  ],
};

// ---- Ishmael (1 Chr 1:29–31 · Gen 25:13–16) --------------------------------
const ISHMAEL: GenNode = {
  id: 'ishmael',
  de: 'Ismael',
  en: 'Ishmael',
  ref: '1Chr 1:28–29 · Gen 25:12',
  line: 'ishmael',
  note: { de: 'Sohn Abrahams und der Hagar; zwölf Fürsten – die Ismaeliter.', en: 'Son of Abraham and Hagar; twelve princes – the Ishmaelites.' },
  children: [
    { id: 'nebaioth', de: 'Nebajot', en: 'Nebaioth', ref: '1Chr 1:29', line: 'ishmael', people: { de: 'Nabatäer', en: 'Nabateans' } },
    { id: 'kedar', de: 'Kedar', en: 'Kedar', ref: '1Chr 1:29', line: 'ishmael', region: { de: 'Nordarabien', en: 'North Arabia' }, place: 'Kedar' },
    { id: 'adbeel', de: 'Adbeel', en: 'Adbeel', ref: '1Chr 1:29', line: 'ishmael' },
    { id: 'mibsam', de: 'Mibsam', en: 'Mibsam', ref: '1Chr 1:29', line: 'ishmael' },
    { id: 'mishma', de: 'Mischma', en: 'Mishma', ref: '1Chr 1:30', line: 'ishmael' },
    { id: 'dumah', de: 'Duma', en: 'Dumah', ref: '1Chr 1:30', line: 'ishmael', place: 'Dumah' },
    { id: 'massa', de: 'Massa', en: 'Massa', ref: '1Chr 1:30', line: 'ishmael' },
    { id: 'hadad-i', de: 'Hadad', en: 'Hadad', ref: '1Chr 1:30', line: 'ishmael' },
    { id: 'tema', de: 'Tema', en: 'Tema', ref: '1Chr 1:30', line: 'ishmael', region: { de: 'Oase Tayma (Arabien)', en: 'Tayma oasis (Arabia)' }, place: 'Tema' },
    { id: 'jetur', de: 'Jetur', en: 'Jetur', ref: '1Chr 1:31', line: 'ishmael', people: { de: 'Ituräer', en: 'Itureans' } },
    { id: 'naphish', de: 'Nafisch', en: 'Naphish', ref: '1Chr 1:31', line: 'ishmael' },
    { id: 'kedemah', de: 'Kedma', en: 'Kedemah', ref: '1Chr 1:31', line: 'ishmael' },
  ],
};

// ---- Keturah (1 Chr 1:32–33 · Gen 25:1–4) ----------------------------------
const KETURAH: GenNode = {
  id: 'keturah',
  de: 'Söhne der Ketura',
  en: 'Sons of Keturah',
  ref: '1Chr 1:32 · Gen 25:1',
  line: 'keturah',
  note: { de: 'Ketura, Abrahams Nebenfrau; Stammväter arabischer Wüstenstämme.', en: 'Keturah, Abraham’s concubine; ancestors of Arabian desert tribes.' },
  children: [
    { id: 'zimran', de: 'Simran', en: 'Zimran', ref: '1Chr 1:32', line: 'keturah' },
    {
      id: 'jokshan', de: 'Jokschan', en: 'Jokshan', ref: '1Chr 1:32', line: 'keturah',
      children: [
        { id: 'sheba-k', de: 'Saba', en: 'Sheba', ref: '1Chr 1:32', line: 'keturah', place: 'Sheba' },
        { id: 'dedan-k', de: 'Dedan', en: 'Dedan', ref: '1Chr 1:32', line: 'keturah', place: 'Dedan' },
      ],
    },
    { id: 'medan', de: 'Medan', en: 'Medan', ref: '1Chr 1:32', line: 'keturah' },
    {
      id: 'midian', de: 'Midian', en: 'Midian', ref: '1Chr 1:32', line: 'keturah',
      people: { de: 'Midianiter', en: 'Midianites' }, region: { de: 'NW-Arabien', en: 'NW Arabia' }, place: 'Midian',
      children: [
        { id: 'ephah', de: 'Efa', en: 'Ephah', ref: '1Chr 1:33', line: 'keturah' },
        { id: 'epher', de: 'Efer', en: 'Epher', ref: '1Chr 1:33', line: 'keturah' },
        { id: 'hanoch-m', de: 'Henoch', en: 'Hanoch', ref: '1Chr 1:33', line: 'keturah' },
        { id: 'abida', de: 'Abida', en: 'Abida', ref: '1Chr 1:33', line: 'keturah' },
        { id: 'eldaah', de: 'Eldaa', en: 'Eldaah', ref: '1Chr 1:33', line: 'keturah' },
      ],
    },
    { id: 'ishbak', de: 'Jischbak', en: 'Ishbak', ref: '1Chr 1:32', line: 'keturah' },
    { id: 'shuah', de: 'Schuach', en: 'Shuah', ref: '1Chr 1:32', line: 'keturah' },
  ],
};

// ---- Esau / Edom (1 Chr 1:35–54 · Gen 36) ----------------------------------
const ESAU: GenNode = {
  id: 'esau',
  de: 'Esau (Edom)',
  en: 'Esau (Edom)',
  ref: '1Chr 1:34–35 · Gen 36:1',
  line: 'esau',
  people: { de: 'Edomiter', en: 'Edomites' }, region: { de: 'Edom (Seïr)', en: 'Edom (Seir)' }, place: 'Edom',
  children: [
    {
      id: 'eliphaz', de: 'Elifas', en: 'Eliphaz', ref: '1Chr 1:35–36', line: 'esau',
      children: [
        { id: 'teman', de: 'Teman', en: 'Teman', ref: '1Chr 1:36', line: 'esau', region: { de: 'Süd-Edom', en: 'Southern Edom' }, place: 'Teman' },
        { id: 'omar', de: 'Omar', en: 'Omar', ref: '1Chr 1:36', line: 'esau' },
        { id: 'zephi', de: 'Zefo', en: 'Zephi', ref: '1Chr 1:36', line: 'esau' },
        { id: 'gatam', de: 'Gaetam', en: 'Gatam', ref: '1Chr 1:36', line: 'esau' },
        { id: 'kenaz', de: 'Kenas', en: 'Kenaz', ref: '1Chr 1:36', line: 'esau', people: { de: 'Kenasiter', en: 'Kenizzites' } },
        { id: 'timna', de: 'Timna', en: 'Timna', ref: '1Chr 1:36', line: 'esau' },
        { id: 'amalek', de: 'Amalek', en: 'Amalek', ref: '1Chr 1:36', line: 'esau', people: { de: 'Amalekiter', en: 'Amalekites' }, place: 'Amalek' },
      ],
    },
    {
      id: 'reuel', de: 'Reguel', en: 'Reuel', ref: '1Chr 1:35–37', line: 'esau',
      children: [
        { id: 'nahath', de: 'Nahat', en: 'Nahath', ref: '1Chr 1:37', line: 'esau' },
        { id: 'zerah-e', de: 'Serach', en: 'Zerah', ref: '1Chr 1:37', line: 'esau' },
        { id: 'shammah', de: 'Schamma', en: 'Shammah', ref: '1Chr 1:37', line: 'esau' },
        { id: 'mizzah', de: 'Misa', en: 'Mizzah', ref: '1Chr 1:37', line: 'esau' },
      ],
    },
    { id: 'jeush', de: 'Jeusch', en: 'Jeush', ref: '1Chr 1:35', line: 'esau' },
    { id: 'jalam', de: 'Jaelam', en: 'Jalam', ref: '1Chr 1:35', line: 'esau' },
    { id: 'korah-e', de: 'Korach', en: 'Korah', ref: '1Chr 1:35', line: 'esau' },
  ],
};

// ---- Seir the Horite (1 Chr 1:38–42 · Gen 36:20–30) ------------------------
const SEIR: GenNode = {
  id: 'seir',
  de: 'Seïr, der Horiter',
  en: 'Seir the Horite',
  ref: '1Chr 1:38',
  line: 'seir',
  note: { de: 'Die Ureinwohner Edoms; mit Esaus Nachkommen verbunden.', en: 'The original inhabitants of Edom; joined to Esau’s descendants.' },
  place: 'Seir',
  children: [
    { id: 'lotan', de: 'Lotan', en: 'Lotan', ref: '1Chr 1:38–39', line: 'seir' },
    { id: 'shobal', de: 'Schobal', en: 'Shobal', ref: '1Chr 1:38–40', line: 'seir' },
    { id: 'zibeon', de: 'Zibeon', en: 'Zibeon', ref: '1Chr 1:38–40', line: 'seir' },
    { id: 'anah', de: 'Ana', en: 'Anah', ref: '1Chr 1:38–41', line: 'seir' },
    { id: 'dishon', de: 'Dischon', en: 'Dishon', ref: '1Chr 1:38–41', line: 'seir' },
    { id: 'ezer-s', de: 'Ezer', en: 'Ezer', ref: '1Chr 1:38–42', line: 'seir' },
    { id: 'dishan', de: 'Dischan', en: 'Dishan', ref: '1Chr 1:38–42', line: 'seir' },
  ],
};

// ---- Israel / Jacob and the twelve tribes (1 Chr 2:1–2 · Gen 35:23–26) -----
const ISRAEL: GenNode = {
  id: 'israel',
  de: 'Israel (Jakob)',
  en: 'Israel (Jacob)',
  ref: '1Chr 2:1 · Gen 35:23',
  line: 'israel',
  note: { de: 'Aus seinen zwölf Söhnen werden die zwölf Stämme Israels.', en: 'From his twelve sons come the twelve tribes of Israel.' },
  children: [
    { id: 'reuben', de: 'Ruben', en: 'Reuben', ref: '1Chr 2:1', line: 'israel' },
    { id: 'simeon', de: 'Simeon', en: 'Simeon', ref: '1Chr 2:1', line: 'israel' },
    { id: 'levi', de: 'Levi', en: 'Levi', ref: '1Chr 2:1', line: 'israel', note: { de: 'Priesterstamm.', en: 'The priestly tribe.' } },
    { id: 'judah', de: 'Juda', en: 'Judah', ref: '1Chr 2:1', line: 'israel', note: { de: 'Aus ihm David und der Messias.', en: 'From him David and the Messiah.' }, place: 'Judah' },
    { id: 'issachar', de: 'Issachar', en: 'Issachar', ref: '1Chr 2:1', line: 'israel' },
    { id: 'zebulun', de: 'Sebulon', en: 'Zebulun', ref: '1Chr 2:1', line: 'israel' },
    { id: 'dan', de: 'Dan', en: 'Dan', ref: '1Chr 2:2', line: 'israel', place: 'Dan' },
    { id: 'joseph', de: 'Josef', en: 'Joseph', ref: '1Chr 2:2', line: 'israel', note: { de: 'Vater von Ephraim und Manasse.', en: 'Father of Ephraim and Manasseh.' } },
    { id: 'benjamin', de: 'Benjamin', en: 'Benjamin', ref: '1Chr 2:2', line: 'israel' },
    { id: 'naphtali', de: 'Naftali', en: 'Naphtali', ref: '1Chr 2:2', line: 'israel' },
    { id: 'gad', de: 'Gad', en: 'Gad', ref: '1Chr 2:2', line: 'israel' },
    { id: 'asher', de: 'Asser', en: 'Asher', ref: '1Chr 2:2', line: 'israel' },
  ],
};

// ---- Isaac (1 Chr 1:34) ----------------------------------------------------
const ISAAC: GenNode = {
  id: 'isaac',
  de: 'Isaak',
  en: 'Isaac',
  ref: '1Chr 1:34',
  line: 'abraham',
  children: [ESAU, SEIR, ISRAEL],
};

// ---- Abraham (1 Chr 1:27–28) -----------------------------------------------
const ABRAHAM: GenNode = {
  id: 'abraham',
  de: 'Abram – Abraham',
  en: 'Abram – Abraham',
  ref: '1Chr 1:27',
  line: 'abraham',
  note: { de: 'Mit ihm beginnt die Verheißungslinie; aus seinen Söhnen werden viele Völker.', en: 'With him the line of promise begins; from his sons come many peoples.' },
  place: 'Ur',
  children: [ISHMAEL, KETURAH, ISAAC],
};

// ---- The full tree ---------------------------------------------------------
// Adam → Noah is a single linear chain (Gen 5 / 1 Chr 1:1–4); shown as a spine.
export const GENEALOGY: GenNode = {
  id: 'adam',
  de: 'Adam',
  en: 'Adam',
  ref: '1Chr 1:1 · Gen 5:1',
  line: 'primeval',
  note: { de: 'Der erste Mensch. Zehn Generationen bis Noah.', en: 'The first man. Ten generations to Noah.' },
  spine: [
    { de: 'Set', en: 'Seth', ref: '1Chr 1:1' },
    { de: 'Enosch', en: 'Enosh', ref: '1Chr 1:1' },
    { de: 'Kenan', en: 'Kenan', ref: '1Chr 1:2' },
    { de: 'Mahalalel', en: 'Mahalalel', ref: '1Chr 1:2' },
    { de: 'Jered', en: 'Jared', ref: '1Chr 1:2' },
    { de: 'Henoch', en: 'Enoch', ref: '1Chr 1:3' },
    { de: 'Metuschelach', en: 'Methuselah', ref: '1Chr 1:3' },
    { de: 'Lamech', en: 'Lamech', ref: '1Chr 1:3' },
  ],
  children: [
    {
      id: 'noah',
      de: 'Noah',
      en: 'Noah',
      ref: '1Chr 1:4 · Gen 5:32',
      line: 'primeval',
      note: { de: 'Nach der Flut gehen von seinen drei Söhnen alle Völker aus (Völkertafel).', en: 'After the flood all nations descend from his three sons (Table of Nations).' },
      children: [JAPHETH, HAM, SHEM],
    },
  ],
};

// The Shem→Abraham chain (1 Chr 1:24–27) attached under Peleg, so the branch of
// nations (Joktan) and the line of promise (Peleg → Abraham) both stay visible.
const PELEG = (((SHEM.children!.find((c) => c.id === 'arphaxad')!).children!).find(
  (c) => c.id === 'peleg',
))!;
PELEG.spine = [
  { de: 'Regu', en: 'Reu', ref: '1Chr 1:25' },
  { de: 'Serug', en: 'Serug', ref: '1Chr 1:26' },
  { de: 'Nahor', en: 'Nahor', ref: '1Chr 1:26' },
  { de: 'Terach', en: 'Terah', ref: '1Chr 1:26' },
];
PELEG.children = [ABRAHAM];
