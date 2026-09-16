// Das dritte Regal: die philosophischen Werke, von Athen bis in die Gegenwart.
//
// **Warum ein Bibelatlas ein Philosophieregal bekommt.** Weil kein Satz dieser
// Bibel je ohne Vorverständnis gelesen wurde. „Im Anfang war das Wort" steht
// auf Griechisch da – und `logos` war zu dieser Zeit ein besetzter Begriff, seit
// Heraklit und durch die Stoa hindurch. Die Zwei-Naturen-Lehre von Chalcedon
// redet in den Kategorien des Aristoteles, weil es andere nicht gab. Wer die
// Rechtfertigungslehre erklären will, kommt an Augustins Willensbegriff nicht
// vorbei, und der kommt aus Plotin. Und wer heute fragt, warum Glaube begründet
// werden muss, stellt eine Frage, die vor Kant so niemand gestellt hat.
//
// Das Regal der Bibel zeigt, wann die Bücher geschrieben wurden. Dieses zeigt,
// **mit welchen Begriffen sie gelesen wurden** – und dass diese Begriffe eine
// eigene Geschichte haben, die man kennen kann.
//
// **Die Auswahl.** Fünfundvierzig Werke sind eine Behauptung, und zwar eine
// angreifbare. Das Kriterium ist nicht der Rang in der Philosophiegeschichte,
// sondern die Frage: Hat dieses Buch verändert, wie über Gott, Schrift, Mensch
// oder Welt geredet wird? Deshalb steht Boethius hier und nicht Cicero,
// Feuerbach und nicht Schopenhauer, Ricœur und nicht Sartre. Große Namen ohne
// diese Wirkung fehlen mit Absicht; wo eine Auswahl strittig ist, steht der
// Grund im Text des Eintrags.
//
// **Der Anstoß.** Die Idee kommt vom Philosophiepodcast *Mindmaps* von Manuel
// Schmid und Heinzpeter Hempelmann (RefLab, Zürich), der seit 2021 genau das
// tut: philosophische Entwürfe lesen und ausdrücklich auch theologisch
// befragen. Übernommen ist von dort nichts – kein Text, keine Gliederung, keine
// Folgenliste –, nur die Überzeugung, dass diese beiden Gespräche zusammen
// gehören. Wer die Werke hier gelesen hat und weiterhören will, findet den
// Podcast unter https://www.reflab.ch/category/podcasts/mindmaps/
//
// **Was jeder Eintrag sagt, und was er nicht sagt.** `thesis` ist der eine Satz,
// auf den das Werk sich bringen lässt – jede solche Verkürzung ist unfair, und
// sie steht trotzdem da, weil vierzig Werke ohne Griff niemand betritt. `who`
// nennt die Lage, in der geschrieben wurde, und wogegen. `what` steht für den
// Inhalt, `bible` für das, was das Werk mit dem Lesen der Bibel gemacht hat –
// der Grund, warum es in diesem Regal steht und nicht in einem anderen.
//
// **Die Daten.** `year` ist der Punkt auf dem Zeitstrahl: das Jahr der
// Veröffentlichung, bei Nachlässen das der Herausgabe, bei Vorlesungsnachschriften
// das der Entstehung. `from`/`to` ist daneben die Spanne, in der gearbeitet
// wurde oder über die die Datierung streitet – bei der Metaphysik des
// Aristoteles über zweihundert Jahre, weil zwischen der Vorlesung und der
// Ausgabe des Andronikos genau so viel liegt. `disputed: true` heißt wie im
// Bibelregal nicht „unsicher", sondern: Hier führen zwei Datierungen zu zwei
// verschiedenen Büchern.
//
// **Keine Importe aus Zeitbaum und Kirchengeschichte.** `person` und `event`
// sind bloße Kennungen; aufgelöst werden sie erst dort, wo sie gebraucht
// werden. Der Zeitbaum wiegt 60 kB, und dieses Regal soll sie nicht mitladen,
// um einen Knopf zu beschriften. Dass die Kennungen stimmen, prüft
// `npm run check:philosophie` – und zwar gegen die echten Dateien.

import type { Bilingual } from './shelf';

/** Was für ein Text – die Form sagt mit, wie er gelesen werden will. */
export type PhilKind =
  | 'dialog'
  | 'vorlesung'
  | 'traktat'
  | 'summe'
  | 'bekenntnis'
  | 'aphorismen'
  | 'kritik'
  | 'kommentar'
  | 'essay';

export const PHIL_KIND: Record<PhilKind, Bilingual> = {
  dialog: { de: 'Dialog', en: 'Dialogue' },
  vorlesung: { de: 'Vorlesung', en: 'Lecture course' },
  traktat: { de: 'Traktat', en: 'Treatise' },
  summe: { de: 'Summe', en: 'Summa' },
  bekenntnis: { de: 'Bekenntnisschrift', en: 'Confession' },
  aphorismen: { de: 'Aphorismen', en: 'Aphorisms' },
  kritik: { de: 'Kritik', en: 'Critique' },
  kommentar: { de: 'Kommentar', en: 'Commentary' },
  essay: { de: 'Essay', en: 'Essay' },
};

/**
 * Die Bretter. Sie sind nicht die der Bibel: Dort ordnet der Tempel die Zeit,
 * hier die Frage, die gerade offen ist. Zwischen Boethius und Anselm liegen
 * fünfhundert Jahre ohne einen Rücken – das ist kein Versehen der Auswahl,
 * sondern der Befund, und der Zeitstrahl zeigt ihn als Lücke.
 */
export interface PhilPeriod {
  id: string;
  order: number;
  de: string;
  en: string;
  range: Bilingual;
  from: number;
  to: number;
  color: string;
  /** Die Frage, die in dieser Zeit verhandelt wird – der Satz über dem Brett. */
  note: Bilingual;
}

export const PHIL_PERIODS: PhilPeriod[] = [
  {
    id: 'antike', order: 1, de: 'Klassisches Athen', en: 'Classical Athens',
    range: { de: '400–320 v. Chr.', en: '400–320 BC' }, from: -450, to: -320, color: '#c98a2b',
    note: {
      de: 'Zwei Männer in einer Stadt, die gerade ihren Krieg verloren hat, stellen die Fragen, an denen das Abendland zweitausend Jahre arbeitet: Was ist wirklich, was ist gerecht, was ist ein gutes Leben? Ihre Antworten fallen gegensätzlich aus – und jede spätere Theologie wählt zwischen ihnen.',
      en: 'Two men in a city that has just lost its war pose the questions the West will work on for two thousand years: what is real, what is just, what is a good life? Their answers are opposites – and every later theology chooses between them.',
    },
  },
  {
    id: 'hellenismus', order: 2, de: 'Hellenismus und Rom', en: 'Hellenism and Rome',
    range: { de: '320 v.–300 n. Chr.', en: '320 BC – AD 300' }, from: -320, to: 300, color: '#a89321',
    note: {
      de: 'Die großen Systeme zerfallen in Lebenslehren: Wie hält man das aus? Epikur, die Stoa und zuletzt Plotin antworten verschieden – und alle drei antworten in derselben Welt, in der die Briefe des Neuen Testaments geschrieben werden.',
      en: 'The great systems break up into ways of life: how does one bear this? Epicurus, the Stoa and finally Plotinus answer differently – and all three answer inside the same world in which the letters of the New Testament are written.',
    },
  },
  {
    id: 'spaetantike', order: 3, de: 'Spätantike', en: 'Late antiquity',
    range: { de: '200–600 n. Chr.', en: 'AD 200–600' }, from: 200, to: 600, color: '#b0436b',
    note: {
      de: 'Die Kirche erbt ein Reich und mit ihm dessen Denkmittel. Was jetzt geschrieben wird, ist der Versuch, den Glauben in der Sprache der Philosophie auszusagen – und die Frage mitzuverhandeln, wieviel von dieser Sprache er verträgt.',
      en: 'The church inherits an empire and with it its tools of thought. What is written now is an attempt to say the faith in the language of philosophy – and to settle, along the way, how much of that language it can bear.',
    },
  },
  {
    id: 'scholastik', order: 4, de: 'Mittelalter und Scholastik', en: 'The Middle Ages and scholasticism',
    range: { de: '1050–1350', en: '1050–1350' }, from: 600, to: 1400, color: '#7a6a45',
    note: {
      de: 'An den neuen Universitäten wird der Glaube zum Gegenstand einer Methode: Frage, Einwände, Antwort, Erwiderung. Drei Religionen lesen dabei denselben Aristoteles – und streiten über dieselben Fragen in denselben Begriffen.',
      en: 'At the new universities faith becomes the object of a method: question, objections, answer, reply. Three religions read the same Aristotle – and argue the same questions in the same terms.',
    },
  },
  {
    id: 'renaissance', order: 5, de: 'Renaissance und Reformation', en: 'Renaissance and Reformation',
    range: { de: '1400–1650', en: '1400–1650' }, from: 1400, to: 1650, color: '#c2812a',
    note: {
      de: 'Der Druck, die Quellen im Urtext, eine gespaltene Kirche und ein Weltbild, das gerade den Mittelpunkt verliert. In fünfzig Jahren wird aus der Frage, was wahr ist, die Frage, woher ich es wissen kann.',
      en: 'Print, the sources in their original languages, a divided church and a picture of the world just losing its centre. Within fifty years the question of what is true becomes the question of how I could know it.',
    },
  },
  {
    id: 'aufklaerung', order: 6, de: 'Aufklärung', en: 'The Enlightenment',
    range: { de: '1650–1800', en: '1650–1800' }, from: 1650, to: 1800, color: '#5c8a3a',
    note: {
      de: 'Die Vernunft wird zum Richter, auch über die Offenbarung. Die Bibel wird zum ersten Mal wie ein antikes Buch gelesen, das Wunder zum Beweisproblem – und am Ende steht eine Grenze, die auch die Vernunft sich ziehen lassen muss.',
      en: 'Reason becomes the judge, revelation included. For the first time the Bible is read like an ancient book, the miracle becomes a problem of proof – and at the end stands a limit that reason too must accept.',
    },
  },
  {
    id: 'neunzehn', order: 7, de: 'Das 19. Jahrhundert', en: 'The nineteenth century',
    range: { de: '1800–1900', en: '1800–1900' }, from: 1800, to: 1900, color: '#2f8f7f',
    note: {
      de: 'Der Verdacht kommt auf: Vielleicht redet die Religion gar nicht von Gott, sondern vom Menschen. Vier Bücher in vierzig Jahren erklären den Glauben aus dem Wunsch, aus dem Elend, aus der Angst – und ein fünftes setzt gegen alle den Einzelnen.',
      en: 'Suspicion sets in: perhaps religion does not speak of God at all but of humankind. Four books in forty years explain faith out of desire, out of misery, out of fear – and a fifth sets the single individual against them all.',
    },
  },
  {
    id: 'moderne', order: 8, de: 'Moderne und Gegenwart', en: 'Modernity and the present',
    range: { de: 'ab 1900', en: 'from 1900' }, from: 1900, to: 2030, color: '#3a6ea8',
    note: {
      de: 'Nach zwei Kriegen und einem Völkermord ist die Frage nicht mehr, ob sich Gott beweisen lässt, sondern ob dem Anderen etwas geschuldet ist – und wie es kommt, dass Glaube heute eine Möglichkeit unter anderen ist.',
      en: 'After two wars and a genocide the question is no longer whether God can be proved, but whether anything is owed to the other – and how it came about that belief is now one option among others.',
    },
  },
];

export const PHIL_PERIOD_BY_ID: Record<string, PhilPeriod> = Object.fromEntries(
  PHIL_PERIODS.map((p) => [p.id, p]),
);

/**
 * Wie ein Werk auf ein anderes zeigt. Drei Arten reichen, und sie sind alle
 * gerichtet: `to` ist immer das frühere Werk, und die Art sagt, was dieses
 * hier mit ihm tut.
 */
export type PhilLinkKind = 'builds' | 'against' | 'echoes';

export interface PhilLink {
  /** ID eines anderen Werkes aus diesem Regal. */
  to: string;
  kind: PhilLinkKind;
  de: string;
  en: string;
}

export interface PhilWork {
  id: string;
  kind: PhilKind;
  /** Der Verfasser, wie er im Deutschen und im Englischen heißt. */
  author: Bilingual;
  /** Lebensdaten, als Satz – „384–322 v. Chr." */
  lived: Bilingual;
  /** Der Titel in der Sprache des Originals. */
  original: string;
  /** Umschrift, wo das Original nicht lateinisch geschrieben ist. */
  translit?: string;
  de: string;
  en: string;
  /** Der Name, der auf den Rücken passt – dieselbe Obergrenze wie im Bibelregal. */
  shortDe: string;
  shortEn: string;
  /** Brett – eine ID aus `PHIL_PERIODS`. */
  period: string;
  /** Der Punkt auf dem Zeitstrahl. */
  year: number;
  /** Spanne der Entstehung oder der vertretenen Datierungen; negativ = v. Chr. */
  from: number;
  to: number;
  disputed?: boolean;
  when: Bilingual;
  /** Der eine Satz – jede Verkürzung ist unfair, und ohne sie geht niemand hinein. */
  thesis: Bilingual;
  /** Wer schrieb, in welcher Lage, und wogegen. */
  who: Bilingual;
  /** Was darin steht. */
  what: Bilingual;
  /** Was es mit dem Lesen der Bibel gemacht hat – der Grund, hier zu stehen. */
  bible: Bilingual;
  /** Biblische Bücher, mit denen das Werk arbeitet (OSIS). */
  books: string[];
  links: PhilLink[];
  /** Person aus dem Zeitbaum (`genealogy.ts`), wo es eine gibt. */
  person?: string;
  /** Ereignis der Kirchengeschichte-Zeitschiene (`churchHistory.ts`). */
  event?: string;
  wiki: string;
  wikiEn: string;
}

