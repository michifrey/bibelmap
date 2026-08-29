// Prüft die Stammesgrenzen gegen Orte, deren Stamm die Bibel selbst nennt.
//
//   node scripts/check-tribes.mjs
//
// `tribeAt()` beantwortet auf jeder Ortskarte die Frage „in wessen Gebiet liegt
// dieser Ort?". Das ist eine Behauptung, keine Verzierung: Wer die Ringe in
// `src/data/tribes.ts` anfasst – und das passiert, sie sind von Hand gezeichnet –,
// verschiebt damit auch diese Antwort, ohne es zu sehen.
//
// Die Liste unten sind Orte, deren Zugehörigkeit im Text steht (Jos 15–19,
// Jos 21, Ri 1) oder unstrittig ist, dazu vier, die ausdrücklich zu KEINEM
// Stamm gehören: Tyrus und Sidon blieben phönizisch, Damaskus aramäisch, Sela
// edomitisch. Ein Ring, der die vier verschluckt, ist zu großzügig gezeichnet.
//
// Gelesen wird der echte Code, nicht der Quelltext als Zeichenkette. Vorher
// stand hier ein regulärer Ausdruck für die Ringe und – schwerer wiegend – eine
// zweite Fassung von `tribeAt()`. Eine Prüfung, die den Algorithmus noch einmal
// aufschreibt, prüft am Ende nur, ob ihre eigene Fassung zu ihrer eigenen
// Lesart passt: Wer das Strahlenverfahren in der App ändert, bekommt hier
// weiterhin ein Häkchen.
//
// `scripts/lib/ts-loader.mjs` erlaubt Node, `src/data/tribes.ts` direkt zu
// importieren – dieselben Ringe, dieselbe Funktion, die auch die Ortskarte
// fragt.

import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { TRIBES, tribeAt } = await import(path.join(ROOT, 'src/data/tribes.ts'));


/* --- Die Fälle ----------------------------------------------------------- */

const CASES = [
  ['Jerusalem', 31.7784, 35.2354, 'Benjamin', 'Jos 18,28'],
  ['Bet-El', 31.9308, 35.2222, 'Benjamin', 'Jos 18,22'],
  ['Jericho', 31.8707, 35.4437, 'Benjamin', 'Jos 18,21'],
  ['Hebron', 31.5326, 35.0998, 'Juda', 'Jos 15,54'],
  ['Bethlehem', 31.7054, 35.2024, 'Juda', 'Ri 17,7'],
  ['Beerscheba', 31.2518, 34.7913, 'Simeon', 'Jos 19,2'],
  ['Gaza', 31.52, 34.45, 'Simeon', 'Jos 19,1-9'],
  ['Sichem', 32.2137, 35.2811, 'Manasse (West)', 'Jos 17,7'],
  ['Megiddo', 32.5847, 35.1839, 'Manasse (West)', 'Jos 17,11'],
  ['Silo', 32.0556, 35.2894, 'Ephraim', 'Jos 16'],
  ['Jafo', 32.054, 34.752, 'Dan', 'Jos 19,46'],
  ['Nazaret', 32.7019, 35.2975, 'Sebulon', 'Jos 19,10-16'],
  ['Kapernaum', 32.8808, 35.575, 'Naftali', 'Mt 4,13'],
  ['Hazor', 33.02, 35.57, 'Naftali', 'Jos 19,36'],
  ['Laisch (Dan)', 33.2487, 35.6521, 'Naftali', 'Ri 18,29'],
  ['Bet-Schean', 32.4997, 35.4989, 'Issachar', 'Jos 17,11'],
  ['Akko', 32.92, 35.08, 'Asser', 'Ri 1,31'],
  ['Heschbon', 31.8, 35.81, 'Ruben', 'Jos 13,17'],
  ['Mahanajim', 32.28, 35.68, 'Gad', 'Jos 13,26'],
  ['Aschtarot', 32.8, 36.01, 'Manasse (Ost)', 'Jos 13,31'],
  // Blieb ausdrücklich außerhalb Israels:
  ['Tyrus', 33.271, 35.203, null, 'Jos 19,29 – Grenze, nicht Gebiet'],
  ['Sidon', 33.56, 35.37, null, 'Ri 1,31'],
  ['Damaskus', 33.51, 36.3, null, 'aramäisch'],
  ['Sela', 30.3285, 35.4444, null, 'edomitisch'],
];

