// Die Wege, die es wirklich gab.
//
// Bis hierher ist jede Etappe dieser App eine **Luftlinie**: Zwischen zwei
// Stationen steht eine gerade Linie, und `README.md` sagt seit jeher dazu, dass
// die tatsächlichen Wege länger waren. Diese Datei ist der Anfang vom Ende
// dieses Satzes – wo ein Straßenverlauf belegt ist, folgt der Weg ihm.
//
// **Was hier nicht steht: die Straßen selbst.** Ein Straßennetz des römischen
// Reiches sind zehntausende Segmente, und kein Browser soll sie laden, um
// fünfzehn Reisen zu zeigen. Die Wegsuche läuft deshalb einmal beim Bauen
// (`npm run roads`, `scripts/build-roads.mjs`), und hier kommt nur das
// Ergebnis an: je Etappe eine fertige Punktkette, kodiert als Polylinie.
//
// **Die Datei darf fehlen.** Sie entsteht nur, wenn jemand den Straßendatensatz
// zur Hand hat – wie `places.json` aus dem OpenBible-Datensatz entsteht. Fehlt
// sie, bleibt alles, wie es war: Luftlinien, unmarkiert, ohne Fehlermeldung.
// Deshalb gibt jede Funktion hier `null` zurück und wirft nicht.

import type { LatLon } from './route';
import { decodePolyline } from './polyline';

/** Woher die Straßen kommen – die Zeile, die unter der Karte stehen muss. */
export interface RoadSource {
  name: string;
  url: string;
  /** Lizenzkürzel wie in `attribution.ts`, etwa `CC-BY-4.0`. */
  license: string;
  /** Stand des Datensatzes, wie ihn die Quelle selbst nennt. */
  stand?: string;
}

export interface RoadsData {
  quelle: RoadSource;
  netz: { segmente: number; knoten: number; km: number };
  /**
   * Je Route (`journeys.ts`, `mission.ts`, `jesus-<akt>`) die Etappen in
   * derselben Reihenfolge wie die Stationen. `null` heißt: für diese Etappe
   * gibt es keinen Verlauf – Luftlinie.
   */
  wege: Record<
    string,
    {
      legs: (string | null)[];
      /** Länge des Weges über die Straßen, in Kilometern. */
      km: number;
      /** Dieselbe Strecke als Luftlinie – der Vergleich ist die Aussage. */
      luftKm: number;
      /**
       * Ob die Reise in römischer Zeit spielt. Ist sie älter, ist das Netz
       * tausend Jahre jünger als die Geschichte, und die Oberfläche sagt es:
       * die Trasse folgt dem Gelände, die Straße ist die spätere.
       */
      roemisch: boolean;
    }
  >;
}

let cache: Promise<RoadsData | null> | null = null;

/**
 * Die Wegdatei holen. Höchstens einmal je Sitzung, und ein Fehlschlag ist
 * keiner: Ohne Datei ist die Antwort `null` und die App zeigt Luftlinien.
 */
export function loadRoads(): Promise<RoadsData | null> {
  if (!cache) {
    cache = fetch(`${import.meta.env.BASE_URL}data/roads.json`)
      .then((r) => (r.ok ? (r.json() as Promise<RoadsData>) : null))
      .catch(() => null);
  }
  return cache;
}

/** Was zu einer Route in der Datei steht – oder `null`, wenn sie fehlt. */
export function roadRoute(data: RoadsData | null, routeId: string) {
  return data?.wege[routeId] ?? null;
}

/**
 * Die Etappen einer Route als Punktketten – `null` je Etappe ohne Verlauf,
 * `null` insgesamt, wenn die Route nicht in der Datei steht.
 */
export function legsFor(data: RoadsData | null, routeId: string): (LatLon[] | null)[] | null {
  const weg = data?.wege[routeId];
  if (!weg) return null;
  return weg.legs.map((s) => (s ? decodePolyline(s) : null));
}
