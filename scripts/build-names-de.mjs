// Derive German place names for the Bibelmap places from the Lutherbibel 1912.
//
// The OpenBible dataset ships English place names only ("Egypt", "Babylon 1"),
// so the German UI used to show English labels. This script recovers the German
// names from data we already have: for every place we know the exact verses it
// is mentioned in, and we have the full Luther text for those verses. The German
// name is the word that appears in (almost) all of a place's verses and hardly
// anywhere else.
//
//   node scripts/build-names-de.mjs        # derive, write data/*, patch places.json
//   node scripts/build-names-de.mjs --dry  # derive and report, write nothing
//
// Outputs:
//   data/names-de.json         accepted names (id -> {de, variants}) — used by the build
//   data/names-de-review.json  uncertain guesses, for a human to confirm
//   public/data/places.json    patched in place with nameDe / variantsDe
//
// Hand-checked entries in data/names-de-overrides.json always win.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DATA = path.join(ROOT, 'data');
const PLACES = path.join(ROOT, 'public', 'data', 'places.json');
const TEXT = path.join(ROOT, 'public', 'data', 'text');

const DRY = process.argv.includes('--dry');

// A candidate must look this much like the English name to be accepted on
// spelling alone (Damascus/Damaskus, Shechem/Sichem, Nineveh/Ninive).
const SIM_NEAR = 0.75;
// A translated name (Red Sea/Schilfmeer) has no spelling overlap, so it has to
// carry its own statistical weight instead.
const STAT_MIN_N = 5;
const STAT_MIN_F1 = 0.45;

function fail(msg) {
  console.error('ERROR:', msg);
  process.exit(1);
}

if (!fs.existsSync(PLACES)) fail(`${PLACES} not found — run "npm run data" first.`);
if (!fs.existsSync(TEXT)) fail(`${TEXT} not found — run "npm run text" first.`);

// --- load ------------------------------------------------------------------

const places = JSON.parse(fs.readFileSync(PLACES, 'utf8'));

/** osis verse key -> German verse text */
const verses = new Map();
for (const file of fs.readdirSync(TEXT)) {
  if (!file.endsWith('.json')) continue;
  const osis = file.slice(0, -5);
  const book = JSON.parse(fs.readFileSync(path.join(TEXT, file), 'utf8'));
  for (const [chapter, ch] of Object.entries(book.chapters || {})) {
    for (const v of ch.de || []) verses.set(`${osis}.${chapter}.${v.v}`, v.t);
  }
}
console.log(`Luther 1912: ${verses.size} Verse, ${places.length} Orte`);

// --- index -----------------------------------------------------------------

// Capitalised words, hyphenated names kept whole ("Beth-El", "Me-Jarkon").
// NB: \b is ASCII-only in JS, so a leading "Ä" would not be matched — hence the
// explicit Unicode lookbehind.
const TOKEN = /(?<!\p{L})\p{Lu}[\p{Ll}ß]+(?:-\p{Lu}?[\p{Ll}ß]+)*/gu;

/** verse key -> Set of capitalised words in it */
const tokensOf = new Map();
/** word -> number of verses containing it */
const docFreq = new Map();
for (const [key, text] of verses) {
  const set = new Set(text.match(TOKEN) || []);
  tokensOf.set(key, set);
  for (const w of set) docFreq.set(w, (docFreq.get(w) || 0) + 1);
}

// --- similarity ------------------------------------------------------------

const fold = (s) =>
  s
    .toLowerCase()
    .replace(/ä/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/ü/g, 'u')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z]/g, '');

function levenshtein(a, b) {
  const m = a.length;
  const n = b.length;
  if (!m) return n;
  if (!n) return m;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[n];
}

function similarity(a, b) {
  const x = fold(a);
  const y = fold(b);
  if (!x || !y) return 0;
  return 1 - levenshtein(x, y) / Math.max(x.length, y.length);
}

/** OpenBible disambiguates duplicates with a trailing number: "Babylon 1". */
const baseName = (n) => n.replace(/ \d+$/, '');

// --- derivation ------------------------------------------------------------

