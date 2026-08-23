import { useMemo, useState } from 'react';
import type { Place, PlaceImage, VerseRef } from '../types';
import type { Lang } from '../i18n';
import { useT } from '../i18n';
import { booksForPlace, erasForPlace, placeName, placeNames } from '../lib/places';
import { formatKm } from '../lib/route';
import { licenseInfo } from '../lib/imageCredit';
import { BOOK_BY_OSIS, bibleProjectUrl } from '../data/books';
import { ERA_BY_ID, ERAS } from '../data/eras';
import { tribeAt, tribeSlug } from '../data/tribes';
import PlaceThumb from './PlaceThumb';
import PlaceMedia from './PlaceMedia';
import ShareLink from './ShareLink';

interface Props {
  place: Place;
  lang: Lang;
  /** Die Stammeskarte auf dem Gebiet öffnen, in dem dieser Ort liegt. */
  onOpenTribe?: (tribeSlug: string) => void;
  /** Orte in Gehweite, schon sortiert – berechnet in App.tsx. */
  neighbours?: { place: Place; km: number; dir: string }[];
  onSelectPlace?: (p: Place) => void;
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
      className="inline-flex items-center gap-1 bg-surface px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-gold/30"
    >
      {children}
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3 w-3 opacity-60" fill="currentColor">
        <path d="M14 3h7v7h-2V6.4l-9.3 9.3-1.4-1.4L17.6 5H14zM5 5h5v2H7v10h10v-3h2v5H5z" />
      </svg>
    </a>
  );
}

