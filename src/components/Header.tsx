import { useState } from 'react';
import type { Lang } from '../i18n';
import { useT } from '../i18n';
import LangToggle from './LangToggle';
import ModePalette from './ModePalette';

export type Mode = 'present' | 'history' | 'journeys' | 'gospel' | 'mission' | 'compare' | 'church' | 'quiz' | 'nations' | 'media' | 'route' | 'index' | 'support' | 'credits';
export type View = 'map' | 'terrain' | 'tree' | 'graph';

interface Props {
  lang: Lang;
  onLang: (l: Lang) => void;
  heat: boolean;
  onHeat: (v: boolean) => void;
  onMode: (m: Mode) => void;
  view: View;
  onView: (v: View) => void;
  /** Back to the start page — the wordmark is the way home. */
  onHome: () => void;
}

export default function Header({ lang, onLang, heat, onHeat, onMode, view, onView, onHome }: Props) {
  const t = useT();
  const [open, setOpen] = useState(false);


  // Mobile: two rows (logo + language on top, view switch + modi below).
  // Desktop (sm+): a single row, logo left / all controls right.
  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-[1100] flex flex-col gap-2 p-2 sm:flex-row sm:items-start sm:justify-between sm:p-4">
      {/* top row on mobile: brand + language */}
      <div className="flex items-center justify-between gap-2 sm:justify-start">
        <button
          onClick={onHome}
          title={t('lStart')}
          className="pointer-events-auto flex items-center gap-2 bg-deepest/95 px-3 py-2 text-left ring-1 ring-white/10 backdrop-blur-xl transition hover:bg-deepest sm:gap-3 sm:px-4 sm:py-2.5"
        >
          <div className="grid h-8 w-8 place-items-center bg-gradient-to-br from-signal to-deepest text-gold shadow-inner sm:h-9 sm:w-9">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
              <path d="M12 2C8.7 2 6 4.7 6 8c0 4.4 6 12 6 12s6-7.6 6-12c0-3.3-2.7-6-6-6zm0 8.2A2.2 2.2 0 1 1 12 5.8a2.2 2.2 0 0 1 0 4.4z" />
            </svg>
          </div>
          <div className="leading-tight">
            <div className="font-display text-base font-semibold text-white sm:text-xl">{t('appTitle')}</div>
            <div className="hidden text-[11px] text-white/60 sm:block">{t('tagline')}</div>
          </div>
        </button>
        {/* language: top-right on mobile only */}
        <div className="pointer-events-auto sm:hidden"><LangToggle lang={lang} onLang={onLang} /></div>
      </div>

      {/* controls: own row on mobile, right side on desktop */}
      <div className="pointer-events-auto flex items-center justify-end gap-1.5 sm:gap-2">
        {/* view switch: map · tree · graph */}
        <div className="flex overflow-hidden bg-deepest/95 ring-1 ring-white/10 backdrop-blur-xl">
          <button
            onClick={() => onView('map')}
            className={`px-2.5 py-2 text-xs font-medium transition sm:px-3 sm:py-2.5 sm:text-sm ${view === 'map' ? 'bg-signal text-white' : 'text-white/60 hover:bg-surface'}`}
          >
            {t('map')}
          </button>
          <button
            onClick={() => onView('terrain')}
            title={t('terrainView')}
            className={`px-2.5 py-2 text-xs font-medium transition sm:px-3 sm:py-2.5 sm:text-sm ${view === 'terrain' ? 'bg-signal text-white' : 'text-white/60 hover:bg-surface'}`}
          >
            {t('terrain')}
          </button>
          <button
            onClick={() => onView('tree')}
            className={`px-2.5 py-2 text-xs font-medium transition sm:px-3 sm:py-2.5 sm:text-sm ${view === 'tree' ? 'bg-signal text-white' : 'text-white/60 hover:bg-surface'}`}
          >
            {t('tree')}
          </button>
          <button
            onClick={() => onView('graph')}
            className={`px-2.5 py-2 text-xs font-medium transition sm:px-3 sm:py-2.5 sm:text-sm ${view === 'graph' ? 'bg-signal text-white' : 'text-white/60 hover:bg-surface'}`}
          >
            {t('graph')}
          </button>
        </div>

        {/* modes dropdown — only on the map */}
        {(view === 'map' || view === 'terrain') && (
          <div className="relative">
            <button
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-haspopup="dialog"
              // Auf dem Telefon steht der Text nicht da – ohne Namen wäre der
              // Knopf für eine Vorlesehilfe stumm.
              aria-label={t('modes')}
              title={t('modes')}
              className="flex items-center gap-1.5 bg-signal px-2.5 py-2 text-xs font-medium text-white ring-1 ring-white/10 transition hover:bg-signal sm:px-3.5 sm:py-2.5 sm:text-sm"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2"/></svg>
              <span className="hidden sm:inline">{t('modes')}</span>
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor"><path d="M7 10l5 5 5-5z" /></svg>
            </button>
          </div>
        )}

        {/* heatmap toggle — desktop only */}
        {view === 'map' && (
          <div className="hidden overflow-hidden bg-deepest/95 ring-1 ring-white/10 backdrop-blur-xl sm:flex">
            <button
              onClick={() => onHeat(false)}
              className={`px-2.5 py-2 text-xs font-medium transition sm:px-3 sm:py-2.5 sm:text-sm ${!heat ? 'bg-signal text-white' : 'text-white/60 hover:bg-surface'}`}
            >
              {t('markers')}
            </button>
            <button
              onClick={() => onHeat(true)}
              className={`px-2.5 py-2 text-xs font-medium transition sm:px-3 sm:py-2.5 sm:text-sm ${heat ? 'bg-signal text-white' : 'text-white/60 hover:bg-surface'}`}
            >
              {t('heatmap')}
            </button>
          </div>
        )}

        {/* language: inline on desktop (mobile shows it in the top row) */}
        <div className="hidden sm:block"><LangToggle lang={lang} onLang={onLang} /></div>
      </div>

      {open && (
        <ModePalette
          onClose={() => setOpen(false)}
          onPick={(m) => {
            onMode(m);
            setOpen(false);
          }}
        />
      )}
    </header>
  );
}
