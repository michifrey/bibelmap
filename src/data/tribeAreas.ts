// Approximate territories of the twelve tribes of Israel (Josua 13–19), as rough
// polygons so the map can show AREAS instead of points. The boundaries are a
// deliberate simplification — they convey roughly where each tribe settled and
// how the land was divided, not a surveyed border. [lat, lon] pairs.
// Keyed by the node id used in `nationsTribes.ts`; each carries a distinct colour
// so the neighbouring territories are easy to tell apart.

export interface TribeArea {
  color: string;
  polygon: [number, number][];
}

export const TRIBE_AREAS: Record<string, TribeArea> = {
  // ---- West of the Jordan (north → south) ----------------------------------
  asher: {
    color: '#2f8f9f',
    polygon: [
      [33.28, 35.15],
      [33.08, 35.36],
      [32.84, 35.26],
      [32.8, 35.02],
      [33.06, 34.95],
    ],
  },
  naphtali: {
    color: '#a85a7a',
    polygon: [
      [33.3, 35.37],
      [33.24, 35.63],
      [32.88, 35.66],
      [32.8, 35.46],
      [32.98, 35.36],
    ],
  },
  zebulun: {
    color: '#3a6ea8',
    polygon: [
      [32.9, 35.2],
      [32.88, 35.46],
      [32.66, 35.43],
      [32.64, 35.18],
    ],
  },
  issachar: {
    color: '#2f8f7f',
    polygon: [
      [32.74, 35.3],
      [32.72, 35.62],
      [32.44, 35.56],
      [32.46, 35.31],
    ],
  },
  manasseh: {
    color: '#9a4ba0',
    polygon: [
      [32.5, 35.02],
      [32.5, 35.52],
      [32.14, 35.5],
      [32.14, 35.02],
    ],
  },
  ephraim: {
    color: '#7a5aa8',
    polygon: [
      [32.14, 35.03],
      [32.14, 35.46],
      [31.94, 35.42],
      [31.94, 35.03],
    ],
  },
  dan: {
    color: '#5a5ca8',
    polygon: [
      [32.1, 34.83],
      [32.05, 35.06],
      [31.8, 35.02],
      [31.78, 34.8],
    ],
  },
  benjamin: {
    color: '#b0436b',
    polygon: [
      [31.95, 35.08],
      [31.93, 35.46],
      [31.75, 35.42],
      [31.77, 35.07],
    ],
  },
  judah: {
    color: '#5c8a3a',
    polygon: [
      [31.78, 34.98],
      [31.78, 35.52],
      [31.35, 35.47],
      [31.2, 35.1],
      [31.36, 34.88],
    ],
  },
  simeon: {
    color: '#c98a2b',
    polygon: [
      [31.36, 34.68],
      [31.34, 35.02],
      [31.04, 34.92],
      [31.0, 34.62],
    ],
  },

  // ---- East of the Jordan (south → north) ----------------------------------
  reuben: {
    color: '#b8742e',
    polygon: [
      [31.9, 35.66],
      [31.88, 36.12],
      [31.34, 36.0],
      [31.3, 35.72],
    ],
  },
  gad: {
    color: '#a0552e',
    polygon: [
      [32.5, 35.66],
      [32.48, 36.12],
      [31.92, 36.06],
      [31.9, 35.66],
    ],
  },
  // eastern half-tribe of Manasseh (Bashan / Gilead)
  'm-east': {
    color: '#8a4b90',
    polygon: [
      [33.0, 35.74],
      [32.98, 36.22],
      [32.52, 36.16],
      [32.5, 35.72],
    ],
  },
};