export const PHIL_WORKS: PhilWork[] = [
  /* --- Klassisches Athen ------------------------------------------------- */
  {
    id: 'platon-politeia', kind: 'dialog',
    author: { de: 'Platon', en: 'Plato' },
    lived: { de: '428–348 v. Chr.', en: '428–348 BC' },
    original: 'Πολιτεία', translit: 'Politeia',
    de: 'Der Staat', en: 'The Republic',
    shortDe: 'Der Staat', shortEn: 'The Republic',
    period: 'antike', year: -375, from: -390, to: -360,
    when: { de: 'um 375 v. Chr.', en: 'c. 375 BC' },
    thesis: {
      de: 'Was wir sehen, sind Schatten; wirklich ist, was sich nur denken lässt.',
      en: 'What we see are shadows; what is real can only be thought.',
    },
    who: {
      de: 'Platon schreibt als Schüler eines Hingerichteten. Athen hatte Sokrates 399 zum Tod verurteilt, weil er die Jugend verderbe – und für Platon ist damit erwiesen, dass eine Mehrheit über die Wahrheit nicht abstimmen kann. Der Dialog sucht deshalb den Gerechten nicht in der Politik, sondern jenseits von ihr.',
      en: 'Plato writes as the pupil of an executed man. Athens had condemned Socrates to death in 399 for corrupting the young – proof to Plato that a majority cannot vote on the truth. So the dialogue looks for the just man not in politics but beyond it.',
    },
    what: {
      de: 'Zehn Bücher über die Frage, was Gerechtigkeit ist, entlang eines Gedankenexperiments: Wie müsste ein Staat gebaut sein, in dem sie vorkommt? In der Mitte stehen drei Bilder, die alles tragen – die Sonne, die geteilte Linie und die Höhle, in der Gefesselte Schatten für die Wirklichkeit halten. Wer heraustritt und zurückkommt, wird nicht geglaubt.',
      en: 'Ten books on the question of what justice is, along a thought experiment: how would a state have to be built for justice to occur in it? At the centre stand three images that carry everything – the sun, the divided line, and the cave in which prisoners take shadows for reality. Whoever steps out and returns is not believed.',
    },
    bible: {
      de: 'Die Unterscheidung zwischen einer sichtbaren und einer wahren Welt ist das Erbstück, mit dem die christliche Theologie ihre ganze Geschichte über gerungen hat. Sie erlaubte, „das Reich Gottes" als eine andere, höhere Wirklichkeit zu denken – und sie legte nahe, den Leib als Kerker zu lesen, was der hebräischen Bibel fremd ist. Wer über Auferstehung des Leibes gegen Unsterblichkeit der Seele streitet, streitet über diesen Text.',
      en: 'The distinction between a visible and a true world is the inheritance Christian theology has wrestled with all through its history. It allowed "the kingdom of God" to be thought as another, higher reality – and it invited reading the body as a prison, which is alien to the Hebrew Bible. Anyone arguing resurrection of the body against immortality of the soul is arguing about this text.',
    },
    books: ['1Cor', 'John', 'Eccl'],
    links: [],
    wiki: 'Politeia', wikiEn: 'Republic (Plato)',
  },
  {
    id: 'platon-timaios', kind: 'dialog',
    author: { de: 'Platon', en: 'Plato' },
    lived: { de: '428–348 v. Chr.', en: '428–348 BC' },
    original: 'Τίμαιος', translit: 'Timaios',
    de: 'Timaios', en: 'Timaeus',
    shortDe: 'Timaios', shortEn: 'Timaeus',
    period: 'antike', year: -360, from: -365, to: -350,
    when: { de: 'um 360 v. Chr.', en: 'c. 360 BC' },
    thesis: {
      de: 'Die Welt ist gemacht – von einem Guten, aus vorgefundenem Stoff, nach einem Bauplan.',
      en: 'The world is made – by someone good, out of material already there, after a plan.',
    },
    who: {
      de: 'Der späte Platon erzählt, wie die Welt entstand, und sagt selbst dazu, es sei „eine wahrscheinliche Rede", kein Wissen. Genau diese Vorsicht ging verloren: Der Timaios war bis ins 12. Jahrhundert der einzige Platon, den der lateinische Westen vollständig kannte – in der Teilübersetzung des Calcidius.',
      en: 'The late Plato tells how the world came to be, and says himself that this is "a likely story", not knowledge. That caution was exactly what got lost: until the 12th century the Timaeus was the only Plato the Latin West knew in full, in the partial translation of Calcidius.',
    },
    what: {
      de: 'Ein Handwerker, der Demiurg, formt den ungeordneten Stoff nach dem Vorbild der ewigen Ideen, weil er gut ist und „gut sein heißt, nicht neidisch sein". Die Zeit entsteht mit dem Himmel als „bewegliches Abbild der Ewigkeit". Die Welt bekommt eine Seele, die Elemente bekommen Körperformen, und der Mensch ist ein Kosmos im Kleinen.',
      en: 'A craftsman, the demiurge, shapes unordered material after the pattern of the eternal forms, because he is good and "to be good is to be without envy". Time arises with the heavens as a "moving image of eternity". The world receives a soul, the elements receive geometric bodies, and the human being is a cosmos in miniature.',
    },
    bible: {
      de: 'Zwei Schöpfungserzählungen stehen sich damit gegenüber, und der Unterschied ist kein kleiner: Platons Demiurg ordnet vorhandenen Stoff, 1. Mose 1 kennt keinen Stoff neben Gott. Das christliche „aus nichts" ist als Abgrenzung gegen genau diesen Text formuliert worden. Zugleich hat der Timaios der Theologie erlaubt, die Welt als geordnet, berechenbar und gut zu denken – die Wurzel dessen, was später Naturwissenschaft wird.',
      en: 'Two creation accounts thus stand face to face, and the difference is not small: Plato’s demiurge orders material already there; Genesis 1 knows no material alongside God. The Christian "out of nothing" was formulated precisely against this text. At the same time the Timaeus let theology think the world as ordered, calculable and good – the root of what later becomes natural science.',
    },
    books: ['Gen', 'John', 'Heb'],
    links: [
      { to: 'platon-politeia', kind: 'builds', de: 'Dieselben Ideen, nun als Bauplan einer Welt statt als Maßstab eines Staates.', en: 'The same forms, now as the blueprint of a world rather than the measure of a state.' },
    ],
    wiki: 'Timaios', wikiEn: 'Timaeus (dialogue)',
  },
  {
    id: 'aristoteles-metaphysik', kind: 'vorlesung',
    author: { de: 'Aristoteles', en: 'Aristotle' },
    lived: { de: '384–322 v. Chr.', en: '384–322 BC' },
    original: 'Τὰ μετὰ τὰ φυσικά', translit: 'Ta meta ta physika',
    de: 'Metaphysik', en: 'Metaphysics',
    shortDe: 'Metaphysik', shortEn: 'Metaphysics',
    period: 'antike', year: -340, from: -350, to: -60, disputed: true,
    when: { de: 'Vorlesungen um 350–330 v. Chr., Ausgabe um 60 v. Chr.', en: 'Lectures c. 350–330 BC, edition c. 60 BC' },
    thesis: {
      de: 'Das Wirkliche ist dieses Ding hier – und was es ist, zeigt sich daran, worauf es hinauswill.',
      en: 'The real is this thing here – and what it is shows in what it is for.',
    },
    who: {
      de: 'Zwanzig Jahre Schüler Platons, dann dessen entschiedenster Kritiker: „Die Freunde sind uns lieb, aber die Wahrheit ist uns lieber." Was hier steht, sind Vorlesungsmanuskripte, keine Bücher; den Titel bekamen sie erst von Andronikos von Rhodos, der sie rund 250 Jahre später ordnete – „das nach der Physik". Die berühmteste Bezeichnung der Philosophiegeschichte ist eine Regalangabe.',
      en: 'Twenty years Plato’s pupil, then his most decisive critic: "we love our friends, but we love the truth more." What stands here are lecture manuscripts, not books; the title came only from Andronicus of Rhodes, who arranged them some 250 years later – "the ones after the Physics". The most famous term in the history of philosophy is a shelf mark.',
    },
    what: {
      de: 'Die Ideen sind nicht in einem Himmel, sondern in den Dingen: Jedes Einzelne ist Stoff und Form zugleich. Veränderung erklärt sich aus vier Ursachen – woraus, wodurch, wozu, was es ist –, und die Reihe der Bewegungen endet bei einem, der selbst unbewegt bleibt und bewegt, „wie das Geliebte bewegt".',
      en: 'The forms are not in a heaven but in the things: each individual is matter and form at once. Change is explained by four causes – out of what, by what, for what, what it is – and the series of movements ends in one that itself remains unmoved and moves "as the beloved moves".',
    },
    bible: {
      de: 'Der unbewegte Beweger ist der Gott der Philosophen, und die Theologie hat ihn tausend Jahre später übernommen: unveränderlich, leidensunfähig, vollkommen. Thomas von Aquin baut darauf seine fünf Wege. Ob ein Gott, der nicht leiden kann, noch der Gott ist, der am Kreuz hängt, ist seither die härteste Frage an diese Verbindung – und seit dem 20. Jahrhundert wird sie laut gestellt.',
      en: 'The unmoved mover is the God of the philosophers, and theology took him over a thousand years later: unchangeable, incapable of suffering, perfect. Thomas Aquinas builds his five ways on it. Whether a God who cannot suffer is still the God who hangs on the cross has been the hardest question to that union ever since – and since the 20th century it is asked loudly.',
    },
    books: ['Exod', 'Acts', 'Heb'],
    links: [
      { to: 'platon-politeia', kind: 'against', de: 'Die Ideen stehen nicht über den Dingen, sondern in ihnen – Platons Zwei-Welten-Lehre fällt weg.', en: 'The forms stand not above things but in them – Plato’s two-world doctrine falls away.' },
    ],
    wiki: 'Metaphysik (Aristoteles)', wikiEn: 'Metaphysics (Aristotle)',
  },
  {
    id: 'aristoteles-ethik', kind: 'vorlesung',
    author: { de: 'Aristoteles', en: 'Aristotle' },
    lived: { de: '384–322 v. Chr.', en: '384–322 BC' },
    original: 'Ἠθικὰ Νικομάχεια', translit: 'Ethika Nikomacheia',
    de: 'Nikomachische Ethik', en: 'Nicomachean Ethics',
    shortDe: 'Nikom. Ethik', shortEn: 'Ethics',
    period: 'antike', year: -335, from: -340, to: -322,
    when: { de: 'um 335 v. Chr.', en: 'c. 335 BC' },
    thesis: {
      de: 'Gut wird man nicht durch Einsicht, sondern durch Übung – Haltung ist gewordene Gewohnheit.',
      en: 'One does not become good by insight but by practice – character is habit grown solid.',
    },
    who: {
      de: 'Aristoteles unterrichtet in Athen als Fremder, der die Bürgerrechte nicht hat, und schreibt eine Ethik für Bürger. Der Titel nennt seinen Sohn Nikomachos, der die Nachschrift wohl herausgab.',
      en: 'Aristotle teaches in Athens as a foreigner without citizen rights, and writes an ethics for citizens. The title names his son Nicomachus, who probably edited the notes.',
    },
    what: {
      de: 'Alles Handeln zielt auf ein Gut, und das letzte heißt *eudaimonia* – nicht Glücksgefühl, sondern gelingendes Leben. Erreicht wird es durch Tugenden, die zwischen zwei Fehlformen liegen: Mut zwischen Tollkühnheit und Feigheit. Tugend ist kein Wissen, sondern eine Fertigkeit; man lernt sie wie ein Handwerk, durch Tun. Zwei Bücher über die Freundschaft stehen mittendrin.',
      en: 'All action aims at some good, and the last one is called *eudaimonia* – not a feeling of happiness but a life going well. It is reached through virtues lying between two failures: courage between recklessness and cowardice. Virtue is not knowledge but a skill; it is learned like a craft, by doing. Two books on friendship stand in the middle.',
    },
    bible: {
      de: 'Die christliche Tugendlehre ist dieses Buch mit drei Zusätzen: Glaube, Hoffnung, Liebe. Thomas von Aquin setzt sie als „eingegossene" Tugenden über die erworbenen, und daraus wird die katholische Moraltheologie. Die Reformation hat genau dagegen gesetzt, dass ein Mensch sich nicht zum Guten üben kann – der Streit zwischen Erasmus und Luther steht drei Bretter weiter und hat hier seine Vorgeschichte.',
      en: 'Christian virtue ethics is this book plus three additions: faith, hope, love. Thomas Aquinas sets them as "infused" virtues above the acquired ones, and out of that grows Catholic moral theology. The Reformation set itself against exactly this, holding that no one can practise their way into goodness – the quarrel between Erasmus and Luther stands three shelves on and has its prehistory here.',
    },
    books: ['Prov', 'Gal', 'Jas'],
    links: [
      { to: 'aristoteles-metaphysik', kind: 'builds', de: 'Dieselbe Frage nach dem Wozu, jetzt am Menschen: Worauf will ein Leben hinaus?', en: 'The same question of what-for, now applied to the human being: what is a life aiming at?' },
    ],
    wiki: 'Nikomachische Ethik', wikiEn: 'Nicomachean Ethics',
  },

  /* --- Hellenismus und Rom ------------------------------------------------ */
  {
    id: 'epikur-menoikeus', kind: 'traktat',
    author: { de: 'Epikur', en: 'Epicurus' },
    lived: { de: '341–270 v. Chr.', en: '341–270 BC' },
    original: 'Ἐπιστολὴ πρὸς Μενοικέα', translit: 'Epistole pros Menoikea',
    de: 'Brief an Menoikeus', en: 'Letter to Menoeceus',
    shortDe: 'An Menoikeus', shortEn: 'To Menoeceus',
    period: 'hellenismus', year: -300, from: -306, to: -270,
    when: { de: 'um 300 v. Chr.', en: 'c. 300 BC' },
    thesis: {
      de: 'Der Tod geht uns nichts an – und die Götter auch nicht.',
      en: 'Death is nothing to us – and neither are the gods.',
    },
    who: {
      de: 'Epikur lehrt in einem Garten vor den Toren Athens, und er nimmt Frauen und Sklaven auf, was beides ungewöhnlich ist. Von seinen rund dreihundert Schriften sind drei Briefe erhalten; dieser ist der kürzeste Lebensentwurf der Antike, und er ist gegen die Angst geschrieben.',
      en: 'Epicurus teaches in a garden outside the gates of Athens, and admits women and slaves, both unusual. Of his roughly three hundred writings three letters survive; this is antiquity’s shortest programme for a life, and it is written against fear.',
    },
    what: {
      de: 'Vier Sätze als Heilmittel: Die Götter sind nicht zu fürchten, der Tod ist nicht zu spüren, das Gute ist leicht zu erlangen, das Schlimme leicht zu ertragen. Lust ist das Ziel, aber Lust heißt hier Abwesenheit von Schmerz und Unruhe, nicht Genuss: Brot und Wasser, und Freunde dabei.',
      en: 'Four sentences as remedy: the gods are not to be feared, death cannot be felt, the good is easy to get, the terrible easy to endure. Pleasure is the goal, but pleasure here means the absence of pain and disturbance, not indulgence: bread and water, and friends at the table.',
    },
    bible: {
      de: 'In Apostelgeschichte 17 diskutiert Paulus in Athen ausdrücklich mit Epikureern und Stoikern – dieses Denken ist der Gesprächspartner der ersten Christen, nicht ihr Hintergrund. Der Satz „Lasst uns essen und trinken, denn morgen sind wir tot", den Paulus in 1. Korinther 15 zitiert, zielt auf diese Schule. Und die Frage, wie ein guter Gott das Übel zulässt, ist als epikureische Frage überliefert, lange bevor Leibniz ihr einen Namen gibt.',
      en: 'In Acts 17 Paul argues in Athens explicitly with Epicureans and Stoics – this thinking is the first Christians’ conversation partner, not their backdrop. The line "let us eat and drink, for tomorrow we die", quoted by Paul in 1 Corinthians 15, aims at this school. And the question how a good God permits evil is handed down as an Epicurean question, long before Leibniz gives it a name.',
    },
    books: ['Acts', '1Cor', 'Eccl'],
    links: [],
    wiki: 'Epikur', wikiEn: 'Epicurus',
  },
  {
    id: 'seneca-lucilius', kind: 'essay',
    author: { de: 'Seneca', en: 'Seneca' },
    lived: { de: 'um 4 v.–65 n. Chr.', en: 'c. 4 BC – AD 65' },
    original: 'Epistulae morales ad Lucilium',
    de: 'Briefe an Lucilius', en: 'Letters to Lucilius',
    shortDe: 'An Lucilius', shortEn: 'To Lucilius',
    period: 'hellenismus', year: 64, from: 62, to: 65,
    when: { de: '62–65 n. Chr.', en: 'AD 62–65' },
    thesis: {
      de: 'Frei ist, wer nichts fürchtet, weil er auf nichts angewiesen ist – auch nicht auf das eigene Leben.',
      en: 'Free is the one who fears nothing, because he depends on nothing – not even his own life.',
    },
    who: {
      de: 'Der reichste Philosoph Roms, Erzieher und dann Minister Neros, schreibt in seinen letzten Jahren 124 Briefe über das gute Leben – und wird 65 von demselben Nero zum Selbstmord gezwungen. Der Abstand zwischen seinem Vermögen und seiner Lehre von der Bedürfnislosigkeit war schon Zeitgenossen ein Vorwurf, und er hat ihn nie ausgeräumt.',
      en: 'Rome’s richest philosopher, tutor and then minister to Nero, writes 124 letters on the good life in his last years – and in 65 is forced to suicide by that same Nero. The gap between his fortune and his teaching of needing nothing was already a reproach in his lifetime, and he never cleared it up.',
    },
    what: {
      de: 'Kein System, sondern Übungen: über die Zeit, die uns gestohlen wird; über die Menge, die schlechter macht; über den Tod, den man täglich einüben soll. Der Kern ist stoisch – unterscheide, was in deiner Macht steht, und wolle nichts anderes. Der Ton ist der eines Freundes, der selbst noch nicht so weit ist.',
      en: 'No system but exercises: on the time that is stolen from us; on the crowd that makes us worse; on death, which is to be rehearsed daily. The core is Stoic – distinguish what is in your power and want nothing else. The tone is that of a friend who has not got there himself.',
    },
    bible: {
      de: 'Seneca stirbt in denselben Jahren, in denen Paulus in Rom ist, und die Nähe mancher Sätze war so auffällig, dass das 4. Jahrhundert einen Briefwechsel zwischen beiden fälschte – Hieronymus zählt Seneca deshalb unter die christlichen Schriftsteller. Die Fälschung ist längst erkannt; geblieben ist die Einsicht, dass „Gewissen", „Vorsehung" und „Menschenwürde" im Christentum stoisch geprägte Wörter sind.',
      en: 'Seneca dies in the same years in which Paul is in Rome, and some sentences are so close that the 4th century forged a correspondence between them – which is why Jerome counts Seneca among Christian writers. The forgery was long since exposed; what remains is the insight that "conscience", "providence" and "human dignity" are Stoically shaped words in Christianity.',
    },
    books: ['Rom', 'Phil', 'Acts'],
    links: [
      { to: 'epikur-menoikeus', kind: 'against', de: 'Seneca zitiert Epikur ständig und zustimmend – und hält die Lust trotzdem für das falsche Ziel.', en: 'Seneca quotes Epicurus constantly and approvingly – and still holds pleasure to be the wrong goal.' },
    ],
    wiki: 'Epistulae morales ad Lucilium', wikiEn: 'Moral Letters to Lucilius',
  },
  {
    id: 'plotin-enneaden', kind: 'traktat',
    author: { de: 'Plotin', en: 'Plotinus' },
    lived: { de: '205–270 n. Chr.', en: 'AD 205–270' },
    original: 'Ἐννεάδες', translit: 'Enneades',
    de: 'Die Enneaden', en: 'The Enneads',
    shortDe: 'Enneaden', shortEn: 'Enneads',
    period: 'hellenismus', year: 270, from: 253, to: 305,
    when: { de: 'geschrieben 253–270, herausgegeben um 300', en: 'written 253–270, published c. 300' },
    thesis: {
      de: 'Alles fließt aus einem Einen, das selbst nicht einmal „ist" – und alles will dorthin zurück.',
      en: 'Everything flows from a One that does not even "exist" – and everything wants back to it.',
    },
    who: {
      de: 'Plotin lehrt in Rom, während das Reich in der Reichskrise fast zerfällt. Sein Schüler Porphyrios ordnet die Aufsätze nach seinem Tod in sechs Gruppen zu je neun – daher der Titel – und schreibt dazu, sein Lehrer habe sich geschämt, einen Körper zu haben.',
      en: 'Plotinus teaches in Rome while the empire nearly falls apart in the crisis of the third century. After his death his pupil Porphyry arranges the essays in six groups of nine – hence the title – and notes that his teacher was ashamed to have a body.',
    },
    what: {
      de: 'Drei Stufen: das Eine, aus dem alles hervorgeht, ohne dass es dabei weniger wird; der Geist, in dem die Ideen sind; die Seele, die die Welt belebt. Der Weg zurück führt nach innen und endet in einer Erfahrung, die Plotin selbst viermal gehabt haben soll und die sich nicht sagen lässt. Das Böse ist dabei kein Etwas, sondern das Weniger-Werden am Ende der Reihe.',
      en: 'Three levels: the One, out of which everything proceeds without itself becoming less; the Intellect, in which the forms are; the Soul, which animates the world. The way back leads inwards and ends in an experience Plotinus is said to have had four times, and which cannot be said. Evil, on this account, is not a something but the thinning-out at the end of the series.',
    },
    bible: {
      de: 'Augustinus liest die Neuplatoniker vor seiner Taufe und sagt, sie hätten ihn vom Materialismus befreit – ohne sie kein „Bekenntnisse". Von hier kommt der Satz, das Böse sei kein Wesen, sondern ein Mangel an Gutem, mit dem die Theologie seither die Frage nach dem Übel beantwortet. Und von hier kommt die Mystik: die Rede vom Grund der Seele, vom Aufstieg, vom Gott jenseits aller Begriffe – bei Dionysius, bei Eckhart, bei Nikolaus von Kues.',
      en: 'Augustine reads the Neoplatonists before his baptism and says they freed him from materialism – without them no Confessions. From here comes the claim that evil is not a substance but a lack of good, with which theology has answered the question of evil ever since. And from here comes mysticism: the talk of the ground of the soul, of ascent, of a God beyond all concepts – in Dionysius, in Eckhart, in Nicholas of Cusa.',
    },
    books: ['John', '1John', 'Exod'],
    links: [
      { to: 'platon-timaios', kind: 'builds', de: 'Platon, radikalisiert: Über den Ideen steht noch eines, von dem sich nichts aussagen lässt.', en: 'Plato radicalised: above the forms stands one more thing, of which nothing can be said.' },
    ],
    wiki: 'Enneaden', wikiEn: 'Enneads',
  },

  /* --- Spätantike --------------------------------------------------------- */
  {
    id: 'origenes-prinzipien', kind: 'traktat',
    author: { de: 'Origenes', en: 'Origen' },
    lived: { de: '185–254 n. Chr.', en: 'AD 185–254' },
    original: 'Περὶ ἀρχῶν', translit: 'Peri archon',
    de: 'Über die Prinzipien', en: 'On First Principles',
    shortDe: 'De principiis', shortEn: 'First Principles',
    period: 'spaetantike', year: 229, from: 220, to: 231,
    when: { de: 'um 229 n. Chr.', en: 'c. AD 229' },
    thesis: {
      de: 'Die Schrift hat einen Leib, eine Seele und einen Geist – und wer beim Leib stehen bleibt, hat sie nicht gelesen.',
      en: 'Scripture has a body, a soul and a spirit – and whoever stops at the body has not read it.',
    },
    who: {
      de: 'Origenes leitet die Katechetenschule in Alexandria, der Stadt, in der die Bibel griechisch wurde und in der Philon sie schon hundertfünfzig Jahre zuvor allegorisch gelesen hatte. Dreihundert Jahre nach seinem Tod verurteilt ihn ein Konzil; der griechische Text geht darüber verloren und ist nur in der geglätteten lateinischen Übersetzung Rufins ganz erhalten – wir lesen ihn durch die Hand eines Verteidigers.',
      en: 'Origen heads the catechetical school of Alexandria, the city in which the Bible became Greek and in which Philo had already read it allegorically a hundred and fifty years earlier. Three hundred years after his death a council condemns him; the Greek text is lost in the process and survives complete only in Rufinus’s smoothed Latin translation – we read it through a defender’s hand.',
    },
    what: {
      de: 'Der erste Versuch, den christlichen Glauben als Ganzes zu ordnen: Gott, Welt, Freiheit, Schrift. Und die erste ausgeführte Lehre vom dreifachen Schriftsinn – wörtlich, moralisch, geistlich. Anstößiges im Text ist für Origenes keine Peinlichkeit, sondern ein Signal: Wo die Erzählung stolpert, will sie tiefer gelesen werden. Am Ende steht die Hoffnung, dass zuletzt alles wiederhergestellt wird, auch der Teufel – der Satz, der ihn verurteilt hat.',
      en: 'The first attempt to order the Christian faith as a whole: God, world, freedom, scripture. And the first worked-out doctrine of the threefold sense of scripture – literal, moral, spiritual. What offends in the text is for Origen not an embarrassment but a signal: where the narrative stumbles, it wants to be read deeper. At the end stands the hope that at last everything will be restored, the devil included – the sentence that condemned him.',
    },
    bible: {
      de: 'Ohne Origenes gäbe es die abendländische Bibelauslegung nicht: Die vier Schriftsinne des Mittelalters sind seine drei plus einer. Und die Gegenbewegung – Antiochien, später Luther, später die historische Kritik – ist jedes Mal eine Rückkehr zum Wortsinn gegen ihn. Zugleich hat er als Erster die Textgestalt untersucht: Seine Hexapla stellte sechs Fassungen des Alten Testaments in Spalten nebeneinander.',
      en: 'Without Origen there would be no Western biblical interpretation: the medieval four senses are his three plus one. And the counter-movement – Antioch, later Luther, later historical criticism – is each time a return to the literal sense against him. He was also the first to examine the shape of the text: his Hexapla set six versions of the Old Testament side by side in columns.',
    },
    books: ['Gen', 'Song', 'John'],
    links: [
      { to: 'platon-politeia', kind: 'builds', de: 'Der Schritt vom Schatten zum Wirklichen wird zur Anweisung, wie ein Text zu lesen ist.', en: 'The step from shadow to the real becomes an instruction for how a text is to be read.' },
    ],
    person: 'origenes', event: 'kanon',
    wiki: 'De principiis', wikiEn: 'On First Principles',
  },
  {
    id: 'augustinus-confessiones', kind: 'bekenntnis',
    author: { de: 'Augustinus von Hippo', en: 'Augustine of Hippo' },
    lived: { de: '354–430 n. Chr.', en: 'AD 354–430' },
    original: 'Confessiones',
    de: 'Bekenntnisse', en: 'Confessions',
    shortDe: 'Bekenntnisse', shortEn: 'Confessions',
    period: 'spaetantike', year: 400, from: 397, to: 401,
    when: { de: '397–401 n. Chr.', en: 'AD 397–401' },
    thesis: {
      de: 'Ich bin mir selbst zur Frage geworden – und die Antwort liegt nicht in mir.',
      en: 'I have become a question to myself – and the answer does not lie in me.',
    },
    who: {
      de: 'Ein Bischof Mitte vierzig schreibt die Geschichte seines Lebens als Gebet: an Gott gerichtet, in der zweiten Person, dreizehn Bücher lang. Das gab es vorher nicht. Antike Selbstdarstellungen zeigen Taten; hier zeigt einer sein Inneres, samt gestohlener Birnen, Konkubine und dem Satz „Gib mir Keuschheit – aber noch nicht jetzt".',
      en: 'A bishop in his mid-forties writes the story of his life as a prayer: addressed to God, in the second person, thirteen books long. Nothing like it existed before. Ancient self-presentations display deeds; here a man displays his interior, stolen pears, concubine and the line "give me chastity – but not yet" included.',
    },
    what: {
      de: 'Neun Bücher Lebensweg bis zur Bekehrung im Garten von Mailand und zum Tod der Mutter, dann ein Bruch: Buch 10 fragt, was Erinnerung ist, Buch 11, was Zeit ist – „Wenn mich niemand danach fragt, weiß ich es; will ich es einem Fragenden erklären, weiß ich es nicht" –, die letzten beiden legen 1. Mose 1 aus. Die Autobiographie mündet in eine Schriftauslegung, und das ist der Punkt.',
      en: 'Nine books of a life up to the conversion in the garden at Milan and the death of his mother, then a break: book 10 asks what memory is, book 11 what time is – "if no one asks me, I know; if I want to explain it to someone who asks, I do not know" – and the last two expound Genesis 1. The autobiography ends in biblical exegesis, and that is the point.',
    },
    bible: {
      de: 'Mit diesem Buch bekommt das Innere eine Sprache, und die abendländische Frömmigkeit redet seither in ihr: Gewissen, Umkehr, Herz, Unruhe. Die Bekehrungsszene – ein Kind singt „nimm und lies", er schlägt Römer 13 auf – ist das Urbild dessen geworden, wie man in dieser Kultur von Glauben erzählt, bis hin zum Bericht in einer Freikirche heute.',
      en: 'With this book the interior life acquires a language, and Western piety has spoken it ever since: conscience, turning, heart, restlessness. The conversion scene – a child sings "take and read", he opens Romans 13 – has become the template for how this culture tells of faith, down to a testimony in a free church today.',
    },
    books: ['Ps', 'Rom', 'Gen'],
    links: [
      { to: 'plotin-enneaden', kind: 'builds', de: 'Der Aufstieg nach innen, den Plotin beschreibt – nun mit einem Gegenüber, das antwortet.', en: 'The inward ascent Plotinus describes – now with a counterpart that answers.' },
    ],
    person: 'augustinus',
    wiki: 'Confessiones', wikiEn: 'Confessions (Augustine)',
  },
  {
    id: 'augustinus-civitate', kind: 'traktat',
    author: { de: 'Augustinus von Hippo', en: 'Augustine of Hippo' },
    lived: { de: '354–430 n. Chr.', en: 'AD 354–430' },
    original: 'De civitate Dei',
    de: 'Vom Gottesstaat', en: 'The City of God',
    shortDe: 'Gottesstaat', shortEn: 'City of God',
    period: 'spaetantike', year: 426, from: 413, to: 426,
    when: { de: '413–426 n. Chr.', en: 'AD 413–426' },
    thesis: {
      de: 'Zwei Städte, gebaut aus zwei Lieben – und keine irdische Ordnung ist die eine von beiden.',
      en: 'Two cities, built out of two loves – and no earthly order is either of them.',
    },
    who: {
      de: '410 plündern die Goten Rom, zum ersten Mal seit achthundert Jahren, und die alte Religion bekommt einen Schuldigen: die Christen, die die Götter abgeschafft hätten. Augustinus antwortet mit zweiundzwanzig Büchern über dreizehn Jahre – die längste Streitschrift der Antike und zugleich ihre Abrechnung.',
      en: 'In 410 the Goths sack Rome, for the first time in eight hundred years, and the old religion finds a culprit: the Christians, who had abolished the gods. Augustine answers with twenty-two books over thirteen years – antiquity’s longest polemic and at the same time its reckoning.',
    },
    what: {
      de: 'Zuerst die Gegenrechnung: Rom hatte seine Katastrophen auch mit den Göttern. Dann der eigentliche Entwurf: Durch die Geschichte laufen zwei Gemeinwesen, unterschieden nicht durch Institutionen, sondern durch das, was sie lieben – „Eigenliebe bis zur Verachtung Gottes" und „Gottesliebe bis zur Verachtung seiner selbst". Sie sind vermischt und erst am Ende zu trennen. Dazwischen steht der berühmte Satz, Reiche ohne Gerechtigkeit seien große Räuberbanden.',
      en: 'First the counter-reckoning: Rome had its catastrophes with the gods as well. Then the real design: two commonwealths run through history, distinguished not by institutions but by what they love – "self-love to the contempt of God" and "love of God to the contempt of self". They are mixed and can be separated only at the end. In between stands the famous line that kingdoms without justice are large gangs of robbers.',
    },
    bible: {
      de: 'Das ist die erste Geschichtstheologie des Abendlandes, und sie wurde in beide Richtungen benutzt: als Freibrief der Kirche gegenüber den Staaten – und als deren schärfste Kritik, weil auch die Kirche nicht mit der Gottesstadt identisch ist. Luthers Zwei-Reiche-Lehre, die Trennung von Kirche und Staat, sogar Bonhoeffers Weigerung, den Staat für letztgültig zu halten, hängen an diesem Buch.',
      en: 'This is the West’s first theology of history, and it has been used in both directions: as the church’s licence over against states – and as their sharpest critique, since the church too is not identical with the city of God. Luther’s two-kingdoms doctrine, the separation of church and state, even Bonhoeffer’s refusal to treat the state as final, hang on this book.',
    },
    books: ['Gen', 'Rev', 'Rom'],
    links: [
      { to: 'platon-politeia', kind: 'against', de: 'Der gerechte Staat ist nicht zu bauen – erkennbar ist nur, welche Liebe eine Ordnung trägt.', en: 'The just state cannot be built – all that can be told is which love carries an order.' },
      { to: 'augustinus-confessiones', kind: 'builds', de: 'Dieselbe Unterscheidung, vom Einzelnen auf die Weltgeschichte gelegt.', en: 'The same distinction, laid from the single life onto world history.' },
    ],
    person: 'augustinus',
    wiki: 'De civitate Dei', wikiEn: 'The City of God',
  },
  {
    id: 'boethius-consolatio', kind: 'dialog',
    author: { de: 'Boethius', en: 'Boethius' },
    lived: { de: '480–524 n. Chr.', en: 'AD 480–524' },
    original: 'De consolatione philosophiae',
    de: 'Trost der Philosophie', en: 'The Consolation of Philosophy',
    shortDe: 'Der Trost', shortEn: 'The Consolation',
    period: 'spaetantike', year: 524, from: 523, to: 525,
    when: { de: '524 n. Chr., im Gefängnis', en: 'AD 524, in prison' },
    thesis: {
      de: 'Das Rad des Glücks dreht sich; was es nehmen kann, war nie deines.',
      en: 'Fortune’s wheel turns; what it can take was never yours.',
    },
    who: {
      de: 'Ein römischer Konsul, wegen Hochverrats verurteilt, schreibt in der Haft in Pavia, bevor er hingerichtet wird. Er hatte sich vorgenommen, Platon und Aristoteles vollständig ins Lateinische zu übersetzen; er kam bis zur Logik – und genau diese Bruchstücke waren dem Westen sechshundert Jahre lang die einzige griechische Philosophie.',
      en: 'A Roman consul, condemned for high treason, writes in custody at Pavia before his execution. He had set out to translate all of Plato and Aristotle into Latin; he got as far as the logic – and precisely those fragments were, for six hundred years, the West’s only Greek philosophy.',
    },
    what: {
      de: 'Die Philosophie erscheint als Frau am Bett des Gefangenen und nimmt ihm Schritt für Schritt die Klage aus der Hand: Das Glück hat nie versprochen zu bleiben; wahres Gut ist nicht wegzunehmen; und wenn Gott alles vorherweiß – die Frage, an der das Buch gipfelt –, ist der Mensch trotzdem frei, weil Gott nicht vorher, sondern in einem ewigen Jetzt sieht. Prosa und Gedicht wechseln sich ab: neununddreißig Gedichte in fünf Büchern.',
      en: 'Philosophy appears as a woman at the prisoner’s bedside and takes his complaint from him step by step: fortune never promised to stay; a true good cannot be removed; and if God foreknows everything – the question the book culminates in – a person is free nonetheless, because God does not see beforehand but in an eternal now. Prose and poem alternate: thirty-nine poems in five books.',
    },
    bible: {
      de: 'Auffällig ist, was fehlt: Kein Bibelvers, kein Christus, kein Gebet – von einem Christen geschrieben, der auch theologische Traktate verfasst hat. Ob das Ergebung ins Unvermeidliche ist oder eine bewusste Probe, wie weit die Vernunft allein trägt, ist bis heute umstritten. Das Mittelalter hat den Text trotzdem geliebt und immer wieder übersetzt – König Alfred, Notker, Chaucer, Elisabeth I.',
      en: 'What is striking is what is missing: no biblical verse, no Christ, no prayer – written by a Christian who also composed theological treatises. Whether that is resignation to the inevitable or a deliberate test of how far reason alone carries is disputed to this day. The Middle Ages loved the text all the same and translated it again and again – King Alfred, Notker, Chaucer, Elizabeth I.',
    },
    books: ['Job', 'Eccl', 'Ps'],
    disputed: true,
    links: [
      { to: 'plotin-enneaden', kind: 'builds', de: 'Das höchste Gut, an dem alles hängt – hier als Trost formuliert statt als Aufstieg.', en: 'The highest good on which everything hangs – here put as consolation rather than ascent.' },
    ],
    event: 'benedikt',
    wiki: 'Trost der Philosophie', wikiEn: 'The Consolation of Philosophy',
  },

  /* --- Mittelalter und Scholastik ----------------------------------------- */
  {
    id: 'anselm-proslogion', kind: 'traktat',
    author: { de: 'Anselm von Canterbury', en: 'Anselm of Canterbury' },
    lived: { de: '1033–1109', en: '1033–1109' },
    original: 'Proslogion',
    de: 'Proslogion', en: 'Proslogion',
    shortDe: 'Proslogion', shortEn: 'Proslogion',
    period: 'scholastik', year: 1078, from: 1077, to: 1078,
    when: { de: '1077/78', en: '1077/78' },
    thesis: {
      de: 'Ich glaube, um zu verstehen – und verstanden heißt: Gott lässt sich nicht als nicht-seiend denken.',
      en: 'I believe in order to understand – and understood means: God cannot be thought not to be.',
    },
    who: {
      de: 'Anselm ist Abt in der Normandie und schreibt für seine Mönche. Ein Jahr zuvor hatte er im Monologion Gott aus vielen Argumenten hergeleitet; jetzt sucht er das eine Argument, das ohne alle anderen auskommt, und schreibt selbst, die Suche habe ihn fast krank gemacht, bis es ihm während der Nachtwache kam.',
      en: 'Anselm is an abbot in Normandy writing for his monks. A year earlier, in the Monologion, he had derived God from many arguments; now he looks for the single argument that needs none of the others, and writes that the search nearly made him ill until it came to him during the night office.',
    },
    what: {
      de: 'Ein Gebet, in dessen zweitem Kapitel ein Beweis steht: Gott ist das, „worüber hinaus Größeres nicht gedacht werden kann". Wäre er nur im Verstand und nicht in Wirklichkeit, ließe sich Größeres denken – also ist er. Ein Mönch namens Gaunilo widersprach sofort: Nach dieser Art ließe sich auch eine vollkommene Insel herbeidenken. Anselm antwortete, und beide Texte stehen seither zusammen im selben Band.',
      en: 'A prayer in whose second chapter a proof stands: God is that "than which nothing greater can be thought". Were he only in the understanding and not in reality, something greater could be thought – therefore he is. A monk named Gaunilo objected at once: on this method a perfect island could be thought into being too. Anselm replied, and both texts have stood in the same volume ever since.',
    },
    bible: {
      de: 'Der Anfang ist ein Psalmvers: „Der Tor spricht in seinem Herzen: Es ist kein Gott" (Psalm 14,1) – der Beweis ist als Auslegung dieses Satzes gebaut. Kant hat das Argument neunhundert Jahre später zerlegt, weil Sein keine Eigenschaft ist; diskutiert wird es trotzdem bis heute. Anselms zweiter großer Satz, dass Gott Mensch werden musste, um die verletzte Ehre wiederherzustellen, steht in „Cur Deus homo" und prägt die westliche Kreuzestheologie bis in die Gegenwart.',
      en: 'It opens with a psalm verse: "the fool says in his heart, there is no God" (Psalm 14:1) – the proof is built as an exposition of that sentence. Kant took the argument apart nine hundred years later, because being is not a property; it is still debated all the same. Anselm’s other great claim, that God had to become human to restore violated honour, stands in Cur Deus homo and shapes Western theology of the cross to this day.',
    },
    books: ['Ps', 'Rom', 'John'],
    links: [
      { to: 'augustinus-confessiones', kind: 'builds', de: 'Augustins „Glaube, damit du verstehst", zu einem einzigen Argument zusammengezogen.', en: 'Augustine’s "believe so that you may understand", pulled together into a single argument.' },
    ],
    person: 'anselm', event: 'schisma',
    wiki: 'Proslogion', wikiEn: 'Proslogion',
  },
  {
    id: 'abaelard-sic-et-non', kind: 'traktat',
    author: { de: 'Petrus Abaelard', en: 'Peter Abelard' },
    lived: { de: '1079–1142', en: '1079–1142' },
    original: 'Sic et non',
    de: 'Ja und Nein', en: 'Yes and No',
    shortDe: 'Sic et non', shortEn: 'Sic et non',
    period: 'scholastik', year: 1120, from: 1115, to: 1130,
    when: { de: 'um 1120', en: 'c. 1120' },
    thesis: {
      de: 'Zweifeln führt zum Fragen, Fragen zur Wahrheit – auch dort, wo die Väter einander widersprechen.',
      en: 'Doubting leads to inquiry, inquiry to truth – even where the fathers contradict each other.',
    },
    who: {
      de: 'Der berühmteste und streitbarste Lehrer von Paris, dessen Leben wegen Héloïse bekannter ist als sein Werk. Zweimal wurde er verurteilt, einmal musste er sein eigenes Buch ins Feuer werfen. Dieses hier war sein Arbeitsbuch für den Unterricht.',
      en: 'The most famous and most combative teacher in Paris, whose life is better known, because of Héloïse, than his work. He was condemned twice, and once had to throw his own book into the fire. This one was his working textbook for teaching.',
    },
    what: {
      de: '158 Fragen, und zu jeder stellt Abaelard Zitate der Kirchenväter zusammen, die einander widersprechen – Ja und Nein, ohne Auflösung. Die Auflösung ist die Aufgabe des Lesers, und der Prolog erklärt die Regeln: auf Wortgebrauch achten, auf Zeitumstände, auf den Zusammenhang, auf spätere Widerrufe. Das ist in nuce die historisch-kritische Lektüre, vierhundert Jahre vor ihrem Namen.',
      en: 'One hundred and fifty-eight questions, and to each Abelard assembles quotations from the fathers that contradict one another – yes and no, with no resolution. The resolution is the reader’s task, and the prologue sets out the rules: watch the usage of words, the circumstances of the time, the context, later retractions. That is historical-critical reading in nuce, four hundred years before its name.',
    },
    bible: {
      de: 'Damit wird der Widerspruch in der Überlieferung zum Arbeitsmittel statt zum Skandal – und die Methode der Scholastik ist geboren: Frage, Einwände, Antwort, Erwiderung. Thomas von Aquin schreibt seine ganze Summe in dieser Form. Wer heute zwei Bibelstellen nebeneinanderlegt, die sich reiben, und daraus eine Frage macht statt einer Harmonisierung, arbeitet nach Abaelard.',
      en: 'With that, contradiction in the tradition becomes a working tool rather than a scandal – and the scholastic method is born: question, objections, answer, reply. Thomas Aquinas writes his entire Summa in that form. Anyone today who sets two biblical passages side by side where they grate and makes a question of it rather than a harmonisation is working after Abelard.',
    },
    books: ['Jas', 'Rom', 'Gal'],
    links: [
      { to: 'anselm-proslogion', kind: 'against', de: 'Nicht ein Argument aus dem Glauben heraus, sondern die Prüfung dessen, was der Glaube überliefert hat.', en: 'Not an argument out of faith, but the testing of what faith has handed down.' },
    ],
    wiki: 'Sic et non', wikiEn: 'Sic et Non',
  },
  {
    id: 'maimonides-more', kind: 'traktat',
    author: { de: 'Maimonides (Mose ben Maimon)', en: 'Maimonides (Moses ben Maimon)' },
    lived: { de: '1138–1204', en: '1138–1204' },
    original: 'דלאלה אלחאירין', translit: 'Dalālat al-ḥāʾirīn / More Nevuchim',
    de: 'Führer der Unschlüssigen', en: 'The Guide for the Perplexed',
    shortDe: 'More Nevuchim', shortEn: 'The Guide',
    period: 'scholastik', year: 1190, from: 1185, to: 1191,
    when: { de: 'um 1190', en: 'c. 1190' },
    thesis: {
      de: 'Über Gott lässt sich nur sagen, was er nicht ist – alles andere ist Sprache für Menschen.',
      en: 'Of God only what he is not can be said – everything else is language for human beings.',
    },
    who: {
      de: 'Arzt am Hof in Kairo, Oberhaupt der jüdischen Gemeinde und Verfasser des maßgeblichen Gesetzeskodex Mischne Tora, der im Gesetzesregal dieser Ansicht steht. Geschrieben ist der Führer auf Arabisch in hebräischen Buchstaben, als Brief an einen einzelnen Schüler, der an Philosophie und Schrift zugleich festhalten will und beides nicht zusammenbringt.',
      en: 'Court physician in Cairo, head of the Jewish community and author of the authoritative legal code Mishneh Torah, which stands on the legal shelf of this view. The Guide is written in Arabic in Hebrew letters, as a letter to a single student who wants to hold on to philosophy and scripture at once and cannot make them fit.',
    },
    what: {
      de: 'Zuerst die Sprache: Wo die Bibel von Gottes Hand, Zorn oder Herabsteigen redet, redet sie in Bildern; wer das wörtlich nimmt, hat einen Körper vergöttert. Dann die Grenze: Aussagen über Gott sind nur als Verneinungen zuverlässig. Dann der schwerste Teil – die Ewigkeit der Welt bei Aristoteles gegen die Schöpfung der Schrift, und Maimonides entscheidet sich für die Schöpfung, weil Aristoteles hier nicht beweise, sondern behaupte.',
      en: 'First language: where the Bible speaks of God’s hand, anger or coming down, it speaks in images; whoever takes that literally has deified a body. Then the limit: statements about God are reliable only as negations. Then the hardest part – Aristotle’s eternity of the world against scripture’s creation, and Maimonides decides for creation, because here Aristotle does not prove but assert.',
    },
    bible: {
      de: 'Das ist die schärfste Fassung der Frage, die auch jede christliche Auslegung trifft: Was heißt es, dass die Bibel menschlich redet? Thomas von Aquin zitiert „Rabbi Moses" mit Respekt und übernimmt die negative Theologie in Teilen. Und die jüdische Gemeinde stritt jahrzehntelang über das Buch – in Montpellier wurde es 1232 verbrannt, von Juden angezeigt und von Christen ins Feuer geworfen.',
      en: 'This is the sharpest form of a question that meets every Christian interpretation too: what does it mean that the Bible speaks humanly? Thomas Aquinas quotes "Rabbi Moses" with respect and takes over part of the negative theology. And the Jewish community argued over the book for decades – in Montpellier in 1232 it was burned, denounced by Jews and thrown into the fire by Christians.',
    },
    books: ['Exod', 'Gen', 'Isa'],
    links: [
      { to: 'aristoteles-metaphysik', kind: 'against', de: 'Aristoteles bis an die Grenze mitgehen – und an der Ewigkeit der Welt kehrtmachen.', en: 'Going with Aristotle up to the limit – and turning back at the eternity of the world.' },
    ],
    person: 'maimonides',
    wiki: 'Führer der Unschlüssigen', wikiEn: 'The Guide for the Perplexed',
  },
  {
    id: 'thomas-summa', kind: 'summe',
    author: { de: 'Thomas von Aquin', en: 'Thomas Aquinas' },
    lived: { de: '1225–1274', en: '1225–1274' },
    original: 'Summa theologiae',
    de: 'Summe der Theologie', en: 'Summa Theologiae',
    shortDe: 'Summa theologiae', shortEn: 'Summa',
    period: 'scholastik', year: 1270, from: 1265, to: 1274,
    when: { de: '1265–1273, unvollendet', en: '1265–1273, unfinished' },
    thesis: {
      de: 'Die Gnade hebt die Natur nicht auf, sondern vollendet sie.',
      en: 'Grace does not abolish nature but perfects it.',
    },
    who: {
      de: 'Ein Dominikaner, den die Mitstudenten „den stummen Ochsen" nannten, schreibt ein Lehrbuch für Anfänger – und es wird das größte Bauwerk der mittelalterlichen Theologie. Möglich wurde es durch eine Übersetzungswelle: Aristoteles kam über arabische Vermittlung nach Paris zurück und war dort zeitweise verboten. Thomas nimmt gerade ihn zur Grundlage. Am 6. Dezember 1273 bricht er mitten im Text ab: Alles, was er geschrieben habe, komme ihm vor wie Stroh.',
      en: 'A Dominican whose fellow students called him "the dumb ox" writes a textbook for beginners – and it becomes the largest structure of medieval theology. It was made possible by a wave of translation: Aristotle came back to Paris through Arabic mediation and was at times banned there. Thomas takes precisely him as his foundation. On 6 December 1273 he breaks off mid-text: everything he has written seems to him like straw.',
    },
    what: {
      de: 'Über 500 Fragen in mehr als 2600 Artikeln, jeder nach demselben Muster: Einwände, „Dagegen steht", die Antwort, die Erwiderung auf jeden Einwand. Der Aufbau ist ein Kreis – von Gott aus, über den Menschen, der zu ihm zurückkehrt, zu Christus als dem Weg. Am Anfang stehen die fünf Wege, Gott aus Bewegung, Ursache, Möglichkeit, Stufung und Zielstrebigkeit der Welt zu erschließen.',
      en: 'Over 500 questions in more than 2,600 articles, each on the same pattern: objections, "on the contrary", the answer, the reply to each objection. The structure is a circle – out from God, through the human being returning to him, to Christ as the way. At the start stand the five ways of inferring God from motion, causation, possibility, degrees and the goal-directedness of the world.',
    },
    bible: {
      de: 'Hier wird entschieden, dass Vernunft und Offenbarung nicht zwei Wahrheiten sind, sondern zwei Wege zu einer – die Grundlage jeder natürlichen Theologie und jedes Gesprächs zwischen Glaube und Wissenschaft, das nicht mit einem Verbot endet. Die Reformation hat den Satz von der vollendeten Natur bestritten, weil sie den Menschen für tiefer beschädigt hielt. Leo XIII. erklärte Thomas 1879 zur verbindlichen Grundlage katholischer Lehre.',
      en: 'Here it is settled that reason and revelation are not two truths but two paths to one – the ground of every natural theology and of every conversation between faith and science that does not end in a prohibition. The Reformation disputed the claim about perfected nature, holding humanity to be more deeply damaged. In 1879 Leo XIII declared Thomas the binding basis of Catholic teaching.',
    },
    books: ['Rom', 'John', 'Exod'],
    links: [
      { to: 'aristoteles-metaphysik', kind: 'builds', de: 'Der unbewegte Beweger wird zum ersten der fünf Wege – Aristoteles als Grundriss einer christlichen Summe.', en: 'The unmoved mover becomes the first of the five ways – Aristotle as the ground plan of a Christian summa.' },
      { to: 'abaelard-sic-et-non', kind: 'builds', de: 'Jeder der 2600 Artikel ist nach Abaelards Form gebaut: Einwände zuerst, Antwort zuletzt.', en: 'Each of the 2,600 articles is built on Abelard’s form: objections first, answer last.' },
      { to: 'maimonides-more', kind: 'builds', de: 'Thomas zitiert „Rabbi Moses" mit Respekt und übernimmt seine Vorsicht im Reden über Gott.', en: 'Thomas quotes "Rabbi Moses" with respect and takes over his caution in speaking of God.' },
    ],
    event: 'franziskus',
    wiki: 'Summa theologiae', wikiEn: 'Summa Theologica',
  },
  {
    id: 'eckhart-predigten', kind: 'essay',
    author: { de: 'Meister Eckhart', en: 'Meister Eckhart' },
    lived: { de: '1260–1328', en: '1260–1328' },
    original: 'Die deutschen Predigten',
    de: 'Die deutschen Predigten', en: 'The German Sermons',
    shortDe: 'Dt. Predigten', shortEn: 'German Sermons',
    period: 'scholastik', year: 1310, from: 1294, to: 1328,
    when: { de: 'um 1294–1328', en: 'c. 1294–1328' },
    thesis: {
      de: 'Im Grund der Seele ist etwas, das mit Gott so nah verwandt ist, dass es eins ist und nicht vereint.',
      en: 'In the ground of the soul is something so akin to God that it is one with him, not united to him.',
    },
    who: {
      de: 'Dominikanerprovinzial und Pariser Magister, der seine schwierigsten Gedanken nicht auf Latein vor Gelehrten sagt, sondern auf Deutsch vor Nonnen und Laien – und dafür eine Sprache erfinden muss. Wörter wie „Einheit", „Wesen", „Eigenschaft", „Bildung" sind teils seine Prägungen. 1329, ein Jahr nach seinem Tod, verurteilt eine Bulle 28 Sätze aus seinem Werk.',
      en: 'A Dominican provincial and Paris master who says his hardest thoughts not in Latin before scholars but in German before nuns and lay people – and has to invent a language for it. Words like "unity", "essence", "property", "formation" are partly his coinages. In 1329, a year after his death, a papal bull condemns twenty-eight sentences from his work.',
    },
    what: {
      de: 'Predigten über Bibelverse, die den Vers aufbrechen, bis eine einzige Bewegung übrig bleibt: loslassen. Gelassenheit heißt bei ihm nicht Ruhe, sondern das Lassen der eigenen Bilder von Gott – „Ich bitte Gott, dass er mich Gottes quitt mache." Die Geburt des Wortes geschieht nicht nur in Bethlehem, sondern im Grund der Seele, und zwar jetzt.',
      en: 'Sermons on biblical verses that break the verse open until a single movement remains: letting go. Releasement, for him, is not calm but the letting go of one’s own images of God – "I pray God to rid me of God." The birth of the Word happens not only in Bethlehem but in the ground of the soul, and it happens now.',
    },
    bible: {
      de: 'Eine ganze Linie hängt daran: Tauler, Seuse, die Theologia deutsch – die Luther herausgab und nach eigenem Wort neben Bibel und Augustinus stellte –, später der Pietismus, Angelus Silesius, Schleiermachers Gefühl und im 20. Jahrhundert die Rede vom Ungrund bei Tillich. Eckharts Grenze ist mit den Jahrhunderten mitgewandert: Dass jemand zu nah an die Ununterscheidbarkeit von Gott und Seele gerät, bleibt der Vorwurf.',
      en: 'A whole line hangs on it: Tauler, Suso, the Theologia Germanica – which Luther published and said he set beside the Bible and Augustine – later Pietism, Angelus Silesius, Schleiermacher’s feeling, and in the 20th century Tillich’s talk of the ground of being. Eckhart’s border has travelled with the centuries: the charge of coming too close to making God and soul indistinguishable stays.',
    },
    books: ['John', 'Luke', 'Song'],
    links: [
      { to: 'plotin-enneaden', kind: 'echoes', de: 'Der Weg nach innen und der Gott jenseits aller Begriffe – auf Deutsch, von der Kanzel.', en: 'The inward way and the God beyond all concepts – in German, from the pulpit.' },
      { to: 'thomas-summa', kind: 'against', de: 'Derselbe Orden, der andere Weg: nicht das Begreifen Gottes, sondern das Lassen der Begriffe.', en: 'The same order, the other road: not the grasping of God but the letting go of concepts.' },
    ],
    wiki: 'Meister Eckhart', wikiEn: 'Meister Eckhart',
  },
  {
    id: 'ockham-summa-logicae', kind: 'summe',
    author: { de: 'Wilhelm von Ockham', en: 'William of Ockham' },
    lived: { de: '1287–1347', en: '1287–1347' },
    original: 'Summa logicae',
    de: 'Summe der Logik', en: 'Summa Logicae',
    shortDe: 'Summa logicae', shortEn: 'Summa Logicae',
    period: 'scholastik', year: 1323, from: 1320, to: 1327,
    when: { de: 'um 1323', en: 'c. 1323' },
    thesis: {
      de: 'Es gibt nur Einzelnes. Alles Allgemeine ist ein Zeichen, keine Sache.',
      en: 'Only individuals exist. Everything general is a sign, not a thing.',
    },
    who: {
      de: 'Ein englischer Franziskaner, der wegen Häresieverdachts vier Jahre in Avignon auf sein Verfahren wartet, 1328 flieht und beim Kaiser Zuflucht findet, gegen den Papst schreibt und in München stirbt. Sein Name steht heute für einen Grundsatz, den er in dieser Form nie formuliert hat: Man solle nicht mehr annehmen als nötig – Ockhams Rasiermesser.',
      en: 'An English Franciscan who waits four years in Avignon for his heresy trial, flees in 1328, finds refuge with the emperor, writes against the pope and dies in Munich. His name today stands for a principle he never formulated in that form: do not assume more than necessary – Ockham’s razor.',
    },
    what: {
      de: 'Ein Lehrbuch der Logik, das eine Metaphysik umstürzt: Gattungen und Arten existieren nicht außerhalb des Verstandes, sie sind Namen für Ähnliches. Was bleibt, sind einzelne Dinge und die Zeichen, mit denen wir über sie reden. Daraus folgt: Über Gott ist mit Vernunft fast nichts auszumachen – er ist frei, absolut frei, und die Welt hätte auch ganz anders sein können.',
      en: 'A textbook of logic that overturns a metaphysics: genera and species do not exist outside the mind, they are names for what resembles. What remain are individual things and the signs with which we speak of them. From this it follows that reason establishes almost nothing about God – he is free, absolutely free, and the world could have been quite otherwise.',
    },
    bible: {
      de: 'Das ist das Ende der großen Synthese und der Anfang zweier Wege: Naturwissenschaft, die einzelne Dinge beobachtet statt Wesenheiten zu ordnen – und eine Theologie, die sich nicht mehr auf Beweise, sondern auf Gottes Wort und Zusage stützt. Luther wurde in dieser Schule ausgebildet und nennt Ockham „meinen lieben Meister"; dass Glaube nicht Schluss, sondern Vertrauen ist, hat hier seine Vorgeschichte.',
      en: 'This is the end of the great synthesis and the beginning of two roads: a natural science that observes individual things rather than ordering essences – and a theology that no longer leans on proofs but on God’s word and promise. Luther was trained in this school and calls Ockham "my dear master"; that faith is trust rather than inference has its prehistory here.',
    },
    books: ['Rom', 'Heb', 'Gen'],
    links: [
      { to: 'thomas-summa', kind: 'against', de: 'Wo Thomas die Welt als geordnetes Gefüge von Wesenheiten liest, stehen für Ockham nur Einzeldinge da.', en: 'Where Thomas reads the world as an ordered fabric of essences, for Ockham only individual things stand there.' },
    ],
    wiki: 'Wilhelm von Ockham', wikiEn: 'William of Ockham',
  },

  /* --- Renaissance und Reformation ---------------------------------------- */
  {
    id: 'cusanus-docta', kind: 'traktat',
    author: { de: 'Nikolaus von Kues', en: 'Nicholas of Cusa' },
    lived: { de: '1401–1464', en: '1401–1464' },
    original: 'De docta ignorantia',
    de: 'Die belehrte Unwissenheit', en: 'On Learned Ignorance',
    shortDe: 'Docta ignorantia', shortEn: 'Learned Ignorance',
    period: 'renaissance', year: 1440, from: 1438, to: 1440,
    when: { de: '1440', en: '1440' },
    thesis: {
      de: 'Wer weiß, dass er Gott nicht fassen kann, weiß von ihm am meisten.',
      en: 'Whoever knows that God cannot be grasped knows most about him.',
    },
    who: {
      de: 'Ein Kardinal auf der Rückfahrt von Konstantinopel, wo er über die Wiedervereinigung der Kirchen verhandelt hatte, schreibt auf dem Schiff den Gedanken auf, der ihm unterwegs kam. Dreizehn Jahre später, nach dem Fall der Stadt an die Osmanen, schreibt derselbe Mann „Vom Frieden im Glauben" – ein Gespräch der Religionen vor Gottes Thron.',
      en: 'A cardinal on the voyage home from Constantinople, where he had negotiated over the reunion of the churches, writes down on board the thought that came to him on the way. Thirteen years later, after the city falls to the Ottomans, the same man writes On the Peace of Faith – a conversation of the religions before God’s throne.',
    },
    what: {
      de: 'In Gott fallen die Gegensätze zusammen: das Größte und das Kleinste, die Gerade und der Kreis, wenn man sie nur unendlich denkt. Wissen ist Messen, und das Unendliche hat kein Maß – also endet Erkenntnis nicht im Satz, sondern in einer belehrten Unwissenheit. Nebenbei fällt der Satz, das Weltall habe seinen Mittelpunkt überall und seinen Umfang nirgends, und die Erde sei kein Mittelpunkt: hundert Jahre vor Kopernikus, ohne Fernrohr, aus reiner Überlegung.',
      en: 'In God the opposites coincide: greatest and smallest, straight line and circle, if only they are thought as infinite. Knowing is measuring, and the infinite has no measure – so knowledge ends not in a proposition but in a learned ignorance. In passing comes the claim that the universe has its centre everywhere and its circumference nowhere, and that the earth is no centre: a hundred years before Copernicus, without a telescope, out of sheer reasoning.',
    },
    bible: {
      de: 'Das ist die letzte große Gestalt der negativen Theologie vor der Neuzeit – und zugleich schon deren Vorbote: Wenn kein Standpunkt der Mittelpunkt ist, ist auch keine Auslegung die abschließende. Cusanus zieht daraus keinen Relativismus, sondern eine Haltung, mit der er als einer der wenigen seiner Zeit über Islam und Judentum redet, ohne Bekehrung vorauszusetzen.',
      en: 'This is the last great shape of negative theology before the modern age – and at once its herald: if no standpoint is the centre, then no interpretation is the final one. Cusanus draws from it not relativism but a stance in which he, almost alone in his time, speaks of Islam and Judaism without presupposing conversion.',
    },
    books: ['Exod', '1Cor', 'John'],
    links: [
      { to: 'eckhart-predigten', kind: 'builds', de: 'Eckharts Unsagbarkeit, in eine Mathematik des Unendlichen übersetzt.', en: 'Eckhart’s unsayability, translated into a mathematics of the infinite.' },
      { to: 'plotin-enneaden', kind: 'echoes', de: 'Das Eine jenseits aller Bestimmung, noch einmal – und diesmal mit dem Zirkel nachgezeichnet.', en: 'The One beyond all determination once more – this time traced with a compass.' },
    ],
    event: 'gutenberg',
    wiki: 'De docta ignorantia', wikiEn: 'De Docta Ignorantia',
  },
  {
    id: 'erasmus-diatribe', kind: 'traktat',
    author: { de: 'Erasmus von Rotterdam', en: 'Erasmus of Rotterdam' },
    lived: { de: '1466–1536', en: '1466–1536' },
    original: 'De libero arbitrio diatribe',
    de: 'Vom freien Willen', en: 'On Free Will',
    shortDe: 'Vom freien Willen', shortEn: 'Free Will',
    period: 'renaissance', year: 1524, from: 1524, to: 1524,
    when: { de: '1524', en: '1524' },
    thesis: {
      de: 'Ein Rest von Freiheit muss bleiben, sonst ist jede Ermahnung der Schrift ein Hohn.',
      en: 'Some remnant of freedom must remain, or every exhortation in scripture is a mockery.',
    },
    who: {
      de: 'Der berühmteste Gelehrte Europas, der 1516 das griechische Neue Testament herausgegeben hatte – die Textgrundlage, aus der Luther übersetzte –, schreibt nach sieben Jahren Schweigen gegen Luther, gedrängt von Rom und England. Er tut es widerwillig und wählt die Form der Diatribe: eine Erwägung, keine Kampfschrift.',
      en: 'Europe’s most famous scholar, who in 1516 had published the Greek New Testament – the text base from which Luther translated – writes against Luther after seven years of silence, pressed by Rome and England. He does it unwillingly and chooses the form of a diatribe: a weighing, not a battle piece.',
    },
    what: {
      de: 'Erasmus sammelt die Stellen, an denen die Schrift wählen heißt – „Ich habe dir Leben und Tod vorgelegt: So wähle das Leben" –, und fragt, wozu die Aufforderung stünde, wenn niemand könnte. Dazu eine methodische Warnung: Manches in der Schrift sei dunkel, und über Dunkles solle man nicht mit Gewissheit streiten. Der freie Wille, den er verteidigt, ist klein – ein Zuwenden, mehr nicht.',
      en: 'Erasmus gathers the passages where scripture says choose – "I have set before you life and death: therefore choose life" – and asks what the summons would be for if no one could. With it a methodological warning: some things in scripture are obscure, and about obscure things one should not argue with certainty. The free will he defends is small – a turning toward, no more.',
    },
    bible: {
      de: 'Der Streit, den dieses Heft auslöst, ist der Kern der Reformation, nicht der Ablass: Wieviel kann ein Mensch zu seinem Heil beitragen? Und mit ihm steht eine zweite Frage im Raum, die bis heute jede Bibelarbeit betrifft – ob die Schrift in sich klar ist oder eine auslegende Autorität braucht. Erasmus blieb katholisch, ohne je Luther zu denunzieren, und wurde von beiden Seiten als lau verachtet.',
      en: 'The quarrel this pamphlet sets off is the core of the Reformation, not indulgences: how much can a person contribute to their own salvation? And with it a second question is in the room that touches every Bible study to this day – whether scripture is clear in itself or needs an interpreting authority. Erasmus stayed Catholic without ever denouncing Luther, and was despised by both sides as lukewarm.',
    },
    books: ['Deut', 'Rom', 'Matt'],
    links: [
      { to: 'aristoteles-ethik', kind: 'builds', de: 'Tugend will geübt sein – und Üben setzt voraus, dass etwas in der eigenen Macht steht.', en: 'Virtue must be practised – and practice presupposes that something lies in one’s own power.' },
    ],
    event: 'thesen',
    wiki: 'De libero arbitrio', wikiEn: 'De libero arbitrio (Erasmus)',
  },
  {
    id: 'luther-servo', kind: 'traktat',
    author: { de: 'Martin Luther', en: 'Martin Luther' },
    lived: { de: '1483–1546', en: '1483–1546' },
    original: 'De servo arbitrio',
    de: 'Vom unfreien Willen', en: 'On the Bondage of the Will',
    shortDe: 'Unfreier Wille', shortEn: 'Bondage of Will',
    period: 'renaissance', year: 1525, from: 1525, to: 1526,
    when: { de: 'Dezember 1525', en: 'December 1525' },
    thesis: {
      de: 'Der Wille ist ein Reittier – geritten wird er, und er sucht sich den Reiter nicht aus.',
      en: 'The will is a beast ridden – ridden it is, and it does not choose its rider.',
    },
    who: {
      de: 'Luther antwortet ein Jahr später, im Jahr des Bauernkriegs, und er antwortet gern: Erasmus habe als Einziger die Sache selbst getroffen und nicht die Nebendinge – Papsttum, Fegefeuer, Ablass. Von seinen Schriften ließ er später nur zwei gelten, den Katechismus und diese.',
      en: 'Luther answers a year later, in the year of the Peasants’ War, and answers gladly: Erasmus alone, he says, has hit the thing itself and not the side issues – papacy, purgatory, indulgences. Of his own writings he later let only two stand, the catechism and this one.',
    },
    what: {
      de: 'Eine Abrechnung Satz für Satz: Wenn Gott alles weiß und wirkt, ist der Wille des Menschen in Heilsdingen nicht frei, sondern gebunden – von Gott oder vom Bösen geritten. Die Ermahnungen der Schrift zeigen nicht, was wir können, sondern was wir sollen und nicht können. Und gegen Erasmus’ Skepsis steht der schärfste Satz des Buches: „Nimm die Behauptungen weg, und du hast das Christentum weggenommen."',
      en: 'A settling of accounts sentence by sentence: if God knows and works everything, the human will in matters of salvation is not free but bound – ridden by God or by the evil one. Scripture’s exhortations show not what we can do but what we ought to do and cannot. And against Erasmus’s scepticism stands the book’s sharpest line: "Take away assertions, and you have taken away Christianity."',
    },
    bible: {
      de: 'Hier steht, was die Reformation von der Scholastik trennt, in einem Satz: Nicht die Gnade vollendet die Natur, sondern sie ersetzt, was verloren ist. Der protestantische Umgang mit der Bibel hängt daran – Klarheit der Schrift, Rechtfertigung allein aus Glauben, Misstrauen gegen jede Leistung. Und die härteste Stelle des Buches, Gott könne verwerfen, wen er wolle, hat schon die eigene Seite nie ganz übernommen: Melanchthon rückte davon ab.',
      en: 'Here stands, in one sentence, what separates the Reformation from scholasticism: grace does not perfect nature, it replaces what is lost. The Protestant handling of the Bible hangs on it – clarity of scripture, justification by faith alone, suspicion of every achievement. And the book’s hardest passage, that God may reject whom he will, was never wholly adopted even on his own side: Melanchthon moved away from it.',
    },
    books: ['Rom', 'Exod', 'John'],
    links: [
      { to: 'erasmus-diatribe', kind: 'against', de: 'Die Gegenrede, um deretwillen beide Texte nur zusammen zu lesen sind.', en: 'The rejoinder for the sake of which both texts can only be read together.' },
      { to: 'augustinus-confessiones', kind: 'builds', de: 'Der späte Augustinus gegen Pelagius – Luther nimmt diesen Streit noch einmal auf.', en: 'The late Augustine against Pelagius – Luther takes up that quarrel once more.' },
      { to: 'ockham-summa-logicae', kind: 'builds', de: 'Die Schule, in der Luther gelernt hat: Gott ist nicht abzuleiten, sondern zu hören.', en: 'The school Luther was trained in: God is not to be inferred but to be heard.' },
    ],
    person: 'luther', event: 'thesen',
    wiki: 'De servo arbitrio', wikiEn: 'On the Bondage of the Will',
  },
  {
    id: 'montaigne-essais', kind: 'essay',
    author: { de: 'Michel de Montaigne', en: 'Michel de Montaigne' },
    lived: { de: '1533–1592', en: '1533–1592' },
    original: 'Essais',
    de: 'Essais', en: 'Essays',
    shortDe: 'Essais', shortEn: 'Essays',
    period: 'renaissance', year: 1580, from: 1572, to: 1592,
    when: { de: '1580, erweitert bis 1592', en: '1580, expanded to 1592' },
    thesis: {
      de: 'Was weiß ich schon? – und warum sollte ich es nicht zugeben.',
      en: 'What do I know? – and why should I not admit it.',
    },
    who: {
      de: 'Ein Adliger zieht sich mit achtunddreißig auf sein Schloss in der Dordogne zurück, mitten in den französischen Religionskriegen, in denen Katholiken und Hugenotten einander umbringen. Er erfindet dabei eine Textform, die es nicht gab, und nennt sie „Versuche": Selbstprüfungen ohne Abschluss.',
      en: 'A nobleman withdraws at thirty-eight to his estate in the Dordogne, in the middle of the French wars of religion, in which Catholics and Huguenots are killing each other. In doing so he invents a form of text that did not exist and calls it "attempts": self-examinations without conclusion.',
    },
    what: {
      de: 'Hundertsieben Kapitel über alles – über Trauer, Daumen, Kannibalen, das Sterben, sein eigenes Gedächtnis. Der Kern ist die lange „Apologie für Raymond Sebond": Die Vernunft ist schwächer, als sie glaubt; Tiere können, was wir nicht können; unsere Gewissheiten sind Gewohnheiten. Die Devise auf seiner Medaille lautet: Was weiß ich?',
      en: 'One hundred and seven chapters about everything – grief, thumbs, cannibals, dying, his own memory. At the core is the long "Apology for Raymond Sebond": reason is weaker than it believes; animals can do what we cannot; our certainties are habits. The device on his medal reads: what do I know?',
    },
    bible: {
      de: 'Zweierlei geht von hier aus. Erstens der Zweifel als Methode: Descartes und Pascal lesen Montaigne, und beide antworten ihm – der eine mit einem unbezweifelbaren Punkt, der andere mit der Wette. Zweitens die Toleranz aus Selbsterkenntnis: Wer weiß, wie wenig er weiß, verbrennt niemanden für eine Lehrmeinung. In einem Jahrhundert der Glaubenskriege ist das ein theologischer Satz, auch ohne einen Bibelvers darüber.',
      en: 'Two things proceed from here. First, doubt as method: Descartes and Pascal read Montaigne, and both answer him – one with an indubitable point, the other with the wager. Second, tolerance out of self-knowledge: whoever knows how little he knows burns nobody for a doctrine. In a century of religious wars that is a theological statement, even without a biblical verse over it.',
    },
    books: ['Eccl', 'Job', 'Prov'],
    links: [
      { to: 'seneca-lucilius', kind: 'echoes', de: 'Montaigne liest Seneca und Plutarch täglich – und schreibt ihre Übungen als eigene Erfahrung neu.', en: 'Montaigne reads Seneca and Plutarch daily – and rewrites their exercises as his own experience.' },
    ],
    wiki: 'Essais (Montaigne)', wikiEn: 'Essays (Montaigne)',
  },
  {
    id: 'descartes-meditationes', kind: 'traktat',
    author: { de: 'René Descartes', en: 'René Descartes' },
    lived: { de: '1596–1650', en: '1596–1650' },
    original: 'Meditationes de prima philosophia',
    de: 'Meditationen über die erste Philosophie', en: 'Meditations on First Philosophy',
    shortDe: 'Meditationen', shortEn: 'Meditations',
    period: 'renaissance', year: 1641, from: 1639, to: 1642,
    when: { de: '1641', en: '1641' },
    thesis: {
      de: 'Alles lässt sich bezweifeln – außer, dass da einer zweifelt.',
      en: 'Everything can be doubted – except that someone is doing the doubting.',
    },
    who: {
      de: 'Ein französischer Offizier und Mathematiker, der in den Niederlanden lebt, weil man dort ungestörter denken kann. Galileis Verurteilung 1633 hatte ihn erschreckt genug, um ein fertiges Buch zurückzuhalten. Die Meditationen erscheinen mit sechs Sammlungen von Einwänden – Caterus, Hobbes, Arnauld, Gassendi und zwei von Mersenne zusammengetragenen – und seinen Antworten im selben Band: ein gedruckter Streit als Teil des Werkes.',
      en: 'A French officer and mathematician living in the Netherlands because one can think there with less interference. Galileo’s condemnation in 1633 had frightened him enough to hold back a finished book. The Meditations appear with six sets of objections – from Caterus, Hobbes, Arnauld, Gassendi and two gathered by Mersenne – and his replies in the same volume: a printed argument as part of the work.',
    },
    what: {
      de: 'Sechs Tage Gedankengang: Erst wird alles abgeräumt – die Sinne täuschen, der Traum ist nicht vom Wachen zu unterscheiden, und vielleicht täuscht ein böser Geist in allem. Übrig bleibt ein Punkt: Wer getäuscht wird, ist. Von dort baut Descartes wieder auf, und der erste Baustein ist Gott, dessen Wahrhaftigkeit die Brücke zur Außenwelt trägt. Dass dieser Schritt trägt, hat kaum jemand geglaubt.',
      en: 'Six days of argument: first everything is cleared away – the senses deceive, dreaming cannot be told from waking, and perhaps an evil spirit deceives in everything. One point remains: whoever is deceived is. From there Descartes builds again, and the first block is God, whose truthfulness carries the bridge to the outer world. Almost no one has believed that this step holds.',
    },
    bible: {
      de: 'Ab hier steht das Ich am Anfang und nicht mehr Gott, und die Theologie hat darauf zweihundert Jahre lang geantwortet, meist ohne es zu merken: Gottesbeweise werden zu Antworten auf Zweifel, Glaube wird zur Frage nach Gewissheit, Offenbarung muss sich vor einem prüfenden Bewusstsein ausweisen. Pascal, der Descartes kannte, hat den Einwand in einem Satz notiert: „unnütz und ungewiss".',
      en: 'From here on the I stands at the beginning and no longer God, and theology answered that for two hundred years, mostly without noticing: proofs of God become answers to doubt, faith becomes a question of certainty, revelation has to show its credentials before an examining consciousness. Pascal, who knew Descartes, noted the objection in one phrase: "useless and uncertain".',
    },
    books: ['Gen', 'Job', 'John'],
    links: [
      { to: 'montaigne-essais', kind: 'against', de: 'Der Zweifel wird von der Haltung zum Werkzeug – und hat am Ende einen Boden, den Montaigne bestritt.', en: 'Doubt turns from a stance into a tool – and ends with a floor Montaigne denied.' },
      { to: 'augustinus-confessiones', kind: 'echoes', de: '„Wenn ich mich täusche, bin ich" steht schon bei Augustinus; der Weg nach innen ist derselbe, das Ziel nicht.', en: '"If I am deceived, I am" is already in Augustine; the inward road is the same, the destination is not.' },
    ],
    wiki: 'Meditationes de prima philosophia', wikiEn: 'Meditations on First Philosophy',
  },
  {
    id: 'pascal-pensees', kind: 'aphorismen',
    author: { de: 'Blaise Pascal', en: 'Blaise Pascal' },
    lived: { de: '1623–1662', en: '1623–1662' },
    original: 'Pensées',
    de: 'Gedanken', en: 'Pensées',
    shortDe: 'Pensées', shortEn: 'Pensées',
    period: 'aufklaerung', year: 1670, from: 1656, to: 1670,
    when: { de: 'geschrieben 1656–1662, gedruckt 1670', en: 'written 1656–1662, printed 1670' },
    thesis: {
      de: 'Das Herz hat Gründe, die der Verstand nicht kennt.',
      en: 'The heart has reasons that reason does not know.',
    },
    who: {
      de: 'Mathematiker, Erfinder der Rechenmaschine und der ersten Buslinie von Paris, mit einunddreißig ein Mann mit einer Nacht, die alles ändert: Am 23. November 1654 schreibt er zwei Stunden lang auf ein Blatt, das er danach in sein Wams einnäht und bis zum Tod trägt – „Feuer. Gott Abrahams, Gott Isaaks, Gott Jakobs, nicht der Philosophen und Gelehrten." Die Pensées sind die Zettel zu einer Verteidigung des Glaubens, die er nicht mehr schreiben konnte.',
      en: 'A mathematician, inventor of the calculating machine and of the first bus line in Paris, and at thirty-one a man with one night that changes everything: on 23 November 1654 he writes for two hours on a sheet he then sews into his coat and carries until his death – "Fire. God of Abraham, God of Isaac, God of Jacob, not of the philosophers and scholars." The Pensées are the notes for a defence of faith he did not live to write.',
    },
    what: {
      de: 'Hunderte von Fragmenten über die Zerrissenheit des Menschen: ein Schilfrohr, aber ein denkendes; elend, weil er einmal groß war. Das Unglück komme daher, dass niemand allein in einem Zimmer bleiben kann, und alles Getriebe sei Zerstreuung davor. Darin eingebettet die Wette: Wer auf Gott setzt und verliert, verliert nichts; wer nicht setzt, hat schon gewählt.',
      en: 'Hundreds of fragments on the human being’s dividedness: a reed, but a thinking one; wretched because he was once great. Unhappiness comes, he writes, from no one being able to stay alone in a room, and all our bustle is diversion from that. Embedded in it is the wager: whoever bets on God and loses, loses nothing; whoever does not bet has already chosen.',
    },
    bible: {
      de: 'Pascal ist die schärfste Gegenrede gegen die Gottesbeweise aus dem eigenen Lager: Nicht weil sie falsch wären, sondern weil sie am Menschen vorbeigehen. Ein Gott, der sich beweisen lässt, ist nicht der, der redet. Kierkegaard, Dostojewski und die Dialektische Theologie kommen von hier – und der Satz vom verborgenen Gott, den er aus Jesaja 45 nimmt, ist zu einem Grundwort der neueren Theologie geworden.',
      en: 'Pascal is the sharpest rejoinder to the proofs of God from within his own camp: not because they are false but because they pass the human being by. A God who can be proved is not the one who speaks. Kierkegaard, Dostoevsky and dialectical theology come from here – and the phrase about the hidden God, taken from Isaiah 45, has become a key term of modern theology.',
    },
    books: ['Isa', 'Rom', 'Eccl'],
    links: [
      { to: 'descartes-meditationes', kind: 'against', de: '„Descartes unnütz und ungewiss": Ein bewiesener Gott ist nicht der, dem man sich anvertraut.', en: '"Descartes useless and uncertain": a proved God is not the one to whom one entrusts oneself.' },
      { to: 'montaigne-essais', kind: 'builds', de: 'Pascal übernimmt Montaignes Blick auf den Menschen – und findet ihn ohne Gott unerträglich.', en: 'Pascal takes over Montaigne’s view of the human being – and finds it unbearable without God.' },
    ],
    wiki: 'Pensées', wikiEn: 'Pensées',
  },
  {
    id: 'spinoza-ttp', kind: 'traktat',
    author: { de: 'Baruch de Spinoza', en: 'Baruch Spinoza' },
    lived: { de: '1632–1677', en: '1632–1677' },
    original: 'Tractatus theologico-politicus',
    de: 'Theologisch-politischer Traktat', en: 'Theological-Political Treatise',
    shortDe: 'Spinozas Traktat', shortEn: 'Spinoza Treatise',
    period: 'aufklaerung', year: 1670, from: 1665, to: 1670,
    when: { de: '1670, anonym erschienen', en: '1670, published anonymously' },
    thesis: {
      de: 'Die Bibel ist aus sich selbst zu erklären – wie jedes andere alte Buch auch.',
      en: 'Scripture is to be explained out of itself – like any other ancient book.',
    },
    who: {
      de: 'Mit vierundzwanzig wird Spinoza aus der jüdischen Gemeinde Amsterdams ausgeschlossen, mit dem härtesten Bann, den ihre Akten kennen. Er lebt danach vom Schleifen optischer Linsen, lehnt einen Lehrstuhl in Heidelberg ab und veröffentlicht diesen Traktat ohne Namen, mit falschem Verlagsort. 1674 wird er verboten; seine Ethik erscheint erst nach seinem Tod.',
      en: 'At twenty-four Spinoza is expelled from the Jewish community of Amsterdam, with the harshest ban their records know. He lives afterwards by grinding optical lenses, declines a chair at Heidelberg, and publishes this treatise without his name and with a false place of publication. In 1674 it is banned; his Ethics appears only after his death.',
    },
    what: {
      de: 'Zwei Hälften, und beide waren Sprengstoff. Die erste liest die Bibel historisch: Prophetie ist Einbildungskraft, Wunder sind Naturvorgänge, die man nicht versteht, und die fünf Bücher Mose stammen nicht von Mose – Spinoza führt die Widersprüche vor, auf die schon Ibn Esra vorsichtig gedeutet hatte. Die zweite folgert politisch: Wenn die Schrift nur Gehorsam und Nächstenliebe lehrt, darf der Staat über Meinungen nicht verfügen. Der Untertitel verlangt Freiheit des Philosophierens.',
      en: 'Two halves, and both were explosive. The first reads the Bible historically: prophecy is imagination, miracles are natural processes not understood, and the five books of Moses are not by Moses – Spinoza lays out the contradictions Ibn Ezra had cautiously pointed to. The second draws the political conclusion: if scripture teaches only obedience and love of neighbour, then the state may not dispose of opinions. The subtitle demands the freedom to philosophise.',
    },
    bible: {
      de: 'Das ist die Geburtsurkunde der historisch-kritischen Bibelwissenschaft: Was der Text sagen wollte, ist aus Sprache, Verfasser und Umständen zu erheben – nicht aus dem, was wahr sein muss. Jede Einleitungsvorlesung, jede Quellenscheidung im Pentateuch, auch die Datierungsspannen im Bücherregal nebenan stehen in dieser Linie. Dass derselbe Mann Gott und Natur gleichsetzte, hat ihn hundert Jahre lang zum Inbegriff des Atheisten gemacht – bis Lessing, Goethe und Schleiermacher ihn anders lasen.',
      en: 'This is the birth certificate of historical-critical biblical scholarship: what the text meant is to be established from language, author and circumstance – not from what must be true. Every introductory course, every source division in the Pentateuch, the dating spans on the bookshelf next door as well, stand in that line. That the same man identified God with nature made him for a century the very image of the atheist – until Lessing, Goethe and Schleiermacher read him differently.',
    },
    books: ['Deut', 'Gen', 'Josh'],
    links: [
      { to: 'maimonides-more', kind: 'against', de: 'Dieselbe Frage nach der Redeweise der Schrift – aber ohne die Voraussetzung, dass am Ende Philosophie und Offenbarung übereinstimmen müssen.', en: 'The same question about scripture’s manner of speaking – but without the premise that philosophy and revelation must agree in the end.' },
      { to: 'abaelard-sic-et-non', kind: 'echoes', de: 'Die Widersprüche stehen lassen und aus ihnen eine Frage machen, nun am Bibeltext selbst.', en: 'Letting the contradictions stand and making a question of them, now in the biblical text itself.' },
    ],
    event: 'westfalen',
    wiki: 'Tractatus theologico-politicus', wikiEn: 'Tractatus Theologico-Politicus',
  },

  /* --- Aufklärung ---------------------------------------------------------- */
  {
    id: 'leibniz-theodizee', kind: 'traktat',
    author: { de: 'Gottfried Wilhelm Leibniz', en: 'Gottfried Wilhelm Leibniz' },
    lived: { de: '1646–1716', en: '1646–1716' },
    original: 'Essais de Théodicée',
    de: 'Die Theodizee', en: 'Theodicy',
    shortDe: 'Theodizee', shortEn: 'Theodicy',
    period: 'aufklaerung', year: 1710, from: 1705, to: 1710,
    when: { de: '1710', en: '1710' },
    thesis: {
      de: 'Diese Welt ist die beste der möglichen – nicht die beste denkbare, sondern die beste, die sich zusammen verwirklichen lässt.',
      en: 'This world is the best of the possible ones – not the best imaginable, but the best that can be realised together.',
    },
    who: {
      de: 'Ein Universalgelehrter, der die Infinitesimalrechnung unabhängig von Newton entwickelte, Bibliothekar in Hannover war und jahrzehntelang an der Wiedervereinigung der Konfessionen arbeitete. Das Buch entsteht aus Gesprächen mit der preußischen Königin und richtet sich gegen Pierre Bayle, der behauptet hatte, das Übel in der Welt lasse sich mit Vernunft nicht mit Gott zusammenbringen.',
      en: 'A universal scholar who developed the calculus independently of Newton, served as librarian in Hanover and worked for decades on reuniting the confessions. The book grows out of conversations with the Prussian queen and is aimed at Pierre Bayle, who had argued that the evil in the world cannot be reconciled with God by reason.',
    },
    what: {
      de: 'Der Titel ist eine Wortschöpfung: Gottes Recht, aus *theos* und *dike*. Gott wählte unter unendlich vielen möglichen Welten; dass diese Übel enthält, ist der Preis dafür, dass sie überhaupt Geschöpfe mit Freiheit enthält. Unterschieden werden drei Übel – das metaphysische der Endlichkeit, das physische des Leidens, das moralische der Schuld –, und nur das letzte ist gewollt, und zwar von uns.',
      en: 'The title is a coinage: God’s justice, from theos and dike. God chose among infinitely many possible worlds; that this one contains evils is the price of its containing creatures with freedom at all. Three evils are distinguished – the metaphysical evil of finitude, the physical evil of suffering, the moral evil of guilt – and only the last is willed, and willed by us.',
    },
    bible: {
      de: 'Seit diesem Buch heißt die Frage des Hiobbuches Theodizee, und damit ist sie zu einem Prozess geworden, in dem Gott als Angeklagter auftritt und die Vernunft als Gericht. 1755 zerstört ein Erdbeben Lissabon an Allerheiligen, Voltaire schreibt den Candide, und die Antwort gilt als widerlegt. Geblieben ist die Frage: Jede spätere Theologie des Leidens – auch die, die auf eine Antwort verzichtet – bezieht sich auf diesen Titel.',
      en: 'Since this book, the question of the book of Job has been called theodicy, and thereby it has become a trial in which God appears as defendant and reason as the court. In 1755 an earthquake destroys Lisbon on All Saints’ Day, Voltaire writes Candide, and the answer is held refuted. The question remains: every later theology of suffering – including the kind that refuses an answer – refers back to this title.',
    },
    books: ['Job', 'Rom', 'Gen'],
    links: [
      { to: 'augustinus-civitate', kind: 'builds', de: 'Das Böse als Mangel, nicht als Macht – Augustins Antwort, in eine Rechnung über mögliche Welten übersetzt.', en: 'Evil as lack rather than power – Augustine’s answer, translated into a calculation over possible worlds.' },
    ],
    event: 'pietismus',
    wiki: 'Theodizee', wikiEn: 'Théodicée',
  },
  {
    id: 'lessing-beweis', kind: 'essay',
    author: { de: 'Gotthold Ephraim Lessing', en: 'Gotthold Ephraim Lessing' },
    lived: { de: '1729–1781', en: '1729–1781' },
    original: 'Über den Beweis des Geistes und der Kraft',
    de: 'Über den Beweis des Geistes und der Kraft', en: 'On the Proof of the Spirit and of Power',
    shortDe: 'Garstiger Graben', shortEn: 'The Ugly Ditch',
    period: 'aufklaerung', year: 1777, from: 1777, to: 1778,
    when: { de: '1777', en: '1777' },
    thesis: {
      de: 'Zufällige Geschichtswahrheiten können der Beweis notwendiger Vernunftwahrheiten nie werden.',
      en: 'Accidental truths of history can never become the proof of necessary truths of reason.',
    },
    who: {
      de: 'Der Dramatiker und Bibliothekar von Wolfenbüttel gibt anonyme Fragmente eines Ungenannten heraus – in Wahrheit aus dem Nachlass des Hamburger Orientalisten Reimarus, der die Auferstehung für Betrug der Jünger erklärt hatte. Der Streit mit dem Hauptpastor Goeze endet damit, dass Lessing die Zensurfreiheit verliert. Seine Antwort ist dann ein Theaterstück: Nathan der Weise.',
      en: 'The playwright and librarian of Wolfenbüttel publishes anonymous "fragments by an unnamed author" – in truth from the papers of the Hamburg orientalist Reimarus, who had declared the resurrection a fraud by the disciples. The quarrel with chief pastor Goeze ends with Lessing losing his freedom from censorship. His answer is then a play: Nathan the Wise.',
    },
    what: {
      de: 'Zehn Seiten, ein Argument. Wunder und Weissagungen mögen geschehen sein – aber berichtete Wunder haben nicht die Beweiskraft erlebter. Und selbst wenn sie zuverlässig berichtet wären: Aus einem historischen Ereignis folgt keine ewige Wahrheit. „Das ist der garstige breite Graben, über den ich nicht kommen kann, so oft und ernstlich ich auch den Sprung versucht habe."',
      en: 'Ten pages, one argument. Miracles and prophecies may have happened – but reported miracles do not have the evidential force of experienced ones. And even if they were reliably reported: no eternal truth follows from a historical event. "That is the ugly broad ditch which I cannot get across, however often and however earnestly I have tried the leap."',
    },
    bible: {
      de: 'Damit ist das Problem benannt, an dem die Theologie des 19. und 20. Jahrhunderts arbeitet: Die Leben-Jesu-Forschung will den Graben historisch überbrücken, Kierkegaard nennt ihn einen Sprung und bejaht ihn, Bultmann erklärt ihn für unerheblich, weil es um die Anrede geht, und Pannenberg bestreitet ihn. Wer heute fragt, was die Auferstehung für einen Historiker sein kann, steht an Lessings Graben.',
      en: 'With that the problem is named on which 19th- and 20th-century theology works: the quest for the historical Jesus wants to bridge the ditch historically, Kierkegaard calls it a leap and affirms it, Bultmann declares it beside the point because what matters is being addressed, and Pannenberg denies it. Anyone asking today what the resurrection can be for a historian is standing at Lessing’s ditch.',
    },
    books: ['1Cor', 'Luke', 'John'],
    links: [
      { to: 'spinoza-ttp', kind: 'builds', de: 'Die historische Lektüre der Bibel, jetzt als Frage an den Glauben zurückgegeben.', en: 'The historical reading of the Bible, now handed back as a question to faith.' },
      { to: 'pascal-pensees', kind: 'echoes', de: 'Auch hier trägt kein Beweis – nur springt bei Lessing niemand.', en: 'Here too no proof carries – only in Lessing nobody leaps.' },
    ],
    wiki: 'Über den Beweis des Geistes und der Kraft', wikiEn: 'Gotthold Ephraim Lessing',
  },
  {
    id: 'hume-dialoge', kind: 'dialog',
    author: { de: 'David Hume', en: 'David Hume' },
    lived: { de: '1711–1776', en: '1711–1776' },
    original: 'Dialogues concerning Natural Religion',
    de: 'Dialoge über natürliche Religion', en: 'Dialogues concerning Natural Religion',
    shortDe: 'Dialoge', shortEn: 'Dialogues',
    period: 'aufklaerung', year: 1779, from: 1751, to: 1779,
    when: { de: 'geschrieben ab 1751, gedruckt 1779 nach seinem Tod', en: 'written from 1751, printed 1779 after his death' },
    thesis: {
      de: 'Aus der Ordnung der Welt folgt kein Schöpfer – nur, dass sie einer Maschine ähnlich sieht.',
      en: 'From the order of the world no creator follows – only that it looks like a machine.',
    },
    who: {
      de: 'Hume hielt das Buch fünfundzwanzig Jahre zurück; Freunde, Adam Smith eingeschlossen, rieten vom Druck ab. Es erschien drei Jahre nach seinem Tod, herausgegeben von seinem Neffen. Der Dialog erlaubt ihm, das Schärfste einer Figur in den Mund zu legen und am Ende offen zu lassen, wer recht behält.',
      en: 'Hume held the book back for twenty-five years; friends, Adam Smith among them, advised against printing. It appeared three years after his death, published by his nephew. The dialogue form lets him put the sharpest things in a character’s mouth and leave open at the end who has the better of it.',
    },
    what: {
      de: 'Drei Gesprächspartner streiten über den Schluss von der Welt auf Gott. Cleanthes vergleicht die Welt mit einer Uhr, Philo zerlegt den Vergleich: Wir haben nur eine Welt und keine zweite zum Vergleichen; ähnliche Wirkungen erlauben nur ähnliche Ursachen, also höchstens einen begrenzten, vielleicht mehrere, vielleicht einen mittelmäßigen Urheber. Und das Leid in der Natur passt zu keiner der Annahmen gut.',
      en: 'Three interlocutors argue over the inference from the world to God. Cleanthes compares the world to a watch; Philo takes the comparison apart: we have only one world and no second to compare it with; like effects license only like causes, so at most a limited author, perhaps several, perhaps a mediocre one. And the suffering in nature fits none of the assumptions well.',
    },
    bible: {
      de: 'Die natürliche Theologie – Gott aus der Schöpfung erkennen, wie Römer 1 es nahelegt – bekommt hier den Schlag, von dem sie sich nicht erholt hat. Dazu kommt Humes älteres Kapitel über Wunder: Ein Wunderbericht ist nur zu glauben, wenn die Falschheit des Berichts unwahrscheinlicher wäre als das Wunder selbst. Kant, der Hume gelesen hat und sagt, er sei dadurch aus dem dogmatischen Schlummer geweckt worden, zieht daraus die Konsequenz.',
      en: 'Natural theology – knowing God from creation, as Romans 1 suggests – takes here the blow it has not recovered from. Add Hume’s earlier chapter on miracles: a report of a miracle is to be believed only if the falsehood of the report would be more improbable than the miracle itself. Kant, who read Hume and says he was thereby woken from his dogmatic slumber, draws the consequence.',
    },
    books: ['Rom', 'Ps', 'Job'],
    links: [
      { to: 'thomas-summa', kind: 'against', de: 'Die fünf Wege, einer nach dem anderen auf ihre Schlussform hin geprüft – und keiner hält.', en: 'The five ways, tested one after another for their form of inference – and none holds.' },
      { to: 'leibniz-theodizee', kind: 'against', de: 'Wenn die Welt so aussieht, wie sie aussieht, ist sie ein schwacher Beleg für die beste aller möglichen.', en: 'If the world looks the way it looks, it is weak evidence for the best of all possible ones.' },
    ],
    wiki: 'Dialoge über natürliche Religion', wikiEn: 'Dialogues Concerning Natural Religion',
  },
  {
    id: 'kant-kritik', kind: 'kritik',
    author: { de: 'Immanuel Kant', en: 'Immanuel Kant' },
    lived: { de: '1724–1804', en: '1724–1804' },
    original: 'Kritik der reinen Vernunft',
    de: 'Kritik der reinen Vernunft', en: 'Critique of Pure Reason',
    shortDe: 'Reine Vernunft', shortEn: 'Pure Reason',
    period: 'aufklaerung', year: 1781, from: 1781, to: 1787,
    when: { de: '1781, zweite Auflage 1787', en: '1781, second edition 1787' },
    thesis: {
      de: 'Ich musste das Wissen aufheben, um zum Glauben Platz zu bekommen.',
      en: 'I had to suspend knowledge in order to make room for faith.',
    },
    who: {
      de: 'Ein Professor in Königsberg, der die Stadt nie verließ, schweigt elf Jahre lang und legt dann in vier Monaten ein Buch vor, das er selbst für unlesbar hielt – die zweite Auflage ist der Versuch, es verständlicher zu machen. Geweckt aus dem „dogmatischen Schlummer" hatte ihn Hume.',
      en: 'A professor in Königsberg who never left the city stays silent for eleven years and then produces in four months a book he himself thought unreadable – the second edition is his attempt to make it clearer. It was Hume who woke him from his "dogmatic slumber".',
    },
    what: {
      de: 'Die Wende: Nicht unsere Erkenntnis richtet sich nach den Gegenständen, sondern die Gegenstände nach unserer Erkenntnis. Raum, Zeit und Kategorien wie Ursache sind nicht in der Welt gefunden, sondern die Brille, ohne die es keine Erfahrung gäbe. Daraus folgt eine Grenze: Über das, was jenseits aller möglichen Erfahrung liegt – Gott, Freiheit, Unsterblichkeit –, ist theoretisch nichts auszumachen. Die drei klassischen Gottesbeweise werden einzeln zerlegt.',
      en: 'The turn: our knowledge does not conform to objects, but objects to our knowledge. Space, time and categories such as cause are not found in the world but are the lenses without which there would be no experience. A limit follows: of what lies beyond all possible experience – God, freedom, immortality – nothing can be established theoretically. The three classical proofs of God are taken apart one by one.',
    },
    bible: {
      de: 'Nach Kant kann Theologie nicht mehr beweisen, und sie hat darauf drei Antworten gefunden, die bis heute in Gebrauch sind: Schleiermachers Rückzug auf die Erfahrung, Ritschls Rückzug auf das sittliche Handeln – Kant selbst hatte Gott als Forderung der praktischen Vernunft wieder eingeführt – und Barths Absage an jede Anknüpfung. Kants eigene Schrift „Die Religion innerhalb der Grenzen der bloßen Vernunft" (1793) brachte ihm einen königlichen Verweis ein.',
      en: 'After Kant, theology can no longer prove, and it has found three answers still in use: Schleiermacher’s retreat to experience, Ritschl’s retreat to moral action – Kant himself had reintroduced God as a demand of practical reason – and Barth’s refusal of any point of contact. Kant’s own Religion within the Boundaries of Mere Reason (1793) earned him a royal reprimand.',
    },
    books: ['Rom', 'Exod', 'Matt'],
    links: [
      { to: 'hume-dialoge', kind: 'builds', de: 'Humes Einwand, zu Ende gedacht: Nicht dieser Schluss ist schwach, sondern jeder Schluss über die Erfahrung hinaus.', en: 'Hume’s objection thought through: it is not this inference that is weak but every inference beyond experience.' },
      { to: 'anselm-proslogion', kind: 'against', de: 'Der ontologische Beweis fällt an einem Satz: Sein ist keine Eigenschaft, die etwas größer macht.', en: 'The ontological proof falls on one sentence: being is not a property that makes something greater.' },
      { to: 'descartes-meditationes', kind: 'against', de: 'Das denkende Ich bleibt – aber es erkennt sich nur als Erscheinung, nicht als Ding.', en: 'The thinking I remains – but it knows itself only as appearance, not as a thing.' },
    ],
    wiki: 'Kritik der reinen Vernunft', wikiEn: 'Critique of Pure Reason',
  },
  {
    id: 'schleiermacher-reden', kind: 'essay',
    author: { de: 'Friedrich Schleiermacher', en: 'Friedrich Schleiermacher' },
    lived: { de: '1768–1834', en: '1768–1834' },
    original: 'Über die Religion. Reden an die Gebildeten unter ihren Verächtern',
    de: 'Über die Religion', en: 'On Religion',
    shortDe: 'Über die Religion', shortEn: 'On Religion',
    period: 'aufklaerung', year: 1799, from: 1799, to: 1831,
    when: { de: '1799, anonym', en: '1799, anonymous' },
    thesis: {
      de: 'Religion ist weder Wissen noch Moral, sondern Sinn und Geschmack für das Unendliche.',
      en: 'Religion is neither knowledge nor morality but a sense and taste for the infinite.',
    },
    who: {
      de: 'Ein junger Krankenhausprediger in Berlin, der im Kreis der Frühromantiker verkehrt – Friedrich Schlegel, Henriette Herz – und dort erlebt, dass gebildete Menschen die Religion nicht bekämpfen, sondern langweilig finden. Die fünf Reden sind an sie gerichtet, anonym erschienen und in einem Ton geschrieben, der zu einer Dogmatik nicht passt.',
      en: 'A young hospital preacher in Berlin who moves in early Romantic circles – Friedrich Schlegel, Henriette Herz – and finds there that educated people do not fight religion but find it boring. The five speeches are addressed to them, published anonymously and written in a tone no dogmatics would allow.',
    },
    what: {
      de: 'Religion wird von zwei Nachbarn abgegrenzt, zu denen die Aufklärung sie gemacht hatte: Sie ist keine Weltanschauung und keine Sittenlehre, sondern eine eigene Provinz im Gemüt – Anschauung des Universums. Wunder, Offenbarung, Inspiration bekommen neue Bedeutungen: Wunder ist der religiöse Name für ein Ereignis. Später fasst Schleiermacher es in die Formel vom „schlechthinnigen Abhängigkeitsgefühl".',
      en: 'Religion is marked off from the two neighbours the Enlightenment had made it into: it is not a worldview and not an ethics but a province of its own in the mind – intuition of the universe. Miracle, revelation, inspiration receive new meanings: miracle is the religious name for an event. Later Schleiermacher condenses it into the formula of the "feeling of absolute dependence".',
    },
    bible: {
      de: 'Das ist der Ausweg aus Kants Grenze, und mit ihm beginnt die moderne Theologie: Der Glaube muss nichts beweisen, weil er gar nicht in der Abteilung Wissen zu Hause ist. Die Bibel wird damit zum Zeugnis von Erfahrung statt zur Sammlung von Lehrsätzen – der Anfang der liberalen Theologie. Barth hat genau hier den Einschnitt gesehen und gefragt, ob Gott dann nicht bloß noch das andere Wort für Innerlichkeit ist.',
      en: 'This is the way out of Kant’s limit, and with it modern theology begins: faith need prove nothing, because it is not at home in the department of knowledge at all. The Bible thereby becomes testimony to experience rather than a collection of doctrines – the start of liberal theology. Barth saw the decisive cut exactly here and asked whether God is then merely another word for inwardness.',
    },
    books: ['Ps', 'John', 'Rom'],
    links: [
      { to: 'kant-kritik', kind: 'against', de: 'Nicht die Vernunft nachbessern, sondern den Glauben aus ihrem Zuständigkeitsbereich herausnehmen.', en: 'Not repairing reason but taking faith out of its jurisdiction altogether.' },
      { to: 'spinoza-ttp', kind: 'echoes', de: 'Schleiermacher nennt Spinoza in den Reden ehrfürchtig – den Verketzerten als Frommen.', en: 'In the speeches Schleiermacher names Spinoza with reverence – the excommunicated man as a pious one.' },
    ],
    wiki: 'Über die Religion', wikiEn: 'On Religion: Speeches to its Cultured Despisers',
  },

  /* --- Das 19. Jahrhundert -------------------------------------------------- */
  {
    id: 'hegel-phaenomenologie', kind: 'traktat',
    author: { de: 'Georg Wilhelm Friedrich Hegel', en: 'Georg Wilhelm Friedrich Hegel' },
    lived: { de: '1770–1831', en: '1770–1831' },
    original: 'Phänomenologie des Geistes',
    de: 'Phänomenologie des Geistes', en: 'Phenomenology of Spirit',
    shortDe: 'Phänomenologie', shortEn: 'Phenomenology',
    period: 'neunzehn', year: 1807, from: 1805, to: 1807,
    when: { de: '1807', en: '1807' },
    thesis: {
      de: 'Das Wahre ist nicht ein Satz, sondern ein Weg – und der Widerspruch ist sein Motor.',
      en: 'The true is not a proposition but a road – and contradiction is its engine.',
    },
    who: {
      de: 'Hegel schließt das Manuskript in Jena ab, während Napoleons Truppen in die Stadt einrücken; er sieht den Kaiser reiten und schreibt einem Freund, er habe „die Weltseele zu Pferde" gesehen. Der Verleger hatte die letzten Bogen unter Fristdruck bekommen – die berühmteste Vorrede der deutschen Philosophie entstand nach dem Buch.',
      en: 'Hegel finishes the manuscript in Jena as Napoleon’s troops march into the city; he watches the emperor ride past and writes to a friend that he has seen "the world-soul on horseback". The publisher received the last sheets under a deadline – the most famous preface in German philosophy was written after the book.',
    },
    what: {
      de: 'Die Bildungsgeschichte des Bewusstseins, Stufe um Stufe: Jede Gestalt scheitert an ihrem eigenen Anspruch und wird dadurch in die nächste aufgehoben – aufgehoben in drei Bedeutungen zugleich, beseitigt, bewahrt, hinaufgehoben. Dazwischen stehen Kapitel, die eigene Wirkungsgeschichten haben: Herr und Knecht, wo der Knecht durch Arbeit zum Selbstbewusstsein kommt, und das „unglückliche Bewusstsein", das sein Wesen immer im Jenseits hat.',
      en: 'The education of consciousness, stage by stage: each shape fails by its own claim and is thereby sublated into the next – sublated in three senses at once: cancelled, preserved, raised. Between them stand chapters with histories of their own: master and servant, where the servant comes to self-consciousness through work, and the "unhappy consciousness" that always has its essence in a beyond.',
    },
    bible: {
      de: 'Hegel liest die christliche Lehre als Wahrheit in der Form der Vorstellung: Menschwerdung, Kreuz und Auferstehung seien die bildhafte Gestalt dessen, was der Begriff denkt – der Geist, der durch die Entäußerung hindurch zu sich kommt. Das hat zwei entgegengesetzte Erben: eine Theologie, die Geschichte als Weg Gottes liest, und die Linkshegelianer, die das Bild für alles halten, was übrig bleibt, wenn man den Inhalt entfernt.',
      en: 'Hegel reads Christian doctrine as truth in the form of representation: incarnation, cross and resurrection are the pictorial shape of what the concept thinks – spirit coming to itself through self-emptying. This has two opposed heirs: a theology that reads history as the way of God, and the Left Hegelians, for whom the picture is all that remains once the content is removed.',
    },
    books: ['Phil', 'John', 'Rom'],
    links: [
      { to: 'kant-kritik', kind: 'against', de: 'Die Grenze der Erkenntnis wird selbst überschritten: Wer eine Grenze kennt, ist schon darüber hinaus.', en: 'The limit of knowledge is itself crossed: whoever knows a limit is already beyond it.' },
      { to: 'augustinus-civitate', kind: 'echoes', de: 'Wieder ein Gang der Geschichte auf ein Ziel zu – nur ist das Ziel jetzt in der Geschichte selbst.', en: 'Again a course of history toward a goal – only the goal is now inside history itself.' },
    ],
    wiki: 'Phänomenologie des Geistes', wikiEn: 'The Phenomenology of Spirit',
  },
  {
    id: 'feuerbach-wesen', kind: 'kritik',
    author: { de: 'Ludwig Feuerbach', en: 'Ludwig Feuerbach' },
    lived: { de: '1804–1872', en: '1804–1872' },
    original: 'Das Wesen des Christentums',
    de: 'Das Wesen des Christentums', en: 'The Essence of Christianity',
    shortDe: 'Das Wesen', shortEn: 'The Essence',
    period: 'neunzehn', year: 1841, from: 1841, to: 1843,
    when: { de: '1841', en: '1841' },
    thesis: {
      de: 'Nicht Gott schuf den Menschen nach seinem Bild, sondern der Mensch Gott nach dem seinen.',
      en: 'Not God created man in his image, but man created God in his.',
    },
    who: {
      de: 'Ein Hegelschüler, dem nach einer frühen Schrift über die Unsterblichkeit jede Universitätslaufbahn verschlossen blieb und der auf dem Land lebte, schreibt das Buch, das eine Generation prägt. George Eliot übersetzt es ins Englische, Engels erinnert sich später an die Begeisterung: „Wir waren alle momentan Feuerbachianer."',
      en: 'A pupil of Hegel barred from any university career after an early work on immortality, living in the countryside, writes the book that marks a generation. George Eliot translates it into English; Engels later recalls the enthusiasm: "we all became at once Feuerbachians."',
    },
    what: {
      de: 'Die Religion sagt Wahres – aber über den Menschen. Was der Glaube Gott zuschreibt, sind die eigenen Vermögen, ins Unendliche gesteigert und dem Menschen gegenübergestellt: Liebe, Vernunft, Wille. Deshalb ist Theologie in Wahrheit Anthropologie, und das Gebet ist das Gespräch des Menschen mit dem eigenen Wesen. Der Verlust ist doppelt: Je reicher Gott wird, desto ärmer der Mensch.',
      en: 'Religion says something true – but about human beings. What faith ascribes to God are our own powers, raised to infinity and set over against us: love, reason, will. Therefore theology is in truth anthropology, and prayer is the conversation of a human being with their own essence. The loss is twofold: the richer God becomes, the poorer the human being.',
    },
    bible: {
      de: 'Hier beginnt die Religionskritik als Verdacht: nicht „ist es wahr?", sondern „warum glaubt jemand das?". Marx nimmt die Figur auf und verlegt ihren Grund in die Verhältnisse, Freud in die Kindheit, und jede spätere Projektionsthese stammt aus diesem Buch. Die Theologie hat zwei Antworten versucht: Barth, der Feuerbach für den unfreiwilligen Zeugen dafür hält, dass Religion wirklich menschliches Machwerk ist – und eine, die fragt, ob ein Gott, der sich mitteilt, überhaupt anders als in menschlichen Bildern ankommen könnte.',
      en: 'Here religious criticism begins as suspicion: not "is it true?" but "why does someone believe it?". Marx takes over the figure and relocates its ground in social conditions, Freud in childhood, and every later projection thesis stems from this book. Theology has tried two answers: Barth, who takes Feuerbach as the involuntary witness that religion really is a human product – and one that asks whether a God who communicates could arrive in anything other than human images.',
    },
    books: ['Gen', '1John', 'Exod'],
    links: [
      { to: 'hegel-phaenomenologie', kind: 'against', de: 'Hegel auf die Füße gestellt: Nicht der Geist macht den Menschen, der Mensch macht den Geist.', en: 'Hegel set on his feet: spirit does not make the human being, the human being makes spirit.' },
    ],
    event: 'spurgeon',
    wiki: 'Das Wesen des Christentums', wikiEn: 'The Essence of Christianity',
  },
  {
    id: 'kierkegaard-furcht', kind: 'essay',
    author: { de: 'Søren Kierkegaard', en: 'Søren Kierkegaard' },
    lived: { de: '1813–1855', en: '1813–1855' },
    original: 'Frygt og Bæven',
    de: 'Furcht und Zittern', en: 'Fear and Trembling',
    shortDe: 'Furcht und Zittern', shortEn: 'Fear and Trembling',
    period: 'neunzehn', year: 1843, from: 1843, to: 1843,
    when: { de: '1843', en: '1843' },
    thesis: {
      de: 'Glaube ist kein Ergebnis, sondern ein Sprung – und er lässt sich niemandem erklären.',
      en: 'Faith is not a result but a leap – and it can be explained to no one.',
    },
    who: {
      de: 'Ein Kopenhagener, der die Verlobung mit Regine Olsen gelöst hat und darüber nicht hinwegkommt, veröffentlicht unter dem Namen Johannes de silentio – Johannes der Schweigende. Er schreibt gegen eine Kirche, in der alle Christen sind, weil alle getauft wurden, und gegen Hegel, bei dem der Einzelne im Allgemeinen aufgehoben wird.',
      en: 'A Copenhagener who has broken off his engagement to Regine Olsen and cannot get over it publishes under the name Johannes de silentio – John the Silent. He writes against a church in which everyone is a Christian because everyone was baptised, and against Hegel, in whom the single individual is sublated into the universal.',
    },
    what: {
      de: 'Eine einzige Bibelstelle, viermal neu erzählt: Abraham, der Isaak opfern soll (1. Mose 22). Ethisch ist das Mord, und keine allgemeine Regel kann es rechtfertigen; entweder war Abraham ein Verbrecher, oder es gibt ein Verhältnis zu Gott, das über dem Allgemeinen steht. Kierkegaard nennt das die teleologische Suspension des Ethischen und hält fest, dass Abraham nicht reden kann – wer erklären könnte, was er tut, täte es nicht.',
      en: 'A single biblical passage, retold four times: Abraham, told to sacrifice Isaac (Genesis 22). Ethically that is murder, and no general rule can justify it; either Abraham was a criminal, or there is a relation to God that stands above the universal. Kierkegaard calls this the teleological suspension of the ethical, and insists that Abraham cannot speak – whoever could explain what he is doing would not do it.',
    },
    bible: {
      de: 'Das ist die schärfste Lektüre von 1. Mose 22, die es gibt, und sie hat den Text aus der Sonntagsschule geholt. Von hier aus wird der Einzelne zur theologischen Größe: Existenzphilosophie, Dialektische Theologie, Bultmanns Entscheidung, der ganze Ernst des Wortes „Entscheidung" in kirchlicher Rede. Lessings Graben bleibt – Kierkegaard bestreitet ihn nicht, er springt.',
      en: 'This is the sharpest reading of Genesis 22 there is, and it took the text out of Sunday school. From here the single individual becomes a theological category: existential philosophy, dialectical theology, Bultmann’s decision, the whole weight of the word "decision" in church language. Lessing’s ditch remains – Kierkegaard does not deny it, he leaps.',
    },
    books: ['Gen', 'Heb', 'Rom'],
    links: [
      { to: 'hegel-phaenomenologie', kind: 'against', de: 'Der Einzelne steht höher als das Allgemeine – genau das, was das System nicht denken kann.', en: 'The single individual stands higher than the universal – precisely what the system cannot think.' },
      { to: 'lessing-beweis', kind: 'echoes', de: 'Derselbe Graben, andere Bewegung: Kierkegaard nennt ihn Sprung und geht hinüber.', en: 'The same ditch, a different movement: Kierkegaard calls it a leap and crosses.' },
      { to: 'pascal-pensees', kind: 'echoes', de: 'Auch hier ist der Glaube nicht das Ende einer Rechnung, sondern ein Wagnis mit dem eigenen Leben.', en: 'Here too faith is not the end of a calculation but a venture with one’s own life.' },
    ],
    wiki: 'Furcht und Zittern', wikiEn: 'Fear and Trembling',
  },
  {
    id: 'marx-hegelkritik', kind: 'kritik',
    author: { de: 'Karl Marx', en: 'Karl Marx' },
    lived: { de: '1818–1883', en: '1818–1883' },
    original: 'Zur Kritik der Hegelschen Rechtsphilosophie. Einleitung',
    de: 'Zur Kritik der Hegelschen Rechtsphilosophie', en: 'Critique of Hegel’s Philosophy of Right',
    shortDe: 'Hegel-Kritik', shortEn: 'Critique of Hegel',
    period: 'neunzehn', year: 1844, from: 1843, to: 1844,
    when: { de: '1844, in den Deutsch-Französischen Jahrbüchern', en: '1844, in the Deutsch-Französische Jahrbücher' },
    thesis: {
      de: 'Religion ist der Seufzer der bedrängten Kreatur – und das Opium des Volkes.',
      en: 'Religion is the sigh of the oppressed creature – and the opium of the people.',
    },
    who: {
      de: 'Ein fünfundzwanzigjähriger Redakteur, dessen Zeitung gerade verboten wurde, schreibt im Pariser Exil die Einleitung zu einem Manuskript, das er nie veröffentlicht. Die Zeitschrift, in der sie erscheint, bringt es auf eine einzige Doppelnummer.',
      en: 'A twenty-five-year-old editor whose newspaper has just been banned writes, in Parisian exile, the introduction to a manuscript he never publishes. The journal it appears in manages a single double issue.',
    },
    what: {
      de: 'Der erste Satz setzt den Ton: „Für Deutschland ist die Kritik der Religion im wesentlichen beendet, und die Kritik der Religion ist die Voraussetzung aller Kritik." Was folgt, ist keine Verhöhnung, sondern eine Diagnose: Religion ist das Selbstbewusstsein des Menschen, der sich selbst noch nicht gefunden hat, „der Seufzer der bedrängten Kreatur, das Gemüt einer herzlosen Welt". Deshalb sei ihre Aufhebung die Forderung nach einem Zustand, der sie nicht mehr braucht.',
      en: 'The first sentence sets the tone: "For Germany the criticism of religion is essentially complete, and the criticism of religion is the premise of all criticism." What follows is not mockery but a diagnosis: religion is the self-consciousness of a person who has not yet found himself, "the sigh of the oppressed creature, the heart of a heartless world". Its abolition is therefore the demand for a condition that no longer needs it.',
    },
    bible: {
      de: 'Der Opium-Satz wird meistens halb zitiert, und die zweite Hälfte ist die interessantere: Das Betäubungsmittel ist zugleich ein Protest. Damit steht eine Frage im Raum, die jede Kirche angeht – ob Glaube Verhältnisse erträglich macht, die geändert gehören. Die Befreiungstheologie hat sie im 20. Jahrhundert bejaht und die Frage umgedreht; die Propheten des Alten Testaments, Amos vor allem, hatten sie längst gestellt.',
      en: 'The opium line is usually quoted by halves, and the second half is the more interesting: the anaesthetic is at the same time a protest. With that a question is in the room that concerns every church – whether faith makes bearable conditions that ought to be changed. Liberation theology answered yes in the 20th century and turned the question round; the prophets of the Old Testament, Amos above all, had asked it long since.',
    },
    books: ['Amos', 'Jas', 'Luke'],
    links: [
      { to: 'feuerbach-wesen', kind: 'builds', de: 'Feuerbachs Projektion bekommt eine Adresse: nicht das Wesen des Menschen, sondern seine Verhältnisse.', en: 'Feuerbach’s projection gets an address: not the essence of the human being but the conditions of life.' },
    ],
    wiki: 'Zur Kritik der Hegelschen Rechtsphilosophie', wikiEn: 'A Contribution to the Critique of Hegel’s Philosophy of Right',
  },
  {
    id: 'nietzsche-wissenschaft', kind: 'aphorismen',
    author: { de: 'Friedrich Nietzsche', en: 'Friedrich Nietzsche' },
    lived: { de: '1844–1900', en: '1844–1900' },
    original: 'Die fröhliche Wissenschaft',
    de: 'Die fröhliche Wissenschaft', en: 'The Gay Science',
    shortDe: 'Fröhliche Wiss.', shortEn: 'The Gay Science',
    period: 'neunzehn', year: 1882, from: 1881, to: 1887,
    when: { de: '1882, fünftes Buch 1887', en: '1882, fifth book 1887' },
    thesis: {
      de: 'Gott ist tot – und wir haben ihn getötet, ohne zu merken, was wir damit abgeräumt haben.',
      en: 'God is dead – and we have killed him, without noticing what we cleared away with him.',
    },
    who: {
      de: 'Der Sohn und Enkel von Pfarrern, mit vierundzwanzig jüngster Professor für klassische Philologie in Basel, gibt den Lehrstuhl krankheitshalber auf und schreibt in Pensionen zwischen Genua, Sils-Maria und Nizza. Er hat die Bibel gründlicher gelesen als die meisten seiner Gegner, und man hört es in jedem Satz.',
      en: 'The son and grandson of pastors, at twenty-four the youngest professor of classical philology in Basel, gives up the chair for reasons of health and writes in boarding houses between Genoa, Sils-Maria and Nice. He has read the Bible more thoroughly than most of his opponents, and it shows in every sentence.',
    },
    what: {
      de: 'Aphorismen, Lieder, ein Vorspiel in Reimen – und mittendrin, Nummer 125, der tolle Mensch, der am hellen Vormittag mit einer Laterne auf den Markt läuft und Gott sucht. Seine Frage ist nicht, ob Gott existiert, sondern was wir getan haben: „Wer gab uns den Schwamm, um den ganzen Horizont wegzuwischen?" Die Umstehenden lachen; er sagt, er komme zu früh. Nummer 341 stellt daneben die ewige Wiederkunft als Prüfstein: Wolltest du dieses Leben noch einmal, unzählige Male?',
      en: 'Aphorisms, songs, a prelude in rhymes – and in the middle, number 125, the madman who runs into the market at bright morning with a lantern, looking for God. His question is not whether God exists but what we have done: "Who gave us the sponge to wipe away the entire horizon?" The bystanders laugh; he says he has come too early. Number 341 sets beside it the eternal return as a test: would you want this life again, countless times?',
    },
    bible: {
      de: 'Das ist keine Bestreitung Gottes, sondern eine Todesanzeige für eine Kultur, die sich noch christlich nennt und längst anders lebt – und darin die härteste Anfrage an jede bürgerliche Religion. Die Theologie des 20. Jahrhunderts hat darauf geantwortet, teils zustimmend: Bonhoeffers „Leben vor Gott ohne Gott", die Gott-ist-tot-Theologie der sechziger Jahre, und die Rückfrage, ob hier nicht ein bestimmtes Gottesbild stirbt – das des allmächtigen Garanten – und nicht der Gekreuzigte.',
      en: 'This is not a denial of God but an obituary for a culture that still calls itself Christian and long since lives otherwise – and in that the hardest question to any bourgeois religion. Twentieth-century theology answered it, partly in agreement: Bonhoeffer’s "living before God without God", the death-of-God theology of the sixties, and the counter-question whether what dies here is a particular image of God – the almighty guarantor – and not the crucified one.',
    },
    books: ['Ps', 'Matt', 'Rom'],
    links: [
      { to: 'feuerbach-wesen', kind: 'builds', de: 'Wenn Gott ein Bild des Menschen ist, ist die Frage nicht mehr, ob er existiert, sondern was ohne ihn bleibt.', en: 'If God is an image of humanity, the question is no longer whether he exists but what remains without him.' },
      { to: 'platon-politeia', kind: 'against', de: 'Die wahre Welt hinter dieser – für Nietzsche der Grundfehler, von Platon bis zum Christentum.', en: 'The true world behind this one – for Nietzsche the founding error, from Plato to Christianity.' },
    ],
    event: 'vatikan1',
    wiki: 'Die fröhliche Wissenschaft', wikiEn: 'The Gay Science',
  },

  /* --- Moderne und Gegenwart ------------------------------------------------ */
  {
    id: 'otto-heilige', kind: 'traktat',
    author: { de: 'Rudolf Otto', en: 'Rudolf Otto' },
    lived: { de: '1869–1937', en: '1869–1937' },
    original: 'Das Heilige',
    de: 'Das Heilige', en: 'The Idea of the Holy',
    shortDe: 'Das Heilige', shortEn: 'The Holy',
    period: 'moderne', year: 1917, from: 1911, to: 1917,
    when: { de: '1917', en: '1917' },
    thesis: {
      de: 'Vor aller Lehre steht ein Erschrecken: das ganz Andere, das anzieht und erschüttert zugleich.',
      en: 'Before all doctrine stands a shudder: the wholly other, which draws and shakes at once.',
    },
    who: {
      de: 'Ein Marburger Theologe, der weit gereist war – Ägypten, Indien, Japan – und in einer Synagoge in Marokko ein Erlebnis hatte, das er später als Ausgangspunkt nannte: das dreifache Heilig aus Jesaja 6, gesungen in einer Sprache, die er nicht verstand. Das Buch erscheint im vorletzten Kriegsjahr und wird trotz seines sperrigen Gegenstands ein Welterfolg.',
      en: 'A Marburg theologian who had travelled widely – Egypt, India, Japan – and had an experience in a synagogue in Morocco he later named as his starting point: the threefold Holy from Isaiah 6, sung in a language he did not understand. The book appears in the penultimate year of the war and, despite its forbidding subject, becomes a worldwide success.',
    },
    what: {
      de: 'Otto sucht den Kern religiöser Erfahrung unterhalb aller Begriffe und nennt ihn das Numinose – nicht ableitbar, nicht auf Moral oder Vernunft zurückzuführen. Er beschreibt es in einer Formel, die geblieben ist: mysterium tremendum et fascinans, ein Geheimnis, das schaudern lässt und zugleich anzieht. Dazu ein Katalog von Beispielen aus vielen Religionen, denn die Erfahrung ist nach Otto älter als jede von ihnen.',
      en: 'Otto looks for the core of religious experience beneath all concepts and calls it the numinous – underivable, not reducible to morality or reason. He describes it in a formula that has stuck: mysterium tremendum et fascinans, a mystery that makes one shudder and at the same time attracts. With it a catalogue of examples from many religions, for the experience is on Otto’s account older than any of them.',
    },
    bible: {
      de: 'Damit bekommen die unheimlichen Stellen der Bibel ihre Sprache zurück: Jakob in Bethel, der aufwacht und sagt „wie furchtbar ist diese Stätte"; Jesaja im Tempel; die Jünger auf dem See, die sich „mit großer Furcht fürchten". Eine Theologie, die Gott vor allem als gut und vernünftig darstellt, hat für diese Texte keinen Platz. Der Einwand gegen Otto ist ebenso alt: Wer das Heilige zuerst als Erlebnis beschreibt, kann schwer sagen, woran man einen Gott von einem Schauder unterscheidet.',
      en: 'With that the uncanny passages of the Bible get their language back: Jacob at Bethel, waking to say "how dreadful is this place"; Isaiah in the temple; the disciples on the lake, who "feared a great fear". A theology that presents God above all as good and reasonable has no room for these texts. The objection to Otto is just as old: whoever describes the holy first as experience will struggle to say how a god is told apart from a shudder.',
    },
    books: ['Isa', 'Gen', 'Mark'],
    links: [
      { to: 'schleiermacher-reden', kind: 'builds', de: 'Schleiermachers Gefühl, geschärft: nicht Abhängigkeit, sondern Erschrecken vor dem ganz Anderen.', en: 'Schleiermacher’s feeling sharpened: not dependence but dread before the wholly other.' },
    ],
    event: 'edinburgh',
    wiki: 'Das Heilige', wikiEn: 'The Idea of the Holy',
  },
  {
    id: 'wittgenstein-tractatus', kind: 'traktat',
    author: { de: 'Ludwig Wittgenstein', en: 'Ludwig Wittgenstein' },
    lived: { de: '1889–1951', en: '1889–1951' },
    original: 'Logisch-philosophische Abhandlung',
    de: 'Tractatus logico-philosophicus', en: 'Tractatus Logico-Philosophicus',
    shortDe: 'Tractatus', shortEn: 'Tractatus',
    period: 'moderne', year: 1921, from: 1914, to: 1922,
    when: { de: '1921', en: '1921' },
    thesis: {
      de: 'Wovon man nicht sprechen kann, darüber muss man schweigen – und das Wichtigste liegt dort.',
      en: 'Whereof one cannot speak, thereof one must be silent – and the most important things lie there.',
    },
    who: {
      de: 'Der Sohn eines der reichsten Männer Österreichs schreibt große Teile des Buches als Soldat an der Front und schließt es in italienischer Kriegsgefangenschaft ab. Danach verschenkt er sein Erbe, wird Volksschullehrer in Niederösterreich und hält die Philosophie für erledigt. Zwanzig Jahre später widerspricht er sich selbst – die „Philosophischen Untersuchungen" (1953) sind die Widerlegung dieses Buches durch seinen eigenen Verfasser.',
      en: 'The son of one of Austria’s richest men writes much of the book as a soldier at the front and finishes it in Italian captivity. Afterwards he gives away his inheritance, becomes a village schoolteacher in Lower Austria and considers philosophy finished. Twenty years later he contradicts himself – the Philosophical Investigations (1953) are the refutation of this book by its own author.',
    },
    what: {
      de: 'Sieben nummerierte Sätze mit Unterästen, achtzig Seiten. Die Sprache bildet die Welt ab; was sich sagen lässt, sind Tatsachen. Alles andere – Ethik, Ästhetik, der Sinn des Lebens, Gott – liegt außerhalb und lässt sich nicht aussprechen, sondern höchstens zeigen. Der Schluss zieht die Leiter hoch: Wer die Sätze dieses Buches verstanden hat, erkennt sie als unsinnig und muss sie wegwerfen.',
      en: 'Seven numbered propositions with branches, eighty pages. Language pictures the world; what can be said are facts. Everything else – ethics, aesthetics, the meaning of life, God – lies outside and cannot be stated, at most shown. The close pulls the ladder up: whoever has understood the propositions of this book recognises them as nonsensical and must throw them away.',
    },
    bible: {
      de: 'Der Wiener Kreis las das Buch als Abschaffung der Religion; Wittgenstein selbst nicht – er schrieb an einen Verleger, das eigentliche Buch bestehe aus dem, was er nicht geschrieben habe, und das sei das Ethische. Für die Theologie folgen daraus zwei Wege: das Schweigen als Respekt vor dem Unsagbaren, in der Nähe der negativen Theologie – und, aus dem Spätwerk, die Einsicht, dass religiöse Rede ihre eigenen Regeln hat und nicht an der Physik gemessen wird.',
      en: 'The Vienna Circle read the book as the abolition of religion; Wittgenstein himself did not – he wrote to a publisher that the real book consisted of what he had not written, and that this was the ethical part. For theology two roads follow: silence as respect for the unsayable, close to negative theology – and, from the late work, the insight that religious speech has rules of its own and is not measured against physics.',
    },
    books: ['Exod', 'Job', 'Eccl'],
    links: [
      { to: 'kant-kritik', kind: 'echoes', de: 'Wieder eine Grenze – diesmal nicht der Erkenntnis, sondern der Sprache.', en: 'A limit again – this time not of knowledge but of language.' },
      { to: 'cusanus-docta', kind: 'echoes', de: 'Das Schweigen am Ende der Erkenntnis, fünfhundert Jahre später und ohne Theologie.', en: 'Silence at the end of knowledge, five hundred years later and without theology.' },
    ],
    wiki: 'Tractatus logico-philosophicus', wikiEn: 'Tractatus Logico-Philosophicus',
  },
  {
    id: 'barth-roemerbrief', kind: 'kommentar',
    author: { de: 'Karl Barth', en: 'Karl Barth' },
    lived: { de: '1886–1968', en: '1886–1968' },
    original: 'Der Römerbrief',
    de: 'Der Römerbrief', en: 'The Epistle to the Romans',
    shortDe: 'Der Römerbrief', shortEn: 'Epistle to Romans',
    period: 'moderne', year: 1922, from: 1918, to: 1922,
    when: { de: '1919, zweite Auflage 1922', en: '1919, second edition 1922' },
    thesis: {
      de: 'Gott ist Gott – und zwischen ihm und uns liegt kein Weg, den wir gehen könnten.',
      en: 'God is God – and between him and us lies no road we could walk.',
    },
    who: {
      de: 'Ein Dorfpfarrer in Safenwil im Aargau, der am Sonntag predigen muss und merkt, dass die liberale Theologie seiner Lehrer ihm dafür nichts gibt – vollends, seit dieselben Lehrer 1914 den Kriegsaufruf des Kaisers unterschrieben hatten. Er fängt an, den Römerbrief Vers für Vers zu lesen, und schreibt das Ergebnis auf. Die zweite Auflage ist neu geschrieben, kein Buchstabe blieb stehen. Ein katholischer Kollege nannte sie eine Bombe auf dem Spielplatz der Theologen.',
      en: 'A village pastor in Safenwil in the Aargau who has to preach on Sunday and finds that the liberal theology of his teachers gives him nothing for it – the more so since those same teachers had signed the Kaiser’s call to war in 1914. He starts reading Romans verse by verse and writes down the result. The second edition is rewritten, not a letter left standing. A Catholic colleague called it a bomb on the playground of the theologians.',
    },
    what: {
      de: 'Kein Kommentar im üblichen Sinn, sondern ein Angriff auf die Voraussetzung, dass zwischen Gott und Mensch ein stetiger Übergang bestehe – Religion, Erfahrung, Innerlichkeit, Fortschritt. Barth setzt dagegen Kierkegaards „unendlichen qualitativen Unterschied" und liest Paulus als Krisis: Gott ist der ganz Andere, der senkrecht von oben einbricht, und Religion ist die letzte und feinste Weise, ihm auszuweichen. Zwölf Jahre später schreibt derselbe Mann den Text der Barmer Erklärung.',
      en: 'Not a commentary in the usual sense but an attack on the premise that there is a continuous passage between God and humanity – religion, experience, inwardness, progress. Barth sets against it Kierkegaard’s "infinite qualitative difference" and reads Paul as crisis: God is the wholly other who breaks in vertically from above, and religion is the last and finest way of evading him. Twelve years later the same man writes the text of the Barmen Declaration.',
    },
    bible: {
      de: 'Das ist der Bruch, mit dem die Theologie des 20. Jahrhunderts anfängt, und er wird an einer Bibelauslegung vollzogen, nicht an einem System. Barth nimmt die historische Kritik nicht zurück – er hält sie für zu harmlos: Wer nur feststellt, was Paulus gemeint haben könnte, hat noch nicht gehört, was da steht. Dass ein solches Buch auf einem Philosophieregal steht, ist kein Versehen: Es ist die schärfste Absage an jede Philosophie als Zugang zu Gott, und sie musste in deren eigener Sprache formuliert werden.',
      en: 'This is the break with which 20th-century theology begins, and it is carried out in a piece of biblical exegesis, not in a system. Barth does not withdraw historical criticism – he thinks it too harmless: whoever merely establishes what Paul might have meant has not yet heard what stands there. That such a book sits on a philosophy shelf is no accident: it is the sharpest refusal of any philosophy as access to God, and it had to be formulated in philosophy’s own language.',
    },
    books: ['Rom', 'Hab', '1Cor'],
    links: [
      { to: 'schleiermacher-reden', kind: 'against', de: 'Der Ausweg über das Gefühl wird zugeschlagen: Wer von Gott redet, indem er vom Menschen redet, redet nur lauter vom Menschen.', en: 'The exit through feeling is shut: whoever speaks of God by speaking of humanity is only speaking of humanity more loudly.' },
      { to: 'kierkegaard-furcht', kind: 'builds', de: 'Der „unendliche qualitative Unterschied" ist Kierkegaards Wort – Barth macht daraus den Grundriss einer Dogmatik.', en: 'The "infinite qualitative difference" is Kierkegaard’s phrase – Barth turns it into the ground plan of a dogmatics.' },
      { to: 'feuerbach-wesen', kind: 'builds', de: 'Barth gibt Feuerbach recht – über die Religion. Sie sei wirklich Menschenwerk, und genau deshalb nicht der Ort, an dem Gott zu finden ist.', en: 'Barth concedes Feuerbach’s case – about religion. It really is a human product, and that is exactly why it is not where God is found.' },
    ],
    event: 'barmen',
    wiki: 'Der Römerbrief (Karl Barth)', wikiEn: 'The Epistle to the Romans (book)',
  },
  {
    id: 'buber-ich-du', kind: 'essay',
    author: { de: 'Martin Buber', en: 'Martin Buber' },
    lived: { de: '1878–1965', en: '1878–1965' },
    original: 'Ich und Du',
    de: 'Ich und Du', en: 'I and Thou',
    shortDe: 'Ich und Du', shortEn: 'I and Thou',
    period: 'moderne', year: 1923, from: 1919, to: 1923,
    when: { de: '1923', en: '1923' },
    thesis: {
      de: 'Alles wirkliche Leben ist Begegnung – und Gott ist das Du, das nie zum Es wird.',
      en: 'All real living is meeting – and God is the Thou that never becomes an It.',
    },
    who: {
      de: 'Ein Wiener Jude, in Galizien bei den Chassidim aufgewachsen, Religionsphilosoph in Frankfurt, 1938 nach Jerusalem emigriert. Zwei Jahre nach diesem Buch beginnt er mit Franz Rosenzweig die „Verdeutschung der Schrift" – eine Bibelübersetzung, die den hebräischen Klang bis in die Wortstellung hinein hörbar machen will und die bis heute anders klingt als jede andere.',
      en: 'A Viennese Jew raised among the Hasidim in Galicia, philosopher of religion in Frankfurt, emigrating to Jerusalem in 1938. Two years after this book he begins, with Franz Rosenzweig, the "Germanising of scripture" – a Bible translation that wants to make the Hebrew sound audible down to the word order, and that still sounds unlike any other.',
    },
    what: {
      de: 'Es gibt zwei Grundworte, und sie sind nicht Wörter, sondern Wortpaare: Ich-Du und Ich-Es. Im einen begegne ich, im anderen gebrauche ich – und ich bin in beiden ein anderer. Keiner kann nur im Du leben; jede Begegnung sinkt zum Es zurück, und das ist die Traurigkeit unseres Loses. Aber jede Linie der Du-Beziehungen schneidet sich im ewigen Du, das sich nicht zum Gegenstand machen lässt.',
      en: 'There are two basic words, and they are not words but word pairs: I-Thou and I-It. In the one I meet, in the other I use – and I am a different person in each. No one can live only in the Thou; every meeting sinks back into It, and that is the sadness of our lot. But every line of Thou-relations intersects in the eternal Thou, which cannot be made an object.',
    },
    bible: {
      de: 'Die Wirkung auf die christliche Theologie war sofort und groß: Gogarten, Brunner, Barth, Bonhoeffer, später die ganze Rede von Gott als Person und vom Gebet als Anrede. Und für das Lesen der Bibel folgt daraus etwas Handfestes: Der Text will nicht analysiert, sondern gehört werden – ein Anspruch, der mit der historischen Kritik nicht bricht, aber ihr die letzte Zuständigkeit bestreitet.',
      en: 'The effect on Christian theology was immediate and large: Gogarten, Brunner, Barth, Bonhoeffer, later all talk of God as person and of prayer as address. And for reading the Bible something concrete follows: the text asks not to be analysed but to be heard – a claim that does not break with historical criticism but denies it the final word.',
    },
    books: ['Exod', 'Ps', 'Hos'],
    links: [
      { to: 'kierkegaard-furcht', kind: 'builds', de: 'Der Einzelne vor Gott – nun nicht im Schweigen, sondern in der Anrede.', en: 'The single individual before God – now not in silence but in address.' },
      { to: 'feuerbach-wesen', kind: 'against', de: 'Wenn Gott ein Du ist und kein Es, ist er nicht das Bild, das ein Ich sich macht.', en: 'If God is a Thou and not an It, he is not the image an I makes for itself.' },
    ],
    wiki: 'Ich und Du', wikiEn: 'I and Thou',
  },
  {
    id: 'heidegger-sein-zeit', kind: 'traktat',
    author: { de: 'Martin Heidegger', en: 'Martin Heidegger' },
    lived: { de: '1889–1976', en: '1889–1976' },
    original: 'Sein und Zeit',
    de: 'Sein und Zeit', en: 'Being and Time',
    shortDe: 'Sein und Zeit', shortEn: 'Being and Time',
    period: 'moderne', year: 1927, from: 1923, to: 1927,
    when: { de: '1927, unvollendet', en: '1927, unfinished' },
    thesis: {
      de: 'Der Mensch ist das Wesen, dem es um sein eigenes Sein geht – und das weiß, dass es endet.',
      en: 'The human being is the being for whom its own being is at issue – and who knows that it ends.',
    },
    who: {
      de: 'Ein Marburger Privatdozent, der aus dem katholischen Priesterseminar kam, veröffentlicht unter Zeitdruck, um eine Professur zu bekommen; das Buch bricht deshalb mitten im Plan ab. Sein Kollege in Marburg ist Rudolf Bultmann. 1933 lässt Heidegger sich zum Rektor in Freiburg wählen und tritt in die NSDAP ein – im selben Jahr, in dem Kollegen ihre Stellen verlieren, und ein Jahr vor Barmen. Das gehört zu diesem Buch dazu, auch wenn es nicht darin steht.',
      en: 'A Marburg lecturer who had come out of the Catholic seminary publishes under time pressure to secure a chair; the book therefore breaks off mid-plan. His colleague in Marburg is Rudolf Bultmann. In 1933 Heidegger has himself elected rector in Freiburg and joins the Nazi party – in the same year colleagues lose their posts, and a year before Barmen. That belongs to this book, even though it is not in it.',
    },
    what: {
      de: 'Die Frage nach dem Sein wird neu gestellt, und zwar bei dem Seienden, das danach fragt: dem Dasein. Es ist nie zuerst ein Subjekt gegenüber Objekten, sondern immer schon in der Welt, besorgend, mit anderen. Es findet sich vor, ohne sich gewählt zu haben – Geworfenheit – und verfällt an das Man, das ihm die Entscheidungen abnimmt. Eigentlich wird es erst im Vorlaufen zum Tod, der eigensten, unüberholbaren Möglichkeit.',
      en: 'The question of being is posed anew, and posed at the being that asks it: Dasein. It is never first a subject facing objects but always already in the world, concerned, with others. It finds itself there without having chosen – thrownness – and falls into the They, which takes decisions off its hands. It becomes authentic only in running ahead to death, its ownmost and unsurpassable possibility.',
    },
    bible: {
      de: 'Bultmann nimmt diese Begriffe und legt mit ihnen das Neue Testament aus: Entscheidung, Eigentlichkeit, Existenz – die Entmythologisierung ist die Übersetzung des Kerygmas in diese Sprache. Das war die einflussreichste Verbindung von Philosophie und Exegese im 20. Jahrhundert und zugleich die umstrittenste, weil sie den Glauben an eine Selbstauslegung des Menschen bindet. Heideggers Herkunft hat übrigens eine Quelle, die er selbst nennt: die Schriften des jungen Luther und Kierkegaard.',
      en: 'Bultmann takes these concepts and expounds the New Testament with them: decision, authenticity, existence – demythologising is the translation of the kerygma into this language. That was the most influential union of philosophy and exegesis in the 20th century and at the same time the most contested, because it binds faith to a human self-interpretation. Heidegger’s own descent, incidentally, has a source he names himself: the writings of the young Luther, and Kierkegaard.',
    },
    books: ['Rom', 'Eccl', '1Cor'],
    links: [
      { to: 'kierkegaard-furcht', kind: 'builds', de: 'Angst, Entscheidung, der Einzelne – aus der Theologie herausgenommen und zur Beschreibung gemacht.', en: 'Anxiety, decision, the single individual – taken out of theology and turned into description.' },
      { to: 'augustinus-confessiones', kind: 'echoes', de: 'Die Frage nach der Zeit aus dem elften Buch der Bekenntnisse, noch einmal von vorn gestellt.', en: 'The question of time from book eleven of the Confessions, asked once more from the start.' },
    ],
    event: 'barmen',
    wiki: 'Sein und Zeit', wikiEn: 'Being and Time',
  },
  {
    id: 'weil-schwerkraft', kind: 'aphorismen',
    author: { de: 'Simone Weil', en: 'Simone Weil' },
    lived: { de: '1909–1943', en: '1909–1943' },
    original: 'La pesanteur et la grâce',
    de: 'Schwerkraft und Gnade', en: 'Gravity and Grace',
    shortDe: 'Schwerkraft', shortEn: 'Gravity and Grace',
    period: 'moderne', year: 1947, from: 1940, to: 1947,
    when: { de: 'Hefte 1940–1942, gedruckt 1947', en: 'notebooks 1940–1942, printed 1947' },
    thesis: {
      de: 'Alles Seelische fällt wie ein Stein; nur die Gnade fällt nach oben.',
      en: 'Everything in the soul falls like a stone; only grace falls upward.',
    },
    who: {
      de: 'Philosophielehrerin aus einer jüdischen Pariser Familie, die 1934 ihre Stelle aufgab und ein Jahr an Werkbänken bei Renault und Alsthom arbeitete, um zu wissen, wovon sie redete; 1936 nach Spanien in den Bürgerkrieg; 1938 in Solesmes, bei rasenden Kopfschmerzen, eine Erfahrung, die sie nie „Bekehrung" nannte. Sie blieb ungetauft, aus Solidarität mit denen draußen. 1943 stirbt sie mit vierunddreißig in England, geschwächt, weil sie nicht mehr essen wollte als die Menschen im besetzten Frankreich. Dieses Buch hat sie nie geschrieben: Gustave Thibon stellte es aus den Heften zusammen, die sie ihm 1942 dagelassen hatte.',
      en: 'A philosophy teacher from a Jewish Parisian family, who gave up her post in 1934 and spent a year at the machines of Renault and Alsthom in order to know what she was talking about; in 1936 to the civil war in Spain; in 1938 at Solesmes, amid splitting headaches, an experience she never called a conversion. She stayed unbaptised, in solidarity with those outside. In 1943 she dies at thirty-four in England, weakened because she would not eat more than people in occupied France. She never wrote this book: Gustave Thibon assembled it from the notebooks she left with him in 1942.',
    },
    what: {
      de: 'Kurze Stücke um einige wenige Begriffe. Die Schwerkraft ist das Gesetz, nach dem die Seele sich selbst sucht – auch im Mitleid, auch im Gebet. Die Gnade ist das Einzige, was ihm nicht folgt, und sie kommt nur in das Leere, das man nicht selbst füllt: Entschöpfung, das Gegenstück zur Schöpfung, das Zurücknehmen des eigenen Ich. Dazu zwei Sätze, die ihre Wirkung ausmachen: Aufmerksamkeit in ihrer höchsten Form sei dasselbe wie Gebet – und das Unglück, das *malheur*, sei nicht Schmerz, sondern das, was einen Menschen entwurzelt, bis er nichts mehr sagen kann.',
      en: 'Short pieces around very few terms. Gravity is the law by which the soul seeks itself – in pity too, in prayer too. Grace is the only thing that does not follow it, and it enters only the emptiness one does not fill oneself: decreation, the counterpart of creation, the taking back of one’s own I. With it two sentences that account for her influence: attention in its highest form is the same thing as prayer – and affliction, malheur, is not pain but what uproots a person until they can no longer speak.',
    },
    bible: {
      de: 'Weil liest die Bibel gegen den Strich und gerade dadurch genau: Das Buch Hiob ist ihr nicht die Frage nach Gottes Gerechtigkeit, sondern die Beschreibung dessen, was Unglück mit einem Menschen macht; Philipper 2, wo Christus sich selbst entleert, wird zum Muster jeder Liebe; Matthäus 25 – „ich war hungrig" – liest sie als Aufmerksamkeit, die im Unglücklichen niemanden übersieht. Ihr Verhältnis zum Alten Testament war schwierig bis abweisend, und sie hat das nie ausgeglichen; was bleibt, ist eine Sprache für das, wovon fromme Rede meist schweigt.',
      en: 'Weil reads the Bible against the grain and for that very reason precisely: the book of Job is for her not the question of God’s justice but a description of what affliction does to a person; Philippians 2, where Christ empties himself, becomes the pattern of all love; Matthew 25 – "I was hungry" – she reads as attention that overlooks no one in their affliction. Her relation to the Old Testament was difficult to dismissive, and she never squared it; what remains is a language for what pious speech usually passes over.',
    },
    books: ['Job', 'Phil', 'Matt'],
    links: [
      { to: 'platon-politeia', kind: 'echoes', de: 'Weil liest die Höhle als geistliche Erfahrung – Platon sei ein Mystiker gewesen, und das Gute jenseits des Seins sei nichts anderes als Gott.', en: 'Weil reads the cave as spiritual experience – Plato was a mystic, she says, and the Good beyond being is nothing other than God.' },
      { to: 'pascal-pensees', kind: 'echoes', de: 'Wieder Bruchstücke aus einem Nachlass, wieder ein Mensch, der sich selbst im Weg steht – und wieder kein System daraus geworden.', en: 'Fragments from a posthumous file again, again a person in their own way – and again no system made of it.' },
      { to: 'marx-hegelkritik', kind: 'against', de: 'Sie kannte die Fabrik von innen und blieb dabei, dass Unterdrückung nicht nur den Besitz betrifft, sondern die Aufmerksamkeit: Wer erschöpft ist, kann nicht mehr denken.', en: 'She knew the factory from inside and held that oppression is not only about ownership but about attention: the exhausted can no longer think.' },
    ],
    wiki: 'Simone Weil', wikiEn: 'Simone Weil',
  },
  {
    id: 'arendt-vita-activa', kind: 'essay',
    author: { de: 'Hannah Arendt', en: 'Hannah Arendt' },
    lived: { de: '1906–1975', en: '1906–1975' },
    original: 'The Human Condition',
    de: 'Vita activa oder Vom tätigen Leben', en: 'The Human Condition',
    shortDe: 'Vita activa', shortEn: 'Human Condition',
    period: 'moderne', year: 1958, from: 1954, to: 1960,
    when: { de: '1958, deutsch 1960', en: '1958, German 1960' },
    thesis: {
      de: 'Menschen sind geboren, nicht bloß sterblich – und mit jedem Anfang ist etwas möglich, das niemand berechnen kann.',
      en: 'Human beings are born, not merely mortal – and with every beginning something becomes possible that no one can calculate.',
    },
    who: {
      de: 'Eine deutsche Jüdin, 1933 verhaftet und geflohen, 1940 im französischen Lager Gurs interniert, 1941 in die USA entkommen. Ihre Doktorarbeit von 1929 galt dem Liebesbegriff bei Augustinus; von dort stammt der Begriff, mit dem dieses Buch endet. Fünf Jahre später berichtet sie vom Eichmann-Prozess in Jerusalem und prägt das Wort von der Banalität des Bösen, das ihr viele Freundschaften kostet.',
      en: 'A German Jew, arrested and fled in 1933, interned in the French camp at Gurs in 1940, escaped to the USA in 1941. Her 1929 doctorate was on the concept of love in Augustine; from there comes the term with which this book ends. Five years later she reports on the Eichmann trial in Jerusalem and coins the phrase about the banality of evil, which costs her many friendships.',
    },
    what: {
      de: 'Drei Tätigkeiten werden unterschieden: Arbeiten hält am Leben und hinterlässt nichts; Herstellen macht eine dauerhafte Welt; Handeln geschieht zwischen Menschen, in Sprache, und ist das Einzige, was neu anfangen kann. Die Neuzeit hat sie in der falschen Reihenfolge gewichtet und alles zur Arbeit gemacht. Am Ende steht die Natalität: Dass Menschen geboren werden, heißt, dass Geschichte nicht festgelegt ist – und der Ausweg aus dem Unwiderruflichen heißt Verzeihen.',
      en: 'Three activities are distinguished: labour keeps us alive and leaves nothing behind; work makes a durable world; action happens between people, in speech, and is the only thing that can begin anew. Modernity has weighted them in the wrong order and turned everything into labour. At the end stands natality: that human beings are born means history is not fixed – and the way out of the irreversible is called forgiveness.',
    },
    bible: {
      de: 'Arendt bezieht sich an der entscheidenden Stelle ausdrücklich auf Jesus von Nazareth: Er habe die Macht, zu verzeihen, als menschliche Möglichkeit entdeckt, nicht nur als göttliche – und ohne Verzeihen bliebe Handeln in seinen Folgen gefangen. Damit steht ein Kernwort des Evangeliums in einem politischen Buch, von einer Denkerin, die sich selbst nicht als gläubig verstand. Das Weihnachtswort „Uns ist ein Kind geboren" zitiert sie als Formel der Hoffnung, die das Buch beschließt.',
      en: 'At the decisive point Arendt refers explicitly to Jesus of Nazareth: he discovered the power of forgiving as a human possibility, not only a divine one – and without forgiving, action would stay caught in its consequences. So a core word of the gospel stands in a political book, written by a thinker who did not understand herself as a believer. The Christmas line "a child has been born to us" she quotes as the formula of hope that closes the book.',
    },
    books: ['Matt', 'Isa', 'Gen'],
    links: [
      { to: 'augustinus-civitate', kind: 'builds', de: 'Augustins Anfang – „damit ein Anfang sei, wurde der Mensch geschaffen" – wird zum politischen Grundwort.', en: 'Augustine’s beginning – "that there be a beginning, man was created" – becomes a political first word.' },
      { to: 'heidegger-sein-zeit', kind: 'against', de: 'Nicht das Sein zum Tode, sondern das Geborensein macht den Menschen aus.', en: 'Not being-toward-death but having-been-born is what makes the human being.' },
    ],
    wiki: 'Vita activa', wikiEn: 'The Human Condition (Arendt book)',
  },
  {
    id: 'levinas-totalitaet', kind: 'traktat',
    author: { de: 'Emmanuel Levinas', en: 'Emmanuel Levinas' },
    lived: { de: '1906–1995', en: '1906–1995' },
    original: 'Totalité et Infini',
    de: 'Totalität und Unendliches', en: 'Totality and Infinity',
    shortDe: 'Totalität', shortEn: 'Totality',
    period: 'moderne', year: 1961, from: 1957, to: 1961,
    when: { de: '1961', en: '1961' },
    thesis: {
      de: 'Das Gesicht des Anderen befiehlt, bevor ich etwas über ihn weiß: Du sollst nicht töten.',
      en: 'The face of the other commands before I know anything about him: thou shalt not kill.',
    },
    who: {
      de: 'In Litauen geboren, in Straßburg und Freiburg ausgebildet – er hatte bei Husserl und Heidegger gehört und beide nach Frankreich vermittelt. Als französischer Soldat kommt er in Kriegsgefangenschaft und überlebt; seine litauische Familie wird ermordet. Danach schreibt er Philosophie und hält daneben jahrzehntelang talmudische Vorlesungen – zwei Werke, die er ausdrücklich getrennt hielt.',
      en: 'Born in Lithuania, trained in Strasbourg and Freiburg – he had attended Husserl and Heidegger and introduced both to France. As a French soldier he is taken prisoner of war and survives; his Lithuanian family is murdered. Afterwards he writes philosophy and for decades also gives Talmudic lectures – two bodies of work he deliberately kept apart.',
    },
    what: {
      de: 'Die abendländische Philosophie habe alles auf das Selbe zurückgeführt und damit den Anderen verschluckt – das nennt Levinas Totalität. Dagegen steht die Erfahrung des Antlitzes: Ein Gesicht ist kein Gegenstand der Wahrnehmung, sondern eine Forderung, die mich zur Verantwortung ruft, bevor ich zustimme. Ethik ist deshalb nicht ein Gebiet der Philosophie, sondern die erste Philosophie, vor aller Ontologie.',
      en: 'Western philosophy, he argues, has reduced everything to the same and thereby swallowed the other – Levinas calls that totality. Against it stands the experience of the face: a face is not an object of perception but a demand that calls me to responsibility before I consent. Ethics is therefore not a branch of philosophy but first philosophy, prior to all ontology.',
    },
    bible: {
      de: 'Das ist eine Philosophie, die von Witwe, Waise und Fremdling redet – den drei Gruppen, die im 5. Buch Mose unter besonderem Schutz stehen – und die damit das hebräische Gebot mitten in die europäische Begriffssprache setzt. Für die christliche Theologie ist Levinas seit den sechziger Jahren einer der wichtigsten Gesprächspartner: in der Rede vom Nächsten, in der Ethik der Gastfreundschaft, und in der Frage, ob eine Kirche, die vom Anderen redet, ihm je begegnet ist.',
      en: 'This is a philosophy that speaks of widow, orphan and stranger – the three groups under special protection in Deuteronomy – and thereby sets the Hebrew commandment in the middle of European conceptual language. For Christian theology Levinas has been one of the most important conversation partners since the sixties: in talk of the neighbour, in an ethics of hospitality, and in the question whether a church that speaks of the other has ever met one.',
    },
    books: ['Deut', 'Lev', 'Matt'],
    links: [
      { to: 'heidegger-sein-zeit', kind: 'against', de: 'Nicht das Sein ist das Erste, sondern die Verantwortung – und der Lehrer wird zum Gegner.', en: 'Not being is first but responsibility – and the teacher becomes the opponent.' },
      { to: 'buber-ich-du', kind: 'builds', de: 'Buber hört ein Du; Levinas hört zuerst einen Befehl und erst danach ein Gespräch.', en: 'Buber hears a Thou; Levinas hears first a command and only then a conversation.' },
    ],
    event: 'aufhebung1965',
    wiki: 'Emmanuel Levinas', wikiEn: 'Totality and Infinity',
  },
  {
    id: 'ricoeur-symbolik', kind: 'traktat',
    author: { de: 'Paul Ricœur', en: 'Paul Ricœur' },
    lived: { de: '1913–2005', en: '1913–2005' },
    original: 'La symbolique du mal',
    de: 'Symbolik des Bösen', en: 'The Symbolism of Evil',
    shortDe: 'Symbolik d. Bösen', shortEn: 'Symbolism of Evil',
    period: 'moderne', year: 1960, from: 1960, to: 1965,
    when: { de: '1960', en: '1960' },
    thesis: {
      de: 'Das Symbol gibt zu denken – der Mythos ist nicht weniger wahr als der Begriff, nur anders.',
      en: 'The symbol gives rise to thought – myth is not less true than concept, only true differently.',
    },
    who: {
      de: 'Ein französischer Protestant, fünf Jahre deutscher Kriegsgefangener, in denen er Husserl übersetzte – auf die Ränder des Buches, weil er kein Papier hatte. Später lehrte er in Paris und Chicago und wurde zur Brücke zwischen französischer und angelsächsischer Philosophie. Er hat nie verheimlicht, dass er aus einer Kirche kommt, und nie theologisch argumentiert.',
      en: 'A French Protestant, five years a German prisoner of war, in which he translated Husserl – into the margins of the book, for want of paper. Later he taught in Paris and Chicago and became the bridge between French and Anglo-Saxon philosophy. He never concealed that he came from a church, and never argued theologically.',
    },
    what: {
      de: 'Ricœur geht den Bildern nach, in denen Menschen vom Bösen reden: Befleckung, Sünde, Schuld – und den Erzählungen, in denen sie es unterbringen, vom Chaoskampf bis zum Sündenfall. Keine davon lässt sich in einen Begriff auflösen, ohne zu verlieren, was sie weiß. Am Ende steht die Formel, die sein Werk trägt: „Das Symbol gibt zu denken", und daneben die zweite Naivität – die Fähigkeit, nach der Kritik wieder zu hören.',
      en: 'Ricœur follows the images in which people speak of evil: defilement, sin, guilt – and the narratives in which they house it, from the combat with chaos to the fall. None of them can be dissolved into a concept without losing what it knows. At the end stands the formula that carries his work: "the symbol gives rise to thought", and beside it the second naïveté – the ability to hear again after criticism.',
    },
    bible: {
      de: 'Das ist die Antwort auf zweihundert Jahre historische Kritik, die nicht hinter sie zurückgeht: Man kann wissen, wie ein Text entstanden ist, und ihn trotzdem hören. Ricœur hat später den Ausdruck „Schule des Verdachts" für Marx, Nietzsche und Freud geprägt – und ihm die Aneignung gegenübergestellt. Für die Bibelauslegung heißt das: Vor dem Text steht nicht nur ein Prüfer, sondern auch ein Leser, dem der Text eine Welt anbietet, in der er sich verstehen kann.',
      en: 'This is the answer to two hundred years of historical criticism that does not step back behind it: one can know how a text came to be and still hear it. Ricœur later coined the phrase "school of suspicion" for Marx, Nietzsche and Freud – and set appropriation against it. For biblical interpretation that means: before the text stands not only an examiner but also a reader to whom the text offers a world in which to understand himself.',
    },
    books: ['Gen', 'Job', 'Rom'],
    links: [
      { to: 'spinoza-ttp', kind: 'echoes', de: 'Die historische Lektüre bleibt – aber sie ist nicht die letzte Instanz über den Text.', en: 'The historical reading stays – but it is not the final authority over the text.' },
      { to: 'nietzsche-wissenschaft', kind: 'against', de: 'Der Verdacht wird ernst genommen und bekommt eine Grenze: Nach ihm kann wieder gehört werden.', en: 'Suspicion is taken seriously and given a limit: after it, hearing becomes possible again.' },
      { to: 'origenes-prinzipien', kind: 'echoes', de: 'Dass ein Text mehr als einen Sinn hat, ist alt – neu ist, dass das keine Flucht vor dem Wortsinn sein muss.', en: 'That a text has more than one sense is old – what is new is that this need not be an escape from the literal one.' },
    ],
    wiki: 'Paul Ricœur', wikiEn: 'Paul Ricœur',
  },
  {
    id: 'habermas-glauben', kind: 'essay',
    author: { de: 'Jürgen Habermas', en: 'Jürgen Habermas' },
    lived: { de: 'geboren 1929', en: 'born 1929' },
    original: 'Glauben und Wissen',
    de: 'Glauben und Wissen', en: 'Faith and Knowledge',
    shortDe: 'Glauben u. Wissen', shortEn: 'Faith & Knowledge',
    period: 'moderne', year: 2001, from: 2001, to: 2004,
    when: { de: 'Friedenspreisrede, 14. Oktober 2001', en: 'Peace Prize address, 14 October 2001' },
    thesis: {
      de: 'Die säkulare Vernunft darf nicht wegwerfen, was sie nicht selbst hervorgebracht hat – sie muss es übersetzen.',
      en: 'Secular reason must not discard what it did not itself produce – it has to translate it.',
    },
    who: {
      de: 'Der bekannteste lebende Philosoph Deutschlands, sein Leben lang Vertreter einer strikt weltlichen Vernunft, spricht einen Monat nach dem 11. September in der Frankfurter Paulskirche – und sagt einen Satz, den von ihm niemand erwartet hatte: Die Gesellschaft sei „postsäkular". Drei Jahre später diskutiert er in München mit Kardinal Ratzinger über die vorpolitischen Grundlagen des Staates; 2019 legt er mit „Auch eine Geschichte der Philosophie" zweitausend Seiten darüber vor, wie Glaube und Wissen sich seit der Achsenzeit gegenseitig geformt haben.',
      en: 'Germany’s best-known living philosopher, a lifelong advocate of strictly secular reason, speaks in the Paulskirche in Frankfurt a month after 11 September – and says something nobody expected from him: society is "post-secular". Three years later he debates the pre-political foundations of the state with Cardinal Ratzinger in Munich; in 2019 he publishes two thousand pages, Also a History of Philosophy, on how faith and knowledge have shaped each other since the axial age.',
    },
    what: {
      de: 'Postsäkular heißt nicht, dass die Religion zurückkehrt, sondern dass eine Gesellschaft sich darauf einstellt, dass sie bleibt. Daraus folgen für Habermas Pflichten auf beiden Seiten: Die Gläubigen müssen ihre Gründe in eine allgemein zugängliche Sprache übersetzen, wenn sie im Parlament gelten sollen – und die säkulare Seite darf religiöse Gehalte nicht als bloßen Rest behandeln, den man abräumt. Sein Beispiel ist die Gottebenbildlichkeit aus 1. Mose 1: Aus ihr sei die Menschenwürde geworden, und diese Übersetzung sei eine „rettende", keine Enteignung.',
      en: 'Post-secular does not mean religion is returning but that a society adjusts to its staying. From this Habermas derives duties on both sides: believers must translate their reasons into generally accessible language if those reasons are to count in parliament – and the secular side may not treat religious content as a leftover to be cleared away. His example is the image of God in Genesis 1: human dignity grew out of it, and that translation is a "saving" one, not an expropriation.',
    },
    bible: {
      de: 'Für Gemeinden ist das die freundlichste und die anstrengendste Anfrage zugleich: Dein Satz gilt – aber sag ihn so, dass er auch dort gilt, wo niemand deinen Glauben teilt. Und für die Bibelauslegung ist es eine Aufgabe, die dieses Regal ernst nimmt: Woher kommen Menschenwürde, Gleichheit vor dem Gesetz, die Idee einer offenen Zukunft? Habermas antwortet mit einer Genealogie statt mit einem Bekenntnis – und beantwortet damit Lessings Frage in einer Währung, die Lessing nicht hatte.',
      en: 'For congregations this is the friendliest and the most demanding question at once: your sentence counts – but say it so that it counts where nobody shares your faith. And for biblical interpretation it is a task this shelf takes seriously: where do human dignity, equality before the law, the idea of an open future come from? Habermas answers with a genealogy rather than a confession – and thereby answers Lessing’s question in a currency Lessing did not have.',
    },
    books: ['Gen', 'Isa', 'Rom'],
    links: [
      { to: 'kant-kritik', kind: 'builds', de: 'Kants Grenze bleibt – aber was jenseits von ihr gesagt wurde, ist damit nicht erledigt, sondern zu übersetzen.', en: 'Kant’s limit stands – but what was said beyond it is not thereby finished; it is to be translated.' },
      { to: 'marx-hegelkritik', kind: 'against', de: 'Religionskritik als Voraussetzung aller Kritik: Habermas hält daran fest und nimmt ihr den letzten Schritt – aufgehoben wird sie nicht.', en: 'Criticism of religion as the premise of all criticism: Habermas keeps that and withdraws its last step – religion is not to be abolished.' },
      { to: 'lessing-beweis', kind: 'echoes', de: 'Derselbe Graben, dritte Antwort: nicht überbrücken, nicht springen, sondern übersetzen.', en: 'The same ditch, a third answer: neither bridge it nor leap it, but translate.' },
    ],
    wiki: 'Jürgen Habermas', wikiEn: 'Jürgen Habermas',
  },
  {
    id: 'taylor-saekulares', kind: 'essay',
    author: { de: 'Charles Taylor', en: 'Charles Taylor' },
    lived: { de: 'geboren 1931', en: 'born 1931' },
    original: 'A Secular Age',
    de: 'Ein säkulares Zeitalter', en: 'A Secular Age',
    shortDe: 'Säkulare Zeit', shortEn: 'A Secular Age',
    period: 'moderne', year: 2007, from: 1999, to: 2007,
    when: { de: '2007', en: '2007' },
    thesis: {
      de: 'Säkular heißt nicht, dass niemand glaubt – sondern dass Glauben eine Möglichkeit unter anderen geworden ist.',
      en: 'Secular does not mean that no one believes – but that believing has become one option among others.',
    },
    who: {
      de: 'Ein kanadischer Philosoph aus Montreal, katholisch, der zuvor über die Quellen des modernen Selbst geschrieben hatte. Das Buch hat neunhundert Seiten und beantwortet eine einzige Frage: Warum war es 1500 praktisch unmöglich, nicht an Gott zu glauben, und ist es 2000 für viele selbstverständlich?',
      en: 'A Canadian philosopher from Montreal, a Catholic, who had previously written on the sources of the modern self. The book runs to nine hundred pages and answers a single question: why was it practically impossible in 1500 not to believe in God, and why is it self-evident for many in 2000?',
    },
    what: {
      de: 'Taylor bestreitet die übliche Erzählung, wonach Wissenschaft den Glauben einfach abgezogen habe – er nennt sie Subtraktionsgeschichten. Stattdessen beschreibt er einen Umbau: Aus dem „porösen" Selbst, das von Mächten durchdrungen werden kann, wird das „gepufferte", das sich selbst begrenzt; die Welt schließt sich zum immanenten Rahmen, in dem Transzendenz eine Entscheidung wird. Reformen, die den Glauben ernster machen wollten, haben diesen Rahmen mitgebaut.',
      en: 'Taylor disputes the usual story in which science simply subtracted faith – he calls those subtraction stories. Instead he describes a rebuilding: the "porous" self, open to being penetrated by powers, becomes the "buffered" self that bounds itself; the world closes into an immanent frame in which transcendence becomes a decision. Reforms that wanted to make faith more serious helped build that frame.',
    },
    bible: {
      de: 'Das ist die derzeit gründlichste Antwort auf die Frage, warum kirchliche Rede oft ins Leere geht – und sie ist weder Klage noch Triumph. Für eine Gemeinde heißt sie: Der Unglaube der Nachbarn ist kein Mangel an Argumenten, sondern eine andere Erfahrung von Welt. Und für das Lesen der Bibel heißt sie, dass ihre Texte aus einer porösen Welt kommen – Dämonen, Engel, Mächte – und bei gepufferten Lesern ankommen, die dafür keinen Ort mehr haben.',
      en: 'This is currently the most thorough answer to the question why church speech so often goes nowhere – and it is neither lament nor triumph. For a congregation it means: the neighbours’ unbelief is not a shortage of arguments but a different experience of the world. And for reading the Bible it means that its texts come out of a porous world – demons, angels, powers – and arrive with buffered readers who no longer have a place for them.',
    },
    books: ['Eph', 'Acts', 'Mark'],
    links: [
      { to: 'nietzsche-wissenschaft', kind: 'builds', de: 'Der tolle Mensch fragte, was wir getan haben; Taylor beschreibt, wie es geschah.', en: 'The madman asked what we have done; Taylor describes how it happened.' },
      { to: 'ockham-summa-logicae', kind: 'echoes', de: 'Taylor führt eine Spur bis hierher zurück: Wo nur Einzeldinge sind, wird die Welt zum Gegenstand.', en: 'Taylor traces a line back to here: where only individual things are, the world becomes an object.' },
      { to: 'habermas-glauben', kind: 'echoes', de: 'Dieselbe Lage, sechs Jahre später und mit umgekehrter Frage: Habermas fragt, was die säkulare Vernunft der Religion schuldet, Taylor, wie es zu dieser Vernunft überhaupt kam.', en: 'The same situation six years later, with the question reversed: Habermas asks what secular reason owes religion, Taylor how that reason came about at all.' },
    ],
    event: 'sueden',
    wiki: 'Ein säkulares Zeitalter', wikiEn: 'A Secular Age',
  },
];

