/**
 * Nachweisseite: jedes Stück fremdes Material, das in dieser App steckt oder
 * von ihr verlinkt wird – mit Lizenz, mit dem, was die Lizenz von uns verlangt,
 * und mit der Zeile, die deshalb sichtbar dastehen muss.
 *
 * Abgrenzung zu `support.ts`: dort geht es ums Danken und ums Geld, hier ums
 * Recht. Beide Seiten nennen dieselben Projekte, aber aus verschiedenen
 * Gründen – deshalb stehen sie nebeneinander und nicht ineinander.
 *
 * Die Lizenznamen kommen aus `lib/imageCredit.ts` (`licenseInfo`), damit
 * „CC BY-SA 4.0" hier nicht anders heißt als am Bild.
 */

export type CreditGroup = 'karten' | 'daten' | 'texte' | 'bilder' | 'medien' | 'technik';

export interface CreditEntry {
  id: string;
  name: string;
  /**
   * Wer dahintersteht, so wie die Leute sich selbst nennen. Ein reiner Name
   * bleibt ein Name; steht ein eigenes Wort darin („und Mitwirkende",
   * „Universität Göteborg"), gehört es in beide Sprachen.
   */
  by?: string | { de: string; en: string };
  group: CreditGroup;
  /** Lizenzkürzel, auflösbar über `licenseInfo` – null bei „je Stück verschieden". */
  license: string | null;
  /**
   * Material, das keiner freien Lizenz untersteht: eigener Titel und Link auf
   * die Bedingungen des Anbieters. Steht anstelle von `license`.
   */
  terms?: { de: string; en: string; url: string };
  /** Was daraus in dieser App steckt – und wo es zu sehen ist. */
  use: { de: string; en: string };
  /**
   * Die Zeile, die die Lizenz sichtbar verlangt. Wortlaut, nicht Umschreibung.
   *
   * Sie stand einsprachig hier – mit dem Gedanken, ein Wortlaut lasse sich
   * nicht übersetzen. Das stimmt nur halb: OpenStreetMap gibt seine Zeile
   * selbst in beiden Sprachen an („© OpenStreetMap-Mitwirkende" /
   * „© OpenStreetMap contributors"), und wo unsere eigenen Worte darin stehen
   * („Ortsdaten", „Historische Karte"), ist Deutsch in einer englischen
   * Oberfläche kein Wortlaut, sondern ein Übersehen.
   */
  attribution?: string | { de: string; en: string };
  /** Was sonst noch zu wissen ist, damit der Nachweis ehrlich bleibt. */
  note?: { de: string; en: string };
  /**
   * Dateien, die die Lizenz mitliefern lässt – etwa der OFL-Text zu den
   * Schriften. Liegen unter `public/`, werden also mit ausgeliefert.
   */
  files?: { de: string; en: string; url: string }[];
  home: string;
}

export const CREDIT_GROUPS: { id: CreditGroup; de: string; en: string; subDe: string; subEn: string }[] = [
  {
    id: 'karten',
    de: 'Karte & Kacheln',
    en: 'Map & tiles',
    subDe: 'Der Untergrund jeder Ansicht: Kartendaten, Kachelbilder und historische Grenzen.',
    subEn: 'The ground under every view: map data, tile imagery and historical borders.',
  },
  {
    id: 'daten',
    de: 'Orte & Verweise',
    en: 'Places & cross-references',
    subDe: 'Wo die Orte liegen, wie sie heißen und welche Stellen sie nennen.',
    subEn: 'Where the places are, what they are called and which passages name them.',
  },
  {
    id: 'texte',
    de: 'Bibeltext & Artikel',
    en: 'Bible text & articles',
    subDe: 'Jedes Wort, das diese Seite anzeigt und nicht selbst geschrieben hat.',
    subEn: 'Every word this site displays and did not write itself.',
  },
  {
    id: 'bilder',
    de: 'Bilder',
    en: 'Images',
    subDe: 'Fotos, Gemälde und Aufnahmen von Fundstücken – jedes mit eigener Lizenz.',
    subEn: 'Photos, paintings and pictures of finds – each under its own licence.',
  },
  {
    id: 'medien',
    de: 'Hören & Sehen',
    en: 'Listen & watch',
    subDe: 'Podcasts und Videos: verlinkt und eingebettet, nie kopiert.',
    subEn: 'Podcasts and videos: linked and embedded, never copied.',
  },
  {
    id: 'technik',
    de: 'Software & Schriften',
    en: 'Software & typefaces',
    subDe: 'Womit diese Seite gebaut ist und womit sie gesetzt ist.',
    subEn: 'What this site is built with and what it is set in.',
  },
];

