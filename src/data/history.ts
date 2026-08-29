// A guided chronological journey through the biblical narrative — from creation
// to the new creation. Dates are approximate and didactic, matching eras.ts.
// `places` are place names resolved against the map data at runtime.

export interface Milestone {
  id: string;
  era: string; // era id (eras.ts) for colour
  date: string;
  de: { title: string; text: string };
  en: { title: string; text: string };
  ref: { osis: string; chapter: number; label: string };
  places: string[];
  video?: string; // optional YouTube id
}

export const HISTORY: Milestone[] = [
  {
    id: 'creation', era: 'patriarchs', date: 'Urgeschichte',
    de: { title: 'Schöpfung', text: 'Nicht ein Bericht darüber, wie etwas entstand, sondern wozu: aus Wüst und Leer wird an sechs Tagen ein geordneter Raum, in den der Mensch als Bild Gottes gesetzt wird. Der siebte Tag gehört keiner Arbeit.' },
    en: { title: 'Creation', text: 'Not an account of how something came to be, but what for: out of formless emptiness six days build an ordered space, into which humanity is set as the image of God. The seventh day belongs to no work at all.' },
    ref: { osis: 'Gen', chapter: 1, label: '1. Mose 1–2' }, places: ['Eden'], video: 'GQI72THyO5I',
  },
  {
    id: 'fall', era: 'patriarchs', date: 'Urgeschichte',
    de: { title: 'Der Sündenfall', text: 'Die erste Frage der Schlange ist keine Behauptung, sondern ein Zweifel: „Sollte Gott gesagt haben?" Was folgt, ist kein Absturz in Wildheit, sondern ein Riss, der durch alles Weitere geht – Scham, Schuldzuweisung, ein verschlossener Garten.' },
    en: { title: 'The Fall', text: 'The serpent’s first move is not a claim but a doubt: "did God really say?" What follows is not a plunge into savagery but a crack that runs through everything after – shame, blame-shifting, a garden closed behind them.' },
    ref: { osis: 'Gen', chapter: 3, label: '1. Mose 3' }, places: ['Eden'],
  },
  {
    id: 'flood', era: 'patriarchs', date: 'Urgeschichte',
    de: { title: 'Die Sintflut', text: 'Gott bewahrt Noah und seine Familie durch eine Katastrophe hindurch, nicht davor. Danach ein Bogen in den Wolken und eine Zusage ohne Bedingung: nie wieder. Flutgeschichten kennen auch die Nachbarvölker – das Gilgamesch-Epos erzählt eine sehr ähnliche.' },
    en: { title: 'The Flood', text: 'God preserves Noah and his family through the catastrophe, not from it. Afterwards a bow in the clouds and an unconditional promise: never again. Neighbouring peoples told flood stories too – the Epic of Gilgamesh tells a very similar one.' },
    ref: { osis: 'Gen', chapter: 7, label: '1. Mose 6–9' }, places: ['Ararat'],
  },
  {
    id: 'babel', era: 'patriarchs', date: 'Urgeschichte',
    de: { title: 'Turmbau zu Babel', text: 'Eine Menschheit, eine Sprache, ein Bauprojekt „damit wir uns einen Namen machen". Gott verwirrt die Sprache und zerstreut sie – und ausgerechnet die Zerstreuung wird in Kapitel 12 zur Landkarte, auf der die Verheißung an alle Völker gilt.' },
    en: { title: 'The Tower of Babel', text: 'One humanity, one language, one building project "so that we may make a name for ourselves". God confuses the language and scatters them – and it is exactly that scattering which becomes, in chapter 12, the map on which the promise to all nations is made.' },
    ref: { osis: 'Gen', chapter: 11, label: '1. Mose 11' }, places: ['Babel', 'Shinar'],
  },
  {
    id: 'abraham', era: 'patriarchs', date: '~2000 v. Chr.',
    de: { title: 'Berufung Abrahams', text: 'Ein kinderloser Mann von fünfundsiebzig bekommt eine Zusage in drei Teilen: Land, Nachkommen, Segen für alle Völker. Er bekommt zu Lebzeiten davon fast nichts – nur einen Sohn und ein Grab. Der Rest steht aus, und das Buch weiß das.' },
    en: { title: 'The Call of Abraham', text: 'A childless man of seventy-five is given a promise in three parts: land, offspring, blessing for all nations. In his lifetime he receives almost none of it – one son and a burial cave. The rest is outstanding, and the book knows it.' },
    ref: { osis: 'Gen', chapter: 12, label: '1. Mose 12' }, places: ['Ur', 'Haran', 'Shechem', 'Hebron', 'Canaan'],
  },
  {
    id: 'joseph', era: 'patriarchs', date: '~1900 v. Chr.',
    de: { title: 'Josef in Ägypten', text: 'Verkauft von den eigenen Brüdern, steigt er vom Sklaven zum Verwalter des Reiches auf und rettet die Familie, die ihn losgeworden war. Sein Satz am Ende ist der Schlüssel zum ganzen Buch: „Ihr gedachtet es böse zu machen, aber Gott gedachte es gut zu machen."' },
    en: { title: 'Joseph in Egypt', text: 'Sold by his own brothers, he rises from slave to administrator of the empire and saves the family that got rid of him. His closing line is the key to the whole book: "you meant evil against me, but God meant it for good."' },
    ref: { osis: 'Gen', chapter: 41, label: '1. Mose 37–50' }, places: ['Egypt', 'Goshen'],
  },
  {
    id: 'exodus', era: 'exodus', date: '~1446 v. Chr.',
    de: { title: 'Auszug aus Ägypten', text: 'Das Gründungsereignis Israels, auf das sich die Bibel danach hunderte Male beruft: ein Sklavenvolk geht frei. Zehn Plagen, eine Nacht mit Blut an den Türpfosten, ein Meer, das sich teilt – und ein Fest, das seither jedes Jahr davon erzählt.' },
    en: { title: 'The Exodus', text: 'Israel’s founding event, invoked hundreds of times in the rest of the Bible: a nation of slaves walks free. Ten plagues, a night with blood on the doorposts, a sea that parts – and a festival that has retold it every year since.' },
    ref: { osis: 'Exod', chapter: 14, label: '2. Mose 12–14' }, places: ['Egypt', 'Red Sea'], video: 'jH_aojNJM3E',
  },
  {
    id: 'sinai', era: 'exodus', date: '~1446 v. Chr.',
    de: { title: 'Sinai: Bund und Gebote', text: 'Sieben Wochen nach dem Auszug ein Berg, Rauch und ein Vertrag: nicht Regeln für Fremde, sondern die Bedingungen einer Beziehung, die mit „Ich bin der HERR, dein Gott, der dich aus Ägypten geführt hat" beginnt. Wo der Berg lag, ist bis heute umstritten.' },
    en: { title: 'Sinai: covenant and commandments', text: 'Seven weeks after the exodus, a mountain, smoke, and a treaty: not rules for strangers but the terms of a relationship that opens with "I am the LORD your God, who brought you out of Egypt." Where the mountain stood is disputed to this day.' },
    ref: { osis: 'Exod', chapter: 20, label: '2. Mose 19–24' }, places: ['Mount Sinai'],
  },
  {
    id: 'wilderness', era: 'exodus', date: '~1445–1406 v. Chr.',
    de: { title: 'Vierzig Jahre Wüste', text: 'Elf Tagesmärsche von Kadesch bis ins Land – und vierzig Jahre daraus, weil zehn von zwölf Kundschaftern die Riesen sahen und nicht die Frucht. Eine ganze Generation stirbt unterwegs, einschließlich Mose. Von zweiundvierzig Lagern ist kaum eines sicher zu zeigen.' },
    en: { title: 'Forty years in the wilderness', text: 'Eleven days’ march from Kadesh to the land – and forty years made of it, because ten of the twelve scouts saw the giants and not the fruit. A whole generation dies on the way, Moses included. Of forty-two camps hardly one can be located with confidence.' },
    ref: { osis: 'Num', chapter: 13, label: '4. Mose 13–14; 33' }, places: ['Kadesh-barnea', 'Paran', 'Mount Nebo'],
  },
  {
    id: 'conquest', era: 'conquest', date: '~1406 v. Chr.',
    de: { title: 'Landnahme', text: 'Der Jordan steht still, Jericho fällt nach sieben Tagen Umrundung – und danach wird es zäh: Josua 12 zählt besiegte Könige, Richter 1 zählt auf, was nicht eingenommen wurde. Wie gewaltsam die Landnahme wirklich verlief, ist archäologisch umstritten.' },
    en: { title: 'The conquest', text: 'The Jordan stands still, Jericho falls after seven days of circling – and then it grinds: Joshua 12 lists defeated kings, Judges 1 lists what was never taken. How violent the settlement really was is archaeologically disputed.' },
    ref: { osis: 'Josh', chapter: 6, label: 'Josua 6' }, places: ['Jericho', 'Jordan', 'Canaan'],
  },
  {
    id: 'judges', era: 'conquest', date: '~1350–1050 v. Chr.',
    de: { title: 'Die Zeit der Richter', text: 'Dreihundert Jahre in einer Schleife: das Volk vergisst, gerät unter Druck, schreit, bekommt einen Retter, vergisst wieder. Debora, Gideon, Simson – keiner davon ein Vorbild ohne Bruch. Der letzte Satz des Buches erklärt alles: „Jeder tat, was ihn recht dünkte."' },
    en: { title: 'The age of the judges', text: 'Three centuries on a loop: the people forget, come under pressure, cry out, are given a rescuer, forget again. Deborah, Gideon, Samson – not one of them an unbroken model. The book’s last line explains everything: "everyone did what was right in his own eyes."' },
    ref: { osis: 'Judg', chapter: 2, label: 'Richter 2; 21,25' }, places: ['Shiloh', 'Bethel', 'Ophrah'],
  },
  {
    id: 'kingdom', era: 'united', date: '~1050 v. Chr.',
    de: { title: 'Israel will einen König', text: 'Das Volk verlangt einen König, „wie ihn alle Völker haben". Samuel warnt der Länge nach, was ein König kostet – Söhne, Töchter, Felder, den Zehnten – und salbt dann doch. Saul fängt bescheiden an und endet auf dem Berg Gilboa.' },
    en: { title: 'Israel asks for a king', text: 'The people demand a king, "like all the other nations". Samuel spells out at length what a king costs – sons, daughters, fields, a tenth of everything – and then anoints one anyway. Saul begins modestly and ends on Mount Gilboa.' },
    ref: { osis: '1Sam', chapter: 8, label: '1. Samuel 8–10' }, places: ['Ramah', 'Mizpah', 'Gibeah'],
  },
  {
    id: 'david', era: 'united', date: '~1000 v. Chr.',
    de: { title: 'König David & Jerusalem', text: 'Der jüngste von acht Söhnen wird König über alle Stämme und nimmt eine Stadt ein, die keinem Stamm gehört – deshalb kann sie allen gehören. Die Zusage an ihn reicht über ihn hinaus: ein Thron, der bleibt. Sein größtes Versagen steht im selben Buch.' },
    en: { title: 'King David & Jerusalem', text: 'The youngest of eight sons becomes king over all the tribes and takes a city that belongs to no tribe – which is why it can belong to all. The promise made to him reaches past him: a throne that lasts. His worst failure stands in the same book.' },
    ref: { osis: '2Sam', chapter: 5, label: '2. Samuel 5' }, places: ['Jerusalem', 'Hebron', 'Bethlehem', 'Zion'],
  },
  {
    id: 'temple', era: 'united', date: '~960 v. Chr.',
    de: { title: 'Salomos Tempel', text: 'Sieben Jahre Bau, Zedern aus dem Libanon, Gold über allem – und bei der Einweihung sagt der Bauherr selbst den entscheidenden Satz: „Der Himmel und aller Himmel Himmel können dich nicht fassen; wie sollte es dann dies Haus tun?"' },
    en: { title: 'Solomon’s temple', text: 'Seven years of building, cedar from Lebanon, gold over everything – and at the dedication the builder himself says the decisive line: "heaven and the highest heaven cannot contain you; how much less this house that I have built."' },
    ref: { osis: '1Kgs', chapter: 6, label: '1. Könige 6–8' }, places: ['Jerusalem', 'Zion'],
  },
  {
    id: 'divided', era: 'divided', date: '~930 v. Chr.',
    de: { title: 'Reichsteilung', text: 'Salomos Sohn wird gefragt, ob er das Joch erleichtert, hört auf die falschen Berater und antwortet mit Skorpionen. Zehn Stämme gehen. Aus einem Volk werden zwei Staaten, zwei Hauptstädte und zwei Reihen von Königen, die einander bekriegen.' },
    en: { title: 'The kingdom divides', text: 'Solomon’s son is asked whether he will lighten the yoke, listens to the wrong advisers, and answers with scorpions. Ten tribes walk out. One people becomes two states, two capitals and two lines of kings who go to war with each other.' },
    ref: { osis: '1Kgs', chapter: 12, label: '1. Könige 12' }, places: ['Samaria', 'Jerusalem'],
  },
  {
    id: 'elijah', era: 'divided', date: '~860 v. Chr.',
    de: { title: 'Elia und die Propheten', text: 'Neben den Königen läuft eine zweite Reihe: Menschen ohne Amt, die den Mächtigen sagen, was niemand sagt. Elia stellt auf dem Karmel vierhundertfünfzig Propheten zur Wahl – und hört Gott danach nicht im Sturm, sondern in einem „stillen sanften Sausen".' },
    en: { title: 'Elijah and the prophets', text: 'Alongside the kings runs a second line: people with no office who tell the powerful what nobody says. On Carmel, Elijah puts four hundred and fifty prophets to the test – and afterwards hears God not in the storm but in "a still small voice".' },
    ref: { osis: '1Kgs', chapter: 18, label: '1. Könige 17–19' }, places: ['Mount Carmel', 'Mount Horeb', 'Samaria'],
  },
  {
    id: 'assyria', era: 'divided', date: '722 v. Chr.',
    de: { title: 'Fall des Nordreichs', text: 'Samaria fällt nach drei Jahren Belagerung; Assyrien deportiert die Oberschicht und siedelt Fremde an. Zehn Stämme verschwinden aus der Geschichte. 2. Könige 17 hält lange fest, warum – es ist das ausführlichste Urteil des Buches.' },
    en: { title: 'The fall of the northern kingdom', text: 'Samaria falls after a three-year siege; Assyria deports the upper class and settles foreigners in their place. Ten tribes disappear from history. 2 Kings 17 spends a long chapter on why – the book’s most extended verdict.' },
    ref: { osis: '2Kgs', chapter: 17, label: '2. Könige 17' }, places: ['Samaria', 'Assyria', 'Nineveh'],
  },
  {
    id: 'josiah', era: 'divided', date: '622 v. Chr.',
    de: { title: 'Josias Reform', text: 'Beim Ausbessern des Tempels findet man ein Buch, das niemand mehr kannte. Der König lässt es sich vorlesen und zerreißt seine Kleider – dann räumt er das Land aus. Die letzte Umkehr vor dem Ende, und sie hält nur, solange er lebt.' },
    en: { title: 'Josiah’s reform', text: 'While repairing the temple they find a book nobody remembered. The king has it read aloud and tears his clothes – then clears out the whole country. The last turning before the end, and it holds only as long as he lives.' },
    ref: { osis: '2Kgs', chapter: 22, label: '2. Könige 22–23' }, places: ['Jerusalem'],
  },
  {
    id: 'exile', era: 'exile', date: '586 v. Chr.',
    de: { title: 'Babylonisches Exil', text: 'Achtzehn Monate Belagerung, dann Bresche, Brand, Tempel. Was verloren geht, ist nicht nur eine Stadt: Land, König und Haus Gottes waren die drei Zusagen. Alle drei sind weg – und trotzdem entsteht in diesen Jahren ein Großteil dessen, was wir heute lesen.' },
    en: { title: 'The Babylonian exile', text: 'Eighteen months of siege, then the breach, the fire, the temple. What is lost is not just a city: land, king and house of God were the three promises. All three are gone – and yet much of what we read today takes shape in these very years.' },
    ref: { osis: '2Kgs', chapter: 25, label: '2. Könige 25' }, places: ['Jerusalem', 'Babylon'],
  },
  {
    id: 'ezekiel', era: 'exile', date: '~593–570 v. Chr.',
    de: { title: 'Hesekiel: Gott zieht mit', text: 'Am Kanal Kebar sieht ein deportierter Priester einen Thron auf Rädern – ein Bild dafür, dass Gott nicht an den zerstörten Tempel gebunden ist. Später ein Tal voller trockener Knochen und die Frage: Können diese Gebeine wieder lebendig werden?' },
    en: { title: 'Ezekiel: God goes with them', text: 'By the Chebar canal a deported priest sees a throne on wheels – an image for a God not tied to the ruined temple. Later, a valley full of dry bones and the question: can these bones live again?' },
    ref: { osis: 'Ezek', chapter: 1, label: 'Hesekiel 1; 37' }, places: ['Babylon'],
  },
  {
    id: 'return', era: 'return', date: '538–445 v. Chr.',
    de: { title: 'Rückkehr & Wiederaufbau', text: 'Drei Aufbrüche über fast hundert Jahre: die Heimkehrer mit dem Tempelgerät, Esra mit der Schriftrolle, Nehemia mit einem Bauplan. Der zweite Tempel ist kleiner, die Mauer steht nach zweiundfünfzig Tagen – und beim Vorlesen des Gesetzes weint das ganze Volk.' },
    en: { title: 'Return & rebuilding', text: 'Three departures across nearly a century: the returnees with the temple vessels, Ezra with the scroll, Nehemiah with a building plan. The second temple is smaller, the wall stands after fifty-two days – and as the law is read aloud, the whole people weeps.' },
    ref: { osis: 'Ezra', chapter: 1, label: 'Esra 1–8; Nehemia 2–8' }, places: ['Jerusalem', 'Babylon', 'Susa'],
  },
  {
    id: 'silence', era: 'return', date: '~400–5 v. Chr.',
    de: { title: 'Vierhundert stille Jahre', text: 'Zwischen dem letzten Propheten und dem ersten Evangelium liegen rund vierhundert Jahre, aus denen die Bibel nichts erzählt. Still waren sie nicht: Alexander, die Ptolemäer, die Seleukiden, der Makkabäeraufstand, dann Rom. Als Lukas einsetzt, ist Judäa besetztes Gebiet.' },
    en: { title: 'Four hundred silent years', text: 'Between the last prophet and the first Gospel lie some four hundred years the Bible says nothing about. Silent they were not: Alexander, the Ptolemies, the Seleucids, the Maccabean revolt, then Rome. By the time Luke begins, Judea is occupied territory.' },
    ref: { osis: 'Mal', chapter: 3, label: 'Maleachi 3; dann Matthäus 1' }, places: ['Jerusalem'],
  },
  {
    id: 'jesus-birth', era: 'gospels', date: '~5 v. Chr.',
    de: { title: 'Geburt Jesu', text: 'Eine Verwaltungsmaßnahme aus Rom bringt eine hochschwangere Frau 150 Kilometer weit nach Bethlehem. Kein Raum, eine Futterkrippe – und die erste Nachricht geht an Hirten, die nach damaligem Recht nicht einmal als Zeugen taugten.' },
    en: { title: 'The birth of Jesus', text: 'An administrative measure out of Rome brings a heavily pregnant woman 150 kilometres to Bethlehem. No room, a feeding trough – and the first announcement goes to shepherds, who by the law of the day did not even count as witnesses.' },
    ref: { osis: 'Luke', chapter: 2, label: 'Lukas 2; Matthäus 1–2' }, places: ['Bethlehem', 'Nazareth', 'Galilee'],
  },
  {
    id: 'baptist', era: 'gospels', date: '~28 n. Chr.',
    de: { title: 'Johannes der Täufer', text: 'Nach vierhundert Jahren wieder ein Prophet, und er sieht auch so aus: Kamelhaar, Wüste, Heuschrecken. Er tauft Juden, als wären sie Heiden – ein Skandal – und stellt sich am Jordan hinter den, der nach ihm kommt. Dort beginnt alles Weitere.' },
    en: { title: 'John the Baptist', text: 'After four hundred years a prophet again, and he looks the part: camel hair, wilderness, locusts. He baptises Jews as though they were gentiles – a scandal – and at the Jordan steps behind the one who comes after him. Everything else begins there.' },
    ref: { osis: 'Mark', chapter: 1, label: 'Markus 1,1–11' }, places: ['Jordan', 'Judea'],
  },
  {
    id: 'ministry', era: 'gospels', date: '~28–30 n. Chr.',
    de: { title: 'Wirken Jesu', text: 'Fast alles spielt im Umkreis von dreißig Kilometern um einen See, in Dörfern, die keine Landkarte nannte. Er lehrt in Bildern, die niemand vergisst, isst mit den Falschen und beantwortet Fragen meistens mit einer Gegenfrage.' },
    en: { title: 'The ministry of Jesus', text: 'Almost all of it happens within thirty kilometres of one lake, in villages no map bothered to name. He teaches in pictures nobody forgets, eats with the wrong people, and mostly answers questions with a question.' },
    ref: { osis: 'Matt', chapter: 4, label: 'Matthäus 4–9' }, places: ['Sea of Galilee', 'Capernaum', 'Nazareth'], video: '3Dv4-n6OYGI',
  },
  {
    id: 'cross', era: 'gospels', date: '~30 n. Chr.',
    de: { title: 'Kreuzigung & Auferstehung', text: 'Hingerichtet wird außerhalb der Mauer, an einer Straße, damit möglichst viele es sehen. Am dritten Tag ein leeres Grab – und die ersten Zeuginnen sind Frauen, deren Aussage vor Gericht damals nichts galt. Genau das spricht dafür, dass niemand die Geschichte erfunden hat.' },
    en: { title: 'Crucifixion & resurrection', text: 'Executions happen outside the wall, beside a road, so that as many as possible will see. On the third day an empty tomb – and the first witnesses are women, whose testimony carried no weight in court. Which is precisely why nobody would have invented it this way.' },
    ref: { osis: 'Luke', chapter: 23, label: 'Lukas 23–24' }, places: ['Jerusalem'],
  },
  {
    id: 'church', era: 'church', date: '~30 n. Chr.',
    de: { title: 'Pfingsten & frühe Kirche', text: 'Fünfzig Tage nach dem Passa hören Pilger aus fünfzehn Ländern jeder die eigene Sprache – Babel rückwärts. Aus einer verängstigten Gruppe wird an einem Tag eine Bewegung, die alles teilt, was sie hat.' },
    en: { title: 'Pentecost & the early church', text: 'Fifty days after Passover, pilgrims from fifteen countries each hear their own language – Babel in reverse. In a single day a frightened group becomes a movement that shares everything it owns.' },
    ref: { osis: 'Acts', chapter: 2, label: 'Apostelgeschichte 2' }, places: ['Jerusalem', 'Antioch', 'Damascus'], video: 'CGbNw855ksw',
  },
  {
    id: 'council', era: 'church', date: '~49 n. Chr.',
    de: { title: 'Das Apostelkonzil', text: 'Die härteste Frage der jungen Kirche: Müssen Heiden erst Juden werden? Die Entscheidung in Jerusalem lautet nein – und macht aus einer jüdischen Erneuerungsbewegung eine Weltreligion. Ohne diesen Satz gäbe es die Missionsreisen nicht.' },
    en: { title: 'The council of Jerusalem', text: 'The hardest question the young church faced: must gentiles become Jews first? The decision in Jerusalem is no – and it turns a Jewish renewal movement into a world religion. Without that ruling there are no missionary journeys.' },
    ref: { osis: 'Acts', chapter: 15, label: 'Apostelgeschichte 15' }, places: ['Jerusalem', 'Antioch'],
  },
  {
    id: 'paul', era: 'church', date: '~47–60 n. Chr.',
    de: { title: 'Paulus’ Missionsreisen', text: 'Ein Mann, der die Bewegung ausrotten wollte, trägt sie über 20.000 Kilometer nach Westen. Er gründet Gemeinden in Hafenstädten entlang römischer Straßen, schreibt ihnen Briefe hinterher – und diese Briefe stehen heute vor den Evangelien im Kanon der Zeit.' },
    en: { title: 'Paul’s missionary journeys', text: 'A man who set out to destroy the movement carries it 20,000 kilometres westward. He plants churches in port cities along Roman roads and writes them letters afterwards – letters that were written before any Gospel we have.' },
    ref: { osis: 'Acts', chapter: 13, label: 'Apostelgeschichte 13–28' }, places: ['Antioch', 'Ephesus', 'Corinth', 'Rome'], video: 'Z-17KxpjL0Q',
  },
  {
    id: 'new-creation', era: 'church', date: 'Vollendung',
    de: { title: 'Neue Schöpfung', text: 'Das letzte Bild der Bibel ist kein Aufstieg in den Himmel, sondern das Gegenteil: eine Stadt kommt herunter. Der Garten vom Anfang ist darin aufgehoben – Fluss, Baum des Lebens, und kein Tempel mehr, weil kein Abstand mehr da ist.' },
    en: { title: 'The new creation', text: 'The Bible’s last image is not an ascent into heaven but the reverse: a city comes down. The garden of the opening is taken up into it – a river, the tree of life, and no temple any more, because there is no distance left.' },
    ref: { osis: 'Rev', chapter: 21, label: 'Offenbarung 21–22' }, places: ['Jerusalem'], video: '5nvVVcYD-0w',
  },
];
