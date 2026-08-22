import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Ob das System um weniger Bewegung bittet. Die App fliegt dann nicht über die
 * Karte, sondern setzt den Ausschnitt, und der Reisende springt von Station zu
 * Station statt die Strecke abzugleiten – gezeigt wird dasselbe, nur ruhiger.
 */
export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia?.(QUERY).matches === true;
}

/** Dasselbe als Hook, für Komponenten, die darauf reagieren müssen. */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(prefersReducedMotion);
  useEffect(() => {
    const mq = window.matchMedia?.(QUERY);
    if (!mq) return;
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

/**
 * Leaflet-Optionen für einen Kartenflug. Bei reduzierter Bewegung wird der
 * Ausschnitt ohne Animation gesetzt.
 */
export function flyOptions<T extends Record<string, unknown>>(opts: T): T & { animate?: boolean; duration?: number } {
  if (!prefersReducedMotion()) return opts;
  return { ...opts, animate: false, duration: 0 };
}
