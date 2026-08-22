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
  | 'israel'
  | 'messiah';

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
  { id: 'messiah', de: 'Messianische Linie bis Jesus', en: 'Messianic line to Jesus', color: '#c2812a' },
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

// ---- The twelve tribes and their families (1 Chr 2–9 · Num 26 · Gen 46) ----
// Each tribe lists its clan-heads and named descendants as recorded in the
// genealogies of 1 Chronicles 2–9, so one can see "who belongs to which tribe" —
// e.g. Machir, Gilead, Gideon and Zelophehad’s daughters under Manasseh; David,
// the kings of Judah and Zerubbabel under Judah; Aaron’s priestly dynasty, Moses,
// Samuel and the temple singers under Levi; the house of Saul under Benjamin.

const TRIBE_REUBEN: GenNode = {
  id: 'reuben', de: 'Ruben', en: 'Reuben', ref: '1Chr 5:1–3', line: 'israel',
  note: { de: 'Erstgeborener Jakobs; Ostjordanland. Die Erstgeburt ging an Josef.', en: 'Jacob’s firstborn; east of the Jordan. The birthright passed to Joseph.' },
  children: [
    { id: 'r-hanoch', de: 'Henoch', en: 'Hanoch', ref: '1Chr 5:3', line: 'israel' },
    { id: 'r-pallu', de: 'Pallu', en: 'Pallu', ref: '1Chr 5:3', line: 'israel' },
    { id: 'r-hezron', de: 'Hezron', en: 'Hezron', ref: '1Chr 5:3', line: 'israel' },
    { id: 'r-carmi', de: 'Karmi', en: 'Carmi', ref: '1Chr 5:3', line: 'israel' },
    {
      id: 'r-joel', de: 'Joel', en: 'Joel', ref: '1Chr 5:4', line: 'israel',
      note: { de: 'Fürstenlinie der Rubeniter.', en: 'The princely Reubenite line.' },
      spine: [
        { de: 'Schemaja', en: 'Shemaiah', ref: '1Chr 5:4' },
        { de: 'Gog', en: 'Gog', ref: '1Chr 5:4' },
        { de: 'Schimi', en: 'Shimei', ref: '1Chr 5:4' },
        { de: 'Micha', en: 'Micah', ref: '1Chr 5:5' },
        { de: 'Reaja', en: 'Reaiah', ref: '1Chr 5:5' },
        { de: 'Baal', en: 'Baal', ref: '1Chr 5:5' },
      ],
      children: [
        { id: 'r-beera', de: 'Beera', en: 'Beerah', ref: '1Chr 5:6', line: 'israel', note: { de: 'Fürst; von Tiglat-Pileser nach Assyrien weggeführt.', en: 'Prince; carried to Assyria by Tiglath-Pileser.' } },
      ],
    },
  ],
};

const TRIBE_SIMEON: GenNode = {
  id: 'simeon', de: 'Simeon', en: 'Simeon', ref: '1Chr 4:24–43', line: 'israel',
  note: { de: 'Wohnte im Süden Judas (Beerscheba, Ziklag).', en: 'Settled in the south of Judah (Beersheba, Ziklag).' },
  children: [
    { id: 's-nemuel', de: 'Nemuel', en: 'Nemuel', ref: '1Chr 4:24', line: 'israel' },
    { id: 's-jamin', de: 'Jamin', en: 'Jamin', ref: '1Chr 4:24', line: 'israel' },
    { id: 's-jarib', de: 'Jarib', en: 'Jarib', ref: '1Chr 4:24', line: 'israel' },
    { id: 's-zerah', de: 'Serach', en: 'Zerah', ref: '1Chr 4:24', line: 'israel' },
    {
      id: 's-shaul', de: 'Saul', en: 'Shaul', ref: '1Chr 4:24–27', line: 'israel',
      note: { de: 'Sein Nachkomme Schimi hatte 16 Söhne und 6 Töchter.', en: 'His descendant Shimei had 16 sons and 6 daughters.' },
      spine: [
        { de: 'Schallum', en: 'Shallum', ref: '1Chr 4:25' },
        { de: 'Mibsam', en: 'Mibsam', ref: '1Chr 4:25' },
        { de: 'Mischma', en: 'Mishma', ref: '1Chr 4:25' },
        { de: 'Hammuel', en: 'Hammuel', ref: '1Chr 4:26' },
        { de: 'Sakkur', en: 'Zaccur', ref: '1Chr 4:26' },
      ],
      children: [
        { id: 's-shimei', de: 'Schimi', en: 'Shimei', ref: '1Chr 4:26–27', line: 'israel' },
      ],
    },
  ],
};

