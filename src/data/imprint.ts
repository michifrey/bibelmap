/**
 * Wer für diese Seite geradesteht.
 *
 * Die Angaben stehen hier und nicht in `i18n.ts`, weil sie in keiner Sprache
 * anders lauten: Ein Name ist ein Name, ein Ortsname ein Ortsname. Übersetzt
 * wird nur, was um sie herum steht – und das eine Stück, das sich doch
 * unterscheidet, siehe `ADDRESS`.
 */

/**
 * Verantwortlich im Sinne eines Impressums – eine Person, keine Firma.
 *
 * Hier steht der volle Name, nicht die Kurzform: Diese Zeile ist die, auf die
 * sich jemand berufen können soll. Im Absatz „Wer das gebaut hat" darf
 * daneben „Michi" stehen – dort schreibt der Mensch, hier haftet er.
 */
export const OWNER = 'Michael Frey';

/**
 * Die E-Mail steht ausgeschrieben da, nicht als `[at]`-Bastelei.
 *
 * Die Verschleierung hält heute keinen Sammler mehr auf – sie hält nur den
 * auf, der schreiben will, und macht die Adresse für Screenreader unlesbar.
 * Ein Impressum, das man erst entziffern muss, ist keines.
 */
export const EMAIL = 'michael@freynet.ch';

/**
 * Die Postanschrift, Zeile für Zeile – oder `null`, solange keine dasteht.
 *
 * **Warum die hier zweisprachig ist und der Rest der Datei nicht.** Ein
 * Ortsname bleibt einer: Aarau heisst auf Englisch Aarau. Das Land nicht –
 * „Schweiz" in einer englischen Oberfläche sieht aus wie ein vergessener
 * Rest, nicht wie eine Adresse. Darum dieselbe `{ de, en }`-Form, die im
 * Rest der App jede zweisprachige Angabe trägt.
 *
 * Ort und Land ohne Strasse und Hausnummer: Für eine private, nicht-
 * kommerzielle Seite verlangt weder das schweizerische UWG (Art. 3 Abs. 1
 * lit. s gilt dem elektronischen Geschäftsverkehr) noch das deutsche DDG
 * (§ 5 gilt geschäftsmässigen Angeboten) eine ladungsfähige Anschrift; Name
 * und ein erreichbarer Kontakt genügen. Sobald hier Geld fliesst – Spenden,
 * Werbung, ein Verkauf –, ändert sich das: dann gehören Strasse und Nummer
 * dazu, und dann stehen sie hier vorn.
 *
 * `null` blendet den Block aus – lieber keine Zeile als eine erfundene.
 */
export const ADDRESS: { de: readonly string[]; en: readonly string[] } | null = {
  de: ['Aarau', 'Schweiz'],
  en: ['Aarau', 'Switzerland'],
};

/** Die Seite selbst – Anzeigename und Adresse getrennt, `www.` will niemand lesen. */
export const SITE = { label: 'www.biblemap.ch', url: 'https://www.biblemap.ch' };

/**
 * Wer die Seite ausliefert. Gehört ins Impressum, weil dort die einzigen
 * Daten anfallen, die überhaupt anfallen: die Zugriffe im Serverprotokoll.
 */
export const HOST = { name: 'GitHub Pages (GitHub, Inc., USA)', url: 'https://docs.github.com/en/pages' };
