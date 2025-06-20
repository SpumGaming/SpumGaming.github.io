/*
  Builds DOM objects
*/

import {formatText} from './utils.js';

export function buildItem(item, index) {
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

export function renderListField(list) {
  if (!Array.isArray(list)) return '';
  return `<ul class="mb-0">${list.map(name => `<li>${name}</li>`).join('')}</ul>`;
}

export function renderImages(images) {
  if (!Array.isArray(images)) return '';
  return `
    <div class="mt-3">
      <div class="d-flex flex-wrap gap-2 mt-2">
        ${images.map(src => `<img src="${src}" class="img-fluid rounded">`).join('')}
      </div>
    </div>`;
}