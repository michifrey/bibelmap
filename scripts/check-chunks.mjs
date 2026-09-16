// Prüft, dass jedes nachgeladene Paket durch src/lib/chunks.ts geht.
//
//   node scripts/check-chunks.mjs
//   npm run check:chunks
//   npm run check:chunks -- --gegenprobe
//
// **Der Anlass.** Jede Ansicht trägt einen Hash im Dateinamen. Nach einer
// Veröffentlichung heisst sie anders, und die alte Datei ist weg; wer die
// Seite währenddessen offen hat, fragt beim Klick nach dem alten Namen und
// bekommt eine 404. Gemeldet wurde genau das:
//
//     TypeError: Failed to fetch dynamically imported module …/Imprint-Bl7-wnNg.js
//
// `lib/chunks.ts` fängt das ab – `lazyView` und `loadChunk` laden einmal neu,
// `prefetch` schluckt den Fehlschlag. Nur nützt das nichts, wenn die nächste
// Ansicht wieder mit einem blanken `lazy(() => import(…))` eingehängt wird.
// Das ist eine Zeile, die beim Schreiben völlig richtig aussieht, und der
// Fehler zeigt sich erst bei der übernächsten Veröffentlichung, bei einem
// Besucher, im Browser. Diese Prüfung ist die einzige Stelle, an der er
// vorher auffällt.
//
// **Zwei Sorten `import(…)`.** TypeScript benutzt dieselbe Schreibweise für
// Typen – `typeof import('./data/gospel')`, `import('./data/journeys').BibleJourney`.
// Die stehen nach dem Übersetzen gar nicht mehr da und laden nichts; sie
// werden übersprungen. Erkannt werden sie an dem, was davor und dahinter
// steht: ein `typeof`, oder ein Punkt und ein grosser Anfangsbuchstabe. Ein
// dynamischer Import in einer Form, die hier niemand benutzt, fiele darum als
// Befund auf – und das ist die richtige Richtung: lieber einmal nachsehen als
// eine Ansicht durchlassen.
//
// **Die Ausnahme.** Wer den Fehlschlag selbst behandelt und aus gutem Grund
// nicht neu laden will, schreibt `chunk-ok:` mit Begründung darüber. Die
// Suche ist so ein Fall: Neuladen würde die getippte Anfrage wegwerfen.
//
// Was sie **nicht** kann: Ein berechneter Import (`import(pfad)`) wäre ihr
// unsichtbar. Es gibt keinen – und gäbe es einen, müsste er ohnehin hier
// begründet werden.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'src');
const HEIMAT = path.join(SRC, 'lib/chunks.ts');
const gegenprobe = process.argv.includes('--gegenprobe');

function dateien(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...dateien(p));
    else if (/\.tsx?$/.test(e.name)) out.push(p);
  }
  return out;
}

if (!fs.existsSync(HEIMAT)) {
  console.error('✗ src/lib/chunks.ts fehlt – die Prüfung misst ins Leere.');
  process.exit(1);
}

const befunde = [];
let importe = 0;
let ansichten = 0;
let ausnahmen = 0;

for (const datei of dateien(SRC)) {
  const kurz = path.relative(ROOT, datei);
  let quelle = fs.readFileSync(datei, 'utf8');
  if (gegenprobe && kurz === 'src/App.tsx') {
    // Eine Ansicht wieder blank einhängen – die Prüfung muss das melden.
    quelle = quelle.replace("lazyView(() => import('./components/Imprint'))", "lazy(() => import('./components/Imprint'))");
  }
  // `lazy(` gehört niemandem ausser chunks.ts – dort steht es genau einmal.
  quelle.split('\n').forEach((zeile, i) => {
    if (/\blazy\s*\(/.test(zeile) && !/\blazyView\s*\(/.test(zeile) && datei !== HEIMAT) {
      befunde.push(`${kurz}:${i + 1}: blankes \`lazy(\` – gehört durch \`lazyView\` aus lib/chunks.ts`);
    }
  });

  if (datei === HEIMAT) continue;

  // Über die ganze Datei statt Zeile für Zeile: `import('./x')\n  .then(…)`
  // steht über zwei Zeilen, und der Anfang allein sagt nichts.
  for (const m of quelle.matchAll(/\bimport\(\s*'(\.[^']+)'\s*\)/g)) {
    const vor = quelle.slice(Math.max(0, m.index - 60), m.index);
    const nach = quelle.slice(m.index + m[0].length, m.index + m[0].length + 20);

    // Typ, kein Paket: verschwindet beim Übersetzen.
    if (/\btypeof\s*$/.test(vor) || /^\s*\.\s*[A-Z]/.test(nach)) continue;

    importe += 1;
    const nr = `${kurz}:${quelle.slice(0, m.index).split('\n').length}`;
    if (/\blazyView\s*\(\s*\(\)\s*=>\s*$/.test(vor)) {
      ansichten += 1;
    } else if (/\b(prefetch|loadChunk)\s*\(\s*\(\)\s*=>\s*$/.test(vor)) {
      // in Ordnung
    } else if (/chunk-ok:/.test(quelle.slice(Math.max(0, m.index - 400), m.index))) {
      ausnahmen += 1;
    } else {
      befunde.push(`${nr}: \`import('${m[1]}')\` ohne \`lazyView\`, \`loadChunk\`, \`prefetch\` oder \`chunk-ok:\``);
    }
  }
}

if (importe < 20) {
  console.error(`✗ Nur ${importe} dynamische Importe gefunden – das Muster passt nicht mehr auf den Quelltext.`);
  process.exit(1);
}

if (gegenprobe) {
  if (befunde.length) {
    console.log(`✓ Gegenprobe: das eingebaute \`lazy(\` wurde gemeldet.\n  ${befunde[0]}`);
    process.exit(0);
  }
  console.error('✗ Gegenprobe: das eingebaute `lazy(` blieb unbemerkt – die Prüfung greift nicht.');
  process.exit(1);
}

if (befunde.length) {
  console.error(`✗ ${befunde.length} Paket(e) ohne Rettung nach einer Veröffentlichung:`);
  for (const b of befunde) console.error(`  ${b}`);
  console.error('\n  Siehe src/lib/chunks.ts – dort steht, warum.');
  process.exit(1);
}

console.log(
  `✓ ${importe} dynamische Importe, alle durch lib/chunks.ts – ${ansichten} Ansichten mit Neuladen` +
    (ausnahmen ? `, ${ausnahmen} begründete Ausnahme(n).` : '.'),
);
