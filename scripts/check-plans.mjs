// Prüft die Leseplläne – die gerechneten und die verlinkten.
//
//   node --experimental-strip-types --import ./scripts/lib/ts-loader.mjs scripts/check-plans.mjs
//   npm run check:plans
//   npm run check:plans -- --gegenprobe
//
// **Warum ein Leseplan geprüft gehört.** Er ist eine Liste von Kapitelspannen,
// und eine Lücke darin sieht niemand. Ein Plan, der Kapitel 24 zweimal nennt
// und Kapitel 31 gar nicht, liest sich tagelang völlig richtig – bis jemand
// merkt, dass er ein Kapitel nie gelesen hat. Das ist kein Absturz, den ein
// Fehlerbericht meldet, sondern ein stiller Schaden an genau der Sache, für
// die die Ansicht da ist.
//
// Gerechnet wird in `src/lib/readingPlan.ts`, und **diese Prüfung rechnet
// nicht nach, sondern prüft dieselbe Funktion**, die die Oberfläche benutzt:
// für alle 66 Bücher und jede Tageszahl, die die Ansicht anbietet. Das sind
// keine Stichproben – es ist billig genug, alles durchzurechnen.
//
// Die zweite Hälfte sind die fremden Pläne in `src/data/readingPlans.ts`.
// Hier wird geprüft, was ohne Netz prüfbar ist: beide Sprachen gefüllt, jede
// Adresse eine https-Adresse, und `only` stimmt mit den Adressen überein. Ob
// eine Adresse noch irgendwohin führt, sagt `npm run check:urls` – täglich,
// im Lauf „Agent – Links".

import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { BOOKS } = await import(path.join(ROOT, 'src/data/books.ts'));
const { PORTRAITS } = await import(path.join(ROOT, 'src/data/bookPortraits.ts'));
const { READING_PLANS, PLAN_INDEX, planUrl } = await import(path.join(ROOT, 'src/data/readingPlans.ts'));
const { covers, daySteps, planByDays, planFromMovements } = await import(
  path.join(ROOT, 'src/lib/readingPlan.ts')
);

/** Untergrenze, unter der sich die Prüfung selbst für kaputt erklärt. */
if (BOOKS.length !== 66 || !READING_PLANS.length) {
  console.error(`✗ ${BOOKS.length} Bücher, ${READING_PLANS.length} verlinkte Pläne – das ist keine Prüfung, das ist eine leere Quelle.`);
  process.exit(1);
}

const gegenprobe = process.argv.includes('--gegenprobe');

/**
 * Die gerechneten Pläne. `buecher` und `portraits` kommen als Argumente, weil
 * die Gegenprobe der Prüfung kaputte Daten vorlegen können muss.
 */
export function pruefeGerechnet(buecher, portraits) {
  const funde = [];
  let plaene = 0;

  for (const b of buecher) {
    // Jede Tageszahl, die die Ansicht anbietet – und dazu die Ränder: ein Tag
    // (alles auf einmal) und so viele Tage wie Kapitel (ein Kapitel am Tag).
    for (const tage of [...new Set([1, ...daySteps(b.chapters), b.chapters])]) {
      const plan = planByDays(b.chapters, tage);
      plaene++;
      for (const f of covers(plan, b.chapters)) {
        funde.push(`${b.osis} in ${tage} Tagen: ${f}`);
      }
      if (plan.length !== Math.min(tage, b.chapters)) {
        funde.push(`${b.osis} in ${tage} Tagen: der Plan hat ${plan.length} Tage.`);
      }
      // Kein Tag darf mehr als einen Tag über dem Schnitt liegen – sonst ist
      // der Plan zwar lückenlos, aber nicht gleichmäßig, und „in 30 Tagen"
      // hieße: 29 leichte Tage und einer mit dem halben Buch.
      const laengen = plan.map((d) => d.chapters);
      if (Math.max(...laengen) - Math.min(...laengen) > 1) {
        funde.push(`${b.osis} in ${tage} Tagen: ungleich verteilt (${Math.min(...laengen)}–${Math.max(...laengen)} Kapitel).`);
      }
    }
    // Mehr Tage als Kapitel: der Plan wird geklemmt, statt leere Tage zu bauen.
    const zuviel = planByDays(b.chapters, b.chapters + 5);
    if (zuviel.length !== b.chapters || zuviel.some((d) => d.chapters < 1)) {
      funde.push(`${b.osis}: mehr Tage als Kapitel ergibt ${zuviel.length} Tage statt ${b.chapters}.`);
    }
  }

  for (const p of portraits) {
    const buch = buecher.find((b) => b.osis === p.osis);
    if (!buch) continue;
    const plan = planFromMovements(p.movements);
    plaene++;
    for (const f of covers(plan, buch.chapters)) {
      funde.push(`${p.osis} nach den Zügen: ${f}`);
    }
    if (plan.some((d) => !d.title?.de?.trim() || !d.title?.en?.trim())) {
      funde.push(`${p.osis} nach den Zügen: ein Tag ohne Titel – der Plan lebt davon, dass jeder Tag einen Namen hat.`);
    }
  }

  return { funde, plaene };
}

