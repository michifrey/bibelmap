// Prüft die Wege von einer Seite zu ihrer Quelle.
//
//   node --experimental-strip-types --import ./scripts/lib/ts-loader.mjs scripts/check-improve.mjs
//   npm run check:improve
//   npm run check:improve -- --gegenprobe
//
// **Der Anlass.** „Diese Seite verbessern" zeigt auf eine Datei im Projekt:
// `src/data/bookPortraits.ts`. Das ist eine Zeichenkette, und Zeichenketten
// überleben Umbenennungen nicht. Wird die Datei einmal geteilt oder
// verschoben, zeigt der Knopf auf eine 404 – und zwar lautlos, denn niemand
// klickt ihn beim Entwickeln. Gemerkt würde es der, dem man gerade angeboten
// hat, einen Fehler zu beheben; schlechter kann man ein Angebot nicht
// einlösen.
//
// Geprüft wird deshalb das Naheliegende und Vollständige: **Jeder Pfad in
// `SOURCES` liegt wirklich dort.** Dazu ein paar Dinge, die sich still
// verschieben könnten:
//
//   * Der Zweig, auf den die Links zeigen, ist der, der veröffentlicht wird.
//     `deploy.yml` baut `main`; zeigte `BRANCH` auf etwas anderes, führte
//     „Bearbeiten" an einem anderen Text vorbei als dem, den der Leser sieht.
//   * Die Projektadresse ist dieselbe wie überall sonst in der Oberfläche.
//     Sie steht an mehreren Stellen im Quelltext – das ist hinnehmbar, solange
//     sie übereinstimmen, und genau das wird hier nachgesehen.
//   * Jeder Schlüssel aus `SOURCES` wird auch benutzt. Ein Eintrag, den keine
//     Seite verwendet, ist kein Fehler im Betrieb, aber eine Behauptung ohne
//     Deckung – und er verrottet, weil ihn nichts anfasst.
//
// Was hier **nicht** geprüft wird: ob GitHub die Adresse beantwortet. Das
// täte `npm run check:urls`, und es täte es schlecht – die Adressen tragen
// keinen Platzhalter, aber sie sind aus Bausteinen zusammengesetzt, und eine
// Anfrage an den Editor von GitHub ist nichts, was man täglich hundertfach
// stellen sollte.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { SOURCES, REPO, BRANCH, editUrl, historyUrl, blameUrl, issueUrl } = await import(
  path.join(ROOT, 'src/lib/improve.ts')
);

const gegenprobe = process.argv.includes('--gegenprobe');

/** Der Zweig, den `deploy.yml` veröffentlicht – dort steht die Wahrheit. */
function zweigeAusDeploy() {
  const datei = path.join(ROOT, '.github/workflows/deploy.yml');
  if (!fs.existsSync(datei)) return null;
  const m = fs.readFileSync(datei, 'utf8').match(/branches:\s*\[([^\]]+)\]/);
  return m ? m[1].split(',').map((s) => s.trim()) : null;
}

/** Alle Stellen im Quelltext, die auf dieses Projekt bei GitHub zeigen. */
function adressenImQuelltext() {
  const out = new Set();
  const gehe = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) gehe(p);
      else if (/\.tsx?$/.test(e.name)) {
        for (const m of fs.readFileSync(p, 'utf8').matchAll(/https:\/\/github\.com\/[\w.-]+\/[\w.-]+/g)) {
          out.add(m[0]);
        }
      }
    }
  };
  gehe(path.join(ROOT, 'src'));
  return out;
}

export function pruefe(sources, repo, branch) {
  const funde = [];

  for (const [schluessel, datei] of Object.entries(sources)) {
    if (typeof datei !== 'string' || !datei.trim()) {
      funde.push(`SOURCES.${schluessel}: kein Pfad.`);
      continue;
    }
    if (datei.startsWith('/') || datei.includes('..')) {
      funde.push(`SOURCES.${schluessel}: „${datei}" ist kein Pfad im Projekt.`);
      continue;
    }
    if (!fs.existsSync(path.join(ROOT, datei))) {
      funde.push(`SOURCES.${schluessel}: „${datei}" gibt es nicht – „Bearbeiten" führt auf eine 404.`);
    }
  }

  // Wird jeder Schlüssel auch benutzt? Gesucht wird nach `source="…"`, so wie
  // die Komponente aufgerufen wird.
  const komponenten = [];
  const gehe = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) gehe(p);
      else if (/\.tsx$/.test(e.name)) komponenten.push(fs.readFileSync(p, 'utf8'));
    }
  };
  gehe(path.join(ROOT, 'src'));
  const benutzt = new Set();
  for (const quelle of komponenten) {
    for (const m of quelle.matchAll(/source="(\w+)"/g)) benutzt.add(m[1]);
  }
  for (const schluessel of Object.keys(sources)) {
    if (!benutzt.has(schluessel)) {
      funde.push(`SOURCES.${schluessel}: keine Seite benutzt diesen Eintrag.`);
    }
  }
  for (const s of benutzt) {
    if (!(s in sources)) funde.push(`Eine Seite verlangt source="${s}" – das steht nicht in SOURCES.`);
  }

  if (!repo?.startsWith('https://github.com/')) {
    funde.push(`REPO ist keine GitHub-Adresse: „${repo}".`);
  }
  const zweige = zweigeAusDeploy();
  if (zweige && !zweige.includes(branch)) {
    funde.push(`BRANCH ist „${branch}", veröffentlicht wird aber ${zweige.join(' / ')} – die Links zeigen auf einen anderen Text als den sichtbaren.`);
  }

  return funde;
}

