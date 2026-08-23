import L from 'leaflet';
import { t, type Lang } from '../i18n';

/**
 * Die Kästen, die gerade zu sehen sind. Wechselt jemand die Sprache, während
 * ein Hinweis steht, soll er mitwechseln – `localizeMap` ruft dafür
 * `refreshTileNotices` auf, dieselbe Stelle, die auch die Bedienelemente der
 * Karten übersetzt.
 */
const OFFEN = new Set<HTMLDivElement>();

export function refreshTileNotices(lang: Lang): void {
  for (const box of OFFEN) box.textContent = t(lang, 'basemapOffline');
}

/**
 * Ein Wort, wenn keine Kachel ankommt.
 *
 * Die Hauptkarte sagt seit Langem Bescheid, wenn ein Kachelserver stumm
 * bleibt. Die anderen sechs Karten sagten nichts: Reisen, Mission, Quiz,
 * Kirchengeschichte, Vergleich, Eigener Weg und die Stammeskarte zeigten eine
 * graue Fläche, und die sieht aus wie ein Fehler der App. Nachgemessen war der
 * einzige Hinweis der der Hauptkarte – in jedem Modus hinter dem Vollbild
 * verborgen, auf der Stammeskarte gar nicht vorhanden.
 *
 * Bewusst ein Leaflet-Control und keine React-Ebene: der Hinweis gehört in die
 * Karte, die ihn betrifft, und jede dieser Karten baut ihre Ebenen ohnehin
 * imperativ auf. So ist es ein Aufruf je Karte statt einer Leitung durch drei
 * Komponenten.
 *
 * Gewartet wird auf sechs Fehlschläge, nicht auf den ersten: eine einzelne
 * Kachel, die nicht kommt, ist kein Ausfall. Kommt später doch eine an – das
 * Netz war nur kurz weg –, verschwindet der Hinweis wieder, statt über einer
 * funktionierenden Karte stehen zu bleiben.
 */
export function watchTiles(layer: L.TileLayer, map: L.Map, lang: Lang): () => void {
  let failures = 0;
  let box: HTMLDivElement | null = null;

  const zeigen = () => {
    if (box) return;
    box = L.DomUtil.create('div', 'bm-tile-notice');
    // Wer nicht sieht, dass die Fläche grau bleibt, soll es hören: als
    // freundliche Meldung, die den Vorlesefluss nicht unterbricht.
    box.setAttribute('role', 'status');
    box.textContent = t(lang, 'basemapOffline');
    // Der Hinweis ist zum Lesen da, nicht zum Anfassen: Klicks und Wischen
    // sollen weiter die Karte bewegen.
    L.DomEvent.disableClickPropagation(box);
    map.getContainer().appendChild(box);
    OFFEN.add(box);
  };

  const verbergen = () => {
    if (box) OFFEN.delete(box);
    box?.remove();
    box = null;
  };

  const onLoad = () => {
    failures = 0;
    verbergen();
  };
  const onError = () => {
    failures += 1;
    if (failures >= 6) zeigen();
  };

  layer.on('tileload', onLoad);
  layer.on('tileerror', onError);
  return () => {
    layer.off('tileload', onLoad);
    layer.off('tileerror', onError);
    verbergen();
  };
}
