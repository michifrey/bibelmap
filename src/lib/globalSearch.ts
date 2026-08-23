import type { Lang } from '../i18n';
import { JOURNEYS as BIBLE_JOURNEYS } from '../data/journeys';
import { JOURNEYS as MISSION_JOURNEYS, PHASES, SPREAD_EVENTS, PHASE_BY_ID } from '../data/mission';
import { ERA_BY_ID } from '../data/eras';
import { TRIBES, tribeSlug } from '../data/tribes';
import { PHASES as TRIBE_PHASES, phaseYear } from '../data/tribeHistory';
import { GENEALOGY, EPOCH_BY_ID, formatYear } from '../data/genealogy';
import { FATHERS, COUNCILS, TRADITION_COLOR, TRADITION_LABEL } from '../data/church';
import { COMPARE } from '../data/compare';
import { HISTORY } from '../data/history';

/**
 * Wohin ein Treffer führt – dieselben Angaben, die auch im Hash stehen, damit
 * Suche und Deep-Link denselben Weg nehmen.
 */
export type HitTarget =
  | { mode: 'journeys'; journey: { id: string; stop: number } }
  | { mode: 'mission'; mission: { phase: string; journey?: string; event?: string } }
  | { mode: 'tree'; tree: { tab: 'timeline' | 'tree' | 'map'; id?: string; year?: number } }
  /** Ein Mensch im Zeitbaum – dorthin führt kein Reiter, sondern ein Fokus. */
  | { mode: 'person'; personId: string }
  | { mode: 'church'; church: { tab: 'fathers' | 'councils'; id: string } }
  | { mode: 'compare'; compare: string }
  | { mode: 'history'; history: string };

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
 * Zweite Schreibweisen für die Konzilsstädte – im Deutschen ebenso geläufig
 * wie die Form in den Daten, dazu die lateinisch-griechische. Nichts erfunden:
 * derselbe Ort, andere Buchstaben.
 */
