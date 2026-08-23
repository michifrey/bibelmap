import { useEffect, useMemo, useState } from 'react';
import type { Place } from '../types';
import type { Lang } from '../i18n';
import { useT } from '../i18n';
import { placeName, searchPlaces } from '../lib/places';
import { BOOK_BY_OSIS, BOOKS } from '../data/books';
import { ERAS, ERA_BY_ID } from '../data/eras';
import {
  loadMedia,
  placesByEpisode,
  precision,
  type MediaEpisode,
  type MediaIndex,
  type MediaSource,
} from '../lib/media';

export interface MediaNav {
  source?: string;
  place?: string;
  /** Buch und Kapitel, aus dem Lesemodus heraus verlinkt. */
  ref?: { osis: string; chapter: number };
}

interface Props {
  places: Place[];
  lang: Lang;
  /** Vorauswahl aus der Adresse: Quelle, Ort oder Stelle. */
  initial: MediaNav | null;
  onNavigate: (nav: MediaNav | null) => void;
  /** Zurück zur Karte, auf den angetippten Ort. */
  onShowPlace: (p: Place) => void;
  /** Der Weg in den Lesemodus – dieselbe Stelle, nur als Text. */
  onOpenReading: (osis: string, chapter: number) => void;
  onExit: () => void;
}

const PAGE = 40;

/** Wie viele Ortsmarken unter einer Folge stehen, bevor „+n" übernimmt. */
const CHIPS = 6;

/**
 * Hören & Sehen als eigener Modus: alle Folgen der eingebundenen Quellen,
 * nach Quelle, Buch, Epoche und Text filterbar. Die Verknüpfung mit den Orten
 * bleibt in beide Richtungen – von hier führt jede Ortsmarke auf die Karte,
 * und die Ortskarte führt mit `#hoeren=ort,…` hierher zurück.
 */