export const PHIL_BY_ID: Record<string, PhilWork> = Object.fromEntries(PHIL_WORKS.map((w) => [w.id, w]));

/**
 * Wer zeigt auf dieses Werk? Wie im Bibelregal steht ein Verweis immer beim
 * zeigenden, also späteren Werk; ohne die Umkehrung sähe man von Platon aus
 * nicht, dass fünf spätere Bücher sich an ihm abarbeiten.
 */
export const PHIL_LINKS_TO: Record<string, { from: string; link: PhilLink }[]> = (() => {
  const map: Record<string, { from: string; link: PhilLink }[]> = {};
  for (const w of PHIL_WORKS) {
    for (const l of w.links) (map[l.to] ??= []).push({ from: w.id, link: l });
  }
  return map;
})();

/** Alle Werke eines Bretts, in der Reihenfolge der Jahre. */
export function worksInPeriod(periodId: string): PhilWork[] {
  return PHIL_WORKS.filter((w) => w.period === periodId).sort((a, b) => a.year - b.year);
}

/**
 * Der Zeitstrahl rechnet in Jahren, und zwar maßstabsgetreu und linear – anders
 * als die Leiste der Kirchengeschichte, die gleich breite Striche setzt. Der
 * Grund ist der Gegenstand: Dort zeigt die Leiste die Reihenfolge von
 * Ereignissen, hier ist der Abstand selbst die Aussage. Zwischen Boethius und
 * Anselm liegen 550 Jahre ohne einen Rücken, zwischen Kant und Hegel 26. Eine
 * Leiste mit gleichen Abständen behauptete das Gegenteil.
 *
 * Eine gestauchte Achse wäre möglich und war der erste Versuch. Sie ist wieder
 * herausgeflogen: Jede Stauchung verschiebt genau das, was hier gezeigt werden
 * soll – und sie half nicht einmal, denn gestaucht drängten sich die letzten
 * zweihundert Jahre in sieben Spuren übereinander, linear reichen vier.
 */
