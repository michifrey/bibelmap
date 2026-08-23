/**
 * Farben, die als Fläche gedacht sind, als Schrift lesbar machen.
 *
 * Die neun Epochenfarben und die Farben der Missionsphasen sind für Flächen
 * entworfen – Punkte, Balken, Kanten –, und dort tragen sie. Als Schrift auf
 * der dunklen Bühne (#03302f) reichen vier von neun nicht einmal an 3:1 heran:
 *
 *   Rückkehr & Wiederaufbau  #5a5ca8  2,41:1
 *   Frühe Kirche             #b0436b  2,63:1
 *   Jesus & Evangelien       #9a4ba0  2,65:1
 *   Exil                     #3a6ea8  2,71:1
 *
 * Für 10-Pixel-Versalien verlangt WCAG 4,5:1. Statt die Palette zu ändern –
 * sie ist die Identität dieser App – wird sie für den einen Zweck aufgehellt:
 * derselbe Farbton, so weit zu Weiß gemischt, bis er lesbar ist. Wer die Farbe
 * als Fläche setzt, nimmt weiter die ungemischte.
 */

const STAGE = '#03302f';

function channels(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16)) as [number, number, number];
}

function relLuminance(hex: string): number {
  const [r, g, b] = channels(hex).map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Kontrastverhältnis nach WCAG 2, zwischen 1:1 und 21:1. */
export function contrastRatio(a: string, b: string): number {
  const la = relLuminance(a);
  const lb = relLuminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

function toHex(c: [number, number, number]): string {
  return '#' + c.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
}

const cache = new Map<string, string>();

/**
 * Dieselbe Farbe, so weit zu Weiß gemischt, dass sie auf der dunklen Bühne
 * `min` erreicht. Ist sie schon hell genug, kommt sie unverändert zurück.
 *
 * `min` voreingestellt auf 4,5 – der Wert für kleine Schrift, und klein ist
 * jede Stelle, an der wir das brauchen.
 */
export function readableOnDark(hex: string, min = 4.5, bg = STAGE): string {
  const key = `${hex}|${min}|${bg}`;
  const known = cache.get(key);
  if (known) return known;

  let out = hex;
  if (contrastRatio(hex, bg) < min) {
    const base = channels(hex);
    // In Zwanzigsteln zu Weiß: fein genug, dass der Farbton erhalten bleibt,
    // grob genug, dass die Schleife in einem Wimpernschlag durch ist.
    for (let step = 1; step <= 20; step++) {
      const t = step / 20;
      const mixed = toHex([
        base[0] + (255 - base[0]) * t,
        base[1] + (255 - base[1]) * t,
        base[2] + (255 - base[2]) * t,
      ]);
      out = mixed;
      if (contrastRatio(mixed, bg) >= min) break;
    }
  }
  cache.set(key, out);
  return out;
}
