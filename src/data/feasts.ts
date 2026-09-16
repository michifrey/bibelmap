// Die Feste Israels im Kreis des Jahres.
//
// Der Kalender hier ist der **schematische**: zwölf Monate, abwechselnd 30 und
// 29 Tage, zusammen 354. So rechnet er nicht wirklich – Cheschwan und Kislew
// haben mal 29, mal 30 Tage, und in sieben von neunzehn Jahren wird ein ganzer
// Monat eingeschoben (Adar I), damit Pessach nicht in den Winter wandert.
// Für ein Rad, das zeigen soll, *wann im Jahr* ein Fest liegt, ist das die
// richtige Vereinfachung; für ein Datum ist sie es nicht. Der Modus sagt das
// unter dem Rad auch.
//
// Die Monatsnamen (Nisan, Ijar, Siwan …) sind babylonisch und kommen erst mit
// dem Exil. Die Tora zählt die Monate durch – „im ersten Monat", „am zehnten
// Tag des siebten Monats" – und kennt daneben vier alte kanaanäische Namen.
// Beides steht hier, weil das eine ohne das andere ein falsches Bild gibt.
//
// `places` sind **englische** Namen, die zur Laufzeit gegen `places.json`
// aufgelöst werden – dieselbe Mechanik wie in `history.ts`. `npm run
// check:feasts` prüft, dass jeder auflöst, jeder Bibellink auf das Buch und
// Kapitel zeigt, das in seinem Label steht, und kein Tag außerhalb seines
// Monats liegt.

export interface HebrewMonth {
  id: string;
  /** Vokalisiert, wie er geschrieben wird. */
  hebrew: string;
  /** Umschrift in lateinischen Buchstaben. */
  translit: string;
  de: string;
  en: string;
  /** Tage im schematischen Jahr – siehe Kopf der Datei. */
  days: number;
  /** Ungefähre Lage im gregorianischen Jahr. */
  gregorian: { de: string; en: string };
  /**
   * Wo der Monat in der Bibel vorkommt – unter dem babylonischen Namen oder
   * unter seinem älteren. Prosa, kein Link: die Stellen sind Nachweise für den
   * Namen, nicht Lesestoff.
   */
  biblical?: { de: string; en: string };
}

/** Die zwölf Monate vom Frühjahr an – so zählt die Tora („dieser Monat sei euch der erste"). */
export const MONTHS: HebrewMonth[] = [
  {
    id: 'nisan', hebrew: 'נִיסָן', translit: 'Nisan', de: 'Nisan', en: 'Nisan', days: 30,
    gregorian: { de: 'März / April', en: 'March / April' },
    biblical: {
      de: 'Der erste Monat. Älterer Name: Abib, „Ährenmonat" (2. Mose 13,4); als Nisan in Ester 3,7 und Nehemia 2,1.',
      en: 'The first month. Older name: Abib, "month of ripening ears" (Exodus 13:4); as Nisan in Esther 3:7 and Nehemiah 2:1.',
    },
  },
  {
    id: 'ijar', hebrew: 'אִיָּר', translit: 'Ijar', de: 'Ijar', en: 'Iyar', days: 29,
    gregorian: { de: 'April / Mai', en: 'April / May' },
    biblical: {
      de: 'Älterer Name: Siw, der Monat, in dem Salomo den Tempelbau begann (1. Könige 6,1).',
      en: 'Older name: Ziv, the month Solomon began the temple (1 Kings 6:1).',
    },
  },
  {
    id: 'siwan', hebrew: 'סִיוָן', translit: 'Siwan', de: 'Siwan', en: 'Sivan', days: 30,
    gregorian: { de: 'Mai / Juni', en: 'May / June' },
    biblical: { de: 'Genannt in Ester 8,9.', en: 'Named in Esther 8:9.' },
  },
  {
    id: 'tammus', hebrew: 'תַּמּוּז', translit: 'Tammus', de: 'Tammus', en: 'Tammuz', days: 29,
    gregorian: { de: 'Juni / Juli', en: 'June / July' },
    biblical: {
      de: 'Trägt den Namen eines mesopotamischen Gottes – Hesekiel 8,14 sieht Frauen um ihn weinen.',
      en: 'Carries the name of a Mesopotamian god – Ezekiel 8:14 sees women weeping for him.',
    },
  },
  {
    id: 'aw', hebrew: 'אָב', translit: 'Aw', de: 'Aw', en: 'Av', days: 30,
    gregorian: { de: 'Juli / August', en: 'July / August' },
    biblical: {
      de: 'In der Bibel nur „der fünfte Monat" – der Monat, in dem der Tempel brannte.',
      en: 'In the Bible only "the fifth month" – the month the temple burned.',
    },
  },
  {
    id: 'elul', hebrew: 'אֱלוּל', translit: 'Elul', de: 'Elul', en: 'Elul', days: 29,
    gregorian: { de: 'August / September', en: 'August / September' },
    biblical: { de: 'Genannt in Nehemia 6,15 – die Mauer wird fertig.', en: 'Named in Nehemiah 6:15 – the wall is finished.' },
  },
  {
    id: 'tischri', hebrew: 'תִּשְׁרֵי', translit: 'Tischri', de: 'Tischri', en: 'Tishri', days: 30,
    gregorian: { de: 'September / Oktober', en: 'September / October' },
    biblical: {
      de: 'Der Monat der drei Herbstfeste. Älterer Name: Etanim (1. Könige 8,2).',
      en: 'The month of the three autumn feasts. Older name: Ethanim (1 Kings 8:2).',
    },
  },
  {
    id: 'cheschwan', hebrew: 'חֶשְׁוָן', translit: 'Cheschwan', de: 'Cheschwan', en: 'Cheshvan', days: 29,
    gregorian: { de: 'Oktober / November', en: 'October / November' },
    biblical: {
      de: 'Der einzige Monat ohne einen einzigen Festtag. Älterer Name: Bul (1. Könige 6,38).',
      en: 'The only month without a single festival day. Older name: Bul (1 Kings 6:38).',
    },
  },
  {
    id: 'kislew', hebrew: 'כִּסְלֵו', translit: 'Kislew', de: 'Kislew', en: 'Kislev', days: 30,
    gregorian: { de: 'November / Dezember', en: 'November / December' },
    biblical: { de: 'Genannt in Nehemia 1,1 und Sacharja 7,1.', en: 'Named in Nehemiah 1:1 and Zechariah 7:1.' },
  },
  {
    id: 'tewet', hebrew: 'טֵבֵת', translit: 'Tewet', de: 'Tewet', en: 'Tevet', days: 29,
    gregorian: { de: 'Dezember / Januar', en: 'December / January' },
    biblical: { de: 'Genannt in Ester 2,16.', en: 'Named in Esther 2:16.' },
  },
  {
    id: 'schwat', hebrew: 'שְׁבָט', translit: 'Schwat', de: 'Schwat', en: 'Shevat', days: 30,
    gregorian: { de: 'Januar / Februar', en: 'January / February' },
    biblical: { de: 'Genannt in Sacharja 1,7.', en: 'Named in Zechariah 1:7.' },
  },
  {
    id: 'adar', hebrew: 'אֲדָר', translit: 'Adar', de: 'Adar', en: 'Adar', days: 29,
    gregorian: { de: 'Februar / März', en: 'February / March' },
    biblical: {
      de: 'Genannt in Ester 3,7 und Esra 6,15. In sieben von neunzehn Jahren steht ein zweiter Adar davor.',
      en: 'Named in Esther 3:7 and Ezra 6:15. In seven years of nineteen a second Adar is inserted before it.',
    },
  },
];

