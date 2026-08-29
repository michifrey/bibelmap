import { useEffect, useMemo, useRef, useState } from 'react';
import type { Place } from '../types';
import type { Lang } from '../i18n';
import { useT } from '../i18n';
import {
  ACTS,
  ACT_BY_ID,
  ACT_COUNTS,
  PEOPLE_WITH_SCENES,
  PERSON_BY_ID,
  STATIONS_BY_PERSON,
  STATION_BY_ID,
  stationsInAct,
  type GospelPerson,
  type GospelStation,
  type PersonGroup,
} from '../data/gospel';
import { CHOSEN_BY_STATION, CHOSEN_URL, VERIFIED as CHOSEN_VERIFIED, episodeLabel } from '../data/chosen';
import {
  BP_THEMES,
  BP_VIDEO_BY_ID,
  BT_BY_BOOK,
  bibleTunesEpisodeUrl,
  chapterOfRef,
  overviewVideo,
} from '../data/gospelMedia';
import { WITNESSES, WITNESSES_BY_STATION, type Witness } from '../data/witnesses';
import { passageUrl, wikiUrl } from '../data/mission';
import MissionMap, { type MissionMarker } from './MissionMap';
import RouteMap from './RouteMap';
import ShareLink from './ShareLink';
import { readableOnDark } from '../lib/contrast';

interface Props {
  places: Place[];
  lang: Lang;
  onShowPlace: (place: Place) => void;
  /** Akt, Station und Person aus der Adresse (Deep-Link). */
  initial?: { act: string; station?: string; person?: string } | null;
  /** Meldet den Stand, damit die Adresse mitläuft. */
  onNavigate?: (state: { act: string; station?: string; person?: string }) => void;
  /** Zu den Folgen, die dieses Kapitel behandeln – der eigene Medienindex. */
  onOpenMedia?: (osis: string, chapter: number) => void;
  onExit: () => void;
}

/** Reihenfolge und Überschriften der Personengruppen. */
const GROUPS: { id: PersonGroup; de: string; en: string }[] = [
  { id: 'family', de: 'Familie und erste Zeugen', en: 'Family and first witnesses' },
  { id: 'twelve', de: 'Die Zwölf', en: 'The Twelve' },
  { id: 'women', de: 'Frauen, die mitgehen', en: 'Women on the road' },
  { id: 'encounters', de: 'Begegnungen', en: 'Encounters' },
  { id: 'power', de: 'Macht: Rom, Hof und Hoherat', en: 'Power: Rome, court and council' },
];

