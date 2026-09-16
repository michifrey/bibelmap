import { useEffect, useMemo, useRef, useState } from 'react';
import type { Place, PlaceImage } from '../types';
import type { Lang } from '../i18n';
import { useT } from '../i18n';
import { findPlacesByNames } from '../lib/places';
import { bibleGatewayUrl } from '../data/books';
import { licenseInfo } from '../lib/imageCredit';
import { readableOnDark } from '../lib/contrast';
import { useReducedMotion } from '../lib/motion';
import {
  FEASTS,
  MONTHS,
  RHYTHMS,
  YEAR_DAYS,
  feastStart,
  feastOccurrences,
  monthStart,
  MONTH_BY_ID,
  GREGORIAN_MONTHS,
  GREGORIAN_YEAR_DAYS,
  gregorianStart,
  gregorianOffsetDeg,
  type Feast,
  type FeastRef,
} from '../data/feasts';
import { arcPath, dayAngle, easeInOut, feastSpan, polar, shortestTurn } from '../lib/feastWheel';
import PlaceThumb from './PlaceThumb';

/*
 * Das Jahr als Rad.
 *
 * Von außen nach innen: die Namen der zwölf Monate, dann der Monatsring – ein
 * Kuchen, dessen Stücke so breit sind, wie die Monate lang sind –, dann das
 * Band der Feste an ihrem Tag, und in der Mitte das Bild.
 *
 * Gedreht wird das ganze Rad, nicht der Zeiger: Das ausgewählte Fest kommt
 * nach oben, sein Stück wird herausgezogen und größer. Wer weiterklickt,
 * dreht das Jahr weiter – über Adar hinaus zurück nach Nisan, denn ein Jahr
 * hat kein Ende, an dem man stehen bliebe.
 *
 * Eine Einschränkung steht ausdrücklich unter dem Rad: Die **Lage** eines
 * Festes im Kreis stimmt auf den Tag, seine **Breite** nicht. Ein Fest von
 * einem Tag misst 1,02° – ein Strich, den keine Maus trifft. Was schmaler
 * wäre als `MIN_GRAD`, wird um seine Mitte aufgeweitet.
 */

/**
 * Ganz außen der gregorianische Kalender – Jan, Feb, … Er beantwortet die
 * Frage, die jeder an diesen Kreis stellt: *Wann ist das bei uns?*
 */
const R_GREG_OUT = 188;
const R_GREG_IN = 166;
/**
 * Mitte der hebräischen Monatsbeschriftung. Sie muss außerhalb von dem liegen,
 * was das herausgezogene Stück erreicht (R_MONTH_OUT + GROW + PULL = 134) –
 * sonst verdeckt der Kuchen ausgerechnet den Monatsnamen, auf den er zeigt –
 * und innerhalb des äußeren Rings bleiben.
 */
const R_TEXT = 150;
const R_MONTH_OUT = 114;
const R_MONTH_IN = 90;
const R_FEAST_OUT = 86;
const R_FEAST_IN = 67;
/**
 * Das schmale Band der Monatsanfänge, innen vor dem Festband. Der Neumond
 * gehört nicht neben die Jahresfeste, sondern unter sie: Er kommt zwölfmal,
 * und im siebten Monat fiele er sonst genau auf das Posaunenfest – zwei
 * Stücke auf demselben Strich, von denen man nur eines sähe.
 */
const R_MOON_OUT = 65;
const R_MOON_IN = 59;
/** Radius der Bildscheibe – das Prozentmaß darunter hängt daran. */
const R_PHOTO = 53;
/** Wie weit das ausgewählte Stück aus dem Rad fährt und wie viel es wächst. */
const PULL = 10;
const GROW = 10;
const MIN_GRAD = 5;
/** Dasselbe für das herausgezogene Stück: es soll ein Kuchenstück sein, kein Strich. */
const MIN_GRAD_AKTIV = 15;

