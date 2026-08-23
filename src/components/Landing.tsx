import type { Lang } from '../i18n';
import { useT } from '../i18n';
import { ERAS, eraWeight } from '../data/eras';
import LangToggle from './LangToggle';

export type LandingTarget = 'map' | 'tree' | 'present' | 'support';

interface Props {
  lang: Lang;
  onLang: (l: Lang) => void;
  /** How many places are on the map — the headline number of the whole site. */
  placeCount: number;
  /** Places per era, for the timeline band. */
  eraCounts: Record<string, number>;
  onEnter: (target: LandingTarget) => void;
}

const nf = (n: number, lang: Lang) => n.toLocaleString(lang === 'de' ? 'de-DE' : 'en-US');

/** The gold play triangle that sits inside every primary button. */
function PlayDot({ bg, fill }: { bg: string; fill: string }) {
  return (
    <span className="grid h-7 w-7 flex-none place-items-center rounded-full" style={{ background: bg }}>
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3 w-3" fill={fill}>
        <path d="M8 5.5v13l11-6.5Z" />
      </svg>
    </span>
  );
}

function Arrow({ className = '' }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={`h-3.5 w-3.5 flex-none ${className}`} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h13M13 6l6 6-6 6" />
    </svg>
  );
}

/** The five-triangle motif that marks the end of a block. */
function Chevrons({ color, dir = 'left' }: { color: string; dir?: 'left' | 'right' }) {
  return (
    <svg viewBox="0 0 150 26" className="h-5 w-[150px] flex-none" aria-hidden="true">
      <g fill={color}>
        {[0, 1, 2, 3, 4].map((i) => {
          const [a, b] = dir === 'left' ? [26 + i * 30, 4 + i * 30] : [4 + i * 30, 26 + i * 30];
          return <path key={i} d={`M${a} 3 ${b} 13 ${a} 23Z`} fillOpacity={0.35 + i * 0.16} />;
        })}
      </g>
    </svg>
  );
}

/** The drawn, duotone aerial map behind the hero. Not a photo: the whole page
 *  is drawn, so the hero is too. */
