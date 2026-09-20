// Buchporträts – ein Buch der Bibel auf einer Seite.
//
// **Was hier fehlt und warum es diese Datei gibt.** Die App kann bisher viel
// mit einem Buch anfangen: der Entdeckermodus liest es Kapitel für Kapitel,
// das Bücherregal sagt, wann es geschrieben wurde und was die älteste
// Handschrift ist, „Hören & Sehen" nennt die Folgen dazu. Was nirgends steht,
// ist das Naheliegendste: **wovon das Buch handelt**. Wer „1. Mose" anklickt,
// bekommt fünfzig Kapitel und kein Bild davon, was ihn erwartet.
//
// Ein Porträt beantwortet sechs Fragen, und zwar in dieser Reihenfolge:
//
//   1. **Wie ist es gebaut?**  `movements` – die Züge des Buches, lückenlos
//      über alle Kapitel. Sie werden in der Oberfläche nacheinander auf eine
//      Schriftrolle gezeichnet, so wie ein Erklärvideo seine Tafel füllt: erst
//      der Strich, dann das Wort dazu.
//   2. **Was wiederholt sich?**  `patterns` – die Muster, die über mehreren
//      Zügen liegen. In 1. Mose ist es dreimal dieselbe Bewegung: Segen,
//      Griff, Zerstreuung. Das sieht man erst, wenn die Züge nebeneinander
//      liegen, und genau dafür ist die Rolle da.
//   3. **Wer kommt vor?**  `figures` – mit Namensbedeutung, dem Wendepunkt
//      der jeweiligen Geschichte und, wo es sie gibt, der Kennung im Zeitbaum
//      und dem Ort auf der Karte.
//   4. **Wann spielt das?**  `beats` – die kleine Zeitschiene. Sie hängt an
//      den **Kapiteln**, nicht an Jahreszahlen: Die Urgeschichte liegt vor
//      jeder Datierung, und eine Zeitleiste, die „3761 v. Chr." behauptet,
//      erfindet eine Genauigkeit, die der Text nicht hergibt. Wo eine Zahl
//      vertretbar ist, steht sie als Text daneben – mit dem Wort, das dazu
//      gehört: „traditionelle Rechnung".
//   5. **Was hat das mit Jesus zu tun?**  `traces` – je ein Satz aus dem Buch
//      und der Satz im Neuen Testament, der ihn aufnimmt. **Beide wörtlich**,
//      beide aus dem Text im Haus (`public/data/text/`), und `npm run
//      check:portraits` schlägt jeden einzeln nach. Das ist der heikelste
//      Teil dieser Datei: „Christus im Alten Testament" ist ein Feld, auf dem
//      man mit etwas gutem Willen alles in allem findet. Ein Zitat, das
//      nachgeschlagen wird, ist die einzige Bremse, die hier hilft.
//   6. **Was steht nicht drin?**  `deepen` – Vertiefungswissen mit Quelle.
//
// **Die Versnummern gehen auseinander.** Luther zählt 1. Mose 32 einen Vers
// früher als die englische Zählung: Der neue Name Israel steht deutsch in
// 32,29 und englisch in 32:28. Deshalb darf ein Zitat ein zweites Kürzel für
// die englische Zählung tragen (`refEn`). Ohne das müsste man entweder ein
// falsches Kürzel anzeigen oder auf die Stelle verzichten.
//
// **Was ein Porträt nicht ist.** Keine Auslegung, die einem sagt, was er zu
// denken hat, und keine zweite Einleitung neben dem Bücherregal: Datierung,
// Verfasserfrage und Handschriften stehen dort und werden hier nur verlinkt.
// Hier steht, was im Buch passiert.
//
// Angefangen mit **1. Mose**, dazu **2. Mose**, weil ein Muster sich erst am
// zweiten Fall zeigt – und **3. Mose**, weil sich dort erst zeigt, ob die Form
// auch trägt, wo nichts passiert: ein Buch fast ohne Erzählung, ohne
// Ortswechsel und mit vier Ortsnamen in 27 Kapiteln. **4. Mose** ist die
// Gegenprobe dazu: 138 Ortsnamen in 36 Kapiteln, fast vierzig Jahre, ein Buch,
// das sich kaum stillhalten kann – und dessen Mitte trotzdem nicht in der
// Mitte liegt, sondern in Kapitel 14. Die übrigen 62 Bücher haben (noch) kein
// Porträt; die Oberfläche sagt das, statt eine leere Seite zu zeigen.

import { BOOK_BY_OSIS, type BookMeta } from './books';

export interface Bilingual {
  de: string;
  en: string;
}

/**
 * Ein wörtliches Zitat. `ref` ist die Stelle in deutscher Schreibweise und
 * Zählung, `refEn` dieselbe Stelle englisch – das ist meistens nur ein anderer
 * Buchname („Joh" / „John"), bei 1. Mose 32 aber auch eine andere Versnummer.
 * Angezeigt wird, was zur Sprache passt; `npm run check:portraits` schlägt
 * beide Fassungen in `public/data/text/` nach – deutsch gegen Luther 1912,
 * englisch gegen die World English Bible.
 */
export interface Quote {
  ref: string;
  refEn?: string;
  de: string;
  en: string;
}

/** Ein Zug des Buches – ein Feld auf der Schriftrolle. */
export interface Movement {
  id: string;
  /** Erstes und letztes Kapitel. Die Züge eines Buches liegen lückenlos. */
  from: number;
  to: number;
  title: Bilingual;
  /** Was in diesem Zug geschieht – der Satz, der beim Aufbauen erscheint. */
  text: Bilingual;
  /** Der Satz, an dem der Zug kippt. Optional: nicht jeder Zug hat einen. */
  turn?: Bilingual;
  color: string;
  /** Pfad für ein 24×24-Symbol, gezeichnet als Strich. */
  symbol: string;
  /** Orte dieses Zuges – englische Namen, wie sie in `places.json` stehen. */
  places?: string[];
}

/** Ein Muster, das über mehreren Zügen liegt – der Bogen über der Rolle. */
export interface Pattern {
  id: string;
  title: Bilingual;
  text: Bilingual;
  /** Die Züge, die es berührt – Kennungen aus `movements`. */
  movements: string[];
  /** Die Stellen, an denen es sichtbar wird. */
  refs: string[];
  color: string;
}

/** Ein Mensch im Buch. */
export interface Figure {
  id: string;
  de: string;
  en: string;
  /** Was der Name heißt – im Text selbst oft der halbe Charakter. */
  meaning: Bilingual;
  /** Wer das ist, in zwei Sätzen. */
  who: Bilingual;
  /** Der Wendepunkt: der Augenblick, an dem diese Geschichte sich entscheidet. */
  turn: Bilingual;
  ref: string;
  /** Von wo bis wo im Buch – dieselbe Kapitelachse wie die Rolle. */
  from: number;
  to: number;
  /** Kennung im Zeitbaum (`genealogy.ts`), wo es sie gibt. */
  person?: string;
  /** Ort auf der Karte – englischer Name wie in `places.json`. */
  place?: string;
}

/** Eine Marke auf der kleinen Zeitschiene. */
export interface Beat {
  id: string;
  chapter: number;
  label: Bilingual;
  /** Wann – als Text, weil eine Zahl hier mehr behaupten würde, als dasteht. */
  when: Bilingual;
  note: Bilingual;
}

/** Ein Hinweis auf Jesus: ein Satz im Buch, ein Satz im Neuen Testament. */
export interface Trace {
  id: string;
  title: Bilingual;
  seed: Quote;
  echo: Quote;
  text: Bilingual;
}

/** Vertiefungswissen – mit der Quelle, aus der es kommt. */
export interface Deepening {
  id: string;
  title: Bilingual;
  text: Bilingual;
  /** Woher das kommt. Kein „man sagt": eine Stelle, ein Text, ein Fund. */
  source: Bilingual;
}

export interface Portrait {
  osis: string;
  /** Der hebräische Name – meist das erste Wort des Buches. */
  hebrew: { word: string; translit: string; means: Bilingual };
  subtitle: Bilingual;
  /**
   * Die **Kurzfassung**, zwei bis drei Sätze, und sie steht ganz oben auf der
   * Seite – vor der Rolle, vor den Tafeln, vor allem.
   *
   * Warum sie neben `heart` steht und nicht an seiner Stelle: Die beiden
   * beantworten verschiedene Fragen. Die Kurzfassung beantwortet „worum geht
   * es hier überhaupt?" in der Zeit, die jemand hat, bevor er weiterklickt.
   * Die Kernbotschaft beantwortet „was will dieses Buch?" und darf dafür
   * ausholen. Eine Seite, die mit der ausführlichen Antwort beginnt, hat die
   * kurze nicht – und eine, die nur die kurze hat, sagt am Ende zu wenig.
   *
   * Die Prüfung achtet darauf, dass die Kurzfassung kürzer bleibt als die
   * Kernbotschaft und nicht deren erster Absatz ist: Sonst steht derselbe
   * Text zweimal auf einer Seite, und beide werden überlesen.
   */
  summary: Bilingual;
  /** Die Kernbotschaft: worum es geht, wenn man nur drei Sätze hätte. */
  heart: Bilingual;
  /** Der Vers, an dem das Buch hängt – wörtlich. */
  verse: Quote;
  facts: {
    /** Kapitel und Verse; `check:portraits` zählt beides im Text nach. */
    chapters: number;
    verses: number;
    /** Orte, die dieses Buch nennt – gezählt in `places.json`. */
    places: number;
    genre: Bilingual;
    scene: Bilingual;
    /** Das Wort, das den Takt schlägt. */
    keyword: Bilingual;
  };
  movements: Movement[];
  patterns: Pattern[];
  figures: Figure[];
  beats: Beat[];
  traces: Trace[];
  deepen: Deepening[];
  /** Fragen zum Weiterdenken – das, was nach dem Video bleibt. */
  questions: Bilingual[];
}

/* ------------------------------------------------------------------ 1. Mose */

