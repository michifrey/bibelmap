import { useEffect, useMemo, useRef, useState } from 'react';
import { useT } from '../i18n';
import type { Mode } from './Header';

/**
 * Die Modi-Auswahl.
 *
 * Liegt über allem (z 2400): Die Vollbild-Modi wohnen bei 2000, die
 * Präsentation bei 2200, und eine Tafel, aus der man sie auswählt, gehört
 * darüber – sonst schaut auf dem Telefon die Suchleiste durch den Schleier.
 * Und `pointer-events-auto`, weil die Kopfzeile, in der die Tafel hängt,
 * durchlässig ist: ohne das erreicht sie keine Maus, nur die Tastatur.
 *
 * Als aufklappende Liste unter dem Knopf ging es bis zehn Modi gut. Bei
 * dreizehn war die Liste 940 Pixel hoch – höher als das Fenster –, und die
 * letzten Einträge standen unter dem Bildrand, wo man sie weder sah noch
 * anfassen konnte. Eine Liste, die mit jedem neuen Modus wächst, kann unter
 * einem Knopf nicht wohnen.
 *
 * Stattdessen eine Tafel in der Mitte: nach den drei Familien geordnet, in
 * denen das Projekt seine Modi ohnehin beschreibt, in Spalten statt in einer
 * Säule, mit einer festen Höhe, in der gescrollt wird statt über den Rand
 * hinauszuwachsen. Und mit einem Suchfeld, weil dreizehn Ziele die Zahl ist,
 * ab der Lesen länger dauert als Tippen.
 */

interface ModeItem {
  id: Mode;
  label: string;
  hint: string;
  icon: string;
  /** Icons, die als Fläche gezeichnet sind statt als Strich. */
  solid?: boolean;
}

interface Group {
  key: string;
  title: string;
  items: ModeItem[];
}

interface Props {
  onPick: (m: Mode) => void;
  onClose: () => void;
}

