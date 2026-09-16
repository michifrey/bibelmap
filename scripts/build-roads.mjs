// Aus Luftlinien werden Wege: die Etappen der Reisen über ein antikes
// Straßennetz führen.
//
//   ROADS=/pfad/zu/itinere_roads.geojson npm run roads
//   node --experimental-strip-types --import ./scripts/lib/ts-loader.mjs \
//     scripts/build-roads.mjs --quelle <datei> [--out <datei>] [--still]
//
// Ausgabe: `public/data/roads.json` – je Reise und Etappe eine fertige
// Punktkette, kodiert als Polylinie. Das Straßennetz selbst bleibt draußen;
// kein Browser soll zehntausend Segmente laden, um fünfzehn Reisen zu zeigen.
//
// ## Woher die Straßen kommen
//
// Dieses Skript bringt **keine Daten mit**, so wie `build-data.mjs` den
// OpenBible-Datensatz nicht mitbringt. Es liest, was man ihm gibt: eine
// GeoJSON-Datei mit `LineString`- oder `MultiLineString`-Geometrien. Empfohlen:
//
//   **Itiner-e** – „A high-resolution dataset of roads of the Roman Empire"
//   (de Soto u. a. 2025, Scientific Data), rund 15.000 Straßenabschnitte,
//   **CC BY 4.0**. Download: https://itiner-e.org bzw. das Zenodo-Archiv der
//   statischen Fassung.
//
// **Die Lizenz ist keine Formalie.** Die bekannteste Alternative, das
// Straßennetz aus dem Barrington-Atlas (DARMC/AWMC, auch in mehreren
// GitHub-Ablagen weiterverteilt), steht unter **CC BY-NC** – nicht-kommerziell.
// In einem Projekt unter GPL-3.0, dessen Quellen sonst ausnahmslos frei sind,
// hat so ein Datensatz nichts verloren: Er nähme den Nutzern Rechte, die die
// GPL ihnen zusagt. Wer eine Datei einsetzt, trägt ihre Herkunft in
// `--name/--url/--lizenz` ein, und die App nennt sie unter der Karte.
//
// ## Was das Skript tut
//
//   1. **Netz lesen** und auf den Ausschnitt der Reisen beschneiden.
//   2. **Knoten verschweißen**: Zwei Segmentenden, die keine dreißig Meter
//      trennen, sind derselbe Knoten. Ohne das zerfiele das Netz in tausend
//      Inseln, die sich nur fast berühren – der häufigste Grund, warum eine
//      Wegsuche in solchen Daten „kein Weg" sagt.
//   3. **Stationen anschließen**: die nächste Stelle im Netz suchen. Liegt sie
//      weiter als 15 km entfernt, gilt die Station als nicht am Netz.
//   4. **Weg suchen** (A* mit Luftlinie als Schätzung).
//   5. **Verwerfen, was unglaubwürdig ist**: ein Weg, der mehr als viermal so
//      lang ist wie die Luftlinie, ist keine Straße, sondern ein Umweg durch
//      die Lücken der Daten.
//   6. **Ausdünnen** (Douglas-Peucker, 25 m) und kodieren.
//
// Was keinen Weg bekommt, behält seine Luftlinie – und die Oberfläche sagt es.
// Seewege bekommen von vornherein keinen: Eine Straße über das Mittelmeer wäre
// ein Fehler, kein Fund.
//
// ## Was das Ergebnis nicht behauptet
//
// Das Netz ist **römisch**. Für die Mission und für die Wege Jesu ist das die
// richtige Zeit; für Abraham, den Auszug und die Landnahme liegt es tausend
// Jahre daneben. Deshalb trägt jede Reise ihre Epoche mit, und die Oberfläche
// sagt bei den älteren dazu: die Trasse folgt dem Gelände, und das Gelände ist
// dasselbe geblieben – die Straße ist es nicht.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { routen } from './lib/routen.mjs';
import { distanceKm } from '../src/lib/route.ts';
import { encodePolyline } from '../src/lib/polyline.ts';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/* --- Stellschrauben ------------------------------------------------------ */

