import { t, type Lang } from '../i18n';
import type { Mode, View } from '../components/Header';

/**
 * Der Titel des Browserfensters, passend zu dem, was gerade zu sehen ist.
 *
 * Vorher stand in jeder Ansicht derselbe Satz – auch bei Tieflinks wie
 * `#quiz` oder `#israel`. Wer sich drei Ansichten als Lesezeichen legt, hatte
 * dreimal „Bibelmap · Biblische Orte auf der Karte" und musste raten; im
 * Verlauf und in der Tableiste dasselbe.
 *
 * Die beiden Zuordnungen sind `Record<Mode, …>` und `Record<View, …>`. Das
 * ist die Prüfung: Wer einen Modus hinzufügt und den Titel vergisst, bekommt
 * keinen stillen Rückfall auf den alten Satz, sondern einen Fehler von `tsc`.
 *
 * Die Schlüssel sind die, die `ModePalette` und die Kopfzeile ohnehin
 * benutzen – hier wird nichts zweitübersetzt.
 */
const MODUS: Record<Mode, string> = {
  israel: 'israel',
  present: 'presentation',
  history: 'historyMode',
  journeys: 'journeys',
  gospel: 'gospel',
  mission: 'mission',
  compare: 'compareMode',
  church: 'churchMode',
  quiz: 'quiz',
  nations: 'genealogy',
  media: 'media',
  route: 'ownRoute',
  index: 'placeIndex',
  support: 'support',
  credits: 'credits',
};

const ANSICHT: Record<View, string> = {
  map: 'map',
  terrain: 'terrain',
  tree: 'tree',
  graph: 'graph',
};

/**
 * Der Titel, mit dem die Seite geladen wurde – der aus `index.html`.
 *
 * Er wird beim Laden einmal festgehalten und für die Startseite
 * wiederhergestellt, statt aus `appTitle` und `tagline` neu gebaut zu werden.
 * Zwei Gründe: Der Satz in `index.html` ist eigene Kopie – er steht in
 * Suchergebnissen und Linkvorschauen –, und ein selbst gebauter Titel würde
 * beim Laden kurz sichtbar umspringen.
 *
 * Der Preis, offen gesagt: Auf der Startseite bleibt der Titel deutsch, auch
 * auf Englisch. Das war vorher so und bleibt es; ihn zweisprachig zu machen
 * hiesse, den Satz in `index.html` zu ersetzen, und das ist eine Entscheidung
 * über die Aussenwirkung, nicht über die Bedienung.
 */
const START_TITEL = typeof document === 'undefined' ? 'Bibelmap' : document.title;

/** Der Titel der Startseite – unverändert der aus `index.html`. */
export function baseTitle(_lang: Lang): string {
  return START_TITEL;
}

/**
 * `null` für Modus und Ansicht heißt Startseite. Sonst steht vorn, was man
 * sieht, damit die Tableiste es abgeschnitten noch trägt.
 */
export function pageTitle(lang: Lang, view: View | null, mode: Mode | null): string {
  const schluessel = mode ? MODUS[mode] : view ? ANSICHT[view] : null;
  if (!schluessel) return baseTitle(lang);
  return `${t(lang, schluessel)} · ${t(lang, 'appTitle')}`;
}
