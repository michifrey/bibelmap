// Das Bücherregal: die 66 Bücher, nach der Zeit ihrer Entstehung aufgestellt.
//
// Ein Regal ist eine Behauptung. Wer Bücher nebeneinanderstellt, sagt damit,
// dass sie zusammengehören, und wer sie ordnet, sagt, wie. Die Bibel wird fast
// immer in der Reihenfolge des Kanons gezeigt – 1. Mose bis Offenbarung –, und
// diese Reihenfolge ist keine der Entstehung: Der älteste Text des Neuen
// Testaments steht als 52. Buch (1. Thessalonicher, um 50), das jüngste
// Evangelium als 43. Der Kanon ordnet nach Art und Rang, nicht nach Datum.
//
// Deshalb drei Ordnungen, zwischen denen man umschaltet, und dieselben Rücken
// stehen jedes Mal woanders:
//
//   * **Entstehung** – wann geschrieben. Das ist die Ordnung, die es sonst
//     nirgends zu sehen gibt, und die einzige, die umstritten ist.
//   * **Erzählte Zeit** – wovon das Buch handelt. Sie kommt aus `books.ts`
//     (`era`) und ist dieselbe, nach der die Karte ihre Marker einfärbt.
//   * **Kanon** – die gewohnte Reihenfolge, nach Gruppen.
//
// **Die Datierung ist der heikle Teil, und darum steht sie zweimal da.**
// `from` und `to` sind nicht ein Datum mit Unschärfe, sondern die **Spanne der
// ernsthaft vertretenen Vorschläge**: Bei 1. Mose reicht sie von der
// traditionellen Zuschreibung an Mose (~1400 v. Chr.) bis zur Endredaktion in
// der Perserzeit (~450 v. Chr.). Das sind fast tausend Jahre, und diese Spanne
// zu verschweigen wäre die eigentliche Unehrlichkeit. `period` sagt daneben,
// auf welches Brett der Rücken gestellt wird – eine Entscheidung, keine
// Rechnung. `npm run check:shelf` prüft, dass `period` innerhalb der Spanne
// liegt: Ein Buch darf nicht auf einem Brett stehen, das seine eigenen Daten
// ausschließen.
//
// `disputed: true` heißt nicht „unsicher" – unsicher ist fast alles –, sondern:
// Hier stehen sich zwei Datierungen gegenüber, die zu verschiedenen Lesarten
// des Buches führen. Daniel im 6. oder im 2. Jahrhundert ist nicht dieselbe
// Frage wie Nahum 663 oder 640.
//
// `oldest` nennt die älteste erhaltene Handschrift des Buches und verweist auf
// ihren Fund in `finds.ts`. Das ist der zweite Grund für dieses Regal: Zwischen
// dem, was geschrieben wurde, und dem, was erhalten ist, liegen bei den meisten
// Büchern über tausend Jahre – und wer diese Lücke gefüllt hat, hat einen Namen.

import { BOOK_BY_OSIS, type BookMeta } from './books';

export interface Bilingual {
  de: string;
  en: string;
}

/** Wozu ein Buch gehört – die Farbe des Rückens, in jeder Ordnung dieselbe. */
export interface ShelfGroup {
  id: string;
  order: number;
  de: string;
  en: string;
  color: string;
  testament: 'AT' | 'NT';
}

export const GROUPS: ShelfGroup[] = [
  { id: 'tora', order: 1, de: 'Tora', en: 'Torah', color: '#b8742e', testament: 'AT' },
  { id: 'geschichte', order: 2, de: 'Geschichtsbücher', en: 'Historical books', color: '#a89321', testament: 'AT' },
  { id: 'weisheit', order: 3, de: 'Weisheit & Poesie', en: 'Wisdom & poetry', color: '#5c8a3a', testament: 'AT' },
  { id: 'prophetenGross', order: 4, de: 'Große Propheten', en: 'Major prophets', color: '#2f8f7f', testament: 'AT' },
  { id: 'prophetenKlein', order: 5, de: 'Kleine Propheten', en: 'Minor prophets', color: '#3a6ea8', testament: 'AT' },
  { id: 'evangelien', order: 6, de: 'Evangelien & Apostelgeschichte', en: 'Gospels & Acts', color: '#9a4ba0', testament: 'NT' },
  { id: 'paulus', order: 7, de: 'Paulusbriefe', en: 'Pauline letters', color: '#b0436b', testament: 'NT' },
  { id: 'briefe', order: 8, de: 'Übrige Briefe', en: 'Other letters', color: '#a83a3a', testament: 'NT' },
  { id: 'apokalypse', order: 9, de: 'Apokalypse', en: 'Apocalypse', color: '#c98a2b', testament: 'NT' },
  // Was nach dem letzten biblischen Buch weiterging – eigene Farbe, eigenes
  // Regalfach, und in `lawTexts.ts` zu Hause.
  { id: 'halacha', order: 10, de: 'Jüdische Gesetzestexte', en: 'Jewish legal texts', color: '#7a5aa8', testament: 'NT' },
];

export const GROUP_BY_ID: Record<string, ShelfGroup> = Object.fromEntries(GROUPS.map((g) => [g.id, g]));

/**
 * Die Bretter der Entstehungs-Ordnung. Sie reichen über den Kanon hinaus: Die
 * Mischna ist nicht das Ende einer Geschichte, sondern die Fortsetzung
 * derselben Arbeit am selben Text, und ein Regal, das bei der Offenbarung
 * aufhört, behauptet das Gegenteil.
 */
export interface Period {
  id: string;
  order: number;
  de: string;
  en: string;
  range: Bilingual;
  from: number;
  to: number;
  /** Was in dieser Zeit geschah – der Satz über dem Brett. */
  note: Bilingual;
  /** Bretter der Gesetzestexte stehen unter einer eigenen Überschrift. */
  law?: true;
}

export const PERIODS: Period[] = [
  {
    id: 'koenige', order: 1, de: 'Vor dem Exil', en: 'Before the exile',
    range: { de: 'bis 586 v. Chr.', en: 'to 586 BC' }, from: -1500, to: -587,
    note: {
      de: 'Solange es einen König in Jerusalem gibt, wird am Hof geschrieben und im Tempel aufbewahrt. Was aus dieser Zeit stammt, hat das Exil nur überlebt, weil jemand es mitnahm.',
      en: 'As long as there is a king in Jerusalem, writing happens at court and is kept in the temple. What comes from this time survived the exile only because somebody carried it along.',
    },
  },
  {
    id: 'exil', order: 2, de: 'Im Exil', en: 'In exile',
    range: { de: '586–538 v. Chr.', en: '586–538 BC' }, from: -586, to: -539,
    note: {
      de: 'Kein Tempel, kein König, kein Land. Was bleibt, ist der Text – und in diesen fünfzig Jahren wird aus einer Sammlung von Schriften das, woran sich ein Volk ohne Staat festhält.',
      en: 'No temple, no king, no land. What remains is the text – and in these fifty years a collection of writings becomes the thing a people without a state holds on to.',
    },
  },
  {
    id: 'perser', order: 3, de: 'Unter den Persern', en: 'Under the Persians',
    range: { de: '538–333 v. Chr.', en: '538–333 BC' }, from: -538, to: -334,
    note: {
      de: 'Die Rückkehrer bauen einen kleineren Tempel und ordnen, was sie mitgebracht haben. Esra liest das Gesetz öffentlich vor – der erste Auftritt eines Buches als Autorität.',
      en: 'The returnees build a smaller temple and put in order what they brought back. Ezra reads the law aloud in public – the first appearance of a book as an authority.',
    },
  },
  {
    id: 'hellen', order: 4, de: 'Griechische Zeit', en: 'The Greek period',
    range: { de: '333–63 v. Chr.', en: '333–63 BC' }, from: -333, to: -64,
    note: {
      de: 'Alexander, dann seine Erben, dann der Aufstand der Makkabäer. In Alexandria wird die Bibel zum ersten Mal übersetzt, am Toten Meer zieht sich eine Gemeinschaft mit ihren Rollen in die Wüste zurück.',
      en: 'Alexander, then his heirs, then the Maccabean revolt. In Alexandria the Bible is translated for the first time; by the Dead Sea a community withdraws into the desert with its scrolls.',
    },
  },
  {
    id: 'roemer', order: 5, de: 'Unter Rom, vor dem Tempelbrand', en: 'Under Rome, before the temple burned',
    range: { de: '63 v.–70 n. Chr.', en: '63 BC – AD 70' }, from: -63, to: 70,
    note: {
      de: 'Der Tempel steht noch, und die frühesten christlichen Schriften sind Briefe an Gemeinden, die es seit wenigen Jahren gibt. Kein Evangelium ist bisher geschrieben.',
      en: 'The temple is still standing, and the earliest Christian writings are letters to congregations only a few years old. No gospel has been written yet.',
    },
  },
  {
    id: 'nachtempel', order: 6, de: 'Nach dem Tempelbrand', en: 'After the temple burned',
    range: { de: 'ab 70 n. Chr.', en: 'from AD 70' }, from: 71, to: 150,
    note: {
      de: '70 brennt der Tempel, 135 endet der letzte Aufstand. Zwei Bewegungen schreiben in diesen Jahren auf, was ihnen ohne Tempel bleibt: die eine Evangelien, die andere Mischna.',
      en: 'In 70 the temple burns; in 135 the last revolt ends. Two movements write down what is left to them without a temple: one gospels, the other Mishnah.',
    },
  },
  {
    id: 'mischnazeit', order: 7, de: 'Zeit der Mischna', en: 'The age of the Mishnah',
    range: { de: '70–250 n. Chr.', en: 'AD 70–250' }, from: 71, to: 250, law: true,
    note: {
      de: 'Was Generationen mündlich weitergaben, wird zum Buch – aus Sorge, dass es sonst verloren geht.',
      en: 'What generations passed on by mouth becomes a book – out of fear that it would otherwise be lost.',
    },
  },
  {
    id: 'talmudzeit', order: 8, de: 'Zeit der Talmude', en: 'The age of the Talmuds',
    range: { de: '250–650 n. Chr.', en: 'AD 250–650' }, from: 251, to: 650, law: true,
    note: {
      de: 'Zwei Schulen, eine im Land, eine in Babylonien, legen dieselbe Mischna aus – und schreiben die Auslegung mit auf, samt der Gegenrede.',
      en: 'Two schools, one in the land and one in Babylonia, expound the same Mishnah – and write the exposition down, objections included.',
    },
  },
  {
    id: 'mittelalter', order: 9, de: 'Mittelalter', en: 'The Middle Ages',
    range: { de: '650–1500', en: '650–1500' }, from: 651, to: 1500, law: true,
    note: {
      de: 'Der Talmud ist zu groß geworden, um ihn zu befragen. Wer wissen will, was gilt, braucht ein Buch, das antwortet statt zu verhandeln.',
      en: 'The Talmud has grown too large to consult. Anyone who wants to know what applies needs a book that answers rather than debates.',
    },
  },
  {
    id: 'neuzeit', order: 10, de: 'Frühe Neuzeit', en: 'The early modern period',
    range: { de: 'ab 1500', en: 'from 1500' }, from: 1501, to: 1900, law: true,
    note: {
      de: 'Der Druck macht aus einem Handbuch einen gemeinsamen Standard – und aus einer Randbemerkung die zweite Hälfte desselben Buches.',
      en: 'Print turns a handbook into a shared standard – and a marginal note into the second half of the same book.',
    },
  },
];

export const PERIOD_BY_ID: Record<string, Period> = Object.fromEntries(PERIODS.map((p) => [p.id, p]));

/** Wie ein Buch auf ein anderes zeigt. */
export type LinkKind = 'quotes' | 'quoted' | 'parallel' | 'continues' | 'answers';

export interface BookLink {
  /** OSIS-Kürzel eines Buches oder die ID eines Gesetzestextes. */
  to: string;
  kind: LinkKind;
  de: string;
  en: string;
}

/** Die älteste erhaltene Handschrift eines Buches – und wer sie gefunden hat. */
export interface Oldest {
  /** ID eines Eintrags aus `finds.ts`. */
  find: string;
  /** Welche Handschrift genau, und aus welcher Zeit. */
  de: string;
  en: string;
}

export interface ShelfText {
  /** Wann geschrieben – und wer das bestreitet. Ein bis zwei Sätze. */
  dating: string;
  /** Die Lage, aus der das Buch kommt. */
  world: string;
}

export interface ShelfBook {
  osis: string;
  group: string;
  /** Brett der Entstehungs-Ordnung – eine Entscheidung innerhalb der Spanne. */
  period: string;
  /** Spanne der ernsthaft vertretenen Vorschläge; negativ = v. Chr. */
  from: number;
  to: number;
  /** Zwei Datierungen, die zu verschiedenen Lesarten führen. */
  disputed?: boolean;
  de: ShelfText;
  en: ShelfText;
  links: BookLink[];
  oldest: Oldest;
}