export const PHIL_VON = -400;
export const PHIL_BIS = 2030;

/** Anteil an der Achse, 0 bis 1. */
export function philPosition(year: number): number {
  return (Math.max(PHIL_VON, Math.min(PHIL_BIS, year)) - PHIL_VON) / (PHIL_BIS - PHIL_VON);
}

/**
 * Die Breite, auf der der Strahl gezeichnet wird. Er steht in einem seitlich
 * scrollenden Streifen wie die Bretter darunter: Eine Achse, die sich der
 * Fensterbreite anpasst, wäre auf dem Telefon 320 Pixel lang und müsste 2400
 * Jahre darauf unterbringen – dann lägen Kant und Hegel auf demselben Pixel.
 */
export const PHIL_STRAHL_BREIT = 1400;
export const PHIL_STRAHL_RAND = 18;
/** Abstand, unter dem zwei Marken einander verdecken würden. */
export const PHIL_MARKE_ABSTAND = 16;
/** Höhe einer Spur; die Zahl steht auch im Stylesheet der Ansicht. */
export const PHIL_SPUR_HOEHE = 20;

/**
 * Die Marken des Strahls – x aus dem Jahr, Spur aus dem Gedränge.
 *
 * Der x-Wert wird **nie** verschoben: Er ist die Aussage. Wo zwei Werke zu nah
 * beieinander liegen, um beide anklickbar zu sein – Pascal und Spinoza stehen
 * beide auf 1670 –, rückt das spätere eine Spur tiefer statt zur Seite. Der
 * Abstand bleibt damit wahr, und das Gedränge der letzten zweihundert Jahre
 * wird sichtbar, statt weggerechnet zu werden.
 *
 * Die Marken sind kleiner als die 24 Pixel, die WCAG 2.2 für ein Ziel verlangt.
 * Das ist hier zulässig, weil dieselbe Auswahl auf den Brettern darunter mit
 * vollen Rücken zu treffen ist – die Ausnahme „gleichwertige Bedienung an
 * anderer Stelle". Ohne diese Bretter dürfte der Strahl so nicht stehen.
 */
