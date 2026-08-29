// Führt die Prüfungen aus, die ohne Netz auskommen – eine nach der anderen,
// mit einer Zusammenfassung am Ende.
//
//   npm run check
//
// Warum es das gibt: die Einzelprüfungen sind über Monate entstanden, und jede
// hat ihren Anlass. Aufgerufen hat sie danach niemand mehr. Ein Tippfehler in
// `bookAliases.json` oder eine Stammesgrenze, die einen biblisch benannten Ort
// verfehlt, fällt erst auf, wenn jemand zufällig hinsieht.
//
// Hier stehen nur die Prüfungen, die **von sich aus** dasselbe Ergebnis
// liefern. Was von fremden Servern abhängt (`check:bp`, `check:links`), bleibt
// draußen: ein Anbieter, der gerade nicht antwortet, darf keine
// Veröffentlichung aufhalten und keinen falschen Befund erzeugen. Dasselbe
// gilt für `check:gospel-links`, das die Video- und Podcastadressen der
// Jesus-Sektion abklopft.

import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const CHECKS = [
  { name: 'Buchkürzel', script: 'check-aliases.mjs' },
  { name: 'Zeitdokumente', script: 'check-sources.mjs', ts: true },
  { name: 'Stammesgrenzen', script: 'check-tribes.mjs', ts: true },
  { name: 'Farbkontraste', script: 'check-contrast.mjs' },
  { name: 'Jesus-Sektion', script: 'check-gospel.mjs', ts: true },
  { name: 'Israel-Karte', script: 'check-israel.mjs', ts: true },
  { name: 'Kirchengeschichte', script: 'check-church.mjs', ts: true },
  { name: 'Kachelquellen', script: 'check-tiles.mjs' },
  // Liest den echten Code statt einer Nachbildung und braucht dafür Node mit
  // TypeScript und den Auflöser aus scripts/lib.
  { name: 'Quizfragen', script: 'check-quiz.mjs', ts: true },
];

const results = [];
for (const check of CHECKS) {
  const args = check.ts
    ? ['--experimental-strip-types', '--import', './scripts/lib/ts-loader.mjs']
    : [];
  const r = spawnSync(process.execPath, [...args, path.join(ROOT, 'scripts', check.script)], {
    cwd: ROOT,
    encoding: 'utf8',
  });
  const ok = r.status === 0;
  results.push({ ...check, ok, status: r.status, out: `${r.stdout ?? ''}${r.stderr ?? ''}`.trim() });
  // Die letzte Zeile ist bei allen das Ergebnis in einem Satz.
  const last = (results.at(-1).out.split('\n').filter(Boolean).at(-1) ?? '').slice(0, 96);
  console.log(`${ok ? '✓' : '✗'} ${check.name.padEnd(16)} ${last}`);
}

const failed = results.filter((r) => !r.ok);
if (failed.length) {
  console.error(`\n${failed.length} von ${CHECKS.length} Prüfungen schlagen fehl:\n`);
  for (const f of failed) {
    console.error(`── ${f.name} (Exit ${f.status})`);
    console.error(f.out.replace(/^/gm, '   '));
    console.error('');
  }
  process.exit(1);
}
console.log(`\nAlle ${CHECKS.length} Prüfungen sauber.`);
console.log('Nicht dabei: check:bp, check:links und check:gospel-links – die brauchen Netz und fremde Server.');
