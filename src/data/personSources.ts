// Zeitdokumente, Bilder und Artikel zu den Personen des Zeitbaums.
//
// Was hier steht, ist bewusst getrennt von `genealogy.ts`: dort die biblische
// Linie, hier das, was AUSSERHALB der Bibel von diesen Menschen erhalten ist –
// Inschriften, Chroniken, Prozessakten, Briefe, Urkunden, Papyri.
//
// Zwei Regeln, an denen die Ehrlichkeit der Sammlung hängt:
//
//  1. `named: true` heißt: das Dokument nennt diese Person (oder ihr Haus)
//     ausdrücklich. `named: false` heißt: es ist ein Zeitdokument IHRER WELT –
//     es zeigt die Lage, die Rechtsbräuche, das Ereignis, aber nicht den Namen.
//     Die Karte schreibt das ans Dokument, damit niemand mehr herausliest, als
//     dort steht.
//  2. Wo es zu einer Person schlicht nichts gibt, steht das als `noteDe/noteEn`
//     ausdrücklich da, statt die Lücke mit Ungefährem zu füllen.
//
// Bilder und Artikeltexte werden NICHT mitgeliefert: zu jedem Eintrag steht nur
// ein Suchbegriff, den `lib/wikipediaArticle.ts` zur Laufzeit bei Wikipedia
// auflöst (Einleitung + Bild von Wikimedia Commons, mit Herkunftslink).
// Darstellungen antiker Personen sind fast immer spätere Kunst – die Karte sagt
// das dazu.

/** Art des Dokuments – bestimmt Etikett und Farbe am Eintrag. */
export type DocKind =
  | 'inschrift'
  | 'chronik'
  | 'historiker'
  | 'papyrus'
  | 'akte'
  | 'siegel'
  | 'brief'
  | 'relief'
  | 'handschrift'
  | 'fund';

export const DOC_KIND: Record<DocKind, { de: string; en: string; color: string }> = {
  inschrift: { de: 'Inschrift', en: 'Inscription', color: '#c98a2b' },
  chronik: { de: 'Chronik', en: 'Chronicle', color: '#3a6ea8' },
  historiker: { de: 'Geschichtsschreiber', en: 'Historian', color: '#2f8f7f' },
  papyrus: { de: 'Papyrus', en: 'Papyrus', color: '#a8895a' },
  akte: { de: 'Akte / Urkunde', en: 'Record / charter', color: '#b0436b' },
  siegel: { de: 'Siegel', en: 'Seal', color: '#a89321' },
  brief: { de: 'Brief', en: 'Letter', color: '#7a5aa8' },
  relief: { de: 'Relief', en: 'Relief', color: '#b8742e' },
  handschrift: { de: 'Handschrift', en: 'Manuscript', color: '#5c8a3a' },
  fund: { de: 'Fund', en: 'Excavation find', color: '#7d8a86' },
};

export interface HistDoc {
  kind: DocKind;
  /** Titel des Dokuments. */
  de: string;
  en: string;
  /** Suchbegriff für Wikipedia (Bild + Artikel), je Sprache. */
  wiki: string;
  wikiEn: string;
  dateDe: string;
  dateEn: string;
  /** Was das Dokument über diese Person sagt. */
  saysDe: string;
  saysEn: string;
  /** Fundort / Aufbewahrung. */
  whereDe?: string;
  whereEn?: string;
  /** true = nennt die Person ausdrücklich; false = Zeitdokument ihrer Welt. */
  named: boolean;
}

export interface PersonSource {
  /** Wikipedia-Suchbegriff der Person selbst (Bild + Artikeleinstieg). */
  wiki?: string;
  wikiEn?: string;
  /** Einordnung des Bildes, z. B. „Spätere Darstellung, kein Porträt". */
  imageDe?: string;
  imageEn?: string;
  /** Ehrliche Vorbemerkung zur Quellenlage. */
  noteDe?: string;
  noteEn?: string;
  docs: HistDoc[];
}

const ART_DE = 'Spätere Darstellung – kein zeitgenössisches Bild.';
const ART_EN = 'A later depiction – no contemporary likeness exists.';
const PORTRAIT_DE = 'Zeitgenössisches Porträt.';
const PORTRAIT_EN = 'Contemporary portrait.';
const PHOTO_DE = 'Fotografie.';
const PHOTO_EN = 'Photograph.';