export const SHELF: ShelfBook[] = [
  /* --- Tora ------------------------------------------------------------- */
  {
    osis: 'Gen', group: 'tora', period: 'koenige', from: -1400, to: -450, disputed: true,
    de: {
      dating: 'Die Überlieferung schreibt die fünf Bücher Mose zu (~1400 v. Chr.); die historische Kritik sieht in ihnen mehrere Erzählfäden, die erst in der Königszeit zusammenwachsen und in der Perserzeit ihre Endgestalt bekommen. Zwischen beiden Antworten liegen fast tausend Jahre.',
      world: 'Die Erzählungen selbst spielen weit früher und in einer Welt, die die Archäologie kennt: Wanderhirten zwischen Mesopotamien und Ägypten, Verträge über Brunnen, ein Grabkauf vor Zeugen. Die Schöpfungs- und Flutgeschichten haben mesopotamische Nachbarn – Atrahasis, Gilgamesch –, und lesen sich Satz für Satz wie eine Antwort auf sie.',
    },
    en: {
      dating: 'Tradition ascribes the five books to Moses (c. 1400 BC); historical criticism sees several narrative strands growing together during the monarchy and reaching their final shape in the Persian period. Almost a thousand years lie between the two answers.',
      world: 'The stories themselves are set far earlier, in a world archaeology knows: herders moving between Mesopotamia and Egypt, contracts over wells, a grave bought before witnesses. The creation and flood accounts have Mesopotamian neighbours – Atrahasis, Gilgamesh – and read, line by line, like an answer to them.',
    },
    links: [
      { to: 'John', kind: 'quoted', de: 'Johannes beginnt mit denselben drei Wörtern: „Im Anfang".', en: 'John opens with the same three words: "In the beginning".' },
      { to: 'Rom', kind: 'quoted', de: 'Paulus hängt seine ganze Rechtfertigungslehre an einen Satz über Abraham (1. Mose 15,6).', en: 'Paul hangs his whole doctrine of justification on one sentence about Abraham (Genesis 15:6).' },
      { to: 'Heb', kind: 'quoted', de: 'Melchisedek, drei Verse in 1. Mose 14, trägt in Hebräer 7 ein ganzes Kapitel.', en: 'Melchizedek, three verses in Genesis 14, carries a whole chapter in Hebrews 7.' },
    ],
    oldest: { find: 'qumran', de: 'Fragmente aus mehreren Höhlen von Qumran, ältestes 4QGenᵍ, 1. Jh. v. Chr.', en: 'Fragments from several Qumran caves, the oldest 4QGenᵍ, 1st century BC.' },
  },
  {
    osis: 'Exod', group: 'tora', period: 'koenige', from: -1400, to: -450, disputed: true,
    de: {
      dating: 'Dieselbe Frage wie bei 1. Mose. Das Lied am Schilfmeer (2. Mose 15) gilt sprachlich als eines der ältesten Stücke der hebräischen Bibel – älter als der Text, der es umgibt.',
      world: 'Ägypten unter den Ramessiden baut mit Fronarbeit Vorratsstädte; der Name Pitom und Ramses steht im Buch, und beide Orte gibt es. Einen ägyptischen Bericht über den Auszug gibt es nicht – das wäre auch die Nachricht einer Niederlage, und solche Nachrichten hat kein Pharao in Stein schlagen lassen.',
    },
    en: {
      dating: 'The same question as Genesis. The Song at the Sea (Exodus 15) is linguistically reckoned among the oldest pieces in the Hebrew Bible – older than the text around it.',
      world: 'Ramesside Egypt builds store cities with forced labour; the book names Pithom and Rameses, and both places exist. There is no Egyptian account of the exodus – that would be the report of a defeat, and no pharaoh had such reports cut in stone.',
    },
    links: [
      { to: 'Matt', kind: 'quoted', de: '„Aus Ägypten habe ich meinen Sohn gerufen" – Matthäus legt die Kindheit Jesu über den Auszug.', en: '"Out of Egypt I called my son" – Matthew lays the childhood of Jesus over the exodus.' },
      { to: 'Heb', kind: 'quoted', de: 'Die Stiftshütte aus 2. Mose 25–40 ist in Hebräer 8–9 der Schatten, an dem alles gemessen wird.', en: 'The tabernacle of Exodus 25–40 is, in Hebrews 8–9, the shadow everything is measured against.' },
      { to: '1Cor', kind: 'quoted', de: '„Auch wir haben ein Passalamm" – Paulus liest 2. Mose 12 auf Karfreitag hin.', en: '"Christ, our Passover lamb" – Paul reads Exodus 12 towards Good Friday.' },
    ],
    oldest: { find: 'qumran', de: '4QpaleoExodᵐ in althebräischer Schrift, um 100 v. Chr.', en: '4QpaleoExodᵐ in palaeo-Hebrew script, c. 100 BC.' },
  },
  {
    osis: 'Lev', group: 'tora', period: 'exil', from: -1400, to: -450, disputed: true,
    de: {
      dating: 'Die Kritik ordnet 3. Mose der Priesterschrift zu und datiert es ins Exil oder kurz danach – die Zeit, in der es keinen Tempel gab und man umso genauer aufschrieb, wie er zu führen wäre. Die Überlieferung hält an Mose fest.',
      world: 'Opfervorschriften, Reinheitsregeln, ein Kalender – das Handbuch einer Priesterschaft. Die Nachbarvölker haben vergleichbare Texte; was fehlt, ist das Bild im Allerheiligsten, und diese Leerstelle ist der Punkt des ganzen Buches.',
    },
    en: {
      dating: 'Criticism assigns Leviticus to the Priestly source and dates it to the exile or just after – the time when there was no temple and people wrote down all the more precisely how it should be run. Tradition holds to Moses.',
      world: 'Sacrificial rules, purity law, a calendar – the handbook of a priesthood. Neighbouring peoples have comparable texts; what is missing is the image in the holy of holies, and that empty space is the point of the whole book.',
    },
    links: [
      { to: 'Heb', kind: 'quoted', de: 'Der Versöhnungstag aus 3. Mose 16 ist die Vorlage für Hebräer 9 und 10.', en: 'The Day of Atonement in Leviticus 16 is the template for Hebrews 9 and 10.' },
      { to: 'Luke', kind: 'quoted', de: '„Liebe deinen Nächsten wie dich selbst" steht in 3. Mose 19,18 – Jesus zitiert es als zweites Hauptgebot.', en: '"Love your neighbour as yourself" stands in Leviticus 19:18 – Jesus quotes it as the second great commandment.' },
      { to: 'mischna', kind: 'quoted', de: 'Die Ordnungen Kodaschim und Toharot der Mischna sind über weite Strecken Auslegung dieses Buches.', en: 'The Mishnah orders Kodashim and Tohorot are, for long stretches, exposition of this book.' },
    ],
    oldest: { find: 'qumran', de: '11QpaleoLevᵃ, althebräisch, 2./1. Jh. v. Chr.', en: '11QpaleoLevᵃ, palaeo-Hebrew, 2nd/1st century BC.' },
  },
  {
    osis: 'Num', group: 'tora', period: 'exil', from: -1400, to: -450, disputed: true,
    de: {
      dating: 'Wie 3. Mose überwiegend der Priesterschrift zugerechnet, mit deutlich älteren Einsprengseln: die Bileam-Sprüche in Kapitel 22–24 gelten als altes Dichtungsgut.',
      world: 'Vierzig Jahre zwischen Sinai und Jordan, erzählt als Reihe von Aufständen. Aus Deir Alla im Jordantal stammt eine Wandinschrift des 8. Jahrhunderts, die einen Seher namens Bileam nennt – derselbe Name, außerhalb der Bibel, an einem Ort, den das Buch kennt.',
    },
    en: {
      dating: 'Like Leviticus largely assigned to the Priestly source, with markedly older material inside it: the Balaam oracles of chapters 22–24 count as ancient poetry.',
      world: 'Forty years between Sinai and the Jordan, told as a sequence of revolts. From Deir Alla in the Jordan valley comes an 8th-century wall inscription naming a seer called Balaam – the same name, outside the Bible, at a place the book knows.',
    },
    links: [
      { to: 'John', kind: 'quoted', de: 'Die eherne Schlange aus 4. Mose 21 wird in Johannes 3,14 zum Bild für das Kreuz.', en: 'The bronze serpent of Numbers 21 becomes, in John 3:14, the image for the cross.' },
      { to: '1Cor', kind: 'quoted', de: 'Paulus nimmt die Wüstenjahre als Warnung an eine Gemeinde, die sich sicher fühlt (1. Korinther 10).', en: 'Paul takes the wilderness years as a warning to a congregation that feels safe (1 Corinthians 10).' },
    ],
    oldest: { find: 'ketefhinnom', de: 'Die Silberröllchen von Ketef Hinnom tragen den Segen aus 4. Mose 6,24–26 – um 600 v. Chr. und damit der älteste bekannte Bibeltext überhaupt.', en: 'The silver scrolls of Ketef Hinnom carry the blessing of Numbers 6:24–26 – c. 600 BC, and so the oldest known biblical text of any kind.' },
  },
  {
    osis: 'Deut', group: 'tora', period: 'koenige', from: -1400, to: -560, disputed: true,
    de: {
      dating: 'Das Buch, das 622 v. Chr. bei einer Tempelrenovierung gefunden wird (2. Könige 22), gilt seit 1805 weithin als 5. Mose oder als dessen Kern – die erste Datierung eines biblischen Buches, die aus der Bibel selbst gewonnen wurde.',
      world: 'Der Aufbau folgt den Vasallenverträgen der assyrischen Großkönige: Vorgeschichte, Bedingungen, Zeugen, Segen und Fluch. Ein Volk, das unter assyrischer Oberherrschaft steht, bekommt denselben Vertragstext – nur mit einem anderen Oberherrn.',
    },
    en: {
      dating: 'The book found during temple repairs in 622 BC (2 Kings 22) has been widely identified since 1805 with Deuteronomy or its core – the first dating of a biblical book won from the Bible itself.',
      world: 'Its structure follows the vassal treaties of the Assyrian great kings: prologue, stipulations, witnesses, blessing and curse. A people living under Assyrian overlordship is handed the same treaty form – with a different overlord.',
    },
    links: [
      { to: '2Kgs', kind: 'quoted', de: 'Das Buch, das Hilkija im Tempel findet, setzt Joschijas Reform in Gang – 2. Könige 22–23.', en: 'The book Hilkiah finds in the temple sets off Josiah’s reform – 2 Kings 22–23.' },
      { to: 'Matt', kind: 'quoted', de: 'Jesus antwortet dem Versucher dreimal, und dreimal aus 5. Mose.', en: 'Jesus answers the tempter three times, and three times out of Deuteronomy.' },
      { to: 'Mark', kind: 'quoted', de: 'Das Schma – „Höre, Israel" – ist Jesu Antwort auf die Frage nach dem höchsten Gebot.', en: 'The Shema – "Hear, O Israel" – is Jesus’ answer to the question about the greatest commandment.' },
    ],
    oldest: { find: 'nash', de: 'Der Papyrus Nash mit dem Dekalog und dem Schma, um 150–100 v. Chr. – bis 1947 die älteste bekannte hebräische Bibelhandschrift.', en: 'The Nash Papyrus with the Decalogue and the Shema, c. 150–100 BC – until 1947 the oldest known Hebrew biblical manuscript.' },
  },

  /* --- Geschichtsbücher -------------------------------------------------- */
  {
    osis: 'Josh', group: 'geschichte', period: 'koenige', from: -1200, to: -550, disputed: true,
    de: {
      dating: 'Josua eröffnet die Bücherreihe, die seit Martin Noth als „deuteronomistisches Geschichtswerk" zusammengefasst wird: Josua bis 2. Könige, aus derselben Feder redigiert, spätestens im Exil abgeschlossen.',
      world: 'Die Landnahme, wie das Buch sie erzählt, und der Befund im Boden lassen sich schwer zur Deckung bringen: Jericho und Ai liegen in der fraglichen Zeit nach heutigem Stand bereits in Trümmern, andere Städte zeigen keinen Bruch. Wie Israel ins Land kam, ist die am längsten offene Frage der Palästina-Archäologie.',
    },
    en: {
      dating: 'Joshua opens the sequence of books that, since Martin Noth, has been grouped as the "Deuteronomistic History": Joshua through 2 Kings, edited by one hand, finished in the exile at the latest.',
      world: 'The conquest as the book tells it and the evidence in the ground are hard to align: on current readings Jericho and Ai already lay in ruins at the relevant time, while other cities show no break at all. How Israel came into the land is the longest-standing open question in the archaeology of Palestine.',
    },
    links: [
      { to: 'Judg', kind: 'continues', de: 'Richter 1 erzählt dieselbe Landnahme noch einmal – und zählt auf, was gerade nicht erobert wurde.', en: 'Judges 1 tells the same settlement again – and lists what was precisely not taken.' },
      { to: 'Heb', kind: 'quoted', de: 'Rahab, die Hure von Jericho, steht in Hebräer 11 in der Reihe der Glaubenszeugen.', en: 'Rahab, the prostitute of Jericho, stands in Hebrews 11 among the witnesses of faith.' },
    ],
    oldest: { find: 'qumran', de: '4QJoshᵃ, 2./1. Jh. v. Chr. – mit einer abweichenden Stellung des Altarbaus.', en: '4QJoshᵃ, 2nd/1st century BC – with the altar-building episode in a different place.' },
  },
  {
    osis: 'Judg', group: 'geschichte', period: 'koenige', from: -1100, to: -550, disputed: true,
    de: {
      dating: 'Alte Stücke in einem späten Rahmen: Das Deboralied (Richter 5) gilt als eines der ältesten Gedichte der Bibel, der Kehrvers „damals war kein König in Israel" stammt von einem Bearbeiter, der einen hatte.',
      world: 'Die Eisenzeit I in den Bergen Palästinas: kleine Dörfer ohne Mauern, keine Zentralmacht, an der Küste die Philister mit besserem Eisen. Das Buch beschreibt genau diese Lage – eine Reihe regionaler Notlagen, in der jedes Mal jemand anderes aufsteht.',
    },
    en: {
      dating: 'Old material in a late frame: the Song of Deborah (Judges 5) counts among the oldest poems in the Bible, while the refrain "in those days there was no king in Israel" comes from an editor who had one.',
      world: 'Iron Age I in the hills of Palestine: small unwalled villages, no central power, and on the coast the Philistines with better iron. The book describes exactly that situation – a series of regional emergencies in which somebody different stands up each time.',
    },
    links: [
      { to: 'Ruth', kind: 'parallel', de: '„Zur Zeit, als die Richter richteten" – Rut erzählt dieselbe Epoche ohne ein einziges Schwert.', en: '"In the days when the judges ruled" – Ruth tells the same period without a single sword.' },
      { to: '1Sam', kind: 'continues', de: 'Samuel ist der letzte Richter und der, der den ersten König salbt.', en: 'Samuel is the last judge and the one who anoints the first king.' },
    ],
    oldest: { find: 'qumran', de: '4QJudgᵃ, um 50–25 v. Chr., ohne einen Abschnitt, den der spätere Text hat.', en: '4QJudgᵃ, c. 50–25 BC, lacking a passage the later text has.' },
  },
  {
    osis: 'Ruth', group: 'geschichte', period: 'perser', from: -1000, to: -400, disputed: true,
    de: {
      dating: 'Die Sprache wirkt alt, die Rechtsverhältnisse ebenfalls; der Schluss mit dem Stammbaum Davids und die Nähe zur Frage der Mischehen sprechen für die Perserzeit. Beides wird vertreten.',
      world: 'Eine Hungersnot treibt eine judäische Familie nach Moab – ins Land des Feindes. Zurück kommt eine Witwe mit einer moabitischen Schwiegertochter, und das Buch endet damit, dass diese Ausländerin die Urgroßmutter Davids wird. Gelesen wird es zu Schawuot, dem Erntefest.',
    },
    en: {
      dating: 'The language feels old, and so do the legal customs; the closing genealogy of David and the book’s proximity to the question of mixed marriages argue for the Persian period. Both are defended.',
      world: 'A famine drives a Judean family to Moab – into enemy country. A widow returns with a Moabite daughter-in-law, and the book ends by making that foreigner David’s great-grandmother. It is read at Shavuot, the harvest feast.',
    },
    links: [
      { to: 'Matt', kind: 'quoted', de: 'Rut steht im Stammbaum Jesu – eine von vier Frauen, die Matthäus nennt.', en: 'Ruth stands in the genealogy of Jesus – one of four women Matthew names.' },
      { to: 'Ezra', kind: 'answers', de: 'Esra und Nehemia lösen Mischehen auf; Rut erzählt von einer, aus der der König kam.', en: 'Ezra and Nehemiah dissolve mixed marriages; Ruth tells of one the king came from.' },
    ],
    oldest: { find: 'qumran', de: '2QRutᵃ und 4QRutᵃ, 1. Jh. v. Chr.', en: '2QRuthᵃ and 4QRuthᵃ, 1st century BC.' },
  },
  {
    osis: '1Sam', group: 'geschichte', period: 'koenige', from: -1000, to: -550, disputed: true,
    de: {
      dating: 'Im Kern die „Aufstiegsgeschichte Davids", die vielfach noch in die Königszeit datiert wird – ein höfischer Text, der erklärt, warum nicht Sauls Haus regiert. Die Endgestalt gehört zum deuteronomistischen Werk.',
      world: 'Der Übergang von Stammesbünden zum Königtum, erzählt mit erkennbarem Zögern: Die Bitte um einen König gilt dem Buch als Absage an Gott, und es erzählt sie trotzdem mit. Die Philisterstädte der Küste sind ausgegraben, ihre Keramik ist mykenisch.',
    },
    en: {
      dating: 'At its core the "History of David’s Rise", still widely dated to the monarchy – a court text explaining why Saul’s house does not rule. The final shape belongs to the Deuteronomistic History.',
      world: 'The move from tribal alliances to kingship, told with visible reluctance: the book treats the request for a king as a rejection of God, and tells it anyway. The Philistine cities on the coast have been excavated; their pottery is Mycenaean.',
    },
    links: [
      { to: '1Chr', kind: 'parallel', de: 'Die Chronik erzählt dieselben Jahre noch einmal – und lässt Saul fast ganz aus.', en: 'Chronicles tells the same years again – and leaves Saul out almost entirely.' },
      { to: 'Luke', kind: 'quoted', de: 'Hannas Lied (1. Samuel 2) ist die Vorlage für das Magnifikat.', en: 'Hannah’s song (1 Samuel 2) is the model for the Magnificat.' },
    ],
    oldest: { find: 'qumran', de: '4QSamᵇ, um 250 v. Chr. – eine der ältesten Bibelhandschriften überhaupt, mit einem Text näher an der Septuaginta als am späteren Hebräisch.', en: '4QSamᵇ, c. 250 BC – among the oldest biblical manuscripts of all, with a text closer to the Septuagint than to the later Hebrew.' },
  },
  {
    osis: '2Sam', group: 'geschichte', period: 'koenige', from: -1000, to: -550, disputed: true,
    de: {
      dating: 'Die „Thronfolgegeschichte" (2. Samuel 9–20 mit 1. Könige 1–2) gilt manchen als das älteste Stück Geschichtsschreibung der Welt; andere sehen darin eine spätere, literarisch gebaute Erzählung.',
      world: 'Ein König, der seinen Feldherrn in den Tod schickt, um dessen Frau zu bekommen, und ein Sohn, der gegen ihn putscht – erzählt vom eigenen Hof, ohne Beschönigung. Die Tel-Dan-Stele nennt rund hundert Jahre später das „Haus Davids"; sie ist der bislang einzige außerbiblische Beleg für die Dynastie.',
    },
    en: {
      dating: 'The "Succession Narrative" (2 Samuel 9–20 with 1 Kings 1–2) counts for some as the oldest piece of history writing in the world; others see in it a later, carefully built literary composition.',
      world: 'A king who sends his general to his death to take his wife, and a son who mounts a coup against him – told from his own court, unvarnished. The Tel Dan Stele names the "House of David" about a century later; it remains the only extrabiblical evidence for the dynasty.',
    },
    links: [
      { to: '1Chr', kind: 'parallel', de: 'Dieselbe Regierungszeit, ohne Batseba und ohne Absalom.', en: 'The same reign, without Bathsheba and without Absalom.' },
      { to: 'Ps', kind: 'parallel', de: 'Psalm 51 trägt die Überschrift „als der Prophet Nathan zu ihm kam".', en: 'Psalm 51 carries the heading "when Nathan the prophet came to him".' },
      { to: 'Acts', kind: 'quoted', de: 'Nathans Verheißung eines ewigen Thrones (2. Samuel 7) trägt die Predigten der Apostelgeschichte.', en: 'Nathan’s promise of an everlasting throne (2 Samuel 7) carries the sermons in Acts.' },
    ],
    oldest: { find: 'qumran', de: '4QSamᵃ, 1. Jh. v. Chr., mit mehreren längeren Lesarten, die im späteren hebräischen Text fehlen.', en: '4QSamᵃ, 1st century BC, with several longer readings absent from the later Hebrew text.' },
  },
  {
    osis: '1Kgs', group: 'geschichte', period: 'exil', from: -600, to: -540,
    de: {
      dating: 'Das Werk endet mit der Begnadigung Jojachins in Babylon (561 v. Chr.) – weiter reicht sein Wissen nicht, und damit ist die Untergrenze gesetzt. Als Quellen nennt es selbst die „Chronik der Könige von Juda" und die von Israel.',
      world: 'Salomos Bauten, die Reichsteilung, Elia gegen die Baalspropheten. Die assyrischen und moabitischen Inschriften derselben Zeit nennen mehrere der Könige beim Namen – Omri und Ahab stehen bei Salmanassar III., Mescha von Moab schreibt seine Sicht auf denselben Krieg.',
    },
    en: {
      dating: 'The work ends with Jehoiachin’s release in Babylon (561 BC) – its knowledge goes no further, which fixes the lower limit. It names its own sources: the "Chronicles of the Kings of Judah" and those of Israel.',
      world: 'Solomon’s building works, the division of the kingdom, Elijah against the prophets of Baal. Assyrian and Moabite inscriptions of the same period name several of the kings – Omri and Ahab appear in Shalmaneser III, and Mesha of Moab writes up his own side of the same war.',
    },
    links: [
      { to: '2Chr', kind: 'parallel', de: 'Die Chronik erzählt Salomo und danach nur noch Juda – das Nordreich kommt bei ihr kaum vor.', en: 'Chronicles tells Solomon and then only Judah – the northern kingdom barely appears.' },
      { to: 'Jas', kind: 'quoted', de: 'Jakobus nimmt Elia als Beispiel für das Gebet, das etwas bewirkt.', en: 'James takes Elijah as the example of prayer that achieves something.' },
    ],
    oldest: { find: 'qumran', de: '4QKgs und 5QKgs, Fragmente aus dem 2./1. Jh. v. Chr.', en: '4QKgs and 5QKgs, fragments from the 2nd/1st century BC.' },
  },
  {
    osis: '2Kgs', group: 'geschichte', period: 'exil', from: -600, to: -540,
    de: {
      dating: 'Derselbe Band wie 1. Könige – die Teilung in zwei Bücher kommt erst aus der griechischen Übersetzung, in der die Rolle sonst zu lang geworden wäre.',
      world: 'Der Untergang beider Reiche, 722 und 586. Für die Belagerung Jerusalems 701 gibt es zwei Berichte: 2. Könige 18–19 und das Prisma Sanheribs, das Hiskia „wie einen Vogel im Käfig" einschließt – und die Einnahme der Stadt gerade nicht meldet.',
    },
    en: {
      dating: 'The same volume as 1 Kings – the split into two books comes from the Greek translation, where the scroll would otherwise have grown too long.',
      world: 'The fall of both kingdoms, 722 and 586. For the siege of Jerusalem in 701 there are two accounts: 2 Kings 18–19, and Sennacherib’s prism, which shuts Hezekiah up "like a bird in a cage" – and conspicuously does not report taking the city.',
    },
    links: [
      { to: 'Deut', kind: 'quotes', de: 'Das Buch, das 622 im Tempel gefunden wird, misst rückwirkend jeden König.', en: 'The book found in the temple in 622 retroactively measures every king.' },
      { to: 'Jer', kind: 'parallel', de: 'Jeremia 52 wiederholt fast wörtlich das Ende von 2. Könige 25.', en: 'Jeremiah 52 repeats the end of 2 Kings 25 almost word for word.' },
    ],
    oldest: { find: 'qumran', de: '6QpapKgs auf Papyrus, 2. Jh. v. Chr.', en: '6QpapKgs on papyrus, 2nd century BC.' },
  },
  {
    osis: '1Chr', group: 'geschichte', period: 'perser', from: -400, to: -300,
    de: {
      dating: 'Die Genealogie in Kapitel 3 führt die Davidslinie mehrere Generationen über die Rückkehr hinaus; so weit reicht auch die Entstehungszeit – 4. Jahrhundert v. Chr., unter persischer Herrschaft.',
      world: 'Geschrieben für die, die zurückgekommen waren: kein Staat mehr, ein kleinerer Tempel, aber ein Kult. Deshalb neun Kapitel Namenslisten am Anfang – wer dazugehört, wird jetzt durch Abstammung entschieden, nicht durch ein Territorium.',
    },
    en: {
      dating: 'The genealogy in chapter 3 carries the Davidic line several generations past the return; the date of composition reaches just as far – the 4th century BC, under Persian rule.',
      world: 'Written for those who had come back: no state any more, a smaller temple, but a cult. Hence nine chapters of name lists at the start – belonging is now decided by descent, not by territory.',
    },
    links: [
      { to: '2Sam', kind: 'parallel', de: 'Dieselben Ereignisse, andere Auswahl: Was David schlecht aussehen lässt, fehlt.', en: 'The same events, a different selection: what makes David look bad is missing.' },
      { to: 'Ezra', kind: 'continues', de: 'Chronik, Esra und Nehemia gelten vielen als ein Werk; der Schluss der Chronik ist der Anfang von Esra.', en: 'Chronicles, Ezra and Nehemiah count for many as one work; the end of Chronicles is the beginning of Ezra.' },
    ],
    oldest: { find: 'leningradensis', de: 'Nur ein winziges Fragment (4QChr) aus Qumran; vollständig erst im Codex Leningradensis von 1008.', en: 'Only a tiny fragment (4QChr) from Qumran; complete first in the Leningrad Codex of 1008.' },
  },
  {
    osis: '2Chr', group: 'geschichte', period: 'perser', from: -400, to: -300,
    de: {
      dating: 'Zweiter Teil desselben Werks. Der letzte Absatz zitiert das Edikt des Kyrus von 538 – das Buch endet mit einer Erlaubnis, nach Hause zu gehen.',
      world: 'Die Chronik führt, wo Könige erzählt: Sie bringt Register, Dienstpläne, Baumaße. Für die Geschichte Judas ist sie an vielen Stellen die zweite, unabhängige Stimme – Hiskias Tunnel, Rehabeams Festungsstädte, Manasses Gefangenschaft stehen nur bei ihr.',
    },
    en: {
      dating: 'The second half of the same work. Its last paragraph quotes the edict of Cyrus of 538 – the book ends with permission to go home.',
      world: 'Where Kings narrates, Chronicles keeps records: registers, duty rosters, building measurements. For the history of Judah it is in many places the second, independent voice – Hezekiah’s tunnel, Rehoboam’s fortified cities and Manasseh’s captivity appear only here.',
    },
    links: [
      { to: '1Kgs', kind: 'parallel', de: 'Salomo zweimal erzählt – einmal mit den Fremdfrauen, einmal ohne.', en: 'Solomon told twice – once with the foreign wives, once without.' },
      { to: 'Ezra', kind: 'continues', de: 'Das Kyrus-Edikt steht am Ende der Chronik und am Anfang von Esra, fast gleichlautend.', en: 'The edict of Cyrus stands at the end of Chronicles and at the beginning of Ezra, almost identically worded.' },
    ],
    oldest: { find: 'leningradensis', de: 'Wie 1. Chronik: aus Qumran fast nichts, vollständig erst im Codex Leningradensis.', en: 'As 1 Chronicles: almost nothing from Qumran, complete first in the Leningrad Codex.' },
  },
  {
    osis: 'Ezra', group: 'geschichte', period: 'perser', from: -400, to: -300,
    de: {
      dating: 'Um 400 v. Chr. oder etwas später. Sieben Kapitel-Abschnitte stehen nicht auf Hebräisch, sondern auf Reichsaramäisch – der Kanzleisprache des Perserreichs, in der auch die zitierten Erlasse abgefasst sind.',
      world: 'Die Perser lassen unterworfene Völker ihre Kulte wiederherstellen; das Kyrus-Zylinder-Edikt aus Babylon sagt dasselbe für andere Tempel. Esras Auftrag ist Religionspolitik einer Großmacht – und für Juda die Rückkehr.',
    },
    en: {
      dating: 'Around 400 BC or a little later. Several sections are not in Hebrew but in Imperial Aramaic – the chancellery language of the Persian empire, in which the quoted decrees are also drafted.',
      world: 'The Persians let subject peoples restore their cults; the Cyrus Cylinder from Babylon says the same for other temples. Ezra’s commission is the religious policy of a great power – and, for Judah, the return.',
    },
    links: [
      { to: 'Neh', kind: 'continues', de: 'In der hebräischen Bibel sind Esra und Nehemia ein einziges Buch.', en: 'In the Hebrew Bible, Ezra and Nehemiah are a single book.' },
      { to: 'Hag', kind: 'parallel', de: 'Haggai und Sacharja treten in Esra 5 selbst auf – sie treiben den Tempelbau an.', en: 'Haggai and Zechariah appear in Ezra 5 in person – they push the temple rebuilding along.' },
    ],
    oldest: { find: 'qumran', de: '4QEzra, ein kleines Fragment aus dem 1. Jh. v. Chr.', en: '4QEzra, a small fragment from the 1st century BC.' },
  },
  {
    osis: 'Neh', group: 'geschichte', period: 'perser', from: -400, to: -300,
    de: {
      dating: 'Der Kern ist die „Nehemia-Denkschrift", ein Ich-Bericht, der zu den wenigen erhaltenen Selbstzeugnissen des Alten Orients gehört. Die Endredaktion gehört zur Chronik.',
      world: 'Ein jüdischer Mundschenk am Hof von Artaxerxes bekommt Urlaub, Bauholz und ein Geleitschreiben, um in einer Provinzstadt eine Mauer zu bauen. Die Elephantine-Papyri aus Ägypten nennen dieselben Jahre und teils dieselben Beamten.',
    },
    en: {
      dating: 'The core is the "Nehemiah Memoir", a first-person report and one of the few surviving self-testimonies of the ancient Near East. The final editing belongs with Chronicles.',
      world: 'A Jewish cupbearer at the court of Artaxerxes is granted leave, timber and a letter of safe conduct to build a wall in a provincial town. The Elephantine papyri from Egypt name the same years and, in part, the same officials.',
    },
    links: [
      { to: 'Ezra', kind: 'continues', de: 'Ein Buch in zwei Teilen; die Trennung ist erst christlich.', en: 'One book in two parts; the division is only Christian.' },
      { to: 'Deut', kind: 'quotes', de: 'Nehemia 8: Esra liest das Gesetz vor, und es wird übersetzt, damit man es versteht.', en: 'Nehemiah 8: Ezra reads the law aloud, and it is translated so that people understand.' },
    ],
    oldest: { find: 'leningradensis', de: 'In Qumran nicht nachgewiesen – vollständig erst im Codex Leningradensis von 1008.', en: 'Not attested at Qumran – complete first in the Leningrad Codex of 1008.' },
  },
  {
    osis: 'Esth', group: 'geschichte', period: 'perser', from: -400, to: -160, disputed: true,
    de: {
      dating: 'Das Buch kennt den persischen Hof genau, aber keine Person darin ist außerbiblisch belegt; die Datierung schwankt zwischen später Perserzeit und hellenistischer Zeit. Purim, das Fest, das es begründet, ist erstmals im 2. Jahrhundert v. Chr. bezeugt.',
      world: 'Ein Vernichtungsplan gegen eine Minderheit, abgewendet durch eine Frau am Hof. Gott kommt im ganzen Buch nicht vor – kein einziges Mal; die griechische Fassung hat später Gebete eingefügt, weil das als Mangel empfunden wurde.',
    },
    en: {
      dating: 'The book knows the Persian court in detail, yet not one of its characters is attested outside the Bible; datings range from the late Persian to the Hellenistic period. Purim, the feast it establishes, is first attested in the 2nd century BC.',
      world: 'A plan to exterminate a minority, averted by a woman at court. God does not appear in the book at all – not once; the Greek version later inserted prayers, because the silence was felt as a defect.',
    },
    links: [
      { to: 'Dan', kind: 'parallel', de: 'Dieselbe Gattung: Juden am fremden Hof, die ihre Treue teuer bezahlen sollen.', en: 'The same genre: Jews at a foreign court, expected to pay dearly for their loyalty.' },
    ],
    oldest: { find: 'leningradensis', de: 'Das einzige Buch der hebräischen Bibel, von dem in Qumran keine einzige Zeile gefunden wurde. Ältester vollständiger Text: Codex Leningradensis, 1008.', en: 'The only book of the Hebrew Bible of which not one line was found at Qumran. Oldest complete text: the Leningrad Codex, 1008.' },
  },

  /* --- Weisheit & Poesie ------------------------------------------------- */
  {
    osis: 'Job', group: 'weisheit', period: 'perser', from: -1000, to: -300, disputed: true,
    de: {
      dating: 'Die Rahmenerzählung wirkt alt und spielt in patriarchaler Zeit; die Dichtung in der Mitte ist sprachlich schwierig und wird meist nach dem Exil angesetzt. Ein gesichertes Datum hat kein Kommentar.',
      world: 'Hiob ist kein Israelit, und Israel kommt im Buch nicht vor. Die Frage – warum trifft es den Gerechten? – ist im Alten Orient alt: Aus Babylon gibt es den „Ludlul bēl nēmeqi" und die „Babylonische Theodizee", beide Jahrhunderte älter, beide mit anderer Antwort.',
    },
    en: {
      dating: 'The frame story feels old and is set in patriarchal times; the poetry at its centre is linguistically difficult and is usually placed after the exile. No commentary has a secure date.',
      world: 'Job is not an Israelite, and Israel does not appear in the book. The question – why does it strike the righteous? – is old in the ancient Near East: from Babylon come "Ludlul bēl nēmeqi" and the "Babylonian Theodicy", both centuries older, both answering differently.',
    },
    links: [
      { to: 'Jas', kind: 'quoted', de: '„Von der Geduld Hiobs habt ihr gehört" – Jakobus 5,11, obwohl Hiob im Buch alles andere als geduldig ist.', en: '"You have heard of the perseverance of Job" – James 5:11, although in the book Job is anything but patient.' },
      { to: 'Eccl', kind: 'parallel', de: 'Zwei Bücher, die dem Lehrsatz vom gerechten Ausgleich widersprechen – von innen.', en: 'Two books contradicting the doctrine of just recompense – from the inside.' },
    ],
    oldest: { find: 'qumran', de: '4QpaleoJobᶜ in althebräischer Schrift und ein aramäischer Targum (11QtgJob), beide 2./1. Jh. v. Chr.', en: '4QpaleoJobᶜ in palaeo-Hebrew script and an Aramaic targum (11QtgJob), both 2nd/1st century BC.' },
  },
  {
    osis: 'Ps', group: 'weisheit', period: 'perser', from: -1000, to: -200, disputed: true,
    de: {
      dating: 'Kein Buch, sondern eine Sammlung von Sammlungen: einzelne Psalmen reichen in die Königszeit zurück, das fertige Fünferbuch entsteht frühestens in der Perserzeit. Die Überschriften „von David" sind im Hebräischen mehrdeutig – sie können auch „für David" heißen.',
      world: 'Der ugaritische Baal-Zyklus aus Ras Schamra zeigt, wie nah manche Bilder an der kanaanäischen Dichtung stehen; Psalm 29 lässt sich fast Wort für Wort dorthin zurücklesen. Gebetet wurde im Tempel, mit Musik, im Wechsel – die Regieanweisungen stehen noch in den Überschriften.',
    },
    en: {
      dating: 'Not a book but a collection of collections: individual psalms reach back into the monarchy, while the finished five-part book is Persian-period at the earliest. The headings "of David" are ambiguous in Hebrew – they can equally mean "for David".',
      world: 'The Ugaritic Baal cycle from Ras Shamra shows how close some of the imagery stands to Canaanite poetry; Psalm 29 can be read back into it almost word for word. These were prayed in the temple, with music, antiphonally – the stage directions still stand in the headings.',
    },
    links: [
      { to: 'Heb', kind: 'quoted', de: 'Hebräer baut seine ersten beiden Kapitel fast ganz aus Psalmzitaten.', en: 'Hebrews builds its first two chapters almost entirely out of psalm quotations.' },
      { to: 'Matt', kind: 'quoted', de: 'Der letzte Satz Jesu am Kreuz ist der erste Vers von Psalm 22.', en: 'Jesus’ last words on the cross are the opening verse of Psalm 22.' },
      { to: 'Acts', kind: 'quoted', de: 'Petrus begründet Pfingsten mit Psalm 16 und Psalm 110.', en: 'Peter grounds Pentecost in Psalm 16 and Psalm 110.' },
    ],
    oldest: { find: 'qumran', de: '11QPsᵃ, die große Psalmenrolle aus Höhle 11, um 30–50 n. Chr. – in anderer Reihenfolge und mit Psalmen, die im späteren Text fehlen.', en: '11QPsᵃ, the Great Psalms Scroll from Cave 11, c. AD 30–50 – in a different order and with psalms missing from the later text.' },
  },
  {
    osis: 'Prov', group: 'weisheit', period: 'perser', from: -950, to: -300, disputed: true,
    de: {
      dating: 'Das Buch nennt selbst mehrere Sammler – Salomo, „die Männer Hiskias", Agur, Lemuël. Die Endgestalt gehört in die Perserzeit, einzelne Sammlungen sind deutlich älter.',
      world: 'Sprüche 22,17–24,22 steht in auffälliger Nähe zur ägyptischen „Lehre des Amenemope" aus dem 2. Jahrtausend – dieselbe Abfolge, teils dieselben Bilder. Weisheit war international; sie wurde an Höfen gelehrt und über Grenzen hinweg abgeschrieben.',
    },
    en: {
      dating: 'The book names several collectors itself – Solomon, "the men of Hezekiah", Agur, Lemuel. Its final shape belongs to the Persian period; individual collections are markedly older.',
      world: 'Proverbs 22:17–24:22 stands strikingly close to the Egyptian "Instruction of Amenemope" from the 2nd millennium – the same sequence, in places the same images. Wisdom was international; it was taught at courts and copied across borders.',
    },
    links: [
      { to: 'Jas', kind: 'parallel', de: 'Der Jakobusbrief ist das neutestamentliche Weisheitsbuch – kurze Sätze, praktische Ethik.', en: 'James is the New Testament wisdom book – short sentences, practical ethics.' },
      { to: 'Eccl', kind: 'answers', de: 'Prediger prüft die Sprüche an der Erfahrung und findet sie zu glatt.', en: 'Ecclesiastes tests the proverbs against experience and finds them too smooth.' },
    ],
    oldest: { find: 'qumran', de: '4QProvᵃ und 4QProvᵇ, 1. Jh. v. Chr.', en: '4QProvᵃ and 4QProvᵇ, 1st century BC.' },
  },
  {
    osis: 'Eccl', group: 'weisheit', period: 'hellen', from: -900, to: -200, disputed: true,
    de: {
      dating: 'Persische Lehnwörter und ein Hebräisch, das dem der Mischna näher steht als dem der Königszeit, sprechen für das 3. Jahrhundert v. Chr. Die Zuschreibung an Salomo steht im Buch selbst nur als Rolle: „der Prediger, Sohn Davids".',
      world: 'Hellenistische Zeit: Jerusalem gehört den Ptolemäern, griechische Philosophie ist in der Luft, und ein jüdischer Lehrer schreibt ein Buch, das mit „alles ist Windhauch" anfängt und aufhört. Dass es im Kanon steht, war noch im 1. Jahrhundert n. Chr. umstritten.',
    },
    en: {
      dating: 'Persian loanwords and a Hebrew closer to the Mishnah than to the monarchy argue for the 3rd century BC. The ascription to Solomon appears in the book only as a role: "the Preacher, son of David".',
      world: 'The Hellenistic period: Jerusalem belongs to the Ptolemies, Greek philosophy is in the air, and a Jewish teacher writes a book that begins and ends with "everything is a breath". Its place in the canon was still disputed in the 1st century AD.',
    },
    links: [
      { to: 'Job', kind: 'parallel', de: 'Beide bestreiten, dass es dem Gerechten gut geht – Hiob im Leiden, Prediger im Wohlstand.', en: 'Both deny that things go well for the righteous – Job in suffering, Ecclesiastes in prosperity.' },
    ],
    oldest: { find: 'qumran', de: '4QQohᵃ, um 175–150 v. Chr. – eine Handschrift, die fast so alt ist wie manche Datierung des Buches selbst.', en: '4QQohᵃ, c. 175–150 BC – a manuscript almost as old as some proposed dates for the book itself.' },
  },
  {
    osis: 'Song', group: 'weisheit', period: 'hellen', from: -950, to: -200, disputed: true,
    de: {
      dating: 'Sprachlich spät (Aramaismen, ein persisches Lehnwort), stofflich möglicherweise viel älter. Rabbi Akiba verteidigte es um 100 n. Chr. mit dem Satz, alle Schriften seien heilig, das Hohelied aber das Allerheiligste.',
      world: 'Ägyptische Liebeslieder des Neuen Reichs benutzen dieselben Anreden – „meine Schwester, meine Braut" – und dieselben Gartenbilder. Das Buch spricht von Gott kein einziges Mal; gelesen wird es zu Pessach.',
    },
    en: {
      dating: 'Linguistically late (Aramaisms, one Persian loanword), possibly much older in substance. Rabbi Akiva defended it around AD 100 with the line that all the writings are holy, but the Song of Songs is the holy of holies.',
      world: 'Egyptian love songs of the New Kingdom use the same forms of address – "my sister, my bride" – and the same garden imagery. The book never once speaks of God; it is read at Passover.',
    },
    links: [
      { to: 'Eph', kind: 'quoted', de: 'Die Kirche hat das Buch jahrhundertelang auf Christus und die Gemeinde gelesen – Epheser 5 gab die Vorlage.', en: 'The church read the book for centuries as Christ and the congregation – Ephesians 5 supplied the template.' },
    ],
    oldest: { find: 'qumran', de: '4QCantᵃ und 4QCantᵇ, 1. Jh. v. Chr. – beide kürzer als der spätere Text.', en: '4QCantᵃ and 4QCantᵇ, 1st century BC – both shorter than the later text.' },
  },

  /* --- Große Propheten --------------------------------------------------- */
  {
    osis: 'Isa', group: 'prophetenGross', period: 'exil', from: -740, to: -500, disputed: true,
    de: {
      dating: 'Seit 1892 wird das Buch meist in drei Teile gelesen: Kapitel 1–39 aus dem 8. Jahrhundert, 40–55 aus dem Exil (der Perserkönig Kyrus wird in Kapitel 45 mit Namen angeredet), 56–66 danach. Die Gegenposition hält an einem Verfasser fest und liest Kyrus als Weissagung.',
      world: 'Assyrien steht vor Jerusalem, hundertfünfzig Jahre später ist es Babylon, dann Persien – drei Weltlagen in einem Buch. Die große Jesajarolle aus Qumran zeigt den Übergang von Kapitel 39 zu 40 ohne jede Markierung: Wer das Buch geteilt sehen will, findet in der ältesten Handschrift keine Naht.',
    },
    en: {
      dating: 'Since 1892 the book has usually been read in three parts: chapters 1–39 from the 8th century, 40–55 from the exile (the Persian king Cyrus is addressed by name in chapter 45), 56–66 later. The counter-position holds to one author and reads Cyrus as prophecy.',
      world: 'Assyria stands before Jerusalem; a hundred and fifty years later it is Babylon, then Persia – three world situations in one book. The Great Isaiah Scroll from Qumran shows the transition from chapter 39 to 40 without any mark at all: anyone wanting the book divided finds no seam in the oldest manuscript.',
    },
    links: [
      { to: 'Luke', kind: 'quoted', de: 'Jesus liest in Nazaret Jesaja 61 vor und setzt sich hin: „Heute ist dieses Wort erfüllt."', en: 'In Nazareth Jesus reads Isaiah 61 aloud and sits down: "Today this scripture is fulfilled."' },
      { to: 'Acts', kind: 'quoted', de: 'Der äthiopische Kämmerer liest Jesaja 53, als Philippus ihn einholt.', en: 'The Ethiopian official is reading Isaiah 53 when Philip catches up with him.' },
      { to: 'Rev', kind: 'quoted', de: '„Ein neuer Himmel und eine neue Erde" steht zuerst in Jesaja 65.', en: '"A new heaven and a new earth" stands first in Isaiah 65.' },
    ],
    oldest: { find: 'qumran', de: '1QIsaᵃ, die große Jesajarolle aus Höhle 1, um 125 v. Chr. – vollständig, 7,34 Meter lang, tausend Jahre älter als der bis 1947 älteste bekannte hebräische Text.', en: '1QIsaᵃ, the Great Isaiah Scroll from Cave 1, c. 125 BC – complete, 7.34 metres long, a thousand years older than the oldest Hebrew text known before 1947.' },
  },
  {
    osis: 'Jer', group: 'prophetenGross', period: 'exil', from: -627, to: -540,
    de: {
      dating: 'Das Buch nennt seinen Schreiber: Baruch, Sohn Nerijas, der das Diktat aufschreibt, nachdem der König die erste Rolle Stück für Stück ins Feuer geworfen hat (Jeremia 36). Die Endgestalt reicht ins Exil.',
      world: 'Die letzten vierzig Jahre Judas, aus der Nähe: Jeremia rät zur Kapitulation und gilt darum als Verräter. Die Lachisch-Ostraka, 1935 im Torhaus der Stadt gefunden, melden in denselben Wochen, dass die Feuerzeichen von Aseka nicht mehr zu sehen sind – dieselbe Lage, dieselben Namen, andere Hand.',
    },
    en: {
      dating: 'The book names its scribe: Baruch son of Neriah, who takes the dictation after the king has thrown the first scroll into the fire piece by piece (Jeremiah 36). The final shape reaches into the exile.',
      world: 'The last forty years of Judah, seen from close up: Jeremiah advises surrender and is therefore treated as a traitor. The Lachish ostraca, found in the city gatehouse in 1935, report in those same weeks that the fire signals of Azekah can no longer be seen – the same situation, the same names, a different hand.',
    },
    links: [
      { to: '2Kgs', kind: 'parallel', de: 'Jeremia 52 ist fast wörtlich 2. Könige 25 – zwei Bücher, ein Schluss.', en: 'Jeremiah 52 is almost word for word 2 Kings 25 – two books, one ending.' },
      { to: 'Heb', kind: 'quoted', de: 'Der „neue Bund" aus Jeremia 31 wird in Hebräer 8 vollständig zitiert – die längste Zitatpassage des Neuen Testaments.', en: 'The "new covenant" of Jeremiah 31 is quoted in full in Hebrews 8 – the longest quotation in the New Testament.' },
    ],
    oldest: { find: 'qumran', de: '4QJerᵇ, 2. Jh. v. Chr. – ein hebräischer Text, der rund ein Achtel kürzer ist als der spätere und genau der Septuaginta entspricht.', en: '4QJerᵇ, 2nd century BC – a Hebrew text about an eighth shorter than the later one and matching the Septuagint exactly.' },
  },
  {
    osis: 'Lam', group: 'prophetenGross', period: 'exil', from: -586, to: -520,
    de: {
      dating: 'Unmittelbar nach 586 v. Chr. – die Klage steht so nah am Ereignis, dass sie noch die Gerüche kennt. Die Zuschreibung an Jeremia stammt aus der griechischen Überlieferung, nicht aus dem Buch selbst.',
      world: 'Fünf Gedichte über eine zerstörte Stadt, vier davon alphabetisch durchbuchstabiert – die strengste Form für den größten Schmerz. Mesopotamien kennt dieselbe Gattung: die sumerischen Klagen über Ur sind Jahrhunderte älter und tun dasselbe.',
    },
    en: {
      dating: 'Immediately after 586 BC – the lament stands so close to the event that it still knows the smells. The ascription to Jeremiah comes from the Greek tradition, not from the book itself.',
      world: 'Five poems about a destroyed city, four of them running through the alphabet – the strictest form for the greatest pain. Mesopotamia knows the same genre: the Sumerian laments over Ur are centuries older and do the same thing.',
    },
    links: [
      { to: 'Jer', kind: 'parallel', de: 'Dieselbe Katastrophe, einmal als Prophetie davor, einmal als Klage danach.', en: 'The same catastrophe, once as prophecy before, once as lament after.' },
    ],
    oldest: { find: 'qumran', de: '3QLam und 4QLam, 1. Jh. v. Chr.', en: '3QLam and 4QLam, 1st century BC.' },
  },
  {
    osis: 'Ezek', group: 'prophetenGross', period: 'exil', from: -593, to: -540,
    de: {
      dating: 'Das Buch datiert sich selbst genauer als jedes andere prophetische: dreizehn Daten, gerechnet ab der Wegführung Jojachins, das erste 593, das letzte 571 v. Chr.',
      world: 'Hesekiel ist Priester ohne Tempel, am Fluss Kebar in Babylonien. Die Rationentafeln aus Babylon, die den gefangenen König Jojachin und seine Söhne mit Öl versorgen, stammen aus denselben Jahren – der Alltag des Exils, in Keilschrift abgerechnet.',
    },
    en: {
      dating: 'The book dates itself more precisely than any other prophetic work: thirteen dates reckoned from the deportation of Jehoiachin, the first 593 and the last 571 BC.',
      world: 'Ezekiel is a priest without a temple, by the river Chebar in Babylonia. The ration tablets from Babylon supplying the captive king Jehoiachin and his sons with oil come from the same years – the everyday life of the exile, accounted for in cuneiform.',
    },
    links: [
      { to: 'Rev', kind: 'quoted', de: 'Die Thronvision, die Buchrolle zum Essen, Gog und Magog, die vermessene Stadt – die Offenbarung liest sich streckenweise als Hesekiel neu erzählt.', en: 'The throne vision, the scroll to be eaten, Gog and Magog, the measured city – Revelation reads in stretches as Ezekiel retold.' },
      { to: 'John', kind: 'quoted', de: 'Hesekiel 34 gegen die Hirten Israels steht hinter „Ich bin der gute Hirte".', en: 'Ezekiel 34 against the shepherds of Israel stands behind "I am the good shepherd".' },
    ],
    oldest: { find: 'masada', de: 'Die Hesekiel-Rolle aus Masada, vor 73 n. Chr. verbrannt und aus der Brandschicht geborgen; dazu Fragmente aus Qumran.', en: 'The Ezekiel scroll from Masada, burnt before AD 73 and recovered from the burn layer; plus fragments from Qumran.' },
  },
  {
    osis: 'Dan', group: 'prophetenGross', period: 'hellen', from: -540, to: -164, disputed: true,
    de: {
      dating: 'Die härteste Datierungsfrage der Bibel. Das Buch spielt im 6. Jahrhundert; seine Visionen zeichnen die Zeit Antiochus’ IV. (167–164 v. Chr.) so genau nach, dass die Forschung es überwiegend dorthin datiert – bis auf den Tod des Königs, den es anders erzählt, als er eintrat. Die Gegenposition liest genau das als Beweis echter Prophetie.',
      world: 'Ein Grieche zwingt Jerusalem seinen Kult auf, im Tempel steht ein fremder Altar, Menschen sterben dafür, die Speisegebote zu halten. Das Buch antwortet mit Geschichten von vier Männern am babylonischen Hof, die genau daran festhalten – und mit Bildern von Reichen, die kommen und gehen.',
    },
    en: {
      dating: 'The hardest dating question in the Bible. The book is set in the 6th century; its visions track the reign of Antiochus IV (167–164 BC) so closely that scholarship mostly dates it there – except for the king’s death, which it tells differently from how it happened. The counter-position reads precisely that as proof of genuine prophecy.',
      world: 'A Greek forces his cult on Jerusalem, a foreign altar stands in the temple, people die for keeping the food laws. The book answers with stories of four men at the Babylonian court who keep them – and with images of empires that come and go.',
    },
    links: [
      { to: 'Rev', kind: 'quoted', de: 'Die vier Tiere aus Daniel 7 kehren in Offenbarung 13 als ein einziges wieder.', en: 'The four beasts of Daniel 7 return in Revelation 13 as a single one.' },
      { to: 'Mark', kind: 'quoted', de: '„Menschensohn" – Jesu häufigste Selbstbezeichnung – kommt aus Daniel 7,13.', en: '"Son of Man" – Jesus’ most frequent self-designation – comes from Daniel 7:13.' },
    ],
    oldest: { find: 'qumran', de: '4QDanᶜ, um 125 v. Chr. – höchstens vierzig Jahre nach dem Datum, das die Mehrheit der Forschung für die Abfassung ansetzt.', en: '4QDanᶜ, c. 125 BC – at most forty years after the date most scholars propose for its composition.' },
  },

  /* --- Kleine Propheten (das Zwölfprophetenbuch) -------------------------- */
  {
    osis: 'Hos', group: 'prophetenKlein', period: 'koenige', from: -750, to: -700,
    de: {
      dating: 'Wirken im Nordreich kurz vor dessen Ende, zwischen 750 und 722 v. Chr.; eine judäische Bearbeitung hat den Text nach dem Fall Samarias weitergereicht.',
      world: 'Die letzten Jahrzehnte Israels: sechs Könige in zwanzig Jahren, vier davon ermordet, dazu die Wahl zwischen Assyrien und Ägypten. Hosea bekommt den Auftrag, eine untreue Frau zu heiraten und beim Namen zu nennen, was er sieht.',
    },
    en: {
      dating: 'Active in the northern kingdom shortly before its end, between 750 and 722 BC; a Judean revision passed the text on after the fall of Samaria.',
      world: 'The last decades of Israel: six kings in twenty years, four of them murdered, and the choice between Assyria and Egypt. Hosea is told to marry an unfaithful woman and to name what he sees.',
    },
    links: [
      { to: 'Matt', kind: 'quoted', de: '„Barmherzigkeit will ich und nicht Opfer" – Jesus zitiert Hosea 6,6 zweimal.', en: '"I desire mercy, not sacrifice" – Jesus quotes Hosea 6:6 twice.' },
      { to: 'Rom', kind: 'quoted', de: 'Paulus nimmt Hoseas Kinder-Namen als Bild für die Heiden (Römer 9,25).', en: 'Paul takes the names of Hosea’s children as an image for the gentiles (Romans 9:25).' },
    ],
    oldest: { find: 'qumran', de: 'Die zwölf standen auf einer einzigen Rolle: 4QXIIᵃ–ᵍ, ab etwa 150 v. Chr.', en: 'The Twelve stood on a single scroll: 4QXIIᵃ–ᵍ, from about 150 BC.' },
  },
  {
    osis: 'Joel', group: 'prophetenKlein', period: 'perser', from: -800, to: -400, disputed: true,
    de: {
      dating: 'Das Buch nennt keinen König und kein Datum – die Vorschläge reichen vom 9. bis ins 4. Jahrhundert. Dass Tempel und Priesterschaft selbstverständlich da sind, aber kein König, spricht für die Perserzeit.',
      world: 'Eine Heuschreckenplage, beschrieben wie ein einfallendes Heer. Aus dieser Katastrophe wird das Bild für den „Tag des Herrn" – und mitten darin die Ankündigung, dass der Geist auf alle ausgegossen wird, auf Knechte und Mägde eingeschlossen.',
    },
    en: {
      dating: 'The book names no king and no date – proposals range from the 9th to the 4th century. That temple and priesthood are simply there while a king is not argues for the Persian period.',
      world: 'A plague of locusts, described like an invading army. Out of that catastrophe comes the image of the "day of the Lord" – and in the middle of it the announcement that the spirit will be poured out on all, male and female servants included.',
    },
    links: [
      { to: 'Acts', kind: 'quoted', de: 'Petrus erklärt Pfingsten mit Joel 3: „Das ist es, was durch den Propheten Joel gesagt ist."', en: 'Peter explains Pentecost with Joel 3: "This is what was spoken through the prophet Joel."' },
    ],
    oldest: { find: 'qumran', de: 'Teil der Zwölfprophetenrolle; dazu die griechische Rolle aus dem Naḥal Ḥever, 1. Jh. v. Chr.', en: 'Part of the Scroll of the Twelve; plus the Greek scroll from Naḥal Ḥever, 1st century BC.' },
  },
  {
    osis: 'Amos', group: 'prophetenKlein', period: 'koenige', from: -760, to: -730,
    de: {
      dating: 'Um 760 v. Chr., „zwei Jahre vor dem Erdbeben" – ein Beben dieser Zeit ist in Hazor und Gezer im Boden nachweisbar. Amos ist damit einer der am festesten datierbaren Propheten.',
      world: 'Israel unter Jerobeam II. geht es wirtschaftlich so gut wie nie; die Elfenbeinschnitzereien aus Samaria stammen aus diesen Jahren. Ein Schafzüchter aus Juda kommt nach Bethel und redet über Schuldknechtschaft, gefälschte Waagen und Wochenendhäuser.',
    },
    en: {
      dating: 'Around 760 BC, "two years before the earthquake" – an earthquake of that period is traceable in the ground at Hazor and Gezer. Amos is thus one of the most firmly datable prophets.',
      world: 'Israel under Jeroboam II is doing better economically than ever; the ivory carvings from Samaria come from these years. A sheep-breeder from Judah arrives at Bethel and talks about debt slavery, rigged scales and second homes.',
    },
    links: [
      { to: 'Acts', kind: 'quoted', de: 'Jakobus begründet auf dem Apostelkonzil die Aufnahme der Heiden mit Amos 9.', en: 'At the Jerusalem council James grounds the admission of gentiles in Amos 9.' },
    ],
    oldest: { find: 'qumran', de: 'Teil der Zwölfprophetenrolle aus Höhle 4, 2. Jh. v. Chr.', en: 'Part of the Scroll of the Twelve from Cave 4, 2nd century BC.' },
  },
  {
    osis: 'Obad', group: 'prophetenKlein', period: 'exil', from: -586, to: -500,
    de: {
      dating: 'Kurz nach 586 v. Chr.: Das kürzeste Buch des Alten Testaments – 21 Verse – wirft Edom vor, beim Fall Jerusalems zugesehen und mitgenommen zu haben.',
      world: 'Edom liegt südöstlich des Toten Meeres, verwandt und verfeindet zugleich; Jakob und Esau waren Brüder. Als Juda fällt, rücken Edomiter ins Bergland nach – aus dem Gebiet wird später Idumäa, die Heimat der Familie des Herodes.',
    },
    en: {
      dating: 'Shortly after 586 BC: the shortest book in the Old Testament – 21 verses – accuses Edom of standing by at the fall of Jerusalem and taking its share.',
      world: 'Edom lies south-east of the Dead Sea, kin and enemy at once; Jacob and Esau were brothers. When Judah falls, Edomites move up into the hill country – the area later becomes Idumea, the home of Herod’s family.',
    },
    links: [
      { to: 'Jer', kind: 'parallel', de: 'Jeremia 49,7–22 bringt denselben Spruch gegen Edom, in Teilen wörtlich.', en: 'Jeremiah 49:7–22 carries the same oracle against Edom, partly word for word.' },
    ],
    oldest: { find: 'qumran', de: 'Teil der Zwölfprophetenrolle; 4QXIIᵃ enthält die wenigen Verse fast vollständig.', en: 'Part of the Scroll of the Twelve; 4QXIIᵃ carries its few verses almost complete.' },
  },
  {
    osis: 'Jonah', group: 'prophetenKlein', period: 'perser', from: -780, to: -300, disputed: true,
    de: {
      dating: 'Der Prophet Jona, Sohn Amittais, ist in 2. Könige 14,25 für das 8. Jahrhundert bezeugt; das Buch über ihn ist sprachlich deutlich jünger und wird meist in die Perserzeit gesetzt.',
      world: 'Ninive war die Hauptstadt Assyriens – für israelitische Ohren der Inbegriff der Grausamkeit. Das Buch schickt einen Propheten ausgerechnet dorthin, lässt die Stadt umkehren und endet mit einer Frage an den beleidigten Propheten, nicht mit einer Antwort.',
    },
    en: {
      dating: 'The prophet Jonah son of Amittai is attested for the 8th century in 2 Kings 14:25; the book about him is linguistically much later and is usually placed in the Persian period.',
      world: 'Nineveh was the capital of Assyria – to Israelite ears the byword for cruelty. The book sends a prophet precisely there, has the city repent, and ends with a question put to the offended prophet rather than an answer.',
    },
    links: [
      { to: 'Matt', kind: 'quoted', de: '„Das Zeichen des Jona" ist Jesu Antwort auf die Forderung nach einem Beweis.', en: '"The sign of Jonah" is Jesus’ answer to the demand for proof.' },
      { to: 'Nah', kind: 'answers', de: 'Zwei Bücher über dieselbe Stadt: Jona sieht sie umkehren, Nahum sieht sie fallen.', en: 'Two books about the same city: Jonah sees it repent, Nahum sees it fall.' },
    ],
    oldest: { find: 'qumran', de: 'Teil der Zwölfprophetenrolle, 4QXIIᵃ und ᵍ, 2./1. Jh. v. Chr.', en: 'Part of the Scroll of the Twelve, 4QXIIᵃ and ᵍ, 2nd/1st century BC.' },
  },
  {
    osis: 'Mic', group: 'prophetenKlein', period: 'koenige', from: -735, to: -690,
    de: {
      dating: 'Zeitgenosse Jesajas, Ende des 8. Jahrhunderts. Dass er wirklich damals sprach, bezeugt hundert Jahre später ein Zitat im Prozess gegen Jeremia (Jeremia 26,18) – der einzige Fall, in dem ein Prophet in der Bibel einen anderen namentlich zitiert.',
      world: 'Micha kommt vom Land, aus Moreschet im Hügelland, und redet über Landraub durch die Städter. Seine Ankündigung, Jerusalem werde zum Trümmerfeld, rettete Jeremia später das Leben: Hiskia habe ihn damals nicht getötet.',
    },
    en: {
      dating: 'A contemporary of Isaiah, late 8th century. That he really spoke then is attested a hundred years later by a quotation in the trial of Jeremiah (Jeremiah 26:18) – the only case in the Bible where one prophet is quoted by name by another.',
      world: 'Micah comes from the countryside, from Moresheth in the foothills, and talks about land seized by townsmen. His announcement that Jerusalem would become a heap of ruins later saved Jeremiah’s life: Hezekiah, it was recalled, had not put him to death.',
    },
    links: [
      { to: 'Matt', kind: 'quoted', de: 'Die Schriftgelehrten antworten den Weisen aus Micha 5: in Bethlehem.', en: 'The scribes answer the magi out of Micah 5: in Bethlehem.' },
      { to: 'Isa', kind: 'parallel', de: 'Micha 4,1–3 und Jesaja 2,2–4 sind derselbe Text – Schwerter zu Pflugscharen.', en: 'Micah 4:1–3 and Isaiah 2:2–4 are the same text – swords into ploughshares.' },
    ],
    oldest: { find: 'qumran', de: 'Teil der Zwölfprophetenrolle; dazu ein Pescher-Kommentar (1QpMic).', en: 'Part of the Scroll of the Twelve; plus a pesher commentary (1QpMic).' },
  },
  {
    osis: 'Nah', group: 'prophetenKlein', period: 'koenige', from: -663, to: -612,
    de: {
      dating: 'Zwischen zwei Ereignissen eingeklemmt: Das Buch kennt den Fall von Theben (663 v. Chr.) als vergangen und den Fall Ninives (612) als bevorstehend. Ein engeres Fenster hat kaum ein biblisches Buch.',
      world: 'Assyrien hat zweieinhalb Jahrhunderte lang die Region beherrscht, deportiert und Tribut eingetrieben. Nahum beschreibt den Untergang der Hauptstadt in kurzen, harten Zeilen – kein Trost für Ninive, nur Aufatmen für alle anderen.',
    },
    en: {
      dating: 'Wedged between two events: the book knows the fall of Thebes (663 BC) as past and the fall of Nineveh (612) as imminent. Hardly any biblical book has a tighter window.',
      world: 'Assyria had dominated the region for two and a half centuries, deporting and extracting tribute. Nahum describes the fall of its capital in short, hard lines – no comfort for Nineveh, only relief for everyone else.',
    },
    links: [
      { to: 'Jonah', kind: 'answers', de: 'Dieselbe Stadt, hundert Jahre später und ohne Gnadenfrist.', en: 'The same city, a hundred years later and without a stay of execution.' },
    ],
    oldest: { find: 'qumran', de: 'Teil der Zwölfprophetenrolle; der Nahum-Pescher (4QpNah) nennt als einziger Qumrantext historische Herrscher beim Namen.', en: 'Part of the Scroll of the Twelve; the Nahum pesher (4QpNah) is the only Qumran text to name historical rulers outright.' },
  },
  {
    osis: 'Hab', group: 'prophetenKlein', period: 'koenige', from: -640, to: -600,
    de: {
      dating: 'Die Babylonier („Chaldäer") stehen als aufsteigende Macht vor der Tür, Jerusalem ist noch nicht gefallen – also zwischen 626 und 587 v. Chr.',
      world: 'Das Buch beginnt nicht mit einer Botschaft, sondern mit einer Beschwerde: Wie lange noch? Und die Antwort – Gott schicke die Babylonier – macht die Sache schlimmer, nicht besser. Habakuk stellt sich auf die Mauer und wartet auf die zweite Antwort.',
    },
    en: {
      dating: 'The Babylonians ("Chaldeans") stand at the door as the rising power and Jerusalem has not yet fallen – so between 626 and 587 BC.',
      world: 'The book begins not with a message but with a complaint: how long? And the answer – that God is sending the Babylonians – makes matters worse, not better. Habakkuk takes his stand on the wall and waits for the second answer.',
    },
    links: [
      { to: 'Rom', kind: 'quoted', de: '„Der Gerechte wird aus Glauben leben" (Habakuk 2,4) trägt Römer, Galater und Hebräer – und über sie die Reformation.', en: '"The righteous will live by faith" (Habakkuk 2:4) carries Romans, Galatians and Hebrews – and through them the Reformation.' },
    ],
    oldest: { find: 'qumran', de: 'Der Habakuk-Pescher (1QpHab) aus Höhle 1, um 50 v. Chr., zitiert das Buch Vers für Vers und legt es auf die eigene Gegenwart aus.', en: 'The Habakkuk pesher (1QpHab) from Cave 1, c. 50 BC, quotes the book verse by verse and applies it to the community’s own present.' },
  },
  {
    osis: 'Zeph', group: 'prophetenKlein', period: 'koenige', from: -640, to: -620,
    de: {
      dating: 'Unter Joschija (640–609 v. Chr.), wahrscheinlich vor dessen Reform von 622 – das Buch setzt die fremden Kulte noch als bestehend voraus.',
      world: 'Assyrien wankt, Juda hat einen Augenblick Luft, und Zefanja redet vom „Tag des Herrn" als einem Tag, der auch Jerusalem gilt. Der Stammbaum in Vers 1 führt ihn über vier Generationen auf einen Hiskia zurück – ungewöhnlich für einen Propheten.',
    },
    en: {
      dating: 'Under Josiah (640–609 BC), probably before his reform of 622 – the book still assumes the foreign cults are in place.',
      world: 'Assyria is faltering, Judah has a moment to breathe, and Zephaniah speaks of the "day of the Lord" as a day that applies to Jerusalem too. The genealogy in verse 1 traces him back four generations to a Hezekiah – unusual for a prophet.',
    },
    links: [
      { to: 'Rev', kind: 'quoted', de: 'Der „Tag des Zorns" wurde als Dies irae zum Text der Totenmesse.', en: 'The "day of wrath" became, as Dies irae, the text of the requiem mass.' },
    ],
    oldest: { find: 'qumran', de: 'Teil der Zwölfprophetenrolle aus Höhle 4, dazu 1QpZeph.', en: 'Part of the Scroll of the Twelve from Cave 4, plus 1QpZeph.' },
  },
  {
    osis: 'Hag', group: 'prophetenKlein', period: 'perser', from: -520, to: -515,
    de: {
      dating: 'Auf den Tag datiert: fünf Reden zwischen dem 29. August und dem 18. Dezember 520 v. Chr., gerechnet nach den Regierungsjahren des Darius.',
      world: 'Die Rückkehrer sind seit achtzehn Jahren da, der Tempel liegt noch in Grundmauern, und die Ernten sind schlecht. Haggai stellt beides nebeneinander und bekommt, was kaum ein Prophet bekommt: Man hört auf ihn, und der Bau geht weiter.',
    },
    en: {
      dating: 'Dated to the day: five addresses between 29 August and 18 December 520 BC, reckoned by the regnal years of Darius.',
      world: 'The returnees have been back eighteen years, the temple is still only foundations, and the harvests are poor. Haggai sets the two side by side and gets what hardly any prophet gets: he is listened to, and the building goes on.',
    },
    links: [
      { to: 'Ezra', kind: 'parallel', de: 'Esra 5,1 nennt Haggai und Sacharja als die, die den Bau wieder in Gang brachten.', en: 'Ezra 5:1 names Haggai and Zechariah as those who got the building going again.' },
      { to: 'Heb', kind: 'quoted', de: '„Noch einmal erschüttere ich Himmel und Erde" steht in Hebräer 12,26.', en: '"Once more I will shake the heavens and the earth" stands in Hebrews 12:26.' },
    ],
    oldest: { find: 'qumran', de: 'Teil der Zwölfprophetenrolle (4QXIIᵇ), 2. Jh. v. Chr.', en: 'Part of the Scroll of the Twelve (4QXIIᵇ), 2nd century BC.' },
  },
  {
    osis: 'Zech', group: 'prophetenKlein', period: 'perser', from: -520, to: -450, disputed: true,
    de: {
      dating: 'Die Kapitel 1–8 datieren sich selbst auf 520–518 v. Chr.; die Kapitel 9–14 nennen kein Datum, reden anders und werden meist als spätere Sammlung gelesen („Deuterosacharja").',
      world: 'Dieselbe Baustelle wie bei Haggai, aber in Visionen erzählt: acht Nachtgesichte, ein Leuchter, ein fliegender Schriftrolle, ein Hoherpriester vor Gericht. Der zweite Teil liefert die Bilder, aus denen die Passionsgeschichte später schöpft.',
    },
    en: {
      dating: 'Chapters 1–8 date themselves to 520–518 BC; chapters 9–14 give no date, speak differently, and are usually read as a later collection ("Deutero-Zechariah").',
      world: 'The same building site as Haggai, but told in visions: eight night visions, a lampstand, a flying scroll, a high priest on trial. The second half supplies the images the passion narrative later draws on.',
    },
    links: [
      { to: 'Matt', kind: 'quoted', de: 'Der Einzug auf dem Esel, die dreißig Silberlinge, der geschlagene Hirte – alle drei aus Sacharja.', en: 'The entry on a donkey, the thirty pieces of silver, the struck shepherd – all three from Zechariah.' },
      { to: 'John', kind: 'quoted', de: '„Sie werden auf den sehen, den sie durchbohrt haben" (Sacharja 12,10) steht unter dem Kreuz.', en: '"They will look on the one they have pierced" (Zechariah 12:10) stands beneath the cross.' },
    ],
    oldest: { find: 'qumran', de: 'Teil der Zwölfprophetenrolle; die griechische Rolle aus dem Naḥal Ḥever enthält Sacharja fast vollständig.', en: 'Part of the Scroll of the Twelve; the Greek scroll from Naḥal Ḥever carries Zechariah almost complete.' },
  },
  {
    osis: 'Mal', group: 'prophetenKlein', period: 'perser', from: -460, to: -430,
    de: {
      dating: 'Der Tempel steht und wird lustlos versorgt, ein persischer Statthalter regiert – also Mitte des 5. Jahrhunderts, in der Nähe von Esra und Nehemia. „Maleachi" heißt „mein Bote" und ist womöglich kein Name, sondern eine Angabe.',
      world: 'Kein Untergang, keine Katastrophe – nur Gleichgültigkeit: blinde Tiere auf dem Altar, zurückgehaltene Abgaben, Scheidungen. Mit diesem Buch endet das christliche Alte Testament, und danach schweigen die Quellen für rund vierhundert Jahre.',
    },
    en: {
      dating: 'The temple stands and is listlessly supplied, a Persian governor rules – so the middle of the 5th century, close to Ezra and Nehemiah. "Malachi" means "my messenger" and may not be a name at all but a description.',
      world: 'No downfall, no catastrophe – only indifference: blind animals on the altar, withheld dues, divorces. With this book the Christian Old Testament ends, and after it the sources fall silent for some four hundred years.',
    },
    links: [
      { to: 'Mark', kind: 'quoted', de: 'Markus beginnt sein Evangelium mit Maleachi 3,1 – dem Boten, der den Weg bereitet.', en: 'Mark opens his gospel with Malachi 3:1 – the messenger who prepares the way.' },
      { to: 'Luke', kind: 'quoted', de: 'Der Engel bei Zacharias zitiert den letzten Satz des Alten Testaments über Elia.', en: 'The angel speaking to Zechariah quotes the last sentence of the Old Testament, about Elijah.' },
    ],
    oldest: { find: 'qumran', de: 'Teil der Zwölfprophetenrolle (4QXIIᵃ), um 150 v. Chr.', en: 'Part of the Scroll of the Twelve (4QXIIᵃ), c. 150 BC.' },
  },

  /* --- Evangelien & Apostelgeschichte ------------------------------------ */
  {
    osis: 'Matt', group: 'evangelien', period: 'nachtempel', from: 60, to: 90, disputed: true,
    de: {
      dating: 'Die Mehrheit setzt Matthäus nach 70 an, weil Kapitel 22 von einer verbrannten Stadt spricht; wer darin Prophetie sieht, datiert vor 70. Dass er Markus benutzt, setzt ihn in jedem Fall danach.',
      world: 'Geschrieben für Leser, die die Schrift kennen: fünf große Reden, wie die fünf Bücher Mose, und über sechzig Rückgriffe aufs Alte Testament. Der Streit mit den Pharisäern ist scharf – und er ist ein innerjüdischer Streit, kein Blick von außen.',
    },
    en: {
      dating: 'The majority places Matthew after 70, because chapter 22 speaks of a burnt city; those who read that as prophecy date it before 70. That he uses Mark puts him after Mark in any case.',
      world: 'Written for readers who know the scriptures: five great discourses, like the five books of Moses, and over sixty references back to the Old Testament. The quarrel with the Pharisees is sharp – and it is an inner-Jewish quarrel, not a view from outside.',
    },
    links: [
      { to: 'Mark', kind: 'quotes', de: 'Rund 90 Prozent des Markusstoffs steht auch bei Matthäus, meist gekürzt.', en: 'About 90 per cent of Mark’s material appears in Matthew too, usually shortened.' },
      { to: 'Isa', kind: 'quotes', de: 'Die Erfüllungszitate – „damit erfüllt würde" – kommen überwiegend aus Jesaja.', en: 'The fulfilment quotations – "so that it might be fulfilled" – come mostly from Isaiah.' },
    ],
    oldest: { find: 'oxyrhynchus', de: 'P104, ein Fetzen mit Matthäus 21 aus den Müllhügeln von Oxyrhynchos, 2. Jh.; vollständig im Codex Sinaiticus.', en: 'P104, a scrap of Matthew 21 from the rubbish mounds of Oxyrhynchus, 2nd century; complete in Codex Sinaiticus.' },
  },
  {
    osis: 'Mark', group: 'evangelien', period: 'roemer', from: 55, to: 75,
    de: {
      dating: 'Das älteste Evangelium, meist um 65–70 angesetzt – nahe am Jüdischen Krieg. Papias berichtet um 130, Markus habe aufgeschrieben, was Petrus erzählte, „wenn auch nicht der Reihe nach".',
      world: 'Geschrieben in einem hastigen Griechisch, mit lateinischen Lehnwörtern und Erklärungen jüdischer Bräuche – also für Leser außerhalb Palästinas, vermutlich in Rom. Das ursprüngliche Ende ist der Schrecken am leeren Grab; die zwölf Verse danach fehlen in den ältesten Handschriften.',
    },
    en: {
      dating: 'The oldest gospel, usually placed around 65–70 – close to the Jewish War. Around 130 Papias reports that Mark wrote down what Peter told, "though not in order".',
      world: 'Written in hurried Greek, with Latin loanwords and explanations of Jewish customs – so for readers outside Palestine, probably in Rome. Its original ending is the terror at the empty tomb; the twelve verses after it are missing from the oldest manuscripts.',
    },
    links: [
      { to: 'Matt', kind: 'parallel', de: 'Zwei der drei synoptischen Evangelien schreiben Markus aus – das ist der Kern der Zweiquellentheorie.', en: 'Two of the three synoptic gospels write Mark out – that is the core of the two-source theory.' },
      { to: 'Luke', kind: 'parallel', de: 'Auch Lukas folgt Markus im Aufbau und ergänzt ihn.', en: 'Luke too follows Mark’s outline and expands it.' },
    ],
    oldest: { find: 'chesterbeatty', de: 'P45, um 250, enthält als erste Handschrift größere Teile des Markusevangeliums.', en: 'P45, c. 250, is the first manuscript to carry substantial parts of Mark.' },
  },
  {
    osis: 'Luke', group: 'evangelien', period: 'nachtempel', from: 60, to: 95, disputed: true,
    de: {
      dating: 'Band eins eines zweibändigen Werks; die Datierung hängt an der Apostelgeschichte. Wer deren abruptes Ende als Abfassungszeitpunkt liest, kommt auf 62, die Mehrheit auf 80–90.',
      world: 'Das Vorwort ist griechische Geschichtsschreibung im besten Stil: ein Widmungsträger, geprüfte Quellen, „von Anfang an sorgfältig nachgegangen". Lukas ordnet die Ereignisse in die Weltgeschichte ein – Kaiser, Statthalter, Hohepriester stehen mit Namen da.',
    },
    en: {
      dating: 'Volume one of a two-volume work; its dating hangs on Acts. Those who read Acts’ abrupt ending as its date of writing arrive at 62, the majority at 80–90.',
      world: 'The preface is Greek historiography at its best: a dedicatee, checked sources, "having carefully investigated everything from the beginning". Luke places the events inside world history – emperors, governors and high priests stand there by name.',
    },
    links: [
      { to: 'Acts', kind: 'continues', de: 'Dasselbe Vorwort, derselbe Adressat: Lukas und Apostelgeschichte sind ein Werk in zwei Bänden.', en: 'The same preface, the same addressee: Luke and Acts are one work in two volumes.' },
      { to: '1Sam', kind: 'quotes', de: 'Das Magnifikat folgt dem Lied der Hanna Zeile für Zeile.', en: 'The Magnificat follows Hannah’s song line by line.' },
    ],
    oldest: { find: 'bodmer', de: 'P75, um 175–225, enthält Lukas und Johannes – sein Text stimmt fast Wort für Wort mit dem Codex Vaticanus überein.', en: 'P75, c. 175–225, carries Luke and John – its text agrees almost word for word with Codex Vaticanus.' },
  },
  {
    osis: 'John', group: 'evangelien', period: 'nachtempel', from: 80, to: 110, disputed: true,
    de: {
      dating: 'Meist 90–100. Die Obergrenze ist hart: Der Papyrus P52, ein Stück aus Kapitel 18, wird ins 2. Jahrhundert datiert – das Evangelium war zu diesem Zeitpunkt in Ägypten längst im Umlauf.',
      world: 'Ein anderes Evangelium: keine Gleichnisse, keine Dämonenaustreibungen, dafür lange Reden und sieben Zeichen. Zugleich kennt es Jerusalem genau – der Teich Betesda mit seinen fünf Hallen galt als Symbolik, bis man ihn 1888 ausgrub, mit fünf Hallen.',
    },
    en: {
      dating: 'Usually 90–100. The upper limit is firm: the papyrus P52, a piece of chapter 18, is dated to the 2nd century – by then the gospel had long been circulating in Egypt.',
      world: 'A different gospel: no parables, no exorcisms, but long discourses and seven signs. At the same time it knows Jerusalem precisely – the pool of Bethesda with its five porticoes was taken for symbolism until it was excavated in 1888, with five porticoes.',
    },
    links: [
      { to: 'Gen', kind: 'quotes', de: '„Im Anfang war das Wort" – der erste Satz der Bibel, neu angesetzt.', en: '"In the beginning was the Word" – the first sentence of the Bible, begun again.' },
      { to: '1John', kind: 'parallel', de: 'Derselbe Wortschatz, dieselben Gegensätze: Licht und Finsternis, Wahrheit und Lüge.', en: 'The same vocabulary, the same oppositions: light and darkness, truth and falsehood.' },
    ],
    oldest: { find: 'rylands52', de: 'P52, ein Stück von der Größe einer Scheckkarte mit Johannes 18 – die älteste bekannte Handschrift des Neuen Testaments.', en: 'P52, a piece the size of a credit card with John 18 – the oldest known manuscript of the New Testament.' },
  },
  {
    osis: 'Acts', group: 'evangelien', period: 'nachtempel', from: 62, to: 95, disputed: true,
    de: {
      dating: 'Das Buch bricht ab, während Paulus in Rom auf seinen Prozess wartet – ohne dessen Ausgang zu nennen. Das ist das stärkste Argument für eine Abfassung um 62 und zugleich der Grund, warum andere darin eine bewusste Schlusspointe sehen.',
      world: 'Die genaueste antike Quelle für Seereisen, Statthalter und Städteverfassungen im östlichen Mittelmeer – Titel wie „Politarchen" in Thessalonich galten als Fehler, bis Inschriften sie bestätigten. Die Gallio-Inschrift von Delphi datiert Paulus in Korinth auf ein Jahr genau.',
    },
    en: {
      dating: 'The book breaks off while Paul waits in Rome for his trial – without naming its outcome. That is the strongest argument for a date around 62 and at the same time the reason others read it as a deliberate final stroke.',
      world: 'The most precise ancient source for sea voyages, governors and city constitutions in the eastern Mediterranean – titles such as "politarchs" at Thessalonica were taken for errors until inscriptions confirmed them. The Gallio inscription from Delphi dates Paul in Corinth to within a year.',
    },
    links: [
      { to: 'Luke', kind: 'continues', de: '„Den ersten Bericht habe ich gegeben, lieber Theophilus" – Band zwei nimmt den Faden auf.', en: '"In my first book, Theophilus" – volume two picks up the thread.' },
      { to: 'Gal', kind: 'parallel', de: 'Galater 1–2 erzählt dieselben Reisen aus der Ich-Perspektive – und nicht überall gleich.', en: 'Galatians 1–2 tells the same journeys in the first person – and not everywhere alike.' },
    ],
    oldest: { find: 'chesterbeatty', de: 'P45, um 250, enthält die Evangelien und die Apostelgeschichte in einem Band.', en: 'P45, c. 250, carries the gospels and Acts in a single codex.' },
  },

  /* --- Paulusbriefe ------------------------------------------------------ */
  {
    osis: 'Rom', group: 'paulus', period: 'roemer', from: 55, to: 58,
    de: {
      dating: 'Winter 56/57 in Korinth, kurz vor der Reise nach Jerusalem. Der Brief nennt seinen Schreiber selbst: „Ich, Tertius, der ich diesen Brief geschrieben habe, grüße euch."',
      world: 'Paulus schreibt an eine Gemeinde, die er nicht gegründet hat und nicht kennt – deshalb ist es der einzige Brief, in dem er sein Denken von vorn entwickelt. In Rom hatte Kaiser Claudius Jahre zuvor Juden ausgewiesen; die Rückkehrer trafen auf eine inzwischen heidenchristliche Gemeinde, und Kapitel 9–11 und 14–15 handeln von genau diesem Riss.',
    },
    en: {
      dating: 'Winter 56/57 in Corinth, just before the journey to Jerusalem. The letter names its own scribe: "I, Tertius, who wrote down this letter, greet you."',
      world: 'Paul writes to a congregation he did not found and does not know – which is why it is the one letter in which he develops his thinking from the beginning. Years earlier Claudius had expelled Jews from Rome; the returnees met a by now gentile-Christian congregation, and chapters 9–11 and 14–15 are about exactly that rift.',
    },
    links: [
      { to: 'Hab', kind: 'quotes', de: 'Der Leitsatz des Briefes ist ein Zitat: „Der Gerechte wird aus Glauben leben."', en: 'The letter’s guiding sentence is a quotation: "The righteous will live by faith."' },
      { to: 'Gen', kind: 'quotes', de: 'Kapitel 4 ist eine Auslegung von 1. Mose 15,6 – Abraham glaubte, und es wurde ihm angerechnet.', en: 'Chapter 4 is an exposition of Genesis 15:6 – Abraham believed, and it was reckoned to him.' },
    ],
    oldest: { find: 'chesterbeatty', de: 'P46, um 200 – die älteste Sammlung der Paulusbriefe, auf Papyrus, mit Römer an zweiter Stelle.', en: 'P46, c. 200 – the oldest collection of Paul’s letters, on papyrus, with Romans in second place.' },
  },
  {
    osis: '1Cor', group: 'paulus', period: 'roemer', from: 53, to: 55,
    de: {
      dating: 'Frühjahr 54 oder 55 in Ephesus. Der Brief ist nicht der erste an diese Gemeinde – er erwähnt selbst einen früheren, der verloren ist.',
      world: 'Korinth: Hafenstadt an zwei Meeren, hundert Jahre zuvor von Rom zerstört und als Kolonie neu gegründet, voller Freigelassener und schneller Karrieren. Die Fragen im Brief sind die dieser Stadt – Prozesse, Prostitution, Fleisch vom Tempelmarkt, Streit um Rang.',
    },
    en: {
      dating: 'Spring 54 or 55 in Ephesus. It is not the first letter to this congregation – it mentions an earlier one, now lost.',
      world: 'Corinth: a port city on two seas, destroyed by Rome a century earlier and refounded as a colony, full of freedmen and quick careers. The letter’s questions are that city’s – lawsuits, prostitution, meat from the temple market, quarrels over rank.',
    },
    links: [
      { to: 'Exod', kind: 'quotes', de: 'Kapitel 10 liest den Auszug als Warnung; Kapitel 5 nennt Christus das Passalamm.', en: 'Chapter 10 reads the exodus as a warning; chapter 5 calls Christ the Passover lamb.' },
      { to: '2Cor', kind: 'continues', de: 'Zwischen beiden Briefen liegt ein Besuch, der schiefging, und ein „Tränenbrief".', en: 'Between the two letters lie a visit that went wrong and a "letter of tears".' },
    ],
    oldest: { find: 'chesterbeatty', de: 'P46, um 200, enthält den Brief fast vollständig.', en: 'P46, c. 200, carries the letter almost complete.' },
  },
  {
    osis: '2Cor', group: 'paulus', period: 'roemer', from: 54, to: 57,
    de: {
      dating: 'Wenige Monate bis ein Jahr nach dem ersten Brief, aus Mazedonien. Der Ton wechselt in Kapitel 10 so abrupt, dass viele hier zwei Briefe zusammengefügt sehen.',
      world: 'Der persönlichste Text des Paulus: Er verteidigt sich gegen Gegner, die besser reden können, und zählt statt Erfolgen seine Schiffbrüche, Schläge und Gefängnisse auf. Die Kollekte für Jerusalem, um die es in Kapitel 8 und 9 geht, ist Kirchenpolitik in Zahlen.',
    },
    en: {
      dating: 'A few months to a year after the first letter, from Macedonia. The tone changes so abruptly at chapter 10 that many see two letters joined here.',
      world: 'Paul’s most personal text: he defends himself against opponents who speak better than he does, and instead of successes lists his shipwrecks, beatings and imprisonments. The collection for Jerusalem discussed in chapters 8 and 9 is church politics in figures.',
    },
    links: [
      { to: 'Exod', kind: 'quotes', de: 'Die Decke über dem Gesicht des Mose (2. Mose 34) trägt Kapitel 3.', en: 'The veil over Moses’ face (Exodus 34) carries chapter 3.' },
      { to: 'Acts', kind: 'parallel', de: 'Die Flucht aus Damaskus im Korb steht in beiden Büchern.', en: 'The escape from Damascus in a basket appears in both books.' },
    ],
    oldest: { find: 'chesterbeatty', de: 'P46, um 200.', en: 'P46, c. 200.' },
  },
  {
    osis: 'Gal', group: 'paulus', period: 'roemer', from: 48, to: 56, disputed: true,
    de: {
      dating: 'Je nachdem, ob „Galatien" die Landschaft im Norden oder die römische Provinz im Süden meint, ist es entweder der früheste Paulusbrief (48/49, vor dem Apostelkonzil) oder einer der mittleren (um 55).',
      world: 'Der Streit, an dem sich entschied, ob das Christentum eine jüdische Richtung bleibt: Müssen Heiden beschnitten werden? Paulus erzählt, wie er Petrus in Antiochia öffentlich widersprach – ein Konflikt unter Aposteln, aufgeschrieben von einer der beiden Seiten.',
    },
    en: {
      dating: 'Depending on whether "Galatia" means the region in the north or the Roman province in the south, this is either Paul’s earliest letter (48/49, before the Jerusalem council) or one of the middle ones (c. 55).',
      world: 'The quarrel that decided whether Christianity would remain a Jewish movement: must gentiles be circumcised? Paul recounts how he contradicted Peter publicly at Antioch – a conflict between apostles, written up by one of the two.',
    },
    links: [
      { to: 'Acts', kind: 'parallel', de: 'Apostelgeschichte 15 erzählt dieselbe Entscheidung – ruhiger und aus der Ferne.', en: 'Acts 15 tells the same decision – more calmly, and from a distance.' },
      { to: 'Rom', kind: 'parallel', de: 'Dieselbe Sache zweimal: einmal im Streit, einmal geordnet.', en: 'The same matter twice: once in the heat of a quarrel, once in order.' },
    ],
    oldest: { find: 'chesterbeatty', de: 'P46, um 200.', en: 'P46, c. 200.' },
  },
  {
    osis: 'Eph', group: 'paulus', period: 'nachtempel', from: 60, to: 90, disputed: true,
    de: {
      dating: 'Umstritten. Sprache und Satzbau weichen von den unbestrittenen Briefen ab, die Anrede „in Ephesus" fehlt in den ältesten Handschriften – viele lesen den Text als Rundbrief eines Paulusschülers.',
      world: 'Kein konkreter Konflikt, keine Namen, keine Rückfragen: ein Schreiben über die Kirche als ganze. Ephesus war die größte Stadt der Provinz Asia, mit dem Artemistempel als Wirtschaftsfaktor – wovon die Apostelgeschichte einen Aufruhr zu berichten weiß.',
    },
    en: {
      dating: 'Disputed. Vocabulary and sentence structure diverge from the undisputed letters, and the address "in Ephesus" is missing from the oldest manuscripts – many read the text as a circular letter by a pupil of Paul.',
      world: 'No concrete conflict, no names, no follow-up questions: a writing about the church as a whole. Ephesus was the largest city of the province of Asia, with the temple of Artemis as an economic engine – over which Acts reports a riot.',
    },
    links: [
      { to: 'Col', kind: 'parallel', de: 'Ein Drittel des Textes deckt sich mit dem Kolosserbrief, oft Satz für Satz.', en: 'A third of the text overlaps with Colossians, often sentence by sentence.' },
    ],
    oldest: { find: 'chesterbeatty', de: 'P46, um 200 – und dort ohne die Ortsangabe „in Ephesus".', en: 'P46, c. 200 – and there without the address "in Ephesus".' },
  },
  {
    osis: 'Phil', group: 'paulus', period: 'roemer', from: 55, to: 62,
    de: {
      dating: 'Aus der Haft, um 61/62 in Rom – oder früher in Ephesus, was den kurzen Weg für die im Brief erwähnten Botengänge besser erklärt.',
      world: 'Philippi war römische Kolonie mit Veteranen als Bürgern; die Gemeinde dort war die erste in Europa und die einzige, von der Paulus Geld annahm. Mitten im Brief steht ein Lied über einen, der seine Stellung nicht festhielt – womöglich älter als der Brief selbst.',
    },
    en: {
      dating: 'From prison, around 61/62 in Rome – or earlier in Ephesus, which better explains the short distances the letter’s messenger traffic implies.',
      world: 'Philippi was a Roman colony with veterans as citizens; its congregation was the first in Europe and the only one from which Paul accepted money. In the middle of the letter stands a hymn about one who did not cling to his standing – possibly older than the letter itself.',
    },
    links: [
      { to: 'Acts', kind: 'parallel', de: 'Apostelgeschichte 16: Lydia, der Kerkermeister, das Erdbeben – die Gründung dieser Gemeinde.', en: 'Acts 16: Lydia, the jailer, the earthquake – the founding of this congregation.' },
      { to: 'Isa', kind: 'quotes', de: '„Jedes Knie soll sich beugen" ist Jesaja 45,23, auf Christus bezogen.', en: '"Every knee shall bow" is Isaiah 45:23, referred to Christ.' },
    ],
    oldest: { find: 'chesterbeatty', de: 'P46, um 200.', en: 'P46, c. 200.' },
  },
  {
    osis: 'Col', group: 'paulus', period: 'nachtempel', from: 60, to: 80, disputed: true,
    de: {
      dating: 'Wie beim Epheserbrief steht die Verfasserschaft in Frage – Stil und Christologie gehen über die unbestrittenen Briefe hinaus. Wer ihn für echt hält, datiert ihn in die römische Haft.',
      world: 'Kolossä im Lykostal war eine Kleinstadt im Abstieg; ein Erdbeben um 60 traf die Gegend schwer. Die Gemeinde hat Paulus nie gesehen – gegründet hat sie Epaphras –, und sie bekommt einen Brief gegen eine Frömmigkeit aus Engelverehrung, Kalenderfragen und Askese.',
    },
    en: {
      dating: 'As with Ephesians the authorship is in question – style and christology go beyond the undisputed letters. Those who hold it genuine date it to the Roman imprisonment.',
      world: 'Colossae in the Lycus valley was a small town in decline; an earthquake around 60 hit the area hard. Paul never saw the congregation – Epaphras founded it – and it receives a letter against a piety of angel worship, calendar questions and asceticism.',
    },
    links: [
      { to: 'Phlm', kind: 'parallel', de: 'Dieselben Grüße, dieselben Namen – und Onesimus, der Sklave aus dem Philemonbrief, ist in Kapitel 4 dabei.', en: 'The same greetings, the same names – and Onesimus, the slave of Philemon, is there in chapter 4.' },
      { to: 'Eph', kind: 'parallel', de: 'Zwei Briefe, die sich über weite Strecken decken.', en: 'Two letters that overlap for long stretches.' },
    ],
    oldest: { find: 'chesterbeatty', de: 'P46, um 200.', en: 'P46, c. 200.' },
  },
  {
    osis: '1Thess', group: 'paulus', period: 'roemer', from: 49, to: 52,
    de: {
      dating: 'Um 50/51 aus Korinth – nach überwiegender Ansicht die älteste Schrift des Neuen Testaments. Zwanzig Jahre vor dem ersten Evangelium.',
      world: 'Die Gemeinde ist wenige Monate alt und hat eine Frage, mit der niemand gerechnet hatte: Was ist mit denen, die schon gestorben sind? Die Antwort in Kapitel 4 ist der älteste erhaltene christliche Text über die Auferstehung der Toten.',
    },
    en: {
      dating: 'Around 50/51 from Corinth – on the prevailing view the oldest writing in the New Testament. Twenty years before the first gospel.',
      world: 'The congregation is a few months old and has a question nobody had expected: what about those who have already died? The answer in chapter 4 is the oldest surviving Christian text on the resurrection of the dead.',
    },
    links: [
      { to: 'Acts', kind: 'parallel', de: 'Apostelgeschichte 17 erzählt die drei Wochen in Thessalonich und den Aufruhr danach.', en: 'Acts 17 tells the three weeks in Thessalonica and the riot that followed.' },
      { to: '2Thess', kind: 'continues', de: 'Derselbe Adressat, dieselbe Frage – und eine Korrektur.', en: 'The same addressee, the same question – and a correction.' },
    ],
    oldest: { find: 'chesterbeatty', de: 'P46 bricht vorher ab; ältester Zeuge ist P30 (3. Jh.), vollständig der Codex Sinaiticus.', en: 'P46 breaks off before it; the oldest witness is P30 (3rd century), complete in Codex Sinaiticus.' },
  },
  {
    osis: '2Thess', group: 'paulus', period: 'roemer', from: 50, to: 90, disputed: true,
    de: {
      dating: 'Entweder wenige Monate nach dem ersten Brief oder deutlich später von anderer Hand: Der Brief warnt selbst vor einem gefälschten Schreiben „wie von uns" und beglaubigt sich mit einer eigenhändigen Unterschrift – ein Satz, der beide Lesarten stützt.',
      world: 'Die Naherwartung war praktisch geworden: Manche hatten aufgehört zu arbeiten. Daher der Satz, der später Geschichte machte – „wer nicht arbeiten will, soll auch nicht essen".',
    },
    en: {
      dating: 'Either a few months after the first letter or considerably later by another hand: the letter itself warns against a forged writing "as though from us" and authenticates itself with a signature in Paul’s own hand – a sentence that supports both readings.',
      world: 'Imminent expectation had become practical: some had stopped working. Hence the line that later made history – "anyone unwilling to work should not eat".',
    },
    links: [
      { to: '1Thess', kind: 'continues', de: 'Derselbe Briefkopf, fast derselbe Aufbau – und eine gebremste Naherwartung.', en: 'The same heading, almost the same structure – and a braked expectation of the end.' },
      { to: 'Dan', kind: 'quotes', de: 'Der „Mensch der Gesetzlosigkeit" in Kapitel 2 kommt aus Daniels Bildwelt.', en: 'The "man of lawlessness" in chapter 2 comes from Daniel’s imagery.' },
    ],
    oldest: { find: 'sinaiticus', de: 'Codex Sinaiticus, 4. Jh.; ältere Papyrusfragmente (P92) sind winzig.', en: 'Codex Sinaiticus, 4th century; the older papyrus fragments (P92) are tiny.' },
  },
  {
    osis: '1Tim', group: 'paulus', period: 'nachtempel', from: 62, to: 110, disputed: true,
    de: {
      dating: 'Die drei Pastoralbriefe werden seit dem 19. Jahrhundert überwiegend einem Paulusschüler zugeschrieben: anderer Wortschatz, ausgebaute Ämter, eine Gemeindeordnung statt eines Briefwechsels.',
      world: 'Was im Text steht, ist der Alltag der zweiten Generation: Wer darf lehren, wer wird Ältester, wie geht die Gemeinde mit Witwen um, was tun mit Streitsucht. Die Regeln über Frauen in Kapitel 2 sind bis heute der umstrittenste Abschnitt.',
    },
    en: {
      dating: 'Since the 19th century the three Pastoral Epistles have mostly been ascribed to a pupil of Paul: different vocabulary, developed offices, a church order instead of a correspondence.',
      world: 'What stands in the text is the everyday life of the second generation: who may teach, who becomes an elder, how the congregation handles widows, what to do about quarrelsomeness. The rules about women in chapter 2 remain the most contested passage of all.',
    },
    links: [
      { to: 'Titus', kind: 'parallel', de: 'Fast dieselbe Ämterliste in zwei Briefen.', en: 'Almost the same list of offices in two letters.' },
      { to: 'Deut', kind: 'quotes', de: '„Du sollst dem Ochsen das Maul nicht verbinden" – zur Bezahlung von Ältesten.', en: '"Do not muzzle an ox while it treads the grain" – applied to paying elders.' },
    ],
    oldest: { find: 'sinaiticus', de: 'Codex Sinaiticus, 4. Jh. – der Codex Vaticanus enthält die Pastoralbriefe nicht.', en: 'Codex Sinaiticus, 4th century – Codex Vaticanus does not contain the Pastoral Epistles.' },
  },
  {
    osis: '2Tim', group: 'paulus', period: 'nachtempel', from: 62, to: 110, disputed: true,
    de: {
      dating: 'Wie 1. Timotheus umstritten. Von den drei Pastoralbriefen wirkt dieser am persönlichsten – wer eine echte Paulusnotiz in ihnen vermutet, vermutet sie hier.',
      world: 'Ein Abschiedsbrief: Der Schreiber sitzt in Haft, die Mitarbeiter sind fort, und er bittet um seinen Mantel und die Bücher, „vor allem die Pergamente". Es ist die einzige Stelle im Neuen Testament, an der jemand nach seinen Büchern fragt.',
    },
    en: {
      dating: 'Disputed like 1 Timothy. Of the three Pastorals this reads as the most personal – anyone suspecting a genuine Pauline note among them suspects it here.',
      world: 'A farewell letter: the writer is in custody, his colleagues have gone, and he asks for his cloak and the books, "above all the parchments". It is the one place in the New Testament where somebody asks for his books.',
    },
    links: [
      { to: '1Tim', kind: 'continues', de: 'Derselbe Adressat, andere Lage: dort Ordnung, hier Abschied.', en: 'The same addressee, a different situation: there order, here farewell.' },
    ],
    oldest: { find: 'sinaiticus', de: 'Codex Sinaiticus, 4. Jh.', en: 'Codex Sinaiticus, 4th century.' },
  },
  {
    osis: 'Titus', group: 'paulus', period: 'nachtempel', from: 62, to: 110, disputed: true,
    de: {
      dating: 'Derselbe Befund wie bei den beiden Timotheusbriefen; die drei werden fast immer zusammen beurteilt.',
      world: 'Kreta, eine Insel mit schlechtem Ruf – der Brief zitiert dafür sogar einen kretischen Dichter. Was Titus einrichten soll, ist eine Gemeindestruktur in einer Umgebung, in der niemand mit Christen rechnete.',
    },
    en: {
      dating: 'The same picture as with the two letters to Timothy; the three are almost always judged together.',
      world: 'Crete, an island with a poor reputation – the letter even quotes a Cretan poet to that effect. What Titus is to set up is a congregational structure in surroundings where nobody expected Christians.',
    },
    links: [
      { to: '1Tim', kind: 'parallel', de: 'Dieselben Anforderungen an Älteste, in anderer Reihenfolge.', en: 'The same requirements for elders, in a different order.' },
    ],
    oldest: { find: 'oxyrhynchus', de: 'P32, um 200, aus Oxyrhynchos – das älteste Stück eines Pastoralbriefs.', en: 'P32, c. 200, from Oxyrhynchus – the oldest piece of any Pastoral Epistle.' },
  },
  {
    osis: 'Phlm', group: 'paulus', period: 'roemer', from: 55, to: 62,
    de: {
      dating: 'Aus derselben Haft wie der Kolosserbrief, um 60 – die Echtheit ist unbestritten.',
      world: 'Der kürzeste Brief des Paulus, 25 Verse, und der einzige an eine Privatperson: Ein entlaufener Sklave soll zurück, aber „nicht mehr als Sklave, sondern als geliebter Bruder". Paulus fordert die Freilassung nicht – er schreibt so, dass sie kaum zu vermeiden ist.',
    },
    en: {
      dating: 'From the same imprisonment as Colossians, around 60 – its authenticity is undisputed.',
      world: 'Paul’s shortest letter, 25 verses, and the only one to a private person: a runaway slave is to go back, but "no longer as a slave, rather as a beloved brother". Paul does not demand manumission – he writes in such a way that it is hard to avoid.',
    },
    links: [
      { to: 'Col', kind: 'parallel', de: 'Onesimus und Archippus kommen in beiden Briefen vor – dieselbe Hausgemeinde.', en: 'Onesimus and Archippus appear in both letters – the same house congregation.' },
    ],
    oldest: { find: 'oxyrhynchus', de: 'P87, 3. Jh., ein Fragment aus Oxyrhynchos – das älteste Stück des Briefes.', en: 'P87, 3rd century, a fragment from Oxyrhynchus – the oldest piece of the letter.' },
  },

  /* --- Übrige Briefe ----------------------------------------------------- */
  {
    osis: 'Heb', group: 'briefe', period: 'roemer', from: 60, to: 95, disputed: true,
    de: {
      dating: 'Der Text spricht vom Tempeldienst im Präsens, was für eine Abfassung vor 70 spricht; der Erste Clemensbrief zitiert ihn um 96. Wer ihn geschrieben hat, wusste schon Origenes nicht: „Wer den Brief geschrieben hat, weiß Gott allein."',
      world: 'Kein Brief, sondern eine Predigt – der Text nennt sich selbst „Wort der Ermahnung" und hat keinen Briefkopf. Geschrieben für Menschen, die unter Druck erwogen, zur Synagoge zurückzukehren, und denen der Verfasser zeigt, dass es dahinter nichts Besseres gibt.',
    },
    en: {
      dating: 'The text speaks of the temple service in the present tense, which argues for a date before 70; 1 Clement quotes it around 96. Who wrote it was already unknown to Origen: "Who wrote the letter, God alone knows."',
      world: 'Not a letter but a sermon – the text calls itself a "word of exhortation" and has no epistolary opening. Written for people who under pressure were considering a return to the synagogue, and shown by the author that there is nothing better behind them.',
    },
    links: [
      { to: 'Lev', kind: 'quotes', de: 'Der Versöhnungstag und das Heiligtum aus 3. Mose tragen die Kapitel 8 bis 10.', en: 'The Day of Atonement and the sanctuary of Leviticus carry chapters 8 to 10.' },
      { to: 'Jer', kind: 'quotes', de: 'Der neue Bund aus Jeremia 31 steht hier vollständig zitiert.', en: 'The new covenant of Jeremiah 31 is quoted here in full.' },
      { to: 'Ps', kind: 'quotes', de: 'Die Beweisführung der ersten Kapitel besteht fast nur aus Psalmversen.', en: 'The argument of the opening chapters consists almost entirely of psalm verses.' },
    ],
    oldest: { find: 'chesterbeatty', de: 'P46, um 200 – und dort mitten unter den Paulusbriefen einsortiert, direkt nach Römer.', en: 'P46, c. 200 – and there filed in among Paul’s letters, right after Romans.' },
  },
  {
    osis: 'Jas', group: 'briefe', period: 'roemer', from: 45, to: 90, disputed: true,
    de: {
      dating: 'Entweder sehr früh – vor dem Apostelkonzil, geschrieben vom Bruder Jesu, der 62 hingerichtet wurde – oder spät und unter seinem Namen. Das gute Griechisch spricht gegen einen galiläischen Handwerkersohn, die schlichte Theologie für eine frühe Zeit.',
      world: 'Ein Text voller kurzer Anweisungen, näher an den Sprüchen Salomos und der Bergpredigt als an Paulus. Der Konflikt, den er beschreibt, ist sozial: Reiche bekommen die guten Plätze, Tagelöhnern wird der Lohn vorenthalten.',
    },
    en: {
      dating: 'Either very early – before the Jerusalem council, written by the brother of Jesus who was executed in 62 – or late and under his name. The good Greek argues against a Galilean craftsman’s son, the plain theology for an early date.',
      world: 'A text full of short instructions, closer to Proverbs and the Sermon on the Mount than to Paul. The conflict it describes is social: the rich get the good seats, and day labourers are cheated of their wages.',
    },
    links: [
      { to: 'Rom', kind: 'answers', de: '„Der Mensch wird durch Werke gerecht und nicht durch Glauben allein" – Luther nannte den Brief darum eine „stroherne Epistel".', en: '"A person is justified by works and not by faith alone" – which is why Luther called it "an epistle of straw".' },
      { to: 'Matt', kind: 'parallel', de: 'Über zwanzig Anklänge an die Bergpredigt, keiner davon als Zitat gekennzeichnet.', en: 'Over twenty echoes of the Sermon on the Mount, none of them marked as a quotation.' },
    ],
    oldest: { find: 'oxyrhynchus', de: 'P20 und P23, 3. Jh., beide aus Oxyrhynchos.', en: 'P20 and P23, 3rd century, both from Oxyrhynchus.' },
  },
  {
    osis: '1Pet', group: 'briefe', period: 'roemer', from: 60, to: 95, disputed: true,
    de: {
      dating: 'Wenn von Petrus, dann vor seinem Tod unter Nero (um 64/67); das geschliffene Griechisch führen Verteidiger auf Silvanus zurück, der im Brief als Schreiber genannt ist. Andere setzen ihn um 80–90 an.',
      world: 'Adressiert an „Fremdlinge in der Zerstreuung" in fünf Provinzen Kleinasiens – Menschen, die nicht verfolgt werden, aber als Fremdkörper gelten. Der Rat lautet nicht Rückzug, sondern eine Lebensweise, gegen die sich schwer etwas sagen lässt.',
    },
    en: {
      dating: 'If by Peter, then before his death under Nero (c. 64/67); defenders attribute the polished Greek to Silvanus, named in the letter as the scribe. Others place it around 80–90.',
      world: 'Addressed to "strangers in the dispersion" across five provinces of Asia Minor – people who are not being persecuted but are treated as foreign bodies. The advice is not withdrawal but a way of living against which little can be said.',
    },
    links: [
      { to: 'Isa', kind: 'quotes', de: '„Durch seine Wunden seid ihr heil geworden" – Jesaja 53, auf die Leser angewandt.', en: '"By his wounds you have been healed" – Isaiah 53, applied to the readers.' },
    ],
    oldest: { find: 'bodmer', de: 'P72, 3./4. Jh. – die Bodmer-Handschrift enthält 1. und 2. Petrus und Judas vollständig.', en: 'P72, 3rd/4th century – the Bodmer manuscript carries 1 and 2 Peter and Jude complete.' },
  },
  {
    osis: '2Pet', group: 'briefe', period: 'nachtempel', from: 65, to: 130, disputed: true,
    de: {
      dating: 'Der am stärksten bestrittene Text des Neuen Testaments. Er kennt eine Sammlung der Paulusbriefe als „Schriften", verarbeitet den Judasbrief und antwortet auf die Frage, warum die Wiederkunft ausbleibt – drei Anzeichen für eine späte Abfassung.',
      world: 'Die erste Generation ist gestorben, und der Spott beginnt: „Wo bleibt die Verheißung seiner Wiederkunft?" Die Antwort – bei Gott ist ein Tag wie tausend Jahre – ist der Umgang einer Bewegung mit der Zeit, die vergeht.',
    },
    en: {
      dating: 'The most strongly contested text in the New Testament. It knows a collection of Paul’s letters as "scriptures", reworks Jude, and answers the question why the return has not come – three signs of a late composition.',
      world: 'The first generation has died, and the mockery begins: "Where is the promise of his coming?" The answer – with God one day is like a thousand years – is a movement’s way of handling time that keeps passing.',
    },
    links: [
      { to: 'Jude', kind: 'quotes', de: 'Kapitel 2 übernimmt den Judasbrief fast vollständig, in geglätteter Form.', en: 'Chapter 2 takes over Jude almost entirely, in smoothed-out form.' },
    ],
    oldest: { find: 'bodmer', de: 'P72, 3./4. Jh.', en: 'P72, 3rd/4th century.' },
  },
  {
    osis: '1John', group: 'briefe', period: 'nachtempel', from: 85, to: 110,
    de: {
      dating: 'Nach dem Johannesevangelium und aus derselben Schule, um 90–110. Ein Verfassername steht nirgends im Text.',
      world: 'Eine Gemeinde hat sich gespalten – „sie sind von uns ausgegangen, aber sie waren nicht von uns". Der Streit geht darum, ob Christus wirklich Mensch war, und der Brief antwortet mit dem, was man anfassen konnte: „was wir mit unseren Händen betastet haben".',
    },
    en: {
      dating: 'After the Gospel of John and from the same school, around 90–110. No author’s name appears anywhere in the text.',
      world: 'A congregation has split – "they went out from us, but they did not belong to us". The quarrel is about whether Christ was truly human, and the letter answers with what could be touched: "what our hands have handled".',
    },
    links: [
      { to: 'John', kind: 'parallel', de: 'Derselbe Anfang wie das Evangelium, dieselben Wortpaare.', en: 'The same opening as the gospel, the same pairs of words.' },
    ],
    oldest: { find: 'oxyrhynchus', de: 'P9, 3. Jh., ein Fragment aus Kapitel 4, gefunden in Oxyrhynchos.', en: 'P9, 3rd century, a fragment of chapter 4, found at Oxyrhynchus.' },
  },
  {
    osis: '2John', group: 'briefe', period: 'nachtempel', from: 85, to: 110,
    de: {
      dating: 'Aus derselben Zeit und Schule wie der erste Johannesbrief. Der Absender nennt sich nur „der Älteste".',
      world: 'Dreizehn Verse auf einem einzigen Papyrusblatt – genau so lang, wie ein Blatt trägt. Der Inhalt ist Hausrecht: Wer eine andere Lehre bringt, soll nicht aufgenommen werden. Gastfreundschaft war damals die Infrastruktur der Mission, und sie zu verweigern war die schärfste Maßnahme, die eine Gemeinde hatte.',
    },
    en: {
      dating: 'From the same period and school as 1 John. The sender calls himself only "the elder".',
      world: 'Thirteen verses on a single sheet of papyrus – exactly as long as one sheet holds. Its content is house rules: anyone bringing a different teaching is not to be taken in. Hospitality was then the infrastructure of the mission, and refusing it was the sharpest measure a congregation had.',
    },
    links: [
      { to: '3John', kind: 'parallel', de: 'Zwei Briefe desselben „Ältesten" – einmal gegen die Aufnahme, einmal für sie.', en: 'Two letters from the same "elder" – one against taking people in, one for it.' },
    ],
    oldest: { find: 'sinaiticus', de: 'Codex Sinaiticus und Codex Vaticanus, 4. Jh.; ein älterer Papyrus ist nicht erhalten.', en: 'Codex Sinaiticus and Codex Vaticanus, 4th century; no older papyrus survives.' },
  },
  {
    osis: '3John', group: 'briefe', period: 'nachtempel', from: 85, to: 110,
    de: {
      dating: 'Dieselbe Hand wie beim zweiten Brief und dieselbe Zeit, um 90–110: Beide tragen denselben Absender – „der Älteste" –, dieselbe Briefform und dasselbe Blattmaß.',
      world: 'Das kürzeste Buch der Bibel und das am wenigsten theologische: ein Gemeindekonflikt mit drei Namen. Diotrephes, „der gern der Erste sein will", nimmt die Boten nicht auf und wirft hinaus, wer es doch tut. Ein Machtkampf um das Jahr 100, in vierzehn Versen aktenkundig.',
    },
    en: {
      dating: 'The same hand as the second letter and the same period, around 90–110: both carry the same sender – "the elder" – the same epistolary form and the same sheet size.',
      world: 'The shortest book in the Bible and the least theological: a congregational conflict with three names in it. Diotrephes, "who likes to put himself first", refuses the messengers and expels anyone who receives them. A power struggle around the year 100, on record in fourteen verses.',
    },
    links: [
      { to: '2John', kind: 'parallel', de: 'Dieselbe Frage von der anderen Seite: Wen lässt eine Gemeinde herein?', en: 'The same question from the other side: whom does a congregation let in?' },
    ],
    oldest: { find: 'sinaiticus', de: 'Codex Sinaiticus und Codex Vaticanus, 4. Jh.', en: 'Codex Sinaiticus and Codex Vaticanus, 4th century.' },
  },
  {
    osis: 'Jude', group: 'briefe', period: 'nachtempel', from: 50, to: 110, disputed: true,
    de: {
      dating: 'Der Verfasser nennt sich „Bruder des Jakobus" – also ein weiterer Bruder Jesu, was eine frühe Datierung zuließe. Das Griechisch und die Rede von „dem Glauben, der ein für alle Mal überliefert ist" sprechen für später.',
      world: 'Fünfundzwanzig Verse gegen Leute, die sich in die Gemeindemahlzeiten gesetzt haben. Bemerkenswert ist, woraus der Brief zitiert: aus dem Henochbuch und der Himmelfahrt des Mose – Schriften, die nicht in den Kanon kamen, für diesen Verfasser aber Autorität hatten.',
    },
    en: {
      dating: 'The author calls himself "brother of James" – so another brother of Jesus, which would allow an early date. The Greek and the talk of "the faith once for all delivered" argue for later.',
      world: 'Twenty-five verses against people who have seated themselves at the congregational meals. What is remarkable is what the letter quotes: the book of Enoch and the Assumption of Moses – writings that did not enter the canon but carried authority for this author.',
    },
    links: [
      { to: '2Pet', kind: 'quoted', de: '2. Petrus 2 übernimmt fast den ganzen Brief – und lässt die Zitate aus den nichtkanonischen Schriften weg.', en: '2 Peter 2 takes over almost the whole letter – and drops the quotations from the non-canonical writings.' },
    ],
    oldest: { find: 'bodmer', de: 'P72, 3./4. Jh. – dort steht der Judasbrief vollständig neben den Petrusbriefen.', en: 'P72, 3rd/4th century – there Jude stands complete beside the letters of Peter.' },
  },

  /* --- Apokalypse -------------------------------------------------------- */
  {
    osis: 'Rev', group: 'apokalypse', period: 'nachtempel', from: 68, to: 96, disputed: true,
    de: {
      dating: 'Irenäus datiert das Buch „gegen Ende der Regierung Domitians", also um 95. Die Gegenrechnung setzt es unter Nero an, weil die Zahl 666 als hebräische Schreibung von „Kaiser Nero" aufgeht – eine Deutung, die es in einer Handschrift sogar als Lesart 616 gibt.',
      world: 'Sieben Gemeinden in der Provinz Asia, Kaiserkult als Bürgerpflicht, ein Verfasser auf der Insel Patmos. Das Buch redet in Bildern, weil es über Rom redet – „Babylon, die große Stadt" ist keine Chiffre, die entschlüsselt werden müsste, sondern eine, die jeder Leser sofort verstand.',
    },
    en: {
      dating: 'Irenaeus dates the book "towards the end of Domitian’s reign", so around 95. The counter-reckoning places it under Nero, because the number 666 works out as a Hebrew spelling of "Caesar Nero" – a reading that even survives in one manuscript as 616.',
      world: 'Seven congregations in the province of Asia, the imperial cult as a civic duty, an author on the island of Patmos. The book speaks in images because it is speaking about Rome – "Babylon the great city" is not a cipher needing to be cracked but one every reader understood at once.',
    },
    links: [
      { to: 'Dan', kind: 'quotes', de: 'Die Tiere, die Zeiten, der Menschensohn – die Bildsprache kommt aus Daniel.', en: 'The beasts, the times, the son of man – the imagery comes from Daniel.' },
      { to: 'Ezek', kind: 'quotes', de: 'Thronwagen, Buchrolle zum Essen, Gog und Magog, die vermessene Stadt: Hesekiel in neuer Reihenfolge.', en: 'Throne chariot, scroll to be eaten, Gog and Magog, the measured city: Ezekiel in a new order.' },
      { to: 'Isa', kind: 'quotes', de: 'Der neue Himmel und die neue Erde stehen zuerst bei Jesaja.', en: 'The new heaven and the new earth stand first in Isaiah.' },
    ],
    oldest: { find: 'chesterbeatty', de: 'P47, um 250, mit den Kapiteln 9 bis 17 – der Codex Vaticanus enthält die Offenbarung nicht.', en: 'P47, c. 250, with chapters 9 to 17 – Codex Vaticanus does not contain Revelation.' },
  },
];

