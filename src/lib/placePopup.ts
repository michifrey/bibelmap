import type { Place, PlaceImage } from '../types';
import { t, type Lang } from '../i18n';
import { erasForPlace, booksForPlace } from './places';
import { ERAS, ERA_BY_ID } from '../data/eras';
import { BOOK_BY_OSIS, bibleProjectUrl } from '../data/books';
import { resolveWikidataImage } from './wikidataImage';

const EXTERNAL_ICON =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3h7v7h-2V6.4l-9.3 9.3-1.4-1.4L17.6 5H14zM5 5h5v2H7v10h10v-3h2v5H5z"/></svg>';

const PIN_ICON =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C8.7 2 6 4.7 6 8c0 4.4 6 12 6 12s6-7.6 6-12c0-3.3-2.7-6-6-6zm0 8.2A2.2 2.2 0 1 1 12 5.8a2.2 2.2 0 0 1 0 4.4z"/></svg>';

function esc(s: string): string {
  return s.replace(
    /[&<>"]/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c] ?? c,
  );
}

function displayName(place: Place): string {
  return place.name.replace(/ \d+$/, '');
}

function imageHtml(img: PlaceImage, name: string): string {
  const credit = img.credit
    ? `<a class="bm-pop-credit" href="${esc(img.creditUrl ?? '#')}" target="_blank" rel="noreferrer">© ${esc(img.credit)}</a>`
    : '';
  return `<img src="${esc(img.url)}" alt="${esc(name)}" loading="lazy" referrerpolicy="no-referrer" />${credit}`;
}

function placeholderHtml(): string {
  return `<div class="bm-pop-noimg">${PIN_ICON}</div>`;
}

function linkHtml(href: string, label: string): string {
  return `<a class="bm-pop-link" href="${esc(href)}" target="_blank" rel="noreferrer">${esc(label)}${EXTERNAL_ICON}</a>`;
}

/**
 * Builds the rich on-map popup for a place: thumbnail, name, eras, the leading
 * Bible references and source links, plus a button that opens the full side
 * panel. The element is returned synchronously; a Wikidata image (if any) is
 * resolved lazily and swapped into the header once available.
 */
export function buildPlacePopup(place: Place, lang: Lang, onMore: () => void): HTMLElement {
  const name = displayName(place);
  const eraIds = new Set(erasForPlace(place));
  const eras = ERAS.filter((e) => eraIds.has(e.id));
  const books = booksForPlace(place);

  const typeChips = place.types
    .map((ty) => `<span class="bm-pop-chip">${esc(ty)}</span>`)
    .join('');
  const mentionLabel = place.mentionCount === 1 ? t(lang, 'mention') : t(lang, 'mentions');
  const eraChips = eras
    .map(
      (e) =>
        `<span class="bm-pop-era" style="background:${e.color}">${esc(lang === 'de' ? e.de : e.en)}</span>`,
    )
    .join('');

  const variantLine =
    place.variants.length > 1
      ? `<div class="bm-pop-variants"><span>${esc(t(lang, 'alsoCalled'))}:</span> ${esc(
          place.variants.slice(0, 4).join(' · '),
        )}</div>`
      : '';

  const verseChips = place.verses
    .slice(0, 6)
    .map((v) => {
      const book = BOOK_BY_OSIS[v.book];
      const era = book ? ERA_BY_ID[book.era] : null;
      const dot = era ? `<span class="bm-pop-dot" style="background:${era.color}"></span>` : '';
      return `<a class="bm-pop-ref" href="https://www.bible.com/search/bible?query=${encodeURIComponent(
        v.ref,
      )}" target="_blank" rel="noreferrer" title="${esc(v.ref)}">${dot}${esc(v.ref)}</a>`;
    })
    .join('');
  const moreRefs =
    place.verses.length > 6
      ? `<span class="bm-pop-morerefs">+${place.verses.length - 6}</span>`
      : '';
  const passages = verseChips
    ? `<div class="bm-pop-section-label">${esc(t(lang, 'passages'))}</div><div class="bm-pop-refs">${verseChips}${moreRefs}</div>`
    : '';

  const obUrl = `https://www.openbible.info/geo/ancient/${place.id}/${place.slug}`;
  const links = [
    linkHtml(obUrl, t(lang, 'openbible')),
    place.biblia ? linkHtml(place.biblia, t(lang, 'biblia')) : '',
    place.wikidata
      ? linkHtml(`https://www.wikidata.org/wiki/${place.wikidata}`, t(lang, 'wikipedia'))
      : '',
    books[0] ? linkHtml(bibleProjectUrl(books[0]), t(lang, 'video')) : '',
  ]
    .filter(Boolean)
    .join('');

  const el = document.createElement('div');
  el.className = 'bm-pop';
  el.innerHTML = `
    <div class="bm-pop-img" data-img>${place.img ? imageHtml(place.img, name) : placeholderHtml()}</div>
    <div class="bm-pop-body">
      <h3 class="bm-pop-title">${esc(name)}</h3>
      <div class="bm-pop-tags">
        ${typeChips}
        <span class="bm-pop-mentions">${place.mentionCount} ${esc(mentionLabel)}</span>
      </div>
      ${eraChips ? `<div class="bm-pop-eras">${eraChips}</div>` : ''}
      ${variantLine}
      ${passages}
      <div class="bm-pop-links">${links}</div>
      <button type="button" class="bm-pop-more" data-more>${esc(t(lang, 'details'))} ›</button>
    </div>`;

  const moreBtn = el.querySelector('[data-more]');
  moreBtn?.addEventListener('click', (ev) => {
    ev.preventDefault();
    onMore();
  });

  // Lazily resolve a Wikidata fallback image and swap it into the header.
  if (!place.img && place.wikidata) {
    const slot = el.querySelector('[data-img]');
    resolveWikidataImage(place.wikidata)
      .then((img) => {
        if (img && slot) slot.innerHTML = imageHtml(img, name);
      })
      .catch(() => {
        /* keep placeholder */
      });
  }

  return el;
}