/** Zwei Enden, die näher beieinander liegen, sind derselbe Knoten. */
const WELD_M = 30;
/** Weiter als das von der nächsten Straße, und die Station hängt nicht am Netz. */
const MAX_SNAP_KM = 15;
/** Ein Weg, der länger ist als das Vielfache der Luftlinie, wird verworfen. */
const MAX_DETOUR = 4;
/** Ausdünnen: was weniger als das von der Linie abweicht, fällt weg. */
const SIMPLIFY_M = 25;
/** Rand um den Ausschnitt der Reisen, in Grad. */
const MARGIN_DEG = 1.5;

/* --- Aufruf -------------------------------------------------------------- */

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}
const still = process.argv.includes('--still');
const log = (...a) => {
  if (!still) console.log(...a);
};

const QUELLE = arg('quelle', process.env.ROADS);
const OUT = path.resolve(ROOT, arg('out', 'public/data/roads.json'));
const HERKUNFT = {
  name: arg('name', process.env.ROADS_NAME ?? 'Itiner-e'),
  url: arg('url', process.env.ROADS_URL ?? 'https://itiner-e.org'),
  license: arg('lizenz', process.env.ROADS_LICENSE ?? 'CC-BY-4.0'),
  stand: arg('stand', process.env.ROADS_STAND ?? ''),
};

if (!QUELLE) {
  console.error(
    '✗ Kein Straßendatensatz angegeben.\n\n' +
      '  ROADS=/pfad/zu/itinere_roads.geojson npm run roads\n\n' +
      '  Empfohlen: Itiner-e (CC BY 4.0), https://itiner-e.org – siehe Kopf dieser Datei.\n' +
      '  Datensätze unter CC BY-NC (DARMC, AWMC) gehören nicht in dieses Projekt.',
  );
  process.exit(1);
}
if (!fs.existsSync(QUELLE)) {
  console.error(`✗ ${QUELLE} gibt es nicht.`);
  process.exit(1);
}

/* --- Die Reisen, für die ein Weg gesucht wird ---------------------------- */

// Die Liste steht in `scripts/lib/routen.mjs` – die Prüfung liest dieselbe.
const ROUTEN = routen();

/* --- Netz lesen ---------------------------------------------------------- */

const alleStops = ROUTEN.flatMap((r) => r.stops);
const BBOX = {
  minLat: Math.min(...alleStops.map((s) => s.lat)) - MARGIN_DEG,
  maxLat: Math.max(...alleStops.map((s) => s.lat)) + MARGIN_DEG,
  minLon: Math.min(...alleStops.map((s) => s.lon)) - MARGIN_DEG,
  maxLon: Math.max(...alleStops.map((s) => s.lon)) + MARGIN_DEG,
};

const imAusschnitt = ([lat, lon]) =>
  lat >= BBOX.minLat && lat <= BBOX.maxLat && lon >= BBOX.minLon && lon <= BBOX.maxLon;

/** Jede Geometrie als Liste von Punktketten – die dritte Zahl (Höhe) fällt weg. */
function linien(geom) {
  if (!geom) return [];
  if (geom.type === 'LineString') return [geom.coordinates];
  if (geom.type === 'MultiLineString') return geom.coordinates;
  if (geom.type === 'GeometryCollection') return (geom.geometries ?? []).flatMap(linien);
  return [];
}

const roh = JSON.parse(fs.readFileSync(QUELLE, 'utf8'));
const features = roh.type === 'FeatureCollection' ? roh.features : [roh];

/* --- Graph --------------------------------------------------------------- */

/**
 * Knoten werden über ein Raster gefunden: Die Zelle ist so groß wie der
 * Schweißabstand, und gesucht wird in den neun Zellen ringsum. Ohne das wäre
 * jede Suche ein Durchlauf über hunderttausend Punkte.
 */
const ZELLE = WELD_M / 111_320; // Grad je Meter, grob – für ein Raster genug.
const raster = new Map();
const knoten = [];

function zellenSchluessel(lat, lon) {
  return `${Math.floor(lat / ZELLE)}:${Math.floor(lon / ZELLE)}`;
}

function knotenFuer(lat, lon) {
  const zy = Math.floor(lat / ZELLE);
  const zx = Math.floor(lon / ZELLE);
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      const liste = raster.get(`${zy + dy}:${zx + dx}`);
      if (!liste) continue;
      for (const id of liste) {
        if (distanceKm(knoten[id], [lat, lon]) * 1000 <= WELD_M) return id;
      }
    }
  }
  const id = knoten.length;
  knoten.push([lat, lon]);
  const key = zellenSchluessel(lat, lon);
  const liste = raster.get(key);
  if (liste) liste.push(id);
  else raster.set(key, [id]);
  return id;
}

