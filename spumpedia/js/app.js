/*
    Main entry point, does setup
*/

import { loadItems } from './utils.js';
import {renderList} from './compose.js';
import {setupSearch, setupQueryParams, setupBackToTop, openFromQuery} from './handlers.js';

document.addEventListener('DOMContentLoaded', async () => {
  const items = await loadItems();
  const accordionEl = document.getElementById('wikiAccordion');
  const searchEl = document.getElementById('search');
  const backToTopBtn = document.getElementById('backToTop');

  // Initial render
  renderList(items, accordionEl);
  openFromQuery();

  // Event handlers
  setupSearch(searchEl, items, accordionEl);
  setupQueryParams(accordionEl);
  setupBackToTop(backToTopBtn);
});