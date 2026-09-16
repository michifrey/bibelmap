// Eine Route, wie das Gelände sie braucht.
//
// Drei Datensätze führen hier zusammen – die Bibelreisen (`journeys.ts`), die
// Missionsreisen (`mission.ts`) und die Stationen eines Akts aus der
// Jesus-Sektion (`gospel.ts`). Sie sehen verschieden aus; gemeinsam ist ihnen
// ein Name, eine Farbe und eine Kette von Stationen.
//
// Warum das nicht in `TerrainMap.tsx` steht, wo es herkommt: Das Gehen zeigt
// die Menschen einer Station an, und die Anzeige dafür (`WalkPanel.tsx`) ist
// eine eigene Datei. Läge der Typ in der Karte, importierten sich die beiden
// im Kreis.

/**
 * Ein Mensch, der an einer Station vorkommt. Kommt aus `gospel.ts`; die
 * Bibelreisen und die Mission führen ihre Leute nicht Station für Station,
 * und dort bleibt das Feld leer.
 */
export interface TerrainPerson {
  id: string;
  de: string;
  en: string;
  /** Wer das ist, in drei bis fünf Wörtern. */
  role: { de: string; en: string };
}

export interface TerrainStop {
  de: string;
  en: string;
  lat: number;
  lon: number;
  /** Die Bibelstelle zur Station, wo der Datensatz eine führt. */
  ref?: { de: string; en: string };
  /** Wer hier vorkommt – die Grundlage der Begegnungen im Gehen. */
  people?: TerrainPerson[];
}

export interface TerrainRoute {
  id: string;
  /** Woher die Route kommt – entscheidet, wohin der Rückweg führt. */
  kind: 'journey' | 'mission' | 'gospel';
  de: string;
  en: string;
  color: string;
  stops: TerrainStop[];
}
