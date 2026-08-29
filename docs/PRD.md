# PRD – Bibelmap

**Produkt:** Bibelmap – interaktive Karte, Zeitleiste und Präsentationsmodus für biblische Orte
**Version:** 1.0 (Entwurf)
**Stand:** 2026-08-22
**Owner:** Michi Frey
**Status:** v0.4 implementiert · offene Punkte siehe 7 und 10

---

## 1. Vision & Zielbild

Bibelmap macht die **Geografie und Chronologie der Bibel erfahrbar**. Statt Orte
nur als Namen zu lesen, sieht man *wo* sie liegen, *wann* (in welcher Epoche und
welchem Buch) sie vorkommen und *wie oft*. Die App verbindet drei Sichten auf
denselben Datenbestand:

1. **Raum** – eine Karte mit Markern und Heatmap.
2. **Zeit** – eine Zeitleiste über die biblischen Epochen.
3. **Erzählung** – ein Präsentationsmodus, der ein Buch Kapitel für Kapitel
   durchläuft (links Text/Orte, rechts Karte).

**Designanspruch:** ruhig, editorial, vertrauenswürdig – angelehnt an das Look &
Feel von [bibleproject.com](https://bibleproject.com) (warme Farbwelt,
Serifen-Display-Font, viel Weißraum).

### Nicht-Ziele (v1)

- Keine eigene Bibelübersetzung / kein Theologie-Kommentar.
- Keine Nutzerkonten, kein Social-Layer, keine Beiträge von Nutzern.
- Kein Anspruch auf wissenschaftlich exakte Datierung – Epochen sind eine
  bewusste didaktische Vereinfachung.

---

## 2. Zielgruppen (Personas)

| Persona | Bedarf | Schlüssel-Feature |
|---|---|---|
| **Bibelleser:in** | „Wo liegt das, was ich gerade lese?" | Suche, Infokarte, Lese-Links |
| **Lehrende / Hauskreis-Leitung** | Geschichte visuell vermitteln | Präsentationsmodus, Heatmap |
| **Neugierige / Einsteiger** | spielerisch entdecken | Zeitleiste, Heatmap, Bilder |

---

## 3. Begriffe & Datengrundlage

- **Ort (Place):** ein biblischer Ort mit Koordinaten, Namen + Schreibvarianten,
  Bibelstellen, optional Bild und Quell-Links.
- **Erwähnung (Verse):** eine konkrete Bibelstelle (OSIS, lesbare Referenz,
  Buch, Kapitel, Vers, Sortierschlüssel `BBCCCVVV`).
- **Epoche (Era):** historischer Abschnitt der biblischen Erzählung; ein Buch ist
  genau einer Epoche zugeordnet.

