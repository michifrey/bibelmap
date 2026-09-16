// „The Chosen“ neben den Stationen: welche Folge der Serie eine Szene spielt.
//
// Warum es das gibt: Wer die Serie gesehen hat, hat Bilder im Kopf, und die
// Sektion zum Leben Jesu kann sagen, welche Folge zu welcher Station gehört.
// Umgekehrt genauso – wer bei einer Folge wissen will, wo das steht.
//
// Woher die Angaben stammen:
//
//   * **Staffel, Folge, Titel** – aus mehreren unabhängigen Verzeichnissen
//     (Fandom-Wiki der Serie, IMDb, TV Guide, BYUtv, Apple TV), nachgesehen am
//     16. September 2026. Fünf Staffeln, je acht Folgen, Staffel 5 läuft unter
//     „The Chosen: Last Supper“.
//   * **Die Zuordnung Folge → Station** – aus dem Inhalt der Folgen, nicht aus
//     einer Schnittstelle des Anbieters. Sie ist eine Lesart, kein Datensatz:
//     Wo eine Folge eine Szene der Evangelien spielt, steht die Station dabei.
//   * **Die Adresse** – die Staffelseite beim Anbieter. Einzelne Folgen haben
//     dort undurchsichtige Zahlenkennungen (`/video/184683596184`), die sich
//     nicht aus Staffel und Folge bilden lassen; eine erratene Adresse wäre
//     schlechter als eine, die zur richtigen Staffel führt.
//
// Fünf der vierzig Folgen stehen ohne Station da, und das ist Absicht: Sie
// erzählen, was die Serie erfindet – einen Sabbat in Kapernaum, Kinder im
// Lager, einen Streit am Feuer. Dafür eine Bibelstelle zu behaupten wäre
// falsch. Die Serie ist eine Verfilmung: Sie erfindet Figuren, Dialoge und
// ganze Handlungsstränge, und die Oberfläche sagt das dazu. `check:gospel`
// zählt beim Lauf mit, wie viele Folgen eine Station haben.

export interface ChosenSeason {
  season: number;
  /** Eigener Titel der Staffel, wo es einen gibt. */
  title?: string;
  year: number;
  url: string;
}

export interface ChosenEpisode {
  season: number;
  episode: number;
  /** Originaltitel, wie ihn die Verzeichnisse führen. */
  title: string;
  /** Stationen aus `gospel.ts`, die diese Folge spielt – oft keine. */
  stations: string[];
}

/** Wann die Titel zuletzt gegen die Verzeichnisse gehalten wurden. */
export const TITLES_CHECKED = '2026-09-16';

export const SEASONS: ChosenSeason[] = [
  { season: 1, year: 2019, url: 'https://watch.thechosen.tv/page/season-1' },
  { season: 2, year: 2021, url: 'https://watch.thechosen.tv/page/season-2' },
  { season: 3, year: 2022, url: 'https://watch.thechosen.tv/page/season-3' },
  { season: 4, year: 2024, url: 'https://watch.thechosen.tv/page/season-4' },
  { season: 5, title: 'Last Supper', year: 2025, url: 'https://watch.thechosen.tv/page/season-5' },
];

export const SEASON_BY_NUMBER: Record<number, ChosenSeason> = Object.fromEntries(
  SEASONS.map((s) => [s.season, s]),
);