export const PERSON_SOURCES: Record<string, PersonSource> = {
  // ---------------------------------------------------------------- Erzväter
  abraham: {
    wiki: 'Abraham', wikiEn: 'Abraham', imageDe: ART_DE, imageEn: ART_EN,
    noteDe: 'Kein Dokument seiner Zeit nennt Abraham. Erhalten ist die Welt, in der die Erzählung spielt – ihre Sprache, ihr Recht, ihre Wanderungen.',
    noteEn: 'No document of his time names Abraham. What survives is the world the story is set in – its language, its law, its migrations.',
    docs: [
      {
        kind: 'papyrus', de: 'Archiv von Mari', en: 'Mari archives', wiki: 'Mari (Stadt)', wikiEn: 'Mari, Syria',
        dateDe: '≈ 1800–1760 v. Chr.', dateEn: '≈ 1800–1760 BC',
        saysDe: 'Rund 20 000 Tontafeln aus einer amoritischen Stadt am Euphrat: Stammesnamen, Wanderweidewirtschaft, Bündnisriten – die Lebensform der Erzvätererzählungen, dokumentiert.',
        saysEn: 'Some 20,000 clay tablets from an Amorite city on the Euphrates: tribal names, seasonal herding, covenant rites – the very way of life the patriarchal stories describe.',
        whereDe: 'Tell Hariri, Syrien · Louvre, Paris', whereEn: 'Tell Hariri, Syria · Louvre, Paris', named: false,
      },
      {
        kind: 'akte', de: 'Rechtsurkunden von Nuzi', en: 'Nuzi tablets', wiki: 'Nuzi', wikiEn: 'Nuzi',
        dateDe: '15. Jh. v. Chr.', dateEn: '15th century BC',
        saysDe: 'Verträge über Adoption, Erbrecht und die Ersatzfrau bei Kinderlosigkeit – dieselben Rechtsbräuche, nach denen Abraham mit Elieser, Hagar und Ismael verfährt.',
        saysEn: 'Contracts on adoption, inheritance and the surrogate wife in childlessness – the legal customs behind Abraham’s dealings with Eliezer, Hagar and Ishmael.',
        whereDe: 'Yorgan Tepe bei Kirkuk, Irak', whereEn: 'Yorgan Tepe near Kirkuk, Iraq', named: false,
      },
      {
        kind: 'relief', de: 'Wandbild von Beni Hasan', en: 'Beni Hasan wall painting', wiki: 'Beni Hasan', wikiEn: 'Beni Hasan',
        dateDe: '≈ 1890 v. Chr.', dateEn: '≈ 1890 BC',
        saysDe: 'Im Grab des Chnumhotep II. zieht eine Gruppe semitischer Händler mit Eseln, bunten Gewändern und Waffen nach Ägypten – so sah aus, wer damals aus Kanaan hinabzog.',
        saysEn: 'In the tomb of Khnumhotep II a party of Semitic traders enters Egypt with donkeys, coloured robes and weapons – this is what going down from Canaan looked like.',
        whereDe: 'Mittelägypten', whereEn: 'Middle Egypt', named: false,
      },
    ],
  },

  josef: {
    wiki: 'Josef (Sohn Jakobs)', wikiEn: 'Joseph (Genesis)', imageDe: ART_DE, imageEn: ART_EN,
    noteDe: 'Ein ägyptischer Wesir namens Josef ist nicht belegt. Belegt ist, dass Semiten in Ägypten dienten, aufstiegen und dort ganze Stadtviertel bewohnten.',
    noteEn: 'No Egyptian vizier named Joseph is attested. What is attested: Semites served in Egypt, rose in rank, and lived there in whole quarters.',
    docs: [
      {
        kind: 'papyrus', de: 'Papyrus Brooklyn 35.1446', en: 'Brooklyn Papyrus 35.1446', wiki: 'Papyrus Brooklyn 35.1446', wikiEn: 'Brooklyn Papyrus',
        dateDe: '≈ 1740 v. Chr.', dateEn: '≈ 1740 BC',
        saysDe: 'Die Dienerliste eines ägyptischen Haushalts – über die Hälfte der Namen ist semitisch, viele mit ägyptischem Zweitnamen, wie ihn auch Josef bekommt (Zafenat-Paneach).',
        saysEn: 'The servant list of an Egyptian household – over half the names are Semitic, many with an Egyptian second name of the kind Joseph is given (Zaphenath-Paneah).',
        whereDe: 'Brooklyn Museum, New York', whereEn: 'Brooklyn Museum, New York', named: false,
      },
      {
        kind: 'fund', de: 'Awaris / Tell el-Dab‘a', en: 'Avaris / Tell el-Dab‘a', wiki: 'Auaris', wikiEn: 'Avaris',
        dateDe: '19.–16. Jh. v. Chr.', dateEn: '19th–16th century BC',
        saysDe: 'Im östlichen Nildelta – der Gegend, die die Bibel Goschen nennt – lag eine Stadt kanaanäischer Einwanderer mit eigenen Häusern, Gräbern und Kult; aus ihr wurden später die Hyksos-Herrscher.',
        saysEn: 'In the eastern Nile delta – the region the Bible calls Goshen – stood a city of Canaanite immigrants with their own houses, tombs and cult; from it the Hyksos rulers later came.',
        whereDe: 'Östliches Nildelta, Ägypten', whereEn: 'Eastern Nile delta, Egypt', named: false,
      },
    ],
  },

  mose: {
    wiki: 'Mose', wikiEn: 'Moses', imageDe: ART_DE, imageEn: ART_EN,
    noteDe: 'Kein ägyptischer Text nennt Mose oder den Auszug – Niederlagen wurden in Ägypten nicht aufgeschrieben. Die Grenzakten der Zeit zeigen aber genau die Bewegungen, um die es geht.',
    noteEn: 'No Egyptian text names Moses or the Exodus – defeats were not recorded in Egypt. The border records of the period do show exactly the movements in question.',
    docs: [
      {
        kind: 'papyrus', de: 'Papyrus Anastasi VI', en: 'Papyrus Anastasi VI', wiki: 'Papyrus Anastasi', wikiEn: 'Papyrus Anastasi I',
        dateDe: '≈ 1200 v. Chr.', dateEn: '≈ 1200 BC',
        saysDe: 'Ein Grenzbeamter meldet, er habe „Schasu-Stämme aus Edom" an der Festung Merenptahs vorbeiziehen lassen, damit sie und ihr Vieh am Leben blieben – Hirtennomaden zwischen Sinai und Delta, amtlich vermerkt.',
        saysEn: 'A frontier official reports letting "Shasu tribes from Edom" pass the fortress of Merneptah so that they and their cattle might live – shepherd nomads between Sinai and the delta, in an official file.',
        whereDe: 'British Museum, London', whereEn: 'British Museum, London', named: false,
      },
      {
        kind: 'papyrus', de: 'Papyrus Anastasi V', en: 'Papyrus Anastasi V', wiki: 'Papyrus Anastasi', wikiEn: 'Papyrus Anastasi I',
        dateDe: '13. Jh. v. Chr.', dateEn: '13th century BC',
        saysDe: 'Der Bericht über zwei entlaufene Sklaven, denen man bis zur Grenzmauer nachsetzt: Flucht aus Ägypten war ein Verwaltungsvorgang mit Verfolgung.',
        saysEn: 'A report on two runaway slaves pursued as far as the border wall: fleeing Egypt was an administrative matter, and it was pursued.',
        whereDe: 'British Museum, London', whereEn: 'British Museum, London', named: false,
      },
    ],
  },

  josua: {
    wiki: 'Josua', wikiEn: 'Joshua', imageDe: ART_DE, imageEn: ART_EN,
    docs: [
      {
        kind: 'inschrift', de: 'Merenptah-Stele („Israel-Stele")', en: 'Merneptah Stele ("Israel Stele")', wiki: 'Merenptah-Stele', wikiEn: 'Merneptah Stele',
        dateDe: '1208 v. Chr.', dateEn: '1208 BC',
        saysDe: 'Pharao Merenptah rühmt sich seiner Siege in Kanaan: „Israel ist verwüstet, seine Saat ist nicht mehr." Die älteste außerbiblische Nennung Israels – als Volk, nicht als Staat, und schon im Land.',
        saysEn: 'Pharaoh Merneptah boasts of his victories in Canaan: "Israel is laid waste, its seed is no more." The earliest extra-biblical mention of Israel – as a people, not a state, and already in the land.',
        whereDe: 'Ägyptisches Museum, Kairo', whereEn: 'Egyptian Museum, Cairo', named: false,
      },
      {
        kind: 'brief', de: 'Amarna-Briefe', en: 'Amarna letters', wiki: 'Amarna-Briefe', wikiEn: 'Amarna letters',
        dateDe: '14. Jh. v. Chr.', dateEn: '14th century BC',
        saysDe: 'Stadtkönige Kanaans – auch der von Jerusalem – betteln den Pharao um Truppen an: das Land zerfalle, überall fielen „Habiru" ein. Kanaan war ein Flickenteppich kleiner Stadtstaaten, genau wie im Josuabuch.',
        saysEn: 'City-kings of Canaan – Jerusalem among them – beg Pharaoh for troops: the land is falling apart, "Habiru" are overrunning it. Canaan was a patchwork of small city-states, exactly as in the book of Joshua.',
        whereDe: 'Tell el-Amarna, Ägypten · Berlin, London, Kairo', whereEn: 'Tell el-Amarna, Egypt · Berlin, London, Cairo', named: false,
      },
    ],
  },

  // -------------------------------------------------------------- Königtum
  david: {
    wiki: 'David', wikiEn: 'David', imageDe: ART_DE, imageEn: ART_EN,
    docs: [
      {
        kind: 'inschrift', de: 'Tel-Dan-Stele', en: 'Tel Dan Stele', wiki: 'Tel-Dan-Stele', wikiEn: 'Tel Dan Stele',
        dateDe: '≈ 840 v. Chr.', dateEn: '≈ 840 BC',
        saysDe: 'Ein aramäischer König (wohl Hasaël von Damaskus) rühmt sich, den König von Israel und den König vom „Haus Davids" (bytdwd) erschlagen zu haben – der erste außerbiblische Beleg für Davids Dynastie, rund 150 Jahre nach ihm.',
        saysEn: 'An Aramean king (probably Hazael of Damascus) boasts of killing the king of Israel and the king of the "House of David" (bytdwd) – the first extra-biblical evidence for David’s dynasty, some 150 years after him.',
        whereDe: 'Tel Dan, Obergaliläa · Israel-Museum, Jerusalem', whereEn: 'Tel Dan, Upper Galilee · Israel Museum, Jerusalem', named: true,
      },
      {
        kind: 'inschrift', de: 'Mescha-Stele', en: 'Mesha Stele', wiki: 'Mescha-Stele', wikiEn: 'Mesha Stele',
        dateDe: '≈ 840 v. Chr.', dateEn: '≈ 840 BC',
        saysDe: 'König Mescha von Moab erzählt seinen Aufstand gegen Israel – dieselbe Geschichte wie 2. Könige 3, aus der Gegenseite erzählt. In Zeile 31 lesen viele Forscher ebenfalls „Haus Davids".',
        saysEn: 'King Mesha of Moab tells of his revolt against Israel – the same story as 2 Kings 3, told from the other side. In line 31 many scholars read "House of David" as well.',
        whereDe: 'Dibon, Jordanien · Louvre, Paris', whereEn: 'Dhiban, Jordan · Louvre, Paris', named: true,
      },
    ],
  },

  salomo: {
    wiki: 'Salomo', wikiEn: 'Solomon', imageDe: ART_DE, imageEn: ART_EN,
    noteDe: 'Kein Text außerhalb der Bibel nennt Salomo. Was bleibt, ist die Zeit, in der er regiert haben soll – ihre Schrift und ihr Baustil.',
    noteEn: 'No text outside the Bible names Solomon. What remains is the age he is said to have ruled in – its writing and its building.',
    docs: [
      {
        kind: 'inschrift', de: 'Gezer-Kalender', en: 'Gezer calendar', wiki: 'Gezer-Kalender', wikiEn: 'Gezer calendar',
        dateDe: '10. Jh. v. Chr.', dateEn: '10th century BC',
        saysDe: 'Eine kleine Kalksteintafel mit dem Bauernjahr in acht Zeilen – eines der ältesten hebräischen Schriftstücke überhaupt und der Beleg, dass man in Salomos Jahrhundert im Land schrieb.',
        saysEn: 'A small limestone tablet listing the farmer’s year in eight lines – among the oldest Hebrew texts there are, and proof that people in Solomon’s century wrote in the land.',
        whereDe: 'Geser · Archäologisches Museum Istanbul', whereEn: 'Gezer · Istanbul Archaeology Museums', named: false,
      },
    ],
  },

  rehabeam: {
    wiki: 'Rehabeam', wikiEn: 'Rehoboam', imageDe: ART_DE, imageEn: ART_EN,
    docs: [
      {
        kind: 'relief', de: 'Feldzugsrelief Scheschonqs I. in Karnak', en: 'Shoshenq I campaign relief at Karnak', wiki: 'Scheschonq I.', wikiEn: 'Shoshenq I',
        dateDe: '≈ 925 v. Chr.', dateEn: '≈ 925 BC',
        saysDe: 'An der Wand des Amun-Tempels listet Pharao Scheschonq I. – der biblische Sisak – über 150 eroberte Orte in Israel und Juda auf. 1. Könige 14,25 datiert denselben Feldzug ins fünfte Jahr Rehabeams.',
        saysEn: 'On the wall of the Amun temple, Pharaoh Shoshenq I – the biblical Shishak – lists over 150 captured towns in Israel and Judah. 1 Kings 14:25 dates the same campaign to Rehoboam’s fifth year.',
        whereDe: 'Karnak, Ägypten', whereEn: 'Karnak, Egypt', named: false,
      },
    ],
  },

  ahasja: {
    wiki: 'Ahasja (Juda)', wikiEn: 'Ahaziah of Judah', imageDe: ART_DE, imageEn: ART_EN,
    docs: [
      {
        kind: 'inschrift', de: 'Tel-Dan-Stele', en: 'Tel Dan Stele', wiki: 'Tel-Dan-Stele', wikiEn: 'Tel Dan Stele',
        dateDe: '≈ 840 v. Chr.', dateEn: '≈ 840 BC',
        saysDe: 'Der aramäische Sieger nennt zwei erschlagene Könige: den von Israel und den vom „Haus Davids". Die meisten Forscher lesen darin Joram von Israel und Ahasja von Juda – die beiden, die nach 2. Könige 9 gemeinsam umkamen.',
        saysEn: 'The Aramean victor names two slain kings: the king of Israel and the king of the "House of David". Most scholars read these as Joram of Israel and Ahaziah of Judah – the pair who die together in 2 Kings 9.',
        whereDe: 'Israel-Museum, Jerusalem', whereEn: 'Israel Museum, Jerusalem', named: false,
      },
    ],
  },

  usija: {
    wiki: 'Usija', wikiEn: 'Uzziah', imageDe: ART_DE, imageEn: ART_EN,
    docs: [
      {
        kind: 'inschrift', de: 'Usija-Tafel', en: 'Uzziah tablet', wiki: 'Usija-Tafel', wikiEn: 'Uzziah Tablet',
        dateDe: '1. Jh. n. Chr.', dateEn: '1st century AD',
        saysDe: 'Eine aramäische Grabtafel: „Hierher wurden die Gebeine Usijas, des Königs von Juda, gebracht – nicht öffnen!" Seine Gebeine wurden also Jahrhunderte später noch einmal umgebettet und neu beschriftet.',
        saysEn: 'An Aramaic burial plaque: "Here were brought the bones of Uzziah, king of Judah – do not open!" His bones were reburied and labelled afresh centuries after his death.',
        whereDe: 'Israel-Museum, Jerusalem', whereEn: 'Israel Museum, Jerusalem', named: true,
      },
      {
        kind: 'siegel', de: 'Siegel „Abijau, Diener des Usija"', en: 'Seal of "Abiyaw, servant of Uzziah"', wiki: 'Usija', wikiEn: 'Uzziah',
        dateDe: '8. Jh. v. Chr.', dateEn: '8th century BC',
        saysDe: 'Ein Beamtensiegel nennt seinen Dienstherrn beim Namen – so unterschrieb die Verwaltung eines Königs von Juda.',
        saysEn: 'An official’s seal names his master – this is how the administration of a king of Judah signed its documents.',
        named: true,
      },
    ],
  },

  ahas: {
    wiki: 'Ahas', wikiEn: 'Ahaz', imageDe: ART_DE, imageEn: ART_EN,
    docs: [
      {
        kind: 'inschrift', de: 'Tributliste Tiglat-Pilesers III.', en: 'Tribute list of Tiglath-Pileser III', wiki: 'Tiglat-Pileser III.', wikiEn: 'Tiglath-Pileser III',
        dateDe: '≈ 734 v. Chr.', dateEn: '≈ 734 BC',
        saysDe: 'Der assyrische Großkönig führt unter seinen tributpflichtigen Vasallen „Jauhazi (Ahas) von Juda" auf – die Unterwerfung, die 2. Könige 16 als Hilferuf des Ahas erzählt, aus assyrischer Buchführung.',
        saysEn: 'The Assyrian great king lists "Jauhazi (Ahaz) of Judah" among his tribute-paying vassals – the submission 2 Kings 16 tells as Ahaz’s call for help, seen in Assyrian bookkeeping.',
        whereDe: 'Nimrud · British Museum, London', whereEn: 'Nimrud · British Museum, London', named: true,
      },
      {
        kind: 'siegel', de: 'Bulle „Ahas, Sohn Jotams, König von Juda"', en: 'Bulla of "Ahaz, son of Jotham, king of Judah"', wiki: 'Ahas', wikiEn: 'Ahaz',
        dateDe: '8. Jh. v. Chr.', dateEn: '8th century BC',
        saysDe: 'Ein Tonsiegelabdruck mit Namen, Vatersnamen und Titel – die Königsfolge Jotam → Ahas, wie sie in 2. Könige 15–16 steht, im Abdruck eines Fingers.',
        saysEn: 'A clay seal impression with name, patronym and title – the succession Jotham → Ahaz of 2 Kings 15–16, preserved under a fingerprint.',
        named: true,
      },
    ],
  },

  hiskia: {
    wiki: 'Hiskia', wikiEn: 'Hezekiah', imageDe: ART_DE, imageEn: ART_EN,
    docs: [
      {
        kind: 'chronik', de: 'Sanherib-Prisma (Taylor-Prisma)', en: 'Sennacherib Prism (Taylor Prism)', wiki: 'Sanherib-Prisma', wikiEn: 'Sennacherib Prism',
        dateDe: '691 v. Chr.', dateEn: '691 BC',
        saysDe: 'Sanherib berichtet über seinen Feldzug 701: „Hiskia, den Judäer, schloss ich wie einen Vogel im Käfig in Jerusalem, seiner Königsstadt, ein." Er nennt 46 eroberte Städte – aber keine Einnahme Jerusalems.',
        saysEn: 'Sennacherib reports his 701 campaign: "Hezekiah the Judaean I shut up like a bird in a cage in Jerusalem, his royal city." He lists 46 captured towns – but no capture of Jerusalem.',
        whereDe: 'Ninive · British Museum, London', whereEn: 'Nineveh · British Museum, London', named: true,
      },
      {
        kind: 'relief', de: 'Lachisch-Reliefs', en: 'Lachish reliefs', wiki: 'Lachisch-Relief', wikiEn: 'Lachish reliefs',
        dateDe: '≈ 700 v. Chr.', dateEn: '≈ 700 BC',
        saysDe: 'Ein ganzer Saal von Sanheribs Palast zeigt die Belagerung der judäischen Festung Lachisch: Rampe, Sturmböcke, Gefangene mit ihren Bündeln. Dieselbe Belagerung, die 2. Könige 18,14 in einem Satz erwähnt.',
        saysEn: 'A whole room of Sennacherib’s palace shows the siege of the Judaean fortress Lachish: ramp, battering rams, captives with their bundles. The same siege 2 Kings 18:14 records in a single line.',
        whereDe: 'Ninive · British Museum, London', whereEn: 'Nineveh · British Museum, London', named: false,
      },
      {
        kind: 'inschrift', de: 'Siloah-Inschrift', en: 'Siloam inscription', wiki: 'Siloah-Inschrift', wikiEn: 'Siloam inscription',
        dateDe: '≈ 700 v. Chr.', dateEn: '≈ 700 BC',
        saysDe: 'Die Steinmetzen im Hiskia-Tunnel halten fest, wie die zwei Trupps einander im Berg entgegenschlugen und das Wasser floss – der Wasserstollen von 2. Könige 20,20, von den Arbeitern selbst beschrieben.',
        saysEn: 'The quarrymen in Hezekiah’s tunnel record how the two teams met inside the rock and the water flowed – the conduit of 2 Kings 20:20, described by the workmen themselves.',
        whereDe: 'Jerusalem · Archäologisches Museum Istanbul', whereEn: 'Jerusalem · Istanbul Archaeology Museums', named: false,
      },
      {
        kind: 'siegel', de: 'Königssiegel Hiskias', en: 'Royal bulla of Hezekiah', wiki: 'Hiskia', wikiEn: 'Hezekiah',
        dateDe: '≈ 700 v. Chr.', dateEn: '≈ 700 BC',
        saysDe: 'Bei der Ophel-Grabung 2015 kam ein Tonabdruck ans Licht: „Hiskia, Sohn des Ahas, König von Juda", mit geflügelter Sonne – der erste Siegelabdruck eines judäischen Königs aus geregelter Ausgrabung.',
        saysEn: 'The 2015 Ophel excavation produced a clay impression: "Hezekiah, son of Ahaz, king of Judah", with a winged sun – the first bulla of a Judaean king from a controlled dig.',
        whereDe: 'Ophel, Jerusalem', whereEn: 'Ophel, Jerusalem', named: true,
      },
    ],
  },

  manasse_k: {
    wiki: 'Manasse (Juda)', wikiEn: 'Manasseh of Judah', imageDe: ART_DE, imageEn: ART_EN,
    docs: [
      {
        kind: 'chronik', de: 'Prisma Asarhaddons', en: 'Prism of Esarhaddon', wiki: 'Asarhaddon', wikiEn: 'Esarhaddon',
        dateDe: '≈ 673 v. Chr.', dateEn: '≈ 673 BC',
        saysDe: 'Beim Bau seines Palastes zählt Asarhaddon 22 Könige auf, die Bauholz und Steine liefern mussten – darunter „Manasse, König von Juda".',
        saysEn: 'Building his palace, Esarhaddon lists 22 kings made to deliver timber and stone – among them "Manasseh, king of Judah".',
        whereDe: 'Ninive · British Museum, London', whereEn: 'Nineveh · British Museum, London', named: true,
      },
      {
        kind: 'chronik', de: 'Rassam-Zylinder Assurbanipals', en: 'Rassam cylinder of Ashurbanipal', wiki: 'Assurbanipal', wikiEn: 'Ashurbanipal',
        dateDe: '≈ 667 v. Chr.', dateEn: '≈ 667 BC',
        saysDe: 'Auch Assurbanipal führt „Manasse von Juda" unter den Vasallen auf, die ihn auf dem Ägyptenfeldzug mit Truppen unterstützen mussten.',
        saysEn: 'Ashurbanipal too lists "Manasseh of Judah" among the vassals required to support his Egyptian campaign with troops.',
        whereDe: 'British Museum, London', whereEn: 'British Museum, London', named: true,
      },
    ],
  },

  joschija: {
    wiki: 'Joschija', wikiEn: 'Josiah', imageDe: ART_DE, imageEn: ART_EN,
    docs: [
      {
        kind: 'siegel', de: 'Bulle „Natan-Melech, Diener des Königs"', en: 'Bulla of "Nathan-Melech, servant of the king"', wiki: 'Natan-Melech', wikiEn: 'Nathan-Melech',
        dateDe: '7. Jh. v. Chr.', dateEn: '7th century BC',
        saysDe: '2019 in der Davidsstadt gefunden: der Siegelabdruck eines Hofbeamten, den 2. Könige 23,11 im Zusammenhang von Joschijas Reform beim Namen nennt.',
        saysEn: 'Found in the City of David in 2019: the seal impression of a court official whom 2 Kings 23:11 names in the account of Josiah’s reform.',
        whereDe: 'Davidsstadt, Jerusalem', whereEn: 'City of David, Jerusalem', named: false,
      },
      {
        kind: 'akte', de: 'Ostrakon von Meṣad Ḥaschawjahu', en: 'Meṣad Ḥashavyahu ostracon', wiki: 'Mezad Haschawjahu', wikiEn: 'Mesad Hashavyahu',
        dateDe: '≈ 630 v. Chr.', dateEn: '≈ 630 BC',
        saysDe: 'Die Bittschrift eines Erntearbeiters an den Statthalter: Man habe ihm den Mantel gepfändet, er bittet um Rückgabe – hebräisches Alltagsrecht aus Joschijas Regierungszeit, ganz nah an 2. Mose 22,25.',
        saysEn: 'A harvest worker petitions the governor: his cloak has been seized, he asks for its return – everyday Hebrew law from Josiah’s reign, strikingly close to Exodus 22:26.',
        whereDe: 'Küste bei Jawne-Jam, Israel', whereEn: 'Coast near Yavne-Yam, Israel', named: false,
      },
    ],
  },

  jojakim: {
    wiki: 'Jojakim', wikiEn: 'Jehoiakim', imageDe: ART_DE, imageEn: ART_EN,
    docs: [
      {
        kind: 'chronik', de: 'Babylonische Chronik ABC 5', en: 'Babylonian Chronicle ABC 5', wiki: 'Babylonische Chronik', wikiEn: 'Babylonian Chronicles',
        dateDe: '597 v. Chr.', dateEn: '597 BC',
        saysDe: 'Die Keilschriftchronik hält auf den Tag genau fest, wie Nebukadnezar II. im siebten Jahr „die Stadt Juda" belagerte, sie am 2. Adar einnahm, den König gefangen nahm und einen eigenen einsetzte – die erste Eroberung Jerusalems, aus babylonischer Verwaltung.',
        saysEn: 'The cuneiform chronicle records to the day how Nebuchadnezzar II in his seventh year besieged "the city of Judah", took it on the 2nd of Adar, captured the king and installed one of his own – the first capture of Jerusalem, from Babylonian records.',
        whereDe: 'British Museum, London (BM 21946)', whereEn: 'British Museum, London (BM 21946)', named: false,
      },
      {
        kind: 'siegel', de: 'Bulle „Jehuchal, Sohn Schelemjas"', en: 'Bulla of "Jehucal son of Shelemiah"', wiki: 'Jehuchal', wikiEn: 'Jehucal',
        dateDe: '≈ 600 v. Chr.', dateEn: '≈ 600 BC',
        saysDe: 'Der Siegelabdruck eines Höflings, den Jeremia 37–38 als einen der Gegner des Propheten nennt – gefunden in der Davidsstadt.',
        saysEn: 'The seal impression of a courtier named in Jeremiah 37–38 as one of the prophet’s opponents – found in the City of David.',
        whereDe: 'Davidsstadt, Jerusalem', whereEn: 'City of David, Jerusalem', named: false,
      },
    ],
  },

  jojachin: {
    wiki: 'Jojachin', wikiEn: 'Jeconiah', imageDe: ART_DE, imageEn: ART_EN,
    docs: [
      {
        kind: 'akte', de: 'Rationentafeln für Jojachin', en: 'Jehoiachin’s ration tablets', wiki: 'Jojachin', wikiEn: 'Jehoiachin’s Rations Tablets',
        dateDe: '≈ 592 v. Chr.', dateEn: '≈ 592 BC',
        saysDe: 'Lieferscheine der babylonischen Palastverwaltung über Öl und Gerste für „Jaukin, König von Juda" und seine fünf Söhne – der Gefangene aus 2. Könige 25,27–30 in der Buchhaltung seines Siegers.',
        saysEn: 'Delivery notes of the Babylonian palace stores listing oil and barley for "Yaukin, king of Judah" and his five sons – the captive of 2 Kings 25:27–30 in his captor’s ledgers.',
        whereDe: 'Babylon · Vorderasiatisches Museum, Berlin', whereEn: 'Babylon · Vorderasiatisches Museum, Berlin', named: true,
      },
    ],
  },

  serubbabel: {
    wiki: 'Serubbabel', wikiEn: 'Zerubbabel', imageDe: ART_DE, imageEn: ART_EN,
    noteDe: 'Serubbabel selbst nennt kein Dokument. Erhalten ist die persische Politik, die seine Rückkehr überhaupt möglich machte – und das Leben der Juden unter ihr.',
    noteEn: 'No document names Zerubbabel himself. What survives is the Persian policy that made his return possible – and Jewish life under it.',
    docs: [
      {
        kind: 'inschrift', de: 'Kyros-Zylinder', en: 'Cyrus Cylinder', wiki: 'Kyros-Zylinder', wikiEn: 'Cyrus Cylinder',
        dateDe: '539 v. Chr.', dateEn: '539 BC',
        saysDe: 'Kyros lässt festhalten, dass er die verschleppten Götterbilder in ihre Städte zurückbringt und die Verbannten heimkehren lässt – die Politik, aus der in Esra 1 der Erlass für die Heimkehr nach Jerusalem wird.',
        saysEn: 'Cyrus records returning deported divine images to their cities and letting exiles go home – the policy that in Ezra 1 becomes the decree for the return to Jerusalem.',
        whereDe: 'Babylon · British Museum, London', whereEn: 'Babylon · British Museum, London', named: false,
      },
      {
        kind: 'papyrus', de: 'Elephantine-Papyri', en: 'Elephantine papyri', wiki: 'Elephantine-Papyri', wikiEn: 'Elephantine papyri',
        dateDe: '5. Jh. v. Chr.', dateEn: '5th century BC',
        saysDe: 'Briefe und Verträge einer jüdischen Militärkolonie am Nil, auf Aramäisch: Ehe- und Kaufurkunden, ein eigener Tempel, ein Gesuch nach Jerusalem um Erlaubnis zum Wiederaufbau. Der jüdische Alltag der Perserzeit, Akte für Akte.',
        saysEn: 'Letters and contracts of a Jewish garrison on the Nile, in Aramaic: marriage and sale deeds, a temple of their own, a petition to Jerusalem for leave to rebuild it. Persian-era Jewish daily life, file by file.',
        whereDe: 'Elephantine, Ägypten · Berlin, Kairo, New York', whereEn: 'Elephantine, Egypt · Berlin, Cairo, New York', named: false,
      },
    ],
  },

  // ---------------------------------------------------------------- Messias
  jesus: {
    wiki: 'Jesus von Nazaret', wikiEn: 'Jesus', imageDe: ART_DE, imageEn: ART_EN,
    noteDe: 'Keine andere Gestalt des Zeitbaums ist außerbiblisch so breit bezeugt: römische Geschichtsschreiber, ein jüdischer Historiker, ein Statthalterbrief, der Talmud – alle unabhängig von den Evangelien, mehrere davon feindselig.',
    noteEn: 'No other figure in this tree is so widely attested outside the Bible: Roman historians, a Jewish historian, a governor’s letter, the Talmud – all independent of the Gospels, several of them hostile.',
    docs: [
      {
        kind: 'historiker', de: 'Tacitus, Annalen 15,44', en: 'Tacitus, Annals 15.44', wiki: 'Tacitus', wikiEn: 'Tacitus on Christ',
        dateDe: '≈ 116 n. Chr.', dateEn: '≈ AD 116',
        saysDe: 'Über den Brand Roms 64: Nero schob die Schuld auf die Christen, deren Name auf „Christus" zurückgehe, der „unter der Regierung des Tiberius durch den Prokurator Pontius Pilatus hingerichtet worden war". Ein römischer Senator, kein Freund der Sache – und er nennt Hinrichtung, Richter und Zeit.',
        saysEn: 'On the fire of Rome in 64: Nero blamed the Christians, whose name came from "Christus", who "was executed under Tiberius by the procurator Pontius Pilate". A Roman senator, no friend of the cause – and he names the execution, the judge and the reign.',
        whereDe: 'Überliefert im Codex Mediceus, Florenz', whereEn: 'Preserved in the Codex Mediceus, Florence', named: true,
      },
      {
        kind: 'historiker', de: 'Josephus, Jüdische Altertümer 18,63 f. („Testimonium Flavianum")', en: 'Josephus, Antiquities 18.63f ("Testimonium Flavianum")', wiki: 'Testimonium Flavianum', wikiEn: 'Josephus on Jesus',
        dateDe: '≈ 93 n. Chr.', dateEn: '≈ AD 93',
        saysDe: 'Der jüdische Historiker berichtet von Jesus, „einem weisen Mann", den Pilatus auf Betreiben der Führenden kreuzigen ließ und dessen Anhänger nicht aufhörten. Die überschwänglichen Sätze gelten als christliche Überarbeitung, der Kern als echt.',
        saysEn: 'The Jewish historian reports Jesus, "a wise man", crucified by Pilate at the instigation of the leaders, whose followers did not cease. The effusive lines are held to be Christian retouching; the core is taken as genuine.',
        named: true,
      },
      {
        kind: 'historiker', de: 'Josephus, Jüdische Altertümer 20,200', en: 'Josephus, Antiquities 20.200', wiki: 'Jakobus der Gerechte', wikiEn: 'James, brother of Jesus',
        dateDe: '≈ 93 n. Chr.', dateEn: '≈ AD 93',
        saysDe: 'Beiläufig, und gerade darum gewichtig: Der Hohepriester Ananos lässt „Jakobus, den Bruder Jesu, des sogenannten Christus" steinigen. Diese Stelle gilt fast durchweg als unverfälscht.',
        saysEn: 'In passing, and weighty for that reason: the high priest Ananus has "James, the brother of Jesus who was called Christ" stoned. This passage is almost universally held to be untouched.',
        named: true,
      },
      {
        kind: 'brief', de: 'Plinius d. J. an Kaiser Trajan, Ep. 10,96', en: 'Pliny the Younger to Trajan, Ep. 10.96', wiki: 'Plinius der Jüngere', wikiEn: 'Pliny the Younger on Christians',
        dateDe: '≈ 112 n. Chr.', dateEn: '≈ AD 112',
        saysDe: 'Der Statthalter von Bithynien fragt den Kaiser um die Rechtslage und beschreibt, was er ermittelt hat: Die Christen versammelten sich vor Sonnenaufgang und sängen „Christus wie einem Gott" ein Lied. Ein Amtsbericht über christlichen Gottesdienst, 80 Jahre nach Karfreitag.',
        saysEn: 'The governor of Bithynia asks the emperor for the legal position and describes his findings: the Christians met before dawn and sang a hymn "to Christ as to a god". An official’s report on Christian worship, eighty years after Good Friday.',
        named: true,
      },
      {
        kind: 'historiker', de: 'Sueton, Claudius 25,4', en: 'Suetonius, Claudius 25.4', wiki: 'Sueton', wikiEn: 'Suetonius on Christians',
        dateDe: '≈ 121 n. Chr.', dateEn: '≈ AD 121',
        saysDe: 'Claudius habe die Juden aus Rom vertrieben, weil sie „auf Anstiften des Chrestus" ständig Unruhe stifteten. Dieselbe Ausweisung, die Apostelgeschichte 18,2 als Grund nennt, warum Aquila und Priszilla in Korinth sind.',
        saysEn: 'Claudius expelled the Jews from Rome because they rioted constantly "at the instigation of Chrestus". The same expulsion Acts 18:2 gives as the reason Aquila and Priscilla are in Corinth.',
        named: true,
      },
      {
        kind: 'inschrift', de: 'Pilatus-Inschrift von Caesarea', en: 'Pilate Stone, Caesarea', wiki: 'Pilatus-Inschrift', wikiEn: 'Pilate stone',
        dateDe: '≈ 26–36 n. Chr.', dateEn: '≈ AD 26–36',
        saysDe: '1961 im Theater von Caesarea gefunden: ein Weihstein mit „…TIVS PILATVS PRAEF[ECTVS] IVDA[EA]E". Der Richter der Evangelien, in Stein, aus seiner Amtszeit – und mit dem genauen Titel Präfekt.',
        saysEn: 'Found in the theatre of Caesarea in 1961: a dedication stone reading "…TIVS PILATVS PRAEF[ECTVS] IVDA[EA]E". The judge of the Gospels, in stone, from his own term – and with his exact title, prefect.',
        whereDe: 'Caesarea Maritima · Israel-Museum, Jerusalem', whereEn: 'Caesarea Maritima · Israel Museum, Jerusalem', named: false,
      },
      {
        kind: 'akte', de: 'Babylonischer Talmud, Sanhedrin 43a', en: 'Babylonian Talmud, Sanhedrin 43a', wiki: 'Jesus im Talmud', wikiEn: 'Jesus in the Talmud',
        dateDe: 'ab 3. Jh. n. Chr.', dateEn: '3rd century AD onwards',
        saysDe: 'Die rabbinische Überlieferung hält fest, dass „Jeschu" am Vorabend des Passa hingerichtet wurde, nachdem vierzig Tage lang öffentlich nach Entlastung gesucht worden sei – eine gegnerische Quelle, die Kreuzigung und Zeitpunkt bestätigt.',
        saysEn: 'Rabbinic tradition records that "Yeshu" was executed on the eve of Passover after forty days of public search for anything in his favour – a hostile source confirming both execution and date.',
        named: true,
      },
      {
        kind: 'papyrus', de: 'Papyrus P52 (John Rylands)', en: 'Papyrus P52 (John Rylands)', wiki: 'Papyrus 52', wikiEn: 'Rylands Library Papyrus P52',
        dateDe: '≈ 125 n. Chr.', dateEn: '≈ AD 125',
        saysDe: 'Ein Stück Kreditkartengröße mit Johannes 18 – dem Verhör vor Pilatus – auf Vorder- und Rückseite. Die älteste erhaltene Handschrift des Neuen Testaments, gefunden in Ägypten, kaum eine Generation nach der Abfassung.',
        saysEn: 'A credit-card-sized scrap carrying John 18 – the hearing before Pilate – on both sides. The oldest surviving New Testament manuscript, found in Egypt barely a generation after the text was written.',
        whereDe: 'John Rylands Library, Manchester', whereEn: 'John Rylands Library, Manchester', named: false,
      },
    ],
  },

  petrus: {
    wiki: 'Simon Petrus', wikiEn: 'Saint Peter', imageDe: ART_DE, imageEn: ART_EN,
    docs: [
      {
        kind: 'brief', de: '1. Clemensbrief 5', en: '1 Clement 5', wiki: 'Erster Clemensbrief', wikiEn: 'First Epistle of Clement',
        dateDe: '≈ 96 n. Chr.', dateEn: '≈ AD 96',
        saysDe: 'Aus Rom nach Korinth geschrieben, eine knappe Generation nach Nero: Petrus habe „nicht ein oder zwei, sondern viele Mühen ertragen" und sei so an den Ort der Herrlichkeit gegangen – das früheste Zeugnis seines Martyriums.',
        saysEn: 'Written from Rome to Corinth barely a generation after Nero: Peter "endured not one or two but many labours" and so went to the place of glory – the earliest testimony to his martyrdom.',
        named: true,
      },
      {
        kind: 'fund', de: 'Petrus-Trophäe unter St. Peter', en: 'Trophy of Gaius beneath St Peter’s', wiki: 'Petrusgrab', wikiEn: 'Tomb of Saint Peter',
        dateDe: '≈ 160 n. Chr. (Bau)', dateEn: '≈ AD 160 (structure)',
        saysDe: 'Die Grabungen unter dem Petersdom legten ein Grabmal in der vatikanischen Nekropole frei, samt Graffiti mit dem Namen Petrus – die „Trophäe", von der der römische Presbyter Gaius um 200 schreibt.',
        saysEn: 'Excavations under St Peter’s uncovered a shrine in the Vatican necropolis, with graffiti naming Peter – the "trophy" the Roman presbyter Gaius writes of around 200.',
        whereDe: 'Vatikanische Nekropole, Rom', whereEn: 'Vatican necropolis, Rome', named: true,
      },
    ],
  },

  paulus: {
    wiki: 'Paulus von Tarsus', wikiEn: 'Paul the Apostle', imageDe: ART_DE, imageEn: ART_EN,
    docs: [
      {
        kind: 'inschrift', de: 'Gallio-Inschrift von Delphi', en: 'Gallio inscription, Delphi', wiki: 'Gallio-Inschrift', wikiEn: 'Delphi Inscription',
        dateDe: '≈ 52 n. Chr.', dateEn: '≈ AD 52',
        saysDe: 'Ein Brief Kaiser Claudius’ in Stein nennt Lucius Iunius Gallio als Prokonsul von Achaia. Weil Paulus nach Apostelgeschichte 18 vor genau diesem Gallio steht, ist das der Anker, an dem die ganze Chronologie seiner Reisen hängt.',
        saysEn: 'A letter of Claudius carved in stone names Lucius Junius Gallio as proconsul of Achaia. Since Acts 18 has Paul brought before this same Gallio, it is the anchor for the whole chronology of his journeys.',
        whereDe: 'Delphi, Griechenland', whereEn: 'Delphi, Greece', named: false,
      },
      {
        kind: 'inschrift', de: 'Erastus-Inschrift von Korinth', en: 'Erastus inscription, Corinth', wiki: 'Erastus von Korinth', wikiEn: 'Erastus of Corinth',
        dateDe: '1. Jh. n. Chr.', dateEn: '1st century AD',
        saysDe: 'In das Pflaster neben dem Theater ist eingelassen: „Erastus hat für seine Ädilität dieses Pflaster auf eigene Kosten gelegt." Römer 16,23 grüßt „Erastus, den Stadtkämmerer" – aus derselben Stadt und Zeit geschrieben.',
        saysEn: 'Set into the pavement by the theatre: "Erastus, in return for his aedileship, laid this pavement at his own expense." Romans 16:23 sends greetings from "Erastus, the city treasurer" – written from that same city and time.',
        whereDe: 'Korinth, Griechenland', whereEn: 'Corinth, Greece', named: false,
      },
      {
        kind: 'inschrift', de: 'Politarchen-Inschrift von Thessaloniki', en: 'Politarch inscription, Thessalonica', wiki: 'Politarch', wikiEn: 'Politarch',
        dateDe: '1.–2. Jh. n. Chr.', dateEn: '1st–2nd century AD',
        saysDe: 'Lukas nennt die Stadtoberen von Thessaloniki „Politarchen" – ein Titel, den kein anderer antiker Autor verwendet. Inschriften der Stadt zeigen: genau so hießen sie dort.',
        saysEn: 'Luke calls the city magistrates of Thessalonica "politarchs" – a title no other ancient author uses. Inscriptions from the city show that is exactly what they were called there.',
        whereDe: 'Thessaloniki · British Museum, London', whereEn: 'Thessalonica · British Museum, London', named: false,
      },
      {
        kind: 'brief', de: '1. Clemensbrief 5', en: '1 Clement 5', wiki: 'Erster Clemensbrief', wikiEn: 'First Epistle of Clement',
        dateDe: '≈ 96 n. Chr.', dateEn: '≈ AD 96',
        saysDe: 'Paulus habe siebenmal in Ketten gelegen, sei bis „an die Grenze des Westens" gekommen und unter den Regierenden Zeugnis abgelegt, ehe er aus der Welt schied – die früheste Nachricht über sein Ende.',
        saysEn: 'Paul was seven times in chains, reached "the limits of the west" and bore witness before the rulers before departing the world – the earliest notice of his end.',
        named: true,
      },
      {
        kind: 'papyrus', de: 'Papyrus P46', en: 'Papyrus P46', wiki: 'Papyrus 46', wikiEn: 'Papyrus 46',
        dateDe: '≈ 200 n. Chr.', dateEn: '≈ AD 200',
        saysDe: 'Die älteste erhaltene Sammlung der Paulusbriefe, 86 Blätter auf Papyrus – Römer bis Thessalonicher in einem Band, gut 140 Jahre nach ihrer Abfassung.',
        saysEn: 'The oldest surviving collection of Paul’s letters, 86 leaves of papyrus – Romans through Thessalonians in one codex, some 140 years after they were written.',
        whereDe: 'Chester Beatty Library, Dublin · University of Michigan', whereEn: 'Chester Beatty Library, Dublin · University of Michigan', named: false,
      },
    ],
  },

  johannes_ev: {
    wiki: 'Johannes (Apostel)', wikiEn: 'John the Apostle', imageDe: ART_DE, imageEn: ART_EN,
    docs: [
      {
        kind: 'papyrus', de: 'Papyrus P52 (John Rylands)', en: 'Papyrus P52 (John Rylands)', wiki: 'Papyrus 52', wikiEn: 'Rylands Library Papyrus P52',
        dateDe: '≈ 125 n. Chr.', dateEn: '≈ AD 125',
        saysDe: 'Ein Fetzen aus Johannes 18, in Ägypten gefunden: Das Evangelium war eine Generation nach seiner Abfassung schon so weit verbreitet, dass es in der Provinz abgeschrieben wurde.',
        saysEn: 'A scrap of John 18 found in Egypt: a generation after it was written the Gospel had already travelled far enough to be copied in the provinces.',
        whereDe: 'John Rylands Library, Manchester', whereEn: 'John Rylands Library, Manchester', named: false,
      },
      {
        kind: 'handschrift', de: 'Muratorisches Fragment', en: 'Muratorian fragment', wiki: 'Muratorisches Fragment', wikiEn: 'Muratorian fragment',
        dateDe: '≈ 180 n. Chr.', dateEn: '≈ AD 180',
        saysDe: 'Die älteste bekannte Liste der als verbindlich gelesenen Schriften nennt das vierte Evangelium „von Johannes, einem der Jünger" – ein Verzeichnis, kein Traktat.',
        saysEn: 'The oldest known list of the writings read as authoritative names the fourth Gospel "of John, one of the disciples" – an inventory, not a treatise.',
        whereDe: 'Biblioteca Ambrosiana, Mailand', whereEn: 'Biblioteca Ambrosiana, Milan', named: true,
      },
    ],
  },

  // ------------------------------------------------------------- Urkirche
  clemens: {
    wiki: 'Clemens von Rom', wikiEn: 'Pope Clement I', imageDe: ART_DE, imageEn: ART_EN,
    docs: [
      {
        kind: 'brief', de: '1. Clemensbrief', en: 'First Epistle of Clement', wiki: 'Erster Clemensbrief', wikiEn: 'First Epistle of Clement',
        dateDe: '≈ 96 n. Chr.', dateEn: '≈ AD 96',
        saysDe: 'Sein eigener Brief nach Korinth, vollständig erhalten im Codex Alexandrinus: eine Gemeinde schlichtet den Streit einer anderen. Das älteste christliche Schreiben außerhalb des Neuen Testaments.',
        saysEn: 'His own letter to Corinth, preserved complete in the Codex Alexandrinus: one church settling another’s quarrel. The oldest Christian writing outside the New Testament.',
        whereDe: 'Codex Alexandrinus, British Library, London', whereEn: 'Codex Alexandrinus, British Library, London', named: true,
      },
    ],
  },

  ignatius: {
    wiki: 'Ignatius von Antiochia', wikiEn: 'Ignatius of Antioch', imageDe: ART_DE, imageEn: ART_EN,
    docs: [
      {
        kind: 'brief', de: 'Die sieben Briefe des Ignatius', en: 'The seven letters of Ignatius', wiki: 'Ignatius von Antiochia', wikiEn: 'Ignatius of Antioch',
        dateDe: '≈ 110 n. Chr.', dateEn: '≈ AD 110',
        saysDe: 'Unterwegs als Gefangener nach Rom schreibt er an sechs Gemeinden und an Polykarp – und bittet, seine Hinrichtung nicht zu verhindern. Briefe eines Verurteilten, mit Stationen und Namen.',
        saysEn: 'A prisoner on the road to Rome, he writes to six churches and to Polycarp – asking them not to prevent his execution. Letters of a condemned man, with stations and names.',
        whereDe: 'Codex Mediceo-Laurentianus, Florenz', whereEn: 'Codex Mediceo-Laurentianus, Florence', named: true,
      },
      {
        kind: 'brief', de: 'Polykarp an die Philipper 13', en: 'Polycarp to the Philippians 13', wiki: 'Polykarp von Smyrna', wikiEn: 'Polycarp',
        dateDe: '≈ 110–120 n. Chr.', dateEn: '≈ AD 110–120',
        saysDe: 'Polykarp legt der Gemeinde die gesammelten Ignatiusbriefe bei und fragt nach Nachricht „über Ignatius selbst und die mit ihm sind" – ein Zeitgenosse bestätigt Sammlung und Weg.',
        saysEn: 'Polycarp encloses the collected letters of Ignatius and asks for news "of Ignatius himself and those with him" – a contemporary confirming both the collection and the journey.',
        named: true,
      },
    ],
  },

  polykarp: {
    wiki: 'Polykarp von Smyrna', wikiEn: 'Polycarp', imageDe: ART_DE, imageEn: ART_EN,
    docs: [
      {
        kind: 'akte', de: 'Martyrium des Polykarp', en: 'Martyrdom of Polycarp', wiki: 'Martyrium des Polykarp', wikiEn: 'Martyrdom of Polycarp',
        dateDe: '≈ 155–167 n. Chr.', dateEn: '≈ AD 155–167',
        saysDe: 'Der Augenzeugenbericht der Gemeinde von Smyrna an die Gemeinde in Philomelium: Verhaftung im Landhaus, das Verhör im Stadion, die Antwort auf die Aufforderung zu fluchen – „86 Jahre diene ich ihm" – und der Scheiterhaufen. Der älteste erhaltene Märtyrerbericht.',
        saysEn: 'The eyewitness report of the church of Smyrna to the church at Philomelium: the arrest at a farmhouse, the hearing in the stadium, his answer to the order to curse – "eighty-six years have I served him" – and the pyre. The oldest surviving martyr account.',
        named: true,
      },
      {
        kind: 'brief', de: 'Irenäus an Florinus (bei Eusebius, KG 5,20)', en: 'Irenaeus to Florinus (in Eusebius, HE 5.20)', wiki: 'Irenäus von Lyon', wikiEn: 'Irenaeus',
        dateDe: '≈ 190 n. Chr.', dateEn: '≈ AD 190',
        saysDe: 'Irenäus erinnert sich, wie er als Junge Polykarp zuhörte: wo er saß, wie er ging, wie er von seinem Umgang „mit Johannes und den anderen, die den Herrn gesehen hatten" erzählte. Eine Erinnerungskette, in einem Brief festgehalten.',
        saysEn: 'Irenaeus recalls listening to Polycarp as a boy: where he sat, how he walked, how he spoke of his converse "with John and the others who had seen the Lord". A chain of memory, set down in a letter.',
        named: true,
      },
    ],
  },

  justin: {
    wiki: 'Justin der Märtyrer', wikiEn: 'Justin Martyr', imageDe: ART_DE, imageEn: ART_EN,
    docs: [
      {
        kind: 'akte', de: 'Acta Iustini – das Prozessprotokoll', en: 'Acta Iustini – the trial record', wiki: 'Justin der Märtyrer', wikiEn: 'Justin Martyr',
        dateDe: '≈ 165 n. Chr.', dateEn: '≈ AD 165',
        saysDe: 'Das Verhör vor dem Stadtpräfekten Rusticus in Rom, im Frage-Antwort-Protokoll: Name, Wohnort, Lehre, Weigerung zu opfern, Urteil. Eine römische Gerichtsakte über einen Christen – knapper und amtlicher geht es nicht.',
        saysEn: 'The hearing before the city prefect Rusticus in Rome, in question-and-answer form: name, address, teaching, refusal to sacrifice, sentence. A Roman court record about a Christian – as terse and official as it gets.',
        named: true,
      },
      {
        kind: 'brief', de: 'Erste Apologie an Kaiser Antoninus Pius', en: 'First Apology to Antoninus Pius', wiki: 'Apologie (Justin)', wikiEn: 'First Apology of Justin Martyr',
        dateDe: '≈ 155 n. Chr.', dateEn: '≈ AD 155',
        saysDe: 'Eine Eingabe an den Kaiser, die nebenbei beschreibt, wie Christen sonntags zusammenkommen, lesen, beten, Brot und Wein teilen und für die Armen sammeln – die älteste ausführliche Gottesdienstbeschreibung.',
        saysEn: 'A petition to the emperor that, in passing, describes how Christians gather on Sunday, read, pray, share bread and wine and collect for the poor – the oldest detailed description of Christian worship.',
        named: true,
      },
    ],
  },

  irenaeus: {
    wiki: 'Irenäus von Lyon', wikiEn: 'Irenaeus', imageDe: ART_DE, imageEn: ART_EN,
    docs: [
      {
        kind: 'papyrus', de: 'Papyrus Oxyrhynchus 405', en: 'Papyrus Oxyrhynchus 405', wiki: 'Oxyrhynchus Papyri', wikiEn: 'Oxyrhynchus Papyri',
        dateDe: '≈ 200 n. Chr.', dateEn: '≈ AD 200',
        saysDe: 'Ein Stück aus „Gegen die Häresien", in Ägypten gefunden – geschrieben, als Irenäus in Lyon eben erst gestorben war. Sein Buch war binnen weniger Jahre am anderen Ende des Reiches im Umlauf.',
        saysEn: 'A fragment of "Against Heresies" found in Egypt – copied while Irenaeus had only just died in Lyon. His book was circulating at the other end of the empire within a few years.',
        whereDe: 'Oxyrhynchus, Ägypten', whereEn: 'Oxyrhynchus, Egypt', named: true,
      },
      {
        kind: 'brief', de: 'Brief an Viktor von Rom (Osterfeststreit)', en: 'Letter to Victor of Rome (Quartodeciman controversy)', wiki: 'Osterfeststreit', wikiEn: 'Quartodecimanism',
        dateDe: '≈ 190 n. Chr.', dateEn: '≈ AD 190',
        saysDe: 'Irenäus mahnt den römischen Bischof, die Gemeinden Kleinasiens nicht wegen des Ostertermins auszuschließen – ein Kirchenstreit, dessen Schriftwechsel Eusebius aufbewahrt hat.',
        saysEn: 'Irenaeus urges the bishop of Rome not to cut off the churches of Asia Minor over the date of Easter – a church quarrel whose correspondence Eusebius preserved.',
        named: true,
      },
    ],
  },

  tertullian: {
    wiki: 'Tertullian', wikiEn: 'Tertullian', imageDe: ART_DE, imageEn: ART_EN,
    docs: [
      {
        kind: 'brief', de: 'Apologeticum', en: 'Apologeticum', wiki: 'Apologeticum', wikiEn: 'Apologeticus',
        dateDe: '197 n. Chr.', dateEn: 'AD 197',
        saysDe: 'Eine Verteidigungsschrift an die Statthalter Nordafrikas, in Juristensprache: Er verlangt, dass Christen nach Recht und Beweis behandelt werden, nicht nach dem bloßen Namen – und hält fest, wie voll die Städte schon von ihnen seien.',
        saysEn: 'A defence addressed to the governors of North Africa, in a lawyer’s language: he demands that Christians be tried on evidence, not on the mere name – and notes how full the cities already are of them.',
        named: true,
      },
    ],
  },

  cyprian: {
    wiki: 'Cyprian von Karthago', wikiEn: 'Cyprian', imageDe: ART_DE, imageEn: ART_EN,
    docs: [
      {
        kind: 'akte', de: 'Acta proconsularia Cypriani', en: 'Acta proconsularia Cypriani', wiki: 'Cyprian von Karthago', wikiEn: 'Cyprian',
        dateDe: '257/258 n. Chr.', dateEn: 'AD 257/258',
        saysDe: 'Die Prokonsulatsakten seiner beiden Verhöre und der Hinrichtung: Verbannung nach Curubis, Rückführung, Urteilsformel, der Gang zum Richtplatz. Ein römisches Protokoll, das die Kirche als Bericht weitergab.',
        saysEn: 'The proconsular records of his two hearings and his execution: banishment to Curubis, recall, the formula of sentence, the walk to the place of execution. A Roman transcript the church passed on as a report.',
        named: true,
      },
      {
        kind: 'brief', de: 'Briefsammlung Cyprians (81 Briefe)', en: 'The letters of Cyprian (81 letters)', wiki: 'Cyprian von Karthago', wikiEn: 'Cyprian',
        dateDe: '249–258 n. Chr.', dateEn: 'AD 249–258',
        saysDe: 'Korrespondenz eines Bischofs im Ausnahmezustand: Pest, Verfolgung, die Frage, wie mit denen umzugehen sei, die unter Druck geopfert hatten. Verwaltungsschriftverkehr einer verfolgten Kirche.',
        saysEn: 'The correspondence of a bishop in a state of emergency: plague, persecution, and what to do with those who had sacrificed under pressure. The administrative paperwork of a persecuted church.',
        named: true,
      },
    ],
  },

  origenes: {
    wiki: 'Origenes', wikiEn: 'Origen', imageDe: ART_DE, imageEn: ART_EN,
    docs: [
      {
        kind: 'papyrus', de: 'Tura-Papyri', en: 'Tura papyri', wiki: 'Origenes', wikiEn: 'Tura papyri',
        dateDe: '6./7. Jh. (Abschrift) · 1941 gefunden', dateEn: '6th/7th c. copy · found 1941',
        saysDe: 'In einem Steinbruch bei Kairo fanden Arbeiter 1941 einen Stapel Papyruscodices – darunter verschollene Werke des Origenes, die niemand mehr kannte, weil er nach 553 als Ketzer galt.',
        saysEn: 'In a quarry near Cairo in 1941 workmen found a stack of papyrus codices – among them lost works of Origen that nobody knew any more, since after 553 he counted as a heretic.',
        whereDe: 'Tura, Ägypten', whereEn: 'Tura, Egypt', named: true,
      },
      {
        kind: 'historiker', de: 'Eusebius, Kirchengeschichte 6', en: 'Eusebius, Church History 6', wiki: 'Eusebius von Caesarea', wikiEn: 'Church History (Eusebius)',
        dateDe: '≈ 313 n. Chr.', dateEn: '≈ AD 313',
        saysDe: 'Ein ganzes Buch über Origenes, geschrieben in Caesarea, wo dessen Bibliothek noch stand: Schule, Schriften, Verhör und Folter unter Decius. Eusebius arbeitet mit Briefen, die er vor sich hatte.',
        saysEn: 'A whole book on Origen, written in Caesarea where his library still stood: school, writings, interrogation and torture under Decius. Eusebius works from letters he had in front of him.',
        named: true,
      },
    ],
  },

  athanasius: {
    wiki: 'Athanasius der Große', wikiEn: 'Athanasius of Alexandria', imageDe: ART_DE, imageEn: ART_EN,
    docs: [
      {
        kind: 'akte', de: 'Unterschriftenlisten von Nicäa', en: 'Signature lists of Nicaea', wiki: 'Erstes Konzil von Nicäa', wikiEn: 'First Council of Nicaea',
        dateDe: '325 n. Chr.', dateEn: 'AD 325',
        saysDe: 'Das Konzil hinterließ Bekenntnis, Kanones und die Namen der anwesenden Bischöfe. Athanasius war als Diakon des Alexandriners Alexander dabei – die Versammlung, deren Beschluss er sein Leben lang verteidigte.',
        saysEn: 'The council left a creed, canons and the names of the bishops present. Athanasius attended as deacon to Alexander of Alexandria – the assembly whose decision he defended all his life.',
        named: false,
      },
      {
        kind: 'brief', de: '39. Osterfestbrief', en: '39th Festal Letter', wiki: 'Osterfestbrief', wikiEn: 'Athanasius of Alexandria',
        dateDe: '367 n. Chr.', dateEn: 'AD 367',
        saysDe: 'Der jährliche Rundbrief zum Ostertermin zählt zum ersten Mal genau die 27 Schriften des Neuen Testaments auf, „und sonst keine" – die früheste Liste, die mit dem heutigen Kanon übereinstimmt.',
        saysEn: 'The annual circular on the date of Easter lists, for the first time, exactly the 27 books of the New Testament "and no others" – the earliest list matching today’s canon.',
        named: true,
      },
    ],
  },

  hieronymus: {
    wiki: 'Hieronymus (Kirchenvater)', wikiEn: 'Jerome', imageDe: ART_DE, imageEn: ART_EN,
    docs: [
      {
        kind: 'handschrift', de: 'Codex Amiatinus', en: 'Codex Amiatinus', wiki: 'Codex Amiatinus', wikiEn: 'Codex Amiatinus',
        dateDe: '≈ 700 n. Chr.', dateEn: '≈ AD 700',
        saysDe: 'Die älteste vollständige Vulgata-Handschrift, in Northumbrien geschrieben und als Geschenk nach Rom getragen – 34 Kilogramm Pergament, die zeigen, was aus Hieronymus’ Übersetzung geworden war.',
        saysEn: 'The oldest complete Vulgate manuscript, written in Northumbria and carried to Rome as a gift – 34 kilos of parchment showing what had become of Jerome’s translation.',
        whereDe: 'Biblioteca Medicea Laurenziana, Florenz', whereEn: 'Biblioteca Medicea Laurenziana, Florence', named: false,
      },
      {
        kind: 'brief', de: 'Briefwechsel mit Augustinus', en: 'Correspondence with Augustine', wiki: 'Hieronymus (Kirchenvater)', wikiEn: 'Jerome',
        dateDe: '394–419 n. Chr.', dateEn: 'AD 394–419',
        saysDe: 'Zwei Gelehrte streiten über Jahrzehnte hinweg brieflich – über Galater 2, über die Frage, ob man aus dem Hebräischen oder aus der Septuaginta übersetzen soll. Briefe, die beide Seiten aufbewahrt haben.',
        saysEn: 'Two scholars quarrelling by letter across decades – over Galatians 2, and over whether to translate from the Hebrew or the Septuagint. Letters both sides kept.',
        named: true,
      },
    ],
  },

  augustinus: {
    wiki: 'Augustinus von Hippo', wikiEn: 'Augustine of Hippo', imageDe: ART_DE, imageEn: ART_EN,
    docs: [
      {
        kind: 'brief', de: 'Die Divjak-Briefe', en: 'The Divjak letters', wiki: 'Augustinus von Hippo', wikiEn: 'Augustine of Hippo',
        dateDe: '4./5. Jh. · 1975 entdeckt', dateEn: '4th/5th c. · found 1975',
        saysDe: 'In einer Marseiller Handschrift entdeckte Johannes Divjak 1975 27 unbekannte Briefe Augustins – über Sklavenhandel an der afrikanischen Küste, Rechtsfälle, Bittsteller. Nachlass, der 1500 Jahre unbemerkt in einem Regal stand.',
        saysEn: 'In a Marseille manuscript Johannes Divjak found 27 unknown letters of Augustine in 1975 – on slave-trading off the African coast, lawsuits, petitioners. A find that had sat unnoticed on a shelf for 1,500 years.',
        whereDe: 'Bibliothèque municipale, Marseille', whereEn: 'Bibliothèque municipale, Marseille', named: true,
      },
      {
        kind: 'historiker', de: 'Possidius, Vita Augustini', en: 'Possidius, Life of Augustine', wiki: 'Possidius', wikiEn: 'Possidius',
        dateDe: '≈ 433 n. Chr.', dateEn: '≈ AD 433',
        saysDe: 'Sein Schüler und Amtsbruder schreibt die Lebensbeschreibung eines Mannes, mit dem er vierzig Jahre lang zu Tisch saß – bis zur Belagerung Hippos durch die Vandalen, in der Augustinus starb. Dazu ein Verzeichnis seiner Werke.',
        saysEn: 'His pupil and fellow bishop writes the life of a man he had eaten with for forty years – down to the Vandal siege of Hippo in which Augustine died. With a catalogue of his works attached.',
        named: true,
      },
    ],
  },

  ambrosius: {
    wiki: 'Ambrosius von Mailand', wikiEn: 'Ambrose', imageDe: ART_DE, imageEn: ART_EN,
    docs: [
      {
        kind: 'brief', de: 'Brief an Kaiser Theodosius nach Thessaloniki', en: 'Letter to Emperor Theodosius on Thessalonica', wiki: 'Ambrosius von Mailand', wikiEn: 'Ambrose',
        dateDe: '390 n. Chr.', dateEn: 'AD 390',
        saysDe: 'Nach dem Massaker im Zirkus von Thessaloniki fordert der Bischof den Kaiser schriftlich zur Buße auf und verweigert ihm bis dahin die Kommunion – ein Brief, an dem sich das Verhältnis von Kirche und Macht neu ordnete.',
        saysEn: 'After the massacre in the circus of Thessalonica the bishop demands penance of the emperor in writing and withholds communion until he does – a letter that reset the relation of church and power.',
        named: true,
      },
      {
        kind: 'fund', de: 'Gebeine in Sant’Ambrogio, Mailand', en: 'Remains in Sant’Ambrogio, Milan', wiki: 'Basilica di Sant’Ambrogio', wikiEn: 'Basilica of Sant’Ambrogio',
        dateDe: '397 n. Chr. · 1864 untersucht', dateEn: 'AD 397 · examined 1864',
        saysDe: 'Unter dem Altar der von ihm gebauten Kirche liegt bis heute ein Skelett zwischen den Märtyrern Gervasius und Protasius – 1864 freigelegt und als das seine identifiziert.',
        saysEn: 'Beneath the altar of the church he built lies a skeleton between the martyrs Gervasius and Protasius – uncovered in 1864 and identified as his.',
        whereDe: 'Mailand', whereEn: 'Milan', named: true,
      },
    ],
  },

  chrysostomus: {
    wiki: 'Johannes Chrysostomos', wikiEn: 'John Chrysostom', imageDe: ART_DE, imageEn: ART_EN,
    docs: [
      {
        kind: 'akte', de: 'Akten der Eichensynode', en: 'Acts of the Synod of the Oak', wiki: 'Eichensynode', wikiEn: 'Synod of the Oak',
        dateDe: '403 n. Chr.', dateEn: 'AD 403',
        saysDe: 'Die Anklageliste, mit der man den Erzbischof von Konstantinopel absetzte: 29 Punkte, von Hochverrat bis Gastfreundschaft gegenüber Verdächtigen. Kirchenpolitik im Protokoll.',
        saysEn: 'The list of charges by which the archbishop of Constantinople was deposed: 29 counts, from treason to hospitality towards suspects. Church politics in the minutes.',
        named: true,
      },
      {
        kind: 'brief', de: 'Briefe aus dem Exil', en: 'Letters from exile', wiki: 'Johannes Chrysostomos', wikiEn: 'John Chrysostom',
        dateDe: '404–407 n. Chr.', dateEn: 'AD 404–407',
        saysDe: 'Über 200 Briefe aus Armenien, viele an die Diakonisse Olympias: Krankheit, Kälte, die Bitte um Nachricht – geschrieben auf dem Weg, an dessen Ende er starb.',
        saysEn: 'Over 200 letters from Armenia, many to the deaconess Olympias: illness, cold, requests for news – written on the road at whose end he died.',
        named: true,
      },
    ],
  },

  benedikt: {
    wiki: 'Benedikt von Nursia', wikiEn: 'Benedict of Nursia', imageDe: ART_DE, imageEn: ART_EN,
    docs: [
      {
        kind: 'historiker', de: 'Gregor der Große, Dialoge II', en: 'Gregory the Great, Dialogues II', wiki: 'Dialoge (Gregor der Große)', wikiEn: 'Dialogues (Gregory the Great)',
        dateDe: '≈ 593 n. Chr.', dateEn: '≈ AD 593',
        saysDe: 'Das gesamte zweite Buch der Dialoge erzählt sein Leben – Gregor beruft sich auf vier Äbte als Gewährsleute, die Benedikt noch gekannt hatten. Ohne dieses Buch wüssten wir von ihm nichts.',
        saysEn: 'The whole second book of the Dialogues tells his life – Gregory names four abbots as his sources, men who had known Benedict. Without this book we would know nothing of him.',
        named: true,
      },
      {
        kind: 'handschrift', de: 'Regula Benedicti, Codex Sangallensis 914', en: 'Rule of Benedict, Codex Sangallensis 914', wiki: 'Regula Benedicti', wikiEn: 'Rule of Saint Benedict',
        dateDe: '≈ 820 n. Chr.', dateEn: '≈ AD 820',
        saysDe: 'Die St. Galler Handschrift geht auf eine Abschrift des Originals aus Montecassino zurück und gilt als der zuverlässigste Text der Regel, die das europäische Klosterwesen geordnet hat.',
        saysEn: 'The St Gall manuscript goes back to a copy of the Montecassino original and counts as the most reliable text of the rule that ordered European monasticism.',
        whereDe: 'Stiftsbibliothek St. Gallen', whereEn: 'Abbey Library of Saint Gall', named: true,
      },
    ],
  },

  gregor_gross: {
    wiki: 'Gregor der Große', wikiEn: 'Pope Gregory I', imageDe: ART_DE, imageEn: ART_EN,
    docs: [
      {
        kind: 'akte', de: 'Registrum epistularum', en: 'Registrum epistularum', wiki: 'Gregor der Große', wikiEn: 'Pope Gregory I',
        dateDe: '590–604 n. Chr.', dateEn: 'AD 590–604',
        saysDe: 'Über 850 Briefe aus dem päpstlichen Kanzleiregister: Getreidelieferungen, Bischofswahlen, Anweisungen an die Mission nach England, Verhandlungen mit den Langobarden. Verwaltungsakten eines Jahrzehnts, Stück für Stück datiert.',
        saysEn: 'Over 850 letters from the papal chancery register: grain shipments, episcopal elections, instructions to the mission to England, negotiations with the Lombards. A decade of administrative files, each one dated.',
        whereDe: 'Vatikanisches Archiv (Abschriften)', whereEn: 'Vatican archives (copies)', named: true,
      },
    ],
  },

  // ----------------------------------------------------------- Mittelalter
  rashi: {
    wiki: 'Raschi', wikiEn: 'Rashi', imageDe: ART_DE, imageEn: ART_EN,
    docs: [
      {
        kind: 'handschrift', de: 'Kairoer Geniza', en: 'Cairo Geniza', wiki: 'Kairoer Geniza', wikiEn: 'Cairo Geniza',
        dateDe: '9.–19. Jh.', dateEn: '9th–19th century',
        saysDe: 'Aus der Abstellkammer einer Synagoge in Alt-Kairo kamen rund 300 000 Schriftstücke – Verträge, Briefe, Schulhefte, Responsen. Sie zeigen das jüdische Leben der Zeit Raschis von innen, samt der Verbreitung seiner Auslegungen.',
        saysEn: 'From the storeroom of a synagogue in Old Cairo came some 300,000 documents – contracts, letters, schoolbooks, responsa. They show Jewish life in Rashi’s age from the inside, including how far his commentaries travelled.',
        whereDe: 'Cambridge University Library u. a.', whereEn: 'Cambridge University Library and others', named: false,
      },
      {
        kind: 'handschrift', de: 'Erstdruck des Raschi-Kommentars', en: 'First printed Rashi commentary', wiki: 'Raschi', wikiEn: 'Rashi',
        dateDe: '1475', dateEn: '1475',
        saysDe: 'Sein Tora-Kommentar war das erste hebräische Buch, das überhaupt gedruckt wurde (Reggio di Calabria) – und die Schrifttype, in der er gesetzt wurde, heißt bis heute „Raschi-Schrift".',
        saysEn: 'His Torah commentary was the first Hebrew book ever printed (Reggio di Calabria) – and the typeface it was set in is still called "Rashi script".',
        named: true,
      },
    ],
  },

  anselm: {
    wiki: 'Anselm von Canterbury', wikiEn: 'Anselm of Canterbury', imageDe: ART_DE, imageEn: ART_EN,
    docs: [
      {
        kind: 'brief', de: 'Briefsammlung Anselms', en: 'The letters of Anselm', wiki: 'Anselm von Canterbury', wikiEn: 'Anselm of Canterbury',
        dateDe: '1070–1109', dateEn: '1070–1109',
        saysDe: 'Rund 475 Briefe aus Bec und Canterbury: Freundschaften, Klosterrecht, der Investiturstreit mit zwei englischen Königen, zwei Exile. Sein Alltag als Akte.',
        saysEn: 'Some 475 letters from Bec and Canterbury: friendships, monastic law, the investiture struggle with two English kings, two exiles. His working life on file.',
        named: true,
      },
      {
        kind: 'historiker', de: 'Eadmer, Vita Anselmi', en: 'Eadmer, Life of Anselm', wiki: 'Eadmer', wikiEn: 'Eadmer',
        dateDe: '≈ 1114', dateEn: '≈ 1114',
        saysDe: 'Sein Sekretär schrieb mit, was Anselm sagte und tat – die erste mittelalterliche Biografie, die aus täglicher Nähe entstand; Anselm ließ sich die Aufzeichnungen zeigen und wollte sie vernichten lassen.',
        saysEn: 'His secretary took down what Anselm said and did – the first medieval biography written from daily proximity; Anselm asked to see the notes and ordered them destroyed.',
        named: true,
      },
    ],
  },

  maimonides: {
    wiki: 'Maimonides', wikiEn: 'Maimonides', imageDe: ART_DE, imageEn: ART_EN,
    docs: [
      {
        kind: 'handschrift', de: 'Autographen aus der Kairoer Geniza', en: 'Autographs from the Cairo Geniza', wiki: 'Kairoer Geniza', wikiEn: 'Cairo Geniza',
        dateDe: '12. Jh.', dateEn: '12th century',
        saysDe: 'Erhalten sind Blätter von seiner eigenen Hand: Entwürfe zur Mischne Tora, Rechtsgutachten, Briefe an Gemeinden im Jemen – mit Streichungen und Nachträgen im Original.',
        saysEn: 'Leaves in his own hand survive: drafts of the Mishneh Torah, legal opinions, letters to communities in Yemen – with his deletions and additions on the page.',
        whereDe: 'Cambridge · Jerusalem · New York', whereEn: 'Cambridge · Jerusalem · New York', named: true,
      },
    ],
  },

  franz_assisi: {
    wiki: 'Franz von Assisi', wikiEn: 'Francis of Assisi', imageDe: ART_DE, imageEn: ART_EN,
    docs: [
      {
        kind: 'akte', de: 'Bulle „Solet annuere"', en: 'Bull "Solet annuere"', wiki: 'Regula bullata', wikiEn: 'Rule of Saint Francis',
        dateDe: '29. November 1223', dateEn: '29 November 1223',
        saysDe: 'Die Urkunde, mit der Papst Honorius III. die Ordensregel bestätigte – Pergament mit Bleisiegel, bis heute in Assisi verwahrt. Aus einer Bewegung wurde damit rechtlich ein Orden.',
        saysEn: 'The charter by which Pope Honorius III confirmed the rule – parchment with a lead seal, still kept at Assisi. It is the document that turned a movement into an order in law.',
        whereDe: 'Sacro Convento, Assisi', whereEn: 'Sacro Convento, Assisi', named: true,
      },
      {
        kind: 'handschrift', de: 'Eigenhändiger Segen für Bruder Leo', en: 'Blessing for Brother Leo, in his own hand', wiki: 'Franz von Assisi', wikiEn: 'Francis of Assisi',
        dateDe: '≈ 1224', dateEn: '≈ 1224',
        saysDe: 'Ein Pergamentblatt vom Berg La Verna mit dem Lobpreis Gottes und dem aaronitischen Segen, von Franziskus selbst geschrieben – eines der wenigen Autographe eines Heiligen des Mittelalters.',
        saysEn: 'A parchment leaf from Mount La Verna with the praises of God and the Aaronic blessing, written by Francis himself – one of very few autographs of a medieval saint.',
        whereDe: 'Sacro Convento, Assisi', whereEn: 'Sacro Convento, Assisi', named: true,
      },
    ],
  },

  thomas_aquin: {
    wiki: 'Thomas von Aquin', wikiEn: 'Thomas Aquinas', imageDe: ART_DE, imageEn: ART_EN,
    docs: [
      {
        kind: 'akte', de: 'Akten des Kanonisationsprozesses', en: 'Records of the canonisation inquiry', wiki: 'Thomas von Aquin', wikiEn: 'Thomas Aquinas',
        dateDe: '1319–1323', dateEn: '1319–1323',
        saysDe: 'In Neapel und Fossanova wurden Zeugen unter Eid vernommen, die ihn gekannt hatten: wie er arbeitete, diktierte, aß, schwieg. Ein Verhörprotokoll als Lebensbeschreibung.',
        saysEn: 'At Naples and Fossanova witnesses who had known him were examined under oath: how he worked, dictated, ate, kept silent. A deposition record that doubles as a biography.',
        named: true,
      },
      {
        kind: 'handschrift', de: 'Autographen („littera illegibilis")', en: 'Autographs ("littera illegibilis")', wiki: 'Thomas von Aquin', wikiEn: 'Thomas Aquinas',
        dateDe: '13. Jh.', dateEn: '13th century',
        saysDe: 'Erhaltene Blätter seiner eigenen, berüchtigt schwer lesbaren Handschrift – darunter Teile der Summa contra gentiles, mit Korrekturen zwischen den Zeilen.',
        saysEn: 'Surviving leaves in his own notoriously illegible hand – parts of the Summa contra gentiles among them, corrections between the lines.',
        whereDe: 'Vatikanische Bibliothek', whereEn: 'Vatican Library', named: true,
      },
    ],
  },

  wycliffe: {
    wiki: 'John Wyclif', wikiEn: 'John Wycliffe', imageDe: ART_DE, imageEn: ART_EN,
    docs: [
      {
        kind: 'akte', de: 'Bullen Gregors XI. gegen Wyclif', en: 'Bulls of Gregory XI against Wycliffe', wiki: 'John Wyclif', wikiEn: 'John Wycliffe',
        dateDe: '22. Mai 1377', dateEn: '22 May 1377',
        saysDe: 'Fünf gleichlautende Bullen an König, Erzbischof und Universität Oxford listen 18 Sätze auf, die er widerrufen soll – die Kirche zitiert ihn in eigenen Worten, um ihn zu verurteilen.',
        saysEn: 'Five identical bulls to the king, the archbishop and Oxford list 18 propositions he must recant – the church quoting him in his own words in order to condemn him.',
        named: true,
      },
      {
        kind: 'akte', de: 'Verurteilung durch das Konzil von Konstanz', en: 'Condemnation by the Council of Constance', wiki: 'Konzil von Konstanz', wikiEn: 'Council of Constance',
        dateDe: '4. Mai 1415', dateEn: '4 May 1415',
        saysDe: 'Das Konzil verdammte 45 Sätze Wyclifs und ordnete an, seine Gebeine auszugraben und zu verbrennen – 1428 vollstreckt, die Asche in den Fluss Swift gestreut.',
        saysEn: 'The council condemned 45 of Wycliffe’s propositions and ordered his bones dug up and burned – carried out in 1428, the ashes thrown into the river Swift.',
        named: true,
      },
    ],
  },

  hus: {
    wiki: 'Jan Hus', wikiEn: 'Jan Hus', imageDe: ART_DE, imageEn: ART_EN,
    docs: [
      {
        kind: 'akte', de: 'Geleitbrief König Sigismunds', en: 'Safe-conduct of King Sigismund', wiki: 'Jan Hus', wikiEn: 'Jan Hus',
        dateDe: 'Oktober 1414', dateEn: 'October 1414',
        saysDe: 'Die Urkunde, die ihm freie Hin- und Rückreise zum Konzil zusichert – und die drei Wochen nach seiner Ankunft nichts mehr wert war, als man ihn einsperrte.',
        saysEn: 'The charter guaranteeing him free passage to the council and home again – worth nothing three weeks after his arrival, when he was imprisoned.',
        named: true,
      },
      {
        kind: 'akte', de: 'Konzilsakten und Urteil von Konstanz', en: 'Acts and sentence of the Council of Constance', wiki: 'Konzil von Konstanz', wikiEn: 'Council of Constance',
        dateDe: '6. Juli 1415', dateEn: '6 July 1415',
        saysDe: 'Das Protokoll der öffentlichen Sitzung im Münster: Anklagepunkte, seine Weigerung zu widerrufen, was er nicht gelehrt habe, die Degradierung, die Übergabe an den weltlichen Arm. Noch am selben Tag verbrannt.',
        saysEn: 'The minutes of the public session in the minster: the charges, his refusal to recant what he had not taught, the degradation, the handing over to the secular arm. Burned the same day.',
        named: true,
      },
      {
        kind: 'brief', de: 'Briefe aus dem Kerker', en: 'Letters from prison', wiki: 'Jan Hus', wikiEn: 'Jan Hus',
        dateDe: '1414/15', dateEn: '1414/15',
        saysDe: 'Aus Turm und Kloster geschmuggelte Briefe an Freunde in Böhmen: Krankheit, Verhöre, die Bitte um Gebet – und die Sätze, mit denen er seine Sache selbst zusammenfasst.',
        saysEn: 'Letters smuggled out of tower and monastery to friends in Bohemia: illness, hearings, requests for prayer – and the lines in which he sums up his own case.',
        named: true,
      },
    ],
  },

  // ----------------------------------------------------------- Reformation
  luther: {
    wiki: 'Martin Luther', wikiEn: 'Martin Luther', imageDe: PORTRAIT_DE, imageEn: PORTRAIT_EN,
    noteDe: 'Ab hier ist die Quellenlage eine andere: Luther ist der erste Mensch dieses Baumes, dessen Prozessakten, Drucke, Briefe und Porträts alle zugleich erhalten sind.',
    noteEn: 'From here on the sources change in kind: Luther is the first person in this tree whose court records, printed works, letters and portraits all survive together.',
    docs: [
      {
        kind: 'akte', de: 'Bannandrohungsbulle „Exsurge Domine"', en: 'Bull "Exsurge Domine"', wiki: 'Exsurge Domine', wikiEn: 'Exsurge Domine',
        dateDe: '15. Juni 1520', dateEn: '15 June 1520',
        saysDe: 'Rom verwirft 41 Sätze Luthers und gibt ihm 60 Tage zum Widerruf. Er verbrannte die Urkunde am 10. Dezember 1520 vor dem Elstertor in Wittenberg.',
        saysEn: 'Rome rejects 41 of Luther’s propositions and gives him 60 days to recant. He burned the document at the Elster Gate in Wittenberg on 10 December 1520.',
        named: true,
      },
      {
        kind: 'akte', de: 'Wormser Edikt', en: 'Edict of Worms', wiki: 'Wormser Edikt', wikiEn: 'Edict of Worms',
        dateDe: '8./26. Mai 1521', dateEn: '8/26 May 1521',
        saysDe: 'Die Reichsacht: Luther gilt als überführter Ketzer, niemand darf ihn beherbergen oder ernähren, seine Schriften sind zu verbrennen. Ein Reichsgesetz gegen einen einzelnen Mönch.',
        saysEn: 'The imperial ban: Luther is a convicted heretic, nobody may shelter or feed him, his writings are to be burned. An imperial law against a single monk.',
        whereDe: 'Reichstagsakten, Worms', whereEn: 'Imperial diet records, Worms', named: true,
      },
      {
        kind: 'akte', de: 'Protokoll des Verhörs in Worms', en: 'Record of the hearing at Worms', wiki: 'Reichstag zu Worms (1521)', wikiEn: 'Diet of Worms',
        dateDe: '17./18. April 1521', dateEn: '17/18 April 1521',
        saysDe: 'Die Reichstagsakten halten Frage und Antwort fest: die Bücher auf dem Tisch, die Bitte um Bedenkzeit, die Weigerung zu widerrufen, weil sein Gewissen in Gottes Wort gefangen sei.',
        saysEn: 'The diet records preserve question and answer: the books on the table, the request for time, the refusal to recant because his conscience is captive to the word of God.',
        named: true,
      },
      {
        kind: 'handschrift', de: '95 Thesen – Druck und Thesenbrief', en: '95 Theses – the print and the covering letter', wiki: '95 Thesen', wikiEn: 'Ninety-five Theses',
        dateDe: '31. Oktober 1517', dateEn: '31 October 1517',
        saysDe: 'Erhalten sind frühe Drucke der Thesen und Luthers Begleitbrief an Erzbischof Albrecht vom selben Tag – der Vorgang ist datiert, ob der Hammer am Kirchentor je fiel, ist es nicht.',
        saysEn: 'Early prints of the theses survive, and Luther’s covering letter to Archbishop Albrecht of the same day – the event is dated, though whether a hammer ever struck the church door is not.',
        named: true,
      },
    ],
  },

  melanchthon: {
    wiki: 'Philipp Melanchthon', wikiEn: 'Philip Melanchthon', imageDe: PORTRAIT_DE, imageEn: PORTRAIT_EN,
    docs: [
      {
        kind: 'akte', de: 'Confessio Augustana', en: 'Augsburg Confession', wiki: 'Confessio Augustana', wikiEn: 'Augsburg Confession',
        dateDe: '25. Juni 1530', dateEn: '25 June 1530',
        saysDe: 'Von ihm verfasst und vor Kaiser Karl V. auf dem Augsburger Reichstag verlesen, unterschrieben von sieben Fürsten und zwei Städten – eine Reichsakte, die zugleich Bekenntnisschrift wurde.',
        saysEn: 'Drafted by him and read before Emperor Charles V at the Diet of Augsburg, signed by seven princes and two cities – an imperial document that became a confession of faith.',
        whereDe: 'Reichstagsakten, Augsburg', whereEn: 'Imperial diet records, Augsburg', named: true,
      },
    ],
  },

  zwingli: {
    wiki: 'Huldrych Zwingli', wikiEn: 'Huldrych Zwingli', imageDe: PORTRAIT_DE, imageEn: PORTRAIT_EN,
    docs: [
      {
        kind: 'akte', de: 'Akten der Ersten Zürcher Disputation', en: 'Records of the First Zurich Disputation', wiki: 'Zürcher Disputation', wikiEn: 'Zurich disputation',
        dateDe: '29. Januar 1523', dateEn: '29 January 1523',
        saysDe: 'Der Rat der Stadt lädt zum öffentlichen Streitgespräch, hört beide Seiten an und entscheidet, dass weiter „nach der Schrift" gepredigt werde – eine Reformation per Ratsbeschluss, im Protokoll nachlesbar.',
        saysEn: 'The city council calls a public disputation, hears both sides and rules that preaching shall continue "according to Scripture" – a reformation by council decision, minuted.',
        whereDe: 'Staatsarchiv Zürich', whereEn: 'State Archives of Zurich', named: true,
      },
      {
        kind: 'akte', de: 'Berichte über Kappel am Albis', en: 'Reports of Kappel am Albis', wiki: 'Schlacht bei Kappel', wikiEn: 'Battles of Kappel',
        dateDe: '11. Oktober 1531', dateEn: '11 October 1531',
        saysDe: 'Chronikberichte beider Seiten schildern, wie der Prediger als Feldgeistlicher mit auszog und auf dem Schlachtfeld fiel – sein Ende ist von Freund und Gegner festgehalten.',
        saysEn: 'Chronicles from both sides describe how the preacher marched out as army chaplain and fell on the field – his death recorded by friend and foe alike.',
        named: true,
      },
    ],
  },

  calvin: {
    wiki: 'Johannes Calvin', wikiEn: 'John Calvin', imageDe: PORTRAIT_DE, imageEn: PORTRAIT_EN,
    docs: [
      {
        kind: 'akte', de: 'Ordonnances ecclésiastiques', en: 'Ecclesiastical Ordinances', wiki: 'Kirchenordnung von Genf', wikiEn: 'Ecclesiastical Ordinances',
        dateDe: '20. November 1541', dateEn: '20 November 1541',
        saysDe: 'Die von ihm entworfene und vom Rat beschlossene Kirchenordnung Genfs: vier Ämter, Konsistorium, Schulwesen. Ein Stadtgesetz, das zum Modell reformierter Kirchen wurde.',
        saysEn: 'Geneva’s church order, drafted by him and passed by the council: four offices, a consistory, schooling. A city statute that became the model of Reformed churches.',
        whereDe: 'Staatsarchiv Genf', whereEn: 'State Archives of Geneva', named: true,
      },
      {
        kind: 'akte', de: 'Registres du Conseil de Genève', en: 'Registers of the Council of Geneva', wiki: 'Genf', wikiEn: 'History of Geneva',
        dateDe: '1536–1564', dateEn: '1536–1564',
        saysDe: 'Die Ratsprotokolle nennen ihn Sitzung für Sitzung: Ausweisung 1538, Rückberufung 1541, Streit um Abendmahl und Sittenzucht, der Prozess gegen Michael Servet 1553. Auch die dunklen Seiten stehen in der Akte.',
        saysEn: 'The council minutes name him session by session: expulsion in 1538, recall in 1541, quarrels over communion and discipline, the trial of Michael Servetus in 1553. The dark chapters are in the file too.',
        whereDe: 'Staatsarchiv Genf', whereEn: 'State Archives of Geneva', named: true,
      },
    ],
  },

  knox: {
    wiki: 'John Knox', wikiEn: 'John Knox', imageDe: PORTRAIT_DE, imageEn: PORTRAIT_EN,
    docs: [
      {
        kind: 'akte', de: 'Reformationsgesetze des schottischen Parlaments', en: 'Reformation acts of the Scottish Parliament', wiki: 'Schottische Reformation', wikiEn: 'Scottish Reformation',
        dateDe: 'August 1560', dateEn: 'August 1560',
        saysDe: 'Das Parlament nimmt das von Knox mitverfasste Bekenntnis an, verbietet die Messe und kündigt die päpstliche Jurisdiktion auf – eine Landesreformation in drei Gesetzen.',
        saysEn: 'Parliament adopts the confession Knox helped write, forbids the mass and renounces papal jurisdiction – a national reformation in three acts.',
        whereDe: 'National Records of Scotland, Edinburgh', whereEn: 'National Records of Scotland, Edinburgh', named: false,
      },
    ],
  },

  // ------------------------------------------------- Erweckung & Moderne
  wesley: {
    wiki: 'John Wesley', wikiEn: 'John Wesley', imageDe: PORTRAIT_DE, imageEn: PORTRAIT_EN,
    docs: [
      {
        kind: 'handschrift', de: 'Tagebücher und Journal', en: 'Diaries and Journal', wiki: 'John Wesley', wikiEn: 'John Wesley',
        dateDe: '1735–1790', dateEn: '1735–1790',
        saysDe: 'Fünfzig Jahre lang notierte er Tag für Tag Wege, Predigtorte, Zuhörerzahlen, Wetter und Gemütslage – teils in Kurzschrift und Geheimcode. Rund 400 000 Kilometer zu Pferd, nachgezeichnet aus seinen eigenen Zeilen.',
        saysEn: 'For fifty years he noted down day by day his routes, preaching places, crowd sizes, weather and state of mind – partly in shorthand and cipher. Some 250,000 miles on horseback, traceable in his own lines.',
        whereDe: 'John Rylands Library, Manchester', whereEn: 'John Rylands Library, Manchester', named: true,
      },
    ],
  },

  whitefield: {
    wiki: 'George Whitefield', wikiEn: 'George Whitefield', imageDe: PORTRAIT_DE, imageEn: PORTRAIT_EN,
    docs: [
      {
        kind: 'akte', de: 'Berichte in der Pennsylvania Gazette', en: 'Reports in the Pennsylvania Gazette', wiki: 'Pennsylvania Gazette', wikiEn: 'The Pennsylvania Gazette',
        dateDe: '1739/40', dateEn: '1739/40',
        saysDe: 'Benjamin Franklin druckte Whitefields Predigten und berichtete über die Versammlungen – er schritt selbst die Menge in Philadelphia ab, um zu prüfen, ob 25 000 Menschen eine Stimme hören können. Erweckung, geprüft von einem Skeptiker.',
        saysEn: 'Benjamin Franklin printed Whitefield’s sermons and reported on the gatherings – he paced out the crowd in Philadelphia himself to test whether 25,000 people could hear one voice. Revival, checked by a sceptic.',
        named: true,
      },
    ],
  },

  spurgeon: {
    wiki: 'Charles Haddon Spurgeon', wikiEn: 'Charles Spurgeon', imageDe: PHOTO_DE, imageEn: PHOTO_EN,
    docs: [
      {
        kind: 'akte', de: 'The Metropolitan Tabernacle Pulpit', en: 'The Metropolitan Tabernacle Pulpit', wiki: 'Charles Haddon Spurgeon', wikiEn: 'Charles Spurgeon',
        dateDe: '1855–1917', dateEn: '1855–1917',
        saysDe: '63 Bände wöchentlich gedruckter Predigten, mitstenografiert und montags in London verkauft, per Telegraf bis nach Australien – die vollständigste Predigtsammlung eines einzelnen Menschen.',
        saysEn: '63 volumes of weekly printed sermons, taken down in shorthand and sold in London on Mondays, telegraphed as far as Australia – the fullest body of sermons by any one person.',
        named: true,
      },
      {
        kind: 'akte', de: 'Britische Volkszählung 1851 (Kirchgang)', en: 'British religious census of 1851', wiki: 'Volkszählung', wikiEn: 'Census in the United Kingdom',
        dateDe: '30. März 1851', dateEn: '30 March 1851',
        saysDe: 'Die einzige amtliche Zählung der Gottesdienstbesucher Englands – die Zahlenlage, in die Spurgeons Londoner Jahrzehnte fallen, statistisch erfasst.',
        saysEn: 'The only official count of churchgoers in England – the statistical ground on which Spurgeon’s London decades stand.',
        named: false,
      },
    ],
  },

  moody: {
    wiki: 'Dwight Lyman Moody', wikiEn: 'Dwight L. Moody', imageDe: PHOTO_DE, imageEn: PHOTO_EN,
    docs: [
      {
        kind: 'akte', de: 'Zeitungsberichte zum Brand von Chicago', en: 'Newspaper reports of the Great Chicago Fire', wiki: 'Großer Brand von Chicago', wikiEn: 'Great Chicago Fire',
        dateDe: 'Oktober 1871', dateEn: 'October 1871',
        saysDe: 'Die Presse hielt fest, wie Kirche, Schule und Wohnhaus Moodys in derselben Nacht verbrannten – der Einschnitt, nach dem aus dem Sonntagsschullehrer ein reisender Evangelist wurde.',
        saysEn: 'The press recorded how Moody’s church, school and home burned in the same night – the break after which the Sunday-school teacher became a travelling evangelist.',
        named: true,
      },
      {
        kind: 'akte', de: 'Britische Presse zur Erweckungsreise 1873–1875', en: 'British press on the 1873–1875 mission', wiki: 'Dwight Lyman Moody', wikiEn: 'Dwight L. Moody',
        dateDe: '1873–1875', dateEn: '1873–1875',
        saysDe: 'Britische Zeitungen zählten die Versammlungen in Glasgow, Edinburgh und London mit – Besucherzahlen, Hallenmieten, Kritik und Spott, alles gedruckt und datiert.',
        saysEn: 'British newspapers counted the meetings in Glasgow, Edinburgh and London – attendance, hall rents, criticism and mockery, all printed and dated.',
        named: true,
      },
    ],
  },

  bonhoeffer: {
    wiki: 'Dietrich Bonhoeffer', wikiEn: 'Dietrich Bonhoeffer', imageDe: PHOTO_DE, imageEn: PHOTO_EN,
    docs: [
      {
        kind: 'akte', de: 'Barmer Theologische Erklärung', en: 'Barmen Declaration', wiki: 'Barmer Theologische Erklärung', wikiEn: 'Barmen Declaration',
        dateDe: '31. Mai 1934', dateEn: '31 May 1934',
        saysDe: 'Das Gründungsdokument der Bekennenden Kirche, gegen die Gleichschaltung der evangelischen Kirche im NS-Staat – der kirchenpolitische Boden, auf dem Bonhoeffer stand.',
        saysEn: 'The founding document of the Confessing Church against the Nazification of the Protestant church – the ground Bonhoeffer stood on.',
        named: false,
      },
      {
        kind: 'akte', de: 'Gestapo- und Reichskriegsgerichtsakten', en: 'Gestapo and Reich Court-Martial files', wiki: 'Dietrich Bonhoeffer', wikiEn: 'Dietrich Bonhoeffer',
        dateDe: '1940–1945', dateEn: '1940–1945',
        saysDe: 'Redeverbot, Meldepflicht, Verhaftung am 5. April 1943, Verhörprotokolle in Tegel, die Ermittlungen zur „Aktion 7" und schließlich die Zeller Akten, die ihn mit dem Umsturzversuch verbanden.',
        saysEn: 'A ban on speaking, a duty to report, his arrest on 5 April 1943, the interrogation records at Tegel, the investigation into "Operation 7" and finally the files that tied him to the plot.',
        whereDe: 'Bundesarchiv', whereEn: 'German Federal Archives', named: true,
      },
      {
        kind: 'brief', de: 'Widerstand und Ergebung – die Tegeler Briefe', en: 'Letters and Papers from Prison', wiki: 'Widerstand und Ergebung', wikiEn: 'Letters and Papers from Prison',
        dateDe: '1943–1945', dateEn: '1943–1945',
        saysDe: 'Briefe an Eltern, Verlobte und den Freund Eberhard Bethge, teils zensiert, teils herausgeschmuggelt – geschrieben in der Zelle, aus der er zur Hinrichtung nach Flossenbürg gebracht wurde (9. April 1945).',
        saysEn: 'Letters to his parents, his fiancée and his friend Eberhard Bethge, some censored, some smuggled out – written in the cell he was taken from to be executed at Flossenbürg on 9 April 1945.',
        named: true,
      },
    ],
  },

  graham: {
    wiki: 'Billy Graham', wikiEn: 'Billy Graham', imageDe: PHOTO_DE, imageEn: PHOTO_EN,
    docs: [
      {
        kind: 'akte', de: 'Berichte zur Los-Angeles-Kampagne', en: 'Coverage of the Los Angeles campaign', wiki: 'Billy Graham', wikiEn: 'Billy Graham',
        dateDe: '1949', dateEn: '1949',
        saysDe: 'Die Zeitungen des Hearst-Konzerns machten aus einer Zeltmission von drei Wochen eine von acht – der dokumentierte Beginn einer weltweiten Rednerlaufbahn.',
        saysEn: 'Hearst’s newspapers turned a three-week tent mission into an eight-week one – the documented beginning of a worldwide preaching career.',
        named: true,
      },
      {
        kind: 'akte', de: 'Archiv des Billy Graham Center', en: 'Billy Graham Center Archives', wiki: 'Billy Graham', wikiEn: 'Billy Graham',
        dateDe: '20./21. Jh.', dateEn: '20th/21st century',
        saysDe: 'Terminkalender, Predigtmitschnitte, Korrespondenz mit US-Präsidenten von Truman bis Obama – eine Lebensgeschichte, die in Regalmetern gemessen wird.',
        saysEn: 'Diaries, sermon recordings, correspondence with US presidents from Truman to Obama – a life measured in shelf-metres.',
        whereDe: 'Wheaton College, Illinois', whereEn: 'Wheaton College, Illinois', named: true,
      },
    ],
  },

  josef_nt: {
    wiki: 'Josef von Nazaret', wikiEn: 'Saint Joseph', imageDe: ART_DE, imageEn: ART_EN,
    noteDe: 'Von Josef selbst ist außerhalb der Evangelien nichts erhalten – ein Handwerker in einem Dorf hinterließ keine Akten. Erhalten ist das Dorf.',
    noteEn: 'Nothing of Joseph himself survives outside the Gospels – a village craftsman left no records. The village does survive.',
    docs: [
      {
        kind: 'inschrift', de: 'Priesterordnungen-Inschrift von Caesarea', en: 'Caesarea priestly courses inscription', wiki: 'Nazaret', wikiEn: 'Nazareth',
        dateDe: '3./4. Jh. n. Chr.', dateEn: '3rd/4th century AD',
        saysDe: 'Ein Marmorfragment listet auf, wohin die 24 Priesterordnungen nach dem Fall Jerusalems zogen – die Ordnung Hapizzez nach „Nazaret". Der älteste außerbiblische Beleg, dass es den Ort gab.',
        saysEn: 'A marble fragment lists where the 24 priestly courses went after the fall of Jerusalem – the course of Happizzez to "Nazareth". The oldest extra-biblical evidence that the place existed.',
        whereDe: 'Caesarea Maritima, Israel', whereEn: 'Caesarea Maritima, Israel', named: false,
      },
      {
        kind: 'fund', de: 'Wohnhaus des 1. Jahrhunderts in Nazaret', en: 'First-century dwelling in Nazareth', wiki: 'Nazaret', wikiEn: 'Nazareth',
        dateDe: '1. Jh. n. Chr.', dateEn: '1st century AD',
        saysDe: 'Grabungen im Ortskern legten ein bescheidenes Bauernhaus mit Zisterne und Felsengrab frei: Nazaret war zur Zeit Josefs ein Dorf von vielleicht 200 bis 400 Menschen, das von Landwirtschaft lebte.',
        saysEn: 'Excavations in the town centre uncovered a modest farmhouse with cistern and rock tomb: in Joseph’s day Nazareth was a village of perhaps 200–400 people living off the land.',
        whereDe: 'Nazaret, Galiläa', whereEn: 'Nazareth, Galilee', named: false,
      },
    ],
  },

  basilius: {
    wiki: 'Basilius der Große', wikiEn: 'Basil of Caesarea', imageDe: ART_DE, imageEn: ART_EN,
    docs: [
      {
        kind: 'brief', de: 'Briefsammlung des Basilius', en: 'The letters of Basil', wiki: 'Basilius der Große', wikiEn: 'Basil of Caesarea',
        dateDe: '≈ 357–378 n. Chr.', dateEn: '≈ AD 357–378',
        saysDe: 'Über 300 Briefe: Hungersnot in Kappadokien, Bau des Armen- und Krankenhauses „Basiliade", Auseinandersetzungen mit Kaiser Valens, Kirchenrecht in Einzelfällen. Ein Bistum in Korrespondenz.',
        saysEn: 'Over 300 letters: famine in Cappadocia, the building of the "Basiliad" poorhouse and hospital, clashes with the emperor Valens, canon law case by case. A diocese in correspondence.',
        named: true,
      },
    ],
  },

  gregor_naz: {
    wiki: 'Gregor von Nazianz', wikiEn: 'Gregory of Nazianzus', imageDe: ART_DE, imageEn: ART_EN,
    docs: [
      {
        kind: 'akte', de: 'Akten des Konzils von Konstantinopel', en: 'Acts of the Council of Constantinople', wiki: 'Erstes Konzil von Konstantinopel', wikiEn: 'First Council of Constantinople',
        dateDe: '381 n. Chr.', dateEn: 'AD 381',
        saysDe: 'Er führte den Vorsitz, ehe er unter Streit zurücktrat. Das Konzil erweiterte das Glaubensbekenntnis um den Artikel über den Heiligen Geist – der Text, der bis heute sonntags gesprochen wird.',
        saysEn: 'He presided until he resigned amid conflict. The council expanded the creed with the article on the Holy Spirit – the text still spoken on Sundays.',
        named: true,
      },
    ],
  },

  kyrill: {
    wiki: 'Kyrill von Alexandria', wikiEn: 'Cyril of Alexandria', imageDe: ART_DE, imageEn: ART_EN,
    docs: [
      {
        kind: 'akte', de: 'Akten des Konzils von Ephesus', en: 'Acts of the Council of Ephesus', wiki: 'Konzil von Ephesos', wikiEn: 'Council of Ephesus',
        dateDe: '431 n. Chr.', dateEn: 'AD 431',
        saysDe: 'Sitzungsprotokolle, Anklageschriften und Kaiserbriefe eines Konzils, das zweimal gleichzeitig tagte: Kyrills Partei setzte Nestorius ab, dessen Partei Kyrill. Kirchenstreit in beglaubigten Abschriften.',
        saysEn: 'Minutes, indictments and imperial letters from a council that met twice at once: Cyril’s party deposed Nestorius, and Nestorius’ party deposed Cyril. A church quarrel in certified copies.',
        named: true,
      },
    ],
  },
};

/** Zeitdokumente zu einer Person – leer, wenn nichts gesammelt ist. */
export function docsFor(personId: string): HistDoc[] {
  return PERSON_SOURCES[personId]?.docs ?? [];
}

/** Wie viele Personen des Zeitbaums Zeitdokumente tragen (für Tests/Übersicht). */
export const DOCUMENTED_COUNT = Object.keys(PERSON_SOURCES).length;
