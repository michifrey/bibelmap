import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Offline: der Service Worker bedient App, Ortsdaten und einmal gesehene
// Kartenkacheln aus dem Cache. Nur im gebauten Stand – im Dev-Server würde er
// den Hot-Reload aushebeln.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const base = import.meta.env.BASE_URL;
    navigator.serviceWorker.register(`${base}sw.js`, { scope: base }).catch(() => {
      // Ohne Service Worker läuft alles wie bisher, nur eben online.
    });
  });
}
