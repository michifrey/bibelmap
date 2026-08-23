import type { Lang } from '../i18n';
import { useT } from '../i18n';
import { ERAS, eraWeight } from '../data/eras';
import MapPanel from './MapPanel';

interface Props {
  lang: Lang;
  selected: string | null;
  counts: Record<string, number>;
  onSelect: (eraId: string | null) => void;
  /** Mobile-only: collapsed by default; desktop always shows the band. */
  open?: boolean;
  onToggle?: () => void;
}

export default function Timeline({ lang, selected, counts, onSelect, open = false, onToggle }: Props) {
  const t = useT();
  const active = selected ? ERAS.find((e) => e.id === selected) : null;

  const actions = (
    <>
      {active && (
        <span className="hidden items-center gap-2 px-2.5 py-1 sm:flex" style={{ background: `${active.color}26` }}>
          <i className="block h-2 w-2" style={{ background: active.color }} />
          <span className="text-xs font-bold text-white">{lang === 'de' ? active.de : active.en}</span>
          <span className="text-[11px] text-white/60">
            {active.range} · {counts[active.id] ?? 0} {t('places')}
          </span>
        </span>
      )}
      <div className="ml-auto flex items-center gap-3">
        <span className="hidden text-[10.5px] text-white/40 sm:block">{t('timelineScaleHint')}</span>
        <button
          onClick={() => onSelect(null)}
          className={`bm-btn ${selected === null ? 'bm-btn-signal' : 'bm-btn-ghost'} px-3 py-1.5 text-[11px]`}
        >
          {t('allEras')}
        </button>
      </div>
    </>
  );

  return (
    <MapPanel title={t('timeline')} open={open} onToggle={onToggle} actions={actions}>
      {/* the band — width follows duration, height marks the selection */}
      <div className="mt-3 flex items-end gap-1" style={{ height: 96 }}>
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
                flex: `${eraWeight(e.id)} 1 0`,
                height: on ? 96 : 58,
                background: on ? e.color : `${e.color}24`,
                borderTop: on ? 'none' : `3px solid ${e.color}`,
              }}
            >
              <span className={`bm-num truncate ${on ? 'text-lg' : 'text-sm'} text-white`}>{n}</span>
              <span className={`mt-1 truncate text-[11px] font-bold ${on ? 'text-white' : 'text-white/85'}`}>
                {lang === 'de' ? e.de : e.en}
              </span>
              {on && <span className="mt-0.5 truncate text-[10px] text-white/75">{e.range}</span>}
            </button>
          );
        })}
      </div>

      <div className="flex justify-between pt-2">
        <span className="text-[10px] font-bold tracking-[0.16em] text-white/35">2000 V. CHR.</span>
        <span className="text-[10px] font-bold tracking-[0.16em] text-white/35">100 N. CHR.</span>
      </div>
    </MapPanel>
  );
}
