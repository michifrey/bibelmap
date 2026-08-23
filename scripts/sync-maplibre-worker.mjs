// Legt MapLibres Worker dorthin, wo die App ihn findet.
//
//   node scripts/sync-maplibre-worker.mjs      (läuft als `predev` und `prebuild`)
//
// MapLibre sucht seinen Worker neben der eigenen Datei:
// `new URL('./maplibre-gl-worker.mjs', import.meta.url)`. Im Bündel liegt die
// Bibliothek aber in `assets/TerrainMap-<hash>.js`, und dorthin legt der Build
// den Worker nicht – die Anfrage landet auf der index.html, der Worker stirbt
// an einem `<`, und die Karte bleibt still stehen: Kacheln erscheinen, aber
// kein Gelände und keine Ortspunkte, weil beides den Worker braucht.
//
// Statt an der Bündelung zu drehen, liegen die zwei Dateien unverändert unter
// `public/vendor/maplibre/`, und `TerrainMap.tsx` sagt MapLibre per
// `setWorkerUrl`, wo sie stehen. Der Worker lädt `maplibre-gl-shared.mjs`
// relativ dazu – deshalb müssen beide zusammen liegen.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FROM = path.join(ROOT, 'node_modules', 'maplibre-gl', 'dist');
const TO = path.join(ROOT, 'public', 'vendor', 'maplibre');
const FILES = ['maplibre-gl-worker.mjs', 'maplibre-gl-shared.mjs'];

if (!fs.existsSync(FROM)) {
  console.error('maplibre-gl ist nicht installiert – `npm install` fehlt.');
  process.exit(1);
}

fs.mkdirSync(TO, { recursive: true });

let copied = 0;
for (const name of FILES) {
  const from = path.join(FROM, name);
  const to = path.join(TO, name);
  if (!fs.existsSync(from)) {
    console.error(`fehlt in maplibre-gl/dist: ${name}`);
    process.exit(1);
  }
  // Nur schreiben, wenn sich etwas geändert hat – sonst wird bei jedem Lauf
  // eine Datei angefasst, die der Entwicklungsserver dann neu ausliefert.
  const src = fs.readFileSync(from);
  if (!fs.existsSync(to) || !fs.readFileSync(to).equals(src)) {
    fs.writeFileSync(to, src);
    copied++;
  }
}

const version = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'node_modules', 'maplibre-gl', 'package.json'), 'utf8'),
).version;
console.log(
  `MapLibre-Worker ${version}: ${copied} von ${FILES.length} Dateien erneuert (public/vendor/maplibre/).`,
);
