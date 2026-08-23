import { useEffect, useMemo, useRef, useState } from 'react';
import type { Place } from '../types';
import type { Lang } from '../i18n';
import { useT } from '../i18n';
import { JOURNEYS, JOURNEY_BY_ID, type BibleJourney } from '../data/journeys';
import { ERAS, ERA_BY_ID } from '../data/eras';
import { passageUrl } from '../data/mission';
import { formatKm, legDistances, walkingDays, type LatLon } from '../lib/route';
import { readableOnDark } from '../lib/contrast';
import RouteMap from './RouteMap';
import ShareLink from './ShareLink';

interface Props {
  places: Place[];
  lang: Lang;
  onShowPlace: (place: Place) => void;
  /** Reise und Station aus der Adresse (Deep-Link). */
  initial?: { id: string; stop: number } | null;
  /** Meldet Reise und Station, damit die Adresse mitläuft. */
  onNavigate?: (state: { id: string; stop: number } | null) => void;
  /** Paulus’ Reisen stehen im Missionsmodus – dorthin verweisen statt doppeln. */
  onOpenMission?: () => void;
  /** Dieselbe Route über dem Gelände – dort sieht man die Pässe. */
  onOpenTerrain?: (id: string) => void;
  onExit: () => void;
}

/** Luftlinie der ganzen Route – für die Auswahlkarten. */
function journeyKm(j: BibleJourney): number {
  return legDistances(j.stops.map((s) => [s.lat, s.lon] as LatLon)).reduce((a, b) => a + b, 0);
}

