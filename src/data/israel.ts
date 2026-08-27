import type { BiText } from './israelGeo';

/**
 * Israel: von der Landnahme bis heute.
 *
 * WAS DIESE DATEI IST. Eine Ereignisliste mit Belegen. Jeder Eintrag nennt
 * mindestens eine Quelle, jede Zahl nennt die Stelle, die sie erhebt, und den
 * Stand, auf den sie sich bezieht. Das ist hier keine Zierde: Über kaum einen
 * Gegenstand wird so viel Falsches weitergereicht wie über diesen, und eine
 * Karte, die Flächen einfärbt und Zahlen nennt, ohne zu sagen woher, ist Teil
 * des Problems.
 *
 * WIE BENANNT WIRD. Wo zwei Namen im Gebrauch sind, stehen beide – 1948 heißt
 * Unabhängigkeitskrieg und Nakba, 1967 Sechstagekrieg und Juni-Krieg. Das ist
 * kein Ausweichen: Wer nur einen der beiden Namen kennt, kennt nur eine der
 * beiden Erinnerungen. Linien heißen, was sie juristisch sind: die Linie von
 * 1949 ist eine Waffenstillstandslinie, keine Grenze.
 *
 * WAS SIE NICHT IST. Kein Urteil darüber, wem das Land zusteht. Die Einträge
 * sagen, was wann geschah und wer es festhält – nicht, wer recht hat.
 *
 * ZAHLEN VERALTEN. Der laufende Krieg ist in Bewegung; die Zahlen hier tragen
 * ein Stand-Datum und sind in dem Augenblick veraltet, in dem sie geschrieben
 * sind. Deshalb führt jeder Eintrag zusätzlich auf eine Stelle, die
 * fortlaufend zählt (UN OCHA), statt die Zahl hier zum letzten Wort zu machen.
 */

/** Woher eine Angabe kommt – die Art sagt, wie belastbar sie ist. */
export type SourceKind =
  | 'primary'    /* Vertragstext, Resolution, Urteil, Erklärung */
  | 'un'         /* Vereinte Nationen: Erhebung, Bericht, Beschluss */
  | 'archive'    /* Museum, Archiv, Fundstück */
  | 'reference'  /* Nachschlagewerk, Landeszentrale, Enzyklopädie */
  | 'press'      /* Nachrichtenagentur, Redaktion */
  | 'bible';     /* die Bibel selbst */

export interface Source {
  id: string;
  label: string;
  by: string;
  kind: SourceKind;
  url: string;
}

/**
 * Die Quellen, auf die die Ereignisse zeigen. Enzyklopädisches geht bewusst
 * über die Wikipedia-SUCHE statt über einen festen Titel: ein umbenannter
 * Artikel bricht dann nicht den Link. Dieselbe Regel wie bei den Personen.
 */
export const SOURCES: Source[] = [
  { id: 'bible', label: 'Bibeltext', by: 'BibleGateway', kind: 'bible', url: 'https://www.biblegateway.com/' },
  { id: 'unispal', label: 'UN – Question of Palestine', by: 'Vereinte Nationen', kind: 'un', url: 'https://www.un.org/unispal/' },
  { id: 'undl181', label: 'Resolution 181 (II), 29.11.1947', by: 'UN-Generalversammlung', kind: 'primary', url: 'https://digitallibrary.un.org/record/210003' },
  { id: 'undl242', label: 'Resolution 242, 22.11.1967', by: 'UN-Sicherheitsrat', kind: 'primary', url: 'https://digitallibrary.un.org/record/90717' },
  { id: 'undl478', label: 'Resolution 478, 20.08.1980', by: 'UN-Sicherheitsrat', kind: 'primary', url: 'https://digitallibrary.un.org/record/11866' },
  { id: 'undl497', label: 'Resolution 497, 17.12.1981', by: 'UN-Sicherheitsrat', kind: 'primary', url: 'https://digitallibrary.un.org/record/27231' },
  { id: 'ocha', label: 'Lagebericht besetzte Gebiete', by: 'UN OCHA oPt', kind: 'un', url: 'https://www.ochaopt.org/' },
  { id: 'unrwa', label: 'Palästinaflüchtlinge', by: 'UNRWA', kind: 'un', url: 'https://www.unrwa.org/palestine-refugees' },
  { id: 'icj131', label: 'Gutachten zur Sperranlage, 09.07.2004', by: 'Internationaler Gerichtshof', kind: 'primary', url: 'https://www.icj-cij.org/case/131' },
  { id: 'icj186', label: 'Gutachten zur Besatzung, 19.07.2024', by: 'Internationaler Gerichtshof', kind: 'primary', url: 'https://www.icj-cij.org/case/186' },
  { id: 'gov_decl', label: 'Unabhängigkeitserklärung, 14.05.1948', by: 'Staat Israel', kind: 'primary', url: 'https://www.gov.il/en/pages/declaration-of-establishment-state-of-israel' },
  { id: 'cbs', label: 'Bevölkerung und Statistik', by: 'Israelisches Zentralbüro für Statistik', kind: 'primary', url: 'https://www.cbs.gov.il/en/Pages/default.aspx' },
  { id: 'peacemaker', label: 'Vertrags- und Abkommenstexte', by: 'UN Peacemaker', kind: 'primary', url: 'https://peacemaker.un.org/' },
  { id: 'avalon', label: 'Quellentexte zum Nahen Osten', by: 'Avalon Project, Yale Law School', kind: 'archive', url: 'https://avalon.law.yale.edu/subject_menus/mideast.asp' },
  { id: 'bpb', label: 'Dossier Israel', by: 'Bundeszentrale für politische Bildung', kind: 'reference', url: 'https://www.bpb.de/themen/naher-mittlerer-osten/israel/' },
  { id: 'bpb_konflikt', label: 'Dossier Israel und Palästina', by: 'Bundeszentrale für politische Bildung', kind: 'reference', url: 'https://www.bpb.de/themen/naher-mittlerer-osten/israel-und-palaestina/' },
  { id: 'yadvashem', label: 'Schoa – Forschung und Gedenken', by: 'Yad Vashem', kind: 'archive', url: 'https://www.yadvashem.org/' },
  { id: 'britishmuseum', label: 'Sammlung Alter Orient', by: 'British Museum', kind: 'archive', url: 'https://www.britishmuseum.org/collection' },
  { id: 'imj', label: 'Sammlung', by: 'Israel Museum, Jerusalem', kind: 'archive', url: 'https://www.imj.org.il/en' },
  { id: 'reuters', label: 'Laufende Berichterstattung', by: 'Reuters', kind: 'press', url: 'https://www.reuters.com/world/middle-east/' },
  { id: 'tagesschau', label: 'Laufende Berichterstattung', by: 'ARD-Tagesschau', kind: 'press', url: 'https://www.tagesschau.de/ausland/nahost/' },
];

export const SOURCE_BY_ID = Object.fromEntries(SOURCES.map((s) => [s.id, s])) as Record<string, Source>;

/** Die sechs Abschnitte, in die der Zeitstrahl zerfällt. */
export type Era = 'bible' | 'rome' | 'diaspora' | 'return' | 'state' | 'now';

export const ERAS: { id: Era; de: string; en: string; from: number; to: number; color: string }[] = [
  { id: 'bible', de: 'Biblische Zeit', en: 'Biblical era', from: -1250, to: -63, color: '#c9812f' },
  { id: 'rome', de: 'Rom und die Zerstörung', en: 'Rome and the destruction', from: -63, to: 324, color: '#b0436b' },
  { id: 'diaspora', de: 'Zerstreuung und Fremdherrschaft', en: 'Dispersion and foreign rule', from: 324, to: 1881, color: '#7a5aa8' },
  { id: 'return', de: 'Rückkehrbewegung und Mandat', en: 'Return movement and Mandate', from: 1881, to: 1947, color: '#4d9cd6' },
  { id: 'state', de: 'Staat und Kriege', en: 'Statehood and wars', from: 1947, to: 2000, color: '#2f9f86' },
  { id: 'now', de: 'Gegenwart', en: 'The present', from: 2000, to: 2026, color: '#e0a449' },
];

