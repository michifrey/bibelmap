// Build per-book Bible text JSON for the presentation mode.
//
// Sources (both public domain), from https://github.com/seven1m/open-bibles :
//   - deu-luther1912.osis.xml  (Luther 1912, OSIS, container verses)
//   - eng-web.usfx.xml         (World English Bible, USFX, milestone verses)
//
// Clone the repo and point OPEN_BIBLES at it, e.g.:
//   git clone --depth 1 https://github.com/seven1m/open-bibles /tmp/open-bibles
//   OPEN_BIBLES=/tmp/open-bibles npm run text
//
// Output: public/data/text/<OsisBook>.json
//   { "chapters": { "1": { "de": [{v,t}], "en": [{v,t}] }, ... } }

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SRC = process.env.OPEN_BIBLES || '/tmp/open-bibles';
const OUT_DIR = path.join(ROOT, 'public', 'data', 'text');

const LUTHER = path.join(SRC, 'deu-luther1912.osis.xml');
const WEB = path.join(SRC, 'eng-web.usfx.xml');

// USFX book id (USFM) -> OSIS code used everywhere else in the app.
const USFM_TO_OSIS = {
  GEN: 'Gen', EXO: 'Exod', LEV: 'Lev', NUM: 'Num', DEU: 'Deut', JOS: 'Josh',
  JDG: 'Judg', RUT: 'Ruth', '1SA': '1Sam', '2SA': '2Sam', '1KI': '1Kgs', '2KI': '2Kgs',
  '1CH': '1Chr', '2CH': '2Chr', EZR: 'Ezra', NEH: 'Neh', EST: 'Esth', JOB: 'Job',
  PSA: 'Ps', PRO: 'Prov', ECC: 'Eccl', SNG: 'Song', ISA: 'Isa', JER: 'Jer', LAM: 'Lam',
  EZK: 'Ezek', DAN: 'Dan', HOS: 'Hos', JOL: 'Joel', AMO: 'Amos', OBA: 'Obad', JON: 'Jonah',
  MIC: 'Mic', NAM: 'Nah', HAB: 'Hab', ZEP: 'Zeph', HAG: 'Hag', ZEC: 'Zech', MAL: 'Mal',
  MAT: 'Matt', MRK: 'Mark', LUK: 'Luke', JHN: 'John', ACT: 'Acts', ROM: 'Rom',
  '1CO': '1Cor', '2CO': '2Cor', GAL: 'Gal', EPH: 'Eph', PHP: 'Phil', COL: 'Col',
  '1TH': '1Thess', '2TH': '2Thess', '1TI': '1Tim', '2TI': '2Tim', TIT: 'Titus',
  PHM: 'Phlm', HEB: 'Heb', JAS: 'Jas', '1PE': '1Pet', '2PE': '2Pet', '1JN': '1John',
  '2JN': '2John', '3JN': '3John', JUD: 'Jude', REV: 'Rev',
};

function decodeEntities(s) {
  return s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&amp;/g, '&');
}

function stripTags(s) {
  return decodeEntities(s.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
}

// chapters[chapter][verse] = { de?, en? }
const books = new Map(); // osis -> Map(chapterNum -> Map(verseNum -> {de,en}))

function ensure(osis, ch, v) {
  if (!books.has(osis)) books.set(osis, new Map());
  const chs = books.get(osis);
  if (!chs.has(ch)) chs.set(ch, new Map());
  const vs = chs.get(ch);
  if (!vs.has(v)) vs.set(v, {});
  return vs.get(v);
}

// ---- Luther 1912 (OSIS) ---------------------------------------------
function parseLuther() {
  const xml = fs.readFileSync(LUTHER, 'utf-8');
  const re = /<verse osisID='([^']+)'>([\s\S]*?)<\/verse>/g;
  let m;
  let n = 0;
  while ((m = re.exec(xml))) {
    const [book, chS, vS] = m[1].split('.');
    if (!book || !chS || !vS) continue;
    const text = stripTags(m[2]);
    if (!text) continue;
    ensure(book, Number(chS), Number(vS)).de = text;
    n++;
  }
  console.log('  Luther verses:', n);
}

// ---- World English Bible (USFX) -------------------------------------
function parseWeb() {
  let xml = fs.readFileSync(WEB, 'utf-8');
  // drop footnotes, cross references and editorial headings entirely
  xml = xml
    .replace(/<f\b[\s\S]*?<\/f>/g, '')
    .replace(/<x\b[\s\S]*?<\/x>/g, '')
    .replace(/<s\b[\s\S]*?<\/s>/g, '')
    .replace(/<d\b[\s\S]*?<\/d>/g, '');

  let n = 0;
  const bookRe = /<book id="(\w+)">([\s\S]*?)(?=<book id="|<\/usfx>|$)/g;
  let bm;
  while ((bm = bookRe.exec(xml))) {
    const osis = USFM_TO_OSIS[bm[1]];
    if (!osis) continue; // skip front matter / glossary / etc.
    const body = bm[2];

    // split into chapters on <c id="N"/>
    const chParts = body.split(/<c id="(\d+)"\s*\/>/);
    // chParts: [pre, chNum, chBody, chNum, chBody, ...]
    for (let i = 1; i < chParts.length; i += 2) {
      const ch = Number(chParts[i]);
      const chBody = chParts[i + 1] || '';
      const vParts = chBody.split(/<v id="([\d-]+)"\s*\/>/);
      for (let j = 1; j < vParts.length; j += 2) {
        const vid = vParts[j];
        const text = stripTags(vParts[j + 1] || '');
        if (!text) continue;
        // verse ids may be ranges like "1-2"; assign to the first verse number
        const v = Number(String(vid).split('-')[0]);
        if (!v) continue;
        ensure(osis, ch, v).en = text;
        n++;
      }
    }
  }
  console.log('  WEB verses:', n);
}

// ---- write ----------------------------------------------------------
function write() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  let files = 0;
  let totalVerses = 0;
  for (const [osis, chs] of books) {
    const chapters = {};
    for (const [ch, vs] of [...chs.entries()].sort((a, b) => a[0] - b[0])) {
      const sorted = [...vs.entries()].sort((a, b) => a[0] - b[0]);
      const de = [];
      const en = [];
      for (const [v, t] of sorted) {
        if (t.de) de.push({ v, t: t.de });
        if (t.en) en.push({ v, t: t.en });
        totalVerses++;
      }
      chapters[ch] = { de, en };
    }
    fs.writeFileSync(path.join(OUT_DIR, `${osis}.json`), JSON.stringify({ chapters }));
    files++;
  }
  console.log(`Wrote ${files} book files to ${OUT_DIR} (${totalVerses} verse rows)`);
}

if (!fs.existsSync(LUTHER) || !fs.existsSync(WEB)) {
  console.error(`ERROR: source XML not found in ${SRC}. See header for clone instructions.`);
  process.exit(1);
}

console.log('Parsing Luther 1912 (OSIS) ...');
parseLuther();
console.log('Parsing World English Bible (USFX) ...');
parseWeb();
write();

// sanity check: 2 Kings 5:12
const twoKings = books.get('2Kgs')?.get(5)?.get(12);
console.log('  2Kgs 5:12 DE:', twoKings?.de?.slice(0, 60));
console.log('  2Kgs 5:12 EN:', twoKings?.en?.slice(0, 60));
