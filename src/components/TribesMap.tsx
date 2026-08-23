import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import type { Lang } from '../i18n';
import { useT } from '../i18n';
import { GENO_GEO, type GeoKind } from '../data/genoGeo';
import {
  TRIBES,
  TRIBE_BY_ID,
  MOTHERS,
  MOTHER_BY_ID,
  REFUGE_CITIES,
  DAN_MIGRATION,
  NEIGHBOURS,
  polygonArea,
  polygonCentroid,
  type Mother,
  type Tribe,
} from '../data/tribes';
import { COAST, DEAD_SEA, JORDAN, LAKE_HULEH, LANDMARKS, MEDITERRANEAN, SEA_OF_GALILEE } from '../data/levant';
import { NODE_BY_ID, LINE_COLOR } from '../data/nationsTribes';
import { BASEMAPS, type BasemapId } from './MapView';
import { flyOptions } from '../lib/motion';

interface Props {
  lang: Lang;
  onOpenInTree: (id: string) => void;
}

/** The two optional overlays; the allotment itself is always drawn. */
type Overlay = Exclude<GeoKind, 'tribe'>;

const OVERLAY_LABEL: Record<Overlay, { de: string; en: string }> = {
  people: { de: 'Völkertafel', en: 'Table of Nations' },
  person: { de: 'Personen', en: 'People' },
};

const MAPS: { id: BasemapId; de: string; en: string }[] = [
  { id: 'dark', de: 'Nacht', en: 'Night' },
  { id: 'relief', de: 'Relief', en: 'Relief' },
  { id: 'satellite', de: 'Satellit', en: 'Satellite' },
];

/**
 * The land belongs in the part of the map the panel is not covering — the left
 * third on desktop, the bottom sheet on a phone.
 */
function panelPad(): { paddingTopLeft: [number, number]; paddingBottomRight: [number, number] } {
  const wide = window.innerWidth >= 640;
  return {
    paddingTopLeft: wide ? [360, 40] : [0, 90],
    paddingBottomRight: wide ? [40, 40] : [0, Math.round(window.innerHeight * 0.46)],
  };
}

/** The land the twelve lots divide up — the plate's home view. */
const LAND_BOUNDS = L.latLngBounds([30.8, 34.1], [33.45, 36.6]);

interface Drawn {
  tribe: Tribe;
  centre: [number, number];
  area: number;
}

/** Precomputed once: every tribe that actually owns ground, with its label anchor. */
const DRAWN: Drawn[] = TRIBES.filter((t) => t.polygon).map((t) => ({
  tribe: t,
  centre: t.labelAt ?? polygonCentroid(t.polygon!),
  area: polygonArea(t.polygon!),
}));

/** Label point size — big territories carry a bigger name, like an atlas plate. */
function labelSize(area: number): number {
  if (area >= 0.28) return 13;
  if (area >= 0.14) return 11.5;
  return 10;
}

