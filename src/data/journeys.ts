// Die großen Wege der Bibel als erzählte Reise: jede Station mit Bibelstelle,
// kurzem Text und – wo vorhanden – der `placeId` aus `public/data/places.json`,
// damit die Ortskarte einen Klick entfernt ist.
//
// Die Reihenfolge folgt dem biblischen Bericht, nicht einer Rekonstruktion der
// tatsächlichen Marschrouten. Manche Orte sind archäologisch nicht sicher
// lokalisiert (Sinai, Kadesch, Emmaus); die Koordinaten stammen aus dem
// OpenBible-Datensatz und geben die verbreitete Zuordnung wieder.
//
// Paulus' Reisen stehen bewusst nicht hier, sondern in `mission.ts`.

import type { Bilingual } from './mission';

export interface JourneyStop {
  de: string;
  en: string;
  lat: number;
  lon: number;
  /** Ort in places.json – erlaubt den Sprung auf die Hauptkarte. */
  placeId?: string;
  ref?: Bilingual;
  /** Der Weg *zu* dieser Station führt über Wasser – kein Fußmarsch. */
  sea?: boolean;
  /** Was hier geschieht – eine, höchstens zwei Sätze. */
  text: Bilingual;
}

export interface BibleJourney {
  id: string;
  de: string;
  en: string;
  /** Epoche aus eras.ts – gibt der Route ihre Farbe. */
  era: string;
  when: Bilingual;
  /** Gesamtstelle für den BibleGateway-Link. */
  passage: Bilingual;
  lead: Bilingual;
  stops: JourneyStop[];
}

