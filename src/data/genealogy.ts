// Biblical genealogy ("Zeitbaum") from Adam & Eve down to Jesus Christ.
//
// The line follows the biblical sources: Genesis 5 (Adam → Noah) and 11
// (Shem → Abraham) with their stated lifespans, then Ruth 4 / 1 Chronicles 2
// (Perez → David), the royal succession of Judah (1–2 Kings / 1 Chronicles 3)
// and finally Matthew 1 for the post-exilic generations down to Joseph and
// Jesus. Side branches (Noah's sons / Table of Nations, the twelve sons of
// Jacob, Levi → Moses, …) are included where Scripture names them so the tree
// can be unfolded.
//
// Dates are APPROXIMATE. The antediluvian and post-flood years follow a common
// conservative (Ussher-style) reading of the Genesis numbers; the kings use the
// usual scholarly dates; the second-temple generations are interpolated. They
// give the timeline shape, not a scholarly verdict — hence the "≈" everywhere.

export interface Epoch {
  id: string;
  de: string;
  en: string;
  range: string;
  color: string;
}

// Color-coded epochs, oldest → newest. Knoten und Zeitschiene teilen sie sich.
export const GEN_EPOCHS: Epoch[] = [
  { id: 'urzeit', de: 'Urgeschichte', en: 'Primeval Age', range: '≈ vor 2350 v. Chr.', color: '#7d8a86' },
  { id: 'nachflut', de: 'Nach der Sintflut', en: 'After the Flood', range: '≈ 2350–2000 v. Chr.', color: '#a8895a' },
  { id: 'patriarchen', de: 'Erzväter', en: 'Patriarchs', range: '≈ 2000–1700 v. Chr.', color: '#b8742e' },
  { id: 'aegypten', de: 'Ägypten & Auszug', en: 'Egypt & Exodus', range: '≈ 1700–1400 v. Chr.', color: '#c98a2b' },
  { id: 'richter', de: 'Richterzeit', en: 'Age of the Judges', range: '≈ 1400–1050 v. Chr.', color: '#a89321' },
  { id: 'koenigtum', de: 'Königtum (David)', en: 'Monarchy (David)', range: '≈ 1050–930 v. Chr.', color: '#5c8a3a' },
  { id: 'koenige', de: 'Könige von Juda', en: 'Kings of Judah', range: '≈ 930–586 v. Chr.', color: '#2f8f7f' },
  { id: 'exil', de: 'Exil', en: 'Exile', range: '≈ 586–538 v. Chr.', color: '#3a6ea8' },
  { id: 'ruckkehr', de: 'Rückkehr', en: 'Return', range: '≈ 538–400 v. Chr.', color: '#5a5ca8' },
  { id: 'zweitertempel', de: 'Zweiter Tempel', en: 'Second Temple', range: '≈ 400–5 v. Chr.', color: '#7a5aa8' },
  { id: 'messias', de: 'Messias', en: 'Messiah', range: '≈ 5 v.–30 n. Chr.', color: '#9a4ba0' },
  // Post-biblisch: Glaubenszeugen / Kirchengeschichte (keine Blutlinie, sondern
  // geistlich-historische Nachfolge).
  { id: 'urkirche', de: 'Apostolische Zeit', en: 'Apostolic Age', range: '≈ 30–150 n. Chr.', color: '#b0436b' },
  { id: 'kirchenvater', de: 'Kirchenväter', en: 'Church Fathers', range: '≈ 150–500 n. Chr.', color: '#a85a7a' },
  { id: 'mittelalter', de: 'Mittelalter', en: 'Middle Ages', range: '≈ 500–1500 n. Chr.', color: '#7a6a45' },
  { id: 'reformation', de: 'Reformation', en: 'Reformation', range: '16. Jh.', color: '#c2812a' },
  { id: 'erweckung', de: 'Erweckung & Mission', en: 'Revival & Mission', range: '17.–19. Jh.', color: '#2f8f7f' },
  { id: 'moderne', de: 'Moderne', en: 'Modern Era', range: '20.–21. Jh.', color: '#3a6ea8' },
];

export const EPOCH_BY_ID: Record<string, Epoch> = Object.fromEntries(GEN_EPOCHS.map((e) => [e.id, e]));

/** Tradition of a church father — used by the church-history map overlay. */
export type Tradition = 'west' | 'east' | 'orient';

export interface Person {
  id: string;
  de: string;
  en: string;
  parent: string | null;
  /** On the main line Adam → Jesus (drawn as the open spine by default). */
  line?: boolean;
  /** Post-biblical faith witness (church history), not part of the bloodline. */
  faith?: boolean;
  /** Spouse shown on the card, where biblically named and relevant. */
  spouse?: { de: string; en: string };
  /** Approximate birth year; negative = v. Chr. / BC, positive = n. Chr. / AD. */
  born?: number;
  /** Total years lived, where Scripture states it (Genesis, etc.). */
  lifespan?: number;
  /** Short reign / role note, e.g. "regierte 970–931 v. Chr." */
  reignDe?: string;
  reignEn?: string;
  epoch: string;
  /** Human-readable Bible references (work in both languages, link to Bible.com). */
  refs: string[];
  deText: string;
  enText: string;
  // --- optional geo / map link --------------------------------------------
  // Church fathers carry a location + tradition so they appear on the
  // church-history map AND in the time tree from the SAME record (no
  // duplication). Persons with these fields get a "show on map" link.
  lat?: number;
  lon?: number;
  city?: string;
  tradition?: Tradition;
  /** Life-range label for figures shown on the map, e.g. "≈ 296–373". */
  years?: string;
}

