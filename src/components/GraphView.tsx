import { useEffect, useMemo, useRef, useState } from 'react';
import type { Place } from '../types';
import type { Lang } from '../i18n';
import { useT } from '../i18n';
import { erasForPlace } from '../lib/places';
import { BOOKS } from '../data/books';
import { ERA_BY_ID } from '../data/eras';
import PlaceDetail from './PlaceDetail';

interface Props {
  places: Place[];
  lang: Lang;
}

type NodeKind = 'book' | 'place';

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
  bookOsis?: string;
}

interface GEdge {
  a: number; // node index
  b: number; // node index
  w: number;
}

const TEAL = '#1f3d3a';

// Earliest-era colour of a place (mirrors the map markers).
function placeColor(p: Place): string {
  let best: { order: number; color: string } | null = null;
  for (const id of erasForPlace(p)) {
    const e = ERA_BY_ID[id];
    if (e && (!best || e.order < best.order)) best = { order: e.order, color: e.color };
  }
  return best?.color ?? TEAL;
}

// Deterministic pseudo-random in [0,1) from an integer seed (stable layout).
function seeded(i: number): number {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * Builds a bipartite "link cluster": Bible books on one side, the places they
 * mention on the other. A place is wired to every book it appears in, so the
 * force layout pulls books that share locations together (Pentateuch, Gospels,
 * …) and lets you see, Obsidian-style, where each place is referenced.
 */
function buildGraph(places: Place[], placeLimit: number) {
  const nodes: GNode[] = [];
  const edges: GEdge[] = [];
  const bookIndex = new Map<string, number>();

  // book nodes (only books that actually carry places)
  const bookMentions = new Map<string, number>();
  for (const p of places) {
    const seen = new Set<string>();
    for (const v of p.verses) {
      if (seen.has(v.book)) continue;
      seen.add(v.book);
      bookMentions.set(v.book, (bookMentions.get(v.book) ?? 0) + 1);
    }
  }
  for (const b of BOOKS) {
    const count = bookMentions.get(b.osis);
    if (!count) continue;
    const era = ERA_BY_ID[b.era];
    bookIndex.set(b.osis, nodes.length);
    nodes.push({
      id: `book:${b.osis}`,
      kind: 'book',
      label: b.de === b.en ? b.en : b.de.replace(/ \(.*\)$/, ''),
      color: era?.color ?? TEAL,
      r: 7 + Math.min(13, Math.sqrt(count) * 1.6),
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      deg: 0,
      bookOsis: b.osis,
    });
  }

  // place nodes: the most-mentioned first, capped for legibility
  const top = [...places].sort((a, b) => b.mentionCount - a.mentionCount).slice(0, placeLimit);
  for (const p of top) {
    const pi = nodes.length;
    const booksOf = new Map<string, number>();
    for (const v of p.verses) booksOf.set(v.book, (booksOf.get(v.book) ?? 0) + 1);
    let linked = 0;
    for (const [osis, w] of booksOf) {
      const bi = bookIndex.get(osis);
      if (bi === undefined) continue;
      edges.push({ a: pi, b: bi, w });
      nodes[bi].deg += 1;
      linked += 1;
    }
    if (linked === 0) continue; // skip isolated places
    nodes.push({
      id: `place:${p.id}`,
      kind: 'place',
      label: p.name.replace(/ \d+$/, ''),
      color: placeColor(p),
      r: 4 + Math.min(9, Math.sqrt(p.mentionCount) * 0.9),
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      deg: linked,
      place: p,
    });
  }

  // seed positions: books on an inner ring, places on an outer ring
  let bk = 0;
  let pl = 0;
  const nB = nodes.filter((n) => n.kind === 'book').length;
  const nP = nodes.length - nB;
  for (const n of nodes) {
    if (n.kind === 'book') {
      const a = (bk++ / Math.max(1, nB)) * Math.PI * 2;
      n.x = Math.cos(a) * 140 + (seeded(bk) - 0.5) * 30;
      n.y = Math.sin(a) * 140 + (seeded(bk + 99) - 0.5) * 30;
    } else {
      const a = (pl++ / Math.max(1, nP)) * Math.PI * 2;
      n.x = Math.cos(a) * 360 + (seeded(pl + 7) - 0.5) * 60;
      n.y = Math.sin(a) * 360 + (seeded(pl + 50) - 0.5) * 60;
    }
  }

  // adjacency for highlight
  const adj: Set<number>[] = nodes.map(() => new Set<number>());
  for (const e of edges) {
    adj[e.a].add(e.b);
    adj[e.b].add(e.a);
  }

  return { nodes, edges, adj };
}

export default function GraphView({ places, lang }: Props) {
  const t = useT();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [placeLimit, setPlaceLimit] = useState(120);
  const [selected, setSelected] = useState<Place | null>(null);

  const graph = useMemo(() => buildGraph(places, placeLimit), [places, placeLimit]);

  // mutable interaction state kept in refs (no re-render per frame)
  const view = useRef({ x: 0, y: 0, k: 1 });
  const hover = useRef<number | null>(null);
  const active = useRef<number | null>(null); // clicked/focused node
  const drag = useRef<{ node: number | null; px: number; py: number; moved: boolean } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext('2d')!;
    const { nodes, edges, adj } = graph;

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

    // centre the view once we know the size
    view.current = { x: W / 2, y: H / 2, k: 0.8 };

    function step() {
      // physics
      const REP = 5200;
      const damping = 0.86;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          let dx = a.x - b.x;
          let dy = a.y - b.y;
          let d2 = dx * dx + dy * dy;
          if (d2 < 0.01) {
            dx = seeded(i + j) - 0.5;
            dy = seeded(i * j + 1) - 0.5;
            d2 = 0.01;
          }
          const minD = (a.r + b.r + 6) ** 2;
          if (d2 > 90000 && d2 > minD) continue; // ignore far pairs (perf)
          const f = (REP * alpha) / d2;
          const d = Math.sqrt(d2);
          const fx = (dx / d) * f;
          const fy = (dy / d) * f;
          a.vx += fx;
          a.vy += fy;
          b.vx -= fx;
          b.vy -= fy;
        }
      }
      for (const e of edges) {
        const a = nodes[e.a];
        const b = nodes[e.b];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const d = Math.hypot(dx, dy) || 1;
        const L = 70;
        const f = ((d - L) * 0.015 * alpha);
        const fx = (dx / d) * f;
        const fy = (dy / d) * f;
        a.vx += fx;
        a.vy += fy;
        b.vx -= fx;
        b.vy -= fy;
      }
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        if (drag.current?.node === i) {
          n.vx = 0;
          n.vy = 0;
          continue;
        }
        n.vx += -n.x * 0.0012 * alpha; // gentle gravity toward origin
        n.vy += -n.y * 0.0012 * alpha;
        n.vx *= damping;
        n.vy *= damping;
        n.x += n.vx;
        n.y += n.vy;
      }
      if (alpha > 0.04) alpha *= 0.994;
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

      // edges
      ctx.lineWidth = 1;
      for (const e of edges) {
        const a = nodes[e.a];
        const b = nodes[e.b];
        const [ax, ay] = toScreen(a.x, a.y);
        const [bx, by] = toScreen(b.x, b.y);
        const on = focus == null || e.a === focus || e.b === focus;
        ctx.strokeStyle = on ? 'rgba(31,61,58,0.28)' : 'rgba(31,61,58,0.05)';
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.stroke();
      }

      // nodes
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const [sx, sy] = toScreen(n.x, n.y);
        const r = n.r * v.k;
        const dim = focus != null && i !== focus && !(neigh && neigh.has(i));
        ctx.globalAlpha = dim ? 0.18 : 1;
        ctx.beginPath();
        ctx.arc(sx, sy, r, 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        ctx.fill();
        if (n.kind === 'book') {
          ctx.lineWidth = 2;
          ctx.strokeStyle = '#fff';
          ctx.stroke();
        }
        // labels: books always; places when focused / neighbour / large
        const showLabel =
          n.kind === 'book'
            ? v.k > 0.45
            : !dim && (i === focus || (neigh && neigh.has(i)) || n.r > 8) && v.k > 0.6;
        if (showLabel) {
          ctx.globalAlpha = dim ? 0.25 : 1;
          ctx.font = `${n.kind === 'book' ? 600 : 400} ${Math.max(10, n.kind === 'book' ? 12 : 11)}px Inter, sans-serif`;
          ctx.fillStyle = n.kind === 'book' ? TEAL : '#4a5754';
          // halo for readability
          ctx.strokeStyle = 'rgba(247,241,230,0.9)';
          ctx.lineWidth = 3;
          ctx.strokeText(n.label, sx, sy + r + 2);
          ctx.fillText(n.label, sx, sy + r + 2);
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

    // ---- interaction ----
    function pick(clientX: number, clientY: number): number | null {
      const rect = canvas!.getBoundingClientRect();
      const mx = clientX - rect.left;
      const my = clientY - rect.top;
      const v = view.current;
      let best: number | null = null;
      let bestD = Infinity;
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
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
      // a click (no drag): focus the node / open place detail
      const p = pick(ev.clientX, ev.clientY);
      if (p == null) {
        active.current = null;
        setSelected(null);
        return;
      }
      active.current = p;
      const n = nodes[p];
      setSelected(n.kind === 'place' && n.place ? n.place : null);
      alpha = Math.max(alpha, 0.2);
    }

    function onWheel(ev: WheelEvent) {
      ev.preventDefault();
      const rect = canvas!.getBoundingClientRect();
      const mx = ev.clientX - rect.left;
      const my = ev.clientY - rect.top;
      const v = view.current;
      const factor = Math.exp(-ev.deltaY * 0.0015);
      const nk = Math.min(3, Math.max(0.25, v.k * factor));
      // zoom around cursor
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
  const placeCount = graph.nodes.length - bookCount;

  return (
    <div className="absolute inset-0 bg-cream">
      <div ref={wrapRef} className="absolute inset-0">
        <canvas ref={canvasRef} className="block h-full w-full" style={{ cursor: 'grab' }} />
      </div>

      {/* title + controls */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[1100] flex flex-col gap-2 p-3 pt-20 sm:p-4 sm:pt-24">
        <div className="pointer-events-auto flex flex-wrap items-center gap-3 self-start rounded-2xl bg-cream/92 px-3.5 py-2 shadow-lg ring-1 ring-teal/10 backdrop-blur">
          <div className="pr-1">
            <div className="font-display text-base font-semibold leading-tight text-teal">{t('graphTitle')}</div>
            <div className="text-[11px] text-ink-soft">{t('graphSubtitle')}</div>
          </div>
          <label className="flex items-center gap-2 text-[11px] text-ink-soft">
            {t('graphPlaces')}
            <input
              type="range"
              min={40}
              max={300}
              step={20}
              value={placeLimit}
              onChange={(e) => {
                setSelected(null);
                setPlaceLimit(Number(e.target.value));
              }}
              className="w-28 accent-[var(--color-gold-deep)]"
            />
            <span className="tabular-nums font-medium text-teal">{placeCount}</span>
          </label>
        </div>
        <div className="pointer-events-none self-start rounded-lg bg-cream/80 px-2.5 py-1 text-[11px] text-ink-soft shadow ring-1 ring-teal/10 backdrop-blur">
          {t('graphHint')} · {bookCount} {t('graphBooks')}
        </div>
      </div>

      {/* place detail panel (reuses the map card) */}
      {selected && (
        <div className="pointer-events-none absolute inset-y-0 right-0 z-[1200] flex w-full max-w-[22rem] flex-col p-3 pt-20 sm:p-4 sm:pt-24">
          <div className="pointer-events-auto flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl bg-cream/95 shadow-2xl ring-1 ring-teal/10 backdrop-blur">
            <PlaceDetail place={selected} lang={lang} onClose={() => setSelected(null)} />
          </div>
        </div>
      )}
    </div>
  );
}
