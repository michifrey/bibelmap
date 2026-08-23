// Historical eras of the biblical narrative. Dates are approximate and follow a
// common conservative chronology — they exist to give the timeline shape, not to
// settle scholarly debate.

export interface Era {
  id: string;
  order: number;
  de: string;
  en: string;
  range: string; // human readable date range
  /** Numeric span, negative = BC. The `range` string above, machine-readable. */
  from: number;
  to: number;
  color: string; // marker / accent color
}

export const ERAS: Era[] = [
  { id: 'patriarchs', order: 1, de: 'Erzväter', en: 'Patriarchs', range: '~2000–1500 v. Chr.', from: -2000, to: -1500, color: '#b8742e' },
  { id: 'exodus', order: 2, de: 'Exodus & Wüste', en: 'Exodus & Wilderness', range: '~1446–1406 v. Chr.', from: -1446, to: -1406, color: '#c98a2b' },
  { id: 'conquest', order: 3, de: 'Landnahme & Richter', en: 'Conquest & Judges', range: '~1406–1050 v. Chr.', from: -1406, to: -1050, color: '#a89321' },
  { id: 'united', order: 4, de: 'Vereintes Königreich', en: 'United Kingdom', range: '~1050–930 v. Chr.', from: -1050, to: -930, color: '#5c8a3a' },
  { id: 'divided', order: 5, de: 'Geteiltes Königreich', en: 'Divided Kingdom', range: '~930–586 v. Chr.', from: -930, to: -586, color: '#2f8f7f' },
  { id: 'exile', order: 6, de: 'Exil', en: 'Exile', range: '~586–538 v. Chr.', from: -586, to: -538, color: '#3a6ea8' },
  { id: 'return', order: 7, de: 'Rückkehr & Wiederaufbau', en: 'Return & Restoration', range: '~538–400 v. Chr.', from: -538, to: -400, color: '#5a5ca8' },
  { id: 'gospels', order: 8, de: 'Jesus & Evangelien', en: 'Jesus & the Gospels', range: '~6 v.–33 n. Chr.', from: -6, to: 33, color: '#9a4ba0' },
  { id: 'church', order: 9, de: 'Frühe Kirche', en: 'Early Church', range: '~33–100 n. Chr.', from: 33, to: 100, color: '#b0436b' },
];

export const ERA_BY_ID: Record<string, Era> = Object.fromEntries(ERAS.map((e) => [e.id, e]));

/**
 * Relative width of an era on a duration-scaled band. Square-rooted so the short
 * eras stay legible: on a true linear scale "Exodus" would be four pixels wide.
 * Shared by the in-app timeline and the one on the start page, so the two bands
 * cannot drift apart.
 */
export function eraWeight(id: string): number {
  const e = ERA_BY_ID[id];
  return Math.sqrt(e ? e.to - e.from : 100);
}

/**
 * The era a given year falls in, or null. The four centuries between Malachi and
 * the gospels belong to no era here, and saying so is more honest than snapping
 * the year to the nearest one.
 */
export function eraForYear(year: number): Era | null {
  return ERAS.find((e) => year >= e.from && year <= e.to) ?? null;
}
