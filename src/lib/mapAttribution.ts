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
 * OpenStreetMap, CARTO, EOX, DARE heißen in jeder Sprache so.
 */

type Zweisprachig = { de: string; en: string };

const OSM = '<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';
const CARTO = '<a href="https://carto.com/attributions">CARTO</a>';
const OPENBIBLE = '<a href="https://www.openbible.info/geo/">OpenBible.info</a>';

/** Woher die Orte kommen – hängt an jeder Karte dieser App. */
export const ORTE_ATTR: Zweisprachig = {
  de: `· Orte: ${OPENBIBLE} (CC-BY)`,
  en: `· Places: ${OPENBIBLE} (CC-BY)`,
};

/** Die dunkle und die helle CARTO-Karte tragen dieselbe Zeile. */
export const CARTO_ATTR: Zweisprachig = {
  de: `&copy; ${OSM} &copy; ${CARTO} ${ORTE_ATTR.de}`,
  en: `&copy; ${OSM} &copy; ${CARTO} ${ORTE_ATTR.en}`,
};

/**
 * Zusätze einzelner Ansichten. „schematisch" ist dabei kein Beiwerk, sondern
 * eine Einschränkung: die Linien zeigen, von wo nach wo – nicht, welchen Weg
 * jemand tatsächlich nahm.
 */
export const ROUTEN_ATTR: Zweisprachig = {
  de: `${CARTO_ATTR.de} · Routen: schematisch`,
  en: `${CARTO_ATTR.en} · Routes: schematic`,
};

export const KIRCHE_ATTR: Zweisprachig = {
  de: '&copy; OpenStreetMap &copy; CARTO · Orte der Kirchenväter & Konzilien: schematisch',
  en: '&copy; OpenStreetMap &copy; CARTO · Places of the church fathers & councils: schematic',
};

export function attr(zwei: Zweisprachig, lang: Lang): string {
  return lang === 'de' ? zwei.de : zwei.en;
}
