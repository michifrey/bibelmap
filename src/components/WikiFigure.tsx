import { useEffect, useState } from 'react';
import type { Lang } from '../i18n';
import { fetchArticle, type WikiArticle } from '../lib/wikipediaArticle';
import { licenseInfo } from '../lib/imageCredit';

/*
 * Bild und Nachweis von Wikipedia – für jede Ansicht, die nur einen Suchbegriff
 * mitbringt.
 *
 * Die drei Stücke standen zuerst in `PersonSources.tsx` und wurden dort für die
 * Personen des Zeitbaums gebraucht. Das Bücherregal braucht dasselbe für seine
 * Handschriften: derselbe Abruf, derselbe Nachweis, dieselben Fallstricke. Ein
 * zweites Mal geschrieben hieße, dass die nächste Korrektur am Lizenzhinweis
 * nur eine von beiden Stellen erreicht.
 */

/** Einen Wikipedia-Artikel je Begriff und Sprache auflösen – Bild und Einleitung. */
export function useArticle(term: string | undefined, lang: Lang): WikiArticle | null {
  const [art, setArt] = useState<WikiArticle | null>(null);
  useEffect(() => {
    let alive = true;
    setArt(null);
    if (!term) return;
    void fetchArticle(term, lang).then((a) => {
      if (alive) setArt(a);
    });
    return () => {
      alive = false;
    };
  }, [term, lang]);
  return art;
}

/**
 * Bildnachweis: Urheber und Lizenz, beide verlinkt. Fast jedes Bild von
 * Wikimedia Commons verlangt die Nennung von beidem – ein „© Name" allein
 * genügt nicht (siehe `lib/imageCredit.ts`).
 */
export function ImageCredit({ art, lang, className = '' }: { art: WikiArticle; lang: Lang; className?: string }) {
  const license = licenseInfo(art.license, lang);
  if (!art.credit) return null;
  return (
    <span className={`flex min-w-0 items-center gap-1 ${className}`}>
      <a
        href={art.fileUrl ?? art.url}
        target="_blank"
        rel="noreferrer"
        className="truncate hover:text-gold"
        title={art.credit}
      >
        © {art.credit}
      </a>
      {license &&
        (license.url ? (
          <a
            href={license.url}
            target="_blank"
            rel="noreferrer"
            className="flex-none border-l border-white/25 pl-1 hover:text-gold"
            title={license.hint}
          >
            {license.label}
          </a>
        ) : (
          <span className="flex-none border-l border-white/25 pl-1" title={license.hint}>
            {license.label}
          </span>
        ))}
    </span>
  );
}

/** Der Pfeil, der sagt: Dieser Link führt aus der App hinaus. */
export function ExternalIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3 w-3 shrink-0 opacity-60" fill="currentColor">
      <path d="M14 3h7v7h-2V6.4l-9.3 9.3-1.4-1.4L17.6 5H14zM5 5h5v2H7v10h10v-3h2v5H5z" />
    </svg>
  );
}