export default function JourneyMode({
  places,
  lang,
  onShowPlace,
  initial,
  onNavigate,
  onOpenMission,
  onOpenTerrain,
  onExit,
}: Props) {
  const t = useT();
  const [id, setId] = useState<string | null>(initial && JOURNEY_BY_ID[initial.id] ? initial.id : null);
  const [index, setIndex] = useState(() => {
    if (!initial || !JOURNEY_BY_ID[initial.id]) return 0;
    return Math.max(0, Math.min(JOURNEY_BY_ID[initial.id].stops.length - 1, initial.stop));
  });
  const [playing, setPlaying] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const navRef = useRef(onNavigate);
  navRef.current = onNavigate;
  useEffect(() => {
    navRef.current?.(id ? { id, stop: index } : null);
  }, [id, index]);

  const journey = id ? JOURNEY_BY_ID[id] : null;
  const era = journey ? ERA_BY_ID[journey.era] : null;
  const color = era?.color ?? '#e0a449';
  const placeById = useMemo(() => new Map(places.map((p) => [p.id, p])), [places]);

  const legs = useMemo(
    () => (journey ? legDistances(journey.stops.map((s) => [s.lat, s.lon] as LatLon)) : []),
    [journey],
  );
  const totalKm = useMemo(() => legs.reduce((a, b) => a + b, 0), [legs]);

  const stops = useMemo(
    () => (journey ? journey.stops.map((s) => ({ lat: s.lat, lon: s.lon, label: lang === 'de' ? s.de : s.en })) : []),
    [journey, lang],
  );

  function open(j: BibleJourney) {
    setId(j.id);
    setIndex(0);
    setPlaying(false);
  }
  function go(delta: number) {
    if (!journey) return;
    setPlaying(false);
    setIndex((i) => Math.max(0, Math.min(journey.stops.length - 1, i + delta)));
  }

  const goRef = useRef(go);
  goRef.current = go;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 'ArrowRight') goRef.current(1);
      else if (e.key === 'ArrowLeft') goRef.current(-1);
      else if (e.key === ' ') {
        e.preventDefault();
        setPlaying((p) => !p);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // die erzählte Station in den Blick holen – wichtig beim Abspielen
  useEffect(() => {
    const el = panelRef.current?.querySelector(`[data-stop="${index}"]`);
    el?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, [index]);

  /* ---- Auswahl ------------------------------------------------------ */
  if (!journey) {
    return (
      <div className="fixed inset-0 z-[2000] flex flex-col bg-deepest">
        <Bar title={t('journeys')} onExit={onExit} />
        <div className="scroll-soft mx-auto w-full max-w-5xl flex-1 overflow-y-auto px-5 py-6">
          {/* Die Zahlen tragen den Kopf: wie viel hier eigentlich liegt. */}
          <div className="mb-6 flex flex-wrap items-end gap-x-8 gap-y-3">
            <p className="max-w-prose flex-1 text-sm leading-relaxed text-white/70">{t('journeysHint')}</p>
            <div className="flex flex-none gap-6">
              {[
                [JOURNEYS.length, t('journeyCount')],
                [JOURNEYS.reduce((n, j) => n + j.stops.length, 0), t('stations')],
                [formatKm(JOURNEYS.reduce((n, j) => n + journeyKm(j), 0), lang), t('journeyWay')],
              ].map(([value, label]) => (
                <div key={String(label)}>
                  <div className="bm-num text-2xl text-gold">{value}</div>
                  <div className="bm-eyebrow mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {ERAS.filter((e) => JOURNEYS.some((j) => j.era === e.id)).map((e) => (
            <section key={e.id} className="mb-7">
              {/* Aufgehellt fürs Lesen – die volle Farbe steht als Fläche daneben. */}
              <div className="bm-eyebrow mb-2.5 flex items-center gap-2" style={{ color: readableOnDark(e.color) }}>
                <span className="h-2.5 w-2.5" style={{ background: e.color }} />
                {lang === 'de' ? e.de : e.en}
                <span className="bm-eyebrow-dim">{e.range}</span>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {JOURNEYS.filter((j) => j.era === e.id).map((j) => (
                  <button
                    key={j.id}
                    onClick={() => open(j)}
                    className="border-l-2 bg-white/5 px-4 py-3 text-left transition hover:bg-white/10"
                    style={{ borderColor: e.color }}
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="font-display text-base uppercase leading-tight text-white">
                        {lang === 'de' ? j.de : j.en}
                      </span>
                      <span className="flex-none text-[11px] text-white/45">{lang === 'de' ? j.when.de : j.when.en}</span>
                    </div>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-white/65">{lang === 'de' ? j.lead.de : j.lead.en}</p>
                    <div className="mt-2 text-[11px] font-bold text-gold">
                      {j.stops.length} {t('stations')} · {formatKm(journeyKm(j), lang)} · {lang === 'de' ? j.passage.de : j.passage.en}
                    </div>
                  </button>
                ))}
              </div>
            </section>
          ))}

          {onOpenMission && (
            <button
              onClick={onOpenMission}
              className="flex w-full items-center justify-between gap-2 border-t border-white/10 px-1 py-3 text-left transition hover:bg-white/6"
            >
              <span className="text-[12px] text-white/60">{t('paulJourneysMoved')}</span>
              <span className="text-[12px] font-bold text-gold">{t('mission')} →</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  /* ---- Erzählung ---------------------------------------------------- */
  const stop = journey.stops[index];
  const place = stop.placeId ? placeById.get(stop.placeId) : undefined;

  return (
    <div className="bm-print-root fixed inset-0 z-[2000] flex flex-col bg-deepest">
      <Bar
        title={lang === 'de' ? journey.de : journey.en}
        subtitle={`${lang === 'de' ? era?.de : era?.en} · ${lang === 'de' ? journey.when.de : journey.when.en}`}
        onBack={() => setId(null)}
        backLabel={t('allJourneys')}
        onPrint={() => window.print()}
        onTerrain={onOpenTerrain ? () => onOpenTerrain(journey.id) : undefined}
        onExit={onExit}
      />

      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        {/* Erzählung */}
        <div
          ref={panelRef}
          className="bm-print-sheet scroll-soft flex w-full flex-col overflow-y-auto border-b border-white/10 md:w-[26rem] md:flex-none md:border-b-0 md:border-r"
        >
          <div className="bm-print-only mb-4 border-b px-5 pb-3 pt-1">
            <div className="text-[10px] uppercase tracking-widest">
              {lang === 'de' ? era?.de : era?.en} · {lang === 'de' ? journey.when.de : journey.when.en}
            </div>
            <h1 className="font-display text-2xl uppercase">{lang === 'de' ? journey.de : journey.en}</h1>
            <div className="text-[11px]">
              {lang === 'de' ? journey.passage.de : journey.passage.en} · {formatKm(totalKm, lang)} ·{' '}
              {walkingDays(totalKm)} {t('dayWalks')} · bibelmap
            </div>
          </div>

          <div className="border-b border-white/10 px-5 py-3 md:py-4">
            {/* Auf dem Telefon zählt jede Zeile – der Anriss stand schon in der Auswahl. */}
            <p className="hidden max-w-prose text-[14px] leading-relaxed text-white/70 md:block">
              {lang === 'de' ? journey.lead.de : journey.lead.en}
            </p>
            <div className="bm-noprint flex flex-wrap items-center gap-x-3 gap-y-1 md:mt-3">
              <a
                href={passageUrl(lang === 'de' ? journey.passage.de : journey.passage.en, lang)}
                target="_blank"
                rel="noreferrer"
                className="bm-btn bm-btn-signal"
              >
                {lang === 'de' ? journey.passage.de : journey.passage.en}
              </a>
              <span className="text-[12px] text-white/55" title={t('distanceNote')}>
                {t('totalDistance')} {formatKm(totalKm, lang)} · {walkingDays(totalKm)} {t('dayWalks')}
              </span>
            </div>
          </div>

          <ol className="px-4 py-3">
            {journey.stops.map((s, i) => {
              const active = i === index;
              return (
                <li key={`${s.de}-${i}`} data-stop={i} className="relative pl-7">
                  <span className="absolute left-[11px] top-0 h-full w-px bg-white/12" aria-hidden />
                  {i > 0 && (
                    <div className="py-1 pl-3 text-[11px] text-white/40" title={t('distanceNote')}>
                      ↓ {formatKm(legs[i - 1], lang)}
                      {s.sea
                        ? ` · ${t('bySea')}`
                        : ` · ${walkingDays(legs[i - 1])} ${walkingDays(legs[i - 1]) === 1 ? t('dayWalk') : t('dayWalks')}`}
                    </div>
                  )}
                  <span
                    style={{ background: active ? color : 'transparent', borderColor: color }}
                    className="bm-num absolute left-0 top-3 grid h-[22px] w-[22px] place-items-center rounded-full border-2 text-[10px] text-white"
                  >
                    {i + 1}
                  </span>
                  <button
                    onClick={() => {
                      setPlaying(false);
                      setIndex(i);
                    }}
                    className={`w-full px-3 py-2.5 text-left transition ${active ? 'bg-deep' : 'hover:bg-white/6'}`}
                  >
                    <span className="block font-display text-[15px] uppercase leading-snug text-white">
                      {lang === 'de' ? s.de : s.en}
                    </span>
                    {s.ref && <span className="bm-eyebrow block text-gold">{lang === 'de' ? s.ref.de : s.ref.en}</span>}
                    <span className={`mt-1 block text-[13px] leading-relaxed ${active ? 'text-white/85' : 'text-white/55'}`}>
                      {lang === 'de' ? s.text.de : s.text.en}
                    </span>
                  </button>
                  {active && place && (
                    <button onClick={() => onShowPlace(place)} className="bm-noprint bm-btn bm-btn-ghost ml-3 mb-2 mt-1">
                      {t('showOnMap')} →
                    </button>
                  )}
                </li>
              );
            })}
            <li className="pl-7 pt-2">
              <p className="px-3 text-[11px] leading-relaxed text-white/40">{t('distanceNote')}</p>
            </li>
          </ol>

          {/* Steuerung */}
          <div className="bm-noprint sticky bottom-0 mt-auto border-t border-white/10 bg-abyss px-4 py-3">
            <div className="flex items-center justify-between gap-2">
              <button onClick={() => go(-1)} disabled={index === 0} className="bm-btn bm-btn-ghost">
                ‹ {t('prev')}
              </button>
              <button onClick={() => setPlaying((p) => !p)} className="bm-btn bm-btn-gold">
                {playing ? (
                  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M6 5h4v14H6zm8 0h4v14h-4z" /></svg>
                ) : (
                  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M7 4v16l13-8z" /></svg>
                )}
                {playing ? t('pause') : index >= journey.stops.length - 1 ? t('replay') : t('play')}
              </button>
              <button onClick={() => go(1)} disabled={index >= journey.stops.length - 1} className="bm-btn bm-btn-ghost">
                {t('next')} ›
              </button>
            </div>
            <div className="mt-2.5 flex items-center gap-2">
              <div className="h-1 flex-1 bg-white/10">
                <div
                  className="h-full transition-all duration-500"
                  style={{ width: `${(index / (journey.stops.length - 1)) * 100}%`, background: color }}
                />
              </div>
              <span className="bm-num text-[11px] text-white/50">
                {index + 1}/{journey.stops.length}
              </span>
            </div>
          </div>
        </div>

        {/* Karte */}
        <div className="bm-noprint relative min-h-[45vh] flex-1">
          <RouteMap
            stops={stops}
            color={color}
            activeIndex={index}
            playing={playing}
            onArrive={setIndex}
            onFinish={() => setPlaying(false)}
            onSelect={(i) => {
              setPlaying(false);
              setIndex(i);
            }}
          />
        </div>
      </div>
    </div>
  );
}

function Bar({
  title,
  subtitle,
  onBack,
  backLabel,
  onPrint,
  onTerrain,
  onExit,
}: {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  backLabel?: string;
  onPrint?: () => void;
  onTerrain?: () => void;
  onExit: () => void;
}) {
  const t = useT();
  return (
    <div className="bm-noprint flex flex-none flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b border-white/10 bg-abyss px-5 py-3.5 text-white">
      <div className="flex min-w-0 items-center gap-3">
        {onBack && (
          <button onClick={onBack} className="bm-btn bm-btn-ghost flex-none">
            ‹ {backLabel}
          </button>
        )}
        <div className="min-w-0">
          <div className="truncate font-display text-xl uppercase leading-none">{title}</div>
          {subtitle && <div className="mt-1 truncate text-[11px] text-white/55">{subtitle}</div>}
        </div>
      </div>
      <div className="bm-noprint flex flex-none items-center gap-2">
        {onPrint && (
          <button onClick={onPrint} className="bm-btn hidden sm:inline-flex" title={t('printHint')}>
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M7 9V4h10v5M7 19H5v-6h14v6h-2M8 15h8v5H8z" />
            </svg>
            {t('print')}
          </button>
        )}
        {/* Der Weg ins Gelände: dieselbe Route, nur mit Höhen. */}
        {onTerrain && (
          <button onClick={onTerrain} className="bm-btn hidden sm:inline-flex" title={t('terrainView')}>
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M3 18l5-8 4 5 3-4 6 7z" />
            </svg>
            {t('terrain')}
          </button>
        )}
        <ShareLink className="bm-btn hidden sm:inline-flex" />
        <button onClick={onExit} className="bm-btn bm-btn-gold">
          {t('exit')} ✕
        </button>
      </div>
    </div>
  );
}