export const CHOSEN: ChosenEpisode[] = [
  /* --- Staffel 1 -------------------------------------------------------- */
  { season: 1, episode: 1, title: 'I Have Called You by Name', stations: ['women-who-fund'] },
  { season: 1, episode: 2, title: 'Shabbat', stations: [] },
  { season: 1, episode: 3, title: 'Jesus Loves the Little Children', stations: [] },
  { season: 1, episode: 4, title: 'The Rock on Which It Is Built', stations: ['call-fishermen'] },
  { season: 1, episode: 5, title: 'The Wedding Gift', stations: ['cana'] },
  { season: 1, episode: 6, title: 'Indescribable Compassion', stations: ['leper'] },
  { season: 1, episode: 7, title: 'Invitations', stations: ['nicodemus', 'call-matthew'] },
  { season: 1, episode: 8, title: 'I Am He', stations: ['samaritan-woman'] },

  /* --- Staffel 2 -------------------------------------------------------- */
  { season: 2, episode: 1, title: 'Thunder', stations: ['set-his-face'] },
  { season: 2, episode: 2, title: 'I Saw You', stations: ['first-disciples'] },
  { season: 2, episode: 3, title: 'Matthew 4:24', stations: ['capernaum-base'] },
  { season: 2, episode: 4, title: 'The Perfect Opportunity', stations: ['bethesda'] },
  { season: 2, episode: 5, title: 'Spirit', stations: [] },
  { season: 2, episode: 6, title: 'Unlawful', stations: ['sabbath-conflicts'] },
  { season: 2, episode: 7, title: 'Reckoning', stations: ['sermon-mount'] },
  { season: 2, episode: 8, title: 'Beyond Mountains', stations: ['twelve-chosen'] },

  /* --- Staffel 3 -------------------------------------------------------- */
  { season: 3, episode: 1, title: 'Homecoming', stations: ['sermon-mount'] },
  { season: 3, episode: 2, title: 'Two by Two', stations: ['twelve-sent'] },
  { season: 3, episode: 3, title: 'Physician, Heal Yourself', stations: ['nazareth-synagogue'] },
  { season: 3, episode: 4, title: 'Clean, Part 1', stations: ['jairus'] },
  { season: 3, episode: 5, title: 'Clean, Part 2', stations: ['jairus'] },
  { season: 3, episode: 6, title: 'Intensity in Tent City', stations: ['baptist-question'] },
  { season: 3, episode: 7, title: 'Ears to Hear', stations: ['parables-by-the-lake'] },
  { season: 3, episode: 8, title: 'Sustenance', stations: ['feeding-5000', 'walking-on-water'] },

  /* --- Staffel 4 -------------------------------------------------------- */
  { season: 4, episode: 1, title: 'Promises', stations: ['baptist-killed'] },
  { season: 4, episode: 2, title: 'The Rock or the Stumbling Block?', stations: ['peters-confession'] },
  { season: 4, episode: 3, title: 'Moon to Blood', stations: ['man-born-blind'] },
  { season: 4, episode: 4, title: 'Calm Before', stations: ['centurion'] },
  { season: 4, episode: 5, title: 'Sitting, Serving, Scheming', stations: [] },
  { season: 4, episode: 6, title: 'Dedication', stations: ['dedication-feast'] },
  { season: 4, episode: 7, title: 'The Last Sign', stations: ['lazarus'] },
  { season: 4, episode: 8, title: 'Humble', stations: ['palm-sunday'] },

  /* --- Staffel 5: Last Supper ------------------------------------------- */
  { season: 5, episode: 1, title: 'Entry', stations: ['palm-sunday'] },
  { season: 5, episode: 2, title: 'House of Cards', stations: ['temple-and-fig'] },
  { season: 5, episode: 3, title: 'Woes', stations: ['debates'] },
  { season: 5, episode: 4, title: 'The Same Coin', stations: ['betrayal-bargain'] },
  { season: 5, episode: 5, title: 'Because of Me', stations: [] },
  { season: 5, episode: 6, title: 'Reunions', stations: ['betrayal-bargain', 'last-supper'] },
  { season: 5, episode: 7, title: 'The Upper Room Part I', stations: ['last-supper'] },
  { season: 5, episode: 8, title: 'The Upper Room Part II', stations: ['last-supper', 'gethsemane'] },
];

export const CHOSEN_BY_STATION: Record<string, ChosenEpisode[]> = (() => {
  const out: Record<string, ChosenEpisode[]> = {};
  for (const e of CHOSEN) for (const s of e.stations) (out[s] ??= []).push(e);
  return out;
})();

/** Die Staffelseite beim Anbieter – dorthin führt jeder Verweis. */
export function episodeUrl(e: ChosenEpisode): string {
  return SEASON_BY_NUMBER[e.season]?.url ?? 'https://www.thechosen.tv/';
}

/** „S3 F8“ – kurz genug für eine Zeile neben der Bibelstelle. */
export function episodeLabel(e: ChosenEpisode, lang: 'de' | 'en'): string {
  return lang === 'de' ? `S${e.season} F${e.episode}` : `S${e.season} E${e.episode}`;
}