export function philLanes(works: PhilWork[] = PHIL_WORKS): { id: string; x: number; lane: number }[] {
  const nutz = PHIL_STRAHL_BREIT - 2 * PHIL_STRAHL_RAND;
  const letzte: number[] = [];
  const out: { id: string; x: number; lane: number }[] = [];
  for (const w of [...works].sort((a, b) => a.year - b.year || a.id.localeCompare(b.id))) {
    const x = PHIL_STRAHL_RAND + philPosition(w.year) * nutz;
    let lane = 0;
    while (letzte[lane] !== undefined && x - letzte[lane] < PHIL_MARKE_ABSTAND) lane++;
    letzte[lane] = x;
    out.push({ id: w.id, x, lane });
  }
  return out;
}

/** Wie viele Spuren der Strahl braucht – die Höhe des Streifens hängt daran. */
export function philSpuren(works: PhilWork[] = PHIL_WORKS): number {
  return philLanes(works).reduce((max, t) => Math.max(max, t.lane + 1), 1);
}

/** Die Jahresmarke auf derselben Achse – für die Beschriftung unter dem Strahl. */
export function philMarkX(year: number): number {
  return PHIL_STRAHL_RAND + philPosition(year) * (PHIL_STRAHL_BREIT - 2 * PHIL_STRAHL_RAND);
}

