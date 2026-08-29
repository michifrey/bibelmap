// Prüft die Jesus-Sektion gegen ihre eigenen Angaben.
//
//   npm run check:gospel
//
// Warum es das gibt: `src/data/gospel.ts` ist von Hand geschrieben – rund
// siebzig Stationen, jede mit Ortskennung, Bibelstelle, Buch und einer Liste
// von Personen. Nichts davon merkt beim Tippen, wenn die Kennung `a112427`
// zu `a112472` wird, wenn eine Station Personen nennt, die es im Verzeichnis
// nicht gibt, oder wenn eine Stelle aus dem Markusevangelium unter „Lukas“
// steht. Im Browser fällt so etwas erst auf, wenn jemand genau dorthin klickt.
//
// Gelesen wird der echte Code, nicht eine Nachbildung: Der Auflöser aus
// scripts/lib erlaubt Node, `src/data/gospel.ts` samt allem, was daran hängt,
// zu importieren.
//
// Was das Skript nicht tut: die Erzählung beurteilen. Ob ein Text die Szene
// trifft, entscheidet kein Programm. Geprüft wird, was nachrechenbar ist.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadBooks, buildLexicon, findRefs } from './lib/bibleref.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const { ACTS, PEOPLE, STATIONS, STATIONS_BY_PERSON } = await import(
  path.join(ROOT, 'src/data/gospel.ts')
);
const { CHOSEN } = await import(path.join(ROOT, 'src/data/chosen.ts'));
const { BP_THEMES, BP_VIDEO_BY_ID, BT_BY_BOOK, chapterOfRef, overviewVideo } = await import(
  path.join(ROOT, 'src/data/gospelMedia.ts')
);
const { WITNESSES } = await import(path.join(ROOT, 'src/data/witnesses.ts'));

const roh = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/data/places.json'), 'utf8'));
const PLACES = Array.isArray(roh) ? roh : roh.places;
const PLACE_BY_ID = new Map(PLACES.map((p) => [p.id, p]));

const books = loadBooks();
const lex = buildLexicon(books);

/** Die vier Evangelien – etwas anderes hat in `book` nichts zu suchen. */
const GOSPELS = new Set(['Matt', 'Mark', 'Luke', 'John']);

/**
 * Untergrenzen. Findet der Import nichts mehr, weil jemand einen Namen
 * ändert, wäre „keine Fehler gefunden“ die falscheste aller Entwarnungen.
 */
const MIN_STATIONEN = 60;
const MIN_PERSONEN = 40;
const MIN_AKTE = 5;
const MIN_ZEUGNISSE = 8;

/** Wie weit eine Station von ihrem verlinkten Ort abweichen darf (km). */
const MAX_ABWEICHUNG = 6;
/** Der Rahmen, in dem die Evangelien spielen – Ägypten bis Hermon. */
const RAHMEN = { latMin: 29, latMax: 34.5, lonMin: 30, lonMax: 37 };

function distanceKm(a, b) {
  const R = 6371;
  const r = (x) => (x * Math.PI) / 180;
  const dLat = r(b[0] - a[0]);
  const dLon = r(b[1] - a[1]);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.sin(dLon / 2) ** 2 * Math.cos(r(a[0])) * Math.cos(r(b[0]));
  return 2 * R * Math.asin(Math.sqrt(h));
}

const fehler = [];
const hinweise = [];
const melde = (s) => fehler.push(s);

/* --- 0. Ist überhaupt etwas da? ----------------------------------------- */

if (STATIONS.length < MIN_STATIONEN) {
  melde(`Nur ${STATIONS.length} Stationen gefunden – erwartet mindestens ${MIN_STATIONEN}.`);
}
if (PEOPLE.length < MIN_PERSONEN) {
  melde(`Nur ${PEOPLE.length} Personen gefunden – erwartet mindestens ${MIN_PERSONEN}.`);
}
if (ACTS.length < MIN_AKTE) {
  melde(`Nur ${ACTS.length} Akte gefunden – erwartet mindestens ${MIN_AKTE}.`);
}
if (WITNESSES.length < MIN_ZEUGNISSE) {
  melde(`Nur ${WITNESSES.length} außerbiblische Zeugnisse – erwartet mindestens ${MIN_ZEUGNISSE}.`);
}

/* --- 1. Kennungen sind eindeutig ---------------------------------------- */

const doppelt = (liste, was) => {
  const gesehen = new Set();
  for (const x of liste) {
    if (gesehen.has(x.id)) melde(`${was}: die Kennung „${x.id}“ kommt zweimal vor.`);
    gesehen.add(x.id);
  }
  return gesehen;
};

const AKT_IDS = doppelt(ACTS, 'Akte');
const PERSON_IDS = doppelt(PEOPLE, 'Personen');
const STATION_IDS = doppelt(STATIONS, 'Stationen');

