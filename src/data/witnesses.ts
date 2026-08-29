// Was außerhalb der Bibel über Jesus steht – und was der Boden hergibt.
//
// Warum das zur Jesus-Sektion gehört: Die Stationen erzählen, was die
// Evangelien berichten. Die naheliegende Frage danach ist, was davon
// unabhängig bezeugt ist. Die ehrliche Antwort ist weder „alles“ noch
// „nichts“, sondern eine kurze Liste, die man vorzeigen kann.
//
// Regeln für diese Datei:
//
//   * Jeder Eintrag nennt seine Quelle so genau, dass man sie nachschlagen
//     kann – Autor, Werk, Stelle; bei Funden Ort und Jahr.
//   * Umstrittenes steht als umstritten da. Das Testimonium Flavianum ist in
//     der überlieferten Form überarbeitet, das Jakobus-Ossuar war vor Gericht.
//     Beides wegzulassen wäre bequemer und unehrlicher.
//   * Was ein Fund *nicht* zeigt, steht dabei. Der Pilatus-Stein belegt
//     Pilatus, nicht das Verhör; das Kaiphas-Ossuar den Hohenpriester, nicht
//     den Prozess.
//   * Keine Belege aus zweiter Hand: Was hier steht, steht in den genannten
//     Werken oder in den Grabungsberichten, nicht in einer Sammlung von
//     Argumenten.

import type { Bilingual } from './mission';

export interface Witness {
  id: string;
  /** Ein Text der Antike oder ein Fund aus dem Boden. */
  kind: 'text' | 'find';
  de: string;
  en: string;
  /** Entstehungszeit des Textes bzw. Jahr des Fundes. */
  when: Bilingual;
  /** Autor, Werk und Stelle – oder Fundort und Grabung. */
  source: Bilingual;
  text: Bilingual;
  /** Wortlaut, wo er kurz genug ist. */
  quote?: Bilingual;
  /** Steht die Sache in der Forschung in Frage, sagt das die Oberfläche. */
  disputed?: boolean;
  /** Stichwort zum Nachschlagen. */
  topic?: string;
  topicEn?: string;
  /** Stationen, zu denen der Eintrag etwas beiträgt. */
  stations?: string[];
}

