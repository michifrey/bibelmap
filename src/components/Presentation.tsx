import { useMemo, useState } from 'react';
import type { Place } from '../types';
import type { Lang } from '../i18n';
import { useT } from '../i18n';
import { booksWithPlaces, placesInChapter } from '../lib/places';
import { BOOKS, BOOK_BY_OSIS, bibleGatewayUrl, bibleProjectUrl } from '../data/books';
import { ERA_BY_ID } from '../data/eras';
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

  const meta = book ? BOOK_BY_OSIS[book] : null;
  const chapterPlaces = useMemo(
    () => (book ? placesInChapter(places, book, chapter) : []),
    [places, book, chapter],
  );
  const fitPlaces = useMemo(() => chapterPlaces.map((c) => c.place), [chapterPlaces]);

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
          </div>

          <div className="px-5 py-4">
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-ink-soft">
              {t('placesInChapter')} · {chapterPlaces.length}
            </div>
            {chapterPlaces.length === 0 ? (
              <p className="rounded-xl bg-cream-2/50 px-4 py-6 text-center text-sm text-ink-soft">{t('noPlacesChapter')}</p>
            ) : (
              <div className="space-y-1.5">
                {chapterPlaces.map(({ place, refs }) => (
                  <button
                    key={place.id}
                    onClick={() => setSelected(place)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition ${
                      selected?.id === place.id ? 'bg-gold/20 ring-1 ring-gold' : 'hover:bg-cream-2'
                    }`}
                  >
                    {place.img ? (
                      <img src={place.img.url} alt="" className="h-10 w-10 flex-none rounded-lg object-cover ring-1 ring-teal/10" loading="lazy" referrerPolicy="no-referrer" />
                    ) : (
                      <span className="grid h-10 w-10 flex-none place-items-center rounded-lg bg-teal/10 text-teal">
                        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M12 2C8.7 2 6 4.7 6 8c0 4.4 6 12 6 12s6-7.6 6-12c0-3.3-2.7-6-6-6zm0 8.2A2.2 2.2 0 1 1 12 5.8a2.2 2.2 0 0 1 0 4.4z" /></svg>
                      </span>
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium text-ink">{place.name.replace(/ \d+$/, '')}</span>
                      <span className="text-[11px] text-ink-soft">
                        {refs.map((r) => `${r.chapter}:${r.verse}`).slice(0, 6).join(', ')}
                        {refs.length > 6 ? ` +${refs.length - 6}` : ''}
                      </span>
                    </span>
                  </button>
                ))}
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
