import { useMemo, useState } from 'react';
import type { Place } from '../types';
import { placeName } from '../lib/places';
import { useT } from '../i18n';
import type { Lang } from '../i18n';
import ShareLink from './ShareLink';
import RouteMap, { type RouteStop } from './RouteMap';
import AlongTheWay from './AlongTheWay';
import {
  bearing,
  compass,
  formatKm,
  legDistances,
  walkingDays,
  type LatLon,
} from '../lib/route';

interface Props {
  places: Place[];
  lang: Lang;
  /** Die Kürzel der Stationen, in der Reihenfolge des Weges. */
  ids: string[];
  onChange: (ids: string[]) => void;
  onShowPlace: (p: Place) => void;
  onExit: () => void;
}

const COLOR = '#e0a449';

/**
 * Der eigene Weg.
 *
 * Die Bibelreisen und die Missionsreisen sind gesetzt – ihre Stationen stehen
 * fest, weil die Bibel sie so erzählt. Was fehlte, war der umgekehrte Fall:
 * die Wege, die im Text nicht als Weg stehen, aber im Hauskreis auf den Tisch
 * kommen. Die Orte eines Kapitels. Die Städte der sieben Sendschreiben. Die
 * fünf Stationen, die jemand am Sonntag durchgehen will.
 *
 * Hier stellt man sie selbst zusammen: Orte anfügen, Reihenfolge ändern,
 * Entfernungen ablesen, Blatt ausdrucken, Link weitergeben. Die Entfernungen
 * sind Luftlinien und die Tagesmärsche eine Größenordnung – dasselbe, was für
 * die erzählten Reisen gilt, und es steht auch hier dabei.
 *
 * Bewusst Knöpfe zum Verschieben, kein Ziehen mit der Maus: eine Liste, die
 * sich nur ziehen lässt, ist mit der Tastatur nicht zu ordnen.
 */
