import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { localizeMap } from '../lib/mapLocale';
import { watchTiles } from '../lib/tileNotice';
import { useLang } from '../i18n';
import { enableMarkerKeyboard, markVectorsDecorative } from '../lib/mapKeyboard';
import { flyOptions } from '../lib/motion';

/** Ein Punkt auf der Weltkarte: Reisestation oder Ereignis der Ausbreitung. */
export interface MissionMarker {
  id: string;
  lat: number;
  lon: number;
  label: string;
  color: string;
  /** active = ausgewählt, current = aktuelle Phase, past = schon geschehen. */
  tone: 'active' | 'current' | 'past';
  /** Ziffer im Punkt (Reihenfolge der Reisestationen). */
  badge?: number;
  /** Ausgangspunkt – zeichnet einen Bogen dorthin. */
  from?: [number, number];
}

export interface MissionRoute {
  id: string;
  color: string;
  points: [number, number][];
  dim: boolean;
}

interface Props {
  markers: MissionMarker[];
  routes: MissionRoute[];
  /** Kartenausschnitt: entweder auf diese Punkte zoomen … */
  fit?: { points: [number, number][]; key: number } | null;
  /** … oder auf einen Punkt fliegen. */
  focus?: { lat: number; lon: number; zoom?: number; key: number } | null;
  onSelect: (id: string) => void;
}

const CARTO = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

/**
 * Bogen zwischen zwei Punkten (quadratische Bézier-Kurve). Bögen lesen sich auf
 * einer Weltkarte als Bewegung, gerade Linien als Grenze.
 */
function arc(from: [number, number], to: [number, number], steps = 48): [number, number][] {
  const [lat1, lon1] = from;
  let [lat2, lon2] = [to[0], to[1]];
  // kürzesten Weg über den Datumswechsel nehmen
  if (Math.abs(lon2 - lon1) > 180) lon2 += lon2 > lon1 ? -360 : 360;

  const dx = lon2 - lon1;
  const dy = lat2 - lat1;
  const dist = Math.hypot(dx, dy) || 1;
  // Senkrechte zur Verbindung, immer zur nördlicheren Seite gebogen
  const sign = dx >= 0 ? 1 : -1;
  const cx = (lon1 + lon2) / 2 + (-dy / dist) * dist * 0.16 * sign;
  const cy = (lat1 + lat2) / 2 + (dx / dist) * dist * 0.16 * sign;

  const pts: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const u = 1 - t;
    const lat = u * u * lat1 + 2 * u * t * cy + t * t * lat2;
    const lon = u * u * lon1 + 2 * u * t * cx + t * t * lon2;
    pts.push([lat, lon]);
  }
  return pts;
}

function icon(m: MissionMarker): L.DivIcon {
  const size = m.tone === 'active' ? 26 : m.tone === 'current' ? 18 : 11;
  const badge = m.badge !== undefined && m.tone !== 'past' ? `<span>${m.badge}</span>` : '';
  return L.divIcon({
    className: '',
    html: `<div class="bm-mspot bm-mspot--${m.tone}" style="--c:${m.color};width:${size}px;height:${size}px">${badge}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

export default function MissionMap({ markers, routes, fit, focus, onSelect }: Props) {
  const lang = useLang();
  const el = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  /** Abmelder der Kachelwache – ohne ihn bleibt der Hinweis an einer alten Ebene hängen. */
  const tileWatchRef = useRef<(() => void) | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  /** Welches Symbol gehört zu welchem Eintrag – für die Tastaturbedienung. */
  const keyTargets = useRef<{ el: HTMLElement; id: string }[]>([]);

  useEffect(() => {
    if (!el.current || mapRef.current) return;
    const map = L.map(el.current, {
      center: [30, 25],
      zoom: 3,
      minZoom: 2,
      maxZoom: 12,
      worldCopyJump: true,
      zoomControl: true,
    });
    const kacheln = L.tileLayer(CARTO, {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a> · Orte: <a href="https://www.openbible.info/geo/">OpenBible.info</a> (CC-BY)',
      subdomains: 'abcd',
    }).addTo(map);
    tileWatchRef.current = watchTiles(kacheln, map, lang);
    layerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;
    const offKeys = enableMarkerKeyboard(map.getContainer(), (el) => {
      const hit = keyTargets.current.find((t) => t.el === el);
      if (hit) onSelectRef.current(hit.id);
    });
    return () => {
      offKeys();
      tileWatchRef.current?.();
      tileWatchRef.current = null;
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
  }, []);

  // Leaflet beschriftet Zoom und Fenster selbst – auf Englisch. Diese eine
  // Zeile holt die Namen aus derselben Sprachdatei wie der Rest.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    return localizeMap(map, lang);
  }, [lang]);

  // Routen, Bögen und Punkte neu zeichnen
  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;
    layer.clearLayers();
    keyTargets.current = [];

    for (const r of routes) {
      L.polyline(r.points, {
        color: r.color,
        weight: r.dim ? 1.5 : 3,
        opacity: r.dim ? 0.25 : 0.85,
        dashArray: '1 7',
        lineCap: 'round',
        interactive: false,
      }).addTo(layer);
    }

    for (const m of markers) {
      if (m.from && m.tone !== 'past') {
        L.polyline(arc(m.from, [m.lat, m.lon]), {
          color: m.color,
          weight: m.tone === 'active' ? 2.5 : 1.5,
          opacity: m.tone === 'active' ? 0.8 : 0.4,
          dashArray: '2 8',
          interactive: false,
        }).addTo(layer);
      }
      const marker = L.marker([m.lat, m.lon], { icon: icon(m), title: m.label, riseOnHover: true });
      marker.on('click', () => onSelectRef.current(m.id));
      marker.addTo(layer);
      const el = marker.getElement();
      if (el) keyTargets.current.push({ el, id: m.id });
      if (m.tone === 'active') {
        marker
          .bindTooltip(m.label, { direction: 'top', offset: [0, -16], className: 'bm-mtip' })
          .openTooltip();
      }
    }
    if (mapRef.current) markVectorsDecorative(mapRef.current.getContainer());
  }, [markers, routes]);

  // auf eine Menge von Punkten zoomen (Phase / Reise gewechselt)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !fit || fit.points.length === 0) return;
    const bounds = L.latLngBounds(fit.points);
    map.flyToBounds(bounds.pad(0.25), flyOptions({ maxZoom: 7, duration: 0.9 }));
  }, [fit]);

  // einzelnes Ereignis anfliegen
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !focus) return;
    map.flyTo([focus.lat, focus.lon], focus.zoom ?? 5, flyOptions({ duration: 0.9 }));
  }, [focus]);

  return <div ref={el} className="absolute inset-0 h-full w-full" />;
}
