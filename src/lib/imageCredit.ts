import type { Lang } from '../i18n';

/**
 * Bildnachweis: aus dem Kürzel, das in den Daten steht (`CC-BY-SA-4.0`), wird
 * der Name, den die Lizenz selbst benutzt, samt Link auf ihren Text.
 *
 * Warum überhaupt: die Bilder stammen von Wikimedia Commons und stehen fast
 * alle unter einer Lizenz, die Urhebernennung *und* Lizenznennung verlangt.
 * Ein „© Name" allein erfüllt das nicht.
 */

const CC = 'https://creativecommons.org/licenses';

interface License {
  label: string;
  url: string | null;
  /** Was die Lizenz von uns verlangt – kurz, für den Titel des Links. */
  de: string;
  en: string;
}

const SHARE_ALIKE = {
  de: 'Namensnennung, Weitergabe unter gleichen Bedingungen',
  en: 'Attribution, share alike',
};
const BY = { de: 'Namensnennung', en: 'Attribution' };
const FREE = { de: 'gemeinfrei – keine Auflagen', en: 'public domain – no conditions' };
const CODE_BY = {
  de: 'Namensnennung: Lizenztext und Urheberzeile müssen mitgehen',
  en: 'Attribution: the licence text and copyright line have to travel along',
};

function cc(version: string, sa: boolean, port = ''): License {
  const kind = sa ? 'by-sa' : 'by';
  return {
    label: `CC ${sa ? 'BY-SA' : 'BY'} ${version}${port ? ` ${port}` : ''}`,
    url: `${CC}/${kind}/${version}/${port ? `${port.toLowerCase()}/` : ''}`,
    ...(sa ? SHARE_ALIKE : BY),
  };
}

const LICENSES: Record<string, License> = {
  'CC-BY-SA-4.0': cc('4.0', true),
  'CC-BY-SA-3.0': cc('3.0', true),
  'CC-BY-SA-2.5': cc('2.5', true),
  'CC-BY-SA-2.0': cc('2.0', true),
  'CC-BY-SA-3.0-DE': cc('3.0', true, 'DE'),
  'CC-BY-SA-3.0-IGO': {
    label: 'CC BY-SA 3.0 IGO',
    url: `${CC}/by-sa/3.0/igo/`,
    ...SHARE_ALIKE,
  },
  'CC-BY-4.0': cc('4.0', false),
  'CC-BY-3.0': cc('3.0', false),
  'CC-BY-2.5': cc('2.5', false),
  'CC-BY-2.0': cc('2.0', false),
  'CC-Zero': {
    label: 'CC0',
    url: 'https://creativecommons.org/publicdomain/zero/1.0/',
    ...FREE,
  },
  CC0: {
    label: 'CC0',
    url: 'https://creativecommons.org/publicdomain/zero/1.0/',
    ...FREE,
  },
  PD: { label: 'Public Domain', url: null, ...FREE },
  GFDL: {
    label: 'GFDL',
    url: 'https://www.gnu.org/licenses/fdl-1.3.html',
    ...SHARE_ALIKE,
  },
  GPL: { label: 'GPL', url: 'https://www.gnu.org/licenses/gpl-3.0.html', ...SHARE_ALIKE },
  FAL: {
    label: 'Free Art License',
    url: 'https://artlibre.org/licence/lal/en/',
    ...SHARE_ALIKE,
  },
  'OGL-1.0': {
    label: 'OGL 1.0',
    url: 'https://www.nationalarchives.gov.uk/doc/open-government-licence/version/1/',
    ...BY,
  },
  attribution: { label: 'Attribution', url: null, ...BY },

  // Lizenzen, die nicht an Bildern hängen, sondern an Daten, Software und
  // Schriften – die Nachweisseite (`data/attribution.ts`) holt sie von hier,
  // damit Lizenznamen an einer Stelle stehen.
  'ODbL-1.0': {
    label: 'ODbL 1.0',
    url: 'https://opendatacommons.org/licenses/odbl/1-0/',
    ...SHARE_ALIKE,
  },
  'GPL-3.0': { label: 'GPL 3.0', url: 'https://www.gnu.org/licenses/gpl-3.0.html', ...SHARE_ALIKE },
  MIT: { label: 'MIT', url: 'https://opensource.org/license/mit', ...CODE_BY },
  'BSD-2-Clause': {
    label: 'BSD-2-Clause',
    url: 'https://opensource.org/license/bsd-2-clause',
    ...CODE_BY,
  },
  'Apache-2.0': { label: 'Apache 2.0', url: 'https://www.apache.org/licenses/LICENSE-2.0', ...CODE_BY },
  'Hippocratic-2.1': {
    label: 'Hippocratic 2.1',
    url: 'https://firstdonoharm.dev/version/2/1/license/',
    de: 'Namensnennung; Nutzung nur ohne Verletzung von Menschenrechten',
    en: 'Attribution; use only without violating human rights',
  },
  'OFL-1.1': {
    label: 'SIL OFL 1.1',
    url: 'https://openfontlicense.org/',
    de: 'frei nutzbar; Namensnennung beim Weitergeben der Schriftdateien',
    en: 'free to use; attribution when the font files are passed on',
  },
};

