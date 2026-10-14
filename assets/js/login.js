function qs(name){
        const p = new URLSearchParams(window.location.search);
        return p.get(name);
      }

      function loadUsers(){
        const raw = localStorage.getItem('vanzare_users');
        return raw ? JSON.parse(raw) : {};
      }
      function saveUsers(u){ localStorage.setItem('vanzare_users', JSON.stringify(u)); }
      function setCurrentUser(u){ localStorage.setItem('vanzare_current_user', u); }

      function handleLogin(){
        const user = document.getElementById('loginUser').value.trim();
        const pass = document.getElementById('loginPass').value;
        console.log('Attempt login for', user);
        const users = loadUsers();
        if (!users[user] || users[user] !== pass){
          document.getElementById('msg').textContent = 'Username sau parolă incorectă.'; return;
        }
        setCurrentUser(user);
        const pending = localStorage.getItem('vanzare_pending');
        if (pending) {
          const form = JSON.parse(localStorage.getItem('vanzare_form') || '{}');
          const images = JSON.parse(localStorage.getItem('vanzare_images') || '[]');
          const subsJson = localStorage.getItem('vanzare_submissions');
          const subs = subsJson ? JSON.parse(subsJson) : {};
          subs[user] = subs[user] || [];
          subs[user].push({ id: Date.now(), timestamp: new Date().toISOString(), form, images });
          localStorage.setItem('vanzare_submissions', JSON.stringify(subs));
          localStorage.removeItem('vanzare_pending');
        }
        const next = qs('next') || 'vanzare.html';
        window.location.href = next;
      }

      function handleRegister(){
        const user = document.getElementById('regUser').value.trim();
        const pass = document.getElementById('regPass').value;
        console.log('Attempt register for', user);
        if (!user || !pass){ document.getElementById('msg').textContent = 'Completează ambele câmpuri.'; return; }
        const users = loadUsers();
        if (users[user]){ document.getElementById('msg').textContent = 'Username deja folosit.'; return; }
        users[user] = pass;
        saveUsers(users);
        setCurrentUser(user);
        const pending = localStorage.getItem('vanzare_pending');
        if (pending) {
          const form = JSON.parse(localStorage.getItem('vanzare_form') || '{}');
          const images = JSON.parse(localStorage.getItem('vanzare_images') || '[]');
          const subsJson = localStorage.getItem('vanzare_submissions');
          const subs = subsJson ? JSON.parse(subsJson) : {};
          subs[user] = subs[user] || [];
          subs[user].push({ id: Date.now(), timestamp: new Date().toISOString(), form, images });
          localStorage.setItem('vanzare_submissions', JSON.stringify(subs));
          localStorage.removeItem('vanzare_pending');
        }
        const next = qs('next') || 'vanzare.html';
        window.location.href = next;
      }

      document.addEventListener('DOMContentLoaded', function(){
        const loginBtn = document.getElementById('loginBtn');
        const regBtn = document.getElementById('regBtn');
        if (loginBtn) loginBtn.addEventListener('click', handleLogin); else console.warn('loginBtn not found');
        if (regBtn) regBtn.addEventListener('click', handleRegister); else console.warn('regBtn not found');

        const current = localStorage.getItem('vanzare_current_user');
        const statusEl = document.getElementById('loginStatus');
        if (current) {
          const nextParam = qs('next');
          if (nextParam) {
            window.location.href = nextParam;
          } else if (statusEl) {
            statusEl.textContent = '';
            const span = document.createElement('span');
            span.textContent = 'Sunteți deja conectat ca: ' + current + ' ';
            const btn = document.createElement('button');
            btn.textContent = 'Deconectare';
            btn.addEventListener('click', function(){ localStorage.removeItem('vanzare_current_user'); statusEl.textContent = 'Ați fost deconectat.'; });
            statusEl.appendChild(span);
            statusEl.appendChild(btn);
          }
        }
      });