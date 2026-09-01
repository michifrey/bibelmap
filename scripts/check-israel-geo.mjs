// Prüft die Gebietsstände der Israel-Karte – 7 Stände, 41 Flächen.
//
//   node --experimental-strip-types --import ./scripts/lib/ts-loader.mjs scripts/check-israel-geo.mjs
//   npm run check:israel-geo
//   npm run check:israel-geo -- --gegenprobe
//
// **Der Fehler, der diese Prüfung ausgelöst hat.** In `un1947/j47b`
// („Jüdischer Staat – Küstenebene") stand Haifa [32.82, 34.98] zwischen Akko
// und dem Landesinneren – also auf der falschen Seite des Rings. Die
// Schlusskante schnitt quer hindurch: Der Umriss war eine Schleife und damit
// gar keine Fläche. Auf einer Karte, auf der das Land 600 Pixel breit ist,
// sieht das aus wie ein Zeichenfehler, den man übersieht.
//
// Die Prüfung rechnet deshalb jede Kante gegen jede andere. Nachbarkanten
// teilen sich einen Punkt und werden übersprungen, ebenso die Schlusskante
// gegen die erste – sonst meldet jedes gesunde Vieleck sich selbst.
//
// **Zur Bereichsgrenze.** Der Kasten muss den Sinai mit einschliessen: Israel
// hielt ihn von 1967 bis 1982, und die beiden Flächen dafür liegen weit
// südwestlich des Kernlands. Ein enger gezogener Kasten meldet sie als
// Ausreisser – so ist es der ersten Sondierung ergangen.

import { SNAPSHOTS, PLACES, NEIGHBOURS } from '../src/data/israelGeo.ts';

/** Weit genug für den Sinai (bis ≈ 27,7° N / 32,5° O) und den Golan. */
const BEREICH = { laMin: 27, laMax: 34.5, loMin: 31.5, loMax: 37.5 };

const gegenprobe = process.argv.includes('--gegenprobe');

const d = (a, b, c) => (c[1] - a[1]) * (b[0] - a[0]) - (b[1] - a[1]) * (c[0] - a[0]);
const kreuzt = (p1, p2, p3, p4) => {
  const d1 = d(p3, p4, p1), d2 = d(p3, p4, p2), d3 = d(p1, p2, p3), d4 = d(p1, p2, p4);
  return ((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) && ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0));
};
function ueberschneidungen(p) {
  const n = p.length;
  const paare = [];
  for (let i = 0; i < n; i++) {
    for (let j = i + 2; j < n; j++) {
      if (i === 0 && j === n - 1) continue; // Schlusskante und erste Kante teilen einen Punkt
      if (kreuzt(p[i], p[(i + 1) % n], p[j], p[(j + 1) % n])) paare.push(`${i}→${(i + 1) % n} × ${j}→${(j + 1) % n}`);
    }
  }
  return paare;
}

let staende = SNAPSHOTS;
if (gegenprobe) {
  const s = SNAPSHOTS.find((x) => x.id === 'un1947');
  const v = s.areas.find((a) => a.id === 'j47b');
  const a = (id, ae) => ({ ...v, id, ...ae });
  // Der echte Fehler, wieder eingebaut: Haifa zurück an die falsche Stelle.
  const schleife = [v.polygon[0], v.polygon.at(-1), ...v.polygon.slice(1, -1)];
  staende = [
    ...SNAPSHOTS,
    { id: 'gp', year: 9999, de: 'Gegenprobe', en: 'Counter-test', areas: [
      a('gp1', { polygon: schleife }),                                        // Umriss als Schleife
      a('gp2', { polygon: [[10, 10], [10, 11], [11, 11]] }),                  // Punkt ausserhalb des Bereichs
      a('gp3', { polygon: v.polygon.slice(0, 2) }),                           // unter drei Punkten
      a('gp4', { color: 'blau' }),                                            // Farbe kein Hexwert
      a('gp5', { en: '' }),                                                   // Name fehlt in einer Sprache
      a('gp6', { note: { de: 'Da', en: '' } }),                               // note nur einsprachig
      // Die Duplikat-Probe hängt an einer **sauberen** Fläche: Wäre sie eine
      // Kopie einer der anderen, erbte sie deren Fehler mit und meldete zwei
      // Dinge – dann prüft sie nicht mehr, was sie zu prüfen vorgibt.
      a('gp7', {}),
      a('gp7', {}),                                                           // doppelte Kennung im Stand
    ] },
  ];
}

