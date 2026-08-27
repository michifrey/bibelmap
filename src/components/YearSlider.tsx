import { useEffect, useState } from 'react';
import type { Lang } from '../i18n';
import { useT } from '../i18n';
import MapPanel from './MapPanel';
import { eraForYear } from '../data/eras';
import {
  formatYear,
  loadBorders,
  polityColor,
  polityName,
  snapshotFor,
  YEAR_MAX,
  YEAR_MIN,
  type BorderData,
} from '../lib/borders';

interface Props {
  lang: Lang;
  year: number;
  onYear: (year: number) => void;
  onClose: () => void;
  /** Era filter, shared with the timeline this panel replaces. */
  era: string | null;
  onEra: (eraId: string | null) => void;
  eraCounts: Record<string, number>;
  /** Mobile-only: collapsed by default; desktop always shows the band. */
  open?: boolean;
  onToggle?: () => void;
}

/** A quarter-century per step: fine enough to feel continuous when dragged. */
const STEP = 25;

/** Where a year sits on the track, 0…1. */
const frac = (year: number) => (year - YEAR_MIN) / (YEAR_MAX - YEAR_MIN);

/**
 * The next atlas plate in the given direction. Going back from a year that sits
 * between two snapshots lands on the one currently in force, not the one before
 * it — the same way a "previous chapter" button works mid-chapter.
 */
function stepSnapshot(data: BorderData, year: number, dir: 1 | -1): number {
  const current = snapshotFor(data, year);
  if (dir === 1) return data.years.find((y) => y > year) ?? current;
  if (year > current) return current;
  const i = data.years.indexOf(current);
  return data.years[Math.max(0, i - 1)];
}

export default function YearSlider({
  lang,
  year,
  onYear,
  onClose,
  era,
  onEra,
  eraCounts,
  open = false,
  onToggle,
}: Props) {
  const t = useT();
  const [data, setData] = useState<BorderData | null>(null);

  useEffect(() => {
    let live = true;
    loadBorders().then((d) => live && setData(d));
    return () => {
      live = false;
    };
  }, []);

  const atEra = eraForYear(year);
  const snapshot = data ? snapshotFor(data, year) : null;
  const polities = data && snapshot !== null ? (data.byYear[String(snapshot)] ?? []) : [];

  // On a phone the year is too big to share a line with the label and the
  // close button, so it wraps onto its own centred row.
  const actions = (
    <>
      {/* the year is the headline of this panel; the arrows step from one
          atlas plate to the next, the slider scrubs freely between them */}
      <div className="order-3 flex w-full items-center justify-center gap-2 sm:order-2 sm:ml-auto sm:w-auto">
            <button
              onClick={() => data && onYear(stepSnapshot(data, year, -1))}
              disabled={!data || snapshot === data.years[0]}
              aria-label={t('prevSnapshot')}
              className="bm-btn bm-btn-ghost px-2 py-1.5"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
                <path d="M15 5l-7 7 7 7z" />
              </svg>
            </button>
            <span className="bm-num whitespace-nowrap text-2xl text-gold sm:text-3xl">
              {formatYear(year, lang)}
            </span>
            <button
              onClick={() => data && onYear(stepSnapshot(data, year, 1))}
              disabled={!data || year >= data.years[data.years.length - 1]}
              aria-label={t('nextSnapshot')}
              className="bm-btn bm-btn-ghost px-2 py-1.5"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
                <path d="M9 5l7 7-7 7z" />
              </svg>
            </button>
      </div>

      <button
        onClick={onClose}
        className="bm-btn bm-btn-ghost order-2 ml-auto px-3 py-1.5 text-[11px] sm:order-3 sm:ml-0"
      >
        {t('bordersOff')}
      </button>
    </>
  );

  return (
    <MapPanel title={t('empires')} open={open} onToggle={onToggle} actions={actions}>
      <>
          {/* the track — ticks mark the years the atlas actually has a map for */}
          <div className="relative mt-3 h-9">
            <div className="pointer-events-none absolute inset-x-0 top-4 h-px bg-white/15" />
            {/* Ticks are drawn, not clicked: the range input has to own the whole
                track or a drag started on a tick would go nowhere. */}
            {data?.years.map((y) => (
              <i
                key={y}
                title={formatYear(y, lang)}
                className={`pointer-events-none absolute w-px transition-all ${
                  y === snapshot ? 'top-1 h-7 bg-gold' : 'top-3 h-3 bg-white/30'
                }`}
                style={{ left: `${frac(y) * 100}%` }}
              />
            ))}
            <input
              type="range"
              min={YEAR_MIN}
              max={YEAR_MAX}
              step={STEP}
              value={year}
              onChange={(e) => onYear(Number(e.target.value))}
              aria-label={t('year')}
              className="bm-year-range absolute inset-x-0 top-1"
            />
          </div>

          <div className="flex justify-between pb-1">
            <span className="text-[10px] font-bold tracking-[0.16em] text-white/60">
              {formatYear(YEAR_MIN, lang).toUpperCase()}
            </span>
            <span className="text-[10px] font-bold tracking-[0.16em] text-white/60">
              {formatYear(YEAR_MAX, lang).toUpperCase()}
            </span>
          </div>

          {/* the era this year falls in — the filter the timeline would offer,
              kept reachable while the timeline is swapped out for this panel */}
          <div className="mt-2.5 flex flex-wrap items-center gap-2 border-t border-white/10 pt-2.5">
            {atEra ? (
              <button
                onClick={() => onEra(era === atEra.id ? null : atEra.id)}
                aria-pressed={era === atEra.id}
                className="flex items-center gap-2 px-2.5 py-1 transition"
                style={{
                  background: era === atEra.id ? atEra.color : `${atEra.color}26`,
                  outline: era === atEra.id ? `1px solid ${atEra.color}` : 'none',
                }}
              >
                <i className="block h-2 w-2 flex-none" style={{ background: atEra.color }} />
                <span className="text-xs font-bold text-white">{lang === 'de' ? atEra.de : atEra.en}</span>
                <span className="text-[11px] text-white/70">
                  {eraCounts[atEra.id] ?? 0} {t('places')}
                </span>
              </button>
            ) : (
              <span className="text-[11px] text-white/45">{t('betweenEras')}</span>
            )}
            {era !== null && (
              <button onClick={() => onEra(null)} className="bm-btn bm-btn-ghost px-2.5 py-1 text-[11px]">
                {t('allEras')}
              </button>
            )}
          </div>

          {/* legend: what is on the map right now */}
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-white/10 pt-2.5">
            {snapshot !== null && snapshot !== year && (
              <span className="text-[11px] text-white/50">
                {t('bordersAsOf')} {formatYear(snapshot, lang)}
              </span>
            )}
            {polities.map((p) => (
              <span key={p.name} className="flex items-center gap-1.5 text-[11.5px] text-white/85">
                <i className="block h-2 w-2 flex-none" style={{ background: polityColor(p.name) }} />
                {polityName(p, lang)}
              </span>
            ))}
          </div>

        <p className="mt-2 text-[10.5px] leading-snug text-white/40">{t('bordersNote')}</p>
      </>
    </MapPanel>
  );
}
