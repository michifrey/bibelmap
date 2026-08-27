import L from 'leaflet';
import type { Lang } from '../i18n';
import { attr, ORTE_ATTR, OSM_ATTR } from './mapAttribution';

/**
 * Die Kachelquellen dieser App – an einer Stelle.
 *
 * Vorgeschichte: Die helle und die dunkle Karte kamen von CARTO, und zwar aus
 * FÜNF verschiedenen Dateien heraus – `MapView` hatte sie in `BASEMAPS`, und
 * `RouteMap`, `ChurchMode`, `QuizMode` und `MissionMap` trugen jede ihre eigene
 * Kopie derselben Adresse. Als CARTO im August 2026 einen Schlüssel zu
 * verlangen begann, war deshalb nicht eine Zeile zu ändern, sondern fünf – und
 * bis dahin waren alle sieben Karten leer.
 *
 * Jetzt steht jede Adresse genau hier, und jede Karte holt sie sich mit
 * `addBasemap()`. Die nächste Quelle, die dichtmacht, ist eine Zeile.
 *
 * ALLE QUELLEN SIND SCHLÜSSELFREI. Das ist die Bedingung, nach der sie gewählt
 * sind: OpenStreetMap liefert ohne Anmeldung aus, EOX und DARE ebenso. Eine
 * Karte, die einen Schlüssel braucht, bindet ein Hobbyprojekt an ein Konto und
 * an eine Rechnung.
 */

export type BasemapId = 'light' | 'dark' | 'satellite' | 'relief' | 'antique';

export interface Basemap {
  url: string;
  attribution: { de: string; en: string };
  maxZoom: number;
  maxNativeZoom?: number;
  subdomains?: string;
  /** Die Kachel selbst ist dunkel – Beschriftungen darüber müssen hell sein. */
  dark?: boolean;
  /** CSS-Filter auf die Kacheln (Leaflet); MapLibre siehe `DARK_RASTER_PAINT`. */
  filter?: string;
  /** Ohne Beschriftung – das Quiz braucht genau das. */
  unlabelled?: boolean;
}

const OB = ORTE_ATTR;

/**
 * Aus der hellen Karte eine dunkle rechnen.
 *
 * Es gibt keine frei zugängliche dunkle Rasterkarte ohne Schlüssel – CARTO,
 * Stadia und Esri verlangen alle eines. Statt dafür ein Konto anzulegen, wird
 * dieselbe OpenStreetMap-Kachel umgerechnet: `invert` macht aus hellem Land
 * dunkles, `hue-rotate(180deg)` dreht die dabei verdrehten Farbtöne zurück, so
 * dass Wasser wieder blau ist und Wald wieder grün. Der Rest dämpft, was durch
 * das Invertieren zu grell wird.
 *
 * Das ist ein Zugeständnis und sieht nicht so gut aus wie eine gezeichnete
 * Nachtkarte. Es kostet dafür keinen Schlüssel und keine Abhängigkeit.
 */
const DARK_FILTER = 'invert(1) hue-rotate(185deg) brightness(0.92) contrast(0.9) saturate(0.6)';

/**
 * Dieselbe Umrechnung für MapLibre – die Geländeansicht zeichnet ihre
 * Kacheln nicht als Bilder in einen Behälter, sondern auf eine Leinwand, und
 * ein CSS-Filter träfe dort auch Orte, Route und Beschriftung. MapLibre kann
 * es selbst, wenn auch mit anderen Reglern: Umkehren heißt hier, die
 * Helligkeitsspanne rückwärts anzugeben (min 1, max 0). Der Rest entspricht
 * `DARK_FILTER` Regler für Regler.
 *
 * Ohne das wäre der 3D-Blick der einzige Ort, an dem „Nachtkarte" eine helle
 * Karte zeigt – ein Kartenstil, der in einer von acht Ansichten nicht gilt,
 * ist kein Kartenstil.
 */
export const DARK_RASTER_PAINT = {
  'raster-brightness-min': 1,
  'raster-brightness-max': 0,
  'raster-hue-rotate': 185,
  'raster-saturation': -0.4,
  'raster-contrast': -0.1,
} as const;

/**
 * Und wieder zurück: MapLibres Vorgaben, ausgeschrieben. Wer von der
 * Nachtkarte auf den Satelliten wechselt, bekommt sonst ein umgekehrtes
 * Satellitenbild – ein gesetzter Regler bleibt gesetzt, bis ihn jemand
 * zurückstellt.
 */
export const PLAIN_RASTER_PAINT: Record<keyof typeof DARK_RASTER_PAINT, number> = {
  'raster-brightness-min': 0,
  'raster-brightness-max': 1,
  'raster-hue-rotate': 0,
  'raster-saturation': 0,
  'raster-contrast': 0,
};

