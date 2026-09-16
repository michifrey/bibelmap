// Funktioniert die App wirklich ohne Netz?
//
//   npm run build && npx vite preview --port 4173
//   CHROME_PATH=/usr/bin/chromium node scripts/check-offline.mjs http://localhost:4173
//
// „Offline vollständig benutzbar" steht in der PRD unter den nicht-funktionalen
// Anforderungen und im README. Geprüft hat es nichts. Dabei ist es die
// Eigenschaft, die am leisesten kaputtgeht: Der Service Worker legt keine Liste
// an, sondern speichert, was einmal geladen wurde – wer eine Datei erst auf
// Klick lädt, hat sie offline nicht, und im Netz merkt das niemand.
//
// Braucht Playwright und einen **gebauten** Stand: Der Service Worker meldet
// sich nur in der Produktionsfassung an (`import.meta.env.PROD`).
//
// **Warum jede Ansicht sagen muss, woran man sie erkennt.** Der erste Entwurf
// zählte nur Zeichen: unter 150 galt als kaputt. Das hat einen Ausfall
// durchgewinkt. Ein Vollbild-Modus liegt über der Karte, und die Karte ist
// gesprächig – ihre Beschriftungen allein sind über 4.000 Zeichen. Lädt der
// Modus nicht, sieht man die Karte statt seiner, und die Zählung ist trotzdem
// zufrieden. Gemessen an `#fahrplan`, dessen Paket gar nicht vorabgerufen
// wurde: 4.346 Zeichen, „ohne Netz vollständig" – und kein Fahrplan.
//
// Darum nennt jede Ansicht hier eine Zeichenfolge, die **nur** sie zeigt. Die
// beiden reinen Kartenansichten haben keine; dort bleibt die Zählung das
// Einzige, was es zu prüfen gibt.
//
// **Warum `setOffline` allein nicht reicht.** Es schaltet die Seite ab, nicht
// den Service Worker. Nachgemessen: Nach dem ersten Seitenaufruf im
// abgeschalteten Zustand wird der Worker neu gestartet – und der neue erbt die
// Abschaltung nicht. Ein `fetch` auf eine ungecachte Adresse lieferte danach
// eine **200**, und ein Paket, das nie vorabgerufen wurde, landete **während**
// des Offline-Besuchs im Cache: Der Worker hatte es geholt. Ein grüner Lauf
// hiess damit „die Ansicht erscheint", nicht „sie lag im Cache".
//
// Was es kostete: **sieben Ansichten** standen jahrelang auf grün, deren Paket
// gar nicht im Cache lag – Register, Graph, Israel, Eigener Weg, Unterstützen,
// Nachweise und Gelände. Der Worker holte sie sich still aus dem Netz, das es
// angeblich nicht gab.
//
// Darum wird zusätzlich **jede Anfrage abgewiesen** (`context.route`). Das
// erwischt auch die des Workers: Gemessen fällt damit genau das aus, was nicht
// im Cache liegt, und genau das bleibt stehen, was drin liegt. `setOffline`
// steht weiter dabei – es kostet nichts und sagt, was gemeint ist.
//
// **Und jede Ansicht bekommt eine frische Seite.** Sonst vergiftet die erste,
// die ausfällt, den ganzen Rest: Gemessen bestanden nach einem Ausfall auf
// derselben Seite auch `#quiz`, `#hoeren` und `#fahrplan` nicht mehr, obwohl
// ihre Pakete im Cache lagen. Mit frischer Seite je Ansicht fallen genau die
// beiden ungecachten aus und sonst nichts – das ist der Unterschied zwischen
// einer Prüfung, die eine Liste meldet, und einer, die einen Dominostein
// meldet.

import { chromium } from 'playwright';

