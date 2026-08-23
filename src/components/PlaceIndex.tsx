import { useDeferredValue, useMemo, useState } from 'react';
import type { Place } from '../types';
import type { Lang } from '../i18n';
import { useT } from '../i18n';
import { booksForPlace, erasForPlace, placeName } from '../lib/places';
import { BOOK_BY_OSIS } from '../data/books';
import { ERAS, ERA_BY_ID } from '../data/eras';
import ShareLink from './ShareLink';

interface Props {
  places: Place[];
  lang: Lang;
  onSelect: (p: Place) => void;
  onExit: () => void;
}

/**
 * Das Ortsregister – die eine Seite, die jeder gedruckte Bibelatlas hinten hat
 * und diese App nicht hatte.
 *
 * Die Suche beantwortet „wo ist X?". Sie beantwortet nicht „welche Orte gibt es
 * überhaupt?" – und diese Frage stellt jeder, der eine Stunde vorbereitet.
 * 1.335 Orte, alphabetisch, mit dem, was zu jedem in einer Zeile zu sagen ist:
 * wie oft er vorkommt, in welchen Epochen, und von welchem Buch bis zu welchem
 * er reicht.
 *
 * Die Spanne ist bewusst „von … bis" und keine Aufzählung: Jerusalem steht in
 * 37 Büchern, das schreibt sich nicht in eine Zeile. Wo es nur ein Buch ist,
 * steht auch nur eines.
 *
 * Gedruckt wird ohne Filterleiste und ohne Knöpfe – dann ist es ein Anhang.
 */

/** Ein Ort, wie er im Register steht. */
interface Eintrag {
  place: Place;
  name: string;
  /** Erstes und letztes Buch nach Kanonreihenfolge – oder nur eines. */
  spanne: string | null;
  eras: string[];
}

/** Nach Anfangsbuchstaben, Umlaute unter ihrem Grundbuchstaben. */
function buchstabe(name: string): string {
  const c = name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .charAt(0)
    .toUpperCase();
  return /[A-Z]/.test(c) ? c : '#';
}

