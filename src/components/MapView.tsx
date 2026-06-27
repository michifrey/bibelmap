import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet.heat';
import type { Place } from '../types';
import { erasForPlace } from '../lib/places';
import { ERA_BY_ID } from '../data/eras';
import { buildPlacePopup } from '../lib/placePopup';
import type { Lang } from '../i18n';

interface Props {
  places: Place[];
  heat: boolean;
  selectedId: string | null;
  lang: Lang;
  onSelect: (p: Place) => void;
  /** Base map style. */
  basemap?: BasemapId;
  /** Fit the map to exactly these places (presentation mode). */
  fitPlaces?: Place[] | null;
  /** Fly to a single coordinate (search focus). */
  flyTo?: { lat: number; lon: number; zoom?: number; key: number } | null;
}

export type BasemapId = 'light' | 'satellite' | 'relief' | 'antique';

interface Basemap {
  url: string;
  attribution: string;
  maxZoom: number;
  maxNativeZoom?: number;
  subdomains?: string;
  dark?: boolean;
}

const OB_ATTR = '· Orte: <a href="https://www.openbible.info/geo/">OpenBible.info</a> (CC-BY)';

export const BASEMAPS: Record<BasemapId, Basemap> = {
  light: {
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a> ' + OB_ATTR,
    maxZoom: 19,
    subdomains: 'abcd',
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri — Source: Esri, Maxar, Earthstar Geographics ' + OB_ATTR,
    maxZoom: 18,
    dark: true,
  },
  relief: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri — Source: Esri ' + OB_ATTR,
    maxZoom: 13,
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

function makeIcon(p: Place, focused: boolean): L.DivIcon {
  const size = markerSize(p);
  const color = primaryEraColor(p);
  const label = p.mentionCount >= 20 ? `<span>${p.mentionCount}</span>` : '';
  return L.divIcon({
    className: '',
    html: `<div class="bm-marker ${focused ? 'bm-marker--focus' : ''}" style="background:${color};width:${size}px;height:${size}px">${label}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

export default function MapView({ places, heat, selectedId, lang, onSelect, basemap = 'light', fitPlaces, flyTo }: Props) {
  const mapEl = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileRef = useRef<L.TileLayer | null>(null);
  const clusterRef = useRef<L.MarkerClusterGroup | null>(null);
  const heatRef = useRef<L.Layer | null>(null);
  const markerById = useRef<Map<string, L.Marker>>(new Map());
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
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
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // basemap tile layer (swappable)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const bm = BASEMAPS[basemap] ?? BASEMAPS.light;
    if (tileRef.current) map.removeLayer(tileRef.current);
    tileRef.current = L.tileLayer(bm.url, {
      attribution: bm.attribution,
      subdomains: bm.subdomains ?? 'abc',
      maxZoom: bm.maxZoom,
      maxNativeZoom: bm.maxNativeZoom ?? bm.maxZoom,
    }).addTo(map);
    tileRef.current.setZIndex(0);
    const c = map.getContainer();
    c.classList.toggle('bm-dark', !!bm.dark);
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
        icon: makeIcon(p, p.id === selectedId),
        title: p.name,
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
    clusterRef.current = cluster;
  }, [places, heat, selectedId]);

  // fit to a set of places (presentation)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !fitPlaces || fitPlaces.length === 0) return;
    const bounds = L.latLngBounds(fitPlaces.map((p) => [p.lat, p.lon] as [number, number]));
    map.flyToBounds(bounds.pad(0.35), { maxZoom: 9, duration: 0.8 });
  }, [fitPlaces]);

  // fly to single point (search)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !flyTo) return;
    map.flyTo([flyTo.lat, flyTo.lon], flyTo.zoom ?? 9, { duration: 0.8 });
    // open the cluster spiderfy / highlight after the fly
    const id = selectedId;
    const t = window.setTimeout(() => {
      const m = id ? markerById.current.get(id) : null;
      const cluster = clusterRef.current;
      if (m && cluster) cluster.zoomToShowLayer(m, () => m.openPopup?.());
    }, 850);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flyTo]);

  return <div ref={mapEl} className="absolute inset-0 h-full w-full" />;
}
