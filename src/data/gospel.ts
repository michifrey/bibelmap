// Das Leben Jesu als eigener Abschnitt: von der Ankündigung an Maria bis zu
// den Erscheinungen nach der Auferstehung – Station für Station, jede mit
// Ort, Bibelstelle und den Menschen, die darin vorkommen.
//
// Warum das neben `journeys.ts` steht: dort sind die Evangelien drei Routen
// unter fünfzehn. Hier ist es umgekehrt – der Weg ist der Rahmen, und was
// zählt, sind die Stationen und die Personen. Wer in der Liste auf Petrus
// tippt, sieht seine dreizehn Auftritte vom Bootssteg bis zum Kohlenfeuer.
//
// Grundsätze der Daten:
//
//   * Erzählt wird, was die Evangelien berichten – in der Reihenfolge, die
//     sich aus ihnen ergibt. Wo die vier voneinander abweichen (die
//     Tempelreinigung bei Johannes am Anfang, bei den anderen am Ende), steht
//     die Station dort, wo ihr Evangelium sie erzählt, und der Text sagt es.
//   * Koordinaten stammen aus dem OpenBible-Datensatz; `placeId` verweist auf
//     `public/data/places.json` und macht die Ortskarte einen Klick weit.
//   * Nicht sicher lokalisierte Orte (die Wüste der Versuchung, der Berg der
//     Verklärung, Emmaus, Machärus) tragen die verbreitete Zuordnung und
//     sagen im Text, dass sie eine ist.
//   * Jahreszahlen sind gerundet und umstritten. Die Spanne 6 v. bis 33 n.
//     Chr. folgt `eras.ts`; die Akte tragen die üblichen Näherungen.
//
// Geprüft wird das von `npm run check:gospel`: jede Ortskennung muss es in
// places.json geben, jede Person einer Station im Verzeichnis stehen, jede
// Bibelstelle sich lesen lassen.

import type { Bilingual } from './mission';

/** Ein Akt – die Gliederung des Lebens, nicht der Evangelien. */
export interface GospelAct {
  id: string;
  de: string;
  en: string;
  /** Zeitraum in Worten, wie ihn die Akt-Leiste zeigt. */
  range: Bilingual;
  color: string;
  lead: Bilingual;
}

/** Ein Auftritt: wer in einer Station vorkommt und was er dort tut. */
export interface GospelStation {
  id: string;
  act: string;
  de: string;
  en: string;
  /** Ortsangabe in Worten – oft genauer als der Kartenpunkt. */
  where: Bilingual;
  lat: number;
  lon: number;
  /** Ort in places.json – erlaubt den Sprung auf die Hauptkarte. */
  placeId?: string;
  /** Hauptstelle; Parallelen stehen in `also`. */
  ref: Bilingual;
  also?: Bilingual;
  text: Bilingual;
  /** Ein Satz, der hängen bleibt – im Wortlaut der Lutherbibel bzw. der ESV. */
  quote?: Bilingual;
  /** Kennungen aus PEOPLE – wer hier vorkommt. */
  people: string[];
  /** Nur in der Passionswoche: der Tag, an dem es geschieht. */
  day?: Bilingual;
  /** Buch für den Verweis auf den BibleProject-Guide (OSIS). */
  book: string;
}

/** Wo jemand im Ganzen steht – die Gruppen der Personenliste. */
export type PersonGroup = 'family' | 'twelve' | 'women' | 'encounters' | 'power';

export interface GospelPerson {
  id: string;
  de: string;
  en: string;
  group: PersonGroup;
  /** Wer das ist, in drei bis fünf Wörtern. */
  role: Bilingual;
  /** Was von ihm bleibt – ein, höchstens zwei Sätze. */
  note: Bilingual;
}

export const ACTS: GospelAct[] = [
  {
    id: 'promise',
    de: 'Verheißung und Geburt',
    en: 'Promise and birth',
    range: { de: '~7–4 v. Chr.', en: 'c. 7–4 BC' },
    color: '#9a4ba0',
    lead: {
      de: 'Es beginnt mit zwei Frauen, die schwanger werden, obwohl es nicht geht: eine ist zu alt, die andere hat keinen Mann. Am Ende des Akts ist die Familie auf der Flucht und ein König lässt Kinder töten.',
      en: 'It begins with two women who conceive when they should not: one is too old, the other has no husband. By the end of the act the family is in flight and a king is killing children.',
    },
  },
  {
    id: 'hidden',
    de: 'Die verborgenen Jahre',
    en: 'The hidden years',
    range: { de: '~4 v.–26 n. Chr.', en: 'c. 4 BC–AD 26' },
    color: '#7d5aa8',
    lead: {
      de: 'Dreißig Jahre, von denen die Evangelien eine einzige Geschichte erzählen. Der Rest steht in zwei Halbsätzen: Er wuchs auf, er arbeitete als Handwerker.',
      en: 'Thirty years, of which the gospels tell a single story. The rest is two half-sentences: he grew up, he worked with his hands.',
    },
  },
  {
    id: 'beginnings',
    de: 'Taufe, Wüste, erste Zeichen',
    en: 'Baptism, wilderness, first signs',
    range: { de: '~26–28 n. Chr.', en: 'c. AD 26–28' },
    color: '#3a6ea8',
    lead: {
      de: 'Am Jordan tritt er aus der Menge heraus. Danach vierzig Tage allein, dann die ersten Jünger, der erste Wein und das erste Mal Ärger im Tempel.',
      en: 'At the Jordan he steps out of the crowd. Then forty days alone, then the first disciples, the first wine and the first trouble in the temple.',
    },
  },
  {
    id: 'galilee',
    de: 'Das Jahr am See',
    en: 'The year by the lake',
    range: { de: '~28–29 n. Chr.', en: 'c. AD 28–29' },
    color: '#2f8f7f',
    lead: {
      de: 'Fast alles, was hängen bleibt, geschieht im Umkreis von dreißig Kilometern um einen See: die Bergpredigt, die Sturmstillung, die Brote, die Zwölf. Und am Ende die Frage, wer er ist.',
      en: 'Almost everything that sticks happens within thirty kilometres of one lake: the sermon, the stilled storm, the loaves, the Twelve. And at the end the question of who he is.',
    },
  },
  {
    id: 'road',
    de: 'Der Weg nach Jerusalem',
    en: 'The road to Jerusalem',
    range: { de: '~29–30 n. Chr.', en: 'c. AD 29–30' },
    color: '#a89321',
    lead: {
      de: '„Er wandte sein Angesicht, nach Jerusalem zu gehen.“ Von hier an hat jeder Schritt eine Richtung – über Samarien, durch Peräa, an einem Grab in Betanien vorbei.',
      en: '"He set his face to go to Jerusalem." From here every step has a direction – through Samaria, through Perea, past a grave in Bethany.',
    },
  },
  {
    id: 'passion',
    de: 'Die letzte Woche',
    en: 'The last week',
    range: { de: 'Nisan 9–15, ~30 n. Chr.', en: 'Nisan 9–15, c. AD 30' },
    color: '#c0472f',
    lead: {
      de: 'Ein Drittel der Evangelien handelt von sieben Tagen. Sie beginnen mit Palmzweigen und enden mit einem versiegelten Stein – dazwischen liegen fünf Verhöre in einer Nacht.',
      en: 'A third of the gospels covers seven days. They start with palm branches and end with a sealed stone – with five hearings in one night in between.',
    },
  },
  {
    id: 'risen',
    de: 'Der dritte Tag und danach',
    en: 'The third day and after',
    range: { de: '~30 n. Chr., vierzig Tage', en: 'c. AD 30, forty days' },
    color: '#c9a227',
    lead: {
      de: 'Die Berichte sind ungeordnet, widersprüchlich in den Einzelheiten und einig in der Sache: Das Grab war leer, und die Ersten, die es sagten, waren Frauen – deren Zeugnis vor Gericht nichts galt.',
      en: 'The accounts are untidy, at odds over details and agreed on the point: the tomb was empty, and the first to say so were women – whose testimony counted for nothing in court.',
    },
  },
];

export const ACT_BY_ID: Record<string, GospelAct> = Object.fromEntries(ACTS.map((a) => [a.id, a]));

/**
 * Die Menschen der Evangelien – benannte Personen und die wenigen, die keinen
 * Namen tragen, aber eine eigene Szene haben (die Samariterin, der
 * Blindgeborene, der Hauptmann von Kapernaum). Wer nur in einer Aufzählung
 * vorkommt, steht nicht hier; wer eine Begegnung hat, schon.
 */
