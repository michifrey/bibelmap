// Was nach dem letzten biblischen Buch weitergeschrieben wurde.
//
// Die Tora enthält Gebote, aber kaum Anwendungsregeln. „Du sollst am Sabbat
// keine Arbeit tun" – nur steht nirgends, was als Arbeit zählt. Genau diese
// Lücke füllt die Halacha, und sie füllt sie über anderthalb Jahrtausende: von
// den Regeln einer Wüstengemeinschaft am Toten Meer über die Mischna und die
// beiden Talmude bis zu einem gedruckten Handbuch aus Safed, nach dem bis
// heute entschieden wird.
//
// **Warum das in einem Bücherregal der Bibel steht.** Weil ein Regal, das
// mit der Offenbarung aufhört, den Eindruck erweckt, die Arbeit am Text sei
// mit dem Kanon fertig gewesen. Sie war es für niemanden – und die
// Gesetzestexte sind der Teil dieser Arbeit, der am weitesten von dem entfernt
// ist, was ein christlicher Leser über die Bibel zu wissen meint. Drei
// Ordnungen der Mischna legen 3. Mose aus; wer 3. Mose liest und nicht weiß,
// dass das existiert, liest ein Buch ohne seine Wirkungsgeschichte.
//
// **Die Breite der Rücken sagt hier nichts.** Auf dem biblischen Regal ist sie
// die Kapitelzahl. Diese Texte sind nicht in Kapiteln zu messen – der Talmud
// Bavli hat 2711 Blätter, die Mischna 63 Traktate, die Responsenliteratur
// keinen Umfang, sondern einen Zuwachs. Statt eine Zahl zu erfinden, stehen
// alle gleich breit, und der Umfang steht als Satz im Fenster daneben.
//
// Genannt wird, wer schrieb, wann und wogegen. Was strittig ist – ob Rabbi
// Jehuda ha-Nasi die Mischna verfasste oder redigierte, wie viel des
// Jeruschalmi verloren ist –, steht als strittig da.

import type { Bilingual } from './shelf';

export type LawKind = 'regel' | 'mischna' | 'midrasch' | 'talmud' | 'kommentar' | 'kodex' | 'gutachten';

export const LAW_KIND: Record<LawKind, { de: string; en: string }> = {
  regel: { de: 'Gemeinderegel', en: 'Community rule' },
  mischna: { de: 'Mischna', en: 'Mishnah' },
  midrasch: { de: 'Auslegungsmidrasch', en: 'Legal midrash' },
  talmud: { de: 'Talmud', en: 'Talmud' },
  kommentar: { de: 'Kommentar', en: 'Commentary' },
  kodex: { de: 'Gesetzbuch', en: 'Code' },
  gutachten: { de: 'Rechtsgutachten', en: 'Responsa' },
};

export interface LawText {
  id: string;
  kind: LawKind;
  /** Hebräisch, vokalisiert, und die Umschrift daneben. */
  hebrew: string;
  translit: string;
  de: string;
  en: string;
  /**
   * Der Name, wie er auf den Buchrücken passt. Die vollen Titel – „Schulchan
   * Aruch – Der gedeckte Tisch" – sind doppelt so lang wie ein Rücken hoch
   * ist und wurden vorn und hinten zugleich abgeschnitten. `check:shelf` hält
   * die Kurzform an derselben Obergrenze fest wie die Buchnamen.
   */
  shortDe: string;
  shortEn: string;
  /** Brett der Entstehungs-Ordnung – eine ID aus `PERIODS` in `shelf.ts`. */
  period: string;
  from: number;
  to: number;
  when: Bilingual;
  /** Wer – mit dem Vorbehalt, wo die Zuschreibung strittig ist. */
  who: Bilingual;
  /** Umfang in der Einheit, in der dieser Text gemessen wird. */
  extent: Bilingual;
  /** Was darin steht. */
  what: Bilingual;
  /** Was es mit der Bibel macht – der Grund, warum es hier steht. */
  bible: Bilingual;
  /** Biblische Bücher, die dieser Text auslegt (OSIS). */
  books: string[];
  /** Fund aus `finds.ts`, wenn der Text einem zu verdanken ist. */
  find?: string;
  wiki: string;
  wikiEn: string;
}

