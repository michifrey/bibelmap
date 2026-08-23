import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import type { Place } from './types';
import { LangContext, type Lang, useT, t as tr } from './i18n';
import {
  loadPlaces,
  placesInEra,
  placesUpToEra,
  placesInChapter,
  searchPlaces,
  erasForPlace,
  placeName,
} from './lib/places';
import { ERAS } from './data/eras';
import MapView, { type BasemapId } from './components/MapView';
import Header, { type Mode, type View } from './components/Header';
import { loadMedia } from './lib/media';
import Timeline from './components/Timeline';
import YearSlider from './components/YearSlider';
import SearchPanel from './components/SearchPanel';
import PlaceDetail from './components/PlaceDetail';
const Presentation = lazy(() => import('./components/Presentation'));
const HistoryMode = lazy(() => import('./components/HistoryMode'));
const Mission = lazy(() => import('./components/Mission'));
const JourneyMode = lazy(() => import('./components/JourneyMode'));
const QuizMode = lazy(() => import('./components/QuizMode'));
const MediaMode = lazy(() => import('./components/MediaMode'));
import { formatRoute, parseHash, type Route } from './lib/deepLink';
import type { SearchHit } from './lib/globalSearch';
import { parseRef } from './lib/parseRef';
import { bearing, compass, distanceKm, KM_PER_DAY } from './lib/route';
const CompareMode = lazy(() => import('./components/CompareMode'));
const ChurchMode = lazy(() => import('./components/ChurchMode'));
const GraphView = lazy(() => import('./components/GraphView'));
const Genealogy = lazy(() => import('./components/Genealogy'));
import Landing, { type LandingTarget } from './components/Landing';
const Support = lazy(() => import('./components/Support'));
const Credits = lazy(() => import('./components/Credits'));

/** Name jedes Kartenstils – Schalterleiste und Ausfallhinweis lesen ihn hier. */
const BASEMAP_LABEL: Record<BasemapId, 'basemapDark' | 'basemapLight' | 'basemapSatellite' | 'basemapRelief' | 'basemapAntique'> = {
  dark: 'basemapDark',
  light: 'basemapLight',
  satellite: 'basemapSatellite',
  relief: 'basemapRelief',
  antique: 'basemapAntique',
};

/** The support page is worth linking to from outside, so it lives on a hash. */
const SUPPORT_HASH = '#unterstuetzen';

/** Jede Ansicht ist verlinkbar: der Hash hält fest, wo man gerade steht. */
const INITIAL_ROUTE: Route | null = parseHash(window.location.hash);

function Loading() {
  const t = useT();
  return (
    <div className="flex h-full w-full items-center justify-center bg-deepest">
      <div className="flex flex-col items-center gap-3 text-white">
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-8 w-8 animate-pulse" fill="currentColor">
          <path d="M12 2C8.7 2 6 4.7 6 8c0 4.4 6 12 6 12s6-7.6 6-12c0-3.3-2.7-6-6-6zm0 8.2A2.2 2.2 0 1 1 12 5.8a2.2 2.2 0 0 1 0 4.4z" />
        </svg>
        <span className="font-display text-sm">{t('loading')}</span>
      </div>
    </div>
  );
}

/**
 * Während eine Ansicht nachgeladen wird, steht schon ihre Bühne da – so
 * flackert die Karte darunter nicht weg.
 */
function ModeFallback() {
  return (
    <div className="fixed inset-0 z-[2000] grid place-items-center bg-deepest">
      <div className="h-8 w-8 animate-pulse rounded-full bg-gold/60" />
    </div>
  );
}

