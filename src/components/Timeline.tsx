import type { Lang } from '../i18n';
import { useT } from '../i18n';
import { ERAS } from '../data/eras';

interface Props {
  lang: Lang;
  selected: string | null;
  counts: Record<string, number>;
  onSelect: (eraId: string | null) => void;
  /** Mobile-only: collapsed by default; desktop always shows the era cards. */
  open?: boolean;
  onToggle?: () => void;
}

export default function Timeline({ lang, selected, counts, onSelect, open = false, onToggle }: Props) {
  const t = useT();
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-[3.75rem] z-[1100] flex justify-center p-2 sm:bottom-0 sm:p-4">
      <div className="pointer-events-auto w-full max-w-5xl rounded-2xl bg-cream/90 p-2 shadow-2xl ring-1 ring-white/40 backdrop-blur-xl sm:rounded-3xl sm:p-3">
        <div className="flex items-center justify-between px-1 sm:mb-2">
          <button onClick={onToggle} className="flex items-center gap-1.5 sm:pointer-events-none">
            <span className="font-display text-sm font-semibold tracking-wide text-teal">{t('timeline')}</span>
            <svg viewBox="0 0 24 24" className={`h-4 w-4 text-ink-soft transition-transform sm:hidden ${open ? '' : 'rotate-180'}`} fill="currentColor"><path d="M7 14l5-5 5 5z" /></svg>
          </button>
          <button
            onClick={() => onSelect(null)}
            className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
              selected === null ? 'bg-teal text-cream' : 'text-ink-soft hover:bg-cream-2'
            }`}
          >
            {t('allEras')}
          </button>
        </div>
        <div className={`scroll-soft mt-2 gap-1.5 overflow-x-auto pb-1 sm:mt-0 sm:flex ${open ? 'flex' : 'hidden'}`}>
          {ERAS.map((e) => {
            const active = selected === e.id;
            const n = counts[e.id] ?? 0;
            return (
              <button
                key={e.id}
                onClick={() => onSelect(active ? null : e.id)}
                className={`group relative flex min-w-[7.5rem] flex-1 flex-col items-start gap-0.5 rounded-xl border px-3 py-2 text-left transition ${
                  active
                    ? 'border-transparent text-cream shadow-md'
                    : 'border-teal/10 bg-cream-2/40 hover:bg-cream-2'
                }`}
                style={active ? { background: e.color } : undefined}
              >
                <span className="h-1 w-8 rounded-full" style={{ background: active ? 'rgba(255,255,255,.7)' : e.color }} />
                <span className={`text-[13px] font-semibold leading-tight ${active ? 'text-cream' : 'text-ink'}`}>
                  {lang === 'de' ? e.de : e.en}
                </span>
                <span className={`text-[10px] ${active ? 'text-cream/85' : 'text-ink-soft'}`}>{e.range}</span>
                <span className={`text-[10px] ${active ? 'text-cream/85' : 'text-ink-soft'}`}>
                  {n} {t('places')}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
