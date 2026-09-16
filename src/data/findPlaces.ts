// Wo ein Fund die Karte berührt.
//
// Vier der sechzehn Handschriftenfunde aus `finds.ts` haben einen Ort, den
// `places.json` kennt. Nur diese vier stehen hier – Qumran, Masada, Fustat,
// Oxyrhynchos und die Fayyum-Papyri fehlen in einem Datensatz **biblischer**
// Orte, und eine Fahne neben die richtige Stelle zu stecken wäre schlechter
// als keine.
//
// **Warum das nicht in `finds.ts` steht.** Die Ortskarte soll diese
// Verknüpfung zeigen, und sie wird bei jedem Klick auf einen Ort geöffnet.
// `finds.ts` liegt im selben Bündel wie das Regal und die Gesetzestexte –
// zusammen 159 kB. Für vier Zeilen Verweis das ganze Regal nachzuladen wäre
// ein schlechter Tausch. Also diese Datei: Sie hängt an nichts, wiegt nichts,
// und beide Seiten lesen aus ihr.
//
// **Nicht jeder Ort ist ein Fundort**, und das steht an jedem Eintrag. Der
// Codex Alexandrinus wurde nicht in Alexandria gefunden, er lag dort; das
// Katharinenkloster steht am *überlieferten* Sinai, und diese Zuordnung ist
// selbst umstritten. `relation` sagt es, statt es offenzulassen.
//
// `npm run check:shelf` prüft, dass jede ID einen Fund trifft, jeder Titel
// wörtlich mit dem dort steht, und jeder Ortsname gegen `places.json` auflöst.

export interface FindPlaceLink {
  /** ID eines Eintrags aus `finds.ts`. */
  find: string;
  /** Titel des Fundes – wörtlich der aus `finds.ts`, von der Prüfung gebunden. */
  de: string;
  en: string;
  /** Englische Ortsnamen, zur Laufzeit gegen `places.json` aufgelöst. */
  places: string[];
  /** Was dieser Ort mit dem Fund zu tun hat. */
  relation: { de: string; en: string };
}

export const FIND_PLACES: FindPlaceLink[] = [
  {
    find: 'ketefhinnom',
    de: 'Die Silberröllchen von Ketef Hinnom',
    en: 'The silver scrolls of Ketef Hinnom',
    places: ['Valley of Hinnom', 'Jerusalem'],
    relation: {
      de: 'Hier gefunden: In den Felsengräbern über dem Hinnomtal, südwestlich der Altstadt, lag 1979 der älteste bekannte Bibeltext – der Priestersegen aus 4. Mose 6, als Amulett um den Hals eines Toten.',
      en: 'Found here: in the rock tombs above the Hinnom valley, south-west of the old city, lay the oldest known biblical text, uncovered in 1979 – the priestly blessing of Numbers 6, worn as an amulet around a dead person’s neck.',
    },
  },
  {
    find: 'lachisch',
    de: 'Die Ostraka von Lachisch',
    en: 'The Lachish letters',
    places: ['Lachish'],
    relation: {
      de: 'Hier gefunden: 1935 lagen in der verbrannten Torkammer einundzwanzig beschriebene Scherben – Militärpost aus den letzten Wochen Judas, die dieselben Städte nennt wie Jeremia 34,7.',
      en: 'Found here: in 1935 twenty-one inscribed potsherds lay in the burnt gate chamber – military post from the last weeks of Judah, naming the same cities as Jeremiah 34:7.',
    },
  },
  {
    find: 'sinaiticus',
    de: 'Codex Sinaiticus',
    en: 'Codex Sinaiticus',
    places: ['Mount Sinai'],
    relation: {
      de: 'Hier gefunden: im Katharinenkloster, das am überlieferten Sinai steht – 1844 und 1859 durch Konstantin von Tischendorf. Dass dieser Berg der Sinai der Bibel ist, ist eine alte Zuordnung, keine gesicherte.',
      en: 'Found here: at St Catherine’s Monastery, which stands at the traditional Sinai – in 1844 and 1859, by Konstantin von Tischendorf. That this mountain is the Sinai of the Bible is an old identification, not a settled one.',
    },
  },
  {
    find: 'alexandrinus',
    de: 'Codex Alexandrinus',
    en: 'Codex Alexandrinus',
    places: ['Alexandria'],
    relation: {
      de: 'Nicht hier gefunden, aber von hier: Die Handschrift lag in Alexandria, ehe der Patriarch von Konstantinopel sie 1627 dem englischen König schenkte. Ihren Namen trägt sie nach dieser Stadt.',
      en: 'Not found here, but from here: the manuscript lay in Alexandria before the patriarch of Constantinople gave it to the English king in 1627. It carries the city’s name.',
    },
  },
];

/**
 * Funde je Ortsname, kleingeschrieben – die Ortskarte schlägt darin nach.
 * Ein Ort kann mehrere Funde tragen, auch wenn es bisher keiner tut.
 */
export const FINDS_AT_PLACE: Record<string, FindPlaceLink[]> = (() => {
  const map: Record<string, FindPlaceLink[]> = {};
  for (const l of FIND_PLACES) {
    for (const name of l.places) (map[name.toLowerCase()] ??= []).push(l);
  }
  return map;
})();
