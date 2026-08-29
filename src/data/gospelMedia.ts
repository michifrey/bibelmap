// Was andere zu diesen Stationen erzählen: die Videos von BibleProject und
// die Hörfolgen von bibletunes.de.
//
// Warum das hier steht und nicht in `media.ts`: Der Medienindex der App
// (`public/data/media.json`) entsteht aus RSS-Feeds und kennt nur, was der
// Feed gerade hergibt. Der bibletunes-Feed trägt die letzten hundert Folgen –
// im Moment 5. Mose und Sprüche. Die Evangelien liefen 2010 bis 2024 und sind
// längst aus dem Fenster gerutscht. Für eine Sektion über Jesus wäre das die
// falsche Antwort: „keine Folgen“.
//
// Deshalb zwei Wege nebeneinander:
//
//   1. Feste Adressen, die sich aus Buch und Kapitel bauen lassen – die
//      Übersichtsvideos von BibleProject sind nach Kapitelspannen geschnitten
//      (Matthäus 1-13 und 14-28, Lukas 1-9 und 10-24, Johannes 1-12 und
//      13-21), und bibletunes nummeriert seine Folgen je Kapitel.
//   2. Der eigene Modus „Hören & Sehen“, der zeigt, was der Index zu diesem
//      Kapitel hergibt – heute wenig, morgen mehr.
//
// Alle Adressen hier sind belegt, nicht geraten: die Videos über die Suche bei
// bibleproject.com, die Buchseiten über bibletunes.de. Was sich nicht belegen
// ließ, steht nicht drin. `npm run check:gospel-links` klopft sie ab; das
// braucht Netz und läuft deshalb nicht in `npm run check` mit.

/** Ein Video bei BibleProject. */
export interface BpVideo {
  id: string;
  url: string;
  de: string;
  en: string;
  /** Buchüberblick oder Thema – die Oberfläche trennt beides. */
  kind: 'overview' | 'theme';
}

export const BP_VIDEOS: BpVideo[] = [
  // Buchüberblicke, nach Kapitelspannen geschnitten
  { id: 'matthew-1-13', url: 'https://bibleproject.com/explore/video/matthew/', de: 'Matthäus 1-13', en: 'Matthew 1-13', kind: 'overview' },
  { id: 'matthew-14-28', url: 'https://bibleproject.com/videos/matthew-14-28/', de: 'Matthäus 14-28', en: 'Matthew 14-28', kind: 'overview' },
  { id: 'mark', url: 'https://bibleproject.com/videos/mark/', de: 'Markus', en: 'Mark', kind: 'overview' },
  { id: 'luke-1-9', url: 'https://bibleproject.com/videos/luke-1-9/', de: 'Lukas 1-9', en: 'Luke 1-9', kind: 'overview' },
  { id: 'luke-10-24', url: 'https://bibleproject.com/videos/luke-10-24/', de: 'Lukas 10-24', en: 'Luke 10-24', kind: 'overview' },
  { id: 'john-1-12', url: 'https://bibleproject.com/videos/john-1-12/', de: 'Johannes 1-12', en: 'John 1-12', kind: 'overview' },
  { id: 'john-13-21', url: 'https://bibleproject.com/videos/john-13-21/', de: 'Johannes 13-21', en: 'John 13-21', kind: 'overview' },

  // Themenvideos – sie hängen an einzelnen Stationen, nicht am Buch
  { id: 'messiah', url: 'https://bibleproject.com/videos/messiah/', de: 'Der Messias', en: 'The Messiah', kind: 'theme' },
  { id: 'son-of-man', url: 'https://bibleproject.com/videos/son-of-man/', de: 'Menschensohn', en: 'Son of Man', kind: 'theme' },
  { id: 'gospel-kingdom', url: 'https://bibleproject.com/videos/gospel-kingdom/', de: 'Reich Gottes', en: 'Gospel of the Kingdom', kind: 'theme' },
  { id: 'sacrifice-and-atonement', url: 'https://bibleproject.com/videos/sacrifice-and-atonement/', de: 'Opfer und Sühne', en: 'Sacrifice and Atonement', kind: 'theme' },
  { id: 'temple', url: 'https://bibleproject.com/videos/temple/', de: 'Der Tempel', en: 'Temple', kind: 'theme' },
  { id: 'holy-spirit', url: 'https://bibleproject.com/videos/holy-spirit/', de: 'Der Heilige Geist', en: 'Holy Spirit', kind: 'theme' },
  { id: 'water-of-life', url: 'https://bibleproject.com/videos/water-of-life/', de: 'Wasser des Lebens', en: 'Water of Life', kind: 'theme' },
  { id: 'how-to-read-gospel', url: 'https://bibleproject.com/videos/how-to-read-gospel/', de: 'Wie man ein Evangelium liest', en: 'How to Read the Gospel', kind: 'theme' },
];