const VIEWBOX = 196;
/** Durchmesser der Bildscheibe als Anteil des Quadrats – für das <img> darüber. */
const PHOTO_PCT = `${((2 * R_PHOTO) / (2 * VIEWBOX)) * 100}%`;

const FAMILY_KEY: Record<Feast['family'], string> = {
  spring: 'feastFamilySpring',
  autumn: 'feastFamilyAutumn',
  later: 'feastFamilyLater',
  fast: 'feastFamilyFast',
  monthly: 'feastFamilyMonthly',
};

const REF_KEY: Record<FeastRef['kind'], string> = {
  command: 'feastRefsCommand',
  story: 'feastRefsStory',
  nt: 'feastRefsNt',
};

const REF_ORDER: FeastRef['kind'][] = ['command', 'story', 'nt'];

interface Props {
  places: Place[];
  lang: Lang;
  /** Fest aus der Adresse (`#feste=pessach`) oder aus der Suche. */
  initial?: string | null;
  /** Damit die Adresse mitläuft, wenn jemand weiterdreht. */
  onNavigate?: (id: string) => void;
  /** Einen Ort auf der Hauptkarte zeigen – schließt den Modus. */
  onShowPlace?: (p: Place) => void;
  onExit: () => void;
}

/** Winkel, unter dem ein Fest im Rad steht (Mitte seiner Tage). */
function mitte(f: Feast): number {
  return feastSpan(feastStart(f), f.days, YEAR_DAYS, MIN_GRAD).mid;
}

