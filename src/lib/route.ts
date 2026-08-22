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
