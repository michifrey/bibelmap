import type L from 'leaflet';
import { t, type Lang } from '../i18n';

/**
 * Leaflet beschriftet seine eigenen Bedienelemente – und zwar auf Englisch,
 * fest eingebaut: „Zoom in", „Zoom out", „Close popup". In einer Oberfläche,
 * die sonst durchgehend Deutsch spricht, ist das ein Bruch; für einen
 * Screenreader ist es schlicht die falsche Sprache, mitten im Satz.
 *
 * Auffallen konnte es lange nicht: die A11y-Prüfung zählt, ob jedes Element
 * einen Namen hat, nicht in welcher Sprache er steht.
 *
 * Diese eine Stelle setzt die Namen für alle sechs Leaflet-Karten. Die
 * Rückgabe hängt die Zuhörer wieder ab.
 */
export function localizeMap(map: L.Map, lang: Lang): () => void {
  const apply = () => {
    const c = map.getContainer();
    for (const [sel, key] of [
      ['.leaflet-control-zoom-in', 'zoomIn'],
      ['.leaflet-control-zoom-out', 'zoomOut'],
    ] as const) {
      const el = c.querySelector(sel);
      if (!el) continue;
      const name = t(lang, key);
      el.setAttribute('title', name);
      el.setAttribute('aria-label', name);
    }
  };

  /** Der Schließen-Knopf entsteht mit jedem Fenster neu. */
  const onPopup = () => {
    const btn = map.getContainer().querySelector('.leaflet-popup-close-button');
    if (btn) btn.setAttribute('aria-label', t(lang, 'closePopup'));
  };

  apply();
  map.on('popupopen', onPopup);
  return () => {
    map.off('popupopen', onPopup);
  };
}
