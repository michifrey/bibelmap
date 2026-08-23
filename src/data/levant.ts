// The bits of geography that decide where the tribal borders run: the coast,
// the two lakes, the Dead Sea and the Jordan between them. The basemap draws
// all of this too, but the allotment is only legible when the water is on top
// of the territories rather than under them — and this way the plate still
// reads when the tiles have not loaded (or are not available offline).
//
// Coordinates are [lat, lon], coarse on purpose: this is a border reference at
// atlas scale, not a coastline survey.

/** Mediterranean shore, north (Tyre) → south (Sinai). */
export const COAST: [number, number][] = [
  [35.55, 35.78],
  [34.9, 35.9],
  [34.44, 35.83],
  [33.9, 35.5],
  [33.6, 35.35],
  [33.45, 35.3],
  [33.28, 35.18],
  [33.09, 35.11],
  [32.92, 35.06],
  [32.82, 34.98],
  [32.69, 34.94],
  [32.5, 34.89],
  [32.33, 34.85],
  [32.24, 34.86],
  [32.05, 34.75],
  [31.9, 34.68],
  [31.74, 34.63],
  [31.66, 34.55],
  [31.52, 34.44],
  [31.28, 34.26],
  [31.13, 33.8],
  [31.16, 32.9],
  [31.26, 32.3],
  [31.45, 31.6],
  [31.2, 29.9],
];

/** The sea itself: the coast, closed off well to the west. */
export const MEDITERRANEAN: [number, number][] = [
  ...COAST,
  [36.5, 29.9],
];

export const SEA_OF_GALILEE: [number, number][] = [
  [32.89, 35.58],
  [32.88, 35.64],
  [32.8, 35.65],
  [32.73, 35.61],
  [32.7, 35.56],
  [32.75, 35.52],
  [32.83, 35.53],
];

export const LAKE_HULEH: [number, number][] = [
  [33.1, 35.59],
  [33.09, 35.64],
  [33.03, 35.64],
  [33.02, 35.59],
];

export const DEAD_SEA: [number, number][] = [
  [31.77, 35.5],
  [31.76, 35.56],
  [31.6, 35.58],
  [31.45, 35.54],
  [31.34, 35.5],
  [31.28, 35.46],
  [31.18, 35.44],
  [31.06, 35.4],
  [31.04, 35.36],
  [31.16, 35.36],
  [31.28, 35.39],
  [31.33, 35.43],
  [31.44, 35.43],
  [31.56, 35.44],
  [31.7, 35.46],
];

/** Jordan: springs at Dan → Huleh → Genezareth → Dead Sea. */
export const JORDAN: [number, number][] = [
  [33.25, 35.62],
  [33.15, 35.61],
  [33.05, 35.61],
  [32.95, 35.6],
  [32.89, 35.58],
  [32.7, 35.56],
  [32.62, 35.57],
  [32.55, 35.56],
  [32.45, 35.53],
  [32.35, 35.55],
  [32.25, 35.54],
  [32.15, 35.56],
  [32.05, 35.54],
  [31.95, 35.55],
  [31.87, 35.53],
  [31.8, 35.51],
  [31.77, 35.5],
];

/** Names the plate needs even though no tribe owns them. */
export const LANDMARKS: { de: string; en: string; lat: number; lon: number }[] = [
  { de: 'Großes Meer', en: 'The Great Sea', lat: 32.4, lon: 34.35 },
  { de: 'See Genezareth', en: 'Sea of Galilee', lat: 32.71, lon: 35.79 },
  { de: 'Totes Meer', en: 'Dead Sea', lat: 30.98, lon: 35.44 },
  { de: 'Jordan', en: 'Jordan', lat: 32.45, lon: 35.62 },
];
