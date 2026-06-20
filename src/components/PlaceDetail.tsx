import { useMemo } from 'react';
import type { Place, VerseRef } from '../types';
import type { Lang } from '../i18n';
import { useT } from '../i18n';
import { booksForPlace, erasForPlace } from '../lib/places';
import { usePlaceImage } from '../lib/wikidataImage';
import { BOOK_BY_OSIS, bibleProjectUrl } from '../data/books';
import { ERA_BY_ID, ERAS } from '../data/eras';

interface Props {
  place: Place;
  lang: Lang;
  onClose: () => void;
}

function groupByBook(verses: VerseRef[]): { osis: string; refs: VerseRef[] }[] {
  const map = new Map<string, VerseRef[]>();
  for (const v of verses) {
    if (!map.has(v.book)) map.set(v.book, []);
    map.get(v.book)!.push(v);
  }
  return [...map.entries()]
    .map(([osis, refs]) => ({ osis, refs }))
    .sort((a, b) => (BOOK_BY_OSIS[a.osis]?.num ?? 99) - (BOOK_BY_OSIS[b.osis]?.num ?? 99));
}

function SourceLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1 rounded-lg bg-cream-2 px-2.5 py-1.5 text-xs font-medium text-teal transition hover:bg-gold/30"
    >
      {children}
      <svg viewBox="0 0 24 24" className="h-3 w-3 opacity-60" fill="currentColor">
        <path d="M14 3h7v7h-2V6.4l-9.3 9.3-1.4-1.4L17.6 5H14zM5 5h5v2H7v10h10v-3h2v5H5z" />
      </svg>
    </a>
  );
}

export default function PlaceDetail({ place, lang, onClose }: Props) {
  const t = useT();
  const img = usePlaceImage(place);
  const grouped = useMemo(() => groupByBook(place.verses), [place]);
  const eras = useMemo(() => {
    const ids = new Set(erasForPlace(place));
    return ERAS.filter((e) => ids.has(e.id));
  }, [place]);
  const books = booksForPlace(place);

  const obUrl = `https://www.openbible.info/geo/ancient/${place.id}/${place.slug}`;
  const wikiUrl = place.wikidata ? `https://www.wikidata.org/wiki/${place.wikidata}` : null;

  return (
    <div className="animate-fade-in flex h-full flex-col">
      {/* image header */}
      <div className="relative">
        {img ? (
          <img
            src={img.url}
            alt={place.name}
            className="h-40 w-full object-cover"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex h-28 w-full items-center justify-center bg-gradient-to-br from-teal to-teal-2">
            <svg viewBox="0 0 24 24" className="h-10 w-10 text-gold/70" fill="currentColor">
              <path d="M12 2C8.7 2 6 4.7 6 8c0 4.4 6 12 6 12s6-7.6 6-12c0-3.3-2.7-6-6-6zm0 8.2A2.2 2.2 0 1 1 12 5.8a2.2 2.2 0 0 1 0 4.4z" />
            </svg>
          </div>
        )}
        <button
          onClick={onClose}
          aria-label={t('close')}
          className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-cream/90 text-teal shadow ring-1 ring-teal/10 transition hover:bg-cream"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
            <path d="M18.3 5.7 12 12l6.3 6.3-1.4 1.4L10.6 13.4 4.3 19.7 2.9 18.3 9.2 12 2.9 5.7 4.3 4.3l6.3 6.3 6.3-6.3z" />
          </svg>
        </button>
        {img?.credit && (
          <a
            href={img.creditUrl ?? '#'}
            target="_blank"
            rel="noreferrer"
            className="absolute bottom-1 right-2 rounded bg-black/45 px-1.5 py-0.5 text-[10px] text-white/90"
          >
            © {img.credit}
          </a>
        )}
      </div>

      <div className="scroll-soft flex-1 overflow-y-auto px-4 pb-5 pt-3">
        <h2 className="font-display text-2xl font-semibold text-teal">{place.name.replace(/ \d+$/, '')}</h2>
        <div className="mt-1 flex flex-wrap gap-1.5">
          {place.types.map((ty) => (
            <span key={ty} className="rounded-full bg-cream-2 px-2 py-0.5 text-[11px] capitalize text-ink-soft">
              {ty}
            </span>
          ))}
          <span className="rounded-full bg-teal/10 px-2 py-0.5 text-[11px] font-medium text-teal">
            {place.mentionCount} {place.mentionCount === 1 ? t('mention') : t('mentions')}
          </span>
        </div>

        {/* eras / when */}
        <div className="mt-4">
          <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink-soft">{t('appearsIn')}</div>
          <div className="flex flex-wrap gap-1.5">
            {eras.map((e) => (
              <span
                key={e.id}
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium text-cream"
                style={{ background: e.color }}
              >
                {lang === 'de' ? e.de : e.en}
              </span>
            ))}
          </div>
        </div>

        {place.variants.length > 1 && (
          <div className="mt-4">
            <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-ink-soft">{t('alsoCalled')}</div>
            <div className="text-sm text-ink">{place.variants.join(' · ')}</div>
          </div>
        )}

        {/* passages grouped by book */}
        <div className="mt-4">
          <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink-soft">{t('passages')}</div>
          <div className="space-y-2">
            {grouped.map(({ osis, refs }) => {
              const book = BOOK_BY_OSIS[osis];
              const era = book ? ERA_BY_ID[book.era] : null;
              return (
                <div key={osis} className="rounded-xl bg-cream-2/50 p-2.5">
                  <div className="mb-1 flex items-center gap-2">
                    {era && <span className="h-2 w-2 rounded-full" style={{ background: era.color }} />}
                    <span className="text-sm font-semibold text-teal">{book ? (lang === 'de' ? book.de : book.en) : osis}</span>
                    <span className="text-[11px] text-ink-soft">· {refs.length}×</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {refs.slice(0, 24).map((v) => (
                      <a
                        key={v.osis}
                        href={`https://www.bible.com/search/bible?query=${encodeURIComponent(v.ref)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-md bg-cream px-1.5 py-0.5 text-[11px] text-ink-soft ring-1 ring-teal/10 transition hover:bg-gold/20 hover:text-teal"
                        title={v.ref}
                      >
                        {v.chapter}:{v.verse}
                      </a>
                    ))}
                    {refs.length > 24 && <span className="px-1 text-[11px] text-ink-soft">+{refs.length - 24}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* sources */}
        <div className="mt-5">
          <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink-soft">{t('sources')}</div>
          <div className="flex flex-wrap gap-1.5">
            <SourceLink href={obUrl}>{t('openbible')}</SourceLink>
            {place.biblia && <SourceLink href={place.biblia}>{t('biblia')}</SourceLink>}
            {wikiUrl && <SourceLink href={wikiUrl}>{t('wikipedia')}</SourceLink>}
            {books[0] && <SourceLink href={bibleProjectUrl(books[0])}>{t('video')}</SourceLink>}
          </div>
        </div>
      </div>
    </div>
  );
}
