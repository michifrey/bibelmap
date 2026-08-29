// Macht `places.json` halb so groß, ohne ein Byte Information zu verlieren.
//
//   npm run data:compact          schreiben
//   npm run data:compact -- --pruefen   nur vergleichen
//
// In der Datei stand je Vers ein Objekt mit sieben Feldern:
//
//     {"osis":"Josh.10.1","ref":"Josh 10:1","book":"Josh","bookNum":6,
//      "chapter":10,"verse":1,"sort":"06010001"}
//
// Sechs davon folgen aus dem ersten. 8.707 solcher Objekte waren **921 kB** –
// zwei Drittel der Datei – für Information, die schon dasteht. Übrig bleibt
// `"Josh.10.1"` und oben eine Tabelle der Bücher (1,1 kB).
//
// Zurückgerechnet wird mit `expandPlaces` aus `src/lib/places.ts` – derselben
// Funktion, die auch die App benutzt. Eine zweite Implementierung hier hätte
// genau einen Zweck: irgendwann von der ersten abzuweichen.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { expandPlaces } = await import(path.join(ROOT, 'src/lib/places.ts'));
const DATEI = path.join(ROOT, 'public/data/places.json');
const pruefen = process.argv.includes('--pruefen');

const roh = JSON.parse(fs.readFileSync(DATEI, 'utf8'));
const orte = expandPlaces(roh);

if (orte.length < 1000) {
  console.error(`✗ Nur ${orte.length} Orte – das sieht nach einer halben Datei aus.`);
  process.exit(1);
}

/** Anzeigekürzel und Kanonnummer je OSIS-Buch, aus den Versen selbst. */
const books = {};
for (const p of orte) {
  for (const v of p.verses) {
    const anzeige = v.ref.slice(0, v.ref.lastIndexOf(' '));
    const da = books[v.book];
    if (da && (da[0] !== anzeige || da[1] !== v.bookNum)) {
      console.error(`✗ Buch ${v.book} tritt mit zwei Kürzeln auf: ${da[0]}/${da[1]} und ${anzeige}/${v.bookNum}`);
      process.exit(1);
    }
    books[v.book] = [anzeige, v.bookNum];
  }
}

const kompakt = {
  books,
  places: orte.map((p) => ({ ...p, verses: p.verses.map((v) => v.osis) })),
};

/*
 * Der Beweis, dass nichts verloren geht: zurückrechnen und Zeichen für
 * Zeichen vergleichen. Ohne das wäre die Ersparnis eine Behauptung.
 */
const zurueck = expandPlaces(JSON.parse(JSON.stringify(kompakt)));
const a = JSON.stringify(orte);
const b = JSON.stringify(zurueck);
if (a !== b) {
  console.error('✗ Die Rückrechnung ergibt nicht dasselbe – nicht geschrieben.');
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    if (a[i] !== b[i]) {
      console.error('   ab Zeichen ' + i + ':');
      console.error('   war:  ' + a.slice(i - 60, i + 90));
      console.error('   wird: ' + b.slice(i - 60, i + 90));
      break;
    }
  }
  process.exit(1);
}

const neu = JSON.stringify(kompakt);
const alt = fs.statSync(DATEI).size;

if (pruefen) {
  const schonKompakt = !Array.isArray(roh) && Array.isArray(roh.places);
  if (!schonKompakt) {
    console.error('✗ places.json steht noch in der langen Form – `npm run data:compact` schreibt sie kurz.');
    process.exit(1);
  }
  if (JSON.stringify(roh) !== neu) {
    console.error('✗ places.json weicht von der kompakten Form ab (Bücher-Tabelle oder Reihenfolge).');
    process.exit(1);
  }
  console.log(
    `places.json ist kompakt und verlustfrei: ${orte.length} Orte, ${orte.reduce((n, p) => n + p.verses.length, 0)} Verse, ${Object.keys(books).length} Bücher.`,
  );
  process.exit(0);
}

fs.writeFileSync(DATEI, neu);
console.log(
  `places.json: ${(alt / 1024).toFixed(0)} kB → ${(neu.length / 1024).toFixed(0)} kB ` +
    `(${orte.reduce((n, p) => n + p.verses.length, 0)} Verse, ${Object.keys(books).length} Bücher, Rückrechnung Zeichen für Zeichen geprüft).`,
);
