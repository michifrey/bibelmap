import { useEffect, useMemo, useRef, useState } from 'react';
import type { Lang } from '../i18n';
import { t as tr, useT } from '../i18n';
import { BOOK_BY_OSIS, bibleGatewayUrl, bibleProjectUrl } from '../data/books';
import { ERAS, ERA_BY_ID } from '../data/eras';
import {
  GROUPS,
  GROUP_BY_ID,
  LINKS_TO,
  PERIODS,
  SHELF,
  SHELF_BY_OSIS,
  formatSpan,
  spineHeight,
  spineWidth,
  type BookLink,
  type LinkKind,
  type ShelfBook,
} from '../data/shelf';
import { FINDS, FIND_BY_ID, FIND_KIND, type Find } from '../data/finds';
import { LAW_BY_ID, LAW_KIND, LAW_TEXTS, MIZWOT, type LawText } from '../data/lawTexts';
import { readableOnDark } from '../lib/contrast';
import { ExternalIcon, ImageCredit, useArticle } from './WikiFigure';
import { wikiLink } from '../lib/wikipediaArticle';

/*
 * Die Bibel als Regal.
 *
 * Die Kanonreihenfolge ist die einzige, in der die meisten Menschen die Bibel
 * je gesehen haben – und sie ist keine der Zeit. Der älteste Text des Neuen
 * Testaments steht als 52. Buch, das jüngste Evangelium als 43. Hier stehen
 * dieselben 66 Rücken in drei Ordnungen, und der Wechsel zwischen ihnen ist
 * das eigentliche Argument der Ansicht: Dieselben Bücher, dreimal ganz anders
 * einsortiert.
 *
 * **Was ein Rücken sagt.** Die Breite ist die Kapitelzahl (gewurzelt, sonst
 * wäre Obadja ein Strich), die Farbe die Kanongruppe, die Höhe nichts – sie
 * kommt aus der Buchnummer und steht nur da, damit das Regal nicht aussieht
 * wie ein Balkendiagramm. Dass die Höhe nichts misst, steht unter dem Regal;
 * eine Grafik, die drei Dinge zeigt und nur zwei erklärt, lädt zum
 * Falschlesen ein.
 *
 * **Warum die Bretter seitlich scrollen.** Ein Brett mit zwanzig Büchern ist
 * breiter als ein Telefon. Umbrechen ginge – dann aber steht die Hälfte der
 * Bücher in der Luft, weil das Brett unter der zweiten Reihe fehlt. Ein Regal
 * mit einem Brett je Reihe zu zeichnen hieße, die Zeitabschnitte zu
 * zerschneiden, nach denen es geordnet ist. Also scrollt jedes Brett, und die
 * Prüfung auf 390 Pixel zählt Bedienelemente in scrollbaren Streifen zu Recht
 * nicht als Überlauf.
 *
 * **Warum Handschriften und Gesetzestexte dazugehören.** Ein Regal, das beim
 * letzten kanonischen Buch aufhört, behauptet zweierlei: dass der Text ohne
 * Weiteres da ist, und dass die Arbeit an ihm mit dem Kanon endete. Beides
 * stimmt nicht. Zu jedem Buch steht deshalb, welche Handschrift es am
 * längsten trägt und wer sie gefunden hat, und unter dem biblischen Regal
 * steht ein zweites mit dem, was danach weitergeschrieben wurde.
 */

/**
 * Was im Fenster rechts steht. Dieselbe Form steht in der Adresse
 * (`#regal=buch,Isa`), damit Auswahl und Tieflink nicht auseinanderlaufen.
 */
export type Sel = { kind: 'book' | 'law' | 'find'; id: string };

type Ordering = 'written' | 'told' | 'canon';
type Tab = 'shelf' | 'finds';

const ORDER_KEY: Record<Ordering, string> = {
  written: 'shelfOrderWritten',
  told: 'shelfOrderTold',
  canon: 'shelfOrderCanon',
};