/** Nachbarn je Knoten: `[Knoten, Kilometer]`. */
const kanten = [];
function kante(a, b) {
  if (a === b) return;
  const km = distanceKm(knoten[a], knoten[b]);
  (kanten[a] ??= []).push([b, km]);
  (kanten[b] ??= []).push([a, km]);
}

let segmente = 0;
let netzKm = 0;

/**
 * Eine Punktkette in die Stücke zerlegen, die im Ausschnitt liegen.
 *
 * Nicht filtern, zerlegen – das ist der Unterschied zwischen einer Straße und
 * einer Erfindung: Eine Linie, die den Ausschnitt verlässt und weiter nördlich
 * zurückkommt, hätte nach dem Filtern zwei Punkte nebeneinander, die in
 * Wahrheit hundert Kilometer auseinanderliegen. Daraus würde eine Kante, eine
 * Abkürzung quer durchs Land, die es nie gab.
 */
function stuecke(linie) {
  const out = [];
  let lauf = [];
  for (const p of linie) {
    const punkt = [Number(p[1]), Number(p[0])];
    if (Number.isFinite(punkt[0]) && Number.isFinite(punkt[1]) && imAusschnitt(punkt)) {
      lauf.push(punkt);
    } else if (lauf.length) {
      out.push(lauf);
      lauf = [];
    }
  }
  if (lauf.length) out.push(lauf);
  return out.filter((l) => l.length >= 2);
}

for (const ft of features) {
  for (const linie of linien(ft.geometry)) {
    for (const punkte of stuecke(linie)) {
      segmente++;
      let vor = knotenFuer(punkte[0][0], punkte[0][1]);
      for (let i = 1; i < punkte.length; i++) {
        const jetzt = knotenFuer(punkte[i][0], punkte[i][1]);
        if (jetzt !== vor) {
          netzKm += distanceKm(knoten[vor], knoten[jetzt]);
          kante(vor, jetzt);
        }
        vor = jetzt;
      }
    }
  }
}

log(`Netz: ${segmente} Segmente, ${knoten.length} Knoten, ${Math.round(netzKm)} km im Ausschnitt.`);
if (knoten.length < 2) {
  console.error('✗ Im Ausschnitt der Reisen liegt kein einziges Straßensegment – falsche Datei?');
  process.exit(1);
}

/* --- Stationen anschließen ----------------------------------------------- */

/**
 * Ein zweites, grobes Raster – nur zum Suchen.
 *
 * Das Schweißraster hat Zellen von dreißig Metern. Eine Station, deren nächste
 * Straße zehn Kilometer entfernt liegt, verlangte darin dreihundert Ringe,
 * also hunderttausende Zellenabfragen – je Station. Gemessen: Das Skript
 * stand. Hier ist die Zelle ein halbes Grad groß, und fünfzehn Kilometer sind
 * nie mehr als ein Ring.
 */
const SUCH_ZELLE = 0.5;
const suchRaster = new Map();
for (let id = 0; id < knoten.length; id++) {
  const key = `${Math.floor(knoten[id][0] / SUCH_ZELLE)}:${Math.floor(knoten[id][1] / SUCH_ZELLE)}`;
  const liste = suchRaster.get(key);
  if (liste) liste.push(id);
  else suchRaster.set(key, [id]);
}

/**
 * Der nächste Knoten zu einem Punkt, oder `null`, wenn keiner nah genug liegt.
 * Ein halbes Grad sind rund 55 km – die eigene Zelle und die acht ringsum
 * decken jeden Anschluss ab, der noch zählt.
 */
function naechsterKnoten(lat, lon) {
  const zy = Math.floor(lat / SUCH_ZELLE);
  const zx = Math.floor(lon / SUCH_ZELLE);
  let bester = -1;
  let besteKm = Infinity;
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      for (const id of suchRaster.get(`${zy + dy}:${zx + dx}`) ?? []) {
        const km = distanceKm(knoten[id], [lat, lon]);
        if (km < besteKm) {
          besteKm = km;
          bester = id;
        }
      }
    }
  }
  return bester >= 0 && besteKm <= MAX_SNAP_KM ? { id: bester, km: besteKm } : null;
}

