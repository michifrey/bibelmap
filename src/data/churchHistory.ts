import { GEN_EPOCHS, type Epoch } from './genealogy';
import type { BiText } from './nationsTribes';

/**
 * Die Kirchengeschichte als Zeitschiene – von Pfingsten bis in die Gegenwart.
 *
 * Vorher endete dieser Modus bei 787. Nicht, weil danach nichts mehr geschah,
 * sondern weil die Karte ihre Leute aus dem Zeitbaum zog und dort nur die
 * Kirchenväter Koordinaten trugen. Hus, Luther, Calvin, Wesley, Bonhoeffer
 * standen längst im Baum – nur eben ohne Ort, und damit unsichtbar auf einer
 * Karte. Tausend Jahre fehlten aus einem Datenmangel, nicht aus einem Urteil.
 *
 * DIE EPOCHEN SIND DIE DES ZEITBAUMS. `GEN_EPOCHS` führt sie schon, samt Farbe;
 * hier bekommen sie nur ihre Jahreszahlen, damit sich Ereignisse darauf setzen
 * lassen. So trägt eine Person im Baum dieselbe Farbe wie ihr Band auf der
 * Zeitschiene – und niemand muss zwei Listen gleich halten.
 *
 * Zu den Quellen: Dieselbe Regel wie bei der Israel-Karte. Jedes Ereignis nennt
 * mindestens eine, und `npm run check:church` prüft das bei jedem Lauf. Wo eine
 * Zahl steht, steht die Stelle dabei, die sie erhebt.
 */

export type ChurchEra = 'urkirche' | 'kirchenvater' | 'mittelalter' | 'reformation' | 'erweckung' | 'moderne';

export interface ChurchSource {
  id: string;
  label: string;
  by: string;
  /** `primary` = der Text selbst (Konzilsakte, Bekenntnis), `ref` = Nachschlagewerk. */
  kind: 'primary' | 'ref' | 'archive';
  url: string;
}

/**
 * Bevorzugt der Text selbst, nicht das Referat darüber: Wo eine Konzilsakte,
 * ein Bekenntnis oder eine Erklärung im Netz steht, steht sie hier – und nicht
 * ein Lexikonartikel, der sie zusammenfasst.
 */
export const SOURCES: ChurchSource[] = [
  { id: 'bibel', label: 'Bibeltext', by: 'BibleGateway', kind: 'ref', url: 'https://www.biblegateway.com/' },
  { id: 'ccel', label: 'Christian Classics Ethereal Library', by: 'Calvin University', kind: 'primary', url: 'https://www.ccel.org/' },
  { id: 'newadvent', label: 'Kirchenväter und Konzilsakten', by: 'New Advent', kind: 'primary', url: 'https://www.newadvent.org/fathers/' },
  { id: 'papalenc', label: 'Texte der ökumenischen Konzilien', by: 'Papal Encyclicals Online', kind: 'primary', url: 'https://www.papalencyclicals.net/councils/' },
  { id: 'vatican', label: 'Konzils- und Lehrtexte', by: 'Heiliger Stuhl', kind: 'archive', url: 'https://www.vatican.va/archive/index.htm' },
  { id: 'trent', label: 'Kanones und Dekrete des Konzils von Trient', by: 'Papal Encyclicals Online', kind: 'primary', url: 'https://www.papalencyclicals.net/councils/trent.htm' },
  { id: 'ekd', label: 'Barmer Theologische Erklärung, 1934', by: 'Evangelische Kirche in Deutschland', kind: 'primary', url: 'https://www.ekd.de/Barmer-Theologische-Erklarung-11298.htm' },
  { id: 'oikoumene', label: 'Ökumenischer Rat der Kirchen', by: 'ÖRK / WCC', kind: 'archive', url: 'https://www.oikoumene.org/' },
  { id: 'britannica', label: 'Nachschlagen', by: 'Encyclopædia Britannica', kind: 'ref', url: 'https://www.britannica.com/' },
  { id: 'wikipedia', label: 'Nachschlagen', by: 'Wikipedia', kind: 'ref', url: 'https://de.wikipedia.org/' },
  { id: 'pewsize', label: 'Global Christianity – Größe und Verteilung', by: 'Pew Research Center', kind: 'ref', url: 'https://www.pewresearch.org/religion/2011/12/19/global-christianity-exec/' },
];

export const SOURCE_BY_ID: Record<string, ChurchSource> = Object.fromEntries(SOURCES.map((s) => [s.id, s]));

/**
 * Die Bänder der Zeitschiene. Label und Farbe kommen aus dem Zeitbaum – hier
 * stehen nur die Jahre, die der Baum nicht als Zahl führt (er hat sie als Text,
 * „≈ 500–1500 n. Chr.", und daraus lässt sich nichts zeichnen).
 */
export const CHURCH_ERAS: { id: ChurchEra; from: number; to: number; epoch: Epoch }[] = (
  [
    ['urkirche', 30, 150],
    ['kirchenvater', 150, 500],
    ['mittelalter', 500, 1500],
    ['reformation', 1500, 1650],
    ['erweckung', 1650, 1900],
    ['moderne', 1900, 2026],
  ] as [ChurchEra, number, number][]
).map(([id, from, to]) => {
  const epoch = GEN_EPOCHS.find((e) => e.id === id);
  if (!epoch) throw new Error(`Epoche „${id}" fehlt im Zeitbaum`);
  return { id, from, to, epoch };
});

export const CHURCH_ERA_BY_ID = Object.fromEntries(CHURCH_ERAS.map((e) => [e.id, e])) as Record<
  ChurchEra,
  (typeof CHURCH_ERAS)[number]
>;

/** Was für ein Ereignis – das Zeichen auf der Karte hängt daran. */
export type ChurchKind =
  | 'council' // ein Konzil
  | 'split' // eine Spaltung
  | 'text' // ein Text: Bekenntnis, Übersetzung, Druck
  | 'mission' // Ausbreitung
  | 'persecution' // Verfolgung
  | 'reform' // Erneuerung von innen
  | 'other';

