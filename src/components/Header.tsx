import { useState } from 'react';
import type { Lang } from '../i18n';
import { useT } from '../i18n';

export type Mode = 'present' | 'history' | 'compare';

interface Props {
  lang: Lang;
  onLang: (l: Lang) => void;
  heat: boolean;
  onHeat: (v: boolean) => void;
  onMode: (m: Mode) => void;
}

export default function Header({ lang, onLang, heat, onHeat, onMode }: Props) {
  const t = useT();
  const [open, setOpen] = useState(false);

  const modes: { id: Mode; label: string; hint: string; icon: string }[] = [
    { id: 'present', label: t('presentation'), hint: t('presentationHint'), icon: 'M4 5h16v10H4zm0 12h16v2H4zm6-9v6l5-3z' },
    { id: 'history', label: t('historyMode'), hint: t('historyHint'), icon: 'M12 8v5l3 2' },
    { id: 'compare', label: t('compareMode'), hint: t('compareIntro'), icon: 'M12 3v18M5 8l-3 5h6zM19 8l-3 5h6z' },
  ];

  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-[1100] flex items-start justify-between gap-3 p-3 sm:p-4">
      <div className="pointer-events-auto flex items-center gap-3 rounded-3xl bg-cream/75 px-4 py-2.5 shadow-lg ring-1 ring-white/40 backdrop-blur-xl">
        <div className="grid h-9 w-9 place-items-center rounded-2xl bg-gradient-to-br from-teal to-teal-2 text-gold shadow-inner">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
            <path d="M12 2C8.7 2 6 4.7 6 8c0 4.4 6 12 6 12s6-7.6 6-12c0-3.3-2.7-6-6-6zm0 8.2A2.2 2.2 0 1 1 12 5.8a2.2 2.2 0 0 1 0 4.4z" />
          </svg>
        </div>
        <div className="leading-tight">
          <div className="font-display text-xl font-semibold text-teal">{t('appTitle')}</div>
          <div className="hidden text-[11px] text-ink-soft sm:block">{t('tagline')}</div>
        </div>
      </div>

      <div className="pointer-events-auto flex items-center gap-2">
        {/* modes dropdown */}
        <div className="relative">
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-1.5 rounded-xl bg-teal px-3.5 py-2.5 text-sm font-medium text-cream shadow-lg ring-1 ring-teal/20 transition hover:bg-teal-2"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2"/></svg>
            <span className="hidden sm:inline">{t('modes')}</span>
            <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor"><path d="M7 10l5 5 5-5z" /></svg>
          </button>
          {open && (
            <>
              <div className="fixed inset-0 z-[-1]" onClick={() => setOpen(false)} />
              <div className="absolute right-0 mt-2 w-72 overflow-hidden rounded-2xl bg-cream shadow-2xl ring-1 ring-teal/10">
                {modes.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      onMode(m.id);
                      setOpen(false);
                    }}
                    className="flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-cream-2"
                  >
                    <span className="mt-0.5 grid h-8 w-8 flex-none place-items-center rounded-lg bg-teal/10 text-teal">
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d={m.icon} stroke="currentColor" strokeWidth="1.6" fill={m.id === 'present' ? 'currentColor' : 'none'} /></svg>
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-teal">{m.label}</span>
                      <span className="block text-[11px] leading-snug text-ink-soft line-clamp-2">{m.hint}</span>
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="hidden overflow-hidden rounded-xl bg-cream/75 shadow-lg ring-1 ring-white/40 backdrop-blur-xl sm:flex">
          <button
            onClick={() => onHeat(false)}
            className={`px-3 py-2.5 text-sm font-medium transition ${!heat ? 'bg-teal text-cream' : 'text-ink-soft hover:bg-cream-2'}`}
          >
            {t('markers')}
          </button>
          <button
            onClick={() => onHeat(true)}
            className={`px-3 py-2.5 text-sm font-medium transition ${heat ? 'bg-teal text-cream' : 'text-ink-soft hover:bg-cream-2'}`}
          >
            {t('heatmap')}
          </button>
        </div>

        <div className="flex overflow-hidden rounded-xl bg-cream/75 shadow-lg ring-1 ring-white/40 backdrop-blur-xl">
          {(['de', 'en'] as Lang[]).map((l) => (
            <button
              key={l}
              onClick={() => onLang(l)}
              className={`px-3 py-2.5 text-sm font-semibold uppercase transition ${lang === l ? 'bg-gold text-teal' : 'text-ink-soft hover:bg-cream-2'}`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
