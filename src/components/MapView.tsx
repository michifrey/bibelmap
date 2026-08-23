import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { localizeMap } from '../lib/mapLocale';
import { watchTiles } from '../lib/tileNotice';
import { enableMarkerKeyboard, markVectorsDecorative } from '../lib/mapKeyboard';
import { flyOptions } from '../lib/motion';
import 'leaflet.markercluster';
import 'leaflet.heat';
import type { Place } from '../types';
import { erasForPlace, placeName } from '../lib/places';
import { ERA_BY_ID } from '../data/eras';
import { buildPlacePopup } from '../lib/placePopup';
import type { Lang } from '../i18n';
import { loadBorders, politiesAt, polityColor, polityName } from '../lib/borders';

interface Props {
  places: Place[];
  heat: boolean;
  selectedId: string | null;
  lang: Lang;
  onSelect: (p: Place) => void;
  /** Base map style. */
  basemap?: BasemapId;
  /** Der gewählte Kachelserver liefert nichts – die Ansicht soll zurückfallen. */
  onTilesUnavailable?: (id: BasemapId) => void;
  /** Derselbe Server liefert wieder – die Meldung darf weg. */
  onTilesRecovered?: (id: BasemapId) => void;
  /** Fit the map to exactly these places (presentation mode). */
  fitPlaces?: Place[] | null;
  /** Fly to a single coordinate (search focus). */
  flyTo?: { lat: number; lon: number; zoom?: number; key: number } | null;
  /** Draw the empires of this year underneath the places; null = off. */
  borderYear?: number | null;
  /**
   * Kumulative Zeitleiste: Orte, die in der gewählten Epoche neu vorkommen.
   * Alles andere ist „schon vorher da" und tritt zurück.
   */
  newIds?: Set<string> | null;
}

export type BasemapId = 'dark' | 'light' | 'satellite' | 'relief' | 'antique';

export interface Basemap {
  url: string;
  attribution: string;
  maxZoom: number;
  maxNativeZoom?: number;
  subdomains?: string;
  dark?: boolean;
}

const OB_ATTR = '· Orte: <a href="https://www.openbible.info/geo/">OpenBible.info</a> (CC-BY)';

export const BASEMAPS: Record<BasemapId, Basemap> = {
  // The default. A light basemap under a dark shell reads as two designs
  // stacked on each other; the era colours also only sing against dark.
  dark: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a> ' + OB_ATTR,
    maxZoom: 17,
    subdomains: 'abcd',
    dark: true,
  },
  light: {
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a> ' + OB_ATTR,
    maxZoom: 19,
    subdomains: 'abcd',
  },
  // Satellit und Relief kommen von EOX (maps.eox.at), nicht mehr von Esri:
  // beide unter CC-BY 4.0 frei nutzbar, beide ohne Beschriftung – und damit
  // ohne die Nutzungsbedingungen, die Esri für Karten außerhalb eines
  // ArcGIS-Kontos verlangt. Die WMTS-Adresse ist RESTful und zählt Zeile vor
  // Spalte: .../default/g/{z}/{y}/{x}.jpg.
  satellite: {
    url: 'https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2020_3857/default/g/{z}/{y}/{x}.jpg',
    attribution:
      'Sentinel-2 cloudless 2020 &copy; <a href="https://s2maps.eu">EOX IT Services</a> (modifizierte Copernicus-Sentinel-Daten 2020, CC-BY) ' +
      OB_ATTR,
    // Die Aufnahmen lösen 10 m auf – ab Stufe 14 wird vergrößert statt
    // nachgeladen, sonst liefe die Karte in leere Kacheln.
    maxZoom: 18,
    maxNativeZoom: 14,
    subdomains: '',
    dark: true,
  },
  relief: {
    url: 'https://tiles.maps.eox.at/wmts/1.0.0/terrain-light_3857/default/g/{z}/{y}/{x}.jpg',
    attribution:
      'Terrain Light &copy; <a href="https://maps.eox.at">EOX</a> · Daten: OpenStreetMap-Mitwirkende, SRTM, Natural Earth (CC-BY) ' +
      OB_ATTR,
    maxZoom: 14,
    maxNativeZoom: 12,
    subdomains: '',
  },
  antique: {
    // Digital Atlas of the Roman Empire (DARE / "Imperium"), Univ. of Gothenburg.
    url: 'https://dh.gu.se/tiles/imperium/{z}/{x}/{y}.png',
    attribution:
      'Historische Karte &copy; <a href="https://imperium.ahlfeldt.se/">DARE</a> (Univ. Göteborg, CC-BY) ' + OB_ATTR,
    maxZoom: 14,
    maxNativeZoom: 11,
  },
};