const ANSICHTEN = [
  { hash: '', zeigt: 'Sechs Wege hinein' },
  { hash: '#karte' },
  { hash: '#ort=a15257a', zeigt: 'Jerusalem' },
  { hash: '#register', zeigt: 'Ortsregister' },
  { hash: '#reise=exodus,2', zeigt: 'Reisen & Geschichten' },
  { hash: '#heilsgeschichte=sinai', zeigt: 'Heilsgeschichte' },
  { hash: '#kirche=vater,augustinus', zeigt: 'Kirchengeschichte' },
  { hash: '#kirche=konzil,chalcedon', zeigt: 'Kirchengeschichte' },
  { hash: '#stammbaum=gebiete,juda', zeigt: 'Stammesgebiete' },
  { hash: '#graph', zeigt: 'Verweis-Graph' },
  { hash: '#jesus=passion', zeigt: 'Jesus – Leben und Wege' },
  { hash: '#israel', zeigt: 'Israel: Land, Staat, Konflikt' },
  { hash: '#mission=modern', zeigt: 'Mission & Ausbreitung' },
  { hash: '#vergleich=abraham', zeigt: 'Religionen im Vergleich' },
  { hash: '#feste=sukkot', zeigt: 'Feste Israels' },
  { hash: '#regal=buch,Dan', zeigt: 'Das Bücherregal' },
  { hash: '#quiz', zeigt: 'Bibelquiz' },
  { hash: '#hoeren', zeigt: 'Hören & Sehen' },
  { hash: '#weg=a15257a,a112427', zeigt: 'Eigener Weg' },
  {
    hash: '#gelaende',
    zeigt: 'Höhen',
    // Als einzige Ansicht nicht vorabgerufen: Das Paket wiegt mit MapLibre
    // 243 kB gzip, und wer nie ins Gelände geht, soll das nicht holen. Die
    // Zusage ist hier eine andere – „einmal geöffnet, danach ohne Netz da" –,
    // und genau die wird geprüft: Diese Ansicht wird vorher einmal **mit** Netz
    // besucht, danach zählt sie wie jede andere.
    aufAbruf: true,
  },
  { hash: '#unterstuetzen', zeigt: 'von fremder Arbeit' },
  { hash: '#nachweise', zeigt: 'Lizenz' },
  { hash: '#fahrplan', zeigt: 'Hier stehen wir' },
];

/** So lange bekommt der Vorabruf im Leerlauf Zeit, alles zu holen. */
const WARTEN_MS = 22000;

const base = process.argv[2] ?? 'http://localhost:4173';
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });

async function lauf({ cacheLeeren = false } = {}) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 950 }, locale: 'de-DE', serviceWorkers: 'allow' });
  let p = await ctx.newPage();
  const js = [];
  p.on('pageerror', (e) => js.push(String(e).slice(0, 150)));

  await p.goto(base + '/', { waitUntil: 'domcontentloaded' });
  const sw = await p.evaluate(async () => {
    if (!('serviceWorker' in navigator)) return null;
    const r = await navigator.serviceWorker.ready.catch(() => null);
    return r?.active ? 'aktiv' : r ? 'angemeldet' : null;
  });
  await p.waitForTimeout(WARTEN_MS);

  // Was auf Abruf kommt, wird einmal geöffnet – das ist die Zusage, die für
  // diese Ansichten gilt. Vor dem Leeren des Caches, damit die Gegenprobe auch
  // sie wegräumt.
  for (const { hash } of ANSICHTEN.filter((a) => a.aufAbruf)) {
    await p.goto(base + '/' + hash, { waitUntil: 'domcontentloaded' }).catch(() => {});
    await p.waitForTimeout(4000);
  }

  /*
   * Für die Gegenprobe: Cache leeren und den Worker abmelden. Danach muss
   * offline alles ausfallen – sonst bedient irgendetwas anderes die Seite,
   * und diese Datei misst nicht, was sie zu messen vorgibt.
   */
  if (cacheLeeren) {
    await p.evaluate(async () => {
      for (const k of await window.caches.keys()) await window.caches.delete(k);
      for (const r of await navigator.serviceWorker.getRegistrations()) await r.unregister();
    });
  }

  const caches = await p.evaluate(async () => {
    const namen = await window.caches.keys();
    const out = {};
    for (const k of namen) out[k] = (await (await window.caches.open(k)).keys()).length;
    return out;
  });

  // Abweisen statt nur abschalten – siehe Kopf der Datei. Beides zusammen,
  // damit auch `navigator.onLine` sagt, was gilt.
  await ctx.route('**/*', (route) => route.abort());
  await ctx.setOffline(true);
  const kaputt = [];
  for (const { hash, zeigt } of ANSICHTEN) {
    // Frische Seite – siehe Kopf der Datei.
    await p.close();
    p = await ctx.newPage();
    p.on('pageerror', (e) => js.push(String(e).slice(0, 150)));
    await p.goto(base + '/' + hash, { waitUntil: 'domcontentloaded' }).catch(() => {});
    await p.waitForTimeout(2600);
    const r = await p.evaluate((suche) => {
      const t = document.body.innerText;
      return {
        zeichen: t.replace(/\s+/g, '').length,
        laden: /Lade biblische|Loading biblical/.test(t),
        // Leerraum zusammenziehen: `innerText` bricht Überschriften um, und
        // „Jesus – Leben\nund Wege" enthält den gesuchten Satz sonst nicht.
        zeigt: suche ? t.replace(/\s+/g, ' ').toLowerCase().includes(suche.toLowerCase()) : true,
      };
    }, zeigt ?? null);
    const name = hash || '(Startseite)';
    if (r.laden) kaputt.push(`${name} (Ladebildschirm)`);
    else if (r.zeichen < 150) kaputt.push(`${name} (${r.zeichen} Zeichen)`);
    else if (!r.zeigt) kaputt.push(`${name} (${r.zeichen} Zeichen, aber „${zeigt}" fehlt)`);
  }
  await ctx.close();
  return { sw, caches, kaputt, js: [...new Set(js)] };
}

