import { useEffect, useMemo, useRef, useState } from 'react';
import type { Place } from '../types';
import type { Lang } from '../i18n';
import { useT } from '../i18n';
import {
  JOURNEYS,
  JOURNEY_BY_ID,
  PHASES,
  PHASE_BY_ID,
  SPREAD_EVENTS,
  TODAY_FACTS,
  eventsInPhase,
  passageUrl,
  wikiUrl,
  type MissionJourney,
  type SpreadEvent,
} from '../data/mission';
import MissionMap, { type MissionMarker, type MissionRoute } from './MissionMap';
import RouteMap from './RouteMap';
import { formatKm, legDistances, type LatLon } from '../lib/route';
import ShareLink from './ShareLink';
import { readableOnDark } from '../lib/contrast';

interface Props {
  places: Place[];
  lang: Lang;
  onShowPlace: (place: Place) => void;
  /** Phase, Reise und Ereignis aus der Adresse (Deep-Link). */
  initial?: { phase: string; journey?: string; event?: string } | null;
  /** Meldet den Stand, damit die Adresse mitläuft. */
  onNavigate?: (state: { phase: string; journey: string; event?: string }) => void;
  /** Dieselbe Route über dem Gelände – dort sieht man die Pässe und Küsten. */
  onOpenTerrain?: (id: string) => void;
  onExit: () => void;
}

/** Ein Eintrag der linken Liste – Reisestation oder Ereignis der Ausbreitung. */
interface Item {
  key: string;
  lat: number;
  lon: number;
  label: string;
  badge?: number;
  from?: [number, number];
}

const PHASE_ORDER: Record<string, number> = Object.fromEntries(PHASES.map((p, i) => [p.id, i]));

/** Die Phasen der Ausbreitung, ohne die Reisen – sie tragen den Zeitregler. */
const SPREAD_PHASES = PHASES.filter((p) => p.id !== 'journeys');
const FIRST_YEAR = SPREAD_PHASES[0].from;
const LAST_YEAR = SPREAD_PHASES[SPREAD_PHASES.length - 1].to;

function phaseForYear(y: number): string {
  const hit = SPREAD_PHASES.find((p) => y >= p.from && y <= p.to);
  return hit?.id ?? (y < FIRST_YEAR ? SPREAD_PHASES[0].id : SPREAD_PHASES[SPREAD_PHASES.length - 1].id);
}

function journeyItems(journey: MissionJourney, lang: Lang): Item[] {
  return journey.stops.map((s, i) => ({
    key: `${journey.id}:${i}`,
    lat: s.lat,
    lon: s.lon,
    label: lang === 'de' ? s.de : s.en,
    badge: i + 1,
  }));
}

function eventItems(events: SpreadEvent[], lang: Lang): Item[] {
  return events.map((e) => ({
    key: e.id,
    lat: e.lat,
    lon: e.lon,
    label: lang === 'de' ? e.de : e.en,
    from: e.from,
  }));
}