function HeroArt() {
  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 1440 880"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="bmSea" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0e8f86" />
          <stop offset="55%" stopColor="#0a6b66" />
          <stop offset="100%" stopColor="#053e3c" />
        </linearGradient>
        <linearGradient id="bmLand" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#0a5450" />
          <stop offset="100%" stopColor="#12736a" />
        </linearGradient>
        <linearGradient id="bmScrim" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#03302f" stopOpacity=".94" />
          <stop offset="46%" stopColor="#04413e" stopOpacity=".72" />
          <stop offset="100%" stopColor="#04413e" stopOpacity="0" />
        </linearGradient>
        <pattern id="bmStipple" width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="1.5" fill="#0d7f78" fillOpacity=".55" />
          <circle cx="10" cy="9" r="1.2" fill="#14a093" fillOpacity=".35" />
        </pattern>
      </defs>

      <rect width="1440" height="880" fill="url(#bmSea)" />
      <g fill="none" stroke="#2ec2b0" strokeOpacity=".18" strokeWidth="2">
        <path d="M-40 250C140 210 260 300 430 268" />
        <path d="M-40 300C140 260 260 350 430 318" />
        <path d="M-40 560C160 516 300 610 470 574" />
        <path d="M-40 612C160 568 300 662 470 626" />
        <path d="M-60 760C120 720 250 800 420 768" />
      </g>

      <path d="M540 880C600 700 720 560 900 450C1060 352 1240 300 1440 276V0H1440V880Z" fill="url(#bmLand)" />
      <path d="M540 880C600 700 720 560 900 450C1060 352 1240 300 1440 276" fill="none" stroke="#a9e4dc" strokeOpacity=".55" strokeWidth="10" />
      <path d="M556 880C616 706 734 570 912 462C1070 366 1246 314 1440 290" fill="none" stroke="#d9f4ef" strokeOpacity=".35" strokeWidth="3" />
      <path d="M508 880C572 692 696 546 878 434C1042 334 1230 282 1440 258" fill="none" stroke="#5fd3c4" strokeOpacity=".3" strokeWidth="2" strokeDasharray="10 14" />
      <path d="M600 880C660 716 774 584 944 480C1096 386 1264 336 1440 312V0H1440V880Z" fill="url(#bmStipple)" />

      <g fill="none" stroke="#8ee0d4" strokeOpacity=".16" strokeWidth="1.5">
        <path d="M760 880C820 730 930 610 1090 512C1210 438 1330 400 1440 380" />
        <path d="M880 880C940 748 1040 640 1180 556C1280 496 1370 466 1440 452" />
        <path d="M1020 880C1070 772 1150 686 1264 618C1340 574 1400 552 1440 542" />
      </g>

      <path d="M1440 340C1330 372 1250 424 1190 490C1128 558 1090 640 1046 720C1016 776 990 830 972 880" fill="none" stroke="#0a5450" strokeOpacity=".55" strokeWidth="9" strokeLinecap="round" />
      <path d="M1440 340C1330 372 1250 424 1190 490C1128 558 1090 640 1046 720C1016 776 990 830 972 880" fill="none" stroke="#3fd0bd" strokeOpacity=".35" strokeWidth="3" strokeLinecap="round" />

      <g stroke="#e9fbf8" strokeWidth="2.5" strokeOpacity=".9">
        <circle cx="1188" cy="392" r="8" fill="#e0a449" />
        <circle cx="1316" cy="474" r="7" fill="#b0436b" />
        <circle cx="1054" cy="548" r="9" fill="#a89321" />
        <circle cx="1244" cy="628" r="7" fill="#5a5ca8" />
        <circle cx="928" cy="648" r="7" fill="#b8742e" />
        <circle cx="1130" cy="742" r="8" fill="#9a4ba0" />
        <circle cx="1372" cy="330" r="7" fill="#3a6ea8" />
      </g>

      <rect width="1440" height="880" fill="url(#bmScrim)" />
    </svg>
  );
}

/** Miniature of the map view — card 01. */
function CardArtMap() {
  return (
    <svg viewBox="0 0 246 178" className="block w-full" aria-hidden="true">
      <rect width="246" height="178" fill="#0a6b66" />
      <path d="M0 178C40 120 96 84 168 58C200 46 224 40 246 36V178Z" fill="#12736a" />
      <path d="M0 178C40 120 96 84 168 58C200 46 224 40 246 36" fill="none" stroke="#a9e4dc" strokeOpacity=".5" strokeWidth="4" />
      <g fill="none" stroke="#8ee0d4" strokeOpacity=".22" strokeWidth="1.4">
        <path d="M40 178C76 132 126 104 190 84C216 76 232 72 246 70" />
        <path d="M92 178C124 144 164 122 214 108C230 104 240 102 246 100" />
      </g>
      <g fill="none" stroke="#2ec2b0" strokeOpacity=".2" strokeWidth="2">
        <path d="M-10 60C30 44 62 74 104 56" />
        <path d="M-10 96C30 80 62 110 104 92" />
      </g>
      <g stroke="#e9fbf8" strokeWidth="2.2">
        <circle cx="176" cy="72" r="7" fill="#a89321" />
        <circle cx="122" cy="126" r="6" fill="#b8742e" />
        <circle cx="212" cy="112" r="6" fill="#2f8f7f" />
      </g>
    </svg>
  );
}