/* --- 2. Jede Station für sich -------------------------------------------- */

let mitOrt = 0;
let stellen = 0;
let medien = 0;

for (const s of STATIONS) {
  const wo = `Station „${s.id}“`;

  if (!AKT_IDS.has(s.act)) melde(`${wo}: der Akt „${s.act}“ steht nicht in ACTS.`);
  if (!GOSPELS.has(s.book)) melde(`${wo}: „${s.book}“ ist keines der vier Evangelien.`);

  for (const feld of ['de', 'en']) {
    if (!s[feld]?.trim()) melde(`${wo}: der Titel (${feld}) fehlt.`);
    if (!s.text?.[feld]?.trim()) melde(`${wo}: der Text (${feld}) fehlt.`);
    if (!s.where?.[feld]?.trim()) melde(`${wo}: die Ortsangabe (${feld}) fehlt.`);
    if (!s.ref?.[feld]?.trim()) melde(`${wo}: die Bibelstelle (${feld}) fehlt.`);
  }
  if (s.text?.de && s.text.de === s.text.en) {
    melde(`${wo}: deutscher und englischer Text sind gleich – eine Übersetzung fehlt.`);
  }

  for (const pid of s.people) {
    if (!PERSON_IDS.has(pid)) melde(`${wo}: nennt „${pid}“, das steht nicht im Personenverzeichnis.`);
  }

  // Koordinaten
  const { lat, lon } = s;
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    melde(`${wo}: Koordinaten fehlen oder sind keine Zahlen.`);
  } else if (lat < RAHMEN.latMin || lat > RAHMEN.latMax || lon < RAHMEN.lonMin || lon > RAHMEN.lonMax) {
    melde(`${wo}: liegt mit ${lat}/${lon} außerhalb des Rahmens der Evangelien.`);
  }

  // Medienverweise: zu jeder Station muss sich ein Übersichtsvideo und eine
  // Hörfolge bilden lassen – sonst steht der Kasten „Anderswo“ halb leer.
  const kapitel = chapterOfRef(s.ref?.de ?? '');
  if (kapitel === undefined) {
    melde(`${wo}: aus „${s.ref?.de}“ lässt sich kein Kapitel lesen.`);
  } else {
    if (!overviewVideo(s.book, kapitel)) {
      melde(`${wo}: kein BibleProject-Übersichtsvideo für ${s.book} ${kapitel}.`);
    }
    if (!BT_BY_BOOK[s.book]) {
      melde(`${wo}: bibletunes kennt keine Staffel zu ${s.book}.`);
    } else {
      medien++;
    }
  }

  // Ortskennung
  if (s.placeId) {
    const ort = PLACE_BY_ID.get(s.placeId);
    if (!ort) {
      melde(`${wo}: die Ortskennung „${s.placeId}“ gibt es in places.json nicht.`);
    } else {
      mitOrt++;
      const d = distanceKm([lat, lon], [ort.lat, ort.lon]);
      if (d > MAX_ABWEICHUNG) {
        melde(
          `${wo}: liegt ${d.toFixed(1)} km von „${ort.name}“ entfernt – gemeint ist wohl ein anderer Ort.`,
        );
      }
    }
  }

  // Bibelstelle: Buch und Kapitel müssen sich lesen lassen, und das Buch muss
  // zu `book` passen – sonst zeigt der Verweis auf den falschen Guide.
  for (const [feld, sprache] of [['de', 'de'], ['en', 'en']]) {
    const text = s.ref?.[feld];
    if (!text) continue;
    const gefunden = findRefs(text, lex, books);
    if (!gefunden.length) {
      melde(`${wo}: die Bibelstelle „${text}“ (${sprache}) lässt sich nicht lesen.`);
      continue;
    }
    stellen++;
    // Die Oberfläche liest das Kapitel mit einer eigenen kleinen Regel aus der
    // Stellenangabe (`chapterOfRef`), weil sie den Parser aus scripts/lib nicht
    // hat. Hier stehen beide nebeneinander – sonst zeigt ein Videolink
    // irgendwann auf den falschen Teil.
    const eigenes = chapterOfRef(text);
    if (eigenes !== gefunden[0].chapter) {
      melde(
        `${wo}: chapterOfRef liest aus „${text}“ Kapitel ${eigenes}, der Stellenparser ${gefunden[0].chapter}.`,
      );
    }
    if (gefunden[0].osis !== s.book) {
      melde(
        `${wo}: die Stelle „${text}“ gehört zu ${gefunden[0].osis}, eingetragen ist aber „${s.book}“.`,
      );
    }
  }
}

/* --- 3. Die Akte tragen die Stationen ------------------------------------ */