const GENESIS: Portrait = {
  osis: 'Gen',
  hebrew: {
    word: 'בְּרֵאשִׁית',
    translit: 'Bereschit',
    means: { de: '„Im Anfang" – das erste Wort des Buches ist sein Name.', en: '"In the beginning" – the book\'s first word is its name.' },
  },
  subtitle: {
    de: 'Das Buch der Anfänge – und einer Verheißung, die alles zusammenhält',
    en: 'The book of beginnings – and of one promise that holds it all together',
  },
  summary: {
    de: 'Dreimal bekommen Menschen eine gute Welt, dreimal greifen sie nach mehr, dreimal gehen sie auseinander – Garten, Flut, Babel. Dann fängt Gott mit einem einzigen kinderlosen Paar noch einmal an und sagt zu, dass durch seine Familie alle Völker gesegnet werden. Der Rest des Buches ist eine Familiengeschichte, die daran erinnert wird – und die endet, bevor die Zusage eintrifft.',
    en: 'Three times people are given a good world, three times they grasp for more, three times they are driven apart – garden, flood, Babel. Then God begins again with one childless couple and promises that through their family all nations will be blessed. The rest of the book is a family story held to that promise – and it ends before the promise arrives.',
  },
  heart: {
    de: 'Gott macht eine gute Welt und setzt Menschen als seine Statthalter hinein. Die Menschen greifen selbst nach der Entscheidung über gut und böse – und dieselbe Bewegung wiederholt sich dreimal: im Garten, vor der Flut, am Turm von Babel. Jedes Mal endet sie in Zerstreuung. Und jedes Mal fängt Gott wieder an, zuletzt mit einem einzigen Menschen: Abraham, dem er zusagt, dass durch seine Familie „alle Geschlechter auf Erden" gesegnet werden. Von da an handelt das Buch nicht mehr von der Welt, sondern von einer Familie – und behauptet, dass das dasselbe ist.',
    en: 'God makes a good world and sets humans in it as his stewards. They grasp at deciding good and evil for themselves – and the same movement repeats three times: in the garden, before the flood, at the tower of Babel. Each time it ends in scattering. And each time God starts again, finally with a single man: Abraham, to whom he promises that through his family "all the families of the earth" will be blessed. From there the book is no longer about the world but about one family – and claims that these are the same thing.',
  },
  verse: {
    ref: 'Gen 12:3',
    de: 'Ich will segnen, die dich segnen, und verfluchen, die dich verfluchen; und in dir sollen gesegnet werden alle Geschlechter auf Erden.',
    en: 'I will bless those who bless you, and I will curse him who treates you with contempt. All the families of the earth will be blessed through you.',
  },
  facts: {
    chapters: 50,
    verses: 1533,
    places: 116,
    genre: {
      de: 'Erzählung mit Geschlechterregistern; das Buch gliedert sich selbst durch elf Überschriften „Dies ist das Geschlecht …".',
      en: 'Narrative with genealogies; the book divides itself by eleven headings, "This is the history of …".',
    },
    scene: {
      de: 'Von Mesopotamien über Kanaan nach Ägypten – der Bogen, den das ganze weitere Alte Testament zurückläuft.',
      en: 'From Mesopotamia through Canaan to Egypt – the arc the rest of the Old Testament walks back.',
    },
    keyword: {
      de: '„Segnen" – 88-mal im Buch, öfter als in jedem anderen Buch der Bibel.',
      en: '"Bless" – it runs through the whole book, more often here than in any other book of the Bible.',
    },
  },
  movements: [
    {
      id: 'schoepfung',
      from: 1,
      to: 2,
      title: { de: 'Sieben Tage, ein Garten', en: 'Seven days, a garden' },
      text: {
        de: 'Kein Kampf, keine besiegten Götter: Gott spricht, und es wird. Sechs Tage ordnen, was wüst war, und füllen, was leer war – und am siebten hört er auf. Der Mensch ist nicht der Sklave, der den Göttern die Arbeit abnimmt, sondern das Bild, das sie vertritt; der Garten ist ihm zum „Bauen und Bewahren" gegeben.',
        en: 'No battle, no defeated gods: God speaks, and it is. Six days order what was formless and fill what was empty – and on the seventh he stops. The human is not a slave doing the gods\' labour but the image that represents them; the garden is given to be "cultivated and kept".',
      },
      turn: {
        de: '„Und Gott schuf den Menschen ihm zum Bilde" – der Satz, an dem jede spätere Rede von Menschenwürde hängt.',
        en: '"God created man in his own image" – the sentence every later claim about human dignity hangs on.',
      },
      color: '#5c8a3a',
      symbol: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 3v18M3 12h18',
      places: ['Eden'],
    },
    {
      id: 'griff',
      from: 3,
      to: 4,
      title: { de: 'Der Griff nach dem Baum', en: 'The grasp at the tree' },
      text: {
        de: 'Ein Baum steht im Garten, über den der Mensch nicht verfügt: das Wissen um gut und böse. Er greift danach – und die erste Frage danach ist keine Anklage, sondern eine Suche: „Wo bist du?" Eine Generation weiter schlägt der Bruder den Bruder tot, und Lamech dichtet ein Lied auf die Rache.',
        en: 'One tree in the garden is not the human\'s to command: the knowledge of good and evil. He grasps at it – and the first question afterwards is not an accusation but a search: "Where are you?" One generation on, brother kills brother, and Lamech makes a song out of revenge.',
      },
      turn: {
        de: '„Die Sünde ruht vor der Tür, und nach dir hat sie Verlangen; du aber herrsche über sie" – gesagt zu Kain, bevor er zuschlägt.',
        en: '"Sin crouches at the door. Its desire is for you, but you are to rule over it" – said to Cain before he strikes.',
      },
      color: '#b8742e',
      symbol: 'M12 21V9M12 9c0-3 2-6 5-6M12 9C12 6 10 3 7 3M6 21h12',
      places: ['Eden'],
    },
    {
      id: 'flut',
      from: 5,
      to: 9,
      title: { de: 'Die Flut und der Bogen', en: 'The flood and the bow' },
      text: {
        de: 'Die Gewalt füllt die Erde, und das Wasser, das am zweiten Schöpfungstag geschieden wurde, kommt zurück: Die Flut ist keine Naturkatastrophe, sondern die Schöpfung rückwärts. Ein Mann, eine Arche, ein Neuanfang – und der erste Bund der Bibel gilt nicht Menschen allein, sondern „allem Fleisch". Dann pflanzt Noah einen Weinberg und liegt betrunken im Zelt: Der Neuanfang beginnt wie der alte.',
        en: 'Violence fills the earth, and the waters divided on day two come back: the flood is not a natural disaster but creation in reverse. One man, one ark, a new start – and the Bible\'s first covenant is not with humans alone but with "all flesh". Then Noah plants a vineyard and lies drunk in his tent: the new beginning begins like the old one.',
      },
      turn: {
        de: '„Ich will hinfort nicht mehr die Erde verfluchen um der Menschen willen" – die Begründung ist dieselbe wie die für die Flut: das Herz des Menschen.',
        en: '"I will not again curse the ground any more for man\'s sake" – the reason given is the same one given for the flood: the human heart.',
      },
      color: '#3a6ea8',
      symbol: 'M3 16c2-2 4-2 6 0s4 2 6 0 4-2 6 0M4 12l8-7 8 7M6 12v5h12v-5',
      places: ['Ararat'],
    },
    {
      id: 'babel',
      from: 10,
      to: 11,
      title: { de: 'Ein Turm, ein Name', en: 'One tower, one name' },
      text: {
        de: 'Siebzig Völker stehen in der Völkertafel – die ganze bekannte Welt als eine Verwandtschaft. Dann baut die Menschheit einen Turm, „dass wir uns einen Namen machen", und wird zerstreut. Das Kapitel endet mit einer Namensliste, die bei einem Mann aus Ur haltmacht.',
        en: 'Seventy nations stand in the table of nations – the whole known world as one family. Then humanity builds a tower "to make ourselves a name", and is scattered. The chapter ends with a list of names that stops at one man from Ur.',
      },
      turn: {
        de: 'Der Turm will einen Namen erzwingen; im nächsten Kapitel gibt Gott einen: „Ich will deinen Namen groß machen."',
        en: 'The tower would seize a name; in the next chapter God gives one: "I will make your name great."',
      },
      color: '#a83a3a',
      symbol: 'M7 21h10M8 21V9l4-5 4 5v12M9 12h6M9 16h6',
      places: ['Babel', 'Ur'],
    },
    {
      id: 'abraham',
      from: 12,
      to: 24,
      title: { de: 'Abraham und Sara', en: 'Abraham and Sarah' },
      text: {
        de: 'Ein kinderloses Paar bekommt eine Zusage, die es zu Lebzeiten kaum einlösen kann: Land, Nachkommen, Segen für alle Völker. Dazwischen liegen fünfundzwanzig Jahre Warten, eine Notlüge in Ägypten, Hagar und Ismael, das Feilschen um Sodom, ein Bund, bei dem Gott allein zwischen den zerteilten Tieren hindurchgeht – und am Ende der Berg Morija. Das einzige Stück Land, das die beiden je besitzen, ist ein Grab.',
        en: 'A childless couple receives a promise they can barely see fulfilled: land, descendants, blessing for all nations. In between lie twenty-five years of waiting, a lie in Egypt, Hagar and Ishmael, the haggling over Sodom, a covenant in which God alone passes between the divided animals – and at the end, Mount Moriah. The only piece of land the two ever own is a grave.',
      },
      turn: {
        de: '„Abram glaubte dem HERRN, und das rechnete er ihm zur Gerechtigkeit" – ein halber Vers, an dem Paulus später seine ganze Lehre aufhängt.',
        en: '"He believed in Yahweh, who credited it to him for righteousness" – half a verse Paul later hangs his whole doctrine on.',
      },
      color: '#c98a2b',
      symbol: 'M12 3v18M5 8l7-5 7 5M8 21v-7h8v7',
      places: ['Ur', 'Haran', 'Shechem', 'Bethel', 'Hebron', 'Mamre', 'Sodom', 'Moriah', 'Machpelah'],
    },
    {
      id: 'jakob',
      from: 25,
      to: 36,
      title: { de: 'Isaak, Jakob – und ein neuer Name', en: 'Isaac, Jacob – and a new name' },
      text: {
        de: 'Zwei Brüder, ein Linsengericht, ein erschlichener Segen und zwanzig Jahre Flucht bei einem Schwiegervater, der dieselben Tricks kann. Unterwegs eine Leiter zwischen Himmel und Erde, am Ende ein Ringkampf am Fluss, der bis zum Morgen dauert. Jakob – „Fersenhalter", Betrüger – geht hinkend aus ihm hervor und heißt von da an Israel.',
        en: 'Two brothers, a bowl of lentils, a blessing obtained by deceit, and twenty years of exile with a father-in-law who knows the same tricks. On the way, a stairway between heaven and earth; at the end, a wrestling match by a river that lasts till dawn. Jacob – "heel-grabber", deceiver – comes out limping, and from then on is called Israel.',
      },
      turn: {
        de: '„Du sollst nicht mehr Jakob heißen, sondern Israel" – der Name eines Volkes entsteht aus einem Kampf, den einer nicht gewinnt.',
        en: '"Your name will no longer be called Jacob, but Israel" – a people\'s name comes out of a fight one man does not win.',
      },
      color: '#a89321',
      symbol: 'M6 21V7l6-4 6 4v14M9 21v-5h6v5M4 11h4M16 11h4',
      places: ['Bethel', 'Paddan-aram', 'Jabbok', 'Penuel', 'Mahanaim', 'Shechem'],
    },
    {
      id: 'josef',
      from: 37,
      to: 50,
      title: { de: 'Josef: von der Grube an den Hof', en: 'Joseph: from the pit to the court' },
      text: {
        de: 'Die längste zusammenhängende Erzählung der Bibel bis dahin: ein verzogener Lieblingssohn, verkauft von seinen Brüdern, verleumdet in Potifars Haus, vergessen im Gefängnis – und dann der zweite Mann Ägyptens. Dazwischen steht, scheinbar ohne Zusammenhang, die Geschichte Judas und Tamars; sie ist der Grund, warum der Brudermörder von Kapitel 37 am Ende sein eigenes Leben für den jüngsten Bruder anbietet. Das Buch endet mit einem Sarg in Ägypten.',
        en: 'The longest continuous narrative in the Bible so far: a spoiled favourite son, sold by his brothers, slandered in Potiphar\'s house, forgotten in prison – and then the second man in Egypt. In the middle, apparently unconnected, stands the story of Judah and Tamar; it is the reason the would-be fratricide of chapter 37 ends up offering his own life for the youngest brother. The book ends with a coffin in Egypt.',
      },
      turn: {
        de: '„Ihr gedachtet\'s böse mit mir zu machen; aber Gott gedachte es gut zu machen" – der Satz, der das ganze Buch zusammenfasst.',
        en: '"You meant evil against me, but God meant it for good" – the sentence that sums up the whole book.',
      },
      color: '#9a4ba0',
      symbol: 'M4 20V9l8-5 8 5v11M9 20v-6h6v6M12 4v5',
      places: ['Dothan', 'Egypt', 'Goshen', 'Shechem'],
    },
  ],
  patterns: [
    {
      id: 'dreimal',
      title: { de: 'Dreimal dieselbe Bewegung', en: 'The same movement, three times' },
      text: {
        de: 'Segen – Griff – Zerstreuung: im Garten, vor der Flut, am Turm. Jedes Mal ist der Ausgangspunkt eine Gabe, jedes Mal greift der Mensch nach mehr, jedes Mal endet es damit, dass Menschen auseinandergehen: aus dem Garten hinaus, über die Erde hin, in siebzig Sprachen. Wer das Muster einmal sieht, liest Kapitel 12 anders: Es ist die vierte Runde – und diesmal fängt Gott mit einem Einzelnen an.',
        en: 'Blessing – grasp – scattering: in the garden, before the flood, at the tower. Each time the starting point is a gift, each time the human grasps for more, each time it ends with people driven apart: out of the garden, across the earth, into seventy languages. Once you see the pattern, chapter 12 reads differently: it is round four – and this time God starts with one person.',
      },
      movements: ['griff', 'flut', 'babel'],
      refs: ['Gen 3:23-24', 'Gen 11:8-9'],
      color: '#a83a3a',
    },
    {
      id: 'juengere',
      title: { de: 'Der Jüngere statt des Älteren', en: 'The younger instead of the elder' },
      text: {
        de: 'Abel vor Kain, Isaak vor Ismael, Jakob vor Esau, Juda und Josef vor ihren älteren Brüdern, Ephraim vor Manasse: In einer Welt, in der das Erstgeburtsrecht alles ist, wählt dieses Buch fast immer den Falschen. Es rechtfertigt das nirgends – es erzählt es nur so oft, bis man es nicht mehr übersehen kann.',
        en: 'Abel over Cain, Isaac over Ishmael, Jacob over Esau, Judah and Joseph over their older brothers, Ephraim over Manasseh: in a world where birthright is everything, this book almost always picks the wrong one. It never justifies it – it just tells it so often you cannot miss it.',
      },
      movements: ['griff', 'abraham', 'jakob', 'josef'],
      refs: ['Gen 4:4-5', 'Gen 25:23', 'Gen 48:14'],
      color: '#e0a449',
    },
    {
      id: 'segen',
      title: { de: 'Der Segen wird weitergereicht', en: 'The blessing is handed on' },
      text: {
        de: 'Derselbe Satz kommt fünfmal, an jede Generation neu: Abraham, dann Isaak, dann Jakob, zuletzt in Jakobs Segen über Juda. Er wird nie erfüllt, solange das Buch läuft – er wird nur weitergegeben. Deshalb endet 1. Mose offen: mit einem Sarg in Ägypten und einer Zusage, die noch aussteht.',
        en: 'The same sentence comes five times, renewed to each generation: Abraham, then Isaac, then Jacob, finally in Jacob\'s blessing over Judah. It is never fulfilled while the book runs – it is only passed on. That is why Genesis ends open: with a coffin in Egypt and a promise still outstanding.',
      },
      movements: ['abraham', 'jakob', 'josef'],
      refs: ['Gen 12:3', 'Gen 22:18', 'Gen 26:4', 'Gen 28:14', 'Gen 49:10'],
      color: '#7fe3d5',
    },
  ],
  figures: [
    {
      id: 'adam',
      de: 'Adam und Eva',
      en: 'Adam and Eve',
      meaning: {
        de: '„Adam" ist kein Vorname, sondern das Wort für Mensch – von „adamah", Erdboden. „Chawwa" (Eva) hängt am Wort für Leben.',
        en: '"Adam" is not a first name but the word for human – from "adamah", ground. "Chawwah" (Eve) is tied to the word for life.',
      },
      who: {
        de: 'Die ersten Menschen: als Bild Gottes in einen Garten gesetzt, mit einem Auftrag und einer einzigen Grenze.',
        en: 'The first humans: set in a garden as God\'s image, with a task and a single limit.',
      },
      turn: {
        de: 'Sie greifen nach dem, was ihnen nicht zusteht – und verstecken sich. Die Geschichte der Bibel beginnt mit einer Frage Gottes, nicht mit einem Urteil.',
        en: 'They grasp at what is not theirs – and hide. The Bible\'s story begins with a question from God, not a verdict.',
      },
      ref: 'Gen 2-3',
      from: 2,
      to: 3,
      person: 'adam',
      place: 'Eden',
    },
    {
      id: 'kain',
      de: 'Kain',
      en: 'Cain',
      meaning: { de: '„Erworben" – Eva sagt: „Ich habe einen Mann gewonnen mit dem HERRN."', en: '"Gotten" – Eve says, "I have gotten a man with Yahweh\'s help."' },
      who: {
        de: 'Der erste Sohn, der erste Bauer, der erste Mörder. Sein Opfer wird nicht angesehen, und niemand sagt im Text, warum.',
        en: 'The first son, the first farmer, the first murderer. His offering is not accepted, and the text never says why.',
      },
      turn: {
        de: 'Gott warnt ihn vorher – „du aber herrsche über sie" – und schützt ihn hinterher mit einem Zeichen. Beides steht da, und beides ist unbequem.',
        en: 'God warns him beforehand – "you are to rule over it" – and protects him afterwards with a mark. Both stand there, and both are uncomfortable.',
      },
      ref: 'Gen 4',
      from: 4,
      to: 4,
      person: 'kain',
    },
    {
      id: 'noah',
      de: 'Noah',
      en: 'Noah',
      meaning: { de: '„Trost" – sein Vater hofft, dieser Sohn werde die Mühe des verfluchten Ackers lindern.', en: '"Comfort" – his father hopes this son will ease the toil of the cursed ground.' },
      who: {
        de: 'Der Mann, der baut, während es nicht regnet. Mit ihm schließt Gott den ersten Bund – und er gilt ausdrücklich auch den Tieren.',
        en: 'The man who builds while it is not raining. With him God makes the first covenant – and it expressly includes the animals.',
      },
      turn: {
        de: 'Nach der Flut pflanzt er einen Weinberg und wird betrunken. Das Buch schont seinen Gerechten nicht: Der Neuanfang trägt denselben Menschen weiter.',
        en: 'After the flood he plants a vineyard and gets drunk. The book does not spare its righteous man: the new start carries the same human on.',
      },
      ref: 'Gen 6-9',
      from: 6,
      to: 9,
      person: 'noah',
      place: 'Ararat',
    },
    {
      id: 'abraham',
      de: 'Abraham',
      en: 'Abraham',
      meaning: { de: 'Aus „Abram" (erhabener Vater) wird „Abraham" – gedeutet als „Vater vieler Völker", bevor er ein einziges Kind hat.', en: '"Abram" (exalted father) becomes "Abraham" – read as "father of many nations", before he has a single child.' },
      who: {
        de: 'Ein Mann aus Ur, der auf ein Wort hin geht, ohne das Ziel zu kennen. Ihm gilt die Zusage, an der das ganze weitere Buch hängt.',
        en: 'A man from Ur who leaves on a word without knowing where to. To him is given the promise the rest of the book hangs on.',
      },
      turn: {
        de: 'Auf dem Berg Morija, mit dem Messer in der Hand. Der Text sagt nicht, was er dachte – nur, was er sagte: „Gott wird sich ersehen ein Schaf."',
        en: 'On Mount Moriah, knife in hand. The text never says what he thought – only what he said: "God will provide himself the lamb."',
      },
      ref: 'Gen 12-25',
      from: 12,
      to: 25,
      person: 'abraham',
      place: 'Hebron',
    },
    {
      id: 'sara',
      de: 'Sara',
      en: 'Sarah',
      meaning: { de: '„Fürstin". Aus „Sarai" wird „Sara" im selben Kapitel, in dem Abram zu Abraham wird.', en: '"Princess". "Sarai" becomes "Sarah" in the same chapter in which Abram becomes Abraham.' },
      who: {
        de: 'Die Frau, an deren Unfruchtbarkeit die Verheißung fünfundzwanzig Jahre lang hängen bleibt – und die zweimal von ihrem Mann als Schwester ausgegeben und weggegeben wird.',
        en: 'The woman on whose barrenness the promise hangs for twenty-five years – and who is twice passed off by her husband as his sister and handed over.',
      },
      turn: {
        de: 'Sie lacht, als sie die Zusage hinter der Zeltwand hört, und streitet es ab. Der Sohn heißt danach Isaak: „er lacht".',
        en: 'She laughs when she hears the promise from behind the tent, and denies it. The son is then called Isaac: "he laughs".',
      },
      ref: 'Gen 16-23',
      from: 16,
      to: 23,
      place: 'Machpelah',
    },
    {
      id: 'hagar',
      de: 'Hagar',
      en: 'Hagar',
      meaning: { de: 'Ägypterin, Sklavin Saras. Ihr Name wird im Text nicht gedeutet – der Name, den sie gibt, schon.', en: 'An Egyptian, Sarah\'s slave. Her name is not explained in the text – the name she gives is.' },
      who: {
        de: 'Die Frau, die Sara ihrem Mann gibt, und die danach zweimal in die Wüste geht: einmal freiwillig, einmal vertrieben.',
        en: 'The woman Sarah gives to her husband, and who twice goes into the desert: once by choice, once driven out.',
      },
      turn: {
        de: 'Sie ist der erste Mensch der Bibel, der Gott einen Namen gibt: „Du bist ein Gott, der mich sieht." Eine Sklavin, eine Ausländerin, eine Frau.',
        en: 'She is the first person in the Bible to give God a name: "You are a God who sees me." A slave, a foreigner, a woman.',
      },
      ref: 'Gen 16',
      from: 16,
      to: 21,
      place: 'Beersheba',
    },
    {
      id: 'isaak',
      de: 'Isaak',
      en: 'Isaac',
      meaning: { de: '„Er lacht" – nach dem Lachen seiner Eltern, das erst Unglaube war und dann Freude.', en: '"He laughs" – after his parents\' laughter, first disbelief and then joy.' },
      who: {
        de: 'Der verheißene Sohn und die leiseste der drei Erzvätergestalten: Er gräbt Brunnen nach, die andere zugeschüttet haben, und weicht dem Streit aus.',
        en: 'The promised son, and the quietest of the three patriarchs: he digs out wells others have filled in, and steps aside from the quarrel.',
      },
      turn: {
        de: 'Alt und blind segnet er den falschen Sohn – und nimmt den Segen nicht zurück, als der Betrug auffliegt.',
        en: 'Old and blind, he blesses the wrong son – and does not take the blessing back when the deceit comes out.',
      },
      ref: 'Gen 21-27',
      from: 21,
      to: 27,
      person: 'isaak',
      place: 'Gerar',
    },
    {
      id: 'rebekka',
      de: 'Rebekka',
      en: 'Rebekah',
      meaning: { de: 'Der Name wird im Text nicht gedeutet; ihre Antwort am Brunnen ist ihre Einführung.', en: 'The text does not explain her name; her answer at the well is her introduction.' },
      who: {
        de: 'Die Frau, die den Knecht Abrahams und seine zehn Kamele tränkt – und die als Einzige gefragt wird, ob sie mitgehen will. Sie sagt: „Ja, ich will mitziehen."',
        en: 'The woman who waters Abraham\'s servant and his ten camels – and the only one asked whether she will go. She says, "I will go."',
      },
      turn: {
        de: 'Sie hört den Spruch über die Zwillinge und handelt danach: Der Betrug am blinden Isaak ist ihr Plan, nicht Jakobs.',
        en: 'She hears the oracle about the twins and acts on it: the deceit of blind Isaac is her plan, not Jacob\'s.',
      },
      ref: 'Gen 24-27',
      from: 24,
      to: 27,
      place: 'Haran',
    },
    {
      id: 'jakob',
      de: 'Jakob (Israel)',
      en: 'Jacob (Israel)',
      meaning: { de: '„Fersenhalter", auch „Betrüger" – er hält bei der Geburt die Ferse des Bruders. Später: „Israel", „er kämpft mit Gott".', en: '"Heel-grabber", also "deceiver" – at birth he holds his brother\'s heel. Later: "Israel", "he strives with God".' },
      who: {
        de: 'Der unsympathischste der drei Erzväter – und der, dem das Volk seinen Namen verdankt. Er nimmt, was er kriegen kann, und wird zwanzig Jahre lang selbst genommen.',
        en: 'The least likeable of the three patriarchs – and the one the nation is named after. He takes what he can get, and is taken from for twenty years.',
      },
      turn: {
        de: 'Am Jabbok, in der Nacht vor dem Wiedersehen mit Esau. Er lässt den Fremden nicht los, bis der ihn segnet – und geht hinkend weiter.',
        en: 'At the Jabbok, the night before meeting Esau again. He will not let the stranger go until he blesses him – and walks on limping.',
      },
      ref: 'Gen 25-49',
      from: 25,
      to: 49,
      person: 'jakob',
      place: 'Penuel',
    },
    {
      id: 'esau',
      de: 'Esau',
      en: 'Esau',
      meaning: { de: '„Der Behaarte"; sein zweiter Name Edom heißt „rot" – nach dem roten Linsengericht.', en: '"Hairy"; his second name Edom means "red" – after the red lentil stew.' },
      who: {
        de: 'Der Jäger, der Ältere, der Betrogene. Aus ihm wird Edom, das Nachbarvolk, mit dem Israel jahrhundertelang im Streit liegt.',
        en: 'The hunter, the elder, the one deceived. From him comes Edom, the neighbouring people Israel quarrels with for centuries.',
      },
      turn: {
        de: 'Nicht die Rache, sondern das Gegenteil: Er läuft dem Bruder entgegen, fällt ihm um den Hals und weint. Das Buch gibt ihm diese Szene, ohne sie zu erklären.',
        en: 'Not revenge but the opposite: he runs to meet his brother, falls on his neck and weeps. The book gives him the scene without explaining it.',
      },
      ref: 'Gen 25-33',
      from: 25,
      to: 36,
      person: 'esau',
    },
    {
      id: 'juda',
      de: 'Juda',
      en: 'Judah',
      meaning: { de: '„Gelobt sei" – Lea sagt bei seiner Geburt: „Nun will ich dem HERRN danken."', en: '"Praise" – at his birth Leah says, "This time I will praise Yahweh."' },
      who: {
        de: 'Der vierte Sohn Leas, der Bruder, der vorschlägt, Josef zu verkaufen statt zu töten – und der Tamar, seiner Schwiegertochter, schweres Unrecht tut.',
        en: 'Leah\'s fourth son, the brother who proposes selling Joseph rather than killing him – and who does grave wrong to Tamar, his daughter-in-law.',
      },
      turn: {
        de: 'Vor dem ägyptischen Herrscher bietet er sich selbst als Sklaven an, damit Benjamin frei kommt. Über ihn läuft von da an die königliche Linie.',
        en: 'Before the Egyptian ruler he offers himself as a slave so Benjamin can go free. From then on the royal line runs through him.',
      },
      ref: 'Gen 38, 44',
      from: 37,
      to: 49,
      person: 'juda',
    },
    {
      id: 'josef',
      de: 'Josef',
      en: 'Joseph',
      meaning: { de: '„Er füge hinzu" – Rahel bittet bei seiner Geburt um noch einen Sohn.', en: '"May he add" – at his birth Rachel asks for one more son.' },
      who: {
        de: 'Der Lieblingssohn mit dem Sonderrock, der seine Träume erzählt, statt sie für sich zu behalten. Verkauft, verleumdet, vergessen – und dann der zweite Mann eines Weltreichs.',
        en: 'The favourite son with the special coat, who tells his dreams instead of keeping them to himself. Sold, slandered, forgotten – and then the second man of an empire.',
      },
      turn: {
        de: 'Er könnte sich rächen und tut es nicht: „Ihr gedachtet\'s böse mit mir zu machen; aber Gott gedachte es gut zu machen."',
        en: 'He could take revenge and does not: "You meant evil against me, but God meant it for good."',
      },
      ref: 'Gen 37-50',
      from: 37,
      to: 50,
      person: 'josef',
      place: 'Egypt',
    },
  ],
  beats: [
    {
      id: 'urzeit',
      chapter: 1,
      label: { de: 'Schöpfung, Garten, Flut, Babel', en: 'Creation, garden, flood, Babel' },
      when: { de: 'Vor jeder Datierung', en: 'Before any dating' },
      note: {
        de: 'Kapitel 1–11 tragen keine Jahreszahl, die man in eine Geschichtsschreibung eintragen könnte. Wer es versucht, rechnet mit den Lebensaltern von Kapitel 5 – und die verhalten sich zu Geschichte wie die mesopotamischen Königslisten, die ihren Urkönigen Zehntausende von Jahren geben.',
        en: 'Chapters 1–11 carry no date that could be entered into a historical record. Those who try reckon with the lifespans of chapter 5 – and these relate to history the way the Mesopotamian king lists do, which give their primeval kings tens of thousands of years.',
      },
    },
    {
      id: 'ruf',
      chapter: 12,
      label: { de: 'Abraham zieht aus Haran', en: 'Abraham leaves Haran' },
      when: { de: '≈ 2000 v. Chr. (traditionelle Rechnung)', en: 'c. 2000 BC (traditional reckoning)' },
      note: {
        de: 'Ab hier lässt sich das Erzählte wenigstens in eine Welt einordnen, die die Archäologie kennt: Wanderhirten zwischen Mesopotamien und Ägypten, Verträge über Brunnen, ein Grabkauf vor Zeugen.',
        en: 'From here on, what is told can at least be placed in a world archaeology knows: herders moving between Mesopotamia and Egypt, contracts over wells, a grave bought before witnesses.',
      },
    },
    {
      id: 'isaak',
      chapter: 21,
      label: { de: 'Isaak wird geboren', en: 'Isaac is born' },
      when: { de: 'Fünfundzwanzig Jahre nach der Zusage', en: 'Twenty-five years after the promise' },
      note: {
        de: 'Die Zeitrechnung des Buches ist keine Jahresrechnung, sondern eine des Wartens: Kapitel 12 verspricht, Kapitel 21 löst ein, und dazwischen liegt ein Viertel eines Lebens.',
        en: 'The book\'s reckoning of time is not a reckoning of years but of waiting: chapter 12 promises, chapter 21 delivers, and a quarter of a lifetime lies between.',
      },
    },
    {
      id: 'jakob',
      chapter: 28,
      label: { de: 'Jakob flieht nach Haran', en: 'Jacob flees to Haran' },
      when: { de: '≈ 1900 v. Chr. (traditionelle Rechnung)', en: 'c. 1900 BC (traditional reckoning)' },
      note: {
        de: 'Zwanzig Jahre bei Laban, elf Söhne und eine Tochter, zwei Frauen und zwei Mägde: Aus einer Familie wird in einem einzigen Kapitelbogen ein Volk in Umrissen.',
        en: 'Twenty years with Laban, eleven sons and a daughter, two wives and two servants: in a single arc of chapters, a family becomes the outline of a nation.',
      },
    },
    {
      id: 'josef',
      chapter: 37,
      label: { de: 'Josef wird verkauft', en: 'Joseph is sold' },
      when: { de: '≈ 1700 v. Chr. (traditionelle Rechnung)', en: 'c. 1700 BC (traditional reckoning)' },
      note: {
        de: 'Die Zeit, in der Semiten in Ägypten nicht nur geduldet, sondern einflussreich waren – die Hyksos-Periode liegt in derselben Gegend der Jahrhunderte.',
        en: 'The period in which Semites in Egypt were not merely tolerated but influential – the Hyksos era lies in the same stretch of centuries.',
      },
    },
    {
      id: 'sarg',
      chapter: 50,
      label: { de: 'Ein Sarg in Ägypten', en: 'A coffin in Egypt' },
      when: { de: 'Das Buch endet offen', en: 'The book ends open' },
      note: {
        de: 'Josef lässt sich schwören, dass sie seine Gebeine mitnehmen, wenn Gott sie heimführt. Der letzte Satz von 1. Mose ist keine Ruhe, sondern eine Wartestellung – und 2. Mose nimmt sie auf.',
        en: 'Joseph makes them swear to carry his bones out when God brings them home. The last sentence of Genesis is not rest but a holding pattern – and Exodus picks it up.',
      },
    },
  ],
  traces: [
    {
      id: 'anfang',
      title: { de: 'Dieselben drei Wörter', en: 'The same three words' },
      seed: {
        ref: 'Gen 1:1',
        de: 'Am Anfang schuf Gott Himmel und Erde.',
        en: 'In the beginning, God created the heavens and the earth.',
      },
      echo: {
        ref: 'Joh 1:1',
        refEn: 'John 1:1',
        de: 'Im Anfang war das Wort, und das Wort war bei Gott, und Gott war das Wort.',
        en: 'In the beginning was the Word, and the Word was with God, and the Word was God.',
      },
      text: {
        de: 'Johannes beginnt sein Evangelium mit dem ersten Satz der Bibel und schiebt ein Wort hinein. Das ist kein Zitat zur Verzierung: Er beansprucht damit, von derselben Schöpfung zu reden.',
        en: 'John opens his gospel with the Bible\'s first sentence and slips one word into it. This is not decorative quotation: he is claiming to speak of the same creation.',
      },
    },
    {
      id: 'same',
      title: { de: 'Der Same der Frau', en: 'The offspring of the woman' },
      seed: {
        ref: 'Gen 3:15',
        de: 'Derselbe soll dir den Kopf zertreten, und du wirst ihn in die Ferse stechen.',
        en: 'He will bruise your head, and you will bruise his heel.',
      },
      echo: {
        ref: 'Röm 16:20',
        refEn: 'Rom 16:20',
        de: 'Aber der Gott des Friedens zertrete den Satan unter eure Füße in kurzem.',
        en: 'And the God of peace will quickly crush Satan under your feet.',
      },
      text: {
        de: 'Der Satz steht mitten in einem Fluch über die Schlange und ist die erste Zusage der Bibel: Der Konflikt hat einen Ausgang. Paulus greift das Bild am Ende des Römerbriefs auf – und setzt die Gemeinde an die Stelle der Füße.',
        en: 'The sentence stands in the middle of a curse on the serpent and is the Bible\'s first promise: the conflict has an end. Paul picks up the image at the close of Romans – and puts the church where the feet are.',
      },
    },
    {
      id: 'voelker',
      title: { de: 'Segen für alle Völker', en: 'Blessing for all nations' },
      seed: {
        ref: 'Gen 12:3',
        de: 'und in dir sollen gesegnet werden alle Geschlechter auf Erden.',
        en: 'All the families of the earth will be blessed through you.',
      },
      echo: {
        ref: 'Gal 3:8',
        de: 'Die Schrift aber hat es zuvor gesehen, daß Gott die Heiden durch den Glauben gerecht macht; darum verkündigte sie dem Abraham: "In dir sollen alle Heiden gesegnet werden."',
        en: 'The Scripture, foreseeing that God would justify the Gentiles by faith, preached the Good News beforehand to Abraham, saying, "In you all the nations will be blessed."',
      },
      text: {
        de: 'Paulus nennt diesen Satz das Evangelium, das Abraham vorausgesagt wurde. Der ganze Streit der frühen Kirche – ob Heiden dazugehören – wird an einem Vers aus 1. Mose entschieden.',
        en: 'Paul calls this sentence the gospel preached in advance to Abraham. The whole quarrel of the early church – whether Gentiles belong – is settled on one verse from Genesis.',
      },
    },
    {
      id: 'melchisedek',
      title: { de: 'Ein Priester ohne Stammbaum', en: 'A priest without a genealogy' },
      seed: {
        ref: 'Gen 14:18',
        de: 'Aber Melchisedek, der König von Salem, trug Brot und Wein hervor. Und er war ein Priester Gottes des Höchsten.',
        en: 'Melchizedek king of Salem brought out bread and wine: and he was priest of God Most High.',
      },
      echo: {
        ref: 'Hebr 7:3',
        refEn: 'Heb 7:3',
        de: 'ohne Vater, ohne Mutter, ohne Geschlecht und hat weder Anfang der Tage noch Ende des Lebens: er ist aber verglichen dem Sohn Gottes und bleibt Priester in Ewigkeit.',
        en: 'without father, without mother, without genealogy, having neither beginning of days nor end of life, but made like the Son of God), remains a priest continually.',
      },
      text: {
        de: 'Drei Verse in 1. Mose 14, und sonst nichts – kein Stammbaum in einem Buch, das aus Stammbäumen besteht. Der Hebräerbrief macht aus dieser Leerstelle ein ganzes Kapitel.',
        en: 'Three verses in Genesis 14, and nothing else – no genealogy in a book made of genealogies. Hebrews turns that gap into a whole chapter.',
      },
    },
    {
      id: 'lamm',
      title: { de: 'Gott wird sich ersehen ein Schaf', en: 'God will provide the lamb' },
      seed: {
        ref: 'Gen 22:8',
        de: 'Mein Sohn, Gott wird sich ersehen ein Schaf zum Brandopfer.',
        en: 'God will provide himself the lamb for a burnt offering, my son.',
      },
      echo: {
        ref: 'Joh 1:29',
        refEn: 'John 1:29',
        de: 'Siehe, das ist Gottes Lamm, welches der Welt Sünde trägt!',
        en: 'Behold, the Lamb of God, who takes away the sin of the world!',
      },
      text: {
        de: 'Abrahams Antwort auf die Frage seines Sohnes ist im Text eine Ausrede und eine Hoffnung zugleich. Der Berg heißt danach „Der HERR sieht" – und liegt nach 2. Chronik 3,1 dort, wo später der Tempel steht.',
        en: 'Abraham\'s answer to his son\'s question is at once an evasion and a hope. The mountain is named afterwards "Yahweh will provide" – and according to 2 Chronicles 3:1 it lies where the temple would later stand.',
      },
    },
    {
      id: 'leiter',
      title: { de: 'Die Leiter zwischen Himmel und Erde', en: 'The stairway between heaven and earth' },
      seed: {
        ref: 'Gen 28:12',
        de: 'Und ihm träumte; und siehe, eine Leiter stand auf der Erde, die rührte mit der Spitze an den Himmel, und siehe, die Engel Gottes stiegen daran auf und nieder;',
        en: 'Behold, a stairway set upon the earth, and its top reached to heaven. Behold, the angels of God ascending and descending on it.',
      },
      echo: {
        ref: 'Joh 1:51',
        refEn: 'John 1:51',
        de: 'Von nun an werdet ihr den Himmel offen sehen und die Engel Gottes hinauf und herab fahren auf des Menschen Sohn.',
        en: 'hereafter you will see heaven opened, and the angels of God ascending and descending on the Son of Man.',
      },
      text: {
        de: 'Jakob träumt von einer Treppe an der Stelle, die er danach Bet-El nennt, „Haus Gottes". Jesus nimmt das Bild wörtlich auf und setzt sich selbst an die Stelle der Treppe.',
        en: 'Jacob dreams of a stairway at the place he then calls Bethel, "house of God". Jesus takes up the image word for word and puts himself where the stairway was.',
      },
    },
    {
      id: 'zepter',
      title: { de: 'Das Zepter von Juda', en: 'The scepter of Judah' },
      seed: {
        ref: 'Gen 49:10',
        de: 'Es wird das Zepter von Juda nicht entwendet werden noch der Stab des Herrschers von seinen Füßen, bis daß der Held komme; und demselben werden die Völker anhangen.',
        en: 'The scepter will not depart from Judah, nor the ruler\'s staff from between his feet, until he comes to whom it belongs. To him will the obedience of the peoples be.',
      },
      echo: {
        ref: 'Offb 5:5',
        refEn: 'Rev 5:5',
        de: 'Siehe, es hat überwunden der Löwe, der da ist vom Geschlecht Juda, die Wurzel Davids, aufzutun das Buch und zu brechen seine sieben Siegel.',
        en: 'Behold, the Lion who is of the tribe of Judah, the Root of David, has overcome; he who opens the book and its seven seals.',
      },
      text: {
        de: 'Jakob segnet den vierten Sohn, nicht den ersten – und nennt einen König, der noch kommt. Die Offenbarung greift genau diesen Titel auf, bevor sie ein geschlachtetes Lamm zeigt.',
        en: 'Jacob blesses the fourth son, not the first – and names a king still to come. Revelation takes up exactly this title, and then shows a slaughtered lamb.',
      },
    },
    {
      id: 'boese',
      title: { de: 'Böse gedacht, gut gemacht', en: 'Meant for evil, meant for good' },
      seed: {
        ref: 'Gen 50:20',
        de: 'Ihr gedachtet\'s böse mit mir zu machen; aber Gott gedachte es gut zu machen, daß er täte, wie es jetzt am Tage ist, zu erhalten viel Volks.',
        en: 'As for you, you meant evil against me, but God meant it for good, to bring to pass, as it is today, to save many people alive.',
      },
      echo: {
        ref: 'Apg 2:23',
        refEn: 'Acts 2:23',
        de: 'denselben (nachdem er aus bedachtem Rat und Vorsehung Gottes übergeben war) habt ihr genommen durch die Hände der Ungerechten und ihn angeheftet und erwürgt.',
        en: 'him, being delivered up by the determined counsel and foreknowledge of God, you have taken by the hand of lawless men, crucified and killed;',
      },
      text: {
        de: 'Petrus sagt in seiner ersten Predigt zweierlei in einem Satz: Menschen haben getan, was sie taten, und Gott hat daraus gemacht, was er wollte. Das ist dieselbe Doppelaussage wie am Ende von 1. Mose – ohne dass eine die andere entschuldigt.',
        en: 'In his first sermon Peter says two things in one sentence: people did what they did, and God made of it what he intended. It is the same double statement as at the end of Genesis – and neither excuses the other.',
      },
    },
  ],
  deepen: [
    {
      id: 'toledot',
      title: { de: 'Das Buch gliedert sich selbst', en: 'The book divides itself' },
      text: {
        de: 'Elfmal steht die Formel „Dies ist das Geschlecht …" (hebräisch toledot), und jedes Mal beginnt danach ein neuer Abschnitt. Wer dieser Gliederung folgt, braucht keine ausgedachte: Das Buch sagt selbst, wo es Absätze macht – und es macht sie nicht bei den Höhepunkten, sondern bei den Generationen.',
        en: 'Eleven times the formula "This is the history of …" (Hebrew toledot) appears, and each time a new section starts after it. Follow that division and you need no invented one: the book says itself where its paragraphs are – and it puts them not at the high points but at the generations.',
      },
      source: {
        de: '1. Mose 2,4 · 5,1 · 6,9 · 10,1 · 11,10 · 11,27 · 25,12 · 25,19 · 36,1 · 36,9 · 37,2',
        en: 'Genesis 2:4 · 5:1 · 6:9 · 10:1 · 11:10 · 11:27 · 25:12 · 25:19 · 36:1 · 36:9 · 37:2',
      },
    },
    {
      id: 'nachbarn',
      title: { de: 'Die Nachbartexte – und der Unterschied', en: 'The neighbouring texts – and the difference' },
      text: {
        de: 'Schöpfung und Flut erzählt die Umwelt auch: Im Atrahasis-Epos schafft man Menschen, weil die niederen Götter die Arbeit satthaben, und schickt die Flut, weil die Menschen zu laut sind. Im Gilgamesch-Epos überlebt Utnapischtim in einem Kasten, schickt Vögel aus und opfert danach. Die Übereinstimmungen sind so genau, dass Zufall ausscheidet – und die Unterschiede liegen genau dort, wo es zählt: kein Götterkrieg, kein Lärm als Grund, und der Mensch ist kein Ersatzarbeiter, sondern Bild Gottes.',
        en: 'The surrounding world tells creation and flood too: in the Atrahasis epic humans are made because the lesser gods tire of the work, and the flood comes because humans are too noisy. In the Gilgamesh epic Utnapishtim survives in a box, sends out birds and sacrifices afterwards. The agreements are too exact for coincidence – and the differences lie exactly where it matters: no war among gods, no noise as the reason, and the human is no substitute labourer but the image of God.',
      },
      source: {
        de: 'Atrahasis-Epos (altbabylonisch, ~1700 v. Chr.) · Gilgamesch-Epos, Tafel XI · Enūma eliš',
        en: 'Atrahasis epic (Old Babylonian, c. 1700 BC) · Gilgamesh epic, tablet XI · Enūma eliš',
      },
    },
    {
      id: 'siebentage',
      title: { de: 'Sieben Tage, gebaut wie ein Haus', en: 'Seven days, built like a house' },
      text: {
        de: 'Die sechs Tage stehen in zwei Reihen zu dritt: Tag 1–3 trennen und richten Räume ein (Licht/Finsternis, Wasser/Himmel, Land), Tag 4–6 füllen dieselben Räume in derselben Reihenfolge (Lichter, Vögel und Fische, Tiere und Menschen). Was am Anfang „wüst und leer" heißt, wird erst nicht mehr wüst und dann nicht mehr leer. Der siebte Tag hat als einziger keinen Abend – die Ruhe ist nicht das Ende der Arbeit, sondern ihr Ziel.',
        en: 'The six days stand in two rows of three: days 1–3 separate and furnish spaces (light/dark, waters/sky, land), days 4–6 fill the same spaces in the same order (lights, birds and fish, animals and humans). What is called "formless and empty" at the start first ceases to be formless and then ceases to be empty. The seventh day alone has no evening – rest is not the end of the work but its goal.',
      },
      source: {
        de: '1. Mose 1,2 („wüst und leer") gegen 1,3-31; der fehlende Abend in 2,1-3.',
        en: 'Genesis 1:2 ("formless and empty") against 1:3-31; the missing evening in 2:1-3.',
      },
    },
    {
      id: 'bund',
      title: { de: 'Ein Bund, bei dem nur einer durchgeht', en: 'A covenant only one party walks through' },
      text: {
        de: 'In 1. Mose 15 zerteilt Abram Tiere und legt die Hälften einander gegenüber. Das ist die übliche Form eines Vertrags im Alten Orient: Die Partner gehen zwischen den Stücken hindurch und sagen damit, was mit ihnen geschehen soll, wenn sie brechen. Hier geht nur einer hindurch – ein rauchender Ofen und eine Feuerfackel, während Abram schläft. Der Bund hängt damit an einer einzigen Seite.',
        en: 'In Genesis 15 Abram cuts animals in two and lays the halves facing each other. That is the usual form of a treaty in the ancient Near East: the partners walk between the pieces, declaring what should happen to them if they break it. Here only one party walks through – a smoking oven and a flaming torch, while Abram sleeps. The covenant thus rests on one side alone.',
      },
      source: {
        de: '1. Mose 15,9-18; dieselbe Vertragsform in Jeremia 34,18-19.',
        en: 'Genesis 15:9-18; the same treaty form in Jeremiah 34:18-19.',
      },
    },
    {
      id: 'namen',
      title: { de: 'Namen sind hier Handlung', en: 'Names here are plot' },
      text: {
        de: 'Fast jeder Name des Buches wird im Text gedeutet, und die Deutung treibt die Geschichte: Isaak heißt „er lacht", weil seine Eltern über die Zusage gelacht haben; Jakob heißt „Fersenhalter" und verhält sich so; aus Abram wird Abraham, aus Sarai Sara, aus Jakob Israel – ein neuer Name ist in diesem Buch ein neues Leben. Wer die Namen überliest, verliert die Hälfte.',
        en: 'Almost every name in the book is explained in the text, and the explanation drives the story: Isaac means "he laughs", because his parents laughed at the promise; Jacob means "heel-grabber", and he behaves like one; Abram becomes Abraham, Sarai becomes Sarah, Jacob becomes Israel – in this book a new name is a new life. Skip the names and you lose half of it.',
      },
      source: {
        de: '1. Mose 17,5 · 17,15 · 21,6 · 25,26 · 32,29 (englische Zählung 32,28).',
        en: 'Genesis 17:5 · 17:15 · 21:6 · 25:26 · 32:28 (German numbering 32:29).',
      },
    },
    {
      id: 'machpela',
      title: { de: 'Der einzige Landbesitz', en: 'The only piece of land' },
      text: {
        de: 'Abraham bekommt das Land zugesagt – und kauft davon zu Lebzeiten genau ein Grundstück: die Höhle Machpela bei Hebron, als Grab für Sara. Der Kauf wird mit einer Ausführlichkeit erzählt, die sonst nur Verträge haben: Zeugen, Preis, die Bäume im Feld eingeschlossen. Es ist das einzige Stück Erde, das ihm rechtlich gehört, und es ist ein Grab.',
        en: 'Abraham is promised the land – and in his lifetime buys exactly one plot of it: the cave of Machpelah near Hebron, as a grave for Sarah. The purchase is told with a thoroughness otherwise reserved for contracts: witnesses, price, the trees in the field included. It is the only piece of earth legally his, and it is a grave.',
      },
      source: {
        de: '1. Mose 23,3-20; dort werden später auch Abraham, Isaak, Rebekka, Lea und Jakob begraben (49,29-32).',
        en: 'Genesis 23:3-20; Abraham, Isaac, Rebekah, Leah and Jacob are later buried there too (49:29-32).',
      },
    },
  ],
  questions: [
    {
      de: 'Das Buch erzählt dreimal dieselbe Bewegung, bevor es mit Abraham neu anfängt. Warum erzählt es sie dreimal und nicht einmal?',
      en: 'The book tells the same movement three times before starting over with Abraham. Why three times and not once?',
    },
    {
      de: 'Die Zusage an Abraham gilt „allen Geschlechtern auf Erden" – und das Buch handelt danach von einer einzigen Familie. Ist das ein Widerspruch?',
      en: 'The promise to Abraham is for "all the families of the earth" – and the book then follows one single family. Is that a contradiction?',
    },
    {
      de: '1. Mose schont keine seiner Hauptfiguren. Was gewinnt ein Text, der seine Helden so zeigt?',
      en: 'Genesis spares none of its main characters. What does a text gain by showing its heroes like that?',
    },
  ],
};

