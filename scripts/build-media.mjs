// Map podcast episodes and videos onto the places and eras of the map.
//
// Every episode that names a Bible passage in its title or description can be
// placed twice over: geographically, via the places the passage mentions, and
// thematically, via the era the book belongs to. That is the whole idea — the
// app already knows which places occur in which verse, so a reference is enough.
//
//   node scripts/build-media.mjs            # build from data/media/raw/*.xml
//   node scripts/build-media.mjs --fetch    # download the feeds first
//   node scripts/build-media.mjs --dry      # report only, write nothing
//
// Feeds are cached under data/media/raw/ so the build works offline and the
// result is reproducible. Sources live in data/media/sources.json.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadBooks, buildLexicon, findRefs, formatRef } from './lib/bibleref.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const MEDIA = path.join(ROOT, 'data', 'media');
const RAW = path.join(MEDIA, 'raw');
const PLACES = path.join(ROOT, 'public', 'data', 'places.json');
const OUT = path.join(ROOT, 'public', 'data', 'media.json');

const DRY = process.argv.includes('--dry');
const FETCH = process.argv.includes('--fetch');

function fail(msg) {
  console.error('ERROR:', msg);
  process.exit(1);
}

if (!fs.existsSync(PLACES)) fail(`${PLACES} fehlt — erst "npm run data".`);
const sourcesFile = path.join(MEDIA, 'sources.json');
if (!fs.existsSync(sourcesFile)) fail(`${sourcesFile} fehlt.`);

const books = loadBooks();
const lexicon = buildLexicon(books);
const bookByOsis = new Map(books.map((b) => [b.osis, b]));
const places = JSON.parse(fs.readFileSync(PLACES, 'utf8'));
const sources = JSON.parse(fs.readFileSync(sourcesFile, 'utf8')).sources;

// verse key -> place ids mentioned there
const placesByVerse = new Map();
for (const p of places) {
  for (const v of p.verses) {
    let list = placesByVerse.get(v.osis);
    if (!list) placesByVerse.set(v.osis, (list = []));
    list.push(p.id);
  }
}
const placeById = new Map(places.map((p) => [p.id, p]));

// --- feeds -----------------------------------------------------------------

function stripTags(s) {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function field(item, tag) {
  const m = item.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i'));
  return m ? stripTags(m[1]) : '';
}

/** Minimal RSS/Atom item reader — enough for podcast feeds, no dependency. */
function parseFeed(xml) {
  const items = [];
  for (const m of xml.matchAll(/<(item|entry)[\s>][\s\S]*?<\/\1>/gi)) {
    const raw = m[0];
    let link = field(raw, 'link');
    if (!link) {
      const href = raw.match(/<link[^>]*href="([^"]+)"/i);
      if (href) link = href[1];
    }
    if (!link) {
      const enc = raw.match(/<enclosure[^>]*url="([^"]+)"/i);
      if (enc) link = enc[1];
    }
    items.push({
      title: field(raw, 'title'),
      link,
      date: field(raw, 'pubDate') || field(raw, 'published') || field(raw, 'updated'),
      summary:
        field(raw, 'itunes:subtitle') ||
        field(raw, 'description') ||
        field(raw, 'summary') ||
        field(raw, 'content'),
    });
  }
  return items;
}

/**
 * Podcast directories publish the RSS address, so an Apple id is enough to find
 * a feed we could not verify by hand. Cheaper than guessing a URL and being
 * wrong about it silently.
 */
async function resolveFeed(appleId) {
  const res = await fetch(`https://itunes.apple.com/lookup?id=${appleId}&entity=podcast`);
  if (!res.ok) throw new Error(`iTunes-Lookup HTTP ${res.status}`);
  const data = await res.json();
  const feed = data?.results?.find((r) => r.feedUrl)?.feedUrl;
  if (!feed) throw new Error(`iTunes kennt zu ${appleId} keinen Feed`);
  return feed;
}

