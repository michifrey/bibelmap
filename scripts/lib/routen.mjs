// Alle Wege der App an einer Stelle – für die Skripte, die über sie laufen.
//
// Drei Datensätze führen Reisen: die Bibelreisen (`journeys.ts`), die
// Missionsreisen (`mission.ts`) und die Akte der Jesus-Sektion (`gospel.ts`).
// Der Weg-Sucher (`build-roads.mjs`) und seine Prüfung (`check-roads.mjs`)
// brauchen beide dieselbe Liste, und zwar buchstäblich dieselbe: Stünde sie
// zweimal da, prüfte die Prüfung irgendwann eine andere Liste, als der Sucher
// gebaut hat – und fände nichts.
//
// Die Kennungen sind die der Geländeansicht (`App.tsx`): die Reise-ID, die
// Missions-ID, und für einen Akt `jesus-<akt>`.

import { JOURNEYS } from '../../src/data/journeys.ts';
import { JOURNEYS as MISSION } from '../../src/data/mission.ts';
import { ACTS, stationsInAct } from '../../src/data/gospel.ts';
import { ERA_BY_ID } from '../../src/data/eras.ts';

/**
 * Ab wann das römische Netz als gleichzeitig gelten kann. Pompeius nimmt 63
 * v. Chr. Jerusalem; die Straßen im Land sind größtenteils noch jünger. Alles
 * davor ist eine andere Zeit – der Weg mag derselbe sein, die Straße ist es
 * nicht, und die Oberfläche sagt das dazu.
 */
export const ROEMISCH_AB = -63;

/**
 * Jede Route so, wie die Geländekarte sie sieht: Kennung, Epoche, Stationen.
 * `sea` markiert die Etappen über Wasser – die bekommen keinen Straßenweg.
 */
export function routen() {
  const out = [];
  for (const j of JOURNEYS) {
    out.push({
      id: j.id,
      epoche: j.era,
      roemisch: (ERA_BY_ID[j.era]?.from ?? -2000) >= ROEMISCH_AB,
      stops: j.stops.map((s) => ({ lat: s.lat, lon: s.lon, sea: !!s.sea })),
    });
  }
  for (const m of MISSION) {
    out.push({
      id: m.id,
      epoche: 'roman',
      roemisch: true,
      stops: m.stops.map((s) => ({ lat: s.lat, lon: s.lon, sea: !!s.sea })),
    });
  }
  for (const a of ACTS) {
    const st = stationsInAct(a.id);
    if (st.length < 2) continue;
    out.push({
      id: `jesus-${a.id}`,
      epoche: 'roman',
      roemisch: true,
      stops: st.map((s) => ({ lat: s.lat, lon: s.lon, sea: false })),
    });
  }
  return out;
}
