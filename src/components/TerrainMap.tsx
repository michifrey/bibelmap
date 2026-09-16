import { useEffect, useMemo, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { Place } from '../types';
import type { Lang } from '../i18n';
import { useT } from '../i18n';
import { useReducedMotion } from '../lib/motion';
import { attr } from '../lib/mapAttribution';
import type { TerrainRoute } from '../lib/terrainRoute';
import { type LatLon, pointAt } from '../lib/route';
import {
  buildWeg,
  cameraToCenterPixels,
  eyeCamera,
  headingAt,
  kmAtT,
  stopIndexAt,
  tAtKm,
  totalKm as summeKm,
  type Weg,
} from '../lib/walk';
import { type RoadSource, type RoadsData, legsFor, loadRoads, roadRoute } from '../lib/roads';
import WalkPanel, { SPEEDS } from './WalkPanel';
import {
  BASEMAPS,
  DARK_RASTER_PAINT,
  DEFAULT_BASEMAP,
  DEM_ATTR,
  DEM_TILES,
  PLAIN_RASTER_PAINT,
  type BasemapId,
} from '../lib/basemaps';
/**
 * Die Route über dem Gelände steht in `src/lib/terrainRoute.ts` – sie wird
 * von der Karte *und* von der Anzeige beim Gehen gebraucht, und zwischen
 * zwei Komponenten gehört ein Typ in keine von beiden.
 */
export type { TerrainRoute } from '../lib/terrainRoute';

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
  /**
   * Sofort losgehen, statt erst die Draufsicht zu zeigen. Eine Zahl, kein
   * Schalter: Wer aus der Jesus-Sektion kommt, will gehen – und wer danach
   * aufhört und zum zweiten Mal kommt, auch.
   */
  autoWalk?: number | null;
  /** Meldet nach oben, ob gerade gegangen wird – der Rand der Karte tritt dann ab. */
  onWalking?: (walking: boolean) => void;
}

/**
 * MapLibre sucht seinen Worker neben der eigenen Datei – im Bündel liegt dort
 * nichts, und ohne Worker bleibt die Karte still stehen (Kacheln ja, Gelände
 * und Ortspunkte nein). `scripts/sync-maplibre-worker.mjs` legt ihn nach
 * `public/vendor/maplibre/`, und hier steht, wo er liegt.
 */
maplibregl.setWorkerUrl(`${import.meta.env.BASE_URL}vendor/maplibre/maplibre-gl-worker.mjs`);

/** Die Reiseroute trägt die Farbe des Weges, nicht die der Orte. */
const ROUTE_COLOR = '#e0a449';

/** So nah lässt die Karte sonst nicht heran; im Gehen steht die Kamera am Boden. */
const MAX_ZOOM = 16;
const WALK_MAX_ZOOM = 18;

/**
 * Der Grund unter allem. Zu sehen ist er nur im Gehen: Dort wird die Kachel
 * ausgeblendet, weil ein Satellitenbild aus 1,70 m Höhe nichts zeigt als
 * einen Farbteppich – und weil es die Oberfläche von heute ist.
 */
const GROUND_COLOR = '#1d4038';

/**
 * Die Schummerung. Von oben liegt sie als Schatten über der Kachel; im Gehen
 * trägt sie das ganze Bild und ist deshalb stärker und wärmer – Sand im Licht,
 * Blaugrün im Schatten. Beides sind keine Messwerte, sondern eine Lesehilfe
 * für Hänge; die Höhen darunter sind gemessen.
 */
const WALK_HILLSHADE = {
  'hillshade-exaggeration': 0.9,
  'hillshade-shadow-color': '#06201f',
  'hillshade-highlight-color': '#c8ab78',
  'hillshade-accent-color': '#2c4b45',
};
const REST_HILLSHADE = {
  'hillshade-exaggeration': 0.4,
  'hillshade-shadow-color': '#000000',
  'hillshade-highlight-color': '#ffffff',
  'hillshade-accent-color': '#000000',
};

/** Himmel und Dunst – von oben knapp, im Gehen tief, damit Ferne Ferne wird. */
const SKY = {
  'sky-color': '#0b2b2a',
  'horizon-color': '#12736a',
  'fog-color': '#03302f',
  'sky-horizon-blend': 0.6,
  'horizon-fog-blend': 0.6,
  'fog-ground-blend': 0.2,
};
const WALK_SKY = {
  ...SKY,
  'sky-color': '#123f4d',
  'horizon-color': '#9fb9a6',
  'fog-color': '#8fa79a',
  'horizon-fog-blend': 0.9,
  'fog-ground-blend': 0.75,
};

