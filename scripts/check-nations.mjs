// Prüft die Völkertafel und die Stämme – 315 Knoten, 21 Ebenen tief.
//
//   node --experimental-strip-types --import ./scripts/lib/ts-loader.mjs scripts/check-nations.mjs
//   npm run check:nations
//   npm run check:nations -- --gegenprobe
//
// **Der Fehler, der diese Prüfung ausgelöst hat.** Der Knoten `seba` trug
// `place: 'Seba'`. Die Ortsdaten kennen kein Seba – die unscharfe Suche
// (`searchPlaces`, dieselbe, die auch die Oberfläche benutzt) landete
// deshalb auf „Sheba". In 1. Mose 10,7 und Psalm 72,10 sind Seba und Saba
// aber ausdrücklich zwei verschiedene. Wer im Baum auf Seba klickte, bekam
// eine Karte von Saba. Nichts stürzte ab; der Link führte nur woandershin.
//
// **Die Regel, die das fängt, ohne Fehlalarme zu erzeugen:** Der gefundene
// Ortsname muss den Suchbegriff **enthalten**. Das lässt die vier richtigen
// unscharfen Treffer durch – „Togarmah" → *Beth-togarmah*, „Seir" →
// *Mount Seir*, „Ephraim" → *Mount Ephraim*, „Zemaraim" → *Mount Zemaraim* –
// und beanstandet nur „Seba" → *Sheba*. Gemessen: 48 von 49 bestanden, ein
// Treffer, kein Fehlalarm. Eine strengere Regel (Name muss gleich sein)
// hätte vier Fehlalarme erzeugt und wäre in einer Woche abgeschaltet.
//
// **Nicht geprüft werden die Bibelstellen.** In `ref` steht die Fortsetzung
// hinter einem Mittelpunkt, im selben Buch: „1Chr 6:1 · 6:17". Wer auf „·"
// trennt und jede Hälfte für sich auflösen will, beanstandet acht gesunde
// Angaben. Angezeigt wird das Feld ohnehin als reiner Text.

import { GENEALOGY, NODE_BY_ID, LINES } from '../src/data/nationsTribes.ts';
import { searchPlaces, expandPlaces } from '../src/lib/places.ts';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const gegenprobe = process.argv.includes('--gegenprobe');
const orte = expandPlaces(JSON.parse(fs.readFileSync(path.join(ROOT, 'public/data/places.json'), 'utf8')));

/** Alle Knoten des Baums, flach. */
function flach(wurzel) {
  const out = [];
  (function geh(n) { out.push(n); for (const k of n.children ?? []) geh(k); })(wurzel);
  return out;
}

let knoten = flach(GENEALOGY);
if (gegenprobe) {
  // `cush` – nicht „kush": Ein Tippfehler hier baut alle Proben aus
  // `undefined` zusammen, und dann schlägt die Prüfung bei jeder an, weil
  // *jedes* Feld fehlt. Sechs bestandene Proben, die nichts belegen. Genau
  // das ist im ersten Anlauf passiert; deshalb prüft die Gegenprobe unten
  // nicht mehr, *ob* etwas anschlägt, sondern *was gemeldet wird*.
  const V = NODE_BY_ID['cush'];
  if (!V) { console.error('✗ Vorlage cush fehlt – die Gegenprobe wäre wertlos.'); process.exit(1); }
  const k = (ae) => ({ ...V, children: undefined, ...ae });
  knoten = [
    ...knoten,
    k({ id: 'gp1', place: 'Seba' }),                              // Ortsverweis führt woandershin
    k({ id: 'gp2', place: 'Gibtsdochgarnicht' }),                 // Ortsverweis findet nichts
    k({ id: 'gp3', line: 'gibtsnicht' }),                         // unbekannte Linie
    k({ id: 'gp4', en: '' }),                                     // Name fehlt in einer Sprache
    k({ id: 'gp5', people: { de: 'Kuschiter', en: '' } }),        // people nur einsprachig
    k({ id: 'gp6', ref: undefined }),                             // ohne Bibelstelle
    k({}),                                                        // doppelte Kennung (id bleibt cush)
  ];
}

const norm = (s) => s.toLowerCase().replace(/[^a-z]/g, '');
const LINIEN = new Set(LINES.map((l) => l.id));
const fehler = [];
const gesehen = new Set();

