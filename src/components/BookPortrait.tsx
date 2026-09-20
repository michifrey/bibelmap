import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Place } from '../types';
import type { Lang } from '../i18n';
import { useT } from '../i18n';
import { findPlacesByNames, placeName } from '../lib/places';
import { useReducedMotion } from '../lib/motion';
import { readableOnDark } from '../lib/contrast';
import { loadMedia, type MediaIndex } from '../lib/media';
import {
  BOOKS,
  BOOK_BY_OSIS,
  bibleGatewayUrl,
  bibleProjectUrl,
  bibleProjectVideoIds,
  hasGermanVideo,
} from '../data/books';
import {
  PORTRAITS,
  PORTRAIT_BY_OSIS,
  type Movement,
  type Pattern,
  type Portrait,
} from '../data/bookPortraits';
import { arcPath, chapterX, fieldsOf, layout, ticks } from '../lib/bookScroll';
import YouTubeEmbed from './YouTubeEmbed';

/*
 * Das Buchporträt – ein Buch der Bibel auf einer Seite.
 *
 * **Warum es sich aufbaut, statt dazustehen.** Die Vorlage sind die
 * Buchvideos von BibleProject: Dort entsteht die Übersicht vor den Augen des
 * Zuschauers – erst ein Strich, dann das Wort dazu, und am Ende zeigt eine
 * zweite Ebene, was sich wiederholt hat. Ein fertiges Schaubild zeigt
 * dasselbe und erklärt nichts: Man sieht sieben Kästen und weiß nicht, wo
 * man anfangen soll. Ein Schaubild, das Zug um Zug entsteht, **ist** die
 * Erklärung.
 *
 * Deshalb hat diese Ansicht einen Stand (`step`) und Knöpfe dafür:
 *
 *   Schritt 1 … M      die M Züge des Buches, einer nach dem anderen
 *   Schritt M+1 … M+P  die P Muster als Bögen darüber, ebenfalls nacheinander
 *
 * Die Muster kommen zuletzt, und zwar aus demselben Grund wie im Video: Dass
 * in 1. Mose dreimal dieselbe Bewegung steht, sieht man erst, wenn alle drei
 * Felder nebeneinanderliegen.
 *
 * **Eine Achse für alles.** Die Kapitel des Buches sind die einzige
 * Koordinate: Die Felder der Rolle liegen darauf, die Bögen spannen sich
 * darüber, die Marken der Zeitschiene stehen darunter, und die Balken der
 * Figuren daneben benutzen dieselbe Rechnung (`lib/bookScroll.ts`). Das ist
 * der Grund, warum man auf einen Blick sieht, dass Josef vierzehn Kapitel
 * bekommt und die Schöpfung zwei.
 *
 * **Abspielen ist angeboten, nicht verordnet.** Wer den Knopf nicht drückt,
 * bewegt sich nichts; jeder Klick auf eine andere Stelle hält es an. Bei
 * `prefers-reduced-motion` gibt es keine Übergänge – die Felder erscheinen,
 * statt einzufahren. Gezeigt wird beides Mal dasselbe.
 *
 * **Barrierefreiheit.** Die Rolle ist `aria-hidden`: Nichts steht nur dort.
 * Jeder Zug ist unter der Rolle ein richtiger Knopf mit Namen und
 * Kapitelspanne, die Erzählung daneben ist Text, und die Tafeln rechts
 * wiederholen alles in Prosa.
 */

/*
 * Zeichenfläche der Rolle – Einheiten, keine Pixel: Das SVG ist so breit wie
 * seine Spalte, und die Höhe folgt daraus. Die vier Ebenen liegen
 * übereinander und dürfen sich nicht ins Gehege kommen; gemessen wurde am
 * Bildschirm, nicht geschätzt.
 *
 *    28 …  96   Bögen der Muster (steigen bis ARC_RISE * 2 über ARC_Y)
 *   100 … 184   der Streifen mit den Feldern
 *       202     die Kapitelspanne unter jedem Feld
 *   208 … 232   das Lineal mit seinen Zahlen
 *       254     die Rauten der Zeitschiene – eine eigene Zeile, denn in der
 *               ersten Fassung standen sie auf den Zahlen des Lineals
 */
const W = 1000;
const H = 272;
/** Oberkante und Höhe des Streifens, auf dem die Felder liegen. */
const STRIP_Y = 100;
const STRIP_H = 84;
/** Grundlinie der Bögen und ihre größte Höhe. */
const ARC_Y = STRIP_Y - 4;
const ARC_RISE = 34;
/** Linie der Kapitelzahlen und der Zeitmarken. */
const RULER_Y = STRIP_Y + STRIP_H + 18;
const BEAT_Y = RULER_Y + 52;

/** Wie lange ein Schritt beim Abspielen steht. */
const STEP_MS = 4200;

type Tab = 'heart' | 'figures' | 'time' | 'jesus' | 'deep' | 'media';

interface Props {
  places: Place[];
  lang: Lang;
  /** Buch aus der Adresse (`#buch=Gen`) oder aus der Suche. */
  initial?: string | null;
  /** Damit die Adresse mitläuft, wenn jemand das Buch wechselt. */
  onNavigate?: (osis: string) => void;
  /** Einen Ort auf der Hauptkarte zeigen – schließt den Modus. */
  onShowPlace?: (p: Place) => void;
  /** Ein Kapitel im Entdeckermodus aufschlagen. */
  onOpenReading?: (osis: string, chapter: number) => void;
  /** Die Folgen zu einem Kapitel in „Hören & Sehen". */
  onOpenMedia?: (osis: string, chapter: number) => void;
  /** Dasselbe Buch im Bücherregal – Datierung, Handschriften, Verweise. */
  onOpenShelf?: (osis: string) => void;
  /** Einen Menschen im Zeitbaum zeigen. */
  onOpenPerson?: (id: string) => void;
  onExit: () => void;
}

