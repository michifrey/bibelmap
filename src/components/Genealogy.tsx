import { useMemo, useState } from 'react';
import type { Place } from '../types';
import type { Lang } from '../i18n';
import { useT } from '../i18n';
import { GENEALOGY, LINES, LINE_COLOR, NODE_BY_ID, type GenNode } from '../data/nationsTribes';
import { searchPlaces } from '../lib/places';
import TribesMap from './TribesMap';
import TreeView from './TreeView';

interface Props {
  places: Place[];
  lang: Lang;
  onShowPlace: (place: Place) => void;
  /** For the Zeitstrahl tab: reveal a person coming from the church-history map. */
  focusId?: string | null;
  /** For the Zeitstrahl tab: open the church-history map on a person. */
  onShowOnMap?: (personId: string) => void;
}

type Tab = 'timeline' | 'tree' | 'map';

function norm(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// Collect every node id and every name (de/en) for search + expand-to-match.
function walk(node: GenNode, visit: (n: GenNode, depth: number) => void, depth = 0) {
  visit(node, depth);
  for (const c of node.children ?? []) walk(c, visit, depth + 1);
}

/** ids of nodes whose own name (or a spine name) matches the query. */
function matchIds(query: string): Set<string> {
  const q = norm(query.trim());
  const ids = new Set<string>();
  if (!q) return ids;
  walk(GENEALOGY, (n) => {
    const names = [n.de, n.en, ...(n.spine?.flatMap((s) => [s.de, s.en]) ?? [])];
    if (names.some((name) => norm(name).includes(q))) ids.add(n.id);
  });
  return ids;
}

/** parent map so a match can auto-expand its whole ancestry. */
const PARENT: Record<string, string | null> = (() => {
  const map: Record<string, string | null> = { [GENEALOGY.id]: null };
  walk(GENEALOGY, (n) => {
    for (const c of n.children ?? []) map[c.id] = n.id;
  });
  return map;
})();

function ancestry(id: string): string[] {
  const out: string[] = [];
  let cur: string | null = id;
  while (cur) {
    out.push(cur);
    cur = PARENT[cur] ?? null;
  }
  return out;
}

export default function Genealogy({ places, lang, onShowPlace, focusId, onShowOnMap }: Props) {
  const t = useT();
  const [tab, setTab] = useState<Tab>('timeline');
  const [query, setQuery] = useState('');
  // start with the top two levels open
  const [open, setOpen] = useState<Set<string>>(() => new Set(['adam', 'noah']));

  // Jump from the map into the tree, focused on the tapped tribe/people/person.
  function openInTree(id: string) {
    const n = NODE_BY_ID[id];
    setQuery(n ? (lang === 'de' ? n.de : n.en) : '');
    setTab('tree');
  }

  const matches = useMemo(() => matchIds(query), [query]);
  // when searching, force-open the ancestry of every match
  const forcedOpen = useMemo(() => {
    if (!matches.size) return null;
    const s = new Set<string>();
    for (const id of matches) for (const a of ancestry(id)) s.add(a);
    return s;
  }, [matches]);

  const effectiveOpen = forcedOpen ?? open;

  /** The node whose detail the side panel shows. */
  const [detailId, setDetailId] = useState<string | null>(null);
  /** Highlighted line, or null. Dims everything that does not belong to it. */
  const [line, setLine] = useState<string | null>(null);

  // How many names each line carries. The legend was eleven anonymous dots;
  // the numbers are what make it a map of the tree rather than a colour key.
  const lineCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    let total = 0;
    walk(GENEALOGY, (n) => {
      total += 1 + (n.spine?.length ?? 0);
      if (n.line) counts[n.line] = (counts[n.line] ?? 0) + 1 + (n.spine?.length ?? 0);
    });
    return { counts, total };
  }, []);

  function toggle(id: string) {
    if (forcedOpen) return; // during search the tree is auto-expanded
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function expandAll() {
    const all = new Set<string>();
    walk(GENEALOGY, (n) => {
      if (n.children?.length) all.add(n.id);
    });
    setOpen(all);
  }
  function collapseAll() {
    setOpen(new Set(['adam']));
  }

  function resolvePlace(term?: string): Place | null {
    if (!term) return null;
    return searchPlaces(places, term, 1)[0] ?? null;
  }

  const TABS: { id: Tab; label: string }[] = [
    { id: 'timeline', label: t('ntTimeline') /* Zeitstrahl */ },
    { id: 'tree', label: t('ntTree') /* Stammbaum */ },
    { id: 'map', label: t('ntMap') /* Karte */ },
  ];

  return (
    <div className="absolute inset-0 bg-deepest">
      {/* Sub-tabs float over the view. On a phone the app header is two rows
          tall, so they have to start below it — at top-2 they landed on the
          wordmark and pushed the toolbar under the view switch. */}
      <div className="pointer-events-none absolute inset-x-0 top-[6.75rem] z-[1160] flex justify-center px-2 sm:top-3">
        <div className="pointer-events-auto flex overflow-hidden bg-deepest/95 ring-1 ring-white/10 backdrop-blur">
          {TABS.map((tb) => (
            <button
              key={tb.id}
              onClick={() => setTab(tb.id)}
              className={`px-3 py-1.5 text-xs font-medium transition sm:text-sm ${ tab === tb.id ? 'bg-signal text-white' : 'text-white/60 hover:bg-surface' }`}
            >
              {tb.label}
            </button>
          ))}
        </div>
      </div>

      {/* ---- Zeitstrahl (timeline) ---- */}
      {tab === 'timeline' && (
        <div className="absolute inset-0">
          <TreeView lang={lang} focusId={focusId} onShowOnMap={onShowOnMap} />
        </div>
      )}

      {/* ---- Karte (tribes map) ---- */}
      {tab === 'map' && (
        <div className="absolute inset-0">
          <TribesMap lang={lang} onOpenInTree={openInTree} />
        </div>
      )}

      {/* ---- Stammbaum (nations & tribes tree) ---- */}
      {tab === 'tree' && (
        <div className="absolute inset-0 flex flex-col pt-[9.75rem] sm:pt-16">
          {/* toolbar */}
          <div className="flex flex-none flex-wrap items-center gap-2 border-b border-white/10 bg-deepest px-3 py-2.5 sm:px-5">
            <div className="relative min-w-[11rem] flex-1 sm:max-w-xs">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/45" fill="currentColor">
                <path d="M10 4a6 6 0 1 0 3.7 10.7l4.3 4.3 1.4-1.4-4.3-4.3A6 6 0 0 0 10 4zm0 2a4 4 0 1 1 0 8 4 4 0 0 1 0-8z" />
              </svg>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('genealogySearch')}
                aria-label={t('genealogySearch')}
                className="bm-input py-2 pl-8 pr-16 text-[13px]"
              />
              {query && (
                <span className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1.5">
                  <span className="bg-signal px-1.5 py-0.5 text-[10px] font-extrabold text-white">
                    {matches.size}
                  </span>
                  <button onClick={() => setQuery('')} className="text-white/60 hover:text-white" aria-label={t('reset')}>
                    ✕
                  </button>
                </span>
              )}
            </div>

            <span className="mx-1 hidden h-6 w-px bg-white/15 sm:block" />

            <button onClick={expandAll} disabled={!!forcedOpen} className="bm-btn bm-btn-ghost px-3 py-2 text-[11px]">
              {t('expandAll')}
            </button>
            <button onClick={collapseAll} disabled={!!forcedOpen} className="bm-btn bm-btn-ghost px-3 py-2 text-[11px]">
              {t('collapseAll')}
            </button>

            <div className="flex-1" />
            <span className="hidden max-w-md truncate text-[11px] text-white/40 xl:block">
              {t('genealogySources')}
            </span>
          </div>

          {/* mobile: the lines stay a strip; there is no room for the rail */}
          <div className="scroll-soft flex flex-none gap-1.5 overflow-x-auto border-b border-white/10 bg-deepest/80 px-3 py-2 lg:hidden">
            {LINES.map((l) => (
              <button
                key={l.id}
                onClick={() => setLine(line === l.id ? null : l.id)}
                aria-pressed={line === l.id}
                className={`flex flex-none items-center gap-1.5 px-2 py-1 text-[11px] transition ${
                  line === l.id ? 'bg-surface text-white' : 'text-white/60'
                }`}
              >
                <i className="h-3 w-[3px] flex-none" style={{ background: l.color }} />
                {lang === 'de' ? l.de : l.en}
                <span className="bm-num text-[10px] text-white/40">{lineCounts.counts[l.id] ?? 0}</span>
              </button>
            ))}
          </div>

          <div className="flex min-h-0 flex-1">
            {/* ---- lines rail ---- */}
            <aside className="hidden w-56 flex-none flex-col border-r border-white/10 bg-deepest lg:flex">
              <div className="bm-eyebrow flex-none px-4 pb-2 pt-4">{t('genLines')}</div>
              <div className="scroll-soft min-h-0 flex-1 overflow-y-auto pb-2">
                {LINES.map((l) => {
                  const on = line === l.id;
                  return (
                    <button
                      key={l.id}
                      onClick={() => setLine(on ? null : l.id)}
                      aria-pressed={on}
                      className={`flex w-full items-stretch gap-2.5 px-4 py-2 text-left transition ${
                        on ? 'bg-surface' : 'hover:bg-white/6'
                      }`}
                    >
                      <i className="w-[5px] flex-none self-stretch" style={{ background: l.color }} />
                      <span
                        className={`min-w-0 flex-1 text-[11.5px] font-bold leading-tight ${on ? 'text-white' : 'text-white/85'}`}
                      >
                        {lang === 'de' ? l.de : l.en}
                      </span>
                      <span className={`bm-num self-center text-[11px] ${on ? 'text-white/75' : 'text-white/40'}`}>
                        {lineCounts.counts[l.id] ?? 0}
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="flex-none border-t border-white/10 px-4 py-4">
                <div className="bm-num text-[34px] text-gold">{lineCounts.total}</div>
                <div className="bm-eyebrow mt-1.5 text-white/50">{t('genNamesInTree')}</div>
              </div>
            </aside>

            {/* ---- tree canvas ---- */}
            <div className="bm-dots scroll-soft min-w-0 flex-1 overflow-y-auto px-3 py-4 sm:px-6">
              {query && !matches.size && (
                <p className="mb-3 bg-surface/50 px-4 py-3 text-center text-sm text-white/60">{t('noResults')}</p>
              )}
              <TreeNode
                node={GENEALOGY}
                depth={0}
                lang={lang}
                open={effectiveOpen}
                matches={matches}
                dimLine={line}
                detailId={detailId}
                onSelect={setDetailId}
                onToggle={toggle}
              />
              <p className="mt-6 max-w-3xl border-t border-white/10 pt-3 text-[11px] leading-relaxed text-white/50">
                {t('genealogyNote')}
              </p>
            </div>

            {/* ---- detail ---- */}
            <aside className="hidden w-80 flex-none border-l border-white/10 xl:block">
              <NodeDetail
                node={detailId ? NODE_BY_ID[detailId] : null}
                lang={lang}
                resolvePlace={resolvePlace}
                onShowPlace={onShowPlace}
                onClose={() => setDetailId(null)}
              />
            </aside>
          </div>

          {/* below xl the detail comes up from the bottom instead */}
          {detailId && (
            <div className="absolute inset-x-0 bottom-0 z-[1170] max-h-[62vh] overflow-y-auto border-t border-white/10 xl:hidden">
              <NodeDetail
                node={NODE_BY_ID[detailId]}
                lang={lang}
                resolvePlace={resolvePlace}
                onShowPlace={onShowPlace}
                onClose={() => setDetailId(null)}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface NodeProps {
  node: GenNode;
  depth: number;
  lang: Lang;
  open: Set<string>;
  matches: Set<string>;
  /** When a line is picked, everything outside it recedes. */
  dimLine: string | null;
  detailId: string | null;
  onSelect: (id: string) => void;
  onToggle: (id: string) => void;
}

/**
 * One name in the tree. A card with the line's colour on its edge, not a text
 * row: at three hundred names the old flat rows gave a father the same weight
 * as his twelve sons.
 */
function TreeNode({ node, depth, lang, open, matches, dimLine, detailId, onSelect, onToggle }: NodeProps) {
  const color = node.line ? LINE_COLOR[node.line] : '#8a7a5c';
  const hasChildren = !!node.children?.length;
  const isOpen = open.has(node.id);
  const isMatch = matches.has(node.id);
  const isDetail = detailId === node.id;
  const dim = dimLine !== null && node.line !== dimLine;
  const name = lang === 'de' ? node.de : node.en;
  // One subtitle, in order of how much it says about the name.
  const sub = node.people ?? node.region ?? node.note;

  return (
    <div className="relative" style={depth > 0 ? { marginLeft: 20 } : undefined}>
      {depth > 0 && <span className="absolute -left-[10px] bottom-0 top-0 w-px" style={{ background: `${color}40` }} />}

      <div className={`flex items-stretch gap-1.5 py-[3px] ${dim ? 'opacity-35' : ''}`}>
        {hasChildren ? (
          <button
            onClick={() => onToggle(node.id)}
            className="grid w-[22px] flex-none place-items-center text-white transition hover:brightness-125"
            style={{ background: color }}
            // Not "expand all": this opens one name, and that is what it has
            // to say. aria-expanded carries the state.
            aria-label={name}
            aria-expanded={isOpen}
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className={`h-3.5 w-3.5 transition-transform ${isOpen ? 'rotate-90' : ''}`} fill="currentColor">
              <path d="M9 6l6 6-6 6z" />
            </svg>
          </button>
        ) : (
          <span className="w-[22px] flex-none" />
        )}

        <button
          onClick={() => onSelect(node.id)}
          aria-pressed={isDetail}
          className={`flex min-w-0 max-w-2xl flex-1 items-center gap-3 border-l-[3px] px-3 py-1.5 text-left transition ${
            isDetail ? 'bg-surface' : isMatch ? 'bg-gold/25' : 'bg-deepest/70 hover:bg-surface/70'
          }`}
          style={{ borderLeftColor: color, outline: isDetail ? '1px solid var(--color-gold)' : undefined }}
        >
          <span className="min-w-0 flex-1">
            <span className="block truncate font-display text-[13px] font-extrabold uppercase tracking-[0.03em] text-white">
              {name}
            </span>
            {sub && (
              <span className="mt-0.5 block truncate text-[11px] text-white/55">
                {lang === 'de' ? sub.de : sub.en}
              </span>
            )}
          </span>
          {hasChildren && (
            <span className="flex-none px-1.5 py-0.5 text-[10px] font-black text-white" style={{ background: color }}>
              +{node.children!.length}
            </span>
          )}
        </button>
      </div>

      {/* the single-child generations, collapsed into one dashed strip */}
      {node.spine && node.spine.length > 0 && (
        <div
          className={`ml-[27px] mt-0.5 max-w-2xl truncate border border-dashed border-white/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-white/45 ${
            dim ? 'opacity-35' : ''
          }`}
        >
          {node.spine.map((s) => (lang === 'de' ? s.de : s.en)).join(' · ')}
        </div>
      )}

      {hasChildren && isOpen && (
        <div className="mt-0.5">
          {node.children!.map((c) => (
            <TreeNode
              key={c.id}
              node={c}
              depth={depth + 1}
              lang={lang}
              open={open}
              matches={matches}
              dimLine={dimLine}
              detailId={detailId}
              onSelect={onSelect}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * The detail card. White, because this is the one surface in the view that has
 * to carry long copy — the note, the region and the full generation chain used
 * to be crammed into the row itself.
 */
function NodeDetail({
  node,
  lang,
  resolvePlace,
  onShowPlace,
  onClose,
}: {
  node: GenNode | null | undefined;
  lang: Lang;
  resolvePlace: (term?: string) => Place | null;
  onShowPlace: (place: Place) => void;
  onClose: () => void;
}) {
  const t = useT();

  if (!node) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 bg-deepest px-8 text-center">
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-8 w-8 text-white/20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <rect x="9" y="3" width="6" height="4" />
          <path d="M12 7v3M5 14v-2.5h14V14" />
          <rect x="2" y="14" width="6" height="4" />
          <rect x="16" y="14" width="6" height="4" />
          <path d="M12 10v8" />
        </svg>
        <p className="text-[12px] leading-relaxed text-white/40">{t('genPickName')}</p>
      </div>
    );
  }

  const color = node.line ? LINE_COLOR[node.line] : '#8a7a5c';
  const lineName = LINES.find((l) => l.id === node.line);
  const place = resolvePlace(node.place);
  const name = lang === 'de' ? node.de : node.en;
  const pick = (b?: { de: string; en: string }) => (b ? (lang === 'de' ? b.de : b.en) : null);

  return (
    <div className="flex h-full flex-col bg-paper">
      <div className="flex items-start gap-3 px-5 py-4" style={{ background: color }}>
        <div className="min-w-0 flex-1">
          {lineName && (
            <div className="bm-eyebrow text-white/75">{lang === 'de' ? lineName.de : lineName.en}</div>
          )}
          <div className="mt-1.5 font-display text-2xl font-black uppercase leading-none tracking-tight text-white">
            {name}
          </div>
          {node.ref && <div className="mt-1.5 text-[11px] font-bold text-white/75">{node.ref}</div>}
        </div>
        <button
          onClick={onClose}
          aria-label={t('close')}
          className="grid h-7 w-7 flex-none place-items-center bg-black/20 text-white transition hover:bg-black/35"
        >
          ✕
        </button>
      </div>

      <div className="scroll-soft min-h-0 flex-1 overflow-y-auto px-5 py-5">
        {node.people && (
          <>
            <div className="bm-eyebrow text-signal-deep">{t('genPeoples')}</div>
            <p className="mt-1.5 text-sm font-bold leading-snug text-ink">{pick(node.people)}</p>
          </>
        )}
        {node.region && (
          <>
            <div className="bm-eyebrow mt-4 text-signal">{t('genRegion')}</div>
            <p className="mt-1.5 text-sm font-medium leading-snug text-ink">{pick(node.region)}</p>
          </>
        )}
        {node.note && (
          <p className="mt-4 text-[13px] leading-[1.7] text-[#5c6b69]">{pick(node.note)}</p>
        )}

        {node.spine && node.spine.length > 0 && (
          <>
            <div className="bm-eyebrow mt-5 text-signal">{t('genGenerations')}</div>
            <ol className="mt-2 space-y-1">
              {node.spine.map((s, i) => (
                <li key={i} className="flex items-baseline gap-2.5 text-[13px] text-ink">
                  <span className="bm-num w-5 flex-none text-right text-[11px] text-ink-soft">{i + 1}</span>
                  {lang === 'de' ? s.de : s.en}
                </li>
              ))}
            </ol>
          </>
        )}

        {node.children?.length ? (
          <>
            <div className="bm-eyebrow mt-5 text-signal">{t('children')}</div>
            <p className="mt-1.5 flex flex-wrap gap-1.5">
              {node.children.map((c) => (
                <span key={c.id} className="bg-paper-2 px-2 py-1 text-[11.5px] font-semibold text-ink">
                  {lang === 'de' ? c.de : c.en}
                </span>
              ))}
            </p>
          </>
        ) : null}

        {place && (
          <button
            onClick={() => onShowPlace(place)}
            className="mt-6 inline-flex items-center gap-2.5 bg-deep px-4 py-3 text-[11px] font-extrabold uppercase tracking-[0.1em] text-white transition hover:bg-deepest"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5 text-gold" fill="currentColor">
              <path d="M12 2C8.7 2 6 4.7 6 8c0 4.4 6 12 6 12s6-7.6 6-12c0-3.3-2.7-6-6-6zm0 8.2A2.2 2.2 0 1 1 12 5.8a2.2 2.2 0 0 1 0 4.4z" />
            </svg>
            {t('showOnMap')}
          </button>
        )}
      </div>
    </div>
  );
}
