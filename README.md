# Bibelmap

Eine interaktive Karte biblischer Orte – mit **Zeitleiste**, **Suche**,
**Heatmap** und einem **Präsentationsmodus**, der ein Bibelbuch Kapitel für
Kapitel durchläuft (links die Orte/Stellen, rechts die Karte).

> An interactive map of biblical places – with a timeline, search, heatmap and a
> presentation mode that walks through a book chapter by chapter.

Look & Feel sind an [bibleproject.com](https://bibleproject.com) angelehnt
(warme, editoriale Farbwelt, Serifen-Display-Font).

## Funktionen

- **Karte & Marker** – ~1.335 kartierte Orte; Marker sind nach Epoche eingefärbt
  und nach Häufigkeit der Erwähnung größer. Klick öffnet eine Infokarte mit Bild,
  Bibelstellen, alternativen Schreibweisen und Quellen.
- **Zeitleiste** – filtert die Orte nach biblischer Epoche (Erzväter → Frühe Kirche).
- **Suche** – z. B. `Goschen`: zeigt *wo* (Karte) und *wann* (Epochen/Bücher) ein Ort
  vorkommt, inkl. aller Bibelstellen.
- **Heatmap** – die am häufigsten erwähnten Orte als Wärmebild.
- **Präsentationsmodus** – ein Buch wählen (z. B. *2. Könige*) und chronologisch
  Kapitel für Kapitel durchgehen: links der **Bibeltext** (Luther 1912 / WEB) mit
  klickbaren Orts-Pins, rechts zoomt die Karte auf die erwähnten Orte
  (Tastatur ← / → blättert Kapitel).
- **Stammbäume / Völkertafel** – die Abstammung der Völker und Stämme nach
  **1. Chronik 1–9** (mit Parallelen aus Genesis 5, 10, 11, 25, 36 und 4. Mose 26)
  als interaktiver, auf- und zuklappbarer Baum: von Adam über Noahs drei Söhne
  (Sem, Ham, Jafet) und die **Völkertafel** bis zu Abraham, Ismael, Ketura,
  Esau/Edom und den **zwölf Stämmen Israels** – jeweils mit ihren Sippen und
  namentlichen Nachkommen (u. a. Davids Haus und die Könige von Juda, Aarons
  Priesterlinie, Mose, Samuel und die Tempelsänger, Josua, das Haus Sauls,
  Gideon und Zelofhads Töchter). Stammväter der Völker sind – wo bekannt – dem
  historischen **Volk** und der **Region** zugeordnet, mit Bibelstelle; ein Klick
  auf *Auf Karte* springt zum passenden Ort, und eine Namenssuche klappt den
  betreffenden Zweig automatisch auf.
- **Mission & Ausbreitung** – wie das Evangelium in die Welt kam: die vier
  Reisen des Paulus (plus die Wege vor ihm, Apg 1–11) als Route mit nummerierten
  Stationen und Bibelstellen – und danach die Ausbreitung bis heute, in sieben
  Phasen von der apostolischen Zeit über Armenien, Äthiopien und die Seidenstraße
  bis zu Pfingstbewegung, Bibelübersetzung und den Kirchen des globalen Südens.
  Bögen auf der Weltkarte zeigen, von wo nach wo; **Abspielen** läuft die ganze
  Geschichte Station für Station ab (Tastatur ← / →). Ein Klick auf *Auf Karte*
  springt von einer Reisestation zur Ortskarte.
- **Zweisprachig** – Oberfläche, Buchnamen **und Ortsnamen** auf Deutsch/Englisch.
- **Quellen** – Verlinkung zu OpenBible Atlas, Wikidata, Biblia Factbook,
  BibleGateway (Lutherbibel / ESV) und The Bible Project (Video).

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

**Bibeltext** (`public/data/text/<Buch>.json`) für den Präsentationsmodus stammt aus
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

Jede Ortskarte zeigt unter **Hören & Sehen**, welche Podcast-Folgen und Videos
eine Bibelstelle behandeln, in der dieser Ort vorkommt:

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

Feed-Adressen, die nicht von Hand geprüft sind, stehen in
`data/media/sources.json` auf `null` – eine geratene URL erzeugt still einen
leeren Index. Steht stattdessen eine `appleId` da, löst `--fetch` die Adresse
über die iTunes-Lookup-API auf und meldet sie zum Eintragen. Ohne Netzzugriff
genügt es, die RSS-XML von Hand nach `data/media/raw/<id>.xml` zu legen.

Quellen stehen in `data/media/sources.json`, die Feeds werden als XML unter
`data/media/raw/` zwischengespeichert, damit der Build offline und
reproduzierbar läuft. **BibleProject** braucht keinen Feed: je Buch eine
Übersichtsseite, deren URL sich aus dem Buchkürzel baut.

`public/data/media.json` wird erst geladen, wenn jemand eine Ortskarte öffnet -
der Index wächst mit jeder Staffel und gehört nicht in den Startpfad.

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

## Technik

Vite · React · TypeScript · Tailwind CSS · Leaflet (+ markercluster, heat) ·
CARTO/OpenStreetMap-Kartenkacheln.

## Lizenzen / Attribution

- Ortsdaten: © OpenBible.info, CC-BY 4.0
- Kartenkacheln: © OpenStreetMap-Mitwirkende, © CARTO
- Bilder: Wikimedia Commons (Lizenz je Bild, siehe Bildnachweis)