export const GENEALOGY: Person[] = [
  // ---------------------------------------------------------------- Urgeschichte
  {
    id: 'adam', de: 'Adam', en: 'Adam', parent: null, line: true,
    spouse: { de: 'Eva', en: 'Eve' }, born: -4004, lifespan: 930, epoch: 'urzeit',
    refs: ['Gen 1:27', 'Gen 5:1-5', 'Lk 3:38'],
    deText: 'Der erste Mensch, von Gott aus Erde geformt; mit Eva Stammeltern der Menschheit. Lebte 930 Jahre.',
    enText: 'The first man, formed by God from the dust; with Eve the parents of all humanity. Lived 930 years.',
  },
  {
    id: 'kain', de: 'Kain', en: 'Cain', parent: 'adam', epoch: 'urzeit',
    born: -3980, refs: ['Gen 4:1-17'],
    deText: 'Ältester Sohn Adams und Evas; Ackerbauer, der seinen Bruder Abel erschlug und ostwärts von Eden zog.',
    enText: 'Firstborn of Adam and Eve; a farmer who killed his brother Abel and settled east of Eden.',
  },
  {
    id: 'abel', de: 'Abel', en: 'Abel', parent: 'adam', epoch: 'urzeit',
    born: -3978, refs: ['Gen 4:2-8', 'Hebr 11:4'],
    deText: 'Zweiter Sohn, ein Hirte; sein Opfer fand Wohlgefallen, er wurde von Kain getötet.',
    enText: 'Second son, a shepherd; his offering was accepted and he was murdered by Cain.',
  },
  {
    id: 'set', de: 'Set', en: 'Seth', parent: 'adam', line: true,
    born: -3874, lifespan: 912, epoch: 'urzeit', refs: ['Gen 4:25-26', 'Gen 5:6-8'],
    deText: 'Dritter Sohn, „an Abels statt" gegeben; über ihn läuft die Linie der Verheißung weiter.',
    enText: 'Third son, given "in place of Abel"; through him the line of promise continues.',
  },
  {
    id: 'enosch', de: 'Enosch', en: 'Enosh', parent: 'set', line: true,
    born: -3769, lifespan: 905, epoch: 'urzeit', refs: ['Gen 5:9-11'],
    deText: 'Sohn Sets; in seinen Tagen „fing man an, den Namen des HERRN anzurufen".',
    enText: 'Son of Seth; in his days people "began to call upon the name of the LORD".',
  },
  {
    id: 'kenan', de: 'Kenan', en: 'Kenan', parent: 'enosch', line: true,
    born: -3679, lifespan: 910, epoch: 'urzeit', refs: ['Gen 5:12-14'],
    deText: 'Sohn Enoschs in der Linie Sets. Lebte 910 Jahre.',
    enText: 'Son of Enosh in the line of Seth. Lived 910 years.',
  },
  {
    id: 'mahalalel', de: 'Mahalalel', en: 'Mahalalel', parent: 'kenan', line: true,
    born: -3609, lifespan: 895, epoch: 'urzeit', refs: ['Gen 5:15-17'],
    deText: 'Vierter Nachkomme Sets. Lebte 895 Jahre.',
    enText: 'Fourth descendant of Seth. Lived 895 years.',
  },
  {
    id: 'jered', de: 'Jered', en: 'Jared', parent: 'mahalalel', line: true,
    born: -3544, lifespan: 962, epoch: 'urzeit', refs: ['Gen 5:18-20'],
    deText: 'Vater Henochs; mit 962 Jahren einer der ältesten Menschen der Bibel.',
    enText: 'Father of Enoch; at 962 years one of the longest-lived people in the Bible.',
  },
  {
    id: 'henoch', de: 'Henoch', en: 'Enoch', parent: 'jered', line: true,
    born: -3382, lifespan: 365, epoch: 'urzeit', refs: ['Gen 5:21-24', 'Hebr 11:5'],
    deText: 'Wandelte mit Gott und „war nicht mehr, denn Gott nahm ihn hinweg" — ohne zu sterben.',
    enText: 'Walked with God and "was not, for God took him" — taken up without dying.',
  },
  {
    id: 'metuschelach', de: 'Metuschelach', en: 'Methuselah', parent: 'henoch', line: true,
    born: -3317, lifespan: 969, epoch: 'urzeit', refs: ['Gen 5:25-27'],
    deText: 'Mit 969 Jahren der älteste genannte Mensch; Großvater Noahs.',
    enText: 'At 969 years the oldest person named in Scripture; grandfather of Noah.',
  },
  {
    id: 'lamech', de: 'Lamech', en: 'Lamech', parent: 'metuschelach', line: true,
    born: -3130, lifespan: 777, epoch: 'urzeit', refs: ['Gen 5:28-31'],
    deText: 'Vater Noahs; hoffte, dass sein Sohn Trost bringe „von unserer Arbeit".',
    enText: "Father of Noah; he hoped his son would bring relief 'from our work'.",
  },
  {
    id: 'noah', de: 'Noah', en: 'Noah', parent: 'lamech', line: true,
    born: -2948, lifespan: 950, epoch: 'urzeit', refs: ['Gen 5:32', 'Gen 6-9'],
    deText: 'Gerecht in seiner Zeit; baute die Arche und überlebte mit seiner Familie die Sintflut. Neuanfang der Menschheit.',
    enText: 'Righteous in his generation; built the ark and survived the Flood with his family. A new beginning for humanity.',
  },

  // ---------------------------------------------------------------- Nach der Flut
  {
    id: 'jafet', de: 'Jafet', en: 'Japheth', parent: 'noah', epoch: 'nachflut',
    born: -2450, refs: ['Gen 10:2-5'],
    deText: 'Sohn Noahs; Stammvater der nördlichen Völker (Gomer, Magog, Jawan u. a.).',
    enText: 'Son of Noah; ancestor of the northern peoples (Gomer, Magog, Javan, …).',
  },
  {
    id: 'ham', de: 'Ham', en: 'Ham', parent: 'noah', epoch: 'nachflut',
    born: -2448, refs: ['Gen 10:6-20'],
    deText: 'Sohn Noahs; Stammvater von Kusch, Mizrajim (Ägypten), Put und Kanaan.',
    enText: 'Son of Noah; ancestor of Cush, Mizraim (Egypt), Put and Canaan.',
  },
  {
    id: 'kusch', de: 'Kusch', en: 'Cush', parent: 'ham', epoch: 'nachflut',
    refs: ['Gen 10:6-8'],
    deText: 'Sohn Hams; Vater Nimrods, Stammvater der kuschitischen Völker.',
    enText: 'Son of Ham; father of Nimrod and ancestor of the Cushite peoples.',
  },
  {
    id: 'nimrod', de: 'Nimrod', en: 'Nimrod', parent: 'kusch', epoch: 'nachflut',
    refs: ['Gen 10:8-12'],
    deText: 'Ein „gewaltiger Jäger"; gründete Babel, Erech und Ninive — erste Großreiche.',
    enText: 'A "mighty hunter"; founded Babel, Erech and Nineveh — the first kingdoms.',
  },
  {
    id: 'mizrajim', de: 'Mizrajim', en: 'Mizraim', parent: 'ham', epoch: 'nachflut',
    refs: ['Gen 10:6,13'],
    deText: 'Sohn Hams; in der Bibel der Stammvater der Ägypter.',
    enText: 'Son of Ham; in Scripture the ancestor of the Egyptians.',
  },
  {
    id: 'kanaan', de: 'Kanaan', en: 'Canaan', parent: 'ham', epoch: 'nachflut',
    refs: ['Gen 10:15-19'],
    deText: 'Sohn Hams; Stammvater der Kanaaniter, Hetiter, Jebusiter u. a.',
    enText: 'Son of Ham; ancestor of the Canaanites, Hittites, Jebusites and others.',
  },
  {
    id: 'sem', de: 'Sem', en: 'Shem', parent: 'noah', line: true,
    born: -2446, lifespan: 600, epoch: 'nachflut', refs: ['Gen 10:21-31', 'Gen 11:10-11'],
    deText: 'Ältester (gesegneter) Sohn Noahs; Stammvater der semitischen Völker und der Linie Abrahams.',
    enText: 'Eldest (blessed) son of Noah; ancestor of the Semitic peoples and of Abraham’s line.',
  },
  {
    id: 'arpachschad', de: 'Arpachschad', en: 'Arphaxad', parent: 'sem', line: true,
    born: -2346, lifespan: 438, epoch: 'nachflut', refs: ['Gen 11:12-13'],
    deText: 'Sohn Sems, zwei Jahre nach der Flut geboren.',
    enText: 'Son of Shem, born two years after the Flood.',
  },
  {
    id: 'schelach', de: 'Schelach', en: 'Shelah', parent: 'arpachschad', line: true,
    born: -2311, lifespan: 433, epoch: 'nachflut', refs: ['Gen 11:14-15'],
    deText: 'Sohn Arpachschads in der Linie Sems.',
    enText: 'Son of Arphaxad in the line of Shem.',
  },
  {
    id: 'eber', de: 'Eber', en: 'Eber', parent: 'schelach', line: true,
    born: -2281, lifespan: 464, epoch: 'nachflut', refs: ['Gen 11:16-17'],
    deText: 'Namensgeber der „Hebräer"; in seinen Tagen wurde die Erde geteilt.',
    enText: 'The namesake of the "Hebrews"; in his days the earth was divided.',
  },
  {
    id: 'peleg', de: 'Peleg', en: 'Peleg', parent: 'eber', line: true,
    born: -2247, lifespan: 239, epoch: 'nachflut', refs: ['Gen 11:18-19'],
    deText: 'Sein Name bedeutet „Teilung", denn „in seinen Tagen wurde die Erde geteilt".',
    enText: 'His name means "division", for "in his days the earth was divided".',
  },
  {
    id: 'regu', de: 'Regu', en: 'Reu', parent: 'peleg', line: true,
    born: -2217, lifespan: 239, epoch: 'nachflut', refs: ['Gen 11:20-21'],
    deText: 'Sohn Pelegs in der Linie nach Abraham.',
    enText: 'Son of Peleg in the line toward Abraham.',
  },
  {
    id: 'serug', de: 'Serug', en: 'Serug', parent: 'regu', line: true,
    born: -2185, lifespan: 230, epoch: 'nachflut', refs: ['Gen 11:22-23'],
    deText: 'Urgroßvater Abrahams.',
    enText: "Great-grandfather of Abraham.",
  },
  {
    id: 'nahor1', de: 'Nahor', en: 'Nahor', parent: 'serug', line: true,
    born: -2155, lifespan: 148, epoch: 'nachflut', refs: ['Gen 11:24-25'],
    deText: 'Großvater Abrahams; lebte deutlich kürzer als seine Vorfahren.',
    enText: 'Grandfather of Abraham; lived markedly shorter than his forefathers.',
  },
  {
    id: 'terach', de: 'Terach', en: 'Terah', parent: 'nahor1', line: true,
    born: -2126, lifespan: 205, epoch: 'nachflut', refs: ['Gen 11:26-32'],
    deText: 'Vater Abrahams, Nahors und Harans; zog von Ur auf nach Haran.',
    enText: 'Father of Abraham, Nahor and Haran; set out from Ur and settled in Haran.',
  },
  {
    id: 'haran', de: 'Haran', en: 'Haran', parent: 'terach', epoch: 'nachflut',
    refs: ['Gen 11:27-31'],
    deText: 'Bruder Abrahams; Vater Lots, starb früh in Ur.',
    enText: 'Brother of Abraham; father of Lot, died young in Ur.',
  },
  {
    id: 'lot', de: 'Lot', en: 'Lot', parent: 'haran', epoch: 'patriarchen',
    refs: ['Gen 13', 'Gen 19'],
    deText: 'Neffe Abrahams; ließ sich bei Sodom nieder und entkam dessen Untergang.',
    enText: "Abraham's nephew; settled near Sodom and escaped its destruction.",
  },
  {
    id: 'nahor2', de: 'Nahor', en: 'Nahor', parent: 'terach', epoch: 'nachflut',
    refs: ['Gen 22:20-23'],
    deText: 'Bruder Abrahams; Großvater Rebekkas, der Frau Isaaks.',
    enText: 'Brother of Abraham; grandfather of Rebekah, the wife of Isaac.',
  },

  // ---------------------------------------------------------------- Erzväter
  {
    id: 'abraham', de: 'Abraham', en: 'Abraham', parent: 'terach', line: true,
    spouse: { de: 'Sara', en: 'Sarah' }, born: -1996, lifespan: 175, epoch: 'patriarchen',
    refs: ['Gen 12', 'Gen 15', 'Gen 17', 'Gen 22'],
    deText: 'Aus Ur berufen; ihm gilt der Bund und die Verheißung, dass in ihm „alle Geschlechter gesegnet" werden. Vater des Glaubens.',
    enText: 'Called out of Ur; recipient of the covenant and the promise that in him "all families will be blessed". Father of faith.',
  },
  {
    id: 'ismael', de: 'Ismael', en: 'Ishmael', parent: 'abraham', epoch: 'patriarchen',
    born: -1910, refs: ['Gen 16', 'Gen 21:8-21'],
    deText: 'Sohn Abrahams mit der Magd Hagar; Stammvater von zwölf Fürsten, traditionell der Araber.',
    enText: "Abraham's son by Hagar; ancestor of twelve princes, traditionally of the Arab peoples.",
  },
  {
    id: 'isaak', de: 'Isaak', en: 'Isaac', parent: 'abraham', line: true,
    spouse: { de: 'Rebekka', en: 'Rebekah' }, born: -1896, lifespan: 180, epoch: 'patriarchen',
    refs: ['Gen 21', 'Gen 24', 'Gen 26'],
    deText: 'Der verheißene Sohn Saras; Träger des Bundes, beinahe geopfert auf dem Berg Morija.',
    enText: 'The promised son of Sarah; bearer of the covenant, almost offered on Mount Moriah.',
  },
  {
    id: 'esau', de: 'Esau', en: 'Esau', parent: 'isaak', epoch: 'patriarchen',
    born: -1836, refs: ['Gen 25:24-34', 'Gen 36'],
    deText: 'Zwillingsbruder Jakobs; verkaufte sein Erstgeburtsrecht und wurde Stammvater Edoms.',
    enText: "Jacob's twin; sold his birthright and became the ancestor of Edom.",
  },
  {
    id: 'jakob', de: 'Jakob (Israel)', en: 'Jacob (Israel)', parent: 'isaak', line: true,
    spouse: { de: 'Lea & Rahel', en: 'Leah & Rachel' }, born: -1836, lifespan: 147, epoch: 'patriarchen',
    refs: ['Gen 27-35', 'Gen 49'],
    deText: 'Erhielt den Namen „Israel"; Vater der zwölf Stämme. Über seinen Sohn Juda läuft die königliche Linie.',
    enText: 'Renamed "Israel"; father of the twelve tribes. The royal line runs through his son Judah.',
  },

  // ---------------------------------------------------------------- 12 Söhne Jakobs
  { id: 'ruben', de: 'Ruben', en: 'Reuben', parent: 'jakob', epoch: 'patriarchen', refs: ['Gen 29:32', 'Gen 49:3-4'],
    deText: 'Erstgeborener Jakobs und Leas; verlor den Erstgeburtssegen.', enText: 'Firstborn of Jacob and Leah; forfeited the birthright blessing.' },
  { id: 'simeon', de: 'Simeon', en: 'Simeon', parent: 'jakob', epoch: 'patriarchen', refs: ['Gen 29:33', 'Gen 34'],
    deText: 'Zweiter Sohn Leas; Stammvater des Stammes Simeon.', enText: 'Second son of Leah; ancestor of the tribe of Simeon.' },
  { id: 'levi', de: 'Levi', en: 'Levi', parent: 'jakob', epoch: 'patriarchen', refs: ['Gen 29:34', 'Ex 6:16-20'],
    deText: 'Dritter Sohn Leas; Stammvater der Priester und Leviten — über ihn kommen Mose und Aaron.', enText: 'Third son of Leah; ancestor of the priests and Levites — Moses and Aaron descend from him.' },
  { id: 'juda', de: 'Juda', en: 'Judah', parent: 'jakob', line: true, spouse: { de: 'Tamar', en: 'Tamar' }, born: -1753, epoch: 'patriarchen', refs: ['Gen 29:35', 'Gen 49:8-10'],
    deText: 'Vierter Sohn Leas; ihm gilt die Verheißung des Zepters — die königliche und messianische Linie.', enText: 'Fourth son of Leah; recipient of the promise of the scepter — the royal and messianic line.' },
  { id: 'dan', de: 'Dan', en: 'Dan', parent: 'jakob', epoch: 'patriarchen', refs: ['Gen 30:6'],
    deText: 'Sohn Jakobs mit Bilha, der Magd Rahels.', enText: "Jacob's son by Bilhah, Rachel's maidservant." },
  { id: 'naftali', de: 'Naftali', en: 'Naphtali', parent: 'jakob', epoch: 'patriarchen', refs: ['Gen 30:8'],
    deText: 'Zweiter Sohn mit Bilha; Stammvater Naftalis.', enText: "Second son by Bilhah; ancestor of Naphtali." },
  { id: 'gad', de: 'Gad', en: 'Gad', parent: 'jakob', epoch: 'patriarchen', refs: ['Gen 30:11'],
    deText: 'Sohn Jakobs mit Silpa, der Magd Leas.', enText: "Jacob's son by Zilpah, Leah's maidservant." },
  { id: 'ascher', de: 'Ascher', en: 'Asher', parent: 'jakob', epoch: 'patriarchen', refs: ['Gen 30:13'],
    deText: 'Zweiter Sohn mit Silpa; sein Erbteil war reich an Öl.', enText: 'Second son by Zilpah; his territory was rich in oil.' },
  { id: 'issachar', de: 'Issachar', en: 'Issachar', parent: 'jakob', epoch: 'patriarchen', refs: ['Gen 30:18'],
    deText: 'Fünfter Sohn Leas.', enText: 'Fifth son of Leah.' },
  { id: 'sebulon', de: 'Sebulon', en: 'Zebulun', parent: 'jakob', epoch: 'patriarchen', refs: ['Gen 30:20'],
    deText: 'Sechster Sohn Leas; sein Gebiet lag Richtung Meer.', enText: 'Sixth son of Leah; his territory faced the sea.' },
  { id: 'josef', de: 'Josef', en: 'Joseph', parent: 'jakob', born: -1745, lifespan: 110, epoch: 'aegypten', refs: ['Gen 37', 'Gen 39-50'],
    deText: 'Lieblingssohn Rahels; nach Ägypten verkauft, dort zum Vizekönig erhöht und Retter der Familie.', enText: "Rachel's favored son; sold into Egypt, raised to vizier and saviour of his family." },
  { id: 'benjamin', de: 'Benjamin', en: 'Benjamin', parent: 'jakob', epoch: 'patriarchen', refs: ['Gen 35:16-18'],
    deText: 'Jüngster Sohn; Rahel starb bei seiner Geburt. Stamm des Königs Saul und des Paulus.', enText: "Youngest son; Rachel died giving him birth. Tribe of King Saul and of Paul." },

  // Josef → Ephraim & Manasse
  { id: 'manasse', de: 'Manasse', en: 'Manasseh', parent: 'josef', epoch: 'aegypten', refs: ['Gen 41:51', 'Gen 48'],
    deText: 'Erstgeborener Josefs; Stammvater eines halben Stammes Israels.', enText: "Joseph's firstborn; ancestor of a half-tribe of Israel." },
  { id: 'ephraim', de: 'Ephraim', en: 'Ephraim', parent: 'josef', epoch: 'aegypten', refs: ['Gen 41:52', 'Gen 48:14-20'],
    deText: 'Zweiter Sohn Josefs, von Jakob über Manasse gesegnet; führender Nordstamm.', enText: "Joseph's second son, blessed by Jacob above Manasseh; a leading northern tribe." },

  // Levi → Mose, Aaron, Mirjam
  { id: 'kehat', de: 'Kehat', en: 'Kohath', parent: 'levi', epoch: 'aegypten', refs: ['Ex 6:16-18'],
    deText: 'Sohn Levis; Großvater Moses, Aarons und Mirjams.', enText: 'Son of Levi; grandfather of Moses, Aaron and Miriam.' },
  { id: 'amram', de: 'Amram', en: 'Amram', parent: 'kehat', epoch: 'aegypten', spouse: { de: 'Jochebed', en: 'Jochebed' }, refs: ['Ex 6:18-20'],
    deText: 'Sohn Kehats; mit Jochebed Vater von Mose, Aaron und Mirjam.', enText: 'Son of Kohath; with Jochebed the father of Moses, Aaron and Miriam.' },
  { id: 'mirjam', de: 'Mirjam', en: 'Miriam', parent: 'amram', epoch: 'aegypten', refs: ['Ex 2:4-8', 'Ex 15:20-21'],
    deText: 'Schwester Moses und Aarons; Prophetin, die am Schilfmeer den Lobgesang anstimmte.', enText: 'Sister of Moses and Aaron; a prophetess who led the song at the Red Sea.' },
  { id: 'aaron', de: 'Aaron', en: 'Aaron', parent: 'amram', epoch: 'aegypten', born: -1529, refs: ['Ex 4:14', 'Ex 28', 'Lev 8'],
    deText: 'Älterer Bruder Moses; erster Hoherpriester Israels.', enText: "Moses' elder brother; the first high priest of Israel." },
  { id: 'mose', de: 'Mose', en: 'Moses', parent: 'amram', born: -1526, lifespan: 120, epoch: 'aegypten', refs: ['Ex 2-3', 'Ex 14', 'Dtn 34'],
    deText: 'Führte Israel aus Ägypten, empfing am Sinai das Gesetz und brachte das Volk an den Rand des verheißenen Landes.', enText: 'Led Israel out of Egypt, received the Law at Sinai and brought the people to the edge of the promised land.' },

  // ---------------------------------------------------------------- Juda → David (Rut 4 / 1Chr 2)
  { id: 'perez', de: 'Perez', en: 'Perez', parent: 'juda', line: true, born: -1715, epoch: 'aegypten', refs: ['Gen 38:29', 'Rut 4:18', '1Chr 2:4-5'],
    deText: 'Sohn Judas und Tamars; Kopf der Familie, aus der David hervorgeht.', enText: 'Son of Judah and Tamar; head of the clan from which David comes.' },
  { id: 'hezron', de: 'Hezron', en: 'Hezron', parent: 'perez', line: true, born: -1680, epoch: 'aegypten', refs: ['Rut 4:18', '1Chr 2:5'],
    deText: 'Sohn des Perez; zog mit Jakobs Haus nach Ägypten.', enText: "Son of Perez; went down to Egypt with Jacob's household." },
  { id: 'ram', de: 'Ram', en: 'Ram', parent: 'hezron', line: true, born: -1650, epoch: 'aegypten', refs: ['Rut 4:19', '1Chr 2:9-10'],
    deText: 'Sohn Hezrons in der Linie nach David.', enText: 'Son of Hezron in the line toward David.' },
  { id: 'amminadab', de: 'Amminadab', en: 'Amminadab', parent: 'ram', line: true, born: -1610, epoch: 'aegypten', refs: ['Rut 4:19-20', 'Num 1:7'],
    deText: 'Schwiegervater Aarons; sein Sohn Nachschon führte den Stamm Juda.', enText: "Father-in-law of Aaron; his son Nahshon led the tribe of Judah." },
  { id: 'nachschon', de: 'Nachschon', en: 'Nahshon', parent: 'amminadab', line: true, born: -1500, epoch: 'aegypten', refs: ['Num 1:7', 'Num 2:3', 'Rut 4:20'],
    deText: 'Fürst Judas in der Wüste; trug das Banner an der Spitze des Volkes.', enText: 'Prince of Judah in the wilderness; led the people at the head of the camp.' },
  { id: 'salmon', de: 'Salmon', en: 'Salmon', parent: 'nachschon', line: true, born: -1440, epoch: 'richter', spouse: { de: 'Rahab', en: 'Rahab' }, refs: ['Rut 4:20-21', 'Mt 1:5'],
    deText: 'Nach jüdischer Überlieferung Mann der Rahab von Jericho; Vater des Boas.', enText: 'By tradition the husband of Rahab of Jericho; father of Boaz.' },
  { id: 'boas', de: 'Boas', en: 'Boaz', parent: 'salmon', line: true, born: -1150, epoch: 'richter', spouse: { de: 'Rut', en: 'Ruth' }, refs: ['Rut 2-4', '1Chr 2:11-12'],
    deText: 'Wohlhabender Bauer in Bethlehem; löste die Moabiterin Rut aus und heiratete sie.', enText: 'A prosperous man of Bethlehem; redeemed and married Ruth the Moabitess.' },
  { id: 'obed', de: 'Obed', en: 'Obed', parent: 'boas', line: true, born: -1115, epoch: 'richter', refs: ['Rut 4:17,21-22'],
    deText: 'Sohn von Boas und Rut; Großvater des Königs David.', enText: 'Son of Boaz and Ruth; grandfather of King David.' },
  { id: 'isai', de: 'Isai', en: 'Jesse', parent: 'obed', line: true, born: -1080, epoch: 'richter', refs: ['1Sam 16', 'Jes 11:1'],
    deText: 'Vater von acht Söhnen in Bethlehem; aus seinem „Wurzelstock" sollte der Messias kommen.', enText: 'Father of eight sons in Bethlehem; from his "stump" the Messiah would come.' },

  // ---------------------------------------------------------------- Könige
  { id: 'david', de: 'David', en: 'David', parent: 'isai', line: true, born: -1040, lifespan: 70, epoch: 'koenigtum', spouse: { de: 'Batseba', en: 'Bathsheba' }, reignDe: 'regierte ≈ 1010–970 v. Chr.', reignEn: 'reigned ≈ 1010–970 BC', refs: ['1Sam 16-17', '2Sam 7', 'Ps 23'],
    deText: 'Hirte, Psalmdichter und König; ihm wird ein ewiger Thron verheißen — der „Sohn Davids" ist der Messias.', enText: 'Shepherd, psalmist and king; promised an everlasting throne — the "Son of David" is the Messiah.' },
  { id: 'natan', de: 'Natan (Sohn Davids)', en: 'Nathan (son of David)', parent: 'david', epoch: 'koenigtum', refs: ['Lk 3:31', '2Sam 5:14'],
    deText: 'Sohn Davids; über ihn führt das Lukas-Evangelium die Abstammung Jesu (Linie Marias).', enText: "Son of David; through him Luke's Gospel traces Jesus' descent (Mary's line)." },
  { id: 'salomo', de: 'Salomo', en: 'Solomon', parent: 'david', line: true, born: -1010, epoch: 'koenigtum', reignDe: 'regierte ≈ 970–931 v. Chr.', reignEn: 'reigned ≈ 970–931 BC', refs: ['1Kön 3', '1Kön 6-8', 'Spr 1:1'],
    deText: 'Sohn Davids und Batsebas; erbat Weisheit und baute den Tempel in Jerusalem.', enText: 'Son of David and Bathsheba; asked for wisdom and built the Temple in Jerusalem.' },
  { id: 'rehabeam', de: 'Rehabeam', en: 'Rehoboam', parent: 'salomo', line: true, born: -972, epoch: 'koenige', reignDe: 'regierte ≈ 931–913 v. Chr.', reignEn: 'reigned ≈ 931–913 BC', refs: ['1Kön 12', '2Chr 10'],
    deText: 'Unter ihm zerbrach das Reich; ihm blieb das Südreich Juda.', enText: 'Under him the kingdom split; the southern kingdom of Judah remained his.' },
  { id: 'abija', de: 'Abija', en: 'Abijah', parent: 'rehabeam', line: true, born: -955, epoch: 'koenige', reignDe: 'regierte ≈ 913–911 v. Chr.', reignEn: 'reigned ≈ 913–911 BC', refs: ['1Kön 15:1-8', '2Chr 13'],
    deText: 'König von Juda; siegte über das Nordreich Israel.', enText: 'King of Judah; victorious over the northern kingdom.' },
  { id: 'asa', de: 'Asa', en: 'Asa', parent: 'abija', line: true, born: -940, epoch: 'koenige', reignDe: 'regierte ≈ 911–870 v. Chr.', reignEn: 'reigned ≈ 911–870 BC', refs: ['1Kön 15:9-24', '2Chr 14-16'],
    deText: 'Frommer Reformkönig, der den Götzendienst aus Juda entfernte.', enText: 'A devout reforming king who removed idolatry from Judah.' },
  { id: 'joschafat', de: 'Joschafat', en: 'Jehoshaphat', parent: 'asa', line: true, born: -908, epoch: 'koenige', reignDe: 'regierte ≈ 870–848 v. Chr.', reignEn: 'reigned ≈ 870–848 BC', refs: ['1Kön 22', '2Chr 17-20'],
    deText: 'Gottesfürchtiger König; sandte Lehrer mit dem Gesetz durchs Land.', enText: 'A God-fearing king; sent teachers with the Law throughout the land.' },
  { id: 'joram', de: 'Joram', en: 'Jehoram', parent: 'joschafat', line: true, born: -882, epoch: 'koenige', reignDe: 'regierte ≈ 848–841 v. Chr.', reignEn: 'reigned ≈ 848–841 BC', refs: ['2Kön 8:16-24', '2Chr 21'],
    deText: 'Heiratete Atalja vom Haus Ahab und folgte deren Götzendienst.', enText: 'Married Athaliah of the house of Ahab and followed their idolatry.' },
  { id: 'ahasja', de: 'Ahasja', en: 'Ahaziah', parent: 'joram', line: true, born: -862, epoch: 'koenige', reignDe: 'regierte ≈ 841 v. Chr.', reignEn: 'reigned ≈ 841 BC', refs: ['2Kön 8:25-29', '2Chr 22:1-9'],
    deText: 'Regierte nur ein Jahr; in Matthäus 1 unter den ausgelassenen Königen.', enText: 'Reigned only a year; among the kings omitted in Matthew 1.' },
  { id: 'joasch', de: 'Joasch', en: 'Joash', parent: 'ahasja', line: true, born: -843, epoch: 'koenige', reignDe: 'regierte ≈ 835–796 v. Chr.', reignEn: 'reigned ≈ 835–796 BC', refs: ['2Kön 11-12', '2Chr 24'],
    deText: 'Als Kind vor Atalja gerettet; ließ den Tempel ausbessern.', enText: 'Rescued as a child from Athaliah; repaired the Temple.' },
  { id: 'amazja', de: 'Amazja', en: 'Amaziah', parent: 'joasch', line: true, born: -825, epoch: 'koenige', reignDe: 'regierte ≈ 796–767 v. Chr.', reignEn: 'reigned ≈ 796–767 BC', refs: ['2Kön 14:1-20', '2Chr 25'],
    deText: 'König von Juda; siegte über Edom, verlor aber gegen Israel.', enText: 'King of Judah; defeated Edom but lost to Israel.' },
  { id: 'usija', de: 'Usija (Asarja)', en: 'Uzziah (Azariah)', parent: 'amazja', line: true, born: -808, epoch: 'koenige', reignDe: 'regierte ≈ 792–740 v. Chr.', reignEn: 'reigned ≈ 792–740 BC', refs: ['2Kön 15:1-7', '2Chr 26', 'Jes 6:1'],
    deText: 'Langer, blühender Herrscher; wurde aussätzig, weil er sich am Tempeldienst vergriff.', enText: 'A long, prosperous reign; struck with leprosy for usurping the priestly office.' },
  { id: 'jotam', de: 'Jotam', en: 'Jotham', parent: 'usija', line: true, born: -752, epoch: 'koenige', reignDe: 'regierte ≈ 750–735 v. Chr.', reignEn: 'reigned ≈ 750–735 BC', refs: ['2Kön 15:32-38', '2Chr 27'],
    deText: 'Tat, was recht war; baute am Tempel und an den Festungen.', enText: 'Did what was right; built up the Temple and the fortifications.' },
  { id: 'ahas', de: 'Ahas', en: 'Ahaz', parent: 'jotam', line: true, born: -735, epoch: 'koenige', reignDe: 'regierte ≈ 735–715 v. Chr.', reignEn: 'reigned ≈ 735–715 BC', refs: ['2Kön 16', '2Chr 28', 'Jes 7'],
    deText: 'Götzendiener; ihm gilt Jesajas Zeichen vom „Immanuel".', enText: "An idolater; to him Isaiah gave the sign of 'Immanuel'." },
  { id: 'hiskia', de: 'Hiskia', en: 'Hezekiah', parent: 'ahas', line: true, born: -715, epoch: 'koenige', reignDe: 'regierte ≈ 715–686 v. Chr.', reignEn: 'reigned ≈ 715–686 BC', refs: ['2Kön 18-20', '2Chr 29-32', 'Jes 36-39'],
    deText: 'Großer Reformkönig; vertraute Gott, als Jerusalem von Assyrien belagert wurde.', enText: 'A great reforming king; trusted God when Jerusalem was besieged by Assyria.' },
  { id: 'manasse_k', de: 'Manasse', en: 'Manasseh', parent: 'hiskia', line: true, born: -709, epoch: 'koenige', reignDe: 'regierte ≈ 697–642 v. Chr.', reignEn: 'reigned ≈ 697–642 BC', refs: ['2Kön 21:1-18', '2Chr 33'],
    deText: 'Längste Regierung Judas; zunächst grausamer Götzendiener, später reuig.', enText: "Judah's longest reign; first a cruel idolater, later repentant." },
  { id: 'amon', de: 'Amon', en: 'Amon', parent: 'manasse_k', line: true, born: -664, epoch: 'koenige', reignDe: 'regierte ≈ 642–640 v. Chr.', reignEn: 'reigned ≈ 642–640 BC', refs: ['2Kön 21:19-26', '2Chr 33:21-25'],
    deText: 'Setzte den Götzendienst fort und wurde von seinen Dienern ermordet.', enText: 'Continued the idolatry and was assassinated by his servants.' },
  { id: 'joschija', de: 'Joschija', en: 'Josiah', parent: 'amon', line: true, born: -648, epoch: 'koenige', reignDe: 'regierte ≈ 640–609 v. Chr.', reignEn: 'reigned ≈ 640–609 BC', refs: ['2Kön 22-23', '2Chr 34-35'],
    deText: 'Letzter großer Reformkönig; fand das Gesetzbuch und erneuerte den Bund.', enText: 'The last great reforming king; found the Book of the Law and renewed the covenant.' },
  { id: 'jojakim', de: 'Jojakim', en: 'Jehoiakim', parent: 'joschija', line: true, born: -635, epoch: 'koenige', reignDe: 'regierte ≈ 609–598 v. Chr.', reignEn: 'reigned ≈ 609–598 BC', refs: ['2Kön 23:34-24:6', '2Chr 36:5-8', 'Jer 36'],
    deText: 'Vasall Babylons; verbrannte die Schriftrolle des Propheten Jeremia.', enText: "A vassal of Babylon; burned the scroll of the prophet Jeremiah." },
  { id: 'jojachin', de: 'Jojachin (Jechonja)', en: 'Jehoiachin (Jeconiah)', parent: 'jojakim', line: true, born: -616, epoch: 'exil', reignDe: 'regierte ≈ 598–597 v. Chr.', reignEn: 'reigned ≈ 598–597 BC', refs: ['2Kön 24:8-17', 'Mt 1:11-12', 'Jer 22:24-30'],
    deText: 'Wurde nach Babylon weggeführt; mit ihm beginnt das Exil der Davidslinie.', enText: 'Carried off to Babylon; with him the exile of the Davidic line begins.' },

  // ---------------------------------------------------------------- Exil, Rückkehr, Zweiter Tempel
  { id: 'schealtiel', de: 'Schealtiël', en: 'Shealtiel', parent: 'jojachin', line: true, born: -598, epoch: 'exil', refs: ['Mt 1:12', '1Chr 3:17', 'Esra 3:2'],
    deText: 'Im babylonischen Exil geborener Nachkomme Davids.', enText: 'A descendant of David born in the Babylonian exile.' },
  { id: 'serubbabel', de: 'Serubbabel', en: 'Zerubbabel', parent: 'schealtiel', line: true, born: -566, epoch: 'ruckkehr', refs: ['Esra 3', 'Hag 2', 'Mt 1:12-13'],
    deText: 'Führte die erste Rückkehr aus dem Exil und begann den Wiederaufbau des Tempels.', enText: 'Led the first return from exile and began rebuilding the Temple.' },
  { id: 'abihud', de: 'Abihud', en: 'Abiud', parent: 'serubbabel', line: true, born: -515, epoch: 'zweitertempel', refs: ['Mt 1:13'],
    deText: 'Nachkomme Serubbabels in der Linie Josefs (Matthäus 1).', enText: "Descendant of Zerubbabel in Joseph's line (Matthew 1)." },
  { id: 'eljakim', de: 'Eljakim', en: 'Eliakim', parent: 'abihud', line: true, born: -460, epoch: 'zweitertempel', refs: ['Mt 1:13'],
    deText: 'Glied der Geschlechterliste des Matthäus.', enText: "A link in Matthew's genealogy." },
  { id: 'asor', de: 'Asor', en: 'Azor', parent: 'eljakim', line: true, born: -405, epoch: 'zweitertempel', refs: ['Mt 1:13-14'],
    deText: 'Glied der Geschlechterliste des Matthäus.', enText: "A link in Matthew's genealogy." },
  { id: 'zadok', de: 'Zadok', en: 'Zadok', parent: 'asor', line: true, born: -350, epoch: 'zweitertempel', refs: ['Mt 1:14'],
    deText: 'Glied der Geschlechterliste des Matthäus.', enText: "A link in Matthew's genealogy." },
  { id: 'achim', de: 'Achim', en: 'Achim', parent: 'zadok', line: true, born: -300, epoch: 'zweitertempel', refs: ['Mt 1:14'],
    deText: 'Glied der Geschlechterliste des Matthäus.', enText: "A link in Matthew's genealogy." },
  { id: 'eliud', de: 'Eliud', en: 'Eliud', parent: 'achim', line: true, born: -250, epoch: 'zweitertempel', refs: ['Mt 1:14-15'],
    deText: 'Glied der Geschlechterliste des Matthäus.', enText: "A link in Matthew's genealogy." },
  { id: 'eleasar', de: 'Eleasar', en: 'Eleazar', parent: 'eliud', line: true, born: -190, epoch: 'zweitertempel', refs: ['Mt 1:15'],
    deText: 'Glied der Geschlechterliste des Matthäus.', enText: "A link in Matthew's genealogy." },
  { id: 'mattan', de: 'Mattan', en: 'Matthan', parent: 'eleasar', line: true, born: -120, epoch: 'zweitertempel', refs: ['Mt 1:15'],
    deText: 'Großvater Josefs, des Mannes Marias.', enText: "Grandfather of Joseph, the husband of Mary." },
  { id: 'jakob2', de: 'Jakob (Vater Josefs)', en: 'Jacob (father of Joseph)', parent: 'mattan', line: true, born: -60, epoch: 'zweitertempel', refs: ['Mt 1:15-16'],
    deText: 'Vater Josefs nach der Liste des Matthäus.', enText: "Father of Joseph according to Matthew's list." },

  // ---------------------------------------------------------------- Messias
  { id: 'josef_nt', de: 'Josef von Nazaret', en: 'Joseph of Nazareth', parent: 'jakob2', line: true, born: -25, epoch: 'messias', spouse: { de: 'Maria', en: 'Mary' }, refs: ['Mt 1:16-25', 'Lk 2', 'Mt 13:55'],
    deText: 'Zimmermann in Nazaret; gesetzlicher Vater Jesu, durch den der Davidsanspruch übergeht.', enText: 'A carpenter in Nazareth; the legal father of Jesus, through whom the Davidic claim passes.' },
  { id: 'jesus', de: 'Jesus Christus', en: 'Jesus Christ', parent: 'josef_nt', line: true, born: -4, epoch: 'messias', refs: ['Mt 1:1,16', 'Lk 3:23-38', 'Lk 1:31-33'],
    deText: 'Geboren in Bethlehem aus Maria; „Sohn Davids, Sohn Abrahams". In ihm laufen alle Geschlechter zusammen — das Ziel des Stammbaums.', enText: 'Born in Bethlehem of Mary; "Son of David, Son of Abraham". In him all the generations converge — the goal of the genealogy.' },

  // ================================================================
  // Glaubenszeugen / Kirchengeschichte (nach Jesus).
  // Keine Blutlinie mehr, sondern eine geistlich-historische Nachfolge:
  // christliche und jüdische Persönlichkeiten, die Glauben und Geschichte
  // bis in die Neuzeit geprägt haben (gestrichelte Linien im Baum).
  // ================================================================

  // ---------------------------------------------------------------- Apostolische Zeit
  { id: 'paulus', de: 'Paulus von Tarsus', en: 'Paul of Tarsus', parent: 'jesus', line: true, faith: true, born: 5, epoch: 'urkirche', refs: ['Apg 9', 'Röm 1', 'Gal 1'],
    deText: 'Vom Christenverfolger zum „Apostel der Heiden"; trug das Evangelium ins Römische Reich und schrieb große Teile des Neuen Testaments.', enText: 'From persecutor to "apostle to the Gentiles"; carried the gospel across the Roman world and wrote much of the New Testament.' },
  { id: 'petrus', de: 'Petrus', en: 'Peter', parent: 'jesus', faith: true, born: 1, epoch: 'urkirche', refs: ['Mt 16:16-18', 'Apg 2', '1Petr 1'],
    deText: 'Fischer und führender Apostel; predigte zu Pfingsten und gilt als Säule der jungen Gemeinde.', enText: 'Fisherman and leading apostle; preached at Pentecost and a pillar of the early church.' },
  { id: 'johannes_ev', de: 'Johannes (Apostel)', en: 'John the Apostle', parent: 'jesus', faith: true, born: 6, epoch: 'urkirche', refs: ['Joh 21', '1Joh 1', 'Offb 1'],
    deText: '„Der Jünger, den Jesus liebte"; ihm werden Evangelium, Briefe und die Offenbarung zugeschrieben.', enText: '"The disciple whom Jesus loved"; traditionally author of a Gospel, letters and Revelation.' },

  // ---------------------------------------------------------------- Kirchenväter
  { id: 'polykarp', de: 'Polykarp von Smyrna', en: 'Polycarp of Smyrna', parent: 'paulus', line: true, faith: true, born: 69, epoch: 'kirchenvater', refs: [],
    city: 'Smyrna', lat: 38.42, lon: 27.14, tradition: 'east', years: '≈ 69–155',
    deText: 'Schüler des Apostels Johannes, Bischof von Smyrna; starb als Märtyrer für seinen Glauben.', enText: 'A disciple of the apostle John, bishop of Smyrna; died a martyr for his faith.' },
  { id: 'justin', de: 'Justin der Märtyrer', en: 'Justin Martyr', parent: 'polykarp', line: true, faith: true, born: 100, epoch: 'kirchenvater', refs: [],
    deText: 'Philosoph, der zum Christen wurde; verteidigte den Glauben vor den Gebildeten seiner Zeit.', enText: 'A philosopher turned Christian; defended the faith before the learned of his day.' },
  { id: 'irenaeus', de: 'Irenäus von Lyon', en: 'Irenaeus of Lyon', parent: 'justin', line: true, faith: true, born: 130, epoch: 'kirchenvater', refs: [],
    city: 'Lyon', lat: 45.76, lon: 4.83, tradition: 'west', years: '≈ 130–202',
    deText: 'Bischof und Theologe; betonte die Einheit der Schrift gegen die Gnosis.', enText: 'Bishop and theologian; upheld the unity of Scripture against gnosticism.' },
  { id: 'origenes', de: 'Origenes', en: 'Origen', parent: 'irenaeus', faith: true, born: 184, epoch: 'kirchenvater', refs: [],
    city: 'Alexandria', lat: 31.2, lon: 29.92, tradition: 'east', years: '≈ 184–253',
    deText: 'Gelehrter aus Alexandria; einer der ersten großen Bibelausleger.', enText: 'A scholar of Alexandria; one of the first great interpreters of the Bible.' },
  { id: 'athanasius', de: 'Athanasius', en: 'Athanasius', parent: 'irenaeus', line: true, faith: true, born: 296, epoch: 'kirchenvater', refs: [],
    city: 'Alexandria', lat: 31.2, lon: 29.92, tradition: 'east', years: '≈ 296–373',
    deText: 'Bischof von Alexandria; verteidigte die Gottheit Christi und half, den Bibelkanon zu klären.', enText: 'Bishop of Alexandria; defended the deity of Christ and helped settle the biblical canon.' },
  { id: 'hieronymus', de: 'Hieronymus', en: 'Jerome', parent: 'athanasius', faith: true, born: 347, epoch: 'kirchenvater', refs: [],
    city: 'Betlehem', lat: 31.7, lon: 35.2, tradition: 'west', years: '≈ 347–420',
    deText: 'Übersetzte die Bibel ins Lateinische (Vulgata) — über tausend Jahre die Bibel des Abendlandes.', enText: 'Translated the Bible into Latin (the Vulgate) — the Bible of the West for over a thousand years.' },
  { id: 'augustinus', de: 'Augustinus von Hippo', en: 'Augustine of Hippo', parent: 'athanasius', line: true, faith: true, born: 354, epoch: 'kirchenvater', refs: [],
    city: 'Hippo', lat: 36.88, lon: 7.75, tradition: 'west', years: '354–430',
    deText: 'Bischof und einflussreichster Theologe der Alten Kirche; schrieb „Bekenntnisse" und „Gottesstaat".', enText: 'Bishop and most influential theologian of the early church; wrote the "Confessions" and "City of God".' },
  // --- weitere Kirchenväter (erscheinen im Baum UND auf der Kirchengeschichte-Karte) ---
  { id: 'clemens', de: 'Clemens von Rom', en: 'Clement of Rome', parent: 'petrus', faith: true, born: 35, epoch: 'urkirche', refs: [],
    city: 'Rom', lat: 41.89, lon: 12.49, tradition: 'west', years: '≈ 35–99',
    deText: 'Früher Bischof von Rom; sein Brief (1. Clemens) an die Gemeinde in Korinth ist erhalten.', enText: 'An early bishop of Rome; his letter (1 Clement) to the church in Corinth survives.' },
  { id: 'ignatius', de: 'Ignatius von Antiochia', en: 'Ignatius of Antioch', parent: 'paulus', faith: true, born: 35, epoch: 'urkirche', refs: [],
    city: 'Antiochia', lat: 36.2, lon: 36.16, tradition: 'east', years: '≈ 35–108',
    deText: 'Märtyrerbischof; seine Briefe prägen das frühe Kirchen- und Bischofsamt.', enText: 'A martyr-bishop whose letters shaped early church and episcopal order.' },
  { id: 'tertullian', de: 'Tertullian', en: 'Tertullian', parent: 'irenaeus', faith: true, born: 155, epoch: 'kirchenvater', refs: [],
    city: 'Karthago', lat: 36.85, lon: 10.32, tradition: 'west', years: '≈ 155–220',
    deText: 'Vater der lateinischen Theologie; prägte den Begriff „Trinitas".', enText: 'Father of Latin theology; coined the term "Trinitas".' },
  { id: 'cyprian', de: 'Cyprian von Karthago', en: 'Cyprian of Carthage', parent: 'tertullian', faith: true, born: 210, epoch: 'kirchenvater', refs: [],
    city: 'Karthago', lat: 36.85, lon: 10.32, tradition: 'west', years: '≈ 210–258',
    deText: 'Bischof und Märtyrer; schrieb über die Einheit der Kirche.', enText: 'Bishop and martyr; wrote on the unity of the church.' },
  { id: 'ephrem', de: 'Ephräm der Syrer', en: 'Ephrem the Syrian', parent: 'athanasius', faith: true, born: 306, epoch: 'kirchenvater', refs: [],
    city: 'Nisibis / Edessa', lat: 37.07, lon: 41.21, tradition: 'orient', years: '≈ 306–373',
    deText: 'Bedeutendster Dichter-Theologe der syrischen Kirche.', enText: 'The foremost poet-theologian of the Syriac church.' },
  { id: 'basilius', de: 'Basilius der Große', en: 'Basil the Great', parent: 'athanasius', faith: true, born: 330, epoch: 'kirchenvater', refs: [],
    city: 'Caesarea (Kappadokien)', lat: 38.73, lon: 35.48, tradition: 'east', years: '≈ 330–379',
    deText: 'Einer der drei Kappadokier; Klosterregel und Trinitätslehre.', enText: 'One of the Cappadocians; monastic rule and Trinitarian theology.' },
  { id: 'gregor_naz', de: 'Gregor von Nazianz', en: 'Gregory of Nazianzus', parent: 'basilius', faith: true, born: 329, epoch: 'kirchenvater', refs: [],
    city: 'Nazianz', lat: 38.4, lon: 34.5, tradition: 'east', years: '≈ 329–390',
    deText: 'Kappadokier, „der Theologe"; prägte die Trinitätssprache.', enText: 'A Cappadocian, "the Theologian"; shaped Trinitarian language.' },
  { id: 'chrysostomus', de: 'Johannes Chrysostomus', en: 'John Chrysostom', parent: 'basilius', faith: true, born: 349, epoch: 'kirchenvater', refs: [],
    city: 'Antiochia / Konstantinopel', lat: 41.01, lon: 28.98, tradition: 'east', years: '≈ 349–407',
    deText: '„Goldmund"; berühmtester Prediger der Ostkirche.', enText: '"Golden-mouthed"; the greatest preacher of the Eastern church.' },
  { id: 'ambrosius', de: 'Ambrosius von Mailand', en: 'Ambrose of Milan', parent: 'athanasius', faith: true, born: 340, epoch: 'kirchenvater', refs: [],
    city: 'Mailand', lat: 45.46, lon: 9.19, tradition: 'west', years: '≈ 340–397',
    deText: 'Bischof von Mailand, Lehrer und Wegbereiter Augustins.', enText: 'Bishop of Milan, teacher and mentor of Augustine.' },
  { id: 'kyrill', de: 'Kyrill von Alexandria', en: 'Cyril of Alexandria', parent: 'athanasius', faith: true, born: 376, epoch: 'kirchenvater', refs: [],
    city: 'Alexandria', lat: 31.2, lon: 29.92, tradition: 'east', years: '≈ 376–444',
    deText: 'Führende Stimme beim Konzil von Ephesus (431).', enText: 'A leading voice at the Council of Ephesus (431).' },

  // ---------------------------------------------------------------- Mittelalter
  { id: 'benedikt', de: 'Benedikt von Nursia', en: 'Benedict of Nursia', parent: 'augustinus', line: true, faith: true, born: 480, epoch: 'mittelalter', refs: [],
    deText: 'Vater des abendländischen Mönchtums; seine Regel „bete und arbeite" prägte Europa.', enText: 'Father of Western monasticism; his rule "pray and work" shaped Europe.' },
  { id: 'gregor_gross', de: 'Gregor der Große', en: 'Gregory the Great', parent: 'benedikt', faith: true, born: 540, epoch: 'mittelalter', refs: [],
    city: 'Rom', lat: 41.89, lon: 12.49, tradition: 'west', years: '≈ 540–604',
    deText: 'Papst; prägte Liturgie und Mission des lateinischen Westens.', enText: 'Pope; shaped the liturgy and mission of the Latin West.' },
  { id: 'rashi', de: 'Raschi', en: 'Rashi', parent: 'benedikt', faith: true, born: 1040, epoch: 'mittelalter', refs: [],
    deText: 'Jüdischer Gelehrter aus Troyes; sein Bibel- und Talmudkommentar ist bis heute grundlegend.', enText: 'Jewish scholar of Troyes; his commentary on the Bible and Talmud remains foundational.' },
  { id: 'anselm', de: 'Anselm von Canterbury', en: 'Anselm of Canterbury', parent: 'benedikt', line: true, faith: true, born: 1033, epoch: 'mittelalter', refs: [],
    deText: 'Theologe und Erzbischof; „Glaube, der nach Einsicht sucht", und Denker über die Versöhnung.', enText: 'Theologian and archbishop; "faith seeking understanding" and thinker on the atonement.' },
  { id: 'maimonides', de: 'Maimonides (Mose ben Maimon)', en: 'Maimonides (Moses ben Maimon)', parent: 'rashi', faith: true, born: 1138, epoch: 'mittelalter', refs: [],
    deText: 'Bedeutendster jüdischer Philosoph des Mittelalters; ordnete das jüdische Religionsgesetz.', enText: 'The foremost Jewish philosopher of the Middle Ages; codified Jewish religious law.' },
  { id: 'franz_assisi', de: 'Franz von Assisi', en: 'Francis of Assisi', parent: 'anselm', faith: true, born: 1181, epoch: 'mittelalter', refs: [],
    deText: 'Gab seinen Reichtum auf für ein Leben in Armut und Nächstenliebe; gründete den Franziskanerorden.', enText: 'Gave up his wealth for a life of poverty and love of neighbour; founded the Franciscan order.' },
  { id: 'thomas_aquin', de: 'Thomas von Aquin', en: 'Thomas Aquinas', parent: 'anselm', line: true, faith: true, born: 1225, epoch: 'mittelalter', refs: [],
    deText: 'Größter Theologe der Scholastik; verband Glaube und Vernunft in der „Summa Theologica".', enText: 'The greatest scholastic theologian; joined faith and reason in the "Summa Theologica".' },
  { id: 'wycliffe', de: 'John Wyclif', en: 'John Wycliffe', parent: 'thomas_aquin', line: true, faith: true, born: 1328, epoch: 'mittelalter', refs: [],
    deText: '„Morgenstern der Reformation"; ließ die Bibel erstmals ins Englische übersetzen.', enText: 'The "morning star of the Reformation"; had the Bible first translated into English.' },
  { id: 'hus', de: 'Jan Hus', en: 'Jan Hus', parent: 'wycliffe', line: true, faith: true, born: 1369, epoch: 'mittelalter', refs: [],
    deText: 'Böhmischer Reformator; forderte eine Kirche nach der Schrift und starb auf dem Scheiterhaufen.', enText: 'Bohemian reformer; called for a church shaped by Scripture and was burned at the stake.' },

  // ---------------------------------------------------------------- Reformation
  { id: 'luther', de: 'Martin Luther', en: 'Martin Luther', parent: 'hus', line: true, faith: true, born: 1483, epoch: 'reformation', refs: ['Röm 1:17', 'Eph 2:8-9'],
    deText: 'Mönch, der 1517 die 95 Thesen anschlug; löste die Reformation aus, übersetzte die Bibel ins Deutsche — „allein aus Gnade, allein durch den Glauben".', enText: 'A monk who posted the 95 Theses in 1517; sparked the Reformation and translated the Bible into German — "by grace alone, through faith alone".' },
  { id: 'zwingli', de: 'Huldrych Zwingli', en: 'Huldrych Zwingli', parent: 'hus', faith: true, born: 1484, epoch: 'reformation', refs: [],
    deText: 'Reformator von Zürich; brachte die Reformation in die Schweiz.', enText: 'The reformer of Zürich; brought the Reformation to Switzerland.' },
  { id: 'melanchthon', de: 'Philipp Melanchthon', en: 'Philip Melanchthon', parent: 'luther', faith: true, born: 1497, epoch: 'reformation', refs: [],
    deText: 'Luthers Mitstreiter; verfasste das „Augsburger Bekenntnis", das Grundbekenntnis der Lutheraner.', enText: "Luther's co-worker; wrote the Augsburg Confession, the basic Lutheran confession." },
  { id: 'calvin', de: 'Johannes Calvin', en: 'John Calvin', parent: 'luther', line: true, faith: true, born: 1509, epoch: 'reformation', refs: [],
    deText: 'Reformator von Genf; seine „Institutio" prägte den reformierten Protestantismus weltweit.', enText: 'The reformer of Geneva; his "Institutes" shaped Reformed Protestantism worldwide.' },
  { id: 'knox', de: 'John Knox', en: 'John Knox', parent: 'calvin', faith: true, born: 1514, epoch: 'reformation', refs: [],
    deText: 'Brachte die Reformation nach Schottland und begründete die presbyterianische Kirche.', enText: 'Brought the Reformation to Scotland and founded the Presbyterian church.' },

  // ---------------------------------------------------------------- Erweckung & Mission
  { id: 'wesley', de: 'John Wesley', en: 'John Wesley', parent: 'calvin', line: true, faith: true, born: 1703, epoch: 'erweckung', refs: [],
    deText: 'Erweckungsprediger; begründete den Methodismus und predigte im Freien vor Zehntausenden.', enText: 'A revival preacher; founded Methodism and preached in the open air to tens of thousands.' },
  { id: 'whitefield', de: 'George Whitefield', en: 'George Whitefield', parent: 'wesley', faith: true, born: 1714, epoch: 'erweckung', refs: [],
    deText: 'Mitreißender Prediger der großen Erweckung in Großbritannien und Amerika.', enText: 'A stirring preacher of the Great Awakening in Britain and America.' },
  { id: 'spurgeon', de: 'Charles H. Spurgeon', en: 'Charles H. Spurgeon', parent: 'wesley', line: true, faith: true, born: 1834, epoch: 'erweckung', refs: [],
    deText: 'Der „Fürst der Prediger" in London; predigte vor Tausenden und hinterließ ein gewaltiges Schrifttum.', enText: 'The "prince of preachers" in London; preached to thousands and left a vast body of writing.' },
  { id: 'moody', de: 'Dwight L. Moody', en: 'Dwight L. Moody', parent: 'spurgeon', faith: true, born: 1837, epoch: 'erweckung', refs: [],
    deText: 'Amerikanischer Evangelist und Gründer von Schulen und Werken der Mission.', enText: 'American evangelist and founder of schools and mission works.' },

  // ---------------------------------------------------------------- Moderne
  { id: 'bonhoeffer', de: 'Dietrich Bonhoeffer', en: 'Dietrich Bonhoeffer', parent: 'spurgeon', line: true, faith: true, born: 1906, epoch: 'moderne', refs: [],
    deText: 'Theologe der Bekennenden Kirche; widerstand dem NS-Regime und wurde 1945 hingerichtet („Nachfolge").', enText: 'Theologian of the Confessing Church; resisted the Nazi regime and was executed in 1945 ("The Cost of Discipleship").' },
  { id: 'graham', de: 'Billy Graham', en: 'Billy Graham', parent: 'bonhoeffer', line: true, faith: true, born: 1918, epoch: 'moderne', refs: [],
    deText: 'Wohl bekanntester Evangelist des 20. Jahrhunderts; predigte vor Millionen auf allen Kontinenten.', enText: 'Perhaps the best-known evangelist of the 20th century; preached to millions on every continent.' },

  // ============================================================================
  // 1. Chronik 1–9 — die großen Geschlechtsregister (Seitenlinien, eingeklappt)
  // Namen nach Luther 1912; verbinden bekannte Gestalten mit dem Stammbaum.
  // ============================================================================

  // ---- Ismaels zwölf Söhne (1Chr 1:29-31) -----------------------------------
  { id: 'nebajot', de: 'Nebajoth', en: 'Nebaioth', parent: 'ismael', epoch: 'patriarchen', refs: ['1Chr 1:29', 'Gen 25:13'],
    deText: 'Erstgeborener Ismaels; Stammvater eines nordarabischen Stammes.', enText: 'Ishmael’s firstborn; ancestor of a north-Arabian tribe.' },
  { id: 'kedar', de: 'Kedar', en: 'Kedar', parent: 'ismael', epoch: 'patriarchen', refs: ['1Chr 1:29', 'Ps 120:5'],
    deText: 'Zweiter Sohn Ismaels; die Kedarener wurden zum Inbegriff der Wüstennomaden.', enText: 'Ishmael’s second son; the Kedarites became a byword for desert nomads.' },
  { id: 'adbeel', de: 'Adbeel', en: 'Adbeel', parent: 'ismael', epoch: 'patriarchen', refs: ['1Chr 1:29'],
    deText: 'Dritter Sohn Ismaels.', enText: 'Third son of Ishmael.' },
  { id: 'mibsam', de: 'Mibsam', en: 'Mibsam', parent: 'ismael', epoch: 'patriarchen', refs: ['1Chr 1:29'],
    deText: 'Sohn Ismaels.', enText: 'Son of Ishmael.' },
  { id: 'mischma', de: 'Misma', en: 'Mishma', parent: 'ismael', epoch: 'patriarchen', refs: ['1Chr 1:30'],
    deText: 'Sohn Ismaels.', enText: 'Son of Ishmael.' },
  { id: 'duma', de: 'Duma', en: 'Dumah', parent: 'ismael', epoch: 'patriarchen', refs: ['1Chr 1:30'],
    deText: 'Sohn Ismaels; gab einer Oase in Nordarabien den Namen.', enText: 'Son of Ishmael; gave his name to an oasis in north Arabia.' },
  { id: 'massa', de: 'Massa', en: 'Massa', parent: 'ismael', epoch: 'patriarchen', refs: ['1Chr 1:30'],
    deText: 'Sohn Ismaels.', enText: 'Son of Ishmael.' },
  { id: 'hadad_i', de: 'Hadad', en: 'Hadad', parent: 'ismael', epoch: 'patriarchen', refs: ['1Chr 1:30'],
    deText: 'Sohn Ismaels.', enText: 'Son of Ishmael.' },
  { id: 'thema', de: 'Thema', en: 'Tema', parent: 'ismael', epoch: 'patriarchen', refs: ['1Chr 1:30', 'Hi 6:19'],
    deText: 'Sohn Ismaels; Namensgeber der Oasenstadt Tema.', enText: 'Son of Ishmael; namesake of the oasis town of Tema.' },
  { id: 'jetur', de: 'Jetur', en: 'Jetur', parent: 'ismael', epoch: 'patriarchen', refs: ['1Chr 1:31'],
    deText: 'Sohn Ismaels; Stammvater der Ituräer.', enText: 'Son of Ishmael; ancestor of the Itureans.' },
  { id: 'naphis', de: 'Naphis', en: 'Naphish', parent: 'ismael', epoch: 'patriarchen', refs: ['1Chr 1:31'],
    deText: 'Sohn Ismaels.', enText: 'Son of Ishmael.' },
  { id: 'kedma', de: 'Kedma', en: 'Kedemah', parent: 'ismael', epoch: 'patriarchen', refs: ['1Chr 1:31'],
    deText: 'Jüngster der zwölf Söhne Ismaels.', enText: 'Youngest of Ishmael’s twelve sons.' },

  // ---- Söhne der Ketura (1Chr 1:32) -----------------------------------------
  { id: 'simran', de: 'Simran', en: 'Zimran', parent: 'abraham', epoch: 'patriarchen', refs: ['1Chr 1:32', 'Gen 25:2'],
    deText: 'Sohn Abrahams von Ketura.', enText: 'Son of Abraham by Keturah.' },
  { id: 'joksan', de: 'Joksan', en: 'Jokshan', parent: 'abraham', epoch: 'patriarchen', refs: ['1Chr 1:32'],
    deText: 'Sohn Abrahams von Ketura; Vater Sabas und Dedans.', enText: 'Son of Abraham by Keturah; father of Sheba and Dedan.' },
  { id: 'medan', de: 'Medan', en: 'Medan', parent: 'abraham', epoch: 'patriarchen', refs: ['1Chr 1:32'],
    deText: 'Sohn Abrahams von Ketura.', enText: 'Son of Abraham by Keturah.' },
  { id: 'midian', de: 'Midian', en: 'Midian', parent: 'abraham', epoch: 'patriarchen', refs: ['1Chr 1:32', 'Ex 2:15-21'],
    deText: 'Sohn Abrahams von Ketura; Stammvater der Midianiter, bei denen Mose Zuflucht fand.', enText: 'Son of Abraham by Keturah; ancestor of the Midianites, among whom Moses took refuge.' },
  { id: 'jesbak', de: 'Jesbak', en: 'Ishbak', parent: 'abraham', epoch: 'patriarchen', refs: ['1Chr 1:32'],
    deText: 'Sohn Abrahams von Ketura.', enText: 'Son of Abraham by Keturah.' },
  { id: 'suah', de: 'Suah', en: 'Shuah', parent: 'abraham', epoch: 'patriarchen', refs: ['1Chr 1:32'],
    deText: 'Sohn Abrahams von Ketura.', enText: 'Son of Abraham by Keturah.' },

  // ---- Söhne Esaus / Edom (1Chr 1:35-36) ------------------------------------
  { id: 'eliphas', de: 'Eliphas', en: 'Eliphaz', parent: 'esau', epoch: 'patriarchen', refs: ['1Chr 1:35', 'Gen 36:10'],
    deText: 'Erstgeborener Esaus; Stammvater edomitischer Sippen.', enText: 'Esau’s firstborn; ancestor of Edomite clans.' },
  { id: 'reguel', de: 'Reguel', en: 'Reuel', parent: 'esau', epoch: 'patriarchen', refs: ['1Chr 1:35'],
    deText: 'Sohn Esaus.', enText: 'Son of Esau.' },
  { id: 'jeus', de: 'Jeus', en: 'Jeush', parent: 'esau', epoch: 'patriarchen', refs: ['1Chr 1:35'],
    deText: 'Sohn Esaus.', enText: 'Son of Esau.' },
  { id: 'jaelam', de: 'Jaelam', en: 'Jalam', parent: 'esau', epoch: 'patriarchen', refs: ['1Chr 1:35'],
    deText: 'Sohn Esaus.', enText: 'Son of Esau.' },
  { id: 'korah_e', de: 'Korah', en: 'Korah', parent: 'esau', epoch: 'patriarchen', refs: ['1Chr 1:35'],
    deText: 'Sohn Esaus; ein Häuptling Edoms.', enText: 'Son of Esau; a chief of Edom.' },
  { id: 'amalek', de: 'Amalek', en: 'Amalek', parent: 'eliphas', epoch: 'patriarchen', refs: ['1Chr 1:36', 'Ex 17:8-16'],
    deText: 'Enkel Esaus; Stammvater der Amalekiter, Israels Erzfeinde in der Wüste.', enText: 'Grandson of Esau; ancestor of the Amalekites, Israel’s archenemies in the wilderness.' },

  // ---- Söhne Judas (1Chr 2:3-5) ---------------------------------------------
  { id: 'ger', de: 'Ger', en: 'Er', parent: 'juda', epoch: 'patriarchen', refs: ['1Chr 2:3', 'Gen 38:7'],
    deText: 'Erstgeborener Judas; „böse vor dem HERRN", darum getötet.', enText: 'Judah’s firstborn; "wicked in the sight of the LORD", and so put to death.' },
  { id: 'onan', de: 'Onan', en: 'Onan', parent: 'juda', epoch: 'patriarchen', refs: ['1Chr 2:3', 'Gen 38:8-10'],
    deText: 'Zweiter Sohn Judas; verweigerte die Schwagerehe und starb.', enText: 'Judah’s second son; refused the levirate duty and died.' },
  { id: 'sela', de: 'Sela', en: 'Shelah', parent: 'juda', epoch: 'patriarchen', refs: ['1Chr 2:3'],
    deText: 'Dritter Sohn Judas von der Tochter Suas.', enText: 'Judah’s third son, by the daughter of Shua.' },
  { id: 'serah_juda', de: 'Serah', en: 'Zerah', parent: 'juda', epoch: 'patriarchen', refs: ['1Chr 2:4', 'Gen 38:30'],
    deText: 'Zwillingsbruder des Perez, von Thamar geboren.', enText: 'Twin brother of Perez, born to Tamar.' },
  { id: 'hamul', de: 'Hamul', en: 'Hamul', parent: 'perez', epoch: 'patriarchen', refs: ['1Chr 2:5'],
    deText: 'Sohn des Perez, neben Hezron.', enText: 'Son of Perez, alongside Hezron.' },
  { id: 'jerachmeel', de: 'Jerahmeel', en: 'Jerahmeel', parent: 'hezron', epoch: 'patriarchen', refs: ['1Chr 2:9'],
    deText: 'Erstgeborener Hezrons; Stammvater der Jerahmeeliter im Süden Judas.', enText: 'Hezron’s firstborn; ancestor of the Jerahmeelites in southern Judah.' },
  { id: 'chalubai', de: 'Chalubai (Kaleb)', en: 'Chelubai (Caleb)', parent: 'hezron', epoch: 'patriarchen', refs: ['1Chr 2:9', '1Chr 2:18'],
    deText: 'Sohn Hezrons, auch Kaleb genannt; Vater eines weitverzweigten Geschlechts in Juda.', enText: 'Son of Hezron, also called Caleb; father of a wide-branching family in Judah.' },

  // ---- Davids Geschwister (1Chr 2:13-17) ------------------------------------
  { id: 'eliab', de: 'Eliab', en: 'Eliab', parent: 'isai', epoch: 'koenigtum', refs: ['1Chr 2:13', '1Sam 17:13'],
    deText: 'Ältester Bruder Davids; zog mit Saul gegen die Philister.', enText: 'David’s eldest brother; went with Saul against the Philistines.' },
  { id: 'abinadab_d', de: 'Abinadab', en: 'Abinadab', parent: 'isai', epoch: 'koenigtum', refs: ['1Chr 2:13'],
    deText: 'Zweiter Bruder Davids.', enText: 'David’s second brother.' },
  { id: 'simea_d', de: 'Simea', en: 'Shimea', parent: 'isai', epoch: 'koenigtum', refs: ['1Chr 2:13'],
    deText: 'Dritter Bruder Davids (auch Schamma).', enText: 'David’s third brother (also Shammah).' },
  { id: 'nathanel_d', de: 'Nathanel', en: 'Nethanel', parent: 'isai', epoch: 'koenigtum', refs: ['1Chr 2:14'],
    deText: 'Vierter Bruder Davids.', enText: 'David’s fourth brother.' },
  { id: 'raddai', de: 'Raddai', en: 'Raddai', parent: 'isai', epoch: 'koenigtum', refs: ['1Chr 2:14'],
    deText: 'Fünfter Bruder Davids.', enText: 'David’s fifth brother.' },
  { id: 'ozem', de: 'Ozem', en: 'Ozem', parent: 'isai', epoch: 'koenigtum', refs: ['1Chr 2:15'],
    deText: 'Sechster Bruder Davids.', enText: 'David’s sixth brother.' },
  { id: 'zeruja', de: 'Zeruja', en: 'Zeruiah', parent: 'isai', epoch: 'koenigtum', refs: ['1Chr 2:16'],
    deText: 'Schwester Davids; Mutter der Heerführer Abisai, Joab und Asahel.', enText: 'David’s sister; mother of the commanders Abishai, Joab and Asahel.' },
  { id: 'abigail_d', de: 'Abigail', en: 'Abigail', parent: 'isai', epoch: 'koenigtum', refs: ['1Chr 2:16-17'],
    deText: 'Schwester Davids; Mutter Amasas.', enText: 'David’s sister; mother of Amasa.' },
  { id: 'abisai', de: 'Abisai', en: 'Abishai', parent: 'zeruja', epoch: 'koenigtum', refs: ['1Chr 2:16', '2Sam 23:18'],
    deText: 'Neffe Davids; einer seiner tapfersten Krieger.', enText: 'David’s nephew; one of his mightiest warriors.' },
  { id: 'joab', de: 'Joab', en: 'Joab', parent: 'zeruja', epoch: 'koenigtum', refs: ['1Chr 2:16', '2Sam 8:16'],
    deText: 'Neffe Davids und Oberbefehlshaber seines Heeres.', enText: 'David’s nephew and commander of his army.' },
  { id: 'asahel', de: 'Asahel', en: 'Asahel', parent: 'zeruja', epoch: 'koenigtum', refs: ['1Chr 2:16', '2Sam 2:18-23'],
    deText: 'Neffe Davids; „schnell auf den Füßen", von Abner getötet.', enText: 'David’s nephew; "swift of foot", killed by Abner.' },
  { id: 'amasa', de: 'Amasa', en: 'Amasa', parent: 'abigail_d', epoch: 'koenigtum', refs: ['1Chr 2:17', '2Sam 17:25'],
    deText: 'Neffe Davids; Heerführer, von Joab erschlagen.', enText: 'David’s nephew; an army commander, slain by Joab.' },

  // ---- Davids Söhne (1Chr 3:1-9) --------------------------------------------
  { id: 'amnon', de: 'Amnon', en: 'Amnon', parent: 'david', epoch: 'koenigtum', refs: ['1Chr 3:1', '2Sam 13'],
    deText: 'Davids Erstgeborener (in Hebron); von Absalom getötet.', enText: 'David’s firstborn (at Hebron); killed by Absalom.' },
  { id: 'daniel_d', de: 'Daniel (Kileab)', en: 'Daniel (Chileab)', parent: 'david', epoch: 'koenigtum', refs: ['1Chr 3:1'],
    deText: 'Zweiter Sohn Davids, von Abigail der Karmelitin.', enText: 'David’s second son, by Abigail the Carmelite.' },
  { id: 'absalom', de: 'Absalom', en: 'Absalom', parent: 'david', epoch: 'koenigtum', refs: ['1Chr 3:2', '2Sam 15-18'],
    deText: 'Dritter Sohn Davids; empörte sich gegen seinen Vater und fiel im Aufstand.', enText: 'David’s third son; rebelled against his father and died in the revolt.' },
  { id: 'adonija', de: 'Adonia', en: 'Adonijah', parent: 'david', epoch: 'koenigtum', refs: ['1Chr 3:2', '1Kön 1'],
    deText: 'Vierter Sohn Davids; griff nach dem Thron, unterlag aber Salomo.', enText: 'David’s fourth son; reached for the throne but lost out to Solomon.' },
  { id: 'sephatja', de: 'Sephatja', en: 'Shephatiah', parent: 'david', epoch: 'koenigtum', refs: ['1Chr 3:3'],
    deText: 'Fünfter Sohn Davids, von Abital.', enText: 'David’s fifth son, by Abital.' },
  { id: 'jethream', de: 'Jethream', en: 'Ithream', parent: 'david', epoch: 'koenigtum', refs: ['1Chr 3:3'],
    deText: 'Sechster Sohn Davids, in Hebron geboren.', enText: 'David’s sixth son, born at Hebron.' },
  { id: 'simea_dj', de: 'Simea', en: 'Shimea', parent: 'david', epoch: 'koenigtum', refs: ['1Chr 3:5'],
    deText: 'Sohn Davids und der Bathseba, in Jerusalem geboren.', enText: 'Son of David and Bathsheba, born in Jerusalem.' },
  { id: 'sobab', de: 'Sobab', en: 'Shobab', parent: 'david', epoch: 'koenigtum', refs: ['1Chr 3:5'],
    deText: 'Sohn Davids und der Bathseba.', enText: 'Son of David and Bathsheba.' },
  { id: 'tamar_d', de: 'Thamar', en: 'Tamar', parent: 'david', epoch: 'koenigtum', refs: ['1Chr 3:9', '2Sam 13'],
    deText: 'Tochter Davids; Schwester Absaloms.', enText: 'Daughter of David; sister of Absalom.' },

  // ---- Leviten: Söhne Levis & Kahaths (1Chr 5:27-6:3) -----------------------
  { id: 'gerson', de: 'Gerson', en: 'Gershon', parent: 'levi', epoch: 'aegypten', refs: ['1Chr 5:27', '1Chr 6:1'],
    deText: 'Erstgeborener Levis; Stammvater der gersonitischen Leviten.', enText: 'Levi’s firstborn; ancestor of the Gershonite Levites.' },
  { id: 'merari', de: 'Merari', en: 'Merari', parent: 'levi', epoch: 'aegypten', refs: ['1Chr 5:27', '1Chr 6:1'],
    deText: 'Dritter Sohn Levis; Stammvater der meraritischen Leviten.', enText: 'Levi’s third son; ancestor of the Merarite Levites.' },
  { id: 'jizhar', de: 'Jizhar', en: 'Izhar', parent: 'kehat', epoch: 'aegypten', refs: ['1Chr 5:28', 'Ex 6:18'],
    deText: 'Sohn Kahaths; Vater Korahs.', enText: 'Son of Kohath; father of Korah.' },
  { id: 'hebron_lev', de: 'Hebron', en: 'Hebron', parent: 'kehat', epoch: 'aegypten', refs: ['1Chr 5:28'],
    deText: 'Sohn Kahaths; Haupt einer levitischen Sippe.', enText: 'Son of Kohath; head of a Levitical clan.' },
  { id: 'usiel', de: 'Usiel', en: 'Uzziel', parent: 'kehat', epoch: 'aegypten', refs: ['1Chr 5:28', 'Ex 6:18'],
    deText: 'Jüngster Sohn Kahaths.', enText: 'Youngest son of Kohath.' },

  // ---- Söhne Aarons & die Hohepriesterlinie (1Chr 5:29-41) ------------------
  { id: 'nadab', de: 'Nadab', en: 'Nadab', parent: 'aaron', epoch: 'aegypten', refs: ['1Chr 5:29', 'Lev 10:1-2'],
    deText: 'Sohn Aarons; brachte „fremdes Feuer" dar und kam um.', enText: 'Son of Aaron; offered "strange fire" and died.' },
  { id: 'abihu', de: 'Abihu', en: 'Abihu', parent: 'aaron', epoch: 'aegypten', refs: ['1Chr 5:29', 'Lev 10:1-2'],
    deText: 'Sohn Aarons; starb mit Nadab vor dem HERRN.', enText: 'Son of Aaron; died with Nadab before the LORD.' },
  { id: 'eleasar_p', de: 'Eleasar', en: 'Eleazar', parent: 'aaron', epoch: 'aegypten', refs: ['1Chr 5:29', 'Num 20:25-28'],
    deText: 'Dritter Sohn Aarons; folgte ihm als Hoherpriester nach.', enText: 'Aaron’s third son; succeeded him as high priest.' },
  { id: 'ithamar', de: 'Ithamar', en: 'Ithamar', parent: 'aaron', epoch: 'aegypten', refs: ['1Chr 5:29', 'Ex 38:21'],
    deText: 'Jüngster Sohn Aarons; aus seiner Linie stammte später Eli.', enText: 'Aaron’s youngest son; from his line later came Eli.' },
  { id: 'pinhas', de: 'Pinehas', en: 'Phinehas', parent: 'eleasar_p', epoch: 'aegypten', refs: ['1Chr 5:30', 'Num 25:10-13'],
    deText: 'Sohn Eleasars; wehrte Gottes Zorn ab und empfing den „Bund des ewigen Priestertums".', enText: 'Son of Eleazar; turned away God’s wrath and received the "covenant of perpetual priesthood".' },
  { id: 'abisua', de: 'Abisua', en: 'Abishua', parent: 'pinhas', epoch: 'aegypten', refs: ['1Chr 5:30'],
    deText: 'Hoherpriester in der Linie Eleasars.', enText: 'High priest in the line of Eleazar.' },
  { id: 'bukki', de: 'Bukki', en: 'Bukki', parent: 'abisua', epoch: 'richter', refs: ['1Chr 5:31'],
    deText: 'Hoherpriester der Frühzeit.', enText: 'High priest of the early period.' },
  { id: 'usi', de: 'Usi', en: 'Uzzi', parent: 'bukki', epoch: 'richter', refs: ['1Chr 5:31'],
    deText: 'Hoherpriester in der Richterzeit.', enText: 'High priest in the age of the judges.' },
  { id: 'serahja', de: 'Serahja', en: 'Zerahiah', parent: 'usi', epoch: 'richter', refs: ['1Chr 5:32'],
    deText: 'Hoherpriester in der Linie Eleasars.', enText: 'High priest in the line of Eleazar.' },
  { id: 'merajot', de: 'Merajoth', en: 'Meraioth', parent: 'serahja', epoch: 'richter', refs: ['1Chr 5:32'],
    deText: 'Hoherpriester der Frühzeit.', enText: 'High priest of the early period.' },
  { id: 'amarja1', de: 'Amarja', en: 'Amariah', parent: 'merajot', epoch: 'koenigtum', refs: ['1Chr 5:33'],
    deText: 'Hoherpriester in der Linie Eleasars.', enText: 'High priest in the line of Eleazar.' },
  { id: 'ahitub1', de: 'Ahitob', en: 'Ahitub', parent: 'amarja1', epoch: 'koenigtum', refs: ['1Chr 5:33'],
    deText: 'Hoherpriester; Vater Zadoks.', enText: 'High priest; father of Zadok.' },
  { id: 'zadok1', de: 'Zadok', en: 'Zadok', parent: 'ahitub1', epoch: 'koenigtum', refs: ['1Chr 5:34', '2Sam 15:24-29'],
    deText: 'Hoherpriester unter David und Salomo; seine Linie versah den Tempeldienst.', enText: 'High priest under David and Solomon; his line served in the temple.' },
  { id: 'ahimaaz', de: 'Ahimaaz', en: 'Ahimaaz', parent: 'zadok1', epoch: 'koenigtum', refs: ['1Chr 5:34', '2Sam 18:19-33'],
    deText: 'Sohn Zadoks; treuer Bote Davids im Aufstand Absaloms.', enText: 'Son of Zadok; a faithful runner for David during Absalom’s revolt.' },
  { id: 'asarja1', de: 'Asarja', en: 'Azariah', parent: 'ahimaaz', epoch: 'koenige', refs: ['1Chr 5:35'],
    deText: 'Hoherpriester der Königszeit.', enText: 'High priest of the monarchy.' },
  { id: 'johanan', de: 'Johanan', en: 'Johanan', parent: 'asarja1', epoch: 'koenige', refs: ['1Chr 5:35'],
    deText: 'Hoherpriester in der Linie Zadoks.', enText: 'High priest in the line of Zadok.' },
  { id: 'asarja2', de: 'Asarja', en: 'Azariah', parent: 'johanan', epoch: 'koenige', refs: ['1Chr 5:36'],
    deText: 'Priester „in dem Hause, das Salomo zu Jerusalem baute".', enText: 'Priest "in the house that Solomon built in Jerusalem".' },
  { id: 'amarja2', de: 'Amarja', en: 'Amariah', parent: 'asarja2', epoch: 'koenige', refs: ['1Chr 5:37'],
    deText: 'Hoherpriester der Königszeit.', enText: 'High priest of the monarchy.' },
  { id: 'ahitub2', de: 'Ahitob', en: 'Ahitub', parent: 'amarja2', epoch: 'koenige', refs: ['1Chr 5:37'],
    deText: 'Hoherpriester in der Linie Zadoks.', enText: 'High priest in the line of Zadok.' },
  { id: 'zadok2', de: 'Zadok', en: 'Zadok', parent: 'ahitub2', epoch: 'koenige', refs: ['1Chr 5:38'],
    deText: 'Hoherpriester der späten Königszeit.', enText: 'High priest of the late monarchy.' },
  { id: 'sallum', de: 'Sallum', en: 'Shallum', parent: 'zadok2', epoch: 'koenige', refs: ['1Chr 5:38'],
    deText: 'Hoherpriester; Vater Hilkias.', enText: 'High priest; father of Hilkiah.' },
  { id: 'hilkia', de: 'Hilkia', en: 'Hilkiah', parent: 'sallum', epoch: 'koenige', refs: ['1Chr 5:39', '2Kön 22:8'],
    deText: 'Hoherpriester unter Josia; fand das Gesetzbuch im Tempel.', enText: 'High priest under Josiah; found the Book of the Law in the temple.' },
  { id: 'asarja3', de: 'Asarja', en: 'Azariah', parent: 'hilkia', epoch: 'koenige', refs: ['1Chr 5:39'],
    deText: 'Hoherpriester der ausgehenden Königszeit.', enText: 'High priest at the close of the monarchy.' },
  { id: 'seraja_p', de: 'Seraja', en: 'Seraiah', parent: 'asarja3', epoch: 'koenige', refs: ['1Chr 5:40', '2Kön 25:18-21'],
    deText: 'Letzter Hoherpriester vor dem Exil; von Nebukadnezar hingerichtet.', enText: 'Last high priest before the exile; executed by Nebuchadnezzar.' },
  { id: 'jozadak', de: 'Jozadak', en: 'Jehozadak', parent: 'seraja_p', epoch: 'exil', refs: ['1Chr 5:40-41'],
    deText: 'Sohn Serajas; wurde ins babylonische Exil weggeführt. Vater des Hohenpriesters Josua der Rückkehr.', enText: 'Son of Seraiah; carried into Babylonian exile. Father of Joshua the high priest of the return.' },

  // ---- Ephraim → Josua (1Chr 7:25-27) ---------------------------------------
  { id: 'rephah', de: 'Repha', en: 'Rephah', parent: 'ephraim', epoch: 'aegypten', refs: ['1Chr 7:25'],
    deText: 'Nachkomme Ephraims in der Linie auf Josua hin.', enText: 'Descendant of Ephraim in the line toward Joshua.' },
  { id: 'resheph', de: 'Reseph', en: 'Resheph', parent: 'rephah', epoch: 'aegypten', refs: ['1Chr 7:25'],
    deText: 'Vorfahr Josuas.', enText: 'Ancestor of Joshua.' },
  { id: 'telach', de: 'Telah', en: 'Telah', parent: 'resheph', epoch: 'aegypten', refs: ['1Chr 7:25'],
    deText: 'Vorfahr Josuas.', enText: 'Ancestor of Joshua.' },
  { id: 'tahan', de: 'Thahan', en: 'Tahan', parent: 'telach', epoch: 'aegypten', refs: ['1Chr 7:25'],
    deText: 'Vorfahr Josuas.', enText: 'Ancestor of Joshua.' },
  { id: 'ladan', de: 'Laedan', en: 'Ladan', parent: 'tahan', epoch: 'aegypten', refs: ['1Chr 7:26'],
    deText: 'Vorfahr Josuas.', enText: 'Ancestor of Joshua.' },
  { id: 'ammihud', de: 'Ammihud', en: 'Ammihud', parent: 'ladan', epoch: 'aegypten', refs: ['1Chr 7:26'],
    deText: 'Vater Elisamas, des Stammesfürsten Ephraims.', enText: 'Father of Elishama, the tribal prince of Ephraim.' },
  { id: 'elischama_e', de: 'Elisama', en: 'Elishama', parent: 'ammihud', epoch: 'aegypten', refs: ['1Chr 7:26', 'Num 1:10'],
    deText: 'Fürst Ephraims beim Auszug; Großvater Josuas.', enText: 'Prince of Ephraim at the Exodus; grandfather of Joshua.' },
  { id: 'nun', de: 'Nun', en: 'Nun', parent: 'elischama_e', epoch: 'aegypten', refs: ['1Chr 7:27', 'Ex 33:11'],
    deText: 'Vater Josuas.', enText: 'Father of Joshua.' },
  { id: 'josua', de: 'Josua', en: 'Joshua', parent: 'nun', epoch: 'richter', refs: ['1Chr 7:27', 'Jos 1:1-9'],
    deText: 'Sohn Nuns; Nachfolger Moses, der Israel ins verheißene Land führte.', enText: 'Son of Nun; successor of Moses who led Israel into the promised land.' },

  // ---- Benjamin → Sauls Haus (1Chr 8:33-35) ---------------------------------
  { id: 'ner', de: 'Ner', en: 'Ner', parent: 'benjamin', epoch: 'koenigtum', refs: ['1Chr 8:33', '1Sam 14:51'],
    deText: 'Benjaminit aus Gibeon; Großvater König Sauls (vereinfacht an Benjamin angehängt).', enText: 'A Benjaminite of Gibeon; grandfather of King Saul (attached to Benjamin in simplified form).' },
  { id: 'kis', de: 'Kis', en: 'Kish', parent: 'ner', epoch: 'koenigtum', refs: ['1Chr 8:33', '1Sam 9:1-2'],
    deText: 'Vater König Sauls.', enText: 'Father of King Saul.' },
  { id: 'saul', de: 'Saul', en: 'Saul', parent: 'kis', epoch: 'koenigtum', refs: ['1Chr 8:33', '1Sam 9-31'],
    deText: 'Erster König Israels; aus dem Stamm Benjamin, von Samuel gesalbt, fiel auf dem Gilboa.', enText: 'First king of Israel; of the tribe of Benjamin, anointed by Samuel, fell on Mount Gilboa.' },
  { id: 'jonatan', de: 'Jonathan', en: 'Jonathan', parent: 'saul', epoch: 'koenigtum', refs: ['1Chr 8:33', '1Sam 18-20'],
    deText: 'Sohn Sauls; treuer Freund Davids, fiel mit dem Vater auf dem Gilboa.', enText: 'Son of Saul; devoted friend of David, fell with his father on Gilboa.' },
  { id: 'malchisua', de: 'Malchisua', en: 'Malchishua', parent: 'saul', epoch: 'koenigtum', refs: ['1Chr 8:33'],
    deText: 'Sohn Sauls; fiel mit ihm im Kampf.', enText: 'Son of Saul; fell with him in battle.' },
  { id: 'abinadab_s', de: 'Abinadab', en: 'Abinadab', parent: 'saul', epoch: 'koenigtum', refs: ['1Chr 8:33'],
    deText: 'Sohn Sauls; fiel auf dem Gilboa.', enText: 'Son of Saul; fell on Mount Gilboa.' },
  { id: 'esbaal', de: 'Esbaal (Isboseth)', en: 'Esh-Baal (Ish-Bosheth)', parent: 'saul', epoch: 'koenigtum', refs: ['1Chr 8:33', '2Sam 2-4'],
    deText: 'Sohn Sauls; herrschte kurz als Gegenkönig zu David.', enText: 'Son of Saul; briefly reigned as rival king to David.' },
  { id: 'meribbaal', de: 'Merib-Baal (Mefiboseth)', en: 'Merib-Baal (Mephibosheth)', parent: 'jonatan', epoch: 'koenigtum', refs: ['1Chr 8:34', '2Sam 9'],
    deText: 'Sohn Jonathans; an beiden Füßen lahm, von David an die Königstafel geholt.', enText: 'Son of Jonathan; lame in both feet, brought by David to the king’s table.' },
  { id: 'micha_s', de: 'Micha', en: 'Micah', parent: 'meribbaal', epoch: 'koenige', refs: ['1Chr 8:34-35'],
    deText: 'Sohn Merib-Baals; setzte das Haus Sauls fort.', enText: 'Son of Merib-Baal; continued the house of Saul.' },
];

