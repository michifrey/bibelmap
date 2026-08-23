// „The Chosen“ neben den Stationen: welche Folge der Serie eine Szene spielt.
//
// Warum es das gibt: Wer die Serie gesehen hat, hat Bilder im Kopf, und die
// Sektion zum Leben Jesu kann sagen, welche Folge zu welcher Station gehört.
// Umgekehrt genauso – wer bei einer Folge wissen will, wo das steht.
//
// Drei Regeln, damit daraus keine falsche Auskunft wird:
//
//   1. Verlinkt wird nur die Serienseite selbst. Für einzelne Folgen gibt es
//      keine Adresse, die hier zuverlässig gebildet werden könnte.
//   2. Die Serie ist eine Verfilmung. Sie erfindet Figuren, Dialoge und ganze
//      Handlungsstränge – die Oberfläche sagt das dazu, und die Bibelstelle
//      steht immer daneben.
//   3. Die Zuordnung stammt aus dem Inhalt der Folgen, nicht von einer
//      Schnittstelle des Anbieters – sie wurde ohne Zugriff auf thechosen.tv
//      zusammengetragen. Bis jemand Staffel, Folge und Titel dort einmal
//      nachgesehen hat, gilt sie als unbestätigt (`VERIFIED = false`), und die
//      Oberfläche sagt das dazu. Wer sie geprüft hat, setzt den Schalter.
//
// Die Zuordnung ist bewusst lückenhaft: Nur Folgen, deren Handlung
// eindeutig auf einer dieser Stationen liegt, stehen hier. Eine Folge, die
// mehrere Szenen streift, wird nicht auf Verdacht eingetragen.

export interface ChosenEpisode {
  season: number;
  episode: number;
  /** Originaltitel, wie ihn der Anbieter führt. */
  title: string;
  /** Stationen aus `gospel.ts`, die diese Folge spielt. */
  stations: string[];
}

/**
 * Ob die Liste einmal beim Anbieter nachgesehen wurde. Solange das `false`
 * ist, weist die Oberfläche die Angaben als unbestätigt aus, statt sie als
 * Tatsache zu zeigen.
 */
export const VERIFIED = false;

export const CHOSEN_URL = 'https://www.thechosen.tv/';

export const CHOSEN: ChosenEpisode[] = [
  { season: 1, episode: 1, title: 'I Have Called You By Name', stations: ['women-who-fund'] },
  { season: 1, episode: 4, title: 'The Rock On Which It Is Built', stations: ['call-fishermen'] },
  { season: 1, episode: 5, title: 'The Wedding Gift', stations: ['cana'] },
  { season: 1, episode: 7, title: 'Invitations', stations: ['nicodemus', 'call-matthew'] },
  { season: 1, episode: 8, title: 'I Am He', stations: ['samaritan-woman'] },
  { season: 3, episode: 1, title: 'Homecoming', stations: ['sermon-mount'] },
  { season: 3, episode: 2, title: 'Two by Two', stations: ['twelve-sent'] },
  { season: 3, episode: 3, title: 'Physician, Heal Yourself', stations: ['nazareth-synagogue'] },
  { season: 3, episode: 8, title: 'Sustenance', stations: ['feeding-5000', 'walking-on-water'] },
  { season: 4, episode: 1, title: 'Promises', stations: ['baptist-killed'] },
  { season: 4, episode: 7, title: 'The Last Sign', stations: ['lazarus'] },
  { season: 4, episode: 8, title: 'Humble', stations: ['palm-sunday'] },
];

export const CHOSEN_BY_STATION: Record<string, ChosenEpisode[]> = (() => {
  const out: Record<string, ChosenEpisode[]> = {};
  for (const e of CHOSEN) for (const s of e.stations) (out[s] ??= []).push(e);
  return out;
})();

/** „S3 F8“ – kurz genug für eine Zeile neben der Bibelstelle. */
export function episodeLabel(e: ChosenEpisode, lang: 'de' | 'en'): string {
  return lang === 'de' ? `S${e.season} F${e.episode}` : `S${e.season} E${e.episode}`;
}
