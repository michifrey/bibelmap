import { useEffect, useMemo, useState } from 'react';
import type { Place } from '../types';
import type { Lang } from '../i18n';
import { useT } from '../i18n';
import { placeName, searchPlaces } from '../lib/places';
import { BOOK_BY_OSIS, BOOKS } from '../data/books';
import { ERAS, ERA_BY_ID } from '../data/eras';
import {
  loadMedia,
  mediaDate,
  placesByEpisode,
  precision,
  refLabel,
  sourceLabel,
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
const CHIPS = 4;

/**
 * Hören & Sehen als eigener Modus: alle Folgen der eingebundenen Quellen,
 * nach Quelle, Buch, Epoche und Text filterbar. Die Verknüpfung mit den Orten
 * bleibt in beide Richtungen – von hier führt jede Ortsmarke auf die Karte,
 * und die Ortskarte führt mit `#hoeren=ort,…` hierher zurück.
 *
 * Aufbau: die Filter stehen in einer eigenen Spalte, nicht als Band über der
 * Liste. Als Band fraßen sie auf dem Telefon die halbe Höhe, bevor die erste
 * Folge zu sehen war; als Spalte füllen sie am Schreibtisch den Rand, der
 * vorher leer neben einer schmalen Liste stand.
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
  /**
   * Zwei Blickwinkel auf denselben Bestand: „Passgenau" stellt die genaue
   * Stelle vor das ganze Buch, „Neueste" das Sendedatum voran. Beides hat
   * seinen Ort – wer stöbert, will das Neue; wer zu einer Stelle sucht, das
   * Genaue.
   */
  const [sort, setSort] = useState<'fit' | 'date'>('fit');
  const [limit, setLimit] = useState(PAGE);
  /** Nur auf schmalen Schirmen: die Filterspalte fährt als Blatt hoch. */
  const [filtersOpen, setFiltersOpen] = useState(false);

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

  /*
   * Esc schließt zuerst das Filterblatt, nicht gleich den ganzen Modus. Die
   * App horcht in der Blasenphase auf `window`; hier wird darum in der
   * Einfangphase abgefangen, solange das Blatt offen ist.
   */
  useEffect(() => {
    if (!filtersOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      e.stopPropagation();
      setFiltersOpen(false);
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [filtersOpen]);

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
        // Auch die Stelle so, wie sie hier steht: die Quellen liefern
        // „Ephesians“ mit, auf dem Schirm steht „Epheser“ – wer das abtippt,
        // was er sieht, muss es finden.
        const inText =
          ep.title.toLowerCase().includes(q) ||
          ep.refs.some(
            (r) =>
              r.label.toLowerCase().includes(q) ||
              refLabel(r, BOOK_BY_OSIS[r.osis], lang).toLowerCase().includes(q),
          );
        if (!inText && !viaPlaces?.has(i)) return;
      }
      out.push({ ep, i });
    });
    // Passgenau: wie auf der Ortskarte – die genaue Stelle vor dem ganzen Buch,
    // dann neu vor alt. Nach Datum: umgekehrt, und was kein Datum hat, ans Ende
    // statt an den Anfang (die Buch-Übersichten haben keins).
    out.sort((a, b) =>
      sort === 'fit'
        ? precision(a.ep) - precision(b.ep) || (b.ep.date ?? '').localeCompare(a.ep.date ?? '')
        : (b.ep.date ?? '').localeCompare(a.ep.date ?? '') || precision(a.ep) - precision(b.ep),
    );
    return out;
  }, [index, places, place, book, chapter, era, query, sort, lang]);

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

  /** Wie viele Filter gerade greifen – die Zahl steht auf dem Filterknopf. */
  const active = [source, place, book, era, query.trim() || null].filter(Boolean).length;

  function reset() {
    setSource(null);
    setPlace(null);
    setBook(null);
    setChapter(null);
    setEra(null);
    setQuery('');
  }

  const bookName = (osis: string) =>
    (lang === 'de' ? BOOK_BY_OSIS[osis]?.de.replace(/\s*\(.*\)$/, '') : BOOK_BY_OSIS[osis]?.en) ?? osis;

  return (
    <div className="fixed inset-0 z-[2000] flex flex-col bg-deepest">
      <div className="flex flex-none items-center justify-between gap-3 border-b border-white/10 bg-abyss px-4 py-3 text-white sm:px-5 sm:py-3.5">
        <div className="flex min-w-0 items-center gap-2">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-5 w-5 flex-none text-gold"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          >
            <path d="M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3Z" />
            <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
          </svg>
          <div className="min-w-0">
            <div className="font-display text-lg uppercase leading-none sm:text-xl">{t('media')}</div>
            <div className="mt-1 hidden text-[11px] text-white/55 sm:block">{t('mediaSub')}</div>
          </div>
        </div>
        <button onClick={onExit} className="bm-btn bm-btn-gold flex-none">
          {t('exit')} ✕
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 lg:flex-row">
        {/*
          Eine Spalte, zwei Auftritte: am Schreibtisch steht sie fest am Rand,
          auf dem Telefon fährt sie über die Liste. Ein Baum im Dokument statt
          zwei – sonst stünde jedes Bedienfeld doppelt in der Seite.
        */}
        <aside
          className={`${filtersOpen ? 'flex' : 'hidden'} scroll-soft absolute inset-x-0 bottom-0 z-30 max-h-[75%] flex-col overflow-y-auto border-t border-white/12 bg-abyss lg:static lg:flex lg:max-h-none lg:w-[17.5rem] lg:flex-none lg:border-r lg:border-t-0`}
        >
          <div className="flex items-center justify-between px-4 pb-2 pt-3.5 lg:hidden">
            <span className="bm-eyebrow">{t('mediaFilters')}</span>
            <button onClick={() => setFiltersOpen(false)} className="bm-btn bm-btn-ghost">
              {t('close')} ✕
            </button>
          </div>

          <div className="px-4 pb-5 lg:pt-4">
            <div className="bm-eyebrow mb-2 hidden lg:block">{t('mediaSource')}</div>
            <div className="-mx-4">
              <button
                onClick={() => setSource(null)}
                aria-pressed={source === null}
                className={`bm-row ${source === null ? 'is-on' : ''}`}
              >
                <span className="min-w-0 flex-1 truncate text-sm font-semibold text-white">
                  {t('mediaAllSources')}
                </span>
                <span className="bm-num flex-none text-sm text-white/60">{base.length}</span>
              </button>
              {(index?.sources ?? []).map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSource(source === s.id ? null : s.id)}
                  aria-pressed={source === s.id}
                  className={`bm-row ${source === s.id ? 'is-on' : ''}`}
                  title={s.title}
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-white">{sourceLabel(s)}</span>
                    {/* Bei „Timothy Keller“ heißt die Quelle wie ihr Autor –
                        dann steht der Name einmal, nicht zweimal untereinander. */}
                    {s.author && s.author !== sourceLabel(s) && (
                      <span className="block truncate text-[11px] text-white/50">{s.author}</span>
                    )}
                  </span>
                  <span className="bm-num flex-none text-sm text-white/60">{counts[s.id] ?? 0}</span>
                </button>
              ))}
            </div>

            <div className="bm-eyebrow mb-2 mt-5">{t('mediaBook')}</div>
            <select
              value={book ?? ''}
              aria-label={t('mediaAllBooks')}
              onChange={(e) => {
                setBook(e.target.value || null);
                // Von Hand ein Buch wählen heißt: das ganze Buch, nicht das
                // Kapitel, aus dem der Link kam.
                setChapter(null);
              }}
              className="bm-select w-full"
            >
              <option value="">{t('mediaAllBooks')}</option>
              {books.map((b) => (
                <option key={b.osis} value={b.osis}>
                  {lang === 'de' ? b.de : b.en}
                </option>
              ))}
            </select>

            <div className="bm-eyebrow mb-2 mt-4">{t('mediaEra')}</div>
            <select
              value={era ?? ''}
              aria-label={t('mediaAllErasFilter')}
              onChange={(e) => setEra(e.target.value || null)}
              className="bm-select w-full"
            >
              <option value="">{t('mediaAllErasFilter')}</option>
              {ERAS.map((e) => (
                <option key={e.id} value={e.id}>
                  {lang === 'de' ? e.de : e.en}
                </option>
              ))}
            </select>

            <div className="bm-eyebrow mb-2 mt-4">{t('mediaSort')}</div>
            <div className="bm-seg">
              {(['fit', 'date'] as const).map((id) => (
                <button
                  key={id}
                  onClick={() => setSort(id)}
                  aria-pressed={sort === id}
                  className={`flex-1 ${sort === id ? 'is-on' : ''}`}
                >
                  {id === 'fit' ? t('mediaSortFit') : t('mediaSortDate')}
                </button>
              ))}
            </div>

            {active > 0 && (
              <button onClick={reset} className="bm-btn bm-btn-ghost mt-5 w-full justify-center">
                {t('mediaReset')}
              </button>
            )}

            <p className="mt-6 hidden text-[11px] leading-relaxed text-white/45 lg:block">{t('mediaNote')}</p>
          </div>
        </aside>

        {/* Das Blatt legt sich über die Liste – dahinter darf nichts angetippt
            werden. Kein Knopf: das Blatt hat seinen eigenen, und ein
            bildschirmgroßer zweiter „Schließen“ in der Tabreihenfolge wäre für
            die Tastatur nur im Weg. Dort schließt Esc. */}
        {filtersOpen && (
          <div
            aria-hidden="true"
            onClick={() => setFiltersOpen(false)}
            className="absolute inset-0 z-20 bg-abyss/70 lg:hidden"
          />
        )}

        <main className="flex min-h-0 min-w-0 flex-1 flex-col">
          <div className="flex flex-none flex-col border-b border-white/10 px-4 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4 sm:px-5">
            {/* Auf dem Telefon steht die Suche oben, am Schreibtisch rechts –
                dort trägt die Zahl die Zeile an. */}
            <div className="order-1 flex items-center gap-2 sm:order-2 sm:ml-auto sm:w-[22rem] sm:flex-none">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('mediaSearch')}
                aria-label={t('mediaSearch')}
                className="bm-input min-w-0 flex-1"
              />
              <button
                onClick={() => setFiltersOpen(true)}
                className="bm-btn bm-btn-ghost flex-none lg:hidden"
              >
                {t('mediaFilters')}
                {active > 0 && <span className="bm-num text-gold">{active}</span>}
              </button>
            </div>

            {/* Die Zahl ist die Überschrift: sie sagt, wie groß das ist, was da liegt. */}
            <div className="order-2 mt-2.5 flex flex-wrap items-baseline gap-x-2.5 gap-y-1 sm:order-1 sm:mt-0">
              <span className="bm-num text-2xl text-gold">{list.length}</span>
              <span className="bm-eyebrow">{t('mediaEpisodes')}</span>
              {source && sourceById.has(source) && (
                <span className="bm-chip">{sourceLabel(sourceById.get(source) as MediaSource)}</span>
              )}
              {book && (
                <span className="bm-chip">
                  {bookName(book)}
                  {chapter !== null ? ` ${chapter}` : ''}
                  {chapter !== null && (
                    <button
                      onClick={() => onOpenReading(book, chapter)}
                      className="text-gold underline underline-offset-2 hover:text-white"
                    >
                      {t('readChapter')} →
                    </button>
                  )}
                </span>
              )}
              {era && <span className="bm-chip">{lang === 'de' ? ERA_BY_ID[era]?.de : ERA_BY_ID[era]?.en}</span>}
              {selectedPlace && (
                <span className="bm-chip">
                  {placeName(selectedPlace, lang)}
                  <button
                    onClick={() => onShowPlace(selectedPlace)}
                    className="text-gold underline underline-offset-2 hover:text-white"
                  >
                    {t('map')} →
                  </button>
                  <button
                    aria-label={t('close')}
                    onClick={() => setPlace(null)}
                    className="text-white/50 hover:text-white"
                  >
                    ✕
                  </button>
                </span>
              )}
            </div>
          </div>

          {/* Liste */}
          <div className="scroll-soft min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5">
            {!index && <div className="text-sm text-white/50">…</div>}

            {index && !list.length && (
              <div className="bm-panel p-4 text-sm text-white/70">{t('mediaEmpty')}</div>
            )}

            <div className="grid gap-2 sm:grid-cols-2 2xl:grid-cols-3">
              {list.slice(0, limit).map(({ ep, i }) => {
                const src = sourceById.get(ep.src);
                const ids = byEpisode.get(i) ?? [];
                const chips = ids
                  .map((id) => placeById.get(id))
                  .filter((p): p is Place => Boolean(p))
                  .sort((a, b) => b.mentionCount - a.mentionCount);
                const date = mediaDate(ep.date, lang);
                // Die Epoche färbt die Kante, statt als Kasten in der Ecke zu
                // schweben: über ein Raster gelesen wird daraus ein Rhythmus.
                const era0 = ERA_BY_ID[ep.eras[0] ?? ''];
                const edge = era0?.color ?? 'rgba(255,255,255,.14)';
                return (
                  <article
                    key={`${ep.src}-${i}`}
                    className="flex flex-col border-l-2 bg-surface/55 px-3 py-2.5 transition hover:bg-surface"
                    style={{ borderLeftColor: edge }}
                  >
                    <div className="flex items-baseline gap-2 text-[11px]">
                      <span className="min-w-0 truncate font-bold uppercase tracking-[0.16em] text-mint">
                        {src ? sourceLabel(src) : ep.src}
                      </span>
                      {date && <span className="flex-none text-white/45">{date}</span>}
                      {era0 && (
                        <span className="ml-auto flex-none truncate text-white/50">
                          {lang === 'de' ? era0.de : era0.en}
                        </span>
                      )}
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
                    <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11.5px] text-white/60">
                      {ep.refs.map((r, k) => {
                        const label = refLabel(r, BOOK_BY_OSIS[r.osis], lang);
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
                      {!date && sort === 'date' && <span className="text-white/40">{t('mediaNoDate')}</span>}
                    </div>

                    {chips.length > 0 && (
                      <div className="mt-2 flex flex-wrap items-center gap-1">
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 24 24"
                          className="h-3.5 w-3.5 flex-none text-white/35"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" />
                          <circle cx="12" cy="10" r="2.5" />
                        </svg>
                        {chips.slice(0, CHIPS).map((p) => (
                          <button
                            key={p.id}
                            onClick={() => onShowPlace(p)}
                            className="bg-white/8 px-2 py-0.5 text-[11px] text-white transition hover:bg-gold hover:text-deep"
                          >
                            {placeName(p, lang)}
                          </button>
                        ))}
                        {chips.length > CHIPS && (
                          <span className="px-0.5 text-[11px] text-white/45">+{chips.length - CHIPS}</span>
                        )}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>

            {list.length > limit && (
              <button onClick={() => setLimit((n) => n + PAGE)} className="bm-btn bm-btn-ghost mt-3 w-full justify-center">
                {t('mediaMore')} ({list.length - limit})
              </button>
            )}

            <p className="mt-6 text-[11px] leading-relaxed text-white/45 lg:hidden">{t('mediaNote')}</p>
          </div>
        </main>
      </div>
    </div>
  );
}
