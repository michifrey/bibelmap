// Tidy left-to-right layout for the genealogy / faith-history tree.
// Columns = generation depth, rows = a post-order leaf cursor so siblings never
// overlap. Only the *visible* subtree (respecting collapsed nodes) is laid out.

import { GENEALOGY, PERSON_BY_ID, type Person } from '../data/genealogy';

export const COL_W = 212; // horizontal step per generation
export const ROW_H = 96; // vertical step per row
export const CARD_W = 170;
export const CARD_H = 74;

/** children of each person, sorted by (approx.) birth year then original order. */
export const CHILDREN: Record<string, Person[]> = (() => {
  const map: Record<string, Person[]> = {};
  GENEALOGY.forEach((p, i) => {
    (p as Person & { _i?: number })._i = i;
    if (p.parent) (map[p.parent] ??= []).push(p);
  });
  for (const k of Object.keys(map)) {
    map[k].sort((a, b) => {
      const ay = a.born ?? Infinity;
      const by = b.born ?? Infinity;
      if (ay !== by) return ay - by;
      return ((a as Person & { _i?: number })._i ?? 0) - ((b as Person & { _i?: number })._i ?? 0);
    });
  }
  return map;
})();

export const ROOTS: Person[] = GENEALOGY.filter((p) => p.parent === null);

/** Ids that are on the main spine (default-expanded). */
export const LINE_IDS: string[] = GENEALOGY.filter((p) => p.line).map((p) => p.id);

export interface NodePos {
  person: Person;
  depth: number;
  /** pixel top-left of the card */
  x: number;
  y: number;
}

export interface Layout {
  nodes: NodePos[];
  links: { from: NodePos; to: NodePos; faith: boolean }[];
  width: number;
  height: number;
  /** Per-depth representative (the spine node) for the time ruler. */
  ruler: { depth: number; x: number; year?: number; epoch: string }[];
}

export function hasChildren(id: string): boolean {
  return (CHILDREN[id]?.length ?? 0) > 0;
}

export function computeLayout(expanded: Set<string>): Layout {
  // ---- block layout -------------------------------------------------------
  // Each subtree is built as a relative block: the node sits at (col 0, row 0),
  // its main (line) child continues straight ahead on row 0 — the horizontal
  // backbone — and every branch child is stacked into the lowest row that is
  // free across the columns it actually spans. Because collisions are checked
  // per column, far-apart branches reuse the same rows and stay close to their
  // own parent instead of marching ever downward.
  type Occ = Map<number, [number, number][]>;
  interface Block {
    place: Map<string, { col: number; row: number }>;
    occ: Occ;
  }

  function intervalsOverlap(occ: Occ, row: number, a: number, b: number): boolean {
    const ivs = occ.get(row);
    if (!ivs) return false;
    return ivs.some(([x, y]) => a <= y && x <= b);
  }
  function addInterval(occ: Occ, row: number, a: number, b: number) {
    (occ.get(row) ?? occ.set(row, []).get(row)!).push([a, b]);
  }
  function blockCollides(occ: Occ, block: Block, dCol: number, dRow: number): boolean {
    for (const [row, ivs] of block.occ) {
      for (const [a, b] of ivs) {
        if (intervalsOverlap(occ, row + dRow, a + dCol, b + dCol)) return true;
      }
    }
    return false;
  }
  function mergeBlock(occ: Occ, block: Block, dCol: number, dRow: number) {
    for (const [row, ivs] of block.occ) {
      for (const [a, b] of ivs) addInterval(occ, row + dRow, a + dCol, b + dCol);
    }
  }

  function build(person: Person): Block {
    const place = new Map<string, { col: number; row: number }>();
    const occ: Occ = new Map();
    place.set(person.id, { col: 0, row: 0 });
    addInterval(occ, 0, 0, 0);

    const kids = expanded.has(person.id) ? CHILDREN[person.id] ?? [] : [];
    if (kids.length) {
      let mainIdx = kids.findIndex((k) => k.line);
      if (mainIdx < 0) mainIdx = 0;
      const ordered = [kids[mainIdx], ...kids.filter((_, i) => i !== mainIdx)];

      ordered.forEach((kid, i) => {
        const child = build(kid);
        const dCol = 1;
        let dRow = i === 0 ? 0 : 1; // main child shares this node's row
        while (blockCollides(occ, child, dCol, dRow)) dRow++;
        for (const [id, p] of child.place) place.set(id, { col: p.col + dCol, row: p.row + dRow });
        mergeBlock(occ, child, dCol, dRow);
      });
    }
    return { place, occ };
  }

  const pos = new Map<string, NodePos>();
  let maxDepth = 0;
  let maxRow = 0;
  let rootRow = 0;
  for (const r of ROOTS) {
    const block = build(r);
    for (const [id, p] of block.place) {
      const person = PERSON_BY_ID[id];
      maxDepth = Math.max(maxDepth, p.col);
      maxRow = Math.max(maxRow, p.row);
      if (id === r.id) rootRow = p.row;
      pos.set(id, { person, depth: p.col, x: p.col * COL_W, y: p.row * ROW_H });
    }
  }
  void rootRow;

  const nodes = [...pos.values()];
  const links: Layout['links'] = [];
  for (const n of nodes) {
    if (!n.person.parent) continue;
    const parent = pos.get(n.person.parent);
    if (parent) links.push({ from: parent, to: n, faith: !!n.person.faith });
  }

  // Time ruler: for every depth pick the spine (line) node so the year axis is
  // monotonic; fall back to any dated node at that depth.
  const perDepth = new Map<number, { year?: number; epoch: string; line: boolean }>();
  for (const n of nodes) {
    const cur = perDepth.get(n.depth);
    const isLine = !!n.person.line;
    if (!cur || (isLine && !cur.line)) {
      perDepth.set(n.depth, { year: n.person.born, epoch: n.person.epoch, line: isLine });
    }
  }
  const ruler: Layout['ruler'] = [];
  for (let d = 0; d <= maxDepth; d++) {
    const info = perDepth.get(d);
    if (info) ruler.push({ depth: d, x: d * COL_W, year: info.year, epoch: info.epoch });
  }

  return {
    nodes,
    links,
    width: (maxDepth + 1) * COL_W,
    height: Math.max(maxRow + 1, 1) * ROW_H,
    ruler,
  };
}

export { PERSON_BY_ID };
