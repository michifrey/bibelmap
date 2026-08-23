import type { ReactNode } from 'react';

interface Props {
  /** Rubric in the header row; doubles as the collapse handle on mobile. */
  title: string;
  /** Mobile-only: collapsed by default; desktop always shows the body. */
  open?: boolean;
  onToggle?: () => void;
  /** Header content to the right of the title. */
  actions?: ReactNode;
  children: ReactNode;
}

/**
 * The band that floats along the bottom of the map — the era timeline and the
 * year slider take turns in it.
 *
 * On desktop it starts clear of the search rail (22rem + its padding): centred
 * over the full width, it slid underneath the rail and cut the last few search
 * results off. On mobile it sits above the search sheet's peek handle.
 */
export default function MapPanel({ title, open = false, onToggle, actions, children }: Props) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-[3.75rem] z-[1100] flex justify-center p-2 sm:bottom-0 sm:left-[23.5rem] sm:p-4">
      <div className="bm-panel pointer-events-auto w-full max-w-5xl p-3 sm:p-4">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          {/* No `order` here: it stays first by DOM order, and callers that need
              to reflow their own header on narrow screens order themselves
              relative to it (see YearSlider). */}
          <button onClick={onToggle} className="flex items-center gap-1.5 sm:pointer-events-none">
            <span className="bm-eyebrow whitespace-nowrap">{title}</span>
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className={`h-4 w-4 text-white/60 transition-transform sm:hidden ${open ? '' : 'rotate-180'}`}
              fill="currentColor"
            >
              <path d="M7 14l5-5 5 5z" />
            </svg>
          </button>
          {actions}
        </div>

        <div className={`${open ? 'block' : 'hidden'} sm:block`}>{children}</div>
      </div>
    </div>
  );
}
