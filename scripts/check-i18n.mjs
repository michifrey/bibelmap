// Steht in der englischen Oberfläche noch Deutsch?
//
//   npm run dev                              # in einem Fenster
//   node scripts/check-i18n.mjs              # in einem zweiten
//   node scripts/check-i18n.mjs http://localhost:4173
//   node scripts/check-i18n.mjs http://localhost:4173 de   # Gegenprobe
//
// Die App sagt von sich, sie sei zweisprachig. Das stimmte für alles, was
// jemand bewusst übersetzt hat – und nicht für das, was nebenbei entstand.
// Gemessen standen 28 deutsche Reste in der englischen Oberfläche, der
// häufigste in **jeder** Ansicht mit Karte: „· Orte: OpenBible.info",
// „· Routen: schematisch", „Orte der Kirchenväter & Konzilien: schematisch".
// Sichtbar ist so etwas nur dem, der die Sprache umschaltet und hinsieht.
//
// Braucht Playwright (`npm i -D playwright`), das das Projekt sonst nicht
// benutzt – deshalb kein npm-Skript, sondern ein Aufruf von Hand.

import { chromium } from 'playwright';

/**
 * Wörter, die es im Englischen nicht gibt. Zwei Gruppen, und die zweite kam
 * spät dazu.
 *
 * Zuerst Funktionswörter und ein paar Fachwörter der App: „Karte" wäre als
 * Name einer Kartenwahl ein Fehlalarm, „und" ist keiner.
 *
 * Dann **deutsche Formen fremder Eigennamen**. Die fehlten, und die Lücke war
 * teuer: In der Kirchengeschichte standen Ortsname und Konzilname als je *ein*
 * Feld und gingen unverändert in beide Oberflächen – auf Englisch also
 * „Mailand", „Karthago", „Betlehem", „Konstantinopel", „Vatikanum I",
 * „Laterankonzil IV". 24 Einträge, und die Prüfung meldete davon **einen**,
 * und den nur zufällig, weil „Mar Saba bei Jerusalem" das Wörtchen „bei"
 * enthielt. Eine Prüfung sieht nur, wonach sie sucht.
 *
 * Kein `\b` als Grenze, sondern eine, die auch den Bindestrich ausschließt:
 * das Ortsregister enthält „Beth-zur", und `\bzur\b` hielt das für ein
 * deutsches „zur". Ein Wort in einem Namen ist kein Wort.
 */
const DEUTSCH =
  /(?<![-\w])(und|oder|nicht|wird|werden|sind|waren|eine|einen|einer|dem|den|des|der|die|das|mit|von|für|auf|aus|zum|zur|bei|nach|über|unter|zwischen|durch|ohne|gegen|noch|schon|kein|keine|mehr|hier|dort|diese|dieser|dieses|jeder|jede|alle|Orte|Reise|Reisen|Kapitel|Erwähnungen|Stationen|Tagesmärsche|Luftlinie|schematisch|Konzilien|Kirchenväter|Mitwirkende|Freiwillige|Universität|Mailand|Karthago|Betlehem|Konstantinopel|Nicäa|Trient|Florenz|Konstanz|Antiochia|Nazianz|Kappadokien|Vatikanum|Laterankonzil|Apostelkonzil|Ägypten|Rom(?!\.?\s*\d)|Kirche|Konzil|Konzilien|Bischof|Bischöfe|Jahrhundert|Jahrhunderts)(?![-\w])/;

const ANSICHTEN = [
  '',
  '#karte',
  '#ort=a15257a',
  '#reise=exodus,2',
  '#mission=journeys,second',
  '#mission=modern',
  '#quiz',
  '#lesen=Acts,13',
  '#stammbaum=gebiete,juda',
  '#graph',
  '#kirche=vater,augustinus',
  '#kirche=zeit,thesen',
  '#kirche=konzil,chalcedon',
  '#jesus=passion',
  '#jesus=mensch,petrus',
  '#israel',
  '#vergleich=abraham',
  '#hoeren',
  '#weg=a15257a,a112427',
  '#heilsgeschichte=exodus',
  '#gelaende',
  '#register',
  '#unterstuetzen',
  '#nachweise',
];

