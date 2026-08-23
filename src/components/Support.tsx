import type { Lang } from '../i18n';
import { useT } from '../i18n';
import { SUPPORT_PROJECTS, SUPPORT_LINKED, type SupportKind, type SupportProject } from '../data/support';
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

function ProjectCard({ project, lang }: { project: SupportProject; lang: Lang }) {
  const t = useT();
  const pick = (s: { de: string; en: string }) => (lang === 'de' ? s.de : s.en);
  // The one card that asks for nothing is marked by its border, not by a
  // greyed-out button: there is nothing disabled about it.
  const gives = Boolean(project.donate);

  return (
    <article
      className={`flex flex-col border-t-4 bg-paper px-6 py-7 ${gives ? 'border-gold' : 'border-signal'}`}
    >
      <div className="font-display text-[17px] font-extrabold leading-tight tracking-tight text-ink">
        {project.name}
      </div>
      {project.by && (
        <div className="mt-1 text-[11px] font-bold uppercase tracking-[0.14em] text-ink-soft">{project.by}</div>
      )}

      <p className="mt-3.5 text-[12.5px] font-medium leading-[1.7] text-[#5c6b69]">{pick(project.role)}</p>
      <p className="mt-2.5 text-[11.5px] font-medium leading-[1.65] text-ink-soft">{pick(project.credit)}</p>

      <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
        {project.donate && (
          <a
            href={project.donate}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2.5 bg-gold px-4 py-3 text-[11px] font-extrabold uppercase tracking-[0.1em] text-deep transition hover:bg-[#eab662]"
          >
            {project.donateLabel ? pick(project.donateLabel) : t('supportDonate')}
            <Arrow className="text-deep" />
          </a>
        )}
        <a
          href={project.home}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 bg-deep px-4 py-3 text-[11px] font-extrabold uppercase tracking-[0.1em] text-white transition hover:bg-deepest"
        >
          {t('supportVisit')}
          <ExternalIcon />
        </a>
      </div>

      {project.donateNote && (
        <p className="mt-3 text-[11px] font-medium leading-[1.6] text-ink-soft">{pick(project.donateNote)}</p>
      )}
    </article>
  );
}

/**
 * Bibelmap earns nothing and collects nothing for itself. What it does have is a
 * precise list of whose work it stands on — so this page sends people there.
 */
export default function Support({ lang, onLang, onExit }: Props) {
  const t = useT();
  const pick = (s: { de: string; en: string }) => (lang === 'de' ? s.de : s.en);

  const groups: { kind: SupportKind; title: string; sub: string }[] = [
    { kind: 'content', title: t('supportGroupContent'), sub: t('supportGroupContentSub') },
    { kind: 'data', title: t('supportGroupData'), sub: t('supportGroupDataSub') },
  ];

  const giving = SUPPORT_PROJECTS.filter((p) => p.donate).length;

  return (
    <div className="fixed inset-0 z-[2000] overflow-y-auto bg-paper-2">
      {/* ======================================================== STATEMENT */}
      <div className="relative overflow-hidden bg-deep px-5 py-14 sm:px-10 sm:py-20 lg:px-14">
        <svg className="pointer-events-none absolute -right-20 -top-16 h-[520px] w-[520px]" viewBox="0 0 520 520" aria-hidden="true">
          <g fill="none" stroke="#0d7f78" strokeWidth="2">
            <circle cx="260" cy="260" r="80" />
            <circle cx="260" cy="260" r="140" />
            <circle cx="260" cy="260" r="200" />
            <circle cx="260" cy="260" r="258" />
          </g>
          <circle cx="260" cy="260" r="14" fill="#e0a449" />
        </svg>

        <div className="relative">
          <div className="flex items-start justify-between gap-6">
            <span className="bm-eyebrow text-mint">{t('supportSub')}</span>
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
              <span className="block">{t('supportLead1')}</span>
              <span className="bm-outline block leading-[1.04] text-gold">{t('supportLead2')}</span>
            </h1>
          </div>

          <div className="mt-9 max-w-[620px] sm:pl-14">
            <p className="text-sm font-medium leading-[1.8] text-white/80">{t('supportBody1')}</p>
            <p className="mt-4 text-sm font-medium leading-[1.8] text-white/80">{t('supportBody2')}</p>
            <p className="mt-4 text-sm font-bold leading-[1.8] text-white">{t('supportBody3')}</p>
          </div>
        </div>
      </div>

      {/* ======================================================== THE NUMBERS */}
      <div className="grid grid-cols-2 bg-deepest lg:grid-cols-4">
        {[
          { value: '0', label: t('supportStatAds') },
          { value: '0', label: t('supportStatMoney'), gold: true },
          { value: String(SUPPORT_PROJECTS.length), label: t('supportStatProjects') },
          { value: String(giving), label: t('supportStatGiving') },
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

      {/* ======================================================== PROJECTS */}
      <div className="px-5 py-14 sm:px-10 sm:py-20 lg:px-14">
        {groups.map((group, gi) => {
          const projects = SUPPORT_PROJECTS.filter((p) => p.kind === group.kind);
          if (!projects.length) return null;
          return (
            <section key={group.kind} className={gi > 0 ? 'mt-16' : ''}>
              <div className="mb-2 flex items-baseline gap-6">
                <span className="bm-eyebrow text-signal-deep">{group.title}</span>
                <span className="h-px flex-1 bg-[#d8d2c4]" />
              </div>
              <p className="mb-6 max-w-[560px] text-[12.5px] font-medium leading-[1.7] text-[#5c6b69]">{group.sub}</p>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {projects.map((p) => (
                  <ProjectCard key={p.id} project={p} lang={lang} />
                ))}
              </div>
            </section>
          );
        })}

        {/* linked-out services: named, but nobody is asking for money there */}
        <section className="mt-16">
          <div className="mb-2 flex items-baseline gap-6">
            <span className="bm-eyebrow text-signal-deep">{t('supportAlsoUsed')}</span>
            <span className="h-px flex-1 bg-[#d8d2c4]" />
          </div>
          <p className="mb-5 max-w-[560px] text-[12.5px] font-medium leading-[1.7] text-[#5c6b69]">
            {t('supportAlsoUsedSub')}
          </p>
          <div className="flex flex-wrap gap-3">
            {SUPPORT_LINKED.map((l) => (
              <a
                key={l.name}
                href={l.home}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2.5 bg-paper px-4 py-3 transition hover:shadow-[0_20px_40px_-24px_rgba(3,48,47,.5)]"
              >
                <span className="font-display text-[13px] font-extrabold tracking-tight text-ink">{l.name}</span>
                <span className="text-[11.5px] font-medium text-[#5c6b69]">{pick(l.note)}</span>
                <ExternalIcon />
              </a>
            ))}
          </div>
        </section>
      </div>

      {/* ======================================================== OUTRO */}
      <div className="bg-deepest px-5 py-12 sm:px-10 sm:py-16 lg:px-14">
        <p className="mx-auto max-w-[760px] text-center font-display text-lg font-extrabold leading-[1.5] tracking-tight text-white sm:text-[22px]">
          {t('supportOutro')}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={onExit}
            className="inline-flex items-center gap-3.5 bg-signal px-6 py-4 text-[13px] font-extrabold uppercase tracking-[0.08em] text-white transition hover:bg-[#0f938b]"
          >
            {t('supportBack')}
            <Arrow className="text-gold" />
          </button>
          {/* Schwesterseite: dieselben Projekte, aber die Rechtsfrage. */}
          <a
            href="#nachweise"
            className="inline-flex items-center gap-3.5 bg-white/10 px-6 py-4 text-[13px] font-extrabold uppercase tracking-[0.08em] text-white transition hover:bg-white/20"
          >
            {t('credits')}
            <Arrow className="text-gold" />
          </a>
        </div>
      </div>
    </div>
  );
}