export const MONTH_BY_ID: Record<string, HebrewMonth> = Object.fromEntries(
  MONTHS.map((m) => [m.id, m]),
);

/** Tage des schematischen Jahres – 354, die Summe der zwölf Monate. */
export const YEAR_DAYS = MONTHS.reduce((n, m) => n + m.days, 0);

/** Tag, an dem ein Monat im Jahr beginnt (0 = 1. Nisan). */
export function monthStart(monthId: string): number {
  let n = 0;
  for (const m of MONTHS) {
    if (m.id === monthId) return n;
    n += m.days;
  }
  return 0;
}

/**
 * Wo ein Bibelvers zu einem Fest steht – und in welchem Verhältnis.
 *
 *   `command` – wo das Fest geboten wird
 *   `story`   – wo es gefeiert wird oder vorkommt
 *   `nt`      – wo es im Neuen Testament wiederkehrt
 */
export interface FeastRef {
  osis: string;
  chapter: number;
  label: { de: string; en: string };
  kind: 'command' | 'story' | 'nt';
}

export interface FeastText {
  name: string;
  /** Zweiter geläufiger Name, falls es einen gibt. */
  also?: string;
  /** Wann im Jahr – in einem Satz. */
  when: string;
  /** Wovon aus gezählt wird: „zehn Tage nach …", „fünfzig Tage nach …". */
  count: string;
  /** Was gefeiert wird. */
  what: string;
  /** Was heute daraus geworden ist – jüdisch wie christlich. */
  today: string;
}

export interface Feast {
  id: string;
  hebrew: string;
  translit: string;
  /** Monat und erster Tag; `days` ist die Dauer. */
  month: string;
  day: number;
  days: number;
  /**
   * Familie: die drei Frühjahrsfeste hängen an der Gerstenernte, die drei
   * Herbstfeste am siebten Monat, die späten sind nach dem Exil entstanden,
   * der Fasttag ist kein Fest – und der Neumond gehört in keine davon, weil er
   * nicht einmal im Jahr kommt, sondern zwölfmal.
   */
  family: 'spring' | 'autumn' | 'later' | 'fast' | 'monthly';
  color: string;
  /**
   * Fällt auf jeden Monatsanfang statt auf einen Tag im Jahr. `month` und
   * `day` nennen dann die **erste** Begehung – im Rad steht das Fest trotzdem
   * zwölfmal, denn ein Neumond, den man einmal hinmalt, ist kein Neumond.
   */
  monthly?: true;
  /** Eines der drei Wallfahrtsfeste (2. Mose 23,14–17)? */
  pilgrimage?: boolean;
  de: FeastText;
  en: FeastText;
  refs: FeastRef[];
  places: string[];
  /** Zeichen im Rad, wenn kein Foto auflöst – Pfad in einem 24×24-Feld. */
  symbol: string;
}