export const PERSON_BY_ID: Record<string, Person> = Object.fromEntries(GENEALOGY.map((p) => [p.id, p]));

/** Format an approximate year: negative → "v. Chr." / "BC", positive → "n. Chr." / "AD". */
export function formatYear(year: number, lang: 'de' | 'en'): string {
  const bc = lang === 'de' ? 'v. Chr.' : 'BC';
  const ad = lang === 'de' ? 'n. Chr.' : 'AD';
  return year < 0 ? `${Math.abs(year)} ${bc}` : `${year} ${ad}`;
}

/** Bible.com search URL for a human-readable reference. */
export function bibleRefUrl(ref: string): string {
  return `https://www.bible.com/search/bible?query=${encodeURIComponent(ref)}`;
}

/**
 * Children of each person, keyed by parent id, in authored (≈ chronological)
 * order. Lets a person card list and link the next generation, not just the
 * parent above it.
 */
export const CHILDREN_BY_PARENT: Record<string, Person[]> = (() => {
  const map: Record<string, Person[]> = {};
  for (const p of GENEALOGY) {
    if (p.parent) (map[p.parent] ??= []).push(p);
  }
  return map;
})();

/**
 * Wikipedia lookup for a named person who is not (yet) a tree node — e.g. the
 * wives carried only as `spouse` text. `/w/index.php?search=` jumps straight to
 * the article on an exact match and otherwise shows search results.
 */
export function wikipediaSearchUrl(name: string, lang: 'de' | 'en'): string {
  const host = lang === 'de' ? 'de.wikipedia.org' : 'en.wikipedia.org';
  return `https://${host}/w/index.php?search=${encodeURIComponent(name)}`;
}
