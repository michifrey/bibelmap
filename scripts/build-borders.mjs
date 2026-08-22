// Build the year-by-year border overlay for the map from the
// "historical-basemaps" dataset (aourednik/historical-basemaps, GPL-3.0).
//
//   git clone --depth 1 https://github.com/aourednik/historical-basemaps /tmp/hb
//   HB=/tmp/hb node scripts/build-borders.mjs
//
// The raw dataset is world-wide polygons for every snapshot year. For the map
// we only need the biblical world, at a scale where a 5 km deviation is
// invisible — so each snapshot is filtered to the polities that actually reach
// the region and simplified before it is written out.
// Output: public/data/borders.json
//
// The dataset's own README is explicit that the borders are approximate
// (roughly +/- 40 miles, and worse the further back you go). The UI says so.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { POLITIES_DE } from './lib/polities-de.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const HB = process.env.HB || '/tmp/hb';
const OUT = path.join(ROOT, 'public', 'data', 'borders.json');

/** Snapshots the dataset offers inside the biblical span, oldest first. */
const SNAPSHOTS = [
  { file: 'world_bc2000.geojson', year: -2000 },
  { file: 'world_bc1500.geojson', year: -1500 },
  { file: 'world_bc1000.geojson', year: -1000 },
  { file: 'world_bc700.geojson', year: -700 },
  { file: 'world_bc500.geojson', year: -500 },
  { file: 'world_bc400.geojson', year: -400 },
  { file: 'world_bc323.geojson', year: -323 },
  { file: 'world_bc300.geojson', year: -300 },
  { file: 'world_bc200.geojson', year: -200 },
  { file: 'world_bc100.geojson', year: -100 },
  { file: 'world_bc1.geojson', year: -1 },
  { file: 'world_100.geojson', year: 100 },
];

/**
 * A polity has to reach into this box to be worth drawing. Wide enough for Rome
 * in the west and Bactria in the east, Kush in the south, the Black Sea north.
 */
const REGION = { west: 8, east: 62, south: 10, north: 48 };

/**
 * The dataset also maps archaeological culture areas and ethnic ranges — huge
 * sprawling polygons like "West African cereal farmers" or "Khoiasan" that
 * clip the corner of the region and would then cover half the map with a label
 * that means nothing here. This atlas draws polities, so they are dropped.
 */
const NOT_A_POLITY =
  /culture|cultures|farmers|nomads|pastoral|hunter|gatherer|tribes|Khoiasan|Bantu|Dravidian|Berber|Austroasian|Semites|Beaker|Andronovo|Oxus|Namazga|Sintashta|Karasuk|Únětice|Cimerians|Saces|Alans|Sarmates|Scythians|Blemmyes|Boihaenum|Boii/i;

/**
 * Two names the source carries forward past the point where they are right.
 * "Kingdom of David and Solomon" is drawn from 1500 BC (three centuries before
 * the exodus) to 700 BC (two centuries after the kingdom split) — in a Bible
 * atlas of all places that reads as a claim, so it is corrected.
 */
const RENAME = {
  '-1500': { 'Kingdom of David and Solomon': 'Canaan' },
  '-700': { 'Kingdom of David and Solomon': 'Israel and Judah' },
};

/** ~5 km at this latitude — below what anyone can see at country scale. */
const TOLERANCE = 0.05;

function fail(msg) {
  console.error('ERROR:', msg);
  process.exit(1);
}

if (!fs.existsSync(path.join(HB, 'geojson'))) {
  fail(`Datensatz nicht gefunden unter ${HB}. Siehe Kopf dieser Datei.`);
}

// --- geometry --------------------------------------------------------------

/** Perpendicular distance of p from the line a–b, in degrees. */
function segmentDistance(p, a, b) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  if (dx === 0 && dy === 0) return Math.hypot(p[0] - a[0], p[1] - a[1]);
  const t = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(p[0] - (a[0] + t * dx), p[1] - (a[1] + t * dy));
}

/** Douglas–Peucker. Iterative, so a 40 000-point coastline cannot blow the stack. */
function simplify(points, tolerance) {
  if (points.length < 3) return points;
  const keep = new Uint8Array(points.length);
  keep[0] = keep[points.length - 1] = 1;
  const stack = [[0, points.length - 1]];
  while (stack.length) {
    const [first, last] = stack.pop();
    let worst = 0;
    let index = -1;
    for (let i = first + 1; i < last; i++) {
      const d = segmentDistance(points[i], points[first], points[last]);
      if (d > worst) {
        worst = d;
        index = i;
      }
    }
    if (worst > tolerance && index > 0) {
      keep[index] = 1;
      stack.push([first, index], [index, last]);
    }
  }
  return points.filter((_, i) => keep[i]);
}

const round = (p) => [Math.round(p[0] * 100) / 100, Math.round(p[1] * 100) / 100];

/** A ring is worth keeping only if it survives simplification as a polygon. */
function simplifyRing(ring) {
  const out = simplify(ring, TOLERANCE).map(round);
  if (out.length < 4) return null;
  // Douglas–Peucker can move the last point off the first; close it again.
  const [a, b] = [out[0], out[out.length - 1]];
  if (a[0] !== b[0] || a[1] !== b[1]) out.push(a);
  return out;
}

