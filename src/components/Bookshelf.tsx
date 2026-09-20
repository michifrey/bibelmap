import { useEffect, useMemo, useRef, useState } from 'react';
import type { Place } from '../types';
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
import { FIND_PLACES } from '../data/findPlaces';
import { LAW_BY_ID, LAW_KIND, LAW_TEXTS, MIZWOT, type LawText } from '../data/lawTexts';
import {
  PHIL_ACHSE,
  PHIL_ANSTOSS,
  PHIL_BREITE,
  PHIL_BY_ID,
  PHIL_INTRO,
  PHIL_KIND,
  PHIL_LINKS_TO,
  PHIL_MARKEN,
  PHIL_PERIODS,
  PHIL_SPUR_HOEHE,
  PHIL_STRAHL_BREIT,
  PHIL_WORKS,
  philLanes,
  philMarkX,
  type PhilLink,
  type PhilLinkKind,
  type PhilWork,
} from '../data/philosophy';
import { readableOnDark } from '../lib/contrast';
import { ExternalIcon, ImageCredit, useArticle } from './WikiFigure';
import { wikiLink } from '../lib/wikipediaArticle';
import { findPlacesByNames, placeName } from '../lib/places';

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
 * längsten trägt und wer sie gefunden hat, und neben dem biblischen Regal
 * steht ein zweites mit dem, was danach weitergeschrieben wurde.
 *
 * **Und ein drittes: die philosophischen Werke.** Kein Satz dieser Bibel wurde
 * je ohne Vorverständnis gelesen – „Im Anfang war das Wort" steht auf
 * Griechisch da, und `logos` war ein besetzter Begriff. Das dritte Regal zeigt,
 * mit welchen Begriffen gelesen wurde, von Platon bis in die Gegenwart, und es
 * bekommt als einziges einen Zeitstrahl: Dort ist der Abstand die Aussage.
 * Zwischen Boethius und Anselm liegen 550 Jahre ohne einen Rücken, und diese
 * Lücke sieht man nur, wenn die Achse in Jahren rechnet und nicht in Einträgen.
 *
 * **Nebeneinander, nicht untereinander.** Die drei Regale standen gestapelt in
 * einem Reiter: erst sechs Bretter Bibel, dann fünf Gesetzestexte, dann acht
 * philosophische. Zusammen waren das gut vier Bildschirmhöhen, und die beiden
 * unteren Überschriften lagen dort, wo sie niemand vermutet – hinter dem Ende
 * des Regals, nach dem man nicht weitersucht. Jedes trägt jetzt oben einen
 * eigenen Knopf (`Tab`), die Suche läuft weiter über alle drei, und das leere
 * Regal sagt, auf welchem anderen die Treffer liegen.
 */

/**
 * Was im Fenster rechts steht. Dieselbe Form steht in der Adresse
 * (`#regal=buch,Isa`), damit Auswahl und Tieflink nicht auseinanderlaufen.
 */
export type Sel = { kind: 'book' | 'law' | 'find' | 'phil'; id: string };

type Ordering = 'written' | 'told' | 'canon';

/*
 * Ein Reiter je Regal, nicht eines unter dem anderen.
 *
 * Die drei Regale – die biblischen Bücher, die Gesetzestexte, die
 * philosophischen Werke – standen untereinander in einem einzigen Reiter.
 * Zusammen waren das über hundert Rücken auf zwanzig Brettern; das zweite
 * Regal begann nach dem letzten Brett des ersten, das dritte nach dem
 * Zeitstrahl des zweiten. Wer nicht weiterscrollte, sah nur die Bibel und
 * hatte keinen Anlass zu vermuten, dass darunter noch etwas steht. Eine
 * Überschrift, die man erst findet, wenn man an ihr vorbeigescrollt ist,
 * kündigt nichts an.
 *
 * Jetzt trägt jedes Regal einen Knopf oben, neben den Funden, und jeder
 * Reiter ist für sich kurz. Die Auswahl im Fenster rechts bestimmt den
 * Reiter mit (`pick`), damit ein Tieflink auf einen Gesetzestext nicht auf
 * dem leeren Bibelregal landet.
 */
