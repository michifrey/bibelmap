import { useEffect, useMemo, useState } from 'react';
import type { Place } from '../types';
import type { Lang } from '../i18n';
import { useT } from '../i18n';
import { findPlacesByNames } from '../lib/places';
import { bibleGatewayUrl } from '../data/books';
import { ERA_BY_ID } from '../data/eras';
import { HISTORY } from '../data/history';
import MapView from './MapView';
import YouTubeEmbed from './YouTubeEmbed';

interface Props {
  places: Place[];
  lang: Lang;
  onExit: () => void;
}

export default function HistoryMode({ places, lang, onExit }: Props) {
  const t = useT();
  const [i, setI] = useState(0);
  const [selected, setSelected] = useState<Place | null>(null);
  const [showVideo, setShowVideo] = useState(false);

  const m = HISTORY[i];
  const era = ERA_BY_ID[m.era];
  const stops = useMemo(() => findPlacesByNames(places, m.places), [places, m]);

  useEffect(() => {
    setSelected(null);
    setShowVideo(false);
  }, [i]);

  function go(d: number) {
    setI((v) => Math.min(HISTORY.length - 1, Math.max(0, v + d)));
  }
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="fixed inset-0 z-[2000] flex flex-col bg-cream">
      {/* bar */}
      <div className="flex flex-none items-center justify-between gap-3 border-b border-teal/10 bg-teal px-4 py-3 text-cream">
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 24 24" className="h-5 w-5 text-gold" fill="currentColor"><path d="M12 8v5l4 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2" fill="none"/></svg>
          <div className="font-display text-lg font-semibold leading-tight">{t('historyMode')}</div>
        </div>
        <button onClick={onExit} className="rounded-lg bg-gold px-3 py-1.5 text-sm font-medium text-teal transition hover:bg-gold-deep">
          {t('exit')} ✕
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        {/* narrative */}
        <div className="scroll-soft flex w-full flex-col overflow-y-auto border-b border-teal/10 md:w-[42%] md:max-w-xl md:border-b-0 md:border-r">
          <div className="px-5 py-5">
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-full px-2.5 py-1 text-[11px] font-medium text-cream" style={{ background: era?.color }}>
                {lang === 'de' ? era?.de : era?.en}
              </span>
              <span className="text-xs text-ink-soft">{m.date}</span>
            </div>
            <h2 className="font-display text-3xl font-semibold leading-tight text-teal">{lang === 'de' ? m.de.title : m.en.title}</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink">{lang === 'de' ? m.de.text : m.en.text}</p>

            <div className="mt-4 flex flex-wrap gap-1.5">
              <a
                href={bibleGatewayUrl(m.ref.osis, m.ref.chapter, lang === 'de' ? 'LUTH1545' : 'ESV')}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg bg-teal px-3 py-1.5 text-xs font-medium text-cream transition hover:bg-teal-2"
              >
                {m.ref.label}
              </a>
              {m.video && (
                <button
                  onClick={() => setShowVideo((v) => !v)}
                  className="inline-flex items-center gap-1 rounded-lg bg-clay px-3 py-1.5 text-xs font-medium text-cream transition hover:bg-gold-deep"
                >
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                  {t('video')}
                </button>
              )}
            </div>

            {showVideo && m.video && (
              <div className="mt-3">
                <YouTubeEmbed ids={[m.video]} title={lang === 'de' ? m.de.title : m.en.title} />
              </div>
            )}

            {stops.length > 0 && (
              <div className="mt-5">
                <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink-soft">{t('placesOnMap')}</div>
                <div className="flex flex-wrap gap-1.5">
                  {stops.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelected(p)}
                      className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${
                        selected?.id === p.id ? 'bg-teal text-cream' : 'bg-cream-2 text-teal hover:bg-gold/30'
                      }`}
                    >
                      {p.name.replace(/ \d+$/, '')}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* nav */}
          <div className="sticky bottom-0 mt-auto flex items-center justify-between gap-2 border-t border-teal/10 bg-cream/95 px-5 py-3 backdrop-blur">
            <button
              onClick={() => go(-1)}
              disabled={i <= 0}
              className="rounded-lg bg-cream-2 px-3 py-1.5 text-sm font-medium text-teal transition hover:bg-gold/30 disabled:opacity-30"
            >
              ‹ {t('prev')}
            </button>
            <span className="text-xs text-ink-soft">{i + 1} / {HISTORY.length}</span>
            <button
              onClick={() => go(1)}
              disabled={i >= HISTORY.length - 1}
              className="rounded-lg bg-cream-2 px-3 py-1.5 text-sm font-medium text-teal transition hover:bg-gold/30 disabled:opacity-30"
            >
              {t('next')} ›
            </button>
          </div>
        </div>

        {/* map */}
        <div className="relative min-h-[40vh] flex-1">
          <MapView
            places={stops}
            heat={false}
            selectedId={selected?.id ?? null}
            lang={lang}
            onSelect={setSelected}
            fitPlaces={stops}
            flyTo={selected ? { lat: selected.lat, lon: selected.lon, zoom: 8, key: Date.now() } : null}
          />
        </div>
      </div>
    </div>
  );
}