export default function App() {
  /**
   * Sprache: die einmal getroffene Wahl gilt weiter. Ohne gespeicherte Wahl
   * entscheidet die Browsersprache – wer Englisch eingestellt hat, sollte nicht
   * erst auf EN klicken müssen.
   */
  const [lang, setLang] = useState<Lang>(() => {
    try {
      const saved = localStorage.getItem('bibelmap:lang');
      if (saved === 'de' || saved === 'en') return saved;
    } catch {
      // Kein Speicher – dann eben die Browsersprache.
    }
    return navigator.language?.toLowerCase().startsWith('en') ? 'en' : 'de';
  });

  useEffect(() => {
    try {
      localStorage.setItem('bibelmap:lang', lang);
      document.documentElement.lang = lang;
    } catch {
      // Nicht schlimm: die Wahl gilt dann nur für diesen Besuch.
    }
  }, [lang]);
  const [places, setPlaces] = useState<Place[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [heat, setHeat] = useState(false);
  const [era, setEra] = useState<string | null>(null);
  /** Zeitleiste: „nur diese Epoche" oder „alles bis hierhin". */
  const [cumulative, setCumulative] = useState(false);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Place | null>(null);
  const [flyTo, setFlyTo] = useState<{ lat: number; lon: number; zoom?: number; key: number } | null>(null);
  const [mode, setMode] = useState<Mode | null>(INITIAL_ROUTE?.mode ?? null);
  const [basemap, setBasemap] = useState<BasemapId>('dark');
  /** Welcher Kartenstil ausgefallen ist – und ob es ein Ausweichen gab. */
  const [tileNotice, setTileNotice] = useState<{ id: BasemapId; fellBack: boolean } | null>(null);
  const [view, setView] = useState<View>(INITIAL_ROUTE?.view ?? 'map');
  // The start page is the front door: it is what the app opens on, and the
  // wordmark in the header is the way back to it.
  const [atStart, setAtStart] = useState(!INITIAL_ROUTE);
  // Unterzustand der Nebenansichten, damit die Adresse ihn mitschreibt.
  const [journeyNav, setJourneyNav] = useState(INITIAL_ROUTE?.journey ?? null);
  const [missionNav, setMissionNav] = useState(INITIAL_ROUTE?.mission ?? null);
  const [readingNav, setReadingNav] = useState(INITIAL_ROUTE?.reading ?? null);
  const [mediaNav, setMediaNav] = useState(INITIAL_ROUTE?.media ?? null);
  // Zählt hoch, wenn die Adresse von außen kommt (Zurück-Taste, getippter Link):
  // die Nebenansichten hängen daran und übernehmen den Stand neu.
  const [navEpoch, setNavEpoch] = useState(0);
  const pendingPlace = useRef<string | null>(INITIAL_ROUTE?.placeId ?? null);
  const ownHash = useRef<string>(window.location.hash);
  // Cross-links between the time tree and the church-history map (shared data).
  const [treeFocus, setTreeFocus] = useState<string | null>(null);
  const [churchNav, setChurchNav] = useState<{ tab: 'fathers' | 'councils'; id?: string } | null>(
    INITIAL_ROUTE?.church ?? null,
  );
  const [compareNav, setCompareNav] = useState<string | null>(INITIAL_ROUTE?.compare ?? null);
  // Mobile-only: bottom-sheet (search/detail) and timeline are collapsible so
  // the map stays usable on small screens. Desktop ignores these.
  const [sheetOpen, setSheetOpen] = useState(false);
  const [tlOpen, setTlOpen] = useState(false);
  // Reiche & Grenzen: null = overlay off. Starts at the united kingdom, the one
  // year where the map most obviously answers "who ruled here?".
  const [borderYear, setBorderYear] = useState<number | null>(null);

  function toggleBorders() {
    setBorderYear((y) => (y === null ? -1000 : null));
  }
  // Picking the antique basemap is the clearest signal that someone wants the
  // ancient world rather than today's, so the empires come along with it.
  /**
   * Ein fremder Kachelserver antwortet nicht: zurück auf die Karte, die aus
   * der eigenen Ecke kommt – und ein Wort dazu, damit niemand die leere
   * Fläche für einen Fehler der App hält.
   */
  function handleTilesUnavailable(id: BasemapId) {
    // Wer den Stil längst gewechselt hat, braucht die Nachricht nicht mehr.
    if (basemap !== id) return;
    // Fällt die Nachtkarte selbst aus, ist nicht ein Anbieter stumm, sondern
    // das Netz – dann gibt es nichts, worauf man ausweichen könnte.
    const fellBack = id !== 'dark';
    if (fellBack) setBasemap('dark');
    setTileNotice({ id, fellBack });
  }

  /** Der Server ist zurück – der Hinweis darf gehen. */
  function handleTilesRecovered(id: BasemapId) {
    setTileNotice((notice) => (notice?.id === id ? null : notice));
  }

  function handleBasemap(id: BasemapId) {
    setTileNotice(null);
    setBasemap(id);
    if (id === 'antique' && borderYear === null) setBorderYear(-1000);
  }

  function enterFromStart(target: LandingTarget) {
    if (target === 'support') {
      openSupport();
      return;
    }
    setAtStart(false);
    setView(target === 'tree' ? 'tree' : 'map');
    if (target === 'media') setMediaNav(null);
    setMode(target === 'present' ? 'present' : target === 'media' ? 'media' : null);
  }

  function openSupport() {
    if (window.location.hash !== SUPPORT_HASH) {
      window.history.pushState(null, '', SUPPORT_HASH);
    }
    setAtStart(false);
    setView('map');
    setMode('support');
  }

  /**
   * Replace rather than go back: someone may have opened the link directly, and
   * `back()` would then walk them off the site instead of closing the page.
   */
  function closeSupport() {
    if (window.location.hash === SUPPORT_HASH) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    setMode(null);
  }

  function showPersonOnMap(id: string) {
    setChurchNav({ tab: 'fathers', id });
    setMode('church');
    setView('map');
  }
  function openPersonInTree(id: string) {
    setTreeFocus(id);
    setMode(null);
    setView('tree');
  }
  // Opening a view/mode manually (header toggle, modes menu) clears any pending
  // cross-link focus so it doesn't unexpectedly jump on the next visit.
  function handleView(v: View) {
    if (v === 'tree') setTreeFocus(null);
    setView(v);
  }
  function handleMode(m: Mode) {
    if (m === 'support') {
      openSupport();
      return;
    }
    if (m === 'church') setChurchNav(null);
    if (m === 'compare') setCompareNav(null);
    if (m === 'media') setMediaNav(null);
    setMode(m);
  }

  useEffect(() => {
    loadPlaces().then(setPlaces).catch((e) => setError(String(e)));
  }, []);

  /*
   * Die Ansichten liegen in eigenen Dateien und kommen erst, wenn sie
   * gebraucht werden – der Start bleibt so leicht. Sobald der Browser Ruhe
   * hat, werden sie trotzdem geholt: dann liegen sie im Cache des Service
   * Workers, und die App bleibt auch ohne Netz vollständig.
   */
  useEffect(() => {
    const prefetch = () => {
      void import('./components/Presentation');
      void import('./components/JourneyMode');
      void import('./components/Mission');
      void import('./components/HistoryMode');
      void import('./components/QuizMode');
      void import('./components/MediaMode');
      void import('./components/Genealogy');
      void import('./components/ChurchMode');
      void import('./components/CompareMode');
      void import('./lib/globalSearch');
      // Nicht nur der Programmcode, auch der Medien-Index: sonst steht „Hören &
      // Sehen" ohne Netz leer da, während jede andere Ansicht vollständig ist.
      void loadMedia();
    };
    // Erst wenn der Service Worker steht: sonst laufen die Dateien an ihm
    // vorbei und fehlen später im Cache, obwohl sie längst geholt wurden.
    let cancel = () => {};
    const start = () => {
      const idle = window.requestIdleCallback;
      if (idle) {
        const id = idle(prefetch, { timeout: 8000 });
        cancel = () => window.cancelIdleCallback?.(id);
      } else {
        const t = window.setTimeout(prefetch, 3000);
        cancel = () => window.clearTimeout(t);
      }
    };
    if ('serviceWorker' in navigator) navigator.serviceWorker.ready.then(start).catch(start);
    else start();
    return () => cancel();
  }, []);

  // Die Adresse schreibt mit, wo man steht – ohne Verlaufseinträge zu häufen.
  useEffect(() => {
    const hash = atStart
      ? ''
      : formatRoute({
          view,
          mode,
          placeId: selected?.id,
          journey: journeyNav ?? undefined,
          mission: missionNav ?? undefined,
          reading: readingNav ?? undefined,
          media: mediaNav ?? undefined,
          church: churchNav ?? undefined,
          compare: compareNav ?? undefined,
        });
    if (hash === window.location.hash) return;
    ownHash.current = hash;
    window.history.replaceState(null, '', hash || window.location.pathname + window.location.search);
  }, [
    atStart,
    view,
    mode,
    selected,
    journeyNav,
    missionNav,
    readingNav,
    mediaNav,
    churchNav,
    compareNav,
  ]);

  /*
   * Escape schließt, was gerade offen ist – von außen nach innen: erst der
   * Modus, dann die Nebenansicht, zuletzt die Ortskarte. Ein Griff, der in
   * jedem Vollbild funktioniert, ohne dass jede Ansicht ihn selbst kennt.
   */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (mode) setMode(null);
      else if (view !== 'map') setView('map');
      else if (selected) setSelected(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mode, view, selected]);

  // Zurück-Taste und von Hand geänderte Adressen anwenden.
  useEffect(() => {
    const sync = () => {
      if (window.location.hash === ownHash.current) return;
      const route = parseHash(window.location.hash);
      if (!route) {
        setAtStart(true);
        setMode(null);
        setSelected(null);
        return;
      }
      setAtStart(false);
      setView(route.view);
      setMode(route.mode);
      setJourneyNav(route.journey ?? null);
      setMissionNav(route.mission ?? null);
      setReadingNav(route.reading ?? null);
      setMediaNav(route.media ?? null);
      setChurchNav(route.church ?? null);
      setCompareNav(route.compare ?? null);
      pendingPlace.current = route.placeId ?? null;
      if (!route.placeId) setSelected(null);
      setNavEpoch((n) => n + 1);
    };
    window.addEventListener('popstate', sync);
    window.addEventListener('hashchange', sync);
    return () => {
      window.removeEventListener('popstate', sync);
      window.removeEventListener('hashchange', sync);
    };
  }, []);

  // Ein verlinkter Ort wartet, bis places.json geladen ist.
  useEffect(() => {
    const id = pendingPlace.current;
    if (!places || !id) return;
    pendingPlace.current = null;
    const p = places.find((x) => x.id === id);
    if (p) select(p);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [places, navEpoch]);

  const visible = useMemo(
    () => (places ? (cumulative ? placesUpToEra(places, era) : placesInEra(places, era)) : []),
    [places, era, cumulative],
  );
  /** In der kumulativen Ansicht: was in der gewählten Epoche neu dazukommt. */
  const newIds = useMemo(() => {
    if (!places || !cumulative || !era) return null;
    return new Set(placesInEra(places, era).map((p) => p.id));
  }, [places, cumulative, era]);
  const results = useMemo(() => (places ? searchPlaces(places, query) : []), [places, query]);
  // Der Index über Reisen und Ausbreitung hängt an den großen Datendateien.
  // Er wird geladen, sobald jemand tippt – nicht schon beim Start.
  const [stories, setStories] = useState<SearchHit[]>([]);
  useEffect(() => {
    if (query.trim().length < 2) {
      setStories([]);
      return;
    }
    let alive = true;
    import('./lib/globalSearch')
      .then((m) => alive && setStories(m.searchStories(query, lang)))
      .catch(() => alive && setStories([]));
    return () => {
      alive = false;
    };
  }, [query, lang]);

  // „Apg 13" ist keine Ortssuche, sondern eine Bibelstelle: dann zeigt die
  // Liste die Orte dieses Kapitels und führt auf Wunsch in den Text.
  const ref = useMemo(() => parseRef(query, lang), [query, lang]);
  const refPlaces = useMemo(
    () => (ref && places ? placesInChapter(places, ref.osis, ref.chapter).map((x) => x.place) : []),
    [ref, places],
  );

  /*
   * Was von hier aus an einem Tag zu erreichen war. Nur Siedlungen: Tore,
   * Stadtviertel und Bauwerke teilen sich die Koordinaten ihres Ortes und
   * wären keine Nachbarn, sondern derselbe Fleck. Alles unter 1,5 km fällt
   * aus demselben Grund heraus.
   */
  const neighbours = useMemo(() => {
    if (!places || !selected) return [];
    const seen = new Set<string>();
    return places
      .filter((p) => p.id !== selected.id && p.types.includes('settlement'))
      .map((p) => ({
        place: p,
        km: distanceKm([selected.lat, selected.lon], [p.lat, p.lon]),
        dir: compass(bearing([selected.lat, selected.lon], [p.lat, p.lon]), lang),
      }))
      .filter((n) => n.km >= 1.5 && n.km <= KM_PER_DAY)
      // Nach Bedeutung auswählen, nach Entfernung zeigen: in Jerusalems Umkreis
      // sagen Bethlehem und Jericho mehr als der nächstgelegene Weiler.
      .sort((a, b) => b.place.mentionCount - a.place.mentionCount)
      .filter((n) => {
        const name = placeName(n.place, lang);
        if (seen.has(name)) return false;
        seen.add(name);
        return true;
      })
      .slice(0, 8)
      .sort((a, b) => a.km - b.km);
  }, [places, selected, lang]);

  /** Aus „Hören & Sehen" in den Lesemodus – dieselbe Stelle, nur als Text. */
  function openReading(osis: string, chapter: number) {
    setReadingNav({ osis, chapter });
    setMode('present');
    setNavEpoch((n) => n + 1);
  }

  /** Aus dem Lesemodus zu den Folgen, die dieses Kapitel behandeln. */
  function openMediaForRef(osis: string, chapter: number) {
    setMediaNav({ ref: { osis, chapter } });
    setMode('media');
    setNavEpoch((n) => n + 1);
  }

  function openRef() {
    if (!ref) return;
    setReadingNav({ osis: ref.osis, chapter: ref.chapter });
    setMode('present');
    setNavEpoch((n) => n + 1);
  }

  /** Ein Treffer aus Reisen oder Ausbreitung: Modus öffnen, Stand setzen. */
  function openStory(hit: SearchHit) {
    setAtStart(false);
    setView('map');
    if (hit.target.mode === 'journeys') {
      setJourneyNav(hit.target.journey);
      setMode('journeys');
    } else {
      setMissionNav(hit.target.mission);
      setMode('mission');
    }
    setNavEpoch((n) => n + 1);
  }
  const topPlaces = useMemo(() => (places ? places.slice(0, 30) : []), [places]);

  const eraCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const e of ERAS) counts[e.id] = 0;
    if (places) {
      for (const p of places) for (const id of erasForPlace(p)) counts[id] = (counts[id] ?? 0) + 1;
    }
    return counts;
  }, [places]);

  function select(p: Place) {
    setSelected(p);
    setSheetOpen(true); // reveal the detail sheet on mobile
    setFlyTo({ lat: p.lat, lon: p.lon, zoom: 9, key: Date.now() });
  }

  // Jump from the genealogy overlay to a place: close the overlay, return to the
  // map view and focus the place.
  function showPlaceFromGenealogy(p: Place) {
    setMode(null);
    setView('map');
    setEra(null);
    setHeat(false);
    select(p);
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center bg-deepest p-6 text-center text-sm text-white/60">
        Konnte Daten nicht laden: {error}
      </div>
    );
  }
  if (!places) {
    return (
      <LangContext.Provider value={lang}>
        <Loading />
      </LangContext.Provider>
    );
  }

  if (atStart) {
    return (
      <LangContext.Provider value={lang}>
        <Landing
          lang={lang}
          onLang={setLang}
          placeCount={places.length}
          eraCounts={eraCounts}
          onEnter={enterFromStart}
        />
      </LangContext.Provider>
    );
  }

  return (
    <LangContext.Provider value={lang}>
      <div className="relative h-full w-full overflow-hidden">
        {view === 'tree' ? (
          <Suspense fallback={<ModeFallback />}>
          <Genealogy
            places={places}
            lang={lang}
            focusId={treeFocus}
            onShowOnMap={showPersonOnMap}
            onShowPlace={showPlaceFromGenealogy}
          />
          </Suspense>
        ) : view === 'graph' ? (
          <Suspense fallback={<ModeFallback />}>
            <GraphView places={places} lang={lang} />
          </Suspense>
        ) : (
          <>
            <MapView
              places={visible}
              heat={heat}
              selectedId={selected?.id ?? null}
              lang={lang}
              onSelect={select}
              basemap={basemap}
              onTilesUnavailable={handleTilesUnavailable}
              onTilesRecovered={handleTilesRecovered}
              newIds={newIds}
              flyTo={flyTo}
              borderYear={borderYear}
            />

            {/* Search / detail — left rail on desktop, bottom sheet on mobile */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1110] flex flex-col p-2 sm:inset-y-0 sm:left-0 sm:right-auto sm:z-[1100] sm:w-full sm:max-w-[22rem] sm:p-4 sm:pt-24">
              <div className="pointer-events-auto flex min-h-0 flex-col overflow-hidden bg-deepest/95 ring-1 ring-white/10 backdrop-blur-xl sm:flex-1 sm:">
                {/* mobile peek / grab handle */}
                <button
                  onClick={() => setSheetOpen((v) => !v)}
                  className="flex items-center gap-2 border-b border-white/10 px-3 py-2 text-left sm:hidden"
                  aria-label={tr(lang, 'search')}
                >
                  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 flex-none text-white" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />
                  </svg>
                  <span className="flex-1 truncate text-sm text-white/60">
                    {selected ? placeName(selected, lang) : tr(lang, 'search')}
                  </span>
                  <svg aria-hidden="true" viewBox="0 0 24 24" className={`h-4 w-4 flex-none text-white/60 transition-transform ${sheetOpen ? 'rotate-180' : ''}`} fill="currentColor">
                    <path d="M7 14l5-5 5 5z" />
                  </svg>
                </button>
                <div className={`min-h-0 flex-col overflow-hidden ${sheetOpen ? 'flex max-h-[58vh]' : 'hidden'} sm:flex sm:max-h-none sm:flex-1`}>
                  {selected ? (
                    <PlaceDetail
                      place={selected}
                      lang={lang}
                      neighbours={neighbours}
                      onSelectPlace={select}
                      onClose={() => setSelected(null)}
                    />
                  ) : (
                    <SearchPanel
                      query={query}
                      onQuery={setQuery}
                      results={ref ? refPlaces : results}
                      topPlaces={topPlaces}
                      onSelect={select}
                      stories={stories}
                      onOpenStory={openStory}
                      refHit={ref ? { label: ref.label, count: refPlaces.length } : null}
                      onOpenRef={openRef}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* basemap switcher + empire overlay (right edge) */}
            <div className="pointer-events-auto absolute right-3 top-1/2 z-[1100] flex -translate-y-1/2 flex-col gap-1 bg-deepest/95 p-1 ring-1 ring-white/10 backdrop-blur-xl sm:right-4">
              {([
                ['dark', 'M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z'],
                ['light', 'M3 12h18M12 3v18'],
                ['satellite', 'M12 2a10 10 0 100 20 10 10 0 000-20zM2 12h20M12 2c2.5 2.7 2.5 17.3 0 20M12 2c-2.5 2.7-2.5 17.3 0 20'],
                ['relief', 'M3 18l5-8 4 5 3-4 6 7z'],
                ['antique', 'M9 3 4 5v16l5-2 6 2 5-2V3l-5 2-6-2zM9 3v16M15 5v16'],
              ] as [BasemapId, string][]).map(([id, icon]) => (
                <button
                  key={id}
                  onClick={() => handleBasemap(id)}
                  title={tr(lang, BASEMAP_LABEL[id])}
                  aria-label={tr(lang, BASEMAP_LABEL[id])}
                  className={`grid h-9 w-9 place-items-center transition ${ basemap === id ? 'bg-signal text-white ' : 'text-white/60 hover:bg-surface' }`}
                >
                  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d={icon} />
                  </svg>
                </button>
              ))}

            </div>

            {/* Kachelserver stumm: ein Wort statt einer leeren Fläche. */}
            {tileNotice && (
              <div className="pointer-events-auto absolute right-3 top-[calc(50%+11.5rem)] z-[1100] max-w-[240px] bg-deepest/95 px-3 py-2 text-[11px] leading-snug text-white/80 ring-1 ring-white/10 backdrop-blur-xl sm:right-4">
                <div className="flex items-start gap-2">
                  <span>
                    {tileNotice.fellBack
                      ? tr(lang, 'basemapUnavailable').replace('%s', tr(lang, BASEMAP_LABEL[tileNotice.id]))
                      : tr(lang, 'basemapOffline')}
                  </span>
                  <button
                    onClick={() => setTileNotice(null)}
                    aria-label={tr(lang, 'close')}
                    className="-mr-1 -mt-1 grid h-5 w-5 flex-none place-items-center text-white/60 transition hover:text-white"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            {/* The empires are an overlay, not a sixth basemap: they work on
                whichever map is underneath. Sitting inside the basemap rail as
                a bare icon, they read as another basemap and stayed unfound —
                so they get their own labelled control below it. */}
            <button
              onClick={toggleBorders}
              title={tr(lang, 'empires')}
              // the visible label is hidden on phones, so name it explicitly
              aria-label={tr(lang, 'empires')}
              aria-pressed={borderYear !== null}
              className={`pointer-events-auto absolute right-3 top-[calc(50%+7.5rem)] z-[1100] flex items-center gap-2 px-2 py-2 ring-1 ring-white/10 backdrop-blur-xl transition sm:right-4 ${
                borderYear !== null ? 'bg-gold text-deep' : 'bg-deepest/95 text-white/70 hover:text-white'
              }`}
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 flex-none" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M4 18h16M5 18l-1.6-9 4.6 3.6L12 5l4 7.6 4.6-3.6L19 18" />
              </svg>
              <span className="bm-eyebrow hidden text-current sm:block">{tr(lang, 'bordersLayer')}</span>
            </button>

            {/* One time control at a time — the year slider takes the band while
                the empires are up, and the era filter comes back when it goes. */}
            {borderYear !== null ? (
              <YearSlider
                lang={lang}
                year={borderYear}
                onYear={setBorderYear}
                onClose={() => setBorderYear(null)}
                era={era}
                onEra={setEra}
                eraCounts={eraCounts}
                open={tlOpen}
                onToggle={() => setTlOpen((v) => !v)}
              />
            ) : (
              !heat && (
                <Timeline
                  lang={lang}
                  selected={era}
                  counts={eraCounts}
                  onSelect={setEra}
                  cumulative={cumulative}
                  onCumulative={() => setCumulative((v) => !v)}
                  open={tlOpen}
                  onToggle={() => setTlOpen((v) => !v)}
                />
              )
            )}

            {mode === 'present' && (
              <Suspense fallback={<ModeFallback />}>
                <Presentation
                key={`present-${navEpoch}`}
                places={places}
                lang={lang}
                initialBook={readingNav?.osis ?? null}
                initialChapter={readingNav?.chapter}
                onNavigate={setReadingNav}
                onOpenMedia={openMediaForRef}
                onExit={() => setMode(null)}
              />
              </Suspense>
            )}
            {mode === 'history' && (
              <Suspense fallback={<ModeFallback />}>
                <HistoryMode places={places} lang={lang} onExit={() => setMode(null)} />
              </Suspense>
            )}
            {mode === 'media' && (
              <Suspense fallback={<ModeFallback />}>
                <MediaMode
                  key={`media-${navEpoch}`}
                  places={places}
                  lang={lang}
                  initial={mediaNav}
                  onNavigate={setMediaNav}
                  onShowPlace={showPlaceFromGenealogy}
                  onOpenReading={openReading}
                  onExit={() => setMode(null)}
                />
              </Suspense>
            )}
            {mode === 'quiz' && (
              <Suspense fallback={<ModeFallback />}>
                <QuizMode places={places} lang={lang} onExit={() => setMode(null)} />
              </Suspense>
            )}
            {mode === 'journeys' && (
              <Suspense fallback={<ModeFallback />}>
                <JourneyMode
                key={`journeys-${navEpoch}`}
                places={places}
                lang={lang}
                onShowPlace={showPlaceFromGenealogy}
                initial={journeyNav}
                onNavigate={setJourneyNav}
                onOpenMission={() => setMode('mission')}
                onExit={() => setMode(null)}
              />
              </Suspense>
            )}
            {mode === 'mission' && (
              <Suspense fallback={<ModeFallback />}>
                <Mission
                key={`mission-${navEpoch}`}
                places={places}
                lang={lang}
                onShowPlace={showPlaceFromGenealogy}
                initial={missionNav}
                onNavigate={setMissionNav}
                onExit={() => setMode(null)}
              />
              </Suspense>
            )}
            {mode === 'church' && (
              <Suspense fallback={<ModeFallback />}>
                <ChurchMode
                key={`church-${navEpoch}`}
                lang={lang}
                onExit={() => {
                  setMode(null);
                  setChurchNav(null);
                }}
                initial={churchNav}
                onNavigate={setChurchNav}
                onOpenInTree={openPersonInTree}
                onOpenMission={() => setMode('mission')}
              />
              </Suspense>
            )}
            {mode === 'compare' && (
              <Suspense fallback={<ModeFallback />}>
                <CompareMode
                  key={`compare-${navEpoch}`}
                  places={places}
                  lang={lang}
                  initial={compareNav}
                  onNavigate={setCompareNav}
                  onExit={() => setMode(null)}
                />
              </Suspense>
            )}
            {mode === 'support' && (
              <Suspense fallback={<ModeFallback />}>
                <Support lang={lang} onLang={setLang} onExit={closeSupport} />
              </Suspense>
            )}
            {mode === 'credits' && (
              <Suspense fallback={<ModeFallback />}>
                <Credits lang={lang} onLang={setLang} onExit={() => setMode(null)} />
              </Suspense>
            )}
          </>
        )}


        <Header
          lang={lang}
          onLang={setLang}
          heat={heat}
          onHeat={setHeat}
          onMode={handleMode}
          view={view}
          onView={handleView}
          onHome={() => setAtStart(true)}
        />
      </div>
    </LangContext.Provider>
  );
}