export const LAW_TEXTS: LawText[] = [
  {
    id: 'qumranregel', kind: 'regel',
    hebrew: 'סֶרֶךְ הַיַּחַד', translit: 'Serech ha-Jachad',
    de: 'Gemeinderegel und Damaskusschrift', en: 'Community Rule and Damascus Document',
    shortDe: 'Gemeinderegel', shortEn: 'Community Rule',
    period: 'hellen', from: -150, to: 70,
    when: { de: '2. Jh. v. Chr. bis 68 n. Chr.', en: '2nd century BC to AD 68' },
    who: {
      de: 'Eine namenlose Gemeinschaft am Toten Meer, meist mit den Essenern gleichgesetzt. Ihr Gründer heißt in den Texten nur „der Lehrer der Gerechtigkeit".',
      en: 'A nameless community by the Dead Sea, usually identified with the Essenes. Its founder is called in the texts only "the Teacher of Righteousness".',
    },
    extent: { de: 'Elf Kolumnen die Gemeinderegel; die Damaskusschrift in zwei mittelalterlichen Abschriften und acht Qumran-Handschriften.', en: 'Eleven columns for the Community Rule; the Damascus Document in two medieval copies and eight Qumran manuscripts.' },
    what: {
      de: 'Aufnahmeverfahren, Rangordnung, Strafenkatalog, Sabbatregeln – das Recht einer Gruppe, die sich vom Tempel in Jerusalem getrennt hat, weil sie ihn für unrein hielt. 4QMMT, ein Brief über „einige Werke der Tora", listet die strittigen Punkte auf.',
      en: 'Admission procedure, rank order, penal code, sabbath rules – the law of a group that had broken with the Jerusalem temple because it held it unclean. 4QMMT, a letter about "some works of the Torah", lists the points at issue.',
    },
    bible: {
      de: 'Der älteste erhaltene Versuch, die Gebote der Tora in eine lückenlose Lebensordnung zu übersetzen – zweihundert Jahre vor der Mischna und mit anderen Ergebnissen. Die Damaskusschrift lag zuerst in der Kairoer Geniza, bevor Qumran zeigte, wie alt sie ist.',
      en: 'The oldest surviving attempt to translate the Torah’s commands into a seamless order of life – two hundred years before the Mishnah and with different results. The Damascus Document first turned up in the Cairo Geniza, before Qumran showed how old it was.',
    },
    books: ['Lev', 'Deut', 'Num'],
    find: 'qumran',
    wiki: 'Gemeinderegel', wikiEn: 'Community Rule',
  },
  {
    id: 'mischna', kind: 'mischna',
    hebrew: 'מִשְׁנָה', translit: 'Mischna',
    de: 'Die Mischna', en: 'The Mishnah',
    shortDe: 'Die Mischna', shortEn: 'The Mishnah',
    period: 'mischnazeit', from: 180, to: 220,
    when: { de: 'um 200 n. Chr.', en: 'c. AD 200' },
    who: {
      de: 'Redigiert von Jehuda ha-Nasi in Galiläa, aus dem Stoff mehrerer Generationen. Ob er verfasste oder nur ordnete, ist in der Forschung offen.',
      en: 'Edited by Judah ha-Nasi in Galilee, out of material from several generations. Whether he composed or only arranged it is an open question.',
    },
    extent: { de: 'Sechs Ordnungen, 63 Traktate – Saaten, Fest, Frauen, Schäden, Heiliges, Reinheiten.', en: 'Six orders, 63 tractates – Seeds, Festival, Women, Damages, Holy Things, Purities.' },
    what: {
      de: 'Kein Kommentar, sondern ein eigenes Werk: Recht in kurzen Sätzen, nach Sachgebieten geordnet statt nach Bibelversen, und regelmäßig mit der Gegenmeinung dabei. „Rabbi X sagt … die Weisen aber sagen …" – ein Gesetzbuch, das den Widerspruch mit aufhebt.',
      en: 'Not a commentary but a work of its own: law in short sentences, ordered by subject rather than by biblical verse, and regularly with the dissenting view alongside. "Rabbi X says … but the sages say …" – a code that preserves disagreement.',
    },
    bible: {
      de: 'Nach dem Tempelbrand von 70 war der halbe Gesetzesstoff unanwendbar geworden. Die Mischna schreibt ihn trotzdem auf – die Opfer, die Priesterabgaben, die Tempelgeräte – und macht damit aus einer Praxis einen Text, der studiert werden kann, wenn er nicht mehr ausgeübt werden kann.',
      en: 'After the temple burned in 70, half the legal material had become inapplicable. The Mishnah writes it down all the same – the sacrifices, the priestly dues, the temple vessels – turning a practice into a text that can be studied when it can no longer be performed.',
    },
    books: ['Exod', 'Lev', 'Num', 'Deut'],
    wiki: 'Mischna', wikiEn: 'Mishnah',
  },
  {
    id: 'tosefta', kind: 'mischna',
    hebrew: 'תּוֹסֶפְתָּא', translit: 'Tosefta',
    de: 'Die Tosefta', en: 'The Tosefta',
    shortDe: 'Die Tosefta', shortEn: 'The Tosefta',
    period: 'mischnazeit', from: 200, to: 250,
    when: { de: '3. Jahrhundert n. Chr.', en: '3rd century AD' },
    who: { de: 'Anonym, aus demselben Lehrhausbetrieb wie die Mischna.', en: 'Anonymous, from the same house of study as the Mishnah.' },
    extent: { de: 'Derselbe Aufbau wie die Mischna, rund viermal so viel Text.', en: 'The same structure as the Mishnah, about four times as much text.' },
    what: {
      de: 'Der Name heißt „Zusatz". Zu fast jedem Mischna-Abschnitt steht hier die Langfassung: Begründungen, Beispielfälle, abweichende Überlieferungen. Manches wirkt älter als die Mischna selbst.',
      en: 'The name means "addition". For almost every Mishnah passage the long version stands here: reasons, example cases, divergent traditions. Some of it looks older than the Mishnah itself.',
    },
    bible: {
      de: 'Die Tosefta zeigt, wie viel weggelassen wurde, um die Mischna knapp zu halten – und dass es schon im 3. Jahrhundert mehr als eine Sammlung desselben Stoffes gab.',
      en: 'The Tosefta shows how much was left out to keep the Mishnah terse – and that already in the 3rd century there was more than one collection of the same material.',
    },
    books: ['Lev', 'Deut'],
    wiki: 'Tosefta', wikiEn: 'Tosefta',
  },
  {
    id: 'midrasch', kind: 'midrasch',
    hebrew: 'מִדְרְשֵׁי הֲלָכָה', translit: 'Midreschej Halacha',
    de: 'Mechilta, Sifra, Sifre', en: 'Mekhilta, Sifra, Sifre',
    shortDe: 'Midrasch Halacha', shortEn: 'Legal midrash',
    period: 'mischnazeit', from: 200, to: 300,
    when: { de: '3. Jahrhundert n. Chr.', en: '3rd century AD' },
    who: { de: 'Den Schulen Rabbi Akibas und Rabbi Jischmaels zugeschrieben; die Zuschreibungen sind Sammelnamen, keine Verfasserangaben.', en: 'Ascribed to the schools of Rabbi Akiva and Rabbi Ishmael; the ascriptions are collective labels, not statements of authorship.' },
    extent: { de: 'Je ein Werk zu 2. Mose (Mechilta), 3. Mose (Sifra) sowie 4. und 5. Mose (Sifre).', en: 'One work each on Exodus (Mekhilta), Leviticus (Sifra) and Numbers and Deuteronomy (Sifre).' },
    what: {
      de: 'Die Gegenform zur Mischna: Hier läuft die Auslegung Vers für Vers am Bibeltext entlang. Jede Regel wird an dem Wort festgemacht, aus dem sie kommen soll – und wo zwei Regeln sich widersprechen, wird der Streit am Buchstaben ausgetragen.',
      en: 'The counter-form to the Mishnah: here the exposition runs verse by verse along the biblical text. Every rule is pinned to the word it is meant to come from – and where two rules conflict, the dispute is fought out over the letter.',
    },
    bible: {
      de: 'Das direkteste Bindeglied zwischen Bibel und Halacha. Wer wissen will, wie aus „du sollst nicht kochen das Böcklein in der Milch seiner Mutter" die Trennung von Fleisch und Milch wurde, findet hier den Weg – Schritt für Schritt, nicht als Ergebnis.',
      en: 'The most direct link between Bible and halakhah. Anyone wanting to know how "you shall not boil a kid in its mother’s milk" became the separation of meat and milk finds the route here – step by step, not as a result.',
    },
    books: ['Exod', 'Lev', 'Num', 'Deut'],
    wiki: 'Midrasch', wikiEn: 'Midrash halakha',
  },
  {
    id: 'jerushalmi', kind: 'talmud',
    hebrew: 'תַּלְמוּד יְרוּשַׁלְמִי', translit: 'Talmud Jeruschalmi',
    de: 'Der Jerusalemer Talmud', en: 'The Jerusalem Talmud',
    shortDe: 'Jeruschalmi', shortEn: 'Jerusalem Talmud',
    period: 'talmudzeit', from: 350, to: 420,
    when: { de: 'um 400 n. Chr.', en: 'c. AD 400' },
    who: { de: 'Die Lehrhäuser in Tiberias, Sepphoris und Caesarea – trotz des Namens nicht Jerusalem, das Juden damals verschlossen war.', en: 'The academies of Tiberias, Sepphoris and Caesarea – despite the name not Jerusalem, which was then closed to Jews.' },
    extent: { de: 'Zu 39 der 63 Mischna-Traktate; vier der sechs Ordnungen brechen ab oder fehlen ganz.', en: 'On 39 of the 63 Mishnah tractates; four of the six orders break off or are missing entirely.' },
    what: {
      de: 'Die Auslegung der Mischna im Land Israel, in westaramäischer Sprache, knapp und oft unfertig. Die Arbeit brach vermutlich unter römischem Druck ab – der Text endet an mehreren Stellen mitten im Satz.',
      en: 'The exposition of the Mishnah in the land of Israel, in Western Aramaic, terse and often unfinished. The work probably broke off under Roman pressure – in several places the text stops mid-sentence.',
    },
    bible: {
      de: 'Für alles, was nur im Land gilt – Zehnte, Brachjahr, Ernteabgaben –, ist er die einzige durchgehende Auslegung. Der babylonische Talmud lässt genau diese Ordnung weitgehend aus: Sie betraf ihn nicht.',
      en: 'For everything that applies only in the land – tithes, the sabbatical year, harvest dues – it is the only continuous exposition. The Babylonian Talmud largely omits that order: it did not concern them.',
    },
    books: ['Lev', 'Deut'],
    wiki: 'Jerusalemer Talmud', wikiEn: 'Jerusalem Talmud',
  },
  {
    id: 'bavli', kind: 'talmud',
    hebrew: 'תַּלְמוּד בַּבְלִי', translit: 'Talmud Bawli',
    de: 'Der Babylonische Talmud', en: 'The Babylonian Talmud',
    shortDe: 'Talmud Bawli', shortEn: 'Talmud Bavli',
    period: 'talmudzeit', from: 450, to: 650,
    when: { de: '5. bis 7. Jahrhundert n. Chr.', en: '5th to 7th century AD' },
    who: { de: 'Die Akademien von Sura und Pumbedita; die Überlieferung nennt Rav Aschi und Rawina als Redaktoren, die anonyme Schlussbearbeitung reicht deutlich weiter.', en: 'The academies of Sura and Pumbedita; tradition names Rav Ashi and Ravina as editors, though the anonymous final redaction reaches considerably later.' },
    extent: { de: '2711 Blätter in 37 Traktaten – in jeder Ausgabe seit 1523 mit denselben Blattzahlen.', en: '2,711 folios in 37 tractates – with the same folio numbers in every edition since 1523.' },
    what: {
      de: 'Kein Gesetzbuch, sondern ein aufgezeichnetes Gespräch: Frage, Einwand, Gegeneinwand, Geschichte, Rückkehr zur Frage, oft ohne Entscheidung. Recht, Medizin, Traumdeutung und Anekdote stehen auf derselben Seite.',
      en: 'Not a code but a recorded conversation: question, objection, counter-objection, story, return to the question, often without a decision. Law, medicine, dream interpretation and anecdote stand on the same page.',
    },
    bible: {
      de: 'Der einflussreichste Text des Judentums nach der Bibel – und derjenige, durch den die Bibel im Judentum gelesen wird. Daniel Bombergs Druck in Venedig 1520–23 legte das Seitenbild fest: der Talmudtext in der Mitte, Raschi innen, die Tosafisten außen. Wer heute „Brachot 5a" sagt, meint dieselbe Seite wie damals.',
      en: 'The most influential Jewish text after the Bible – and the one through which the Bible is read in Judaism. Daniel Bomberg’s Venice printing of 1520–23 fixed the page layout: the Talmud text in the middle, Rashi on the inside, the Tosafists outside. Anyone saying "Berakhot 5a" today means the same page as then.',
    },
    books: ['Exod', 'Lev', 'Num', 'Deut'],
    wiki: 'Babylonischer Talmud', wikiEn: 'Talmud',
  },
  {
    id: 'raschi', kind: 'kommentar',
    hebrew: 'רַשִׁ״י', translit: 'Raschi',
    de: 'Der Kommentar Raschis', en: 'Rashi’s commentary',
    shortDe: 'Raschi', shortEn: 'Rashi',
    period: 'mittelalter', from: 1070, to: 1105,
    when: { de: '1070–1105', en: '1070–1105' },
    who: { de: 'Rabbi Schlomo ben Jizchak aus Troyes in der Champagne, Winzer und Lehrer; gestorben 1105.', en: 'Rabbi Shlomo ben Yitzchak of Troyes in Champagne, vintner and teacher; died 1105.' },
    extent: { de: 'Zu fast der ganzen Bibel und zum größten Teil des babylonischen Talmuds.', en: 'On almost the whole Bible and on most of the Babylonian Talmud.' },
    what: {
      de: 'Kein Gesetzbuch, sondern der Schlüssel zu beiden: kurze Erklärungen, die genau dort stehen, wo ein Leser stockt – ein seltenes Wort, ein Sprung im Gedankengang, ein unausgesprochener Bezug. Wo er nicht weiterweiß, schreibt er das hin.',
      en: 'Not a code but the key to both: short explanations set exactly where a reader stumbles – a rare word, a leap in the argument, an unspoken reference. Where he does not know, he writes that down.',
    },
    bible: {
      de: 'Seit tausend Jahren liest kaum jemand die hebräische Bibel ohne ihn. 1475 war sein Bibelkommentar das erste gedruckte hebräische Buch überhaupt – vor der Bibel selbst.',
      en: 'For a thousand years hardly anyone has read the Hebrew Bible without him. In 1475 his Bible commentary was the first Hebrew book ever printed – before the Bible itself.',
    },
    books: ['Gen', 'Exod', 'Lev', 'Num', 'Deut'],
    wiki: 'Raschi', wikiEn: 'Rashi',
  },
  {
    id: 'mischnetora', kind: 'kodex',
    hebrew: 'מִשְׁנֵה תּוֹרָה', translit: 'Mischne Tora',
    de: 'Mischne Tora', en: 'Mishneh Torah',
    shortDe: 'Mischne Tora', shortEn: 'Mishneh Torah',
    period: 'mittelalter', from: 1170, to: 1180,
    when: { de: '1170–1180', en: '1170–1180' },
    who: { de: 'Mose ben Maimon (Maimonides), Arzt am Hof in Kairo, geboren in Córdoba, gestorben 1204.', en: 'Moses ben Maimon (Maimonides), physician at the court in Cairo, born in Córdoba, died 1204.' },
    extent: { de: 'Vierzehn Bücher – daher der Beiname „ha-Jad ha-Chasaka", die starke Hand, weil die Zahl 14 im Hebräischen „Hand" schreibt.', en: 'Fourteen books – hence the nickname "ha-Yad ha-Chazakah", the strong hand, because the number 14 spells "hand" in Hebrew.' },
    what: {
      de: 'Das gesamte jüdische Recht in klarem Hebräisch, systematisch geordnet, entschieden – und ohne eine einzige Quellenangabe. Maimonides wollte ein Buch, nach dem man leben kann, ohne den Talmud zu befragen.',
      en: 'The whole of Jewish law in clear Hebrew, systematically ordered, decided – and without a single citation of sources. Maimonides wanted a book one could live by without consulting the Talmud.',
    },
    bible: {
      de: 'Genau das Weglassen der Quellen löste den heftigsten Gelehrtenstreit des Mittelalters aus: Ein Recht ohne Herleitung, hielten seine Gegner ihm vor, könne nicht geprüft werden. Spätere Ausgaben haben die Belege nachgetragen – von anderer Hand.',
      en: 'It was precisely the omission of sources that set off the fiercest scholarly quarrel of the Middle Ages: a law without derivation, his opponents objected, cannot be checked. Later editions supplied the references – in another hand.',
    },
    books: ['Exod', 'Lev', 'Num', 'Deut'],
    wiki: 'Mischne Tora', wikiEn: 'Mishneh Torah',
  },
  {
    id: 'turim', kind: 'kodex',
    hebrew: 'אַרְבָּעָה טוּרִים', translit: 'Arbaa Turim',
    de: 'Arbaa Turim – Die vier Säulen', en: 'Arba’ah Turim – The four columns',
    shortDe: 'Arbaa Turim', shortEn: 'Arba’ah Turim',
    period: 'mittelalter', from: 1300, to: 1340,
    when: { de: 'um 1320', en: 'c. 1320' },
    who: { de: 'Jakob ben Ascher, aus Köln nach Toledo geflohen, gestorben um 1340.', en: 'Jacob ben Asher, a refugee from Cologne to Toledo, died c. 1340.' },
    extent: { de: 'Vier Teile: Alltag und Gebet, Speise- und Reinheitsrecht, Familienrecht, Zivil- und Strafrecht.', en: 'Four parts: daily life and prayer, food and purity law, family law, civil and criminal law.' },
    what: {
      de: 'Der entscheidende Schnitt: Was seit dem Tempelbrand nicht mehr geübt werden kann – Opfer, Priesterdienst, Reinheitsgrade –, lässt dieses Buch weg. Übrig bleibt, was ein Mensch heute tun kann, und dazu nennt es die Meinungen der Vorgänger.',
      en: 'The decisive cut: whatever has been unpractisable since the temple burned – sacrifices, priestly service, degrees of purity – this book leaves out. What remains is what a person can actually do today, with the opinions of its predecessors named alongside.',
    },
    bible: {
      de: 'Die Vierteilung wurde zum Standard: Der Schulchan Aruch übernimmt zweihundert Jahre später Aufbau und Kapitelzählung, und bis heute zitiert man Halacha nach diesen vier Säulen.',
      en: 'The four-part division became the standard: two hundred years later the Shulchan Aruch takes over its structure and chapter numbering, and halakhah is still cited by these four columns today.',
    },
    books: ['Exod', 'Lev', 'Deut'],
    wiki: 'Arba’a Turim', wikiEn: 'Arba’ah Turim',
  },
  {
    id: 'schulchanaruch', kind: 'kodex',
    hebrew: 'שֻׁלְחָן עָרוּךְ', translit: 'Schulchan Aruch',
    de: 'Schulchan Aruch – Der gedeckte Tisch', en: 'Shulchan Aruch – The set table',
    shortDe: 'Schulchan Aruch', shortEn: 'Shulchan Aruch',
    period: 'neuzeit', from: 1555, to: 1578,
    when: { de: '1563 verfasst, 1565 gedruckt; die Ergänzung ab 1578', en: 'written 1563, printed 1565; the supplement from 1578' },
    who: { de: 'Josef Karo in Safed in Galiläa; die Ergänzungen von Mose Isserles in Krakau.', en: 'Joseph Karo in Safed in Galilee; the supplements by Moses Isserles in Kraków.' },
    extent: { de: 'Vier Teile nach dem Vorbild der Turim, in kurzen nummerierten Absätzen.', en: 'Four parts following the Turim, in short numbered paragraphs.' },
    what: {
      de: 'Karo schrieb für die sefardische Praxis und entschied nach der Mehrheit dreier Vorgänger. Isserles, Aschkenase, setzte seine abweichenden Bräuche als Randglossen daneben und nannte sie „Mappa", die Tischdecke: über Karos gedecktem Tisch.',
      en: 'Karo wrote for Sephardi practice, deciding by the majority of three predecessors. Isserles, an Ashkenazi, set his divergent customs beside it as marginal glosses and called them "Mappa", the tablecloth: over Karo’s set table.',
    },
    bible: {
      de: 'Erst beide zusammen wurden zum gemeinsamen Gesetzbuch – ein Werk, das die Unterschiede zwischen zwei Traditionen nicht einebnet, sondern nebeneinander druckt. Bis heute ist es der Text, nach dem Halacha entschieden wird.',
      en: 'Only the two together became the shared code – a work that does not level out the differences between two traditions but prints them side by side. To this day it is the text by which halakhah is decided.',
    },
    books: ['Exod', 'Lev', 'Deut'],
    wiki: 'Schulchan Aruch', wikiEn: 'Shulchan Aruch',
  },
  {
    id: 'responsen', kind: 'gutachten',
    hebrew: 'שְׁאֵלוֹת וּתְשׁוּבוֹת', translit: 'Sche’elot u-Teschuwot',
    de: 'Die Responsen', en: 'The responsa',
    shortDe: 'Die Responsen', shortEn: 'The responsa',
    period: 'neuzeit', from: 700, to: 1900,
    when: { de: 'seit dem 7. Jahrhundert, bis heute', en: 'from the 7th century to the present' },
    who: { de: 'Zuerst die Geonim in Babylonien, danach Rechtsgelehrte überall, wo es jüdische Gemeinden gab.', en: 'First the Geonim in Babylonia, then legal authorities wherever there were Jewish communities.' },
    extent: { de: 'Über 300.000 erhaltene Gutachten – kein abgeschlossener Text, sondern ein Bestand, der weiter wächst.', en: 'Over 300,000 surviving opinions – not a closed text but a body that keeps growing.' },
    what: {
      de: 'Recht als Briefwechsel: Eine Gemeinde schreibt einen Fall auf und schickt ihn an einen Gelehrten; die Antwort gilt zuerst für diesen Fall und wird dann zitiert. Die Fragen sind der Alltag – ein zerbrochener Ehevertrag, ein Geschäft am Feiertag, später Strom am Sabbat und eine Herztransplantation.',
      en: 'Law as correspondence: a community writes up a case and sends it to a scholar; the answer holds first for that case and is then cited. The questions are everyday life – a broken marriage contract, a business deal on a festival, later electricity on the sabbath and a heart transplant.',
    },
    bible: {
      de: 'Die Responsen sind der Ort, an dem die Auslegung nie fertig wird. Tausende von ihnen lagen in der Kairoer Geniza – Rechtsgutachten, die niemand aufbewahren wollte, aber auch niemand wegwerfen durfte.',
      en: 'The responsa are the place where exposition never finishes. Thousands of them lay in the Cairo Geniza – legal opinions nobody meant to keep, but which nobody was allowed to throw away.',
    },
    books: ['Exod', 'Deut'],
    find: 'geniza',
    wiki: 'Responsum', wikiEn: 'Responsa',
  },
];

