// Prüft die Heilsgeschichte gegen die Daten, an denen sie hängt.
//
//   npm run check:history
//
// Drei Angaben je Station sind Verweise auf etwas anderes, und alle drei
// scheitern still:
//
//   – `places` sind **englische** Namen, die zur Laufzeit gegen `places.json`
//     aufgelöst werden. Ein Tippfehler zeigt keine Fehlermeldung, sondern eine
//     Station ohne Orte. „Sinai" löst zum Beispiel nicht auf – der Berg heißt
//     in den Daten „Mount Sinai" –, und „Carmel" trifft den Karmel in Juda,
//     nicht den Berg des Elia.
//   – `era` färbt die Station und ordnet sie auf dem Zeitband ein.
//   – `ref` baut den Link zum Bibeltext. Beim Ausbau dieser Datei stand für
//     „1. Samuel 8–10" das Kürzel `2Sam`: der Link führte ins falsche Buch,
//     und im Text war davon nichts zu sehen.
//
// Dazu die Reihenfolge: die Stationen sollen chronologisch stehen, also dürfen
// die Epochen nicht zurückspringen.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { HISTORY } = await import(path.join(ROOT, 'src/data/history.ts'));
const { ERA_BY_ID } = await import(path.join(ROOT, 'src/data/eras.ts'));
const { BOOK_BY_OSIS } = await import(path.join(ROOT, 'src/data/books.ts'));
const { findPlacesByNames } = await import(path.join(ROOT, 'src/lib/places.ts'));
const roh = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/data/places.json'), 'utf8'));
const PLACES = Array.isArray(roh) ? roh : roh.places;

/** Untergrenze, unter der sich die Prüfung selbst für kaputt erklärt. */
const MIN_STATIONEN = 20;
const MIN_ORTE = 1000;

if (HISTORY.length < MIN_STATIONEN || PLACES.length < MIN_ORTE) {
  console.error(`✗ Zu wenig gefunden (${HISTORY.length} Stationen, ${PLACES.length} Orte).`);
  console.error('  Das ist kein bestandener Lauf, sondern eine Prüfung ohne Quelle.');
  process.exit(1);
}

/**
 * Steht das Kapitel, auf das der Link zeigt, auch im Label? Eine Spanne zählt:
 * „1. Mose 6–9" nennt Kapitel 7. Der erste Entwurf verlangte die exakte Zahl
 * und meldete vier Fehlalarme – eine Prüfung, die Richtiges anstreicht, wird
 * abgeschaltet und prüft dann gar nichts mehr.
 */
function kapitelGenannt(label, kapitel) {
  for (const m of label.matchAll(/(\d+)\s*[–-]\s*(\d+)/g)) {
    if (kapitel >= +m[1] && kapitel <= +m[2]) return true;
  }
  return new RegExp(`(^|[^0-9,])${kapitel}([^0-9]|$)`).test(label);
}

export function pruefe(stationen) {
  const funde = [];
  const ids = new Set();
  let letzteEpoche = 0;

  for (const m of stationen) {
    if (ids.has(m.id)) funde.push(`${m.id}: ID kommt doppelt vor`);
    ids.add(m.id);

    const gefunden = findPlacesByNames(PLACES, m.places);
    if (gefunden.length !== m.places.length) {
      const da = new Set(gefunden.map((p) => p.name.replace(/ \d+$/, '').toLowerCase()));
      const weg = m.places.filter((n) => !da.has(n.toLowerCase()));
      funde.push(`${m.id}: Ort löst nicht auf – ${weg.join(', ')}`);
    }

    const era = ERA_BY_ID[m.era];
    if (!era) funde.push(`${m.id}: Epoche „${m.era}" gibt es nicht`);
    else {
      if (era.order < letzteEpoche) funde.push(`${m.id}: Epoche springt zurück (${m.era})`);
      letzteEpoche = Math.max(letzteEpoche, era.order);
    }

    const buch = BOOK_BY_OSIS[m.ref.osis];
    if (!buch) funde.push(`${m.id}: Buchkürzel „${m.ref.osis}" gibt es nicht`);
    else {
      const name = buch.de.replace(/\s*\(.*\)$/, '');
      if (!m.ref.label.startsWith(name)) {
        funde.push(`${m.id}: Link zeigt auf ${name}, im Label steht „${m.ref.label}"`);
      } else if (!kapitelGenannt(m.ref.label, m.ref.chapter)) {
        funde.push(`${m.id}: Link zeigt auf Kapitel ${m.ref.chapter}, im Label steht „${m.ref.label}"`);
      }
    }

    for (const feld of [m.de?.title, m.de?.text, m.en?.title, m.en?.text]) {
      if (!feld?.trim()) funde.push(`${m.id}: leeres Textfeld`);
    }
  }
  return funde;
}

const funde = pruefe(HISTORY);

// Gegenprobe: eine Prüfung, die auf den echten Daten nichts findet, muss
// zeigen, dass sie überhaupt etwas finden kann.
const kaputt = HISTORY.map((m, i) =>
  i === 0
    ? { ...m, places: [...m.places, 'Ein Ort, den es nicht gibt'] }
    : i === 1
      ? { ...m, ref: { ...m.ref, osis: 'Rev' } }
      : m,
);
if (pruefe(kaputt).length < 2) {
  console.error('✗ Die Gegenprobe findet die absichtlich eingebauten Fehler nicht.');
  process.exit(1);
}

const orte = HISTORY.reduce((n, m) => n + m.places.length, 0);
const laengen = HISTORY.map((m) => m.de.text.length);
console.log(`Stationen:  ${HISTORY.length}`);
console.log(`Ortsnamen:  ${orte} – alle gegen places.json aufgelöst`);
console.log(
  `Text:       Ø ${Math.round(laengen.reduce((a, b) => a + b, 0) / laengen.length)} Zeichen (${Math.min(...laengen)}–${Math.max(...laengen)})`,
);

if (funde.length) {
  console.error(`\n✗ ${funde.length} Probleme:`);
  for (const f of funde.slice(0, 12)) console.error('   ' + f);
  process.exit(1);
}
console.log(
  `\n${HISTORY.length} Stationen: jeder Ort aufgelöst, jede Epoche vorhanden und in Reihenfolge, jeder Link auf dem Buch und Kapitel, das im Label steht.`,
);
