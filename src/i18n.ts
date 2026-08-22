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
  media: { de: 'Hören & Sehen', en: 'Listen & watch' },
  showAll: { de: 'Alle zeigen', en: 'Show all' },
  showLess: { de: 'Weniger', en: 'Show less' },
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
  genealogy: { de: 'Stammbäume', en: 'Genealogies' },
  genealogySub: { de: 'Völker & Stämme – von Adam über die Völkertafel bis zu den Stämmen Israels', en: 'Nations & tribes – from Adam via the Table of Nations to the tribes of Israel' },
  genealogySearch: { de: 'Name suchen … (z. B. Jawan, Kanaan)', en: 'Search a name … (e.g. Javan, Canaan)' },
  expandAll: { de: 'Alle öffnen', en: 'Expand all' },
  collapseAll: { de: 'Alle schließen', en: 'Collapse all' },
  showOnMap: { de: 'Auf Karte', en: 'On map' },
  genealogyNote: {
    de: 'Quellen: 1. Chronik 1 (Völkertafel) und 1. Chronik 2–8 für die Stämme, ergänzt durch 4. Mose 26 und 1. Mose 46. Die Zuordnung der Stammväter zu historischen Völkern und Regionen folgt einer verbreiteten, traditionellen Deutung und ist nicht in jedem Fall gesichert.',
    en: 'Sources: 1 Chronicles 1 (Table of Nations) and 1 Chronicles 2–8 for the tribes, with Numbers 26 and Genesis 46. The identification of the ancestors with historical peoples and regions follows a common, traditional reading and is not certain in every case.',
  },

  support: { de: 'Projekte unterstützen', en: 'Support the projects' },
  supportSub: {
    de: 'Woher alles hier stammt – und wo man den Projekten etwas zurückgeben kann',
    en: 'Where all of this comes from – and where to give something back',
  },
  supportLead: { de: 'Diese Seite lebt von fremder Arbeit.', en: 'This site lives off other people’s work.' },
  supportBody1: {
    de: 'Bibelmap verdient nichts. Keine Werbung, kein Tracking, keine Bezahlschranke, kein Newsletter – und es wird hier auch kein Geld für die Seite selbst gesammelt. Sie ist ein freies Projekt und liegt offen einsehbar auf GitHub.',
    en: 'Bibelmap earns nothing. No ads, no tracking, no paywall, no newsletter – and no money is collected here for the site itself. It is a free project and its source is open on GitHub.',
  },
  supportBody2: {
    de: 'Fast alles, was du hier siehst, gehört jemand anderem: die Koordinaten jedes Ortes, der Bibeltext, die Fotos, die Landkarte darunter, die Podcast-Folgen und Videos. Bibelmap ordnet dieses Material an – geschaffen hat es nichts davon.',
    en: 'Almost everything you see here belongs to someone else: the coordinates of every place, the Bible text, the photos, the map underneath, the podcast episodes and videos. Bibelmap arranges that material – it created none of it.',
  },
  supportBody3: {
    de: 'Ohne diese Projekte gäbe es diese Seite schlicht nicht. Wer etwas geben möchte, gibt darum bitte dort und nicht hier – so kommt jeder Betrag direkt bei denen an, die die Arbeit tun.',
    en: 'Without these projects this site would simply not exist. So if you want to give something, give it there and not here – that way every gift reaches the people doing the work.',
  },
  supportNoAds: { de: 'Keine Werbung, kein Tracking, keine Bezahlschranke', en: 'No ads, no tracking, no paywall' },
  supportNoMoney: { de: 'Sammelt kein Geld für sich selbst', en: 'Collects no money for itself' },
  supportOpenSource: { de: 'Open Source – Quellcode und Daten offen einsehbar', en: 'Open source – code and data out in the open' },
  supportGroupContent: { de: 'Inhalte, die hier verlinkt sind', en: 'Content linked from here' },
  supportGroupContentSub: {
    de: 'Podcasts, Videos und Auslegung – sie stehen auf den Ortskarten unter „Hören & Sehen“.',
    en: 'Podcasts, videos and teaching – they show up on the place cards under “Listen & watch”.',
  },
  supportGroupData: { de: 'Daten, auf denen die Karte steht', en: 'The data the map stands on' },
  supportGroupDataSub: {
    de: 'Ohne diese Datensätze bliebe die Karte leer: Orte, Bibeltext, Bilder, Kartenmaterial.',
    en: 'Without these datasets the map would stay empty: places, Bible text, images, cartography.',
  },
  supportAlsoUsed: { de: 'Außerdem verlinkt und verwendet', en: 'Also linked and used' },
  supportAlsoUsedSub: {
    de: 'Dienste und freie Software, die Bibelmap nutzt oder verlinkt. Sie bitten hier um nichts, gehören aber genannt.',
    en: 'Services and free software Bibelmap uses or links to. They ask for nothing here, but they belong in the list.',
  },
  supportDonate: { de: 'Spenden', en: 'Give' },
  supportVisit: { de: 'Zur Seite', en: 'Visit' },
  supportOutro: {
    de: 'Danke an alle, die ihre Arbeit frei zugänglich machen. Bibelmap ist nur die Karte, die darüber liegt.',
    en: 'Thank you to everyone who makes their work freely available. Bibelmap is only the map laid over it.',
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
