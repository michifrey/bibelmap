# Straßen: was hier liegt und was nicht

## `pruefnetz.geojson` – **erfunden**

Drei Linienzüge zwischen Jericho, Betanien und Ephraim, von Hand gesetzt. Sie
sind **kein historischer Verlauf** und keine Behauptung über römische Straßen.
Sie sind ein Prüfstand: `npm run check:roads` lässt `scripts/build-roads.mjs`
darüber laufen und prüft, dass die Wegsuche tut, was sie soll –

* eine Station findet ihren Anschluss ans Netz,
* der gefundene Weg beginnt und endet an den Stationen,
* er ist **länger als die Luftlinie** (sonst folgte er dem Netz gar nicht;
  Prüfstrecke A hat dafür eigens einen Bogen nach Süden),
* eine Station ohne Verbindung (Prüfstrecke C liegt für sich) bekommt keinen
  Weg, sondern behält ihre Luftlinie,
* und die Polylinien-Kodierung kommt unverändert zurück.

Ein erfundenes Netz ist dafür das richtige Werkzeug: Die Prüfung soll den
**Weg-Sucher** messen, nicht den Datensatz. Ein Fehler in der Suche sähe in
echten Daten aus wie eine Lücke in den Daten – hier nicht.

## Die echten Straßen liegen nicht hier

`public/data/roads.json` entsteht aus einem Straßendatensatz, den dieses
Projekt **nicht mitliefert** – so wie `places.json` aus dem OpenBible-Datensatz
entsteht, der auch nicht hier liegt:

```
ROADS=/pfad/zu/itinere_roads.geojson npm run roads
```

Empfohlen ist **Itiner-e** (de Soto u. a. 2025, *Scientific Data*), rund 15.000
Straßenabschnitte des römischen Reiches unter **CC BY 4.0**:
<https://itiner-e.org>.

**Nicht geeignet**, obwohl es leichter zu bekommen ist: das Straßennetz aus dem
Barrington-Atlas (DARMC / AWMC und die davon abgeleiteten Ablagen). Es steht
unter **CC BY-NC** – nicht-kommerziell –, und ein solcher Datensatz passt nicht
in ein Projekt unter GPL-3.0, dessen Quellen sonst ausnahmslos frei sind: Er
nähme denen, die diese Seite weiterverwenden, Rechte, die die Lizenz ihnen
zusagt.

Wer eine andere Datei einsetzt, trägt ihre Herkunft mit ein; sie steht danach
in `roads.json` und muss auf der Nachweisseite stehen:

```
ROADS=… ROADS_NAME="…" ROADS_URL="…" ROADS_LICENSE="CC-BY-4.0" npm run roads
```
