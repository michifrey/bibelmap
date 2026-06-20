import { useEffect, useMemo, useRef, useState } from 'react';
import type { Place } from '../types';
import type { Lang } from '../i18n';
import { useT } from '../i18n';
import { booksWithPlaces, placesInChapter } from '../lib/places';
import { BOOKS, BOOK_BY_OSIS, bibleGatewayUrl, bibleProjectUrl } from '../data/books';
import { ERA_BY_ID } from '../data/eras';
import { loadBookText, chapterVerses, type BookText } from '../lib/text';
import { highlightVerse, type Candidate } from '../lib/highlight';
import MapView from './MapView';

interface Props {
  places: Place[];
  lang: Lang;
  initialBook?: string | null;
  onExit: () => void;
}

export default function Presentation({ places, lang, initialBook, onExit }: Props) {
  const t = useT();
  const available = useMemo(() => new Set(booksWithPlaces(places)), [places]);
  const [book, setBook] = useState<string | null>(initialBook ?? null);
  const [chapter, setChapter] = useState(1);
  const [selected, setSelected] = useState<Place | null>(null);

  const [bookText, setBookText] = useState<BookText | null>(null);
  const [textLoading, setTextLoading] = useState(false);

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
        <h3 className="mb-2 font-display text-lg font-semibold text-teal">{title}</h3>
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 md:grid-cols-4">
          {items.map((b) => {
            const has = available.has(b.osis);
            return (
              <button
                key={b.osis}
                disabled={!has}
                onClick={() => openBook(b.osis)}
                className={`rounded-xl border px-3 py-2.5 text-left text-sm transition ${
                  has
                    ? 'border-teal/15 bg-cream hover:border-gold hover:bg-gold/10'
                    : 'cursor-not-allowed border-transparent bg-cream-2/40 text-ink-soft/40'
                }`}
              >
                <span className="block font-medium leading-tight text-ink">{lang === 'de' ? b.de : b.en}</span>
                <span className="text-[11px] text-ink-soft">{b.chapters} {t('chapter')}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
    return (
      <div className="fixed inset-0 z-[2000] flex flex-col bg-cream">
        <PresentationBar title={t('presentation')} onExit={onExit} />
        <div className="scroll-soft mx-auto w-full max-w-4xl flex-1 overflow-y-auto px-5 py-6">
          <p className="mb-5 text-sm text-ink-soft">{t('presentationHint')}</p>
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
    <div className="fixed inset-0 z-[2000] flex flex-col bg-cream">
      <PresentationBar
        title={lang === 'de' ? meta.de : meta.en}
        subtitle={era ? `${lang === 'de' ? era.de : era.en} · ${era.range}` : undefined}
        onBack={() => setBook(null)}
        onExit={onExit}
      />

      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        {/* Left: text / places */}
        <div className="scroll-soft flex w-full flex-col overflow-y-auto border-b border-teal/10 md:w-[42%] md:max-w-xl md:border-b-0 md:border-r">
          <div className="sticky top-0 z-10 border-b border-teal/10 bg-cream/95 px-5 py-3 backdrop-blur">
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={() => go(-1)}
                disabled={chapter <= 1}
                className="rounded-lg bg-cream-2 px-3 py-1.5 text-sm font-medium text-teal transition hover:bg-gold/30 disabled:opacity-30"
              >
                ‹ {t('prev')}
              </button>
              <div className="text-center">
                <div className="font-display text-lg font-semibold text-teal">
                  {t('chapter')} {chapter}
                </div>
                <div className="text-[11px] text-ink-soft">/ {meta.chapters}</div>
              </div>
              <button
                onClick={() => go(1)}
                disabled={chapter >= meta.chapters}
                className="rounded-lg bg-cream-2 px-3 py-1.5 text-sm font-medium text-teal transition hover:bg-gold/30 disabled:opacity-30"
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
                className="rounded-lg bg-teal px-2.5 py-1 text-xs font-medium text-cream transition hover:bg-teal-2"
              >
                {lang === 'de' ? t('readDe') : t('readEn')}
              </a>
              <a
                href={bibleProjectUrl(meta.osis)}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg bg-gold/25 px-2.5 py-1 text-xs font-medium text-teal transition hover:bg-gold/40"
              >
                {t('video')}
              </a>
            </div>

            {/* place index for this chapter (works in both languages) */}
            {chapterPlaces.length > 0 && (
              <div className="scroll-soft -mb-1 mt-2 flex gap-1.5 overflow-x-auto pb-1">
                {chapterPlaces.map(({ place }) => (
                  <button
                    key={place.id}
                    onClick={() => setSelected(place)}
                    className={`flex-none rounded-full px-2.5 py-1 text-xs font-medium transition ${
                      selected?.id === place.id
                        ? 'bg-teal text-cream'
                        : 'bg-cream-2 text-teal hover:bg-gold/30'
                    }`}
                    title={`${t('placesInChapter')}`}
                  >
                    {place.name.replace(/ \d+$/, '')}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* reading text (hero) */}
          <div className="px-5 py-4">
            {textLoading ? (
              <p className="px-1 py-8 text-center text-sm text-ink-soft">{t('textLoading')}</p>
            ) : verses.length === 0 ? (
              <p className="rounded-xl bg-cream-2/50 px-4 py-6 text-center text-sm text-ink-soft">{t('noText')}</p>
            ) : (
              <div className="font-display text-[17px] leading-relaxed text-ink">
                {verses.map((vs) => {
                  const vp = versePlaces.get(vs.v) ?? [];
                  const candidates: Candidate[] = vp.map((p) => ({
                    placeId: p.id,
                    strings: [p.name.replace(/ \d+$/, ''), ...p.variants],
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
                          title={p.name.replace(/ \d+$/, '')}
                          className={`ml-1 inline-flex translate-y-[1px] items-center rounded-full px-1 align-middle text-[10px] font-sans transition ${
                            selected?.id === p.id ? 'bg-teal text-cream' : 'bg-gold/30 text-teal hover:bg-gold/55'
                          }`}
                        >
                          <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor"><path d="M12 2C8.7 2 6 4.7 6 8c0 4.4 6 12 6 12s6-7.6 6-12c0-3.3-2.7-6-6-6zm0 8.2A2.2 2.2 0 1 1 12 5.8a2.2 2.2 0 0 1 0 4.4z" /></svg>
                          {p.name.replace(/ \d+$/, '')}
                        </button>
                      ))}
                    </p>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right: map */}
        <div className="relative min-h-[40vh] flex-1">
          <MapView
            places={fitPlaces}
            heat={false}
            selectedId={selected?.id ?? null}
            onSelect={setSelected}
            fitPlaces={fitPlaces}
            flyTo={selected ? { lat: selected.lat, lon: selected.lon, zoom: 9, key: Date.now() } : null}
          />
        </div>
      </div>
    </div>
  );
}

function PresentationBar({
  title,
  subtitle,
  onBack,
  onExit,
}: {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  onExit: () => void;
}) {
  const t = useT();
  return (
    <div className="flex flex-none items-center justify-between gap-3 border-b border-teal/10 bg-teal px-4 py-3 text-cream">
      <div className="flex items-center gap-3">
        {onBack && (
          <button onClick={onBack} className="rounded-lg bg-white/10 px-2.5 py-1.5 text-sm transition hover:bg-white/20">
            ‹ {t('chooseBook')}
          </button>
        )}
        <div>
          <div className="font-display text-lg font-semibold leading-tight">{title}</div>
          {subtitle && <div className="text-[11px] text-cream/75">{subtitle}</div>}
        </div>
      </div>
      <button onClick={onExit} className="rounded-lg bg-gold px-3 py-1.5 text-sm font-medium text-teal transition hover:bg-gold-deep">
        {t('exit')} ✕
      </button>
    </div>
  );
}
