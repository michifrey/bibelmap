import type { Lang } from '../i18n';
import { useT } from '../i18n';
import { ADDRESS, EMAIL, HOST, OWNER, SITE } from '../data/imprint';
import { LICENSE_URL, REPO_URL } from '../data/attribution';
import LangToggle from './LangToggle';

interface Props {
  lang: Lang;
  onLang: (l: Lang) => void;
  onExit: () => void;
}

/** Wohin die Datenschutzerklärung des Hosters zeigt – die einzige Fremdadresse, die hier zwingend dazugehört. */
const GITHUB_PRIVACY =
  'https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement';

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
 * Eine Zeile der Koordinaten: links wofür, rechts was.
 *
 * `dt`/`dd` statt zweier `div`s, weil genau das hier steht – ein Begriff und
 * seine Angabe. Ein Screenreader liest dann „E-Mail: michael@freynet.ch“ und
 * nicht zwei Textfetzen hintereinander.
 */
function Zeile({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 border-t border-[#d8d2c4] py-4 sm:grid-cols-[180px_1fr] sm:gap-6 sm:py-5">
      <dt className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-signal">{label}</dt>
      <dd className="text-[13.5px] font-semibold leading-[1.6] text-ink">{children}</dd>
    </div>
  );
}

/** Ein Absatz der Haftung: Überschrift, Text, mehr nicht. */
function Karte({ title, body, children }: { title: string; body: string; children?: React.ReactNode }) {
  return (
    <article className="flex flex-col border-t-4 border-signal bg-paper px-6 py-6">
      <h3 className="font-display text-[17px] font-extrabold leading-tight tracking-tight text-ink">{title}</h3>
      <p className="mt-3 text-[12.5px] font-medium leading-[1.7] text-[#5c6b69]">{body}</p>
      {children && <div className="mt-auto pt-5">{children}</div>}
    </article>
  );
}

/**
 * Impressum.
 *
 * Die dritte Seite der Gruppe „Über diese Seite“: „Nachweise & Lizenzen“ sagt,
 * woraus Bibelmap besteht, der „Fahrplan“, was daraus noch werden soll – und
 * hier steht, wer das verantwortet und wo man ihn erreicht.
 *
 * **Warum der Datenschutz mit drin steht und keine eigene Seite bekommt.** Die
 * ehrliche Antwort passt in einen Bildschirm: kein Tracker, keine Cookies,
 * keine Konten – aber ein Serverprotokoll beim Hoster, fremde Kachelserver und
 * ein paar Einträge im lokalen Browserspeicher. Das auf eine zweite Seite zu
 * verteilen hiesse, aus drei Absätzen eine Behörde zu machen. Wer nach
 * „Impressum“ sucht, sucht ohnehin beides.
 *
 * **Was hier bewusst fehlt.** Die Postanschrift, solange `ADDRESS` in
 * `src/data/imprint.ts` auf `null` steht. Eine private, werbefreie Seite ohne
 * Geldfluss braucht sie weder nach schweizerischem noch nach deutschem Recht –
 * und eine erfundene wäre schlimmer als keine. Steht dort eine, erscheint sie
 * ohne weiteres Zutun.
 */
export default function Imprint({ lang, onLang, onExit }: Props) {
  const t = useT();

  return (
    <div className="fixed inset-0 z-[2000] overflow-y-auto bg-paper-2">
      {/* ======================================================== STATEMENT */}
      <div className="relative overflow-hidden bg-deep px-5 py-14 sm:px-10 sm:py-20 lg:px-14">
        {/* Ein Brief, der offen daliegt – das Motiv dieser Seite. Auf 390 px
            kleiner, sonst laufen seine Linien durch den Fliesstext. */}
        <svg className="pointer-events-none absolute -right-12 -top-10 h-[290px] w-[290px] opacity-70 sm:-right-20 sm:-top-16 sm:h-[500px] sm:w-[500px] sm:opacity-100" viewBox="0 0 500 500" aria-hidden="true">
          <g fill="none" stroke="#0d7f78" strokeWidth="2">
            <rect x="110" y="140" width="300" height="210" />
            <path d="M110 140l150 115 150-115" />
            <path d="M150 390h220M150 420h150" />
          </g>
          <circle cx="410" cy="140" r="14" fill="#e0a449" />
        </svg>

        <div className="relative">
          <div className="flex flex-col-reverse items-start gap-4 sm:flex-row sm:justify-between sm:gap-6">
            <span className="bm-eyebrow text-mint">{t('imprintSub')}</span>
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
              <span className="block">{t('imprintLead1')}</span>
              <span className="bm-outline block leading-[1.04] text-gold">{t('imprintLead2')}</span>
            </h1>
          </div>

          <div className="mt-9 max-w-[620px] sm:pl-14">
            <p className="text-sm font-medium leading-[1.8] text-white/80">{t('imprintBody1')}</p>
            <p className="mt-4 text-sm font-medium leading-[1.8] text-white/80">{t('imprintBody2')}</p>
            <p className="mt-4 text-sm font-bold leading-[1.8] text-white">{t('imprintBody3')}</p>
          </div>
        </div>
      </div>

      {/* ======================================================== THE NUMBERS */}
      <div className="grid grid-cols-2 bg-deepest lg:grid-cols-4">
        {[
          { value: '1', label: t('imprintStatPerson') },
          { value: '0', label: t('imprintStatAds'), gold: true },
          { value: '0', label: t('imprintStatAccounts') },
          { value: '2', label: t('imprintStatLangs') },
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

      {/* ======================================================== COORDINATES */}
      <div className="px-5 py-14 sm:px-10 sm:py-20 lg:px-14">
        <section>
          <div className="mb-6 flex items-baseline gap-6">
            <h2 className="bm-eyebrow text-signal">{t('imprintContactTitle')}</h2>
            <span className="h-px flex-1 bg-[#d8d2c4]" />
          </div>

          <div className="border-t-4 border-gold bg-paper px-6 py-2 sm:px-10">
            <dl>
              <Zeile label={t('imprintResponsible')}>{OWNER}</Zeile>
              <Zeile label={t('imprintMail')}>
                <a href={`mailto:${EMAIL}`} className="underline decoration-gold decoration-2 underline-offset-4 transition hover:text-signal">
                  {EMAIL}
                </a>
              </Zeile>
              {/* Nur wenn eine dasteht – siehe `ADDRESS` in src/data/imprint.ts. */}
              {ADDRESS && (
                <Zeile label={t('imprintPost')}>
                  {(lang === 'de' ? ADDRESS.de : ADDRESS.en).map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </Zeile>
              )}
              <Zeile label={t('imprintWeb')}>
                <a href={SITE.url} className="underline decoration-gold decoration-2 underline-offset-4 transition hover:text-signal">
                  {SITE.label}
                </a>
              </Zeile>
              <Zeile label={t('imprintSource')}>
                <a
                  href={REPO_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 underline decoration-gold decoration-2 underline-offset-4 transition hover:text-signal"
                >
                  github.com/michifrey/bibelmap
                  <ExternalIcon />
                </a>{' '}
                <a
                  href={LICENSE_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="ml-1 inline-block bg-signal px-2 py-1 align-middle text-[10px] font-extrabold uppercase tracking-[0.1em] text-white transition hover:bg-[#0f938b]"
                >
                  GPL 3.0
                </a>
              </Zeile>
              <Zeile label={t('imprintHost')}>
                <a
                  href={HOST.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 underline decoration-gold decoration-2 underline-offset-4 transition hover:text-signal"
                >
                  {HOST.name}
                  <ExternalIcon />
                </a>
              </Zeile>
            </dl>
          </div>

          <p className="mt-5 max-w-[720px] text-[12.5px] font-medium leading-[1.7] text-[#5c6b69]">
            {t('imprintContactNote')}
          </p>

          <div className="mt-5">
            <a
              href={`mailto:${EMAIL}`}
              className="inline-flex items-center gap-2.5 bg-deep px-5 py-3.5 text-[11px] font-extrabold uppercase tracking-[0.1em] text-white transition hover:bg-deepest"
            >
              {t('imprintWrite')}
              <Arrow className="text-gold" />
            </a>
          </div>
        </section>

        {/* ------------------------------------------------------------ ABOUT */}
        <section className="mt-16">
          <div className="mb-6 flex items-baseline gap-6">
            <h2 className="bm-eyebrow text-signal">{t('imprintAboutTitle')}</h2>
            <span className="h-px flex-1 bg-[#d8d2c4]" />
          </div>
          <div className="border-l-4 border-gold bg-paper px-6 py-7 sm:px-10 sm:py-9">
            <p className="max-w-[720px] text-[13.5px] font-medium leading-[1.85] text-ink">{t('imprintAbout1')}</p>
            <p className="mt-4 max-w-[720px] text-[12.5px] font-medium leading-[1.8] text-[#5c6b69]">{t('imprintAbout2')}</p>
            <p className="mt-4 max-w-[720px] text-[12.5px] font-medium leading-[1.8] text-[#5c6b69]">{t('imprintAbout3')}</p>
          </div>
        </section>

        {/* -------------------------------------------------------- LIABILITY */}
        <section className="mt-16">
          <div className="mb-6 flex items-baseline gap-6">
            <h2 className="bm-eyebrow text-signal">{t('imprintLiabilityTitle')}</h2>
            <span className="h-px flex-1 bg-[#d8d2c4]" />
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            <Karte title={t('imprintContent')} body={t('imprintContentBody')} />
            <Karte title={t('imprintLinks')} body={t('imprintLinksBody')} />
            <Karte title={t('imprintCopyright')} body={t('imprintCopyrightBody')}>
              <a
                href="#nachweise"
                className="inline-flex items-center gap-2.5 bg-gold px-4 py-2.5 text-[11px] font-extrabold uppercase tracking-[0.1em] text-deep transition hover:bg-[#eab662]"
              >
                {t('imprintToCredits')}
                <Arrow className="text-deep" />
              </a>
            </Karte>
          </div>
        </section>
      </div>

      {/* ========================================================== PRIVACY */}
      <div className="bg-abyss px-5 py-14 sm:px-10 sm:py-20 lg:px-14">
        <div className="mb-2 flex items-baseline gap-6">
          <h2 className="bm-eyebrow text-gold">{t('imprintPrivacyTitle')}</h2>
          <span className="h-px flex-1 bg-white/15" />
        </div>
        <p className="mb-8 max-w-[620px] text-[12.5px] font-medium leading-[1.75] text-white/60">
          {t('imprintPrivacyLead')}
        </p>

        <ul className="grid gap-3 lg:grid-cols-2">
          {[
            { title: t('imprintPrivacyNone'), body: t('imprintPrivacyNoneBody') },
            {
              title: t('imprintPrivacyHost'),
              body: t('imprintPrivacyHostBody'),
              link: { href: GITHUB_PRIVACY, label: t('imprintPrivacyHostLink') },
            },
            { title: t('imprintPrivacyTiles'), body: t('imprintPrivacyTilesBody') },
            { title: t('imprintPrivacyVideo'), body: t('imprintPrivacyVideoBody') },
            { title: t('imprintPrivacyLocal'), body: t('imprintPrivacyLocalBody') },
          ].map((p) => (
            <li key={p.title} className="border-l-2 border-gold bg-white/5 px-5 py-5">
              <h3 className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-gold">{p.title}</h3>
              <p className="mt-2.5 text-[12.5px] font-medium leading-[1.7] text-white/80">{p.body}</p>
              {p.link && (
                <a
                  href={p.link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-[11.5px] font-bold text-mint underline underline-offset-4 transition hover:text-white"
                >
                  {p.link.label}
                  <ExternalIcon />
                </a>
              )}
            </li>
          ))}
        </ul>

        <p className="mt-8 max-w-[760px] border-t border-white/15 pt-6 text-[12.5px] font-medium leading-[1.75] text-white/60">
          {t('imprintPrivacyRights')}
        </p>
      </div>

      {/* ============================================================ OUTRO */}
      <div className="bg-deepest px-5 py-12 sm:px-10 sm:py-16 lg:px-14">
        <p className="mx-auto max-w-[760px] text-center font-display text-lg font-extrabold leading-[1.5] tracking-tight text-white sm:text-[22px]">
          {t('imprintOutro')}
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
