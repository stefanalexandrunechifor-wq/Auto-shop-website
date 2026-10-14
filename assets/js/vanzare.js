
function previewImages(files) {
    const preview = document.getElementById('photoPreview');
    if (!preview) return;
    preview.innerHTML = '';
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = e => {
        const img = document.createElement('img');
        img.src = e.target.result;
        img.style.maxWidth = '120px';
        img.style.margin = '5px';
        img.alt = file.name;
        preview.appendChild(img);
      };
      reader.readAsDataURL(file);
    });
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    const files = document.getElementById('photo').files;
    const promises = Array.from(files).filter(f => f.type.startsWith('image/')).map(file => new Promise(res => {
      const reader = new FileReader();
      reader.onload = ev => res(ev.target.result);
      reader.readAsDataURL(file);
    }));
    Promise.all(promises).then(images => {
      const formData = {
        nume: document.getElementById('nume')?.value || '',
        CNP: document.getElementById('CNP')?.value || '',
        dob: document.getElementById('dob')?.value || '',
        credit: document.getElementById('credit')?.value || '',
        tip: document.getElementById('tip')?.value || '',
        model: document.getElementById('model')?.value || '',
        stare: document.getElementById('stare')?.value || '',
        km: document.getElementById('km')?.value || '',
        fabricatie: document.getElementById('fabricatie')?.value || '',
        phone: document.getElementById('phone')?.value || '',
        email: document.getElementById('email')?.value || '',
        website: document.getElementById('website')?.value || '',
        details: document.getElementById('details')?.value || ''
      };
      try {
        localStorage.setItem('vanzare_form', JSON.stringify(formData));
        localStorage.setItem('vanzare_images', JSON.stringify(images));
      } catch (err) {
        console.warn('Eroare la salvarea în localStorage:', err);
      }

      if (saveSubmissionForCurrentUser(formData, images)) {
        localStorage.removeItem('vanzare_pending');
        window.location.href = 'confirmare.html';
      } else {
        localStorage.setItem('vanzare_pending', '1');
        window.location.href = 'login.html?next=confirmare.html';
      }
    });
  }

  function loadSavedImages() {
    const saved = localStorage.getItem('vanzare_images');
    if (!saved) return;
    const arr = JSON.parse(saved);
    const preview = document.getElementById('photoPreview');
    if (!preview) return;
    preview.innerHTML = '';
    arr.forEach(src => {
      const img = document.createElement('img');
      img.src = src;
      img.style.maxWidth = '120px';
      img.style.margin = '5px';
      preview.appendChild(img);
    });
  }
  function loadSavedForm() {
    const saved = localStorage.getItem('vanzare_form');
    if (!saved) return;
    let data;
    try { data = JSON.parse(saved); } catch (e) { return; }
    document.getElementById('nume').value = data.nume || '';
    document.getElementById('CNP').value = data.CNP || '';
    document.getElementById('dob').value = data.dob || '';
    if (data.credit !== undefined) {
      document.getElementById('credit').value = data.credit;
      const creditValue = document.getElementById('creditValue');
      if (creditValue) creditValue.textContent = data.credit;
    }
    document.getElementById('tip').value = data.tip || '';
    document.getElementById('model').value = data.model || '';
    document.getElementById('stare').value = data.stare || '';
    document.getElementById('km').value = data.km || '';
    document.getElementById('fabricatie').value = data.fabricatie || '';
    document.getElementById('phone').value = data.phone || '';
    document.getElementById('email').value = data.email || '';
    document.getElementById('website').value = data.website || '';
    document.getElementById('details').value = data.details || '';

    if (localStorage.getItem('vanzare_edit') === '1') {
      localStorage.removeItem('vanzare_edit');
      const first = document.getElementById('nume');
      if (first) first.focus();
    }
  }

  function getCurrentUser(){ return localStorage.getItem('vanzare_current_user'); }
  function setCurrentUser(u){ localStorage.setItem('vanzare_current_user', u); }
  function logoutUser(){ localStorage.removeItem('vanzare_current_user'); showUserStatus(); }

  function showUserStatus(){
    const info = document.getElementById('userInfo');
    if (!info) return;
    const user = getCurrentUser();
    if (user) {
      info.innerHTML = 'Conectat ca <strong>' + user + '</strong> <button id="logoutBtn">Deconectare</button> <a href="profil.html">Profil</a>';
      const btn = document.getElementById('logoutBtn');
      if (btn) btn.addEventListener('click', function(){ logoutUser(); });
    } else {
      info.innerHTML = '<a href="login.html">Logare / Înregistrare</a>';
    }
  }

  function saveSubmissionForCurrentUser(formData, images){
    const user = getCurrentUser();
    if (!user) return false;
    const subsJson = localStorage.getItem('vanzare_submissions');
    const subs = subsJson ? JSON.parse(subsJson) : {};
    subs[user] = subs[user] || [];
    const entry = { id: Date.now(), timestamp: new Date().toISOString(), form: formData, images };
    subs[user].push(entry);
    localStorage.setItem('vanzare_submissions', JSON.stringify(subs));
    localStorage.setItem('vanzare_last_id', entry.id.toString());
    return true;
  }

  document.addEventListener('DOMContentLoaded', function(){
    loadSavedImages();
    loadSavedForm();
    showUserStatus();
  });