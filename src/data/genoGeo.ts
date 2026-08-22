// Approximate geography for the genealogy map layer: where the tribes settled,
// where the Table-of-Nations peoples lived, and where key persons belong.
// Coordinates are DELIBERATELY APPROXIMATE (territory / region centres) and only
// exist to place a label on the map — not a survey. Keyed by the node id used in
// `nationsTribes.ts`.

export type GeoKind = 'tribe' | 'people' | 'person';

export interface GeoPoint {
  lat: number;
  lon: number;
  kind: GeoKind;
}

export const GENO_GEO: Record<string, GeoPoint> = {
  // ---- The twelve tribes of Israel — approximate allotments (Josua 13–19) ---
  reuben: { lat: 31.55, lon: 35.72, kind: 'tribe' },
  gad: { lat: 32.1, lon: 35.75, kind: 'tribe' },
  judah: { lat: 31.5, lon: 35.1, kind: 'tribe' },
  simeon: { lat: 31.2, lon: 34.8, kind: 'tribe' },
  benjamin: { lat: 31.83, lon: 35.22, kind: 'tribe' },
  dan: { lat: 31.95, lon: 34.9, kind: 'tribe' },
  ephraim: { lat: 32.1, lon: 35.22, kind: 'tribe' },
  manasseh: { lat: 32.42, lon: 35.25, kind: 'tribe' },
  issachar: { lat: 32.58, lon: 35.42, kind: 'tribe' },
  zebulun: { lat: 32.78, lon: 35.3, kind: 'tribe' },
  asher: { lat: 32.95, lon: 35.15, kind: 'tribe' },
  naphtali: { lat: 33.05, lon: 35.5, kind: 'tribe' },
  levi: { lat: 31.78, lon: 35.22, kind: 'tribe' }, // no territory — priests, scattered

  // ---- Table of Nations — traditional homelands (Gen 10 / 1 Chr 1) ----------
  // Japheth (northern / coastland peoples)
  gomer: { lat: 45.0, lon: 34.0, kind: 'people' },
  magog: { lat: 47.0, lon: 40.0, kind: 'people' },
  madai: { lat: 35.0, lon: 50.0, kind: 'people' },
  javan: { lat: 39.0, lon: 23.0, kind: 'people' },
  tubal: { lat: 39.5, lon: 37.0, kind: 'people' },
  meshech: { lat: 40.0, lon: 36.0, kind: 'people' },
  tiras: { lat: 41.0, lon: 26.0, kind: 'people' },
  ashkenaz: { lat: 40.2, lon: 44.0, kind: 'people' },
  togarmah: { lat: 39.9, lon: 41.3, kind: 'people' },
  tarshish: { lat: 37.4, lon: -6.0, kind: 'people' },
  kittim: { lat: 35.0, lon: 33.0, kind: 'people' },
  rodanim: { lat: 36.2, lon: 28.0, kind: 'people' },
  elishah: { lat: 35.1, lon: 33.4, kind: 'people' },
  // Ham (southern & Canaanite peoples)
  cush: { lat: 18.0, lon: 33.0, kind: 'people' },
  mizraim: { lat: 27.0, lon: 31.0, kind: 'people' },
  put: { lat: 30.0, lon: 18.0, kind: 'people' },
  canaan: { lat: 32.0, lon: 35.2, kind: 'people' },
  nimrod: { lat: 32.5, lon: 44.4, kind: 'people' },
  heth: { lat: 39.0, lon: 34.5, kind: 'people' },
  sidon: { lat: 33.56, lon: 35.37, kind: 'people' },
  'sheba-r': { lat: 15.4, lon: 44.2, kind: 'people' },
  'dedan-r': { lat: 26.6, lon: 37.9, kind: 'people' },
  seba: { lat: 15.6, lon: 32.5, kind: 'people' },
  caphtorim: { lat: 35.2, lon: 24.8, kind: 'people' },
  hamathite: { lat: 35.13, lon: 36.75, kind: 'people' },
  arvadite: { lat: 34.86, lon: 35.86, kind: 'people' },
  // Shem (Semitic peoples)
  elam: { lat: 32.0, lon: 49.0, kind: 'people' },
  asshur: { lat: 35.5, lon: 43.1, kind: 'people' },
  aram: { lat: 34.5, lon: 38.0, kind: 'people' },
  lud: { lat: 38.5, lon: 28.0, kind: 'people' },
  uz: { lat: 31.0, lon: 36.5, kind: 'people' },
  joktan: { lat: 15.5, lon: 45.0, kind: 'people' },
  'sheba-j': { lat: 15.4, lon: 44.2, kind: 'people' },
  ophir: { lat: 15.0, lon: 45.0, kind: 'people' },
  // Abraham’s other lines — Arabian & Edomite peoples
  ishmael: { lat: 28.0, lon: 40.0, kind: 'people' },
  nebaioth: { lat: 30.32, lon: 35.44, kind: 'people' },
  kedar: { lat: 30.0, lon: 40.0, kind: 'people' },
  tema: { lat: 27.63, lon: 38.48, kind: 'people' },
  midian: { lat: 28.0, lon: 35.5, kind: 'people' },
  esau: { lat: 30.5, lon: 35.4, kind: 'people' },
  teman: { lat: 30.2, lon: 35.4, kind: 'people' },
  amalek: { lat: 30.6, lon: 34.9, kind: 'people' },
  seir: { lat: 30.5, lon: 35.4, kind: 'people' },

  // ---- Key persons of the line ---------------------------------------------
  abraham: { lat: 30.96, lon: 46.1, kind: 'person' }, // Ur → Canaan
  saul: { lat: 31.82, lon: 35.24, kind: 'person' }, // Gibeah
  david: { lat: 31.7, lon: 35.2, kind: 'person' }, // Bethlehem
  solomon: { lat: 31.78, lon: 35.23, kind: 'person' }, // Jerusalem
  samuel: { lat: 31.9, lon: 35.21, kind: 'person' }, // Ramah
  joshua: { lat: 32.1, lon: 35.22, kind: 'person' },
  gideon: { lat: 32.5, lon: 35.28, kind: 'person' }, // Ophrah
  'joseph-mary': { lat: 32.7, lon: 35.3, kind: 'person' }, // Nazareth
  jesus: { lat: 31.7, lon: 35.2, kind: 'person' }, // Bethlehem
};
