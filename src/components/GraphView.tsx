import { useEffect, useMemo, useRef, useState } from 'react';
import type { Place } from '../types';
import type { Lang } from '../i18n';
import { useT } from '../i18n';
import { erasForPlace } from '../lib/places';
import { osisFromRef } from '../lib/bookAbbr';
import { BOOKS } from '../data/books';
import { ERA_BY_ID } from '../data/eras';
import { GENEALOGY, type Person } from '../data/genealogy';
import PlaceDetail from './PlaceDetail';
import PersonDetail from './PersonDetail';

interface Props {
  places: Place[];
  lang: Lang;
}

type NodeKind = 'book' | 'place' | 'person';

interface GNode {
  id: string;
  kind: NodeKind;
  label: string;
  color: string;
  r: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  deg: number;
  place?: Place;
  person?: Person;
  bookOsis?: string;
}

interface GEdge {
  a: number;
  b: number;
  w: number;
  book?: boolean; // book↔book cross-reference edge
}

const TEAL = '#1f3d3a';

function placeColor(p: Place): string {
  let best: { order: number; color: string } | null = null;
  for (const id of erasForPlace(p)) {
    const e = ERA_BY_ID[id];
    if (e && (!best || e.order < best.order)) best = { order: e.order, color: e.color };
  }
  return best?.color ?? TEAL;
}

