import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import '../lib/mapStyles';
import type { Lang } from '../i18n';
import { useT } from '../i18n';
import {
  EVENTS,
  EVENT_BY_ID,
  ERAS,
  ERA_BY_ID,
  SOURCE_BY_ID,
  DATA_AS_OF,
  formatYear,
} from '../data/israel';
import { SNAPSHOT_BY_ID, snapshotForYear, PLACES, NEIGHBOURS, type Area } from '../data/israelGeo';
import { BASEMAPS, DEFAULT_BASEMAP, basemapAttr, type BasemapId } from '../lib/basemaps';
import { addBasemap } from '../lib/basemapLayer';
import { watchTiles } from '../lib/tileNotice';
import { flyOptions } from '../lib/motion';
import { readableOnDark } from '../lib/contrast';
import { localizeMap } from '../lib/mapLocale';
import { markVectorsDecorative } from '../lib/mapKeyboard';
import ShareLink from './ShareLink';
import { wikiUrl } from '../data/mission';

/**
 * Israel – von der Landnahme bis heute.
 *
 * Die Karte im Stil einer Nachrichtensendung: unten eine Bauchbinde mit
 * Jahreszahl und Schlagzeile, darüber die Gebietsstände als Flächen, die sich
 * mit dem Zeitstrahl ablösen. Die SCHRAFFUR trägt dabei die Aussage – voll
 * gefüllt ist Staatsgebiet, schräg schraffiert besetztes Gebiet, gestreift
 * fremdverwaltetes, nur umrissen ein Plan, der nie in Kraft trat. Eine
 * Nachrichtenkarte, die alles gleich einfärbt, behauptet mehr, als sie weiß.
 *
 * Konflikte bekommen ein Einschlagzeichen an ihrem Ort. Es blinkt nicht und es
 * ist nicht rot: Der Gegenstand liefert die Dringlichkeit von selbst, die
 * Gestaltung muss sie nicht dazuerfinden.
 */

/** Dieselben Namen wie im Kartenmenü der Hauptkarte. */
const BASEMAP_LABEL: Record<BasemapId, 'basemapLight' | 'basemapDark' | 'basemapSatellite' | 'basemapRelief' | 'basemapAntique'> = {
  light: 'basemapLight',
  dark: 'basemapDark',
  satellite: 'basemapSatellite',
  relief: 'basemapRelief',
  antique: 'basemapAntique',
};

interface Props {
  lang: Lang;
  onExit: () => void;
  /** Ereignis aus der Adresse. */
  initial?: string | null;
  /** Meldet das gewählte Ereignis, damit die Adresse mitläuft. */
  onNavigate?: (id: string) => void;
}

/** Der Kartenausschnitt, in dem die Gebietsstände liegen. */
const HOME = L.latLngBounds([29.3, 33.6], [33.6, 36.6]);

/** Platz, den Bauchbinde und Erzählspalte der Karte wegnehmen. */
function pad() {
  const wide = window.innerWidth >= 640;
  return {
    paddingTopLeft: [wide ? 370 : 10, wide ? 60 : 70] as [number, number],
    paddingBottomRight: [20, wide ? 170 : 190] as [number, number],
  };
}

/** Wie ein Gebiet gezeichnet wird – hier steckt die Aussage der Karte. */
function styleFor(area: Area): L.PathOptions {
  switch (area.fill) {
    case 'state':
      return { color: area.color, weight: 1.6, opacity: 0.95, fillColor: area.color, fillOpacity: 0.42 };
    case 'occupied':
      return { color: area.color, weight: 1.6, opacity: 0.95, fillColor: area.color, fillOpacity: 0.3 };
    case 'annexed':
      return { color: area.color, weight: 2.2, opacity: 1, fillColor: area.color, fillOpacity: 0.3, dashArray: '5 3' };
    case 'admin':
      return { color: area.color, weight: 1.4, opacity: 0.9, fillColor: area.color, fillOpacity: 0.26 };
    case 'planned':
      return { color: area.color, weight: 1.6, opacity: 0.9, fillColor: area.color, fillOpacity: 0.16, dashArray: '2 4' };
    case 'ceded':
      return { color: area.color, weight: 1.2, opacity: 0.5, fillColor: area.color, fillOpacity: 0.1, dashArray: '1 5' };
  }
}

