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
  /**
   * Phase + Detail (Mission & Ausbreitung). In der Reisephase ist das zweite
   * Glied eine Reise, sonst ein Ereignis – beides steht als `#mission=phase,x`
   * in der Adresse.
   */
  mission?: { phase: string; journey?: string; event?: string };
  /** Buch + Kapitel (Präsentationsmodus). */
  reading?: { osis: string; chapter: number };
  /**
   * Quelle, Ort oder Stelle (Hören & Sehen). `#hoeren=ort,a15257a` zeigt die
   * Folgen zu einem Ort, `#hoeren=stelle,Acts,13` die zu einem Kapitel,
   * `#hoeren=keller` die einer Quelle.
   */
  media?: { source?: string; place?: string; ref?: { osis: string; chapter: number } };
  /**
   * Reiter + Auswahl (Kirchengeschichte). `#kirche=zeit,thesen`,
   * `#kirche=vater,augustinus` und `#kirche=konzil,nicaea1`; ohne Angabe steht
   * der Modus auf seinem Anfang.
   */
  church?: { tab: 'timeline' | 'fathers' | 'councils'; id?: string };
  /**
   * Akt und Station der Jesus-Sektion: `#jesus=passion,golgotha`. Ein Mensch
   * statt eines Akts steht als `#jesus=mensch,petrus` – die Akte heißen nie
   * so, deshalb bleibt das eindeutig.
   */
  gospel?: { act: string; station?: string; person?: string };
  /** Station der Heilsgeschichte: `#heilsgeschichte=exodus`. */
  history?: string;
  /** Ereignis der Israel-Karte: `#israel=okt2023`. */
  israel?: string;
  /** Gestalt (Religionen im Vergleich): `#vergleich=abraham`. */
  compare?: string;
  /**
   * Der selbst zusammengestellte Weg: `#weg=a15257a,a13122`. Die Adresse
   * trägt ihn mit, damit ein Weg weitergegeben werden kann – gespeichert wird
   * er sonst nirgends als im Browser dessen, der ihn gebaut hat.
   */
  own?: string[];
  /**
   * Reiter und Stand der Stammbaum-Ansicht. `#stammbaum=gebiete,juda,722`
   * zeigt Juda auf der Stammeskarte im Jahr des Falls von Samaria. Stamm und
   * Jahr stehen in beliebiger Reihenfolge – eine reine Zahl ist das Jahr,
   * alles andere ein Name –, damit keine leeren Kommastellen nötig sind.
   */
  tree?: { tab: 'timeline' | 'tree' | 'map'; id?: string; year?: number };
}

