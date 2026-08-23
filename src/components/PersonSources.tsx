import { useEffect, useState } from 'react';
import type { Lang } from '../i18n';
import { useT } from '../i18n';
import { fetchArticle, wikiLink, type WikiArticle } from '../lib/wikipediaArticle';
import { DOC_KIND, PERSON_SOURCES, type HistDoc } from '../data/personSources';
import { licenseInfo } from '../lib/imageCredit';

/** Resolve a Wikipedia article once per term/language, for image + intro. */
function useArticle(term: string | undefined, lang: Lang): WikiArticle | null {
  const [art, setArt] = useState<WikiArticle | null>(null);
  useEffect(() => {
    let alive = true;
    setArt(null);
    if (!term) return;
    void fetchArticle(term, lang).then((a) => {
      if (alive) setArt(a);
    });
    return () => {
      alive = false;
    };
  }, [term, lang]);
  return art;
}

/**
 * Bildnachweis: Urheber und Lizenz, beide verlinkt. Fast jedes Bild von
 * Wikimedia Commons verlangt die Nennung von beidem – ein „© Name" allein
 * genügt nicht (siehe `lib/imageCredit.ts`).
 */
function ImageCredit({ art, lang, className = '' }: { art: WikiArticle; lang: Lang; className?: string }) {
  const license = licenseInfo(art.license, lang);
  if (!art.credit) return null;
  return (
    <span className={`flex min-w-0 items-center gap-1 ${className}`}>
      <a
        href={art.fileUrl ?? art.url}
        target="_blank"
        rel="noreferrer"
        className="truncate hover:text-gold"
        title={art.credit}
      >
        © {art.credit}
      </a>
      {license &&
        (license.url ? (
          <a
            href={license.url}
            target="_blank"
            rel="noreferrer"
            className="flex-none border-l border-white/25 pl-1 hover:text-gold"
            title={license.hint}
          >
            {license.label}
          </a>
        ) : (
          <span className="flex-none border-l border-white/25 pl-1" title={license.hint}>
            {license.label}
          </span>
        ))}
    </span>
  );
}

function ExternalIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3 w-3 shrink-0 opacity-60" fill="currentColor">
      <path d="M14 3h7v7h-2V6.4l-9.3 9.3-1.4-1.4L17.6 5H14zM5 5h5v2H7v10h10v-3h2v5H5z" />
    </svg>
  );
}

/**
 * Portrait band under the coloured header: the lead image of the person's
 * Wikipedia article, plus the honest caption (almost every ancient face in this
 * tree is later art, not a likeness). Renders nothing when there is no image.
 */
export function PersonPortrait({ personId, name, lang }: { personId: string; name: string; lang: Lang }) {
  const src = PERSON_SOURCES[personId];
  const art = useArticle(lang === 'de' ? src?.wiki : src?.wikiEn, lang);
  if (!src || !art?.thumb) return null;
  const caption = lang === 'de' ? src.imageDe : src.imageEn;

  return (
    <figure className="relative">
      <img
        src={art.thumb}
        alt={name}
        loading="lazy"
        referrerPolicy="no-referrer"
        className="h-40 w-full bg-deepest object-cover object-top"
      />
      {/* Einordnung und Nachweis stehen untereinander: nebeneinander bliebe vom
          Urhebernamen im 22rem breiten Streifen nur „© Ber…" übrig. */}
      <figcaption className="bg-deepest/80 px-3 py-1 text-[10px] leading-snug text-white/55">
        <div>{caption}</div>
        <ImageCredit art={art} lang={lang} />
      </figcaption>
    </figure>
  );
}

