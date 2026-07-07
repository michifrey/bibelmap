import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import type { Lang } from '../i18n';
import { useT } from '../i18n';
import { GENO_GEO, type GeoKind } from '../data/genoGeo';
import { TRIBE_AREAS } from '../data/tribeAreas';
import { NODE_BY_ID, LINE_COLOR } from '../data/nationsTribes';
import { BASEMAPS } from './MapView';

interface Props {
  lang: Lang;
  onOpenInTree: (id: string) => void;
}

const KIND_LABEL: Record<GeoKind, { de: string; en: string }> = {
  tribe: { de: 'Stämme Israels', en: 'Tribes of Israel' },
  people: { de: 'Völker (Völkertafel)', en: 'Nations (Table of Nations)' },
  person: { de: 'Personen der Linie', en: 'People of the line' },
};

export default function TribesMap({ lang, onOpenInTree }: Props) {
  const t = useT();
  const elRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);
  // Default to the tribes only, so the map focuses on Israel and their labels
  // stay readable; peoples (worldwide) and persons are opt-in.
  const [groups, setGroups] = useState<Record<GeoKind, boolean>>({ tribe: true, people: false, person: false });

  // init map once
  useEffect(() => {
    if (!elRef.current || mapRef.current) return;
    const map = L.map(elRef.current, { center: [32, 35.3], zoom: 7, zoomControl: true, worldCopyJump: true });
    const bm = BASEMAPS.light;
    L.tileLayer(bm.url, { attribution: bm.attribution, subdomains: bm.subdomains ?? 'abc', maxZoom: bm.maxZoom }).addTo(map);
    layerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // (re)draw markers on group/lang change
  useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!map || !layer) return;
    layer.clearLayers();
    const pts: L.LatLng[] = [];

    // popup HTML for a node
    const popupFor = (id: string): string => {
      const node = NODE_BY_ID[id];
      if (!node) return '';
      const name = lang === 'de' ? node.de : node.en;
      const sub = node.people
        ? lang === 'de' ? node.people.de : node.people.en
        : node.region
          ? lang === 'de' ? node.region.de : node.region.en
          : '';
      const note = node.note ? (lang === 'de' ? node.note.de : node.note.en) : '';
      return (
        `<div style="min-width:180px">` +
        `<div style="font-weight:700;color:#1f3d3a;font-size:14px">${name}</div>` +
        (sub ? `<div style="font-size:11px;color:#4a5754;margin-top:1px">${sub}</div>` : '') +
        (node.ref ? `<div style="font-size:10px;color:#8a8a8a;margin-top:1px">${node.ref}</div>` : '') +
        (note ? `<div style="font-size:12px;color:#20302e;margin-top:6px">${note}</div>` : '') +
        `<button data-open="${id}" style="margin-top:8px;cursor:pointer;border:0;border-radius:8px;background:#1f3d3a;color:#f7f1e6;font-size:12px;padding:5px 10px">${t('openInGenTree')}</button>` +
        `</div>`
      );
    };

    // ---- Tribes as filled AREAS (polygons), one colour each ----------------
    if (groups.tribe) {
      for (const [id, area] of Object.entries(TRIBE_AREAS)) {
        const node = NODE_BY_ID[id];
        if (!node) continue;
        const name = lang === 'de' ? node.de : node.en;
        const poly = L.polygon(area.polygon, {
          color: area.color,
          weight: 1.5,
          fillColor: area.color,
          fillOpacity: 0.32,
        });
        poly.bindTooltip(name, { permanent: true, direction: 'center', className: 'geo-label' });
        poly.bindPopup(popupFor(id));
        poly.addTo(layer);
        for (const [la, lo] of area.polygon) pts.push(L.latLng(la, lo));
      }
      // tribes without a mapped territory (Levi) stay as a labelled point
      for (const [id, geo] of Object.entries(GENO_GEO)) {
        if (geo.kind !== 'tribe' || TRIBE_AREAS[id]) continue;
        const node = NODE_BY_ID[id];
        if (!node) continue;
        const m = L.circleMarker([geo.lat, geo.lon], {
          radius: 6, color: '#fff', weight: 2, fillColor: node.line ? LINE_COLOR[node.line] : '#8a7a5c', fillOpacity: 0.9,
        });
        m.bindTooltip(lang === 'de' ? node.de : node.en, { direction: 'top', offset: [0, -4], className: 'geo-label' });
        m.bindPopup(popupFor(id));
        m.addTo(layer);
        pts.push(L.latLng(geo.lat, geo.lon));
      }
    }

    // ---- Peoples & persons as points --------------------------------------
    for (const [id, geo] of Object.entries(GENO_GEO)) {
      if (geo.kind === 'tribe' || !groups[geo.kind]) continue;
      const node = NODE_BY_ID[id];
      if (!node) continue;
      const marker = L.circleMarker([geo.lat, geo.lon], {
        radius: 6,
        color: '#ffffff',
        weight: 2,
        fillColor: node.line ? LINE_COLOR[node.line] : '#8a7a5c',
        fillOpacity: 0.92,
      });
      marker.bindTooltip(lang === 'de' ? node.de : node.en, { direction: 'top', offset: [0, -4], className: 'geo-label' });
      marker.bindPopup(popupFor(id));
      marker.addTo(layer);
      pts.push(L.latLng(geo.lat, geo.lon));
    }

    if (pts.length) {
      map.fitBounds(L.latLngBounds(pts).pad(0.12), { animate: false, maxZoom: 8 });
    }
  }, [groups, lang, t]);

  // open a node in the tree from a popup button
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const handler = (e: L.PopupEvent) => {
      const btn = (e.popup as unknown as { _contentNode?: HTMLElement })._contentNode?.querySelector<HTMLButtonElement>('[data-open]');
      if (btn) btn.onclick = () => onOpenInTree(btn.dataset.open!);
    };
    map.on('popupopen', handler);
    return () => {
      map.off('popupopen', handler);
    };
  }, [onOpenInTree]);

  return (
    <div className="relative h-full w-full">
      <div ref={elRef} className="h-full w-full" />
      {/* group toggles — sit below the app header + sub-tabs */}
      <div className="pointer-events-auto absolute right-3 top-16 z-[1000] flex flex-col gap-1 rounded-xl bg-cream/95 p-2 shadow-lg ring-1 ring-teal/10 backdrop-blur sm:top-20">
        {(Object.keys(KIND_LABEL) as GeoKind[]).map((k) => (
          <label key={k} className="flex cursor-pointer items-center gap-2 px-1 text-[12px] text-ink">
            <input
              type="checkbox"
              checked={groups[k]}
              onChange={(e) => setGroups((g) => ({ ...g, [k]: e.target.checked }))}
              className="accent-[var(--color-teal)]"
            />
            {lang === 'de' ? KIND_LABEL[k].de : KIND_LABEL[k].en}
          </label>
        ))}
      </div>
    </div>
  );
}
