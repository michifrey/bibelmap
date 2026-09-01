import { useMemo, useState } from 'react';
import type { Place } from '../types';
import type { Lang } from '../i18n';
import { useT } from '../i18n';
import { placeName } from '../lib/places';
import { placesAlong } from '../lib/along';
import { formatKm, type LatLon } from '../lib/route';

interface Props {
  places: Place[];
  lang: Lang;
  from: LatLon;
  to: LatLon;
  /** Namen der beiden Stationen – sie sollen nicht als Ort am Weg erscheinen. */
  stops: string[];
  onSelect: (p: Place) => void;
}

/**
 * Die Orte, die neben einer Etappe liegen.
 *
 * Zwischen Jerusalem und Jericho liegen 23 Kilometer – aber was liegt
 * dazwischen? Die App kennt 1.335 Orte mit Koordinaten und kann die Frage
 * beantworten, ohne dass jemand etwas dazuerfindet: Ölberg, Bethanien,
 * Bahurim, Anathoth.
 *
 * Eingeklappt, nicht ausgeklappt: die Etappenliste soll die Reise erzählen,
 * nicht ein Ortsverzeichnis sein. Wer fragt, klappt auf.
 */
export default function AlongTheWay({ places, lang, from, to, stops, onSelect }: Props) {
  const t = useT();
  const [open, setOpen] = useState(false);

  const hits = useMemo(
    () => (open ? placesAlong(places, from, to, 8, 8, stops) : []),
    [open, places, from, to, stops],
  );

  return (
    <div className="bm-noprint pl-3">
      <button
        onClick={() => setOpen((v) => !v)}
        // `-my-1.5 py-1.5`: 11-px-Schrift ergab eine 17 px hohe Fläche, unter
        // dem Mindestmass von 24×24. Der Innenabstand macht sie 29 px hoch,
        // der negative Aussenabstand nimmt sie aus dem Fluss wieder heraus.
        // Nachgemessen: das Bild ändert sich dadurch um keinen Punkt.
        className="-my-1.5 py-1.5 text-[11px] text-white/45 underline decoration-white/20 underline-offset-2 transition hover:text-gold"
      >
        {open ? `− ${t('alongHide')}` : `+ ${t('alongShow')}`}
      </button>
      {open && (
        <div className="mt-1.5">
          {hits.length === 0 ? (
            <p className="text-[11px] text-white/40">{t('alongNone')}</p>
          ) : (
            <>
              <div className="flex flex-wrap gap-1">
                {hits.map((h) => (
                  <button
                    key={h.place.id}
                    onClick={() => onSelect(h.place)}
                    className="bg-white/8 px-2 py-1 text-[11px] font-bold text-white transition hover:bg-gold/30"
                    title={`${formatKm(h.quer, lang)} ${t('alongOff')}`}
                  >
                    {placeName(h.place, lang)}
                    <span className="ml-1.5 font-medium text-white/50">{formatKm(h.quer, lang)}</span>
                  </button>
                ))}
              </div>
              <p className="mt-1.5 max-w-prose text-[10.5px] leading-relaxed text-white/35">
                {t('alongNote')}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