function DocRow({ doc, lang }: { doc: HistDoc; lang: Lang }) {
  const t = useT();
  const term = lang === 'de' ? doc.wiki : doc.wikiEn;
  const art = useArticle(term, lang);
  const kind = DOC_KIND[doc.kind];
  const title = lang === 'de' ? doc.de : doc.en;
  const where = lang === 'de' ? doc.whereDe : doc.whereEn;

  return (
    <li className="flex gap-2.5 border-l-2 py-2.5 pl-2.5" style={{ borderColor: kind.color }}>
      {art?.thumb ? (
        <a href={art.url} target="_blank" rel="noreferrer" className="shrink-0">
          <img
            src={art.thumb}
            alt={title}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="h-14 w-14 bg-deepest object-cover"
          />
        </a>
      ) : (
        <span aria-hidden="true" className="h-14 w-14 shrink-0 bg-white/5" />
      )}
      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-1.5 text-[10px] uppercase tracking-wide">
          <span style={{ color: kind.color }}>{lang === 'de' ? kind.de : kind.en}</span>
          <span className="text-white/45">· {lang === 'de' ? doc.dateDe : doc.dateEn}</span>
        </div>
        <a
          href={art?.url ?? wikiLink(term, lang)}
          target="_blank"
          rel="noreferrer"
          className="mt-0.5 inline-flex items-start gap-1 text-[13px] font-semibold leading-snug text-mint underline-offset-2 hover:underline"
        >
          {title}
          <ExternalIcon />
        </a>
        <p className="mt-1 text-[12px] leading-relaxed text-white/75">{lang === 'de' ? doc.saysDe : doc.saysEn}</p>
        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-white/45">
          {where && <span>{where}</span>}
          <span className={doc.named ? 'text-gold/80' : ''}>{doc.named ? t('docNames') : t('docContext')}</span>
        </div>
        {art?.thumb && <ImageCredit art={art} lang={lang} className="mt-0.5 text-[10px] text-white/40" />}
      </div>
    </li>
  );
}

/**
 * Everything about a person that is NOT the Bible: the documents of their own
 * time, and the way into an encyclopedia article. Renders nothing for the many
 * genealogy names for which no such material exists.
 */
export default function PersonSources({ personId, lang }: { personId: string; lang: Lang }) {
  const t = useT();
  const src = PERSON_SOURCES[personId];
  const [expanded, setExpanded] = useState(false);
  const term = lang === 'de' ? src?.wiki : src?.wikiEn;
  const art = useArticle(term, lang);
  useEffect(() => setExpanded(false), [personId]);
  if (!src) return null;

  const docs = src.docs;
  const shown = expanded ? docs : docs.slice(0, 3);
  const note = lang === 'de' ? src.noteDe : src.noteEn;

  return (
    <>
      {docs.length > 0 && (
        <section className="mt-5">
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-white/60">
            {t('timeDocs')} <span className="text-white/35">· {docs.length}</span>
          </div>
          <p className="text-[11px] leading-snug text-white/45">{t('timeDocsHint')}</p>
          {note && (
            <p className="mt-2 border-l-4 border-gold/70 bg-surface/70 px-3 py-2 text-[11.5px] leading-relaxed text-white/70">
              {note}
            </p>
          )}
          <ul className="mt-1.5">
            {shown.map((doc, i) => (
              <DocRow key={`${doc.wiki}-${i}`} doc={doc} lang={lang} />
            ))}
          </ul>
          {docs.length > 3 && (
            <button onClick={() => setExpanded((v) => !v)} className="bm-btn bm-btn-ghost mt-1.5 text-[11px]">
              {expanded ? t('showLess') : `${t('showAll')} (${docs.length})`}
            </button>
          )}
        </section>
      )}

      {term && (
        <section className="mt-5">
          <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-white/60">{t('articleSources')}</div>
          {art?.extract && <p className="mb-2 text-[12px] leading-relaxed text-white/70">{art.extract}</p>}
          <a
            href={art?.url ?? wikiLink(term, lang)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 bg-surface px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-gold/30"
          >
            {t('onWikipedia')}
            <ExternalIcon />
          </a>
        </section>
      )}
    </>
  );
}
