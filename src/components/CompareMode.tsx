import { useMemo, useState } from 'react';
import type { Place } from '../types';
import type { Lang } from '../i18n';
import { useT } from '../i18n';
import { findPlacesByNames } from '../lib/places';
import { COMPARE, type CompareFigure } from '../data/compare';
import MapView from './MapView';

interface Props {
  places: Place[];
  lang: Lang;
  onExit: () => void;
}

function RefCard({ title, color, refs }: { title: string; color: string; refs: string }) {
  return (
    <div className="rounded-xl border border-teal/10 bg-cream-2/40 p-3">
      <div className="mb-1 flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
        <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-soft">{title}</span>
      </div>
      <div className="text-sm font-medium text-ink">{refs}</div>
    </div>
  );
}

export default function CompareMode({ places, lang, onExit }: Props) {
  const t = useT();
  const [sel, setSel] = useState<CompareFigure>(COMPARE[0]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const stops = useMemo(() => findPlacesByNames(places, sel.places ?? []), [places, sel]);

  return (
    <div className="fixed inset-0 z-[2000] flex flex-col bg-cream">
      <div className="flex flex-none items-center justify-between gap-3 border-b border-teal/10 bg-teal px-4 py-3 text-cream">
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 24 24" className="h-5 w-5 text-gold" fill="currentColor"><path d="M12 3v18M5 8l-3 5h6zM19 8l-3 5h6z" stroke="currentColor" strokeWidth="1.6" fill="none"/></svg>
          <div className="font-display text-lg font-semibold leading-tight">{t('compareMode')}</div>
        </div>
        <button onClick={onExit} className="rounded-lg bg-gold px-3 py-1.5 text-sm font-medium text-teal transition hover:bg-gold-deep">
          {t('exit')} ✕
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        {/* figure list */}
        <div className="scroll-soft w-full overflow-y-auto border-b border-teal/10 p-2 md:w-64 md:border-b-0 md:border-r">
          <div className="grid grid-cols-2 gap-1.5 md:grid-cols-1">
            {COMPARE.map((f) => (
              <button
                key={f.id}
                onClick={() => {
                  setSel(f);
                  setSelectedPlace(null);
                }}
                className={`rounded-xl px-3 py-2 text-left transition ${
                  sel.id === f.id ? 'bg-teal text-cream' : 'hover:bg-cream-2'
                }`}
              >
                <span className="block text-sm font-medium leading-tight">{lang === 'de' ? f.de.name : f.en.name}</span>
                <span className={`text-[11px] ${sel.id === f.id ? 'text-cream/75' : 'text-ink-soft'}`}>{f.islamName}</span>
              </button>
            ))}
          </div>
        </div>

        {/* detail */}
        <div className="scroll-soft min-h-0 flex-1 overflow-y-auto px-5 py-5">
          <p className="mb-4 rounded-xl bg-gold/15 px-3 py-2 text-[12px] leading-relaxed text-ink-soft">{t('compareIntro')}</p>

          <h2 className="font-display text-3xl font-semibold leading-tight text-teal">{lang === 'de' ? sel.de.name : sel.en.name}</h2>
          <div className="mt-0.5 text-sm text-ink-soft">{t('inIslam')}: {sel.islamName}</div>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink">{lang === 'de' ? sel.de.note : sel.en.note}</p>

          <div className="mt-5 grid gap-2 sm:grid-cols-3">
            <RefCard title={t('judaism')} color="#3a6ea8" refs={sel.refs.tanakh} />
            <RefCard title={t('christianity')} color="#2f8f7f" refs={sel.refs.christian} />
            <RefCard title={t('islam')} color="#5c8a3a" refs={sel.refs.quran} />
          </div>

          {stops.length > 0 && (
            <div className="mt-5">
              <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink-soft">{t('placesOnMap')}</div>
              <div className="relative h-64 overflow-hidden rounded-xl ring-1 ring-teal/10">
                <MapView
                  places={stops}
                  heat={false}
                  selectedId={selectedPlace?.id ?? null}
                  lang={lang}
                  onSelect={setSelectedPlace}
                  fitPlaces={stops}
                  flyTo={selectedPlace ? { lat: selectedPlace.lat, lon: selectedPlace.lon, zoom: 8, key: Date.now() } : null}
                />
              </div>
            </div>
          )}

          <p className="mt-5 max-w-2xl text-[11px] leading-relaxed text-ink-soft">{t('compareDisclaimer')}</p>
        </div>
      </div>
    </div>
  );
}