const TRIBE_LEVI: GenNode = {
  id: 'levi', de: 'Levi', en: 'Levi', ref: '1Chr 6:1', line: 'israel',
  note: { de: 'Priesterstamm. Aus Kehat kommen Aaron (Priester), Mose und Samuel; die Tempelsänger sind Heman, Asaph und Etan.', en: 'The priestly tribe. From Kohath come Aaron (priest), Moses and Samuel; the temple singers are Heman, Asaph and Ethan.' },
  children: [
    {
      id: 'l-gershon', de: 'Gerschon', en: 'Gershon', ref: '1Chr 6:1 · 6:17', line: 'israel',
      note: { de: 'Aus seiner Linie der Sänger Asaph.', en: 'From his line the singer Asaph.' },
      children: [
        { id: 'l-libni', de: 'Libni', en: 'Libni', ref: '1Chr 6:17', line: 'israel' },
        { id: 'l-shimei-g', de: 'Schimi', en: 'Shimei', ref: '1Chr 6:17', line: 'israel' },
        { id: 'asaph', de: 'Asaph', en: 'Asaph', ref: '1Chr 6:39', line: 'israel', note: { de: 'Sänger zur Rechten Hemans; ihm werden Psalmen zugeschrieben.', en: 'Singer at Heman’s right; psalms are ascribed to him.' } },
      ],
    },
    {
      id: 'l-kohath', de: 'Kehat', en: 'Kohath', ref: '1Chr 6:2', line: 'israel',
      children: [
        {
          id: 'l-amram', de: 'Amram', en: 'Amram', ref: '1Chr 6:3', line: 'israel',
          children: [
            {
              id: 'aaron', de: 'Aaron', en: 'Aaron', ref: '1Chr 6:3', line: 'israel',
              note: { de: 'Der erste Hohepriester; seine Linie stellt die Priester.', en: 'The first high priest; his line supplies the priests.' },
              children: [
                { id: 'nadab', de: 'Nadab', en: 'Nadab', ref: '1Chr 6:3', line: 'israel' },
                { id: 'abihu', de: 'Abihu', en: 'Abihu', ref: '1Chr 6:3', line: 'israel' },
                {
                  id: 'eleazar', de: 'Eleasar', en: 'Eleazar', ref: '1Chr 6:3–4', line: 'israel',
                  note: { de: 'Hohepriesterlinie bis ins Exil.', en: 'High-priestly line down to the exile.' },
                  spine: [
                    { de: 'Pinhas', en: 'Phinehas', ref: '1Chr 6:4' },
                    { de: 'Abischua', en: 'Abishua', ref: '1Chr 6:4' },
                    { de: 'Bukki', en: 'Bukki', ref: '1Chr 6:5' },
                    { de: 'Usi', en: 'Uzzi', ref: '1Chr 6:5' },
                    { de: 'Serachja', en: 'Zerahiah', ref: '1Chr 6:6' },
                    { de: 'Merajot', en: 'Meraioth', ref: '1Chr 6:6' },
                    { de: 'Amarja', en: 'Amariah', ref: '1Chr 6:7' },
                    { de: 'Ahitub', en: 'Ahitub', ref: '1Chr 6:7' },
                  ],
                  children: [
                    {
                      id: 'zadok', de: 'Zadok', en: 'Zadok', ref: '1Chr 6:8', line: 'israel',
                      note: { de: 'Hoherpriester unter David und Salomo.', en: 'High priest under David and Solomon.' },
                      spine: [
                        { de: 'Ahimaaz', en: 'Ahimaaz', ref: '1Chr 6:8' },
                        { de: 'Asarja', en: 'Azariah', ref: '1Chr 6:9' },
                        { de: 'Johanan', en: 'Johanan', ref: '1Chr 6:9' },
                        { de: 'Asarja', en: 'Azariah', ref: '1Chr 6:10' },
                        { de: 'Amarja', en: 'Amariah', ref: '1Chr 6:11' },
                        { de: 'Ahitub', en: 'Ahitub', ref: '1Chr 6:11' },
                        { de: 'Zadok', en: 'Zadok', ref: '1Chr 6:12' },
                        { de: 'Schallum', en: 'Shallum', ref: '1Chr 6:12' },
                        { de: 'Hilkija', en: 'Hilkiah', ref: '1Chr 6:13' },
                        { de: 'Asarja', en: 'Azariah', ref: '1Chr 6:13' },
                        { de: 'Seraja', en: 'Seraiah', ref: '1Chr 6:14' },
                      ],
                      children: [
                        { id: 'jozadak', de: 'Jozadak', en: 'Jehozadak', ref: '1Chr 6:15', line: 'israel', note: { de: 'Wurde beim Exil nach Babel weggeführt.', en: 'Carried into exile to Babylon.' } },
                      ],
                    },
                  ],
                },
                { id: 'ithamar', de: 'Itamar', en: 'Ithamar', ref: '1Chr 6:3', line: 'israel' },
              ],
            },
            { id: 'moses', de: 'Mose', en: 'Moses', ref: '1Chr 6:3 · 2Mo 6:20', line: 'israel', note: { de: 'Führer beim Auszug aus Ägypten.', en: 'Leader of the Exodus.' } },
            { id: 'miriam', de: 'Mirjam', en: 'Miriam', ref: '1Chr 6:3 · 2Mo 15:20', line: 'israel', note: { de: 'Prophetin, Schwester Moses.', en: 'Prophetess, sister of Moses.' } },
          ],
        },
        {
          id: 'l-izhar', de: 'Jizhar', en: 'Izhar', ref: '1Chr 6:2', line: 'israel',
          children: [
            { id: 'korah-l', de: 'Korach', en: 'Korah', ref: '1Chr 6:22', line: 'israel', note: { de: 'Stammvater der Korachiter (Sänger und Torhüter).', en: 'Ancestor of the Korahites (singers and gatekeepers).' } },
          ],
        },
        { id: 'l-hebron', de: 'Hebron', en: 'Hebron', ref: '1Chr 6:2', line: 'israel' },
        { id: 'l-uzziel', de: 'Usiël', en: 'Uzziel', ref: '1Chr 6:2', line: 'israel' },
        {
          id: 'l-elkanah', de: 'Elkana', en: 'Elkanah', ref: '1Chr 6:27', line: 'israel',
          note: { de: 'Kehatitische Linie der Sänger.', en: 'The Kohathite line of the singers.' },
          children: [
            {
              id: 'samuel', de: 'Samuel', en: 'Samuel', ref: '1Chr 6:27–28', line: 'israel',
              note: { de: 'Prophet und letzter Richter; salbte Saul und David.', en: 'Prophet and last judge; anointed Saul and David.' },
              children: [
                {
                  id: 's-joel-l', de: 'Joel', en: 'Joel', ref: '1Chr 6:33', line: 'israel',
                  children: [
                    { id: 'heman', de: 'Heman', en: 'Heman', ref: '1Chr 6:33', line: 'israel', note: { de: 'Oberster der Tempelsänger unter David.', en: 'Chief of the temple singers under David.' } },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'l-merari', de: 'Merari', en: 'Merari', ref: '1Chr 6:1 · 6:19', line: 'israel',
      note: { de: 'Aus seiner Linie der Sänger Etan.', en: 'From his line the singer Ethan.' },
      children: [
        { id: 'l-mahli', de: 'Machli', en: 'Mahli', ref: '1Chr 6:19', line: 'israel' },
        { id: 'l-mushi', de: 'Muschi', en: 'Mushi', ref: '1Chr 6:19', line: 'israel' },
        { id: 'ethan', de: 'Etan', en: 'Ethan', ref: '1Chr 6:44', line: 'israel', note: { de: 'Sänger zur Linken Hemans (auch Jedutun genannt).', en: 'Singer at Heman’s left (also called Jeduthun).' } },
      ],
    },
  ],
};

const TRIBE_JUDAH: GenNode = {
  id: 'judah', de: 'Juda', en: 'Judah', ref: '1Chr 2 – 4', line: 'israel',
  note: { de: 'Aus ihm kommen David, die Könige von Juda und der Messias.', en: 'From him come David, the kings of Judah and the Messiah.' },
  children: [
    { id: 'j-er', de: 'Ger', en: 'Er', ref: '1Chr 2:3', line: 'israel' },
    { id: 'j-onan', de: 'Onan', en: 'Onan', ref: '1Chr 2:3', line: 'israel' },
    {
      id: 'j-shelah', de: 'Schela', en: 'Shelah', ref: '1Chr 2:3 · 4:21', line: 'israel',
      note: { de: 'Sippen der Leinweber und Töpfer.', en: 'Clans of linen-workers and potters.' },
      children: [
        { id: 'j-er2', de: 'Ger (von Lecha)', en: 'Er of Lecah', ref: '1Chr 4:21', line: 'israel' },
        { id: 'j-laadah', de: 'Laeda', en: 'Laadah', ref: '1Chr 4:21', line: 'israel' },
      ],
    },
    {
      id: 'j-zerah', de: 'Serach', en: 'Zerah', ref: '1Chr 2:4–8', line: 'israel',
      children: [
        { id: 'j-zimri', de: 'Simri', en: 'Zimri', ref: '1Chr 2:6', line: 'israel' },
        { id: 'j-ethan', de: 'Etan', en: 'Ethan', ref: '1Chr 2:6', line: 'israel', note: { de: 'Sprichwörtlich weise (vgl. 1Kön 5:11).', en: 'Proverbially wise (cf. 1Kgs 4:31).' } },
        { id: 'j-heman', de: 'Heman', en: 'Heman', ref: '1Chr 2:6', line: 'israel' },
        { id: 'j-calcol', de: 'Chalkol', en: 'Calcol', ref: '1Chr 2:6', line: 'israel' },
        { id: 'j-dara', de: 'Dara', en: 'Darda', ref: '1Chr 2:6', line: 'israel' },
        { id: 'j-achan', de: 'Achan', en: 'Achan', ref: '1Chr 2:7 · Jos 7', line: 'israel', note: { de: '»Der Israel betrübte« – vergriff sich am Gebannten.', en: '“Troubler of Israel” – took what was devoted.' } },
      ],
    },
    {
      id: 'perez', de: 'Perez', en: 'Perez', ref: '1Chr 2:4–5', line: 'israel',
      note: { de: 'Aus ihm die Linie bis David.', en: 'From him the line down to David.' },
      children: [
        { id: 'j-hamul', de: 'Hamul', en: 'Hamul', ref: '1Chr 2:5', line: 'israel' },
        {
          id: 'j-hezron', de: 'Hezron', en: 'Hezron', ref: '1Chr 2:5·9', line: 'israel',
          children: [
            {
              id: 'j-ram', de: 'Ram', en: 'Ram', ref: '1Chr 2:9–10', line: 'israel',
              spine: [
                { de: 'Amminadab', en: 'Amminadab', ref: '1Chr 2:10' },
                { de: 'Nachschon', en: 'Nahshon', ref: '1Chr 2:10' },
                { de: 'Salma', en: 'Salmon', ref: '1Chr 2:11' },
                { de: 'Boas', en: 'Boaz', ref: '1Chr 2:11' },
                { de: 'Obed', en: 'Obed', ref: '1Chr 2:12' },
              ],
              children: [
                {
                  id: 'jesse', de: 'Isai', en: 'Jesse', ref: '1Chr 2:12–13', line: 'israel',
                  note: { de: 'Vater Davids; seine Söhne und Töchter:', en: 'Father of David; his sons and daughters:' },
                  children: [
                    { id: 'j-eliab', de: 'Eliab', en: 'Eliab', ref: '1Chr 2:13', line: 'israel' },
                    { id: 'j-abinadab', de: 'Abinadab', en: 'Abinadab', ref: '1Chr 2:13', line: 'israel' },
                    { id: 'j-shimea', de: 'Simea', en: 'Shimea', ref: '1Chr 2:13', line: 'israel' },
                    { id: 'j-nethanel', de: 'Netanel', en: 'Nethanel', ref: '1Chr 2:14', line: 'israel' },
                    { id: 'j-raddai', de: 'Raddai', en: 'Raddai', ref: '1Chr 2:14', line: 'israel' },
                    { id: 'j-ozem', de: 'Ozem', en: 'Ozem', ref: '1Chr 2:15', line: 'israel' },
                    {
                      id: 'david', de: 'David', en: 'David', ref: '1Chr 2:15 · 1Chr 3', line: 'israel',
                      note: { de: 'Der siebte Sohn; König über Israel. Aus seiner Linie die Könige von Juda bis zum Exil und Serubbabel.', en: 'The seventh son; king of Israel. His line are the kings of Judah down to the exile and Zerubbabel.' },
                      place: 'Bethlehem',
                      children: [
                        { id: 'd-amnon', de: 'Amnon', en: 'Amnon', ref: '1Chr 3:1', line: 'israel', note: { de: 'In Hebron geboren.', en: 'Born at Hebron.' } },
                        { id: 'd-absalom', de: 'Absalom', en: 'Absalom', ref: '1Chr 3:2', line: 'israel', note: { de: 'Empörte sich gegen David.', en: 'Rebelled against David.' } },
                        { id: 'd-adonijah', de: 'Adonija', en: 'Adonijah', ref: '1Chr 3:2', line: 'israel' },
                        { id: 'd-nathan', de: 'Natan', en: 'Nathan', ref: '1Chr 3:5', line: 'israel', note: { de: 'In Jerusalem geboren; über ihn läuft Lukas’ Stammbaum Jesu.', en: 'Born at Jerusalem; Luke’s genealogy of Jesus runs through him.' } },
                        {
                          id: 'solomon', de: 'Salomo', en: 'Solomon', ref: '1Chr 3:5', line: 'israel',
                          note: { de: 'König; baute den Tempel. Aus ihm die Königslinie:', en: 'King; built the temple. From him the royal line:' },
                          place: 'Jerusalem',
                          spine: [
                            { de: 'Rehabeam', en: 'Rehoboam', ref: '1Chr 3:10' },
                            { de: 'Abija', en: 'Abijah', ref: '1Chr 3:10' },
                            { de: 'Asa', en: 'Asa', ref: '1Chr 3:10' },
                            { de: 'Joschafat', en: 'Jehoshaphat', ref: '1Chr 3:10' },
                            { de: 'Joram', en: 'Joram', ref: '1Chr 3:11' },
                            { de: 'Ahasja', en: 'Ahaziah', ref: '1Chr 3:11' },
                            { de: 'Joasch', en: 'Joash', ref: '1Chr 3:11' },
                            { de: 'Amazja', en: 'Amaziah', ref: '1Chr 3:12' },
                            { de: 'Asarja (Usija)', en: 'Azariah (Uzziah)', ref: '1Chr 3:12' },
                            { de: 'Jotam', en: 'Jotham', ref: '1Chr 3:12' },
                            { de: 'Ahas', en: 'Ahaz', ref: '1Chr 3:13' },
                            { de: 'Hiskia', en: 'Hezekiah', ref: '1Chr 3:13' },
                            { de: 'Manasse', en: 'Manasseh', ref: '1Chr 3:13' },
                            { de: 'Amon', en: 'Amon', ref: '1Chr 3:14' },
                            { de: 'Josia', en: 'Josiah', ref: '1Chr 3:14' },
                            { de: 'Jojakim', en: 'Jehoiakim', ref: '1Chr 3:15–16' },
                          ],
                          children: [
                            {
                              id: 'jeconiah', de: 'Jojachin (Jechonja)', en: 'Jehoiachin (Jeconiah)', ref: '1Chr 3:16–17', line: 'israel',
                              note: { de: 'Wurde ins Exil weggeführt.', en: 'Was carried into exile.' },
                              children: [
                                {
                                  id: 'shealtiel', de: 'Schealtiël', en: 'Shealtiel', ref: '1Chr 3:17', line: 'israel',
                                  children: [
                                    {
                                      id: 'pedaiah', de: 'Pedaja', en: 'Pedaiah', ref: '1Chr 3:18–19', line: 'israel',
                                      children: [
                                        {
                                          id: 'zerubbabel', de: 'Serubbabel', en: 'Zerubbabel', ref: '1Chr 3:19', line: 'israel',
                                          note: { de: 'Führt die Rückkehrer aus dem Exil und baut den Tempel wieder auf. Über ihn läuft die messianische Linie weiter bis zu Jesus.', en: 'Leads the return from exile and rebuilds the temple. Through him the messianic line continues to Jesus.' },
                                          children: [
                                            {
                                              id: 'abihud', de: 'Abihud', en: 'Abiud', ref: 'Mt 1:13', line: 'messiah',
                                              note: { de: 'Nachexilische Generationen nach Matthäus 1 bis zu Josef und Jesus.', en: 'Post-exilic generations per Matthew 1 down to Joseph and Jesus.' },
                                              spine: [
                                                { de: 'Eljakim', en: 'Eliakim', ref: 'Mt 1:13' },
                                                { de: 'Asor', en: 'Azor', ref: 'Mt 1:13' },
                                                { de: 'Zadok', en: 'Zadok', ref: 'Mt 1:14' },
                                                { de: 'Achim', en: 'Achim', ref: 'Mt 1:14' },
                                                { de: 'Eliud', en: 'Eliud', ref: 'Mt 1:14' },
                                                { de: 'Eleasar', en: 'Eleazar', ref: 'Mt 1:15' },
                                                { de: 'Mattan', en: 'Matthan', ref: 'Mt 1:15' },
                                                { de: 'Jakob', en: 'Jacob', ref: 'Mt 1:15' },
                                              ],
                                              children: [
                                                {
                                                  id: 'joseph-mary', de: 'Josef', en: 'Joseph', ref: 'Mt 1:16', line: 'messiah',
                                                  note: { de: 'Mann der Maria; gesetzlicher Vater Jesu.', en: 'Husband of Mary; legal father of Jesus.' },
                                                  place: 'Nazareth',
                                                  children: [
                                                    {
                                                      id: 'jesus', de: 'Jesus Christus', en: 'Jesus Christ', ref: 'Mt 1:16 · Lk 3:23', line: 'messiah',
                                                      note: { de: 'Der Messias – Ziel der Verheißungslinie von Abraham und David (Mt 1:1). Geboren in Betlehem, aufgewachsen in Nazaret.', en: 'The Messiah – goal of the line of promise from Abraham and David (Mt 1:1). Born in Bethlehem, raised in Nazareth.' },
                                                      place: 'Bethlehem',
                                                    },
                                                  ],
                                                },
                                              ],
                                            },
                                            { id: 'z-meshullam', de: 'Meschullam', en: 'Meshullam', ref: '1Chr 3:19', line: 'israel' },
                                            { id: 'z-hananiah', de: 'Hananja', en: 'Hananiah', ref: '1Chr 3:19', line: 'israel' },
                                            { id: 'z-shelomith', de: 'Schelomit (Tochter)', en: 'Shelomith (daughter)', ref: '1Chr 3:19', line: 'israel' },
                                          ],
                                        },
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    { id: 'j-zeruiah', de: 'Zeruja (Schwester)', en: 'Zeruiah (sister)', ref: '1Chr 2:16', line: 'israel', note: { de: 'Mutter der Feldherren Abischai, Joab und Asaël.', en: 'Mother of the commanders Abishai, Joab and Asahel.' } },
                    { id: 'j-abigail', de: 'Abigail (Schwester)', en: 'Abigail (sister)', ref: '1Chr 2:16–17', line: 'israel', note: { de: 'Mutter Amasas.', en: 'Mother of Amasa.' } },
                  ],
                },
              ],
            },
            {
              id: 'j-caleb-h', de: 'Kaleb (Chelubai)', en: 'Caleb (Chelubai)', ref: '1Chr 2:9·18', line: 'israel',
              note: { de: 'Sohn Hezrons; aus seiner Linie Bezalel.', en: 'Son of Hezron; from his line Bezalel.' },
              children: [
                {
                  id: 'j-hur', de: 'Hur', en: 'Hur', ref: '1Chr 2:19–20', line: 'israel',
                  spine: [{ de: 'Uri', en: 'Uri', ref: '1Chr 2:20' }],
                  children: [
                    { id: 'bezalel', de: 'Bezalel', en: 'Bezalel', ref: '1Chr 2:20 · 2Mo 31:2', line: 'israel', note: { de: 'Kunsthandwerker der Stiftshütte.', en: 'Master craftsman of the tabernacle.' } },
                  ],
                },
              ],
            },
            {
              id: 'j-jerahmeel', de: 'Jerachmeel', en: 'Jerahmeel', ref: '1Chr 2:9·25', line: 'israel',
              note: { de: 'Erstgeborener Hezrons; die Jerachmeeliter.', en: 'Firstborn of Hezron; the Jerahmeelites.' },
            },
            {
              id: 'j-segub', de: 'Segub', en: 'Segub', ref: '1Chr 2:21–22', line: 'israel',
              children: [
                { id: 'j-jair', de: 'Jair', en: 'Jair', ref: '1Chr 2:22', line: 'israel', note: { de: 'Hatte 23 Städte im Land Gilead.', en: 'Had 23 towns in the land of Gilead.' } },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'j-kenaz', de: 'Kenas (Kenisiter)', en: 'Kenaz (Kenizzites)', ref: '1Chr 4:13', line: 'israel',
      note: { de: 'In Juda einverleibte Sippe.', en: 'A clan reckoned to Judah.' },
      children: [
        { id: 'othniel', de: 'Otniel', en: 'Othniel', ref: '1Chr 4:13 · Ri 3:9', line: 'israel', note: { de: 'Der erste Richter Israels.', en: 'The first judge of Israel.' } },
      ],
    },
    { id: 'j-caleb-j', de: 'Kaleb, Sohn Jefunnes', en: 'Caleb son of Jephunneh', ref: '1Chr 4:15 · 4Mo 13:6', line: 'israel', note: { de: 'Der treue Kundschafter.', en: 'The faithful spy.' } },
    { id: 'jabez', de: 'Jaebez', en: 'Jabez', ref: '1Chr 4:9–10', line: 'israel', note: { de: '»Ehrenwerter als seine Brüder«; für sein Gebet bekannt.', en: '“More honorable than his brothers”; known for his prayer.' } },
  ],
};

const TRIBE_ISSACHAR: GenNode = {
  id: 'issachar', de: 'Issachar', en: 'Issachar', ref: '1Chr 7:1–5', line: 'israel',
  children: [
    {
      id: 'i-tola', de: 'Tola', en: 'Tola', ref: '1Chr 7:1–2', line: 'israel',
      children: [
        { id: 'i-uzzi', de: 'Usi', en: 'Uzzi', ref: '1Chr 7:2', line: 'israel' },
        { id: 'i-rephaiah', de: 'Rephaja', en: 'Rephaiah', ref: '1Chr 7:2', line: 'israel' },
        { id: 'i-jeriel', de: 'Jeriel', en: 'Jeriel', ref: '1Chr 7:2', line: 'israel' },
        { id: 'i-jahmai', de: 'Jahemai', en: 'Jahmai', ref: '1Chr 7:2', line: 'israel' },
        { id: 'i-ibsam', de: 'Jibsam', en: 'Ibsam', ref: '1Chr 7:2', line: 'israel' },
        { id: 'i-shemuel', de: 'Samuel', en: 'Shemuel', ref: '1Chr 7:2', line: 'israel' },
      ],
    },
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
            {
              id: 'g-shemida', de: 'Schemida', en: 'Shemida', ref: '1Chr 7:19 · 4Mo 26:32', line: 'israel',
              children: [
                { id: 'g-ahian', de: 'Ahjan', en: 'Ahian', ref: '1Chr 7:19', line: 'israel' },
                { id: 'g-shechem2', de: 'Sichem', en: 'Shechem', ref: '1Chr 7:19', line: 'israel' },
                { id: 'g-likhi', de: 'Likhi', en: 'Likhi', ref: '1Chr 7:19', line: 'israel' },
                { id: 'g-aniam', de: 'Aniam', en: 'Aniam', ref: '1Chr 7:19', line: 'israel' },
              ],
            },
            {
              id: 'g-hepher', de: 'Hefer', en: 'Hepher', ref: '4Mo 26:32', line: 'israel',
              children: [
                {
                  id: 'zelophehad', de: 'Zelofhad', en: 'Zelophehad', ref: '1Chr 7:15 · 4Mo 27:1', line: 'israel',
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
    {
      id: 'm-east', de: 'Halbstamm im Basan', en: 'Half-tribe in Bashan', ref: '1Chr 5:23–24', line: 'israel',
      note: { de: 'Häupter im Ostjordanland.', en: 'Heads east of the Jordan.' },
      children: [
        { id: 'hm-epher', de: 'Epher', en: 'Epher', ref: '1Chr 5:24', line: 'israel' },
        { id: 'hm-ishi', de: 'Jesei', en: 'Ishi', ref: '1Chr 5:24', line: 'israel' },
        { id: 'hm-eliel', de: 'Eliel', en: 'Eliel', ref: '1Chr 5:24', line: 'israel' },
        { id: 'hm-jeremiah', de: 'Jeremia', en: 'Jeremiah', ref: '1Chr 5:24', line: 'israel' },
        { id: 'hm-hodaviah', de: 'Hodawja', en: 'Hodaviah', ref: '1Chr 5:24', line: 'israel' },
        { id: 'hm-jahdiel', de: 'Jachdiel', en: 'Jahdiel', ref: '1Chr 5:24', line: 'israel' },
      ],
    },
  ],
};

const TRIBE_EPHRAIM: GenNode = {
  id: 'ephraim', de: 'Ephraim', en: 'Ephraim', ref: '1Chr 7:20–27', line: 'israel', place: 'Ephraim',
  note: { de: 'Aus seiner Linie kommt Josua, der Nachfolger Moses.', en: 'From his line comes Joshua, Moses’ successor.' },
  children: [
    {
      id: 'e-shuthelah', de: 'Sutelach', en: 'Shuthelah', ref: '1Chr 7:20', line: 'israel',
      note: { de: 'Eine seiner Linien; einige Söhne fielen bei Gat.', en: 'One of his lines; some sons fell at Gath.' },
    },
    {
      id: 'e-line', de: 'Beria', en: 'Beriah', ref: '1Chr 7:23', line: 'israel',
      note: { de: 'Geboren, als es im Haus Ephraims Unglück gab; seine Tochter Scheera baute Bet-Horon.', en: 'Born amid misfortune in Ephraim’s house; his daughter Sheerah built Beth-horon.' },
      spine: [
        { de: 'Refach', en: 'Rephah', ref: '1Chr 7:25' },
        { de: 'Reschef', en: 'Resheph', ref: '1Chr 7:25' },
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
  note: { de: 'Erhielt die Erstgeburt; seine Söhne Ephraim und Manasse werden zu eigenen Stämmen.', en: 'Received the birthright; his sons Ephraim and Manasseh become tribes of their own.' },
  children: [TRIBE_MANASSEH, TRIBE_EPHRAIM],
};

const TRIBE_BENJAMIN: GenNode = {
  id: 'benjamin', de: 'Benjamin', en: 'Benjamin', ref: '1Chr 7:6 · 1Chr 8', line: 'israel',
  note: { de: 'Aus ihm der erste König, Saul.', en: 'From him the first king, Saul.' },
  children: [
    {
      id: 'b-bela', de: 'Bela', en: 'Bela', ref: '1Chr 7:6–7', line: 'israel',
      note: { de: 'Erstgeborener; fünf Söhne.', en: 'Firstborn; five sons.' },
      children: [
        { id: 'b-ezbon', de: 'Ezbon', en: 'Ezbon', ref: '1Chr 7:7', line: 'israel' },
        { id: 'b-uzzi', de: 'Usi', en: 'Uzzi', ref: '1Chr 7:7', line: 'israel' },
        { id: 'b-uzziel', de: 'Usiël', en: 'Uzziel', ref: '1Chr 7:7', line: 'israel' },
        { id: 'b-jerimoth', de: 'Jerimot', en: 'Jerimoth', ref: '1Chr 7:7', line: 'israel' },
        { id: 'b-iri', de: 'Iri', en: 'Iri', ref: '1Chr 7:7', line: 'israel' },
      ],
    },
    { id: 'b-becher', de: 'Becher', en: 'Becher', ref: '1Chr 7:6·8', line: 'israel' },
    {
      id: 'b-jediael', de: 'Jediaël', en: 'Jediael', ref: '1Chr 7:6·10', line: 'israel',
      children: [
        { id: 'b-bilhan', de: 'Bilhan', en: 'Bilhan', ref: '1Chr 7:10', line: 'israel' },
        { id: 'b-ehud', de: 'Ehud', en: 'Ehud', ref: '1Chr 8:6 · Ri 3:15', line: 'israel', note: { de: 'Der linkshändige Richter, der Eglon besiegte.', en: 'The left-handed judge who defeated Eglon.' } },
      ],
    },
    {
      id: 'b-ner', de: 'Ner', en: 'Ner', ref: '1Chr 8:33', line: 'israel',
      note: { de: 'Die Königslinie Sauls (Sippe zu Gibeon).', en: 'The royal line of Saul (clan at Gibeon).' },
      children: [
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
                    {
                      id: 'meribbaal', de: 'Merib-Baal (Mefi-Boschet)', en: 'Merib-baal (Mephibosheth)', ref: '1Chr 8:34', line: 'israel',
                      spine: [
                        { de: 'Micha', en: 'Micah', ref: '1Chr 8:34' },
                        { de: 'Ahas', en: 'Ahaz', ref: '1Chr 8:35' },
                        { de: 'Moza', en: 'Moza', ref: '1Chr 8:36–37' },
                        { de: 'Binea', en: 'Binea', ref: '1Chr 8:37' },
                      ],
                      children: [
                        { id: 'b-azel', de: 'Azel', en: 'Azel', ref: '1Chr 8:37–38', line: 'israel', note: { de: 'Hatte sechs Söhne.', en: 'Had six sons.' } },
                      ],
                    },
                  ],
                },
                { id: 'b-malchishua', de: 'Malkischua', en: 'Malchishua', ref: '1Chr 8:33', line: 'israel' },
                { id: 'b-abinadab', de: 'Abinadab', en: 'Abinadab', ref: '1Chr 8:33', line: 'israel' },
                { id: 'b-eshbaal', de: 'Esch-Baal (Isch-Boschet)', en: 'Esh-baal (Ish-bosheth)', ref: '1Chr 8:33', line: 'israel' },
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
  note: { de: 'Kinder von Bilha.', en: 'Sons of Bilhah.' },
  children: [
    { id: 'n-jahziel', de: 'Jachziel', en: 'Jahziel', ref: '1Chr 7:13', line: 'israel' },
    { id: 'n-guni', de: 'Guni', en: 'Guni', ref: '1Chr 7:13', line: 'israel' },
    { id: 'n-jezer', de: 'Jezer', en: 'Jezer', ref: '1Chr 7:13', line: 'israel' },
    { id: 'n-shallum', de: 'Schallum', en: 'Shallum', ref: '1Chr 7:13', line: 'israel' },
  ],
};

const TRIBE_GAD: GenNode = {
  id: 'gad', de: 'Gad', en: 'Gad', ref: '1Mo 46:16 · 1Chr 5:11–16', line: 'israel',
  note: { de: 'Wohnte im Basan; Häupter u. a. Joel und Schafam.', en: 'Settled in Bashan; chiefs included Joel and Shapham.' },
  children: [
    { id: 'gd-zephon', de: 'Zifjon', en: 'Zephon', ref: '1Mo 46:16 · 4Mo 26:15', line: 'israel' },
    { id: 'gd-haggi', de: 'Haggi', en: 'Haggi', ref: '4Mo 26:15', line: 'israel' },
    { id: 'gd-shuni', de: 'Schuni', en: 'Shuni', ref: '4Mo 26:15', line: 'israel' },
    { id: 'gd-ozni', de: 'Osni (Ezbon)', en: 'Ozni (Ezbon)', ref: '4Mo 26:16', line: 'israel' },
    { id: 'gd-eri', de: 'Eri', en: 'Eri', ref: '4Mo 26:16', line: 'israel' },
    { id: 'gd-arod', de: 'Arod', en: 'Arod', ref: '4Mo 26:17', line: 'israel' },
    { id: 'gd-areli', de: 'Areli', en: 'Areli', ref: '4Mo 26:17', line: 'israel' },
  ],
};

const TRIBE_ASHER: GenNode = {
  id: 'asher', de: 'Asser', en: 'Asher', ref: '1Chr 7:30–40', line: 'israel',
  children: [
    { id: 'a-imnah', de: 'Jimna', en: 'Imnah', ref: '1Chr 7:30', line: 'israel' },
    { id: 'a-ishvah', de: 'Jischwa', en: 'Ishvah', ref: '1Chr 7:30', line: 'israel' },
    { id: 'a-ishvi', de: 'Jischwi', en: 'Ishvi', ref: '1Chr 7:30', line: 'israel' },
    {
      id: 'a-beriah', de: 'Beria', en: 'Beriah', ref: '1Chr 7:30–31', line: 'israel',
      children: [
        {
          id: 'a-heber', de: 'Heber', en: 'Heber', ref: '1Chr 7:31–32', line: 'israel',
          children: [
            { id: 'a-japhlet', de: 'Japhlet', en: 'Japhlet', ref: '1Chr 7:32–33', line: 'israel' },
            { id: 'a-shomer', de: 'Semer', en: 'Shomer', ref: '1Chr 7:32', line: 'israel' },
            { id: 'a-hotham', de: 'Hotam', en: 'Hotham', ref: '1Chr 7:32', line: 'israel' },
          ],
        },
        { id: 'a-malchiel', de: 'Malkiël', en: 'Malchiel', ref: '1Chr 7:31', line: 'israel' },
      ],
    },
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
  note: { de: 'Aus seinen zwölf Söhnen werden die zwölf Stämme – hier mit ihren Sippen und namentlichen Nachkommen aus 1. Chronik 2–9.', en: 'From his twelve sons come the twelve tribes – here with their clans and named descendants from 1 Chronicles 2–9.' },
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

// Flat lookup of every node by id (for the map layer and cross-links).
export const NODE_BY_ID: Record<string, GenNode> = (() => {
  const map: Record<string, GenNode> = {};
  const walk = (n: GenNode) => {
    map[n.id] = n;
    for (const c of n.children ?? []) walk(c);
  };
  walk(GENEALOGY);
  return map;
})();
