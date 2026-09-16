// Prüft das Bücherregal gegen das, woran es hängt.
//
//   npm run check:shelf
//   npm run check:shelf -- --gegenprobe
//
// **Wo diese Ansicht still falsch werden kann.** Sie behauptet vier Dinge über
// jedes Buch, und keines davon sieht man ihr an:
//
//   – `group` färbt den Rücken. Eine Gruppe, die nicht zum Kanon passt, malt
//     Daniel blau zwischen die kleinen Propheten – kein Fehler, nur ein
//     falsches Bild. Die Gruppen stehen deshalb hier ein zweites Mal, nach
//     Buchnummern, unabhängig von `shelf.ts`.
//   – `period` stellt den Rücken auf ein Brett. Ein Brett außerhalb der
//     eigenen Datierungsspanne wäre eine Behauptung, der die eigenen Daten
//     widersprechen: Das Fenster daneben nennt dann Jahre, die zum Brett
//     nicht passen.
//   – `links` sind Querverweise auf andere Bücher und auf die Gesetzestexte.
//     Ein Tippfehler im Ziel erzeugt keinen Fehler, sondern einen Knopf, der
//     das OSIS-Kürzel anzeigt und ins Leere führt.
//   – `oldest.find` verbindet das Buch mit seinem Fund. Ein falscher Schlüssel
//     lässt das Bild verschwinden und den Abschnitt „Älteste Handschrift" ohne
//     Weg dahin stehen.
//
// Dazu die Geometrie aus `shelf.ts`: `spineWidth` muss über die Kapitelzahl
// monoton wachsen – sonst wäre ein längeres Buch schmaler als ein kürzeres –
// und darf nie unter 24 Pixel fallen, die Untergrenze, ab der WCAG 2.2 ein
// Ziel als treffbar ansieht.
//
// Und zuletzt die Funde selbst: Ein Fund, auf den niemand zeigt, steht in der
// Liste, wird aber von keinem Buch aus erreicht.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const {
  SHELF, GROUPS, GROUP_BY_ID, PERIODS, PERIOD_BY_ID, LINKS_TO,
  formatSpan, spineWidth, spineHeight, MIN_BREIT, MAX_BREIT, HOEHE_MIN, HOEHE_MAX, MAX_ZEICHEN,
} = await import(path.join(ROOT, 'src/data/shelf.ts'));
const { FINDS, FIND_BY_ID, FIND_KIND } = await import(path.join(ROOT, 'src/data/finds.ts'));
const { LAW_TEXTS, LAW_BY_ID, LAW_KIND, MIZWOT } = await import(path.join(ROOT, 'src/data/lawTexts.ts'));
const { BOOKS, BOOK_BY_OSIS } = await import(path.join(ROOT, 'src/data/books.ts'));
const { FIND_PLACES, FINDS_AT_PLACE } = await import(path.join(ROOT, 'src/data/findPlaces.ts'));
const { expandPlaces, findPlacesByNames } = await import(path.join(ROOT, 'src/lib/places.ts'));
const PLACES = expandPlaces(JSON.parse(fs.readFileSync(path.join(ROOT, 'public/data/places.json'), 'utf8')));

const gegenprobe = process.argv.includes('--gegenprobe');

/**
 * Die Kanongruppen ein zweites Mal – nach Buchnummern, wie sie in jeder
 * Bibelausgabe stehen. Das ist der unabhängige Maßstab: Stünde die Zuordnung
 * nur in `shelf.ts`, prüfte sich die Datei gegen sich selbst.
 */
const GRUPPEN_NACH_NUMMER = [
  { bis: 5, id: 'tora' },
  { bis: 17, id: 'geschichte' },
  { bis: 22, id: 'weisheit' },
  { bis: 27, id: 'prophetenGross' },
  { bis: 39, id: 'prophetenKlein' },
  { bis: 44, id: 'evangelien' },
  { bis: 57, id: 'paulus' },
  { bis: 65, id: 'briefe' },
  { bis: 66, id: 'apokalypse' },
];

function gruppeFuer(num) {
  return GRUPPEN_NACH_NUMMER.find((g) => num <= g.bis)?.id;
}

const LINK_ARTEN = ['quotes', 'quoted', 'parallel', 'continues', 'answers'];
/** Untergrenzen für die Prosa – unter diesen Längen steht dort ein Platzhalter. */
const MIN_DATIERUNG = 80;
const MIN_WELT = 120;

