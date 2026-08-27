// Prüft die Kirchengeschichte auf das, was sie über sich selbst behauptet.
//
//   npm run check:church
//
// Dieselbe Regel wie bei der Israel-Karte, und aus demselben Grund: Ein Modus,
// der Spaltungen erzählt – 451, 1054, 1517 –, redet über Dinge, bei denen jede
// Seite ihre eigene Fassung hat. Wer das zeigt, muss sagen, woher er es hat.
//
// Geprüft wird:
//   1. Jedes Ereignis nennt mindestens eine Quelle, und jede Kennung gibt es.
//   2. Keine Quelle steht unbenutzt herum (sonst wächst eine Liste, die nichts
//      belegt, und sieht nach Sorgfalt aus).
//   3. Die Ereignisse stehen in zeitlicher Reihenfolge – die Schiene zählt darauf.
//   4. Jedes Ereignis liegt im Zeitraum seiner Epoche, und jede Epoche trägt
//      welche. Ein leeres Band auf der Schiene wäre ein Loch in der Erzählung.
//   5. Jeder Verweis auf eine Person trifft eine, die der Zeitbaum führt – der
//      Sprung dorthin ist sonst eine Sackgasse.
//   6. Beide Sprachen sind gefüllt, und im englischen Feld steht kein Deutsch.
//   7. Koordinaten liegen auf der Erde und nicht bei null.
//
// Kein Netz: geprüft wird die eigene Datei, nicht die fremden Server hinter den
// Adressen. Ob eine URL noch antwortet, sagt `npm run check:links`.

import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { EVENTS, SOURCES, SOURCE_BY_ID, CHURCH_ERAS, CHURCH_ERA_BY_ID } = await import(
  path.join(ROOT, 'src/data/churchHistory.ts')
);
const { GENEALOGY } = await import(path.join(ROOT, 'src/data/genealogy.ts'));
const { COUNCILS } = await import(path.join(ROOT, 'src/data/church.ts'));

const fehler = [];
const warn = (m) => fehler.push(m);

/* --- 1./2. Belege ------------------------------------------------------- */
const benutzt = new Set();
for (const e of EVENTS) {
  if (!e.sources?.length) warn(`${e.id}: keine Quelle`);
  for (const s of e.sources ?? []) {
    if (!SOURCE_BY_ID[s]) warn(`${e.id}: Quelle „${s}" gibt es nicht`);
    else benutzt.add(s);
  }
}
for (const s of SOURCES) {
  if (!benutzt.has(s.id)) warn(`Quelle „${s.id}" (${s.label}) belegt kein einziges Ereignis`);
}

/* --- 3. Reihenfolge ------------------------------------------------------ */
for (let i = 1; i < EVENTS.length; i++) {
  if (EVENTS[i].year < EVENTS[i - 1].year) {
    warn(`${EVENTS[i].id} (${EVENTS[i].year}) steht nach ${EVENTS[i - 1].id} (${EVENTS[i - 1].year})`);
  }
}

const gesehen = new Set();
for (const e of EVENTS) {
  if (gesehen.has(e.id)) warn(`Kennung „${e.id}" kommt zweimal vor`);
  gesehen.add(e.id);
}

/* --- 4. Epochen ---------------------------------------------------------- */
for (const e of EVENTS) {
  const era = CHURCH_ERA_BY_ID[e.era];
  if (!era) { warn(`${e.id}: Epoche „${e.era}" gibt es nicht`); continue; }
  if (e.year < era.from || e.year > era.to) {
    warn(`${e.id}: Jahr ${e.year} liegt außerhalb von „${e.era}" (${era.from}–${era.to})`);
  }
}
for (const era of CHURCH_ERAS) {
  const n = EVENTS.filter((e) => e.era === era.id).length;
  if (n === 0) warn(`Epoche „${era.id}" trägt kein Ereignis – ein leeres Band auf der Schiene`);
}
// Die Bänder müssen lückenlos aneinanderstoßen, sonst fällt ein Jahr durch.
for (let i = 1; i < CHURCH_ERAS.length; i++) {
  if (CHURCH_ERAS[i].from !== CHURCH_ERAS[i - 1].to) {
    warn(`Lücke auf der Schiene: „${CHURCH_ERAS[i - 1].id}" endet ${CHURCH_ERAS[i - 1].to}, „${CHURCH_ERAS[i].id}" beginnt ${CHURCH_ERAS[i].from}`);
  }
}

/* --- 5. Sprünge in den Zeitbaum ------------------------------------------ */
const personen = new Set(GENEALOGY.map((p) => p.id));
for (const e of EVENTS) {
  if (e.personId && !personen.has(e.personId)) {
    warn(`${e.id}: verweist auf Person „${e.personId}", die der Zeitbaum nicht führt`);
  }
}