const funde = pruefe(SOURCES, REPO, BRANCH);

// Die gebauten Adressen einmal ansehen: Sie müssen absolut sein und dürfen
// keinen Platzhalter mehr enthalten.
const beispiel = Object.values(SOURCES)[0];
for (const [name, url] of [
  ['editUrl', editUrl(beispiel)],
  ['historyUrl', historyUrl(beispiel)],
  ['blameUrl', blameUrl(beispiel)],
  ['issueUrl', issueUrl({ what: 'Probe', url: 'https://example.org/#buch=Gen', lang: 'de' })],
]) {
  if (!url.startsWith('https://github.com/')) funde.push(`${name}() baut keine GitHub-Adresse: ${url}`);
  if (/\{|\}/.test(url)) funde.push(`${name}() lässt einen Platzhalter stehen: ${url}`);
}
// Die Meldung muss die Adresse der Seite tragen – ohne sie ist sie eine Suchaufgabe.
if (!issueUrl({ what: 'Probe', url: 'https://example.org/#buch=Gen', lang: 'de' }).includes(encodeURIComponent('https://example.org/#buch=Gen'))) {
  funde.push('issueUrl(): die Adresse der Seite steht nicht im vorbereiteten Text.');
}

// Die Projektadresse steht an mehreren Stellen; sie müssen übereinstimmen.
const andere = [...adressenImQuelltext()].filter((u) => u.startsWith('https://github.com/michifrey/'));
for (const u of andere) {
  if (!u.startsWith(REPO)) funde.push(`Zwei Projektadressen im Quelltext: „${u}" gegen REPO „${REPO}".`);
}

if (gegenprobe) {
  const proben = [
    ['Datei umbenannt', /gibt es nicht/, () => pruefe({ portraits: 'src/data/gibtsnicht.ts' }, REPO, BRANCH)],
    ['Eintrag ohne Seite', /keine Seite benutzt/, () => pruefe({ ...SOURCES, waisenkind: 'README.md' }, REPO, BRANCH)],
    ['Falscher Zweig', /veröffentlicht wird aber/, () => pruefe(SOURCES, REPO, 'entwurf')],
    ['Fremde Projektadresse', /keine GitHub-Adresse/, () => pruefe(SOURCES, 'https://example.org/repo', BRANCH)],
  ];
  let gut = 0;
  for (const [name, muster, lauf] of proben) {
    const meldungen = lauf();
    if (meldungen.some((m) => muster.test(m))) gut++;
    else console.log(`  ✗ ${name}: ${meldungen.length ? 'gemeldet, aber falsch: ' + meldungen[0] : 'gar nicht gemeldet'}`);
  }
  console.log(`Gegenprobe: ${gut} von ${proben.length} Proben mit der erwarteten Meldung.`);
  console.log(
    gut === proben.length
      ? '✓ Die Prüfung schlägt bei jedem eingebauten Fehler an – und aus dem richtigen Grund.'
      : '✗ Mindestens eine Probe belegt nicht, was sie soll.',
  );
  process.exit(gut === proben.length ? 0 : 1);
}

console.log(`Quellen:    ${Object.keys(SOURCES).length} Dateien, alle vorhanden und alle von einer Seite benutzt`);
console.log(`Ziel:       ${REPO} (Zweig ${BRANCH}) – dieselbe Adresse wie überall sonst in der Oberfläche`);

if (funde.length) {
  console.error(`\n✗ ${funde.length} Beanstandung${funde.length === 1 ? '' : 'en'}:`);
  for (const f of funde) console.error('   · ' + f);
  process.exit(1);
}
console.log('\n✓ Jeder „Diese Seite verbessern"-Knopf zeigt auf eine Datei, die es gibt, im Zweig, der veröffentlicht wird.');