/**
 * Die Schraffur einer Fläche – ein Muster je Art UND Farbe.
 *
 * Ein einziges Muster mit `currentColor` reicht nicht: Der Inhalt eines
 * `<pattern>` steht in den `<defs>` und erbt seine Farbe von dort, nicht von
 * der Fläche, die ihn benutzt. Alle Schraffuren kämen weiß heraus. Also
 * bekommt jede Kombination ihr eigenes Muster, mit der Farbe fest darin.
 */
const HATCH_LINES: Record<string, { d: string; w: number; gap: number }> = {
  occupied: { d: 'M0 8 L8 0 M-2 2 L2 -2 M6 10 L10 6', w: 1.5, gap: 8 },
  annexed: { d: 'M0 0 L7 7 M0 7 L7 0', w: 1.1, gap: 7 },
  admin: { d: 'M0 5 H10 M0 0 H10', w: 1.2, gap: 10 },
};

function patternId(fill: string, color: string): string {
  return `bmH-${fill}-${color.replace('#', '')}`;
}

function ensurePattern(svg: SVGSVGElement | null, fill: string, color: string): string | null {
  const spec = HATCH_LINES[fill];
  if (!svg || !spec) return null;
  const pid = patternId(fill, color);
  if (svg.querySelector(`#${pid}`)) return pid;
  const ns = 'http://www.w3.org/2000/svg';
  let defs = svg.querySelector('defs');
  if (!defs) {
    defs = document.createElementNS(ns, 'defs');
    svg.insertBefore(defs, svg.firstChild);
  }
  const pat = document.createElementNS(ns, 'pattern');
  pat.setAttribute('id', pid);
  pat.setAttribute('patternUnits', 'userSpaceOnUse');
  pat.setAttribute('width', String(spec.gap));
  pat.setAttribute('height', String(spec.gap));
  const bg = document.createElementNS(ns, 'rect');
  bg.setAttribute('width', String(spec.gap));
  bg.setAttribute('height', String(spec.gap));
  bg.setAttribute('fill', color);
  bg.setAttribute('fill-opacity', '0.12');
  pat.appendChild(bg);
  const line = document.createElementNS(ns, 'path');
  line.setAttribute('d', spec.d);
  line.setAttribute('stroke', color);
  line.setAttribute('stroke-width', String(spec.w));
  line.setAttribute('fill', 'none');
  pat.appendChild(line);
  defs.appendChild(pat);
  return pid;
}

