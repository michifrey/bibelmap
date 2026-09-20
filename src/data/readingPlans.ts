// Leseplläne, die es anderswo gibt – die Wege aus dieser App hinaus.
//
// **Warum hier nichts nachgebaut wird.** Den Plan für ein einzelnes Buch
// rechnet `src/lib/readingPlan.ts` aus: Kapitel durch Tage, oder ein Tag je
// Zug der Schriftrolle. Das ist billig und genau, weil die Daten im Haus
// liegen. Ein Plan über die ganze Bibel ist etwas anderes: Er ist eine
// Entscheidung – chronologisch oder kanonisch, mit oder ohne Psalmen
// nebenher, in einem Jahr oder in acht –, und solche Entscheidungen haben
// andere Leute mit Sorgfalt getroffen und pflegen sie. Sie abzuschreiben
// hieße, eine schlechtere Kopie zu betreuen.
//
// Deshalb stehen hier **Verweise**, keine Pläne: Titel, Anbieter, Dauer, eine
// Zeile, was der Plan tut – und die Adresse. Dieselbe Haltung wie bei den
// Podcasts in `data/media/sources.json` und bei den BibleProject-Guides.
//
// **Die Adressen werden abgeklopft.** `npm run check:urls` liest jede feste
// Adresse aus `src/data` und fragt täglich nach (Lauf „Agent – Links"); ein
// 404 wird gemeldet, und der Agent sucht die neue. Eine Plan-Adresse, die ins
// Leere führt, ist schlimmer als kein Eintrag: Sie verspricht etwas.
//
// **Was hier nicht steht.** Kein Plan, den ich nicht benennen kann, und keine
// erratene Adresse. Wo es einen Plan nur auf Deutsch oder nur auf Englisch
// gibt, steht das dabei, statt die andere Sprache zu behaupten.

export interface Bilingual {
  de: string;
  en: string;
}

export interface ReadingPlan {
  id: string;
  /** Wer den Plan macht – nicht die Plattform, auf der er liegt. */
  provider: string;
  title: Bilingual;
  /**
   * Wie lange er dauert, als Text: „ein Jahr", „19 Tage". Keine Zahl, weil
   * nicht jeder Plan in Tagen rechnet – der ÖAB-Plan läuft acht Jahre.
   */
  duration: Bilingual;
  /** Was er tut, in einem Satz. */
  what: Bilingual;
  /**
   * Die Adresse je Sprache. Gibt es den Plan nur in einer, steht dieselbe
   * zweimal da und `only` sagt, welche Sprache man bekommt.
   */
  url: { de: string; en: string };
  /** Gesetzt, wenn der Plan nur in einer Sprache vorliegt. */
  only?: 'de' | 'en';
}

/**
 * BibleProject steht hier zuerst, und das ist kein Zufall: Die Buchporträts
 * dieser App sind an ihren Buchvideos entlanggebaut, und ihr Jahresplan legt
 * genau diese Videos neben den Text. Wer ein Porträt gelesen hat und
 * weitermachen will, ist dort am richtigen Platz.
 */
export const READING_PLANS: ReadingPlan[] = [
  {
    id: 'bp-books',
    provider: 'BibleProject',
    title: { de: 'Die Bücher der Bibel', en: 'The Bible' },
    duration: { de: 'ein Jahr', en: 'one year' },
    what: {
      de: 'Durch die ganze Bibel in der Reihenfolge des Kanons, mit dem Übersichtsvideo zu jedem Buch – dieselben Videos, die in den Porträts eingebettet sind.',
      en: 'Through the whole Bible in canonical order, with the overview video for each book – the same videos embedded in the portraits.',
    },
    url: {
      de: 'https://www.bible.com/de/reading-plans/26455-bibleproject-die-bucher-der-bibel',
      en: 'https://www.bible.com/reading-plans/4820-bibleproject-the-bible',
    },
  },
  {
    id: 'bp-howto',
    provider: 'BibleProject',
    title: { de: 'Wie man die Bibel liest', en: 'How to Read the Bible' },
    duration: { de: '19 Tage', en: '19 days' },
    what: {
      de: 'Nicht ein Buch, sondern das Lesen selbst: Was für eine Art Text das ist, welche Gattungen darin stecken und welcher Faden hindurchläuft.',
      en: 'Not one book but the reading itself: what kind of text this is, which genres it holds, and which thread runs through it.',
    },
    url: {
      de: 'https://www.bible.com/de/reading-plans/41213-bibleproject-wie-man-die-bibel-liest',
      en: 'https://www.bible.com/reading-plans/29316-bibleproject-how-to-read-the-bible',
    },
  },
  {
    id: 'bp-minor',
    provider: 'BibleProject',
    title: { de: 'Die kleinen Propheten', en: 'The Minor Prophets' },
    duration: { de: '25 Tage', en: '25 days' },
    what: {
      de: 'Die zwölf Bücher, die in dieser App noch kein Porträt haben und die man am ehesten überspringt – in fünfundzwanzig Tagen.',
      en: 'The twelve books that have no portrait here yet, and the ones most likely to be skipped – in twenty-five days.',
    },
    url: {
      de: 'https://www.bible.com/de/reading-plans/24156-bibleproject-die-kleinen-propheten',
      en: 'https://www.bible.com/de/reading-plans/24156-bibleproject-die-kleinen-propheten',
    },
    only: 'de',
  },
  {
    id: 'jahr',
    provider: 'YouVersion',
    title: { de: 'Durch die Bibel in einem Jahr', en: 'Read Through the Bible' },
    duration: { de: 'ein Jahr', en: 'one year' },
    what: {
      de: 'Der klassische Jahresplan: jeden Tag ein Stück aus mehreren Teilen der Bibel – Gesetz, Geschichte, Psalmen, Propheten, Evangelien.',
      en: 'The classic one-year plan: a portion each day from several parts of the Bible – law, history, psalms, prophets, gospels.',
    },
    url: {
      de: 'https://www.bible.com/de/reading-plans/22500-durch-die-bibel-in-einem-jahr',
      en: 'https://www.bible.com/de/reading-plans/140-read-through-the-bible',
    },
  },
  {
    id: 'oeab',
    provider: 'ÖAB',
    title: { de: 'ÖAB-Bibelleseplan', en: 'ÖAB reading plan (German)' },
    duration: { de: 'vier Jahre für das NT, acht für die ganze Bibel', en: 'four years for the NT, eight for the whole Bible' },
    what: {
      de: 'Der Plan der Ökumenischen Arbeitsgemeinschaft für Bibellesen – kleine Portionen, dafür wirklich alles, und in vielen deutschen Gemeinden seit Jahrzehnten derselbe Text am selben Tag.',
      en: 'The plan of the German ecumenical Bible-reading association – small portions, but genuinely everything, and for decades the same passage on the same day in many German congregations.',
    },
    url: {
      de: 'https://www.bible.com/de/reading-plans/233-bibelleseplan',
      en: 'https://www.bible.com/de/reading-plans/233-bibelleseplan',
    },
    only: 'de',
  },
];

/** Alle Pläne liegen bei YouVersion – dort stehen zehntausend weitere. */
export const PLAN_INDEX = {
  de: 'https://www.bible.com/de/reading-plans',
  en: 'https://www.bible.com/reading-plans',
};

/** Die Adresse eines Plans in der Sprache, die gerade gilt. */
export function planUrl(plan: ReadingPlan, lang: 'de' | 'en'): string {
  return plan.url[lang] ?? plan.url.de;
}
