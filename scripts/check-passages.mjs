// Prüft die Schlüsselstellen des Referenzgraphen.
//
//   node --experimental-strip-types --import ./scripts/lib/ts-loader.mjs scripts/check-passages.mjs
//   npm run check:passages
//   npm run check:passages -- --gegenprobe
//
// Warum das nötig ist: In `passages.ts` steht die Bibelstelle **zweimal** –
// einmal als Text für Menschen (`ref: 'Mk 6'`) und einmal als OSIS-Kürzel für
// den Graphen (`book: 'Mark'`). Stimmen die beiden nicht überein, zeigt die
// Oberfläche „Markus 6" an und verlinkt in ein anderes Buch. Nichts stürzt ab,
// niemand merkt es – ausser dem, der nachschlägt.
//
// Genau dieser Fehler ist in dieser Datenbasis schon einmal passiert (§ 4.57:
// sechs falsche OSIS-Kürzel in `history.ts`, gefunden erst durch eine
// Prüfung). Deshalb löst diese Prüfung die Stelle mit demselben `parseRef`
// auf, das auch die Suche benutzt, und vergleicht das Ergebnis.
//
// Ausserdem: `parseRef` klemmt eine zu grosse Kapitelzahl stillschweigend auf
// die letzte Kapitelnummer des Buches – „Ps 200" wird zu Psalm 150. Für die
// Suche ist das freundlich, für eine Prüfung wäre es blind. Die Kapitelzahl
// wird deshalb selbst nachgerechnet.

import { PASSAGES } from '../src/data/passages.ts';
import { BOOKS } from '../src/data/books.ts';
import { parseRef } from '../src/lib/parseRef.ts';

/** So lang muss eine Erklärung mindestens sein, um eine zu sein. */
const MINDESTLAENGE = 160;

const gegenprobe = process.argv.includes('--gegenprobe');

const BUCH = new Map(BOOKS.map((b) => [b.osis, b]));
const fehler = [];
const meld = (s) => fehler.push(s);

/** „Mt 5-7" → „Mt 5", „Num 6:24-26" → „Num 6:24". Ranges sind erlaubt. */
const ersteStelle = (ref) => ref.replace(/\s*[–-]\s*\d+(?::\d+)?\s*$/, '').trim();
/** Die Kapitelzahl, wie sie dasteht – ungeklemmt. */
const rohesKapitel = (ref) => {
  const m = ersteStelle(ref).match(/(\d{1,3})(?:\s*[,:]\s*\d{1,3})?\s*$/);
  return m ? Number(m[1]) : null;
};

let daten = PASSAGES;
if (gegenprobe) {
  // Sieben Fehler, je einer pro Regel. Findet die Prüfung sie nicht alle,
  // prüft sie nicht, was sie zu prüfen vorgibt.
  const kopie = (p, aenderung) => ({ ...PASSAGES.find((x) => x.id === p), ...aenderung });
  daten = [
    ...PASSAGES,
    kopie('p_gen1', { id: 'gp1', book: 'Exod' }),                       // Kürzel passt nicht zur Stelle
    kopie('p_gen1', { id: 'gp2', book: 'Gibtsnicht' }),                 // Kürzel gibt es nicht
    kopie('p_gen1', { id: 'gp3', ref: 'Krumpelhausen 3' }),             // Stelle nicht auflösbar
    kopie('p_gen1', { id: 'gp4', ref: 'Gen 99' }),                      // Kapitel jenseits des Buches
    kopie('p_gen1', { id: 'gp5', textDe: 'Zu kurz.' }),                 // deutsche Erklärung zu dünn
    kopie('p_gen1', { id: 'gp6', textEn: 'Too short.' }),               // englische Erklärung zu dünn
    kopie('p_gen1', {}),                                // doppelte Kennung
  ];
}

