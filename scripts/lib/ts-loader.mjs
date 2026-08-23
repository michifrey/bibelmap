/**
 * Damit die Prüfungen den echten Code lesen können.
 *
 * Bisher lasen `check-tribes.mjs` und `check-contrast.mjs` die Daten mit
 * regulären Ausdrücken aus dem Quelltext – „damit das Skript ohne
 * Übersetzungsschritt läuft". Das hat einen Preis: Als `BP_GUIDE_OVERRIDE` aus
 * `books.ts` in eine JSON-Datei umzog, fand der Ausdruck nichts mehr und die
 * Prüfung lief still weiter, als wäre alles in Ordnung. Eine Prüfung, die ihre
 * Quelle verliert, meldet keinen Fehler – sie meldet gar nichts.
 *
 * Node 22 versteht TypeScript selbst (`--experimental-strip-types`); was fehlt,
 * ist die Auflösung endungsloser Importe, wie sie Bundler erlauben. Genau das
 * ergänzt dieser Haken: `'../data/journeys'` → `../data/journeys.ts`.
 *
 * Aufruf:
 *   node --experimental-strip-types --import ./scripts/lib/ts-loader.mjs skript.mjs
 */
import { register } from 'node:module';
import { pathToFileURL } from 'node:url';

register(
  'data:text/javascript,' +
    encodeURIComponent(`
      import { existsSync } from 'node:fs';
      import { fileURLToPath } from 'node:url';

      const KANDIDATEN = ['.ts', '.tsx', '/index.ts'];

      export async function resolve(specifier, context, next) {
        // Bundler erlauben \`import x from './y.json'\` ohne Weiteres; Node
        // verlangt die Angabe der Art. Nachgereicht statt den Quelltext zu
        // ändern – die App soll für die Prüfung nichts tun müssen.
        if (specifier.endsWith('.json')) {
          const auf = await next(specifier, { ...context, importAttributes: { type: 'json' } });
          return { ...auf, importAttributes: { type: 'json' } };
        }
        try {
          return await next(specifier, context);
        } catch (err) {
          // Nur relative Importe ergänzen; ein fehlendes Paket bleibt ein
          // fehlendes Paket.
          if (!specifier.startsWith('.') || !context.parentURL) throw err;
          for (const endung of KANDIDATEN) {
            const url = new URL(specifier + endung, context.parentURL);
            if (existsSync(fileURLToPath(url))) return next(specifier + endung, context);
          }
          throw err;
        }
      }
    `),
  pathToFileURL('./'),
);