/** Schlüssel im Hash → Modus ohne weitere Angaben. */
const MODE_KEYS: Record<string, Mode> = {
  register: 'index',
  unterstuetzen: 'support',
  nachweise: 'credits',
  quiz: 'quiz',
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
    case 'stammbaum': {
      if (!args[0]) return { view: 'tree', mode: null };
      const tab = args[0] === 'gebiete' ? 'map' : args[0] === 'baum' ? 'tree' : 'timeline';
      const rest = args.slice(1).filter(Boolean);
      const year = rest.find((a) => /^\d+$/.test(a));
      return {
        view: 'tree',
        mode: null,
        tree: {
          tab,
          id: rest.find((a) => !/^\d+$/.test(a)),
          year: year ? Number(year) : undefined,
        },
      };
    }
    case 'graph':
      return { view: 'graph', mode: null };
    case 'gelaende':
      // `#gelaende=reise,exodus` zeigt eine Route über dem Gelände, ein
      // einzelnes Kürzel bleibt der Ort.
      if (args[0] === 'reise') {
        return args[1]
          ? { view: 'terrain', mode: null, journey: { id: args[1], stop: 0 } }
          : { view: 'terrain', mode: null };
      }
      if (args[0] === 'mission') {
        return args[1]
          ? { view: 'terrain', mode: null, mission: { phase: 'journeys', journey: args[1] } }
          : { view: 'terrain', mode: null };
      }
      return args[0]
        ? { view: 'terrain', mode: null, placeId: args[0] }
        : { view: 'terrain', mode: null };
    case 'reise':
      return {
        view: 'map',
        mode: 'journeys',
        journey: args[0] ? { id: args[0], stop: Math.max(0, num(args[1], 0)) } : undefined,
      };
    case 'mission':
      if (!args[0]) return { view: 'map', mode: 'mission' };
      return {
        view: 'map',
        mode: 'mission',
        mission:
          args[0] === 'journeys'
            ? { phase: args[0], journey: args[1] }
            : { phase: args[0], event: args[1] },
      };
    case 'jesus': {
      if (!args[0]) return { view: 'map', mode: 'gospel' };
      if (args[0] === 'mensch') {
        return args[1]
          ? { view: 'map', mode: 'gospel', gospel: { act: 'promise', person: args[1] } }
          : { view: 'map', mode: 'gospel' };
      }
      return { view: 'map', mode: 'gospel', gospel: { act: args[0], station: args[1] } };
    }
    case 'heilsgeschichte':
      return args[0]
        ? { view: 'map', mode: 'history', history: args[0] }
        : { view: 'map', mode: 'history' };
    case 'weg':
      return args.length
        ? { view: 'map', mode: 'route', own: args.filter(Boolean) }
        : { view: 'map', mode: 'route' };
    case 'israel':
      return args[0]
        ? { view: 'map', mode: 'israel', israel: args[0] }
        : { view: 'map', mode: 'israel' };
    case 'vergleich':
      return args[0]
        ? { view: 'map', mode: 'compare', compare: args[0] }
        : { view: 'map', mode: 'compare' };
    case 'kirche': {
      if (!args[0]) return { view: 'map', mode: 'church' };
      // „zeit" ist der Zeitstrahl, der Anfang dieses Modus. „vater" bleibt die
      // Vorgabe für alles Unbekannte – alte Adressen ohne Reiter zeigten auf
      // die Väterliste und sollen das weiter tun.
      const tab =
        args[0] === 'konzil' ? ('councils' as const)
        : args[0] === 'zeit' ? ('timeline' as const)
        : ('fathers' as const);
      return { view: 'map', mode: 'church', church: { tab, id: args[1] } };
    }
    case 'hoeren': {
      if (!args[0]) return { view: 'map', mode: 'media' };
      if (args[0] === 'ort') return { view: 'map', mode: 'media', media: { place: args[1] } };
      if (args[0] === 'stelle') {
        return args[1]
          ? {
              view: 'map',
              mode: 'media',
              media: { ref: { osis: args[1], chapter: Math.max(1, num(args[2], 1)) } },
            }
          : { view: 'map', mode: 'media' };
      }
      return { view: 'map', mode: 'media', media: { source: args[0] } };
    }
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
    const { phase, journey, event } = route.mission;
    // In der Reisephase steht die Reise in der Adresse, sonst das Ereignis.
    const detail = phase === 'journeys' ? journey : event;
    return detail ? `#mission=${phase},${detail}` : `#mission=${phase}`;
  }
  if (mode === 'gospel') {
    if (!route.gospel) return '#jesus';
    const { act, station, person } = route.gospel;
    if (person) return `#jesus=mensch,${person}`;
    return station ? `#jesus=${act},${station}` : `#jesus=${act}`;
  }
  if (mode === 'israel') {
    return route.israel ? `#israel=${route.israel}` : '#israel';
  }
  if (mode === 'compare') {
    return route.compare ? `#vergleich=${route.compare}` : '#vergleich';
  }
  if (mode === 'history') {
    return route.history ? `#heilsgeschichte=${route.history}` : '#heilsgeschichte';
  }
  if (mode === 'route') {
    return route.own?.length ? `#weg=${route.own.join(',')}` : '#weg';
  }
  if (mode === 'church') {
    const c = route.church;
    if (!c) return '#kirche';
    const key = c.tab === 'councils' ? 'konzil' : c.tab === 'timeline' ? 'zeit' : 'vater';
    return c.id ? `#kirche=${key},${c.id}` : '#kirche';
  }
  if (mode === 'media') {
    const m = route.media;
    if (m?.place) return `#hoeren=ort,${m.place}`;
    if (m?.ref) return `#hoeren=stelle,${m.ref.osis},${m.ref.chapter}`;
    return m?.source ? `#hoeren=${m.source}` : '#hoeren';
  }
  if (mode === 'present') {
    return route.reading ? `#lesen=${route.reading.osis},${route.reading.chapter}` : '#lesen';
  }
  if (view === 'terrain') {
    if (route.mission?.journey) return `#gelaende=mission,${route.mission.journey}`;
    if (route.journey) return `#gelaende=reise,${route.journey.id}`;
    return route.placeId ? `#gelaende=${route.placeId}` : '#gelaende';
  }
  if (view === 'tree') {
    const tr = route.tree;
    if (!tr) return '#stammbaum';
    const parts = [tr.tab === 'map' ? 'gebiete' : tr.tab === 'tree' ? 'baum' : 'zeit'];
    if (tr.id) parts.push(tr.id);
    if (tr.year) parts.push(String(tr.year));
    return `#stammbaum=${parts.join(',')}`;
  }
  if (view === 'graph') return '#graph';
  return route.placeId ? `#ort=${route.placeId}` : '#karte';
}
