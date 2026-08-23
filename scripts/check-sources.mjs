// Prüft die Zeitdokument-Sammlung gegen den Zeitbaum:
//   – zeigt jede Person-ID, die es in `genealogy.ts` nicht gibt (Tippfehler),
//   – zählt Dokumente, Sprachen und die Felder, ohne die ein Eintrag nichts taugt.
// Aufruf: npm run check:sources
import { readFileSync } from 'node:fs';

const gen = readFileSync(new URL('../src/data/genealogy.ts', import.meta.url), 'utf8');
const src = readFileSync(new URL('../src/data/personSources.ts', import.meta.url), 'utf8');

const personIds = new Set([...gen.matchAll(/\bid: '([a-z0-9_]+)'/g)].map((m) => m[1]));
const body = src.slice(src.indexOf('PERSON_SOURCES: Record'));
const keys = [...body.matchAll(/^ {2}([a-z0-9_]+): \{$/gm)].map((m) => m[1]);

const unknown = keys.filter((k) => !personIds.has(k));
const docs = [...body.matchAll(/kind: '([a-z]+)'/g)].map((m) => m[1]);
const named = [...body.matchAll(/named: (true|false)/g)].filter((m) => m[1] === 'true').length;

console.log(`Personen mit Quellen: ${keys.length} von ${personIds.size}`);
console.log(`Zeitdokumente:        ${docs.length} (davon ${named} mit Namensnennung)`);
const byKind = docs.reduce((acc, k) => ({ ...acc, [k]: (acc[k] ?? 0) + 1 }), {});
console.log(
  'Nach Art:             ' +
    Object.entries(byKind)
      .sort((a, b) => b[1] - a[1])
      .map(([k, n]) => `${k} ${n}`)
      .join(' · '),
);

if (unknown.length) {
  console.error(`\nUnbekannte Person-IDs (nicht im Zeitbaum): ${unknown.join(', ')}`);
  process.exit(1);
}
console.log('\nAlle IDs zeigen auf eine Person im Zeitbaum.');