/** Die Jahresmarken unter dem Strahl – gesetzt, nicht gerechnet. */
export const PHIL_MARKEN: { year: number; de: string; en: string }[] = [
  { year: -400, de: '400 v. Chr.', en: '400 BC' },
  { year: 0, de: 'Zeitenwende', en: 'AD 1' },
  { year: 500, de: '500', en: '500' },
  { year: 1000, de: '1000', en: '1000' },
  { year: 1500, de: '1500', en: '1500' },
  { year: 1800, de: '1800', en: '1800' },
  { year: 2000, de: '2000', en: '2000' },
];

/*
 * Die vier Sätze, die in der Oberfläche über und unter dem Regal stehen.
 * Sie liegen hier und nicht in `i18n.ts` – aus demselben Grund wie die Notiz
 * über die 613 Gebote in `lawTexts.ts`: Das Wörterbuch wird beim ersten Aufruf
 * mitgeladen, dieses Regal erst mit der Ansicht. Vier Absätze Prosa im
 * Startpaket wären vier Absätze für jeden, der die Ansicht nie öffnet.
 */

/** Der Satz über dem Regal. */
export const PHIL_INTRO: Bilingual = {
  de: 'Kein Satz dieser Bibel wurde je ohne Vorverständnis gelesen. „Im Anfang war das Wort" steht auf Griechisch da, und „Logos" war ein besetzter Begriff; die Zwei-Naturen-Lehre redet in den Kategorien des Aristoteles, weil es andere nicht gab; und wer heute fragt, warum Glaube begründet werden muss, stellt eine Frage, die vor Kant so niemand gestellt hat. Fünfundvierzig Werke von Platon bis in die Gegenwart – ausgewählt nicht nach Rang, sondern nach der Frage: Hat dieses Buch verändert, wie über Gott, Schrift, Mensch und Welt geredet wird?',
  en: 'No sentence of this Bible was ever read without a prior understanding. "In the beginning was the Word" stands there in Greek, and "logos" was a loaded term; the doctrine of the two natures speaks in Aristotle’s categories because no others existed; and anyone asking today why faith must be justified is asking a question nobody put that way before Kant. Forty-five works from Plato to the present – chosen not by rank but by one question: did this book change how God, scripture, humanity and world are talked about?',
};

