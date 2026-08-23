// Prüft die gemeinsame Kurzformen-Liste `src/data/bookAliases.json`.
//
//   npm run check:aliases
//
// Die Liste wird von drei Seiten gelesen – Suche, Stammbaum-Referenzen und dem
// Medien-Build. Ein Tippfehler fällt dort nicht auf, er lässt eine Kurzform
// nur still ins Leere laufen. Diese Prüfung macht daraus einen Fehler:
//
//   - jedes Buchkürzel gibt es wirklich (OSIS aus books.ts),
//   - keine Kurzform zeigt auf zwei verschiedene Bücher,
//   - keine Kurzform ist kürzer als zwei Zeichen (der Medien-Scanner nimmt
//     solche nicht an),
//   - keine `typed`-Kurzform wiederholt nur den vollen Namen, den die Suche
//     ohnehin aus `books.ts` ableitet.
//
// Geprüft wird mit zwei Maßstäben, weil die beiden Seiten verschieden
// normalisieren: der Medien-Scanner behält Leerzeichen („1 Sam" ist dort etwas
// anderes als „1Sam"), die Suche wirft Punkte, Leerzeichen und Umlautzeichen
// weg. Was hier auffällt, muss unter beiden auffallen.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadBooks } from './lib/bibleref.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FILE = path.resolve(__dirname, '..', 'src', 'data', 'bookAliases.json');

/** So liest die Suche: ohne Punkte, Leerzeichen und Umlautzeichen. */
const uiNorm = (s) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[.\s]/g, '');

/** So liest der Medien-Scanner: Punkte weg, Leerzeichen bleiben. */
const textNorm = (s) => s.toLowerCase().replace(/\./g, '').replace(/\s+/g, ' ').trim();

const books = loadBooks();
const byOsis = new Map(books.map((b) => [b.osis, b]));
const table = JSON.parse(fs.readFileSync(FILE, 'utf8'));

const problems = [];
/** normalisierte Kurzform -> Buch, das sie belegt (je Maßstab einmal) */
const seenText = new Map();
const seenUi = new Map();

function claim(map, key, osis, where, alias) {
  const other = map.get(key);
  // Zwei Schreibweisen desselben Buches sind kein Streit, zwei Bücher schon.
  if (other && other !== osis) {
    problems.push(`${where}: „${alias}" gehört hier zu ${osis}, weiter oben zu ${other}`);
    return;
  }
  map.set(key, osis);
}

for (const [osis, entry] of Object.entries(table)) {
  const book = byOsis.get(osis);
  if (!book) {
    problems.push(`${osis}: kein Buch mit diesem OSIS-Kürzel`);
    continue;
  }
  const names = [...book.de.split(/[()]/), book.en, book.osis].map((s) => s.trim()).filter(Boolean);
  const derivedUi = new Set(names.map(uiNorm));

  for (const alias of entry.text ?? []) {
    const where = `${osis}/text`;
    if (uiNorm(alias).length < 2) {
      problems.push(`${where}: „${alias}" ist zu kurz`);
      continue;
    }
    claim(seenText, textNorm(alias), osis, where, alias);
    claim(seenUi, uiNorm(alias), osis, where, alias);
  }

  for (const alias of entry.typed ?? []) {
    const where = `${osis}/typed`;
    const key = uiNorm(alias);
    if (key.length < 2) {
      problems.push(`${where}: „${alias}" ist zu kurz`);
      continue;
    }
    if (derivedUi.has(key)) {
      problems.push(`${where}: „${alias}" ergibt sich schon aus dem Buchnamen`);
      continue;
    }
    claim(seenUi, key, osis, where, alias);
  }
}

const count = [...Object.values(table)].reduce(
  (n, e) => n + (e.text?.length ?? 0) + (e.typed?.length ?? 0),
  0,
);

// Eine Kurzform, die unter beiden Maßstäben auffällt, ist trotzdem ein Fehler.
const unique = [...new Set(problems)];
if (unique.length) {
  console.error(`${unique.length} Beanstandung(en) in bookAliases.json:`);
  for (const p of unique) console.error('  ·', p);
  process.exit(1);
}
console.log(`bookAliases.json: ${count} Kurzformen für ${Object.keys(table).length} Bücher, alles sauber.`);