export const PEOPLE: GospelPerson[] = [
  /* --- Familie und die ersten Zeugen ----------------------------------- */
  {
    id: 'jesus', de: 'Jesus von Nazareth', en: 'Jesus of Nazareth', group: 'family',
    role: { de: 'Der, um den es geht', en: 'The one it is about' },
    note: {
      de: 'Geboren unter Herodes, aufgewachsen in einem Dorf mit vielleicht vierhundert Einwohnern, hingerichtet unter Pontius Pilatus. Die Evangelien erzählen von etwa drei Jahren seines Lebens.',
      en: 'Born under Herod, raised in a village of perhaps four hundred, executed under Pontius Pilate. The gospels cover roughly three years of his life.',
    },
  },
  {
    id: 'maria', de: 'Maria', en: 'Mary', group: 'family',
    role: { de: 'Seine Mutter', en: 'His mother' },
    note: {
      de: 'Vermutlich Mitte Teenager bei der Verlobung. Sie ist die Einzige, die vom ersten bis zum letzten Kapitel dabei ist: bei der Ankündigung, bei der Hochzeit in Kana, unter dem Kreuz, im Obergemach nach der Himmelfahrt.',
      en: 'Probably a mid-teenager when betrothed. She is the only one present from first chapter to last: at the annunciation, at the wedding in Cana, under the cross, in the upper room after the ascension.',
    },
  },
  {
    id: 'josef', de: 'Josef', en: 'Joseph', group: 'family',
    role: { de: 'Zimmermann, ihr Mann', en: 'Carpenter, her husband' },
    note: {
      de: 'Er sagt in den Evangelien kein einziges Wort. Er handelt viermal – und dreimal davon nachts, nach einem Traum. Nach der Wallfahrt des Zwölfjährigen wird er nicht mehr erwähnt.',
      en: 'He never says a word in the gospels. He acts four times – three of them at night, after a dream. After the pilgrimage of the twelve-year-old he is never mentioned again.',
    },
  },
  {
    id: 'elisabeth', de: 'Elisabeth', en: 'Elizabeth', group: 'family',
    role: { de: 'Marias Verwandte', en: 'Mary’s relative' },
    note: {
      de: 'Priestertochter, kinderlos bis ins Alter – in ihrer Welt ein öffentliches Urteil. Sie ist die Erste, die Marias Kind erkennt, noch bevor jemand etwas gesagt hat.',
      en: 'A priest’s daughter, childless into old age – in her world a public verdict. She is the first to recognise Mary’s child, before anyone has said a word.',
    },
  },
  {
    id: 'zacharias', de: 'Zacharias', en: 'Zechariah', group: 'family',
    role: { de: 'Priester, Vater des Täufers', en: 'Priest, father of the Baptist' },
    note: {
      de: 'Einmal im Leben fällt das Los auf ihn, im Tempel zu räuchern. Er glaubt der Zusage nicht und ist neun Monate stumm – sein erstes Wort danach ist ein Lobgesang.',
      en: 'Once in a lifetime the lot falls to him to burn incense in the temple. He does not believe the promise and is mute for nine months – his first word afterwards is a song.',
    },
  },
  {
    id: 'johannes-taeufer', de: 'Johannes der Täufer', en: 'John the Baptist', group: 'family',
    role: { de: 'Prophet am Jordan', en: 'Prophet at the Jordan' },
    note: {
      de: 'Sechs Monate älter, in der Wüste aufgewachsen, mit Kamelhaar und Heuschrecken. Er schickt seine eigenen Jünger weg, damit sie Jesus folgen – und fragt später aus dem Gefängnis, ob er sich geirrt hat.',
      en: 'Six months older, raised in the wilderness, in camel hair and locusts. He sends his own disciples away to follow Jesus – and later asks from prison whether he got it wrong.',
    },
  },
  {
    id: 'simeon', de: 'Simeon', en: 'Simeon', group: 'family',
    role: { de: 'Alter Mann im Tempel', en: 'Old man in the temple' },
    note: {
      de: 'Ihm war zugesagt, den Tod nicht zu sehen, ehe er den Messias gesehen hat. Er nimmt das Kind auf den Arm und sagt der Mutter im selben Atemzug, dass ein Schwert durch ihre Seele gehen wird.',
      en: 'He was promised he would not die before seeing the Messiah. He takes the child in his arms and tells the mother in the same breath that a sword will pierce her soul.',
    },
  },
  {
    id: 'hanna', de: 'Hanna', en: 'Anna', group: 'family',
    role: { de: 'Prophetin, 84 Jahre', en: 'Prophetess, aged 84' },
    note: {
      de: 'Seit sieben Ehejahren verwitwet, seither im Tempel. Sie ist die erste Frau, die öffentlich von diesem Kind redet – zu allen, die auf Erlösung warteten.',
      en: 'Widowed after seven years of marriage, in the temple ever since. She is the first woman to speak publicly about this child – to all who were waiting for redemption.',
    },
  },
  {
    id: 'jakobus-bruder', de: 'Jakobus, sein Bruder', en: 'James, his brother', group: 'family',
    role: { de: 'Bruder, später Leiter der Gemeinde', en: 'Brother, later head of the church' },
    note: {
      de: 'Zu Lebzeiten Jesu glaubten seine Brüder nicht an ihn. Nach Ostern führt Jakobus die Gemeinde in Jerusalem und schreibt den Brief, der seinen Namen trägt.',
      en: 'During his lifetime his brothers did not believe in him. After Easter James leads the Jerusalem church and writes the letter that bears his name.',
    },
  },

  /* --- Die Zwölf -------------------------------------------------------- */
  {
    id: 'petrus', de: 'Simon Petrus', en: 'Simon Peter', group: 'twelve',
    role: { de: 'Fischer aus Betsaida', en: 'Fisherman from Bethsaida' },
    note: {
      de: 'Redet zuerst und denkt danach. Er geht auf dem Wasser und geht unter, bekennt als Erster, wer Jesus ist, und verleugnet ihn wenige Stunden später dreimal an einem Kohlenfeuer.',
      en: 'Speaks first and thinks after. He walks on water and sinks, is the first to confess who Jesus is, and hours later denies him three times at a charcoal fire.',
    },
  },
  {
    id: 'andreas', de: 'Andreas', en: 'Andrew', group: 'twelve',
    role: { de: 'Sein Bruder, vorher beim Täufer', en: 'His brother, before that with the Baptist' },
    note: {
      de: 'Er bringt Menschen zu Jesus: erst seinen Bruder Petrus, dann den Jungen mit den fünf Broten, dann die Griechen, die ihn sehen wollen.',
      en: 'He brings people to Jesus: first his brother Peter, then the boy with five loaves, then the Greeks who ask to see him.',
    },
  },
  {
    id: 'jakobus-zebedaeus', de: 'Jakobus, Sohn des Zebedäus', en: 'James son of Zebedee', group: 'twelve',
    role: { de: 'Fischer, „Donnersohn“', en: 'Fisherman, "son of thunder"' },
    note: {
      de: 'Mit Petrus und Johannes bei der Verklärung, bei Jairus’ Tochter und in Gethsemane. Er will Feuer auf ein samaritisches Dorf herabrufen – und ist später der erste Apostel, der hingerichtet wird.',
      en: 'With Peter and John at the transfiguration, at Jairus’ daughter and in Gethsemane. He wants to call fire down on a Samaritan village – and is later the first apostle to be executed.',
    },
  },
  {
    id: 'johannes-zebedaeus', de: 'Johannes, Sohn des Zebedäus', en: 'John son of Zebedee', group: 'twelve',
    role: { de: 'Fischer, „der Jünger, den Jesus liebhatte“', en: 'Fisherman, "the disciple Jesus loved"' },
    note: {
      de: 'Der Einzige der Zwölf, der unter dem Kreuz steht – dort wird ihm die Mutter Jesu anvertraut. Am leeren Grab läuft er schneller und lässt Petrus zuerst hinein.',
      en: 'The only one of the Twelve standing at the cross – there Jesus’ mother is entrusted to him. At the empty tomb he runs faster and lets Peter enter first.',
    },
  },
  {
    id: 'philippus', de: 'Philippus', en: 'Philip', group: 'twelve',
    role: { de: 'Aus Betsaida', en: 'From Bethsaida' },
    note: {
      de: 'Er rechnet nach, als fünftausend satt werden sollen: zweihundert Denare reichten nicht. Und er ist der, der beim Abschied bittet: „Zeige uns den Vater.“',
      en: 'He does the arithmetic when five thousand need feeding: two hundred denarii would not be enough. And he is the one who asks at the farewell: "Show us the Father."',
    },
  },
  {
    id: 'natanael', de: 'Natanael (Bartholomäus)', en: 'Nathanael (Bartholomew)', group: 'twelve',
    role: { de: 'Aus Kana', en: 'From Cana' },
    note: {
      de: 'Sein erster Satz über Jesus ist ein Vorurteil: „Was kann aus Nazareth Gutes kommen?“ Sein zweiter ist ein Bekenntnis.',
      en: 'His first line about Jesus is a prejudice: "Can anything good come out of Nazareth?" His second is a confession.',
    },
  },
  {
    id: 'matthaeus', de: 'Matthäus (Levi)', en: 'Matthew (Levi)', group: 'twelve',
    role: { de: 'Zöllner in Kapernaum', en: 'Tax collector in Capernaum' },
    note: {
      de: 'Er saß an der Zollstation an der Straße nach Damaskus – für seine Nachbarn ein Kollaborateur. Er steht auf, lässt den Tisch stehen und gibt am selben Abend ein Fest.',
      en: 'He sat at the customs post on the Damascus road – to his neighbours a collaborator. He gets up, leaves the table and throws a party the same evening.',
    },
  },
  {
    id: 'thomas', de: 'Thomas', en: 'Thomas', group: 'twelve',
    role: { de: '„Zwilling“', en: '"The Twin"' },
    note: {
      de: 'Der mutigste Satz der Zwölf ist von ihm – „Lasst uns mitgehen, dass wir mit ihm sterben“ –, und der bekannteste auch: dass er es nicht glaubt, bevor er es anfasst.',
      en: 'The bravest line among the Twelve is his – "Let us also go, that we may die with him" – and so is the best known: that he will not believe until he touches it.',
    },
  },
  {
    id: 'jakobus-alphaeus', de: 'Jakobus, Sohn des Alphäus', en: 'James son of Alphaeus', group: 'twelve',
    role: { de: 'Einer der Zwölf', en: 'One of the Twelve' },
    note: {
      de: 'Er steht in allen vier Apostellisten und hat in keinem Evangelium eine eigene Szene. Auch das gehört zu den Zwölf: die meisten sind Namen.',
      en: 'He appears in all four lists of apostles and has no scene of his own in any gospel. That too belongs to the Twelve: most of them are names.',
    },
  },
  {
    id: 'thaddaeus', de: 'Judas Thaddäus', en: 'Jude Thaddaeus', group: 'twelve',
    role: { de: 'Einer der Zwölf', en: 'One of the Twelve' },
    note: {
      de: 'Johannes verzeichnet seine einzige Frage, mit dem Zusatz „nicht der Iskariot“: Warum willst du dich uns offenbaren und nicht der Welt?',
      en: 'John records his single question, with the note "not Iscariot": why show yourself to us and not to the world?',
    },
  },
  {
    id: 'simon-zelot', de: 'Simon der Zelot', en: 'Simon the Zealot', group: 'twelve',
    role: { de: 'Einer der Zwölf', en: 'One of the Twelve' },
    note: {
      de: 'Sein Beiname kommt aus der Widerstandsbewegung gegen Rom. Er sitzt drei Jahre lang neben einem Mann, der für Rom Steuern eingetrieben hat.',
      en: 'His epithet comes from the resistance against Rome. For three years he sits beside a man who collected taxes for Rome.',
    },
  },
  {
    id: 'judas', de: 'Judas Iskariot', en: 'Judas Iscariot', group: 'twelve',
    role: { de: 'Kassenwart der Zwölf', en: 'Keeper of the money bag' },
    note: {
      de: 'Er führt die Kasse, kritisiert die Verschwendung des Salböls und verkauft den Zugang zu einem Menschen für dreißig Silberstücke. Danach bringt er das Geld zurück – zu spät.',
      en: 'He keeps the purse, objects to the waste of the ointment and sells access to a man for thirty pieces of silver. Then he brings the money back – too late.',
    },
  },

  /* --- Frauen, die mitgehen -------------------------------------------- */
  {
    id: 'maria-magdalena', de: 'Maria von Magdala', en: 'Mary Magdalene', group: 'women',
    role: { de: 'Aus dem Fischerort am See', en: 'From the fishing town by the lake' },
    note: {
      de: 'Von sieben Dämonen befreit, gehört sie zu denen, die den Wanderzug aus eigenen Mitteln unterhalten. Sie steht am Kreuz, sieht das Grab und ist die erste Zeugin der Auferstehung.',
      en: 'Freed from seven demons, she is one of those who fund the travelling group from their own means. She stands at the cross, sees the tomb and is the first witness of the resurrection.',
    },
  },
  {
    id: 'johanna', de: 'Johanna', en: 'Joanna', group: 'women',
    role: { de: 'Frau des Verwalters von Herodes', en: 'Wife of Herod’s steward' },
    note: {
      de: 'Ihr Mann Chuzas führt den Haushalt des Mannes, der Johannes den Täufer töten ließ. Sie finanziert den Wanderzug – und geht am Ostermorgen zum Grab.',
      en: 'Her husband Chuza runs the household of the man who had John the Baptist killed. She funds the travelling group – and goes to the tomb on Easter morning.',
    },
  },
  {
    id: 'susanna', de: 'Susanna', en: 'Susanna', group: 'women',
    role: { de: 'Eine der Unterstützerinnen', en: 'One of the supporters' },
    note: {
      de: 'Ein Name in einer Aufzählung, mehr nicht – und doch der Beleg dafür, dass der Wanderzug von Frauen bezahlt wurde.',
      en: 'A name in a list, no more – and yet the evidence that the travelling group was paid for by women.',
    },
  },
  {
    id: 'marta', de: 'Marta von Betanien', en: 'Martha of Bethany', group: 'women',
    role: { de: 'Gastgeberin', en: 'Host' },
    note: {
      de: 'Bekannt für den Vorwurf in der Küche. Am Grab ihres Bruders spricht sie das Bekenntnis, das bei den anderen Evangelien Petrus gehört.',
      en: 'Known for the complaint in the kitchen. At her brother’s grave she speaks the confession that in the other gospels belongs to Peter.',
    },
  },
  {
    id: 'maria-betanien', de: 'Maria von Betanien', en: 'Mary of Bethany', group: 'women',
    role: { de: 'Ihre Schwester', en: 'Her sister' },
    note: {
      de: 'Dreimal wird sie erwähnt, und jedes Mal sitzt oder liegt sie zu seinen Füßen – zuletzt, um ein Jahresgehalt an Nardenöl über sie auszugießen.',
      en: 'She is mentioned three times, and each time she is at his feet – the last time to pour a year’s wages of nard over them.',
    },
  },
  {
    id: 'maria-klopas', de: 'Maria, die Frau des Klopas', en: 'Mary the wife of Clopas', group: 'women',
    role: { de: 'Unter dem Kreuz', en: 'At the cross' },
    note: {
      de: 'Sie gehört zu der kleinen Gruppe, die bleibt, als alle anderen weg sind, und zu denen, die am Morgen mit Spezereien zum Grab gehen.',
      en: 'She belongs to the small group that stays when everyone else has gone, and to those who come to the tomb with spices in the morning.',
    },
  },
  {
    id: 'salome', de: 'Salome', en: 'Salome', group: 'women',
    role: { de: 'Mutter von Jakobus und Johannes', en: 'Mother of James and John' },
    note: {
      de: 'Sie bittet um die beiden besten Plätze im kommenden Reich für ihre Söhne. Sie steht auch unter dem Kreuz – dort ist keiner dieser Plätze zu vergeben.',
      en: 'She asks for the two best seats in the coming kingdom for her sons. She also stands at the cross – where neither seat is on offer.',
    },
  },
  {
    id: 'samariterin', de: 'Die Frau am Brunnen', en: 'The woman at the well', group: 'women',
    role: { de: 'Samariterin aus Sychar', en: 'A Samaritan from Sychar' },
    note: {
      de: 'Fünf Männer, keiner davon mehr der ihre, und Wasserholen zur Mittagszeit, wenn niemand sonst am Brunnen ist. Sie führt das längste Gespräch, das die Evangelien überliefern.',
      en: 'Five husbands, none of them hers any more, and fetching water at noon when nobody else is at the well. She holds the longest conversation the gospels record.',
    },
  },
  {
    id: 'blutfluessige', de: 'Die Frau mit dem Blutfluss', en: 'The woman with the haemorrhage', group: 'women',
    role: { de: 'Zwölf Jahre krank', en: 'Ill for twelve years' },
    note: {
      de: 'Zwölf Jahre lang unrein, also ausgeschlossen, und von den Ärzten arm gemacht. Sie fasst heimlich den Saum an – und wird von ihm vor allen zur Tochter erklärt.',
      en: 'Twelve years unclean, therefore excluded, and impoverished by doctors. She touches the hem in secret – and he calls her daughter in front of everyone.',
    },
  },
  {
    id: 'syrophoenizierin', de: 'Die Syrophönizierin', en: 'The Syrophoenician woman', group: 'women',
    role: { de: 'Griechin aus dem Gebiet von Tyrus', en: 'A Greek from the region of Tyre' },
    note: {
      de: 'Die einzige Person in den Evangelien, die ein Streitgespräch mit Jesus gewinnt – mit seinem eigenen Bild von den Hunden unter dem Tisch.',
      en: 'The only person in the gospels who wins an argument with Jesus – using his own image of the dogs under the table.',
    },
  },
  {
    id: 'herodias', de: 'Herodias', en: 'Herodias', group: 'power',
    role: { de: 'Frau des Antipas', en: 'Wife of Antipas' },
    note: {
      de: 'Sie verlässt den Bruder für den Bruder; Johannes sagt öffentlich, dass das nicht recht ist. Beim Geburtstagsfest nutzt sie den Tanz ihrer Tochter und einen unbedachten Schwur.',
      en: 'She leaves one brother for another; John says publicly that it is not lawful. At the birthday feast she uses her daughter’s dance and a rash oath.',
    },
  },

  /* --- Begegnungen ------------------------------------------------------ */
  {
    id: 'nikodemus', de: 'Nikodemus', en: 'Nicodemus', group: 'encounters',
    role: { de: 'Pharisäer, Mitglied des Rates', en: 'Pharisee, member of the council' },
    note: {
      de: 'Er kommt bei Nacht, um nicht gesehen zu werden. Später widerspricht er im Rat der Vorverurteilung – und bringt am Karfreitag dreißig Kilo Myrrhe und Aloe ans Grab.',
      en: 'He comes by night so as not to be seen. Later he objects in council to a verdict before a hearing – and on Good Friday brings seventy pounds of myrrh and aloes to the tomb.',
    },
  },
  {
    id: 'zachaeus', de: 'Zachäus', en: 'Zacchaeus', group: 'encounters',
    role: { de: 'Oberzöllner in Jericho', en: 'Chief tax collector in Jericho' },
    note: {
      de: 'Reich, verhasst und zu klein für die Menge, also klettert er auf einen Baum. Er gibt die Hälfte seines Vermögens weg und ersetzt Betrug vierfach – mehr, als das Gesetz verlangt.',
      en: 'Rich, hated and too short for the crowd, so he climbs a tree. He gives away half his fortune and repays fraud fourfold – more than the law required.',
    },
  },
  {
    id: 'bartimaeus', de: 'Bartimäus', en: 'Bartimaeus', group: 'encounters',
    role: { de: 'Blinder Bettler vor Jericho', en: 'Blind beggar outside Jericho' },
    note: {
      de: 'Er schreit, obwohl ihn alle zum Schweigen bringen wollen, und wirft beim Aufstehen seinen Mantel weg – sein Arbeitsgerät als Bettler.',
      en: 'He shouts although everyone tells him to be quiet, and throws off his cloak as he rises – a beggar’s working equipment.',
    },
  },
  {
    id: 'jairus', de: 'Jaïrus', en: 'Jairus', group: 'encounters',
    role: { de: 'Vorsteher der Synagoge', en: 'Synagogue ruler' },
    note: {
      de: 'Ein Mann mit Amt und Ansehen fällt vor ihm auf die Knie. Auf dem Weg zu seiner sterbenden Tochter hält eine andere Kranke den Zug auf.',
      en: 'A man of office and standing falls at his feet. On the way to his dying daughter another sick person holds up the procession.',
    },
  },
  {
    id: 'hauptmann-kapernaum', de: 'Der Hauptmann von Kapernaum', en: 'The centurion of Capernaum', group: 'encounters',
    role: { de: 'Römischer Offizier', en: 'Roman officer' },
    note: {
      de: 'Er lässt Jesus ausrichten, er brauche nicht zu kommen – ein Wort genügt, er kenne Befehle. Über niemanden sonst sagt Jesus: So einen Glauben habe ich in Israel nicht gefunden.',
      en: 'He sends word that Jesus need not come – one word will do, he understands orders. Of no one else does Jesus say: I have not found such faith in Israel.',
    },
  },
  {
    id: 'lazarus', de: 'Lazarus', en: 'Lazarus', group: 'encounters',
    role: { de: 'Bruder von Marta und Maria', en: 'Brother of Martha and Mary' },
    note: {
      de: 'Vier Tage tot, als Jesus ankommt. Nach seiner Auferweckung beschließt der Rat, auch ihn zu töten – er war der lebende Beweis.',
      en: 'Four days dead when Jesus arrives. After he is raised the council decides to kill him too – he was the living evidence.',
    },
  },
  {
    id: 'blindgeborener', de: 'Der Blindgeborene', en: 'The man born blind', group: 'encounters',
    role: { de: 'Bettler am Teich Siloah', en: 'Beggar at the pool of Siloam' },
    note: {
      de: 'Er wird verhört, seine Eltern auch, und er wird aus der Synagoge geworfen. Sein Satz ist der nüchternste des ganzen Evangeliums: „Ich war blind und bin nun sehend.“',
      en: 'He is interrogated, his parents too, and he is thrown out of the synagogue. His line is the driest in the whole gospel: "I was blind, now I see."',
    },
  },
  {
    id: 'reicher-juengling', de: 'Der reiche Mann', en: 'The rich young man', group: 'encounters',
    role: { de: 'Fragt nach dem ewigen Leben', en: 'Asks about eternal life' },
    note: {
      de: 'Er hat alle Gebote gehalten, seit er denken kann. Es ist die einzige Begegnung, die damit endet, dass jemand traurig weggeht – und Jesus ihn ziehen lässt.',
      en: 'He has kept every commandment as long as he can remember. It is the one encounter that ends with someone walking away sad – and Jesus letting him go.',
    },
  },
  {
    id: 'kleopas', de: 'Kleopas', en: 'Cleopas', group: 'encounters',
    role: { de: 'Auf dem Weg nach Emmaus', en: 'On the road to Emmaus' },
    note: {
      de: 'Einer von zweien, die Jerusalem am Ostersonntag verlassen. Elf Kilometer lang erklärt ihnen ein Fremder die Schrift; erkannt wird er erst, als er das Brot bricht.',
      en: 'One of two leaving Jerusalem on Easter Sunday. For eleven kilometres a stranger explains the Scriptures; they recognise him only when he breaks the bread.',
    },
  },
  {
    id: 'simon-kyrene', de: 'Simon von Kyrene', en: 'Simon of Cyrene', group: 'encounters',
    role: { de: 'Passant, zum Tragen gezwungen', en: 'Passer-by, forced to carry' },
    note: {
      de: 'Er kommt vom Feld herein und wird von Soldaten aus der Menge geholt. Markus nennt die Namen seiner Söhne – in Rom kannte man sie offenbar.',
      en: 'He comes in from the fields and is pulled out of the crowd by soldiers. Mark names his sons – evidently they were known in Rome.',
    },
  },
  {
    id: 'josef-arimathaea', de: 'Josef von Arimathäa', en: 'Joseph of Arimathea', group: 'encounters',
    role: { de: 'Ratsherr, heimlicher Jünger', en: 'Council member, secret disciple' },
    note: {
      de: 'Er geht zu Pilatus und bittet um den Leichnam – öffentlich, in einer Stunde, in der die Jünger verschwunden sind. Das Grab, in das er ihn legt, ist sein eigenes.',
      en: 'He goes to Pilate and asks for the body – publicly, at an hour when the disciples have vanished. The tomb he lays him in is his own.',
    },
  },
  {
    id: 'malchus', de: 'Malchus', en: 'Malchus', group: 'encounters',
    role: { de: 'Knecht des Hohenpriesters', en: 'Servant of the high priest' },
    note: {
      de: 'Ihm schlägt Petrus in Gethsemane das Ohr ab. Lukas berichtet das letzte Wunder vor der Verhaftung: Jesus heilt den Mann, der gekommen ist, ihn zu holen.',
      en: 'Peter cuts off his ear in Gethsemane. Luke records the last healing before the arrest: Jesus heals the man who came to take him.',
    },
  },
  {
    id: 'barabbas', de: 'Barabbas', en: 'Barabbas', group: 'encounters',
    role: { de: 'Aufrührer und Mörder', en: 'Insurrectionist and murderer' },
    note: {
      de: 'Der Einzige, von dem man mit Sicherheit sagen kann, dass er an diesem Morgen freikam, weil ein anderer verurteilt wurde. Sein Name heißt „Sohn des Vaters“.',
      en: 'The one man who certainly went free that morning because another was condemned. His name means "son of the father".',
    },
  },
  {
    id: 'hauptmann-kreuz', de: 'Der Hauptmann unter dem Kreuz', en: 'The centurion at the cross', group: 'encounters',
    role: { de: 'Römischer Offizier der Hinrichtung', en: 'Roman officer of the execution' },
    note: {
      de: 'Er hat viele sterben sehen. Nach diesem Tod sagt der Heide, was im ganzen Markusevangelium kein Mensch gesagt hat: Dieser Mensch ist Gottes Sohn gewesen.',
      en: 'He has watched many men die. After this death the pagan says what no human being says anywhere in Mark: this man was God’s son.',
    },
  },

  /* --- Macht: Rom, Hof und Hoherat -------------------------------------- */
  {
    id: 'herodes-gross', de: 'Herodes der Große', en: 'Herod the Great', group: 'power',
    role: { de: 'König von Judäa', en: 'King of Judea' },
    note: {
      de: 'Baumeister des Tempels, den Jesus später betreten wird, und ein Mann, der eigene Söhne hinrichten ließ. Die Sterndeuter erreichen ihn kurz vor seinem Tod.',
      en: 'Builder of the temple Jesus will later enter, and a man who had his own sons executed. The magi reach him shortly before his death.',
    },
  },
  {
    id: 'herodes-antipas', de: 'Herodes Antipas', en: 'Herod Antipas', group: 'power',
    role: { de: 'Landesfürst von Galiläa', en: 'Tetrarch of Galilee' },
    note: {
      de: 'Sein Sohn – der „Fuchs“, wie Jesus ihn nennt. Er lässt den Täufer köpfen, will Jesus lange sehen und bekommt am Karfreitag keine einzige Antwort von ihm.',
      en: 'His son – the "fox", as Jesus calls him. He has the Baptist beheaded, long wants to see Jesus, and on Good Friday gets not one answer from him.',
    },
  },
  {
    id: 'pilatus', de: 'Pontius Pilatus', en: 'Pontius Pilate', group: 'power',
    role: { de: 'Römischer Präfekt von Judäa', en: 'Roman prefect of Judea' },
    note: {
      de: 'Er sagt dreimal, dass er keine Schuld findet, und unterschreibt trotzdem. Sein Machtwort wird die Aufschrift am Kreuz: „Was ich geschrieben habe, das habe ich geschrieben.“',
      en: 'He says three times that he finds no guilt, and signs anyway. His one act of will is the placard on the cross: "What I have written, I have written."',
    },
  },
  {
    id: 'kaiphas', de: 'Kaiphas', en: 'Caiaphas', group: 'power',
    role: { de: 'Amtierender Hoherpriester', en: 'Serving high priest' },
    note: {
      de: 'Achtzehn Jahre im Amt, länger als jeder andere in dieser Zeit – das ging nur im Einvernehmen mit Rom. Von ihm stammt der Satz, es sei besser, dass ein Mensch für das Volk sterbe.',
      en: 'Eighteen years in office, longer than anyone else of the period – possible only in agreement with Rome. His is the line that it is better for one man to die for the people.',
    },
  },
  {
    id: 'hannas', de: 'Hannas', en: 'Annas', group: 'power',
    role: { de: 'Sein Schwiegervater, Hoherpriester a. D.', en: 'His father-in-law, former high priest' },
    note: {
      de: 'Fünf seiner Söhne und sein Schwiegersohn wurden Hohepriester. Zu ihm wird Jesus zuerst gebracht – zu einem Mann ohne Amt, aber mit der Macht.',
      en: 'Five of his sons and his son-in-law became high priests. Jesus is taken to him first – a man without the office but with the power.',
    },
  },
  {
    id: 'augustus', de: 'Kaiser Augustus', en: 'Caesar Augustus', group: 'power',
    role: { de: 'Römischer Kaiser', en: 'Roman emperor' },
    note: {
      de: 'Sein Erlass setzt die Weihnachtsgeschichte in Bewegung. In den Inschriften seiner Zeit heißt er Retter der Welt und Sohn eines Gottes – dieselben Wörter, die Lukas den Hirten in den Mund legt.',
      en: 'His decree sets the Christmas story moving. Inscriptions of his day call him saviour of the world and son of a god – the very words Luke puts in the shepherds’ ears.',
    },
  },
];