/** Was die Achse des Zeitstrahls zusagt – und was sie tut, wo zwei Werke sich decken. */
export const PHIL_ACHSE: Bilingual = {
  de: 'Der Zeitstrahl rechnet in Jahren, maßstabsgetreu: Zwischen Boethius und Anselm liegen 550 Jahre ohne einen Punkt, zwischen Kant und Hegel 26. Wo zwei Werke im selben Jahr erschienen – Pascal und Spinoza 1670 –, rückt der zweite Punkt eine Spur tiefer statt zur Seite; der Abstand bleibt damit wahr. Jeder Punkt ist auch als Rücken auf dem Brett darunter zu treffen.',
  en: 'The timeline counts in years, to scale: between Boethius and Anselm lie 550 years without a dot, between Kant and Hegel 26. Where two works appeared in the same year – Pascal and Spinoza in 1670 – the second dot drops a lane rather than shifting sideways, so the distance stays true. Every dot can also be hit as a spine on the shelf below.',
};

/** Warum die Breite eines Rückens hier nichts misst. */
export const PHIL_BREITE: Bilingual = {
  de: 'Auch auf diesem Regal sagt die Breite nichts. Die Summe der Theologie hat 2600 Artikel, der Brief an Menoikeus zwei Seiten – das ist keine gemeinsame Einheit, sondern zweimal etwas anderes. Die Farbe ist die Epoche, und sie ist dieselbe wie der Punkt auf dem Zeitstrahl.',
  en: 'On this shelf too the width says nothing. The Summa Theologiae has 2,600 articles, the Letter to Menoeceus two pages – that is not a shared unit but two different things. The colour is the period, and it is the same as the dot on the timeline.',
};

/** Woher die Idee kam. Der Link steht in der Oberfläche daneben. */
export const PHIL_ANSTOSS: Bilingual = {
  de: 'Der Anstoß für dieses Regal kam vom Philosophiepodcast, der seit 2021 genau das tut: philosophische Entwürfe lesen und ausdrücklich auch theologisch befragen –',
  en: 'The impulse for this shelf came from the philosophy podcast that has been doing exactly this since 2021: reading philosophical designs and putting theological questions to them –',
};
