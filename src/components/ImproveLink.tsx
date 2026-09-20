import { useT } from '../i18n';
import type { Lang } from '../i18n';
import { SOURCES, blameUrl, editUrl, historyUrl, issueUrl, type SourceKey } from '../lib/improve';

/**
 * Die Fußzeile einer Seite: „Diese Seite verbessern".
 *
 * Nach dem Vorbild von Wikipedia, wo neben jedem Artikel „Bearbeiten" und
 * „Versionsgeschichte" stehen – nur führt es hier nicht in ein Wiki, sondern
 * an die Datei, aus der die Seite gebaut ist. Wer dort etwas ändert, bekommt
 * von GitHub eine eigene Kopie und daraus einen Pull Request; das ist derselbe
 * Weg, den auch jede Änderung dieses Projekts nimmt.
 *
 * **Warum das hier steht und nicht nur im Impressum.** Ein Fehler wird
 * gesehen, wo er steht. Wer ihn bemerkt, hat in diesem Moment alles im Kopf,
 * was zur Korrektur nötig ist – die Stelle, die Quelle, den richtigen Satz –,
 * und fünf Minuten später nichts mehr davon. Ein Weg, der erst über das
 * Impressum und ein Mailprogramm führt, ist länger als dieses Zeitfenster.
 *
 * **Drei Knöpfe, drei Aufwände.** Bearbeiten für die, die es selbst können;
 * Melden für die, die den Fehler sehen, aber die Datei nicht anfassen wollen
 * (Adresse und Abschnitt stehen im Text schon drin); Verlauf für die Frage,
 * die vor jeder Korrektur steht: Stand das schon immer so da?
 *
 * Dass die Datei, auf die gezeigt wird, auch existiert, prüft
 * `npm run check:improve` – ein Link auf eine umbenannte Datei führt sonst
 * lautlos auf eine 404, und zwar erst Monate später.
 */

interface Props {
  /** Welche Datei hinter dieser Seite steht – Schlüssel aus `SOURCES`. */
  source: SourceKey;
  /** Was hier zu sehen ist, für Titel und Text der Meldung. */
  what: string;
  lang: Lang;
}

export default function ImproveLink({ source, what, lang }: Props) {
  const t = useT();
  const file = SOURCES[source];
  // Die volle Adresse mitsamt Hash: Ohne sie ist eine Meldung eine Suchaufgabe.
  const url = typeof window === 'undefined' ? '' : window.location.href;

  return (
    <aside className="border-t border-white/10 pt-3">
      <div className="bm-eyebrow bm-eyebrow-dim">{t('improveTitle')}</div>
      <p className="mt-1 text-[11.5px] leading-snug text-white/50">{t('improveNote')}</p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        <a
          href={editUrl(file)}
          target="_blank"
          rel="noreferrer"
          className="bm-chip hover:bg-white/14"
          title={t('improveEditTitle')}
        >
          ✎ {t('improveEdit')}
        </a>
        <a
          href={issueUrl({ what, url, lang })}
          target="_blank"
          rel="noreferrer"
          className="bm-chip hover:bg-white/14"
          title={t('improveReportTitle')}
        >
          ⚑ {t('improveReport')}
        </a>
        <a
          href={historyUrl(file)}
          target="_blank"
          rel="noreferrer"
          className="bm-chip hover:bg-white/14"
          title={t('improveHistoryTitle')}
        >
          ↻ {t('improveHistory')}
        </a>
        <a
          href={blameUrl(file)}
          target="_blank"
          rel="noreferrer"
          className="bm-chip hover:bg-white/14"
          title={t('improveBlameTitle')}
        >
          ≡ {t('improveBlame')}
        </a>
      </div>
      <p className="mt-1.5 text-[11px] text-white/35">{file}</p>
    </aside>
  );
}
