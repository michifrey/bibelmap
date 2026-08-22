import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { pointAt, traveled, type LatLon } from '../lib/route';

export interface RouteStop {
  lat: number;
  lon: number;
  label: string;
}

interface Props {
  stops: RouteStop[];
  color: string;
  /** Station, auf der die Erzählung steht. */
  activeIndex: number;
  playing: boolean;
  /** Sekunden, die eine Etappe dauert. */
  legSeconds?: number;
  /** Pause an jeder Station, damit der Text gelesen werden kann (ms). */
  dwellMs?: number;
  /** Der Reisende hat Station `i` erreicht. */
  onArrive: (i: number) => void;
  /** Letzte Station erreicht. */
  onFinish: () => void;
  /** Klick auf einen Punkt der Karte. */
  onSelect: (i: number) => void;
}

const TILES = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

function stopIcon(i: number, active: boolean, color: string): L.DivIcon {
  const size = active ? 26 : 16;
  return L.divIcon({
    className: '',
    html: `<div class="bm-mspot ${active ? 'bm-mspot--active' : 'bm-mspot--current'}" style="--c:${color};width:${size}px;height:${size}px">${i + 1}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

/**
 * Karte, auf der sich eine Route abspielt: die zurückgelegte Strecke zeichnet
 * sich mit, ein Reisender wandert die Etappen ab. Die Animation läuft
 * imperativ über requestAnimationFrame – React rendert dabei nicht mit, sonst
 * würde jede Bildfolge den ganzen Baum neu aufbauen.
 */
export default function RouteMap({
  stops,
  color,
  activeIndex,
  playing,
  legSeconds = 3.5,
  dwellMs = 2600,
  onArrive,
  onFinish,
  onSelect,
}: Props) {
  const el = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const baseRef = useRef<L.Polyline | null>(null);
  const trailRef = useRef<L.Polyline | null>(null);
  const travellerRef = useRef<L.Marker | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const tRef = useRef(0);

  const cb = useRef({ onArrive, onFinish, onSelect });
  cb.current = { onArrive, onFinish, onSelect };

  const points: LatLon[] = stops.map((s) => [s.lat, s.lon]);

  useEffect(() => {
    if (!el.current || mapRef.current) return;
    const map = L.map(el.current, { center: [31.8, 35.2], zoom: 7, minZoom: 2, maxZoom: 13, worldCopyJump: true });
    L.tileLayer(TILES, {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a> · Orte: <a href="https://www.openbible.info/geo/">OpenBible.info</a> (CC-BY) · Routen: schematisch',
      subdomains: 'abcd',
    }).addTo(map);
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  /** Strecke, Punkte und Reisender neu aufbauen (andere Reise gewählt). */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || points.length === 0) return;

    baseRef.current?.remove();
    trailRef.current?.remove();
    travellerRef.current?.remove();
    for (const m of markersRef.current) m.remove();
    markersRef.current = [];

    baseRef.current = L.polyline(points, {
      color,
      weight: 2,
      opacity: 0.3,
      dashArray: '2 8',
      interactive: false,
    }).addTo(map);
    trailRef.current = L.polyline([points[0]], {
      color,
      weight: 4,
      opacity: 0.95,
      lineCap: 'round',
      lineJoin: 'round',
      interactive: false,
    }).addTo(map);

    markersRef.current = stops.map((s, i) => {
      const m = L.marker([s.lat, s.lon], { icon: stopIcon(i, false, color), title: s.label, riseOnHover: true });
      m.on('click', () => cb.current.onSelect(i));
      return m.addTo(map);
    });

    travellerRef.current = L.marker(points[0], {
      icon: L.divIcon({ className: '', html: '<div class="bm-traveller"></div>', iconSize: [18, 18], iconAnchor: [9, 9] }),
      interactive: false,
      zIndexOffset: 1000,
    }).addTo(map);

    map.flyToBounds(L.latLngBounds(points).pad(0.25), { duration: 0.8, maxZoom: 9 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stops, color]);

  /** Stand der Erzählung zeichnen (Klick auf eine Station, Reise gewechselt). */
  useEffect(() => {
    if (playing) return;
    tRef.current = activeIndex;
    draw(activeIndex);
    // Den Überblick über die ganze Route stehen lassen und nur nachführen, wenn
    // die Station aus dem Bild läuft – sonst springt die Karte bei jedem Klick.
    const map = mapRef.current;
    const p = points[activeIndex];
    if (map && p && !map.getBounds().pad(-0.15).contains(p)) {
      map.panTo(p, { animate: true, duration: 0.7 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, playing, stops]);

  function draw(t: number) {
    const trail = trailRef.current;
    const traveller = travellerRef.current;
    if (!trail || !traveller || points.length === 0) return;
    trail.setLatLngs(traveled(points, t));
    traveller.setLatLng(pointAt(points, t));
    const at = Math.round(t);
    markersRef.current.forEach((m, i) => m.setIcon(stopIcon(i, i === at && Math.abs(t - at) < 0.02, color)));
  }

  /** Abspielen: Etappe für Etappe, mit Lesepause an jeder Station. */
  useEffect(() => {
    if (!playing || points.length < 2) return;
    const map = mapRef.current;
    let raf = 0;
    let last = performance.now();
    let dwellUntil = 0;
    let arrived = Math.floor(tRef.current);
    if (tRef.current >= points.length - 1) {
      tRef.current = 0;
      arrived = 0;
      cb.current.onArrive(0);
    }

    const step = (ts: number) => {
      const dt = Math.min((ts - last) / 1000, 0.1);
      last = ts;
      if (ts >= dwellUntil) {
        tRef.current = Math.min(points.length - 1, tRef.current + dt / legSeconds);
        const next = Math.floor(tRef.current + 0.0001);
        if (next > arrived) {
          arrived = next;
          tRef.current = next;
          dwellUntil = ts + dwellMs;
          cb.current.onArrive(next);
        }
      }
      draw(tRef.current);

      const p = pointAt(points, tRef.current);
      if (map && !map.getBounds().pad(-0.2).contains(p)) {
        map.panTo(p, { animate: true, duration: 0.7 });
      }

      if (tRef.current >= points.length - 1 && ts >= dwellUntil) {
        cb.current.onFinish();
        return;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, stops, legSeconds, dwellMs]);

  return <div ref={el} className="absolute inset-0 h-full w-full" />;
}