export interface ChurchEvent {
  id: string;
  era: ChurchEra;
  /** Jahr für Reihenfolge und Zeitregler. */
  year: number;
  when: BiText;
  de: string;
  en: string;
  kind: ChurchKind;
  text: BiText;
  /** Wo auf der Karte. Ohne Ort erscheint das Ereignis nur auf der Schiene. */
  at?: [number, number];
  place?: BiText;
  /** Bibelstelle, wo die Bibel es erzählt. */
  ref?: string;
  /** Person aus dem Zeitbaum, die hier handelt – ein Sprung dorthin. */
  personId?: string;
  /** Kennungen aus SOURCES – mindestens eine, sonst steht der Eintrag nicht da. */
  sources: string[];
  /** Suchbegriff für den Nachschlagewerk-Link. */
  topic?: string;
}

/**
 * Die Ereignisse. Ausgewählt nach einer Frage: Hat es verändert, wo Kirche ist,
 * was sie glaubt oder wie sie verfasst ist? Kaiser und Schlachten stehen nur
 * dort, wo sie genau das taten.
 *
 * Die Spaltungen sind mit Absicht ausführlich – 451, 1054 und 1517 sind der
 * Grund, warum es heute mehrere Kirchen gibt, und wer nur eine Seite erzählt,
 * erklärt die Gegenwart nicht. Wo zwei Traditionen dasselbe Ereignis anders
 * ansehen, steht das dabei.
 */
