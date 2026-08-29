import { useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import '../lib/mapStyles';
import { localizeMap } from '../lib/mapLocale';
import { watchTiles } from '../lib/tileNotice';
import { basemapAttr } from '../lib/basemaps';
import { addBasemap } from '../lib/basemapLayer';
import { flyOptions } from '../lib/motion';
import type { Place } from '../types';
import type { Lang } from '../i18n';
import { useT } from '../i18n';
import { placeName } from '../lib/places';
import { distanceKm, formatKm } from '../lib/route';
import { ERA_BY_ID } from '../data/eras';
import { erasForPlace } from '../lib/places';
import { buildRound, type Level, type Question } from '../lib/quiz';

interface Props {
  places: Place[];
  lang: Lang;
  onExit: () => void;
}

const ROUNDS = 8;
// Das Quiz braucht eine Karte OHNE Beschriftung – sonst steht die Antwort
// darauf. Bis CARTO einen Schlüssel verlangte, war das `dark_nolabels`; jetzt
// ist es das ebenfalls unbeschriftete Terrain Light von EOX.
const TILES = 'relief' as const;

/** Punkte nach Entfernung – nah dran zählt, auf den Meter genau muss niemand. */
function scoreFor(km: number): number {
  if (km <= 25) return 100;
  if (km <= 75) return 70;
  if (km <= 150) return 40;
  if (km <= 300) return 15;
  return 0;
}

export default function QuizMode({ places, lang, onExit }: Props) {
  const t = useT();
  const [level, setLevel] = useState<Level | null>(null);
  const [mix, setMix] = useState(true);
  const [round, setRound] = useState<Question[]>([]);
  const [i, setI] = useState(0);
  const [guess, setGuess] = useState<{ lat: number; lon: number; km: number; points: number } | null>(null);
  /** Antwort auf eine Wissensfrage: welche Möglichkeit, und stimmte sie. */
  const [picked, setPicked] = useState<number | null>(null);
  const [points, setPoints] = useState<number[]>([]);

  const el = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  /** Abmelder der Kachelwache – ohne ihn bleibt der Hinweis an einer alten Ebene hängen. */
  const tileWatchRef = useRef<(() => void) | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);
  const guessRef = useRef(guess);
  guessRef.current = guess;
  const question = round[i] ?? null;
  const target = question?.kind === 'where' ? question.place : null;
  const whereRef = useRef(false);
  whereRef.current = question?.kind === 'where';
  const done = level !== null && i >= round.length;
  const total = points.reduce((a, b) => a + b, 0);

  useEffect(() => {
    if (!el.current || mapRef.current || level === null) return;
    const map = L.map(el.current, {
      center: [31.8, 35.2],
      zoom: 7,
      minZoom: 5,
      maxZoom: 11,
      zoomControl: true,
      // Ohne Beschriftung – sonst steht die Antwort auf der Karte.
    });
    const kacheln = addBasemap(map, TILES);
    tileWatchRef.current = watchTiles(kacheln, map, lang);
    layerRef.current = L.layerGroup().addTo(map);
    map.on('click', (e: L.LeafletMouseEvent) => {
      if (guessRef.current || !whereRef.current) return; // aufgelöst oder Wissensfrage
      setGuess({ lat: e.latlng.lat, lon: e.latlng.lng, km: 0, points: 0 });
    });
    mapRef.current = map;
    return () => {
      tileWatchRef.current?.();
      tileWatchRef.current = null;
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
  }, [level]);

  // Leaflet beschriftet Zoom und Fenster selbst – auf Englisch. Diese eine
  // Zeile holt die Namen aus derselben Sprachdatei wie der Rest.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    return localizeMap(map, lang, basemapAttr(TILES, lang));
  }, [lang, level]);

  // Tipp auswerten, sobald er gesetzt ist
  useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!map || !layer || !guess || !target || guess.km > 0) return;

    const km = distanceKm([guess.lat, guess.lon], [target.lat, target.lon]);
    const pts = scoreFor(km);
    setGuess({ ...guess, km, points: pts });
    setPoints((p) => [...p, pts]);

    const color = ERA_BY_ID[erasForPlace(target)[0] ?? '']?.color ?? '#e0a449';
    L.polyline(
      [
        [guess.lat, guess.lon],
        [target.lat, target.lon],
      ],
      { color: '#e0a449', weight: 2, dashArray: '3 6' },
    ).addTo(layer);
    L.marker([guess.lat, guess.lon], {
      icon: L.divIcon({ className: '', html: '<div class="bm-quiz-guess"></div>', iconSize: [14, 14], iconAnchor: [7, 7] }),
    }).addTo(layer);
    L.marker([target.lat, target.lon], {
      icon: L.divIcon({
        className: '',
        html: `<div class="bm-mspot bm-mspot--active" style="--c:${color};width:22px;height:22px"></div>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      }),
    })
      .bindTooltip(placeName(target, lang), { direction: 'top', offset: [0, -14], className: 'bm-mtip' })
      .addTo(layer)
      .openTooltip();
    map.flyToBounds(
      L.latLngBounds([
        [guess.lat, guess.lon],
        [target.lat, target.lon],
      ]).pad(0.5),
      flyOptions({ maxZoom: 9, duration: 0.7 }),
    );
  }, [guess, target, lang]);

  function start(l: Level) {
    setLevel(l);
    setRound(buildRound(places, l, mix, lang, ROUNDS));
    setI(0);
    setPoints([]);
    setGuess(null);
    setPicked(null);
  }

  function next() {
    layerRef.current?.clearLayers();
    setGuess(null);
    setPicked(null);
    setI((v) => v + 1);
    mapRef.current?.flyTo([31.8, 35.2], 7, flyOptions({ duration: 0.6 }));
  }

  /** Antwort auf eine Wissensfrage: werten, Ort zeigen. */
  function answer(index: number) {
    if (picked !== null || question?.kind !== 'choice') return;
    setPicked(index);
    setPoints((p) => [...p, index === question.answer ? 100 : 0]);
    const map = mapRef.current;
    const layer = layerRef.current;
    if (map && layer) {
      L.marker(question.at, {
        icon: L.divIcon({
          className: '',
          html: `<div class="bm-mspot bm-mspot--active" style="--c:#e0a449;width:22px;height:22px"></div>`,
          iconSize: [22, 22],
          iconAnchor: [11, 11],
        }),
      })
        .bindTooltip(question.subject, { direction: 'top', offset: [0, -14], className: 'bm-mtip' })
        .addTo(layer)
        .openTooltip();
      map.flyTo(question.at, 6, flyOptions({ duration: 0.8 }));
    }
  }

  const levels: { id: Level; label: string; hint: string }[] = useMemo(
    () => [
      { id: 'easy', label: t('quizEasy'), hint: t('quizEasyHint') },
      { id: 'normal', label: t('quizNormal'), hint: t('quizNormalHint') },
      { id: 'hard', label: t('quizHard'), hint: t('quizHardHint') },
    ],
    [t],
  );

  /* ---- Auswahl ------------------------------------------------------ */
  if (level === null) {
    return (
      <div className="fixed inset-0 z-[2000] flex flex-col bg-deepest">
        <Bar title={t('quiz')} onExit={onExit} />
        {/* Centred, not stacked at the top: the choice is the whole screen, and
            hanging it under the bar made the empty half look like a cut-off
            page rather than a composition. */}
        <div className="scroll-soft flex min-h-0 flex-1 flex-col justify-center overflow-y-auto px-5 py-8">
          <div className="mx-auto w-full max-w-2xl">
            <div className="bm-eyebrow">{t('quizStartKicker')}</div>
            <h2 className="mt-3 font-display text-[11vw] font-black uppercase leading-[0.96] tracking-[-0.025em] text-white sm:text-[46px]">
              <span className="block">{t('quizStartLead1')}</span>
              <span className="bm-outline block leading-[1.04] text-gold">{t('quizStartLead2')}</span>
            </h2>
            <p className="mt-5 max-w-prose text-sm leading-relaxed text-white/70">{t('quizHint')}</p>

            <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-white/10 pt-5">
              <span className="min-w-0 flex-1">
                <span className="block text-[13.5px] font-bold text-white">{t('quizMix')}</span>
                <span className="mt-0.5 block text-[12px] text-white/60">{t('quizMixHint')}</span>
              </span>
              {/* A real switch: two states side by side, one of them lit. The
                  single word "An" in mint did not read as something you set. */}
              <div className="bm-seg flex-none">
                <button onClick={() => setMix(false)} aria-pressed={!mix} className={mix ? '' : 'is-on'}>
                  {t('off')}
                </button>
                <button onClick={() => setMix(true)} aria-pressed={mix} className={mix ? 'is-on' : ''}>
                  {t('on')}
                </button>
              </div>
            </div>

            <div className="bm-eyebrow mt-7 text-white/45">{t('quizPickLevel')}</div>
            <div className="mt-2.5 space-y-2">
              {levels.map((l) => (
                <button
                  key={l.id}
                  onClick={() => start(l.id)}
                  className="flex w-full items-center justify-between gap-4 border-l-[3px] border-gold bg-white/5 px-4 py-3.5 text-left transition hover:bg-white/10"
                >
                  <span>
                    <span className="block font-display text-lg uppercase text-white">{l.label}</span>
                    <span className="mt-0.5 block text-[13px] text-white/60">{l.hint}</span>
                  </span>
                  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 flex-none text-gold" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h13M13 6l6 6-6 6" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ---- Auswertung --------------------------------------------------- */
  if (done) {
    const best = Math.max(...points, 0);
    const hits = points.filter((p) => p === 100).length;
    return (
      <div className="fixed inset-0 z-[2000] flex flex-col bg-deepest">
        <Bar title={t('quiz')} onExit={onExit} />
        <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-5 py-8 text-center">
          <div className="bm-eyebrow text-gold">{t('quizResult')}</div>
          <div className="bm-num my-3 text-7xl text-white">{total}</div>
          <div className="text-sm text-white/60">
            {t('quizOf')} {ROUNDS * 100} · {hits} {t('quizBullseyes')} · {t('quizBest')} {best}
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            <button onClick={() => start(level)} className="bm-btn bm-btn-gold">
              {t('quizAgain')}
            </button>
            <button onClick={() => setLevel(null)} className="bm-btn bm-btn-ghost">
              {t('quizLevel')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ---- Runde -------------------------------------------------------- */
  const resolved = guess && guess.km > 0;
  const choice = question?.kind === 'choice' ? question : null;
  return (
    <div className="fixed inset-0 z-[2000] flex flex-col bg-deepest">
      <Bar
        title={t('quiz')}
        subtitle={`${i + 1} / ${ROUNDS} · ${total} ${t('quizPoints')}`}
        onExit={onExit}
      />
      <div className="relative min-h-0 flex-1">
        <div ref={el} className="absolute inset-0 h-full w-full" />

        {/* Frage / Auflösung */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[1200] flex justify-center p-3">
          <div className="bm-panel pointer-events-auto max-w-md px-5 py-3 text-center">
            {choice ? (
              <>
                <div className="bm-eyebrow bm-eyebrow-dim">{choice.prompt}</div>
                <div className="mt-1 font-display text-lg uppercase leading-tight text-white">{choice.subject}</div>
                <div className="mt-2.5 grid gap-1.5">
                  {choice.options.map((opt, idx) => {
                    const isRight = idx === choice.answer;
                    const shown = picked !== null;
                    return (
                      <button
                        key={opt}
                        onClick={() => answer(idx)}
                        disabled={shown}
                        className={`px-3 py-2 text-left text-[13px] font-medium transition ${
                          shown
                            ? isRight
                              ? 'bg-signal text-white'
                              : idx === picked
                                ? 'bg-clay/60 text-white'
                                : 'bg-white/5 text-white/40'
                            : 'bg-white/8 text-white hover:bg-white/16'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
                {picked !== null && (
                  <>
                    <p className="mt-2.5 text-[12.5px] leading-relaxed text-white/70">{choice.explain}</p>
                    <button onClick={next} className="bm-btn bm-btn-gold mt-3">
                      {i + 1 >= ROUNDS ? t('quizResult') : t('next')} ›
                    </button>
                  </>
                )}
              </>
            ) : resolved ? (
              <>
                <div className="bm-eyebrow" style={{ color: guess.points >= 70 ? '#7fe3d5' : '#e0a449' }}>
                  {guess.points === 100 ? t('quizBullseye') : guess.points > 0 ? t('quizClose') : t('quizMiss')}
                </div>
                <div className="mt-1 font-display text-xl uppercase text-white">{placeName(target!, lang)}</div>
                <div className="mt-1 text-[13px] text-white/70">
                  {formatKm(guess.km, lang)} {t('quizAway')} · +{guess.points} {t('quizPoints')}
                </div>
                <button onClick={next} className="bm-btn bm-btn-gold mt-3">
                  {i + 1 >= ROUNDS ? t('quizResult') : t('next')} ›
                </button>
              </>
            ) : (
              <>
                <div className="bm-eyebrow bm-eyebrow-dim">{t('quizWhereIs')}</div>
                <div className="mt-1 font-display text-2xl uppercase text-white">{placeName(target!, lang)}</div>
                <div className="mt-1 text-[12px] text-white/50">{t('quizClickMap')}</div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Bar({ title, subtitle, onExit }: { title: string; subtitle?: string; onExit: () => void }) {
  const t = useT();
  return (
    <div className="flex flex-none flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b border-white/10 bg-abyss px-5 py-3.5 text-white">
      <div className="flex items-center gap-2">
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 text-gold" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 17h.01M9.5 9a2.5 2.5 0 1 1 3.6 2.2c-.7.4-1.1 1-1.1 1.8" />
          <circle cx="12" cy="12" r="9" />
        </svg>
        <div>
          <div className="font-display text-xl uppercase leading-none">{title}</div>
          {subtitle && <div className="mt-1 text-[11px] text-white/55">{subtitle}</div>}
        </div>
      </div>
      <button onClick={onExit} className="bm-btn bm-btn-gold">
        {t('exit')} ✕
      </button>
    </div>
  );
}
