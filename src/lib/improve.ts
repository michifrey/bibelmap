/**
 * „Diese Seite verbessern" – der Weg von einer Seite zu ihrer Quelle.
 *
 * **Was hier fehlte.** Diese App behauptet auf jeder Seite etwas: dass ein
 * Satz so in der Bibel steht, dass ein Ort dort liegt, dass ein Buch so
 * gebaut ist. Wer einen Fehler findet – und es gibt Fehler –, hatte bisher
 * nur einen Weg: das Impressum suchen und eine Mail schreiben. Wikipedia
 * macht das seit zwanzig Jahren anders, und zwar aus einem Grund, der nichts
 * mit Technik zu tun hat: Wer den Fehler sieht, ist der, der ihn am
 * billigsten beheben kann – aber nur, solange der Weg dorthin kürzer ist als
 * der Ärger.
 *
 * Drei Wege, absteigend nach Aufwand, und jeder führt an dieselbe Stelle:
 *
 *   **Bearbeiten**  öffnet die Datendatei im Editor von GitHub. Wer dort
 *                   etwas ändert und speichert, bekommt automatisch eine
 *                   eigene Kopie des Projekts (einen Fork) und daraus einen
 *                   Pull Request – ohne Git auf dem eigenen Rechner, ohne
 *                   Kommandozeile. Das ist der „Merge Request", und er ist
 *                   fünf Klicks entfernt.
 *   **Melden**      legt ein Issue an, in dem die Adresse der Seite, der
 *                   Abschnitt und die Fragen schon stehen. Für alle, die den
 *                   Fehler sehen, aber die Datei nicht anfassen wollen.
 *   **Verlauf**     zeigt, wer an dieser Datei was geändert hat. Wikipedias
 *                   „Versionsgeschichte", und sie beantwortet die Frage, die
 *                   vor jeder Korrektur steht: Stand das schon immer so da?
 *
 * **Warum die Datei und nicht die Zeile.** GitHub kann auf eine Zeile
 * zeigen, und das wäre schöner. Nur verschiebt sich die Zeilennummer bei der
 * nächsten Änderung, und ein Link, der auf die falsche Zeile zeigt, ist
 * schlechter als einer, der auf die Datei zeigt: Er führt jemanden an eine
 * Stelle und behauptet dabei, sie sei die richtige. Die Datei stimmt, solange
 * sie existiert – und dass sie existiert, prüft `npm run check:improve`.
 */

/** Wo dieses Projekt liegt. */
export const REPO = 'https://github.com/michifrey/bibelmap';
/** Der Zweig, auf den die Links zeigen – derselbe, der veröffentlicht wird. */
export const BRANCH = 'main';

/**
 * Die Quelldatei hinter einer Seite.
 *
 * Als benannte Liste und nicht als Zeichenkette am Aufrufort: Ein Pfad, der
 * in der Oberfläche steht, wandert bei der nächsten Umbenennung nicht mit.
 * Hier steht er einmal, und `npm run check:improve` schlägt jeden Eintrag auf
 * der Festplatte nach.
 */
export const SOURCES = {
  /** Die Buchporträts – Züge, Figuren, Zitate, Vertiefung. */
  portraits: 'src/data/bookPortraits.ts',
  /** Die verlinkten Leseplläne über die ganze Bibel. */
  readingPlans: 'src/data/readingPlans.ts',
} as const;

export type SourceKey = keyof typeof SOURCES;

/**
 * Bearbeiten: GitHubs Editor. Wer keine Schreibrechte hat – also fast jeder –,
 * bekommt beim Speichern eine eigene Kopie und einen Pull Request vorgeschlagen.
 */
export function editUrl(file: string): string {
  return `${REPO}/edit/${BRANCH}/${file}`;
}

/** Verlauf: wer wann was an dieser Datei geändert hat. */
export function historyUrl(file: string): string {
  return `${REPO}/commits/${BRANCH}/${file}`;
}

/** Zeilenweise: welche Änderung welche Zeile zuletzt angefasst hat. */
export function blameUrl(file: string): string {
  return `${REPO}/blame/${BRANCH}/${file}`;
}

/**
 * Melden: ein Issue mit vorbereitetem Titel und Text.
 *
 * Die Adresse der Seite steht darin, und das ist der wichtigste Teil: Eine
 * Meldung ohne Ort ist eine Suchaufgabe. Die Fragen darunter sind bewusst
 * zwei – was steht da, und was wäre richtig –, denn eine Meldung ohne den
 * zweiten Teil kostet genauso viel Arbeit wie gar keine.
 */
export function issueUrl(opts: { what: string; url: string; lang: 'de' | 'en' }): string {
  const { what, url, lang } = opts;
  const title = lang === 'de' ? `Korrektur: ${what}` : `Correction: ${what}`;
  const body =
    lang === 'de'
      ? [
          `**Seite:** ${url}`,
          `**Abschnitt:** ${what}`,
          '',
          '**Was stimmt nicht?**',
          '',
          '',
          '**Was wäre richtig – und woher weißt du das?**',
          '',
          '',
          '<!-- Eine Quelle, die man nachschlagen kann, hilft am meisten:',
          '     eine Bibelstelle, ein Buch mit Seitenzahl, ein Link. -->',
        ].join('\n')
      : [
          `**Page:** ${url}`,
          `**Section:** ${what}`,
          '',
          '**What is wrong?**',
          '',
          '',
          '**What would be right – and how do you know?**',
          '',
          '',
          '<!-- A source someone can look up helps most:',
          '     a Bible passage, a book with a page number, a link. -->',
        ].join('\n');
  return `${REPO}/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
}
