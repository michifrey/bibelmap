import type { Lang } from '../i18n';

/**
 * Die Zeile unter der Karte – in der Sprache, die gewählt ist.
 *
 * Die Attributionen standen fest auf Deutsch im Quelltext: „· Orte:
 * OpenBible.info", „· Routen: schematisch", „Orte der Kirchenväter & Konzilien:
 * schematisch". Gemessen war das in der englischen Oberfläche der häufigste
 * deutsche Rest – er stand in **jeder** Ansicht mit Karte.
 *
 * Was hier übersetzt wird, sind unsere eigenen Worte: „Orte", „Routen",
 * „schematisch", „modifizierte Copernicus-Daten". Namen bleiben Namen –
 * OpenStreetMap, EOX, DARE heißen in jeder Sprache so.
 */

type Zweisprachig = { de: string; en: string };

const OSM = '<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';
const OPENBIBLE = '<a href="https://www.openbible.info/geo/">OpenBible.info</a>';

/** Woher die Orte kommen – hängt an jeder Karte dieser App. */
export const ORTE_ATTR: Zweisprachig = {
  de: `· Orte: ${OPENBIBLE} (CC-BY)`,
  en: `· Places: ${OPENBIBLE} (CC-BY)`,
};

/**
 * Die Standardkarte. Bis August 2026 kamen die helle und die dunkle Karte von
 * CARTO; seither verlangt deren Kachelserver einen Schlüssel und antwortet
 * sonst mit „API key required" – über Nacht war jede der sieben Karten dieser
 * App leer. Beide kommen jetzt direkt von OpenStreetMap, das ohne Schlüssel
 * ausliefert. Die dunkle ist dieselbe Kachel, nur umgerechnet (siehe
 * `basemaps.ts`) – ein zweiter Anbieter wäre ein zweites Abhängigkeitsrisiko.
 */
export const OSM_ATTR: Zweisprachig = {
  de: `&copy; ${OSM}-Mitwirkende (ODbL) ${ORTE_ATTR.de}`,
  en: `&copy; ${OSM} contributors (ODbL) ${ORTE_ATTR.en}`,
};

/**
 * Zusätze einzelner Ansichten. „schematisch" ist dabei kein Beiwerk, sondern
 * eine Einschränkung: die Linien zeigen, von wo nach wo – nicht, welchen Weg
 * jemand tatsächlich nahm.
 */
export const ROUTEN_ATTR: Zweisprachig = {
  de: `${OSM_ATTR.de} · Routen: schematisch`,
  en: `${OSM_ATTR.en} · Routes: schematic`,
};

export const KIRCHE_ATTR: Zweisprachig = {
  de: `&copy; ${OSM}-Mitwirkende (ODbL) · Orte der Kirchenväter & Konzilien: schematisch`,
  en: `&copy; ${OSM} contributors (ODbL) · Places of the church fathers & councils: schematic`,
};

export function attr(zwei: Zweisprachig, lang: Lang): string {
  return lang === 'de' ? zwei.de : zwei.en;
}
