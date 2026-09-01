// Prüft, dass jeder benutzte Übersetzungsschlüssel auch existiert.
//
//   node scripts/check-i18n-keys.mjs
//   npm run check:i18n-keys
//   npm run check:i18n-keys -- --gegenprobe
//
// **Die Lücke.** `useT` und `t` fallen bei einem unbekannten Schlüssel auf
// den Schlüssel selbst zurück:
//
//     STRINGS[key]?.[lang] ?? String(key)
//
// Ein Tippfehler zeigt also `quizz` in der Oberfläche statt „Bibelquiz".
// Nachgemessen: `t('de', 'quizz')` liefert `"quizz"`.
//
// Und der Typ fängt es nicht. `STRINGS` ist als `Dict = Record<string, …>`
// typisiert, `keyof typeof STRINGS` ist damit schlicht `string` – jeder
// beliebige Text ist ein gültiger Schlüssel. `tsc --noEmit` lief mit einem
// eingebauten `t('quizz')` mit Abschlusscode 0 durch.
//
// **Was diese Prüfung kann und was nicht.** Sie findet Aufrufe mit einem
// *geschriebenen* Schlüssel – `t('quiz')` und `tr(lang, 'quiz')`. Das sind
// über vierhundert. Berechnete Zugriffe (`BASEMAP_LABEL[id]`,
// `churchKind_${kind}`) sieht sie nicht, und deshalb meldet sie auch **nicht**
// „unbenutzte" Schlüssel: Von denen sind die meisten über einen berechneten
// Namen erreichbar, und eine Liste mit fünfzig Fehlalarmen schaltet man ab.
//
// Auch die Vollständigkeit beider Sprachen wird geprüft – ein Eintrag ohne
// `en` fällt zur Laufzeit auf denselben Rückfall zurück.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const I18N = path.join(ROOT, 'src/i18n.ts');
const gegenprobe = process.argv.includes('--gegenprobe');

const quelle = fs.readFileSync(I18N, 'utf8');
const anfang = quelle.indexOf('const STRINGS');
const ende = quelle.indexOf('export function useT');
if (anfang < 0 || ende < 0) {
  console.error('✗ In src/i18n.ts fehlt `const STRINGS` oder `export function useT` – die Prüfung liest die falsche Datei.');
  process.exit(1);
}
const woerterbuch = quelle.slice(anfang, ende);

/** Jeder Eintrag `name: { de: …, en: … }` auf oberster Ebene. */
const eintraege = [...woerterbuch.matchAll(/^ {2}([A-Za-z0-9_]+):\s*\{([\s\S]*?)\},?\s*$/gm)];
const vorhanden = new Set(eintraege.map((m) => m[1]));
if (vorhanden.size < 100) {
  console.error(`✗ Nur ${vorhanden.size} Schlüssel gefunden – das Muster passt nicht mehr auf die Datei.`);
  process.exit(1);
}

function dateien(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...dateien(p));
    else if (/\.tsx?$/.test(e.name) && p !== I18N) out.push(p);
  }
  return out;
}

const benutzt = new Map();
for (const f of dateien(path.join(ROOT, 'src'))) {
  const q = fs.readFileSync(f, 'utf8');
  for (const re of [/\bt\(\s*'([A-Za-z0-9_]+)'\s*\)/g, /\btr?\(\s*\w+\s*,\s*'([A-Za-z0-9_]+)'\s*\)/g]) {
    for (const m of q.matchAll(re)) {
      const zeile = q.slice(0, m.index).split('\n').length;
      if (!benutzt.has(m[1])) benutzt.set(m[1], []);
      benutzt.get(m[1]).push(`${path.relative(ROOT, f)}:${zeile}`);
    }
  }
}
if (gegenprobe) benutzt.set('gibtsnicht', ['src/GEGENPROBE.tsx:1']);

const fehler = [];
for (const [k, stellen] of benutzt) {
  if (!vorhanden.has(k)) {
    fehler.push(`„${k}" gibt es in i18n.ts nicht – die Oberfläche zeigt dann „${k}". (${stellen.slice(0, 2).join(', ')})`);
  }
}
for (const [, name, inhalt] of eintraege) {
  for (const sprache of ['de', 'en']) {
    if (!new RegExp(`\\b${sprache}:\\s*['"\`]`).test(inhalt)) fehler.push(`„${name}" hat kein ${sprache}.`);
    else if (new RegExp(`\\b${sprache}:\\s*(''|""|\`\`)`).test(inhalt)) fehler.push(`„${name}" hat ein leeres ${sprache}.`);
  }
}

if (gegenprobe) {
  const getroffen = fehler.filter((f) => f.startsWith('„gibtsnicht"'));
  const echte = fehler.filter((f) => !f.startsWith('„gibtsnicht"'));
  console.log(`Gegenprobe: eingebauter Schlüssel ${getroffen.length === 1 ? 'gefunden' : 'NICHT gefunden'}.`);
  if (echte.length) console.log(`  ⚠ dazu ${echte.length} echte Beanstandung(en) – die gehören in den normalen Lauf.`);
  const gut = getroffen.length === 1 && !echte.length;
  console.log(gut ? '✓ Die Prüfung schlägt an, und nur dort.' : '✗ Die Prüfung belegt nicht, was sie soll.');
  process.exit(gut ? 0 : 1);
}

if (fehler.length) {
  console.error(`✗ ${fehler.length} Beanstandung${fehler.length === 1 ? '' : 'en'}:\n`);
  for (const f of fehler) console.error('  · ' + f);
  process.exit(1);
}

console.log(
  `✓ ${vorhanden.size} Übersetzungen, alle zweisprachig und ohne leeren Wert; ` +
    `${benutzt.size} geschriebene Schlüssel im Quelltext, jeder davon vorhanden.`,
);
