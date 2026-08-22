# Designstudie

Entwürfe für eine Modernisierung der Oberfläche. **Kein Anwendungscode** – nichts
hier wird gebaut oder deployt; die Dateien sind die Quelle einer Design-Leinwand.

## Inhalt

| Datei | Artboard |
| --- | --- |
| `Main.dc.html` | Karte, Desktop (1440 × 900) |
| `PlaceDetail.dc.html` | Ortskarte mit Kanonstreifen |
| `Mobile.dc.html` | Karte, Mobil (390 × 844) |
| `Presentation.dc.html` | Präsentationsmodus (2. Könige 5) |
| `Genealogy.dc.html` | Stammbäume als gezeichneter Baum |
| `Foundations.dc.html` | Farbe, Typografie, Form, Bausteine |
| `Artwork.dc.html` | Bildsprache: Embleme, Marker, Sigel, Kartografie |
| `Review.dc.html` | Zehn Beobachtungen am bestehenden UI |
| `DirectionDark.dc.html` | Alternative B – dunkler Atlas |
| `DirectionEditorial.dc.html` | Alternative C – editorial |
| `canvas.json` | Seitenaufteilung und Position der Artboards |

## Grundlage

Farben und Epochenwerte sind unverändert aus `src/index.css` und
`src/data/eras.ts` übernommen. Alle Zahlen auf den Screens sind aus den echten
Daten gerechnet (`public/data/places.json`, `src/data/books.ts`), der Bibeltext
stammt aus `public/data/text/2Kgs.json` (Luther 1912).

Neu vorgeschlagen sind lediglich: eine hellere Trägerfläche (`paper`), eine
Haarlinien- und eine schwache Tintenfarbe, ein dunkler Grundton für die
Nachtvariante – und **Instrument Sans** anstelle von Inter für die Oberfläche.

Bilder sind durchgehend gezeichnet (Inline-SVG) statt geladen; die Entwürfe
kommen ohne Netzwerkzugriff aus.

## Leinwand neu erzeugen

Die veröffentlichte Fassung entsteht aus diesen Dateien über die
`/design`-Skill; das erzeugte HTML (~2,4 MB, enthält den gebündelten Editor)
ist absichtlich nicht eingecheckt.
