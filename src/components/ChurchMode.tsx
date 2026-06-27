import { useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import type { Lang } from '../i18n';
import { useT } from '../i18n';
import {
  JOURNEYS, FATHERS, COUNCILS, TRADITION_COLOR, TRADITION_LABEL, type Tradition,
} from '../data/church';

interface Props {
  lang: Lang;
  onExit: () => void;
}

type Tab = 'paul' | 'fathers' | 'councils';

const CARTO = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

export default function ChurchMode({ lang, onExit }: Props) {
  const t = useT();
  const [tab, setTab] = useState<Tab>('paul');
  const [sel, setSel] = useState<string | null>('j1');

  const mapEl = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const overlayRef = useRef<L.LayerGroup | null>(null);

  // init map once
  useEffect(() => {
    if (!mapEl.current || mapRef.current) return;
    const map = L.map(mapEl.current, { center: [38, 26], zoom: 5, minZoom: 3, maxZoom: 12, worldCopyJump: true });
    L.tileLayer(CARTO, {
      attribution: '&copy; OpenStreetMap &copy; CARTO · Routen & Konzilien: schematisch',
      subdomains: 'abcd',
    }).addTo(map);
    overlayRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

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

    if (tab === 'paul') {
      for (const j of JOURNEYS) {
        const active = j.id === sel;
        const latlngs = j.stops.map((s) => [s.lat, s.lon] as [number, number]);
        L.polyline(latlngs, {
          color: j.color,
          weight: active ? 4 : 2,
          opacity: active ? 0.95 : 0.25,
          dashArray: active ? undefined : '4 6',
        }).addTo(group);
        if (active) {
          latlngs.forEach((ll) => extend(ll));
          j.stops.forEach((s, idx) => {
            L.circleMarker([s.lat, s.lon], {
              radius: 5, color: '#fff', weight: 2, fillColor: j.color, fillOpacity: 1,
            })
              .bindTooltip(`${idx + 1}. ${s.name}`, { direction: 'top' })
              .addTo(group);
          });
        }
      }
    } else if (tab === 'fathers') {
      for (const f of FATHERS) {
        const active = f.id === sel;
        extend([f.lat, f.lon]);
        L.circleMarker([f.lat, f.lon], {
          radius: active ? 9 : 6,
          color: active ? '#1f3d3a' : '#fff',
          weight: active ? 3 : 1.5,
          fillColor: TRADITION_COLOR[f.tradition],
          fillOpacity: 0.95,
        })
          .bindTooltip(`${f.name} · ${f.city}`, { direction: 'top' })
          .on('click', () => setSel(f.id))
          .addTo(group);
      }
    } else {
      for (const c of COUNCILS) {
        const active = c.id === sel;
        extend([c.lat, c.lon]);
        L.circleMarker([c.lat, c.lon], {
          radius: active ? 10 : 7,
          color: active ? '#1f3d3a' : '#fff',
          weight: active ? 3 : 1.5,
          fillColor: '#e0a449',
          fillOpacity: 1,
        })
          .bindTooltip(`${c.name} · ${c.year}`, { direction: 'top' })
          .on('click', () => setSel(c.id))
          .addTo(group);
      }
    }

    if (bounds) map.flyToBounds((bounds as L.LatLngBounds).pad(0.25), { duration: 0.7, maxZoom: 8 });
  }, [tab, sel]);

  function switchTab(tb: Tab) {
    setTab(tb);
    setSel(tb === 'paul' ? 'j1' : tb === 'fathers' ? FATHERS[0].id : COUNCILS[0].id);
  }

  const detail = useMemo(() => {
    if (tab === 'paul') return JOURNEYS.find((j) => j.id === sel) ?? null;
    if (tab === 'fathers') return FATHERS.find((f) => f.id === sel) ?? null;
    return COUNCILS.find((c) => c.id === sel) ?? null;
  }, [tab, sel]);

  const tabs: { id: Tab; label: string }[] = [
    { id: 'paul', label: t('paulJourneys') },
    { id: 'fathers', label: t('churchFathers') },
    { id: 'councils', label: t('councils') },
  ];

  return (
    <div className="fixed inset-0 z-[2000] flex flex-col bg-cream">
      <div className="flex flex-none items-center justify-between gap-3 border-b border-teal/10 bg-teal px-4 py-3 text-cream">
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 24 24" className="h-5 w-5 text-gold" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 3v18M7 8h10M5 21h14" /></svg>
          <div className="font-display text-lg font-semibold leading-tight">{t('churchMode')}</div>
        </div>
        <button onClick={onExit} className="rounded-lg bg-gold px-3 py-1.5 text-sm font-medium text-teal transition hover:bg-gold-deep">
          {t('exit')} ✕
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        {/* left */}
        <div className="scroll-soft flex w-full flex-col overflow-y-auto border-b border-teal/10 md:w-[40%] md:max-w-md md:border-b-0 md:border-r">
          <div className="sticky top-0 z-10 flex gap-1 border-b border-teal/10 bg-cream/95 p-2 backdrop-blur">
            {tabs.map((tb) => (
              <button
                key={tb.id}
                onClick={() => switchTab(tb.id)}
                className={`flex-1 rounded-lg px-2 py-1.5 text-xs font-medium transition ${
                  tab === tb.id ? 'bg-teal text-cream' : 'text-ink-soft hover:bg-cream-2'
                }`}
              >
                {tb.label}
              </button>
            ))}
          </div>

          <div className="p-3">
            {/* list */}
            {tab === 'paul' && (
              <div className="space-y-1.5">
                {JOURNEYS.map((j) => (
                  <button
                    key={j.id}
                    onClick={() => setSel(j.id)}
                    className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left transition ${sel === j.id ? 'bg-cream-2 ring-1 ring-teal/20' : 'hover:bg-cream-2'}`}
                  >
                    <span className="h-3 w-3 flex-none rounded-full" style={{ background: j.color }} />
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-teal">{lang === 'de' ? j.de.title : j.en.title}</span>
                      <span className="text-[11px] text-ink-soft">{j.date} · {j.ref}</span>
                    </span>
                  </button>
                ))}
              </div>
            )}

            {tab === 'fathers' && (
              <>
                <div className="mb-2 flex flex-wrap gap-2 px-1">
                  {(['west', 'east', 'orient'] as Tradition[]).map((tr) => (
                    <span key={tr} className="flex items-center gap-1 text-[11px] text-ink-soft">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: TRADITION_COLOR[tr] }} />
                      {lang === 'de' ? TRADITION_LABEL[tr].de : TRADITION_LABEL[tr].en}
                    </span>
                  ))}
                </div>
                <div className="space-y-1">
                  {FATHERS.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setSel(f.id)}
                      className={`flex w-full items-center gap-2 rounded-xl px-3 py-1.5 text-left transition ${sel === f.id ? 'bg-cream-2 ring-1 ring-teal/20' : 'hover:bg-cream-2'}`}
                    >
                      <span className="h-2.5 w-2.5 flex-none rounded-full" style={{ background: TRADITION_COLOR[f.tradition] }} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-ink">{f.name}</span>
                        <span className="text-[11px] text-ink-soft">{f.city} · {f.years}</span>
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
                    className={`flex w-full items-center gap-2 rounded-xl px-3 py-1.5 text-left transition ${sel === c.id ? 'bg-cream-2 ring-1 ring-teal/20' : 'hover:bg-cream-2'}`}
                  >
                    <span className="grid h-6 w-6 flex-none place-items-center rounded-full bg-gold/30 text-[10px] font-semibold text-teal">{c.year.slice(0, 4)}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-ink">{c.name}</span>
                      <span className="text-[11px] text-ink-soft">{c.city}</span>
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* detail */}
            {detail && (
              <div className="mt-4 rounded-xl bg-cream-2/50 p-3">
                {'stops' in detail ? (
                  <>
                    <div className="font-display text-base font-semibold text-teal">{lang === 'de' ? detail.de.title : detail.en.title}</div>
                    <div className="text-[11px] text-ink-soft">{detail.date} · {detail.ref}</div>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink">{lang === 'de' ? detail.de.text : detail.en.text}</p>
                    <div className="mt-2 text-[11px] text-ink-soft">{detail.stops.map((s) => s.name).join(' → ')}</div>
                  </>
                ) : 'years' in detail ? (
                  <>
                    <div className="font-display text-base font-semibold text-teal">{detail.name}</div>
                    <div className="text-[11px] text-ink-soft">{detail.city} · {detail.years} · {lang === 'de' ? TRADITION_LABEL[detail.tradition].de : TRADITION_LABEL[detail.tradition].en}</div>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink">{lang === 'de' ? detail.de.note : detail.en.note}</p>
                  </>
                ) : (
                  <>
                    <div className="font-display text-base font-semibold text-teal">{detail.name} · {detail.year}</div>
                    <div className="text-[11px] text-ink-soft">{detail.city}</div>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink">{lang === 'de' ? detail.de.note : detail.en.note}</p>
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
