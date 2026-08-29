// Schreibt die Zahlen, die die Startseite zeigt – und sonst nichts.
//
//   npm run counts     (läuft auch als prebuild, damit sie nie veralten)
//
// Die Startseite nennt die Zahl der Orte und je Epoche eine Zahl. Dafür lud
// sie bisher `places.json`: **1.365 kB**, das größte Einzelstück der ganzen
// App, größer als alles JavaScript zusammen – für zehn Zahlen, auf einer
// Seite, die keine Karte zeigt.
//
// Gerechnet wird mit `erasForPlace` aus `src/lib/places.ts`, nicht mit einer
// Nachbildung: Die Epoche eines Ortes hängt an den Büchern seiner Verse, und
// diese Regel darf es nur einmal geben.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { erasForPlace, expandPlaces } = await import(path.join(ROOT, 'src/lib/places.ts'));
const { ERAS } = await import(path.join(ROOT, 'src/data/eras.ts'));

const QUELLE = path.join(ROOT, 'public/data/places.json');
const ZIEL = path.join(ROOT, 'public/data/counts.json');

const roh = JSON.parse(fs.readFileSync(QUELLE, 'utf8'));
const places = expandPlaces(roh);

if (places.length < 1000) {
  console.error(`✗ Nur ${places.length} Orte in places.json – das sieht nach einer halben Datei aus.`);
  process.exit(1);
}

const eras = Object.fromEntries(ERAS.map((e) => [e.id, 0]));
for (const p of places) for (const id of erasForPlace(p)) eras[id] = (eras[id] ?? 0) + 1;

const out = { places: places.length, eras };

/*
 * Mit `--pruefen` wird nur verglichen, nicht geschrieben.
 *
 * `counts.json` liegt im Verzeichnis und wird ausgeliefert; wer `places.json`
 * neu baut und das Zählen vergisst, zeigt auf der Startseite eine Zahl, die
 * einmal gestimmt hat. Der prebuild rechnet sie ohnehin neu – diese Prüfung
 * fängt den Fall, dass die abgelegte Datei davon abweicht.
 */
if (process.argv.includes('--pruefen')) {
  const da = fs.existsSync(ZIEL) ? JSON.parse(fs.readFileSync(ZIEL, 'utf8')) : null;
  if (!da) {
    console.error('✗ counts.json fehlt – `npm run counts` baut sie.');
    process.exit(1);
  }
  const gleich = JSON.stringify(da) === JSON.stringify(out);
  if (!gleich) {
    console.error('✗ counts.json weicht von places.json ab.');
    console.error('   abgelegt:  ' + JSON.stringify(da));
    console.error('   gerechnet: ' + JSON.stringify(out));
    process.exit(1);
  }
  console.log(`counts.json stimmt mit places.json überein: ${out.places} Orte, ${Object.keys(eras).length} Epochen.`);
  process.exit(0);
}

fs.writeFileSync(ZIEL, JSON.stringify(out));
const alt = fs.statSync(QUELLE).size;
const neu = fs.statSync(ZIEL).size;
console.log(
  `counts.json: ${places.length} Orte, ${Object.keys(eras).length} Epochen – ${neu} Bytes statt ${(alt / 1024).toFixed(0)} kB.`,
);
console.log('  ' + ERAS.map((e) => `${e.id} ${eras[e.id]}`).join(' · '));
