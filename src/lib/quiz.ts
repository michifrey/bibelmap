import type { Place } from '../types';
import type { Lang } from '../i18n';
import { JOURNEYS as BIBLE_JOURNEYS } from '../data/journeys';
import { PHASES, PHASE_BY_ID, SPREAD_EVENTS } from '../data/mission';
import { placesAlong } from './along';
import { distanceKm, formatKm, type LatLon } from './route';
import { placeName } from './places';

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
 * „Welcher dieser Orte lag auf dem Weg?"
 *
 * Die Frage kommt aus denselben Daten wie die Ortsliste an jeder Etappe: 1.335
 * Orte mit Koordinaten, gerechnet gegen die Luftlinie zwischen zwei Stationen.
 * Erfunden wird nichts – auch nicht die falschen Antworten.
 *
 * Damit die Frage fair bleibt, müssen die drei falschen weit genug weg sein:
 * mindestens 60 km neben derselben Linie und über 100 km von beiden Stationen.
 * Ein Ort, der 20 km danebenliegt, wäre keine falsche Antwort, sondern eine
 * strittige.
 *
 * Und die richtige Antwort trägt ihre Einschränkung mit in die Auflösung: die
 * Luftlinie ist nicht der Weg. Wer von Jerusalem nach Jericho ging, nahm die
 * Straße durchs Wadi.
 */
function alongQuestion(places: Place[], lang: Lang): ChoiceQuestion | null {
  const nameCount = new Map<string, number>();
  for (const p of places) {
    const n = placeName(p, lang);
    nameCount.set(n, (nameCount.get(n) ?? 0) + 1);
  }

  for (let versuch = 0; versuch < 12; versuch++) {
    const journey = pick(BIBLE_JOURNEYS, 1)[0];
    if (!journey || journey.stops.length < 2) continue;
    const i = 1 + Math.floor(Math.random() * (journey.stops.length - 1));
    const von = journey.stops[i - 1];
    const nach = journey.stops[i];
    // Seewege nicht: was neben einer Schiffslinie liegt, lag nicht am Weg.
    if (nach.sea) continue;
    const a: LatLon = [von.lat, von.lon];
    const b: LatLon = [nach.lat, nach.lon];
    const namen = [
      lang === 'de' ? von.de : von.en,
      lang === 'de' ? nach.de : nach.en,
    ];

    /*
     * Nur eindeutige Namen. Eine Antwort ist hier bloß ein Name, und den gibt
     * es mehrfach: „Karmel" liegt am Meer und in Juda, „Zion" ebenso doppelt in
     * den Daten. Nachgemessen führte das zu Fragen, bei denen die richtige
     * Antwort je nach gemeintem Ort 8 km oder 134 km neben der Linie lag – für
     * den Spielenden nicht entscheidbar. Wer hier steht, steht nur einmal.
     */
    const eindeutig = (p: Place) => nameCount.get(placeName(p, lang)) === 1;

    const nah = placesAlong(places, a, b, 8, 8, namen).filter(
      (h) => h.place.mentionCount >= 3 && eindeutig(h.place),
    );
    if (!nah.length) continue;
    const richtig = nah.reduce((x, y) => (y.place.mentionCount > x.place.mentionCount ? y : x));

    // Alles, was auch nur entfernt in Frage käme, scheidet als falsche Antwort
    // aus – ein großzügiger Korridor von 60 km.
    const strittig = new Set(placesAlong(places, a, b, 60, 2000, []).map((h) => h.place.id));
    const fern = places.filter(
      (p) =>
        p.types.includes('settlement') &&
        p.mentionCount >= 5 &&
        eindeutig(p) &&
        !strittig.has(p.id) &&
        p.id !== richtig.place.id &&
        distanceKm(a, [p.lat, p.lon]) > 100 &&
        distanceKm(b, [p.lat, p.lon]) > 100,
    );
    if (fern.length < 3) continue;

    const rightName = placeName(richtig.place, lang);
    const options = shuffle([rightName, ...pick(fern, 3).map((p) => placeName(p, lang))]);
    if (new Set(options).size !== 4) continue;

    return {
      kind: 'choice',
      prompt: lang === 'de' ? 'Welcher dieser Orte lag auf dem Weg?' : 'Which of these lay along the way?',
      subject: lang === 'de' ? `Von ${namen[0]} nach ${namen[1]}` : `From ${namen[0]} to ${namen[1]}`,
      options,
      answer: options.indexOf(rightName),
      explain:
        lang === 'de'
          ? `${rightName} liegt ${formatKm(richtig.quer, lang)} neben der Luftlinie zwischen beiden. Die Luftlinie ist nicht der Weg – gegangen wurde, wo das Gelände es zuließ.`
          : `${rightName} lies ${formatKm(richtig.quer, lang)} off the straight line between the two. That line is not the road – people walked where the land allowed.`,
      at: [richtig.place.lat, richtig.place.lon],
    };
  }
  return null;
}

/**
 * Eine Runde: Ortsfragen, dazu – wenn gewünscht – ein Drittel Wissensfragen
 * aus den Reisen, der Ausbreitung und den Etappen. Gemischt, damit niemand
 * weiß, was kommt.
 */
export function buildRound(places: Place[], level: Level, mix: boolean, lang: Lang, rounds = 8): Question[] {
  // Nur Siedlungen: bei Regionen wie „Moab" wäre der eine Punkt willkürlich.
  const pool = places.filter((p) => p.types.includes('settlement') && p.mentionCount >= LEVEL_MIN[level]);
  const knowledge = mix ? Math.min(3, rounds - 1) : 0;
  const where: Question[] = pick(pool, rounds - knowledge).map((place) => ({ kind: 'where', place }));

  const choices: Question[] = [];
  let guard = 0;
  while (choices.length < knowledge && guard++ < 40) {
    const art = choices.length % 3;
    const q =
      art === 0 ? journeyQuestion(lang) : art === 1 ? spreadQuestion(lang) : alongQuestion(places, lang);
    if (q && !choices.some((c) => c.kind === 'choice' && c.subject === q.subject)) choices.push(q);
  }
  return shuffle([...where, ...choices]);
}
