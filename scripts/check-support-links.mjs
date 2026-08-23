// Klopft die Adressen der Unterstützen-Seite ab.
//
//   npm run check:links              # Spenden- und Projektseiten
//   npm run check:links -- --donate  # nur die Spendenseiten
//   npm run check:links -- --src …   # gegen eine andere Datei (Prüflauf)
//
// Warum es das gibt: `src/data/support.ts` verlinkt zu jedem Projekt seine
// Startseite und, wo es eine gibt, seine Spendenseite. Ein toter Spendenlink
// ist die eine Sorte Fehler, die diese Seite nicht haben darf – sie hat genau
// den einen Zweck, Geld zu den Projekten zu leiten.
//
// In der Entwicklungsumgebung der Agenten sind diese Hosts gesperrt; dort sagt
// der Lauf nichts aus und sagt das auch. Wer Netzzugriff hat, klärt es hier.
//
// Wie `check-bp-guides.mjs`: nur 404 und 410 sind eine Aussage über die
// Adresse. 403, 407, 429, 5xx und Zeitüberschreitungen bleiben unentschieden –
// sonst meldet ein blockierter Lauf jede Adresse als tot.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const ONLY_DONATE = args.includes('--donate');
const srcArg = args.indexOf('--src');
/** `--src` gibt es, damit der Prüflauf gegen eine Attrappe laufen kann. */
const SRC =
  srcArg >= 0
    ? path.resolve(args[srcArg + 1])
    : path.resolve(__dirname, '..', 'src', 'data', 'support.ts');
/** Wie viele Adressen gleichzeitig – höflich bleiben, es sind fremde Seiten. */
const PARALLEL = 4;

/**
 * Die Adressen stehen als Literale in einer TS-Datei. Sie zu importieren hieße,
 * TypeScript in Node zu übersetzen; für `name`, `home` und `donate` genügt ein
 * Durchgang durch den Text. Jede URL erbt den zuletzt gesehenen Namen – die
 * Reihenfolge im Objekt trägt das, und `SUPPORT_LINKED` schreibt beides in eine
 * Zeile.
 */
function collect() {
  const text = fs.readFileSync(SRC, 'utf8');
  const targets = [];
  let name = '(ohne Namen)';
  const re = /(\w+):\s*'((?:https?:\/\/)[^']+)'|name:\s*'((?:[^'\\]|\\.)*)'/g;
  for (const m of text.matchAll(re)) {
    if (m[3] !== undefined) {
      name = m[3].replace(/\\'/g, "'");
      continue;
    }
    const [, key, url] = m;
    if (key !== 'home' && key !== 'donate') continue;
    if (ONLY_DONATE && key !== 'donate') continue;
    targets.push({ name, kind: key, url });
  }
  return targets;
}

async function check(t) {
  try {
    // HEAD reicht; manche Seiten mögen es nicht, dann GET hinterher.
    let r = await fetch(t.url, { method: 'HEAD', redirect: 'follow' });
    if (r.status === 405 || r.status === 501) r = await fetch(t.url, { redirect: 'follow' });
    return { ...t, status: r.status, finalUrl: r.url };
  } catch (e) {
    return { ...t, status: 0, error: String(e.message ?? e) };
  }
}

const targets = collect();
if (!targets.length) {
  console.error(`Keine Adressen in ${path.relative(process.cwd(), SRC)} gefunden.`);
  console.error('Das heisst nicht, dass keine da sind – eher, dass die Datei anders aussieht als erwartet.');
  process.exit(2);
}

const results = [];
for (let i = 0; i < targets.length; i += PARALLEL) {
  results.push(...(await Promise.all(targets.slice(i, i + PARALLEL).map(check))));
}

/** Nur 404 und 410 sind eine Aussage über die Adresse. Alles andere nicht. */
const isMissing = (r) => r.status === 404 || r.status === 410;
const isOk = (r) => r.status >= 200 && r.status < 300;

const norm = (u) => u.replace(/\/$/, '');
const ok = results.filter(isOk);
const moved = ok.filter((r) => r.finalUrl && norm(r.finalUrl) !== norm(r.url));
const missing = results.filter(isMissing);
const undecided = results.filter((r) => !isOk(r) && !isMissing(r));
const donateCount = targets.filter((t) => t.kind === 'donate').length;

console.log(
  `${results.length} Adressen aus support.ts (${donateCount} davon Spendenseiten)`,
);
console.log(
  `  erreichbar: ${ok.length}   fehlend: ${missing.length}   unentschieden: ${undecided.length}`,
);

for (const r of moved) console.log(`  → umgeleitet: ${r.url}  ⇒  ${r.finalUrl}   (${r.name})`);
for (const r of missing) console.log(`  ✗ ${r.status}  ${r.url}   (${r.name}, ${r.kind})`);
for (const r of undecided) console.log(`  ? unentschieden (${r.error ?? r.status}): ${r.url}`);

if (undecided.length === results.length) {
  console.error('\nKeine einzige Adresse hat die Seite selbst beantwortet – Netzsperre,');
  console.error('Proxy oder Ausfall. Das ist kein Befund über die Adressen: der Lauf');
  console.error('sagt hier nichts aus, weder im Guten noch im Schlechten.');
  process.exit(2);
}
if (missing.length) {
  const anyDonate = missing.some((r) => r.kind === 'donate');
  console.error(
    anyDonate
      ? '\nEine Spendenseite führt ins Leere. Richtige Adresse heraussuchen und in src/data/support.ts eintragen.'
      : '\nRichtige Adresse heraussuchen und in src/data/support.ts eintragen.',
  );
  process.exit(1);
}
if (undecided.length) {
  console.log(`\nAlle beantworteten Adressen führen irgendwohin; ${undecided.length} blieben offen.`);
} else {
  console.log('\nAlle Adressen führen irgendwohin.');
}
