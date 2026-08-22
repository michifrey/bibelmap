import { useEffect, useState } from 'react';
import { useT } from '../i18n';

/**
 * Kopiert die aktuelle Adresse. Der Zustand steht im Hash, der Link führt
 * also dorthin zurück, wo man gerade steht – ein Ort, eine Station, ein
 * Kapitel.
 */
export default function ShareLink({ className = 'bm-btn bm-btn-ghost' }: { className?: string }) {
  const t = useT();
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!done) return;
    const id = window.setTimeout(() => setDone(false), 1800);
    return () => window.clearTimeout(id);
  }, [done]);

  async function copy() {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setDone(true);
    } catch {
      // Ohne Zwischenablage-Recht bleibt der Weg über die Adresszeile.
      window.prompt(t('copyLink'), url);
    }
  }

  return (
    <button onClick={copy} className={className} title={t('copyLink')}>
      {done ? (
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.4">
          <path d="M4 12.5 9 17.5 20 6.5" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" />
        </svg>
      )}
      {done ? t('copied') : t('share')}
    </button>
  );
}