/* ------------------------------------------------------------------ 2. Mose */

const EXODUS: Portrait = {
  osis: 'Exod',
  hebrew: {
    word: 'שְׁמוֹת',
    translit: 'Schemot',
    means: { de: '„Namen" – nach dem ersten Satz: „Dies sind die Namen der Kinder Israel."', en: '"Names" – after the opening line: "These are the names of the sons of Israel."' },
  },
  subtitle: {
    de: 'Ein Volk wird befreit – und Gott zieht bei ihm ein',
    en: 'A people is set free – and God moves in with them',
  },
  summary: {
    de: 'Aus der Familie vom Ende des ersten Buches ist ein versklavtes Volk geworden. Gott hört das Schreien, nennt einem Flüchtling seinen Namen und führt heraus – gegen eine Macht, die sich selbst für göttlich hält. Am Sinai bekommt der befreite Haufen einen Bund, bricht ihn nach sechs Wochen, und das Buch geht trotzdem weiter: Es endet nicht mit einem Gesetz, sondern mit einem Zelt mitten im Lager.',
    en: 'The family from the end of the first book has become an enslaved nation. God hears the cry, tells a fugitive his name and brings them out – against a power that takes itself for divine. At Sinai the freed crowd is given a covenant, breaks it within six weeks, and the book carries on anyway: it ends not with a law but with a tent in the middle of the camp.',
  },
  heart: {
    de: 'Aus der Familie am Ende von 1. Mose ist ein Volk geworden, und das Volk ist versklavt. Gott hört das Schreien, nennt seinen Namen und führt heraus – nicht durch einen Aufstand, sondern gegen die Macht, die sich für göttlich hält. Am Sinai wird aus dem befreiten Haufen ein Volk mit einem Bund; und kaum ist der geschlossen, gießen sie ein Kalb. Das Buch endet trotzdem damit, dass Gott einzieht: Der letzte Satz handelt nicht von Gesetz, sondern von Wohnen.',
    en: 'The family at the end of Genesis has become a people, and the people are enslaved. God hears the cry, names his name and brings them out – not by revolt but against a power that takes itself for divine. At Sinai the freed crowd becomes a people with a covenant; and no sooner is it made than they cast a calf. The book still ends with God moving in: its last sentence is not about law but about dwelling.',
  },
  verse: {
    ref: 'Ex 25:8',
    refEn: 'Exod 25:8',
    de: 'Und sie sollen mir ein Heiligtum machen, daß ich unter ihnen wohne.',
    en: 'Let them make me a sanctuary, that I may dwell among them.',
  },
  facts: {
    chapters: 40,
    verses: 1213,
    places: 31,
    genre: {
      de: 'Erzählung, Rechtstexte und ein Bauplan – drei Textsorten in einem Buch, und der Bauplan nimmt ein Drittel ein.',
      en: 'Narrative, legal texts and a building plan – three kinds of text in one book, and the plan takes up a third of it.',
    },
    scene: {
      de: 'Ägypten, das Schilfmeer, die Wüste Sinai. Das Buch bewegt sich vom Frondienst zum Berg und bleibt dort stehen.',
      en: 'Egypt, the sea, the Sinai wilderness. The book moves from forced labour to the mountain and stops there.',
    },
    keyword: {
      de: '„Herausführen" – und dahinter, immer wieder: „damit ihr erkennt, dass ich der HERR bin".',
      en: '"Bring out" – and behind it, again and again: "that you may know that I am Yahweh".',
    },
  },
  movements: [
    {
      id: 'sklaverei',
      from: 1,
      to: 2,
      title: { de: 'Ein neuer König, der Josef nicht kannte', en: 'A new king who did not know Joseph' },
      text: {
        de: 'Siebzig Menschen sind ein Volk geworden, und das macht dem Pharao Angst. Erst Fronarbeit, dann der Befehl, die Söhne zu töten. Die ersten, die widerstehen, sind zwei Hebammen, die den Befehl unterlaufen – die Bibel nennt ihre Namen, den des Pharao nicht.',
        en: 'Seventy people have become a nation, and it frightens Pharaoh. First forced labour, then the order to kill the sons. The first to resist are two midwives who quietly defy it – the Bible gives their names, not Pharaoh\'s.',
      },
      turn: {
        de: '„Gott erhörte ihr Wehklagen und gedachte an seinen Bund mit Abraham, Isaak und Jakob" – das Buch hängt an der Zusage des vorigen.',
        en: '"God heard their groaning, and God remembered his covenant with Abraham, with Isaac, and with Jacob" – the book hangs on the promise of the last one.',
      },
      color: '#a83a3a',
      symbol: 'M4 21h16M6 21V8h12v13M9 12h6M9 16h6',
      places: ['Egypt', 'Goshen'],
    },
    {
      id: 'busch',
      from: 3,
      to: 6,
      title: { de: 'Der brennende Busch und der Name', en: 'The burning bush and the name' },
      text: {
        de: 'Ein Flüchtling hütet fremde Schafe, als ein Busch brennt, ohne zu verbrennen. Mose bekommt einen Auftrag und antwortet fünfmal mit einem Einwand. Auf die Frage nach dem Namen kommt eine Antwort, die keine Verfügung zulässt: „Ich werde sein, der ich sein werde."',
        en: 'A fugitive is herding someone else\'s sheep when a bush burns without burning up. Moses is given a commission and answers with five objections. To the question about the name comes an answer that grants no leverage: "I AM WHO I AM."',
      },
      turn: {
        de: '„Zieh deine Schuhe aus von deinen Füßen; denn der Ort, darauf du stehst, ist ein heilig Land."',
        en: '"Take off your sandals, for the place you are standing on is holy ground."',
      },
      color: '#c98a2b',
      symbol: 'M12 21V12M12 12c-3 0-5-2-5-5 3 0 5 2 5 5zm0 0c3 0 5-2 5-5-3 0-5 2-5 5zM8 21h8',
      places: ['Midian', 'Egypt'],
    },
    {
      id: 'plagen',
      from: 7,
      to: 12,
      title: { de: 'Zehn Plagen und ein Lamm', en: 'Ten plagues and a lamb' },
      text: {
        de: 'Die Plagen treffen der Reihe nach, was Ägypten für göttlich hält: den Nil, das Licht, die Ernte, zuletzt den Sohn des Pharao. Es ist kein Naturschauspiel, sondern ein Rechtsstreit über die Frage, wem die Welt gehört. Gerettet wird nicht, wer stark ist, sondern wessen Tür ein Zeichen trägt.',
        en: 'The plagues strike, one after another, what Egypt holds divine: the Nile, the light, the harvest, at last Pharaoh\'s son. This is no spectacle of nature but a lawsuit over who owns the world. What saves is not strength but a mark on the door.',
      },
      turn: {
        de: '„Wenn ich das Blut sehe, gehe ich an euch vorüber" – das Passa wird zum Datum, an dem sich ein Volk jedes Jahr neu erzählt, wer es ist.',
        en: '"When I see the blood, I will pass over you" – Passover becomes the date on which a people tells itself each year who it is.',
      },
      color: '#b8742e',
      symbol: 'M12 3l8 5v8l-8 5-8-5V8zM12 8v8M8 10v4M16 10v4',
      places: ['Egypt'],
    },
    {
      id: 'meer',
      from: 13,
      to: 15,
      title: { de: 'Das Meer und das Lied', en: 'The sea and the song' },
      text: {
        de: 'Zwischen dem Wasser und dem Heer des Pharao gibt es keinen Ausweg, und genau das ist die Lage, in der das Volk zum ersten Mal nichts tun muss. Danach singen sie – das Lied am Schilfmeer gilt sprachlich als eines der ältesten Stücke der hebräischen Bibel, älter als der Text, der es umgibt.',
        en: 'Between the water and Pharaoh\'s army there is no way out, and that is exactly the situation in which the people first have nothing to do. Afterwards they sing – the Song at the Sea is linguistically reckoned among the oldest pieces of the Hebrew Bible, older than the text around it.',
      },
      turn: {
        de: '„Der HERR wird für euch streiten, und ihr werdet still sein."',
        en: '"Yahweh will fight for you, and you shall be still."',
      },
      color: '#3a6ea8',
      symbol: 'M3 17c2-2 4-2 6 0s4 2 6 0 4-2 6 0M3 12c2-2 4-2 6 0s4 2 6 0 4-2 6 0M12 3v6',
      places: ['Succoth', 'Egypt'],
    },
    {
      id: 'wueste',
      from: 16,
      to: 18,
      title: { de: 'Wüste: Brot, Wasser, ein Rat', en: 'Wilderness: bread, water, advice' },
      text: {
        de: 'Drei Tage nach dem Lied wird gemurrt. Das Buch nimmt das ernst statt es zu tadeln: Es gibt Brot vom Himmel, das man nicht horten kann, Wasser aus einem Felsen – und einen midianitischen Schwiegervater, der sagt, dass Mose sich übernimmt, und ihm eine Gerichtsordnung vorschlägt.',
        en: 'Three days after the song, the grumbling starts. The book takes it seriously rather than scolding it: bread from heaven that cannot be hoarded, water from a rock – and a Midianite father-in-law who says Moses is overreaching and proposes a judicial order.',
      },
      turn: {
        de: '„Man hu?" – „Was ist das?" Der Name des Himmelsbrots ist eine Frage.',
        en: '"What is it?" The name of the bread from heaven is a question.',
      },
      color: '#a89321',
      symbol: 'M3 20h18M7 20V9M17 20V9M5 9h14l-7-6z',
      places: ['Rephidim', 'Mount Sinai'],
    },
    {
      id: 'sinai',
      from: 19,
      to: 24,
      title: { de: 'Sinai: der Bund', en: 'Sinai: the covenant' },
      text: {
        de: 'Am Berg wird aus dem befreiten Haufen ein Volk mit Verfassung. Die Zehn Worte beginnen nicht mit einem Gebot, sondern mit einer Geschichte: „Ich bin der HERR, dein Gott, der ich dich aus Ägyptenland geführt habe." Erst die Befreiung, dann das Gesetz – nicht umgekehrt. Danach folgen drei Kapitel Fallrecht, sehr irdisch: Ochsen, Brunnen, Bürgschaften.',
        en: 'At the mountain the freed crowd becomes a people with a constitution. The Ten Words do not begin with a command but with a story: "I am Yahweh your God, who brought you out of the land of Egypt." Rescue first, then law – not the other way round. Then come three chapters of case law, very earthly: oxen, wells, pledges.',
      },
      turn: {
        de: '„Ihr sollt mir ein priesterlich Königreich und ein heiliges Volk sein" – ein ganzes Volk in der Rolle, die anderswo eine Kaste hat.',
        en: '"You shall be to me a kingdom of priests, and a holy nation" – a whole people in the role a caste holds elsewhere.',
      },
      color: '#2f8f7f',
      symbol: 'M3 20h18L12 4zM9 20v-5h6v5M12 8v4',
      places: ['Mount Sinai'],
    },
    {
      id: 'bauplan',
      from: 25,
      to: 31,
      title: { de: 'Der Bauplan der Wohnung', en: 'The plan for the dwelling' },
      text: {
        de: 'Sieben Kapitel Maße, Stoffe und Farben – für viele die Stelle, an der sie das Buch weglegen. Die Antwort darauf steht im ersten Satz des Abschnitts: Es geht nicht um Möbel, sondern darum, dass Gott bei diesem Volk einzieht. Die Anweisungen kommen in sieben Reden, die letzte handelt vom Sabbat; die Wohnung wird gebaut wie die Welt geschaffen wurde.',
        en: 'Seven chapters of measurements, fabrics and colours – for many, the place where they put the book down. The answer stands in the section\'s first sentence: this is not about furniture but about God moving in with this people. The instructions come in seven speeches, the last of them about the Sabbath; the dwelling is built the way the world was made.',
      },
      turn: {
        de: '„Und sie sollen mir ein Heiligtum machen, daß ich unter ihnen wohne."',
        en: '"Let them make me a sanctuary, that I may dwell among them."',
      },
      color: '#e0a449',
      symbol: 'M4 20V9h16v11M4 9l8-5 8 5M10 20v-6h4v6',
      places: ['Mount Sinai'],
    },
    {
      id: 'kalb',
      from: 32,
      to: 34,
      title: { de: 'Das Kalb – und ein zweites Mal', en: 'The calf – and a second time' },
      text: {
        de: 'Während Mose oben die Anweisungen bekommt, gießen sie unten ein Kalb. Er zerschlägt die Tafeln, tritt dann zwischen Gott und das Volk und bietet an, selbst ausgelöscht zu werden. Was danach kommt, ist keine Strafpredigt, sondern eine Selbstvorstellung Gottes – und zwei neue Tafeln.',
        en: 'While Moses receives the instructions above, they cast a calf below. He smashes the tablets, then steps between God and the people and offers to be blotted out himself. What follows is not a rebuke but God\'s self-description – and two new tablets.',
      },
      turn: {
        de: '„HERR, HERR, GOTT, barmherzig und gnädig und geduldig und von großer Gnade und Treue!" – der Satz, den das Alte Testament danach am häufigsten zitiert.',
        en: '"Yahweh! Yahweh, a merciful and gracious God, slow to anger, and abundant in loving kindness and truth" – the sentence the Old Testament quotes more than any other.',
      },
      color: '#9a4ba0',
      symbol: 'M5 20V7h6v13M13 20V7h6v13M3 20h18M7 11h2M15 11h2',
      places: ['Mount Sinai'],
    },
    {
      id: 'einzug',
      from: 35,
      to: 40,
      title: { de: 'Gebaut – und die Wolke zieht ein', en: 'Built – and the cloud moves in' },
      text: {
        de: 'Dieselben sieben Kapitel noch einmal, jetzt als Bericht: Es wurde gemacht, wie befohlen. Das Volk bringt so viel, dass man es zurückweisen muss. Und am Ende geschieht das, worauf das ganze Buch zuläuft – nicht ein Sieg, sondern ein Einzug.',
        en: 'The same seven chapters again, now as a report: it was done as commanded. The people bring so much that the offering has to be stopped. And at the end comes the thing the whole book has been moving towards – not a victory but a moving-in.',
      },
      turn: {
        de: '„Da bedeckte die Wolke die Hütte des Stifts, und die Herrlichkeit des HERRN füllte die Wohnung."',
        en: '"Then the cloud covered the Tent of Meeting, and Yahweh\'s glory filled the tabernacle."',
      },
      color: '#5c8a3a',
      symbol: 'M4 19h16M6 19v-8h12v8M9 19v-4h6v4M8 11l4-4 4 4',
      places: ['Mount Sinai'],
    },
  ],
  patterns: [
    {
      id: 'schreien',
      title: { de: 'Schreien und Gedenken', en: 'Crying out and remembering' },
      text: {
        de: 'Das Volk schreit, Gott hört und „gedenkt seines Bundes" – der Takt des ganzen Buches. Wichtig ist, was im Text nicht steht: Das Schreien ist kein Gebet, niemand bittet ordentlich. Es ist der Laut von Menschen am Ende ihrer Kräfte, und der genügt.',
        en: 'The people cry out, God hears and "remembers his covenant" – the beat of the whole book. What matters is what the text does not say: the cry is no prayer, nobody asks properly. It is the sound of people at the end of their strength, and it is enough.',
      },
      movements: ['sklaverei', 'busch', 'wueste'],
      refs: ['Ex 2:23-25', 'Ex 3:7', 'Ex 6:5'],
      color: '#a83a3a',
    },
    {
      id: 'wohnen',
      title: { de: 'Gott kommt näher', en: 'God comes closer' },
      text: {
        de: 'Dreimal wird ein Ort heilig, und jedes Mal ist er näher: ein Busch in der Wüste, zu dem einer hingeht; ein Berg, an dessen Fuß das Volk steht; ein Zelt, das mitten im Lager aufgeschlagen wird. Das Buch erzählt keine Flucht, sondern einen Umzug.',
        en: 'Three times a place becomes holy, and each time it is nearer: a bush in the desert one man walks to; a mountain the people stand at the foot of; a tent pitched in the middle of the camp. The book tells not an escape but a move.',
      },
      movements: ['busch', 'sinai', 'einzug'],
      refs: ['Ex 3:5', 'Ex 19:17', 'Ex 40:34'],
      color: '#7fe3d5',
    },
    {
      id: 'bild',
      title: { de: 'Zwei Arten, sich Gott zu machen', en: 'Two ways of making a god' },
      text: {
        de: 'Kapitel 25–31 sagt, wie Gott bei Menschen wohnen will; Kapitel 32 zeigt, wie Menschen sich einen Gott machen. Beide Male wird Gold gesammelt, beide Male entsteht etwas Sichtbares – der Unterschied ist, wer anfängt. Das Buch stellt die beiden Kapitelfolgen absichtlich nebeneinander.',
        en: 'Chapters 25–31 say how God will dwell among people; chapter 32 shows how people make themselves a god. Both times gold is collected, both times something visible results – the difference is who starts. The book sets the two sequences side by side on purpose.',
      },
      movements: ['bauplan', 'kalb', 'einzug'],
      refs: ['Ex 25:1-9', 'Ex 32:2-4', 'Ex 35:20-29'],
      color: '#e0a449',
    },
  ],
  figures: [
    {
      id: 'mose',
      de: 'Mose',
      en: 'Moses',
      meaning: { de: 'Die Tochter des Pharao deutet den Namen: „Ich habe ihn aus dem Wasser gezogen."', en: 'Pharaoh\'s daughter explains the name: "I drew him out of the water."' },
      who: {
        de: 'Am Hof aufgewachsen, als Totschläger geflohen, vierzig Jahre Hirte in Midian – und dann derjenige, der vor den Pharao treten soll. Er will nicht.',
        en: 'Raised at court, fled as a killer, forty years a shepherd in Midian – and then the one who is to stand before Pharaoh. He does not want to.',
      },
      turn: {
        de: 'Nach dem goldenen Kalb bietet er an, an Stelle des Volkes ausgelöscht zu werden. Von da an ist er nicht mehr nur Bote, sondern Fürsprecher.',
        en: 'After the golden calf he offers to be blotted out in the people\'s place. From then on he is not only a messenger but an intercessor.',
      },
      ref: 'Ex 2-40',
      from: 2,
      to: 40,
      person: 'mose',
      place: 'Mount Sinai',
    },
    {
      id: 'hebammen',
      de: 'Schifra und Pua',
      en: 'Shiphrah and Puah',
      meaning: { de: '„Schönheit" und „Glanz" – zwei Namen, die das Buch aufbewahrt, während es den des Pharao verschweigt.', en: '"Beauty" and "splendour" – two names the book preserves, while withholding Pharaoh\'s.' },
      who: {
        de: 'Zwei Hebammen, denen der mächtigste Mann der damaligen Welt befiehlt, Neugeborene zu töten.',
        en: 'Two midwives ordered by the most powerful man of that world to kill newborns.',
      },
      turn: {
        de: 'Sie tun es nicht und geben eine durchsichtige Ausrede zu Protokoll. Das erste Widerstehen der Bibel gegen einen Staat ist zivil, weiblich und erfolgreich.',
        en: 'They do not, and give a transparent excuse for the record. The Bible\'s first resistance to a state is civil, female and successful.',
      },
      ref: 'Ex 1:15-21',
      from: 1,
      to: 1,
      place: 'Egypt',
    },
    {
      id: 'aaron',
      de: 'Aaron',
      en: 'Aaron',
      meaning: { de: 'Der Name wird im Text nicht gedeutet – ungewöhnlich für ein Buch, das sonst jeden Namen erklärt.', en: 'The text does not explain the name – unusual in a book that otherwise explains every name.' },
      who: {
        de: 'Der ältere Bruder, der reden kann, wo Mose stockt. Erster Hoherpriester und zugleich der Mann, der das Kalb gießt.',
        en: 'The elder brother, who can speak where Moses falters. First high priest, and at the same time the man who casts the calf.',
      },
      turn: {
        de: 'Seine Ausrede nach dem Kalb – „da kam dieses Kalb heraus" – steht so im Text. Das Buch macht ihn trotzdem zum Priester.',
        en: 'His excuse after the calf – "out came this calf" – stands there in the text. The book makes him priest all the same.',
      },
      ref: 'Ex 4, 32',
      from: 4,
      to: 40,
      person: 'aaron',
    },
    {
      id: 'mirjam',
      de: 'Mirjam',
      en: 'Miriam',
      meaning: { de: 'Derselbe Name wie später „Maria"; seine Bedeutung ist umstritten und wird im Text nicht gegeben.', en: 'The same name as later "Mary"; its meaning is disputed and the text does not give it.' },
      who: {
        de: 'Die Schwester, die am Nil steht und zusieht, was aus dem Kästchen wird – und die der Tochter des Pharao die eigene Mutter als Amme vermittelt.',
        en: 'The sister who stands by the Nile watching what becomes of the basket – and who arranges for Pharaoh\'s daughter to hire the child\'s own mother as nurse.',
      },
      turn: {
        de: 'Nach dem Meer nimmt sie die Pauke und führt den Gesang an. Sie heißt dort „die Prophetin" – der erste Mensch der Bibel, der so genannt wird, nach Abraham.',
        en: 'After the sea she takes the tambourine and leads the singing. She is called "the prophetess" there – the first person in the Bible so named after Abraham.',
      },
      ref: 'Ex 2, 15:20-21',
      from: 2,
      to: 15,
    },
    {
      id: 'pharao',
      de: 'Der Pharao',
      en: 'Pharaoh',
      meaning: { de: '„Pharao" ist kein Name, sondern ein Titel – „großes Haus". Das Buch nennt keinen Namen.', en: '"Pharaoh" is not a name but a title – "great house". The book gives no name.' },
      who: {
        de: 'Der Gegenspieler, der in der ägyptischen Ordnung selbst göttlich ist. Genau darum geht der Streit: „Wer ist der HERR, dass ich ihm gehorchen müsste?"',
        en: 'The antagonist, who in Egypt\'s order is himself divine. That is exactly what the quarrel is about: "Who is Yahweh, that I should listen to him?"',
      },
      turn: {
        de: 'Sein Herz verhärtet sich – und der Text sagt es in beide Richtungen: mal verhärtet er es selbst, mal verhärtet Gott es. Beides steht da, und das Buch löst es nicht auf.',
        en: 'His heart hardens – and the text says it both ways: sometimes he hardens it himself, sometimes God hardens it. Both stand there, and the book does not resolve it.',
      },
      ref: 'Ex 5-14',
      from: 5,
      to: 14,
      place: 'Egypt',
    },
    {
      id: 'jitro',
      de: 'Jitro',
      en: 'Jethro',
      meaning: { de: 'Priester von Midian, Schwiegervater Moses – ein Außenstehender, kein Israelit.', en: 'Priest of Midian, Moses\' father-in-law – an outsider, not an Israelite.' },
      who: {
        de: 'Der Mann, bei dem Mose vierzig Jahre Schafe hütet, und der nach dem Auszug ins Lager kommt, um zu hören, was geschehen ist.',
        en: 'The man Moses herds sheep for over forty years, and who comes to the camp after the exodus to hear what happened.',
      },
      turn: {
        de: 'Er sieht Mose von morgens bis abends Recht sprechen und sagt: „Das ist nicht gut." Die Gerichtsordnung Israels geht auf den Rat eines Midianiters zurück.',
        en: 'He watches Moses judging from morning to night and says, "What you are doing is not good." Israel\'s judicial order goes back to a Midianite\'s advice.',
      },
      ref: 'Ex 18',
      from: 18,
      to: 18,
      place: 'Midian',
    },
    {
      id: 'bezalel',
      de: 'Bezalel',
      en: 'Bezalel',
      meaning: { de: '„Im Schatten Gottes".', en: '"In God\'s shadow".' },
      who: {
        de: 'Der Handwerker, der die Wohnung baut. Er ist der erste Mensch der Bibel, von dem gesagt wird, er sei „mit dem Geist Gottes erfüllt".',
        en: 'The craftsman who builds the dwelling. He is the first person in the Bible said to be "filled with the Spirit of God".',
      },
      turn: {
        de: 'Nicht für eine Prophetie, nicht für einen Sieg – für Gold-, Holz- und Steinarbeit. Das Buch hält Handwerk für eine Gabe.',
        en: 'Not for a prophecy, not for a victory – for work in gold, wood and stone. The book counts craftsmanship as a gift.',
      },
      ref: 'Ex 31:1-11',
      from: 31,
      to: 38,
    },
  ],
  beats: [
    {
      id: 'sklaverei',
      chapter: 1,
      label: { de: 'Vierhundert Jahre Ägypten', en: 'Four hundred years in Egypt' },
      when: { de: 'Zwischen 1. Mose 50 und 2. Mose 1', en: 'Between Genesis 50 and Exodus 1' },
      note: {
        de: 'Die längste Lücke der biblischen Erzählung liegt zwischen zwei Buchdeckeln: Ein Kapitel endet mit einem Sarg, das nächste beginnt mit einem Volk unter Frondienst.',
        en: 'The longest gap in the biblical narrative lies between two covers: one chapter ends with a coffin, the next begins with a people in forced labour.',
      },
    },
    {
      id: 'auszug',
      chapter: 12,
      label: { de: 'Der Auszug', en: 'The exodus' },
      when: { de: '≈ 1446 v. Chr. (frühe Datierung) oder ≈ 1270 v. Chr. (späte)', en: 'c. 1446 BC (early dating) or c. 1270 BC (late)' },
      note: {
        de: 'Zwei Rechnungen stehen sich gegenüber: die frühe folgt den 480 Jahren aus 1. Könige 6,1, die späte den Vorratsstädten Pitom und Ramses aus 2. Mose 1,11, die unter den Ramessiden gebaut wurden. Einen ägyptischen Bericht über den Auszug gibt es nicht – das wäre die Nachricht einer Niederlage.',
        en: 'Two reckonings stand opposed: the early one follows the 480 years of 1 Kings 6:1, the late one the store cities Pithom and Rameses of Exodus 1:11, built under the Ramessides. There is no Egyptian account of the exodus – that would be the report of a defeat.',
      },
    },
    {
      id: 'sinai',
      chapter: 19,
      label: { de: 'Am Sinai', en: 'At Sinai' },
      when: { de: 'Im dritten Monat nach dem Auszug', en: 'In the third month after leaving Egypt' },
      note: {
        de: 'Das Buch rechnet ab hier nicht mehr in Jahren, sondern in Monaten und Tagen – und bleibt dann fast zwanzig Kapitel lang an einem einzigen Ort stehen.',
        en: 'From here the book no longer counts in years but in months and days – and then stands still in one single place for almost twenty chapters.',
      },
    },
    {
      id: 'kalb',
      chapter: 32,
      label: { de: 'Das goldene Kalb', en: 'The golden calf' },
      when: { de: 'Vierzig Tage nach dem Bundesschluss', en: 'Forty days after the covenant' },
      note: {
        de: 'Der Abstand ist der Punkt: Der Bund ist keine sechs Wochen alt. Das Buch stellt den Bruch nicht ans Ende, sondern in die Mitte – und erzählt weiter.',
        en: 'The interval is the point: the covenant is not six weeks old. The book does not put the breach at the end but in the middle – and keeps going.',
      },
    },
    {
      id: 'einzug',
      chapter: 40,
      label: { de: 'Die Wolke füllt die Wohnung', en: 'The cloud fills the dwelling' },
      when: { de: 'Am ersten Tag des zweiten Jahres', en: 'On the first day of the second year' },
      note: {
        de: 'Ein Jahr nach dem Auszug steht das Zelt. Das Buch endet nicht mit Ankunft im Land – das dauert noch vierzig Jahre –, sondern mit Einzug bei den Leuten.',
        en: 'One year after leaving Egypt the tent stands. The book ends not with arrival in the land – that takes forty more years – but with a moving-in among the people.',
      },
    },
  ],
  traces: [
    {
      id: 'ichbin',
      title: { de: 'Der Name, den Jesus aufnimmt', en: 'The name Jesus takes up' },
      seed: {
        ref: 'Ex 3:14',
        refEn: 'Exod 3:14',
        de: 'Gott sprach zu Mose: ICH WERDE SEIN, DER ICH SEIN WERDE.',
        en: 'God said to Moses, "I AM WHO I AM,"',
      },
      echo: {
        ref: 'Joh 8:58',
        refEn: 'John 8:58',
        de: 'Wahrlich, wahrlich ich sage euch: Ehe denn Abraham ward, bin ich.',
        en: 'Most certainly, I tell you, before Abraham came into existence, I AM.',
      },
      text: {
        de: 'Der Satz ist grammatisch falsch – „ehe Abraham wurde, bin ich" – und die Zuhörer greifen danach zu Steinen. Sie verstehen ihn als das, was er ist: eine Übernahme des Namens vom Busch.',
        en: 'The sentence is grammatically wrong – "before Abraham came to be, I am" – and the hearers reach for stones. They understand it as what it is: a taking-up of the name from the bush.',
      },
    },
    {
      id: 'passa',
      title: { de: 'Das Passalamm', en: 'The Passover lamb' },
      seed: {
        ref: 'Ex 12:13',
        refEn: 'Exod 12:13',
        de: 'Und das Blut soll euer Zeichen sein an den Häusern, darin ihr seid, daß, wenn ich das Blut sehe, an euch vorübergehe',
        en: 'The blood shall be to you for a token on the houses where you are: and when I see the blood, I will pass over you',
      },
      echo: {
        ref: '1Kor 5:7',
        refEn: '1Cor 5:7',
        de: 'Denn wir haben auch ein Osterlamm, das ist Christus, für uns geopfert.',
        en: 'For indeed Christ, our Passover, has been sacrificed in our place.',
      },
      text: {
        de: 'Alle vier Evangelien legen die Kreuzigung auf das Passafest. Johannes setzt sie auf den Tag, an dem im Tempel die Lämmer geschlachtet werden – und zitiert zum Schluss die Vorschrift, dem Lamm kein Bein zu zerbrechen.',
        en: 'All four gospels place the crucifixion at Passover. John sets it on the day the lambs are slaughtered in the temple – and quotes at the end the rule that no bone of the lamb be broken.',
      },
    },
    {
      id: 'brot',
      title: { de: 'Brot vom Himmel', en: 'Bread from heaven' },
      seed: {
        ref: 'Ex 16:15',
        refEn: 'Exod 16:15',
        de: 'es ist das Brot, das euch der HERR zu essen gegeben hat.',
        en: 'It is the bread which Yahweh has given you to eat.',
      },
      echo: {
        ref: 'Joh 6:35',
        refEn: 'John 6:35',
        de: 'Ich bin das Brot des Lebens. Wer zu mir kommt, den wird nicht hungern;',
        en: 'I am the bread of life. He who comes to me will not be hungry,',
      },
      text: {
        de: 'Die Menge in Johannes 6 bringt selbst das Manna ins Gespräch: „Unsere Väter haben Brot gegessen in der Wüste." Die Antwort verschiebt die Frage vom Brot auf den Geber.',
        en: 'The crowd in John 6 raises the manna themselves: "Our fathers ate bread in the wilderness." The answer shifts the question from the bread to the giver.',
      },
    },
    {
      id: 'fels',
      title: { de: 'Der Fels, der mitging', en: 'The rock that followed' },
      seed: {
        ref: 'Ex 17:6',
        refEn: 'Exod 17:6',
        de: 'da sollst du den Fels schlagen, so wird Wasser herauslaufen, daß das Volk trinke.',
        en: 'You shall strike the rock, and water will come out of it, that the people may drink.',
      },
      echo: {
        ref: '1Kor 10:4',
        refEn: '1Cor 10:4',
        de: 'sie tranken aber vom geistlichen Fels, der mitfolgte, welcher war Christus.',
        en: 'For they drank of a spiritual rock that followed them, and the rock was Christ.',
      },
      text: {
        de: 'Paulus liest die Wüstenzeit als Vorgeschichte der Gemeinde in Korinth – und warnt im selben Atemzug: Dieselben Leute sind unterwegs umgekommen. Das Bild ist kein Trost, sondern ein Ernstfall.',
        en: 'Paul reads the wilderness years as the prehistory of the church in Corinth – and warns in the same breath: those same people died on the way. The image is not a comfort but a case in point.',
      },
    },
    {
      id: 'blut',
      title: { de: 'Das Blut des Bundes', en: 'The blood of the covenant' },
      seed: {
        ref: 'Ex 24:8',
        refEn: 'Exod 24:8',
        de: 'Sehet, das ist das Blut des Bundes, den der HERR mit euch macht über allen diesen Worten.',
        en: 'Look, this is the blood of the covenant, which Yahweh has made with you concerning all these words.',
      },
      echo: {
        ref: 'Mt 26:28',
        refEn: 'Matt 26:28',
        de: 'das ist mein Blut des neuen Testaments, welches vergossen wird für viele zur Vergebung der Sünden.',
        en: 'for this is my blood of the new covenant, which is poured out for many for the remission of sins.',
      },
      text: {
        de: 'Jesus sagt beim Passamahl fast wörtlich, was Mose am Sinai sagt, und schiebt ein Wort ein: „neu". Wer 2. Mose 24 nicht kennt, hört den Satz als Bild; wer es kennt, hört einen Bundesschluss.',
        en: 'At the Passover meal Jesus says almost word for word what Moses says at Sinai, and adds one word: "new". Without Exodus 24 the sentence sounds like an image; with it, it sounds like a covenant being made.',
      },
    },
    {
      id: 'wohnte',
      title: { de: '„Wohnte unter uns"', en: '"Lived among us"' },
      seed: {
        ref: 'Ex 40:34',
        refEn: 'Exod 40:34',
        de: 'Da bedeckte die Wolke die Hütte des Stifts, und die Herrlichkeit des HERRN füllte die Wohnung.',
        en: 'Then the cloud covered the Tent of Meeting, and Yahweh\'s glory filled the tabernacle.',
      },
      echo: {
        ref: 'Joh 1:14',
        refEn: 'John 1:14',
        de: 'Und das Wort ward Fleisch und wohnte unter uns, und wir sahen seine Herrlichkeit',
        en: 'The Word became flesh, and lived among us. We saw his glory,',
      },
      text: {
        de: 'Das griechische Wort für „wohnte" heißt wörtlich „zeltete". Johannes setzt den letzten Satz von 2. Mose an den Anfang seines Evangeliums: Dieselbe Herrlichkeit, dasselbe Zelt – nur diesmal ein Mensch.',
        en: 'The Greek word for "lived" literally means "pitched his tent". John puts the last sentence of Exodus at the start of his gospel: the same glory, the same tent – only this time a human being.',
      },
    },
  ],
  deepen: [
    {
      id: 'name',
      title: { de: 'Der Name, der keine Verfügung zulässt', en: 'The name that grants no leverage' },
      text: {
        de: 'Mose fragt nach dem Namen, weil ein Name im Alten Orient Zugriff bedeutet: Wer den Namen eines Gottes kennt, kann ihn anrufen und damit rechnen. Die Antwort – „Ich werde sein, der ich sein werde" – ist eine Form des Verbs „sein" und beantwortet die Frage, ohne sie zu erfüllen. Aus den vier Buchstaben dieses Namens wird später das Wort, das man im Judentum nicht ausspricht; Luther schreibt an seiner Stelle „HERR" in Großbuchstaben.',
        en: 'Moses asks for the name because in the ancient Near East a name means access: whoever knows a god\'s name can call on him and expect a result. The answer – "I AM WHO I AM" – is a form of the verb "to be", and answers the question without granting the request. From the four letters of this name comes the word Judaism does not pronounce; Luther writes "HERR" in capitals in its place.',
      },
      source: {
        de: '2. Mose 3,13-15; dieselbe Wurzel wieder in 6,2-3 und 33,19.',
        en: 'Exodus 3:13-15; the same root again in 6:2-3 and 33:19.',
      },
    },
    {
      id: 'plagen',
      title: { de: 'Die Plagen treffen Götter, nicht Wetter', en: 'The plagues strike gods, not weather' },
      text: {
        de: 'Der Nil, die Sonne, das Vieh, die Ernte – jede Plage trifft einen Bereich, für den in Ägypten eine Gottheit zuständig war, und der Text sagt das selbst: „über alle Götter der Ägypter will ich Gericht halten". Die neunte Plage, drei Tage Finsternis, trifft den obersten davon; die zehnte den Sohn des Königs, der selbst als göttlich galt. Wer die Reihe als Naturkette liest, liest an der Aussage vorbei.',
        en: 'The Nile, the sun, the cattle, the harvest – each plague strikes a domain an Egyptian deity was responsible for, and the text says so itself: "against all the gods of Egypt I will execute judgments". The ninth plague, three days of darkness, strikes the chief of them; the tenth strikes the king\'s son, himself held to be divine. Read the sequence as a chain of natural causes and you read past the point.',
      },
      source: {
        de: '2. Mose 12,12; die Reihe der Plagen in 7,14–12,32.',
        en: 'Exodus 12:12; the sequence of plagues in 7:14–12:32.',
      },
    },
    {
      id: 'recht',
      title: { de: 'Fallrecht wie bei den Nachbarn – mit Unterschieden', en: 'Case law like the neighbours\' – with differences' },
      text: {
        de: 'Die Rechtssätze in 2. Mose 21–23 haben dieselbe Form wie die des Kodex Hammurapi: „Wenn jemand …, dann …". Sie behandeln dieselben Fälle, bis hin zum stößigen Ochsen. Die Unterschiede liegen im Detail und sind die Aussage: Die Strafe richtet sich nicht nach dem Stand des Geschädigten, Sklaven kommen nach sechs Jahren frei, und für den Fremden wird eigens ein Grund genannt – „denn ihr seid auch Fremdlinge in Ägyptenland gewesen".',
        en: 'The legal sentences of Exodus 21–23 have the same form as those of the Code of Hammurabi: "If someone …, then …". They treat the same cases, down to the goring ox. The differences lie in the detail and are the point: punishment does not scale with the victim\'s rank, slaves go free after six years, and for the foreigner a reason is given expressly – "for you were foreigners in the land of Egypt".',
      },
      source: {
        de: 'Kodex Hammurapi §§ 250-252 gegen 2. Mose 21,28-32; die Begründung in 22,20 und 23,9.',
        en: 'Code of Hammurabi §§ 250-252 against Exodus 21:28-32; the reason given in 22:21 and 23:9.',
      },
    },
    {
      id: 'wohnung',
      title: { de: 'Die Wohnung ist gebaut wie die Welt', en: 'The dwelling is built like the world' },
      text: {
        de: 'Die Bauanweisungen kommen in sieben Reden, jede beginnt mit „Und der HERR redete mit Mose"; die siebte handelt vom Sabbat. Am Ende heißt es von Mose fast wörtlich, was von Gott am Ende der Schöpfung gesagt wird: Er sah das Werk an, es war vollendet, und er segnete. Wer 1. Mose 1–2 im Ohr hat, hört in 2. Mose 40 die Schöpfung noch einmal – im Kleinen, mitten im Lager.',
        en: 'The building instructions come in seven speeches, each beginning "Yahweh spoke to Moses"; the seventh is about the Sabbath. At the end, what is said of Moses is almost word for word what is said of God at the end of creation: he saw the work, it was finished, and he blessed. With Genesis 1–2 in your ear, Exodus 40 sounds like creation again – in miniature, in the middle of the camp.',
      },
      source: {
        de: '2. Mose 25,1 · 30,11 · 30,17 · 30,22 · 30,34 · 31,1 · 31,12; der Abschluss 39,43 gegen 1. Mose 1,31–2,3.',
        en: 'Exodus 25:1 · 30:11 · 30:17 · 30:22 · 30:34 · 31:1 · 31:12; the closing 39:43 against Genesis 1:31–2:3.',
      },
    },
    {
      id: 'gnade',
      title: { de: 'Der meistzitierte Satz des Alten Testaments', en: 'The Old Testament\'s most quoted sentence' },
      text: {
        de: 'Nach dem goldenen Kalb stellt Gott sich selbst vor: „barmherzig und gnädig und geduldig und von großer Gnade und Treue". Dieser Satz wird im Alten Testament immer wieder aufgenommen – in den Psalmen, bei Joel, bei Nahum, und bei Jona so, dass er zur Beschwerde wird: Jona wirft Gott vor, genau so zu sein. Ein Bekenntnis, das man Gott auch vorhalten kann.',
        en: 'After the golden calf God describes himself: "merciful and gracious, slow to anger, and abundant in loving kindness and truth". The sentence is taken up again and again in the Old Testament – in the Psalms, in Joel, in Nahum, and in Jonah so pointedly that it becomes a complaint: Jonah accuses God of being exactly like that. A confession you can also hold against God.',
      },
      source: {
        de: '2. Mose 34,6-7; aufgenommen u. a. in Psalm 86,15 · 103,8 · 145,8 · Joel 2,13 · Jona 4,2 · Nahum 1,3.',
        en: 'Exodus 34:6-7; taken up in Psalm 86:15 · 103:8 · 145:8 · Joel 2:13 · Jonah 4:2 · Nahum 1:3, among others.',
      },
    },
  ],
  questions: [
    {
      de: 'Die Zehn Worte beginnen mit einer Geschichte statt mit einem Gebot. Was ändert diese Reihenfolge?',
      en: 'The Ten Words begin with a story rather than a command. What does that order change?',
    },
    {
      de: 'Ein Drittel des Buches ist Bauplan. Warum nimmt sich ein Buch über Befreiung so viel Zeit für Maße und Stoffe?',
      en: 'A third of the book is a building plan. Why does a book about liberation take so much time over measurements and fabrics?',
    },
    {
      de: 'Der Bundesbruch steht in der Mitte des Buches, nicht am Ende. Was sagt das über die Erzählung, die weitergeht?',
      en: 'The breaking of the covenant stands in the middle of the book, not at the end. What does that say about the story that continues?',
    },
  ],
};

