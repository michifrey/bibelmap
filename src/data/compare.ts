// Shared figures of Judaism, Christianity and Islam — with the scripture
// references in each tradition (Tanakh / Christian Bible / Qur'an) and a short,
// factual note written from a Jewish–Christian–biblical vantage point, naming
// parallels and notable differences neutrally. References are pointers for
// further reading, not a claim of equivalence between the texts.

export interface CompareFigure {
  id: string;
  de: { name: string; note: string };
  en: { name: string; note: string };
  islamName: string; // common transliteration of the Islamic name
  refs: { tanakh: string; christian: string; quran: string };
  places?: string[];
}

export const COMPARE: CompareFigure[] = [
  {
    id: 'adam', islamName: 'Ādam آدم',
    de: { name: 'Adam', note: 'Der erste Mensch. In Tora und Bibel Ursprung der Menschheit und des Sündenfalls; das Neue Testament stellt Christus als „letzten Adam" gegenüber. Der Koran erzählt Erschaffung und Fall, kennt aber keine Erbsünde.' },
    en: { name: 'Adam', note: 'The first human. In Torah and Bible the origin of humanity and the fall; the New Testament contrasts Christ as the “last Adam”. The Qur’an narrates creation and fall but without original sin.' },
    refs: { tanakh: '1. Mose 1–5', christian: 'Römer 5; 1. Korinther 15', quran: 'Sure 2:30–39; 7:11–25' },
  },
  {
    id: 'noah', islamName: 'Nūḥ نوح',
    de: { name: 'Noah', note: 'Gerechter, den Gott durch die Flut bewahrt. In allen drei Traditionen Bild für Gericht und Bewahrung; im Koran ist Nuh ein warnender Prophet.' },
    en: { name: 'Noah', note: 'The righteous man God preserves through the flood. In all three traditions a figure of judgment and rescue; in the Qur’an Nuh is a warning prophet.' },
    refs: { tanakh: '1. Mose 6–9', christian: 'Hebräer 11,7; 1. Petrus 3; 2. Petrus 2,5', quran: 'Sure 11:25–48; Sure 71 (Nūḥ)' },
    places: ['Ararat'],
  },
  {
    id: 'abraham', islamName: 'Ibrāhīm إبراهيم',
    de: { name: 'Abraham', note: 'Stammvater des Glaubens und gemeinsame Wurzel der drei „abrahamitischen" Religionen. Tora/Bibel: Bund und Verheißung; NT: Vorbild des Glaubens; Koran: Ibrahim als Hanif und Erbauer der Kaaba.' },
    en: { name: 'Abraham', note: 'Father of faith and shared root of the three “Abrahamic” religions. Torah/Bible: covenant and promise; NT: model of faith; Qur’an: Ibrahim as ḥanīf and builder of the Kaaba.' },
    refs: { tanakh: '1. Mose 12–25', christian: 'Römer 4; Galater 3; Hebräer 11', quran: 'Sure 2:124–132; 14:35–41; Sure 37' },
    places: ['Ur', 'Haran', 'Hebron', 'Shechem'],
  },
  {
    id: 'ishmael', islamName: 'Ismāʿīl إسماعيل',
    de: { name: 'Ismael', note: 'Sohn Abrahams und der Hagar. In der Bibel Stammvater nördarabischer Völker; in islamischer Tradition Vorfahr der Araber und mit Abraham Erbauer der Kaaba.' },
    en: { name: 'Ishmael', note: 'Son of Abraham and Hagar. In the Bible ancestor of north-Arabian peoples; in Islamic tradition forefather of the Arabs and, with Abraham, builder of the Kaaba.' },
    refs: { tanakh: '1. Mose 16; 21; 25', christian: 'Galater 4,21–31', quran: 'Sure 2:125–129; 19:54–55' },
  },
  {
    id: 'isaac', islamName: 'Isḥāq إسحاق',
    de: { name: 'Isaak', note: 'Verheißener Sohn Abrahams und Saras, Träger des Bundes. Die „Bindung Isaaks" (Akeda) ist im Judentum zentral; der Koran erzählt eine Opferung ohne den Sohn zu nennen (meist auf Ismael gedeutet).' },
    en: { name: 'Isaac', note: 'Promised son of Abraham and Sarah, bearer of the covenant. The “binding of Isaac” (Akedah) is central in Judaism; the Qur’an tells of a sacrifice without naming the son (usually read as Ishmael).' },
    refs: { tanakh: '1. Mose 21–28', christian: 'Römer 9; Hebräer 11,17–19', quran: 'Sure 37:99–113; 11:71' },
  },
  {
    id: 'jacob', islamName: 'Yaʿqūb يعقوب',
    de: { name: 'Jakob / Israel', note: 'Sohn Isaaks; von ihm stammen die zwölf Stämme Israels. In allen Traditionen Patriarch; der Koran zählt Yaqub zu den Propheten.' },
    en: { name: 'Jacob / Israel', note: 'Son of Isaac; ancestor of the twelve tribes of Israel. A patriarch in all traditions; the Qur’an counts Yaqub among the prophets.' },
    refs: { tanakh: '1. Mose 25–35', christian: 'Römer 9; Hebräer 11,21', quran: 'Sure 19:49; Sure 12' },
    places: ['Shechem', 'Bethel'],
  },
  {
    id: 'joseph', islamName: 'Yūsuf يوسف',
    de: { name: 'Josef', note: 'Vom Bruder verkauft, in Ägypten zum Retter erhoben. Die Geschichte füllt eine ganze Koransure (Yusuf) und gilt dort als „schönste Erzählung".' },
    en: { name: 'Joseph', note: 'Sold by his brothers, raised to be a savior in Egypt. The story fills an entire Qur’anic surah (Yusuf), called there “the most beautiful of stories”.' },
    refs: { tanakh: '1. Mose 37–50', christian: 'Apostelgeschichte 7,9–16', quran: 'Sure 12 (Yūsuf)' },
    places: ['Egypt', 'Goshen'],
  },
  {
    id: 'moses', islamName: 'Mūsā موسى',
    de: { name: 'Mose', note: 'Befreier Israels und Empfänger der Tora. Im Koran der am häufigsten genannte Prophet; das Exodus-Geschehen ist in allen drei Traditionen prägend.' },
    en: { name: 'Moses', note: 'Liberator of Israel and recipient of the Torah. The most-mentioned prophet in the Qur’an; the Exodus shapes all three traditions.' },
    refs: { tanakh: '2.–5. Mose', christian: 'Johannes 1,17; Hebräer 3; Apostelgeschichte 7', quran: 'Sure 20; 28; 7' },
    places: ['Egypt', 'Red Sea'],
  },
  {
    id: 'david', islamName: 'Dāwūd داود',
    de: { name: 'David', note: 'König und Psalmdichter, Stammvater des Messias. Tanach/Bibel: ewiger Königsbund; Koran: Dawud als Prophet, dem die „Zabur" (Psalmen) gegeben wird.' },
    en: { name: 'David', note: 'King and psalmist, ancestor of the Messiah. Tanakh/Bible: everlasting royal covenant; Qur’an: Dawud as a prophet given the “Zabur” (Psalms).' },
    refs: { tanakh: '1.–2. Samuel; Psalmen', christian: 'Matthäus 1; Apostelgeschichte 13,22', quran: 'Sure 2:251; 38:17–26' },
    places: ['Jerusalem', 'Bethlehem', 'Hebron'],
  },
  {
    id: 'solomon', islamName: 'Sulaymān سليمان',
    de: { name: 'Salomo', note: 'Weiser König und Tempelbauer. Im Koran wird Sulayman besondere Weisheit und Herrschaft über Wind und Tiere zugeschrieben.' },
    en: { name: 'Solomon', note: 'Wise king and temple builder. In the Qur’an Sulayman is given special wisdom and command over wind and animals.' },
    refs: { tanakh: '1. Könige 1–11', christian: 'Matthäus 6,29; 12,42', quran: 'Sure 27; 38:30–40' },
    places: ['Jerusalem'],
  },
  {
    id: 'jonah', islamName: 'Yūnus يونس',
    de: { name: 'Jona', note: 'Prophet, der nach Ninive gesandt und vom großen Fisch verschlungen wird. Jesus deutet das „Zeichen des Jona"; der Koran widmet Yunus eine eigene Sure.' },
    en: { name: 'Jonah', note: 'Prophet sent to Nineveh and swallowed by the great fish. Jesus speaks of the “sign of Jonah”; the Qur’an names a surah after Yunus.' },
    refs: { tanakh: 'Jona', christian: 'Matthäus 12,39–41', quran: 'Sure 10 (Yūnus); 37:139–148; 21:87' },
    places: ['Nineveh'],
  },
  {
    id: 'mary', islamName: 'Maryam مريم',
    de: { name: 'Maria', note: 'Mutter Jesu. Die einzige namentlich genannte Frau im Koran, mit einer eigenen Sure (Maryam); Jungfrauengeburt wird in NT und Koran bezeugt.' },
    en: { name: 'Mary', note: 'Mother of Jesus. The only woman named in the Qur’an, with a surah of her own (Maryam); the virgin birth is attested in both the NT and the Qur’an.' },
    refs: { tanakh: '(Jesaja 7,14 – Verheißung)', christian: 'Matthäus 1; Lukas 1–2', quran: 'Sure 3:42–47; Sure 19 (Maryam)' },
    places: ['Nazareth', 'Bethlehem'],
  },
  {
    id: 'john-baptist', islamName: 'Yaḥyā يحيى',
    de: { name: 'Johannes der Täufer', note: 'Wegbereiter Jesu. Im Koran als Yahya ein gerechter Prophet, dessen Geburt – wie im Lukasevangelium – als Wunder geschildert wird.' },
    en: { name: 'John the Baptist', note: 'Forerunner of Jesus. In the Qur’an, Yahya is a righteous prophet whose birth — as in Luke — is described as a miracle.' },
    refs: { tanakh: '(Maleachi 3,1 – Verheißung)', christian: 'Matthäus 3; Lukas 1', quran: 'Sure 3:39; 19:7–15' },
  },
  {
    id: 'jesus', islamName: 'ʿĪsā عيسى',
    de: { name: 'Jesus', note: 'Im Christentum der menschgewordene Sohn Gottes, Gekreuzigter und Auferstandener. Der Koran ehrt Isa als Messias, Wort und Prophet, lehrt aber weder Gottessohnschaft noch Kreuzestod – der zentrale Unterschied der Traditionen.' },
    en: { name: 'Jesus', note: 'In Christianity the incarnate Son of God, crucified and risen. The Qur’an honors Isa as Messiah, Word and prophet, but denies both divine sonship and the crucifixion — the central difference between the traditions.' },
    refs: { tanakh: '(Jesaja 53; Psalm 22 – Verheißung)', christian: 'Matthäus–Johannes; ganzes NT', quran: 'Sure 3:45–55; 4:171; 19:16–36' },
    places: ['Bethlehem', 'Nazareth', 'Jerusalem'],
  },
];
