import type { Lang } from '../i18n';
import { useT } from '../i18n';
import { ERAS } from '../data/eras';

interface Props {
  lang: Lang;
  selected: string | null;
  counts: Record<string, number>;
  onSelect: (eraId: string | null) => void;
}

export default function Timeline({ lang, selected, counts, onSelect }: Props) {
  const t = useT();
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1100] flex justify-center p-3 sm:p-4">
      <div className="pointer-events-auto w-full max-w-5xl rounded-2xl bg-cream/90 p-3 shadow-xl ring-1 ring-teal/10 backdrop-blur">
        <div className="mb-2 flex items-center justify-between px-1">
          <span className="font-display text-sm font-semibold tracking-wide text-teal">{t('timeline')}</span>
          <button
            onClick={() => onSelect(null)}
            className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
              selected === null ? 'bg-teal text-cream' : 'text-ink-soft hover:bg-cream-2'
            }`}
          >
            {t('allEras')}
          </button>
        </div>
        <div className="scroll-soft flex gap-1.5 overflow-x-auto pb-1">
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
