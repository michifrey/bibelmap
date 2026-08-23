import type { Lang } from '../i18n';
import { useT } from '../i18n';
import {
  type Person,
  EPOCH_BY_ID,
  PERSON_BY_ID,
  CHILDREN_BY_PARENT,
  formatYear,
  bibleRefUrl,
  wikipediaSearchUrl,
} from '../data/genealogy';

interface Props {
  person: Person;
  lang: Lang;
  onClose: () => void;
  onSelect: (id: string) => void;
  /** Show a "show on map" action (church-history map) for located figures. */
  onShowOnMap?: (id: string) => void;
}

export default function PersonDetail({ person, lang, onClose, onSelect, onShowOnMap }: Props) {
  const t = useT();
  const epoch = EPOCH_BY_ID[person.epoch];
  const name = lang === 'de' ? person.de : person.en;
  const text = lang === 'de' ? person.deText : person.enText;
  const parent = person.parent ? PERSON_BY_ID[person.parent] : null;
  const reign = lang === 'de' ? person.reignDe : person.reignEn;
  const children = CHILDREN_BY_PARENT[person.id] ?? [];
  const spouseName = person.spouse ? (lang === 'de' ? person.spouse.de : person.spouse.en) : null;

  return (
    <div className="animate-fade-in flex h-full flex-col">
      {/* header band, colored by epoch */}
      <div className="relative px-4 pb-3 pt-4 text-white" style={{ background: epoch?.color ?? '#1f3d3a' }}>
        <button
          onClick={onClose}
          aria-label={t('close')}
          className="absolute right-0 top-0 grid h-9 w-9 place-items-center bg-black/25 text-white transition hover:bg-black/45"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
            <path d="M18.3 5.7 12 12l6.3 6.3-1.4 1.4L10.6 13.4 4.3 19.7 2.9 18.3 9.2 12 2.9 5.7 4.3 4.3l6.3 6.3 6.3-6.3z" />
          </svg>
        </button>
        <div className="bm-eyebrow" style={{ color: 'rgba(255,255,255,.75)' }}>
          {epoch ? (lang === 'de' ? epoch.de : epoch.en) : ''}
        </div>
        <h2 className="mt-1.5 font-display text-3xl uppercase leading-none">{name}</h2>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[12px] text-white/75">
          {person.born !== undefined && (
            <span>
              {t('born')} {formatYear(person.born, lang)}
            </span>
          )}
          {person.lifespan !== undefined && (
            <span>
              · {t('lived')} {person.lifespan} {t('years')}
            </span>
          )}
        </div>
        {reign && <div className="mt-0.5 text-[12px] text-white/75">{reign}</div>}
      </div>

      <div className="scroll-soft flex-1 overflow-y-auto px-4 pb-5 pt-3">
        {person.faith && (
          <div className="mb-3 border-l-4 border-gold bg-surface/70 px-3 py-2 text-[11px] font-medium text-white/70">
            ✦ {t('faithWitness')}
          </div>
        )}

        <p className="text-sm leading-relaxed text-white/80">{text}</p>

        {onShowOnMap && person.lat != null && person.lon != null && (
          <button
            onClick={() => onShowOnMap(person.id)}
            className="bm-btn bm-btn-signal mt-4"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 21s-6-5.7-6-10a6 6 0 1112 0c0 4.3-6 10-6 10z" /><circle cx="12" cy="11" r="2" /></svg>
            {t('showOnMap')}
            {person.city ? ` · ${person.city}` : ''}
          </button>
        )}

        {spouseName && (
          <div className="mt-4">
            <div className="bm-eyebrow">{t('spouse')}</div>
            <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm">
              {spouseName.split(' & ').map((wife) => (
                <a
                  key={wife}
                  href={wikipediaSearchUrl(wife, lang)}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-mint underline-offset-2 hover:underline"
                >
                  {wife}
                </a>
              ))}
            </div>
          </div>
        )}

        {parent && (
          <div className="mt-4">
            <div className="bm-eyebrow">
              {person.faith ? (lang === 'de' ? 'Folgt auf' : 'Follows') : lang === 'de' ? 'Kind von' : 'Child of'}
            </div>
            <button
              onClick={() => onSelect(parent.id)}
              className="mt-0.5 text-sm font-medium text-mint underline-offset-2 hover:underline"
            >
              {lang === 'de' ? parent.de : parent.en}
            </button>
          </div>
        )}

        {children.length > 0 && (
          <div className="mt-4">
            <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-white/60">
              {t('children')}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {children.map((child) => (
                <button
                  key={child.id}
                  onClick={() => onSelect(child.id)}
                  className="bg-surface px-2 py-0.5 text-[11px] font-medium text-mint ring-1 ring-white/10 transition hover:bg-gold/25"
                >
                  {lang === 'de' ? child.de : child.en}
                </button>
              ))}
            </div>
          </div>
        )}

        {person.refs.length > 0 && (
          <div className="mt-4">
            <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-white/60">
              {t('references')}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {person.refs.map((r) => (
                <a
                  key={r}
                  href={bibleRefUrl(r)}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-surface px-2 py-0.5 text-[11px] font-medium text-white ring-1 ring-white/10 transition hover:bg-gold/25"
                >
                  {r}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
