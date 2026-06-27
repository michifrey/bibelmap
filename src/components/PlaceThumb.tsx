import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { Place, PlaceImage } from '../types';
import { resolveWikidataImage } from '../lib/wikidataImage';

interface Props {
  place: Place;
  /** classes applied to both the <img> and the placeholder box (size, rounding, ring) */
  className?: string;
  iconClassName?: string;
  /** custom placeholder when no image can be resolved */
  placeholder?: ReactNode;
  /** reports the finally-used image meta (for credits) */
  onResolved?: (img: PlaceImage | null) => void;
}

/**
 * Place thumbnail with a robust fallback chain:
 *   OpenBible image  →  (on miss/error) Wikidata P18 → Commons  →  placeholder.
 * Many OpenBible thumbnail URLs are stale (file renamed on Commons), so we
 * advance to the Wikidata-resolved Commons image whenever a source fails.
 */
export default function PlaceThumb({ place, className = '', iconClassName = 'h-5 w-5', placeholder, onResolved }: Props) {
  const [src, setSrc] = useState<string | null>(place.img?.url ?? null);
  const triedWikidata = useRef(false);
  const dead = useRef(false);
  const onResolvedRef = useRef(onResolved);
  onResolvedRef.current = onResolved;

  useEffect(() => {
    dead.current = false;
    triedWikidata.current = false;
    if (place.img?.url) {
      setSrc(place.img.url);
      onResolvedRef.current?.(place.img);
    } else {
      setSrc(null);
      void tryWikidata();
    }
    return () => {
      dead.current = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [place.id]);

  async function tryWikidata() {
    if (triedWikidata.current || !place.wikidata) {
      onResolvedRef.current?.(null);
      setSrc(null);
      return;
    }
    triedWikidata.current = true;
    const img = await resolveWikidataImage(place.wikidata);
    if (dead.current) return;
    if (img?.url) {
      setSrc(img.url);
      onResolvedRef.current?.(img);
    } else {
      setSrc(null);
      onResolvedRef.current?.(null);
    }
  }

  function handleError() {
    if (!triedWikidata.current && place.wikidata) void tryWikidata();
    else {
      setSrc(null);
      onResolvedRef.current?.(null);
    }
  }

  if (!src) {
    if (placeholder !== undefined) return <>{placeholder}</>;
    return (
      <span className={`grid place-items-center bg-teal/10 text-teal ${className}`}>
        <svg viewBox="0 0 24 24" className={iconClassName} fill="currentColor">
          <path d="M12 2C8.7 2 6 4.7 6 8c0 4.4 6 12 6 12s6-7.6 6-12c0-3.3-2.7-6-6-6zm0 8.2A2.2 2.2 0 1 1 12 5.8a2.2 2.2 0 0 1 0 4.4z" />
        </svg>
      </span>
    );
  }
  return (
    <img
      src={src}
      alt={place.name}
      onError={handleError}
      loading="lazy"
      referrerPolicy="no-referrer"
      className={`object-cover ${className}`}
    />
  );
}
