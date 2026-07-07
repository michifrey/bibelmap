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

// ---- The twelve tribes and their families (1 Chr 2–8 · Num 26 · Gen 46) ----
// Each tribe lists its clan-heads and its best-known descendants, so one can see
// "who belongs to which tribe" — e.g. Machir, Gilead, Gideon and Zelophehad’s
// daughters under Manasseh, or David and the kings of Judah under Judah.

const TRIBE_REUBEN: GenNode = {
  id: 'reuben', de: 'Ruben', en: 'Reuben', ref: '1Chr 5:1–3', line: 'israel',
  note: { de: 'Erstgeborener Jakobs; Ostjordanland.', en: 'Jacob’s firstborn; east of the Jordan.' },
  children: [
    { id: 'r-hanoch', de: 'Henoch', en: 'Hanoch', ref: '1Chr 5:3', line: 'israel' },
    { id: 'r-pallu', de: 'Pallu', en: 'Pallu', ref: '1Chr 5:3', line: 'israel' },
    { id: 'r-hezron', de: 'Hezron', en: 'Hezron', ref: '1Chr 5:3', line: 'israel' },
    { id: 'r-carmi', de: 'Karmi', en: 'Carmi', ref: '1Chr 5:3', line: 'israel' },
  ],
};

const TRIBE_SIMEON: GenNode = {
  id: 'simeon', de: 'Simeon', en: 'Simeon', ref: '1Chr 4:24', line: 'israel',
  children: [
    { id: 's-nemuel', de: 'Nemuel', en: 'Nemuel', ref: '1Chr 4:24', line: 'israel' },
    { id: 's-jamin', de: 'Jamin', en: 'Jamin', ref: '1Chr 4:24', line: 'israel' },
    { id: 's-jarib', de: 'Jarib', en: 'Jarib', ref: '1Chr 4:24', line: 'israel' },
    { id: 's-zerah', de: 'Serach', en: 'Zerah', ref: '1Chr 4:24', line: 'israel' },
    { id: 's-shaul', de: 'Saul', en: 'Shaul', ref: '1Chr 4:24', line: 'israel' },
  ],
};

const TRIBE_LEVI: GenNode = {
  id: 'levi', de: 'Levi', en: 'Levi', ref: '1Chr 6:1', line: 'israel',
  note: { de: 'Priesterstamm; aus Kehat kommen Mose und Aaron.', en: 'The priestly tribe; from Kohath come Moses and Aaron.' },
  children: [
    { id: 'l-gershon', de: 'Gerschon', en: 'Gershon', ref: '1Chr 6:1', line: 'israel' },
    {
      id: 'l-kohath', de: 'Kehat', en: 'Kohath', ref: '1Chr 6:2', line: 'israel',
      children: [
        {
          id: 'l-amram', de: 'Amram', en: 'Amram', ref: '1Chr 6:3', line: 'israel',
          children: [
            {
              id: 'aaron', de: 'Aaron', en: 'Aaron', ref: '1Chr 6:3', line: 'israel',
              note: { de: 'Der erste Hohepriester.', en: 'The first high priest.' },
              children: [
                { id: 'nadab', de: 'Nadab', en: 'Nadab', ref: '1Chr 6:3', line: 'israel' },
                { id: 'abihu', de: 'Abihu', en: 'Abihu', ref: '1Chr 6:3', line: 'israel' },
                {
                  id: 'eleazar', de: 'Eleasar', en: 'Eleazar', ref: '1Chr 6:3–4', line: 'israel',
                  children: [
                    { id: 'phinehas', de: 'Pinhas', en: 'Phinehas', ref: '1Chr 6:4', line: 'israel' },
                  ],
                },
                { id: 'ithamar', de: 'Itamar', en: 'Ithamar', ref: '1Chr 6:3', line: 'israel' },
              ],
            },
            { id: 'moses', de: 'Mose', en: 'Moses', ref: '2Mo 6:20', line: 'israel', note: { de: 'Führer beim Auszug aus Ägypten.', en: 'Leader of the Exodus.' } },
            { id: 'miriam', de: 'Mirjam', en: 'Miriam', ref: '2Mo 15:20', line: 'israel', note: { de: 'Prophetin, Schwester Moses.', en: 'Prophetess, sister of Moses.' } },
          ],
        },
        {
          id: 'l-izhar', de: 'Jizhar', en: 'Izhar', ref: '1Chr 6:2', line: 'israel',
          children: [
            { id: 'korah-l', de: 'Korach', en: 'Korah', ref: '1Chr 6:22', line: 'israel', note: { de: 'Stammvater der Korachiter (Tempelsänger).', en: 'Ancestor of the Korahites (temple singers).' } },
          ],
        },
      ],
    },
    { id: 'l-merari', de: 'Merari', en: 'Merari', ref: '1Chr 6:1', line: 'israel' },
  ],
};

