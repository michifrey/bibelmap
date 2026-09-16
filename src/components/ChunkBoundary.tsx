import { Component, type ErrorInfo, type ReactNode } from 'react';
import { t, type Lang } from '../i18n';

const KNOPF = 'px-5 py-3.5 text-[12px] font-extrabold uppercase tracking-[0.08em] transition';

interface Props {
  lang: Lang;
  /** Zurück auf die Karte – der Ausweg, der ohne Netz noch funktioniert. */
  onExit: () => void;
  children: ReactNode;
}

/**
 * Was übrig bleibt, wenn eine Ansicht sich nicht laden lässt.
 *
 * **Warum es das braucht.** `lib/chunks.ts` lädt einmal neu, wenn ein Paket
 * nach einer Veröffentlichung unter neuem Namen liegt. Das deckt den
 * häufigen Fall ab. Es deckt den seltenen nicht: Wenn auch die *neue*
 * `index.html` auf eine Datei zeigt, die es nicht gibt, scheitert der Import
 * ein zweites Mal – und ein zweites Neuladen wäre eine Schleife.
 *
 * Ohne Auffangstelle wirft React dann bis nach oben durch und hängt den
 * ganzen Baum aus: weisse Seite, nichts mehr anklickbar. Nachgemessen mit
 * einer absichtlich kaputten Veröffentlichung. Das ist schlechter als der
 * Fehler, gegen den wir angetreten sind – dort blieb wenigstens die Karte
 * stehen.
 *
 * Hier steht stattdessen ein Satz, was los ist, und zwei Wege hinaus.
 *
 * Eine Klasse, weil React Fehler nur an `componentDidCatch` und
 * `getDerivedStateFromError` meldet; Hooks können das bis heute nicht.
 *
 * `key` auf dem Modus setzt sie zurück: Wer den Modus wechselt, soll nicht
 * den Fehler des vorigen weitersehen.
 */
export default class ChunkBoundary extends Component<Props, { kaputt: boolean }> {
  state = { kaputt: false };

  static getDerivedStateFromError() {
    return { kaputt: true };
  }

  componentDidCatch(fehler: Error, info: ErrorInfo) {
    // In die Konsole, nicht ins Nichts: Wer nachsieht, warum eine Ansicht
    // leer blieb, soll den ursprünglichen Fehler finden.
    console.error('Ansicht konnte nicht geladen werden:', fehler, info.componentStack);
  }

  render() {
    if (!this.state.kaputt) return this.props.children;
    const { lang, onExit } = this.props;

    return (
      <div className="fixed inset-0 z-[2000] grid place-items-center bg-deepest px-6 text-center">
        <div className="max-w-[420px]">
          <div className="bm-eyebrow text-gold">{t(lang, 'chunkFailedTitle')}</div>
          <p className="mt-4 text-sm font-medium leading-[1.8] text-white/80">{t(lang, 'chunkFailedBody')}</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <button onClick={() => location.reload()} className={`${KNOPF} bg-gold text-deep hover:bg-[#eab662]`}>
              {t(lang, 'chunkFailedReload')}
            </button>
            <button onClick={onExit} className={`${KNOPF} bg-white/10 text-white hover:bg-white/20`}>
              {t(lang, 'supportBack')}
            </button>
          </div>
        </div>
      </div>
    );
  }
}