/* ------------------------------------------------------------------ 3. Mose */

const LEVITICUS: Portrait = {
  osis: 'Lev',
  hebrew: {
    word: 'וַיִּקְרָא',
    translit: 'Wajikra',
    means: { de: '„Und er rief" – das erste Wort des Buches ist sein Name.', en: '"And he called" – the book\'s first word is its name.' },
  },
  subtitle: {
    de: 'Wie man einem heiligen Gott nahekommt, ohne zu verbrennen',
    en: 'How to come near a holy God without being consumed',
  },
  summary: {
    de: 'Am Ende von 2. Mose zieht Gott in ein Zelt mitten im Lager – und damit steht ein Problem im Raum: Wie lebt man neben ihm? 3. Mose ist die Antwort, und sie besteht fast ganz aus Rede: dreiunddreißigmal redet der HERR aus dem Zelt. Opfer, Priester, rein und unrein, ein Tag der Versöhnung im Jahr, und dann ein Satz, der alles umdreht: Heilig sein heißt, den Nachbarn zu lieben wie sich selbst.',
    en: 'At the end of Exodus God moves into a tent in the middle of the camp – and with that a problem is in the room: how do you live next door to him? Leviticus is the answer, and it consists almost entirely of speech: thirty-three times Yahweh speaks from the tent. Offerings, priests, clean and unclean, one day of atonement in the year – and then a sentence that turns it all around: to be holy means to love your neighbour as yourself.',
  },
  heart: {
    de: 'Das unbeliebteste Buch der Bibel beantwortet eine Frage, die sich sonst niemand stellt: Was macht man, wenn Gott tatsächlich einzieht? Die Antwort ist keine Frömmigkeit, sondern eine Ordnung – wie man näher kommt (Opfer), wer das darf (Priester), was dazwischenkommt (rein und unrein) und was einmal im Jahr alles zurücksetzt (der Versöhnungstag). In der zweiten Hälfte kippt das Buch: Dieselbe Heiligkeit, die am Altar mit Blut und Maßen umgeht, verlangt in Kapitel 19 ehrliche Waagen, ungeerntete Feldränder für die Armen, pünktlichen Lohn und die Liebe zum Fremden. Heilig ist hier nichts, was im Tempel bleibt.',
    en: 'The Bible\'s least loved book answers a question nobody else asks: what do you do when God actually moves in? The answer is not piety but an order – how to come near (offerings), who may (priests), what gets in the way (clean and unclean) and what resets everything once a year (the Day of Atonement). In the second half the book tips over: the same holiness that deals in blood and measurements at the altar demands, in chapter 19, honest scales, unharvested field edges for the poor, wages paid on time and love for the foreigner. Holiness here is nothing that stays in the temple.',
  },
  verse: {
    ref: '3. Mose 19:2',
    refEn: 'Lev 19:2',
    de: 'Ihr sollt heilig sein; denn ich bin heilig, der HERR, euer Gott.',
    en: 'You shall be holy; for I, Yahweh your God, am holy.',
  },
  facts: {
    chapters: 27,
    verses: 859,
    places: 4,
    genre: {
      de: 'Fast durchgehend Gottesrede – Anweisungen, Rechtssätze, Kalender. Erzählt wird nur zweimal, und beide Male geht es schlecht aus.',
      en: 'Almost entirely divine speech – instructions, legal clauses, a calendar. There are only two narratives, and both end badly.',
    },
    scene: {
      de: 'Ein einziger Ort: der Fuß des Sinai, genauer die Tür der Stiftshütte. Dieses Buch bewegt sich nicht – es nennt in 27 Kapiteln nur vier Orte.',
      en: 'One single place: the foot of Sinai, or rather the door of the Tent of Meeting. This book does not move – in 27 chapters it names just four places.',
    },
    keyword: {
      de: '„Heilig" – 140-mal. Dicht dahinter das Gegenteil: „unrein" steht 141-mal da, „rein" nur 59-mal.',
      en: '"Holy" – 140 times. Close behind, its opposite: "unclean" appears 141 times, "clean" only 59.',
    },
  },
  movements: [
    {
      id: 'opfer',
      from: 1,
      to: 7,
      title: { de: 'Fünf Wege, näher zu kommen', en: 'Five ways of coming near' },
      text: {
        de: 'Brandopfer, Speisopfer, Dankopfer, Sündopfer, Schuldopfer – fünf Formen für fünf Anlässe, und keine davon kauft Gott etwas ab. Das hebräische Wort für Opfer heißt „das Herangebrachte": Es geht um Nähe, nicht um Bezahlung. Wer bringt, legt die Hand auf den Kopf des Tieres – eine Geste, die sagt: Das hier steht für mich.',
        en: 'Burnt offering, grain offering, peace offering, sin offering, guilt offering – five forms for five occasions, and none of them buys God off. The Hebrew word for offering means "that which is brought near": this is about nearness, not payment. Whoever brings one lays a hand on the animal\'s head – a gesture that says: this stands for me.',
      },
      turn: {
        de: '„und lege seine Hand auf des Brandopfers Haupt, so wird es angenehm sein und ihn versöhnen."',
        en: '"He shall lay his hand on the head of the burnt offering, and it shall be accepted for him to make atonement for him."',
      },
      color: '#a83a3a',
      symbol: 'M4 20h16M6 20v-6h12v6M8 14c0-3 4-3 4-7 0 4 4 4 4 7',
      places: ['Mount Sinai'],
    },
    {
      id: 'priester',
      from: 8,
      to: 10,
      title: { de: 'Die Einsetzung – und das fremde Feuer', en: 'The ordination – and the strange fire' },
      text: {
        de: 'Sieben Tage Einsetzung, am achten steigt Feuer vom HERRN herab und verzehrt das Opfer; das Volk jubelt und fällt auf sein Angesicht. Im selben Kapitelbogen nehmen zwei von Aarons Söhnen ihre Pfannen und bringen „fremdes Feuer", das ihnen nicht geboten war – und dasselbe Feuer verzehrt sie. Der Text erklärt nicht, was daran fremd war. Aaron schweigt.',
        en: 'Seven days of ordination; on the eighth, fire comes down from Yahweh and consumes the offering – the people shout and fall on their faces. In the same span two of Aaron\'s sons take their censers and bring "strange fire", which had not been commanded – and the same fire consumes them. The text never explains what was strange about it. Aaron says nothing.',
      },
      turn: {
        de: '„Ich erzeige mich heilig an denen, die mir nahe sind" – und Aaron schweigt still.',
        en: '"I will show myself holy to those who come near me" – and Aaron held his peace.',
      },
      color: '#c98a2b',
      symbol: 'M12 3v4M9 7h6l-1 4H10zM8 11h8l-1 9H9zM6 20h12',
      places: ['Mount Sinai'],
    },
    {
      id: 'reinunrein',
      from: 11,
      to: 15,
      title: { de: 'Rein und unrein', en: 'Clean and unclean' },
      text: {
        de: 'Essen, Geburt, Hautkrankheit, Ausfluss, Schimmel im Haus. Es geht nicht um Hygiene und nicht um Moral: Unrein ist ein Zustand, kein Vergehen – man wird es durch Dinge, die zum Leben gehören, und man wird es wieder los. Was daran hängt, ist der Zugang zum Heiligtum, nicht der Wert eines Menschen. Wer aussätzig ist, muss selbst rufen: „Unrein, unrein!" – und Kapitel 14 beschreibt in aller Ausführlichkeit, wie er zurückkommt.',
        en: 'Food, childbirth, skin disease, discharge, mould in a house. This is not about hygiene and not about morals: unclean is a condition, not an offence – you contract it through things that belong to life, and you get rid of it again. What hangs on it is access to the sanctuary, not a person\'s worth. The leper must cry out "Unclean! Unclean!" – and chapter 14 describes at length how he comes back.',
      },
      turn: {
        de: '„auf daß ihr könnt unterscheiden, was heilig und unheilig, was rein und unrein ist" – die Aufgabe der Priester in einem Satz.',
        en: '"You are to make a distinction between the holy and the common, and between the unclean and the clean" – the priests\' task in one sentence.',
      },
      color: '#3a6ea8',
      symbol: 'M12 3c-3 4-6 7-6 10a6 6 0 0 0 12 0c0-3-3-6-6-10zM8 16c0 2 1.8 3.5 4 3.5',
      places: ['Mount Sinai'],
    },
    {
      id: 'versoehnung',
      from: 16,
      to: 16,
      title: { de: 'Ein Tag im Jahr', en: 'One day in the year' },
      text: {
        de: 'Ein einziges Kapitel, und alles läuft darauf zu: der große Versöhnungstag. Zwei Böcke, das Los entscheidet; einer wird geopfert, dem anderen legt der Hohepriester die Hände auf, bekennt über ihm die Schuld des ganzen Volkes und lässt ihn in die Wüste laufen. Einmal im Jahr, an einem einzigen Tag, geht ein einziger Mensch hinter den Vorhang. Das ist der Mittelpunkt des Buches – nicht in der Mitte der Verse, sondern in der Sache.',
        en: 'A single chapter, and everything runs towards it: the Day of Atonement. Two goats, the lot decides; one is sacrificed, on the other the high priest lays his hands, confesses over it the guilt of the whole people, and sends it off into the wilderness. Once a year, on one single day, one single person goes behind the curtain. This is the book\'s centre – not the middle of its verses, but of its case.',
      },
      turn: {
        de: '„Denn an diesem Tage geschieht eure Versöhnung, daß ihr gereinigt werdet."',
        en: '"for on this day shall atonement be made for you, to cleanse you."',
      },
      color: '#e0a449',
      symbol: 'M5 20V9l7-5 7 5v11M9 20v-7h6v7M3 20h18',
      places: ['Mount Sinai'],
    },
    {
      id: 'heiligkeit',
      from: 17,
      to: 20,
      title: { de: 'Heilig sein heißt: den Nachbarn lieben', en: 'To be holy means loving your neighbour' },
      text: {
        de: 'Hier kippt das Buch. Dieselbe Heiligkeit, die am Altar mit Blut und Maßen umgeht, verlangt jetzt ehrliche Waagen, ungeerntete Feldränder für die Armen, Lohn am selben Tag, Rücksicht auf Taube und Blinde – und mitten in dieser Liste von Alltagsregeln steht der Satz, den Jesus später neben das erste Gebot stellt. Vierzehn Verse weiter gilt er auch dem Fremden.',
        en: 'Here the book tips. The same holiness that deals in blood and measures at the altar now demands honest scales, unharvested field edges for the poor, wages paid the same day, regard for the deaf and the blind – and in the middle of this list of everyday rules stands the sentence Jesus later sets beside the first commandment. Fourteen verses on, it covers the foreigner too.',
      },
      turn: {
        de: '„Du sollst deinen Nächsten lieben wie dich selbst" – Vers 18 einer Liste über Feldränder, Waagen und Tagelöhner.',
        en: '"You shall love your neighbor as yourself" – verse 18 of a list about field edges, scales and day labourers.',
      },
      color: '#2f8f7f',
      symbol: 'M12 20.3 4.6 13a4.7 4.7 0 0 1 6.7-6.7l.7.7.7-.7a4.7 4.7 0 0 1 6.7 6.7z',
      places: ['Canaan', 'Egypt'],
    },
    {
      id: 'feste',
      from: 21,
      to: 24,
      title: { de: 'Das Jahr bekommt seinen Takt', en: 'The year gets its beat' },
      text: {
        de: 'Wer am Heiligtum dient, was dorthin gebracht werden darf – und dann der Kalender: Sabbat, Passa, Wochenfest, Posaunen, Versöhnungstag, Laubhütten. Das Jahr ist damit nicht mehr eine Folge von Ernten, sondern eine Folge von Erinnerungen. Dazwischen die zweite und letzte Erzählung des Buches: ein Mann lästert den Namen, und die Gemeinde weiß nicht, was zu tun ist.',
        en: 'Who serves at the sanctuary, what may be brought there – and then the calendar: Sabbath, Passover, Weeks, Trumpets, Atonement, Booths. The year is no longer a sequence of harvests but a sequence of rememberings. In between stands the book\'s second and last narrative: a man blasphemes the Name, and the congregation does not know what to do.',
      },
      turn: {
        de: '„Sechs Tage sollst du arbeiten; der siebente Tag aber ist der große, heilige Sabbat" – der Takt steht vor allen Festen.',
        en: '"Six days shall work be done, but on the seventh day is a Sabbath of solemn rest" – the beat comes before all the feasts.',
      },
      color: '#9a4ba0',
      symbol: 'M12 4v16M6 8v8M18 8v8M4 20h16M9 6h6',
      places: ['Mount Sinai'],
    },
    {
      id: 'land',
      from: 25,
      to: 27,
      title: { de: 'Das Land gehört nicht euch', en: 'The land is not yours' },
      text: {
        de: 'Alle sieben Jahre ruht der Acker, alle fünfzig wird das Horn geblasen: Schulden verfallen, Sklaven gehen frei, jedes verkaufte Stück Land kommt an die Familie zurück. Die Begründung steht in einem Halbsatz und hebelt den ganzen Bodenmarkt aus – das Land ist nicht Eigentum, sondern Lehen. Danach Segen und Fluch, und ein letztes Kapitel über Gelübde: was man verspricht, und was es kostet.',
        en: 'Every seventh year the field rests; every fiftieth the horn is blown: debts lapse, slaves go free, every plot of sold land returns to its family. The reason stands in half a sentence and unhinges the whole land market – the land is not property but a tenancy. Then blessing and curse, and a last chapter on vows: what you promise, and what it costs.',
      },
      turn: {
        de: '„denn das Land ist mein, und ihr seid Fremdlinge und Gäste vor mir."',
        en: '"for the land is mine; for you are strangers and live as foreigners with me."',
      },
      color: '#5c8a3a',
      symbol: 'M3 18h18M5 18V9l4-3 4 3v9M15 18v-5l4-2v7M7 12h2',
      places: ['Canaan'],
    },
  ],
  patterns: [
    {
      id: 'mitte',
      title: { de: 'Alles läuft auf einen Tag zu', en: 'Everything runs towards one day' },
      text: {
        de: 'Opfer, Priester, rein und unrein – drei Züge lang baut das Buch ein System auf, und dann kommt ein einziges Kapitel, das alles auf einmal zurücksetzt. Danach fängt es nicht wieder von vorn an: Was folgt, ist kein System mehr, sondern ein Leben. Die Mitte ist keine Rechnung – 456 Verse stehen davor, 369 danach –, sondern eine Sache.',
        en: 'Offerings, priests, clean and unclean – for three movements the book builds a system, and then comes a single chapter that resets all of it at once. Afterwards it does not start over: what follows is no longer a system but a life. The centre is not arithmetic – 456 verses come before it, 369 after – but substance.',
      },
      movements: ['opfer', 'priester', 'reinunrein', 'versoehnung'],
      refs: ['3. Mose 16:8', '3. Mose 16:22', '3. Mose 16:30'],
      color: '#e0a449',
    },
    {
      id: 'heilig',
      title: { de: 'Heilig heißt ausgesondert, nicht besser', en: 'Holy means set apart, not better' },
      text: {
        de: 'Das Wort steht 140-mal im Buch, und sein Gegenteil ist nicht „böse", sondern „gewöhnlich": Die Priester sollen unterscheiden zwischen heilig und unheilig, rein und unrein – vier Begriffe, zwei Paare, und sie liegen quer zueinander. Was am Altar gilt, gilt am Feldrand: Von Kapitel 19 an ist dasselbe Wort die Überschrift über ehrlichen Waagen und pünktlichem Lohn.',
        en: 'The word stands 140 times in the book, and its opposite is not "evil" but "common": the priests are to distinguish between holy and common, unclean and clean – four terms, two pairs, and they cut across each other. What holds at the altar holds at the edge of the field: from chapter 19 on, the same word is the heading over honest scales and wages paid on time.',
      },
      movements: ['priester', 'reinunrein', 'heiligkeit', 'feste'],
      refs: ['3. Mose 10:10', '3. Mose 11:45', '3. Mose 19:2'],
      color: '#7fe3d5',
    },
    {
      id: 'blut',
      title: { de: 'Blut ist Leben, nicht Bezahlung', en: 'Blood is life, not payment' },
      text: {
        de: 'Das Wort „Blut" steht 92-mal da, und ein einziger Vers sagt, warum: Im Blut ist das Leben, und deshalb ist es nicht zum Essen, sondern zum Versöhnen gegeben. Das ist der Grund, aus dem das ganze System besteht – und zugleich die Absage an die Vorstellung, man könne einen Gott bestechen. Was auf den Altar kommt, ist Leben, und es gehört ihm ohnehin.',
        en: 'The word "blood" appears 92 times, and one single verse says why: the life is in the blood, and therefore it is given not for eating but for atoning. That is the reason the whole system exists – and at the same time a refusal of the idea that a god can be bribed. What goes on the altar is life, and it belongs to him anyway.',
      },
      movements: ['opfer', 'versoehnung', 'heiligkeit'],
      refs: ['3. Mose 1:4', '3. Mose 16:30', '3. Mose 17:11'],
      color: '#a83a3a',
    },
  ],
  figures: [
    {
      id: 'mose',
      de: 'Mose',
      en: 'Moses',
      meaning: { de: 'Hier nicht der Anführer, sondern der Zuhörer: 33-mal steht „der HERR redete mit Mose".', en: 'Here not the leader but the listener: thirty-three times the text says "Yahweh spoke to Moses".' },
      who: {
        de: 'In diesem Buch tut Mose fast nichts. Er hört zu, gibt weiter, setzt Aaron ein – und einmal, nach dem Tod von Nadab und Abihu, gerät er mit Aaron aneinander und gibt nach.',
        en: 'In this book Moses does almost nothing. He listens, passes on, ordains Aaron – and once, after the death of Nadab and Abihu, he quarrels with Aaron and gives way.',
      },
      turn: {
        de: 'Das Buch beginnt damit, dass Gott ihn ruft – aus dem Zelt, das er selbst nicht betreten kann (2. Mose 40,35). Wer 3. Mose liest, liest, was Mose an der Tür gehört hat.',
        en: 'The book begins with God calling him – out of the tent he himself cannot enter (Exodus 40:35). To read Leviticus is to read what Moses heard at the door.',
      },
      ref: '3. Mose 1',
      from: 1,
      to: 27,
      person: 'mose',
      place: 'Mount Sinai',
    },
    {
      id: 'aaron',
      de: 'Aaron',
      en: 'Aaron',
      meaning: { de: 'Der erste Hohepriester – und der Vater der beiden, die am Einweihungstag sterben.', en: 'The first high priest – and the father of the two who die on the day of dedication.' },
      who: {
        de: 'Sieben Tage wird er eingesetzt, am achten steigt Feuer herab und das Volk jubelt. In derselben Stunde verliert er zwei Söhne.',
        en: 'For seven days he is ordained; on the eighth, fire comes down and the people shout. In the same hour he loses two sons.',
      },
      turn: {
        de: 'Auf die Erklärung, die Mose ihm gibt, antwortet er nicht. „Und Aaron schwieg still" – der Text lässt das stehen, ohne es zu deuten.',
        en: 'To the explanation Moses gives him he makes no answer. "Aaron held his peace" – the text lets that stand without interpreting it.',
      },
      ref: '3. Mose 8-10',
      from: 8,
      to: 16,
      person: 'aaron',
    },
    {
      id: 'nadab',
      de: 'Nadab und Abihu',
      en: 'Nadab and Abihu',
      meaning: { de: '„Freigebig" und „er ist mein Vater" – zwei Namen, die nach dem zehnten Kapitel nicht mehr vorkommen.', en: '"Generous" and "he is my father" – two names that do not appear again after chapter ten.' },
      who: {
        de: 'Die beiden ältesten Söhne Aarons, eben erst zu Priestern geweiht. Sie bringen Räucherwerk mit Feuer, „das er ihnen nicht geboten hatte".',
        en: 'Aaron\'s two eldest sons, only just consecrated as priests. They bring incense with fire "which he had not commanded them".',
      },
      turn: {
        de: 'Was an dem Feuer fremd war, sagt der Text nicht – und genau das ist der Punkt: Die Nähe, die dieses Buch regelt, ist keine Sache, über die man selbst verfügt.',
        en: 'What was strange about the fire the text does not say – and that is exactly the point: the nearness this book regulates is not something you have at your own disposal.',
      },
      ref: '3. Mose 10:1-3',
      from: 10,
      to: 10,
      person: 'nadab',
    },
    {
      id: 'eleasar',
      de: 'Eleasar und Itamar',
      en: 'Eleazar and Ithamar',
      meaning: { de: '„Gott hat geholfen" – die beiden jüngeren Brüder, die den Dienst weiterführen.', en: '"God has helped" – the two younger brothers who carry the service on.' },
      who: {
        de: 'Sie stehen am Tag der Katastrophe daneben und müssen weitermachen: Ihnen wird verboten, das Haar zu lösen und die Kleider zu zerreißen – die üblichen Zeichen der Trauer.',
        en: 'They stand by on the day of the disaster and have to carry on: they are forbidden to let their hair down or tear their clothes – the customary signs of mourning.',
      },
      turn: {
        de: 'Mose findet später heraus, dass sie das Sündopfer nicht gegessen haben, und wird zornig; Aaron widerspricht ihm – und Mose gibt ihm recht. Eine der wenigen Stellen, an denen in diesem Buch verhandelt wird.',
        en: 'Moses later finds they have not eaten the sin offering and is angry; Aaron contradicts him – and Moses concedes. One of the few places in this book where anything is negotiated.',
      },
      ref: '3. Mose 10:6-20',
      from: 10,
      to: 10,
      person: 'eleasar_p',
    },
    {
      id: 'laesterer',
      de: 'Der Sohn der Israelitin',
      en: 'The Israelite woman\'s son',
      meaning: { de: 'Ohne Namen; der Text nennt nur seine Mutter Schelomit und ihren Vater – und dass sein Vater Ägypter war.', en: 'Unnamed; the text names only his mother Shelomith and her father – and that his father was an Egyptian.' },
      who: {
        de: 'Die zweite und letzte Erzählung des Buches: Ein Mann gerät im Lager in Streit und lästert dabei den Namen. Man setzt ihn fest, „bis ihnen klare Antwort würde durch den Mund des HERRN".',
        en: 'The book\'s second and last narrative: a man gets into a fight in the camp and in the middle of it blasphemes the Name. They put him in custody "until Yahweh\'s will should be declared to them".',
      },
      turn: {
        de: 'Die Antwort schließt einen Satz ein, der in die andere Richtung zielt als das Urteil: „Wie der Fremdling, so soll auch der Einheimische sein." Gleiches Recht, auch wo es hart ist.',
        en: 'The answer includes a sentence that points the other way from the verdict: "The foreigner as well as the native-born." The same law, even where it is hard.',
      },
      ref: '3. Mose 24:10-16',
      from: 24,
      to: 24,
    },
  ],
  beats: [
    {
      id: 'ruf',
      chapter: 1,
      label: { de: 'Der Ruf aus dem Zelt', en: 'The call from the tent' },
      when: { de: 'Unmittelbar nach dem letzten Satz von 2. Mose', en: 'Immediately after the last sentence of Exodus' },
      note: {
        de: '2. Mose endet damit, dass die Wolke die Hütte bedeckt und Mose nicht hineingehen kann. 3. Mose beginnt im nächsten Atemzug: „Und der HERR rief Mose und redete mit ihm aus der Hütte des Stifts." Die beiden Bücher hängen an dieser Naht zusammen.',
        en: 'Exodus ends with the cloud covering the tent so that Moses cannot go in. Leviticus begins in the next breath: "Yahweh called to Moses, and spoke to him from the Tent of Meeting." The two books hang together at this seam.',
      },
    },
    {
      id: 'achter',
      chapter: 9,
      label: { de: 'Der achte Tag', en: 'The eighth day' },
      when: { de: 'Nach sieben Tagen Einsetzung', en: 'After seven days of ordination' },
      note: {
        de: 'Feuer vom HERRN verzehrt das Opfer, das Volk frohlockt – und im selben Kapitelbogen sterben zwei Priester. Der Tag der größten Nähe ist der Tag des Unglücks.',
        en: 'Fire from Yahweh consumes the offering, the people shout – and in the same span two priests die. The day of the greatest nearness is the day of the disaster.',
      },
    },
    {
      id: 'jom',
      chapter: 16,
      label: { de: 'Der zehnte Tag des siebten Monats', en: 'The tenth day of the seventh month' },
      when: { de: 'Einmal im Jahr, bis heute', en: 'Once a year, to this day' },
      note: {
        de: 'Der einzige Tag, an dem ein Mensch hinter den Vorhang geht. Als Jom Kippur ist er der höchste Feiertag des Judentums geblieben – ohne Tempel, ohne Opfer, mit Fasten und Gebet.',
        en: 'The only day on which a human being goes behind the curtain. As Yom Kippur it has remained the highest holy day of Judaism – without temple, without sacrifice, with fasting and prayer.',
      },
    },
    {
      id: 'kalender',
      chapter: 23,
      label: { de: 'Das Jahr bekommt seine Feste', en: 'The year gets its feasts' },
      when: { de: 'Der Kalender, aus dem das Festrad dieser App gebaut ist', en: 'The calendar this app\'s wheel of feasts is built from' },
      note: {
        de: 'Sabbat, Passa, Wochenfest, Posaunen, Versöhnungstag, Laubhütten – in dieser Reihenfolge und mit diesen Tagen. Wer wissen will, wann eines davon liegt, findet es im Modus „Feste Israels" als Rad.',
        en: 'Sabbath, Passover, Weeks, Trumpets, Atonement, Booths – in this order and on these days. Anyone wanting to know when one of them falls will find it as a wheel in the "Feasts of Israel" mode.',
      },
    },
    {
      id: 'halljahr',
      chapter: 25,
      label: { de: 'Alle sieben und alle fünfzig Jahre', en: 'Every seventh and every fiftieth year' },
      when: { de: 'Eine Zeitrechnung, die über ein Leben hinausgeht', en: 'A reckoning of time that outlasts a lifetime' },
      note: {
        de: 'Das Halljahr kommt einmal in fünfzig Jahren – höchstens zweimal im Leben eines Menschen. Ob es je gehalten wurde, sagt die Bibel nirgends; 2. Chronik 36,21 deutet das Exil als die Sabbatjahre, die das Land nachholt.',
        en: 'The jubilee comes once in fifty years – at most twice in a person\'s lifetime. Whether it was ever kept, the Bible nowhere says; 2 Chronicles 36:21 reads the exile as the sabbath years the land is catching up on.',
      },
    },
    {
      id: 'ende',
      chapter: 27,
      label: { de: 'Noch immer am Sinai', en: 'Still at Sinai' },
      when: { de: 'Etwa ein Monat zwischen dem ersten und dem letzten Satz', en: 'About one month between the first sentence and the last' },
      note: {
        de: 'Die Wohnung steht am ersten Tag des ersten Monats im zweiten Jahr (2. Mose 40,17), und 4. Mose beginnt am ersten Tag des zweiten Monats desselben Jahres (4. Mose 1,1). Dazwischen liegt dieses ganze Buch: 27 Kapitel, und die Lagerplätze haben sich nicht verändert.',
        en: 'The dwelling is raised on the first day of the first month of the second year (Exodus 40:17), and Numbers begins on the first day of the second month of that same year (Numbers 1:1). This entire book lies in between: 27 chapters, and the camp has not moved.',
      },
    },
  ],
  traces: [
    {
      id: 'heilig',
      title: { de: 'Derselbe Satz an die Gemeinde', en: 'The same sentence to the church' },
      seed: {
        ref: '3. Mose 19:2',
        refEn: 'Lev 19:2',
        de: 'Ihr sollt heilig sein; denn ich bin heilig, der HERR, euer Gott.',
        en: 'You shall be holy; for I, Yahweh your God, am holy.',
      },
      echo: {
        ref: '1. Petrus 1:16',
        refEn: '1Pet 1:16',
        de: 'Denn es steht geschrieben: "Ihr sollt heilig sein, denn ich bin heilig."',
        en: 'because it is written, "You shall be holy; for I am holy."',
      },
      text: {
        de: 'Petrus schreibt an Gemeinden in Kleinasien, die mit dem Opferdienst nichts zu tun haben – und zitiert ihnen wörtlich den Satz aus dem Buch, das am weitesten von ihnen entfernt scheint.',
        en: 'Peter writes to congregations in Asia Minor who have nothing to do with the sacrificial service – and quotes them, word for word, the sentence from the book that seems furthest from them.',
      },
    },
    {
      id: 'blut',
      title: { de: 'Ohne Blut keine Vergebung', en: 'Without blood no forgiveness' },
      seed: {
        ref: '3. Mose 17:11',
        refEn: 'Lev 17:11',
        de: 'Denn des Leibes Leben ist im Blut, und ich habe es euch auf den Altar gegeben, daß eure Seelen damit versöhnt werden.',
        en: 'For the life of the flesh is in the blood; and I have given it to you on the altar to make atonement for your souls',
      },
      echo: {
        ref: 'Hebräer 9:22',
        refEn: 'Heb 9:22',
        de: 'Und es wird fast alles mit Blut gereinigt nach dem Gesetz; und ohne Blut vergießen geschieht keine Vergebung.',
        en: 'According to the law, nearly everything is cleansed with blood, and apart from shedding of blood there is no remission.',
      },
      text: {
        de: 'Der Hebräerbrief setzt diesen Vers als Regel voraus und zieht daraus seinen ganzen Vergleich. Das „fast" ist dabei kein Versehen: 3. Mose kennt auch ein Sündopfer aus Mehl, für die, die sich kein Tier leisten können.',
        en: 'Hebrews takes this verse as the rule and builds its whole comparison on it. The "nearly" is not a slip: Leviticus also knows a sin offering of flour, for those who cannot afford an animal.',
      },
    },
    {
      id: 'draussen',
      title: { de: 'Draußen vor dem Tor', en: 'Outside the gate' },
      seed: {
        ref: '3. Mose 16:22',
        refEn: 'Lev 16:22',
        de: 'daß also der Bock alle ihre Missetat auf sich in eine Wildnis trage; und er lasse ihn in die Wüste.',
        en: 'The goat shall carry all their iniquities on himself to a solitary land, and he shall release the goat in the wilderness.',
      },
      echo: {
        ref: 'Hebräer 13:12',
        refEn: 'Heb 13:12',
        de: 'Darum hat auch Jesus, auf daß er heiligte das Volk durch sein eigen Blut, gelitten draußen vor dem Tor.',
        en: 'Therefore Jesus also, that he might sanctify the people through his own blood, suffered outside of the gate.',
      },
      text: {
        de: 'Der Versöhnungstag braucht zwei Böcke: einen, dessen Blut hineingetragen wird, und einen, der hinausgeht. Der Hebräerbrief liest die Hinrichtung vor der Stadtmauer als beides zugleich.',
        en: 'The Day of Atonement needs two goats: one whose blood is carried in, and one that goes out. Hebrews reads the execution outside the city wall as both at once.',
      },
    },
    {
      id: 'naechster',
      title: { de: 'Das zweite Gebot', en: 'The second commandment' },
      seed: {
        ref: '3. Mose 19:18',
        refEn: 'Lev 19:18',
        de: 'Du sollst deinen Nächsten lieben wie dich selbst; denn ich bin der HERR.',
        en: 'you shall love your neighbor as yourself. I am Yahweh.',
      },
      echo: {
        ref: 'Markus 12:31',
        refEn: 'Mark 12:31',
        de: 'Und das andere ist ihm gleich: "Du sollst deinen Nächsten lieben wie dich selbst." Es ist kein anderes Gebot größer denn diese.',
        en: 'The second is like this, \'You shall love your neighbor as yourself.\' There is no other commandment greater than these.',
      },
      text: {
        de: 'Gefragt nach dem höchsten Gebot, nennt Jesus zwei – und das zweite holt er aus der Mitte einer Liste über Feldränder, Waagen und Tagelöhner. Er erfindet es nicht, er hebt es heraus.',
        en: 'Asked for the greatest commandment, Jesus names two – and the second he takes from the middle of a list about field edges, scales and day labourers. He does not invent it, he lifts it out.',
      },
    },
    {
      id: 'priester',
      title: { de: '„Zeige dich dem Priester"', en: '"Show yourself to the priest"' },
      seed: {
        ref: '3. Mose 14:2',
        refEn: 'Lev 14:2',
        de: 'Das ist das Gesetz über den Aussätzigen, wenn er soll gereinigt werden. Er soll zum Priester kommen.',
        en: 'This shall be the law of the leper in the day of his cleansing. He shall be brought to the priest,',
      },
      echo: {
        ref: 'Markus 1:44',
        refEn: 'Mark 1:44',
        de: 'gehe hin und zeige dich dem Priester und opfere für deine Reinigung, was Mose geboten hat, zum Zeugnis über sie.',
        en: 'go show yourself to the priest, and offer for your cleansing the things which Moses commanded, for a testimony to them.',
      },
      text: {
        de: 'Jesus rührt einen Aussätzigen an – und schickt ihn danach genau den Weg, den 3. Mose 14 beschreibt. Die Heilung hebt die Ordnung nicht auf; sie füllt das Verfahren, das für diesen Fall seit Langem bereitliegt.',
        en: 'Jesus touches a leper – and then sends him down exactly the path Leviticus 14 lays out. The healing does not abolish the order; it fills the procedure that has long stood ready for this case.',
      },
    },
    {
      id: 'schatten',
      title: { de: 'Schatten und Körper', en: 'Shadow and body' },
      seed: {
        ref: '3. Mose 23:3',
        refEn: 'Lev 23:3',
        de: 'Sechs Tage sollst du arbeiten; der siebente Tag aber ist der große, heilige Sabbat, da ihr zusammenkommt.',
        en: 'Six days shall work be done, but on the seventh day is a Sabbath of solemn rest, a holy convocation;',
      },
      echo: {
        ref: 'Kolosser 2:17',
        refEn: 'Col 2:17',
        de: 'welches ist der Schatten von dem, das zukünftig war; aber der Körper selbst ist in Christo.',
        en: 'which are a shadow of the things to come; but the body is Christ\'s.',
      },
      text: {
        de: 'Paulus nennt Sabbat, Neumond und Speiseregeln einen Schatten – und ein Schatten ist kein Nichts, sondern der Umriss von etwas, das wirklich kommt. Wer die Feste aus 3. Mose 23 kennt, sieht den Umriss genauer.',
        en: 'Paul calls sabbath, new moon and food rules a shadow – and a shadow is not nothing but the outline of something that really comes. Whoever knows the feasts of Leviticus 23 sees the outline more clearly.',
      },
    },
    {
      id: 'wandeln',
      title: { de: '„Ich will unter euch wandeln"', en: '"I will walk among you"' },
      seed: {
        ref: '3. Mose 26:12',
        refEn: 'Lev 26:12',
        de: 'Und will unter euch wandeln und will euer Gott sein; so sollt ihr mein Volk sein.',
        en: 'I will walk among you, and will be your God, and you will be my people.',
      },
      echo: {
        ref: '2. Korinther 6:16',
        refEn: '2Cor 6:16',
        de: 'Ich will unter ihnen wohnen und unter ihnen wandeln und will ihr Gott sein, und sie sollen mein Volk sein.',
        en: 'I will dwell in them, and walk in them; and I will be their God, and they will be my people.',
      },
      text: {
        de: 'Paulus zitiert den Vers fast wörtlich und verschiebt eine einzige Präposition: aus „unter euch" wird „in ihnen". Der Ort, an dem Gott wohnt, ist in diesem Satz kein Zelt mehr.',
        en: 'Paul quotes the verse almost word for word and shifts a single preposition: "among you" becomes "in them". In that sentence the place where God dwells is no longer a tent.',
      },
    },
    {
      id: 'halljahr',
      title: { de: 'Das angenehme Jahr', en: 'The acceptable year' },
      seed: {
        ref: '3. Mose 25:10',
        refEn: 'Lev 25:10',
        de: 'Und ihr sollt das fünfzigste Jahr heiligen und sollt ein Freijahr ausrufen im Lande allen, die darin wohnen;',
        en: 'You shall make the fiftieth year holy, and proclaim liberty throughout the land to all its inhabitants.',
      },
      echo: {
        ref: 'Lukas 4:19',
        refEn: 'Luke 4:19',
        de: 'und zu verkündigen das angenehme Jahr des HERRN."',
        en: 'and to proclaim the acceptable year of the Lord.',
      },
      text: {
        de: 'In der Synagoge von Nazareth liest Jesus aus Jesaja 61 – und dessen letzter Satz nimmt das Halljahr auf: Schulden fallen, Gefangene gehen frei. Der Weg führt also über Jesaja, nicht direkt; und genau deshalb steht er hier, statt kürzer zu wirken, als er ist.',
        en: 'In the synagogue at Nazareth Jesus reads from Isaiah 61 – and its last line takes up the jubilee: debts fall, prisoners go free. So the path runs through Isaiah, not directly; and that is exactly why it is spelled out here rather than made to look shorter than it is.',
      },
    },
  ],
  deepen: [
    {
      id: 'rede',
      title: { de: 'Ein Buch, das fast nur redet', en: 'A book that almost only speaks' },
      text: {
        de: 'Dreiunddreißigmal steht in diesen 27 Kapiteln „der HERR redete mit Mose". Erzählt wird zweimal – der Tod von Nadab und Abihu und der Fall des Lästerers –, und beide Erzählungen sind kurz und enden mit einem Todesfall. Wer das Buch langweilig findet, hat recht in der Form und unrecht in der Sache: Es ist kein schlechtes Drehbuch, sondern gar keins.',
        en: 'Thirty-three times in these 27 chapters the text says "Yahweh spoke to Moses". There are two narratives – the death of Nadab and Abihu, and the case of the blasphemer – and both are short and end in a death. Whoever finds the book boring is right about its form and wrong about its substance: it is not a bad screenplay, it is none at all.',
      },
      source: {
        de: 'Gezählt im Text dieser App (Luther 1912): 33 Vorkommen von „redete mit Mose" in 3. Mose 1–27.',
        en: 'Counted in this app\'s text (Luther 1912): 33 occurrences of "spoke to Moses" in Leviticus 1–27.',
      },
    },
    {
      id: 'woerter',
      title: { de: 'Was ein Buch beschäftigt, steht in seinen Zahlen', en: 'What a book is occupied with shows in its numbers' },
      text: {
        de: '„Heilig" steht 140-mal da, „unrein" 141-mal – und „rein" nur 59-mal. Das Verhältnis ist die Aussage: Unreinheit ist der Normalfall, mit dem zu rechnen ist, nicht die Ausnahme, über die man sich empört. Fast alles, was unrein macht, gehört zum Leben: Essen, Geburt, Krankheit, Tod.',
        en: '"Holy" appears 140 times, "unclean" 141 – and "clean" only 59. The ratio is the point: uncleanness is the normal case to be reckoned with, not the exception to be scandalised by. Almost everything that makes unclean belongs to life: food, birth, illness, death.',
      },
      source: {
        de: 'Gezählt im Text dieser App (Luther 1912), 3. Mose 1–27.',
        en: 'Counted in this app\'s text (Luther 1912), Leviticus 1–27.',
      },
    },
    {
      id: 'qadosch',
      title: { de: 'Das Gegenteil von heilig ist gewöhnlich', en: 'The opposite of holy is common' },
      text: {
        de: 'Das hebräische qadosch heißt „ausgesondert", nicht „gut". Der Auftrag an die Priester nennt beide Paare nebeneinander: heilig und unheilig, rein und unrein – vier Begriffe, die sich kreuzen. Etwas kann rein und trotzdem gewöhnlich sein; das ist der Normalzustand. Wer „heilig" mit „moralisch einwandfrei" übersetzt, liest ab Kapitel 11 an allem vorbei.',
        en: 'The Hebrew qadosh means "set apart", not "good". The priests\' commission names both pairs side by side: holy and common, unclean and clean – four terms that cross. Something can be clean and still common; that is the normal state. Translate "holy" as "morally impeccable" and from chapter 11 on you read past everything.',
      },
      source: {
        de: '3. Mose 10,10; dieselbe Unterscheidung wieder in Hesekiel 22,26 und 44,23.',
        en: 'Leviticus 10:10; the same distinction again in Ezekiel 22:26 and 44:23.',
      },
    },
    {
      id: 'nachbarn',
      title: { de: 'Opfer bei den Nachbarn – und der Unterschied', en: 'Sacrifice among the neighbours – and the difference' },
      text: {
        de: 'Opfer gibt es im ganzen Alten Orient, und die Form ähnelt sich bis in Einzelheiten: Tierarten, Blutriten, Anteile für die Priester. Der Unterschied liegt in der Begründung. In Mesopotamien speisen die Opfer die Götter, die ohne sie hungern; hier steht ausdrücklich das Gegenteil, und ein Psalm sagt es später rundheraus: „Wenn mich hungerte, wollte ich dir nicht davon sagen; denn der Erdboden ist mein und alles, was darinnen ist."',
        en: 'Sacrifice exists across the ancient Near East, and the form is similar down to details: species, blood rites, portions for the priests. The difference lies in the reasoning. In Mesopotamia offerings feed gods who would otherwise go hungry; here the opposite is stated expressly, and a psalm later says it outright: "If I were hungry, I would not tell you, for the world is mine, and all that is in it."',
      },
      source: {
        de: 'Psalm 50,12; zum Vergleich das Atrahasis-Epos und Gilgamesch XI, wo sich die Götter nach der Flut „wie Fliegen" um das Opfer sammeln.',
        en: 'Psalm 50:12; compare the Atrahasis epic and Gilgamesh XI, where after the flood the gods gather around the offering "like flies".',
      },
    },
    {
      id: 'boden',
      title: { de: 'Ein Bodenmarkt mit eingebautem Ende', en: 'A land market with a built-in end' },
      text: {
        de: 'Im Halljahr fällt jedes verkaufte Grundstück an die Familie zurück. Das heißt: Verkauft wird nie das Land, sondern nur die Zahl der Ernten bis zum nächsten fünfzigsten Jahr – und Kapitel 25 sagt ausdrücklich, dass der Preis danach zu berechnen ist. Eine Wirtschaftsordnung, in der niemand dauerhaft alles verlieren kann, weil der Boden am Ende nicht handelbar ist.',
        en: 'In the jubilee every plot sold returns to its family. Which means: what is sold is never the land but only the number of harvests until the next fiftieth year – and chapter 25 says expressly that the price is to be calculated accordingly. An economic order in which nobody can permanently lose everything, because in the end the ground is not tradable.',
      },
      source: {
        de: '3. Mose 25,13-16 (der Preis nach der Zahl der Erntejahre) und 25,23 („das Land ist mein").',
        en: 'Leviticus 25:13-16 (price by the number of harvest years) and 25:23 ("the land is mine").',
      },
    },
    {
      id: 'neunzehn',
      title: { de: 'Wo die Nächstenliebe steht', en: 'Where "love your neighbour" stands' },
      text: {
        de: 'Der berühmteste Satz des Buches steht nicht an einer betonten Stelle, sondern mitten in einer Aufzählung: Feldränder stehen lassen, nicht stehlen, den Lohn des Tagelöhners nicht über Nacht behalten, dem Tauben nicht fluchen, dem Blinden nichts in den Weg legen, vor Gericht die Person nicht ansehen – und dann, als Abschluss derselben Reihe, „du sollst deinen Nächsten lieben wie dich selbst". Sechzehn Verse später gilt er dem Fremden mit derselben Formel.',
        en: 'The book\'s most famous sentence does not stand in an emphatic place but in the middle of a list: leave the edges of the field, do not steal, do not keep a day labourer\'s wages overnight, do not curse the deaf, do not put a stumbling block before the blind, do not show partiality in court – and then, closing the same series, "you shall love your neighbor as yourself". Sixteen verses later it covers the foreigner in the same words.',
      },
      source: {
        de: '3. Mose 19,9-18, der Satz in Vers 18; auf den Fremden ausgedehnt in 19,34.',
        en: 'Leviticus 19:9-18, the sentence in verse 18; extended to the foreigner in 19:34.',
      },
    },
  ],
  questions: [
    {
      de: 'Das Buch regelt die Nähe zu Gott bis ins Detail – und erklärt beim fremden Feuer nicht, was falsch war. Was sagt diese Leerstelle?',
      en: 'The book regulates nearness to God down to the detail – and at the strange fire it does not explain what was wrong. What does that gap say?',
    },
    {
      de: 'Dieselbe Heiligkeit gilt am Altar und am Feldrand. Warum stehen Opfervorschriften und ehrliche Waagen in einem Buch?',
      en: 'The same holiness holds at the altar and at the edge of the field. Why do sacrificial rules and honest scales stand in one book?',
    },
    {
      de: 'Unrein ist ein Zustand, kein Vergehen – und fast alles, was unrein macht, gehört zum Leben. Was ändert das an der Art, wie man diese Kapitel liest?',
      en: 'Unclean is a condition, not an offence – and almost everything that makes unclean belongs to life. What does that change about how these chapters are read?',
    },
  ],
};

