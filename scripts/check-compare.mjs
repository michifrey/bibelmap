// Prüft „Religionen im Vergleich".
//
//   node --experimental-strip-types --import ./scripts/lib/ts-loader.mjs scripts/check-compare.mjs
//   npm run check:compare
//   npm run check:compare -- --gegenprobe
//
// **Was hier geprüft wird – und was ausdrücklich nicht.**
//
// Geprüft wird, was brechen kann, ohne dass es jemand sieht:
//
//   * Die Ortsnamen in `places` werden über `findPlacesByNames` aufgelöst –
//     über den **Namen**, nicht über eine Kennung. Ein Name, der nichts
//     trifft, lässt die kleine Karte unter der Figur einfach verschwinden;
//     die Seite bleibt heil, das Bild fehlt. Genau so ist es nicht zu merken.
//   * Die Notiz ist der einzige Fließtext der Ansicht. Zu kurz heißt hier:
//     eine Überschrift statt einer Auskunft.
//   * Die Sure-Nummer muss es geben. Der Koran hat 114 Suren; alles darüber
//     ist ein Tippfehler, den niemand nachschlägt.
//
// **Nicht geprüft werden die Bibelstellen.** `RefCard` zeigt die Felder
// `tanakh` und `christian` als reinen Text an – kein Link, kein OSIS-Kürzel
// daneben. Der gefährliche Fehler aus `passages.ts` („zeigt Markus, verlinkt
// Matthäus") kann hier gar nicht auftreten. Ein Parser dafür müsste
// „1. Mose 12–25", „2.–5. Mose", „Matthäus–Johannes" und „ganzes NT"
// auseinanderhalten: 19 von 46 heutigen Angaben lösen sich nicht ohne
// Sonderregeln auf. Das wäre eine Prüfung, die sich an die Daten anschmiegt,
// statt Fehler zu fangen – und nach der dritten Ausnahme schaltet sie jemand ab.
//
// **Nicht geprüft wird der Inhalt der Koranstellen.** Ob Sure 12 tatsächlich
// von Yūsuf handelt, kann diese Prüfung nicht wissen: Die App führt keinen
// Korantext mit, und eine aus dem Gedächtnis getippte Verstabelle wäre eine
// erfundene Autorität, die schlimmer ist als keine. Geprüft wird deshalb nur,
// dass die Sure existiert.

import { COMPARE } from '../src/data/compare.ts';
import { findPlacesByNames, expandPlaces } from '../src/lib/places.ts';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MINDESTLAENGE = 160;
const SUREN = 114;

const gegenprobe = process.argv.includes('--gegenprobe');
const orte = expandPlaces(JSON.parse(fs.readFileSync(path.join(ROOT, 'public/data/places.json'), 'utf8')));

let daten = COMPARE;
if (gegenprobe) {
  const k = (id, ae) => ({ ...COMPARE.find((x) => x.id === id), ...ae });
  const adam = COMPARE.find((x) => x.id === 'adam');
  daten = [
    ...COMPARE,
    k('adam', { id: 'gp1', places: ['Gibtsdochgarnicht'] }),                       // Ortsname trifft nichts
    k('adam', { id: 'gp2', de: { ...adam.de, note: 'Zu kurz.' } }),                // deutsche Notiz zu dünn
    k('adam', { id: 'gp3', en: { ...adam.en, note: 'Too short.' } }),              // englische Notiz zu dünn
    k('adam', { id: 'gp4', refs: { ...adam.refs, quran: 'Sure 200:1' } }),         // Sure gibt es nicht
    k('adam', { id: 'gp5', refs: { ...adam.refs, christian: '' } }),               // Stellenfeld leer
    k('adam', { id: 'gp6', islamName: 'Adam' }),                                   // arabische Schreibung fehlt
    k('adam', {}),                                                                 // doppelte Kennung
  ];
}

const fehler = [];
const gesehen = new Set();
for (const f of daten) {
  const wo = `${f.id} („${f.de?.name}")`;
  if (gesehen.has(f.id)) fehler.push(`${wo}: Kennung kommt zweimal vor.`);
  gesehen.add(f.id);

  for (const [sprache, seite] of [['de', f.de], ['en', f.en]]) {
    if (!seite?.name) fehler.push(`${wo}: kein Name (${sprache}).`);
    if ((seite?.note ?? '').length < MINDESTLAENGE)
      fehler.push(`${wo}: Notiz (${sprache}) hat ${(seite?.note ?? '').length} Zeichen, mindestens ${MINDESTLAENGE} erwartet.`);
  }

  // Der islamische Name soll die arabische Schreibung mitführen – sie steht
  // in der Liste unter jedem Eintrag und ist der Grund, warum es das Feld gibt.
  if (!/[؀-ۿ]/.test(f.islamName ?? ''))
    fehler.push(`${wo}: islamName „${f.islamName}" ohne arabische Schreibung.`);

  for (const feld of ['tanakh', 'christian', 'quran']) {
    if (!(f.refs?.[feld] ?? '').trim()) fehler.push(`${wo}: refs.${feld} ist leer.`);
  }

  const suren = [...(f.refs?.quran ?? '').matchAll(/Sure\s+(\d{1,3})/g)].map((m) => Number(m[1]));
  if (!suren.length) fehler.push(`${wo}: refs.quran nennt keine Sure.`);
  for (const s of suren)
    if (s < 1 || s > SUREN) fehler.push(`${wo}: Sure ${s} – der Koran hat ${SUREN}.`);

  for (const name of f.places ?? []) {
    if (!findPlacesByNames(orte, [name]).length)
      fehler.push(`${wo}: Ortsname „${name}" trifft keinen Ort in places.json – die Karte bliebe leer.`);
  }
}

if (gegenprobe) {
  const erwartet = ['gp1', 'gp2', 'gp3', 'gp4', 'gp5', 'gp6'];
  const getroffen = erwartet.filter((id) => fehler.some((f) => f.startsWith(id + ' ')));
  const doppelt = fehler.some((f) => /Kennung kommt zweimal vor/.test(f));
  for (const id of erwartet) if (!getroffen.includes(id)) console.log(`  ✗ ${id} durchgerutscht`);
  const alle = getroffen.length === erwartet.length && doppelt;
  console.log(`Gegenprobe: ${getroffen.length} von ${erwartet.length} eingebauten Fehlern gefunden${doppelt ? ', doppelte Kennung ebenfalls' : ', doppelte Kennung NICHT'}.`);
  console.log(alle ? '✓ Die Prüfung schlägt bei jedem eingebauten Fehler an.' : '✗ Die Prüfung ist blind für mindestens einen Fehler.');
  process.exit(alle ? 0 : 1);
}

if (fehler.length) {
  console.error(`✗ ${fehler.length} Beanstandung${fehler.length === 1 ? '' : 'en'}:\n`);
  for (const f of fehler) console.error('  · ' + f);
  process.exit(1);
}

const orteGesamt = COMPARE.flatMap((f) => f.places ?? []).length;
const oeDe = Math.round(COMPARE.reduce((a, f) => a + f.de.note.length, 0) / COMPARE.length);
const oeEn = Math.round(COMPARE.reduce((a, f) => a + f.en.note.length, 0) / COMPARE.length);
console.log(
  `✓ ${COMPARE.length} Gestalten: ${orteGesamt} Ortsnamen alle aufgelöst, jede Sure existiert, ` +
    `jede mit arabischer Schreibung, Notizen Ø ${oeDe} (de) / ${oeEn} (en) Zeichen.`,
);