/* --- Lauf ---------------------------------------------------------------- */

// Levi bekommt kein Land und hat darum keinen Ring – erwartet werden 13.
const rings = TRIBES.filter((t) => t.polygon?.length >= 3);
if (rings.length < 13) {
  console.error(`Nur ${rings.length} Gebiete mit Grenzen – erwartet 13. Fehlt ein polygon in tribes.ts?`);
  process.exit(2);
}

const wrong = [];
for (const [name, lat, lon, want, why] of CASES) {
  const got = tribeAt(lat, lon)?.de ?? null;
  if (got !== want) {
    wrong.push(`${name}: ${got ?? 'kein Gebiet'} statt ${want ?? 'kein Gebiet'} (${why})`);
  }
}

/* --- Die Chronik-Belege -------------------------------------------------- */

/*
 * Jeder Stamm trägt jetzt, was die Chronik über sein Gebiet führt: das
 * Register, die Wohnverse, den Fürsten unter David. Das sind Behauptungen über
 * einen Text, der im Haus liegt – also wird nachgeschlagen statt geglaubt.
 *
 * Geprüft wird dreierlei, und das dritte ist das eigentliche:
 *   1. Jede Stelle löst sich im echten Text auf (Buch, Kapitel, Verse da).
 *   2. Der Fürst steht wirklich in dem Vers, der ihn nennt.
 *   3. Wo `register` oder `prince` auf `null` steht, ist das eine Aussage –
 *      „die Chronik führt ihn nicht" – und keine Lücke in der Datenpflege.
 *      Also muss der Stamm dort auch wirklich fehlen.
 *
 * Ohne 3. wäre `null` bequem: Man setzt es, wo man nicht nachsehen mochte, und
 * die Oberfläche behauptet dann ruhig, die Chronik schweige. Sie schweigt bei
 * Sebulon und Dan (kein Register) und bei Gad und Asser (kein Fürst) – nirgends
 * sonst, und genau das steht hier fest.
 */

const TEXT = path.join(ROOT, 'public/data/text');
const { readFileSync } = await import('node:fs');
const buecher = new Map();
function kapitel(buch, kap) {
  if (!buecher.has(buch)) {
    buecher.set(buch, JSON.parse(readFileSync(path.join(TEXT, `${buch}.json`), 'utf8')).chapters);
  }
  return buecher.get(buch)[String(kap)]?.de ?? null;
}

/** „1Chr 5,27-6,66" → { buch, verse: [{kap, v}] }. Auch über Kapitelgrenzen. */
function loesen(stelle) {
  const m = /^(\d?[A-Za-z]+) (\d+),(\d+)(?:-(?:(\d+),)?(\d+))?$/.exec(stelle);
  if (!m) return { fehler: `unlesbare Stelle: „${stelle}"` };
  const [, buch, k1, v1, k2, v2] = m;
  const vonK = Number(k1);
  const bisK = k2 ? Number(k2) : vonK;
  const verse = [];
  for (let k = vonK; k <= bisK; k++) {
    const ch = kapitel(buch, k);
    if (!ch) return { fehler: `${stelle}: ${buch} ${k} gibt es nicht` };
    const von = k === vonK ? Number(v1) : 1;
    const bis = k === bisK ? Number(v2 ?? v1) : ch.at(-1).v;
    for (let v = von; v <= bis; v++) {
      const e = ch.find((x) => x.v === v);
      if (!e) return { fehler: `${stelle}: ${buch} ${k},${v} gibt es nicht` };
      verse.push({ kap: k, v, t: e.t });
    }
  }
  return { buch, verse };
}

/** Wie die Lutherfassung den Stamm schreibt – dort, wo sie abweicht. */
const IM_TEXT = {
  Naftali: 'Naphthali',
  Issachar: 'Isaschar',
  'Manasse (West)': 'Manasse',
  'Manasse (Ost)': 'Manasse',
};

const chronikFehler = [];
let belege = 0;

