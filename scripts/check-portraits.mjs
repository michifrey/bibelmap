// Prüft die Buchporträts – und schlägt jedes Zitat im Bibeltext nach.
//
//   node --experimental-strip-types --import ./scripts/lib/ts-loader.mjs scripts/check-portraits.mjs
//   npm run check:portraits
//   npm run check:portraits -- --gegenprobe
//
// **Warum ausgerechnet hier nachgeschlagen wird.** Ein Buchporträt behauptet
// zweierlei, das man ihm nicht ansieht. Erstens, dass ein Satz *so* in der
// Bibel steht – „Ihr gedachtet's böse mit mir zu machen". Zweitens, dass ein
// Satz aus dem Neuen Testament ihn aufnimmt. Die erste Behauptung ist
// überprüfbar, und deshalb wird sie überprüft: Jedes Zitat wird in
// `public/data/text/` gesucht, deutsch gegen Luther 1912, englisch gegen die
// World English Bible. Ein halbes Zitat aus dem Gedächtnis fällt hier auf,
// bevor es jemand liest.
//
// Die zweite Behauptung – dass die beiden Sätze etwas miteinander zu tun
// haben – kann kein Skript prüfen. Sie bleibt ein Urteil, und sie steht
// deshalb als Urteil da: mit beiden Stellen daneben, damit jeder nachsehen
// kann.
//
// **Zwei Zählungen.** Luther zählt 1. Mose 32 einen Vers früher als die
// englische Ausgabe. Ein Zitat darf deshalb ein zweites Kürzel für die
// englische Zählung tragen (`refEn`); geprüft wird jede Sprache gegen ihre
// eigene Stelle. Ohne diese Trennung müsste man auf die Stelle verzichten
// oder ein falsches Kürzel anzeigen.
//
// **Wörtlich, aber nicht buchstabenfromm.** Verglichen wird nach einer
// Vereinheitlichung der Anführungszeichen und Leerzeichen: Der Text im Haus
// benutzt typografische Zeichen („ “ ’), eine Datendatei in TypeScript nicht.
// Groß- und Kleinschreibung bleibt, wie sie ist – „Und siehe" ist nicht
// dasselbe wie „und siehe", und wer mitten im Vers einsteigt, soll das auch
// so schreiben.
//
// **Die Rolle muss das Buch abdecken.** Die Züge eines Buches liegen
// lückenlos über seinen Kapiteln. Fehlte eines, sähe man auf der Rolle nichts
// davon – die Felder lägen einfach etwas weiter auseinander, und 1. Mose
// hätte plötzlich 48 Kapitel. Gerechnet wird mit `gaps()` aus
// `src/lib/bookScroll.ts`, also mit dem Code, den auch die Oberfläche
// benutzt, und nicht mit einer Nachbildung davon.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { PORTRAITS } = await import(path.join(ROOT, 'src/data/bookPortraits.ts'));
const { BOOK_BY_OSIS, BP_VIDEO_DE } = await import(path.join(ROOT, 'src/data/books.ts'));
const { GENEALOGY } = await import(path.join(ROOT, 'src/data/genealogy.ts'));
const { gaps } = await import(path.join(ROOT, 'src/lib/bookScroll.ts'));
const { parseRef } = await import(path.join(ROOT, 'src/lib/parseRef.ts'));
const { expandPlaces, findPlacesByNames } = await import(path.join(ROOT, 'src/lib/places.ts'));

const TEXT = path.join(ROOT, 'public/data/text');
const PLACES = expandPlaces(
  JSON.parse(fs.readFileSync(path.join(ROOT, 'public/data/places.json'), 'utf8')),
);

/** Untergrenzen, unter denen sich die Prüfung selbst für kaputt erklärt. */
const MIN_PORTRAITS = 1;
const MIN_ORTE = 1000;

if (PORTRAITS.length < MIN_PORTRAITS || PLACES.length < MIN_ORTE) {
  console.error(`✗ Zu wenig gefunden (${PORTRAITS.length} Porträts, ${PLACES.length} Orte).`);
  console.error('  Das ist kein bestandener Lauf, sondern eine Prüfung ohne Quelle.');
  process.exit(1);
}

const gegenprobe = process.argv.includes('--gegenprobe');

