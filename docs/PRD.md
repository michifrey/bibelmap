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
- [x] Verlinkbar: `#hoeren`, `#hoeren=<quelle>`, `#hoeren=ort,<ortsid>`.
- [x] Ehrlich bleiben: eine genannte Bibelstelle ist nicht zwingend das Thema
      der Folge – der Hinweis steht unter der Liste, nicht im Kleingedruckten.

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

### 4.21 Weitere Ansichten (aus parallelen Arbeiten)

Nicht in dieser PRD entstanden, aber Teil der App: **Heilsgeschichte-Modus**
(geführte Stationen von der Schöpfung bis zur neuen Welt), **Kirchengeschichte**
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
  alle zwölf Ansichten.
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
| **offen** | 3-D-Gelände (MapLibre) | ⬜ offen |

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

- BibleProject-Guide-Slugs sind heuristisch (`book-of-<name>` + Gruppen-Override);
  einzelne selten gruppierte Bücher könnten ins Leere zeigen → bei Bedarf in
  `bibleProjectUrl` nachpflegen.
- **3-D-Gelände**: Leaflet kann die Karte nicht kippen. Ein Umstieg auf MapLibre
  würde Terrain und Neigung erlauben, betrifft aber alle fünf Kartenansichten –
  bewusst zurückgestellt.
- Die Kurzformen der Bibelbücher stehen zweimal im Repo (`src/lib/parseRef.ts`
  für die Oberfläche, `scripts/lib/bibleref.mjs` für den Build).
