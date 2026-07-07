import { useMemo, useState } from 'react';
import type { Place } from '../types';
import type { Lang } from '../i18n';
import { useT } from '../i18n';
import { GENEALOGY, LINES, LINE_COLOR, type GenNode } from '../data/nationsTribes';
import { searchPlaces } from '../lib/places';

interface Props {
  places: Place[];
  lang: Lang;
  onShowPlace: (place: Place) => void;
  onExit: () => void;
}

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

export default function Genealogy({ places, lang, onShowPlace, onExit }: Props) {
  const t = useT();
  const [query, setQuery] = useState('');
  // start with the top two levels open
  const [open, setOpen] = useState<Set<string>>(() => new Set(['adam', 'noah']));

  const matches = useMemo(() => matchIds(query), [query]);
  // when searching, force-open the ancestry of every match
  const forcedOpen = useMemo(() => {
    if (!matches.size) return null;
    const s = new Set<string>();
    for (const id of matches) for (const a of ancestry(id)) s.add(a);
    return s;
  }, [matches]);

  const effectiveOpen = forcedOpen ?? open;

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

  return (
    <div className="fixed inset-0 z-[2000] flex flex-col bg-cream">
      {/* top bar */}
      <div className="flex flex-none items-center justify-between gap-3 border-b border-teal/10 bg-teal px-4 py-3 text-cream">
        <div>
          <div className="font-display text-lg font-semibold leading-tight">{t('genealogy')}</div>
          <div className="text-[11px] text-cream/75">{t('genealogySub')}</div>
        </div>
        <button
          onClick={onExit}
          className="rounded-lg bg-gold px-3 py-1.5 text-sm font-medium text-teal transition hover:bg-gold-deep"
        >
          {t('exit')} ✕
        </button>
      </div>

      {/* toolbar */}
      <div className="flex flex-none flex-wrap items-center gap-2 border-b border-teal/10 bg-cream/95 px-4 py-2.5 backdrop-blur">
        <div className="relative min-w-[12rem] flex-1">
          <svg viewBox="0 0 24 24" className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" fill="currentColor">
            <path d="M10 4a6 6 0 1 0 3.7 10.7l4.3 4.3 1.4-1.4-4.3-4.3A6 6 0 0 0 10 4zm0 2a4 4 0 1 1 0 8 4 4 0 0 1 0-8z" />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('genealogySearch')}
            className="w-full rounded-lg border border-teal/15 bg-cream px-3 py-1.5 pl-8 text-sm text-ink outline-none placeholder:text-ink-soft/60 focus:border-gold"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-ink-soft hover:text-teal"
              aria-label={t('reset')}
            >
              ✕
            </button>
          )}
        </div>
        <button
          onClick={expandAll}
          disabled={!!forcedOpen}
          className="rounded-lg bg-cream-2 px-3 py-1.5 text-sm font-medium text-teal transition hover:bg-gold/30 disabled:opacity-40"
        >
          {t('expandAll')}
        </button>
        <button
          onClick={collapseAll}
          disabled={!!forcedOpen}
          className="rounded-lg bg-cream-2 px-3 py-1.5 text-sm font-medium text-teal transition hover:bg-gold/30 disabled:opacity-40"
        >
          {t('collapseAll')}
        </button>
      </div>

      {/* legend */}
      <div className="scroll-soft flex flex-none gap-2 overflow-x-auto border-b border-teal/10 bg-cream-2/40 px-4 py-2">
        {LINES.map((l) => (
          <span key={l.id} className="flex flex-none items-center gap-1.5 text-[11px] text-ink-soft">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: l.color }} />
            {lang === 'de' ? l.de : l.en}
          </span>
        ))}
      </div>

      {/* tree */}
      <div className="scroll-soft mx-auto w-full max-w-4xl flex-1 overflow-y-auto px-3 py-4 sm:px-6">
        {query && !matches.size && (
          <p className="mb-3 rounded-xl bg-cream-2/50 px-4 py-3 text-center text-sm text-ink-soft">{t('noResults')}</p>
        )}
        <TreeNode
          node={GENEALOGY}
          depth={0}
          lang={lang}
          open={effectiveOpen}
          matches={matches}
          onToggle={toggle}
          resolvePlace={resolvePlace}
          onShowPlace={onShowPlace}
        />
        <p className="mt-6 border-t border-teal/10 pt-3 text-[11px] leading-relaxed text-ink-soft">
          {t('genealogyNote')}
        </p>
      </div>
    </div>
  );
}

