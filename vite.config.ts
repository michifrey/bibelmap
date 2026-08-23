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
});
