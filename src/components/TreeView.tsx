import { useEffect, useMemo, useRef, useState } from 'react';
import type { Lang } from '../i18n';
import { useT } from '../i18n';
import {
  GENEALOGY,
  GEN_EPOCHS,
  EPOCH_BY_ID,
  PERSON_BY_ID,
  formatYear,
} from '../data/genealogy';
import {
  computeLayout,
  hasChildren,
  CARD_W,
  CARD_H,
  COL_W,
  LINE_IDS,
} from '../lib/genealogyTree';
import PersonDetail from './PersonDetail';

const PAD_X = 28;
const PAD_TOP = 196;
const RULER_H = 52;

interface Props {
  lang: Lang;
  /** Select + reveal this person (e.g. coming from the church-history map). */
  focusId?: string | null;
  /** Open the church-history map focused on this person. */
  onShowOnMap?: (personId: string) => void;
}

const ALL_PARENT_IDS = GENEALOGY.filter((p) => hasChildren(p.id)).map((p) => p.id);

function norm(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// parent chain of a person id (its ancestors), so a match can be revealed.
function ancestorsOf(id: string): string[] {
  const out: string[] = [];
  let cur = PERSON_BY_ID[id];
  while (cur?.parent) {
    out.push(cur.parent);
    cur = PERSON_BY_ID[cur.parent];
  }
  return out;
}

export default function TreeView({ lang, focusId, onShowOnMap }: Props) {
  const t = useT();
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set(LINE_IDS));
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [epochFilter, setEpochFilter] = useState<string | null>(null);
  const scrolledMatch = useRef<string | null>(null);

  // Active filter: persons matching the name query AND the chosen epoch.
  const matchSet = useMemo(() => {
    const q = norm(query.trim());
    if (!q && !epochFilter) return null;
    const s = new Set<string>();
    for (const p of GENEALOGY) {
      const nameOk = !q || norm(p.de).includes(q) || norm(p.en).includes(q);
      const epochOk = !epochFilter || p.epoch === epochFilter;
      if (nameOk && epochOk) s.add(p.id);
    }
    return s;
  }, [query, epochFilter]);
  const scrolledFocus = useRef<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const didCenter = useRef(false);
  const dragBar = useRef<{ x: number; left: number } | null>(null);
  // horizontal scrollbar geometry (fractions of the scrollable width)
  const [hbar, setHbar] = useState({ left: 0, width: 1, show: false });

  const layout = useMemo(() => computeLayout(expanded), [expanded]);

  // keep the custom horizontal scrollbar in sync with the tree's scroll state
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const sync = () => {
      const { scrollWidth, clientWidth, scrollLeft } = el;
      setHbar({
        show: scrollWidth > clientWidth + 2,
        width: Math.min(1, clientWidth / scrollWidth),
        left: scrollWidth > 0 ? scrollLeft / scrollWidth : 0,
      });
    };
    sync();
    el.addEventListener('scroll', sync, { passive: true });
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', sync);
      ro.disconnect();
    };
  }, [layout]);

  function onThumbDown(e: React.PointerEvent) {
    const el = scrollRef.current;
    if (!el) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragBar.current = { x: e.clientX, left: el.scrollLeft };
    e.preventDefault();
  }
  function onThumbMove(e: React.PointerEvent) {
    const el = scrollRef.current;
    const track = trackRef.current;
    if (!dragBar.current || !el || !track) return;
    const dx = e.clientX - dragBar.current.x;
    el.scrollLeft = dragBar.current.left + (dx / track.clientWidth) * el.scrollWidth;
  }
  function onThumbUp() {
    dragBar.current = null;
  }
  function onTrackDown(e: React.PointerEvent) {
    const el = scrollRef.current;
    const track = trackRef.current;
    if (!el || !track || e.target !== track) return;
    const rect = track.getBoundingClientRect();
    const frac = (e.clientX - rect.left) / rect.width;
    el.scrollTo({ left: frac * el.scrollWidth - el.clientWidth / 2, behavior: 'smooth' });
  }

  // On first render, center the viewport vertically on the root (Adam).
  useEffect(() => {
    if (didCenter.current || !scrollRef.current) return;
    const root = layout.nodes.find((n) => !n.person.parent);
    if (!root) return;
    const el = scrollRef.current;
    el.scrollTop = Math.max(0, root.y + PAD_TOP + CARD_H / 2 - el.clientHeight / 2);
    didCenter.current = true;
  }, [layout]);

  // Jump to a person requested from outside (church-history map): reveal it by
  // expanding its ancestors, select it, and arm an auto-scroll.
  useEffect(() => {
    if (!focusId || !PERSON_BY_ID[focusId]) return;
    const chain = new Set<string>();
    let cur = PERSON_BY_ID[focusId];
    while (cur?.parent) {
      chain.add(cur.parent);
      cur = PERSON_BY_ID[cur.parent];
    }
    setExpanded((prev) => new Set([...prev, ...chain]));
    setSelectedId(focusId);
    scrolledFocus.current = null;
  }, [focusId]);

  // Once the focused node is laid out, scroll it into view (once per focus).
  useEffect(() => {
    if (!focusId || scrolledFocus.current === focusId) return;
    const node = layout.nodes.find((n) => n.person.id === focusId);
    const el = scrollRef.current;
    if (!node || !el) return;
    el.scrollTo({
      left: Math.max(0, node.x + PAD_X + CARD_W / 2 - el.clientWidth / 2),
      top: Math.max(0, node.y + PAD_TOP + CARD_H / 2 - el.clientHeight / 2),
      behavior: 'smooth',
    });
    scrolledFocus.current = focusId;
  }, [layout, focusId]);

  // Reveal all matches by expanding their ancestry when a filter is active.
  useEffect(() => {
    if (!matchSet || !matchSet.size) return;
    const need = new Set<string>();
    for (const id of matchSet) for (const a of ancestorsOf(id)) need.add(a);
    setExpanded((prev) => {
      let changed = false;
      const next = new Set(prev);
      for (const a of need) if (!next.has(a)) { next.add(a); changed = true; }
      return changed ? next : prev;
    });
  }, [matchSet]);

  // Scroll to the first match (once per filter change).
  useEffect(() => {
    const key = query.trim() + '|' + (epochFilter ?? '');
    if (!matchSet || !matchSet.size) { scrolledMatch.current = null; return; }
    if (scrolledMatch.current === key) return;
    const el = scrollRef.current;
    if (!el) return;
    const node = layout.nodes.find((n) => matchSet.has(n.person.id));
    if (!node) return;
    el.scrollTo({
      left: Math.max(0, node.x + PAD_X + CARD_W / 2 - el.clientWidth / 2),
      top: Math.max(0, node.y + PAD_TOP + CARD_H / 2 - el.clientHeight / 2),
      behavior: 'smooth',
    });
    scrolledMatch.current = key;
  }, [layout, matchSet, query, epochFilter]);

  function toggle(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const selected = selectedId ? PERSON_BY_ID[selectedId] : null;
  const innerW = layout.width + PAD_X * 2;
  const innerH = layout.height + PAD_TOP + RULER_H + 24;

  return (
    <div className="relative h-full w-full bg-cream">
      {/* ---- scrollable tree canvas ---- */}
      <div ref={scrollRef} className="scroll-soft absolute inset-0 overflow-auto">
        <div className="relative" style={{ width: innerW, minWidth: '100%', height: innerH }}>
          {/* tree layer (links + cards) */}
          <div
            className="relative"
            style={{ width: layout.width, height: layout.height, marginLeft: PAD_X, marginTop: PAD_TOP }}
          >
            <svg
              className="pointer-events-none absolute left-0 top-0"
              width={layout.width}
              height={layout.height}
              style={{ overflow: 'visible' }}
            >
              {layout.links.map((l, i) => {
                const px = l.from.x + CARD_W;
                const py = l.from.y + CARD_H / 2;
                const cx = l.to.x;
                const cy = l.to.y + CARD_H / 2;
                const mx = (px + cx) / 2;
                const color = EPOCH_BY_ID[l.to.person.epoch]?.color ?? '#1f3d3a';
                return (
                  <path
                    key={i}
                    d={`M ${px} ${py} C ${mx} ${py}, ${mx} ${cy}, ${cx} ${cy}`}
                    fill="none"
                    stroke={color}
                    strokeOpacity={0.5}
                    strokeWidth={2}
                    strokeDasharray={l.faith ? '4 4' : undefined}
                  />
                );
              })}
            </svg>

            {layout.nodes.map((n) => {
              const p = n.person;
              const epoch = EPOCH_BY_ID[p.epoch];
              const expandable = hasChildren(p.id);
              const isOpen = expanded.has(p.id);
              const isSel = selectedId === p.id;
              const isHit = matchSet ? matchSet.has(p.id) : false;
              const isDim = matchSet ? !matchSet.has(p.id) : false;
              return (
                <div
                  key={p.id}
                  className="absolute transition-opacity"
                  style={{ left: n.x, top: n.y, width: CARD_W, height: CARD_H, opacity: isDim ? 0.25 : 1 }}
                >
                  <button
                    onClick={() => setSelectedId(p.id)}
                    className={`group flex h-full w-full items-stretch overflow-hidden rounded-xl bg-white text-left shadow-sm ring-1 transition hover:shadow-md ${
                      isSel ? 'ring-2 ring-gold' : isHit ? 'ring-2 ring-gold-deep' : 'ring-teal/15'
                    }`}
                    style={p.faith ? { borderStyle: 'dashed' } : undefined}
                  >
                    <span className="w-1.5 shrink-0" style={{ background: epoch?.color ?? '#1f3d3a' }} />
                    <span className="flex min-w-0 flex-1 flex-col justify-center px-2.5 py-1.5">
                      <span className="flex items-center gap-1">
                        {p.faith && <span className="text-[10px] text-gold-deep">✦</span>}
                        <span className="truncate font-display text-[13px] font-semibold leading-tight text-teal">
                          {lang === 'de' ? p.de : p.en}
                        </span>
                      </span>
                      <span className="truncate text-[10.5px] text-ink-soft">
                        {p.born !== undefined ? formatYear(p.born, lang) : epoch ? (lang === 'de' ? epoch.de : epoch.en) : ''}
                      </span>
                    </span>
                  </button>

                  {expandable && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggle(p.id);
                      }}
                      aria-label={isOpen ? t('collapseAll') : t('expandAll')}
                      className={`absolute -right-2.5 top-1/2 z-10 grid h-5 w-5 -translate-y-1/2 place-items-center rounded-full text-[11px] font-bold text-cream shadow ring-2 ring-cream transition ${
                        isOpen ? 'bg-teal-2' : 'bg-teal'
                      }`}
                      style={{ background: isOpen ? undefined : epoch?.color }}
                    >
                      {isOpen ? '−' : '+'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* ---- time ruler (Zeitschiene) ---- */}
          <div
            className="sticky bottom-0 z-20 border-t border-teal/15 bg-cream/95 backdrop-blur"
            style={{ height: RULER_H, marginLeft: PAD_X, width: layout.width }}
          >
            <div className="relative h-full">
              {layout.ruler.map((r, i) => {
                const epoch = EPOCH_BY_ID[r.epoch];
                const prev = layout.ruler[i - 1];
                const epochStart = !prev || prev.epoch !== r.epoch;
                return (
                  <div
                    key={r.depth}
                    className="absolute top-0 h-full"
                    style={{ left: r.x, width: COL_W }}
                  >
                    <div className="h-1.5 w-full" style={{ background: epoch?.color ?? '#1f3d3a' }} />
                    {r.year !== undefined && (
                      <div className="px-1 pt-1 text-center text-[10px] font-medium text-ink-soft">
                        {formatYear(r.year, lang)}
                      </div>
                    )}
                    {epochStart && epoch && (
                      <div
                        className="truncate px-1 text-[9px] font-semibold uppercase tracking-wide"
                        style={{ color: epoch.color }}
                      >
                        {lang === 'de' ? epoch.de : epoch.en}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ---- horizontal scrollbar (sits just above the time ruler) ---- */}
      {hbar.show && (
        <div
          ref={trackRef}
          onPointerDown={onTrackDown}
          className="absolute z-[1090] h-2.5 rounded-full bg-teal/10 ring-1 ring-teal/10"
          style={{ left: 14, right: 14, bottom: RULER_H + 6 }}
        >
          <div
            onPointerDown={onThumbDown}
            onPointerMove={onThumbMove}
            onPointerUp={onThumbUp}
            className="absolute top-0 h-full min-w-[28px] cursor-grab touch-none rounded-full bg-teal/45 transition-colors hover:bg-teal/65 active:cursor-grabbing active:bg-teal/70"
            style={{ left: `${hbar.left * 100}%`, width: `${hbar.width * 100}%` }}
          />
        </div>
      )}

      {/* ---- header / toolbar ---- */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[1100] flex flex-col gap-2 p-3 pt-20 sm:p-4 sm:pt-24">
        <div className="pointer-events-auto flex flex-wrap items-center gap-2 self-start rounded-2xl bg-cream/92 px-3 py-2 shadow-lg ring-1 ring-teal/10 backdrop-blur">
          <div className="pr-1">
            <div className="font-display text-base font-semibold leading-tight text-teal">{t('treeTitle')}</div>
            <div className="text-[11px] text-ink-soft">{t('treeSubtitle')}</div>
          </div>
          <button
            onClick={() => setExpanded(new Set(ALL_PARENT_IDS))}
            className="rounded-lg bg-teal px-2.5 py-1.5 text-xs font-medium text-cream transition hover:bg-teal-2"
          >
            {t('expandAll')}
          </button>
          <button
            onClick={() => setExpanded(new Set(LINE_IDS))}
            className="rounded-lg bg-cream-2 px-2.5 py-1.5 text-xs font-medium text-ink-soft transition hover:bg-cream"
          >
            {t('collapseAll')}
          </button>

          {/* filter: search a person */}
          <div className="relative">
            <svg viewBox="0 0 24 24" className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-soft" fill="currentColor">
              <path d="M10 4a6 6 0 1 0 3.7 10.7l4.3 4.3 1.4-1.4-4.3-4.3A6 6 0 0 0 10 4zm0 2a4 4 0 1 1 0 8 4 4 0 0 1 0-8z" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('treeSearch')}
              className="w-36 rounded-lg border border-teal/15 bg-cream px-2 py-1.5 pl-7 text-xs text-ink outline-none placeholder:text-ink-soft/60 focus:border-gold sm:w-44"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                aria-label={t('reset')}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 text-ink-soft hover:text-teal"
              >
                ✕
              </button>
            )}
          </div>

          {/* filter: epoch */}
          <select
            value={epochFilter ?? ''}
            onChange={(e) => setEpochFilter(e.target.value || null)}
            className="rounded-lg border border-teal/15 bg-cream px-2 py-1.5 text-xs text-ink outline-none focus:border-gold"
            title={t('filterEpoch')}
          >
            <option value="">{t('allEpochs')}</option>
            {GEN_EPOCHS.map((e) => (
              <option key={e.id} value={e.id}>
                {lang === 'de' ? e.de : e.en}
              </option>
            ))}
          </select>

          {matchSet && (
            <span className="rounded-full bg-gold/25 px-2 py-0.5 text-[11px] font-medium text-teal">
              {matchSet.size} {t('results')}
            </span>
          )}
        </div>
        <div className="pointer-events-none self-start rounded-lg bg-cream/80 px-2.5 py-1 text-[11px] text-ink-soft shadow ring-1 ring-teal/10 backdrop-blur">
          {t('expandHint')}
        </div>
      </div>

      {/* ---- bloodline → faith note ---- */}
      <div className="pointer-events-none absolute bottom-24 left-1/2 z-[1100] hidden -translate-x-1/2 sm:block">
        <div className="pointer-events-auto max-w-xl rounded-xl bg-teal/95 px-3.5 py-2 text-center text-[11px] leading-snug text-cream/90 shadow-lg ring-1 ring-teal/20">
          {t('bloodlineNote')}
        </div>
      </div>

      {/* ---- person detail panel ---- */}
      {selected && (
        <div className="pointer-events-none absolute inset-y-0 right-0 z-[1200] flex w-full max-w-[22rem] flex-col p-3 pt-20 sm:p-4 sm:pt-24">
          <div className="pointer-events-auto flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl bg-cream/95 shadow-2xl ring-1 ring-teal/10 backdrop-blur">
            <PersonDetail
              person={selected}
              lang={lang}
              onClose={() => setSelectedId(null)}
              onSelect={setSelectedId}
              onShowOnMap={onShowOnMap}
            />
          </div>
        </div>
      )}

      {/* ---- legend ---- */}
      <div className="pointer-events-none absolute right-3 top-20 z-[1090] hidden lg:block sm:top-24">
        <div className="pointer-events-auto max-w-[12rem] rounded-xl bg-cream/90 p-2.5 shadow-lg ring-1 ring-teal/10 backdrop-blur">
          <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-ink-soft">{t('epoch')}</div>
          <div className="flex flex-col gap-0.5">
            {GEN_EPOCHS.map((e) => {
              const active = epochFilter === e.id;
              return (
                <button
                  key={e.id}
                  onClick={() => setEpochFilter(active ? null : e.id)}
                  className={`flex items-center gap-1.5 rounded px-1 py-0.5 text-left text-[10px] transition ${
                    active ? 'bg-gold/30 text-teal' : 'text-ink-soft hover:bg-cream-2'
                  } ${epochFilter && !active ? 'opacity-45' : ''}`}
                >
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: e.color }} />
                  <span className="truncate">{lang === 'de' ? e.de : e.en}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
