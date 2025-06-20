// ---- Main Entry Point ----
document.addEventListener('DOMContentLoaded', async () => {
  const accordionEl = document.getElementById('wikiAccordion');
  const searchEl = document.getElementById('search');
  const backToTopBtn = document.getElementById('backToTop');

  const items = await loadItems();
  renderList(items, accordionEl);
  openFromQuery();
  setupSearch(searchEl, items, accordionEl);
  setupBackToTop(backToTopBtn);
  setupQueryParams(accordionEl);
});

// ---- Data Loading ----
async function loadItems() {
  const res = await fetch('data/manifest.json');
  const files = await res.json();
  return Promise.all(
    files.filter(f => f !== 'sample.json')
      .map(f =>
        fetch(`data/entries/${f}`)
          .then(r => r.json())
          .then(data => {
            data._filename = f.replace('.json', '');
            return data;
          })
      )
  );
}

// ---- Event Listeners ----
function setupSearch(searchEl, items, accordionEl) {
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

function setupQueryParams(accordionEl) {
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

function setupBackToTop(backToTopBtn) {
  window.addEventListener('scroll', () => {
    backToTopBtn.style.display = window.scrollY > 50 ? 'block' : 'none';
  });
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ---- URL Param Handling ----
function openFromQuery() {
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

// ---- Main Render ----
function renderList(data, accordionEl) {
  accordionEl.innerHTML = '';
  data.forEach((item, index) => {
    accordionEl.insertAdjacentHTML('beforeend', renderItem(item, index));
  });
}

// ---- Item Templates ----
function renderItem(item, index) {
  const collapseId = `collapse-${index}`;
  const headingId = `heading-${index}`;
  const entryId = item._filename;

  return `
    <div class="accordion-item" data-entry="${entryId}">
      <h2 class="accordion-header" id="${headingId}">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${collapseId}" aria-expanded="false" aria-controls="${collapseId}">
          ${item.title}
        </button>
      </h2>
      <div id="${collapseId}" class="accordion-collapse collapse" aria-labelledby="${headingId}" data-bs-parent="#wikiAccordion">
        <div class="accordion-body">
            ${item.description ? `<p>${formatText(item.description)}</p>` : ''}
            ${renderListField(item.list)}
            ${renderImages(item.images)}
            ${item.created ? `<p class="text-muted small mb-2"><em>Created: ${item.created}</em></p>` : ''}
            ${item.tags ? `<p class="mt-2"><strong>Tags:</strong> ${item.tags.join(', ')}</p>` : ''}
        </div>
      </div>
    </div>`;
}

function renderListField(list) {
  if (!Array.isArray(list)) return '';
  return `<ul class="mb-0">${list.map(name => `<li>${name}</li>`).join('')}</ul>`;
}

function renderImages(images) {
  if (!Array.isArray(images)) return '';
  return `
    <div class="mt-3">
      <div class="d-flex flex-wrap gap-2 mt-2">
        ${images.map(src => `<img src="${src}" class="img-fluid rounded">`).join('')}
      </div>
    </div>`;
}

// ---- Text Formatter ----
function formatText(text) {
  const linkified = text.replace(
    /(https?:\/\/[^\s]+)/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
  );
  return linkified.replace(/\n/g, '<br>');
}
