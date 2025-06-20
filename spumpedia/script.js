document.addEventListener('DOMContentLoaded', () => {
    const accordionEl = document.getElementById('wikiAccordion');
    const searchEl = document.getElementById('search');
    let items = [];
  
    fetch('data/manifest.json')
      .then(res => res.json())
      .then(files => 
        Promise.all(
          files
            .filter(file => file !== 'sample.json') // 👈 Exclude this file
            .map(file => fetch(`data/entries/${file}`).then(r => r.json()))
        )
      )
      .then(data => {
        items = data;
        renderList(items);
      });
  
    searchEl.addEventListener('input', () => {
      const searchTerm = searchEl.value.toLowerCase();
      const filtered = items.filter(item =>
        (item.title && item.title.toLowerCase().includes(searchTerm)) ||
        (item.description && item.description.toLowerCase().includes(searchTerm)) ||
        (item.tags && item.tags.join(' ').toLowerCase().includes(searchTerm)) ||
        (item.list && item.list.some(name => name.toLowerCase().includes(searchTerm)))
      );
      
      renderList(filtered);
    });
  
    function renderList(data) {
        accordionEl.innerHTML = '';
        data.forEach((item, index) => {
            const collapseId = `collapse-${index}`;
            const headingId = `heading-${index}`;
      
            // Handle list rendering
            let listHtml = '';
            if (Array.isArray(item.list)) {
                listHtml = `<ul class="mb-0">` + item.list.map(name => `<li>${name}</li>`).join('') + `</ul>`;
            }

            // Optional image rendering
            let imageHtml = '';
            if (Array.isArray(item.images)) {
            imageHtml = `
                <div class="mt-3">
                <div class="d-flex flex-wrap gap-2 mt-2">
                    ${item.images.map(src => `<img src="${src}" class="img-fluid rounded">`).join('')}
                </div>
                </div>
            `;
            }
      
            const html = `
                <div class="accordion-item">
                <h2 class="accordion-header" id="${headingId}">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${collapseId}" aria-expanded="false" aria-controls="${collapseId}">
                    ${item.title}
                    </button>
                </h2>
                <div id="${collapseId}" class="accordion-collapse collapse" aria-labelledby="${headingId}" data-bs-parent="#wikiAccordion">
                    <div class="accordion-body">
                    ${item.description ? `<p>${formatText(item.description)}</p>` : ''}
                    ${listHtml}
                    ${imageHtml}
                    ${item.created ? `<p class="text-muted small mb-2"><em>Created: ${item.created}</em></p>` : ''}
                    ${item.tags ? `<p class="mt-2"><strong>Tags:</strong> ${item.tags.join(', ')}</p>` : ''}
                    </div>
                </div>
                </div>`;
            accordionEl.insertAdjacentHTML('beforeend', html);
        });
      }
      
      const formatText = (text) => {
        return text.replace(/\n/g, '<br>');
      };
      
  });
  