/**
 * Die Schummerung setzen – vier Werte, einzeln benannt. `Object.entries()`
 * wäre kürzer, verliert aber die Typen: Farbe und Faktor liegen in derselben
 * Tabelle, und `setPaintProperty` nimmt für jeden Namen nur das Seine.
 */
function setzeSchummerung(map: maplibregl.Map, paint: typeof WALK_HILLSHADE) {
  map.setPaintProperty('hillshade', 'hillshade-exaggeration', paint['hillshade-exaggeration']);
  map.setPaintProperty('hillshade', 'hillshade-shadow-color', paint['hillshade-shadow-color']);
  map.setPaintProperty('hillshade', 'hillshade-highlight-color', paint['hillshade-highlight-color']);
  map.setPaintProperty('hillshade', 'hillshade-accent-color', paint['hillshade-accent-color']);
}

/**
 * Was beim Gehen aus der Hand genommen wird. Die Kamera wird sechzigmal in
 * der Sekunde gesetzt; ein Zug mit der Maus käme dagegen nicht an und sähe
 * aus wie eine klemmende Karte.
 */
const HANDLERS = [
  'dragPan',
  'scrollZoom',
  'dragRotate',
  'touchZoomRotate',
  'keyboard',
  'doubleClickZoom',
  'boxZoom',
  'touchPitch',
] as const;

/**
 * Die Zeile unter der Geländeansicht: Grundkarte und Höhendaten zusammen.
 *
 * Beide hingen vorher an ihren Quellen und gingen dort auf je eigene Weise
 * verloren – die Grundkarte beim Kachelwechsel, die Höhen beim Sprachwechsel.
 * Eine Stelle, ein Aufruf, kein Auseinanderlaufen.
 */
function nennungen(id: BasemapId, lang: Lang, roads?: RoadSource | null): string[] {
  const zeilen = [
    attr(BASEMAPS[id]?.attribution ?? BASEMAPS[DEFAULT_BASEMAP].attribution, lang),
    attr(DEM_ATTR, lang),
  ];
  /*
   * Die Straßen sind die dritte fremde Quelle in diesem Bild, und die einzige,
   * deren Name erst zur Laufzeit feststeht: Welcher Datensatz in `roads.json`
   * steckt, entscheidet der, der ihn gebaut hat. CC-BY verlangt die Nennung an
   * der Stelle, an der das Material zu sehen ist – also hier und nicht nur auf
   * der Nachweisseite.
   */
  if (roads) {
    const wer = roads.url ? `<a href="${roads.url}">${roads.name}</a>` : roads.name;
    zeilen.push(`${lang === 'de' ? 'Straßen' : 'Roads'}: ${wer} (${roads.license})`);
  }
  return zeilen;
}

/** Was aus der hellen Kachel eine dunkle macht – oder nichts, bei allen anderen. */
function rasterPaint(id: BasemapId) {
  return BASEMAPS[id]?.filter ? { ...DARK_RASTER_PAINT } : {};
}