export const SHELF_BY_OSIS: Record<string, ShelfBook> = Object.fromEntries(SHELF.map((b) => [b.osis, b]));

/**
 * Eine Jahresspanne als ein Satz: „1400–450 v. Chr.", „63 v.–70 n. Chr.",
 * „um 200 n. Chr.". Die Zusatzangabe steht nur einmal, wenn beide Enden auf
 * derselben Seite der Zeitenwende liegen – „1400 v. Chr.–450 v. Chr." liest
 * niemand.
 *
 * Eigene Rechnung statt `formatYear` aus `genealogy.ts`: Diese Ansicht würde
 * sonst die 60 kB des Zeitbaums mitladen, um zwei Zahlen zu setzen.
 */
export function formatSpan(from: number, to: number, lang: 'de' | 'en'): string {
  const bc = lang === 'de' ? 'v. Chr.' : 'BC';
  const ad = lang === 'de' ? 'n. Chr.' : 'AD';
  const um = lang === 'de' ? 'um ' : 'c. ';
  if (from === to) return `${um}${Math.abs(from)} ${from < 0 ? bc : ad}`;
  if (from < 0 && to < 0) return `${Math.abs(from)}–${Math.abs(to)} ${bc}`;
  if (from >= 0 && to >= 0) return `${from}–${to} ${ad}`;
  const vor = lang === 'de' ? 'v.' : 'BC';
  return `${Math.abs(from)} ${vor}–${to} ${ad}`;
}