export const FEASTS: Feast[] = [
  {
    id: 'neumond', hebrew: 'רֹאשׁ חֹדֶשׁ', translit: 'Rosch Chodesch',
    month: 'nisan', day: 1, days: 1, family: 'monthly', color: '#b9c4dc', monthly: true,
    symbol: 'M20 14a8 8 0 1 1-8-10 7 7 0 0 0 8 10z',
    de: {
      name: 'Neumond', also: 'Monatsanfang',
      when: 'Der erste Tag jedes Monats – zwölfmal im Jahr, und im Rad darum an jedem Monatsanfang.',
      count: 'Nicht gezählt, sondern gesehen: Der Monat begann, wenn zwei Zeugen die erste Mondsichel bezeugten. Bis ins vierte Jahrhundert n. Chr. wurde das vor Gericht festgestellt und mit Feuersignalen über die Bergkuppen weitergegeben – wer zu weit weg wohnte, beging den Festtag sicherheitshalber zweimal.',
      what: 'Der Anfang jedes Monats ist selbst ein Festtag: eigene Opfer, Hörnerschall über den Opfern, kein Handel. Die Tora gibt ihm keinen Namen und keine Begründung – er ist der Takt, an dem der ganze Kalender hängt. Wann Pessach ist, entscheidet sich am Neumond des ersten Monats; alles andere folgt daraus. Der Neumond des siebten Monats ist zugleich das Posaunenfest: Im Rad liegen die beiden auf demselben Strich. Und dass ein Fehlen auffiel, zeigt 1. Samuel 20 – Davids leerer Platz an Sauls Neumondstisch bringt die Sache ins Rollen.',
      today: 'Rosch Chodesch ist ein kleiner Feiertag geblieben: Am Sabbat davor wird der neue Monat angesagt, im Gottesdienst kommt ein eigenes Gebet dazu. In vielen Gemeinden gilt er besonders den Frauen – eine alte Überlieferung dankt ihnen dafür, dass sie ihren Schmuck nicht für das goldene Kalb hergaben. Jesaja sieht am Ende alle Menschen „von einem Neumond zum andern" kommen, und Kolosser 2 nennt Fest, Neumond und Sabbat in einem Atemzug: Schatten von dem, was kommt.',
    },
    en: {
      name: 'New moon', also: 'Rosh Chodesh',
      when: 'The first day of every month – twelve times a year, and so twelve times in the wheel, at every month’s beginning.',
      count: 'Not counted but seen: the month began when two witnesses testified to the first crescent. Until the fourth century AD this was established before a court and passed on by beacon fires from hilltop to hilltop – those too far away kept the festival day twice, to be safe.',
      what: 'The beginning of every month is itself a festival day: its own offerings, horns sounded over them, no trading. The Torah gives it no name and no reason – it is the beat the whole calendar hangs on. When Passover falls is settled at the new moon of the first month; everything else follows. The new moon of the seventh month is also the Feast of Trumpets: in the wheel the two sit on the same mark. And that an absence was noticed is clear from 1 Samuel 20 – David’s empty place at Saul’s new-moon table is what sets everything off.',
      today: 'Rosh Chodesh has remained a minor feast: the coming month is announced on the Sabbath before, and the service adds a prayer of its own. In many communities it belongs especially to women – an old tradition thanks them for not giving up their jewellery for the golden calf. Isaiah sees all people coming, at the end, "from new moon to new moon", and Colossians 2 names festival, new moon and Sabbath in one breath: a shadow of what is to come.',
    },
    refs: [
      { osis: 'Num', chapter: 10, label: { de: '4. Mose 10,10', en: 'Numbers 10:10' }, kind: 'command' },
      { osis: 'Num', chapter: 28, label: { de: '4. Mose 28,11–15', en: 'Numbers 28:11–15' }, kind: 'command' },
      { osis: '1Sam', chapter: 20, label: { de: '1. Samuel 20,5', en: '1 Samuel 20:5' }, kind: 'story' },
      { osis: 'Ps', chapter: 81, label: { de: 'Psalmen 81,4', en: 'Psalms 81:4' }, kind: 'story' },
      { osis: 'Isa', chapter: 66, label: { de: 'Jesaja 66,23', en: 'Isaiah 66:23' }, kind: 'story' },
      { osis: 'Col', chapter: 2, label: { de: 'Kolosser 2,16', en: 'Colossians 2:16' }, kind: 'nt' },
    ],
    places: ['Jerusalem', 'Gibeah'],
  },
  {
    id: 'pessach', hebrew: 'פֶּסַח', translit: 'Pesach',
    month: 'nisan', day: 14, days: 1, family: 'spring', color: '#a83a3a', pilgrimage: true,
    symbol: 'M7 21V5h10v16M4 21h16M7 9h10',
    de: {
      name: 'Pessach', also: 'Passa',
      when: '14. Nisan, am Abend – der vierzehnte Tag des ersten Monats.',
      count: 'Vier Tage vorher, am zehnten, wird das Lamm ausgesucht: Zeit genug, es anzusehen, bevor es geschlachtet wird.',
      what: 'Die Nacht des Auszugs. Ein Lamm je Haus, sein Blut an die beiden Türpfosten und die Oberschwelle gestrichen, das Fleisch in Eile gegessen, die Schuhe an den Füßen. Der Name kommt von dem Verb, das beschreibt, was in dieser Nacht geschieht: Gott geht an den gezeichneten Häusern vorüber. Am Morgen zieht ein Sklavenvolk frei hinaus – und soll diese Nacht von da an jedes Jahr erzählen, angestoßen von dem Kind, das fragt: „Was bedeutet euch dieser Brauch?"',
      today: 'Der Sederabend erzählt sie bis heute, mit vier Fragen, vier Bechern und einem Platz, der frei bleibt. Jesu letztes Mahl ist ein Passamahl, und die Kirche rechnet ihr Osterdatum immer noch nach dem Mond dieses Festes – deshalb wandert Ostern. Den kürzesten Kommentar dazu schreibt Paulus: „Auch wir haben ein Passalamm, das ist Christus."',
    },
    en: {
      name: 'Passover',
      when: '14 Nisan, in the evening – the fourteenth day of the first month.',
      count: 'Four days earlier, on the tenth, the lamb is chosen: long enough to look at it before it is killed.',
      what: 'The night of the exodus. One lamb per household, its blood struck on the two doorposts and the lintel, the meat eaten in haste, sandals on. The name comes from the verb for what happens that night: God passes over the marked houses. In the morning a nation of slaves walks out free – and is to retell that night every year after, prompted by the child who asks: "what does this rite mean to you?"',
      today: 'The Seder still tells it, with four questions, four cups and one place left empty. Jesus’ last meal is a Passover meal, and the church still sets Easter by the moon of this feast – which is why Easter moves. The shortest commentary on it is Paul’s: "Christ, our Passover lamb, has been sacrificed."',
    },
    refs: [
      { osis: 'Exod', chapter: 12, label: { de: '2. Mose 12', en: 'Exodus 12' }, kind: 'story' },
      { osis: 'Lev', chapter: 23, label: { de: '3. Mose 23,5', en: 'Leviticus 23:5' }, kind: 'command' },
      { osis: 'Deut', chapter: 16, label: { de: '5. Mose 16,1–8', en: 'Deuteronomy 16:1–8' }, kind: 'command' },
      { osis: 'Luke', chapter: 22, label: { de: 'Lukas 22,7–20', en: 'Luke 22:7–20' }, kind: 'nt' },
      { osis: '1Cor', chapter: 5, label: { de: '1. Korinther 5,7', en: '1 Corinthians 5:7' }, kind: 'nt' },
    ],
    places: ['Egypt', 'Goshen'],
  },
  {
    id: 'mazzot', hebrew: 'חַג הַמַּצּוֹת', translit: 'Chag ha-Mazzot',
    month: 'nisan', day: 15, days: 7, family: 'spring', color: '#c2812a', pilgrimage: true,
    symbol: 'M4 7h16v10H4zM8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01',
    de: {
      name: 'Fest der ungesäuerten Brote', also: 'Mazzot',
      when: '15. bis 21. Nisan – sieben Tage, direkt im Anschluss an Pessach.',
      count: 'Beginnt am Abend nach dem Passamahl. Die beiden Feste liegen so dicht beieinander, dass die Bibel sie oft in einem Atemzug nennt.',
      what: 'Sieben Tage ohne Sauerteig – nicht als Verzicht, sondern als Erinnerung an die Eile: Für aufgehenden Teig blieb keine Zeit. Vor dem Fest wird jeder Krümel Gesäuertes aus dem Haus geräumt; der erste und der siebte Tag sind Ruhetage. „Brot des Elends" nennt es 5. Mose – flach, hart, in Minuten gebacken, das Gegenteil von allem, was ein Zuhause braucht.',
      today: 'Im Judentum wird die Wohnung bis in die Ritzen von Chametz befreit, acht Tage lang gibt es Mazze. Paulus macht daraus ein Bild für eine Gemeinde, die sich von altem Sauerteig trennt. Und die Kirche, die das Fest nie übernommen hat, isst im Abendmahl trotzdem ungesäuertes Brot: Die Hostie ist eine Mazze.',
    },
    en: {
      name: 'Feast of Unleavened Bread', also: 'Matzot',
      when: '15 to 21 Nisan – seven days, running straight on from Passover.',
      count: 'Begins the evening after the Passover meal. The two feasts sit so close that the Bible often names them in one breath.',
      what: 'Seven days without leaven – not as abstinence but as a reminder of the haste: there was no time for dough to rise. Before the feast every crumb of leaven is cleared from the house; the first and the seventh day are days of rest. Deuteronomy calls it "the bread of affliction" – flat, hard, baked in minutes, the opposite of everything a home needs.',
      today: 'In Judaism the house is cleared of chametz down to the cracks, and for eight days there is matzah. Paul turns it into an image of a congregation parting with old leaven. And the church, which never took the feast over, still eats unleavened bread at communion: the wafer is a matzah.',
    },
    refs: [
      { osis: 'Exod', chapter: 12, label: { de: '2. Mose 12,15–20', en: 'Exodus 12:15–20' }, kind: 'command' },
      { osis: 'Lev', chapter: 23, label: { de: '3. Mose 23,6–8', en: 'Leviticus 23:6–8' }, kind: 'command' },
      { osis: 'Deut', chapter: 16, label: { de: '5. Mose 16,3', en: 'Deuteronomy 16:3' }, kind: 'command' },
      { osis: '1Cor', chapter: 5, label: { de: '1. Korinther 5,6–8', en: '1 Corinthians 5:6–8' }, kind: 'nt' },
    ],
    places: ['Succoth', 'Egypt'],
  },
  {
    id: 'omer', hebrew: 'הֲנָפַת הָעֹמֶר', translit: 'Hanafat ha-Omer',
    month: 'nisan', day: 16, days: 1, family: 'spring', color: '#a89321',
    symbol: 'M12 21V9M12 9c0-3 2-5 4-6 0 3-1 5-4 6zM12 9c0-3-2-5-4-6 0 3 1 5 4 6zM8 21h8',
    de: {
      name: 'Erstlingsgarbe', also: 'Omer',
      when: '„Am Tag nach dem Sabbat" in der Woche der ungesäuerten Brote – nach der verbreiteten Zählung der 16. Nisan.',
      count: 'Von diesem Tag an werden fünfzig Tage bis Schawuot gezählt. Welcher Tag gemeint ist, war schon zur Tempelzeit strittig: Die einen lasen „Sabbat" als den Wochensabbat, die anderen als den Festtag – zwei Kalender für dasselbe Gebot.',
      what: 'Die erste Garbe der Gerstenernte wird zum Heiligtum gebracht und geschwungen, bevor irgendjemand vom neuen Getreide isst. Ein winziges Ritual mit einer großen Logik: Der Anfang gehört dem, der ihn gibt, und wer den Anfang hergibt, bekommt den Rest als Geschenk zurück. In Gilgal, beim ersten Passa im Land, hört am Tag danach das Manna auf – vierzig Jahre Versorgung enden mit der ersten eigenen Ernte.',
      today: 'Im Judentum wird seit der Tempelzeit der Omer laut mitgezählt, Abend für Abend, sieben Wochen lang. Im Neuen Testament fällt die Auferstehung genau auf diesen Tag, und Paulus greift das Wort auf: „Christus ist auferstanden als Erstling derer, die entschlafen sind." Dieselbe Logik – der Anfang steht für alles, was noch kommt.',
    },
    en: {
      name: 'Sheaf of firstfruits', also: 'Omer',
      when: '"On the day after the Sabbath" in the week of unleavened bread – on the common reckoning, 16 Nisan.',
      count: 'From this day fifty days are counted to Shavuot. Which day is meant was already disputed in temple times: some read "Sabbath" as the weekly Sabbath, others as the festival day – two calendars for one command.',
      what: 'The first sheaf of the barley harvest is brought to the sanctuary and waved before anyone eats of the new grain. A tiny rite with a large logic: the beginning belongs to the giver, and whoever hands over the beginning gets the rest back as a gift. At Gilgal, at the first Passover in the land, the manna stops the day after – forty years of provision end with the first harvest of their own.',
      today: 'In Judaism the Omer has been counted aloud since temple times, evening by evening, for seven weeks. In the New Testament the resurrection falls on exactly this day, and Paul picks up the word: "Christ has been raised, the firstfruits of those who have fallen asleep." The same logic – the beginning stands for everything still to come.',
    },
    refs: [
      { osis: 'Lev', chapter: 23, label: { de: '3. Mose 23,9–14', en: 'Leviticus 23:9–14' }, kind: 'command' },
      { osis: 'Josh', chapter: 5, label: { de: 'Josua 5,10–12', en: 'Joshua 5:10–12' }, kind: 'story' },
      { osis: '1Cor', chapter: 15, label: { de: '1. Korinther 15,20–23', en: '1 Corinthians 15:20–23' }, kind: 'nt' },
    ],
    places: ['Gilgal', 'Jericho'],
  },
  {
    id: 'schawuot', hebrew: 'שָׁבוּעוֹת', translit: 'Schawuot',
    month: 'siwan', day: 6, days: 1, family: 'spring', color: '#d0a33c', pilgrimage: true,
    symbol: 'M4 20V7a3 3 0 0 1 3-3h3v16zM20 20V7a3 3 0 0 0-3-3h-3v16zM4 20h16',
    de: {
      name: 'Wochenfest', also: 'Pfingsten',
      when: '6. Siwan – fünfzig Tage nach der Erstlingsgarbe.',
      count: 'Sieben volle Wochen und noch einen Tag: sieben mal sieben plus eins. Der griechische Name ist schlicht diese Zahl – Pentekoste, „der Fünfzigste".',
      what: 'Das Erntefest des Weizens: Zwei Brote werden geschwungen, diesmal ausdrücklich gesäuert. Dazu gehört, mitten im Festkapitel, die Weisung, die Ränder des Feldes nicht abzuernten und die Nachlese liegen zu lassen – das Fest der Ernte ist auch das Fest derer, die keine haben. Es ist das zweite der drei Wallfahrtsfeste; wer konnte, ging dafür nach Jerusalem.',
      today: 'Die jüdische Überlieferung verbindet den Tag mit der Gabe der Tora am Sinai; die Tora selbst sagt das nicht, aber die Zeitangaben in 2. Mose 19 legen es nahe. In der Nacht wird gelernt, gelesen wird das Buch Rut – eine Erntegeschichte. Und an genau diesem Fest, als Jerusalem voller Pilger aus fünfzehn Ländern ist, geschieht Apostelgeschichte 2: Pfingsten ist Schawuot.',
    },
    en: {
      name: 'Feast of Weeks', also: 'Pentecost',
      when: '6 Sivan – fifty days after the sheaf of firstfruits.',
      count: 'Seven full weeks and one day more: seven times seven plus one. The Greek name is simply that number – Pentecost, "the fiftieth".',
      what: 'The wheat harvest festival: two loaves are waved, this time expressly leavened. And in the middle of the festival chapter stands the instruction not to reap the edges of the field or gather the gleanings – the feast of harvest is also the feast of those who have none. It is the second of the three pilgrimage feasts; whoever could went up to Jerusalem for it.',
      today: 'Jewish tradition ties the day to the giving of the Torah at Sinai; the Torah itself does not say so, though the dates in Exodus 19 invite it. The night is spent studying, and the book read is Ruth – a harvest story. And at exactly this feast, with Jerusalem full of pilgrims from fifteen countries, Acts 2 happens: Pentecost is Shavuot.',
    },
    refs: [
      { osis: 'Lev', chapter: 23, label: { de: '3. Mose 23,15–21', en: 'Leviticus 23:15–21' }, kind: 'command' },
      { osis: 'Deut', chapter: 16, label: { de: '5. Mose 16,9–12', en: 'Deuteronomy 16:9–12' }, kind: 'command' },
      { osis: 'Acts', chapter: 2, label: { de: 'Apostelgeschichte 2', en: 'Acts 2' }, kind: 'nt' },
    ],
    places: ['Mount Sinai', 'Jerusalem'],
  },
  {
    id: 'tischabeaw', hebrew: 'תִּשְׁעָה בְּאָב', translit: 'Tischa be-Aw',
    month: 'aw', day: 9, days: 1, family: 'fast', color: '#6b7f8c',
    symbol: 'M3 21h18M5 21v-5h5v5M14 21v-8h5v8M5 16l3-3M19 13l-3-2',
    de: {
      name: 'Neunter Aw',
      when: '9. Aw – ein Fasttag, kein Fest.',
      count: 'Drei Wochen nach dem Fasttag des vierten Monats, an dem die Mauer Jerusalems durchbrochen wurde.',
      what: 'Der Tag, an dem der Tempel brannte. Die Bibel nennt dafür zwei Daten – 2. Könige 25 den siebten, Jeremia 52 den zehnten Tag des fünften Monats –, die Überlieferung hat den neunten behalten. In der Tora steht dieser Tag nicht: Er ist in der Katastrophe entstanden, nicht am Sinai. Sacharja kennt ihn als einen von vier Fasttagen der Exilszeit und stellt ihnen eine Zusage gegenüber – sie sollen einmal zu Freudenfesten werden.',
      today: 'In der Nacht werden die Klagelieder gelesen, auf dem Boden sitzend, bei wenig Licht. Der Tag trägt längst mehr als eine Katastrophe: 586 v. Chr. und 70 n. Chr., dazu die Vertreibung aus Spanien 1492 – und in vielen Gemeinden das Gedenken an die Schoa.',
    },
    en: {
      name: 'Ninth of Av',
      when: '9 Av – a fast day, not a feast.',
      count: 'Three weeks after the fast of the fourth month, on which the wall of Jerusalem was breached.',
      what: 'The day the temple burned. The Bible gives two dates for it – 2 Kings 25 the seventh, Jeremiah 52 the tenth day of the fifth month – and tradition has kept the ninth. The day is not in the Torah: it was born out of catastrophe, not at Sinai. Zechariah knows it as one of four fasts of the exile, and sets a promise against them – they are to become feasts of joy.',
      today: 'At night Lamentations is read, sitting on the floor, in low light. The day has long carried more than one catastrophe: 586 BC and AD 70, the expulsion from Spain in 1492 – and in many communities the remembrance of the Shoah.',
    },
    refs: [
      { osis: '2Kgs', chapter: 25, label: { de: '2. Könige 25,8–9', en: '2 Kings 25:8–9' }, kind: 'story' },
      { osis: 'Jer', chapter: 52, label: { de: 'Jeremia 52,12–13', en: 'Jeremiah 52:12–13' }, kind: 'story' },
      { osis: 'Lam', chapter: 1, label: { de: 'Klagelieder 1', en: 'Lamentations 1' }, kind: 'story' },
      { osis: 'Zech', chapter: 8, label: { de: 'Sacharja 8,18–19', en: 'Zechariah 8:18–19' }, kind: 'story' },
    ],
    places: ['Jerusalem'],
  },
  {
    id: 'teruah', hebrew: 'יוֹם תְּרוּעָה', translit: 'Jom Terua',
    month: 'tischri', day: 1, days: 1, family: 'autumn', color: '#2f8f7f',
    symbol: 'M4 14c2-5 8-9 14-9 2 0 3 1 3 3 0 3-3 5-7 6-3 1-5 3-7 3-2 0-3-1-3-3z',
    de: {
      name: 'Posaunenfest', also: 'Rosch ha-Schana',
      when: '1. Tischri – der erste Tag des siebten Monats.',
      count: 'Zehn Tage vor dem Versöhnungstag. Die Tage dazwischen heißen in der Überlieferung die zehn ehrfürchtigen Tage.',
      what: 'Die Tora nennt ihn nicht Neujahr, sondern „Tag des Lärmblasens": ein Ruhetag im siebten Monat, eröffnet durch Hörnerschall. Warum geblasen wird, steht nicht dabei. Der Ton ruft, weckt, erschreckt – und er eröffnet den Monat, in dem die drei großen Herbstfeste dicht beieinanderliegen.',
      today: 'Daraus ist das jüdische Neujahr geworden: hundert Töne des Schofars, Apfel in Honig für ein süßes Jahr, Brotkrumen ins fließende Wasser. Der Name Rosch ha-Schana steht so nicht in der Tora – das bürgerliche Jahr beginnt im siebten Monat, das religiöse im ersten. Zwei Jahresanfänge in einem Kalender. Die „letzte Posaune", mit der Paulus rechnet, ist dieser Ton.',
    },
    en: {
      name: 'Feast of Trumpets', also: 'Rosh Hashanah',
      when: '1 Tishri – the first day of the seventh month.',
      count: 'Ten days before the Day of Atonement. Tradition calls the days between them the ten days of awe.',
      what: 'The Torah does not call it New Year but "a day of blowing": a day of rest in the seventh month, opened by the sound of horns. Why they are blown is not said. The sound calls, wakes, startles – and it opens the month in which the three great autumn feasts stand close together.',
      today: 'Out of it grew the Jewish New Year: a hundred notes of the shofar, apple in honey for a sweet year, breadcrumbs cast into running water. The name Rosh Hashanah is not in the Torah – the civil year begins in the seventh month, the religious one in the first. Two beginnings in one calendar. The "last trumpet" Paul counts on is this sound.',
    },
    refs: [
      { osis: 'Lev', chapter: 23, label: { de: '3. Mose 23,23–25', en: 'Leviticus 23:23–25' }, kind: 'command' },
      { osis: 'Num', chapter: 29, label: { de: '4. Mose 29,1–6', en: 'Numbers 29:1–6' }, kind: 'command' },
      { osis: 'Neh', chapter: 8, label: { de: 'Nehemia 8,1–12', en: 'Nehemiah 8:1–12' }, kind: 'story' },
      { osis: '1Cor', chapter: 15, label: { de: '1. Korinther 15,52', en: '1 Corinthians 15:52' }, kind: 'nt' },
    ],
    places: ['Jerusalem'],
  },
  {
    id: 'kippur', hebrew: 'יוֹם הַכִּפֻּרִים', translit: 'Jom ha-Kippurim',
    month: 'tischri', day: 10, days: 1, family: 'autumn', color: '#3a6ea8',
    symbol: 'M3 4h18M6 4c0 6 2 10 0 16M12 4c0 6-2 10 0 16M18 4c0 6 2 10 0 16',
    de: {
      name: 'Versöhnungstag', also: 'Jom Kippur',
      when: '10. Tischri – gefastet wird von Abend zu Abend.',
      count: 'Zehn Tage nach dem Posaunenfest, fünf Tage vor dem Laubhüttenfest.',
      what: 'Der einzige Tag im Jahr, an dem ein Mensch hinter den Vorhang darf: Der Hohepriester geht in weißem Leinen statt im goldenen Ornat ins Allerheiligste. Zwei Ziegenböcke werden ausgelost – einer geschlachtet, der andere mit den Verfehlungen des Volkes auf dem Kopf in die Wüste geschickt, zu Asasel. Gearbeitet wird nicht, gegessen wird nicht; 3. Mose nennt ihn den Sabbat der Sabbate.',
      today: 'Kol Nidre am Abend, fünfundzwanzig Stunden Fasten, weiße Kleidung: der ernsteste Tag des jüdischen Jahres, an dem auch kommt, wer sonst nie kommt. Der Hebräerbrief liest denselben Tag christlich – ein Hoherpriester, der nicht jedes Jahr wiederkommen muss. Und das Wort „Sündenbock" stammt wörtlich aus dem zweiten Ziegenbock dieses Kapitels.',
    },
    en: {
      name: 'Day of Atonement', also: 'Yom Kippur',
      when: '10 Tishri – fasting from evening to evening.',
      count: 'Ten days after the Feast of Trumpets, five days before Tabernacles.',
      what: 'The one day of the year a human being may go behind the veil: the high priest enters the Most Holy Place in white linen instead of golden vestments. Two goats are chosen by lot – one killed, the other sent into the wilderness to Azazel with the failures of the people on its head. No work, no food; Leviticus calls it the Sabbath of Sabbaths.',
      today: 'Kol Nidre in the evening, twenty-five hours of fasting, white clothing: the most serious day of the Jewish year, the one that brings in even those who never come. Hebrews reads the same day christologically – a high priest who need not return year after year. And the word "scapegoat" comes literally from the second goat of this chapter.',
    },
    refs: [
      { osis: 'Lev', chapter: 16, label: { de: '3. Mose 16', en: 'Leviticus 16' }, kind: 'command' },
      { osis: 'Lev', chapter: 23, label: { de: '3. Mose 23,26–32', en: 'Leviticus 23:26–32' }, kind: 'command' },
      { osis: 'Heb', chapter: 9, label: { de: 'Hebräer 9,6–14', en: 'Hebrews 9:6–14' }, kind: 'nt' },
    ],
    places: ['Jerusalem'],
  },
  {
    id: 'sukkot', hebrew: 'סֻכּוֹת', translit: 'Sukkot',
    month: 'tischri', day: 15, days: 7, family: 'autumn', color: '#5c8a3a', pilgrimage: true,
    symbol: 'M4 9h16M6 9v12M18 9v12M6 21h12M8 4l2 5M12 3l1 6M16 4l-2 5',
    de: {
      name: 'Laubhüttenfest',
      when: '15. bis 21. Tischri – sieben Tage.',
      count: 'Fünf Tage nach dem Versöhnungstag: vom ernstesten Tag des Jahres zum fröhlichsten in weniger als einer Woche.',
      what: 'Sieben Tage lang wohnt man in Hütten aus Zweigen, durch deren Dach man die Sterne sieht – eine Woche im Provisorium, damit die Generation im festen Haus nicht vergisst, dass ihre Vorfahren in Zelten lebten. Zugleich das große Erntefest am Ende des Jahres, wenn alles eingebracht ist. Es ist das einzige Fest, dem die Tora ausdrücklich befiehlt: „und du sollst fröhlich sein."',
      today: 'Auf Balkonen und in Höfen stehen wieder die Hütten, vier Pflanzenarten werden in alle Himmelsrichtungen geschwungen. Im Tempel wurde an jedem Tag Wasser aus dem Teich Siloah geschöpft und ausgegossen – und an genau diesem Fest steht Jesus auf und ruft: „Wen da dürstet, der komme zu mir." Sacharja sieht am Ende alle Völker zu diesem Fest hinaufziehen.',
    },
    en: {
      name: 'Feast of Tabernacles',
      when: '15 to 21 Tishri – seven days.',
      count: 'Five days after the Day of Atonement: from the most serious day of the year to the most joyful in under a week.',
      what: 'For seven days you live in booths of branches whose roof lets the stars through – a week in makeshift housing, so that the generation in solid houses does not forget that their ancestors lived in tents. At the same time the great harvest festival at the year’s end, when everything is gathered in. It is the one feast the Torah expressly commands: "and you shall rejoice."',
      today: 'Booths go up again on balconies and in courtyards, and four kinds of plant are waved to every point of the compass. In the temple, water was drawn from the pool of Siloam and poured out each day – and at exactly this feast Jesus stands up and calls: "if anyone thirsts, let him come to me." Zechariah sees all nations, at the end, going up to this feast.',
    },
    refs: [
      { osis: 'Lev', chapter: 23, label: { de: '3. Mose 23,33–43', en: 'Leviticus 23:33–43' }, kind: 'command' },
      { osis: 'Deut', chapter: 16, label: { de: '5. Mose 16,13–15', en: 'Deuteronomy 16:13–15' }, kind: 'command' },
      { osis: 'Neh', chapter: 8, label: { de: 'Nehemia 8,13–18', en: 'Nehemiah 8:13–18' }, kind: 'story' },
      { osis: 'Zech', chapter: 14, label: { de: 'Sacharja 14,16–19', en: 'Zechariah 14:16–19' }, kind: 'story' },
      { osis: 'John', chapter: 7, label: { de: 'Johannes 7,37–39', en: 'John 7:37–39' }, kind: 'nt' },
    ],
    places: ['Jerusalem', 'Succoth'],
  },
  {
    id: 'azeret', hebrew: 'שְׁמִינִי עֲצֶרֶת', translit: 'Schemini Azeret',
    month: 'tischri', day: 22, days: 1, family: 'autumn', color: '#4a9b86',
    symbol: 'M6 3h4v18H6zM14 3h4v18h-4zM10 6h4M10 18h4',
    de: {
      name: 'Achter Tag', also: 'Simchat Tora',
      when: '22. Tischri – der Tag nach den sieben Tagen des Laubhüttenfestes.',
      count: '„Am achten Tag": eine Woche und noch ein Tag – dieselbe Rechnung wie bei Schawuot, nur im Kleinen.',
      what: 'Ein angehängter Tag, an dem niemand mehr in der Hütte wohnt: ein Ruhetag, eine Festversammlung, ein Opfer – und keine Begründung dazu. Die Rabbinen haben ihn als Zärtlichkeit gelesen: Der Gastgeber bittet die Gäste, die schon aufbrechen wollen, noch einen Tag zu bleiben. Johannes nennt ihn „den letzten, den großen Tag des Festes".',
      today: 'Im Judentum ist daraus Simchat Tora geworden: Die Jahreslesung endet mit dem letzten Kapitel von 5. Mose und beginnt in derselben Stunde wieder mit dem ersten Satz der Bibel; die Rollen werden dabei durch die Synagoge getanzt. Der Brauch ist mittelalterlich, der Tag ist biblisch.',
    },
    en: {
      name: 'Eighth day', also: 'Simchat Torah',
      when: '22 Tishri – the day after the seven days of Tabernacles.',
      count: '"On the eighth day": a week and one day more – the same arithmetic as Shavuot, in miniature.',
      what: 'A day appended to the feast on which nobody lives in the booth any more: a day of rest, a solemn assembly, an offering – and no reason given. The rabbis read it as tenderness: the host asks the guests who are already leaving to stay one more day. John calls it "the last day, the great day of the feast".',
      today: 'In Judaism it has become Simchat Torah: the annual reading ends with the last chapter of Deuteronomy and begins again the same hour with the first sentence of the Bible, the scrolls danced around the synagogue. The custom is medieval, the day is biblical.',
    },
    refs: [
      { osis: 'Lev', chapter: 23, label: { de: '3. Mose 23,36', en: 'Leviticus 23:36' }, kind: 'command' },
      { osis: 'Num', chapter: 29, label: { de: '4. Mose 29,35–38', en: 'Numbers 29:35–38' }, kind: 'command' },
      { osis: 'Neh', chapter: 8, label: { de: 'Nehemia 8,18', en: 'Nehemiah 8:18' }, kind: 'story' },
      { osis: 'John', chapter: 7, label: { de: 'Johannes 7,37', en: 'John 7:37' }, kind: 'nt' },
    ],
    places: ['Jerusalem'],
  },
  {
    id: 'chanukka', hebrew: 'חֲנֻכָּה', translit: 'Chanukka',
    month: 'kislew', day: 25, days: 8, family: 'later', color: '#7a5fb0',
    symbol: 'M12 21V9M6 21h12M4 13V9M8 13V9M16 13V9M20 13V9M4 13c0-3 3-4 8-4s8 1 8 4',
    de: {
      name: 'Tempelweihfest',
      when: '25. Kislew – acht Tage, mitten im Winter.',
      count: 'Genau drei Jahre nach dem Tag, an dem der Altar entweiht worden war. Der Kalender selbst ist Teil der Antwort.',
      what: 'Kein Fest vom Sinai: 164 v. Chr. wird der Tempel wieder eingeweiht, nachdem Antiochus IV. dort ein fremdes Opfer hatte aufrichten lassen. Acht Tage wird gefeiert – nach dem zweiten Makkabäerbuch wie ein nachgeholtes Laubhüttenfest, das man im Aufstand nicht hatte begehen können. Die Erzählung vom Öl, das für einen Tag reichte und acht brannte, ist mehrere Jahrhunderte jünger als das Fest.',
      today: 'Acht Lichter, Abend für Abend eines mehr, dazu ein neuntes zum Anzünden. Das Fest liegt nahe bei Weihnachten und ist im Westen darum sichtbarer geworden, als es im jüdischen Kalender wiegt. Im Neuen Testament kommt es genau einmal vor – und Jesus geht hin: „Es war Tempelweihe in Jerusalem, und es war Winter."',
    },
    en: {
      name: 'Feast of Dedication', also: 'Hanukkah',
      when: '25 Kislev – eight days, in midwinter.',
      count: 'Exactly three years after the day the altar was desecrated. The calendar is itself part of the answer.',
      what: 'Not a feast from Sinai: in 164 BC the temple is rededicated after Antiochus IV had a foreign sacrifice set up there. Eight days of celebration – according to 2 Maccabees, like a Tabernacles made up late, which the revolt had made impossible to keep. The story of the oil that was enough for one day and burned for eight is several centuries younger than the feast.',
      today: 'Eight lights, one more each evening, plus a ninth to kindle them. The feast falls near Christmas and has therefore become more visible in the West than its weight in the Jewish calendar. In the New Testament it appears exactly once – and Jesus goes: "it was the Feast of Dedication at Jerusalem. It was winter."',
    },
    refs: [
      { osis: 'Dan', chapter: 8, label: { de: 'Daniel 8,9–14', en: 'Daniel 8:9–14' }, kind: 'story' },
      { osis: 'John', chapter: 10, label: { de: 'Johannes 10,22–23', en: 'John 10:22–23' }, kind: 'nt' },
    ],
    places: ['Jerusalem'],
  },
  {
    id: 'purim', hebrew: 'פּוּרִים', translit: 'Purim',
    month: 'adar', day: 14, days: 1, family: 'later', color: '#b0436b',
    symbol: 'M4 18h16M4 18l1-9 4 4 3-6 3 6 4-4 1 9M7 21h10',
    de: {
      name: 'Purim', also: 'Losfest',
      when: '14. Adar – in Städten, die seit Josua eine Mauer haben, der 15.',
      count: 'Der Tag nach dem Kampf: Am 13. Adar wehrten sich die Juden, am 14. ruhten sie – in Susa einen Tag später. Daher zwei Daten für ein Fest.',
      what: 'Das einzige Fest, das nicht angeordnet, sondern beschlossen wird: Mordechai und Ester schreiben Briefe, und die Gemeinden nehmen den Brauch an. Gefeiert wird eine Rettung, in der Gott mit keinem Wort vorkommt – das Buch Ester nennt ihn kein einziges Mal, und genau das ist seine Pointe. Der Name kommt vom Los, dem Pur, das Haman warf, um den Tag der Vernichtung zu bestimmen; er traf einen Tag fast ein Jahr später.',
      today: 'Die Esterrolle wird gelesen, und bei jedem „Haman" wird gelärmt, bis der Name untergeht. Dazu Verkleidungen, gefülltes Gebäck, Geschenke an Freunde und Gaben an die Armen – die letzten beiden sind keine Folklore, sondern stehen im Buch selbst.',
    },
    en: {
      name: 'Purim', also: 'Feast of Lots',
      when: '14 Adar – in cities walled since Joshua, the 15th.',
      count: 'The day after the fighting: on 13 Adar the Jews defended themselves, on the 14th they rested – in Susa a day later. Hence two dates for one feast.',
      what: 'The only feast that is not commanded but resolved upon: Mordecai and Esther write letters, and the communities take up the custom. What is celebrated is a rescue in which God is never mentioned – the book of Esther does not name him once, and that is precisely its point. The name comes from the lot, the pur, that Haman cast to fix the day of destruction; it fell on a day almost a year away.',
      today: 'The scroll of Esther is read, and at every "Haman" the noise rises until the name is drowned out. Costumes, filled pastries, gifts to friends and gifts to the poor – the last two are not folklore but stand in the book itself.',
    },
    refs: [
      { osis: 'Esth', chapter: 3, label: { de: 'Ester 3,7', en: 'Esther 3:7' }, kind: 'story' },
      { osis: 'Esth', chapter: 9, label: { de: 'Ester 9,20–32', en: 'Esther 9:20–32' }, kind: 'story' },
    ],
    places: ['Susa'],
  },
];

