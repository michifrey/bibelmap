import { useState } from 'react';

interface Props {
  ids: string[]; // one or two YouTube video IDs (book overview parts)
  title?: string;
}

/**
 * Lazy YouTube embed (privacy-enhanced nocookie domain). Shows a thumbnail with
 * a play button first and only loads the iframe on click, so the map/app stay
 * light. Supports multi-part overviews via small tabs.
 */
export default function YouTubeEmbed({ ids, title }: Props) {
  const [part, setPart] = useState(0);
  const [playing, setPlaying] = useState(false);
  const id = ids[part];
  if (!id) return null;

  return (
    <div className="w-full">
      {ids.length > 1 && (
        <div className="mb-2 flex gap-1.5">
          {ids.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setPart(i);
                setPlaying(false);
              }}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                i === part ? 'bg-teal text-cream' : 'bg-cream-2 text-teal hover:bg-gold/30'
              }`}
            >
              Teil {i + 1}
            </button>
          ))}
        </div>
      )}
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black shadow-lg">
        {playing ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
            title={title ?? 'BibleProject overview'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button onClick={() => setPlaying(true)} className="group absolute inset-0 h-full w-full" aria-label="Video abspielen">
            <img
              src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
              alt={title ?? 'BibleProject'}
              className="h-full w-full object-cover opacity-90 transition group-hover:opacity-100"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
            <span className="absolute inset-0 grid place-items-center">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-black/60 ring-2 ring-white/80 transition group-hover:bg-clay">
                <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7 text-white" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </span>
          </button>
        )}
      </div>
      <div className="mt-1.5 text-[11px] text-ink-soft">
        Video: ©{' '}
        <a href="https://bibleproject.com" target="_blank" rel="noreferrer" className="underline hover:text-teal">
          BibleProject
        </a>{' '}
        (YouTube)
      </div>
    </div>
  );
}