function derive(place) {
  const keys = place.verses.map((v) => v.osis).filter((k) => verses.has(k));
  if (!keys.length) return null;

  const english = [baseName(place.name), ...place.variants.map(baseName)];

  const termFreq = new Map();
  for (const k of keys) for (const w of tokensOf.get(k)) termFreq.set(w, (termFreq.get(w) || 0) + 1);

  const candidates = [];
  for (const [w, n] of termFreq) {
    const precision = n / docFreq.get(w);
    const recall = n / keys.length;
    const f1 = (2 * precision * recall) / (precision + recall);
    const sim = Math.max(...english.map((e) => similarity(w, e)));
    candidates.push({ w, n, precision, recall, f1, sim });
  }
  if (!candidates.length) return null;

  // The statistically strongest word, ignoring spelling.
  const stat = candidates.reduce((a, b) => (b.f1 > a.f1 ? b : a));
  // The best spelling match, preferring the one with more support.
  const near = candidates
    .filter((c) => c.sim >= SIM_NEAR)
    .sort((a, b) => b.f1 - a.f1 || b.sim - a.sim)[0];

  let best;
  let confident;
  if (near && (stat.n < 3 || near.f1 >= 0.4 * stat.f1)) {
    // A transliteration of the English name, backed by where it actually occurs.
    // The stat.n < 3 arm covers places mentioned once, where every rare word in
    // that single verse scores f1 = 1 and only spelling can decide.
    best = near;
    confident = true;
  } else {
    best = stat;
    confident = stat.n >= STAT_MIN_N && stat.f1 >= STAT_MIN_F1;
  }

  // Luther often uses the gentilic where OpenBible names the region
  // ("Midianiter" vs "Midian"). Prefer the shorter base form when it is well
  // attested in its own right.
  for (const c of candidates) {
    if (
      c.w !== best.w &&
      best.w.toLowerCase().startsWith(c.w.toLowerCase()) &&
      c.w.length >= 4 &&
      c.n >= 3 &&
      c.precision >= 0.6
    ) {
      best = c;
      break;
    }
  }

  // Inflections and compounds of the chosen name ("Jerusalems", "Ägyptenland"),
  // used to highlight the place inside the running text.
  const stem = fold(best.w).slice(0, 4);
  const variants =
    stem.length >= 4
      ? [
          ...new Set(
            candidates
              .filter((c) => c.w !== best.w && c.precision >= 0.6 && c.n >= 2 && fold(c.w).startsWith(stem))
              .map((c) => c.w),
          ),
        ]
      : [];

  return { name: best.w, variants, confident, stats: best };
}

// --- run -------------------------------------------------------------------

const overridesFile = path.join(DATA, 'names-de-overrides.json');
const overrides = fs.existsSync(overridesFile) ? JSON.parse(fs.readFileSync(overridesFile, 'utf8')) : {};

const accepted = {};
const review = [];
let fromOverride = 0;
let fromLuther = 0;
let unresolved = 0;

for (const place of places) {
  const override = overrides[place.id];
  if (override) {
    accepted[place.id] = { de: override.de, variants: override.variants || [] };
    fromOverride++;
    continue;
  }

  const got = derive(place);
  if (got && got.confident) {
    accepted[place.id] = { de: got.name, variants: got.variants };
    fromLuther++;
  } else {
    unresolved++;
    review.push({
      id: place.id,
      en: baseName(place.name),
      mentions: place.mentionCount,
      guess: got ? got.name : null,
      f1: got ? Number(got.stats.f1.toFixed(2)) : null,
      sim: got ? Number(got.stats.sim.toFixed(2)) : null,
    });
  }
}

review.sort((a, b) => b.mentions - a.mentions);

const total = places.length;
console.log(
  `Deutsch: ${fromLuther} aus dem Luther-Text, ${fromOverride} von Hand, ` +
    `${unresolved} offen  (${(((fromLuther + fromOverride) / total) * 100).toFixed(1)} % abgedeckt)`,
);

if (DRY) {
  console.log('\n--dry: nichts geschrieben. Die 15 wichtigsten offenen Orte:');
  for (const r of review.slice(0, 15)) {
    console.log(`  ${String(r.mentions).padStart(4)}  ${r.en.padEnd(24)} Vorschlag: ${r.guess ?? '—'}`);
  }
  process.exit(0);
}

fs.mkdirSync(DATA, { recursive: true });
fs.writeFileSync(path.join(DATA, 'names-de.json'), JSON.stringify(accepted, null, 0) + '\n');
fs.writeFileSync(path.join(DATA, 'names-de-review.json'), JSON.stringify(review, null, 2) + '\n');

// Patch places.json in place so the app can use the names without a full rebuild.
let patched = 0;
for (const place of places) {
  const hit = accepted[place.id];
  if (!hit) {
    delete place.nameDe;
    delete place.variantsDe;
    continue;
  }
  place.nameDe = hit.de;
  if (hit.variants.length) place.variantsDe = hit.variants;
  else delete place.variantsDe;
  patched++;
}
fs.writeFileSync(PLACES, JSON.stringify(places));

console.log(`Geschrieben: data/names-de.json, data/names-de-review.json`);
console.log(`places.json ergänzt: ${patched} Orte mit nameDe`);
