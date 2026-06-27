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
- **Zeitbaum** – ein aufklappbarer Stammbaum von **Adam & Eva bis Jesus Christus**
  (1. Mose 5/11, Rut 4, 1. Chronik, Matthäus 1) und darüber hinaus als
  Glaubenszeugen-Strang der **Kirchengeschichte** (Kirchenväter, Luther, Zwingli,
  Calvin, Spurgeon, Bonhoeffer …). Verlauf von links nach rechts mit einer
  **Zeitschiene** unten; Knoten lassen sich aufklappen und zeigen per Klick
  Lebensdaten, Bibelstellen und eine Kurzbeschreibung. Umschalter **Karte ↔ Zeitbaum**.
- **Suche** – z. B. `Goschen`: zeigt *wo* (Karte) und *wann* (Epochen/Bücher) ein Ort
  vorkommt, inkl. aller Bibelstellen.
- **Heatmap** – die am häufigsten erwähnten Orte als Wärmebild.
- **Präsentationsmodus** – ein Buch wählen (z. B. *2. Könige*) und chronologisch
  Kapitel für Kapitel durchgehen: links der **Bibeltext** (Luther 1912 / WEB) mit
  klickbaren Orts-Pins, rechts zoomt die Karte auf die erwähnten Orte
  (Tastatur ← / → blättert Kapitel).
- **Zweisprachig** – Oberfläche und Buchnamen auf Deutsch/Englisch.
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
