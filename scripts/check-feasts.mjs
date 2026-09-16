// Prüft die Feste Israels gegen das, woran sie hängen.
//
//   npm run check:feasts
//
// Fünf Angaben je Fest sind Verweise auf etwas anderes, und alle fünf
// scheitern still – man sieht keinen Fehler, nur ein falsches Bild:
//
//   – `month` und `day` setzen das Fest ins Rad. Ein Monat, den es nicht gibt,
//     wirft das Fest auf 0° – also auf den 1. Nisan, wo Pessach steht.
//   – `refs` bauen die Links zum Bibeltext, **zweisprachig**. Ein deutsches
//     Label über einem englischen Link fällt niemandem auf, der nur eine
//     Sprache liest.
//   – `places` sind englische Namen, die zur Laufzeit gegen `places.json`
//     aufgelöst werden. Ein Tippfehler zeigt keine Meldung, sondern ein Fest
//     ohne Orte – und damit ohne Bild, denn das Foto kommt vom ersten Ort.
//   – `symbol` ist der Rückfall, wenn kein Foto auflöst. Ein leerer Pfad ist
//     eine leere Scheibe.
//   – Die Reihenfolge: „weiter" blättert durch das Jahr. Steht ein Fest
//     falsch einsortiert, dreht das Rad rückwärts, ohne es zu sagen.
//
// Dazu die Geometrie aus `src/lib/feastWheel.ts`. Sie hat keine Oberfläche,
// an der man einen Vorzeichenfehler sähe – nur ein Rad, das schief aussieht.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const {
  FEASTS, MONTHS, RHYTHMS, YEAR_DAYS, MONTH_BY_ID, feastStart, feastOccurrences, monthStart,
  GREGORIAN_MONTHS, GREGORIAN_YEAR_DAYS, gregorianStart, gregorianOffsetDeg,
} = await import(path.join(ROOT, 'src/data/feasts.ts'));
const { arcPath, dayAngle, easeInOut, feastSpan, polar, shortestTurn } = await import(
  path.join(ROOT, 'src/lib/feastWheel.ts')
);
const { BOOK_BY_OSIS } = await import(path.join(ROOT, 'src/data/books.ts'));
const { expandPlaces, findPlacesByNames } = await import(path.join(ROOT, 'src/lib/places.ts'));
const roh = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/data/places.json'), 'utf8'));
const PLACES = expandPlaces(roh);

/** Untergrenzen, unter denen sich die Prüfung selbst für kaputt erklärt. */
const MIN_FESTE = 8;
const MIN_ORTE = 1000;

if (FEASTS.length < MIN_FESTE || MONTHS.length !== 12 || PLACES.length < MIN_ORTE) {
  console.error(
    `✗ Zu wenig gefunden (${FEASTS.length} Feste, ${MONTHS.length} Monate, ${PLACES.length} Orte).`,
  );
  console.error('  Das ist kein bestandener Lauf, sondern eine Prüfung ohne Quelle.');
  process.exit(1);
}

/**
 * Steht das Kapitel, auf das der Link zeigt, auch im Label? Dieselbe Rechnung
 * wie in `check-history.mjs`: Eine Spanne zählt mit, „3. Mose 23,23–25" nennt
 * Kapitel 23. Eine Prüfung, die Richtiges anstreicht, wird abgeschaltet.
 */
function kapitelGenannt(label, kapitel) {
  for (const m of label.matchAll(/(\d+)\s*[–-]\s*(\d+)/g)) {
    if (kapitel >= +m[1] && kapitel <= +m[2]) return true;
  }
  return new RegExp(`(^|[^0-9,])${kapitel}([^0-9]|$)`).test(label);
}

/** Buchname ohne die Klammer dahinter: „3. Mose (Levitikus)" → „3. Mose". */
function buchname(buch, sprache) {
  return buch[sprache].replace(/\s*\(.*\)$/, '');
}

