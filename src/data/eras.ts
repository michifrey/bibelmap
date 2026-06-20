// Historical eras of the biblical narrative. Dates are approximate and follow a
// common conservative chronology — they exist to give the timeline shape, not to
// settle scholarly debate.

export interface Era {
  id: string;
  order: number;
  de: string;
  en: string;
  range: string; // human readable date range
  color: string; // marker / accent color
}

export const ERAS: Era[] = [
  { id: 'patriarchs', order: 1, de: 'Erzväter', en: 'Patriarchs', range: '~2000–1500 v. Chr.', color: '#b8742e' },
  { id: 'exodus', order: 2, de: 'Exodus & Wüste', en: 'Exodus & Wilderness', range: '~1446–1406 v. Chr.', color: '#c98a2b' },
  { id: 'conquest', order: 3, de: 'Landnahme & Richter', en: 'Conquest & Judges', range: '~1406–1050 v. Chr.', color: '#a89321' },
  { id: 'united', order: 4, de: 'Vereintes Königreich', en: 'United Kingdom', range: '~1050–930 v. Chr.', color: '#5c8a3a' },
  { id: 'divided', order: 5, de: 'Geteiltes Königreich', en: 'Divided Kingdom', range: '~930–586 v. Chr.', color: '#2f8f7f' },
  { id: 'exile', order: 6, de: 'Exil', en: 'Exile', range: '~586–538 v. Chr.', color: '#3a6ea8' },
  { id: 'return', order: 7, de: 'Rückkehr & Wiederaufbau', en: 'Return & Restoration', range: '~538–400 v. Chr.', color: '#5a5ca8' },
  { id: 'gospels', order: 8, de: 'Jesus & Evangelien', en: 'Jesus & the Gospels', range: '~6 v.–33 n. Chr.', color: '#9a4ba0' },
  { id: 'church', order: 9, de: 'Frühe Kirche', en: 'Early Church', range: '~33–100 n. Chr.', color: '#b0436b' },
];

export const ERA_BY_ID: Record<string, Era> = Object.fromEntries(ERAS.map((e) => [e.id, e]));