/**
 * Die Breite eines Rückens. Ein Regal, in dem alle Bücher gleich dick sind,
 * erzählt nichts; hier ist die Dicke die Länge des Buches.
 *
 * Nicht linear: Die Psalmen haben 150 Kapitel, Obadja eines. Linear gerechnet
 * wäre Obadja 0,4 Pixel breit – ein Strich, den keine Maus trifft und den
 * WCAG 2.2 zu Recht als Bedienelement ablehnt. Die Wurzel drückt die Spanne
 * auf das Verhältnis 1:12 zusammen, und `MIN_BREIT` hebt den dünnsten Rücken
 * über die 24 Pixel, ab denen ein Ziel als treffbar gilt.
 */
export const MIN_BREIT = 26;
export const MAX_BREIT = 72;

export function spineWidth(chapters: number): number {
  // Von 1 aus gerechnet, nicht von 0: Sonst begänne die Skala unterhalb des
  // kürzesten Buches, und Obadja bekäme 30 statt 26 Pixel – die Mindestbreite
  // stünde in der Datei und käme nie vor.
  const t = (Math.sqrt(Math.max(1, chapters)) - 1) / (Math.sqrt(150) - 1);
  return Math.round(MIN_BREIT + t * (MAX_BREIT - MIN_BREIT));
}