export default function IsraelMode({ lang, onExit, initial, onNavigate }: Props) {
  const t = useT();
  const elRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const areaLayer = useRef<L.LayerGroup | null>(null);
  const markLayer = useRef<L.LayerGroup | null>(null);

  const start = initial && EVENT_BY_ID[initial] ? initial : EVENTS[EVENTS.length - 1].id;
  const [id, setId] = useState(start);
  const [legend, setLegend] = useState(false);
  const [basemap, setBasemap] = useState<BasemapId>(DEFAULT_BASEMAP);
  const tileRef = useRef<L.TileLayer | null>(null);

  const ev = EVENT_BY_ID[id] ?? EVENTS[0];
  const index = EVENTS.findIndex((e) => e.id === id);
  const era = ERA_BY_ID[ev.era];
  const name = useCallback((o: { de: string; en: string }) => (lang === 'de' ? o.de : o.en), [lang]);
  // Die Karte wird einmal gebaut; die Sprache steht dann schon fest.
  const langRef = useRef(lang);
  langRef.current = lang;

  useEffect(() => {
    onNavigate?.(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  /**
   * Der Gebietsstand eines Ereignisses: der eigene, sonst der letzte, der vor
   * ihm begonnen hat. So trägt jedes Ereignis ein Bild, ohne dass für jedes
   * eines gezeichnet werden müsste.
   */
  const snapshot = useMemo(() => {
    for (let i = index; i >= 0; i--) {
      const s = EVENTS[i].snapshot;
      if (s && SNAPSHOT_BY_ID[s]) return SNAPSHOT_BY_ID[s];
    }
    return snapshotForYear(ev.year);
  }, [index, ev.year]);

  // ---- Karte, einmal ------------------------------------------------------
  useEffect(() => {
    if (!elRef.current || mapRef.current) return;
    const map = L.map(elRef.current, { zoomControl: false, attributionControl: true, minZoom: 3 });
    map.fitBounds(HOME, { animate: false, ...pad() });
    L.control.zoom({ position: 'topright' }).addTo(map);
    map.createPane('bmTerritory').style.zIndex = '410';
    map.createPane('bmImpact').style.zIndex = '620';
    map.getPane('bmImpact')!.style.pointerEvents = 'none';

    areaLayer.current = L.layerGroup().addTo(map);
    markLayer.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    // Orientierung: Nachbarländer blass und groß, Städte klein mit Punkt.
    const labels = L.layerGroup().addTo(map);
    const de = langRef.current === 'de';
    for (const n of NEIGHBOURS) {
      L.marker([n.lat, n.lon], {
        pane: 'bmImpact',
        interactive: false,
        keyboard: false,
        icon: L.divIcon({ className: '', html: `<span class="bm-country-label">${de ? n.de : n.en}</span>`, iconSize: [0, 0] }),
      }).addTo(labels);
    }
    for (const c of PLACES) {
      L.marker([c.lat, c.lon], {
        pane: 'bmImpact',
        interactive: false,
        keyboard: false,
        icon: L.divIcon({
          className: '',
          html: `<span class="bm-city ${c.big ? 'is-big' : ''}"><i></i>${de ? c.de : c.en}</span>`,
          iconSize: [0, 0],
        }),
      }).addTo(labels);
    }

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Leaflet beschriftet Zoom und Fenster selbst – auf Englisch. Dieselbe eine
  // Zeile wie in den anderen fünf Karten holt die Namen aus der Sprachdatei.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    return localizeMap(map, lang, basemapAttr(basemap, lang));
  }, [lang, basemap]);

  // ---- Grundkarte, umschaltbar -------------------------------------------
  // `watchTiles` sagt Bescheid, wenn von einem Server nichts kommt. Das war
  // hier bisher die einzige der sieben Karten ohne diesen Hinweis – und mit
  // dem Umschalter ist sie die, auf der man einen stummen Server überhaupt
  // erst auswählen kann.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    tileRef.current?.remove();
    const kacheln = addBasemap(map, basemap, { maxZoom: 12 });
    kacheln.setZIndex(0);
    tileRef.current = kacheln;
    return watchTiles(kacheln, map, langRef.current);
  }, [basemap]);

  // ---- Gebietsstand -------------------------------------------------------
  useEffect(() => {
    const layer = areaLayer.current;
    if (!layer) return;
    layer.clearLayers();
    const drawn: { poly: L.Polygon; area: Area }[] = [];
    for (const a of snapshot.areas) {
      const poly = L.polygon(a.polygon, { ...styleFor(a), pane: 'bmTerritory', bubblingMouseEvents: false });
      poly.bindTooltip(`<b>${name(a)}</b>${a.note ? `<br><span style="opacity:.75">${name(a.note)}</span>` : ''}`, {
        sticky: true,
        className: 'bm-polity-tip',
      });
      poly.addTo(layer);
      drawn.push({ poly, area: a });
    }

    const svg = (drawn[0]?.poly.getElement() as SVGPathElement | null)?.ownerSVGElement ?? null;
    const container = mapRef.current?.getContainer();
    if (container) {
      markVectorsDecorative(container);
      // Die Gebiete liegen in einer eigenen Ebene; die Vorlesehilfe soll auch
      // die nicht als leere Grafik ansagen.
      container.querySelector('.leaflet-pane svg')?.setAttribute('aria-hidden', 'true');
      svg?.setAttribute('aria-hidden', 'true');
    }
    for (const { poly, area: a } of drawn) {
      const el = poly.getElement() as SVGPathElement | null;
      const pid = ensurePattern(svg, a.fill, a.color);
      if (el && pid) {
        el.setAttribute('fill', `url(#${pid})`);
        el.setAttribute('fill-opacity', '1');
      }
    }
  }, [snapshot, name]);

  // ---- Einschlagzeichen am Ort des Ereignisses ----------------------------
  useEffect(() => {
    const map = mapRef.current;
    const layer = markLayer.current;
    if (!map || !layer) return;
    layer.clearLayers();
    if (!ev.at) return;
    const hostile = ev.kind === 'war' || ev.kind === 'attack' || ev.kind === 'uprising';
    L.marker(ev.at, {
      pane: 'bmImpact',
      interactive: false,
      keyboard: false,
      icon: L.divIcon({
        className: '',
        html: `<span class="bm-impact ${hostile ? 'is-hostile' : ''}" style="--c:${readableOnDark(era.color)}"></span>`,
        iconSize: [0, 0],
      }),
    }).addTo(layer);
  }, [ev, era.color]);

  // ---- Blick auf das Ereignis --------------------------------------------
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    // Was weit weg liegt – Basel, London, Teheran –, wird angeflogen; sonst
    // rahmt die Karte genau den Gebietsstand: 1967 mit dem Sinai zeigt von
    // selbst mehr Land als 1949, und man sieht die Ausdehnung, statt sie zu
    // lesen.
    const inLand = ev.at && HOME.contains(ev.at);
    if (ev.at && !inLand) {
      map.flyTo(ev.at, 5, flyOptions({ duration: 0.8 }));
      return;
    }
    const b = L.latLngBounds([]);
    for (const a of snapshot.areas) for (const p of a.polygon) b.extend(p);
    map.flyToBounds(b.isValid() ? b.pad(0.06) : HOME, flyOptions({ duration: 0.7, ...pad() }));
  }, [ev, snapshot]);

  // ---- Tastatur -----------------------------------------------------------
  const step = useCallback((d: number) => {
    const next = Math.max(0, Math.min(EVENTS.length - 1, index + d));
    setId(EVENTS[next].id);
  }, [index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [step]);

  return (
    <div className="fixed inset-0 z-[2000] bg-deepest">
      <div ref={elRef} className="absolute inset-0" />

      {/* ---------------- Kopf ---------------- */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[1200] flex items-start justify-between gap-2 p-2 sm:p-3">
        <div className="bm-panel pointer-events-auto px-3 py-2">
          <div className="bm-eyebrow hidden sm:block">{t('israelEyebrow')}</div>
          <h1 className="font-display text-[15px] leading-tight text-white sm:text-xl">
            <span className="sm:hidden">{t('israelShort')}</span>
            <span className="hidden sm:inline">{t('israel')}</span>
          </h1>
        </div>
        <div className="pointer-events-auto flex items-center gap-1.5">
          {/* Grundkarte: dieselben fünf wie überall sonst in der App. */}
          <div className="bm-seg hidden bg-deepest/94 backdrop-blur sm:flex" role="group" aria-label={t('basemap')}>
            {(Object.keys(BASEMAPS) as BasemapId[]).map((id) => (
              <button
                key={id}
                onClick={() => setBasemap(id)}
                className={basemap === id ? 'is-on' : ''}
                aria-pressed={basemap === id}
              >
                {t(BASEMAP_LABEL[id])}
              </button>
            ))}
          </div>
          <button onClick={() => setLegend((v) => !v)} aria-pressed={legend} className="bm-btn bm-btn-ghost bg-deepest/94 backdrop-blur">
            {t('israelLegend')}
          </button>
          <ShareLink className="bm-btn bm-btn-ghost bg-deepest/94 backdrop-blur" />
          <button onClick={onExit} className="bm-btn bm-btn-gold">{t('exit')} ✕</button>
        </div>
      </div>

      {/* ---------------- Legende: was die Schraffur bedeutet ---------------- */}
      {legend && (
        <div className="bm-panel pointer-events-auto absolute right-2 top-16 z-[1200] w-[15rem] px-3 py-2.5 sm:right-3 sm:top-[4.2rem]">
          <div className="bm-eyebrow bm-eyebrow-dim mb-2">{t('israelLegendTitle')}</div>
          <ul className="space-y-1.5 text-[11.5px] leading-tight text-white/70">
            {(['state', 'occupied', 'annexed', 'admin', 'planned', 'ceded'] as Area['fill'][]).map((f) => (
              <li key={f} className="flex items-center gap-2">
                <span className={`h-4 w-6 flex-none border bm-fill-${f}`} />
                {t(`israelFill_${f}`)}
              </li>
            ))}
          </ul>
          <div className="mt-2.5 border-t border-white/10 pt-2 sm:hidden">
            <div className="bm-eyebrow bm-eyebrow-dim mb-1.5">{t('basemap')}</div>
            <div className="grid grid-cols-3 gap-px">
              {(Object.keys(BASEMAPS) as BasemapId[]).map((id) => (
                <button
                  key={id}
                  onClick={() => setBasemap(id)}
                  aria-pressed={basemap === id}
                  className={`truncate py-1 text-[10px] font-bold transition ${
                    basemap === id ? 'bg-signal text-white' : 'bg-white/8 text-white/70'
                  }`}
                >
                  {t(BASEMAP_LABEL[id])}
                </button>
              ))}
            </div>
          </div>
          <p className="mt-2.5 border-t border-white/10 pt-2 text-[10.5px] leading-relaxed text-white/60">
            {t('israelGeoNote')}
          </p>
        </div>
      )}

      {/* ---------------- Die Geschichte zum Ereignis ---------------- */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[8.5rem] z-[1150] flex max-h-[46%] px-2 sm:inset-y-0 sm:bottom-auto sm:right-auto sm:max-h-none sm:w-[23rem] sm:px-3 sm:pb-[10rem] sm:pt-16">
        <div className="bm-panel pointer-events-auto flex min-h-0 w-full flex-col overflow-hidden">
          <div className="relative flex-none px-4 pb-3 pt-3">
            <span className="absolute inset-y-0 left-0 w-1" style={{ background: era.color }} />
            <div className="bm-eyebrow" style={{ color: readableOnDark(era.color) }}>{name(era)}</div>
            <h2 className="font-display mt-1 text-[20px] leading-tight text-white">{ev.de === ev.en ? ev.de : name(ev)}</h2>
            {ev.alsoCalled && (
              <p className="mt-1 text-[12px] italic leading-snug text-white/60">{t('israelAlsoCalled')}: {name(ev.alsoCalled)}</p>
            )}
            <p className="mt-1.5 text-[11.5px] font-semibold text-mint">{name(ev.when)}</p>
          </div>

          <div className="scroll-soft min-h-0 flex-1 overflow-y-auto px-4 pb-4">
            <p className="text-[12.5px] leading-relaxed text-white/85">{name(ev.text)}</p>

            {ev.figures && ev.figures.length > 0 && (
              <>
                <div className="bm-eyebrow bm-eyebrow-dim mt-4 mb-1.5">{t('israelFigures')}</div>
                <ul className="space-y-2">
                  {ev.figures.map((f) => (
                    <li key={f.label.de} className="border-l-2 border-white/15 pl-2.5">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-[11.5px] text-white/60">{name(f.label)}</span>
                        <span className="font-display text-[15px] text-white">{name(f.value)}</span>
                      </div>
                      <div className="mt-0.5 text-[10.5px] text-white/60">
                        {SOURCE_BY_ID[f.source]?.by} · {t('israelAsOf')} {f.asOf}
                      </div>
                      {f.note && <p className="mt-1 text-[10.5px] leading-snug text-white/50">{name(f.note)}</p>}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {ev.ref && (
              <p className="mt-3 text-[11.5px] text-white/60">
                {t('israelInBible')} <span className="font-semibold text-mint">{ev.ref}</span>
              </p>
            )}

            <div className="bm-eyebrow bm-eyebrow-dim mt-4 mb-1.5">{t('sources')}</div>
            <ul className="space-y-1">
              {ev.sources.map((sid) => {
                const s = SOURCE_BY_ID[sid];
                if (!s) return null;
                return (
                  <li key={sid}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-[11.5px] leading-snug text-white/75 underline decoration-white/25 underline-offset-2 transition hover:text-white hover:decoration-gold"
                    >
                      {s.label} <span className="text-white/60">· {s.by}</span>
                    </a>
                  </li>
                );
              })}
              {ev.topic && (
                <li>
                  <a
                    href={wikiUrl(ev.topic, lang)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-[11.5px] leading-snug text-white/75 underline decoration-white/25 underline-offset-2 transition hover:text-white hover:decoration-gold"
                  >
                    {t('israelLookUp')} <span className="text-white/60">· Wikipedia</span>
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* ---------------- Bauchbinde und Zeitstrahl ---------------- */}
      <div className="pointer-events-auto absolute inset-x-0 bottom-0 z-[1200]">
        <div className="bm-chyron flex items-stretch">
          <div
            className="flex flex-none items-center border-l-[5px] bg-abyss/70 px-3 font-display text-[12px] uppercase tracking-[0.18em] sm:px-4 sm:text-[13px]"
            style={{ borderColor: era.color, color: readableOnDark(era.color) }}
          >
            {t(`israelKind_${ev.kind}`)}
          </div>
          <div className="flex min-w-0 flex-1 items-center gap-3 px-3 sm:gap-4 sm:px-4">
            <span className="font-display flex-none text-[22px] leading-none text-gold tabular-nums sm:text-[28px]">
              {formatYear(ev.year, lang)}
            </span>
            <span className="min-w-0 flex-1 truncate text-[13px] font-bold text-white sm:text-[15px]">{name(ev)}</span>
          </div>
          <div className="flex flex-none items-center gap-px pr-1">
            <button onClick={() => step(-1)} disabled={index === 0} aria-label={t('prev')} className="bm-btn bm-btn-ghost h-full border-0 px-2.5">‹</button>
            <button onClick={() => step(1)} disabled={index === EVENTS.length - 1} aria-label={t('next')} className="bm-btn bm-btn-ghost h-full border-0 px-2.5">›</button>
          </div>
        </div>

        {/* Der Zeitstrahl: jedes Ereignis ein Strich, die Abschnitte darunter */}
        <div className="bm-panel-solid border-t-0 px-2 pb-1.5 pt-2 sm:px-3">
          <div className="scroll-soft flex gap-px overflow-x-auto pb-1">
            {EVENTS.map((e, i) => {
              const c = ERA_BY_ID[e.era].color;
              const on = i === index;
              return (
                <button
                  key={e.id}
                  onClick={() => setId(e.id)}
                  title={`${formatYear(e.year, lang)} · ${lang === 'de' ? e.de : e.en}`}
                  aria-label={`${formatYear(e.year, lang)} · ${lang === 'de' ? e.de : e.en}`}
                  aria-current={on ? 'true' : undefined}
                  className="group flex-none px-[1px] py-1"
                >
                  <span
                    className="block w-[7px] transition-all sm:w-[9px]"
                    style={{ height: on ? 22 : 12, background: on ? '#e0a449' : c, opacity: on ? 1 : 0.55 }}
                  />
                </button>
              );
            })}
          </div>
          <div className="flex items-center justify-between gap-2 text-[10px] text-white/60">
            <div className="flex flex-wrap gap-x-3 gap-y-0.5">
              {ERAS.map((e) => (
                <span key={e.id} className="flex items-center gap-1">
                  <span className="h-2 w-2" style={{ background: e.color }} />
                  {name(e)}
                </span>
              ))}
            </div>
            <span className="flex-none whitespace-nowrap">{t('israelDataAsOf')} {name(DATA_AS_OF)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
