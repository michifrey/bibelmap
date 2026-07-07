import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import type { Lang } from '../i18n';
import { useT } from '../i18n';
import { GENO_GEO, type GeoKind } from '../data/genoGeo';
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

    for (const [id, geo] of Object.entries(GENO_GEO)) {
      if (!groups[geo.kind]) continue;
      const node = NODE_BY_ID[id];
      if (!node) continue;
      const color = node.line ? LINE_COLOR[node.line] : '#8a7a5c';
      const name = lang === 'de' ? node.de : node.en;
      const isTribe = geo.kind === 'tribe';

      const marker = L.circleMarker([geo.lat, geo.lon], {
        radius: isTribe ? 9 : 6,
        color: '#ffffff',
        weight: 2,
        fillColor: color,
        fillOpacity: 0.92,
      });

      // permanent labels for tribes (so one sees where they lived); hover for the rest
      marker.bindTooltip(name, {
        permanent: isTribe,
        direction: 'top',
        offset: [0, isTribe ? -8 : -4],
        className: 'geo-label',
      });

      const sub = node.people
        ? lang === 'de'
          ? node.people.de
          : node.people.en
        : node.region
          ? lang === 'de'
            ? node.region.de
            : node.region.en
          : '';
      const note = node.note ? (lang === 'de' ? node.note.de : node.note.en) : '';
      const html =
        `<div style="min-width:180px">` +
        `<div style="font-weight:700;color:#1f3d3a;font-size:14px">${name}</div>` +
        (sub ? `<div style="font-size:11px;color:#4a5754;margin-top:1px">${sub}</div>` : '') +
        (node.ref ? `<div style="font-size:10px;color:#8a8a8a;margin-top:1px">${node.ref}</div>` : '') +
        (note ? `<div style="font-size:12px;color:#20302e;margin-top:6px">${note}</div>` : '') +
        `<button data-open="${id}" style="margin-top:8px;cursor:pointer;border:0;border-radius:8px;background:#1f3d3a;color:#f7f1e6;font-size:12px;padding:5px 10px">${t('openInGenTree')}</button>` +
        `</div>`;
      marker.bindPopup(html);
      marker.addTo(layer);
      pts.push(L.latLng(geo.lat, geo.lon));
    }

    if (pts.length) {
      map.fitBounds(L.latLngBounds(pts).pad(0.15), { animate: false, maxZoom: 8 });
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
      {/* group toggles */}
      <div className="pointer-events-auto absolute right-3 top-3 z-[1000] flex flex-col gap-1 rounded-xl bg-cream/95 p-2 shadow-lg ring-1 ring-teal/10 backdrop-blur">
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