export const WITNESSES: Witness[] = [
  /* --- Texte ----------------------------------------------------------- */
  {
    id: 'tacitus', kind: 'text',
    de: 'Tacitus über den Brand Roms', en: 'Tacitus on the fire of Rome',
    when: { de: 'um 116 n. Chr.', en: 'c. AD 116' },
    source: { de: 'Tacitus, Annalen 15,44', en: 'Tacitus, Annals 15.44' },
    text: {
      de: 'Der römische Senator und Historiker erklärt, wen Nero nach dem Brand von 64 bestrafen ließ – und erwähnt dabei beiläufig, woher der Name kommt. Er hat keinerlei Interesse daran, den Christen zu nützen: Er nennt ihren Glauben einen „verderblichen Aberglauben“.',
      en: 'The Roman senator and historian explains whom Nero punished after the fire of 64 – and mentions in passing where the name comes from. He has no interest in helping the Christians: he calls their faith a "deadly superstition".',
    },
    quote: {
      de: '„Christus, von dem der Name stammt, war unter der Regierung des Tiberius durch den Prokurator Pontius Pilatus hingerichtet worden.“',
      en: '"Christus, from whom the name had its origin, suffered the extreme penalty during the reign of Tiberius at the hands of the procurator Pontius Pilatus."',
    },
    topic: 'Tacitus Annalen Christen', topicEn: 'Tacitus on Christ',
    stations: ['pilate', 'golgotha'],
  },
  {
    id: 'josephus-james', kind: 'text',
    de: 'Josephus über die Hinrichtung des Jakobus', en: 'Josephus on the execution of James',
    when: { de: 'um 94 n. Chr., über das Jahr 62', en: 'c. AD 94, on the year 62' },
    source: { de: 'Josephus, Jüdische Altertümer 20,200', en: 'Josephus, Antiquities 20.200' },
    text: {
      de: 'Der jüdische Historiker berichtet, wie der Hohepriester Ananus in einer Lücke der römischen Verwaltung „den Bruder Jesu, des sogenannten Christus, mit Namen Jakobus“ steinigen ließ. Die Stelle gilt in der Forschung weithin als unverändert – sie lobt niemanden und erklärt nichts.',
      en: 'The Jewish historian reports how the high priest Ananus, in a gap in Roman administration, had "the brother of Jesus who was called Christ, whose name was James" stoned. Scholars widely regard the passage as untouched – it praises no one and explains nothing.',
    },
    topic: 'Flavius Josephus Jakobus Bruder Jesu', topicEn: 'Josephus on James brother of Jesus',
    stations: ['carpenter', 'ascension'],
  },
  {
    id: 'testimonium', kind: 'text',
    de: 'Das Testimonium Flavianum', en: 'The Testimonium Flavianum',
    when: { de: 'um 94 n. Chr.', en: 'c. AD 94' },
    source: { de: 'Josephus, Jüdische Altertümer 18,63f.', en: 'Josephus, Antiquities 18.63-64' },
    text: {
      de: 'Der bekannteste außerchristliche Abschnitt über Jesus – und der umstrittenste. In der überlieferten Fassung nennt der jüdische Historiker ihn den Christus und spricht von seiner Auferstehung; das hätte Josephus so nicht geschrieben. Die Mehrheit der Forschung hält einen knappen Kern für echt und die frommen Zusätze für spätere Hand.',
      en: 'The best-known non-Christian passage about Jesus – and the most disputed. As transmitted, the Jewish historian calls him the Christ and speaks of his resurrection; Josephus would not have written that. Most scholars take a bare core to be genuine and the pious additions to be a later hand.',
    },
    disputed: true,
    topic: 'Testimonium Flavianum', topicEn: 'Testimonium Flavianum',
    stations: ['golgotha'],
  },
  {
    id: 'pliny', kind: 'text',
    de: 'Plinius fragt den Kaiser um Rat', en: 'Pliny asks the emperor for advice',
    when: { de: 'um 112 n. Chr.', en: 'c. AD 112' },
    source: { de: 'Plinius der Jüngere, Briefe 10,96', en: 'Pliny the Younger, Letters 10.96' },
    text: {
      de: 'Der Statthalter von Bithynien weiß nicht, wie er mit Christen umgehen soll, und beschreibt dem Kaiser, was sie tun: Sie kommen vor Sonnenaufgang zusammen und singen Christus ein Lied „wie einem Gott“. Ein Verwaltungsbericht, keine Werbeschrift – achtzig Jahre nach der Kreuzigung.',
      en: 'The governor of Bithynia does not know how to handle Christians and describes to the emperor what they do: they meet before dawn and sing a hymn to Christ "as to a god". An administrative report, not a tract – eighty years after the crucifixion.',
    },
    topic: 'Plinius Brief Christen Trajan', topicEn: 'Pliny the Younger letter Christians',
  },
  {
    id: 'suetonius', kind: 'text',
    de: 'Sueton und die Unruhen um „Chrestus“', en: 'Suetonius and the riots over "Chrestus"',
    when: { de: 'um 120 n. Chr., über das Jahr 49', en: 'c. AD 120, on the year 49' },
    source: { de: 'Sueton, Claudius 25,4', en: 'Suetonius, Claudius 25.4' },
    text: {
      de: 'Claudius weist die Juden aus Rom aus, weil sie „auf Betreiben des Chrestus“ ständig Unruhe stifteten. Ob „Chrestus“ hier Christus meint, ist nicht sicher – die Apostelgeschichte kennt dieselbe Ausweisung: Aquila und Priszilla kommen deshalb nach Korinth.',
      en: 'Claudius expels the Jews from Rome because they kept rioting "at the instigation of Chrestus". Whether "Chrestus" means Christ is not certain – Acts knows the same expulsion: it is why Aquila and Priscilla come to Corinth.',
    },
    disputed: true,
    topic: 'Sueton Chrestus Claudius', topicEn: 'Suetonius Chrestus',
  },
  {
    id: 'talmud', kind: 'text',
    de: 'Der Talmud über die Hinrichtung', en: 'The Talmud on the execution',
    when: { de: 'redigiert 5./6. Jh., ältere Überlieferung', en: 'redacted 5th-6th c., older tradition' },
    source: { de: 'Babylonischer Talmud, Sanhedrin 43a', en: 'Babylonian Talmud, Sanhedrin 43a' },
    text: {
      de: 'Eine kurze, feindselige Notiz: „Jeschu“ sei am Vorabend des Passa gehängt worden, vierzig Tage lang habe ein Herold nach Entlastung gerufen. Der Ton ist ablehnend, die Umstände – Zeitpunkt, Hinrichtung, Vorwurf der Zauberei und Verführung – decken sich in den Grundzügen mit den Evangelien.',
      en: 'A short, hostile note: "Yeshu" was hanged on the eve of Passover, and for forty days a herald called for anyone to speak in his defence. The tone is dismissive; the circumstances – timing, execution, the charge of sorcery and leading Israel astray – broadly match the gospels.',
    },
    topic: 'Talmud Sanhedrin 43a Jesus', topicEn: 'Talmud Sanhedrin 43a Jesus',
    stations: ['annas-caiaphas'],
  },

  /* --- Funde ------------------------------------------------------------ */
  {
    id: 'pilate-stone', kind: 'find',
    de: 'Der Pilatus-Stein', en: 'The Pilate Stone',
    when: { de: 'gefunden 1961 in Cäsarea', en: 'found 1961 at Caesarea' },
    source: { de: 'Cäsarea Maritima, Theater; Israel-Museum', en: 'Caesarea Maritima, the theatre; Israel Museum' },
    text: {
      de: 'Eine italienische Grabung fand im Theater von Cäsarea einen wiederverwendeten Kalksteinblock mit dem Namen des Präfekten. Bis dahin kannte man Pilatus nur aus Texten. Der Stein belegt den Mann und seinen Titel – nicht den Prozess: Er nennt ihn *praefectus*, während Tacitus achtzig Jahre später das jüngere Wort *procurator* benutzt.',
      en: 'An Italian excavation found a reused limestone block in the theatre of Caesarea bearing the prefect’s name. Until then Pilate was known only from texts. The stone attests the man and his title – not the trial: it calls him *praefectus*, while Tacitus, eighty years later, uses the later word *procurator*.',
    },
    quote: { de: '„… [Pon]tius Pilatus, [Präf]ekt von Judä[a] …“', en: '"… [Pon]tius Pilatus, [praef]ect of Juda[ea] …"' },
    topic: 'Pilatusstein Caesarea', topicEn: 'Pilate stone',
    stations: ['pilate'],
  },
  {
    id: 'caiaphas-ossuary', kind: 'find',
    de: 'Das Kaiphas-Ossuar', en: 'The Caiaphas ossuary',
    when: { de: 'gefunden 1990 in Jerusalem', en: 'found 1990 in Jerusalem' },
    source: { de: 'Grabkammer im Friedenswald, Jerusalem; Israel-Museum', en: 'Burial cave in the Peace Forest, Jerusalem; Israel Museum' },
    text: {
      de: 'Bauarbeiten legten eine Grabkammer mit zwölf Beinhäusern frei; das reichste trägt zweimal eingeritzt den Namen der Familie und die Knochen eines Mannes um die sechzig. Ob es der Hohepriester der Evangelien selbst ist oder ein naher Verwandter, hängt an der Lesung des Namens – die Familie ist es in jedem Fall.',
      en: 'Construction work exposed a burial cave with twelve ossuaries; the most ornate carries the family name scratched on it twice and the bones of a man of about sixty. Whether it is the high priest of the gospels himself or a close relative turns on how the name is read – the family it certainly is.',
    },
    quote: { de: '„Jehosef bar Kajafa“', en: '"Yehosef bar Qayafa"' },
    topic: 'Kaiphas Ossuar', topicEn: 'Caiaphas ossuary',
    stations: ['annas-caiaphas', 'lazarus'],
  },
  {
    id: 'yehohanan', kind: 'find',
    de: 'Der Gekreuzigte von Giv’at ha-Mivtar', en: 'The crucified man of Giv’at ha-Mivtar',
    when: { de: 'gefunden 1968 in Jerusalem', en: 'found 1968 in Jerusalem' },
    source: { de: 'Ossuar des „Jehohanan ben Hagkol“, Nordost-Jerusalem', en: 'Ossuary of "Yehohanan ben Hagkol", north-east Jerusalem' },
    text: {
      de: 'Ein Fersenbein mit einem eisernen Nagel, der beim Herausziehen an einem Astknoten hängen blieb und deshalb im Grab landete. Über Jahrhunderte römischer Kreuzigungen ist das fast der einzige körperliche Beleg – die Nägel wurden sonst wiederverwendet. Der Fund zeigt auch, dass ein Gekreuzigter ein Grab bekommen konnte.',
      en: 'A heel bone with an iron nail that snagged on a knot in the wood as it was pulled out, and so ended up in the grave. Across centuries of Roman crucifixions this is almost the only physical evidence – the nails were otherwise reused. The find also shows that a crucified man could be given a burial.',
    },
    topic: 'Jehohanan Kreuzigung Fersenbein', topicEn: 'Yehohanan crucifixion heel bone',
    stations: ['golgotha', 'burial'],
  },
  {
    id: 'magdala', kind: 'find',
    de: 'Die Synagoge von Magdala', en: 'The synagogue of Magdala',
    when: { de: 'gefunden 2009 am See', en: 'found 2009 by the lake' },
    source: { de: 'Magdala am Westufer des Sees Gennesaret', en: 'Magdala, west shore of the Sea of Galilee' },
    text: {
      de: 'Eine der wenigen Synagogen, die sicher aus dem 1. Jahrhundert stammen – ein schlichter Saal aus Basalt und Kalkstein mit Bänken an den Wänden. In der Mitte stand ein verzierter Steinblock mit einem siebenarmigen Leuchter, dem Bild des Tempels in einem Dorf drei Tagesreisen entfernt.',
      en: 'One of the few synagogues securely dated to the first century – a plain hall of basalt and limestone with benches along the walls. In the middle stood a carved stone block with a seven-branched lampstand: the temple pictured in a village three days’ journey away.',
    },
    topic: 'Magdala Synagoge Magdala-Stein', topicEn: 'Magdala synagogue Magdala stone',
    stations: ['women-who-fund', 'capernaum-base'],
  },
  {
    id: 'siloam', kind: 'find',
    de: 'Die Stufen des Teichs Siloah', en: 'The steps of the pool of Siloam',
    when: { de: 'gefunden 2004 in Jerusalem', en: 'found 2004 in Jerusalem' },
    source: { de: 'Davidsstadt, südlich des Tempelbergs', en: 'City of David, south of the Temple Mount' },
    text: {
      de: 'Bei der Reparatur eines Abwasserrohrs kamen zwei Steinstufen zum Vorschein; die Grabung darauf legte ein großes Becken aus der Zeit des zweiten Tempels frei. Der Teich, zu dem der Blindgeborene geschickt wird, ist damit kein Ortsname mehr, sondern eine Treppe, auf der man stehen kann.',
      en: 'Repairing a sewer pipe turned up two stone steps; the excavation that followed exposed a large Second Temple period pool. The pool the man born blind is sent to is no longer just a place name but a flight of steps one can stand on.',
    },
    topic: 'Teich Siloah Ausgrabung', topicEn: 'Pool of Siloam excavation',
    stations: ['man-born-blind', 'tabernacles'],
  },
  {
    id: 'nazareth-house', kind: 'find',
    de: 'Ein Haus im Nazareth seiner Zeit', en: 'A house in the Nazareth of his day',
    when: { de: 'gefunden 2009', en: 'found 2009' },
    source: { de: 'Grabung der israelischen Altertümerbehörde, Nazareth', en: 'Israel Antiquities Authority excavation, Nazareth' },
    text: {
      de: 'Erstmals ein Wohnhaus aus dem jüdischen Dorf des 1. Jahrhunderts: klein, schlicht, zwei Räume und ein Hof, dazu ein Versteck aus der Zeit der Unruhen. Schätzungen kommen auf zwei- bis vierhundert Einwohner – der Ort, den kein römischer Autor je erwähnt.',
      en: 'For the first time a dwelling from the Jewish village of the first century: small, plain, two rooms and a courtyard, with a hiding place from the years of unrest. Estimates run to two or four hundred inhabitants – the place no Roman author ever mentions.',
    },
    topic: 'Nazareth Ausgrabung Wohnhaus', topicEn: 'Nazareth first-century house',
    stations: ['annunciation', 'carpenter', 'rejected-home'],
  },
  {
    id: 'james-ossuary', kind: 'find',
    de: 'Das Jakobus-Ossuar', en: 'The James ossuary',
    when: { de: 'bekannt geworden 2002', en: 'made public 2002' },
    source: { de: 'Antikenmarkt, ohne Fundzusammenhang', en: 'Antiquities market, no archaeological context' },
    text: {
      de: 'Ein Beinhaus mit der Inschrift „Jakobus, Sohn des Josef, Bruder des Jesus“ – aus dem Handel, nicht aus einer Grabung. Der Besitzer wurde wegen Fälschung angeklagt und 2012 freigesprochen; das Gericht stellte ausdrücklich fest, damit sei die Echtheit nicht bewiesen. Ohne Fundzusammenhang bleibt der Stein, was er ist: ungeklärt.',
      en: 'An ossuary inscribed "James, son of Joseph, brother of Jesus" – from the market, not from an excavation. Its owner was charged with forgery and acquitted in 2012; the court said expressly that this did not prove authenticity. Without archaeological context the stone stays what it is: unresolved.',
    },
    disputed: true,
    topic: 'Jakobus-Ossuar', topicEn: 'James ossuary',
  },
];

export const WITNESS_BY_ID: Record<string, Witness> = Object.fromEntries(
  WITNESSES.map((w) => [w.id, w]),
);

/** Welche Zeugnisse zu einer Station etwas beitragen. */
export const WITNESSES_BY_STATION: Record<string, Witness[]> = (() => {
  const out: Record<string, Witness[]> = {};
  for (const w of WITNESSES) for (const s of w.stations ?? []) (out[s] ??= []).push(w);
  return out;
})();
