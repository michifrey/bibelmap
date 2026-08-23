import { useCallback, useEffect, useRef, useState } from 'react';
import { useT } from '../i18n';

/**
 * Die ersten Ziele für die Tabulatortaste.
 *
 * Auf der Karte liegt die Kopfzeile im Quelltext hinter Zeitleiste, Markern
 * und der Ortsliste: gemessen das 205. von 208 ansteuerbaren Elementen, 208
 * Tabulatorschritte, bis sie den Fokus hat – in „Hören & Sehen" das 303. Wer
 * ohne Maus arbeitet, kommt so nicht zur Navigation, sondern nur durch sie
 * hindurch. Mit den Marken sind es zwei Tastendrücke.
 *
 * Bewusst Knöpfe, keine Sprungmarken: die Adresse trägt bei dieser App den
 * Zustand (`#ort=…`, `#gelaende=reise,…`). Ein `<a href="#inhalt">` würde die
 * Ansicht wechseln, statt den Fokus zu setzen – die übliche Lösung wäre hier
 * die falsche.
 *
 * Sichtbar werden sie erst, wenn sie den Fokus haben. Wer die Maus benutzt,
 * sieht sie nie; wer die Tastatur benutzt, findet sie sofort.
 */

const ZIELE = [
  { schluessel: 'skipToNav', auswahl: 'header' },
  { schluessel: 'skipToSearch', auswahl: 'input[placeholder]' },
  { schluessel: 'skipToMap', auswahl: '.leaflet-container, .maplibregl-map' },
] as const;

export default function SkipLinks({ stand }: { stand: string }) {
  const t = useT();
  const navRef = useRef<HTMLElement>(null);
  // Nicht jede Ansicht hat eine Karte oder ein Suchfeld. Eine Marke, die ins
  // Leere führt, ist schlimmer als keine.
  const [da, setDa] = useState<string[]>([ZIELE[0].auswahl]);

  const pruefen = useCallback(() => {
    setDa(ZIELE.filter((z) => document.querySelector(z.auswahl)).map((z) => z.auswahl));
  }, []);

  // Der Tabulator setzt nicht immer oben an: die Reiseansicht rollt beim
  // Öffnen zur laufenden Station, und Chrome merkt sich diese Stelle als
  // Startpunkt. Gemessen landete der erste Tabulatorschlag auf `#reise=…`
  // mitten in der Stationsliste – an den Marken vorbei. Hat niemand den Fokus,
  // holen wir den Startpunkt zurück an den Anfang; wer schon irgendwo steht,
  // dem nehmen wir ihn nicht weg.
  const anfangZurueck = useCallback(() => {
    if (document.activeElement === document.body || !document.activeElement) {
      navRef.current?.focus({ preventScroll: true });
    }
  }, []);

  // Nach dem Moduswechsel kommen nachgeladene Ansichten erst verzögert an.
  useEffect(() => {
    pruefen();
    anfangZurueck();
    const id = window.setTimeout(() => {
      pruefen();
      anfangZurueck();
    }, 800);
    return () => window.clearTimeout(id);
  }, [stand, pruefen, anfangZurueck]);

  /** Erstes ansteuerbares Element im Ziel – oder das Ziel selbst. */
  function springe(auswahl: string) {
    const ziel = document.querySelector<HTMLElement>(auswahl);
    if (!ziel) return;
    const erstes = ziel.matches('input, button, a[href]')
      ? ziel
      : ziel.querySelector<HTMLElement>('input, button, a[href], [tabindex]:not([tabindex="-1"])');
    const el = erstes ?? ziel;
    if (!erstes) el.tabIndex = -1; // sonst nimmt ein einfacher Kasten den Fokus nicht an
    el.focus();
    el.scrollIntoView({ block: 'nearest' });
  }

  return (
    <nav
      ref={navRef}
      id="sprungmarken"
      tabIndex={-1}
      aria-label={t('skipLinks')}
      onFocusCapture={pruefen}
      className="pointer-events-none absolute inset-x-0 top-0 z-[3000]"
    >
      {ZIELE.filter((z) => da.includes(z.auswahl)).map((z) => (
        <button
          key={z.auswahl}
          onClick={() => springe(z.auswahl)}
          className="pointer-events-auto sr-only whitespace-nowrap rounded-md bg-gold px-4 py-2 text-sm font-bold text-deep shadow-lg focus:not-sr-only focus:absolute focus:left-2 focus:top-2"
        >
          {t(z.schluessel)}
        </button>
      ))}
    </nav>
  );
}
