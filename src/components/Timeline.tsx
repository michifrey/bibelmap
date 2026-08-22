import type { Lang } from '../i18n';
import { useT } from '../i18n';
import { ERAS } from '../data/eras';

interface Props {
  lang: Lang;
  selected: string | null;
  counts: Record<string, number>;
  onSelect: (eraId: string | null) => void;
  /** „Alles bis hierhin" statt „nur diese Epoche". */
  cumulative?: boolean;
  onCumulative?: () => void;
  /** Mobile-only: collapsed by default; desktop always shows the band. */
  open?: boolean;
  onToggle?: () => void;
}

/**
 * Rough duration of each era in years, read off the ranges in eras.ts. Used
 * only to weight the segment widths — nine equally wide buttons made a
 * 40-year era look as long as a 500-year one.
 */
const YEARS: Record<string, number> = {
  patriarchs: 500,
  exodus: 40,
  conquest: 356,
  united: 120,
  divided: 344,
  exile: 48,
  return: 138,
  gospels: 39,
  church: 67,
};

/**
 * Square-rooted so the short eras stay clickable: on a true linear scale
 * "Exodus" would be four pixels wide.
 */
function weight(id: string): number {
  return Math.sqrt(YEARS[id] ?? 100);
}

export default function Timeline({
  lang,
  selected,
  counts,
  onSelect,
  cumulative = false,
  onCumulative,
  open = false,
  onToggle,
}: Props) {
  const t = useT();
  const active = selected ? ERAS.find((e) => e.id === selected) : null;

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-[3.75rem] z-[1100] flex justify-center p-2 sm:bottom-0 sm:p-4">
      <div className="bm-panel pointer-events-auto w-full max-w-5xl p-3 sm:p-4">
        <div className="mb-3 flex items-center gap-3">
          <button onClick={onToggle} className="flex items-center gap-1.5 sm:pointer-events-none">
            <span className="bm-eyebrow">{t('timeline')}</span>
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className={`h-4 w-4 text-white/60 transition-transform sm:hidden ${open ? '' : 'rotate-180'}`}
              fill="currentColor"
            >
              <path d="M7 14l5-5 5 5z" />
            </svg>
          </button>

          {active && (
            <span className="hidden items-center gap-2 px-2.5 py-1 sm:flex" style={{ background: `${active.color}26` }}>
              <i className="block h-2 w-2" style={{ background: active.color }} />
              <span className="text-xs font-bold text-white">{lang === 'de' ? active.de : active.en}</span>
              <span className="text-[11px] text-white/60">
                {active.range} · {counts[active.id] ?? 0} {t('places')}
              </span>
            </span>
          )}

          <div className="flex-1" />
          <span className="hidden text-[10.5px] text-white/40 sm:block">{t('timelineScaleHint')}</span>
          {onCumulative && (
            <button
              onClick={onCumulative}
              title={t('cumulativeHint')}
              className={`bm-btn ${cumulative ? 'bm-btn-signal' : 'bm-btn-ghost'} px-3 py-1.5 text-[11px]`}
            >
              {t('cumulative')}
            </button>
          )}
          <button
            onClick={() => onSelect(null)}
            className={`bm-btn ${selected === null ? 'bm-btn-signal' : 'bm-btn-ghost'} px-3 py-1.5 text-[11px]`}
          >
            {t('allEras')}
          </button>
        </div>

        {/* the band — width follows duration, height marks the selection */}
        <div className={`${open ? 'flex' : 'hidden'} items-end gap-1 sm:flex`} style={{ height: 96 }}>
          {ERAS.map((e) => {
            const on = selected === e.id;
            const n = counts[e.id] ?? 0;
            return (
              <button
                key={e.id}
                onClick={() => onSelect(on ? null : e.id)}
                title={`${lang === 'de' ? e.de : e.en} · ${e.range} · ${n} ${t('places')}`}
                className="group flex min-w-0 flex-col justify-end overflow-hidden px-1.5 py-2 text-left transition-all sm:px-2.5"
                style={{
                  flex: `${weight(e.id)} 1 0`,
                  height: on ? 96 : 58,
                  background: on ? e.color : `${e.color}24`,
                  borderTop: on ? 'none' : `3px solid ${e.color}`,
                }}
              >
                <span className={`bm-num truncate ${on ? 'text-lg' : 'text-sm'} text-white`}>{n}</span>
                <span
                  className={`mt-1 truncate text-[11px] font-bold ${on ? 'text-white' : 'text-white/85'}`}
                >
                  {lang === 'de' ? e.de : e.en}
                </span>
                {on && <span className="mt-0.5 truncate text-[10px] text-white/75">{e.range}</span>}
              </button>
            );
          })}
        </div>

        <div className={`${open ? 'flex' : 'hidden'} justify-between pt-2 sm:flex`}>
          <span className="text-[10px] font-bold tracking-[0.16em] text-white/35">2000 V. CHR.</span>
          <span className="text-[10px] font-bold tracking-[0.16em] text-white/35">100 N. CHR.</span>
        </div>
      </div>
    </div>
  );
}
