import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Die Seite läuft unter einer eigenen Domain (public/CNAME) und damit an der
  // Wurzel. VITE_BASE bleibt für den Fall, dass sie einmal wieder in einem
  // Unterverzeichnis liegt – etwa als GitHub-Pages-Projektseite unter /bibelmap/.
  base: process.env.VITE_BASE ?? '/',
  plugins: [react(), tailwindcss()],
  server: { host: true },
  build: {
    // Sourcemaps nur auf Abruf: `BIBELMAP_SOURCEMAP=1 npm run build`.
    //
    // Sie kosten die Veröffentlichung nichts (kein Browser lädt eine .map ohne
    // offene Entwicklerwerkzeuge), aber sie sind das einzige Werkzeug, mit dem
    // sich verlässlich sagen lässt, woraus ein Bündel besteht. Zeichenketten
    // im fertigen Bündel zu suchen führt in die Irre: „passages" steht dort als
    // Dateiname, nicht als Datei.
    sourcemap: process.env.BIBELMAP_SOURCEMAP === '1',
  },
});
