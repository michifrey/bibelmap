import { useEffect, useState } from 'react';
import type { Place } from '../types';
import { useT } from '../i18n';
import { loadMedia, mediaForPlace, type MediaGroup } from '../lib/media';

/** Podcast episodes and videos that deal with a passage this place occurs in. */
export default function PlaceMedia({ place }: { place: Place }) {
  const t = useT();
  const [groups, setGroups] = useState<MediaGroup[] | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    setGroups(null);
    setExpanded(null);
    loadMedia().then((index) => {
      if (live) setGroups(mediaForPlace(index, place));
    });
    return () => {
      live = false;
    };
  }, [place]);

  if (!groups?.length) return null;

  return (
    <div className="mt-5">
      <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink-soft">{t('media')}</div>

      <div className="space-y-2">
        {groups.map(({ source, episodes }) => {
          const open = expanded === source.id;
          const shown = open ? episodes : episodes.slice(0, 3);
          return (
            <div key={source.id} className="rounded-xl bg-cream-2/50 p-2.5">
              <div className="mb-1.5 flex items-baseline gap-2">
                <span className="text-sm font-semibold text-teal">{source.title}</span>
                {source.author && <span className="text-[11px] text-ink-soft">{source.author}</span>}
                <span className="ml-auto text-[11px] text-ink-soft">{episodes.length}</span>
              </div>

              <div className="space-y-1">
                {shown.map((ep) => (
                  <a
                    key={`${ep.src}-${ep.url}-${ep.title}`}
                    href={ep.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-start gap-2 rounded-lg px-1.5 py-1 transition hover:bg-cream"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="mt-0.5 h-3.5 w-3.5 flex-none text-ink-soft/50 transition group-hover:text-teal"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {source.kind === 'generated' ? (
                        <>
                          <rect x="3" y="5" width="18" height="14" rx="2" />
                          <path d="M10.5 9.5v5l4-2.5Z" />
                        </>
                      ) : (
                        <>
                          <path d="M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3Z" />
                          <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
                        </>
                      )}
                    </svg>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[12.5px] leading-snug text-ink group-hover:text-teal">
                        {ep.title}
                      </span>
                      <span className="mt-0.5 block text-[10.5px] text-ink-soft">
                        {ep.refs.map((r) => r.label).join(' · ')}
                        {ep.date ? ` · ${ep.date}` : ''}
                      </span>
                    </span>
                  </a>
                ))}
              </div>

              {episodes.length > 3 && (
                <button
                  onClick={() => setExpanded(open ? null : source.id)}
                  className="mt-1 w-full rounded-lg px-1.5 py-1 text-left text-[11px] font-medium text-teal transition hover:bg-cream"
                >
                  {open ? t('showLess') : `${t('showAll')} (${episodes.length})`}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