function pruefeRefs(id, refs, funde) {
  for (const r of refs) {
    const buch = BOOK_BY_OSIS[r.osis];
    if (!buch) {
      funde.push(`${id}: Buchkürzel „${r.osis}" gibt es nicht`);
      continue;
    }
    if (r.chapter < 1 || r.chapter > buch.chapters) {
      funde.push(`${id}: ${buchname(buch, 'de')} hat kein Kapitel ${r.chapter}`);
    }
    for (const sprache of ['de', 'en']) {
      const label = r.label?.[sprache];
      if (!label?.trim()) {
        funde.push(`${id}: Label fehlt (${sprache})`);
        continue;
      }
      const name = buchname(buch, sprache);
      if (!label.startsWith(name)) {
        funde.push(`${id}: Link zeigt auf ${name}, im Label steht „${label}" (${sprache})`);
      } else if (!kapitelGenannt(label, r.chapter)) {
        funde.push(`${id}: Link zeigt auf Kapitel ${r.chapter}, im Label steht „${label}" (${sprache})`);
      }
    }
    if (!['command', 'story', 'nt'].includes(r.kind)) {
      funde.push(`${id}: unbekannte Art „${r.kind}"`);
    }
  }
}

export function pruefe(feste, monate = MONTHS, rhythmen = RHYTHMS) {
  const funde = [];

  /* --- Monate ----------------------------------------------------------- */
  const monatIds = new Set();
  let tage = 0;
  for (const m of monate) {
    if (monatIds.has(m.id)) funde.push(`Monat ${m.id}: ID kommt doppelt vor`);
    monatIds.add(m.id);
    if (m.days !== 29 && m.days !== 30) funde.push(`Monat ${m.id}: ${m.days} Tage – erwartet 29 oder 30`);
    tage += m.days;
    for (const feld of [m.de, m.en, m.hebrew, m.translit, m.gregorian?.de, m.gregorian?.en]) {
      if (!feld?.trim()) funde.push(`Monat ${m.id}: leeres Feld`);
    }
  }
  if (tage !== YEAR_DAYS) funde.push(`Die Monate ergeben ${tage} Tage, YEAR_DAYS sagt ${YEAR_DAYS}`);

  /* --- Feste ------------------------------------------------------------ */
  const ids = new Set();
  let letzterTag = -1;
  for (const f of feste) {
    if (ids.has(f.id)) funde.push(`${f.id}: ID kommt doppelt vor`);
    ids.add(f.id);

    const m = MONTH_BY_ID[f.month];
    if (!m) {
      funde.push(`${f.id}: Monat „${f.month}" gibt es nicht`);
    } else if (f.day < 1 || f.day > m.days) {
      funde.push(`${f.id}: Tag ${f.day} liegt außerhalb von ${m.de} (${m.days} Tage)`);
    }
    if (f.days < 1 || f.days > 8) funde.push(`${f.id}: Dauer ${f.days} – erwartet 1 bis 8 Tage`);

    const start = feastStart(f);
    if (start < letzterTag) funde.push(`${f.id}: steht nicht in der Reihenfolge des Jahres`);
    letzterTag = Math.max(letzterTag, start);
    if (start + f.days > YEAR_DAYS) funde.push(`${f.id}: reicht über das Jahresende hinaus`);

    if (!/^#[0-9a-f]{6}$/i.test(f.color ?? '')) funde.push(`${f.id}: Farbe „${f.color}" ist kein Sechserhex`);
    if (!/^M/.test(f.symbol ?? '')) funde.push(`${f.id}: Zeichen ist kein Pfad`);
    if (!['spring', 'autumn', 'later', 'fast', 'monthly'].includes(f.family)) {
      funde.push(`${f.id}: unbekannte Familie „${f.family}"`);
    }

    /*
     * Ein Fest, das jeden Monat kommt, muss auf dem ersten Tag liegen – sonst
     * ergäbe „an jedem Monatsanfang" keinen Sinn –, und es muss zwölfmal im
     * Rad stehen. Malte das Rad zwölf Striche, während die Daten einen Tag
     * meinen, wäre das nicht falsch zu sehen, sondern falsch zu lesen.
     */
    const begehungen = feastOccurrences(f);
    if (f.monthly) {
      if (f.day !== 1) funde.push(`${f.id}: kommt jeden Monat, liegt aber auf Tag ${f.day}`);
      if (begehungen.length !== monate.length) {
        funde.push(`${f.id}: ${begehungen.length} Begehungen statt ${monate.length}`);
      }
      const erwartet = monate.map((mm) => monthStart(mm.id));
      if (begehungen.some((tag, n) => tag !== erwartet[n])) {
        funde.push(`${f.id}: trifft nicht jeden Monatsanfang`);
      }
    } else if (begehungen.length !== 1 || begehungen[0] !== start) {
      funde.push(`${f.id}: mehr als eine Begehung, ohne monatlich zu sein`);
    }

    const gefunden = findPlacesByNames(PLACES, f.places);
    if (gefunden.length !== f.places.length) {
      const da = new Set(gefunden.map((p) => p.name.replace(/ \d+$/, '').toLowerCase()));
      const weg = f.places.filter((n) => !da.has(n.toLowerCase()));
      funde.push(`${f.id}: Ort löst nicht auf – ${weg.join(', ')}`);
    }
    if (!f.places.length) funde.push(`${f.id}: kein Ort – dann bleibt die Bildscheibe leer`);

    if (!f.refs?.length) funde.push(`${f.id}: keine Bibelstelle`);
    pruefeRefs(f.id, f.refs ?? [], funde);

    for (const sprache of ['de', 'en']) {
      const txt = f[sprache];
      for (const schluessel of ['name', 'when', 'count', 'what', 'today']) {
        if (!txt?.[schluessel]?.trim()) funde.push(`${f.id}: leeres Textfeld ${sprache}.${schluessel}`);
      }
    }
    if (!f.hebrew?.trim() || !f.translit?.trim()) funde.push(`${f.id}: hebräischer Name oder Umschrift fehlt`);
  }

  /* --- Rhythmen --------------------------------------------------------- */
  for (const r of rhythmen) {
    pruefeRefs(r.id, r.refs ?? [], funde);
    for (const sprache of ['de', 'en']) {
      for (const schluessel of ['name', 'every', 'text']) {
        if (!r[sprache]?.[schluessel]?.trim()) funde.push(`${r.id}: leeres Textfeld ${sprache}.${schluessel}`);
      }
    }
  }

  return funde;
}

const funde = pruefe(FEASTS);

/* --- Die Geometrie ------------------------------------------------------- */

const geo = [];
{
  const oben = polar(0, 100);
  if (Math.abs(oben.x) > 1e-6 || Math.abs(oben.y + 100) > 1e-6) {
    geo.push(`polar(0) liegt bei ${oben.x.toFixed(2)}/${oben.y.toFixed(2)}, erwartet 0/-100 (oben)`);
  }
  const rechts = polar(90, 100);
  if (Math.abs(rechts.x - 100) > 1e-6 || Math.abs(rechts.y) > 1e-6) {
    geo.push(`polar(90) liegt nicht rechts – das Rad liefe rückwärts`);
  }
  if (Math.abs(dayAngle(YEAR_DAYS, YEAR_DAYS) - 360) > 1e-9) geo.push('Ein volles Jahr ergibt keine volle Umdrehung');
  if (easeInOut(0) !== 0 || easeInOut(1) !== 1) geo.push('Die Beschleunigung fängt nicht bei 0 an oder hört nicht bei 1 auf');
  if (easeInOut(-1) !== 0 || easeInOut(2) !== 1) geo.push('Die Beschleunigung läuft außerhalb von 0…1 weiter');

  // Der kurze Weg: von 350° nach 10° sind es zehn Grad vorwärts, nicht 340
  // rückwärts – und das Ergebnis meint denselben Winkel wie das Ziel.
  for (const [von, ziel, erwartet] of [
    [350, 10, 370],
    [10, 350, -10],
    [0, 180, 180],
    [-720, 0, -720],
  ]) {
    const got = shortestTurn(von, ziel);
    if (Math.abs(got - erwartet) > 1e-9) geo.push(`shortestTurn(${von}, ${ziel}) = ${got}, erwartet ${erwartet}`);
    if (Math.abs(got - von) > 180.000001) geo.push(`shortestTurn(${von}, ${ziel}) nimmt den langen Weg`);
  }

  // Jedes Fest steht im Rad dort, wo es im Jahr liegt – und breit genug, um
  // getroffen zu werden.
  for (const f of FEASTS) {
    const s = feastSpan(feastStart(f), f.days, YEAR_DAYS, 5);
    const echt = dayAngle(feastStart(f) + Math.max(1, f.days) / 2, YEAR_DAYS);
    if (Math.abs(s.mid - echt) > 1e-9) geo.push(`${f.id}: die Mitte im Rad weicht vom Tag im Jahr ab`);
    if (s.to - s.from < 5 - 1e-9) geo.push(`${f.id}: bleibt schmaler als die Untergrenze`);
    if (s.mid < 0 || s.mid >= 360) geo.push(`${f.id}: Winkel ${s.mid} liegt außerhalb des Kreises`);
  }

    /*
   * Der äußere Ring gegen die Prosa im Inneren.
   *
   * Jeder hebräische Monat trägt in den Daten eine Angabe wie „September /
   * Oktober". Der Ring zeichnet dieselbe Aussage noch einmal, nur als Winkel –
   * und zwei Darstellungen derselben Sache laufen auseinander, sobald jemand
   * eine von beiden anfasst. Hier wird aus dem Ring zurückgerechnet, welche
   * gregorianischen Monate ein hebräischer überdeckt, und mit dem Satz
   * verglichen, der danebensteht. Weicht eines ab, stimmt entweder die Angabe
   * nicht mehr oder das Rad zeigt woandershin.
   */
  const versatz = gregorianOffsetDeg();
  const tagAusWinkel = (w) => ((((w - versatz) % 360) + 360) % 360 / 360) * GREGORIAN_YEAR_DAYS;
  const monatAmTag = (tag) => {
    const t = ((tag % GREGORIAN_YEAR_DAYS) + GREGORIAN_YEAR_DAYS) % GREGORIAN_YEAR_DAYS;
    for (let i = 11; i >= 0; i--) if (t >= gregorianStart(i) - 1e-6) return i;
    return 0;
  };

  if (GREGORIAN_YEAR_DAYS !== 365) geo.push(`Die gregorianischen Monate ergeben ${GREGORIAN_YEAR_DAYS} Tage, erwartet 365`);

  for (const h of MONTHS) {
    const a0 = dayAngle(monthStart(h.id), YEAR_DAYS);
    const a1 = dayAngle(monthStart(h.id) + h.days, YEAR_DAYS);
    const von = monatAmTag(tagAusWinkel(a0));
    const bis = monatAmTag(tagAusWinkel(a1) - 1e-3);
    const namen = { de: [], en: [] };
    for (let i = von; ; i = (i + 1) % 12) {
      namen.de.push(GREGORIAN_MONTHS[i].de);
      namen.en.push(GREGORIAN_MONTHS[i].en);
      if (i === bis) break;
      if (namen.de.length > 3) break;
    }
    for (const sprache of ['de', 'en']) {
      const soll = namen[sprache].join(' / ');
      const ist = h.gregorian?.[sprache];
      if (soll !== ist) {
        geo.push(`${h.id}: der Ring zeigt „${soll}", die Daten sagen „${ist}" (${sprache})`);
      }
    }
  }

  // Der Anker selbst: die Mitte des Nisan liegt auf dem Wechsel März/April.
  const nisanMitte = dayAngle(MONTHS[0].days / 2, YEAR_DAYS);
  if (Math.abs(tagAusWinkel(nisanMitte) - gregorianStart(3)) > 1e-6) {
    geo.push('Die Mitte des Nisan liegt nicht mehr auf dem 1. April – der Anker des äußeren Rings stimmt nicht.');
  }

const pfad = arcPath(0, 30, 70, 90);
  if (!pfad.startsWith('M') || !pfad.endsWith('Z') || (pfad.match(/A/g) ?? []).length !== 2) {
    geo.push('arcPath liefert kein geschlossenes Ringstück mit zwei Bögen');
  }
  const stueck = arcPath(0, 30, 0, 90);
  if (!stueck.startsWith('M0 0') || (stueck.match(/A/g) ?? []).length !== 1) {
    geo.push('arcPath liefert für rIn = 0 kein Kuchenstück mit Spitze im Mittelpunkt');
  }
}

/* --- Gegenprobe ---------------------------------------------------------- */

const kaputt = FEASTS.map((f, n) =>
  n === 0
    ? { ...f, places: [...f.places, 'Ein Ort, den es nicht gibt'] }
    : n === 1
      ? { ...f, refs: [{ ...f.refs[0], osis: 'Rev' }] }
      : n === 2
        ? { ...f, month: 'gibtesnicht' }
        : f,
);
// Und der Neumond, vom Monatsanfang weggeschoben: Das Rad zeichnete ihn
// weiter an jeden Ersten, während die Daten etwas anderes sagen.
const verschoben = FEASTS.map((f) => (f.monthly ? { ...f, day: 5 } : f));
if (pruefe(verschoben).length < 1) {
  console.error('✗ Die Gegenprobe merkt nicht, wenn ein monatliches Fest nicht auf dem Ersten liegt.');
  process.exit(1);
}
if (pruefe(kaputt).length < 3) {
  console.error('✗ Die Gegenprobe findet die absichtlich eingebauten Fehler nicht.');
  process.exit(1);
}

/* --- Bericht ------------------------------------------------------------- */

const orte = FEASTS.reduce((n, f) => n + f.places.length, 0);
const stellen = FEASTS.reduce((n, f) => n + f.refs.length, 0) + RHYTHMS.reduce((n, r) => n + r.refs.length, 0);
const laengen = FEASTS.map((f) => f.de.what.length);
console.log(`Feste:      ${FEASTS.length} in ${MONTHS.length} Monaten zu ${YEAR_DAYS} Tagen`);
console.log(`Rhythmen:   ${RHYTHMS.length} außerhalb des Jahreskreises`);
console.log(`Ortsnamen:  ${orte} – alle gegen places.json aufgelöst`);
console.log(`Bibelstellen: ${stellen}, jede zweisprachig beschriftet`);
console.log(
  `Text:       Ø ${Math.round(laengen.reduce((a, b) => a + b, 0) / laengen.length)} Zeichen (${Math.min(...laengen)}–${Math.max(...laengen)})`,
);
console.log(`Erster Tag im Rad: ${monthStart('nisan')} (1. Nisan) · letzter: ${monthStart('adar')}`);

const alle = [...funde, ...geo];
if (alle.length) {
  console.error(`\n✗ ${alle.length} Probleme:`);
  for (const f of alle.slice(0, 15)) console.error('   ' + f);
  process.exit(1);
}
console.log(
  `\n${FEASTS.length} Feste: jeder Ort aufgelöst, jeder Tag in seinem Monat, jede Stelle auf dem Buch und Kapitel, das in beiden Labeln steht – und das Rad rechnet vorwärts.`,
);
