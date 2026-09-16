import type { Lang } from '../i18n';
import { useT } from '../i18n';
import { ROAD, NOT_PLANNED, type RoadStop, type StopStatus } from '../data/roadmap';
import LangToggle from './LangToggle';

interface Props {
  lang: Lang;
  onLang: (l: Lang) => void;
  onExit: () => void;
}

/**
 * Der Fahrplan als Strasse.
 *
 * **Warum eine Zeichnung und keine Tabelle.** Die Roadmap stand bisher nur in
 * der PRD, als Tabelle mit neun Zeilen, von denen alle neun „erledigt" sagen.
 * Wer fragt „was kommt noch?", liest daraus nichts. Eine Strasse beantwortet
 * dieselbe Frage ohne einen einzigen Satz: Was hinter dem goldenen Punkt
 * liegt, ist gebaut, was davor liegt, nicht.
 *
 * **Wie die Kurven entstehen.** Jede Station bekommt ein eigenes Stück
 * Strasse, 240 Einheiten hoch, das abwechselnd nach links und nach rechts
 * ausschert. Beide Enden liegen bei x = 50, und die Kontrollpunkte stehen
 * genau darüber und darunter – deshalb stossen zwei Stücke ohne Knick
 * aneinander, egal wie viele es sind und in welcher Reihenfolge sie stehen.
 *
 * `preserveAspectRatio="none"` lässt das Stück auf die Höhe seiner Zeile
 * wachsen: Eine Karte mit langem Text zieht die Strasse mit, statt dass die
 * Zeichnung neben dem Text abreisst. Der Preis ist eine verzerrte Kurve –
 * unsichtbar, weil der Verlauf ohnehin erfunden ist. Die Punkte auf der
 * Strasse sind darum **kein** Teil des SVG, sondern gewöhnliche Elemente
 * darüber: ein Kreis, der in die Breite gezogen wird, sähe man sofort.
 *
 * **Was vorgelesen wird.** Die Strasse ist Beiwerk (`aria-hidden`). Die
 * Stationen sind eine nummerierte Liste, jede mit Überschrift und einem
 * Zustand *in Worten* – „erledigt", „geplant" –, nicht nur in Farbe.
 */

/** Wie eine Station aussieht: Farbe des Punkts, Farbe des Schildchens. */
const LOOK: Record<StopStatus, { dot: string; chip: string; rule: string }> = {
  done: { dot: 'bg-signal text-white', chip: 'bg-signal text-white', rule: 'border-signal' },
  here: { dot: 'bg-gold text-deep', chip: 'bg-gold text-deep', rule: 'border-gold' },
  planned: { dot: 'bg-deepest text-mint ring-2 ring-mint', chip: 'bg-paper-2 text-signal-deep', rule: 'border-mint' },
  goal: { dot: 'bg-white text-deep', chip: 'bg-white text-deep', rule: 'border-white' },
};

function Arrow({ className = '' }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={`h-3.5 w-3.5 flex-none ${className}`} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h13M13 6l6 6-6 6" />
    </svg>
  );
}

/**
 * Ein Stück Strasse. `bend` ist die Seite, zu der es ausschert; der Verlauf
 * ist derselbe, gespiegelt. `last` lässt die Fahrbahn auslaufen statt sie
 * unter der letzten Karte abzuschneiden.
 */
function RoadPiece({ bend, first, last }: { bend: 'left' | 'right'; first: boolean; last: boolean }) {
  const x = bend === 'left' ? 16 : 84;
  const d = `M50 ${first ? 30 : 0} C 50 80, ${x} 95, ${x} 120 C ${x} 145, 50 160, 50 ${last ? 210 : 240}`;
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 240"
      preserveAspectRatio="none"
      className="absolute inset-0 h-full w-full"
    >
      {/* Fahrbahn, dann die Mittellinie – zwei Striche auf demselben Weg. */}
      <path d={d} fill="none" stroke="#0a3f3c" strokeWidth="26" strokeLinecap="round" />
      <path d={d} fill="none" stroke="#0d7f78" strokeWidth="26" strokeOpacity="0.35" strokeLinecap="round" />
      <path className="bm-road-line" d={d} fill="none" stroke="#e0a449" strokeWidth="2.5" strokeDasharray="10 12" strokeLinecap="round" />
    </svg>
  );
}