/** Miniature of the presentation mode — card 02. */
function CardArtRead() {
  return (
    <svg viewBox="0 0 246 178" className="block w-full" aria-hidden="true">
      <rect width="246" height="178" fill="#0a5450" />
      <rect width="120" height="178" fill="#073f3c" />
      <g stroke="#7fe3d5" strokeOpacity=".5" strokeWidth="3" strokeLinecap="round">
        <path d="M20 44h74M20 62h84M20 80h60M20 98h80M20 116h48" />
      </g>
      <g stroke="#e0a449" strokeWidth="3" strokeLinecap="round">
        <path d="M20 62h30M20 98h26" />
      </g>
      <path d="M120 178C146 138 180 110 246 88V178Z" fill="#12736a" />
      <path d="M120 178C146 138 180 110 246 88" fill="none" stroke="#a9e4dc" strokeOpacity=".5" strokeWidth="4" />
      <path d="M150 150 190 106" fill="none" stroke="#e0a449" strokeWidth="2.4" strokeDasharray="3 7" strokeLinecap="round" />
      <g stroke="#e9fbf8" strokeWidth="2.2">
        <circle cx="150" cy="150" r="6" fill="#2f8f7f" />
        <circle cx="194" cy="102" r="7" fill="#e0a449" />
      </g>
    </svg>
  );
}

/** Miniature of the genealogy tree — card 03. */
function CardArtTree() {
  return (
    <svg viewBox="0 0 246 178" className="block w-full" aria-hidden="true">
      <rect width="246" height="178" fill="#073f3c" />
      <g fill="none" stroke="#7fe3d5" strokeOpacity=".45" strokeWidth="2">
        <path d="M40 89C58 89 58 41 76 41" />
        <path d="M40 89h36" />
        <path d="M40 89C58 89 58 137 76 137" />
        <path d="M138 41C156 41 156 21 174 21" />
        <path d="M138 41C156 41 156 61 174 61" />
        <path d="M138 89C156 89 156 109 174 109" />
        <path d="M138 137C156 137 156 153 174 153" />
      </g>
      <g fill="#0a5450" stroke="#7fe3d5" strokeOpacity=".7" strokeWidth="1.6">
        <rect x="14" y="79" width="26" height="20" />
        <rect x="76" y="31" width="62" height="20" />
        <rect x="76" y="79" width="62" height="20" />
        <rect x="76" y="127" width="62" height="20" />
        <rect x="174" y="11" width="58" height="20" />
        <rect x="174" y="51" width="58" height="20" />
        <rect x="174" y="99" width="58" height="20" />
        <rect x="174" y="143" width="58" height="20" />
      </g>
      <g fill="#e0a449">
        <rect x="76" y="31" width="3" height="20" />
        <rect x="174" y="11" width="3" height="20" />
        <rect x="174" y="51" width="3" height="20" />
      </g>
    </svg>
  );
}