type Tab = 'books' | 'law' | 'phil' | 'finds';

const TAB_KEY: Record<Tab, string> = {
  books: 'shelfTabBooks',
  law: 'shelfTabLaw',
  phil: 'shelfTabPhil',
  finds: 'shelfTabFinds',
};

/** Welches Regal eine Auswahl zeigt – die Umkehrung ist `Sel['kind']`. */
const TAB_FOR: Record<Sel['kind'], Tab> = {
  book: 'books',
  law: 'law',
  phil: 'phil',
  find: 'finds',
};

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

/*
 * Dieselbe Regel wie oben, für das dritte Regal: Ein Verweis steht beim
 * späteren Werk, `to` ist immer das frühere. Anders als bei den Büchern ist
 * hier keine Art symmetrisch – „baut darauf auf" gilt nur in einer Richtung –,
 * deshalb zwei Wortlaute je Art statt eines gespiegelten Paares.
 */
const PHIL_OUT: Record<PhilLinkKind, string> = {
  builds: 'shelfPhilLinkBuilds',
  against: 'shelfPhilLinkAgainst',
  echoes: 'shelfPhilLinkEchoes',
};

const PHIL_IN: Record<PhilLinkKind, string> = {
  builds: 'shelfPhilLinkBuiltOn',
  against: 'shelfPhilLinkOpposed',
  echoes: 'shelfPhilLinkEchoed',
};

/**
 * Die Breite eines Rückens auf dem Gesetzesregal. Sie ist für alle gleich, und
 * das ist die Aussage: Diese Texte sind nicht in Kapiteln zu messen, und eine
 * erfundene Vergleichszahl wäre schlechter als gar keine. Der Satz dazu steht
 * unter dem Regal.
 */
const LAW_BREIT = 54;

/**
 * Und dieselbe Überlegung im dritten Regal. Die Summa theologiae hat 2600
 * Artikel, der Brief an Menoikeus zwei Seiten – nur ist das keine gemeinsame
 * Einheit, sondern zweimal etwas anderes. Statt eine Vergleichszahl zu
 * erfinden, stehen alle gleich breit; wie umfangreich ein Werk ist, steht im
 * Fenster daneben als Satz.
 */
const PHIL_BREIT = 58;

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

/** Der Werktitel, wie er auf einem Knopf steht: „Platon · Der Staat". */
function philName(id: string, lang: Lang): string {
  const w = PHIL_BY_ID[id];
  if (!w) return id;
  return `${lang === 'de' ? w.author.de : w.author.en} · ${lang === 'de' ? w.de : w.en}`;
}

interface Props {
  lang: Lang;
  /** Für den Weg vom Fund auf die Hauptkarte – sonst leer. */
  places?: Place[];
  /** Einen Ort auf der Hauptkarte zeigen; schließt den Modus. */
  onShowPlace?: (p: Place) => void;
  /** Auswahl aus der Adresse (`#regal=buch,Isa`) oder aus der Suche. */
  initial?: Sel | null;
  /** Damit die Adresse mitläuft, wenn jemand weiterblättert. */
  onNavigate?: (sel: Sel | null) => void;
  /**
   * Der Weg vom philosophischen Werk auf die Zeitschiene der
   * Kirchengeschichte – zu dem Ereignis, das im selben Jahrzehnt liegt, oder
   * zu der Person, die im Zeitbaum steht. Ohne diesen Weg bliebe das dritte
   * Regal eine Liste neben der Geschichte statt in ihr.
   */
  onOpenChurch?: (nav: { tab: 'timeline' | 'fathers' | 'councils'; id?: string }) => void;
  /** Und der Weg zur Person im Zeitbaum – Augustinus, Anselm, Maimonides, Luther. */
  onOpenPerson?: (id: string) => void;
  onExit: () => void;
}

