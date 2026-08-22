import { useEffect, useMemo, useRef, useState } from 'react';
import type { Place } from './types';
import { LangContext, type Lang, useT, t as tr } from './i18n';
import { loadPlaces, placesInEra, placesInChapter, searchPlaces, erasForPlace, placeName } from './lib/places';
import { ERAS } from './data/eras';
import MapView, { type BasemapId } from './components/MapView';
import Header, { type Mode, type View } from './components/Header';
import Timeline from './components/Timeline';
import YearSlider from './components/YearSlider';
import SearchPanel from './components/SearchPanel';
import PlaceDetail from './components/PlaceDetail';
import Presentation from './components/Presentation';
import HistoryMode from './components/HistoryMode';
import Mission from './components/Mission';
import JourneyMode from './components/JourneyMode';
import QuizMode from './components/QuizMode';
import { formatRoute, parseHash, type Route } from './lib/deepLink';
import { searchStories, type SearchHit } from './lib/globalSearch';
import { parseRef } from './lib/parseRef';
import { bearing, compass, distanceKm, KM_PER_DAY } from './lib/route';
import CompareMode from './components/CompareMode';
import ChurchMode from './components/ChurchMode';
import GraphView from './components/GraphView';
import Genealogy from './components/Genealogy';
import Landing, { type LandingTarget } from './components/Landing';
import Support from './components/Support';

/** The support page is worth linking to from outside, so it lives on a hash. */
const SUPPORT_HASH = '#unterstuetzen';

/** Jede Ansicht ist verlinkbar: der Hash hält fest, wo man gerade steht. */
const INITIAL_ROUTE: Route | null = parseHash(window.location.hash);

function Loading() {
  const t = useT();
  return (
    <div className="flex h-full w-full items-center justify-center bg-deepest">
      <div className="flex flex-col items-center gap-3 text-white">
        <svg viewBox="0 0 24 24" className="h-8 w-8 animate-pulse" fill="currentColor">
          <path d="M12 2C8.7 2 6 4.7 6 8c0 4.4 6 12 6 12s6-7.6 6-12c0-3.3-2.7-6-6-6zm0 8.2A2.2 2.2 0 1 1 12 5.8a2.2 2.2 0 0 1 0 4.4z" />
        </svg>
        <span className="font-display text-sm">{t('loading')}</span>
      </div>
    </div>
  );
}

