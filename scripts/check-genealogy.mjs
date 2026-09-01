// Prüft den Zeitbaum: 240 Personen, ein Elternverweis je Person.
//
//   node --experimental-strip-types --import ./scripts/lib/ts-loader.mjs scripts/check-genealogy.mjs
//   npm run check:genealogy
//   npm run check:genealogy -- --gegenprobe
//
// **Der Fehler, der diese Prüfung ausgelöst hat.** Drei Könige trugen in
// `born` ihren *Regierungsantritt* statt ihres Geburtsjahrs – Jotam, Ahas und
// Hiskia. Sichtbar wurde das erst weiter unten im Baum: Hiskia (born -715)
// bekam seinen Sohn Manasse (born -709) mit sechs Jahren, und Jotam wurde mit
// zwei König. Nichts stürzte ab; die Karte zeichnete das brav.
//
// Zwei Regeln fangen genau diese Klasse:
//
//   * **Alter beim Antritt.** Steht neben `born` ein `reignDe`, ist die erste
//     Jahreszahl darin der Antritt; die Differenz ist das Alter. Unter fünf
//     ist es kein Rundungsfehler, sondern ein vertauschtes Feld. Die
//     jüngsten Könige Judas waren sieben und acht (Joasch, Joschija) – die
//     Schwelle lässt sie durch und fängt die Null.
//   * **Abstand der Generationen.** Zwischen Elternteil und Kind der
//     Blutlinie liegen heute mindestens 13 Jahre (Jojakim). Zehn lässt Luft
//     und fängt die sechs von vorher.
//
// **Nicht geprüft wird die Geburtsfolge der Glaubenszeugen.** Bei den 44
// Personen mit `faith` ist `parent` kein Abstammungs-, sondern ein
// Nachfolgeverweis: Athanasius hängt unter Irenäus, Polykarp unter Paulus.
// Dass Gregor von Nazianz (329) unter Basilius (330) steht, ist deshalb kein
// Fehler, sondern eine Setzung.
//
// **Nicht geprüft werden die Bibelstellen.** `bibleRefUrl` baut daraus eine
// Suchadresse für Bible.com, kein aufgelöstes Ziel – „Gen 10:6,13" ist als
// Suchbegriff richtig, auch wenn `parseRef` daran scheitert. Und 40 Personen
// haben gar keine Stelle: Polykarp steht in keinem Vers.

import { GENEALOGY, GEN_EPOCHS, PERSON_BY_ID } from '../src/data/genealogy.ts';

/** Jünger als das wird niemand König – darunter ist ein vertauschtes Feld. */
const MIN_ANTRITTSALTER = 5;
/** Kleinster Abstand zweier Generationen der Blutlinie. Heute: 13. */
const MIN_GENERATION = 10;

const gegenprobe = process.argv.includes('--gegenprobe');

let daten = GENEALOGY;
if (gegenprobe) {
  const k = (id, ae) => ({ ...GENEALOGY.find((x) => x.id === id), ...ae });
  daten = [
    ...GENEALOGY,
    k('hiskia', { id: 'gp1', born: -715 }),                       // Antritt statt Geburt (der echte Fehler)
    k('manasse_k', { id: 'gp2', parent: 'gibtsnicht' }),          // Elternteil ins Leere
    // hiskia (der Elternteil) ist auf -740 gesetzt; die beiden Proben nehmen
    // die Generationenregel an beiden Enden: einmal davor, einmal zu dicht.
    k('manasse_k', { id: 'gp3', born: -750 }),                    // Kind vor dem Elternteil (Abstand -10)
    k('manasse_k', { id: 'gp4', born: -735 }),                    // Generation zu eng (Abstand 5)
    k('manasse_k', { id: 'gp5', epoch: 'gibtsnicht' }),           // Epoche unbekannt
    k('augustinus', { id: 'gp6', lon: undefined }),               // lat ohne lon
    k('manasse_k', {}),                                           // doppelte Kennung
  ];
}

const fehler = [];
const gesehen = new Set();
const EPOCHEN = new Set(GEN_EPOCHS.map((e) => e.id));
const NACH_ID = Object.fromEntries(daten.map((p) => [p.id, p]));

for (const p of daten) {
  const wo = `${p.id} („${p.de}")`;
  if (gesehen.has(p.id)) fehler.push(`${wo}: Kennung kommt zweimal vor.`);
  gesehen.add(p.id);

  if (!EPOCHEN.has(p.epoch)) fehler.push(`${wo}: Epoche „${p.epoch}" steht nicht in GEN_EPOCHS.`);
  if ((p.lat == null) !== (p.lon == null)) fehler.push(`${wo}: lat und lon müssen zusammen dastehen.`);
  if (p.city && p.lat == null) fehler.push(`${wo}: city „${p.city}" ohne Koordinate – der Kartenlink ginge ins Leere.`);
  if (!p.deText?.trim() || !p.enText?.trim()) fehler.push(`${wo}: Text fehlt in einer Sprache.`);

  const eltern = p.parent ? NACH_ID[p.parent] : null;
  if (p.parent && !eltern) {
    fehler.push(`${wo}: parent „${p.parent}" gibt es nicht – der Zweig hinge in der Luft.`);
    continue;
  }

  // Regierungsantritt: die erste Jahreszahl in reignDe.
  if (p.born != null && p.reignDe) {
    const jahre = [...p.reignDe.matchAll(/(\d{3,4})/g)].map((m) => Number(m[1]));
    if (jahre.length) {
      const alter = Math.abs(p.born) - jahre[0];
      if (alter < MIN_ANTRITTSALTER) {
        fehler.push(
          `${wo}: wäre mit ${alter} Jahren König geworden (born ${p.born}, „${p.reignDe}") – ` +
            `steht in born der Antritt statt der Geburt?`,
        );
      }
    }
  }

  // Generationenabstand – nur in der Blutlinie.
  if (eltern && !p.faith && !eltern.faith && p.born != null && eltern.born != null) {
    const abstand = p.born - eltern.born;
    if (abstand < MIN_GENERATION) {
      fehler.push(
        `${wo}: nur ${abstand} Jahre nach ${eltern.id} („${eltern.de}") geboren ` +
          `(${eltern.born} → ${p.born}); mindestens ${MIN_GENERATION} erwartet.`,
      );
    }
  }
}

// Genau eine Wurzel, und keine Schleife.
const wurzeln = daten.filter((p) => !p.parent);
if (wurzeln.length !== 1) fehler.push(`${wurzeln.length} Personen ohne Elternteil (erwartet: genau eine): ${wurzeln.map((p) => p.id).join(', ')}`);
for (const p of daten) {
  const weg = new Set();
  let q = p;
  while (q?.parent) {
    if (weg.has(q.id)) { fehler.push(`${p.id}: Schleife in der Abstammung.`); break; }
    weg.add(q.id);
    q = NACH_ID[q.parent];
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

const mitReign = GENEALOGY.filter((p) => p.born != null && p.reignDe).length;
const paare = GENEALOGY.filter((p) => !p.faith && p.parent && PERSON_BY_ID[p.parent] && !PERSON_BY_ID[p.parent].faith && p.born != null && PERSON_BY_ID[p.parent].born != null).length;
console.log(
  `✓ ${GENEALOGY.length} Personen: jeder Elternverweis trifft, keine Schleife, eine Wurzel, ` +
    `${mitReign} Regierungsantritte plausibel, ${paare} Generationenabstände ≥ ${MIN_GENERATION} Jahre.`,
);