function Station({ stop, index, lang }: { stop: RoadStop; index: number; lang: Lang }) {
  const t = useT();
  const pick = (s: { de: string; en: string }) => (lang === 'de' ? s.de : s.en);
  const look = LOOK[stop.status];
  const zustand = t(
    stop.status === 'done' ? 'roadDone' : stop.status === 'here' ? 'roadHere' : stop.status === 'goal' ? 'roadGoal' : 'roadPlanned',
  );

  return (
    <article className={`border-t-4 ${look.rule} bg-paper px-5 py-5 sm:px-6 sm:py-6`}>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
        <span className={`px-2 py-1 text-[10px] font-extrabold uppercase tracking-[0.1em] ${look.chip}`}>{zustand}</span>
        <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#5c6b69]">{pick(stop.tag)}</span>
      </div>

      <h2 className="mt-3 font-display text-[19px] font-extrabold leading-tight tracking-tight text-ink sm:text-[22px]">
        <span className="mr-2 text-[#8a9895]">{String(index + 1).padStart(2, '0')}</span>
        {pick(stop.title)}
      </h2>

      <p className="mt-2.5 text-[12.5px] font-medium leading-[1.7] text-[#5c6b69]">{pick(stop.body)}</p>

      {stop.figure && (
        <div className="mt-4 flex items-baseline gap-3 border-t border-[#d8d2c4] pt-3.5">
          <span className="bm-num text-2xl text-ink sm:text-[30px]">{stop.figure.value}</span>
          <span className="text-[11px] font-bold uppercase leading-tight tracking-[0.12em] text-[#5c6b69]">
            {pick(stop.figure.label)}
          </span>
        </div>
      )}
    </article>
  );
}

/**
 * Fahrplan. Die Schwesterseite zu „Nachweise & Lizenzen": dort steht, woraus
 * die Seite besteht, hier, was sie noch werden will.
 */
