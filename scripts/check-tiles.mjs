// Prüft, dass die Kachelquellen an einer Stelle stehen – und keine davon
// einen Schlüssel verlangt.
//
//   npm run check:tiles
//
// Warum es das gibt: Im August 2026 fing CARTO an, für seine Kachelserver
// einen API-Schlüssel zu verlangen. Über Nacht antwortete jede der sieben
// Karten dieser App mit „API key required" und blieb leer. Der Ausfall selbst
// war fremdes Werk; dass er so weh tat, war eigenes: dieselbe Adresse lag in
// FÜNF Dateien – MapView, RouteMap, ChurchMode, QuizMode, MissionMap. Zu
// ändern waren nicht eine Zeile, sondern fünf, und jede einzeln zu finden.
//
// Zwei Dinge hält diese Prüfung deshalb fest:
//
//   1. Kachel-Adressen stehen nur in `src/lib/basemaps.ts`. Wer eine Karte
//      dazubaut, holt sie sich dort mit `addBasemap()`, statt eine sechste
//      Kopie anzulegen.
//   2. Keine Adresse trägt einen Schlüssel. Ein Schlüssel im Quelltext ist
//      entweder öffentlich – dann ist er keiner – oder er fehlt beim Bauen,
//      und die Karte bleibt leer. Beides bindet ein Hobbyprojekt an ein Konto.
//
// Das ist keine Prüfung gegen Kachelserver: sie liest nur Dateien und braucht
// kein Netz. Ob ein Server *antwortet*, sagt sie nicht – das sagt die App
// selbst, mit dem Hinweis aus `tileNotice.ts`.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const QUELLE = 'src/lib/basemaps.ts';

/** Sieht aus wie eine Kachel-Adresse: eine URL mit {z}/{x}/{y} darin. */
const KACHEL = /(['"`])(https?:\/\/[^'"`]*\{[zxy]\}[^'"`]*)\1/g;
/** Namen, unter denen Kachelserver ihre Schlüssel verlangen. */
const SCHLUESSEL = /\b(api[_-]?key|apikey|access[_-]?token|accessToken|subscription[-_]?key|\{key\}|\{token\}|appid)\b/i;

function dateien(dir) {
  const raus = [];
  for (const e of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
    const rel = `${dir}/${e.name}`;
    if (e.isDirectory()) raus.push(...dateien(rel));
    else if (/\.(ts|tsx)$/.test(e.name)) raus.push(rel);
  }
  return raus;
}

const fehler = [];
const adressen = [];

for (const rel of dateien('src')) {
  const text = fs.readFileSync(path.join(ROOT, rel), 'utf8');
  for (const [, , url] of text.matchAll(KACHEL)) {
    adressen.push({ rel, url });
    if (rel !== QUELLE) {
      fehler.push(
        `${rel}: eigene Kachel-Adresse ${url}\n` +
          `    → gehört nach ${QUELLE}; die Karte holt sie sich mit addBasemap().`,
      );
    }
    if (SCHLUESSEL.test(url)) {
      fehler.push(`${rel}: die Adresse verlangt einen Schlüssel – ${url}`);
    }
  }
}

// Die Quelle selbst muss es geben, sonst prüft die Prüfung ins Leere.
if (!fs.existsSync(path.join(ROOT, QUELLE))) {
  fehler.push(`${QUELLE} fehlt – ohne sie hat diese Prüfung nichts zu prüfen.`);
}

const eigene = adressen.filter((a) => a.rel === QUELLE);
if (eigene.length === 0) fehler.push(`${QUELLE} nennt keine einzige Kachel-Adresse.`);

if (fehler.length) {
  console.error(`${fehler.length} Befund${fehler.length === 1 ? '' : 'e'}:\n`);
  for (const f of fehler) console.error(`  ✗ ${f}`);
  console.error('');
  process.exit(1);
}

console.log(
  `${eigene.length} Kachelquellen, alle in ${QUELLE} und alle ohne Schlüssel.`,
);
