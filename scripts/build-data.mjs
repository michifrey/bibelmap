// Build compact places.json for the Bibelmap app from the OpenBible.info
// "Bible-Geocoding-Data" dataset (CC-BY 4.0).
//
// Source repo: https://github.com/openbibleinfo/Bible-Geocoding-Data
// Clone it and point OB_DATA at the clone, e.g.:
//   git clone --depth 1 https://github.com/openbibleinfo/Bible-Geocoding-Data /tmp/ob-data
//   OB_DATA=/tmp/ob-data npm run data
//
// Output: public/data/places.json (consumed by the app at runtime)

import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OB = process.env.OB_DATA || '/tmp/ob-data';
const OUT_DIR = path.join(ROOT, 'public', 'data');

function fail(msg) {
  console.error('ERROR:', msg);
  process.exit(1);
}

if (!fs.existsSync(path.join(OB, 'data', 'ancient.jsonl'))) {
  fail(`OpenBible data not found at ${OB}. Clone the repo and set OB_DATA. See header of this file.`);
}

async function* readJsonl(file) {
  const rl = readline.createInterface({
    input: fs.createReadStream(file),
    crlfDelay: Infinity,
  });
  for await (const line of rl) {
    const t = line.trim();
    if (t) yield JSON.parse(t);
  }
}

// 1) Index images by id -> usable thumbnail URL + credit
console.log('Reading image.jsonl ...');
const imageIndex = new Map();
for await (const img of readJsonl(path.join(OB, 'data', 'image.jsonl'))) {
  // thumbnail_url_pattern contains a #### placeholder for pixel width
  let url = img.thumbnail_url_pattern || img.file_url || null;
  if (url && url.includes('####')) url = url.replace('####', '512');
  imageIndex.set(img.id, {
    url,
    credit: img.credit || img.author || null,
    creditUrl: img.url || img.credit_url || null,
    license: img.license || null,
  });
}
console.log('  images:', imageIndex.size);

// Helpers --------------------------------------------------------------

// Pull a representative lon/lat out of an ancient place's identifications.
function pickLonLat(place) {
  const ids = place.identifications || [];
  let best = null;
  for (const ident of ids) {
    for (const res of ident.resolutions || []) {
      if (!res.lonlat) continue;
      const [lonS, latS] = res.lonlat.split(',');
      const lon = parseFloat(lonS);
      const lat = parseFloat(latS);
      if (Number.isFinite(lon) && Number.isFinite(lat)) {
        const score = (res.land_or_water === 'water' ? 0 : 1) +
          (res.lonlat_type === 'representative point' ? 1 : 0);
        if (!best || score > best.score) best = { lon, lat, score };
      }
    }
  }
  return best ? { lon: best.lon, lat: best.lat } : null;
}

// Resolve the best thumbnail image for a place.
function pickImage(place) {
  const t = place?.media?.thumbnail;
  if (!t) return null;
  const fromIndex = t.image_id ? imageIndex.get(t.image_id) : null;
  const url = fromIndex?.url || null;
  if (!url) return null;
  return {
    url,
    credit: t.credit || fromIndex?.credit || null,
    creditUrl: t.credit_url || fromIndex?.creditUrl || null,
    license: fromIndex?.license || null,
  };
}

// Extract external source links (Wikidata Q-id, Biblia factbook).
function pickLinks(place) {
  const ld = place.linked_data || {};
  let wikidata = null;
  let biblia = null;
  for (const v of Object.values(ld)) {
    if (!v || typeof v !== 'object') continue;
    if (typeof v.id === 'string' && /^Q\d+$/.test(v.id)) wikidata = v.id;
    if (typeof v.url === 'string' && v.url.includes('biblia.com')) biblia = v.url;
  }
  return { wikidata, biblia };
}

// 2) Walk ancient.jsonl and build compact records
console.log('Reading ancient.jsonl ...');
const places = [];
let skippedNoCoord = 0;
for await (const p of readJsonl(path.join(OB, 'data', 'ancient.jsonl'))) {
  const coord = pickLonLat(p);
  if (!coord) {
    skippedNoCoord++;
    continue;
  }
  const verses = (p.verses || [])
    .filter((v) => v.osis && v.sort)
    .map((v) => {
      const parts = String(v.osis).split('.');
      const book = parts[0];
      const chapter = parseInt(parts[1], 10) || 0;
      const verse = parseInt(parts[2], 10) || 0;
      const bookNum = parseInt(String(v.sort).slice(0, 2), 10) || 0;
      return { osis: v.osis, ref: v.readable || v.osis, book, bookNum, chapter, verse, sort: v.sort };
    })
    .sort((a, b) => String(a.sort).localeCompare(String(b.sort)));

  const variants = Object.keys(p.translation_name_counts || {});
  const { wikidata, biblia } = pickLinks(p);

  places.push({
    id: p.id,
    name: p.friendly_id,
    slug: p.url_slug,
    article: p.preceding_article || null,
    types: p.types || [],
    lat: Math.round(coord.lat * 1e5) / 1e5,
    lon: Math.round(coord.lon * 1e5) / 1e5,
    img: pickImage(p),
    wikidata,
    biblia,
    variants,
    mentionCount: verses.length,
    verses,
  });
}

places.sort((a, b) => b.mentionCount - a.mentionCount);

console.log('  places with coords:', places.length, ' skipped (no coord):', skippedNoCoord);

// 3) Write output
fs.mkdirSync(OUT_DIR, { recursive: true });
const outFile = path.join(OUT_DIR, 'places.json');
fs.writeFileSync(outFile, JSON.stringify(places));
const kb = Math.round(fs.statSync(outFile).size / 1024);
console.log(`Wrote ${outFile} (${kb} KB, ${places.length} places)`);

// Quick sanity: list a few well-known places
const wanted = ['Jerusalem', 'Goshen', 'Nineveh', 'Babylon', 'Bethlehem'];
for (const w of wanted) {
  const hit = places.find((p) => p.name === w);
  console.log(`  ${w}:`, hit ? `${hit.mentionCount} mentions @ ${hit.lat},${hit.lon}` : 'NOT FOUND');
}
