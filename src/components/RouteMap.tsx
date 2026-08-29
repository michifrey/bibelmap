import { useEffect, useRef } from 'react';
import L from 'leaflet';
import '../lib/mapStyles';
import { localizeMap } from '../lib/mapLocale';
import { watchTiles } from '../lib/tileNotice';
import { attr, ROUTEN_ATTR } from '../lib/mapAttribution';
import { addBasemap } from '../lib/basemapLayer';
import { useLang } from '../i18n';
import { enableMarkerKeyboard, markVectorsDecorative } from '../lib/mapKeyboard';
import { flyOptions, useReducedMotion } from '../lib/motion';
import { pointAt, traveled, type LatLon } from '../lib/route';

export interface RouteStop {
  lat: number;
  lon: number;
  label: string;
}

interface Props {
  stops: RouteStop[];
  color: string;
  /** Weitere Routen, blass im Hintergrund – zeigt, wo diese Reise liegt. */
  context?: { points: LatLon[]; color: string }[];
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

// Die Kacheln kommen aus `lib/basemaps.ts` – eine Adresse für alle sieben
// Karten, statt in jeder Datei eine eigene Kopie.
const TILES = 'light' as const;

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
  context,
  activeIndex,
  playing,
  legSeconds = 3.5,
  dwellMs = 2600,
  onArrive,
  onFinish,
  onSelect,
}: Props) {
  const lang = useLang();
  const reduced = useReducedMotion();
  const el = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  /** Abmelder der Kachelwache – ohne ihn bleibt der Hinweis an einer alten Ebene hängen. */
  const tileWatchRef = useRef<(() => void) | null>(null);
  const baseRef = useRef<L.Polyline | null>(null);
  const trailRef = useRef<L.Polyline | null>(null);
  const travellerRef = useRef<L.Marker | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const contextRef = useRef<L.Polyline[]>([]);
  const tRef = useRef(0);

  const cb = useRef({ onArrive, onFinish, onSelect });
  cb.current = { onArrive, onFinish, onSelect };

  const points: LatLon[] = stops.map((s) => [s.lat, s.lon]);

  useEffect(() => {
    if (!el.current || mapRef.current) return;
    const map = L.map(el.current, { center: [31.8, 35.2], zoom: 7, minZoom: 2, maxZoom: 13, worldCopyJump: true });
    const kacheln = addBasemap(map, TILES);
    tileWatchRef.current = watchTiles(kacheln, map, lang);
    mapRef.current = map;
    const offKeys = enableMarkerKeyboard(map.getContainer(), (el) => {
      const i = markersRef.current.findIndex((m) => m.getElement() === el);
      if (i >= 0) cb.current.onSelect(i);
    });
    return () => {
      offKeys();
      tileWatchRef.current?.();
      tileWatchRef.current = null;
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Leaflet beschriftet Zoom und Fenster selbst – auf Englisch. Diese eine
  // Zeile holt die Namen aus derselben Sprachdatei wie der Rest.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    return localizeMap(map, lang, attr(ROUTEN_ATTR, lang));
  }, [lang]);

  /** Strecke, Punkte und Reisender neu aufbauen (andere Reise gewählt). */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || points.length === 0) return;

    for (const c of contextRef.current) c.remove();
    contextRef.current = [];
    baseRef.current?.remove();
    trailRef.current?.remove();
    travellerRef.current?.remove();
    for (const m of markersRef.current) m.remove();
    markersRef.current = [];

    for (const c of context ?? []) {
      const line = L.polyline(c.points, {
        color: c.color,
        weight: 1.5,
        opacity: 0.22,
        dashArray: '1 7',
        interactive: false,
      }).addTo(map);
      contextRef.current.push(line);
    }

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

    markVectorsDecorative(map.getContainer());
    map.flyToBounds(L.latLngBounds(points).pad(0.25), flyOptions({ duration: 0.8, maxZoom: 9 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stops, color, context]);

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
      map.panTo(p, flyOptions({ animate: true, duration: 0.7 }));
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

  /**
   * Abspielen: Etappe für Etappe, mit Lesepause an jeder Station. Wer weniger
   * Bewegung eingestellt hat, bekommt dieselbe Reise ohne die Fahrt dazwischen –
   * die Stationen wechseln im Takt der Lesepause.
   */
  useEffect(() => {
    if (!playing || points.length < 2) return;
    if (reduced) {
      const id = window.setInterval(() => {
        const next = Math.floor(tRef.current) + 1;
        if (next > points.length - 1) {
          cb.current.onFinish();
          window.clearInterval(id);
          return;
        }
        tRef.current = next;
        draw(next);
        cb.current.onArrive(next);
      }, dwellMs);
      return () => window.clearInterval(id);
    }
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
        map.panTo(p, flyOptions({ animate: true, duration: 0.7 }));
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
  }, [playing, stops, legSeconds, dwellMs, reduced]);

  return <div ref={el} className="absolute inset-0 h-full w-full" />;
}