export const ERA_BY_ID = Object.fromEntries(ERAS.map((e) => [e.id, e])) as Record<Era, (typeof ERAS)[number]>;

/** Was für ein Ereignis – das Zeichen auf der Karte hängt daran. */
export type Kind = 'war' | 'attack' | 'treaty' | 'founding' | 'exile' | 'uprising' | 'ruling' | 'other';

/**
 * Eine Zahl mit Herkunft. Ohne `source` und `asOf` steht sie nicht da – das ist
 * die Regel, die `npm run check:israel` durchsetzt.
 */
export interface Figure {
  label: BiText;
  value: BiText;
  /** Kennung aus SOURCES. */
  source: string;
  /** „10/2025" – der Stand, auf den sich die Zahl bezieht. */
  asOf: string;
  note?: BiText;
}

export interface Event {
  id: string;
  era: Era;
  /** Jahr für Reihenfolge und Zeitregler; negativ = v. Chr. */
  year: number;
  /** Datum, wie es dastehen soll. */
  when: BiText;
  de: string;
  en: string;
  /** Der zweite Name, wo die Benennung selbst umstritten ist. */
  alsoCalled?: BiText;
  kind: Kind;
  text: BiText;
  /** Bibelstelle, wo die Bibel das Ereignis erzählt. */
  ref?: string;
  /** Wo auf der Karte – Konflikte bekommen dort ihr Einschlagzeichen. */
  at?: [number, number];
  /** Gebietsstand, der ab hier gilt (Kennung aus israelGeo). */
  snapshot?: string;
  figures?: Figure[];
  /** Kennungen aus SOURCES – mindestens eine, sonst steht der Eintrag nicht da. */
  sources: string[];
  /** Suchbegriff für den Nachschlagewerk-Link. */
  topic?: string;
}