export default function Gospel({ places, lang, onShowPlace, initial, onNavigate, onOpenMedia, onExit }: Props) {
  const t = useT();
  // Eine verlinkte Station bestimmt den Akt selbst: `#jesus=galilee,cana`
  // meint die Station, auch wenn der Akt daneben steht.
  const [actId, setActId] = useState(() => {
    const st = initial?.station ? STATION_BY_ID[initial.station] : undefined;
    if (st) return st.act;
    return initial && ACT_BY_ID[initial.act] ? initial.act : ACTS[0].id;
  });
  const [selected, setSelected] = useState<string | null>(
    initial?.station && STATION_BY_ID[initial.station] ? initial.station : null,
  );
  const [personId, setPersonId] = useState<string | null>(
    initial?.person && PERSON_BY_ID[initial.person] ? initial.person : null,
  );
  const [playing, setPlaying] = useState(false);
  /** Aufgeschlagenes Zeugnis in der Liste am Fuß der Sektion. */
  const [witness, setWitness] = useState<string | null>(null);
  const [fit, setFit] = useState<{ points: [number, number][]; key: number } | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const navRef = useRef(onNavigate);
  navRef.current = onNavigate;
  useEffect(() => {
    navRef.current?.({ act: actId, station: selected ?? undefined, person: personId ?? undefined });
  }, [actId, selected, personId]);

  const act = ACT_BY_ID[actId];
  const person = personId ? PERSON_BY_ID[personId] : null;
  const placeById = useMemo(() => new Map(places.map((p) => [p.id, p])), [places]);

  /** Was gerade in der Liste steht: der Akt – oder die Spur eines Menschen. */
  const items = useMemo<GospelStation[]>(
    () => (person ? STATIONS_BY_PERSON[person.id] ?? [] : stationsInAct(actId)),
    [person, actId],
  );

  const activeIndex = useMemo(() => {
    const i = items.findIndex((s) => s.id === selected);
    return i < 0 ? 0 : i;
  }, [items, selected]);

  const stops = useMemo(
    () => items.map((s) => ({ lat: s.lat, lon: s.lon, label: lang === 'de' ? s.de : s.en })),
    [items, lang],
  );

  /** Die übrigen Akte blass im Hintergrund – man sieht, wo man gerade ist. */
  const context = useMemo(
    () =>
      ACTS.filter((a) => a.id !== actId).map((a) => ({
        points: stationsInAct(a.id).map((s) => [s.lat, s.lon] as [number, number]),
        color: a.color,
      })),
    [actId],
  );

  const personMarkers = useMemo<MissionMarker[]>(
    () =>
      items.map((s, i) => ({
        id: s.id,
        lat: s.lat,
        lon: s.lon,
        label: lang === 'de' ? s.de : s.en,
        color: ACT_BY_ID[s.act]?.color ?? '#9a4ba0',
        tone: s.id === selected ? 'active' : 'current',
        badge: i + 1,
      })),
    [items, selected, lang],
  );

  // Wechsel von Akt oder Person: Liste nach oben, Ausschnitt neu setzen.
  const lastKey = useRef(`${actId}|${personId}`);
  useEffect(() => {
    const key = `${actId}|${personId}`;
    if (key !== lastKey.current) {
      setSelected(null);
      lastKey.current = key;
    }
    panelRef.current?.scrollTo({ top: 0 });
    const pts = items.map((s) => [s.lat, s.lon] as [number, number]);
    if (pts.length) setFit({ points: pts, key: Date.now() });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actId, personId]);

  useEffect(() => {
    if (!selected) return;
    const el = panelRef.current?.querySelector(`[data-item="${CSS.escape(selected)}"]`);
    el?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, [selected]);

  /** Akt zu Ende gespielt: der nächste, sonst stehen bleiben. */
  function afterAct() {
    const i = ACTS.findIndex((a) => a.id === actId);
    if (i < ACTS.length - 1) setActId(ACTS[i + 1].id);
    else setPlaying(false);
  }

  /** Ein Schritt weiter – über die Aktgrenze hinaus. */
  function step(delta: number) {
    const idx = selected ? items.findIndex((s) => s.id === selected) : -1;
    const next = idx + delta;
    if (next >= 0 && next < items.length) {
      setSelected(items[next].id);
      return;
    }
    if (delta < 0 || person) return;
    const i = ACTS.findIndex((a) => a.id === actId);
    if (i < ACTS.length - 1) setActId(ACTS[i + 1].id);
  }

  const stepRef = useRef(step);
  stepRef.current = step;
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
      <div className="flex flex-none flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b border-white/10 bg-abyss px-5 py-3.5 text-white">
        <div className="flex items-center gap-2">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 flex-none text-gold" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 3v18M7 8h10" />
          </svg>
          <div>
            <div className="font-display text-xl uppercase leading-none">{t('gospel')}</div>
            <div className="mt-1 hidden text-[11px] text-white/55 sm:block">{t('gospelSub')}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ShareLink className="bm-btn hidden sm:inline-flex" />
          {!person && (
            <button onClick={() => setPlaying((p) => !p)} className="bm-btn">
              {playing ? (
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M6 5h4v14H6zm8 0h4v14h-4z" /></svg>
              ) : (
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M7 4v16l13-8z" /></svg>
              )}
              {playing ? t('pause') : t('play')}
            </button>
          )}
          <button onClick={onExit} className="bm-btn bm-btn-gold">
            {t('exit')} ✕
          </button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        {/* Liste */}
        <div
          ref={panelRef}
          className="scroll-soft flex w-full flex-col overflow-y-auto border-b border-white/10 md:w-[27rem] md:flex-none md:border-b-0 md:border-r"
        >
          {person ? (
            <PersonHead person={person} lang={lang} count={items.length} onBack={() => setPersonId(null)} />
          ) : (
            <div className="border-b border-white/10 px-5 py-5">
              <div className="bm-eyebrow mb-2" style={{ color: readableOnDark(act.color) }}>
                {lang === 'de' ? act.range.de : act.range.en} · {ACT_COUNTS[act.id]} {t('gospelStations')}
              </div>
              <h2 className="font-display text-3xl uppercase leading-[0.95] text-white">
                {lang === 'de' ? act.de : act.en}
              </h2>
              <p className="mt-3 max-w-prose text-[14px] leading-relaxed text-white/70">
                {lang === 'de' ? act.lead.de : act.lead.en}
              </p>
            </div>
          )}

          <ol className="px-5 py-4">
            {items.map((s, i) => {
              const active = s.id === selected;
              const color = ACT_BY_ID[s.act]?.color ?? act.color;
              const place = s.placeId ? placeById.get(s.placeId) : undefined;
              const scenes = CHOSEN_BY_STATION[s.id] ?? [];
              const chapter = chapterOfRef(lang === 'de' ? s.ref.de : s.ref.en);
              const overview = chapter === undefined ? undefined : overviewVideo(s.book, chapter);
              const themes = (BP_THEMES[s.id] ?? []).map((id) => BP_VIDEO_BY_ID[id]).filter(Boolean);
              const bt = BT_BY_BOOK[s.book];
              const tunesUrl = chapter === undefined ? undefined : bibleTunesEpisodeUrl(s.book, chapter);
              const tunes = bt && tunesUrl ? { url: tunesUrl, book: bt.de, speaker: bt.speaker } : undefined;
              const found = WITNESSES_BY_STATION[s.id] ?? [];
              return (
                <li key={s.id} data-item={s.id}>
                  <button
                    onClick={() => setSelected(s.id)}
                    className={`flex w-full items-start gap-2.5 px-2.5 py-2 text-left transition ${
                      active ? 'bg-deep' : 'hover:bg-white/6'
                    }`}
                  >
                    <span
                      style={{ background: color }}
                      className="bm-num mt-0.5 grid h-6 w-6 flex-none place-items-center text-[11px] text-white"
                    >
                      {i + 1}
                    </span>
                    <span className="min-w-0 flex-1">
                      {/* In der Spur eines Menschen steht statt des Tages der
                          Akt – sonst wüsste man nicht, wo man gerade ist. */}
                      {(s.day || person) && (
                        <span className="bm-eyebrow block" style={{ color: readableOnDark(color) }}>
                          {s.day
                            ? lang === 'de'
                              ? s.day.de
                              : s.day.en
                            : lang === 'de'
                              ? ACT_BY_ID[s.act]?.de
                              : ACT_BY_ID[s.act]?.en}
                        </span>
                      )}
                      <span className="block text-[13.5px] font-bold leading-snug text-white">
                        {lang === 'de' ? s.de : s.en}
                      </span>
                      <span className="block text-[11px] text-white/45">{lang === 'de' ? s.where.de : s.where.en}</span>
                      <span className="block text-[11px] text-gold">
                        {lang === 'de' ? s.ref.de : s.ref.en}
                        {s.also && <span className="text-white/40"> · {lang === 'de' ? s.also.de : s.also.en}</span>}
                      </span>
                      {active && (
                        <>
                          <span className="mt-1.5 block text-[13px] leading-relaxed text-white/75">
                            {lang === 'de' ? s.text.de : s.text.en}
                          </span>
                          {s.quote && (
                            <span
                              className="mt-2 block border-l-2 pl-3 font-display text-[13.5px] leading-snug text-white/85"
                              style={{ borderColor: color }}
                            >
                              {lang === 'de' ? s.quote.de : s.quote.en}
                            </span>
                          )}
                        </>
                      )}
                    </span>
                  </button>

                  {active && (
                    <div className="ml-11 mt-1.5 space-y-2 pb-2">
                      {/* Wer hier vorkommt */}
                      {s.people.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {s.people.map((pid) => {
                            const p = PERSON_BY_ID[pid];
                            if (!p) return null;
                            return (
                              <button
                                key={pid}
                                onClick={() => setPersonId(pid)}
                                className="bg-white/8 px-2 py-1 text-[11px] font-bold text-white/75 transition hover:bg-white/16 hover:text-white"
                              >
                                {lang === 'de' ? p.de : p.en}
                              </button>
                            );
                          })}
                        </div>
                      )}

                      <div className="flex flex-wrap gap-1.5">
                        <a
                          href={passageUrl(lang === 'de' ? s.ref.de : s.ref.en, lang)}
                          target="_blank"
                          rel="noreferrer"
                          className="bm-btn bm-btn-signal"
                        >
                          {lang === 'de' ? s.ref.de : s.ref.en}
                        </a>
                        {place && (
                          <button onClick={() => onShowPlace(place)} className="bm-btn bm-btn-ghost">
                            {t('showOnMap')} →
                          </button>
                        )}
                        {onOpenMedia && chapter !== undefined && (
                          <button
                            onClick={() => onOpenMedia(s.book, chapter)}
                            className="bm-btn bm-btn-ghost"
                          >
                            {t('gospelListenHere')} →
                          </button>
                        )}
                      </div>

                      {/* Was andere dazu erzählen: Video, Hörfolge, Verfilmung */}
                      <div className="border-l-2 border-white/15 pl-3">
                        <div className="bm-eyebrow text-white/50">{t('gospelElsewhere')}</div>
                        <div className="mt-1 space-y-1">
                          {overview && (
                            <a
                              href={overview.url}
                              target="_blank"
                              rel="noreferrer"
                              className="block text-[12px] text-white/70 underline decoration-white/25 underline-offset-2 transition hover:text-white"
                            >
                              BibleProject · {lang === 'de' ? overview.de : overview.en}
                            </a>
                          )}
                          {themes.map((v) => (
                            <a
                              key={v.id}
                              href={v.url}
                              target="_blank"
                              rel="noreferrer"
                              className="block text-[12px] text-white/70 underline decoration-white/25 underline-offset-2 transition hover:text-white"
                            >
                              BibleProject · {lang === 'de' ? v.de : v.en}
                              <span className="ml-1 text-white/35">{t('gospelTheme')}</span>
                            </a>
                          ))}
                          {tunes && chapter !== undefined && (
                            <a
                              href={tunes.url}
                              target="_blank"
                              rel="noreferrer"
                              className="block text-[12px] text-white/70 underline decoration-white/25 underline-offset-2 transition hover:text-white"
                            >
                              bibletunes.de · {tunes.book} {chapter}
                              <span className="ml-1 text-white/35">{tunes.speaker}</span>
                            </a>
                          )}
                          {scenes.map((e) => (
                            <a
                              key={`${e.season}-${e.episode}`}
                              href={CHOSEN_URL}
                              target="_blank"
                              rel="noreferrer"
                              className="block text-[12px] text-white/70 underline decoration-white/25 underline-offset-2 transition hover:text-white"
                            >
                              The Chosen · {episodeLabel(e, lang)}{' '}
                              {lang === 'de' ? `„${e.title}“` : `“${e.title}”`}
                            </a>
                          ))}
                          {!CHOSEN_VERIFIED && scenes.length > 0 && (
                            <p className="text-[10.5px] leading-snug text-white/40">{t('gospelChosenNote')}</p>
                          )}
                        </div>
                      </div>

                      {/* Was außerhalb der Bibel dazu bezeugt ist */}
                      {found.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1">
                          <span className="bm-eyebrow text-white/45">{t('gospelOutside')}</span>
                          {found.map((w) => (
                            <button
                              key={w.id}
                              onClick={() => setWitness(w.id)}
                              className="bg-white/8 px-2 py-1 text-[11px] font-bold text-white/75 transition hover:bg-white/16 hover:text-white"
                            >
                              {lang === 'de' ? w.de : w.en}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ol>

          {!person && <PeopleList lang={lang} onPick={setPersonId} />}
          {!person && <WitnessList lang={lang} open={witness} onOpen={setWitness} />}
        </div>

        {/* Karte */}
        <div className="relative min-h-[45vh] flex-1">
          {person ? (
            <MissionMap markers={personMarkers} routes={[]} fit={fit} onSelect={setSelected} />
          ) : (
            <RouteMap
              key={actId}
              stops={stops}
              color={act.color}
              context={context}
              activeIndex={activeIndex}
              playing={playing}
              onArrive={(i) => setSelected(items[i]?.id ?? null)}
              onFinish={afterAct}
              onSelect={(i) => setSelected(items[i].id)}
            />
          )}
        </div>
      </div>

      {/* Die Akte als Leiste */}
      <div className="scroll-soft flex flex-none gap-px overflow-x-auto border-t border-white/10 bg-abyss px-2 py-2">
        {ACTS.map((a) => {
          const on = a.id === actId && !person;
          return (
            <button
              key={a.id}
              onClick={() => {
                setPersonId(null);
                setActId(a.id);
              }}
              style={on ? { background: a.color } : undefined}
              className={`flex-none border-t-2 px-3 py-1.5 text-left transition ${
                on ? 'text-white' : 'border-transparent text-white/55 hover:bg-white/8 hover:text-white'
              }`}
            >
              <span className="block text-[12.5px] font-bold leading-tight">{lang === 'de' ? a.de : a.en}</span>
              <span className={`block text-[10px] ${on ? 'text-white/75' : 'text-white/40'}`}>
                {lang === 'de' ? a.range.de : a.range.en}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function PersonHead({
  person,
  lang,
  count,
  onBack,
}: {
  person: GospelPerson;
  lang: Lang;
  count: number;
  onBack: () => void;
}) {
  const t = useT();
  return (
    <div className="border-b border-white/10 px-5 py-5">
      <button onClick={onBack} className="bm-btn bm-btn-ghost mb-3">
        ← {t('gospelBackToActs')}
      </button>
      <div className="bm-eyebrow mb-2 text-gold">{lang === 'de' ? person.role.de : person.role.en}</div>
      <h2 className="font-display text-3xl uppercase leading-[0.95] text-white">
        {lang === 'de' ? person.de : person.en}
      </h2>
      <p className="mt-3 max-w-prose text-[14px] leading-relaxed text-white/70">
        {lang === 'de' ? person.note.de : person.note.en}
      </p>
      <p className="mt-3 text-[11px] text-white/45">
        {t('gospelAppearsIn')}: {count} {t('gospelStations')}
      </p>
    </div>
  );
}

function PeopleList({ lang, onPick }: { lang: Lang; onPick: (id: string) => void }) {
  const t = useT();
  return (
    <div className="border-t border-white/10 px-5 py-5">
      <h3 className="font-display text-lg uppercase text-white">{t('gospelPeople')}</h3>
      <p className="mt-1 text-[11.5px] leading-relaxed text-white/50">{t('gospelPeopleHint')}</p>
      {GROUPS.map((g) => {
        const members = PEOPLE_WITH_SCENES.filter((p) => p.group === g.id && p.id !== 'jesus');
        if (!members.length) return null;
        return (
          <div key={g.id} className="mt-4">
            <div className="bm-eyebrow text-white/45">{lang === 'de' ? g.de : g.en}</div>
            <div className="mt-1.5 flex flex-wrap gap-1">
              {members.map((p) => (
                <button
                  key={p.id}
                  onClick={() => onPick(p.id)}
                  className="bg-white/8 px-2 py-1 text-[11px] font-bold text-white/75 transition hover:bg-white/16 hover:text-white"
                >
                  {lang === 'de' ? p.de : p.en}
                  <span className="ml-1 text-white/35">{STATIONS_BY_PERSON[p.id]?.length ?? 0}</span>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function WitnessList({
  lang,
  open,
  onOpen,
}: {
  lang: Lang;
  open: string | null;
  onOpen: (id: string | null) => void;
}) {
  const t = useT();
  const listRef = useRef<HTMLDivElement>(null);

  // Ein Klick auf einen Fund oben in der Station schlägt ihn hier auf –
  // dann soll er auch zu sehen sein.
  useEffect(() => {
    if (!open) return;
    listRef.current?.querySelector(`[data-witness="${CSS.escape(open)}"]`)?.scrollIntoView({
      block: 'center',
      behavior: 'smooth',
    });
  }, [open]);

  const gruppen: { kind: Witness['kind']; de: string; en: string }[] = [
    { kind: 'text', de: 'Was andere aufgeschrieben haben', en: 'What others wrote down' },
    { kind: 'find', de: 'Was der Boden hergibt', en: 'What the ground gives up' },
  ];

  return (
    <div ref={listRef} className="border-t border-white/10 px-5 py-5">
      <h3 className="font-display text-lg uppercase text-white">{t('gospelWitnesses')}</h3>
      <p className="mt-1 text-[11.5px] leading-relaxed text-white/50">{t('gospelWitnessesHint')}</p>

      {gruppen.map((g) => (
        <div key={g.kind} className="mt-4">
          <div className="bm-eyebrow text-white/45">{lang === 'de' ? g.de : g.en}</div>
          <ul className="mt-1.5 space-y-1">
            {WITNESSES.filter((w) => w.kind === g.kind).map((w) => {
              const on = w.id === open;
              return (
                <li key={w.id} data-witness={w.id}>
                  <button
                    onClick={() => onOpen(on ? null : w.id)}
                    className={`w-full px-2.5 py-2 text-left transition ${on ? 'bg-deep' : 'hover:bg-white/6'}`}
                  >
                    <span className="flex items-baseline justify-between gap-2">
                      <span className="text-[13px] font-bold leading-snug text-white">
                        {lang === 'de' ? w.de : w.en}
                      </span>
                      <span className="flex-none text-[10.5px] text-white/45">
                        {lang === 'de' ? w.when.de : w.when.en}
                      </span>
                    </span>
                    <span className="mt-0.5 block text-[11px] text-gold">
                      {lang === 'de' ? w.source.de : w.source.en}
                      {w.disputed && <span className="ml-1 text-white/45">· {t('gospelDisputed')}</span>}
                    </span>
                    {on && (
                      <>
                        <span className="mt-1.5 block text-[13px] leading-relaxed text-white/75">
                          {lang === 'de' ? w.text.de : w.text.en}
                        </span>
                        {w.quote && (
                          <span className="mt-2 block border-l-2 border-white/20 pl-3 font-display text-[13px] leading-snug text-white/85">
                            {lang === 'de' ? w.quote.de : w.quote.en}
                          </span>
                        )}
                      </>
                    )}
                  </button>
                  {on && w.topic && (
                    <a
                      href={wikiUrl(lang === 'de' ? w.topic : (w.topicEn ?? w.topic), lang)}
                      target="_blank"
                      rel="noreferrer"
                      className="bm-btn bm-btn-ghost ml-2.5 mt-1"
                    >
                      {t('lookUp')} →
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
