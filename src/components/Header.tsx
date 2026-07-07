import type { Lang } from '../i18n';
import { useT } from '../i18n';

interface Props {
  lang: Lang;
  onLang: (l: Lang) => void;
  heat: boolean;
  onHeat: (v: boolean) => void;
  onPresent: () => void;
  onGenealogy: () => void;
}

export default function Header({ lang, onLang, heat, onHeat, onPresent, onGenealogy }: Props) {
  const t = useT();
  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-[1100] flex items-start justify-between gap-3 p-3 sm:p-4">
      <div className="pointer-events-auto flex items-center gap-3 rounded-2xl bg-cream/85 px-4 py-2.5 shadow-lg ring-1 ring-teal/10 backdrop-blur">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-teal text-gold">
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
        <button
          onClick={onGenealogy}
          className="hidden items-center gap-1.5 rounded-xl bg-cream/85 px-3.5 py-2.5 text-sm font-medium text-teal shadow-lg ring-1 ring-teal/10 backdrop-blur transition hover:bg-gold/25 sm:flex"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
            <path d="M12 2a2.5 2.5 0 0 0-1 4.8V9H6.5A1.5 1.5 0 0 0 5 10.5V13H3.2A2.5 2.5 0 1 0 5 13h0v-2.5h6.9V13H11a2.5 2.5 0 1 0 2 0v-2.5h6.9V13h0a2.5 2.5 0 1 0 1-2.5H13v-2.2A2.5 2.5 0 0 0 12 2z" />
          </svg>
          {t('genealogy')}
        </button>
        <button
          onClick={onPresent}
          className="hidden items-center gap-1.5 rounded-xl bg-teal px-3.5 py-2.5 text-sm font-medium text-cream shadow-lg ring-1 ring-teal/20 transition hover:bg-teal-2 sm:flex"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
            <path d="M4 5h16v10H4zm0 12h16v2H4zm6-9v6l5-3z" />
          </svg>
          {t('presentation')}
        </button>

        <div className="flex overflow-hidden rounded-xl bg-cream/85 shadow-lg ring-1 ring-teal/10 backdrop-blur">
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

        <div className="flex overflow-hidden rounded-xl bg-cream/85 shadow-lg ring-1 ring-teal/10 backdrop-blur">
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
