// A guided chronological journey through the biblical narrative — from creation
// to the new creation. Dates are approximate and didactic, matching eras.ts.
// `places` are place names resolved against the map data at runtime.

export interface Milestone {
  id: string;
  era: string; // era id (eras.ts) for colour
  date: string;
  de: { title: string; text: string };
  en: { title: string; text: string };
  ref: { osis: string; chapter: number; label: string };
  places: string[];
  video?: string; // optional YouTube id
}

export const HISTORY: Milestone[] = [
  {
    id: 'creation', era: 'patriarchs', date: 'Urgeschichte',
    de: { title: 'Schöpfung', text: 'Gott erschafft Himmel und Erde und setzt den Menschen in den Garten Eden – der Anfang aller Dinge im biblischen Sinn.' },
    en: { title: 'Creation', text: 'God creates the heavens and the earth and places humanity in the Garden of Eden — the beginning of all things.' },
    ref: { osis: 'Gen', chapter: 1, label: '1. Mose 1–2' }, places: ['Eden'], video: 'GQI72THyO5I',
  },
  {
    id: 'fall', era: 'patriarchs', date: 'Urgeschichte',
    de: { title: 'Der Sündenfall', text: 'Der Mensch wendet sich von Gott ab. Die Folgen prägen die ganze weitere Geschichte.' },
    en: { title: 'The Fall', text: 'Humanity turns away from God; the consequences shape the rest of the story.' },
    ref: { osis: 'Gen', chapter: 3, label: '1. Mose 3' }, places: ['Eden'],
  },
  {
    id: 'flood', era: 'patriarchs', date: 'Urgeschichte',
    de: { title: 'Die Sintflut', text: 'Gott bewahrt Noah und seine Familie. Die Arche kommt auf dem Gebirge Ararat zur Ruhe.' },
    en: { title: 'The Flood', text: 'God preserves Noah and his family; the ark comes to rest on the mountains of Ararat.' },
    ref: { osis: 'Gen', chapter: 7, label: '1. Mose 6–9' }, places: ['Ararat'],
  },
  {
    id: 'babel', era: 'patriarchs', date: 'Urgeschichte',
    de: { title: 'Turmbau zu Babel', text: 'Die Menschen wollen sich einen Namen machen; Gott verwirrt ihre Sprache und zerstreut sie über die Erde.' },
    en: { title: 'The Tower of Babel', text: 'Humanity seeks to make a name for itself; God confuses their language and scatters them.' },
    ref: { osis: 'Gen', chapter: 11, label: '1. Mose 11' }, places: ['Babel', 'Shinar'],
  },
  {
    id: 'abraham', era: 'patriarchs', date: '~2000 v. Chr.',
    de: { title: 'Berufung Abrahams', text: 'Gott ruft Abraham aus Ur, führt ihn über Haran nach Kanaan und verheißt ihm Land, Nachkommen und Segen für alle Völker.' },
    en: { title: 'The Call of Abraham', text: 'God calls Abraham from Ur, leads him through Haran to Canaan, and promises land, offspring and blessing for all nations.' },
    ref: { osis: 'Gen', chapter: 12, label: '1. Mose 12' }, places: ['Ur', 'Haran', 'Shechem', 'Hebron', 'Canaan'],
  },
  {
    id: 'joseph', era: 'patriarchs', date: '~1900 v. Chr.',
    de: { title: 'Josef in Ägypten', text: 'Josef wird nach Ägypten verkauft, steigt zum Verwalter auf und rettet seine Familie vor der Hungersnot; Israel siedelt in Goschen.' },
    en: { title: 'Joseph in Egypt', text: 'Joseph is sold into Egypt, rises to power and saves his family from famine; Israel settles in Goshen.' },
    ref: { osis: 'Gen', chapter: 41, label: '1. Mose 37–50' }, places: ['Egypt', 'Goshen'],
  },
  {
    id: 'exodus', era: 'exodus', date: '~1446 v. Chr.',
    de: { title: 'Auszug aus Ägypten', text: 'Gott befreit Israel durch Mose aus der Sklaverei. Beim Schilfmeer rettet er das Volk vor dem Heer des Pharao.' },
    en: { title: 'The Exodus', text: 'Through Moses, God frees Israel from slavery and rescues them at the Red Sea from Pharaoh’s army.' },
    ref: { osis: 'Exod', chapter: 14, label: '2. Mose 12–14' }, places: ['Egypt', 'Red Sea'], video: 'jH_aojNJM3E',
  },
  {
    id: 'conquest', era: 'conquest', date: '~1406 v. Chr.',
    de: { title: 'Landnahme', text: 'Unter Josua zieht Israel über den Jordan ins verheißene Land; Jericho fällt als erste Stadt.' },
    en: { title: 'The Conquest', text: 'Under Joshua, Israel crosses the Jordan into the promised land; Jericho is the first city to fall.' },
    ref: { osis: 'Josh', chapter: 6, label: 'Josua 6' }, places: ['Jericho', 'Jordan', 'Canaan'],
  },
  {
    id: 'david', era: 'united', date: '~1000 v. Chr.',
    de: { title: 'König David & Jerusalem', text: 'David wird König über ganz Israel und macht Jerusalem zur Hauptstadt; Gott verheißt ihm ein ewiges Königtum.' },
    en: { title: 'King David & Jerusalem', text: 'David becomes king over all Israel and makes Jerusalem the capital; God promises him an everlasting kingdom.' },
    ref: { osis: '2Sam', chapter: 5, label: '2. Samuel 5' }, places: ['Jerusalem', 'Hebron', 'Bethlehem', 'Zion'],
  },
  {
    id: 'temple', era: 'united', date: '~960 v. Chr.',
    de: { title: 'Salomos Tempel', text: 'Salomo baut in Jerusalem den Tempel – das Zentrum der Gottesverehrung Israels.' },
    en: { title: 'Solomon’s Temple', text: 'Solomon builds the temple in Jerusalem — the center of Israel’s worship.' },
    ref: { osis: '1Kgs', chapter: 6, label: '1. Könige 6' }, places: ['Jerusalem', 'Zion'],
  },
  {
    id: 'divided', era: 'divided', date: '~930 v. Chr.',
    de: { title: 'Reichsteilung', text: 'Nach Salomo zerbricht das Reich: Israel im Norden (Hauptstadt Samaria), Juda im Süden (Jerusalem).' },
    en: { title: 'The Divided Kingdom', text: 'After Solomon the kingdom splits: Israel in the north (Samaria), Judah in the south (Jerusalem).' },
    ref: { osis: '1Kgs', chapter: 12, label: '1. Könige 12' }, places: ['Samaria', 'Jerusalem'],
  },
  {
    id: 'assyria', era: 'divided', date: '722 v. Chr.',
    de: { title: 'Fall des Nordreichs', text: 'Assyrien erobert Samaria und führt das Nordreich Israel in die Verbannung.' },
    en: { title: 'Fall of the North', text: 'Assyria conquers Samaria and exiles the northern kingdom of Israel.' },
    ref: { osis: '2Kgs', chapter: 17, label: '2. Könige 17' }, places: ['Samaria', 'Assyria', 'Nineveh'],
  },
  {
    id: 'exile', era: 'exile', date: '586 v. Chr.',
    de: { title: 'Babylonisches Exil', text: 'Babylon zerstört Jerusalem und den Tempel und führt Juda nach Babylon ins Exil.' },
    en: { title: 'Babylonian Exile', text: 'Babylon destroys Jerusalem and the temple and exiles Judah to Babylon.' },
    ref: { osis: '2Kgs', chapter: 25, label: '2. Könige 25' }, places: ['Jerusalem', 'Babylon'],
  },
  {
    id: 'return', era: 'return', date: '538 v. Chr.',
    de: { title: 'Rückkehr & Wiederaufbau', text: 'Nach dem Exil kehrt ein Rest nach Jerusalem zurück und baut Tempel und Stadtmauern wieder auf.' },
    en: { title: 'Return & Rebuilding', text: 'After the exile a remnant returns to Jerusalem and rebuilds the temple and city walls.' },
    ref: { osis: 'Ezra', chapter: 1, label: 'Esra 1; Nehemia' }, places: ['Jerusalem', 'Babylon'],
  },
  {
    id: 'jesus-birth', era: 'gospels', date: '~4 v. Chr.',
    de: { title: 'Geburt Jesu', text: 'Jesus wird in Betlehem geboren und wächst in Nazareth in Galiläa auf.' },
    en: { title: 'The Birth of Jesus', text: 'Jesus is born in Bethlehem and grows up in Nazareth of Galilee.' },
    ref: { osis: 'Luke', chapter: 2, label: 'Lukas 2' }, places: ['Bethlehem', 'Nazareth', 'Galilee'],
  },
  {
    id: 'ministry', era: 'gospels', date: '~30 n. Chr.',
    de: { title: 'Wirken Jesu', text: 'Jesus lehrt und heilt rund um den See Genezareth und zieht schließlich nach Jerusalem hinauf.' },
    en: { title: 'Jesus’ Ministry', text: 'Jesus teaches and heals around the Sea of Galilee and finally goes up to Jerusalem.' },
    ref: { osis: 'Matt', chapter: 4, label: 'Matthäus 4–9' }, places: ['Sea of Galilee', 'Capernaum', 'Nazareth'], video: '3Dv4-n6OYGI',
  },
  {
    id: 'cross', era: 'gospels', date: '~33 n. Chr.',
    de: { title: 'Kreuzigung & Auferstehung', text: 'In Jerusalem wird Jesus gekreuzigt und steht am dritten Tag auf – das Zentrum des christlichen Glaubens.' },
    en: { title: 'Crucifixion & Resurrection', text: 'In Jerusalem Jesus is crucified and rises on the third day — the center of the Christian faith.' },
    ref: { osis: 'Luke', chapter: 23, label: 'Lukas 23–24' }, places: ['Jerusalem'],
  },
  {
    id: 'church', era: 'church', date: '~33 n. Chr.',
    de: { title: 'Pfingsten & frühe Kirche', text: 'Der Heilige Geist kommt in Jerusalem; die Botschaft breitet sich aus – von Antiochia bis nach Rom.' },
    en: { title: 'Pentecost & the Early Church', text: 'The Holy Spirit comes in Jerusalem; the message spreads — from Antioch to Rome.' },
    ref: { osis: 'Acts', chapter: 2, label: 'Apostelgeschichte 2' }, places: ['Jerusalem', 'Antioch', 'Damascus'], video: 'CGbNw855ksw',
  },
  {
    id: 'paul', era: 'church', date: '~47–60 n. Chr.',
    de: { title: 'Paulus’ Missionsreisen', text: 'Paulus trägt das Evangelium durch die römische Welt – nach Ephesus, Korinth und schließlich Rom.' },
    en: { title: 'Paul’s Missionary Journeys', text: 'Paul carries the gospel across the Roman world — to Ephesus, Corinth and finally Rome.' },
    ref: { osis: 'Acts', chapter: 13, label: 'Apostelgeschichte 13–28' }, places: ['Antioch', 'Ephesus', 'Corinth', 'Rome'], video: 'Z-17KxpjL0Q',
  },
  {
    id: 'new-creation', era: 'church', date: 'Vollendung',
    de: { title: 'Neue Schöpfung', text: 'Die Offenbarung schließt den Bogen zum Anfang: ein neuer Himmel, eine neue Erde und das neue Jerusalem.' },
    en: { title: 'The New Creation', text: 'Revelation closes the arc back to the beginning: a new heaven, a new earth and the new Jerusalem.' },
    ref: { osis: 'Rev', chapter: 21, label: 'Offenbarung 21–22' }, places: ['Jerusalem'], video: '5nvVVcYD-0w',
  },
];
