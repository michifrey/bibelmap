# Designstudie

Entwürfe für eine Modernisierung der Oberfläche. **Kein Anwendungscode** – nichts
hier wird gebaut oder deployt; die Dateien sind die Quelle einer Design-Leinwand.

## Inhalt

| Datei | Artboard |
| --- | --- |
| **Startseite** | |
| `Start.dc.html` | Landingpage, Desktop (1440 px) |
| `StartMobile.dc.html` | Landingpage, Mobil (390 px) |
| **App-Screens** | |
| `Main.dc.html` | Karte |
| `PlaceRadical.dc.html` | Ortskarte mit Kanonstreifen |
| `MobileMapRadical.dc.html` | Karte, Mobil |
| `PresentationRadical.dc.html` | Präsentationsmodus (2. Könige 5) |
| `GenealogyRadical.dc.html` | Stammbäume als gezeichneter Baum |
| **System** | |
| `FoundationsRadical.dc.html` | Farbe, Schrift, Form, Ornamente |
| `Review.dc.html` | Zehn Beobachtungen am bestehenden UI |
| **Archiv – erste, warme Studie** | |
| `MainWarm.dc.html`, `PlaceDetail.dc.html`, `Mobile.dc.html`, `Presentation.dc.html`, `Genealogy.dc.html`, `Foundations.dc.html`, `Artwork.dc.html` | überholt, aber aufgehoben |
| `DirectionDark.dc.html`, `DirectionEditorial.dc.html` | verworfene Gegenentwürfe |
| | |
| `canvas.json` | Seitenaufteilung und Position der Artboards |

## Grundlage

Farben und Epochenwerte sind unverändert aus `src/index.css` und
`src/data/eras.ts` übernommen. Alle Zahlen auf den Screens sind aus den echten
Daten gerechnet (`public/data/places.json`, `src/data/books.ts`), der Bibeltext
stammt aus `public/data/text/2Kgs.json` (Luther 1912).

Die gewählte Richtung folgt einer vom Auftraggeber gelieferten Vorlage: dunkle
Duotone-Teal-Bühne, **Montserrat** Black in Versalien mit ausgestrichener dritter
Zeile, harte Ecken ohne Radien, Gold für genau eine Aktion pro Bildschirm.
**Fraunces** bleibt – aber nur noch für den Bibeltext.

Die warme Papier-Variante der ersten Runde liegt unter „Archiv" weiter bei.

Bilder sind durchgehend gezeichnet (Inline-SVG) statt geladen; die Entwürfe
kommen ohne Netzwerkzugriff aus.

## Leinwand neu erzeugen

Die veröffentlichte Fassung entsteht aus diesen Dateien über die
`/design`-Skill; das erzeugte HTML (~2,4 MB, enthält den gebündelten Editor)
ist absichtlich nicht eingecheckt.
