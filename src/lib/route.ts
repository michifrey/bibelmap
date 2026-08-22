export type LatLon = [number, number];

/**
 * Punkt auf einem Streckenzug. `t` zählt in Etappen: 0 = erste Station,
 * 1,5 = Mitte zwischen zweiter und dritter Station. Linear interpoliert –
 * auf diesen Entfernungen ist der Unterschied zur Großkreislinie unsichtbar.
 */
export function pointAt(points: LatLon[], t: number): LatLon {
  if (points.length === 0) return [0, 0];
  const max = points.length - 1;
  const clamped = Math.max(0, Math.min(max, t));
  const i = Math.floor(clamped);
  if (i >= max) return points[max];
  const f = clamped - i;
  const [aLat, aLon] = points[i];
  const [bLat, bLon] = points[i + 1];
  return [aLat + (bLat - aLat) * f, aLon + (bLon - aLon) * f];
}

/** Die bereits zurückgelegte Strecke bis `t`, inklusive des angebrochenen Stücks. */
export function traveled(points: LatLon[], t: number): LatLon[] {
  const max = points.length - 1;
  const clamped = Math.max(0, Math.min(max, t));
  const i = Math.floor(clamped);
  const out = points.slice(0, i + 1);
  if (i < max) out.push(pointAt(points, clamped));
  return out;
}

/** Entfernung zweier Punkte in Kilometern (Luftlinie, Haversine). */
export function distanceKm(a: LatLon, b: LatLon): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b[0] - a[0]);
  const dLon = toRad(b[1] - a[1]);
  const lat1 = toRad(a[0]);
  const lat2 = toRad(b[0]);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Entfernung jeder Etappe: `legs[i]` führt von Station i zu Station i+1. */
export function legDistances(points: LatLon[]): number[] {
  const out: number[] = [];
  for (let i = 0; i + 1 < points.length; i++) out.push(distanceKm(points[i], points[i + 1]));
  return out;
}

/**
 * Tagesmärsche für eine Strecke. Eine Karawane mit Vieh und Kindern schaffte
 * grob 25 km am Tag – eine Größenordnung, kein Fahrplan.
 */
export const KM_PER_DAY = 25;

export function walkingDays(km: number): number {
  return Math.max(1, Math.round(km / KM_PER_DAY));
}

/** Kilometer lesbar: unter 10 mit einer Nachkommastelle, darüber ganzzahlig. */
export function formatKm(km: number, lang: 'de' | 'en'): string {
  const value =
    km < 10
      ? km.toLocaleString(lang === 'de' ? 'de-DE' : 'en-US', { maximumFractionDigits: 1 })
      : Math.round(km).toLocaleString(lang === 'de' ? 'de-DE' : 'en-US');
  return `${value} km`;
}
