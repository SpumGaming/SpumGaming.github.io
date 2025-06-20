/*
    Shared utilities
*/

export async function loadItems() {
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
  
export function formatText(text) {
const linkified = text.replace(
    /(https?:\/\/[^\s]+)/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
);
return linkified.replace(/\n/g, '<br>');
}  