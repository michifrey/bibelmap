// Klopft die fremden Adressen der Jesus-Sektion ab.
//
//   npm run check:gospel-links
//
// Geprüft werden drei Sorten Adressen aus `src/data/gospelMedia.ts` und
// `src/data/chosen.ts`:
//
//   * die Videoseiten von BibleProject (Buchüberblicke und Themen),
//   * die Staffelseiten von bibletunes.de und je Evangelium eine Stichprobe
//     der Folgenadressen – die baut die App aus Buch und Kapitel, und ob die
//     Regel stimmt, weiß nur die Seite selbst,
//   * die Serienseite von „The Chosen“.
//
// Wie `check:bp` macht dieses Skript aus einem 403 keinen Befund: Ein Filter
// oder Proxy antwortet mit 403, 407 oder 429, wo die Seite selbst 200 sagen
// würde. Nur 404 und 410 sind eine Aussage über die Adresse. Antwortet keine
// einzige Adresse, endet der Lauf mit Code 2 – das ist ausdrücklich kein
// bestandener Lauf, sondern eine Prüfung ohne Gegenüber.
//
// Deshalb steht es auch nicht in `npm run check`: ein Anbieter, der gerade
// nicht antwortet, darf keine Veröffentlichung aufhalten.

import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const { BP_VIDEOS, BT_BOOKS, bibleTunesEpisodeUrl } = await import(
  path.join(ROOT, 'src/data/gospelMedia.ts')
);
const { CHOSEN_URL } = await import(path.join(ROOT, 'src/data/chosen.ts'));

/** Wie viele Adressen gleichzeitig – höflich bleiben, es sind fremde Seiten. */
const PARALLEL = 4;
/** Kapitel, die je Evangelium stichprobenartig geprüft werden. */
const STICHPROBE = [1, 5, 20];

const targets = [];
for (const v of BP_VIDEOS) {
  targets.push({ url: v.url, was: `BibleProject ${v.id}` });
}
for (const b of BT_BOOKS) {
  targets.push({ url: b.url, was: `bibletunes ${b.de} (Staffelseite)` });
  for (const k of STICHPROBE) {
    const url = bibleTunesEpisodeUrl(b.book, k);
    if (url) targets.push({ url, was: `bibletunes ${b.de} ${k}` });
  }
}
targets.push({ url: CHOSEN_URL, was: 'The Chosen' });

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

console.log(`${results.length} fremde Adressen der Jesus-Sektion`);
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
  console.error('\nTote Adressen: in src/data/gospelMedia.ts berichtigen oder streichen.');
  process.exit(1);
}
console.log(`\nAlle beantworteten Adressen führen irgendwohin.`);
