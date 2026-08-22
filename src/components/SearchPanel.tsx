import type { Place } from '../types';
import type { SearchHit } from '../lib/globalSearch';
import { useLang, useT } from '../i18n';
import { erasForPlace, placeName } from '../lib/places';
import { ERA_BY_ID } from '../data/eras';

interface Props {
  /** Erkannte Bibelstelle im Suchfeld – führt ins Kapitel. */
  refHit?: { label: string; count: number } | null;
  onOpenRef?: () => void;
  query: string;
  onQuery: (q: string) => void;
  results: Place[];
  topPlaces: Place[];
  onSelect: (p: Place) => void;
  /** Treffer in den Reisen und in der Ausbreitung. */
  stories?: SearchHit[];
  onOpenStory?: (hit: SearchHit) => void;
}

function EraDots({ place }: { place: Place }) {
  const eras = erasForPlace(place)
    .map((id) => ERA_BY_ID[id])
    .filter(Boolean)
    .sort((a, b) => a.order - b.order);
  return (
    <span className="flex items-center gap-0.5">
      {eras.map((e) => (
        <span key={e.id} className="h-2 w-2 rounded-full" style={{ background: e.color }} title={e.de} />
      ))}
    </span>
  );
}

/** Earliest era a place appears in — the same rule that colours its marker. */
function eraColor(place: Place): string {
  const eras = erasForPlace(place)
    .map((id) => ERA_BY_ID[id])
    .filter(Boolean)
    .sort((a, b) => a.order - b.order);
  return eras[0]?.color ?? '#7fe3d5';
}

function Row({ p, onSelect, t }: { p: Place; onSelect: (p: Place) => void; t: (k: any) => string }) {
  const lang = useLang();
  return (
    <button
      onClick={() => onSelect(p)}
      className="bm-row group"
    >
      {/* The mention count is the graphic — it says more about a place than a
          44px thumbnail ever did, and it never fails to load. */}
      <span className="bm-num w-14 flex-none text-xl" style={{ color: eraColor(p) }}>
        {p.mentionCount}
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="truncate text-[15px] font-bold text-white">{placeName(p, lang)}</span>
          <EraDots place={p} />
        </span>
        <span className="mt-0.5 block truncate text-[11px] text-white/45">
          {p.mentionCount === 1 ? t('mention') : t('mentions')}
          {p.types[0] ? ` · ${p.types[0]}` : ''}
        </span>
      </span>
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 flex-none text-white/30 transition group-hover:text-gold" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );
}

function StoryRow({ hit, onOpen }: { hit: SearchHit; onOpen: (h: SearchHit) => void }) {
  return (
    <button onClick={() => onOpen(hit)} className="bm-row group">
      <span className="h-8 w-1 flex-none" style={{ background: hit.color }} />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[14px] font-bold text-white">{hit.title}</span>
        <span className="mt-0.5 block truncate text-[11px] text-white/45">{hit.subtitle}</span>
      </span>
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 flex-none text-white/30 transition group-hover:text-gold" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );
}

export default function SearchPanel({
  refHit,
  onOpenRef,
  query,
  onQuery,
  results,
  topPlaces,
  onSelect,
  stories = [],
  onOpenStory,
}: Props) {
  const t = useT();
  const showResults = query.trim().length > 0;
  const list = showResults ? results : topPlaces;

  return (
    <div className="flex h-full flex-col">
      <div className="p-3">
        <div className="relative">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" fill="currentColor">
            <path d="M10 4a6 6 0 104.47 10l4.27 4.26 1.42-1.42-4.26-4.27A6 6 0 0010 4zm0 2a4 4 0 110 8 4 4 0 010-8z" />
          </svg>
          <input
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder={t('search')}
            aria-label={t('search')}
            className="w-full border border-white/10 bg-deepest py-2.5 pl-9 pr-9 text-sm text-white outline-none transition placeholder:text-white/45 focus:border-gold focus:ring-2 focus:ring-gold/30"
          />
          {query && (
            <button
              onClick={() => onQuery('')}
              aria-label={t('reset')}
              className="absolute right-2 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full text-white/60 hover:bg-surface"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
                <path d="M18.3 5.7 12 12l6.3 6.3-1.4 1.4L10.6 13.4 4.3 19.7 2.9 18.3 9.2 12 2.9 5.7 4.3 4.3l6.3 6.3 6.3-6.3z" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="scroll-soft min-h-0 flex-1 overflow-y-auto px-1 pb-3">
        {refHit && onOpenRef && (
          <button onClick={onOpenRef} className="bm-row group border-l-4 border-gold">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 flex-none text-gold" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H19v15H6.5A2.5 2.5 0 0 0 4 20.5zM19 18v3H6.5" />
            </svg>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[15px] font-bold text-white">{refHit.label}</span>
              <span className="mt-0.5 block truncate text-[11px] text-white/45">
                {refHit.count} {refHit.count === 1 ? t('place') : t('places')} · {t('readChapter')}
              </span>
            </span>
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 flex-none text-white/30 transition group-hover:text-gold" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {showResults && stories.length > 0 && onOpenStory && (
          <>
            <div className="px-3 pb-1 pt-1 text-[11px] font-semibold uppercase tracking-wide text-gold">
              {t('storyResults')}
            </div>
            {stories.map((h) => (
              <StoryRow key={h.key} hit={h} onOpen={onOpenStory} />
            ))}
          </>
        )}

        <div className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wide text-white/60">
          {refHit ? `${t('placesIn')} ${refHit.label}` : showResults ? `${results.length} ${t('results')}` : t('topPlaces')}
        </div>
        {list.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-white/60">
            {stories.length > 0 ? t('noPlaceResults') : t('noResults')}
          </div>
        ) : (
          list.map((p) => <Row key={p.id} p={p} onSelect={onSelect} t={t} />)
        )}
      </div>
    </div>
  );
}