export const BASEMAPS: Record<BasemapId, Basemap> = {
  // Die Vorgabe. Sie zeigt Beschriftungen und Straßen, wie eine Karte sie
  // zeigen soll, und sie kommt von der Quelle, die auch die Daten liefert.
  light: {
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: OSM_ATTR,
    maxZoom: 19,
    subdomains: '',
  },
  dark: {
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: OSM_ATTR,
    maxZoom: 19,
    subdomains: '',
    dark: true,
    filter: DARK_FILTER,
  },
  // Satellit und Relief kommen von EOX (maps.eox.at): beide unter CC-BY 4.0
  // frei nutzbar, beide ohne Beschriftung. Die WMTS-Adresse ist RESTful und
  // zählt Zeile vor Spalte: .../default/g/{z}/{y}/{x}.jpg.
  satellite: {
    url: 'https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2020_3857/default/g/{z}/{y}/{x}.jpg',
    attribution: {
      de: `Sentinel-2 cloudless 2020 &copy; <a href="https://s2maps.eu">EOX IT Services</a> (modifizierte Copernicus-Sentinel-Daten 2020, CC-BY) ${OB.de}`,
      en: `Sentinel-2 cloudless 2020 &copy; <a href="https://s2maps.eu">EOX IT Services</a> (modified Copernicus Sentinel data 2020, CC-BY) ${OB.en}`,
    },
    // Die Aufnahmen lösen 10 m auf – ab Stufe 14 wird vergrößert statt
    // nachgeladen, sonst liefe die Karte in leere Kacheln.
    maxZoom: 18,
    maxNativeZoom: 14,
    subdomains: '',
    dark: true,
    unlabelled: true,
  },
  relief: {
    url: 'https://tiles.maps.eox.at/wmts/1.0.0/terrain-light_3857/default/g/{z}/{y}/{x}.jpg',
    attribution: {
      de: `Terrain Light &copy; <a href="https://maps.eox.at">EOX</a> · Daten: OpenStreetMap-Mitwirkende, SRTM, Natural Earth (CC-BY) ${OB.de}`,
      en: `Terrain Light &copy; <a href="https://maps.eox.at">EOX</a> · Data: OpenStreetMap contributors, SRTM, Natural Earth (CC-BY) ${OB.en}`,
    },
    maxZoom: 14,
    maxNativeZoom: 12,
    subdomains: '',
    unlabelled: true,
  },
  antique: {
    // Digital Atlas of the Roman Empire (DARE / „Imperium"), Univ. Göteborg.
    url: 'https://dh.gu.se/tiles/imperium/{z}/{x}/{y}.png',
    attribution: {
      de: `Historische Karte &copy; <a href="https://imperium.ahlfeldt.se/">DARE</a> (Univ. Göteborg, CC-BY) ${OB.de}`,
      en: `Historical map &copy; <a href="https://imperium.ahlfeldt.se/">DARE</a> (Univ. of Gothenburg, CC-BY) ${OB.en}`,
    },
    maxZoom: 14,
    maxNativeZoom: 11,
  },
};

/** Die Vorgabe für jede Karte dieser App. */
export const DEFAULT_BASEMAP: BasemapId = 'light';

/**
 * Höhendaten für die Geländeansicht – keine Grundkarte, aber dieselbe Art von
 * Abhängigkeit, und deshalb hier.
 *
 * Die Terrain Tiles sind aus SRTM und weiteren Vermessungen gebaut und liegen
 * bei AWS offen; die Höhe steckt in den Farbwerten („terrarium"), MapLibre
 * rechnet sie zurück. Auch das ohne Schlüssel und ohne Anmeldung – genau die
 * Bedingung, an der CARTO gescheitert ist.
 */
export const DEM_TILES = 'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png';

export const DEM_ATTR: { de: string; en: string } = {
  de: 'Höhen: <a href="https://registry.opendata.aws/terrain-tiles/">Terrain Tiles</a> (AWS Open Data, SRTM u. a.)',
  en: 'Elevation: <a href="https://registry.opendata.aws/terrain-tiles/">Terrain Tiles</a> (AWS Open Data, SRTM et al.)',
};

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

/** Die Zeile unter der Karte, in der gewählten Sprache. */
export function basemapAttr(id: BasemapId, lang: Lang): string {
  return attr((BASEMAPS[id] ?? BASEMAPS[DEFAULT_BASEMAP]).attribution, lang);
}

/**
 * Worauf ausweichen, wenn ein Kachelserver stumm bleibt?
 *
 * Solange die dunkle Karte von CARTO kam und die helle auch, war die Antwort
 * einfach: zurück auf die Vorgabe. Jetzt teilen sich hell und dunkel denselben
 * Server – ein Ausweichen von der einen auf die andere wechselte nur das
 * Aussehen und liefe in denselben Fehler. Deshalb wird der Rechnername
 * verglichen: Kommt die ausgefallene Karte ohnehin von dort, wo auch die
 * Vorgabe herkommt, ist nicht ein Anbieter stumm, sondern das Netz – dann gibt
 * es nichts, worauf man ausweichen könnte, und es bleibt beim Hinweis.
 */
export function fallbackFor(id: BasemapId): BasemapId | null {
  if (id === DEFAULT_BASEMAP) return null;
  const host = (u: string) => u.replace(/^https?:\/\//, '').split('/')[0];
  if (host(BASEMAPS[id]?.url ?? '') === host(BASEMAPS[DEFAULT_BASEMAP].url)) return null;
  return DEFAULT_BASEMAP;
}