export default function OwnRoute({ places, lang, ids, onChange, onShowPlace, onExit }: Props) {
  const t = useT();
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  const byId = useMemo(() => new Map(places.map((p) => [p.id, p])), [places]);
  // Ein Kürzel aus einem geteilten Link kann ins Leere zeigen; solche
  // Stationen fallen still heraus, statt eine Lücke in die Strecke zu reißen.
  const stations = useMemo(
    () => ids.map((id) => byId.get(id)).filter((p): p is Place => !!p),
    [ids, byId],
  );

  const points = useMemo<LatLon[]>(() => stations.map((p) => [p.lat, p.lon]), [stations]);
  const legs = useMemo(() => legDistances(points), [points]);
  const totalKm = useMemo(() => legs.reduce((a, b) => a + b, 0), [legs]);

  const stops = useMemo<RouteStop[]>(
    () => stations.map((p) => ({ lat: p.lat, lon: p.lon, label: placeName(p, lang) })),
    [stations, lang],
  );

  function move(from: number, to: number) {
    if (to < 0 || to >= ids.length) return;
    const next = [...ids];
    const [x] = next.splice(from, 1);
    next.splice(to, 0, x);
    onChange(next);
    setPlaying(false);
    setIndex(to);
  }

  function drop(i: number) {
    const next = ids.filter((_, n) => n !== i);
    onChange(next);
    setPlaying(false);
    setIndex((cur) => Math.max(0, Math.min(cur, next.length - 1)));
  }

  const empty = stations.length === 0;

  return (
    <div className="bm-print-root fixed inset-0 z-[2000] flex flex-col bg-deepest">
      <div className="bm-noprint flex flex-none flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b border-white/10 bg-abyss px-5 py-3.5 text-white">
        <div className="min-w-0">
          <div className="bm-eyebrow bm-eyebrow-dim">{t('ownRoute')}</div>
          <div className="truncate font-display text-lg uppercase leading-tight">
            {empty
              ? t('ownRouteEmpty')
              : `${stations.length} ${t('ownRouteStations')}${
                  stations.length > 1 ? ` · ${formatKm(totalKm, lang)} · ${walkingDays(totalKm)} ${t('dayWalks')}` : ''
                }`}
          </div>
        </div>
        <div className="flex flex-none flex-wrap items-center gap-2">
          <ShareLink className="bm-btn bm-btn-ghost" />
          {!empty && (
            <>
              <button onClick={() => window.print()} className="bm-btn hidden sm:inline-flex" title={t('printHint')}>
                {t('print')}
              </button>
              <button onClick={() => onChange([])} className="bm-btn bm-btn-ghost">
                {t('ownRouteClear')}
              </button>
            </>
          )}
          <button onClick={onExit} className="bm-btn bm-btn-ghost">
            {t('close')}
          </button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        <div className="bm-print-sheet scroll-soft flex w-full flex-col overflow-y-auto border-b border-white/10 md:w-[26rem] md:flex-none md:border-b-0 md:border-r">
          <div className="bm-print-only mb-4 border-b px-5 pb-3 pt-1">
            <h1 className="font-display text-2xl uppercase">{t('ownRouteSheet')}</h1>
            {stations.length > 1 && (
              <div className="text-[11px]">
                {stations.length} {t('ownRouteStations')} · {formatKm(totalKm, lang)} ·{' '}
                {walkingDays(totalKm)} {t('dayWalks')}
              </div>
            )}
          </div>

          {empty ? (
            <div className="px-5 py-6">
              <p className="max-w-prose text-[14px] leading-relaxed text-white/70">{t('ownRouteEmptyHow')}</p>
              <button onClick={onExit} className="bm-btn bm-btn-gold mt-4">
                {t('ownRouteToMap')} →
              </button>
            </div>
          ) : (
            <ol className="px-4 py-3">
              {stations.map((p, i) => {
                const active = i === index;
                const km = i > 0 ? legs[i - 1] : null;
                const dir =
                  i > 0 ? compass(bearing(points[i - 1], points[i]), lang) : null;
                return (
                  <li key={`${p.id}-${i}`} className="relative pl-7">
                    <span className="absolute left-[11px] top-0 h-full w-px bg-white/12" aria-hidden />
                    {km !== null && (
                      <>
                        <div className="py-1 pl-3 text-[11px] text-white/40" title={t('distanceNote')}>
                          ↓ {formatKm(km, lang)} {dir} ·{' '}
                          {walkingDays(km)} {walkingDays(km) === 1 ? t('dayWalk') : t('dayWalks')}
                        </div>
                        <AlongTheWay
                          places={places}
                          lang={lang}
                          from={points[i - 1]}
                          to={points[i]}
                          stops={[placeName(stations[i - 1], lang), placeName(p, lang)]}
                          onSelect={onShowPlace}
                        />
                      </>
                    )}
                    <span
                      style={{ background: active ? COLOR : 'transparent', borderColor: COLOR }}
                      className="bm-num absolute left-0 top-3 grid h-[22px] w-[22px] place-items-center rounded-full border-2 text-[10px] text-white"
                    >
                      {i + 1}
                    </span>
                    <button
                      onClick={() => {
                        setPlaying(false);
                        setIndex(i);
                      }}
                      className={`w-full px-3 py-2.5 text-left transition ${active ? 'bg-deep' : 'hover:bg-white/6'}`}
                    >
                      <span className="block font-display text-[15px] uppercase leading-snug text-white">
                        {placeName(p, lang)}
                      </span>
                      <span className="bm-eyebrow block text-gold">
                        {p.mentionCount} {p.mentionCount === 1 ? t('mention') : t('mentions')}
                      </span>
                    </button>
                    <div className="bm-noprint ml-3 mb-2 mt-1 flex flex-wrap items-center gap-1.5">
                      <button
                        onClick={() => move(i, i - 1)}
                        disabled={i === 0}
                        aria-label={t('ownRouteUp')}
                        title={t('ownRouteUp')}
                        className="bm-btn bm-btn-ghost"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => move(i, i + 1)}
                        disabled={i === stations.length - 1}
                        aria-label={t('ownRouteDown')}
                        title={t('ownRouteDown')}
                        className="bm-btn bm-btn-ghost"
                      >
                        ↓
                      </button>
                      <button
                        onClick={() => drop(i)}
                        aria-label={`${t('ownRouteDrop')}: ${placeName(p, lang)}`}
                        title={t('ownRouteDrop')}
                        className="bm-btn bm-btn-ghost"
                      >
                        ✕
                      </button>
                      <button onClick={() => onShowPlace(p)} className="bm-btn bm-btn-ghost">
                        {t('showOnMap')} →
                      </button>
                    </div>
                  </li>
                );
              })}
              <li className="pl-7 pt-2">
                <p className="px-3 text-[11px] leading-relaxed text-white/40">
                  {stations.length === 1 ? t('ownRouteOne') : t('distanceNote')}
                </p>
                <p className="bm-noprint mt-1.5 px-3 text-[11px] leading-relaxed text-white/40">
                  {t('ownRouteSaved')}
                </p>
              </li>
            </ol>
          )}

          {stations.length > 1 && (
            <div className="bm-noprint sticky bottom-0 mt-auto border-t border-white/10 bg-abyss px-4 py-3">
              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    setPlaying(false);
                    setIndex((i) => Math.max(0, i - 1));
                  }}
                  disabled={index === 0}
                  className="bm-btn bm-btn-ghost"
                >
                  ‹ {t('prev')}
                </button>
                <button onClick={() => setPlaying((p) => !p)} className="bm-btn bm-btn-gold">
                  {playing ? t('pause') : index >= stations.length - 1 ? t('replay') : t('play')}
                </button>
                <button
                  onClick={() => {
                    setPlaying(false);
                    setIndex((i) => Math.min(stations.length - 1, i + 1));
                  }}
                  disabled={index >= stations.length - 1}
                  className="bm-btn bm-btn-ghost"
                >
                  {t('next')} ›
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="bm-noprint relative min-h-[45vh] flex-1">
          {!empty && (
            <RouteMap
              stops={stops}
              color={COLOR}
              activeIndex={Math.min(index, stations.length - 1)}
              playing={playing && stations.length > 1}
              onArrive={setIndex}
              onFinish={() => setPlaying(false)}
              onSelect={(i) => {
                setPlaying(false);
                setIndex(i);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