/** Das erste Buch mit Porträt – der Anfang, wenn die Adresse nichts sagt. */
const FIRST = PORTRAITS[0].osis;

/**
 * Anführungszeichen der jeweiligen Sprache. Ein deutsches „unten-oben" in
 * einem englischen Satz sieht aus wie ein Druckfehler – und die Zitate hier
 * sind der Teil, dem man ansehen soll, dass er sorgfältig behandelt wurde.
 */
function quoted(text: string, lang: Lang): string {
  return lang === 'de' ? `\u201e${text}\u201c` : `\u201c${text}\u201d`;
}

export default function BookPortrait({
  places,
  lang,
  initial,
  onNavigate,
  onShowPlace,
  onOpenReading,
  onOpenMedia,
  onOpenShelf,
  onOpenPerson,
  onExit,
}: Props) {
  const t = useT();
  const reduced = useReducedMotion();
  const [osis, setOsis] = useState(() => (initial && BOOK_BY_OSIS[initial] ? initial : FIRST));
  const [step, setStep] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [tab, setTab] = useState<Tab>('heart');
  const [media, setMedia] = useState<MediaIndex | null>(null);
  const boxRef = useRef<HTMLDivElement | null>(null);

  const book = BOOK_BY_OSIS[osis];
  const portrait: Portrait | undefined = PORTRAIT_BY_OSIS[osis];

  /** Züge zuerst, Muster danach – zusammen die Schritte des Aufbaus. */
  const moves = portrait?.movements ?? [];
  const patterns = portrait?.patterns ?? [];
  const steps = moves.length + patterns.length;
  const shownMoves = Math.min(step, moves.length);
  const shownPatterns = Math.max(0, step - moves.length);
  /** Was gerade erzählt wird: ein Zug oder ein Muster. */
  const current: { kind: 'move'; item: Movement } | { kind: 'pattern'; item: Pattern } | null =
    !portrait ? null
    : step <= moves.length ? { kind: 'move', item: moves[Math.max(0, step - 1)] }
    : { kind: 'pattern', item: patterns[step - moves.length - 1] };

  const fields = useMemo(
    () => (portrait && book ? layout(portrait.movements, book.chapters, W) : []),
    [portrait, book],
  );
  const marks = useMemo(() => (book ? ticks(book.chapters) : []), [book]);

  useEffect(() => {
    setStep(1);
    setPlaying(false);
    setTab('heart');
    onNavigate?.(osis);
    boxRef.current?.scrollTo({ top: 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [osis]);

  // Die Adresse von außen (Zurück-Taste, getippter Link) schlägt durch.
  useEffect(() => {
    if (initial && BOOK_BY_OSIS[initial]) setOsis(initial);
  }, [initial]);

  // Der Medienindex kommt nachgeladen: Er wird nur für die Tafel „Medien"
  // gebraucht und wiegt mehr als dieses ganze Porträt.
  useEffect(() => {
    let alive = true;
    loadMedia().then((m) => {
      if (alive) setMedia(m);
    });
    return () => {
      alive = false;
    };
  }, []);

  /** Abspielen: ein Schritt, dann der nächste – und am Ende hält es an. */
  useEffect(() => {
    if (!playing) return;
    if (step >= steps) {
      setPlaying(false);
      return;
    }
    const id = window.setTimeout(() => setStep((s) => Math.min(steps, s + 1)), STEP_MS);
    return () => window.clearTimeout(id);
  }, [playing, step, steps]);

  const go = useCallback(
    (n: number) => {
      setPlaying(false);
      setStep(Math.max(1, Math.min(steps, n)));
    },
    [steps],
  );

  // Pfeiltasten blättern durch den Aufbau, die Leertaste spielt ab. Nicht,
  // während jemand in einem Feld tippt – dort heißt die Leertaste Leerzeichen.
  useEffect(() => {
    if (!portrait) return;
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        go(step + 1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        go(step - 1);
      } else if (e.key === ' ') {
        e.preventDefault();
        setPlaying((p) => !p);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [portrait, step, go]);

  const name = book ? (lang === 'de' ? book.de.replace(/\s*\(.*\)$/, '') : book.en) : osis;
  const bibleVersion = lang === 'de' ? 'LUTH1545' : 'WEB';
  /** Folgen, die dieses Buch behandeln – für die Tafel „Medien". */
  const episodeCount = useMemo(() => {
    if (!media) return 0;
    return media.episodes.filter((e) => e.refs.some((r) => r.osis === osis)).length;
  }, [media, osis]);

  /** Ein Ort aus den Daten – nur, wenn er sich in `places.json` auflösen lässt. */
  const placeByName = useCallback(
    (n: string): Place | null => findPlacesByNames(places, [n])[0] ?? null,
    [places],
  );

  const withPortrait = PORTRAITS.map((p) => p.osis);
  const iPortrait = withPortrait.indexOf(osis);

  /** Übergänge nur, wenn niemand um Ruhe gebeten hat. */
  const ease = reduced ? 'none' : 'opacity .45s ease, transform .45s ease';

  return (
    <div className="fixed inset-0 z-[2000] flex flex-col bg-deepest">
      {/* Kopfzeile */}
      <div className="flex flex-none items-center justify-between gap-3 border-b border-white/10 bg-abyss px-4 py-3 text-white sm:px-5 sm:py-3.5">
        <div className="flex min-w-0 items-center gap-2">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 flex-none text-gold" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M4 5h6a2 2 0 0 1 2 2v12a2 2 0 0 0-2-2H4zM20 5h-6a2 2 0 0 0-2 2v12a2 2 0 0 1 2-2h6z" />
          </svg>
          <div className="min-w-0">
            <div className="font-display text-lg uppercase leading-none sm:text-xl">{t('bookPortrait')}</div>
            <div className="truncate text-[11px] text-white/55">{name}</div>
          </div>
        </div>
        <button onClick={onExit} className="bm-btn bm-btn-gold flex-none">
          {t('exit')} ✕
        </button>
      </div>

      {/* Buchwahl – eine Zeile über allem, damit sie in beiden Spalten gilt */}
      <div className="flex flex-none flex-wrap items-center gap-2 border-b border-white/10 bg-deepest px-4 py-2.5 sm:px-5">
        <label className="bm-eyebrow bm-eyebrow-dim" htmlFor="bp-book">
          {t('bpChoose')}
        </label>
        <select
          id="bp-book"
          className="bm-select min-w-0 flex-1 sm:flex-none"
          value={osis}
          onChange={(e) => setOsis(e.target.value)}
        >
          {(['AT', 'NT'] as const).map((testament) => (
            <optgroup key={testament} label={t(testament === 'AT' ? 'bpOldTestament' : 'bpNewTestament')}>
              {BOOKS.filter((b) => b.testament === testament).map((b) => (
                <option key={b.osis} value={b.osis}>
                  {(lang === 'de' ? b.de : b.en) + (PORTRAIT_BY_OSIS[b.osis] ? ' ★' : '')}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        {/* Von Porträt zu Porträt – die Sterne in der Liste sind dünn gesät */}
        <div className="bm-seg">
          <button
            onClick={() => setOsis(withPortrait[(iPortrait - 1 + withPortrait.length) % withPortrait.length])}
            disabled={withPortrait.length < 2}
            aria-label={t('bpPrevBook')}
            title={t('bpPrevBook')}
          >
            ◀
          </button>
          <button
            onClick={() => setOsis(withPortrait[(iPortrait + 1) % withPortrait.length])}
            disabled={withPortrait.length < 2}
            aria-label={t('bpNextBook')}
            title={t('bpNextBook')}
          >
            ▶
          </button>
        </div>
        {/* Auf dem Telefon eine eigene Zeile (`basis-full`): in einer Reihe
            mit der Auswahl blieb von „1. Mose (Genesis)" ein „1." übrig. */}
        <span className="basis-full text-[11px] text-white/45 sm:basis-auto">
          {t('bpReadyCount').replace('{n}', String(PORTRAITS.length))}
        </span>
      </div>

      {!portrait ? (
        <NoPortrait
          osis={osis}
          name={name}
          lang={lang}
          onPick={setOsis}
          onOpenShelf={onOpenShelf}
          onOpenReading={onOpenReading}
        />
      ) : (
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto lg:flex-row lg:overflow-hidden">
          {/* ------------------------------------------------ links: die Rolle */}
          <div
            ref={boxRef}
            className="scroll-soft flex flex-none flex-col gap-3 border-b border-white/10 px-4 py-4 sm:px-5 lg:min-h-0 lg:w-[56%] lg:flex-1 lg:overflow-y-auto lg:border-b-0 lg:border-r"
          >
            {/*
              Die Kurzfassung steht vor allem anderen – vor der Rolle, vor den
              Tafeln. Vorher fing die Seite mit der Maschine an: „Der Aufbau"
              und ein leerer Streifen, der sich erst auf Knopfdruck füllt. Wer
              nicht wusste, was ihn erwartet, hatte damit nichts in der Hand.
              Jetzt steht oben in drei Sätzen, worum es geht, und daneben die
              Maße des Buches; die Rolle beginnt darunter.
            */}
            <header>
              <div className="bm-eyebrow">{t('bpInShort')}</div>
              <h2 className="font-display text-xl leading-tight text-white sm:text-2xl">
                {lang === 'de' ? portrait.subtitle.de : portrait.subtitle.en}
              </h2>
              <p className="mt-2 text-[15px] leading-relaxed text-white/85">
                {lang === 'de' ? portrait.summary.de : portrait.summary.en}
              </p>
              {/* Die Maße des Buches in einer Zeile – die Zahlen stehen in der
                  Tafel „Auf einen Blick" noch einmal mit ihrer Beschriftung. */}
              <p className="mt-2.5 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-[11.5px] text-white/50">
                <span>
                  <b className="text-gold">{portrait.facts.chapters}</b> {t('bpChapters').toLowerCase()}
                </span>
                <span aria-hidden="true">·</span>
                <span>
                  <b className="text-gold">{portrait.facts.verses.toLocaleString(lang)}</b>{' '}
                  {t('bpVerses').toLowerCase()}
                </span>
                <span aria-hidden="true">·</span>
                <span>
                  <b className="text-gold">{portrait.facts.places}</b> {t('bpPlaces').toLowerCase()}
                </span>
                <span aria-hidden="true">·</span>
                <span lang="he" dir="rtl">{portrait.hebrew.word}</span>
                <span>{portrait.hebrew.translit}</span>
              </p>
            </header>

            <div className="bm-eyebrow bm-eyebrow-dim">{t('bpBuild')}</div>

            {/*
              Die Rolle. Beiwerk für eine Vorlesehilfe – alles darin steht
              darunter noch einmal als Knopf oder als Text.

              `shrink-0` ist hier nicht Kosmetik: Die Spalte ist eine
              Flexsäule mit eigenem Scrollbereich, und ein SVG hat keine
              Mindesthöhe, an der sich das Schrumpfen bricht. Als die
              Kurzfassung oben dazukam, war die Säule voll – und die Rolle
              wurde auf null Pixel zusammengedrückt, lautlos. Übrig blieb
              „Der Aufbau" und darunter die Knöpfe.
            */}
            <svg aria-hidden="true" viewBox={`0 0 ${W} ${H}`} className="w-full shrink-0">
              {/* Pergament: der Streifen und seine gerollten Enden */}
              <rect x={0} y={STRIP_Y} width={W} height={STRIP_H} fill="#ffffff" fillOpacity="0.07" />
              <rect x={0} y={STRIP_Y - 8} width={14} height={STRIP_H + 16} rx={7} fill="#e0a449" fillOpacity="0.5" />
              <rect x={W - 14} y={STRIP_Y - 8} width={14} height={STRIP_H + 16} rx={7} fill="#e0a449" fillOpacity="0.5" />

              {/* Die Felder – eines je Zug */}
              {fields.map((f, i) => {
                const m = portrait.movements[i];
                const on = current?.kind === 'move' && current.item.id === m.id;
                const shown = i < shownMoves;
                return (
                  <g
                    key={f.id}
                    style={{
                      opacity: shown ? 1 : 0,
                      transform: shown || reduced ? 'none' : 'translateY(10px)',
                      transition: ease,
                    }}
                  >
                    <rect
                      x={f.x + 1}
                      y={STRIP_Y}
                      width={Math.max(2, f.w - 2)}
                      height={STRIP_H}
                      fill={m.color}
                      fillOpacity={on ? 0.92 : 0.5}
                      stroke={on ? '#e0a449' : '#03302f'}
                      strokeWidth={on ? 2.5 : 1}
                    />
                    {f.w > 46 && (
                      <svg
                        x={f.mid - 17}
                        y={STRIP_Y + STRIP_H / 2 - 17}
                        width="34"
                        height="34"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity={on ? 1 : 0.75}
                      >
                        <path d={m.symbol} />
                      </svg>
                    )}
                    <text
                      x={f.mid}
                      y={RULER_Y}
                      textAnchor="middle"
                      fontSize="16"
                      fontWeight={on ? 700 : 500}
                      fill={on ? '#e0a449' : '#ffffff'}
                      fillOpacity={on ? 1 : 0.55}
                    >
                      {m.from === m.to ? m.from : `${m.from}–${m.to}`}
                    </text>
                  </g>
                );
              })}

              {/* Die Bögen der Muster – zuletzt, also über den Feldern */}
              {patterns.map((p, i) => {
                const shown = i < shownPatterns;
                const own = fieldsOf(p, fields);
                if (!own.length) return null;
                const on = current?.kind === 'pattern' && current.item.id === p.id;
                const x1 = own[0].mid;
                const x2 = own[own.length - 1].mid;
                return (
                  <g
                    key={p.id}
                    style={{ opacity: shown ? (on ? 1 : 0.45) : 0, transition: ease }}
                  >
                    <path
                      d={arcPath(x1, x2, ARC_Y, ARC_RISE)}
                      fill="none"
                      stroke={p.color}
                      strokeWidth={on ? 3 : 2}
                      strokeDasharray={on ? undefined : '6 5'}
                    />
                    {own.map((f) => (
                      <circle key={f.id} cx={f.mid} cy={ARC_Y} r={on ? 6 : 4} fill={p.color} />
                    ))}
                  </g>
                );
              })}

              {/* Kapitelzahlen: das Lineal, auf dem alles liegt */}
              <line
                x1={0}
                y1={RULER_Y + 10}
                x2={W}
                y2={RULER_Y + 10}
                stroke="#ffffff"
                strokeOpacity="0.18"
              />
              {marks.map((k) => (
                <g key={`tick-${k}`}>
                  <line
                    x1={chapterX(k, book.chapters, W)}
                    y1={RULER_Y + 6}
                    x2={chapterX(k, book.chapters, W)}
                    y2={RULER_Y + 14}
                    stroke="#ffffff"
                    strokeOpacity="0.3"
                  />
                  <text
                    x={chapterX(k, book.chapters, W)}
                    y={RULER_Y + 28}
                    textAnchor="middle"
                    fontSize="13"
                    fill="#ffffff"
                    fillOpacity="0.35"
                  >
                    {k}
                  </text>
                </g>
              ))}

              {/* Die Marken der Zeitschiene – auf derselben Achse */}
              {portrait.beats.map((b) => {
                const x = chapterX(b.chapter, book.chapters, W) + W / book.chapters / 2;
                const shown = portrait.movements.some(
                  (m, i) => i < shownMoves && b.chapter >= m.from && b.chapter <= m.to,
                );
                return (
                  <g key={b.id} style={{ opacity: shown ? 1 : 0, transition: ease }}>
                    <path
                      d={`M${x.toFixed(1)} ${BEAT_Y - 7} l6 7 -6 7 -6 -7z`}
                      fill="#e0a449"
                      fillOpacity="0.85"
                    />
                  </g>
                );
              })}
            </svg>

            {/* Die Steuerung: abspielen, blättern, von vorn */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setPlaying((p) => !p)}
                className="bm-btn bm-btn-signal"
                aria-pressed={playing}
              >
                {playing ? `❚❚ ${t('bpPause')}` : `▶ ${t('bpPlay')}`}
              </button>
              <div className="bm-seg">
                <button onClick={() => go(step - 1)} disabled={step <= 1} aria-label={t('bpPrevStep')}>
                  ◀
                </button>
                <button onClick={() => go(step + 1)} disabled={step >= steps} aria-label={t('bpNextStep')}>
                  ▶
                </button>
              </div>
              <button onClick={() => go(1)} className="bm-btn bm-btn-ghost">
                {t('bpReplay')}
              </button>
              <span className="text-[11px] text-white/45">
                {step} / {steps}
              </span>
            </div>

            {/* Alle Schritte als Knöpfe – das ist zugleich die Fassung, die
                eine Vorlesehilfe bekommt, und der Weg zurück zu einem Zug. */}
            <div className="flex flex-wrap gap-1.5">
              {portrait.movements.map((m, i) => (
                <button
                  key={m.id}
                  onClick={() => go(i + 1)}
                  className={`bm-chip ${
                    current?.kind === 'move' && current.item.id === m.id
                      ? 'bg-white/18 ring-1 ring-gold'
                      : 'hover:bg-white/14'
                  }`}
                  style={{ borderLeft: `3px solid ${m.color}` }}
                >
                  <span className="text-white/50">{m.from === m.to ? m.from : `${m.from}–${m.to}`}</span>{' '}
                  {lang === 'de' ? m.title.de : m.title.en}
                </button>
              ))}
              {portrait.patterns.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => go(moves.length + i + 1)}
                  className={`bm-chip ${
                    current?.kind === 'pattern' && current.item.id === p.id
                      ? 'bg-white/18 ring-1 ring-gold'
                      : 'hover:bg-white/14'
                  }`}
                  style={{ borderLeft: `3px solid ${p.color}` }}
                >
                  ↻ {lang === 'de' ? p.title.de : p.title.en}
                </button>
              ))}
            </div>

            {/* Die Erzählung zum aktuellen Schritt */}
            {current?.kind === 'move' && (
              <article className="bm-panel p-4">
                {/* Die Farbe des Zuges als Schrift: aufgehellt, bis sie auf
                    dem dunklen Grund lesbar ist – als Fläche bleibt sie satt. */}
                <div className="bm-eyebrow" style={{ color: readableOnDark(current.item.color) }}>
                  {t('bpChaptersShort')} {current.item.from === current.item.to ? current.item.from : `${current.item.from}–${current.item.to}`}
                </div>
                <h3 className="font-display text-lg text-white">
                  {lang === 'de' ? current.item.title.de : current.item.title.en}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/80">
                  {lang === 'de' ? current.item.text.de : current.item.text.en}
                </p>
                {current.item.turn && (
                  <p className="mt-3 border-l-2 border-gold pl-3 text-sm italic leading-relaxed text-white/70">
                    {lang === 'de' ? current.item.turn.de : current.item.turn.en}
                  </p>
                )}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <button
                    className="bm-btn bm-btn-ghost"
                    onClick={() => onOpenReading?.(osis, current.item.from)}
                  >
                    {t('bpOpenReading')}
                  </button>
                  {(current.item.places ?? []).map((n) => {
                    const p = placeByName(n);
                    if (!p) return null;
                    return (
                      <button key={n} className="bm-chip hover:bg-white/14" onClick={() => onShowPlace?.(p)}>
                        📍 {placeName(p, lang)}
                      </button>
                    );
                  })}
                </div>
              </article>
            )}
            {current?.kind === 'pattern' && (
              <article className="bm-panel p-4">
                <div className="bm-eyebrow" style={{ color: readableOnDark(current.item.color) }}>
                  {t('bpPatterns')}
                </div>
                <h3 className="font-display text-lg text-white">
                  {lang === 'de' ? current.item.title.de : current.item.title.en}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/80">
                  {lang === 'de' ? current.item.text.de : current.item.text.en}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {current.item.refs.map((r) => (
                    <a
                      key={r}
                      href={refUrl(r, bibleVersion)}
                      target="_blank"
                      rel="noreferrer"
                      className="bm-chip"
                    >
                      {r}
                    </a>
                  ))}
                </div>
              </article>
            )}

            <p className="text-[11px] leading-snug text-white/40">{t('bpAxisNote')}</p>
          </div>

          {/* ---------------------------------------------- rechts: die Tafeln */}
          <div className="scroll-soft flex min-h-0 flex-1 flex-col lg:overflow-hidden">
            <div className="scroll-soft flex flex-none gap-1 overflow-x-auto border-b border-white/10 px-4 py-2 sm:px-5">
              {(
                [
                  ['heart', 'bpHeart'],
                  ['figures', 'bpFigures'],
                  ['time', 'bpTime'],
                  ['jesus', 'bpJesus'],
                  ['deep', 'bpDeep'],
                  ['media', 'bpMedia'],
                ] as [Tab, string][]
              ).map(([id, key]) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={`flex-none px-3 py-1.5 text-xs font-bold transition ${
                    tab === id ? 'bg-signal text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
                >
                  {t(key)}
                </button>
              ))}
            </div>

            <div className="scroll-soft min-h-0 flex-1 px-4 py-4 sm:px-5 lg:overflow-y-auto">
              {tab === 'heart' && <HeartPanel portrait={portrait} lang={lang} version={bibleVersion} />}
              {tab === 'figures' && (
                <FiguresPanel
                  portrait={portrait}
                  lang={lang}
                  chapters={book.chapters}
                  version={bibleVersion}
                  placeByName={placeByName}
                  onShowPlace={onShowPlace}
                  onOpenPerson={onOpenPerson}
                />
              )}
              {tab === 'time' && (
                <TimePanel portrait={portrait} lang={lang} onOpenReading={(c) => onOpenReading?.(osis, c)} />
              )}
              {tab === 'jesus' && <JesusPanel portrait={portrait} lang={lang} version={bibleVersion} />}
              {tab === 'deep' && <DeepPanel portrait={portrait} lang={lang} />}
              {tab === 'media' && (
                <MediaPanel
                  portrait={portrait}
                  lang={lang}
                  name={name}
                  episodes={episodeCount}
                  version={bibleVersion}
                  onOpenMedia={() => onOpenMedia?.(osis, 1)}
                  onOpenShelf={() => onOpenShelf?.(osis)}
                  onOpenReading={() => onOpenReading?.(osis, 1)}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* --------------------------------------------------------------- Hilfsteile */

/**
 * Ein Link in den Bibeltext. Die Stellen in den Daten stehen in deutscher
 * Schreibweise („1. Mose 12,3"); BibleGateway will den englischen Buchnamen,
 * und den liefert `bibleGatewayUrl` aus dem OSIS-Kürzel. Lässt sich die Stelle
 * nicht auflösen, führt der Link auf die Suche – nie ins Leere.
 */
function refUrl(ref: string, version: string): string {
  const m = ref.match(/^(.*?)\s*(\d{1,3})(?:[,:]\d{1,3})?(?:\s*[-–].*)?$/);
  const book = BOOKS.find((b) => {
    const keys = [b.osis, b.en, ...b.de.split(/[()]/)].map((s) => s.trim().toLowerCase().replace(/\.\s*/g, ''));
    return keys.includes((m?.[1] ?? ref).trim().toLowerCase().replace(/\.\s*/g, ''));
  });
  if (!book || !m) return `https://www.biblegateway.com/quicksearch/?quicksearch=${encodeURIComponent(ref)}&version=${version}`;
  return bibleGatewayUrl(book.osis, Number(m[2]), version);
}

function HeartPanel({ portrait, lang, version }: { portrait: Portrait; lang: Lang; version: string }) {
  const t = useT();
  const f = portrait.facts;
  const pick = (b: { de: string; en: string }) => (lang === 'de' ? b.de : b.en);
  return (
    <div className="flex flex-col gap-4">
      <section>
        <div className="bm-eyebrow">{t('bpHeart')}</div>
        <p className="mt-1 text-sm leading-relaxed text-white/85">{pick(portrait.heart)}</p>
      </section>

      <section className="bm-panel p-4">
        <div className="bm-eyebrow bm-eyebrow-dim">{t('bpKeyVerse')}</div>
        <blockquote className="mt-1 font-display text-base leading-snug text-white">
          {quoted(pick(portrait.verse), lang)}
        </blockquote>
        <a
          href={refUrl(portrait.verse.ref, version)}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-block text-xs text-gold underline hover:text-white"
        >
          {lang === 'de' ? portrait.verse.ref : portrait.verse.refEn ?? portrait.verse.ref}
        </a>
      </section>

      <section>
        <div className="bm-eyebrow bm-eyebrow-dim">{t('bpFacts')}</div>
        <dl className="mt-2 grid grid-cols-3 gap-2">
          {[
            [t('bpChapters'), String(f.chapters)],
            [t('bpVerses'), String(f.verses)],
            [t('bpPlaces'), String(f.places)],
          ].map(([k, v]) => (
            <div key={k} className="bg-white/5 px-3 py-2">
              <dt className="text-[10px] uppercase tracking-wide text-white/45">{k}</dt>
              <dd className="font-display text-xl text-gold">{v}</dd>
            </div>
          ))}
        </dl>
        <dl className="mt-2 flex flex-col gap-2">
          {[
            [t('bpHebrew'), `${portrait.hebrew.word} · ${portrait.hebrew.translit} – ${pick(portrait.hebrew.means)}`],
            [t('bpGenre'), pick(f.genre)],
            [t('bpScene'), pick(f.scene)],
            [t('bpKeyword'), pick(f.keyword)],
          ].map(([k, v]) => (
            <div key={k} className="border-l-2 border-white/10 pl-3">
              <dt className="text-[10px] uppercase tracking-wide text-white/45">{k}</dt>
              <dd className="text-sm leading-snug text-white/80">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section>
        <div className="bm-eyebrow bm-eyebrow-dim">{t('bpQuestions')}</div>
        <ul className="mt-2 flex flex-col gap-2">
          {portrait.questions.map((q) => (
            <li key={q.de} className="border-l-2 border-gold/50 pl-3 text-sm leading-snug text-white/75">
              {pick(q)}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function FiguresPanel({
  portrait,
  lang,
  chapters,
  version,
  placeByName,
  onShowPlace,
  onOpenPerson,
}: {
  portrait: Portrait;
  lang: Lang;
  chapters: number;
  version: string;
  placeByName: (n: string) => Place | null;
  onShowPlace?: (p: Place) => void;
  onOpenPerson?: (id: string) => void;
}) {
  const t = useT();
  const pick = (b: { de: string; en: string }) => (lang === 'de' ? b.de : b.en);
  return (
    <div className="flex flex-col gap-3">
      {portrait.figures.map((fig) => {
        const place = fig.place ? placeByName(fig.place) : null;
        // Derselbe Maßstab wie die Rolle: der Balken zeigt, wo im Buch dieser
        // Mensch vorkommt – und wie viel Platz er bekommt.
        const left = ((fig.from - 1) / chapters) * 100;
        const width = Math.max(1.5, ((fig.to - fig.from + 1) / chapters) * 100);
        return (
          <article key={fig.id} className="bm-panel p-4">
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="font-display text-base text-white">{lang === 'de' ? fig.de : fig.en}</h3>
              <span className="flex-none text-[11px] text-white/45">{fig.ref}</span>
            </div>
            <div className="mt-1.5 h-1.5 w-full bg-white/8">
              <div className="h-full bg-gold/70" style={{ marginLeft: `${left}%`, width: `${width}%` }} />
            </div>
            <p className="mt-2 text-xs leading-snug text-white/55">
              <span className="uppercase tracking-wide text-white/40">{t('bpMeaning')}: </span>
              {pick(fig.meaning)}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-white/80">{pick(fig.who)}</p>
            <p className="mt-2 border-l-2 border-gold pl-3 text-sm leading-relaxed text-white/70">
              <span className="uppercase tracking-wide text-[10px] text-white/40">{t('bpTurn')}: </span>
              {pick(fig.turn)}
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <a href={refUrl(fig.ref, version)} target="_blank" rel="noreferrer" className="bm-chip">
                {t('bpRead')}
              </a>
              {fig.person && onOpenPerson && (
                <button className="bm-chip" onClick={() => onOpenPerson(fig.person!)}>
                  {t('bpInTree')}
                </button>
              )}
              {place && onShowPlace && (
                <button className="bm-chip hover:bg-white/14" onClick={() => onShowPlace(place)}>
                  📍 {placeName(place, lang)}
                </button>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}

function TimePanel({
  portrait,
  lang,
  onOpenReading,
}: {
  portrait: Portrait;
  lang: Lang;
  onOpenReading: (chapter: number) => void;
}) {
  const t = useT();
  const pick = (b: { de: string; en: string }) => (lang === 'de' ? b.de : b.en);
  return (
    <div className="flex flex-col gap-3">
      <p className="text-[11px] leading-snug text-white/45">{t('bpTimeNote')}</p>
      <ol className="flex flex-col">
        {portrait.beats.map((b, i) => (
          <li key={b.id} className="relative flex gap-3 pb-4 last:pb-0">
            {/* die Schiene selbst – ein Strich, an dem die Marken hängen */}
            {i < portrait.beats.length - 1 && (
              <span aria-hidden="true" className="absolute left-[7px] top-4 h-full w-px bg-white/15" />
            )}
            <span aria-hidden="true" className="mt-1.5 h-3.5 w-3.5 flex-none rotate-45 bg-gold" />
            <div className="min-w-0">
              <div className="flex flex-wrap items-baseline gap-2">
                <h3 className="font-display text-base text-white">{pick(b.label)}</h3>
                <button
                  className="text-[11px] text-gold underline hover:text-white"
                  onClick={() => onOpenReading(b.chapter)}
                >
                  {t('bpChaptersShort')} {b.chapter}
                </button>
              </div>
              <div className="text-xs text-mint">{pick(b.when)}</div>
              <p className="mt-1 text-sm leading-relaxed text-white/75">{pick(b.note)}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function JesusPanel({ portrait, lang, version }: { portrait: Portrait; lang: Lang; version: string }) {
  const t = useT();
  const pick = (b: { de: string; en: string }) => (lang === 'de' ? b.de : b.en);
  const refOf = (q: { ref: string; refEn?: string }) => (lang === 'de' ? q.ref : q.refEn ?? q.ref);
  return (
    <div className="flex flex-col gap-3">
      <p className="text-[11px] leading-snug text-white/45">{t('bpJesusNote')}</p>
      {portrait.traces.map((tr) => (
        <article key={tr.id} className="bm-panel p-4">
          <h3 className="font-display text-base text-white">{pick(tr.title)}</h3>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-stretch">
            <blockquote className="flex-1 border-l-2 border-clay pl-3 text-sm leading-snug text-white/80">
              {quoted(pick(tr.seed), lang)}
              <a
                href={refUrl(tr.seed.ref, version)}
                target="_blank"
                rel="noreferrer"
                className="mt-1 block text-[11px] text-gold underline hover:text-white"
              >
                {refOf(tr.seed)}
              </a>
            </blockquote>
            <span aria-hidden="true" className="grid flex-none place-items-center px-1 text-gold">
              →
            </span>
            <blockquote className="flex-1 border-l-2 border-signal pl-3 text-sm leading-snug text-white/80">
              {quoted(pick(tr.echo), lang)}
              <a
                href={refUrl(tr.echo.refEn ?? tr.echo.ref, version)}
                target="_blank"
                rel="noreferrer"
                className="mt-1 block text-[11px] text-gold underline hover:text-white"
              >
                {refOf(tr.echo)}
              </a>
            </blockquote>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-white/70">{pick(tr.text)}</p>
        </article>
      ))}
    </div>
  );
}

function DeepPanel({ portrait, lang }: { portrait: Portrait; lang: Lang }) {
  const t = useT();
  const pick = (b: { de: string; en: string }) => (lang === 'de' ? b.de : b.en);
  return (
    <div className="flex flex-col gap-3">
      {portrait.deepen.map((d) => (
        <article key={d.id} className="bm-panel p-4">
          <h3 className="font-display text-base text-white">{pick(d.title)}</h3>
          <p className="mt-2 text-sm leading-relaxed text-white/80">{pick(d.text)}</p>
          <p className="mt-2 text-[11px] leading-snug text-white/45">
            <span className="uppercase tracking-wide">{t('bpSource')}: </span>
            {pick(d.source)}
          </p>
        </article>
      ))}
    </div>
  );
}

function MediaPanel({
  portrait,
  lang,
  name,
  episodes,
  version,
  onOpenMedia,
  onOpenShelf,
  onOpenReading,
}: {
  portrait: Portrait;
  lang: Lang;
  name: string;
  episodes: number;
  version: string;
  onOpenMedia: () => void;
  onOpenShelf: () => void;
  onOpenReading: () => void;
}) {
  const t = useT();
  const ids = bibleProjectVideoIds(portrait.osis, lang);
  return (
    <div className="flex flex-col gap-4">
      <section>
        <div className="bm-eyebrow">{t('video')}</div>
        {ids.length > 0 ? (
          <>
            <div className="mt-2">
              <YouTubeEmbed ids={ids} title={name} />
            </div>
            <p className="mt-1 text-[11px] text-white/45">
              {lang === 'de' && hasGermanVideo(portrait.osis) ? t('bpVideoDe') : t('bpVideoEn')}
            </p>
          </>
        ) : (
          <p className="mt-1 text-sm text-white/60">{t('bpNoVideo')}</p>
        )}
        <a
          href={bibleProjectUrl(portrait.osis)}
          target="_blank"
          rel="noreferrer"
          className="bm-btn bm-btn-ghost mt-2 inline-block"
        >
          {t('shelfGuide')}
        </a>
      </section>

      <section>
        <div className="bm-eyebrow bm-eyebrow-dim">{t('bpListen')}</div>
        <p className="mt-1 text-sm leading-relaxed text-white/70">
          {t('bpListenNote').replace('{n}', String(episodes)).replace('{book}', name)}
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <button className="bm-btn bm-btn-ghost" onClick={onOpenMedia} disabled={episodes === 0}>
            {t('bpOpenMedia')}
          </button>
          <button className="bm-btn bm-btn-ghost" onClick={onOpenReading}>
            {t('bpOpenReading')}
          </button>
          <button className="bm-btn bm-btn-ghost" onClick={onOpenShelf}>
            {t('bpOpenShelf')}
          </button>
        </div>
      </section>

      <section>
        <div className="bm-eyebrow bm-eyebrow-dim">{t('bpReadWhole')}</div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {portrait.movements.map((m) => (
            <a
              key={m.id}
              href={bibleGatewayUrl(portrait.osis, m.from, version)}
              target="_blank"
              rel="noreferrer"
              className="bm-chip hover:bg-white/14"
              style={{ borderLeft: `3px solid ${m.color}` }}
            >
              {m.from === m.to ? m.from : `${m.from}–${m.to}`} ·{' '}
              {lang === 'de' ? m.title.de : m.title.en}
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}

/**
 * Ein Buch ohne Porträt. Die ehrliche Auskunft ist besser als eine leere
 * Seite – und sie zeigt, was es zu diesem Buch trotzdem schon gibt.
 */
function NoPortrait({
  osis,
  name,
  lang,
  onPick,
  onOpenShelf,
  onOpenReading,
}: {
  osis: string;
  name: string;
  lang: Lang;
  onPick: (osis: string) => void;
  onOpenShelf?: (osis: string) => void;
  onOpenReading?: (osis: string, chapter: number) => void;
}) {
  const t = useT();
  return (
    <div className="scroll-soft min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-5">
      <div className="mx-auto max-w-2xl">
        <h2 className="font-display text-xl text-white">{t('bpNoPortrait').replace('{book}', name)}</h2>
        <p className="mt-2 text-sm leading-relaxed text-white/70">{t('bpNoPortraitHint')}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <button className="bm-btn bm-btn-ghost" onClick={() => onOpenReading?.(osis, 1)}>
            {t('bpOpenReading')}
          </button>
          <button className="bm-btn bm-btn-ghost" onClick={() => onOpenShelf?.(osis)}>
            {t('bpOpenShelf')}
          </button>
          <a href={bibleProjectUrl(osis)} target="_blank" rel="noreferrer" className="bm-btn bm-btn-ghost">
            {t('shelfGuide')}
          </a>
        </div>
        <div className="mt-6">
          <div className="bm-eyebrow bm-eyebrow-dim">{t('bpReady')}</div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {PORTRAITS.map((p) => (
              <button key={p.osis} className="bm-chip" onClick={() => onPick(p.osis)}>
                ★{' '}
                {lang === 'de'
                  ? BOOK_BY_OSIS[p.osis].de.replace(/\s*\(.*\)$/, '')
                  : BOOK_BY_OSIS[p.osis].en}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
