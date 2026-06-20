# PRD – Bibelmap

**Produkt:** Bibelmap – interaktive Karte, Zeitleiste und Präsentationsmodus für biblische Orte
**Version:** 1.0 (Entwurf)
**Stand:** 2026-06-20
**Owner:** Michi Frey
**Status:** v0.1 implementiert · Roadmap v0.2–v1.0 offen

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
- [ ] *(v0.2)* Tastatur-Fokus auf Marker möglich (a11y).

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
- [ ] *(v0.3)* Optionaler **kumulativer Modus** („alles bis zu diesem Zeitpunkt") +
      Hervorhebung neu hinzukommender Orte.

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
- [ ] *(v0.3)* Suche auch über Bibelstellen-Referenz (z. B. „2Kön 5").

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
- [ ] *(v0.3)* Vollbild-/„Beamer"-Layout (Text größer, Karte optional ausblendbar).

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
- [ ] *(v0.3)* Sprachwahl wird in der URL/LocalStorage gemerkt.

### 4.11 Deployment & Betrieb — P0 ✅ *(Workflow steht; Pages-Aktivierung durch Nutzer)*

**Akzeptanzkriterien**
- [x] Automatischer Deploy des Default-Branch via `.github/workflows/deploy.yml`.
- [x] `base`/`BASE_URL` korrekt für Unterpfad (`VITE_BASE=/bibelmap/`); Datenpfade
      nutzen `import.meta.env.BASE_URL`.
- [ ] Einmalig: *Settings → Pages → Source: GitHub Actions* aktivieren (Nutzer).
- [ ] Lighthouse-Messung ≥ 90 (nach erstem Deploy verifizieren).

---

## 5. Nicht-funktionale Anforderungen

- **Performance:** Initiale Daten ≤ ~1,5 MB (gzip); flüssige Karte bei 1.300+ Markern.
  Bibeltext lazy nachladen.
- **Responsiv:** nutzbar ab 360 px Breite; Präsentationsmodus stapelt auf Mobile.
- **Barrierefreiheit (Ziel v0.3):** Tastaturbedienung, sichtbarer Fokus,
  ausreichende Kontraste, Alt-Texte.
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
| **v0.3** | a11y/Fokus, „Beamer"-Layout, kumulative Zeitleiste, Suche über Referenzen, State in URL | ⬜ offen |

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

- Lizenz je Wikidata-Bild aktuell nicht angezeigt (nur „Wikimedia Commons" +
  Link zur Dateiseite, wo die Lizenz steht).
- BibleProject-Guide-Slugs sind heuristisch (`book-of-<name>` + Gruppen-Override);
  einzelne selten gruppierte Bücher könnten ins Leere zeigen → bei Bedarf in
  `bibleProjectUrl` nachpflegen.
- „Beamer"-Layout, Fokus-/Tastatur-a11y, State in URL, kumulative Zeitleiste.
