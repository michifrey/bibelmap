/**
 * Leaflet macht seine Marker fokussierbar (tabindex, role=button), löst auf
 * Enter aber nichts aus. Wer die Karte mit der Tastatur bedient, kommt so zwar
 * zu jedem Ort, aber an keinen heran.
 *
 * Ein nachgestellter Klick hilft nicht: Leaflet ignoriert synthetische
 * MouseEvents (geprüft – der echte Mausklick öffnet die Ortskarte, der
 * nachgebaute nicht). Deshalb meldet der Aufrufer, was zu einem Symbol gehört,
 * und führt es selbst aus.
 */
export function enableMarkerKeyboard(
  container: HTMLElement,
  activate: (el: HTMLElement) => void,
): () => void {
  const onKey = (e: KeyboardEvent) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const el = document.activeElement;
    if (!(el instanceof HTMLElement) || !el.classList.contains('leaflet-marker-icon')) return;
    e.preventDefault();
    activate(el);
  };
  container.addEventListener('keydown', onKey);
  return () => container.removeEventListener('keydown', onKey);
}
