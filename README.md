# Bibelmap

Eine interaktive Karte biblischer Orte – mit **Zeitleiste**, **Suche**,
**Heatmap** und einem **Entdeckermodus**, der ein Bibelbuch Kapitel für
Kapitel durchläuft (links die Orte/Stellen, rechts die Karte).

> An interactive map of biblical places – with a timeline, search, heatmap and a
> explorer mode that walks through a book chapter by chapter.

Look & Feel sind an [bibleproject.com](https://bibleproject.com) angelehnt
(warme, editoriale Farbwelt, Serifen-Display-Font).

## Funktionen

### Karte & Orte

- **Karte & Marker** – ~1.335 kartierte Orte; Marker sind nach Epoche eingefärbt
  und nach Häufigkeit der Erwähnung größer. Klick öffnet eine Infokarte mit Bild,
  Bibelstellen, alternativen Schreibweisen und Quellen.
- **Zeitleiste** – filtert die Orte nach biblischer Epoche (Erzväter → Frühe Kirche).
  Mit **Bis hierhin** wird daraus ein Aufbau statt eines Filters: Die Karte zeigt
  alles bis einschließlich dieser Epoche, und was in ihr **neu** dazukommt, steht
  vorn – alles Ältere tritt kleiner und blasser zurück.
- **Heatmap** – die am häufigsten erwähnten Orte als Wärmebild.
- **Suche** – z. B. `Goschen`: zeigt *wo* (Karte) und *wann* (Epochen/Bücher) ein Ort
  vorkommt, inkl. aller Bibelstellen. Gesucht wird auch in den **Reisen und in
  der Ausbreitung**: `Emmaus` findet den Ort *und* die Station im Weg nach
  Jerusalem, `Azusa` das Ereignis von 1906 – ein Klick springt an die passende
  Stelle im jeweiligen Modus. Auch die **Stammesgebiete** sind darunter:
  `Sebulon` findet den Stamm, `Hebron` zusätzlich zum Ort die Antwort auf die
  Frage, in wessen Gebiet er liegt, und `Reichsteilung` die Karte von 930. Wer eine **Bibelstelle** eintippt (`Apg 13`,
  `Mk 6,30`, `1. Mose 12`, `Acts 27`), bekommt die Orte dieses Kapitels und
  einen Weg direkt in den Bibeltext.
- **Die Suche findet auch die Menschen** – nicht nur Orte, Reisen und
  Stammesgebiete: **Augustinus** führt auf seine Seite in der Kirchengeschichte,
  **Chalcedon** und **Nizäa** auf ihr Konzil, **Bonhoeffer** und **Hiskia** in
  den Zeitbaum, **Debora** und **Gideon** in ihr Stammesgebiet, **Der
  Sündenfall** auf seine Station der Heilsgeschichte. Vorher fand keines dieser
  Wörter etwas, obwohl die App zu jedem eine Seite hat. Zweite Schreibweisen
  gelten mit: „Nizäa" wie „Nicäa", „Ephesos" wie „Ephesus".
- **Nachbarorte** – jede Ortskarte zeigt, was von dort aus **an einem Tag zu
  Fuß** zu erreichen war: bis 25 km Luftlinie, mit Entfernung und
  Himmelsrichtung (von Jerusalem: Bethlehem 8 km S, Gibeon 9 km NW, Jericho
  23 km NO). Ein Klick wechselt zum Nachbarn.
- **In wessen Gebiet** – jede Ortskarte sagt, in welchem der zwölf
  Stammesgebiete der Ort liegt, und führt mit einem Klick dorthin: Hebron in
  Juda, Kapernaum in Naftali, Megiddo in Manasse. Wer außerhalb lag, bekommt
  keine Antwort statt einer geratenen – Tyrus und Sidon blieben phönizisch,
  Damaskus aramäisch.
- **Marker-Popups** mit Bild und weiterführenden Links direkt auf der Karte;
  robuste Bild-Fallback-Kette (OpenBible → Wikidata/Commons → Platzhalter).
- **Kartenmaterial umschaltbar** – **helle Karte** (OpenStreetMap; die Vorgabe),
  **Nachtkarte** (dieselbe Kachel, im Browser umgerechnet), **Satellit**
  (Sentinel-2 cloudless von EOX – ein wolkenfreies Mosaik aus einem Jahr
  Copernicus-Aufnahmen, 10 m je Bildpunkt) und **Relief/„historisch"**
  (Terrain Light von EOX). Beide stehen unter CC-BY 4.0; die früheren
  Esri-Kacheln verlangten außerhalb eines ArcGIS-Kontos einen Vertrag.
  Antwortet ein fremder Kachelserver nicht, weicht die Karte auf die Vorgabe
  aus und sagt, warum – statt eine leere Fläche zu zeigen. Kommt der stumme
  Server vom selben Rechner wie die Vorgabe, gibt es nichts, worauf man
  ausweichen könnte; dann bleibt es beim Hinweis. **Das sagt jetzt
  jede Karte**, nicht nur die erste: Reisen, Mission, Quiz, Kirchengeschichte,
  Vergleich, Heilsgeschichte, Eigener Weg, Entdeckermodus und die Stammeskarte.
  Vorher war der einzige Hinweis der der Hauptkarte – im Vollbild-Modus lag er
  hinter dem Vorhang, auf der Stammeskarte gab es ihn gar nicht: gemessen
  sagten **zwei von elf Ansichten** Bescheid, jetzt alle elf.

### Erzählen

- **Entdeckermodus** – ein Buch wählen (z. B. *2. Könige*) und chronologisch
  Kapitel für Kapitel durchgehen: links der **Bibeltext** (Luther 1912 / WEB) mit
  klickbaren Orts-Pins, rechts zoomt die Karte auf die erwähnten Orte
  (Tastatur ← / → blättert Kapitel). **BibleProject-Videos** sind eingebettet,
  wo vorhanden. Der Schalter **Beamer** legt den Text über die ganze Breite und
  vergrößert ihn zum Vortragen; die Einstellung bleibt gemerkt.
- **Heilsgeschichte-Modus** – geführte chronologische Reise von der Schöpfung bis
  zur neuen Welt (Schöpfung, Abraham, Exodus, Exil, Jesus, frühe Kirche …) mit
  Karte, Bibelstelle und Video je Station.
- **Reisen & Geschichten** – die großen Wege der Bibel als erzählte Reise:
  **Abraham und Sara** von Ur bis zum Grab in Machpela (17 Stationen, 3.494 km,
  140 Tagesmärsche – von der Berufung über Ägypten, den Zug bis Damaskus, die
  drei Gäste in Mamre und das Feilschen um Sodom bis zu dem einzigen Stück
  Land, das den beiden je gehört: einer Höhle), **Jakob vom erschlichenen Segen bis zum Grab der Väter** (14 Stationen:
  Linsengericht, Leiter, zwanzig Jahre bei Laban, der Kampf am Jabbok, Rahels
  Grab – und am Ende der Zug zurück aus Ägypten in die Höhle Machpela),
  **Josef: verkauft nach Ägypten** (12 Stationen von der Zisterne bei Dotan
  über Potifars Haus und den Hof des Pharao bis zu dem Sarg, der vierhundert
  Jahre auf den Auszug wartet und in Sichem begraben wird – dort, wo der Weg
  schiefging), **Mose vom Nil bis auf den Nebo** (hundertzwanzig Jahre
  in drei Vierzigern: vierzig am Hof, vierzig bei den Schafen, vierzig
  unterwegs – vom Schilfkästchen über den brennenden Busch und den Felsen von
  Kadesch bis zu dem Blick über ein Land, das er nicht betreten darf), **der
  Auszug** entlang der Stationenliste aus 4. Mose 33, und
  **die vierzig Jahre Wüste** (14 Stationen von den Lustgräbern über
  Mirjams Aussatz in Hazeroth, die zwölf Kundschafter, Mirjams Grab in der
  Wüste Zin und Aarons Tod auf dem Berg Hor bis nach Sittim, wo Bileam segnen
  muss, was er verfluchen soll), **die Landnahme** (14 Stationen von Rahabs Flachsstängeln über die
  Vorlesung des Gesetzes zwischen Ebal und Garizim bis zur Wahl in Sichem),
  **David von der Flucht auf den Thron** (15 Stationen: Michal lässt ihn durchs
  Fenster, vierhundert Verschuldete in der Höhle, zweimal verschont er den
  Mann, der ihn jagt – bis Hebron und Jerusalem), **Elia vom Karmel bis zum
  Wagen aus Feuer** (13 Stationen, vom Duell auf dem Karmel über den Ginster in
  Beerscheba und das stille sanfte Sausen am Horeb bis zum Mantel, der aufs
  Wasser schlägt),
  **Jona in die falsche Richtung** (die einzige Reise, die entgegengesetzt zum
  Auftrag beginnt: gut achthundert Kilometer nach Osten wären es gewesen),
  **das Exil** (9 Stationen: die letzten zwei Festungen Lachis und Aseka, deren
  erlöschende Feuerzeichen eine Tonscherbe von 1935 festhält, Zedekias Flucht
  bis in die Ebene von Jericho, der Mord an Gedalja – und am Ende die Wasser
  Babylons), **die Rückkehr** (8 Stationen über fast hundert Jahre: Kyrus'
  Erlass, der Grundstein, bei dem man Jubel und Weinen nicht unterscheiden
  kann, Esras vier Monate ohne Eskorte und Nehemias zweiundfünfzig Tage),
  **die Flucht nach Ägypten** (7 Stationen: Lukas und Matthäus nebeneinander
  auf einer Karte, vom Ja in Nazareth über die Turteltauben der Armen und die
  Sterndeuter, die in der falschen Stadt fragen, bis zu dem Zwölfjährigen, den
  die Eltern einen Tagesmarsch lang nicht vermissen), **Jesu Wege in Galiläa**
  (13 Stationen im Umkreis von dreißig Kilometern um einen See: Taufe, Kana,
  Nain, Kapernaum, der Sturm auf dem See, Magdala, Gennesaret, Betsaida – bis
  zur Frage in Cäsarea Philippi) und **der Weg nach Jerusalem** (13 Stationen,
  deren letzte sieben alle in Gehweite liegen: Betanien, Betfage, der Tempel,
  Gethsemane fünfhundert Meter vor der Stadt, Golgatha, Emmaus, Ölberg).
  **Abspielen** lässt
  die Route mitwachsen und einen Punkt die Etappen abgehen, während links die
  Station mit Bibelstelle und kurzem Text mitläuft (← / → blättern, Leertaste
  startet). Jede Station verlinkt auf ihre Ortskarte.
- **Jesus – Leben und Wege** – eine eigene Sektion für die Evangelien: **86
  Stationen in sieben Akten**, von der Ankündigung an Maria über die Geburt in
  Bethlehem, das Jahr am See, den Weg nach Jerusalem und die Passionswoche **Tag
  für Tag** (Palmsonntag → Grabesruhe) bis zu Emmaus, dem See Tiberias und dem
  Abschied am Ölberg. Jede Station nennt Ort, Bibelstelle (mit Parallelstellen),
  einen erzählenden Text und – wo sie hängen bleibt – die Stelle im Wortlaut.
  **52 Menschen der Evangelien** stehen in einem eigenen Verzeichnis: ein Klick
  auf *Simon Petrus* zeigt seine 24 Stationen vom Bootssteg bis zum Kohlenfeuer,
  ein Klick auf *Maria von Magdala* ihre Spur bis zum leeren Grab. Jede Station
  verlinkt den **BibleProject-Guide** ihres Evangeliums, und wo eine Folge von
  **The Chosen** die Szene spielt, steht sie daneben – als Verfilmung
  gekennzeichnet, mit der Bibelstelle direkt darüber. Adressen wie
  `#jesus=passion,golgotha` und `#jesus=mensch,petrus` sind teilbar.
- **Mission & Ausbreitung** – wie das Evangelium in die Welt kam: die vier
  Reisen des Paulus (plus die Wege vor ihm, Apg 1–11) als Route mit nummerierten
  Stationen und Bibelstellen – und danach die Ausbreitung bis heute, in sieben
  Phasen von der apostolischen Zeit über Armenien, Äthiopien und die Seidenstraße
  bis zu Pfingstbewegung, Bibelübersetzung und den Kirchen des globalen Südens.
  Bögen auf der Weltkarte zeigen, von wo nach wo; **Abspielen** läuft die ganze
  Geschichte ab – die Reisen als Bewegung entlang der Route, die Ausbreitung als
  **Zeitraffer**: ein Jahresregler von 30 bis heute, die Karte füllt sich mit
  jedem Jahrhundert, die Phase wechselt von selbst mit (Tastatur ← / →). Jede Reisestation nennt Entfernung
  und Tagesmärsche zur vorigen, ein Klick auf *Auf Karte* springt zur Ortskarte.
- **Kirchengeschichte-Modus** – **Kirchenväter** (westlich/lateinisch ·
  östlich/griechisch · orientalisch) und die **Konzilien** (Apostelkonzil + die
  7 ökumenischen) auf der Karte; jede Person und jedes Konzil hat eine eigene
  Adresse (`#kirche=vater,augustinus`, `#kirche=konzil,chalcedon`). Paulus’ Reisen stehen nicht hier, sondern in
  *Mission & Ausbreitung* – ein Link im Modus führt hinüber.
- **Israel: Land, Staat, Konflikt** – eine Karte im Stil einer
  Nachrichtensendung: unten eine Bauchbinde mit Jahr und Schlagzeile, darüber
  die **Gebietsstände**, die sich mit dem Zeitstrahl ablösen – Mandat,
  UN-Teilungsplan 1947, Waffenstillstandslinien 1949, nach 1967 mit Sinai,
  nach der Rückgabe 1982, Oslo mit den Zonen A/B/C, und heute. Die
  **Schraffur trägt die Aussage**: voll gefüllt ist Staatsgebiet, schräg
  schraffiert besetztes, gekreuzt einseitig einbezogenes, gestreift
  fremdverwaltetes, gepunktet zurückgegebenes, nur umrissen ein Plan, der nie
  in Kraft trat. Konflikte bekommen ein Einschlagzeichen an ihrem Ort.
  49 Ereignisse von der Landnahme bis zur Waffenruhe in Gaza im Oktober 2025 –
  die biblischen Kriege (Samaria 722, Sanherib 701, Jerusalem 586) neben den
  modernen (1948, 1956, 1967, 1973, 1982, die Gazakriege, 7. Oktober 2023,
  der Libanon 2024, die zwölf Tage mit Iran 2025).

  **Zu den Quellen.** Jedes Ereignis nennt mindestens eine – UN-Resolutionen im
  Wortlaut, Gutachten des Internationalen Gerichtshofs, Vertragstexte, UN OCHA,
  UNRWA, Yad Vashem, das British Museum für die Keilschriftzeugnisse, die
  Bundeszentrale für politische Bildung, Reuters und die Tagesschau für das
  Laufende. **Jede Zahl nennt die Stelle, die sie erhebt, und den Stand**, auf
  den sie sich bezieht; wo eine Zahl umstritten ist, steht das dabei. Der
  laufende Krieg ist in Bewegung, deshalb führt der Eintrag zusätzlich auf eine
  Stelle, die fortlaufend zählt, statt die Zahl hier zum letzten Wort zu machen.

  **Zur Benennung.** Wo zwei Namen im Gebrauch sind, stehen beide: 1948 heißt
  Unabhängigkeitskrieg *und* Nakba, 1967 Sechstagekrieg *und* Juni-Krieg. Wer
  nur einen der beiden Namen kennt, kennt nur eine der beiden Erinnerungen.
  Linien heißen, was sie juristisch sind – die Linie von 1949 ist eine
  Waffenstillstandslinie, keine Grenze, und das Abkommen sagt das selbst.
  „Besetzt" ist der Begriff des Völkerrechts, kein Urteil. Die Karte sagt, was
  wann geschah und wer es festhält – nicht, wer recht hat.

  **Der Untergrund ist wählbar.** Dieselben fünf Grundkarten wie auf der
  Hauptkarte – Karte, Nachtkarte, Satellit, Relief, Antike Welt –, auf dem
  Rechner in der Kopfzeile, auf dem Telefon in der Legende. Wer die
  Waffenstillstandslinie von 1949 im Gelände lesen will, legt sie aufs Relief;
  wer 63 v. Chr. sucht, auf die antike Welt.

- **Religionen im Vergleich** – gemeinsame Gestalten von Judentum, Christentum und
  Islam (Abraham, Mose, Jona, Maria, Jesus …) mit den Schriftstellen in Tanach,
  Bibel und Koran, aus jüdisch-christlich-biblischer Sicht; jede Gestalt hat
  eine eigene Adresse (`#vergleich=abraham`).
- **Zeitbaum** – ein aufklappbarer Stammbaum von **Adam & Eva bis Jesus Christus**
  (1. Mose 5/11, Rut 4, 1. Chronik, Matthäus 1) und darüber hinaus als
  Glaubenszeugen-Strang der **Kirchengeschichte** (Kirchenväter, Luther, Zwingli,
  Calvin, Spurgeon, Bonhoeffer …). Verlauf von links nach rechts mit einer
  **Zeitschiene** unten; Knoten lassen sich aufklappen und zeigen per Klick
  Lebensdaten, Bibelstellen und eine Kurzbeschreibung. Umschalter **Karte ↔ Zeitbaum**.
- **Das verteilte Land** – die Karte zum Stammbaum: die **zwölf Stämme Israels**
  als Gebiete statt als Punkte (Josua 13–21). Die Grenzen teilen sich ihre
  Eckpunkte, folgen der Küste, dem Jordan und dem Toten Meer und stoßen deshalb
  aneinander, statt sich zu überlappen. Die Stammesnamen stehen wie auf einer
  Atlasseite direkt im Gebiet – und treten von selbst zurück, wo das Gebiet auf
  dem Bildschirm gerade zu klein für den Namen ist. Links stehen die Zwölf nach
  **Müttern** geordnet (Lea, Rahel, Bilha, Silpa); ein Klick öffnet die Karte des
  Stammes mit Namensbedeutung, **Los**, **Jakobs Segen** (1. Mose 49) und
  **Mose-Segen** (5. Mose 33), den Orten im Gebiet und den **Nachbarstämmen** –
  jeder davon ein Sprung weiter – und **wer von hier kam**: Debora und Gideon,
  Jona aus Gat-Hefer in Sebulon, Elia aus Tischbe in Gilead, Hanna aus dem
  Stamm Asser, Paulus aus Benjamin. Wen der Zeitbaum führt, den öffnet ein
  Klick dort. Jeder Ortsname führt außerdem auf seine Ortskarte.
  Dazu die Sonderfälle, die eine reine Loskarte
  verschweigt: **Levi** bekommt kein Land, sondern die sechs **Zufluchtsstädte**,
  und **Dan** hält sein Los nicht, sondern zieht ans Nordende des Landes.
  Umschaltbar zwischen Nacht-, Relief- und Satellitenkarte; die Völkertafel und
  die Personen der Linie lassen sich darüberlegen.
- **Was aus ihnen wurde** – dieselbe Karte in sechs Bildern, denn die Loskarte
  zeigt einen einzigen Augenblick, und die Frage danach ist immer dieselbe: Was
  wurde aus den zwölf Stämmen? Die Gebiete bleiben, die Farbe wechselt.
  **um 1200** die Landnahme · **um 1150** was nach Richter 1 nie erobert wurde
  (die Kette quer durch die Jesreel-Ebene und die Küste entlang) · **930** die
  Reichsteilung, zehn Stämme gegen zwei, die Grenze quer durch Benjamin ·
  **732** Assur nimmt Galiläa, die Küste und Gilead, vom Nordreich bleibt der
  Kern um Samaria · **722** Samaria fällt, die zehn kehren nicht wieder ·
  **586** Juda fällt – und kommt als einziger zurück. Die Liste links sortiert
  die Stämme dann nicht mehr nach Müttern, sondern nach ihrem Ausgang, und ein
  Pfeil zeigt, wohin die Verschleppung ging.
- **Zeitdokumente zu einer Person** – die Personenkarte zeigt, was außerhalb der
  Bibel von diesem Menschen erhalten ist: das Sanherib-Prisma zu Hiskia
  („wie einen Vogel im Käfig"), die Tel-Dan-Stele zum „Haus Davids", die
  Rationentafeln Babylons für den gefangenen Jojachin, Tacitus und Josephus zu
  Jesus, die Gallio-Inschrift, an der die Chronologie des Paulus hängt, das
  Prozessprotokoll Justins, das Wormser Edikt gegen Luther, die Gestapo-Akte
  Bonhoeffers. Je Dokument: Art (Inschrift · Chronik · Akte · Brief · Papyrus …),
  Datierung, was dort über die Person steht, Fundort bzw. Museum, ein Bild und
  der Weg in den Artikel. **57 Personen, 115 Dokumente.**
  Zwei Dinge stehen ausdrücklich dabei, damit niemand mehr herausliest, als da
  steht: ob ein Dokument die Person **nennt** oder nur ihre Welt zeigt, und – wo
  es nichts gibt (Abraham, Mose, Salomo, Josef von Nazaret) – dass es nichts
  gibt. Bilder antiker Gestalten sind spätere Kunst; auch das steht an der Karte.

### Lernen & weitergeben

- **Bibelquiz** – ein Lernmodus: „Wo liegt Kapernaum?" Der Klick auf eine
  **unbeschriftete** Karte ist die Antwort, die Entfernung gibt die Punkte
  (bis 25 km Volltreffer). Drei Stufen nach Bekanntheit der Orte – ab 50, ab 15
  oder ab 3 Erwähnungen. Dazwischen **Wissensfragen** aus den Reisen und der
  Ausbreitung („Zu welcher Reise gehört diese Station?", „In welche Zeit gehört
  das?", **„Welcher dieser Orte lag auf dem Weg?"**), die nach der Antwort die
  Stelle auf der Karte zeigen; abschaltbar. Die Wegfrage kommt aus denselben
  Daten wie die Ortsliste an jeder Etappe – auch die falschen Antworten sind
  nicht erfunden, sondern echte Orte, die mindestens 60 km neben derselben
  Linie und über 100 km von beiden Stationen liegen: „Von Tal von Hebron nach
  Sichem – Jerusalem, Sepharvaim, Kyrene oder Elath?" Zur Auflösung steht
  dabei, wie weit der richtige Ort neben der Luftlinie liegt und dass die
  Luftlinie nicht der Weg ist.
- **Schriftgröße** – im Entdeckermodus lässt sich der Bibeltext stufenweise
  vergrößern (80 % bis 200 %), auch im Beamer-Modus; die Einstellung bleibt
  gemerkt. Fünf Meter vom Fernseher entfernt ist die Vorgabe zu klein, auf dem
  Telefon in der Hand manchmal zu groß.
- **Was lag am Weg?** – zu jeder Etappe die Orte, die neben der Verbindungslinie
  liegen. Von Jerusalem nach Jericho sind es 23 km – dazwischen liegen
  **Ölberg, Bethanien, Bahurim und Anathoth**; von Nazareth nach Kapernaum
  **Gat-Hefer** (Jonas Heimat) und der **Tabor**. Gerechnet wird gegen die
  Luftlinie, bis 8 km daneben – gut zwei Stunden abseits, noch „unterwegs".
  Und die Luftlinie ist nicht der Weg: wer nach Jericho ging, nahm die Straße
  durchs Wadi und nicht die Gerade. Das steht auch dabei. In den Reisen und im
  eigenen Weg, eingeklappt – die Etappenliste soll die Reise erzählen, nicht
  ein Ortsverzeichnis sein. Nicht bei Seewegen, und nicht in *Mission &
  Ausbreitung*: dort unterscheiden die Daten Schiffspassage und Landmarsch
  nicht, und Orte „am Weg" quer über das Mittelmeer wären erfunden.
- **Eigener Weg** – die erzählten Reisen stehen fest, weil die Bibel sie so
  erzählt. Was fehlte, war der umgekehrte Fall: die Wege, die im Text nicht als
  Weg stehen, aber im Hauskreis auf den Tisch kommen – die Orte eines Kapitels,
  die Städte der sieben Sendschreiben, die fünf Stationen für den Sonntag. In
  jeder Ortskarte fügt ein Knopf den Ort an; im Modus **Eigener Weg** (`#weg`)
  steht die Reihenfolge, lässt sich mit ↑ und ↓ ändern, und jede Etappe nennt
  Entfernung, Himmelsrichtung und Tagesmärsche. Der Weg lässt sich abspielen,
  als Blatt drucken und weitergeben: die Adresse trägt ihn mit
  (`#weg=a15257a,a112427,a231f80` – Jerusalem, Bethlehem, Jericho, 38 km).
  Gespeichert wird er sonst nirgends als im Browser dessen, der ihn baut.
  Verschieben geht mit Knöpfen statt mit der Maus – eine Liste, die sich nur
  ziehen lässt, ist mit der Tastatur nicht zu ordnen.
- **Ortsregister** – die eine Seite, die jeder gedruckte Bibelatlas hinten hat:
  alle **1.335 Orte** von A bis Z (`#register`). Je Zeile die Erwähnungen, die
  Epochen als Punkte und die **Spanne der Bücher** – „Abel-Beth-Maacha · 6 ·
  2. Samuel – 2. Chronik". Filterbar nach Epoche (die frühe Kirche bringt 135
  Orte) und nach Namensteil („beth" findet 65). Die Suche beantwortet „wo ist
  X?"; das Register beantwortet „welche Orte gibt es überhaupt?" – die Frage
  stellt jeder, der eine Stunde vorbereitet. Auf Papier zweispaltig, ohne
  Filterleiste, als Anhang.
- **Handout drucken** – jede Reise lässt sich als Blatt ausgeben: Titel, Epoche,
  Bibelstelle, Gesamtstrecke und alle Stationen mit Stelle, Text und Entfernung
  – ohne Karte, Knöpfe und dunklen Hintergrund. Für den Hauskreis, der lieber
  Papier in der Hand hat.
- **Teilen & Deep-Links** – jede Ansicht hat eine Adresse: `#ort=a15257a`
  (Jerusalem auf der Karte), `#reise=exodus,5` (Reise samt Station),
  `#mission=modern`, `#lesen=Acts,13`, `#stammbaum=gebiete,juda,722`
  (ein Stamm auf der Stammeskarte in einem bestimmten Jahr; `zeit` und `baum`
  sind die beiden anderen Reiter), `#nachweise`, `#israel=okt2023`, `#hoeren=keller`
  (Folgen einer Quelle), `#hoeren=ort,a15257a` (Folgen zu einem Ort) und
  `#hoeren=stelle,Mark,6` (Folgen zu einem Kapitel), `#gelaende=a15257a`
  (Jerusalem im Gelände), `#gelaende=reise,exodus` (der Auszug über dem
  Gelände), `#gelaende=mission,second` (die zweite Missionsreise), `#weg=a15257a,a112427`
  (ein selbst gebauter Weg), `#register` (das Ortsregister),
  `#heilsgeschichte=exodus` (eine Station der
  Heilsgeschichte), `#stammbaum=zeit,bonhoeffer` (ein Mensch im Zeitbaum),
  `#kirche=vater,augustinus`
  `#kirche=konzil,chalcedon` und `#vergleich=abraham`. Der Hash läuft beim
  Blättern mit, der Zurück-Knopf funktioniert, und ein **Link**-Knopf in der
  Ortskarte und in den Reise-Modi kopiert die aktuelle Adresse.
- **Hören & Sehen** – ein eigener Modus über alle **473 Folgen** der vier
  eingebundenen Quellen (bibletunes.de, BibleProject, John Mark Comer, Timothy
  Keller): filterbar nach **Quelle, Buch, Epoche** und Freitext – die Suche
  versteht dabei auch Ortsnamen, und zwei Reihenfolgen stehen zur Wahl:
  **Passgenau** (die genaue Stelle vor dem ganzen Buch) oder **Neueste** (nach
  Sendedatum). Unter jeder Folge stehen die Orte, die sie
  berührt; ein Klick darauf führt auf die Karte. Die Verknüpfung gilt in alle
  Richtungen: jede Ortskarte verlinkt mit *Alle Folgen zu diesem Ort* in den
  Modus (`#hoeren=ort,…`), der **Lesemodus** zeigt neben Kapitel und Text, wie
  viele Folgen genau diese Stelle behandeln (`#hoeren=stelle,Mark,6`), und von
  dort führt jede Bibelstelle wieder in den Text zurück.

### Drumherum

- **Modi-Tafel** – dreizehn Modi passen in kein Klappmenü. Als Liste unter dem
  Knopf war sie 940 Pixel hoch, und die letzten Einträge standen unter dem
  Bildrand. Sie liegt jetzt als Tafel in der Mitte: nach den drei Familien
  geordnet, in denen dieses README sie ohnehin beschreibt (Erzählen · Lernen &
  weitergeben · Über das Projekt), in Spalten statt in einer Säule, mit fester
  Höhe – gescrollt wird innen, nicht über den Rand hinaus. Dazu ein **Suchfeld**,
  das Titel *und* Beschreibung durchsucht (`Paulus` findet *Mission &
  Ausbreitung*), und volle Tastaturbedienung: tippen sucht, ↑ ↓ ← → wählt quer
  durch die Gruppen, Eingabe öffnet, Esc schließt – und zwar nur die Tafel,
  nicht den Modus darunter.

- **Der Graph mit der Tastatur** – das Netz aus Büchern, Orten, Personen und
  Stellen hob beim Tippen zwar den passenden Knoten hervor, öffnen ließ er sich
  aber nur mit der Maus: auf den Punkt klicken. Gemessen war „Jerusalem" tippen
  und Enter drücken folgenlos. Jetzt stehen die Treffer als **Liste unter dem
  Feld**, als richtige Knöpfe – drei Tabulatorschritte bis zum Suchfeld, tippen,
  Enter, und die Karte des Knotens steht offen. „Abraham" bringt die Person und
  die Stellen dazu. Die Leinwand trug außerdem keinen Namen; jetzt sagt sie,
  was sie zeigt und wo die Bedienung liegt.
- **Gelände in 3D** – eine vierte Ansicht neben Karte, Zeitbaum und Graph
  (`#gelaende`): dieselben Orte über echtem Höhengelände, kippbar und drehbar.
  **Jede Route lässt sich hineinlegen** – die Bibelreisen (`#gelaende=reise,exodus`)
  ebenso wie die Missionsreisen des Paulus (`#gelaende=mission,second`): die
  Route folgt dem Gelände, die Stationen sind anklickbar, und ein Knopf führt
  zurück zu Text, Stellen und Entfernungen. **Schräg ↔ von oben** lässt sich mit
  einem Knopf umschalten – auf dem Telefon geht Kippen sonst nur mit zwei
  Fingern, und das findet niemand von selbst. Zwei Pfeile führen **Station für
  Station** durch die Route; die Punkte selbst liegen in einer Leinwand und sind
  mit der Tastatur nicht erreichbar, die Pfeile schon. Die Karte beschriftet
  ihre eigenen Bedienelemente in der gewählten Sprache. Umgekehrt steht in beiden Modi ein
  **3D**-Knopf – dort sieht man, warum ein Weg über einen Pass führt und nicht
  geradeaus.
  Wer wissen will, warum ein Weg über einen Pass führt und nicht geradeaus,
  sieht es hier. Die **Überhöhung** ist einstellbar (1×–3×), die Kartenwahl gilt
  weiter und liegt als Tuch über dem Gelände. Bewusst weniger als die flache
  Karte: keine Ballung, keine Wärmekarte, keine Reichsgrenzen – das steht auch
  in der Ansicht. Höhen von den **Terrain Tiles** (AWS Open Data, aus SRTM u. a.),
  ohne Schlüssel und ohne Anmeldung.
- **Offline & installierbar** – die App meldet einen Service Worker an: Einstieg,
  Programmdateien, die Ortsdaten **und der Medien-Index** liegen nach dem ersten
  Besuch im Cache, einmal angesehene Kartenkacheln ebenso. Ohne Netz startet
  Bibelmap weiter, zeigt alle 1.335 Orte, alle 473 Folgen und die bereits
  besuchten Kartenausschnitte. Die Folgen selbst liegen bei ihren Anbietern –
  abspielen lässt sich ohne Netz nichts, und die Geländeansicht braucht ihre
  Höhenkacheln ebenfalls aus dem Netz. Über das
  Browser-Menü lässt sie sich als App installieren (Manifest + Symbole).
- **Zweisprachig** – Oberfläche, Buchnamen **und Ortsnamen** auf Deutsch/Englisch.
  Das galt für alles, was jemand bewusst übersetzt hat – und nicht für das, was
  nebenbei entstand: gemessen standen **28 deutsche Reste** in der englischen
  Oberfläche, der häufigste in **jeder** Ansicht mit Karte („· Orte:
  OpenBible.info", „· Routen: schematisch"). Jetzt sind es null.
  `scripts/check-i18n.mjs` hält es so. Was **nicht** übersetzt wird, ist das,
  was anderen gehört: eine deutsche Folge von bibletunes.de heißt auch in der
  englischen Oberfläche deutsch – sie trägt ein `lang="de"`, damit der
  Screenreader sie richtig ausspricht und die Prüfung sie in Ruhe lässt.
  Ohne eigene Wahl entscheidet die Browsersprache; wer einmal umschaltet, bekommt
  seine Sprache beim nächsten Besuch wieder.
- **Tastatur** – Marker lassen sich mit Tabulator ansteuern und mit Enter oder
  Leertaste öffnen (Cluster zoomen hinein); Escape schließt von außen nach innen.
- **Hinter dem Vorhang ist zu** – ein Vollbild-Modus deckt die Karte zu, aber
  sie blieb im Baum stehen: mit der Maus unerreichbar, mit der Tastatur nicht.
  Gemessen lagen in **jedem der elf Modi 117 der ersten 120 Tabulatorhalte
  dort** – auf Ortsmarken, Zeitleiste und Suchfeld, die niemand sieht. Der
  Hintergrund ist jetzt stillgelegt (`inert`), also aus Tabulatorreihe und
  Vorlesebaum genommen; Escape gibt ihn wieder frei. Im Modus bleibt darum auch
  keine Sprungmarke übrig – der erste Schlag führt direkt hinein.
- **Sprungmarken** – der erste Tabulatorschlag zeigt „Zur Navigation springen",
  „Zur Suche springen", „Zur Karte springen". Vorher lag die Kopfzeile im
  Quelltext hinter Zeitleiste, Markern und Ortsliste: gemessen das 205. von 208
  ansteuerbaren Elementen, **208 Tabulatorschritte**, bis sie den Fokus hatte –
  in „Hören & Sehen" das 303. Jetzt sind es in jeder Ansicht **zwei
  Tastendrücke**. Wer die Maus benutzt, sieht die Marken nie – sie werden erst
  sichtbar, wenn sie den Fokus haben.
- **Alles erreichbar** – die A11y-Prüfung geht jede Ansicht dreimal durch:
  einmal auf Namen, einmal auf 390 Pixeln daraufhin, ob ein Bedienelement aus
  dem Bild ragt, und einmal nur mit der Tastatur. Ein Knopf, der 116 Pixel
  rechts danebensteht, lässt sich nicht drücken – und genau das blieb in drei
  Vollbild-Modi lange unbemerkt.
- **Zweisprachig bis in die Bibliotheken** – Leaflet und MapLibre beschriften
  ihre eigenen Bedienelemente fest auf Englisch („Zoom in", „Close popup",
  „Map"). `src/lib/mapLocale.ts` setzt sie für alle sechs Leaflet-Karten aus
  derselben Sprachdatei wie den Rest; die Geländekarte bekommt sie beim Bauen
  mit. `scripts/a11y-audit.mjs` meldet fremdsprachige Namen als Befund – vorher
  fiel es nicht auf, weil ein Name ja **da** war. Die Liste der fremden Namen
  liest die Prüfung aus den Bibliotheken selbst (MapLibres Tabelle, Leaflets
  Vorgaben): bekommt eine neue Fassung ein Bedienelement dazu, kennt die
  Prüfung es beim nächsten Lauf, ohne dass jemand daran denkt.
- **Quellen** – Verlinkung zu OpenBible Atlas, Wikidata, Biblia Factbook,
  BibleGateway (Lutherbibel / ESV) und The Bible Project (Video).
- **Bildnachweis** – jedes Foto nennt **Urheber und Lizenz**, in der Ortskarte
  wie im Kartenfenster: der Name führt auf die Dateiseite bei Wikimedia Commons,
  die Lizenz auf ihren Text. Bilder, die erst zur Laufzeit über Wikidata
  gefunden werden, holen beides über die Commons-API nach – die Lizenzen
  verlangen die Nennung, ein „© Name" allein genügt ihnen nicht.
- **Startseite** – vier Wege hinein: Karte, Entdeckermodus, Stammbäume und
  Hören & Sehen, dazu die Kopfzeile mit denselben Zielen.
- **Projekte unterstützen** – eine eigene Seite (Startseite, Modi-Menü, Direktlink
  `#unterstuetzen`), die offenlegt, dass Bibelmap nichts verdient und für sich
  selbst kein Geld sammelt, und zu den **Spendenseiten** der Projekte verlinkt,
  aus deren Arbeit die Seite besteht – je Projekt mit Beitrag und Nennung.
- **Nachweise & Lizenzen** – die Rechtsseite zur Unterstützen-Seite (Modi-Menü,
  Fußzeile der Startseite, Direktlink `#nachweise`): **29 Quellen** in sechs
  Bereichen – Karte & Kacheln, Orte & Verweise, Bibeltext & Artikel, Bilder,
  Hören & Sehen, Software & Schriften. Je Quelle steht da, was davon in der App
  steckt, unter welcher **Lizenz** sie steht (verlinkt, mit dem, was die Lizenz
  verlangt) und – wo eine Lizenz eine bestimmte Zeile fordert – diese
  **Nachweiszeile im Wortlaut**. Material ohne freie Lizenz (YouTube, die
  Podcast-Feeds, die verlinkten Lesedienste) ist als solches gekennzeichnet und
  verlinkt auf die Bedingungen des Anbieters. Zum Schluss die Seite selbst: GPL-3.0, warum,
  und wohin ein falscher Nachweis gemeldet wird.

## Entwicklung

```bash
npm install
npm run dev        # Vite Dev-Server
npm run build      # Typecheck + Production-Build
npm run preview    # Build lokal anschauen
npm run check      # alle Prüfungen, die ohne Netz auskommen
```

`npm run check` bündelt die vier Prüfungen, die von sich aus immer dasselbe
Ergebnis liefern – Buchkürzel, Zeitdokumente, Stammesgrenzen, Farbkontraste –
und läuft in der CI **vor** dem Build: ein Tippfehler in `bookAliases.json` oder
eine Stammesgrenze, die einen biblisch benannten Ort verfehlt, hält die
Veröffentlichung auf, statt still mitzufahren.

Bewusst nicht dabei sind `npm run check:bp` und `npm run check:links`. Beide
fragen fremde Server; ein Anbieter mit Schluckauf darf keinen Deploy blockieren
und keinen falschen Befund erzeugen. Die laufen von Hand.

### Deployment (GitHub Pages)

Ein Workflow (`.github/workflows/deploy.yml`) baut und deployt automatisch bei jedem
Push auf den Default-Branch. **Einmalig** in den Repo-Einstellungen aktivieren:
*Settings → Pages → Source: GitHub Actions*.

Die Seite läuft unter der eigenen Domain **www.biblemap.ch** und damit an der
Wurzel, nicht in einem Unterverzeichnis. Der Build braucht deshalb kein
`VITE_BASE` mehr; die Umgebungsvariable bleibt in `vite.config.ts` nur als
Notausgang, falls die Seite einmal wieder unter einem Pfad liegt.

Die Domain steht **nicht** im Repo, sondern unter *Settings → Pages → Custom
domain*. Eine `CNAME`-Datei wäre hier wirkungslos: wer über einen eigenen
Actions-Workflow veröffentlicht, bei dem legt GitHub keine an und ignoriert eine
vorhandene ([Doku][gh-cname]). Wer die Domain sucht, sucht sie also in den
Einstellungen, nicht im Dateibaum.

[gh-cname]: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site

DNS-Einträge bei `biblemap.ch` (Swizzonic):

| Typ | Name | Wert |
| --- | --- | --- |
| CNAME | `www.biblemap.ch` | `michifrey.github.io.` |
| A | `biblemap.ch` | `185.199.108.153` |
| A | `biblemap.ch` | `185.199.109.153` |
| A | `biblemap.ch` | `185.199.110.153` |
| A | `biblemap.ch` | `185.199.111.153` |

**Kein `@` als Name.** Viele Anleitungen schreiben `@` für die Wurzel; das
Swizzonic-Panel führt Namen aber vollqualifiziert und legt daraus brav einen
Host namens `@.biblemap.ch` an, den nie jemand aufruft. Der Fehler ist still –
das Panel nimmt ihn an, und die Domain bleibt einfach tot.

Die vier A-Records auf die Wurzel sind nicht doppelt gemoppelt: GitHub leitet
`biblemap.ch` von dort auf `www.biblemap.ch` weiter, sonst liefe die nackte
Domain ins Leere. `bibelmap.ch` – die deutsche Schreibweise – leitet per
Weiterleitung des Registrars auf `https://www.biblemap.ch`; eine zweite Domain
kann GitHub Pages nicht selbst bedienen.

Die E-Mail-Einträge der Domain (MX, SPF-TXT, der SRV `_autodiscover` und die
CNAMEs `autoconfig`, `imap`, `pop`, `smtp`) haben mit der Seite nichts zu tun
und bleiben unangetastet.

In *Settings → Pages* **Enforce HTTPS** anhaken, sobald das Zertifikat
ausgestellt ist (dauert nach der DNS-Umstellung einige Minuten bis zu einer
Stunde).

## Daten

Die Ortsdaten stammen aus dem Projekt
[**OpenBible.info Bible Geocoding**](https://www.openbible.info/geo/)
([GitHub](https://github.com/openbibleinfo/Bible-Geocoding-Data)) und stehen unter
der **CC-BY 4.0**-Lizenz. Bilder kommen von **Wikimedia Commons** (jeweils mit
Bildnachweis und eigener freier Lizenz).

`public/data/places.json` wird aus dem Quelldatensatz erzeugt:

```bash
git clone --depth 1 https://github.com/openbibleinfo/Bible-Geocoding-Data /tmp/ob-data
OB_DATA=/tmp/ob-data npm run data
```

Das Skript (`scripts/build-data.mjs`) extrahiert pro Ort: Koordinaten, Namen +
Schreibvarianten, Bibelstellen (mit kanonischer Sortierung `BBCCCVVV`), ein
Wikimedia-Vorschaubild sowie Links zu Wikidata und Biblia.

**Bibeltext** (`public/data/text/<Buch>.json`) für den Entdeckermodus stammt aus
[seven1m/open-bibles](https://github.com/seven1m/open-bibles) – **Lutherbibel 1912**
(OSIS) und **World English Bible** (USFX), beide gemeinfrei:

```bash
git clone --depth 1 https://github.com/seven1m/open-bibles /tmp/open-bibles
OPEN_BIBLES=/tmp/open-bibles npm run text
```

**Ortsbilder:** Orte ohne OpenBible-Foto, die eine Wikidata-ID haben, laden ihr Bild
zur Laufzeit aus Wikidata (P18) → Wikimedia Commons nach (`src/lib/wikidataImage.ts`).

### Zeitdokumente, Bilder und Artikel zu Personen

`src/data/personSources.ts` sammelt zu den Personen des Zeitbaums, was außerhalb
der Bibel von ihnen erhalten ist. Pro Dokument stehen Art, Datierung, Aussage,
Aufbewahrungsort und ein Suchbegriff im Datensatz – **keine Bilder und keine
Artikeltexte**. Beides holt `src/lib/wikipediaArticle.ts` zur Laufzeit über die
MediaWiki-API (Einleitungsabsatz + Vorschaubild von Wikimedia Commons, gecacht
im `sessionStorage`). Das Repository bleibt dadurch frei von Bilddateien und
Lizenzfragen; ohne Netz fällt die Karte still auf reinen Text zurück.

Zu jedem Bild holt die App auch **Urheber und Lizenz** von der Commons-Dateiseite
und zeigt beides an (`commonsFileCredit()` in `src/lib/imageCredit.ts` – dieselbe
Stelle, die schon die Ortsbilder nachweist) – fast alle diese Bilder verlangen
Namensnennung *und* Lizenznennung, ein „© Name" allein genügt nicht.

Der Suchbegriff wird zuerst als exakter Titel aufgelöst (mit Weiterleitungen)
und erst dann als Suche – ein leicht danebenliegender Begriff landet also
trotzdem im richtigen Artikel. Links gehen bewusst über die Wikipedia-Suche
(`/w/index.php?search=`), damit sie auch bei umbenannten Artikeln greifen.

```bash
npm run check:sources   # prüft alle Person-IDs gegen den Zeitbaum und zählt die Sammlung
```

Neue Einträge tragen die Regeln der Datei mit: `named: true` heißt, das Dokument
nennt die Person (oder ihr Haus) ausdrücklich; `named: false` heißt, es ist ein
Zeitdokument ihrer Welt. Wo es zu einer Person nichts gibt, sagt das eine
`noteDe`/`noteEn`-Zeile, statt die Lücke zu füllen.

### Deutsche Ortsnamen

Der OpenBible-Datensatz kennt nur englische Namen (`Egypt`, `Babylon 1`), die
deutsche Oberfläche zeigte sie deshalb unübersetzt an. Die deutschen Namen werden
aus Daten hergeleitet, die ohnehin im Projekt liegen – nicht von Hand gepflegt:

```bash
npm run names
```

Zu jedem Ort ist bekannt, in welchen Versen er vorkommt, und der vollständige
Luther-Text 1912 liegt bereits unter `public/data/text/`. Der deutsche Name ist
das Wort, das in fast allen Versen eines Ortes steht und sonst kaum irgendwo –
gemessen als F1 aus Precision und Recall, abgesichert über die Ähnlichkeit zum
englischen Namen (`Damascus` → `Damaskus`, `Shechem` → `Sichem`). Übersetzte
Namen ohne Schreibähnlichkeit (`Red Sea` → `Schilfmeer`) müssen ihre Statistik
allein tragen.

Das deckt **1.015 der 1.335 Orte** ab. Was das Verfahren nicht sicher entscheiden
kann, landet in `data/names-de-review.json`; wer einen Fall klärt, trägt ihn in
`data/names-de-overrides.json` ein – Handeinträge gewinnen immer. Orte ohne
deutschen Namen zeigen weiter den englischen.

`scripts/build-data.mjs` mischt `data/names-de.json` beim Neubau wieder ein, ein
`npm run data` wirft die Namen also nicht weg.

### Podcasts & Videos zu Orten

Der Modus **Hören & Sehen** stöbert durch alle Folgen, jede Ortskarte zeigt die
zu ihrem Ort. Gemeinsame Grundlage ist ein Index, der Bibelstellen aus den
Folgentiteln in Orte auflöst:

```bash
npm run media            # baut aus data/media/raw/*.xml
npm run media -- --fetch # holt die Feeds vorher
npm run media -- --dry   # nur Bericht, schreibt nichts
```

Die Zuordnung braucht keine Handarbeit: `scripts/build-media.mjs` liest die
Bibelstelle aus dem Folgentitel (`scripts/lib/bibleref.mjs` versteht deutsche
und englische Notation - `Markus 6,30-44` wie `Mark 6:30-44`) und löst sie über
`places.json` in Orte auf. **Örtlich** über die Verse, **thematisch** über die
Epoche des Buches. Folgen ohne Bibelstelle im Titel - bei thematischen
Predigten häufig - fallen aus der Ortszuordnung heraus; das ist beabsichtigt.

Der Baubericht nennt je Quelle drei Zahlen: Einträge, davon mit Bibelstelle,
davon mit Sendedatum. Die dritte steht dort, weil sie einmal still auf 0 fiel –
der Feed von Practicing the Way schreibt die Zeitzone als `&#43;0000`, und
solange die Entities nicht aufgelöst wurden, war jedes dieser 229 Daten
unlesbar. BibleProject hat keine Sendedaten, das ist keine Panne, sondern die
Natur einer Übersichtsseite.

Feed-Adressen, die nicht von Hand geprüft sind, stehen in
`data/media/sources.json` auf `null` – eine geratene URL erzeugt still einen
leeren Index. Steht stattdessen eine `appleId` da, löst `--fetch` die Adresse
über die iTunes-Lookup-API auf und meldet sie zum Eintragen. Ohne Netzzugriff
genügt es, die RSS-XML von Hand nach `data/media/raw/<id>.xml` zu legen.

Quellen stehen in `data/media/sources.json`, die Feeds werden als XML unter
`data/media/raw/` zwischengespeichert, damit der Build offline und
reproduzierbar läuft. **BibleProject** braucht keinen Feed: je Buch eine
Übersichtsseite, deren URL sich aus dem Buchkürzel baut.

`public/data/media.json` wird erst geladen, wenn jemand eine Ortskarte oder den
Modus öffnet - der Index wächst mit jeder Staffel und gehört nicht in den
Startpfad. Der Modus dreht ihn beim Öffnen einmal um (`placesByEpisode`), denn
gespeichert ist nur die Richtung Ort → Folgen.

Was der Index nicht behauptet: dass eine genannte Stelle das Thema der Folge
ist. Eine Predigt, die Jerusalem im Vorbeigehen zitiert, steht damit unter
Jerusalem - der Hinweis darauf steht im Modus unter der Liste.

### Gelände in 3D (MapLibre)

Die flache Karte bleibt bei Leaflet; die Geländeansicht ist eine eigene
Komponente auf **MapLibre GL** (`src/components/TerrainMap.tsx`), die erst
geladen wird, wenn jemand sie öffnet – das Bündel wiegt rund 950 kB
(gzip 250 kB) und gehört nicht in den Startpfad.

Eine Eigenheit muss man kennen: MapLibre sucht seinen Worker **neben der
eigenen Datei** (`new URL('./maplibre-gl-worker.mjs', import.meta.url)`). Im
Bündel liegt die Bibliothek unter `assets/TerrainMap-<hash>.js`, und dorthin legt
der Build den Worker nicht – die Anfrage landet auf der `index.html`, der Worker
stirbt an einem `<`, und die Karte bleibt *still* stehen: Kacheln erscheinen,
aber kein Gelände und keine Ortspunkte, weil beides den Worker braucht. Kein
Fehler, keine Meldung.

Deshalb legt `scripts/sync-maplibre-worker.mjs` die zwei Dateien unverändert
nach `public/vendor/maplibre/` (als `predev` und `prebuild`, nicht im Git), und
`TerrainMap.tsx` sagt MapLibre per `setWorkerUrl`, wo sie liegen.

### Kurzformen der Bibelbücher

Die vollen Namen stehen in `src/data/books.ts`. Was sich daraus nicht ableiten
lässt – `1Mo`, `Klgl`, `Offb`, `Apg` –, steht in **`src/data/bookAliases.json`**,
und zwar nur dort: Suche (`src/lib/parseRef.ts`), Stammbaum-Referenzen
(`src/lib/bookAbbr.ts`) und der Medien-Build (`scripts/lib/bibleref.mjs`) lesen
alle dieselbe Datei.

Zwei Listen, weil die Lage entscheidet:

- **`text`** – im Fließtext eindeutig. `Ri 4` in einem Folgentitel meint Richter.
- **`typed`** – nur dort, wo jemand einen Buchnamen *eingibt* und sonst nichts
  danebensteht. `Am 3` ist im Suchfeld Amos, in einem Satz aber fast immer
  „am 3.". Dasselbe gilt für `Hi`, `Off` und `1Th`.

```bash
npm run check:aliases   # unbekanntes Buch, doppelte Kurzform, zu kurz, überflüssig
```

### Stammesgrenzen

Die dreizehn Ringe in `src/data/tribes.ts` sind von Hand gezeichnet, teilen sich
ihre Eckpunkte und beantworten auf jeder Ortskarte die Frage „in wessen Gebiet
liegt dieser Ort?". Das ist eine Behauptung, keine Verzierung: Wer einen Ring
anfasst, verschiebt die Antwort mit, ohne es zu sehen.

```bash
npm run check:tribes    # 24 Orte, deren Stamm im Text steht
```

Geprüft werden Orte, die Josua selbst zuordnet (Jerusalem → Benjamin, Megiddo →
Manasse, Bet-Schean → Issachar), dazu vier, die zu **keinem** Stamm gehörten:
Tyrus und Sidon blieben phönizisch, Damaskus aramäisch, Sela edomitisch. Ein
Ring, der die vier verschluckt, ist zu großzügig gezeichnet.

Genau daran hingen beim Einbau sechs Fehler: Jerusalem lag auf der falschen
Seite der Grenze, Megiddo in Issachar statt Manasse, Kapernaum und Laisch
außerhalb jedes Gebiets, Jafo genau auf einem Eckpunkt – und Tyrus mitten in
Asser.

### Israel-Karte: Belege

`src/data/israel.ts` behauptet über sich, dass jedes Ereignis eine Quelle nennt
und jede Zahl die Stelle, die sie erhebt, samt Stand. Eine Behauptung, die
niemand nachprüft, hält nicht lange:

```bash
npm run check:israel
```

Geprüft werden Belege (jede Quellenkennung existiert, jede Zahl hat Quelle
*und* Stand, und die Quelle einer Zahl steht auch in der Liste des Ereignisses,
damit sie anklickbar ist), die zeitliche Reihenfolge, die Gebietsstände (jeder
Verweis trifft einen, den es gibt; keiner bleibt ungezeigt), die Flächen
(mindestens drei Punkte, alle im Kartenausschnitt), die Abschnitte und die
Zweisprachigkeit – Umlaute im englischen Feld sind deutscher Text an der
falschen Stelle.

Beim Einbau fand die Prüfung zwei Stellen, an denen die Quelle einer Zahl nicht
in der Quellenliste ihres Ereignisses stand: sichtbar war sie, anklickbar nicht.

### BibleProject-Guides

Die Adresse eines Guides entsteht aus dem englischen Buchnamen
(`book-of-<name>`); die Bücher, die BibleProject zu einem Guide zusammenfasst –
Samuel, Könige, Chronik –, stehen als Ausnahme in `src/data/bpGuides.json`.

Ob die Regel für die übrigen 60 Bücher stimmt, weiß nur die Seite selbst:

```bash
npm run check:bp                      # klopft alle 63 Adressen ab
npm run check:bp -- --base http://…   # gegen einen anderen Ursprung
```

Ein `404` heißt: richtigen Slug heraussuchen und in `bpGuides.json` eintragen.
Ein `403`, `429` oder eine Zeitüberschreitung heißt gar nichts – solche
Antworten kommen von Filtern und Proxys, nicht von der Seite, und bleiben
deshalb **unentschieden**. Antwortet keine einzige Adresse, endet der Lauf mit
Code 2 und ohne Urteil.

### Spendenlinks der Unterstützen-Seite

`src/data/support.ts` verlinkt zu jedem Projekt die Startseite und, wo es eine
gibt, die Spendenseite. Ein toter Spendenlink ist die eine Sorte Fehler, die
diese Seite nicht haben darf – sie hat genau den Zweck, Geld zu den Projekten zu
leiten:

```bash
npm run check:links              # alle Adressen aus support.ts
npm run check:links -- --donate  # nur die Spendenseiten
```

Dieselben Regeln wie bei `check:bp`: nur `404`/`410` sind eine Aussage, alles
andere bleibt unentschieden, und ein vollständig geblockter Lauf endet mit Code
2 statt mit einem Fehlurteil. In der Agenten-Umgebung sind fast alle diese Hosts
gesperrt; wer Netzzugriff hat, klärt die Frage damit in einer Minute.

### Reisen & Geschichten

Die Stationen stehen in `src/data/journeys.ts`: je Station Name, Bibelstelle,
ein bis zwei Sätze Erzählung und – wo vorhanden – die `placeId` aus
`public/data/places.json`, also dieselben Koordinaten wie auf der Hauptkarte.
Die Farbe einer Route kommt aus der Epoche (`src/data/eras.ts`).

Die Reihenfolge folgt dem biblischen Bericht, nicht einer Rekonstruktion der
tatsächlichen Marschrouten; einige Orte sind nicht sicher lokalisiert (Sinai,
Kadesch, Emmaus). Die Animation (`src/components/RouteMap.tsx`) läuft
imperativ über `requestAnimationFrame` und fasst nur die Leaflet-Ebenen an –
React rendert währenddessen nicht mit.

### Jesus – Leben und Wege

Die Stationen stehen in `src/data/gospel.ts`: Akte, Stationen und das
Personenverzeichnis in einer Datei, alles zweisprachig. Die Koordinaten kommen
über `placeId` aus demselben OpenBible-Datensatz wie die Hauptkarte.

Grundsätze der Daten: Erzählt wird, was die Evangelien berichten, in ihrer
Reihenfolge – weicht Johannes von den anderen ab (die Tempelreinigung am Anfang
statt am Ende), steht die Station dort, wo sein Evangelium sie erzählt, und der
Text sagt es. Nicht sicher lokalisierte Orte (die Wüste der Versuchung, der Berg
der Verklärung, Emmaus, Machärus) tragen die verbreitete Zuordnung und sagen
dazu, dass es eine ist.

`npm run check:gospel` prüft, was nachrechenbar ist: jede Ortskennung gegen
`places.json` (samt Abstand – mehr als 6 km und die Kennung meint einen anderen
Ort), jede Bibelstelle auf Lesbarkeit und darauf, dass ihr Buch zum
verlinkten Guide passt, jede Person einer Station gegen das Verzeichnis. Die
Prüfung läuft in `npm run check` mit.

**The Chosen** (`src/data/chosen.ts`): Die Zuordnung Folge → Station wurde nach
dem Inhalt der Folgen zusammengetragen, nicht von einer Schnittstelle geholt.
Solange `VERIFIED` dort `false` ist, weist die Oberfläche die Angaben als
unbestätigt aus. Verlinkt wird nur die Serienseite – für einzelne Folgen gibt es
keine Adresse, die sich verlässlich bilden ließe.

### Mission & Ausbreitung

Die Reisestationen stehen in `src/data/mission.ts` und folgen der
Apostelgeschichte; die Koordinaten kommen über `placeId` aus demselben
OpenBible-Datensatz wie die Hauptkarte, sodass jede Station auch als Ortskarte
zu öffnen ist.

Alles nach Apostelgeschichte 28 ist **Kirchengeschichte, keine Bibelstelle**:
Jahreszahlen sind gerundet, frühe Überlieferungen (Thomas in Indien, Markus in
Alexandria) sind als Überlieferung gekennzeichnet, und die Zahlen zur heutigen
Christenheit sind Größenordnungen – verschiedene Zählweisen kommen zu
unterschiedlichen Ergebnissen. Jedes Ereignis hat einen Nachschlage-Link in die
Wikipedia der jeweiligen Sprache.

### Epochen & Zeitleiste

Die Zuordnung von Büchern zu historischen Epochen (`src/data/books.ts`,
`src/data/eras.ts`) ist eine bewusste Vereinfachung, um der Zeitleiste eine
Struktur zu geben – kein Anspruch auf wissenschaftliche Datierung. Die Datums-
angaben folgen einer gängigen konservativen Chronologie.

### Barrierefreiheit prüfen

`scripts/a11y-audit.mjs` geht mit einem Browser durch alle vierzehn Ansichten,
dreimal:

1. **Namen** – was keinen hat (Icon-Knöpfe, Regler, Grafiken, **Leinwände**)
   und was einen englischen hat, den eine Bibliothek mitbringt. Leinwände
   standen lange nur im zweiten Blick auf fremdsprachige Namen; eine ganz ohne
   Namen fiel deshalb durch – genau so blieb die des Graphen jahrelang stumm.
2. **390 Pixel** – ragt ein Bedienelement seitlich aus dem Bild? Was in einem
   scrollbaren Streifen liegt, zählt nicht.
3. **Nur mit der Tastatur** – wie viele Tastendrücke liegen zwischen
   Seitenanfang und Kopfzeile, und setzt jede Sprungmarke den Fokus wirklich?
   Eine Marke, die man nimmt, zählt als ein Druck; mehr als sechs gelten als
   Befund. Zur Gegenprobe ohne Marken gemessen: 208 Schritte auf der Karte.
   Steht ein Vollbild-Modus offen, gilt die andere Frage: **kein Halt darf
   hinter dem Vorhang liegen**, und Escape muss den Weg zur Kopfzeile wieder
   freigeben.

Braucht Playwright (`npm i -D playwright`), läuft gegen den Dev-Server oder
gegen eine gebaute Vorschau:

```bash
npm run dev
node scripts/a11y-audit.mjs
```

### Zweisprachigkeit prüfen

### Erzeugte Quizfragen prüfen

Die Wissensfragen entstehen zur Laufzeit aus den Daten – niemand hat sie
geschrieben, niemand liest sie gegen. `npm run check:quiz` erzeugt 400 Runden
und rechnet jede Wegfrage nach: die richtige Antwort muss bis 8 km neben der
Luftlinie der Etappe liegen, jede falsche mindestens 60 km daneben und über
100 km von beiden Stationen entfernt.

Die Prüfung liest dafür den **echten Code**, keine Nachbildung:
`scripts/lib/ts-loader.mjs` erlaubt Node, `src/lib/quiz.ts` samt allem, was
daran hängt, zu importieren – Node 22 versteht TypeScript, es fehlten nur die
Dateiendungen, die Bundler weglassen dürfen.

**Zeitdokumente** und **Stammesgrenzen** lesen inzwischen ebenso. Bei den
Stammesgrenzen wog das doppelt: die Prüfung hatte `tribeAt()` ein zweites Mal
aufgeschrieben und verglich damit nur ihre eigene Fassung mit ihrer eigenen
Lesart. Jetzt fragt sie dieselbe Funktion, die auch die Ortskarte fragt.

Und jede Prüfung sagt, **wie viel** sie geprüft hat – 41 Datenfarben, 115
Zeitdokumente, 13 Gebiete, 400 Quizfragen. Wo das nicht geht, steht eine
Untergrenze: findet eine Prüfung weniger, erklärt sie sich selbst für kaputt,
statt Entwarnung zu geben. Das hat schon einmal still versagt, als eine
Konstante in eine JSON-Datei umzog.

Gegenprobe: den Korridor in `quiz.ts` von 8 auf 30 km geweitet – die Prüfung
meldet Verstöße und endet mit Exit 1. Zurückgestellt: Exit 0.

`scripts/check-i18n.mjs` schaltet die Oberfläche auf Englisch und geht alle
achtzehn Ansichten durch – Text wie Beschriftungen, die nur ein Screenreader
liest. Gesucht wird nach deutschen Funktionswörtern; was ein eigenes `lang`
trägt, bleibt außen vor.

```bash
npm run dev
node scripts/check-i18n.mjs                          # Englisch: darf nichts finden
node scripts/check-i18n.mjs http://localhost:4173 de # Gegenprobe: muss finden
```

Die Gegenprobe ist kein Beiwerk. Beim ersten Lauf meldete sie null Funde auf
der **deutschen** Oberfläche – die Prüfung hatte `<html lang="de">` für eine
fremdsprachige Insel gehalten und alles übersprungen. Eine Prüfung, die nie
etwas findet, sieht aus wie eine bestandene.

### Bewegung und Tastatur

Wer im System **weniger Bewegung** eingestellt hat, bekommt dieselben Inhalte
ohne die Fahrt dazwischen: Die Karte setzt ihren Ausschnitt, statt ihn
anzufliegen, der Reisende springt von Station zu Station, Pulsringe und
Übergänge stehen still.

**Escape** schließt, was gerade offen ist – von außen nach innen: erst der
Modus, dann die Nebenansicht, zuletzt die Ortskarte. In den Reisen blättern
← / →, die Leertaste startet und pausiert.

### Ladezeit

Die Ansichten (Präsentation, Reisen, Mission, Kirchengeschichte, Vergleich,
Quiz, Stammbaum, Graph) liegen in eigenen Dateien und werden erst geladen,
wenn sie geöffnet werden – ebenso der Suchindex über Reisen und Ausbreitung,
der an den großen Datendateien hängt. Das erste Bündel schrumpft damit von
855 kB auf 462 kB (gzip: 267 → 136 kB).

Sobald der Browser Ruhe hat **und** der Service Worker steht, werden die
Ansichten im Hintergrund nachgeholt. So bleibt der Start leicht und die App
trotzdem vollständig offline benutzbar.

### Offline

`public/sw.js` pflegt zwei Caches: die App samt Ortsdaten und – getrennt und auf
600 Einträge begrenzt – die Kartenkacheln. Weil Vite an jeden Dateinamen einen
Hash hängt, pflegt der Worker keine Liste, sondern liest die gebauten Dateien
beim Einbau aus `index.html` heraus. Seitenaufrufe gehen erst ans Netz und
fallen auf den gespeicherten Einstieg zurück, eigene Dateien kommen sofort aus
dem Cache und werden im Hintergrund erneuert.

Im Dev-Server wird nichts angemeldet – dort würde der Worker den Hot-Reload
aushebeln.

## Technik

Vite · React · TypeScript · Tailwind CSS · Leaflet (+ markercluster, heat) ·
OpenStreetMap-Kartenkacheln.

**Kacheln ohne Schlüssel.** Im August 2026 fing CARTO an, für seine Kachel-
server einen API-Schlüssel zu verlangen; über Nacht antwortete jede der sieben
Karten dieser App mit „API key required" und blieb leer. Der Grund, warum das
so weh tat, stand im eigenen Quelltext: dieselbe Adresse lag in fünf Dateien.
Sie steht jetzt an einer Stelle – `src/lib/basemaps.ts` –, und jede Karte holt
sie sich dort mit `addBasemap()`. Die nächste Quelle, die dichtmacht, ist eine
Zeile.

Gewählt sind ausschließlich **schlüsselfreie** Quellen. Für die helle Karte ist
das der Kachelserver der OpenStreetMap Foundation; er ist an deren
[Tile Usage Policy](https://operations.osmfoundation.org/policies/tiles/)
gebunden, die Projekte dieser Größenordnung erlaubt, aber schweren Verkehr
untersagt – wächst die Seite über ein Hobbyprojekt hinaus, gehört hier ein
eigener oder bezahlter Kachelserver hin.

Eine dunkle Rasterkarte ohne Schlüssel gibt es nicht mehr – CARTO, Stadia und
Esri verlangen alle einen. Die **Nachtkarte** ist deshalb dieselbe helle
Kachel, im Browser umgerechnet: `invert(1)` macht aus hellem Land dunkles,
`hue-rotate(185deg)` dreht die dabei verdrehten Farbtöne zurück, so dass Wasser
wieder blau ist und Wald wieder grün. Das ist ein Zugeständnis und sieht nicht
so gut aus wie eine gezeichnete Nachtkarte; es kostet dafür kein Konto.

**Schriften im Haus.** Montserrat und Fraunces werden nicht von Google Fonts
geladen, sondern liegen als variable Schriften (`woff2`, Teilmengen latin und
latin-ext) in `src/assets/fonts/`; die `@font-face`-Regeln stehen in
`src/index.css`, Vite baut die Dateien mit ein. Beim Besuch der Seite geht damit
kein Aufruf an einen dritten Server – ein Punkt, an dem sonst Besucherdaten
abfließen –, und offline sieht die App aus wie online. Kursive Schnitte gibt es
bewusst nicht: die eine kursive Stelle der App neigt der Browser selbst, statt
dafür 100 kB zu laden.

Die Dateien stammen aus `@fontsource-variable/montserrat` und
`@fontsource-variable/fraunces` (5.3.0). Zum Aktualisieren: beide Pakete
installieren, die vier `*-latin*-normal.woff2` aus `files/` nach
`src/assets/fonts/` kopieren, die `LICENSE` nach `public/fonts/`, Pakete wieder
entfernen. Der Lizenztext (SIL OFL 1.1) wird mit ausgeliefert und ist auf der
Seite *Nachweise & Lizenzen* verlinkt – die OFL verlangt, dass er die Dateien
begleitet.

## Lizenz

Bibelmap steht unter der **GNU General Public License v3.0** (siehe `LICENSE`).

Der Grund ist `public/data/borders.json`: die Datei ist aus
[aourednik/historical-basemaps](https://github.com/aourednik/historical-basemaps)
abgeleitet, das unter GPL-3.0 steht. Wer die Grenzebene aus dem Projekt
entfernt, ist an diese Wahl nicht mehr gebunden.

## Attribution

- Ortsdaten: © OpenBible.info, CC-BY 4.0
- Bibeltext: Lutherbibel 1912 & World English Bible (gemeinfrei), aufbereitet in
  [seven1m/open-bibles](https://github.com/seven1m/open-bibles) (MIT)
- Reichsgrenzen: [aourednik/historical-basemaps](https://github.com/aourednik/historical-basemaps) (GPL-3.0)
- Kartenkacheln: © OpenStreetMap-Mitwirkende (ODbL); Satellit
  © [Sentinel-2 cloudless 2020](https://s2maps.eu/) (EOX IT Services, modifizierte
  Copernicus-Sentinel-Daten 2020, CC-BY 4.0); Relief © [Terrain Light](https://maps.eox.at/)
  (EOX, CC-BY 4.0); „Antike Welt“
  © [DARE / Imperium](https://imperium.ahlfeldt.se/) (Univ. Göteborg, CC-BY)
- Bilder: Wikimedia Commons (Lizenz je Bild, siehe Bildnachweis)
- Podcasts & Videos: bibletunes.de, BibleProject, Practicing the Way, Gospel in
  Life – verlinkt, nicht gehostet

Das ist die Kurzfassung. Die **vollständige Liste** – jede Quelle mit Lizenz, mit
dem, was die Lizenz verlangt, und mit der geforderten Nachweiszeile im Wortlaut –
steht in `src/data/attribution.ts` und wird in der App unter *Nachweise &
Lizenzen* (`#nachweise`) angezeigt. Die Lizenznamen selbst kommen aus
`src/lib/imageCredit.ts`, damit „CC BY-SA 4.0" auf der Seite nicht anders heißt
als am Bild.

Daneben steht `src/data/support.ts` mit Beitrag, Nennung und **Spendenlink** je
Projekt, angezeigt unter *Projekte unterstützen*: dieselben Projekte, aber die
Frage nach dem Danken statt der nach dem Recht.
Bibelmap selbst nimmt kein Geld ein und sammelt keines: keine Werbung, kein
Tracking, keine Bezahlschranke. Wer eine neue Quelle einbindet, trägt sie in **beide** Dateien
ein – in `attribution.ts` Lizenz und Nachweiszeile, in `support.ts` Beitrag und,
wenn vorhanden, die Spendenseite.
