import type { Lang } from '../i18n';

interface Props {
  lang: Lang;
  onLang: (l: Lang) => void;
  /**
   * "panel" floats over the map and needs its own opaque surface;
   * "inline" sits inside a header that already has one.
   */
  variant?: 'panel' | 'inline';
}

/**
 * The DE/EN switch. It appears on the map, on the start page and on the
 * support page — three places that had grown three slightly different
 * versions, one of which set white on gold (2.2:1, unreadable).
 */
export default function LangToggle({ lang, onLang, variant = 'panel' }: Props) {
  const panel = variant === 'panel';
  return (
    <div
      className={
        panel
          ? 'flex overflow-hidden bg-deepest/95 ring-1 ring-white/10 backdrop-blur-xl'
          : 'flex gap-0.5 bg-white/10 p-0.5'
      }
    >
      {(['de', 'en'] as Lang[]).map((l) => (
        <button
          key={l}
          onClick={() => onLang(l)}
          aria-pressed={lang === l}
          className={`font-bold uppercase transition ${
            panel ? 'px-2.5 py-2 text-xs sm:px-3 sm:py-2.5 sm:text-sm' : 'px-2.5 py-1.5 text-[11px]'
          } ${lang === l ? 'bg-gold text-deep' : 'text-white/60 hover:text-white'}`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