/** Mindestlängen: ein Satz ist noch keine Erklärung. */
const MIN_HEART = 200;
const MIN_TEXT = 120;
/**
 * Die Kurzfassung ganz oben auf der Seite. Sie hat nach beiden Seiten eine
 * Grenze, und das ist der Punkt: Unter 150 Zeichen steht dort ein Slogan
 * statt einer Auskunft, über 600 ist es keine Kurzfassung mehr, sondern die
 * Kernbotschaft an der falschen Stelle. Dass sie kürzer bleibt als `heart`
 * und nicht dessen Anfang wiederholt, wird eigens geprüft – sonst steht
 * derselbe Text zweimal auf einer Seite, und beide werden überlesen.
 */
const MIN_SUMMARY = 150;
const MAX_SUMMARY = 600;

const kapitelCache = new Map();
/** Die Verse eines Kapitels in einer Sprache, oder null. */
function verse(osis, kapitel, sprache) {
  if (!kapitelCache.has(osis)) {
    const datei = path.join(TEXT, `${osis}.json`);
    kapitelCache.set(osis, fs.existsSync(datei) ? JSON.parse(fs.readFileSync(datei, 'utf8')).chapters : null);
  }
  const buch = kapitelCache.get(osis);
  return buch?.[String(kapitel)]?.[sprache] ?? null;
}

/**
 * Vereinheitlicht, was zwischen einer Textdatei und einer Quelldatei
 * unweigerlich auseinandergeht: typografische Anführungszeichen, Apostrophe,
 * Gedankenstriche und mehrfache Leerzeichen.
 */