function norm(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

export default function ModePalette({ onPick, onClose }: Props) {
  const t = useT();
  const [query, setQuery] = useState('');
  const [cursor, setCursor] = useState(0);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Die drei Familien sind die des README – dort wird das Projekt seit jeher so
  // erklärt, und eine zweite Ordnung neben der bestehenden wäre eine zu viel.
  const groups: Group[] = useMemo(
    () => [
      {
        key: 'tell',
        title: t('modeGroupTell'),
        items: [
          { id: 'present', label: t('presentation'), hint: t('presentationHint'), icon: 'M4 5h16v10H4zm0 12h16v2H4zm6-9v6l5-3z', solid: true },
          { id: 'history', label: t('historyMode'), hint: t('historyHint'), icon: 'M12 8v5l3 2' },
          { id: 'journeys', label: t('journeys'), hint: t('journeysSub'), icon: 'M5 20c4-10 10-10 14-16M5 20h.01M19 4h.01M9 15l1.5 1.5' },
          { id: 'gospel', label: t('gospel'), hint: t('gospelHint'), icon: 'M12 2l2.3 5.5 5.9.5-4.5 3.9 1.4 5.8L12 14.6 6.9 17.7l1.4-5.8-4.5-3.9 5.9-.5z' },
          { id: 'mission', label: t('mission'), hint: t('missionHint'), icon: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18' },
          { id: 'church', label: t('churchMode'), hint: t('churchHint'), icon: 'M12 3v18M7 8h10M5 21h14' },
          { id: 'israel', label: t('israel'), hint: t('israelHint'), icon: 'M12 2 4 7v10l8 5 8-5V7zM12 7l4 2.5v5L12 17l-4-2.5v-5z' },
          { id: 'compare', label: t('compareMode'), hint: t('compareIntro'), icon: 'M12 3v18M5 8l-3 5h6zM19 8l-3 5h6z' },
        ],
      },
      {
        key: 'learn',
        title: t('modeGroupLearn'),
        items: [
          { id: 'quiz', label: t('quiz'), hint: t('quizSub'), icon: 'M12 17h.01M9.5 9a2.5 2.5 0 1 1 3.6 2.2c-.7.4-1.1 1-1.1 1.8M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z' },
          { id: 'index', label: t('placeIndex'), hint: t('placeIndexHint'), icon: 'M4 5h16M4 5v14M8 9h8M8 13h8M8 17h5' },
          { id: 'route', label: t('ownRoute'), hint: t('ownRouteHint'), icon: 'M6 19a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM8.8 14.4l6.4-5.8' },
          { id: 'media', label: t('media'), hint: t('mediaHint'), icon: 'M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zM5 11a7 7 0 0 0 14 0M12 18v3' },
        ],
      },
      {
        key: 'about',
        title: t('modeGroupAbout'),
        items: [
          { id: 'support', label: t('support'), hint: t('supportSub'), icon: 'M12 20.3 4.6 13a4.7 4.7 0 0 1 0-6.7 4.7 4.7 0 0 1 6.7 0l.7.7.7-.7a4.7 4.7 0 0 1 6.7 0 4.7 4.7 0 0 1 0 6.7z', solid: true },
          { id: 'credits', label: t('credits'), hint: t('creditsSub'), icon: 'M7 3h7l5 5v13H7zM14 3v5h5M10 12h7M10 16h7' },
        ],
      },
    ],
    [t],
  );

  const shown = useMemo(() => {
    const q = norm(query.trim());
    if (!q) return groups;
    return groups
      .map((g) => ({ ...g, items: g.items.filter((i) => norm(i.label).includes(q) || norm(i.hint).includes(q)) }))
      .filter((g) => g.items.length > 0);
  }, [groups, query]);

  /** Alle sichtbaren Einträge der Reihe nach – das ist, was die Pfeiltasten begehen. */
  const flat = useMemo(() => shown.flatMap((g) => g.items), [shown]);

  useEffect(() => {
    setCursor(0);
  }, [query]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Der ausgewählte Eintrag bleibt im Bild, auch wenn man sich durchtippt.
  useEffect(() => {
    boxRef.current?.querySelector<HTMLElement>('[data-cursor="true"]')?.scrollIntoView({ block: 'nearest' });
  }, [cursor]);

  function onKeyDown(e: React.KeyboardEvent) {
    // Escape gehört hier hin: die App schließt damit sonst den Modus darunter.
    if (e.key === 'Escape') {
      e.stopPropagation();
      onClose();
      return;
    }
    if (!flat.length) return;
    const step = { ArrowDown: 1, ArrowUp: -1, ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (step) {
      e.preventDefault();
      setCursor((c) => (c + step + flat.length) % flat.length);
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      onPick(flat[cursor].id);
    }
  }

  let index = -1;

  return (
    <div
      className="pointer-events-auto fixed inset-0 z-[2400] flex items-start justify-center overflow-y-auto bg-abyss/80 p-3 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
      onKeyDown={onKeyDown}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t('modes')}
        ref={boxRef}
        onClick={(e) => e.stopPropagation()}
        className="bm-panel-solid flex max-h-[92vh] w-full max-w-5xl flex-col sm:max-h-[86vh]"
      >
        {/* Kopf: was das ist, wonach man sucht, und der Weg hinaus */}
        <div className="flex flex-none items-center gap-3 border-b border-white/10 px-3 py-3 sm:px-5 sm:py-4">
          <div className="min-w-0 flex-1">
            <div className="bm-eyebrow">{t('modes')}</div>
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('modeSearch')}
              aria-label={t('modeSearch')}
              className="mt-1 w-full border-0 bg-transparent p-0 font-display text-lg text-white outline-none placeholder:font-sans placeholder:text-[15px] placeholder:font-normal placeholder:text-white/35 sm:text-xl"
            />
          </div>
          <button
            onClick={onClose}
            aria-label={t('close')}
            className="grid h-9 w-9 flex-none place-items-center bg-white/8 text-white/70 transition hover:bg-white/16 hover:text-white"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
              <path d="M18.3 5.7 12 12l6.3 6.3-1.4 1.4L10.6 13.4 4.3 19.7 2.9 18.3 9.2 12 2.9 5.7l1.4-1.4L10.6 10.6l6.3-6.3z" />
            </svg>
          </button>
        </div>

        {/* Die Tafel selbst – hier wird gescrollt, nicht über den Bildrand hinaus */}
        <div className="scroll-soft min-h-0 flex-1 overflow-y-auto px-3 py-3 sm:px-5 sm:py-4">
          {shown.length === 0 && (
            <p className="px-1 py-6 text-center text-sm text-white/50">{t('noResults')}</p>
          )}
          {shown.map((g) => (
            <section key={g.key} className="mb-4 last:mb-0">
              <h2 className="bm-eyebrow bm-eyebrow-dim mb-2 px-1">{g.title}</h2>
              <div className="grid auto-rows-fr grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
                {g.items.map((m) => {
                  index += 1;
                  const on = index === cursor;
                  return (
                    <button
                      key={m.id}
                      data-cursor={on ? 'true' : undefined}
                      onClick={() => onPick(m.id)}
                      onMouseEnter={() => setCursor(flat.findIndex((x) => x.id === m.id))}
                      className={`flex h-full items-start gap-3 border-l-2 px-3 py-2.5 text-left transition ${
                        on ? 'border-gold bg-white/12' : 'border-transparent bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <span
                        className={`mt-0.5 grid h-8 w-8 flex-none place-items-center transition ${
                          on ? 'bg-gold text-deep' : 'bg-white/10 text-white'
                        }`}
                      >
                        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                          <path d={m.icon} stroke="currentColor" strokeWidth="1.6" fill={m.solid ? 'currentColor' : 'none'} />
                        </svg>
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[13.5px] font-bold leading-tight text-white">{m.label}</span>
                        <span className="bm-clamp-2 mt-0.5 text-[11.5px] leading-snug text-white/55">{m.hint}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        <p className="hidden flex-none border-t border-white/10 px-5 py-2 text-[11px] text-white/40 sm:block">
          {t('modeKeysHint')}
        </p>
      </div>
    </div>
  );
}