export const CREDITS: CreditEntry[] = [
  // ------------------------------------------------------------- Karte
  {
    id: 'osm',
    name: 'OpenStreetMap',
    by: { de: 'OpenStreetMap Foundation und Mitwirkende', en: 'OpenStreetMap Foundation and contributors' },
    group: 'karten',
    license: 'ODbL-1.0',
    use: {
      de: 'Die Landkarte unter allen Kartenstilen: Küsten, Flüsse, Städte, Straßen.',
      en: 'The map beneath every style: coasts, rivers, cities, roads.',
    },
    attribution: { de: '© OpenStreetMap-Mitwirkende', en: '© OpenStreetMap contributors' },
    note: {
      de: 'Die ODbL verlangt die Nennung bei jeder Anzeige – sie steht deshalb auch unten rechts in der Karte selbst.',
      en: 'The ODbL requires the credit wherever the data is shown – so it also sits in the corner of the map itself.',
    },
    home: 'https://www.openstreetmap.org/copyright',
  },
  {
    id: 'carto',
    name: 'CARTO Basemaps',
    by: 'CARTO',
    group: 'karten',
    license: 'CC-BY-3.0',
    use: {
      de: 'Die Kachelbilder der hellen und der dunklen Karte („Positron" und „Dark Matter").',
      en: 'The tile imagery of the light and dark styles ("Positron" and "Dark Matter").',
    },
    attribution: '© CARTO',
    home: 'https://carto.com/attributions',
  },
  {
    id: 's2cloudless',
    name: 'Sentinel-2 cloudless 2020',
    by: 'EOX IT Services · Copernicus / ESA',
    group: 'karten',
    license: 'CC-BY-4.0',
    use: {
      de: 'Die Satellitenkarte: ein wolkenfreies Mosaik aus einem Jahr Sentinel-2-Aufnahmen, 10 m je Bildpunkt.',
      en: 'The satellite basemap: a cloudless mosaic from a year of Sentinel-2 imagery, 10 m per pixel.',
    },
    attribution:
      'Sentinel-2 cloudless 2020 (s2maps.eu) by EOX IT Services GmbH — Contains modified Copernicus Sentinel data 2020',
    note: {
      de: 'Ersetzt die frühere Esri-Satellitenkarte, die außerhalb eines ArcGIS-Kontos nur nach Vertrag genutzt werden darf. Ab Stufe 14 vergrößert die App das Bild, statt schärfere Kacheln zu verlangen, die es nicht gibt.',
      en: 'Replaces the earlier Esri satellite layer, which outside an ArcGIS account may only be used under contract. From zoom 14 the app scales the imagery up instead of asking for sharper tiles that do not exist.',
    },
    home: 'https://s2maps.eu/',
  },
  {
    id: 'terrain-light',
    name: 'Terrain Light',
    by: 'EOX IT Services',
    group: 'karten',
    license: 'CC-BY-4.0',
    use: {
      de: 'Die Reliefkarte: Höhen und Küsten ohne Beschriftung – der ruhige Untergrund für die Zeitschichten.',
      en: 'The relief basemap: elevation and coastlines without labels – the quiet ground for the time layers.',
    },
    attribution:
      'Terrain Light © EOX — Data © OpenStreetMap contributors, SRTM, Natural Earth',
    note: {
      de: 'Ersetzt Esris Shaded Relief aus demselben Grund wie oben.',
      en: 'Replaces Esri’s Shaded Relief for the same reason as above.',
    },
    home: 'https://maps.eox.at/',
  },
  {
    id: 'dare',
    name: 'Digital Atlas of the Roman Empire (Imperium)',
    by: { de: 'Johan Åhlfeldt · Universität Göteborg', en: 'Johan Åhlfeldt · University of Gothenburg' },
    group: 'karten',
    license: 'CC-BY-4.0',
    use: {
      de: 'Die historische Karte („antik") mit römischen Straßen und Siedlungen.',
      en: 'The historical basemap ("antique") with Roman roads and settlements.',
    },
    attribution: {
      de: 'Historische Karte © DARE, Universität Göteborg (CC BY)',
      en: 'Historical map © DARE, University of Gothenburg (CC BY)',
    },
    home: 'https://imperium.ahlfeldt.se/',
  },
  {
    id: 'historical-basemaps',
    name: 'historical-basemaps',
    by: 'André Ourednik',
    group: 'karten',
    license: 'GPL-3.0',
    use: {
      de: 'Reiche und Grenzen hinter dem Jahresregler – zwölf Kartenblätter von 2000 v. Chr. bis 100 n. Chr.',
      en: 'The empires and borders behind the year slider – twelve sheets from 2000 BC to AD 100.',
    },
    note: {
      de: 'Copyleft: die daraus abgeleiteten Grenzdaten in `public/data/` stehen unter derselben Lizenz. Die Verläufe sind Annäherungen.',
      en: 'Copyleft: the border data derived from it in `public/data/` stands under the same licence. The lines are approximations.',
    },
    home: 'https://github.com/aourednik/historical-basemaps',
  },

  // ------------------------------------------------------------- Daten
  {
    id: 'openbible-geo',
    name: 'OpenBible.info – Bible Geocoding',
    by: 'Stephen Smith',
    group: 'daten',
    license: 'CC-BY-4.0',
    use: {
      de: 'Jeder Marker: Koordinaten, Schreibvarianten und Bibelstellen zu rund 1.335 Orten – und die Bilder, die der Datensatz mitbringt.',
      en: 'Every marker: coordinates, spellings and passages for some 1,335 places – and the images the dataset brings along.',
    },
    attribution: { de: 'Ortsdaten © OpenBible.info, CC BY 4.0', en: 'Place data © OpenBible.info, CC BY 4.0' },
    home: 'https://www.openbible.info/geo/',
  },
  {
    id: 'openbible-xrefs',
    name: 'OpenBible.info – Cross References',
    by: 'Stephen Smith',
    group: 'daten',
    license: 'CC-BY-4.0',
    use: {
      de: 'Die Verweise zwischen den biblischen Büchern im Graph.',
      en: 'The links between the biblical books in the graph view.',
    },
    attribution: { de: 'Querverweise © OpenBible.info, CC BY 4.0', en: 'Cross references © OpenBible.info, CC BY 4.0' },
    home: 'https://www.openbible.info/labs/cross-references/',
  },
  {
    id: 'wikidata',
    name: 'Wikidata',
    by: { de: 'Wikimedia Foundation und Freiwillige', en: 'Wikimedia Foundation and volunteers' },
    group: 'daten',
    license: 'CC0',
    use: {
      de: 'Die Verknüpfung der Orte mit ihren Wikidata-Einträgen – und darüber die Bildsuche für Orte ohne eigenes Foto.',
      en: 'The link from each place to its Wikidata entry – and through it the image lookup for places without a photo of their own.',
    },
    note: {
      de: 'CC0 verlangt nichts. Genannt wird Wikidata trotzdem, weil eine Quelle, die man nicht nennt, keine Quelle ist.',
      en: 'CC0 asks for nothing. Wikidata is named anyway: a source you do not name is not a source.',
    },
    home: 'https://www.wikidata.org/',
  },

  // ------------------------------------------------------------- Texte
  {
    id: 'luther1912',
    name: 'Lutherbibel 1912',
    group: 'texte',
    license: 'PD',
    use: {
      de: 'Der deutsche Bibeltext im Entdeckermodus – und die Grundlage, aus der die deutschen Ortsnamen hergeleitet sind.',
      en: 'The German Bible text in explorer mode – and the basis the German place names are derived from.',
    },
    home: 'https://github.com/seven1m/open-bibles',
  },
  {
    id: 'web',
    name: 'World English Bible',
    by: 'Michael Paul Johnson · eBible.org',
    group: 'texte',
    license: 'PD',
    use: {
      de: 'Der englische Bibeltext im Entdeckermodus.',
      en: 'The English Bible text in explorer mode.',
    },
    home: 'https://ebible.org/',
  },
  {
    id: 'open-bibles',
    name: 'open-bibles',
    by: 'Tim Morgan',
    group: 'texte',
    license: 'MIT',
    use: {
      de: 'Die Sammlung, aus der beide Bibeltexte kommen (OSIS und USFX), aufbereitet und gepflegt.',
      en: 'The collection both Bible texts come from (OSIS and USFX), prepared and maintained.',
    },
    home: 'https://github.com/seven1m/open-bibles',
  },
  {
    id: 'wikipedia',
    name: 'Wikipedia',
    by: { de: 'Wikimedia Foundation und Autorinnen und Autoren', en: 'Wikimedia Foundation and its authors' },
    group: 'texte',
    license: 'CC-BY-SA-4.0',
    use: {
      de: 'Der Einleitungsabsatz an den Personen- und Dokumentkarten des Zeitbaums, zur Laufzeit geladen.',
      en: 'The opening paragraph on the person and document cards of the time tree, loaded at runtime.',
    },
    note: {
      de: 'Share-alike: Der Absatz steht als Zitat mit Link auf den Artikel, aus dem er stammt – dort stehen auch seine Autorinnen und Autoren. Weiterverwendet wird er nur unter derselben Lizenz.',
      en: 'Share-alike: the paragraph appears as a quotation linked to the article it comes from, where its authors are listed. It may be reused only under the same licence.',
    },
    home: 'https://de.wikipedia.org/',
  },

  // ------------------------------------------------------------- Bilder
  {
    id: 'commons',
    name: 'Wikimedia Commons',
    by: {
      de: 'die Fotografinnen, Fotografen und Museen, die dort hochladen',
      en: 'the photographers and museums who upload there',
    },
    group: 'bilder',
    license: null,
    use: {
      de: 'Die Fotos auf den Ortskarten, die Bilder der Personen und die Aufnahmen der Zeitdokumente im Zeitbaum.',
      en: 'The photos on place cards, the images of persons and the pictures of the documents in the time tree.',
    },
    note: {
      de: 'Die Lizenz ist bei jedem Bild eine andere. Deshalb holt die App zu jedem Bild Urheber und Lizenz von der Dateiseite und zeigt beides direkt am Bild an, verlinkt – eine pauschale Nennung an einer Stelle würde CC BY-SA nicht genügen.',
      en: 'Every image carries its own licence. So the app fetches author and licence from each file page and shows both at the image itself, linked – a blanket credit in one place would not satisfy CC BY-SA.',
    },
    home: 'https://commons.wikimedia.org/',
  },
  {
    id: 'darstellungen',
    name: 'Darstellungen antiker Personen',
    group: 'bilder',
    license: 'PD',
    use: {
      de: 'Die Gesichter im Zeitbaum sind Kunst späterer Jahrhunderte, meist gemeinfrei – kein Porträt nach dem Leben.',
      en: 'The faces in the time tree are art of later centuries, mostly public domain – no likeness taken from life.',
    },
    note: {
      de: 'Damit das niemand verwechselt, steht die Einordnung als Bildunterschrift an jedem Bild.',
      en: 'So that nobody mistakes them, that is written as the caption under every image.',
    },
    home: 'https://commons.wikimedia.org/',
  },

  // ------------------------------------------------------------- Medien
  {
    id: 'bibletunes',
    name: 'bibletunes.de',
    by: 'Detlef Kühlein · bibletunes gemeinnützige GmbH',
    group: 'medien',
    license: null,
    terms: { de: 'Öffentlicher RSS-Feed', en: 'Public RSS feed', url: 'https://bibletunes.de/' },
    use: {
      de: 'Die deutschen Podcast-Folgen unter „Hören & Sehen".',
      en: 'The German podcast episodes under "Listen & watch".',
    },
    note: {
      de: 'Übernommen werden nur Titel, Datum und Adresse aus dem öffentlichen Feed. Die Folgen selbst liegen und bleiben bei bibletunes.',
      en: 'Only title, date and address are taken from the public feed. The episodes themselves live and stay with bibletunes.',
    },
    home: 'https://bibletunes.de/',
  },
  {
    id: 'comer',
    name: 'John Mark Comer Teachings · Practicing the Way',
    by: 'John Mark Comer',
    group: 'medien',
    license: null,
    terms: { de: 'Öffentlicher RSS-Feed', en: 'Public RSS feed', url: 'https://www.practicingtheway.org/' },
    use: { de: 'Englische Podcast-Folgen zu Orten und Themen.', en: 'English podcast episodes on places and themes.' },
    home: 'https://www.practicingtheway.org/',
  },
  {
    id: 'keller',
    name: 'Timothy Keller Sermons · Gospel in Life',
    by: 'Timothy Keller · Redeemer City to City',
    group: 'medien',
    license: null,
    terms: { de: 'Öffentlicher RSS-Feed', en: 'Public RSS feed', url: 'https://gospelinlife.com/' },
    use: { de: 'Englische Predigten, über die Bibelstelle im Titel den Orten zugeordnet.', en: 'English sermons, matched to places by the passage in their title.' },
    home: 'https://gospelinlife.com/',
  },
  {
    id: 'bibleproject',
    name: 'BibleProject',
    by: 'Tim Mackie & Jon Collins',
    group: 'medien',
    license: null,
    terms: { de: 'Nutzungsbedingungen von BibleProject', en: 'BibleProject terms of use', url: 'https://bibleproject.com/terms/' },
    use: {
      de: 'Die Buch-Videos im Entdeckermodus und die Übersichtsseiten je Bibelbuch.',
      en: 'The book videos in explorer mode and the per-book overview pages.',
    },
    note: {
      de: 'Videos werden über youtube-nocookie.com eingebettet, das Vorschaubild erst auf Klick geladen; kopiert wird nichts.',
      en: 'Videos are embedded via youtube-nocookie.com and the preview image is loaded only on click; nothing is copied.',
    },
    home: 'https://bibleproject.com/',
  },
  {
    id: 'youtube',
    name: 'YouTube (youtube-nocookie.com)',
    by: 'Google Ireland Ltd.',
    group: 'medien',
    license: null,
    terms: { de: 'YouTube-Nutzungsbedingungen', en: 'YouTube terms of service', url: 'https://www.youtube.com/t/terms' },
    use: {
      de: 'Der Abspieler, in dem die verlinkten Videos laufen – eingebettet erst nach einem Klick.',
      en: 'The player the linked videos run in – embedded only after a click.',
    },
    home: 'https://www.youtube.com/',
  },
  {
    id: 'lesedienste',
    name: 'Bible.com · BibleGateway · Biblia (Faithlife)',
    group: 'medien',
    license: null,
    terms: { de: 'Nur verlinkt', en: 'Linked only', url: 'https://www.bible.com/' },
    use: {
      de: 'Die Wege zum Weiterlesen: Bibelstellen, Lutherbibel, ESV und der Faithlife-Faktenband zu jedem Ort.',
      en: 'The ways to read on: passages, the Luther Bible, the ESV and the Faithlife factbook for each place.',
    },
    note: {
      de: 'Von diesen Diensten wird nichts gespeichert oder angezeigt – nur ihre Adressen stehen in den Karten.',
      en: 'Nothing from these services is stored or displayed – only their addresses appear on the cards.',
    },
    home: 'https://www.biblegateway.com/',
  },

  // ------------------------------------------------------------- Technik
  {
    id: 'react',
    name: 'React · React DOM',
    by: { de: 'Meta und Mitwirkende', en: 'Meta and contributors' },
    group: 'technik',
    license: 'MIT',
    use: { de: 'Die Oberfläche.', en: 'The interface.' },
    home: 'https://react.dev/',
  },
  {
    id: 'vite',
    name: 'Vite',
    by: { de: 'Evan You und Mitwirkende', en: 'Evan You and contributors' },
    group: 'technik',
    license: 'MIT',
    use: { de: 'Der Bau der Seite.', en: 'The build of the site.' },
    home: 'https://vite.dev/',
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    by: 'Tailwind Labs',
    group: 'technik',
    license: 'MIT',
    use: { de: 'Das Gestaltungswerkzeug.', en: 'The styling tool.' },
    home: 'https://tailwindcss.com/',
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    by: 'Microsoft',
    group: 'technik',
    license: 'Apache-2.0',
    use: { de: 'Die Sprache, in der der Quelltext geschrieben ist.', en: 'The language the source is written in.' },
    home: 'https://www.typescriptlang.org/',
  },
  {
    id: 'leaflet',
    name: 'Leaflet',
    by: { de: 'Volodymyr Agafonkin und Mitwirkende', en: 'Volodymyr Agafonkin and contributors' },
    group: 'technik',
    license: 'BSD-2-Clause',
    use: { de: 'Die Karte selbst – Kacheln, Marker, Zoom.', en: 'The map itself – tiles, markers, zoom.' },
    home: 'https://leafletjs.com/',
  },
  {
    id: 'react-leaflet',
    name: 'React Leaflet',
    by: { de: 'Paul Le Cam und Mitwirkende', en: 'Paul Le Cam and contributors' },
    group: 'technik',
    license: 'Hippocratic-2.1',
    use: { de: 'Die Brücke zwischen React und Leaflet.', en: 'The bridge between React and Leaflet.' },
    home: 'https://react-leaflet.js.org/',
  },
  {
    id: 'leaflet-plugins',
    name: 'Leaflet.markercluster · Leaflet.heat',
    by: 'Dave Leaver · Volodymyr Agafonkin',
    group: 'technik',
    license: 'MIT',
    use: {
      de: 'Die Bündel dicht beieinanderliegender Marker und die Heatmap.',
      en: 'The clustering of crowded markers and the heatmap.',
    },
    note: {
      de: 'Leaflet.heat steht unter BSD-2-Clause, Leaflet.markercluster unter MIT.',
      en: 'Leaflet.heat is BSD-2-Clause, Leaflet.markercluster is MIT.',
    },
    home: 'https://github.com/Leaflet/Leaflet.markercluster',
  },
  {
    id: 'fonts',
    name: 'Montserrat · Fraunces',
    by: 'Julieta Ulanovsky u. a. · Phaedra Charles & Flavia Zimbardi',
    group: 'technik',
    license: 'OFL-1.1',
    use: {
      de: 'Die Schriften der Seite: Montserrat für alles, Fraunces für den Bibeltext.',
      en: 'The typefaces of the site: Montserrat throughout, Fraunces for the Bible text.',
    },
    attribution: 'Montserrat © The Montserrat Project Authors · Fraunces © The Fraunces Project Authors',
    note: {
      de: 'Die Schriftdateien liegen im Projekt selbst und werden mit ausgeliefert – kein Aufruf an Google Fonts, also auch keine Besucherdaten dorthin. Die OFL verlangt, dass ihr Text die Dateien begleitet; hier ist er:',
      en: 'The font files live in the project and ship with it – no request to Google Fonts, so no visitor data goes there. The OFL requires its text to accompany the files; here it is:',
    },
    files: [
      { de: 'OFL – Montserrat', en: 'OFL – Montserrat', url: 'fonts/OFL-Montserrat.txt' },
      { de: 'OFL – Fraunces', en: 'OFL – Fraunces', url: 'fonts/OFL-Fraunces.txt' },
    ],
    home: 'https://fonts.google.com/',
  },
];

export const CREDITS_BY_GROUP: Record<CreditGroup, CreditEntry[]> = CREDIT_GROUPS.reduce(
  (acc, g) => ({ ...acc, [g.id]: CREDITS.filter((c) => c.group === g.id) }),
  {} as Record<CreditGroup, CreditEntry[]>,
);

/** Wo der Quelltext dieser Seite liegt – für Korrekturen an dieser Liste. */
export const REPO_URL = 'https://github.com/michifrey/bibelmap';

/** Die Lizenz von Bibelmap selbst: GPL-3.0, erzwungen von den Grenzdaten. */
export const LICENSE_URL = 'https://github.com/michifrey/bibelmap/blob/main/LICENSE';

/**
 * Ein Feld, das ein Name oder ein Satz sein kann, in der gewählten Sprache.
 * Namen stehen als reine Zeichenkette da und gelten in jeder Sprache.
 */
export function inSprache(
  wert: string | { de: string; en: string } | undefined,
  lang: 'de' | 'en',
): string | undefined {
  if (wert === undefined) return undefined;
  return typeof wert === 'string' ? wert : wert[lang];
}
