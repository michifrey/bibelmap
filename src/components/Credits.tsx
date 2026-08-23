import type { Lang } from '../i18n';
import { useT } from '../i18n';
import {
  CREDITS,
  CREDITS_BY_GROUP,
  CREDIT_GROUPS,
  LICENSE_URL,
  REPO_URL,
  type CreditEntry,
} from '../data/attribution';
import { licenseInfo } from '../lib/imageCredit';
import LangToggle from './LangToggle';

interface Props {
  lang: Lang;
  onLang: (l: Lang) => void;
  onExit: () => void;
}

function Arrow({ className = '' }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={`h-3.5 w-3.5 flex-none ${className}`} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h13M13 6l6 6-6 6" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3 w-3 flex-none" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 4h6v6M20 4l-8.5 8.5" />
      <path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
    </svg>
  );
}

/**
 * Ein Nachweis: was es ist, was davon hier steckt, unter welcher Lizenz – und
 * die Zeile, die deshalb dastehen muss. Die Lizenz steht oben am Rand, weil
 * genau sie hier die Sortierordnung im Kopf des Lesers ist.
 */
function CreditCard({ entry, lang }: { entry: CreditEntry; lang: Lang }) {
  const t = useT();
  const pick = (s: { de: string; en: string }) => (lang === 'de' ? s.de : s.en);
  const license = licenseInfo(entry.license, lang);
  const free = Boolean(license);

  return (
    <article className={`flex flex-col border-t-4 bg-paper px-6 py-6 ${free ? 'border-signal' : 'border-gold'}`}>
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        {license ? (
          license.url ? (
            <a
              href={license.url}
              target="_blank"
              rel="noreferrer"
              title={license.hint}
              className="bg-signal px-2 py-1 text-[10px] font-extrabold uppercase tracking-[0.1em] text-white transition hover:bg-[#0f938b]"
            >
              {license.label}
            </a>
          ) : (
            <span title={license.hint} className="bg-signal px-2 py-1 text-[10px] font-extrabold uppercase tracking-[0.1em] text-white">
              {license.label}
            </span>
          )
        ) : entry.terms ? (
          <a
            href={entry.terms.url}
            target="_blank"
            rel="noreferrer"
            className="bg-gold px-2 py-1 text-[10px] font-extrabold uppercase tracking-[0.1em] text-deep transition hover:bg-[#eab662]"
          >
            {pick(entry.terms)}
          </a>
        ) : (
          <span className="bg-gold px-2 py-1 text-[10px] font-extrabold uppercase tracking-[0.1em] text-deep">
            {t('creditsPerItem')}
          </span>
        )}
        {license && <span className="text-[11px] font-medium text-ink-soft">{license.hint}</span>}
      </div>

      <div className="mt-3 font-display text-[17px] font-extrabold leading-tight tracking-tight text-ink">
        {entry.name}
      </div>
      {entry.by && (
        <div className="mt-1 text-[11px] font-bold uppercase tracking-[0.14em] text-ink-soft">{entry.by}</div>
      )}

      <p className="mt-3 text-[12.5px] font-medium leading-[1.7] text-[#5c6b69]">{pick(entry.use)}</p>

      {entry.attribution && (
        <div className="mt-3.5">
          <div className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-signal">
            {t('creditsLine')}
          </div>
          <p className="mt-1 border-l-2 border-[#d8d2c4] pl-2.5 text-[12px] font-semibold leading-[1.6] text-ink">
            {entry.attribution}
          </p>
        </div>
      )}

      {entry.note && (
        <p className="mt-3 text-[11.5px] font-medium leading-[1.65] text-ink-soft">{pick(entry.note)}</p>
      )}

      {/* Mitgelieferte Lizenztexte – die Datei selbst, nicht der Verweis darauf. */}
      {entry.files && (
        <div className="mt-2 flex flex-wrap gap-2">
          {entry.files.map((f) => (
            <a
              key={f.url}
              href={f.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 bg-paper-2 px-2.5 py-1.5 text-[11px] font-semibold text-ink transition hover:bg-[#e6e1d5]"
            >
              {pick(f)}
              <ExternalIcon />
            </a>
          ))}
        </div>
      )}

      <div className="mt-auto pt-5">
        <a
          href={entry.home}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 bg-deep px-4 py-2.5 text-[11px] font-extrabold uppercase tracking-[0.1em] text-white transition hover:bg-deepest"
        >
          {t('creditsVisit')}
          <ExternalIcon />
        </a>
      </div>
    </article>
  );
}

/**
 * Nachweise & Lizenzen. Bibelmap besteht aus fremder Arbeit; diese Seite sagt,
 * aus wessen, unter welcher Lizenz und was die jeweils verlangt. Sie ist das
 * Gegenstück zur Unterstützen-Seite: dort das Danken, hier das Recht.
 */
export default function Credits({ lang, onLang, onExit }: Props) {
  const t = useT();
  const free = CREDITS.filter((c) => c.license).length;
  const ownLicense = licenseInfo('GPL-3.0', lang);

  return (
    <div className="fixed inset-0 z-[2000] overflow-y-auto bg-paper-2">
      {/* ======================================================== STATEMENT */}
      <div className="relative overflow-hidden bg-deep px-5 py-14 sm:px-10 sm:py-20 lg:px-14">
        {/* Auf 390 px deckte die 520er Zeichnung die ganze Kopfzone ab – ihre
            Linien liefen quer durch den Fließtext. Dort kleiner. */}
        <svg className="pointer-events-none absolute -right-14 -top-10 h-[300px] w-[300px] opacity-70 sm:-right-24 sm:-top-20 sm:h-[520px] sm:w-[520px] sm:opacity-100" viewBox="0 0 520 520" aria-hidden="true">
          <g fill="none" stroke="#0d7f78" strokeWidth="2">
            <rect x="120" y="60" width="280" height="380" />
            <rect x="150" y="100" width="280" height="380" />
            <path d="M180 180h220M180 240h220M180 300h160" />
          </g>
          <circle cx="400" cy="440" r="14" fill="#e0a449" />
        </svg>

        <div className="relative">
          {/*
            Auf dem Telefon untereinander: nebeneinander blieb der Vorspann in
            einer 150 Pixel schmalen Spalte neben den Knöpfen stehen und brach
            in fünf Zeilen um – wie auf der Unterstützen-Seite.
          */}
          <div className="flex flex-col-reverse items-start gap-4 sm:flex-row sm:justify-between sm:gap-6">
            <span className="bm-eyebrow text-mint">{t('creditsSub')}</span>
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
              <span className="block">{t('creditsLead1')}</span>
              <span className="bm-outline block leading-[1.04] text-gold">{t('creditsLead2')}</span>
            </h1>
          </div>

          <div className="mt-9 max-w-[620px] sm:pl-14">
            <p className="text-sm font-medium leading-[1.8] text-white/80">{t('creditsBody1')}</p>
            <p className="mt-4 text-sm font-medium leading-[1.8] text-white/80">{t('creditsBody2')}</p>
            <p className="mt-4 text-sm font-bold leading-[1.8] text-white">{t('creditsBody3')}</p>
          </div>
        </div>
      </div>

      {/* ======================================================== THE NUMBERS */}
      <div className="grid grid-cols-2 bg-deepest lg:grid-cols-4">
        {[
          { value: String(CREDITS.length), label: t('creditsStatSources') },
          { value: String(free), label: t('creditsStatFree'), gold: true },
          { value: String(CREDIT_GROUPS.length), label: t('creditsStatGroups') },
          { value: '0', label: t('creditsStatOwn') },
        ].map((s, i) => (
          <div
            key={s.label}
            className={`px-7 py-9 sm:px-11 sm:py-12 ${s.gold ? 'bg-gold' : ''} ${i > 0 ? 'border-l border-white/15' : ''} ${
              i >= 2 ? 'border-t border-white/15 lg:border-t-0' : ''
            }`}
          >
            <div className={`bm-num text-4xl sm:text-[52px] ${s.gold ? 'text-deep' : 'text-white'}`}>{s.value}</div>
            <div className={`bm-eyebrow mt-2 ${s.gold ? 'text-deep/80' : 'text-mint'}`}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ======================================================== THE LIST */}
      <div className="px-5 py-14 sm:px-10 sm:py-20 lg:px-14">
        {CREDIT_GROUPS.map((group, gi) => {
          const entries = CREDITS_BY_GROUP[group.id];
          if (!entries.length) return null;
          return (
            <section key={group.id} className={gi > 0 ? 'mt-16' : ''}>
              <div className="mb-2 flex items-baseline gap-6">
                <span className="bm-eyebrow text-signal">{lang === 'de' ? group.de : group.en}</span>
                <span className="h-px flex-1 bg-[#d8d2c4]" />
              </div>
              <p className="mb-6 max-w-[560px] text-[12.5px] font-medium leading-[1.7] text-[#5c6b69]">
                {lang === 'de' ? group.subDe : group.subEn}
              </p>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {entries.map((e) => (
                  <CreditCard key={e.id} entry={e} lang={lang} />
                ))}
              </div>
            </section>
          );
        })}

        {/* ---- was diese Seite selbst beisteuert, und wie man Fehler meldet ---- */}
        <section className="mt-16 border-t-4 border-signal bg-paper px-6 py-8 sm:px-10">
          <span className="bm-eyebrow text-signal">{t('creditsOwnTitle')}</span>
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
            <a
              href={LICENSE_URL}
              target="_blank"
              rel="noreferrer"
              title={ownLicense?.hint}
              className="bg-signal px-2 py-1 text-[10px] font-extrabold uppercase tracking-[0.1em] text-white transition hover:bg-[#0f938b]"
            >
              {ownLicense?.label ?? 'GPL 3.0'}
            </a>
            {/* Warum ausgerechnet Copyleft: die Grenzdaten verlangen es. */}
            <span className="text-[11px] font-medium text-ink-soft">{t('creditsOwnLicense')}</span>
          </div>
          <p className="mt-3 max-w-[720px] text-[12.5px] font-medium leading-[1.7] text-[#5c6b69]">
            {t('creditsOwnBody')}
          </p>
          <p className="mt-3 max-w-[720px] text-[12.5px] font-medium leading-[1.7] text-[#5c6b69]">
            {t('creditsFix')}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href={REPO_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-deep px-4 py-3 text-[11px] font-extrabold uppercase tracking-[0.1em] text-white transition hover:bg-deepest"
            >
              {t('creditsRepo')}
              <ExternalIcon />
            </a>
            {/* Die Schwesterseite: dieselben Projekte, andere Frage. */}
            <a
              href="#unterstuetzen"
              className="inline-flex items-center gap-2.5 bg-gold px-4 py-3 text-[11px] font-extrabold uppercase tracking-[0.1em] text-deep transition hover:bg-[#eab662]"
            >
              {t('creditsToSupport')}
              <Arrow className="text-deep" />
            </a>
          </div>
        </section>
      </div>

      {/* ======================================================== OUTRO */}
      <div className="bg-deepest px-5 py-12 sm:px-10 sm:py-16 lg:px-14">
        <p className="mx-auto max-w-[760px] text-center font-display text-lg font-extrabold leading-[1.5] tracking-tight text-white sm:text-[22px]">
          {t('creditsOutro')}
        </p>
        <div className="mt-8 flex justify-center">
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