export interface Credit {
  label: string;
  url: string | null;
  hint: string;
}

/**
 * Unbekannte Kürzel werden nicht verschwiegen und nicht geraten: sie stehen
 * so da, wie sie in den Daten stehen, mit dem Verweis auf die Dateiseite.
 */
export function licenseInfo(id: string | null, lang: Lang): Credit | null {
  if (!id) return null;
  const known = LICENSES[id];
  if (known) return { label: known.label, url: known.url, hint: lang === 'de' ? known.de : known.en };
  return {
    label: id,
    url: null,
    hint: lang === 'de' ? 'Lizenz siehe Dateiseite' : 'see file page for the licence',
  };
}

/**
 * Commons schreibt seine Kürzel klein und hängt bei alten Dateien
 * „-migrated" an – die Daten aus OpenBible schreiben sie groß. Ein Schlüssel
 * für beide Wege.
 */
export function normalizeLicense(id: string | null | undefined): string | null {
  if (!id) return null;
  const up = id.toUpperCase().replace(/-MIGRATED$/, '');
  return up === 'CC-ZERO' ? 'CC-Zero' : up;
}

/**
 * Commons liefert den Urheber als HTML-Schnipsel („<a …>Name</a>"). Gebraucht
 * wird der Name; das Markup wird als Text gelesen, nie eingesetzt.
 */
export function plainText(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return (doc.body.textContent ?? '').replace(/\s+/g, ' ').trim();
}

export interface CommonsCredit {
  /** Urheber, wie ihn die Dateiseite nennt – „Wikimedia Commons", wenn sie schweigt. */
  credit: string;
  /** Lizenzkürzel, normalisiert (`CC-BY-SA-4.0`), oder null. */
  license: string | null;
  /** Dateiseite auf Commons – der Ort, an dem beides nachzulesen ist. */
  fileUrl: string;
}

/**
 * Urheber und Lizenz einer Commons-Datei. Schlägt der Aufruf fehl, bleibt es
 * beim allgemeinen Nachweis auf die Dateiseite – ein Bild ohne Nachweis zeigt
 * die App nicht. Genutzt von den Ortsbildern (Wikidata P18) und von den
 * Personen- und Dokumentbildern des Zeitbaums.
 */
export async function commonsFileCredit(file: string): Promise<CommonsCredit | null> {
  const enc = encodeURIComponent(file.replace(/ /g, '_'));
  const api = new URL('https://commons.wikimedia.org/w/api.php');
  api.search = new URLSearchParams({
    action: 'query',
    format: 'json',
    origin: '*', // CORS: ohne das antwortet die API nicht im Browser
    prop: 'imageinfo',
    iiprop: 'extmetadata',
    titles: `File:${file}`,
  }).toString();

  try {
    const r = await fetch(api);
    if (!r.ok) return null;
    const data = await r.json();
    const pages = data?.query?.pages;
    const page = pages && Object.values(pages)[0];
    const ex = (page as { imageinfo?: { extmetadata?: Record<string, { value?: string }> }[] })
      ?.imageinfo?.[0]?.extmetadata;
    if (!ex) return null;
    const artist = ex.Artist?.value ? plainText(ex.Artist.value) : '';
    return {
      credit: artist || 'Wikimedia Commons',
      license: normalizeLicense(ex.License?.value ?? ex.LicenseShortName?.value),
      fileUrl: `https://commons.wikimedia.org/wiki/File:${enc}`,
    };
  } catch {
    return null;
  }
}
