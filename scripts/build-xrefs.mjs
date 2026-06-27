// Build public/data/xrefs.json — aggregated book↔book cross-references for the
// "Verweis-Graph" view — from the OpenBible.info cross-reference dataset
// (CC-BY). The source is a TSV with a header line and rows:
//
//   From Verse   To Verse        Votes
//   Gen.1.1      John.1.1-John.1.3   5
//
// The official download (https://www.openbible.info/labs/cross-references/)
// is not reachable from every build environment. Obtain `cross_references.txt`
// however you can, then:
//
//   XREFS=/path/to/cross_references.txt npm run xrefs
//
// Output: a JSON array of [fromOsisBook, toOsisBook, weight] for cross-BOOK
// pairs (same-book references are dropped — the graph links different books),
// where weight = number of distinct cross-references between the two books.

import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SRC = process.env.XREFS || '/tmp/cross_references.txt';
const OUT = path.join(ROOT, 'public', 'data', 'xrefs.json');

if (!fs.existsSync(SRC)) {
  console.error(`ERROR: cross-reference file not found at ${SRC}.`);
  console.error('Set XREFS=/path/to/cross_references.txt (OpenBible.info, CC-BY).');
  process.exit(1);
}

// OSIS book token = text before the first "." (e.g. "1Cor.1.1" -> "1Cor").
function bookOf(ref) {
  const head = ref.split('-')[0]; // a range's start verse
  const dot = head.indexOf('.');
  return dot === -1 ? head : head.slice(0, dot);
}

const counts = new Map(); // "A|B" (A<B) -> weight

const rl = readline.createInterface({
  input: fs.createReadStream(SRC),
  crlfDelay: Infinity,
});

let n = 0;
for await (const line of rl) {
  const t = line.trim();
  if (!t) continue;
  const cols = t.split('\t');
  if (cols.length < 2) continue;
  if (cols[0] === 'From Verse') continue; // header
  const a = bookOf(cols[0]);
  const b = bookOf(cols[1]);
  if (!a || !b || a === b) continue;
  const key = a < b ? `${a}|${b}` : `${b}|${a}`;
  counts.set(key, (counts.get(key) ?? 0) + 1);
  n++;
}

const edges = [...counts.entries()]
  .map(([k, w]) => {
    const [a, b] = k.split('|');
    return [a, b, w];
  })
  .sort((x, y) => y[2] - x[2]);

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(edges));
console.log(`Wrote ${edges.length} book-pair edges from ${n} cross-references → ${OUT}`);
