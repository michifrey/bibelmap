import type { ReactNode } from 'react';

export interface Candidate {
  placeId: string;
  strings: string[]; // name + variants
  onPick: () => void;
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Wrap occurrences of place names/variants in `text` with clickable spans.
 * Case-insensitive, longest-match-first.
 *
 * Boundaries are Unicode lookarounds, not `\b`: JavaScript's `\b` is defined
 * over ASCII `\w`, so `\bÄgypten\b` never matches — a space followed by "Ä"
 * is two non-word characters, hence no boundary. That silently broke every
 * German place name that starts with an umlaut.
 */
export function highlightVerse(text: string, candidates: Candidate[]): ReactNode {
  if (!candidates.length) return text;

  const lookup = new Map<string, Candidate>();
  const all: string[] = [];
  for (const c of candidates) {
    for (const s of c.strings) {
      const k = s.toLowerCase();
      if (s.length >= 3 && !lookup.has(k)) {
        lookup.set(k, c);
        all.push(s);
      }
    }
  }
  if (!all.length) return text;
  all.sort((a, b) => b.length - a.length);

  const re = new RegExp(`(?<!\\p{L})(${all.map(escapeRe).join('|')})(?!\\p{L})`, 'giu');
  const out: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const cand = lookup.get(m[0].toLowerCase());
    if (cand) {
      out.push(
        <button
          key={key++}
          onClick={cand.onPick}
          /*
           * Der Bibeltext steht auf Papier, nicht auf der dunklen Bühne. Das
           * `text-white` war von dort übrig geblieben: weiße Schrift auf einem
           * 25-prozentigen Goldschleier über Weiß ergibt 1,83:1 – die Ortsnamen,
           * also genau das, was man hier antippen soll, waren das am schlechtesten
           * Lesbare der ganzen Seite. Dunkle Tinte auf dem Schleier liest sich wie
           * mit dem Textmarker angestrichen, und das ist es ja auch.
           */
          className="bg-gold/30 px-0.5 font-medium text-ink underline decoration-gold-deep decoration-1 underline-offset-2 transition hover:bg-gold/60"
        >
          {m[0]}
        </button>,
      );
    } else {
      out.push(m[0]);
    }
    last = m.index + m[0].length;
    if (m.index === re.lastIndex) re.lastIndex++; // guard against zero-length
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}
