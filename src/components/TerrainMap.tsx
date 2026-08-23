import { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { Place } from '../types';
import type { Lang } from '../i18n';
import { useT } from '../i18n';
import { useReducedMotion } from '../lib/motion';
import { BASEMAPS, type BasemapId } from './MapView';
/**
 * Eine Route über dem Gelände – aus den Bibelreisen oder aus der Mission. Die
 * beiden Datensätze sehen verschieden aus; hier zählt nur, was das Gelände
 * braucht: ein Name, eine Farbe, eine Kette von Stationen.
 */
export interface TerrainRoute {
  id: string;
  /** Woher die Route kommt – entscheidet, wohin der Rückweg führt. */
  kind: 'journey' | 'mission';
  de: string;
  en: string;
  color: string;
  stops: { de: string; en: string; lat: number; lon: number }[];
}

interface Props {
  places: Place[];
  selectedId: string | null;
  lang: Lang;
  onSelect: (p: Place) => void;
  /** Dieselbe Kartenwahl wie flach – sie liegt hier als Tuch über dem Gelände. */
  basemap?: BasemapId;
  flyTo?: { lat: number; lon: number; zoom?: number; key: number } | null;
  /** Kumulative Zeitleiste: was in der gewählten Epoche neu dazukommt. */
  newIds?: Set<string> | null;
  /** Eine Route, die über dem Gelände liegt – der eigentliche Grund für 3D. */
  route?: TerrainRoute | null;
  /** Zurück dorthin, wo die Route herkommt: Text, Stellen, Entfernungen. */
  onOpenRoute?: (route: TerrainRoute) => void;
}

/**
 * MapLibre sucht seinen Worker neben der eigenen Datei – im Bündel liegt dort
 * nichts, und ohne Worker bleibt die Karte still stehen (Kacheln ja, Gelände
 * und Ortspunkte nein). `scripts/sync-maplibre-worker.mjs` legt ihn nach
 * `public/vendor/maplibre/`, und hier steht, wo er liegt.
 */
maplibregl.setWorkerUrl(`${import.meta.env.BASE_URL}vendor/maplibre/maplibre-gl-worker.mjs`);

/**
 * Höhendaten ohne Schlüssel und ohne Anmeldung: die Terrain Tiles, die aus
 * SRTM und weiteren Vermessungen gebaut sind und bei AWS offen liegen. Die
 * Höhe steckt in den Farbwerten („terrarium"), MapLibre rechnet sie zurück.
 */
const DEM_TILES = 'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png';
/** Die Reiseroute trägt die Farbe des Weges, nicht die der Orte. */
const ROUTE_COLOR = '#e0a449';

const DEM_ATTR =
  'Höhen: <a href="https://registry.opendata.aws/terrain-tiles/">Terrain Tiles</a> (AWS Open Data, SRTM u. a.)';

/** Leaflets `{s}`-Platzhalter kennt MapLibre nicht – daraus werden Adressen. */
function tileUrls(id: BasemapId): string[] {
  const bm = BASEMAPS[id] ?? BASEMAPS.dark;
  // `|| ` statt `?? `: die freien Kachelserver tragen einen leeren String,
  // und aus dem darf keine leere Adressliste werden.
  const subs = bm.subdomains || 'abc';
  // `{r}` ist Leaflets Netzhaut-Suffix; hier bleibt es leer.
  const url = bm.url.replace('{r}', '');
  if (!url.includes('{s}')) return [url];
  return [...subs].map((s) => url.replace('{s}', s));
}

function toGeoJSON(places: Place[], newIds: Set<string> | null | undefined) {
  return {
    type: 'FeatureCollection' as const,
    features: places.map((p) => ({
      type: 'Feature' as const,
      id: p.id,
      geometry: { type: 'Point' as const, coordinates: [p.lon, p.lat] },
      properties: {
        id: p.id,
        de: p.nameDe ?? p.name,
        en: p.name,
        mentions: p.mentionCount,
        fresh: newIds ? newIds.has(p.id) : false,
      },
    })),
  };
}

/** Die Route als Linie, die Stationen als nummerierte Punkte. */
function journeyGeoJSON(j: TerrainRoute | null | undefined) {
  const line = {
    type: 'FeatureCollection' as const,
    features: j
      ? [
          {
            type: 'Feature' as const,
            geometry: {
              type: 'LineString' as const,
              coordinates: j.stops.map((s) => [s.lon, s.lat]),
            },
            properties: {},
          },
        ]
      : [],
  };
  const stops = {
    type: 'FeatureCollection' as const,
    features: (j?.stops ?? []).map((s, i) => ({
      type: 'Feature' as const,
      geometry: { type: 'Point' as const, coordinates: [s.lon, s.lat] },
      properties: { nr: i + 1, de: s.de, en: s.en },
    })),
  };
  return { line, stops };
}

/**
 * Die Karte in drei Dimensionen. Sie ersetzt die flache nicht, sie steht
 * daneben: wer wissen will, warum ein Weg über einen Pass führt und nicht
 * geradeaus, sieht es hier.
 *
 * Bewusst weniger als die flache Karte: keine Ballung, keine Wärmekarte,
 * keine Reichsgrenzen. Was hier zählt, ist das Gelände.
 */
export default function TerrainMap({
  places,
  selectedId,
  lang,
  onSelect,
  basemap = 'satellite',
  flyTo,
  newIds,
  route,
  onOpenRoute,
}: Props) {
  const t = useT();
  const el = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const popupRef = useRef<maplibregl.Popup | null>(null);
  const reduced = useReducedMotion();
  const [ready, setReady] = useState(false);
  /** Wie stark das Gelände überzeichnet wird. 1 wäre wahr, aber flach. */
  const [exaggeration, setExaggeration] = useState(1.6);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  const langRef = useRef(lang);
  langRef.current = lang;
  const placesRef = useRef(places);
  placesRef.current = places;

  // Karte einmal aufbauen.
  useEffect(() => {
    if (!el.current || mapRef.current) return;
    const map = new maplibregl.Map({
      container: el.current,
      center: [35.2, 31.8],
      zoom: 7,
      pitch: 62,
      bearing: -15,
      maxPitch: 85,
      minZoom: 2,
      maxZoom: 16,
      attributionControl: false,
      style: {
        version: 8,
        sources: {
          base: {
            type: 'raster',
            tiles: tileUrls(basemap),
            tileSize: 256,
            maxzoom: 17,
            attribution: BASEMAPS[basemap]?.attribution ?? '',
          },
          dem: {
            type: 'raster-dem',
            tiles: [DEM_TILES],
            tileSize: 256,
            maxzoom: 13,
            encoding: 'terrarium',
            attribution: DEM_ATTR,
          },
          places: { type: 'geojson', data: toGeoJSON(places, newIds) },
          route: { type: 'geojson', data: journeyGeoJSON(route).line },
          routeStops: { type: 'geojson', data: journeyGeoJSON(route).stops },
        },
        layers: [
          { id: 'base', type: 'raster', source: 'base' },
          {
            // Schattenwurf über dem Tuch: erst dadurch liest sich das Gelände
            // auch von oben, nicht nur in der Schräge.
            id: 'hillshade',
            type: 'hillshade',
            source: 'dem',
            paint: { 'hillshade-exaggeration': 0.4 },
          },
          {
            id: 'places',
            type: 'circle',
            source: 'places',
            paint: {
              // Häufig genannte Orte tragen einen größeren Punkt – dieselbe
              // Ordnung wie auf der flachen Karte.
              'circle-radius': ['interpolate', ['linear'], ['get', 'mentions'], 1, 4, 50, 7, 400, 11],
              'circle-color': ['case', ['get', 'fresh'], '#e0a449', '#7fe3d5'],
              'circle-stroke-width': 1.5,
              'circle-stroke-color': '#03302f',
              'circle-opacity': 0.92,
            },
          },
          {
            // Die Route liegt auf dem Gelände, nicht darüber: `line-cap` rund,
            // damit sie über Kuppen nicht ausfranst.
            id: 'route',
            type: 'line',
            source: 'route',
            layout: { 'line-cap': 'round', 'line-join': 'round' },
            paint: {
              'line-color': ROUTE_COLOR,
              'line-width': ['interpolate', ['linear'], ['zoom'], 4, 2, 10, 5],
              'line-opacity': 0.9,
            },
          },
          {
            id: 'route-stops',
            type: 'circle',
            source: 'routeStops',
            paint: {
              'circle-radius': 7,
              'circle-color': ROUTE_COLOR,
              'circle-stroke-width': 2,
              'circle-stroke-color': '#03302f',
            },
          },
          {
            id: 'places-selected',
            type: 'circle',
            source: 'places',
            filter: ['==', ['get', 'id'], ''],
            paint: {
              'circle-radius': 13,
              'circle-color': 'rgba(224,164,73,0.28)',
              'circle-stroke-width': 2.5,
              'circle-stroke-color': '#e0a449',
            },
          },
        ],
      },
    });

    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'bottom-right');
    map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-left');
    map.touchZoomRotate.enableRotation();

    // Eine Karte, die still nichts anzeigt, ist schwerer zu finden als eine,
    // die sagt was fehlt – Kachelserver fallen aus, Stile haben Tippfehler.
    map.on('error', (e) => {
      console.warn('[bibelmap] Karte:', e.error?.message ?? e);
    });

    map.on('load', () => {
      map.setTerrain({ source: 'dem', exaggeration });
      map.setSky({
        'sky-color': '#0b2b2a',
        'horizon-color': '#12736a',
        'fog-color': '#03302f',
        'sky-horizon-blend': 0.6,
        'horizon-fog-blend': 0.6,
        'fog-ground-blend': 0.2,
      });
      setReady(true);
    });

    // Ein Ort ist angetippt: dieselbe Auswahl wie auf der flachen Karte.
    map.on('click', 'places', (e: maplibregl.MapLayerMouseEvent) => {
      const id = e.features?.[0]?.properties?.id as string | undefined;
      const hit = id ? placesRef.current.find((p) => p.id === id) : null;
      if (hit) onSelectRef.current(hit);
    });
    // Ohne Schriftkacheln keine Beschriftung auf der Karte – der Name steht
    // im Zeigefenster, und das braucht keine Schriftart von fremden Servern.
    map.on('mouseenter', 'places', (e: maplibregl.MapLayerMouseEvent) => {
      map.getCanvas().style.cursor = 'pointer';
      const f = e.features?.[0];
      if (!f) return;
      const props = f.properties as { de: string; en: string };
      const [lon, lat] = (f.geometry as GeoJSON.Point).coordinates;
      popupRef.current?.remove();
      popupRef.current = new maplibregl.Popup({ closeButton: false, closeOnClick: false, offset: 10 })
        .setLngLat([lon, lat])
        .setText(langRef.current === 'de' ? props.de : props.en)
        .addTo(map);
    });
    map.on('mouseenter', 'route-stops', (e: maplibregl.MapLayerMouseEvent) => {
      map.getCanvas().style.cursor = 'pointer';
      const f = e.features?.[0];
      if (!f) return;
      const props = f.properties as { nr: number; de: string; en: string };
      const [lon, lat] = (f.geometry as GeoJSON.Point).coordinates;
      popupRef.current?.remove();
      popupRef.current = new maplibregl.Popup({ closeButton: false, closeOnClick: false, offset: 12 })
        .setLngLat([lon, lat])
        .setText(`${props.nr}. ${langRef.current === 'de' ? props.de : props.en}`)
        .addTo(map);
    });
    map.on('mouseleave', 'route-stops', () => {
      map.getCanvas().style.cursor = '';
      popupRef.current?.remove();
      popupRef.current = null;
    });
    map.on('mouseleave', 'places', () => {
      map.getCanvas().style.cursor = '';
      popupRef.current?.remove();
      popupRef.current = null;
    });

    mapRef.current = map;
    return () => {
      popupRef.current?.remove();
      map.remove();
      mapRef.current = null;
      setReady(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Orte nachführen (Epochenfilter, Suche).
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    const src = map.getSource('places') as maplibregl.GeoJSONSource | undefined;
    src?.setData(toGeoJSON(places, newIds));
  }, [places, newIds, ready]);

  // Reise nachführen und den Blick auf sie richten.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    const { line, stops } = journeyGeoJSON(route);
    (map.getSource('route') as maplibregl.GeoJSONSource | undefined)?.setData(line);
    (map.getSource('routeStops') as maplibregl.GeoJSONSource | undefined)?.setData(stops);
    // Die Route trägt ihre eigene Farbe – die Epoche bei den Bibelreisen, die
    // Farbe der Reise bei der Mission.
    const color = route?.color || ROUTE_COLOR;
    map.setPaintProperty('route', 'line-color', color);
    map.setPaintProperty('route-stops', 'circle-color', color);
    if (!route?.stops.length) return;
    const b = new maplibregl.LngLatBounds();
    for (const s of route.stops) b.extend([s.lon, s.lat]);
    // Die Neigung bleibt: eine Route, die flach eingepasst wird, verliert
    // genau das, wofür man sie hier ansieht.
    map.fitBounds(b, {
      padding: { top: 190, bottom: 120, left: 80, right: 80 },
      pitch: map.getPitch(),
      bearing: map.getBearing(),
      maxZoom: 9,
      duration: reduced ? 0 : 1400,
    });
  }, [route, ready, reduced]);

  // Kartenwahl: dasselbe Tuch wie flach, nur über dem Gelände.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    const src = map.getSource('base') as maplibregl.RasterTileSource | undefined;
    src?.setTiles(tileUrls(basemap));
  }, [basemap, ready]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    map.setFilter('places-selected', ['==', ['get', 'id'], selectedId ?? '']);
  }, [selectedId, ready]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    map.setTerrain({ source: 'dem', exaggeration });
  }, [exaggeration, ready]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready || !flyTo) return;
    const target = { center: [flyTo.lon, flyTo.lat] as [number, number], zoom: flyTo.zoom ?? 9 };
    if (reduced) map.jumpTo(target);
    else map.flyTo({ ...target, duration: 1200, essential: true });
  }, [flyTo, ready, reduced]);

  return (
    <div className="absolute inset-0">
      <div ref={el} className="h-full w-full" />

      {/* Ein Feld, nicht zwei: unten sitzt die Zeitleiste, also steht hier
          oben, was diese Ansicht kann und was sie nicht kann. */}
      {/* Auf dem Telefon steht die Kopfzeile in zwei Reihen – das Feld muss
          darunter beginnen, sonst schneidet sie den Hinweis ab. */}
      <div className="pointer-events-none absolute inset-x-0 top-28 z-[1100] flex justify-center px-2 sm:top-24">
        <div className="pointer-events-auto flex max-w-[min(92vw,34rem)] flex-col gap-2 bg-deepest/95 px-3 py-2 ring-1 ring-white/10 backdrop-blur-xl">
          {route ? (
            <div className="flex flex-wrap items-center gap-2">
              <span className="h-2.5 w-6 flex-none" style={{ background: route.color }} />
              <span className="text-[12.5px] font-bold text-white">
                {lang === 'de' ? route.de : route.en}
              </span>
              <span className="text-[11px] text-white/55">
                {route.stops.length} {t('stations')}
              </span>
              {onOpenRoute && (
                <button onClick={() => onOpenRoute(route)} className="bm-btn bm-btn-ghost ml-auto">
                  {route.kind === 'mission' ? t('mission') : t('journeys')} →
                </button>
              )}
            </div>
          ) : (
            <div className="text-[11px] leading-snug text-white/70">{t('terrainNote')}</div>
          )}
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
            <span className="bm-eyebrow whitespace-nowrap">{t('terrainExaggeration')}</span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.2}
              value={exaggeration}
              aria-label={t('terrainExaggeration')}
              onChange={(e) => setExaggeration(Number(e.target.value))}
              className="min-w-[7rem] flex-1 accent-[var(--color-gold)]"
            />
            <span className="bm-num w-9 flex-none text-right text-white">{exaggeration.toFixed(1)}×</span>
            <button
              onClick={() => {
                const map = mapRef.current;
                if (!map) return;
                const target = { pitch: 62, bearing: -15 };
                if (reduced) map.jumpTo(target);
                else map.easeTo({ ...target, duration: 600 });
              }}
              className="bm-btn bm-btn-ghost flex-none whitespace-nowrap"
            >
              {t('terrainReset')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