export default function Roadmap({ lang, onLang, onExit }: Props) {
  const t = useT();
  const pick = (s: { de: string; en: string }) => (lang === 'de' ? s.de : s.en);
  const done = ROAD.filter((s) => s.status === 'done').length;
  const ahead = ROAD.filter((s) => s.status === 'planned').length;

  return (
    <div className="fixed inset-0 z-[2000] overflow-y-auto bg-deepest">
      {/* ======================================================== STATEMENT */}
      <div className="relative overflow-hidden bg-deep px-5 py-14 sm:px-10 sm:py-20 lg:px-14">
        {/* Eine Strasse, die im Nichts verschwindet – dasselbe Motiv wie unten,
            nur als Beiwerk. Auf 390 px kleiner, sonst liegt sie im Fliesstext. */}
        <svg className="pointer-events-none absolute -right-10 -top-8 h-[280px] w-[280px] opacity-60 sm:-right-16 sm:-top-14 sm:h-[480px] sm:w-[480px] sm:opacity-100" viewBox="0 0 480 480" aria-hidden="true">
          <path d="M240 480 C 240 340, 120 320, 120 220 C 120 130, 260 120, 260 40" fill="none" stroke="#0d7f78" strokeWidth="40" strokeLinecap="round" />
          <path d="M240 480 C 240 340, 120 320, 120 220 C 120 130, 260 120, 260 40" fill="none" stroke="#e0a449" strokeWidth="3" strokeDasharray="14 18" />
          <circle cx="260" cy="40" r="12" fill="#e0a449" />
        </svg>

        <div className="relative">
          <div className="flex flex-col-reverse items-start gap-4 sm:flex-row sm:justify-between sm:gap-6">
            <span className="bm-eyebrow text-mint">{t('roadmapSub')}</span>
            <div className="flex flex-none items-center gap-2">
              <LangToggle lang={lang} onLang={onLang} variant="inline" />
              <button
                onClick={onExit}
                className="bg-white/10 px-4 py-2.5 text-[11px] font-extrabold uppercase tracking-[0.1em] text-white transition hover:bg-white/20"
              >
                {t('exit')} ✕
              </button>
            </div>
          </div>

          <div className="mt-7 flex gap-6 sm:gap-8">
            <span className="block w-1 flex-none self-stretch bg-gold" />
            <h1 className="font-display text-[10vw] font-black uppercase leading-[0.96] tracking-[-0.025em] text-white sm:text-[46px] lg:text-[60px]">
              <span className="block">{t('roadmapLead1')}</span>
              <span className="bm-outline block leading-[1.04] text-gold">{t('roadmapLead2')}</span>
            </h1>
          </div>

          <div className="mt-9 max-w-[620px] sm:pl-14">
            <p className="text-sm font-medium leading-[1.8] text-white/80">{t('roadmapBody1')}</p>
            <p className="mt-4 text-sm font-bold leading-[1.8] text-white">{t('roadmapBody2')}</p>
          </div>
        </div>
      </div>

      {/* ======================================================== THE NUMBERS */}
      <div className="grid grid-cols-2 bg-abyss lg:grid-cols-4">
        {[
          { value: String(done), label: t('roadmapStatDone') },
          { value: String(ahead), label: t('roadmapStatAhead'), gold: true },
          { value: 'v1.0', label: t('roadmapStatGoal') },
          { value: String(NOT_PLANNED.length), label: t('roadmapStatNever') },
        ].map((s, i) => (
          <div
            key={s.label}
            className={`px-7 py-9 sm:px-11 sm:py-12 ${s.gold ? 'bg-gold' : ''} ${i > 0 ? 'border-l border-white/15' : ''} ${
              i >= 2 ? 'border-t border-white/15 lg:border-t-0' : ''
            }`}
          >
            <div className={`bm-num text-4xl sm:text-[52px] ${s.gold ? 'text-deep' : 'text-white'}`}>{s.value}</div>
            <div className={`bm-eyebrow mt-2 ${s.gold ? 'text-deep' : 'text-mint'}`}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ======================================================== THE ROAD */}
      <div className="px-4 py-12 sm:px-10 sm:py-16 lg:px-14">
        <ol className="mx-auto max-w-5xl">
          {ROAD.map((stop, i) => {
            // Rechts, links, rechts … – und auf dem Telefon immer rechts der
            // Strasse, weil daneben keine zweite Spalte Platz hat.
            const side: 'left' | 'right' = i % 2 === 0 ? 'right' : 'left';
            const look = LOOK[stop.status];
            return (
              <li
                key={stop.id}
                className="relative grid min-h-[210px] grid-cols-[60px_1fr] items-start gap-x-3 sm:min-h-[250px] sm:grid-cols-[1fr_110px_1fr] sm:gap-x-6"
              >
                {/* die Fahrbahn – auf dem Telefon links, ab sm in der Mitte */}
                <div className="relative h-full sm:order-2">
                  <RoadPiece bend={i % 2 === 0 ? 'left' : 'right'} first={i === 0} last={i === ROAD.length - 1} />
                  <span
                    className={`absolute left-1/2 top-8 z-10 grid h-11 w-11 -translate-x-1/2 place-items-center text-[13px] font-extrabold shadow-[0_4px_14px_rgba(2,31,30,0.6)] ${look.dot} ${
                      stop.status === 'here' ? 'bm-road-here h-14 w-14 text-[15px]' : ''
                    }`}
                    aria-hidden="true"
                  >
                    {stop.status === 'done' ? (
                      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 13l4.5 4.5L19 7" />
                      </svg>
                    ) : stop.status === 'goal' ? (
                      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                        <path d="M6 3v18h2v-7h9l-2.5-3.5L17 7H8V3z" />
                      </svg>
                    ) : (
                      String(i + 1).padStart(2, '0')
                    )}
                  </span>
                </div>

                {/* die Karte – auf dem Telefon rechts, ab sm abwechselnd */}
                <div className={`pb-8 sm:pb-10 ${side === 'left' ? 'sm:order-1' : 'sm:order-3'}`}>
                  <Station stop={stop} index={i} lang={lang} />
                </div>

                {/* die leere Seite gegenüber – nur ab sm, damit das Raster steht */}
                <div className={`hidden sm:block ${side === 'left' ? 'sm:order-3' : 'sm:order-1'}`} aria-hidden="true" />
              </li>
            );
          })}
        </ol>
      </div>

      {/* =================================================== ROADS NOT TAKEN */}
      <div className="bg-abyss px-5 py-14 sm:px-10 sm:py-16 lg:px-14">
        <div className="mx-auto max-w-5xl">
          <div className="mb-2 flex items-baseline gap-6">
            <span className="bm-eyebrow text-gold">{t('roadmapNeverTitle')}</span>
            <span className="h-px flex-1 bg-white/15" />
          </div>
          <p className="mb-7 max-w-[560px] text-[12.5px] font-medium leading-[1.7] text-white/60">
            {t('roadmapNeverBody')}
          </p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {NOT_PLANNED.map((n) => (
              <li key={n.id} className="flex items-start gap-3 border-l-2 border-gold bg-white/5 px-4 py-3.5">
                <svg aria-hidden="true" viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 flex-none text-gold" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
                <span className="text-[12.5px] font-medium leading-[1.65] text-white/80">{pick(n)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ======================================================== OUTRO */}
      <div className="bg-deepest px-5 py-12 sm:px-10 sm:py-16 lg:px-14">
        <p className="mx-auto max-w-[760px] text-center font-display text-lg font-extrabold leading-[1.5] tracking-tight text-white sm:text-[22px]">
          {t('roadmapOutro')}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href="https://github.com/michifrey/bibelmap/issues"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2.5 bg-gold px-5 py-4 text-[12px] font-extrabold uppercase tracking-[0.08em] text-deep transition hover:bg-[#eab662]"
          >
            {t('roadmapSuggest')}
            <Arrow className="text-deep" />
          </a>
          <button
            onClick={onExit}
            className="inline-flex items-center gap-3.5 bg-signal px-6 py-4 text-[13px] font-extrabold uppercase tracking-[0.08em] text-white transition hover:bg-[#0f938b]"
          >
            {t('supportBack')}
            <Arrow className="text-gold" />
          </button>
        </div>
      </div>
    </div>
  );
}
