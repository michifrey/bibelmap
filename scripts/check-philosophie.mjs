// Prüft das Philosophieregal gegen das, woran es hängt.
//
//   npm run check:philosophie
//   npm run check:philosophie -- --gegenprobe
//
// **Wo diese Ansicht still falsch werden kann.** Sie behauptet fünf Dinge über
// jedes Werk, und keines davon sieht man ihr an:
//
//   – `period` stellt den Rücken auf ein Brett und färbt ihn. Ein Brett, das
//     das Erscheinungsjahr nicht enthält, wäre eine Behauptung, der die eigene
//     Jahreszahl widerspricht – im Fenster daneben stünde dann ein Datum, das
//     zur Überschrift nicht passt.
//   – `year` ist der Punkt auf dem Zeitstrahl. Ein Zahlendreher verschiebt ihn
//     um Jahrhunderte, ohne dass irgendwo etwas rot wird: Der Punkt steht dann
//     eben woanders, und der Abstand, der die Aussage dieser Achse ist, ist
//     falsch.
//   – `books` verbindet das Werk mit den biblischen Büchern, mit denen es
//     arbeitet. Ein falsches OSIS-Kürzel erzeugt einen Knopf, der das Kürzel
//     anzeigt und ins Leere führt.
//   – `person` und `event` sind die Wege auf den Zeitbaum und die Zeitschiene
//     der Kirchengeschichte. Sie stehen hier als bloße Zeichenketten, damit das
//     Regal nicht 60 kB Zeitbaum mitlädt – geprüft werden sie deshalb hier,
//     gegen die echten Dateien, und zwar auch auf ihre Jahreszahl: Ein Ereignis
//     dreihundert Jahre neben dem Werk ist kein Zusammenhang, sondern ein
//     Tippfehler.
//   – `links` sind die Verweise zwischen den Werken. Sie tragen die eigentliche
//     Behauptung dieses Regals – dass da eine Linie läuft –, und ein Ziel, das
//     es nicht gibt, bricht sie lautlos.
//
// Dazu die Geometrie des Zeitstrahls. Sie ist der Grund, warum es dieses Regal
// überhaupt eigens gibt: Die Achse rechnet linear in Jahren, und wo zwei Werke
// zu nah beieinanderliegen, rückt das spätere eine Spur tiefer statt zur Seite.
// Verschöbe es doch zur Seite, wäre der Abstand – die ganze Aussage der Achse –
// gelogen, ohne dass es jemand sähe. Also wird hier nachgerechnet: Die
// x-Werte stehen in der Reihenfolge der Jahre, keine zwei Marken derselben Spur
// liegen näher als der Mindestabstand, und keine Marke liegt außerhalb.

import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const {
  PHIL_WORKS, PHIL_PERIODS, PHIL_PERIOD_BY_ID, PHIL_BY_ID, PHIL_KIND, PHIL_LINKS_TO,
  PHIL_MARKEN, PHIL_MARKE_ABSTAND, PHIL_STRAHL_BREIT, PHIL_STRAHL_RAND, PHIL_VON, PHIL_BIS,
  philLanes, philPosition, philMarkX, philSpuren,
} = await import(path.join(ROOT, 'src/data/philosophy.ts'));
const { MAX_ZEICHEN } = await import(path.join(ROOT, 'src/data/shelf.ts'));
const { BOOK_BY_OSIS } = await import(path.join(ROOT, 'src/data/books.ts'));
const { GENEALOGY } = await import(path.join(ROOT, 'src/data/genealogy.ts'));
const { EVENTS } = await import(path.join(ROOT, 'src/data/churchHistory.ts'));

const gegenprobe = process.argv.includes('--gegenprobe');

const LINK_ARTEN = ['builds', 'against', 'echoes'];
/** Untergrenzen für die Prosa – darunter steht dort ein Platzhalter. */
const MIN_THESE = 40;
const MIN_ABSATZ = 140;
/**
 * Wie weit ein verknüpftes Ereignis vom Werk entfernt sein darf. Ein Jahrhundert
 * ist großzügig und trifft trotzdem jeden Zahlendreher: Levinas 1961 und die
 * Erklärung von 1965 liegen vier Jahre auseinander, Origenes 229 und die
 * Kanonbildung um 200 knapp dreißig.
 */
