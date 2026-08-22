/**
 * Every project Bibelmap is built out of.
 *
 * The list is not a "thank you" footnote: this site contributes no data, no
 * text, no images and no audio of its own — it only arranges the work of the
 * projects below. So each entry names what it actually contributes here, how it
 * has to be credited, and where to give money to the people who made it.
 */

export type SupportKind = 'content' | 'data';

export interface SupportProject {
  id: string;
  name: string;
  /** the people behind it, as they name themselves */
  by: string | null;
  kind: SupportKind;
  /** what this project contributes to Bibelmap */
  role: { de: string; en: string };
  /** licence / attribution, in the words the licence asks for */
  credit: { de: string; en: string };
  home: string;
  /** direct giving page — null when the project asks for nothing */
  donate: string | null;
  /** overrides the button text where the link explains giving rather than doing it */
  donateLabel?: { de: string; en: string };
  /** why there is no giving link */
  donateNote?: { de: string; en: string };
}

export const SUPPORT_PROJECTS: SupportProject[] = [
  {
    id: 'bibletunes',
    name: 'bibletunes.de',
    by: 'Detlef Kühlein · bibletunes gemeinnützige GmbH',
    kind: 'content',
    role: {
      de: 'Die deutschen Podcast-Folgen unter „Hören & Sehen“ auf jeder Ortskarte – Vers für Vers durch die ganze Bibel.',
      en: 'The German podcast episodes under “Listen & watch” on every place card – verse by verse through the whole Bible.',
    },
    credit: {
      de: 'Folgentitel und Links stammen aus dem öffentlichen RSS-Feed; die Folgen selbst liegen und bleiben bei bibletunes.',
      en: 'Episode titles and links come from the public RSS feed; the episodes themselves live and stay with bibletunes.',
    },
    home: 'https://bibletunes.de/',
    donate: 'https://bibletunes.de/spenden',
  },
  {
    id: 'bibleproject',
    name: 'BibleProject',
    by: 'Tim Mackie & Jon Collins',
    kind: 'content',
    role: {
      de: 'Die Buch-Videos und Lesehilfen, die zu jedem Ort verlinkt sind – und die Farb- und Formensprache, an der sich diese Seite orientiert.',
      en: 'The book videos and reading guides linked from every place – and the look this site takes its cue from.',
    },
    credit: {
      de: 'Verlinkt werden nur die offiziellen Übersichtsseiten je Bibelbuch; Videos und Texte bleiben auf bibleproject.com.',
      en: 'Only the official per-book overview pages are linked; videos and texts stay on bibleproject.com.',
    },
    home: 'https://bibleproject.com/',
    donate: 'https://bibleproject.com/give/',
  },
  {
    id: 'comer',
    name: 'Practicing the Way',
    by: 'John Mark Comer',
    kind: 'content',
    role: {
      de: 'Englische Folgen zu Bibelstellen, die in „Hören & Sehen“ auftauchen, wenn ein Ort in der behandelten Stelle vorkommt.',
      en: 'English episodes on passages, surfacing under “Listen & watch” when a place occurs in the passage discussed.',
    },
    credit: {
      de: 'Alle Ressourcen sind dort kostenlos – finanziert von monatlich Gebenden.',
      en: 'Every resource there is free – paid for by monthly givers.',
    },
    home: 'https://practicingtheway.org/',
    donate: 'https://practicingtheway.org/give',
  },
  {
    id: 'keller',
    name: 'Gospel in Life',
    by: 'Timothy Keller · Redeemer City to City',
    kind: 'content',
    role: {
      de: 'Der Predigt-Podcast, aus dem auslegende Folgen zu den Bibelstellen eines Ortes verlinkt werden.',
      en: 'The sermon podcast that expository episodes on a place’s passages are linked from.',
    },
    credit: {
      de: 'Gospel in Life ist ein Dienst von Redeemer City to City.',
      en: 'Gospel in Life is a ministry of Redeemer City to City.',
    },
    home: 'https://gospelinlife.com/',
    donate: 'https://gospelinlife.com/donate/',
  },
  {
    id: 'openbible',
    name: 'OpenBible.info – Bible Geocoding',
    by: 'Stephen Smith',
    kind: 'data',
    role: {
      de: 'Jeder einzelne Marker auf dieser Karte: Koordinaten, Namensvarianten und Bibelstellen zu rund 1.335 Orten.',
      en: 'Every single marker on this map: coordinates, name variants and passages for some 1,335 places.',
    },
    credit: {
      de: 'Ortsdaten © OpenBible.info, CC-BY 4.0.',
      en: 'Place data © OpenBible.info, CC BY 4.0.',
    },
    home: 'https://www.openbible.info/geo/',
    donate: null,
    donateNote: {
      de: 'Nimmt keine Spenden entgegen. Wer danken will, nennt die Quelle weiter und empfiehlt die Seite.',
      en: 'Takes no donations. The way to say thanks is to keep crediting the source and to pass the site on.',
    },
  },
  {
    id: 'openbibles',
    name: 'open-bibles',
    by: 'Tim Morgan',
    kind: 'data',
    role: {
      de: 'Der Bibeltext im Präsentationsmodus: Lutherbibel 1912 (OSIS) und World English Bible (USFX), aufbereitet und gepflegt.',
      en: 'The Bible text in presentation mode: Luther 1912 (OSIS) and the World English Bible (USFX), prepared and maintained.',
    },
    credit: {
      de: 'Sammlung unter MIT-Lizenz; die enthaltenen Übersetzungen sind gemeinfrei.',
      en: 'MIT-licensed collection; the translations it holds are public domain.',
    },
    home: 'https://github.com/seven1m/open-bibles',
    donate: null,
    donateNote: {
      de: 'Ein Open-Source-Projekt ohne Spendenseite – ein Stern, ein Issue oder ein Pull Request sind die Währung.',
      en: 'An open-source project with no giving page – a star, an issue or a pull request is the currency.',
    },
  },
  {
    id: 'ebible',
    name: 'eBible.org · World English Bible',
    by: 'Michael Paul Johnson',
    kind: 'data',
    role: {
      de: 'Die englische Übersetzung, die im Präsentationsmodus neben dem Luthertext steht.',
      en: 'The English translation shown beside the Luther text in presentation mode.',
    },
    credit: {
      de: 'Die World English Bible ist gemeinfrei und darf ohne Einschränkung weitergegeben werden.',
      en: 'The World English Bible is public domain and may be shared without restriction.',
    },
    home: 'https://ebible.org/',
    donate: 'https://ebible.org/about.php',
    donateLabel: { de: 'Spenden-Info', en: 'How to give' },
    donateNote: {
      de: 'Spenden laufen über eine Partnerorganisation; die Über-Seite nennt den Weg.',
      en: 'Gifts run through a partner organisation; the about page names the route.',
    },
  },
  {
    id: 'wikimedia',
    name: 'Wikimedia Commons & Wikidata',
    by: 'Wikimedia Foundation und Freiwillige',
    kind: 'data',
    role: {
      de: 'Die Fotos auf den Ortskarten und die Verknüpfung der Orte mit Wikidata-Einträgen.',
      en: 'The photos on the place cards and the link from each place to its Wikidata entry.',
    },
    credit: {
      de: 'Bilder: Wikimedia Commons, Lizenz je Bild – der Bildnachweis steht an jedem Foto.',
      en: 'Images: Wikimedia Commons, licence per image – the credit sits on every photo.',
    },
    home: 'https://commons.wikimedia.org/',
    donate: 'https://donate.wikimedia.org/',
  },
  {
    id: 'osm',
    name: 'OpenStreetMap',
    by: 'OpenStreetMap Foundation und Mitwirkende',
    kind: 'data',
    role: {
      de: 'Die Landkarte selbst – Küsten, Flüsse, Städte und Straßen, auf denen die biblischen Orte liegen. Die Kacheln in dieser Darstellung liefert CARTO.',
      en: 'The map itself – coasts, rivers, cities and roads the biblical places sit on. The tiles in this style come from CARTO.',
    },
    credit: {
      de: 'Kartendaten © OpenStreetMap-Mitwirkende, Kacheln © CARTO.',
      en: 'Map data © OpenStreetMap contributors, tiles © CARTO.',
    },
    home: 'https://www.openstreetmap.org/',
    donate: 'https://supporting.openstreetmap.org/donate/',
  },
];

/** Services that are only linked out to — named for completeness, not for giving. */
export const SUPPORT_LINKED = [
  { name: 'BibleGateway', note: { de: 'Lutherbibel & ESV zum Nachlesen', en: 'Luther & ESV for reading on' }, home: 'https://www.biblegateway.com/' },
  { name: 'Biblia Factbook', note: { de: 'Faithlife – Hintergrund zu jedem Ort', en: 'Faithlife – background on each place' }, home: 'https://biblia.com/factbook/' },
  { name: 'Leaflet', note: { de: 'die Kartenbibliothek, BSD-2', en: 'the map library, BSD-2' }, home: 'https://leafletjs.com/' },
  { name: 'React · Vite · Tailwind CSS', note: { de: 'das Fundament der Oberfläche', en: 'the ground the interface stands on' }, home: 'https://react.dev/' },
];