export const LAW_BY_ID: Record<string, LawText> = Object.fromEntries(LAW_TEXTS.map((l) => [l.id, l]));

/**
 * Die 613 Gebote – der Satz über dem Regalfach, kein eigener Rücken.
 *
 * Er steht hier und nicht in der Oberfläche, weil er eine Quellenangabe
 * trägt: Die Zahl stammt von Rabbi Simlai im 3. Jahrhundert (Talmud Bavli,
 * Makkot 23b), die maßgebliche Aufzählung von Maimonides.
 */
export const MIZWOT: Bilingual = {
  de: 'Wie viele Gebote die Tora enthält, sagt sie selbst nicht. Rabbi Simlai kam im 3. Jahrhundert auf 613 – 365 Verbote, eines für jeden Tag des Sonnenjahres, und 248 Gebote, eines für jeden Körperteil, den man damals zählte (Talmud Bavli, Makkot 23b). Welche 613 es sind, war damit nicht entschieden: Maimonides schrieb ein eigenes Buch, um sie aufzuzählen, und schon sein Zeitgenosse Nachmanides widersprach der Liste.',
  en: 'How many commandments the Torah contains, it does not say. In the 3rd century Rabbi Simlai arrived at 613 – 365 prohibitions, one for each day of the solar year, and 248 commands, one for each part of the body as then counted (Babylonian Talmud, Makkot 23b). Which 613 they are was not thereby settled: Maimonides wrote a book of his own to list them, and his contemporary Nachmanides was already disputing the list.',
};
