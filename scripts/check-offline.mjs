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
// **Und was diese Datei nicht beweist.** `context.setOffline(true)` schaltet
// die Seite ab, nicht den Service Worker. Nachgemessen: Im abgeschalteten
// Zustand liefert ein `fetch` auf eine ungecachte Adresse trotzdem eine 200,
// und ein Paket, das nie vorabgerufen wurde, landet **während** des
// Offline-Besuchs im Cache – der Worker hat es geholt. Ein grüner Lauf heisst
// also: „die Ansicht erscheint, wenn die Seite kein Netz hat" – nicht: „alles
// dafür lag schon im Cache".
//
// Die Blockade dichtzumachen ist nicht damit getan, `context.route` alles
// abweisen zu lassen: Der Worker beantwortet eigene Dateien aus dem Cache und
// den Seitenaufruf erst aus dem Netz, und ein abgerissener Aufruf nimmt ihm
// beides – gemessen fiel damit auch aus, was längst im Cache lag. Das gehört
// sauber gelöst, nicht nebenbei; bis dahin steht hier, woran man ist.

import { chromium } from 'playwright';

const ANSICHTEN = [
  { hash: '', zeigt: 'Fünf Wege hinein' },
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
  { hash: '#quiz', zeigt: 'Bibelquiz' },
  { hash: '#hoeren', zeigt: 'Hören & Sehen' },
  { hash: '#weg=a15257a,a112427', zeigt: 'Eigener Weg' },
  { hash: '#gelaende', zeigt: 'Höhen' },
  { hash: '#unterstuetzen', zeigt: 'von fremder Arbeit' },
  { hash: '#nachweise', zeigt: 'Lizenz' },
  { hash: '#fahrplan', zeigt: 'Hier stehen wir' },
];

/** So lange bekommt der Vorabruf im Leerlauf Zeit, alles zu holen. */
const WARTEN_MS = 22000;

const base = process.argv[2] ?? 'http://localhost:4173';
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });

async function lauf({ cacheLeeren = false } = {}) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 950 }, locale: 'de-DE' });
  const p = await ctx.newPage();
  const js = [];
  p.on('pageerror', (e) => js.push(String(e).slice(0, 150)));

  await p.goto(base + '/', { waitUntil: 'domcontentloaded' });
  const sw = await p.evaluate(async () => {
    if (!('serviceWorker' in navigator)) return null;
    const r = await navigator.serviceWorker.ready.catch(() => null);
    return r?.active ? 'aktiv' : r ? 'angemeldet' : null;
  });
  await p.waitForTimeout(WARTEN_MS);

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

  await ctx.setOffline(true);
  const kaputt = [];
  for (const { hash, zeigt } of ANSICHTEN) {
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