/** Der Name ohne die Klammer dahinter: „1. Mose (Genesis)" → „1. Mose". */
function rueckenname(name) {
  return name.replace(/\s*\(.*\)$/, '');
}

/** Ein Ziel ist gültig, wenn es ein biblisches Buch oder ein Gesetzestext ist. */
function zielName(id) {
  if (BOOK_BY_OSIS[id]) return BOOK_BY_OSIS[id].de;
  if (LAW_BY_ID[id]) return LAW_BY_ID[id].de;
  return null;
}

export function pruefe(regal, funde_ = FINDS, rechtstexte = LAW_TEXTS, verweise = FIND_PLACES) {
  const funde = [];
  const findIds = new Set(funde_.map((f) => f.id));
  const rechtIds = new Set(rechtstexte.map((l) => l.id));

  /* --- Vollständigkeit -------------------------------------------------- */
  const imRegal = new Set(regal.map((b) => b.osis));
  for (const b of BOOKS) {
    if (!imRegal.has(b.osis)) funde.push(`${b.osis} (${b.de}) fehlt im Regal`);
  }
  if (imRegal.size !== regal.length) funde.push('Ein Buch steht doppelt im Regal');
  for (const b of regal) {
    if (!BOOK_BY_OSIS[b.osis]) funde.push(`${b.osis}: kein Buch mit diesem Kürzel`);
  }

  // Die Reihenfolge der Datei ist die des Kanons – sonst findet niemand mehr,
  // wo ein Buch einzutragen wäre.
  let letzte = 0;
  for (const b of regal) {
    const num = BOOK_BY_OSIS[b.osis]?.num ?? 0;
    if (num < letzte) funde.push(`${b.osis}: steht nicht in der Reihenfolge des Kanons`);
    letzte = Math.max(letzte, num);
  }

  /* --- Je Buch ---------------------------------------------------------- */
  for (const b of regal) {
    const meta = BOOK_BY_OSIS[b.osis];
    if (!meta) continue;

    const erwartet = gruppeFuer(meta.num);
    if (b.group !== erwartet) {
      funde.push(`${b.osis}: Gruppe „${b.group}", nach der Buchnummer erwartet „${erwartet}"`);
    }
    if (!GROUP_BY_ID[b.group]) funde.push(`${b.osis}: Gruppe „${b.group}" gibt es nicht`);

    const p = PERIOD_BY_ID[b.period];
    if (!p) {
      funde.push(`${b.osis}: Brett „${b.period}" gibt es nicht`);
    } else if (p.law) {
      funde.push(`${b.osis}: steht auf einem Brett der Gesetzestexte`);
    } else if (b.to < p.from || b.from > p.to) {
      funde.push(
        `${b.osis}: Brett ${p.de} (${p.from}…${p.to}) liegt außerhalb der eigenen Spanne (${b.from}…${b.to})`,
      );
    }

    if (!(b.from < b.to)) funde.push(`${b.osis}: Spanne ${b.from}…${b.to} läuft rückwärts oder ist ein Punkt`);
    if (b.from < -1600 || b.to > 200) funde.push(`${b.osis}: Spanne ${b.from}…${b.to} liegt außerhalb des Möglichen`);

    for (const sprache of ['de', 'en']) {
      const txt = b[sprache];
      if (!txt?.dating?.trim()) funde.push(`${b.osis}: keine Datierung (${sprache})`);
      else if (txt.dating.length < MIN_DATIERUNG) funde.push(`${b.osis}: Datierung zu knapp (${sprache})`);
      if (!txt?.world?.trim()) funde.push(`${b.osis}: kein geschichtlicher Hintergrund (${sprache})`);
      else if (txt.world.length < MIN_WELT) funde.push(`${b.osis}: Hintergrund zu knapp (${sprache})`);
    }

    /* Querverweise */
    const gesehen = new Set();
    for (const l of b.links ?? []) {
      if (l.to === b.osis) funde.push(`${b.osis}: zeigt auf sich selbst`);
      if (!zielName(l.to)) funde.push(`${b.osis}: Verweisziel „${l.to}" gibt es nicht`);
      if (!LINK_ARTEN.includes(l.kind)) funde.push(`${b.osis}: unbekannte Verweisart „${l.kind}"`);
      const schluessel = `${l.to}|${l.kind}`;
      if (gesehen.has(schluessel)) funde.push(`${b.osis}: derselbe Verweis auf ${l.to} zweimal`);
      gesehen.add(schluessel);
      for (const sprache of ['de', 'en']) {
        if (!l[sprache]?.trim()) funde.push(`${b.osis}: Verweis auf ${l.to} ohne Text (${sprache})`);
      }
    }
    if (!b.links?.length) funde.push(`${b.osis}: kein einziger Querverweis`);

    /*
     * Der Name steht senkrecht auf dem Rücken. Er muss hineinpassen: Bei
     * 104 Pixeln Mindesthöhe wurde „Apostelgeschichte" vorn und hinten
     * abgeschnitten, weil er mittig steht. Gezählt werden Zeichen, nicht
     * Pixel – ein grobes Maß, aber für Buchnamen genau genug.
     */
    for (const sprache of ['de', 'en']) {
      const name = rueckenname(meta[sprache]);
      if (name.length > MAX_ZEICHEN) {
        funde.push(`${b.osis}: „${name}" hat ${name.length} Zeichen, auf den Rücken passen ${MAX_ZEICHEN} (${sprache})`);
      }
    }

    /* Älteste Handschrift */
    if (!b.oldest?.find) funde.push(`${b.osis}: keine älteste Handschrift genannt`);
    else if (!findIds.has(b.oldest.find)) funde.push(`${b.osis}: Fund „${b.oldest.find}" gibt es nicht`);
    for (const sprache of ['de', 'en']) {
      if (!b.oldest?.[sprache]?.trim()) funde.push(`${b.osis}: Handschrift ohne Angabe (${sprache})`);
    }
  }

  /* --- Bretter ---------------------------------------------------------- */
  for (const p of PERIODS) {
    const belegt = p.law
      ? rechtstexte.some((l) => l.period === p.id)
      : regal.some((b) => b.period === p.id) || rechtstexte.some((l) => l.period === p.id);
    if (!belegt) funde.push(`Brett ${p.id}: steht leer da`);
    if (!(p.from <= p.to)) funde.push(`Brett ${p.id}: Spanne läuft rückwärts`);
    for (const feld of [p.de, p.en, p.range?.de, p.range?.en, p.note?.de, p.note?.en]) {
      if (!feld?.trim()) funde.push(`Brett ${p.id}: leeres Feld`);
    }
  }
  for (const g of GROUPS) {
    if (!/^#[0-9a-f]{6}$/i.test(g.color ?? '')) funde.push(`Gruppe ${g.id}: Farbe „${g.color}" ist kein Sechserhex`);
    if (!g.de?.trim() || !g.en?.trim()) funde.push(`Gruppe ${g.id}: leerer Name`);
  }

  /* --- Funde ------------------------------------------------------------ */
  const benutzt = new Set([
    ...regal.map((b) => b.oldest?.find),
    ...rechtstexte.map((l) => l.find).filter(Boolean),
  ]);
  const gesehenIds = new Set();
  for (const f of funde_) {
    if (gesehenIds.has(f.id)) funde.push(`Fund ${f.id}: ID kommt doppelt vor`);
    gesehenIds.add(f.id);
    if (!FIND_KIND[f.kind]) funde.push(`Fund ${f.id}: unbekannte Art „${f.kind}"`);
    if (!(f.year >= 1400 && f.year <= 2025)) funde.push(`Fund ${f.id}: Fundjahr ${f.year} ist keins`);
    // Entweder ein Buch zeigt darauf, oder der Fund ist ausdrücklich als
    // alleinstehend markiert – beides zugleich wäre eine Markierung, die
    // nicht mehr stimmt, und keins von beidem ein verwaister Eintrag.
    if (!benutzt.has(f.id) && !f.standalone) funde.push(`Fund ${f.id}: kein Buch und kein Text zeigt darauf`);
    if (benutzt.has(f.id) && f.standalone) funde.push(`Fund ${f.id}: als alleinstehend markiert, obwohl ein Buch darauf zeigt`);
    if (!f.wiki?.trim() || !f.wikiEn?.trim()) funde.push(`Fund ${f.id}: Wikipedia-Begriff fehlt`);
    for (const feld of ['when', 'who', 'where', 'age', 'text', 'limits']) {
      for (const sprache of ['de', 'en']) {
        if (!f[feld]?.[sprache]?.trim()) funde.push(`Fund ${f.id}: leeres Feld ${feld}.${sprache}`);
      }
    }
    if (!f.de?.trim() || !f.en?.trim()) funde.push(`Fund ${f.id}: leerer Titel`);
  }

  /* --- Gesetzestexte ---------------------------------------------------- */
  const rechtGesehen = new Set();
  for (const l of rechtstexte) {
    if (rechtGesehen.has(l.id)) funde.push(`Gesetzestext ${l.id}: ID kommt doppelt vor`);
    rechtGesehen.add(l.id);
    if (!LAW_KIND[l.kind]) funde.push(`Gesetzestext ${l.id}: unbekannte Art „${l.kind}"`);
    const p = PERIOD_BY_ID[l.period];
    if (!p) funde.push(`Gesetzestext ${l.id}: Brett „${l.period}" gibt es nicht`);
    else if (l.to < p.from || l.from > p.to) {
      funde.push(`Gesetzestext ${l.id}: Brett ${p.de} liegt außerhalb der Spanne ${l.from}…${l.to}`);
    }
    if (!(l.from <= l.to)) funde.push(`Gesetzestext ${l.id}: Spanne läuft rückwärts`);
    if (!l.hebrew?.trim() || !l.translit?.trim()) funde.push(`Gesetzestext ${l.id}: hebräischer Name oder Umschrift fehlt`);
    if (!l.wiki?.trim() || !l.wikiEn?.trim()) funde.push(`Gesetzestext ${l.id}: Wikipedia-Begriff fehlt`);
    if (l.find && !findIds.has(l.find)) funde.push(`Gesetzestext ${l.id}: Fund „${l.find}" gibt es nicht`);
    if (!l.books?.length) funde.push(`Gesetzestext ${l.id}: legt kein einziges Buch aus`);
    for (const [feld, sprache] of [['shortDe', 'de'], ['shortEn', 'en']]) {
      const kurz = l[feld];
      if (!kurz?.trim()) funde.push(`Gesetzestext ${l.id}: keine Kurzform für den Rücken (${sprache})`);
      else if (kurz.length > MAX_ZEICHEN) {
        funde.push(`Gesetzestext ${l.id}: Kurzform „${kurz}" hat ${kurz.length} Zeichen, auf den Rücken passen ${MAX_ZEICHEN}`);
      }
    }
    for (const osis of l.books ?? []) {
      if (!BOOK_BY_OSIS[osis]) funde.push(`Gesetzestext ${l.id}: Buch „${osis}" gibt es nicht`);
    }
    for (const feld of ['when', 'who', 'extent', 'what', 'bible']) {
      for (const sprache of ['de', 'en']) {
        if (!l[feld]?.[sprache]?.trim()) funde.push(`Gesetzestext ${l.id}: leeres Feld ${feld}.${sprache}`);
      }
    }
  }
  for (const sprache of ['de', 'en']) {
    if (!MIZWOT[sprache]?.trim()) funde.push(`Die Notiz zu den 613 Geboten fehlt (${sprache})`);
  }

  /*
   * Gegenseitige Verweise sind erlaubt und erwünscht – beide Seiten erzählen
   * denselben Zusammenhang aus ihrer Sicht. Zwei gleichlautende Sätze sind
   * dagegen ein Versehen: Dann wurde einer der beiden nur herüberkopiert, und
   * die Ansicht zeigt ihn gar nicht erst an.
   */
  for (const b of regal) {
    for (const l of b.links ?? []) {
      const zurueck = regal.find((x) => x.osis === l.to)?.links?.find((x) => x.to === b.osis);
      if (!zurueck) continue;
      for (const sprache of ['de', 'en']) {
        if (l[sprache] === zurueck[sprache]) {
          funde.push(`${b.osis} und ${l.to} verweisen mit demselben Satz aufeinander (${sprache})`);
        }
      }
    }
  }

  // Ein Gesetzestext, auf den kein Buch zeigt, ist erreichbar – ein Buch,
  // dessen Verweise alle ins Regal zurückführen, dagegen nicht: Dann stünde
  // die ganze zweite Hälfte der Ansicht ohne Brücke da.
  const rechtVerlinkt = regal.some((b) => (b.links ?? []).some((l) => rechtIds.has(l.to)));
  if (!rechtVerlinkt) funde.push('Kein biblisches Buch verweist auf einen Gesetzestext');

  /* --- Funde auf der Karte ---------------------------------------------- */
  /*
   * `findPlaces.ts` ist eine zweite, kleine Tabelle – sie muss es sein, weil
   * die Ortskarte sie liest und dafür nicht das 159 kB schwere Regalbündel
   * laden soll. Eine zweite Tabelle driftet, wenn niemand sie bindet: Der
   * Titel steht dort noch einmal und muss **wörtlich** der aus `finds.ts`
   * sein, sonst heißt derselbe Fund auf der Ortskarte anders als im Regal.
   */
  const verlinkt = new Set();
  for (const l of verweise) {
    const f = funde_.find((x) => x.id === l.find);
    if (!f) {
      funde.push(`findPlaces: Fund „${l.find}" gibt es nicht`);
      continue;
    }
    if (verlinkt.has(l.find)) funde.push(`findPlaces: ${l.find} steht doppelt`);
    verlinkt.add(l.find);
    for (const sprache of ['de', 'en']) {
      if (l[sprache] !== f[sprache]) {
        funde.push(`findPlaces: ${l.find} heißt hier „${l[sprache]}", in finds.ts „${f[sprache]}" (${sprache})`);
      }
      if (!l.relation?.[sprache]?.trim()) funde.push(`findPlaces: ${l.find} ohne Bezug zum Ort (${sprache})`);
    }
    if (!l.places?.length) {
      funde.push(`findPlaces: ${l.find} nennt keinen Ort`);
      continue;
    }
    const gefunden = findPlacesByNames(PLACES, l.places);
    if (gefunden.length !== l.places.length) {
      const da = new Set(gefunden.map((p) => p.name.replace(/ \d+$/, '').toLowerCase()));
      const weg = l.places.filter((n) => !da.has(n.toLowerCase()));
      funde.push(`findPlaces: ${l.find} – Ort löst nicht auf: ${weg.join(', ')}`);
    }
    /*
     * Und die Rückrichtung: Die Ortskarte schlägt über den kleingeschriebenen
     * Namen ohne Ziffer nach. Steht der Eintrag unter einem anderen Schlüssel,
     * bleibt der Abschnitt dort still leer – kein Fehler, nur nichts zu sehen.
     */
    for (const name of l.places) {
      if (!(FINDS_AT_PLACE[name.toLowerCase()] ?? []).some((x) => x.find === l.find)) {
        funde.push(`findPlaces: ${l.find} ist unter „${name}" nicht nachschlagbar`);
      }
    }
  }

  return funde;
}

const funde = pruefe(SHELF);

/* --- Die Geometrie -------------------------------------------------------- */

const geo = [];
{
  let vorher = 0;
  for (let k = 1; k <= 150; k++) {
    const breit = spineWidth(k);
    if (breit < vorher) geo.push(`spineWidth(${k}) ist schmaler als spineWidth(${k - 1}) – ein längeres Buch wäre dünner`);
    if (breit < 24) geo.push(`spineWidth(${k}) = ${breit} liegt unter der Untergrenze für ein Tippziel`);
    if (breit < MIN_BREIT || breit > MAX_BREIT) geo.push(`spineWidth(${k}) = ${breit} verlässt ${MIN_BREIT}…${MAX_BREIT}`);
    vorher = breit;
  }
  if (spineWidth(1) !== MIN_BREIT) geo.push('Das kürzeste Buch bekommt nicht die Mindestbreite');
  if (spineWidth(150) !== MAX_BREIT) geo.push('Die Psalmen bekommen nicht die volle Breite');

  for (const b of BOOKS) {
    const h = spineHeight(b.num);
    if (h < HOEHE_MIN || h > HOEHE_MAX) geo.push(`spineHeight(${b.num}) = ${h} verlässt ${HOEHE_MIN}…${HOEHE_MAX}`);
  }

  const spannen = [
    [-1400, -450, 'de', '1400–450 v. Chr.'],
    [-1400, -450, 'en', '1400–450 BC'],
    [60, 90, 'de', '60–90 n. Chr.'],
    [-63, 70, 'de', '63 v.–70 n. Chr.'],
    [200, 200, 'de', 'um 200 n. Chr.'],
  ];
  for (const [von, bis, sprache, erwartet] of spannen) {
    const ist = formatSpan(von, bis, sprache);
    if (ist !== erwartet) geo.push(`formatSpan(${von}, ${bis}, '${sprache}') = „${ist}", erwartet „${erwartet}"`);
  }

  // Die Umkehrung der Verweise: Was `LINKS_TO` sagt, muss in den Daten stehen.
  let rueck = 0;
  for (const [ziel, liste] of Object.entries(LINKS_TO)) {
    for (const { from, link } of liste) {
      rueck++;
      const quelle = SHELF.find((b) => b.osis === from);
      if (!quelle?.links?.some((l) => l.to === ziel && l.kind === link.kind)) {
        geo.push(`LINKS_TO behauptet einen Verweis ${from} → ${ziel}, den ${from} nicht hat`);
      }
    }
  }
  const vorwaerts = SHELF.reduce((n, b) => n + b.links.length, 0);
  if (rueck !== vorwaerts) geo.push(`LINKS_TO kennt ${rueck} Verweise, die Daten haben ${vorwaerts}`);
}

/* --- Gegenprobe ----------------------------------------------------------- */

const kaputt = SHELF.map((b, n) =>
  n === 0
    ? { ...b, links: [{ ...b.links[0], to: 'GibtEsNicht' }] }
    : n === 1
      ? { ...b, oldest: { ...b.oldest, find: 'nixgefunden' } }
      : n === 2
        ? { ...b, period: 'neuzeit' }
        : n === 3
          ? { ...b, group: 'apokalypse' }
          : b,
);
/** Ein Name, der auf keinen Rücken passt – und den vorher niemand bemerkte. */
const zuLang = LAW_TEXTS.map((l, n) =>
  n === 0 ? { ...l, shortDe: 'Ein viel zu langer Rückentitel' } : l,
);
if (pruefe(SHELF, FINDS, zuLang).length < 1) {
  console.error('✗ Die Gegenprobe merkt nicht, wenn ein Rückentitel nicht auf den Rücken passt.');
  process.exit(1);
}
const ohneBuch = SHELF.slice(1);
if (pruefe(kaputt).length < 4) {
  console.error('✗ Die Gegenprobe findet die absichtlich eingebauten Fehler nicht.');
  process.exit(1);
}
if (pruefe(ohneBuch).length < 1) {
  console.error('✗ Die Gegenprobe merkt nicht, wenn ein Buch ganz fehlt.');
  process.exit(1);
}
/** Eine Kartenverknüpfung, die ins Leere zeigt, und eine mit falschem Titel. */
const verweiseKaputt = [
  { ...FIND_PLACES[0], places: ['Einen solchen Ort gibt es nicht'] },
  { ...FIND_PLACES[1], de: 'Ein anderer Titel als in finds.ts' },
];
if (pruefe(SHELF, FINDS, LAW_TEXTS, verweiseKaputt).length < 2) {
  console.error('✗ Die Gegenprobe merkt nicht, wenn eine Kartenverknüpfung ins Leere zeigt.');
  process.exit(1);
}

if (gegenprobe) {
  console.log(`Gegenprobe: ${pruefe(kaputt).length} Befunde am absichtlich kaputten Regal, ${pruefe(ohneBuch).length} am unvollständigen.`);
}

/* --- Bericht -------------------------------------------------------------- */

const verweise = SHELF.reduce((n, b) => n + b.links.length, 0);
const strittig = SHELF.filter((b) => b.disputed).length;
const bretter = PERIODS.filter((p) => !p.law).length;
const spanne = SHELF.reduce((n, b) => n + (b.to - b.from), 0) / SHELF.length;
console.log(`Bücher:        ${SHELF.length} auf ${bretter} Brettern, ${strittig} mit strittiger Datierung`);
console.log(`Querverweise:  ${verweise}, jeder auf ein Buch oder einen Gesetzestext, jeder zweisprachig`);
const allein = FINDS.filter((f) => f.standalone).length;
console.log(`Funde:         ${FINDS.length} – ${FINDS.length - allein} tragen den ältesten Text eines Buches, ${allein} stehen für sich`);
const rechtBretter = new Set(LAW_TEXTS.map((l) => l.period)).size;
console.log(`Gesetzestexte: ${LAW_TEXTS.length} auf ${rechtBretter} Brettern unter eigener Überschrift`);
console.log(`Datierung:     Ø ${Math.round(spanne)} Jahre zwischen frühestem und spätestem Vorschlag`);
console.log(`Rücken:        ${spineWidth(1)}–${spineWidth(150)} Pixel breit (Obadja bis Psalmen)`);
const orte = FIND_PLACES.reduce((n, l) => n + l.places.length, 0);
console.log(`Auf der Karte: ${FIND_PLACES.length} Funde an ${orte} Orten, jeder gegen places.json aufgelöst`);

const alle = [...funde, ...geo];
if (alle.length) {
  console.error(`\n✗ ${alle.length} Probleme:`);
  for (const f of alle.slice(0, 15)) console.error('   ' + f);
  process.exit(1);
}
console.log(
  `\n${SHELF.length} Bücher: jede Gruppe stimmt mit der Buchnummer, jedes Brett liegt in der eigenen Datierungsspanne, jeder Verweis und jeder Fund löst auf – und kein Buchrücken ist schmaler, als eine Maus trifft.`,
);