function primaryEraColor(p: Place): string {
  const eras = erasForPlace(p);
  // earliest era defines the dot colour
  let best: { order: number; color: string } | null = null;
  for (const id of eras) {
    const e = ERA_BY_ID[id];
    if (e && (!best || e.order < best.order)) best = { order: e.order, color: e.color };
  }
  return best?.color ?? '#1f3d3a';
}

function markerSize(p: Place): number {
  const m = p.mentionCount;
  if (m >= 200) return 26;
  if (m >= 60) return 22;
  if (m >= 20) return 18;
  if (m >= 5) return 15;
  return 12;
}

/**
 * `earlier` heißt: in der kumulativen Ansicht war der Ort schon vorher da. Er
 * bleibt sichtbar, tritt aber zurück – neu Hinzugekommenes soll auffallen.
 */
function makeIcon(p: Place, focused: boolean, earlier = false): L.DivIcon {
  const full = markerSize(p);
  const size = earlier ? Math.max(9, Math.round(full * 0.65)) : full;
  const color = primaryEraColor(p);
  const label = !earlier && p.mentionCount >= 20 ? `<span>${p.mentionCount}</span>` : '';
  return L.divIcon({
    className: '',
    html: `<div class="bm-marker ${focused ? 'bm-marker--focus' : ''} ${earlier ? 'bm-marker--earlier' : ''}" style="background:${color};width:${size}px;height:${size}px">${label}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

export default function MapView({
  places,
  newIds,
  heat,
  selectedId,
  lang,
  onSelect,
  basemap = 'light',
  onTilesUnavailable,
  onTilesRecovered,
  fitPlaces,
  flyTo,
  borderYear = null,
}: Props) {
  const mapEl = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileRef = useRef<L.TileLayer | null>(null);
  const clusterRef = useRef<L.MarkerClusterGroup | null>(null);
  const heatRef = useRef<L.Layer | null>(null);
  const borderRef = useRef<L.LayerGroup | null>(null);
  const borderLabels = useRef<{ marker: L.Marker; area: number }[]>([]);
  const markerById = useRef<Map<string, L.Marker>>(new Map());
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  const onTilesUnavailableRef = useRef(onTilesUnavailable);
  onTilesUnavailableRef.current = onTilesUnavailable;
  const onTilesRecoveredRef = useRef(onTilesRecovered);
  onTilesRecoveredRef.current = onTilesRecovered;
  const placesRef = useRef(places);
  placesRef.current = places;
  const langRef = useRef(lang);
  langRef.current = lang;

  // init map once
  useEffect(() => {
    if (!mapEl.current || mapRef.current) return;
    const map = L.map(mapEl.current, {
      center: [31.5, 35.4],
      zoom: 7,
      minZoom: 2,
      maxZoom: 17,
      zoomControl: true,
      worldCopyJump: true,
    });
    // The empire overlay lives between the tiles (200) and the place markers
    // (600): territory is background for the places, never on top of them.
    map.createPane('bmBorders').style.zIndex = '350';
    map.createPane('bmBorderLabels').style.zIndex = '380';
    map.getPane('bmBorderLabels')!.style.pointerEvents = 'none';
    mapRef.current = map;
    const offKeys = enableMarkerKeyboard(map.getContainer(), (el) => {
      // Ein Ortsmarker: denselben Weg gehen wie ein Klick.
      for (const [id, marker] of markerById.current) {
        if (marker.getElement() === el) {
          const place = placesRef.current.find((p) => p.id === id);
          if (place) onSelectRef.current(place);
          return;
        }
      }
      // Sonst ein Cluster: an dieser Stelle hineinzoomen.
      const box = el.getBoundingClientRect();
      const frame = map.getContainer().getBoundingClientRect();
      const point = L.point(box.left - frame.left + box.width / 2, box.top - frame.top + box.height / 2);
      map.setZoomAround(map.containerPointToLatLng(point), map.getZoom() + 2);
    });
    return () => {
      offKeys();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Leaflet beschriftet Zoom und Fenster selbst – auf Englisch. Diese eine
  // Zeile holt die Namen aus derselben Sprachdatei wie der Rest.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    return localizeMap(map, lang);
  }, [lang]);

  // basemap tile layer (swappable)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const bm = BASEMAPS[basemap] ?? BASEMAPS.dark;
    if (tileRef.current) map.removeLayer(tileRef.current);
    const layer = L.tileLayer(bm.url, {
      attribution: bm.attribution,
      subdomains: bm.subdomains ?? 'abc',
      maxZoom: bm.maxZoom,
      maxNativeZoom: bm.maxNativeZoom ?? bm.maxZoom,
    });
    /*
     * Fremde Kachelserver können ausfallen – und eine Karte ohne Kacheln sieht
     * aus wie ein Fehler der App. Kommt von einem Stil gar nichts an, während
     * es reihenweise Fehler hagelt, sagen wir Bescheid; die Ansicht fällt dann
     * auf die Karte zurück, die sicher da ist. Kommt später doch etwas an –
     * das Netz war nur kurz weg –, nehmen wir die Meldung zurück, statt einen
     * Hinweis über einer funktionierenden Karte stehen zu lassen.
     */
    let failures = 0;
    let reported = false;
    const onLoad = () => {
      failures = 0;
      if (!reported) return;
      reported = false;
      onTilesRecoveredRef.current?.(basemap);
    };
    const onError = () => {
      failures += 1;
      if (reported || failures < 6) return;
      reported = true;
      onTilesUnavailableRef.current?.(basemap);
    };
    layer.on('tileload', onLoad);
    layer.on('tileerror', onError);
    layer.addTo(map);
    /*
     * Sagt es selbst, wenn es niemand anders tut. Die Hauptkarte meldet den
     * Ausfall nach oben (`onTilesUnavailable`) und bekommt dort einen Hinweis
     * samt Rückfall auf die Nachtkarte. Im Entdeckermodus, im Vergleich und in
     * der Heilsgeschichte hängt dieselbe Karte ohne diesen Draht – dort blieb
     * die Fläche grau und stumm.
     */
    const eigenerHinweis = onTilesUnavailableRef.current
      ? null
      : watchTiles(layer, map, langRef.current);
    tileRef.current = layer;
    tileRef.current.setZIndex(0);
    const c = map.getContainer();
    c.classList.toggle('bm-dark', !!bm.dark);
    // Ohne Abmelden feuern die noch laufenden Kachelabrufe einer längst
    // abgelegten Ebene weiter – und melden einen Stil, den niemand mehr sieht.
    return () => {
      layer.off('tileload', onLoad);
      layer.off('tileerror', onError);
      eigenerHinweis?.();
    };
  }, [basemap]);

  // (re)build markers / heat when data or mode changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // clear old layers
    if (clusterRef.current) {
      map.removeLayer(clusterRef.current);
      clusterRef.current = null;
    }
    if (heatRef.current) {
      map.removeLayer(heatRef.current);
      heatRef.current = null;
    }
    markerById.current.clear();

    if (heat) {
      const pts = places.map(
        (p) => [p.lat, p.lon, Math.min(1, Math.log10(p.mentionCount + 1) / 3)] as [number, number, number],
      );
      // @ts-expect-error heatLayer is added by the leaflet.heat plugin
      heatRef.current = L.heatLayer(pts, {
        radius: 26,
        blur: 22,
        maxZoom: 10,
        minOpacity: 0.35,
        gradient: { 0.2: '#2f6f66', 0.45: '#e0a449', 0.7: '#c2812a', 1.0: '#b0436b' },
      }).addTo(map);
      return;
    }

    const cluster = L.markerClusterGroup({
      maxClusterRadius: 45,
      showCoverageOnHover: false,
      iconCreateFunction: (c) => {
        const n = c.getChildCount();
        const size = n >= 100 ? 46 : n >= 20 ? 40 : 34;
        return L.divIcon({
          html: `<div class="bm-cluster" style="width:${size}px;height:${size}px">${n}</div>`,
          className: '',
          iconSize: [size, size],
        });
      },
    });
    for (const p of places) {
      const marker = L.marker([p.lat, p.lon], {
        icon: makeIcon(p, p.id === selectedId, newIds ? !newIds.has(p.id) : false),
        title: placeName(p, lang),
      });
      // Rich on-map popup (thumbnail, passages, links) – built lazily on open so
      // we never construct ~1.3k DOM trees up front, and always in the current
      // language. The "details" button hands off to the full side panel.
      marker.bindPopup(
        () =>
          buildPlacePopup(p, langRef.current, () => {
            onSelectRef.current(p);
            mapRef.current?.closePopup();
          }),
        { maxWidth: 300, minWidth: 248, className: 'bm-popup', autoPanPadding: [56, 56] },
      );
      markerById.current.set(p.id, marker);
      cluster.addLayer(marker);
    }
    cluster.addTo(map);
    markVectorsDecorative(map.getContainer());
    clusterRef.current = cluster;
  }, [places, heat, selectedId, newIds]);

  // A popup from an earlier marker has nothing to do with the place that is
  // now selected — and the rail is the surface that answers for it.
  useEffect(() => {
    if (selectedId) mapRef.current?.closePopup();
  }, [selectedId]);

  // empire overlay for the selected year
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    /**
     * Zoomed out to the whole Near East, "Partherreich" and "Kuschanreich" land
     * on top of each other. A name is only written once its territory is at
     * least ~60 px across on screen — at world zoom that leaves Rome and
     * Parthia named and drops the rest; the tooltip still names everything.
     */
    function applyLabelZoom() {
      const pxPerDegree = (256 * Math.pow(2, map!.getZoom())) / 360;
      for (const { marker, area } of borderLabels.current) {
        marker.setOpacity(Math.sqrt(area) * pxPerDegree >= 60 ? 1 : 0);
      }
    }

    if (borderYear === null) {
      if (borderRef.current) {
        map.removeLayer(borderRef.current);
        borderRef.current = null;
        borderLabels.current = [];
      }
      return;
    }

    let live = true;
    loadBorders().then((data) => {
      if (!live || !mapRef.current) return;
      if (borderRef.current) map.removeLayer(borderRef.current);
      borderLabels.current = [];

      const group = L.layerGroup();
      for (const polity of politiesAt(data, borderYear)) {
        const color = polityColor(polity.name);
        const label = polityName(polity, langRef.current);

        const shape = L.geoJSON(polity.geometry as never, {
          pane: 'bmBorders',
          style: { color, weight: 1.5, opacity: 0.9, fillColor: color, fillOpacity: 0.16 },
        });
        shape.on('mouseover', () => shape.setStyle({ fillOpacity: 0.32, weight: 2.5 }));
        shape.on('mouseout', () => shape.setStyle({ fillOpacity: 0.16, weight: 1.5 }));
        shape.bindTooltip(
          polity.subjectTo ? `${label} <span style="opacity:.6">· ${polity.subjectTo}</span>` : label,
          { sticky: true, className: 'bm-polity-tip' },
        );
        group.addLayer(shape);

        if (polity.at) {
          // Big territories carry a bigger name, the way an atlas plate does.
          const size = polity.area >= 60 ? 13 : polity.area >= 12 ? 11.5 : 10;
          const marker = L.marker([polity.at[1], polity.at[0]], {
            pane: 'bmBorderLabels',
            interactive: false,
            keyboard: false,
            icon: L.divIcon({
              className: '',
              html: `<span class="bm-polity-label" style="--c:${color};font-size:${size}px">${label}</span>`,
              iconSize: [0, 0],
            }),
          });
          borderLabels.current.push({ marker, area: polity.area });
          group.addLayer(marker);
        }
      }
      group.addTo(map);
      borderRef.current = group;
      applyLabelZoom();
    });

    map.on('zoomend', applyLabelZoom);
    return () => {
      live = false;
      map.off('zoomend', applyLabelZoom);
    };
  }, [borderYear, lang]);

  // fit to a set of places (presentation)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !fitPlaces || fitPlaces.length === 0) return;
    const bounds = L.latLngBounds(fitPlaces.map((p) => [p.lat, p.lon] as [number, number]));
    map.flyToBounds(bounds.pad(0.35), flyOptions({ maxZoom: 9, duration: 0.8 }));
  }, [fitPlaces]);

  // fly to single point (search)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !flyTo) return;
    map.flyTo([flyTo.lat, flyTo.lon], flyTo.zoom ?? 9, flyOptions({ duration: 0.8 }));
    // Spiderfy the cluster so the marker is actually visible — but do not open
    // its popup. The place is already open in the detail rail; showing the same
    // name, image, eras and passages a second time on top of the map was the
    // one place where two surfaces answered the same question at once.
    const id = selectedId;
    const t = window.setTimeout(() => {
      const m = id ? markerById.current.get(id) : null;
      const cluster = clusterRef.current;
      if (m && cluster) cluster.zoomToShowLayer(m, () => {});
    }, 850);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flyTo]);

  return <div ref={mapEl} className="absolute inset-0 h-full w-full" />;
}