/**
 * Die Höhe eines Rückens. Echte Bücher stehen nicht bündig, und ein Regal, in
 * dem sie es tun, sieht aus wie ein Balkendiagramm. Die Abweichung ist darum
 * bewusst **ohne Bedeutung** – sie kommt aus der Buchnummer und ist damit
 * stabil, aber sie misst nichts. Wer daraus etwas herausliest, läse etwas
 * hinein; deshalb steht unter dem Regal, was Breite und Farbe bedeuten, und
 * die Höhe steht nicht dabei.
 *
 * Die **Untergrenze** hat dagegen einen Grund: Auf dem Rücken steht der Name,
 * senkrecht, und der längste ist „Apostelgeschichte". Gemessen braucht er im
 * Browser 111 Pixel; mit dem Innenabstand von 16 muss der niedrigste Rücken
 * also über 127 liegen. Bei 104 wurde er abgeschnitten – vorn und hinten
 * zugleich, weil der Name mittig steht. `check:shelf` hält die Namenslänge
 * seither an einer Obergrenze fest.
 */
export const HOEHE_MIN = 136;
export const HOEHE_MAX = 164;
/**
 * So viele Zeichen trägt der niedrigste Rücken. Ein Zeichenmaß ist ein grobes
 * Maß für eine Pixelbreite – Versalien sind breiter als Kleinbuchstaben –,
 * aber für Buchnamen genau genug: Der längste deutsche hat 17 Zeichen und
 * misst 111 Pixel, der Rücken trägt 120.
 */
