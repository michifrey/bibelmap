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
import { docsFor } from '../data/personSources';
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
/** Untergrenze für den Abstand nach oben – gemessen wird die Werkzeugleiste. */
const PAD_TOP_MIN = 196;
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

  /*
   * Die Werkzeugleiste schwebt über der Fläche, und wie hoch sie ist, hängt
   * von der Breite ab: auf dem Telefon bricht sie in fünf Zeilen um. Eine feste
   * Zahl traf sie nie – die erste Reihe lag darunter, und beim Start stand
   * Adam hinter der Leiste statt darunter. Also wird sie gemessen.
   */
  const chromeRef = useRef<HTMLDivElement>(null);
  const [padTop, setPadTop] = useState(PAD_TOP_MIN);
  useEffect(() => {
    const el = chromeRef.current;
    if (!el) return;
    const sync = () => setPadTop(Math.max(PAD_TOP_MIN, Math.round(el.getBoundingClientRect().bottom) + 20));
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    window.addEventListener('resize', sync);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', sync);
    };
  }, []);

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
    // Direkt gemessen statt aus dem Zustand: dieser Lauf ist derselbe wie der,
    // in dem die Messung erst gesetzt wird – der Zustand trägt hier noch den
    // Anfangswert.
    const pad = Math.max(PAD_TOP_MIN, Math.round(chromeRef.current?.getBoundingClientRect().bottom ?? 0) + 20);
    el.scrollTop = Math.max(0, root.y + pad + CARD_H / 2 - el.clientHeight / 2);
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
      top: Math.max(0, node.y + padTop + CARD_H / 2 - el.clientHeight / 2),
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
      top: Math.max(0, node.y + padTop + CARD_H / 2 - el.clientHeight / 2),
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
  const innerH = layout.height + padTop + RULER_H + 24;

  return (
    <div className="relative h-full w-full bg-deepest">
      {/* ---- scrollable tree canvas ---- */}
      <div ref={scrollRef} className="scroll-soft absolute inset-0 overflow-auto">
        <div className="relative" style={{ width: innerW, minWidth: '100%', height: innerH }}>
          {/* tree layer (links + cards) */}
          <div
            className="relative"
            style={{ width: layout.width, height: layout.height, marginLeft: PAD_X, marginTop: padTop }}
          >
            <svg
              aria-hidden="true"
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
              // Wer Zeitdokumente hat, trägt sie als kleine Zahl am Knoten –
              // sonst findet man sie nur durch Ausprobieren.
              const docCount = docsFor(p.id).length;
              return (
                <div
                  key={p.id}
                  className="absolute transition-opacity"
                  style={{ left: n.x, top: n.y, width: CARD_W, height: CARD_H, opacity: isDim ? 0.25 : 1 }}
                >
                  <button
                    onClick={() => setSelectedId(p.id)}
                    className={`group flex h-full w-full items-stretch overflow-hidden bg-surface text-left ring-1 transition hover:brightness-125 ${ isSel ? 'ring-2 ring-gold' : isHit ? 'ring-2 ring-gold-deep' : 'ring-white/10' }`}
                    style={p.faith ? { borderStyle: 'dashed' } : undefined}
                  >
                    <span className="w-1.5 shrink-0" style={{ background: epoch?.color ?? '#1f3d3a' }} />
                    <span className="flex min-w-0 flex-1 flex-col justify-center px-2.5 py-1.5">
                      <span className="flex items-center gap-1">
                        {p.faith && <span className="text-[10px] text-gold-deep">✦</span>}
                        <span className="truncate font-display text-[13px] font-semibold leading-tight text-white">
                          {lang === 'de' ? p.de : p.en}
                        </span>
                      </span>
                      <span className="truncate text-[10.5px] text-white/60">
                        {p.born !== undefined ? formatYear(p.born, lang) : epoch ? (lang === 'de' ? epoch.de : epoch.en) : ''}
                      </span>
                    </span>
                    {docCount > 0 && (
                      <span
                        className="flex shrink-0 items-center gap-0.5 self-center pr-1.5 text-[9.5px] font-semibold tabular-nums text-gold-deep"
                        title={`${docCount} ${t('timeDocs')}`}
                      >
                        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-2.5 w-2.5" fill="currentColor">
                          <path d="M6 2h8l4 4v16H6zm7 1.5V7h3.5zM8 10h8v1.5H8zm0 3.5h8V15H8zm0 3.5h5v1.5H8z" />
                        </svg>
                        {docCount}
                      </span>
                    )}
                  </button>

                  {expandable && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggle(p.id);
                      }}
                      /*
                       * Der Name des Knotens, nicht „Alle ausklappen“: es gibt
                       * 400 dieser Knöpfe, und ein Vorlesegerät las sie alle
                       * gleich vor. `aria-expanded` sagt dazu, wie er steht.
                       */
                      aria-label={lang === 'de' ? p.de : p.en}
                      aria-expanded={isOpen}
                      className="absolute -right-2.5 top-1/2 z-10 grid h-5 w-5 -translate-y-1/2 place-items-center rounded-full bg-signal text-[11px] font-bold text-white ring-2 ring-deepest transition"
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
            className="sticky bottom-0 z-20 border-t border-white/10 bg-deepest/95 backdrop-blur"
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
                      <div className="px-1 pt-1 text-center text-[10px] font-medium text-white/60">
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
          className="absolute z-[1090] h-2.5 rounded-full bg-abyss/80 ring-1 ring-white/10"
          style={{ left: 14, right: 14, bottom: RULER_H + 6 }}
        >
          {/* Griff und Schiene trugen dieselbe Farbe – man sah nicht, wo man
              greifen kann, und beim Ziehen änderte sich nichts. */}
          <div
            onPointerDown={onThumbDown}
            onPointerMove={onThumbMove}
            onPointerUp={onThumbUp}
            className="absolute top-0 h-full min-w-[28px] cursor-grab touch-none rounded-full bg-white/35 transition-colors hover:bg-white/55 active:cursor-grabbing active:bg-gold"
            style={{ left: `${hbar.left * 100}%`, width: `${hbar.width * 100}%` }}
          />
        </div>
      )}

      {/* ---- header / toolbar ---- */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[1100] flex flex-col p-3 pt-36 sm:p-4 sm:pt-24">
        {/* Ein Kasten, nicht zwei: Werkzeuge und Hinweis standen als getrennte
            Tafeln übereinander in derselben Ecke. */}
        <div ref={chromeRef} className="pointer-events-auto self-start bg-deepest/95 ring-1 ring-white/10 backdrop-blur">
        <div className="flex flex-wrap items-center gap-2 px-3 py-2">
          <div className="pr-1">
            <div className="font-display text-base font-semibold leading-tight text-white">{t('treeTitle')}</div>
            <div className="text-[11px] text-white/60">{t('treeSubtitle')}</div>
          </div>
          <button onClick={() => setExpanded(new Set(ALL_PARENT_IDS))} className="bm-btn bm-btn-signal">
            {t('expandAll')}
          </button>
          <button onClick={() => setExpanded(new Set(LINE_IDS))} className="bm-btn bm-btn-ghost">
            {t('collapseAll')}
          </button>

          {/* filter: search a person */}
          <div className="relative">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/60" fill="currentColor">
              <path d="M10 4a6 6 0 1 0 3.7 10.7l4.3 4.3 1.4-1.4-4.3-4.3A6 6 0 0 0 10 4zm0 2a4 4 0 1 1 0 8 4 4 0 0 1 0-8z" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('treeSearch')}
              aria-label={t('treeSearch')}
              className="w-36 border border-white/10 bg-deepest px-2 py-1.5 pl-7 text-xs text-white outline-none placeholder:text-white/45 focus:border-gold sm:w-44"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                aria-label={t('reset')}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/*
            Der Epochenfilter steht doppelt: rechts als farbige Liste, hier als
            Auswahlfeld. Die Liste ist die bessere Fassung – sie zeigt die
            Farben, nach denen die Karten gestreift sind –, aber sie erscheint
            erst ab lg. Also hier nur darunter.
          */}
          <select
            value={epochFilter ?? ''}
            onChange={(e) => setEpochFilter(e.target.value || null)}
            className="bm-select py-1.5 text-xs lg:hidden"
            aria-label={t('filterEpoch')}
          >
            <option value="">{t('allEpochs')}</option>
            {GEN_EPOCHS.map((e) => (
              <option key={e.id} value={e.id}>
                {lang === 'de' ? e.de : e.en}
              </option>
            ))}
          </select>

          {matchSet && (
            <span className="bm-chip">
              <span className="bm-num text-gold">{matchSet.size}</span> {t('results')}
            </span>
          )}
        </div>
        <div className="max-w-[42rem] border-t border-white/10 px-3 py-1.5 text-[11px] leading-snug text-white/60">
          {t('expandHint')}
          {/* Warum manche Linien gestrichelt sind, gehört zu den Linien – nicht
              als Kasten in die Mitte der leeren Fläche, wo es vorher schwebte. */}
          <span className="hidden sm:inline"> · {t('bloodlineNote')}</span>
        </div>
        </div>
      </div>

      {/* ---- person detail panel ---- */}
      {selected && (
        <div className="pointer-events-none absolute inset-y-0 right-0 z-[1200] flex w-full max-w-[22rem] flex-col p-3 pt-36 sm:p-4 sm:pt-24">
          <div className="pointer-events-auto flex min-h-0 flex-1 flex-col overflow-hidden bg-deepest/95 ring-1 ring-white/10 backdrop-blur">
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
        <div className="pointer-events-auto max-w-[12rem] bg-deepest/95 p-2.5 ring-1 ring-white/10 backdrop-blur">
          <div className="bm-eyebrow bm-eyebrow-dim mb-1.5">{t('epoch')}</div>
          <div className="flex flex-col gap-0.5">
            {GEN_EPOCHS.map((e) => {
              const active = epochFilter === e.id;
              return (
                <button
                  key={e.id}
                  onClick={() => setEpochFilter(active ? null : e.id)}
                  className={`flex items-center gap-1.5 px-1 py-0.5 text-left text-[10px] transition ${ active ? 'bg-gold/30 text-white' : 'text-white/60 hover:bg-surface' } ${epochFilter && !active ? 'opacity-45' : ''}`}
                >
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: e.color }} />
                  <span className="truncate">{lang === 'de' ? e.de : e.en}</span>
                </button>
              );
            })}
          </div>

          {/* Die gestrichelte Linie ist eine eigene Zeichenerklärung – sie
              gehört zur Legende, nicht in einen schwebenden Kasten. */}
          <div className="mt-2 flex items-center gap-1.5 border-t border-white/10 pt-2 text-[10px] text-white/60">
            <svg aria-hidden="true" viewBox="0 0 16 4" className="h-1 w-4 flex-none">
              <path d="M0 2h16" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
            </svg>
            <span>{t('faithLine')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
