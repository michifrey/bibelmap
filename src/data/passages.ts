// Curated key Bible passages ("Stellen") for the reference graph. Each carries
// a title, a short subtitle (subtext) and a one-line explanation, plus the OSIS
// book it belongs to so it can be wired to the book node in the graph.
//
// This is a deliberate, teachable selection across the canon — not every verse.
// Extend freely: add an entry with a unique id and an existing OSIS book code.

export interface Passage {
  id: string;
  /** Human reference, e.g. "Joh 3:16" — links to Bible.com search. */
  ref: string;
  /** OSIS book code (must match src/data/books.ts), e.g. "John". */
  book: string;
  de: string;
  en: string;
  /** Subtitle / one-phrase gist. */
  subDe: string;
  subEn: string;
  /** Short explanation. */
  textDe: string;
  textEn: string;
}

export const PASSAGES: Passage[] = [
  // ---- Altes Testament -------------------------------------------------
  { id: 'p_gen1', ref: 'Gen 1', book: 'Gen', de: 'Die Schöpfung', en: 'The Creation',
    subDe: 'Im Anfang schuf Gott Himmel und Erde', subEn: 'In the beginning God created the heavens and the earth',
    textDe:
      'Gott ruft die Welt allein durch sein Wort ins Dasein, ordnet sie in sechs Tagen und nennt sie „sehr gut“. Der Mensch wird als sein Ebenbild geschaffen, männlich und weiblich, und bekommt Verantwortung für das Übrige. Der Text ist kein Naturbericht, sondern eine Aussage darüber, wem die Welt gehört.',
    textEn:
      'God calls the world into being by his word alone, orders it over six days and pronounces it “very good”. Humanity is made in his image, male and female, and given responsibility for the rest. The text is not a report on nature but a statement about whose the world is.' },
  { id: 'p_gen3', ref: 'Gen 3', book: 'Gen', de: 'Der Sündenfall', en: 'The Fall',
    subDe: 'Bruch zwischen Mensch und Gott', subEn: 'The break between humanity and God',
    textDe:
      'Adam und Eva übertreten das eine Gebot, das ihnen gegeben war. Mit der ersten Sünde kommen Scham, gegenseitige Schuldzuweisung, Mühsal und Tod – und mitten im Urteil steht die erste Andeutung einer Rettung. Von hier aus liest die Bibel die ganze weitere Geschichte.',
    textEn:
      'Adam and Eve transgress the one command they were given. The first sin brings shame, mutual blame, toil and death — and in the middle of the sentence stands the first hint of rescue. From here the Bible reads all the history that follows.' },
  { id: 'p_gen12', ref: 'Gen 12', book: 'Gen', de: 'Berufung Abrahams', en: 'The Call of Abraham',
    subDe: '„In dir sollen gesegnet werden alle Geschlechter"', subEn: '"In you all families shall be blessed"',
    textDe:
      'Gott ruft Abram aus Haran fort, weg von Land, Verwandtschaft und Vaterhaus, und verheißt ihm Land, Nachkommen und Segen. Der letzte Satz reicht über Abram hinaus: In ihm sollen alle Geschlechter der Erde gesegnet werden. Mit diesem Ruf beginnt die Heilsgeschichte im engeren Sinn.',
    textEn:
      'God calls Abram away from Haran — from land, kindred and father’s house — and promises land, descendants and blessing. The last line reaches beyond Abram: in him all the families of the earth are to be blessed. With this call salvation history proper begins.' },
  { id: 'p_gen15', ref: 'Gen 15', book: 'Gen', de: 'Der Bund mit Abraham', en: 'God’s Covenant with Abraham',
    subDe: 'Abraham glaubte, und es ward ihm zur Gerechtigkeit', subEn: 'Abraham believed, and it was counted as righteousness',
    textDe:
      'Gott schließt einen feierlichen Bund und sagt Abraham Nachkommen zu, zahlreich wie die Sterne. Abraham glaubt, und es wird ihm zur Gerechtigkeit gerechnet – ein Satz, den Paulus und später die Reformation zum Kern ihrer Lehre machen. Den Bund geht Gott allein durch die Opferhälften.',
    textEn:
      'God makes a solemn covenant and promises Abraham descendants as numerous as the stars. Abraham believes, and it is counted to him as righteousness — a line Paul, and later the Reformation, made central. God alone passes between the halves of the sacrifice.' },
  { id: 'p_gen22', ref: 'Gen 22', book: 'Gen', de: 'Die Bindung Isaaks', en: 'The Binding of Isaac',
    subDe: 'Gott wird sich ein Lamm ersehen', subEn: 'God will provide the lamb',
    textDe:
      'Abraham ist bereit, Isaak zu opfern, den Sohn der Verheißung. Gott hält ihn im letzten Augenblick zurück und stellt einen Widder bereit. Judentum und Christentum lesen die Stelle verschieden – als Akiva-Erzählung des Gehorsams, als Vorausbild stellvertretender Hingabe –, beide seit alter Zeit.',
    textEn:
      'Abraham is ready to offer Isaac, the son of the promise. God stops him at the last moment and provides a ram instead. Judaism and Christianity read the passage differently — as a story of obedience, as a foreshadowing of substitutionary sacrifice — and both readings are ancient.' },
  { id: 'p_exod3', ref: 'Ex 3', book: 'Exod', de: 'Der brennende Dornbusch', en: 'The Burning Bush',
    subDe: '„Ich werde sein, der ich sein werde"', subEn: '"I AM WHO I AM"',
    textDe:
      'Am Horeb brennt ein Dornbusch, ohne zu verbrennen. Gott nennt Mose seinen Namen – JHWH, „Ich werde sein, der ich sein werde“ – und beauftragt ihn, Israel aus Ägypten zu führen. Mose wendet fünfmal ein und wird fünfmal überstimmt; die Berufung hängt nicht an seiner Eignung.',
    textEn:
      'At Horeb a bush burns without being consumed. God gives Moses his name — YHWH, “I will be who I will be” — and commissions him to lead Israel out of Egypt. Moses objects five times and is overruled five times; the call does not rest on his fitness.' },
  { id: 'p_exod12', ref: 'Ex 12', book: 'Exod', de: 'Das Passa', en: 'The Passover',
    subDe: 'Das Blut des Lammes verschont', subEn: 'The blood of the lamb spares',
    textDe:
      'In der Nacht vor dem Auszug streicht jede Familie Blut eines Lammes an die Türpfosten, und das Gericht geht vorüber. Das Passa wird zum bleibenden Erinnerungsmahl: Jedes Jahr erzählt eine Familie die Befreiung so, als sei sie selbst dabei gewesen. Jesu letztes Mahl ist ein Passamahl.',
    textEn:
      'On the night before the exodus each household marks its doorposts with a lamb’s blood, and the judgement passes over. Passover becomes a lasting memorial meal: each year a family retells the deliverance as though it had been there. Jesus’ last supper is a Passover meal.' },
  { id: 'p_exod14', ref: 'Ex 14', book: 'Exod', de: 'Durchzug durchs Schilfmeer', en: 'Crossing the Red Sea',
    subDe: 'Gott bahnt einen Weg durchs Wasser', subEn: 'God makes a path through the sea',
    textDe:
      'Zwischen dem Meer und dem heranrückenden Heer sieht Israel keinen Weg. Gott teilt das Wasser, das Volk zieht trockenen Fußes hindurch, und die Wagen des Pharao versinken. Kein anderes Ereignis wird im Alten Testament so oft erinnert – es ist dort das Urbild dessen, was Erlösung heißt.',
    textEn:
      'Caught between the sea and an advancing army, Israel sees no way out. God parts the water, the people cross on dry ground, and Pharaoh’s chariots sink. No other event is recalled so often in the Old Testament — there it is the defining picture of what redemption means.' },
  { id: 'p_exod20', ref: 'Ex 20', book: 'Exod', de: 'Die Zehn Gebote', en: 'The Ten Commandments',
    subDe: 'Gottes Bundesgesetz am Sinai', subEn: 'God’s covenant law at Sinai',
    textDe:
      'Am Sinai gibt Gott die zehn Worte: die Grundordnung des Lebens vor Gott und unter Menschen. Sie beginnen nicht mit einer Forderung, sondern mit einer Erinnerung – „Ich bin der HERR, dein Gott, der ich dich aus Ägypten geführt habe“. Das Gesetz folgt der Befreiung, nicht umgekehrt.',
    textEn:
      'At Sinai God gives the ten words: the basic order of life before God and among people. They open not with a demand but with a reminder — “I am the LORD your God, who brought you out of Egypt.” The law follows the deliverance, not the other way round.' },
  { id: 'p_lev16', ref: 'Lev 16', book: 'Lev', de: 'Der große Versöhnungstag', en: 'The Day of Atonement',
    subDe: 'Sühne für das ganze Volk', subEn: 'Atonement for the whole people',
    textDe:
      'Einmal im Jahr betritt der Hohepriester das Allerheiligste, und ein zweiter Bock wird mit der Schuld des Volkes in die Wüste geschickt. Jom Kippur ist bis heute der höchste Feiertag des Judentums; der Hebräerbrief liest das ganze Kapitel als Vorausbild auf das eine Opfer Christi.',
    textEn:
      'Once a year the high priest enters the Holy of Holies, and a second goat is sent into the wilderness bearing the people’s guilt. Yom Kippur is still Judaism’s highest holy day; the letter to the Hebrews reads the whole chapter as a foreshadowing of Christ’s single sacrifice.' },
  { id: 'p_num6', ref: 'Num 6:24-26', book: 'Num', de: 'Der aaronitische Segen', en: 'The Aaronic Blessing',
    subDe: '„Der HERR segne dich und behüte dich"', subEn: '"The LORD bless you and keep you"',
    textDe:
      'Drei Zeilen, die Aaron und seine Söhne über Israel sprechen sollen: Segen und Bewahrung, ein leuchtendes Angesicht, Frieden. Der Segen steht bis heute am Ende unzähliger Gottesdienste. Eine Silberrolle aus Ketef Hinnom trägt ihn – der älteste bekannte Bibeltext, etwa 600 v. Chr.',
    textEn:
      'Three lines Aaron and his sons are to speak over Israel: blessing and keeping, a shining face, peace. The blessing still closes countless services today. A silver scroll from Ketef Hinnom carries it — the oldest known biblical text, from about 600 BC.' },
  { id: 'p_deut6', ref: 'Dtn 6:4-9', book: 'Deut', de: 'Das Schma Israel', en: 'The Shema',
    subDe: '„Höre, Israel: der HERR ist einer"', subEn: '"Hear, O Israel: the LORD is one"',
    textDe:
      '„Höre, Israel: Der HERR ist unser Gott, der HERR allein.“ Das Schma ist das Grundbekenntnis des Judentums, morgens und abends gesprochen. Jesus nennt es zusammen mit der Nächstenliebe das größte Gebot. Die Worte sollen zu Hause, unterwegs, beim Liegen und Aufstehen weitergesagt werden.',
    textEn:
      '“Hear, O Israel: the LORD is our God, the LORD alone.” The Shema is Judaism’s basic confession, spoken morning and evening. Jesus names it, together with love of neighbour, as the greatest commandment. The words are to be passed on at home, on the road, lying down and rising up.' },
  { id: 'p_josh24', ref: 'Jos 24', book: 'Josh', de: 'Josuas letzte Rede', en: 'Joshua\'s Farewell',
    subDe: '„Ich aber und mein Haus wollen dem HERRN dienen“', subEn: '“As for me and my house, we will serve the LORD”',
    textDe:
      'In Sichem stellt Josua das Volk vor die Wahl, wem es dienen will, und legt sich selbst fest. Die Zusage des Volkes ist begeistert; Josua traut ihr nicht und sagt es offen. Das Richterbuch gibt ihm recht.',
    textEn:
      'At Shechem Joshua puts the choice to the people — whom will they serve — and commits himself first. The people answer enthusiastically; Joshua does not trust the answer and says so. The book of Judges proves him right.' },
  { id: 'p_judg6', ref: 'Ri 6', book: 'Judg', de: 'Die Berufung Gideons', en: 'The Call of Gideon',
    subDe: '„Der HERR ist mit dir, du streitbarer Held“', subEn: '“The LORD is with you, mighty warrior”',
    textDe:
      'Der Engel grüßt einen Mann, der sich beim Dreschen in einer Kelter versteckt, als streitbaren Helden. Gideon widerspricht, fordert Zeichen und bekommt sie. Sein Heer wird danach von zweiunddreißigtausend auf dreihundert zusammengestrichen.',
    textEn:
      'The angel greets a man hiding in a winepress to thresh his grain as a mighty warrior. Gideon objects, asks for signs and gets them. His army is afterwards cut from thirty-two thousand down to three hundred.' },
  { id: 'p_ruth1', ref: 'Rut 1', book: 'Ruth', de: 'Ruts Treue', en: 'Ruth\'s Loyalty',
    subDe: '„Wo du hingehst, da will ich auch hingehen“', subEn: '“Where you go I will go”',
    textDe:
      'Eine moabitische Witwe weigert sich, zu ihrer Sippe zurückzukehren, und bindet sich an Noomi und deren Gott. Das Buch endet mit einem Stammbaum: Rut, die Ausländerin, ist die Urgroßmutter Davids und steht bei Matthäus im Geschlecht Jesu.',
    textEn:
      'A Moabite widow refuses to return to her own people and binds herself to Naomi and Naomi’s God. The book ends with a genealogy: Ruth the foreigner is David’s great-grandmother, and Matthew names her in the line of Jesus.' },
  { id: 'p_1sam16', ref: '1Sam 16', book: '1Sam', de: 'Die Salbung Davids', en: 'David Anointed',
    subDe: 'Gott sieht das Herz an', subEn: 'God looks on the heart',
    textDe:
      'Samuel sucht unter Isais Söhnen einen König und geht der Reihe nach an den Älteren vorbei. Gesalbt wird der Jüngste, den man beim Vieh vergessen hatte. „Der Mensch sieht, was vor Augen ist; der HERR aber sieht das Herz an“ – der Satz trägt die ganze Davidsgeschichte.',
    textEn:
      'Samuel looks for a king among Jesse’s sons and passes down the line of the older ones. The one anointed is the youngest, forgotten out with the flock. “Man looks on the outward appearance, but the LORD looks on the heart” — the line carries the whole story of David.' },
  { id: 'p_2sam7', ref: '2Sam 7', book: '2Sam', de: 'Die Verheißung an David', en: 'The Davidic Covenant',
    subDe: '„Dein Thron soll ewig bestehen"', subEn: '"Your throne shall be established forever"',
    textDe:
      'David will Gott ein Haus bauen; Gott dreht es um und verspricht David ein Haus – eine Dynastie, deren Thron Bestand haben soll. Aus dieser Zusage wächst die messianische Erwartung: Die Evangelien beginnen damit, Jesus als Sohn Davids auszuweisen, und Petrus zitiert sie an Pfingsten.',
    textEn:
      'David wants to build God a house; God turns it round and promises David a house — a dynasty whose throne will endure. From this promise the messianic expectation grows: the gospels open by presenting Jesus as son of David, and Peter quotes it at Pentecost.' },
  { id: 'p_1kgs8', ref: '1Kön 8', book: '1Kgs', de: 'Tempelweihe Salomos', en: 'Solomon Dedicates the Temple',
    subDe: 'Gottes Herrlichkeit erfüllt das Haus', subEn: 'God’s glory fills the house',
    textDe:
      'Salomo weiht den Tempel und betet dabei einen Satz, der das ganze Unternehmen relativiert: Der Himmel und aller Himmel Himmel können Gott nicht fassen – wie viel weniger dieses Haus. Ausdrücklich schließt er den Fremden ein, der von fern kommt und hier beten will.',
    textEn:
      'Solomon dedicates the temple and prays a line that puts the whole enterprise in perspective: heaven and the highest heaven cannot contain God — how much less this house. He explicitly includes the foreigner who comes from far away to pray here.' },
  { id: 'p_1kgs18', ref: '1Kön 18', book: '1Kgs', de: 'Elia auf dem Karmel', en: 'Elijah on Mount Carmel',
    subDe: '„Der HERR ist Gott!"', subEn: '"The LORD, he is God!"',
    textDe:
      'Auf dem Karmel stellt Elia das Volk vor die Entscheidung: „Wie lange hinkt ihr auf beiden Seiten?“ Vierhundertfünfzig Baalspropheten rufen einen Tag lang vergeblich; auf Elias Gebet fällt Feuer. Der Sieg trägt nicht weit – im nächsten Kapitel läuft Elia um sein Leben.',
    textEn:
      'On Carmel Elijah puts the choice to the people: “How long will you go limping between two opinions?” Four hundred and fifty prophets of Baal call all day in vain; at Elijah’s prayer fire falls. The victory does not carry far — in the next chapter Elijah is running for his life.' },
  { id: 'p_2kgs5', ref: '2Kön 5', book: '2Kgs', de: 'Naaman im Jordan', en: 'Naaman in the Jordan',
    subDe: 'Ein syrischer Feldherr und ein siebenmaliges Bad', subEn: 'A Syrian commander and a sevenfold washing',
    textDe:
      'Der aussätzige Heerführer Aramäas erwartet ein großes Zeichen und bekommt die Anweisung, siebenmal im Jordan unterzutauchen. Er geht zornig weg, kehrt auf Zureden seiner Knechte um und wird rein. Jesus nennt ihn in Nazareth als Beispiel.',
    textEn:
      'The leprous commander of Aram expects a grand gesture and is told to wash seven times in the Jordan. He leaves in anger, turns back at his servants’ urging, and is healed. Jesus cites him in Nazareth as an example.' },
  { id: 'p_1chr16', ref: '1Chr 16', book: '1Chr', de: 'Davids Danklied', en: 'David\'s Song of Thanks',
    subDe: 'Bei der Überführung der Lade nach Jerusalem', subEn: 'At the bringing of the ark to Jerusalem',
    textDe:
      'Als die Bundeslade in Jerusalem ankommt, lässt David ein Danklied anstimmen, das aus Psalmversen zusammengesetzt ist. Die Chronik erzählt Israels Geschichte durchgehend vom Gottesdienst her – wo Samuel und Könige Politik sehen, sieht sie Liturgie.',
    textEn:
      'When the ark arrives in Jerusalem, David has a song of thanks sung that is stitched together from psalm verses. Chronicles tells Israel’s history throughout from worship outward — where Samuel and Kings see politics, it sees liturgy.' },
  { id: 'p_2chr7', ref: '2Chr 7', book: '2Chr', de: '„So will ich ihr Land heilen“', en: '“I Will Heal Their Land”',
    subDe: 'Gottes Antwort auf Salomos Tempelweihe', subEn: 'God\'s answer to Solomon\'s dedication',
    textDe:
      'Gott antwortet auf das Weihgebet mit einer Bedingung: wenn das Volk umkehrt und betet, will er hören und heilen. Der Vers wird oft auf beliebige Nationen übertragen; im Zusammenhang gilt er dem Bundesvolk und diesem Tempel.',
    textEn:
      'God answers the dedication prayer with a condition: if the people turn and pray, he will hear and heal. The verse is often applied to any nation; in context it addresses the covenant people and this temple.' },
  { id: 'p_ezra1', ref: 'Esr 1', book: 'Ezra', de: 'Der Erlass des Kyrus', en: 'The Edict of Cyrus',
    subDe: 'Die Erlaubnis zur Rückkehr aus dem Exil', subEn: 'Permission to return from exile',
    textDe:
      'Der Perserkönig erlaubt den Verschleppten die Rückkehr und den Wiederaufbau des Tempels. Der Kyros-Zylinder im Britischen Museum belegt eine solche Politik gegenüber mehreren Völkern – nicht den Text dieses Erlasses, aber seine Art.',
    textEn:
      'The Persian king permits the deportees to return and rebuild the temple. The Cyrus Cylinder in the British Museum attests such a policy toward several peoples — not the wording of this edict, but its kind.' },
  { id: 'p_neh8', ref: 'Neh 8', book: 'Neh', de: 'Die Tora wird vorgelesen', en: 'The Reading of the Law',
    subDe: 'Ein Volk hört sein eigenes Buch wieder', subEn: 'A people hears its own book again',
    textDe:
      'Auf dem Platz vor dem Wassertor liest Esra vom Morgen bis zum Mittag aus dem Gesetz, und Leviten erklären das Gehörte. Das Volk weint; es wird ihm gesagt, der Tag sei heilig und die Freude am HERRN sei seine Stärke.',
    textEn:
      'In the square before the Water Gate Ezra reads from the law from morning until midday, and Levites explain what is heard. The people weep; they are told the day is holy and that the joy of the LORD is their strength.' },
  { id: 'p_esth4', ref: 'Est 4', book: 'Esth', de: '„Wer weiß, ob du nicht gerade dafür …“', en: '“Who Knows Whether …”',
    subDe: 'Ester riskiert den Gang zum König', subEn: 'Esther risks going to the king',
    textDe:
      'Mordechai drängt die Königin, für ihr Volk einzutreten, obwohl der ungerufene Gang zum König das Leben kosten kann. Ester geht. Das Buch nennt Gott an keiner Stelle beim Namen – und erzählt trotzdem von Bewahrung.',
    textEn:
      'Mordecai presses the queen to plead for her people, though approaching the king unsummoned can cost her life. Esther goes. The book never once names God — and tells a story of preservation all the same.' },
  { id: 'p_job1', ref: 'Hiob 1', book: 'Job', de: 'Hiob verliert alles', en: 'Job Loses Everything',
    subDe: '„Der HERR hat gegeben, der HERR hat genommen“', subEn: '“The LORD gave, and the LORD has taken away”',
    textDe:
      'An einem Tag verliert Hiob Besitz und Kinder. Er klagt nicht Gott an, sondern setzt sich in die Asche. Die Rahmenerzählung lässt den Leser wissen, was Hiob nicht weiß – und genau das macht das Buch zu einer Frage und nicht zu einer Antwort.',
    textEn:
      'In a single day Job loses his property and his children. He does not accuse God but sits down in the ashes. The frame story lets the reader know what Job does not — and that is exactly what makes the book a question rather than an answer.' },
  { id: 'p_job38', ref: 'Hiob 38', book: 'Job', de: 'Gott antwortet aus dem Sturm', en: 'God Answers from the Whirlwind',
    subDe: '„Wo warst du, als ich die Erde gründete?“', subEn: '“Where were you when I laid the earth\'s foundation?”',
    textDe:
      'Nach siebenunddreißig Kapiteln Streit antwortet Gott – und beantwortet die Frage nach dem Warum nicht. Stattdessen führt er Hiob durch Sternbilder, Wetter und wilde Tiere. Hiob verstummt, aber die drei Freunde mit ihren Erklärungen werden getadelt, nicht er.',
    textEn:
      'After thirty-seven chapters of argument God answers — and does not answer the question why. Instead he walks Job through constellations, weather and wild animals. Job falls silent, but it is the three friends with their explanations who are rebuked, not him.' },
  { id: 'p_ps22', ref: 'Ps 22', book: 'Ps', de: 'Psalm 22', en: 'Psalm 22',
    subDe: '„Mein Gott, warum hast du mich verlassen?"', subEn: '"My God, why have you forsaken me?"',
    textDe:
      'Ein Klagelied, das mit „Mein Gott, mein Gott, warum hast du mich verlassen?“ beginnt und mit Lobpreis endet. Die Passionsberichte zitieren es dicht: durchgrabene Hände, verteilte Kleider, das Los um das Gewand. Jesus spricht die erste Zeile am Kreuz – und wer den Psalm kennt, hört das Ende mit.',
    textEn:
      'A lament that begins “My God, my God, why have you forsaken me?” and ends in praise. The passion narratives quote it densely: pierced hands, divided garments, lots cast for the clothing. Jesus speaks the opening line from the cross — and those who know the psalm hear its ending too.' },
  { id: 'p_ps23', ref: 'Ps 23', book: 'Ps', de: 'Psalm 23', en: 'Psalm 23',
    subDe: '„Der HERR ist mein Hirte"', subEn: '"The LORD is my shepherd"',
    textDe:
      'Sechs Verse, wahrscheinlich der bekannteste Text der Bibel. Gott als Hirte, der führt, ruhen lässt und auch durch das finstere Tal mitgeht – dort wechselt der Psalm von „er“ zu „du“. Am Ende steht kein Weidebild mehr, sondern ein gedeckter Tisch im Angesicht der Feinde.',
    textEn:
      'Six verses, probably the best-known text in the Bible. God as shepherd who leads, gives rest, and goes along even through the darkest valley — where the psalm switches from “he” to “you”. It ends not with pasture but with a table spread in the presence of enemies.' },
  { id: 'p_ps51', ref: 'Ps 51', book: 'Ps', de: 'Psalm 51', en: 'Psalm 51',
    subDe: '„Schaffe in mir, Gott, ein reines Herz"', subEn: '"Create in me a clean heart, O God"',
    textDe:
      'Davids Bußgebet nach dem Ehebruch mit Batseba und dem Tod Urias. Es entschuldigt nichts und verhandelt nicht, sondern bittet um ein neues Herz. Der Satz „Schaffe in mir, Gott, ein reines Herz“ wurde zum Grundgebet der Buße in Synagoge und Kirche.',
    textEn:
      'David’s prayer of repentance after the adultery with Bathsheba and the death of Uriah. It excuses nothing and bargains for nothing, but asks for a new heart. The line “Create in me a clean heart, O God” became the basic prayer of penitence in synagogue and church.' },
  { id: 'p_prov8', ref: 'Spr 8', book: 'Prov', de: 'Das Lob der Weisheit', en: 'Wisdom Calls',
    subDe: 'Die Weisheit war vor aller Schöpfung', subEn: 'Wisdom before all creation',
    textDe:
      'Die Weisheit tritt auf wie eine Person, ruft auf den Straßen und sagt von sich, sie sei vor allen Werken bei Gott gewesen. Das Kapitel hat die Theologie stark beschäftigt: Die frühe Kirche las es auf Christus hin, und im Streit um Arius wurde genau an diesen Versen gerungen.',
    textEn:
      'Wisdom appears as a person, calls out in the streets and says of herself that she was with God before all his works. The chapter has occupied theology heavily: the early church read it toward Christ, and the dispute over Arius was fought out on precisely these verses.' },
  { id: 'p_eccl3', ref: 'Pred 3', book: 'Eccl', de: 'Alles hat seine Zeit', en: 'A Time for Everything',
    subDe: '„Ein jegliches hat seine Zeit"', subEn: '"For everything there is a season"',
    textDe:
      '„Ein jegliches hat seine Zeit“ – geboren werden und sterben, pflanzen und ausreißen, schweigen und reden. Der Prediger ordnet nicht, sondern stellt fest, wie wenig der Mensch über die Zeiten verfügt. Das Buch ist der nüchternste Text der Bibel und wurde trotzdem in den Kanon aufgenommen.',
    textEn:
      '“For everything there is a season” — to be born and to die, to plant and to uproot, to keep silence and to speak. Ecclesiastes does not tidy this up; it records how little control anyone has over the seasons. It is the Bible’s most sober book, and was taken into the canon all the same.' },
  { id: 'p_song8', ref: 'Hld 8', book: 'Song', de: '„Stark wie der Tod ist die Liebe“', en: '“Love Is Strong as Death”',
    subDe: 'Das Hohelied auf seinem Höhepunkt', subEn: 'The Song of Songs at its height',
    textDe:
      'Ein Liebeslied ohne fromme Rahmung, im Kanon geblieben und seit der Antike doppelt gelesen: als das, was es sagt, und als Bild für Gott und sein Volk. Rabbi Akiba nannte es das Allerheiligste unter den Schriften.',
    textEn:
      'A love song with no pious framing, kept in the canon and read on two levels since antiquity: as what it says, and as an image of God and his people. Rabbi Akiva called it the holy of holies among the writings.' },
  { id: 'p_isa6', ref: 'Jes 6', book: 'Isa', de: 'Berufung Jesajas', en: 'Isaiah’s Call',
    subDe: '„Heilig, heilig, heilig"', subEn: '"Holy, holy, holy"',
    textDe:
      'Im Todesjahr des Königs Usija sieht Jesaja Gott im Tempel, hört das dreifache „Heilig“ und erschrickt über sich selbst. Nach der Reinigung folgt die Frage „Wen soll ich senden?“ und die Antwort „Hier bin ich, sende mich“ – und dann ein Auftrag, der ausdrücklich scheitern wird.',
    textEn:
      'In the year King Uzziah died, Isaiah sees God in the temple, hears the threefold “Holy” and is undone by what he sees in himself. After cleansing comes the question “Whom shall I send?” and the answer “Here am I, send me” — and then a commission that is told in advance it will fail.' },
  { id: 'p_isa7', ref: 'Jes 7:14', book: 'Isa', de: 'Die Immanuel-Verheißung', en: 'The Immanuel Prophecy',
    subDe: '„Siehe, eine Jungfrau wird schwanger"', subEn: '"Behold, a virgin shall conceive"',
    textDe:
      'Dem verängstigten König Ahas wird ein Zeichen zugesagt: Eine junge Frau wird einen Sohn gebären und ihn Immanuel nennen, „Gott mit uns“. Im Zusammenhang geht es um eine Frist von wenigen Jahren; Matthäus liest den Vers auf die Geburt Jesu. Über das Wort „almah“ wird bis heute gestritten.',
    textEn:
      'A sign is promised to the frightened king Ahaz: a young woman will bear a son and call him Immanuel, “God with us”. In context the horizon is a few years; Matthew reads the verse toward the birth of Jesus. The word ‘almah’ is disputed to this day.' },
  { id: 'p_isa53', ref: 'Jes 53', book: 'Isa', de: 'Der leidende Gottesknecht', en: 'The Suffering Servant',
    subDe: '„Die Strafe lag auf ihm, auf dass wir Frieden hätten"', subEn: '"The punishment that brought us peace was on him"',
    textDe:
      'Das vierte Gottesknechtslied: einer, der Krankheit trägt, der geschlagen wird und schweigt, und durch dessen Wunden andere heil werden. Das Judentum liest den Knecht überwiegend als Israel, das Christentum auf Christus hin. Der Text ist eine der meistzitierten Stellen des Neuen Testaments.',
    textEn:
      'The fourth Servant Song: one who bears sickness, who is struck and stays silent, and by whose wounds others are healed. Judaism reads the servant chiefly as Israel, Christianity toward Christ. It is among the most-quoted passages in the New Testament.' },
  { id: 'p_jer31', ref: 'Jer 31:31-34', book: 'Jer', de: 'Der neue Bund', en: 'The New Covenant',
    subDe: '„Ich gebe mein Gesetz in ihr Herz"', subEn: '"I will put my law within them"',
    textDe:
      'Jeremia kündigt einen neuen Bund an – nicht mehr auf Tafeln, sondern ins Herz geschrieben, mit Vergebung, die nicht mehr aufgerechnet wird. Der Hebräerbrief zitiert die Stelle in voller Länge, und das Abendmahlswort „der neue Bund in meinem Blut“ nimmt sie auf.',
    textEn:
      'Jeremiah announces a new covenant — no longer on tablets but written on the heart, with forgiveness that is no longer counted up. Hebrews quotes the passage in full, and the words of institution, “the new covenant in my blood”, take it up.' },
  { id: 'p_lam3', ref: 'Klgl 3', book: 'Lam', de: '„Alle Morgen neu“', en: '“New Every Morning”',
    subDe: 'Hoffnung mitten in der Klage über Jerusalem', subEn: 'Hope in the middle of a lament for Jerusalem',
    textDe:
      'Fünf Klagelieder über die zerstörte Stadt, kunstvoll alphabetisch gebaut. In der Mitte des mittleren steht der Umschwung: Gottes Güte hat noch kein Ende, sie ist alle Morgen neu. Danach kehrt die Klage zurück – der Trost hebt sie nicht auf.',
    textEn:
      'Five laments over the ruined city, built as careful alphabetic acrostics. At the centre of the middle one comes the turn: God’s mercies are not at an end, they are new every morning. Then the lament returns — the comfort does not cancel it.' },
  { id: 'p_ezek37', ref: 'Ez 37', book: 'Ezek', de: 'Das Tal der Totengebeine', en: 'The Valley of Dry Bones',
    subDe: 'Gottes Geist macht lebendig', subEn: 'God’s Spirit gives life',
    textDe:
      'Hesekiel steht in einem Tal voller ausgetrockneter Knochen und wird gefragt, ob diese Gebeine lebendig werden können. Auf sein Wort hin fügen sie sich zusammen und bekommen Atem. Gemeint ist zunächst das Volk im Exil, das sich selbst für erledigt hält – nicht die Auferstehung Einzelner.',
    textEn:
      'Ezekiel stands in a valley of dried-out bones and is asked whether they can live. At his word they come together and receive breath. What is meant first of all is the people in exile who consider themselves finished — not the resurrection of individuals.' },
  { id: 'p_dan7', ref: 'Dan 7', book: 'Dan', de: 'Der Menschensohn', en: 'The Son of Man',
    subDe: 'Ewige Herrschaft des Menschensohns', subEn: 'The everlasting dominion of the Son of Man',
    textDe:
      'Vier Tiere steigen aus dem Meer, dann kommt „einer wie eines Menschen Sohn“ mit den Wolken und empfängt eine Herrschaft, die nicht vergeht. Jesus nennt sich selbst am häufigsten mit genau diesem Ausdruck – im Verhör vor dem Hohen Rat zitiert er die Stelle offen.',
    textEn:
      'Four beasts rise from the sea, then “one like a son of man” comes with the clouds and receives a dominion that will not pass away. Jesus’ most frequent self-designation is precisely this phrase — and at his hearing before the council he quotes the passage openly.' },
  { id: 'p_hos11', ref: 'Hos 11', book: 'Hos', de: '„Aus Ägypten habe ich meinen Sohn gerufen“', en: '“Out of Egypt I Called My Son”',
    subDe: 'Gott ringt mit sich selbst', subEn: 'God wrestling with himself',
    textDe:
      'Hosea lässt Gott von Israel wie von einem Kind sprechen, das man gehen lehrte und das doch weglief. Mitten im angekündigten Gericht bricht es ab: „Mein Herz ist anderen Sinnes.“ Matthäus zitiert den ersten Vers auf die Flucht nach Ägypten.',
    textEn:
      'Hosea has God speak of Israel as of a child taught to walk who ran away all the same. In the middle of the announced judgement it breaks off: “My heart recoils within me.” Matthew quotes the opening verse of the flight to Egypt.' },
  { id: 'p_joel3', ref: 'Joel 3:1-5', book: 'Joel', de: 'Ausgießung des Geistes', en: 'The Spirit Poured Out',
    subDe: '„Ich will meinen Geist ausgießen"', subEn: '"I will pour out my Spirit"',
    textDe:
      'Gott sagt zu, seinen Geist auszugießen über alles Fleisch – über Söhne und Töchter, Alte und Junge, Knechte und Mägde. Petrus zitiert die Stelle an Pfingsten als Erklärung dessen, was gerade geschieht. Der Ausdruck „alles Fleisch“ hebt die Grenzen von Stand, Alter und Geschlecht auf.',
    textEn:
      'God promises to pour out his Spirit on all flesh — on sons and daughters, old and young, male and female servants. Peter quotes the passage at Pentecost as the explanation of what is happening. The phrase “all flesh” cuts across rank, age and sex.' },
  { id: 'p_amos5', ref: 'Am 5', book: 'Amos', de: '„Es ströme das Recht wie Wasser“', en: '“Let Justice Roll Down”',
    subDe: 'Gottesdienst ohne Gerechtigkeit', subEn: 'Worship without justice',
    textDe:
      'Amos lässt Gott die eigenen Feste zurückweisen: Er hasse die Wallfahrten und möge das Saitenspiel nicht hören, solange am Tor das Recht gebeugt wird. Martin Luther King zitierte den Vers vom strömenden Recht in seinen Reden.',
    textEn:
      'Amos has God reject his own festivals: he hates the pilgrim feasts and will not listen to the harps while justice is bent at the gate. Martin Luther King quoted the verse about justice rolling down in his speeches.' },
  { id: 'p_obad1', ref: 'Obd 1', book: 'Obad', de: 'Das Gericht über Edom', en: 'Judgement on Edom',
    subDe: 'Das kürzeste Buch des Alten Testaments', subEn: 'The shortest book in the Old Testament',
    textDe:
      'Einundzwanzig Verse gegen Edom, das beim Fall Jerusalems danebenstand und zusah. Der Vorwurf ist nicht der Überfall, sondern die Schadenfreude des Nachbarn – Edom galt als Brudervolk, Nachkommen Esaus.',
    textEn:
      'Twenty-one verses against Edom, which stood by and watched when Jerusalem fell. The charge is not the attack but a neighbour’s gloating — Edom counted as a brother people, the descendants of Esau.' },
  { id: 'p_jonah3', ref: 'Jona 3', book: 'Jonah', de: 'Ninive kehrt um', en: 'Nineveh Repents',
    subDe: 'Der Prophet ist darüber zornig', subEn: 'And the prophet is angry about it',
    textDe:
      'Jona sagt der feindlichen Großstadt den Untergang an, und sie kehrt um – vom König bis zum Vieh. Gott lässt es sich gereuen, und Jona ärgert sich genau darüber. Das Buch endet mit einer Frage Gottes, die unbeantwortet stehen bleibt.',
    textEn:
      'Jonah announces the fall of the enemy city, and it repents — from the king down to the cattle. God relents, and that is precisely what angers Jonah. The book ends with a question from God that is left unanswered.' },
  { id: 'p_mic5', ref: 'Mi 5:1', book: 'Mic', de: 'Bethlehem', en: 'Bethlehem Foretold',
    subDe: 'Aus dir wird der Herrscher kommen', subEn: 'From you shall come the ruler',
    textDe:
      'Aus Bethlehem, zu klein, um unter Judas Städten zu zählen, soll der kommen, der Herrscher in Israel sein wird. Die Schriftgelehrten nennen Herodes genau diesen Vers, als er nach dem Geburtsort des Messias fragt – ein seltener Fall, in dem das Neue Testament seine eigene Quelle offenlegt.',
    textEn:
      'From Bethlehem, too small to count among Judah’s towns, is to come the one who will rule in Israel. The scribes cite exactly this verse to Herod when he asks where the Messiah is to be born — a rare case where the New Testament names its own source.' },
  { id: 'p_nah1', ref: 'Nah 1', book: 'Nah', de: 'Der Fall Ninives', en: 'The Fall of Nineveh',
    subDe: 'Dieselbe Stadt, hundert Jahre später', subEn: 'The same city, a century later',
    textDe:
      'Wo Jona die Umkehr Ninives erzählt, kündigt Nahum ihr Ende an. Die Stadt fiel 612 v. Chr. an Babylonier und Meder. Die beiden Bücher stehen unvermittelt nebeneinander im Kanon – Gnade und Gericht über denselben Ort.',
    textEn:
      'Where Jonah tells of Nineveh’s repentance, Nahum announces its end. The city fell in 612 BC to the Babylonians and Medes. The two books stand side by side in the canon without smoothing — mercy and judgement over the same place.' },
  { id: 'p_hab2', ref: 'Hab 2', book: 'Hab', de: '„Der Gerechte wird aus Glauben leben“', en: '“The Righteous Shall Live by Faith”',
    subDe: 'Ein Prophet, der Gott zur Rede stellt', subEn: 'A prophet who calls God to account',
    textDe:
      'Habakuk beschwert sich bei Gott über die Gewalt und über die Antwort, die noch schlimmer klingt. Er stellt sich auf die Warte und wartet. Der Satz, den er dort bekommt, wird von Paulus dreimal zitiert und trug Luthers Entdeckung.',
    textEn:
      'Habakkuk complains to God about the violence, and then about the answer, which sounds worse. He takes his stand on the watchtower and waits. The line he is given there is quoted three times by Paul and carried Luther’s discovery.' },
  { id: 'p_zeph3', ref: 'Zef 3', book: 'Zeph', de: '„Er wird über dir jubeln“', en: '“He Will Rejoice over You”',
    subDe: 'Nach dem Gericht ein singender Gott', subEn: 'After the judgement, a singing God',
    textDe:
      'Zefanja kündigt einen Tag des Zorns an, von dem das mittelalterliche „Dies irae“ seinen Namen hat. Das Buch endet gegenläufig: Gott selbst freut sich über sein Volk und jubelt über ihm – ein Bild, das im Alten Testament einzig dasteht.',
    textEn:
      'Zephaniah announces a day of wrath, from which the medieval “Dies irae” takes its name. The book ends against the grain: God himself delights in his people and sings over them — an image without parallel in the Old Testament.' },
  { id: 'p_hag2', ref: 'Hag 2', book: 'Hag', de: 'Die Herrlichkeit des zweiten Hauses', en: 'The Glory of the Second House',
    subDe: 'Für die, die den ersten Tempel noch kannten', subEn: 'For those who still remembered the first temple',
    textDe:
      'Die Rückkehrer bauen einen Tempel, der die Alten enttäuscht: Wer den ersten noch gesehen hatte, weinte. Haggai sagt zu, die Herrlichkeit dieses Hauses werde größer sein als die des früheren – gesprochen über einer halbfertigen Baustelle.',
    textEn:
      'The returnees build a temple that disappoints the old: those who had seen the first one wept. Haggai promises that the glory of this house will be greater than the former — spoken over a half-finished building site.' },
  { id: 'p_zech9', ref: 'Sach 9:9', book: 'Zech', de: 'Der König auf dem Esel', en: 'The King on a Donkey',
    subDe: '„Dein König kommt zu dir, sanftmütig"', subEn: '"Your king comes to you, humble"',
    textDe:
      'Der König kommt nicht hoch zu Ross, sondern auf einem Esel: gerecht, ein Helfer, arm. Alle vier Evangelien erzählen den Einzug in Jerusalem so, dass diese Zeile hörbar wird. Der Gegensatz zum Streitross des Eroberers ist der Punkt der Stelle, nicht ein Zufall der Verkehrsmittel.',
    textEn:
      'The king comes not on a warhorse but on a donkey: righteous, bringing help, humble. All four gospels tell the entry into Jerusalem so that this line is audible. The contrast with a conqueror’s charger is the point of the passage, not an accident of transport.' },
  { id: 'p_mal3', ref: 'Mal 3:1', book: 'Mal', de: 'Der Bote des Bundes', en: 'The Messenger of the Covenant',
    subDe: 'Ein Wegbereiter vor dem HERRN', subEn: 'A forerunner before the LORD',
    textDe:
      'Das letzte Buch des Alten Testaments endet mit einer Ankündigung: Ein Bote wird den Weg bereiten, dann kommt der Herr plötzlich zu seinem Tempel. Die Evangelien beziehen den Boten auf Johannes den Täufer. Danach schweigen die Schriften – die Zeit zwischen den Testamenten beginnt.',
    textEn:
      'The last book of the Old Testament ends with an announcement: a messenger will prepare the way, then the Lord will suddenly come to his temple. The gospels apply the messenger to John the Baptist. After that the writings fall silent — the time between the testaments begins.' },
  // ---- Neues Testament -------------------------------------------------
  { id: 'p_matt5', ref: 'Mt 5-7', book: 'Matt', de: 'Die Bergpredigt', en: 'The Sermon on the Mount',
    subDe: 'Die Seligpreisungen und das Vaterunser', subEn: 'The Beatitudes and the Lord’s Prayer',
    textDe:
      'Die längste zusammenhängende Rede Jesu: Seligpreisungen, die Antithesen „Ihr habt gehört … ich aber sage euch“, das Vaterunser, die Warnung vor dem Sorgen, die goldene Regel. Sie verschärft das Gesetz und entlastet zugleich – und sie endet damit, dass die Zuhörer entsetzt sind.',
    textEn:
      'Jesus’ longest continuous discourse: the beatitudes, the antitheses “you have heard … but I say to you”, the Lord’s Prayer, the warning against anxiety, the golden rule. It sharpens the law and lifts a burden at once — and ends with the crowds astounded.' },
  { id: 'p_matt28', ref: 'Mt 28:18-20', book: 'Matt', de: 'Der Missionsbefehl', en: 'The Great Commission',
    subDe: '„Gehet hin und machet zu Jüngern"', subEn: '"Go and make disciples"',
    textDe:
      'Die letzten Verse des Matthäusevangeliums: alle Völker zu Jüngern machen, taufen, lehren. Der Auftrag steht zwischen zwei Zusagen – „mir ist gegeben alle Gewalt“ davor, „ich bin bei euch alle Tage“ danach. Der Vers steht am Anfang fast jeder Missionsgeschichte der Kirche.',
    textEn:
      'The closing verses of Matthew: make disciples of all nations, baptise, teach. The commission stands between two assurances — “all authority has been given to me” before, “I am with you always” after. The verse opens almost every missionary history the church has written.' },
  { id: 'p_mark1', ref: 'Mk 1', book: 'Mark', de: 'Der Anfang des Evangeliums', en: 'The Beginning of the Gospel',
    subDe: 'Kein Stammbaum, keine Kindheit – sofort los', subEn: 'No genealogy, no infancy — straight in',
    textDe:
      'Das älteste Evangelium beginnt ohne Vorgeschichte: Täufer, Taufe, Versuchung und die erste Predigt stehen auf einer Seite. Markus erzählt gehetzt – „und sogleich“ kommt über vierzigmal vor – und ist die Quelle, aus der Matthäus und Lukas schöpfen.',
    textEn:
      'The earliest gospel begins without prehistory: the Baptist, the baptism, the temptation and the first preaching all stand on one page. Mark tells it at a run — “and immediately” appears over forty times — and is the source Matthew and Luke draw on.' },
  { id: 'p_mark10', ref: 'Mk 10', book: 'Mark', de: '„Nicht um sich dienen zu lassen“', en: '“Not to Be Served”',
    subDe: 'Jakobus und Johannes wollen die besten Plätze', subEn: 'James and John want the best seats',
    textDe:
      'Zwei Jünger bitten um die Plätze rechts und links im Reich, kurz nachdem Jesus zum dritten Mal von seinem Tod gesprochen hat. Die Antwort dreht die Rangordnung um: Wer groß sein will, sei Diener. Der Vers gilt als Schlüsselsatz des Markusevangeliums.',
    textEn:
      'Two disciples ask for the seats at his right and left, just after Jesus has spoken of his death for the third time. The answer inverts the order of rank: whoever would be great must be a servant. The verse is regarded as the key line of Mark.' },
  { id: 'p_luke2', ref: 'Lk 2', book: 'Luke', de: 'Die Geburt Jesu', en: 'The Birth of Jesus',
    subDe: '„Euch ist heute der Heiland geboren"', subEn: '"To you is born this day a Savior"',
    textDe:
      'Lukas datiert die Geburt in die Weltgeschichte hinein – Kaiser Augustus, eine Schätzung, ein Weg nach Bethlehem – und erzählt sie dann von unten: Krippe, Hirten auf dem Feld, ein Engelchor. Über die genaue Schätzung des Quirinius wird historisch bis heute gestritten.',
    textEn:
      'Luke sets the birth inside world history — Caesar Augustus, a census, a journey to Bethlehem — and then tells it from below: a manger, shepherds in the fields, a chorus of angels. The exact census under Quirinius remains historically disputed.' },
  { id: 'p_luke15', ref: 'Lk 15', book: 'Luke', de: 'Der verlorene Sohn', en: 'The Prodigal Son',
    subDe: 'Der Vater läuft dem Heimkehrer entgegen', subEn: 'The father runs to meet his son',
    textDe:
      'Drei Gleichnisse vom Verlorenen, das letzte das bekannteste: Ein Sohn verlangt sein Erbe, verliert alles und kehrt zurück – und der Vater läuft ihm entgegen, ehe er seinen einstudierten Satz sagen kann. Die Geschichte endet offen, beim älteren Bruder, der draußen stehen bleibt.',
    textEn:
      'Three parables of what is lost, the last the best known: a son demands his inheritance, loses everything and returns — and the father runs to meet him before he can deliver his rehearsed speech. The story ends open, with the elder brother still standing outside.' },
  { id: 'p_john1', ref: 'Joh 1', book: 'John', de: 'Das Wort wurde Fleisch', en: 'The Word Became Flesh',
    subDe: '„Im Anfang war das Wort"', subEn: '"In the beginning was the Word"',
    textDe:
      'Der Prolog beginnt wie die Schöpfungsgeschichte – „Im Anfang“ – und führt zu dem Satz, an dem sich das Christentum von jeder bloßen Lehre unterscheidet: Das Wort wurde Fleisch und wohnte unter uns. Das griechische Wort dafür heißt wörtlich „zeltete“ und erinnert an die Stiftshütte.',
    textEn:
      'The prologue opens like the creation account — “In the beginning” — and leads to the line that separates Christianity from any mere teaching: the Word became flesh and dwelt among us. The Greek word means literally “pitched his tent”, recalling the tabernacle.' },
  { id: 'p_john3', ref: 'Joh 3:16', book: 'John', de: 'Also hat Gott die Welt geliebt', en: 'For God So Loved the World',
    subDe: 'Der bekannteste Vers der Bibel', subEn: 'The best-known verse in the Bible',
    textDe:
      'Der wohl meistzitierte Vers der Bibel, gesprochen im Nachtgespräch mit Nikodemus. Er hält Gottes Liebe, die Hingabe des Sohnes und das Ziel des Ganzen in einem Satz zusammen. Der Vers danach setzt den Ton: Gott hat den Sohn nicht gesandt, um die Welt zu richten, sondern zu retten.',
    textEn:
      'Probably the most quoted verse in the Bible, spoken in the night conversation with Nicodemus. It holds God’s love, the giving of the Son and the aim of it all in a single sentence. The verse after it sets the tone: God sent the Son not to judge the world but to save it.' },
  { id: 'p_john14', ref: 'Joh 14:6', book: 'John', de: 'Ich bin der Weg', en: 'I Am the Way',
    subDe: '„Niemand kommt zum Vater denn durch mich"', subEn: '"No one comes to the Father except through me"',
    textDe:
      'Auf Thomas’ Frage nach dem Weg antwortet Jesus mit einem Anspruch, an dem sich die Geister scheiden: „Ich bin der Weg und die Wahrheit und das Leben.“ Der Satz steht im Abschiedsgespräch, als Trost für Verängstigte – nicht als Formel, sondern in einem Raum voller Abschied.',
    textEn:
      'To Thomas’ question about the way, Jesus answers with a claim that divides opinion: “I am the way, and the truth, and the life.” The line stands in the farewell discourse, as comfort for the frightened — not as a formula, but in a room full of leave-taking.' },
  { id: 'p_acts2', ref: 'Apg 2', book: 'Acts', de: 'Pfingsten', en: 'Pentecost',
    subDe: 'Der Heilige Geist und die erste Predigt', subEn: 'The Spirit and the first sermon',
    textDe:
      'Fünfzig Tage nach Ostern kommt der Geist mit Sturm und Feuer, und Menschen aus fünfzehn genannten Regionen hören die Botschaft je in ihrer eigenen Sprache. Petrus deutet es mit Joel, und dreitausend lassen sich taufen. Pfingsten kehrt Babel um: nicht eine Sprache, sondern alle.',
    textEn:
      'Fifty days after Easter the Spirit comes with wind and fire, and people from fifteen named regions each hear the message in their own language. Peter explains it from Joel, and three thousand are baptised. Pentecost reverses Babel: not one language, but all of them.' },
  { id: 'p_rom3', ref: 'Röm 3:21-26', book: 'Rom', de: 'Rechtfertigung aus Glauben', en: 'Justified by Faith',
    subDe: 'Gerecht aus Gnade durch den Glauben', subEn: 'Righteous by grace through faith',
    textDe:
      'Der dichteste Abschnitt des Römerbriefs: Alle haben gesündigt, und alle werden ohne Verdienst gerecht durch die Erlösung in Christus. Luther rang jahrelang mit diesen Versen; an ihnen entschied sich die Reformation. Paulus betont zweimal, dass damit jedes Rühmen ausgeschlossen ist.',
    textEn:
      'The densest passage in Romans: all have sinned, and all are justified freely through the redemption in Christ. Luther wrestled for years with these verses; the Reformation turned on them. Paul insists twice that this rules out any boasting.' },
  { id: 'p_rom8', ref: 'Röm 8', book: 'Rom', de: 'Nichts kann uns scheiden', en: 'Nothing Can Separate Us',
    subDe: 'Keine Verdammnis – keine Macht trennt von Gottes Liebe', subEn: 'No condemnation, no power separates us from God’s love',
    textDe:
      'Das Kapitel beginnt mit „keine Verdammnis“ und endet mit einer Aufzählung dessen, was nicht scheiden kann: nicht Tod noch Leben, nicht Gegenwärtiges noch Zukünftiges. Dazwischen steht der Seufzer der ganzen Schöpfung und der Geist, der für uns eintritt, wo Worte fehlen.',
    textEn:
      'The chapter opens with “no condemnation” and closes with a list of what cannot separate: neither death nor life, neither present nor future. In between stand the groaning of all creation and the Spirit who intercedes where words fail.' },
  { id: 'p_1cor13', ref: '1Kor 13', book: '1Cor', de: 'Das Hohelied der Liebe', en: 'The Hymn to Love',
    subDe: '„Die Liebe höret nimmer auf"', subEn: '"Love never ends"',
    textDe:
      'Paulus unterbricht eine Auseinandersetzung über Geistesgaben mit einem Text über die Liebe – nicht als Gefühl, sondern als Verhaltensweise: langmütig, nicht aufgeblasen, sie rechnet das Böse nicht zu. Am Ende bleiben Glaube, Hoffnung, Liebe; die Liebe ist die größte.',
    textEn:
      'Paul interrupts an argument about spiritual gifts with a text on love — not as feeling but as conduct: patient, not puffed up, keeping no record of wrong. At the end faith, hope and love remain; and the greatest of these is love.' },
  { id: 'p_1cor15', ref: '1Kor 15', book: '1Cor', de: 'Die Auferstehung', en: 'The Resurrection',
    subDe: '„Ist Christus nicht auferstanden, so ist unser Glaube nichtig"', subEn: '"If Christ has not been raised, your faith is futile"',
    textDe:
      'Paulus gibt weiter, was er selbst empfangen hat – eine frühe Bekenntnisformel mit einer Liste von Zeugen, darunter über fünfhundert auf einmal. Dann zieht er die Konsequenz: Ist Christus nicht auferstanden, so ist der Glaube nichtig. Das Kapitel ist der älteste Osterbericht überhaupt.',
    textEn:
      'Paul passes on what he himself received — an early confession with a list of witnesses, including more than five hundred at once. Then he draws the consequence: if Christ is not raised, the faith is empty. The chapter is the earliest Easter account we have.' },
  { id: 'p_2cor5', ref: '2Kor 5', book: '2Cor', de: 'Der Dienst der Versöhnung', en: 'The Ministry of Reconciliation',
    subDe: '„Lasst euch versöhnen mit Gott“', subEn: '“Be reconciled to God”',
    textDe:
      'Paulus schreibt aus einer angeschlagenen Beziehung heraus – der Brief verteidigt sein Amt gegen Kritik in Korinth. Gerade dort steht der Satz von der neuen Schöpfung und der Auftrag, andere zur Versöhnung zu rufen, als Gesandte an Christi statt.',
    textEn:
      'Paul writes out of a damaged relationship — the letter defends his ministry against criticism in Corinth. It is exactly there that the line about the new creation stands, and the commission to call others to reconciliation as ambassadors for Christ.' },
  { id: 'p_gal5', ref: 'Gal 5:22-23', book: 'Gal', de: 'Die Frucht des Geistes', en: 'The Fruit of the Spirit',
    subDe: 'Liebe, Freude, Friede …', subEn: 'Love, joy, peace …',
    textDe:
      'Gegen eine Liste von Verfehlungen stellt Paulus nicht eine Gegenliste von Leistungen, sondern eine Frucht – im Singular: Liebe, Freude, Friede, Geduld, Freundlichkeit, Güte, Treue, Sanftmut, Selbstbeherrschung. Was wächst, macht man nicht; man lässt es wachsen.',
    textEn:
      'Against a list of failings Paul sets not a counter-list of achievements but a fruit — in the singular: love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, self-control. What grows is not manufactured; it is allowed to grow.' },
  { id: 'p_eph2', ref: 'Eph 2:8-9', book: 'Eph', de: 'Aus Gnade gerettet', en: 'Saved by Grace',
    subDe: '„Aus Gnade seid ihr selig geworden durch den Glauben"', subEn: '"By grace you have been saved through faith"',
    textDe:
      'Rettung ist Gottes Geschenk und nicht Lohn der Werke – „damit sich nicht jemand rühme“. Der Abschnitt wurde zum Kernsatz der Reformation. Der Vers unmittelbar danach hält die andere Hälfte fest: geschaffen zu guten Werken, die Gott vorher bereitet hat.',
    textEn:
      'Salvation is God’s gift and not a wage for works — “so that no one may boast”. The passage became a watchword of the Reformation. The verse immediately after holds the other half: created for good works, which God prepared beforehand.' },
  { id: 'p_phil2', ref: 'Phil 2:5-11', book: 'Phil', de: 'Der Christushymnus', en: 'The Christ Hymn',
    subDe: 'Er entäußerte sich – darum hat Gott ihn erhöht', subEn: 'He emptied himself — therefore God exalted him',
    textDe:
      'Wahrscheinlich ein Hymnus, den Paulus zitiert statt ihn zu dichten: Christus hielt nicht fest, was ihm zustand, entäußerte sich, wurde gehorsam bis zum Kreuz – darum hat Gott ihn erhöht. Paulus führt ihn nicht als Lehrstück an, sondern als Begründung dafür, einander den Vortritt zu lassen.',
    textEn:
      'Probably a hymn Paul quotes rather than composes: Christ did not cling to what was his, emptied himself, became obedient to the cross — therefore God exalted him. Paul cites it not as doctrine but as the ground for putting one another first.' },
  { id: 'p_col1', ref: 'Kol 1', book: 'Col', de: 'Der Kolosserhymnus', en: 'The Colossian Hymn',
    subDe: '„Er ist das Ebenbild des unsichtbaren Gottes“', subEn: '“He is the image of the invisible God”',
    textDe:
      'Ein früher Hymnus über Christus als Ebenbild Gottes, in dem alles geschaffen ist und Bestand hat. Paulus zitiert ihn gegen eine Frömmigkeit, die Christus für eine Stufe unter anderen hielt – die Reichweite ist Schöpfung und Versöhnung zugleich.',
    textEn:
      'An early hymn on Christ as the image of God, in whom all things were created and hold together. Paul cites it against a piety that made Christ one rung among others — its reach is creation and reconciliation at once.' },
  { id: 'p_1thess4', ref: '1Thess 4', book: '1Thess', de: 'Die Hoffnung für die Entschlafenen', en: 'Hope for Those Who Sleep',
    subDe: 'Der älteste erhaltene Brief des Paulus', subEn: 'The oldest surviving letter of Paul',
    textDe:
      'In Thessalonich starben Gemeindeglieder, bevor Christus wiederkam, und die Zurückgebliebenen waren ratlos. Paulus antwortet mit dem Bild vom Entgegengehen und dem Zweck des Ganzen: „So tröstet euch mit diesen Worten.“ Der Brief entstand um 50 n. Chr.',
    textEn:
      'In Thessalonica members of the church died before Christ returned, and those left behind were at a loss. Paul answers with the picture of going out to meet him, and states the purpose: “So encourage one another with these words.” The letter dates from about AD 50.' },
  { id: 'p_2thess3', ref: '2Thess 3', book: '2Thess', de: '„Wer nicht arbeiten will“', en: '“If Anyone Will Not Work”',
    subDe: 'Naherwartung als Ausrede', subEn: 'Imminent hope as an excuse',
    textDe:
      'Einige in Thessalonich hatten die Arbeit niedergelegt, weil der Tag des Herrn ja unmittelbar bevorstehe. Paulus verweist auf sein eigenes Handwerk und stellt die Regel auf, die später oft aus dem Zusammenhang gerissen wurde.',
    textEn:
      'Some in Thessalonica had stopped working because the day of the Lord was surely imminent. Paul points to his own trade and lays down the rule that was later so often torn from its context.' },
  { id: 'p_1tim2', ref: '1Tim 2', book: '1Tim', de: 'Ein Mittler zwischen Gott und Menschen', en: 'One Mediator',
    subDe: 'Gebet für alle Menschen, auch für Könige', subEn: 'Prayer for all people, kings included',
    textDe:
      'Der Brief ruft zum Gebet für alle Menschen auf, ausdrücklich auch für die Obrigkeit, und nennt den Grund: Gott will, dass allen geholfen werde. Dasselbe Kapitel enthält Anweisungen über Frauen, die bis heute unterschiedlich ausgelegt werden.',
    textEn:
      'The letter calls for prayer for all people, expressly including those in authority, and gives the reason: God wants everyone to be helped. The same chapter contains instructions about women that are still read in very different ways.' },
  { id: 'p_2tim3', ref: '2Tim 3', book: '2Tim', de: '„Alle Schrift ist von Gott eingegeben“', en: '“All Scripture Is God-breathed”',
    subDe: 'Der Vers, an dem sich die Schriftlehre festmacht', subEn: 'The verse doctrines of scripture hang on',
    textDe:
      'Der Brief liest sich wie ein Vermächtnis: Paulus schreibt aus der Haft an einen jüngeren Mitarbeiter. „Schrift“ meint hier zunächst das Alte Testament – das Neue war noch im Entstehen. Der Zweck steht dabei: zurechtbringen und zurüsten.',
    textEn:
      'The letter reads like a legacy: Paul writes from prison to a younger colleague. “Scripture” here means first of all the Old Testament — the New was still being written. The purpose is stated alongside: to correct and to equip.' },
  { id: 'p_titus2', ref: 'Tit 2', book: 'Titus', de: 'Die Gnade erzieht', en: 'Grace That Trains',
    subDe: 'Warum aus Gnade kein Freibrief wird', subEn: 'Why grace is not a licence',
    textDe:
      'Der Brief hält zusammen, was oft getrennt wird: Die Gnade ist erschienen und rettet – und sie erzieht dazu, anders zu leben. Der Abschnitt richtet sich an Alte, Junge, Sklaven, an eine Gemeinde auf Kreta mit einem schlechten Ruf.',
    textEn:
      'The letter holds together what is often split: grace has appeared and saves — and it trains people to live differently. The passage addresses old and young and slaves, in a church on Crete with a poor reputation.' },
  { id: 'p_phlm1', ref: 'Phlm 1', book: 'Phlm', de: 'Der Brief an Philemon', en: 'The Letter to Philemon',
    subDe: 'Ein entlaufener Sklave kommt zurück', subEn: 'A runaway slave returns',
    textDe:
      'Paulus schickt Onesimus zu seinem Herrn zurück und bittet, ihn nicht mehr als Sklaven aufzunehmen, sondern als Bruder. Er fordert die Freilassung nicht, aber er macht sie schwer vermeidbar. Der Brief hat in der Abolitionsdebatte beiden Seiten gedient.',
    textEn:
      'Paul sends Onesimus back to his master and asks that he be received no longer as a slave but as a brother. He does not demand manumission, but he makes it hard to avoid. The letter served both sides in the abolition debate.' },
  { id: 'p_heb11', ref: 'Hebr 11', book: 'Heb', de: 'Die Glaubenszeugen', en: 'The Heroes of Faith',
    subDe: '„Der Glaube ist ein Nichtzweifeln an dem, was man hofft"', subEn: '"Faith is the assurance of things hoped for"',
    textDe:
      'Eine Galerie der Glaubenden von Abel über Noah, Abraham und Mose bis zu namenlosen Verfolgten. Der Refrain lautet „durch Glauben“, und das Kapitel endet mit dem Eingeständnis, dass sie alle die Verheißung nicht erlangten. Die Definition am Anfang trägt das Ganze.',
    textEn:
      'A gallery of the faithful from Abel through Noah, Abraham and Moses to nameless persecuted people. The refrain is “by faith”, and the chapter ends by admitting that none of them received what was promised. The definition at the start carries the whole.' },
  { id: 'p_jas2', ref: 'Jak 2', book: 'Jas', de: 'Glaube ohne Werke', en: 'Faith without Works',
    subDe: '„Der Glaube ohne Werke ist tot“', subEn: '“Faith without works is dead”',
    textDe:
      'Jakobus greift die Bevorzugung der Reichen in der Versammlung an und stellt fest, dass ein Glaube, der niemanden satt macht, tot ist. Luther nannte den Brief deshalb eine „stroherne Epistel“; beide berufen sich auf Abraham und meinen Verschiedenes mit „Werke“.',
    textEn:
      'James attacks the favouring of the rich in the assembly and states that a faith which feeds nobody is dead. Luther therefore called the letter “an epistle of straw”; both he and James appeal to Abraham, and mean different things by “works”.' },
  { id: 'p_1pet2', ref: '1Petr 2', book: '1Pet', de: 'Ein königliches Priestertum', en: 'A Royal Priesthood',
    subDe: 'Geschrieben an Fremdlinge in der Zerstreuung', subEn: 'Written to strangers in the dispersion',
    textDe:
      'Der Brief redet eine bedrängte Minderheit als erwähltes Geschlecht und königliche Priesterschaft an – Titel, die im Alten Testament Israel gelten. Aus dieser Stelle entwickelte die Reformation das Priestertum aller Getauften.',
    textEn:
      'The letter addresses a hard-pressed minority as a chosen race and a royal priesthood — titles given to Israel in the Old Testament. From this passage the Reformation developed the priesthood of all the baptised.' },
  { id: 'p_2pet3', ref: '2Petr 3', book: '2Pet', de: '„Ein Tag wie tausend Jahre“', en: '“A Day like a Thousand Years”',
    subDe: 'Antwort auf die Frage, warum nichts geschieht', subEn: 'An answer to why nothing is happening',
    textDe:
      'Spötter fragen, wo denn die versprochene Wiederkunft bleibe. Die Antwort verschiebt den Maßstab: Bei Gott ist ein Tag wie tausend Jahre. Das Zögern sei kein Säumen, sondern Geduld. Derselbe Brief nennt die Paulusbriefe „schwer zu verstehen“.',
    textEn:
      'Scoffers ask where the promised coming has got to. The answer shifts the scale: with God one day is like a thousand years. The delay is not slowness but patience. The same letter calls Paul’s letters “hard to understand”.' },
  { id: 'p_1john4', ref: '1Joh 4', book: '1John', de: '„Gott ist Liebe“', en: '“God Is Love”',
    subDe: 'Und was der Satz im Brief tatsächlich trägt', subEn: 'And what the sentence actually carries',
    textDe:
      'Der kürzeste Satz über Gott in der Bibel steht nicht allein: Er wird zweimal gesagt und beide Male sofort begründet – daran, dass Gott seinen Sohn sandte. Der Brief zieht daraus keine Stimmung, sondern eine Probe: Wer den Bruder nicht liebt, kennt Gott nicht.',
    textEn:
      'The shortest sentence about God in the Bible does not stand alone: it is said twice, and both times immediately grounded in God’s sending of his Son. The letter draws from it not a mood but a test: whoever does not love a brother does not know God.' },
  { id: 'p_2john1', ref: '2Joh 1', book: '2John', de: 'Wahrheit und Gastfreundschaft', en: 'Truth and Hospitality',
    subDe: 'Dreizehn Verse an „die auserwählte Herrin“', subEn: 'Thirteen verses to “the elect lady”',
    textDe:
      'Der kürzeste Brief des Neuen Testaments verbindet zwei Anliegen, die schwer zusammengehen: einander lieben und Wanderlehrern, die Christus nicht im Fleisch gekommen bekennen, kein Haus geben. Wer die „auserwählte Herrin“ ist, eine Person oder eine Gemeinde, ist offen.',
    textEn:
      'The shortest letter in the New Testament joins two concerns that sit awkwardly together: love one another, and give no lodging to travelling teachers who deny that Christ came in the flesh. Whether the “elect lady” is a person or a church is open.' },
  { id: 'p_3john1', ref: '3Joh 1', book: '3John', de: 'Diotrephes und Gaius', en: 'Diotrephes and Gaius',
    subDe: 'Ein Streit um Gastrecht in einer Gemeinde', subEn: 'A quarrel over hospitality in one church',
    textDe:
      'Ein Brief über einen Mann, der in seiner Gemeinde niemanden aufnehmen will und andere hinauswirft, und über einen, der es anders macht. Es geht um nichts Grundsätzliches – und gerade deshalb zeigt der Text, wie früher Gemeindealltag aussah.',
    textEn:
      'A letter about a man who will receive nobody in his church and throws others out, and about one who does otherwise. Nothing doctrinal is at stake — and that is exactly why the text shows what everyday church life looked like.' },
  { id: 'p_jude1', ref: 'Jud 1', book: 'Jude', de: '„Kämpft für den Glauben“', en: '“Contend for the Faith”',
    subDe: 'Ein scharfer Brief mit einem sanften Schluss', subEn: 'A sharp letter with a gentle close',
    textDe:
      'Fünfundzwanzig Verse gegen Leute, die die Gnade als Freibrief nehmen. Der Brief zitiert dabei Schriften, die nicht im Kanon stehen, darunter das Henochbuch. Er endet mit einem Lobpreis, der bis heute am Ende von Gottesdiensten gesprochen wird.',
    textEn:
      'Twenty-five verses against people who take grace as a licence. The letter quotes writings that are not in the canon, among them the book of Enoch. It ends with a doxology still spoken at the close of services today.' },
  { id: 'p_rev21', ref: 'Offb 21', book: 'Rev', de: 'Neuer Himmel und neue Erde', en: 'A New Heaven and a New Earth',
    subDe: '„Gott wird abwischen alle Tränen"', subEn: '"God will wipe away every tear"',
    textDe:
      'Die letzte Vision: ein neuer Himmel, eine neue Erde, die Stadt kommt herab, und Gott wohnt bei den Menschen. Kein Tod, kein Leid, kein Geschrei mehr – und ausdrücklich kein Tempel, weil Gott selbst da ist. Die Bibel endet nicht im Himmel, sondern in einer bewohnten Stadt.',
    textEn:
      'The final vision: a new heaven, a new earth, the city coming down, and God dwelling with humanity. No death, no mourning, no crying — and explicitly no temple, because God himself is there. The Bible ends not in heaven but in an inhabited city.' },
];
