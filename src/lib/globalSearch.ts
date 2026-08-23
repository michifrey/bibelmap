import type { Lang } from '../i18n';
import { JOURNEYS as BIBLE_JOURNEYS } from '../data/journeys';
import { JOURNEYS as MISSION_JOURNEYS, PHASES, SPREAD_EVENTS, PHASE_BY_ID } from '../data/mission';
import { ERA_BY_ID } from '../data/eras';
import { TRIBES, tribeSlug } from '../data/tribes';
import { PHASES as TRIBE_PHASES, phaseYear } from '../data/tribeHistory';

/**
 * Wohin ein Treffer führt – dieselben Angaben, die auch im Hash stehen, damit
 * Suche und Deep-Link denselben Weg nehmen.
 */
export type HitTarget =
  | { mode: 'journeys'; journey: { id: string; stop: number } }
  | { mode: 'mission'; mission: { phase: string; journey?: string; event?: string } }
  | { mode: 'tree'; tree: { tab: 'timeline' | 'tree' | 'map'; id?: string; year?: number } };

export interface SearchHit {
  key: string;
  title: string;
  subtitle: string;
  color: string;
  target: HitTarget;
}

function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

/** Treffergüte: ganzer Name > Anfang > enthalten > im Text erwähnt. */
function score(haystack: string, needle: string): number {
  const h = norm(haystack);
  if (h === needle) return 100;
  if (h.startsWith(needle)) return 80;
  if (h.includes(needle)) return 60;
  return 0;
}

/**
 * Sucht in dem, was nicht auf der Hauptkarte liegt: den erzählten Reisen, der
 * Ausbreitung und den Stammesgebieten. Orte findet weiterhin `searchPlaces` –
 * beides landet in derselben Ergebnisliste.
 */
export function searchStories(query: string, lang: Lang, limit = 8): SearchHit[] {
  const q = norm(query.trim());
  if (q.length < 2) return [];
  const scored: { hit: SearchHit; s: number }[] = [];
  const add = (s: number, hit: SearchHit) => {
    if (s > 0) scored.push({ hit, s });
  };

  for (const j of BIBLE_JOURNEYS) {
    const color = ERA_BY_ID[j.era]?.color ?? '#e0a449';
    const name = lang === 'de' ? j.de : j.en;
    add(score(name, q), {
      key: `j:${j.id}`,
      title: name,
      subtitle: `${lang === 'de' ? 'Reise' : 'Journey'} · ${lang === 'de' ? j.when.de : j.when.en}`,
      color,
      target: { mode: 'journeys', journey: { id: j.id, stop: 0 } },
    });
    j.stops.forEach((st, i) => {
      const stopName = lang === 'de' ? st.de : st.en;
      const text = lang === 'de' ? st.text.de : st.text.en;
      const s = Math.max(score(stopName, q), norm(text).includes(q) ? 40 : 0);
      add(s, {
        key: `j:${j.id}:${i}`,
        title: stopName,
        subtitle: `${name}${st.ref ? ` · ${lang === 'de' ? st.ref.de : st.ref.en}` : ''}`,
        color,
        target: { mode: 'journeys', journey: { id: j.id, stop: i } },
      });
    });
  }

  for (const j of MISSION_JOURNEYS) {
    const name = lang === 'de' ? j.de : j.en;
    add(score(name, q), {
      key: `m:${j.id}`,
      title: name,
      subtitle: `${lang === 'de' ? 'Mission' : 'Mission'} · ${lang === 'de' ? j.passage.de : j.passage.en}`,
      color: j.color,
      target: { mode: 'mission', mission: { phase: 'journeys', journey: j.id } },
    });
    for (const st of j.stops) {
      const stopName = lang === 'de' ? st.de : st.en;
      add(score(stopName, q) - 10, {
        key: `m:${j.id}:${stopName}`,
        title: stopName,
        subtitle: `${name}${st.ref ? ` · ${lang === 'de' ? st.ref.de : st.ref.en}` : ''}`,
        color: j.color,
        target: { mode: 'mission', mission: { phase: 'journeys', journey: j.id } },
      });
    }
  }

  for (const e of SPREAD_EVENTS) {
    const name = lang === 'de' ? e.de : e.en;
    const text = lang === 'de' ? e.text.de : e.text.en;
    const phase = PHASE_BY_ID[e.phase];
    const s = Math.max(score(name, q), norm(text).includes(q) ? 40 : 0);
    add(s, {
      key: `e:${e.id}`,
      title: name,
      subtitle: `${phase ? (lang === 'de' ? phase.de : phase.en) : ''} · ${lang === 'de' ? e.when.de : e.when.en}`,
      color: phase?.color ?? '#7fe3d5',
      target: { mode: 'mission', mission: { phase: e.phase, event: e.id } },
    });
  }

  for (const p of PHASES) {
    const name = lang === 'de' ? p.de : p.en;
    add(score(name, q) - 20, {
      key: `p:${p.id}`,
      title: name,
      subtitle: `${lang === 'de' ? 'Ausbreitung' : 'Spread'} · ${lang === 'de' ? p.range.de : p.range.en}`,
      color: p.color,
      target: { mode: 'mission', mission: { phase: p.id } },
    });
  }

  // ---- Stämme Israels ------------------------------------------------------
  for (const tr of TRIBES) {
    const name = lang === 'de' ? tr.de : tr.en;
    const slug = tribeSlug(tr);
    add(score(name, q), {
      key: `t:${tr.id}`,
      title: name,
      subtitle: `${lang === 'de' ? 'Stammesgebiet' : 'Tribal territory'} · ${tr.lot}`,
      color: tr.color,
      target: { mode: 'tree', tree: { tab: 'map', id: slug } },
    });
    // Wer „Hebron" sucht, bekommt den Ort von der Hauptkarte – und von hier die
    // Antwort auf die Frage, in wessen Gebiet er liegt.
    for (const c of tr.cities) {
      const town = lang === 'de' ? c.de : c.en;
      add(score(town, q) - 15, {
        key: `t:${tr.id}:${c.de}`,
        title: town,
        subtitle: `${lang === 'de' ? 'im Gebiet von' : 'in the territory of'} ${name}`,
        color: tr.color,
        target: { mode: 'tree', tree: { tab: 'map', id: slug } },
      });
    }
  }

  for (const ph of TRIBE_PHASES) {
    const name = lang === 'de' ? ph.de : ph.en;
    const text = lang === 'de' ? ph.text.de : ph.text.en;
    const s = Math.max(score(name, q), norm(text).includes(q) ? 35 : 0);
    add(s, {
      key: `th:${ph.id}`,
      title: name,
      subtitle: `${lang === 'de' ? 'Stammesgebiete' : 'Tribal territories'} · ${phaseYear(ph, lang)}`,
      color: '#e0a449',
      target: { mode: 'tree', tree: { tab: 'map', year: Math.abs(ph.year) } },
    });
  }

  const seen = new Set<string>();
  return scored
    .sort((a, b) => b.s - a.s)
    .filter((x) => {
      const k = `${x.hit.title}|${JSON.stringify(x.hit.target)}`;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    })
    .slice(0, limit)
    .map((x) => x.hit);
}