export const FEAST_BY_ID: Record<string, Feast> = Object.fromEntries(FEASTS.map((f) => [f.id, f]));

/** Tag im Jahr, an dem ein Fest beginnt (0 = 1. Nisan). */
export function feastStart(f: Feast): number {
  return monthStart(f.month) + f.day - 1;
}

/**
 * Alle Tage im Jahr, an denen ein Fest begangen wird – bei den meisten genau
 * einer, beim Neumond zwölf. Rad und Prüfung lesen dieselbe Liste: Sonst malte
 * das eine zwölf Striche, während das andere einen zählte.
 */
export function feastOccurrences(f: Feast): number[] {
  if (!f.monthly) return [feastStart(f)];
  return MONTHS.map((m) => monthStart(m.id) + f.day - 1);
}

/**
 * Was sich wiederholt und deshalb in keinem Jahreskreis steht.
 *
 * 3. Mose 23 zählt die Feste des Jahres auf – und stellt einen Tag voran, der
 * mit dem Jahr nichts zu tun hat. Diese beiden Rhythmen gehören zum Kalender,
 * aber nicht ins Rad: Der eine ist kürzer als jeder Monat, der andere länger
 * als jedes Jahr. Der Neumond stand hier ebenfalls – er ist ins Rad gezogen,
 * weil er sich anders als diese zwei überhaupt zeichnen lässt: zwölfmal, an
 * jedem Monatsanfang.
 */
