// Klopft die BibleProject-Guide-Adressen ab, auf die die App verlinkt.
//
//   npm run check:bp                       # alle 66 Bücher
//   npm run check:bp -- --base http://…    # gegen einen anderen Ursprung
//
// Warum es das gibt: die Adresse eines Guides wird aus dem englischen
// Buchnamen gebaut (`book-of-<name>`). Für die Bücher, die BibleProject zu
// einem Guide zusammenfasst – Samuel, Könige, Chronik –, steht die Ausnahme in
// `src/data/bpGuides.json`. Ob die Regel für alle übrigen 60 Bücher stimmt,
// weiß nur die Seite selbst. Bisher hat das niemand nachgesehen; die PRD führt
// es als offenen Punkt. Dieses Skript sieht nach.
//
// Ein 404 heißt nicht „Skript kaputt", sondern: den richtigen Slug
// heraussuchen und in `bpGuides.json` eintragen. Danach ist der Lauf grün.
//
// Was das Skript *nicht* tut: aus einem 403 einen Befund machen. Ein Filter
// oder Proxy antwortet mit 403, 407 oder 429, wo die Seite selbst 200 sagen
// würde – solche Antworten bleiben unentschieden, sonst meldet ein blockierter
// Lauf alle 63 Adressen als tot.
//
// Die Slug-Regel selbst steht in `src/data/books.ts` und hier – drei Zeilen,
// die der Browser nicht aus einem Node-Skript lesen kann. Die Ausnahmen, die
// sich tatsächlich ändern, stehen nur an einer Stelle.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadBooks } from './lib/bibleref.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OVERRIDES = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '..', 'src', 'data', 'bpGuides.json'), 'utf8'),
);

const args = process.argv.slice(2);
const baseArg = args.indexOf('--base');
const BASE = baseArg >= 0 ? args[baseArg + 1] : 'https://bibleproject.com';
/** Wie viele Adressen gleichzeitig – höflich bleiben, es ist eine fremde Seite. */
const PARALLEL = 4;

const slug = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const books = loadBooks();
/** Zusammengefasste Guides einmal prüfen, nicht zweimal. */
const targets = [];
const seen = new Set();
for (const b of books) {
  const s = OVERRIDES[b.osis] ?? `book-of-${slug(b.en)}`;
  if (seen.has(s)) continue;
  seen.add(s);
  targets.push({ slug: s, url: `${BASE}/guides/${s}/`, books: [b.osis] });
}
for (const b of books) {
  const s = OVERRIDES[b.osis] ?? `book-of-${slug(b.en)}`;
  const t = targets.find((x) => x.slug === s);
  if (t && !t.books.includes(b.osis)) t.books.push(b.osis);
}

async function check(t) {
  try {
    // HEAD reicht; manche Seiten mögen es nicht, dann GET hinterher.
    let r = await fetch(t.url, { method: 'HEAD', redirect: 'follow' });
    if (r.status === 405 || r.status === 501) r = await fetch(t.url, { redirect: 'follow' });
    return { ...t, status: r.status, finalUrl: r.url };
  } catch (e) {
    return { ...t, status: 0, error: String(e.message ?? e) };
  }
}

const results = [];
for (let i = 0; i < targets.length; i += PARALLEL) {
  results.push(...(await Promise.all(targets.slice(i, i + PARALLEL).map(check))));
}

/** Nur 404 und 410 sind eine Aussage über die Adresse. Alles andere nicht. */
const isMissing = (r) => r.status === 404 || r.status === 410;
const isOk = (r) => r.status >= 200 && r.status < 300;

const ok = results.filter(isOk);
const moved = ok.filter((r) => r.finalUrl && r.finalUrl.replace(/\/$/, '') !== r.url.replace(/\/$/, ''));
const missing = results.filter(isMissing);
const undecided = results.filter((r) => !isOk(r) && !isMissing(r));

console.log(`${results.length} Guide-Adressen für ${books.length} Bücher (${BASE})`);
console.log(`  erreichbar: ${ok.length}   fehlend: ${missing.length}   unentschieden: ${undecided.length}`);

for (const r of moved) console.log(`  → umgeleitet: ${r.slug}  ⇒  ${r.finalUrl}`);
for (const r of missing) console.log(`  ✗ ${r.status}  ${r.url}   (${r.books.join(', ')})`);
for (const r of undecided) {
  console.log(`  ? unentschieden (${r.error ?? r.status}): ${r.url}`);
}

if (undecided.length === results.length) {
  console.error('\nKeine einzige Adresse hat die Seite selbst beantwortet – Netzsperre,');
  console.error('Proxy oder Ausfall. Das ist kein Befund über die Adressen: der Lauf');
  console.error('sagt hier nichts aus, weder im Guten noch im Schlechten.');
  process.exit(2);
}
if (missing.length) {
  console.error('\nRichtigen Slug heraussuchen und in src/data/bpGuides.json eintragen.');
  process.exit(1);
}
if (undecided.length) {
  console.log(`\nAlle beantworteten Adressen führen irgendwohin; ${undecided.length} blieben offen.`);
} else {
  console.log('\nAlle Adressen führen irgendwohin.');
}
