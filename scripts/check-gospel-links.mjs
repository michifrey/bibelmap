// Klopft die Adressen ab, die die Jesus-Sektion selbst zusammenbaut.
//
//   npm run check:gospel-links
//
// Arbeitsteilung mit `check:urls`: Jenes Skript liest alle festen Adressen aus
// den Datendateien – die BibleProject-Videos, die bibletunes-Staffelseiten, die
// fünf Staffelseiten von „The Chosen“ stehen dort wörtlich und werden dort
// geprüft. Muster überspringt es ausdrücklich, und genau eines gibt es hier:
// die Folgenadresse von bibletunes, die aus Buch und Kapitel entsteht
// (`lukas-2-teil-1`). Ob diese Regel stimmt, weiß nur die Seite selbst.
//
// Geprüft wird eine Stichprobe echter Kapitel – die, zu denen es Stationen
// gibt, nicht irgendwelche. Dieselbe Regel wie überall im Projekt: Nur 404 und
// 410 sind eine Aussage über die Adresse; 403, 407, 429 und Zeitüberschreitung
// kommen von Filtern und Proxys und bleiben unentschieden. Antwortet keine
// einzige Adresse, endet der Lauf mit Code 2 – das ist ausdrücklich kein
// bestandener Lauf, sondern eine Prüfung ohne Gegenüber.

import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const { BT_BOOKS, bibleTunesEpisodeUrl, chapterOfRef } = await import(
  path.join(ROOT, 'src/data/gospelMedia.ts')
);
const { STATIONS } = await import(path.join(ROOT, 'src/data/gospel.ts'));

/** Wie viele Adressen gleichzeitig – höflich bleiben, es ist eine fremde Seite. */
const PARALLEL = 3;
/** Wie viele Kapitel je Evangelium in die Stichprobe kommen. */
const JE_BUCH = 4;

/** Die Kapitel, zu denen es Stationen gibt – gleichmäßig über das Buch verteilt. */
function stichprobe(book) {
  const kapitel = [
    ...new Set(
      STATIONS.filter((s) => s.book === book)
        .map((s) => chapterOfRef(s.ref.de))
        .filter((k) => k !== undefined),
    ),
  ].sort((a, b) => a - b);
  if (kapitel.length <= JE_BUCH) return kapitel;
  const schritt = (kapitel.length - 1) / (JE_BUCH - 1);
  return [...new Set(Array.from({ length: JE_BUCH }, (_, i) => kapitel[Math.round(i * schritt)]))];
}

const targets = [];
for (const b of BT_BOOKS) {
  for (const k of stichprobe(b.book)) {
    const url = bibleTunesEpisodeUrl(b.book, k);
    if (url) targets.push({ url, was: `bibletunes ${b.de} ${k}` });
  }
}

async function check(t) {
  try {
    let r = await fetch(t.url, { method: 'HEAD', redirect: 'follow' });
    if (r.status === 405 || r.status === 501) r = await fetch(t.url, { redirect: 'follow' });
    return { ...t, status: r.status, finalUrl: r.url };
  } catch (e) {
    return { ...t, status: 0, error: String(e.message ?? e) };
  }
}

const results = [];
for (let i = 0; i < targets.length; i += PARALLEL) {
  results.push(...(await Promise.all(targets.slice(i, i + PARALLEL).map(check))));
}

const isMissing = (r) => r.status === 404 || r.status === 410;
const isOk = (r) => r.status >= 200 && r.status < 300;

const ok = results.filter(isOk);
const missing = results.filter(isMissing);
const undecided = results.filter((r) => !isOk(r) && !isMissing(r));
const moved = ok.filter((r) => r.finalUrl && r.finalUrl.replace(/\/$/, '') !== r.url.replace(/\/$/, ''));

console.log(`${results.length} gebaute Folgenadressen (bibletunes, Buch + Kapitel)`);
console.log(`  erreichbar: ${ok.length}   fehlend: ${missing.length}   unentschieden: ${undecided.length}`);
for (const r of moved) console.log(`  → umgeleitet: ${r.was}  ⇒  ${r.finalUrl}`);
for (const r of missing) console.log(`  ✗ ${r.status}  ${r.was}  ${r.url}`);
for (const r of undecided) console.log(`  ? unentschieden (${r.error ?? r.status}): ${r.was}`);

if (undecided.length === results.length) {
  console.error('\nKeine einzige Adresse hat die Seite selbst beantwortet – Netzsperre,');
  console.error('Proxy oder Ausfall. Der Lauf sagt hier nichts aus, weder im Guten');
  console.error('noch im Schlechten.');
  process.exit(2);
}
if (missing.length) {
  console.error('\nDie Regel in bibleTunesEpisodeUrl() stimmt nicht mehr: in');
  console.error('src/data/gospelMedia.ts berichtigen.');
  process.exit(1);
}
console.log(`\nAlle beantworteten Adressen führen irgendwohin.`);