/**
 * Was gelesen wird und was nicht.
 *
 * Nicht alles Deutsche ist ein Fehler: die Folgen von bibletunes.de heißen auf
 * Deutsch, weil sie deutsch sind. Einen echten Titel zu übersetzen wäre eine
 * Fälschung, kein Dienst – solche Stellen tragen darum ein `lang="de"`, und
 * das ist zugleich das, was ein Screenreader braucht, um sie richtig
 * auszusprechen. Wer eine Ausnahme braucht, setzt `lang` und begründet es dort.
 */
const suchen = (quelle) => {
  const re = new RegExp(quelle);
  const sichtbar = (el) => el.getClientRects().length > 0 && !el.closest('[inert]');
  /*
   * Fremdsprachig ist, was ein eigenes `lang` trägt, das von dem der Seite
   * abweicht – nicht, was irgendein `lang` trägt. Beim ersten Versuch stand
   * hier `closest('[lang="de"]')`, und auf der deutschen Oberfläche traf das
   * die Wurzel `<html lang="de">`: die Prüfung übersprang alles und meldete
   * null Funde. Erst die Gegenprobe hat das gezeigt.
   */
  const seite = document.documentElement.getAttribute('lang');
  const fremd = (el) => {
    const nah = el.closest('[lang]');
    return !!nah && nah !== document.documentElement && nah.getAttribute('lang') !== seite;
  };
  const out = [];
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n = w.nextNode(); n; n = w.nextNode()) {
    const txt = (n.textContent || '').replace(/\s+/g, ' ').trim();
    if (txt.length < 4 || !re.test(txt)) continue;
    const el = n.parentElement;
    if (!el || !sichtbar(el) || fremd(el)) continue;
    out.push(txt.slice(0, 58));
  }
  // Auch die Beschriftungen, die niemand sieht und jeder Screenreader liest.
  for (const el of document.querySelectorAll('[aria-label], [title], [placeholder]')) {
    if (!sichtbar(el) || fremd(el)) continue;
    for (const attr of ['aria-label', 'title', 'placeholder']) {
      const v = el.getAttribute(attr);
      if (v && re.test(v)) out.push(`${attr}: ${v.slice(0, 46)}`);
    }
  }
  return [...new Set(out)];
};

const base = process.argv[2] ?? 'http://localhost:5173';
// Zweites Argument „de": Gegenprobe. Eine Prüfung, die nie etwas findet, ist
// nicht dasselbe wie eine Oberfläche ohne Fehler.
const sprache = process.argv[3] === 'de' ? 'de' : 'en';

// Wie in `a11y-contrast.mjs`: Wer einen eigenen Chromium hat (Distribution,
// CI-Abbild, vorinstallierter Browser), gibt ihn über CHROME_PATH an, statt
// Playwright einen zweiten herunterladen zu lassen.
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
const ctx = await b.newContext({
  locale: sprache === 'de' ? 'de-DE' : 'en-US',
  viewport: { width: 1440, height: 950 },
});
const p = await ctx.newPage();
await p.addInitScript((l) => localStorage.setItem('bibelmap:lang', l), sprache);

console.log(
  sprache === 'de'
    ? 'Gegenprobe auf Deutsch – hier MUSS Deutsch stehen:'
    : 'Auf Englisch – steht noch Deutsch da?',
);
let offen = 0;
for (const hash of ANSICHTEN) {
  await p.goto(base + '/' + hash, { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(3200);
  const funde = await p.evaluate(suchen, DEUTSCH.source);
  offen += funde.length;
  console.log(
    (hash || '(Startseite)').padEnd(26),
    funde.length ? `${funde.length}: ${funde.slice(0, 3).join(' | ')}` : '✓',
  );
}
await b.close();

if (sprache === 'de') {
  console.log(`\n${offen} deutsche Stellen gefunden.`);
  // Findet die Prüfung auf Deutsch nichts, prüft sie nichts.
  process.exit(offen > 0 ? 0 : 1);
}
console.log(offen ? `\n${offen} deutsche Reste in der englischen Oberfläche.` : '\nKein deutscher Rest.');
process.exit(offen ? 1 : 0);
