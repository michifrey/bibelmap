import { useEffect, useMemo, useRef, useState } from 'react';
import type { Place } from '../types';
import type { Lang } from '../i18n';
import { useT } from '../i18n';
import { booksWithPlaces, placeName, placeNames, placesInChapter } from '../lib/places';
import { BOOKS, BOOK_BY_OSIS, bibleGatewayUrl, bibleProjectUrl, bibleProjectVideoIds } from '../data/books';
import { ERA_BY_ID } from '../data/eras';
import { loadBookText, chapterVerses, type BookText } from '../lib/text';
import { highlightVerse, type Candidate } from '../lib/highlight';
import MapView from './MapView';
import YouTubeEmbed from './YouTubeEmbed';

interface Props {
  places: Place[];
  lang: Lang;
  initialBook?: string | null;
  /** Kapitel aus der Adresse (Deep-Link). */
  initialChapter?: number;
  /** Meldet Buch und Kapitel, damit die Adresse mitläuft. */
  onNavigate?: (state: { osis: string; chapter: number } | null) => void;
  onExit: () => void;
}

export default function Presentation({ places, lang, initialBook, initialChapter, onNavigate, onExit }: Props) {
  const t = useT();
  const available = useMemo(() => new Set(booksWithPlaces(places)), [places]);
  const [book, setBook] = useState<string | null>(initialBook ?? null);
  const [chapter, setChapter] = useState(initialChapter ?? 1);
  const [selected, setSelected] = useState<Place | null>(null);
  /**
   * Beamer: Text groß, Karte weg. Wer einmal so vorgetragen hat, will es beim
   * nächsten Mal wieder – deshalb gemerkt.
   */
  const [beamer, setBeamer] = useState(() => {
    try {
      return localStorage.getItem('bibelmap:beamer') === '1';
    } catch {
      return false;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem('bibelmap:beamer', beamer ? '1' : '0');
    } catch {
      // Ohne Speicher bleibt es bei der Voreinstellung – kein Grund zu scheitern.
    }
  }, [beamer]);

  const [bookText, setBookText] = useState<BookText | null>(null);
  const [textLoading, setTextLoading] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const navRef = useRef(onNavigate);
  navRef.current = onNavigate;
  useEffect(() => {
    navRef.current?.(book ? { osis: book, chapter } : null);
  }, [book, chapter]);

  const meta = book ? BOOK_BY_OSIS[book] : null;
  const chapterPlaces = useMemo(
    () => (book ? placesInChapter(places, book, chapter) : []),
    [places, book, chapter],
  );
  const fitPlaces = useMemo(() => chapterPlaces.map((c) => c.place), [chapterPlaces]);

  // verse number -> places mentioned in that verse (this chapter)
  const versePlaces = useMemo(() => {
    const map = new Map<number, Place[]>();
    for (const { place, refs } of chapterPlaces) {
      for (const r of refs) {
        const arr = map.get(r.verse) ?? [];
        if (!arr.some((p) => p.id === place.id)) arr.push(place);
        map.set(r.verse, arr);
      }
    }
    return map;
  }, [chapterPlaces]);

  const verses = useMemo(() => chapterVerses(bookText, chapter, lang), [bookText, chapter, lang]);

  // load full book text lazily on book change
  useEffect(() => {
    if (!book) {
      setBookText(null);
      return;
    }
    let alive = true;
    setTextLoading(true);
    setBookText(null);
    loadBookText(book)
      .then((bt) => alive && setBookText(bt))
      .catch(() => alive && setBookText(null))
      .finally(() => alive && setTextLoading(false));
    return () => {
      alive = false;
    };
  }, [book]);

  function openBook(osis: string) {
    setBook(osis);
    setChapter(1);
    setSelected(null);
    setShowVideo(false);
  }
  function go(delta: number) {
    if (!meta) return;
    setChapter((c) => Math.min(meta.chapters, Math.max(1, c + delta)));
    setSelected(null);
  }

  // keyboard chapter navigation
  const goRef = useRef(go);
  goRef.current = go;
  useEffect(() => {
    if (!book) return;
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 'ArrowRight') goRef.current(1);
      else if (e.key === 'ArrowLeft') goRef.current(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [book]);

  // ---- Book picker ----------------------------------------------------
  if (!book || !meta) {
    const at = BOOKS.filter((b) => b.testament === 'AT');
    const nt = BOOKS.filter((b) => b.testament === 'NT');
    const Group = ({ title, items }: { title: string; items: typeof BOOKS }) => (
      <div>
        <h3 className="mb-2 font-display text-lg font-semibold text-white">{title}</h3>
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 md:grid-cols-4">
          {items.map((b) => {
            const has = available.has(b.osis);
            return (
              <button
                key={b.osis}
                disabled={!has}
                onClick={() => openBook(b.osis)}
                className={`border px-3 py-2.5 text-left text-sm transition ${ has ? 'border-white/10 bg-deepest hover:border-gold hover:bg-gold/10' : 'cursor-not-allowed border-transparent bg-surface/40 text-white/45' }`}
              >
                <span className="block font-medium leading-tight text-white">{lang === 'de' ? b.de : b.en}</span>
                <span className="text-[11px] text-white/60">{b.chapters} {t('chapter')}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
    return (
      <div className="fixed inset-0 z-[2000] flex flex-col bg-deepest">
        <PresentationBar title={t('presentation')} onExit={onExit} />
        <div className="scroll-soft mx-auto w-full max-w-4xl flex-1 overflow-y-auto px-5 py-6">
          <p className="mb-5 text-sm text-white/60">{t('presentationHint')}</p>
          <div className="space-y-6">
            <Group title={t('oldTestament')} items={at} />
            <Group title={t('newTestament')} items={nt} />
          </div>
        </div>
      </div>
    );
  }

  const era = ERA_BY_ID[meta.era];

  // ---- Reading view ---------------------------------------------------
  return (
    <div className="fixed inset-0 z-[2000] flex flex-col bg-deepest">
      <PresentationBar
        title={lang === 'de' ? meta.de : meta.en}
        subtitle={era ? `${lang === 'de' ? era.de : era.en} · ${era.range}` : undefined}
        onBack={() => setBook(null)}
        beamer={beamer}
        onBeamer={() => setBeamer((v) => !v)}
        onExit={onExit}
      />

      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        {/* Left: text / places */}
        <div
          className={`scroll-soft flex w-full flex-col overflow-y-auto border-b border-white/10 bg-paper text-ink md:border-b-0 ${
            beamer ? 'md:w-full md:max-w-none md:border-r-0' : 'md:w-[42%] md:max-w-xl md:border-r'
          }`}
        >
          <div className="sticky top-0 z-10 border-b-4 border-deep bg-paper px-6 py-4">
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={() => go(-1)}
                disabled={chapter <= 1}
                className="bg-paper-2 px-3 py-2 text-xs font-bold tracking-wide text-ink transition hover:bg-gold/40 disabled:opacity-30"
              >
                ‹ {t('prev')}
              </button>
              <div className="text-center">
                <div className="font-display text-3xl uppercase text-ink">
                  {t('chapter')} {chapter}
                </div>
                <div className="text-[11px] font-bold text-ink-soft">/ {meta.chapters}</div>
              </div>
              <button
                onClick={() => go(1)}
                disabled={chapter >= meta.chapters}
                className="bg-paper-2 px-3 py-2 text-xs font-bold tracking-wide text-ink transition hover:bg-gold/40 disabled:opacity-30"
              >
                {t('next')} ›
              </button>
            </div>
            <input
              type="range"
              min={1}
              max={meta.chapters}
              value={chapter}
              onChange={(e) => {
                setChapter(Number(e.target.value));
                setSelected(null);
              }}
              className="mt-2 w-full accent-[var(--color-gold-deep)]"
            />
            <div className="mt-2 flex flex-wrap gap-1.5">
              <a
                href={bibleGatewayUrl(meta.osis, chapter, lang === 'de' ? 'LUTH1545' : 'ESV')}
                target="_blank"
                rel="noreferrer"
                className="bg-deep px-3 py-1.5 text-[11px] font-extrabold tracking-wide text-white transition hover:bg-signal"
              >
                {lang === 'de' ? t('readDe') : t('readEn')}
              </a>
              {bibleProjectVideoIds(meta.osis).length > 0 ? (
                <button
                  onClick={() => setShowVideo(true)}
                  className="inline-flex items-center gap-1 bg-deep px-3 py-1.5 text-[11px] font-extrabold tracking-wide text-white transition hover:bg-signal"
                >
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                  {t('video')}
                </button>
              ) : (
                <a
                  href={bibleProjectUrl(meta.osis)}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-gold px-3 py-1.5 text-[11px] font-extrabold tracking-wide text-deep transition hover:bg-gold-deep"
                >
                  {t('video')}
                </a>
              )}
            </div>

            {/* place index for this chapter (works in both languages) */}
            {chapterPlaces.length > 0 && (
              <div className="scroll-soft -mb-1 mt-2 flex gap-1.5 overflow-x-auto pb-1">
                {chapterPlaces.map(({ place }) => (
                  <button
                    key={place.id}
                    onClick={() => setSelected(place)}
                    className={`flex-none px-3 py-1.5 text-[11.5px] font-bold transition ${ selected?.id === place.id ? 'bg-deep text-white' : 'bg-paper-2 text-ink hover:bg-gold/40' }`}
                    title={`${t('placesInChapter')}`}
                  >
                    {placeName(place, lang)}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* reading text (hero) */}
          <div className="px-5 py-4">
            {textLoading ? (
              <p className="px-1 py-8 text-center text-sm text-white/60">{t('textLoading')}</p>
            ) : verses.length === 0 ? (
              <p className="bg-surface/50 px-4 py-6 text-center text-sm text-white/60">{t('noText')}</p>
            ) : (
              <div
                className={`font-scripture text-ink ${
                  beamer ? 'mx-auto max-w-4xl text-[26px] leading-[1.7]' : 'text-[18.5px] leading-[1.85]'
                }`}
              >
                {verses.map((vs) => {
                  const vp = versePlaces.get(vs.v) ?? [];
                  const candidates: Candidate[] = vp.map((p) => ({
                    placeId: p.id,
                    // German spellings first: in the Luther text "Ägypten" is
                    // what actually appears, not "Egypt".
                    strings: placeNames(p, lang),
                    onPick: () => setSelected(p),
                  }));
                  return (
                    <p key={vs.v} className="mb-2">
                      <sup className="mr-1 align-super text-[11px] font-semibold text-gold-deep">{vs.v}</sup>
                      {highlightVerse(vs.t, candidates)}
                      {vp.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => setSelected(p)}
                          title={placeName(p, lang)}
                          className={`ml-1 inline-flex translate-y-[1px] items-center rounded-full px-1 align-middle text-[10px] font-sans transition ${ selected?.id === p.id ? 'bg-signal text-white' : 'bg-gold/30 text-white hover:bg-gold/55' }`}
                        >
                          <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor"><path d="M12 2C8.7 2 6 4.7 6 8c0 4.4 6 12 6 12s6-7.6 6-12c0-3.3-2.7-6-6-6zm0 8.2A2.2 2.2 0 1 1 12 5.8a2.2 2.2 0 0 1 0 4.4z" /></svg>
                          {placeName(p, lang)}
                        </button>
                      ))}
                    </p>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right: map. Im Beamer-Layout gar nicht erst gebaut – eine per CSS
            versteckte Leaflet-Karte rechnet mit Größe 0 weiter und wirft
            „Invalid LatLng (NaN, NaN)". */}
        {!beamer && (
        <div className="relative min-h-[40vh] flex-1">
          <MapView
            places={fitPlaces}
            heat={false}
            selectedId={selected?.id ?? null}
            lang={lang}
            onSelect={setSelected}
            fitPlaces={fitPlaces}
            flyTo={selected ? { lat: selected.lat, lon: selected.lon, zoom: 9, key: Date.now() } : null}
          />
        </div>
        )}
      </div>

      {showVideo && bibleProjectVideoIds(meta.osis).length > 0 && (
        <div
          className="fixed inset-0 z-[2200] grid place-items-center bg-black/60 p-4"
          onClick={() => setShowVideo(false)}
        >
          <div className="w-full max-w-2xl bg-deepest p-4" onClick={(e) => e.stopPropagation()}>
            <div className="mb-2 flex items-center justify-between">
              <div className="font-display text-lg font-semibold text-white">
                {lang === 'de' ? meta.de : meta.en} · {t('video')}
              </div>
              <button
                onClick={() => setShowVideo(false)}
                className="grid h-8 w-8 place-items-center rounded-full bg-surface text-white transition hover:bg-gold/30"
                aria-label={t('close')}
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M18.3 5.7 12 12l6.3 6.3-1.4 1.4L10.6 13.4 4.3 19.7 2.9 18.3 9.2 12 2.9 5.7 4.3 4.3l6.3 6.3 6.3-6.3z" /></svg>
              </button>
            </div>
            <YouTubeEmbed ids={bibleProjectVideoIds(meta.osis)} title={lang === 'de' ? meta.de : meta.en} />
          </div>
        </div>
      )}
    </div>
  );
}

function PresentationBar({
  title,
  subtitle,
  onBack,
  beamer,
  onBeamer,
  onExit,
}: {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  beamer?: boolean;
  onBeamer?: () => void;
  onExit: () => void;
}) {
  const t = useT();
  return (
    <div className="flex flex-none items-center justify-between gap-3 border-b border-white/10 bg-signal px-4 py-3 text-white">
      <div className="flex items-center gap-3">
        {onBack && (
          <button onClick={onBack} className="bg-white/10 px-2.5 py-1.5 text-sm transition hover:bg-white/20">
            ‹ {t('chooseBook')}
          </button>
        )}
        <div>
          <div className="font-display text-lg font-semibold leading-tight">{title}</div>
          {subtitle && <div className="text-[11px] text-white/75">{subtitle}</div>}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {onBeamer && (
          <button
            onClick={onBeamer}
            title={t('beamerHint')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm transition ${beamer ? 'bg-white text-signal' : 'bg-white/10 hover:bg-white/20'}`}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M3 6h18v10H3zM8 20h8M12 16v4" />
            </svg>
            {t('beamer')}
          </button>
        )}
        <button onClick={onExit} className="bg-gold px-3 py-1.5 text-sm font-medium text-white transition hover:bg-gold-deep">
          {t('exit')} ✕
        </button>
      </div>
    </div>
  );
}
