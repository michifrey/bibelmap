import L from 'leaflet';
import { BASEMAPS, DEFAULT_BASEMAP, type BasemapId } from './basemaps';

/*
 * Die Leaflet-Seite der Kachelquellen, getrennt vom Katalog.
 *
 * `basemaps.ts` ist Daten: Adressen, Namen, Zoomstufen, Nachweiszeilen – und
 * `App.tsx` liest daraus nur `DEFAULT_BASEMAP`, `fallbackFor` und einen Typ.
 * Solange `addBasemap` in derselben Datei stand, zog dieser eine Import die
 * 145 kB Leaflet in das Bündel, das jeder Besuch der Startseite lädt – einer
 * Startseite, die gar keine Karte zeigt.
 *
 * Die Kacheladressen bleiben drüben: `npm run check:tiles` liest genau diese
 * eine Datei und besteht darauf, dass keine zweite welche enthält.
 */

/**
 * Kachelebene anlegen, Filter setzen und der Karte sagen, ob ihr Untergrund
 * hell oder dunkel ist.
 *
 * Das Letzte ist keine Kleinigkeit: Die App zeichnet ihre eigenen
 * Beschriftungen auf die Karte – Stammesnamen, Städte, Länder, Gewässer –, und
 * die waren alle für den dunklen Untergrund gemacht, weiß mit dunklem Schein.
 * Auf heller Kachel wären sie unsichtbar. `bm-light-tiles` am Behälter dreht
 * sie um (siehe index.css).
 */
export function addBasemap(
  map: L.Map,
  id: BasemapId,
  opts: { maxZoom?: number } = {},
): L.TileLayer {
  const bm = BASEMAPS[id] ?? BASEMAPS[DEFAULT_BASEMAP];
  const layer = L.tileLayer(bm.url, {
    subdomains: bm.subdomains ?? '',
    maxZoom: opts.maxZoom ?? bm.maxZoom,
    maxNativeZoom: bm.maxNativeZoom,
  }).addTo(map);
  layer.getContainer()?.style.setProperty('filter', bm.filter ?? 'none');

  /*
   * Umgeschaltet wird erst, wenn wirklich eine helle Kachel da ist.
   *
   * Sonst geht es genau dann schief, wenn die App ihre beste Seite zeigen
   * soll: ohne Netz kommt keine Kachel, der Untergrund bleibt die dunkle
   * Bühne – und die dunkle Schrift, die für die helle Karte gedacht war,
   * steht unlesbar darauf. Offline ist bei dieser App kein Sonderfall,
   * sondern eine zugesagte Eigenschaft.
   *
   * Also: Klasse erst nach der ersten geladenen Kachel, und wieder herunter,
   * wenn eine Reihe von Fehlern zeigt, dass keine mehr kommt.
   */
  map.getContainer().classList.remove('bm-light-tiles');
  if (!bm.dark) {
    let geladen = 0;
    let fehler = 0;
    layer.on('tileload', () => {
      geladen++;
      fehler = 0;
      map.getContainer().classList.add('bm-light-tiles');
    });
    layer.on('tileerror', () => {
      fehler++;
      if (geladen === 0 && fehler >= 6) map.getContainer().classList.remove('bm-light-tiles');
    });
  }
  return layer;
}