for (const t of TRIBES) {
  const c = t.chronicles;
  if (!c) {
    chronikFehler.push(`${t.de}: kein chronicles-Eintrag`);
    continue;
  }
  const gesucht = IM_TEXT[t.de] ?? t.de;

  for (const [feld, stelle] of [['register', c.register], ['dwelling', c.dwelling]]) {
    if (!stelle) continue;
    const r = loesen(stelle);
    if (r.fehler) { chronikFehler.push(`${t.de} (${feld}): ${r.fehler}`); continue; }
    belege++;
    // Das Register muss den Stamm auch nennen – sonst zeigt die Stelle
    // irgendwohin, und das fiele niemandem auf.
    if (feld === 'register' && !r.verse.some((v) => v.t.includes(gesucht))) {
      chronikFehler.push(`${t.de}: ${stelle} nennt „${gesucht}" in keinem seiner Verse`);
    }
  }

  if (c.prince) {
    const r = loesen(c.prince.ref);
    if (r.fehler) { chronikFehler.push(`${t.de} (prince): ${r.fehler}`); }
    else {
      belege++;
      const text = r.verse.map((v) => v.t).join(' ');
      if (!text.includes(c.prince.de)) {
        chronikFehler.push(`${t.de}: „${c.prince.de}" steht nicht in ${c.prince.ref}`);
      }
    }
  }
}

/*
 * Und die Gegenprobe zu `null`: Die Fürstenliste steht geschlossen in
 * 1Chr 27,16-22, das Register verteilt sich über 1Chr 2–8. Wer dort steht,
 * darf hier nicht `null` tragen – und wer nicht dort steht, muss es.
 */
const fuersten = loesen('1Chr 27,16-22');
const fuerstenText = fuersten.verse?.map((v) => v.t).join(' ') ?? '';
const register = loesen('1Chr 2,1-8,40');
const registerText = register.verse?.map((v) => `${v.kap},${v.v} ${v.t}`).join('\n') ?? '';

for (const t of TRIBES) {
  const c = t.chronicles;
  if (!c) continue;
  const gesucht = IM_TEXT[t.de] ?? t.de;
  // Ein Register beginnt mit „Die Kinder <Stamm>" – daran hängt die Prüfung,
  // nicht an jeder beiläufigen Nennung: Sebulon KOMMT in 1Chr 6,62 vor, hat
  // aber trotzdem kein Register.
  const hatRegister = new RegExp(`Die Kinder (des halben Stammes )?${gesucht}`).test(registerText);
  if (c.register === null && hatRegister) {
    chronikFehler.push(`${t.de}: register ist null, aber 1Chr führt „Die Kinder ${gesucht}"`);
  }
  if (c.register !== null && !hatRegister && t.de !== 'Levi') {
    chronikFehler.push(`${t.de}: register gesetzt, aber 1Chr 2–8 nennt kein „Die Kinder ${gesucht}"`);
  }
  const hatFuerst = fuerstenText.includes(gesucht);
  if (c.prince === null && hatFuerst) {
    chronikFehler.push(`${t.de}: prince ist null, aber 1Chr 27,16-22 nennt ihn`);
  }
  if (c.prince !== null && !hatFuerst) {
    chronikFehler.push(`${t.de}: prince gesetzt, aber 1Chr 27,16-22 nennt „${gesucht}" nicht`);
  }
}

/* --- Die Zitate ---------------------------------------------------------- */

/*
 * Die Chronik-Texte zitieren den Wortlaut – „welche waren die festen Städte in
 * Juda und Benjamin", „etliche der Kinder Juda". Ein Zitat in Anführungszeichen
 * ist ein Versprechen: so steht es da. Beim Schreiben dieser Texte ist genau
 * das einmal gebrochen worden (aus „etliche der Kinder Juda" war „von den
 * Kindern Juda" geworden) – gemerkt hat es nur ein Blick in die Datei.
 *
 * Also schlägt es die Prüfung nach: Jedes Zitat in einem Chronik-Text muss in
 * einer der Stellen stehen, die derselbe Text nennt. Groß- und Kleinschreibung
 * bleibt außen vor – ein Zitat darf mitten im Satz beginnen.
 *
 * Geprüft werden die Chronik-Felder, nicht jedes Zitat der Datei: Die
 * Namensdeutungen und Segenssprüche sind Nacherzählung, kein Wortlaut, und
 * würden hier nur Rauschen erzeugen.
 */