function seeded(i: number): number {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

type Xref = [string, string, number];

/**
 * Builds the cross-reference web: book nodes plus the places and people that
 * reference them, and book↔book edges. The book edges come from the real
 * OpenBible cross-reference dataset when `public/data/xrefs.json` is present,
 * otherwise they are derived from shared places/people (co-citation), so the
 * graph always shows how books connect.
 */
function buildGraph(places: Place[], placeLimit: number, xrefs: Xref[] | null) {
  const nodes: GNode[] = [];
  const edges: GEdge[] = [];
  const bookIndex = new Map<string, number>();

  const bookMentions = new Map<string, number>();
  for (const p of places) {
    const seen = new Set<string>();
    for (const v of p.verses) {
      if (!seen.has(v.book)) {
        seen.add(v.book);
        bookMentions.set(v.book, (bookMentions.get(v.book) ?? 0) + 1);
      }
    }
  }
  for (const b of BOOKS) {
    if (!bookMentions.get(b.osis)) continue;
    const era = ERA_BY_ID[b.era];
    bookIndex.set(b.osis, nodes.length);
    nodes.push({
      id: `book:${b.osis}`,
      kind: 'book',
      label: b.de === b.en ? b.en : b.de.replace(/ \(.*\)$/, ''),
      color: era?.color ?? TEAL,
      r: 7 + Math.min(13, Math.sqrt(bookMentions.get(b.osis)!) * 1.6),
      x: 0, y: 0, vx: 0, vy: 0, deg: 0,
      bookOsis: b.osis,
    });
  }

  // place nodes (most-mentioned first), wired to every book they appear in
  const top = [...places].sort((a, b) => b.mentionCount - a.mentionCount).slice(0, placeLimit);
  const booksByPlace: number[][] = []; // book node indices per included place
  for (const p of top) {
    const booksOf = new Map<string, number>();
    for (const v of p.verses) booksOf.set(v.book, (booksOf.get(v.book) ?? 0) + 1);
    const bks: number[] = [];
    for (const [osis] of booksOf) {
      const bi = bookIndex.get(osis);
      if (bi !== undefined) bks.push(bi);
    }
    if (!bks.length) continue;
    const pi = nodes.length;
    for (const [osis, w] of booksOf) {
      const bi = bookIndex.get(osis);
      if (bi === undefined) continue;
      edges.push({ a: pi, b: bi, w });
      nodes[bi].deg += 1;
    }
    booksByPlace.push(bks);
    nodes.push({
      id: `place:${p.id}`,
      kind: 'place',
      label: p.name.replace(/ \d+$/, ''),
      color: placeColor(p),
      r: 4 + Math.min(9, Math.sqrt(p.mentionCount) * 0.9),
      x: 0, y: 0, vx: 0, vy: 0, deg: bks.length,
      place: p,
    });
  }

  // person nodes (genealogy), wired to the books of their refs
  const booksByPerson: number[][] = [];
  for (const person of GENEALOGY) {
    const bset = new Set<number>();
    for (const ref of person.refs) {
      const osis = osisFromRef(ref);
      if (!osis) continue;
      const bi = bookIndex.get(osis);
      if (bi !== undefined) bset.add(bi);
    }
    if (!bset.size) continue;
    const epoch = ERA_BY_ID[person.epoch];
    const pi = nodes.length;
    for (const bi of bset) {
      edges.push({ a: pi, b: bi, w: 1 });
      nodes[bi].deg += 1;
    }
    booksByPerson.push([...bset]);
    nodes.push({
      id: `person:${person.id}`,
      kind: 'person',
      label: lang2(person),
      color: epoch?.color ?? '#9a4ba0',
      r: 5,
      x: 0, y: 0, vx: 0, vy: 0, deg: bset.size,
      person,
    });
  }

  // book↔book edges
  const bookEdges: GEdge[] = [];
  if (xrefs && xrefs.length) {
    const max = xrefs[0][2] || 1;
    for (const [a, b, w] of xrefs) {
      const ai = bookIndex.get(a);
      const bi = bookIndex.get(b);
      if (ai === undefined || bi === undefined) continue;
      bookEdges.push({ a: ai, b: bi, w: w / max, book: true });
    }
  } else {
    // derive from shared places + people (co-citation)
    const pair = new Map<string, number>();
    const addShared = (bks: number[]) => {
      for (let i = 0; i < bks.length; i++)
        for (let j = i + 1; j < bks.length; j++) {
          const a = bks[i];
          const b = bks[j];
          const k = a < b ? `${a}|${b}` : `${b}|${a}`;
          pair.set(k, (pair.get(k) ?? 0) + 1);
        }
    };
    booksByPlace.forEach(addShared);
    booksByPerson.forEach(addShared);
    let max = 1;
    for (const v of pair.values()) max = Math.max(max, v);
    for (const [k, v] of pair) {
      if (v < 2) continue; // only meaningful links
      const [a, b] = k.split('|').map(Number);
      bookEdges.push({ a, b, w: v / max, book: true });
    }
  }

  const adj: Set<number>[] = nodes.map(() => new Set<number>());
  for (const e of edges) {
    adj[e.a].add(e.b);
    adj[e.b].add(e.a);
  }
  for (const e of bookEdges) {
    adj[e.a].add(e.b);
    adj[e.b].add(e.a);
  }

  // seed positions on rings by kind
  const counts = { book: 0, place: 0, person: 0 } as Record<NodeKind, number>;
  const totals = { book: 0, place: 0, person: 0 } as Record<NodeKind, number>;
  for (const n of nodes) totals[n.kind]++;
  for (const n of nodes) {
    const ring = n.kind === 'book' ? 160 : n.kind === 'place' ? 460 : 620;
    const idx = counts[n.kind]++;
    const a = (idx / Math.max(1, totals[n.kind])) * Math.PI * 2;
    n.x = Math.cos(a) * ring + (seeded(idx + (n.kind === 'place' ? 7 : 50)) - 0.5) * 80;
    n.y = Math.sin(a) * ring + (seeded(idx + (n.kind === 'person' ? 99 : 3)) - 0.5) * 80;
  }

  return { nodes, edges, bookEdges, adj };
}

// person label is language-agnostic at build time; pick German primary, the
// component re-renders labels itself, so a stable choice is fine here.
function lang2(p: Person): string {
  return p.de;
}

export default function GraphView({ places, lang }: Props) {
  const t = useT();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const [placeLimit, setPlaceLimit] = useState(90);
  const [showPlaces, setShowPlaces] = useState(true);
  const [showPeople, setShowPeople] = useState(true);
  const [showBookLinks, setShowBookLinks] = useState(false);
  const [query, setQuery] = useState('');
  const [selPlace, setSelPlace] = useState<Place | null>(null);
  const [selPerson, setSelPerson] = useState<string | null>(null);
  const [bookInfo, setBookInfo] = useState<{ osis: string; label: string } | null>(null);
  const [xrefs, setXrefs] = useState<Xref[] | null>(null);
  const [xrefReal, setXrefReal] = useState(false);

  // load real cross-references if shipped
  useEffect(() => {
    let alive = true;
    fetch(`${import.meta.env.BASE_URL}data/xrefs.json`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (alive && Array.isArray(d) && d.length) {
          setXrefs(d as Xref[]);
          setXrefReal(true);
        }
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const graph = useMemo(() => buildGraph(places, placeLimit, xrefs), [places, placeLimit, xrefs]);

  // keep latest filter/label state in refs for the animation loop
  const filt = useRef({ showPlaces, showPeople, showBookLinks, lang });
  filt.current = { showPlaces, showPeople, showBookLinks, lang };
  const view = useRef({ x: 0, y: 0, k: 1 });
  const hover = useRef<number | null>(null);
  const active = useRef<number | null>(null);
  const drag = useRef<{ node: number | null; px: number; py: number; moved: boolean } | null>(null);
  const focusReq = useRef<number | null>(null);

  function nodeVisible(n: GNode): boolean {
    if (n.kind === 'book') return true;
    if (n.kind === 'place') return filt.current.showPlaces;
    return filt.current.showPeople;
  }

  // search → focus a matching node
  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      focusReq.current = null;
      return;
    }
    const { nodes } = graph;
    let found = -1;
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      const label = n.kind === 'person' && n.person ? (lang === 'de' ? n.person.de : n.person.en) : n.label;
      if (nodeVisible(n) && label.toLowerCase().includes(q)) {
        found = i;
        break;
      }
    }
    focusReq.current = found >= 0 ? found : null;
    if (found >= 0) active.current = found;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, graph, lang]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext('2d')!;
    const { nodes, edges, bookEdges, adj } = graph;

    let raf = 0;
    let alpha = 1;
    let W = 0;
    let H = 0;
    const dpr = Math.min(2, window.devicePixelRatio || 1);

    function resize() {
      W = wrap!.clientWidth;
      H = wrap!.clientHeight;
      canvas!.width = W * dpr;
      canvas!.height = H * dpr;
      canvas!.style.width = `${W}px`;
      canvas!.style.height = `${H}px`;
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    view.current = { x: W / 2, y: H / 2, k: 0.62 };

    function labelOf(n: GNode): string {
      if (n.kind === 'person' && n.person) return filt.current.lang === 'de' ? n.person.de : n.person.en;
      return n.label;
    }

    function step() {
      const REP = 8000;
      const damping = 0.85;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        if (!nodeVisible(a)) continue;
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          if (!nodeVisible(b)) continue;
          let dx = a.x - b.x;
          let dy = a.y - b.y;
          let d2 = dx * dx + dy * dy;
          if (d2 < 0.01) {
            dx = seeded(i + j) - 0.5;
            dy = seeded(i * j + 1) - 0.5;
            d2 = 0.01;
          }
          if (d2 > 140000) continue;
          const d = Math.sqrt(d2);
          let f = (REP * alpha) / d2;
          // collision: extra push when circles overlap
          const minD = a.r + b.r + 10;
          if (d < minD) f += (minD - d) * 0.6;
          const fx = (dx / d) * f;
          const fy = (dy / d) * f;
          a.vx += fx; a.vy += fy;
          b.vx -= fx; b.vy -= fy;
        }
      }
      for (const e of edges) {
        const a = nodes[e.a];
        const b = nodes[e.b];
        if (!nodeVisible(a) || !nodeVisible(b)) continue;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const d = Math.hypot(dx, dy) || 1;
        const f = (d - 80) * 0.014 * alpha;
        const fx = (dx / d) * f;
        const fy = (dy / d) * f;
        a.vx += fx; a.vy += fy;
        b.vx -= fx; b.vy -= fy;
      }
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        if (!nodeVisible(n)) continue;
        if (drag.current?.node === i) {
          n.vx = 0; n.vy = 0;
          continue;
        }
        n.vx += -n.x * 0.0015 * alpha;
        n.vy += -n.y * 0.0015 * alpha;
        n.vx *= damping;
        n.vy *= damping;
        n.x += n.vx;
        n.y += n.vy;
      }
      if (alpha > 0.05) alpha *= 0.992;

      // handle a pending search-focus: pan to node
      if (focusReq.current != null) {
        const n = nodes[focusReq.current];
        const v = view.current;
        v.x += (W / 2 - (n.x * v.k + v.x)) * 0.15;
        v.y += (H / 2 - (n.y * v.k + v.y)) * 0.15;
      }
    }

    function toScreen(x: number, y: number): [number, number] {
      return [x * view.current.k + view.current.x, y * view.current.k + view.current.y];
    }

    function draw() {
      const v = view.current;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      const focus = active.current ?? hover.current;
      const neigh = focus != null ? adj[focus] : null;

      // book↔book cross-reference edges (under the rest)
      if (filt.current.showBookLinks) {
        for (const e of bookEdges) {
          const a = nodes[e.a];
          const b = nodes[e.b];
          const [ax, ay] = toScreen(a.x, a.y);
          const [bx, by] = toScreen(b.x, b.y);
          const on = focus == null || e.a === focus || e.b === focus;
          ctx.strokeStyle = on
            ? `rgba(194,129,42,${0.12 + e.w * 0.5})`
            : 'rgba(194,129,42,0.05)';
          ctx.lineWidth = on ? 0.5 + e.w * 3 : 0.5;
          ctx.beginPath();
          ctx.moveTo(ax, ay);
          ctx.lineTo(bx, by);
          ctx.stroke();
        }
      }

      // entity edges
      ctx.lineWidth = 1;
      for (const e of edges) {
        const a = nodes[e.a];
        const b = nodes[e.b];
        if (!nodeVisible(a) || !nodeVisible(b)) continue;
        const [ax, ay] = toScreen(a.x, a.y);
        const [bx, by] = toScreen(b.x, b.y);
        const on = focus == null || e.a === focus || e.b === focus;
        ctx.strokeStyle = on ? 'rgba(31,61,58,0.22)' : 'rgba(31,61,58,0.04)';
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.stroke();
      }

      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        if (!nodeVisible(n)) continue;
        const [sx, sy] = toScreen(n.x, n.y);
        const r = n.r * v.k;
        const dim = focus != null && i !== focus && !(neigh && neigh.has(i));
        ctx.globalAlpha = dim ? 0.16 : 1;
        ctx.beginPath();
        if (n.kind === 'person') {
          // diamond for people
          ctx.moveTo(sx, sy - r);
          ctx.lineTo(sx + r, sy);
          ctx.lineTo(sx, sy + r);
          ctx.lineTo(sx - r, sy);
          ctx.closePath();
        } else {
          ctx.arc(sx, sy, r, 0, Math.PI * 2);
        }
        ctx.fillStyle = n.color;
        ctx.fill();
        if (n.kind === 'book') {
          ctx.lineWidth = 2;
          ctx.strokeStyle = '#fff';
          ctx.stroke();
        }
        const showLabel =
          n.kind === 'book'
            ? v.k > 0.4
            : !dim && (i === focus || (neigh && neigh.has(i)) || n.r > 7) && v.k > 0.55;
        if (showLabel) {
          ctx.globalAlpha = dim ? 0.25 : 1;
          ctx.font = `${n.kind === 'book' ? 600 : 400} ${n.kind === 'book' ? 12 : 11}px Inter, sans-serif`;
          ctx.fillStyle = n.kind === 'book' ? TEAL : '#4a5754';
          ctx.strokeStyle = 'rgba(247,241,230,0.9)';
          ctx.lineWidth = 3;
          ctx.strokeText(labelOf(n), sx, sy + r + 2);
          ctx.fillText(labelOf(n), sx, sy + r + 2);
        }
      }
      ctx.globalAlpha = 1;
    }

    function frame() {
      step();
      draw();
      raf = requestAnimationFrame(frame);
    }
    frame();

    function pick(clientX: number, clientY: number): number | null {
      const rect = canvas!.getBoundingClientRect();
      const mx = clientX - rect.left;
      const my = clientY - rect.top;
      const v = view.current;
      let best: number | null = null;
      let bestD = Infinity;
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        if (!nodeVisible(n)) continue;
        const sx = n.x * v.k + v.x;
        const sy = n.y * v.k + v.y;
        const rr = n.r * v.k + 5;
        const d = (sx - mx) ** 2 + (sy - my) ** 2;
        if (d < rr * rr && d < bestD) {
          bestD = d;
          best = i;
        }
      }
      return best;
    }

    function onMove(ev: MouseEvent) {
      if (drag.current) {
        const dx = ev.clientX - drag.current.px;
        const dy = ev.clientY - drag.current.py;
        if (Math.abs(dx) + Math.abs(dy) > 2) drag.current.moved = true;
        if (drag.current.node != null) {
          const n = nodes[drag.current.node];
          n.x += dx / view.current.k;
          n.y += dy / view.current.k;
          alpha = Math.max(alpha, 0.3);
        } else {
          view.current.x += dx;
          view.current.y += dy;
        }
        drag.current.px = ev.clientX;
        drag.current.py = ev.clientY;
        return;
      }
      const p = pick(ev.clientX, ev.clientY);
      hover.current = p;
      canvas!.style.cursor = p != null ? 'pointer' : 'grab';
    }

    function onDown(ev: MouseEvent) {
      const p = pick(ev.clientX, ev.clientY);
      drag.current = { node: p, px: ev.clientX, py: ev.clientY, moved: false };
      if (p == null) canvas!.style.cursor = 'grabbing';
    }

    function onUp(ev: MouseEvent) {
      const d = drag.current;
      drag.current = null;
      canvas!.style.cursor = 'grab';
      if (!d || d.moved) return;
      const p = pick(ev.clientX, ev.clientY);
      focusReq.current = null;
      if (p == null) {
        active.current = null;
        setSelPlace(null);
        setSelPerson(null);
        setBookInfo(null);
        return;
      }
      active.current = p;
      const n = nodes[p];
      alpha = Math.max(alpha, 0.2);
      if (n.kind === 'place' && n.place) {
        setSelPlace(n.place);
        setSelPerson(null);
        setBookInfo(null);
      } else if (n.kind === 'person' && n.person) {
        setSelPerson(n.person.id);
        setSelPlace(null);
        setBookInfo(null);
      } else if (n.kind === 'book' && n.bookOsis) {
        setBookInfo({ osis: n.bookOsis, label: n.label });
        setSelPlace(null);
        setSelPerson(null);
      }
    }

    function onWheel(ev: WheelEvent) {
      ev.preventDefault();
      const rect = canvas!.getBoundingClientRect();
      const mx = ev.clientX - rect.left;
      const my = ev.clientY - rect.top;
      const v = view.current;
      const factor = Math.exp(-ev.deltaY * 0.0015);
      const nk = Math.min(3, Math.max(0.2, v.k * factor));
      v.x = mx - ((mx - v.x) * nk) / v.k;
      v.y = my - ((my - v.y) * nk) / v.k;
      v.k = nk;
    }

    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    canvas.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      canvas.removeEventListener('wheel', onWheel);
    };
  }, [graph]);

  const bookCount = graph.nodes.filter((n) => n.kind === 'book').length;
  const placeCount = graph.nodes.filter((n) => n.kind === 'place').length;
  const personCount = graph.nodes.filter((n) => n.kind === 'person').length;

  // connected places/people for a clicked book (the "where mentioned" list)
  const bookLinks = useMemo(() => {
    if (!bookInfo) return null;
    const bi = graph.nodes.findIndex((n) => n.kind === 'book' && n.bookOsis === bookInfo.osis);
    if (bi < 0) return null;
    const ps: Place[] = [];
    const people: Person[] = [];
    for (const e of graph.edges) {
      if (e.b !== bi && e.a !== bi) continue;
      const other = graph.nodes[e.a === bi ? e.b : e.a];
      if (other.kind === 'place' && other.place) ps.push(other.place);
      else if (other.kind === 'person' && other.person) people.push(other.person);
    }
    return { places: ps, people };
  }, [bookInfo, graph]);

  const Toggle = ({ on, set, label, dot }: { on: boolean; set: (v: boolean) => void; label: string; dot: string }) => (
    <button
      onClick={() => set(!on)}
      className={`flex items-center gap-1.5 rounded-lg px-2 py-1 text-[11px] font-medium transition ${
        on ? 'bg-teal text-cream' : 'bg-cream-2 text-ink-soft hover:bg-cream'
      }`}
    >
      <span className="h-2 w-2 rounded-full" style={{ background: on ? dot : 'transparent', outline: `1.5px solid ${dot}` }} />
      {label}
    </button>
  );

  return (
    <div className="absolute inset-0 bg-cream">
      <div ref={wrapRef} className="absolute inset-0">
        <canvas ref={canvasRef} className="block h-full w-full" style={{ cursor: 'grab' }} />
      </div>

      {/* title + controls */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[1100] flex flex-col gap-2 p-3 pt-20 sm:p-4 sm:pt-24">
        <div className="pointer-events-auto flex max-w-[min(94vw,40rem)] flex-wrap items-center gap-x-3 gap-y-2 self-start rounded-2xl bg-cream/92 px-3.5 py-2.5 shadow-lg ring-1 ring-teal/10 backdrop-blur">
          <div className="pr-1">
            <div className="font-display text-base font-semibold leading-tight text-teal">{t('graphTitle')}</div>
            <div className="text-[11px] text-ink-soft">{t('graphSubtitle')}</div>
          </div>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('graphSearch')}
            className="w-36 rounded-lg bg-cream-2 px-2.5 py-1.5 text-[12px] text-ink outline-none ring-1 ring-teal/10 placeholder:text-ink-soft/60 focus:ring-gold"
          />
          <div className="flex flex-wrap items-center gap-1.5">
            <Toggle on={showPlaces} set={setShowPlaces} label={t('graphPlaces')} dot="#2f8f7f" />
            <Toggle on={showPeople} set={setShowPeople} label={t('graphPeople')} dot="#9a4ba0" />
            <Toggle on={showBookLinks} set={setShowBookLinks} label={t('graphBookLinks')} dot="#c2812a" />
          </div>
          <label className="flex items-center gap-2 text-[11px] text-ink-soft">
            {t('graphPlaces')}
            <input
              type="range"
              min={30}
              max={250}
              step={10}
              value={placeLimit}
              onChange={(e) => {
                setSelPlace(null);
                setPlaceLimit(Number(e.target.value));
              }}
              className="w-24 accent-[var(--color-gold-deep)]"
            />
          </label>
        </div>
        <div className="pointer-events-none self-start rounded-lg bg-cream/80 px-2.5 py-1 text-[11px] text-ink-soft shadow ring-1 ring-teal/10 backdrop-blur">
          {t('graphHint')} · {bookCount} {t('graphBooks')} · {placeCount} {t('graphPlaces')} · {personCount} {t('graphPeople')}
          {showBookLinks && ` · ${t('graphBookLinks')}: ${xrefReal ? t('graphXrefReal') : t('graphXrefDerived')}`}
        </div>
      </div>

      {/* place detail */}
      {selPlace && (
        <div className="pointer-events-none absolute inset-y-0 right-0 z-[1200] flex w-full max-w-[22rem] flex-col p-3 pt-20 sm:p-4 sm:pt-24">
          <div className="pointer-events-auto flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl bg-cream/95 shadow-2xl ring-1 ring-teal/10 backdrop-blur">
            <PlaceDetail place={selPlace} lang={lang} onClose={() => setSelPlace(null)} />
          </div>
        </div>
      )}

      {/* person detail */}
      {selPerson && (
        <div className="pointer-events-none absolute inset-y-0 right-0 z-[1200] flex w-full max-w-[22rem] flex-col p-3 pt-20 sm:p-4 sm:pt-24">
          <div className="pointer-events-auto flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl bg-cream/95 shadow-2xl ring-1 ring-teal/10 backdrop-blur">
            <PersonDetail
              person={GENEALOGY.find((p) => p.id === selPerson)!}
              lang={lang}
              onClose={() => setSelPerson(null)}
              onSelect={setSelPerson}
            />
          </div>
        </div>
      )}

      {/* book → mentioned places/people list */}
      {bookInfo && bookLinks && (
        <div className="pointer-events-none absolute inset-y-0 right-0 z-[1200] flex w-full max-w-[20rem] flex-col p-3 pt-20 sm:p-4 sm:pt-24">
          <div className="pointer-events-auto flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl bg-cream/95 shadow-2xl ring-1 ring-teal/10 backdrop-blur">
            <div className="flex items-center justify-between border-b border-teal/10 px-4 py-3">
              <div className="font-display text-lg font-semibold text-teal">{bookInfo.label}</div>
              <button onClick={() => setBookInfo(null)} aria-label={t('close')} className="grid h-7 w-7 place-items-center rounded-full bg-cream-2 text-teal hover:bg-gold/30">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M18.3 5.7 12 12l6.3 6.3-1.4 1.4L10.6 13.4 4.3 19.7 2.9 18.3 9.2 12 2.9 5.7 4.3 4.3l6.3 6.3 6.3-6.3z" /></svg>
              </button>
            </div>
            <div className="scroll-soft flex-1 overflow-y-auto px-4 py-3">
              {bookLinks.places.length > 0 && (
                <>
                  <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink-soft">{t('graphPlaces')} · {bookLinks.places.length}</div>
                  <div className="mb-3 flex flex-wrap gap-1.5">
                    {bookLinks.places.map((p) => (
                      <button key={p.id} onClick={() => { setSelPlace(p); setBookInfo(null); }} className="rounded-md bg-cream-2 px-2 py-0.5 text-[11px] font-medium text-teal-2 ring-1 ring-teal/10 hover:bg-gold/25">
                        {p.name.replace(/ \d+$/, '')}
                      </button>
                    ))}
                  </div>
                </>
              )}
              {bookLinks.people.length > 0 && (
                <>
                  <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink-soft">{t('graphPeople')} · {bookLinks.people.length}</div>
                  <div className="flex flex-wrap gap-1.5">
                    {bookLinks.people.map((p) => (
                      <button key={p.id} onClick={() => { setSelPerson(p.id); setBookInfo(null); }} className="rounded-md bg-cream-2 px-2 py-0.5 text-[11px] font-medium text-teal-2 ring-1 ring-teal/10 hover:bg-gold/25">
                        {lang === 'de' ? p.de : p.en}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
