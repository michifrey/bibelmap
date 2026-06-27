import { useEffect, useMemo, useState } from 'react';
import type { Place } from './types';
import { LangContext, type Lang, useT } from './i18n';
import { loadPlaces, placesInEra, searchPlaces, erasForPlace } from './lib/places';
import { ERAS } from './data/eras';
import MapView from './components/MapView';
import Header from './components/Header';
import Timeline from './components/Timeline';
import SearchPanel from './components/SearchPanel';
import PlaceDetail from './components/PlaceDetail';
import Presentation from './components/Presentation';
import TreeView from './components/TreeView';

type View = 'map' | 'tree';

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
  const [present, setPresent] = useState(false);
  const [view, setView] = useState<View>('map');

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
    setFlyTo({ lat: p.lat, lon: p.lon, zoom: 9, key: Date.now() });
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
          <TreeView lang={lang} />
        ) : (
          <>
            <MapView
              places={visible}
              heat={heat}
              selectedId={selected?.id ?? null}
              onSelect={select}
              flyTo={flyTo}
            />

            {/* Left panel */}
            <div className="pointer-events-none absolute inset-y-0 left-0 z-[1100] flex w-full max-w-[22rem] flex-col p-3 pt-20 sm:p-4 sm:pt-24">
              <div className="pointer-events-auto flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl bg-cream/92 shadow-2xl ring-1 ring-teal/10 backdrop-blur">
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

            {!heat && <Timeline lang={lang} selected={era} counts={eraCounts} onSelect={setEra} />}

            {/* mobile present button */}
            <button
              onClick={() => setPresent(true)}
              className="absolute bottom-4 right-4 z-[1100] grid h-12 w-12 place-items-center rounded-full bg-teal text-cream shadow-xl ring-1 ring-teal/20 transition hover:bg-teal-2 sm:hidden"
              aria-label="Präsentationsmodus"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                <path d="M4 5h16v10H4zm0 12h16v2H4zm6-9v6l5-3z" />
              </svg>
            </button>
          </>
        )}

        <Header
          lang={lang}
          onLang={setLang}
          heat={heat}
          onHeat={setHeat}
          onPresent={() => setPresent(true)}
          view={view}
          onView={setView}
        />

        {present && (
          <Presentation places={places} lang={lang} onExit={() => setPresent(false)} />
        )}
      </div>
    </LangContext.Provider>
  );
}
