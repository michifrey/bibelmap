import { useMemo } from 'react';
import type { Lang } from '../i18n';
import { useT } from '../i18n';
import type { TerrainRoute } from '../lib/terrainRoute';
import { compass, formatKm, isShortWalk, walkingDays } from '../lib/route';
import { readableOnDark } from '../lib/contrast';

interface Props {
  route: TerrainRoute;
  lang: Lang;
  /** Die zuletzt erreichte Station – der Ort, an dem man gerade steht. */
  stopIndex: number;
  /** Zurückgelegte und gesamte Strecke in Kilometern. */
  km: number;
  totalKm: number;
  /** Kurs, in den gerade gegangen wird. */
  heading: number;
  /** Kopfdrehung gegenüber dem Kurs, in Grad. */
  look: number;
  playing: boolean;
  /** Kilometer je Sekunde – das Tempo des Bildes, nicht das eines Menschen. */
  speed: number;
  onPlay: () => void;
  onStep: (delta: number) => void;
  onLook: (delta: number) => void;
  onSpeed: (value: number) => void;
  onExit: () => void;
}

/** Tempostufen in Kilometern je Sekunde. */
export const SPEEDS = [0.3, 0.8, 2, 5];

/**
 * Was beim Gehen zu sehen ist, wenn man nicht auf das Gelände sieht: wo man
 * steht, wie weit es noch ist – und wem man begegnet.
 *
 * Das ist die eigentliche Antwort auf die Frage, der diese Ansicht folgt. Die
 * Kamera zeigt eine Landschaft ohne Menschen; die Menschen stehen in den
 * Daten. `gospel.ts` führt zu jeder Station, wer darin vorkommt, und hier
 * laufen sie mit: Wer zum ersten Mal auftaucht, ist hervorgehoben, wer schon
 * dabei war, bleibt blass stehen.
 *
 * Für die Bibelreisen und die Mission bleibt die Zeile leer – die beiden
 * Datensätze führen ihre Leute nicht Station für Station. Dann zeigt das Feld
 * nur den Weg, und das ist ehrlicher, als Namen zu erfinden.
 */
