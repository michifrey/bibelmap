import type { Mode, View } from '../components/Header';

/**
 * Zustand, den eine Adresse festhalten kann. Jede Ansicht bekommt einen
 * sprechenden Schlüssel im Hash – `#reise=exodus,5` ist auch dann noch
 * lesbar, wenn jemand den Link in einer Nachricht sieht.
 */
export interface Route {
  view: View;
  mode: Mode | null;
  /** Ort auf der Hauptkarte. */
  placeId?: string;
  /** Reise + Station (Reisen & Geschichten). */
  journey?: { id: string; stop: number };
  /** Phase + optional Reise (Mission & Ausbreitung). */
  mission?: { phase: string; journey?: string };
  /** Buch + Kapitel (Präsentationsmodus). */
  reading?: { osis: string; chapter: number };
}

/** Schlüssel im Hash → Modus ohne weitere Angaben. */
const MODE_KEYS: Record<string, Mode> = {
  unterstuetzen: 'support',
  heilsgeschichte: 'history',
  kirche: 'church',
  vergleich: 'compare',
};

const KEY_BY_MODE: Record<string, string> = Object.fromEntries(
  Object.entries(MODE_KEYS).map(([k, m]) => [m, k]),
);

function num(value: string | undefined, fallback: number): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

/**
 * Adresse lesen. `null` heißt: kein Ziel im Hash – die Startseite bleibt
 * stehen. Unbekannte Schlüssel werden ignoriert statt zu raten.
 */
export function parseHash(hash: string): Route | null {
  const raw = hash.replace(/^#/, '').trim();
  if (!raw) return null;
  const [key, value = ''] = raw.split('=');
  const args = value ? value.split(',') : [];

  if (MODE_KEYS[key]) return { view: 'map', mode: MODE_KEYS[key] };

  switch (key) {
    case 'karte':
      return { view: 'map', mode: null };
    case 'ort':
      return args[0] ? { view: 'map', mode: null, placeId: args[0] } : { view: 'map', mode: null };
    case 'stammbaum':
      return { view: 'tree', mode: null };
    case 'graph':
      return { view: 'graph', mode: null };
    case 'reise':
      return {
        view: 'map',
        mode: 'journeys',
        journey: args[0] ? { id: args[0], stop: Math.max(0, num(args[1], 0)) } : undefined,
      };
    case 'mission':
      return {
        view: 'map',
        mode: 'mission',
        mission: args[0] ? { phase: args[0], journey: args[1] } : undefined,
      };
    case 'lesen':
      return {
        view: 'map',
        mode: 'present',
        reading: args[0] ? { osis: args[0], chapter: Math.max(1, num(args[1], 1)) } : undefined,
      };
    default:
      return null;
  }
}

/** Adresse schreiben – die Umkehrung von `parseHash`. */
export function formatRoute(route: Route): string {
  const { view, mode } = route;
  if (mode && KEY_BY_MODE[mode]) return `#${KEY_BY_MODE[mode]}`;
  if (mode === 'journeys') {
    return route.journey ? `#reise=${route.journey.id},${route.journey.stop}` : '#reise';
  }
  if (mode === 'mission') {
    if (!route.mission) return '#mission';
    const { phase, journey } = route.mission;
    // Die Reise gehört nur in die Adresse, wenn sie auch gezeigt wird.
    return phase === 'journeys' && journey ? `#mission=${phase},${journey}` : `#mission=${phase}`;
  }
  if (mode === 'present') {
    return route.reading ? `#lesen=${route.reading.osis},${route.reading.chapter}` : '#lesen';
  }
  if (view === 'tree') return '#stammbaum';
  if (view === 'graph') return '#graph';
  return route.placeId ? `#ort=${route.placeId}` : '#karte';
}
