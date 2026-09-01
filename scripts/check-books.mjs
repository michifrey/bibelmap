// Prüft die Büchertabelle – 66 Bücher, und drei andere Prüfungen stehen darauf.
//
//   node --experimental-strip-types --import ./scripts/lib/ts-loader.mjs scripts/check-books.mjs
//   npm run check:books
//   npm run check:books -- --gegenprobe
//
// **Warum ausgerechnet diese Tabelle.** `books.ts` ist nicht bloss eine Liste
// von Namen: `parseRef` klemmt jede Kapitelzahl daran, und `check:passages`
// prüft mit ihr, ob ein Kapitel überhaupt existiert. Stünde dort „Markus, 200
// Kapitel", liesse `check:passages` ein „Mk 99" anstandslos durch – die
// Prüfung wäre dann nicht falsch, sondern blind, und niemand merkte es. Eine
// Prüfung ist nur so viel wert wie das, woran sie misst.
//
// Die Kapitelzahlen des protestantischen Kanons sind über alle Ausgaben
// gleich; sie stehen hier als zweite, unabhängige Quelle neben der Tabelle.
// Beim ersten Lauf stimmten alle 66 überein – die Prüfung hält das fest,
// statt sich darauf zu verlassen, dass es so bleibt.

import { BOOKS } from '../src/data/books.ts';
import { ERAS } from '../src/data/eras.ts';

/** Kapitelzahlen des protestantischen Kanons, in kanonischer Reihenfolge. */
const KANON = {
  Gen: 50, Exod: 40, Lev: 27, Num: 36, Deut: 34, Josh: 24, Judg: 21, Ruth: 4,
  '1Sam': 31, '2Sam': 24, '1Kgs': 22, '2Kgs': 25, '1Chr': 29, '2Chr': 36,
  Ezra: 10, Neh: 13, Esth: 10, Job: 42, Ps: 150, Prov: 31, Eccl: 12, Song: 8,
  Isa: 66, Jer: 52, Lam: 5, Ezek: 48, Dan: 12, Hos: 14, Joel: 3, Amos: 9,
  Obad: 1, Jonah: 4, Mic: 7, Nah: 3, Hab: 3, Zeph: 3, Hag: 2, Zech: 14, Mal: 4,
  Matt: 28, Mark: 16, Luke: 24, John: 21, Acts: 28, Rom: 16, '1Cor': 16,
  '2Cor': 13, Gal: 6, Eph: 6, Phil: 4, Col: 4, '1Thess': 5, '2Thess': 3,
  '1Tim': 6, '2Tim': 4, Titus: 3, Phlm: 1, Heb: 13, Jas: 5, '1Pet': 5,
  '2Pet': 3, '1John': 5, '2John': 1, '3John': 1, Jude: 1, Rev: 22,
};
/** Ab hier beginnt das Neue Testament. */
const ERSTES_NT = 40;

const gegenprobe = process.argv.includes('--gegenprobe');

let buecher = BOOKS;
if (gegenprobe) {
  const b = (osis, ae) => ({ ...BOOKS.find((x) => x.osis === osis), ...ae });
  buecher = [
    ...BOOKS.filter((x) => !['Mark', 'Jonah', 'Ps', 'Rev'].includes(x.osis)),
    b('Mark', { chapters: 200 }),                 // Kapitelzahl weicht vom Kanon ab
    b('Jonah', { era: 'gibtsnicht' }),            // Epoche unbekannt
    b('Ps', { testament: 'NT' }),                 // Testament passt nicht zur Nummer
    b('Rev', { de: '' }),                         // Name fehlt in einer Sprache
    b('Gen', { osis: 'Gen', num: 99 }),           // doppeltes Kürzel, und num daneben
  ];
}

const fehler = [];
const gesehen = new Set();
const EPOCHEN = new Set(ERAS.map((e) => e.id));

for (const b of buecher) {
  const wo = `${b.osis} („${b.de}")`;
  if (gesehen.has(b.osis)) fehler.push(`${wo}: OSIS-Kürzel kommt zweimal vor.`);
  gesehen.add(b.osis);

  if (!b.de?.trim() || !b.en?.trim()) fehler.push(`${wo}: Name fehlt in einer Sprache.`);
  if (!EPOCHEN.has(b.era)) fehler.push(`${wo}: Epoche „${b.era}" steht nicht in eras.ts.`);

  const soll = KANON[b.osis];
  if (soll === undefined) fehler.push(`${wo}: kein Buch des protestantischen Kanons – oder das Kürzel ist ein Tippfehler.`);
  else if (b.chapters !== soll) {
    fehler.push(`${wo}: ${b.chapters} Kapitel, der Kanon hat ${soll}. parseRef klemmt daran, check:passages misst daran.`);
  }

  const erwartet = b.num >= ERSTES_NT ? 'NT' : 'AT';
  if (b.testament !== erwartet) fehler.push(`${wo}: testament „${b.testament}", aber Nummer ${b.num} liegt im ${erwartet}.`);
}

if (!gegenprobe) {
  const fehlen = Object.keys(KANON).filter((o) => !BOOKS.some((b) => b.osis === o));
  if (fehlen.length) fehler.push(`${fehlen.length} Bücher des Kanons fehlen: ${fehlen.join(', ')}`);
  const daneben = BOOKS.filter((b, i) => b.num !== i + 1);
  if (daneben.length) fehler.push(`Nummerierung nicht 1–${BOOKS.length} in Folge: ${daneben.map((b) => `${b.osis}=${b.num}`).join(', ')}`);
}

if (gegenprobe) {
  const ERWARTET = [
    ['Mark', /der Kanon hat 16/],
    ['Jonah', /steht nicht in eras\.ts/],
    ['Ps', /liegt im AT/],
    ['Rev', /Name fehlt in einer Sprache/],
    ['Gen', /kommt zweimal vor/],
  ];
  let gut = 0;
  for (const [osis, muster] of ERWARTET) {
    const meine = fehler.filter((f) => f.startsWith(osis + ' '));
    if (meine.some((f) => muster.test(f))) gut++;
    else console.log(`  ✗ ${osis}: ${meine.length ? 'gemeldet, aber falsch: ' + meine.join(' / ') : 'gar nicht gemeldet'}`);
  }
  console.log(`Gegenprobe: ${gut} von ${ERWARTET.length} Proben mit der erwarteten Meldung.`);
  console.log(gut === ERWARTET.length ? '✓ Die Prüfung schlägt bei jedem eingebauten Fehler an – und aus dem richtigen Grund.' : '✗ Mindestens eine Probe belegt nicht, was sie soll.');
  process.exit(gut === ERWARTET.length ? 0 : 1);
}

if (fehler.length) {
  console.error(`✗ ${fehler.length} Beanstandung${fehler.length === 1 ? '' : 'en'}:\n`);
  for (const f of fehler) console.error('  · ' + f);
  process.exit(1);
}

const kapitel = BOOKS.reduce((n, b) => n + b.chapters, 0);
console.log(
  `✓ ${BOOKS.length} Bücher, ${kapitel} Kapitel: jede Kapitelzahl stimmt mit dem Kanon, ` +
    `Nummerierung lückenlos, Testament passt zur Nummer, jede Epoche bekannt.`,
);