export const PERSON_BY_ID: Record<string, GospelPerson> = Object.fromEntries(
  PEOPLE.map((p) => [p.id, p]),
);

/**
 * Die Stationen in der Reihenfolge, in der sie erzählt werden. `people` nennt
 * die, die in dieser Szene handeln oder angesprochen sind – nicht jeden, der
 * in der Menge steht.
 */
export const STATIONS: GospelStation[] = [
  /* ================= Akt 1: Verheißung und Geburt ====================== */
  {
    id: 'zechariah-temple', act: 'promise', book: 'Luke',
    de: 'Ein stummer Priester', en: 'A priest struck dumb',
    where: { de: 'Jerusalem, im Tempel', en: 'Jerusalem, in the temple' },
    lat: 31.7784, lon: 35.2354, placeId: 'a15257a',
    ref: { de: 'Lukas 1,5-25', en: 'Luke 1:5-25' },
    text: {
      de: 'Einmal im Leben fällt das Los auf einen Priester, im Heiligtum zu räuchern. Zacharias erfährt dort, dass seine Frau, längst zu alt, einen Sohn bekommt. Er fragt nach einem Beweis – und bekommt einen: Er kann bis zur Geburt kein Wort mehr sagen.',
      en: 'Once in a lifetime the lot falls to a priest to burn incense in the sanctuary. There Zechariah learns that his wife, long past the age, will have a son. He asks for proof – and gets one: he cannot speak until the birth.',
    },
    people: ['zacharias', 'elisabeth'],
  },
  {
    id: 'annunciation', act: 'promise', book: 'Luke',
    de: 'Die Ankündigung an Maria', en: 'The annunciation to Mary',
    where: { de: 'Nazareth in Galiläa', en: 'Nazareth in Galilee' },
    lat: 32.7021, lon: 35.2977, placeId: 'af5884f',
    ref: { de: 'Lukas 1,26-38', en: 'Luke 1:26-38' },
    text: {
      de: 'Ein Dorf, das in keiner Quelle der Zeit vorkommt, eine verlobte junge Frau, ein Auftrag, der ihren Ruf kostet. Sie stellt eine sachliche Frage und gibt dann eine Antwort, die alles offenlässt: Mir geschehe, wie du gesagt hast.',
      en: 'A village no source of the period mentions, a betrothed young woman, a commission that will cost her reputation. She asks a practical question and then gives an answer that leaves everything open: let it be to me as you have said.',
    },
    quote: { de: '„Siehe, ich bin des Herrn Magd; mir geschehe, wie du gesagt hast.“', en: '"Behold, I am the servant of the Lord; let it be to me according to your word."' },
    people: ['maria'],
  },
  {
    id: 'visitation', act: 'promise', book: 'Luke',
    de: 'Zwei Schwangere im Bergland', en: 'Two pregnant women in the hills',
    where: { de: 'Ein Dorf im Bergland Judäas', en: 'A village in the hill country of Judea' },
    lat: 31.7667, lon: 35.1611,
    ref: { de: 'Lukas 1,39-56', en: 'Luke 1:39-56' },
    text: {
      de: 'Maria geht über hundert Kilometer nach Süden, zu der Einzigen, die ihr glauben wird. Elisabeth erkennt sie, bevor ein Wort gefallen ist. Was Maria dort singt, ist kein Wiegenlied: Er stößt die Gewaltigen vom Thron und erhebt die Niedrigen.',
      en: 'Mary travels more than a hundred kilometres south, to the one person who will believe her. Elizabeth recognises her before a word is said. What Mary sings there is no lullaby: he brings down rulers and lifts up the lowly.',
    },
    quote: { de: '„Er stößt die Gewaltigen vom Thron und erhebt die Niedrigen.“', en: '"He has brought down the mighty from their thrones and exalted those of humble estate."' },
    people: ['maria', 'elisabeth'],
  },
  {
    id: 'john-born', act: 'promise', book: 'Luke',
    de: 'Die Geburt des Täufers', en: 'The birth of the Baptist',
    where: { de: 'Im Bergland Judäas', en: 'In the hill country of Judea' },
    lat: 31.7667, lon: 35.1611,
    ref: { de: 'Lukas 1,57-80', en: 'Luke 1:57-80' },
    text: {
      de: 'Die Nachbarn wollen das Kind nach dem Vater nennen. Die Mutter besteht auf einem fremden Namen, der Vater schreibt ihn auf eine Tafel – und mit dem ersten Wort nach neun Monaten Schweigen fängt er an zu singen.',
      en: 'The neighbours want to name the child after his father. The mother insists on an outside name, the father writes it on a tablet – and with his first word after nine months of silence he begins to sing.',
    },
    people: ['zacharias', 'elisabeth', 'johannes-taeufer'],
  },
  {
    id: 'genealogies', act: 'promise', book: 'Matt',
    de: 'Zwei Stammbäume, die nicht zusammenpassen', en: 'Two family trees that do not match',
    where: { de: 'Bethlehem, die Stadt Davids', en: 'Bethlehem, the city of David' },
    lat: 31.7043, lon: 35.2076, placeId: 'a112427',
    ref: { de: 'Matthäus 1,1-17', en: 'Matt 1:1-17' },
    also: { de: 'Lukas 3,23-38', en: 'Luke 3:23-38' },
    text: {
      de: 'Zwei Evangelien beginnen mit einer Ahnenliste, und zwischen David und Josef decken sich die beiden Listen nicht. Matthäus zählt in drei Vierzehnergruppen bis Abraham zurück und nimmt vier Frauen hinein, deren Geschichten anstößig sind; Lukas geht über David hinaus bis Adam. Keiner der beiden schreibt ein Melderegister – beide schreiben eine These.',
      en: 'Two gospels open with a list of ancestors, and between David and Joseph the two lists do not agree. Matthew counts back to Abraham in three groups of fourteen and takes in four women whose stories are scandalous; Luke goes past David to Adam. Neither is writing a civil register – both are making a case.',
    },
    people: ['josef', 'maria'],
  },
  {
    id: 'joseph-dream', act: 'promise', book: 'Matt',
    de: 'Josef beschließt zu bleiben', en: 'Joseph decides to stay',
    where: { de: 'Nazareth', en: 'Nazareth' },
    lat: 32.7021, lon: 35.2977, placeId: 'af5884f',
    ref: { de: 'Matthäus 1,18-25', en: 'Matt 1:18-25' },
    text: {
      de: 'Nach dem Gesetz hätte er sie öffentlich anklagen können. Er will es heimlich tun, um ihr das zu ersparen. Nach dem Traum tut er etwas Drittes: Er nimmt sie zu sich und lässt die Nachbarschaft reden.',
      en: 'The law would have let him accuse her publicly. He plans to do it quietly, to spare her that. After the dream he does a third thing: he takes her in and lets the neighbours talk.',
    },
    people: ['josef', 'maria'],
  },
  {
    id: 'census', act: 'promise', book: 'Luke',
    de: 'Der Erlass aus Rom', en: 'The decree from Rome',
    where: { de: 'Von Nazareth nach Bethlehem, rund 150 km', en: 'From Nazareth to Bethlehem, some 150 km' },
    lat: 32.0, lon: 35.3,
    ref: { de: 'Lukas 2,1-5', en: 'Luke 2:1-5' },
    text: {
      de: 'Ein Verwaltungsakt in Rom setzt zwei Leute aus Galiläa in Bewegung. Der Weg führt entweder durch Samarien oder am Jordan entlang – vier bis sieben Tage, im letzten Monat einer Schwangerschaft.',
      en: 'An administrative act in Rome sets two people from Galilee walking. The road runs either through Samaria or along the Jordan – four to seven days, in the last month of a pregnancy.',
    },
    people: ['maria', 'josef', 'augustus'],
  },
  {
    id: 'nativity', act: 'promise', book: 'Luke',
    de: 'Geburt in Bethlehem', en: 'Birth in Bethlehem',
    where: { de: 'Bethlehem in Judäa', en: 'Bethlehem in Judea' },
    lat: 31.7043, lon: 35.2076, placeId: 'a112427',
    ref: { de: 'Lukas 2,6-7', en: 'Luke 2:6-7' },
    text: {
      de: 'Zwei Verse für das, worüber später Bibliotheken geschrieben werden. Kein Wirt, kein Stall im Text – nur der Satz, dass in der Herberge kein Raum war, und eine Futterkrippe, wie sie in jedem Wohnhaus mit Vieh im Untergeschoss stand.',
      en: 'Two verses for what libraries will later be written about. No innkeeper, no stable in the text – only the line that there was no room in the lodging, and a feeding trough of the kind found in any house with animals below.',
    },
    people: ['maria', 'josef'],
  },
  {
    id: 'shepherds', act: 'promise', book: 'Luke',
    de: 'Die Hirten auf dem Feld', en: 'The shepherds in the fields',
    where: { de: 'Auf den Feldern bei Bethlehem', en: 'In the fields near Bethlehem' },
    lat: 31.7043, lon: 35.2076, placeId: 'a112427',
    ref: { de: 'Lukas 2,8-20', en: 'Luke 2:8-20' },
    text: {
      de: 'Die erste Nachricht geht an Männer, deren Aussage vor Gericht nichts galt. Was sie hören, ist die Sprache der Kaiserinschriften – Retter, Herr, Friede auf Erden –, gesagt über ein Neugeborenes in einer Futterkrippe.',
      en: 'The first announcement goes to men whose testimony counted for nothing in court. What they hear is the language of imperial inscriptions – saviour, lord, peace on earth – said of a newborn in a feeding trough.',
    },
    people: ['maria', 'josef'],
  },
  {
    id: 'presentation', act: 'promise', book: 'Luke',
    de: 'Simeon und Hanna im Tempel', en: 'Simeon and Anna in the temple',
    where: { de: 'Jerusalem, im Tempel', en: 'Jerusalem, in the temple' },
    lat: 31.7784, lon: 35.2354, placeId: 'a15257a',
    ref: { de: 'Lukas 2,22-38', en: 'Luke 2:22-38' },
    text: {
      de: 'Sie bringen zwei Tauben – das Opfer derer, die sich kein Lamm leisten können. Ein alter Mann nimmt das Kind auf den Arm und sagt, er könne nun sterben; im selben Atemzug sagt er der Mutter, dass ein Schwert durch ihre Seele gehen wird.',
      en: 'They bring two doves – the offering of those who cannot afford a lamb. An old man takes the child in his arms and says he can now die; in the same breath he tells the mother a sword will pierce her soul.',
    },
    people: ['simeon', 'hanna', 'maria', 'josef'],
  },
  {
    id: 'magi', act: 'promise', book: 'Matt',
    de: 'Sterndeuter aus dem Osten', en: 'Star-gazers from the east',
    where: { de: 'Jerusalem und Bethlehem', en: 'Jerusalem and Bethlehem' },
    lat: 31.7043, lon: 35.2076, placeId: 'a112427',
    ref: { de: 'Matthäus 2,1-12', en: 'Matt 2:1-12' },
    text: {
      de: 'Heidnische Sterndeuter fragen im Palast nach dem neugeborenen König – die schlechteste Adresse. Wie viele es waren, sagt niemand; drei Gaben wurden später zu drei Personen. Sie finden ein Haus, kein Stall, und ziehen auf einem anderen Weg zurück.',
      en: 'Pagan star-gazers ask at the palace after the newborn king – the worst possible address. Nobody says how many they were; three gifts later became three people. They find a house, not a stable, and go home another way.',
    },
    people: ['herodes-gross', 'maria'],
  },
  {
    id: 'flight-egypt', act: 'promise', book: 'Matt',
    de: 'Flucht nach Ägypten', en: 'Flight to Egypt',
    where: { de: 'Ägypten', en: 'Egypt' },
    lat: 30.1294, lon: 31.3075, placeId: 'af301ca',
    ref: { de: 'Matthäus 2,13-18', en: 'Matt 2:13-18' },
    text: {
      de: 'Nachts über die Grenze, in ein Land, in dem es seit Generationen jüdische Gemeinden gab. Zurück in Bethlehem lässt Herodes die kleinen Jungen töten – bei der Größe des Ortes wohl ein Dutzend, weshalb es in keiner Chronik steht.',
      en: 'Across the border by night, into a country with Jewish communities going back generations. Back in Bethlehem Herod kills the little boys – in a village that size perhaps a dozen, which is why no chronicle records it.',
    },
    people: ['josef', 'maria', 'herodes-gross'],
  },
  {
    id: 'return-nazareth', act: 'promise', book: 'Matt',
    de: 'Zurück nach Nazareth', en: 'Back to Nazareth',
    where: { de: 'Nazareth in Galiläa', en: 'Nazareth in Galilee' },
    lat: 32.7021, lon: 35.2977, placeId: 'af5884f',
    ref: { de: 'Matthäus 2,19-23', en: 'Matt 2:19-23' },
    text: {
      de: 'Judäa bleibt gefährlich, weil Herodes’ Sohn Archelaos dort regiert. Also nach Galiläa, in das Dorf, aus dem sie kamen – und aus dem später die Frage kommen wird, ob von dort etwas Gutes kommen kann.',
      en: 'Judea stays dangerous because Herod’s son Archelaus rules there. So to Galilee, to the village they came from – the one that later prompts the question whether anything good can come from there.',
    },
    people: ['josef', 'maria'],
  },

  /* ================= Akt 2: Die verborgenen Jahre ====================== */
  {
    id: 'boy-in-temple', act: 'hidden', book: 'Luke',
    de: 'Mit zwölf im Tempel', en: 'At twelve in the temple',
    where: { de: 'Jerusalem, im Tempel', en: 'Jerusalem, in the temple' },
    lat: 31.7784, lon: 35.2354, placeId: 'a15257a',
    ref: { de: 'Lukas 2,41-52', en: 'Luke 2:41-52' },
    text: {
      de: 'Die einzige Geschichte aus dreißig Jahren. Die Eltern sind einen Tagesmarsch weit weg, ehe sie merken, dass er fehlt; drei Tage suchen sie. Seine Antwort ist keine Entschuldigung, und der Bericht endet damit, dass die Mutter alles behält.',
      en: 'The only story from thirty years. His parents are a day’s march away before they notice he is missing; they search for three days. His answer is not an apology, and the account ends with his mother keeping it all.',
    },
    quote: { de: '„Wisst ihr nicht, dass ich sein muss in dem, was meines Vaters ist?“', en: '"Did you not know that I must be in my Father’s house?"' },
    people: ['maria', 'josef'],
  },
  {
    id: 'carpenter', act: 'hidden', book: 'Mark',
    de: 'Der Handwerker aus dem Dorf', en: 'The craftsman from the village',
    where: { de: 'Nazareth', en: 'Nazareth' },
    lat: 32.7021, lon: 35.2977, placeId: 'af5884f',
    ref: { de: 'Markus 6,3', en: 'Mark 6:3' },
    also: { de: 'Lukas 2,51-52', en: 'Luke 2:51-52' },
    text: {
      de: 'Achtzehn Jahre in zwei Halbsätzen. Die Nachbarn zählen später auf, was sie wissen: der Bauhandwerker, der Sohn der Maria, die Brüder Jakobus, Joses, Judas und Simon, dazu Schwestern, die niemand mit Namen nennt.',
      en: 'Eighteen years in two half-sentences. The neighbours later list what they know: the builder, Mary’s son, the brothers James, Joses, Judas and Simon, and sisters nobody bothers to name.',
    },
    people: ['maria', 'jakobus-bruder'],
  },

  /* ============ Akt 3: Taufe, Wüste, erste Zeichen ===================== */
  {
    id: 'tiberius-dating', act: 'beginnings', book: 'Luke',
    de: 'Im fünfzehnten Jahr des Kaisers', en: 'In the fifteenth year of the emperor',
    where: { de: 'Das Land, in sieben Namen vermessen', en: 'The country, measured out in seven names' },
    lat: 31.7614, lon: 35.5583, placeId: 'ae686c9',
    ref: { de: 'Lukas 3,1-2', en: 'Luke 3:1-2' },
    text: {
      de: 'Lukas datiert wie ein Historiker: fünfzehntes Regierungsjahr des Tiberius, Pilatus in Judäa, Herodes in Galiläa, sein Bruder Philippus im Norden, Lysanias in Abilene, Hannas und Kaiphas im Amt. Sechs Machthaber, um zu sagen, wann in der Wüste ein Siebter zu reden anfing.',
      en: 'Luke dates like a historian: the fifteenth year of Tiberius, Pilate in Judea, Herod in Galilee, his brother Philip in the north, Lysanias in Abilene, Annas and Caiaphas in office. Six men in power, to say when a seventh started speaking in the wilderness.',
    },
    people: ['johannes-taeufer', 'pilatus', 'herodes-antipas', 'hannas', 'kaiphas'],
  },
  {
    id: 'baptist-preaches', act: 'beginnings', book: 'Mark',
    de: 'Der Rufer am Jordan', en: 'The voice at the Jordan',
    where: { de: 'Am Jordan, bei Betanien jenseits des Flusses', en: 'At the Jordan, at Bethany beyond the river' },
    lat: 31.7614, lon: 35.5583, placeId: 'ae686c9',
    ref: { de: 'Markus 1,1-8', en: 'Mark 1:1-8' },
    also: { de: 'Lukas 3,1-20; Johannes 1,19-28', en: 'Luke 3:1-20; John 1:19-28' },
    text: {
      de: 'Ein Mann in Kamelhaar wäscht Menschen im Fluss – ein Ritual, das sonst Heiden vorbehalten war, wenn sie zum Judentum übertraten. Er sagt Soldaten, Zöllnern und Frommen dasselbe: Fangt an, anders zu leben.',
      en: 'A man in camel hair washes people in the river – a rite otherwise reserved for pagans converting to Judaism. He tells soldiers, tax collectors and the pious the same thing: start living differently.',
    },
    people: ['johannes-taeufer'],
  },
  {
    id: 'baptism', act: 'beginnings', book: 'Mark',
    de: 'Die Taufe', en: 'The baptism',
    where: { de: 'Im Jordan', en: 'In the Jordan' },
    lat: 31.7614, lon: 35.5583, placeId: 'ae686c9',
    ref: { de: 'Markus 1,9-11', en: 'Mark 1:9-11' },
    also: { de: 'Matthäus 3,13-17; Lukas 3,21-22', en: 'Matt 3:13-17; Luke 3:21-22' },
    text: {
      de: 'Er stellt sich in die Reihe derer, die umkehren müssen. Der Täufer wehrt sich dagegen. Was danach gesagt wird, gilt vor jeder Predigt, vor jedem Wunder – noch hat er nichts getan.',
      en: 'He joins the queue of those who need to repent. The Baptist objects. What is said afterwards comes before any sermon, any miracle – he has not yet done a thing.',
    },
    quote: { de: '„Du bist mein lieber Sohn, an dir habe ich Wohlgefallen.“', en: '"You are my beloved Son; with you I am well pleased."' },
    people: ['johannes-taeufer'],
  },
  {
    id: 'temptation', act: 'beginnings', book: 'Matt',
    de: 'Vierzig Tage in der Wüste', en: 'Forty days in the wilderness',
    where: { de: 'Wüste Juda – der Ort ist nicht überliefert', en: 'The Judean wilderness – the place is not recorded' },
    lat: 31.72, lon: 35.4,
    ref: { de: 'Matthäus 4,1-11', en: 'Matt 4:1-11' },
    also: { de: 'Markus 1,12-13; Lukas 4,1-13', en: 'Mark 1:12-13; Luke 4:1-13' },
    text: {
      de: 'Drei Angebote, die keine Sünden im üblichen Sinn sind: Brot für den Hunger, ein Beweis vor allen, Macht ohne Kreuz. Er antwortet dreimal mit einem Satz aus dem 5. Buch Mose – demselben Buch, das vom Volk in der Wüste handelt.',
      en: 'Three offers that are no sins in the usual sense: bread for hunger, proof before everyone, power without a cross. Three times he answers with a line from Deuteronomy – the book about a people in the wilderness.',
    },
    people: [],
  },
  {
    id: 'first-disciples', act: 'beginnings', book: 'John',
    de: 'Die ersten, die mitgehen', en: 'The first to come along',
    where: { de: 'Betanien jenseits des Jordan', en: 'Bethany beyond the Jordan' },
    lat: 31.7614, lon: 35.5583, placeId: 'ae686c9',
    ref: { de: 'Johannes 1,35-51', en: 'John 1:35-51' },
    text: {
      de: 'Der Täufer schickt seine eigenen Leute weg. Zwei gehen hinterher, einer holt seinen Bruder, der holt einen Freund, und der sagt zuerst, was er von Nazareth hält. Die ersten vier Jünger kommen über Verwandtschaft und Nachbarschaft.',
      en: 'The Baptist sends his own people away. Two follow, one fetches his brother, he fetches a friend, and the friend first says what he thinks of Nazareth. The first four disciples come by way of family and neighbours.',
    },
    people: ['johannes-taeufer', 'andreas', 'petrus', 'philippus', 'natanael'],
  },
  {
    id: 'cana', act: 'beginnings', book: 'John',
    de: 'Der Wein von Kana', en: 'The wine at Cana',
    where: { de: 'Kana in Galiläa', en: 'Cana in Galilee' },
    lat: 32.8222, lon: 35.3027, placeId: 'a031bda',
    ref: { de: 'Johannes 2,1-11', en: 'John 2:1-11' },
    text: {
      de: 'Auf einer Dorfhochzeit geht der Wein aus – für die Gastgeber eine Blamage, an die man sich jahrelang erinnert. Seine Mutter meldet den Mangel, ohne eine Bitte auszusprechen. Sechs Steinkrüge später ist es der beste Wein des Abends.',
      en: 'At a village wedding the wine runs out – a humiliation the hosts would carry for years. His mother reports the shortage without making a request. Six stone jars later it is the best wine of the evening.',
    },
    people: ['maria', 'natanael'],
  },
  {
    id: 'temple-cleansing-john', act: 'beginnings', book: 'John',
    de: 'Tische im Tempel', en: 'Tables in the temple',
    where: { de: 'Jerusalem, Vorhof des Tempels', en: 'Jerusalem, the temple court' },
    lat: 31.7784, lon: 35.2354, placeId: 'a15257a',
    ref: { de: 'Johannes 2,13-25', en: 'John 2:13-25' },
    text: {
      de: 'Johannes stellt diese Szene an den Anfang, die anderen drei an das Ende – ob es zweimal geschah oder einmal, ist eine alte Streitfrage. Der Handel selbst war nötig: Wer von weit kam, brauchte Opfertiere und die richtige Münze.',
      en: 'John puts this scene at the beginning, the other three at the end – whether it happened twice or once is an old dispute. The trade itself was necessary: pilgrims from far away needed animals and the right coin.',
    },
    people: [],
  },
  {
    id: 'nicodemus', act: 'beginnings', book: 'John',
    de: 'Ein Ratsherr bei Nacht', en: 'A council member by night',
    where: { de: 'Jerusalem', en: 'Jerusalem' },
    lat: 31.7784, lon: 35.2354, placeId: 'a15257a',
    ref: { de: 'Johannes 3,1-21', en: 'John 3:1-21' },
    text: {
      de: 'Er kommt im Dunkeln, weil ihn niemand sehen soll, und redet höflich wie unter Fachleuten. Die Antwort bricht das Gespräch auf: Man müsse von vorn anfangen, wie geboren werden. In diesem Gespräch steht der meistzitierte Vers der Bibel.',
      en: 'He comes in the dark so nobody sees him and speaks politely, expert to expert. The answer breaks the conversation open: one has to start over, as if born. This conversation holds the most quoted verse in the Bible.',
    },
    people: ['nikodemus'],
  },
  {
    id: 'samaritan-woman', act: 'beginnings', book: 'John',
    de: 'Die Frau am Jakobsbrunnen', en: 'The woman at Jacob’s well',
    where: { de: 'Sychar in Samarien', en: 'Sychar in Samaria' },
    lat: 32.2178, lon: 35.289, placeId: 'a27b472',
    ref: { de: 'Johannes 4,1-42', en: 'John 4:1-42' },
    text: {
      de: 'Drei Grenzen auf einmal: Er redet mit einer Frau, mit einer Samaritanerin und mit einer, die zur Mittagszeit Wasser holt, weil sie den anderen aus dem Weg geht. Am Ende ist sie es, die das Dorf holt.',
      en: 'Three lines crossed at once: he talks with a woman, with a Samaritan, and with one who draws water at noon to avoid the others. In the end it is she who fetches the village.',
    },
    people: ['samariterin'],
  },
  {
    id: 'officials-son', act: 'beginnings', book: 'John',
    de: 'Der Sohn des Beamten', en: 'The official’s son',
    where: { de: 'Kana, das Kind in Kapernaum', en: 'Cana, the child in Capernaum' },
    lat: 32.8222, lon: 35.3027, placeId: 'a031bda',
    ref: { de: 'Johannes 4,46-54', en: 'John 4:46-54' },
    text: {
      de: 'Ein Mann aus dem Dienst des Herodes läuft dreißig Kilometer bergauf und bittet um das Leben seines Kindes. Er bekommt keinen Hausbesuch, nur einen Satz – und erfährt unterwegs, dass das Fieber zur selben Stunde wich.',
      en: 'A man in Herod’s service walks thirty kilometres uphill and begs for his child’s life. He gets no house call, only a sentence – and learns on the way home that the fever broke at that very hour.',
    },
    people: [],
  },
  {
    id: 'nazareth-synagogue', act: 'beginnings', book: 'Luke',
    de: 'Die Predigt, die alle wütend macht', en: 'The sermon that enrages everyone',
    where: { de: 'Nazareth, in der Synagoge', en: 'Nazareth, in the synagogue' },
    lat: 32.7021, lon: 35.2977, placeId: 'af5884f',
    ref: { de: 'Lukas 4,16-30', en: 'Luke 4:16-30' },
    text: {
      de: 'Er liest Jesaja vor, setzt sich und sagt, das sei heute erfüllt. Zuerst sind alle stolz auf den Jungen von hier. Dann erinnert er an zwei Fälle, in denen Gott an Israel vorbei half – und sie drängen ihn an den Rand des Berges.',
      en: 'He reads Isaiah, sits down and says it is fulfilled today. At first they are proud of the local boy. Then he recalls two cases where God helped past Israel – and they drive him to the brow of the hill.',
    },
    people: [],
  },
  {
    id: 'capernaum-base', act: 'beginnings', book: 'Mark',
    de: 'Ein Tag in Kapernaum', en: 'One day in Capernaum',
    where: { de: 'Kapernaum am See', en: 'Capernaum by the lake' },
    lat: 32.8811, lon: 35.575, placeId: 'af2161c',
    ref: { de: 'Markus 1,21-34', en: 'Mark 1:21-34' },
    text: {
      de: 'Markus erzählt einen einzigen Sabbat wie ein Protokoll: Synagoge, ein Aufschrei, das Haus des Petrus, dessen Schwiegermutter mit Fieber, und nach Sonnenuntergang – als das Tragen wieder erlaubt ist – die ganze Stadt vor der Tür.',
      en: 'Mark tells a single sabbath like a log: synagogue, an outcry, Peter’s house, his mother-in-law with a fever, and after sunset – when carrying is allowed again – the whole town at the door.',
    },
    people: ['petrus', 'andreas', 'jakobus-zebedaeus', 'johannes-zebedaeus'],
  },

  /* ================= Akt 4: Das Jahr am See ============================ */
  {
    id: 'call-fishermen', act: 'galilee', book: 'Luke',
    de: 'Ein Fang und vier Leute, die alles stehen lassen', en: 'A catch and four men who leave everything',
    where: { de: 'Am See Gennesaret', en: 'By the Sea of Galilee' },
    lat: 32.8189, lon: 35.59, placeId: 'a562fcc',
    ref: { de: 'Lukas 5,1-11', en: 'Luke 5:1-11' },
    also: { de: 'Markus 1,16-20', en: 'Mark 1:16-20' },
    text: {
      de: 'Nach einer Nacht ohne Ertrag sollen sie am helllichten Tag noch einmal hinaus – gegen alles, was ein Fischer weiß. Die Netze reißen. Petrus’ erste Reaktion ist nicht Dank, sondern die Bitte, er möge weggehen.',
      en: 'After a night with nothing they are to go out again in broad daylight – against everything a fisherman knows. The nets tear. Peter’s first reaction is not thanks but a request that he go away.',
    },
    people: ['petrus', 'andreas', 'jakobus-zebedaeus', 'johannes-zebedaeus'],
  },
  {
    id: 'paralytic', act: 'galilee', book: 'Mark',
    de: 'Das aufgedeckte Dach', en: 'The opened roof',
    where: { de: 'Kapernaum, im Haus', en: 'Capernaum, in the house' },
    lat: 32.8811, lon: 35.575, placeId: 'af2161c',
    ref: { de: 'Markus 2,1-12', en: 'Mark 2:1-12' },
    text: {
      de: 'Vier Freunde tragen einen Gelähmten, kommen nicht durch die Tür und graben das Lehmdach auf – fremdes Eigentum, mitten in einer Predigt. Was er zuerst sagt, ist nicht „steh auf“, sondern die Vergebung. Genau darüber bricht der Streit los.',
      en: 'Four friends carry a paralysed man, cannot get through the door and dig through the clay roof – someone else’s property, in the middle of a sermon. What he says first is not "get up" but forgiveness. That is exactly what starts the row.',
    },
    people: ['petrus'],
  },
  {
    id: 'call-matthew', act: 'galilee', book: 'Mark',
    de: 'Der Zöllner am Zoll', en: 'The tax man at his booth',
    where: { de: 'Kapernaum, an der Zollstation', en: 'Capernaum, at the customs post' },
    lat: 32.8811, lon: 35.575, placeId: 'af2161c',
    ref: { de: 'Markus 2,13-17', en: 'Mark 2:13-17' },
    also: { de: 'Matthäus 9,9-13; Lukas 5,27-32', en: 'Matt 9:9-13; Luke 5:27-32' },
    text: {
      de: 'Die Straße nach Damaskus lief hier vorbei, und wer Waren durchbrachte, zahlte an diesem Tisch. Am selben Abend sitzt Jesus in dessen Haus mit dessen Kollegen – die Frage der Frommen ist berechtigt: Warum mit denen?',
      en: 'The road to Damascus ran past here, and anyone moving goods paid at this table. That same evening Jesus is in his house with his colleagues – and the pious have a fair question: why with them?',
    },
    people: ['matthaeus'],
  },
  {
    id: 'sabbath-conflicts', act: 'galilee', book: 'Mark',
    de: 'Ähren am Sabbat', en: 'Grain on the sabbath',
    where: { de: 'Auf den Feldern und in der Synagoge', en: 'In the fields and in the synagogue' },
    lat: 32.8811, lon: 35.575, placeId: 'af2161c',
    ref: { de: 'Markus 2,23-3,6', en: 'Mark 2:23-3:6' },
    text: {
      de: 'Zweimal derselbe Streit an einem Sabbat: Die Jünger raufen Ähren, ein Mann mit verdorrter Hand steht in der Synagoge. Markus notiert hier das einzige Mal, dass Jesus zornig wird – über das Schweigen der Zuschauer. Am Ende des Kapitels beraten Pharisäer und Anhänger des Herodes, wie sie ihn umbringen könnten.',
      en: 'The same argument twice on one sabbath: the disciples pluck heads of grain, a man with a withered hand stands in the synagogue. Here Mark records the one time Jesus is angry – at the silence of the onlookers. At the end of the chapter Pharisees and Herodians confer about how to destroy him.',
    },
    quote: { de: '„Der Sabbat ist um des Menschen willen gemacht und nicht der Mensch um des Sabbats willen.“', en: '"The sabbath was made for man, not man for the sabbath."' },
    people: [],
  },
  {
    id: 'twelve-chosen', act: 'galilee', book: 'Luke',
    de: 'Die Zwölf', en: 'The Twelve',
    where: { de: 'Auf einem Berg bei Kapernaum', en: 'On a hill near Capernaum' },
    lat: 32.8809, lon: 35.5556,
    ref: { de: 'Lukas 6,12-16', en: 'Luke 6:12-16' },
    also: { de: 'Markus 3,13-19', en: 'Mark 3:13-19' },
    text: {
      de: 'Nach einer Nacht allein wählt er zwölf aus – so viele, wie es Stämme gab. Vier Fischer, ein Zöllner, ein Widerstandskämpfer, dazu Namen, von denen die Evangelien nichts weiter erzählen, und einer, bei dem jede Liste vermerkt, was er später tat.',
      en: 'After a night alone he picks twelve – as many as there were tribes. Four fishermen, a tax collector, a resistance fighter, plus names the gospels never mention again, and one whom every list marks with what he later did.',
    },
    people: ['petrus', 'andreas', 'jakobus-zebedaeus', 'johannes-zebedaeus', 'philippus', 'natanael', 'matthaeus', 'thomas', 'jakobus-alphaeus', 'thaddaeus', 'simon-zelot', 'judas'],
  },
  {
    id: 'hometown-family', act: 'galilee', book: 'Mark',
    de: 'Die Familie will ihn holen', en: 'The family comes to take him home',
    where: { de: 'Kapernaum, vor dem Haus', en: 'Capernaum, outside the house' },
    lat: 32.8811, lon: 35.575, placeId: 'af2161c',
    ref: { de: 'Markus 3,20-35', en: 'Mark 3:20-35' },
    text: {
      de: 'Der Andrang ist so groß, dass niemand zum Essen kommt. Seine Angehörigen machen sich auf, ihn mit Gewalt zurückzuholen: Er sei von Sinnen. Die Schriftgelehrten sagen etwas Schlimmeres. Als Mutter und Brüder draußen stehen und rufen lassen, sieht er die im Kreis um sich und nennt sie seine Familie.',
      en: 'The crush is such that nobody can even eat. His relatives set out to seize him: he is out of his mind. The scribes say something worse. When his mother and brothers stand outside and send word, he looks at the circle around him and calls them his family.',
    },
    people: ['maria', 'jakobus-bruder'],
  },
  {
    id: 'sermon-mount', act: 'galilee', book: 'Matt',
    de: 'Die Bergpredigt', en: 'The sermon on the mount',
    where: { de: 'An einem Hang über dem See', en: 'On a hillside above the lake' },
    lat: 32.8809, lon: 35.5556,
    ref: { de: 'Matthäus 5-7', en: 'Matt 5-7' },
    also: { de: 'Lukas 6,20-49', en: 'Luke 6:20-49' },
    text: {
      de: 'Drei Kapitel, in denen fast nichts steht, das man tun soll, ohne dass es unbequem wird: Feinde lieben, nicht zurückschlagen, im Verborgenen geben, sich um morgen nicht sorgen. Am Ende steht die Menge da und merkt, dass er anders redet als ihre Lehrer.',
      en: 'Three chapters with almost nothing in them that stays comfortable: love enemies, do not hit back, give in secret, do not worry about tomorrow. At the end the crowd stands there and notices he speaks unlike their teachers.',
    },
    quote: { de: '„Liebt eure Feinde und bittet für die, die euch verfolgen.“', en: '"Love your enemies and pray for those who persecute you."' },
    people: [],
  },
  {
    id: 'centurion', act: 'galilee', book: 'Luke',
    de: 'Der römische Offizier', en: 'The Roman officer',
    where: { de: 'Kapernaum', en: 'Capernaum' },
    lat: 32.8811, lon: 35.575, placeId: 'af2161c',
    ref: { de: 'Lukas 7,1-10', en: 'Luke 7:1-10' },
    also: { de: 'Matthäus 8,5-13', en: 'Matt 8:5-13' },
    text: {
      de: 'Ein Besatzungsoffizier bittet für einen Sklaven, und die jüdischen Ältesten legen ein gutes Wort für ihn ein – er hat ihnen die Synagoge gebaut. Er selbst hält Jesus davon ab zu kommen: Er kenne Befehlsketten, ein Wort reiche.',
      en: 'An officer of the occupying army pleads for a slave, and the Jewish elders speak up for him – he built their synagogue. He himself stops Jesus from coming: he knows chains of command, one word will do.',
    },
    people: ['hauptmann-kapernaum'],
  },
  {
    id: 'nain', act: 'galilee', book: 'Luke',
    de: 'Der Zug vor dem Stadttor', en: 'The procession at the town gate',
    where: { de: 'Nain in Galiläa', en: 'Nain in Galilee' },
    lat: 32.6307, lon: 35.3501, placeId: 'aee679c',
    ref: { de: 'Lukas 7,11-17', en: 'Luke 7:11-17' },
    text: {
      de: 'Zwei Züge treffen sich am Tor: einer geht hinein, einer trägt einen Toten hinaus. Es ist der einzige Sohn einer Witwe – ohne ihn hat sie keine Versorgung mehr. Niemand bittet ihn um etwas; er sieht sie und fängt an.',
      en: 'Two processions meet at the gate: one going in, one carrying a dead man out. He is a widow’s only son – without him she has nothing to live on. Nobody asks him for anything; he sees her and acts.',
    },
    people: [],
  },
  {
    id: 'sinful-woman', act: 'galilee', book: 'Luke',
    de: 'Die Frau mit dem Salböl', en: 'The woman with the ointment',
    where: { de: 'Im Haus eines Pharisäers, Galiläa', en: 'In a Pharisee’s house, Galilee' },
    lat: 32.7736, lon: 35.5442, placeId: 'ac9adc9',
    ref: { de: 'Lukas 7,36-50', en: 'Luke 7:36-50' },
    text: {
      de: 'Sie kommt uneingeladen in ein fremdes Haus, weint auf seine Füße und trocknet sie mit ihren Haaren – in der Öffentlichkeit ein Skandal. Der Gastgeber sagt nichts laut, denkt es aber; die Antwort ist eine kleine Rechenaufgabe über Schulden.',
      en: 'She comes uninvited into someone else’s house, weeps on his feet and dries them with her hair – in public, a scandal. The host says nothing aloud but thinks it; the reply is a small piece of arithmetic about debts.',
    },
    people: [],
  },
  {
    id: 'women-who-fund', act: 'galilee', book: 'Luke',
    de: 'Wer den Wanderzug bezahlte', en: 'Who paid for the road',
    where: { de: 'Unterwegs in Galiläa', en: 'On the road in Galilee' },
    lat: 32.76, lon: 35.527, placeId: 'a9cf1e8',
    ref: { de: 'Lukas 8,1-3', en: 'Luke 8:1-3' },
    text: {
      de: 'Drei Verse, die selten gepredigt werden: Neben den Zwölf ziehen Frauen mit, und sie sind es, die den Zug „mit ihrer Habe“ unterhalten. Eine von ihnen ist die Frau des Verwalters von Herodes – Geld aus dem Haus des Gegners.',
      en: 'Three verses rarely preached: alongside the Twelve women travel too, and it is they who support the group "out of their own means". One of them is the wife of Herod’s steward – money from the opponent’s household.',
    },
    people: ['maria-magdalena', 'johanna', 'susanna'],
  },
  {
    id: 'parables-by-the-lake', act: 'galilee', book: 'Mark',
    de: 'Vom Boot aus in Gleichnissen', en: 'Parables from a boat',
    where: { de: 'Am Ufer des Sees', en: 'On the shore of the lake' },
    lat: 32.8189, lon: 35.59, placeId: 'a562fcc',
    ref: { de: 'Markus 4,1-34', en: 'Mark 4:1-34' },
    text: {
      de: 'Er setzt sich in ein Boot und schiebt ab, damit ihn die Menge am Hang hören kann – der See als Verstärker. Was er erzählt, klingt nach Landwirtschaft: Saat auf vier Böden, ein Senfkorn, eine Saat, die von selbst wächst. Erklärt wird es nur im engsten Kreis; die Gleichnisse verbergen so viel, wie sie zeigen.',
      en: 'He gets into a boat and pushes off so the crowd on the slope can hear him – the lake as amplifier. What he tells sounds like farming: seed on four soils, a mustard seed, a crop that grows by itself. He explains it only to the inner circle; the parables hide as much as they show.',
    },
    people: [],
  },
  {
    id: 'storm', act: 'galilee', book: 'Mark',
    de: 'Der Sturm auf dem See', en: 'The storm on the lake',
    where: { de: 'Auf dem See Gennesaret', en: 'On the Sea of Galilee' },
    lat: 32.8189, lon: 35.59, placeId: 'a562fcc',
    ref: { de: 'Markus 4,35-41', en: 'Mark 4:35-41' },
    text: {
      de: 'Der See liegt 200 Meter unter dem Meeresspiegel; Fallwinde aus den Schluchten machen ihn in Minuten unbefahrbar. Berufsfischer geraten in Panik, er schläft. Die Frage danach ist nicht beantwortet, sondern zurückgegeben: Wer ist der?',
      en: 'The lake lies 200 metres below sea level; squalls off the ravines make it unnavigable within minutes. Professional fishermen panic, he sleeps. The question afterwards is not answered but handed back: who is this?',
    },
    people: ['petrus', 'andreas', 'jakobus-zebedaeus', 'johannes-zebedaeus'],
  },
  {
    id: 'gerasene', act: 'galilee', book: 'Mark',
    de: 'Der Mann in den Gräbern', en: 'The man among the tombs',
    where: { de: 'Ostufer, Gebiet der Zehn Städte', en: 'East shore, region of the Decapolis' },
    lat: 32.656, lon: 35.6793, placeId: 'afed46a',
    ref: { de: 'Markus 5,1-20', en: 'Mark 5:1-20' },
    text: {
      de: 'Heidnisches Gebiet, erkennbar an der Schweineherde. Der Mann lebt zwischen Gräbern, weil ihn niemand mehr halten kann. Am Ende sitzt er angezogen da – und die Stadt bittet Jesus zu gehen: Die Ordnung, die er bringt, ist teurer als die alte.',
      en: 'Gentile country, as the herd of pigs shows. The man lives among the tombs because nobody can restrain him. In the end he sits there clothed – and the town asks Jesus to leave: the order he brings costs more than the old one.',
    },
    people: [],
  },
  {
    id: 'jairus', act: 'galilee', book: 'Mark',
    de: 'Zwei Töchter', en: 'Two daughters',
    where: { de: 'Kapernaum', en: 'Capernaum' },
    lat: 32.8811, lon: 35.575, placeId: 'af2161c',
    ref: { de: 'Markus 5,21-43', en: 'Mark 5:21-43' },
    text: {
      de: 'Eine Geschichte in der anderen: Auf dem Weg zu einem sterbenden Kind hält eine Frau den Zug auf, die seit zwölf Jahren blutet – so lange, wie das Mädchen alt ist. Während sie geheilt wird, stirbt das Kind. Er geht trotzdem weiter.',
      en: 'One story inside another: on the way to a dying child a woman stops the procession, bleeding for twelve years – as long as the girl has been alive. While she is healed the child dies. He goes on anyway.',
    },
    people: ['jairus', 'blutfluessige', 'petrus', 'jakobus-zebedaeus', 'johannes-zebedaeus'],
  },
  {
    id: 'rejected-home', act: 'galilee', book: 'Mark',
    de: 'Zu Hause zählt er nichts', en: 'At home he counts for nothing',
    where: { de: 'Nazareth', en: 'Nazareth' },
    lat: 32.7021, lon: 35.2977, placeId: 'af5884f',
    ref: { de: 'Markus 6,1-6', en: 'Mark 6:1-6' },
    text: {
      de: 'Die Nachbarn zählen die Familie auf und nennen ihn den Sohn der Maria – in einer Welt, die nach dem Vater benannte, ein Seitenhieb. Markus schreibt den härtesten Satz über ihn: Er konnte dort keine Tat tun, außer ein paar Kranke heilen.',
      en: 'The neighbours list the family and call him Mary’s son – in a world that named people after the father, a dig. Mark writes the harshest line about him: he could do no work there, except heal a few sick people.',
    },
    people: ['maria', 'jakobus-bruder'],
  },
  {
    id: 'twelve-sent', act: 'galilee', book: 'Mark',
    de: 'Zu zweit ausgesandt', en: 'Sent out two by two',
    where: { de: 'In die Dörfer Galiläas', en: 'Into the villages of Galilee' },
    lat: 32.76, lon: 35.527, placeId: 'a9cf1e8',
    ref: { de: 'Markus 6,7-13', en: 'Mark 6:7-13' },
    text: {
      de: 'Kein Brot, kein Geld, kein zweites Hemd – sie sollen abhängig sein von denen, zu denen sie kommen. Wer sie nicht aufnimmt, bekommt keine Drohung, sondern den Staub von ihren Füßen.',
      en: 'No bread, no money, no second tunic – they are to depend on the people they visit. Those who do not receive them get no threat, only the dust off their feet.',
    },
    people: ['petrus', 'andreas', 'jakobus-zebedaeus', 'johannes-zebedaeus', 'philippus', 'natanael', 'matthaeus', 'thomas', 'jakobus-alphaeus', 'thaddaeus', 'simon-zelot', 'judas'],
  },
  {
    id: 'baptist-killed', act: 'galilee', book: 'Mark',
    de: 'Der Kopf des Täufers', en: 'The Baptist’s head',
    where: { de: 'Machärus – die Festung nennt erst Josephus', en: 'Machaerus – only Josephus names the fortress' },
    lat: 31.5667, lon: 35.625,
    ref: { de: 'Markus 6,14-29', en: 'Mark 6:14-29' },
    text: {
      de: 'Antipas hört den Täufer gern und lässt ihn trotzdem einsperren, weil er ihm die Ehe vorhält. Bei einem Geburtstagsfest kostet ein Tanz, ein voreiliger Schwur und die Rache seiner Frau den Kopf des Propheten – die einzige Szene, in der Jesus nicht vorkommt.',
      en: 'Antipas likes listening to the Baptist and jails him anyway, because he objects to his marriage. At a birthday feast a dance, a rash oath and his wife’s grudge cost the prophet his head – the one scene without Jesus in it.',
    },
    people: ['johannes-taeufer', 'herodes-antipas', 'herodias'],
  },
  {
    id: 'feeding-5000', act: 'galilee', book: 'Mark',
    de: 'Fünf Brote', en: 'Five loaves',
    where: { de: 'Am Ostufer bei Betsaida', en: 'On the east shore near Bethsaida' },
    lat: 32.9104, lon: 35.631, placeId: 'a91b732',
    ref: { de: 'Markus 6,30-44', en: 'Mark 6:30-44' },
    also: { de: 'Lukas 9,10-17; Johannes 6,1-15', en: 'Luke 9:10-17; John 6:1-15' },
    text: {
      de: 'Das einzige Wunder, das alle vier Evangelien erzählen. Die Jünger rechnen und wollen die Leute wegschicken; sie sollen ihnen selbst zu essen geben. Danach will die Menge ihn zum König machen – und er verschwindet allein auf den Berg.',
      en: 'The only miracle all four gospels tell. The disciples do the sums and want the people sent away; they are told to feed them themselves. Afterwards the crowd wants to make him king – and he goes off alone up the mountain.',
    },
    people: ['philippus', 'andreas'],
  },
  {
    id: 'walking-on-water', act: 'galilee', book: 'Mark',
    de: 'Auf dem Wasser', en: 'On the water',
    where: { de: 'Auf dem See, bei Gennesaret', en: 'On the lake, off Gennesaret' },
    lat: 32.8606, lon: 35.5072, placeId: 'a7de69e',
    ref: { de: 'Markus 6,45-52', en: 'Mark 6:45-52' },
    also: { de: 'Matthäus 14,22-33', en: 'Matt 14:22-33' },
    text: {
      de: 'Vierte Nachtwache, kurz vor Morgengrauen, Gegenwind. Nur Matthäus erzählt weiter: Petrus steigt aus, geht ein paar Schritte, sieht den Wind und sinkt. Er geht unter, während er noch schaut – nicht, weil er springt.',
      en: 'Fourth watch of the night, just before dawn, a headwind. Only Matthew goes on: Peter climbs out, takes a few steps, sees the wind and sinks. He goes under while still looking – not because he jumped.',
    },
    people: ['petrus'],
  },
  {
    id: 'bread-of-life', act: 'galilee', book: 'John',
    de: 'Die Rede, nach der viele gehen', en: 'The sermon after which many leave',
    where: { de: 'Kapernaum, in der Synagoge', en: 'Capernaum, in the synagogue' },
    lat: 32.8811, lon: 35.575, placeId: 'af2161c',
    ref: { de: 'Johannes 6,22-71', en: 'John 6:22-71' },
    text: {
      de: 'Am Tag nach den Broten wollen sie mehr davon. Was er stattdessen sagt, ist zumutungslos hart, und Johannes hält fest, was daraufhin geschieht: Viele seiner Jünger gehen weg. Er fragt die Zwölf, ob sie auch gehen wollen.',
      en: 'The day after the loaves they want more. What he says instead is unbearably hard, and John records the result: many of his disciples leave. He asks the Twelve whether they want to go too.',
    },
    quote: { de: '„Herr, wohin sollen wir gehen? Du hast Worte des ewigen Lebens.“', en: '"Lord, to whom shall we go? You have the words of eternal life."' },
    people: ['petrus', 'judas'],
  },
  {
    id: 'syrophoenician', act: 'galilee', book: 'Mark',
    de: 'Die Frau, die ihn überzeugt', en: 'The woman who wins the argument',
    where: { de: 'Im Gebiet von Tyrus und Sidon', en: 'In the region of Tyre and Sidon' },
    lat: 33.2708, lon: 35.1961, placeId: 'a160272',
    ref: { de: 'Markus 7,24-30', en: 'Mark 7:24-30' },
    text: {
      de: 'Er ist außer Landes und will unerkannt bleiben. Eine griechische Frau bittet für ihre Tochter und bekommt eine schroffe Antwort über Kinder und Hunde. Sie nimmt das Bild und dreht es um – und ist die Einzige, die ein Wortgefecht mit ihm gewinnt.',
      en: 'He is outside the country and wants to stay unrecognised. A Greek woman pleads for her daughter and gets a curt answer about children and dogs. She takes the image and turns it round – the only person to win an exchange with him.',
    },
    people: ['syrophoenizierin'],
  },
  {
    id: 'decapolis-deaf', act: 'galilee', book: 'Mark',
    de: 'Der Taubstumme in der Dekapolis', en: 'The deaf man in the Decapolis',
    where: { de: 'Gebiet der Zehn Städte', en: 'Region of the Ten Cities' },
    lat: 32.7167, lon: 35.8, placeId: 'ae733a2',
    ref: { de: 'Markus 7,31-37', en: 'Mark 7:31-37' },
    text: {
      de: 'Er nimmt den Mann beiseite, weg von der Menge, und tut alles ohne Worte: Finger in die Ohren, Speichel, ein Blick nach oben, ein Seufzer. Für einen, der nichts hören kann, ist das die einzige verständliche Sprache.',
      en: 'He takes the man aside, away from the crowd, and does everything without words: fingers in the ears, spittle, a look upward, a sigh. For someone who cannot hear, that is the only language that carries.',
    },
    people: [],
  },
  {
    id: 'feeding-4000', act: 'galilee', book: 'Mark',
    de: 'Sieben Brote auf der anderen Seite', en: 'Seven loaves on the other side',
    where: { de: 'Dekapolis, danach Dalmanutha', en: 'Decapolis, then Dalmanutha' },
    lat: 32.8604, lon: 35.6464, placeId: 'ae8d09d',
    ref: { de: 'Markus 8,1-13', en: 'Mark 8:1-13' },
    text: {
      de: 'Dieselbe Geschichte noch einmal, diesmal in heidnischem Gebiet und mit anderen Zahlen: sieben Brote, sieben Körbe. Danach verlangen Pharisäer ein Zeichen vom Himmel – und bekommen als Antwort, dass es keines geben wird.',
      en: 'The same story again, this time in Gentile country and with different numbers: seven loaves, seven baskets. Afterwards Pharisees demand a sign from heaven – and are told there will not be one.',
    },
    people: [],
  },
  {
    id: 'bethsaida-blind', act: 'galilee', book: 'Mark',
    de: 'Die Heilung in zwei Schritten', en: 'The healing in two goes',
    where: { de: 'Betsaida', en: 'Bethsaida' },
    lat: 32.9104, lon: 35.631, placeId: 'a91b732',
    ref: { de: 'Markus 8,22-26', en: 'Mark 8:22-26' },
    text: {
      de: 'Die einzige Heilung, die beim ersten Mal nicht ganz gelingt: Der Mann sieht Menschen wie Bäume umhergehen. Markus stellt sie genau vor die Frage nach dem Bekenntnis – die Jünger sehen ihn ähnlich unscharf.',
      en: 'The one healing that does not fully work the first time: the man sees people like trees walking. Mark places it right before the question of the confession – the disciples see him just as blurrily.',
    },
    people: [],
  },
  {
    id: 'peters-confession', act: 'galilee', book: 'Mark',
    de: '„Wer sagt ihr, dass ich sei?“', en: '"Who do you say that I am?"',
    where: { de: 'Cäsarea Philippi, am Fuß des Hermon', en: 'Caesarea Philippi, below Mount Hermon' },
    lat: 33.2461, lon: 35.6933, placeId: 'ab7bf48',
    ref: { de: 'Markus 8,27-33', en: 'Mark 8:27-33' },
    text: {
      de: 'Der nördlichste Punkt, an dem er war – eine Stadt voller Götterschreine, benannt nach dem Kaiser. Hier fällt das Bekenntnis, und unmittelbar danach der erste Widerspruch: Petrus nimmt ihn beiseite, als er vom Sterben spricht.',
      en: 'The northernmost point he reached – a town full of pagan shrines, named after the emperor. Here comes the confession, and immediately after it the first objection: Peter takes him aside when he speaks of dying.',
    },
    people: ['petrus'],
  },
  {
    id: 'transfiguration', act: 'galilee', book: 'Mark',
    de: 'Auf dem Berg', en: 'On the mountain',
    where: { de: 'Ein hoher Berg – Hermon oder Tabor, die Tradition schwankt', en: 'A high mountain – Hermon or Tabor, tradition is divided' },
    lat: 33.4, lon: 35.85, placeId: 'a341fe8',
    ref: { de: 'Markus 9,2-13', en: 'Mark 9:2-13' },
    text: {
      de: 'Sechs Tage nach dem Bekenntnis nimmt er drei mit hinauf. Mose und Elia stehen da – Gesetz und Propheten. Petrus schlägt drei Hütten vor, weil ihm nichts Besseres einfällt; Markus schreibt trocken dazu, dass er nicht wusste, was er sagte.',
      en: 'Six days after the confession he takes three up with him. Moses and Elijah stand there – law and prophets. Peter proposes three shelters because nothing better comes to mind; Mark notes drily that he did not know what he was saying.',
    },
    people: ['petrus', 'jakobus-zebedaeus', 'johannes-zebedaeus'],
  },
  {
    id: 'boy-at-the-foot', act: 'galilee', book: 'Mark',
    de: 'Unten am Berg', en: 'Down at the foot',
    where: { de: 'Am Fuß des Berges', en: 'At the foot of the mountain' },
    lat: 33.24, lon: 35.7,
    ref: { de: 'Markus 9,14-29', en: 'Mark 9:14-29' },
    text: {
      de: 'Während oben das Licht ist, stehen unten neun Jünger vor einem kranken Jungen und schaffen es nicht. Der Vater sagt den ehrlichsten Satz der Evangelien – und bekommt trotzdem, worum er bittet.',
      en: 'While the light is up on the mountain, nine disciples stand below with a sick boy and cannot manage. The father says the most honest line in the gospels – and gets what he asks for anyway.',
    },
    quote: { de: '„Ich glaube; hilf meinem Unglauben!“', en: '"I believe; help my unbelief!"' },
    people: [],
  },
  {
    id: 'who-is-greatest', act: 'galilee', book: 'Mark',
    de: 'Worüber sie unterwegs gestritten haben', en: 'What they argued about on the road',
    where: { de: 'Kapernaum, im Haus', en: 'Capernaum, in the house' },
    lat: 32.8811, lon: 35.575, placeId: 'af2161c',
    ref: { de: 'Markus 9,33-37', en: 'Mark 9:33-37' },
    text: {
      de: 'Er fragt, worüber sie unterwegs geredet haben, und sie schweigen – sie hatten darüber gestritten, wer der Größte sei, kurz nachdem er zum zweiten Mal vom Sterben gesprochen hat. Er stellt ein Kind in die Mitte, ein Wesen ohne Rang und ohne Stimme, und nimmt es in den Arm.',
      en: 'He asks what they were discussing on the way, and they say nothing – they had been arguing about who was greatest, right after he spoke of dying for the second time. He puts a child in the middle, a person of no rank and no voice, and takes it in his arms.',
    },
    people: ['petrus'],
  },
  {
    id: 'temple-tax', act: 'galilee', book: 'Matt',
    de: 'Die Münze im Fisch', en: 'The coin in the fish',
    where: { de: 'Kapernaum', en: 'Capernaum' },
    lat: 32.8811, lon: 35.575, placeId: 'af2161c',
    ref: { de: 'Matthäus 17,24-27', en: 'Matt 17:24-27' },
    text: {
      de: 'Die Einzieher der Tempelsteuer fragen Petrus, ob sein Meister zahlt. Die Antwort ist grundsätzlich – Söhne zahlen nicht – und endet trotzdem mit: damit wir keinen Anstoß geben. Es ist das kurioseste Wunder der Evangelien.',
      en: 'The temple-tax collectors ask Peter whether his master pays. The answer is a matter of principle – sons do not pay – and still ends with: so that we give no offence. It is the oddest miracle in the gospels.',
    },
    people: ['petrus'],
  },

  /* ================= Akt 5: Der Weg nach Jerusalem ===================== */
  {
    id: 'set-his-face', act: 'road', book: 'Luke',
    de: 'Er wendet sein Angesicht', en: 'He sets his face',
    where: { de: 'Aufbruch aus Galiläa, durch Samarien', en: 'Leaving Galilee, through Samaria' },
    lat: 32.2761, lon: 35.195, placeId: 'a041bb3',
    ref: { de: 'Lukas 9,51-56', en: 'Luke 9:51-56' },
    text: {
      de: 'Ab hier hat der Bericht eine Richtung. Ein samaritisches Dorf lässt ihn nicht übernachten, weil er nach Jerusalem will; die Donnersöhne wollen Feuer vom Himmel holen. Er weist sie zurecht und geht in ein anderes Dorf.',
      en: 'From here the account has a direction. A Samaritan village refuses him lodging because he is headed for Jerusalem; the sons of thunder want fire from heaven. He rebukes them and goes to another village.',
    },
    people: ['jakobus-zebedaeus', 'johannes-zebedaeus'],
  },
  {
    id: 'seventy-sent', act: 'road', book: 'Luke',
    de: 'Die Zweiundsiebzig', en: 'The seventy-two',
    where: { de: 'In die Orte, in die er kommen wollte', en: 'Into the towns he meant to visit' },
    lat: 32.0, lon: 35.3,
    ref: { de: 'Lukas 10,1-24', en: 'Luke 10:1-24' },
    text: {
      de: 'Diesmal sind es nicht zwölf, sondern zweiundsiebzig – so viele Völker zählt das 1. Buch Mose auf der Erde. Sie kommen zurück und freuen sich über ihre Macht; er verschiebt den Grund zur Freude, noch bevor sie sich daran gewöhnen.',
      en: 'This time not twelve but seventy-two – as many nations as Genesis counts on the earth. They come back delighted with their power; he moves the reason for joy before they get used to it.',
    },
    people: [],
  },
  {
    id: 'good-samaritan-road', act: 'road', book: 'Luke',
    de: 'Die Straße nach Jericho', en: 'The Jericho road',
    where: { de: 'Zwischen Jerusalem und Jericho, 1000 Höhenmeter abwärts', en: 'Between Jerusalem and Jericho, a 1000-metre descent' },
    lat: 31.83, lon: 35.34,
    ref: { de: 'Lukas 10,25-37', en: 'Luke 10:25-37' },
    text: {
      de: 'Die Straße im Gleichnis gab es wirklich: 27 Kilometer durch unübersichtliche Schluchten, berüchtigt für Überfälle. Wer im Gleichnis vorbeigeht, hat gute Gründe – Priester durften Tote nicht berühren. Hilfe kommt von dem, den die Zuhörer verachteten.',
      en: 'The road in the parable was real: 27 kilometres through blind ravines, notorious for robbery. Those who pass by have good reasons – priests could not touch a corpse. Help comes from the man the audience despised.',
    },
    people: [],
  },
  {
    id: 'martha-mary', act: 'road', book: 'Luke',
    de: 'Zwei Schwestern und ein Vorwurf', en: 'Two sisters and a complaint',
    where: { de: 'Betanien bei Jerusalem', en: 'Bethany near Jerusalem' },
    lat: 31.7717, lon: 35.2559, placeId: 'a4f35bc',
    ref: { de: 'Lukas 10,38-42', en: 'Luke 10:38-42' },
    text: {
      de: 'Marta bewirtet, Maria sitzt zu seinen Füßen – der Platz eines Schülers, den Frauen nicht einnahmen. Marta beschwert sich nicht bei der Schwester, sondern beim Gast. Die Antwort nimmt ihr die Arbeit nicht weg, aber den Vorrang.',
      en: 'Martha serves, Mary sits at his feet – a student’s place, not one women took. Martha complains not to her sister but to the guest. The answer does not take her work away, only its priority.',
    },
    people: ['marta', 'maria-betanien'],
  },
  {
    id: 'tabernacles', act: 'road', book: 'John',
    de: 'Laubhüttenfest in Jerusalem', en: 'Tabernacles in Jerusalem',
    where: { de: 'Jerusalem, im Tempel', en: 'Jerusalem, in the temple' },
    lat: 31.7784, lon: 35.2354, placeId: 'a15257a',
    ref: { de: 'Johannes 7-8', en: 'John 7-8' },
    text: {
      de: 'Am Fest wurde täglich Wasser aus dem Teich Siloah zum Altar getragen und der Vorhof mit Leuchtern erhellt. Genau dazu sagt er seine beiden Sätze: vom Wasser und vom Licht. Die Wache soll ihn holen und kommt ohne ihn zurück.',
      en: 'At the feast water was carried daily from the pool of Siloam to the altar and the court lit with lamps. It is to exactly that that he says his two lines: about water and about light. The guards sent to arrest him come back without him.',
    },
    people: ['nikodemus'],
  },
  {
    id: 'man-born-blind', act: 'road', book: 'John',
    de: 'Der Blindgeborene am Teich', en: 'The man born blind',
    where: { de: 'Jerusalem, Teich Siloah', en: 'Jerusalem, the pool of Siloam' },
    lat: 31.7703, lon: 35.2353, placeId: 'a294859',
    ref: { de: 'Johannes 9', en: 'John 9' },
    text: {
      de: 'Ein ganzes Kapitel für einen Bettler: Erst fragen die Jünger, wer schuld ist. Dann wird er verhört, dann seine Eltern, die sich aus Angst herausreden, dann er noch einmal – bis er hinausgeworfen wird. Erst danach findet Jesus ihn wieder.',
      en: 'A whole chapter for a beggar: first the disciples ask whose fault it is. Then he is interrogated, then his parents, who dodge out of fear, then him again – until he is thrown out. Only afterwards does Jesus find him again.',
    },
    quote: { de: '„Eines weiß ich: dass ich blind war und bin nun sehend.“', en: '"One thing I know, that though I was blind, now I see."' },
    people: ['blindgeborener'],
  },
  {
    id: 'children-blessed', act: 'road', book: 'Mark',
    de: 'Lasst die Kinder durch', en: 'Let the children through',
    where: { de: 'Jenseits des Jordan', en: 'Beyond the Jordan' },
    lat: 31.8375, lon: 35.5583,
    ref: { de: 'Markus 10,13-16', en: 'Mark 10:13-16' },
    text: {
      de: 'Die Jünger sortieren die Warteschlange und weisen die Kinder ab – vernünftig, denn ein Lehrer hatte Wichtigeres zu tun. Es ist die zweite Stelle, an der Markus ihn ausdrücklich unwillig nennt. Er nimmt die Kinder in den Arm und legt ihnen die Hände auf.',
      en: 'The disciples manage the queue and turn the children away – sensibly, for a teacher had more important things to do. It is the second place where Mark calls him indignant outright. He takes the children in his arms and lays his hands on them.',
    },
    people: [],
  },
  {
    id: 'rich-man', act: 'road', book: 'Mark',
    de: 'Der Mann, der traurig weggeht', en: 'The man who walks away sad',
    where: { de: 'Unterwegs, jenseits des Jordan', en: 'On the road, beyond the Jordan' },
    lat: 31.8375, lon: 35.5583,
    ref: { de: 'Markus 10,17-31', en: 'Mark 10:17-31' },
    text: {
      de: 'Er läuft ihm hinterher und kniet nieder – von allen, die kommen, der Frommste. Markus notiert, dass Jesus ihn ansah und liebhatte, bevor er das Unmögliche verlangt. Es ist die einzige Berufung, die abgelehnt wird.',
      en: 'He runs after him and kneels – of all who come, the most devout. Mark notes that Jesus looked at him and loved him before asking the impossible. It is the one call that is turned down.',
    },
    people: ['reicher-juengling', 'petrus'],
  },
  {
    id: 'sons-of-zebedee', act: 'road', book: 'Mark',
    de: 'Die Bitte um die beiden besten Plätze', en: 'The request for the two best seats',
    where: { de: 'Unterwegs, hinauf nach Jerusalem', en: 'On the road, going up to Jerusalem' },
    lat: 31.85, lon: 35.5,
    ref: { de: 'Markus 10,35-45', en: 'Mark 10:35-45' },
    also: { de: 'Matthäus 20,20-28', en: 'Matt 20:20-28' },
    text: {
      de: 'Unmittelbar nach der dritten Ankündigung seines Todes fragen zwei nach den Ehrenplätzen rechts und links – bei Matthäus fragt ihre Mutter für sie. Die anderen zehn sind empört, vermutlich nicht aus Demut. Die Antwort dreht die Rangordnung um: Wer oben stehen will, bedient die anderen.',
      en: 'Right after the third announcement of his death two ask for the seats of honour at his right and left – in Matthew their mother asks for them. The other ten are indignant, probably not out of humility. The answer inverts the order: whoever wants the top serves the rest.',
    },
    quote: { de: '„Der Menschensohn ist nicht gekommen, dass er sich dienen lasse, sondern dass er diene.“', en: '"The Son of Man came not to be served but to serve."' },
    people: ['jakobus-zebedaeus', 'johannes-zebedaeus', 'salome'],
  },
  {
    id: 'perea', act: 'road', book: 'Luke',
    de: 'Die Gleichnisse jenseits des Jordan', en: 'The parables beyond the Jordan',
    where: { de: 'Peräa, wo der Täufer angefangen hatte', en: 'Perea, where the Baptist had begun' },
    lat: 31.8375, lon: 35.5583,
    ref: { de: 'Lukas 15', en: 'Luke 15' },
    also: { de: 'Johannes 10,40-42', en: 'John 10:40-42' },
    text: {
      de: 'Weil Zöllner und Sünder ihm zuhören und die Frommen murren, erzählt er drei Geschichten über Verlorenes: ein Schaf, eine Münze, einen Sohn. Die dritte hat kein Ende – der ältere Bruder steht noch draußen, als der Vorhang fällt.',
      en: 'Because tax collectors and sinners listen to him and the pious grumble, he tells three stories about things lost: a sheep, a coin, a son. The third has no ending – the older brother is still outside when the curtain falls.',
    },
    people: [],
  },
  {
    id: 'ten-lepers', act: 'road', book: 'Luke',
    de: 'Zehn werden rein, einer kommt zurück', en: 'Ten are cleansed, one comes back',
    where: { de: 'Zwischen Samarien und Galiläa', en: 'Between Samaria and Galilee' },
    lat: 32.2761, lon: 35.195, placeId: 'a041bb3',
    ref: { de: 'Lukas 17,11-19', en: 'Luke 17:11-19' },
    text: {
      de: 'Zehn Aussätzige bleiben auf Rufweite stehen, wie es das Gesetz verlangt. Er schickt sie zu den Priestern, und unterwegs werden sie rein. Einer kehrt um und dankt – ausgerechnet der Samaritaner, der Einzige, den kein Priester in Jerusalem angesehen hätte.',
      en: 'Ten men with leprosy keep their distance, as the law required. He sends them to the priests, and on the way they are cleansed. One turns back to give thanks – the Samaritan, of all people, the one no priest in Jerusalem would have looked at.',
    },
    people: [],
  },
  {
    id: 'lazarus', act: 'road', book: 'John',
    de: 'Vier Tage zu spät', en: 'Four days too late',
    where: { de: 'Betanien, drei Kilometer vor Jerusalem', en: 'Bethany, three kilometres from Jerusalem' },
    lat: 31.7717, lon: 35.2559, placeId: 'a4f35bc',
    ref: { de: 'Johannes 11,1-44', en: 'John 11:1-44' },
    text: {
      de: 'Er bekommt die Nachricht und bleibt zwei Tage, wo er ist. Beide Schwestern sagen ihm denselben Vorwurf ins Gesicht. Vor dem Grab steht der kürzeste Vers der Bibel: Jesus weinte – und danach der Ruf, der den Rat zum Beschluss bringt, ihn zu töten.',
      en: 'He gets the message and stays where he is for two days. Both sisters say the same reproach to his face. Before the tomb stands the shortest verse in the Bible: Jesus wept – and then the shout that makes the council decide to kill him.',
    },
    people: ['lazarus', 'marta', 'maria-betanien', 'thomas', 'kaiphas'],
  },
  {
    id: 'ephraim', act: 'road', book: 'John',
    de: 'Untergetaucht in Ephraim', en: 'Lying low in Ephraim',
    where: { de: 'Ephraim am Rand der Wüste', en: 'Ephraim on the edge of the wilderness' },
    lat: 31.9544, lon: 35.3003, placeId: 'a507da9',
    ref: { de: 'Johannes 11,54', en: 'John 11:54' },
    text: {
      de: 'Ein einziger Vers Rückzug: Nach dem Todesbeschluss zeigt er sich nicht mehr öffentlich, sondern bleibt mit den Jüngern in einem Ort am Wüstenrand – die letzte ruhige Zeit vor dem Fest.',
      en: 'A single verse of retreat: after the death sentence he no longer moves about openly but stays with the disciples in a town at the desert’s edge – the last quiet stretch before the feast.',
    },
    people: [],
  },
  {
    id: 'bartimaeus', act: 'road', book: 'Mark',
    de: 'Der Blinde, der nicht still ist', en: 'The blind man who will not be quiet',
    where: { de: 'Am Weg aus Jericho hinauf', en: 'On the road up out of Jericho' },
    lat: 31.8717, lon: 35.4446, placeId: 'a231f80',
    ref: { de: 'Markus 10,46-52', en: 'Mark 10:46-52' },
    text: {
      de: 'Er ruft ihn mit einem Königstitel an, und die Leute fahren ihn an, er solle schweigen. Als er gerufen wird, wirft er den Mantel weg – das, worauf er als Bettler die Münzen sammelte, und das Einzige, was er besaß.',
      en: 'He hails him with a royal title, and the crowd tells him to shut up. When he is called he throws off his cloak – what he collected coins on as a beggar, and the only thing he owned.',
    },
    people: ['bartimaeus'],
  },
  {
    id: 'zacchaeus', act: 'road', book: 'Luke',
    de: 'Der Mann auf dem Baum', en: 'The man in the tree',
    where: { de: 'Jericho', en: 'Jericho' },
    lat: 31.8717, lon: 35.4446, placeId: 'a231f80',
    ref: { de: 'Lukas 19,1-10', en: 'Luke 19:1-10' },
    text: {
      de: 'Jericho war eine Zollstadt am Balsamhandel; der Oberzöllner war reich geworden an seinen Nachbarn. Jesus lädt sich bei ihm ein, und die Stadt ist empört. Was er danach zurückzahlt, geht über das Gesetz hinaus.',
      en: 'Jericho was a customs town on the balsam trade; the chief tax collector had grown rich off his neighbours. Jesus invites himself in, and the town is outraged. What he then pays back goes beyond the law.',
    },
    people: ['zachaeus'],
  },
  {
    id: 'anointing-bethany', act: 'road', book: 'John',
    de: 'Das Öl, das ein Jahresgehalt kostet', en: 'The ointment worth a year’s wages',
    where: { de: 'Betanien, sechs Tage vor dem Passa', en: 'Bethany, six days before Passover' },
    lat: 31.7717, lon: 35.2559, placeId: 'a4f35bc',
    ref: { de: 'Johannes 12,1-11', en: 'John 12:1-11' },
    also: { de: 'Markus 14,3-9', en: 'Mark 14:3-9' },
    text: {
      de: 'Dreihundert Denare, ausgegossen in einer Minute. Der Einwand klingt sozial und kommt vom Kassenwart. Jesus deutet es anders: Sie hat ihn im Voraus zum Begräbnis gesalbt – niemand sonst kam später dazu.',
      en: 'Three hundred denarii, poured out in a minute. The objection sounds socially minded and comes from the man with the purse. Jesus reads it differently: she has anointed him for burial in advance – nobody else got the chance later.',
    },
    people: ['maria-betanien', 'marta', 'lazarus', 'judas'],
  },

  /* ================= Akt 6: Die letzte Woche =========================== */
  {
    id: 'palm-sunday', act: 'passion', book: 'Mark',
    de: 'Einzug auf einem Esel', en: 'Entry on a donkey',
    where: { de: 'Von Betfage über den Ölberg nach Jerusalem', en: 'From Bethphage over the Mount of Olives into Jerusalem' },
    lat: 31.7776, lon: 35.2508, placeId: 'abff59d',
    day: { de: 'Sonntag', en: 'Sunday' },
    ref: { de: 'Markus 11,1-11', en: 'Mark 11:1-11' },
    also: { de: 'Lukas 19,28-44; Johannes 12,12-19', en: 'Luke 19:28-44; John 12:12-19' },
    text: {
      de: 'Auf der anderen Seite der Stadt zog um dieselbe Zeit Pilatus mit Truppen ein, wie zu jedem Fest. Diese Prozession hat ein Fohlen und Mäntel auf der Straße. Lukas hält fest, dass er beim Anblick der Stadt weinte.',
      en: 'On the other side of the city Pilate rode in with troops at the same time, as at every feast. This procession has a colt and cloaks on the road. Luke records that at the sight of the city he wept.',
    },
    people: ['petrus'],
  },
  {
    id: 'temple-and-fig', act: 'passion', book: 'Mark',
    de: 'Der Feigenbaum und die Tische', en: 'The fig tree and the tables',
    where: { de: 'Jerusalem, Vorhof der Heiden', en: 'Jerusalem, the court of the Gentiles' },
    lat: 31.7784, lon: 35.2354, placeId: 'a15257a',
    day: { de: 'Montag', en: 'Monday' },
    ref: { de: 'Markus 11,12-19', en: 'Mark 11:12-19' },
    text: {
      de: 'Markus schiebt die Tempelszene zwischen die beiden Hälften der Feigenbaumgeschichte – ein Kommentar ohne Worte. Der Handel fand im einzigen Vorhof statt, den Nichtjuden betreten durften; genau darauf zielt das Zitat vom Bethaus für alle Völker.',
      en: 'Mark sandwiches the temple scene between the two halves of the fig-tree story – a comment without words. The trading took place in the only court Gentiles could enter; that is exactly what the quotation about a house of prayer for all nations is aimed at.',
    },
    people: [],
  },
  {
    id: 'debates', act: 'passion', book: 'Mark',
    de: 'Ein Tag der Fragen', en: 'A day of questions',
    where: { de: 'Jerusalem, im Tempel', en: 'Jerusalem, in the temple' },
    lat: 31.7784, lon: 35.2354, placeId: 'a15257a',
    day: { de: 'Dienstag', en: 'Tuesday' },
    ref: { de: 'Markus 11,27-12,44', en: 'Mark 11:27-12:44' },
    text: {
      de: 'Vier Gruppen stellen Fangfragen: nach der Vollmacht, nach der Steuer an den Kaiser, nach der Auferstehung, nach dem größten Gebot. Am Ende sieht er einer Witwe zu, die zwei der kleinsten Münzen einwirft, und redet nur noch über sie.',
      en: 'Four groups set traps: about authority, about the tax to Caesar, about the resurrection, about the greatest commandment. At the end he watches a widow put in two of the smallest coins, and talks about nobody else.',
    },
    people: [],
  },
  {
    id: 'olivet-discourse', act: 'passion', book: 'Mark',
    de: 'Blick auf den Tempel', en: 'Looking back at the temple',
    where: { de: 'Auf dem Ölberg, dem Tempel gegenüber', en: 'On the Mount of Olives, opposite the temple' },
    lat: 31.778, lon: 35.2457, placeId: 'ac2c4c5',
    day: { de: 'Dienstag', en: 'Tuesday' },
    ref: { de: 'Markus 13', en: 'Mark 13' },
    text: {
      de: 'Ein Jünger staunt über die Steine – manche wogen über zehn Tonnen. Die Antwort: Kein Stein bleibt auf dem anderen. Vierzig Jahre später war es so. Der Rest der Rede handelt davon, wach zu bleiben, ohne Termine zu rechnen.',
      en: 'A disciple marvels at the stones – some weighed over ten tonnes. The answer: not one stone will be left on another. Forty years later that was the case. The rest of the speech is about staying awake without doing sums on dates.',
    },
    people: ['petrus', 'jakobus-zebedaeus', 'johannes-zebedaeus', 'andreas'],
  },
  {
    id: 'betrayal-bargain', act: 'passion', book: 'Mark',
    de: 'Dreißig Silberstücke', en: 'Thirty pieces of silver',
    where: { de: 'Jerusalem, im Haus des Hohenpriesters', en: 'Jerusalem, in the high priest’s house' },
    lat: 31.7742, lon: 35.2295, placeId: 'a15257a',
    day: { de: 'Mittwoch', en: 'Wednesday' },
    ref: { de: 'Markus 14,1-2.10-11', en: 'Mark 14:1-2, 10-11' },
    text: {
      de: 'Der Rat will ihn nicht am Fest verhaften – zu viele Pilger, zu hohes Risiko eines Aufruhrs. Judas löst das Problem: Er bietet an, den Ort zu nennen, an dem Jesus nachts ohne Menge ist. Der Preis entspricht dem eines Sklaven.',
      en: 'The council does not want to arrest him at the feast – too many pilgrims, too great a risk of riot. Judas solves the problem: he offers to name the place where Jesus is at night without a crowd. The price is that of a slave.',
    },
    people: ['judas', 'kaiphas'],
  },
  {
    id: 'last-supper', act: 'passion', book: 'John',
    de: 'Das letzte Mahl', en: 'The last supper',
    where: { de: 'Jerusalem, ein Obergemach', en: 'Jerusalem, an upper room' },
    lat: 31.7717, lon: 35.2292, placeId: 'a15257a',
    day: { de: 'Donnerstagabend', en: 'Thursday evening' },
    ref: { de: 'Johannes 13-17', en: 'John 13-17' },
    also: { de: 'Markus 14,12-26; Lukas 22,7-38', en: 'Mark 14:12-26; Luke 22:7-38' },
    text: {
      de: 'Johannes erzählt kein Brot und keinen Kelch, sondern eine Schüssel Wasser: Der Gastgeber tut, was der niedrigste Sklave tat. Am selben Tisch sitzt der, der ihn verkauft hat, und der, der ihn in wenigen Stunden nicht kennen will.',
      en: 'John tells of no bread and no cup but a basin of water: the host does what the lowest slave did. At the same table sit the man who has sold him and the man who in a few hours will not know him.',
    },
    quote: { de: '„Ein neues Gebot gebe ich euch, dass ihr euch untereinander liebt.“', en: '"A new commandment I give to you, that you love one another."' },
    people: ['petrus', 'judas', 'johannes-zebedaeus', 'thomas', 'philippus', 'thaddaeus'],
  },
  {
    id: 'gethsemane', act: 'passion', book: 'Mark',
    de: 'Gethsemane', en: 'Gethsemane',
    where: { de: 'Ein Ölgarten am Fuß des Ölbergs', en: 'An olive grove at the foot of the Mount of Olives' },
    lat: 31.7794, lon: 35.2394, placeId: 'a42418f',
    day: { de: 'Donnerstagnacht', en: 'Thursday night' },
    ref: { de: 'Markus 14,32-52', en: 'Mark 14:32-52' },
    also: { de: 'Lukas 22,39-53; Johannes 18,1-12', en: 'Luke 22:39-53; John 18:1-12' },
    text: {
      de: 'Er bittet dreimal darum, dass es nicht sein muss, und dreimal schlafen die drei, die er mitgenommen hat. Der Kuss als Erkennungszeichen war nötig, weil es dunkel war. Petrus greift zum Schwert und trifft ein Ohr; Lukas berichtet, dass Jesus es heilt.',
      en: 'Three times he asks that it need not be, and three times the three he brought along fall asleep. The kiss as a signal was needed because it was dark. Peter draws a sword and takes off an ear; Luke reports that Jesus heals it.',
    },
    people: ['petrus', 'jakobus-zebedaeus', 'johannes-zebedaeus', 'judas', 'malchus'],
  },
  {
    id: 'annas-caiaphas', act: 'passion', book: 'John',
    de: 'Fünf Verhöre in einer Nacht', en: 'Five hearings in one night',
    where: { de: 'Jerusalem, Haus des Hohenpriesters', en: 'Jerusalem, the high priest’s house' },
    lat: 31.7742, lon: 35.2295, placeId: 'a15257a',
    day: { de: 'Nacht zum Freitag', en: 'The night into Friday' },
    ref: { de: 'Johannes 18,12-27', en: 'John 18:12-27' },
    also: { de: 'Markus 14,53-72', en: 'Mark 14:53-72' },
    text: {
      de: 'Erst zum Altmeister Hannas, dann vor den Rat. Zeugen widersprechen sich; das Urteil hängt schließlich an seiner eigenen Antwort. Draußen im Hof wärmt sich Petrus am Feuer und sagt dreimal, er kenne den Mann nicht – dann kräht ein Hahn.',
      en: 'First to old Annas, then before the council. Witnesses contradict each other; the verdict finally hangs on his own answer. Outside in the courtyard Peter warms himself at the fire and says three times he does not know the man – then a cock crows.',
    },
    people: ['hannas', 'kaiphas', 'petrus', 'johannes-zebedaeus'],
  },
  {
    id: 'judas-end', act: 'passion', book: 'Matt',
    de: 'Er bringt das Geld zurück', en: 'He brings the money back',
    where: { de: 'Jerusalem, im Tempel', en: 'Jerusalem, in the temple' },
    lat: 31.7784, lon: 35.2354, placeId: 'a15257a',
    day: { de: 'Freitag früh', en: 'Friday, early' },
    ref: { de: 'Matthäus 27,3-10', en: 'Matt 27:3-10' },
    text: {
      de: 'Als das Urteil feststeht, reut es ihn. Er bringt die dreißig Silberstücke zurück und bekommt die kälteste Antwort der Passionsgeschichte: „Was geht uns das an? Da sieh du zu!“ Er wirft das Geld in den Tempel und erhängt sich; gekauft wird davon ein Friedhof für Fremde.',
      en: 'When the verdict is settled he is seized with remorse. He brings the thirty pieces of silver back and gets the coldest line in the passion story: "What is that to us? See to it yourself." He throws the money into the temple and hangs himself; with it a burial ground for foreigners is bought.',
    },
    people: ['judas', 'kaiphas'],
  },
  {
    id: 'pilate', act: 'passion', book: 'John',
    de: 'Vor dem Präfekten', en: 'Before the prefect',
    where: { de: 'Jerusalem, im Prätorium', en: 'Jerusalem, in the praetorium' },
    lat: 31.7799, lon: 35.2331, placeId: 'aec23b1',
    day: { de: 'Freitag früh', en: 'Friday, early' },
    ref: { de: 'Johannes 18,28-19,16', en: 'John 18:28-19:16' },
    also: { de: 'Markus 15,1-15; Lukas 23,1-25', en: 'Mark 15:1-15; Luke 23:1-25' },
    text: {
      de: 'Nur Rom durfte hinrichten, also muss aus Gotteslästerung Hochverrat werden: ein König neben dem Kaiser. Pilatus sagt dreimal, er finde keine Schuld, und gibt nach, als das Wort „Freund des Kaisers“ fällt. Er lässt die Wahl zwischen zwei Gefangenen.',
      en: 'Only Rome could execute, so blasphemy has to become treason: a king beside Caesar. Pilate says three times that he finds no guilt, and gives way when the phrase "friend of Caesar" is used. He offers a choice between two prisoners.',
    },
    people: ['pilatus', 'kaiphas', 'barabbas'],
  },
  {
    id: 'herod-antipas', act: 'passion', book: 'Luke',
    de: 'Der Umweg zu Herodes', en: 'The detour to Herod',
    where: { de: 'Jerusalem, Palast des Antipas', en: 'Jerusalem, the palace of Antipas' },
    lat: 31.7767, lon: 35.2276, placeId: 'a15257a',
    day: { de: 'Freitag früh', en: 'Friday, early' },
    ref: { de: 'Lukas 23,6-12', en: 'Luke 23:6-12' },
    text: {
      de: 'Pilatus schiebt den Fall an den Landesfürsten, weil der Angeklagte Galiläer ist. Antipas will endlich ein Wunder sehen und bekommt kein Wort. Lukas notiert das Ergebnis des Tages: Die beiden Männer, vorher verfeindet, wurden Freunde.',
      en: 'Pilate passes the case to the tetrarch because the accused is a Galilean. Antipas finally wants to see a miracle and gets not one word. Luke notes the day’s result: the two men, enemies before, became friends.',
    },
    people: ['herodes-antipas', 'pilatus'],
  },
  {
    id: 'via-crucis', act: 'passion', book: 'Luke',
    de: 'Der Weg zur Schädelstätte', en: 'The road to the place of the skull',
    where: { de: 'Durch die Stadt hinaus vor das Tor', en: 'Through the city and out of the gate' },
    lat: 31.7784, lon: 35.2298, placeId: 'a631d35',
    day: { de: 'Freitag', en: 'Friday' },
    ref: { de: 'Lukas 23,26-32', en: 'Luke 23:26-32' },
    text: {
      de: 'Verurteilte trugen den Querbalken selbst; dass ein Passant dazu gezwungen wird, sagt genug über seinen Zustand nach der Geißelung. Zu den weinenden Frauen sagt er, sie sollten über sich selbst weinen – vierzig Jahre vor der Belagerung.',
      en: 'The condemned carried the crossbeam themselves; that a passer-by is forced to do it says enough about his state after the flogging. To the weeping women he says they should weep for themselves – forty years before the siege.',
    },
    people: ['simon-kyrene'],
  },
  {
    id: 'golgotha', act: 'passion', book: 'John',
    de: 'Golgatha', en: 'Golgotha',
    where: { de: 'Vor dem Tor, an der Straße', en: 'Outside the gate, by the road' },
    lat: 31.7784, lon: 35.2298, placeId: 'a631d35',
    day: { de: 'Freitag, dritte bis neunte Stunde', en: 'Friday, the third to the ninth hour' },
    ref: { de: 'Johannes 19,17-30', en: 'John 19:17-30' },
    also: { de: 'Markus 15,22-41; Lukas 23,33-49', en: 'Mark 15:22-41; Luke 23:33-49' },
    text: {
      de: 'Kreuzigungen fanden an belebten Straßen statt; das war der Zweck. Die vier Evangelien überliefern zusammen sieben Sätze von ihm – darunter die Sorge um seine Mutter, die Bitte für die Soldaten und der Schrei aus Psalm 22. Ein römischer Offizier zieht als Erster den Schluss.',
      en: 'Crucifixions took place on busy roads; that was the point. Between them the four gospels record seven sentences from him – among them the care for his mother, the plea for the soldiers and the cry from Psalm 22. A Roman officer is the first to draw the conclusion.',
    },
    quote: { de: '„Es ist vollbracht.“', en: '"It is finished."' },
    people: ['maria', 'maria-magdalena', 'maria-klopas', 'salome', 'johannes-zebedaeus', 'hauptmann-kreuz'],
  },
  {
    id: 'burial', act: 'passion', book: 'John',
    de: 'Ein fremdes Grab', en: 'Somebody else’s tomb',
    where: { de: 'Ein Garten nahe der Hinrichtungsstätte', en: 'A garden near the place of execution' },
    lat: 31.7784, lon: 35.2298, placeId: 'a631d35',
    day: { de: 'Freitag vor Sonnenuntergang', en: 'Friday before sunset' },
    ref: { de: 'Johannes 19,38-42', en: 'John 19:38-42' },
    text: {
      de: 'Hingerichtete kamen normalerweise in ein Massengrab. Zwei Ratsherren, die bis dahin heimlich glaubten, treten in dieser Stunde öffentlich auf: Der eine bittet Pilatus um den Leichnam, der andere bringt Spezereien in einer Menge, die zu einem König passt.',
      en: 'The executed normally went into a common grave. Two council members who had believed in secret step out publicly in this hour: one asks Pilate for the body, the other brings spices in a quantity fit for a king.',
    },
    people: ['josef-arimathaea', 'nikodemus', 'maria-magdalena', 'pilatus'],
  },
  {
    id: 'sealed-tomb', act: 'passion', book: 'Matt',
    de: 'Ein Stein, ein Siegel, eine Wache', en: 'A stone, a seal, a guard',
    where: { de: 'Am Grab', en: 'At the tomb' },
    lat: 31.7784, lon: 35.2298, placeId: 'a631d35',
    day: { de: 'Sabbat', en: 'Sabbath' },
    ref: { de: 'Matthäus 27,62-66', en: 'Matt 27:62-66' },
    text: {
      de: 'Der einzige Tag der Evangelien, an dem nichts geschieht. Die Gegner erinnern sich an eine Ankündigung, an die die Jünger sich nicht erinnern, und lassen das Grab sichern. Die Frauen halten den Sabbat und warten auf den Morgen.',
      en: 'The one day in the gospels when nothing happens. His opponents remember an announcement the disciples have forgotten, and have the tomb secured. The women keep the sabbath and wait for morning.',
    },
    people: ['pilatus', 'kaiphas'],
  },

  /* ================= Akt 7: Der dritte Tag und danach ================== */
  {
    id: 'empty-tomb', act: 'risen', book: 'John',
    de: 'Der Stein ist weg', en: 'The stone is gone',
    where: { de: 'Am Grab, im Dunkeln', en: 'At the tomb, while it is still dark' },
    lat: 31.7784, lon: 35.2298, placeId: 'a631d35',
    ref: { de: 'Johannes 20,1-10', en: 'John 20:1-10' },
    also: { de: 'Markus 16,1-8; Lukas 24,1-12', en: 'Mark 16:1-8; Luke 24:1-12' },
    text: {
      de: 'Frauen kommen mit Spezereien und finden das Grab offen. Sie holen zwei Jünger; die laufen, sehen die Leinentücher liegen und gehen wieder nach Hause. Markus’ ältester Schluss endet mit Frauen, die sich fürchten und niemandem etwas sagen.',
      en: 'Women come with spices and find the tomb open. They fetch two disciples; the two run, see the linen cloths lying there and go home again. Mark’s oldest ending closes with women who are afraid and say nothing to anyone.',
    },
    people: ['maria-magdalena', 'petrus', 'johannes-zebedaeus', 'johanna', 'maria-klopas', 'salome'],
  },
  {
    id: 'mary-in-the-garden', act: 'risen', book: 'John',
    de: 'Sie hält ihn für den Gärtner', en: 'She takes him for the gardener',
    where: { de: 'Im Garten am Grab', en: 'In the garden by the tomb' },
    lat: 31.7784, lon: 35.2298, placeId: 'a631d35',
    ref: { de: 'Johannes 20,11-18', en: 'John 20:11-18' },
    text: {
      de: 'Sie bleibt, als alle weg sind, und weint. Erkannt wird er an einem einzigen Wort: ihrem Namen. Die erste Zeugin der Auferstehung ist eine Frau, deren Aussage vor Gericht nichts wert war – kein Erfinder hätte das so aufgeschrieben.',
      en: 'She stays when everyone has gone, and weeps. He is recognised by a single word: her name. The first witness of the resurrection is a woman whose testimony was worthless in court – no inventor would have written it that way.',
    },
    people: ['maria-magdalena'],
  },
  {
    id: 'guards-report', act: 'risen', book: 'Matt',
    de: 'Die Wache wird bezahlt', en: 'The guard is paid off',
    where: { de: 'Jerusalem', en: 'Jerusalem' },
    lat: 31.7784, lon: 35.2354, placeId: 'a15257a',
    ref: { de: 'Matthäus 28,11-15', en: 'Matt 28:11-15' },
    text: {
      de: 'Matthäus erzählt, was seine Gegner erzählten: Die Jünger hätten den Leichnam gestohlen, während die Wache schlief. Er schreibt es auf, um es zu widerlegen – und überliefert damit den ältesten Einwand gegen Ostern. Beide Seiten waren sich einig, dass das Grab leer war; sie stritten darüber, warum.',
      en: 'Matthew tells what his opponents were telling: the disciples stole the body while the guard slept. He writes it down to refute it – and so preserves the oldest objection to Easter. Both sides agreed the tomb was empty; they disagreed about why.',
    },
    people: ['kaiphas'],
  },
  {
    id: 'emmaus', act: 'risen', book: 'Luke',
    de: 'Elf Kilometer mit einem Fremden', en: 'Eleven kilometres with a stranger',
    where: { de: 'Auf dem Weg nach Emmaus', en: 'On the road to Emmaus' },
    lat: 31.7929, lon: 35.1642, placeId: 'ae7274b',
    ref: { de: 'Lukas 24,13-35', en: 'Luke 24:13-35' },
    text: {
      de: 'Zwei verlassen die Stadt, an dem Tag, an dem alles vorbei ist. Der Fremde lässt sich erst die ganze Geschichte erzählen, bevor er sie neu erzählt. Erkannt wird er nicht an der Auslegung, sondern an der Handbewegung beim Brotbrechen.',
      en: 'Two leave the city on the day it is all over. The stranger first has the whole story told to him before he retells it. He is recognised not by the exposition but by a gesture in the breaking of bread.',
    },
    people: ['kleopas'],
  },
  {
    id: 'upper-room', act: 'risen', book: 'John',
    de: 'Hinter verschlossenen Türen', en: 'Behind locked doors',
    where: { de: 'Jerusalem, im Obergemach', en: 'Jerusalem, in the upper room' },
    lat: 31.7717, lon: 35.2292, placeId: 'a15257a',
    ref: { de: 'Johannes 20,19-23', en: 'John 20:19-23' },
    also: { de: 'Lukas 24,36-49', en: 'Luke 24:36-49' },
    text: {
      de: 'Sie haben sich aus Angst eingeschlossen. Sein erstes Wort an die, die weggelaufen sind, ist kein Vorwurf, sondern Friede – und er zeigt die Hände. Lukas erzählt, dass er ein Stück gebratenen Fisch isst, damit klar ist, dass er kein Gespenst ist.',
      en: 'They have locked themselves in out of fear. His first word to the men who ran away is not a reproach but peace – and he shows his hands. Luke says he eats a piece of grilled fish, so that it is clear he is no ghost.',
    },
    people: ['petrus', 'johannes-zebedaeus'],
  },
  {
    id: 'thomas', act: 'risen', book: 'John',
    de: 'Acht Tage später', en: 'Eight days later',
    where: { de: 'Jerusalem, im selben Raum', en: 'Jerusalem, in the same room' },
    lat: 31.7717, lon: 35.2292, placeId: 'a15257a',
    ref: { de: 'Johannes 20,24-29', en: 'John 20:24-29' },
    text: {
      de: 'Er hatte gefehlt und weigert sich, es zu glauben. Eine Woche lang bleibt er trotzdem bei den anderen. Als Jesus kommt, wiederholt er Thomas’ Bedingung Wort für Wort – und ob Thomas wirklich hinfasst, sagt der Text nicht.',
      en: 'He was absent and refuses to believe it. For a week he stays with the others anyway. When Jesus comes he repeats Thomas’ condition word for word – and whether Thomas actually touches him the text does not say.',
    },
    quote: { de: '„Mein Herr und mein Gott!“', en: '"My Lord and my God!"' },
    people: ['thomas'],
  },
  {
    id: 'sea-of-tiberias', act: 'risen', book: 'John',
    de: 'Frühstück am Ufer', en: 'Breakfast on the shore',
    where: { de: 'Am See Tiberias', en: 'By the Sea of Tiberias' },
    lat: 32.7736, lon: 35.5442, placeId: 'ac9adc9',
    ref: { de: 'Johannes 21', en: 'John 21' },
    text: {
      de: 'Sie sind zurück am See und fischen wieder – die ganze Nacht umsonst. Am Feuer, dem zweiten Kohlenfeuer des Evangeliums, fragt er Petrus dreimal dasselbe. Dreimal Verleugnung, dreimal Frage: Es ist kein Verhör, sondern eine Wiedereinsetzung.',
      en: 'They are back at the lake, fishing again – all night for nothing. At the fire, the gospel’s second charcoal fire, he asks Peter the same thing three times. Three denials, three questions: it is not an interrogation but a reinstatement.',
    },
    people: ['petrus', 'thomas', 'natanael', 'jakobus-zebedaeus', 'johannes-zebedaeus'],
  },
  {
    id: 'galilee-mountain', act: 'risen', book: 'Matt',
    de: 'Auf dem Berg in Galiläa', en: 'On the mountain in Galilee',
    where: { de: 'Ein Berg in Galiläa', en: 'A mountain in Galilee' },
    lat: 32.6863, lon: 35.3929, placeId: 'acd63ee',
    ref: { de: 'Matthäus 28,16-20', en: 'Matt 28:16-20' },
    text: {
      de: 'Elf Männer, und Matthäus schreibt ungeschönt dazu: einige zweifelten. Denen wird der Auftrag gegeben, zu allen Völkern zu gehen. Das Evangelium endet ohne Abschied – mit der Zusage, dass er bleibt.',
      en: 'Eleven men, and Matthew notes without gloss: some doubted. It is to them that the commission is given, to go to all nations. The gospel ends without a farewell – with the promise that he stays.',
    },
    quote: { de: '„Ich bin bei euch alle Tage bis an der Welt Ende.“', en: '"I am with you always, to the end of the age."' },
    people: ['petrus', 'andreas', 'jakobus-zebedaeus', 'johannes-zebedaeus', 'philippus', 'natanael', 'matthaeus', 'thomas', 'jakobus-alphaeus', 'thaddaeus', 'simon-zelot'],
  },
  {
    id: 'ascension', act: 'risen', book: 'Luke',
    de: 'Der Abschied bei Betanien', en: 'The parting at Bethany',
    where: { de: 'Am Ölberg, bei Betanien', en: 'On the Mount of Olives, near Bethany' },
    lat: 31.778, lon: 35.2457, placeId: 'ac2c4c5',
    ref: { de: 'Lukas 24,50-53', en: 'Luke 24:50-53' },
    also: { de: 'Apostelgeschichte 1,6-12', en: 'Acts 1:6-12' },
    text: {
      de: 'Die letzte Frage der Jünger ist eine politische: Stellst du jetzt das Reich wieder her? Die Antwort verschiebt sie und gibt ihnen stattdessen einen Auftrag und eine Richtung – bis an das Ende der Erde. Dort beginnt die Apostelgeschichte.',
      en: 'The disciples’ last question is a political one: are you restoring the kingdom now? The answer sets it aside and gives them a task and a direction instead – to the ends of the earth. That is where Acts begins.',
    },
    people: ['maria', 'petrus', 'jakobus-bruder'],
  },
];

export const STATION_BY_ID: Record<string, GospelStation> = Object.fromEntries(
  STATIONS.map((s) => [s.id, s]),
);

/** Die Stationen eines Akts, in der Reihenfolge der Erzählung. */
export function stationsInAct(actId: string): GospelStation[] {
  return STATIONS.filter((s) => s.act === actId);
}

/** Wo jemand vorkommt – die Grundlage des Personenfilters. */
export const STATIONS_BY_PERSON: Record<string, GospelStation[]> = (() => {
  const out: Record<string, GospelStation[]> = {};
  for (const s of STATIONS) for (const p of s.people) (out[p] ??= []).push(s);
  return out;
})();

/** Nur die Personen, die auch wirklich in einer Station stehen. */
export const PEOPLE_WITH_SCENES: GospelPerson[] = PEOPLE.filter(
  (p) => p.id === 'jesus' || (STATIONS_BY_PERSON[p.id]?.length ?? 0) > 0,
);

/** Wie viele Stationen jeder Akt trägt – für die Akt-Leiste. */
export const ACT_COUNTS: Record<string, number> = Object.fromEntries(
  ACTS.map((a) => [a.id, stationsInAct(a.id).length]),
);
