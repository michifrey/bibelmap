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
 * Case-insensitive, longest-match-first. Works best for the English (WEB)
 * text since the candidate names are English; German spellings often differ,
 * which is why the per-verse pins are the authoritative link.
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

  const re = new RegExp(`\\b(${all.map(escapeRe).join('|')})\\b`, 'gi');
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
          className="rounded bg-gold/25 px-0.5 font-medium text-teal underline decoration-gold decoration-1 underline-offset-2 transition hover:bg-gold/45"
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