const gesehen = new Set();
for (const p of daten) {
  const wo = `${p.id} („${p.de}", ${p.ref})`;

  if (gesehen.has(p.id)) meld(`${wo}: Kennung kommt zweimal vor.`);
  gesehen.add(p.id);

  const buch = BUCH.get(p.book);
  if (!buch) {
    meld(`${wo}: book „${p.book}" ist kein OSIS-Kürzel aus books.ts.`);
    continue;
  }

  const aufgeloest = parseRef(ersteStelle(p.ref), 'de');
  if (!aufgeloest) {
    meld(`${wo}: die Stelle lässt sich nicht auflösen – die Suche fände sie auch nicht.`);
  } else if (aufgeloest.osis !== p.book) {
    meld(`${wo}: die Stelle zeigt auf ${aufgeloest.osis} (${BUCH.get(aufgeloest.osis)?.de}), book sagt ${p.book} (${buch.de}).`);
  }

  const kap = rohesKapitel(p.ref);
  if (kap === null) meld(`${wo}: keine Kapitelzahl in der Stelle.`);
  else if (kap > buch.chapters) meld(`${wo}: Kapitel ${kap}, aber ${buch.de} hat nur ${buch.chapters}.`);

  for (const [feld, text] of [['textDe', p.textDe], ['textEn', p.textEn]]) {
    if ((text ?? '').length < MINDESTLAENGE) {
      meld(`${wo}: ${feld} hat ${(text ?? '').length} Zeichen, mindestens ${MINDESTLAENGE} erwartet.`);
    }
  }
}

// Abdeckung: Der Graph hängt die Stellen an die Buchknoten. Ein Buch ohne
// Stelle ist im Graphen ein Knoten, auf den zu klicken nichts bringt.
const abgedeckt = new Set(daten.map((p) => p.book));
const ohne = BOOKS.filter((b) => !abgedeckt.has(b.osis));
if (ohne.length) meld(`${ohne.length} von ${BOOKS.length} Büchern haben keine Stelle: ${ohne.map((b) => b.de).join(', ')}`);

if (gegenprobe) {
  const erwartet = ['gp1', 'gp2', 'gp3', 'gp4', 'gp5', 'gp6'];
  const getroffen = erwartet.filter((id) => fehler.some((f) => f.startsWith(id + ' ')));
  const doppelt = fehler.some((f) => /Kennung kommt zweimal vor/.test(f));
  console.log(`Gegenprobe: ${getroffen.length} von ${erwartet.length} eingebauten Fehlern gefunden${doppelt ? ', doppelte Kennung ebenfalls' : ', doppelte Kennung NICHT'}.`);
  for (const id of erwartet) if (!getroffen.includes(id)) console.log(`  ✗ ${id} durchgerutscht`);
  const vollstaendig = getroffen.length === erwartet.length && doppelt;
  console.log(vollstaendig ? '✓ Die Prüfung schlägt bei jedem eingebauten Fehler an.' : '✗ Die Prüfung ist blind für mindestens einen Fehler.');
  process.exit(vollstaendig ? 0 : 1);
}

if (fehler.length) {
  console.error(`✗ ${fehler.length} Beanstandung${fehler.length === 1 ? '' : 'en'}:\n`);
  for (const f of fehler) console.error('  · ' + f);
  process.exit(1);
}

const kurz = (t) => t.length;
const oeDe = Math.round(PASSAGES.reduce((a, p) => a + kurz(p.textDe), 0) / PASSAGES.length);
const oeEn = Math.round(PASSAGES.reduce((a, p) => a + kurz(p.textEn), 0) / PASSAGES.length);
console.log(
  `✓ ${PASSAGES.length} Stellen: jede Stelle löst auf ihr eigenes Buch auf, jedes Kapitel existiert, ` +
    `alle ${BOOKS.length} Bücher haben eine Stelle, Erklärungen Ø ${oeDe} (de) / ${oeEn} (en) Zeichen.`,
);