export default function Landing({ lang, onLang, placeCount, eraCounts, onEnter }: Props) {
  const t = useT();

  const cards = [
    { kicker: t('lCard1Kicker'), title: t('lCard1Title'), body: t('lCard1Body'), cta: t('lCard1Cta'), art: <CardArtMap />, target: 'map' as const },
    { kicker: t('lCard2Kicker'), title: t('lCard2Title'), body: t('lCard2Body'), cta: t('lCard2Cta'), art: <CardArtRead />, target: 'present' as const },
    { kicker: t('lCard3Kicker'), title: t('lCard3Title'), body: t('lCard3Body'), cta: t('lCard3Cta'), art: <CardArtTree />, target: 'tree' as const },
  ];

  const stats = [
    { value: nf(placeCount, lang), label: t('lStatPlaces') },
    { value: String(ERAS.length), label: t('lStatEras') },
    { value: '66', label: t('lStatBooks') },
    { value: '72', label: t('lStatEmpires'), gold: true },
  ];

  const sources = [
    { name: 'OpenBible.info', body: t('lSource1Body'), href: 'https://www.openbible.info/geo/' },
    { name: 'open-bibles', body: t('lSource2Body'), href: 'https://github.com/seven1m/open-bibles' },
    { name: 'historical-basemaps', body: t('lSource3Body'), href: 'https://github.com/aourednik/historical-basemaps' },
    { name: 'OpenStreetMap & CARTO', body: t('lSource4Body'), href: 'https://www.openstreetmap.org/copyright' },
  ];

  const nav: { label: string; target: LandingTarget }[] = [
    { label: t('map'), target: 'map' },
    { label: t('presentation'), target: 'present' },
    { label: t('genealogy'), target: 'tree' },
  ];

  return (
    <div className="h-full overflow-y-auto bg-paper-2">
      {/* ============================================================ HERO */}
      <div className="relative overflow-hidden bg-deep">
        <HeroArt />

        <header className="relative flex items-center gap-4 px-5 py-5 sm:gap-9 sm:px-10 lg:px-14">
          <button onClick={() => onEnter('map')} className="flex items-center gap-3" aria-label={t('lOpenMap')}>
            <svg viewBox="0 0 40 40" className="h-8 w-8 flex-none sm:h-10 sm:w-10" aria-hidden="true">
              <path d="M20 3 34 11v18L20 37 6 29V11Z" fill="none" stroke="#e0a449" strokeWidth="2.4" strokeLinejoin="round" />
              <path d="M20 27s6-6.6 6-10.4A6 6 0 0 0 14 16.6C14 20.4 20 27 20 27Z" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinejoin="round" />
              <circle cx="20" cy="16.4" r="2.3" fill="#e0a449" />
            </svg>
            <span className="font-display text-xl font-black tracking-tight text-white sm:text-2xl">BIBELMAP</span>
          </button>

          <nav className="hidden items-center gap-7 lg:flex">
            <span className="border-b-[3px] border-gold pb-1 text-sm font-bold text-white">{t('lStart')}</span>
            {nav.map((n) => (
              <button
                key={n.target}
                onClick={() => onEnter(n.target)}
                className="text-sm font-medium text-white/80 transition hover:text-white"
              >
                {n.label}
              </button>
            ))}
          </nav>

          <div className="flex-1" />

          <div className="flex items-center gap-3">
            <LangToggle lang={lang} onLang={onLang} variant="inline" />
            <button
              onClick={() => onEnter('map')}
              className="hidden items-center gap-2.5 bg-gold px-5 py-3 text-[13px] font-extrabold uppercase tracking-[0.04em] text-deep transition hover:bg-[#eab662] sm:flex"
            >
              {t('lOpenMap')}
              <Arrow />
            </button>
          </div>
        </header>

        {/* the era rail: vertical alongside the headline, a strip on mobile */}
        <div className="relative flex items-center gap-2 px-5 pt-6 sm:px-10 lg:hidden">
          {ERAS.map((e) => (
            <i
              key={e.id}
              className={`block rounded-full ${e.id === 'divided' ? 'h-3 w-3 ring-[3px] ring-[#2f8f7f]/35' : 'h-[7px] w-[7px]'}`}
              style={{ background: e.color }}
            />
          ))}
          <span className="bm-eyebrow ml-2 text-white/55">
            {ERAS.length} {t('lErasRail')}
          </span>
        </div>

        <div className="relative flex px-5 pb-16 pt-10 sm:px-10 sm:pb-24 sm:pt-16 lg:px-14 lg:pb-32">
          <div className="hidden flex-col items-center gap-3.5 pr-14 pt-6 lg:flex">
            <span className="block h-10 w-px bg-white/30" />
            {ERAS.map((e) => (
              <i
                key={e.id}
                className={`block rounded-full ${e.id === 'divided' ? 'h-3.5 w-3.5 ring-4 ring-[#2f8f7f]/30' : 'h-2.5 w-2.5'}`}
                style={{ background: e.color }}
              />
            ))}
            <span className="block h-10 w-px bg-white/30" />
            <span className="bm-eyebrow text-white/55 [writing-mode:vertical-rl]">
              {ERAS.length} {t('lErasRail')}
            </span>
          </div>

          <div className="min-w-0 max-w-[760px]">
            <div className="flex gap-6 sm:gap-8">
              <span className="block w-1 flex-none self-stretch bg-gold" />
              <div>
                <div className="bm-eyebrow mb-4 text-mint sm:mb-5">
                  {nf(placeCount, lang)} {t('places')} · {ERAS.length} {t('lStatEras')} · 66 {t('graphBooks')}
                </div>
                <h1 className="font-display text-[13vw] font-black uppercase leading-[0.94] tracking-[-0.025em] text-white sm:text-[64px] lg:text-[82px]">
                  <span className="block">{t('lHeadline1')}</span>
                  <span className="block">{t('lHeadline2')}</span>
                  <span className="bm-outline block leading-[1.02]">{t('lHeadline3')}</span>
                </h1>
              </div>
            </div>

            <div className="mt-9 sm:pl-14">
              <p className="max-w-[486px] text-sm font-medium leading-[1.75] text-white/80 sm:text-[15px]">
                {t('lLead')}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-6">
                <button
                  onClick={() => onEnter('map')}
                  className="flex items-center gap-4 bg-signal px-6 py-4 text-[15px] font-extrabold uppercase tracking-[0.08em] text-white transition hover:bg-[#0f938b]"
                >
                  {t('lOpenMap')}
                  <PlayDot bg="#ffffff" fill="#0d7f78" />
                </button>
                <div className="hidden sm:block">
                  <Chevrons color="#e0a449" />
                </div>
              </div>
              <div className="mt-5 text-xs font-medium text-white/55">{t('lNoAccount')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ CARDS */}
      <div className="bg-paper-2 px-5 py-14 sm:px-10 sm:py-20 lg:px-14">
        <div className="mb-6 flex items-baseline gap-4">
          <span className="bm-eyebrow text-signal-deep">{t('lWaysIn')}</span>
          <span className="h-px flex-1 bg-[#d8d2c4]" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c) => (
            <button
              key={c.kicker}
              onClick={() => onEnter(c.target)}
              className="group flex flex-col bg-paper text-left shadow-[0_30px_60px_-30px_rgba(3,48,47,.6)] transition hover:-translate-y-1"
            >
              {c.art}
              <div className="flex flex-1 flex-col p-6">
                <div className="bm-eyebrow text-signal-deep" style={{ fontSize: 10 }}>
                  {c.kicker}
                </div>
                <div className="mt-2.5 font-display text-lg font-extrabold leading-tight tracking-tight text-ink">
                  {c.title}
                </div>
                <p className="mt-3 flex-1 text-[12.5px] font-medium leading-[1.65] text-[#5c6b69]">{c.body}</p>
                <span className="mt-5 inline-flex items-center gap-2.5 self-start bg-deep px-4 py-3 text-[11px] font-extrabold uppercase tracking-[0.1em] text-white transition group-hover:bg-deepest">
                  {c.cta}
                  <Arrow className="text-gold" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ============================================================ NUMBERS */}
      <div className="grid grid-cols-2 bg-deep lg:grid-cols-4">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`px-7 py-10 sm:px-11 sm:py-14 ${s.gold ? 'bg-gold' : ''} ${
              i > 0 ? 'border-l border-white/15' : ''
            } ${i >= 2 ? 'border-t border-white/15 lg:border-t-0' : ''}`}
          >
            <div className={`bm-num text-4xl sm:text-[54px] ${s.gold ? 'text-deep' : 'text-white'}`}>{s.value}</div>
            <div className={`bm-eyebrow mt-2 ${s.gold ? 'text-deep' : 'text-mint'}`}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ============================================================ TIMELINE */}
      <div className="bg-paper-2 px-5 py-16 sm:px-10 sm:py-24 lg:px-14">
        <div className="mb-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:gap-16">
          <div>
            <div className="bm-eyebrow mb-4 text-signal">{t('timeline')}</div>
            <div className="font-display text-[11vw] font-black uppercase leading-[0.96] tracking-[-0.025em] text-ink sm:text-[48px] lg:text-[62px]">
              {t('lTimelineTitle1')}
            </div>
            <div className="bm-outline font-display text-[11vw] font-black uppercase leading-[1.04] text-signal sm:text-[48px] lg:text-[62px]">
              {t('lTimelineTitle2')}
            </div>
          </div>
          <p className="max-w-[380px] text-sm font-medium leading-[1.75] text-[#5c6b69] lg:mb-2">{t('lTimelineBody')}</p>
        </div>

        <button
          onClick={() => onEnter('map')}
          className="flex w-full items-end gap-2"
          style={{ height: 168 }}
          aria-label={t('lOpenMap')}
        >
          {ERAS.map((e) => {
            const big = e.id === 'divided';
            return (
              <span
                key={e.id}
                className="flex min-w-0 flex-col justify-end overflow-hidden px-2 py-4 text-left sm:px-4"
                style={{ flex: `${eraWeight(e.id)} 1 0`, height: big ? 168 : 118, background: e.color }}
              >
                <span className={`bm-num text-white ${big ? 'text-2xl sm:text-[34px]' : 'text-lg sm:text-[26px]'}`}>
                  {eraCounts[e.id] ?? 0}
                </span>
                <span className="mt-1.5 truncate text-[11px] font-bold text-white/90 sm:text-xs">
                  {lang === 'de' ? e.de : e.en}
                </span>
                {big && <span className="mt-0.5 truncate text-[11px] font-medium text-white/75">{e.range}</span>}
              </span>
            );
          })}
        </button>
        <div className="mt-3.5 flex justify-between text-[11px] font-bold tracking-[0.16em] text-ink-soft">
          <span>2000 V. CHR.</span>
          <span>100 N. CHR.</span>
        </div>
      </div>

      {/* ============================================================ PRESENTATION */}
      <div className="flex flex-col bg-paper lg:flex-row lg:items-stretch">
        <div className="px-5 py-16 sm:px-10 sm:py-24 lg:flex-[0_0_620px] lg:px-14">
          <div className="bm-eyebrow mb-4 text-signal">{t('presentation')}</div>
          <div className="font-display text-[11vw] font-black uppercase leading-[0.96] tracking-[-0.025em] text-ink sm:text-[46px] lg:text-[58px]">
            <span className="block">{t('lPresentTitle1')}</span>
            <span className="block">{t('lPresentTitle2')}</span>
            <span className="bm-outline block leading-[1.04] text-signal">{t('lPresentTitle3')}</span>
          </div>

          <figure className="mt-9 border-l-4 border-gold bg-paper-2 px-7 py-7">
            <p className="m-0 font-scripture text-lg leading-[1.7] text-ink sm:text-[21px]">{t('lPresentQuote')}</p>
            <figcaption className="mt-4 text-[11px] font-bold uppercase tracking-[0.16em] text-ink-soft">
              {t('lPresentQuoteRef')}
            </figcaption>
          </figure>

          <p className="mt-8 max-w-[440px] text-sm font-medium leading-[1.8] text-[#5c6b69]">{t('lPresentBody')}</p>

          <button
            onClick={() => onEnter('present')}
            className="mt-9 inline-flex items-center gap-3.5 bg-signal px-6 py-4 text-sm font-extrabold uppercase tracking-[0.08em] text-white transition hover:bg-[#0f938b]"
          >
            {t('lPresentCta')}
            <Arrow className="text-gold" />
          </button>
        </div>

        <div className="relative min-h-[340px] flex-1 bg-deep sm:min-h-[480px]">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 820 640" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <rect width="820" height="640" fill="#0a5450" />
            <path d="M0 640C60 480 180 350 380 250C520 180 680 140 820 118V640Z" fill="#12736a" />
            <path d="M0 640C60 480 180 350 380 250C520 180 680 140 820 118" fill="none" stroke="#a9e4dc" strokeOpacity=".45" strokeWidth="6" />
            <g fill="none" stroke="#8ee0d4" strokeOpacity=".16" strokeWidth="1.5">
              <path d="M120 640C180 500 300 390 480 306C600 250 720 216 820 200" />
              <path d="M260 640C314 526 420 434 570 366C670 320 760 296 820 284" />
            </g>
            <g fill="none" stroke="#2ec2b0" strokeOpacity=".16" strokeWidth="2">
              <path d="M-10 220C60 190 120 260 200 226" />
              <path d="M-10 300C60 270 120 340 200 306" />
            </g>
            <path d="M820 190C720 226 640 288 580 366C520 444 480 520 452 610" fill="none" stroke="#083f3c" strokeOpacity=".6" strokeWidth="10" strokeLinecap="round" />
            <path d="M820 190C720 226 640 288 580 366C520 444 480 520 452 610" fill="none" stroke="#4fd8c4" strokeOpacity=".45" strokeWidth="4" strokeLinecap="round" />
            <path d="M660 240 545 400" fill="none" stroke="#e0a449" strokeWidth="3" strokeDasharray="3 10" strokeLinecap="round" />
            <g stroke="#e9fbf8" strokeWidth="3">
              <circle cx="672" cy="232" r="12" fill="#2f8f7f" />
              <circle cx="538" cy="410" r="16" fill="#e0a449" />
            </g>
            <circle cx="538" cy="410" r="26" fill="none" stroke="#e0a449" strokeOpacity=".45" strokeWidth="4" />
            <g fontFamily="Montserrat, sans-serif" fontWeight="700" fill="#ffffff">
              <text x="694" y="237" fontSize="15">Damaskus</text>
              <text x="538" y="462" fontSize="17" textAnchor="middle">Jordan</text>
            </g>
          </svg>
          <div className="absolute bottom-8 left-8 flex items-center gap-3.5 bg-deep/90 px-5 py-4">
            <span className="bm-eyebrow text-mint">2. KÖNIGE · KAPITEL 5</span>
            <span className="h-4 w-px bg-white/25" />
            <span className="bm-eyebrow text-white">7 {t('places').toUpperCase()}</span>
          </div>
        </div>
      </div>

      {/* ============================================================ SOURCES */}
      <div className="bg-paper-2 px-5 py-16 sm:px-10 sm:py-20 lg:px-14">
        <div className="mb-9 flex items-baseline gap-8">
          <span className="bm-eyebrow text-signal-deep">{t('lSourcesTitle')}</span>
          <span className="h-px flex-1 bg-[#d8d2c4]" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {sources.map((s) => (
            <a
              key={s.name}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className="border-t-4 border-signal bg-paper px-6 py-7 transition hover:shadow-[0_20px_40px_-24px_rgba(3,48,47,.5)]"
            >
              <div className="font-display text-[17px] font-extrabold tracking-tight text-ink">{s.name}</div>
              <p className="mt-2.5 text-[12.5px] font-medium leading-[1.7] text-[#5c6b69]">{s.body}</p>
            </a>
          ))}
        </div>
        <p className="mt-7 max-w-[760px] text-xs font-medium leading-[1.7] text-ink-soft">{t('lSourcesNote')}</p>

        <div className="mt-8 flex flex-col gap-5 border-t-4 border-gold bg-paper px-7 py-7 sm:flex-row sm:items-center sm:gap-8">
          <div className="min-w-0 flex-1">
            <div className="bm-eyebrow text-signal-deep">{t('lSupportKicker')}</div>
            <p className="mt-2.5 text-[13px] font-medium leading-[1.7] text-[#5c6b69]">{t('supportBody3')}</p>
          </div>
          <button
            onClick={() => onEnter('support')}
            className="inline-flex flex-none items-center gap-3 self-start bg-gold px-6 py-4 text-[12px] font-extrabold uppercase tracking-[0.1em] text-deep transition hover:bg-[#eab662] sm:self-center"
          >
            {t('lSupportCta')}
            <Arrow className="text-deep" />
          </button>
        </div>
      </div>

      {/* ============================================================ FINAL CTA */}
      <div className="relative overflow-hidden bg-deep px-5 py-16 sm:px-10 sm:py-24 lg:px-14">
        <svg className="pointer-events-none absolute -right-16 -top-10 h-[520px] w-[520px]" viewBox="0 0 520 520" aria-hidden="true">
          <g fill="none" stroke="#0d7f78" strokeWidth="2">
            <circle cx="260" cy="260" r="80" />
            <circle cx="260" cy="260" r="140" />
            <circle cx="260" cy="260" r="200" />
            <circle cx="260" cy="260" r="258" />
          </g>
          <circle cx="260" cy="260" r="14" fill="#e0a449" />
        </svg>
        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:gap-16">
          <div className="font-display text-[13vw] font-black uppercase leading-[0.96] tracking-[-0.03em] text-white sm:text-[52px] lg:text-[68px]">
            <span className="block">{t('lFinal1')}</span>
            <span className="bm-outline block leading-[1.04] text-gold">{t('lFinal2')}</span>
          </div>
          <button
            onClick={() => onEnter('map')}
            className="flex items-center gap-4 self-start bg-gold px-7 py-5 lg:self-end text-[15px] font-extrabold uppercase tracking-[0.08em] text-deep transition hover:bg-[#eab662] lg:mb-3.5"
          >
            {t('lFinalCta')}
            <PlayDot bg="#06403c" fill="#e0a449" />
          </button>
          <div className="hidden flex-1 justify-end lg:flex">
            <Chevrons color="#0d7f78" dir="right" />
          </div>
        </div>
      </div>

      {/* ============================================================ FOOTER */}
      <div className="flex flex-col gap-5 bg-deepest px-5 py-8 sm:px-10 lg:flex-row lg:items-center lg:gap-8 lg:px-14">
        <div className="flex items-center gap-3">
          <svg viewBox="0 0 40 40" className="h-7 w-7" aria-hidden="true">
            <path d="M20 3 34 11v18L20 37 6 29V11Z" fill="none" stroke="#e0a449" strokeWidth="2.4" strokeLinejoin="round" />
            <path d="M20 27s6-6.6 6-10.4A6 6 0 0 0 14 16.6C14 20.4 20 27 20 27Z" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinejoin="round" />
          </svg>
          <span className="font-display text-[17px] font-black tracking-tight text-white">BIBELMAP</span>
        </div>
        <span className="hidden h-5 w-px bg-white/15 lg:block" />
        <div className="flex flex-wrap items-center gap-5">
          {nav.map((n) => (
            <button
              key={n.target}
              onClick={() => onEnter(n.target)}
              className="text-[12.5px] font-medium text-white/60 transition hover:text-white"
            >
              {n.label}
            </button>
          ))}
          <button
            onClick={() => onEnter('support')}
            className="text-[12.5px] font-medium text-white/60 transition hover:text-white"
          >
            {t('lSupportCta')}
          </button>
          <a
            href="https://github.com/michifrey/bibelmap"
            target="_blank"
            rel="noreferrer"
            className="text-[12.5px] font-medium text-white/60 transition hover:text-white"
          >
            {t('lFooterSource')}
          </a>
          <a
            href="https://github.com/michifrey/bibelmap/blob/main/LICENSE"
            target="_blank"
            rel="noreferrer"
            className="text-[12.5px] font-medium text-white/60 transition hover:text-white"
          >
            GPL-3.0
          </a>
        </div>
        <div className="flex-1" />
        <span className="text-[11.5px] font-medium text-white/40">
          Orte © OpenBible.info, CC-BY 4.0 · Grenzen © historical-basemaps, GPL-3.0 · Kacheln ©
          OpenStreetMap, © CARTO
        </span>
      </div>
    </div>
  );
}
