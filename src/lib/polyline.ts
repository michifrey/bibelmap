// Punktketten kurz halten.
//
// Ein Weg über eine römische Straße hat schnell zweihundert Stützpunkte. Als
// JSON-Zahlenpaare sind das rund 4 kB je Etappe – bei dreihundert Etappen über
// ein Megabyte, das jemand herunterlädt, um einen Weg zu sehen.
//
// Das übliche Mittel dagegen ist die **Polylinienkodierung** von Google (1
// Zeile Spezifikation, überall gleich): Jeder Punkt wird als Differenz zum
// vorigen gespeichert, in Hundertausendstel Grad, und die Zahl in Sechserbits
// zerlegt, die als druckbare Zeichen dastehen. Aus `[[32.881,35.575],
// [32.884,35.579]]` werden dreizehn Zeichen. Gemessen am fertigen Datensatz:
// ein Fünftel der Größe.
//
// Genauigkeit 5 bedeutet rund 1,1 m – für einen Weg, dessen Verlauf ohnehin
// aus einer Karte im Maßstab 1:1.000.000 stammt, mehr als genug.
//
// Warum nicht `@mapbox/polyline` aus npm: 40 Zeilen, die sich nicht ändern,
// gegen ein weiteres Paket in einem Projekt, das mit sieben auskommt.

import type { LatLon } from './route';

const GENAUIGKEIT = 1e5;

/** Eine einzelne Zahl anhängen – Zickzack-Kodierung, dann Sechserbits. */
function zahl(wert: number, out: string[]): void {
  let v = wert < 0 ? ~(wert << 1) : wert << 1;
  while (v >= 0x20) {
    out.push(String.fromCharCode((0x20 | (v & 0x1f)) + 63));
    v >>= 5;
  }
  out.push(String.fromCharCode(v + 63));
}

/** Punktkette → Zeichenkette. */
export function encodePolyline(points: LatLon[]): string {
  const out: string[] = [];
  let lat = 0;
  let lon = 0;
  for (const [y, x] of points) {
    const ly = Math.round(y * GENAUIGKEIT);
    const lx = Math.round(x * GENAUIGKEIT);
    zahl(ly - lat, out);
    zahl(lx - lon, out);
    lat = ly;
    lon = lx;
  }
  return out.join('');
}

/** Zeichenkette → Punktkette. Die Umkehrung, Zeichen für Zeichen. */
export function decodePolyline(text: string): LatLon[] {
  const out: LatLon[] = [];
  let i = 0;
  let lat = 0;
  let lon = 0;
  while (i < text.length) {
    let ergebnis = 0;
    let schicht = 0;
    let b: number;
    do {
      b = text.charCodeAt(i++) - 63;
      ergebnis |= (b & 0x1f) << schicht;
      schicht += 5;
    } while (b >= 0x20);
    lat += ergebnis & 1 ? ~(ergebnis >> 1) : ergebnis >> 1;

    ergebnis = 0;
    schicht = 0;
    do {
      b = text.charCodeAt(i++) - 63;
      ergebnis |= (b & 0x1f) << schicht;
      schicht += 5;
    } while (b >= 0x20);
    lon += ergebnis & 1 ? ~(ergebnis >> 1) : ergebnis >> 1;

    out.push([lat / GENAUIGKEIT, lon / GENAUIGKEIT]);
  }
  return out;
}
