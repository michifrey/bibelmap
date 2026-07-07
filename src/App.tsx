import { useEffect, useMemo, useState } from 'react';
import type { Place } from './types';
import { LangContext, type Lang, useT, t as tr } from './i18n';
import { loadPlaces, placesInEra, searchPlaces, erasForPlace } from './lib/places';
import { ERAS } from './data/eras';
import MapView, { type BasemapId } from './components/MapView';
import Header, { type Mode, type View } from './components/Header';
import Timeline from './components/Timeline';
import SearchPanel from './components/SearchPanel';
import PlaceDetail from './components/PlaceDetail';
import Presentation from './components/Presentation';
import HistoryMode from './components/HistoryMode';
import CompareMode from './components/CompareMode';
import ChurchMode from './components/ChurchMode';
import TreeView from './components/TreeView';
import GraphView from './components/GraphView';
import Genealogy from './components/Genealogy';

function Loading() {
  const t = useT();
  return (
    <div className="flex h-full w-full items-center justify-center bg-cream">
      <div className="flex flex-col items-center gap-3 text-teal">
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
  const [mode, setMode] = useState<Mode | null>(null);
  const [basemap, setBasemap] = useState<BasemapId>('light');
  const [view, setView] = useState<View>('map');
  // Cross-links between the time tree and the church-history map (shared data).
  const [treeFocus, setTreeFocus] = useState<string | null>(null);
  const [churchFocus, setChurchFocus] = useState<string | null>(null);
  // Mobile-only: bottom-sheet (search/detail) and timeline are collapsible so
  // the map stays usable on small screens. Desktop ignores these.
  const [sheetOpen, setSheetOpen] = useState(false);
  const [tlOpen, setTlOpen] = useState(false);

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
    if (m === 'church') setChurchFocus(null);
    setMode(m);
  }

  useEffect(() => {
    loadPlaces().then(setPlaces).catch((e) => setError(String(e)));
  }, []);

  const visible = useMemo(() => (places ? placesInEra(places, era) : []), [places, era]);
  const results = useMemo(() => (places ? searchPlaces(places, query) : []), [places, query]);
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
      <div className="flex h-full items-center justify-center bg-cream p-6 text-center text-sm text-ink-soft">
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

  return (
    <LangContext.Provider value={lang}>
      <div className="relative h-full w-full overflow-hidden">
        {view === 'tree' ? (
          <TreeView
            lang={lang}
            focusId={treeFocus}
            onShowOnMap={showPersonOnMap}
            onOpenNations={() => setMode('nations')}
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
            />

            {/* Search / detail — left rail on desktop, bottom sheet on mobile */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1110] flex flex-col p-2 sm:inset-y-0 sm:left-0 sm:right-auto sm:z-[1100] sm:w-full sm:max-w-[22rem] sm:p-4 sm:pt-24">
              <div className="pointer-events-auto flex min-h-0 flex-col overflow-hidden rounded-2xl bg-cream/90 shadow-2xl ring-1 ring-white/40 backdrop-blur-xl sm:flex-1 sm:rounded-3xl">
                {/* mobile peek / grab handle */}
                <button
                  onClick={() => setSheetOpen((v) => !v)}
                  className="flex items-center gap-2 border-b border-teal/10 px-3 py-2 text-left sm:hidden"
                  aria-label={tr(lang, 'search')}
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4 flex-none text-teal" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />
                  </svg>
                  <span className="flex-1 truncate text-sm text-ink-soft">
                    {selected ? selected.name.replace(/ \d+$/, '') : tr(lang, 'search')}
                  </span>
                  <svg viewBox="0 0 24 24" className={`h-4 w-4 flex-none text-ink-soft transition-transform ${sheetOpen ? 'rotate-180' : ''}`} fill="currentColor">
                    <path d="M7 14l5-5 5 5z" />
                  </svg>
                </button>
                <div className={`min-h-0 flex-col overflow-hidden ${sheetOpen ? 'flex max-h-[58vh]' : 'hidden'} sm:flex sm:max-h-none sm:flex-1`}>
                  {selected ? (
                    <PlaceDetail place={selected} lang={lang} onClose={() => setSelected(null)} />
                  ) : (
                    <SearchPanel
                      query={query}
                      onQuery={setQuery}
                      results={results}
                      topPlaces={topPlaces}
                      onSelect={select}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* basemap switcher (right edge) */}
            <div className="pointer-events-auto absolute right-3 top-1/2 z-[1100] flex -translate-y-1/2 flex-col gap-1 rounded-2xl bg-cream/80 p-1 shadow-xl ring-1 ring-white/40 backdrop-blur-xl sm:right-4">
              {([
                ['light', 'M3 12h18M12 3v18', 'basemapLight'],
                ['satellite', 'M12 2a10 10 0 100 20 10 10 0 000-20zM2 12h20M12 2c2.5 2.7 2.5 17.3 0 20M12 2c-2.5 2.7-2.5 17.3 0 20', 'basemapSatellite'],
                ['relief', 'M3 18l5-8 4 5 3-4 6 7z', 'basemapRelief'],
                ['antique', 'M9 3 4 5v16l5-2 6 2 5-2V3l-5 2-6-2zM9 3v16M15 5v16', 'basemapAntique'],
              ] as [BasemapId, string, 'basemapLight' | 'basemapSatellite' | 'basemapRelief' | 'basemapAntique'][]).map(([id, icon, key]) => (
                <button
                  key={id}
                  onClick={() => setBasemap(id)}
                  title={tr(lang, key)}
                  aria-label={tr(lang, key)}
                  className={`grid h-9 w-9 place-items-center rounded-xl transition ${
                    basemap === id ? 'bg-teal text-cream shadow' : 'text-ink-soft hover:bg-cream-2'
                  }`}
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d={icon} />
                  </svg>
                </button>
              ))}
            </div>

            {!heat && (
              <Timeline
                lang={lang}
                selected={era}
                counts={eraCounts}
                onSelect={setEra}
                open={tlOpen}
                onToggle={() => setTlOpen((v) => !v)}
              />
            )}

            {mode === 'present' && <Presentation places={places} lang={lang} onExit={() => setMode(null)} />}
            {mode === 'history' && <HistoryMode places={places} lang={lang} onExit={() => setMode(null)} />}
            {mode === 'church' && (
              <ChurchMode
                lang={lang}
                onExit={() => {
                  setMode(null);
                  setChurchFocus(null);
                }}
                initialFatherId={churchFocus}
                onOpenInTree={openPersonInTree}
              />
            )}
            {mode === 'compare' && <CompareMode places={places} lang={lang} onExit={() => setMode(null)} />}
          </>
        )}

        {/* Völkertafel & Stämme + Stämme-Karte — reachable from the Zeitbaum, so
            genealogy has a single home. Overlays whatever view is active. */}
        {mode === 'nations' && (
          <Genealogy
            places={places}
            lang={lang}
            onShowPlace={showPlaceFromGenealogy}
            onExit={() => setMode(null)}
          />
        )}

        <Header
          lang={lang}
          onLang={setLang}
          heat={heat}
          onHeat={setHeat}
          onMode={handleMode}
          view={view}
          onView={handleView}
        />
      </div>
    </LangContext.Provider>
  );
}
