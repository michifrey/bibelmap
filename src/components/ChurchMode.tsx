import { useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import { localizeMap } from '../lib/mapLocale';
import { watchTiles } from '../lib/tileNotice';
import { markVectorsDecorative } from '../lib/mapKeyboard';
import { flyOptions } from '../lib/motion';
import type { Lang } from '../i18n';
import { useT } from '../i18n';
import {
  FATHERS, COUNCILS, TRADITION_COLOR, TRADITION_LABEL, type Tradition,
} from '../data/church';
import ShareLink from './ShareLink';

interface Props {
  lang: Lang;
  onExit: () => void;
  /** Open straight onto a church father (e.g. coming from the time tree). */
  /** Vorauswahl aus der Adresse oder aus dem Zeitbaum. */
  initial?: { tab: 'fathers' | 'councils'; id?: string } | null;
  /** Meldet Reiter und Auswahl, damit die Adresse mitläuft. */
  onNavigate?: (nav: { tab: 'fathers' | 'councils'; id?: string }) => void;
  /** Jump to this father in the time tree. */
  onOpenInTree?: (personId: string) => void;
  /** Paul's journeys live in the Mission & spread view — send people there. */
  onOpenMission?: () => void;
}

type Tab = 'fathers' | 'councils';

// The dark basemap, like every other map in the app. A light map inside this
// dark shell read as two designs stacked on each other.
const CARTO = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

export default function ChurchMode({ lang, onExit, initial, onNavigate, onOpenInTree, onOpenMission }: Props) {
  const t = useT();
  // Was aus der Adresse kommt, muss es auch geben – sonst steht der Modus auf
  // seinem Anfang, statt auf eine leere Auswahl zu zeigen.
  const startTab: Tab = initial?.tab === 'councils' ? 'councils' : 'fathers';
  const list = startTab === 'councils' ? COUNCILS : FATHERS;
  const startId = initial?.id && list.some((x) => x.id === initial.id) ? initial.id : list[0].id;
  const [tab, setTab] = useState<Tab>(startTab);
  const [sel, setSel] = useState<string | null>(startId);

  useEffect(() => {
    onNavigate?.({ tab, id: sel ?? undefined });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, sel]);

  const mapEl = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  /** Abmelder der Kachelwache – ohne ihn bleibt der Hinweis an einer alten Ebene hängen. */
  const tileWatchRef = useRef<(() => void) | null>(null);
  const overlayRef = useRef<L.LayerGroup | null>(null);

  // init map once
  useEffect(() => {
    if (!mapEl.current || mapRef.current) return;
    const map = L.map(mapEl.current, { center: [38, 26], zoom: 5, minZoom: 3, maxZoom: 12, worldCopyJump: true });
    const kacheln = L.tileLayer(CARTO, {
      attribution: '&copy; OpenStreetMap &copy; CARTO · Orte der Kirchenväter & Konzilien: schematisch',
      subdomains: 'abcd',
    }).addTo(map);
    tileWatchRef.current = watchTiles(kacheln, map, lang);
    overlayRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;
    return () => {
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
    return localizeMap(map, lang);
  }, [lang]);

  // redraw overlay on tab / selection change
  useEffect(() => {
    const map = mapRef.current;
    const group = overlayRef.current;
    if (!map || !group) return;
    group.clearLayers();
    let bounds: L.LatLngBounds | null = null;
    const extend = (ll: [number, number]) => {
      bounds = bounds ? bounds.extend(ll) : L.latLngBounds([ll, ll]);
    };

    if (tab === 'fathers') {
      for (const f of FATHERS) {
        const active = f.id === sel;
        extend([f.lat, f.lon]);
        L.circleMarker([f.lat, f.lon], {
          radius: active ? 9 : 6,
          // Gold marks the one selected thing; on dark ground the old near-black
          // ring for the active marker was invisible.
          color: active ? '#e0a449' : 'rgba(255,255,255,.8)',
          weight: active ? 3.5 : 1.5,
          fillColor: TRADITION_COLOR[f.tradition],
          fillOpacity: 0.95,
        })
          .bindTooltip(`${lang === 'de' ? f.de : f.en} · ${f.city}`, { direction: 'top' })
          .on('click', () => setSel(f.id))
          .addTo(group);
      }
    } else {
      for (const c of COUNCILS) {
        const active = c.id === sel;
        extend([c.lat, c.lon]);
        L.circleMarker([c.lat, c.lon], {
          radius: active ? 10 : 7,
          // These are gold-filled, so the active ring is white instead.
          color: active ? '#ffffff' : 'rgba(255,255,255,.5)',
          weight: active ? 3.5 : 1.5,
          fillColor: '#e0a449',
          fillOpacity: 1,
        })
          .bindTooltip(`${c.name} · ${c.year}`, { direction: 'top' })
          .on('click', () => setSel(c.id))
          .addTo(group);
      }
    }

markVectorsDecorative(map.getContainer());
    if (bounds) map.flyToBounds((bounds as L.LatLngBounds).pad(0.25), flyOptions({ duration: 0.7, maxZoom: 8 }));
  }, [tab, sel]);

  function switchTab(tb: Tab) {
    setTab(tb);
    setSel(tb === 'fathers' ? FATHERS[0].id : COUNCILS[0].id);
  }

  const detail = useMemo(() => {
    if (tab === 'fathers') return FATHERS.find((f) => f.id === sel) ?? null;
    return COUNCILS.find((c) => c.id === sel) ?? null;
  }, [tab, sel]);

  const tabs: { id: Tab; label: string }[] = [
    { id: 'fathers', label: t('churchFathers') },
    { id: 'councils', label: t('councils') },
  ];

  return (
    <div className="fixed inset-0 z-[2000] flex flex-col bg-deepest">
      <div className="flex flex-none flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b border-white/10 bg-abyss px-5 py-3.5 text-white">
        <div className="flex items-center gap-2">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 text-gold" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 3v18M7 8h10M5 21h14" /></svg>
          <div className="font-display text-xl uppercase leading-none">{t('churchMode')}</div>
        </div>
        <div className="flex items-center gap-2">
          {/* Der Stand steht jetzt im Hash – also lässt er sich auch teilen. */}
          <ShareLink className="bm-btn hidden sm:inline-flex" />
          <button onClick={onExit} className="bm-btn bm-btn-gold">
            {t('exit')} ✕
          </button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        {/* left */}
        <div className="scroll-soft flex w-full flex-col overflow-y-auto border-b border-white/10 md:w-[40%] md:max-w-md md:border-b-0 md:border-r">
          <div className="bm-seg sticky top-0 z-10 gap-0.5 border-b border-white/10 bg-deepest p-1.5">
            {tabs.map((tb) => (
              <button
                key={tb.id}
                onClick={() => switchTab(tb.id)}
                // The .bm-seg rules already carry padding, type and colour --
                // and `.bm-seg > *` overrode a Tailwind bg- utility here, which
                // is why the active tab looked exactly like the inactive one.
                className={`flex-1 ${tab === tb.id ? 'is-on' : ''}`}
              >
                {tb.label}
              </button>
            ))}
          </div>

          {onOpenMission && (
            <button
              onClick={onOpenMission}
              className="flex items-center justify-between gap-2 border-b border-white/10 px-4 py-2.5 text-left transition hover:bg-white/6"
            >
              <span className="text-[12px] text-white/60">{t('paulJourneysMoved')}</span>
              <span className="text-[12px] font-bold text-gold">{t('mission')} →</span>
            </button>
          )}

          <div className="p-3">
            {/* list */}
            {tab === 'fathers' && (
              <>
                <div className="mb-2 flex flex-wrap gap-2 px-1">
                  {(['west', 'east', 'orient'] as Tradition[]).map((tr) => (
                    <span key={tr} className="flex items-center gap-1 text-[11px] text-white/60">
                      <span className="h-2.5 w-2.5" style={{ background: TRADITION_COLOR[tr] }} />
                      {lang === 'de' ? TRADITION_LABEL[tr].de : TRADITION_LABEL[tr].en}
                    </span>
                  ))}
                </div>
                <div className="space-y-1">
                  {FATHERS.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setSel(f.id)}
                      className={`flex w-full items-center gap-3 border-l-4 px-3 py-2 text-left transition ${sel === f.id ? 'border-gold bg-surface' : 'border-transparent hover:bg-white/6'}`}
                    >
                      <span className="h-2.5 w-2.5 flex-none rounded-full" style={{ background: TRADITION_COLOR[f.tradition] }} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-white">{lang === 'de' ? f.de : f.en}</span>
                        <span className="text-[11px] text-white/60">{f.city} · {f.years}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {tab === 'councils' && (
              <div className="space-y-1">
                {COUNCILS.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSel(c.id)}
                    className={`flex w-full items-center gap-2 px-3 py-1.5 text-left transition ${sel === c.id ? 'bg-surface ring-1 ring-white/10' : 'hover:bg-surface'}`}
                  >
                    <span className="grid h-6 w-6 flex-none place-items-center rounded-full bg-gold/30 text-[10px] font-semibold text-white">{c.year.slice(0, 4)}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-white">{c.name}</span>
                      <span className="text-[11px] text-white/60">{c.city}</span>
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* detail */}
            {detail && (
              <div className="mt-4 bg-surface/50 p-3">
                {'years' in detail ? (
                  <>
                    <div className="font-display text-base font-semibold text-white">{lang === 'de' ? detail.de : detail.en}</div>
                    <div className="text-[11px] text-white/60">{detail.city} · {detail.years} · {lang === 'de' ? TRADITION_LABEL[detail.tradition].de : TRADITION_LABEL[detail.tradition].en}</div>
                    <p className="mt-1.5 text-sm leading-relaxed text-white">{lang === 'de' ? detail.deNote : detail.enNote}</p>
                    {onOpenInTree && (
                      <button
                        onClick={() => onOpenInTree(detail.personId)}
                        className="mt-2.5 inline-flex items-center gap-1.5 bg-signal px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-signal"
                      >
                        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 3v18M5 9l7-6 7 6" /></svg>
                        {t('openInTree')}
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <div className="font-display text-base font-semibold text-white">{detail.name} · {detail.year}</div>
                    <div className="text-[11px] text-white/60">{detail.city}</div>
                    <p className="mt-1.5 text-sm leading-relaxed text-white">{lang === 'de' ? detail.de.note : detail.en.note}</p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* map */}
        <div className="relative min-h-[40vh] flex-1">
          <div ref={mapEl} className="absolute inset-0 h-full w-full" />
        </div>
      </div>
    </div>
  );
}
