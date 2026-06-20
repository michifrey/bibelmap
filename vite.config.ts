import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // For GitHub Pages project sites the app is served from /<repo>/.
  // The deploy workflow sets VITE_BASE=/bibelmap/; local dev stays at /.
  base: process.env.VITE_BASE ?? '/',
  plugins: [react(), tailwindcss()],
  server: { host: true },
});