interface NodeProps {
  node: GenNode;
  depth: number;
  lang: Lang;
  open: Set<string>;
  matches: Set<string>;
  onToggle: (id: string) => void;
  resolvePlace: (term?: string) => Place | null;
  onShowPlace: (place: Place) => void;
}

function TreeNode({ node, depth, lang, open, matches, onToggle, resolvePlace, onShowPlace }: NodeProps) {
  const t = useT();
  const color = node.line ? LINE_COLOR[node.line] : '#8a7a5c';
  const hasChildren = !!node.children?.length;
  const isOpen = open.has(node.id);
  const isMatch = matches.has(node.id);
  const place = resolvePlace(node.place);
  const name = lang === 'de' ? node.de : node.en;

  return (
    <div className="relative" style={depth > 0 ? { marginLeft: 14 } : undefined}>
      {depth > 0 && (
        <span className="absolute left-0 top-0 bottom-0 w-px" style={{ background: `${color}55` }} />
      )}
      <div className="relative pl-3">
        <div
          className={`group flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg py-1 pr-2 transition ${
            isMatch ? 'bg-gold/25' : ''
          }`}
        >
          {/* toggle / bullet */}
          {hasChildren ? (
            <button
              onClick={() => onToggle(node.id)}
              className="grid h-5 w-5 flex-none place-items-center rounded text-cream transition hover:brightness-110"
              style={{ background: color }}
              aria-label={isOpen ? t('collapseAll') : t('expandAll')}
            >
              <svg viewBox="0 0 24 24" className={`h-3.5 w-3.5 transition-transform ${isOpen ? 'rotate-90' : ''}`} fill="currentColor">
                <path d="M9 6l6 6-6 6z" />
              </svg>
            </button>
          ) : (
            <span className="h-2.5 w-2.5 flex-none rounded-full" style={{ background: color }} />
          )}

          <span className="font-display text-[15px] font-semibold text-ink">{name}</span>

          {node.people && (
            <span
              className="rounded-full px-2 py-0.5 text-[11px] font-medium text-cream"
              style={{ background: color }}
            >
              {lang === 'de' ? node.people.de : node.people.en}
            </span>
          )}
          {node.region && (
            <span className="rounded-full bg-cream-2 px-2 py-0.5 text-[11px] text-ink-soft">
              {lang === 'de' ? node.region.de : node.region.en}
            </span>
          )}
          {node.ref && <span className="text-[10px] font-medium text-ink-soft/70">{node.ref}</span>}

          {place && (
            <button
              onClick={() => onShowPlace(place)}
              title={t('showOnMap')}
              className="ml-auto inline-flex items-center gap-1 rounded-full bg-teal/10 px-2 py-0.5 text-[11px] font-medium text-teal opacity-80 transition hover:bg-teal hover:text-cream"
            >
              <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor">
                <path d="M12 2C8.7 2 6 4.7 6 8c0 4.4 6 12 6 12s6-7.6 6-12c0-3.3-2.7-6-6-6zm0 8.2A2.2 2.2 0 1 1 12 5.8a2.2 2.2 0 0 1 0 4.4z" />
              </svg>
              {t('showOnMap')}
            </button>
          )}
        </div>

        {node.note && (
          <div className="pl-7 text-[12px] leading-snug text-ink-soft">{lang === 'de' ? node.note.de : node.note.en}</div>
        )}

        {/* linear spine (compact breadcrumb of single-child generations) */}
        {node.spine && node.spine.length > 0 && (
          <div className="mt-1 flex flex-wrap items-center gap-1 pl-7">
            {node.spine.map((s, i) => (
              <span key={i} className="flex items-center gap-1">
                <span className="text-ink-soft/50">→</span>
                <span className="rounded-md bg-cream-2/70 px-1.5 py-0.5 text-[12px] text-ink-soft">
                  {lang === 'de' ? s.de : s.en}
                </span>
              </span>
            ))}
            <span className="text-ink-soft/50">→</span>
          </div>
        )}
      </div>

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
              onToggle={onToggle}
              resolvePlace={resolvePlace}
              onShowPlace={onShowPlace}
            />
          ))}
        </div>
      )}
    </div>
  );
}