/** Signed area of a ring in square degrees — good enough to rank rings by size. */
function ringArea(ring) {
  let sum = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    sum += (ring[j][0] + ring[i][0]) * (ring[j][1] - ring[i][1]);
  }
  return Math.abs(sum / 2);
}

/** Area-weighted centroid of a ring — where the name gets written. */
function ringCentroid(ring) {
  let x = 0;
  let y = 0;
  let a = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const f = ring[j][0] * ring[i][1] - ring[i][0] * ring[j][1];
    a += f;
    x += (ring[j][0] + ring[i][0]) * f;
    y += (ring[j][1] + ring[i][1]) * f;
  }
  if (a === 0) return ring[0];
  return round([x / (3 * a), y / (3 * a)]);
}

function reachesRegion(ring) {
  for (const [lon, lat] of ring) {
    if (lon >= REGION.west && lon <= REGION.east && lat >= REGION.south && lat <= REGION.north) {
      return true;
    }
  }
  return false;
}

/** All polygons of one feature, simplified. Geometry stays whole: an empire that
 *  runs off the region is more legible drawn whole than cut off at a straight
 *  edge that never existed. */
function trimGeometry(geometry) {
  const polygons = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates;
  if (!Array.isArray(polygons)) return null;

  const kept = [];
  for (const polygon of polygons) {
    if (!Array.isArray(polygon?.[0])) continue;
    const rings = [];
    for (const ring of polygon) {
      const s = simplifyRing(ring);
      if (s) rings.push(s);
    }
    if (rings.length) kept.push(rings);
  }
  return kept.length ? kept : null;
}

// --- build -----------------------------------------------------------------

const out = { years: [], byYear: {} };
const untranslated = new Set();
let rawTotal = 0;

for (const snap of SNAPSHOTS) {
  const file = path.join(HB, 'geojson', snap.file);
  if (!fs.existsSync(file)) {
    console.log(`  ${snap.file}: fehlt, übersprungen`);
    continue;
  }
  const raw = fs.readFileSync(file, 'utf8');
  rawTotal += raw.length;
  const collection = JSON.parse(raw);
  const renames = RENAME[String(snap.year)] ?? {};

  // Same polity, several polygons (Greek colonies, the two Aramaean blocks):
  // merged so it carries one name and one label instead of three.
  const byName = new Map();

  for (const f of collection.features ?? []) {
    if (!f.geometry) continue;
    let name = (f.properties?.NAME ?? '').trim();
    if (!name || name === '?' || NOT_A_POLITY.test(name)) continue;
    name = renames[name] ?? name;

    const polygons = trimGeometry(f.geometry);
    if (!polygons) continue;
    if (!polygons.some((p) => reachesRegion(p[0]))) continue;

    const entry = byName.get(name) ?? {
      name,
      nameDe: POLITIES_DE[name] ?? name,
      // SUBJECTO names the overlord where a polity was a vassal — worth showing.
      subjectTo: (f.properties?.SUBJECTO ?? '').trim() || undefined,
      polygons: [],
    };
    entry.polygons.push(...polygons);
    byName.set(name, entry);
    if (!POLITIES_DE[name]) untranslated.add(name);
  }

  const features = [];
  for (const entry of byName.values()) {
    // Label goes on the biggest piece, and only if that piece is in the region:
    // an empire whose heartland is off-map should not shout across it.
    let best = null;
    let bestArea = 0;
    for (const polygon of entry.polygons) {
      const a = ringArea(polygon[0]);
      if (a > bestArea && reachesRegion(polygon[0])) {
        bestArea = a;
        best = polygon[0];
      }
    }
    features.push({
      name: entry.name,
      nameDe: entry.nameDe,
      ...(entry.subjectTo ? { subjectTo: entry.subjectTo } : {}),
      area: Math.round(bestArea * 10) / 10,
      at: best ? ringCentroid(best) : undefined,
      geometry:
        entry.polygons.length === 1
          ? { type: 'Polygon', coordinates: entry.polygons[0] }
          : { type: 'MultiPolygon', coordinates: entry.polygons },
    });
  }
  // Big polities first, so the small ones stay clickable on top of them.
  features.sort((a, b) => b.area - a.area);

  out.years.push(snap.year);
  out.byYear[snap.year] = features;
  console.log(`  ${String(snap.year).padStart(6)}: ${String(features.length).padStart(3)} Reiche`);
}

if (!out.years.length) fail('Keine Snapshots gefunden.');

fs.writeFileSync(OUT, JSON.stringify(out));
const kb = Math.round(fs.statSync(OUT).size / 1024);
console.log(
  `\nGeschrieben: ${path.relative(ROOT, OUT)} (${kb} KB, aus ${Math.round(rawTotal / 1024 / 1024)} MB Rohdaten)`,
);
console.log(`Jahre: ${out.years.join(', ')}`);
if (untranslated.size) {
  console.log(`\nOhne deutschen Namen (scripts/lib/polities-de.mjs): ${[...untranslated].sort().join(', ')}`);
}