export const BP_VIDEO_BY_ID: Record<string, BpVideo> = Object.fromEntries(
  BP_VIDEOS.map((v) => [v.id, v]),
);

/**
 * Welches Übersichtsvideo zu Buch und Kapitel gehört. BibleProject schneidet
 * die langen Evangelien in zwei Teile; Markus bekam einen.
 */
export function overviewVideo(book: string, chapter: number): BpVideo | undefined {
  if (book === 'Matt') return BP_VIDEO_BY_ID[chapter <= 13 ? 'matthew-1-13' : 'matthew-14-28'];
  if (book === 'Mark') return BP_VIDEO_BY_ID['mark'];
  if (book === 'Luke') return BP_VIDEO_BY_ID[chapter <= 9 ? 'luke-1-9' : 'luke-10-24'];
  if (book === 'John') return BP_VIDEO_BY_ID[chapter <= 12 ? 'john-1-12' : 'john-13-21'];
  return undefined;
}

/**
 * Themenvideos je Station. Nur dort, wo das Thema die Szene wirklich trägt –
 * „Opfer und Sühne“ gehört an das Kreuz, nicht an die Hochzeit von Kana.
 */
export const BP_THEMES: Record<string, string[]> = {
  annunciation: ['messiah'],
  magi: ['messiah'],
  baptism: ['holy-spirit'],
  'first-disciples': ['messiah'],
  cana: ['water-of-life'],
  'temple-cleansing-john': ['temple'],
  nicodemus: ['water-of-life'],
  'samaritan-woman': ['water-of-life'],
  'nazareth-synagogue': ['gospel-kingdom'],
  'sermon-mount': ['gospel-kingdom'],
  'parables-by-the-lake': ['gospel-kingdom'],
  'peters-confession': ['messiah', 'son-of-man'],
  transfiguration: ['son-of-man'],
  'palm-sunday': ['messiah'],
  'temple-and-fig': ['temple'],
  'olivet-discourse': ['son-of-man', 'temple'],
  'last-supper': ['sacrifice-and-atonement'],
  golgotha: ['sacrifice-and-atonement'],
  'empty-tomb': ['how-to-read-gospel'],
  ascension: ['holy-spirit'],
};

/* --- bibletunes.de -------------------------------------------------------- */

/** Eine Staffel bei bibletunes – ein Bibelbuch, Folge für Folge. */
export interface BtBook {
  /** OSIS-Kürzel des Buches. */
  book: string;
  /** Teil der Folgenadresse: `lukas-2-teil-1`. */
  slug: string;
  /** Seite der Staffel. */
  url: string;
  de: string;
  /** Wie viele Folgen die Staffel hat – sie geht Kapitel für Kapitel durch. */
  episodes: number;
  speaker: string;
  year: number;
}

export const BT_BOOKS: BtBook[] = [
  { book: 'Matt', slug: 'matthaus', url: 'https://bibletunes.de/books/nt/matthaeus', de: 'Matthäus', episodes: 123, speaker: 'Detlef Kühlein', year: 2010 },
  { book: 'Mark', slug: 'markus', url: 'https://bibletunes.de/books/nt/markus', de: 'Markus', episodes: 92, speaker: 'Jens Kaldewey', year: 2024 },
  { book: 'Luke', slug: 'lukas', url: 'https://bibletunes.de/books/nt/lukas', de: 'Lukas', episodes: 135, speaker: 'Detlef Kühlein', year: 2019 },
  { book: 'John', slug: 'johannes', url: 'https://bibletunes.de/books/johannes', de: 'Johannes', episodes: 105, speaker: 'Detlef Kühlein', year: 2013 },
];

export const BT_BY_BOOK: Record<string, BtBook> = Object.fromEntries(
  BT_BOOKS.map((b) => [b.book, b]),
);

/**
 * Die erste Folge zu einem Kapitel. bibletunes teilt jedes Kapitel in
 * mehrere Folgen und nummeriert sie durch (`matthaus-5-teil-1`); wie viele es
 * je Kapitel sind, sagt nur die Seite selbst – deshalb führt der Weg über
 * Teil 1 und von dort weiter.
 */
export function bibleTunesEpisodeUrl(book: string, chapter: number): string | undefined {
  const b = BT_BY_BOOK[book];
  return b ? `https://bibletunes.de/${b.slug}-${chapter}-teil-1` : undefined;
}

/**
 * Das Kapitel einer Bibelstelle, wie sie in `gospel.ts` steht.
 *
 * Die erste Zahl in der Angabe ist das Kapitel – bei den vier Evangelien
 * trägt der Buchname keine Ziffer, deshalb reicht das hier und nur hier
 * („1. Mose 12“ wäre etwas anderes). `check:gospel` rechnet die Regel gegen
 * den richtigen Stellenparser gegen, damit sie nicht still danebenliegt.
 */
export function chapterOfRef(ref: string): number | undefined {
  const m = ref.match(/(\d+)/);
  return m ? Number(m[1]) : undefined;
}