async function loadFeed(source) {
  const cache = path.join(RAW, `${source.id}.xml`);
  let feed = source.feed;
  if (FETCH && !feed && source.appleId) {
    try {
      feed = await resolveFeed(source.appleId);
      console.log(`  ${source.id}: Feed über Apple-ID ${source.appleId} gefunden`);
      console.log(`      ${feed}`);
      console.log(`      → in data/media/sources.json bei "feed" eintragen, dann entfällt der Umweg.`);
    } catch (err) {
      console.log(`  ${source.id}: Feed nicht auflösbar (${err.message})`);
    }
  }
  if (FETCH && feed) {
    process.stdout.write(`  ${source.id}: lade ${feed} … `);
    try {
      const res = await fetch(feed, { headers: { 'user-agent': 'bibelmap/0.1' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const xml = await res.text();
      fs.mkdirSync(RAW, { recursive: true });
      fs.writeFileSync(cache, xml);
      console.log(`${Math.round(xml.length / 1024)} KB`);
    } catch (err) {
      console.log(`fehlgeschlagen (${err.message}) — nutze den Cache, falls vorhanden`);
    }
  }
  if (!fs.existsSync(cache)) return null;
  return fs.readFileSync(cache, 'utf8');
}

// --- build -----------------------------------------------------------------

/** A feed date as YYYY-MM-DD, or null — feeds do ship unparsable pubDates. */
function isoDate(value) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
}

/** Expand a reference to the verse keys it covers. */
function verseKeys(ref) {
  const book = bookByOsis.get(ref.osis);
  if (!book) return [];
  if (ref.verseStart == null) {
    // Whole chapter: take every verse key we know for it.
    const prefix = `${ref.osis}.${ref.chapter}.`;
    return [...placesByVerse.keys()].filter((k) => k.startsWith(prefix));
  }
  const keys = [];
  for (let v = ref.verseStart; v <= (ref.verseEnd ?? ref.verseStart); v++) {
    keys.push(`${ref.osis}.${ref.chapter}.${v}`);
  }
  return keys;
}

const episodes = [];
const report = [];

for (const source of sources) {
  if (source.kind === 'generated') continue; // handled below
  const xml = await loadFeed(source);
  if (!xml) {
    report.push({ id: source.id, items: 0, withRef: 0, note: 'kein Feed (data/media/raw fehlt)' });
    continue;
  }
  const items = parseFeed(xml);
  let withRef = 0;
  for (const item of items) {
    if (!item.title) continue;
    const refs = findRefs(`${item.title} ${item.summary}`, lexicon, books);
    if (!refs.length) continue; // topical episode — no passage, no place
    withRef++;

    const placeIds = new Set();
    const eras = new Set();
    for (const ref of refs) {
      eras.add(bookByOsis.get(ref.osis).era);
      for (const key of verseKeys(ref)) {
        for (const id of placesByVerse.get(key) ?? []) placeIds.add(id);
      }
    }
    episodes.push({
      src: source.id,
      title: item.title,
      url: item.link || source.homepage,
      date: isoDate(item.date),
      refs: refs.map((r) => ({ ...r, label: formatRef(r, books, source.lang ?? 'de') })),
      places: [...placeIds],
      eras: [...eras],
    });
  }
  report.push({ id: source.id, items: items.length, withRef });
}

// Read BP_GUIDE_OVERRIDE straight out of books.ts rather than keeping a second
// copy here — one of the two would drift.
const bpOverrides = (() => {
  const src = fs.readFileSync(path.join(ROOT, 'src', 'data', 'books.ts'), 'utf8');
  const block = src.match(/BP_GUIDE_OVERRIDE[^=]*=\s*\{([\s\S]*?)\};/);
  const map = {};
  if (block) for (const m of block[1].matchAll(/'([^']+)':\s*'([^']+)'/g)) map[m[1]] = m[2];
  return map;
})();

function bookSlug(book) {
  return (
    bpOverrides[book.osis] ??
    `book-of-${book.en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`
  );
}

// BibleProject book guides need no feed: one entry per book, and every place
// that occurs in that book links to it.
const bp = sources.find((s) => s.kind === 'generated' && s.id === 'bibleproject');
if (bp) {
  const placesByBook = new Map();
  for (const p of places) {
    for (const v of p.verses) {
      let set = placesByBook.get(v.book);
      if (!set) placesByBook.set(v.book, (set = new Set()));
      set.add(p.id);
    }
  }
  let n = 0;
  for (const book of books) {
    const ids = placesByBook.get(book.osis);
    if (!ids?.size) continue;
    episodes.push({
      src: bp.id,
      title: bp.lang === 'en' ? `${book.en} — Book Overview` : `${book.de.replace(/\s*\(.*\)$/, '')} — Buchüberblick`,
      url: bp.urlPattern.replace('{slug}', bookSlug(book)),
      date: null,
      refs: [{ osis: book.osis, chapter: null, verseStart: null, verseEnd: null, label: book.de.replace(/\s*\(.*\)$/, '') }],
      places: [...ids],
      eras: [book.era],
    });
    n++;
  }
  report.push({ id: bp.id, items: n, withRef: n });
}

// --- report ----------------------------------------------------------------

episodes.sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''));

const byPlace = {};
for (let i = 0; i < episodes.length; i++) {
  for (const id of episodes[i].places) (byPlace[id] ??= []).push(i);
}
// byPlace carries the relation both ways, so the per-episode list is dead weight
// in the payload the browser downloads.
const placesCoveredCount = Object.keys(byPlace).length;
for (const e of episodes) delete e.places;

console.log('\nQuellen:');
for (const r of report) {
  console.log(
    `  ${r.id.padEnd(16)} ${String(r.items).padStart(5)} Einträge, ` +
      `${String(r.withRef).padStart(5)} mit Bibelstelle${r.note ? '  — ' + r.note : ''}`,
  );
}
const placesCovered = placesCoveredCount;
console.log(
  `\n${episodes.length} zugeordnete Beiträge, ${placesCovered} von ${places.length} Orten haben mindestens einen.`,
);

if (DRY) {
  console.log('\n--dry: nichts geschrieben. Beispiele:');
  for (const [i, e] of episodes.slice(0, 8).entries()) {
    void i;
    const ids = Object.entries(byPlace).filter(([, list]) => list.includes(episodes.indexOf(e))).map(([id]) => id);
    const names = ids.slice(0, 4).map((id) => placeById.get(id)?.nameDe ?? placeById.get(id)?.name);
    console.log(`  [${e.src}] ${e.title.slice(0, 60)}`);
    console.log(`      ${e.refs.map((r) => r.label).join(', ')} → ${names.join(', ')}${ids.length > 4 ? ' …' : ''}`);
  }
  process.exit(0);
}

fs.writeFileSync(
  OUT,
  JSON.stringify({
    sources: sources.map(({ id, title, author, homepage, lang, kind }) => ({ id, title, author, homepage, lang, kind })),
    episodes,
    byPlace,
  }),
);
console.log(`Geschrieben: ${path.relative(ROOT, OUT)} (${Math.round(fs.statSync(OUT).size / 1024)} KB)`);