/* --- 6. Zweisprachig ----------------------------------------------------- */
const UMLAUT = /[äöüßÄÖÜ]/;
// Wörter, die im Englischen nichts zu suchen haben. „die" und „is" sind in
// beiden Sprachen Wörter – die stehen bewusst nicht drin.
const DEUTSCH = /\b(und|nicht|wird|werden|dass|aber|auch|sich|einer|eine[nmr]?|dem|den|des|vom|zum|zur)\b/;
for (const e of EVENTS) {
  for (const [feld, wert] of [['text', e.text], ['when', e.when], ['place', e.place]]) {
    if (!wert) continue;
    if (!wert.de?.trim()) warn(`${e.id}: ${feld}.de ist leer`);
    if (!wert.en?.trim()) warn(`${e.id}: ${feld}.en ist leer`);
    // Nur Fließtext. Ortsnamen behalten ihre Zeichen auch auf Englisch –
    // Kadıköy und Osnabrück schreiben sich nicht um, und eine Prüfung, die
    // Eigennamen anmeckert, erzieht dazu, sie falsch zu schreiben.
    if (feld !== 'place') {
      if (wert.en && UMLAUT.test(wert.en)) warn(`${e.id}: ${feld}.en enthält Umlaute – vermutlich deutscher Text`);
      if (wert.en && DEUTSCH.test(wert.en)) warn(`${e.id}: ${feld}.en enthält deutsche Wörter`);
    }
  }
  if (!e.de?.trim() || !e.en?.trim()) warn(`${e.id}: Titel fehlt in einer Sprache`);
  if (e.text?.de && e.text.de === e.text.en) warn(`${e.id}: text.de und text.en sind gleich – eine Sprache fehlt`);
}

/* --- 7. Orte ------------------------------------------------------------- */
for (const e of EVENTS) {
  if (!e.at) continue;
  const [lat, lon] = e.at;
  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) warn(`${e.id}: Koordinate ${lat}/${lon} liegt nicht auf der Erde`);
  if (lat === 0 && lon === 0) warn(`${e.id}: Koordinate 0/0 – vermutlich vergessen`);
  if (!e.place) warn(`${e.id}: hat einen Ort auf der Karte, aber keinen Ortsnamen`);
}

/* --- Die Konzilien: wer zählt sie? --------------------------------------- */
/*
 * Sieben Konzilien erkennen Ost und West gemeinsam an, danach zählt jede Seite
 * für sich – Rom kommt auf einundzwanzig, die Orthodoxie bleibt bei sieben, und
 * die orientalischen Kirchen bei dreien. Wer das verschweigt und einfach „die
 * ökumenischen Konzilien" auflistet, hat unbemerkt eine Seite gewählt. Deshalb
 * trägt jedes Konzil, wer es anerkennt, und hier steht, dass es das tut.
 */
for (const c of COUNCILS) {
  if (!c.recognisedBy?.length) warn(`Konzil „${c.id}": niemand trägt ein, wer es anerkennt`);
  for (const r of c.recognisedBy ?? []) {
    if (!['west', 'east', 'orient'].includes(r)) warn(`Konzil „${c.id}": unbekannte Tradition „${r}"`);
  }
}
const gemeinsam = COUNCILS.filter((c) => ['west', 'east'].every((t) => c.recognisedBy?.includes(t)));
const letzteGemeinsam = gemeinsam.at(-1);
if (letzteGemeinsam?.id !== 'nicaea2') {
  warn(`Das letzte von Ost UND West anerkannte Konzil sollte Nicäa II sein, ist aber „${letzteGemeinsam?.id}"`);
}

/* --- Ergebnis ------------------------------------------------------------ */
if (fehler.length) {
  console.error(`${fehler.length} Befund${fehler.length === 1 ? '' : 'e'}:\n`);
  for (const f of fehler) console.error('  ✗ ' + f);
  console.error('');
  process.exit(1);
}

const mitOrt = EVENTS.filter((e) => e.at).length;
const mitPerson = EVENTS.filter((e) => e.personId).length;
console.log(
  `${EVENTS.length} Ereignisse über ${CHURCH_ERAS.length} Epochen, ${EVENTS[0].year}–${EVENTS.at(-1).year}: ` +
    `jedes belegt, ${mitOrt} auf der Karte, ${mitPerson} mit Sprung in den Zeitbaum. ` +
    `${COUNCILS.length} Konzilien, ${gemeinsam.length} davon von Ost und West gemeinsam.`,
);
