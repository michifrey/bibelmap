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
    deText: 'Schüler des Apostels Johannes, Bischof von Smyrna; starb als Märtyrer für seinen Glauben.', enText: 'A disciple of the apostle John, bishop of Smyrna; died a martyr for his faith.' },
  { id: 'justin', de: 'Justin der Märtyrer', en: 'Justin Martyr', parent: 'polykarp', line: true, faith: true, born: 100, epoch: 'kirchenvater', refs: [],
    deText: 'Philosoph, der zum Christen wurde; verteidigte den Glauben vor den Gebildeten seiner Zeit.', enText: 'A philosopher turned Christian; defended the faith before the learned of his day.' },
  { id: 'irenaeus', de: 'Irenäus von Lyon', en: 'Irenaeus of Lyon', parent: 'justin', line: true, faith: true, born: 130, epoch: 'kirchenvater', refs: [],
    deText: 'Bischof und Theologe; betonte die Einheit der Schrift gegen die Gnosis.', enText: 'Bishop and theologian; upheld the unity of Scripture against gnosticism.' },
  { id: 'origenes', de: 'Origenes', en: 'Origen', parent: 'irenaeus', faith: true, born: 184, epoch: 'kirchenvater', refs: [],
    deText: 'Gelehrter aus Alexandria; einer der ersten großen Bibelausleger.', enText: 'A scholar of Alexandria; one of the first great interpreters of the Bible.' },
  { id: 'athanasius', de: 'Athanasius', en: 'Athanasius', parent: 'irenaeus', line: true, faith: true, born: 296, epoch: 'kirchenvater', refs: [],
    deText: 'Bischof von Alexandria; verteidigte die Gottheit Christi und half, den Bibelkanon zu klären.', enText: 'Bishop of Alexandria; defended the deity of Christ and helped settle the biblical canon.' },
  { id: 'hieronymus', de: 'Hieronymus', en: 'Jerome', parent: 'athanasius', faith: true, born: 347, epoch: 'kirchenvater', refs: [],
    deText: 'Übersetzte die Bibel ins Lateinische (Vulgata) — über tausend Jahre die Bibel des Abendlandes.', enText: 'Translated the Bible into Latin (the Vulgate) — the Bible of the West for over a thousand years.' },
  { id: 'augustinus', de: 'Augustinus von Hippo', en: 'Augustine of Hippo', parent: 'athanasius', line: true, faith: true, born: 354, epoch: 'kirchenvater', refs: [],
    deText: 'Bischof und einflussreichster Theologe der Alten Kirche; schrieb „Bekenntnisse" und „Gottesstaat".', enText: 'Bishop and most influential theologian of the early church; wrote the "Confessions" and "City of God".' },

  // ---------------------------------------------------------------- Mittelalter
  { id: 'benedikt', de: 'Benedikt von Nursia', en: 'Benedict of Nursia', parent: 'augustinus', line: true, faith: true, born: 480, epoch: 'mittelalter', refs: [],
    deText: 'Vater des abendländischen Mönchtums; seine Regel „bete und arbeite" prägte Europa.', enText: 'Father of Western monasticism; his rule "pray and work" shaped Europe.' },
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
