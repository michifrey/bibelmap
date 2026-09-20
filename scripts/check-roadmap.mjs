// Prüft den Fahrplan – vor allem die Zahlen, die darauf stehen.
//
//   node --experimental-strip-types --import ./scripts/lib/ts-loader.mjs scripts/check-roadmap.mjs
//   npm run check:roadmap
//   npm run check:roadmap -- --gegenprobe
//
// **Der Anlass steht in der Datei selbst.** `roadmap.ts` verspricht im
// Kopfkommentar: „Die geplanten Stationen stehen hier nur, wenn sie im
// Projekt nachweisbar offen sind – jede nennt ihre Zahl oder ihre Stelle in
// der PRD." Eine Zahl auf einer Seite, die niemand nachrechnet, ist aber
// keine Auskunft, sondern eine Behauptung mit Haltbarkeitsdatum. Beim ersten
// Lauf dieser Prüfung stand auf der Station „Aufgeräumt und nachgemessen"
// die Zahl **23 Prüfungen bei jedem Lauf**; es waren längst dreißig. Niemand
// hatte etwas falsch gemacht – die Zahl war nur einmal richtig gewesen.
//
// Geprüft wird deshalb, was sich **im Projekt** nachzählen lässt: die Zahl der
// Prüfungen aus `check-all.mjs`, die Orte mit Foto aus `places.json`, die
// Bücher mit Porträt aus `bookPortraits.ts`, die Ansichten mit einem Weg zur
// Quelle aus dem Quelltext. Wo eine Zahl von etwas abhängt, das hier nicht
// liegt, bleibt sie ungeprüft – und der Lauf sagt, wie viele das sind, statt
// so zu tun, als sei alles gedeckt.
//
// Dazu das Gerüst: Kennungen eindeutig, beide Sprachen gefüllt, jeder Status
// bekannt, **genau eine** Station „hier", und nichts Erledigtes hinter ihr.
// Die Strasse in `Roadmap.tsx` rechnet aus dieser Reihenfolge ihren Verlauf;
// eine erledigte Station hinter „hier" wäre kein Absturz, sondern eine
// Zeitreise.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { ROAD, NOT_PLANNED } = await import(path.join(ROOT, 'src/data/roadmap.ts'));
const { PORTRAITS } = await import(path.join(ROOT, 'src/data/bookPortraits.ts'));
const { BOOKS } = await import(path.join(ROOT, 'src/data/books.ts'));
const { FEASTS } = await import(path.join(ROOT, 'src/data/feasts.ts'));
const { FINDS } = await import(path.join(ROOT, 'src/data/finds.ts'));

const gegenprobe = process.argv.includes('--gegenprobe');

const lies = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');

/** „1.335" und „1,335" und „1335" sind dieselbe Zahl. */
const zahl = (s) => Number(String(s).replace(/[.,\s]/g, ''));

/* ------------------------------------------------------------ die Zähler */

/** Wie viele Prüfungen `npm run check` wirklich ausführt. */
function pruefungen() {
  return (lies('scripts/check-all.mjs').match(/^\s{2}\{ name: /gm) ?? []).length;
}

/** Orte mit Foto und Orte insgesamt. */
function orte() {
  const d = JSON.parse(lies('public/data/places.json'));
  return [d.places.filter((p) => p.img).length, d.places.length];
}

/** Ansichten, die einen Weg zur Quelle anbieten – und wie viele es gibt. */
function ansichten() {
  const dateien = [];
  const gehe = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) gehe(p);
      else if (/\.tsx$/.test(e.name)) dateien.push(p);
    }
  };
  gehe(path.join(ROOT, 'src/components'));
  // Die Komponente selbst zählt nicht mit – sie ist das Angebot, nicht die Seite.
  const mit = dateien.filter(
    (f) => !/ImproveLink\.tsx$/.test(f) && /<ImproveLink/.test(fs.readFileSync(f, 'utf8')),
  ).length;
  const modi = lies('src/components/Header.tsx').match(/export type Mode = ([^;]+);/)?.[1];
  return [mit, modi ? modi.split('|').length : 0];
}

/** Die Sprachen, die vollständig sind – aus dem Typ, an dem alles hängt. */
function sprachen() {
  const m = lies('src/i18n.ts').match(/export type Lang = ([^;]+);/);
  return m ? m[1].split('|').length : 0;
}

/**
 * Wie viele BibleProject-Adressen es gibt: eine je Buch, abzüglich der Bücher,
 * die dort zu einem Guide zusammengefasst sind (Samuel, Könige, Chronik).
 */
function bpAdressen() {
  const ausnahmen = JSON.parse(lies('src/data/bpGuides.json'));
  const eigene = BOOKS.filter((b) => !(b.osis in ausnahmen)).length;
  return eigene + new Set(Object.values(ausnahmen)).size;
}