export const MAX_ZEICHEN = 18;

export function spineHeight(num: number): number {
  const stufen = [0, 5, 11, 3, 17, 8, 14, 21, 2, 12];
  return HOEHE_MIN + stufen[num % stufen.length] + ((num * 7) % 8);
}

/** Alle Bücher eines Bretts der Entstehungs-Ordnung, in der Reihenfolge des Kanons. */
export function booksInPeriod(periodId: string): ShelfBook[] {
  return SHELF.filter((b) => b.period === periodId);
}

/** Alle Bücher einer Kanongruppe. */
export function booksInGroup(groupId: string): ShelfBook[] {
  return SHELF.filter((b) => b.group === groupId);
}

/** Buch samt Stammdaten aus `books.ts` – die Oberfläche braucht immer beides. */
export function shelfMeta(osis: string): { shelf: ShelfBook; meta: BookMeta } | null {
  const shelf = SHELF_BY_OSIS[osis];
  const meta = BOOK_BY_OSIS[osis];
  return shelf && meta ? { shelf, meta } : null;
}

/**
 * Wer zeigt auf dieses Buch? `links` steht immer beim zeigenden Buch; ohne die
 * Umkehrung sähe ein Leser von Jesaja aus nicht, dass vier Bücher des Neuen
 * Testaments ihn zitieren.
 */
export const LINKS_TO: Record<string, { from: string; link: BookLink }[]> = (() => {
  const map: Record<string, { from: string; link: BookLink }[]> = {};
  for (const b of SHELF) {
    for (const l of b.links) (map[l.to] ??= []).push({ from: b.osis, link: l });
  }
  return map;
})();