for (const n of knoten) {
  const wo = `${n.id} („${n.de}")`;
  if (gesehen.has(n.id)) fehler.push(`${wo}: Kennung kommt zweimal vor.`);
  gesehen.add(n.id);

  if (!n.de?.trim() || !n.en?.trim()) fehler.push(`${wo}: Name fehlt in einer Sprache.`);
  if (n.line && !LINIEN.has(n.line)) fehler.push(`${wo}: Linie „${n.line}" steht nicht in LINES.`);
  if (!n.ref?.trim()) fehler.push(`${wo}: keine Bibelstelle – jeder Knoten der Völkertafel steht in einem Vers.`);

  for (const [feld, b] of [['people', n.people], ['region', n.region], ['note', n.note]]) {
    if (b && (!b.de?.trim() || !b.en?.trim())) fehler.push(`${wo}: ${feld} steht nur in einer Sprache.`);
  }

  if (n.place) {
    const treffer = searchPlaces(orte, n.place, 1)[0];
    if (!treffer) {
      fehler.push(`${wo}: Ortsverweis „${n.place}" findet nichts – der Kartenlink bliebe leer.`);
    } else if (!norm(treffer.name).includes(norm(n.place))) {
      fehler.push(
        `${wo}: Ortsverweis „${n.place}" landet auf „${treffer.name}" – ein anderer Ort. ` +
          `Entweder heisst er in den Ortsdaten anders, oder es gibt ihn dort nicht (dann kein place).`,
      );
    }
  }
}

if (gegenprobe) {
  // Jede Probe muss *ihre* Meldung erzeugen – nicht irgendeine. Sonst
  // besteht eine Probe, die aus lauter fehlenden Feldern besteht, alles.
  const ERWARTET = [
    ['gp1', /landet auf „Sheba/],
    ['gp2', /findet nichts/],
    ['gp3', /Linie .* steht nicht in LINES/],
    ['gp4', /Name fehlt in einer Sprache/],
    ['gp5', /people steht nur in einer Sprache/],
    ['gp6', /keine Bibelstelle/],
  ];
  let gut = 0;
  for (const [id, muster] of ERWARTET) {
    const meine = fehler.filter((f) => f.startsWith(id + ' '));
    const passt = meine.some((f) => muster.test(f));
    if (passt) gut++;
    else console.log(`  ✗ ${id}: ${meine.length ? 'gemeldet, aber falsch: ' + meine.join(' / ') : 'gar nicht gemeldet'}`);
    // Eine Probe, die *mehr* meldet als die eine gemeinte, ist unsauber
    // gebaut – dann prüft sie nicht, was sie zu prüfen vorgibt.
    if (meine.length > 1) console.log(`  ⚠ ${id} meldet ${meine.length} Dinge: ${meine.join(' / ')}`);
  }
  const doppelt = fehler.some((f) => /Kennung kommt zweimal vor/.test(f));
  if (!doppelt) console.log('  ✗ doppelte Kennung nicht gemeldet');
  const alle = gut === ERWARTET.length && doppelt;
  console.log(`Gegenprobe: ${gut} von ${ERWARTET.length} Proben mit der erwarteten Meldung${doppelt ? ', doppelte Kennung ebenfalls' : ''}.`);
  console.log(alle ? '✓ Die Prüfung schlägt bei jedem eingebauten Fehler an – und aus dem richtigen Grund.' : '✗ Mindestens eine Probe belegt nicht, was sie soll.');
  process.exit(alle ? 0 : 1);
}

if (fehler.length) {
  console.error(`✗ ${fehler.length} Beanstandung${fehler.length === 1 ? '' : 'en'}:\n`);
  for (const f of fehler) console.error('  · ' + f);
  process.exit(1);
}

const mitOrt = knoten.filter((n) => n.place).length;
const tiefe = (function t(n, d = 0) { return Math.max(d, ...(n.children ?? []).map((k) => t(k, d + 1))); })(GENEALOGY);
console.log(
  `✓ ${knoten.length} Knoten über ${tiefe} Ebenen: jede Linie bekannt, jeder Name zweisprachig, ` +
    `jeder mit Bibelstelle, ${mitOrt} Ortsverweise treffen einen Ort, dessen Name den Begriff trägt.`,
);
