// Prüft die Zeitdokument-Sammlung gegen den Zeitbaum:
//   – zeigt jede Person-ID, die es in `genealogy.ts` nicht gibt (Tippfehler),
//   – zählt Dokumente, Arten und die Felder, ohne die ein Eintrag nichts taugt.
//
//   npm run check:sources
//
// Gelesen wird der echte Code, nicht der Quelltext als Zeichenkette. Vorher
// standen hier reguläre Ausdrücke – `\bid: '…'` für die Personen, `^ {2}foo: {`
// für die Einträge. Beide hängen an der Schreibweise: Wer `PERSON_SOURCES`
// anders einrückt oder die Personen anders notiert, bekommt keine Fehlermeldung,
// sondern eine leere Menge. Und gegen eine leere Menge stimmt jede Behauptung.
//
// Dagegen hilft zweierlei: importieren statt lesen (`scripts/lib/ts-loader.mjs`)
// und eine Untergrenze, unter der sich die Prüfung selbst für kaputt erklärt.

import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { GENEALOGY } = await import(path.join(ROOT, 'src/data/genealogy.ts'));
const { PERSON_SOURCES } = await import(path.join(ROOT, 'src/data/personSources.ts'));

/** Was mindestens da sein muss, damit die Prüfung überhaupt etwas prüft. */
const MIN_PERSONEN = 100;
const MIN_EINTRAEGE = 20;
const MIN_DOKUMENTE = 50;

const personIds = new Set(GENEALOGY.map((p) => p.id));
const keys = Object.keys(PERSON_SOURCES);
const docs = keys.flatMap((k) => PERSON_SOURCES[k].docs ?? []);

if (personIds.size < MIN_PERSONEN || keys.length < MIN_EINTRAEGE || docs.length < MIN_DOKUMENTE) {
  console.error(
    `✗ Zu wenig gefunden (${personIds.size} Personen, ${keys.length} Einträge, ${docs.length} Dokumente).`,
  );
  console.error('  Das ist kein bestandener Lauf, sondern eine Prüfung, die ihre Quelle verloren hat.');
  process.exit(1);
}

const unknown = keys.filter((k) => !personIds.has(k));
const named = docs.filter((d) => d.named).length;
// Felder, ohne die ein Eintrag nichts taugt – ein leerer Titel ist schlimmer
// als ein fehlender Eintrag, weil er im Baum als Karte auftaucht.
const luecken = [];
for (const k of keys) {
  for (const d of PERSON_SOURCES[k].docs ?? []) {
    for (const feld of ['kind', 'de', 'en', 'dateDe', 'dateEn', 'saysDe', 'saysEn']) {
      if (!d[feld]) luecken.push(`${k}: ${d.de || '(ohne Titel)'} – ${feld} fehlt`);
    }
    if (typeof d.named !== 'boolean') luecken.push(`${k}: ${d.de} – „named" fehlt`);
  }
}

console.log(`Personen mit Quellen: ${keys.length} von ${personIds.size}`);
console.log(`Zeitdokumente:        ${docs.length} (davon ${named} mit Namensnennung)`);
const byKind = docs.reduce((acc, d) => ({ ...acc, [d.kind]: (acc[d.kind] ?? 0) + 1 }), {});
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
if (luecken.length) {
  console.error(`\n${luecken.length} unvollständige Dokumente:`);
  for (const l of luecken.slice(0, 10)) console.error('   ' + l);
  process.exit(1);
}
console.log(`\n${keys.length} Einträge, ${docs.length} Dokumente – alle IDs zeigen auf eine Person im Zeitbaum.`);
