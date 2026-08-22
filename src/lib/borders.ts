import type { Lang } from '../i18n';

export interface Polity {
  name: string;
  nameDe: string;
  /** Named overlord where the polity was a vassal. */
  subjectTo?: string;
  /** Area of the largest piece in square degrees — drives label size. */
  area: number;
  /** Label anchor: [lon, lat] of the largest piece's centroid. */
  at?: [number, number];
  geometry: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: number[][][] | number[][][][];
  };
}

export interface BorderData {
  /** Snapshot years, ascending. Negative = BC. */
  years: number[];
  byYear: Record<string, Polity[]>;
}

let cache: Promise<BorderData> | null = null;

/** ~160 KB — only fetched once the user actually turns the overlay on. */
export function loadBorders(): Promise<BorderData> {
  if (!cache) {
    cache = fetch(`${import.meta.env.BASE_URL}data/borders.json`).then((r) => {
      if (!r.ok) throw new Error(`borders.json: ${r.status}`);
      return r.json() as Promise<BorderData>;
    });
  }
  return cache;
}

/** Full span the slider covers. */
export const YEAR_MIN = -2000;
export const YEAR_MAX = 100;

/**
 * The snapshot in force in a given year — the latest one at or before it.
 * Borders did not change on the years the dataset happens to have maps for, so
 * a year between two snapshots shows the older one, the way a printed atlas
 * plate stays valid until the next plate.
 */
export function snapshotFor(data: BorderData, year: number): number {
  let found = data.years[0];
  for (const y of data.years) {
    if (y <= year) found = y;
    else break;
  }
  return found;
}

export function politiesAt(data: BorderData, year: number): Polity[] {
  return data.byYear[String(snapshotFor(data, year))] ?? [];
}

export function polityName(p: Polity, lang: Lang): string {
  return lang === 'de' ? p.nameDe : p.name;
}

/**
 * Colours for the empire overlay. Picked by name hash rather than by index, so
 * Egypt keeps its colour while you drag the slider through two thousand years
 * and only the polities that actually change do.
 */
const POLITY_COLORS = [
  '#e0a449', '#7fe3d5', '#b0436b', '#6fa8dc', '#c2812a', '#8fbf6a',
  '#d98cb3', '#4fb3a5', '#e07a5f', '#9b8ec4', '#d4b483', '#5f9ea0',
];

export function polityColor(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return POLITY_COLORS[h % POLITY_COLORS.length];
}

/** "1000 v. Chr." / "1000 BC" — year 0 does not exist, and the data skips it. */
export function formatYear(year: number, lang: Lang): string {
  const abs = Math.abs(year);
  if (year < 0) return lang === 'de' ? `${abs} v. Chr.` : `${abs} BC`;
  return lang === 'de' ? `${abs} n. Chr.` : `AD ${abs}`;
}
