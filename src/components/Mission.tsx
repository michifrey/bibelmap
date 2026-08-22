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

interface Props {
  places: Place[];
  lang: Lang;
  onShowPlace: (place: Place) => void;
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
const STEP_MS = 3200;

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

export default function Mission({ places, lang, onShowPlace, onExit }: Props) {
  const t = useT();
  const [phaseId, setPhaseId] = useState('journeys');
  const [journeyId, setJourneyId] = useState(JOURNEYS[0].id);
  const [selected, setSelected] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [fit, setFit] = useState<{ points: [number, number][]; key: number } | null>(null);
  const [focus, setFocus] = useState<{ lat: number; lon: number; zoom?: number; key: number } | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

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
  }, [pastEvents, items, selected, isJourneys, journey, phase, lang]);

  const routes = useMemo<MissionRoute[]>(() => {
    if (!isJourneys) return [];
    return JOURNEYS.map((j) => ({
      id: j.id,
      color: j.color,
      points: j.stops.map((s) => [s.lat, s.lon] as [number, number]),
      dim: j.id !== journeyId,
    }));
  }, [isJourneys, journeyId]);

  // Beim Wechsel von Phase oder Reise den Ausschnitt neu setzen
  useEffect(() => {
    const pts = items.map((i) => [i.lat, i.lon] as [number, number]);
    for (const i of items) if (i.from) pts.push(i.from);
    setSelected(null);
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
    setSelected(key);
    const it = items.find((i) => i.key === key);
    if (it) setFocus({ lat: it.lat, lon: it.lon, zoom: isJourneys ? 7 : 4, key: Date.now() });
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

  // Abspielen: Station für Station durch die ganze Geschichte
  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      if (!stepRef.current(1)) setPlaying(false);
    }, STEP_MS);
    return () => window.clearInterval(id);
  }, [playing]);

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
    <div className="fixed inset-0 z-[2000] flex flex-col bg-cream">
      {/* Kopfzeile */}
      <div className="flex flex-none items-center justify-between gap-3 border-b border-teal/10 bg-teal px-4 py-3 text-cream">
        <div>
          <div className="font-display text-lg font-semibold leading-tight">{t('mission')}</div>
          <div className="hidden text-[11px] text-cream/75 sm:block">{t('missionSub')}</div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPlaying((p) => !p)}
            className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-sm transition hover:bg-white/20"
          >
            {playing ? (
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M6 5h4v14H6zm8 0h4v14h-4z" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M7 4v16l13-8z" /></svg>
            )}
            {playing ? t('pause') : t('play')}
          </button>
          <button
            onClick={onExit}
            className="rounded-lg bg-gold px-3 py-1.5 text-sm font-medium text-teal transition hover:bg-gold-deep"
          >
            {t('exit')} ✕
          </button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        {/* Liste */}
        <div
          ref={panelRef}
          className="scroll-soft flex w-full flex-col overflow-y-auto border-b border-teal/10 md:w-[26rem] md:flex-none md:border-b-0 md:border-r"
        >
          <div className="border-b border-teal/10 px-5 py-4">
            <div className="flex items-baseline gap-2">
              <h2 className="font-display text-xl font-semibold text-teal">{lang === 'de' ? phase.de : phase.en}</h2>
              <span className="text-xs text-ink-soft">{lang === 'de' ? phase.range.de : phase.range.en}</span>
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{lang === 'de' ? phase.lead.de : phase.lead.en}</p>
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
          <MissionMap markers={markers} routes={routes} fit={fit} focus={focus} onSelect={pick} />
        </div>
      </div>

      {/* Zeitleiste der Phasen */}
      <div className="scroll-soft flex flex-none gap-1.5 overflow-x-auto border-t border-teal/10 bg-cream-2/60 px-3 py-2">
        {PHASES.map((p) => (
          <button
            key={p.id}
            onClick={() => setPhaseId(p.id)}
            className={`flex-none rounded-xl px-3 py-1.5 text-left transition ${
              p.id === phaseId ? 'bg-teal text-cream' : 'bg-cream text-teal hover:bg-gold/25'
            }`}
          >
            <span className="block text-sm font-medium leading-tight">{lang === 'de' ? p.de : p.en}</span>
            <span className={`block text-[10px] ${p.id === phaseId ? 'text-cream/70' : 'text-ink-soft'}`}>
              {lang === 'de' ? p.range.de : p.range.en}
            </span>
          </button>
        ))}
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
}: {
  journey: MissionJourney;
  journeyId: string;
  onJourney: (id: string) => void;
  lang: Lang;
  selected: string | null;
  onSelect: (key: string) => void;
  placeById: Map<string, Place>;
  onShowPlace: (p: Place) => void;
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
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              j.id === journeyId ? 'text-cream' : 'bg-cream-2 text-teal hover:bg-gold/30'
            }`}
          >
            {lang === 'de' ? j.de : j.en}
          </button>
        ))}
      </div>

      <div className="mb-3 rounded-xl bg-cream-2/50 px-3.5 py-3">
        <div className="flex items-baseline justify-between gap-2">
          <span className="font-display text-base font-semibold text-teal">{lang === 'de' ? journey.de : journey.en}</span>
          <span className="text-[11px] text-ink-soft">{lang === 'de' ? journey.years.de : journey.years.en}</span>
        </div>
        <p className="mt-1 text-sm leading-relaxed text-ink-soft">{lang === 'de' ? journey.summary.de : journey.summary.en}</p>
        <a
          href={passageUrl(lang === 'de' ? journey.passage.de : journey.passage.en, lang)}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-block rounded-lg bg-teal px-2.5 py-1 text-xs font-medium text-cream transition hover:bg-teal-2"
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
              <button
                onClick={() => onSelect(key)}
                className={`flex w-full items-start gap-2.5 rounded-xl px-2.5 py-2 text-left transition ${
                  active ? 'bg-gold/25 ring-1 ring-gold' : 'hover:bg-cream-2/70'
                }`}
              >
                <span
                  style={{ background: s.back ? 'transparent' : journey.color, color: s.back ? journey.color : '#f7f1e6', borderColor: journey.color }}
                  className="mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-full border text-[11px] font-semibold"
                >
                  {i + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium leading-snug text-ink">{lang === 'de' ? s.de : s.en}</span>
                  {s.ref && <span className="block text-[11px] text-gold-deep">{lang === 'de' ? s.ref.de : s.ref.en}</span>}
                  {s.note && active && (
                    <span className="mt-1 block text-[13px] leading-relaxed text-ink-soft">
                      {lang === 'de' ? s.note.de : s.note.en}
                    </span>
                  )}
                </span>
              </button>
              {active && place && (
                <button
                  onClick={() => onShowPlace(place)}
                  className="ml-11 mt-1 rounded-lg bg-cream-2 px-2.5 py-1 text-[11px] font-medium text-teal transition hover:bg-gold/40"
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
            <span className="absolute left-[7px] top-0 h-full w-px bg-teal/15" aria-hidden />
            <span
              style={{ background: active ? color : '#efe6d6', borderColor: color }}
              className="absolute left-[2px] top-4 h-3 w-3 rounded-full border-2"
              aria-hidden
            />
            <button
              onClick={() => onSelect(e.id)}
              className={`w-full rounded-xl px-3 py-2.5 text-left transition ${
                active ? 'bg-gold/25 ring-1 ring-gold' : 'hover:bg-cream-2/70'
              }`}
            >
              <span className="block text-[11px] font-semibold uppercase tracking-wide text-gold-deep">
                {lang === 'de' ? e.when.de : e.when.en}
              </span>
              <span className="block font-display text-[15px] font-semibold leading-snug text-teal">
                {lang === 'de' ? e.de : e.en}
              </span>
              <span className="mt-1 block text-[13px] leading-relaxed text-ink-soft">
                {lang === 'de' ? e.text.de : e.text.en}
              </span>
            </button>
            {active && e.topic && (
              <a
                href={wikiUrl(lang === 'de' ? e.topic : (e.topicEn ?? e.topic), lang)}
                target="_blank"
                rel="noreferrer"
                className="ml-3 mt-1 inline-block rounded-lg bg-cream-2 px-2.5 py-1 text-[11px] font-medium text-teal transition hover:bg-gold/40"
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
    <div className="border-t border-teal/10 px-5 py-4">
      <h3 className="font-display text-base font-semibold text-teal">{t('missionToday')}</h3>
      <dl className="mt-2 space-y-1.5">
        {TODAY_FACTS.map((f) => (
          <div key={f.label.en} className="flex items-baseline justify-between gap-3 border-b border-teal/8 pb-1.5">
            <dt className="text-[13px] text-ink-soft">{lang === 'de' ? f.label.de : f.label.en}</dt>
            <dd className="text-right text-[13px] font-medium text-ink">{lang === 'de' ? f.value.de : f.value.en}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-2 text-[11px] leading-relaxed text-ink-soft">{t('missionFactsNote')}</p>
    </div>
  );
}