export interface Rhythm {
  id: string;
  hebrew: string;
  translit: string;
  de: { name: string; every: string; text: string };
  en: { name: string; every: string; text: string };
  refs: FeastRef[];
  symbol: string;
}

export const RHYTHMS: Rhythm[] = [
  {
    id: 'schabbat', hebrew: 'שַׁבָּת', translit: 'Schabbat',
    symbol: 'M9 21V9M15 21V9M9 9a3 3 0 0 1 0-4M15 9a3 3 0 0 1 0-4M6 21h12',
    de: {
      name: 'Sabbat', every: 'jeder siebte Tag',
      text: 'Das Festkapitel 3. Mose 23 zählt die Feste des Jahres auf und stellt einen Tag voran, der in keinen Jahreskreis passt. Der Sabbat richtet sich nicht nach Mond und Ernte, sondern allein nach der Sieben – der einzige Rhythmus des Kalenders, der von nichts am Himmel abhängt.',
    },
    en: {
      name: 'Sabbath', every: 'every seventh day',
      text: 'The festival chapter, Leviticus 23, lists the feasts of the year and puts first a day that fits into no annual circle. The Sabbath follows neither moon nor harvest but only the seven – the one rhythm in the calendar that depends on nothing in the sky.',
    },
    refs: [
      { osis: 'Gen', chapter: 2, label: { de: '1. Mose 2,2–3', en: 'Genesis 2:2–3' }, kind: 'story' },
      { osis: 'Exod', chapter: 20, label: { de: '2. Mose 20,8–11', en: 'Exodus 20:8–11' }, kind: 'command' },
      { osis: 'Lev', chapter: 23, label: { de: '3. Mose 23,3', en: 'Leviticus 23:3' }, kind: 'command' },
      { osis: 'Mark', chapter: 2, label: { de: 'Markus 2,27', en: 'Mark 2:27' }, kind: 'nt' },
    ],
  },
  {
    id: 'schmitta', hebrew: 'שְׁמִטָּה · יוֹבֵל', translit: 'Schmitta · Jowel',
    symbol: 'M3 17h18M6 17c0-4 2-7 6-7s6 3 6 7M12 10V4M9 7l3-3 3 3',
    de: {
      name: 'Sabbat- und Jobeljahr', every: 'jedes siebte, jedes fünfzigste Jahr',
      text: 'Der Ruhetag wächst sich aus: Im siebten Jahr ruht das Land, im fünfzigsten wird ein Widderhorn geblasen, Schulden verfallen, verkauftes Land kommt an die Familie zurück. Ob das je flächendeckend gehalten wurde, ist offen – Jeremia 34 erzählt von einer Freilassung, die nach wenigen Wochen zurückgenommen wurde. In Nazareth liest Jesus die Stelle vor, die ein solches Jahr ankündigt, und setzt sich hin.',
    },
    en: {
      name: 'Sabbath year and Jubilee', every: 'every seventh, every fiftieth year',
      text: 'The day of rest grows outward: in the seventh year the land rests, in the fiftieth a ram’s horn is blown, debts lapse, sold land returns to the family. Whether it was ever kept across the board is an open question – Jeremiah 34 tells of a release revoked after a few weeks. In Nazareth Jesus reads out the passage announcing such a year, and sits down.',
    },
    refs: [
      { osis: 'Lev', chapter: 25, label: { de: '3. Mose 25', en: 'Leviticus 25' }, kind: 'command' },
      { osis: 'Deut', chapter: 15, label: { de: '5. Mose 15,1–11', en: 'Deuteronomy 15:1–11' }, kind: 'command' },
      { osis: 'Jer', chapter: 34, label: { de: 'Jeremia 34,8–17', en: 'Jeremiah 34:8–17' }, kind: 'story' },
      { osis: 'Luke', chapter: 4, label: { de: 'Lukas 4,16–21', en: 'Luke 4:16–21' }, kind: 'nt' },
    ],
  },
];