**Quelle:** [OpenBible.info Bible Geocoding](https://github.com/openbibleinfo/Bible-Geocoding-Data)
(CC-BY 4.0). Bilder: Wikimedia Commons. Kartenkacheln: CARTO / OpenStreetMap.

**Ist-Datenstand (v0.1):** 1.335 Orte mit Koordinaten · 291 mit Foto ·
8.742 Vers-Erwähnungen · 50 von 66 Büchern mit kartierten Orten.

---

## 4. Funktionsumfang

Legende Priorität: **P0** = Muss (implementiert/geplant für GA) · **P1** = Soll ·
**P2** = Kann/Backlog. Status: ✅ implementiert · 🟡 teilweise · ⬜ offen.

### 4.1 Karte & Marker — P0 ✅

**Beschreibung:** Vollbild-Karte mit allen sichtbaren Orten als Marker, geclustert.

**Anforderungen**
- Marker werden nach **früheste Epoche** eingefärbt und nach **Erwähnungs­häufigkeit**
  skaliert.
- Marker clustern bei niedrigem Zoom; Cluster zeigen Anzahl.
- Klick auf Marker öffnet die **Infokarte** (4.5).
- Karten-Attribution (OSM, CARTO, OpenBible) ist sichtbar.

**Akzeptanzkriterien**
- [x] Alle gefilterten Orte werden gerendert, ohne spürbares Ruckeln (≤1.335 Marker).
- [x] Klick auf Marker selektiert den Ort und fliegt ihn an.
- [x] **Tastaturbedienung**: Marker sind fokussierbar (Leaflet), Enter und
      Leertaste lösen sie jetzt auch aus – auf der Hauptkarte, in den Reisen
      und in der Ausbreitung; Cluster zoomen hinein. Sichtbarer goldener Ring.

### 4.2 Zeitleiste — P0 ✅

**Beschreibung:** Filter über 9 Epochen (Erzväter → Frühe Kirche).

**Anforderungen**
- Auswahl einer Epoche filtert die Kartenmarker auf Orte, die in dieser Epoche
  erwähnt werden.
- „Ganze Bibel" hebt den Filter auf.
- Jede Epoche zeigt Name (DE/EN), Datums­spanne und Anzahl Orte.

**Akzeptanzkriterien**
- [x] Auswahl aktualisiert Kartenmarker sofort.
- [x] Aktive Epoche ist farblich klar markiert.
- [x] **Kumulativer Modus** („Bis hierhin"): zeigt alle Orte bis einschließlich
      der gewählten Epoche; die in dieser Epoche neu hinzukommenden bleiben in
      voller Größe, alles Ältere tritt kleiner und blasser zurück. Für die
      Ausbreitung nach der Apostelgeschichte gibt es dasselbe als Zeitraffer (4.13).

### 4.3 Suche — P0 ✅

**Beschreibung:** Freitextsuche nach Ort/Begriff inkl. Schreibvarianten.

**Anforderungen**
- Treffer werden gerankt (exakt > Präfix > Teilstring > Variante), Tie-Break nach
  Häufigkeit.
- Treffer zeigt Bild/Platzhalter, Name, Häufigkeit, Epochen-Punkte.
- Auswahl fliegt den Ort an und öffnet die Infokarte (zeigt *wo* und *wann*).

**Akzeptanzkriterien**
- [x] „Goschen" liefert relevante Treffer; Auswahl zeigt Karte + Stellen + Epochen.
- [x] Diakritik-/Groß­schreibung-unabhängig.
- [x] Suche auch über **Bibelstellen-Referenz** („Apg 13", „Mk 6,30", „1. Mose 12",
      „Acts 27") → Orte des Kapitels + Sprung in den Text (4.15).
- [x] Suche über **Reisen und Ausbreitung** (Stationen, Ereignisse, Phasen).

### 4.4 Heatmap — P0 ✅

**Anforderungen**
- Umschalter Marker ↔ Heatmap.
- Gewichtung logarithmisch nach Häufigkeit, ruhige Farbrampe.

**Akzeptanzkriterien**
- [x] Heatmap zeigt erwartbar Jerusalem/Ägypten/Babylon als Hotspots.
- [x] Beim Heatmap-Modus ist die Zeitleiste ausgeblendet (Fokus).

### 4.5 Infokarte (Ortsdetail) — P0 ✅

**Anforderungen**
- Zeigt Bild + Bildnachweis, Name, Typen, Häufigkeit.
- „Erscheint in": Epochen-Chips. „Auch genannt": Schreibvarianten.
- „Bibelstellen": nach Buch gruppiert, je Stelle ein Link.
- „Quellen": OpenBible, Biblia, Wikidata, The Bible Project.

**Akzeptanzkriterien**
- [x] Bilder laden von Wikimedia ohne Referrer-Probleme.
- [x] Orte ohne Bild bekommen einen markenkonformen Platzhalter.

### 4.6 Präsentationsmodus — P0 ✅

**Beschreibung:** Geführter Buch-Durchlauf, Kapitel für Kapitel.

**Anforderungen**
- Buch-Auswahl (AT/NT), Bücher ohne kartierte Orte sind deaktiviert.
- Pro Kapitel: links **Bibeltext** (siehe 4.7) mit Orts-Index (Chips) und klickbaren
  Orts-Pins je Vers, Kapitel-Navigation (Zurück/Weiter + Slider + Tastatur ← / →),
  Lese-Link (Luther/ESV) und Bible-Project-Video-Link; rechts Karte, die auf die
  Kapitel-Orte zoomt.

**Akzeptanzkriterien**
- [x] „2. Könige" lässt sich Kapitel für Kapitel durchgehen; Karte folgt.
- [x] **Echter Bibeltext** links eingebettet (siehe 4.7).
- [x] Tastatursteuerung (← / →).
- [x] **Beamer-Layout**: Schalter in der Kopfleiste legt den Text über die
      ganze Breite (26 px statt 18,5 px) und blendet die Karte aus; die
      Einstellung wird gemerkt (LocalStorage).

### 4.7 Bibeltext einbetten — P0 ✅

**Problem:** Im Präsentationsmodus wird der Text aktuell nur **verlinkt**. Für
„links die Bibelstelle, rechts die Karte" soll der Text **direkt** erscheinen.

**Anforderungen**
- Volltext je Kapitel zweisprachig: **Deutsch** (Public Domain, z. B. *Luther 1912*)
  und **Englisch** (z. B. *World English Bible*).
- Erwähnte Ortsnamen im Text sind **hervorgehoben** und mit dem jeweiligen Marker
  verknüpft (Hover/Klick → Karte fokussiert).
- Lizenz/Quelle der Übersetzung sichtbar.

**Akzeptanzkriterien**
- [x] Kapiteltext lädt schnell (lazy **pro Buch**, gecacht; größte Datei ~0,5 MB).
- [x] Ortsnamen-Verknüpfung: klickbare Orts-Pins je Vers (beide Sprachen, ~100 %)
      plus Inline-Hervorhebung (best effort, v. a. Englisch).
- [x] Umschalten DE/EN ändert Text und Lese-Links konsistent.

**Umsetzung (Ist)**
- Quelle [seven1m/open-bibles](https://github.com/seven1m/open-bibles): Luther 1912
  (OSIS) + WEB (USFX), gemeinfrei. `scripts/build-text.mjs` erzeugt
  `public/data/text/<Buch>.json` = `{ chapters: { "1": { de:[{v,t}], en:[{v,t}] } } }`.
- Runtime: `src/lib/text.ts` (lazy Loader), `src/lib/highlight.tsx` (Inline-Markup),
  Umbau `src/components/Presentation.tsx`.

**Frühere Lösungsskizze (verworfen)**
- Public-Domain-Quelle (z. B. `scrollmapper/bible_databases` o. Ä.) → Build-Skript
  erzeugt `public/data/text/<Buch>/<Kapitel>.json` (pro Vers ein Eintrag).
- Ortszuordnung über vorhandene `osis`-Referenzen je Ort (Vers → Ortsliste).

### 4.8 Mehr Bilder — P1 ✅

**Problem:** Nur 291/1.335 Orte haben ein OpenBible-Foto.

**Akzeptanzkriterien**
- [x] ≥600 Orte mit Bild erreichbar: 291 vorhanden + 386 mit Wikidata-Fallback =
      **677 potenziell**, jeweils mit Nachweis (Commons-Dateiseite).

**Umsetzung (Ist)**
- Build-Zeit-Anreicherung war blockiert (Wikidata/Commons nicht auf der Egress-
  Allowlist → 403), daher **Runtime-Fallback**: `src/lib/wikidataImage.ts` löst für
  Orte ohne Bild die Wikidata-`P18` clientseitig auf (EntityData-JSON, CORS) und lädt
  das Commons-`Special:FilePath`-Bild; gecacht in memory + sessionStorage. Eingebunden
  in die Infokarte (`PlaceDetail.tsx`).

### 4.9 Bible-Project-Videos kuratieren — P1 ✅

**Akzeptanzkriterien**
- [x] Pro Buch ein Link auf die BibleProject-**Guide-Seite** (mit Overview-Video):
      `book-of-<name>`, Gruppen-Override für Kings/Samuel/Chronicles.
- [x] Pflege an **einer** Stelle (`bibleProjectUrl` in `src/data/books.ts`).

### 4.10 Zweisprachigkeit DE/EN — P0 ✅

- [x] Oberfläche, Buchnamen, Bibeltext und Lese-Links wechseln zwischen DE/EN.
- [x] Sprachwahl wird gemerkt (LocalStorage); ohne gespeicherte Wahl
      entscheidet die Browsersprache. `<html lang>` läuft mit.

### 4.11 Deployment & Betrieb — P0 ✅ *(Workflow steht; Pages-Aktivierung durch Nutzer)*

**Akzeptanzkriterien**
- [x] Automatischer Deploy des Default-Branch via `.github/workflows/deploy.yml`.
- [x] `base`/`BASE_URL` korrekt für Unterpfad (`VITE_BASE=/bibelmap/`); Datenpfade
      nutzen `import.meta.env.BASE_URL`.
- [ ] Einmalig: *Settings → Pages → Source: GitHub Actions* aktivieren (Nutzer).
- [ ] Lighthouse-Messung ≥ 90 (nach erstem Deploy verifizieren).


### 4.12 Reisen & Geschichten — P1 ✅

**Beschreibung:** Die großen Wege der Bibel als erzählte Reise, abspielbar.

**Anforderungen**
- 14 Reisen von Abraham bis Emmaus, nach Epochen gruppiert; je Station Name,
  Bibelstelle, ein bis zwei Sätze Erzählung und – wo vorhanden – die `placeId`
  in den Ortsdatensatz.
- Abspielen zeichnet die zurückgelegte Strecke mit und lässt einen Punkt die
  Etappen abgehen, mit Lesepause an jeder Station.
- Entfernung und Tagesmärsche je Etappe und für die ganze Reise.

**Akzeptanzkriterien**
- [x] Route, Stationsliste und Erzählung laufen synchron; ← / → blättern,
      Leertaste startet.
- [x] Entfernungen als **Luftlinie** ausgewiesen, Tagesmärsche mit 25 km/Tag
      gerechnet, Seewege ohne Fußrechnung.
- [x] Jede Station führt auf die Ortskarte.

### 4.13 Mission & Ausbreitung — P1 ✅

**Beschreibung:** Der Weg des Evangeliums von Jerusalem bis in die Gegenwart.

**Anforderungen**
- Die Reisen des Paulus (inkl. der Wege vor ihm) mit Bibelstelle je Station,
  animiert wie 4.12.
- Sechs Phasen der Ausbreitung mit rund 70 Ereignissen, Bögen zeigen die
  Richtung; **Zeitraffer** über einen Jahresregler von 30 bis heute.

**Akzeptanzkriterien**
- [x] Phasenwechsel folgt dem Jahr; jede Phase bekommt im Zeitraffer etwa
      gleich viel Zeit.
- [x] Alles nach Apostelgeschichte 28 ist als Kirchengeschichte gekennzeichnet;
      Überlieferungen sind als solche benannt, Zahlen als Größenordnungen.

### 4.14 Bibelquiz — P2 ✅

- [x] „Wo liegt …?" auf **unbeschrifteter** Karte, Punkte nach Entfernung
      (bis 25 km Volltreffer), drei Stufen nach Häufigkeit im Text.
- [x] Wissensfragen aus Reisen und Ausbreitung (drei von acht Runden,
      abschaltbar); nach der Antwort zeigt die Karte die Stelle.
- [x] Fragen entstehen aus den Daten, es gibt keine gepflegte Fragenliste.

### 4.15 Deep-Links & Teilen — P0 ✅ *(war v0.3: „State in URL")*

- [x] Jede Ansicht hat eine Adresse: `#ort=…`, `#reise=<id>,<station>`,
      `#mission=<phase>[,<detail>]`, `#lesen=<Buch>,<Kapitel>`, `#stammbaum`,
      `#quiz`, `#kirche`, `#heilsgeschichte`, `#vergleich`, `#unterstuetzen`.
- [x] Der Hash läuft beim Blättern mit (`replaceState`), Zurück-Taste und von
      Hand geänderte Adressen werden übernommen.
- [x] **Link**-Knopf in Ortskarte und Reise-Modi kopiert die aktuelle Adresse.

### 4.15b Kirchengeschichte verlinkbar — P2 ✅

- [x] `#kirche=vater,<id>` und `#kirche=konzil,<id>`; Reiter und Auswahl laufen
      in der Adresse mit, der Zurück-Knopf führt zurück.
- [x] Eine Angabe, die es nicht gibt, fällt auf den Anfang zurück und schreibt
      das auch in die Adresse – lieber eine gültige Auswahl als ein leerer Modus.
- [x] Der Querverweis aus dem Zeitbaum benutzt denselben Weg und hinterlässt
      damit ebenfalls eine teilbare Adresse.

### 4.15c Vergleich verlinkbar — P2 ✅

- [x] `#vergleich=<id>` je Gestalt, Teilen-Knopf in der Kopfzeile, Zurück-Taste
      führt zurück. Unbekannte Angaben fallen auf die erste Gestalt zurück.
- [x] Damit hat **jeder** Modus eine Adresse: Karte, Lesen, Reisen, Mission,
      Kirchengeschichte, Vergleich, Hören & Sehen, Quiz, Heilsgeschichte,
      Unterstützen, Stammbaum und Graph.

### 4.16 Offline & installierbar — P1 ✅

- [x] Service Worker mit zwei Caches: App samt Ortsdaten (sofort aus dem Cache,
      im Hintergrund erneuert) und Kartenkacheln/Schriften (begrenzt auf 600).
- [x] Keine Precache-Liste – die gebauten Dateien werden beim Einbau aus
      `index.html` gelesen.
- [x] Manifest und Symbole; die App ist installierbar.
- [x] Ohne Netz startet die App und zeigt alle Orte sowie besuchte Ausschnitte.

### 4.17 Handout drucken — P2 ✅

- [x] Eine Reise als Blatt: Kopf, Anriss, alle Stationen mit Stelle, Text und
      Entfernung, Fußnote zu den Zahlen – ohne Karte und Bedienelemente.
- [x] Kein zweiter Bildschirm-Aufbau: `@media print` blendet aus, was daneben
      steht.

### 4.18 Nachbarorte — P2 ✅

- [x] Jede Ortskarte zeigt, was **an einem Tag zu Fuß** erreichbar war (25 km),
      mit Entfernung und Himmelsrichtung; ein Klick wechselt zum Nachbarn.
- [x] Nur Siedlungen, nichts unter 1,5 km (Tore und Stadtviertel teilen die
      Koordinaten ihres Ortes); ausgewählt nach Bedeutung, gezeigt nach Nähe.

### 4.19 Hören & Sehen — P2 ✅

- [x] Eigener Modus über **alle 473 Folgen** der vier Quellen, filterbar nach
      Quelle, Buch, Epoche und Freitext; die Suche greift auch auf Ortsnamen zu
      und zieht deren Folgen herein.
- [x] Die Zahlen an den Quellenknöpfen zählen die **übrige** Auswahl mit, nicht
      nur die eigene – sonst zeigte jede Quelle nach dem Klick nur sich selbst.
- [x] Verknüpfung in **beide Richtungen**: unter jeder Folge stehen ihre Orte
      (Klick → Karte), jede Ortskarte verlinkt zurück in den gefilterten Modus.
- [x] Verlinkbar: `#hoeren`, `#hoeren=<quelle>`, `#hoeren=ort,<ortsid>`,
      `#hoeren=stelle,<buch>,<kapitel>`.
- [x] Auch der Lesemodus hängt daran: neben dem Kapitel steht, wie viele Folgen
      genau diese Stelle behandeln; ein Klick öffnet sie, und von dort führt
      jede Bibelstelle in den Text zurück. Buch-Übersichten zählen mit – sie
      gelten für jedes Kapitel und stehen deshalb hinter den genauen Stellen.
- [x] Ehrlich bleiben: eine genannte Bibelstelle ist nicht zwingend das Thema
      der Folge – der Hinweis steht unter der Liste, nicht im Kleingedruckten.
- [x] Zwei Reihenfolgen: **Passgenau** (genaue Stelle vor ganzem Buch) und
      **Neueste** (nach Sendedatum). Was kein Datum hat, steht dann am Ende und
      sagt das auch – nicht am Anfang, wo eine leere Angabe wie „ganz neu"
      aussähe.
- [x] Auf der Startseite als vierter Weg hinein (Karte 04) und in der Kopfzeile –
      ein Modus, den man nur über das Modi-Menü findet, findet kaum jemand.
- [x] Offline vollständig: der Medien-Index wird im Leerlauf mitgeholt und liegt
      damit im Cache des Service Workers – sonst stünde der Modus ohne Netz
      leer da, während jede andere Ansicht vollständig ist.

### 4.20 Bildnachweis vollständig — P1 ✅

- [x] Jedes Bild nennt **Urheber und Lizenz** – in der Ortskarte wie im
      Kartenfenster. Die Lizenz verlinkt auf ihren Text, der Urheber auf die
      Dateiseite; ein Titel sagt in der jeweiligen Sprache, was sie verlangt.
- [x] Die 386 Orte ohne eigenes Bild holen Urheber und Lizenz beim
      Laufzeit-Rückfall über die Commons-API (`extmetadata`) nach – bisher stand
      dort nur „Wikimedia Commons" und gar keine Lizenz.
- [x] Der Urheber kommt von Commons als HTML; er wird als **Text** gelesen, nie
      eingesetzt.
- [x] Unbekannte Kürzel werden weder verschwiegen noch geraten: sie stehen so
      da, wie sie in den Daten stehen, mit Verweis auf die Dateiseite.

### 4.21 Buchkürzel an einer Stelle — P2 ✅

- [x] Die Kurzformen der Bibelbücher standen an **drei** Stellen im Repo
      (`parseRef.ts`, `bookAbbr.ts`, `scripts/lib/bibleref.mjs`). Jetzt an
      einer: `src/data/bookAliases.json`, gelesen von allen dreien.
- [x] Zwei Listen, weil die Lage entscheidet: `text` gilt überall, `typed` nur
      dort, wo jemand einen Buchnamen eingibt – „Am 3" ist im Suchfeld Amos, im
      Fließtext fast immer „am 3.".
- [x] `npm run check:aliases` prüft die Liste: unbekanntes Buchkürzel, dieselbe
      Kurzform für zwei Bücher, zu kurze Formen, überflüssige Wiederholung des
      vollen Namens.
- [x] Nachgewiesen unverändert: `media.json` nach dem Neubau **byte-identisch**,
      alle 268 bisherigen Kurzformen lösen auf dasselbe Buch auf, alle 325
      Stammbaum-Referenzen ebenso.

### 4.22 Medien-Index: Sendedaten und Umlaute — P1 ✅

- [x] Numerische Entities werden aufgelöst. Vorher verloren **229 von 473**
      Folgen ihr Datum (`&#43;0000` in der Zeitzone) und **63 Titel** zeigten
      `f&#xFC;r` statt `für`.
- [x] Die korrigierten Titel bringen genauere Stellen mit: `34,1&#x2013;12` war
      Vers 1, jetzt sind es die Verse 1–12. **32 Folgen** decken damit mehr ab,
      **73 Orte** haben mehr Folgen, kein Ort weniger (4.661 → 4.797
      Verknüpfungen).
- [x] Der Baubericht nennt je Quelle, wie viele Folgen ein Datum mitbringen –
      steht dort plötzlich 0, ist der Datumsleser kaputt.

### 4.23 Gelände in 3D — P2 ✅

- [x] Vierte Ansicht (`#gelaende`) auf **MapLibre GL**, mit Höhengelände aus den
      Terrain Tiles (AWS Open Data), Neigung, Drehung und einstellbarer
      Überhöhung (1×–3×).
- [x] **Kein Umstieg**: die fünf Leaflet-Karten bleiben, wie sie sind. Die
      Geländeansicht steht daneben und teilt sich Seitenleiste, Zeitleiste,
      Kartenwahl und Ortsauswahl mit der flachen Karte.
- [x] Was sie nicht kann, steht in der Ansicht: keine Ballung, keine Wärmekarte,
      keine Reichsgrenzen.
- [x] **Routen im Gelände** – Bibelreisen (`#gelaende=reise,<id>`) wie
      Missionsreisen (`#gelaende=mission,<id>`): die Route folgt den Höhen,
      in der Farbe ihrer Epoche, mit anklickbaren Stationen. Der Weg geht in
      beide Richtungen – aus beiden Modi ein **3D**-Knopf, aus dem Gelände
      zurück zu Text, Stellen und Entfernungen. Eine Route, die es nicht gibt,
      verschwindet aus der Adresse statt auf nichts zu zeigen.
- [x] **Station für Station** mit zwei Pfeilen – der einzige Weg zu den
      Stationen ohne Maus, denn die Punkte liegen in einer WebGL-Leinwand.
      Feste Breite der Anzeige, damit die Pfeile beim Namenswechsel stehen
      bleiben; am Anfang und Ende schalten sie sich ab.
- [x] MapLibre beschriftet seine Bedienelemente selbst – jetzt in der gewählten
      Sprache („Näher heran" statt „Zoom in", „Karte" statt „Map"). Die
      A11y-Prüfung sah das nicht: sie zählt Namen, nicht deren Sprache.
- [x] **Schräg ↔ von oben** als Knopf, nicht nur als Geste: Kippen verlangt auf
      dem Telefon zwei Finger senkrecht: unauffindbar, und damit bliebe die
      Karte dort für immer schräg. Der Knopf folgt der Karte, wer doch mit den
      Fingern kippt, sieht ihn mitgehen.
- [x] Die Ausbreitung bekommt **keinen** 3D-Knopf: Bögen zwischen Kontinenten
      über 2.000 Jahre sind keine Wege, die ein Gelände erklären würde.
- [x] Erst auf Abruf geladen (950 kB) und **nicht** im Leerlauf vorgeholt – eine
      Ansicht, die ohnehin Höhenkacheln aus dem Netz braucht, rechtfertigt kein
      Megabyte für jeden Besuch.

### 4.24 Prüfungen laufen von selbst — P2 ✅

- [x] `npm run check` führt die vier netzunabhängigen Prüfungen aus
      (Buchkürzel, Zeitdokumente, Stammesgrenzen, Farbkontraste) und meldet
      am Ende, was durchfiel – mit der Ausgabe der fehlgeschlagenen Prüfung.
- [x] Die CI ruft es **vor** dem Build auf: was durchfällt, wird nicht
      veröffentlicht.
- [x] `check:bp` und `check:links` bleiben draußen. Sie fragen fremde Server;
      ein Anbieter mit Schluckauf darf keinen Deploy blockieren.

### 4.25 Warten, ohne den Bildschirm zu leeren — P2 ✅

- [x] Eine **Ansicht** (Gelände, Zeitbaum, Graph) zeigt beim Nachladen eine
      Anzeige, die nur die Fläche belegt. Kopfzeile, Seitenleiste und
      Zeitleiste bleiben stehen und bedienbar – wer sich anders entscheidet,
      kann zurück, statt zu warten.
- [x] Für die **Modi** bleibt die alte Anzeige: sie decken danach ohnehin
      alles ab, ein durchblitzender Kartenrand wäre schlechter.
- [x] Beim Gelände steht dabei, worauf man wartet: die Karte kommt einmalig
      als eigenes Paket (950 kB).

### 4.26 Fremde Beschriftungen übersetzen — P2 ✅

- [x] Leaflet und MapLibre beschriften ihre Bedienelemente selbst, auf
      Englisch. Eine Stelle (`src/lib/mapLocale.ts`) setzt sie für alle sechs
      Leaflet-Karten; die Geländekarte bekommt sie über MapLibres `locale`.
- [x] Die A11y-Prüfung meldet fremdsprachige Namen jetzt als Befund. Vorher
      konnte sie es nicht: sie zählt, **ob** ein Name da ist, nicht in welcher
      Sprache – gegen den alten Stand meldet sie 11 von 14 Ansichten.
- [x] Auf Englisch bleibt „Zoom in" stehen: übersetzt wird in die gewählte
      Sprache, nicht stur ins Deutsche.
- [x] Die Prüfung liest die fremden Namen aus den Bibliotheken selbst statt aus
      einer Handpflege – und fand damit im ersten Lauf einen, den die
      Handpflege übersehen hatte („Toggle attribution").

### 4.27 Schriftgröße im Entdeckermodus — P2 ✅

- [x] Der Bibeltext lässt sich von 80 % auf 200 % stellen, in beiden Modi
      (18,5 px bzw. 26 px als Grundwert), und die Einstellung bleibt gemerkt.
- [x] Dabei gefunden und mit repariert: die Leiste des Modus passte auf dem
      Telefon **nie** in eine Zeile – „Beenden" lag 116 px außerhalb des
      Bildes und war nicht zu erreichen. Sie bricht jetzt um.

### 4.28 Alles im Bild, auch auf dem Telefon — P1 ✅

- [x] Alle sechzehn Ansichten auf 390 Pixeln durchgemessen: in **Mission** (62 px)
      und **Kirchengeschichte** (6 px) lag „Beenden" außerhalb des Bildes – wie
      zuvor im Entdeckermodus. Die Leisten aller sechs Vollbild-Modi brechen
      jetzt um.
- [x] Die A11y-Prüfung geht die Ansichten ein zweites Mal auf Telefonbreite
      durch und meldet, was aus dem Bild ragt. Was in einem seitlich
      scrollbaren Streifen liegt, zählt nicht – durch eine Reihe von Ortsmarken
      wischt man, das ist Absicht.

### 4.29 Tastatur: Sprungmarken — P1 ✅

- [x] Drei Sprungmarken am Anfang der Tabulatorreihe („Zur Navigation", „Zur
      Suche", „Zur Karte"), sichtbar erst mit Fokus. Vorher war die Kopfzeile
      auf der Karte das 205. von 208 ansteuerbaren Elementen; jetzt sind es in
      allen Ansichten zwei Tastendrücke.
- [x] Die A11y-Prüfung misst diesen Weg in einem dritten Durchgang mit.

### 4.30 Eigener Weg — P2 ✅

**Beschreibung:** Orte zu einem selbst zusammengestellten Weg verbinden – für
die Wege, die im Text nicht als Weg stehen (die Orte eines Kapitels, die Städte
der sieben Sendschreiben, fünf Stationen für den Hauskreis).

**Anforderungen**
- Ortskarte: ein Knopf fügt an und nimmt wieder heraus; die Stelle im Weg steht
  dabei.
- Eigener Modus (`#weg`) mit Reihenfolge, Entfernung, Himmelsrichtung und
  Tagesmärschen je Etappe sowie Gesamtstrecke.
- Blatt zum Drucken wie bei den Reisen; Abspielen wie bei den Reisen.
- Die Adresse trägt den Weg mit (`#weg=a15257a,a112427,a231f80`).

**Akzeptanzkriterien**
- [x] Anfügen, Entfernen, Verschieben und Leeren wirken sofort auf Liste,
      Karte, Gesamtstrecke und Adresse.
- [x] Verschieben mit Knöpfen (↑/↓), nicht mit der Maus – eine Liste, die sich
      nur ziehen lässt, ist mit der Tastatur nicht zu ordnen.
- [x] Der Weg bleibt im Browser gemerkt (`localStorage`); ein geteilter Link
      zeigt beim Empfänger denselben Weg.
- [x] Ein Kürzel im Link, zu dem es keinen Ort gibt, fällt still heraus, statt
      eine Lücke in die Strecke zu reißen.
- [x] Entfernungen sind Luftlinien, Tagesmärsche eine Größenordnung – beides
      steht in der Ansicht.

### 4.31 Hinter dem Vorhang ist zu — P1 ✅

- [x] Gemessen: in **allen elf Vollbild-Modi** lagen **117 der ersten 120
      Tabulatorhalte** hinter dem Modus – auf Ortsmarken, Zeitleiste und
      Suchfeld der verdeckten Hauptkarte.
- [x] Der Hintergrund trägt bei offenem Modus `inert`: aus Tabulatorreihe und
      Vorlesebaum genommen. Nachgemessen: alle Halte liegen im Modus.
- [x] Im Modus bleibt keine Sprungmarke stehen – eine Marke in einen
      stillgelegten Zweig wäre ein toter Knopf.
- [x] Die A11y-Prüfung kennt die Regel: kein Halt hinter dem Vorhang, und
      Escape gibt den Weg zur Kopfzeile wieder frei.

### 4.32 Eine Suche, die auch die Menschen findet — P1 ✅

**Beschreibung:** Das eine Suchfeld fand Orte, Reisen, Ausbreitung und
Stammesgebiete – aber keinen einzigen Menschen, obwohl die App zu jedem eine
Seite hat.

**Gemessen vorher:** „Chalcedon", „Nizäa", „Bonhoeffer", „Debora", „Hiskia" und
„Sündenfall" fanden **nichts**; „Augustinus" traf nur ein Ereignis, in dessen
Text der Name vorkommt, nicht seine eigene Seite.

**Anforderungen**
- Kirchenväter (`#kirche=vater,…`), Konzilien (`#kirche=konzil,…`), Personen des
  Zeitbaums, Menschen aus den Stammesgebieten, Gestalten des Religionsvergleichs
  und Stationen der Heilsgeschichte sind über dasselbe Feld erreichbar.
- Zweite Schreibweisen der Konzilsstädte gelten mit – dieselbe Stadt, andere
  Buchstaben, nichts erfunden.
- Jeder Treffer führt auf eine Adresse, die sich weitergeben lässt.

**Akzeptanzkriterien**
- [x] Alle achtzehn Prüfwörter finden etwas; jedes Ziel gemessen nachgeprüft.
- [x] Ein Mensch aus dem Zeitbaum steht in der Adresse
      (`#stammbaum=zeit,bonhoeffer`) – vorher endete der Weg beim Reiter.
- [x] Die Stationen der Heilsgeschichte haben eine Adresse
      (`#heilsgeschichte=exodus`) und laufen beim Blättern mit; als einziger
      Modus hatten sie vorher keine.
- [x] Derselbe Mensch steht nicht doppelt in der Liste: Kirchenväter stammen aus
      demselben Datensatz wie die Personen des Zeitbaums.
- [x] Der Religionsvergleich wird bewusst schwächer bewertet – wer „Mose" tippt,
      soll zuerst die Orte und die Reise sehen.

### 4.33 Jede Karte sagt Bescheid — P2 ✅

**Beschreibung:** Kommt keine Kachel an, sieht eine Karte aus wie ein Fehler der
App. Die Hauptkarte sagte längst Bescheid – die anderen sechs Karten nicht.

**Gemessen vorher:** Von elf Ansichten mit Karte sagten **zwei** etwas
(`#karte`, `#gelaende`). In den Vollbild-Modi war der einzige Hinweis der der
Hauptkarte, seit 4.31 stillgelegt hinter dem Vorhang; auf der Stammeskarte gab
es ihn nie.

**Anforderungen**
- Jede Leaflet-Karte meldet den Ausfall in sich selbst.
- Dieselbe Regel wie bisher: erst nach sechs Fehlschlägen, wieder weg, sobald
  eine Kachel ankommt.
- Der Hinweis wechselt die Sprache mit und wird vorgelesen (`role="status"`).

**Akzeptanzkriterien**
- [x] Alle elf Ansichten mit Karte melden den Ausfall (vorher zwei).
- [x] Gegenprobe mit ausgelieferten Kacheln: keine einzige Meldung – die
      Prüfung braucht dafür einen Kontext ohne Dienst-Worker, sonst holt der
      die Kacheln selbst und läuft an der Umleitung vorbei.
- [x] Die Hauptkarte behält ihren bisherigen, reicheren Hinweis samt Rückfall
      auf die Nachtkarte; `MapView` meldet nur selbst, wenn es niemand sonst
      tut – doppelte Hinweise gibt es nicht.

### 4.34 Was lag am Weg? — P2 ✅

**Beschreibung:** Zu jeder Etappe die Orte, die neben der Verbindungslinie
liegen – die Frage, die jeder stellt, der eine Reise nacherzählt.

**Anforderungen**
- Korridor von 8 km neben der Luftlinie; Ausgabe in der Reihenfolge der Etappe.
- Nur punkthafte Orte: Siedlungen, Berge, Hügel, Quellen, Brunnen, Lager,
  Furten, Festungen, Pässe. Landschaften wie „Galiläa" haben nur einen
  Mittelpunkt und sagen nicht, ob sie am Weg lagen.
- Die Luftlinie ist nicht der Weg – das steht in der Ansicht.

**Akzeptanzkriterien**
- [x] Jerusalem → Jericho nennt Ölberg, Bethanien, Bahurim, Anathoth;
      Nazareth → Kapernaum nennt Gat-Hefer und den Tabor.
- [x] Gegenprobe an echten Daten: für jeden Treffer ist der Umweg über ihn
      nie kürzer als die Etappe selbst (sonst stimmte die Projektion nicht).
- [x] Die Zielstation erscheint nicht als Ort am Weg – die Bibel kennt mehrere
      Jerichos, und ein zweiter Datensatz stand 1,6 km neben der Linie.
- [x] Orte näher als 1 km an einer Station fallen heraus: „Zion" trägt dieselben
      Koordinaten wie Jerusalem. Der Ölberg (1,10 km) bleibt.
- [x] Leere Antwort wird als solche gezeigt – in der Wüste des Auszugs liegt
      nichts nah an der Linie.
- [x] Nicht bei Seewegen (`stop.sea`) und nicht in *Mission & Ausbreitung*:
      dort trägt kein Feld die Unterscheidung zwischen Schiff und Landmarsch.
- [x] Nahe beieinanderliegende Treffer werden **nicht** zusammengefasst:
      gemessen liegen Jerusalem/Zion 0,00 km, Ölberg/Bethphage 0,49 km
      auseinander – jede Schwelle für das eine trifft auch das andere.

### 4.35 Deutsch in der englischen Oberfläche — P1 ✅

**Gemessen vorher:** 28 deutsche Reste über achtzehn Ansichten. Der häufigste
stand in **jeder** Ansicht mit Karte: die Attributionen waren fest auf Deutsch
im Quelltext („· Orte: OpenBible.info", „· Routen: schematisch", „Orte der
Kirchenväter & Konzilien: schematisch"). Dazu die Nachweisseite („OpenStreetMap
Foundation und Mitwirkende", „Historische Karte © DARE, Universität Göteborg").

**Anforderungen**
- Was die App selbst sagt, sagt sie in beiden Sprachen – auch die Zeile unter
  der Karte, die beim Sprachwechsel mitwechseln muss.
- Was anderen gehört, bleibt: eine deutsche Folge heißt deutsch. Sie trägt
  `lang="de"` – richtiges HTML, das der Screenreader ebenso braucht.
- Namen bleiben Namen; „Universität Göteborg" heißt auf Englisch aber
  „University of Gothenburg", weil die Universität sich selbst so nennt.

**Akzeptanzkriterien**
- [x] 28 → 0 über alle achtzehn Ansichten.
- [x] `scripts/check-i18n.mjs` prüft es, mit Gegenprobe auf Deutsch.
- [x] Die Gegenprobe hat einen Fehler in der Prüfung selbst gefunden: sie hielt
      `<html lang="de">` für eine fremdsprachige Insel und übersprang alles.

### 4.36 Ortsregister — P2 ✅

**Beschreibung:** Alle Orte von A bis Z, wie im Anhang eines gedruckten
Bibelatlas. Die Suche beantwortet „wo ist X?" – nicht „welche Orte gibt es
überhaupt?".

**Anforderungen**
- Alphabetisch gruppiert, Umlaute unter ihrem Grundbuchstaben.
- Je Ort: Erwähnungen, Epochen als Punkte, Spanne der Bücher in Kanonreihenfolge.
- Filter nach Epoche und nach Namensteil.
- Druckbar als Anhang: ohne Filterleiste, zweispaltig.

**Akzeptanzkriterien**
- [x] 1.335 Orte, Buchstaben A–Z (kein Ort beginnt mit Q oder X).
- [x] „Frühe Kirche" filtert auf 135 Orte, „beth" auf 65.
- [x] Ein Klick öffnet die Ortskarte (`#ort=…`).
- [x] Im Druck: Kopfzeile da, Filterleiste weg, zwei Spalten statt drei –
      bei 16 mm Rand auf A4 wären drei Spalten 59 mm breit, zu wenig für
      „Abel-Beth-Maacha".
- [x] Die Spanne nennt erstes und letztes Buch, nicht jedes dazwischen:
      Jerusalem steht in 37 Büchern. Das sagt der Hinweis unter dem Register.
- [x] 57 Orte ohne Erwähnung stehen mit dabei, und es steht dabei, warum.

### 4.37 Der Graph mit der Tastatur — P1 ✅

**Gemessen vorher:** Die Suche im Graphen rückte den ersten Treffer in die
Mitte und hob ihn hervor. Öffnen ließ er sich nur durch einen Klick auf den
Punkt der Leinwand. „Jerusalem" tippen und Enter drücken blieb folgenlos, eine
Trefferliste gab es nicht – ohne Maus war der Graph eine Sackgasse. Die
Leinwand trug zudem kein `aria-label`.

**Akzeptanzkriterien**
- [x] Treffer stehen als Knöpfe unter dem Suchfeld, bis zu zwölf, mit der Art
      des Knotens daneben.
- [x] Nur mit der Tastatur nachgeprüft: drei Tabulatorschritte zum Suchfeld,
      „Jerusalem" tippen, weiter zum Treffer, Enter – die Ortskarte steht offen.
- [x] „Abraham" liefert die Person und die Stellen dazu.
- [x] Die Leinwand trägt `role="img"` und einen Namen, der sagt, was sie zeigt
      und wo die Bedienung liegt.
- [x] Die A11y-Prüfung meldet künftig namenlose Leinwände. Sie standen nur im
      Durchgang für fremdsprachige Namen – eine ganz ohne Namen fiel durch.
      Gegenprobe: mit Namen keine Meldung, ohne Namen `canvas`.

### 4.38 Quiz: „Welcher dieser Orte lag auf dem Weg?" — P2 ✅

**Beschreibung:** Eine dritte Wissensfrage, aus denselben Daten wie die
Ortsliste an jeder Etappe (4.34). Erfunden wird nichts – auch die falschen
Antworten sind echte Orte.

**Anforderungen**
- Richtige Antwort: bis 8 km neben der Luftlinie der Etappe.
- Falsche Antworten: mindestens 60 km neben derselben Linie **und** über 100 km
  von beiden Stationen. Ein Ort 20 km daneben wäre keine falsche Antwort,
  sondern eine strittige.
- Keine Seewege. Die Auflösung nennt den Abstand und die Einschränkung.

**Akzeptanzkriterien**
- [x] 400 erzeugte Fragen gegen ihre eigenen Regeln nachgerechnet: keine
      Verletzung.
- [x] Nur eindeutige Namen als Antwort. Die Messung fand Fragen, bei denen die
      richtige Antwort je nach gemeintem Ort 8 km oder 134 km neben der Linie
      lag: „Karmel" liegt am Meer und in Juda, „Zion" steht doppelt in den
      Daten. Ein Name, den es zweimal gibt, ist als Antwort nicht entscheidbar.
- [x] Im Browser gesehen: „Von Tal von Hebron nach Sichem – Jerusalem,
      Sepharvaim, Kyrene, Elath."

### 4.39 Prüfungen lesen den echten Code — P2 ✅

**Beschreibung:** Die erzeugten Quizfragen prüft künftig `npm run check` mit –
und zwar gegen das echte Modul, nicht gegen eine zweite Aufschreibung der
Regeln.

**Anforderungen**
- `scripts/lib/ts-loader.mjs`: Node 22 versteht TypeScript, es fehlten nur die
  endungslosen Importe und die Art-Angabe bei JSON. Beides ergänzt ein
  Auflöser-Haken, ohne dass die App etwas dafür tun muss.
- `scripts/check-quiz.mjs`: 400 Runden, jede Wegfrage nachgerechnet.
- Aufgenommen in `npm run check` (jetzt fünf Prüfungen) und damit in CI.

**Akzeptanzkriterien**
- [x] 400 von 400 Runden enthalten eine Wegfrage; keine Verletzung.
- [x] Die Prüfung meldet, wenn sie nichts zu prüfen fand – zu wenige Wegfragen
      oder zu viele, die sich keiner Etappe zuordnen lassen, sind selbst ein
      Fehler.
- [x] Gegenprobe: Korridor in `quiz.ts` von 8 auf 30 km geweitet → Exit 1 mit
      Befunden; zurückgestellt → Exit 0.

### 4.40 Jede Prüfung sagt, wie viel sie geprüft hat — P2 ✅

- [x] `check-sources` und `check-tribes` importieren den echten Code statt ihn
      mit regulären Ausdrücken zu lesen. Bei den Stammesgrenzen entfällt damit
      eine zweite Fassung von `tribeAt()` – die Prüfung verglich bislang ihre
      eigene Lesart mit ihrer eigenen Rechnung.
- [x] Untergrenzen, wo weiter Text gelesen wird: `check-contrast` verlangt
      mindestens 20 Farben, `check-sources` 100 Personen / 20 Einträge / 50
      Dokumente, `check-quiz` genug Wegfragen. Darunter meldet die Prüfung
      einen Fehler statt Entwarnung.
- [x] Jede Zeile der Zusammenfassung trägt ihre Zahl: 94 Kurzformen, 115
      Zeitdokumente, 13 Gebiete, 41 Datenfarben, 400 Quizfragen.
- [x] `check-sources` prüft zusätzlich die Felder, ohne die ein Dokument nichts
      taugt – ein leerer Titel ist schlimmer als ein fehlender Eintrag, weil er
      im Zeitbaum als Karte auftaucht.
- [x] Gegenprobe: Eintrag mit unbekannter ID eingefügt → Exit 1 mit Befund;
      entfernt → Exit 0.

### 4.41 Die Wege des Alten Testaments: Abraham und Sara — P1 ✅

**Anlass:** Der Eindruck, die App sei „neutestamentlich". Nachgemessen stimmte
das Gefühl, aber nicht der Grund: die alttestamentlichen Reisen fehlen nicht,
sie sind dünner erzählt. Paulus' zweite Reise hat 17 Stationen, der Auszug 10,
Abraham 9, die Rückkehr 4 – und jede Station trug genau einen Satz (~90
Zeichen).

**Abraham: 9 → 17 Stationen**, Text je Station 101 → 180 Zeichen. Neu dabei:
der Zug bis Hoba nördlich von Damaskus (der weiteste Punkt seines Lebens),
Melchisedek in Salem, Hagar am Brunnen Beer-Lachai-Roi, das Feilschen um
Sodom, Gerar, und der Kauf der Höhle Machpela.

**Sara ist die zweite Hauptperson**, nicht mehr „seine Frau": sie stand vorher
in 2 von 9 Stationen, jetzt in 6 von 17 – von „Sarai war unfruchtbar" über den
Palast des Pharao, ihre eigene Idee mit Hagar und ihr Lachen hinter der Tür bis
zu ihrem Tod mit 127 Jahren.

**Akzeptanzkriterien**
- [x] Jede Station trägt eine echte Bibelstelle; nichts erfunden.
- [x] Alle 17 `placeId` zeigen auf einen Ort in `places.json`, alle
      Koordinaten stimmen mit dem Ortsdatensatz überein.
- [x] Umstrittenes steht als umstritten da: „Wo Sodom lag, ist bis heute
      umstritten", „Salem wird traditionell mit Jerusalem gleichgesetzt".
- [x] Im Browser: 3.494 km, 140 Tagesmärsche, 16 Etappen mit „Orte am Weg".

### 4.42 Mose als eigener Weg, der Auszug nach 4. Mose 33 — P1 ✅

**Mose (neu, 12 Stationen)** – ein Leben als Route, nicht ein Ereignis: Nil,
Totschlag, Midian, brennender Busch, Rückkehr mit achtzig, Zoan vor dem Pharao,
Passanacht, Schilfmeer, Sinai, Kadesch, Berg Hor (Aarons Tod), Nebo.

**Der Auszug: 10 → 11 Stationen**, Text je Station 85 → 161 Zeichen. Die
Stationen folgen jetzt ausdrücklich der Liste in 4. Mose 33; die Bibelstellen
nennen beide Quellen (2. Mose und 4. Mose 33).

**Akzeptanzkriterien**
- [x] Jede Station trägt eine echte Bibelstelle; alle `placeId` und Koordinaten
      gegen `places.json` geprüft, keine Abweichung.
- [x] Keine Station ohne Weg: „Vor dem Pharao" lag zunächst auf denselben
      Koordinaten wie „Zurück nach Ägypten" und „Ramses" – drei Punkte, zwei
      Etappen der Länge null. Gelöst nicht durch geratene Koordinaten, sondern
      durch **Zoan**: Psalm 78,12.43 verortet die Wunder „auf dem Felde Zoan".
- [x] Was die Liste nennt und niemand lokalisieren kann, steht als solches da:
      „Von Alusch weiß niemand, wo es lag."
- [x] Umstrittenes bleibt umstritten: die Lage von Sinai und Meer steht im
      Vorspann der Reise.
- [x] Im Browser: Mose 1.800 km / 72 Tagesmärsche, der Auszug 751 km / 30 –
      keine Nulletappe, keine Konsolenfehler.

**Bekannt und nicht angerührt:** In der Exil-Reise teilen sich „Am Fluss Kebar"
und „Babylon" einen Punkt im Ortsdatensatz. Das zu trennen hieße, Koordinaten
zu erfinden.

### 4.43 Vierzig Jahre Wüste: 10 → 14 Stationen — P1 ✅

Damit ist der Mose-Bogen fertig erzählt: Auszug (11), Mose selbst (12), die
Wüstenjahre (14). Text je Station 77 → 180 Zeichen.

Neu dabei: **Kibroth-Hattaawa** (die Wachteln, und der Name „Lustgräber"),
**Hazeroth** (Mirjam und Aaron gegen ihren Bruder, und das Lager wartet sieben
Tage auf sie), die **Wüste Paran** als Ausgangspunkt der Kundschafter, die
**Wüste Zin** (Mirjams Grab, und der Schlag auf den Felsen) und der **Berg
Hor** (Aarons Tod).

**Akzeptanzkriterien**
- [x] Alle 14 Stationen mit echter Bibelstelle, `placeId` und Koordinate gegen
      `places.json` geprüft – keine Abweichung, keine Nulletappe.
- [x] Die Lücke steht als Lücke da: „Zwischen Kadesch und hier liegen in der
      Liste achtzehn Lager, von denen kein einziges sicher zu zeigen ist."
      Und im Vorspann: 4. Mose 33 zählt 42 Lager, die meisten unlokalisierbar.
- [x] Im Browser: 992 km, 40 Tagesmärsche, 13 Etappen mit „Orte am Weg".

### 4.44 Die vier übrigen Wege des Alten Testaments — P1 ✅

Nach Abraham, Mose, Auszug und Wüste blieben vier alttestamentliche Reisen
stehen, die zwar auf der Karte lagen, aber je Station nur einen Satz trugen.
Alle vier auf einmal, damit das Alte Testament nicht länger die dünnere Hälfte
ist:

- **Jakob** 11 → 14 Stationen, jetzt das ganze Leben von 1. Mose 25 bis 50:
  Beerscheba (das Linsengericht und der erschlichene Segen), Bethel (die
  Leiter), Haran (zwanzig Jahre bei Laban), Gilead, Mahanajim, Pnuël (der Kampf
  am Jabbok), Sukkot (die Versöhnung mit Esau), Sichem, Bethel zurück, Efrata
  (Rahels Grab), Hebron (Isaaks Tod), Beerscheba (der Aufbruch nach Ägypten),
  Gosen, Hebron (Machpela).
- **Landnahme** 9 → 14: neu **Ebal und Garizim** (der Segen und der Fluch
  vorgelesen), **Lachis**, **Debir**, die **Wasser von Merom** und **Silo**
  (die Verteilung des Landes).
- **David** 9 → 15: neu **Gibea** (das Fenster, durch das Michal ihn
  hinunterlässt), **Mizpe in Moab**, die **Wüste Maon**, die **Wüste Sif** (der
  Speer am Kopfende), **Hebron** (die Salbung über Juda) und **Jerusalem**.
- **Elia** 8 → 13: neu **Jesreel** (Nabots Weinberg), **Samaria**, **Gilgal und
  Bethel**, **Jericho** und **der Jordan** (der Wagen aus Feuer).

Text je Station: Jakob 196, Landnahme 177, David 187, Elia 191 Zeichen. Damit
tragen elf der fünfzehn Reisen ausgeführte Stationstexte; dünn blieben Josef
(6), Jona (6), Exil (6) und Rückkehr (4) – nachgeholt in § 4.45.

**Akzeptanzkriterien**
- [x] Jede neue Station mit Bibelstelle, `placeId` und Koordinate gegen
      `places.json` geprüft: 0 unbekannte IDs, 0 Koordinatenabweichungen,
      0 Stationen ohne Stelle.
- [x] Keine neue Nulletappe – zwei Stationen auf demselben Punkt gäbe eine
      Etappe von 0 km. (Damals noch offen: im Exil lagen „Am Fluss Kebar" und
      „Babylon" auf einem Punkt; behoben in § 4.45.)
- [x] Umstrittenes steht als umstritten da (Debir, Merom), Überliefertes als
      Überlieferung.
- [x] Im Browser gemessen: Jakob 2.109 km / 84 Tagesmärsche, Landnahme 532 km /
      21, David 429 km / 17, Elia 1.373 km / 55 – keine Etappe ohne Länge,
      keine Fehlermeldung in der Konsole.

### 4.45 Die letzten vier dünnen Reisen: Josef, Jona, Exil, Rückkehr — P1 ✅

Damit tragen zwölf der fünfzehn Reisen ausgeführte Stationstexte. (Der Satz
stand hier zuerst als „jede der fünfzehn" – das war falsch: die drei
neutestamentlichen Reisen hatten weiter einen Satz je Station. Nachgeholt in
§ 4.46.)

- **Josef** 6 → 12 Stationen, jetzt 1. Mose 37–50 statt 37–47: Noph (Potifars
  Haus und das Gefängnis), **On** (der Traumdeuter wird Wesir und heiratet die
  Tochter des Priesters von On), der Hunger in Hebron, der Becher in Benjamins
  Sack, die **Tenne Atad** jenseits des Jordans (sieben Tage Klage, und die
  Kanaaniter nennen den Ort Abel-Mizrajim), **Machpela** – und als Schluss
  **Sichem: das Grab**, wo Josua nach Josua 24,32 Josefs Gebeine begräbt, an
  genau der Stelle, an der die Geschichte schiefging.
- **Exil** 6 → 9: **Lachis** und **Aseka**, die nach Jeremia 34,7 zuletzt noch
  hielten – mit der Tonscherbe von 1935, auf der ein Vorposten meldet, die
  Feuerzeichen von Aseka seien nicht mehr zu sehen; die **Ebene von Jericho**,
  wo Zedekia eingeholt wird; das **große Wasser bei Gibeon** (Jeremia 41).
- **Rückkehr** 4 → 8: **Jericho** (die Heimkehrerliste zählt Ort für Ort),
  **Jerusalem: der Grundstein** getrennt von **Jerusalem: die Mauer**, und die
  **Ebene Ono**, in die Sanballat viermal einlädt und in die Nehemia viermal
  nicht geht.
- **Jona** bleibt bei 6 Stationen. Das Buch hat nicht mehr Geographie: vier
  Orte und zwei Punkte auf See. Statt Stationen zu erfinden, wuchs der Text von
  93 auf 233 Zeichen je Station.

**Akzeptanzkriterien**
- [x] 0 unbekannte `placeId`s, 0 Koordinatenabweichungen gegen `places.json`,
      0 Stationen ohne Bibelstelle.
- [x] **Keine Nulletappe mehr in der ganzen Datei.** Die bekannte Ausnahme —
      „Am Fluss Kebar" und „Babylon" lagen im Exil auf einem Punkt — ist
      behoben, indem beide zu einer Station „Babylonien: am Fluss Kebar"
      zusammengefasst wurden. Sie zu trennen hätte geheißen, Koordinaten zu
      erfinden; wo der Kanal Kebar lief, steht jetzt als Unbekanntes im Text.
- [x] Umstrittenes bleibt umstritten: Tarsis („Südspanien oder Kilikien"), der
      Verlauf des Kebar, die ungenannte Stadt in 1. Mose 39 („Die Bibel nennt
      keine Stadt; Hauptstadt war damals Memphis").
- [x] Was nicht stattfand, steht nicht als Reise da: Nehemia ging nicht nach
      Ono, und der Stationstext sagt das ausdrücklich samt Hinweis, dass die
      Linie schematisch ist.
- [x] Behauptete Entfernungen nachgerechnet: Gat-Hefer → Ninive 826 km („gut
      achthundert"), Hebron → Sichem 78 km („gut siebzig"), Jericho → Ribla
      306 km („gut dreihundert").
- [x] Im Browser in **beiden** Sprachen gezählt, nicht geschätzt: Josef 12
      Stationen / 2.555 km / 102 Tagesmärsche, Jona 6 / 2.871 km / 115, Exil
      9 / 2.173 km / 87, Rückkehr 8 / 4.883 km / 195 – keine Etappe ohne
      Länge, kein JavaScript-Fehler.

### 4.46 Die drei neutestamentlichen Reisen — und „ein Gang zu Fuß" — P1 ✅

Nach § 4.44 und § 4.45 waren die dünnsten Reisen ausgerechnet die
neutestamentlichen: Geburt 5 Stationen zu 97 Zeichen, Galiläa 8 zu 92,
Jerusalem 7 zu 92 – während der Rest bei 160 bis 240 lag.

- **Die Flucht nach Ägypten** 5 → 7: **Jerusalem: die Darstellung** und
  **Bethlehem: die Sterndeuter** getrennt (Lukas und Matthäus erzählen
  verschiedene Wege; hier stehen sie nacheinander), und als Schluss
  **Jerusalem: mit zwölf**, wo die Eltern ihn eine Tagereise lang nicht
  vermissen.
- **Jesu Wege in Galiläa** 8 → 13: **der Jordan** (Taufe und die vierzig Tage),
  **Nain**, **auf dem See** (Sturm und Gang über das Wasser, als Seeweg
  gezeichnet), **Magdala / Dalmanuta** und **Gennesaret**.
- **Der Weg nach Jerusalem** 7 → 13: **jenseits des Jordans** (Johannes 10,40 –
  zurück an die Taufstelle), **Betanien** zweimal (Lazarus und die Salbung),
  **Ephraim**, **Betfage**, **Gethsemane** und **Golgatha**.

**„1 Tagesmarsch" für 520 Meter**

Die neuen Passionsstationen liegen in Gehweite: Jerusalem → Gethsemane 0,52 km,
Betanien → Betfage 0,82 km, Gethsemane → Golgatha 0,86 km. Die Anzeige rechnete
jede Etappe in Tagesmärschen um, und `walkingDays` hört bei 1 auf – aus einem
Gang von fünfhundert Metern wurde „1 Tagesmarsch". Das war schon vorher falsch
(Betanien → Jerusalem 2,2 km, Emmaus 6,4 km), fiel aber nicht auf.

Neu: `SHORT_WALK_KM = 8` und `isShortWalk()` in `src/lib/route.ts`; unter acht
Kilometern steht **„ein Gang zu Fuß"** statt einer Tagesangabe – in den Reisen
wie in der eigenen Route. Der Hinweistext nennt die Schwelle.

**Akzeptanzkriterien**
- [x] 0 unbekannte `placeId`s, 0 Koordinatenabweichungen, 0 Stationen ohne
      Bibelstelle, 0 Nulletappen.
- [x] Im Browser in beiden Sprachen gezählt: Geburt 7 Stationen / 1.117 km,
      Galiläa 13 / 351 km, Jerusalem 13 / 240 km – und **jede** Etappe einer
      Kategorie zugeordnet (Gang, Tagesmarsch oder Seeweg), keine übrig.
- [x] Beide Zweige der neuen Beschriftung geprüft, nicht nur einer: im Weg nach
      Jerusalem stehen 6 Etappen als Gang und 6 als Tagesmärsche. Eine Regel,
      die immer dasselbe sagt, prüft nichts.
- [x] Behauptungen im Text nachgerechnet und dort zurückgenommen, wo sie zu
      weit gingen: „zehn Kilometer" nach Bethlehem sind 8,5 km Luftlinie (jetzt
      „knapp zehn"), „der kürzeste Vers der Bibel" gilt nicht im Griechischen
      (jetzt „in den meisten Übersetzungen"), Ephraim kommt nur *in den
      Evangelien* nur einmal vor, und „die Passion auf zwei Quadratkilometern"
      stimmte nicht – Emmaus liegt 6,4 km von Golgatha (jetzt: sieben
      Stationen, keine Etappe über acht Kilometer, die kürzeste fünfhundert
      Meter).
- [x] Umstrittenes bleibt umstritten: welche Stadt in Markus 5 gemeint ist
      („geben die Handschriften verschieden an"), wo Emmaus lag, und dass die
      Reihenfolge der Erzählung folgt, nicht einem Fahrplan.

Damit tragen **alle fünfzehn Reisen** 160 bis 240 Zeichen je Station.
### 4.47 Jesus – Leben und Wege (eigene Sektion) — P1 ✅

**Anlass:** Die Evangelien waren drei Routen unter fünfzehn in „Reisen &
Geschichten“. § 4.46 hat sie inzwischen ausgebaut (7 + 13 + 13 Stationen), und
das bleibt richtig: als Weg gelesen. Zwei Fragen beantwortet ein Weg trotzdem
nicht – was in der Passionswoche an welchem Tag geschah, und wo Maria von
Magdala überall vorkommt. Dafür braucht es eine Gliederung nach Akten und eine
zweite Achse: die Menschen.

**Eine eigene Sektion, 86 Stationen in sieben Akten:** Verheißung und Geburt
(12), die verborgenen Jahre (2), Taufe/Wüste/erste Zeichen (11), das Jahr am See
(26), der Weg nach Jerusalem (13), die letzte Woche (14), der dritte Tag und
danach (8). Die Passionswoche trägt an jeder Station ihren Tag – von
Palmsonntag über die fünf Verhöre in einer Nacht bis zur Grabesruhe.

**Die Menschen sind die zweite Achse:** 52 Personen mit Rolle und einem eigenen
Absatz, gruppiert (Familie · die Zwölf · Frauen, die mitgehen · Begegnungen ·
Macht). Jede Station nennt, wer darin handelt; ein Klick auf einen Namen zeigt
seine Spur durch alle Akte – Petrus 24 Stationen, Maria 9, Maria von Magdala 4.
Die Suche findet Stationen, Akte und Personen.

**Fremde Häuser:** Jede Station verlinkt den BibleProject-Guide ihres
Evangeliums (dieselbe geprüfte Adressregel wie 4.9). Für „The Chosen“ steht die
Zuordnung Folge → Station in `src/data/chosen.ts`; verlinkt wird nur die
Serienseite.

**Akzeptanzkriterien**
- [x] Jede Station trägt eine echte Bibelstelle; nichts erfunden. Abweichungen
      zwischen den Evangelien stehen im Text, nicht in einer Harmonisierung.
- [x] Alle 74 `placeId` zeigen auf einen Ort in `places.json` und liegen
      höchstens 6 km von ihm entfernt (`npm run check:gospel`).
- [x] Jede Bibelstelle lässt sich lesen, und ihr Buch passt zu dem Guide, auf
      den die Station verlinkt – sonst schlägt die Prüfung fehl.
- [x] Jede in einer Station genannte Person steht im Verzeichnis.
- [x] Unsichere Orte stehen als unsicher da: „Wüste Juda – der Ort ist nicht
      überliefert“, „Hermon oder Tabor, die Tradition schwankt“, „Machärus – die
      Festung nennt erst Josephus“.
- [x] Deep-Links: `#jesus=passion,golgotha`, `#jesus=mensch,petrus`; eine
      verlinkte Station bestimmt ihren Akt selbst.
- [ ] **Offen:** Die Zuordnung der Folgen von „The Chosen“ (Staffel, Folge,
      Titel) ist nach Inhalt zusammengetragen und noch nicht bei thechosen.tv
      nachgesehen – der Netzzugang der Arbeitsumgebung erlaubt den Host nicht.
      Bis dahin steht `VERIFIED = false`, und die Oberfläche weist die Angaben
      als unbestätigt aus. Ebenso offen: Folgen aus Staffel 2 und 5, die hier
      bewusst fehlen, statt geraten zu werden.

### 4.48 Heilsgeschichte: 20 → 30 Stationen, und eine Prüfung dafür — P1 ✅

Der Modus, der die ganze Bibel in einem Durchgang erzählt, war der dünnste Text
der App: **97 Zeichen je Station** – und schief verteilt. Sechs Stationen für
Urgeschichte und Erzväter, **eine** für den Auszug aus Ägypten. Der **Sinai
fehlte ganz**: das Ereignis, auf das sich der Rest des Alten Testaments dauernd
beruft, kam in der Übersicht nicht vor. Ebenso die Richterzeit, ein Zeitraum von
dreihundert Jahren.

Jetzt **30 Stationen** zu Ø **241 Zeichen** (199–271), und die Verteilung folgt
dem Stoff statt dem Zufall:

| Epoche | vorher | jetzt |
|---|---|---|
| Erzväter | 6 | 6 |
| Exodus & Wüste | 1 | **3** |
| Landnahme & Richter | 1 | **2** |
| Vereintes Königreich | 2 | **3** |
| Geteiltes Königreich | 2 | **4** |
| Exil | 1 | **2** |
| Rückkehr | 1 | **2** |
| Jesus & Evangelien | 3 | **4** |
| Frühe Kirche | 3 | **4** |

Neu: **Sinai** (Bund und Gebote), **vierzig Jahre Wüste**, **die Zeit der
Richter**, **Israel will einen König**, **Elia und die Propheten**, **Josias
Reform**, **Hesekiel: Gott zieht mit**, **vierhundert stille Jahre**,
**Johannes der Täufer**, **das Apostelkonzil**.

**Die Prüfung, die dabei entstand — `npm run check:history`**

Drei Angaben je Station verweisen auf etwas anderes, und alle drei scheitern
**still**:

- `places` sind **englische** Namen, zur Laufzeit gegen `places.json`
  aufgelöst. Ein Name, den es nicht gibt, erzeugt keine Fehlermeldung, sondern
  eine Station ohne Orte. Beim Schreiben passiert genau das: „Sinai" löst nicht
  auf (der Berg heißt in den Daten `Mount Sinai`), und „Carmel" trifft den
  Karmel in **Juda** – 140 km vom Berg des Elia entfernt.
- `era` färbt die Station und ordnet sie auf dem Zeitband ein.
- `ref` baut den Link zum Bibeltext. Ich hatte für „1. Samuel 8–10" das Kürzel
  `2Sam` gesetzt: der Link führte ins falsche Buch, und im sichtbaren Text war
  davon nichts zu sehen. Insgesamt sechs solche Verweise, alle beim ersten Lauf
  gefunden.

**Akzeptanzkriterien**
- [x] 30 Stationen, 68 Ortsnamen – **alle** gegen `places.json` aufgelöst.
- [x] Jede Epoche existiert, und die Epochen springen nicht zurück (die
      Stationen stehen chronologisch).
- [x] Jeder Bibellink zeigt auf das Buch und das Kapitel, das im Label
      darübersteht. Ein Kapitel innerhalb einer Spanne gilt – der erste Entwurf
      der Prüfung verlangte die exakte Zahl und meldete vier Fehlalarme
      („1. Mose 6–9" nennt Kapitel 7). Eine Prüfung, die Richtiges anstreicht,
      wird abgeschaltet und prüft danach gar nichts mehr.
- [x] Die Prüfung trägt ihre **eigene Gegenprobe**: sie baut zwei Fehler in
      eine Kopie der Daten ein und bricht ab, wenn sie die nicht findet. Dazu
      eine Untergrenze für Stationen und Orte, unter der sie sich für kaputt
      erklärt.
- [x] Von Hand gegengeprobt: `1Sam` → `2Sam` zurückgedreht, und die Prüfung
      meldet „Link zeigt auf 2. Samuel, im Label steht „1. Samuel 8–10"".
- [x] Im Browser in beiden Sprachen: alle 30 Stationen zeigen **genau so viele
      Orte, wie die Daten nennen**, jeder Link steht auf dem richtigen Buch,
      kein JavaScript-Fehler. (Der erste Messversuch zählte 214–219 „Marker" je
      Station – das waren alle Marker der Karte, nicht die der Station. Eine
      Zahl, die überall gleich ist, misst nichts.)

`npm run check` führt jetzt **10** Prüfungen aus.

### 4.49 Weitere Ansichten (aus parallelen Arbeiten)

Nicht in dieser PRD entstanden, aber Teil der App: **Kirchengeschichte**
(Kirchenväter und Konzilien), **Religionen im Vergleich**, **Stammbäume/
Völkertafel** samt Zeitbaum und Graph, **Reiche & Grenzen** auf der Karte,
Startseite und Seite „Projekte unterstützen".

---

## 5. Nicht-funktionale Anforderungen

- **Performance:** Erstes Bündel 462 kB (gzip 136 kB) – die Ansichten liegen in
  eigenen Dateien und kommen auf Abruf; im Leerlauf werden sie nachgeholt, damit
  die App offline vollständig bleibt. Flüssige Karte bei 1.300+ Markern,
  Bibeltext lazy pro Buch.
- **Responsiv:** nutzbar ab 360 px Breite; Präsentationsmodus stapelt auf Mobile.
- **Barrierefreiheit:** `prefers-reduced-motion` wird beachtet (Karte setzt statt
  zu fliegen, Reisender springt statt zu gleiten, Pulsringe stehen still);
  Escape schließt von außen nach innen; ← / → und Leertaste in den Reisen.
  Kartenmarker sind mit Tabulator erreichbar und mit Enter/Leertaste
  auslösbar. Jedes Bedienelement trägt einen Namen, jede Grafik ist benannt
  oder als Beiwerk gekennzeichnet – geprüft mit `scripts/a11y-audit.mjs` über
  alle vierzehn Ansichten. Drei Sprungmarken („Zur Navigation", „Zur Suche",
  „Zur Karte") stehen am Anfang der Tabulatorreihe und werden erst sichtbar,
  wenn sie den Fokus haben; ohne sie lag die Kopfzeile auf der Karte 208
  Tabulatorschritte entfernt, in „Hören & Sehen" noch weiter. Dieselbe Prüfung
  misst diesen Weg mit und meldet mehr als sechs Tastendrücke als Befund.
- **i18n:** DE/EN vollständig; Architektur erlaubt weitere Sprachen.
- **Lizenz-Compliance:** Attribution für Daten (CC-BY), Bilder (je Bild) und
  Kartenkacheln stets sichtbar.
- **Datenschutz:** keine personenbezogenen Daten, kein Tracking in v1.

---

## 6. Datenmodell (Ist)

```
Place {
  id, name, slug, article, types[]
  lat, lon
  img { url, credit, creditUrl, license } | null
  wikidata, biblia
  variants[]                      // Schreibvarianten
  mentionCount
  verses[] { osis, ref, book, bookNum, chapter, verse, sort }
}
```
Abgeleitet zur Laufzeit: Epochen je Ort (über Buch→Epoche), Bücher je Ort,
Orte je Kapitel. Buch-/Epochen-Metadaten in `src/data/books.ts` & `eras.ts`.

---

## 7. Roadmap / Milestones

| Release | Inhalt | Status |
|---|---|---|
| **v0.1** | Karte, Zeitleiste, Suche, Heatmap, Infokarte, Präsentationsmodus (Links), DE/EN | ✅ erledigt |
| **v0.2** | Bilder-Abdeckung (4.8), kuratierte BP-Videos (4.9), Deployment (4.11) | ✅ erledigt |
| **v1.0** | **Bibeltext eingebettet** (4.7) inkl. Ort-im-Text-Verknüpfung, Tastatur | ✅ erledigt |
| **v0.3** | Suche über Referenzen (4.3/4.15), State in URL (4.15), reduzierte Bewegung + Escape | ✅ erledigt |
| **v0.4** | Reisen & Geschichten (4.12), Mission & Ausbreitung (4.13), Bibelquiz (4.14), Offline (4.16), Handout (4.17), Nachbarorte (4.18), Code-Splitting | ✅ erledigt |
| **v0.5** | Hören & Sehen als eigener Modus (4.19) mit Verknüpfung in beide Richtungen | ✅ erledigt |
| **v0.6** | Bildnachweis mit Lizenz (4.20) | ✅ erledigt |
| **v0.7** | Buchkürzel an einer Stelle (4.21) | ✅ erledigt |
| **v0.8** | Medien-Index: Sendedaten und Umlaute (4.22) | ✅ erledigt |
| **v0.9** | Gelände in 3D mit MapLibre (4.23) | ✅ erledigt |

---

## 8. Erfolgskriterien (qualitativ)

- Ein:e Nutzer:in findet einen Ort über die Suche und versteht in < 30 s, *wo* und
  *wann* er vorkommt.
- Eine Lehrkraft kann ein Buch (z. B. 2. Könige) im Präsentationsmodus ohne
  Vorbereitung durchführen.
- Die Heatmap macht die „Schwerpunkte" der Bibel auf einen Blick sichtbar.

---

## 9. Entscheidungen (getroffen)

1. **Bibelübersetzung:** Luther 1912 (DE) + World English Bible (EN), beide gemeinfrei. ✅
2. **Hosting:** GitHub Pages mit automatischem Deploy. ✅
3. **Datierung:** konservative Chronologie mit Jahreszahlen beibehalten. ✅
4. **Bildquellen:** Wikidata-`P18`-Fallback (zur Laufzeit). ✅

## 10. Offene Punkte (v0.3)

- BibleProject-Guide-Slugs sind weiter heuristisch (`book-of-<name>` +
  Ausnahmen in `src/data/bpGuides.json`). **`npm run check:bp` klopft die 63
  Adressen ab** und meldet, welche ins Leere zeigen; ein Fund wird in
  `bpGuides.json` eingetragen. In der Entwicklungsumgebung ist bibleproject.com
  gesperrt – der Lauf endet dort mit „unentschieden", nicht mit einem Befund.
  Offen bleibt der Punkt also, bis jemand das Skript mit Netzzugriff laufen
  lässt.
