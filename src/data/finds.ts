// Wer die Schriften gefunden hat.
//
// Zwischen dem, was geschrieben wurde, und dem, was zu lesen ist, liegt bei
// den meisten biblischen Büchern über ein Jahrtausend. Was diese Lücke füllt,
// sind Handschriften – und fast jede von ihnen hat einen Fundtag, einen
// Fundort und einen Namen. Ein Beduine, der einen Stein in eine Höhle wirft.
// Zwei Schwestern aus Schottland, die auf einem Kairoer Markt einkaufen. Ein
// Bibliothekar, der in einer Schublade in Manchester ein Stück Papyrus wendet.
//
// Regeln für diese Datei, dieselben wie in `witnesses.ts`:
//
//   * Jeder Eintrag nennt Jahr, Ort und – wo bekannt – die Person. Wo der
//     Fund über den Antikenmarkt lief und der Finder unbekannt blieb, steht
//     das so da; „gekauft" ist eine Auskunft, kein Makel.
//   * `limits` sagt, was der Fund **nicht** zeigt. Die große Jesajarolle
//     belegt die Überlieferung des Textes, nicht die Richtigkeit seiner
//     Aussagen; P52 belegt, dass Johannes im 2. Jahrhundert in Ägypten
//     gelesen wurde, und sonst nichts.
//   * Umstrittenes steht als umstritten da. Die Umstände, unter denen
//     Tischendorf den Codex Sinaiticus aus dem Katharinenkloster mitnahm, sind
//     bis heute strittig; das Kloster spricht von Diebstahl.
//
// Bilder und Artikeltexte werden nicht mitgeliefert: Zu jedem Eintrag steht
// ein Suchbegriff, den `lib/wikipediaArticle.ts` zur Laufzeit bei Wikipedia
// auflöst – Einleitung und Bild von Wikimedia Commons, mit Herkunftsnachweis.

import type { Bilingual } from './shelf';

/** Art des Zeugen – bestimmt Etikett und Farbe am Eintrag. */
export type FindKind = 'rolle' | 'kodex' | 'papyrus' | 'amulett' | 'ostrakon' | 'sammlung';

export const FIND_KIND: Record<FindKind, { de: string; en: string; color: string }> = {
  rolle: { de: 'Schriftrolle', en: 'Scroll', color: '#c98a2b' },
  kodex: { de: 'Kodex', en: 'Codex', color: '#3a6ea8' },
  papyrus: { de: 'Papyrus', en: 'Papyrus', color: '#a8895a' },
  amulett: { de: 'Amulett', en: 'Amulet', color: '#a89321' },
  ostrakon: { de: 'Scherbe', en: 'Ostracon', color: '#b8742e' },
  sammlung: { de: 'Fundsammlung', en: 'Collection', color: '#2f8f7f' },
};

export interface Find {
  id: string;
  kind: FindKind;
  de: string;
  en: string;
  /** Jahr des Fundes – ordnet die Zeitleiste. Negativ wäre sinnlos: alles neuzeitlich. */
  year: number;
  /** Jahr des Fundes, wie es dasteht („1946/47", „1896–1907"). */
  when: Bilingual;
  /** Wer gefunden hat – mit Namen, wo es einen gibt. */
  who: Bilingual;
  /** Wo gefunden, und wo es heute liegt. */
  where: Bilingual;
  /** Alter der Handschrift selbst, nicht des Fundes. */
  age: Bilingual;
  /** Was darin steht und warum es zählt. */
  text: Bilingual;
  /** Was der Fund ausdrücklich nicht zeigt. */
  limits: Bilingual;
  /** Ist die Herkunft oder die Datierung umstritten? */
  disputed?: boolean;
  /**
   * Kein Buch nennt diesen Fund als seine älteste Handschrift – er steht in
   * der Liste, weil er zur Geschichte gehört: der Vaticanus als Maßstab der
   * Textkritik, die Ostraka von Lachisch als Schrift aus der Welt Jeremias,
   * Nag Hammadi als das, was gerade nicht in den Kanon kam.
   *
   * Das ist kein Kleingedrucktes, sondern eine Prüfbedingung: `check:shelf`
   * verlangt, dass jeder Fund entweder von einem Buch aus erreichbar **oder**
   * hier als alleinstehend markiert ist – und beanstandet beides zusammen.
   * Ein Tippfehler in `oldest.find` bleibt so nicht unbemerkt.
   */
  standalone?: true;
  /** Suchbegriff für Wikipedia (Bild + Artikel), je Sprache. */
  wiki: string;
  wikiEn: string;
}

