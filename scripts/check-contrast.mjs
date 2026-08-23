// Prüft, dass Datenfarben nicht ungefiltert als Schrift auf der dunklen Bühne
// landen.
//
//   node scripts/check-contrast.mjs
//
// Die neun Epochenfarben und die Farben der Missionsphasen sind für Flächen
// entworfen. Als Schrift auf #03302f reichen vier von neun nicht an 3:1 heran,
// und für 10-Pixel-Versalien verlangt WCAG 4,5:1. `readableOnDark()` in
// src/lib/contrast.ts hellt sie für diesen einen Zweck auf.
//
// Zwei Prüfungen:
//
//   1. Jede Farbe in den Daten erreicht nach der Aufhellung 4,5:1.
//   2. Kein `style={{ … color: … }}` in src/ setzt eine Datenfarbe ohne sie.
//
// Die zweite ist die wichtigere: die erste ist durch die Bauart erfüllt, die
// zweite ist die Stelle, an der es beim nächsten Mal wieder auseinanderläuft.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'src');
const STAGE = '#03302f';
const MIN = 4.5;

/* --- dieselbe Rechnung wie in src/lib/contrast.ts ------------------------ */

const channels = (hex) => {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
};
const relLuminance = (hex) => {
  const [r, g, b] = channels(hex).map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const la = relLuminance(a);
  const lb = relLuminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
};
const toHex = (c) => '#' + c.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
function readableOnDark(hex, min = MIN, bg = STAGE) {
  if (ratio(hex, bg) >= min) return hex;
  const base = channels(hex);
  let out = hex;
  for (let step = 1; step <= 20; step++) {
    const t = step / 20;
    out = toHex([
      base[0] + (255 - base[0]) * t,
      base[1] + (255 - base[1]) * t,
      base[2] + (255 - base[2]) * t,
    ]);
    if (ratio(out, bg) >= min) break;
  }
  return out;
}

/* --- 1. Datenfarben ------------------------------------------------------ */

function colorsIn(file) {
  if (!fs.existsSync(file)) return [];
  const text = fs.readFileSync(file, 'utf8');
  return [...new Set(text.match(/#[0-9a-fA-F]{6}\b/g) ?? [])];
}

const DATA = ['src/data/eras.ts', 'src/data/mission.ts', 'src/data/genealogy.ts', 'src/data/personSources.ts'];
let worst = Infinity;
const tooDark = [];
for (const rel of DATA) {
  for (const c of colorsIn(path.join(ROOT, rel))) {
    const r = ratio(readableOnDark(c), STAGE);
    worst = Math.min(worst, r);
    if (r < MIN - 0.005) tooDark.push(`${rel}: ${c} bleibt bei ${r.toFixed(2)}:1`);
  }
}

/* --- 2. ungefilterte Datenfarben als Schrift ----------------------------- */

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.tsx?$/.test(e.name)) out.push(p);
  }
  return out;
}

const raw = [];
for (const file of walk(SRC)) {
  const rel = path.relative(ROOT, file);
  fs.readFileSync(file, 'utf8').split('\n').forEach((line, i) => {
    // Nur JSX-Stile: `style={{ … color: … }}`. Ein `color:` in einem
    // Objektliteral (etwa die Füllfarbe eines Zeichenflächen-Knotens) ist
    // etwas anderes und geht hier niemanden an.
    if (!line.includes('style={{')) return;
    const m = line.match(/[^A-Za-z]color:\s*([^,}]+)/);
    if (!m) return;
    const value = m[1].trim();
    if (!/\.color\b|Color\(/.test(value)) return;
    if (value.includes('readableOnDark')) return;
    raw.push(`${rel}:${i + 1}  ${value}`);
  });
}

/* --- Bericht ------------------------------------------------------------- */

console.log(`Datenfarben nach Aufhellung: schlechtester Wert ${worst.toFixed(2)}:1 (verlangt ${MIN}:1)`);
if (tooDark.length) {
  console.error('\nFarben, die auch aufgehellt nicht reichen:');
  for (const x of tooDark) console.error('  ' + x);
}
if (raw.length) {
  console.error('\nDatenfarbe als Schrift ohne readableOnDark():');
  for (const x of raw) console.error('  ' + x);
  console.error('\n  Als Fläche ist die volle Farbe richtig – als Schrift auf dunklem');
  console.error('  Grund gehört sie durch readableOnDark() aus src/lib/contrast.ts.');
}
if (tooDark.length || raw.length) process.exit(1);
console.log('Keine ungefilterte Datenfarbe als Schrift.');