/** Wie viele Wege zur Quelle eine Seite anbietet. */
function wegeZurQuelle() {
  return (lies('src/lib/improve.ts').match(/^export function \w+Url\(/gm) ?? []).length;
}

/**
 * Die Zahlen, die sich nachrechnen lassen, und wie.
 *
 * Wer eine Station mit einer Zahl einfügt, für die hier keine Regel steht,
 * bekommt keinen Fehler – nur meldet der Lauf sie als ungeprüft. Das ist die
 * ehrlichere Wahl: Nicht jede Zahl auf dieser Strasse liegt in diesem Ordner.
 */
const REGELN = {
  v01: () => String(orte()[1]),
  haus: () => String(pruefungen()),
  feste: () => String(FEASTS.length),
  regal: () => String(FINDS.length),
  bp: () => String(bpAdressen()),
  bilder: () => { const [mit, alle] = orte(); return `${mit}/${alle}`; },
  portraets: () => `${PORTRAITS.length}/${BOOKS.length}`,
  mehrportraets: () => `${PORTRAITS.length}/${BOOKS.length}`,
  quelle: () => String(wegeZurQuelle()),
  quelleueberall: () => { const [mit, alle] = ansichten(); return `${mit}/${alle}`; },
  sprachen: () => String(sprachen()),
};

const STATUS = new Set(['done', 'here', 'planned', 'goal']);

export function pruefe(strasse) {
  const funde = [];
  let geprueft = 0;
  const ungeprueft = [];
  const gesehen = new Set();

  for (const s of strasse) {
    const wo = `${s.id} („${s.title?.de ?? '?'}")`;
    if (gesehen.has(s.id)) funde.push(`${wo}: Kennung kommt zweimal vor.`);
    gesehen.add(s.id);

    for (const [feld, wert] of [
      ['tag.de', s.tag?.de], ['tag.en', s.tag?.en],
      ['title.de', s.title?.de], ['title.en', s.title?.en],
      ['body.de', s.body?.de], ['body.en', s.body?.en],
    ]) {
      if (!wert?.trim()) funde.push(`${wo}: ${feld} fehlt.`);
    }
    if (!STATUS.has(s.status)) funde.push(`${wo}: Status „${s.status}" kennt die Strasse nicht.`);

    if (!s.figure) continue;
    if (!s.figure.label?.de?.trim() || !s.figure.label?.en?.trim()) {
      funde.push(`${wo}: die Zahl hat keine Beschriftung in beiden Sprachen.`);
    }
    const regel = REGELN[s.id];
    if (!regel) {
      ungeprueft.push(s.id);
      continue;
    }
    const soll = regel();
    const ist = String(s.figure.value);
    // Verglichen wird als Zahl, damit „1.335" und „1335" dasselbe sind.
    const gleich =
      ist === soll ||
      (ist.split('/').length === soll.split('/').length &&
        ist.split('/').every((t, i) => zahl(t) === zahl(soll.split('/')[i])));
    if (!gleich) {
      funde.push(`${wo}: die Strasse sagt „${ist}", nachgezählt sind es „${soll}".`);
    } else geprueft++;
  }

  const hier = strasse.filter((s) => s.status === 'here');
  if (hier.length !== 1) funde.push(`Genau eine Station muss „hier" sein, es sind ${hier.length}.`);
  else {
    const i = strasse.indexOf(hier[0]);
    const spaet = strasse.slice(i + 1).filter((s) => s.status === 'done');
    if (spaet.length) funde.push(`Erledigt und trotzdem hinter „hier": ${spaet.map((s) => s.id).join(', ')}.`);
    const frueh = strasse.slice(0, i).filter((s) => s.status !== 'done');
    if (frueh.length) funde.push(`Vor „hier" und nicht erledigt: ${frueh.map((s) => s.id).join(', ')}.`);
  }

  return { funde, geprueft, ungeprueft };
}

const { funde, geprueft, ungeprueft } = pruefe(ROAD);

for (const n of NOT_PLANNED) {
  if (!n.de?.trim() || !n.en?.trim()) funde.push(`NOT_PLANNED/${n.id}: fehlt in einer Sprache.`);
}

if (gegenprobe) {
  const kopie = (id, aenderung) => ({ ...ROAD.find((s) => s.id === id), ...aenderung });
  const proben = [
    ['Zahl stehengeblieben', /nachgezählt sind es/, () =>
      pruefe(ROAD.map((s) => (s.id === 'haus' ? kopie('haus', { figure: { ...s.figure, value: '7' } }) : s)))],
    ['Zwei Stationen „hier"', /Genau eine Station/, () =>
      pruefe(ROAD.map((s) => (s.id === 'bilder' ? kopie('bilder', { status: 'here' }) : s)))],
    ['Erledigtes hinter „hier"', /hinter „hier"/, () =>
      pruefe(ROAD.map((s) => (s.id === 'bilder' ? kopie('bilder', { status: 'done' }) : s)))],
    ['Station ohne Text', /body\.en fehlt/, () =>
      pruefe(ROAD.map((s) => (s.id === 'heute' ? kopie('heute', { body: { de: 'da', en: '' } }) : s)))],
  ];
  let gut = 0;
  for (const [name, muster, lauf] of proben) {
    const meldungen = lauf().funde;
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

console.log(`Stationen:  ${ROAD.length}, dazu ${NOT_PLANNED.length} Abzweigungen, die bewusst nicht genommen werden`);
console.log(`Zahlen:     ${geprueft} nachgezählt${ungeprueft.length ? `, ${ungeprueft.length} ohne Regel (${ungeprueft.join(', ')})` : ''}`);
console.log(`Quellen:    check-all.mjs, places.json, bookPortraits.ts, improve.ts, Header.tsx, i18n.ts`);

if (funde.length) {
  console.error(`\n✗ ${funde.length} Beanstandung${funde.length === 1 ? '' : 'en'}:`);
  for (const f of funde) console.error('   · ' + f);
  process.exit(1);
}
console.log('\n✓ Jede Station steht zweisprachig da, die Reihenfolge stimmt – und jede nachrechenbare Zahl ist nachgerechnet.');