export default function Mission({
  places,
  lang,
  onShowPlace,
  initial,
  onNavigate,
  onOpenTerrain,
  onExit,
}: Props) {
  const t = useT();
  const [phaseId, setPhaseId] = useState(() =>
    initial && PHASE_BY_ID[initial.phase] ? initial.phase : 'journeys',
  );
  const [journeyId, setJourneyId] = useState(() =>
    initial?.journey && JOURNEY_BY_ID[initial.journey] ? initial.journey : JOURNEYS[0].id,
  );
  const [selected, setSelected] = useState<string | null>(initial?.event ?? null);
  const [playing, setPlaying] = useState(false);
  /** Zeitregler: null = ganze Phase zeigen, sonst Stand des Zeitraffers. */
  const [year, setYear] = useState<number | null>(null);
  const [fit, setFit] = useState<{ points: [number, number][]; key: number } | null>(null);
  const [focus, setFocus] = useState<{ lat: number; lon: number; zoom?: number; key: number } | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const navRef = useRef(onNavigate);
  navRef.current = onNavigate;
  useEffect(() => {
    navRef.current?.({
      phase: phaseId,
      journey: journeyId,
      // In den Ausbreitungsphasen ist die Auswahl ein Ereignis – das gehört
      // in die Adresse, damit ein Treffer der Suche verlinkbar bleibt.
      event: phaseId === 'journeys' ? undefined : selected ?? undefined,
    });
  }, [phaseId, journeyId, selected]);

  const phase = PHASE_BY_ID[phaseId];
  const isJourneys = phaseId === 'journeys';
  const journey = JOURNEY_BY_ID[journeyId];
  const phaseEvents = useMemo(() => eventsInPhase(phaseId), [phaseId]);

  const placeById = useMemo(() => new Map(places.map((p) => [p.id, p])), [places]);

  const items = useMemo(
    () => (isJourneys ? journeyItems(journey, lang) : eventItems(phaseEvents, lang)),
    [isJourneys, journey, phaseEvents, lang],
  );

  // Alles, was in früheren Phasen schon geschehen ist – blass als Hintergrund.
  const pastEvents = useMemo(
    () => SPREAD_EVENTS.filter((e) => (PHASE_ORDER[e.phase] ?? 0) < (PHASE_ORDER[phaseId] ?? 0)),
    [phaseId],
  );

  const markers = useMemo<MissionMarker[]>(() => {
    if (!isJourneys && year !== null) {
      // Zeitraffer: alles, was bis zu diesem Jahr geschehen ist. Was gerade
      // geschieht, leuchtet; was länger her ist, verblasst.
      return SPREAD_EVENTS.filter((e) => e.year <= year).map((e) => ({
        id: e.id,
        lat: e.lat,
        lon: e.lon,
        label: lang === 'de' ? e.de : e.en,
        color: PHASE_BY_ID[e.phase]?.color ?? '#1f3d3a',
        tone: e.id === selected ? 'active' : year - e.year <= 80 ? 'current' : 'past',
        from: e.from,
      }));
    }
    const past: MissionMarker[] = pastEvents.map((e) => ({
      id: e.id,
      lat: e.lat,
      lon: e.lon,
      label: lang === 'de' ? e.de : e.en,
      color: PHASE_BY_ID[e.phase]?.color ?? '#1f3d3a',
      tone: 'past',
    }));
    const current: MissionMarker[] = items.map((it) => ({
      id: it.key,
      lat: it.lat,
      lon: it.lon,
      label: it.label,
      color: isJourneys ? journey.color : phase.color,
      tone: it.key === selected ? 'active' : 'current',
      badge: it.badge,
      from: it.from,
    }));
    return [...past, ...current];
  }, [pastEvents, items, selected, isJourneys, journey, phase, lang, year]);

  const activeIndex = useMemo(() => {
    if (!isJourneys || !selected) return 0;
    const i = items.findIndex((it) => it.key === selected);
    return i < 0 ? 0 : i;
  }, [isJourneys, selected, items]);

  const routes = useMemo<MissionRoute[]>(() => {
    if (!isJourneys) return [];
    return JOURNEYS.map((j) => ({
      id: j.id,
      color: j.color,
      points: j.stops.map((s) => [s.lat, s.lon] as [number, number]),
      dim: j.id !== journeyId,
    }));
  }, [isJourneys, journeyId]);

  const journeyStops = useMemo(
    () => journey.stops.map((st) => ({ lat: st.lat, lon: st.lon, label: lang === 'de' ? st.de : st.en })),
    [journey, lang],
  );
  const otherJourneys = useMemo(
    () =>
      JOURNEYS.filter((j) => j.id !== journeyId).map((j) => ({
        points: j.stops.map((st) => [st.lat, st.lon] as LatLon),
        color: j.color,
      })),
    [journeyId],
  );
  const journeyLegs = useMemo(
    () => legDistances(journey.stops.map((st) => [st.lat, st.lon] as LatLon)),
    [journey],
  );

  // Beim Wechsel von Phase oder Reise den Ausschnitt neu setzen
  // Die Auswahl fällt nur, wenn Phase oder Reise sich wirklich ändern – ein
  // verlinktes Ereignis überlebt so auch den doppelten Effektlauf im
  // Entwicklungsmodus.
  const lastKey = useRef(`${phaseId}|${journeyId}`);
  useEffect(() => {
    const pts = items.map((i) => [i.lat, i.lon] as [number, number]);
    for (const i of items) if (i.from) pts.push(i.from);
    const key = `${phaseId}|${journeyId}`;
    if (key !== lastKey.current) setSelected(null);
    lastKey.current = key;
    panelRef.current?.scrollTo({ top: 0 });
    if (pts.length) setFit({ points: pts, key: Date.now() });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phaseId, journeyId]);

  useEffect(() => {
    if (!selected) return;
    const el = panelRef.current?.querySelector(`[data-item="${CSS.escape(selected)}"]`);
    el?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, [selected]);

  function pick(key: string) {
    setYear(null); // von Hand gewählt: der Zeitraffer tritt zurück
    setSelected(key);
    if (isJourneys) return; // die Reisekarte führt den Ausschnitt selbst nach
    const it = items.find((i) => i.key === key);
    if (it) setFocus({ lat: it.lat, lon: it.lon, zoom: 4, key: Date.now() });
  }

  /** Reise zu Ende gespielt: die nächste, sonst die nächste Phase. */
  function afterJourney() {
    const ji = JOURNEYS.findIndex((j) => j.id === journeyId);
    if (ji < JOURNEYS.length - 1) {
      setJourneyId(JOURNEYS[ji + 1].id);
      return;
    }
    const pi = PHASES.findIndex((p) => p.id === phaseId);
    if (pi < PHASES.length - 1) setPhaseId(PHASES[pi + 1].id);
    else setPlaying(false);
  }

  /** Einen Schritt weiter – über Reisen und Phasen hinweg. */
  function step(delta: number) {
    const idx = selected ? items.findIndex((i) => i.key === selected) : -1;
    const next = idx + delta;
    if (next >= 0 && next < items.length) {
      pick(items[next].key);
      return true;
    }
    if (delta < 0) return false;
    // Ende der Liste: nächste Reise, sonst nächste Phase
    if (isJourneys) {
      const ji = JOURNEYS.findIndex((j) => j.id === journeyId);
      if (ji < JOURNEYS.length - 1) {
        setJourneyId(JOURNEYS[ji + 1].id);
        return true;
      }
    }
    const pi = PHASES.findIndex((p) => p.id === phaseId);
    if (pi < PHASES.length - 1) {
      setPhaseId(PHASES[pi + 1].id);
      return true;
    }
    return false;
  }

  const stepRef = useRef(step);
  stepRef.current = step;

  // Abspielen der Ausbreitung: als Zeitraffer über die Jahrhunderte. Jede
  // Phase bekommt dabei ungefähr gleich viel Zeit – sonst kröchen die vier
  // Jahrhunderte des Römischen Reiches und die Moderne bliebe ein Wimpernschlag.
  useEffect(() => {
    if (!playing || isJourneys) return;
    const id = window.setInterval(() => {
      setYear((y) => {
        const cur = y ?? PHASE_BY_ID[phaseId]?.from ?? FIRST_YEAR;
        const p = PHASE_BY_ID[phaseForYear(cur)];
        const perTick = Math.max(1, Math.round((p.to - p.from) / 100));
        const next = cur + perTick;
        if (next >= LAST_YEAR) {
          setPlaying(false);
          return LAST_YEAR;
        }
        return next;
      });
    }, 110);
    return () => window.clearInterval(id);
  }, [playing, isJourneys, phaseId]);

  // Der Zeitregler führt die Phase und die Auswahl mit sich.
  useEffect(() => {
    if (year === null || isJourneys) return;
    const p = phaseForYear(year);
    if (p !== phaseId) setPhaseId(p);
    const reached = SPREAD_EVENTS.filter((e) => e.year <= year);
    const newest = reached[reached.length - 1];
    if (newest && newest.id !== selected) setSelected(newest.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 'ArrowRight') stepRef.current(1);
      else if (e.key === 'ArrowLeft') stepRef.current(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="fixed inset-0 z-[2000] flex flex-col bg-deepest">
      {/* Kopfzeile */}
      <div className="flex flex-none items-center justify-between gap-3 border-b border-white/10 bg-abyss px-5 py-3.5 text-white">
        <div className="flex items-center gap-2">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 flex-none text-gold" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18" />
          </svg>
          <div>
            <div className="font-display text-xl uppercase leading-none">{t('mission')}</div>
            <div className="mt-1 hidden text-[11px] text-white/55 sm:block">{t('missionSub')}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Nur in der Reisephase: die Ausbreitung ist keine Route, die man
              über ein Gelände legen könnte. */}
          {onOpenTerrain && phaseId === 'journeys' && journey && (
            <button
              onClick={() => onOpenTerrain(journey.id)}
              className="bm-btn hidden sm:inline-flex"
              title={t('terrainView')}
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M3 18l5-8 4 5 3-4 6 7z" />
              </svg>
              {t('terrain')}
            </button>
          )}
          <ShareLink className="bm-btn hidden sm:inline-flex" />
          <button onClick={() => setPlaying((p) => !p)} className="bm-btn">
            {playing ? (
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M6 5h4v14H6zm8 0h4v14h-4z" /></svg>
            ) : (
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M7 4v16l13-8z" /></svg>
            )}
            {playing ? t('pause') : t('play')}
          </button>
          <button onClick={onExit} className="bm-btn bm-btn-gold">
            {t('exit')} ✕
          </button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        {/* Liste */}
        <div
          ref={panelRef}
          className="scroll-soft flex w-full flex-col overflow-y-auto border-b border-white/10 md:w-[26rem] md:flex-none md:border-b-0 md:border-r"
        >
          <div className="border-b border-white/10 px-5 py-5">
            <div className="bm-eyebrow mb-2" style={{ color: readableOnDark(phase.color) }}>
              {lang === 'de' ? phase.range.de : phase.range.en}
            </div>
            <h2 className="font-display text-3xl uppercase leading-[0.95] text-white">
              {lang === 'de' ? phase.de : phase.en}
            </h2>
            <p className="mt-3 max-w-prose text-[14px] leading-relaxed text-white/70">
              {lang === 'de' ? phase.lead.de : phase.lead.en}
            </p>
          </div>

          {isJourneys ? (
            <JourneyList
              journey={journey}
              journeyId={journeyId}
              onJourney={setJourneyId}
              lang={lang}
              selected={selected}
              onSelect={pick}
              placeById={placeById}
              onShowPlace={onShowPlace}
              legs={journeyLegs}
            />
          ) : (
            <EventList
              events={phaseEvents}
              lang={lang}
              selected={selected}
              onSelect={pick}
              color={phase.color}
            />
          )}

          {phaseId === 'modern' && <Facts lang={lang} />}
        </div>

        {/* Karte */}
        <div className="relative min-h-[45vh] flex-1">
          {isJourneys ? (
            <RouteMap
              key={journeyId}
              stops={journeyStops}
              color={journey.color}
              context={otherJourneys}
              activeIndex={activeIndex}
              playing={playing}
              onArrive={(i) => setSelected(items[i]?.key ?? null)}
              onFinish={afterJourney}
              onSelect={(i) => pick(items[i].key)}
            />
          ) : (
            <MissionMap markers={markers} routes={routes} fit={fit} focus={focus} onSelect={pick} />
          )}
        </div>
      </div>

      {/* Zeitregler: das Jahr als Schieber über die ganze Ausbreitung */}
      {!isJourneys && (
        <div className="flex flex-none items-center gap-3 border-t border-white/10 bg-abyss px-4 py-2">
          <span className="bm-num w-16 flex-none text-lg" style={{ color: readableOnDark(phase.color) }}>
            {year ?? phase.to}
          </span>
          <input
            type="range"
            min={FIRST_YEAR}
            max={LAST_YEAR}
            value={year ?? phase.to}
            onChange={(e) => setYear(Number(e.target.value))}
            className="h-1 w-full accent-[var(--color-gold)]"
            aria-label={t('year')}
          />
          <button
            onClick={() => setYear(null)}
            disabled={year === null}
            className="bm-btn bm-btn-ghost flex-none disabled:opacity-30"
          >
            {t('wholePhase')}
          </button>
        </div>
      )}

      {/* Zeitleiste der Phasen */}
      <div className="scroll-soft flex flex-none gap-px overflow-x-auto border-t border-white/10 bg-abyss px-2 py-2">
        {PHASES.map((p) => {
          const on = p.id === phaseId;
          return (
            <button
              key={p.id}
              onClick={() => {
                setYear(null);
                setPhaseId(p.id);
              }}
              style={on ? { background: p.color } : undefined}
              className={`flex-none border-t-2 px-3 py-1.5 text-left transition ${
                on ? 'text-white' : 'border-transparent text-white/55 hover:bg-white/8 hover:text-white'
              }`}
            >
              <span className="block text-[12.5px] font-bold leading-tight">{lang === 'de' ? p.de : p.en}</span>
              <span className={`block text-[10px] ${on ? 'text-white/75' : 'text-white/40'}`}>
                {lang === 'de' ? p.range.de : p.range.en}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function JourneyList({
  journey,
  journeyId,
  onJourney,
  lang,
  selected,
  onSelect,
  placeById,
  onShowPlace,
  legs,
}: {
  journey: MissionJourney;
  journeyId: string;
  onJourney: (id: string) => void;
  lang: Lang;
  selected: string | null;
  onSelect: (key: string) => void;
  placeById: Map<string, Place>;
  onShowPlace: (p: Place) => void;
  legs: number[];
}) {
  const t = useT();
  return (
    <div className="px-5 py-4">
      <div className="mb-3 flex flex-wrap gap-1.5">
        {JOURNEYS.map((j) => (
          <button
            key={j.id}
            onClick={() => onJourney(j.id)}
            style={j.id === journeyId ? { background: j.color } : undefined}
            className={`px-3 py-1.5 text-[11.5px] font-bold transition ${
              j.id === journeyId ? 'text-white' : 'bg-white/8 text-white/70 hover:bg-white/16 hover:text-white'
            }`}
          >
            {lang === 'de' ? j.de : j.en}
          </button>
        ))}
      </div>

      <div className="mb-4 border-l-2 pl-3.5" style={{ borderColor: journey.color }}>
        <div className="flex items-baseline justify-between gap-2">
          <span className="font-display text-lg uppercase leading-tight text-white">
            {lang === 'de' ? journey.de : journey.en}
          </span>
          <span className="text-[11px] text-white/45">{lang === 'de' ? journey.years.de : journey.years.en}</span>
        </div>
        <p className="mt-1.5 text-[14px] leading-relaxed text-white/70">
          {lang === 'de' ? journey.summary.de : journey.summary.en}
        </p>
        <a
          href={passageUrl(lang === 'de' ? journey.passage.de : journey.passage.en, lang)}
          target="_blank"
          rel="noreferrer"
          className="bm-btn bm-btn-signal mt-2.5"
        >
          {lang === 'de' ? journey.passage.de : journey.passage.en}
        </a>
      </div>

      <ol className="space-y-1">
        {journey.stops.map((s, i) => {
          const key = `${journey.id}:${i}`;
          const active = key === selected;
          const place = s.placeId ? placeById.get(s.placeId) : undefined;
          return (
            <li key={key} data-item={key}>
              {i > 0 && legs[i - 1] !== undefined && (
                <div className="py-0.5 pl-10 text-[11px] text-white/35">↓ {formatKm(legs[i - 1], lang)}</div>
              )}
              <button
                onClick={() => onSelect(key)}
                className={`flex w-full items-start gap-2.5 px-2.5 py-2 text-left transition ${
                  active ? 'bg-deep' : 'hover:bg-white/6'
                }`}
              >
                <span
                  // Rückwege stehen als Umriss: dann trägt die Zahl die Farbe
                  // und braucht sie lesbar. Rand und Fläche bleiben voll.
                  style={{ background: s.back ? 'transparent' : journey.color, color: s.back ? readableOnDark(journey.color) : '#fff', borderColor: journey.color }}
                  className="bm-num mt-0.5 grid h-6 w-6 flex-none place-items-center border text-[11px]"
                >
                  {i + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13.5px] font-bold leading-snug text-white">{lang === 'de' ? s.de : s.en}</span>
                  {s.ref && <span className="block text-[11px] text-gold">{lang === 'de' ? s.ref.de : s.ref.en}</span>}
                  {s.note && active && (
                    <span className="mt-1 block text-[13px] leading-relaxed text-white/70">
                      {lang === 'de' ? s.note.de : s.note.en}
                    </span>
                  )}
                </span>
              </button>
              {active && place && (
                <button
                  onClick={() => onShowPlace(place)}
                  className="bm-btn bm-btn-ghost ml-11 mt-1"
                >
                  {t('showOnMap')} →
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function EventList({
  events,
  lang,
  selected,
  onSelect,
  color,
}: {
  events: SpreadEvent[];
  lang: Lang;
  selected: string | null;
  onSelect: (key: string) => void;
  color: string;
}) {
  const t = useT();
  return (
    <ol className="px-5 py-4">
      {events.map((e) => {
        const active = e.id === selected;
        return (
          <li key={e.id} data-item={e.id} className="relative pl-6">
            {/* Zeitstrahl */}
            <span className="absolute left-[7px] top-0 h-full w-px bg-white/12" aria-hidden />
            <span
              style={{ background: active ? color : 'transparent', borderColor: color }}
              className="absolute left-[2px] top-4 h-3 w-3 rounded-full border-2"
              aria-hidden
            />
            <button
              onClick={() => onSelect(e.id)}
              className={`w-full px-3 py-2.5 text-left transition ${
                active ? 'bg-deep' : 'hover:bg-white/6'
              }`}
            >
              <span className="bm-eyebrow block text-gold">{lang === 'de' ? e.when.de : e.when.en}</span>
              <span className="mt-0.5 block font-display text-[15px] uppercase leading-snug text-white">
                {lang === 'de' ? e.de : e.en}
              </span>
              <span className="mt-1 block text-[13px] leading-relaxed text-white/70">
                {lang === 'de' ? e.text.de : e.text.en}
              </span>
            </button>
            {active && e.topic && (
              <a
                href={wikiUrl(lang === 'de' ? e.topic : (e.topicEn ?? e.topic), lang)}
                target="_blank"
                rel="noreferrer"
                className="bm-btn bm-btn-ghost ml-3 mt-1"
              >
                {t('lookUp')} →
              </a>
            )}
          </li>
        );
      })}
    </ol>
  );
}

function Facts({ lang }: { lang: Lang }) {
  const t = useT();
  return (
    <div className="border-t border-white/10 px-5 py-5">
      <h3 className="font-display text-lg uppercase text-white">{t('missionToday')}</h3>
      <dl className="mt-3 space-y-2">
        {TODAY_FACTS.map((f) => (
          <div key={f.label.en} className="flex items-baseline justify-between gap-3 border-b border-white/8 pb-2">
            <dt className="text-[12.5px] text-white/55">{lang === 'de' ? f.label.de : f.label.en}</dt>
            <dd className="text-right text-[12.5px] font-bold text-white">{lang === 'de' ? f.value.de : f.value.en}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 text-[11px] leading-relaxed text-white/45">{t('missionFactsNote')}</p>
    </div>
  );
}