/* ------------------------------------------------------------------ 4. Mose */

const NUMBERS: Portrait = {
  osis: 'Num',
  hebrew: {
    word: 'בְּמִדְבַּר',
    translit: 'Bemidbar',
    means: {
      de: '„In der Wüste" – das fünfte Wort des ersten Satzes. Der deutsche Name kommt über die griechische Bibel: „Arithmoi", die Zahlen, nach den beiden Volkszählungen.',
      en: '"In the wilderness" – the fifth word of the first sentence. The English name comes via the Greek Bible: "Arithmoi", numbers, after the two censuses.',
    },
  },
  subtitle: {
    de: 'Elf Tagereisen, für die man vierzig Jahre braucht',
    en: 'Eleven days’ journey that takes forty years',
  },
  summary: {
    de: 'Am Sinai steht das Lager in vollkommener Ordnung: gezählt, nach Stämmen aufgestellt, Gott in der Mitte. Dann bricht es auf – und kommt nicht an. Elfmal murrt das Volk, an den Kundschaftern entscheidet sich alles, und eine ganze Generation stirbt unterwegs. Dass das Buch trotzdem am Jordan endet, sagt ausgerechnet ein fremder Wahrsager: Gott ist kein Mensch, dass er lüge.',
    en: 'At Sinai the camp stands in perfect order: counted, arranged by tribes, God in the middle. Then it sets out – and does not arrive. Eleven times the people murmur, everything is decided at the spies, and a whole generation dies on the way. That the book nevertheless ends at the Jordan is said, of all people, by a foreign diviner: God is not a man, that he should lie.',
  },
  heart: {
    de: '4. Mose ist das Buch des Dazwischen. Es beginnt mit der schönsten Ordnung der Bibel – zwölf Stämme in einem Quadrat um ein Zelt, jeder Platz gezählt und benannt – und es endet in einem Lager am Ostufer des Jordan, ohne dass jemand drüben gewesen wäre. Dazwischen liegt eine einzige lange Verweigerung: Essen, Wasser, Führung, Land – an jedem Punkt findet das Volk, in Ägypten sei es besser gewesen. In Kapitel 14 fällt die Entscheidung, und sie ist hart: Diese Generation sieht das Land nicht. Aber das Buch hört dort nicht auf. Es zählt noch einmal, verteilt noch einmal, setzt einen Nachfolger ein und beschreibt Grenzen für ein Land, das niemand betreten hat. Die Frage, die 4. Mose stellt, ist nicht, ob Menschen treu bleiben. Sie tun es nicht. Die Frage ist, ob das reicht, um eine Zusage zu kippen.',
    en: 'Numbers is the book of the in-between. It begins with the most beautiful order in the Bible – twelve tribes in a square around a tent, every place counted and named – and it ends in a camp on the east bank of the Jordan, without anyone having been across. In between lies one long refusal: food, water, leadership, land – at every point the people decide that Egypt was better. In chapter 14 the matter is settled, and harshly: this generation will not see the land. But the book does not stop there. It counts again, allots again, appoints a successor and describes borders for a country nobody has entered. The question Numbers asks is not whether people stay faithful. They do not. The question is whether that is enough to overturn a promise.',
  },
  verse: {
    ref: '4. Mose 23:19',
    refEn: 'Num 23:19',
    de: 'Gott ist nicht ein Mensch, daß er lüge, noch ein Menschenkind, daß ihn etwas gereue.',
    en: 'God is not a man, that he should lie, nor a son of man, that he should repent.',
  },
  facts: {
    chapters: 36,
    verses: 1288,
    places: 138,
    genre: {
      de: 'Erzählung und Gesetz im Wechsel, dazu Listen: zwei Volkszählungen, eine Lagerordnung, ein Reisebericht mit 42 Stationen. Die Erzählungen dazwischen gehören zu den dichtesten der Tora.',
      en: 'Narrative and law in alternation, plus lists: two censuses, a camp order, a travel record with 42 stations. The narratives in between are among the densest in the Torah.',
    },
    scene: {
      de: 'Die Wüste zwischen dem Sinai und dem Jordan – und das ist wörtlich zu nehmen: 138 Ortsnamen in 36 Kapiteln. 3. Mose kam mit vieren aus.',
      en: 'The wilderness between Sinai and the Jordan – and that is meant literally: 138 place names in 36 chapters. Leviticus managed with four.',
    },
    keyword: {
      de: '„Murren" – elfmal, und jedes Mal treibt es die Handlung. Dagegen steht „Gemeinde": 82-mal, das Wort für dieselben Menschen in Ordnung.',
      en: '"Murmur" – eleven times, and every time it drives the plot. Against it stands "congregation": 82 times, the word for the same people in order.',
    },
  },
  movements: [
    {
      id: 'ordnung',
      from: 1,
      to: 10,
      title: { de: 'Ein Lager wie ein Quadrat', en: 'A camp like a square' },
      text: {
        de: 'Elf Monate steht Israel schon am Sinai. Jetzt wird gezählt, nach Stämmen aufgestellt, der Dienst verteilt: drei Stämme an jeder Seite, die Leviten als Ring dazwischen, das Zelt in der Mitte. Dazu der Segen, den die Priester sprechen sollen, und die Wolke, die den Takt vorgibt. Am zwanzigsten Tag des zweiten Monats hebt sie sich – und der Zug setzt sich in Bewegung.',
        en: 'Israel has been at Sinai for eleven months. Now they are counted, arranged by tribes, the service assigned: three tribes on each side, the Levites as a ring between, the tent in the middle. Then the blessing the priests are to speak, and the cloud that sets the pace. On the twentieth day of the second month it lifts – and the column starts to move.',
      },
      turn: {
        de: '„Und so oft sich die Wolke aufhob von der Hütte, so zogen die Kinder Israel" – nicht der Kalender bestimmt den Aufbruch.',
        en: '"Whenever the cloud was taken up from over the Tent, then after that the children of Israel traveled" – it is not the calendar that decides departure.',
      },
      color: '#3a6ea8',
      symbol: 'M3 3h18v18H3zM9 15l3-5 3 5zM9 15h6M12 3v3M12 18v3',
      places: ['Wilderness of Sinai', 'Mount Sinai'],
    },
    {
      id: 'murren',
      from: 11,
      to: 12,
      title: { de: 'Drei Tage später', en: 'Three days later' },
      text: {
        de: 'Der Zug ist drei Tagereisen alt, da fängt es an. Erst ein Feuer am Rand des Lagers, dann die Sehnsucht nach den Fischen, Gurken, Melonen, dem Lauch und dem Knoblauch Ägyptens – Wachteln bis zum Ekel, ein Grab mit dem Namen „Lustgräber". Mose bricht zusammen und sagt, er könne dieses Volk nicht allein tragen; siebzig Älteste bekommen Anteil an seinem Geist. Dann stellen sich seine eigenen Geschwister gegen ihn.',
        en: 'The column is three days old when it starts. First a fire at the edge of the camp, then the longing for the fish, cucumbers, melons, leeks and garlic of Egypt – quail until they are sick of it, a grave named "Graves of Craving". Moses breaks down and says he cannot carry this people alone; seventy elders are given a share of his spirit. Then his own siblings turn against him.',
      },
      turn: {
        de: '„Wollte Gott, daß all das Volk des HERRN weissagte" – Mose wehrt sich nicht gegen die Konkurrenz, er wünscht sie sich.',
        en: '"I wish that all Yahweh’s people were prophets" – Moses does not defend himself against rivals, he wishes for more of them.',
      },
      color: '#b4562f',
      symbol: 'M12 3c1.6 3.5 4.6 4.8 4.6 8.4A4.6 4.6 0 0 1 7.4 12c0-1.8.9-2.9 1.8-3.8.2 1.8 1 2.7 1.8 2.7 0-2.7.5-5.2 1-7.9zM6 20h12',
      places: ['Taberah', 'Kibroth-hattaavah', 'Hazeroth'],
    },
    {
      id: 'kundschafter',
      from: 13,
      to: 14,
      title: { de: 'Vierzig Tage, vierzig Jahre', en: 'Forty days, forty years' },
      text: {
        de: 'Zwölf Männer gehen vierzig Tage lang ins Land und bringen eine Traube mit, die zwei tragen müssen. Zehn von ihnen sagen dasselbe wie die zwei anderen – das Land ist gut – und ziehen den entgegengesetzten Schluss. In der Nacht darauf will das Volk einen Hauptmann wählen und nach Ägypten zurück. Das Urteil rechnet Tag für Tag um: ein Jahr für jeden Tag der Erkundung. Diese Generation sieht das Land nicht mehr.',
        en: 'Twelve men spend forty days in the land and bring back a cluster of grapes that takes two to carry. Ten of them say what the other two say – the land is good – and draw the opposite conclusion. That night the people want to choose a captain and go back to Egypt. The verdict converts day into year: one year for each day of scouting. This generation will not see the land.',
      },
      turn: {
        de: '„Eure Leiber sollen in dieser Wüste verfallen" – gesagt zu denen, die eben noch gezählt worden waren.',
        en: '"Your dead bodies shall fall in this wilderness" – said to the very people who had just been counted.',
      },
      color: '#c98a2b',
      symbol: 'M12 2v4M10 8a2 2 0 1 0 4 0 2 2 0 1 0-4 0M7 13a2 2 0 1 0 4 0 2 2 0 1 0-4 0M13 13a2 2 0 1 0 4 0 2 2 0 1 0-4 0M10 18a2 2 0 1 0 4 0 2 2 0 1 0-4 0',
      places: ['Paran', 'Valley of Eshcol', 'Kadesh-barnea', 'Hormah'],
    },
    {
      id: 'aufstand',
      from: 15,
      to: 19,
      title: { de: 'Wer darf nahe kommen?', en: 'Who may come near?' },
      text: {
        de: 'Korah, ein Levit, bringt 250 Angesehene gegen Mose und Aaron auf, und sein Satz klingt wie aus 3. Mose abgeschrieben: Die ganze Gemeinde ist heilig. Er hat nicht unrecht und trotzdem nicht recht – die Erde tut sich auf. Danach zwei Antworten auf dieselbe Frage: ein Stab, der über Nacht blüht und Mandeln trägt, und die rote Kuh, deren Asche jeden reinigt, der einen Toten berührt hat – und die jeden unrein macht, der sie zubereitet.',
        en: 'Korah, a Levite, raises 250 men of standing against Moses and Aaron, and his line sounds copied out of Leviticus: the whole congregation is holy. He is not wrong and still not right – the earth opens. Then two answers to the same question: a staff that blossoms overnight and bears almonds, and the red heifer whose ashes cleanse everyone who has touched a corpse – and defile everyone who prepares them.',
      },
      turn: {
        de: '„Denn die ganze Gemeinde ist überall heilig … warum erhebt ihr euch über die Gemeinde des HERRN?" – ein richtiger Satz im Dienst einer Machtfrage.',
        en: '"All the congregation are holy … why do you lift yourselves up above Yahweh’s assembly?" – a true sentence in the service of a power struggle.',
      },
      color: '#8e3c6e',
      symbol: 'M3 15h4l2 5 3-11 2 6h7M4 20h16M12 3v3',
      places: ['Kadesh-barnea'],
    },
    {
      id: 'fels',
      from: 20,
      to: 21,
      title: { de: 'Der Fels, die Schlange, und zwei Gräber', en: 'The rock, the serpent, and two graves' },
      text: {
        de: 'Das kürzeste und härteste Stück des Buches. Mirjam stirbt in Kades. Es fehlt Wasser, Mose soll zum Felsen reden und schlägt ihn zweimal – und verliert damit das Land. Edom verweigert den Durchzug. Aaron stirbt auf dem Berg Hor, sein Gewand geht an Eleasar über. Und als Schlangen ins Lager kommen, richtet Mose eine eherne Schlange auf: Wer das ansieht, woran er stirbt, bleibt leben.',
        en: 'The shortest and hardest stretch of the book. Miriam dies at Kadesh. There is no water, Moses is told to speak to the rock and strikes it twice – and so loses the land. Edom refuses passage. Aaron dies on Mount Hor, his garment passing to Eleazar. And when serpents come into the camp, Moses raises a serpent of bronze: whoever looks at the thing he is dying of, lives.',
      },
      turn: {
        de: '„Darum daß ihr nicht an mich geglaubt habt … sollt ihr diese Gemeinde nicht in das Land bringen" – auch für Mose gilt das Urteil von Kapitel 14.',
        en: '"Because you didn’t believe in me … therefore you shall not bring this assembly into the land" – the verdict of chapter 14 applies to Moses too.',
      },
      color: '#2f7f8f',
      symbol: 'M4 20h16M6 20c0-5 2.5-8 6-8s6 3 6 8M12 12V5M10 7l2-2 2 2',
      places: ['Meribah', 'Mount Hor', 'Edom', 'Arnon', 'Heshbon', 'Bashan'],
    },
    {
      id: 'bileam',
      from: 22,
      to: 25,
      title: { de: 'Der Fluch, der nicht kommt', en: 'The curse that never comes' },
      text: {
        de: 'Der König von Moab kauft einen Wahrsager ein, damit er Israel verflucht – und vier Anläufe lang kommt aus Bileams Mund Segen. Israel selbst erfährt davon nichts; das ganze Stück spielt hinter seinem Rücken. Kaum ist es vorbei, tut das Volk in Sittim genau das, was kein Fluch geschafft hätte: Es läuft den Göttern Moabs nach. Was von außen nicht zu erreichen war, geschieht von innen.',
        en: 'The king of Moab hires a diviner to curse Israel – and four times over, what comes out of Balaam’s mouth is blessing. Israel itself learns nothing of it; the whole episode plays out behind its back. Barely is it over when the people at Shittim do exactly what no curse could have managed: they go after the gods of Moab. What could not be achieved from outside happens from within.',
      },
      turn: {
        de: '„Es wird ein Stern aus Jakob aufgehen und ein Zepter aus Israel aufkommen" – der weiteste Blick des Buches, gesprochen von einem, der nicht dazugehört.',
        en: '"A star will come out of Jacob. A scepter will rise out of Israel" – the book’s furthest view, spoken by someone who does not belong to it.',
      },
      color: '#7a5ca8',
      symbol: 'M12 3l2.3 6 6.2.3-4.8 4 1.6 6-5.3-3.5L6.7 19.3l1.6-6L3.5 9.3 9.7 9z',
      places: ['Moab', 'Shittim', 'Peor', 'Midian'],
    },
    {
      id: 'zweite',
      from: 26,
      to: 30,
      title: { de: 'Noch einmal zählen', en: 'Counting again' },
      text: {
        de: 'Vierzig Jahre später dieselbe Prozedur – und der Text sagt ausdrücklich, was der Unterschied ist: Von den zuerst Gezählten ist keiner mehr dabei außer Kaleb und Josua. Dann tritt ein Fall auf, den das Gesetz nicht vorsieht: Fünf Schwestern ohne Bruder fordern das Erbteil ihres Vaters. Mose bringt die Sache vor den HERRN, und das Recht wird geändert. Am Ende bekommt Mose einen Nachfolger, damit die Gemeinde nicht ohne Hirten bleibt.',
        en: 'Forty years later, the same procedure – and the text says expressly what the difference is: of those counted first, not one is left except Caleb and Joshua. Then a case arises that the law does not cover: five sisters with no brother claim their father’s inheritance. Moses brings it before Yahweh, and the law is changed. At the end Moses is given a successor, so that the congregation is not left without a shepherd.',
      },
      turn: {
        de: '„Und blieb keiner übrig als Kaleb, der Sohn Jephunnes, und Josua, der Sohn Nuns." Zwei Namen aus sechshunderttausend.',
        en: '"There was not a man left of them, except Caleb the son of Jephunneh, and Joshua the son of Nun." Two names out of six hundred thousand.',
      },
      color: '#5c8a3a',
      symbol: 'M5 5v14M9 5v14M13 5v14M3 12h12M17 7l3 5-3 5',
      places: ['Moab'],
    },
    {
      id: 'grenzen',
      from: 31,
      to: 36,
      title: { de: 'Grenzen für ein Land, das niemand betreten hat', en: 'Borders for a land nobody has entered' },
      text: {
        de: 'Das Buch endet mit Verwaltung, und das ist die Pointe: Zwei Stämme bekommen Land im Osten, aber nur mit der Auflage, vorher mitzuziehen. Kapitel 33 zählt alle 42 Lagerplätze seit Ägypten auf – die Reiseliste, aus der auch die Route in dieser App gebaut ist. Dann die Grenzen, die Leviten­städte und sechs Freistädte, in die fliehen kann, wer ohne Absicht getötet hat. Der letzte Satz steht im Lager am Jordan, Jericho gegenüber.',
        en: 'The book ends with administration, and that is the point: two tribes get land in the east, but only on condition that they march across first. Chapter 33 lists all 42 camp sites since Egypt – the itinerary this app’s route is built from. Then the borders, the Levitical towns and six cities of refuge, to which anyone who has killed unintentionally can flee. The last sentence stands in the camp by the Jordan, opposite Jericho.',
      },
      turn: {
        de: '„daß sie Freistädte seien, wohin fliehe, wer einen Totschlag unversehens tut" – für ein Land, in dem noch niemand wohnt.',
        en: '"cities of refuge for you, that the man slayer who kills any person unwittingly may flee there" – for a country nobody lives in yet.',
      },
      color: '#a8843a',
      symbol: 'M2 20h20M4 20V9l4-3 4 3v11M14 20v-7h6v7M8 13h1M17 16h1',
      places: ['Jordan', 'Jericho', 'Abel-shittim', 'Midian'],
    },
  ],
  patterns: [
    {
      id: 'zwei',
      title: { de: 'Zwei Zählungen, zwei Generationen', en: 'Two censuses, two generations' },
      text: {
        de: 'Das Buch zählt zweimal, und dazwischen liegen vierzig Jahre. Der zweite Zensus ist keine Wiederholung, sondern ein Nachruf: 603.550 beim ersten Mal, 601.730 beim zweiten – fast dieselbe Zahl, und kein einziger derselben Menschen. Der Text hält das ausdrücklich fest. Das ist der Bauplan von 4. Mose: Die Zusage bleibt, die Generation wird ausgewechselt.',
        en: 'The book counts twice, and forty years lie in between. The second census is not a repetition but an obituary: 603,550 the first time, 601,730 the second – almost the same figure, and not one of the same people. The text says so expressly. That is the blueprint of Numbers: the promise stands, the generation is replaced.',
      },
      movements: ['ordnung', 'zweite'],
      refs: ['4. Mose 1:46', '4. Mose 26:51', '4. Mose 26:65'],
      color: '#7fe3d5',
    },
    {
      id: 'murren',
      title: { de: 'Elfmal murrt das Volk', en: 'Eleven times the people murmur' },
      text: {
        de: 'Das Wort steht elfmal im Buch, und es folgt immer demselben Muster: ein Mangel, eine Erinnerung an Ägypten, eine Anklage gegen Mose, ein Eingreifen Gottes. Sogar die Aufständischen benutzen es: Korahs Vorwurf ist theologisch korrekt und dient trotzdem nur ihm selbst. Was das Buch beschreibt, ist keine Bosheit, sondern Erschöpfung – und die Frage, ob Erschöpfung eine Zusage aushebelt.',
        en: 'The word occurs eleven times in the book, and it always follows the same pattern: a lack, a memory of Egypt, an accusation against Moses, an intervention by God. Even the rebels use it: Korah’s charge is theologically correct and still serves only himself. What the book describes is not malice but exhaustion – and the question whether exhaustion can undo a promise.',
      },
      movements: ['murren', 'kundschafter', 'aufstand', 'fels'],
      refs: ['4. Mose 11:1', '4. Mose 14:29', '4. Mose 16:3', '4. Mose 21:5'],
      color: '#d96b5a',
    },
    {
      id: 'trotzdem',
      title: { de: 'Er hält es trotzdem', en: 'He keeps it anyway' },
      text: {
        de: 'Gegen die Kette der Weigerungen läuft eine zweite Linie, und sie wird nie unterbrochen: der Segen in Kapitel 6, die Wolke, die weiterführt, der gekaufte Fluch, der sich in Segen verkehrt, die zweite Zählung, die Grenzen am Ende. Der Satz, der das ausspricht, steht nicht im Mund eines Israeliten, sondern in dem eines bezahlten Wahrsagers – und genau deshalb fällt er auf.',
        en: 'Against the chain of refusals runs a second line, and it is never broken: the blessing in chapter 6, the cloud that leads on, the bought curse that turns into blessing, the second census, the borders at the end. The sentence that states it stands not in the mouth of an Israelite but in that of a paid diviner – and that is exactly why it registers.',
      },
      movements: ['ordnung', 'bileam', 'zweite', 'grenzen'],
      refs: ['4. Mose 6:27', '4. Mose 23:19', '4. Mose 26:65', '4. Mose 36:13'],
      color: '#e0a449',
    },
  ],
  figures: [
    {
      id: 'mose',
      de: 'Mose',
      en: 'Moses',
      meaning: {
        de: 'Hier steht der Satz über ihn, den er kaum selbst geschrieben haben kann: der geplagteste Mensch auf Erden.',
        en: 'Here stands the sentence about him he can hardly have written himself: the humblest man on earth.',
      },
      who: {
        de: 'In diesem Buch wird Mose müde. Er trägt Beschwerden, Aufstände, den Tod seiner Geschwister – und sagt einmal rundheraus, er könne nicht mehr. Siebzig Älteste bekommen Anteil an seinem Geist; als zwei davon im Lager weissagen, freut er sich darüber.',
        en: 'In this book Moses grows tired. He carries complaints, revolts, the death of his siblings – and once says outright that he cannot go on. Seventy elders are given a share of his spirit; when two of them prophesy in the camp, he is glad of it.',
      },
      turn: {
        de: 'Am Felsen von Meriba soll er reden und schlägt zweimal zu. Der Text erklärt nicht viel, das Urteil ist dasselbe wie für alle anderen: Er sieht das Land, er betritt es nicht.',
        en: 'At the rock of Meribah he is to speak, and strikes twice. The text explains little; the verdict is the same as for everyone else: he sees the land, he does not enter it.',
      },
      ref: '4. Mose 12:3',
      from: 1,
      to: 36,
      person: 'mose',
      place: 'Meribah',
    },
    {
      id: 'mirjam',
      de: 'Mirjam',
      en: 'Miriam',
      meaning: {
        de: 'Die Schwester, die ihn am Nil bewacht hat – und die als Einzige beider Geschwister bestraft wird.',
        en: 'The sister who watched over him at the Nile – and the only one of the two siblings to be punished.',
      },
      who: {
        de: 'Sie und Aaron stellen Moses Sonderstellung infrage: Redet der HERR allein durch ihn? Die Antwort kommt sofort, und sie trifft nur Mirjam: sieben Tage aussätzig, sieben Tage vor dem Lager. Das Volk bricht nicht auf, bis sie zurück ist.',
        en: 'She and Aaron question Moses’ special standing: does Yahweh speak only through him? The answer comes at once, and it falls on Miriam alone: seven days leprous, seven days outside the camp. The people do not move on until she is back.',
      },
      turn: {
        de: 'Ihr Tod in Kades steht in einem einzigen Vers, und im nächsten fehlt Wasser. Die jüdische Auslegung hat darin einen Zusammenhang gesehen und vom „Brunnen Mirjams" gesprochen.',
        en: 'Her death at Kadesh takes a single verse, and in the next there is no water. Jewish interpretation has read a connection there and spoken of "Miriam’s well".',
      },
      ref: '4. Mose 12:1-15',
      from: 12,
      to: 20,
      person: 'mirjam',
      place: 'Hazeroth',
    },
    {
      id: 'aaron',
      de: 'Aaron',
      en: 'Aaron',
      meaning: {
        de: 'Der Hohepriester, dessen Stab über Nacht blüht – und der dasselbe Urteil bekommt wie sein Bruder.',
        en: 'The high priest whose staff blossoms overnight – and who receives the same verdict as his brother.',
      },
      who: {
        de: 'Zweimal steht er zwischen Gott und dem Volk und hält die Plage auf, einmal mit der Räucherpfanne mitten unter den Toten. Und zweimal steht er auf der falschen Seite: bei Mirjams Vorwurf und am Felsen von Meriba.',
        en: 'Twice he stands between God and the people and stops the plague, once with a censer in the middle of the dead. And twice he stands on the wrong side: at Miriam’s complaint and at the rock of Meribah.',
      },
      turn: {
        de: 'Er stirbt auf dem Berg Hor, und der Text datiert es genau: im vierzigsten Jahr nach dem Auszug, am ersten Tag des fünften Monats. Sein Gewand zieht Eleasar an, noch auf dem Berg.',
        en: 'He dies on Mount Hor, and the text dates it precisely: in the fortieth year after the exodus, on the first day of the fifth month. Eleazar puts on his garment, still on the mountain.',
      },
      ref: '4. Mose 20:22-29',
      from: 1,
      to: 20,
      person: 'aaron',
      place: 'Mount Hor',
    },
    {
      id: 'josuakaleb',
      de: 'Josua und Kaleb',
      en: 'Joshua and Caleb',
      meaning: {
        de: '„Der HERR rettet" und „Hund" – zwei von zwölf Kundschaftern, und die einzigen zwei, die den Jordan überqueren werden.',
        en: '"Yahweh saves" and "dog" – two of twelve spies, and the only two who will cross the Jordan.',
      },
      who: {
        de: 'Sie sehen dasselbe wie die anderen zehn: befestigte Städte, große Menschen, gutes Land. Sie widersprechen nicht dem Bericht, sondern dem Schluss daraus – und wären dafür beinahe gesteinigt worden.',
        en: 'They see the same as the other ten: fortified cities, large people, good land. They do not contradict the report but the conclusion drawn from it – and are nearly stoned for it.',
      },
      turn: {
        de: 'Vierzig Jahre später nennt die zweite Zählung ihre beiden Namen als die Ausnahme von einer ganzen Generation. Josua wird am Ende vor der Gemeinde eingesetzt, damit sie nicht ohne Hirten bleibt.',
        en: 'Forty years later the second census names the two of them as the exception to a whole generation. At the end Joshua is commissioned before the congregation, so that it is not left without a shepherd.',
      },
      ref: '4. Mose 13:30, 14:6-9, 26:65',
      from: 13,
      to: 27,
      person: 'josua',
      place: 'Valley of Eshcol',
    },
    {
      id: 'korah',
      de: 'Korah',
      en: 'Korah',
      meaning: {
        de: 'Ein Levit – also einer, der ohnehin am Heiligtum dient. Der Aufstand kommt nicht von außen.',
        en: 'A Levite – that is, someone who already serves at the sanctuary. The revolt does not come from outside.',
      },
      who: {
        de: 'Mit Datan, Abiram und 250 Männern von Namen tritt er gegen Mose und Aaron an. Sein Argument ist ein Zitat: Die ganze Gemeinde ist heilig, und der HERR ist unter ihnen.',
        en: 'With Dathan, Abiram and 250 men of repute he confronts Moses and Aaron. His argument is a quotation: the whole congregation is holy, and Yahweh is among them.',
      },
      turn: {
        de: 'Der Satz stimmt – und wird zum Hebel für etwas anderes. Bemerkenswert am Ende: Seine Söhne sterben nicht mit ihm, und elf Psalmen tragen später die Überschrift „von den Kindern Korah".',
        en: 'The sentence is true – and becomes a lever for something else. Remarkable at the end: his sons do not die with him, and eleven psalms later carry the heading "of the sons of Korah".',
      },
      ref: '4. Mose 16',
      from: 16,
      to: 17,
    },
    {
      id: 'bileam',
      de: 'Bileam',
      en: 'Balaam',
      meaning: {
        de: 'Ein Wahrsager aus Petor am Euphrat, kein Israelit – und der Einzige im Buch, der Israel von außen sieht.',
        en: 'A diviner from Pethor on the Euphrates, not an Israelite – and the only one in the book who sees Israel from outside.',
      },
      who: {
        de: 'Balak, der König von Moab, bezahlt ihn dafür, Israel zu verfluchen. Unterwegs sieht seine Eselin den Engel, den er nicht sieht, und bekommt dafür Schläge; dann redet sie. Es ist die einzige Szene der Bibel, in der ein Tier eine Auseinandersetzung gewinnt.',
        en: 'Balak, king of Moab, pays him to curse Israel. On the way his donkey sees the angel he does not see, and is beaten for it; then she speaks. It is the only scene in the Bible in which an animal wins an argument.',
      },
      turn: {
        de: 'Viermal setzt er an, viermal kommt Segen heraus, beim letzten Mal der Stern aus Jakob. Und trotzdem ist das nicht das letzte Wort über ihn: 4. Mose 31,16 macht ihn für Baal-Peor verantwortlich.',
        en: 'Four times he begins, four times blessing comes out, the last time the star out of Jacob. And still that is not the last word on him: Numbers 31:16 holds him responsible for Baal-Peor.',
      },
      ref: '4. Mose 22-24',
      from: 22,
      to: 24,
      place: 'Peor',
    },
    {
      id: 'toechter',
      de: 'Die Töchter Zelophehads',
      en: 'The daughters of Zelophehad',
      meaning: {
        de: 'Mahela, Noa, Hogla, Milka und Thirza – fünf Namen, die der Text vollständig nennt, zweimal.',
        en: 'Mahlah, Noah, Hoglah, Milcah and Tirzah – five names the text gives in full, twice.',
      },
      who: {
        de: 'Ihr Vater ist in der Wüste gestorben, ohne Sohn. Nach geltendem Recht verfällt sein Anteil. Sie treten vor Mose, den Priester und die ganze Gemeinde und sagen: Warum soll der Name unseres Vaters verschwinden?',
        en: 'Their father died in the wilderness, without a son. Under the law as it stands, his share lapses. They come before Moses, the priest and the whole congregation and say: why should our father’s name disappear?',
      },
      turn: {
        de: 'Mose entscheidet nicht selbst, sondern legt die Sache vor – und die Antwort gibt ihnen recht und ändert das Gesetz. In Kapitel 36 kommt der Fall noch einmal, mit einer Einschränkung; beide Male steht der Vorgang im Text, nicht nur das Ergebnis.',
        en: 'Moses does not decide himself but brings the case forward – and the answer finds for them and changes the law. In chapter 36 the case returns with a qualification; both times the process is in the text, not just the outcome.',
      },
      ref: '4. Mose 27:1-11',
      from: 26,
      to: 36,
    },
  ],
  beats: [
    {
      id: 'zaehlung',
      chapter: 1,
      label: { de: 'Erster Tag des zweiten Monats', en: 'First day of the second month' },
      when: { de: 'Im zweiten Jahr nach dem Auszug', en: 'In the second year after the exodus' },
      note: {
        de: 'Der erste Satz datiert sich selbst. Einen Monat vorher war die Wohnung aufgerichtet worden (2. Mose 40,17), dazwischen liegt das ganze Buch 3. Mose. Jetzt wird gezählt.',
        en: 'The first sentence dates itself. A month earlier the dwelling had been raised (Exodus 40:17); the whole book of Leviticus lies in between. Now they are counted.',
      },
    },
    {
      id: 'aufbruch',
      chapter: 10,
      label: { de: 'Der zwanzigste Tag', en: 'The twentieth day' },
      when: { de: 'Achtzehn Tage nach der Zählung', en: 'Eighteen days after the census' },
      note: {
        de: 'Die Wolke hebt sich von der Wohnung, und Israel bricht vom Sinai auf – nach fast einem Jahr am selben Ort. Bis Kades-Barnea wären es elf Tagereisen (5. Mose 1,2).',
        en: 'The cloud lifts from the dwelling and Israel departs from Sinai – after almost a year in the same place. To Kadesh-barnea it would be eleven days’ journey (Deuteronomy 1:2).',
      },
    },
    {
      id: 'kundschafter',
      chapter: 13,
      label: { de: 'Vierzig Tage im Land', en: 'Forty days in the land' },
      when: { de: 'Zur Zeit der ersten Trauben', en: 'At the time of the first ripe grapes' },
      note: {
        de: 'Der Text merkt die Jahreszeit an – Frühsommer. Aus diesen vierzig Tagen werden im Urteil vierzig Jahre: „je ein Tag soll ein Jahr gelten".',
        en: 'The text notes the season – early summer. Out of these forty days the verdict makes forty years: "for every day a year".',
      },
    },
    {
      id: 'wueste',
      chapter: 20,
      label: { de: 'Das vierzigste Jahr', en: 'The fortieth year' },
      when: { de: 'Mirjam stirbt, Aaron stirbt', en: 'Miriam dies, Aaron dies' },
      note: {
        de: 'Zwischen Kapitel 19 und 20 liegen fast vierzig Jahre, über die das Buch nichts erzählt. Die einzige feste Datierung dieser Zeit steht in der Reiseliste: Aarons Tod am ersten Tag des fünften Monats im vierzigsten Jahr (4. Mose 33,38).',
        en: 'Between chapters 19 and 20 lie almost forty years about which the book says nothing. The one firm date for that time stands in the itinerary: Aaron’s death on the first day of the fifth month of the fortieth year (Numbers 33:38).',
      },
    },
    {
      id: 'zweitezaehlung',
      chapter: 26,
      label: { de: 'Die zweite Zählung', en: 'The second census' },
      when: { de: 'Im Gefilde der Moabiter', en: 'In the plains of Moab' },
      note: {
        de: 'Dieselbe Prozedur wie in Kapitel 1, fast dieselbe Zahl – und ausdrücklich niemand derselbe. Erst hier ist das Urteil von Kapitel 14 wirklich vollzogen.',
        en: 'The same procedure as in chapter 1, almost the same figure – and expressly not one of the same people. Only here is the verdict of chapter 14 actually carried out.',
      },
    },
    {
      id: 'stationen',
      chapter: 33,
      label: { de: '42 Lagerplätze', en: '42 camp sites' },
      when: { de: 'Der ganze Weg noch einmal, rückblickend', en: 'The whole way once more, in retrospect' },
      note: {
        de: 'Mose schreibt die Stationen auf, von Ramses bis an den Jordan. Diese Liste ist die Grundlage der Route, die der Modus „Der Weg" in dieser App zeichnet – nicht eine Rekonstruktion, sondern der Text selbst.',
        en: 'Moses writes down the stations, from Rameses to the Jordan. This list is the basis of the route the "The Way" mode draws in this app – not a reconstruction but the text itself.',
      },
    },
    {
      id: 'ende',
      chapter: 36,
      label: { de: 'Am Jordan, Jericho gegenüber', en: 'By the Jordan, opposite Jericho' },
      when: { de: 'Der letzte Satz des Buches', en: 'The book’s last sentence' },
      note: {
        de: 'Israel steht am Ostufer und geht nicht hinüber – das tut es erst im Buch Josua. Dazwischen liegt noch 5. Mose, und das ist eine einzige lange Rede an derselben Stelle.',
        en: 'Israel stands on the east bank and does not cross – that happens only in the book of Joshua. Deuteronomy still lies in between, and it is one long speech in the same spot.',
      },
    },
  ],
  traces: [
    {
      id: 'schlange',
      title: { de: 'Die Schlange, die man ansieht', en: 'The serpent you look at' },
      seed: {
        ref: '4. Mose 21:9',
        refEn: 'Num 21:9',
        de: 'Da machte Mose eine eherne Schlange und richtete sie auf zum Zeichen; und wenn jemanden eine Schlange biß, so sah er die eherne Schlange an und blieb leben.',
        en: 'Moses made a serpent of brass, and set it on the pole. If a serpent had bitten any man, when he looked at the serpent of brass, he lived.',
      },
      echo: {
        ref: 'Johannes 3:14',
        refEn: 'John 3:14',
        de: 'Und wie Mose in der Wüste eine Schlange erhöht hat, also muß des Menschen Sohn erhöht werden,',
        en: 'As Moses lifted up the serpent in the wilderness, even so must the Son of Man be lifted up,',
      },
      text: {
        de: 'Der deutlichste Verweis des Neuen Testaments auf dieses Buch, und Jesus macht ihn selbst. Das Merkwürdige bleibt stehen: Zu sehen ist nicht die Rettung, sondern das, woran man stirbt. Die eherne Schlange hat übrigens eine Nachgeschichte – Hiskia zerschlägt sie, weil man ihr geräuchert hatte (2. Könige 18,4).',
        en: 'The clearest reference in the New Testament to this book, and Jesus makes it himself. The strangeness stays: what you look at is not the rescue but the thing you are dying of. The bronze serpent has an afterlife too – Hezekiah smashes it, because people had been burning incense to it (2 Kings 18:4).',
      },
    },
    {
      id: 'treu',
      title: { de: 'Treu im ganzen Haus', en: 'Faithful in all the house' },
      seed: {
        ref: '4. Mose 12:7',
        refEn: 'Num 12:7',
        de: 'Aber nicht also mein Knecht Mose, der in meinem ganzen Hause treu ist.',
        en: 'My servant Moses is not so. He is faithful in all my house.',
      },
      echo: {
        ref: 'Hebräer 3:5',
        refEn: 'Heb 3:5',
        de: 'Und Mose war zwar treu in seinem ganzen Hause als ein Knecht, zum Zeugnis des, das gesagt sollte werden,',
        en: 'Moses indeed was faithful in all his house as a servant, for a testimony of those things which were afterward to be spoken,',
      },
      text: {
        de: 'Der Hebräerbrief nimmt das Lob auf Mose wörtlich auf und setzt ein einziges Wort dagegen: als Knecht. Das Argument lebt davon, dass die Stelle in 4. Mose ein Lob ist – es wird nicht bestritten, sondern eingeordnet.',
        en: 'Hebrews takes up the praise of Moses word for word and sets a single word against it: as a servant. The argument works precisely because the passage in Numbers is praise – it is not denied but placed.',
      },
    },
    {
      id: 'hirte',
      title: { de: 'Schafe ohne Hirten', en: 'Sheep without a shepherd' },
      seed: {
        ref: '4. Mose 27:17',
        refEn: 'Num 27:17',
        de: 'daß die Gemeinde des HERRN nicht sei wie die Schafe ohne Hirten.',
        en: 'that the congregation of Yahweh may not be as sheep which have no shepherd.',
      },
      echo: {
        ref: 'Markus 6:34',
        refEn: 'Mark 6:34',
        de: 'denn sie waren wie die Schafe, die keinen Hirten haben; und er fing an eine lange Predigt.',
        en: 'because they were like sheep without a shepherd, and he began to teach them many things.',
      },
      text: {
        de: 'Moses letzte Bitte ist keine für sich selbst: Er bittet um einen Nachfolger. Die Wendung, die er dabei gebraucht, steht bei Markus über einer Menge am See – und die Antwort dort ist dieselbe wie hier, nur anders verteilt: Es wird jemand eingesetzt, der vorangeht.',
        en: 'Moses’ last request is not for himself: he asks for a successor. The phrase he uses stands in Mark over a crowd by the lake – and the answer there is the same as here, only differently distributed: someone is appointed who goes ahead.',
      },
    },
    {
      id: 'stern',
      title: { de: 'Ein Stern aus Jakob', en: 'A star out of Jacob' },
      seed: {
        ref: '4. Mose 24:17',
        refEn: 'Num 24:17',
        de: 'Es wird ein Stern aus Jakob aufgehen und ein Zepter aus Israel aufkommen',
        en: 'A star will come out of Jacob. A scepter will rise out of Israel,',
      },
      echo: {
        ref: 'Matthäus 2:2',
        refEn: 'Matt 2:2',
        de: 'Wo ist der neugeborene König der Juden? Wir haben seinen Stern gesehen im Morgenland und sind gekommen, ihn anzubeten.',
        en: 'Where is he who is born King of the Jews? For we saw his star in the east, and have come to worship him.',
      },
      text: {
        de: 'Hier ist Vorsicht geboten: Matthäus zitiert diese Stelle nicht. Dass der Satz messianisch gelesen wurde, steht aber fest, und zwar lange vorher – in Qumran und später bei Rabbi Akiba, der Simon bar Kosiba deswegen „Bar Kochba", Sternensohn, nannte. Die Sterndeuter kommen zudem aus derselben Richtung wie Bileam: aus dem Osten.',
        en: 'Caution is needed here: Matthew does not quote this passage. That the line was read messianically is certain, though, and long before – at Qumran, and later by Rabbi Akiva, who for this reason called Simon bar Kosiba "Bar Kokhba", son of the star. The magi also come from the same direction as Balaam: from the east.',
      },
    },
    {
      id: 'wueste',
      title: { de: 'Die Wüstengeneration als Warnung', en: 'The wilderness generation as a warning' },
      seed: {
        ref: '4. Mose 14:29',
        refEn: 'Num 14:29',
        de: 'Eure Leiber sollen in dieser Wüste verfallen;',
        en: 'Your dead bodies shall fall in this wilderness;',
      },
      echo: {
        ref: '1. Korinther 10:5',
        refEn: '1Cor 10:5',
        de: 'Aber an ihrer vielen hatte Gott kein Wohlgefallen; denn sie wurden niedergeschlagen in der Wüste.',
        en: 'However with most of them, God was not well pleased, for they were overthrown in the wilderness.',
      },
      text: {
        de: 'Paulus geht in 1. Korinther 10 die Stationen dieses Buches durch – Wolke, Meer, Felsen, Baal-Peor, die Schlangen, das Murren – und zieht daraus keinen historischen, sondern einen gegenwärtigen Schluss: „uns zur Warnung". Kein Kapitel der Bibel benutzt 4. Mose so dicht wie dieses.',
        en: 'In 1 Corinthians 10 Paul goes through the stations of this book – cloud, sea, rock, Baal-Peor, the serpents, the murmuring – and draws from them not a historical but a present conclusion: "for our admonition". No chapter of the Bible uses Numbers as densely as this one.',
      },
    },
    {
      id: 'fels',
      title: { de: 'Der Fels, der mitging', en: 'The rock that went with them' },
      seed: {
        ref: '4. Mose 20:11',
        refEn: 'Num 20:11',
        de: 'Und Mose hob seine Hand auf und schlug den Fels mit dem Stab zweimal. Da ging viel Wasser heraus, daß die Gemeinde trank und ihr Vieh.',
        en: 'Moses lifted up his hand, and struck the rock with his rod twice, and water came out abundantly. The congregation and their livestock drank.',
      },
      echo: {
        ref: '1. Korinther 10:4',
        refEn: '1Cor 10:4',
        de: 'sie tranken aber vom geistlichen Fels, der mitfolgte, welcher war Christus.',
        en: 'For they drank of a spiritual rock that followed them, and the rock was Christ.',
      },
      text: {
        de: 'Zweimal kommt in der Tora Wasser aus einem Felsen: am Anfang der Wüstenzeit (2. Mose 17) und fast vierzig Jahre später hier. Paulus liest beide Stellen zusammen und nennt den Felsen einen, der mitging – eine Deutung, die er nicht aus dem Wortlaut nimmt, sondern ausdrücklich dazu sagt.',
        en: 'Twice in the Torah water comes out of a rock: at the beginning of the wilderness years (Exodus 17) and almost forty years later here. Paul reads the two together and calls the rock one that went with them – a reading he does not take from the wording but states expressly as his own.',
      },
    },
    {
      id: 'zuflucht',
      title: { de: 'Sechs Städte für den Notfall', en: 'Six cities for the emergency' },
      seed: {
        ref: '4. Mose 35:11',
        refEn: 'Num 35:11',
        de: 'sollt ihr Städte auswählen, daß sie Freistädte seien, wohin fliehe, wer einen Totschlag unversehens tut.',
        en: 'then you shall appoint for yourselves cities to be cities of refuge for you, that the man slayer who kills any person unwittingly may flee there.',
      },
      echo: {
        ref: 'Hebräer 6:18',
        refEn: 'Heb 6:18',
        de: 'einen starken Trost hätten, die wir Zuflucht haben und halten an der angebotenen Hoffnung,',
        en: 'we may have a strong encouragement, who have fled for refuge to take hold of the hope set before us.',
      },
      text: {
        de: 'Die Freistädte sind kein Straferlass, sondern eine Unterbrechung: Wer ohne Absicht getötet hat, bekommt Zeit und ein Verfahren, bevor die Blutrache greift. Der Hebräerbrief gebraucht dasselbe Bild – hingeflohen zu sein – für die Hoffnung. Zitiert wird die Stelle nicht; das Bild ist vorausgesetzt.',
        en: 'The cities of refuge are not an amnesty but an interruption: whoever has killed unintentionally is given time and a procedure before blood vengeance takes hold. Hebrews uses the same image – having fled for refuge – for hope. The passage is not quoted; the image is assumed.',
      },
    },
    {
      id: 'segen',
      title: { de: 'Erhobene Hände', en: 'Lifted hands' },
      seed: {
        ref: '4. Mose 6',
        refEn: 'Num 6',
        de: 'Der HERR segne dich und behüte dich; der HERR lasse sein Angesicht leuchten über dir und sei dir gnädig; der HERR hebe sein Angesicht über dich und gebe dir Frieden.',
        en: 'Yahweh bless you, and keep you. Yahweh make his face to shine on you, and be gracious to you. Yahweh lift up his face toward you, and give you peace.',
      },
      echo: {
        ref: 'Lukas 24:50',
        refEn: 'Luke 24:50',
        de: 'Er führte sie aber hinaus bis gen Bethanien und hob die Hände auf und segnete sie.',
        en: 'He led them out as far as Bethany, and he lifted up his hands, and blessed them.',
      },
      text: {
        de: 'Lukas zitiert den Segen nicht, er beschreibt eine Geste – und es ist die des Priesters. Das letzte, was die Jünger sehen, ist jemand mit erhobenen Händen. Wer diese drei Zeilen kennt, hört an der Stelle mehr als „er verabschiedete sich".',
        en: 'Luke does not quote the blessing, he describes a gesture – and it is the priest’s. The last thing the disciples see is someone with lifted hands. Whoever knows these three lines hears more at that point than "he said goodbye".',
      },
    },
  ],
  deepen: [
    {
      id: 'namen',
      title: { de: 'Zwei Namen, zwei Lesarten', en: 'Two names, two readings' },
      text: {
        de: 'Auf Hebräisch heißt das Buch „Bemidbar" – in der Wüste, nach dem fünften Wort des ersten Satzes. Der Name, den wir benutzen, kommt aus der griechischen Übersetzung: „Arithmoi", Zahlen, nach den beiden Volkszählungen. Die beiden Namen betonen verschiedene Dinge, und beide stehen im Buch: Der griechische sieht die Listen, der hebräische den Ort. Wer das Buch als Zahlenwerk erwartet, wird von den Erzählungen überrascht – und umgekehrt.',
        en: 'In Hebrew the book is called "Bemidbar" – in the wilderness, after the fifth word of its first sentence. The name we use comes from the Greek translation: "Arithmoi", numbers, after the two censuses. The two names stress different things, and both are in the book: the Greek sees the lists, the Hebrew the place. Anyone expecting a book of figures is surprised by the narratives – and the other way round.',
      },
      source: {
        de: '4. Mose 1,1 („in der Wüste Sinai"); der Titel Ἀριθμοί in der Septuaginta, von dort über die Vulgata („Numeri") in die deutschen Bibeln.',
        en: 'Numbers 1:1 ("in the wilderness of Sinai"); the title Ἀριθμοί in the Septuagint, and from there via the Vulgate ("Numeri") into English Bibles.',
      },
    },
    {
      id: 'silber',
      title: { de: 'Der älteste Bibeltext ist aus diesem Buch', en: 'The oldest biblical text comes from this book' },
      text: {
        de: '1979 fand Gabriel Barkay in einer Grabkammer am Hinnomtal in Jerusalem zwei winzige Silberröllchen. Es dauerte drei Jahre, sie zu entrollen, ohne sie zu zerstören. Auf den hauchdünnen Blechen steht der Priestersegen aus 4. Mose 6,24–26 – vierhundert Jahre älter als die Rollen von Qumran und damit der älteste bekannte Bibeltext überhaupt. Was er belegt, ist genau abgegrenzt: dass diese Formel vor dem Exil in Umlauf war. Nicht, dass das Buch damals schon so dastand wie heute.',
        en: 'In 1979 Gabriel Barkay found two tiny silver scrolls in a burial chamber by the Hinnom valley in Jerusalem. It took three years to unroll them without destroying them. On the wafer-thin sheets stands the priestly blessing of Numbers 6:24–26 – four hundred years older than the Qumran scrolls and so the oldest known biblical text of any kind. What it proves is precisely bounded: that this formula was in circulation before the exile. Not that the book then stood as it stands today.',
      },
      source: {
        de: 'Ketef Hinnom, Jerusalem, 1979; heute im Israel-Museum. Im Bücherregal dieser App steht der Fund ausführlich.',
        en: 'Ketef Hinnom, Jerusalem, 1979; today in the Israel Museum. The find is described at length in this app’s shelf of discoveries.',
      },
    },
    {
      id: 'zahlen',
      title: { de: 'Die Zahl, an der sich die Forschung reibt', en: 'The figure scholarship keeps arguing about' },
      text: {
        de: '603.550 wehrfähige Männer bei der ersten Zählung, 601.730 bei der zweiten – mit Frauen und Kindern also weit über zwei Millionen Menschen in einer Wüste, in der heute niemand lebt. Das ist seit Langem ein Problem, und es hat eine sprachliche Spur: Das hebräische Wort ’elef heißt „tausend", kann aber auch eine Sippe oder eine Truppeneinheit bezeichnen. Wer es so liest, kommt auf Größenordnungen von einigen Tausend. Eine Lösung ist das nicht – die Endsummen im Text sind ausdrücklich als Tausender addiert. Aber es ist der Grund, warum die Frage offen ist und nicht bloß peinlich.',
        en: '603,550 fighting men in the first census, 601,730 in the second – with women and children, well over two million people in a desert where nobody lives today. This has long been a problem, and it has a linguistic trace: the Hebrew word ’elef means "thousand" but can also denote a clan or a military unit. Read that way, the orders of magnitude come down to a few thousand. That is not a solution – the totals in the text are expressly added up as thousands. But it is why the question is open rather than merely embarrassing.',
      },
      source: {
        de: '4. Mose 1,46 und 26,51; zur Doppelbedeutung von ’elef etwa Richter 6,15, wo dasselbe Wort Gideons Sippe meint.',
        en: 'Numbers 1:46 and 26:51; on the double meaning of ’elef see for instance Judges 6:15, where the same word means Gideon’s clan.',
      },
    },
    {
      id: 'deiralla',
      title: { de: 'Bileam steht auch außerhalb der Bibel', en: 'Balaam appears outside the Bible too' },
      text: {
        de: '1967 kam in Deir Alla im Jordantal ein Text zutage, der nicht auf Papyrus oder Ton stand, sondern in roter und schwarzer Tinte auf Wandputz. Er beginnt mit den Worten „Buch des Bileam, Sohn des Beor, eines Sehers der Götter" – und erzählt eine Nachtvision, die nichts mit 4. Mose zu tun hat. Die Inschrift stammt aus der Zeit um 800 v. Chr. und ist damit jünger als die erzählte Zeit, aber unabhängig von der Bibel. Sie belegt nicht, dass die Geschichte in 4. Mose 22–24 so passiert ist. Sie belegt, dass diese Figur in der Region bekannt war, außerhalb Israels und in einer anderen Sprache.',
        en: 'In 1967 a text came to light at Deir Alla in the Jordan valley, written not on papyrus or clay but in red and black ink on wall plaster. It begins with the words "Book of Balaam, son of Beor, a seer of the gods" – and tells a night vision that has nothing to do with Numbers. The inscription dates from around 800 BC, later than the time it narrates but independent of the Bible. It does not prove that the story in Numbers 22–24 happened as told. It proves that this figure was known in the region, outside Israel and in another language.',
      },
      source: {
        de: 'Die Bileam-Inschrift von Deir Alla, gefunden 1967, heute im Archäologischen Museum von Amman.',
        en: 'The Balaam inscription of Deir Alla, found in 1967, today in the Archaeological Museum of Amman.',
      },
    },
    {
      id: 'stationen',
      title: { de: 'Die Liste, aus der die Karte gebaut ist', en: 'The list the map is built from' },
      text: {
        de: 'Kapitel 33 zählt 42 Lagerplätze auf, von Ramses bis in die Ebene von Moab, und sagt dazu ausdrücklich, dass Mose sie aufgeschrieben habe. Etwa die Hälfte dieser Namen lässt sich heute nicht mehr auf der Karte verorten – deshalb zeichnet der Modus „Der Weg" in dieser App auch nicht eine gesicherte Route, sondern die Stationen, die identifizierbar sind, und sagt bei den übrigen, dass sie unbekannt sind. Die Liste ist der einzige zusammenhängende Reisebericht der Tora.',
        en: 'Chapter 33 lists 42 camp sites, from Rameses to the plains of Moab, and expressly says that Moses wrote them down. About half of these names can no longer be located on a map – which is why the "The Way" mode in this app does not draw a certain route but the stations that can be identified, and says of the rest that they are unknown. The list is the Torah’s only continuous travel record.',
      },
      source: {
        de: '4. Mose 33,1-49; die Datierung von Aarons Tod in 33,38 ist die einzige Jahresangabe der Wüstenzeit.',
        en: 'Numbers 33:1-49; the dating of Aaron’s death in 33:38 is the only year given for the wilderness period.',
      },
    },
    {
      id: 'toechter',
      title: { de: 'Ein Gesetz, das auf Einspruch geändert wird', en: 'A law changed on appeal' },
      text: {
        de: 'Fünf Schwestern legen Widerspruch gegen das geltende Erbrecht ein, und sie gewinnen. Bemerkenswert ist nicht nur das Ergebnis, sondern das Verfahren: Mose entscheidet nicht selbst, sondern bringt den Fall vor – und die Antwort beginnt mit dem Satz, dass die Töchter recht reden. Neun Kapitel später kommt der Einwand der Gegenseite, ihre Sippe könnte Land verlieren, und das Recht wird noch einmal nachjustiert. Beide Runden stehen im Text. Ein Gesetzbuch, das den Streit um seine eigenen Regeln mitüberliefert, ist im Alten Orient nicht selbstverständlich.',
        en: 'Five sisters lodge an objection to the inheritance law as it stands, and they win. What is remarkable is not only the outcome but the procedure: Moses does not decide himself but brings the case forward – and the answer begins by saying the daughters speak rightly. Nine chapters later the counter-objection arrives, that their clan could lose land, and the law is adjusted again. Both rounds are in the text. A law book that transmits the dispute over its own rules is not a matter of course in the ancient Near East.',
      },
      source: {
        de: '4. Mose 27,1-11 und 36,1-12; die fünf Namen stehen an beiden Stellen vollständig.',
        en: 'Numbers 27:1-11 and 36:1-12; the five names stand in full in both places.',
      },
    },
    {
      id: 'elf',
      title: { de: 'Elf Tagereisen', en: 'Eleven days’ journey' },
      text: {
        de: '5. Mose beginnt mit einer beiläufigen Ortsangabe, die alles über 4. Mose sagt: „Elf Tagereisen von Horeb, durch den Weg des Gebirges Seir, bis gen Kades-Barnea." Genau diese Strecke liegt zwischen dem Aufbruch in Kapitel 10 und der Kundschafter-Geschichte in Kapitel 13. Elf Tage – und daraus werden vierzig Jahre. Die Zahl steht nicht in 4. Mose selbst; sie steht im nächsten Buch, und sie ist der schärfste Kommentar zu diesem.',
        en: 'Deuteronomy opens with a casual geographical note that says everything about Numbers: "It is eleven days’ journey from Horeb by the way of Mount Seir to Kadesh Barnea." That is exactly the stretch between the departure in chapter 10 and the story of the spies in chapter 13. Eleven days – and out of them come forty years. The figure is not in Numbers itself; it is in the next book, and it is the sharpest comment on this one.',
      },
      source: {
        de: '5. Mose 1,2; die vierzig Jahre in 4. Mose 14,34 und 32,13.',
        en: 'Deuteronomy 1:2; the forty years in Numbers 14:34 and 32:13.',
      },
    },
  ],
  questions: [
    {
      de: 'Die Kundschafter sind sich über die Tatsachen einig und über den Schluss daraus nicht. Woran liegt der Unterschied?',
      en: 'The spies agree about the facts and disagree about the conclusion. Where does the difference lie?',
    },
    {
      de: 'Korahs Satz – die ganze Gemeinde ist heilig – stimmt. Warum wird er trotzdem zurückgewiesen?',
      en: 'Korah’s sentence – the whole congregation is holy – is true. Why is it rejected all the same?',
    },
    {
      de: 'Das Buch endet mit Grenzen, Städten und Erbrecht für ein Land, das niemand betreten hat. Was für eine Art von Hoffnung ist das?',
      en: 'The book ends with borders, towns and inheritance law for a country nobody has entered. What kind of hope is that?',
    },
  ],
};

export const PORTRAITS: Portrait[] = [GENESIS, EXODUS, LEVITICUS, NUMBERS];

export const PORTRAIT_BY_OSIS: Record<string, Portrait> = Object.fromEntries(
  PORTRAITS.map((p) => [p.osis, p]),
);

/** Hat dieses Buch ein Porträt? Die Oberfläche sagt es an der Liste an. */
export function hasPortrait(osis: string): boolean {
  return osis in PORTRAIT_BY_OSIS;
}

/** Das Buch aus `books.ts` zu einem Porträt – Name, Kapitelzahl, Epoche. */
export function bookOf(p: Portrait): BookMeta | undefined {
  return BOOK_BY_OSIS[p.osis];
}