export const FINDS: Find[] = [
  {
    id: 'vaticanus', standalone: true, kind: 'kodex', year: 1475,
    de: 'Codex Vaticanus', en: 'Codex Vaticanus',
    when: { de: '1475 im ersten Katalog', en: 'catalogued in 1475' },
    who: {
      de: 'Nie gefunden, nur nie verloren: Die Handschrift steht im ältesten erhaltenen Katalog der Vatikanischen Bibliothek. Woher sie dorthin kam, weiß niemand.',
      en: 'Never found, only never lost: the manuscript appears in the oldest surviving catalogue of the Vatican Library. How it got there nobody knows.',
    },
    where: { de: 'Biblioteca Apostolica Vaticana, Rom (Vat. gr. 1209)', en: 'Biblioteca Apostolica Vaticana, Rome (Vat. gr. 1209)' },
    age: { de: 'um 325–350 n. Chr.', en: 'c. AD 325–350' },
    text: {
      de: 'Die älteste fast vollständige griechische Bibel – Altes und Neues Testament in einem Band, auf feinem Pergament, drei Spalten je Seite. Für die Textkritik ist sie bis heute der wichtigste einzelne Zeuge.',
      en: 'The oldest nearly complete Greek Bible – Old and New Testament in one volume, on fine parchment, three columns to a page. For textual criticism it remains the single most important witness.',
    },
    limits: {
      de: 'Unvollständig: Der Anfang der Genesis, ein Teil der Psalmen, die Pastoralbriefe und die ganze Offenbarung fehlen. Und sie war jahrhundertelang unzugänglich – Tischendorf durfte sie 1866 insgesamt zweiundvierzig Stunden ansehen.',
      en: 'Incomplete: the beginning of Genesis, part of the Psalms, the Pastoral Epistles and the whole of Revelation are missing. And it was inaccessible for centuries – in 1866 Tischendorf was allowed forty-two hours with it in total.',
    },
    wiki: 'Codex Vaticanus', wikiEn: 'Codex Vaticanus',
  },
  {
    id: 'alexandrinus', standalone: true, kind: 'kodex', year: 1627,
    de: 'Codex Alexandrinus', en: 'Codex Alexandrinus',
    when: { de: '1627 nach England gebracht', en: 'brought to England in 1627' },
    who: {
      de: 'Kyrillos Loukaris, Patriarch von Konstantinopel, schenkt die Handschrift König Karl I. von England – überbracht vom Gesandten Thomas Roe. Vorher lag sie in Alexandria.',
      en: 'Cyril Lucaris, patriarch of Constantinople, gives the manuscript to King Charles I of England – delivered by the ambassador Thomas Roe. Before that it lay in Alexandria.',
    },
    where: { de: 'British Library, London (Royal MS 1 D V–VIII)', en: 'British Library, London (Royal MS 1 D V–VIII)' },
    age: { de: '5. Jahrhundert n. Chr.', en: '5th century AD' },
    text: {
      de: 'Griechische Vollbibel, dazu die beiden Clemensbriefe – ein Hinweis darauf, dass die Grenze des Kanons im 5. Jahrhundert mancherorts noch anders verlief.',
      en: 'A complete Greek Bible, plus the two letters of Clement – a sign that in the 5th century the edge of the canon still ran differently in some places.',
    },
    limits: {
      de: 'Der Text des Neuen Testaments steht der späteren byzantinischen Überlieferung näher als der der beiden älteren Kodizes; für die Evangelien ist er darum weniger gewichtig als für die übrigen Bücher.',
      en: 'Its New Testament text stands closer to the later Byzantine tradition than that of the two older codices; for the gospels it therefore weighs less than for the rest.',
    },
    wiki: 'Codex Alexandrinus', wikiEn: 'Codex Alexandrinus',
  },
  {
    id: 'sinaiticus', kind: 'kodex', year: 1844,
    de: 'Codex Sinaiticus', en: 'Codex Sinaiticus',
    when: { de: '1844 und 1859', en: '1844 and 1859' },
    who: {
      de: 'Konstantin von Tischendorf, deutscher Theologe, sieht 1844 im Katharinenkloster am Sinai 43 Pergamentblätter und nimmt sie mit. 1859 kommt der weitaus größere Rest dazu – gegen eine Empfangsbestätigung, die von einer Leihgabe spricht.',
      en: 'Konstantin von Tischendorf, a German theologian, sees 43 parchment leaves at St Catherine’s Monastery on Sinai in 1844 and takes them away. In 1859 the far larger remainder follows – against a receipt that speaks of a loan.',
    },
    where: { de: 'Heute auf vier Orte verteilt: London, Leipzig, Sankt Petersburg und das Katharinenkloster, das 1975 weitere Blätter in einem zugemauerten Raum fand.', en: 'Today split between four places: London, Leipzig, Saint Petersburg and the monastery itself, which in 1975 found further leaves in a walled-up room.' },
    age: { de: 'um 330–360 n. Chr.', en: 'c. AD 330–360' },
    text: {
      de: 'Das älteste vollständige Neue Testament der Welt, dazu große Teile der griechischen Übersetzung des Alten. Am Ende stehen der Barnabasbrief und der Hirte des Hermas – zwei Schriften, die es später nicht in den Kanon schafften.',
      en: 'The oldest complete New Testament in the world, plus large parts of the Greek Old Testament. At the end stand the Epistle of Barnabas and the Shepherd of Hermas – two writings that later did not make the canon.',
    },
    limits: {
      de: 'Die Umstände sind bis heute strittig: Das Kloster sieht die Blätter als entwendet an, Tischendorfs Bericht spricht von geretteten Abfällen. Die Stelle über den Weidenkorb, aus dem er sie gezogen haben will, steht in keinem seiner frühen Berichte.',
      en: 'The circumstances remain contested to this day: the monastery regards the leaves as taken, while Tischendorf’s account speaks of rubbish rescued. The passage about the waste-basket he claims to have pulled them from appears in none of his early reports.',
    },
    disputed: true,
    wiki: 'Codex Sinaiticus', wikiEn: 'Codex Sinaiticus',
  },
  {
    id: 'leningradensis', kind: 'kodex', year: 1838,
    de: 'Codex Leningradensis', en: 'Leningrad Codex',
    when: { de: 'Mitte des 19. Jahrhunderts nach Russland gebracht', en: 'brought to Russia in the mid-19th century' },
    who: {
      de: 'Abraham Firkowitsch, karäischer Gelehrter und Sammler, bringt die Handschrift aus dem Orient nach Odessa; 1863 kommt sie an die Kaiserliche Bibliothek in Sankt Petersburg.',
      en: 'Abraham Firkovich, a Karaite scholar and collector, brings the manuscript from the East to Odessa; in 1863 it reaches the Imperial Library in Saint Petersburg.',
    },
    where: { de: 'Russische Nationalbibliothek, Sankt Petersburg (Firkovich B 19 A)', en: 'National Library of Russia, Saint Petersburg (Firkovich B 19 A)' },
    age: { de: '1008 oder 1009 n. Chr., geschrieben in Kairo von Samuel ben Jakob', en: 'AD 1008 or 1009, written in Cairo by Samuel ben Jacob' },
    text: {
      de: 'Die älteste vollständige hebräische Bibel der Welt – mit Vokalzeichen, Betonungen und den Randbemerkungen der Masoreten. Jede wissenschaftliche Ausgabe des hebräischen Alten Testaments seit 1937 druckt diesen einen Kodex ab.',
      en: 'The oldest complete Hebrew Bible in the world – with vowel points, accents and the marginal notes of the Masoretes. Every scholarly edition of the Hebrew Old Testament since 1937 prints this one codex.',
    },
    limits: {
      de: 'Tausend Jahre jünger als die Rollen von Qumran. Dass sein Text ihnen dennoch außerordentlich nahe steht, ist der eigentliche Befund – und er wurde erst 1947 prüfbar.',
      en: 'A thousand years younger than the Qumran scrolls. That its text nonetheless stands extraordinarily close to them is the real finding – and it only became testable in 1947.',
    },
    wiki: 'Codex Leningradensis', wikiEn: 'Leningrad Codex',
  },
  {
    id: 'aleppo', standalone: true, kind: 'kodex', year: 1958,
    de: 'Der Aleppo-Kodex', en: 'The Aleppo Codex',
    when: { de: '1947 beschädigt, 1958 nach Jerusalem gebracht', en: 'damaged in 1947, brought to Jerusalem in 1958' },
    who: {
      de: 'Kein Fund, sondern eine Rettung: Nach dem Brand der Synagoge von Aleppo 1947 galt der Kodex als vernichtet. Elf Jahre später brachte ihn der Käsehändler Murad Faham außer Landes nach Israel.',
      en: 'Not a find but a rescue: after the Aleppo synagogue burned in 1947 the codex was thought destroyed. Eleven years later the cheese merchant Murad Faham carried it out of the country to Israel.',
    },
    where: { de: 'Israel-Museum, Jerusalem', en: 'Israel Museum, Jerusalem' },
    age: { de: 'um 930 n. Chr., vokalisiert von Aaron ben Ascher in Tiberias', en: 'c. AD 930, vocalised by Aaron ben Asher in Tiberias' },
    text: {
      de: 'Die genaueste masoretische Handschrift, die es gab – Maimonides erklärte sie im 12. Jahrhundert zum Maßstab für alle Tora-Rollen. Wo sie erhalten ist, entscheidet sie Streitfragen über Buchstaben und Zeichen.',
      en: 'The most accurate Masoretic manuscript there was – in the 12th century Maimonides declared it the standard for all Torah scrolls. Where it survives, it settles disputes over letters and signs.',
    },
    limits: {
      de: 'Rund vierzig Prozent fehlen, darunter fast der gesamte Pentateuch. Was mit den fehlenden Blättern geschah, ist bis heute ungeklärt; einzelne sind später in Privatbesitz aufgetaucht.',
      en: 'About forty per cent is missing, including almost the whole Pentateuch. What became of the lost leaves is still unexplained; individual leaves have since surfaced in private hands.',
    },
    disputed: true,
    wiki: 'Codex von Aleppo', wikiEn: 'Aleppo Codex',
  },
  {
    id: 'nash', kind: 'papyrus', year: 1898,
    de: 'Der Papyrus Nash', en: 'The Nash Papyrus',
    when: { de: '1898 in Ägypten gekauft', en: 'bought in Egypt in 1898' },
    who: {
      de: 'Walter Llewellyn Nash, Sekretär der Society of Biblical Archaeology, erwirbt vier zusammengehörige Fetzen von einem Händler in Fayyum und schenkt sie Cambridge. Wer sie ausgegraben hat, ist unbekannt.',
      en: 'Walter Llewellyn Nash, secretary of the Society of Biblical Archaeology, buys four matching scraps from a dealer in the Fayyum and gives them to Cambridge. Who dug them up is unknown.',
    },
    where: { de: 'Cambridge University Library', en: 'Cambridge University Library' },
    age: { de: 'um 150–100 v. Chr.', en: 'c. 150–100 BC' },
    text: {
      de: 'Die Zehn Gebote und das Schma – zwei Texte, die zusammen im täglichen Gebet standen. Bis 1947 war dieses Blatt die älteste bekannte hebräische Bibelhandschrift der Welt; fünfzig Jahre lang hing an ihm allein, was man über den frühen hebräischen Text wusste.',
      en: 'The Ten Commandments and the Shema – two texts that stood together in daily prayer. Until 1947 this sheet was the oldest known Hebrew biblical manuscript in the world; for fifty years everything known about the early Hebrew text hung on it alone.',
    },
    limits: {
      de: 'Kein Bibelbuch, sondern ein liturgischer Auszug: Die Gebote stehen in einer Mischform aus 2. und 5. Mose, wie sie für den Gebetsgebrauch üblich war.',
      en: 'Not a biblical book but a liturgical extract: the commandments appear in a mixed form from Exodus and Deuteronomy, as was usual for prayer use.',
    },
    wiki: 'Papyrus Nash', wikiEn: 'Nash Papyrus',
  },
  {
    id: 'geniza', kind: 'sammlung', year: 1896,
    de: 'Die Kairoer Geniza', en: 'The Cairo Geniza',
    when: { de: '1896/97', en: '1896/97' },
    who: {
      de: 'Die schottischen Zwillingsschwestern Agnes Smith Lewis und Margaret Dunlop Gibson bringen 1896 vom Kairoer Markt Fragmente nach Cambridge; Solomon Schechter erkennt darin ein hebräisches Blatt des Jesus Sirach und reist selbst nach Fustat. Er holt rund 190.000 Stücke aus der Abstellkammer der Ben-Esra-Synagoge.',
      en: 'The Scottish twin sisters Agnes Smith Lewis and Margaret Dunlop Gibson bring fragments from the Cairo market to Cambridge in 1896; Solomon Schechter recognises among them a Hebrew leaf of Ben Sira and travels to Fustat himself. He removes some 190,000 pieces from the storeroom of the Ben Ezra synagogue.',
    },
    where: { de: 'Cambridge und ein Dutzend weiterer Bibliotheken; die Synagoge steht in Alt-Kairo.', en: 'Cambridge and a dozen other libraries; the synagogue stands in Old Cairo.' },
    age: { de: '9. bis 19. Jahrhundert – tausend Jahre auf einem Haufen', en: '9th to 19th century – a thousand years in one heap' },
    text: {
      de: 'Eine Geniza ist kein Archiv, sondern ein Ablageraum: Beschriebenes Papier mit dem Gottesnamen darf nicht weggeworfen werden. Deshalb lagen dort Bibelhandschriften neben Einkaufszetteln, Rechtsgutachten neben Kinderübungen – der vollständigste Blick in den Alltag einer mittelalterlichen jüdischen Gemeinde, den es gibt.',
      en: 'A geniza is not an archive but a place to set things down: written paper bearing the name of God may not be thrown away. So biblical manuscripts lay there beside shopping lists, legal opinions beside children’s exercises – the fullest view into the everyday life of a medieval Jewish community that exists.',
    },
    limits: {
      de: 'Ungeordnet und über viele Sammlungen zerstreut; ein großer Teil ist bis heute nicht ausgewertet. Die Stücke wurden aus ihrem Zusammenhang gerissen, bevor jemand ihn aufnahm.',
      en: 'Unsorted and scattered across many collections; a large part is still unexamined. The pieces were torn from their context before anyone recorded it.',
    },
    wiki: 'Kairoer Geniza', wikiEn: 'Cairo Geniza',
  },
  {
    id: 'oxyrhynchus', kind: 'sammlung', year: 1896,
    de: 'Die Müllhügel von Oxyrhynchos', en: 'The rubbish mounds of Oxyrhynchus',
    when: { de: '1896–1907, Grabungen bis heute', en: '1896–1907, with excavation continuing' },
    who: {
      de: 'Bernard Grenfell und Arthur Hunt, zwei junge Oxforder Papyrologen, graben in den Abfallhügeln einer ägyptischen Provinzstadt. Am zweiten Tag finden sie ein Blatt mit unbekannten Jesusworten.',
      en: 'Bernard Grenfell and Arthur Hunt, two young Oxford papyrologists, dig in the rubbish mounds of an Egyptian provincial town. On the second day they find a leaf with unknown sayings of Jesus.',
    },
    where: { de: 'el-Bahnasa, Mittelägypten; heute überwiegend in Oxford', en: 'el-Bahnasa, Middle Egypt; today mostly in Oxford' },
    age: { de: '1. bis 7. Jahrhundert n. Chr.', en: '1st to 7th century AD' },
    text: {
      de: 'Über eine halbe Million Fetzen, von denen erst ein Bruchteil veröffentlicht ist: Steuerquittungen, Liebesbriefe, Rechnungen – und darunter die ältesten Papyri fast jedes neutestamentlichen Buches. Die „Logia Iesou" von 1897 erwiesen sich ein halbes Jahrhundert später als griechische Stücke des Thomasevangeliums.',
      en: 'Over half a million scraps, of which only a fraction is published: tax receipts, love letters, accounts – and among them the oldest papyri of almost every New Testament book. The "Logia Iesou" of 1897 turned out half a century later to be Greek pieces of the Gospel of Thomas.',
    },
    limits: {
      de: 'Fast alles ist klein: Ein Oxyrhynchos-Fund belegt in der Regel, dass ein Text zu einer Zeit an einem Ort gelesen wurde – nicht, wie er vollständig lautete.',
      en: 'Almost everything is small: an Oxyrhynchus find usually shows that a text was read at a certain time in a certain place – not how it read in full.',
    },
    wiki: 'Oxyrhynchus Papyri', wikiEn: 'Oxyrhynchus Papyri',
  },
  {
    id: 'chesterbeatty', kind: 'papyrus', year: 1930,
    de: 'Die Chester-Beatty-Papyri', en: 'The Chester Beatty Papyri',
    when: { de: '1930/31 auf dem Antikenmarkt erworben', en: 'acquired on the antiquities market in 1930/31' },
    who: {
      de: 'Alfred Chester Beatty, amerikanisch-britischer Bergbauunternehmer und Sammler, kauft in Ägypten die Reste einer christlichen Bibliothek. Wo genau sie lag, ist nie festgestellt worden – ein Kloster bei Fayyum gilt als wahrscheinlich.',
      en: 'Alfred Chester Beatty, an American-British mining magnate and collector, buys in Egypt the remains of a Christian library. Where exactly it lay was never established – a monastery near the Fayyum is thought likely.',
    },
    where: { de: 'Chester Beatty Library, Dublin; einzelne Blätter in Ann Arbor und Wien', en: 'Chester Beatty Library, Dublin; individual leaves in Ann Arbor and Vienna' },
    age: { de: 'um 200–250 n. Chr.', en: 'c. AD 200–250' },
    text: {
      de: 'Elf Kodizes, darunter P45 mit den Evangelien und der Apostelgeschichte, P46 mit den Paulusbriefen und P47 mit der Offenbarung. Sie rückten den greifbaren Text des Neuen Testaments mit einem Schlag um über hundert Jahre nach vorn, vor die großen Pergamentbibeln.',
      en: 'Eleven codices, among them P45 with the gospels and Acts, P46 with Paul’s letters and P47 with Revelation. At a stroke they pushed the tangible text of the New Testament more than a century earlier, ahead of the great parchment Bibles.',
    },
    limits: {
      de: 'Ohne Fundzusammenhang gekauft; über die Gemeinde, die diese Bücher benutzte, ist nichts bekannt. Die Blätter sind zudem lückenhaft – von P46 fehlen die Ränder samt Seitenzahlen, weshalb umstritten bleibt, welche Briefe der Band ursprünglich enthielt.',
      en: 'Bought without an archaeological context; nothing is known about the community that used these books. The leaves are also incomplete – P46 has lost its margins together with its page numbers, so which letters the volume originally contained remains disputed.',
    },
    wiki: 'Chester Beatty Papyri', wikiEn: 'Chester Beatty Papyri',
  },
  {
    id: 'rylands52', kind: 'papyrus', year: 1934,
    de: 'Papyrus P52 – Johannes in der Schublade', en: 'Papyrus P52 – John in a drawer',
    when: { de: '1920 gekauft, 1934 erkannt', en: 'bought in 1920, identified in 1934' },
    who: {
      de: 'Bernard Grenfell kaufte den Fetzen 1920 in Ägypten; er lag vierzehn Jahre unbeachtet in Manchester, bis Colin H. Roberts ihn umdrehte und die Buchstaben las.',
      en: 'Bernard Grenfell bought the scrap in Egypt in 1920; it lay unregarded in Manchester for fourteen years until Colin H. Roberts turned it over and read the letters.',
    },
    where: { de: 'John Rylands Library, Manchester (P. Ryl. Gr. 457)', en: 'John Rylands Library, Manchester (P. Ryl. Gr. 457)' },
    age: { de: 'meist ins 2. Jahrhundert datiert', en: 'usually dated to the 2nd century' },
    text: {
      de: 'Ein Stück von der Größe einer Scheckkarte, beidseitig beschrieben, mit wenigen Zeilen aus dem Verhör vor Pilatus (Johannes 18). Die älteste bekannte Handschrift des Neuen Testaments – und der Beleg dafür, dass dieses Evangelium schon im 2. Jahrhundert in einer ägyptischen Provinzstadt gelesen wurde.',
      en: 'A piece the size of a credit card, written on both sides, with a few lines from the hearing before Pilate (John 18). The oldest known manuscript of the New Testament – and the evidence that this gospel was already being read in an Egyptian provincial town in the 2nd century.',
    },
    limits: {
      de: 'Die berühmte Datierung „um 125" stammt aus einem Schriftvergleich und wird seit den 2000er-Jahren angegriffen; vorsichtige Paläographen setzen die Spanne auf 125 bis 200. Für einen so kleinen Fetzen ist eine Genauigkeit von fünfundzwanzig Jahren nicht zu haben.',
      en: 'The famous dating "c. 125" comes from a comparison of handwriting and has been challenged since the 2000s; cautious palaeographers give a range of 125 to 200. For so small a scrap, an accuracy of twenty-five years is not to be had.',
    },
    disputed: true,
    wiki: 'Papyrus 52', wikiEn: 'Rylands Library Papyrus P52',
  },
  {
    id: 'lachisch', standalone: true, kind: 'ostrakon', year: 1935,
    de: 'Die Ostraka von Lachisch', en: 'The Lachish letters',
    when: { de: '1935 und 1938', en: '1935 and 1938' },
    who: {
      de: 'James Leslie Starkey findet in der verbrannten Torkammer der Stadt einundzwanzig beschriebene Tonscherben. Drei Jahre später wird er auf dem Weg zur Eröffnung des Palästina-Museums ermordet.',
      en: 'James Leslie Starkey finds twenty-one inscribed potsherds in the burnt gate chamber of the city. Three years later he is murdered on his way to the opening of the Palestine Museum.',
    },
    where: { de: 'Tell ed-Duweir (Lachisch); heute British Museum und Israel-Museum', en: 'Tell ed-Duweir (Lachish); today the British Museum and the Israel Museum' },
    age: { de: 'um 588 v. Chr.', en: 'c. 588 BC' },
    text: {
      de: 'Militärpost aus den letzten Wochen Judas, mit Tinte auf Scherben geschrieben. Brief IV meldet, man sehe die Feuerzeichen von Lachisch, die von Aseka aber nicht mehr – und Jeremia 34,7 nennt genau diese beiden Städte als die letzten, die noch standen.',
      en: 'Military post from the last weeks of Judah, written in ink on potsherds. Letter IV reports that the fire signals of Lachish are visible but those of Azekah no longer are – and Jeremiah 34:7 names exactly those two cities as the last still holding out.',
    },
    limits: {
      de: 'Kein Bibeltext, sondern Verwaltungsschriftgut. Es zeigt, dass in Juda kurz vor dem Untergang alltäglich hebräisch geschrieben wurde – nicht, wer die biblischen Bücher schrieb.',
      en: 'Not a biblical text but administrative writing. It shows that Hebrew was written routinely in Judah just before the end – not who wrote the biblical books.',
    },
    wiki: 'Lachisch-Ostraka', wikiEn: 'Lachish letters',
  },
  {
    id: 'naghammadi', standalone: true, kind: 'kodex', year: 1945,
    de: 'Nag Hammadi', en: 'Nag Hammadi',
    when: { de: 'Dezember 1945', en: 'December 1945' },
    who: {
      de: 'Muhammad Ali al-Samman gräbt am Fuß des Dschabal al-Tarif nach Düngeerde und stößt auf einen versiegelten Tonkrug mit dreizehn Lederbänden. Ein Teil der Blätter ging als Feuerzeug in den Ofen, bevor jemand begriff, was sie waren.',
      en: 'Muhammad Ali al-Samman is digging for fertiliser soil at the foot of Jabal al-Tarif and strikes a sealed jar holding thirteen leather-bound books. Some of the leaves went into the stove as kindling before anyone grasped what they were.',
    },
    where: { de: 'Koptisches Museum, Kairo', en: 'Coptic Museum, Cairo' },
    age: { de: 'um 350 n. Chr., Übersetzungen älterer griechischer Texte', en: 'c. AD 350, translations of older Greek texts' },
    text: {
      de: 'Zweiundfünfzig koptische Schriften, darunter das Thomasevangelium mit 114 Jesusworten. Sie zeigen, was neben dem Kanon umlief – und woran sich die Kirche des 2. und 3. Jahrhunderts abarbeitete, als sie entschied, was Evangelium heißen darf.',
      en: 'Fifty-two Coptic writings, among them the Gospel of Thomas with 114 sayings of Jesus. They show what circulated alongside the canon – and what the church of the 2nd and 3rd centuries was wrestling with when it decided what may be called a gospel.',
    },
    limits: {
      de: 'Keine biblischen Handschriften: Diese Texte standen nie im Kanon und wollten teils auch nicht hinein. Ihr Wert liegt darin, dass sie die Gegenseite lesbar machen, die man vorher nur aus den Streitschriften ihrer Gegner kannte.',
      en: 'Not biblical manuscripts: these texts were never in the canon, and some never sought to be. Their value is that they make readable the other side, previously known only from the polemics of its opponents.',
    },
    wiki: 'Nag-Hammadi-Schriften', wikiEn: 'Nag Hammadi library',
  },
  {
    id: 'qumran', kind: 'rolle', year: 1947,
    de: 'Die Schriftrollen vom Toten Meer', en: 'The Dead Sea Scrolls',
    when: { de: '1946/47, Grabungen bis 1956', en: '1946/47, excavation until 1956' },
    who: {
      de: 'Ein Hirte des Beduinenstammes der Taʿamira, überliefert als Muhammed edh-Dhib, wirft in einer Felshöhle bei Chirbet Qumran einen Stein und hört Ton zerbrechen. In den Krügen liegen Lederrollen. Elf Höhlen werden es am Ende, rund 900 Schriften; Eleazar Sukenik kauft 1947 drei Rollen, sein Sohn Jigael Jadin 1954 vier weitere über eine Kleinanzeige im Wall Street Journal.',
      en: 'A shepherd of the Taʿamireh Bedouin, remembered as Muhammed edh-Dhib, throws a stone into a rock cave near Khirbet Qumran and hears pottery break. In the jars lie leather scrolls. Eleven caves in the end, some 900 writings; Eleazar Sukenik buys three scrolls in 1947, and his son Yigael Yadin four more in 1954 through a classified ad in the Wall Street Journal.',
    },
    where: { de: 'Nordwestufer des Toten Meeres; heute Schrein des Buches, Jerusalem, und Rockefeller-Museum', en: 'North-west shore of the Dead Sea; today the Shrine of the Book, Jerusalem, and the Rockefeller Museum' },
    age: { de: 'um 250 v. Chr. bis 70 n. Chr.', en: 'c. 250 BC to AD 70' },
    text: {
      de: 'Der größte Handschriftenfund der Bibelgeschichte. Von jedem Buch der hebräischen Bibel außer Ester liegt mindestens ein Stück vor – tausend Jahre älter als alles, was man vorher hatte. Die große Jesajarolle ist vollständig, 7,34 Meter lang, und weicht vom späteren Text nur in Kleinigkeiten ab.',
      en: 'The greatest manuscript find in the history of the Bible. Of every book of the Hebrew Bible except Esther at least one piece survives – a thousand years older than anything known before. The Great Isaiah Scroll is complete, 7.34 metres long, and departs from the later text only in small things.',
    },
    limits: {
      de: 'Es ist die Bibliothek einer bestimmten Gruppe, nicht die des Judentums insgesamt: Neben den biblischen Rollen liegen ihre eigenen Regeln und Kommentare. Und der Befund ist gemischt – neben Texten, die dem späteren Hebräisch fast genau entsprechen, liegen abweichende Fassungen desselben Buches nebeneinander in derselben Höhle.',
      en: 'It is the library of one particular group, not of Judaism as a whole: beside the biblical scrolls lie its own rules and commentaries. And the picture is mixed – texts matching the later Hebrew almost exactly lie in the same cave as divergent versions of the same book.',
    },
    wiki: 'Schriftrollen vom Toten Meer', wikiEn: 'Dead Sea Scrolls',
  },
  {
    id: 'bodmer', kind: 'papyrus', year: 1952,
    de: 'Die Bodmer-Papyri', en: 'The Bodmer Papyri',
    when: { de: '1952 gefunden, ab 1954 veröffentlicht', en: 'found in 1952, published from 1954' },
    who: {
      de: 'Bei Dischna in Oberägypten, unweit eines pachomianischen Klosters, kommen Kodizes ans Licht; über Händler gelangen sie an Martin Bodmer in Genf.',
      en: 'Near Dishna in Upper Egypt, not far from a Pachomian monastery, codices come to light; through dealers they reach Martin Bodmer in Geneva.',
    },
    where: { de: 'Bibliotheca Bodmeriana, Cologny bei Genf; P75 seit 2007 im Vatikan', en: 'Bibliotheca Bodmeriana, Cologny near Geneva; P75 in the Vatican since 2007' },
    age: { de: 'um 175–250 n. Chr.', en: 'c. AD 175–250' },
    text: {
      de: 'P66 mit dem Johannesevangelium, P72 mit den Petrusbriefen und Judas, P75 mit Lukas und Johannes. P75 wiegt am schwersten: Sein Text stimmt fast Wort für Wort mit dem Codex Vaticanus überein, der anderthalb Jahrhunderte jünger ist – ein direkter Beleg dafür, dass sorgfältig abgeschrieben wurde.',
      en: 'P66 with the Gospel of John, P72 with the letters of Peter and Jude, P75 with Luke and John. P75 weighs heaviest: its text agrees almost word for word with Codex Vaticanus, a century and a half younger – direct evidence that copying was careful.',
    },
    limits: {
      de: 'Auch hier ein Handelsweg statt einer Grabung; die Zusammensetzung der ursprünglichen Bibliothek wird bis heute rekonstruiert. In demselben Fund lagen christliche Texte neben griechischer Dichtung – die Bücher eines Klosters, nicht ein Kanon.',
      en: 'Here too a trade route rather than an excavation; the composition of the original library is still being reconstructed. The same find held Christian texts beside Greek poetry – the books of a monastery, not a canon.',
    },
    wiki: 'Bodmer-Papyri', wikiEn: 'Bodmer Papyri',
  },
  {
    id: 'masada', kind: 'rolle', year: 1963,
    de: 'Die Rollen von Masada', en: 'The Masada scrolls',
    when: { de: '1963–1965', en: '1963–1965' },
    who: {
      de: 'Jigael Jadin gräbt die Festung Herodes’ des Großen aus und findet in den Kasematten und unter dem Synagogenboden verbrannte und vergrabene Rollenreste.',
      en: 'Yigael Yadin excavates the fortress of Herod the Great and finds burnt and buried scroll remains in the casemates and beneath the synagogue floor.',
    },
    where: { de: 'Masada am Toten Meer; heute Israel-Museum', en: 'Masada by the Dead Sea; today the Israel Museum' },
    age: { de: 'vor 73/74 n. Chr. – das Datum steht durch die Belagerung fest', en: 'before AD 73/74 – the date is fixed by the siege' },
    text: {
      de: 'Stücke aus 1. und 5. Mose, Hesekiel, den Psalmen und dem Buch Jesus Sirach. Ihr Wert liegt im Datum: Anders als bei Qumran ist der Zeitpunkt, zu dem diese Rollen aus dem Verkehr kamen, historisch bezeugt – sie können nicht jünger sein als der Fall der Festung.',
      en: 'Pieces of Genesis and Deuteronomy, Ezekiel, the Psalms and the book of Ben Sira. Their value lies in the date: unlike at Qumran, the moment these scrolls went out of circulation is historically attested – they cannot be later than the fall of the fortress.',
    },
    limits: {
      de: 'Wenig Text, stark beschädigt. Die Sirach-Rolle ist der eigentliche Gewinn: Sie bestätigte, dass die Blätter aus der Kairoer Geniza tatsächlich einen alten hebräischen Text wiedergeben und keine Rückübersetzung sind.',
      en: 'Little text, badly damaged. The Ben Sira scroll is the real gain: it confirmed that the leaves from the Cairo Geniza really do preserve an ancient Hebrew text and are not a retranslation.',
    },
    wiki: 'Masada', wikiEn: 'Masada',
  },
  {
    id: 'ketefhinnom', kind: 'amulett', year: 1979,
    de: 'Die Silberröllchen von Ketef Hinnom', en: 'The silver scrolls of Ketef Hinnom',
    when: { de: '1979', en: '1979' },
    who: {
      de: 'Gabriel Barkay gräbt Felsengräber am Hinnomtal südwestlich der Altstadt Jerusalems. Eine für leer gehaltene Kammer erweist sich als ungestörte Bestattungsablage – der Boden war unter Geröll verborgen. Zwei winzige Silberröllchen darin brauchten drei Jahre, bis man sie entrollen konnte, ohne sie zu zerstören.',
      en: 'Gabriel Barkay excavates rock tombs by the Hinnom valley south-west of Jerusalem’s old city. A chamber thought empty turns out to be an undisturbed burial repository – its floor lay hidden under rubble. Two tiny silver scrolls inside took three years to unroll without destroying them.',
    },
    where: { de: 'Ketef Hinnom, Jerusalem; heute Israel-Museum', en: 'Ketef Hinnom, Jerusalem; today the Israel Museum' },
    age: { de: 'um 600 v. Chr., spätere Vorschläge reichen bis ins 6. Jh.', en: 'c. 600 BC, with later proposals reaching into the 6th century' },
    text: {
      de: 'Auf den hauchdünnen Silberblechen steht der Priestersegen aus 4. Mose 6,24–26: „Der HERR segne dich und behüte dich." Es ist der älteste bekannte Bibeltext überhaupt – vierhundert Jahre älter als die Rollen von Qumran, und er lag als Amulett um den Hals eines Toten.',
      en: 'On the wafer-thin silver sheets stands the priestly blessing of Numbers 6:24–26: "The LORD bless you and keep you." It is the oldest known biblical text of any kind – four hundred years older than the Qumran scrolls, and it lay as an amulet around a dead person’s neck.',
    },
    limits: {
      de: 'Drei Verse, kein Buch. Sie belegen, dass diese Formel vor dem Exil in Umlauf war – nicht, dass das Buch 4. Mose damals schon so dastand wie heute.',
      en: 'Three verses, not a book. They show that this formula was in circulation before the exile – not that the book of Numbers then stood as it stands today.',
    },
    wiki: 'Ketef Hinnom', wikiEn: 'Ketef Hinnom',
  },
];

export const FIND_BY_ID: Record<string, Find> = Object.fromEntries(FINDS.map((f) => [f.id, f]));