/** Die verlinkten Pläne – alles, was ohne Netz prüfbar ist. */
export function pruefeVerlinkt(plaene) {
  const funde = [];
  const gesehen = new Set();

  for (const p of plaene) {
    const wo = `${p.id} („${p.title?.de ?? '?'}")`;
    if (gesehen.has(p.id)) funde.push(`${wo}: Kennung kommt zweimal vor.`);
    gesehen.add(p.id);

    if (!p.provider?.trim()) funde.push(`${wo}: kein Anbieter – ein Plan ohne Urheber ist kein Verweis.`);
    for (const [feld, wert] of [
      ['title.de', p.title?.de], ['title.en', p.title?.en],
      ['duration.de', p.duration?.de], ['duration.en', p.duration?.en],
      ['what.de', p.what?.de], ['what.en', p.what?.en],
    ]) {
      if (!wert?.trim()) funde.push(`${wo}: ${feld} fehlt.`);
    }

    for (const sprache of ['de', 'en']) {
      const url = p.url?.[sprache];
      if (!url?.startsWith('https://')) {
        funde.push(`${wo}: die Adresse für ${sprache} ist keine https-Adresse.`);
        continue;
      }
      if (planUrl(p, sprache) !== url) funde.push(`${wo}: planUrl() liefert für ${sprache} etwas anderes.`);
    }

    // `only` ist eine Aussage: „diesen Plan gibt es nur so". Dann müssen beide
    // Adressen dieselbe sein – sonst behauptet der Eintrag das Gegenteil von
    // dem, was er anzeigt.
    if (p.only && p.url?.de !== p.url?.en) {
      funde.push(`${wo}: only „${p.only}", aber zwei verschiedene Adressen.`);
    }
    if (!p.only && p.url?.de === p.url?.en) {
      funde.push(`${wo}: beide Sprachen zeigen auf dieselbe Adresse – dann gehört „only" daran.`);
    }
  }

  for (const sprache of ['de', 'en']) {
    if (!PLAN_INDEX[sprache]?.startsWith('https://')) funde.push(`PLAN_INDEX: ${sprache} fehlt oder ist keine https-Adresse.`);
  }
  return funde;
}

const { funde: gerechnet, plaene } = pruefeGerechnet(BOOKS, PORTRAITS);
const verlinkt = pruefeVerlinkt(READING_PLANS);

if (gegenprobe) {
  // Vier eingebaute Fehler, je einer pro Regel.
  const proben = [
    ['Loch im Plan', /Kapitel ohne Tag/, () =>
      pruefeGerechnet([{ osis: 'Test', chapters: 10 }], [
        { osis: 'Test', movements: [{ from: 1, to: 4, title: { de: 'a', en: 'a' } }, { from: 6, to: 10, title: { de: 'b', en: 'b' } }] },
      ]).funde],
    ['Kapitel zweimal', /Kapitel an mehreren Tagen/, () =>
      pruefeGerechnet([{ osis: 'Test', chapters: 10 }], [
        { osis: 'Test', movements: [{ from: 1, to: 6, title: { de: 'a', en: 'a' } }, { from: 5, to: 10, title: { de: 'b', en: 'b' } }] },
      ]).funde],
    ['Plan ohne Anbieter', /kein Anbieter/, () =>
      pruefeVerlinkt([{ ...READING_PLANS[0], provider: '' }])],
    ['Adresse geraten', /keine https-Adresse/, () =>
      pruefeVerlinkt([{ ...READING_PLANS[0], url: { de: 'bible.com/irgendwas', en: READING_PLANS[0].url.en } }])],
  ];
  let gut = 0;
  for (const [name, muster, lauf] of proben) {
    const meldungen = lauf();
    if (meldungen.some((m) => muster.test(m))) gut++;
    else console.log(`  ✗ ${name}: ${meldungen.length ? 'gemeldet, aber falsch: ' + meldungen[0] : 'gar nicht gemeldet'}`);
  }
  console.log(`Gegenprobe: ${gut} von ${proben.length} Proben mit der erwarteten Meldung.`);
  console.log(
    gut === proben.length
      ? '✓ Die Prüfung schlägt bei jedem eingebauten Fehler an – und aus dem richtigen Grund.'
      : '✗ Mindestens eine Probe belegt nicht, was sie soll.',
  );
  process.exit(gut === proben.length ? 0 : 1);
}

const alle = [...gerechnet, ...verlinkt];
console.log(`Gerechnet:  ${plaene} Pläne über ${BOOKS.length} Bücher – jedes Kapitel genau einmal, gleichmäßig verteilt`);
console.log(`Verlinkt:   ${READING_PLANS.length} fremde Pläne von ${new Set(READING_PLANS.map((p) => p.provider)).size} Anbietern, alle zweisprachig`);

if (alle.length) {
  console.error(`\n✗ ${alle.length} Beanstandung${alle.length === 1 ? '' : 'en'}:`);
  for (const f of alle.slice(0, 12)) console.error('   · ' + f);
  process.exit(1);
}
console.log(
  '\n✓ Jeder gerechnete Plan deckt sein Buch lückenlos ab, und jeder verlinkte nennt Anbieter, Dauer und Adresse in beiden Sprachen.',
);
