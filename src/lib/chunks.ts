import { lazy, type ComponentType, type LazyExoticComponent } from 'react';

/**
 * Pakete, die es nicht mehr gibt.
 *
 * **Der Fehler.** Jede Ansicht liegt in einer eigenen Datei, und jede trägt
 * einen Hash im Namen: `Imprint-GQbhcazl.js`. Beim nächsten Build heisst
 * dieselbe Ansicht anders, und die alte Datei ist weg – GitHub Pages legt bei
 * jeder Veröffentlichung den ganzen Ordner neu. Wer die Seite offen hat,
 * während das passiert, hält aber noch die alte `index.html` im Kopf und
 * fragt beim Klick nach dem alten Namen. Liegt der nicht im Cache des Service
 * Workers, kommt vom Server eine 404, und der Browser meldet:
 *
 *     TypeError: Failed to fetch dynamically imported module …/Imprint-GQbhcazl.js
 *
 * Die Ansicht bleibt leer. Nachgestellt mit zwei Builds und einem Ordner, der
 * mitten in der Sitzung getauscht wird.
 *
 * **Die Antwort: einmal neu laden.** Das ist hier billiger als überall sonst,
 * weil der Zustand dieser App in der Adresse steht – `#impressum`,
 * `#reise=exodus,5`. Nach dem Neuladen kommt die neue `index.html`, mit ihr
 * die neuen Namen, und die Seite steht wieder da, wo sie war. Ein Hinweis
 * „bitte neu laden" würde den Leser um etwas bitten, was die Seite selbst
 * kann.
 *
 * **Warum das nicht im Service Worker steht.** Die Fehlermeldung zeigt auf
 * `sw.js`, und dort fällt es auch auf – aber reparieren kann er es nicht: Ein
 * Service Worker kann eine fehlende Datei melden, nicht herbeischaffen, und
 * den gescheiterten Import müsste die Seite trotzdem selbst auffangen. Dazu
 * kommt, wen es sonst nicht schützen würde: den ersten Besuch, das private
 * Fenster, den abgeschalteten Worker. Der Import ist die Stelle, an der es
 * schiefgeht; hier gehört es hin.
 */

/** Wann zuletzt aus diesem Grund neu geladen wurde. */
const SCHLUESSEL = 'bibelmap:paket-neu';

/**
 * So lange nach einem Neuladen gilt der Versuch als verbraucht.
 *
 * Denn das Neuladen hilft nur gegen *veraltete* Namen. Ist eine
 * Veröffentlichung wirklich kaputt – die neue `index.html` nennt eine Datei,
 * die es auch nicht gibt –, dürfte die Seite sich sonst im Kreis drehen.
 * Nach dem zweiten Fehlschlag bleibt es beim alten Verhalten: Der Fehler
 * steht in der Konsole, und die Ansicht bleibt leer.
 */
const SPERRE_MS = 10_000;

function kuerzlichNeugeladen(): boolean {
  try {
    const t = Number(sessionStorage.getItem(SCHLUESSEL));
    return Number.isFinite(t) && Date.now() - t < SPERRE_MS;
  } catch {
    return false;
  }
}

/**
 * Den Versuch vermerken. Gibt `false` zurück, wenn das nicht geht – im
 * privaten Fenster, bei abgeschaltetem Speicher. Dann wird **nicht** neu
 * geladen: Ohne Vermerk gäbe es nichts, was die Schleife anhält, und eine
 * Seite, die sich endlos neu lädt, ist schlimmer als eine leere Ansicht.
 */
function neuladenVermerken(): boolean {
  try {
    sessionStorage.setItem(SCHLUESSEL, String(Date.now()));
    return true;
  } catch {
    return false;
  }
}

/**
 * Ein Paket holen, auf das jemand wartet.
 *
 * Scheitert es, wird einmal neu geladen. Ohne Netz nicht: Dann bringt das
 * Neuladen dieselbe `index.html` aus dem Cache und dasselbe fehlende Paket
 * zurück – da ist die leere Ansicht die ehrlichere Antwort.
 */
export function loadChunk<T>(load: () => Promise<T>): Promise<T> {
  return load().catch((fehler) => {
    if (!navigator.onLine || kuerzlichNeugeladen() || !neuladenVermerken()) throw fehler;
    location.reload();
    // Die Seite geht gleich. Ein Versprechen, das nie eingelöst wird, lässt
    // `Suspense` seinen Platzhalter stehen – sonst blitzt für einen Moment
    // ein Fehler auf, den niemand lesen muss.
    return new Promise<T>(() => {});
  });
}

/**
 * Ein Paket im Leerlauf vorab holen.
 *
 * Fehlschläge bleiben still: Der Vorabruf läuft im Hintergrund, und die 23
 * unbehandelten Fehler, die er während einer Veröffentlichung sonst in die
 * Konsole schreibt, helfen niemandem. Er löst auch **kein** Neuladen aus –
 * eine Seite, die sich von selbst neu lädt, während man sie liest, ist ein
 * schlechterer Handel als ein Paket, das eben später kommt.
 */
export function prefetch(load: () => Promise<unknown>): void {
  void load().catch(() => {});
}

/** Eine Ansicht, die erst beim Öffnen kommt – mit der Rettung aus `loadChunk`. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function lazyView<T extends ComponentType<any>>(
  load: () => Promise<{ default: T }>,
): LazyExoticComponent<T> {
  return lazy(() => loadChunk(load));
}