export default function Bookshelf({
  lang,
  places,
  onShowPlace,
  initial,
  onNavigate,
  onOpenChurch,
  onOpenPerson,
  onExit,
}: Props) {
  const t = useT();
  const [tab, setTab] = useState<Tab>(initial ? TAB_FOR[initial.kind] : 'books');
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

  /*
   * Die Bretter des dritten Regals. Gesucht wird über Titel, Verfasser und die
   * These – wer „Höhle" tippt, sucht Platon, und der Titel heißt anders.
   */
  const philBoards = useMemo(() => {
    const q = norm(query.trim());
    const passt = (w: PhilWork) =>
      !q ||
      norm(lang === 'de' ? w.de : w.en).includes(q) ||
      norm(lang === 'de' ? w.author.de : w.author.en).includes(q) ||
      norm(w.original).includes(q) ||
      norm(lang === 'de' ? w.thesis.de : w.thesis.en).includes(q);
    return PHIL_PERIODS.map((period) => ({
      period,
      works: PHIL_WORKS.filter((w) => w.period === period.id && passt(w)).sort((a, b) => a.year - b.year),
    })).filter((s2) => s2.works.length > 0);
  }, [query, lang]);

  /** Alle sichtbaren Werke – für den Zeitstrahl und die Pfeiltasten. */
  const philFlat = useMemo(() => philBoards.flatMap((s2) => s2.works), [philBoards]);

  /*
   * Wie viele Rücken jedes Regal gerade trägt. Die Suche geht über alle drei,
   * der Reiter zeigt aber nur eines: Wer auf dem Bibelregal „Platon" tippt,
   * stünde sonst vor „Keine Treffer", während nebenan sechs Werke liegen.
   * Deshalb zählt jedes Regal mit, und das leere nennt die anderen beim Namen.
   */
  const hits: Record<Tab, number> = useMemo(
    () => ({
      books: boards.reduce((n, b) => n + b.books.length, 0),
      law: lawBoards.reduce((n, b) => n + b.texts.length, 0),
      phil: philFlat.length,
      finds: FINDS.length,
    }),
    [boards, lawBoards, philFlat],
  );

  function pick(next: Sel | null) {
    setSel(next);
    // Ein Verweis führt oft auf ein anderes Regal – vom Buch auf den Talmud,
    // vom Werk auf das Buch. Der Reiter geht mit, sonst zeigte das Fenster
    // etwas, das im Regal daneben nirgends steht.
    if (next) setTab(TAB_FOR[next.kind]);
  }

  // Pfeiltasten begehen die Rücken in der Reihenfolge der gewählten Ordnung.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (sel?.kind !== 'book' && sel?.kind !== 'phil') return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!step) return;
      // Jedes Regal wird für sich begangen: Vom letzten Buch auf Platon zu
      // springen wäre kein Weiterblättern, sondern ein Themenwechsel.
      const ids = sel.kind === 'book' ? flat.map((b) => b.osis) : philFlat.map((w) => w.id);
      const i = ids.indexOf(sel.id);
      if (i < 0) return;
      e.preventDefault();
      setSel({ kind: sel.kind, id: ids[(i + step + ids.length) % ids.length] });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [flat, philFlat, sel, tab]);

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

  /*
   * Und dasselbe für den Zeitstrahl: Er ist 1400 Pixel breit und zeigt beim
   * Öffnen das vierte Jahrhundert vor Christus. Wer aus der Suche auf Hannah
   * Arendt kommt, sähe seine Marke sonst nicht – sie liegt zweitausend Jahre
   * weiter rechts, außerhalb des Streifens.
   */
  useEffect(() => {
    if (sel?.kind !== 'phil') return;
    shelfRef.current
      ?.querySelector<HTMLElement>(`[data-tick="${sel.id}"]`)
      ?.scrollIntoView({ block: 'nearest', inline: 'center' });
  }, [sel]);

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
          {/* Vier Knöpfe – auf dem Telefon brechen sie um, statt zu überlaufen. */}
          <div className="bm-seg flex-wrap">
            {(['books', 'law', 'phil', 'finds'] as Tab[]).map((id) => (
              <button
                key={id}
                className={tab === id ? 'is-on' : ''}
                aria-pressed={tab === id}
                onClick={() => setTab(id)}
              >
                {t(TAB_KEY[id] as 'shelfTabBooks')}
              </button>
            ))}
          </div>
          <button onClick={onExit} className="bm-btn bm-btn-gold">
            {t('exit')} ✕
          </button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        <div ref={shelfRef} className="scroll-soft min-h-0 flex-1 overflow-y-auto">
          {tab === 'finds' ? (
            <FindList sel={sel} onPick={pick} lang={lang} />
          ) : (
            <div className="py-4">
              <ShelfTools tab={tab} ordering={ordering} onOrdering={setOrdering} query={query} onQuery={setQuery} />
              {hits[tab] === 0 ? (
                <NoHits tab={tab} hits={hits} onTab={setTab} />
              ) : tab === 'books' ? (
                <BookBoards boards={boards} ordering={ordering} sel={sel} onPick={pick} lang={lang} />
              ) : tab === 'law' ? (
                <LawBoards boards={lawBoards} sel={sel} onPick={pick} lang={lang} />
              ) : (
                <PhilBoards boards={philBoards} philFlat={philFlat} sel={sel} onPick={pick} lang={lang} />
              )}
            </div>
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
                {sel.kind === 'phil' && (
                  <PhilDetail
                    id={sel.id}
                    lang={lang}
                    onPick={pick}
                    onOpenChurch={onOpenChurch}
                    onOpenPerson={onOpenPerson}
                  />
                )}
                {sel.kind === 'find' && (
                  <FindDetail id={sel.id} lang={lang} onPick={pick} places={places} onShowPlace={onShowPlace} />
                )}
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

/**
 * Die Leiste über jedem Regal: die Suche immer, die Ordnung nur bei den
 * Büchern. Das Gesetzesregal und das philosophische sind chronologisch
 * geordnet und kennen keinen Kanon – ein Umschalter mit zwei toten Knöpfen
 * wäre dort ein Versprechen, das die Daten nicht halten.
 */
function ShelfTools({
  tab,
  ordering,
  onOrdering,
  query,
  onQuery,
}: {
  tab: Tab;
  ordering: Ordering;
  onOrdering: (o: Ordering) => void;
  query: string;
  onQuery: (q: string) => void;
}) {
  const t = useT();
  const suche = tab === 'law' ? 'shelfSearchLaw' : tab === 'phil' ? 'shelfSearchPhil' : 'shelfSearch';
  return (
    <div className="mb-5 flex flex-wrap items-center gap-2 px-4 sm:px-5">
      {tab === 'books' && (
        <div className="bm-seg">
          {(['written', 'told', 'canon'] as Ordering[]).map((o) => (
            <button key={o} className={ordering === o ? 'is-on-gold' : ''} onClick={() => onOrdering(o)}>
              {t(ORDER_KEY[o] as 'shelfOrderWritten')}
            </button>
          ))}
        </div>
      )}
      <input
        value={query}
        onChange={(e) => onQuery(e.target.value)}
        placeholder={t(suche as 'shelfSearch')}
        aria-label={t(suche as 'shelfSearch')}
        className="bm-input w-full sm:w-auto sm:max-w-xs sm:flex-1"
      />
    </div>
  );
}

/**
 * Das leere Regal – und wo die Treffer stattdessen liegen.
 *
 * „Keine Treffer" allein wäre hier falsch: Die Suche läuft über alle drei
 * Regale, nur zeigt der Reiter eines. Die Knöpfe nennen die anderen mit
 * Anzahl und führen hin; die Funde bleiben außen vor, sie sind eine Liste
 * ohne Suchfeld.
 */
function NoHits({ tab, hits, onTab }: { tab: Tab; hits: Record<Tab, number>; onTab: (t: Tab) => void }) {
  const t = useT();
  const anderswo = (['books', 'law', 'phil'] as Tab[]).filter((id) => id !== tab && hits[id] > 0);
  return (
    <div className="px-4 py-8 text-center sm:px-5">
      <p className="text-sm text-white/50">{t('noResults')}</p>
      {anderswo.length > 0 && (
        <>
          <p className="bm-eyebrow bm-eyebrow-dim mt-5">{t('shelfFoundElsewhere')}</p>
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            {anderswo.map((id) => (
              <button key={id} onClick={() => onTab(id)} className="bm-btn bm-btn-ghost">
                {t(TAB_KEY[id] as 'shelfTabBooks')} · {hits[id]}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/** Das erste Regal: die 66 Bücher. */
function BookBoards({
  boards,
  ordering,
  sel,
  onPick,
  lang,
}: {
  boards: Board[];
  ordering: Ordering;
  sel: Sel | null;
  onPick: (s: Sel) => void;
  lang: Lang;
}) {
  const t = useT();
  return (
    <>
      {ordering === 'written' && (
        <p className="mb-5 max-w-prose px-4 text-[12.5px] leading-relaxed text-white/60 sm:px-5">{t('shelfDatingNote')}</p>
      )}
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
      <p className="max-w-prose px-4 pb-6 text-[12px] leading-relaxed text-white/45 sm:px-5">{t('shelfLegend')}</p>
    </>
  );
}

/** Das zweite Regal: was nach dem letzten kanonischen Buch weiterging. */
function LawBoards({
  boards,
  sel,
  onPick,
  lang,
}: {
  boards: { period: (typeof PERIODS)[number]; texts: LawText[] }[];
  sel: Sel | null;
  onPick: (s: Sel) => void;
  lang: Lang;
}) {
  const t = useT();
  return (
    <>
      <div className="mb-2 px-4 sm:px-5">
        <div className="bm-eyebrow mb-1">{t('shelfLawKicker')}</div>
        <h2 className="font-display text-2xl uppercase leading-tight text-white">{t('shelfLawTitle')}</h2>
      </div>
      <p className="mb-6 max-w-prose px-4 text-[12.5px] leading-relaxed text-white/60 sm:px-5">
        {lang === 'de' ? MIZWOT.de : MIZWOT.en}
      </p>
      {boards.map(({ period, texts }) => (
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
    </>
  );
}

/** Das dritte Regal: mit welchen Begriffen gelesen wurde. */
function PhilBoards({
  boards,
  philFlat,
  sel,
  onPick,
  lang,
}: {
  boards: { period: (typeof PHIL_PERIODS)[number]; works: PhilWork[] }[];
  philFlat: PhilWork[];
  sel: Sel | null;
  onPick: (s: Sel) => void;
  lang: Lang;
}) {
  const t = useT();
  return (
    <>
      <div className="mb-2 px-4 sm:px-5">
        <div className="bm-eyebrow mb-1">{t('shelfPhilKicker')}</div>
        <h2 className="font-display text-2xl uppercase leading-tight text-white">{t('shelfPhilTitle')}</h2>
      </div>
      <p className="mb-5 max-w-prose px-4 text-[12.5px] leading-relaxed text-white/60 sm:px-5">
        {lang === 'de' ? PHIL_INTRO.de : PHIL_INTRO.en}
      </p>

      <PhilTimeline works={philFlat} sel={sel} onPick={onPick} lang={lang} />

      {boards.map(({ period, works }) => (
        <Board
          key={period.id}
          title={lang === 'de' ? period.de : period.en}
          range={lang === 'de' ? period.range.de : period.range.en}
          note={lang === 'de' ? period.note.de : period.note.en}
          color={period.color}
        >
          {works.map((w) => (
            <Spine
              key={w.id}
              spineId={`phil:${w.id}`}
              label={lang === 'de' ? w.shortDe : w.shortEn}
              sub={lang === 'de' ? w.author.de : w.author.en}
              width={PHIL_BREIT}
              height={spineHeight(Math.abs(w.year))}
              color={period.color}
              on={sel?.kind === 'phil' && sel.id === w.id}
              onClick={() => onPick({ kind: 'phil', id: w.id })}
            />
          ))}
        </Board>
      ))}
      <p className="max-w-prose px-4 text-[12px] leading-relaxed text-white/45 sm:px-5">
        {lang === 'de' ? PHIL_BREITE.de : PHIL_BREITE.en}
      </p>
      <p className="max-w-prose px-4 pb-6 pt-2 text-[12px] leading-relaxed text-white/45 sm:px-5">
        {lang === 'de' ? PHIL_ANSTOSS.de : PHIL_ANSTOSS.en}{' '}
        <a
          href="https://www.reflab.ch/category/podcasts/mindmaps/"
          target="_blank"
          rel="noreferrer"
          className="text-mint hover:underline"
        >
          Mindmaps (RefLab)
          <ExternalIcon />
        </a>
      </p>
    </>
  );
}


/* --- Der Zeitstrahl ------------------------------------------------------- */

/**
 * Ein Punkt je Werk, waagerecht nach dem Jahr, senkrecht nach dem Gedränge.
 *
 * Die Achse ist linear – 550 Jahre zwischen Boethius und Anselm sind hier 300
 * Pixel Leere, und genau die sollen zu sehen sein. Zwei Werke aus demselben
 * Jahr rücken deshalb **nicht** zur Seite, sondern eine Spur tiefer; die
 * Rechnung dazu steht in `philLanes` und wird von `check:philosophie` geprüft.
 *
 * Die Punkte sind kleiner als 24 Pixel. Das ist zulässig, solange dieselbe
 * Auswahl auf den Brettern darunter mit vollen Rücken zu treffen ist – und nur
 * deshalb steht der Strahl hier: als zweiter Weg, nicht als einziger.
 */
function PhilTimeline({
  works,
  sel,
  onPick,
  lang,
}: {
  works: PhilWork[];
  sel: Sel | null;
  onPick: (s: Sel) => void;
  lang: Lang;
}) {
  const ticks = useMemo(() => philLanes(works), [works]);
  const spuren = ticks.reduce((max, tick) => Math.max(max, tick.lane + 1), 1);
  const hoehe = spuren * PHIL_SPUR_HOEHE;
  // Platz links und rechts für die Jahreszahlen, die mittig unter ihrer Marke
  // stehen; ohne ihn schnitte der scrollende Streifen „400 v. Chr." in der Mitte ab.
  const RAND = 40;

  return (
    <div className="mb-6">
      <div className="scroll-soft overflow-x-auto px-4 sm:px-5">
        <div className="relative" style={{ width: PHIL_STRAHL_BREIT + 2 * RAND, height: hoehe + 30 }}>
          {PHIL_MARKEN.map((m) => (
            <div
              key={`grid-${m.year}`}
              aria-hidden="true"
              className="absolute top-0 w-px bg-white/10"
              style={{ left: RAND + philMarkX(m.year), height: hoehe }}
            />
          ))}
          <div className="absolute h-px bg-white/20" style={{ left: RAND, top: hoehe, width: PHIL_STRAHL_BREIT }} />
          {ticks.map(({ id, x, lane }) => {
            const w = PHIL_BY_ID[id];
            const on = sel?.kind === 'phil' && sel.id === id;
            const label = `${w.year < 0 ? `${-w.year} v. Chr.` : w.year} · ${lang === 'de' ? w.author.de : w.author.en} · ${lang === 'de' ? w.de : w.en}`;
            return (
              <button
                key={id}
                data-tick={id}
                onClick={() => onPick({ kind: 'phil', id })}
                title={label}
                aria-label={label}
                aria-pressed={on}
                className="absolute grid place-items-center"
                style={{ left: RAND + x - 7, top: lane * PHIL_SPUR_HOEHE, width: 14, height: PHIL_SPUR_HOEHE }}
              >
                <span
                  className="block rounded-full transition-all"
                  style={{
                    width: on ? 12 : 8,
                    height: on ? 12 : 8,
                    background: on ? '#e0a449' : PHIL_PERIOD_COLOR[w.period],
                    opacity: on ? 1 : 0.8,
                  }}
                />
              </button>
            );
          })}
          {PHIL_MARKEN.map((m) => (
            <span
              key={`label-${m.year}`}
              className="absolute -translate-x-1/2 whitespace-nowrap text-[10px] text-white/45 tabular-nums"
              style={{ left: RAND + philMarkX(m.year), top: hoehe + 6 }}
            >
              {lang === 'de' ? m.de : m.en}
            </span>
          ))}
        </div>
      </div>
      <p className="mt-2 max-w-prose px-4 text-[12px] leading-relaxed text-white/45 sm:px-5">
        {lang === 'de' ? PHIL_ACHSE.de : PHIL_ACHSE.en}
      </p>
    </div>
  );
}

/** Die Farbe eines Bretts, nach ID – der Strahl braucht sie ohne die Liste. */
const PHIL_PERIOD_COLOR: Record<string, string> = Object.fromEntries(
  PHIL_PERIODS.map((p) => [p.id, p.color]),
);

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

/** Ein Verweis zwischen zwei Werken – dieselbe Form wie bei den Büchern. */
function PhilLinkRow({
  link,
  from,
  lang,
  onPick,
}: {
  link: PhilLink;
  from?: string;
  lang: Lang;
  onPick: (s: Sel) => void;
}) {
  const t = useT();
  const id = from ?? link.to;
  return (
    <li className="border-l-2 border-white/15 py-1.5 pl-2.5">
      <button
        onClick={() => onPick({ kind: 'phil', id })}
        className="text-left text-[13px] font-bold text-mint hover:underline"
      >
        {philName(id, lang)}
      </button>
      <span className="ml-1.5 text-[10px] uppercase tracking-wide text-white/40">
        {t((from ? PHIL_IN : PHIL_OUT)[link.kind] as 'shelfPhilLinkBuilds')}
      </span>
      <p className="mt-0.5 text-[12.5px] leading-relaxed text-white/70">{lang === 'de' ? link.de : link.en}</p>
    </li>
  );
}

function PhilDetail({
  id,
  lang,
  onPick,
  onOpenChurch,
  onOpenPerson,
}: {
  id: string;
  lang: Lang;
  onPick: (s: Sel) => void;
  onOpenChurch?: (nav: { tab: 'timeline' | 'fathers' | 'councils'; id?: string }) => void;
  onOpenPerson?: (id: string) => void;
}) {
  const t = useT();
  const w = PHIL_BY_ID[id];
  const period = PHIL_PERIODS.find((p) => p.id === w.period)!;
  const kind = PHIL_KIND[w.kind];
  // Wie bei den Büchern: Die Rückseite eines Verweises nur dann, wenn sie nicht
  // schon vorn steht – sonst stünde derselbe Zusammenhang zweimal untereinander.
  const zeigtAuf = new Set(w.links.map((l) => l.to));
  const incoming = (PHIL_LINKS_TO[id] ?? []).filter((x) => !zeigtAuf.has(x.from));

  return (
    <div>
      <WikiBand term={lang === 'de' ? w.wiki : w.wikiEn} alt={lang === 'de' ? w.de : w.en} lang={lang} />
      <div className="flex flex-wrap items-center gap-1.5">
        <span
          className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-deep"
          style={{ background: period.color }}
        >
          {lang === 'de' ? kind.de : kind.en}
        </span>
        <span className="bm-chip">{lang === 'de' ? w.when.de : w.when.en}</span>
        {w.disputed && <span className="bm-chip text-gold">{t('shelfDisputed')}</span>}
      </div>
      <h2 className="mt-2 font-display text-3xl uppercase leading-[0.95] text-white">
        {lang === 'de' ? w.de : w.en}
      </h2>
      <p className="mt-1 text-[13px] text-white/60">
        {lang === 'de' ? w.author.de : w.author.en} · {lang === 'de' ? w.lived.de : w.lived.en}
      </p>
      <p className="mt-0.5 text-[11.5px] italic text-white/45">
        {w.original}
        {w.translit ? ` · ${w.translit}` : ''}
      </p>

      {/* Der eine Satz. Er steht hervorgehoben, weil er das Werk zugleich
          verkürzt – wer nur ihn liest, soll wenigstens sehen, dass er das tut. */}
      <p className="mt-4 border-l-2 border-gold pl-3 text-[14px] font-bold leading-snug text-white">
        {lang === 'de' ? w.thesis.de : w.thesis.en}
      </p>

      <Section title={t('shelfPhilWho')}>
        <Prose>{lang === 'de' ? w.who.de : w.who.en}</Prose>
      </Section>
      <Section title={t('shelfPhilWhat')}>
        <Prose>{lang === 'de' ? w.what.de : w.what.en}</Prose>
      </Section>
      <Section title={t('shelfPhilBible')}>
        <Prose>{lang === 'de' ? w.bible.de : w.bible.en}</Prose>
      </Section>

      <Section title={t('shelfPhilBooks')}>
        <div className="flex flex-wrap gap-1.5">
          {w.books.map((osis) => (
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

      {w.links.length > 0 && (
        <Section title={t('shelfPhilLinksOut')}>
          <ul>
            {w.links.map((l) => (
              <PhilLinkRow key={`${l.to}-${l.kind}`} link={l} lang={lang} onPick={onPick} />
            ))}
          </ul>
        </Section>
      )}

      {incoming.length > 0 && (
        <Section title={t('shelfPhilLinksIn')}>
          <ul>
            {incoming.map(({ from, link }) => (
              <PhilLinkRow key={`${from}-${link.kind}`} link={link} from={from} lang={lang} onPick={onPick} />
            ))}
          </ul>
        </Section>
      )}

      <div className="mt-5 flex flex-wrap gap-1.5 border-t border-white/10 pt-4">
        {w.person && onOpenPerson && (
          <button onClick={() => onOpenPerson(w.person!)} className="bm-btn bm-btn-ghost">
            {t('shelfPhilInTree')} ›
          </button>
        )}
        {w.event && onOpenChurch && (
          <button onClick={() => onOpenChurch({ tab: 'timeline', id: w.event })} className="bm-btn bm-btn-ghost">
            {t('shelfPhilOnTimeline')} ›
          </button>
        )}
        <WikiOut term={lang === 'de' ? w.wiki : w.wikiEn} lang={lang} label={t('shelfWikipedia')} />
      </div>
      <p className="mt-3 text-[11.5px] text-white/45">
        {lang === 'de' ? period.de : period.en} · {lang === 'de' ? period.range.de : period.range.en} ·{' '}
        {formatSpan(w.from, w.to, lang)}
      </p>
    </div>
  );
}

function FindDetail({
  id,
  lang,
  onPick,
  places,
  onShowPlace,
}: {
  id: string;
  lang: Lang;
  onPick: (s: Sel) => void;
  places?: Place[];
  onShowPlace?: (p: Place) => void;
}) {
  const t = useT();
  const f: Find = FIND_BY_ID[id];
  const kind = FIND_KIND[f.kind];
  const carries = SHELF.filter((b) => b.oldest.find === id);
  /*
   * Vier der sechzehn Funde haben einen Ort, den die Hauptkarte kennt – die
   * Zuordnung steht in `findPlaces.ts`, weil die Ortskarte sie ebenfalls liest
   * und dafür nicht das ganze Regalbündel laden soll.
   */
  const link = FIND_PLACES.find((l) => l.find === id);
  const onMap = useMemo(
    () => (link && places ? findPlacesByNames(places, link.places) : []),
    [link, places],
  );

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

      {/*
        Ohne den Bezugssatz aus `findPlaces.ts`: Der ist für die Ortskarte
        geschrieben, wo der Zusammenhang fehlt. Hier stünde er zwei Absätze
        unter „Gefunden von" und sagte dasselbe noch einmal.
      */}
      {onMap.length > 0 && onShowPlace && (
        <Section title={t('shelfFindOnMap')}>
          <div className="flex flex-wrap gap-1.5">
            {onMap.map((p) => (
              <button key={p.id} onClick={() => onShowPlace(p)} className="bm-btn bm-btn-ghost">
                {placeName(p, lang)} ›
              </button>
            ))}
          </div>
        </Section>
      )}

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