/* --- Wegsuche (A*) -------------------------------------------------------- */

/** Ein Haufen, der immer den kleinsten Wert zuerst hergibt. */
class Halde {
  constructor() {
    this.a = [];
  }
  push(wert, prio) {
    const a = this.a;
    a.push([prio, wert]);
    let i = a.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (a[p][0] <= a[i][0]) break;
      [a[p], a[i]] = [a[i], a[p]];
      i = p;
    }
  }
  pop() {
    const a = this.a;
    if (a.length === 0) return undefined;
    const oben = a[0];
    const letztes = a.pop();
    if (a.length) {
      a[0] = letztes;
      let i = 0;
      for (;;) {
        const l = 2 * i + 1;
        const r = l + 1;
        let k = i;
        if (l < a.length && a[l][0] < a[k][0]) k = l;
        if (r < a.length && a[r][0] < a[k][0]) k = r;
        if (k === i) break;
        [a[k], a[i]] = [a[i], a[k]];
        i = k;
      }
    }
    return oben[1];
  }
  get size() {
    return this.a.length;
  }
}

/**
 * Kürzester Weg von Knoten zu Knoten. A* statt Dijkstra: Die Luftlinie zum
 * Ziel ist eine zulässige Schätzung (sie unterschätzt nie), und damit läuft
 * die Suche in Richtung Ziel statt kreisförmig in alle Richtungen. Bei
 * zweihundert Etappen über ein Netz dieser Größe ist das der Unterschied
 * zwischen Minuten und Sekunden.
 */
function suchWeg(von, nach) {
  if (von === nach) return { pfad: [von], km: 0 };
  const dist = new Map([[von, 0]]);
  const vorher = new Map();
  const fertig = new Set();
  const halde = new Halde();
  halde.push(von, distanceKm(knoten[von], knoten[nach]));
  while (halde.size) {
    const k = halde.pop();
    if (fertig.has(k)) continue;
    fertig.add(k);
    if (k === nach) break;
    const d = dist.get(k) ?? Infinity;
    for (const [n, km] of kanten[k] ?? []) {
      const neu = d + km;
      if (neu < (dist.get(n) ?? Infinity)) {
        dist.set(n, neu);
        vorher.set(n, k);
        halde.push(n, neu + distanceKm(knoten[n], knoten[nach]));
      }
    }
  }
  if (!fertig.has(nach)) return null;
  const pfad = [nach];
  for (let k = nach; vorher.has(k); ) {
    k = vorher.get(k);
    pfad.push(k);
  }
  pfad.reverse();
  return { pfad, km: dist.get(nach) ?? 0 };
}

/* --- Ausdünnen ----------------------------------------------------------- */