/*
 * Die Beschriftung eines Verweises hängt an der Richtung, in der man ihn liest.
 * Ein Verweis steht immer beim zeigenden Buch – `{ to: 'Luke', kind: 'quoted' }`
 * bei Jesaja heißt: Lukas zitiert Jesaja. In der Liste „Zeigt auf" steht dann
 * Lukas, und daneben gehört, was **Lukas** tut. In der Liste „Darauf zeigen",
 * die denselben Verweis von der anderen Seite sieht, gehört das Gegenteil hin.
 *
 * Vorher stand beide Male dasselbe Wort. Unter „Zeigt auf" las sich das dann
 * als „Lukas · wird zitiert" – die Umkehrung dessen, was der Satz darunter
 * erzählte.
 */
const LINK_OUT: Record<LinkKind, string> = {
  quotes: 'shelfLinkQuotedHere',
  quoted: 'shelfLinkQuotesThis',
  parallel: 'shelfLinkParallel',
  continues: 'shelfLinkContinues',
  answers: 'shelfLinkAnswers',
};

const LINK_IN: Record<LinkKind, string> = {
  quotes: 'shelfLinkQuotesThis',
  quoted: 'shelfLinkQuotedHere',
  parallel: 'shelfLinkParallel',
  continues: 'shelfLinkContinues',
  answers: 'shelfLinkAnswers',
};

/**
 * Die Breite eines Rückens auf dem Gesetzesregal. Sie ist für alle gleich, und
 * das ist die Aussage: Diese Texte sind nicht in Kapiteln zu messen, und eine
 * erfundene Vergleichszahl wäre schlechter als gar keine. Der Satz dazu steht
 * unter dem Regal.
 */
const LAW_BREIT = 54;

/** Ein Brett: Überschrift, Zeitangabe, ein Satz – und die Rücken darauf. */
interface Board {
  id: string;
  title: string;
  range: string;
  note: string;
  color: string;
  books: ShelfBook[];
}

