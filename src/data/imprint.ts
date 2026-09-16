/**
 * Wer für diese Seite geradesteht.
 *
 * Die Angaben stehen hier und nicht in `i18n.ts`, weil sie in keiner Sprache
 * anders lauten: Ein Name ist ein Name, eine Adresse eine Adresse. Übersetzt
 * wird nur, was um sie herum steht.
 */

/** Verantwortlich im Sinne eines Impressums – eine Person, keine Firma. */
export const OWNER = 'Michi Frey';

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
 * Für eine private, nicht-kommerzielle Seite verlangt weder das schweizerische
 * UWG (Art. 3 Abs. 1 lit. s gilt dem elektronischen Geschäftsverkehr) noch das
 * deutsche DDG (§ 5 gilt geschäftsmässigen Angeboten) zwingend eine Anschrift;
 * Name und ein erreichbarer Kontakt genügen. Sobald hier Geld fliesst –
 * Spenden, Werbung, ein Verkauf –, ändert sich das: dann gehört die Anschrift
 * dazu, und dann trägt man sie hier ein.
 *
 *     export const ADDRESS: readonly string[] | null = ['Musterweg 1', '8000 Zürich', 'Schweiz'];
 *
 * Die Seite blendet den Block aus, solange hier `null` steht – lieber keine
 * Zeile als eine erfundene.
 */
export const ADDRESS: readonly string[] | null = null;

/** Die Seite selbst – Anzeigename und Adresse getrennt, `www.` will niemand lesen. */
export const SITE = { label: 'www.biblemap.ch', url: 'https://www.biblemap.ch' };

/**
 * Wer die Seite ausliefert. Gehört ins Impressum, weil dort die einzigen
 * Daten anfallen, die überhaupt anfallen: die Zugriffe im Serverprotokoll.
 */
export const HOST = { name: 'GitHub Pages (GitHub, Inc., USA)', url: 'https://docs.github.com/en/pages' };
