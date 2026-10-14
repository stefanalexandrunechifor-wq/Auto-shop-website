 function getCurrentUser(){ return localStorage.getItem('vanzare_current_user'); }
      function requireLogin(){ if(!getCurrentUser()){ window.location.href = 'login.html?next=profil.html'; } }
      function loadSubs(){
        const user = getCurrentUser();
        const box = document.getElementById('userInfo');
        box.textContent = 'Conectat ca: ' + user;

        const debugEl = document.getElementById('debugInfo');
        const debugToggle = document.getElementById('debugToggle');
        if (debugToggle && debugEl) {
          debugToggle.onclick = function(){
            if (debugEl.style.display === 'none') {
              const subsAll = localStorage.getItem('vanzare_submissions');
              debugEl.textContent = subsAll ? JSON.stringify(JSON.parse(subsAll), null, 2) : 'Nici o înregistrare găsită în localStorage.';
              debugEl.style.display = 'block';
              debugToggle.textContent = 'Ascunde debug';
            } else {
              debugEl.style.display = 'none';
              debugToggle.textContent = 'Arată debug';
            }
          };
        }

        const purchasesJson = localStorage.getItem('vanzare_purchases');
        const purchasesAll = purchasesJson ? JSON.parse(purchasesJson) : {};
        const myPurch = purchasesAll[user] || [];
        const pContainer = document.getElementById('purchasesList');
        pContainer.innerHTML = '';
        if (myPurch.length === 0) { pContainer.textContent = 'Nu ai cumpărături înregistrate.'; }
        myPurch.slice().reverse().forEach(p => {
          const card = document.createElement('div');
          card.className = 'purchase-card';
          const h = document.createElement('h4'); h.textContent = 'Cumpărat: ' + new Date(p.timestamp).toLocaleString(); card.appendChild(h);
          const ul = document.createElement('ul');
          Object.keys(p.item||{}).forEach(k => { const li = document.createElement('li'); li.textContent = k + ': ' + (p.item[k]|| '-'); ul.appendChild(li); });
          card.appendChild(ul);
          pContainer.appendChild(card);
        });

        const subsJson = localStorage.getItem('vanzare_submissions');
        const subs = subsJson ? JSON.parse(subsJson) : {};
        const list = subs[user] || [];
        const container = document.getElementById('submissions');
        container.innerHTML = '';
        if (list.length === 0) {
          const otherUsers = Object.keys(subs).filter(k => k !== user && (subs[k]||[]).length > 0);
          if (otherUsers.length > 0) {
            container.textContent = 'Nu ai anunțuri puse la vânzare. Există înregistrări pentru alți utilizatori: ' + otherUsers.join(', ');
            if (debugEl) { debugEl.style.display = 'block'; debugEl.textContent = subsJson ? JSON.stringify(subs, null, 2) : 'Nici o înregistrare găsită.'; debugToggle.textContent = 'Ascunde debug'; }
          } else {
            container.textContent = 'Nu ai anunțuri puse la vânzare.';
          }
          return;
        }
        list.slice().reverse().forEach(entry => {
          const card = document.createElement('div');
          card.className = 'entry-card';
          const h = document.createElement('h4');
          h.textContent = 'Încărcare: ' + new Date(entry.timestamp).toLocaleString();
          card.appendChild(h);
          const ul = document.createElement('ul');
          Object.keys(entry.form||{}).forEach(k => {
            const li = document.createElement('li');
            if (k === 'credit') {
              li.textContent = 'Preț: ' + ((entry.form[k] || '-') && (entry.form[k] ? entry.form[k] + ' euro' : '-'));
            } else {
              li.textContent = k + ': ' + (entry.form[k] || '-');
            }
            ul.appendChild(li);
          });
          card.appendChild(ul);
          const imgs = document.createElement('div');
          imgs.className = 'entry-images';
          (entry.images||[]).forEach(src => {
            const img = document.createElement('img');
            img.src = src;
            imgs.appendChild(img);
          });
          card.appendChild(imgs);
          const del = document.createElement('button');
          del.className = 'entry-delete';
          del.textContent = 'Șterge această înregistrare';
          del.addEventListener('click', function(){
            if (!confirm('Ștergi înregistrarea?')) return;
            const all = subsJson ? JSON.parse(subsJson) : {};
            all[user] = (all[user]||[]).filter(s => s.id !== entry.id);
            localStorage.setItem('vanzare_submissions', JSON.stringify(all));
            loadSubs();
          });
          card.appendChild(del);
          container.appendChild(card);
        });
      }

      document.getElementById('backBtn').addEventListener('click', ()=> window.location.href='vanzare.html');
      document.getElementById('logoutBtn').addEventListener('click', ()=>{ localStorage.removeItem('vanzare_current_user'); window.location.href='vanzare.html'; });

      document.addEventListener('DOMContentLoaded', function(){ requireLogin(); loadSubs(); });
    