function norm(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

function bookName(osis: string, lang: Lang): string {
  const meta = BOOK_BY_OSIS[osis];
  if (!meta) return osis;
  // Die Klammer hinter „1. Mose (Genesis)" trägt kein Buchrücken.
  return (lang === 'de' ? meta.de : meta.en).replace(/\s*\(.*\)$/, '');
}

/** Der Name, den ein Verweisziel trägt – ein Buch oder ein Gesetzestext. */
function targetName(id: string, lang: Lang): string {
  if (LAW_BY_ID[id]) return lang === 'de' ? LAW_BY_ID[id].de : LAW_BY_ID[id].en;
  return bookName(id, lang);
}

interface Props {
  lang: Lang;
  /** Auswahl aus der Adresse (`#regal=buch,Isa`) oder aus der Suche. */
  initial?: Sel | null;
  /** Damit die Adresse mitläuft, wenn jemand weiterblättert. */
  onNavigate?: (sel: Sel | null) => void;
  onExit: () => void;
}

export default function Bookshelf({ lang, initial, onNavigate, onExit }: Props) {
  const t = useT();
  const [tab, setTab] = useState<Tab>(initial?.kind === 'find' ? 'finds' : 'shelf');
  const [ordering, setOrdering] = useState<Ordering>('written');
  const [query, setQuery] = useState('');
  const [sel, setSel] = useState<Sel | null>(initial ?? null);
  const shelfRef = useRef<HTMLDivElement | null>(null);
  const detailRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    onNavigate?.(sel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sel]);

  /** Die Bretter der gewählten Ordnung – leere fallen weg. */
  const boards: Board[] = useMemo(() => {
    const q = norm(query.trim());
    const testament = (t2: 'AT' | 'NT') => tr(lang, t2 === 'AT' ? 'oldTestament' : 'newTestament');
    const passt = (b: ShelfBook) =>
      !q || norm(bookName(b.osis, lang)).includes(q) || norm(b.osis).includes(q);

    if (ordering === 'canon') {
      return GROUPS.filter((g) => g.id !== 'halacha')
        .map((g) => ({
          id: g.id,
          title: lang === 'de' ? g.de : g.en,
          range: testament(g.testament),
          note: '',
          color: g.color,
          books: SHELF.filter((b) => b.group === g.id && passt(b)),
        }))
        .filter((s) => s.books.length > 0);
    }
    if (ordering === 'told') {
      return ERAS.map((e) => ({
        id: e.id,
        title: lang === 'de' ? e.de : e.en,
        range: e.range,
        note: '',
        color: e.color,
        books: SHELF.filter((b) => BOOK_BY_OSIS[b.osis]?.era === e.id && passt(b)),
      })).filter((s) => s.books.length > 0);
    }
    return PERIODS.filter((p) => !p.law)
      .map((p) => ({
        id: p.id,
        title: lang === 'de' ? p.de : p.en,
        range: lang === 'de' ? p.range.de : p.range.en,
        note: lang === 'de' ? p.note.de : p.note.en,
        color: '#e0a449',
        books: SHELF.filter((b) => b.period === p.id && passt(b)),
      }))
      .filter((s) => s.books.length > 0);
  }, [ordering, query, lang]);

  /** Alle sichtbaren Rücken der Reihe nach – das ist, was die Pfeiltasten begehen. */
  const flat = useMemo(() => boards.flatMap((s) => s.books), [boards]);

  /*
   * Die Bretter der Gesetzestexte – alle, auf denen welche stehen, nicht nur
   * die mit `law: true`. Die Gemeinderegel vom Toten Meer liegt in der
   * griechischen Zeit und teilt ihr Brett mit Prediger, Hoheslied und Daniel.
   * Sie steht trotzdem unter der zweiten Überschrift: Wer sie zwischen die
   * biblischen Rücken stellte, behauptete, sie stünde im Kanon.
   */
  const lawBoards = useMemo(() => {
    const q = norm(query.trim());
    return PERIODS.map((p) => ({
      period: p,
      texts: LAW_TEXTS.filter(
        (l) => l.period === p.id && (!q || norm(lang === 'de' ? l.de : l.en).includes(q) || norm(l.translit).includes(q)),
      ),
    })).filter((s) => s.texts.length > 0);
  }, [query, lang]);

  function pick(next: Sel | null) {
    setSel(next);
    if (next?.kind === 'find') setTab('finds');
    else if (next) setTab('shelf');
  }

  // Pfeiltasten begehen die Rücken in der Reihenfolge der gewählten Ordnung.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (tab !== 'shelf' || sel?.kind !== 'book') return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!step) return;
      const i = flat.findIndex((b) => b.osis === sel.id);
      if (i < 0) return;
      e.preventDefault();
      const next = flat[(i + step + flat.length) % flat.length];
      setSel({ kind: 'book', id: next.osis });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [flat, sel, tab]);

  /*
   * Beim Reiterwechsel nach oben. Die Fundliste erbte sonst den Scrollstand
   * des Regals und fing mitten im Jahr 1844 an – ihre Überschrift und der Satz
   * darüber, worum es geht, lagen über dem Bildrand.
   *
   * Steht vor dem Einscrollen der Auswahl, damit die beiden sich nicht in die
   * Quere kommen: erst an den Anfang, dann zum gewählten Eintrag.
   */
  useEffect(() => {
    shelfRef.current?.scrollTo?.({ top: 0 });
  }, [tab]);

  // Das Gewählte bleibt im Bild – der Rücken, auch wenn sein Brett seitlich
  // scrollt, und die Zeile in der Fundliste, auch wenn sie weit unten steht.
  useEffect(() => {
    if (!sel) return;
    shelfRef.current
      ?.querySelector<HTMLElement>(`[data-spine="${sel.kind}:${sel.id}"]`)
      ?.scrollIntoView({ block: 'nearest', inline: 'center' });
  }, [sel, tab]);

  // Auf dem Telefon liegt das Fenster über dem Regal; es soll oben anfangen.
  useEffect(() => {
    if (sel) detailRef.current?.scrollTo?.({ top: 0 });
  }, [sel]);

  return (
    <div className="fixed inset-0 z-[2000] flex flex-col bg-deepest">
      <div className="flex flex-none flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b border-white/10 bg-abyss px-4 py-3 text-white sm:px-5">
        <div className="flex items-center gap-2">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 text-gold" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M4 4h4v16H4zM10 4h4v16h-4zM16.5 4.8l3.4.9-4 14.6-3.4-1z" />
          </svg>
          <div className="font-display text-lg uppercase leading-none sm:text-xl">{t('shelf')}</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="bm-seg">
            <button className={tab === 'shelf' ? 'is-on' : ''} onClick={() => setTab('shelf')}>
              {t('shelfTabShelf')}
            </button>
            <button className={tab === 'finds' ? 'is-on' : ''} onClick={() => setTab('finds')}>
              {t('shelfTabFinds')}
            </button>
          </div>
          <button onClick={onExit} className="bm-btn bm-btn-gold">
            {t('exit')} ✕
          </button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        <div ref={shelfRef} className="scroll-soft min-h-0 flex-1 overflow-y-auto">
          {tab === 'shelf' ? (
            <ShelfBoards
              boards={boards}
              lawBoards={lawBoards}
              ordering={ordering}
              onOrdering={setOrdering}
              query={query}
              onQuery={setQuery}
              sel={sel}
              onPick={pick}
              lang={lang}
            />
          ) : (
            <FindList sel={sel} onPick={pick} lang={lang} />
          )}
        </div>

        <aside
          className={`${
            sel ? 'fixed inset-0 z-[2100] flex' : 'hidden'
          } flex-col bg-deepest md:static md:z-auto md:flex md:w-[40%] md:max-w-lg md:flex-none md:border-l md:border-white/10`}
        >
          {sel ? (
            <>
              <div className="flex flex-none items-center justify-between border-b border-white/10 bg-abyss px-4 py-2.5 md:hidden">
                <span className="bm-eyebrow bm-eyebrow-dim">{t('shelf')}</span>
                <button onClick={() => pick(null)} className="bm-btn bm-btn-ghost">
                  ‹ {t('prev')}
                </button>
              </div>
              <div ref={detailRef} className="scroll-soft min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5">
                {sel.kind === 'book' && <BookDetail osis={sel.id} lang={lang} onPick={pick} />}
                {sel.kind === 'law' && <LawDetail id={sel.id} lang={lang} onPick={pick} />}
                {sel.kind === 'find' && <FindDetail id={sel.id} lang={lang} onPick={pick} />}
              </div>
            </>
          ) : (
            <div className="hidden flex-1 items-center justify-center px-8 text-center md:flex">
              <p className="max-w-xs text-sm leading-relaxed text-white/45">{t('shelfPickHint')}</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

/* --- Das Regal ----------------------------------------------------------- */

function Spine({
  label,
  sub,
  width,
  height,
  color,
  on,
  onClick,
  spineId,
}: {
  label: string;
  sub: string;
  width: number;
  height: number;
  color: string;
  on: boolean;
  onClick: () => void;
  spineId?: string;
}) {
  return (
    <button
      data-spine={spineId}
      onClick={onClick}
      aria-pressed={on}
      title={`${label} · ${sub}`}
      style={{ width, height, background: color }}
      className={`bm-spine ${on ? 'is-on' : ''}`}
    >
      <span className="bm-spine-label">{label}</span>
    </button>
  );
}

function Board({
  title,
  range,
  note,
  color,
  children,
}: {
  title: string;
  range: string;
  note?: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-7">
      <div className="mb-1 flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5 px-4 sm:px-5">
        <h3 className="font-display text-lg uppercase leading-tight text-white">{title}</h3>
        <span className="bm-eyebrow" style={{ color: readableOnDark(color) }}>
          {range}
        </span>
      </div>
      {note && <p className="mb-2.5 max-w-prose px-4 text-[12.5px] leading-relaxed text-white/55 sm:px-5">{note}</p>}
      <div className="scroll-soft flex items-end gap-[2px] overflow-x-auto px-4 pt-2 sm:px-5">{children}</div>
      <div className="bm-shelf-board" />
    </section>
  );
}

function ShelfBoards({
  boards,
  lawBoards,
  ordering,
  onOrdering,
  query,
  onQuery,
  sel,
  onPick,
  lang,
}: {
  boards: Board[];
  lawBoards: { period: (typeof PERIODS)[number]; texts: LawText[] }[];
  ordering: Ordering;
  onOrdering: (o: Ordering) => void;
  query: string;
  onQuery: (q: string) => void;
  sel: Sel | null;
  onPick: (s: Sel) => void;
  lang: Lang;
}) {
  const t = useT();
  const nothing = boards.length === 0 && lawBoards.length === 0;

  return (
    <div className="py-4">
      <div className="mb-5 flex flex-wrap items-center gap-2 px-4 sm:px-5">
        <div className="bm-seg">
          {(['written', 'told', 'canon'] as Ordering[]).map((o) => (
            <button key={o} className={ordering === o ? 'is-on-gold' : ''} onClick={() => onOrdering(o)}>
              {t(ORDER_KEY[o] as 'shelfOrderWritten')}
            </button>
          ))}
        </div>
        <input
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder={t('shelfSearch')}
          aria-label={t('shelfSearch')}
          className="bm-input w-full sm:w-auto sm:max-w-xs sm:flex-1"
        />
      </div>

      {ordering === 'written' && (
        <p className="mb-5 max-w-prose px-4 text-[12.5px] leading-relaxed text-white/60 sm:px-5">{t('shelfDatingNote')}</p>
      )}

      {nothing && <p className="px-5 py-8 text-center text-sm text-white/50">{t('noResults')}</p>}

      {boards.map((s) => (
        <Board key={s.id} title={s.title} range={s.range} note={s.note} color={s.color}>
          {s.books.map((b) => {
            const meta = BOOK_BY_OSIS[b.osis];
            return (
              <Spine
                key={b.osis}
                spineId={`book:${b.osis}`}
                label={bookName(b.osis, lang)}
                sub={`${meta.chapters} ${t('shelfChapters')}`}
                width={spineWidth(meta.chapters)}
                height={spineHeight(meta.num)}
                color={GROUP_BY_ID[b.group].color}
                on={sel?.kind === 'book' && sel.id === b.osis}
                onClick={() => onPick({ kind: 'book', id: b.osis })}
              />
            );
          })}
        </Board>
      ))}

      {boards.length > 0 && (
        <p className="mb-8 max-w-prose px-4 text-[12px] leading-relaxed text-white/45 sm:px-5">{t('shelfLegend')}</p>
      )}

      {/* Das zweite Regal: was nach dem letzten kanonischen Buch weiterging. */}
      {lawBoards.length > 0 && (
        <div className="border-t border-white/10 pt-6">
          <div className="mb-2 px-4 sm:px-5">
            <div className="bm-eyebrow mb-1">{t('shelfLawKicker')}</div>
            <h2 className="font-display text-2xl uppercase leading-tight text-white">{t('shelfLawTitle')}</h2>
          </div>
          <p className="mb-6 max-w-prose px-4 text-[12.5px] leading-relaxed text-white/60 sm:px-5">
            {lang === 'de' ? MIZWOT.de : MIZWOT.en}
          </p>
          {lawBoards.map(({ period, texts }) => (
            <Board
              key={period.id}
              title={lang === 'de' ? period.de : period.en}
              range={lang === 'de' ? period.range.de : period.range.en}
              note={lang === 'de' ? period.note.de : period.note.en}
              color="#7a5aa8"
            >
              {texts.map((l) => (
                <Spine
                  key={l.id}
                  spineId={`law:${l.id}`}
                  label={lang === 'de' ? l.shortDe : l.shortEn}
                  sub={l.translit}
                  width={LAW_BREIT}
                  height={spineHeight(l.id.length)}
                  color="#7a5aa8"
                  on={sel?.kind === 'law' && sel.id === l.id}
                  onClick={() => onPick({ kind: 'law', id: l.id })}
                />
              ))}
            </Board>
          ))}
          <p className="px-4 pb-6 text-[12px] leading-relaxed text-white/45 sm:px-5">{t('shelfLawWidth')}</p>
        </div>
      )}
    </div>
  );
}

/* --- Die Funde ----------------------------------------------------------- */

function FindList({ sel, onPick, lang }: { sel: Sel | null; onPick: (s: Sel) => void; lang: Lang }) {
  const t = useT();
  const sorted = useMemo(() => [...FINDS].sort((a, b) => a.year - b.year), []);
  return (
    <div className="px-4 py-5 sm:px-5">
      <div className="bm-eyebrow mb-1">{t('shelfFindsKicker')}</div>
      <h2 className="font-display text-2xl uppercase leading-tight text-white">{t('shelfFindsTitle')}</h2>
      <p className="mt-2 max-w-prose text-[13px] leading-relaxed text-white/65">{t('shelfFindsIntro')}</p>
      <ul className="mt-5">
        {sorted.map((f) => {
          const kind = FIND_KIND[f.kind];
          const on = sel?.kind === 'find' && sel.id === f.id;
          return (
            <li key={f.id}>
              <button
                data-spine={`find:${f.id}`}
                onClick={() => onPick({ kind: 'find', id: f.id })}
                className={`bm-row ${on ? 'is-on' : ''}`}
              >
                <span className="bm-num w-14 flex-none text-right text-xl text-gold">{f.year}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13.5px] font-bold leading-tight text-white">
                    {lang === 'de' ? f.de : f.en}
                  </span>
                  <span className="mt-0.5 block text-[11px] leading-snug text-white/55">
                    <span style={{ color: readableOnDark(kind.color) }}>{lang === 'de' ? kind.de : kind.en}</span>
                    {' · '}
                    {lang === 'de' ? f.age.de : f.age.en}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* --- Die Fenster rechts --------------------------------------------------- */

/** Bild und Nachweis zu einem Wikipedia-Begriff; ohne Bild bleibt es beim Link. */
function WikiBand({ term, alt, lang }: { term: string; alt: string; lang: Lang }) {
  const art = useArticle(term, lang);
  if (!art?.thumb) return null;
  return (
    <figure className="mb-4">
      <img
        src={art.thumb}
        alt={alt}
        loading="lazy"
        referrerPolicy="no-referrer"
        className="h-44 w-full bg-abyss object-cover"
      />
      <figcaption className="bg-abyss/80 px-2 py-1 text-[10px] leading-snug text-white/55">
        <ImageCredit art={art} lang={lang} />
      </figcaption>
    </figure>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-4">
      <div className="bm-eyebrow bm-eyebrow-dim mb-1.5">{title}</div>
      {children}
    </div>
  );
}

function Prose({ children }: { children: React.ReactNode }) {
  return <p className="max-w-prose text-[13.5px] leading-relaxed text-white/80">{children}</p>;
}

function WikiOut({ term, lang, label }: { term: string; lang: Lang; label: string }) {
  return (
    <a href={wikiLink(term, lang)} target="_blank" rel="noreferrer" className="bm-btn bm-btn-ghost">
      {label}
      <ExternalIcon />
    </a>
  );
}

function LinkRow({ link, from, lang, onPick }: { link: BookLink; from?: string; lang: Lang; onPick: (s: Sel) => void }) {
  const t = useT();
  const id = from ?? link.to;
  const law = LAW_BY_ID[id];
  return (
    <li className="border-l-2 border-white/15 py-1.5 pl-2.5">
      <button
        onClick={() => onPick(law ? { kind: 'law', id } : { kind: 'book', id })}
        className="text-left text-[13px] font-bold text-mint hover:underline"
      >
        {targetName(id, lang)}
      </button>
      <span className="ml-1.5 text-[10px] uppercase tracking-wide text-white/40">
        {t((from ? LINK_IN : LINK_OUT)[link.kind] as 'shelfLinkParallel')}
      </span>
      <p className="mt-0.5 text-[12.5px] leading-relaxed text-white/70">{lang === 'de' ? link.de : link.en}</p>
    </li>
  );
}

function BookDetail({ osis, lang, onPick }: { osis: string; lang: Lang; onPick: (s: Sel) => void }) {
  const t = useT();
  const b = SHELF_BY_OSIS[osis];
  const meta = BOOK_BY_OSIS[osis];
  const find = FIND_BY_ID[b.oldest.find];
  const group = GROUP_BY_ID[b.group];
  const era = ERA_BY_ID[meta.era];
  const txt = lang === 'de' ? b.de : b.en;
  /*
   * Die Rückseite der Verweise – aber nur die, die nicht schon vorn stehen.
   *
   * Neunundzwanzig Paare sind in beide Richtungen geschrieben, und das mit
   * Absicht: Von 1. Mose aus ist die Auskunft „Johannes beginnt mit denselben
   * drei Wörtern", von Johannes aus „der erste Satz der Bibel, neu angesetzt".
   * Zwei Sätze, jeder für sein Fenster geschrieben. Ungefiltert stünden in der
   * Offenbarung beide untereinander – einmal unter „Zeigt auf", einmal unter
   * „Darauf zeigen", derselbe Zusammenhang zweimal. Vorn gewinnt: Das ist der
   * Satz, den dieses Buch selbst über das andere geschrieben hat.
   */
  const zeigtAuf = new Set(b.links.map((l) => l.to));
  const incoming = (LINKS_TO[osis] ?? []).filter((x) => !zeigtAuf.has(x.from));

  return (
    <div>
      {find && <WikiBand term={lang === 'de' ? find.wiki : find.wikiEn} alt={lang === 'de' ? find.de : find.en} lang={lang} />}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-deep" style={{ background: group.color }}>
          {lang === 'de' ? group.de : group.en}
        </span>
        <span className="bm-chip">{meta.chapters} {t('shelfChapters')}</span>
        {b.disputed && <span className="bm-chip text-gold">{t('shelfDisputed')}</span>}
      </div>
      <h2 className="mt-2 font-display text-3xl uppercase leading-[0.95] text-white">{bookName(osis, lang)}</h2>
      <p className="mt-1 text-[11.5px] text-white/45">
        {t('shelfBookNo')} {meta.num} · {osis}
      </p>

      <Section title={`${t('shelfWritten')} · ${formatSpan(b.from, b.to, lang)}`}>
        <Prose>{txt.dating}</Prose>
      </Section>

      <Section title={t('shelfWorld')}>
        <Prose>{txt.world}</Prose>
      </Section>

      <Section title={t('shelfOldest')}>
        <Prose>{lang === 'de' ? b.oldest.de : b.oldest.en}</Prose>
        {find && (
          <button onClick={() => onPick({ kind: 'find', id: find.id })} className="bm-btn bm-btn-ghost mt-2">
            {lang === 'de' ? find.de : find.en} ›
          </button>
        )}
      </Section>

      {b.links.length > 0 && (
        <Section title={t('shelfLinksOut')}>
          <ul>
            {b.links.map((l) => (
              <LinkRow key={`${l.to}-${l.kind}`} link={l} lang={lang} onPick={onPick} />
            ))}
          </ul>
        </Section>
      )}

      {incoming.length > 0 && (
        <Section title={t('shelfLinksIn')}>
          <ul>
            {incoming.map(({ from, link }) => (
              <LinkRow key={`${from}-${link.kind}`} link={link} from={from} lang={lang} onPick={onPick} />
            ))}
          </ul>
        </Section>
      )}

      <div className="mt-5 flex flex-wrap gap-1.5 border-t border-white/10 pt-4">
        <a
          href={bibleGatewayUrl(osis, 1, lang === 'de' ? 'LUTH1545' : 'ESV')}
          target="_blank"
          rel="noreferrer"
          className="bm-btn bm-btn-signal"
        >
          {t('shelfRead')}
          <ExternalIcon />
        </a>
        <a href={bibleProjectUrl(osis)} target="_blank" rel="noreferrer" className="bm-btn bm-btn-ghost">
          {t('shelfGuide')}
          <ExternalIcon />
        </a>
      </div>
      {era && (
        <p className="mt-3 text-[11.5px] text-white/45">
          {t('shelfTold')}: {lang === 'de' ? era.de : era.en} ({era.range})
        </p>
      )}
    </div>
  );
}

function LawDetail({ id, lang, onPick }: { id: string; lang: Lang; onPick: (s: Sel) => void }) {
  const t = useT();
  const l = LAW_BY_ID[id];
  const find = l.find ? FIND_BY_ID[l.find] : null;
  const kind = LAW_KIND[l.kind];

  return (
    <div>
      <WikiBand term={lang === 'de' ? l.wiki : l.wikiEn} alt={lang === 'de' ? l.de : l.en} lang={lang} />
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white" style={{ background: '#7a5aa8' }}>
          {lang === 'de' ? kind.de : kind.en}
        </span>
        <span className="bm-chip">{lang === 'de' ? l.when.de : l.when.en}</span>
      </div>
      <h2 className="mt-2 font-display text-3xl uppercase leading-[0.95] text-white">{lang === 'de' ? l.de : l.en}</h2>
      <p className="mt-1 text-[13px] text-white/55">
        <span lang="he" dir="rtl" className="text-[15px]">{l.hebrew}</span> · {l.translit}
      </p>

      <Section title={t('shelfLawWho')}>
        <Prose>{lang === 'de' ? l.who.de : l.who.en}</Prose>
      </Section>
      <Section title={t('shelfLawExtent')}>
        <Prose>{lang === 'de' ? l.extent.de : l.extent.en}</Prose>
      </Section>
      <Section title={t('shelfLawWhat')}>
        <Prose>{lang === 'de' ? l.what.de : l.what.en}</Prose>
      </Section>
      <Section title={t('shelfLawBible')}>
        <Prose>{lang === 'de' ? l.bible.de : l.bible.en}</Prose>
      </Section>

      <Section title={t('shelfLawBooks')}>
        <div className="flex flex-wrap gap-1.5">
          {l.books.map((osis) => (
            <button
              key={osis}
              onClick={() => onPick({ kind: 'book', id: osis })}
              className="px-3 py-1.5 text-[11.5px] font-bold text-white transition bg-white/8 hover:bg-white/16"
            >
              {bookName(osis, lang)}
            </button>
          ))}
        </div>
      </Section>

      <div className="mt-5 flex flex-wrap gap-1.5 border-t border-white/10 pt-4">
        {find && (
          <button onClick={() => onPick({ kind: 'find', id: find.id })} className="bm-btn bm-btn-ghost">
            {lang === 'de' ? find.de : find.en} ›
          </button>
        )}
        <WikiOut term={lang === 'de' ? l.wiki : l.wikiEn} lang={lang} label={t('shelfWikipedia')} />
      </div>
    </div>
  );
}

function FindDetail({ id, lang, onPick }: { id: string; lang: Lang; onPick: (s: Sel) => void }) {
  const t = useT();
  const f: Find = FIND_BY_ID[id];
  const kind = FIND_KIND[f.kind];
  const carries = SHELF.filter((b) => b.oldest.find === id);

  return (
    <div>
      <WikiBand term={lang === 'de' ? f.wiki : f.wikiEn} alt={lang === 'de' ? f.de : f.en} lang={lang} />
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-deep" style={{ background: kind.color }}>
          {lang === 'de' ? kind.de : kind.en}
        </span>
        <span className="bm-chip">{lang === 'de' ? f.when.de : f.when.en}</span>
        {f.disputed && <span className="bm-chip text-gold">{t('shelfDisputed')}</span>}
      </div>
      <h2 className="mt-2 font-display text-3xl uppercase leading-[0.95] text-white">{lang === 'de' ? f.de : f.en}</h2>

      <Section title={t('shelfFindWho')}>
        <Prose>{lang === 'de' ? f.who.de : f.who.en}</Prose>
      </Section>
      <Section title={t('shelfFindAge')}>
        <Prose>{lang === 'de' ? f.age.de : f.age.en}</Prose>
      </Section>
      <Section title={t('shelfFindWhere')}>
        <Prose>{lang === 'de' ? f.where.de : f.where.en}</Prose>
      </Section>
      <Section title={t('shelfFindText')}>
        <Prose>{lang === 'de' ? f.text.de : f.text.en}</Prose>
      </Section>
      <Section title={t('shelfFindLimits')}>
        <Prose>{lang === 'de' ? f.limits.de : f.limits.en}</Prose>
      </Section>

      {carries.length > 0 && (
        <Section title={t('shelfFindCarries')}>
          <div className="flex flex-wrap gap-1.5">
            {carries.map((b) => (
              <button
                key={b.osis}
                onClick={() => onPick({ kind: 'book', id: b.osis })}
                className="px-3 py-1.5 text-[11.5px] font-bold text-white transition bg-white/8 hover:bg-white/16"
              >
                {bookName(b.osis, lang)}
              </button>
            ))}
          </div>
        </Section>
      )}

      <div className="mt-5 border-t border-white/10 pt-4">
        <WikiOut term={lang === 'de' ? f.wiki : f.wikiEn} lang={lang} label={t('shelfWikipedia')} />
      </div>
    </div>
  );
}