for (const a of ACTS) {
  const n = STATIONS.filter((s) => s.act === a.id).length;
  if (n < 2) melde(`Akt „${a.id}“ hat nur ${n} Station(en).`);
}

// Die Stationen stehen in Aktreihenfolge – die Liste wird von oben nach unten
// gelesen, ein Sprung zurück wäre in der Oberfläche nicht zu sehen.
const reihenfolge = ACTS.map((a) => a.id);
let zuletzt = -1;
for (const s of STATIONS) {
  const i = reihenfolge.indexOf(s.act);
  if (i < zuletzt) {
    melde(`Station „${s.id}“ steht im Akt „${s.act}“, aber hinter einem späteren Akt.`);
    break;
  }
  zuletzt = i;
}

/* --- 4. Personen ohne Auftritt ------------------------------------------- */

for (const p of PEOPLE) {
  if (p.id === 'jesus') continue; // er ist in jeder Station, deshalb in keiner
  if (!(STATIONS_BY_PERSON[p.id]?.length ?? 0)) {
    hinweise.push(`„${p.de}“ steht im Verzeichnis, kommt aber in keiner Station vor.`);
  }
}

/* --- 4b. Themenvideos ----------------------------------------------------- */

for (const [sid, ids] of Object.entries(BP_THEMES)) {
  if (!STATION_IDS.has(sid)) {
    melde(`BibleProject-Themen: „${sid}“ ist keine Station.`);
  }
  for (const vid of ids) {
    if (!BP_VIDEO_BY_ID[vid]) melde(`BibleProject-Themen: das Video „${vid}“ steht nicht in BP_VIDEOS.`);
  }
}

/* --- 4c. Außerbiblische Zeugnisse ----------------------------------------- */

const zeugnisIds = new Set();
for (const w of WITNESSES) {
  const wo = `Zeugnis „${w.id}“`;
  if (zeugnisIds.has(w.id)) melde(`${wo}: die Kennung kommt zweimal vor.`);
  zeugnisIds.add(w.id);
  if (w.kind !== 'text' && w.kind !== 'find') melde(`${wo}: unbekannte Art „${w.kind}“.`);
  for (const feld of ['de', 'en']) {
    if (!w[feld]?.trim()) melde(`${wo}: der Titel (${feld}) fehlt.`);
    if (!w.source?.[feld]?.trim()) melde(`${wo}: die Quellenangabe (${feld}) fehlt.`);
    if (!w.when?.[feld]?.trim()) melde(`${wo}: die Datierung (${feld}) fehlt.`);
    if (!w.text?.[feld]?.trim()) melde(`${wo}: der Text (${feld}) fehlt.`);
  }
  if (w.text?.de && w.text.de === w.text.en) {
    melde(`${wo}: deutscher und englischer Text sind gleich – eine Übersetzung fehlt.`);
  }
  for (const sid of w.stations ?? []) {
    if (!STATION_IDS.has(sid)) melde(`${wo}: verweist auf „${sid}“ – diese Station gibt es nicht.`);
  }
}

/* --- 5. Die Serienzuordnung ---------------------------------------------- */

const folgen = new Set();
for (const e of CHOSEN) {
  const schluessel = `${e.season}-${e.episode}`;
  if (folgen.has(schluessel)) melde(`The Chosen: S${e.season}E${e.episode} steht zweimal in der Liste.`);
  folgen.add(schluessel);
  if (!e.stations.length) melde(`The Chosen: S${e.season}E${e.episode} nennt keine Station.`);
  for (const sid of e.stations) {
    if (!STATION_IDS.has(sid)) {
      melde(`The Chosen: S${e.season}E${e.episode} verweist auf „${sid}“ – diese Station gibt es nicht.`);
    }
  }
}

/* --- Ergebnis ------------------------------------------------------------ */

for (const h of hinweise) console.log(`· ${h}`);

if (fehler.length) {
  console.error(`\n✗ ${fehler.length} Beanstandungen:\n`);
  for (const f of fehler) console.error(`  ${f}`);
  process.exit(1);
}

const personenMitSzene = PEOPLE.filter((p) => (STATIONS_BY_PERSON[p.id]?.length ?? 0) > 0).length;
console.log(
  `✓ ${STATIONS.length} Stationen in ${ACTS.length} Akten geprüft: ` +
    `${mitOrt} Ortskennungen gegen places.json, ${stellen} Bibelstellen gelesen, ` +
    `${personenMitSzene} von ${PEOPLE.length} Personen mit Auftritt, ` +
    `${medien} Stationen mit Video und Hörfolge, ${WITNESSES.length} außerbiblische Zeugnisse, ` +
    `${CHOSEN.length} Serienfolgen zugeordnet.`,
);