export const JOURNEYS: BibleJourney[] = [
  {
    id: 'abraham',
    de: 'Abraham: Aufbruch ins Unbekannte',
    en: 'Abraham: setting out for the unknown',
    era: 'patriarchs',
    when: { de: '~2000 v. Chr.', en: 'c. 2000 BC' },
    passage: { de: '1. Mose 11,31-22,19', en: 'Genesis 11:31-22:19' },
    lead: {
      de: 'Ein Mann verlässt die größte Stadt seiner Zeit und zieht dorthin, wo Gott ihn hinführt – ohne Karte, ohne Ziel, das er nennen könnte.',
      en: 'A man leaves the greatest city of his day and goes where God leads him – with no map and no destination he could name.',
    },
    stops: [
      { de: 'Ur in Chaldäa', en: 'Ur of the Chaldeans', lat: 30.962, lon: 46.104, placeId: 'aa01373', ref: { de: '1. Mose 11,31', en: 'Gen 11:31' }, text: { de: 'Terach bricht mit seiner Sippe aus der Metropole am Euphrat auf – Ziel Kanaan.', en: 'Terah leaves the metropolis on the Euphrates with his clan – bound for Canaan.' } },
      { de: 'Haran', en: 'Haran', lat: 36.864, lon: 39.033, placeId: 'a6d9af3', ref: { de: '1. Mose 11,31-12,4', en: 'Gen 11:31-12:4' }, text: { de: 'Auf halbem Weg bleibt die Familie hängen. Erst nach Terachs Tod ergeht der Ruf an Abram: „Geh aus deinem Vaterland.“', en: 'Halfway there the family stops. Only after Terah dies does the call come to Abram: "Go out from your country."' } },
      { de: 'Sichem', en: 'Shechem', lat: 32.214, lon: 35.282, placeId: 'adf74d4', ref: { de: '1. Mose 12,6-7', en: 'Gen 12:6-7' }, text: { de: 'Bei der Eiche More die erste Zusage: „Deinen Nachkommen will ich dieses Land geben.“ Abram baut einen Altar.', en: 'At the oak of Moreh the first promise: "To your offspring I will give this land." Abram builds an altar.' } },
      { de: 'Bethel', en: 'Bethel', lat: 31.923, lon: 35.241, placeId: 'a64f355', ref: { de: '1. Mose 12,8', en: 'Gen 12:8' }, text: { de: 'Zelt zwischen Bethel und Ai, zweiter Altar. Abram lebt als Fremder in dem Land, das ihm versprochen ist.', en: 'A tent between Bethel and Ai, a second altar. Abram lives as a stranger in the land promised to him.' } },
      { de: 'Ägypten', en: 'Egypt', lat: 30.129, lon: 31.308, placeId: 'af301ca', ref: { de: '1. Mose 12,10-20', en: 'Gen 12:10-20' }, text: { de: 'Eine Hungersnot treibt ihn weiter nach Süden – und dort verleugnet er aus Angst seine Frau.', en: 'A famine drives him further south – and there, out of fear, he denies his wife.' } },
      { de: 'Bethel (zurück)', en: 'Bethel (again)', lat: 31.923, lon: 35.241, placeId: 'a64f355', ref: { de: '1. Mose 13,1-12', en: 'Gen 13:1-12' }, text: { de: 'Zurück am alten Altar trennen sich Abram und Lot: Lot wählt die Jordanaue, Abram bleibt im Bergland.', en: 'Back at the old altar, Abram and Lot part: Lot picks the Jordan plain, Abram stays in the hills.' } },
      { de: 'Hebron / Mamre', en: 'Hebron / Mamre', lat: 31.525, lon: 35.102, placeId: 'a85151a', ref: { de: '1. Mose 13,18; 18,1-15', en: 'Gen 13:18; 18:1-15' }, text: { de: 'Unter den Eichen von Mamre wohnt er am längsten – hier bekommen drei Gäste das Kind angekündigt, über das Sara lacht.', en: 'He lives longest by the oaks of Mamre – here three guests announce the child that makes Sarah laugh.' } },
      { de: 'Beerscheba', en: 'Beersheba', lat: 31.245, lon: 34.841, placeId: 'ad2f6c2', ref: { de: '1. Mose 21,22-34', en: 'Gen 21:22-34' }, text: { de: 'Brunnenstreit und Bundesschluss mit Abimelech; Abraham pflanzt eine Tamariske am Rand der Wüste.', en: 'A quarrel over a well and a covenant with Abimelech; Abraham plants a tamarisk at the desert edge.' } },
      { de: 'Land Morija', en: 'The land of Moriah', lat: 31.778, lon: 35.236, placeId: 'adaf385', ref: { de: '1. Mose 22,1-19', en: 'Gen 22:1-19' }, text: { de: 'Der schwerste Weg: drei Tagesreisen mit Isaak zum Berg – und im letzten Moment der Widder im Gestrüpp.', en: 'The hardest road: three days’ journey with Isaac to the mountain – and at the last moment the ram in the thicket.' } },
    ],
  },
  {
    id: 'jacob',
    de: 'Jakob: Flucht und Heimkehr',
    en: 'Jacob: flight and return',
    era: 'patriarchs',
    when: { de: '~1900 v. Chr.', en: 'c. 1900 BC' },
    passage: { de: '1. Mose 28-35', en: 'Genesis 28-35' },
    lead: {
      de: 'Jakob flieht mit einem erschlichenen Segen und kehrt zwanzig Jahre später mit zwei Frauen, elf Söhnen und einem neuen Namen zurück.',
      en: 'Jacob flees with a stolen blessing and returns twenty years later with two wives, eleven sons and a new name.',
    },
    stops: [
      { de: 'Beerscheba', en: 'Beersheba', lat: 31.245, lon: 34.841, placeId: 'ad2f6c2', ref: { de: '1. Mose 28,10', en: 'Gen 28:10' }, text: { de: 'Er flieht vor seinem Bruder Esau, den er um das Erstgeburtsrecht betrogen hat.', en: 'He flees from his brother Esau, whom he cheated of the birthright.' } },
      { de: 'Bethel', en: 'Bethel', lat: 31.923, lon: 35.241, placeId: 'a64f355', ref: { de: '1. Mose 28,10-22', en: 'Gen 28:10-22' }, text: { de: 'Ein Stein als Kopfkissen, die Treppe bis in den Himmel: „Fürwahr, der HERR ist an diesem Ort, und ich wusste es nicht.“', en: 'A stone for a pillow, the stairway to heaven: "Surely the LORD is in this place, and I did not know it."' } },
      { de: 'Haran', en: 'Haran', lat: 36.864, lon: 39.033, placeId: 'a6d9af3', ref: { de: '1. Mose 29-31', en: 'Gen 29-31' }, text: { de: 'Zwanzig Jahre bei Laban: sieben Jahre um Rahel, dann noch einmal sieben – und der Betrüger wird selbst betrogen.', en: 'Twenty years with Laban: seven years for Rachel, then seven more – and the deceiver is himself deceived.' } },
      { de: 'Gilead', en: 'Gilead', lat: 32.187, lon: 35.692, placeId: 'ae73b90', ref: { de: '1. Mose 31,21-55', en: 'Gen 31:21-55' }, text: { de: 'Laban holt die heimlich abgezogene Familie ein; sie schichten einen Steinhaufen als Grenze auf.', en: 'Laban overtakes the family that slipped away; they pile up stones as a boundary.' } },
      { de: 'Mahanajim', en: 'Mahanaim', lat: 32.186, lon: 35.687, placeId: 'ae5bfe9', ref: { de: '1. Mose 32,2-3', en: 'Gen 32:1-2' }, text: { de: '„Das ist Gottes Heerlager“ – und zugleich die Nachricht: Esau kommt mit 400 Mann.', en: '"This is God’s camp" – and at the same time the news: Esau is coming with 400 men.' } },
      { de: 'Pnuël am Jabbok', en: 'Peniel at the Jabbok', lat: 32.187, lon: 35.692, placeId: 'a8a9ff9', ref: { de: '1. Mose 32,23-32', en: 'Gen 32:22-32' }, text: { de: 'Der Kampf am Fluss bis zur Morgenröte. Jakob geht hinkend weiter – und heißt von nun an Israel.', en: 'The wrestling by the river until daybreak. Jacob walks on limping – and is called Israel from now on.' } },
      { de: 'Sukkot', en: 'Succoth', lat: 32.197, lon: 35.621, placeId: 'a0905b5', ref: { de: '1. Mose 33,17', en: 'Gen 33:17' }, text: { de: 'Nach der Versöhnung mit Esau baut er ein Haus und Hütten für das Vieh.', en: 'After being reconciled with Esau he builds a house and booths for the livestock.' } },
      { de: 'Sichem', en: 'Shechem', lat: 32.214, lon: 35.282, placeId: 'adf74d4', ref: { de: '1. Mose 33,18-34,31', en: 'Gen 33:18-34:31' }, text: { de: 'Er kauft ein Stück Feld – und die Geschichte um Dina endet in Blut.', en: 'He buys a plot of land – and the story of Dinah ends in bloodshed.' } },
      { de: 'Bethel (zurück)', en: 'Bethel (again)', lat: 31.923, lon: 35.241, placeId: 'a64f355', ref: { de: '1. Mose 35,1-15', en: 'Gen 35:1-15' }, text: { de: 'Zurück an den Ort der Leiter: die fremden Götter werden vergraben, der Bund erneuert.', en: 'Back at the place of the stairway: the foreign gods are buried, the covenant renewed.' } },
      { de: 'Efrata / Bethlehem', en: 'Ephrath / Bethlehem', lat: 31.704, lon: 35.208, placeId: 'a112427', ref: { de: '1. Mose 35,16-20', en: 'Gen 35:16-20' }, text: { de: 'Rahel stirbt bei der Geburt Benjamins; Jakob setzt einen Stein auf ihr Grab.', en: 'Rachel dies giving birth to Benjamin; Jacob sets a stone on her grave.' } },
      { de: 'Hebron', en: 'Hebron', lat: 31.525, lon: 35.102, placeId: 'a85151a', ref: { de: '1. Mose 35,27-29', en: 'Gen 35:27-29' }, text: { de: 'Bei Isaak angekommen – der Kreis der Väter schließt sich.', en: 'Arriving at Isaac’s home – the circle of the fathers closes.' } },
    ],
  },
  {
    id: 'joseph',
    de: 'Josef: verkauft nach Ägypten',
    en: 'Joseph: sold into Egypt',
    era: 'patriarchs',
    when: { de: '~1880 v. Chr.', en: 'c. 1880 BC' },
    passage: { de: '1. Mose 37-47', en: 'Genesis 37-47' },
    lead: {
      de: 'Ein Weg, den keiner freiwillig geht: vom Vaterhaus über eine Zisterne und ein Gefängnis an den zweitmächtigsten Platz Ägyptens.',
      en: 'A road nobody takes willingly: from home via a cistern and a prison to the second seat of power in Egypt.',
    },
    stops: [
      { de: 'Tal von Hebron', en: 'Valley of Hebron', lat: 31.525, lon: 35.102, placeId: 'a85151a', ref: { de: '1. Mose 37,12-14', en: 'Gen 37:12-14' }, text: { de: 'Jakob schickt den Lieblingssohn mit dem bunten Rock zu den Brüdern.', en: 'Jacob sends the favourite son in the ornate robe out to his brothers.' } },
      { de: 'Sichem', en: 'Shechem', lat: 32.214, lon: 35.282, placeId: 'adf74d4', ref: { de: '1. Mose 37,14-17', en: 'Gen 37:14-17' }, text: { de: 'Dort sind sie nicht mehr; ein Mann auf dem Feld schickt ihn weiter nach Dotan.', en: 'They are no longer there; a man in the field sends him on to Dothan.' } },
      { de: 'Dotan', en: 'Dothan', lat: 32.414, lon: 35.240, placeId: 'ab635e4', ref: { de: '1. Mose 37,18-28', en: 'Gen 37:18-28' }, text: { de: 'Die Zisterne, dann die Karawane: für zwanzig Silberstücke geht Josef nach Ägypten.', en: 'The cistern, then the caravan: for twenty pieces of silver Joseph goes to Egypt.' } },
      { de: 'Ägypten: Potifars Haus', en: 'Egypt: Potiphar’s house', lat: 30.129, lon: 31.308, placeId: 'af301ca', ref: { de: '1. Mose 39-41', en: 'Gen 39-41' }, text: { de: 'Sklave, Verwalter, Gefangener, Traumdeuter – und schließlich der Mann, der die Vorräte des Reiches verwaltet.', en: 'Slave, steward, prisoner, dream-reader – and finally the man who runs the empire’s granaries.' } },
      { de: 'Beerscheba', en: 'Beersheba', lat: 31.245, lon: 34.841, placeId: 'ad2f6c2', ref: { de: '1. Mose 46,1-7', en: 'Gen 46:1-7' }, text: { de: 'Jahre später zieht der alte Jakob mit dem ganzen Haus los; am Grenzort bekommt er die Zusage, mitzugehen.', en: 'Years later old Jacob sets out with his whole household; at the border he is promised God will go with him.' } },
      { de: 'Goschen', en: 'Goshen', lat: 30.799, lon: 31.834, placeId: 'a60f092', ref: { de: '1. Mose 46,28-47,12', en: 'Gen 46:28-47:12' }, text: { de: 'Vater und Sohn fallen sich nach 22 Jahren um den Hals. Israel wird in Ägypten ein Volk – und später ein Sklavenvolk.', en: 'Father and son embrace after 22 years. In Egypt Israel becomes a people – and later a nation of slaves.' } },
    ],
  },
  {
    id: 'exodus',
    de: 'Der Auszug: von Ägypten zum Sinai',
    en: 'The Exodus: from Egypt to Sinai',
    era: 'exodus',
    when: { de: '~1446 v. Chr.', en: 'c. 1446 BC' },
    passage: { de: '2. Mose 12-19', en: 'Exodus 12-19' },
    lead: {
      de: 'In einer Nacht bricht ein Sklavenvolk auf. Sieben Wochen später steht es an einem Berg und bekommt ein Gesetz – aus Fliehenden wird ein Volk.',
      en: 'In one night a nation of slaves walks out. Seven weeks later it stands at a mountain and receives a law – fugitives become a people.',
    },
    stops: [
      { de: 'Ramses', en: 'Rameses', lat: 30.799, lon: 31.834, placeId: 'a079b21', ref: { de: '2. Mose 12,29-42', en: 'Exod 12:29-42' }, text: { de: 'Nach der Passanacht ziehen sie los – „an eben diesem Tag“, mit ungesäuertem Teig auf den Schultern.', en: 'After the Passover night they leave – "on that very day", with unleavened dough on their shoulders.' } },
      { de: 'Sukkot', en: 'Succoth', lat: 30.553, lon: 32.099, placeId: 'aa28709', ref: { de: '2. Mose 12,37; 13,20', en: 'Exod 12:37; 13:20' }, text: { de: 'Erste Lagerstelle. Die Wolken- und Feuersäule zeigt den Weg.', en: 'The first camp. The pillar of cloud and fire shows the way.' } },
      { de: 'Etam am Wüstenrand', en: 'Etham on the desert edge', lat: 30.547, lon: 31.964, placeId: 'a27d0e0', ref: { de: '2. Mose 13,20', en: 'Exod 13:20' }, text: { de: 'Nicht der kurze Weg an der Küste entlang – Gott führt sie den Umweg durch die Wüste.', en: 'Not the short coastal road – God leads them the long way round through the desert.' } },
      { de: 'Pi-Hahirot', en: 'Pi-hahiroth', lat: 30.225, lon: 32.470, placeId: 'ababfd2', ref: { de: '2. Mose 14,1-14', en: 'Exod 14:1-14' }, text: { de: 'Zwischen Wasser und Wüste eingekesselt, hinter sich die Streitwagen: „Der HERR wird für euch streiten.“', en: 'Trapped between water and desert, chariots behind them: "The LORD will fight for you."' } },
      { de: 'Schilfmeer', en: 'The Red Sea', lat: 28.750, lon: 33.000, placeId: 'a3d18b2', ref: { de: '2. Mose 14,15-15,21', en: 'Exod 14:15-15:21' }, text: { de: 'Das Meer teilt sich, das Heer versinkt. Am anderen Ufer singt Mirjam mit der Pauke.', en: 'The sea parts, the army sinks. On the far shore Miriam sings with a tambourine.' } },
      { de: 'Mara', en: 'Marah', lat: 30.338, lon: 32.378, placeId: 'ad3970d', ref: { de: '2. Mose 15,22-27', en: 'Exod 15:22-27' }, text: { de: 'Drei Tage ohne Wasser, dann bitteres Wasser – das erste Murren, keine drei Tage nach dem Wunder.', en: 'Three days without water, then bitter water – the first grumbling, not three days after the miracle.' } },
      { de: 'Elim', en: 'Elim', lat: 29.255, lon: 32.916, placeId: 'a2410c1', ref: { de: '2. Mose 15,27', en: 'Exod 15:27' }, text: { de: 'Zwölf Quellen und siebzig Palmen: eine Oase zum Durchatmen.', en: 'Twelve springs and seventy palms: an oasis to breathe.' } },
      { de: 'Wüste Sin', en: 'Wilderness of Sin', lat: 29.148, lon: 33.537, placeId: 'a0f54e4', ref: { de: '2. Mose 16', en: 'Exod 16' }, text: { de: 'Hunger und Heimweh nach den Fleischtöpfen – am Morgen liegt Manna auf dem Boden.', en: 'Hunger and homesickness for the meat pots – in the morning manna lies on the ground.' } },
      { de: 'Refidim', en: 'Rephidim', lat: 28.623, lon: 33.880, placeId: 'a05ebb7', ref: { de: '2. Mose 17', en: 'Exod 17' }, text: { de: 'Wasser aus dem Felsen, dazu der Kampf gegen Amalek – und Moses Hände, die gestützt werden müssen.', en: 'Water from the rock, and the battle with Amalek – with Moses’ hands needing to be held up.' } },
      { de: 'Berg Sinai', en: 'Mount Sinai', lat: 28.540, lon: 33.973, placeId: 'abfba2a', ref: { de: '2. Mose 19-20', en: 'Exod 19-20' }, text: { de: 'Donner, Rauch, Posaunenschall – und zehn Sätze, die drei Weltreligionen prägen werden.', en: 'Thunder, smoke, trumpet blast – and ten sentences that will shape three world religions.' } },
    ],
  },
  {
    id: 'wilderness',
    de: 'Vierzig Jahre Wüste',
    en: 'Forty years in the wilderness',
    era: 'exodus',
    when: { de: '~1446-1406 v. Chr.', en: 'c. 1446-1406 BC' },
    passage: { de: '4. Mose 10-36', en: 'Numbers 10-36' },
    lead: {
      de: 'Vom Sinai bis an den Jordan wären es elf Tagesreisen. Es werden vierzig Jahre – die Zeit, die eine Generation braucht, um das Sklavendenken abzulegen.',
      en: 'From Sinai to the Jordan is eleven days’ walk. It takes forty years – the time one generation needs to unlearn slavery.',
    },
    stops: [
      { de: 'Berg Sinai', en: 'Mount Sinai', lat: 28.540, lon: 33.973, placeId: 'abfba2a', ref: { de: '4. Mose 10,11-13', en: 'Num 10:11-13' }, text: { de: 'Nach knapp einem Jahr am Berg hebt sich die Wolke – das Lager bricht auf.', en: 'After nearly a year at the mountain the cloud lifts – the camp moves out.' } },
      { de: 'Wüste Paran', en: 'Wilderness of Paran', lat: 30.303, lon: 34.777, placeId: 'aa6b19b', ref: { de: '4. Mose 10,12; 11', en: 'Num 10:12; 11' }, text: { de: 'Wachteln, Aufruhr, siebzig Älteste: das Volk lernt mühsam, geführt zu werden.', en: 'Quail, revolt, seventy elders: the people learn the hard way to be led.' } },
      { de: 'Kadesch-Barnea', en: 'Kadesh-barnea', lat: 30.648, lon: 34.422, placeId: 'ac2cef0', ref: { de: '4. Mose 13-14', en: 'Num 13-14' }, text: { de: 'Zwölf Kundschafter, zehn schlechte Berichte – und die Kehrtwende, die vierzig Jahre kostet.', en: 'Twelve spies, ten bad reports – and the U-turn that costs forty years.' } },
      { de: 'Ezjon-Geber', en: 'Ezion-geber', lat: 29.463, lon: 34.860, placeId: 'a8e53d5', ref: { de: '4. Mose 33,35-36', en: 'Num 33:35-36' }, text: { de: 'Am Nordzipfel des Roten Meeres – der weite Bogen um Edom herum beginnt.', en: 'At the head of the Red Sea – the long detour around Edom begins.' } },
      { de: 'Punon', en: 'Punon', lat: 30.628, lon: 35.494, placeId: 'a9ecc26', ref: { de: '4. Mose 21,4-9', en: 'Num 21:4-9' }, text: { de: 'Schlangen im Lager, die eherne Schlange an der Stange – ein Bild, das bis in Johannes 3 nachhallt.', en: 'Snakes in the camp, the bronze serpent on a pole – an image echoing into John 3.' } },
      { de: 'Oboth', en: 'Oboth', lat: 30.617, lon: 35.190, placeId: 'a0ef1e1', ref: { de: '4. Mose 21,10-11', en: 'Num 21:10-11' }, text: { de: 'Weiter am Rand der edomitischen Berge entlang nach Norden.', en: 'Onward north along the edge of the Edomite hills.' } },
      { de: 'Arnon', en: 'The Arnon', lat: 31.466, lon: 35.573, placeId: 'a4cc324', ref: { de: '4. Mose 21,13-20', en: 'Num 21:13-20' }, text: { de: 'Die Grenze zu Moab; am Brunnen singt Israel ein Lied.', en: 'The border of Moab; at the well Israel sings a song.' } },
      { de: 'Hesbon', en: 'Heshbon', lat: 31.801, lon: 35.809, placeId: 'abf2fc1', ref: { de: '4. Mose 21,21-31', en: 'Num 21:21-31' }, text: { de: 'Sihon verweigert den Durchzug – das erste eroberte Land liegt östlich des Jordans.', en: 'Sihon refuses passage – the first land taken lies east of the Jordan.' } },
      { de: 'Sittim in Moab', en: 'Shittim in Moab', lat: 31.840, lon: 35.674, placeId: 'af64fb3', ref: { de: '4. Mose 22-25', en: 'Num 22-25' }, text: { de: 'Bileams Segen statt Fluch – und zugleich der Abfall zum Baal-Peor.', en: 'Balaam’s blessing instead of a curse – and at the same time the apostasy at Baal-Peor.' } },
      { de: 'Pisga / Nebo', en: 'Pisgah / Nebo', lat: 31.754, lon: 35.715, placeId: 'afd9259', ref: { de: '5. Mose 34', en: 'Deut 34' }, text: { de: 'Mose sieht das Land von oben, betreten darf er es nicht. Er stirbt, und niemand kennt sein Grab.', en: 'Moses sees the land from above but may not enter. He dies, and no one knows his grave.' } },
    ],
  },
  {
    id: 'conquest',
    de: 'Landnahme: Jordan, Jericho, Gibeon',
    en: 'Conquest: Jordan, Jericho, Gibeon',
    era: 'conquest',
    when: { de: '~1406 v. Chr.', en: 'c. 1406 BC' },
    passage: { de: 'Josua 1-24', en: 'Joshua 1-24' },
    lead: {
      de: 'Josua führt das Volk über den Jordan. Die Feldzüge lesen sich hart – dazwischen stehen eine Hure, die glaubt, und ein Volk, das sich verstellt, um zu überleben.',
      en: 'Joshua leads the people across the Jordan. The campaigns read hard – between them stand a prostitute who believes and a people who bluff to survive.',
    },
    stops: [
      { de: 'Sittim', en: 'Shittim', lat: 31.840, lon: 35.674, placeId: 'af64fb3', ref: { de: 'Josua 2', en: 'Josh 2' }, text: { de: 'Zwei Kundschafter gehen nach Jericho – und werden von Rahab unter Flachsstängeln versteckt.', en: 'Two spies go to Jericho – and Rahab hides them under stalks of flax.' } },
      { de: 'Der Jordan', en: 'The Jordan', lat: 31.761, lon: 35.558, placeId: 'ae686c9', ref: { de: 'Josua 3-4', en: 'Josh 3-4' }, text: { de: 'Die Priester stehen mit der Lade im Flussbett, das Wasser staut sich. Zwölf Steine bleiben als Denkmal.', en: 'The priests stand with the ark in the riverbed, the water piles up. Twelve stones remain as a memorial.' } },
      { de: 'Gilgal', en: 'Gilgal', lat: 31.882, lon: 35.460, placeId: 'ab94aea', ref: { de: 'Josua 5', en: 'Josh 5' }, text: { de: 'Erstes Lager im Land: Beschneidung, Passa – und am Tag darauf hört das Manna auf.', en: 'The first camp in the land: circumcision, Passover – and the next day the manna stops.' } },
      { de: 'Jericho', en: 'Jericho', lat: 31.872, lon: 35.445, placeId: 'a231f80', ref: { de: 'Josua 6', en: 'Josh 6' }, text: { de: 'Sechs Tage schweigend um die Stadt, am siebten siebenmal – dann der Schrei und die Mauern.', en: 'Six days round the city in silence, seven times on the seventh – then the shout and the walls.' } },
      { de: 'Ai', en: 'Ai', lat: 31.917, lon: 35.261, placeId: 'a7e13e1', ref: { de: 'Josua 7-8', en: 'Josh 7-8' }, text: { de: 'Die erste Niederlage: der gestohlene Mantel Achans. Beim zweiten Anlauf fällt die Stadt.', en: 'The first defeat: Achan’s stolen cloak. On the second attempt the city falls.' } },
      { de: 'Gibeon', en: 'Gibeon', lat: 31.847, lon: 35.183, placeId: 'aede336', ref: { de: 'Josua 9-10', en: 'Josh 9-10' }, text: { de: 'Mit schimmeligem Brot und geflickten Schuhen erschleichen sich die Gibeoniter einen Bund – und Israel hält ihn.', en: 'With mouldy bread and patched sandals the Gibeonites trick their way into a treaty – and Israel keeps it.' } },
      { de: 'Makkeda', en: 'Makkedah', lat: 31.535, lon: 34.967, placeId: 'abf8e4e', ref: { de: 'Josua 10,16-27', en: 'Josh 10:16-27' }, text: { de: 'Der Feldzug im Süden endet vor einer Höhle, in der sich fünf Könige verstecken.', en: 'The southern campaign ends at a cave where five kings are hiding.' } },
      { de: 'Hazor', en: 'Hazor', lat: 33.018, lon: 35.569, placeId: 'a6f33c5', ref: { de: 'Josua 11', en: 'Josh 11' }, text: { de: 'Im Norden die größte Stadt der Gegend – sie brennt als einzige nieder.', en: 'In the north, the region’s greatest city – the only one burned to the ground.' } },
      { de: 'Sichem', en: 'Shechem', lat: 32.214, lon: 35.282, placeId: 'adf74d4', ref: { de: 'Josua 24', en: 'Josh 24' }, text: { de: 'Am Ende die Wahl: „Ich aber und mein Haus wollen dem HERRN dienen.“', en: 'At the end, the choice: "As for me and my house, we will serve the LORD."' } },
    ],
  },
  {
    id: 'david',
    de: 'David auf der Flucht',
    en: 'David on the run',
    era: 'united',
    when: { de: '~1015 v. Chr.', en: 'c. 1015 BC' },
    passage: { de: '1. Samuel 19-27', en: '1 Samuel 19-27' },
    lead: {
      de: 'Der gesalbte König lebt jahrelang in Höhlen und bei den Feinden seines Volkes – und verschont zweimal den Mann, der ihn jagt.',
      en: 'The anointed king spends years in caves and among his people’s enemies – and twice spares the man hunting him.',
    },
    stops: [
      { de: 'Rama', en: 'Ramah', lat: 31.854, lon: 35.232, placeId: 'a6d57ed', ref: { de: '1. Samuel 19,18-24', en: '1 Sam 19:18-24' }, text: { de: 'Erste Zuflucht bei Samuel, dem Propheten, der ihn als Jungen gesalbt hat.', en: 'First refuge with Samuel, the prophet who anointed him as a boy.' } },
      { de: 'Nob', en: 'Nob', lat: 31.793, lon: 35.244, placeId: 'afdda14', ref: { de: '1. Samuel 21,1-9', en: '1 Sam 21:1-9' }, text: { de: 'Beim Priester bekommt er die Schaubrote und Goliats Schwert – und bringt damit eine ganze Priesterstadt in Gefahr.', en: 'From the priest he takes the holy bread and Goliath’s sword – and puts a whole priestly town in danger.' } },
      { de: 'Gat', en: 'Gath', lat: 31.700, lon: 34.847, placeId: 'a18873f', ref: { de: '1. Samuel 21,10-15', en: '1 Sam 21:10-15' }, text: { de: 'Ausgerechnet bei den Philistern – er entkommt, indem er sich wahnsinnig stellt.', en: 'Of all places, among the Philistines – he escapes by feigning madness.' } },
      { de: 'Höhle Adullam', en: 'The cave of Adullam', lat: 31.652, lon: 35.002, placeId: 'af82614', ref: { de: '1. Samuel 22,1-2', en: '1 Sam 22:1-2' }, text: { de: 'Vierhundert Verschuldete und Verbitterte sammeln sich um ihn – aus ihnen werden Davids Helden.', en: 'Four hundred debtors and discontents gather to him – they become David’s mighty men.' } },
      { de: 'Kegila', en: 'Keilah', lat: 31.614, lon: 35.004, placeId: 'ad9df93', ref: { de: '1. Samuel 23,1-13', en: '1 Sam 23:1-13' }, text: { de: 'Er befreit die Stadt von den Philistern – und die Geretteten würden ihn ausliefern.', en: 'He frees the town from the Philistines – and the rescued would hand him over.' } },
      { de: 'Wüste Sif', en: 'Wilderness of Ziph', lat: 31.475, lon: 35.135, placeId: 'a9b852f', ref: { de: '1. Samuel 23,14-29', en: '1 Sam 23:14-29' }, text: { de: 'Verrat durch die Sifiter; Jonatan kommt heimlich und „stärkte seine Hand in Gott“.', en: 'Betrayed by the Ziphites; Jonathan comes secretly and "strengthened his hand in God".' } },
      { de: 'Engedi', en: 'En-gedi', lat: 31.450, lon: 35.383, placeId: 'a51df0e', ref: { de: '1. Samuel 24', en: '1 Sam 24' }, text: { de: 'In der Höhle schneidet David nur einen Zipfel vom Mantel ab – und ruft es Saul hinterher.', en: 'In the cave David cuts off only a corner of the robe – and calls after Saul.' } },
      { de: 'Karmel in Juda', en: 'Carmel in Judah', lat: 31.423, lon: 35.133, placeId: 'a053f15', ref: { de: '1. Samuel 25', en: '1 Sam 25' }, text: { de: 'Nabal weigert sich, Abigajil kommt ihm mit Eseln voller Brot zuvor – und verhindert ein Blutbad.', en: 'Nabal refuses; Abigail rides out with donkeys of bread – and prevents a massacre.' } },
      { de: 'Ziklag', en: 'Ziklag', lat: 31.391, lon: 34.682, placeId: 'a0ed7ff', ref: { de: '1. Samuel 27; 30', en: '1 Sam 27; 30' }, text: { de: 'Sechzehn Monate im Philisterland. Als er heimkommt, ist Ziklag verbrannt – er holt alles zurück.', en: 'Sixteen months in Philistine territory. He comes home to a burned Ziklag – and recovers everything.' } },
    ],
  },
  {
    id: 'elijah',
    de: 'Elia: vom Karmel zum Horeb',
    en: 'Elijah: from Carmel to Horeb',
    era: 'divided',
    when: { de: '~860 v. Chr.', en: 'c. 860 BC' },
    passage: { de: '1. Könige 17-19', en: '1 Kings 17-19' },
    lead: {
      de: 'Der Prophet gewinnt das größte Gottesduell der Bibel – und läuft am Tag darauf um sein Leben, bis er sich den Tod wünscht.',
      en: 'The prophet wins the greatest showdown in the Bible – and the next day runs for his life until he asks to die.',
    },
    stops: [
      { de: 'Tischbe in Gilead', en: 'Tishbe in Gilead', lat: 33.029, lon: 35.540, placeId: 'a4199a1', ref: { de: '1. Könige 17,1', en: '1 Kgs 17:1' }, text: { de: 'Aus dem Nichts steht er vor Ahab: „Es soll diese Jahre weder Tau noch Regen fallen.“', en: 'Out of nowhere he stands before Ahab: "There shall be neither dew nor rain these years."' } },
      { de: 'Bach Krit', en: 'The brook Cherith', lat: 32.395, lon: 35.591, placeId: 'aa7bee8', ref: { de: '1. Könige 17,2-7', en: '1 Kgs 17:2-7' }, text: { de: 'Versteck am Bach, Raben bringen Brot und Fleisch – bis der Bach vertrocknet.', en: 'Hidden by the brook, ravens bring bread and meat – until the brook dries up.' } },
      { de: 'Zarpath', en: 'Zarephath', lat: 33.464, lon: 35.295, placeId: 'a6fa2d3', ref: { de: '1. Könige 17,8-24', en: '1 Kgs 17:8-24' }, text: { de: 'Ausgerechnet im Land Isebels: eine Witwe teilt ihr letztes Mehl – Krug und Topf gehen nicht aus.', en: 'Of all places, in Jezebel’s homeland: a widow shares her last flour – jar and jug never run dry.' } },
      { de: 'Karmel', en: 'Mount Carmel', lat: 32.672, lon: 35.023, placeId: 'a3e21c6', ref: { de: '1. Könige 18,16-46', en: '1 Kgs 18:16-46' }, text: { de: '450 Baalspropheten gegen einen. Das Feuer fällt, dann steigt eine Wolke „so groß wie eines Mannes Hand“ auf.', en: '450 prophets of Baal against one. Fire falls, then a cloud "as small as a man’s hand" rises.' } },
      { de: 'Jesreel', en: 'Jezreel', lat: 32.558, lon: 35.328, placeId: 'ae0bf4a', ref: { de: '1. Könige 18,45-19,3', en: '1 Kgs 18:45-19:3' }, text: { de: 'Er läuft dem Wagen des Königs voraus – und flieht noch in derselben Nacht vor Isebels Drohung.', en: 'He outruns the king’s chariot – and that same night flees Jezebel’s threat.' } },
      { de: 'Beerscheba', en: 'Beersheba', lat: 31.245, lon: 34.841, placeId: 'ad2f6c2', ref: { de: '1. Könige 19,3-8', en: '1 Kgs 19:3-8' }, text: { de: 'Unter dem Ginster: „Es ist genug, nimm meine Seele.“ Ein Engel weckt ihn und lässt ihn erst einmal essen und schlafen.', en: 'Under the broom tree: "It is enough; take my life." An angel wakes him and first lets him eat and sleep.' } },
      { de: 'Horeb', en: 'Horeb', lat: 28.540, lon: 33.973, placeId: 'abfba2a', ref: { de: '1. Könige 19,9-18', en: '1 Kgs 19:9-18' }, text: { de: 'Vierzig Tage zum Gottesberg. Sturm, Erdbeben, Feuer – Gott ist in keinem davon, sondern im „stillen, sanften Sausen“.', en: 'Forty days to the mountain of God. Wind, earthquake, fire – God is in none of them, but in the "gentle whisper".' } },
      { de: 'Abel-Mehola', en: 'Abel-meholah', lat: 32.374, lon: 35.561, placeId: 'a5a1bdd', ref: { de: '1. Könige 19,19-21', en: '1 Kgs 19:19-21' }, text: { de: 'Zurück mit einem Auftrag: Elisa hinter dem Pflug bekommt den Mantel umgeworfen.', en: 'Back with an assignment: Elisha behind the plough has the mantle thrown over him.' } },
    ],
  },
  {
    id: 'jonah',
    de: 'Jona: in die falsche Richtung',
    en: 'Jonah: the wrong way',
    era: 'divided',
    when: { de: '~780 v. Chr.', en: 'c. 780 BC' },
    passage: { de: 'Jona 1-4', en: 'Jonah 1-4' },
    lead: {
      de: 'Die einzige Reise der Bibel, die genau entgegengesetzt zum Auftrag beginnt – und trotzdem am Ziel ankommt.',
      en: 'The one journey in the Bible that starts in exactly the opposite direction to its orders – and still arrives.',
    },
    stops: [
      { de: 'Gat-Hefer / Der Auftrag', en: 'Gath-hepher / the call', lat: 32.702, lon: 35.298, placeId: 'af5884f', ref: { de: 'Jona 1,1-2', en: 'Jonah 1:1-2' }, text: { de: '„Mach dich auf und geh nach Ninive“ – in die Hauptstadt der Großmacht, die Israel bedroht.', en: '"Arise, go to Nineveh" – to the capital of the empire threatening Israel.' } },
      { de: 'Joppe', en: 'Joppa', lat: 32.054, lon: 34.753, placeId: 'ae023a9', ref: { de: 'Jona 1,3', en: 'Jonah 1:3' }, text: { de: 'Im Hafen findet er ein Schiff – und bezahlt für die Fahrt in die Gegenrichtung.', en: 'At the harbour he finds a ship – and pays the fare in the opposite direction.' } },
      { de: 'Nach Tarsis', en: 'Toward Tarshish', lat: 36.500, lon: 25.000, sea: true, ref: { de: 'Jona 1,4-16', en: 'Jonah 1:4-16' }, text: { de: 'Sturm auf dem Mittelmeer; der Prophet schläft unter Deck, bis die heidnischen Seeleute beten.', en: 'A storm on the Mediterranean; the prophet sleeps below deck until the pagan sailors pray.' } },
      { de: 'Im Bauch des Fisches', en: 'In the belly of the fish', lat: 34.000, lon: 32.500, sea: true, ref: { de: 'Jona 2', en: 'Jonah 2' }, text: { de: 'Drei Tage im Dunkeln – ein Psalm aus der Tiefe, den Jesus später auf sich selbst bezieht.', en: 'Three days in the dark – a psalm from the depths that Jesus later applies to himself.' } },
      { de: 'Ninive', en: 'Nineveh', lat: 36.359, lon: 43.153, placeId: 'a70fd5d', ref: { de: 'Jona 3', en: 'Jonah 3' }, text: { de: 'Fünf Worte Predigt, und die ganze Stadt kehrt um – bis hinauf zum König und hinunter zum Vieh.', en: 'A five-word sermon, and the whole city repents – up to the king and down to the cattle.' } },
      { de: 'Östlich der Stadt', en: 'East of the city', lat: 36.359, lon: 43.400, ref: { de: 'Jona 4', en: 'Jonah 4' }, text: { de: 'Jona ärgert sich über die Gnade, unter einer Rizinusstaude. Das Buch endet mit einer Frage an ihn – und an uns.', en: 'Jonah sulks over the mercy, under a plant. The book ends with a question to him – and to us.' } },
    ],
  },
  {
    id: 'exile',
    de: 'Ins Exil nach Babylon',
    en: 'Into exile in Babylon',
    era: 'exile',
    when: { de: '586 v. Chr.', en: '586 BC' },
    passage: { de: '2. Könige 25; Jeremia 39-43', en: '2 Kings 25; Jeremiah 39-43' },
    lead: {
      de: 'Der Weg, den niemand gehen wollte: von der brennenden Stadt in Ketten nach Osten – und für eine kleine Gruppe stattdessen nach Ägypten.',
      en: 'The road nobody wanted: from the burning city eastward in chains – and, for a small group, to Egypt instead.',
    },
    stops: [
      { de: 'Jerusalem', en: 'Jerusalem', lat: 31.777, lon: 35.234, placeId: 'a15257a', ref: { de: '2. Könige 25,1-10', en: '2 Kgs 25:1-10' }, text: { de: 'Achtzehn Monate Belagerung, dann Bresche, Brand, Tempel. Was bleibt, sind Trümmer und die Klagelieder.', en: 'Eighteen months of siege, then the breach, the fire, the temple. What remains is rubble and Lamentations.' } },
      { de: 'Ribla', en: 'Riblah', lat: 34.460, lon: 36.573, placeId: 'ab2bde8', ref: { de: '2. Könige 25,6-7', en: '2 Kgs 25:6-7' }, text: { de: 'Im Hauptquartier Nebukadnezars wird König Zedekia das Urteil gesprochen – das Letzte, was er sieht.', en: 'At Nebuchadnezzar’s headquarters King Zedekiah is sentenced – the last thing he ever sees.' } },
      { de: 'Mizpa', en: 'Mizpah', lat: 31.885, lon: 35.216, placeId: 'a736f6c', ref: { de: '2. Könige 25,22-26; Jeremia 40-41', en: '2 Kgs 25:22-26; Jer 40-41' }, text: { de: 'Der zurückgelassene Rest bekommt einen Statthalter – bis er ermordet wird und die Angst umgeht.', en: 'The remnant left behind gets a governor – until he is murdered and fear takes over.' } },
      { de: 'Tachpanhes in Ägypten', en: 'Tahpanhes in Egypt', lat: 30.861, lon: 32.171, placeId: 'adb008c', ref: { de: 'Jeremia 43', en: 'Jer 43' }, text: { de: 'Gegen Jeremias Wort flieht die Gruppe nach Ägypten – und nimmt den Propheten mit.', en: 'Against Jeremiah’s word the group flees to Egypt – taking the prophet along.' } },
      { de: 'Am Fluss Kebar', en: 'By the river Chebar', lat: 32.543, lon: 44.422, placeId: 'a217d18', ref: { de: 'Hesekiel 1,1-3; Psalm 137', en: 'Ezek 1:1-3; Ps 137' }, text: { de: 'In Babylonien sitzen die Verschleppten an den Wassern und weinen – und mitten darin sieht Hesekiel den Thronwagen Gottes.', en: 'In Babylonia the exiles sit by the waters and weep – and in the middle of it Ezekiel sees the chariot-throne of God.' } },
      { de: 'Babylon', en: 'Babylon', lat: 32.543, lon: 44.422, placeId: 'a217d18', ref: { de: 'Daniel 1; Jeremia 29', en: 'Dan 1; Jer 29' }, text: { de: 'Junge Judäer werden am Hof ausgebildet. Jeremias Brief sagt ihnen: Baut Häuser, pflanzt Gärten, sucht der Stadt Bestes.', en: 'Young Judeans are trained at court. Jeremiah’s letter tells them: build houses, plant gardens, seek the welfare of the city.' } },
    ],
  },
  {
    id: 'return',
    de: 'Rückkehr aus dem Exil',
    en: 'Return from exile',
    era: 'return',
    when: { de: '538-445 v. Chr.', en: '538-445 BC' },
    passage: { de: 'Esra 1-8; Nehemia 1-2', en: 'Ezra 1-8; Nehemiah 1-2' },
    lead: {
      de: 'Drei Aufbrüche über siebzig Jahre: erst die Heimkehrer mit dem Tempelgerät, dann Esra mit der Schriftrolle, dann Nehemia mit einem Bauplan.',
      en: 'Three departures over seventy years: first the returnees with the temple vessels, then Ezra with the scroll, then Nehemiah with a building plan.',
    },
    stops: [
      { de: 'Babylon', en: 'Babylon', lat: 32.543, lon: 44.422, placeId: 'a217d18', ref: { de: 'Esra 1', en: 'Ezra 1' }, text: { de: 'Der Perserkönig Kyrus gibt die Heimkehr frei und die Tempelgeräte zurück.', en: 'Cyrus the Persian permits the return and gives back the temple vessels.' } },
      { de: 'Fluss Ahava', en: 'The river Ahava', lat: 33.644, lon: 42.823, placeId: 'a6c3859', ref: { de: 'Esra 8,15-36', en: 'Ezra 8:15-36' }, text: { de: 'Esras Sammelplatz: drei Tage Fasten statt einer Eskorte – mit Silber und Gold für den Tempel im Gepäck.', en: 'Ezra’s staging point: three days of fasting instead of an escort – carrying silver and gold for the temple.' } },
      { de: 'Susa', en: 'Susa', lat: 32.189, lon: 48.258, placeId: 'a033b84', ref: { de: 'Nehemia 1-2', en: 'Neh 1-2' }, text: { de: 'Am Hof erfährt der Mundschenk Nehemia von den zerbrochenen Mauern – und bittet den König um Urlaub und Bauholz.', en: 'At court the cupbearer Nehemiah hears of the broken walls – and asks the king for leave and timber.' } },
      { de: 'Jerusalem', en: 'Jerusalem', lat: 31.777, lon: 35.234, placeId: 'a15257a', ref: { de: 'Esra 3; Nehemia 2-6; 8', en: 'Ezra 3; Neh 2-6; 8' }, text: { de: 'Der zweite Tempel steht, 52 Tage später auch die Mauer. Beim Vorlesen des Gesetzes weint das ganze Volk.', en: 'The second temple stands, and 52 days later the wall. As the law is read aloud, the whole people weeps.' } },
    ],
  },
  {
    id: 'nativity',
    de: 'Die Flucht nach Ägypten',
    en: 'The flight to Egypt',
    era: 'gospels',
    when: { de: '~6-4 v. Chr.', en: 'c. 6-4 BC' },
    passage: { de: 'Lukas 2; Matthäus 2', en: 'Luke 2; Matthew 2' },
    lead: {
      de: 'Die Weihnachtsgeschichte ist eine Reisegeschichte: Volkszählung, Stall, Sterndeuter – und eine Familie, die nachts als Flüchtlinge über die Grenze geht.',
      en: 'The Christmas story is a travel story: a census, a stable, star-gazers – and a family crossing a border at night as refugees.',
    },
    stops: [
      { de: 'Nazareth', en: 'Nazareth', lat: 32.702, lon: 35.298, placeId: 'af5884f', ref: { de: 'Lukas 1,26-38; 2,1-5', en: 'Luke 1:26-38; 2:1-5' }, text: { de: 'Ein Dorf ohne Bedeutung, eine junge Frau mit einer unmöglichen Zusage – dann der Befehl zur Schätzung.', en: 'A village of no importance, a young woman with an impossible promise – then the decree for the census.' } },
      { de: 'Bethlehem', en: 'Bethlehem', lat: 31.704, lon: 35.208, placeId: 'a112427', ref: { de: 'Lukas 2,4-20', en: 'Luke 2:4-20' }, text: { de: 'Rund 150 Kilometer zu Fuß. In der Stadt Davids ist kein Raum in der Herberge – die Hirten kommen trotzdem.', en: 'About 150 kilometres on foot. In the city of David there is no room at the inn – the shepherds come anyway.' } },
      { de: 'Jerusalem', en: 'Jerusalem', lat: 31.777, lon: 35.234, placeId: 'a15257a', ref: { de: 'Lukas 2,22-38', en: 'Luke 2:22-38' }, text: { de: 'Zwei Tauben als Opfer der Armen; Simeon und Hanna erkennen im Säugling das Heil.', en: 'Two doves, the offering of the poor; Simeon and Anna recognise salvation in the infant.' } },
      { de: 'Ägypten', en: 'Egypt', lat: 30.129, lon: 31.308, placeId: 'af301ca', ref: { de: 'Matthäus 2,13-18', en: 'Matt 2:13-18' }, text: { de: 'Nach den Sterndeutern der Traum und die Flucht bei Nacht – während in Bethlehem die Kinder sterben.', en: 'After the magi, the dream and the flight by night – while in Bethlehem the children die.' } },
      { de: 'Nazareth (zurück)', en: 'Nazareth (again)', lat: 32.702, lon: 35.298, placeId: 'af5884f', ref: { de: 'Matthäus 2,19-23; Lukas 2,41-52', en: 'Matt 2:19-23; Luke 2:41-52' }, text: { de: 'Zurück in Galiläa wächst er auf – mit zwölf bleibt er im Tempel sitzen und lässt die Eltern suchen.', en: 'Back in Galilee he grows up – at twelve he stays behind in the temple and lets his parents search.' } },
    ],
  },
  {
    id: 'jesus-galilee',
    de: 'Jesu Wege in Galiläa',
    en: 'Jesus’ roads in Galilee',
    era: 'gospels',
    when: { de: '~28-30 n. Chr.', en: 'c. AD 28-30' },
    passage: { de: 'Markus 1-9', en: 'Mark 1-9' },
    lead: {
      de: 'Fast alles, was die Evangelien erzählen, passiert im Umkreis von dreißig Kilometern um einen See – in Dörfern, die keine Landkarte nannte.',
      en: 'Almost everything the gospels tell happens within thirty kilometres of one lake – in villages no map bothered to name.',
    },
    stops: [
      { de: 'Nazareth', en: 'Nazareth', lat: 32.702, lon: 35.298, placeId: 'af5884f', ref: { de: 'Lukas 4,16-30', en: 'Luke 4:16-30' }, text: { de: 'In der Synagoge seiner Heimatstadt liest er Jesaja – und wird an den Rand des Berges gedrängt.', en: 'In his hometown synagogue he reads Isaiah – and is driven to the brow of the hill.' } },
      { de: 'Kana', en: 'Cana', lat: 32.822, lon: 35.303, placeId: 'a031bda', ref: { de: 'Johannes 2,1-11', en: 'John 2:1-11' }, text: { de: 'Auf einer Hochzeit geht der Wein aus – sechs Steinkrüge später ist es der beste des Abends.', en: 'At a wedding the wine runs out – six stone jars later it is the best of the evening.' } },
      { de: 'Kapernaum', en: 'Capernaum', lat: 32.881, lon: 35.575, placeId: 'af2161c', ref: { de: 'Markus 1,21-2,12', en: 'Mark 1:21-2:12' }, text: { de: 'Sein Standquartier am See: Petrus’ Haus, die Synagoge, das aufgedeckte Dach und der Gelähmte.', en: 'His base by the lake: Peter’s house, the synagogue, the opened roof and the paralytic.' } },
      { de: 'Betsaida', en: 'Bethsaida', lat: 32.910, lon: 35.631, placeId: 'a91b732', ref: { de: 'Lukas 9,10-17', en: 'Luke 9:10-17' }, text: { de: 'Fünftausend werden satt von fünf Broten – zwölf Körbe bleiben übrig.', en: 'Five thousand are fed from five loaves – twelve baskets are left over.' } },
      { de: 'Chorazin', en: 'Chorazin', lat: 32.911, lon: 35.564, placeId: 'a593a48', ref: { de: 'Matthäus 11,20-24', en: 'Matt 11:20-24' }, text: { de: 'Über die Dörfer, die am meisten gesehen haben, spricht er das härteste Wehe.', en: 'Over the villages that saw the most he speaks the sharpest woe.' } },
      { de: 'Gerasa / Gadara', en: 'Gerasa / Gadara', lat: 32.656, lon: 35.679, placeId: 'afed46a', ref: { de: 'Markus 5,1-20', en: 'Mark 5:1-20' }, text: { de: 'Am Ostufer, in heidnischem Gebiet: der Besessene wird frei, die Schweine stürzen, die Stadt bittet ihn zu gehen.', en: 'On the east shore, in Gentile country: the possessed man is freed, the pigs plunge, the town asks him to leave.' } },
      { de: 'Tyrus und Sidon', en: 'Tyre and Sidon', lat: 33.271, lon: 35.196, placeId: 'a160272', ref: { de: 'Markus 7,24-30', en: 'Mark 7:24-30' }, text: { de: 'Außerhalb Israels: eine Syrophönizierin nimmt ihn beim Wort und bekommt, worum sie bittet.', en: 'Outside Israel: a Syrophoenician woman takes him at his word and gets what she asks.' } },
      { de: 'Cäsarea Philippi', en: 'Caesarea Philippi', lat: 33.246, lon: 35.693, placeId: 'ab7bf48', ref: { de: 'Markus 8,27-9,13', en: 'Mark 8:27-9:13' }, text: { de: 'Am nördlichsten Punkt die Frage „Wer sagt ihr, dass ich sei?“ – und sechs Tage später der Berg der Verklärung.', en: 'At the northernmost point the question "Who do you say that I am?" – and six days later the mount of transfiguration.' } },
    ],
  },
  {
    id: 'jesus-jerusalem',
    de: 'Der Weg nach Jerusalem',
    en: 'The road to Jerusalem',
    era: 'gospels',
    when: { de: '~30 n. Chr.', en: 'c. AD 30' },
    passage: { de: 'Lukas 9,51-24,53', en: 'Luke 9:51-24:53' },
    lead: {
      de: 'Von der Mitte des Lukasevangeliums an hat jeder Schritt eine Richtung: „Er wandte sein Angesicht, nach Jerusalem zu gehen.“',
      en: 'From the middle of Luke onward every step has a direction: "He set his face to go to Jerusalem."',
    },
    stops: [
      { de: 'Kapernaum', en: 'Capernaum', lat: 32.881, lon: 35.575, placeId: 'af2161c', ref: { de: 'Lukas 9,51', en: 'Luke 9:51' }, text: { de: 'Der Aufbruch: Was in Galiläa begann, läuft von jetzt an auf die Hauptstadt zu.', en: 'The departure: what began in Galilee now runs toward the capital.' } },
      { de: 'Samarien / Sichar', en: 'Samaria / Sychar', lat: 32.218, lon: 35.289, placeId: 'a27b472', ref: { de: 'Lukas 9,52-56; Johannes 4', en: 'Luke 9:52-56; John 4' }, text: { de: 'Durch das Gebiet, das fromme Juden umgingen – am Jakobsbrunnen redet er mit einer Frau, die alle meiden.', en: 'Through the region pious Jews avoided – at Jacob’s well he talks with a woman everyone avoids.' } },
      { de: 'Jericho', en: 'Jericho', lat: 31.872, lon: 35.445, placeId: 'a231f80', ref: { de: 'Lukas 18,35-19,10', en: 'Luke 18:35-19:10' }, text: { de: 'Ein Blinder ruft, ein Zöllner klettert auf einen Baum – und bekommt Besuch.', en: 'A blind man shouts, a tax collector climbs a tree – and gets a visitor.' } },
      { de: 'Betanien', en: 'Bethany', lat: 31.772, lon: 35.256, placeId: 'a4f35bc', ref: { de: 'Johannes 11-12', en: 'John 11-12' }, text: { de: 'Bei Maria, Marta und Lazarus – hier wird er gesalbt, wenige Tage vor dem Fest.', en: 'With Mary, Martha and Lazarus – here he is anointed, days before the feast.' } },
      { de: 'Jerusalem', en: 'Jerusalem', lat: 31.777, lon: 35.234, placeId: 'a15257a', ref: { de: 'Lukas 19,28-24,12', en: 'Luke 19:28-24:12' }, text: { de: 'Einzug auf einem Esel, Tempel, Abendmahl, Kreuz vor den Toren – und am dritten Tag ein leeres Grab.', en: 'Entry on a donkey, temple, last supper, a cross outside the gate – and on the third day an empty tomb.' } },
      { de: 'Emmaus', en: 'Emmaus', lat: 31.793, lon: 35.164, placeId: 'ae7274b', ref: { de: 'Lukas 24,13-35', en: 'Luke 24:13-35' }, text: { de: 'Elf Kilometer mit einem Fremden, der die Schrift auslegt – erkannt wird er erst beim Brotbrechen.', en: 'Eleven kilometres with a stranger who explains the Scriptures – recognised only in the breaking of bread.' } },
      { de: 'Ölberg', en: 'Mount of Olives', lat: 31.778, lon: 35.246, placeId: 'ac2c4c5', ref: { de: 'Lukas 24,50-53; Apg 1,8', en: 'Luke 24:50-53; Acts 1:8' }, text: { de: 'Der letzte Auftrag steht am Anfang der nächsten Reise: „ihr werdet meine Zeugen sein … bis an das Ende der Erde.“', en: 'The last commission opens the next journey: "you will be my witnesses … to the ends of the earth."' } },
    ],
  },
];

export const JOURNEY_BY_ID: Record<string, BibleJourney> = Object.fromEntries(
  JOURNEYS.map((j) => [j.id, j]),
);
