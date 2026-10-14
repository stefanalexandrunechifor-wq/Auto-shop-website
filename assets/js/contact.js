document.addEventListener('DOMContentLoaded', init);

function init(){
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', handleSubmit);

  loadMessages();

  const logo = document.querySelector('.logo');
  if (logo){
    setInterval(()=>{
      logo.style.transition = 'background-color 0.8s ease, transform 0.6s 0.1s ease';
      logo.style.backgroundColor = randomHsl(40,60);
      logo.style.transform = `rotate(${Math.floor(Math.random()*7)-3}deg)`;
    }, 4000);
  }
}

function handleSubmit(e){
  e.preventDefault();
  clearErrors();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const message = document.getElementById('message').value.trim();

  const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRx = /^\d{10}$/; 
  const nameRx = /^.{2,}$/;

  const errors = [];
  if (!nameRx.test(name)) errors.push({field:'name', msg:'Numele are nevoie de minim 2 caractere.'});
  if (!emailRx.test(email)) errors.push({field:'email', msg:'Email invalid.'});
  if (phone && !phoneRx.test(phone)) errors.push({field:'phone', msg:'Telefon invalid (10 cifre).'});
  if (message.length < 5) errors.push({field:'message', msg:'Mesaj prea scurt.'});

  if (errors.length){
    showFieldErrors(errors);
    showTempMsg('Verifică câmpurile marcate.', 'error');
    return;
  }

  const entry = {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    name, email, phone, message
  };
  const arr = JSON.parse(localStorage.getItem('contact_messages') || '[]');
  arr.push(entry);
  localStorage.setItem('contact_messages', JSON.stringify(arr));

  addMessageToList(entry);
  showTempMsg('Mesaj trimis. Mulțumim!', 'success');
  e.currentTarget.reset();
}

function showFieldErrors(list){
  list.forEach(err => {
    const el = document.getElementById(err.field);
    if (!el) return;
    el.classList.add('error');
    const small = document.createElement('small');
    small.className = 'field-error';
    small.textContent = err.msg;
    el.parentNode.insertBefore(small, el.nextSibling);
  });
}
function clearErrors(){
  document.querySelectorAll('.field-error').forEach(n=>n.remove());
  document.querySelectorAll('.error').forEach(n=>n.classList.remove('error'));
}

function showTempMsg(text, type){
  const box = document.getElementById('contactMsg');
  if (!box) return;
  box.textContent = text;
  box.className = type;
  setTimeout(()=>{ box.textContent = ''; box.className = ''; }, 3000);
}

function addMessageToList(entry){
  const container = document.getElementById('savedMessages') || createSavedSection();
  const card = document.createElement('article');
  card.className = 'message-card';
  card.dataset.id = entry.id;

  const preview = entry.message.length > 80 ? entry.message.slice(0,80) + '...' : entry.message;
  card.innerHTML = `
    <header class="msg-header"><strong>${escapeHtml(entry.name)}</strong>
      <time datetime="${entry.timestamp}">${new Date(entry.timestamp).toLocaleString()}</time>
    </header>
    <div class="msg-body"><p>${escapeHtml(preview)}</p></div>
    <footer class="msg-actions">
      <button class="btn-small show-full">Citește</button>
      <button class="btn-small inspect">Inspect</button>
      <button class="btn-small delete">Șterge</button>
    </footer>`;

  card.style.backgroundColor = randomHsl(55,80);
  container.prepend(card);

  card.addEventListener('click', function(ev){
    if (card.classList.contains('open')){
      card.classList.remove('open');
      const body = card.querySelector('.msg-body');
      body.innerHTML = `<p>${escapeHtml(entry.message.length > 80 ? entry.message.slice(0,80) + '...' : entry.message)}</p>`;
    } else {
      card.classList.add('open');
      const body = card.querySelector('.msg-body');
      body.innerHTML = `<p>${escapeHtml(entry.message)}</p>`;
      const cs = getComputedStyle(card);
      const info = document.createElement('small');
      info.className = 'computed-info';
      info.textContent = `Culoare (computed): ${cs.backgroundColor}`;
      body.appendChild(info);
    }
  });

  const showBtn = card.querySelector('.show-full');
  showBtn.addEventListener('click', function(ev){
    ev.stopPropagation();
    const body = card.querySelector('.msg-body');
    body.innerHTML = `<p>${escapeHtml(entry.message)}</p>`;
  });

  const inspectBtn = card.querySelector('.inspect');
  inspectBtn.addEventListener('click', function(ev){
    ev.stopPropagation();
    const cs = getComputedStyle(card);
    showTempMsg(`Card background: ${cs.backgroundColor}`, 'info');
  });

  const delBtn = card.querySelector('.delete');
  delBtn.addEventListener('click', function(ev){
    ev.stopPropagation();
    const confirmed = confirm('Ștergi mesajul?');
    if (!confirmed) return;
    const id = Number(card.dataset.id);
    let arr = JSON.parse(localStorage.getItem('contact_messages') || '[]');
    arr = arr.filter(m => m.id !== id);
    localStorage.setItem('contact_messages', JSON.stringify(arr));
    card.remove();
    showTempMsg('Mesaj șters', 'info');
  });
}

function loadMessages(){
  const arr = JSON.parse(localStorage.getItem('contact_messages') || '[]');
  arr.slice().reverse().forEach(addMessageToList);
}

function createSavedSection(){
  const sec = document.createElement('section');
  sec.id = 'savedMessages';
  sec.className = 'saved-messages';
  const h = document.createElement('h2');
  h.textContent = 'Mesaje primite';
  sec.appendChild(h);
  const main = document.querySelector('main') || document.body;
  main.appendChild(sec);
  return sec;
}

function randomHsl(minL=45, maxL=70){
  const h = Math.floor(Math.random()*360);
  const s = Math.floor(Math.random()*20)+60;
  const l = Math.floor(Math.random()*(maxL-minL))+minL;
  return `hsl(${h} ${s}% ${l}%)`;
}

function escapeHtml(s){
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