export default function WalkPanel({
  route,
  lang,
  stopIndex,
  km,
  totalKm,
  heading,
  look,
  playing,
  speed,
  onPlay,
  onStep,
  onLook,
  onSpeed,
  onExit,
}: Props) {
  const t = useT();
  const here = route.stops[stopIndex];
  const next = route.stops[stopIndex + 1];
  const name = (s: { de: string; en: string } | undefined) => (s ? (lang === 'de' ? s.de : s.en) : '');

  /** Wer vor dieser Station schon dabei war – daran hängt „neu". */
  const seen = useMemo(() => {
    const out = new Set<string>();
    for (let i = 0; i < stopIndex; i++) {
      for (const p of route.stops[i].people ?? []) out.add(p.id);
    }
    return out;
  }, [route, stopIndex]);

  /** Alle, denen man auf diesem Weg bisher begegnet ist. */
  const met = useMemo(() => {
    const out = new Set<string>();
    for (let i = 0; i <= stopIndex; i++) {
      for (const p of route.stops[i].people ?? []) out.add(p.id);
    }
    return out.size;
  }, [route, stopIndex]);

  const people = here?.people ?? [];
  const restKm = Math.max(0, totalKm - km);
  const tage = walkingDays(totalKm);

  return (
    <div className="pointer-events-auto flex max-w-[min(94vw,40rem)] flex-col gap-2 bg-deepest/95 px-3 py-2.5 ring-1 ring-white/10 backdrop-blur-xl">
      {/*
        Die Leinwand sagt einem Screenreader nichts – dort ist nur WebGL. Was
        sich beim Gehen ändert, steht deshalb zusätzlich hier und wird
        vorgelesen, sobald eine Station erreicht ist.
      */}
      <p aria-live="polite" className="sr-only">
        {t('terrainStop')} {stopIndex + 1} {t('walkOf')} {route.stops.length}: {name(here)}
        {people.length > 0 &&
          `. ${t('walkMet')}: ${people.map((p) => (lang === 'de' ? p.de : p.en)).join(', ')}`}
      </p>

      {/* Wo man steht, und was noch kommt. */}
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="h-2.5 w-6 flex-none self-center" style={{ background: route.color }} />
        <span className="text-[13px] font-bold text-white">{name(here)}</span>
        {next && (
          <span className="text-[11px] text-white/60">
            → {name(next)} · {compass(heading, lang)}
          </span>
        )}
        <span className="ml-auto flex items-baseline gap-1.5 text-[11px] text-white/55">
          <span className="bm-eyebrow" style={{ color: readableOnDark(route.color) }}>
            {t('terrainStop')} {stopIndex + 1}/{route.stops.length}
          </span>
          <span className="bm-num text-white">{formatKm(km, lang)}</span>
          <span>
            {t('walkOf')} {formatKm(totalKm, lang)}
          </span>
          {!isShortWalk(totalKm) && (
            <span className="hidden sm:inline">
              · ≈ {tage} {tage === 1 ? t('dayWalk') : t('dayWalks')}
            </span>
          )}
        </span>
      </div>

      {/* Der Balken ist die einzige Stelle, an der die Strecke stetig läuft –
          die Stationen sind Punkte, der Weg dazwischen ist das Gehen. */}
      <div
        className="h-1 w-full bg-white/10"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={Math.round(totalKm)}
        aria-valuenow={Math.round(km)}
        aria-label={t('walkTraveled')}
      >
        <div
          className="h-full transition-[width] duration-150"
          style={{ width: `${totalKm > 0 ? Math.min(100, (km / totalKm) * 100) : 0}%`, background: route.color }}
        />
      </div>

      {/* Begegnungen: die Menschen dieser Station. */}
      {people.length > 0 && (
        <div className="flex flex-wrap items-center gap-1">
          <span className="bm-eyebrow mr-0.5 text-white/45">{t('walkMet')}</span>
          {people.map((p) => {
            const neu = !seen.has(p.id);
            return (
              <span
                key={p.id}
                title={lang === 'de' ? p.role.de : p.role.en}
                className={`px-2 py-1 text-[11px] font-bold ${
                  neu ? 'bg-gold text-deep' : 'bg-white/8 text-white/60'
                }`}
              >
                {lang === 'de' ? p.de : p.en}
              </span>
            );
          })}
          {here?.ref && (
            <span className="ml-1 text-[11px] text-gold">{lang === 'de' ? here.ref.de : here.ref.en}</span>
          )}
          <span className="ml-auto text-[11px] text-white/45">
            {met} {t('walkMetSoFar')}
          </span>
        </div>
      )}

      {/* Steuerung */}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
        <button
          onClick={() => onStep(-1)}
          disabled={stopIndex <= 0 && km <= 0}
          aria-label={t('terrainPrevStop')}
          className="bm-btn bm-btn-ghost disabled:opacity-30"
        >
          ‹
        </button>
        <button onClick={onPlay} className="bm-btn bm-btn-signal">
          {playing ? (
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M6 5h4v14H6zm8 0h4v14h-4z" /></svg>
          ) : (
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M7 4v16l13-8z" /></svg>
          )}
          {playing ? t('pause') : t('play')}
        </button>
        <button
          onClick={() => onStep(1)}
          disabled={restKm <= 0}
          aria-label={t('terrainNextStop')}
          className="bm-btn bm-btn-ghost disabled:opacity-30"
        >
          ›
        </button>

        {/* Den Kopf drehen. Ohne das steht der Blick starr auf dem Weg, und
            wer wissen will, was links liegt, kann es nicht sehen. */}
        <span className="flex flex-none items-center gap-1">
          <button onClick={() => onLook(-15)} aria-label={t('walkLookLeft')} className="bm-btn bm-btn-ghost">
            ⟲
          </button>
          <span className="bm-num w-10 text-center text-[11px] text-white/60">
            {look === 0 ? compass(heading, lang) : `${look > 0 ? '+' : ''}${look}°`}
          </span>
          <button onClick={() => onLook(15)} aria-label={t('walkLookRight')} className="bm-btn bm-btn-ghost">
            ⟳
          </button>
        </span>

        <span className="bm-eyebrow ml-1 whitespace-nowrap">{t('walkSpeed')}</span>
        <input
          type="range"
          min={0}
          max={SPEEDS.length - 1}
          step={1}
          value={Math.max(0, SPEEDS.indexOf(speed))}
          aria-label={t('walkSpeed')}
          aria-valuetext={`${speed} km/s`}
          onChange={(e) => onSpeed(SPEEDS[Number(e.target.value)] ?? SPEEDS[1])}
          className="min-w-[5rem] flex-1 accent-[var(--color-gold)]"
        />
        <span className="bm-num w-16 flex-none text-right text-[11px] text-white">
          {speed.toLocaleString(lang === 'de' ? 'de-DE' : 'en-US')} km/s
        </span>

        <button onClick={onExit} className="bm-btn bm-btn-gold flex-none">
          {t('walkExit')}
        </button>
      </div>

      {/* Was diese Ansicht weiß und was nicht – der Satz gehört daneben, nicht
          in ein Impressum. */}
      <p className="text-[10.5px] leading-snug text-white/45">{t('walkNote')}</p>
    </div>
  );
}
