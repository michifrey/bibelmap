import { useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import { localizeMap } from '../lib/mapLocale';
import { watchTiles } from '../lib/tileNotice';
import { attr, KIRCHE_ATTR } from '../lib/mapAttribution';
import { addBasemap } from '../lib/basemaps';
import { markVectorsDecorative } from '../lib/mapKeyboard';
import { flyOptions } from '../lib/motion';
import type { Lang } from '../i18n';
import { useT } from '../i18n';
import {
  FATHERS, COUNCILS, TRADITION_COLOR, TRADITION_LABEL, type Tradition,
} from '../data/church';
import {
  EVENTS, CHURCH_ERAS, CHURCH_ERA_BY_ID, SOURCE_BY_ID, type ChurchEvent,
} from '../data/churchHistory';
import { readableOnDark } from '../lib/contrast';

/**
 * Der Grund, auf dem der Detailkasten liegt: `bg-surface/50` über `deepest`.
 *
 * `readableOnDark` rechnet sonst gegen die dunkelste Bühne. Auf diesem
 * helleren Kasten reicht das nicht – gemessen kam die Epochenrubrik auf 3,82:1
 * heraus, obwohl die Funktion 4,5 zugesagt hatte. Sie hatte recht: nur gegen
 * einen Grund, der hier nicht liegt.
 */
const PANEL_BG = '#063e3c';
import ShareLink from './ShareLink';

interface Props {
  lang: Lang;
  onExit: () => void;
  /** Open straight onto a church father (e.g. coming from the time tree). */
  /** Vorauswahl aus der Adresse oder aus dem Zeitbaum. */
  initial?: { tab: 'timeline' | 'fathers' | 'councils'; id?: string } | null;
  /** Meldet Reiter und Auswahl, damit die Adresse mitläuft. */
  onNavigate?: (nav: { tab: 'timeline' | 'fathers' | 'councils'; id?: string }) => void;
  /** Jump to this father in the time tree. */
  onOpenInTree?: (personId: string) => void;
  /** Paul's journeys live in the Mission & spread view — send people there. */
  onOpenMission?: () => void;
}

type Tab = 'timeline' | 'fathers' | 'councils';

/** Welche Liste zu welchem Reiter gehört – für Adresse und Vorauswahl. */
function listFor(tab: Tab): { id: string }[] {
  return tab === 'councils' ? COUNCILS : tab === 'timeline' ? EVENTS : FATHERS;
}

// The dark basemap, like every other map in the app. A light map inside this
// dark shell read as two designs stacked on each other.
// Die Kacheln kommen aus `lib/basemaps.ts` – eine Adresse für alle sieben
// Karten, statt in jeder Datei eine eigene Kopie.
const TILES = 'light' as const;

export default function ChurchMode({ lang, onExit, initial, onNavigate, onOpenInTree, onOpenMission }: Props) {
  const t = useT();
  // Was aus der Adresse kommt, muss es auch geben – sonst steht der Modus auf
  // seinem Anfang, statt auf eine leere Auswahl zu zeigen.
  // Der Zeitstrahl ist der Anfang dieses Modus: Er ordnet die Väter und die
  // Konzilien in das ein, wovon sie ein Ausschnitt sind. Wer aus dem Zeitbaum
  // auf einen Kirchenvater springt, landet weiter direkt bei ihm.
  const startTab: Tab =
    initial?.tab === 'councils' ? 'councils' : initial?.tab === 'fathers' ? 'fathers' : 'timeline';
  const list = listFor(startTab);
  const startId = initial?.id && list.some((x) => x.id === initial.id) ? initial.id : list[0].id;
  const [tab, setTab] = useState<Tab>(startTab);
  const [sel, setSel] = useState<string | null>(startId);

  useEffect(() => {
    onNavigate?.({ tab, id: sel ?? undefined });
    // Der Text steht oben; wer unten in der Liste klickt, soll ihn sehen.
    panelRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, sel]);

  /** Die scrollende linke Spalte – siehe `detailBlock`. */
  const panelRef = useRef<HTMLDivElement>(null);
  const mapEl = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  /** Abmelder der Kachelwache – ohne ihn bleibt der Hinweis an einer alten Ebene hängen. */
  const tileWatchRef = useRef<(() => void) | null>(null);
  const overlayRef = useRef<L.LayerGroup | null>(null);

  // init map once
  useEffect(() => {
    if (!mapEl.current || mapRef.current) return;
    const map = L.map(mapEl.current, { center: [38, 26], zoom: 5, minZoom: 3, maxZoom: 12, worldCopyJump: true });
    const kacheln = addBasemap(map, TILES);
    tileWatchRef.current = watchTiles(kacheln, map, lang);
    overlayRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;
    return () => {
      tileWatchRef.current?.();
      tileWatchRef.current = null;
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Leaflet beschriftet Zoom und Fenster selbst – auf Englisch. Diese eine
  // Zeile holt die Namen aus derselben Sprachdatei wie der Rest.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    return localizeMap(map, lang, attr(KIRCHE_ATTR, lang));
  }, [lang]);

  // redraw overlay on tab / selection change
  useEffect(() => {
    const map = mapRef.current;
    const group = overlayRef.current;
    if (!map || !group) return;
    group.clearLayers();
    let bounds: L.LatLngBounds | null = null;
    const extend = (ll: [number, number]) => {
      bounds = bounds ? bounds.extend(ll) : L.latLngBounds([ll, ll]);
    };

    if (tab === 'timeline') {
      /*
       * Auf dem Zeitstrahl steht nicht alles gleichzeitig auf der Karte: Es
       * zeigt, was bis zum gewählten Jahr geschehen ist, das Gewählte in Gold.
       * Alles auf einmal wäre ein Punktehaufen von Nairobi bis Bengalen und
       * würde die eine Bewegung verdecken, um die es geht – von Jerusalem nach
       * Norden und Westen, und im letzten Jahrhundert wieder nach Süden.
       */
      const bis = ev?.year ?? EVENTS[0].year;
      for (const e of EVENTS) {
        if (!e.at || e.year > bis) continue;
        const active = e.id === sel;
        extend(e.at);
        L.circleMarker(e.at, {
          radius: active ? 10 : 5,
          color: active ? '#e0a449' : 'rgba(255,255,255,.65)',
          weight: active ? 3.5 : 1,
          fillColor: CHURCH_ERA_BY_ID[e.era].epoch.color,
          fillOpacity: active ? 1 : 0.65,
        })
          .bindTooltip(`${e.year} · ${lang === 'de' ? e.de : e.en}`, { direction: 'top' })
          .on('click', () => setSel(e.id))
          .addTo(group);
      }
      // Der Ausschnitt folgt dem gewählten Ereignis, nicht allen zusammen –
      // sonst zoomt die Karte beim ersten Klick auf die halbe Welt hinaus.
      if (ev?.at) {
        map.flyTo(ev.at, Math.max(map.getZoom(), 5), flyOptions({ duration: 0.7 }));
        markVectorsDecorative(map.getContainer());
        return;
      }
    } else if (tab === 'fathers') {
      for (const f of FATHERS) {
        const active = f.id === sel;
        extend([f.lat, f.lon]);
        L.circleMarker([f.lat, f.lon], {
          radius: active ? 9 : 6,
          // Gold marks the one selected thing; on dark ground the old near-black
          // ring for the active marker was invisible.
          color: active ? '#e0a449' : 'rgba(255,255,255,.8)',
          weight: active ? 3.5 : 1.5,
          fillColor: TRADITION_COLOR[f.tradition],
          fillOpacity: 0.95,
        })
          .bindTooltip(`${lang === 'de' ? f.de : f.en} · ${f.city}`, { direction: 'top' })
          .on('click', () => setSel(f.id))
          .addTo(group);
      }
    } else {
      for (const c of COUNCILS) {
        const active = c.id === sel;
        extend([c.lat, c.lon]);
        L.circleMarker([c.lat, c.lon], {
          radius: active ? 10 : 7,
          // These are gold-filled, so the active ring is white instead.
          color: active ? '#ffffff' : 'rgba(255,255,255,.5)',
          weight: active ? 3.5 : 1.5,
          fillColor: '#e0a449',
          fillOpacity: 1,
        })
          .bindTooltip(`${c.name} · ${c.year}`, { direction: 'top' })
          .on('click', () => setSel(c.id))
          .addTo(group);
      }
    }

markVectorsDecorative(map.getContainer());
    if (bounds) map.flyToBounds((bounds as L.LatLngBounds).pad(0.25), flyOptions({ duration: 0.7, maxZoom: 8 }));
  }, [tab, sel, lang]);

  function switchTab(tb: Tab) {
    setTab(tb);
    setSel(listFor(tb)[0].id);
  }

  const detail = useMemo(() => {
    if (tab === 'timeline') return EVENTS.find((e) => e.id === sel) ?? null;
    if (tab === 'fathers') return FATHERS.find((f) => f.id === sel) ?? null;
    return COUNCILS.find((c) => c.id === sel) ?? null;
  }, [tab, sel]);

  /** Das gewählte Ereignis und wo es auf der Schiene steht. */
  const evIndex = tab === 'timeline' ? EVENTS.findIndex((e) => e.id === sel) : -1;
  const ev: ChurchEvent | null = evIndex >= 0 ? EVENTS[evIndex] : null;
  const step = (d: number) => {
    const next = EVENTS[Math.min(EVENTS.length - 1, Math.max(0, evIndex + d))];
    if (next) setSel(next.id);
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: 'timeline', label: t('churchTimeline') },
    { id: 'fathers', label: t('churchFathers') },
    { id: 'councils', label: t('councils') },
  ];

  /*
   * Der Text zum Gewählten – über der Liste, nicht darunter.
   *
   * Darunter stand er, solange die Listen kurz waren. Sie sind es nicht mehr:
   * einundvierzig Ereignisse in sechs Gruppen, vierzehn Konzilien. Den Text zu
   * Pfingsten fand man nur nach elf Bildschirmhöhen Scrollen – ein Klick, der
   * sein Ergebnis außerhalb des Bildes ablegt, sieht aus wie keiner.
   *
   * Damit das auch beim Klick weit unten stimmt, rollt die Spalte bei jeder
   * neuen Auswahl nach oben (siehe `panelRef`). Feste Stelle, sichtbares
   * Ergebnis.
   */
  const detailBlock = detail && (

              <div className="mt-4 bg-surface/50 p-3">
                {'sources' in detail ? (
                  <>
                    <div className="bm-eyebrow" style={{ color: readableOnDark(CHURCH_ERA_BY_ID[detail.era].epoch.color, 4.5, PANEL_BG) }}>
                      {t(`churchKind_${detail.kind}`)}
                    </div>
                    <div className="font-display mt-0.5 text-base font-semibold text-white">
                      {lang === 'de' ? detail.de : detail.en}
                    </div>
                    <div className="text-[11px] text-white/60">
                      {lang === 'de' ? detail.when.de : detail.when.en}
                      {detail.place && <> · {lang === 'de' ? detail.place.de : detail.place.en}</>}
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-white">
                      {lang === 'de' ? detail.text.de : detail.text.en}
                    </p>
                    {detail.ref && (
                      <div className="mt-2 text-[11.5px] font-semibold text-mint">{detail.ref}</div>
                    )}

                    {/* Die Quellen stehen unter jedem Ereignis, nicht in einer
                        Liste am Ende: Eine Angabe, die man erst suchen muss,
                        belegt nichts. */}
                    <div className="bm-eyebrow bm-eyebrow-dim mt-3 mb-1">{t('churchSources')}</div>
                    <div className="space-y-0.5">
                      {detail.sources.map((id) => {
                        const q = SOURCE_BY_ID[id];
                        if (!q) return null;
                        return (
                          <a
                            key={id}
                            href={q.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-[11.5px] leading-snug text-white/70 underline decoration-white/30 underline-offset-2 transition hover:text-white"
                          >
                            {q.label} · <span className="text-white/60">{q.by}</span>
                          </a>
                        );
                      })}
                    </div>

                    {onOpenInTree && detail.personId && (
                      <button
                        onClick={() => onOpenInTree(detail.personId as string)}
                        className="mt-2.5 inline-flex items-center gap-1.5 bg-signal px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-signal"
                      >
                        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 3v18M5 9l7-6 7 6" /></svg>
                        {t('churchInTree')}
                      </button>
                    )}
                  </>
                ) : 'years' in detail ? (
                  <>
                    <div className="font-display text-base font-semibold text-white">{lang === 'de' ? detail.de : detail.en}</div>
                    <div className="text-[11px] text-white/60">{detail.city} · {detail.years} · {lang === 'de' ? TRADITION_LABEL[detail.tradition].de : TRADITION_LABEL[detail.tradition].en}</div>
                    <p className="mt-1.5 text-sm leading-relaxed text-white">{lang === 'de' ? detail.deNote : detail.enNote}</p>
                    {onOpenInTree && (
                      <button
                        onClick={() => onOpenInTree(detail.personId)}
                        className="mt-2.5 inline-flex items-center gap-1.5 bg-signal px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-signal"
                      >
                        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 3v18M5 9l7-6 7 6" /></svg>
                        {t('openInTree')}
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <div className="font-display text-base font-semibold text-white">{detail.name} · {detail.year}</div>
                    <div className="text-[11px] text-white/60">{detail.city}</div>
                    <p className="mt-1.5 text-sm leading-relaxed text-white">{lang === 'de' ? detail.de.note : detail.en.note}</p>
                    {/* „Die ökumenischen Konzilien" gibt es als eine Liste
                        nicht – Rom zählt einundzwanzig, die Orthodoxie sieben,
                        die orientalischen Kirchen drei. Wer das weglässt, hat
                        unbemerkt eine Seite gewählt. */}
                    <div className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px]">
                      <span className="text-white/60">{t('churchRecognised')}</span>
                      {detail.recognisedBy.length === 3 ? (
                        <span className="text-white/75">{t('churchAllTraditions')}</span>
                      ) : (
                        detail.recognisedBy.map((tr) => (
                          <span key={tr} className="flex items-center gap-1" style={{ color: readableOnDark(TRADITION_COLOR[tr], 4.5, PANEL_BG) }}>
                            <span className="h-2 w-2 flex-none" style={{ background: TRADITION_COLOR[tr] }} />
                            {lang === 'de' ? TRADITION_LABEL[tr].de : TRADITION_LABEL[tr].en}
                          </span>
                        ))
                      )}
                    </div>
                  </>
                )}
              </div>
  );

  return (
    <div className="fixed inset-0 z-[2000] flex flex-col bg-deepest">
      <div className="flex flex-none flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b border-white/10 bg-abyss px-5 py-3.5 text-white">
        <div className="flex items-center gap-2">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 text-gold" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 3v18M7 8h10M5 21h14" /></svg>
          <div className="font-display text-xl uppercase leading-none">{t('churchMode')}</div>
        </div>
        <div className="flex items-center gap-2">
          {/* Der Stand steht jetzt im Hash – also lässt er sich auch teilen. */}
          <ShareLink className="bm-btn hidden sm:inline-flex" />
          <button onClick={onExit} className="bm-btn bm-btn-gold">
            {t('exit')} ✕
          </button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        {/* left */}
        <div ref={panelRef} className="scroll-soft flex w-full flex-col overflow-y-auto border-b border-white/10 md:w-[40%] md:max-w-md md:border-b-0 md:border-r">
          <div className="bm-seg sticky top-0 z-10 gap-0.5 border-b border-white/10 bg-deepest p-1.5">
            {tabs.map((tb) => (
              <button
                key={tb.id}
                onClick={() => switchTab(tb.id)}
                // The .bm-seg rules already carry padding, type and colour --
                // and `.bm-seg > *` overrode a Tailwind bg- utility here, which
                // is why the active tab looked exactly like the inactive one.
                className={`flex-1 ${tab === tb.id ? 'is-on' : ''}`}
              >
                {tb.label}
              </button>
            ))}
          </div>

          {onOpenMission && (
            <button
              onClick={onOpenMission}
              className="flex items-center justify-between gap-2 border-b border-white/10 px-4 py-2.5 text-left transition hover:bg-white/6"
            >
              <span className="text-[12px] text-white/60">{t('paulJourneysMoved')}</span>
              <span className="text-[12px] font-bold text-gold">{t('mission')} →</span>
            </button>
          )}

          <div className="p-3">
            {detailBlock}

            {/* list */}
            {tab === 'fathers' && (
              <>
                <div className="mb-2 flex flex-wrap gap-2 px-1">
                  {(['west', 'east', 'orient'] as Tradition[]).map((tr) => (
                    <span key={tr} className="flex items-center gap-1 text-[11px] text-white/60">
                      <span className="h-2.5 w-2.5" style={{ background: TRADITION_COLOR[tr] }} />
                      {lang === 'de' ? TRADITION_LABEL[tr].de : TRADITION_LABEL[tr].en}
                    </span>
                  ))}
                </div>
                <div className="space-y-1">
                  {FATHERS.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setSel(f.id)}
                      className={`flex w-full items-center gap-3 border-l-4 px-3 py-2 text-left transition ${sel === f.id ? 'border-gold bg-surface' : 'border-transparent hover:bg-white/6'}`}
                    >
                      <span className="h-2.5 w-2.5 flex-none rounded-full" style={{ background: TRADITION_COLOR[f.tradition] }} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-white">{lang === 'de' ? f.de : f.en}</span>
                        <span className="text-[11px] text-white/60">{f.city} · {f.years}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {tab === 'timeline' && (
              <div className="space-y-3">
                {CHURCH_ERAS.map((era) => {
                  const drin = EVENTS.filter((e) => e.era === era.id);
                  if (!drin.length) return null;
                  return (
                    <div key={era.id}>
                      <div className="bm-eyebrow mb-1 flex items-center gap-1.5 px-1">
                        <span className="h-2.5 w-2.5 flex-none" style={{ background: era.epoch.color }} />
                        <span style={{ color: readableOnDark(era.epoch.color) }}>
                          {lang === 'de' ? era.epoch.de : era.epoch.en}
                        </span>
                        <span className="text-white/60">{era.from}–{era.to}</span>
                      </div>
                      <div className="space-y-0.5">
                        {drin.map((e) => (
                          <button
                            key={e.id}
                            onClick={() => setSel(e.id)}
                            className={`flex w-full items-center gap-2.5 border-l-4 px-3 py-1.5 text-left transition ${sel === e.id ? 'border-gold bg-surface' : 'border-transparent hover:bg-white/6'}`}
                          >
                            <span className="bm-num w-11 flex-none text-right text-[11px] text-white/60 tabular-nums">
                              {e.year}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-sm font-medium text-white">
                                {lang === 'de' ? e.de : e.en}
                              </span>
                              {e.place && (
                                <span className="block truncate text-[11px] text-white/60">
                                  {lang === 'de' ? e.place.de : e.place.en}
                                </span>
                              )}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {tab === 'councils' && (
              <div className="space-y-1">
                {COUNCILS.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSel(c.id)}
                    className={`flex w-full items-center gap-2 px-3 py-1.5 text-left transition ${sel === c.id ? 'bg-surface ring-1 ring-white/10' : 'hover:bg-surface'}`}
                  >
                    <span className="grid h-6 w-6 flex-none place-items-center rounded-full bg-gold/30 text-[10px] font-semibold text-white">{c.year.slice(0, 4)}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-white">{c.name}</span>
                      <span className="text-[11px] text-white/60">{c.city}</span>
                    </span>
                    {/* Drei Punkte, drei Traditionen: ab 451 fehlt einer, ab
                        787 zwei. Die Liste zeigt damit auf einen Blick, wo aus
                        einer gemeinsamen Reihe drei getrennte wurden. */}
                    <span className="flex flex-none gap-0.5" aria-hidden="true">
                      {(['west', 'east', 'orient'] as Tradition[]).map((tr) => (
                        <span
                          key={tr}
                          className="h-1.5 w-1.5 rounded-full"
                          style={{
                            background: c.recognisedBy.includes(tr) ? TRADITION_COLOR[tr] : 'transparent',
                            boxShadow: c.recognisedBy.includes(tr) ? 'none' : 'inset 0 0 0 1px rgba(255,255,255,.25)',
                          }}
                        />
                      ))}
                    </span>
                  </button>
                ))}
              </div>
            )}

          </div>
        </div>

        {/* map */}
        <div className="relative flex min-h-[40vh] flex-1 flex-col">
          <div className="relative min-h-0 flex-1">
            <div ref={mapEl} className="absolute inset-0 h-full w-full" />
          </div>

          {/*
            Der Zeitstrahl. Ein Strich je Ereignis, in der Farbe seiner Epoche –
            derselben, die die Person im Zeitbaum trägt, weil beide aus
            `GEN_EPOCHS` kommen.

            Bewusst gleich breite Striche und keine Jahresachse: Von 30 bis
            heute maßstabsgetreu hieße, dass die Reformation zwei Pixel bekommt
            und das Mittelalter die halbe Leiste. Die Leiste zeigt die
            Reihenfolge und die Dichte der Ereignisse, nicht die Dauer – die
            Jahreszahlen stehen daneben.
          */}
          {tab === 'timeline' && ev && (
            <div className="flex-none">
              <div className="bm-chyron flex items-stretch">
                <div
                  className="flex flex-none items-center border-l-[5px] bg-abyss/70 px-3 font-display text-[12px] uppercase tracking-[0.18em] sm:px-4"
                  style={{
                    borderColor: CHURCH_ERA_BY_ID[ev.era].epoch.color,
                    color: readableOnDark(CHURCH_ERA_BY_ID[ev.era].epoch.color),
                  }}
                >
                  {t(`churchKind_${ev.kind}`)}
                </div>
                <div className="flex min-w-0 flex-1 items-center gap-3 px-3 sm:gap-4 sm:px-4">
                  <span className="font-display flex-none text-[22px] leading-none text-gold tabular-nums sm:text-[26px]">
                    {ev.year}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[13px] font-bold text-white sm:text-[15px]">
                    {lang === 'de' ? ev.de : ev.en}
                  </span>
                </div>
                <div className="flex flex-none items-center gap-px pr-1">
                  <button onClick={() => step(-1)} disabled={evIndex <= 0} aria-label={t('prev')} className="bm-btn bm-btn-ghost h-full border-0 px-2.5">‹</button>
                  <button onClick={() => step(1)} disabled={evIndex >= EVENTS.length - 1} aria-label={t('next')} className="bm-btn bm-btn-ghost h-full border-0 px-2.5">›</button>
                </div>
              </div>

              <div className="bm-panel-solid border-t-0 px-2 pb-1.5 pt-2 sm:px-3">
                <div className="scroll-soft flex gap-px overflow-x-auto pb-1">
                  {EVENTS.map((e, i) => {
                    const c = CHURCH_ERA_BY_ID[e.era].epoch.color;
                    const on = i === evIndex;
                    return (
                      <button
                        key={e.id}
                        onClick={() => setSel(e.id)}
                        title={`${e.year} · ${lang === 'de' ? e.de : e.en}`}
                        aria-label={`${e.year} · ${lang === 'de' ? e.de : e.en}`}
                        aria-current={on ? 'true' : undefined}
                        className="group flex-none px-[1px] py-1"
                      >
                        <span
                          className="block w-[7px] transition-all sm:w-[9px]"
                          style={{ height: on ? 22 : 12, background: on ? '#e0a449' : c, opacity: on ? 1 : 0.55 }}
                        />
                      </button>
                    );
                  })}
                </div>
                <div className="flex items-center justify-between gap-2 text-[10px] text-white/60">
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                    {CHURCH_ERAS.map((era) => (
                      <span key={era.id} className="flex items-center gap-1">
                        <span className="h-2 w-2" style={{ background: era.epoch.color }} />
                        {lang === 'de' ? era.epoch.de : era.epoch.en}
                      </span>
                    ))}
                  </div>
                  <span className="hidden flex-none whitespace-nowrap sm:inline">{t('churchSpanNote')}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
