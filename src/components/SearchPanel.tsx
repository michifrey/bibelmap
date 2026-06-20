import type { Place } from '../types';
import { useT } from '../i18n';
import { erasForPlace } from '../lib/places';
import { ERA_BY_ID } from '../data/eras';

interface Props {
  query: string;
  onQuery: (q: string) => void;
  results: Place[];
  topPlaces: Place[];
  onSelect: (p: Place) => void;
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

function Row({ p, onSelect, t }: { p: Place; onSelect: (p: Place) => void; t: (k: any) => string }) {
  return (
    <button
      onClick={() => onSelect(p)}
      className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-cream-2"
    >
      {p.img ? (
        <img
          src={p.img.url}
          alt=""
          className="h-11 w-11 flex-none rounded-lg object-cover ring-1 ring-teal/10"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      ) : (
        <span className="grid h-11 w-11 flex-none place-items-center rounded-lg bg-teal/10 text-teal">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
            <path d="M12 2C8.7 2 6 4.7 6 8c0 4.4 6 12 6 12s6-7.6 6-12c0-3.3-2.7-6-6-6zm0 8.2A2.2 2.2 0 1 1 12 5.8a2.2 2.2 0 0 1 0 4.4z" />
          </svg>
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="truncate font-medium text-ink group-hover:text-teal">{p.name.replace(/ \d+$/, '')}</span>
          <EraDots place={p} />
        </span>
        <span className="mt-0.5 block truncate text-[11px] text-ink-soft">
          {p.mentionCount} {p.mentionCount === 1 ? t('mention') : t('mentions')}
          {p.types[0] ? ` · ${p.types[0]}` : ''}
        </span>
      </span>
      <svg viewBox="0 0 24 24" className="h-4 w-4 flex-none text-ink-soft/40 transition group-hover:text-teal" fill="currentColor">
        <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" fill="none" />
      </svg>
    </button>
  );
}

export default function SearchPanel({ query, onQuery, results, topPlaces, onSelect }: Props) {
  const t = useT();
  const showResults = query.trim().length > 0;
  const list = showResults ? results : topPlaces;

  return (
    <div className="flex h-full flex-col">
      <div className="p-3">
        <div className="relative">
          <svg viewBox="0 0 24 24" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" fill="currentColor">
            <path d="M10 4a6 6 0 104.47 10l4.27 4.26 1.42-1.42-4.26-4.27A6 6 0 0010 4zm0 2a4 4 0 110 8 4 4 0 010-8z" />
          </svg>
          <input
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder={t('search')}
            className="w-full rounded-xl border border-teal/15 bg-cream py-2.5 pl-9 pr-9 text-sm text-ink outline-none transition placeholder:text-ink-soft/70 focus:border-gold focus:ring-2 focus:ring-gold/30"
          />
          {query && (
            <button
              onClick={() => onQuery('')}
              aria-label={t('reset')}
              className="absolute right-2 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full text-ink-soft hover:bg-cream-2"
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
                <path d="M18.3 5.7 12 12l6.3 6.3-1.4 1.4L10.6 13.4 4.3 19.7 2.9 18.3 9.2 12 2.9 5.7 4.3 4.3l6.3 6.3 6.3-6.3z" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="px-4 pb-1 text-[11px] font-semibold uppercase tracking-wide text-ink-soft">
        {showResults ? `${results.length} ${t('results')}` : t('topPlaces')}
      </div>

      <div className="scroll-soft min-h-0 flex-1 overflow-y-auto px-1 pb-3">
        {list.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-ink-soft">{t('noResults')}</div>
        ) : (
          list.map((p) => <Row key={p.id} p={p} onSelect={onSelect} t={t} />)
        )}
      </div>
    </div>
  );
}