export const EVENTS: Event[] = [
  {
    id: 'landnahme',
    era: 'bible',
    year: -1250,
    when: { de: 'um 1250–1200 v. Chr.', en: 'c. 1250–1200 BC' },
    de: 'Landnahme',
    en: 'Settlement in Canaan',
    kind: 'other',
    text: {
      de: 'Josua führt die Stämme über den Jordan; das Land wird verlost. Außerhalb der Bibel taucht der Name „Israel" zum ersten Mal auf der Merenptah-Stele auf, um 1208 v. Chr. – als Volk, noch nicht als Staat.',
      en: 'Joshua leads the tribes across the Jordan and the land is divided by lot. Outside the Bible the name "Israel" first appears on the Merneptah Stele, around 1208 BC – as a people, not yet a state.',
    },
    ref: 'Jos 1–12',
    at: [31.87, 35.44],
    sources: ['bible', 'bpb'],
    topic: 'Merenptah-Stele',
  },
  {
    id: 'reichsteilung',
    era: 'bible',
    year: -930,
    when: { de: 'um 930 v. Chr.', en: 'c. 930 BC' },
    de: 'Die Reichsteilung',
    en: 'The kingdom splits',
    kind: 'other',
    text: {
      de: 'Nach Salomos Tod zerfällt das Reich: zehn Stämme folgen Jerobeam ins Nordreich Israel, zwei bleiben bei Rehabeam in Juda. Zwei Länder, zwei Könige – und von hier an zwei Geschichten.',
      en: 'After Solomon\'s death the kingdom breaks apart: ten tribes follow Jeroboam into the northern kingdom of Israel, two stay with Rehoboam in Judah. Two countries, two kings – and from here two histories.',
    },
    ref: '1Kön 12',
    at: [32.21, 35.28],
    sources: ['bible', 'bpb'],
    topic: 'Reichsteilung Israel Juda',
  },
  {
    id: 'samaria',
    era: 'bible',
    year: -722,
    when: { de: '722 v. Chr.', en: '722 BC' },
    de: 'Assyrien nimmt Samaria',
    en: 'Assyria takes Samaria',
    kind: 'exile',
    text: {
      de: 'Das Nordreich fällt nach drei Jahren Belagerung. Israel wird verschleppt, Fremde werden angesiedelt. Sargons II. Annalen nennen 27.290 Weggeführte – die erste Zahl dieser Art, die außerhalb der Bibel steht.',
      en: 'The northern kingdom falls after a three-year siege. Israel is deported and foreigners settled in its place. The annals of Sargon II give 27,290 people carried away – the first figure of its kind attested outside the Bible.',
    },
    ref: '2Kön 17',
    at: [32.28, 35.20],
    figures: [
      {
        label: { de: 'Weggeführte aus Samaria', en: 'Deported from Samaria' },
        value: { de: '27.290', en: '27,290' },
        source: 'britishmuseum',
        asOf: 'Annalen Sargons II., um 710 v. Chr.',
        note: { de: 'Die Zahl stammt vom Sieger und ist eine Herrscherinschrift, kein Melderegister.', en: 'The figure comes from the victor and is a royal inscription, not a register.' },
      },
    ],
    sources: ['bible', 'britishmuseum'],
    topic: 'Sargon II. Annalen Samaria',
  },
  {
    id: 'sanherib',
    era: 'bible',
    year: -701,
    when: { de: '701 v. Chr.', en: '701 BC' },
    de: 'Sanherib vor Jerusalem',
    en: 'Sennacherib at Jerusalem',
    kind: 'war',
    text: {
      de: 'Assyrien nimmt 46 Städte Judas, aber nicht Jerusalem. Sanheribs eigenes Tonprisma sagt, er habe Hiskia „wie einen Vogel im Käfig" eingeschlossen – und verschweigt, dass er wieder abzog. Beide Seiten erzählen dasselbe Ende verschieden.',
      en: 'Assyria takes 46 towns of Judah, but not Jerusalem. Sennacherib\'s own clay prism says he shut Hezekiah up "like a bird in a cage" – and passes over the fact that he withdrew. Both sides tell the same ending differently.',
    },
    ref: '2Kön 18–19',
    at: [31.78, 35.23],
    sources: ['bible', 'britishmuseum'],
    topic: 'Sanherib-Prisma Taylor Prism',
  },
  {
    id: 'babylon',
    era: 'bible',
    year: -586,
    when: { de: '586 v. Chr.', en: '586 BC' },
    de: 'Zerstörung des Ersten Tempels',
    en: 'Destruction of the First Temple',
    kind: 'exile',
    text: {
      de: 'Nebukadnezar nimmt Jerusalem, brennt den Tempel nieder und führt Juda nach Babylon. Die babylonische Chronik hält die erste Einnahme 597 auf den Tag genau fest – der Beginn dessen, was Diaspora heißt.',
      en: 'Nebuchadnezzar takes Jerusalem, burns the temple and carries Judah off to Babylon. The Babylonian Chronicle records the first capture in 597 to the day – the beginning of what is called the diaspora.',
    },
    ref: '2Kön 25',
    at: [31.78, 35.23],
    sources: ['bible', 'britishmuseum'],
    topic: 'Babylonische Chronik Jerusalem 597',
  },
  {
    id: 'rueckkehr',
    era: 'bible',
    year: -538,
    when: { de: '538 v. Chr.', en: '538 BC' },
    de: 'Rückkehr aus Babylon',
    en: 'Return from Babylon',
    kind: 'other',
    text: {
      de: 'Kyros erlaubt den Verschleppten die Heimkehr. Der Kyros-Zylinder nennt dieselbe Politik für andere Völker – ein Herrscher, der Rückkehr zur Ordnung erklärt. Von zwölf Stämmen kommt einer wieder und gibt dem Volk den Namen, den es seither trägt.',
      en: 'Cyrus permits the deported to go home. The Cyrus Cylinder records the same policy for other peoples – a ruler making return his order. Of twelve tribes one comes back, and gives the people the name it has carried ever since.',
    },
    ref: 'Esra 1',
    at: [31.78, 35.23],
    sources: ['bible', 'britishmuseum'],
    topic: 'Kyros-Zylinder',
  },
  {
    id: 'makkabaeer',
    era: 'bible',
    year: -164,
    when: { de: '167–142 v. Chr.', en: '167–142 BC' },
    de: 'Makkabäeraufstand',
    en: 'The Maccabean revolt',
    kind: 'uprising',
    text: {
      de: 'Antiochus IV. verbietet den Tempeldienst; der Aufstand der Makkabäer erkämpft ihn zurück und mit ihm für rund achtzig Jahre die Eigenstaatlichkeit. Die Tempelweihe von 164 wird bis heute als Chanukka begangen.',
      en: 'Antiochus IV bans the temple service; the Maccabean revolt wins it back, and with it some eighty years of independence. The rededication of 164 BC is still kept as Hanukkah.',
    },
    ref: '1Makk 1–4',
    at: [31.78, 35.23],
    sources: ['bible', 'bpb'],
    topic: 'Makkabäeraufstand',
  },
  {
    id: 'pompeius',
    era: 'rome',
    year: -63,
    when: { de: '63 v. Chr.', en: '63 BC' },
    de: 'Rom nimmt Jerusalem',
    en: 'Rome takes Jerusalem',
    kind: 'war',
    text: {
      de: 'Pompeius entscheidet einen Thronstreit der Hasmonäer, indem er die Stadt einnimmt. Judäa wird römisch – erst als Klientelkönigreich unter Herodes, dann als Provinz.',
      en: 'Pompey settles a Hasmonean succession quarrel by taking the city. Judea becomes Roman – first a client kingdom under Herod, then a province.',
    },
    at: [31.78, 35.23],
    sources: ['bpb', 'avalon'],
    topic: 'Pompeius Jerusalem 63 v. Chr.',
  },
  {
    id: 'tempel70',
    era: 'rome',
    year: 70,
    when: { de: '70 n. Chr.', en: 'AD 70' },
    de: 'Zerstörung des Zweiten Tempels',
    en: 'Destruction of the Second Temple',
    kind: 'war',
    text: {
      de: 'Der Jüdische Krieg endet mit der Einnahme Jerusalems und dem Brand des Tempels. Der Titusbogen in Rom zeigt die weggetragene Menora. Ohne Tempel wird aus dem Opferdienst das Lernhaus – das rabbinische Judentum entsteht.',
      en: 'The Jewish War ends with the capture of Jerusalem and the burning of the temple. The Arch of Titus in Rome shows the menorah carried off. Without a temple, sacrifice gives way to the house of study – rabbinic Judaism begins.',
    },
    at: [31.78, 35.23],
    sources: ['bpb', 'avalon'],
    topic: 'Zerstörung des Jerusalemer Tempels 70',
  },
  {
    id: 'barkochba',
    era: 'rome',
    year: 132,
    when: { de: '132–136 n. Chr.', en: 'AD 132–136' },
    de: 'Bar-Kochba-Aufstand',
    en: 'The Bar Kokhba revolt',
    kind: 'uprising',
    text: {
      de: 'Der zweite große Aufstand gegen Rom endet mit einer Niederlage, die alles verändert: Juden wird der Zutritt nach Jerusalem verwehrt, die Stadt wird Aelia Capitolina, die Provinz Syria Palaestina. Der Name, um den bis heute gestritten wird, ist eine römische Verwaltungsentscheidung.',
      en: 'The second great revolt against Rome ends in a defeat that changes everything: Jews are barred from Jerusalem, the city becomes Aelia Capitolina, the province Syria Palaestina. The name still fought over today began as a Roman administrative decision.',
    },
    at: [31.72, 35.13],
    sources: ['bpb', 'imj'],
    topic: 'Bar-Kochba-Aufstand',
  },
  {
    id: 'byzanz',
    era: 'diaspora',
    year: 324,
    when: { de: 'ab 324', en: 'from 324' },
    de: 'Christliches Byzanz',
    en: 'Christian Byzantium',
    kind: 'other',
    text: {
      de: 'Unter Konstantin wird Jerusalem christliche Pilgerstadt; die Grabeskirche entsteht. Für die jüdischen Gemeinden bleibt es bei Verboten und Auflagen – das Zentrum liegt jetzt in Babylonien und in Galiläa, wo Mischna und Talmud entstehen.',
      en: 'Under Constantine, Jerusalem becomes a Christian pilgrim city and the Church of the Holy Sepulchre is built. For the Jewish communities, bans and restrictions remain – the centre now lies in Babylonia and in Galilee, where the Mishnah and Talmud take shape.',
    },
    at: [31.78, 35.23],
    sources: ['bpb'],
    topic: 'Byzantinisches Palästina',
  },
  {
    id: 'arab638',
    era: 'diaspora',
    year: 638,
    when: { de: '638', en: '638' },
    de: 'Arabische Eroberung',
    en: 'The Arab conquest',
    kind: 'other',
    text: {
      de: 'Jerusalem ergibt sich dem Kalifen Umar. Auf dem Tempelberg entstehen Felsendom (691) und al-Aqsa-Moschee – für den Islam der Ort der Himmelsreise Mohammeds. Damit hat derselbe Hügel für drei Religionen einen Namen.',
      en: 'Jerusalem surrenders to the caliph Umar. The Dome of the Rock (691) and the al-Aqsa Mosque rise on the Temple Mount – for Islam the site of Muhammad\'s night journey. From now on the same hill carries a name for three religions.',
    },
    at: [31.78, 35.23],
    sources: ['bpb'],
    topic: 'Arabische Eroberung Jerusalems 638',
  },
  {
    id: 'kreuzzug',
    era: 'diaspora',
    year: 1099,
    when: { de: '1099', en: '1099' },
    de: 'Die Kreuzfahrer nehmen Jerusalem',
    en: 'The Crusaders take Jerusalem',
    kind: 'war',
    text: {
      de: 'Die Eroberung endet in einem Massaker an Muslimen und Juden. Das lateinische Königreich hält knapp neunzig Jahre; 1187 nimmt Saladin die Stadt zurück und lässt die jüdischen Gemeinden wiederkehren.',
      en: 'The conquest ends in a massacre of Muslims and Jews. The Latin kingdom lasts barely ninety years; in 1187 Saladin takes the city back and allows Jewish communities to return.',
    },
    at: [31.78, 35.23],
    sources: ['bpb'],
    topic: 'Kreuzfahrer Jerusalem 1099',
  },
  {
    id: 'sefarad',
    era: 'diaspora',
    year: 1492,
    when: { de: '1492', en: '1492' },
    de: 'Vertreibung aus Spanien',
    en: 'Expulsion from Spain',
    kind: 'exile',
    text: {
      de: 'Das Alhambra-Edikt vertreibt die jüdische Bevölkerung aus Kastilien und Aragón. Viele finden Aufnahme im Osmanischen Reich, auch in Safed und Jerusalem – Zerstreuung und Rückkehr sind in dieser Geschichte selten getrennt.',
      en: 'The Alhambra Decree expels the Jewish population from Castile and Aragon. Many are received in the Ottoman Empire, including Safed and Jerusalem – dispersion and return are seldom separate in this story.',
    },
    at: [40.42, -3.70],
    sources: ['bpb'],
    topic: 'Alhambra-Edikt 1492',
  },
  {
    id: 'osmanen',
    era: 'diaspora',
    year: 1517,
    when: { de: '1517–1917', en: '1517–1917' },
    de: 'Vier Jahrhunderte osmanisch',
    en: 'Four Ottoman centuries',
    kind: 'other',
    text: {
      de: 'Palästina wird osmanische Provinz und bleibt es vierhundert Jahre. Suleiman lässt die Stadtmauer Jerusalems bauen, die heute noch steht. Die jüdische Bevölkerung ist klein und lebt vor allem in den vier heiligen Städten Jerusalem, Hebron, Safed und Tiberias.',
      en: 'Palestine becomes an Ottoman province and stays one for four hundred years. Suleiman builds the wall of Jerusalem that still stands. The Jewish population is small and lives mainly in the four holy cities of Jerusalem, Hebron, Safed and Tiberias.',
    },
    at: [31.78, 35.23],
    snapshot: 'mandate',
    sources: ['bpb'],
    topic: 'Osmanisches Palästina',
  },
  {
    id: 'alija1',
    era: 'return',
    year: 1881,
    when: { de: 'ab 1881', en: 'from 1881' },
    de: 'Pogrome und Erste Alija',
    en: 'Pogroms and the First Aliyah',
    kind: 'other',
    text: {
      de: 'Nach der Ermordung Alexanders II. rollt eine Pogromwelle durch das Russische Reich. Zwei Millionen Menschen wandern aus, die meisten nach Amerika – einige Zehntausend nach Palästina. Es ist die erste der Einwanderungswellen, die Alija heißen: „Hinaufgehen".',
      en: 'After the assassination of Alexander II a wave of pogroms rolls through the Russian Empire. Two million people emigrate, most to America – a few tens of thousands to Palestine. It is the first of the waves of immigration called aliyah: "going up".',
    },
    at: [50.45, 30.52],
    sources: ['bpb'],
    topic: 'Erste Alija',
  },
  {
    id: 'basel',
    era: 'return',
    year: 1897,
    when: { de: '29.–31. August 1897', en: '29–31 August 1897' },
    de: 'Erster Zionistenkongress, Basel',
    en: 'First Zionist Congress, Basel',
    kind: 'other',
    text: {
      de: 'Theodor Herzl versammelt 200 Delegierte im Basler Stadtcasino. Das Programm nennt als Ziel eine „öffentlich-rechtlich gesicherte Heimstätte" in Palästina. Herzl notiert danach: „In Basel habe ich den Judenstaat gegründet." Es dauerte 51 Jahre.',
      en: 'Theodor Herzl gathers 200 delegates in the Basel city casino. The programme names as its aim a "home secured under public law" in Palestine. Herzl notes afterwards: "In Basel I founded the Jewish State." It took 51 years.',
    },
    at: [47.55, 7.59],
    sources: ['bpb', 'avalon'],
    topic: 'Erster Zionistenkongress Basel 1897',
  },
  {
    id: 'balfour',
    era: 'return',
    year: 1917,
    when: { de: '2. November 1917', en: '2 November 1917' },
    de: 'Balfour-Erklärung',
    en: 'The Balfour Declaration',
    kind: 'other',
    text: {
      de: 'Ein Brief des britischen Außenministers, 67 Wörter lang: Die Regierung sehe „mit Wohlwollen die Errichtung einer nationalen Heimstätte für das jüdische Volk in Palästina" – wobei nichts geschehen dürfe, was die Rechte der „bestehenden nichtjüdischen Gemeinschaften" beeinträchtige. Beide Hälften des Satzes werden seither gegeneinander gehalten.',
      en: 'A letter from the British foreign secretary, 67 words long: the government views "with favour the establishment in Palestine of a national home for the Jewish people" – provided nothing is done to prejudice the rights of "existing non-Jewish communities". Both halves of the sentence have been set against each other ever since.',
    },
    at: [51.50, -0.13],
    sources: ['avalon', 'bpb', 'unispal'],
    topic: 'Balfour-Deklaration',
  },
  {
    id: 'mandat',
    era: 'return',
    year: 1922,
    when: { de: '1920 / 1922', en: '1920 / 1922' },
    de: 'Britisches Mandat',
    en: 'The British Mandate',
    kind: 'other',
    text: {
      de: 'Der Völkerbund überträgt Großbritannien die Verwaltung Palästinas und nimmt die Balfour-Erklärung in den Mandatstext auf. Dieselbe Macht hat damit zwei Zusagen zu erfüllen, die einander im Weg stehen – ein Grundmuster der folgenden 25 Jahre.',
      en: 'The League of Nations gives Britain the administration of Palestine and writes the Balfour Declaration into the mandate text. The same power now owes two promises that stand in each other\'s way – the pattern of the next 25 years.',
    },
    at: [31.78, 35.23],
    snapshot: 'mandate',
    sources: ['avalon', 'unispal', 'bpb'],
    topic: 'Völkerbundsmandat für Palästina',
  },
  {
    id: 'peel',
    era: 'return',
    year: 1937,
    when: { de: 'Juli 1937', en: 'July 1937' },
    de: 'Peel-Kommission: erster Teilungsvorschlag',
    en: 'Peel Commission: first partition proposal',
    kind: 'other',
    text: {
      de: 'Nach drei Jahren arabischen Aufstands schlägt eine britische Kommission zum ersten Mal vor, das Land zu teilen. Die zionistische Seite nimmt den Grundsatz an, die arabische lehnt ab. Der Gedanke der Teilung ist damit in der Welt und kehrt 1947 wieder.',
      en: 'After three years of Arab revolt, a British commission proposes for the first time to partition the land. The Zionist side accepts the principle, the Arab side rejects it. The idea of partition is now in the world, and returns in 1947.',
    },
    at: [32.10, 34.85],
    sources: ['unispal', 'bpb'],
    topic: 'Peel-Kommission 1937',
  },
  {
    id: 'schoa',
    era: 'return',
    year: 1941,
    when: { de: '1933–1945', en: '1933–1945' },
    de: 'Die Schoa',
    en: 'The Shoah',
    kind: 'other',
    text: {
      de: 'Der nationalsozialistische Völkermord ermordet sechs Millionen Jüdinnen und Juden. Das britische Weißbuch von 1939 hatte die Einwanderung nach Palästina zugleich auf 75.000 in fünf Jahren begrenzt – Menschen, die fliehen wollten, fanden die Tür verschlossen. Ohne diese Jahre ist 1948 nicht zu verstehen.',
      en: 'The Nazi genocide murders six million Jews. Britain\'s 1939 White Paper had at the same time capped immigration to Palestine at 75,000 over five years – people who wanted to flee found the door shut. Without these years, 1948 cannot be understood.',
    },
    at: [50.03, 19.20],
    figures: [
      {
        label: { de: 'Ermordete', en: 'Murdered' },
        value: { de: 'etwa 6 Millionen', en: 'about 6 million' },
        source: 'yadvashem',
        asOf: 'Forschungsstand Yad Vashem',
      },
    ],
    sources: ['yadvashem', 'bpb'],
    topic: 'Schoa',
  },
  {
    id: 'un181',
    era: 'state',
    year: 1947,
    when: { de: '29. November 1947', en: '29 November 1947' },
    de: 'UN-Teilungsplan',
    en: 'UN Partition Plan',
    kind: 'other',
    text: {
      de: 'Die Generalversammlung beschließt mit 33 zu 13 Stimmen die Teilung in einen jüdischen und einen arabischen Staat, mit Jerusalem unter internationaler Verwaltung. Die jüdische Seite nimmt an, die arabischen Staaten und das Arabische Hohe Komitee lehnen ab. Noch in derselben Nacht beginnen die Kämpfe.',
      en: 'The General Assembly votes 33 to 13 for partition into a Jewish and an Arab state, with Jerusalem under international administration. The Jewish side accepts; the Arab states and the Arab Higher Committee reject it. Fighting begins the same night.',
    },
    at: [31.78, 35.23],
    snapshot: 'un1947',
    sources: ['undl181', 'unispal', 'bpb_konflikt'],
    topic: 'UN-Teilungsplan für Palästina',
  },
  {
    id: 'gruendung',
    era: 'state',
    year: 1948,
    when: { de: '14. Mai 1948', en: '14 May 1948' },
    de: 'Gründung des Staates Israel',
    en: 'Founding of the State of Israel',
    kind: 'founding',
    text: {
      de: 'Am Tag vor dem Ende des Mandats verliest David Ben-Gurion im Museum von Tel Aviv die Unabhängigkeitserklärung. Sie beruft sich auf das historische Band zum Land, auf die Schoa und auf den UN-Beschluss – und sagt allen Bewohnern gleiche Rechte zu. Die USA erkennen den Staat nach elf Minuten an, die Sowjetunion nach drei Tagen.',
      en: 'On the day before the Mandate ends, David Ben-Gurion reads the Declaration of Independence in the Tel Aviv Museum. It appeals to the historic bond with the land, to the Shoah and to the UN resolution – and promises equal rights to all inhabitants. The United States recognise the state after eleven minutes, the Soviet Union after three days.',
    },
    at: [32.06, 34.77],
    sources: ['gov_decl', 'bpb'],
    topic: 'Israelische Unabhängigkeitserklärung',
  },
  {
    id: 'krieg48',
    era: 'state',
    year: 1948,
    when: { de: '1948–1949', en: '1948–1949' },
    de: 'Unabhängigkeitskrieg',
    en: 'War of Independence',
    alsoCalled: { de: 'Nakba – „die Katastrophe"', en: 'Nakba – "the catastrophe"' },
    kind: 'war',
    text: {
      de: 'Fünf arabische Staaten greifen ein. Am Ende hält Israel mehr Gebiet als der Teilungsplan vorsah, Jordanien das Westjordanland, Ägypten den Gazastreifen; ein palästinensischer Staat entsteht nicht. Rund 700.000 Palästinenserinnen und Palästinenser fliehen oder werden vertrieben – dieselben Monate heißen auf der einen Seite Unabhängigkeit, auf der anderen Nakba.',
      en: 'Five Arab states intervene. Israel ends up holding more territory than the partition plan foresaw, Jordan the West Bank, Egypt the Gaza Strip; no Palestinian state comes into being. Around 700,000 Palestinians flee or are expelled – the same months are called independence on one side and Nakba on the other.',
    },
    at: [31.90, 34.90],
    snapshot: 'armistice1949',
    figures: [
      {
        label: { de: 'Palästinensische Flüchtlinge', en: 'Palestinian refugees' },
        value: { de: 'rund 700.000', en: 'around 700,000' },
        source: 'unrwa',
        asOf: 'UNRWA, Gründungszahl 1950',
        note: { de: 'UNRWA nahm 1950 rund 750.000 Anspruchsberechtigte in die Register auf; die Schätzungen der Geflohenen liegen zwischen 700.000 und 750.000.', en: 'UNRWA registered around 750,000 eligible people in 1950; estimates of those who fled range from 700,000 to 750,000.' },
      },
      {
        label: { de: 'Israelische Gefallene', en: 'Israeli dead' },
        value: { de: 'etwa 6.000', en: 'about 6,000' },
        source: 'bpb',
        asOf: 'Forschungsstand',
        note: { de: 'Etwa ein Prozent der damaligen jüdischen Bevölkerung.', en: 'About one per cent of the Jewish population at the time.' },
      },
    ],
    sources: ['unrwa', 'unispal', 'bpb', 'bpb_konflikt'],
    topic: 'Palästinakrieg 1948',
  },
  {
    id: 'waffenstillstand',
    era: 'state',
    year: 1949,
    when: { de: 'Februar–Juli 1949', en: 'February–July 1949' },
    de: 'Waffenstillstandslinien („Grüne Linie")',
    en: 'The armistice lines ("Green Line")',
    kind: 'treaty',
    text: {
      de: 'Vier Abkommen, auf Rhodos ausgehandelt, halten die Frontlinien fest. Der Text sagt ausdrücklich, dass sie keine politische Grenze festlegen und den Ansprüchen keiner Seite vorgreifen. Der grüne Stift auf der Karte gab der Linie ihren Namen – und sie ist bis heute die Bezugslinie jeder Verhandlung.',
      en: 'Four agreements, negotiated on Rhodes, fix the front lines. The text says expressly that they establish no political boundary and prejudge no side\'s claims. A green pencil on the map gave the line its name – and it is still the reference line of every negotiation.',
    },
    at: [31.85, 35.00],
    sources: ['unispal', 'avalon', 'bpb_konflikt'],
    topic: 'Waffenstillstandsabkommen 1949 Grüne Linie',
  },
  {
    id: 'suez',
    era: 'state',
    year: 1956,
    when: { de: 'Oktober–November 1956', en: 'October–November 1956' },
    de: 'Suez-Krise',
    en: 'The Suez Crisis',
    kind: 'war',
    text: {
      de: 'Nach der Verstaatlichung des Suezkanals greifen Israel, Großbritannien und Frankreich Ägypten an. Israel nimmt den Sinai, muss ihn auf Druck der USA und der Sowjetunion binnen Monaten wieder räumen. Zum ersten Mal überwacht eine UN-Truppe eine Waffenruhe.',
      en: 'After the nationalisation of the Suez Canal, Israel, Britain and France attack Egypt. Israel takes Sinai and has to give it up within months under American and Soviet pressure. For the first time a UN force supervises a ceasefire.',
    },
    at: [30.00, 32.55],
    sources: ['unispal', 'bpb_konflikt'],
    topic: 'Sueskrise 1956',
  },
  {
    id: 'sechstage',
    era: 'state',
    year: 1967,
    when: { de: '5.–10. Juni 1967', en: '5–10 June 1967' },
    de: 'Sechstagekrieg',
    en: 'Six-Day War',
    alsoCalled: { de: 'Juni-Krieg / an-Naksa – „der Rückschlag"', en: 'June War / an-Naksa – "the setback"' },
    kind: 'war',
    text: {
      de: 'In sechs Tagen nimmt Israel den Sinai, den Gazastreifen, das Westjordanland samt Ost-Jerusalem und die Golanhöhen – das Dreifache seiner bisherigen Fläche. Aus dem Sieg wird die Besatzung, die bis heute andauert, und die Lage, über die seither verhandelt wird.',
      en: 'In six days Israel takes Sinai, the Gaza Strip, the West Bank including East Jerusalem, and the Golan Heights – three times its previous area. Out of the victory comes the occupation that continues to this day, and the situation negotiated over ever since.',
    },
    at: [31.78, 35.23],
    snapshot: 'after1967',
    figures: [
      {
        label: { de: 'Erneut Vertriebene', en: 'Displaced again' },
        value: { de: 'rund 300.000', en: 'around 300,000' },
        source: 'unrwa',
        asOf: 'UNRWA, 1967',
        note: { de: 'Viele von ihnen waren schon 1948 geflohen.', en: 'Many of them had already fled in 1948.' },
      },
    ],
    sources: ['unispal', 'unrwa', 'bpb_konflikt'],
    topic: 'Sechstagekrieg',
  },
  {
    id: 'res242',
    era: 'state',
    year: 1967,
    when: { de: '22. November 1967', en: '22 November 1967' },
    de: 'Resolution 242: Land gegen Frieden',
    en: 'Resolution 242: land for peace',
    kind: 'ruling',
    text: {
      de: 'Der Sicherheitsrat fordert den Rückzug „aus Gebieten, die im jüngsten Konflikt besetzt wurden", und die Anerkennung sicherer Grenzen für jeden Staat der Region. Die englische Fassung sagt „from territories", die französische „des territoires" – ob alle gemeint sind, ist seit 1967 strittig. Der Satz ist die Grundlage aller späteren Verhandlungen.',
      en: 'The Security Council calls for withdrawal "from territories occupied in the recent conflict" and for recognition of secure boundaries for every state in the region. The English text says "from territories", the French "des territoires" – whether all are meant has been disputed since 1967. The sentence underlies every later negotiation.',
    },
    at: [40.75, -73.97],
    sources: ['undl242', 'unispal'],
    topic: 'UN-Resolution 242',
  },
  {
    id: 'jomkippur',
    era: 'state',
    year: 1973,
    when: { de: '6.–25. Oktober 1973', en: '6–25 October 1973' },
    de: 'Jom-Kippur-Krieg',
    en: 'Yom Kippur War',
    alsoCalled: { de: 'Oktoberkrieg / Ramadan-Krieg', en: 'October War / Ramadan War' },
    kind: 'war',
    text: {
      de: 'Ägypten und Syrien greifen am höchsten Feiertag an und durchbrechen die Linien am Suezkanal und auf dem Golan. Israel wendet das Blatt, aber der Schock sitzt tief. Der Krieg macht den Weg frei für Verhandlungen – und löst mit dem Ölembargo die erste weltweite Energiekrise aus.',
      en: 'Egypt and Syria attack on the holiest day and break through the lines at the Suez Canal and on the Golan. Israel turns the tide, but the shock runs deep. The war opens the way to negotiations – and, with the oil embargo, sets off the first worldwide energy crisis.',
    },
    at: [30.60, 32.35],
    figures: [
      {
        label: { de: 'Israelische Gefallene', en: 'Israeli dead' },
        value: { de: 'etwa 2.650', en: 'about 2,650' },
        source: 'bpb',
        asOf: 'Forschungsstand',
      },
    ],
    sources: ['bpb', 'bpb_konflikt', 'unispal'],
    topic: 'Jom-Kippur-Krieg',
  },
  {
    id: 'campdavid',
    era: 'state',
    year: 1979,
    when: { de: '1978 / 26. März 1979', en: '1978 / 26 March 1979' },
    de: 'Frieden mit Ägypten',
    en: 'Peace with Egypt',
    kind: 'treaty',
    text: {
      de: 'Nach Sadats Besuch in Jerusalem und dreizehn Tagen in Camp David schließen Ägypten und Israel Frieden – der erste zwischen Israel und einem arabischen Staat. Sadat und Begin erhalten den Friedensnobelpreis; Sadat wird 1981 dafür ermordet.',
      en: 'After Sadat\'s visit to Jerusalem and thirteen days at Camp David, Egypt and Israel make peace – the first between Israel and an Arab state. Sadat and Begin receive the Nobel Peace Prize; Sadat is assassinated for it in 1981.',
    },
    at: [30.04, 31.24],
    sources: ['avalon', 'peacemaker', 'bpb_konflikt'],
    topic: 'Israelisch-ägyptischer Friedensvertrag',
  },
  {
    id: 'sinai82',
    era: 'state',
    year: 1982,
    when: { de: '25. April 1982', en: '25 April 1982' },
    de: 'Der Sinai geht zurück',
    en: 'Sinai goes back',
    kind: 'treaty',
    text: {
      de: 'Israel räumt die Halbinsel vollständig, samt der Siedlung Jamit. Es ist der eine Fall, in dem „Land gegen Frieden" durchgeführt wurde – und der Vertrag hält bis heute. Im selben Jahr dehnt Israel sein Recht auf den Golan aus; der Sicherheitsrat erklärt das einstimmig für ungültig.',
      en: 'Israel evacuates the peninsula entirely, including the settlement of Yamit. It is the one case where "land for peace" was actually carried out – and the treaty holds to this day. In the same period Israel extends its law to the Golan; the Security Council unanimously declares this void.',
    },
    at: [29.55, 34.95],
    snapshot: 'after1982',
    sources: ['peacemaker', 'undl497'],
    topic: 'Rückgabe des Sinai 1982',
  },
  {
    id: 'libanon82',
    era: 'state',
    year: 1982,
    when: { de: 'Juni–September 1982', en: 'June–September 1982' },
    de: 'Libanonkrieg',
    en: 'Lebanon War',
    kind: 'war',
    text: {
      de: 'Israel marschiert in den Libanon ein, um die PLO zu vertreiben. In den Lagern Sabra und Schatila ermorden verbündete Milizen Hunderte bis über tausend Menschen; eine israelische Untersuchungskommission stellt eine indirekte Verantwortung Israels fest. Aus der Besatzung Südlibanons entsteht die Hisbollah.',
      en: 'Israel invades Lebanon to drive out the PLO. In the Sabra and Shatila camps, allied militias murder hundreds to over a thousand people; an Israeli commission of inquiry finds Israel indirectly responsible. Out of the occupation of southern Lebanon, Hezbollah emerges.',
    },
    at: [33.89, 35.50],
    sources: ['bpb_konflikt', 'unispal'],
    topic: 'Libanonkrieg 1982 Sabra und Schatila',
  },
  {
    id: 'intifada1',
    era: 'state',
    year: 1987,
    when: { de: 'Dezember 1987 – 1993', en: 'December 1987 – 1993' },
    de: 'Erste Intifada',
    en: 'First Intifada',
    kind: 'uprising',
    text: {
      de: 'Ein Verkehrsunfall in Gaza löst einen Aufstand aus, der sich über die besetzten Gebiete ausbreitet: Streiks, Steuerboykott, Steine gegen Panzer. Die Bilder verändern die Wahrnehmung weltweit und führen mittelbar an den Verhandlungstisch von Madrid und Oslo. In diesen Jahren entsteht die Hamas.',
      en: 'A traffic accident in Gaza sets off an uprising that spreads across the occupied territories: strikes, tax boycotts, stones against tanks. The images change perceptions worldwide and lead indirectly to the negotiating tables of Madrid and Oslo. Hamas emerges in these years.',
    },
    at: [31.52, 34.45],
    sources: ['bpb_konflikt', 'unispal'],
    topic: 'Erste Intifada',
  },
  {
    id: 'oslo',
    era: 'state',
    year: 1993,
    when: { de: '13. September 1993', en: '13 September 1993' },
    de: 'Oslo I – der Handschlag',
    en: 'Oslo I – the handshake',
    kind: 'treaty',
    text: {
      de: 'Nach geheimen Gesprächen in Norwegen erkennen sich Israel und die PLO gegenseitig an. Rabin und Arafat geben sich vor dem Weißen Haus die Hand. Vereinbart wird eine fünfjährige Selbstverwaltung; die schweren Fragen – Jerusalem, Flüchtlinge, Siedlungen, Grenzen – werden ausdrücklich vertagt. Vertagt sind sie bis heute.',
      en: 'After secret talks in Norway, Israel and the PLO recognise each other. Rabin and Arafat shake hands in front of the White House. Five years of self-rule are agreed; the hard questions – Jerusalem, refugees, settlements, borders – are expressly deferred. They are deferred still.',
    },
    at: [38.90, -77.04],
    sources: ['peacemaker', 'unispal', 'bpb_konflikt'],
    topic: 'Oslo-Abkommen',
  },
  {
    id: 'jordanien94',
    era: 'state',
    year: 1994,
    when: { de: '26. Oktober 1994', en: '26 October 1994' },
    de: 'Frieden mit Jordanien',
    en: 'Peace with Jordan',
    kind: 'treaty',
    text: {
      de: 'Der zweite Friedensvertrag Israels mit einem Nachbarn. Jordanien hatte 1988 seine Ansprüche auf das Westjordanland aufgegeben; der Vertrag regelt Grenze, Wasser und eine besondere Rolle Jordaniens bei den heiligen Stätten in Jerusalem.',
      en: 'Israel\'s second peace treaty with a neighbour. Jordan had given up its claims to the West Bank in 1988; the treaty settles the border, water, and a special Jordanian role at the holy sites in Jerusalem.',
    },
    at: [31.95, 35.93],
    sources: ['peacemaker', 'avalon'],
    topic: 'Israelisch-jordanischer Friedensvertrag',
  },
  {
    id: 'oslo2',
    era: 'state',
    year: 1995,
    when: { de: '28. September / 4. November 1995', en: '28 September / 4 November 1995' },
    de: 'Oslo II – und der Mord an Rabin',
    en: 'Oslo II – and the murder of Rabin',
    kind: 'treaty',
    text: {
      de: 'Das Interimsabkommen teilt das Westjordanland in die Zonen A, B und C. Fünf Wochen später erschießt ein israelischer Rechtsextremist Ministerpräsident Rabin auf einer Friedenskundgebung in Tel Aviv. Die Zoneneinteilung sollte fünf Jahre gelten; sie gilt seit dreißig.',
      en: 'The interim agreement divides the West Bank into Areas A, B and C. Five weeks later an Israeli right-wing extremist shoots Prime Minister Rabin at a peace rally in Tel Aviv. The division was meant to last five years; it has lasted thirty.',
    },
    at: [32.08, 34.78],
    snapshot: 'oslo1995',
    sources: ['peacemaker', 'unispal', 'bpb_konflikt'],
    topic: 'Oslo-II-Abkommen Zone A B C',
  },
  {
    id: 'intifada2',
    era: 'now',
    year: 2000,
    when: { de: 'September 2000 – 2005', en: 'September 2000 – 2005' },
    de: 'Zweite Intifada',
    en: 'Second Intifada',
    kind: 'uprising',
    text: {
      de: 'Nach dem Scheitern der Verhandlungen von Camp David und einem Besuch Ariel Scharons auf dem Tempelberg bricht ein weit blutigerer Aufstand aus, mit Selbstmordanschlägen in israelischen Städten und Militäroperationen in den palästinensischen. Am Ende stehen über 3.000 palästinensische und rund 1.000 israelische Tote – und auf beiden Seiten das Misstrauen, das die Verhandlungen seither begleitet.',
      en: 'After the failure of the Camp David talks and a visit by Ariel Sharon to the Temple Mount, a far bloodier uprising breaks out, with suicide bombings in Israeli cities and military operations in Palestinian ones. It leaves more than 3,000 Palestinians and around 1,000 Israelis dead – and, on both sides, the mistrust that has shadowed negotiations ever since.',
    },
    at: [31.78, 35.23],
    sources: ['bpb_konflikt', 'unispal'],
    topic: 'Zweite Intifada',
  },
  {
    id: 'sperranlage',
    era: 'now',
    year: 2002,
    when: { de: 'ab 2002 · Gutachten 9. Juli 2004', en: 'from 2002 · opinion 9 July 2004' },
    de: 'Die Sperranlage und das Haager Gutachten',
    en: 'The barrier and the Hague opinion',
    kind: 'ruling',
    text: {
      de: 'Israel beginnt eine Sperranlage zu bauen und begründet sie mit den Anschlägen der Intifada; die Zahl der Selbstmordanschläge geht danach stark zurück. Weil sie über weite Strecken nicht auf der Linie von 1949 verläuft, sondern im Westjordanland, erklärt der Internationale Gerichtshof 2004 den Verlauf für völkerrechtswidrig. Israel weist das Gutachten zurück.',
      en: 'Israel begins building a barrier, citing the bombings of the Intifada; the number of suicide attacks falls sharply afterwards. Because long stretches run not on the 1949 line but inside the West Bank, the International Court of Justice declares the route contrary to international law in 2004. Israel rejects the opinion.',
    },
    at: [31.90, 35.05],
    sources: ['icj131', 'ocha', 'bpb_konflikt'],
    topic: 'israelische Sperranlage Westjordanland',
  },
  {
    id: 'gazarueckzug',
    era: 'now',
    year: 2005,
    when: { de: 'August–September 2005', en: 'August–September 2005' },
    de: 'Rückzug aus Gaza',
    en: 'Withdrawal from Gaza',
    kind: 'other',
    text: {
      de: 'Israel räumt einseitig alle 21 Siedlungen im Gazastreifen und vier im nördlichen Westjordanland; rund 8.500 Siedler werden umgesiedelt, teils gegen ihren Willen. Israel erklärt die Besatzung Gazas damit für beendet. Die UN halten daran fest, dass es Luftraum, Küste und die meisten Übergänge weiter kontrolliert.',
      en: 'Israel unilaterally evacuates all 21 settlements in the Gaza Strip and four in the northern West Bank; some 8,500 settlers are relocated, in part against their will. Israel declares the occupation of Gaza ended. The UN maintains that it still controls the airspace, the coast and most crossings.',
    },
    at: [31.42, 34.36],
    snapshot: 'today',
    sources: ['ocha', 'unispal', 'bpb_konflikt'],
    topic: 'Israelischer Rückzug aus dem Gazastreifen 2005',
  },
  {
    id: 'libanon06',
    era: 'now',
    year: 2006,
    when: { de: '12. Juli – 14. August 2006', en: '12 July – 14 August 2006' },
    de: 'Zweiter Libanonkrieg',
    en: 'Second Lebanon War',
    kind: 'war',
    text: {
      de: 'Nach einem Überfall der Hisbollah auf eine israelische Patrouille folgen 34 Tage Krieg mit Luftangriffen im Libanon und Raketen auf Nordisrael. Resolution 1701 beendet ihn; die Grenze bleibt danach lange ruhig, ohne dass etwas gelöst wäre.',
      en: 'After a Hezbollah raid on an Israeli patrol, 34 days of war follow, with air strikes in Lebanon and rockets on northern Israel. Resolution 1701 ends it; the border then stays quiet for a long time without anything being settled.',
    },
    at: [33.27, 35.20],
    sources: ['unispal', 'bpb_konflikt'],
    topic: 'Libanonkrieg 2006',
  },
  {
    id: 'hamas07',
    era: 'now',
    year: 2007,
    when: { de: 'Juni 2007', en: 'June 2007' },
    de: 'Hamas übernimmt Gaza – die Blockade beginnt',
    en: 'Hamas takes Gaza – the blockade begins',
    kind: 'other',
    text: {
      de: 'Nach dem Wahlsieg der Hamas 2006 und dem Bruch mit der Fatah übernimmt sie den Gazastreifen militärisch. Israel und Ägypten verhängen eine Blockade, die bis heute gilt. Die palästinensische Seite hat seither zwei Regierungen: Ramallah und Gaza.',
      en: 'After Hamas wins the 2006 election and breaks with Fatah, it takes the Gaza Strip by force. Israel and Egypt impose a blockade that is still in place. The Palestinian side has had two governments ever since: Ramallah and Gaza.',
    },
    at: [31.50, 34.47],
    sources: ['ocha', 'bpb_konflikt'],
    topic: 'Hamas Machtübernahme Gazastreifen 2007',
  },
  {
    id: 'gazakriege',
    era: 'now',
    year: 2014,
    when: { de: '2008/09 · 2012 · 2014 · 2021', en: '2008/09 · 2012 · 2014 · 2021' },
    de: 'Vier Kriege um Gaza',
    en: 'Four wars over Gaza',
    kind: 'war',
    text: {
      de: 'Auf die Blockade folgt eine Reihe von Kriegen nach immer gleichem Muster: Raketen auf israelische Städte, Luftangriffe und Bodeneinsätze in Gaza, nach Wochen eine Waffenruhe ohne politische Lösung. Der Krieg von 2014 dauert fünfzig Tage – bis 2023 der längste.',
      en: 'The blockade is followed by a series of wars along the same pattern: rockets on Israeli towns, air strikes and ground operations in Gaza, and after weeks a ceasefire without a political settlement. The 2014 war lasts fifty days – the longest until 2023.',
    },
    at: [31.42, 34.36],
    sources: ['ocha', 'unispal', 'bpb_konflikt'],
    topic: 'Gazakrieg 2014',
  },
  {
    id: 'abraham',
    era: 'now',
    year: 2020,
    when: { de: '15. September 2020', en: '15 September 2020' },
    de: 'Abraham-Abkommen',
    en: 'The Abraham Accords',
    kind: 'treaty',
    text: {
      de: 'Die Vereinigten Arabischen Emirate und Bahrain nehmen diplomatische Beziehungen zu Israel auf, später auch Marokko und der Sudan. Zum ersten Mal geschieht das ohne vorherige Regelung der palästinensischen Frage – die arabische Friedensinitiative von 2002 hatte genau die zur Bedingung gemacht.',
      en: 'The United Arab Emirates and Bahrain establish diplomatic relations with Israel, later joined by Morocco and Sudan. For the first time this happens without a prior settlement of the Palestinian question – the 2002 Arab Peace Initiative had made exactly that a condition.',
    },
    at: [24.47, 54.37],
    sources: ['peacemaker', 'reuters'],
    topic: 'Abraham-Abkommen',
  },
  {
    id: 'okt2023',
    era: 'now',
    year: 2023,
    when: { de: '7. Oktober 2023', en: '7 October 2023' },
    de: 'Der 7. Oktober',
    en: '7 October',
    kind: 'attack',
    text: {
      de: 'Hamas und andere Gruppen durchbrechen die Sperranlage und überfallen Ortschaften, Militärposten und ein Musikfestival. Es ist der Tag mit den meisten getöteten Jüdinnen und Juden seit der Schoa. 251 Menschen werden als Geiseln nach Gaza verschleppt – Israelis wie Ausländer, Alte wie Kinder.',
      en: 'Hamas and other groups break through the barrier and attack towns, military posts and a music festival. It is the day with the most Jews killed since the Shoah. 251 people are taken hostage into Gaza – Israelis and foreigners, the old and children.',
    },
    at: [31.44, 34.55],
    figures: [
      {
        label: { de: 'Getötete in Israel', en: 'Killed in Israel' },
        value: { de: 'etwa 1.200', en: 'about 1,200' },
        source: 'reuters',
        asOf: '10/2023, israelische Behörden',
      },
      {
        label: { de: 'Verschleppte', en: 'Taken hostage' },
        value: { de: '251', en: '251' },
        source: 'reuters',
        asOf: '10/2023, israelische Behörden',
      },
    ],
    sources: ['reuters', 'tagesschau', 'ocha'],
    topic: 'Überfall der Hamas 7. Oktober 2023',
  },
  {
    id: 'gazakrieg',
    era: 'now',
    year: 2024,
    when: { de: 'seit Oktober 2023', en: 'since October 2023' },
    de: 'Der Krieg in Gaza',
    en: 'The war in Gaza',
    kind: 'war',
    text: {
      de: 'Israels Militäroffensive dauert zwei Jahre. Der größte Teil der Bevölkerung Gazas wird vertrieben, oft mehrfach; weite Teile der Städte liegen in Trümmern, die Versorgung bricht ein. Über das rechtliche Urteil wird vor internationalen Gerichten gestritten. Die Zahlen unten stammen von den genannten Stellen, sind umstritten und ändern sich – der Verweis auf UN OCHA führt zur laufenden Zählung.',
      en: 'Israel\'s military offensive lasts two years. Most of Gaza\'s population is displaced, often repeatedly; large parts of the cities lie in ruins and supplies collapse. The legal judgement is contested before international courts. The figures below come from the bodies named, are disputed, and change – the link to UN OCHA leads to the running count.',
    },
    at: [31.42, 34.38],
    figures: [
      {
        label: { de: 'Getötete in Gaza', en: 'Killed in Gaza' },
        value: { de: 'mehr als 60.000', en: 'more than 60,000' },
        source: 'ocha',
        asOf: '07/2025',
        note: { de: 'Erhebung des Gesundheitsministeriums in Gaza, von den UN übernommen und weitergegeben. Israel bestreitet die Zahl; unabhängige Erhebungen vor Ort sind während des Krieges nicht möglich.', en: 'Recorded by the health ministry in Gaza, relayed by the UN. Israel disputes the figure; independent surveys on the ground are not possible during the war.' },
      },
      {
        label: { de: 'Vertriebene', en: 'Displaced' },
        value: { de: 'rund 1,9 Millionen', en: 'around 1.9 million' },
        source: 'ocha',
        asOf: '2024/25',
        note: { de: 'Etwa neun von zehn Bewohnern des Gazastreifens.', en: 'About nine in ten residents of the Gaza Strip.' },
      },
    ],
    sources: ['ocha', 'icj186', 'reuters', 'tagesschau'],
    topic: 'Krieg in Gaza seit 2023',
  },
  {
    id: 'icj2024',
    era: 'now',
    year: 2024,
    when: { de: '19. Juli 2024', en: '19 July 2024' },
    de: 'Haager Gutachten zur Besatzung',
    en: 'Hague opinion on the occupation',
    kind: 'ruling',
    text: {
      de: 'Der Internationale Gerichtshof erklärt die fortdauernde israelische Anwesenheit in den 1967 besetzten Gebieten für völkerrechtswidrig und fordert ihre Beendigung. Das Gutachten ist nicht vollstreckbar; Israel weist es zurück. Es ist gleichwohl die bislang deutlichste Aussage des höchsten UN-Gerichts zu dieser Frage.',
      en: 'The International Court of Justice declares Israel\'s continued presence in the territories occupied in 1967 unlawful and calls for it to end. The opinion is not enforceable; Israel rejects it. It is nonetheless the clearest statement to date by the UN\'s highest court on the question.',
    },
    at: [52.09, 4.30],
    sources: ['icj186', 'unispal', 'tagesschau'],
    topic: 'IGH-Gutachten 2024 besetzte palästinensische Gebiete',
  },
  {
    id: 'libanon2024',
    era: 'now',
    year: 2024,
    when: { de: 'September–November 2024', en: 'September–November 2024' },
    de: 'Krieg gegen die Hisbollah',
    en: 'War against Hezbollah',
    kind: 'war',
    text: {
      de: 'Nach einem Jahr gegenseitigen Beschusses über die Nordgrenze führt Israel eine Luft- und Bodenoffensive im Libanon, bei der die Führung der Hisbollah weitgehend getötet wird. Im November tritt eine Waffenruhe in Kraft. Auf beiden Seiten der Grenze waren zuvor Zehntausende evakuiert.',
      en: 'After a year of exchanges of fire across the northern border, Israel mounts an air and ground offensive in Lebanon in which most of Hezbollah\'s leadership is killed. A ceasefire takes effect in November. Tens of thousands had been evacuated on both sides of the border.',
    },
    at: [33.55, 35.50],
    sources: ['reuters', 'tagesschau'],
    topic: 'Israel Hisbollah 2024',
  },
  {
    id: 'iran2025',
    era: 'now',
    year: 2025,
    when: { de: '13.–24. Juni 2025', en: '13–24 June 2025' },
    de: 'Zwölf Tage Krieg mit Iran',
    en: 'Twelve days of war with Iran',
    kind: 'war',
    text: {
      de: 'Aus dem jahrzehntelangen Schattenkrieg wird ein offener: Israel greift iranische Atomanlagen und Militärführung an, Iran antwortet mit Raketen auf israelische Städte, die USA greifen einmal ein. Nach zwölf Tagen gilt eine Waffenruhe. Wie weit das iranische Atomprogramm zurückgeworfen wurde, ist strittig.',
      en: 'The decades-long shadow war becomes an open one: Israel strikes Iranian nuclear sites and military leadership, Iran answers with missiles on Israeli cities, and the United States intervene once. After twelve days a ceasefire holds. How far the Iranian nuclear programme was set back is disputed.',
    },
    at: [35.69, 51.39],
    sources: ['reuters', 'tagesschau'],
    topic: 'Israel Iran Krieg Juni 2025',
  },
  {
    id: 'waffenruhe2025',
    era: 'now',
    year: 2025,
    when: { de: '10. Oktober 2025', en: '10 October 2025' },
    de: 'Waffenruhe in Gaza',
    en: 'Ceasefire in Gaza',
    kind: 'treaty',
    text: {
      de: 'Nach zwei Jahren tritt eine Waffenruhe in Kraft: die verbliebenen lebenden Geiseln kommen frei, palästinensische Gefangene werden entlassen, Hilfslieferungen laufen an, israelische Truppen ziehen sich auf eine Linie innerhalb Gazas zurück. Über den Wiederaufbau, die Entwaffnung und die künftige Verwaltung ist damit nichts entschieden.',
      en: 'After two years a ceasefire takes effect: the remaining living hostages are freed, Palestinian prisoners released, aid deliveries begin and Israeli forces pull back to a line inside Gaza. Nothing is thereby settled about reconstruction, disarmament or future administration.',
    },
    at: [31.42, 34.38],
    sources: ['reuters', 'tagesschau', 'ocha'],
    topic: 'Waffenruhe Gaza Oktober 2025',
  },
];

export const EVENT_BY_ID = Object.fromEntries(EVENTS.map((e) => [e.id, e])) as Record<string, Event>;

/** Erstes und letztes Jahr – die Enden des Reglers. */
export const FIRST_YEAR = EVENTS[0].year;
export const LAST_YEAR = EVENTS[EVENTS.length - 1].year;

/**
 * Der Stand, auf den sich die jüngsten Zahlen dieser Datei beziehen. Steht im
 * Modus sichtbar dabei: Wer im Jahr darauf hereinschaut, soll sehen, dass die
 * Zahlen alt sind, statt sie für heute zu halten.
 */
export const DATA_AS_OF = { de: 'Oktober 2025', en: 'October 2025' };

/** „722 v. Chr." / „1948" – Jahre vor der Zeitenwende bekommen ihren Zusatz. */
export function formatYear(year: number, lang: 'de' | 'en'): string {
  if (year >= 0) return String(year);
  return lang === 'de' ? `${-year} v. Chr.` : `${-year} BC`;
}