const fehler = [];
const standIds = new Set();
for (const [i, s] of staende.entries()) {
  if (standIds.has(s.id)) fehler.push(`Stand ${s.id}: Kennung kommt zweimal vor.`);
  standIds.add(s.id);
  if (i > 0 && !gegenprobe && s.year <= staende[i - 1].year) {
    fehler.push(`Stand ${s.id}: Jahr ${s.year} liegt nicht nach ${staende[i - 1].id} (${staende[i - 1].year}).`);
  }

  const flaechenIds = new Set();
  for (const a of s.areas) {
    const wo = `${s.id}/${a.id} („${a.de}")`;
    if (flaechenIds.has(a.id)) fehler.push(`${wo}: Kennung kommt im selben Stand zweimal vor.`);
    flaechenIds.add(a.id);

    if (!a.de?.trim() || !a.en?.trim()) fehler.push(`${wo}: Name fehlt in einer Sprache.`);
    if (a.note && (!a.note.de?.trim() || !a.note.en?.trim())) fehler.push(`${wo}: note steht nur in einer Sprache.`);
    if (!/^#[0-9a-f]{3,8}$/i.test(a.color ?? '')) fehler.push(`${wo}: color „${a.color}" ist kein Hexwert.`);

    const p = a.polygon ?? [];
    if (p.length < 3) { fehler.push(`${wo}: ${p.length} Punkte – eine Fläche braucht drei.`); continue; }

    const raus = p.filter(([la, lo]) => la < BEREICH.laMin || la > BEREICH.laMax || lo < BEREICH.loMin || lo > BEREICH.loMax);
    if (raus.length) fehler.push(`${wo}: ${raus.length} Punkt(e) ausserhalb der Region, z. B. [${raus[0]}].`);

    const doppelt = p.filter(([la, lo], k) => k > 0 && la === p[k - 1][0] && lo === p[k - 1][1]);
    if (doppelt.length) fehler.push(`${wo}: ${doppelt.length} Punkt(e) doppelt hintereinander.`);
    if (p.length > 2 && p[0][0] === p.at(-1)[0] && p[0][1] === p.at(-1)[1]) {
      fehler.push(`${wo}: Ring am Ende noch einmal geschlossen – Leaflet schliesst selbst.`);
    }

    const kr = ueberschneidungen(p);
    if (kr.length) fehler.push(`${wo}: Umriss überschneidet sich selbst (${kr.join(', ')}) – das zeichnet als Schleife, nicht als Fläche.`);
  }
}

for (const [name, liste] of [['PLACES', PLACES], ['NEIGHBOURS', NEIGHBOURS]]) {
  for (const o of liste) {
    if (!o.de?.trim() || !o.en?.trim()) fehler.push(`${name}: „${o.de || o.en}" ohne Namen in einer Sprache.`);
    if (o.lat < BEREICH.laMin || o.lat > BEREICH.laMax || o.lon < BEREICH.loMin || o.lon > BEREICH.loMax) {
      fehler.push(`${name}: „${o.de}" liegt bei [${o.lat}, ${o.lon}] ausserhalb der Region.`);
    }
  }
}

if (gegenprobe) {
  const ERWARTET = [
    ['gp1', /überschneidet sich selbst/],
    ['gp2', /ausserhalb der Region/],
    ['gp3', /eine Fläche braucht drei/],
    ['gp4', /ist kein Hexwert/],
    ['gp5', /Name fehlt in einer Sprache/],
    ['gp6', /note steht nur in einer Sprache/],
  ];
  let gut = 0;
  for (const [id, muster] of ERWARTET) {
    const meine = fehler.filter((f) => f.startsWith(`gp/${id} `));
    if (meine.some((f) => muster.test(f))) gut++;
    else console.log(`  ✗ ${id}: ${meine.length ? 'gemeldet, aber falsch: ' + meine.join(' / ') : 'gar nicht gemeldet'}`);
    if (meine.length > 1) console.log(`  ⚠ ${id} meldet ${meine.length} Dinge: ${meine.join(' / ')}`);
  }
  const doppelt = fehler.some((f) => /im selben Stand zweimal/.test(f));
  if (!doppelt) console.log('  ✗ doppelte Flächenkennung nicht gemeldet');
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

const flaechen = SNAPSHOTS.flatMap((s) => s.areas);
const punkte = flaechen.reduce((n, a) => n + a.polygon.length, 0);
console.log(
  `✓ ${SNAPSHOTS.length} Gebietsstände, ${flaechen.length} Flächen aus ${punkte} Punkten: ` +
    `kein Umriss überschneidet sich, alle Punkte in der Region, jede Fläche zweisprachig benannt.`,
);