/** Abstand eines Punktes von der Strecke a–b, in Metern (eben gerechnet). */
function abstandM(p, a, b) {
  const kx = 111_320 * Math.cos(((a[0] + b[0]) / 2) * (Math.PI / 180));
  const ky = 110_540;
  const px = (p[1] - a[1]) * kx;
  const py = (p[0] - a[0]) * ky;
  const bx = (b[1] - a[1]) * kx;
  const by = (b[0] - a[0]) * ky;
  const laenge = bx * bx + by * by;
  const t = laenge === 0 ? 0 : Math.max(0, Math.min(1, (px * bx + py * by) / laenge));
  const dx = px - t * bx;
  const dy = py - t * by;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Douglas-Peucker: was die Linie nicht ändert, fällt weg.
 *
 * Mit eigenem Stapel statt Rekursion. Der Algorithmus teilt im schlechtesten
 * Fall bei jedem Schritt nur einen Punkt ab, und ein Weg quer durchs Reich hat
 * zehntausende Punkte – rekursiv wäre das irgendwann ein übergelaufener
 * Aufrufstapel, und zwar genau bei dem Datensatz, der zu groß zum Ausprobieren
 * ist. Statt Punktketten zu kopieren, merkt sich eine Maske, was bleibt.
 */
function duenneAus(punkte, toleranzM) {
  if (punkte.length < 3) return punkte;
  const behalten = new Uint8Array(punkte.length);
  behalten[0] = 1;
  behalten[punkte.length - 1] = 1;
  const stapel = [[0, punkte.length - 1]];
  while (stapel.length) {
    const [von, bis] = stapel.pop();
    let maxAbstand = 0;
    let maxI = -1;
    for (let i = von + 1; i < bis; i++) {
      const d = abstandM(punkte[i], punkte[von], punkte[bis]);
      if (d > maxAbstand) {
        maxAbstand = d;
        maxI = i;
      }
    }
    if (maxI >= 0 && maxAbstand > toleranzM) {
      behalten[maxI] = 1;
      stapel.push([von, maxI], [maxI, bis]);
    }
  }
  return punkte.filter((_, i) => behalten[i]);
}

/* --- Und jetzt die Reisen ------------------------------------------------ */

const wege = {};
const bericht = { etappen: 0, aufStrasse: 0, ohneNetz: 0, keinWeg: 0, umweg: 0, see: 0 };
const anschluesse = [];

for (const route of ROUTEN) {
  const legs = [];
  let km = 0;
  let luftKm = 0;
  for (let i = 0; i + 1 < route.stops.length; i++) {
    const a = route.stops[i];
    const b = route.stops[i + 1];
    const luft = distanceKm([a.lat, a.lon], [b.lat, b.lon]);
    luftKm += luft;
    bericht.etappen++;

    // Über Wasser führt keine Straße, und zwei Stationen am selben Ort
    // brauchen keinen Weg.
    if (b.sea || luft < 0.05) {
      if (b.sea) bericht.see++;
      legs.push(null);
      km += luft;
      continue;
    }

    const vonK = naechsterKnoten(a.lat, a.lon);
    const nachK = naechsterKnoten(b.lat, b.lon);
    if (!vonK || !nachK) {
      bericht.ohneNetz++;
      legs.push(null);
      km += luft;
      continue;
    }
    anschluesse.push({ route: route.id, km: Math.max(vonK.km, nachK.km) });

    const gefunden = suchWeg(vonK.id, nachK.id);
    if (!gefunden) {
      bericht.keinWeg++;
      legs.push(null);
      km += luft;
      continue;
    }
    // Die beiden Stücke von der Station zum Netz sind Luftlinie; sie zählen
    // zur Länge, machen den Weg aber nicht zur Straße.
    const gesamt = gefunden.km + vonK.km + nachK.km;
    if (gesamt > luft * MAX_DETOUR) {
      bericht.umweg++;
      legs.push(null);
      km += luft;
      continue;
    }

    const punkte = [
      [a.lat, a.lon],
      ...gefunden.pfad.map((id) => knoten[id]),
      [b.lat, b.lon],
    ];
    const duenn = duenneAus(punkte, SIMPLIFY_M);
    legs.push(encodePolyline(duenn));
    km += gesamt;
    bericht.aufStrasse++;
  }
  // Eine Reise, für die keine einzige Etappe einen Weg hat, steht gar nicht
  // erst in der Datei – sonst lädt der Browser eine Liste aus lauter `null`.
  if (legs.some((l) => l !== null)) {
    wege[route.id] = {
      legs,
      km: Math.round(km * 10) / 10,
      luftKm: Math.round(luftKm * 10) / 10,
      roemisch: route.roemisch,
    };
  }
}

const daten = {
  quelle: HERKUNFT,
  netz: { segmente, knoten: knoten.length, km: Math.round(netzKm) },
  wege,
};

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(daten));

const groesse = fs.statSync(OUT).size;
log(
  `Wege: ${bericht.aufStrasse} von ${bericht.etappen} Etappen folgen einer Straße ` +
    `(${bericht.ohneNetz} ohne Anschluss, ${bericht.keinWeg} ohne Verbindung, ` +
    `${bericht.umweg} als Umweg verworfen, ${bericht.see} über See).`,
);
log(`${Object.keys(wege).length} Reisen in ${path.relative(ROOT, OUT)} – ${(groesse / 1024).toFixed(0)} kB.`);
if (anschluesse.length) {
  const weit = anschluesse.sort((x, y) => y.km - x.km).slice(0, 5);
  log('Die weitesten Anschlüsse: ' + weit.map((w) => `${w.route} ${w.km.toFixed(1)} km`).join(', '));
}