/** Leaflets `{s}`-Platzhalter kennt MapLibre nicht – daraus werden Adressen. */
function tileUrls(id: BasemapId): string[] {
  const bm = BASEMAPS[id] ?? BASEMAPS[DEFAULT_BASEMAP];
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

/**
 * Die Route als Linie, die Stationen als nummerierte Punkte.
 *
 * Die Linie folgt dem Weg, nicht der Stationskette: Liegen Straßendaten vor,
 * sind das die Kurven der antiken Trasse, sonst wie bisher die Luftlinie
 * zwischen den Stationen. `weg.points` ist im zweiten Fall genau diese Kette.
 */
function journeyGeoJSON(j: TerrainRoute | null | undefined, weg?: Weg) {
  const punkte = weg?.points.length ? weg.points : (j?.stops ?? []).map((s) => [s.lat, s.lon] as LatLon);
  const line = {
    type: 'FeatureCollection' as const,
    features: j
      ? [
          {
            type: 'Feature' as const,
            geometry: {
              type: 'LineString' as const,
              coordinates: punkte.map(([lat, lon]) => [lon, lat]),
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
  autoWalk,
  onWalking,
}: Props) {
  const t = useT();
  const el = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const popupRef = useRef<maplibregl.Popup | null>(null);
  /** Das Attributions-Control – es trägt die Nennung der Grundkarte. */
  const nennungRef = useRef<maplibregl.AttributionControl | null>(null);
  const reduced = useReducedMotion();
  const [ready, setReady] = useState(false);
  /** Wie stark das Gelände überzeichnet wird. 1 wäre wahr, aber flach. */
  const [exaggeration, setExaggeration] = useState(1.6);
  /**
   * Die Neigung als Knopf, nicht nur als Geste. Kippen geht auf dem Telefon
   * nur mit zwei Fingern senkrecht – das weiß niemand, der es nicht zufällig
   * probiert, und damit bliebe die Karte auf einem Gerät für immer schräg.
   */
  const [pitched, setPitched] = useState(true);
  /**
   * Welche Station gerade dran ist. Die Punkte auf der Karte liegen in einer
   * Leinwand – mit der Tastatur ist dort nichts zu erreichen. Zwei Knöpfe
   * führen deshalb durch die Route, und das hilft nicht nur der Tastatur:
   * eine Route Station für Station abzugehen ist ohnehin, was man tun will.
   */
  const [stop, setStop] = useState<number | null>(null);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  /* --- Gehen ------------------------------------------------------------- */

  /**
   * Die Kamera steht auf Augenhöhe und geht den Weg ab.
   *
   * Der Rest dieser Ansicht sieht von oben auf das Gelände; hier steht man
   * darin. Echt ist daran die Form des Landes – die Höhen sind gemessen, und
   * die Silhouette eines Grats hat sich in zweitausend Jahren nicht geändert.
   * Nicht echt ist alles andere, und deshalb zeigt das Gehen auch nichts
   * anderes: keine Kachel, keine Häuser, keine Wege. Nur Land, Route und die
   * Menschen aus den Daten.
   */
  const [walking, setWalking] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(SPEEDS[1]);
  /** Kopfdrehung gegen den Kurs: der Weg bleibt, der Blick wandert. */
  const [look, setLook] = useState(0);
  /** Zurückgelegte Strecke in Kilometern – der Stand, den das Feld zeigt. */
  const [km, setKm] = useState(0);

  /*
   * Dieselben Werte als Verweis. Die Schleife läuft sechzigmal in der Sekunde
   * und darf dafür nicht bei jedem Bild neu aufgebaut werden – sie liest hier,
   * was sich geändert hat, statt es in ihren Abhängigkeiten zu tragen.
   */
  const kmRef = useRef(0);
  const lookRef = useRef(0);
  lookRef.current = look;
  const speedRef = useRef(speed);
  speedRef.current = speed;
  const playingRef = useRef(playing);
  playingRef.current = playing;
  const walkingRef = useRef(false);
  walkingRef.current = walking;
  const exaggerationRef = useRef(exaggeration);
  exaggerationRef.current = exaggeration;
  /**
   * Die zuletzt gemessene Geländehöhe. `queryTerrainElevation` antwortet mit
   * `null`, solange die Höhenkachel unter dem Fuß noch unterwegs ist; dann ist
   * die letzte bekannte Höhe die bessere Auskunft als der Meeresspiegel.
   */
  const groundRef = useRef(0);

  const onWalkingRef = useRef(onWalking);
  onWalkingRef.current = onWalking;
  useEffect(() => {
    onWalkingRef.current?.(walking);
    // Beim Abbau der Ansicht ist das Gehen zu Ende – sonst bliebe der Rand
    // der Hauptkarte verschwunden, wenn jemand aus dem Gehen heraus wechselt.
    return () => onWalkingRef.current?.(false);
  }, [walking]);

  /*
   * Die Straßen. Sie kommen als eigene Datei und nur, wenn es eine Route gibt –
   * und sie dürfen fehlen: Ohne sie ist der Weg die Kette der Stationen, wie
   * seit jeher. Deshalb steht hier auch kein Fehlerpfad; `loadRoads()` gibt in
   * dem Fall `null` zurück.
   */
  const [roads, setRoads] = useState<RoadsData | null>(null);
  useEffect(() => {
    if (!route) return;
    let aktuell = true;
    void loadRoads().then((d) => {
      if (aktuell && d) setRoads(d);
    });
    return () => {
      aktuell = false;
    };
  }, [route]);

  /** Der Weg: Stationen, dazwischen die Straße, wo es eine gibt. */
  const weg = useMemo<Weg>(() => {
    const stops = (route?.stops ?? []).map((s) => [s.lat, s.lon] as LatLon);
    return buildWeg(stops, (route ? legsFor(roads, route.id) : null) ?? undefined);
  }, [route, roads]);
  /** Was die Datei über diese Reise sagt – Länge, Luftlinie, Zeit. */
  const roadInfo = route ? roadRoute(roads, route.id) : null;

  const points = weg.points;
  const cum = weg.cum;
  const gesamt = summeKm(cum);
  const stopIndex = stopIndexAt(weg, tAtKm(cum, km));
  const heading = headingAt(points, tAtKm(cum, km));
  /** Folgt die Etappe, auf der man gerade geht, einer Straße? */
  const aufStrasse = weg.onRoad[Math.min(weg.onRoad.length - 1, stopIndex)] ?? false;

  /** Auf eine Stelle des Weges setzen – aus dem Feld heraus oder beim Start. */
  function goToKm(next: number) {
    const value = Math.max(0, Math.min(gesamt, next));
    kmRef.current = value;
    setKm(value);
  }

  function startWalk() {
    // Wer sich vorher durch die Stationen geklickt hat, geht dort weiter.
    goToKm(stop === null ? 0 : kmAtStop(stop));
    setLook(0);
    // Bei reduzierter Bewegung läuft nichts von selbst los: dann ist das
    // Gehen ein Schritt von Station zu Station, und den macht die Hand.
    setPlaying(!reduced);
    setWalking(true);
  }

  /** Die Kilometer, an denen eine Station liegt. */
  function kmAtStop(i: number) {
    const clamped = Math.max(0, Math.min(weg.stopAt.length - 1, i));
    return kmAtT(cum, weg.stopAt[clamped]);
  }

  /** Eine Station weiter oder zurück – mitten auf der Etappe erst an ihren Anfang. */
  function walkStep(delta: number) {
    if (delta < 0 && km > kmAtStop(stopIndex) + 0.05) {
      goToKm(kmAtStop(stopIndex));
    } else {
      goToKm(kmAtStop(stopIndex + delta));
    }
    setLook(0);
  }
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
      maxZoom: MAX_ZOOM,
      attributionControl: false,
      // MapLibre beschriftet seine Bedienelemente selbst – auf Englisch. In
      // einer zweisprachigen App ist „Zoom in" neben „Näher heran" ein Bruch,
      // und für einen Screenreader ist es schlicht die falsche Sprache.
      locale: {
        'Map.Title': t('terrainMapTitle'),
        'NavigationControl.ZoomIn': t('terrainZoomIn'),
        'NavigationControl.ZoomOut': t('terrainZoomOut'),
        'NavigationControl.ResetBearing': t('terrainResetBearing'),
        'Popup.Close': t('terrainClosePopup'),
        // Den hatte meine handgeschriebene Liste übersehen – die Prüfung, die
        // ihre Namen aus MapLibre selbst liest, fand ihn im ersten Lauf.
        'AttributionControl.ToggleAttribution': t('terrainAttribution'),
      },
      style: {
        version: 8,
        sources: {
          base: {
            type: 'raster',
            tiles: tileUrls(basemap),
            tileSize: 256,
            maxzoom: 17,
            /*
             * Bewusst LEER: Die Nennung der Grundkarte hängt am
             * Attributions-Control, nicht an der Quelle – sonst überschreibt
             * `load()` sie beim nächsten Kachelwechsel wieder. Siehe unten.
             */
            attribution: '',
          },
          dem: {
            type: 'raster-dem',
            tiles: [DEM_TILES],
            tileSize: 256,
            maxzoom: 13,
            encoding: 'terrarium',
            /*
             * Auch leer, und aus demselben Grund wie oben – hier kam es nur
             * anders heraus: Die Höhenquelle wird nie neu geladen, also blieb
             * ihre Zeile stehen, wie sie beim Aufbau gesetzt wurde. Auf
             * Englisch stand darum weiter „Höhen: …" unter der Karte. Beide
             * Nennungen hängen jetzt am Control und wechseln zusammen.
             */
            attribution: '',
          },
          places: { type: 'geojson', data: toGeoJSON(places, newIds) },
          route: { type: 'geojson', data: journeyGeoJSON(route).line },
          routeStops: { type: 'geojson', data: journeyGeoJSON(route).stops },
        },
        layers: [
          // Ein Grund unter allem: Beim Gehen wird die Kachel ausgeblendet,
          // und ohne eine Fläche darunter stünde die Landschaft im Nichts.
          { id: 'ground', type: 'background', paint: { 'background-color': GROUND_COLOR } },
          // Die Nachtkarte ist dieselbe helle Kachel, umgerechnet. In den
          // Leaflet-Karten macht das ein CSS-Filter; hier rechnet MapLibre
          // selbst, sonst träfe der Filter auch Orte und Route.
          { id: 'base', type: 'raster', source: 'base', paint: rasterPaint(basemap) },
          {
            // Schattenwurf über dem Tuch: erst dadurch liest sich das Gelände
            // auch von oben, nicht nur in der Schräge.
            id: 'hillshade',
            type: 'hillshade',
            source: 'dem',
            paint: { ...REST_HILLSHADE },
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
    nennungRef.current = new maplibregl.AttributionControl({
      compact: true,
      customAttribution: nennungen(basemap, lang),
    });
    map.addControl(nennungRef.current, 'bottom-left');
    map.touchZoomRotate.enableRotation();

    // Eine Karte, die still nichts anzeigt, ist schwerer zu finden als eine,
    // die sagt was fehlt – Kachelserver fallen aus, Stile haben Tippfehler.
    map.on('error', (e) => {
      console.warn('[bibelmap] Karte:', e.error?.message ?? e);
    });

    map.on('pitchend', () => setPitched(map.getPitch() > 15));

    /*
     * Gelände, Himmel – und ab hier darf die Ansicht arbeiten.
     *
     * Nicht nur an `load`: Das Ereignis wartet auf die erste vollständige
     * Darstellung, und die kommt nicht, solange ein Kachelserver nicht
     * antwortet. Gemessen (mit gesperrtem Kachelserver) blieb `load` aus –
     * und mit ihm Gelände, Ortspunkte und das Gehen, obwohl die Höhendaten
     * aus einer ganz anderen Quelle kommen und längst da waren.
     *
     * Der Stil selbst ist früher fertig, und mehr braucht es hier nicht: Die
     * Quellen stehen, `dem` eingeschlossen. `style.load` meldet genau das und
     * wartet auf keine Kachel. (`isStyleLoaded()` hilft hier übrigens nicht –
     * es ist erst wahr, wenn auch die Quellen geladen sind, und wartet damit
     * auf denselben Server.)
     */
    let aufgebaut = false;
    const aufbau = () => {
      if (aufgebaut) return;
      aufgebaut = true;
      map.setTerrain({ source: 'dem', exaggeration });
      map.setSky(SKY);
      setReady(true);
    };
    map.on('load', aufbau);
    map.on('style.load', aufbau);

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
    const { line, stops } = journeyGeoJSON(route, weg);
    (map.getSource('route') as maplibregl.GeoJSONSource | undefined)?.setData(line);
    (map.getSource('routeStops') as maplibregl.GeoJSONSource | undefined)?.setData(stops);
    // Die Route trägt ihre eigene Farbe – die Epoche bei den Bibelreisen, die
    // Farbe der Reise bei der Mission.
    const color = route?.color || ROUTE_COLOR;
    map.setPaintProperty('route', 'line-color', color);
    map.setPaintProperty('route-stops', 'circle-color', color);
    if (!route?.stops.length) return;
    // Die Daten oben werden auch im Gehen nachgeführt – sonst stünde nach
    // einem Wechsel der Route die alte auf der Karte. Der Ausschnitt nicht:
    // Ein Einpassen von außen risse den Blick aus dem Gelände.
    if (walkingRef.current) return;
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
  }, [route, weg, ready, reduced]);

  // Eine neue Route beginnt ohne gewählte Station – die alte Nummer gehörte
  // zu einem anderen Weg, und der zurückgelegte Weg ebenso.
  useEffect(() => {
    setStop(null);
    setWalking(false);
    kmRef.current = 0;
    setKm(0);
  }, [route?.id]);

  // Zur gewählten Station fliegen, ohne die Neigung aufzugeben.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready || stop === null || !route?.stops[stop] || walkingRef.current) return;
    const s = route.stops[stop];
    const target = { center: [s.lon, s.lat] as [number, number], zoom: Math.max(map.getZoom(), 8) };
    if (reduced) map.jumpTo(target);
    else map.easeTo({ ...target, duration: 900 });
  }, [stop, route, ready, reduced]);

  // Kartenwahl: dasselbe Tuch wie flach, nur über dem Gelände.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    const src = map.getSource('base') as maplibregl.RasterTileSource | undefined;
    if (!src) return;
    // Die Zeile unter der Karte gehört zur Kachel, nicht zur Karte: wer auf
    // den Satelliten wechselt, muss EOX genannt bekommen und nicht weiter
    // OpenStreetMap. Vorher stand hier die Nennung des Stils, mit dem die
    // Ansicht geöffnet wurde – und blieb stehen.
    // `attribution` steht in MapLibres Typen nicht, wird zur Laufzeit aber
    // genau von dort gelesen, wo die Zeile entsteht.
    src.setTiles(tileUrls(basemap));
    /*
     * Die Zeile unter der Karte gehört zur Kachel, nicht zur Ansicht: Wer auf
     * den Satelliten wechselt, muss EOX genannt bekommen und nicht weiter
     * OpenStreetMap.
     *
     * Der Umweg über das Control hat einen Grund. Die Nennung an der Quelle zu
     * setzen sieht richtig aus und hält nicht: `setTiles()` ruft intern
     * `load()`, und das schreibt die Quelle aus ihren ursprünglichen Optionen
     * neu, `attribution` eingeschlossen. Gemessen hieß das, der Satellit zeigte
     * EOX-Kacheln und nannte weiter OpenStreetMap.
     *
     * `customAttribution` liest das Control nur beim Aufbau – also wird es
     * ausgetauscht. Ein DOM-Knoten von der Größe einer Zeile; billiger, als an
     * MapLibres privaten Feldern zu drehen, und es hält auch, wenn die
     * Bibliothek ihre Innereien umbaut.
     */
    if (nennungRef.current) map.removeControl(nennungRef.current);
    nennungRef.current = new maplibregl.AttributionControl({
      compact: true,
      customAttribution: nennungen(basemap, lang, roads?.quelle),
    });
    map.addControl(nennungRef.current, 'bottom-left');
    // Umkehren ist ein Regler, kein Zustand: ohne Zurückstellen zeigte der
    // Satellit nach der Nachtkarte ein Negativ.
    const paint = { ...PLAIN_RASTER_PAINT, ...rasterPaint(basemap) };
    for (const [k, v] of Object.entries(paint)) {
      map.setPaintProperty('base', k as 'raster-saturation', v);
    }
    // `roads` steht mit in der Liste: Die Datei kommt erst nach dem Aufbau,
    // und ihre Nennung muss mit ihr kommen – CC-BY verlangt sie dort, wo das
    // Material zu sehen ist.
  }, [basemap, lang, ready, roads]);

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

  /*
   * Die Kamera geht.
   *
   * Der Lauf setzt die Karte imperativ – `jumpTo` bei jedem Bild –, und React
   * rendert dabei nicht mit: Der Stand im Feld wird höchstens sechsmal in der
   * Sekunde gemeldet. Dieselbe Bauart wie die abgespielte Route auf der
   * flachen Karte (`RouteMap.tsx`), aus demselben Grund.
   */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready || !walking || points.length < 2) return;

    // Das Gelände aufs Gehen einstellen. Die Überhöhung geht dabei auf 1:
    // Wer wirklich durch die Landschaft läuft, soll nicht durch ein Gebirge
    // laufen, das es nicht gibt – die Regler-Überhöhung ist eine Lesehilfe
    // für die Draufsicht, kein Gelände.
    map.setCenterClampedToGround(false);
    map.setMaxZoom(WALK_MAX_ZOOM);
    map.setTerrain({ source: 'dem', exaggeration: 1 });
    map.setLayoutProperty('base', 'visibility', 'none');
    /*
     * Die Route verschwindet mit. Zwei Gründe, und beide zählen:
     *
     * Der ehrliche: Die Linie zwischen zwei Stationen ist keine Straße. Von
     * oben liest sie sich als Verbindung; auf Augenhöhe läge plötzlich ein
     * Weg im Gelände, den so nie jemand gegangen ist.
     *
     * Der technische: MapLibre zieht Linien in Bildschirmbreite. Läuft eine
     * Linie auf die Kamera zu und steht diese am Boden, wächst die Breite in
     * der Perspektive ins Unermessliche – gemessen war das ein hundert Pixel
     * breiter grüner Balken quer durch das Bild. Die Stationen bleiben als
     * Punkte stehen; sie sagen, wo es hingeht.
     */
    map.setLayoutProperty('route', 'visibility', 'none');
    setzeSchummerung(map, WALK_HILLSHADE);
    map.setSky(WALK_SKY);
    for (const h of HANDLERS) map[h].disable();
    popupRef.current?.remove();
    popupRef.current = null;

    let raf = 0;
    let last = performance.now();
    let gemeldet = 0;
    /*
     * Woraus die letzte Kameraeinstellung entstanden ist. Solange sich nichts
     * davon ändert, wird auch nichts neu gesetzt: Wer stehen bleibt, lässt
     * sonst die Karte sechzigmal in der Sekunde dasselbe Bild zeichnen – auf
     * dem Telefon ist das der Unterschied zwischen einer Pause und einem
     * warmen Gerät.
     */
    let gestellt = '';

    const stelle = () => {
      const t = tAtKm(cum, kmRef.current);
      const at = pointAt(points, t);
      const hoehe = map.queryTerrainElevation([at[1], at[0]]);
      if (hoehe !== null && Number.isFinite(hoehe)) groundRef.current = hoehe;
      // Die Höhe gehört in den Vergleich: Sie ändert sich auch im Stehen,
      // wenn die Höhenkachel unter dem Fuß erst später eintrifft.
      const zustand = `${kmRef.current.toFixed(4)}|${lookRef.current}|${groundRef.current.toFixed(2)}|${map.getCanvas().clientHeight}`;
      if (zustand === gestellt) return;
      gestellt = zustand;
      const cam = eyeCamera({
        at,
        ground: groundRef.current,
        bearing: headingAt(points, t, map.getBearing()) + lookRef.current,
        // Der Abstand zum Blickpunkt in Bildschirmpunkten – er hängt am
        // Öffnungswinkel und an der Fensterhöhe und entscheidet über die
        // Zoomstufe.
        cameraToCenterPx: cameraToCenterPixels(
          map.getVerticalFieldOfView(),
          map.getCanvas().clientHeight,
        ),
      });
      map.jumpTo({
        center: [cam.center[1], cam.center[0]],
        elevation: cam.elevation,
        zoom: cam.zoom,
        pitch: cam.pitch,
        bearing: cam.bearing,
      });
    };

    const schritt = (now: number) => {
      // Der Deckel auf der Schrittweite: Wer den Reiter wechselt und
      // zurückkommt, soll nicht zehn Kilometer weiter stehen. Eine Viertel-
      // sekunde lässt auch langsamen Geräten ihr Tempo, ohne zu springen.
      const dt = Math.min(0.25, (now - last) / 1000);
      last = now;
      if (playingRef.current && kmRef.current < gesamt) {
        kmRef.current = Math.min(gesamt, kmRef.current + speedRef.current * dt);
        if (kmRef.current >= gesamt) setPlaying(false);
        if (now - gemeldet > 160) {
          gemeldet = now;
          setKm(kmRef.current);
        }
      }
      stelle();
      raf = requestAnimationFrame(schritt);
    };
    raf = requestAnimationFrame(schritt);

    return () => {
      cancelAnimationFrame(raf);
      setKm(kmRef.current);
      for (const h of HANDLERS) map[h].enable();
      map.setSky(SKY);
      setzeSchummerung(map, REST_HILLSHADE);
      map.setLayoutProperty('base', 'visibility', 'visible');
      map.setLayoutProperty('route', 'visibility', 'visible');
      map.setTerrain({ source: 'dem', exaggeration: exaggerationRef.current });
      map.setMaxZoom(MAX_ZOOM);
      map.setCenterClampedToGround(true);
      // Zurück in die Schräge, und zwar dort, wo man stehen geblieben ist –
      // nicht am Anfang der Route. Ohne Flug: das hier ist ein Wechsel der
      // Ansicht, keine Bewegung im Gelände.
      const at = pointAt(points, tAtKm(cum, kmRef.current));
      /*
       * Ohne `elevation`: Der Blickpunkt hängt jetzt wieder am Boden
       * (`setCenterClampedToGround(true)` eine Zeile weiter oben), und
       * MapLibre setzt seine Höhe selbst. `elevation: undefined`
       * mitzugeben ist nicht dasselbe wie es wegzulassen – geprüft wird
       * auf das Vorhandensein des Feldes, und `setElevation(undefined)`
       * zerlegt die Kameramatrix.
       */
      map.jumpTo({ center: [at[1], at[0]], zoom: 10, pitch: 62 });
      setPitched(true);
    };
  }, [walking, ready, points, cum, gesamt]);

  // Aus der Jesus-Sektion wird nicht erst von oben geschaut, sondern gegangen.
  const autoWalkDone = useRef<number | null>(null);
  useEffect(() => {
    // Nur einmal je Sprung: Wer das Gehen beendet und sich die Route von oben
    // ansieht, soll nicht beim nächsten Bild wieder losgehen.
    if (!autoWalk || autoWalkDone.current === autoWalk) return;
    if (!ready || walking || points.length < 2) return;
    autoWalkDone.current = autoWalk;
    startWalk();
    // `startWalk` liest den Stand der Route; als Abhängigkeit stünde hier bei
    // jedem Bild eine neue Funktion.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoWalk, ready, points.length]);

  // Tastatur im Gehen: Blick drehen, anhalten, aufhören.
  useEffect(() => {
    if (!walking) return;
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 'Escape') {
        /*
         * Escape schließt in dieser App von außen nach innen – Modus, Ansicht,
         * Ortskarte –, und der Griff dafür liegt in `App.tsx` am Fenster. Das
         * Gehen ist das Innerste: Es hört zuerst auf, und die Geländekarte
         * bleibt stehen. Dafür muss dieser Griff **vor** dem der App liegen
         * (deshalb `capture`) und den Weg dorthin abbrechen.
         */
        e.stopImmediatePropagation();
        setWalking(false);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setLook((l) => Math.max(-90, l - 15));
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setLook((l) => Math.min(90, l + 15));
      } else if (e.key === ' ') {
        e.preventDefault();
        setPlaying((p) => !p);
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [walking]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready || !flyTo || walkingRef.current) return;
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
        {walking && route ? (
          /* Im Gehen steht hier, was man unterwegs wissen will – und wem man
             begegnet. Die Regler der Draufsicht wären dort nur im Weg: die
             Überhöhung ist auf 1 festgestellt, und geneigt ist ohnehin alles. */
          <WalkPanel
            route={route}
            lang={lang}
            stopIndex={stopIndex}
            km={km}
            totalKm={gesamt}
            heading={heading}
            look={look}
            playing={playing}
            onRoad={aufStrasse}
            roads={roadInfo}
            speed={speed}
            onPlay={() => setPlaying((p) => !p)}
            onStep={walkStep}
            onLook={(d) => setLook((l) => Math.max(-90, Math.min(90, l + d)))}
            onSpeed={setSpeed}
            onExit={() => setWalking(false)}
          />
        ) : (
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
              <span className="ml-auto flex items-center gap-1.5">
                <button
                  onClick={() => setStop((n) => Math.max(0, (n ?? 0) - 1))}
                  disabled={stop === null || stop === 0}
                  aria-label={t('terrainPrevStop')}
                  className="bm-btn bm-btn-ghost disabled:opacity-30"
                >
                  ‹
                </button>
                {/* Feste Breite, nicht nur eine Mindestbreite: sonst wandern
                    die Pfeile mit jeder Stationslänge, und wer sich durch die
                    Route klickt, tippt beim nächsten Mal daneben. */}
                <span
                  className="w-[9.5rem] truncate text-center text-[11px] text-white/70"
                  title={
                    stop === null
                      ? undefined
                      : lang === 'de'
                        ? route.stops[stop].de
                        : route.stops[stop].en
                  }
                >
                  {stop === null
                    ? `${t('terrainStop')} 1–${route.stops.length}`
                    : `${stop + 1}. ${lang === 'de' ? route.stops[stop].de : route.stops[stop].en}`}
                </span>
                <button
                  onClick={() => setStop((n) => Math.min(route.stops.length - 1, (n ?? -1) + 1))}
                  disabled={stop !== null && stop >= route.stops.length - 1}
                  aria-label={t('terrainNextStop')}
                  className="bm-btn bm-btn-ghost disabled:opacity-30"
                >
                  ›
                </button>
                {points.length > 1 && (
                  <button onClick={startWalk} className="bm-btn bm-btn-gold" title={t('walkStart')}>
                    {t('walk')}
                  </button>
                )}
                {onOpenRoute && (
                  <button onClick={() => onOpenRoute(route)} className="bm-btn bm-btn-ghost">
                    {route.kind === 'mission'
                      ? t('mission')
                      : route.kind === 'gospel'
                        ? t('gospel')
                        : t('journeys')}{' '}
                    →
                  </button>
                )}
              </span>
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
            {/* Von oben oder schräg – der einzige Weg zur Neigung, der mit
                einem Finger geht. */}
            <div className="flex flex-none overflow-hidden">
              {([true, false] as const).map((wantPitch) => (
                <button
                  key={String(wantPitch)}
                  onClick={() => {
                    const map = mapRef.current;
                    setPitched(wantPitch);
                    if (!map) return;
                    const target = { pitch: wantPitch ? 62 : 0 };
                    if (reduced) map.jumpTo(target);
                    else map.easeTo({ ...target, duration: 700 });
                  }}
                  className={`bm-btn ${pitched === wantPitch ? 'bm-btn-signal' : 'bm-btn-ghost'}`}
                >
                  {wantPitch ? t('terrainTilted') : t('terrainFlat')}
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                const map = mapRef.current;
                if (!map) return;
                const target = { pitch: 62, bearing: -15 };
                setPitched(true);
                if (reduced) map.jumpTo(target);
                else map.easeTo({ ...target, duration: 600 });
              }}
              className="bm-btn bm-btn-ghost flex-none whitespace-nowrap"
            >
              {t('terrainReset')}
            </button>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