export default function TribesMap({ lang, onOpenInTree }: Props) {
  const t = useT();
  const elRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tribeLayer = useRef<L.LayerGroup | null>(null);
  const overlayLayer = useRef<L.LayerGroup | null>(null);
  const shapes = useRef(new Map<string, L.Polygon>());
  const tileRef = useRef<L.TileLayer | null>(null);
  const danLine = useRef<L.Polyline | null>(null);

  const [selected, setSelected] = useState<string | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [overlays, setOverlays] = useState<Record<Overlay, boolean>>({ people: false, person: false });
  const [cities, setCities] = useState(true);
  const [basemap, setBasemap] = useState<BasemapId>('dark');
  // Phones only: the sheet folds down to its title so the plate can be seen.
  const [folded, setFolded] = useState(false);

  const name = useCallback((o: { de: string; en: string }) => (lang === 'de' ? o.de : o.en), [lang]);
  const active = selected ?? hover;
  const activeRef = useRef<string | null>(null);
  activeRef.current = active;

  /**
   * A name is only printed where its territory has room for it. Twelve lots in
   * a country the size of Hesse will not all fit on a phone, so each label is
   * measured against the pixels its own polygon currently covers and steps
   * aside until you zoom in far enough — no overlap rules, no hand-tuned zoom
   * levels, and it holds at any window size.
   */
  const fitLabels = useCallback(() => {
    const map = mapRef.current;
    const root = elRef.current;
    if (!map || !root) return;
    for (const [id, poly] of shapes.current) {
      const el = root.querySelector<HTMLElement>(`.bm-tribe-label[data-tribe="${id}"]`);
      if (!el) continue;
      const b = poly.getBounds();
      const nw = map.latLngToContainerPoint(b.getNorthWest());
      const se = map.latLngToContainerPoint(b.getSouthEast());
      const room = Math.abs(se.x - nw.x) >= el.offsetWidth * 1.05 && Math.abs(se.y - nw.y) >= 20;
      // The one you are pointing at is always named, however tight it is.
      el.classList.toggle('is-hidden', !room && id !== activeRef.current);
    }
    root.classList.toggle('bm-labels-off', map.getZoom() < 6);
  }, []);
  const tribe = selected ? TRIBE_BY_ID[selected] : null;

  // ---- map, drawn once ----------------------------------------------------
  useEffect(() => {
    if (!elRef.current || mapRef.current) return;
    const map = L.map(elRef.current, {
      zoomControl: false,
      attributionControl: true,
      worldCopyJump: true,
      minZoom: 2,
    });
    map.fitBounds(LAND_BOUNDS, { animate: false, ...panelPad() });
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Water sits ABOVE the territories: the coast and the Jordan are the border
    // for half the tribes, so they have to stay readable over the fill.
    map.createPane('bmWater').style.zIndex = '450';
    map.getPane('bmWater')!.style.pointerEvents = 'none';
    map.createPane('bmTribeLabels').style.zIndex = '640';
    map.getPane('bmTribeLabels')!.style.pointerEvents = 'none';

    tribeLayer.current = L.layerGroup().addTo(map);
    overlayLayer.current = L.layerGroup().addTo(map);
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // ---- basemap ------------------------------------------------------------
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    tileRef.current?.remove();
    const bm = BASEMAPS[basemap];
    tileRef.current = L.tileLayer(bm.url, {
      attribution: bm.attribution,
      subdomains: bm.subdomains ?? 'abc',
      maxZoom: 12,
      maxNativeZoom: bm.maxZoom,
      opacity: basemap === 'dark' ? 1 : 0.75,
    }).addTo(map);
    tileRef.current.getContainer()?.style.setProperty('filter', basemap === 'dark' ? 'none' : 'saturate(.65)');
  }, [basemap]);

  // ---- the allotment plate ------------------------------------------------
  useEffect(() => {
    const map = mapRef.current;
    const layer = tribeLayer.current;
    if (!map || !layer) return;
    layer.clearLayers();
    shapes.current.clear();

    // territories
    for (const { tribe: tr } of DRAWN) {
      const poly = L.polygon(tr.polygon!, {
        color: tr.color,
        weight: 1.25,
        opacity: 0.85,
        fillColor: tr.color,
        fillOpacity: 0.34,
        // The plate is one object; the panel is where the reading happens.
        bubblingMouseEvents: false,
      });
      poly.on('mouseover', () => setHover(tr.id));
      poly.on('mouseout', () => setHover(null));
      poly.on('click', () => {
        setFolded(false);
        setSelected((cur) => (cur === tr.id ? null : tr.id));
      });
      poly.addTo(layer);
      shapes.current.set(tr.id, poly);
    }

    // water on top of the fills
    const water = { pane: 'bmWater', interactive: false } as const;
    // A tint, not a claim: the tiles carry the real coastline, and this outline
    // is coarse. It exists so the plate still reads before (or without) tiles.
    L.polygon(MEDITERRANEAN, { ...water, weight: 0, fillColor: '#0a2f45', fillOpacity: 0.4 }).addTo(layer);
    for (const lake of [SEA_OF_GALILEE, DEAD_SEA, LAKE_HULEH]) {
      L.polygon(lake, { ...water, color: '#5fb4d6', weight: 1.2, opacity: 0.9, fillColor: '#0f4a66', fillOpacity: 0.95 }).addTo(layer);
    }
    L.polyline(COAST, { ...water, color: '#4d9cbd', weight: 1, opacity: 0.55 }).addTo(layer);
    L.polyline(JORDAN, { ...water, color: '#4d9cbd', weight: 1.6, opacity: 0.8 }).addTo(layer);

    // Dan's migration — the one thing a static allotment map cannot show. It
    // crosses six other territories, so it stays quiet until Dan is in hand.
    danLine.current = L.polyline([DAN_MIGRATION.from, DAN_MIGRATION.to], {
      pane: 'bmWater',
      interactive: false,
      color: '#8f92e0',
      weight: 1.5,
      opacity: 0.3,
      dashArray: '2 8',
    }).addTo(layer);

    // territory names, atlas style
    for (const { tribe: tr, centre, area } of DRAWN) {
      L.marker(centre, {
        pane: 'bmTribeLabels',
        interactive: false,
        keyboard: false,
        icon: L.divIcon({
          className: '',
          html: `<span class="bm-tribe-label" data-tribe="${tr.id}" style="--c:${tr.color};font-size:${labelSize(area)}px">${name(tr.mapLabel ?? tr)}</span>`,
          iconSize: [0, 0],
        }),
      }).addTo(layer);
    }

    // water names
    for (const lm of LANDMARKS) {
      L.marker([lm.lat, lm.lon], {
        pane: 'bmTribeLabels',
        interactive: false,
        keyboard: false,
        icon: L.divIcon({
          className: '',
          html: `<span class="bm-water-label">${name(lm)}</span>`,
          iconSize: [0, 0],
        }),
      }).addTo(layer);
    }
  }, [lang, name]);

  // ---- towns --------------------------------------------------------------
  useEffect(() => {
    const map = mapRef.current;
    const layer = tribeLayer.current;
    if (!map || !layer) return;
    const group = L.layerGroup();
    // Density by zoom, the way a printed atlas thins its towns: far out only the
    // one town that names the territory, close in all of them.
    const minor: L.CircleMarker[] = [];
    if (cities) {
      for (const tr of TRIBES) {
        for (const c of tr.cities) {
          const dot = L.circleMarker([c.lat, c.lon], {
            radius: c.major ? 4 : 3,
            color: '#ffffff',
            weight: c.major ? 1.6 : 1.1,
            opacity: 0.9,
            fillColor: tr.color,
            fillOpacity: 1,
          });
          if (!c.major) minor.push(dot);
          dot.bindTooltip(`${name(c)} <span style="opacity:.6">· ${name(tr)}</span>`, {
            direction: 'top',
            offset: [0, -4],
            className: 'bm-polity-tip',
          });
          dot.on('click', () => setSelected(tr.id));
          dot.addTo(group);
        }
      }
      for (const r of REFUGE_CITIES) {
        L.marker([r.lat, r.lon], {
          interactive: false,
          keyboard: false,
          icon: L.divIcon({ className: '', html: '<span class="bm-refuge-ring"></span>', iconSize: [0, 0] }),
        }).addTo(group);
      }
    }
    group.addTo(layer);

    const thin = () => {
      const show = (map.getZoom() ?? 8) >= 8;
      for (const dot of minor) dot.setStyle({ opacity: show ? 0.9 : 0, fillOpacity: show ? 1 : 0 });
    };
    thin();
    map.on('zoomend', thin);
    return () => {
      map.off('zoomend', thin);
      group.remove();
    };
  }, [cities, name]);

  // ---- optional overlays: peoples & persons -------------------------------
  useEffect(() => {
    const layer = overlayLayer.current;
    if (!layer) return;
    layer.clearLayers();
    for (const [id, geo] of Object.entries(GENO_GEO)) {
      if (geo.kind === 'tribe' || !overlays[geo.kind]) continue;
      const node = NODE_BY_ID[id];
      if (!node) continue;
      const colour = node.line ? LINE_COLOR[node.line] : '#8a7a5c';
      const marker = L.circleMarker([geo.lat, geo.lon], {
        radius: 5,
        color: '#ffffff',
        weight: 1.5,
        fillColor: colour,
        fillOpacity: 0.92,
      });
      const sub = node.people ? name(node.people) : node.region ? name(node.region) : '';
      marker.bindTooltip(
        `${name(node)}${sub ? ` <span style="opacity:.6">· ${sub}</span>` : ''}`,
        { direction: 'top', offset: [0, -4], className: 'bm-polity-tip' },
      );
      marker.on('click', () => onOpenInTree(id));
      marker.addTo(layer);
    }
  }, [overlays, name, onOpenInTree]);

  // ---- hover / selection restyle, without redrawing anything --------------
  useEffect(() => {
    for (const [id, poly] of shapes.current) {
      const on = id === active;
      const dim = !!active && !on;
      poly.setStyle({
        weight: on ? 2.5 : 1.25,
        opacity: dim ? 0.5 : 0.9,
        fillOpacity: on ? 0.6 : dim ? 0.2 : 0.34,
      });
      if (on) poly.bringToFront();
    }
    fitLabels();
    danLine.current?.setStyle(
      active === 'dan' ? { weight: 2.5, opacity: 0.95 } : { weight: 1.5, opacity: 0.3 },
    );
    const root = elRef.current;
    if (root) {
      // Levi owns no ground, so its answer on the map is the six refuges.
      root.classList.toggle('bm-refuge-on', active === 'levi');
      for (const el of root.querySelectorAll<HTMLElement>('.bm-tribe-label')) {
        const on = el.dataset.tribe === active;
        el.classList.toggle('is-on', on);
        el.classList.toggle('is-dim', !!active && !on);
      }
    }
  }, [active, fitLabels]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const run = () => requestAnimationFrame(fitLabels);
    run();
    map.on('zoomend resize', run);
    window.addEventListener('resize', run);
    return () => {
      map.off('zoomend resize', run);
      window.removeEventListener('resize', run);
    };
  }, [fitLabels, lang]);

  // ---- fly to the selected allotment --------------------------------------
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selected) return;
    const poly = shapes.current.get(selected);
    if (!poly) {
      map.flyToBounds(LAND_BOUNDS, flyOptions({ duration: 0.6, ...panelPad() }));
    } else {
      map.flyToBounds(poly.getBounds().pad(0.6), flyOptions({ maxZoom: 9, duration: 0.7, ...panelPad() }));
    }
  }, [selected]);


  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelected(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  function home() {
    setSelected(null);
    mapRef.current?.flyToBounds(LAND_BOUNDS, flyOptions({ duration: 0.6, ...panelPad() }));
  }

  const byMother = useMemo(() => {
    const groups = new Map<Mother, Tribe[]>();
    for (const m of MOTHERS) groups.set(m.id, []);
    for (const tr of [...TRIBES].sort((a, b) => a.rank - b.rank)) groups.get(tr.mother)!.push(tr);
    return groups;
  }, []);

  return (
    <div className="relative h-full w-full">
      <div ref={elRef} className="h-full w-full" />

      {/* ---------------- left: the twelve, or the one you picked ---------- */}
      <div
        className={`pointer-events-none absolute inset-x-0 bottom-0 z-[1100] flex flex-col px-2 pb-2 transition-[max-height] duration-200 sm:inset-y-0 sm:right-auto sm:max-h-none sm:w-[21.5rem] sm:px-3 sm:pb-3 sm:pt-24 ${
          folded ? 'max-h-[3.5rem]' : 'max-h-[46%]'
        }`}
      >
        <button
          onClick={() => setFolded((v) => !v)}
          aria-expanded={!folded}
          className="pointer-events-auto absolute -top-8 right-2 flex items-center gap-1 bg-deepest/94 px-2.5 py-1 text-[11px] font-bold text-white/70 ring-1 ring-white/10 backdrop-blur sm:hidden"
        >
          {folded ? t('tribesOpenList') : t('tribesFoldList')}
          <svg viewBox="0 0 24 24" className={`h-3 w-3 transition-transform ${folded ? '' : 'rotate-180'}`} fill="currentColor" aria-hidden="true">
            <path d="M12 8l6 6H6z" />
          </svg>
        </button>
        <div className="bm-panel pointer-events-auto flex min-h-0 flex-1 flex-col overflow-hidden">
          {tribe ? (
            <TribeCard
              tribe={tribe}
              lang={lang}
              onBack={home}
              onOpenInTree={onOpenInTree}
              onSelect={setSelected}
              onFly={(la, lo) => mapRef.current?.flyTo([la, lo], 11, flyOptions({ duration: 0.6 }))}
            />
          ) : (
            <>
              <div className="flex-none border-b border-white/10 px-4 py-3">
                <div className="bm-eyebrow">{t('tribesEyebrow')}</div>
                <h2 className="font-display mt-1 text-[19px] leading-tight text-white">{t('tribesTitle')}</h2>
                <p className="mt-1 text-[11.5px] leading-snug text-white/55">{t('tribesIntro')}</p>
              </div>
              <div className="scroll-soft min-h-0 flex-1 overflow-y-auto">
                {MOTHERS.map((m) => (
                  <div key={m.id}>
                    <div className="sticky top-0 z-10 flex items-baseline gap-2 bg-deepest/95 px-4 py-1.5 backdrop-blur">
                      <span className="bm-eyebrow bm-eyebrow-dim">{name(m)}</span>
                      <span className="text-[10px] text-white/30">{byMother.get(m.id)!.length}</span>
                    </div>
                    {byMother.get(m.id)!.map((tr) => (
                      <button
                        key={tr.id}
                        onClick={() => setSelected(tr.id)}
                        onMouseEnter={() => setHover(tr.id)}
                        onMouseLeave={() => setHover(null)}
                        onFocus={() => setHover(tr.id)}
                        onBlur={() => setHover(null)}
                        className={`bm-row ${hover === tr.id ? 'is-on' : ''}`}
                      >
                        <span
                          className="h-3.5 w-3.5 flex-none"
                          style={{ background: tr.color, opacity: tr.polygon ? 1 : 0.35, border: tr.polygon ? 'none' : `1px dashed ${tr.color}` }}
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[13px] font-semibold text-white">{name(tr)}</span>
                          <span className="block truncate text-[11px] text-white/50">
                            {tr.polygon ? t(tr.side === 'east' ? 'tribesEast' : 'tribesWest') : t('tribesNoLand')}
                          </span>
                        </span>
                        <span className="flex-none text-[10px] font-semibold text-white/35">{tr.lot}</span>
                      </button>
                    ))}
                  </div>
                ))}
                <p className="px-4 py-3 text-[11px] leading-relaxed text-white/40">{t('tribesNote')}</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ---------------- right: what the plate shows ---------------------- */}
      <div className="pointer-events-auto absolute right-2 top-[6.5rem] z-[1100] flex w-[8.75rem] flex-col gap-px sm:right-3 sm:top-24 sm:w-[12.5rem]">
        <div className="bm-panel px-3 py-2">
          <div className="bm-eyebrow bm-eyebrow-dim mb-1.5">{t('tribesLayers')}</div>
          <Toggle on={cities} onClick={() => setCities((v) => !v)} label={t('tribesCities')} />
          {(Object.keys(OVERLAY_LABEL) as Overlay[]).map((k) => (
            <Toggle
              key={k}
              on={overlays[k]}
              onClick={() => setOverlays((o) => ({ ...o, [k]: !o[k] }))}
              label={name(OVERLAY_LABEL[k])}
            />
          ))}
        </div>
        <div className="bm-panel px-3 py-2">
          <div className="bm-eyebrow bm-eyebrow-dim mb-1.5">{t('tribesBasemap')}</div>
          <div className="grid grid-cols-3 gap-px">
            {MAPS.map((m) => (
              <button
                key={m.id}
                onClick={() => setBasemap(m.id)}
                className={`py-1 text-[10.5px] font-bold tracking-wide transition ${
                  basemap === m.id ? 'bg-signal text-white' : 'bg-white/8 text-white/55 hover:text-white'
                }`}
              >
                {name(m)}
              </button>
            ))}
          </div>
        </div>

        {/* what the two non-obvious marks mean */}
        <div className="bm-panel hidden px-3 py-2 text-[10.5px] leading-tight text-white/55 sm:block">
          <span className="flex items-center gap-2 py-0.5">
            <span className="h-3 w-3 flex-none rounded-full border border-gold" />
            {t('tribesRefuge')}
          </span>
          <span className="flex items-center gap-2 py-0.5">
            <span
              className="h-0 w-3 flex-none border-t border-dashed"
              style={{ borderColor: TRIBE_BY_ID.dan.color }}
            />
            {t('tribesDanLegend')}
          </span>
        </div>

        <button onClick={home} className="bm-btn bm-btn-ghost justify-center bg-deepest/94 backdrop-blur">
          {t('tribesHome')}
        </button>
      </div>
    </div>
  );
}

function Toggle({ on, onClick, label }: { on: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={on}
      className="flex w-full items-center gap-2 py-1 text-left text-[11.5px] text-white/80 transition hover:text-white"
    >
      <span
        className={`grid h-3.5 w-3.5 flex-none place-items-center border transition ${
          on ? 'border-mint bg-mint text-deepest' : 'border-white/30 text-transparent'
        }`}
      >
        <svg viewBox="0 0 24 24" className="h-2.5 w-2.5" fill="currentColor" aria-hidden="true">
          <path d="M9.6 17.2 4.8 12.4l1.6-1.6 3.2 3.2 7.6-7.6 1.6 1.6z" />
        </svg>
      </span>
      {label}
    </button>
  );
}

interface CardProps {
  tribe: Tribe;
  lang: Lang;
  onBack: () => void;
  onOpenInTree: (id: string) => void;
  onFly: (lat: number, lon: number) => void;
  onSelect: (id: string) => void;
}

function TribeCard({ tribe: tr, lang, onBack, onOpenInTree, onFly, onSelect }: CardProps) {
  const t = useT();
  const name = (o: { de: string; en: string }) => (lang === 'de' ? o.de : o.en);
  const mother = MOTHER_BY_ID[tr.mother];

  return (
    <>
      <div className="relative flex-none px-4 pb-3 pt-3" style={{ borderBottom: `1px solid rgba(255,255,255,.1)` }}>
        <span className="absolute inset-y-0 left-0 w-1" style={{ background: tr.color }} />
        <button onClick={onBack} className="bm-eyebrow bm-eyebrow-dim mb-1 flex items-center gap-1 hover:text-white">
          ← {t('tribesAll')}
        </button>
        <h2 className="font-display text-[24px] leading-none text-white">{name(tr)}</h2>
        <p className="mt-1.5 text-[12px] italic text-white/60">{name(tr.meaning)}</p>
        <div className="mt-2 flex flex-wrap gap-1">
          <span className="bm-chip">
            {tr.via ? `${name(tr.via)} · ${name(mother)}` : `${tr.born}. ${t('tribesSon')} · ${name(mother)}`}
          </span>
          <span className="bm-chip">{tr.polygon ? t(tr.side === 'east' ? 'tribesEast' : 'tribesWest') : t('tribesNoLand')}</span>
        </div>
      </div>

      <div className="scroll-soft min-h-0 flex-1 overflow-y-auto px-4 py-3">
        <p className="text-[12.5px] leading-relaxed text-white/80">{name(tr.land)}</p>

        <div className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-[11.5px]">
          <span className="text-white/40">{t('tribesLot')}</span>
          <span className="font-semibold text-mint">{tr.lot}</span>
          <span className="text-white/40">{t('tribesBlessing')}</span>
          <span className="font-semibold text-mint">{tr.blessing}</span>
          {tr.mosesBlessing && (
            <>
              <span className="text-white/40">{t('tribesMoses')}</span>
              <span className="font-semibold text-mint">{tr.mosesBlessing}</span>
            </>
          )}
        </div>

        {tr.cities.length > 0 && (
          <>
            <div className="bm-eyebrow bm-eyebrow-dim mt-4 mb-1.5">{t('tribesTowns')}</div>
            <div className="flex flex-wrap gap-1">
              {tr.cities.map((c) => (
                <button
                  key={c.de}
                  onClick={() => onFly(c.lat, c.lon)}
                  className="bm-chip transition hover:bg-white/20"
                  title={t('tribesFlyTo')}
                >
                  <span className="h-1.5 w-1.5" style={{ background: tr.color }} />
                  {name(c)}
                </button>
              ))}
            </div>
          </>
        )}

        {tr.id === 'levi' && (
          <>
            <div className="bm-eyebrow bm-eyebrow-dim mt-4 mb-1.5">{t('tribesRefuge')}</div>
            <div className="flex flex-wrap gap-1">
              {REFUGE_CITIES.map((c) => (
                <button key={c.de} onClick={() => onFly(c.lat, c.lon)} className="bm-chip transition hover:bg-white/20">
                  <span className="h-1.5 w-1.5" style={{ background: TRIBE_BY_ID[c.in].color }} />
                  {name(c)}
                </button>
              ))}
            </div>
          </>
        )}

        {NEIGHBOURS[tr.id]?.length > 0 && (
          <>
            <div className="bm-eyebrow bm-eyebrow-dim mt-4 mb-1.5">{t('tribesNeighbours')}</div>
            <div className="flex flex-wrap gap-1">
              {NEIGHBOURS[tr.id].map((id) => (
                <button key={id} onClick={() => onSelect(id)} className="bm-chip transition hover:bg-white/20">
                  <span className="h-1.5 w-1.5" style={{ background: TRIBE_BY_ID[id].color }} />
                  {name(TRIBE_BY_ID[id])}
                </button>
              ))}
            </div>
          </>
        )}

        {tr.id === 'dan' && (
          <p className="mt-4 border-l-2 pl-3 text-[11.5px] leading-relaxed text-white/60" style={{ borderColor: tr.color }}>
            {t('tribesDanMove')} <span className="font-semibold text-mint">{DAN_MIGRATION.ref}</span>
          </p>
        )}
      </div>

      <div className="flex-none border-t border-white/10 p-2">
        <button onClick={() => onOpenInTree(tr.id)} className="bm-btn bm-btn-gold w-full justify-center">
          {t('openInGenTree')}
        </button>
      </div>
    </>
  );
}