export default function FeastsMode({ places, lang, initial, onNavigate, onShowPlace, onExit }: Props) {
  const t = useT();
  const reduced = useReducedMotion();
  const [i, setI] = useState(() => {
    const n = FEASTS.findIndex((f) => f.id === initial);
    return n >= 0 ? n : 0;
  });
  const [img, setImg] = useState<PlaceImage | null>(null);
  const [rhythmsOpen, setRhythmsOpen] = useState(false);

  const feast = FEASTS[i];
  const month = MONTH_BY_ID[feast.month];
  const stops = useMemo(() => findPlacesByNames(places, feast.places), [places, feast]);
  /*
   * Fürs Bild der erste Ort, von dem überhaupt eines zu holen ist: Manche
   * Orte tragen ein Foto in den Daten, andere nur eine Wikidata-Nummer, aus
   * der `PlaceThumb` zur Laufzeit eines auflöst. Wo beides fehlt, bleibt das
   * Zeichen des Festes stehen – besser als eine leere Scheibe.
   */
  const photoPlace = useMemo(
    () => stops.find((p) => p.img || p.wikidata) ?? stops[0] ?? null,
    [stops],
  );

  /* --- die Drehung ------------------------------------------------------- */

  const [rot, setRot] = useState(() => -mitte(FEASTS[i]));
  const rotRef = useRef(rot);
  rotRef.current = rot;

  useEffect(() => {
    const von = rotRef.current;
    const nach = shortestTurn(von, -mitte(FEASTS[i]));
    if (reduced || Math.abs(nach - von) < 0.01) {
      setRot(nach);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const dauer = 700;
    const schritt = (jetzt: number) => {
      const p = Math.min(1, (jetzt - start) / dauer);
      setRot(von + (nach - von) * easeInOut(p));
      if (p < 1) raf = requestAnimationFrame(schritt);
    };
    raf = requestAnimationFrame(schritt);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, reduced]);

  useEffect(() => {
    setImg(null);
    onNavigate?.(FEASTS[i].id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i]);

  /** Im Kreis gibt es kein Ende: hinter Adar kommt wieder Nisan. */
  function go(d: number) {
    setI((v) => (v + d + FEASTS.length) % FEASTS.length);
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  /** Um wie viel der äußere Ring gegen den inneren steht – siehe feasts.ts. */
  const gregVersatz = gregorianOffsetDeg();
  /**
   * In welchem gregorianischen Monat das gewählte Fest liegt. Gerechnet über
   * denselben Versatz, mit dem der Ring gezeichnet wird: Eine zweite Rechnung
   * daneben liefe irgendwann auseinander, und niemand sähe es.
   */
  const gregMonatDesFestes = (() => {
    const winkel = ((mitte(feast) - gregVersatz) % 360 + 360) % 360;
    const tag = (winkel / 360) * GREGORIAN_YEAR_DAYS;
    for (let i = 11; i >= 0; i--) if (tag >= gregorianStart(i)) return i;
    return 0;
  })();

  const text = lang === 'de' ? feast.de : feast.en;
  const license = licenseInfo(img?.license ?? null, lang);
  const grouped = REF_ORDER.map((kind) => ({
    kind,
    refs: feast.refs.filter((r) => r.kind === kind),
  })).filter((g) => g.refs.length > 0);

  /**
   * Ein Beschriftungspunkt im Rad. Die innere Gegendrehung hält den Text
   * aufrecht, während sich alles darunter dreht – ohne sie stünden die
   * Monatsnamen die halbe Umdrehung lang auf dem Kopf.
   */
  function aufrecht(winkel: number, radius: number, kinder: React.ReactNode) {
    const p = polar(winkel, radius);
    return (
      <g transform={`translate(${p.x.toFixed(2)} ${p.y.toFixed(2)}) rotate(${(-rot).toFixed(2)})`}>
        {kinder}
      </g>
    );
  }

  return (
    <div className="fixed inset-0 z-[2000] flex flex-col bg-deepest">
      {/* bar */}
      <div className="flex flex-none items-center justify-between gap-3 border-b border-white/10 bg-abyss px-5 py-3.5 text-white">
        <div className="flex items-center gap-2">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 text-gold" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 3v4M21 12h-4M12 21v-4M3 12h4" />
          </svg>
          <div className="font-display text-xl uppercase leading-none">{t('feasts')}</div>
        </div>
        <button onClick={onExit} className="bm-btn bm-btn-gold">
          {t('exit')} ✕
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto md:flex-row md:overflow-hidden">
        {/* das Rad */}
        <div className="scroll-soft flex flex-none flex-col items-center gap-3 border-b border-white/10 px-4 py-5 md:min-h-0 md:flex-1 md:overflow-y-auto md:border-b-0 md:border-r">
          <div className="relative aspect-square w-full max-w-[min(70vh,520px)]">
            {/*
              Für eine Vorlesehilfe ist das Rad Beiwerk – wie jedes SVG dieser
              App. Nichts darin steht nur hier: Jedes Fest ist unter dem Rad ein
              richtiger Knopf mit Namen, der Hinweis darunter beschreibt den
              Kreis in Worten, und alles Übrige steht daneben im Text.
            */}
            <svg
              aria-hidden="true"
              viewBox={`${-VIEWBOX} ${-VIEWBOX} ${VIEWBOX * 2} ${VIEWBOX * 2}`}
              className="h-full w-full overflow-visible"
            >
              <g transform={`rotate(${rot.toFixed(2)})`}>
                {/*
                  Der gregorianische Ring, ganz außen. Er ist gegen den inneren
                  verdreht, weil die beiden Jahre nicht am selben Tag anfangen –
                  um wie viel, rechnet `gregorianOffsetDeg()` aus den Monats-
                  längen aus. Hervorgehoben ist der Monat, in dem das gewählte
                  Fest liegt: Das ist die Antwort auf „wann ist das bei uns".
                */}
                {GREGORIAN_MONTHS.map((g, n) => {
                  const a0 = dayAngle(gregorianStart(n), GREGORIAN_YEAR_DAYS) + gregVersatz;
                  const a1 = dayAngle(gregorianStart(n) + g.days, GREGORIAN_YEAR_DAYS) + gregVersatz;
                  const on = n === gregMonatDesFestes;
                  return (
                    <path
                      key={g.en}
                      d={arcPath(a0, a1, R_GREG_IN, R_GREG_OUT)}
                      fill={on ? '#e0a449' : '#ffffff'}
                      fillOpacity={on ? 0.22 : n % 2 === 0 ? 0.07 : 0.035}
                      stroke="#03302f"
                      strokeWidth="1"
                    />
                  );
                })}
                {GREGORIAN_MONTHS.map((g, n) => {
                  const a = dayAngle(gregorianStart(n) + g.days / 2, GREGORIAN_YEAR_DAYS) + gregVersatz;
                  const on = n === gregMonatDesFestes;
                  return (
                    <g key={`gl-${g.en}`}>
                      {aufrecht(a, (R_GREG_IN + R_GREG_OUT) / 2, (
                        <text
                          textAnchor="middle"
                          y="3.5"
                          fontSize="10"
                          fontWeight={on ? 700 : 500}
                          fill={on ? '#e0a449' : '#ffffff'}
                          fillOpacity={on ? 1 : 0.5}
                        >
                          {lang === 'de' ? g.shortDe : g.shortEn}
                        </text>
                      ))}
                    </g>
                  );
                })}

                {/* Monatsring: die Stücke sind so breit wie die Monate lang */}
                {MONTHS.map((m, n) => {
                  const a0 = dayAngle(monthStart(m.id), YEAR_DAYS);
                  const a1 = dayAngle(monthStart(m.id) + m.days, YEAR_DAYS);
                  const on = m.id === feast.month;
                  return (
                    <path
                      key={m.id}
                      d={arcPath(a0, a1, R_MONTH_IN, R_MONTH_OUT)}
                      fill={on ? feast.color : '#ffffff'}
                      fillOpacity={on ? 0.3 : n % 2 === 0 ? 0.09 : 0.05}
                      stroke="#03302f"
                      strokeWidth="1"
                    />
                  );
                })}

                {/*
                  Band der Monatsanfänge: zwölf Striche, einer je Monat. Sie
                  stehen auch dann da, wenn der Neumond nicht ausgewählt ist –
                  der Takt, an dem alles andere hängt, ist Teil des Bildes.
                */}
                {FEASTS.filter((f) => f.monthly).map((f) => {
                  const on = f.id === feast.id;
                  return feastOccurrences(f).map((tag) => {
                    const s = feastSpan(tag, f.days, YEAR_DAYS, MIN_GRAD);
                    return (
                      <path
                        key={`${f.id}-${tag}`}
                        d={arcPath(s.from, s.to, R_MOON_IN, R_MOON_OUT)}
                        fill={f.color}
                        fillOpacity={on ? 0.95 : 0.4}
                        className="cursor-pointer transition-opacity hover:opacity-100"
                        onClick={() => setI(FEASTS.indexOf(f))}
                      >
                        <title>{lang === 'de' ? f.de.name : f.en.name}</title>
                      </path>
                    );
                  });
                })}

                {/* Festband: jedes Fest an seinem Tag */}
                {FEASTS.map((f, n) => {
                  if (n === i || f.monthly) return null;
                  const s = feastSpan(feastStart(f), f.days, YEAR_DAYS, MIN_GRAD);
                  return (
                    <path
                      key={f.id}
                      d={arcPath(s.from, s.to, R_FEAST_IN, R_FEAST_OUT)}
                      fill={f.color}
                      fillOpacity="0.75"
                      className="cursor-pointer transition-opacity hover:opacity-100"
                      onClick={() => setI(n)}
                    >
                      <title>{lang === 'de' ? f.de.name : f.en.name}</title>
                    </path>
                  );
                })}

                {/* das herausgezogene Stück – zuletzt, also über allem */}
                {(() => {
                  const s = feastSpan(feastStart(feast), feast.days, YEAR_DAYS, MIN_GRAD_AKTIV);
                  const p = polar(s.mid, PULL);
                  return (
                    <g transform={`translate(${p.x.toFixed(2)} ${p.y.toFixed(2)})`}>
                      <path
                        d={arcPath(s.from, s.to, R_FEAST_IN - 6, R_MONTH_OUT + GROW)}
                        fill={feast.color}
                        stroke="#e0a449"
                        strokeWidth="1.5"
                      />
                      {aufrecht(s.mid, (R_FEAST_IN + R_MONTH_OUT) / 2, (
                        <svg aria-hidden="true" x="-9" y="-9" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                          <path d={feast.symbol} />
                        </svg>
                      ))}
                    </g>
                  );
                })()}

                {/* Monatsnamen ganz außen */}
                {MONTHS.map((m) => {
                  const a = dayAngle(monthStart(m.id) + m.days / 2, YEAR_DAYS);
                  const on = m.id === feast.month;
                  return (
                    <g key={`l-${m.id}`}>
                      {aufrecht(a, R_TEXT, (
                        <>
                          <text
                            textAnchor="middle"
                            y="-4"
                            className="font-display"
                            fontSize="11"
                            fill={on ? '#e0a449' : '#ffffff'}
                            fillOpacity={on ? 1 : 0.72}
                          >
                            {lang === 'de' ? m.de : m.en}
                          </text>
                          <text
                            textAnchor="middle"
                            y="8"
                            fontSize="10"
                            fill="#ffffff"
                            fillOpacity={on ? 0.75 : 0.4}
                          >
                            {m.hebrew}
                          </text>
                        </>
                      ))}
                    </g>
                  );
                })}
              </g>

              {/* Rahmen der Bildscheibe – dreht nicht mit */}
              <circle cx="0" cy="0" r={R_PHOTO + 3} fill="none" stroke={feast.color} strokeWidth="2.5" />
              <circle cx="0" cy="0" r={R_PHOTO + 3} fill="none" stroke="#ffffff" strokeOpacity="0.14" strokeWidth="1" />
            </svg>

            {/*
              Das Bild liegt als echtes <img> über dem SVG, nicht darin: So
              gilt die ganze Kette aus `PlaceThumb` – Foto aus den Daten,
              sonst Wikidata, sonst das Zeichen des Festes – samt Alternativtext
              und Nachweis, und nichts davon müsste hier zum zweiten Mal
              gebaut werden.
            */}
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full bg-abyss"
              style={{ width: PHOTO_PCT, height: PHOTO_PCT }}
            >
              {photoPlace ? (
                <PlaceThumb
                  key={feast.id}
                  place={photoPlace}
                  className="h-full w-full"
                  onResolved={setImg}
                  placeholder={
                    <div className="grid h-full w-full place-items-center bg-gradient-to-br from-surface to-abyss">
                      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-2/5 w-2/5 text-gold/80" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                        <path d={feast.symbol} />
                      </svg>
                    </div>
                  }
                />
              ) : null}
            </div>
          </div>

          {/* Nachweis zum Bild – dasselbe Muster wie auf der Ortskarte */}
          {img?.credit && (
            <div className="flex max-w-full items-center gap-1 text-[10px] text-white/45">
              <a href={img.creditUrl ?? '#'} target="_blank" rel="noreferrer" className="truncate hover:text-gold" title={img.credit}>
                © {img.credit}
              </a>
              {license &&
                (license.url ? (
                  <a href={license.url} target="_blank" rel="noreferrer" className="flex-none border-l border-white/20 pl-1 hover:text-gold" title={license.hint}>
                    {license.label}
                  </a>
                ) : (
                  <span className="flex-none border-l border-white/20 pl-1" title={license.hint}>{license.label}</span>
                ))}
            </div>
          )}

          {/* Die Feste zum Anspringen – und das, was die Tastatur bedient */}
          <nav aria-label={t('feastAll')} className="flex flex-wrap justify-center gap-1.5">
            {FEASTS.map((f, n) => (
              <button
                key={f.id}
                onClick={() => setI(n)}
                aria-current={n === i ? 'true' : undefined}
                className={`border-b-2 px-2 py-1 text-[11px] font-bold transition ${
                  n === i ? 'bg-white/14 text-white' : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                }`}
                style={{ borderColor: n === i ? f.color : 'transparent' }}
              >
                {lang === 'de' ? f.de.name : f.en.name}
              </button>
            ))}
          </nav>

          <p className="max-w-prose text-center text-[11px] leading-snug text-white/40">
            {t('feastCalendarNote')}
          </p>
        </div>

        {/* der Text */}
        <div className="scroll-soft flex w-full flex-col md:min-h-0 md:w-[42%] md:max-w-xl md:overflow-y-auto">
          <div className="px-5 py-5">
            <div className="mb-4 flex items-baseline gap-3">
              <span className="bm-num text-4xl" style={{ color: readableOnDark(feast.color) }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="bm-eyebrow bm-eyebrow-dim">
                {t('feast')} / {FEASTS.length}
              </span>
            </div>

            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 text-[11px] font-bold text-white" style={{ background: feast.color }}>
                {t(FAMILY_KEY[feast.family])}
              </span>
              {feast.pilgrimage && <span className="bm-chip">{t('feastPilgrimage')}</span>}
            </div>

            {/* `dir` steht am Inline-Element: am Block würde es die ganze Spalte
                nach rechts rücken, und daneben steht lateinische Schrift. */}
            <div className="font-display text-3xl leading-tight text-gold">
              <span dir="rtl" lang="he">{feast.hebrew}</span>
            </div>
            <div className="mt-1 text-sm text-white/55">{feast.translit}</div>
            <h2 className="mt-2 font-display text-4xl uppercase leading-[0.95] text-white">{text.name}</h2>
            {text.also && text.also !== feast.translit && (
              <div className="mt-1.5 text-[13px] text-white/50">{text.also}</div>
            )}

            <dl className="mt-5 space-y-3 border-l-2 border-white/10 pl-4">
              <div>
                <dt className="bm-eyebrow bm-eyebrow-dim">{t('feastWhen')}</dt>
                <dd className="mt-1 text-[14px] leading-relaxed text-white/85">{text.when}</dd>
              </div>
              {feast.monthly && (
                <div>
                  <dt className="bm-eyebrow bm-eyebrow-dim">{t('feastInWheel')}</dt>
                  <dd className="mt-1 text-[14px] leading-relaxed text-white/85">{t('feastMonthlyNote')}</dd>
                </div>
              )}
              <div>
                <dt className="bm-eyebrow bm-eyebrow-dim">{t('feastCounted')}</dt>
                <dd className="mt-1 text-[14px] leading-relaxed text-white/85">{text.count}</dd>
              </div>
              <div>
                <dt className="bm-eyebrow bm-eyebrow-dim">{t('feastMonth')}</dt>
                <dd className="mt-1 text-[14px] leading-relaxed text-white/85">
                  <span className="font-bold">{lang === 'de' ? month.de : month.en}</span>
                  <span lang="he" className="ml-2 text-white/60">{month.hebrew}</span>
                  <span className="ml-2 text-white/50">· {lang === 'de' ? month.gregorian.de : month.gregorian.en}</span>
                  {month.biblical && (
                    <span className="mt-1 block text-[12.5px] leading-snug text-white/50">
                      {lang === 'de' ? month.biblical.de : month.biblical.en}
                    </span>
                  )}
                </dd>
              </div>
            </dl>

            <h3 className="bm-eyebrow mt-6">{t('feastWhat')}</h3>
            <p className="mt-2 max-w-prose text-[15px] leading-relaxed text-white/80">{text.what}</p>

            <h3 className="bm-eyebrow mt-6">{t('feastToday')}</h3>
            <p className="mt-2 max-w-prose text-[15px] leading-relaxed text-white/80">{text.today}</p>

            {grouped.map((g) => (
              <div key={g.kind} className="mt-5">
                <div className="bm-eyebrow bm-eyebrow-dim mb-2">{t(REF_KEY[g.kind])}</div>
                <div className="flex flex-wrap gap-1.5">
                  {g.refs.map((r) => (
                    <a
                      key={`${r.osis}-${r.chapter}-${r.label.de}`}
                      href={bibleGatewayUrl(r.osis, r.chapter, lang === 'de' ? 'LUTH1545' : 'ESV')}
                      target="_blank"
                      rel="noreferrer"
                      className="bm-btn bm-btn-signal"
                    >
                      {lang === 'de' ? r.label.de : r.label.en}
                    </a>
                  ))}
                </div>
              </div>
            ))}

            {stops.length > 0 && (
              <div className="mt-5">
                <div className="bm-eyebrow mb-2">{t('placesOnMap')}</div>
                <div className="flex flex-wrap gap-1.5">
                  {stops.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => onShowPlace?.(p)}
                      className="bg-white/8 px-3 py-1.5 text-[11.5px] font-bold text-white transition hover:bg-white/16"
                    >
                      {p.name.replace(/ \d+$/, '')}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Was sich wiederholt und deshalb in keinem Jahreskreis steht */}
            <div className="mt-8 border-t border-white/10 pt-5">
              <button
                onClick={() => setRhythmsOpen((v) => !v)}
                aria-expanded={rhythmsOpen}
                className="flex w-full items-center justify-between gap-3 text-left"
              >
                <span className="bm-eyebrow">{t('feastRhythms')}</span>
                <span className="text-white/50">{rhythmsOpen ? '−' : '+'}</span>
              </button>
              {rhythmsOpen && (
                <div className="mt-3 space-y-4">
                  <p className="text-[12.5px] leading-snug text-white/50">{t('feastRhythmsHint')}</p>
                  {RHYTHMS.map((r) => {
                    const rt = lang === 'de' ? r.de : r.en;
                    return (
                      <div key={r.id} className="border-l-2 border-white/10 pl-4">
                        <div className="flex flex-wrap items-baseline gap-2">
                          <span className="font-display text-lg text-white">{rt.name}</span>
                          <span lang="he" className="text-gold/80">{r.hebrew}</span>
                          <span className="text-[12px] text-white/45">· {rt.every}</span>
                        </div>
                        <p className="mt-1.5 max-w-prose text-[13.5px] leading-relaxed text-white/70">{rt.text}</p>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {r.refs.map((ref) => (
                            <a
                              key={`${ref.osis}-${ref.chapter}`}
                              href={bibleGatewayUrl(ref.osis, ref.chapter, lang === 'de' ? 'LUTH1545' : 'ESV')}
                              target="_blank"
                              rel="noreferrer"
                              className="bm-btn bm-btn-ghost"
                            >
                              {lang === 'de' ? ref.label.de : ref.label.en}
                            </a>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* nav */}
          <div className="sticky bottom-0 mt-auto border-t border-white/10 bg-abyss">
            <div className="flex h-1.5 w-full bg-white/8">
              <div
                className="h-full transition-all"
                style={{ width: `${((i + 1) / FEASTS.length) * 100}%`, background: feast.color }}
              />
            </div>
            <div className="flex items-center justify-between gap-2 px-5 py-3">
              <button onClick={() => go(-1)} className="bm-btn bm-btn-ghost">‹ {t('prev')}</button>
              <span className="bm-num text-sm text-white/50">{i + 1} / {FEASTS.length}</span>
              <button onClick={() => go(1)} className="bm-btn bm-btn-ghost">{t('next')} ›</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