const SCHREIBWEISEN: Record<string, string[]> = {
  nicaea1: ['Nizäa I', 'Nicaea I', 'Nikaia I', 'Nizäa', 'Nicaea'],
  nicaea2: ['Nizäa II', 'Nicaea II', 'Nikaia II'],
  constantinople1: ['Konstantinopel I', 'Byzanz'],
  constantinople2: ['Konstantinopel II', 'Byzanz'],
  constantinople3: ['Konstantinopel III', 'Byzanz'],
  ephesus: ['Ephesos'],
  chalcedon: ['Kalchedon', 'Kadıköy'],
  jerusalem: ['Konzil von Jerusalem'],
};

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

  // Wer aus einem Stamm kam: Debora, Gideon, Jona aus Gat-Hefer. Führt der
  // Zeitbaum die Person, geht es dorthin – sonst auf die Stammeskarte, wo sie
  // mit ihrer Stelle steht.
  for (const tr of TRIBES) {
    for (const person of tr.people ?? []) {
      const name = lang === 'de' ? person.de : person.en;
      add(score(name, q) - 5, {
        key: `sp:${tr.id}:${person.de}`,
        title: name,
        subtitle: `${lang === 'de' ? person.role.de : person.role.en} · ${lang === 'de' ? tr.de : tr.en} · ${person.ref}`,
        color: tr.color,
        target: person.node
          ? { mode: 'person', personId: person.node }
          : { mode: 'tree', tree: { tab: 'map', id: tribeSlug(tr) } },
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

  // Zweite Schreibweisen, die im Deutschen genauso üblich sind wie die in den
  // Daten. Keine erfundenen Namen, nur andere Buchstaben für dieselbe Stadt:
  // wer „Nizäa" tippt, meint das Konzil von Nicäa.
  //
  // ---- Menschen ------------------------------------------------------------
  // Die App kennt Augustinus, Debora und Bonhoeffer längst – jeder hat seine
  // Seite. Die Suche kannte sie nicht: wer den Namen tippte, bekam bestenfalls
  // ein Ereignis, in dessen Text er zufällig vorkam. Gemessen fanden
  // „Chalcedon", „Nizäa", „Bonhoeffer", „Debora" und „Hiskia" gar nichts.

  // Kirchenväter zuerst: sie stammen aus demselben Datensatz wie die Personen
  // des Zeitbaums, haben aber zusätzlich eine Karte. Ihre Kennungen merken wir
  // uns, damit derselbe Mensch nicht zweimal in der Liste steht.
  const alsVater = new Set(FATHERS.map((f) => f.personId));
  for (const f of FATHERS) {
    const name = lang === 'de' ? f.de : f.en;
    add(score(name, q), {
      key: `kv:${f.id}`,
      title: name,
      subtitle: `${lang === 'de' ? TRADITION_LABEL[f.tradition].de : TRADITION_LABEL[f.tradition].en} · ${f.years}`,
      color: TRADITION_COLOR[f.tradition],
      target: { mode: 'church', church: { tab: 'fathers', id: f.id } },
    });
  }

  for (const c of COUNCILS) {
    const note = lang === 'de' ? c.de.note : c.en.note;
    const s = Math.max(
      score(c.name, q),
      ...(SCHREIBWEISEN[c.id] ?? []).map((v) => score(v, q)),
      score(c.city, q) - 20,
      norm(note).includes(q) ? 35 : 0,
    );
    add(s, {
      key: `kz:${c.id}`,
      title: c.name,
      subtitle: `${lang === 'de' ? 'Konzil' : 'Council'} · ${c.city} · ${c.year}`,
      color: '#e0a449',
      target: { mode: 'church', church: { tab: 'councils', id: c.id } },
    });
  }

  for (const person of GENEALOGY) {
    if (alsVater.has(person.id)) continue;
    const name = lang === 'de' ? person.de : person.en;
    const epoch = EPOCH_BY_ID[person.epoch];
    const wann = person.years ?? (person.born !== undefined ? formatYear(person.born, lang) : '');
    const art = person.faith
      ? lang === 'de' ? 'Glaubenszeuge' : 'Witness of faith'
      : lang === 'de' ? 'Zeitbaum' : 'Time tree';
    add(score(name, q), {
      key: `pe:${person.id}`,
      title: name,
      subtitle: [art, epoch ? (lang === 'de' ? epoch.de : epoch.en) : '', wann].filter(Boolean).join(' · '),
      color: '#e0a449',
      target: { mode: 'person', personId: person.id },
    });
  }

  // ---- Gestalten im Religionsvergleich ------------------------------------
  // Bewusst schwächer bewertet: „Mose" soll zuerst die Orte und die Reise
  // zeigen, nicht den Vergleich – wer den sucht, findet ihn zwei Zeilen tiefer.
  for (const fig of COMPARE) {
    const name = lang === 'de' ? fig.de.name : fig.en.name;
    add(score(name, q) - 25, {
      key: `vg:${fig.id}`,
      title: name,
      subtitle: `${lang === 'de' ? 'Religionen im Vergleich' : 'Faiths compared'} · ${fig.islamName}`,
      color: '#7aa8b8',
      target: { mode: 'compare', compare: fig.id },
    });
  }

  // ---- Stationen der Heilsgeschichte ---------------------------------------
  for (const st of HISTORY) {
    const title = lang === 'de' ? st.de.title : st.en.title;
    const text = lang === 'de' ? st.de.text : st.en.text;
    const s = Math.max(score(title, q), norm(text).includes(q) ? 35 : 0);
    add(s, {
      key: `hg:${st.id}`,
      title,
      subtitle: `${lang === 'de' ? 'Heilsgeschichte' : 'Salvation history'} · ${st.date} · ${st.ref.label}`,
      color: ERA_BY_ID[st.era]?.color ?? '#e0a449',
      target: { mode: 'history', history: st.id },
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
