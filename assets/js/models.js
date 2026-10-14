document.addEventListener('DOMContentLoaded', function(){
  const list = document.getElementById('modelsList');
  const typeFilter = document.getElementById('typeFilter');
  const search = document.getElementById('search');

  fetch('../assets/data/cars.json').then(res => res.json()).then(data => {
    window._cars = data; // expose for debug
    populateFilter(data);
    renderList(data);
  }).catch(err => {
    list.innerHTML = '<p>Nu s-au putut încărca modelele.</p>';
    console.error(err);
  });

  function populateFilter(data){
    const types = [...new Set(data.map(c=>c.type))];
    types.forEach(t => {
      const opt = document.createElement('option'); opt.value = t; opt.textContent = t; typeFilter.appendChild(opt);
    });
  }

  function renderList(data){
    list.innerHTML = '';
    data.forEach((c, idx) => {
      const card = document.createElement('article');
      card.className = 'model-card';
      card.dataset.id = c.id;
      card.innerHTML = `
        <img src="${c.img}" alt="${c.brand} ${c.model}">
        <h3>${c.brand} ${c.model}</h3>
        <p>${c.year} — ${c.type}</p>
        <div class="model-meta"><span class="price">${c.price} €</span><span class="rank">#${idx+1}</span></div>
      `;

      card.addEventListener('click', function(ev){
        ev.currentTarget.classList.toggle('expanded');
        const cs = getComputedStyle(card);
        if (document.getElementById('contactMsg')){
          document.getElementById('contactMsg').textContent = `Card width: ${cs.width}`;
          setTimeout(()=>{ document.getElementById('contactMsg').textContent = ''; }, 2000);
        }
      });

      list.appendChild(card);
    });
  }

  typeFilter.addEventListener('change', applyFilters);
  search.addEventListener('input', debounce(applyFilters, 200));

  function applyFilters(){
    const type = typeFilter.value;
    const q = (search.value||'').toLowerCase().trim();
    const filtered = (window._cars||[]).filter(c => {
      return (!type || c.type === type) && ( !q || (c.brand + ' ' + c.model).toLowerCase().includes(q) );
    });
    renderList(filtered);
  }

  function debounce(fn, wait){
    let t;
    return function(...args){ clearTimeout(t); t = setTimeout(()=>fn.apply(this,args), wait); }
  }
});