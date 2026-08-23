import type L from 'leaflet';
import { t, type Lang } from '../i18n';
import { refreshTileNotices } from './tileNotice';

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
/**
 * Welche Attribution zuletzt an welcher Karte hing. Leaflet kann eine Zeile nur
 * entfernen, wenn man sie im Wortlaut kennt – also merken wir sie uns, statt in
 * die Innereien des Controls zu greifen.
 */
const ZULETZT = new WeakMap<L.Map, string>();

export function localizeMap(map: L.Map, lang: Lang, attribution?: string): () => void {
  // Die Zeile unter der Karte gehört zu ihren Beschriftungen: sie stand fest
  // auf Deutsch und blieb es auch, wenn jemand auf Englisch umschaltete.
  if (attribution !== undefined) {
    const alt = ZULETZT.get(map);
    if (alt && alt !== attribution) map.attributionControl?.removeAttribution(alt);
    if (alt !== attribution) {
      map.attributionControl?.addAttribution(attribution);
      ZULETZT.set(map, attribution);
    }
  }
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
  // Ein stehender Kachel-Hinweis wechselt die Sprache mit: er gehört zu den
  // Beschriftungen der Karte, auch wenn ihn kein Leaflet-Control erzeugt.
  refreshTileNotices(lang);
  map.on('popupopen', onPopup);
  return () => {
    map.off('popupopen', onPopup);
  };
}