const MAX_ABSTAND_EREIGNIS = 110;

const personIds = new Set(GENEALOGY.map((p) => p.id));
const eventById = Object.fromEntries(EVENTS.map((e) => [e.id, e]));

export function pruefe(werke, bretter = PHIL_PERIODS) {
  const funde = [];
  const brettById = Object.fromEntries(bretter.map((p) => [p.id, p]));
  const ids = new Set();
  const werkIds = new Set(werke.map((w) => w.id));

  /* --- Je Werk ----------------------------------------------------------- */
  for (const w of werke) {
    if (!w.id?.trim()) funde.push('Ein Werk ohne Kennung');
    if (ids.has(w.id)) funde.push(`${w.id}: Kennung steht doppelt`);
    ids.add(w.id);

    if (!PHIL_KIND[w.kind]) funde.push(`${w.id}: unbekannte Art „${w.kind}"`);

    const p = brettById[w.period];
    if (!p) {
      funde.push(`${w.id}: Brett „${w.period}" gibt es nicht`);
    } else if (w.year < p.from || w.year > p.to) {
      funde.push(`${w.id}: Jahr ${w.year} liegt außerhalb des Bretts ${p.de} (${p.from}…${p.to})`);
    }

    if (!(w.from <= w.to)) funde.push(`${w.id}: Spanne ${w.from}…${w.to} läuft rückwärts`);
    if (w.year < w.from || w.year > w.to) {
      funde.push(`${w.id}: Jahr ${w.year} liegt außerhalb der eigenen Spanne (${w.from}…${w.to})`);
    }
    if (w.year < PHIL_VON || w.year > PHIL_BIS) {
      funde.push(`${w.id}: Jahr ${w.year} liegt außerhalb des Zeitstrahls (${PHIL_VON}…${PHIL_BIS})`);
    }

    /* Die Rückenbeschriftung – dieselbe Obergrenze wie im Bibelregal. */
    for (const [sprache, kurz] of [['de', w.shortDe], ['en', w.shortEn]]) {
      if (!kurz?.trim()) funde.push(`${w.id}: kein Rückentitel (${sprache})`);
      else if (kurz.length > MAX_ZEICHEN) {
        funde.push(`${w.id}: „${kurz}" hat ${kurz.length} Zeichen, auf den Rücken passen ${MAX_ZEICHEN} (${sprache})`);
      }
    }

    /* Zweisprachigkeit und Umfang der Prosa. */
    for (const sprache of ['de', 'en']) {
      for (const feld of ['author', 'lived', 'when', 'thesis', 'who', 'what', 'bible']) {
        const text = w[feld]?.[sprache];
        if (!text?.trim()) funde.push(`${w.id}: Feld ${feld} leer (${sprache})`);
      }
      if ((w.thesis?.[sprache] ?? '').length < MIN_THESE) funde.push(`${w.id}: These zu knapp (${sprache})`);
      for (const feld of ['who', 'what', 'bible']) {
        if ((w[feld]?.[sprache] ?? '').length < MIN_ABSATZ) funde.push(`${w.id}: ${feld} zu knapp (${sprache})`);
      }
      if (!w[sprache]?.trim()) funde.push(`${w.id}: kein Titel (${sprache})`);
    }
    if (!w.original?.trim()) funde.push(`${w.id}: kein Originaltitel`);
    if (!w.wiki?.trim() || !w.wikiEn?.trim()) funde.push(`${w.id}: kein Wikipedia-Begriff`);

    /* Biblische Bücher. */
    if (!w.books?.length) funde.push(`${w.id}: nennt kein biblisches Buch`);
    const gesehenBuch = new Set();
    for (const osis of w.books ?? []) {
      if (!BOOK_BY_OSIS[osis]) funde.push(`${w.id}: „${osis}" ist kein biblisches Buch`);
      if (gesehenBuch.has(osis)) funde.push(`${w.id}: Buch ${osis} steht doppelt`);
      gesehenBuch.add(osis);
    }

    /* Verweise zwischen den Werken. */
    const gesehen = new Set();
    for (const l of w.links ?? []) {
      if (l.to === w.id) funde.push(`${w.id}: zeigt auf sich selbst`);
      if (!werkIds.has(l.to)) funde.push(`${w.id}: Verweisziel „${l.to}" gibt es nicht`);
      if (!LINK_ARTEN.includes(l.kind)) funde.push(`${w.id}: unbekannte Verweisart „${l.kind}"`);
      const schluessel = `${l.to}|${l.kind}`;
      if (gesehen.has(schluessel)) funde.push(`${w.id}: derselbe Verweis auf ${l.to} zweimal`);
      gesehen.add(schluessel);
      for (const sprache of ['de', 'en']) {
        if (!l[sprache]?.trim()) funde.push(`${w.id}: Verweis auf ${l.to} ohne Text (${sprache})`);
      }
      /*
       * Ein Verweis zeigt zurück, nie nach vorn: `to` ist immer das frühere
       * Werk. Zeigte er vorwärts, stünde in der Liste „Antwortet auf" ein Buch,
       * das es beim Erscheinen noch nicht gab.
       */
      const ziel = werke.find((x) => x.id === l.to) ?? PHIL_BY_ID[l.to];
      if (ziel && ziel.year > w.year) {
        funde.push(`${w.id} (${w.year}) antwortet auf ${l.to} (${ziel.year}) – das gab es noch nicht`);
      }
    }

    /* Die Wege auf Zeitbaum und Zeitschiene. */
    if (w.person && !personIds.has(w.person)) funde.push(`${w.id}: Person „${w.person}" steht nicht im Zeitbaum`);
    if (w.event) {
      const ev = eventById[w.event];
      if (!ev) funde.push(`${w.id}: Ereignis „${w.event}" steht nicht auf der Zeitschiene`);
      else if (Math.abs(ev.year - w.year) > MAX_ABSTAND_EREIGNIS) {
        funde.push(`${w.id} (${w.year}) verweist auf ${w.event} (${ev.year}) – ${Math.abs(ev.year - w.year)} Jahre daneben`);
      }
    }
  }

  /* --- Bretter ------------------------------------------------------------ */
  let letzteOrdnung = 0;
  let letzterBeginn = -Infinity;
  for (const p of bretter) {
    if (!werke.some((w) => w.period === p.id)) funde.push(`Brett ${p.id}: steht leer da`);
    if (!(p.from < p.to)) funde.push(`Brett ${p.id}: Spanne läuft rückwärts`);
    if (p.order <= letzteOrdnung) funde.push(`Brett ${p.id}: steht nicht in der Reihenfolge`);
    letzteOrdnung = p.order;
    if (p.from < letzterBeginn) funde.push(`Brett ${p.id}: beginnt vor dem vorigen Brett`);
    letzterBeginn = p.from;
    if (!/^#[0-9a-f]{6}$/i.test(p.color ?? '')) funde.push(`Brett ${p.id}: Farbe „${p.color}" ist kein Sechserhex`);
    for (const feld of [p.de, p.en, p.range?.de, p.range?.en, p.note?.de, p.note?.en]) {
      if (!feld?.trim()) funde.push(`Brett ${p.id}: leeres Feld`);
    }
  }

  return funde;
}

/* --- Die Geometrie des Zeitstrahls ---------------------------------------- */

export function pruefeStrahl(werke = PHIL_WORKS) {
  const funde = [];
  const marken = philLanes(werke);

  // Die x-Werte stehen in der Reihenfolge der Jahre – sonst liefe die Achse
  // rückwärts, und ein späteres Werk stünde links vom früheren.
  for (let i = 1; i < marken.length; i++) {
    if (marken[i].x < marken[i - 1].x - 0.001) {
      funde.push(`Zeitstrahl: ${marken[i].id} liegt links von ${marken[i - 1].id}`);
    }
  }

  // Keine Marke verlässt den gezeichneten Bereich.
  for (const m of marken) {
    if (m.x < PHIL_STRAHL_RAND - 0.001 || m.x > PHIL_STRAHL_BREIT - PHIL_STRAHL_RAND + 0.001) {
      funde.push(`Zeitstrahl: ${m.id} liegt bei ${m.x.toFixed(1)} außerhalb des Strahls`);
    }
  }

  // Keine zwei Marken derselben Spur liegen näher als der Mindestabstand –
  // sonst deckte eine die andere zu und wäre nicht mehr zu treffen.
  const proSpur = new Map();
  for (const m of marken) {
    const vorige = proSpur.get(m.lane);
    if (vorige !== undefined && m.x - vorige < PHIL_MARKE_ABSTAND - 0.001) {
      funde.push(`Zeitstrahl: zwei Marken in Spur ${m.lane} liegen ${(m.x - vorige).toFixed(1)} Pixel auseinander`);
    }
    proSpur.set(m.lane, m.x);
  }

  // Und die x-Werte sind nicht verschoben: Jede Marke steht genau dort, wo ihr
  // Jahr sie hinstellt. Das ist die eigentliche Zusage dieser Achse.
  const nutz = PHIL_STRAHL_BREIT - 2 * PHIL_STRAHL_RAND;
  for (const m of marken) {
    const w = werke.find((x) => x.id === m.id) ?? PHIL_BY_ID[m.id];
    const soll = PHIL_STRAHL_RAND + philPosition(w.year) * nutz;
    if (Math.abs(soll - m.x) > 0.001) {
      funde.push(`Zeitstrahl: ${m.id} steht bei ${m.x.toFixed(1)} statt bei ${soll.toFixed(1)}`);
    }
  }

  // Die Jahresbeschriftung steht aufsteigend und innerhalb der Achse.
  let letzte = -Infinity;
  for (const marke of PHIL_MARKEN) {
    const x = philMarkX(marke.year);
    if (marke.year <= letzte) funde.push(`Zeitstrahl: Jahresmarke ${marke.year} steht nicht aufsteigend`);
    letzte = marke.year;
    if (x < 0 || x > PHIL_STRAHL_BREIT) funde.push(`Zeitstrahl: Jahresmarke ${marke.year} liegt außerhalb`);
    if (!marke.de?.trim() || !marke.en?.trim()) funde.push(`Zeitstrahl: Jahresmarke ${marke.year} ohne Beschriftung`);
  }

  // Die Achse selbst: monoton, und die Enden liegen auf 0 und 1.
  if (philPosition(PHIL_VON) !== 0 || philPosition(PHIL_BIS) !== 1) {
    funde.push('Zeitstrahl: die Achse endet nicht auf 0 und 1');
  }
  for (let jahr = PHIL_VON; jahr < PHIL_BIS; jahr += 50) {
    if (philPosition(jahr + 50) <= philPosition(jahr)) {
      funde.push(`Zeitstrahl: die Achse läuft bei ${jahr} nicht weiter`);
      break;
    }
  }

  return funde;
}

/* --- Gegenprobe ------------------------------------------------------------ */

const kaputt = PHIL_WORKS.map((w, n) => {
  if (n === 0) return { ...w, period: 'gibtsnicht' };
  if (n === 1) return { ...w, books: [...w.books, 'Hesekiel'] };
  if (n === 2) return { ...w, year: w.year + 900 };
  if (n === 3) return { ...w, links: [{ to: 'ein-werk-das-es-nicht-gibt', kind: 'builds', de: 'x', en: 'x' }] };
  if (n === 4) return { ...w, person: 'niemand', event: 'nie-geschehen' };
  if (n === 5) return { ...w, shortDe: 'Ein viel zu langer Rückentitel' };
  return w;
});
if (pruefe(kaputt).length < 6) {
  console.error('✗ Die Gegenprobe findet die absichtlich eingebauten Fehler nicht.');
  process.exit(1);
}
/** Ein Ereignis aus der falschen Zeit – vorhanden, aber ohne Zusammenhang. */
const danebenGegriffen = PHIL_WORKS.map((w) => (w.id === 'otto-heilige' ? { ...w, event: 'pfingsten' } : w));
if (pruefe(danebenGegriffen).length < 1) {
  console.error('✗ Die Gegenprobe merkt nicht, wenn ein Ereignis Jahrhunderte neben dem Werk liegt.');
  process.exit(1);
}
/** Ein Verweis nach vorn: eine Antwort auf ein Buch, das es noch nicht gab. */
const rueckwaerts = PHIL_WORKS.map((w) =>
  w.id === 'platon-politeia'
    ? { ...w, links: [{ to: 'kant-kritik', kind: 'builds', de: 'x', en: 'x' }] }
    : w,
);
if (pruefe(rueckwaerts).length < 1) {
  console.error('✗ Die Gegenprobe merkt nicht, wenn ein Verweis in die Zukunft zeigt.');
  process.exit(1);
}
/** Ein leeres Brett – eine Überschrift ohne einen einzigen Rücken darunter. */
if (pruefe(PHIL_WORKS.filter((w) => w.period !== 'moderne')).length < 1) {
  console.error('✗ Die Gegenprobe merkt nicht, wenn ein Brett leer steht.');
  process.exit(1);
}
/**
 * Und die Gegenprobe der Geometrie: ein Werk, das zweimal im selben Jahr steht,
 * bekommt eine eigene Spur – zwei Marken in derselben Spur wären ein Befund.
 */
const strahlKaputt = pruefeStrahl(
  PHIL_WORKS.map((w) => (w.id === 'kant-kritik' ? { ...w, year: 1807 } : w)),
);
if (strahlKaputt.length > 0) {
  console.error('✗ Die Gegenprobe der Geometrie meldet etwas, wo die Spuren gerade richtig arbeiten:');
  for (const f of strahlKaputt) console.error('   ' + f);
  process.exit(1);
}

if (gegenprobe) {
  console.log(`Gegenprobe: ${pruefe(kaputt).length} Befunde am absichtlich kaputten Regal.`);
}

/* --- Bericht --------------------------------------------------------------- */

const funde = [...pruefe(PHIL_WORKS), ...pruefeStrahl()];
const verweise = PHIL_WORKS.reduce((n, w) => n + w.links.length, 0);
const aufZeit = PHIL_WORKS.filter((w) => w.person || w.event).length;
const bibelbezuege = new Set(PHIL_WORKS.flatMap((w) => w.books)).size;
const erste = PHIL_WORKS.reduce((a, w) => (w.year < a.year ? w : a));
const letzte = PHIL_WORKS.reduce((a, w) => (w.year > a.year ? w : a));
const luecke = (() => {
  const jahre = PHIL_WORKS.map((w) => w.year).sort((a, b) => a - b);
  let max = 0;
  let wo = '';
  for (let i = 1; i < jahre.length; i++) {
    if (jahre[i] - jahre[i - 1] > max) {
      max = jahre[i] - jahre[i - 1];
      wo = `${jahre[i - 1]}…${jahre[i]}`;
    }
  }
  return `${max} Jahre (${wo})`;
})();

console.log(`Werke:        ${PHIL_WORKS.length} auf ${PHIL_PERIODS.length} Brettern, ${erste.year} bis ${letzte.year}`);
console.log(`Verweise:     ${verweise} zwischen den Werken, jeder zurück in die Zeit und zweisprachig`);
console.log(`Bibelbezüge:  ${bibelbezuege} verschiedene Bücher, jedes gegen books.ts aufgelöst`);
console.log(`Zeitschiene:  ${aufZeit} Werke führen auf Zeitbaum oder Kirchengeschichte`);
console.log(`Zeitstrahl:   ${philSpuren()} Spuren auf ${PHIL_STRAHL_BREIT} Pixeln, kein Punkt verschoben`);
console.log(`Größte Lücke: ${luecke} – sie steht so auf der Achse`);

if (funde.length) {
  console.error(`\n✗ ${funde.length} Probleme:`);
  for (const f of funde.slice(0, 15)) console.error('   ' + f);
  process.exit(1);
}
console.log(
  `\n${PHIL_WORKS.length} Werke: jedes Brett enthält das eigene Erscheinungsjahr, jeder Verweis zeigt zurück auf ein Werk, das es schon gab, jede Person und jedes Ereignis löst gegen Zeitbaum und Kirchengeschichte auf – und auf dem Zeitstrahl steht kein Punkt anderswo als in seinem Jahr.`,
);
