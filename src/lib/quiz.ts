import type { Place } from '../types';
import type { Lang } from '../i18n';
import { JOURNEYS as BIBLE_JOURNEYS } from '../data/journeys';
import { PHASES, PHASE_BY_ID, SPREAD_EVENTS } from '../data/mission';

/** Ortsfrage: der Name steht da, der Klick auf die Karte ist die Antwort. */
export interface WhereQuestion {
  kind: 'where';
  place: Place;
}

/** Wissensfrage: vier Möglichkeiten, eine stimmt. */
export interface ChoiceQuestion {
  kind: 'choice';
  /** Die Frage selbst, schon in der Sprache der Oberfläche. */
  prompt: string;
  /** Worum es geht – Station oder Ereignis. */
  subject: string;
  options: string[];
  answer: number;
  /** Ein Satz zur Auflösung. */
  explain: string;
  /** Wohin die Karte nach der Antwort fliegt. */
  at: [number, number];
}

export type Question = WhereQuestion | ChoiceQuestion;

export type Level = 'easy' | 'normal' | 'hard';

const LEVEL_MIN: Record<Level, number> = { easy: 50, normal: 15, hard: 3 };

function shuffle<T>(list: T[]): T[] {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function pick<T>(list: T[], n: number): T[] {
  return shuffle(list).slice(0, n);
}

/** „Zu welcher Reise gehört diese Station?" */
function journeyQuestion(lang: Lang): ChoiceQuestion | null {
  const journey = pick(BIBLE_JOURNEYS, 1)[0];
  if (!journey) return null;
  const stop = pick(journey.stops, 1)[0];
  const others = pick(
    BIBLE_JOURNEYS.filter((j) => j.id !== journey.id),
    3,
  );
  const right = lang === 'de' ? journey.de : journey.en;
  const options = shuffle([right, ...others.map((j) => (lang === 'de' ? j.de : j.en))]);
  return {
    kind: 'choice',
    prompt: lang === 'de' ? 'Zu welcher Reise gehört diese Station?' : 'Which journey does this stop belong to?',
    subject: `${lang === 'de' ? stop.de : stop.en}${stop.ref ? ` · ${lang === 'de' ? stop.ref.de : stop.ref.en}` : ''}`,
    options,
    answer: options.indexOf(right),
    explain: lang === 'de' ? stop.text.de : stop.text.en,
    at: [stop.lat, stop.lon],
  };
}

/** „In welche Zeit gehört dieses Ereignis?" */
function spreadQuestion(lang: Lang): ChoiceQuestion | null {
  const event = pick(
    SPREAD_EVENTS.filter((e) => PHASE_BY_ID[e.phase]),
    1,
  )[0];
  if (!event) return null;
  const phase = PHASE_BY_ID[event.phase];
  const others = pick(
    PHASES.filter((p) => p.id !== phase.id && p.id !== 'journeys'),
    3,
  );
  const label = (p: (typeof PHASES)[number]) =>
    `${lang === 'de' ? p.de : p.en} · ${lang === 'de' ? p.range.de : p.range.en}`;
  const right = label(phase);
  const options = shuffle([right, ...others.map(label)]);
  return {
    kind: 'choice',
    prompt: lang === 'de' ? 'In welche Zeit gehört das?' : 'Which era does this belong to?',
    subject: lang === 'de' ? event.de : event.en,
    options,
    answer: options.indexOf(right),
    explain: lang === 'de' ? event.text.de : event.text.en,
    at: [event.lat, event.lon],
  };
}

/**
 * Eine Runde: Ortsfragen, dazu – wenn gewünscht – ein Drittel Wissensfragen
 * aus den Reisen und der Ausbreitung. Gemischt, damit niemand weiß, was kommt.
 */
export function buildRound(places: Place[], level: Level, mix: boolean, lang: Lang, rounds = 8): Question[] {
  // Nur Siedlungen: bei Regionen wie „Moab" wäre der eine Punkt willkürlich.
  const pool = places.filter((p) => p.types.includes('settlement') && p.mentionCount >= LEVEL_MIN[level]);
  const knowledge = mix ? Math.min(3, rounds - 1) : 0;
  const where: Question[] = pick(pool, rounds - knowledge).map((place) => ({ kind: 'where', place }));

  const choices: Question[] = [];
  let guard = 0;
  while (choices.length < knowledge && guard++ < 40) {
    const q = choices.length % 2 === 0 ? journeyQuestion(lang) : spreadQuestion(lang);
    if (q && !choices.some((c) => c.kind === 'choice' && c.subject === q.subject)) choices.push(q);
  }
  return shuffle([...where, ...choices]);
}
