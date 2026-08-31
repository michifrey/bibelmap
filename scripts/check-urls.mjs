// Klopft alle festen Adressen ab, die in den Datendateien stehen.
//
//   npm run check:urls                 # alles unter src/data, src/lib, data/media
//   npm run check:urls -- --list       # nur auflisten, nichts abrufen
//
// Warum es das gibt: `check:links` sieht auf die Spendenseiten, `check:bp` auf
// die BibleProject-Guides. Der Rest lag bisher unbesehen da – die 21 Quellen
// der Israel-Karte, die Zeitdokumente der Personen, die Lizenztexte der
// Namensnennung, die Startseiten der Podcasts. Das sind die Adressen, mit denen
// diese App ihre Belege einlöst; eine davon ins Leere zeigen zu lassen, kostet
// genau das, wofür sie dasteht.
//
// Dieselbe Regel wie bei `check:bp` und `check:links`, und sie ist die ganze
// Kunst an so einem Skript: Nur 404 und 410 sind eine Aussage über die Adresse.
// 403, 407, 429, 5xx und Zeitüberschreitungen kommen von Filtern, Proxys und
// müden Servern – sie bleiben unentschieden. Sonst meldet ein geblockter Lauf
// jede Adresse als tot, und nach dem dritten Fehlalarm sieht niemand mehr hin.
//
// Adressen mit Platzhalter (`{z}/{x}/{y}`, `${slug}`) werden übersprungen: das
// sind Muster, keine Adressen. Was aus ihnen gebaut wird, prüfen die Skripte,
// die das Muster kennen.
//
// Abschlusscode: 0 alles beantwortet, 1 mindestens eine Adresse ist fort,
// 2 kein Urteil möglich (nichts hat geantwortet).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIRS = [
  path.join(ROOT, 'src', 'data'),
  path.join(ROOT, 'src', 'lib'),
  path.join(ROOT, 'data', 'media'),
];
const LIST_ONLY = process.argv.includes('--list');
/** Wie viele gleichzeitig – höflich bleiben, es sind fremde Server. */
const PARALLEL = 4;
const TIMEOUT_MS = 15000;

/** Sammelt jede Datei, in der Adressen als Literale stehen können. */
function files(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...files(p));
    else if (/\.(ts|tsx|json)$/.test(e.name)) out.push(p);
  }
  return out;
}

// Endet die Adresse in der Datei, endet sie an Anführungszeichen, Klammer oder
// Leerraum. Satzzeichen am Schluss gehören dem Satz, nicht der Adresse.
const URL_RE = /https?:\/\/[^\s'"`)<>]+/g;
const trim = (u) => u.replace(/[.,;:!?]+$/, '');

/** Muster statt Adresse: alles mit Platzhalter fällt heraus. */
const isTemplate = (u) => u.includes('{') || u.includes('$');

const found = new Map(); // URL -> Dateien, in denen sie steht
for (const dir of DIRS) {
  for (const f of files(dir)) {
    // Attrappen sind zum Üben da, nicht zum Abrufen.
    if (f.includes(`${path.sep}fixtures${path.sep}`)) continue;
    const text = fs.readFileSync(f, 'utf8');
    for (const m of text.matchAll(URL_RE)) {
      const url = trim(m[0]);
      if (isTemplate(url)) continue;
      const rel = path.relative(ROOT, f);
      const list = found.get(url) ?? [];
      if (!list.includes(rel)) list.push(rel);
      found.set(url, list);
    }
  }
}

const targets = [...found.entries()].map(([url, where]) => ({ url, where })).sort((a, b) => a.url.localeCompare(b.url));

if (!targets.length) {
  console.error('Keine Adressen gefunden. Das heisst nicht, dass keine da sind –');
  console.error('eher, dass die Dateien anders aussehen als erwartet.');
  process.exit(2);
}

if (LIST_ONLY) {
  for (const t of targets) console.log(`${t.url}   (${t.where.join(', ')})`);
  console.log(`\n${targets.length} Adressen.`);
  process.exit(0);
}

async function probe(t) {
  const ctl = AbortSignal.timeout(TIMEOUT_MS);
  try {
    // HEAD reicht; wer es nicht mag, bekommt GET hinterher.
    let r = await fetch(t.url, { method: 'HEAD', redirect: 'follow', signal: ctl });
    if (r.status === 405 || r.status === 501 || r.status === 403) {
      r = await fetch(t.url, { redirect: 'follow', signal: AbortSignal.timeout(TIMEOUT_MS) });
    }
    return { ...t, status: r.status, finalUrl: r.url };
  } catch (e) {
    return { ...t, status: 0, error: String(e.message ?? e) };
  }
}

const results = [];
for (let i = 0; i < targets.length; i += PARALLEL) {
  results.push(...(await Promise.all(targets.slice(i, i + PARALLEL).map(probe))));
}

const isMissing = (r) => r.status === 404 || r.status === 410;
const isOk = (r) => r.status >= 200 && r.status < 300;
const norm = (u) => u.replace(/\/$/, '');

const ok = results.filter(isOk);
const missing = results.filter(isMissing);
const undecided = results.filter((r) => !isOk(r) && !isMissing(r));
const moved = ok.filter((r) => r.finalUrl && norm(r.finalUrl) !== norm(r.url));

console.log(`${results.length} Adressen aus src/data, src/lib und data/media`);
console.log(`  erreichbar: ${ok.length}   fehlend: ${missing.length}   unentschieden: ${undecided.length}`);

for (const r of moved) console.log(`  → umgeleitet: ${r.url}  ⇒  ${r.finalUrl}   (${r.where.join(', ')})`);
for (const r of missing) console.log(`  ✗ ${r.status}  ${r.url}   (${r.where.join(', ')})`);
for (const r of undecided) console.log(`  ? unentschieden (${r.error ?? r.status}): ${r.url}`);

if (undecided.length === results.length) {
  console.error('\nKeine einzige Adresse hat der Server selbst beantwortet – Netzsperre,');
  console.error('Proxy oder Ausfall. Das ist kein Befund über die Adressen: der Lauf');
  console.error('sagt hier nichts aus, weder im Guten noch im Schlechten.');
  process.exit(2);
}
if (missing.length) {
  console.error('\nRichtige Adresse heraussuchen und in der genannten Datei eintragen.');
  console.error('Gibt es die Seite nicht mehr, tritt eine andere Quelle an ihre Stelle –');
  console.error('ein Beleg, der ins Leere zeigt, ist keiner.');
  process.exit(1);
}
console.log(
  undecided.length
    ? `\nAlle beantworteten Adressen führen irgendwohin; ${undecided.length} blieben offen.`
    : '\nAlle Adressen führen irgendwohin.',
);
