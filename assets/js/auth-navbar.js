(function(){
  function getNextParam(){
    return encodeURIComponent(window.location.pathname + window.location.search);
  }

  function init(){
    const user = localStorage.getItem('vanzare_current_user');
    const navLogin = document.getElementById('navLogin');
    const navProfile = document.getElementById('navProfile');
    const profileName = document.getElementById('profileName');
    const navLogout = document.getElementById('navLogout');

    if (navLogin) {
      const a = navLogin.querySelector('a');
      if (a) {
        a.href = 'login.html?next=' + getNextParam();
        a.textContent = 'Logare';
      }
    }

    if (user) {
      if (navLogin) navLogin.style.display = 'none';
      if (navProfile) {
        navProfile.style.display = 'inline-flex';
        if (profileName) {
          profileName.textContent = user;
          profileName.setAttribute('title', 'Accesează profilul');
          profileName.setAttribute('role', 'button');
          profileName.tabIndex = 0;
          profileName.onclick = () => { window.location.href = 'profil.html'; };
          profileName.addEventListener('keydown', (ev) => { if (ev.key === 'Enter') window.location.href = 'profil.html'; });
        }
      }
    } else {
      if (navLogin) navLogin.style.display = 'inline-flex';
      if (navProfile) {
        navProfile.style.display = 'none';
        if (profileName) {
          profileName.onclick = null;
          profileName.removeAttribute('title');
          profileName.removeAttribute('role');
          profileName.tabIndex = -1;
        }
      }
    }

    if (navLogout) {
      navLogout.addEventListener('click', function(e){
        e.preventDefault();
        if (!confirm('Sigur dorești să te deconectezi?')) return;
        localStorage.removeItem('vanzare_current_user');
        try { localStorage.setItem('vanzare_last_logout', Date.now().toString()); } catch(e){}
        window.location.reload();
      });
    }

    const menuToggle = document.querySelector('.menu-toggle');
    const navUl = document.querySelector('.navbar ul');
    if (menuToggle && navUl) {
      menuToggle.setAttribute('role', 'button');
      menuToggle.tabIndex = 0;
      menuToggle.addEventListener('click', function(e){
        navUl.classList.toggle('active');
        menuToggle.classList.toggle('open');
      });
      menuToggle.addEventListener('keydown', function(e){
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navUl.classList.toggle('active'); menuToggle.classList.toggle('open'); }
      });
      document.addEventListener('click', function(e){
        if (!menuToggle.contains(e.target) && !navUl.contains(e.target)) {
          navUl.classList.remove('active');
        }
      });
      window.addEventListener('resize', function(){
        if (window.innerWidth > 768) navUl.classList.remove('active');
      });
    }
  }

  document.addEventListener('DOMContentLoaded', init);
  if (document.readyState !== 'loading') init();

  window.addEventListener('storage', function(e){
    if (e.key === 'vanzare_current_user' || e.key === 'vanzare_last_logout') init();
  });
})();