const TRIBE_JUDAH: GenNode = {
  id: 'judah', de: 'Juda', en: 'Judah', ref: '1Chr 2:1–4', line: 'israel',
  note: { de: 'Aus ihm kommen David, die Könige und der Messias.', en: 'From him come David, the kings and the Messiah.' },
  children: [
    { id: 'j-er', de: 'Ger', en: 'Er', ref: '1Chr 2:3', line: 'israel' },
    { id: 'j-onan', de: 'Onan', en: 'Onan', ref: '1Chr 2:3', line: 'israel' },
    { id: 'j-shelah', de: 'Schela', en: 'Shelah', ref: '1Chr 2:3', line: 'israel' },
    { id: 'j-zerah', de: 'Serach', en: 'Zerah', ref: '1Chr 2:4', line: 'israel' },
    {
      id: 'perez', de: 'Perez', en: 'Perez', ref: '1Chr 2:4–5', line: 'israel',
      note: { de: 'Über acht Generationen bis zu David.', en: 'Eight generations to David.' },
      spine: [
        { de: 'Hezron', en: 'Hezron', ref: '1Chr 2:5' },
        { de: 'Ram', en: 'Ram', ref: '1Chr 2:9–10' },
        { de: 'Amminadab', en: 'Amminadab', ref: '1Chr 2:10' },
        { de: 'Nachschon', en: 'Nahshon', ref: '1Chr 2:10' },
        { de: 'Salma', en: 'Salmon', ref: '1Chr 2:11' },
        { de: 'Boas', en: 'Boaz', ref: '1Chr 2:11' },
        { de: 'Obed', en: 'Obed', ref: '1Chr 2:12' },
        { de: 'Isai', en: 'Jesse', ref: '1Chr 2:12–13' },
      ],
      children: [
        {
          id: 'david', de: 'David', en: 'David', ref: '1Chr 2:15 · 1Chr 3:1', line: 'israel',
          note: { de: 'König über Israel; aus seiner Linie die Könige von Juda.', en: 'King of Israel; his line are the kings of Judah.' },
          place: 'Bethlehem',
          spine: [
            { de: 'Salomo', en: 'Solomon', ref: '1Chr 3:5' },
            { de: 'Rehabeam', en: 'Rehoboam', ref: '1Chr 3:10' },
            { de: 'Abija', en: 'Abijah', ref: '1Chr 3:10' },
            { de: 'Asa', en: 'Asa', ref: '1Chr 3:10' },
            { de: 'Joschafat', en: 'Jehoshaphat', ref: '1Chr 3:10' },
            { de: 'Joram', en: 'Joram', ref: '1Chr 3:11' },
            { de: 'Usija', en: 'Uzziah', ref: '1Chr 3:12' },
            { de: 'Hiskia', en: 'Hezekiah', ref: '1Chr 3:13' },
            { de: 'Josia', en: 'Josiah', ref: '1Chr 3:14' },
            { de: 'Jojachin', en: 'Jehoiachin', ref: '1Chr 3:16' },
          ],
          children: [
            {
              id: 'shealtiel', de: 'Schealtiël', en: 'Shealtiel', ref: '1Chr 3:17', line: 'israel',
              children: [
                { id: 'zerubbabel', de: 'Serubbabel', en: 'Zerubbabel', ref: '1Chr 3:19', line: 'israel', note: { de: 'Führt die Rückkehrer aus dem Exil; baut den Tempel wieder auf.', en: 'Leads the return from exile; rebuilds the temple.' } },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'j-caleb', de: 'Kaleb', en: 'Caleb', ref: '1Chr 2:18 · 4Mo 13:6', line: 'israel',
      note: { de: 'Der treue Kundschafter aus Juda.', en: 'The faithful spy from Judah.' },
    },
  ],
};

const TRIBE_ISSACHAR: GenNode = {
  id: 'issachar', de: 'Issachar', en: 'Issachar', ref: '1Chr 7:1', line: 'israel',
  children: [
    { id: 'i-tola', de: 'Tola', en: 'Tola', ref: '1Chr 7:1', line: 'israel' },
    { id: 'i-puah', de: 'Pua', en: 'Puah', ref: '1Chr 7:1', line: 'israel' },
    { id: 'i-jashub', de: 'Jaschub', en: 'Jashub', ref: '1Chr 7:1', line: 'israel' },
    { id: 'i-shimron', de: 'Schimron', en: 'Shimron', ref: '1Chr 7:1', line: 'israel' },
  ],
};

const TRIBE_ZEBULUN: GenNode = {
  id: 'zebulun', de: 'Sebulon', en: 'Zebulun', ref: '1Mo 46:14 · 4Mo 26:26', line: 'israel',
  children: [
    { id: 'z-sered', de: 'Sered', en: 'Sered', ref: '1Mo 46:14', line: 'israel' },
    { id: 'z-elon', de: 'Elon', en: 'Elon', ref: '1Mo 46:14', line: 'israel' },
    { id: 'z-jahleel', de: 'Jachleel', en: 'Jahleel', ref: '1Mo 46:14', line: 'israel' },
  ],
};

const TRIBE_DAN: GenNode = {
  id: 'dan', de: 'Dan', en: 'Dan', ref: '1Mo 46:23 · 4Mo 26:42', line: 'israel', place: 'Dan',
  note: { de: 'Aus Dan kommt der Richter Simson.', en: 'From Dan comes the judge Samson.' },
  children: [
    { id: 'd-hushim', de: 'Huschim (Schuham)', en: 'Hushim (Shuham)', ref: '1Mo 46:23', line: 'israel' },
  ],
};

const TRIBE_MANASSEH: GenNode = {
  id: 'manasseh', de: 'Manasse', en: 'Manasseh', ref: '1Chr 7:14–19 · 4Mo 26:29', line: 'israel',
  note: { de: 'Halbstamm im Ostjordanland (Gilead) und im Westen.', en: 'Half-tribe east (Gilead) and west of the Jordan.' },
  children: [
    { id: 'm-asriel', de: 'Asriel', en: 'Asriel', ref: '1Chr 7:14', line: 'israel' },
    {
      id: 'm-machir', de: 'Machir', en: 'Machir', ref: '1Chr 7:14–16', line: 'israel',
      note: { de: 'Erstgeborener; Vater Gileads.', en: 'Firstborn; father of Gilead.' },
      children: [
        {
          id: 'gilead', de: 'Gilead', en: 'Gilead', ref: '1Chr 7:17 · 4Mo 26:29', line: 'israel', place: 'Gilead',
          note: { de: 'Nach ihm ist die Landschaft Gilead benannt; seine Sippen:', en: 'The region of Gilead is named after him; his clans:' },
          children: [
            {
              id: 'g-abiezer', de: 'Abiëser (Iëser)', en: 'Abiezer (Iezer)', ref: '4Mo 26:30 · Jos 17:2', line: 'israel',
              children: [
                { id: 'gideon', de: 'Gideon', en: 'Gideon', ref: 'Ri 6:11', line: 'israel', note: { de: 'Richter; aus der Sippe Abiëser.', en: 'Judge; of the clan of Abiezer.' } },
              ],
            },
            { id: 'g-helek', de: 'Helek', en: 'Helek', ref: '4Mo 26:30', line: 'israel' },
            { id: 'g-shechem', de: 'Sichem', en: 'Shechem', ref: '4Mo 26:31', line: 'israel' },
            { id: 'g-shemida', de: 'Schemida', en: 'Shemida', ref: '4Mo 26:32', line: 'israel' },
            {
              id: 'g-hepher', de: 'Hefer', en: 'Hepher', ref: '4Mo 26:32', line: 'israel',
              children: [
                {
                  id: 'zelophehad', de: 'Zelofhad', en: 'Zelophehad', ref: '4Mo 26:33 · 4Mo 27:1', line: 'israel',
                  note: { de: 'Hatte nur Töchter – die ein eigenes Erbrecht erhielten.', en: 'Had only daughters – who received their own inheritance right.' },
                  children: [
                    { id: 'zd-mahlah', de: 'Machla', en: 'Mahlah', ref: '4Mo 27:1', line: 'israel' },
                    { id: 'zd-noah', de: 'Noa', en: 'Noah', ref: '4Mo 27:1', line: 'israel' },
                    { id: 'zd-hoglah', de: 'Hogla', en: 'Hoglah', ref: '4Mo 27:1', line: 'israel' },
                    { id: 'zd-milcah', de: 'Milka', en: 'Milcah', ref: '4Mo 27:1', line: 'israel' },
                    { id: 'zd-tirzah', de: 'Tirza', en: 'Tirzah', ref: '4Mo 27:1', line: 'israel' },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

const TRIBE_EPHRAIM: GenNode = {
  id: 'ephraim', de: 'Ephraim', en: 'Ephraim', ref: '1Chr 7:20–27', line: 'israel', place: 'Ephraim',
  note: { de: 'Aus seiner Linie kommt Josua, der Nachfolger Moses.', en: 'From his line comes Joshua, Moses’ successor.' },
  children: [
    {
      id: 'e-line', de: 'Beria', en: 'Beriah', ref: '1Chr 7:23', line: 'israel',
      spine: [
        { de: 'Refach', en: 'Rephah', ref: '1Chr 7:25' },
        { de: 'Telach', en: 'Telah', ref: '1Chr 7:25' },
        { de: 'Tahan', en: 'Tahan', ref: '1Chr 7:25' },
        { de: 'Ladan', en: 'Ladan', ref: '1Chr 7:26' },
        { de: 'Ammihud', en: 'Ammihud', ref: '1Chr 7:26' },
        { de: 'Elischama', en: 'Elishama', ref: '1Chr 7:26' },
        { de: 'Nun', en: 'Nun', ref: '1Chr 7:27' },
      ],
      children: [
        { id: 'joshua', de: 'Josua', en: 'Joshua', ref: '1Chr 7:27', line: 'israel', note: { de: 'Führt Israel ins verheißene Land.', en: 'Leads Israel into the promised land.' } },
      ],
    },
  ],
};

const TRIBE_JOSEPH: GenNode = {
  id: 'joseph', de: 'Josef', en: 'Joseph', ref: '1Chr 5:1 · 1Mo 41:51–52', line: 'israel',
  note: { de: 'Seine Söhne Ephraim und Manasse werden zu eigenen Stämmen.', en: 'His sons Ephraim and Manasseh become tribes of their own.' },
  children: [TRIBE_MANASSEH, TRIBE_EPHRAIM],
};

const TRIBE_BENJAMIN: GenNode = {
  id: 'benjamin', de: 'Benjamin', en: 'Benjamin', ref: '1Chr 7:6 · 1Chr 8:1', line: 'israel',
  note: { de: 'Aus ihm der erste König, Saul.', en: 'From him the first king, Saul.' },
  children: [
    { id: 'b-bela', de: 'Bela', en: 'Bela', ref: '1Chr 7:6', line: 'israel' },
    { id: 'b-becher', de: 'Becher', en: 'Becher', ref: '1Chr 7:6', line: 'israel' },
    { id: 'b-jediael', de: 'Jediaël', en: 'Jediael', ref: '1Chr 7:6', line: 'israel' },
    {
      id: 'kish', de: 'Kisch', en: 'Kish', ref: '1Chr 8:33', line: 'israel',
      note: { de: 'Vater König Sauls.', en: 'Father of King Saul.' },
      children: [
        {
          id: 'saul', de: 'Saul', en: 'Saul', ref: '1Chr 8:33', line: 'israel', place: 'Gibeah',
          note: { de: 'Der erste König Israels.', en: 'The first king of Israel.' },
          children: [
            {
              id: 'jonathan', de: 'Jonatan', en: 'Jonathan', ref: '1Chr 8:33', line: 'israel', note: { de: 'Freund Davids.', en: 'Friend of David.' },
              children: [
                { id: 'meribbaal', de: 'Merib-Baal (Mefi-Boschet)', en: 'Merib-baal (Mephibosheth)', ref: '1Chr 8:34', line: 'israel' },
              ],
            },
          ],
        },
      ],
    },
  ],
};

const TRIBE_NAPHTALI: GenNode = {
  id: 'naphtali', de: 'Naftali', en: 'Naphtali', ref: '1Chr 7:13', line: 'israel',
  children: [
    { id: 'n-jahziel', de: 'Jachziel', en: 'Jahziel', ref: '1Chr 7:13', line: 'israel' },
    { id: 'n-guni', de: 'Guni', en: 'Guni', ref: '1Chr 7:13', line: 'israel' },
    { id: 'n-jezer', de: 'Jezer', en: 'Jezer', ref: '1Chr 7:13', line: 'israel' },
    { id: 'n-shallum', de: 'Schallum', en: 'Shallum', ref: '1Chr 7:13', line: 'israel' },
  ],
};

const TRIBE_GAD: GenNode = {
  id: 'gad', de: 'Gad', en: 'Gad', ref: '1Mo 46:16 · 4Mo 26:15', line: 'israel',
  children: [
    { id: 'gd-zephon', de: 'Zifjon', en: 'Zephon', ref: '4Mo 26:15', line: 'israel' },
    { id: 'gd-haggi', de: 'Haggi', en: 'Haggi', ref: '4Mo 26:15', line: 'israel' },
    { id: 'gd-shuni', de: 'Schuni', en: 'Shuni', ref: '4Mo 26:15', line: 'israel' },
    { id: 'gd-ozni', de: 'Osni (Ezbon)', en: 'Ozni (Ezbon)', ref: '4Mo 26:16', line: 'israel' },
    { id: 'gd-eri', de: 'Eri', en: 'Eri', ref: '4Mo 26:16', line: 'israel' },
    { id: 'gd-arod', de: 'Arod', en: 'Arod', ref: '4Mo 26:17', line: 'israel' },
    { id: 'gd-areli', de: 'Areli', en: 'Areli', ref: '4Mo 26:17', line: 'israel' },
  ],
};

const TRIBE_ASHER: GenNode = {
  id: 'asher', de: 'Asser', en: 'Asher', ref: '1Chr 7:30', line: 'israel',
  children: [
    { id: 'a-imnah', de: 'Jimna', en: 'Imnah', ref: '1Chr 7:30', line: 'israel' },
    { id: 'a-ishvah', de: 'Jischwa', en: 'Ishvah', ref: '1Chr 7:30', line: 'israel' },
    { id: 'a-ishvi', de: 'Jischwi', en: 'Ishvi', ref: '1Chr 7:30', line: 'israel' },
    { id: 'a-beriah', de: 'Beria', en: 'Beriah', ref: '1Chr 7:30', line: 'israel' },
    { id: 'a-serah', de: 'Serach (Schwester)', en: 'Serah (sister)', ref: '1Chr 7:30', line: 'israel' },
  ],
};

// ---- Israel / Jacob and the twelve tribes (1 Chr 2:1–2 · Gen 35:23–26) -----
const ISRAEL: GenNode = {
  id: 'israel',
  de: 'Israel (Jakob)',
  en: 'Israel (Jacob)',
  ref: '1Chr 2:1 · Gen 35:23',
  line: 'israel',
  note: { de: 'Aus seinen zwölf Söhnen werden die zwölf Stämme – mit ihren Sippen und bekanntesten Nachkommen.', en: 'From his twelve sons come the twelve tribes – with their clans and best-known descendants.' },
  children: [
    TRIBE_REUBEN,
    TRIBE_SIMEON,
    TRIBE_LEVI,
    TRIBE_JUDAH,
    TRIBE_ISSACHAR,
    TRIBE_ZEBULUN,
    TRIBE_DAN,
    TRIBE_JOSEPH,
    TRIBE_BENJAMIN,
    TRIBE_NAPHTALI,
    TRIBE_GAD,
    TRIBE_ASHER,
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