export default function App() {
  const [lang, setLang] = useState<Lang>('de');
  const [places, setPlaces] = useState<Place[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [heat, setHeat] = useState(false);
  const [era, setEra] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Place | null>(null);
  const [flyTo, setFlyTo] = useState<{ lat: number; lon: number; zoom?: number; key: number } | null>(null);
  const [mode, setMode] = useState<Mode | null>(INITIAL_ROUTE?.mode ?? null);
  const [basemap, setBasemap] = useState<BasemapId>('dark');
  const [view, setView] = useState<View>(INITIAL_ROUTE?.view ?? 'map');
  // The start page is the front door: it is what the app opens on, and the
  // wordmark in the header is the way back to it.
  const [atStart, setAtStart] = useState(!INITIAL_ROUTE);
  // Unterzustand der Nebenansichten, damit die Adresse ihn mitschreibt.
  const [journeyNav, setJourneyNav] = useState(INITIAL_ROUTE?.journey ?? null);
  const [missionNav, setMissionNav] = useState(INITIAL_ROUTE?.mission ?? null);
  const [readingNav, setReadingNav] = useState(INITIAL_ROUTE?.reading ?? null);
  // Zählt hoch, wenn die Adresse von außen kommt (Zurück-Taste, getippter Link):
  // die Nebenansichten hängen daran und übernehmen den Stand neu.
  const [navEpoch, setNavEpoch] = useState(0);
  const pendingPlace = useRef<string | null>(INITIAL_ROUTE?.placeId ?? null);
  const ownHash = useRef<string>(window.location.hash);
  // Cross-links between the time tree and the church-history map (shared data).
  const [treeFocus, setTreeFocus] = useState<string | null>(null);
  const [churchFocus, setChurchFocus] = useState<string | null>(null);
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
  function handleBasemap(id: BasemapId) {
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
    setMode(target === 'present' ? 'present' : null);
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
    setChurchFocus(id);
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
    if (m === 'church') setChurchFocus(null);
    setMode(m);
  }

  useEffect(() => {
    loadPlaces().then(setPlaces).catch((e) => setError(String(e)));
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
        });
    if (hash === window.location.hash) return;
    ownHash.current = hash;
    window.history.replaceState(null, '', hash || window.location.pathname + window.location.search);
  }, [atStart, view, mode, selected, journeyNav, missionNav, readingNav]);

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

  const visible = useMemo(() => (places ? placesInEra(places, era) : []), [places, era]);
  const results = useMemo(() => (places ? searchPlaces(places, query) : []), [places, query]);
  const stories = useMemo(() => searchStories(query, lang), [query, lang]);

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
          <Genealogy
            places={places}
            lang={lang}
            focusId={treeFocus}
            onShowOnMap={showPersonOnMap}
            onShowPlace={showPlaceFromGenealogy}
          />
        ) : view === 'graph' ? (
          <GraphView places={places} lang={lang} />
        ) : (
          <>
            <MapView
              places={visible}
              heat={heat}
              selectedId={selected?.id ?? null}
              lang={lang}
              onSelect={select}
              basemap={basemap}
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
                  <svg viewBox="0 0 24 24" className="h-4 w-4 flex-none text-white" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />
                  </svg>
                  <span className="flex-1 truncate text-sm text-white/60">
                    {selected ? placeName(selected, lang) : tr(lang, 'search')}
                  </span>
                  <svg viewBox="0 0 24 24" className={`h-4 w-4 flex-none text-white/60 transition-transform ${sheetOpen ? 'rotate-180' : ''}`} fill="currentColor">
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
                ['dark', 'M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z', 'basemapDark'],
                ['light', 'M3 12h18M12 3v18', 'basemapLight'],
                ['satellite', 'M12 2a10 10 0 100 20 10 10 0 000-20zM2 12h20M12 2c2.5 2.7 2.5 17.3 0 20M12 2c-2.5 2.7-2.5 17.3 0 20', 'basemapSatellite'],
                ['relief', 'M3 18l5-8 4 5 3-4 6 7z', 'basemapRelief'],
                ['antique', 'M9 3 4 5v16l5-2 6 2 5-2V3l-5 2-6-2zM9 3v16M15 5v16', 'basemapAntique'],
              ] as [BasemapId, string, 'basemapDark' | 'basemapLight' | 'basemapSatellite' | 'basemapRelief' | 'basemapAntique'][]).map(([id, icon, key]) => (
                <button
                  key={id}
                  onClick={() => handleBasemap(id)}
                  title={tr(lang, key)}
                  aria-label={tr(lang, key)}
                  className={`grid h-9 w-9 place-items-center transition ${ basemap === id ? 'bg-signal text-white ' : 'text-white/60 hover:bg-surface' }`}
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d={icon} />
                  </svg>
                </button>
              ))}

              {/* overlay, not a basemap — hence the rule above it */}
              <button
                onClick={toggleBorders}
                title={tr(lang, borderYear === null ? 'bordersOn' : 'bordersOff')}
                aria-label={tr(lang, borderYear === null ? 'bordersOn' : 'bordersOff')}
                aria-pressed={borderYear !== null}
                className={`mt-1 grid h-9 w-9 place-items-center border-t border-white/10 pt-1 transition ${
                  borderYear !== null ? 'bg-gold text-deep' : 'text-white/60 hover:bg-surface'
                }`}
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M4 18h16M5 18l-1.6-9 4.6 3.6L12 5l4 7.6 4.6-3.6L19 18" />
                </svg>
              </button>
            </div>

            {/* One time control at a time — the year slider takes the band while
                the empires are up, and the era filter comes back when it goes. */}
            {borderYear !== null ? (
              <YearSlider
                lang={lang}
                year={borderYear}
                onYear={setBorderYear}
                onClose={() => setBorderYear(null)}
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
                  open={tlOpen}
                  onToggle={() => setTlOpen((v) => !v)}
                />
              )
            )}

            {mode === 'present' && (
              <Presentation
                key={`present-${navEpoch}`}
                places={places}
                lang={lang}
                initialBook={readingNav?.osis ?? null}
                initialChapter={readingNav?.chapter}
                onNavigate={setReadingNav}
                onExit={() => setMode(null)}
              />
            )}
            {mode === 'history' && <HistoryMode places={places} lang={lang} onExit={() => setMode(null)} />}
            {mode === 'quiz' && <QuizMode places={places} lang={lang} onExit={() => setMode(null)} />}
            {mode === 'journeys' && (
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
            )}
            {mode === 'mission' && (
              <Mission
                key={`mission-${navEpoch}`}
                places={places}
                lang={lang}
                onShowPlace={showPlaceFromGenealogy}
                initial={missionNav}
                onNavigate={setMissionNav}
                onExit={() => setMode(null)}
              />
            )}
            {mode === 'church' && (
              <ChurchMode
                lang={lang}
                onExit={() => {
                  setMode(null);
                  setChurchFocus(null);
                }}
                initialFatherId={churchFocus}
                onOpenInTree={openPersonInTree}
                onOpenMission={() => setMode('mission')}
              />
            )}
            {mode === 'compare' && <CompareMode places={places} lang={lang} onExit={() => setMode(null)} />}
            {mode === 'support' && <Support lang={lang} onLang={setLang} onExit={closeSupport} />}
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