export const EVENTS: ChurchEvent[] = [
  {
    id: 'pfingsten', era: 'urkirche', year: 30,
    when: { de: 'um 30 n. Chr.', en: 'c. AD 30' },
    de: 'Pfingsten', en: 'Pentecost', kind: 'other',
    at: [31.78, 35.23], place: { de: 'Jerusalem', en: 'Jerusalem' },
    text: {
      de: 'Die Jünger reden, und jeder hört seine eigene Sprache. Die Liste der Herkunftsländer in Apg 2,9-11 reicht von Persien bis Rom – die erste Landkarte der Kirche steht schon am ersten Tag, und sie ist mehrsprachig.',
      en: 'The disciples speak, and everyone hears their own language. The list of homelands in Acts 2:9-11 runs from Persia to Rome – the church’s first map is there on day one, and it is multilingual.',
    },
    ref: 'Apg 2', sources: ['bibel'], topic: 'Pfingsten',
  },
  {
    id: 'apostelkonzil', era: 'urkirche', year: 49,
    when: { de: 'um 49 n. Chr.', en: 'c. AD 49' },
    de: 'Das Apostelkonzil', en: 'The Council of Jerusalem', kind: 'council',
    at: [31.78, 35.23], place: { de: 'Jerusalem', en: 'Jerusalem' },
    text: {
      de: 'Die erste Streitfrage der Kirche ist keine über Gott, sondern über die Aufnahmebedingung: Muss ein Heide erst Jude werden? Die Antwort ist Nein – und damit entscheidet sich, dass diese Bewegung eine Weltkirche werden kann und keine Sondergruppe des Judentums bleibt.',
      en: 'The church’s first controversy is not about God but about the terms of entry: must a gentile first become a Jew? The answer is no – and with it, this movement can become a world church rather than remain a sect within Judaism.',
    },
    ref: 'Apg 15', sources: ['bibel'], topic: 'Apostelkonzil',
  },
  {
    id: 'brand-rom', era: 'urkirche', year: 64,
    when: { de: '64 n. Chr.', en: 'AD 64' },
    de: 'Neros Verfolgung in Rom', en: 'Nero’s persecution in Rome', kind: 'persecution',
    at: [41.9, 12.5], place: { de: 'Rom', en: 'Rome' },
    text: {
      de: 'Nach dem Brand Roms braucht Nero Schuldige. Tacitus, selbst kein Freund der Christen, beschreibt die Hinrichtungen – und liefert damit das früheste nichtchristliche Zeugnis über sie. Nach der Überlieferung sterben Petrus und Paulus in diesen Jahren.',
      en: 'After Rome burns, Nero needs someone to blame. Tacitus, no friend of the Christians himself, describes the executions – and thereby gives the earliest non-Christian testimony about them. Tradition places the deaths of Peter and Paul in these years.',
    },
    sources: ['ccel', 'britannica'], topic: 'Christenverfolgung',
  },
  {
    id: 'tempel-70', era: 'urkirche', year: 70,
    when: { de: '70 n. Chr.', en: 'AD 70' },
    de: 'Der Tempel fällt – die Wege trennen sich', en: 'The Temple falls – the ways part', kind: 'split',
    at: [31.78, 35.23], place: { de: 'Jerusalem', en: 'Jerusalem' },
    text: {
      de: 'Mit dem Tempel verliert die Jerusalemer Gemeinde ihren Mittelpunkt, und das Christentum sein jüdisches Zentrum. Von hier an liegt sein Schwerpunkt in den griechischen Städten der Diaspora. Judentum und Kirche gehen getrennte Wege – ein Vorgang über Generationen, kein Datum.',
      en: 'With the Temple, the Jerusalem community loses its centre and Christianity its Jewish heartland. From here its weight lies in the Greek cities of the diaspora. Judaism and the church go separate ways – a process over generations, not a date.',
    },
    sources: ['britannica', 'wikipedia'], topic: 'Zerstörung des Zweiten Tempels',
  },
  {
    id: 'ignatius', era: 'urkirche', year: 110,
    when: { de: 'um 110 n. Chr.', en: 'c. AD 110' },
    de: 'Ignatius schreibt auf dem Weg nach Rom', en: 'Ignatius writes on the road to Rome', kind: 'text',
    at: [36.2, 36.16], place: { de: 'Antiochia', en: 'Antioch' },
    personId: 'ignatius',
    text: {
      de: 'Der Bischof von Antiochia wird zur Hinrichtung nach Rom gebracht und schreibt unterwegs sieben Briefe. In einem steht zum ersten Mal das Wort „katholische Kirche" – gemeint ist nicht eine Konfession, sondern die ganze, überall dieselbe.',
      en: 'The bishop of Antioch is taken to Rome for execution and writes seven letters on the way. One of them carries the first use of the phrase "catholic church" – meaning not a denomination but the whole, the same everywhere.',
    },
    sources: ['ccel', 'newadvent'], topic: 'Ignatius von Antiochien',
  },
  {
    id: 'polykarp', era: 'kirchenvater', year: 155,
    when: { de: 'um 155 n. Chr.', en: 'c. AD 155' },
    de: 'Polykarps Martyrium', en: 'The martyrdom of Polycarp', kind: 'persecution',
    at: [38.42, 27.14], place: { de: 'Smyrna (Izmir)', en: 'Smyrna (Izmir)' },
    personId: 'polykarp',
    text: {
      de: 'Der Bericht über den Tod des greisen Bischofs von Smyrna ist die älteste erhaltene Märtyrerakte. Sie prägt eine Form, die die Kirche jahrhundertelang beibehält: nicht der Kaiser, sondern der Sterbende hat das letzte Wort.',
      en: 'The account of the aged bishop of Smyrna’s death is the oldest surviving martyr act. It shapes a form the church keeps for centuries: not the emperor but the dying man has the last word.',
    },
    sources: ['ccel', 'newadvent'], topic: 'Polykarp',
  },
  {
    id: 'kanon', era: 'kirchenvater', year: 200,
    when: { de: '2.–4. Jahrhundert', en: '2nd–4th century' },
    de: 'Wie das Neue Testament entsteht', en: 'How the New Testament comes together', kind: 'text',
    at: [31.2, 29.92], place: { de: 'Alexandria', en: 'Alexandria' },
    text: {
      de: 'Kein Konzil beschließt den Kanon. Er wächst: Gemeinden lesen bestimmte Schriften im Gottesdienst, andere nicht. Der Kanon Muratori (um 200) zählt schon fast dieselben Bücher; der Osterbrief des Athanasius von 367 nennt zum ersten Mal genau die 27, die heute darin stehen.',
      en: 'No council decrees the canon. It grows: congregations read certain writings in worship and others not. The Muratorian fragment (c. 200) already lists nearly the same books; Athanasius’ Easter letter of 367 is the first to name exactly the 27 that stand there today.',
    },
    personId: 'athanasius',
    sources: ['ccel', 'newadvent'], topic: 'Kanon des Neuen Testaments',
  },
  {
    id: 'diokletian', era: 'kirchenvater', year: 303,
    when: { de: '303–311 n. Chr.', en: 'AD 303–311' },
    de: 'Die letzte große Verfolgung', en: 'The last great persecution', kind: 'persecution',
    at: [43.51, 16.44], place: { de: 'Nikomedia / Reich', en: 'Nicomedia / the Empire' },
    text: {
      de: 'Diokletian lässt Kirchen niederreißen und Schriften verbrennen. Der Streit danach ist folgenreicher als die Verfolgung selbst: Was gilt für die, die ihre Bibeln herausgaben, um zu überleben? Über diese Frage spaltet sich die nordafrikanische Kirche für Jahrhunderte.',
      en: 'Diocletian has churches pulled down and scriptures burnt. The quarrel afterwards matters more than the persecution: what of those who handed over their Bibles to survive? Over that question the North African church splits for centuries.',
    },
    sources: ['britannica', 'newadvent'], topic: 'Diokletianische Christenverfolgung',
  },
  {
    id: 'mailand', era: 'kirchenvater', year: 313,
    when: { de: '313 n. Chr.', en: 'AD 313' },
    de: 'Die Mailänder Vereinbarung', en: 'The Edict of Milan', kind: 'other',
    at: [45.46, 9.19], place: { de: 'Mailand', en: 'Milan' },
    text: {
      de: 'Konstantin und Licinius geben das Christentum frei. Aus einer verfolgten Minderheit wird binnen zweier Menschenalter die Religion des Reiches – und die Kirche bekommt ein Problem, das sie bis heute hat: Was macht Macht mit ihr?',
      en: 'Constantine and Licinius grant the Christians freedom. Within two generations a persecuted minority becomes the religion of the empire – and the church acquires the problem it still has: what does power do to it?',
    },
    sources: ['britannica', 'newadvent'], topic: 'Mailänder Vereinbarung',
  },
  {
    id: 'nicaea', era: 'kirchenvater', year: 325,
    when: { de: '325 n. Chr.', en: 'AD 325' },
    de: 'Nicäa I: „wesensgleich"', en: 'Nicaea I: "of one being"', kind: 'council',
    at: [40.43, 29.72], place: { de: 'Nicäa (İznik)', en: 'Nicaea (İznik)' },
    personId: 'athanasius',
    text: {
      de: 'Ist Christus geschaffen oder ewig? Arius sagt geschaffen; das Konzil sagt „wesensgleich mit dem Vater" – ein Wort, das nicht in der Bibel steht und gerade deshalb gewählt wird: Es lässt sich nicht umdeuten. Das Bekenntnis von Nicäa ist bis heute der Text, den fast alle Kirchen gemeinsam sprechen.',
      en: 'Is Christ created or eternal? Arius says created; the council says "of one being with the Father" – a word not found in the Bible, chosen for exactly that reason: it cannot be explained away. The Nicene Creed is still the text almost all churches say together.',
    },
    sources: ['papalenc', 'newadvent'], topic: 'Erstes Konzil von Nicäa',
  },
  {
    id: 'konstantinopel1', era: 'kirchenvater', year: 381,
    when: { de: '381 n. Chr.', en: 'AD 381' },
    de: 'Konstantinopel I', en: 'Constantinople I', kind: 'council',
    at: [41.01, 28.98], place: { de: 'Konstantinopel', en: 'Constantinople' },
    personId: 'gregor_naz',
    text: {
      de: 'Nicäa hatte über den Sohn gesprochen, nicht über den Geist. Das zweite Konzil ergänzt ihn – und gibt dem Bekenntnis die Form, in der es heute gesprochen wird. Gregor von Nazianz leitet es eine Zeitlang und tritt mitten darin zurück.',
      en: 'Nicaea had spoken of the Son, not of the Spirit. The second council adds him – and gives the creed the shape in which it is said today. Gregory of Nazianzus presides for a while and resigns in the middle of it.',
    },
    sources: ['papalenc', 'newadvent'], topic: 'Erstes Konzil von Konstantinopel',
  },
  {
    id: 'vulgata', era: 'kirchenvater', year: 405,
    when: { de: '382–405 n. Chr.', en: 'AD 382–405' },
    de: 'Hieronymus übersetzt die Vulgata', en: 'Jerome translates the Vulgate', kind: 'text',
    at: [31.7, 35.2], place: { de: 'Bethlehem', en: 'Bethlehem' },
    personId: 'hieronymus',
    text: {
      de: 'Hieronymus geht für die Übersetzung ans Original: das Alte Testament aus dem Hebräischen, nicht aus dem griechischen Zwischentext. Das war umstritten – Augustinus riet ab. Seine lateinische Bibel bleibt tausend Jahre lang die Bibel des Westens.',
      en: 'Jerome goes to the originals: the Old Testament from Hebrew, not from the Greek intermediary. This was contested – Augustine advised against it. His Latin Bible remains the Bible of the West for a thousand years.',
    },
    sources: ['ccel', 'newadvent'], topic: 'Vulgata',
  },
  {
    id: 'ephesus', era: 'kirchenvater', year: 431,
    when: { de: '431 n. Chr.', en: 'AD 431' },
    de: 'Ephesus – und die erste bleibende Trennung', en: 'Ephesus – and the first lasting separation', kind: 'split',
    at: [37.94, 27.34], place: { de: 'Ephesus', en: 'Ephesus' },
    personId: 'kyrill',
    text: {
      de: 'Um den Titel „Gottesgebärerin" für Maria bricht der Streit auf, wie Gott und Mensch in Christus zusammengehören. Das Konzil verurteilt Nestorius – und die Kirche des Ostens, heute in Irak, Iran und Indien, geht ihren eigenen Weg. Sie nennt sich nicht nestorianisch; das ist der Name, den ihr die Gegenseite gab.',
      en: 'Over the title "God-bearer" for Mary, the quarrel breaks open about how God and man belong together in Christ. The council condemns Nestorius – and the Church of the East, today in Iraq, Iran and India, goes its own way. It does not call itself Nestorian; that is the name the other side gave it.',
    },
    sources: ['papalenc', 'newadvent'], topic: 'Konzil von Ephesos',
  },
  {
    id: 'chalcedon', era: 'kirchenvater', year: 451,
    when: { de: '451 n. Chr.', en: 'AD 451' },
    de: 'Chalcedon – zwei Naturen, drei Kirchen', en: 'Chalcedon – two natures, three churches', kind: 'split',
    at: [40.99, 29.03], place: { de: 'Chalcedon (Kadıköy)', en: 'Chalcedon (Kadıköy)' },
    text: {
      de: 'Christus: zwei Naturen in einer Person, „unvermischt und ungetrennt". Für die meisten Kirchen ist das bis heute die Grundformel. Für die koptische, die armenische, die syrische und die äthiopische Kirche ging sie zu weit – sie trennen sich hier. Moderne Gespräche kommen zu dem Schluss, dass beide Seiten dasselbe meinten und verschiedene Wörter dafür hatten.',
      en: 'Christ: two natures in one person, "without confusion, without division". For most churches that is still the basic formula. For the Coptic, Armenian, Syriac and Ethiopian churches it went too far – they separate here. Modern dialogue has concluded that both sides meant the same thing in different words.',
    },
    sources: ['papalenc', 'oikoumene'], topic: 'Konzil von Chalcedon',
  },
  {
    id: 'benedikt', era: 'mittelalter', year: 529,
    when: { de: 'um 529 n. Chr.', en: 'c. AD 529' },
    de: 'Benedikt schreibt seine Regel', en: 'Benedict writes his Rule', kind: 'reform',
    at: [41.49, 13.81], place: { de: 'Monte Cassino', en: 'Monte Cassino' },
    text: {
      de: 'Ein Text über Schlafenszeiten, Essen und Gehorsam – und die folgenreichste Organisationsschrift des Abendlandes. Die Klöster nach dieser Regel werden für tausend Jahre Schule, Bibliothek, Krankenhaus und Landwirtschaftsbetrieb. Ohne ihre Schreibstuben wäre die antike Literatur nicht erhalten.',
      en: 'A text about bedtimes, food and obedience – and the most consequential organisational document of the West. Monasteries under this Rule become school, library, hospital and farm for a thousand years. Without their scriptoria, ancient literature would not have survived.',
    },
    sources: ['ccel', 'britannica'], topic: 'Benediktsregel',
  },
  {
    id: 'islam', era: 'mittelalter', year: 638,
    when: { de: '634–711 n. Chr.', en: 'AD 634–711' },
    de: 'Die arabische Eroberung', en: 'The Arab conquest', kind: 'other',
    at: [31.78, 35.23], place: { de: 'Jerusalem und der Süden', en: 'Jerusalem and the south' },
    text: {
      de: 'Innerhalb eines Jahrhunderts kommen Syrien, Ägypten, Nordafrika und Spanien unter islamische Herrschaft – die drei ältesten Patriarchate der Christenheit neben Rom liegen danach außerhalb des christlichen Reiches. Christliche Gemeinden bleiben dort bestehen, aber als Minderheit. Der Schwerpunkt der Kirche verschiebt sich endgültig nach Norden.',
      en: 'Within a century Syria, Egypt, North Africa and Spain come under Islamic rule – three of the four oldest patriarchates of Christendom now lie outside the Christian empire. Christian communities remain there, but as minorities. The church’s centre of gravity shifts north for good.',
    },
    sources: ['britannica', 'wikipedia'], topic: 'Islamische Expansion',
  },
  {
    id: 'nicaea2', era: 'mittelalter', year: 787,
    when: { de: '787 n. Chr.', en: 'AD 787' },
    de: 'Nicäa II: das letzte gemeinsame Konzil', en: 'Nicaea II: the last shared council', kind: 'council',
    at: [40.43, 29.72], place: { de: 'Nicäa (İznik)', en: 'Nicaea (İznik)' },
    text: {
      de: 'Der Bilderstreit endet mit der Erlaubnis, Ikonen zu verehren – die Verehrung gelte dem Dargestellten, nicht dem Holz. Es ist das siebte Konzil und das letzte, das Ost und West gemeinsam als ökumenisch anerkennen. Was danach kommt, zählt jede Seite für sich.',
      en: 'The iconoclast controversy ends with permission to venerate icons – the honour passes to the one depicted, not to the wood. It is the seventh council and the last that East and West both recognise as ecumenical. What comes after, each side counts for itself.',
    },
    sources: ['papalenc', 'newadvent'], topic: 'Zweites Konzil von Nicäa',
  },
  {
    id: 'kyrill-method', era: 'mittelalter', year: 863,
    when: { de: 'ab 863 n. Chr.', en: 'from AD 863' },
    de: 'Kyrill und Method gehen zu den Slawen', en: 'Cyril and Methodius go to the Slavs', kind: 'mission',
    at: [48.5, 17.0], place: { de: 'Großmähren', en: 'Great Moravia' },
    text: {
      de: 'Zwei Brüder aus Thessaloniki erfinden eine Schrift, um die Bibel und die Liturgie in die Sprache der Slawen zu bringen. Aus ihrem Alphabet wird die Kyrilliza. Der Grundsatz dahinter – Gottesdienst in der Sprache des Volkes – setzt sich im Osten durch und im Westen erst siebenhundert Jahre später.',
      en: 'Two brothers from Thessalonica devise a script to bring Bible and liturgy into the language of the Slavs. Their alphabet becomes Cyrillic. The principle behind it – worship in the people’s own tongue – prevails in the East, and in the West only seven hundred years later.',
    },
    sources: ['britannica', 'newadvent'], topic: 'Kyrill und Method',
  },
  {
    id: 'schisma', era: 'mittelalter', year: 1054,
    when: { de: '1054', en: '1054' },
    de: 'Das Morgenländische Schisma', en: 'The East–West Schism', kind: 'split',
    at: [41.01, 28.98], place: { de: 'Konstantinopel', en: 'Constantinople' },
    text: {
      de: 'Gegenseitige Bannsprüche in der Hagia Sophia. Der Streitpunkt ist ein Wort im Bekenntnis – ob der Geist auch „vom Sohn" ausgeht, das Filioque, vom Westen einseitig eingefügt – und dahinter die Frage, ob Rom über die anderen Patriarchate zu entscheiden hat. 1054 ist nicht der Anfang der Entfremdung und nicht ihr Ende; die Bannsprüche werden 1965 zurückgenommen, die Trennung bleibt.',
      en: 'Mutual excommunications in the Hagia Sophia. The point at issue is one word in the creed – whether the Spirit proceeds also "from the Son", the Filioque, inserted unilaterally by the West – and behind it the question whether Rome decides for the other patriarchates. 1054 is neither the beginning of the estrangement nor its end; the excommunications are lifted in 1965, the separation remains.',
    },
    sources: ['britannica', 'oikoumene'], topic: 'Morgenländisches Schisma',
  },
  {
    id: 'kreuzzug4', era: 'mittelalter', year: 1204,
    when: { de: '1204', en: '1204' },
    de: 'Kreuzfahrer plündern Konstantinopel', en: 'Crusaders sack Constantinople', kind: 'split',
    at: [41.01, 28.98], place: { de: 'Konstantinopel', en: 'Constantinople' },
    text: {
      de: 'Der vierte Kreuzzug erreicht Jerusalem nie. Er nimmt und plündert stattdessen die größte christliche Stadt der Welt. Für das Verhältnis von Ost und West richtet das mehr Schaden an als das Schisma von 1054 – Papst Johannes Paul II. bittet 2001 dafür um Vergebung.',
      en: 'The Fourth Crusade never reaches Jerusalem. It takes and sacks the largest Christian city in the world instead. For relations between East and West this does more damage than the schism of 1054 – Pope John Paul II asked forgiveness for it in 2001.',
    },
    sources: ['britannica', 'vatican'], topic: 'Vierter Kreuzzug',
  },
  {
    id: 'franziskus', era: 'mittelalter', year: 1209,
    when: { de: 'um 1209', en: 'c. 1209' },
    de: 'Franz von Assisi und die Armut', en: 'Francis of Assisi and poverty', kind: 'reform',
    at: [43.07, 12.62], place: { de: 'Assisi', en: 'Assisi' },
    personId: 'franz_assisi',
    text: {
      de: 'Der Sohn eines Tuchhändlers gibt alles weg und predigt in einer Kirche, die reich geworden ist. Anders als andere Armutsbewegungen derselben Jahre wird seine nicht verurteilt, sondern anerkannt – die Trennlinie zwischen Erneuerung und Ketzerei verlief oft nur dort, wo Rom sie zog.',
      en: 'A cloth merchant’s son gives everything away and preaches inside a church that has grown rich. Unlike other poverty movements of the same years, his is not condemned but approved – the line between renewal and heresy often ran only where Rome drew it.',
    },
    sources: ['ccel', 'britannica'], topic: 'Franz von Assisi',
  },
  {
    id: 'hus', era: 'mittelalter', year: 1415,
    when: { de: '6. Juli 1415', en: '6 July 1415' },
    de: 'Jan Hus wird verbrannt', en: 'Jan Hus is burnt', kind: 'reform',
    at: [47.66, 9.18], place: { de: 'Konstanz', en: 'Constance' },
    personId: 'hus',
    text: {
      de: 'Hus fordert Predigt in der Landessprache und den Kelch auch für die Gemeinde. Er kommt mit kaiserlichem Geleitbrief nach Konstanz und wird trotzdem verurteilt und verbrannt. Hundert Jahre später sagt Luther über sich: „Wir sind alle Hussiten, ohne es zu wissen."',
      en: 'Hus demands preaching in the vernacular and the cup for the laity as well. He comes to Constance under an imperial safe-conduct and is condemned and burnt all the same. A hundred years later Luther says of himself: "We are all Hussites without knowing it."',
    },
    sources: ['ccel', 'britannica'], topic: 'Jan Hus',
  },
  {
    id: 'gutenberg', era: 'mittelalter', year: 1455,
    when: { de: 'um 1455', en: 'c. 1455' },
    de: 'Gutenberg druckt die Bibel', en: 'Gutenberg prints the Bible', kind: 'text',
    at: [49.99, 8.27], place: { de: 'Mainz', en: 'Mainz' },
    text: {
      de: 'Das erste in Europa mit beweglichen Lettern gedruckte Buch ist die lateinische Bibel. Die Erfindung entscheidet sechzig Jahre später, warum aus Luthers Thesen etwas anderes wird als aus denen von Hus: Ein Text ist nun in Wochen im ganzen Reich, nicht in Jahren.',
      en: 'The first book printed with movable type in Europe is the Latin Bible. Sixty years later that invention decides why Luther’s theses become something other than Hus’s did: a text now crosses the empire in weeks, not years.',
    },
    sources: ['britannica', 'wikipedia'], topic: 'Gutenberg-Bibel',
  },
  {
    id: 'thesen', era: 'reformation', year: 1517,
    when: { de: '31. Oktober 1517', en: '31 October 1517' },
    de: 'Luthers 95 Thesen', en: 'Luther’s 95 Theses', kind: 'reform',
    at: [51.87, 12.65], place: { de: 'Wittenberg', en: 'Wittenberg' },
    personId: 'luther',
    text: {
      de: 'Eine akademische Streitschrift gegen den Ablasshandel, auf Latein, für eine Fachdebatte gedacht. Innerhalb weniger Wochen ist sie übersetzt, gedruckt und überall. Die erste These sagt, worum es geht: dass das ganze Leben Buße sein soll – nicht ein bezahlbarer Vorgang.',
      en: 'An academic disputation against the sale of indulgences, in Latin, meant for a scholarly debate. Within weeks it is translated, printed and everywhere. The first thesis says what is at stake: that the whole of life should be repentance – not a payable transaction.',
    },
    sources: ['ccel', 'britannica'], topic: '95 Thesen',
  },
  {
    id: 'septembertestament', era: 'reformation', year: 1522,
    when: { de: 'September 1522', en: 'September 1522' },
    de: 'Das Neue Testament auf Deutsch', en: 'The New Testament in German', kind: 'text',
    at: [50.98, 10.31], place: { de: 'Wartburg / Wittenberg', en: 'Wartburg / Wittenberg' },
    personId: 'luther',
    text: {
      de: 'Elf Wochen auf der Wartburg, und das Neue Testament steht auf Deutsch – aus dem griechischen Original, nicht aus der Vulgata. Luther übersetzt nicht Wort für Wort, sondern sucht, wie man es sagen würde; damit prägt die Übersetzung die deutsche Sprache mit. Die ganze Bibel folgt 1534.',
      en: 'Eleven weeks at the Wartburg, and the New Testament stands in German – from the Greek original, not the Vulgate. Luther does not translate word for word but asks how one would say it; the translation shapes the German language in the process. The whole Bible follows in 1534.',
    },
    sources: ['ccel', 'britannica'], topic: 'Lutherbibel',
  },
  {
    id: 'marburg', era: 'reformation', year: 1529,
    when: { de: 'Oktober 1529', en: 'October 1529' },
    de: 'Marburg: die Reformation spaltet sich selbst', en: 'Marburg: the Reformation splits itself', kind: 'split',
    at: [50.81, 8.77], place: { de: 'Marburg', en: 'Marburg' },
    personId: 'zwingli',
    text: {
      de: 'Luther und Zwingli einigen sich über vierzehn Artikel und scheitern am fünfzehnten: Was ist im Abendmahl gegenwärtig? Luther schreibt „Das ist mein Leib" auf den Tisch und weicht nicht. Die evangelische Kirche ist von diesem Gespräch an mehr als eine.',
      en: 'Luther and Zwingli agree on fourteen articles and fail on the fifteenth: what is present in the Lord’s Supper? Luther writes "This is my body" on the table and does not move. From that conversation on, the Protestant church is more than one.',
    },
    sources: ['ccel', 'britannica'], topic: 'Marburger Religionsgespräch',
  },
  {
    id: 'augsburg-bekenntnis', era: 'reformation', year: 1530,
    when: { de: '25. Juni 1530', en: '25 June 1530' },
    de: 'Das Augsburger Bekenntnis', en: 'The Augsburg Confession', kind: 'text',
    at: [48.37, 10.9], place: { de: 'Augsburg', en: 'Augsburg' },
    personId: 'melanchthon',
    text: {
      de: 'Melanchthon fasst zusammen, was die Evangelischen glauben – bewusst versöhnlich formuliert, als Nachweis, dass hier keine neue Religion entsteht. Der Ausgleich misslingt; der Text bleibt bis heute die Grundschrift der lutherischen Kirchen.',
      en: 'Melanchthon sets out what the Protestants believe – deliberately conciliatory in tone, as evidence that no new religion is being founded. The reconciliation fails; the text remains the founding document of the Lutheran churches to this day.',
    },
    sources: ['ccel'], topic: 'Augsburger Bekenntnis',
  },
  {
    id: 'institutio', era: 'reformation', year: 1536,
    when: { de: '1536, erweitert bis 1559', en: '1536, expanded to 1559' },
    de: 'Calvins Institutio – und Genf', en: 'Calvin’s Institutes – and Geneva', kind: 'text',
    at: [46.2, 6.14], place: { de: 'Genf', en: 'Geneva' },
    personId: 'calvin',
    text: {
      de: 'Ein Handbuch des Glaubens, in vier Fassungen über dreiundzwanzig Jahre gewachsen. Von Genf aus prägt Calvins Form der Reformation Frankreich, die Niederlande, Schottland und über die Auswanderer Nordamerika – reformierte Kirchen, nicht lutherische.',
      en: 'A handbook of the faith, grown through four editions over twenty-three years. From Geneva, Calvin’s form of the Reformation shapes France, the Netherlands, Scotland and, through emigrants, North America – Reformed churches, not Lutheran.',
    },
    sources: ['ccel', 'britannica'], topic: 'Institutio Christianae Religionis',
  },
  {
    id: 'trient', era: 'reformation', year: 1545,
    when: { de: '1545–1563', en: '1545–1563' },
    de: 'Das Konzil von Trient', en: 'The Council of Trent', kind: 'council',
    at: [46.07, 11.12], place: { de: 'Trient (Trento)', en: 'Trent (Trento)' },
    text: {
      de: 'Achtzehn Jahre, drei Sitzungsperioden: Die katholische Kirche antwortet auf die Reformation, indem sie Missstände abstellt und zugleich jeden reformatorischen Lehrsatz verwirft. Priesterseminare, ein einheitlicher Messritus, ein Katechismus – die Gestalt, in der der Katholizismus bis zum Zweiten Vatikanum bleibt.',
      en: 'Eighteen years in three sessions: the Catholic Church answers the Reformation by removing abuses and at the same time rejecting every Reformation doctrine. Seminaries, a uniform rite of the Mass, a catechism – the shape Catholicism keeps until the Second Vatican Council.',
    },
    sources: ['trent', 'vatican'], topic: 'Konzil von Trient',
  },
  {
    id: 'westfalen', era: 'reformation', year: 1648,
    when: { de: '1648', en: '1648' },
    de: 'Westfälischer Friede', en: 'Peace of Westphalia', kind: 'other',
    at: [51.96, 7.63], place: { de: 'Münster und Osnabrück', en: 'Münster and Osnabrück' },
    text: {
      de: 'Nach dreißig Jahren Krieg, der Mitteleuropa entvölkerte, wird die Konfessionsspaltung als Dauerzustand anerkannt – katholisch, lutherisch und reformiert nebeneinander. Nicht aus Einsicht, sondern aus Erschöpfung. Der Gedanke, dass Glaube sich nicht erzwingen lässt, beginnt hier seinen Weg.',
      en: 'After thirty years of war that depopulated central Europe, the confessional split is accepted as permanent – Catholic, Lutheran and Reformed side by side. Not from insight but from exhaustion. The idea that faith cannot be compelled starts its road here.',
    },
    sources: ['britannica', 'wikipedia'], topic: 'Westfälischer Friede',
  },
  {
    id: 'pietismus', era: 'erweckung', year: 1675,
    when: { de: '1675', en: '1675' },
    de: 'Der Pietismus', en: 'Pietism', kind: 'reform',
    at: [50.11, 8.68], place: { de: 'Frankfurt am Main', en: 'Frankfurt am Main' },
    text: {
      de: 'Speners „Pia Desideria" fragt, was aus der Reformation im Alltag geworden ist, und antwortet mit Bibelkreisen, Laienbeteiligung und gelebter Frömmigkeit statt richtiger Lehre allein. Aus dieser Wurzel kommen die Herrnhuter, das Waisenhaus in Halle und die erste evangelische Weltmission.',
      en: 'Spener’s "Pia Desideria" asks what became of the Reformation in daily life, and answers with Bible circles, lay participation and lived piety rather than correct doctrine alone. From this root come the Moravians, the orphanage at Halle and the first Protestant world mission.',
    },
    sources: ['ccel', 'britannica'], topic: 'Pietismus',
  },
  {
    id: 'wesley', era: 'erweckung', year: 1738,
    when: { de: '24. Mai 1738', en: '24 May 1738' },
    de: 'Wesley und die Erweckung', en: 'Wesley and the Revival', kind: 'reform',
    at: [51.51, -0.09], place: { de: 'London', en: 'London' },
    personId: 'wesley',
    text: {
      de: 'Wesley predigt auf Feldern und in Bergwerken, weil ihm die Kanzeln verschlossen werden – bis zu 40 000 Predigten und eine Bewegung, die zur methodistischen Kirche wird. Ihre Sozialarbeit unter Bergleuten und Fabrikarbeitern prägt Englands Gewerkschaften mehr als jede politische Schrift.',
      en: 'Wesley preaches in fields and coal pits because the pulpits are closed to him – some 40,000 sermons and a movement that becomes the Methodist Church. Its social work among miners and factory hands shapes England’s trade unions more than any political tract.',
    },
    sources: ['ccel', 'britannica'], topic: 'John Wesley',
  },
  {
    id: 'weltmission', era: 'erweckung', year: 1792,
    when: { de: 'ab 1792', en: 'from 1792' },
    de: 'Die evangelische Weltmission beginnt', en: 'Protestant world mission begins', kind: 'mission',
    at: [22.57, 88.36], place: { de: 'Serampore, Bengalen', en: 'Serampore, Bengal' },
    text: {
      de: 'William Carey geht nach Indien und übersetzt die Bibel in sechs Sprachen. Im Jahrhundert danach wird das Christentum zum ersten Mal wirklich weltweit – und ist doch untrennbar mit dem Kolonialismus verflochten, dessen Wege es benutzt. Beides gehört zu dieser Geschichte.',
      en: 'William Carey goes to India and translates the Bible into six languages. In the century that follows, Christianity becomes genuinely worldwide for the first time – and is inseparably entangled with the colonialism whose routes it uses. Both belong to this story.',
    },
    sources: ['britannica', 'oikoumene'], topic: 'William Carey',
  },
  {
    id: 'spurgeon', era: 'erweckung', year: 1861,
    when: { de: '1861', en: '1861' },
    de: 'Spurgeon und die Massenpredigt', en: 'Spurgeon and mass preaching', kind: 'other',
    at: [51.49, -0.1], place: { de: 'London', en: 'London' },
    personId: 'spurgeon',
    text: {
      de: 'Das Metropolitan Tabernacle fasst fünftausend Menschen, und es ist voll. Spurgeons Predigten erscheinen wöchentlich im Druck und werden in über dreißig Sprachen übersetzt – Massenkommunikation vor dem Rundfunk.',
      en: 'The Metropolitan Tabernacle holds five thousand people, and it is full. Spurgeon’s sermons appear weekly in print and are translated into more than thirty languages – mass communication before broadcasting.',
    },
    sources: ['ccel'], topic: 'Charles Spurgeon',
  },
  {
    id: 'vatikan1', era: 'erweckung', year: 1870,
    when: { de: '1869–1870', en: '1869–1870' },
    de: 'Erstes Vatikanisches Konzil', en: 'First Vatican Council', kind: 'council',
    at: [41.9, 12.45], place: { de: 'Rom', en: 'Rome' },
    text: {
      de: 'Das Konzil erklärt den Papst für unfehlbar, wenn er in Glaubensfragen endgültig entscheidet – eine eng begrenzte Bedingung, die selten in Anspruch genommen wurde. Es endet abrupt: italienische Truppen nehmen Rom, der Kirchenstaat hört auf zu bestehen.',
      en: 'The council declares the pope infallible when he defines a matter of faith definitively – a narrowly bounded condition, rarely invoked. It ends abruptly: Italian troops take Rome and the Papal States cease to exist.',
    },
    sources: ['papalenc', 'vatican'], topic: 'Erstes Vatikanisches Konzil',
  },
  {
    id: 'edinburgh', era: 'moderne', year: 1910,
    when: { de: '1910', en: '1910' },
    de: 'Edinburgh: der Anfang der Ökumene', en: 'Edinburgh: the start of the ecumenical movement', kind: 'other',
    at: [55.95, -3.19], place: { de: 'Edinburgh', en: 'Edinburgh' },
    text: {
      de: 'Eine Missionskonferenz stellt fest, dass konkurrierende Missionen sich gegenseitig im Weg stehen, und fragt zum ersten Mal organisiert nach der Einheit. Daraus wird 1948 der Ökumenische Rat der Kirchen.',
      en: 'A missionary conference finds that competing missions get in each other’s way, and asks the question of unity in an organised form for the first time. Out of it grows the World Council of Churches in 1948.',
    },
    sources: ['oikoumene'], topic: 'Weltmissionskonferenz Edinburgh 1910',
  },
  {
    id: 'barmen', era: 'moderne', year: 1934,
    when: { de: '31. Mai 1934', en: '31 May 1934' },
    de: 'Die Barmer Theologische Erklärung', en: 'The Barmen Declaration', kind: 'text',
    at: [51.26, 7.15], place: { de: 'Wuppertal-Barmen', en: 'Wuppertal-Barmen' },
    personId: 'bonhoeffer',
    text: {
      de: 'Gegen eine Kirche, die sich dem Nationalsozialismus angleicht, hält die Bekennende Kirche sechs Sätze dagegen: Jesus Christus ist das eine Wort Gottes, „das wir zu hören... haben" – neben ihm keine anderen Ereignisse und Mächte als Offenbarung. Es ist die schärfste Absage einer Kirche an einen Staat in der neueren Geschichte, und die Mehrheit der Gemeinden folgte ihr nicht.',
      en: 'Against a church conforming itself to National Socialism, the Confessing Church sets six theses: Jesus Christ is the one Word of God "which we have to hear" – beside him no other events or powers as revelation. It is the sharpest refusal of a state by a church in modern history, and most congregations did not follow it.',
    },
    sources: ['ekd'], topic: 'Barmer Theologische Erklärung',
  },
  {
    id: 'oerk', era: 'moderne', year: 1948,
    when: { de: '1948', en: '1948' },
    de: 'Der Ökumenische Rat der Kirchen', en: 'The World Council of Churches', kind: 'other',
    at: [46.22, 6.14], place: { de: 'Amsterdam / Genf', en: 'Amsterdam / Geneva' },
    text: {
      de: 'Drei Jahre nach dem Krieg schließen sich 147 Kirchen zusammen – orthodoxe, anglikanische, protestantische. Rom tritt nicht bei und schickt Beobachter. Heute gehören über 350 Kirchen dazu, mit zusammen rund einer halben Milliarde Mitgliedern.',
      en: 'Three years after the war, 147 churches come together – Orthodox, Anglican, Protestant. Rome does not join and sends observers. Today more than 350 churches belong, with some half a billion members between them.',
    },
    sources: ['oikoumene'], topic: 'Ökumenischer Rat der Kirchen',
  },
  {
    id: 'vatikan2', era: 'moderne', year: 1962,
    when: { de: '1962–1965', en: '1962–1965' },
    de: 'Zweites Vatikanisches Konzil', en: 'Second Vatican Council', kind: 'council',
    at: [41.9, 12.45], place: { de: 'Rom', en: 'Rome' },
    text: {
      de: 'Messe in der Landessprache statt auf Latein, die Kirche als „Volk Gottes", Religionsfreiheit als Recht, und ein neues Verhältnis zum Judentum: „Nostra aetate" widerruft den Vorwurf des Gottesmordes. Die größte Änderung im Katholizismus seit Trient – und bis heute umstritten.',
      en: 'Mass in the vernacular instead of Latin, the church as "the people of God", religious freedom as a right, and a new relationship with Judaism: "Nostra aetate" withdraws the charge of deicide. The largest change in Catholicism since Trent – and contested to this day.',
    },
    sources: ['vatican', 'papalenc'], topic: 'Zweites Vatikanisches Konzil',
  },
  {
    id: 'aufhebung1965', era: 'moderne', year: 1965,
    when: { de: '7. Dezember 1965', en: '7 December 1965' },
    de: 'Die Bannsprüche von 1054 werden aufgehoben', en: 'The excommunications of 1054 are lifted', kind: 'other',
    at: [41.01, 28.98], place: { de: 'Rom und Konstantinopel', en: 'Rome and Constantinople' },
    text: {
      de: 'Papst Paul VI. und Patriarch Athenagoras erklären am selben Tag in Rom und Konstantinopel die gegenseitigen Bannsprüche für getilgt. Neunhundertelf Jahre nach 1054 – und die Kirchen bleiben getrennt: Zurückgenommen ist die Verurteilung, nicht die Trennung.',
      en: 'Pope Paul VI and Patriarch Athenagoras declare the mutual excommunications removed, on the same day in Rome and Constantinople. Nine hundred and eleven years after 1054 – and the churches remain apart: what was withdrawn is the condemnation, not the separation.',
    },
    sources: ['vatican', 'oikoumene'], topic: 'Katholisch-Orthodoxe Gemeinsame Erklärung 1965',
  },
  {
    id: 'sueden', era: 'moderne', year: 2018,
    when: { de: 'Gegenwart', en: 'The present' },
    de: 'Der Schwerpunkt liegt im Süden', en: 'The centre of gravity is in the south', kind: 'other',
    at: [-1.29, 36.82], place: { de: 'Nairobi und der globale Süden', en: 'Nairobi and the global south' },
    text: {
      de: 'Um 1900 lebten rund vier Fünftel aller Christen in Europa und Nordamerika. Heute lebt die Mehrheit in Afrika, Lateinamerika und Asien – Nigeria hat mehr Anglikaner als England, Brasilien mehr Katholiken als Italien. Die Karte dieses Modus zeigt, wo die Kirche herkam; sie zeigt nicht mehr, wo sie ist.',
      en: 'Around 1900 some four fifths of all Christians lived in Europe and North America. Today the majority live in Africa, Latin America and Asia – Nigeria has more Anglicans than England, Brazil more Catholics than Italy. This view’s map shows where the church came from; it no longer shows where it is.',
    },
    sources: ['pewsize'], topic: 'Christentum nach Regionen',
  },
];

export const EVENT_BY_ID = Object.fromEntries(EVENTS.map((e) => [e.id, e])) as Record<string, ChurchEvent>;

/** Was in einem Jahr gilt – für den Regler auf der Schiene. */
export function eraForYear(year: number): ChurchEra {
  for (const e of CHURCH_ERAS) if (year >= e.from && year < e.to) return e.id;
  return year < CHURCH_ERAS[0].from ? CHURCH_ERAS[0].id : CHURCH_ERAS[CHURCH_ERAS.length - 1].id;
}