export default function PlaceDetail({ place, lang, neighbours = [], onSelectPlace, onOpenTribe, onClose }: Props) {
  const tribe = useMemo(() => tribeAt(place.lat, place.lon), [place.lat, place.lon]);
  const t = useT();
  const [img, setImg] = useState<PlaceImage | null>(place.img);
  const license = licenseInfo(img?.license ?? null, lang);
  const grouped = useMemo(() => groupByBook(place.verses), [place]);
  const eras = useMemo(() => {
    const ids = new Set(erasForPlace(place));
    return ERAS.filter((e) => ids.has(e.id));
  }, [place]);
  const books = booksForPlace(place);
  const title = placeName(place, lang);
  // Every other spelling we know, in both languages, minus the one in the heading.
  const alsoCalled = useMemo(
    () => [...new Set(placeNames(place, lang))].filter((n) => n !== title),
    [place, lang, title],
  );

  const obUrl = `https://www.openbible.info/geo/ancient/${place.id}/${place.slug}`;
  const wikiUrl = place.wikidata ? `https://www.wikidata.org/wiki/${place.wikidata}` : null;

  return (
    <div className="animate-fade-in flex h-full flex-col">
      {/* image header */}
      <div className="relative">
        <PlaceThumb
          place={place}
          className="h-40 w-full"
          onResolved={setImg}
          placeholder={
            <div className="flex h-28 w-full items-center justify-center bg-gradient-to-br from-signal to-deepest">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-10 w-10 text-gold/70" fill="currentColor">
                <path d="M12 2C8.7 2 6 4.7 6 8c0 4.4 6 12 6 12s6-7.6 6-12c0-3.3-2.7-6-6-6zm0 8.2A2.2 2.2 0 1 1 12 5.8a2.2 2.2 0 0 1 0 4.4z" />
              </svg>
            </div>
          }
        />
        <div className="absolute right-2 top-2 flex items-center gap-1.5">
          <ShareLink className="bm-btn bg-deepest/95 px-2.5 py-1.5 text-[11px] ring-1 ring-white/10 hover:bg-deepest" />
          <button
            onClick={onClose}
            aria-label={t('close')}
            className="grid h-8 w-8 place-items-center rounded-full bg-deepest/95 text-white ring-1 ring-white/10 transition hover:bg-deepest"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
              <path d="M18.3 5.7 12 12l6.3 6.3-1.4 1.4L10.6 13.4 4.3 19.7 2.9 18.3 9.2 12 2.9 5.7 4.3 4.3l6.3 6.3 6.3-6.3z" />
            </svg>
          </button>
        </div>
        {img?.credit && (
          <div className="absolute bottom-1 right-2 flex max-w-[calc(100%-1rem)] items-center gap-1 bg-black/55 px-1.5 py-0.5 text-[10px] text-white/90">
            <a
              href={img.creditUrl ?? '#'}
              target="_blank"
              rel="noreferrer"
              className="truncate hover:text-gold"
              title={img.credit}
            >
              © {img.credit}
            </a>
            {/* Die Lizenz gehört dazu: fast alle Bilder stehen unter einer, die
                nicht nur den Namen, sondern auch sie selbst genannt haben will. */}
            {license &&
              (license.url ? (
                <a
                  href={license.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-none border-l border-white/25 pl-1 hover:text-gold"
                  title={license.hint}
                >
                  {license.label}
                </a>
              ) : (
                <span className="flex-none border-l border-white/25 pl-1" title={license.hint}>
                  {license.label}
                </span>
              ))}
          </div>
        )}
      </div>

      <div className="scroll-soft flex-1 overflow-y-auto px-4 pb-5 pt-3">
        {/* The count is set as a display figure, not as a badge — it is the
            single most telling fact about a place. */}
        {/* Stacked, not side by side: the rail is only 22rem wide and a long
            name plus a four-digit count collide there. */}
        <h2 className="font-display text-2xl uppercase leading-none break-words text-white">{title}</h2>
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="bm-num text-4xl text-gold">{place.mentionCount}</span>
          <span className="bm-eyebrow bm-eyebrow-dim">
            {place.mentionCount === 1 ? t('mention') : t('mentions')}
          </span>
        </div>
        <div className="mt-2.5 flex flex-wrap gap-1">
          {place.types.map((ty) => (
            <span key={ty} className="bm-chip capitalize">{ty}</span>
          ))}
        </div>

        {/* eras / when */}
        <div className="mt-4">
          <div className="bm-eyebrow mb-2">{t('appearsIn')}</div>
          <div className="flex flex-wrap gap-1.5">
            {eras.map((e) => (
              <span
                key={e.id}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold text-white"
                style={{ background: e.color }}
              >
                {lang === 'de' ? e.de : e.en}
              </span>
            ))}
          </div>
        </div>

        {alsoCalled.length > 0 && (
          <div className="mt-4">
            <div className="bm-eyebrow mb-2">{t('alsoCalled')}</div>
            <div className="text-sm text-white">{alsoCalled.join(' · ')}</div>
          </div>
        )}

        {/* passages grouped by book */}
        <div className="mt-4">
          <div className="bm-eyebrow mb-2">{t('passages')}</div>
          <div className="space-y-2">
            {grouped.map(({ osis, refs }) => {
              const book = BOOK_BY_OSIS[osis];
              const era = book ? ERA_BY_ID[book.era] : null;
              return (
                <div key={osis} className="bg-surface/50 p-2.5">
                  <div className="mb-1 flex items-center gap-2">
                    {era && <span className="h-2 w-2 rounded-full" style={{ background: era.color }} />}
                    <span className="text-sm font-semibold text-white">{book ? (lang === 'de' ? book.de : book.en) : osis}</span>
                    <span className="text-[11px] text-white/60">· {refs.length}×</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {refs.slice(0, 24).map((v) => (
                      <a
                        key={v.osis}
                        href={`https://www.bible.com/search/bible?query=${encodeURIComponent(v.ref)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-deepest px-1.5 py-0.5 text-[11px] text-white/60 ring-1 ring-white/10 transition hover:bg-gold/20 hover:text-white"
                        title={v.ref}
                      >
                        {v.chapter}:{v.verse}
                      </a>
                    ))}
                    {refs.length > 24 && <span className="px-1 text-[11px] text-white/60">+{refs.length - 24}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <PlaceMedia place={place} />

        {/* Wessen Land war das? Die Gegenrichtung zu den Orten der Stammeskarte. */}
        {tribe && onOpenTribe && (
          <div className="border-t border-white/10 px-4 py-3.5">
            <div className="bm-eyebrow mb-2">{t('inTribe')}</div>
            <button
              onClick={() => onOpenTribe(tribeSlug(tribe))}
              className="flex w-full items-center gap-2 bg-white/8 px-2.5 py-2 text-left transition hover:bg-gold/30"
            >
              <span className="h-3.5 w-3.5 flex-none" style={{ background: tribe.color }} />
              <span className="flex-1 text-[12.5px] font-bold text-white">
                {lang === 'de' ? tribe.de : tribe.en}
              </span>
              <span className="text-[11px] font-semibold text-white/50">{tribe.lot}</span>
            </button>
          </div>
        )}

        {/* Nachbarorte: was an einem Tag zu Fuß erreichbar war */}
        {neighbours.length > 0 && onSelectPlace && (
          <div className="border-t border-white/10 px-4 py-3.5">
            <div className="bm-eyebrow mb-2">{t('withinWalk')}</div>
            <div className="flex flex-wrap gap-1.5">
              {neighbours.map((n) => (
                <button
                  key={n.place.id}
                  onClick={() => onSelectPlace(n.place)}
                  className="bg-white/8 px-2.5 py-1.5 text-[11.5px] font-bold text-white transition hover:bg-gold/30"
                  title={`${formatKm(n.km, lang)} ${n.dir}`}
                >
                  {placeName(n.place, lang)}
                  <span className="ml-1.5 font-medium text-white/50">
                    {formatKm(n.km, lang)} {n.dir}
                  </span>
                </button>
              ))}
            </div>
            <p className="mt-2 text-[11px] text-white/40">{t('withinWalkNote')}</p>
          </div>
        )}

        {/* sources */}
        <div className="mt-5">
          <div className="bm-eyebrow mb-2">{t('sources')}</div>
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