const echt = await lauf();
console.log('Service Worker:', echt.sw ?? '(keiner – ist das ein gebauter Stand?)');
console.log('Im Cache:      ', Object.entries(echt.caches).map(([k, n]) => `${k}: ${n} Dateien`).join(' · ') || '(nichts)');
console.log();
for (const { hash } of ANSICHTEN) {
  const name = hash || '(Startseite)';
  const hin = echt.kaputt.find((k) => k.startsWith(name));
  console.log(' ', hin ? '✗' : '✓', name.padEnd(28), hin ? hin.slice(name.length).trim() : 'ohne Netz vollständig');
}
if (echt.js.length) console.log('\nJS-Fehler:', echt.js.slice(0, 3));

/*
 * Gegenprobe. Ohne sie hieße „alles grün" womöglich nur, dass der Browser aus
 * seinem eigenen Speicher bedient – dann prüfte diese Datei gar nichts.
 *
 * Der erste Entwurf ließ dafür bloß die Wartezeit weg. Das unterschied nichts:
 * auf einem lokalen Server ist der Vorabruf ohnehin durch, ehe man abschaltet,
 * und die Gegenprobe meldete 0 von 20 Ausfällen. Jetzt wird der Cache geleert
 * und der Worker abgemeldet – dann muss offline alles ausfallen.
 */
const roh = await lauf({ cacheLeeren: true });
console.log(`\nGegenprobe mit geleertem Cache: ${roh.kaputt.length} von ${ANSICHTEN.length} Ansichten fallen aus.`);
// Was die Gegenprobe überlebt, gehört benannt: Es kommt dann nicht aus dem
// Cache des Workers, sondern aus dem des Browsers – und ist damit kein Beleg
// für irgendetwas.
const steht = ANSICHTEN.map((a) => a.hash || '(Startseite)').filter(
  (n) => !roh.kaputt.some((k) => k.startsWith(n)),
);
if (steht.length) console.log(`Steht trotzdem (Browser-Cache, nicht Worker): ${steht.join(', ')}`);
await b.close();

if (echt.kaputt.length) {
  console.error(`\n✗ ${echt.kaputt.length} Ansichten funktionieren ohne Netz nicht:`);
  for (const k of echt.kaputt) console.error('   ' + k);
  process.exit(1);
}
if (roh.kaputt.length < ANSICHTEN.length / 2) {
  console.error('\n✗ Auch mit geleertem Cache steht fast alles – dann misst diese Prüfung nicht den Cache.');
  process.exit(1);
}
console.log(`\nAlle ${ANSICHTEN.length} Ansichten funktionieren ohne Netz.`);
