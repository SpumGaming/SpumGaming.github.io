/*
    Event handling
*/

import {renderList} from './compose.js';

export function setupSearch(searchEl, items, accordionEl) {
  searchEl.addEventListener('input', () => {
    const term = searchEl.value.toLowerCase();
    const filtered = items.filter(item =>
      (item.title && item.title.toLowerCase().includes(term)) ||
      (item.description && item.description.toLowerCase().includes(term)) ||
      (item.tags && item.tags.join(' ').toLowerCase().includes(term)) ||
      (item.list && item.list.some(name => name.toLowerCase().includes(term)))
    );
    renderList(filtered, accordionEl);
  });
}

export function setupQueryParams(accordionEl) {
  accordionEl.addEventListener('shown.bs.collapse', (event) => {
    const entry = event.target.closest('.accordion-item')?.getAttribute('data-entry');
    if (!entry) return;

    const newUrl = new URL(window.location);
    newUrl.searchParams.set('entry', entry);
    window.history.replaceState({}, '', newUrl);
  });
  accordionEl.addEventListener('hidden.bs.collapse', (event) => {
    if (!event.target.closest('.accordion-item')) return;

    const newUrl = new URL(window.location);
    newUrl.searchParams.delete('entry');
    window.history.replaceState({}, '', newUrl);
  });
}

export function setupBackToTop(backToTopBtn) {
  window.addEventListener('scroll', () => {
    backToTopBtn.style.display = window.scrollY > 50 ? 'block' : 'none';
  });
  backToTopBtn.addEventListener('click', () =>
    window.scrollTo({ top: 0, behavior: 'smooth' })
  );
}

export function openFromQuery() {
  const urlParams = new URLSearchParams(window.location.search);
  const entryToOpen = urlParams.get('entry');
  if (!entryToOpen) return;

  const item = document.querySelector(`[data-entry="${entryToOpen}"] .accordion-button`);
  if (!item) return;

  item.click();
  setTimeout(() => {
    window.scrollTo({ top: 0, behavior: 'instant' }); // Reset position
    item.scrollIntoView({ behavior: 'smooth', block: 'start' }); // Scroll into view
  }, 200);
}