export default function MediaMode({
  places,
  lang,
  initial,
  onNavigate,
  onShowPlace,
  onOpenReading,
  onExit,
}: Props) {
  const t = useT();
  const [index, setIndex] = useState<MediaIndex | null>(null);
  const [source, setSource] = useState<string | null>(initial?.source ?? null);
  const [place, setPlace] = useState<string | null>(initial?.place ?? null);
  const [book, setBook] = useState<string | null>(initial?.ref?.osis ?? null);
  /** Aus dem Lesemodus verlinkt: genau dieses Kapitel. */
  const [chapter, setChapter] = useState<number | null>(initial?.ref?.chapter ?? null);
  const [era, setEra] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [limit, setLimit] = useState(PAGE);

  useEffect(() => {
    let live = true;
    loadMedia().then((i) => {
      if (live) setIndex(i);
    });
    return () => {
      live = false;
    };
  }, []);

  // Die Adresse hält Quelle, Ort und Stelle fest – der Rest ist Feinarbeit.
  useEffect(() => {
    const ref = book && chapter !== null ? { osis: book, chapter } : undefined;
    onNavigate(
      source || place || ref
        ? { source: source ?? undefined, place: place ?? undefined, ref }
        : null,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source, place, book, chapter]);

  useEffect(() => {
    setLimit(PAGE);
  }, [source, place, book, chapter, era, query]);

  const placeById = useMemo(() => new Map(places.map((p) => [p.id, p])), [places]);
  const byEpisode = useMemo(() => (index ? placesByEpisode(index) : new Map<number, string[]>()), [index]);
  const selectedPlace = place ? placeById.get(place) ?? null : null;

  /** Nur die Bücher, zu denen es überhaupt Folgen gibt – in kanonischer Ordnung. */
  const books = useMemo(() => {
    if (!index) return [];
    const seen = new Set<string>();
    for (const ep of index.episodes) for (const r of ep.refs) if (r.osis) seen.add(r.osis);
    return BOOKS.filter((b) => seen.has(b.osis));
  }, [index]);

  /**
   * Alles außer dem Quellenfilter – daraus stehen die Zahlen an den
   * Quellenknöpfen, sonst zeigte jede Quelle nur noch ihre eigene Auswahl.
   */
  const base = useMemo(() => {
    if (!index) return [] as { ep: MediaEpisode; i: number }[];
    const q = query.trim().toLowerCase();
    // Ein getippter Ortsname ist auch eine Suche: die Treffer der Ortssuche
    // ziehen ihre Folgen mit herein.
    const viaPlaces = q
      ? new Set(searchPlaces(places, query, 20).flatMap((p) => index.byPlace[p.id] ?? []))
      : null;
    const onlyPlace = place ? new Set(index.byPlace[place] ?? []) : null;

    const out: { ep: MediaEpisode; i: number }[] = [];
    index.episodes.forEach((ep, i) => {
      if (onlyPlace && !onlyPlace.has(i)) return;
      if (book) {
        // Mit Kapitel: was dieses Kapitel nennt – und die Buch-Übersichten,
        // die für jedes Kapitel gelten.
        const hit = chapter
          ? ep.refs.some((r) => r.osis === book && (r.chapter === null || r.chapter === chapter))
          : ep.refs.some((r) => r.osis === book);
        if (!hit) return;
      }
      if (era && !ep.eras.includes(era)) return;
      if (q) {
        const inText =
          ep.title.toLowerCase().includes(q) || ep.refs.some((r) => r.label.toLowerCase().includes(q));
        if (!inText && !viaPlaces?.has(i)) return;
      }
      out.push({ ep, i });
    });
    // Wie auf der Ortskarte: die genaue Stelle vor dem ganzen Buch, dann neu vor alt.
    out.sort(
      (a, b) => precision(a.ep) - precision(b.ep) || (b.ep.date ?? '').localeCompare(a.ep.date ?? ''),
    );
    return out;
  }, [index, places, place, book, chapter, era, query]);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const { ep } of base) c[ep.src] = (c[ep.src] ?? 0) + 1;
    return c;
  }, [base]);

  const list = useMemo(() => (source ? base.filter((x) => x.ep.src === source) : base), [base, source]);
  const sourceById = useMemo(
    () => new Map((index?.sources ?? []).map((s) => [s.id, s] as [string, MediaSource])),
    [index],
  );

  const filtered = Boolean(source || place || book || era || query.trim());

  function reset() {
    setSource(null);
    setPlace(null);
    setBook(null);
    setChapter(null);
    setEra(null);
    setQuery('');
  }

  return (
    <div className="fixed inset-0 z-[2000] flex flex-col bg-deepest">
      <div className="flex flex-none items-center justify-between gap-3 border-b border-white/10 bg-abyss px-5 py-3.5 text-white">
        <div className="flex items-center gap-2">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-5 w-5 text-gold"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          >
            <path d="M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3Z" />
            <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
          </svg>
          <div>
            <div className="font-display text-xl uppercase leading-none">{t('media')}</div>
            <div className="mt-1 text-[11px] text-white/55">{t('mediaSub')}</div>
          </div>
        </div>
        <button onClick={onExit} className="bm-btn bm-btn-gold">
          {t('exit')} ✕
        </button>
      </div>

      {/* Filter */}
      <div className="flex-none border-b border-white/10 bg-abyss/60 px-5 py-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setSource(null)}
            className={`bm-btn ${source === null ? 'bm-btn-signal' : 'bm-btn-ghost'}`}
          >
            {t('mediaAllSources')} <span className="bm-num ml-1">{base.length}</span>
          </button>
          {(index?.sources ?? []).map((s) => (
            <button
              key={s.id}
              onClick={() => setSource(source === s.id ? null : s.id)}
              className={`bm-btn ${source === s.id ? 'bm-btn-signal' : 'bm-btn-ghost'}`}
              title={s.author ?? undefined}
            >
              {s.title.split(/[–—-]/)[0].trim()} <span className="bm-num ml-1">{counts[s.id] ?? 0}</span>
            </button>
          ))}
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('mediaSearch')}
            aria-label={t('mediaSearch')}
            className="min-w-0 flex-1 bg-surface px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-gold"
          />
          <select
            value={book ?? ''}
            aria-label={t('mediaAllBooks')}
            onChange={(e) => {
              setBook(e.target.value || null);
              // Von Hand ein Buch wählen heißt: das ganze Buch, nicht das
              // Kapitel, aus dem der Link kam.
              setChapter(null);
            }}
            className="bg-surface px-2.5 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-gold"
          >
            <option value="">{t('mediaAllBooks')}</option>
            {books.map((b) => (
              <option key={b.osis} value={b.osis}>
                {lang === 'de' ? b.de : b.en}
              </option>
            ))}
          </select>
          <select
            value={era ?? ''}
            aria-label={t('mediaAllErasFilter')}
            onChange={(e) => setEra(e.target.value || null)}
            className="bg-surface px-2.5 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-gold"
          >
            <option value="">{t('mediaAllErasFilter')}</option>
            {ERAS.map((e) => (
              <option key={e.id} value={e.id}>
                {lang === 'de' ? e.de : e.en}
              </option>
            ))}
          </select>
          {filtered && (
            <button onClick={reset} className="bm-btn bm-btn-ghost">
              {t('mediaReset')}
            </button>
          )}
        </div>

        {book && chapter !== null && (
          <div className="mt-2 flex flex-wrap items-center gap-2 bg-surface/60 px-3 py-2">
            <span className="bm-eyebrow">{t('mediaAtRef')}</span>
            <span className="text-sm font-bold text-white">
              {(lang === 'de' ? BOOK_BY_OSIS[book]?.de.replace(/\s*\(.*\)$/, '') : BOOK_BY_OSIS[book]?.en) ??
                book}{' '}
              {chapter}
            </span>
            <button onClick={() => onOpenReading(book, chapter)} className="bm-btn bm-btn-ghost">
              {t('readChapter')} →
            </button>
            <button onClick={() => setChapter(null)} className="ml-auto bm-btn bm-btn-ghost">
              ✕
            </button>
          </div>
        )}

        {selectedPlace && (
          <div className="mt-2 flex flex-wrap items-center gap-2 bg-surface/60 px-3 py-2">
            <span className="bm-eyebrow">{t('mediaAtPlace')}</span>
            <span className="text-sm font-bold text-white">{placeName(selectedPlace, lang)}</span>
            <button onClick={() => onShowPlace(selectedPlace)} className="bm-btn bm-btn-ghost">
              {t('map')} →
            </button>
            <button onClick={() => setPlace(null)} className="ml-auto bm-btn bm-btn-ghost">
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Liste */}
      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
        {!index && <div className="text-sm text-white/50">…</div>}

        {index && !list.length && (
          <div className="bm-panel p-4 text-sm text-white/70">{t('mediaEmpty')}</div>
        )}

        <div className="mx-auto max-w-4xl space-y-2">
          {list.slice(0, limit).map(({ ep, i }) => {
            const src = sourceById.get(ep.src);
            const ids = byEpisode.get(i) ?? [];
            const chips = ids
              .map((id) => placeById.get(id))
              .filter((p): p is Place => Boolean(p))
              .sort((a, b) => b.mentionCount - a.mentionCount);
            return (
              <div key={`${ep.src}-${i}`} className="bm-panel p-3">
                <div className="flex items-baseline gap-2">
                  <span className="bm-eyebrow">{src?.title ?? ep.src}</span>
                  {ep.date && <span className="text-[11px] text-white/50">{ep.date}</span>}
                  <span className="ml-auto flex flex-wrap justify-end gap-1">
                    {ep.eras.map((id) => (
                      <span
                        key={id}
                        className="px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white/80"
                        style={{ background: `${ERA_BY_ID[id]?.color ?? '#555'}33` }}
                      >
                        {lang === 'de' ? ERA_BY_ID[id]?.de : ERA_BY_ID[id]?.en}
                      </span>
                    ))}
                  </span>
                </div>

                <a
                  href={ep.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 block text-[15px] font-semibold leading-snug text-white hover:text-gold"
                >
                  {ep.title}
                </a>

                {/* Die Stellen sind der Weg zum Text: was eine Folge bespricht,
                    lässt sich daneben lesen. Ohne Kapitel geht das nicht. */}
                <div className="mt-0.5 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[11px] text-white/60">
                  {ep.refs.map((r, k) => {
                    const label =
                      r.label ||
                      (lang === 'de' ? BOOK_BY_OSIS[r.osis]?.de : BOOK_BY_OSIS[r.osis]?.en) ||
                      r.osis;
                    return r.chapter ? (
                      <button
                        key={`${r.osis}-${r.chapter}-${k}`}
                        onClick={() => onOpenReading(r.osis, r.chapter as number)}
                        title={t('readChapter')}
                        className="underline decoration-white/25 underline-offset-2 transition hover:text-gold hover:decoration-gold"
                      >
                        {label}
                      </button>
                    ) : (
                      <span key={`${r.osis}-${k}`}>{label}</span>
                    );
                  })}
                  {ep.date && <span>· {ep.date}</span>}
                </div>

                {chips.length > 0 && (
                  <div className="mt-2 flex flex-wrap items-center gap-1">
                    {chips.slice(0, CHIPS).map((p) => (
                      <button
                        key={p.id}
                        onClick={() => onShowPlace(p)}
                        className="bg-surface px-2 py-1 text-[11px] text-white transition hover:bg-gold/30"
                      >
                        {placeName(p, lang)}
                      </button>
                    ))}
                    {chips.length > CHIPS && (
                      <span className="px-1 text-[11px] text-white/45">+{chips.length - CHIPS}</span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {list.length > limit && (
          <div className="mx-auto mt-3 max-w-4xl">
            <button onClick={() => setLimit((n) => n + PAGE)} className="bm-btn bm-btn-ghost w-full">
              {t('mediaMore')} ({list.length - limit})
            </button>
          </div>
        )}

        <p className="mx-auto mt-6 max-w-4xl text-[11px] leading-relaxed text-white/45">{t('mediaNote')}</p>
      </div>
    </div>
  );
}
