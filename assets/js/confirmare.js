      function getCurrentUser(){ return localStorage.getItem('vanzare_current_user'); }

      function savePendingToUserIfNeeded(){
        const pending = localStorage.getItem('vanzare_pending');
        const user = getCurrentUser();
        if (!pending || !user) return;
        const form = JSON.parse(localStorage.getItem('vanzare_form') || '{}');
        const images = JSON.parse(localStorage.getItem('vanzare_images') || '[]');
        const subsJson = localStorage.getItem('vanzare_submissions');
        const subs = subsJson ? JSON.parse(subsJson) : {};
        subs[user] = subs[user] || [];
        subs[user].push({ id: Date.now(), timestamp: new Date().toISOString(), form, images });
        localStorage.setItem('vanzare_submissions', JSON.stringify(subs));
        localStorage.removeItem('vanzare_pending');
      }

      function loadSavedImagesOnConfirm() {
        const saved = localStorage.getItem('vanzare_images');
        const container = document.getElementById('savedImages');
        if (!container) return;
        container.innerHTML = '';
        if (!saved) {
          container.textContent = 'Nu există imagini salvate.';
          return;
        }
        const arr = JSON.parse(saved);
        arr.forEach(src => {
          const img = document.createElement('img');
          img.src = src;
          img.style.maxWidth = '160px';
          img.style.margin = '8px';
          container.appendChild(img);
        });
      }

      function loadFormSummary() {
        const saved = localStorage.getItem('vanzare_form');
        const container = document.getElementById('formSummary');
        if (!container) return;
        container.innerHTML = '';
        if (!saved) {
          container.textContent = 'Nu există detalii salvate ale formularului.';
          return;
        }
        let data;
        try { data = JSON.parse(saved); } catch (e) { container.textContent = 'Date invalide.'; return; }
        const ul = document.createElement('ul');
        Object.keys(data).forEach(key => {
          const li = document.createElement('li');
          let label, value;
          if (key === 'credit') {
            label = 'Preț';
            value = data[key] ? data[key] + ' euro' : '-';
          } else {
            label = key.charAt(0).toUpperCase() + key.slice(1);
            value = data[key] || '-';
          }
          li.textContent = label + ': ' + value;
          ul.appendChild(li);
        });
        container.appendChild(ul);
      }

      document.addEventListener('DOMContentLoaded', function(){
        savePendingToUserIfNeeded();
        const user = getCurrentUser();
        const status = document.getElementById('userStatus');
        if (status) status.textContent = user ? 'Salvat pentru: ' + user : 'Trimis de un utilizator anonim.';

        loadSavedImagesOnConfirm();
        loadFormSummary();

        const clearBtn = document.getElementById('clearBtn');
        if (clearBtn) {
          clearBtn.addEventListener('click', function() {
            if (confirm('Sigur dorești să ștergi imaginile salvate?')) {
              localStorage.removeItem('vanzare_images');
              loadSavedImagesOnConfirm();
            }
          });
        }

        const editBtn = document.getElementById('editBtn');
        if (editBtn) {
          editBtn.addEventListener('click', function() {
            localStorage.setItem('vanzare_edit', '1');
            window.location.href = 'vanzare.html';
          });
        }

        const profileBtn = document.getElementById('profileBtn');
        if (profileBtn) {
          profileBtn.addEventListener('click', function(){
            window.location.href = 'profil.html';
          });
        }

        const backBtn = document.getElementById('backBtn');
        if (backBtn) {
          backBtn.addEventListener('click', function() {
            window.location.href = 'vanzare.html';
          });
        }
      });