import { createContext, useContext } from 'react';

export type Lang = 'de' | 'en';

type Dict = Record<string, { de: string; en: string }>;

const STRINGS: Dict = {
  appTitle: { de: 'Bibelmap', en: 'Bibelmap' },
  tagline: { de: 'Biblische Orte erkunden – Karte, Zeit und Geschichte', en: 'Explore biblical places – map, time and story' },
  search: { de: 'Ort oder Begriff suchen … (z. B. Goschen)', en: 'Search a place or term … (e.g. Goshen)' },
  results: { de: 'Treffer', en: 'Results' },
  noResults: { de: 'Keine Treffer', en: 'No results' },
  mentions: { de: 'Erwähnungen', en: 'mentions' },
  mention: { de: 'Erwähnung', en: 'mention' },
  alsoCalled: { de: 'Auch genannt', en: 'Also called' },
  passages: { de: 'Bibelstellen', en: 'Passages' },
  appearsIn: { de: 'Erscheint in', en: 'Appears in' },
  sources: { de: 'Quellen', en: 'Sources' },
  readDe: { de: 'Lesen (Luther)', en: 'Read (German)' },
  readEn: { de: 'Lesen (ESV)', en: 'Read (ESV)' },
  video: { de: 'The Bible Project – Video', en: 'The Bible Project – video' },
  openbible: { de: 'OpenBible Atlas', en: 'OpenBible Atlas' },
  wikipedia: { de: 'Wikidata / Wikipedia', en: 'Wikidata / Wikipedia' },
  biblia: { de: 'Biblia Factbook', en: 'Biblia Factbook' },
  timeline: { de: 'Zeitleiste', en: 'Timeline' },
  allEras: { de: 'Ganze Bibel', en: 'Whole Bible' },
  heatmap: { de: 'Heatmap', en: 'Heatmap' },
  markers: { de: 'Marker', en: 'Markers' },
  presentation: { de: 'Präsentationsmodus', en: 'Presentation mode' },
  presentationHint: { de: 'Ein Buch Kapitel für Kapitel durchlaufen.', en: 'Walk through a book, chapter by chapter.' },
  chooseBook: { de: 'Buch wählen', en: 'Choose a book' },
  chapter: { de: 'Kapitel', en: 'Chapter' },
  prev: { de: 'Zurück', en: 'Back' },
  next: { de: 'Weiter', en: 'Next' },
  placesInChapter: { de: 'Orte in diesem Kapitel', en: 'Places in this chapter' },
  textLoading: { de: 'Text wird geladen …', en: 'Loading text …' },
  noText: { de: 'Für dieses Kapitel liegt kein Text vor.', en: 'No text available for this chapter.' },
  noPlacesChapter: { de: 'In diesem Kapitel sind keine kartierten Orte erwähnt.', en: 'No mapped places are mentioned in this chapter.' },
  close: { de: 'Schließen', en: 'Close' },
  exit: { de: 'Beenden', en: 'Exit' },
  start: { de: 'Starten', en: 'Start' },
  loading: { de: 'Lade biblische Orte …', en: 'Loading biblical places …' },
  about: { de: 'Über', en: 'About' },
  topPlaces: { de: 'Häufigste Orte', en: 'Most mentioned' },
  oldTestament: { de: 'Altes Testament', en: 'Old Testament' },
  newTestament: { de: 'Neues Testament', en: 'New Testament' },
  era: { de: 'Epoche', en: 'Era' },
  reset: { de: 'Zurücksetzen', en: 'Reset' },
  showing: { de: 'Sichtbar', en: 'Showing' },
  places: { de: 'Orte', en: 'places' },
  // Zeitbaum / genealogy tree
  map: { de: 'Karte', en: 'Map' },
  tree: { de: 'Zeitbaum', en: 'Time tree' },
  treeTitle: { de: 'Zeitbaum', en: 'Time Tree' },
  treeSubtitle: { de: 'Von Adam & Eva bis in die Neuzeit', en: 'From Adam & Eve into the modern era' },
  expandAll: { de: 'Alle ausklappen', en: 'Expand all' },
  collapseAll: { de: 'Einklappen', en: 'Collapse' },
  expandHint: { de: 'Auf ▸ tippen zum Aufklappen · auf eine Person für Infos', en: 'Tap ▸ to unfold · tap a person for details' },
  born: { de: 'geb.', en: 'b.' },
  lived: { de: 'lebte', en: 'lived' },
  years: { de: 'Jahre', en: 'years' },
  spouse: { de: 'Ehe mit', en: 'Married to' },
  epoch: { de: 'Epoche', en: 'Epoch' },
  references: { de: 'Bibelstellen', en: 'Bible passages' },
  faithWitness: { de: 'Glaubenszeuge (Kirchengeschichte)', en: 'Faith witness (church history)' },
  bloodlineNote: {
    de: 'Die biblische Stammlinie endet bei Jesus Christus. Danach folgen keine Blutsverwandten, sondern bedeutende Glaubenszeugen der Kirchengeschichte (gestrichelte Linien).',
    en: 'The biblical bloodline ends with Jesus Christ. What follows are not blood relatives but key faith witnesses of church history (dashed lines).',
  },
};

export const LangContext = createContext<Lang>('de');

export function useLang(): Lang {
  return useContext(LangContext);
}

export function useT(): (key: keyof typeof STRINGS) => string {
  const lang = useLang();
  return (key) => STRINGS[key]?.[lang] ?? String(key);
}

export function t(lang: Lang, key: keyof typeof STRINGS): string {
  return STRINGS[key]?.[lang] ?? String(key);
}
