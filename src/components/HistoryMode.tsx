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
    <div className="fixed inset-0 z-[2000] flex flex-col bg-deepest">
      {/* bar */}
      <div className="flex flex-none items-center justify-between gap-3 border-b border-white/10 bg-abyss px-5 py-3.5 text-white">
        <div className="flex items-center gap-2">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 text-gold" fill="currentColor"><path d="M12 8v5l4 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2" fill="none"/></svg>
          <div className="font-display text-xl uppercase leading-none">{t('historyMode')}</div>
        </div>
        <button onClick={onExit} className="bm-btn bm-btn-gold">
          {t('exit')} ✕
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        {/* narrative */}
        <div className="scroll-soft flex w-full flex-col overflow-y-auto border-b border-white/10 md:w-[42%] md:max-w-xl md:border-b-0 md:border-r">
          <div className="px-5 py-5">
            <div className="mb-4 flex items-baseline gap-3">
              <span className="bm-num text-4xl text-gold">{String(i + 1).padStart(2, '0')}</span>
              <span className="bm-eyebrow bm-eyebrow-dim">{t('historyStation')} / {HISTORY.length}</span>
            </div>
            <div className="mb-3 flex items-center gap-2">
              <span className="px-2.5 py-1 text-[11px] font-bold text-white" style={{ background: era?.color }}>
                {lang === 'de' ? era?.de : era?.en}
              </span>
              <span className="text-xs text-white/60">{m.date}</span>
            </div>
            <h2 className="font-display text-4xl uppercase leading-[0.95] text-white">{lang === 'de' ? m.de.title : m.en.title}</h2>
            <p className="mt-4 max-w-prose text-[15px] leading-relaxed text-white/80">{lang === 'de' ? m.de.text : m.en.text}</p>

            <div className="mt-4 flex flex-wrap gap-1.5">
              <a
                href={bibleGatewayUrl(m.ref.osis, m.ref.chapter, lang === 'de' ? 'LUTH1545' : 'ESV')}
                target="_blank"
                rel="noreferrer"
                className="bm-btn bm-btn-signal"
              >
                {m.ref.label}
              </a>
              {m.video && (
                <button
                  onClick={() => setShowVideo((v) => !v)}
                  className="bm-btn bm-btn-ghost"
                >
                  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
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
                <div className="bm-eyebrow mb-2">{t('placesOnMap')}</div>
                <div className="flex flex-wrap gap-1.5">
                  {stops.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelected(p)}
                      className={`px-3 py-1.5 text-[11.5px] font-bold transition ${ selected?.id === p.id ? 'bg-gold text-deep' : 'bg-white/8 text-white hover:bg-white/16' }`}
                    >
                      {p.name.replace(/ \d+$/, '')}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* nav */}
          <div className="sticky bottom-0 mt-auto border-t border-white/10 bg-abyss">
            <div className="flex h-1.5 w-full bg-white/8">
              <div className="h-full bg-gold transition-all" style={{ width: `${((i + 1) / HISTORY.length) * 100}%` }} />
            </div>
            <div className="flex items-center justify-between gap-2 px-5 py-3">
            <button
              onClick={() => go(-1)}
              disabled={i <= 0}
              className="bm-btn bm-btn-ghost"
            >
              ‹ {t('prev')}
            </button>
            <span className="bm-num text-sm text-white/50">{i + 1} / {HISTORY.length}</span>
            <button
              onClick={() => go(1)}
              disabled={i >= HISTORY.length - 1}
              className="bm-btn bm-btn-ghost"
            >
              {t('next')} ›
            </button>
          </div>
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
