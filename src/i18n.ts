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
  historyMode: { de: 'Heilsgeschichte', en: 'Story of the Bible' },
  historyHint: { de: 'Chronologisch von der Schöpfung bis zur neuen Welt.', en: 'Chronologically from creation to the new creation.' },
  placesOnMap: { de: 'Orte auf der Karte', en: 'Places on the map' },
  compareMode: { de: 'Religionen im Vergleich', en: 'Faiths compared' },
  inIslam: { de: 'Im Islam', en: 'In Islam' },
  judaism: { de: 'Judentum · Tanach', en: 'Judaism · Tanakh' },
  christianity: { de: 'Christentum · Bibel', en: 'Christianity · Bible' },
  islam: { de: 'Islam · Koran', en: 'Islam · Qur’an' },
  compareIntro: { de: 'Gemeinsame Gestalten von Judentum, Christentum und Islam – mit den Stellen, an denen die Schriften auf sie Bezug nehmen, betrachtet aus jüdisch-christlich-biblischer Sicht.', en: 'Figures shared by Judaism, Christianity and Islam — with the passages where each scripture refers to them, seen from a Jewish–Christian–biblical perspective.' },
  compareDisclaimer: { de: 'Die Angaben dienen als Lese-Wegweiser und behaupten keine Gleichsetzung der Texte. Unterschiede sind im jeweiligen Text nachzulesen.', en: 'References are reading pointers and do not claim the texts are equivalent. Differences are found in the texts themselves.' },
  modes: { de: 'Modi', en: 'Modes' },
  basemapLight: { de: 'Karte', en: 'Map' },
  basemapSatellite: { de: 'Satellit', en: 'Satellite' },
  basemapRelief: { de: 'Relief', en: 'Terrain' },
  basemapAntique: { de: 'Antike Welt', en: 'Ancient world' },
  showing: { de: 'Sichtbar', en: 'Showing' },
  places: { de: 'Orte', en: 'places' },
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
