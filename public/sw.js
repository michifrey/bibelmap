/*
 * Bibelmap offline.
 *
 * Es gibt keine Liste vorab gespeicherter Dateien: Vite hängt an jeden Namen
 * einen Hash, eine gepflegte Liste wäre bei jedem Build falsch. Stattdessen
 * wandert alles, was einmal geladen wurde, in den Cache – und wird beim
 * nächsten Besuch von dort bedient, während im Hintergrund die neue Fassung
 * geholt wird.
 *
 * Kartenkacheln liegen in einem eigenen, begrenzten Cache: Wer eine Gegend
 * einmal angesehen hat, sieht sie auch ohne Netz wieder.
 */
const VERSION = 'v1';
const SHELL = `bibelmap-shell-${VERSION}`;
const TILES = `bibelmap-tiles-${VERSION}`;
const TILE_LIMIT = 600;

/** Kopfzeilen dürfen sich unterscheiden – die Adresse entscheidet. */
const MATCH = { ignoreVary: true };

const TILE_HOSTS = [
  'basemaps.cartocdn.com',
  'tiles.maps.eox.at',
  'dh.gu.se',
  'tile.openstreetmap.org',
];

/**
 * Die gebauten Dateien tragen einen Hash im Namen. Statt eine Liste zu pflegen,
 * die bei jedem Build veraltet, liest der Worker sie beim Einbau aus dem
 * Einstieg heraus – dort stehen sie ohnehin.
 */
async function shellFiles() {
  try {
    const res = await fetch('./index.html', { cache: 'reload' });
    const html = await res.text();
    const found = [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map((m) => m[1]);
    return found.filter((u) => u.includes('/assets/') || u.endsWith('.css') || u.endsWith('.js'));
  } catch {
    return [];
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(SHELL);
      // Einstieg, gebaute Dateien und die Ortsdaten. Alles Weitere – Bibeltext,
      // Medien, Bilder – kommt beim Benutzen dazu.
      const files = ['./', './index.html', './data/places.json', ...(await shellFiles())];
      await Promise.all(files.map((f) => cache.add(f).catch(() => {})));
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((k) => k.startsWith('bibelmap-') && !k.endsWith(VERSION)).map((k) => caches.delete(k)),
      );
      await self.clients.claim();
    })(),
  );
});

/** Ältere Kacheln wegwerfen, damit der Cache nicht unbegrenzt wächst. */
async function trim(cacheName, limit) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length <= limit) return;
  await Promise.all(keys.slice(0, keys.length - limit).map((k) => cache.delete(k)));
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  // Seitenaufruf: erst das Netz, sonst der zuletzt gesehene Einstieg.
  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(request);
          const cache = await caches.open(SHELL);
          cache.put('./index.html', fresh.clone());
          return fresh;
        } catch {
          const cache = await caches.open(SHELL);
          return (
            (await cache.match('./index.html', MATCH)) ?? (await cache.match('./', MATCH)) ?? Response.error()
          );
        }
      })(),
    );
    return;
  }

  // Kartenkacheln: aus dem Cache, sonst holen und behalten. (Die Schriften
  // liegen seit der Umstellung im eigenen Haus und laufen unten mit.)
  if (TILE_HOSTS.some((h) => url.hostname.endsWith(h))) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(TILES);
        const hit = await cache.match(request, MATCH);
        if (hit) return hit;
        try {
          const fresh = await fetch(request);
          if (fresh.ok || fresh.type === 'opaque') {
            await cache.put(request, fresh.clone());
            trim(TILES, TILE_LIMIT);
          }
          return fresh;
        } catch {
          return hit ?? Response.error();
        }
      })(),
    );
    return;
  }

  // Eigene Dateien: sofort aus dem Cache, im Hintergrund erneuern.
  if (url.origin === self.location.origin) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(SHELL);
        // `ignoreVary`: der neu geladene Aufruf bringt andere Kopfzeilen mit als
        // der gespeicherte – ohne das läuft der Treffer ins Leere.
        const hit = await cache.match(request, MATCH);
        const network = fetch(request)
          .then((res) => {
            if (res.ok) cache.put(request, res.clone());
            return res;
          })
          .catch(() => null);
        return hit ?? (await network) ?? Response.error();
      })(),
    );
  }
});
