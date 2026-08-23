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
  Stelle im jeweiligen Modus. Wer eine **Bibelstelle** eintippt (`Apg 13`,
  `Mk 6,30`, `1. Mose 12`, `Acts 27`), bekommt die Orte dieses Kapitels und
  einen Weg direkt in den Bibeltext.
- **Nachbarorte** – jede Ortskarte zeigt, was von dort aus **an einem Tag zu
  Fuß** zu erreichen war: bis 25 km Luftlinie, mit Entfernung und
  Himmelsrichtung (von Jerusalem: Bethlehem 8 km S, Gibeon 9 km NW, Jericho
  23 km NO). Ein Klick wechselt zum Nachbarn.
- **Marker-Popups** mit Bild und weiterführenden Links direkt auf der Karte;
  robuste Bild-Fallback-Kette (OpenBible → Wikidata/Commons → Platzhalter).
- **Kartenmaterial umschaltbar** – helle Karte (CARTO), **Satellit** (Esri World
  Imagery) und **Relief/„historisch"** (Esri Shaded Relief).

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
  Abraham von Ur nach Kanaan, Jakobs Flucht, Josef nach Ägypten, der Auszug und
  die vierzig Jahre Wüste, die Landnahme, David auf der Flucht, Elia zum Horeb,
  Jona in die falsche Richtung, das Exil und die Rückkehr, die Flucht nach
  Ägypten, Jesu Wege in Galiläa und der Weg nach Jerusalem. **Abspielen** lässt
  die Route mitwachsen und einen Punkt die Etappen abgehen, während links die
  Station mit Bibelstelle und kurzem Text mitläuft (← / → blättern, Leertaste
  startet). Jede Station verlinkt auf ihre Ortskarte.
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

### Lernen & weitergeben

- **Bibelquiz** – ein Lernmodus: „Wo liegt Kapernaum?" Der Klick auf eine
  **unbeschriftete** Karte ist die Antwort, die Entfernung gibt die Punkte
  (bis 25 km Volltreffer). Drei Stufen nach Bekanntheit der Orte – ab 50, ab 15
  oder ab 3 Erwähnungen. Dazwischen **Wissensfragen** aus den Reisen und der
  Ausbreitung („Zu welcher Reise gehört diese Station?", „In welche Zeit gehört
  das?"), die nach der Antwort die Stelle auf der Karte zeigen; abschaltbar.
- **Handout drucken** – jede Reise lässt sich als Blatt ausgeben: Titel, Epoche,
  Bibelstelle, Gesamtstrecke und alle Stationen mit Stelle, Text und Entfernung
  – ohne Karte, Knöpfe und dunklen Hintergrund. Für den Hauskreis, der lieber
  Papier in der Hand hat.
- **Teilen & Deep-Links** – jede Ansicht hat eine Adresse: `#ort=a15257a`
  (Jerusalem auf der Karte), `#reise=exodus,5` (Reise samt Station),
  `#mission=modern`, `#lesen=Acts,13`, `#stammbaum`, `#hoeren=keller`
  (Folgen einer Quelle), `#hoeren=ort,a15257a` (Folgen zu einem Ort) und
  `#hoeren=stelle,Mark,6` (Folgen zu einem Kapitel), `#kirche=vater,augustinus`
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

- **Offline & installierbar** – die App meldet einen Service Worker an: Einstieg,
  Programmdateien, die Ortsdaten **und der Medien-Index** liegen nach dem ersten
  Besuch im Cache, einmal angesehene Kartenkacheln ebenso. Ohne Netz startet
  Bibelmap weiter, zeigt alle 1.335 Orte, alle 473 Folgen und die bereits
  besuchten Kartenausschnitte. Die Folgen selbst liegen bei ihren Anbietern –
  abspielen lässt sich ohne Netz nichts. Über das
  Browser-Menü lässt sie sich als App installieren (Manifest + Symbole).
- **Zweisprachig** – Oberfläche, Buchnamen **und Ortsnamen** auf Deutsch/Englisch.
  Ohne eigene Wahl entscheidet die Browsersprache; wer einmal umschaltet, bekommt
  seine Sprache beim nächsten Besuch wieder.
- **Tastatur** – Marker lassen sich mit Tabulator ansteuern und mit Enter oder
  Leertaste öffnen (Cluster zoomen hinein); Escape schließt von außen nach innen.
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

## Entwicklung

```bash
npm install
npm run dev        # Vite Dev-Server
npm run build      # Typecheck + Production-Build
npm run preview    # Build lokal anschauen
```

### Deployment (GitHub Pages)

Ein Workflow (`.github/workflows/deploy.yml`) baut und deployt automatisch bei jedem
Push auf den Default-Branch. **Einmalig** in den Repo-Einstellungen aktivieren:
*Settings → Pages → Source: GitHub Actions*. Der Build setzt `VITE_BASE=/bibelmap/`
für das Project-Pages-Unterverzeichnis; lokal bleibt die Basis `/`.

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

`scripts/a11y-audit.mjs` geht mit einem Browser durch alle zwölf Ansichten und
meldet, was keinen Namen hat – Icon-Knöpfe, Regler, Grafiken. Braucht Playwright
(`npm i -D playwright`), läuft gegen den Dev-Server:

```bash
npm run dev
node scripts/a11y-audit.mjs
```

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
CARTO/OpenStreetMap-Kartenkacheln.

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
- Kartenkacheln: © OpenStreetMap-Mitwirkende, © CARTO; „Antike Welt“
  © [DARE / Imperium](https://imperium.ahlfeldt.se/) (Univ. Göteborg, CC-BY)
- Bilder: Wikimedia Commons (Lizenz je Bild, siehe Bildnachweis)
- Podcasts & Videos: bibletunes.de, BibleProject, Practicing the Way, Gospel in
  Life – verlinkt, nicht gehostet

Die vollständige Liste mit Beitrag, Nennung und **Spendenlink** je Projekt steht in
`src/data/support.ts` und wird in der App unter *Projekte unterstützen* angezeigt.
Bibelmap selbst nimmt kein Geld ein und sammelt keines: keine Werbung, kein
Tracking, keine Bezahlschranke. Wer eine neue Quelle einbindet, trägt sie dort
ein – Beitrag, Lizenz-/Nennungshinweis und, wenn vorhanden, die Spendenseite.
