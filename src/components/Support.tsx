import type { Lang } from '../i18n';
import { useT } from '../i18n';
import { SUPPORT_PROJECTS, SUPPORT_LINKED, type SupportKind, type SupportProject } from '../data/support';

interface Props {
  lang: Lang;
  onExit: () => void;
}

function ExternalIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 flex-none" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 4h6v6M20 4l-8.5 8.5" />
      <path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
    </svg>
  );
}

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12 20.3 4.6 13a4.7 4.7 0 0 1 0-6.7 4.7 4.7 0 0 1 6.7 0l.7.7.7-.7a4.7 4.7 0 0 1 6.7 0 4.7 4.7 0 0 1 0 6.7z" />
    </svg>
  );
}

function ProjectCard({ project, lang }: { project: SupportProject; lang: Lang }) {
  const t = useT();
  const pick = (s: { de: string; en: string }) => (lang === 'de' ? s.de : s.en);

  return (
    <article className="flex flex-col rounded-2xl bg-cream-2/45 p-4 ring-1 ring-teal/10">
      <h3 className="mb-1 font-display text-lg font-semibold leading-tight text-teal">{project.name}</h3>
      {project.by && <div className="mb-2 text-[11.5px] text-ink-soft">{project.by}</div>}

      <p className="text-[13px] leading-relaxed text-ink">{pick(project.role)}</p>

      <p className="mt-2 text-[11.5px] leading-relaxed text-ink-soft">{pick(project.credit)}</p>

      {/* pushed down so the buttons line up across a row of uneven cards */}
      <div className="mt-auto flex flex-none flex-wrap items-center gap-2 pt-3">
        {project.donate && (
          <a
            href={project.donate}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 rounded-lg bg-gold px-3 py-1.5 text-[13px] font-semibold text-teal transition hover:bg-gold-deep"
          >
            <HeartIcon className="h-3.5 w-3.5" />
            {project.donateLabel ? pick(project.donateLabel) : t('supportDonate')}
          </a>
        )}
        <a
          href={project.home}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 rounded-lg bg-cream px-3 py-1.5 text-[13px] font-medium text-teal ring-1 ring-teal/15 transition hover:bg-gold/25"
        >
          {t('supportVisit')}
          <ExternalIcon />
        </a>
      </div>

      {project.donateNote && (
        <p className="mt-2 text-[11px] leading-relaxed text-ink-soft/90">{pick(project.donateNote)}</p>
      )}
    </article>
  );
}

/**
 * Bibelmap earns nothing and collects nothing for itself. What it does have is a
 * precise list of whose work it stands on — so this page sends people there.
 */
export default function Support({ lang, onExit }: Props) {
  const t = useT();
  const pick = (s: { de: string; en: string }) => (lang === 'de' ? s.de : s.en);

  const groups: { kind: SupportKind; title: string; sub: string }[] = [
    { kind: 'content', title: t('supportGroupContent'), sub: t('supportGroupContentSub') },
    { kind: 'data', title: t('supportGroupData'), sub: t('supportGroupDataSub') },
  ];

  return (
    <div className="fixed inset-0 z-[2000] flex flex-col bg-cream">
      {/* top bar */}
      <div className="flex flex-none items-center justify-between gap-3 border-b border-teal/10 bg-teal px-4 py-3 text-cream">
        <div>
          <div className="font-display text-lg font-semibold leading-tight">{t('support')}</div>
          <div className="text-[11px] text-cream/75">{t('supportSub')}</div>
        </div>
        <button
          onClick={onExit}
          className="flex-none rounded-lg bg-gold px-3 py-1.5 text-sm font-medium text-teal transition hover:bg-gold-deep"
        >
          {t('exit')} ✕
        </button>
      </div>

      <div className="scroll-soft mx-auto w-full max-w-4xl flex-1 overflow-y-auto px-4 py-6 sm:px-6 sm:py-8">
        {/* the point of the page */}
        <section className="rounded-2xl bg-cream-2/60 p-5 ring-1 ring-teal/10 sm:p-6">
          <h2 className="font-display text-xl font-semibold text-teal sm:text-2xl">{t('supportLead')}</h2>
          <p className="mt-3 text-[13.5px] leading-relaxed text-ink">{t('supportBody1')}</p>
          <p className="mt-2.5 text-[13.5px] leading-relaxed text-ink">{t('supportBody2')}</p>
          <p className="mt-2.5 text-[13.5px] leading-relaxed text-ink">{t('supportBody3')}</p>

          <ul className="mt-4 grid gap-2 sm:grid-cols-3">
            {([t('supportNoAds'), t('supportNoMoney'), t('supportOpenSource')] as string[]).map((line) => (
              <li key={line} className="flex items-start gap-2 rounded-xl bg-cream px-3 py-2.5 text-[12px] leading-snug text-ink-soft ring-1 ring-teal/10">
                <svg viewBox="0 0 24 24" className="mt-0.5 h-3.5 w-3.5 flex-none text-teal-2" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m5 12.5 4.5 4.5L19 7.5" />
                </svg>
                {line}
              </li>
            ))}
          </ul>
        </section>

        {groups.map((group) => {
          const projects = SUPPORT_PROJECTS.filter((p) => p.kind === group.kind);
          if (!projects.length) return null;
          return (
            <section key={group.kind} className="mt-8">
              <h2 className="font-display text-lg font-semibold text-teal">{group.title}</h2>
              <p className="mb-3 mt-0.5 text-[12px] text-ink-soft">{group.sub}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {projects.map((p) => (
                  <ProjectCard key={p.id} project={p} lang={lang} />
                ))}
              </div>
            </section>
          );
        })}

        {/* linked-out services: named, but nobody is asking for money there */}
        <section className="mt-8">
          <h2 className="font-display text-lg font-semibold text-teal">{t('supportAlsoUsed')}</h2>
          <p className="mb-3 mt-0.5 text-[12px] text-ink-soft">{t('supportAlsoUsedSub')}</p>
          <ul className="flex flex-wrap gap-2">
            {SUPPORT_LINKED.map((l) => (
              <li key={l.name}>
                <a
                  href={l.home}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 rounded-xl bg-cream-2/45 px-3 py-2 text-[12.5px] text-ink ring-1 ring-teal/10 transition hover:bg-gold/20"
                >
                  <span className="font-medium text-teal">{l.name}</span>
                  <span className="text-ink-soft">{pick(l.note)}</span>
                  <ExternalIcon />
                </a>
              </li>
            ))}
          </ul>
        </section>

        <p className="mt-8 rounded-2xl bg-teal px-5 py-4 text-center font-display text-[15px] leading-relaxed text-cream">
          {t('supportOutro')}
        </p>
      </div>
    </div>
  );
}