export default function PlaceIndex({ places, lang, onSelect, onExit }: Props) {
  const t = useT();
  const [query, setQuery] = useState('');
  const [era, setEra] = useState<string | null>(null);
  // 1.335 Zeilen bei jedem Tastenanschlag neu zu bauen ruckelt spürbar; die
  // Liste darf der Eingabe einen Wimpernschlag hinterherhinken.
  const trage = useDeferredValue(query);

  const alle = useMemo<Eintrag[]>(() => {
    const out = places.map((p) => {
      const buecher = booksForPlace(p);
      const sortiert = [...buecher].sort(
        (a, b) => (BOOK_BY_OSIS[a]?.num ?? 99) - (BOOK_BY_OSIS[b]?.num ?? 99),
      );
      const name = (b: string) => {
        const buch = BOOK_BY_OSIS[b];
        return buch ? (lang === 'de' ? buch.de : buch.en).replace(/\s*\(.*\)$/, '') : b;
      };
      const spanne =
        sortiert.length === 0
          ? null
          : sortiert.length === 1
            ? name(sortiert[0])
            : `${name(sortiert[0])} – ${name(sortiert[sortiert.length - 1])}`;
      return { place: p, name: placeName(p, lang), spanne, eras: erasForPlace(p) };
    });
    return out.sort((a, b) => a.name.localeCompare(b.name, lang === 'de' ? 'de' : 'en'));
  }, [places, lang]);

  const gefiltert = useMemo(() => {
    const q = trage
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '');
    return alle.filter((e) => {
      if (era && !e.eras.includes(era)) return false;
      if (!q) return true;
      return e.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .includes(q);
    });
  }, [alle, trage, era]);

  const gruppen = useMemo(() => {
    const map = new Map<string, Eintrag[]>();
    for (const e of gefiltert) {
      const b = buchstabe(e.name);
      if (!map.has(b)) map.set(b, []);
      map.get(b)!.push(e);
    }
    return [...map.entries()];
  }, [gefiltert]);

  return (
    <div className="bm-print-root fixed inset-0 z-[2000] flex flex-col bg-deepest">
      <div className="bm-noprint flex flex-none flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b border-white/10 bg-abyss px-5 py-3.5 text-white">
        <div className="min-w-0">
          <div className="bm-eyebrow bm-eyebrow-dim">{t('placeIndex')}</div>
          <div className="truncate font-display text-lg uppercase leading-tight">
            {gefiltert.length === alle.length
              ? `${alle.length.toLocaleString(lang === 'de' ? 'de-DE' : 'en-US')} ${t('places')}`
              : `${gefiltert.length.toLocaleString(lang === 'de' ? 'de-DE' : 'en-US')} ${t('placeIndexOf')} ${alle.length.toLocaleString(lang === 'de' ? 'de-DE' : 'en-US')}`}
          </div>
        </div>
        <div className="flex flex-none flex-wrap items-center gap-2">
          <ShareLink className="bm-btn bm-btn-ghost" />
          <button onClick={() => window.print()} className="bm-btn hidden sm:inline-flex" title={t('printHint')}>
            {t('print')}
          </button>
          <button onClick={onExit} className="bm-btn bm-btn-ghost">
            {t('close')}
          </button>
        </div>
      </div>

      <div className="bm-noprint flex flex-none flex-wrap items-center gap-2 border-b border-white/10 bg-abyss/60 px-5 py-2.5">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          // Ein Platzhalter ist kein Name: er verschwindet beim Tippen, und ein
          // Screenreader liest ihn nicht als Beschriftung. Die A11y-Prüfung hat
          // genau das gemeldet.
          aria-label={t('placeIndexFilter')}
          placeholder={t('placeIndexFilter')}
          className="w-full max-w-xs border border-white/10 bg-deepest px-3 py-1.5 text-[13px] text-white placeholder:text-white/35 focus:border-gold/60 focus:outline-none"
        />
        <button
          onClick={() => setEra(null)}
          aria-pressed={era === null}
          className={`px-2.5 py-1 text-[11px] font-bold transition ${era === null ? 'bg-gold text-deep' : 'bg-white/8 text-white/70 hover:bg-white/15'}`}
        >
          {t('allEras')}
        </button>
        {ERAS.map((e) => (
          <button
            key={e.id}
            onClick={() => setEra((v) => (v === e.id ? null : e.id))}
            aria-pressed={era === e.id}
            style={era === e.id ? { background: e.color, color: '#fff' } : undefined}
            className={`px-2.5 py-1 text-[11px] font-bold transition ${era === e.id ? '' : 'bg-white/8 text-white/70 hover:bg-white/15'}`}
          >
            {lang === 'de' ? e.de : e.en}
          </button>
        ))}
      </div>

      <div className="bm-print-sheet scroll-soft flex-1 overflow-y-auto px-5 py-4">
        <div className="bm-print-only mb-4 border-b pb-3">
          <h1 className="font-display text-2xl uppercase">{t('placeIndex')} · bibelmap</h1>
          <div className="text-[11px]">
            {gefiltert.length} {t('places')}
            {era ? ` · ${lang === 'de' ? ERA_BY_ID[era]?.de : ERA_BY_ID[era]?.en}` : ''}
          </div>
        </div>

        {gefiltert.length === 0 ? (
          <p className="text-[13px] text-white/50">{t('noResults')}</p>
        ) : (
          gruppen.map(([b, eintraege]) => (
            <section key={b} className="mb-5">
              <h2 className="mb-1.5 border-b border-white/10 pb-1 font-display text-lg text-gold">{b}</h2>
              {/* Zwei Spalten auf breiten Schirmen und auf Papier – ein Register
                  liest sich in Spalten, nicht als eine lange Schlange. */}
              <ul className="columns-1 gap-x-8 sm:columns-2 lg:columns-3">
                {eintraege.map((e) => (
                  <li key={e.place.id} className="mb-1 break-inside-avoid">
                    <button
                      onClick={() => onSelect(e.place)}
                      className="w-full text-left text-[13px] leading-snug text-white transition hover:text-gold"
                    >
                      <span className="font-semibold">{e.name}</span>
                      <span className="bm-num ml-1.5 text-[11px] text-white/45">{e.place.mentionCount}</span>
                      {e.spanne && <span className="ml-1.5 text-[11px] text-white/40">{e.spanne}</span>}
                      {e.eras.length > 0 && (
                        <span className="ml-1.5 inline-flex gap-0.5 align-middle">
                          {e.eras.map((id) => (
                            <span
                              key={id}
                              aria-hidden="true"
                              className="inline-block h-1.5 w-1.5 rounded-full"
                              style={{ background: ERA_BY_ID[id]?.color ?? '#888' }}
                            />
                          ))}
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))
        )}

        <p className="mt-4 max-w-prose text-[11px] leading-relaxed text-white/40">{t('placeIndexNote')}</p>
      </div>
    </div>
  );
}