function glatt(s) {
  return s
    .replace(/[‘’‚′]/g, "'")
    .replace(/[“”„″]/g, '"')
    .replace(/ /g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Zählt die Verse eines Buches in einer Sprache – für die Zahl im Porträt. */
function verseImBuch(osis, sprache) {
  const datei = path.join(TEXT, `${osis}.json`);
  if (!fs.existsSync(datei)) return null;
  const buch = JSON.parse(fs.readFileSync(datei, 'utf8')).chapters;
  return Object.values(buch).reduce((n, k) => n + (k[sprache]?.length ?? 0), 0);
}

/** Zählt die Orte, die dieses Buch nennt – dieselbe Quelle wie die Karte. */
function orteImBuch(osis) {
  let n = 0;
  for (const p of PLACES) {
    if (p.verses?.some((v) => v.book === osis)) n++;
  }
  return n;
}

const PERSONEN = new Set(GENEALOGY.map((p) => p.id));

/**
 * Die eigentliche Prüfung. Sie bekommt die Porträts übergeben, statt sie
 * selbst zu holen – nur so kann die Gegenprobe ihr kaputte Daten vorlegen.
 */
export function pruefe(portraits) {
  const funde = [];
  const meld = (s) => funde.push(s);
  let zitate = 0;
  let ortsnamen = 0;

  for (const p of portraits) {
    const buch = BOOK_BY_OSIS[p.osis];
    const wo = `${p.osis}`;
    if (!buch) {
      meld(`${wo}: kein Buch dieses Kürzels in books.ts.`);
      continue;
    }

    /** Ein Zitat gegen den Text im Haus. */
    const zitat = (q, was) => {
      for (const [sprache, stelle, text] of [
        ['de', q.ref, q.de],
        ['en', q.refEn ?? q.ref, q.en],
      ]) {
        if (!text?.trim()) {
          meld(`${wo} ${was}: ${sprache} fehlt.`);
          continue;
        }
        const r = parseRef(stelle, sprache === 'de' ? 'de' : 'en');
        if (!r) {
          meld(`${wo} ${was}: Stelle „${stelle}" lässt sich nicht auflösen.`);
          continue;
        }
        // parseRef klemmt ein zu großes Kapitel stillschweigend auf das letzte
        // des Buches. Für die Suche ist das freundlich, für eine Prüfung wäre
        // es blind – also selbst nachrechnen.
        const roh = Number(stelle.match(/(\d{1,3})(?:\s*[,:]\s*\d{1,3})?\s*$/)?.[1]);
        if (Number.isFinite(roh) && roh !== r.chapter) {
          meld(`${wo} ${was}: ${stelle} – Kapitel ${roh} gibt es in ${r.osis} nicht.`);
          continue;
        }
        const kap = verse(r.osis, r.chapter, sprache);
        if (!kap) {
          meld(`${wo} ${was}: ${stelle} – kein Text zu ${r.osis} ${r.chapter} (${sprache}).`);
          continue;
        }
        const v = r.verse ? kap.find((x) => x.v === r.verse) : null;
        if (r.verse && !v) {
          meld(`${wo} ${was}: ${stelle} – Vers ${r.verse} gibt es nicht (${sprache}).`);
          continue;
        }
        const quelle = glatt(v ? v.t : kap.map((x) => x.t).join(' '));
        if (!quelle.includes(glatt(text))) {
          meld(
            `${wo} ${was} (${sprache}): steht nicht wörtlich in ${stelle}.\n      Zitiert: „${glatt(text).slice(0, 80)}…"\n      Im Text: „${quelle.slice(0, 80)}…"`,
          );
          continue;
        }
        zitate++;
      }
    };

    /** Eine Stelle, die nur auflösen muss – ohne Zitat dahinter. */
    const stelleOk = (ref, was) => {
      const erste = String(ref).split(/\s*[,;]\s*/)[0];
      const r = parseRef(erste.replace(/\s*[-–]\s*\d+.*$/, ''), 'de');
      if (!r) meld(`${wo} ${was}: Stelle „${ref}" lässt sich nicht auflösen.`);
    };

    // ---------------------------------------------------------- die Rolle
    const { missing, doubled } = gaps(p.movements, buch.chapters);
    if (missing.length) {
      meld(`${wo}: Kapitel ohne Zug: ${missing.join(', ')} – die Rolle deckt das Buch nicht ab.`);
    }
    if (doubled.length) {
      meld(`${wo}: Kapitel in mehr als einem Zug: ${doubled.join(', ')}.`);
    }
    let letztes = 0;
    const zugIds = new Set();
    for (const m of p.movements) {
      if (zugIds.has(m.id)) meld(`${wo}: Zug-Kennung „${m.id}" kommt zweimal vor.`);
      zugIds.add(m.id);
      if (m.from > m.to) meld(`${wo}/${m.id}: from ${m.from} liegt hinter to ${m.to}.`);
      if (m.from <= letztes) meld(`${wo}/${m.id}: Züge stehen nicht in der Reihenfolge des Buches.`);
      letztes = m.to;
      for (const [feld, wert] of [
        ['title.de', m.title?.de], ['title.en', m.title?.en],
        ['text.de', m.text?.de], ['text.en', m.text?.en],
      ]) {
        if (!wert?.trim()) meld(`${wo}/${m.id}: ${feld} fehlt.`);
      }
      if ((m.text?.de?.length ?? 0) < MIN_TEXT) {
        meld(`${wo}/${m.id}: die deutsche Erklärung ist mit ${m.text?.de?.length ?? 0} Zeichen zu dünn (mindestens ${MIN_TEXT}).`);
      }
      if (!/^[A-Za-z0-9 .,\-hvHVMLQCSAZmlqcsaz]+$/.test(m.symbol ?? '')) {
        meld(`${wo}/${m.id}: symbol ist kein SVG-Pfad.`);
      }
      for (const n of m.places ?? []) {
        if (!findPlacesByNames(PLACES, [n]).length) {
          meld(`${wo}/${m.id}: der Ort „${n}" löst sich nicht in places.json auf.`);
        } else ortsnamen++;
      }
    }

    // --------------------------------------------------------- die Muster
    for (const mu of p.patterns) {
      const fremd = mu.movements.filter((id) => !zugIds.has(id));
      if (fremd.length) meld(`${wo}/${mu.id}: kennt Züge, die es nicht gibt: ${fremd.join(', ')}.`);
      if (mu.movements.length < 2) {
        meld(`${wo}/${mu.id}: ein Muster über einem einzigen Zug ist kein Muster.`);
      }
      for (const r of mu.refs) stelleOk(r, `Muster ${mu.id}`);
    }

    // -------------------------------------------------------- die Figuren
    for (const f of p.figures) {
      if (f.from < 1 || f.to > buch.chapters || f.from > f.to) {
        meld(`${wo}/${f.id}: Kapitelspanne ${f.from}–${f.to} liegt nicht in ${buch.chapters} Kapiteln.`);
      }
      if (f.person && !PERSONEN.has(f.person)) {
        meld(`${wo}/${f.id}: „${f.person}" steht nicht in genealogy.ts.`);
      }
      if (f.place && !findPlacesByNames(PLACES, [f.place]).length) {
        meld(`${wo}/${f.id}: der Ort „${f.place}" löst sich nicht in places.json auf.`);
      } else if (f.place) ortsnamen++;
      stelleOk(f.ref, `Figur ${f.id}`);
      for (const [feld, wert] of [
        ['who.de', f.who?.de], ['who.en', f.who?.en],
        ['turn.de', f.turn?.de], ['turn.en', f.turn?.en],
      ]) {
        if (!wert?.trim()) meld(`${wo}/${f.id}: ${feld} fehlt.`);
      }
    }

    // ----------------------------------------------------- die Zeitschiene
    let letzterTakt = 0;
    for (const b of p.beats) {
      if (b.chapter < 1 || b.chapter > buch.chapters) {
        meld(`${wo}/${b.id}: Kapitel ${b.chapter} gibt es in ${buch.de} nicht.`);
      }
      if (b.chapter < letzterTakt) {
        meld(`${wo}/${b.id}: die Zeitschiene springt zurück (Kapitel ${b.chapter} nach ${letzterTakt}).`);
      }
      letzterTakt = b.chapter;
      if (!b.note?.de?.trim() || !b.note?.en?.trim()) meld(`${wo}/${b.id}: note fehlt in einer Sprache.`);
    }

    // ------------------------------------------------- Zitate und Zahlen
    zitat(p.verse, 'Kernvers');
    for (const tr of p.traces) {
      zitat(tr.seed, `Jesus-Hinweis ${tr.id} (Buch)`);
      zitat(tr.echo, `Jesus-Hinweis ${tr.id} (NT)`);
      // Der Hinweis soll aus *diesem* Buch kommen und im Neuen Testament
      // landen – sonst steht er im falschen Porträt.
      const s = parseRef(tr.seed.ref, 'de');
      if (s && s.osis !== p.osis) {
        meld(`${wo}/${tr.id}: die Stelle im Buch zeigt auf ${s.osis}, nicht auf ${p.osis}.`);
      }
      const e = parseRef(tr.echo.refEn ?? tr.echo.ref, 'en');
      if (e && (BOOK_BY_OSIS[e.osis]?.testament ?? 'AT') !== 'NT') {
        meld(`${wo}/${tr.id}: der Nachhall steht in ${e.osis} – das ist kein Buch des Neuen Testaments.`);
      }
    }

    if (p.facts.chapters !== buch.chapters) {
      meld(`${wo}: facts.chapters sagt ${p.facts.chapters}, books.ts sagt ${buch.chapters}.`);
    }
    const verseDe = verseImBuch(p.osis, 'de');
    if (verseDe !== null && p.facts.verses !== verseDe) {
      meld(`${wo}: facts.verses sagt ${p.facts.verses}, im Text stehen ${verseDe}.`);
    }
    const orte = orteImBuch(p.osis);
    if (p.facts.places !== orte) {
      meld(`${wo}: facts.places sagt ${p.facts.places}, places.json nennt ${orte}.`);
    }

    for (const sprache of ['de', 'en']) {
      const kurz = p.summary?.[sprache];
      if (!kurz?.trim()) {
        meld(`${wo}: die Kurzfassung fehlt auf ${sprache} – sie steht ganz oben auf der Seite.`);
        continue;
      }
      if (kurz.length < MIN_SUMMARY || kurz.length > MAX_SUMMARY) {
        meld(`${wo}: die Kurzfassung (${sprache}) misst ${kurz.length} Zeichen – erlaubt sind ${MIN_SUMMARY} bis ${MAX_SUMMARY}.`);
      }
      const lang = p.heart?.[sprache] ?? '';
      if (kurz.length >= lang.length) {
        meld(`${wo}: die Kurzfassung (${sprache}) ist nicht kürzer als die Kernbotschaft.`);
      }
      // Derselbe Anfang heißt: es ist kein eigener Text, sondern ein
      // abgeschnittener. Verglichen werden die ersten sechzig Zeichen.
      if (lang && kurz.slice(0, 60) === lang.slice(0, 60)) {
        meld(`${wo}: die Kurzfassung (${sprache}) ist der Anfang der Kernbotschaft, nicht ein eigener Text.`);
      }
    }
    if ((p.heart?.de?.length ?? 0) < MIN_HEART) {
      meld(`${wo}: die Kernbotschaft ist mit ${p.heart?.de?.length ?? 0} Zeichen zu dünn (mindestens ${MIN_HEART}).`);
    }
    for (const d of p.deepen) {
      if (!d.source?.de?.trim() || !d.source?.en?.trim()) {
        meld(`${wo}/${d.id}: Vertiefung ohne Quelle – „man sagt" ist keine.`);
      }
    }
    if (!p.questions.length) meld(`${wo}: keine Frage zum Weiterdenken.`);
  }

  return { funde, zitate, ortsnamen };
}

const { funde, zitate, ortsnamen } = pruefe(PORTRAITS);

// Die Kennungen der deutschen Videos: elf Zeichen aus dem Alphabet, das
// YouTube benutzt. Ob das Video *existiert*, kann diese Prüfung nicht sagen –
// dafür ist `npm run check:bp` da, das im Netz nachfragt.
const videoFunde = [];
for (const [osis, ids] of Object.entries(BP_VIDEO_DE)) {
  if (!BOOK_BY_OSIS[osis]) videoFunde.push(`BP_VIDEO_DE: „${osis}" ist kein Buchkürzel.`);
  for (const id of ids) {
    if (!/^[\w-]{11}$/.test(id)) videoFunde.push(`BP_VIDEO_DE/${osis}: „${id}" hat nicht die Form einer YouTube-Kennung.`);
  }
}

if (gegenprobe) {
  // Sechs eingebaute Fehler, je einer pro Regel. Findet die Prüfung sie nicht
  // alle – und zwar aus dem richtigen Grund –, prüft sie nicht, was sie zu
  // prüfen vorgibt.
  const p0 = PORTRAITS[0];
  const proben = [
    ['Loch in der Rolle', /Kapitel ohne Zug/, {
      ...p0,
      movements: p0.movements.map((m, i) => (i === 0 ? { ...m, to: m.to - 1 } : m)),
    }],
    ['Zitat nicht wörtlich', /steht nicht wörtlich/, {
      ...p0,
      verse: { ...p0.verse, de: p0.verse.de.replace(/\S+/, 'Angeblich') },
    }],
    ['Stelle im falschen Buch', /zeigt auf/, {
      ...p0,
      traces: p0.traces.map((t, i) => (i === 0 ? { ...t, seed: { ...t.seed, ref: 'Ps 1:1' } } : t)),
    }],
    ['Kapitelzahl daneben', /facts\.chapters/, { ...p0, facts: { ...p0.facts, chapters: 3 } }],
    ['Ort gibt es nicht', /löst sich nicht in places\.json/, {
      ...p0,
      figures: p0.figures.map((f, i) => (i === 0 ? { ...f, place: 'Entenhausen' } : f)),
    }],
    ['Person nicht im Zeitbaum', /steht nicht in genealogy\.ts/, {
      ...p0,
      figures: p0.figures.map((f, i) => (i === 0 ? { ...f, person: 'gibtsnicht' } : f)),
    }],
    ['Kurzfassung abgeschrieben', /Anfang der Kernbotschaft/, {
      ...p0,
      summary: { de: p0.heart.de.slice(0, 300), en: p0.heart.en.slice(0, 300) },
    }],
  ];
  let gut = 0;
  for (const [name, muster, kaputt] of proben) {
    const meldungen = pruefe([kaputt]).funde;
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

const alle = [...funde, ...videoFunde];
const zuege = PORTRAITS.reduce((n, p) => n + p.movements.length, 0);
const figuren = PORTRAITS.reduce((n, p) => n + p.figures.length, 0);
console.log(`Porträts:   ${PORTRAITS.length} (${PORTRAITS.map((p) => BOOK_BY_OSIS[p.osis]?.de ?? p.osis).join(', ')})`);
console.log(`Rolle:      ${zuege} Züge, jedes Kapitel genau einmal abgedeckt`);
console.log(`Figuren:    ${figuren}, Ortsnamen aufgelöst: ${ortsnamen}`);
console.log(`Zitate:     ${zitate} im Bibeltext nachgeschlagen (deutsch und englisch)`);

if (alle.length) {
  console.error(`\n✗ ${alle.length} Beanstandung${alle.length === 1 ? '' : 'en'}:`);
  for (const f of alle.slice(0, 15)) console.error('   · ' + f);
  process.exit(1);
}
console.log(
  '\n✓ Jede Rolle deckt ihr Buch lückenlos ab, jede Stelle löst auf, jedes Zitat steht wörtlich im Text, ' +
    'und jede Zahl im Porträt ist nachgezählt.',
);