const ZITAT = /„([^"„]{12,200})"/g;
const STELLE = /\b(\d?(?:Chr|Kön|Mo|Sam|Jos|Ri))\s(\d+),(\d+)(?:-(\d+))?/g;
const zitatFehler = [];
let zitate = 0;

function pruefeZitate(quelle, text, zusatz = []) {
  // Stellen stehen mal im Satz („… (1Chr 4,33)"), mal nur im ref-Feld daneben.
  // Beides zählt: das Zitat soll belegt sein, nicht schön verlinkt.
  const stellen = [
    ...[...text.matchAll(STELLE)].map((m) => `${m[1]} ${m[2]},${m[3]}${m[4] ? '-' + m[4] : ''}`),
    ...zusatz.filter(Boolean).flatMap((r) => r.split('·').map((x) => x.trim())).filter((x) => !/[–—]/.test(x)),
  ];
  const zitiert = [...text.matchAll(ZITAT)].map((m) => m[1]);
  if (!zitiert.length) return;
  if (!stellen.length) {
    zitatFehler.push(`${quelle}: zitiert, nennt aber keine Stelle`);
    return;
  }
  let heuhaufen = '';
  for (const st of stellen) {
    const r = loesen(st.replace(/^(\d?)(Chr|Kön|Mo|Sam|Jos|Ri)/, '$1$2'));
    if (!r.fehler) heuhaufen += ' ' + r.verse.map((v) => v.t).join(' ');
  }
  const flach = heuhaufen.toLowerCase().replace(/\s+/g, ' ');
  for (const z of zitiert) {
    zitate++;
    if (!flach.includes(z.toLowerCase().replace(/\s+/g, ' '))) {
      zitatFehler.push(`${quelle}: „${z.slice(0, 60)}…" steht in keiner der genannten Stellen (${stellen.join(', ')})`);
    }
  }
}

for (const t of TRIBES) {
  if (t.chronicles?.note) {
    pruefeZitate(`${t.de} (Chronik-Notiz)`, t.chronicles.note.de, [
      t.chronicles.register, t.chronicles.dwelling, t.chronicles.prince?.ref,
    ]);
  }
}
const { PHASES } = await import(path.join(ROOT, 'src/data/tribeHistory.ts'));
for (const ph of PHASES) {
  if (!ph.chronicles) { chronikFehler.push(`Phase ${ph.id}: kein chronicles-Eintrag`); continue; }
  if (ph.chronicles.ref) {
    for (const st of ph.chronicles.ref.split('·').map((x) => x.trim())) {
      // „1Chr 2–8" ist eine Spanne über Kapitel, keine Verse – die überspringt
      // der Auflöser bewusst; sie hat keinen einzelnen Vers zu prüfen.
      if (/[–—]/.test(st)) continue;
      const r = loesen(st);
      if (r.fehler) chronikFehler.push(`Phase ${ph.id}: ${r.fehler}`);
      else belege++;
    }
  }
  pruefeZitate(`Phase ${ph.id}`, ph.chronicles.text.de, [ph.chronicles.ref, ph.ref]);
}

if (wrong.length || chronikFehler.length || zitatFehler.length) {
  if (wrong.length) {
    console.error('\nGrenzen stimmen nicht mit dem Text überein:');
    for (const w of wrong) console.error('  · ' + w);
  }
  if (chronikFehler.length) {
    console.error('\nChronik-Belege stimmen nicht:');
    for (const f of chronikFehler) console.error('  · ' + f);
  }
  if (zitatFehler.length) {
    console.error('\nZitate stimmen nicht mit dem Wortlaut überein:');
    for (const f of zitatFehler) console.error('  · ' + f);
  }
  process.exit(1);
}

const ohneRegister = TRIBES.filter((t) => t.chronicles?.register === null).map((t) => t.de);
const ohneFuerst = TRIBES.filter((t) => t.chronicles?.prince === null).map((t) => t.de);
console.log(
  `${rings.length} Gebiete, ${CASES.length} Orte – jeder liegt in dem Gebiet, das die Bibel ihm gibt.\n` +
    `${belege} Chronik-Stellen und ${zitate} Zitate am Text nachgeschlagen. ` +
    `Ohne Register: ${ohneRegister.join(', ')}. Ohne Fürst: ${ohneFuerst.join(', ')}.`,
);
